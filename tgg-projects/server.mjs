import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  ROOT,ensureRoot,listProjects,getProject,createProject,importGitProject,listBranches,createBranch,
  listCommits,listFiles,readFileAtRef,writeFileAndCommit,getStatus
} from './store.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.TGG_PROJECTS_PORT||10110);
const HOST=process.env.TGG_PROJECTS_HOST||'0.0.0.0';
const TOKEN=String(process.env.TGG_PROJECTS_TOKEN||'').trim();

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
