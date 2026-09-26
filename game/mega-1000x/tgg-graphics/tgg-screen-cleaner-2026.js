(()=>{if(window.__TGG_SCREEN_CLEANER__)return;window.__TGG_SCREEN_CLEANER__=true;
const GROUPS={
play:/mission|vehicle|interact|camera|drift|horn|character|talk|car/i,
world:/park|shop|home|apartment|garage|city event|job|expansion|travel|map|world/i,
create:/studio|media|career|business|record|creator|release|music|video|beat|edit|vfx|avatar/i,
social:/phone|crew|social|message|call|collab|friend|multiplayer|backstage/i
};
function groupFor(btn){const hay=((btn.id||"")+" "+(btn.textContent||"")).toLowerCase();for(const [name,re] of Object.entries(GROUPS))if(re.test(hay))return name;return"more"}
function currentWorldBuild(){
  return String(window.__TGG_BUILD__?.overlay||document.documentElement.dataset.tggBuildOverlayV58||'1000x-v208');
}
function openCreatorTool(path){
  const url=new URL(path,location.origin);
  const root=document.documentElement;
  const gameState=window.TGGGame?.getState?.()||{};
  const snapshot={
    district:root.dataset.tggDistrict||'downtown',
    mode:gameState.inVehicle?'driving':'world',
    race:root.dataset.tggRaceMode||'off',
    avatar:root.dataset.tggAvatarOutfit||'default',
    carClass:root.dataset.tggCarClassV19||'street',
    garage:window.TGGGarageV18?.status?.()||null,
    camera:window.TGG3D?.getCameraMode?.()||null,
    weather:root.dataset.tggWeather||'clear',
    travelBand:root.dataset.tggTravelBandV195||'core',
    worldScale:root.dataset.tggOpenWorldScaleV195||'expanded-travel',
    graphicsPreset:root.dataset.tggGraphicsManifestPresetV57||'cinematic',
    graphicsQuality:root.dataset.tggGraphicsManifestQualityV57||root.dataset.tggGraphicsAdaptiveV55||'high',
    travelLandmark:root.dataset.tggTravelLandmarkNearestV199||'none',
    travelLandmarkDistance:root.dataset.tggTravelLandmarkDistanceV199||'-1',
    travelLandmarkInteract:root.dataset.tggTravelLandmarkInteractV199||'far',
    roadsideLifeActive:root.dataset.tggRoadsideLifeActiveV201||'0',
    roadsideVehicles:root.dataset.tggRoadsideVehiclesV201||'0',
    roadsidePeople:root.dataset.tggRoadsidePeopleV201||'0',
    roadsideNearest:root.dataset.tggRoadsideNearestV201||'none',
    roadsideLightingActive:root.dataset.tggRoadsideLightingActiveV202||'0',
    roadsideLightsVisible:root.dataset.tggRoadsideLightsVisibleV202||'0',
    roadsideLightingMode:root.dataset.tggRoadsideLightingModeV202||'budget',
    longHaulRoute:root.dataset.tggLongHaulRouteV208||'none',
    longHaulRouteLabel:root.dataset.tggLongHaulRouteLabelV208||'none',
    longHaulDistanceFromCore:root.dataset.tggLongHaulDistanceFromCoreV208||'0',
    build:window.__TGG_BUILD__||{overlay:currentWorldBuild(),graphics:'57',cleanerJs:'193'}
  };
  url.searchParams.set('return',location.pathname+location.search);
  url.searchParams.set('district',root.dataset.tggDistrict||'downtown');
  url.searchParams.set('mode',gameState.inVehicle?'driving':'world');
  url.searchParams.set('race',root.dataset.tggRaceMode||'off');
  url.searchParams.set('avatar',root.dataset.tggAvatarOutfit||'default');
  url.searchParams.set('build',currentWorldBuild());
  url.searchParams.set('travelBand',snapshot.travelBand);
  url.searchParams.set('graphicsPreset',snapshot.graphicsPreset);
  url.searchParams.set('graphicsQuality',snapshot.graphicsQuality);
  url.searchParams.set('travelLandmark',snapshot.travelLandmark);
  url.searchParams.set('travelLandmarkDistance',snapshot.travelLandmarkDistance);
  url.searchParams.set('roadsideNearest',snapshot.roadsideNearest);
  url.searchParams.set('roadsidePeople',snapshot.roadsidePeople);
  url.searchParams.set('roadsideLighting',snapshot.roadsideLightingActive);
  url.searchParams.set('roadsideLightsVisible',snapshot.roadsideLightsVisible);
  url.searchParams.set('longHaulRoute',snapshot.longHaulRoute);
  url.searchParams.set('longHaulDistance',snapshot.longHaulDistanceFromCore);
  url.searchParams.set('assetContext',btoa(unescape(encodeURIComponent(JSON.stringify(snapshot)))));
  root.dataset.tggCreatorAssetBridge='1';
  root.dataset.tggCreatorTransition='1';
  setTimeout(()=>{location.href=url.href},140);
}
function findButton(pattern){
  return [...document.querySelectorAll('button')].find(b=>pattern.test(((b.id||'')+' '+(b.textContent||'')).toLowerCase()));
}

function installCreatorHubV45(){
  if(window.TGGCreatorHubV45)return;
  let panel=document.getElementById('tgg-creator-hub-v45');
  if(!panel){
    panel=document.createElement('div');panel.id='tgg-creator-hub-v45';
    panel.style.cssText='position:fixed;inset:0;z-index:10040;display:none;place-items:center;background:rgba(2,5,10,.74);backdrop-filter:blur(10px)';
    panel.innerHTML='<div style="width:min(94vw,620px);padding:20px;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:rgba(5,10,18,.97);color:white;font:700 12px/1.45 system-ui,sans-serif;box-shadow:0 28px 80px rgba(0,0,0,.5)"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><div style="font-size:20px;font-weight:950;letter-spacing:.08em">TGG CREATOR HUB</div><div data-v45-status style="opacity:.72;margin-top:3px">Checking Studio route…</div></div><button data-v45-close style="border:0;border-radius:9px;padding:8px 10px;font-weight:900">✕</button></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-top:16px"><button data-v45-edit>GAME EDITING STUDIO</button><button data-v45-vfx>VFX / VIDEO FX</button><button data-v45-avatar>AVATAR MAKER</button><button data-v45-recording>RECORDING STUDIO</button></div><div style="margin-top:12px;opacity:.7">Creator tools open with current world, avatar, vehicle, race, district, camera, and weather context.</div></div>';
    document.body.appendChild(panel);
    panel.querySelectorAll('button').forEach(b=>{if(!b.hasAttribute('data-v45-close'))b.style.cssText='padding:13px 12px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(255,255,255,.06);color:#fff;font-weight:900;text-align:left'});
    panel.querySelector('[data-v45-close]').onclick=()=>panel.style.display='none';
    panel.querySelector('[data-v45-edit]').textContent='TGG GAME STUDIO';
    const launchStudioV60=async path=>{
      const buildOk=window.TGGBuildFailSafeV59?.inspect?.();
      if(!buildOk){window.TGGBuildStatusPanelV58?.open?.();document.documentElement.dataset.tggStudioLaunchV60='blocked-build';return false}
      const status=panel.querySelector('[data-v45-status]');
      const activeBuild=currentWorldBuild();
      const target=new URL(path,location.origin);
      target.searchParams.set('build',activeBuild);
      target.searchParams.set('travelBand',document.documentElement.dataset.tggTravelBandV195||'core');
      if(status)status.textContent='Verifying TGG Game Studio · '+activeBuild+'…';
      let routeOk=false;
      try{
        const r=await fetch('/video-studio/?tgg-health=v60&build='+encodeURIComponent(activeBuild),{method:'GET',cache:'no-store',credentials:'same-origin'});
        const type=String(r.headers.get('content-type')||'');
        const body=type.includes('text/html')?await r.text():'';
        routeOk=!!(r.ok&&type.includes('text/html')&&/video|studio|editor|TGG/i.test(body.slice(0,14000)));
      }catch{}
      document.documentElement.dataset.tggStudioRouteV60=routeOk?'ready':'unavailable';
      document.documentElement.dataset.tggStudioLaunchV60=routeOk?'verified':'blocked-route';
      if(!routeOk){
        if(status)status.textContent='Studio route unavailable · build kept safe';
        window.TGGBuildStatusPanelV58?.open?.();
        return false;
      }
      if(status)status.textContent='Studio verified · opening '+activeBuild;
      document.documentElement.dataset.tggCreatorContextV193='1';
      document.documentElement.dataset.tggCreatorBuildV193=activeBuild;
      openCreatorTool(target.pathname+target.search);
      return true;
    };
    document.documentElement.dataset.tggStudioVerifierV60='1';
    panel.querySelector('[data-v45-edit]').onclick=()=>launchStudioV60('/video-studio/?from=tgg-world&workspace=edit&panel=media&studio=game');
    panel.querySelector('[data-v45-vfx]').onclick=()=>launchStudioV60('/video-studio/?from=tgg-world&workspace=edit&panel=effects');
    const grid=panel.querySelector('div[style*="grid-template-columns"]');
    if(grid&&!grid.querySelector('[data-v51-graphics]')){
      [['GRAPHICS: CINEMATIC','cinematic'],['GRAPHICS: MIDNIGHT','midnight'],['GRAPHICS: STREET','street'],['GRAPHICS: NATURAL','natural']].forEach(([label,preset])=>{
        const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.v51Graphics=preset;
        b.onclick=()=>{window.TGGGraphicsManifestV57?.setPreset?.(preset)||window.TGGVisualV51?.setPreset?.(preset);window.TGGVisualV51?.apply?.();window.TGGHubManagerV48?.refresh?.()};
        b.style.cssText='padding:13px 12px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(255,255,255,.06);color:#fff;font-weight:900;text-align:left';
        grid.appendChild(b);
      });
      [['GRAPHICS QUALITY: HIGH','high'],['GRAPHICS QUALITY: BALANCED','balanced']].forEach(([label,quality])=>{
        const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.v57Quality=quality;
        b.onclick=()=>{window.TGGGraphicsManifestV57?.setQuality?.(quality);window.TGGHubManagerV48?.refresh?.()};
        b.style.cssText='padding:13px 12px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(255,255,255,.06);color:#fff;font-weight:900;text-align:left';
        grid.appendChild(b);
      });
    }
    panel.querySelector('[data-v45-avatar]').onclick=()=>{
      panel.style.display='none';
      const existing=findButton(/avatar|wardrobe|character/);
      if(existing){existing.click();return}
      try{window.TGGGame?.show?.('avatar')}catch{}
    };
    panel.querySelector('[data-v45-recording]').onclick=()=>{
      panel.style.display='none';
      const existing=findButton(/recording studio|studio/);
      if(existing){existing.click();return}
      try{window.TGGGame?.show?.('studio')}catch{}
    };
  }
  let checked=false,available=null;
  const checkStudio=async()=>{
    if(checked)return available;
    checked=true;
    const status=panel.querySelector('[data-v45-status]');
    try{
      const r=await fetch('/video-studio/?tgg-health=v45&build='+encodeURIComponent(currentWorldBuild()),{method:'GET',cache:'no-store',credentials:'same-origin'});
      const type=String(r.headers.get('content-type')||'');
      const body=type.includes('text/html')?await r.text():'';
      available=!!(r.ok&&type.includes('text/html')&&/video|studio|editor|TGG/i.test(body.slice(0,12000)));
    }catch{available=false}
    document.documentElement.dataset.tggStudioRouteV45=available?'ready':'unavailable';
    if(status)status.textContent=available?'Studio route ready':'Studio route unavailable · Avatar + Recording still available';
    const edit=panel.querySelector('[data-v45-edit]'),vfx=panel.querySelector('[data-v45-vfx]');
    [edit,vfx].forEach(b=>{if(b){b.disabled=!available;b.style.opacity=available?'1':'.45'}});
    return available;
  };
  const open=()=>{panel.style.display='grid';checkStudio()};
  window.TGGCreatorHubV45={open,checkStudio,launchStudioV60:async path=>{
    const edit=panel.querySelector('[data-v45-edit]');
    if(/effects/.test(String(path||''))){panel.querySelector('[data-v45-vfx]')?.click();return true}
    edit?.click();return true
  },get available(){return available}};
  document.documentElement.dataset.tggCreatorHubV45='1';
}
function creatorTools(){
  installCreatorHubV45();
  const b=document.createElement('button');
  b.type='button';b.textContent='CREATOR HUB';b.dataset.tggCreatorTool='creator-hub';
  b.addEventListener('click',()=>window.TGGCreatorHubV45?.open?.());
  return [b];
}

function installWorldHubV46(){
  if(window.TGGWorldHubV46)return;
  let panel=document.getElementById('tgg-world-hub-v46');
  if(!panel){
    panel=document.createElement('div');panel.id='tgg-world-hub-v46';
    panel.style.cssText='position:fixed;inset:0;z-index:10038;display:none;place-items:center;background:rgba(2,5,10,.72);backdrop-filter:blur(10px)';
    panel.innerHTML='<div style="width:min(94vw,760px);padding:20px;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:rgba(5,10,18,.97);color:#fff;font:700 12px/1.45 system-ui,sans-serif;box-shadow:0 28px 80px rgba(0,0,0,.5)"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><div style="font-size:20px;font-weight:950;letter-spacing:.08em">TGG WORLD HUB</div><div data-v46-summary style="opacity:.72;margin-top:3px"></div></div><button data-v46-close style="border:0;border-radius:9px;padding:8px 10px;font-weight:900">✕</button></div><div data-v46-grid style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:16px"></div></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-v46-close]').onclick=()=>panel.style.display='none';
  }
  const make=(label,fn,group)=>{
    const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.v46Group=group||'world';
    b.style.cssText='padding:12px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(255,255,255,.06);color:#fff;font-weight:900;text-align:left';
    b.onclick=()=>window.TGGInteractionV49?.launch?.(fn);
    return b;
  };
  const render=()=>{
    const grid=panel.querySelector('[data-v46-grid]');
    const summary=panel.querySelector('[data-v46-summary]');
    const level=document.documentElement.dataset.tggCareerLevelV35||'1';
    const bank=document.documentElement.dataset.tggRaceBankV28||localStorage.getItem('tgg-race-bank-v28')||'0';
    const tier=document.documentElement.dataset.tggRaceTierV30||'ROOKIE';
    const max=document.documentElement.dataset.tggRaceMaxUnlockedTierV62||tier;
    if(summary)summary.textContent='LEVEL '+level+' · SELECTED '+tier+' · MAX '+max+' · BANK '+bank+' TGG';
    grid.replaceChildren(
      make('GARAGE / CUSTOMIZE',()=>{panel.style.display='none';window.TGGHudV44?.apply?.();document.documentElement.dataset.tggGarageFocus='1'},'garage'),
      make('UPGRADE ENGINE',()=>window.TGGGarageEconomyV29?.buy?.('engine'),'garage'),
      make('UPGRADE BRAKES',()=>window.TGGGarageEconomyV29?.buy?.('brakes'),'garage'),
      make('UPGRADE HANDLING',()=>window.TGGGarageEconomyV29?.buy?.('handling'),'garage'),
      make('UPGRADE NITROUS',()=>window.TGGGarageEconomyV29?.buy?.('nitrous'),'garage'),
      make('NEXT RACE EVENT',()=>window.TGGRaceCareerV32?.next?.(),'career'),
      make('START RACE',()=>window.TGGRaceStartGuardV34?.start?.(),'career'),
      make('RIVAL CHALLENGE',()=>window.TGGRivalShowdownV39?.select?.(),'career'),
      make('CAREER DASH',()=>{panel.style.display='none';window.TGGHudV44?.set?.('career')},'career'),
      make('ACHIEVEMENTS',()=>{document.documentElement.dataset.tggAchievementsOpen='1'},'career'),
      make('SEASON SUMMARY',()=>{document.documentElement.dataset.tggSeasonSummaryOpen='1'},'season'),
      make('CHAMPIONSHIP FINALE',()=>window.TGGChampionshipFinaleV41?.start?.(),'season'),
      make('SEASON LEGACY',()=>{document.documentElement.dataset.tggSeasonLegacyOpen='1'},'season'),
      make('NEXT SEASON',()=>window.TGGNewSeasonV42?.start?.(),'season'),
      make('HUD MODE',()=>window.TGGHudV44?.next?.(),'system')
    );
  };
  const open=()=>{render();panel.style.display='grid'};
  window.TGGWorldHubV46={open,render};
  document.documentElement.dataset.tggWorldHubV46='1';
}

function makeHubShellV47(id,title){
  let panel=document.getElementById(id);
  if(panel)return panel;
  panel=document.createElement('div');panel.id=id;
  panel.style.cssText='position:fixed;inset:0;z-index:10037;display:none;place-items:center;background:rgba(2,5,10,.72);backdrop-filter:blur(10px)';
  panel.innerHTML='<div style="width:min(94vw,720px);padding:20px;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:rgba(5,10,18,.97);color:#fff;font:700 12px/1.45 system-ui,sans-serif;box-shadow:0 28px 80px rgba(0,0,0,.5)"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><strong style="font-size:20px;letter-spacing:.08em">'+title+'</strong><button data-v47-close style="border:0;border-radius:9px;padding:8px 10px;font-weight:900">✕</button></div><div data-v47-grid style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:16px"></div></div>';
  document.body.appendChild(panel);
  panel.querySelector('[data-v47-close]').onclick=()=>panel.style.display='none';
  return panel;
}
function cloneActionV47(btn){
  const b=document.createElement('button');b.type='button';b.textContent=(btn.textContent||btn.id||'ACTION').trim();
  b.style.cssText='padding:12px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(255,255,255,.06);color:#fff;font-weight:900;text-align:left';
  b.onclick=()=>window.TGGInteractionV49?.launch?.(()=>btn.click());
  return b;
}
function installPlayHubV47(source){
  if(window.TGGPlayHubV47)return;
  const panel=makeHubShellV47('tgg-play-hub-v47','TGG PLAY HUB');
  const render=()=>{
    const grid=panel.querySelector('[data-v47-grid]');
    const items=(source||[]).filter(Boolean);
    grid.replaceChildren(...items.map(cloneActionV47));
  };
  window.TGGPlayHubV47={open:()=>{render();panel.style.display='grid'},render};
  document.documentElement.dataset.tggPlayHubV47='1';
}
function installSocialHubV47(source){
  if(window.TGGSocialHubV47)return;
  const panel=makeHubShellV47('tgg-social-hub-v47','TGG SOCIAL HUB');
  const render=()=>{
    const grid=panel.querySelector('[data-v47-grid]');
    const items=(source||[]).filter(Boolean);
    grid.replaceChildren(...items.map(cloneActionV47));
  };
  window.TGGSocialHubV47={open:()=>{render();panel.style.display='grid'},render};
  document.documentElement.dataset.tggSocialHubV47='1';
}
function installMoreHubV47(source){
  if(window.TGGMoreHubV47)return;
  const panel=makeHubShellV47('tgg-more-hub-v47','TGG SYSTEM / MORE');
  const render=()=>{
    const grid=panel.querySelector('[data-v47-grid]');
    const items=(source||[]).filter(Boolean);
    grid.replaceChildren(...items.map(cloneActionV47));
    const hud=document.createElement('button');hud.type='button';hud.textContent='HUD MODE';
    hud.style.cssText='padding:12px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(255,255,255,.06);color:#fff;font-weight:900;text-align:left';
    hud.onclick=()=>window.TGGHudV44?.next?.();grid.appendChild(hud);
    const build=document.createElement('button');build.type='button';build.textContent='BUILD / GRAPHICS STATUS';
    build.style.cssText=hud.style.cssText;
    build.onclick=()=>window.TGGBuildStatusPanelV58?.open?.();grid.appendChild(build);
  };
  window.TGGMoreHubV47={open:()=>{render();panel.style.display='grid'},render};
  document.documentElement.dataset.tggMoreHubV47='1';
}
function hubButtonV47(label,handler,id){
  const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.tggHub=id;b.addEventListener('click',handler);return b;
}

function installHubManagerV48(){
  if(window.TGGHubManagerV48)return;
  const ids=['tgg-play-hub-v47','tgg-world-hub-v46','tgg-creator-hub-v45','tgg-social-hub-v47','tgg-more-hub-v47'];
  let active='';
  const closeAll=(except)=>{
    ids.forEach(id=>{if(id!==except){const el=document.getElementById(id);if(el)el.style.display='none'}});
    if(!except)active='';
    document.documentElement.dataset.tggActiveHubV48=except||'none';
  };
  const open=(id)=>{
    closeAll(id);
    const el=document.getElementById(id);
    if(el){el.style.display='grid';active=id}
    document.documentElement.dataset.tggActiveHubV48=id||'none';
    return !!el;
  };
  const decorate=(id,labelFn)=>{
    const el=document.getElementById(id);if(!el)return;
    const card=el.firstElementChild;if(!card)return;
    let line=card.querySelector('[data-v48-summary]');
    if(!line){
      line=document.createElement('div');line.dataset.v48Summary='1';
      line.style.cssText='margin-top:6px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.045);color:#bdefff;font-weight:800';
      const header=card.firstElementChild;
      if(header?.nextSibling)card.insertBefore(line,header.nextSibling);else card.appendChild(line);
    }
    line.textContent=labelFn();
  };
  const refresh=()=>{
    const root=document.documentElement;
    const game=window.TGGGame?.getState?.()||{};
    decorate('tgg-play-hub-v47',()=>game.inVehicle?'DRIVING · '+String(root.dataset.tggDistrict||'downtown').toUpperCase():'ON FOOT · '+String(root.dataset.tggDistrict||'downtown').toUpperCase());
    decorate('tgg-world-hub-v46',()=> 'LEVEL '+(root.dataset.tggCareerLevelV35||'1')+' · '+(root.dataset.tggRaceTierV30||'ROOKIE')+' · '+(root.dataset.tggRaceBankV28||localStorage.getItem('tgg-race-bank-v28')||'0')+' TGG');
    decorate('tgg-creator-hub-v45',()=> 'STUDIO '+String(root.dataset.tggStudioRouteV45||'CHECKING').toUpperCase()+' · AVATAR '+String(root.dataset.tggAvatarOutfit||'DEFAULT').toUpperCase());
    decorate('tgg-social-hub-v47',()=> 'CREW REP '+(root.dataset.tggCrewRepV40||localStorage.getItem('tgg-crew-rep-v40')||'0')+' · RANK '+(root.dataset.tggCrewRankV41||'ROOKIE'));
    decorate('tgg-more-hub-v47',()=> 'HUD '+String(root.dataset.tggHudModeV44||'compact').toUpperCase()+' · WORLD '+String(root.dataset.tggTime||'day').toUpperCase());
    document.documentElement.dataset.tggHubSummariesV48='1';
  };
  const wrap=(obj,id)=>{
    if(!obj?.open||obj.__v48)return;
    const old=obj.open.bind(obj);
    obj.open=()=>{closeAll(id);const r=old();active=id;document.documentElement.dataset.tggActiveHubV48=id;refresh();return r};
    obj.__v48=true;
  };
  wrap(window.TGGPlayHubV47,'tgg-play-hub-v47');
  wrap(window.TGGWorldHubV46,'tgg-world-hub-v46');
  wrap(window.TGGCreatorHubV45,'tgg-creator-hub-v45');
  wrap(window.TGGSocialHubV47,'tgg-social-hub-v47');
  wrap(window.TGGMoreHubV47,'tgg-more-hub-v47');
  document.addEventListener('click',e=>{
    const close=e.target?.closest?.('[data-v47-close],[data-v45-close],[data-v46-close]');
    if(close){setTimeout(()=>{active='';document.documentElement.dataset.tggActiveHubV48='none'},0)}
  });
  window.TGGHubManagerV48={open,closeAll,refresh,get active(){return active}};
  refresh();
  document.documentElement.dataset.tggHubManagerV48='1';
}

function installInteractionPolishV49(){
  if(window.TGGInteractionV49)return;
  const close=()=>window.TGGHubManagerV48?.closeAll?.();
  const launch=(fn)=>{close();try{return fn?.()}catch{return false}};
  const setHud=(mode)=>window.TGGHudV44?.set?.(mode)||window.TGGHudV44?.apply?.();
  const openByIndex=(n)=>{
    const map=[
      ['tgg-play-hub-v47',()=>window.TGGPlayHubV47?.open?.()],
      ['tgg-world-hub-v46',()=>window.TGGWorldHubV46?.open?.()],
      ['tgg-creator-hub-v45',()=>window.TGGCreatorHubV45?.open?.()],
      ['tgg-social-hub-v47',()=>window.TGGSocialHubV47?.open?.()],
      ['tgg-more-hub-v47',()=>window.TGGMoreHubV47?.open?.()]
    ];
    const item=map[n-1];if(!item)return false;
    close();item[1]();return true;
  };
  document.addEventListener('keydown',e=>{
    if(/input|textarea|select/i.test(document.activeElement?.tagName||''))return;
    if(e.altKey&&/^[1-5]$/.test(e.key)){e.preventDefault();openByIndex(Number(e.key))}
    if(e.altKey&&e.key.toLowerCase()==='h'){e.preventDefault();setHud('compact')}
  });
  window.addEventListener('gamepadconnected',()=>{document.documentElement.dataset.tggGamepadNavV49='ready'});
  const gamepadLoop=()=>{
    try{
      const gp=navigator.getGamepads?.()?.find(Boolean);
      const root=document.documentElement;
      const racing=root.dataset.tggRaceMode==='on';
      const driving=root.dataset.tggDriving==='1'||window.TGGGame?.getState?.()?.inVehicle===true;
      const gameplayLocked=racing||driving;
      root.dataset.tggGameplayInputGuardV73=gameplayLocked?'locked-gameplay':'hub-nav';
      if(gp&&!gameplayLocked){
        const now=performance.now(),last=Number(root.dataset.tggGamepadNavStampV49||0);
        if(now-last>450){
          const pressed=gp.buttons?.findIndex?.((b,i)=>i<5&&b?.pressed);
          if(pressed>=0){openByIndex(pressed+1);root.dataset.tggGamepadNavStampV49=String(now)}
        }
      }
    }catch{}
    requestAnimationFrame(gamepadLoop);
  };
  gamepadLoop();
  window.TGGInteractionV49={close,launch,setHud,openByIndex};
  document.documentElement.dataset.tggInteractionPolishV49='1';document.documentElement.dataset.tggCleanerInputGuardV73='1';
}

function installBuildStatusPanelV58(){
  if(window.TGGBuildStatusPanelV58)return;
  let panel=document.getElementById('tgg-build-status-v58');
  if(!panel){
    panel=document.createElement('div');panel.id='tgg-build-status-v58';
    panel.style.cssText='position:fixed;inset:0;z-index:10045;display:none;place-items:center;background:rgba(2,5,10,.74);backdrop-filter:blur(10px)';
    panel.innerHTML='<div style="width:min(92vw,560px);padding:20px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(5,10,18,.98);color:#fff;font:700 12px/1.55 system-ui,sans-serif"><div style="display:flex;justify-content:space-between;align-items:center"><strong style="font-size:19px">TGG BUILD STATUS</strong><button data-v58-close>✕</button></div><div data-v58-body style="margin-top:12px"></div></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-v58-close]').onclick=()=>panel.style.display='none';
  }
  const render=()=>{
    const s=window.TGGBuildIntegrityV58?.inspect?.()||window.TGGBuildStatusV58||{};
    const a=s.actual||{},ok=!!s.ok;
    panel.querySelector('[data-v58-body]').innerHTML=
      '<div style="font-size:15px;color:'+(ok?'#7dffb3':'#ff9a9a')+'">'+(ok?'BUILD MATCH':'BUILD MISMATCH')+'</div>'+
      '<div>OVERLAY '+(a.overlay||'-')+'</div>'+
      '<div>MASTER JS '+(a.masterJs||'-')+'</div>'+
      '<div>MASTER CSS '+(a.masterCss||'-')+'</div>'+
      '<div>CLEANER JS '+(a.cleanerJs||'-')+'</div>'+
      '<div>CLEANER CSS '+(a.cleanerCss||'-')+'</div>'+
      '<div>GRAPHICS MANIFEST '+(document.documentElement.dataset.tggGraphicsManifestV57||'-')+'</div>'+
      '<div>PRESET '+(document.documentElement.dataset.tggGraphicsManifestPresetV57||'-')+'</div>'+
      '<div>QUALITY '+(document.documentElement.dataset.tggGraphicsManifestQualityV57||'-')+'</div>'+
      '<div>RECOVERY '+(document.documentElement.dataset.tggBuildRecoveryV60||'-')+'</div>'+
      '<div>STUDIO ROUTE '+(document.documentElement.dataset.tggStudioRouteV60||document.documentElement.dataset.tggStudioRouteV45||'-')+'</div>'+
      (ok?'':'<button data-v59-reload style="margin-top:12px;width:100%;padding:11px;border:0;border-radius:10px;font-weight:950">RELOAD LATEST BUILD</button>');
    const reload=panel.querySelector('[data-v59-reload]');
    if(reload)reload.onclick=()=>window.TGGBuildRecoveryV60?.recover?.()||window.TGGBuildFailSafeV59?.reloadLatest?.();
    document.documentElement.dataset.tggBuildStatusPanelV58='1';
  };
  const open=()=>{render();window.TGGHubManagerV48?.closeAll?.();panel.style.display='grid'};
  window.TGGBuildStatusPanelV58={open,render};
  render();
}
function install(){
const game=document.querySelector("#game"),actions=game?.querySelector(".actions");
if(!game||!actions||document.querySelector("#tgg-clean-hud"))return false;
document.documentElement.dataset.tggCleanUi="1";
actions.setAttribute("aria-hidden","true");actions.dataset.tggNavigationOwner="v48";
const hud=document.createElement("div");hud.id="tgg-clean-hud";
const tray=document.createElement("div");tray.id="tgg-clean-tray";tray.dataset.open="0";
const nav=document.createElement("div");nav.id="tgg-clean-nav";
const raw={play:[],world:[],create:[],social:[],more:[]};
[...actions.querySelectorAll("button")].forEach(btn=>raw[groupFor(btn)].push(btn));

installCreatorHubV45();
installWorldHubV46();
installPlayHubV47(raw.play);
installSocialHubV47(raw.social);
installMoreHubV47(raw.more);
installHubManagerV48();
installInteractionPolishV49();
installBuildStatusPanelV58();

const buckets={
  play:[hubButtonV47('PLAY HUB',()=>window.TGGPlayHubV47?.open?.(),'play-hub')],
  world:[hubButtonV47('WORLD HUB',()=>window.TGGWorldHubV46?.open?.(),'world-hub')],
  create:creatorTools(),
  social:[hubButtonV47('SOCIAL HUB',()=>window.TGGSocialHubV47?.open?.(),'social-hub')],
  more:[hubButtonV47('SYSTEM / MORE',()=>window.TGGMoreHubV47?.open?.(),'more-hub')]
};

let active="";
function render(name){
if(active===name){active="";tray.dataset.open="0";tray.replaceChildren()}
else{active=name;tray.replaceChildren(...buckets[name]);tray.dataset.open=buckets[name].length?"1":"0"}
[...nav.querySelectorAll("button[data-group]")].forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.group===active)))
}
[["play","PLAY"],["world","WORLD"],["create","CREATE"],["social","SOCIAL"],["more","MORE"]].forEach(([name,label])=>{
const b=document.createElement("button");b.type="button";b.dataset.group=name;b.textContent=label;b.setAttribute("aria-pressed","false");b.addEventListener("click",()=>render(name));nav.appendChild(b)
});
const focus=document.createElement("button");focus.type="button";focus.dataset.tggFocus="1";focus.textContent="FOCUS";focus.setAttribute("aria-pressed","false");
focus.addEventListener("click",()=>{const on=document.documentElement.dataset.tggFocus==="1";document.documentElement.dataset.tggFocus=on?"0":"1";focus.setAttribute("aria-pressed",String(!on));focus.textContent=on?"FOCUS":"FOCUS ON"});
nav.appendChild(focus);hud.append(tray,nav);game.appendChild(hud);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){active="";tray.dataset.open="0";tray.replaceChildren();window.TGGHubManagerV48?.closeAll?.();[...nav.querySelectorAll("button[data-group]")].forEach(b=>b.setAttribute("aria-pressed","false"))}if(e.key.toLowerCase()==="f"&&!/input|textarea|select/i.test(document.activeElement?.tagName||""))focus.click()});
window.TGGScreenCleaner={groups:Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,v.map(x=>x.id||x.textContent?.trim())])),focus:on=>document.documentElement.dataset.tggFocus=on?"1":"0",openCreatorTool};
document.documentElement.dataset.tggCreatorHub="1";
document.documentElement.dataset.tggCreatorAssetBridge="1";
document.documentElement.dataset.tggUnifiedNavigationV47="1";
document.documentElement.dataset.tggUnifiedNavigationV48="1";
document.dispatchEvent(new CustomEvent("tgg-screen-cleaner-ready",{detail:window.TGGScreenCleaner.groups}));
return true}
if(!install()){const mo=new MutationObserver(()=>{if(install())mo.disconnect()});mo.observe(document.documentElement,{subtree:true,childList:true})}
})();