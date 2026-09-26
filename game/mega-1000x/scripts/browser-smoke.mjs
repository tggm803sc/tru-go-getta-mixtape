import { chromium } from 'playwright';

const url=process.env.TGG_URL||process.argv[2];
if(!url) throw new Error('TGG_URL or URL argument required');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(5000);
const contract=await page.evaluate(()=>{const r=document.documentElement;return {
  overlay:window.__TGG_BUILD__?.overlay||null,
  integrity:r.dataset.tggBuildIntegrityV58||null,
  districtTransitionV89:r.dataset.tggDistrictTransitionV89||null,
  worldGroundingV90:r.dataset.tggWorldGroundingV90||null,
  curbMedianV90:r.dataset.tggCurbMedianV90||null,
  storefrontGlassDepthV90:r.dataset.tggStorefrontGlassDepthV90||null,
  terrainPropsV90:r.dataset.tggTerrainPropsV90||null,
  groundContactModelV90:r.dataset.tggGroundContactModelV90||null,
  trafficVarietyV90:r.dataset.tggTrafficVarietyV90||null
}});
if(contract.overlay!=='1000x-v90') throw new Error('overlay v90 mismatch');
if(contract.worldGroundingV90!=='1') throw new Error('world grounding v90 missing');
if(contract.curbMedianV90!=='144') throw new Error('curb/median v90 mismatch');
if(contract.storefrontGlassDepthV90!=='72') throw new Error('storefront glass v90 mismatch');
if(contract.terrainPropsV90!=='132') throw new Error('terrain props v90 mismatch');
if(contract.groundContactModelV90!=='shadow+contact-light') throw new Error('ground contact model v90 mismatch');
console.log(JSON.stringify(contract,null,2));
await browser.close();
