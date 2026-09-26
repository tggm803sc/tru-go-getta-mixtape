import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT=path.resolve(process.env.TGG_HIGGSFIELD_ROOT||'/data/tgg-higgsfield');
const PORT=Number(process.env.TGG_HIGGSFIELD_PORT||10130);
const HOST=process.env.TGG_HIGGSFIELD_HOST||'0.0.0.0';
const TOKEN=String(process.env.TGG_HIGGSFIELD_TOKEN||'').trim();
const BACKEND=String(process.env.TGG_HIGGSFIELD_BACKEND_URL||'').trim().replace(/\/$/,'');
const BACKEND_TOKEN=String(process.env.TGG_HIGGSFIELD_BACKEND_TOKEN||'').trim();
const PROJECTS_URL=String(process.env.TGG_PROJECTS_URL||'http://127.0.0.1:10110').trim().replace(/\/$/,'');
const PROJECTS_TOKEN=String(process.env.TGG_PROJECTS_TOKEN||'').trim();
const PRESETS_FILE=path.resolve(process.env.TGG_HIGGSFIELD_PRESETS_FILE||path.join(process.cwd(),'tgg-higgsfield','presets.json'));
const WORKSPACE_FILE=path.resolve(process.env.TGG_HIGGSFIELD_WORKSPACE_FILE||path.join(process.cwd(),'tgg-higgsfield','workspace.json'));

await fs.mkdir(path.join(ROOT,'jobs'),{recursive:true});

const id=()=>crypto.randomBytes(12).toString('hex');
const jobFile=jobId=>path.join(ROOT,'jobs',jobId+'.json');
async function readJob(jobId){
  if(!/^[a-f0-9]{24}$/.test(jobId))throw new Error('invalid_job_id');
  try{return JSON.parse(await fs.readFile(jobFile(jobId),'utf8'))}catch{throw new Error('job_not_found')}
}
async function writeJob(job){
  const file=jobFile(job.id),tmp=file+'.tmp-'+process.pid;
  await fs.writeFile(tmp,JSON.stringify(job,null,2)+'\n',{mode:0o600});
  await fs.rename(tmp,file);
}
async function persistProjectJob(job,{event='update'}={}){
  const projectId=String(job.project_id||'').trim();
  if(!projectId)return {ok:false,error:'project_id_missing'};
  try{
    const file='.tgg/higgsfield/jobs/'+job.id+'.json';
    const response=await fetch(
      PROJECTS_URL+'/v1/projects/'+encodeURIComponent(projectId)+'/artifacts/'+file.split('/').map(encodeURIComponent).join('/'),
      {
        method:'PUT',
        headers:{
          'content-type':'application/json',
          ...(PROJECTS_TOKEN?{authorization:'Bearer '+PROJECTS_TOKEN}:{})
        },
        body:JSON.stringify({
          content:JSON.stringify(job,null,2)+'\n',
          message:'TGG Higgsfield '+event+' '+job.id
        }),
        signal:AbortSignal.timeout(30000)
      }
    );
    const text=await response.text();
    let body={};try{body=text?JSON.parse(text):{}}catch{}
    if(!response.ok||body?.ok!==true)throw new Error(body?.error||('projects_http_'+response.status));
    return {ok:true,project_id:projectId,path:file,head:body?.project?.head||null};
  }catch(error){
    return {ok:false,project_id:projectId,error:String(error?.message||error)};
  }
}
async function loadWorkspace(){
  try{return JSON.parse(await fs.readFile(WORKSPACE_FILE,'utf8'))}
  catch{return {id:'tgg-higgsfield',owner:'TGG',capabilities:[],pipelines:[]}}
}
async function loadPresets(){
  try{
    const data=JSON.parse(await fs.readFile(PRESETS_FILE,'utf8'));
    return Array.isArray(data?.presets)?data.presets:[];
  }catch{return []}
}
async function getPreset(id){
  const presets=await loadPresets();
  return presets.find(x=>String(x.id||'')===String(id||''))||null;
}
async function listJobs(){
  const names=await fs.readdir(path.join(ROOT,'jobs')).catch(()=>[]);
  const jobs=[];
  for(const name of names.filter(x=>x.endsWith('.json')).sort().reverse()){
    try{jobs.push(JSON.parse(await fs.readFile(path.join(ROOT,'jobs',name),'utf8')))}catch{}
  }
  return jobs.sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
}
function auth(req){return !TOKEN||String(req.headers.authorization||'')==='Bearer '+TOKEN}
async function jsonBody(req){
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8*1024*1024)throw new Error('body_too_large')}
  if(!raw)return {};try{return JSON.parse(raw)}catch{throw new Error('invalid_json')}
}
function send(res,status,body){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(body,null,2))}
async function cancelJob(job){
  if(['completed','failed','cancelled'].includes(job.status))return job;
  if(BACKEND&&job.remote){
    try{
      await fetch(BACKEND+'/v1/jobs/'+encodeURIComponent(job.id)+'/cancel',{
        method:'POST',
        headers:{...(BACKEND_TOKEN?{authorization:'Bearer '+BACKEND_TOKEN}:{})},
        signal:AbortSignal.timeout(30000)
      });
    }catch{}
  }
  job.status='cancelled';
  job.cancelled_at=new Date().toISOString();
  job.updated_at=job.cancelled_at;
  await writeJob(job);
  job.project_save=await persistProjectJob(job,{event:'cancelled'});
  await writeJob(job);
  return job;
}
async function recordResult(job,input){
  const next=String(input.status||'completed');
  if(!['completed','failed'].includes(next))throw new Error('invalid_result_status');
  job.status=next;
  job.result=input.result??null;
  job.error=next==='failed'?String(input.error||'generation_failed'):null;
  job.completed_at=new Date().toISOString();
  job.updated_at=job.completed_at;
  await writeJob(job);
  job.project_save=await persistProjectJob(job,{event:next});
  await writeJob(job);
  return job;
}
async function dispatch(job){
  if(!BACKEND){
    job.status='queued-local';
    job.updated_at=new Date().toISOString();
    await writeJob(job);
    job.project_save=await persistProjectJob(job,{event:'queued'});
    await writeJob(job);
    return job;
  }
  const response=await fetch(BACKEND+'/v1/jobs',{
    method:'POST',
    headers:{'content-type':'application/json',...(BACKEND_TOKEN?{authorization:'Bearer '+BACKEND_TOKEN}:{})},
    body:JSON.stringify({
      id:job.id,
      type:job.type,
      preset_id:job.preset_id,
      prompt:job.prompt,
      input:job.input,
      options:job.options,
      context:job.context,
      project_id:job.project_id
    }),
    signal:AbortSignal.timeout(120000)
  });
  const text=await response.text();
  let remote={};try{remote=text?JSON.parse(text):{}}catch{}
  if(!response.ok)throw new Error(remote.error||('backend_http_'+response.status));
  job.status='submitted';
  job.remote=remote;
  job.updated_at=new Date().toISOString();
  await writeJob(job);
  job.project_save=await persistProjectJob(job,{event:'submitted'});
  await writeJob(job);
  return job;
}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://tgg.local');
  try{
    if(req.method==='GET'&&url.pathname==='/health'){
      const workspace=await loadWorkspace();
      return send(res,200,{ok:true,service:'tgg-higgsfield',owner:'TGG',workspace:workspace.id||'tgg-higgsfield',capabilities:workspace.capabilities||[],mode:BACKEND?'backend':'local-queue',projects_url:PROJECTS_URL,project_persistence:true,time:new Date().toISOString()});
    }
    if(url.pathname.startsWith('/v1/')&&req.method!=='GET'&&!auth(req))return send(res,401,{ok:false,error:'unauthorized'});
    if(req.method==='GET'&&url.pathname==='/v1/capabilities'){
      const workspace=await loadWorkspace();
      return send(res,200,{ok:true,owner:'TGG',service:'tgg-higgsfield',workspace});
    }
    if(req.method==='GET'&&url.pathname==='/v1/presets'){
      return send(res,200,{ok:true,owner:'TGG',service:'tgg-higgsfield',presets:await loadPresets()});
    }
    if(req.method==='GET'&&url.pathname==='/v1/jobs'){
      const projectId=String(url.searchParams.get('project_id')||'').trim();
      const jobs=await listJobs();
      return send(res,200,{ok:true,jobs:projectId?jobs.filter(job=>String(job.project_id||'')===projectId):jobs});
    }
    if(req.method==='POST'&&url.pathname==='/v1/jobs'){
      const input=await jsonBody(req);
      const presetId=String(input.preset_id||'').trim();
      const preset=presetId?await getPreset(presetId):null;
      if(presetId&&!preset)throw new Error('preset_not_found');
      const type=String(input.type||preset?.type||'image').trim();
      if(!['image','video','vfx','avatar','world-shot','ad-variant'].includes(type))throw new Error('unsupported_job_type');
      const job={
        id:id(),owner:'TGG',service:'tgg-higgsfield',workspace_id:'tgg-higgsfield',status:'created',
        type,project_id:String(input.project_id||'tgg-world'),
        preset_id:preset?.id||null,
        preset_name:preset?.name||null,
        prompt:String(input.prompt||'').slice(0,20000),
        input:input.input||null,
        options:{...(preset?.defaults||{}),...(input.options||{})},
        context:input.context||{},
        created_at:new Date().toISOString(),updated_at:new Date().toISOString()
      };
      await writeJob(job);
      const dispatched=await dispatch(job);
      return send(res,202,{ok:true,job:dispatched});
    }
    let m=url.pathname.match(/^\/v1\/jobs\/([a-f0-9]{24})$/);
    if(req.method==='GET'&&m)return send(res,200,{ok:true,job:await readJob(m[1])});

    m=url.pathname.match(/^\/v1\/jobs\/([a-f0-9]{24})\/cancel$/);
    if(req.method==='POST'&&m){
      if(!auth(req))return send(res,401,{ok:false,error:'unauthorized'});
      return send(res,200,{ok:true,job:await cancelJob(await readJob(m[1]))});
    }

    m=url.pathname.match(/^\/v1\/jobs\/([a-f0-9]{24})\/result$/);
    if(req.method==='POST'&&m){
      if(!auth(req))return send(res,401,{ok:false,error:'unauthorized'});
      const input=await jsonBody(req);
      return send(res,200,{ok:true,job:await recordResult(await readJob(m[1]),input)});
    }
    return send(res,404,{ok:false,error:'not_found'});
  }catch(error){
    const message=String(error?.message||error);
    const status=/not_found/.test(message)?404:/unsupported|invalid|required/.test(message)?400:500;
    return send(res,status,{ok:false,error:message});
  }
});
server.listen(PORT,HOST,()=>console.log(JSON.stringify({ok:true,service:'tgg-higgsfield',owner:'TGG',host:HOST,port:PORT,mode:BACKEND?'backend':'local-queue'},null,2)));
