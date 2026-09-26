import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  ROOT,ensureRoot,listProjects,getProject,createProject,importGitProject,listBranches,createBranch,
  listCommits,listFiles,readFileAtRef,writeFileAndCommit,getStatus,
  listIssues,createIssue,updateIssue,listPullRequests,createPullRequest,mergePullRequest,
  compareRefs,listTags,createTag,listReleases,createRelease,saveProjectArtifact,
  searchProject,getProjectActivity,createProjectBundle
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

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/search$/);
    if(method==='GET'&&m)return send(res,200,{ok:true,...await searchProject(dec(m[1]),{
      query:url.searchParams.get('q'),
      ref:url.searchParams.get('ref')||'HEAD',
      limit:url.searchParams.get('limit')||100
    })});

    m=url.pathname.match(/^\/v1\/projects\/([^/]+)\/export$/);
    if(method==='POST'&&m){
      const input=await body(req);
      return send(res,201,{ok:true,export:await createProjectBundle(dec(m[1]),{ref:input.ref||'--all'})});
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
