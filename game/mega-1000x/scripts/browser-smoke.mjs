import { chromium } from 'playwright';

const url=process.env.TGG_URL||process.argv[2];
if(!url) throw new Error('TGG_URL or URL argument required');

const proofMode=String(process.env.TGG_PROOF_MODE||'headless').toLowerCase();
const headful=['headful','visible','ui','proof'].includes(proofMode);
const screenshotPath=process.env.TGG_PROOF_SCREENSHOT||'';
const browser=await chromium.launch({
  headless:!headful,
  args:process.env.TGG_BROWSER_ARGS?process.env.TGG_BROWSER_ARGS.split(/\s+/).filter(Boolean):[]
});
const context=await browser.newContext({
  viewport:{width:Number(process.env.TGG_VIEWPORT_WIDTH||1280),height:Number(process.env.TGG_VIEWPORT_HEIGHT||1024)}
});
const page=await context.newPage();
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
    wholeWorldPreserved:r.dataset.tggWholeWorldPreservedV208||null,
    playableRendererV209:r.dataset.tggPlayableRendererV209||null,
    rendererAuthorityV209:r.dataset.tggRendererAuthorityV209||null,
    rendererTelemetryV209:r.dataset.tggRendererTelemetryV209||null,
    rendererOptimizationV209:r.dataset.tggRendererOptimizationV209||null,
    playableTargetFpsV209:r.dataset.tggPlayableTargetFpsV209||null,
    playableFloorFpsV209:r.dataset.tggPlayableFloorFpsV209||null,
    rendererModeV209:r.dataset.tggRendererModeV209||null,
    rendererPixelRatioV209:r.dataset.tggRendererPixelRatioV209||null,
    drawCallsV209:r.dataset.tggDrawCallsV209||null,
    trianglesV209:r.dataset.tggTrianglesV209||null,
    geometriesV209:r.dataset.tggGeometriesV209||null,
    texturesV209:r.dataset.tggTexturesV209||null,
    staticMeshesFrozenV209:r.dataset.tggStaticMeshesFrozenV209||null,
    shadowCastersPrunedV209:r.dataset.tggShadowCastersPrunedV209||null,
    playableFarPlaneV209:r.dataset.tggPlayableFarPlaneV209||null
  };
});

if(contract.overlay!=='1000x-v209') throw new Error('overlay v209 mismatch');
if(contract.graphics!=='57') throw new Error('graphics manifest mismatch');
if(contract.integrity!=='pass') throw new Error('build integrity failed');
if(contract.buildMaster!=='1000x-v209') throw new Error('master asset mismatch');
if(contract.buildCleaner!=='193') throw new Error('cleaner asset mismatch');
if(contract.finalVerification!=='pass') throw new Error('whole-world final verification failed: '+contract.finalVerificationMissing);
if(contract.productionHandoffReady!=='1') throw new Error('production handoff not ready');
if(contract.deploymentReadiness!=='pass') throw new Error('deployment convergence failed: '+contract.deploymentMissing);
if(contract.sourceDeploymentGap!=='closed') throw new Error('source/deployment gap still open');
if(contract.releaseBridge!=='pass') throw new Error('release bridge failed');
if(contract.releaseAcceptance!=='pass') throw new Error('release acceptance failed: '+contract.releaseAcceptanceMissing);
if(contract.longHaulAuthority!=='1'||contract.wholeWorldPreserved!=='1') throw new Error('v208 whole-world authority missing');
if(contract.playableRendererV209!=='1') throw new Error('v209 playable renderer missing');
if(contract.rendererAuthorityV209!=='playability-first') throw new Error('v209 renderer authority mismatch');
if(contract.rendererTelemetryV209!=='drawcalls+triangles+memory') throw new Error('v209 renderer telemetry missing');
if(contract.rendererOptimizationV209!=='static-freeze+shadow-prune+frustum+adaptive-dpr') throw new Error('v209 renderer optimization mismatch');
if(contract.playableTargetFpsV209!=='60'||contract.playableFloorFpsV209!=='45') throw new Error('v209 playable FPS targets mismatch');
if(consoleErrors.length) throw new Error('browser console errors: '+consoleErrors.slice(0,5).join(' | '));

if(screenshotPath||headful){
  const output=screenshotPath||'tgg-v209-browser-proof.png';
  await page.screenshot({path:output,fullPage:true});
  console.log('TGG_PROOF_SCREENSHOT='+output);
}
console.log(JSON.stringify({
  proof:{mode:proofMode,headful,display:process.env.DISPLAY||null},
  contract,
  consoleErrors
},null,2));
await browser.close();
