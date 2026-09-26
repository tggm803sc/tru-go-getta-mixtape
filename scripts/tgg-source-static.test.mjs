#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const [store,server,dashboard,catalogText,snapshot,pkgText,higgsfield]=await Promise.all([
  fs.readFile('tgg-projects/store.mjs','utf8'),
  fs.readFile('tgg-projects/server.mjs','utf8'),
  fs.readFile('tgg-projects/dashboard.html','utf8'),
  fs.readFile('tgg-projects/catalog.json','utf8'),
  fs.readFile('scripts/tgg-projects-save-all.mjs','utf8'),
  fs.readFile('package.json','utf8'),
  fs.readFile('tgg-higgsfield/bridge.mjs','utf8')
]);

const catalog=JSON.parse(catalogText);
const pkg=JSON.parse(pkgText);

assert.equal((catalog.projects||[]).some(x=>x.id==='tgg-source'&&x.kind==='source-control'),true);

for(const fn of ['searchProject','getProjectActivity','createProjectBundle','listActions','runProjectAction']){
  assert.match(store,new RegExp('export async function '+fn));
}
for(const route of ['/activity','/search','/export','/actions']){
  assert.ok(server.includes(route),route+' API missing');
}

for(const label of ['TGG Source','Activity','Code','Issues','Pull Requests','Releases','TGG Actions','TGG Higgsfield','Export Bundle']){
  assert.ok(dashboard.includes(label),'dashboard missing '+label);
}
assert.match(dashboard,/submitHiggsfield/);
assert.match(dashboard,/project_id:current/);
assert.match(higgsfield,/persistProjectJob/);

assert.match(snapshot,/TGG_SOURCE_SNAPSHOT/);
assert.match(snapshot,/source-snapshot\.json/);
assert.match(snapshot,/sha256/);
assert.match(snapshot,/secretNames/);
assert.match(snapshot,/ignoredDirs/);
assert.match(store,/worktree.*add/s);
assert.match(store,/action_not_allowed/);
assert.match(dashboard,/runAction/);

assert.equal(
  pkg.scripts?.['tgg:projects:save-all'],
  'node scripts/tgg-projects-bootstrap.mjs && node scripts/tgg-projects-save-all.mjs && node scripts/tgg-higgsfield-project-sync.mjs && node scripts/tgg-projects-backup.mjs'
);

console.log(JSON.stringify({
  ok:true,
  gate:'TGG_SOURCE_STATIC',
  owner:'TGG',
  source_control:true,
  search:true,
  activity:true,
  issues:true,
  pull_requests:true,
  releases:true,
  bundle_export:true,
  actions:true,
  higgsfield_every_project:true,
  save_all:true
},null,2));
