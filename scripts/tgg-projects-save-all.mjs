#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {createProject,projectExists,projectDir,getProject} from '../tgg-projects/store.mjs';

const execFileAsync=promisify(execFile);
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const PROJECT_ID=String(process.env.TGG_SOURCE_PROJECT_ID||'tgg-source');
const MAX_FILE_BYTES=Math.max(1024,Number(process.env.TGG_SOURCE_MAX_FILE_BYTES||5*1024*1024));

const ignoredDirs=new Set(['.git','node_modules','.next','dist','build','coverage','.cache','.turbo','.vercel','data','backups']);
const secretNames=[/^\.env(?:\.|$)/i,/\.pem$/i,/\.key$/i,/\.p12$/i,/\.pfx$/i,/credentials/i,/secrets?\.json$/i];
const binaryExt=new Set(['.zip','.tar','.gz','.7z','.png','.jpg','.jpeg','.webp','.gif','.mp4','.mov','.mp3','.wav','.woff','.woff2','.ttf','.otf']);

function ignored(rel,name,dirent){
  if(rel==='.git'||rel.startsWith('.git/'))return true;
  if(dirent?.isDirectory()&&ignoredDirs.has(name))return true;
  if(secretNames.some(rx=>rx.test(name)))return true;
  if(binaryExt.has(path.extname(name).toLowerCase()))return true;
  return false;
}
async function walk(dir,base=dir,out=[]){
  for(const entry of await fs.readdir(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    const rel=path.relative(base,full).replace(/\\/g,'/');
    if(ignored(rel,entry.name,entry))continue;
    if(entry.isDirectory())await walk(full,base,out);
    else if(entry.isFile()){
      const stat=await fs.stat(full);
      if(stat.size<=MAX_FILE_BYTES)out.push({full,rel,bytes:stat.size});
    }
  }
  return out;
}
async function git(cwd,args,{allowFailure=false}={}){
  try{
    const {stdout='',stderr=''}=await execFileAsync('git',args,{cwd,env:{...process.env,GIT_TERMINAL_PROMPT:'0'},maxBuffer:32*1024*1024});
    return {ok:true,stdout:String(stdout).trim(),stderr:String(stderr).trim()};
  }catch(error){
    if(allowFailure)return {ok:false,stdout:String(error?.stdout||'').trim(),stderr:String(error?.stderr||error?.message||'').trim()};
    throw error;
  }
}
async function removeSnapshotFiles(target){
  const keep=new Set(['.git','.tgg','tgg-project.json']);
  for(const entry of await fs.readdir(target,{withFileTypes:true}).catch(()=>[])){
    if(keep.has(entry.name))continue;
    await fs.rm(path.join(target,entry.name),{recursive:true,force:true});
  }
}

if(!(await projectExists(PROJECT_ID))){
  await createProject({
    id:PROJECT_ID,
    name:'TGG Source',
    description:'TGG-owned GitHub-style source control and project platform',
    default_branch:'main'
  });
}

const target=projectDir(PROJECT_ID);
const files=await walk(ROOT);
await removeSnapshotFiles(target);

const manifestFiles=[];
for(const item of files){
  const dest=path.join(target,...item.rel.split('/'));
  await fs.mkdir(path.dirname(dest),{recursive:true});
  const bytes=await fs.readFile(item.full);
  await fs.writeFile(dest,bytes);
  manifestFiles.push({
    path:item.rel,
    bytes:bytes.length,
    sha256:crypto.createHash('sha256').update(bytes).digest('hex')
  });
}

const manifest={
  schema:'tgg.source.snapshot/v1',
  owner:'TGG',
  project_id:PROJECT_ID,
  source_root:ROOT,
  file_count:manifestFiles.length,
  total_bytes:manifestFiles.reduce((n,x)=>n+x.bytes,0),
  created_at:new Date().toISOString(),
  files:manifestFiles
};
await fs.mkdir(path.join(target,'.tgg'),{recursive:true});
await fs.writeFile(path.join(target,'.tgg','source-snapshot.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600});

await git(target,['add','-A']);
const diff=await git(target,['diff','--cached','--quiet'],{allowFailure:true});
let committed=false;
if(!diff.ok){
  await git(target,['commit','-m','TGG Source snapshot '+manifest.created_at]);
  committed=true;
}

const project=await getProject(PROJECT_ID);
console.log(JSON.stringify({
  ok:true,
  gate:'TGG_SOURCE_SNAPSHOT',
  owner:'TGG',
  project,
  committed,
  file_count:manifest.file_count,
  total_bytes:manifest.total_bytes,
  snapshot_manifest:'.tgg/source-snapshot.json'
},null,2));
