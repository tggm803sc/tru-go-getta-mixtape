import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const execFileAsync=promisify(execFile);
export const ROOT=path.resolve(process.env.TGG_PROJECTS_ROOT||'/data/tgg-projects');

function safeId(value){
  const id=String(value||'').trim().toLowerCase();
  if(!/^[a-z0-9][a-z0-9._-]{1,80}$/.test(id))throw new Error('invalid_project_id');
  return id;
}
function safeRef(value){
  const ref=String(value||'').trim();
  if(!/^[A-Za-z0-9._\/-]{1,120}$/.test(ref)||ref.includes('..')||ref.startsWith('/'))throw new Error('invalid_ref');
  return ref;
}
function safeRelative(value){
  const rel=String(value||'').replace(/\\/g,'/').replace(/^\/+/, '');
  const normalized=path.posix.normalize(rel);
  if(!normalized||normalized==='.'||normalized.startsWith('../')||normalized.includes('/../'))throw new Error('invalid_path');
  return normalized;
}
async function git(cwd,args,{allowFailure=false}={}){
  try{
    const {stdout='',stderr=''}=await execFileAsync('git',args,{cwd,env:{...process.env,GIT_TERMINAL_PROMPT:'0'},maxBuffer:16*1024*1024});
    return {ok:true,stdout:String(stdout).trim(),stderr:String(stderr).trim()};
  }catch(error){
    if(allowFailure)return {ok:false,stdout:String(error?.stdout||'').trim(),stderr:String(error?.stderr||error?.message||'').trim()};
    throw error;
  }
}
export function projectDir(id){return path.join(ROOT,safeId(id))}
export async function ensureRoot(){await fs.mkdir(ROOT,{recursive:true})}
export async function projectExists(id){
  try{return (await fs.stat(path.join(projectDir(id),'.git'))).isDirectory()}catch{return false}
}
export async function createProject({id,name,description='',default_branch='main'}){
  await ensureRoot();
  id=safeId(id);default_branch=safeRef(default_branch);
  const dir=projectDir(id);
  if(await projectExists(id))throw new Error('project_exists');
  await fs.mkdir(dir,{recursive:true});
  await git(dir,['init','-b',default_branch]);
  await git(dir,['config','user.name',process.env.TGG_GIT_USER_NAME||'TGG']);
  await git(dir,['config','user.email',process.env.TGG_GIT_USER_EMAIL||'tgg@local']);
  const meta={schema:'tgg.project/v1',id,name:String(name||id),description:String(description||''),default_branch,owner:'TGG',created_at:new Date().toISOString()};
  await fs.writeFile(path.join(dir,'tgg-project.json'),JSON.stringify(meta,null,2)+'\n',{mode:0o600});
  await fs.writeFile(path.join(dir,'README.md'),'# '+meta.name+'\n\n'+meta.description+'\n');
  await git(dir,['add','.']);
  await git(dir,['commit','-m','TGG project created']);
  return getProject(id);
}
export async function listProjects(){
  await ensureRoot();
  const names=await fs.readdir(ROOT).catch(()=>[]);
  const out=[];
  for(const id of names){
    if(await projectExists(id)){
      try{out.push(await getProject(id))}catch{}
    }
  }
  return out.sort((a,b)=>a.id.localeCompare(b.id));
}
export async function getProject(id){
  id=safeId(id);const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  let meta={id,name:id,owner:'TGG'};
  try{meta={...meta,...JSON.parse(await fs.readFile(path.join(dir,'tgg-project.json'),'utf8'))}}catch{}
  const branch=(await git(dir,['branch','--show-current'])).stdout||meta.default_branch||'main';
  const head=(await git(dir,['rev-parse','HEAD'],{allowFailure:true})).stdout||null;
  const status=(await git(dir,['status','--porcelain'])).stdout;
  return {...meta,current_branch:branch,head,dirty:Boolean(status)};
}
export async function listBranches(id){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  const result=await git(dir,['for-each-ref','--format=%(refname:short)|%(objectname)|%(HEAD)','refs/heads/']);
  return result.stdout?result.stdout.split('\n').filter(Boolean).map(line=>{const [name,sha,head]=line.split('|');return {name,sha,current:head==='*'}}):[];
}
export async function createBranch(id,name,{from='HEAD'}={}){
  const dir=projectDir(id);name=safeRef(name);from=safeRef(from);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  await git(dir,['branch',name,from]);
  return listBranches(id);
}
export async function listCommits(id,{limit=50}={}){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  limit=Math.max(1,Math.min(200,Number(limit)||50));
  const fmt='%H%x1f%P%x1f%an%x1f%ae%x1f%aI%x1f%s';
  const r=await git(dir,['log','-'+limit,'--pretty=format:'+fmt],{allowFailure:true});
  if(!r.ok||!r.stdout)return [];
  return r.stdout.split('\n').map(line=>{const [sha,parents,author,email,date,subject]=line.split('\x1f');return {sha,parents:parents?parents.split(' '):[],author,email,date,subject}});
}
export async function listFiles(id,{ref='HEAD'}={}){
  const dir=projectDir(id);ref=safeRef(ref);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  const r=await git(dir,['ls-tree','-r','--name-only',ref],{allowFailure:true});
  return r.ok&&r.stdout?r.stdout.split('\n').filter(Boolean):[];
}
export async function readFileAtRef(id,file,{ref='HEAD'}={}){
  const dir=projectDir(id);file=safeRelative(file);ref=safeRef(ref);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  const r=await git(dir,['show',ref+':'+file],{allowFailure:true});
  if(!r.ok)throw new Error('file_not_found');
  return {path:file,ref,content:r.stdout};
}
export async function writeFileAndCommit(id,file,content,{message='Update file',branch=null}={}){
  const dir=projectDir(id);file=safeRelative(file);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  if(branch){branch=safeRef(branch);await git(dir,['checkout',branch])}
  const full=path.join(dir,...file.split('/'));
  if(!full.startsWith(dir+path.sep))throw new Error('invalid_path');
  await fs.mkdir(path.dirname(full),{recursive:true});
  await fs.writeFile(full,String(content??''),'utf8');
  await git(dir,['add','--',file]);
  const diff=await git(dir,['diff','--cached','--quiet'],{allowFailure:true});
  if(diff.ok)return {changed:false,project:await getProject(id)};
  await git(dir,['commit','-m',String(message||'Update file').slice(0,240)]);
  return {changed:true,project:await getProject(id)};
}
export async function getStatus(id){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  const r=await git(dir,['status','--porcelain=v1','--branch']);
  return {raw:r.stdout,lines:r.stdout?r.stdout.split('\n'):[]};
}
