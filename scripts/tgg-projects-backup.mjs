import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {ROOT,listProjects,projectDir} from '../tgg-projects/store.mjs';

const execFileAsync=promisify(execFile);
const OUT=path.resolve(process.env.TGG_PROJECTS_BACKUP_ROOT||'/data/tgg-project-backups');
await fs.mkdir(OUT,{recursive:true});
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const runDir=path.join(OUT,stamp);
await fs.mkdir(runDir,{recursive:true});

const projects=await listProjects();
const entries=[];
for(const project of projects){
  const src=projectDir(project.id);
  const bundle=path.join(runDir,project.id+'.bundle');
  await execFileAsync('git',['bundle','create',bundle,'--all'],{cwd:src,maxBuffer:16*1024*1024});
  const bytes=await fs.readFile(bundle);
  const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  entries.push({
    id:project.id,
    head:project.head,
    branch:project.current_branch,
    bundle:path.basename(bundle),
    bytes:bytes.length,
    sha256
  });
}
const manifest={
  schema:'tgg.projects.backup/v1',
  owner:'TGG',
  storage_root:ROOT,
  backup_root:runDir,
  created_at:new Date().toISOString(),
  projects:entries
};
await fs.writeFile(path.join(runDir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600});
console.log(JSON.stringify({ok:true,...manifest},null,2));
