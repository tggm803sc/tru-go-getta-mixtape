import http from 'node:http';
import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {
  ROOT,ensureRoot,listProjects,getProject,createProject,importGitProject,listBranches,createBranch,
  listCommits,listFiles,readFileAtRef,writeFileAndCommit,getStatus,
  listIssues,createIssue,updateIssue,listPullRequests,createPullRequest,mergePullRequest,
  compareRefs,listTags,createTag,listReleases,createRelease,saveProjectArtifact,
  searchProject,getProjectActivity,createProjectBundle,listActions,runProjectAction,
  projectExists,syncProjectWorktree,configureProjectGitServer
} from './store.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.TGG_PROJECTS_PORT||10110);
const HOST=process.env.TGG_PROJECTS_HOST||'0.0.0.0';
const TOKEN=String(process.env.TGG_PROJECTS_TOKEN||'').trim();
const HIGGSFIELD_URL=String(process.env.TGG_HIGGSFIELD_URL||'http://127.0.0.1:10130').trim().replace(/\/$/,'');
const HIGGSFIELD_TOKEN=String(process.env.TGG_HIGGSFIELD_TOKEN||'').trim();

function send(res,status,body,headers={}){
  const data=typeof body==='string'?body:JSON.stringify(body,null,2);
  res.writeHead(status,{'content-type':typeof body==='string'?'text/plain; charset=utf-8':'application/json; charset=utf-8','cache-control':'no-store',...headers});
  res.end(data);
}
function auth(req){
  if(!TOKEN)return true;
  const value=String(req.headers.authorization||'');
  return value==='Bearer '+TOKEN;
}
function gitAuth(req){
  if(!TOKEN)return true;
  const value=String(req.headers.authorization||'');
  if(value==='Bearer '+TOKEN)return true;
  if(value.startsWith('Basic ')){
    try{
      const raw=Buffer.from(value.slice(6),'base64').toString('utf8');
      const i=raw.indexOf(':');
      const user=i>=0?raw.slice(0,i):raw;
      const pass=i>=0?raw.slice(i+1):'';
      return pass===TOKEN||user===TOKEN;
    }catch{return false}
  }
  return false;
}
async function body(req){
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>4*1024*1024)throw new Error('body_too_large')}
  if(!raw)return {};
  try{return JSON.parse(raw)}catch{throw new Error('invalid_json')}
}
const dec=v=>decodeURIComponent(String(v||''));
function errorStatus(message){
  if(/not_found/.test(message))return 404;
  if(/exists/.test(message))return 409;
  if(/invalid|required/.test(message))return 400;
  return 500;
}
async function gitSmartHttp(req,res,url){
  const match=url.pathname.match(/^\/git\/([^/]+)\.git(?:\/(.*))?$/);
  if(!match)return false;
  const projectId=dec(match[1]);
  if(!(await projectExists(projectId))){
    send(res,404,{ok:false,error:'project_not_found'});
    return true;
  }
  await configureProjectGitServer(projectId);
  if(TOKEN&&!gitAuth(req)){
    res.writeHead(401,{'www-authenticate':'Basic realm="TGG Source"','cache-control':'no-store'});
    res.end('Authentication required');
    return true;
  }

  const rest=String(match[2]||'');
  const isReceive=req.method==='POST'&&rest==='git-receive-pack';
  if(isReceive){
    const project=await getProject(projectId);
    if(project.dirty){
      send(res,409,{ok:false,error:'project_dirty_git_receive_blocked'});
      return true;
    }
  }

  const child=spawn('git',['http-backend'],{
    env:{
      ...process.env,
      GIT_PROJECT_ROOT:ROOT,
      GIT_HTTP_EXPORT_ALL:'1',
      PATH_INFO:'/'+projectId+'/.git/'+rest,
      REQUEST_METHOD:String(req.method||'GET'),
      QUERY_STRING:url.searchParams.toString(),
      CONTENT_TYPE:String(req.headers['content-type']||''),
      CONTENT_LENGTH:String(req.headers['content-length']||''),
      REMOTE_USER:'TGG',
      REMOTE_ADDR:String(req.socket?.remoteAddress||''),
      HTTP_GIT_PROTOCOL:String(req.headers['git-protocol']||'')
    },
    stdio:['pipe','pipe','pipe']
  });

  const out=[],err=[];
  child.stdout.on('data',chunk=>out.push(chunk));
  child.stderr.on('data',chunk=>err.push(chunk));
  req.pipe(child.stdin);

  const code=await new Promise((resolve,reject)=>{
    child.on('error',reject);
    child.on('close',resolve);
  });

  const raw=Buffer.concat(out);
  let split=raw.indexOf(Buffer.from('\r\n\r\n'));
  let sep=4;
  if(split<0){split=raw.indexOf(Buffer.from('\n\n'));sep=2}
  if(split<0){
    send(res,500,{ok:false,error:'git_http_backend_invalid_response',detail:Buffer.concat(err).toString('utf8').slice(-2000)});
    return true;
  }

  const headerText=raw.subarray(0,split).toString('utf8');
  const payload=raw.subarray(split+sep);
  let status=code===0?200:500;
  const headers={'cache-control':'no-store'};
  for(const line of headerText.split(/\r?\n/)){
    const i=line.indexOf(':');
    if(i<0)continue;
    const key=line.slice(0,i).trim();
    const value=line.slice(i+1).trim();
    if(key.toLowerCase()==='status'){
      const parsed=Number(value.split(' ')[0]);
      if(Number.isInteger(parsed))status=parsed;
    }else headers[key]=value;
  }

  if(isReceive&&code===0&&status<400){
    try{await syncProjectWorktree(projectId)}
    catch(error){
      send(res,409,{ok:false,error:String(error?.message||error)});
      return true;
    }
  }

  res.writeHead(status,headers);
  res.end(payload);
  return true;
}

async function higgsfieldProxy(req,res,url){
  const target=url.pathname.replace(/^\/v1\/higgsfield/,'/v1')+url.search;
  const method=req.method||'GET';
  let payload=null;
  if(!['GET','HEAD'].includes(method))payload=await body(req);
  const response=await fetch(HIGGSFIELD_URL+target,{
    method,
    headers:{
      ...(payload!==null?{'content-type':'application/json'}:{}),
      ...(HIGGSFIELD_TOKEN?{authorization:'Bearer '+HIGGSFIELD_TOKEN}:{})
    },
    ...(payload!==null?{body:JSON.stringify(payload)}:{}),
    signal:AbortSignal.timeout(120000)
  });
  const text=await response.text();
  let result;try{result=text?JSON.parse(text):{}}catch{result={ok:false,error:'invalid_higgsfield_response'}}
  return send(res,response.status,result);
}
async function dashboard(res){
  const html=await fs.readFile(path.join(HERE,'dashboard.html'),'utf8');
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});
  res.end(html);
}

await ensureRoot();

const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://tgg.local');
  const method=req.method||'GET';
  try{
    if(method==='GET'&&url.pathname==='/health'){
      return send(res,200,{ok:true,service:'tgg-projects',owner:'TGG',storage_root:ROOT,auth_required:Boolean(TOKEN),time:new Date().toISOString()});
    }
    if(method==='GET'&&(url.pathname==='/'||url.pathname==='/app'))return dashboard(res);
    if(url.pathname.startsWith('/git/')&&await gitSmartHttp(req,res,url))return;
    if(url.pathname.startsWith('/v1/')&&method!=='GET'&&!auth(req))return send(res,401,{ok:false,error:'unauthorized'});
    if(url.pathname==='/v1/higgsfield'||url.pathname.startsWith('/v1/higgsfield/')){
      return higgsfieldProxy(req,res,url);
    }

    if(method==='GET'&&url.pathname==='/v1/projects'){
      return send(res,200,{ok:true,projects:await listProjects()});
    }
    if(method==='POST'&&url.pathname==='/v1/projects'){
      const input=await body(req);
      return send(res,201,{ok:true,project:await createProject(input)});
    }
    if(method==='POST'&&url.pathname==='/v1/import'){
      const input=await body(req);
      return send(res,201,{ok:true,project:await importGitProject(input)});
    }

    let m=url.pathname.match(/^\/v1\/projects\/([^/]+)$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,project:await getProject(dec(m[1]))});

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/status$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,status:await getStatus(dec(m[1]))});

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/branches$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,branches:await listBranches(dec(m[1]))});
    if(method==='POST'&&m){
      const input=await body(req);
      return send(res,201,{ok:true,branches:await createBranch(dec(m[1]),input.name,{from:input.from||'HEAD'})});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/commits$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,commits:await listCommits(dec(m[1]),{limit:url.searchParams.get('limit')||50})});

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/activity$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,activity:await getProjectActivity(dec(m[1]),{limit:url.searchParams.get('limit')||100})});

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/actions$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,actions:await listActions(dec(m[1]))});
    if(method==='POST'&&m){
      const input=await body(req);
      return send(res,202,{ok:true,action:await runProjectAction(dec(m[1]),input)});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/search$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,...await searchProject(dec(m[1]),{
      query:url.searchParams.get('q'),
      ref:url.searchParams.get('ref')||'HEAD',
      limit:url.searchParams.get('limit')||100
    })});

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/export$/);
    if(method==='POST'&&m){
      const input=await body(req);
      const projectId=dec(m[1]);
      const exported=await createProjectBundle(projectId,{ref:input.ref||'--all'});
      const bundle=path.basename(exported.file);
      const publicExport={...exported,bundle,download_url:'/v1/projects/'+encodeURIComponent(projectId)+'/export/'+encodeURIComponent(bundle)};
      delete publicExport.file;
      return send(res,201,{ok:true,export:publicExport});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/export\/([^/]+\.bundle)$/);
    if(method==='GET'&&m){
      if(TOKEN&&!auth(req))return send(res,401,{ok:false,error:'unauthorized'});
      const projectId=dec(m[1]);
      const bundle=dec(m[2]);
      if(!bundle.startsWith(projectId+'-')||path.basename(bundle)!==bundle)throw new Error('invalid_export_bundle');
      const exportRoot=path.resolve(process.env.TGG_PROJECTS_EXPORT_ROOT||'/data/tgg-project-exports');
      const file=path.join(exportRoot,bundle);
      const stat=await fs.stat(file).catch(()=>null);
      if(!stat?.isFile())throw new Error('export_not_found');
      res.writeHead(200,{
        'content-type':'application/octet-stream',
        'content-length':String(stat.size),
        'content-disposition':'attachment; filename="'+bundle.replace(/"/g,'')+'"',
        'cache-control':'no-store'
      });
      createReadStream(file).pipe(res);
      return;
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/issues$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,issues:await listIssues(dec(m[1]))});
    if(method==='POST'&&m){
      const input=await body(req);
      return send(res,201,{ok:true,issue:await createIssue(dec(m[1]),input)});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/issues\/([^/]+)$/);
    if(method==='PATCH'&&m){
      const input=await body(req);
      return send(res,200,{ok:true,issue:await updateIssue(dec(m[1]),dec(m[2]),input)});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/pull-requests$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,pull_requests:await listPullRequests(dec(m[1]))});
    if(method==='POST'&&m){
      const input=await body(req);
      return send(res,201,{ok:true,pull_request:await createPullRequest(dec(m[1]),input)});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/pull-requests\/([^/]+)\/merge$/);
    if(method==='POST'&&m){
      const input=await body(req);
      return send(res,200,{ok:true,pull_request:await mergePullRequest(dec(m[1]),dec(m[2]),input)});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/compare$/);
    if(method==='GET'&&m){
      return send(res,200,{ok:true,comparison:await compareRefs(dec(m[1]),{
        base:url.searchParams.get('base'),
        head:url.searchParams.get('head')
      })});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/tags$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,tags:await listTags(dec(m[1]))});
    if(method==='POST'&&m){
      const input=await body(req);
      return send(res,201,{ok:true,tags:await createTag(dec(m[1]),input)});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/releases$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,releases:await listReleases(dec(m[1]))});
    if(method==='POST'&&m){
      const input=await body(req);
      return send(res,201,{ok:true,release:await createRelease(dec(m[1]),input)});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/artifacts\/(.+)$/);
    if(method==='PUT'&&m){
      const input=await body(req);
      const result=await saveProjectArtifact(dec(m[1]),dec(m[2]),input.content??input,{
        message:input.message||('Save TGG artifact '+dec(m[2]))
      });
      return send(res,200,{ok:true,...result});
    }

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/files$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,files:await listFiles(dec(m[1]),{ref:url.searchParams.get('ref')||'HEAD'})});

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/file\/(.+)$/);
    if(method==='GET'&&m){
      const result=await readFileAtRef(dec(m[1]),dec(m[2]),{ref:url.searchParams.get('ref')||'HEAD'});
      return send(res,200,{ok:true,...result});
    }
    if(method==='PUT'&&m){
      const input=await body(req);
      const result=await writeFileAndCommit(dec(m[1]),dec(m[2]),input.content,{
        message:input.message||'Update '+dec(m[2]),
        branch:input.branch||null
      });
      return send(res,200,{ok:true,...result});
    }

    return send(res,404,{ok:false,error:'not_found'});
  }catch(error){
    const message=String(error?.message||error);
    return send(res,errorStatus(message),{ok:false,error:message});
  }
});

server.listen(PORT,HOST,()=>{
  console.log(JSON.stringify({ok:true,service:'tgg-projects',owner:'TGG',host:HOST,port:PORT,storage_root:ROOT,auth_required:Boolean(TOKEN)},null,2));
});
