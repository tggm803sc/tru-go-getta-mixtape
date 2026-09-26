import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
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
function safeTitle(value,label='title'){
  const text=String(value||'').trim();
  if(!text)throw new Error(label+'_required');
  return text.slice(0,240);
}
function now(){return new Date().toISOString()}
function itemId(prefix){return prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
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


export async function importGitProject({id,remote_url,name='',description='',default_branch='main'}){
  await ensureRoot();
  id=safeId(id);
  const remote=String(remote_url||'').trim();
  if(!/^(https?:\/\/|ssh:\/\/|git@|file:\/\/)/i.test(remote))throw new Error('invalid_remote_url');
  const dir=projectDir(id);
  if(await projectExists(id))throw new Error('project_exists');
  await git(ROOT,['clone','--no-hardlinks',remote,id]);
  await git(dir,['config','user.name',process.env.TGG_GIT_USER_NAME||'TGG']);
  await git(dir,['config','user.email',process.env.TGG_GIT_USER_EMAIL||'tgg@local']);
  const current=(await git(dir,['branch','--show-current'],{allowFailure:true})).stdout||default_branch;
  const meta={
    schema:'tgg.project/v1',
    id,
    name:String(name||id),
    description:String(description||'Imported into TGG Projects'),
    default_branch:current||default_branch,
    owner:'TGG',
    imported_from:remote,
    imported_at:new Date().toISOString()
  };
  await fs.writeFile(path.join(dir,'tgg-project.json'),JSON.stringify(meta,null,2)+'\n',{mode:0o600});
  await git(dir,['add','tgg-project.json']);
  const diff=await git(dir,['diff','--cached','--quiet'],{allowFailure:true});
  if(!diff.ok)await git(dir,['commit','-m','TGG Projects import metadata']);
  return getProject(id);
}


async function withMetadataCommit(id,{message,mutate}){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  const dirty=(await git(dir,['status','--porcelain'])).stdout;
  if(dirty)throw new Error('project_dirty_metadata_commit_blocked');
  const project=await getProject(id);
  const original=project.current_branch||project.default_branch||'main';
  const target=project.default_branch||'main';
  if(original!==target)await git(dir,['checkout',target]);
  try{
    const result=await mutate({dir,project});
    await git(dir,['add','--','.tgg']);
    const diff=await git(dir,['diff','--cached','--quiet'],{allowFailure:true});
    if(!diff.ok)await git(dir,['commit','-m',String(message||'Update TGG project metadata').slice(0,240)]);
    return result;
  }finally{
    if(original!==target)await git(dir,['checkout',original]);
  }
}
async function readMetaCollection(id,kind){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  const folder=path.join(dir,'.tgg',kind);
  const names=await fs.readdir(folder).catch(()=>[]);
  const out=[];
  for(const name of names.filter(x=>x.endsWith('.json')).sort()){
    try{out.push(JSON.parse(await fs.readFile(path.join(folder,name),'utf8')))}catch{}
  }
  return out;
}
async function writeMetaItem(dir,kind,id,value){
  const folder=path.join(dir,'.tgg',kind);
  await fs.mkdir(folder,{recursive:true});
  const file=path.join(folder,id+'.json');
  const tmp=file+'.tmp-'+process.pid;
  await fs.writeFile(tmp,JSON.stringify(value,null,2)+'\n',{mode:0o600});
  await fs.rename(tmp,file);
}

export async function listIssues(id){
  return (await readMetaCollection(id,'issues')).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
}
export async function createIssue(id,{title,body='',labels=[]}={}){
  title=safeTitle(title);
  return withMetadataCommit(id,{
    message:'Issue: '+title,
    mutate:async({dir})=>{
      const issue={
        schema:'tgg.issue/v1',
        id:itemId('issue'),
        number:(await listIssues(id)).length+1,
        title,
        body:String(body||''),
        labels:Array.isArray(labels)?labels.map(String).slice(0,20):[],
        state:'open',
        owner:'TGG',
        created_at:now(),
        updated_at:now()
      };
      await writeMetaItem(dir,'issues',issue.id,issue);
      return issue;
    }
  });
}
export async function updateIssue(id,issueId,{state,title,body,labels}={}){
  issueId=safeId(issueId);
  return withMetadataCommit(id,{
    message:'Update issue '+issueId,
    mutate:async({dir})=>{
      const file=path.join(dir,'.tgg','issues',issueId+'.json');
      let issue;try{issue=JSON.parse(await fs.readFile(file,'utf8'))}catch{throw new Error('issue_not_found')}
      if(state!==undefined){
        const next=String(state);
        if(!['open','closed'].includes(next))throw new Error('invalid_issue_state');
        issue.state=next;
      }
      if(title!==undefined)issue.title=safeTitle(title);
      if(body!==undefined)issue.body=String(body);
      if(labels!==undefined)issue.labels=Array.isArray(labels)?labels.map(String).slice(0,20):[];
      issue.updated_at=now();
      await writeMetaItem(dir,'issues',issue.id,issue);
      return issue;
    }
  });
}

export async function listPullRequests(id){
  return (await readMetaCollection(id,'pull-requests')).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
}
export async function createPullRequest(id,{title,body='',head,base}={}){
  title=safeTitle(title);
  const dir=projectDir(id);
  head=safeRef(head);
  const project=await getProject(id);
  base=safeRef(base||project.default_branch||'main');
  const headSha=(await git(dir,['rev-parse',head],{allowFailure:true})).stdout;
  const baseSha=(await git(dir,['rev-parse',base],{allowFailure:true})).stdout;
  if(!headSha)throw new Error('head_ref_not_found');
  if(!baseSha)throw new Error('base_ref_not_found');
  return withMetadataCommit(id,{
    message:'Pull request: '+title,
    mutate:async({dir:projectRoot})=>{
      const pr={
        schema:'tgg.pull-request/v1',
        id:itemId('pr'),
        number:(await listPullRequests(id)).length+1,
        title,
        body:String(body||''),
        head,
        base,
        head_sha:headSha,
        base_sha:baseSha,
        state:'open',
        merge_sha:null,
        owner:'TGG',
        created_at:now(),
        updated_at:now()
      };
      await writeMetaItem(projectRoot,'pull-requests',pr.id,pr);
      return pr;
    }
  });
}
export async function mergePullRequest(id,prId,{message=''}={}){
  prId=safeId(prId);
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  const dirty=(await git(dir,['status','--porcelain'])).stdout;
  if(dirty)throw new Error('project_dirty_merge_blocked');
  const file=path.join(dir,'.tgg','pull-requests',prId+'.json');
  let pr;try{pr=JSON.parse(await fs.readFile(file,'utf8'))}catch{throw new Error('pull_request_not_found')}
  if(pr.state!=='open')throw new Error('pull_request_not_open');
  const original=(await git(dir,['branch','--show-current'])).stdout||pr.base;
  await git(dir,['checkout',pr.base]);
  try{
    await git(dir,['merge','--no-ff',pr.head,'-m',String(message||('Merge '+pr.title)).slice(0,240)]);
    pr.state='merged';
    pr.merge_sha=(await git(dir,['rev-parse','HEAD'])).stdout;
    pr.merged_at=now();
    pr.updated_at=now();
    await writeMetaItem(dir,'pull-requests',pr.id,pr);
    await git(dir,['add','--','.tgg/pull-requests/'+pr.id+'.json']);
    await git(dir,['commit','-m','Record merged pull request '+pr.number]);
  }finally{
    if(original!==pr.base)await git(dir,['checkout',original]);
  }
  return pr;
}

export async function compareRefs(id,{base,head}={}){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  base=safeRef(base);head=safeRef(head);
  const summary=await git(dir,['diff','--stat',base+'...'+head],{allowFailure:true});
  const names=await git(dir,['diff','--name-status',base+'...'+head],{allowFailure:true});
  const log=await git(dir,['log','--pretty=format:%H%x1f%an%x1f%aI%x1f%s',base+'..'+head],{allowFailure:true});
  return {
    base,head,
    stat:summary.stdout,
    files:names.stdout?names.stdout.split('\n').filter(Boolean):[],
    commits:log.stdout?log.stdout.split('\n').filter(Boolean).map(line=>{const [sha,author,date,subject]=line.split('\x1f');return {sha,author,date,subject}}):[]
  };
}

export async function listTags(id){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  const r=await git(dir,['for-each-ref','--format=%(refname:short)|%(objectname)|%(creatordate:iso-strict)','refs/tags/']);
  return r.stdout?r.stdout.split('\n').filter(Boolean).map(line=>{const [name,sha,date]=line.split('|');return {name,sha,date}}):[];
}
export async function createTag(id,{name,ref='HEAD',message=''}={}){
  const dir=projectDir(id);name=safeRef(name);ref=safeRef(ref);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  await git(dir,['tag','-a',name,ref,'-m',String(message||('TGG release '+name)).slice(0,240)]);
  return listTags(id);
}

export async function listReleases(id){
  return (await readMetaCollection(id,'releases')).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
}
export async function createRelease(id,{tag,title,notes='',ref='HEAD'}={}){
  tag=safeRef(tag);title=safeTitle(title||tag);
  const existing=await listTags(id);
  if(!existing.some(x=>x.name===tag))await createTag(id,{name:tag,ref,message:title});
  return withMetadataCommit(id,{
    message:'Release '+tag,
    mutate:async({dir})=>{
      const release={
        schema:'tgg.release/v1',
        id:itemId('release'),
        tag,
        title,
        notes:String(notes||''),
        ref:safeRef(ref),
        owner:'TGG',
        created_at:now()
      };
      await writeMetaItem(dir,'releases',release.id,release);
      return release;
    }
  });
}

export async function saveProjectArtifact(id,file,content,{message='Save TGG artifact'}={}){
  return writeFileAndCommit(id,safeRelative(file),typeof content==='string'?content:JSON.stringify(content,null,2)+'\n',{message});
}


export async function searchProject(id,{query,ref='HEAD',limit=100}={}){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  ref=safeRef(ref);
  const q=String(query||'').trim();
  if(!q)throw new Error('query_required');
  if(q.length>240)throw new Error('query_too_long');
  limit=Math.max(1,Math.min(250,Number(limit)||100));

  const files=await listFiles(id,{ref});
  const fileMatches=files.filter(file=>file.toLowerCase().includes(q.toLowerCase())).slice(0,limit);

  const grep=await git(dir,['grep','-n','-I','-F','-e',q,ref,'--'],{allowFailure:true});
  const contentMatches=[];
  if(grep.ok&&grep.stdout){
    for(const line of grep.stdout.split('\n')){
      if(contentMatches.length>=limit)break;
      const first=line.indexOf(':');
      const second=line.indexOf(':',first+1);
      if(first<0||second<0)continue;
      const refPath=line.slice(0,first);
      const lineNumber=Number(line.slice(first+1,second))||null;
      const text=line.slice(second+1);
      const colon=refPath.indexOf(':');
      const file=colon>=0?refPath.slice(colon+1):refPath;
      contentMatches.push({file,line:lineNumber,text:text.slice(0,1000)});
    }
  }

  const commits=await git(dir,['log','--all','--regexp-ignore-case','--grep='+q,'--pretty=format:%H%x1f%an%x1f%aI%x1f%s','-n',String(limit)],{allowFailure:true});
  const commitMatches=commits.ok&&commits.stdout
    ?commits.stdout.split('\n').filter(Boolean).map(line=>{
      const [sha,author,date,subject]=line.split('\x1f');
      return {sha,author,date,subject};
    })
    :[];

  return {query:q,ref,file_matches:fileMatches,content_matches:contentMatches,commit_matches:commitMatches};
}

export async function getProjectActivity(id,{limit=100}={}){
  limit=Math.max(1,Math.min(250,Number(limit)||100));
  const [commits,issues,pullRequests,releases]=await Promise.all([
    listCommits(id,{limit}),
    listIssues(id),
    listPullRequests(id),
    listReleases(id)
  ]);
  const events=[
    ...commits.map(x=>({type:'commit',id:x.sha,date:x.date,title:x.subject,author:x.author,sha:x.sha})),
    ...issues.map(x=>({type:'issue',id:x.id,date:x.updated_at||x.created_at,title:x.title,state:x.state,number:x.number})),
    ...pullRequests.map(x=>({type:'pull-request',id:x.id,date:x.updated_at||x.created_at,title:x.title,state:x.state,number:x.number,head:x.head,base:x.base})),
    ...releases.map(x=>({type:'release',id:x.id,date:x.created_at,title:x.title,tag:x.tag}))
  ].filter(x=>x.date).sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,limit);
  return events;
}

export async function createProjectBundle(id,{ref='--all'}={}){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  const outRoot=path.resolve(process.env.TGG_PROJECTS_EXPORT_ROOT||'/data/tgg-project-exports');
  await fs.mkdir(outRoot,{recursive:true});
  const project=await getProject(id);
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  const file=path.join(outRoot,safeId(id)+'-'+stamp+'.bundle');
  const args=['bundle','create',file];
  if(ref==='--all')args.push('--all');
  else args.push(safeRef(ref));
  await git(dir,args);
  const bytes=await fs.readFile(file);
  return {
    schema:'tgg.project.export/v1',
    owner:'TGG',
    project_id:project.id,
    head:project.head,
    branch:project.current_branch,
    file,
    bytes:bytes.length,
    sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
    created_at:now()
  };
}


function allowedActionNames(){
  return new Set(
    String(process.env.TGG_ACTIONS_ALLOWED||'check,test,build')
      .split(',')
      .map(x=>x.trim())
      .filter(Boolean)
  );
}

export async function listActions(id){
  return (await readMetaCollection(id,'actions')).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
}

export async function runProjectAction(id,{action,ref='HEAD',timeout_ms=300000}={}){
  const dir=projectDir(id);
  if(!(await projectExists(id)))throw new Error('project_not_found');
  action=String(action||'').trim();
  if(!/^[a-zA-Z0-9:_-]{1,80}$/.test(action))throw new Error('invalid_action');
  if(!allowedActionNames().has(action))throw new Error('action_not_allowed');
  ref=safeRef(ref);
  timeout_ms=Math.max(1000,Math.min(30*60*1000,Number(timeout_ms)||300000));

  const actionId=itemId('action');
  const runRoot=path.resolve(process.env.TGG_ACTION_RUN_ROOT||'/data/tgg-action-runs');
  const worktree=path.join(runRoot,safeId(id),actionId);
  await fs.mkdir(path.dirname(worktree),{recursive:true});

  const resolved=(await git(dir,['rev-parse',ref],{allowFailure:true})).stdout;
  if(!resolved)throw new Error('action_ref_not_found');

  await git(dir,['worktree','add','--detach',worktree,resolved]);
  let status='success',exit_code=0,stdout='',stderr='',started_at=now();
  const started=Date.now();
  try{
    const pkgFile=path.join(worktree,'package.json');
    let pkg={};
    try{pkg=JSON.parse(await fs.readFile(pkgFile,'utf8'))}catch{throw new Error('action_package_json_missing')}
    if(!pkg.scripts?.[action])throw new Error('action_script_missing');
    try{
      const result=await execFileAsync(process.platform==='win32'?'npm.cmd':'npm',['run',action],{
        cwd:worktree,
        env:{...process.env,TGG_ACTION_ID:actionId,TGG_PROJECT_ID:id,TGG_ACTION_REF:resolved},
        timeout:timeout_ms,
        maxBuffer:8*1024*1024
      });
      stdout=String(result.stdout||'');
      stderr=String(result.stderr||'');
    }catch(error){
      status='failed';
      exit_code=Number.isInteger(error?.code)?error.code:1;
      stdout=String(error?.stdout||'');
      stderr=String(error?.stderr||error?.message||'');
    }
  }finally{
    await git(dir,['worktree','remove','--force',worktree],{allowFailure:true});
    await fs.rm(worktree,{recursive:true,force:true}).catch(()=>{});
  }

  const record={
    schema:'tgg.action/v1',
    id:actionId,
    project_id:safeId(id),
    action,
    ref,
    sha:resolved,
    status,
    exit_code,
    duration_ms:Date.now()-started,
    stdout:stdout.slice(-200000),
    stderr:stderr.slice(-200000),
    owner:'TGG',
    created_at:started_at,
    completed_at:now()
  };

  await withMetadataCommit(id,{
    message:'TGG Action '+action+' '+status,
    mutate:async({dir:projectRoot})=>{
      await writeMetaItem(projectRoot,'actions',record.id,record);
      return record;
    }
  });
  return record;
}
