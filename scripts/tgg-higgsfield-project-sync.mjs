import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createProject,projectExists,writeFileAndCommit,getProject} from '../tgg-projects/store.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const PROJECT_ID='tgg-higgsfield';

if(!(await projectExists(PROJECT_ID))){
  await createProject({
    id:PROJECT_ID,
    name:'TGG Higgsfield',
    description:'TGG-owned creator generation workspace',
    default_branch:'main'
  });
}

const sourceFiles=[
  'tgg-higgsfield/README.md',
  'tgg-higgsfield/presets.json',
  'tgg-higgsfield/workspace.json',
  'tgg-higgsfield/bridge.mjs'
];

const results=[];
for(const source of sourceFiles){
  const content=await fs.readFile(path.join(ROOT,source),'utf8');
  const target=source.replace(/^tgg-higgsfield\//,'');
  const saved=await writeFileAndCommit(PROJECT_ID,target,content,{
    message:'Sync TGG Higgsfield '+target
  });
  results.push({source,target,changed:saved.changed===true,head:saved.project?.head||null});
}

console.log(JSON.stringify({
  ok:true,
  owner:'TGG',
  project:await getProject(PROJECT_ID),
  synced:results
},null,2));
