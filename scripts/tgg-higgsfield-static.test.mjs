#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const [bridge,presetsText,workspaceText,sync,server,dashboard,pkgText,catalogText]=await Promise.all([
  fs.readFile('tgg-higgsfield/bridge.mjs','utf8'),
  fs.readFile('tgg-higgsfield/presets.json','utf8'),
  fs.readFile('tgg-higgsfield/workspace.json','utf8'),
  fs.readFile('scripts/tgg-higgsfield-project-sync.mjs','utf8'),
  fs.readFile('tgg-projects/server.mjs','utf8'),
  fs.readFile('tgg-projects/dashboard.html','utf8'),
  fs.readFile('package.json','utf8'),
  fs.readFile('tgg-projects/catalog.json','utf8')
]);

const presets=JSON.parse(presetsText);
const workspace=JSON.parse(workspaceText);
const pkg=JSON.parse(pkgText);
const catalog=JSON.parse(catalogText);

const presetIds=new Set((presets.presets||[]).map(x=>x.id));
for(const id of ['world-cinematic','avatar-hero','vehicle-commercial','music-video-vfx','game-trailer','social-ad']){
  assert.equal(presetIds.has(id),true,'missing preset '+id);
}

assert.equal(workspace.id,'tgg-higgsfield');
assert.equal(workspace.owner,'TGG');
assert.ok((workspace.capabilities||[]).includes('project-job-history'));
assert.ok((workspace.capabilities||[]).includes('backend-forwarding'));
assert.equal((catalog.projects||[]).some(x=>x.id==='tgg-higgsfield'),true);

assert.match(bridge,/\/v1\/capabilities/);
assert.match(bridge,/\/v1\/presets/);
assert.match(bridge,/\/v1\/jobs/);
assert.match(bridge,/\/cancel/);
assert.match(bridge,/\/result/);
assert.match(bridge,/persistProjectJob/);
assert.match(bridge,/preset_id/);
assert.match(bridge,/workspace_id:'tgg-higgsfield'/);

assert.match(sync,/tgg-higgsfield\/README\.md/);
assert.match(sync,/tgg-higgsfield\/presets\.json/);
assert.match(sync,/tgg-higgsfield\/workspace\.json/);
assert.match(sync,/tgg-higgsfield\/bridge\.mjs/);

assert.match(server,/\/v1\/higgsfield/);
assert.match(server,/HIGGSFIELD_URL/);
assert.match(dashboard,/TGG Higgsfields/);
assert.match(dashboard,/loadHiggsfield/);

assert.equal(pkg.scripts?.['tgg:higgsfield'],'node tgg-higgsfield/bridge.mjs');
assert.equal(pkg.scripts?.['tgg:higgsfield:sync'],'node scripts/tgg-higgsfield-project-sync.mjs');

console.log(JSON.stringify({
  ok:true,
  gate:'TGG_HIGGSFIELD_STATIC',
  owner:'TGG',
  presets:presetIds.size,
  workspace:workspace.id,
  project_persistence:true,
  dashboard:true
},null,2));
