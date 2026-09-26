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
function auth(req){return !TOKEN||String(req.headers.authorization||'')==='Bearer '+TOKEN}
async function jsonBody(req){
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8*1024*1024)throw new Error('body_too_large')}
  if(!raw)return {};try{return JSON.parse(raw)}catch{throw new Error('invalid_json')}
}
function send(res,status,body){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(body,null,2))}
async function dispatch(job){
  if(!BACKEND){
    job.status='queued-local';
    job.updated_at=new Date().toISOString();
    await writeJob(job);
    return job;
  }
  const response=await fetch(BACKEND+'/v1/jobs',{
    method:'POST',
    headers:{'content-type':'application/json',...(BACKEND_TOKEN?{authorization:'Bearer '+BACKEND_TOKEN}:{})},
    body:JSON.stringify({
      id:job.id,
      type:job.type,
      prompt:job.prompt,
      input:job.input,
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
  return job;
}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://tgg.local');
  try{
    if(req.method==='GET'&&url.pathname==='/health')return send(res,200,{ok:true,service:'tgg-higgsfield',owner:'TGG',mode:BACKEND?'backend':'local-queue',time:new Date().toISOString()});
    if(url.pathname.startsWith('/v1/')&&req.method!=='GET'&&!auth(req))return send(res,401,{ok:false,error:'unauthorized'});
    if(req.method==='POST'&&url.pathname==='/v1/jobs'){
      const input=await jsonBody(req);
      const type=String(input.type||'image').trim();
      if(!['image','video','vfx','avatar','world-shot','ad-variant'].includes(type))throw new Error('unsupported_job_type');
      const job={
        id:id(),owner:'TGG',service:'tgg-higgsfield',status:'created',
        type,project_id:String(input.project_id||'tgg-world'),
        prompt:String(input.prompt||'').slice(0,20000),
        input:input.input||null,
        context:input.context||{},
        created_at:new Date().toISOString(),updated_at:new Date().toISOString()
      };
      await writeJob(job);
      return send(res,202,{ok:true,job:await dispatch(job)});
    }
    const m=url.pathname.match(/^\/v1\/jobs\/([a-f0-9]{24})$/);
    if(req.method==='GET'&&m)return send(res,200,{ok:true,job:await readJob(m[1])});
    if(req.method==='POST'&&m&&url.pathname.endsWith('/cancel'))return send(res,404,{ok:false,error:'not_found'});
    return send(res,404,{ok:false,error:'not_found'});
  }catch(error){
    const message=String(error?.message||error);
    const status=/not_found/.test(message)?404:/unsupported|invalid|required/.test(message)?400:500;
    return send(res,status,{ok:false,error:message});
  }
});
server.listen(PORT,HOST,()=>console.log(JSON.stringify({ok:true,service:'tgg-higgsfield',owner:'TGG',host:HOST,port:PORT,mode:BACKEND?'backend':'local-queue'},null,2)));
