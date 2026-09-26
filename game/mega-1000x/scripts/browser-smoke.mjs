import { chromium } from 'playwright';

const url=process.env.TGG_URL||process.argv[2];
if(!url) throw new Error('TGG_URL or URL argument required');

const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const consoleErrors=[];
page.on('console',msg=>{ if(msg.type()==='error') consoleErrors.push(msg.text()) });
page.on('pageerror',err=>consoleErrors.push(String(err)));

await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);

const contract=await page.evaluate(()=>{
  const r=document.documentElement;
  return {
    overlay:window.__TGG_BUILD__?.overlay||null,
    graphics:window.__TGG_BUILD__?.graphics||null,
    integrity:r.dataset.tggBuildIntegrityV58||null,
    buildMaster:r.dataset.tggBuildMasterV58||null,
    buildCleaner:r.dataset.tggBuildCleanerV58||null,
    finalVerification:r.dataset.tggWholeWorldReadyV175||null,
    finalVerificationMissing:r.dataset.tggWholeWorldVerificationMissingV175||null,
    productionHandoff:r.dataset.tggProductionHandoffV180||null,
    productionHandoffReady:r.dataset.tggProductionHandoffReadyV180||null,
    deploymentReadiness:r.dataset.tggDeploymentReadinessV185||null,
    deploymentMissing:r.dataset.tggDeploymentMissingV185||null,
    sourceDeploymentGap:r.dataset.tggSourceDeploymentGapV185||null,
    releaseBridge:r.dataset.tggReleaseBridgeReadyV186||null,
    releaseAcceptance:r.dataset.tggReleaseAcceptanceReadyV187||null,
    releaseAcceptanceMissing:r.dataset.tggReleaseAcceptanceMissingV187||null,
    releaseAcceptanceScore:r.dataset.tggReleaseAcceptanceScoreV187||null,
    wholeGameMilestone:r.dataset.tggWholeGameMilestoneReadyV200||null,
    wholeGameMilestoneMissing:r.dataset.tggWholeGameMilestoneMissingV200||null,
    longHaulAuthority:r.dataset.tggLongHaulTravelAuthorityV208||null,
    wholeWorldPreserved:r.dataset.tggWholeWorldPreservedV208||null
  };
});

if(contract.overlay!=='1000x-v208') throw new Error('overlay v208 mismatch');
if(contract.graphics!=='57') throw new Error('graphics manifest mismatch');
if(contract.integrity!=='pass') throw new Error('build integrity failed');
if(contract.buildMaster!=='1000x-v208') throw new Error('master asset mismatch');
if(contract.buildCleaner!=='193') throw new Error('cleaner asset mismatch');
if(contract.finalVerification!=='pass') throw new Error('whole-world final verification failed: '+contract.finalVerificationMissing);
if(contract.productionHandoffReady!=='1') throw new Error('production handoff not ready');
if(contract.deploymentReadiness!=='pass') throw new Error('deployment convergence failed: '+contract.deploymentMissing);
if(contract.sourceDeploymentGap!=='closed') throw new Error('source/deployment gap still open');
if(contract.releaseBridge!=='pass') throw new Error('release bridge failed');
if(contract.releaseAcceptance!=='pass') throw new Error('release acceptance failed: '+contract.releaseAcceptanceMissing);
if(contract.longHaulAuthority!=='1'||contract.wholeWorldPreserved!=='1') throw new Error('v208 whole-world authority missing');
if(consoleErrors.length) throw new Error('browser console errors: '+consoleErrors.slice(0,5).join(' | '));

console.log(JSON.stringify({contract,consoleErrors},null,2));
await browser.close();
