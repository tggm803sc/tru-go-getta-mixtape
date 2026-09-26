import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createProject,projectExists,ROOT} from '../tgg-projects/store.mjs';

const repoRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const catalog=JSON.parse(await fs.readFile(path.join(repoRoot,'tgg-projects','catalog.json'),'utf8'));

const results=[];
for(const item of catalog.projects||[]){
  if(await projectExists(item.id)){
    results.push({id:item.id,status:'exists'});
    continue;
  }
  const project=await createProject({
    id:item.id,
    name:item.name,
    description:'TGG-owned '+item.kind+' project',
    default_branch:item.default_branch||'main'
  });
  results.push({id:item.id,status:'created',head:project.head});
}
console.log(JSON.stringify({ok:true,owner:'TGG',storage_root:ROOT,projects:results},null,2));
