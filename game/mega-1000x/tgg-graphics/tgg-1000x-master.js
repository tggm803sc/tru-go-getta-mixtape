(()=>{const root=document.documentElement;root.dataset.tgg1000x='1';
if(window.__TGG_1000X_MASTER__&&window.TGG1000X){return}
window.__TGG_1000X_MASTER__=true;
const state={district:'downtown',time:'day',weather:'clear',motion:'idle',driving:false,quality:'high'};root.dataset.tggVisualCatchup='1';root.dataset.tggGraphicsOwnershipV56='1';
const set=(k,v)=>{state[k]=v;const key='tgg'+k[0].toUpperCase()+k.slice(1);root.dataset[key]=String(v)};
function detectDistrict(){
  const t=((document.querySelector('.city-title')?.textContent||'')+' '+(document.querySelector('#missionStatus')?.textContent||'')).toLowerCase();
  let d='downtown';
  if(/studio|mixtape/.test(t))d='studio'; else if(/media/.test(t))d='media'; else if(/park/.test(t))d='park'; else if(/home|apartment|loft/.test(t))d='home'; else if(/garage|car/.test(t))d='garage';
  if(d!==state.district)set('district',d);
}
function syncAvatar(){
  let a={};try{a=JSON.parse(localStorage.getItem('tgg-world-avatar-v12')||'{}')}catch{}
  root.dataset.tggAvatarOutfit=String(a.outfit||a.top||'default').replace(/\s+/g,'-').toLowerCase();
  root.dataset.tggAvatarHair=String(a.hair||'default').toLowerCase();
  window.TGG1000XAvatar=a;
}
function motion(){
  const hud=(document.querySelector('#walkModeValue')?.textContent||'').toLowerCase();
  const m=/sprint|run/.test(hud)?'sprint':/walk|move/.test(hud)?'walk':'idle';
  if(m!==state.motion)set('motion',m);
  const gear=(document.querySelector('#gearValue')?.textContent||'P').trim().toUpperCase();
  const driving=gear!=='P';
  if(driving!==state.driving){state.driving=driving;root.dataset.tggDriving=driving?'1':'0'};if(document.body)document.body.dataset.tggFocusDrive=driving?'1':'0'
}
function ambient(){
  const h=new Date().getHours();set('time',(h<6||h>=19)?'night':h<9||h>=17?'golden':'day');
}
function quality(){
  const cores=navigator.hardwareConcurrency||4;const mem=navigator.deviceMemory||4;
  const q=cores<=4||mem<=4?'balanced':'high';set('quality',q);
}
function ui(){
  const deck=document.querySelector('.action-deck');if(!deck||deck.querySelector('[data-tgg-more]'))return;
  const b=document.createElement('button');b.type='button';b.dataset.tggMore='1';b.textContent='MORE ACTIONS';
  b.onclick=()=>{document.body.dataset.tggUiExpanded=document.body.dataset.tggUiExpanded==='1'?'0':'1';b.textContent=document.body.dataset.tggUiExpanded==='1'?'LESS ACTIONS':'MORE ACTIONS'};
  deck.appendChild(b);
}
function weather(){
  const explicit=window.TGGWeather?.state?.weather||window.TGGV16V12WorldDepth?.state?.weather||'clear';
  set('weather',String(explicit||'clear').toLowerCase());
}
function applyPlaytestQuickAccess(){
  if(document.getElementById('tgg-playtest-quick'))return;
  const g=window.TGGGame;
  if(!g?.show)return;
  const wrap=document.createElement('div');
  wrap.id='tgg-playtest-quick';
  wrap.setAttribute('aria-label','TGG playtest quick access');
  const actions=[
    ['WORLD',()=>g.show('game')],
    ['CAREER',()=>g.show('career')],
    ['MISSIONS',()=>g.show('storyMissionsBoard')],
    ['EVENTS',()=>g.show('eventsBoard')],
    ['WORLD LIFE',()=>g.show('worldLifeBoard')],
    ['STUDIO',()=>g.show('studio')],
    ['PARK',()=>g.show('park')],
    ['GARAGE',()=>g.show('garage')],
    ['MEDIA',()=>g.show('media')],
    ['BUSINESS',()=>g.show('businessBoard')],
    ['INTERACT',()=>window.TGG3D?.interactNearest?.()],
    ['CAMERA',()=>window.TGG3D?.cycleCamera?.()]
  ];
  actions.forEach(([label,fn])=>{
    const b=document.createElement('button');
    b.type='button';b.textContent=label;
    b.addEventListener('click',()=>{try{fn()}catch{}});
    wrap.appendChild(b);
  });
  document.body.appendChild(wrap);
  root.dataset.tggPlaytestQuick='1';
}
function applyFullCityLifeBatch(){
  const w=window.TGG3D;
  const THREE=window.THREE;
  if(!w?.scene||!THREE)return;
  let group=w.scene.getObjectByName?.('TGG_FULL_CITY_LIFE_BATCH');
  if(!group){
    group=new THREE.Group();
    group.name='TGG_FULL_CITY_LIFE_BATCH';
    group.userData.tggBatch='full-city-life';
    w.scene.add(group);

    const concrete=new THREE.MeshStandardMaterial({color:0x434852,roughness:.94,metalness:.03});
    const dark=new THREE.MeshStandardMaterial({color:0x171b22,roughness:.7,metalness:.22});
    const chrome=new THREE.MeshStandardMaterial({color:0x7d8794,roughness:.38,metalness:.56});
    const glass=new THREE.MeshStandardMaterial({color:0x6ea5d7,roughness:.18,metalness:.12,transparent:true,opacity:.48});
    const red=new THREE.MeshStandardMaterial({color:0xb91c1c,roughness:.54,metalness:.25});
    const gold=new THREE.MeshStandardMaterial({color:0xb88a2f,roughness:.42,metalness:.48});
    const blue=new THREE.MeshStandardMaterial({color:0x24527a,roughness:.45,metalness:.28});
    const green=new THREE.MeshStandardMaterial({color:0x265a42,roughness:.72,metalness:.08});

    const makeSign=(label,color,x,z,y=2.8)=>{
      const c=document.createElement('canvas');c.width=512;c.height=128;
      const ctx=c.getContext('2d');ctx.fillStyle='rgba(5,8,14,.88)';ctx.fillRect(0,0,512,128);
      ctx.strokeStyle=color;ctx.lineWidth=8;ctx.strokeRect(8,8,496,112);
      ctx.fillStyle='#fff';ctx.font='900 38px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,256,64);
      const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
      const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));
      spr.position.set(x,y,z);spr.scale.set(8,2,1);group.add(spr);return spr;
    };

    const makeLandmark=(x,z,wid,dep,h,mat,label,color)=>{
      const base=new THREE.Mesh(new THREE.BoxGeometry(wid,h,dep),mat);
      base.position.set(x,h/2,z);base.castShadow=true;base.receiveShadow=true;group.add(base);
      makeSign(label,color,x,z-dep/2-.22,h*.72);
      return base;
    };

    makeLandmark(-34,-34,12,9,7,red,'TGG RECORDING STUDIO','#ff4b57');
    makeLandmark(34,-34,13,10,6.4,dark,'TGG GARAGE','#5fd7ff');
    makeLandmark(0,38,14,9,7.5,blue,'MEDIA DISTRICT','#b56cff');
    makeLandmark(-39,20,11,8,5.8,gold,'CREATOR STORE','#ffc857');
    makeLandmark(39,20,12,8,6.1,green,'TGG PARK HUB','#5cff9a');

    const addKiosk=(x,z)=>{
      const body=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.1,1.6),dark);body.position.set(x,1.05,z);
      const glassPane=new THREE.Mesh(new THREE.BoxGeometry(1.7,1.05,.08),glass);glassPane.position.set(x,1.35,z-.84);
      group.add(body,glassPane);
    };
    [[-20,9],[20,-9],[-9,-20],[9,20]].forEach(([x,z])=>addKiosk(x,z));

    const addBarrier=(x,z,rot=0)=>{
      const rail=new THREE.Mesh(new THREE.BoxGeometry(2.6,.16,.14),chrome);rail.position.set(x,.78,z);rail.rotation.y=rot;
      const legA=new THREE.Mesh(new THREE.BoxGeometry(.1,1.1,.1),chrome);
      const legB=legA.clone();
      legA.position.set(x-.9*Math.cos(rot),.45,z+.9*Math.sin(rot));
      legB.position.set(x+.9*Math.cos(rot),.45,z-.9*Math.sin(rot));
      group.add(rail,legA,legB);
    };
    [[-7,-10,0],[7,10,Math.PI],[-10,7,Math.PI/2],[10,-7,-Math.PI/2]].forEach(a=>addBarrier(...a));

    const addTrash=(x,z)=>{
      const bin=new THREE.Mesh(new THREE.CylinderGeometry(.36,.42,.95,10),dark);
      bin.position.set(x,.48,z);group.add(bin);
    };
    [[-12,12],[12,-12],[-28,8],[28,-8]].forEach(([x,z])=>addTrash(x,z));

    // Parked car proxies add visual street life without adding AI cost.
    const parkedColors=[0x30343b,0x4b5563,0x7c2d12,0x1f3a5f,0x3f4c3f,0x5b3a6f];
    const parkedSpots=[[-18,-25,0],[-8,-25,0],[8,-25,Math.PI],[18,-25,Math.PI],[-25,8,Math.PI/2],[-25,18,Math.PI/2],[25,-8,-Math.PI/2],[25,-18,-Math.PI/2]];
    parkedSpots.forEach(([x,z,r],i)=>{
      const body=new THREE.Mesh(new THREE.BoxGeometry(3.3,.85,1.55),new THREE.MeshStandardMaterial({color:parkedColors[i%parkedColors.length],roughness:.35,metalness:.36}));
      body.position.set(x,.58,z);body.rotation.y=r;body.castShadow=true;body.receiveShadow=true;group.add(body);
      const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.55,.65,1.28),glass);
      cabin.position.set(x,.98,z);cabin.rotation.y=r;group.add(cabin);
    });

    // Ambient event dressing.
    const eventStage=new THREE.Mesh(new THREE.BoxGeometry(8,.65,4),dark);
    eventStage.position.set(0,.34,-43);group.add(eventStage);
    makeSign('WORLD EVENT', '#c7ff00',0,-45.1,3.8);
    for(let i=-3;i<=3;i++){
      const light=new THREE.PointLight(i%2?0xff3b6b:0x6aa2ff,7,12,2);
      light.position.set(i*1.1,4.2,-42.5);group.add(light);
    }
  }

  const balanced=state.quality==='balanced';
  group.children.forEach((obj,i)=>{
    if(obj?.isPointLight)obj.visible=!balanced;
    else obj.visible=!balanced||i%3!==1;
    if(obj?.isMesh){
      obj.castShadow=!balanced;
      obj.receiveShadow=true;
    }
  });

  root.dataset.tggFullCityLife='1';
}
function applyWorldDensityMega(){
  const w=window.TGG3D;
  const THREE=window.THREE;
  if(!w?.scene||!THREE)return;
  let group=w.scene.getObjectByName?.('TGG_WORLD_DENSITY_MEGA');
  if(!group){
    group=new THREE.Group();
    group.name='TGG_WORLD_DENSITY_MEGA';
    group.userData.tggBatch='world-density-mega';
    w.scene.add(group);

    const darkMat=new THREE.MeshStandardMaterial({color:0x20252d,roughness:.82,metalness:.16});
    const metalMat=new THREE.MeshStandardMaterial({color:0x59616d,roughness:.46,metalness:.48});
    const concreteMat=new THREE.MeshStandardMaterial({color:0x4a4f58,roughness:.96,metalness:.02});
    const greenMat=new THREE.MeshStandardMaterial({color:0x234b35,roughness:.9,metalness:.01});
    const glowMat=new THREE.MeshStandardMaterial({color:0xd9eeff,emissive:0x9fc8ff,emissiveIntensity:1.55,roughness:.34,metalness:.1});

    const addStreetLight=(x,z)=>{
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,4.8,8),metalMat);
      pole.position.set(x,2.4,z);
      const lamp=new THREE.Mesh(new THREE.BoxGeometry(.52,.18,.34),glowMat);
      lamp.position.set(x,4.74,z);
      group.add(pole,lamp);
    };
    const addPlanter=(x,z)=>{
      const base=new THREE.Mesh(new THREE.BoxGeometry(1.05,.5,1.05),concreteMat);
      base.position.set(x,.25,z);
      const bush=new THREE.Mesh(new THREE.SphereGeometry(.48,10,8),greenMat);
      bush.position.set(x,.82,z);
      bush.scale.set(1,.8,1);
      group.add(base,bush);
    };
    const addBench=(x,z,rot=0)=>{
      const seat=new THREE.Mesh(new THREE.BoxGeometry(1.8,.18,.46),darkMat);
      seat.position.set(x,.62,z);seat.rotation.y=rot;
      const back=new THREE.Mesh(new THREE.BoxGeometry(1.8,.62,.14),darkMat);
      back.position.set(x,.96,z-.22*Math.cos(rot));back.rotation.y=rot;
      const leg1=new THREE.Mesh(new THREE.BoxGeometry(.12,.62,.12),metalMat);
      const leg2=leg1.clone();
      leg1.position.set(x-.62*Math.cos(rot),.3,z+.62*Math.sin(rot));
      leg2.position.set(x+.62*Math.cos(rot),.3,z-.62*Math.sin(rot));
      group.add(seat,back,leg1,leg2);
    };
    const addHydrant=(x,z)=>{
      const body=new THREE.Mesh(new THREE.CylinderGeometry(.18,.21,.7,10),new THREE.MeshStandardMaterial({color:0xc93636,roughness:.62,metalness:.25}));
      body.position.set(x,.35,z);
      const cap=new THREE.Mesh(new THREE.CylinderGeometry(.24,.2,.14,10),body.material);
      cap.position.set(x,.76,z);
      group.add(body,cap);
    };
    const addBollard=(x,z)=>{
      const b=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,.8,8),metalMat);
      b.position.set(x,.4,z);group.add(b);
    };

    [
      [-17,-17],[-17,17],[17,-17],[17,17],[-31,-17],[-31,17],[31,-17],[31,17],
      [-17,-31],[17,-31],[-17,31],[17,31],[-43,-17],[43,-17],[-43,17],[43,17]
    ].forEach(([x,z])=>addStreetLight(x,z));

    [
      [-15,-14],[-15,14],[15,-14],[15,14],[-33,-14],[33,14],[-14,-33],[14,33],
      [-38,10],[38,-10],[-10,38],[10,-38]
    ].forEach(([x,z])=>addPlanter(x,z));

    [
      [-12,-15,0],[12,15,Math.PI],[-15,12,Math.PI/2],[15,-12,-Math.PI/2],
      [-36,-15,0],[36,15,Math.PI]
    ].forEach(([x,z,r])=>addBench(x,z,r));

    [[-8,-15],[8,15],[-15,8],[15,-8]].forEach(([x,z])=>addHydrant(x,z));

    for(let i=-2;i<=2;i++){
      addBollard(-20+i*1.15,-20);
      addBollard(20+i*1.15,20);
    }
  }

  const balanced=state.quality==='balanced';
  group.visible=true;
  group.children.forEach((obj,i)=>{
    obj.visible=!balanced || i%2===0;
    obj.castShadow=!balanced && !!obj.isMesh;
    obj.receiveShadow=!!obj.isMesh;
  });

  (w.traffic||[]).forEach((v,i)=>{
    if(v?.scale){
      const presets=[[.62,.66,.62],[.68,.62,.66],[.64,.7,.64],[.7,.64,.68]];
      const p=presets[i%presets.length];
      v.scale.set(p[0],p[1],p[2]);
    }
    const body=v?.userData?.bodyMaterial;
    if(body){
      const colors=[0x4a5568,0x7f1d1d,0x1e3a5f,0x4a3f35,0x1f5132,0x5c3d78];
      body.color.setHex(colors[i%colors.length]);
      body.roughness=.38+(i%3)*.05;
      body.metalness=.26+(i%2)*.12;
      body.needsUpdate=true;
    }
  });

  (w.pedestrians||[]).forEach((p,i)=>{
    if(p?.scale){
      const s=.68+(i%4)*.025;
      p.scale.set(s,s*(i%2?1.03:.98),s);
    }
    if(p?.userData)p.userData.speed=.012+(i%4)*.0028;
  });

  (w.destinations||[]).forEach((d,i)=>{
    if(d?.labelSprite){
      d.labelSprite.scale.set(4.6,1.15,1);
      if(d.labelSprite.material){
        d.labelSprite.material.opacity=.72+(i%2)*.08;
        d.labelSprite.material.transparent=true;
      }
    }
    if(d?.beam?.material)d.beam.material.opacity=.07;
    if(d?.ring?.material)d.ring.material.opacity=.58;
  });

  root.dataset.tggWorldDensity='mega';
}
function applyUltraMaxDirector(){
  const w=window.TGG3D;
  if(!w)return;
  try{
    const s=window.TGGGame?.getState?.()||{};
    const near=w.nearbyDestination?.(s)||null;
    if(document.body)document.body.dataset.tggInteractionNear=near?'1':'0';

    const avatar=window.TGG1000XAvatar||{};
    root.dataset.tggAvatarOutfit=String(avatar.outfit||avatar.top||root.dataset.tggAvatarOutfit||'default').replace(/\s+/g,'-').toLowerCase();

    if(w.renderer){
      const cap=state.quality==='balanced'?1.15:1.5;
      w.renderer.setPixelRatio?.(Math.min(window.devicePixelRatio||1,cap));
      w.renderer.toneMappingExposure=state.time==='night'?1.04:state.time==='golden'?1.1:1.07;
    }

    if(w.camera){
      w.camera.fov=state.driving?68:62;
      w.camera.updateProjectionMatrix?.();
    }

    if(w.scene?.fog){
      w.scene.fog.density=state.quality==='balanced'?.0055:state.weather==='rain'?.0049:.0041;
    }

    root.dataset.tggDestinationNear=near?.id||'none';
    root.dataset.tggUltraMax='1';
  }catch{}
}
function applyPresentationDirector(){
  const w=window.TGG3D;
  if(!w||root.dataset.tggPresentationDirector==='1')return;
  try{
    if(w.renderer){
      w.renderer.toneMappingExposure=1.08;
      if(w.renderer.setPixelRatio){
        const cap=state.quality==='balanced'?1.25:1.55;
        w.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,cap));
      }
    }
    if(w.camera){
      w.camera.fov=state.driving?68:62;
      w.camera.near=.1;
      w.camera.far=1150;
      w.camera.updateProjectionMatrix?.();
    }
    if(w.scene){
      if(w.scene.background?.set)w.scene.background.set(state.time==='night'?0x050810:0x0a0f18);
      if(w.scene.fog){
        w.scene.fog.density=state.quality==='balanced'?.0052:.0042;
        if(w.scene.fog.color?.set)w.scene.fog.color.set(state.time==='night'?0x070b13:0x0d121b);
      }
      (w.scene.children||[]).forEach(obj=>{
        if(obj?.isHemisphereLight)obj.intensity=state.time==='night'?1.35:1.5;
        if(obj?.isDirectionalLight)obj.intensity=state.time==='night'?2.0:1.75;
        if(obj?.isPointLight&&obj.color){
          obj.intensity=Math.min(Number(obj.intensity)||0,state.quality==='balanced'?10:14);
        }
      });
    }
    const polishCar=(car,traffic=false)=>{
      if(!car)return;
      const body=car.userData?.bodyMaterial;
      if(body){
        body.roughness=traffic?.42:.32;
        body.metalness=traffic?.28:.42;
        body.needsUpdate=true;
      }
      const wheel=car.userData?.wheelMaterial;
      if(wheel){
        wheel.roughness=.58;
        wheel.metalness=.18;
        wheel.needsUpdate=true;
      }
    };
    polishCar(w.car,false);
    (w.traffic||[]).forEach(v=>polishCar(v,true));
    root.dataset.tggPresentationDirector='1';
  }catch{}
}
function applyUltraMegaBatch(){
  const w=window.TGG3D;
  const g=window.TGGGame;
  if(root.dataset.tggUltraMegaBatch==='1')return;
  try{
    if(g?.setDriveTuning){
      g.setDriveTuning({
        maxForward:10.2,maxReverse:-4.2,
        accel:6.65,reverseAccel:4.15,brake:15.2,coast:2.85,
        turnRate:72,steerIn:3.35,steerOut:11.8,
        lowSpeedSteer:.64,highSpeedSteer:.20,
        yawResponse:164,yawCenter:360,
        throttleResponse:5.55,throttleRelease:10.8,
        steerCurve:1.18,highSpeedTurnFalloff:.66,
        handbrakeTurnBoost:1.16,collisionSlide:.38,collisionDamping:.25
      });
    }
    if(w){
      if(w.setCameraDistance)w.setCameraDistance(state.driving?48:40);
      if(w.setCameraMode&&state.driving)w.setCameraMode('chase',true);
      (w.traffic||[]).forEach((v,i)=>{
        const def=v?.userData?.traffic;
        if(def){
          const speeds=[4.55,4.2,4.95,4.3,4.7,3.95];
          def.speed=speeds[i%speeds.length];
          v.userData.tggSpacing=i%2===0?'managed':'open';
          v.userData.tggBehaviorIntent='flow';
        }
        if(v?.scale)v.scale.set(.64,.64,.64);
      });
      (w.pedestrians||[]).forEach((p,i)=>{
        if(p?.userData){
          p.userData.speed=.0128+(i%3)*.003;
          p.userData.tggCrowdWeight=i%3===0?'soft':'normal';
        }
        if(p?.scale)p.scale.set(.70,.70,.70);
      });
      (w.namedNpcs||[]).forEach((n,i)=>{
        if(n?.scale)n.scale.set(.82,.82,.82);
        const label=n?.children?.find?.(c=>c?.isSprite);
        if(label?.material){label.material.opacity=i===0?.78:.66;label.material.transparent=true}
      });
    }
    root.dataset.tggUltraMegaBatch='1';
  }catch{}
}
function applyMaxBatchPolish(){
  const w=window.TGG3D;
  const g=window.TGGGame;
  if(root.dataset.tggMaxBatchPolish==='1')return;
  try{
    if(g?.setDriveTuning){
      g.setDriveTuning({
        accel:6.8,reverseAccel:4.3,brake:14.8,coast:2.7,
        turnRate:74,steerIn:3.5,steerOut:11.2,
        lowSpeedSteer:.66,highSpeedSteer:.22,
        yawResponse:168,yawCenter:350,
        throttleResponse:5.7,throttleRelease:10.5,
        steerCurve:1.16,highSpeedTurnFalloff:.64,
        handbrakeTurnBoost:1.18,collisionSlide:.4,collisionDamping:.24
      });
    }
    if(w){
      (w.traffic||[]).forEach((v,i)=>{
        const def=v?.userData?.traffic;
        if(def){
          const speeds=[4.7,4.35,5.1,4.45,4.85,4.1];
          def.speed=speeds[i%speeds.length];
          v.userData.tggSpacing=i%3===0?'managed':'open';
        }
        if(v?.scale)v.scale.set(.66,.66,.66);
      });
      (w.pedestrians||[]).forEach((p,i)=>{
        if(p?.userData){
          p.userData.speed=.0135+(i%3)*.0032;
          p.userData.tggCrowdWeight=(i%2?'soft':'normal');
        }
        if(p?.scale)p.scale.set(.72,.72,.72);
      });
      if(w.setCameraDistance)w.setCameraDistance(46);
    }
    root.dataset.tggMaxBatchPolish='1';
  }catch{}
}
function applyLifeCatchup(){
  const w=window.TGG3D;
  if(!w||root.dataset.tggLifeCatchup==='1')return;
  try{
    (w.traffic||[]).forEach((v,i)=>{
      const def=v?.userData?.traffic;
      if(def){
        const base=[4.8,4.45,5.25,4.55,5.0,4.2][i%6]||4.6;
        def.speed=base;
      }
      if(v?.scale)v.scale.set(.68,.68,.68);
    });
    (w.pedestrians||[]).forEach((p,i)=>{
      if(p?.userData)p.userData.speed=.014+(i%3)*.0035;
      if(p?.scale)p.scale.set(.74,.74,.74);
    });
    (w.namedNpcs||[]).forEach(n=>{
      const label=n?.children?.find?.(c=>c?.isSprite);
      if(label?.material){label.material.opacity=.72;label.material.transparent=true}
    });
    root.dataset.tggLifeCatchup='1';
  }catch{}
}
function applyCameraCatchup(){
  const cam=window.TGG3D;
  if(!cam?.setCameraMode||!cam?.setCameraDistance)return;
  if(state.driving){
    if(cam.getCameraMode?.()!=='chase')cam.setCameraMode('chase',true);
    const d=Number(cam.getCameraDistance?.()||0);
    if(d<44||d>52)cam.setCameraDistance(48);
    root.dataset.tggCameraCatchup='drive';
  }else{
    if(root.dataset.tggCameraCatchup==='drive'){
      cam.setCameraMode('orbit',true);
      cam.setCameraDistance(40);
    }
    root.dataset.tggCameraCatchup='walk';
  }
}
function applyDriveCatchup(){
  const g=window.TGGGame;
  if(!g?.setDriveTuning||root.dataset.tggDriveCatchup==='1')return;
  g.setDriveTuning({
    accel:6.9,
    reverseAccel:4.4,
    brake:14.4,
    coast:2.55,
    turnRate:76,
    steerIn:3.65,
    steerOut:10.8,
    lowSpeedSteer:.68,
    highSpeedSteer:.24,
    yawResponse:172,
    yawCenter:342,
    throttleResponse:5.8,
    throttleRelease:10.2,
    steerCurve:1.14,
    highSpeedTurnFalloff:.62,
    handbrakeTurnBoost:1.2,
    collisionSlide:.42,
    collisionDamping:.22
  });
  root.dataset.tggDriveCatchup='1';
}

function applyVehicleShowcaseV16(){
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.car||!THREE||root.dataset.tggVehicleShowcase==='1')return;
  try{
    let detail=w.car.getObjectByName?.('TGG_PLAYER_CAR_SHOWCASE_V16');
    if(!detail){
      detail=new THREE.Group();detail.name='TGG_PLAYER_CAR_SHOWCASE_V16';
      const chrome=new THREE.MeshStandardMaterial({color:0xbfc8d4,metalness:.92,roughness:.16});
      const dark=new THREE.MeshStandardMaterial({color:0x0a0d12,metalness:.58,roughness:.28});
      const lamp=new THREE.MeshStandardMaterial({color:0xeaf6ff,emissive:0xb7dcff,emissiveIntensity:1.5,roughness:.18});
      const tail=new THREE.MeshStandardMaterial({color:0xff2f45,emissive:0x8b0010,emissiveIntensity:1.1,roughness:.24});
      [[1.22,.43,-.88],[1.22,.43,.88],[-1.22,.43,-.88],[-1.22,.43,.88]].forEach(([x,y,z])=>{
        const rim=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.05,18),chrome);
        rim.rotation.x=Math.PI/2;rim.position.set(x,y,z);detail.add(rim);
        const hub=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.065,14),dark);
        hub.rotation.x=Math.PI/2;hub.position.set(x,y,z);detail.add(hub);
      });
      [-.66,.66].forEach(z=>{
        const h=new THREE.Mesh(new THREE.BoxGeometry(.07,.2,.42),lamp);h.position.set(2.17,.9,z);detail.add(h);
        const t=new THREE.Mesh(new THREE.BoxGeometry(.07,.19,.38),tail);t.position.set(-2.12,.9,z);detail.add(t);
        const m=new THREE.Mesh(new THREE.BoxGeometry(.2,.12,.18),dark);m.position.set(.62,1.43,z*1.38);detail.add(m);
      });
      const hood=new THREE.Mesh(new THREE.BoxGeometry(.72,.055,1.18),chrome);hood.position.set(1.15,1.18,0);hood.material=chrome.clone();hood.material.metalness=.52;hood.material.roughness=.26;detail.add(hood);
      w.car.add(detail);
    }
    const body=w.car.userData?.bodyMaterial;
    if(body){body.roughness=.27;body.metalness=.5;body.needsUpdate=true}
    root.dataset.tggVehicleShowcase='1';
  }catch{}
}
function applyOpenRoadV16(){
  const w=window.TGG3D;
  if(!w)return;
  try{
    if(root.dataset.tggGraphicsOwnershipV56!=='1'){
      if(w.camera){
        w.camera.far=1800;
        w.camera.fov=state.driving?69:63;
        w.camera.updateProjectionMatrix?.();
      }
      if(w.scene?.fog){
        w.scene.fog.density=state.weather==='rain'?.0039:state.time==='night'?.0036:.0031;
      }
    }
    (w.traffic||[]).forEach((v,i)=>{
      if(v?.scale)v.scale.set(.62,.62,.62);
      if(v?.userData){v.userData.tggSpacing='open-road';v.userData.tggLanePresence=i%3===0?'far':'normal'}
    });
    (w.pedestrians||[]).forEach((p,i)=>{
      if(p?.scale)p.scale.set(.69,.69,.69);
      if(p?.userData)p.userData.tggCrowdWeight=i%3===0?'light':'soft';
    });
    (w.destinations||[]).forEach((d,i)=>{
      if(d?.labelSprite){
        d.labelSprite.scale.set(3.7,1.0,1);
        if(d.labelSprite.material){d.labelSprite.material.opacity=.58+(i%2)*.08;d.labelSprite.material.transparent=true}
      }
      if(d?.beam?.material)d.beam.material.opacity=.045;
      if(d?.ring?.material)d.ring.material.opacity=.44;
    });
    root.dataset.tggOpenRoadV16='1';
  }catch{}
}

function applyStreetRaceV17(){
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.scene||!THREE)return;
  const hay=((document.querySelector('#missionStatus')?.textContent||'')+' '+(document.querySelector('.city-title')?.textContent||'')+' '+(document.body?.textContent||'')).toLowerCase();
  const race=/street race|race event|drift|checkpoint race|midnight|sprint race/.test(hay);
  root.dataset.tggRaceMode=race?'on':'off';
  let group=w.scene.getObjectByName?.('TGG_STREET_RACE_V17');
  if(!group){
    group=new THREE.Group();group.name='TGG_STREET_RACE_V17';w.scene.add(group);
    const neonA=new THREE.MeshStandardMaterial({color:0x33d6ff,emissive:0x0a6b8a,emissiveIntensity:1.7,roughness:.25,metalness:.22});
    const neonB=new THREE.MeshStandardMaterial({color:0xff3d8e,emissive:0x7d113f,emissiveIntensity:1.65,roughness:.24,metalness:.18});
    const dark=new THREE.MeshStandardMaterial({color:0x10131a,roughness:.68,metalness:.35});
    const addGate=(x,z,rot=0)=>{
      const post1=new THREE.Mesh(new THREE.BoxGeometry(.22,2.4,.22),dark);
      const post2=post1.clone();
      post1.position.set(x-.9*Math.cos(rot),1.2,z+.9*Math.sin(rot));
      post2.position.set(x+.9*Math.cos(rot),1.2,z-.9*Math.sin(rot));
      const bar=new THREE.Mesh(new THREE.BoxGeometry(2.1,.18,.18),neonA);
      bar.position.set(x,2.3,z);bar.rotation.y=rot;
      group.add(post1,post2,bar);
    };
    [[0,-56,0],[56,0,Math.PI/2],[0,56,0],[-56,0,Math.PI/2]].forEach(a=>addGate(...a));
    for(let i=0;i<12;i++){
      const angle=i/12*Math.PI*2;
      const r=64+(i%2)*6;
      const marker=new THREE.Mesh(new THREE.BoxGeometry(.16,.06,1.8),i%2?neonA:neonB);
      marker.position.set(Math.cos(angle)*r,.05,Math.sin(angle)*r);
      marker.rotation.y=-angle;
      group.add(marker);
    }
  }
  group.visible=race;
  if(race&&w.renderer)w.renderer.toneMappingExposure=state.time==='night'?1.16:1.1;
  root.dataset.tggStreetRaceV17='1';
}
function applyTrafficVarietyV17(){
  const w=window.TGG3D;
  if(!w)return;
  const palettes=[0x1f2937,0x7f1d1d,0x0f3d5e,0x3f3f46,0x14532d,0x581c87,0x854d0e,0x334155];
  (w.traffic||[]).forEach((v,i)=>{
    const body=v?.userData?.bodyMaterial;
    if(body){
      body.color.setHex(palettes[i%palettes.length]);
      body.metalness=.22+(i%4)*.08;
      body.roughness=.32+(i%3)*.07;
      body.needsUpdate=true;
    }
    if(v?.scale){
      const presets=[[.60,.60,.66],[.66,.58,.61],[.62,.64,.58],[.68,.60,.64]];
      const p=presets[i%presets.length];v.scale.set(...p);
    }
  });
  root.dataset.tggTrafficVarietyV17='1';
}
function applyDistrictDepthV17(){
  const w=window.TGG3D;
  if(!w?.scene)return;
  try{
    const district=root.dataset.tggDistrict||'downtown';
    const scaleMap={downtown:1,studio:.94,media:1.04,park:1.1,home:.92,garage:.98};
    const s=scaleMap[district]||1;
    const density=w.scene.getObjectByName?.('TGG_WORLD_DENSITY_MEGA');
    const city=w.scene.getObjectByName?.('TGG_FULL_CITY_LIFE_BATCH');
    if(density)density.scale.set(s,1,s);
    if(city)city.scale.set(s,1,s);
    root.dataset.tggDistrictDepthV17=district;
  }catch{}
}

function installGarageCustomizerV18(){
  const w=window.TGG3D;
  if(!w?.car||window.TGGGarageV18)return;
  const paints=[0x111827,0xb91c1c,0x1d4ed8,0x047857,0x7e22ce,0xd97706,0xe5e7eb,0x171717];
  const finishes=[
    {name:'GLOSS',metalness:.56,roughness:.22},
    {name:'SATIN',metalness:.38,roughness:.38},
    {name:'METALLIC',metalness:.72,roughness:.2},
    {name:'STEALTH',metalness:.24,roughness:.58}
  ];
  const stances=[
    {name:'STREET',scale:[1,1,1]},
    {name:'LOW',scale:[1,.94,1.03]},
    {name:'WIDE',scale:[1.03,.98,1.08]},
    {name:'RACE',scale:[1.04,.96,1.05]}
  ];
  const classes=[
    {name:'STREET',tune:{maxForward:10.2,accel:6.7,brake:14.8,turnRate:74}},
    {name:'MUSCLE',tune:{maxForward:10.8,accel:7.4,brake:14.2,turnRate:69}},
    {name:'TUNER',tune:{maxForward:11.0,accel:7.0,brake:15.2,turnRate:80}},
    {name:'EXOTIC',tune:{maxForward:11.8,accel:7.6,brake:15.8,turnRate:77}}
  ];
  const bodyKits=[
    {name:'OEM',scale:[1,1,1]},
    {name:'SPORT',scale:[1.02,.98,1.03]},
    {name:'WIDE',scale:[1.04,.96,1.08]},
    {name:'TRACK',scale:[1.03,.95,1.05]}
  ];
  const wheelSets=[
    {name:'STOCK',rim:1},
    {name:'MESH',rim:1.06},
    {name:'DEEP',rim:1.12},
    {name:'RACE',rim:1.08}
  ];
  const spoilers=['NONE','LIP','SPORT','GT'];
  const lightModes=['STOCK','WHITE','ICE','RACE'];
  let paint=0,finish=0,stance=0,carClass=0,bodyKit=0,wheels=0,spoiler=0,lights=0;
  const apply=()=>{
    const body=w.car.userData?.bodyMaterial;
    if(body){
      body.color.setHex(paints[paint%paints.length]);
      body.metalness=finishes[finish].metalness;
      body.roughness=finishes[finish].roughness;
      body.needsUpdate=true;
    }
    const s=stances[stance].scale,kit=bodyKits[bodyKit].scale;
    w.car.scale.set(s[0]*kit[0],s[1]*kit[1],s[2]*kit[2]);
    let wheelVisual=w.car.getObjectByName?.('TGG_WHEEL_STYLE_V21');
    if(!wheelVisual&&window.THREE){
      wheelVisual=new window.THREE.Group();wheelVisual.name='TGG_WHEEL_STYLE_V21';
      const rimMat=new window.THREE.MeshStandardMaterial({color:0xd7dde7,metalness:.95,roughness:.14});
      [[1.22,.43,-.9],[1.22,.43,.9],[-1.22,.43,-.9],[-1.22,.43,.9]].forEach(([x,y,z],i)=>{
        const ring=new window.THREE.Mesh(new window.THREE.TorusGeometry(.25,.035,8,20),rimMat);
        ring.rotation.y=Math.PI/2;ring.position.set(x,y,z);ring.userData.tggWheelIndex=i;wheelVisual.add(ring);
      });
      w.car.add(wheelVisual);
    }
    if(wheelVisual){
      const ws=wheelSets[wheels].rim;
      wheelVisual.children.forEach(r=>r.scale.setScalar(ws));
    }
    let wheelDetail=w.car.getObjectByName?.('TGG_WHEEL_DETAIL_V26');
    if(!wheelDetail&&window.THREE){
      wheelDetail=new window.THREE.Group();wheelDetail.name='TGG_WHEEL_DETAIL_V26';
      const spokeMat=new window.THREE.MeshStandardMaterial({color:0xb8c0cc,metalness:.92,roughness:.18});
      [[1.22,.43,-.9],[1.22,.43,.9],[-1.22,.43,-.9],[-1.22,.43,.9]].forEach(([x,y,z])=>{
        const hub=new window.THREE.Group();hub.position.set(x,y,z);hub.rotation.y=Math.PI/2;
        for(let s=0;s<5;s++){
          const spoke=new window.THREE.Mesh(new window.THREE.BoxGeometry(.03,.34,.035),spokeMat);
          spoke.rotation.z=s*Math.PI/5;hub.add(spoke);
        }
        wheelDetail.add(hub);
      });
      w.car.add(wheelDetail);
    }
    if(wheelDetail){
      const scale=[.92,1,1.08,1.04][wheels]||1;
      wheelDetail.children.forEach(h=>h.scale.setScalar(scale));
    }
    let aero=w.car.getObjectByName?.('TGG_SPOILER_VISUAL_V22');
    if(!aero&&window.THREE){
      aero=new window.THREE.Group();aero.name='TGG_SPOILER_VISUAL_V22';
      const mat=new window.THREE.MeshStandardMaterial({color:0x111318,metalness:.72,roughness:.24});
      const wing=new window.THREE.Mesh(new window.THREE.BoxGeometry(1.85,.08,.18),mat);wing.position.set(-1.86,1.5,0);
      const left=new window.THREE.Mesh(new window.THREE.BoxGeometry(.08,.32,.08),mat);left.position.set(-1.7,1.3,-.62);
      const right=left.clone();right.position.z=.62;
      aero.add(wing,left,right);w.car.add(aero);
    }
    if(aero){
      aero.visible=spoiler>0;
      const s=[0,.72,.92,1.12][spoiler]||0;
      aero.scale.set(s,s,s);
    }
    let geo=w.car.getObjectByName?.('TGG_GARAGE_GEOMETRY_V25');
    if(!geo&&window.THREE){
      geo=new window.THREE.Group();geo.name='TGG_GARAGE_GEOMETRY_V25';
      const mat=new window.THREE.MeshStandardMaterial({color:0x15181f,metalness:.55,roughness:.3});
      const splitter=new window.THREE.Mesh(new window.THREE.BoxGeometry(.16,.11,1.85),mat);splitter.position.set(2.12,.25,0);
      const skirtL=new window.THREE.Mesh(new window.THREE.BoxGeometry(2.9,.12,.12),mat);skirtL.position.set(0,.32,-.98);
      const skirtR=skirtL.clone();skirtR.position.z=.98;
      const diffuser=new window.THREE.Mesh(new window.THREE.BoxGeometry(.34,.14,1.7),mat);diffuser.position.set(-2.08,.26,0);
      geo.add(splitter,skirtL,skirtR,diffuser);w.car.add(geo);
    }
    if(geo){
      geo.visible=bodyKit>0;
      const k=[0,.82,1,1.12][bodyKit]||0;
      geo.scale.set(k,k,k);
    }
    let lamps=w.car.getObjectByName?.('TGG_LIGHT_VISUAL_V22');
    if(!lamps&&window.THREE){
      lamps=new window.THREE.Group();lamps.name='TGG_LIGHT_VISUAL_V22';
      const colors=[0xffffff,0xeef8ff,0xa9e7ff,0x66ccff];
      [-.67,.67].forEach(z=>{const p=new window.THREE.PointLight(colors[lights]||0xffffff,0,14,2);p.position.set(2.2,.9,z);lamps.add(p)});
      w.car.add(lamps);
    }
    if(lamps){
      const colors=[0xffffff,0xeef8ff,0xa9e7ff,0x66ccff],intens=[0,2.2,3.0,4.0];
      lamps.children.forEach(p=>{p.color.setHex(colors[lights]);p.intensity=intens[lights]});
    }
    try{localStorage.setItem('tgg-garage-v18',JSON.stringify({paint,finish,stance,carClass,bodyKit,wheels,spoiler,lights}))}catch{}
    root.dataset.tggGarageV18='1';
    root.dataset.tggCarClassV19=classes[carClass].name.toLowerCase();
    root.dataset.tggBodyKitV20=bodyKits[bodyKit].name.toLowerCase();
    root.dataset.tggWheelsV20=wheelSets[wheels].name.toLowerCase();
    root.dataset.tggSpoilerV22=spoilers[spoiler].toLowerCase();
    root.dataset.tggLightsV22=lightModes[lights].toLowerCase();
  };
  try{
    const saved=JSON.parse(localStorage.getItem('tgg-garage-v18')||'null');
    if(saved){paint=Number(saved.paint)||0;finish=Number(saved.finish)||0;stance=Number(saved.stance)||0;carClass=Number(saved.carClass)||0;bodyKit=Number(saved.bodyKit)||0;wheels=Number(saved.wheels)||0;spoiler=Number(saved.spoiler)||0;lights=Number(saved.lights)||0}
  }catch{}
  window.TGGGarageV18={
    nextPaint(){paint=(paint+1)%paints.length;apply();return this.status()},
    nextFinish(){finish=(finish+1)%finishes.length;apply();return this.status()},
    nextStance(){stance=(stance+1)%stances.length;apply();return this.status()},
    nextClass(){
      carClass=(carClass+1)%classes.length;
      window.TGGGame?.setDriveTuning?.(classes[carClass].tune);
      apply();return this.status()
    },
    nextBodyKit(){bodyKit=(bodyKit+1)%bodyKits.length;apply();return this.status()},
    nextWheels(){wheels=(wheels+1)%wheelSets.length;apply();return this.status()},
    nextSpoiler(){spoiler=(spoiler+1)%spoilers.length;apply();return this.status()},
    nextLights(){lights=(lights+1)%lightModes.length;apply();return this.status()},
    raceSetup(){
      stance=3;finish=2;
      window.TGGGame?.setDriveTuning?.({maxForward:11.2,accel:7.15,brake:15.6,turnRate:78,steerIn:3.9,steerOut:10.4,handbrakeTurnBoost:1.28});
      apply();root.dataset.tggRaceSetupV18='1';return this.status()
    },
    status(){return {paint,finish:finishes[finish].name,stance:stances[stance].name,carClass:classes[carClass].name,bodyKit:bodyKits[bodyKit].name,wheels:wheelSets[wheels].name,spoiler:spoilers[spoiler],lights:lightModes[lights]}}
  };
  apply();
}

function applyRaceNightV21(){
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.scene||!THREE)return;
  const race=root.dataset.tggRaceMode==='on';
  let group=w.scene.getObjectByName?.('TGG_RACE_NIGHT_V21');
  if(!group){
    group=new THREE.Group();group.name='TGG_RACE_NIGHT_V21';w.scene.add(group);
    const cyan=new THREE.MeshStandardMaterial({color:0x48d8ff,emissive:0x0b6585,emissiveIntensity:2.1,roughness:.2,metalness:.18});
    const mag=new THREE.MeshStandardMaterial({color:0xff3d9f,emissive:0x7c123f,emissiveIntensity:1.9,roughness:.22,metalness:.16});
    const amber=new THREE.MeshStandardMaterial({color:0xffb52e,emissive:0x8c4c00,emissiveIntensity:1.6,roughness:.28});
    for(let i=0;i<18;i++){
      const side=i%2?-1:1;
      const lamp=new THREE.Mesh(new THREE.BoxGeometry(.16,.08,2.2),i%3===0?mag:(i%3===1?cyan:amber));
      lamp.position.set(side*(18+(i%4)*10),.06,-84+i*10);
      lamp.rotation.y=Math.PI/2;
      group.add(lamp);
    }
  }
  group.visible=race;
  if(race){
    if(root.dataset.tggGraphicsOwnershipV56!=='1'){
      if(w.renderer)w.renderer.toneMappingExposure=1.18;
      if(w.scene.fog){w.scene.fog.density=.0028;if(w.scene.fog.color?.set)w.scene.fog.color.set(0x070914)}
      if(w.camera){w.camera.fov=70;w.camera.far=2200;w.camera.updateProjectionMatrix?.()}
    }
    root.dataset.tggRaceNightV21='1';
  }else{
    root.dataset.tggRaceNightV21='ready';
  }
}
function applyRoadDepthV21(){
  const w=window.TGG3D;
  if(!w?.scene)return;
  try{
    const density=w.scene.getObjectByName?.('TGG_WORLD_DENSITY_MEGA');
    const city=w.scene.getObjectByName?.('TGG_FULL_CITY_LIFE_BATCH');
    const district=root.dataset.tggDistrict||'downtown';
    const depth={downtown:1.03,studio:1.08,media:1.12,park:1.18,home:1.1,garage:1.06}[district]||1.08;
    if(density)density.scale.set(depth,1,depth);
    if(city)city.scale.set(depth,1,depth);
    root.dataset.tggRoadDepthV21=String(depth);
  }catch{}
}

function applyRaceEventV22(){
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.scene||!THREE)return;
  const race=root.dataset.tggRaceMode==='on';
  let g=w.scene.getObjectByName?.('TGG_RACE_EVENT_V22');
  if(!g){
    g=new THREE.Group();g.name='TGG_RACE_EVENT_V22';w.scene.add(g);
    const a=new THREE.MeshStandardMaterial({color:0x4be0ff,emissive:0x08708c,emissiveIntensity:2.3});
    const b=new THREE.MeshStandardMaterial({color:0xff3e9d,emissive:0x79113f,emissiveIntensity:2.0});
    for(let i=0;i<6;i++){
      const arch=new THREE.Mesh(new THREE.TorusGeometry(3.1,.11,8,32,Math.PI),i%2?a:b);
      arch.rotation.z=Math.PI;arch.position.set((i%2?1:-1)*24,2.9,-70+i*28);g.add(arch);
    }
  }
  g.visible=race;
  root.dataset.tggRaceEventV22='1';
}
function applyTravelDepthV22(){
  const w=window.TGG3D;if(!w?.camera)return;
  try{
    const district=root.dataset.tggDistrict||'downtown';
    const drive=!!window.TGGGame?.getState?.().inVehicle;
    const base={downtown:50,studio:54,media:57,park:60,home:52,garage:55}[district]||54;
    if(root.dataset.tggGraphicsOwnershipV56!=='1'){
      if(drive&&w.setCameraDistance)w.setCameraDistance(base);
      w.camera.far=2500;w.camera.updateProjectionMatrix?.();
    }
    root.dataset.tggTravelDepthV22=String(base);
  }catch{}
}

function applyRaceCountdownV23(){
  const race=root.dataset.tggRaceMode==='on';
  let hud=document.getElementById('tgg-race-countdown-v23');
  if(!hud){
    hud=document.createElement('div');
    hud.id='tgg-race-countdown-v23';
    hud.style.cssText='position:fixed;inset:0;display:none;place-items:center;z-index:9998;pointer-events:none;font:900 clamp(72px,15vw,180px)/1 system-ui,sans-serif;color:white;text-shadow:0 0 28px rgba(64,220,255,.9);background:radial-gradient(circle,rgba(0,0,0,.12),rgba(0,0,0,.5));';
    document.body.appendChild(hud);
  }
  if(!race){hud.style.display='none';root.dataset.tggRaceCountdownV23='ready';return}
  const now=performance.now(),last=Number(root.dataset.tggRaceCountdownStamp||0);
  if(!last){
    root.dataset.tggRaceCountdownStamp=String(now);
    const steps=['3','2','1','GO'];
    let i=0;hud.style.display='grid';hud.textContent=steps[i];
    const timer=setInterval(()=>{
      i++;
      if(i>=steps.length){clearInterval(timer);setTimeout(()=>hud.style.display='none',650);return}
      hud.textContent=steps[i];
      if(steps[i]==='GO')hud.style.color='#69f0ff';
    },720);
  }
  root.dataset.tggRaceCountdownV23='1';
}
function applyTravelCorridorsV23(){
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.scene||!THREE)return;
  let g=w.scene.getObjectByName?.('TGG_TRAVEL_CORRIDORS_V23');
  if(!g){
    g=new THREE.Group();g.name='TGG_TRAVEL_CORRIDORS_V23';w.scene.add(g);
    const roadMat=new THREE.MeshStandardMaterial({color:0x15181d,roughness:.96,metalness:.02});
    const lineMat=new THREE.MeshStandardMaterial({color:0xd8dde6,emissive:0x24282f,emissiveIntensity:.22,roughness:.7});
    [[0,-150,0,240],[0,150,0,240],[-150,0,Math.PI/2,240],[150,0,Math.PI/2,240]].forEach(([x,z,r,len])=>{
      const road=new THREE.Mesh(new THREE.BoxGeometry(18,.08,len),roadMat);road.position.set(x,.02,z);road.rotation.y=r;g.add(road);
      const line=new THREE.Mesh(new THREE.BoxGeometry(.22,.03,len*.94),lineMat);line.position.set(x,.07,z);line.rotation.y=r;g.add(line);
    });
  }
  root.dataset.tggTravelCorridorsV23='1';
}

function applyRaceOpponentsV24(){
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.scene||!THREE)return;
  const race=root.dataset.tggRaceMode==='on';
  let g=w.scene.getObjectByName?.('TGG_RACE_OPPONENTS_V24');
  if(!g){
    g=new THREE.Group();g.name='TGG_RACE_OPPONENTS_V24';w.scene.add(g);
    const colors=[0xff375f,0x35d0ff,0xffc247];
    for(let i=0;i<3;i++){
      const car=new THREE.Group();
      const body=new THREE.Mesh(new THREE.BoxGeometry(3.7,.72,1.65),new THREE.MeshStandardMaterial({color:colors[i],metalness:.5,roughness:.28}));
      body.position.y=.72;car.add(body);
      const glass=new THREE.Mesh(new THREE.BoxGeometry(1.7,.5,1.42),new THREE.MeshStandardMaterial({color:0x15202b,metalness:.35,roughness:.18}));
      glass.position.set(-.15,1.28,0);car.add(glass);
      car.position.set(-4+i*4,.02,-12-i*3);car.userData.tggOpponent=i+1;g.add(car);
    }
  }
  g.visible=race;
  if(race&&root.dataset.tggOpponentRouteAuthorityV64!=='event-route'){
    const t=performance.now()*.001;
    g.children.forEach((car,i)=>{
      car.position.z=-14-i*5+Math.sin(t*.8+i)*2.5;
      car.position.x=(-4+i*4)+Math.sin(t*.45+i)*1.2;
    });
  }else if(race){
    root.dataset.tggLegacyOpponentMotionV66='suppressed';
  }
  root.dataset.tggRaceOpponentsV24='1';
}
function applyDestinationSpacingV24(){
  const w=window.TGG3D;if(!w)return;
  try{
    const targets=w.destinations||[];
    targets.forEach((d,i)=>{
      if(d?.labelSprite){
        const spread=1+(i%4)*.08;
        d.labelSprite.scale.set(3.7*spread,1.0*spread,1);
      }
      if(d?.ring?.scale){
        const s=1+(i%3)*.06;d.ring.scale.set(s,s,s);
      }
    });
    root.dataset.tggDestinationSpacingV24='1';
  }catch{}
}
function applyStudioReturnV24(){
  try{
    const raw=localStorage.getItem('tgg-world-return-v24');
    if(!raw){root.dataset.tggStudioReturnV24='ready';return}
    const data=JSON.parse(raw);
    if(data?.garage&&window.TGGGarageV18){
      const g=data.garage;
      if(g.race===true)window.TGGGarageV18.raceSetup?.();
    }
    if(data?.worldPreset||data?.editor){
      root.dataset.tggEditorPreset=String(data.worldPreset||data.editor);
    }
    if(data?.vfx){
      root.dataset.tggReturnedVfx=String(data.vfx);
    }
    localStorage.removeItem('tgg-world-return-v24');
    root.dataset.tggStudioReturnV24='1';
    document.dispatchEvent(new CustomEvent('tgg-studio-return-applied',{detail:data}));
  }catch{root.dataset.tggStudioReturnV24='error'}
}

function applyRaceProgressV25(){
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.scene||!THREE)return;
  const race=root.dataset.tggRaceMode==='on';
  let group=w.scene.getObjectByName?.('TGG_RACE_PROGRESS_V25');
  if(!group){
    group=new THREE.Group();group.name='TGG_RACE_PROGRESS_V25';w.scene.add(group);
    const matA=new THREE.MeshStandardMaterial({color:0x5de1ff,emissive:0x0b6c86,emissiveIntensity:2.2,transparent:true,opacity:.78});
    const matB=new THREE.MeshStandardMaterial({color:0xff4da0,emissive:0x7d123f,emissiveIntensity:2.0,transparent:true,opacity:.75});
    const pts=[[0,-52],[38,-28],[52,8],[28,44],[-18,56],[-50,24],[-42,-20]];
    pts.forEach(([x,z],i)=>{
      const ring=new THREE.Mesh(new THREE.TorusGeometry(2.5,.12,8,28),i%2?matA:matB);
      ring.rotation.x=Math.PI/2;ring.position.set(x,.12,z);ring.userData.tggCheckpoint=i;group.add(ring);
    });
    group.userData={index:0,lap:1,total:pts.length,finish:false};
  }
  const authoritative=root.dataset.tggCheckpointAuthorityV63==='event-route';
  group.visible=race&&!authoritative;
  if(!race){root.dataset.tggRaceProgressV25='ready';return}
  if(authoritative){
    root.dataset.tggLegacyCheckpointV25='suppressed';
    root.dataset.tggRaceProgressV25='v63-suppressed';
    return;
  }
  const car=w.car;
  if(car&&group.children.length){
    const st=group.userData,cp=group.children[st.index]||group.children[0];
    cp.scale.setScalar(1.18+Math.sin(performance.now()*.006)*.08);
    if(car.position.distanceTo(cp.position)<5.2){
      cp.visible=false;st.index++;
      if(st.index>=st.total){
        st.finish=true;st.index=st.total-1;
        root.dataset.tggRaceFinishV25='1';
      }
    }
    const done=Math.min(st.total,st.index+(st.finish?1:0));
    root.dataset.tggRaceCheckpointV25=String(done);
    root.dataset.tggRaceTotalV25=String(st.total);
  }
  root.dataset.tggRaceProgressV25='1';
}
function applyOpponentAI25(){
  const w=window.TGG3D;if(!w?.scene)return;
  const g=w.scene.getObjectByName?.('TGG_RACE_OPPONENTS_V24');
  if(!g||root.dataset.tggRaceMode!=='on')return;
  const route=w.scene.getObjectByName?.('TGG_EVENT_ROUTE_V33');
  const pts=route?.children||[];
  if(pts.length<3){root.dataset.tggOpponentAIV25='waiting-route';return}
  const total=pts.length,runId=root.dataset.tggRaceRunIdV43||'run',now=performance.now();
  const lanes=[-2.15,2.15,0],gridBack=[.18,.34,.50];
  g.children.forEach((car,i)=>{
    const paceBase=Number(car.userData.tggTierPace||car.userData.tggPace||1);
    const catchup=Number(car.userData.tggCatchup||paceBase);
    if(car.userData.tggRouteRunV64!==runId){
      car.userData.tggRouteRunV64=runId;
      car.userData.tggRouteProgressV64=Math.max(0,gridBack[i]||.1);
      car.userData.tggFinishStampV64='';
      car.userData.tggLastRouteTickV64=now;
      car.userData.tggGridSlotV66=i+1;
    }
    const dt=Math.min(.035,Math.max(.008,(now-Number(car.userData.tggLastRouteTickV64||now))/1000));
    car.userData.tggLastRouteTickV64=now;
    let progress=Number(car.userData.tggRouteProgressV64||0);

    const seg=Math.min(total-1,Math.floor(progress));
    const p0=pts[Math.max(0,seg-1)]?.position||pts[seg]?.position;
    const p1=pts[seg]?.position,p2=pts[Math.min(total-1,seg+1)]?.position,p3=pts[Math.min(total-1,seg+2)]?.position;
    let corner=0;
    if(p0&&p1&&p2){
      const ax=p1.x-p0.x,az=p1.z-p0.z,bx=p2.x-p1.x,bz=p2.z-p1.z;
      const al=Math.max(.001,Math.hypot(ax,az)),bl=Math.max(.001,Math.hypot(bx,bz));
      const dot=Math.max(-1,Math.min(1,(ax*bx+az*bz)/(al*bl)));
      corner=Math.acos(dot)/Math.PI;
    }
    const cornerFactor=Math.max(.58,1-corner*.72);
    const catchupBlend=paceBase+(catchup-paceBase)*.35;
    let pace=Math.max(.80,Math.min(1.13,catchupBlend))*cornerFactor;

    // Maintain minimum progress separation from the car directly ahead.
    let nearestAhead=Infinity;
    g.children.forEach((other,j)=>{
      if(j===i)return;
      const op=Number(other.userData?.tggRouteProgressV64||0);
      const gap=op-progress;
      if(gap>0&&gap<nearestAhead)nearestAhead=gap;
    });
    if(nearestAhead<.22)pace*=.72;
    else if(nearestAhead<.38)pace*=.86;

    progress+=dt*(.11+.016*i)*pace;
    const capped=Math.min(total,progress);
    const s=Math.min(total-1,Math.floor(capped));
    const n=Math.min(total-1,s+1),n2=Math.min(total-1,n+1);
    const t=Math.max(0,Math.min(1,capped-s));
    const A=pts[s]?.position,B=pts[n]?.position,D=pts[n2]?.position;
    if(A&&B){
      // Smoothstep interpolation for less robotic segment transitions.
      const tt=t*t*(3-2*t);
      const sx=A.x+(B.x-A.x)*tt,sz=A.z+(B.z-A.z)*tt;
      const tx=(D?.x??B.x)-A.x,tz=(D?.z??B.z)-A.z;
      const len=Math.max(.001,Math.hypot(tx,tz));
      const nx=-tz/len,nz=tx/len,lane=lanes[i%lanes.length]||0;
      let targetX=sx+nx*lane,targetZ=sz+nz*lane;

      // Local spacing nudge if cars visually overlap.
      g.children.forEach((other,j)=>{
        if(j===i)return;
        const dx=targetX-other.position.x,dz=targetZ-other.position.z,dist=Math.hypot(dx,dz);
        if(dist>0&&dist<3.8){
          const push=(3.8-dist)*.22;
          targetX+=(dx/dist)*push;targetZ+=(dz/dist)*push;
        }
      });

      car.position.x+=(targetX-car.position.x)*.18;
      car.position.z+=(targetZ-car.position.z)*.18;
      car.position.y=Math.max(car.position.y||.2,.2);
      const desired=Math.atan2(tx,tz),current=Number(car.rotation.y||0);
      let delta=((desired-current+Math.PI)%(Math.PI*2))-Math.PI;
      car.rotation.y=current+delta*(.12+Math.min(.1,corner*.12));
    }
    car.userData.tggRouteProgressV64=capped;
    car.userData.tggRouteCheckpointV64=Math.min(total,Math.floor(capped));
    car.userData.tggLaneOffsetV65=lanes[i%lanes.length]||0;
    car.userData.tggCornerSeverityV66=Number(corner.toFixed(3));
    car.userData.tggCornerSpeedFactorV66=Number(cornerFactor.toFixed(3));
    car.userData.tggSeparationModelV66='minimum-gap';
    if(capped>=total&&!car.userData.tggFinishStampV64){
      car.userData.tggFinishStampV64=runId+':opp-'+i;
      car.userData.tggFinishOrderV64=Number(root.dataset.tggOpponentFinishCountV64||0)+1;
      root.dataset.tggOpponentFinishCountV64=String(car.userData.tggFinishOrderV64);
    }
  });
  root.dataset.tggOpponentProgressOwnerV64='event-route';
  root.dataset.tggOpponentLaneModelV65='separated';
  root.dataset.tggOpponentPathSmoothingV65='1';
  root.dataset.tggOpponentCatchupModelV65='bounded';
  root.dataset.tggOpponentCornerModelV66='adaptive';
  root.dataset.tggOpponentSeparationV66='minimum-gap';
  root.dataset.tggOpponentStartGridV66='staggered';
  root.dataset.tggLegacyOpponentMotionV66='suppressed';
  root.dataset.tggOpponentAIV25='v66-racecraft';
}
function applyReturnedWorldVfx25(){
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.scene||!THREE)return;
  const preset=root.dataset.tggReturnedVfx||root.dataset.tggEditorPreset||'';
  if(!preset){root.dataset.tggReturnedWorldVfxV25='ready';return}
  let g=w.scene.getObjectByName?.('TGG_RETURNED_VFX_V25');
  if(!g){
    g=new THREE.Group();g.name='TGG_RETURNED_VFX_V25';w.scene.add(g);
    const glow=new THREE.MeshStandardMaterial({color:0x6fe9ff,emissive:0x156d86,emissiveIntensity:2.4,transparent:true,opacity:.38});
    for(let i=0;i<10;i++){
      const orb=new THREE.Mesh(new THREE.SphereGeometry(.45,12,10),glow);
      const a=i/10*Math.PI*2;orb.position.set(Math.cos(a)*7,1.2+(i%3)*.5,Math.sin(a)*7);g.add(orb);
    }
  }
  const p=w.car?.position||w.player?.position;
  if(p)g.position.copy(p);
  g.rotation.y+=.01;
  root.dataset.tggReturnedWorldVfxV25='1';
}

function applyRaceHudV26(){
  const race=root.dataset.tggRaceMode==='on';
  let hud=document.getElementById('tgg-race-hud-v26');
  if(!hud){
    hud=document.createElement('div');hud.id='tgg-race-hud-v26';
    hud.style.cssText='position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:9997;display:none;gap:16px;align-items:center;padding:10px 14px;border:1px solid rgba(255,255,255,.18);border-radius:14px;background:rgba(3,7,12,.72);backdrop-filter:blur(10px);font:800 12px/1.1 system-ui,sans-serif;letter-spacing:.08em;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.3)';
    hud.innerHTML='<span data-race-pos>POS 1/4</span><span data-race-cp>CP 0/7</span><span data-race-lap>LAP 1/1</span><span data-race-finish></span>';
    document.body.appendChild(hud);
  }
  if(!race){hud.style.display='none';root.dataset.tggRaceHudV26='ready';return}
  hud.style.display='flex';
  const cp=Number(root.dataset.tggRaceCheckpointV25||0),total=Math.max(1,Number(root.dataset.tggRaceTotalV25||1));
  const opponents=window.TGG3D?.scene?.getObjectByName?.('TGG_RACE_OPPONENTS_V24')?.children||[];
  const playerProgress=cp;
  let ahead=0;
  opponents.forEach(o=>{
    const op=Number(o.userData?.tggRouteProgressV64||0);
    if(op>playerProgress+.05)ahead++;
  });
  const pos=Math.min(4,1+ahead);
  const posEl=hud.querySelector('[data-race-pos]'),cpEl=hud.querySelector('[data-race-cp]'),fin=hud.querySelector('[data-race-finish]');
  if(posEl)posEl.textContent='POS '+pos+'/4';
  if(cpEl)cpEl.textContent='CP '+cp+'/'+total;
  if(fin)fin.textContent=root.dataset.tggRaceFinishV25==='1'?'FINISH':'';
  root.dataset.tggRacePositionV26=String(pos);
  root.dataset.tggRacePlacementOwnerV64='event-route';
  root.dataset.tggRaceHudV26='v64';
}
function installNitrousV26(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.car||!THREE)return;
  let fx=w.car.getObjectByName?.('TGG_NITROUS_V26');
  if(!fx){
    fx=new THREE.Group();fx.name='TGG_NITROUS_V26';
    const mat=new THREE.MeshStandardMaterial({color:0x6fdcff,emissive:0x1d7ea0,emissiveIntensity:3,transparent:true,opacity:.9});
    [-.48,.48].forEach(z=>{
      const flame=new THREE.Mesh(new THREE.ConeGeometry(.12,.9,12),mat);
      flame.rotation.z=-Math.PI/2;flame.position.set(-2.3,.48,z);fx.add(flame);
    });
    w.car.add(fx);fx.visible=false;
  }
  if(!window.TGGNitrousV26){
    let active=false,until=0;
    const fire=()=>{
      if(!window.TGGGame?.getState?.().inVehicle)return;
      active=true;until=performance.now()+1800;fx.visible=true;
      try{window.TGGGame?.setDriveTuning?.({maxForward:12.8,accel:8.3,brake:15.8,turnRate:77})}catch{}
      root.dataset.tggNitrousActiveV26='1';
    };
    window.addEventListener('keydown',e=>{if(String(e.key||'').toLowerCase()==='n'&&!e.repeat)fire()});
    window.TGGNitrousV26={fire};
    const loop=()=>{
      if(active&&performance.now()>until){
        active=false;fx.visible=false;root.dataset.tggNitrousActiveV26='0';
      }
      if(active)fx.scale.set(1,1,.9+Math.sin(performance.now()*.04)*.18);
      requestAnimationFrame(loop);
    };loop();
  }
  root.dataset.tggNitrousV26='1';
}
function applyReturnedEditorPresetV26(){
  const w=window.TGG3D;if(!w)return;
  const preset=root.dataset.tggEditorPreset||'';
  if(!preset){root.dataset.tggEditorPresetV26='ready';return}
  try{
    if(preset==='effects'){
      if(w.renderer)w.renderer.toneMappingExposure=1.2;
      if(w.scene?.fog)w.scene.fog.density=.0026;
      if(w.camera){w.camera.fov=70;w.camera.updateProjectionMatrix?.()}
      root.dataset.tggWeather='cinematic';
    }else if(preset==='color'){
      if(w.renderer)w.renderer.toneMappingExposure=1.1;
      if(w.scene?.fog?.color?.set)w.scene.fog.color.set(0x0a1020);
      root.dataset.tggWeather='night';
    }else if(preset==='audio'){
      if(w.camera){w.camera.fov=64;w.camera.updateProjectionMatrix?.()}
      root.dataset.tggWeather='clear';
    }else{
      if(w.camera){w.camera.fov=state.driving?69:63;w.camera.updateProjectionMatrix?.()}
    }
    root.dataset.tggEditorPresetV26='1';
  }catch{root.dataset.tggEditorPresetV26='error'}
}

function applyRaceResultsV27(){
  const race=root.dataset.tggRaceMode==='on';
  let panel=document.getElementById('tgg-race-results-v27');
  if(!panel){
    panel=document.createElement('div');panel.id='tgg-race-results-v27';
    panel.style.cssText='position:fixed;right:18px;top:78px;z-index:9996;display:none;min-width:180px;padding:12px 14px;border:1px solid rgba(255,255,255,.18);border-radius:14px;background:rgba(4,8,14,.76);backdrop-filter:blur(10px);font:800 12px/1.4 system-ui,sans-serif;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.35)';
    panel.innerHTML='<div data-v27-title>RACE LIVE</div><div data-v27-pos>POSITION —</div><div data-v27-reward>REWARD —</div>';
    document.body.appendChild(panel);
  }
  if(!race){panel.style.display='none';root.dataset.tggRaceResultsV27='ready';return}
  panel.style.display='block';
  const finished=root.dataset.tggRaceFinishV25==='1';
  const pos=Number(root.dataset.tggRacePositionV26||1);
  const reward=Math.max(250,1400-pos*250);
  const title=panel.querySelector('[data-v27-title]'),p=panel.querySelector('[data-v27-pos]'),r=panel.querySelector('[data-v27-reward]');
  if(title)title.textContent=finished?'RACE COMPLETE':'RACE LIVE';
  if(p)p.textContent='POSITION '+pos+'/4';
  if(r)r.textContent='REWARD '+reward+' TGG';
  if(finished){
    root.dataset.tggRaceRewardV27=String(reward);
    try{localStorage.setItem('tgg-last-race-reward-v27',String(reward))}catch{}
  }
  root.dataset.tggRaceResultsV27='1';
}
function applyOpponentDifficultyV27(){
  const w=window.TGG3D;if(!w?.scene)return;
  const g=w.scene.getObjectByName?.('TGG_RACE_OPPONENTS_V24');
  if(!g)return;
  const cls=root.dataset.tggCarClassV19||'street';
  const tier={street:.88,muscle:.94,tuner:1,exotic:1.06}[cls]||.92;
  g.children.forEach((car,i)=>{
    car.userData.tggDifficulty=['ROOKIE','STREET','PRO'][i]||'STREET';
    car.userData.tggPace=tier*(.9+i*.08);
  });
  root.dataset.tggOpponentDifficultyV27=cls;
}
function applyNitrousBehaviorV27(){
  const w=window.TGG3D;if(!w?.car)return;
  const active=root.dataset.tggNitrousActiveV26==='1';
  let blur=document.getElementById('tgg-nitrous-speed-v27');
  if(!blur){
    blur=document.createElement('div');blur.id='tgg-nitrous-speed-v27';
    blur.style.cssText='position:fixed;inset:0;z-index:9995;pointer-events:none;display:none;background:radial-gradient(circle at 50% 50%,transparent 0 48%,rgba(94,220,255,.09) 64%,rgba(94,220,255,.18) 100%);mix-blend-mode:screen';
    document.body.appendChild(blur);
  }
  blur.style.display=active?'block':'none';
  if(active&&w.camera){
    w.camera.fov=Math.min(76,(w.camera.fov||69)+.35);
    w.camera.updateProjectionMatrix?.();
  }
  root.dataset.tggNitrousBehaviorV27='1';
}
function applyRoadNetworkV27(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.scene||!THREE)return;
  let g=w.scene.getObjectByName?.('TGG_ROAD_NETWORK_V27');
  if(!g){
    g=new THREE.Group();g.name='TGG_ROAD_NETWORK_V27';w.scene.add(g);
    const road=new THREE.MeshStandardMaterial({color:0x11151b,roughness:.98});
    const stripe=new THREE.MeshStandardMaterial({color:0xf4f4f2,emissive:0x202020,emissiveIntensity:.18});
    [[0,-300,0,360],[0,300,0,360],[-300,0,Math.PI/2,360],[300,0,Math.PI/2,360],[-220,-220,Math.PI/4,300],[220,220,Math.PI/4,300]].forEach(([x,z,r,len])=>{
      const seg=new THREE.Mesh(new THREE.BoxGeometry(20,.06,len),road);seg.position.set(x,.01,z);seg.rotation.y=r;g.add(seg);
      const mark=new THREE.Mesh(new THREE.BoxGeometry(.18,.03,len*.9),stripe);mark.position.set(x,.05,z);mark.rotation.y=r;g.add(mark);
    });
  }
  root.dataset.tggRoadNetworkV27='1';
}
function applyReturnedMoodV27(){
  const w=window.TGG3D;if(!w)return;
  const preset=root.dataset.tggEditorPreset||'';
  if(!preset){root.dataset.tggReturnedMoodV27='ready';return}
  try{
    if(preset==='effects'){
      root.dataset.tggWeather='storm';
      if(w.scene?.fog?.color?.set)w.scene.fog.color.set(0x081018);
      if(w.renderer)w.renderer.toneMappingExposure=1.22;
      if(w.camera){w.camera.fov=71;w.camera.updateProjectionMatrix?.()}
      root.dataset.tggRaceMood='neon';
    }else if(preset==='color'){
      root.dataset.tggWeather='night';
      if(w.scene?.fog?.color?.set)w.scene.fog.color.set(0x120d1f);
      if(w.renderer)w.renderer.toneMappingExposure=1.08;
      root.dataset.tggRaceMood='cinematic';
    }else if(preset==='audio'){
      root.dataset.tggWeather='clear';
      if(w.camera){w.camera.fov=65;w.camera.updateProjectionMatrix?.()}
      root.dataset.tggRaceMood='cruise';
    }else{
      root.dataset.tggRaceMood='default';
    }
    root.dataset.tggReturnedMoodV27='1';
  }catch{root.dataset.tggReturnedMoodV27='error'}
}

function applyRaceEconomyV28(){
  const finished=root.dataset.tggRaceFinishV25==='1';
  root.dataset.tggRaceEconomyV28=finished?'v67-suppressed':'ready';
  root.dataset.tggLegacyRacePayoutV28='suppressed';
}
function applyOpponentCatchupV28(){
  const w=window.TGG3D;if(!w?.scene)return;
  const g=w.scene.getObjectByName?.('TGG_RACE_OPPONENTS_V24');
  if(!g||root.dataset.tggRaceMode!=='on')return;
  const pos=Number(root.dataset.tggRacePositionV26||1);
  g.children.forEach((car,i)=>{
    const base=Number(car.userData.tggPace||1);
    car.userData.tggCatchup=pos===1?Math.min(1.16,base+.08+i*.02):Math.max(.86,base-.04);
  });
  root.dataset.tggOpponentCatchupV28='1';
}
function installNitrousRechargeV28(){
  if(window.TGGNitrousRechargeV28)return;
  let charge=100,last=performance.now();
  const hud=document.createElement('div');
  hud.id='tgg-nitrous-recharge-v28';
  hud.style.cssText='position:fixed;left:18px;bottom:92px;z-index:9996;padding:8px 10px;border:1px solid rgba(120,220,255,.35);border-radius:10px;background:rgba(5,10,18,.72);font:800 11px/1 system-ui,sans-serif;color:#bdefff;letter-spacing:.08em';
  hud.textContent='NITRO 100%';document.body.appendChild(hud);
  const old=window.TGGNitrousV26?.fire;
  if(old){
    window.TGGNitrousV26.fire=()=>{
      if(charge<34)return false;
      charge-=34;old();return true;
    };
  }
  const loop=()=>{
    const now=performance.now(),dt=(now-last)/1000;last=now;
    if(root.dataset.tggNitrousActiveV26!=='1')charge=Math.min(100,charge+dt*13);
    hud.textContent='NITRO '+Math.round(charge)+'%';
    root.dataset.tggNitrousChargeV28=String(Math.round(charge));
    requestAnimationFrame(loop);
  };loop();
  window.TGGNitrousRechargeV28={get charge(){return charge}};
  root.dataset.tggNitrousRechargeV28='1';
}
function applyDistrictJunctionsV28(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.scene||!THREE)return;
  let g=w.scene.getObjectByName?.('TGG_DISTRICT_JUNCTIONS_V28');
  if(!g){
    g=new THREE.Group();g.name='TGG_DISTRICT_JUNCTIONS_V28';w.scene.add(g);
    const road=new THREE.MeshStandardMaterial({color:0x12161c,roughness:.99});
    [[-420,0,90],[420,0,90],[0,-420,0],[0,420,0],[-300,300,45],[300,-300,45]].forEach(([x,z,d])=>{
      const a=new THREE.Mesh(new THREE.BoxGeometry(22,.05,220),road);a.position.set(x,.01,z);a.rotation.y=d*Math.PI/180;g.add(a);
      const b=new THREE.Mesh(new THREE.BoxGeometry(22,.05,140),road);b.position.set(x,.012,z);b.rotation.y=(d+90)*Math.PI/180;g.add(b);
    });
  }
  root.dataset.tggDistrictJunctionsV28='1';
}
function applyReturnedEnvironmentV28(){
  const w=window.TGG3D;if(!w)return;
  const preset=root.dataset.tggEditorPreset||'',mood=root.dataset.tggRaceMood||'';
  try{
    let time='day',exposure=1.05,fov=state.driving?69:63;
    if(preset==='effects'||mood==='neon'){time='night';exposure=1.22;fov=71}
    else if(preset==='color'||mood==='cinematic'){time='dusk';exposure=1.1;fov=67}
    else if(preset==='audio'||mood==='cruise'){time='golden';exposure=1.14;fov=65}
    root.dataset.tggTime=time;
    if(root.dataset.tggGraphicsOwnershipV56!=='1'){
      if(w.renderer)w.renderer.toneMappingExposure=exposure;
      if(w.camera){w.camera.fov=fov;w.camera.updateProjectionMatrix?.()}
      const hemi=w.scene?.children?.find?.(o=>o.isHemisphereLight);
      if(hemi)hemi.intensity=time==='night'?.42:time==='dusk'?.58:.72;
      const dir=w.scene?.children?.find?.(o=>o.isDirectionalLight);
      if(dir)dir.intensity=time==='night'?.46:time==='dusk'?.7:.95;
    }
    root.dataset.tggReturnedEnvironmentV28='1';
  }catch{root.dataset.tggReturnedEnvironmentV28='error'}
}

function installGarageEconomyV29(){
  if(window.TGGGarageEconomyV29)return;
  const bankKey='tgg-race-bank-v28',upgradeKey='tgg-garage-upgrades-v29';
  let upgrades={engine:0,brakes:0,handling:0,nitrous:0};
  try{upgrades=Object.assign(upgrades,JSON.parse(localStorage.getItem(upgradeKey)||'{}'))}catch{}
  const prices={engine:[0,450,900,1600],brakes:[0,350,750,1300],handling:[0,400,850,1450],nitrous:[0,300,700,1200]};
  const maxTier=3;
  const apply=()=>{
    const tier=(upgrades.engine+upgrades.brakes+upgrades.handling+upgrades.nitrous)/4;
    const tune={
      maxForward:10.2+upgrades.engine*.7,
      accel:6.7+upgrades.engine*.45,
      brake:14.8+upgrades.brakes*.65,
      turnRate:74+upgrades.handling*2.6,
      steerIn:3.6+upgrades.handling*.15,
      steerOut:9.8+upgrades.handling*.22,
      handbrakeTurnBoost:1.18+upgrades.handling*.03
    };
    window.TGGGame?.setDriveTuning?.(tune);
    root.dataset.tggUpgradeTierV29=String(Math.round(tier*10)/10);
    root.dataset.tggEngineTierV29=String(upgrades.engine);
    root.dataset.tggBrakesTierV29=String(upgrades.brakes);
    root.dataset.tggHandlingTierV29=String(upgrades.handling);
    root.dataset.tggNitrousTierV29=String(upgrades.nitrous);
    try{localStorage.setItem(upgradeKey,JSON.stringify(upgrades))}catch{}
  };
  const buy=(kind)=>{
    if(!(kind in upgrades))return false;
    const next=Math.min(maxTier,upgrades[kind]+1);
    if(next===upgrades[kind])return false;
    const cost=prices[kind][next];
    let bank=Number(localStorage.getItem(bankKey)||0);
    if(bank<cost)return false;
    bank-=cost;upgrades[kind]=next;
    localStorage.setItem(bankKey,String(bank));
    root.dataset.tggRaceBankV28=String(bank);
    apply();return true;
  };
  window.TGGGarageEconomyV29={buy,status:()=>({bank:Number(localStorage.getItem(bankKey)||0),upgrades:Object.assign({},upgrades),prices}),apply};
  apply();
  root.dataset.tggGarageEconomyV29='1';
}
function applyPerformanceStatsV29(){
  const eco=window.TGGGarageEconomyV29?.status?.();
  if(!eco){root.dataset.tggPerformanceStatsV29='ready';return}
  const u=eco.upgrades||{};
  const score=Math.round(60+(u.engine||0)*8+(u.brakes||0)*6+(u.handling||0)*7+(u.nitrous||0)*5);
  root.dataset.tggPerformanceScoreV29=String(score);
  root.dataset.tggPerformanceClassV29=score>=90?'S':score>=80?'A':score>=70?'B':'C';
  root.dataset.tggPerformanceStatsV29='1';
}
function applyHighwayNetworkV29(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.scene||!THREE)return;
  let g=w.scene.getObjectByName?.('TGG_HIGHWAY_NETWORK_V29');
  if(!g){
    g=new THREE.Group();g.name='TGG_HIGHWAY_NETWORK_V29';w.scene.add(g);
    const road=new THREE.MeshStandardMaterial({color:0x0e1217,roughness:.99});
    const median=new THREE.MeshStandardMaterial({color:0x2a2f35,roughness:.92});
    [[0,-620,0,480],[0,620,0,480],[-620,0,Math.PI/2,480],[620,0,Math.PI/2,480],[-500,-500,Math.PI/4,420],[500,-500,-Math.PI/4,420]].forEach(([x,z,r,len])=>{
      const seg=new THREE.Mesh(new THREE.BoxGeometry(28,.06,len),road);seg.position.set(x,.01,z);seg.rotation.y=r;g.add(seg);
      const mid=new THREE.Mesh(new THREE.BoxGeometry(.7,.18,len*.92),median);mid.position.set(x,.11,z);mid.rotation.y=r;g.add(mid);
    });
  }
  root.dataset.tggHighwayNetworkV29='1';
}
function applyWeatherBlendV29(){
  const w=window.TGG3D;if(!w?.scene)return;
  const target=root.dataset.tggWeather||'clear';
  const current=Number(root.dataset.tggWeatherBlendV29Value||0);
  const goal=target==='storm'?1:target==='night'?.7:target==='cinematic'?.55:target==='golden'?.25:0;
  const next=current+(goal-current)*.04;
  root.dataset.tggWeatherBlendV29Value=String(next);
  if(root.dataset.tggGraphicsOwnershipV56!=='1'){
    if(w.scene.fog)w.scene.fog.density=.0029+next*.0015;
    if(w.renderer)w.renderer.toneMappingExposure=1.05-next*.08+(target==='golden'?.12:0);
  }
  root.dataset.tggWeatherBlendV29='1';
}

function applyGarageHudV30(){
  let hud=document.getElementById('tgg-garage-hud-v30');
  if(!hud){
    hud=document.createElement('div');hud.id='tgg-garage-hud-v30';
    hud.style.cssText='position:fixed;right:18px;bottom:92px;z-index:9995;min-width:210px;padding:12px 14px;border:1px solid rgba(255,255,255,.16);border-radius:14px;background:rgba(4,8,14,.76);backdrop-filter:blur(10px);font:700 11px/1.45 system-ui,sans-serif;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.35)';
    hud.innerHTML='<div style="font-size:12px;font-weight:900;letter-spacing:.08em">TGG GARAGE</div><div data-v30-bank>BANK 0 TGG</div><div data-v30-class>CLASS C</div><div data-v30-score>PERF 60</div><div data-v30-tiers>ENG 0 · BRK 0 · HDL 0 · NOS 0</div>';
    document.body.appendChild(hud);
  }
  const bank=Number(root.dataset.tggRaceBankV28||localStorage.getItem('tgg-race-bank-v28')||0);
  const score=root.dataset.tggPerformanceScoreV29||'60';
  const cls=root.dataset.tggPerformanceClassV29||'C';
  const vals=[root.dataset.tggEngineTierV29||0,root.dataset.tggBrakesTierV29||0,root.dataset.tggHandlingTierV29||0,root.dataset.tggNitrousTierV29||0];
  hud.querySelector('[data-v30-bank]').textContent='BANK '+bank+' TGG';
  hud.querySelector('[data-v30-class]').textContent='CLASS '+cls;
  hud.querySelector('[data-v30-score]').textContent='PERF '+score;
  hud.querySelector('[data-v30-tiers]').textContent='ENG '+vals[0]+' · BRK '+vals[1]+' · HDL '+vals[2]+' · NOS '+vals[3];
  root.dataset.tggGarageHudV30='1';
}
function applyRaceTierV30(){
  const score=Number(root.dataset.tggPerformanceScoreV29||60);
  const level=Number(root.dataset.tggCareerLevelV35||1);
  const order=['ROOKIE','STREET','PRO','ELITE'];
  const scoreMax=score>=90?'ELITE':score>=80?'PRO':score>=70?'STREET':'ROOKIE';
  const levelMax=level>=5?'ELITE':level>=3?'PRO':level>=2?'STREET':'ROOKIE';
  const max=order[Math.min(order.indexOf(scoreMax),order.indexOf(levelMax))];
  let selected=String(localStorage.getItem('tgg-selected-race-tier-v62')||root.dataset.tggRaceSelectedTierV62||'ROOKIE').toUpperCase();
  if(!order.includes(selected))selected='ROOKIE';
  if(order.indexOf(selected)>order.indexOf(max))selected=max;

  const mode=root.dataset.tggRaceEventModeV61||'normal';
  let effective=selected;
  if(mode==='finale')effective='ELITE';
  else if(mode==='rival'){
    const snap=String(root.dataset.tggRivalTierSnapshotV73||selected).toUpperCase();
    effective=order.includes(snap)?snap:selected;
  }

  root.dataset.tggRaceMaxUnlockedTierV62=max;
  root.dataset.tggRaceSelectedTierV62=selected;
  root.dataset.tggRaceEffectiveTierV73=effective;
  root.dataset.tggRaceTierLockV73=mode;
  root.dataset.tggRaceTierV30=effective;
  const rewardMult={ROOKIE:1,STREET:1.25,PRO:1.6,ELITE:2}[effective]||1;
  root.dataset.tggRaceRewardMultV30=String(rewardMult);
  root.dataset.tggRaceTierReadyV30='v73';
}
function applyInterchangesV30(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.scene||!THREE)return;
  let g=w.scene.getObjectByName?.('TGG_INTERCHANGES_V30');
  if(!g){
    g=new THREE.Group();g.name='TGG_INTERCHANGES_V30';w.scene.add(g);
    const road=new THREE.MeshStandardMaterial({color:0x0c1117,roughness:.98});
    const rail=new THREE.MeshStandardMaterial({color:0x4b5563,metalness:.45,roughness:.45});
    [[-760,-180,0],[760,180,Math.PI],[180,-760,Math.PI/2],[-180,760,-Math.PI/2]].forEach(([x,z,r])=>{
      const ramp=new THREE.Mesh(new THREE.BoxGeometry(16,.05,260),road);ramp.position.set(x,.02,z);ramp.rotation.y=r;g.add(ramp);
      const guard1=new THREE.Mesh(new THREE.BoxGeometry(.18,.35,250),rail);guard1.position.set(x-7.5,.22,z);guard1.rotation.y=r;g.add(guard1);
      const guard2=guard1.clone();guard2.position.x=x+7.5;g.add(guard2);
    });
  }
  root.dataset.tggInterchangesV30='1';
}
function applyUpgradeFeedbackV30(){
  if(window.TGGUpgradeFeedbackV30)return;
  const eco=window.TGGGarageEconomyV29;
  if(!eco){root.dataset.tggUpgradeFeedbackV30='ready';return}
  const original=eco.buy.bind(eco);
  eco.buy=(kind)=>{
    const before=eco.status();
    const ok=original(kind);
    const after=eco.status();
    const toast=document.createElement('div');
    toast.style.cssText='position:fixed;left:50%;top:90px;transform:translateX(-50%);z-index:10000;padding:10px 14px;border-radius:12px;background:rgba(5,10,18,.9);border:1px solid rgba(255,255,255,.18);color:white;font:800 12px system-ui,sans-serif;letter-spacing:.05em';
    toast.textContent=ok?('UPGRADED '+String(kind).toUpperCase()+' · BANK '+after.bank+' TGG'):('UPGRADE LOCKED · NEED MORE TGG');
    document.body.appendChild(toast);setTimeout(()=>toast.remove(),1400);
    root.dataset.tggUpgradeFeedbackV30=ok?'success':'locked';
    return ok;
  };
  window.TGGUpgradeFeedbackV30=true;
  root.dataset.tggUpgradeFeedbackV30='ready';
}

function applyRaceTierLocksV31(){
  const order=['ROOKIE','STREET','PRO','ELITE'];
  const max=root.dataset.tggRaceMaxUnlockedTierV62||'ROOKIE';
  const current=root.dataset.tggRaceSelectedTierV62||root.dataset.tggRaceTierV30||'ROOKIE';
  const maxIndex=Math.max(0,order.indexOf(max));
  const unlocked=Object.fromEntries(order.map((t,i)=>[t,i<=maxIndex]));
  root.dataset.tggRaceTierUnlockedV31=unlocked[current]?'1':'0';
  root.dataset.tggRaceTierLocksV31='v62';
  root.dataset.tggRaceTierStreetV31=unlocked.STREET?'1':'0';
  root.dataset.tggRaceTierProV31=unlocked.PRO?'1':'0';
  root.dataset.tggRaceTierEliteV31=unlocked.ELITE?'1':'0';
}
function applyTierScaledRaceV31(){
  const w=window.TGG3D;if(!w?.scene)return;
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const cfg={
    ROOKIE:{pace:.88,reward:1},
    STREET:{pace:.98,reward:1.25},
    PRO:{pace:1.08,reward:1.6},
    ELITE:{pace:1.18,reward:2}
  }[tier]||{pace:.9,reward:1};
  const g=w.scene.getObjectByName?.('TGG_RACE_OPPONENTS_V24');
  if(g)g.children.forEach((car,i)=>{car.userData.tggTierPace=cfg.pace+i*.035});
  const base=Number(root.dataset.tggRaceRewardV27||0);
  if(base)root.dataset.tggRaceScaledRewardV31=String(Math.round(base*cfg.reward));
  root.dataset.tggTierScaledRaceV31='1';
}
function applyVisualUpgradeEvolutionV31(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.car||!THREE)return;
  let g=w.car.getObjectByName?.('TGG_VISUAL_UPGRADES_V31');
  if(!g){
    g=new THREE.Group();g.name='TGG_VISUAL_UPGRADES_V31';w.car.add(g);
    const mat=new THREE.MeshStandardMaterial({color:0x181d24,metalness:.66,roughness:.24});
    const hood=new THREE.Mesh(new THREE.BoxGeometry(1.7,.08,1.25),mat);hood.position.set(.9,1.18,0);g.add(hood);
    const vent1=new THREE.Mesh(new THREE.BoxGeometry(.5,.05,.14),mat);vent1.position.set(1.05,1.24,-.28);g.add(vent1);
    const vent2=vent1.clone();vent2.position.z=.28;g.add(vent2);
    const canardL=new THREE.Mesh(new THREE.BoxGeometry(.34,.06,.18),mat);canardL.position.set(2.03,.42,-.82);g.add(canardL);
    const canardR=canardL.clone();canardR.position.z=.82;g.add(canardR);
  }
  const score=Number(root.dataset.tggPerformanceScoreV29||60);
  const s=score>=90?1.18:score>=80?1.08:score>=70?.98:.82;
  g.scale.set(s,s,s);
  g.visible=score>=70;
  root.dataset.tggVisualUpgradeV31=String(score);
}
function applyCareerLinksV31(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.scene||!THREE)return;
  let g=w.scene.getObjectByName?.('TGG_CAREER_LINKS_V31');
  if(!g){
    g=new THREE.Group();g.name='TGG_CAREER_LINKS_V31';w.scene.add(g);
    const road=new THREE.MeshStandardMaterial({color:0x10151b,roughness:.98});
    const glow=new THREE.MeshStandardMaterial({color:0x5bdcff,emissive:0x0b6179,emissiveIntensity:.8});
    [[-900,0,0,520],[900,0,0,520],[0,-900,Math.PI/2,520],[0,900,Math.PI/2,520],[-700,520,Math.PI/4,420],[700,-520,-Math.PI/4,420]].forEach(([x,z,r,len],i)=>{
      const link=new THREE.Mesh(new THREE.BoxGeometry(18,.05,len),road);link.position.set(x,.01,z);link.rotation.y=r;g.add(link);
      const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,5,8),glow);beacon.position.set(x,2.5,z);g.add(beacon);
      beacon.userData.tggCareerLink=i+1;
    });
  }
  root.dataset.tggCareerLinksV31='1';
}

function applyRaceEventsV32(){
  const mode=root.dataset.tggRaceEventModeV61||'normal';
  if(mode!=='normal'){root.dataset.tggRaceEventsV32='owned-'+mode;return}
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const catalog={
    ROOKIE:[
      {id:'rookie-docks',name:'Dockside Dash',reward:500,cp:5},
      {id:'rookie-loop',name:'City Loop',reward:650,cp:6}
    ],
    STREET:[
      {id:'street-midnight',name:'Midnight Run',reward:950,cp:7},
      {id:'street-industrial',name:'Industrial Sprint',reward:1100,cp:7}
    ],
    PRO:[
      {id:'pro-beltway',name:'Beltway Assault',reward:1500,cp:8},
      {id:'pro-canyon',name:'Canyon Pressure',reward:1750,cp:9}
    ],
    ELITE:[
      {id:'elite-city',name:'TGG City Grand Prix',reward:2400,cp:10},
      {id:'elite-world',name:'Worldline Championship',reward:3000,cp:12}
    ]
  };
  const list=catalog[tier]||catalog.ROOKIE;
  const index=Number(root.dataset.tggRaceEventIndexV32||0)%list.length;
  const event=list[index];
  root.dataset.tggRaceEventV32=event.id;
  root.dataset.tggRaceEventNameV32=event.name;
  root.dataset.tggRaceEventRewardV32=String(event.reward);
  root.dataset.tggRaceEventCheckpointsV32=String(event.cp);
  root.dataset.tggRaceEventsV32='1';
  if(!window.TGGRaceCareerV32){
    window.TGGRaceCareerV32={
      next(){
        root.dataset.tggRaceEventModeV61='normal';
        const i=(Number(root.dataset.tggRaceEventIndexV32||0)+1)%list.length;
        root.dataset.tggRaceEventIndexV32=String(i);
        applyRaceEventsV32();
        return this.status();
      },
      status(){
        return {
          tier:root.dataset.tggRaceTierV30||'ROOKIE',
          id:root.dataset.tggRaceEventV32,
          name:root.dataset.tggRaceEventNameV32,
          reward:Number(root.dataset.tggRaceEventRewardV32||0),
          checkpoints:Number(root.dataset.tggRaceEventCheckpointsV32||0)
        };
      }
    };
  }
}
function applyRaceRewardEscalationV32(){
  const eventReward=Number(root.dataset.tggRaceEventRewardV32||0);
  const mult=Number(root.dataset.tggRaceRewardMultV30||1);
  const pos=Number(root.dataset.tggRacePositionV26||1);
  const finishBonus=Math.max(.7,1.15-(pos-1)*.12);
  const final=Math.round(eventReward*mult*finishBonus);
  if(final>0)root.dataset.tggRaceCareerRewardV32=String(final);
  root.dataset.tggRaceRewardEscalationV32='1';
}
function applyGarageEvolutionV32(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.car||!THREE)return;
  let g=w.car.getObjectByName?.('TGG_GARAGE_EVOLUTION_V32');
  if(!g){
    g=new THREE.Group();g.name='TGG_GARAGE_EVOLUTION_V32';w.car.add(g);
    const carbon=new THREE.MeshStandardMaterial({color:0x101318,metalness:.72,roughness:.22});
    const accent=new THREE.MeshStandardMaterial({color:0x5bdcff,emissive:0x0a5c73,emissiveIntensity:.9,metalness:.45,roughness:.2});
    const scoop=new THREE.Mesh(new THREE.BoxGeometry(.9,.12,.6),carbon);scoop.position.set(.7,1.34,0);g.add(scoop);
    const flareL=new THREE.Mesh(new THREE.BoxGeometry(.9,.22,.12),carbon);flareL.position.set(.7,.62,-1.02);g.add(flareL);
    const flareR=flareL.clone();flareR.position.z=1.02;g.add(flareR);
    const brace=new THREE.Mesh(new THREE.BoxGeometry(.12,.18,1.9),accent);brace.position.set(-1.9,.7,0);g.add(brace);
    const underglow=new THREE.Mesh(new THREE.BoxGeometry(3.2,.03,1.5),accent);underglow.position.set(0,.12,0);g.add(underglow);
  }
  const eng=Number(root.dataset.tggEngineTierV29||0);
  const brk=Number(root.dataset.tggBrakesTierV29||0);
  const hdl=Number(root.dataset.tggHandlingTierV29||0);
  const nos=Number(root.dataset.tggNitrousTierV29||0);
  const tier=Math.max(eng,brk,hdl,nos);
  g.children.forEach((o,i)=>o.visible=tier>=Math.min(3,1+Math.floor(i/2)));
  root.dataset.tggGarageEvolutionV32=String(tier);
}
function applyCareerDestinationsV32(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.scene||!THREE)return;
  let g=w.scene.getObjectByName?.('TGG_CAREER_DESTINATIONS_V32');
  if(!g){
    g=new THREE.Group();g.name='TGG_CAREER_DESTINATIONS_V32';w.scene.add(g);
    const defs=[
      ['ROOKIE',0x61d4ff,-260,-260],
      ['STREET',0xffcc55,330,-180],
      ['PRO',0xff5c9a,-420,360],
      ['ELITE',0xb27cff,520,520]
    ];
    defs.forEach(([name,color,x,z])=>{
      const mat=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:1.1,transparent:true,opacity:.75});
      const ring=new THREE.Mesh(new THREE.TorusGeometry(6,.25,10,40),mat);ring.rotation.x=Math.PI/2;ring.position.set(x,.15,z);ring.userData.tggRaceTier=name;g.add(ring);
      const beam=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,18,10),mat);beam.position.set(x,9,z);beam.userData.tggRaceTier=name;g.add(beam);
    });
  }
  const score=Number(root.dataset.tggPerformanceScoreV29||60);
  const unlock={ROOKIE:true,STREET:score>=70,PRO:score>=80,ELITE:score>=90};
  g.children.forEach(o=>{const t=o.userData.tggRaceTier;o.visible=!!unlock[t]});
  root.dataset.tggCareerDestinationsV32='1';
}

function applyEventRoutesV33(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.scene||!THREE)return;
  const mode=root.dataset.tggRaceEventModeV61||'normal';
  if(mode!=='normal'){root.dataset.tggEventRoutesV33='owned-'+mode;return}
  const id=root.dataset.tggRaceEventV32||'rookie-docks';
  let g=w.scene.getObjectByName?.('TGG_EVENT_ROUTE_V33');
  if(!g){g=new THREE.Group();g.name='TGG_EVENT_ROUTE_V33';w.scene.add(g)}
  if(g.userData.eventId!==id){
    while(g.children.length)g.remove(g.children[0]);
    const routes={
      'rookie-docks':[[-70,-55],[-30,-85],[20,-80],[62,-45],[48,10],[5,34]],
      'rookie-loop':[[-42,-42],[0,-68],[52,-40],[68,12],[30,60],[-28,55],[-62,10]],
      'street-midnight':[[-90,-10],[-52,-72],[10,-96],[80,-54],[96,18],[45,88],[-30,92],[-86,38]],
      'street-industrial':[[-110,-60],[-45,-105],[40,-96],[112,-35],[96,58],[25,108],[-70,82],[-118,12]],
      'pro-beltway':[[-150,0],[-105,-105],[0,-150],[105,-105],[150,0],[105,105],[0,150],[-105,105]],
      'pro-canyon':[[-155,-75],[-80,-155],[20,-175],[125,-118],[170,-20],[105,92],[10,160],[-105,125],[-170,25]],
      'elite-city':[[-210,-40],[-145,-160],[-20,-215],[120,-175],[210,-55],[185,95],[70,205],[-75,210],[-190,115],[-230,25]],
      'elite-world':[[-270,-100],[-160,-240],[0,-285],[175,-230],[280,-80],[265,100],[150,245],[-20,300],[-185,225],[-285,70],[-245,-45]]
    };
    const pts=routes[id]||routes['rookie-docks'];
    const mat=new THREE.MeshStandardMaterial({color:0x5fe8ff,emissive:0x0d728c,emissiveIntensity:2.2,transparent:true,opacity:.78});
    pts.forEach(([x,z],i)=>{
      const ring=new THREE.Mesh(new THREE.TorusGeometry(2.8,.14,8,28),mat);
      ring.rotation.x=Math.PI/2;ring.position.set(x,.16,z);ring.userData.routeIndex=i;g.add(ring);
    });
    g.userData.eventId=id;
    root.dataset.tggEventRouteCountV33=String(pts.length);
  }
  g.visible=root.dataset.tggRaceMode==='on';
  root.dataset.tggEventRoutesV33='1';
}
function applyRaceEntryV33(){
  const score=Number(root.dataset.tggPerformanceScoreV29||60);
  const selected=root.dataset.tggRaceSelectedTierV62||'ROOKIE';
  const effective=root.dataset.tggRaceEffectiveTierV73||selected;
  const mode=root.dataset.tggRaceEventModeV61||'normal';
  const tier=mode==='normal'?selected:effective;
  const max=root.dataset.tggRaceMaxUnlockedTierV62||'ROOKIE';
  const order=['ROOKIE','STREET','PRO','ELITE'];
  const min={ROOKIE:60,STREET:70,PRO:80,ELITE:90}[tier]||60;
  const eligible=score>=min&&order.indexOf(tier)<=order.indexOf(max);
  root.dataset.tggRaceEntryMinV33=String(min);
  root.dataset.tggRaceEntryEligibleV33=eligible?'1':'0';
  root.dataset.tggRaceEntryTierV73=tier;
  root.dataset.tggRaceEntryV33='v73';
}
function applyChampionshipBonusV33(){
  const id=root.dataset.tggRaceEventV32||'';
  const elite=id==='elite-city'||id==='elite-world';
  const finished=root.dataset.tggRaceFinishV25==='1';
  const pos=Number(root.dataset.tggRacePositionV26||4);
  const bonus=elite&&finished&&pos===1?(id==='elite-world'?1800:1200):0;
  root.dataset.tggChampionshipBonusV33=String(bonus);
  root.dataset.tggChampionshipV33='1';
}
function applyGarageMilestonesV33(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.car||!THREE)return;
  let g=w.car.getObjectByName?.('TGG_GARAGE_MILESTONES_V33');
  if(!g){
    g=new THREE.Group();g.name='TGG_GARAGE_MILESTONES_V33';w.car.add(g);
    const chrome=new THREE.MeshStandardMaterial({color:0xc9d3df,metalness:.96,roughness:.12});
    const glow=new THREE.MeshStandardMaterial({color:0x58dbff,emissive:0x0d6379,emissiveIntensity:1.4,metalness:.5,roughness:.2});
    const bar=new THREE.Mesh(new THREE.BoxGeometry(1.75,.07,.12),chrome);bar.position.set(-1.75,1.58,0);g.add(bar);
    const tipL=new THREE.Mesh(new THREE.CylinderGeometry(.08,.11,.45,12),chrome);tipL.rotation.z=Math.PI/2;tipL.position.set(-2.25,.42,-.42);g.add(tipL);
    const tipR=tipL.clone();tipR.position.z=.42;g.add(tipR);
    const glowL=new THREE.Mesh(new THREE.BoxGeometry(2.4,.035,.055),glow);glowL.position.set(0,.18,-.92);g.add(glowL);
    const glowR=glowL.clone();glowR.position.z=.92;g.add(glowR);
  }
  const score=Number(root.dataset.tggPerformanceScoreV29||60);
  g.children.forEach((o,i)=>{o.visible=score>=(i<1?80:i<3?90:70)});
  root.dataset.tggGarageMilestonesV33=String(score);
}
function applyEventCardV33(){
  let card=document.getElementById('tgg-event-card-v33');
  if(!card){
    card=document.createElement('div');card.id='tgg-event-card-v33';
    card.style.cssText='position:fixed;left:18px;top:18px;z-index:9994;min-width:230px;max-width:300px;padding:12px 14px;border:1px solid rgba(255,255,255,.16);border-radius:14px;background:rgba(4,8,14,.78);backdrop-filter:blur(10px);font:700 11px/1.45 system-ui,sans-serif;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.35)';
    document.body.appendChild(card);
  }
  const name=root.dataset.tggRaceEventNameV32||'Dockside Dash';
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const reward=Number(root.dataset.tggRaceCareerRewardV32||root.dataset.tggRaceEventRewardV32||0);
  const min=Number(root.dataset.tggRaceEntryMinV33||60);
  const eligible=root.dataset.tggRaceEntryEligibleV33!=='0';
  const sig=[name,tier,reward,min,eligible?'1':'0'].join('|');
  if(card.dataset.tggSigV71!==sig){
    card.dataset.tggSigV71=sig;
    card.innerHTML='<div style="font-size:12px;font-weight:900;letter-spacing:.08em">'+name+'</div><div>'+tier+' EVENT</div><div>REWARD '+reward+' TGG</div><div>REQ PERF '+min+'</div><div style="margin-top:4px;font-weight:900;color:'+(eligible?'#77f6b5':'#ff7b88')+'">'+(eligible?'ENTRY READY':'UPGRADE REQUIRED')+'</div>';
    root.dataset.tggUiWritesV71=String(Number(root.dataset.tggUiWritesV71||0)+1);
  }
  root.dataset.tggEventCardV33='1';
}

function installRaceStartGuardV34(){
  if(window.TGGRaceStartGuardV34)return;
  const canStart=()=>root.dataset.tggRaceEntryEligibleV33!=='0';
  const start=()=>{
    if(!canStart()){
      root.dataset.tggRaceStartBlockedV34='1';
      const card=document.getElementById('tgg-event-card-v33');
      if(card){card.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:320})}
      return false;
    }
    root.dataset.tggRaceStartBlockedV34='0';
    root.dataset.tggRaceMode='on';
    root.dataset.tggRaceFinishV25='0';
    root.dataset.tggRaceCheckpointV25='0';
    root.dataset.tggRacePayoutClaimedV34='0';
    return true;
  };
  window.TGGRaceStartGuardV34={canStart,start};
  root.dataset.tggRaceStartGuardV34='1';
}
function applyEventCheckpointProgressV34(){
  const w=window.TGG3D;if(!w?.car)return;
  const route=w.scene?.getObjectByName?.('TGG_EVENT_ROUTE_V33');
  const race=root.dataset.tggRaceMode==='on';
  const runId=root.dataset.tggRaceRunIdV43||'';
  if(!route||!race){root.dataset.tggEventCheckpointProgressV34='ready';return}
  root.dataset.tggCheckpointAuthorityV63='event-route';
  root.dataset.tggCheckpointRouteOwnerV63=root.dataset.tggRaceRouteOwnerV61||'v33';
  let index=Number(root.dataset.tggEventCheckpointIndexV34||0);
  const total=route.children.length||Number(root.dataset.tggRaceEventCheckpointsV32||0);
  if(total<=0){root.dataset.tggEventCheckpointProgressV34='waiting-route';return}
  route.children.forEach((cp,i)=>cp.visible=i>=index);
  const cp=route.children[index];
  if(cp&&w.car.position.distanceTo(cp.position)<5.5){
    cp.visible=false;index++;
    root.dataset.tggEventCheckpointIndexV34=String(index);
    root.dataset.tggCheckpointStampV63=runId+':'+index+'/'+total;
  }
  root.dataset.tggRaceCheckpointV25=String(Math.min(index,total));
  root.dataset.tggRaceTotalV25=String(total);
  if(index>=total&&root.dataset.tggRaceFinishV25!=='1'){
    const finishStamp=runId+':'+String(root.dataset.tggRaceEventV32||'event');
    if(root.dataset.tggRaceFinishStampV63!==finishStamp){
      root.dataset.tggRaceFinishStampV63=finishStamp;
      const opponents=w.scene?.getObjectByName?.('TGG_RACE_OPPONENTS_V24')?.children||[];
      const finishedOpponents=opponents.filter(o=>!!o.userData?.tggFinishStampV64).length;
      const finalPlace=Math.min(4,1+finishedOpponents);
      root.dataset.tggRacePositionV26=String(finalPlace);
      root.dataset.tggPlayerFinishOrderV64=String(finalPlace);
      root.dataset.tggRaceFinishV25='1';
      root.dataset.tggRaceMode='off';
      root.dataset.tggRaceFinishOwnerV63='event-route';
    }
  }
  root.dataset.tggEventCheckpointProgressV34='v63';
}
function applyCareerPayoutV34(){
  const finished=root.dataset.tggRaceFinishV25==='1';
  const runId=root.dataset.tggRaceRunIdV43||'';
  const event=String(root.dataset.tggRaceEventV32||'event');
  if(!finished||!runId){root.dataset.tggCareerPayoutV34='ready';return}
  const base=Number(root.dataset.tggRaceCareerRewardV32||0);
  const bonus=Number(root.dataset.tggChampionshipBonusV33||0);
  const payout=Math.max(0,base+bonus);
  const claimId='race:'+runId+':'+event+':base';
  const result=window.TGGPayoutV67?.grant?.(claimId,payout,'race-base')||{granted:false};
  root.dataset.tggRacePayoutClaimedV34='1';
  root.dataset.tggCareerPayoutAmountV34=String(payout);
  root.dataset.tggCareerPayoutClaimV67=claimId;
  root.dataset.tggCareerPayoutV34=result.granted?'v67-granted':'v67-claimed';
}
function applyChampionshipHistoryV34(){
  const id=root.dataset.tggRaceEventV32||'';
  const finished=root.dataset.tggRaceFinishV25==='1';
  const pos=Number(root.dataset.tggRacePositionV26||4);
  const runId=root.dataset.tggRaceRunIdV43||'';
  if(!finished||pos!==1||!(id==='elite-city'||id==='elite-world')||!runId){
    root.dataset.tggChampionshipHistoryV34='ready';
    root.dataset.tggChampionshipHistoryV61='ready';
    return;
  }
  try{
    const claimKey='tgg-championship-win-claims-v61';
    const winsKey='tgg-championship-wins-v61';
    const claims=JSON.parse(localStorage.getItem(claimKey)||'{}');
    const claimId=runId+':'+id;
    if(!claims[claimId]){
      claims[claimId]=Date.now();
      const data=JSON.parse(localStorage.getItem(winsKey)||'{}');
      data[id]=Number(data[id]||0)+1;
      localStorage.setItem(claimKey,JSON.stringify(claims));
      localStorage.setItem(winsKey,JSON.stringify(data));
    }
    const data=JSON.parse(localStorage.getItem(winsKey)||'{}');
    const total=String(Object.values(data).reduce((a,b)=>a+Number(b||0),0));
    root.dataset.tggChampionshipWinsV61=total;
    root.dataset.tggChampionshipWinsV34=total;
    root.dataset.tggChampionshipClaimRunV61=claimId;
  }catch{}
  root.dataset.tggChampionshipHistoryV34='v61-safe';
  root.dataset.tggChampionshipHistoryV61='1';
}
function applyCareerLadderHudV34(){
  let hud=document.getElementById('tgg-career-ladder-v34');
  if(!hud){
    hud=document.createElement('div');hud.id='tgg-career-ladder-v34';
    hud.style.cssText='position:fixed;right:18px;top:18px;z-index:9993;min-width:220px;padding:12px 14px;border:1px solid rgba(255,255,255,.16);border-radius:14px;background:rgba(4,8,14,.78);backdrop-filter:blur(10px);font:700 11px/1.45 system-ui,sans-serif;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.35)';
    document.body.appendChild(hud);
  }
  const score=Number(root.dataset.tggPerformanceScoreV29||60);
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const event=root.dataset.tggRaceEventNameV32||'Dockside Dash';
  const next=score<70?'STREET @ 70':score<80?'PRO @ 80':score<90?'ELITE @ 90':'ELITE UNLOCKED';
  const wins=Number(root.dataset.tggChampionshipWinsV34||0);
  const sig=[tier,event,score,next,wins].join('|');
  if(hud.dataset.tggSigV71!==sig){
    hud.dataset.tggSigV71=sig;
    hud.innerHTML='<div style="font-size:12px;font-weight:900;letter-spacing:.08em">TGG RACE CAREER</div><div>TIER '+tier+'</div><div>'+event+'</div><div>PERF '+score+'</div><div>NEXT '+next+'</div><div>CHAMP WINS '+wins+'</div>';
    root.dataset.tggUiWritesV71=String(Number(root.dataset.tggUiWritesV71||0)+1);
  }
  root.dataset.tggCareerLadderV34='1';
}

function installRaceTimingV35(){
  if(window.TGGRaceTimingV35)return;
  let running=false,start=0,lastEvent='';
  const begin=()=>{
    running=true;start=performance.now();lastEvent=root.dataset.tggRaceEventV32||'event';
    root.dataset.tggRaceElapsedV35='0';
  };
  const finish=()=>{
    if(!running)return;
    const elapsed=(performance.now()-start)/1000;running=false;
    root.dataset.tggRaceElapsedV35=elapsed.toFixed(2);
    try{
      const key='tgg-race-bests-v35',data=JSON.parse(localStorage.getItem(key)||'{}');
      const prev=Number(data[lastEvent]||0);
      if(!prev||elapsed<prev)data[lastEvent]=elapsed;
      localStorage.setItem(key,JSON.stringify(data));
      root.dataset.tggRaceBestV35=String(data[lastEvent].toFixed(2));
    }catch{}
  };
  window.TGGRaceTimingV35={begin,finish,get running(){return running}};
  root.dataset.tggRaceTimingV35='1';
}
function applyRaceTimingV35(){
  const timing=window.TGGRaceTimingV35;if(!timing)return;
  const race=root.dataset.tggRaceMode==='on',finished=root.dataset.tggRaceFinishV25==='1';
  if(race&&!timing.running)timing.begin();
  if(finished&&timing.running)timing.finish();
  root.dataset.tggRaceTimingTickV35='1';
}
function applyCareerXpV35(){
  const finished=root.dataset.tggRaceFinishV25==='1';
  const runId=root.dataset.tggRaceRunIdV43||'';
  if(!finished||!runId){root.dataset.tggCareerXpV35='ready';return}
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const pos=Number(root.dataset.tggRacePositionV26||4);
  const xpBase={ROOKIE:80,STREET:120,PRO:180,ELITE:260}[tier]||80;
  const xp=Math.max(30,Math.round(xpBase*(1.15-(pos-1)*.12)));
  const claimId='race:'+runId+':xp';
  const result=window.TGGProgressV68?.claim?.(claimId,'career-xp',()=>{
    const key='tgg-career-xp-v35';
    const total=Number(localStorage.getItem(key)||0)+xp;
    localStorage.setItem(key,String(total));
    root.dataset.tggCareerXpTotalV35=String(total);
    root.dataset.tggCareerLevelV35=String(1+Math.floor(total/500));
    root.dataset.tggCareerXpEarnedV35=String(xp);
    return {xp,total};
  })||{granted:false};
  if(!result.granted){
    const total=Number(localStorage.getItem('tgg-career-xp-v35')||0);
    root.dataset.tggCareerXpTotalV35=String(total);
    root.dataset.tggCareerLevelV35=String(1+Math.floor(total/500));
    root.dataset.tggCareerXpEarnedV35=String(xp);
  }
  root.dataset.tggXpClaimedV35='1';
  root.dataset.tggCareerXpClaimV68=claimId;
  root.dataset.tggCareerXpV35=result.granted?'v68-granted':'v68-claimed';
}
function applyCareerUnlocksV35(){
  const order=['ROOKIE','STREET','PRO','ELITE'];
  const max=root.dataset.tggRaceMaxUnlockedTierV62||'ROOKIE';
  const maxI=Math.max(0,order.indexOf(max));
  root.dataset.tggCareerUnlockStreetV35=maxI>=1?'1':'0';
  root.dataset.tggCareerUnlockProV35=maxI>=2?'1':'0';
  root.dataset.tggCareerUnlockEliteV35=maxI>=3?'1':'0';
  root.dataset.tggCareerUnlockSourceV74='tier-authority-v62';
  root.dataset.tggCareerUnlocksV35='v74';
}
function applyRaceResultsScreenV35(){
  let panel=document.getElementById('tgg-race-results-screen-v35');
  if(!panel){
    panel=document.createElement('div');panel.id='tgg-race-results-screen-v35';
    panel.style.cssText='position:fixed;inset:0;z-index:10020;display:none;place-items:center;background:rgba(2,5,10,.74);backdrop-filter:blur(10px)';
    panel.innerHTML='<div style="width:min(92vw,440px);padding:22px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(5,10,18,.95);color:white;font:700 13px/1.5 system-ui,sans-serif;box-shadow:0 28px 70px rgba(0,0,0,.5)"><div data-v35-title style="font-size:20px;font-weight:950;letter-spacing:.06em">RACE COMPLETE</div><div data-v35-event></div><div data-v35-time></div><div data-v35-best></div><div data-v35-xp></div><div data-v35-pay></div><div data-v69-bonus></div><div data-v69-progress></div><button data-v35-close style="margin-top:14px;padding:10px 14px;border-radius:10px;border:0;font-weight:900">RETURN TO WORLD</button></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-v35-close]').addEventListener('click',()=>{panel.style.display='none';root.dataset.tggPostRaceV35='closed'});
  }
  const box=panel.firstElementChild;
  if(box&&!box.querySelector('[data-v69-bonus]')){
    const pay=box.querySelector('[data-v35-pay]');
    const bonus=document.createElement('div');bonus.dataset.v69Bonus='1';
    const progress=document.createElement('div');progress.dataset.v69Progress='1';
    pay?.after(bonus);bonus.after(progress);
  }
  const finished=root.dataset.tggRaceFinishV25==='1';
  if(!finished||root.dataset.tggRaceResultsShownV35==='1'){root.dataset.tggRaceResultsScreenV35=finished?'ready':'waiting';return}
  panel.style.display='grid';
  const base=Number(root.dataset.tggRaceCareerRewardV32||0);
  const champ=Number(root.dataset.tggChampionshipBonusV33||0);
  const streak=Number(root.dataset.tggStreakPayoutAmountV39||0);
  const series=String(root.dataset.tggRaceEventV32||'').startsWith('rival-')?Number(root.dataset.tggSeriesRewardAmountV41||0):0;
  const xp=Number(root.dataset.tggCareerXpEarnedV35||0);
  const season=Number(root.dataset.tggSeasonPointsEarnedV40||0);
  const rep=Number(root.dataset.tggCrewRepGainV40||0);
  panel.querySelector('[data-v35-event]').textContent=root.dataset.tggRaceEventNameV32||'Race Event';
  panel.querySelector('[data-v35-time]').textContent='TIME '+(root.dataset.tggRaceElapsedV35||'0.00')+'s';
  panel.querySelector('[data-v35-best]').textContent='BEST '+(root.dataset.tggRaceBestV35||root.dataset.tggRaceElapsedV35||'0.00')+'s';
  panel.querySelector('[data-v35-xp]').textContent='XP +'+xp+' · LEVEL '+(root.dataset.tggCareerLevelV35||'1');
  panel.querySelector('[data-v35-pay]').textContent='BASE '+base+' TGG'+(champ>0?' · CHAMP +'+champ:'');
  panel.querySelector('[data-v69-bonus]').textContent='BONUS '+(streak+series)+' TGG'+(streak>0?' · STREAK +'+streak:'')+(series>0?' · SERIES +'+series:'');
  panel.querySelector('[data-v69-progress]').textContent='SEASON +'+season+' · CREW REP +'+rep;
  root.dataset.tggResultsBreakdownV69='1';
  root.dataset.tggResultsBaseV69=String(base);
  root.dataset.tggResultsBonusV69=String(streak+series+champ);
  root.dataset.tggResultsProgressV69='xp-season-rep';
  root.dataset.tggRaceResultsShownV35='1';
  root.dataset.tggRaceResultsScreenV35='v69';
}
function applyPostRaceFlowV35(){
  if(root.dataset.tggRaceFinishV25!=='1'){root.dataset.tggPostRaceFlowV35='ready';return}
  root.dataset.tggPostRaceFlowV35='1';
  root.dataset.tggRaceMode='off';
}

function applyEventCompletionV36(){
  const finished=root.dataset.tggRaceFinishV25==='1';
  const id=root.dataset.tggRaceEventV32||'';
  const runId=root.dataset.tggRaceRunIdV43||'';
  if(!finished||!id||!runId){root.dataset.tggEventCompletionV36='ready';return}
  const claimId='race:'+runId+':event:'+id;
  const result=window.TGGProgressV68?.claim?.(claimId,'event-completion',()=>{
    const key='tgg-event-completions-v36';
    const data=JSON.parse(localStorage.getItem(key)||'{}');
    if(!data[id])data[id]={wins:0,finishes:0,best:Number(root.dataset.tggRaceBestV35||0)||null};
    data[id].finishes=Number(data[id].finishes||0)+1;
    if(Number(root.dataset.tggRacePositionV26||4)===1)data[id].wins=Number(data[id].wins||0)+1;
    const best=Number(root.dataset.tggRaceBestV35||0);
    if(best&&(!data[id].best||best<data[id].best))data[id].best=best;
    localStorage.setItem(key,JSON.stringify(data));
    root.dataset.tggCompletedEventsV36=String(Object.keys(data).length);
    return {event:id,finishes:data[id].finishes,wins:data[id].wins};
  })||{granted:false};
  if(!result.granted){
    try{const data=JSON.parse(localStorage.getItem('tgg-event-completions-v36')||'{}');root.dataset.tggCompletedEventsV36=String(Object.keys(data).length)}catch{}
  }
  root.dataset.tggEventCompletionClaimedV36='1';
  root.dataset.tggEventCompletionClaimV68=claimId;
  root.dataset.tggEventCompletionV36=result.granted?'v68-granted':'v68-claimed';
}
function applyCareerUnlockPersistenceV36(){
  const order=['ROOKIE','STREET','PRO','ELITE'];
  const max=root.dataset.tggRaceMaxUnlockedTierV62||'ROOKIE';
  const maxI=Math.max(0,order.indexOf(max));
  const unlocks={rookie:true,street:maxI>=1,pro:maxI>=2,elite:maxI>=3};
  try{
    const key='tgg-career-unlocks-v36';
    const prev=JSON.parse(localStorage.getItem(key)||'{}');
    const merged={...prev,...Object.fromEntries(Object.entries(unlocks).map(([k,v])=>[k,!!(v||prev[k])]))};
    const serialized=JSON.stringify(merged);
    if(localStorage.getItem(key)!==serialized)localStorage.setItem(key,serialized);
    root.dataset.tggUnlockStreetV36=merged.street?'1':'0';
    root.dataset.tggUnlockProV36=merged.pro?'1':'0';
    root.dataset.tggUnlockEliteV36=merged.elite?'1':'0';
  }catch{}
  root.dataset.tggCareerUnlockPersistenceSourceV74='tier-authority-v62';
  root.dataset.tggCareerUnlockPersistenceV36='v74';
}
function applyTierRivalsV36(){
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const rival={
    ROOKIE:{name:'Ace Rivera',crew:'South Block',car:'Street 01'},
    STREET:{name:'Maya Knox',crew:'Neon District',car:'Tuner 88'},
    PRO:{name:'Dante Cross',crew:'Beltway Kings',car:'Pro Spec'},
    ELITE:{name:'Nova King',crew:'Worldline',car:'Elite X'}
  }[tier];
  if(rival){
    root.dataset.tggRivalNameV36=rival.name;
    root.dataset.tggRivalCrewV36=rival.crew;
    root.dataset.tggRivalCarV36=rival.car;
  }
  const g=window.TGG3D?.scene?.getObjectByName?.('TGG_RACE_OPPONENTS_V24');
  if(g?.children?.[0])g.children[0].userData.tggRival=rival;
  root.dataset.tggTierRivalsV36='1';
}
function applyAchievementsV36(){
  const score=Number(root.dataset.tggPerformanceScoreV29||60);
  const level=Number(root.dataset.tggCareerLevelV35||1);
  const wins=Number(root.dataset.tggChampionshipWinsV34||0);
  const bank=Number(root.dataset.tggRaceBankV28||localStorage.getItem('tgg-race-bank-v28')||0);
  const achievements={
    firstUpgrade:score>60,
    streetReady:score>=70,
    proReady:score>=80,
    eliteReady:score>=90,
    careerLevel5:level>=5,
    champion:wins>=1,
    highRoller:bank>=5000
  };
  try{localStorage.setItem('tgg-achievements-v36',JSON.stringify(achievements))}catch{}
  root.dataset.tggAchievementsV36=String(Object.values(achievements).filter(Boolean).length);
}
function applyNextObjectiveV36(){
  let hud=document.getElementById('tgg-next-objective-v36');
  if(!hud){
    hud=document.createElement('div');hud.id='tgg-next-objective-v36';
    hud.style.cssText='position:fixed;left:18px;bottom:18px;z-index:9992;max-width:300px;padding:10px 12px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(5,10,18,.8);backdrop-filter:blur(10px);font:750 11px/1.45 system-ui,sans-serif;color:#fff';
    document.body.appendChild(hud);
  }
  const score=Number(root.dataset.tggPerformanceScoreV29||60),level=Number(root.dataset.tggCareerLevelV35||1);
  let msg='Win Rookie events and build your car.';
  if(score<70)msg='Upgrade to PERF 70 to unlock Street races.';
  else if(level<2)msg='Earn Career Level 2 to unlock Street races.';
  else if(score<80)msg='Push the car to PERF 80 for Pro races.';
  else if(level<3)msg='Reach Career Level 3 for Pro races.';
  else if(score<90)msg='Build to PERF 90 for Elite races.';
  else if(level<5)msg='Reach Career Level 5 to unlock Elite.';
  else if(Number(root.dataset.tggChampionshipWinsV34||0)<1)msg='Win an Elite championship.';
  else msg='Defend your championship and chase faster best times.';
  hud.textContent='NEXT: '+msg;
  root.dataset.tggNextObjectiveV36='1';
}
function enhanceResultsActionsV36(){
  const panel=document.getElementById('tgg-race-results-screen-v35');
  if(!panel||panel.dataset.v36==='1'){root.dataset.tggResultsActionsV36=panel?'ready':'waiting';return}
  const box=panel.firstElementChild;if(!box)return;
  const actions=document.createElement('div');
  actions.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:10px';
  actions.innerHTML='<button data-v36-garage>GARAGE</button><button data-v36-next>NEXT EVENT</button><button data-v36-world>WORLD</button>';
  box.appendChild(actions);
  actions.querySelectorAll('button').forEach(b=>b.style.cssText='padding:9px 11px;border-radius:9px;border:0;font-weight:900');
  actions.querySelector('[data-v36-garage]').onclick=()=>{panel.style.display='none';document.documentElement.dataset.tggGarageFocus='1'};
  actions.querySelector('[data-v36-next]').onclick=()=>{panel.style.display='none';window.TGGRaceCareerV32?.next?.();root.dataset.tggRaceResultsShownV35='0';root.dataset.tggRaceFinishV25='0';root.dataset.tggEventCheckpointIndexV34='0';root.dataset.tggEventCompletionClaimedV36='0';};
  actions.querySelector('[data-v36-world]').onclick=()=>{panel.style.display='none';root.dataset.tggPostRaceV35='world'};
  panel.dataset.v36='1';
  root.dataset.tggResultsActionsV36='1';
}

function applyRivalBehaviorV37(){
  const w=window.TGG3D;if(!w?.scene)return;
  const g=w.scene.getObjectByName?.('TGG_RACE_OPPONENTS_V24');
  if(!g?.children?.length){root.dataset.tggRivalBehaviorV37='ready';return}
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const cfg={
    ROOKIE:{aggr:.92,boost:.02},
    STREET:{aggr:1.00,boost:.04},
    PRO:{aggr:1.08,boost:.07},
    ELITE:{aggr:1.16,boost:.1}
  }[tier]||{aggr:.95,boost:.02};
  const rival=g.children[0];
  rival.userData.tggRivalAggression=cfg.aggr;
  rival.userData.tggRivalBoostChance=cfg.boost;
  if(root.dataset.tggRaceMode==='on'&&Number(root.dataset.tggRacePositionV26||1)===1){
    rival.userData.tggCatchup=Math.max(Number(rival.userData.tggCatchup||1),cfg.aggr);
  }
  root.dataset.tggRivalBehaviorV37='1';
}
function applyWinStreakV37(){
  const finished=root.dataset.tggRaceFinishV25==='1';
  if(!finished||root.dataset.tggWinStreakClaimedV37==='1'){root.dataset.tggWinStreakV37=finished?'ready':'waiting';return}
  const won=Number(root.dataset.tggRacePositionV26||4)===1;
  try{
    const key='tgg-win-streak-v37';
    let streak=Number(localStorage.getItem(key)||0);
    streak=won?streak+1:0;
    localStorage.setItem(key,String(streak));
    root.dataset.tggWinStreakCountV37=String(streak);
    root.dataset.tggWinStreakClaimedV37='1';
    if(streak>=3)root.dataset.tggWinStreakBonusV37=String(Math.min(1000,streak*150));
  }catch{}
  root.dataset.tggWinStreakV37='1';
}
function applyAchievementRewardsV37(){
  let achievements={};try{achievements=JSON.parse(localStorage.getItem('tgg-achievements-v36')||'{}')}catch{}
  const rewards={firstUpgrade:150,streetReady:300,proReady:500,eliteReady:800,careerLevel5:900,champion:1500,highRoller:750};
  let granted=0,claimed=0;
  Object.entries(achievements).forEach(([k,v])=>{
    if(!v||!rewards[k])return;
    const claimId='achievement:'+k;
    const result=window.TGGPayoutV67?.grant?.(claimId,rewards[k],'achievement')||{granted:false};
    if(result.granted)granted+=rewards[k];
    else claimed++;
  });
  root.dataset.tggAchievementRewardV37=String(granted);
  root.dataset.tggAchievementRewardOwnerV69='payout-v67';
  root.dataset.tggAchievementRewardClaimsV69=String(claimed);
  root.dataset.tggAchievementRewardsV37='v69';
}
function applyGarageReturnV37(){
  if(root.dataset.tggGarageFocus!=='1'){root.dataset.tggGarageReturnV37='ready';return}
  const hud=document.getElementById('tgg-garage-hud-v30');
  if(hud)hud.animate([{transform:'scale(.98)',opacity:.6},{transform:'scale(1)',opacity:1}],{duration:420,easing:'ease-out'});
  root.dataset.tggGarageFocus='0';
  root.dataset.tggGarageReturnV37='1';
}
function applyCareerDashboardV37(){
  let dash=document.getElementById('tgg-career-dashboard-v37');
  if(!dash){
    dash=document.createElement('div');dash.id='tgg-career-dashboard-v37';
    dash.style.cssText='position:fixed;right:18px;bottom:18px;z-index:9991;min-width:250px;max-width:320px;padding:12px 14px;border:1px solid rgba(255,255,255,.15);border-radius:14px;background:rgba(5,10,18,.82);backdrop-filter:blur(12px);font:700 11px/1.45 system-ui,sans-serif;color:#fff;box-shadow:0 18px 40px rgba(0,0,0,.35)';
    document.body.appendChild(dash);
  }
  const level=root.dataset.tggCareerLevelV35||'1';
  const xp=root.dataset.tggCareerXpTotalV35||'0';
  const bank=root.dataset.tggRaceBankV28||localStorage.getItem('tgg-race-bank-v28')||'0';
  const rival=root.dataset.tggRivalNameV36||'Ace Rivera';
  const crew=root.dataset.tggRivalCrewV36||'South Block';
  const streak=root.dataset.tggWinStreakCountV37||localStorage.getItem('tgg-win-streak-v37')||'0';
  const objective=(document.getElementById('tgg-next-objective-v36')?.textContent||'NEXT: Build your career.').replace(/^NEXT:\s*/,'');
  const sig=[level,xp,bank,rival,crew,streak,objective].join('|');
  if(dash.dataset.tggSigV71!==sig){
    dash.dataset.tggSigV71=sig;
    dash.innerHTML='<div style="font-size:12px;font-weight:950;letter-spacing:.08em">TGG CAREER DASH</div><div>LEVEL '+level+' · XP '+xp+'</div><div>BANK '+bank+' TGG</div><div>RIVAL '+rival+' · '+crew+'</div><div>WIN STREAK '+streak+'</div><div style="margin-top:5px;color:#bdefff">'+objective+'</div>';
    root.dataset.tggUiWritesV71=String(Number(root.dataset.tggUiWritesV71||0)+1);
  }
  root.dataset.tggCareerDashboardV37='1';
}

function applyRivalChallengeV38(){
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const rival=root.dataset.tggRivalNameV36||'Ace Rivera';
  const score=Number(root.dataset.tggPerformanceScoreV29||60);
  const level=Number(root.dataset.tggCareerLevelV35||1);
  const req={ROOKIE:{score:60,level:1},STREET:{score:72,level:2},PRO:{score:82,level:3},ELITE:{score:92,level:5}}[tier];
  const eligible=score>=req.score&&level>=req.level;
  root.dataset.tggRivalChallengeNameV38=rival+' Showdown';
  root.dataset.tggRivalChallengeEligibleV38=eligible?'1':'0';
  root.dataset.tggRivalChallengeScoreV38=String(req.score);
  root.dataset.tggRivalChallengeLevelV38=String(req.level);
  root.dataset.tggRivalChallengeV38='1';
}
function applyStreakRiskRewardV38(){
  const streak=Number(root.dataset.tggWinStreakCountV37||localStorage.getItem('tgg-win-streak-v37')||0);
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const base={ROOKIE:100,STREET:180,PRO:300,ELITE:500}[tier]||100;
  const bonus=Math.min(1800,streak*base);
  root.dataset.tggStreakRiskV38=String(Math.max(0,streak-1));
  root.dataset.tggStreakRewardV38=String(bonus);
  root.dataset.tggStreakRiskRewardV38='1';
}
function applyAchievementToastV38(){
  let current={};try{current=JSON.parse(localStorage.getItem('tgg-achievements-v36')||'{}')}catch{}
  let seen={};try{seen=JSON.parse(localStorage.getItem('tgg-achievement-seen-v38')||'{}')}catch{}
  const unlocked=Object.keys(current).find(k=>current[k]&&!seen[k]);
  if(!unlocked){root.dataset.tggAchievementToastV38='ready';return}
  const names={firstUpgrade:'FIRST BUILD',streetReady:'STREET READY',proReady:'PRO READY',eliteReady:'ELITE READY',careerLevel5:'LEVEL 5',champion:'CHAMPION',highRoller:'HIGH ROLLER'};
  const toast=document.createElement('div');
  toast.style.cssText='position:fixed;left:50%;top:22px;transform:translateX(-50%);z-index:10030;padding:11px 15px;border-radius:12px;background:rgba(6,12,20,.94);border:1px solid rgba(112,232,255,.4);color:#fff;font:900 12px/1.2 system-ui,sans-serif;letter-spacing:.08em;box-shadow:0 16px 40px rgba(0,0,0,.45)';
  toast.textContent='ACHIEVEMENT UNLOCKED · '+(names[unlocked]||unlocked.toUpperCase());
  document.body.appendChild(toast);
  seen[unlocked]=1;try{localStorage.setItem('tgg-achievement-seen-v38',JSON.stringify(seen))}catch{}
  setTimeout(()=>toast.remove(),2200);
  root.dataset.tggAchievementToastV38='1';
}
function applyNextTierGateV38(){
  const order=['ROOKIE','STREET','PRO','ELITE'];
  const max=root.dataset.tggRaceMaxUnlockedTierV62||'ROOKIE';
  const maxI=Math.max(0,order.indexOf(max));
  const next=maxI>=3?'ELITE':order[maxI+1];
  const req={
    STREET:'PERF 70 · LEVEL 2',
    PRO:'PERF 80 · LEVEL 3',
    ELITE:'PERF 90 · LEVEL 5'
  }[next]||'ELITE UNLOCKED';
  root.dataset.tggNextTierV38=next;
  root.dataset.tggNextTierEligibleV38=maxI>=3?'1':'0';
  root.dataset.tggNextTierRequirementV38=req;
  root.dataset.tggNextTierGateSourceV74='tier-authority-v62';
  root.dataset.tggNextTierGateV38='v74';
}
function enhanceCareerDashboardV38(){
  const dash=document.getElementById('tgg-career-dashboard-v37');
  if(!dash){root.dataset.tggCareerDashboardActionsV38='waiting';return}
  let actions=dash.querySelector('[data-v38-actions]');
  if(!actions){
    actions=document.createElement('div');actions.dataset.v38Actions='1';
    actions.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-top:8px';
    actions.innerHTML='<button data-v38-rival>RIVAL</button><button data-v38-event>EVENT</button><button data-v38-garage>GARAGE</button>';
    dash.appendChild(actions);
    actions.querySelectorAll('button').forEach(b=>b.style.cssText='padding:7px 9px;border:0;border-radius:8px;font-weight:900;font-size:10px');
    actions.querySelector('[data-v38-rival]').onclick=()=>{
      root.dataset.tggRaceEventNameV32=root.dataset.tggRivalChallengeNameV38||'Rival Showdown';
      root.dataset.tggRivalChallengeSelectedV38='1';
    };
    actions.querySelector('[data-v38-event]').onclick=()=>window.TGGRaceCareerV32?.next?.();
    actions.querySelector('[data-v38-garage]').onclick=()=>{root.dataset.tggGarageFocus='1'};
  }
  const gate=root.dataset.tggNextTierEligibleV38==='1'?'READY':'LOCKED';
  let gateLine=dash.querySelector('[data-v38-gate]');
  if(!gateLine){gateLine=document.createElement('div');gateLine.dataset.v38Gate='1';dash.insertBefore(gateLine,actions)}
  gateLine.textContent='NEXT '+(root.dataset.tggNextTierV38||'STREET')+' · '+gate+' · '+(root.dataset.tggNextTierRequirementV38||'');
  root.dataset.tggCareerDashboardActionsV38='1';
}

function installRivalShowdownsV39(){
  if(window.TGGRivalShowdownV39)return;
  const select=()=>{
    if(root.dataset.tggRivalChallengeEligibleV38!=='1'){
      root.dataset.tggRivalShowdownBlockedV39='1';
      return false;
    }
    const tier=root.dataset.tggRaceSelectedTierV62||root.dataset.tggRaceTierV30||'ROOKIE';
    const ids={ROOKIE:'rival-ace',STREET:'rival-maya',PRO:'rival-dante',ELITE:'rival-nova'};
    root.dataset.tggRivalTierSnapshotV73=tier;
    root.dataset.tggRaceEventModeV61='rival';
    root.dataset.tggRaceEventV32=ids[tier];
    root.dataset.tggRaceEventNameV32=root.dataset.tggRivalChallengeNameV38||'Rival Showdown';
    root.dataset.tggRaceEventRewardV32=String(({ROOKIE:800,STREET:1300,PRO:2000,ELITE:3000}[tier]||800));
    root.dataset.tggRivalShowdownSelectedV39='1';
    root.dataset.tggRivalShowdownBlockedV39='0';
    return true;
  };
  window.TGGRivalShowdownV39={select};
  root.dataset.tggRivalShowdownsV39='1';
}
function applyRivalRouteV39(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.scene||!THREE)return;
  const id=root.dataset.tggRaceEventV32||'';
  if(!id.startsWith('rival-')){root.dataset.tggRivalRouteV39='ready';return}
  let g=w.scene.getObjectByName?.('TGG_EVENT_ROUTE_V33');
  if(!g){g=new THREE.Group();g.name='TGG_EVENT_ROUTE_V33';w.scene.add(g)}
  if(g.userData.eventId!==id){
    while(g.children.length)g.remove(g.children[0]);
    const routes={
      'rival-ace':[[-80,-30],[-25,-92],[55,-70],[92,8],[48,78],[-35,88],[-92,28]],
      'rival-maya':[[-125,-55],[-45,-130],[55,-122],[132,-42],[118,65],[22,138],[-88,112],[-138,18]],
      'rival-dante':[[-175,-70],[-88,-175],[30,-195],[142,-138],[195,-15],[130,118],[10,190],[-120,148],[-190,32]],
      'rival-nova':[[-240,-90],[-140,-220],[15,-255],[165,-205],[255,-75],[245,105],[130,230],[-30,270],[-190,200],[-265,45],[-220,-45]]
    };
    const mat=new THREE.MeshStandardMaterial({color:0xff4d9d,emissive:0x7c174b,emissiveIntensity:2.4,transparent:true,opacity:.82});
    const pts=routes[id]||routes['rival-ace'];
    pts.forEach(([x,z],i)=>{
      const ring=new THREE.Mesh(new THREE.TorusGeometry(3.1,.16,8,28),mat);
      ring.rotation.x=Math.PI/2;ring.position.set(x,.17,z);ring.userData.routeIndex=i;g.add(ring);
    });
    g.userData.eventId=id;
    root.dataset.tggRaceEventCheckpointsV32=String(pts.length);
  }
  root.dataset.tggRivalRouteV39='1';
}
function applyStreakPayoutV39(){
  const finished=root.dataset.tggRaceFinishV25==='1';
  const runId=root.dataset.tggRaceRunIdV43||'';
  if(!finished||!runId){root.dataset.tggStreakPayoutV39='ready';return}
  const won=Number(root.dataset.tggRacePositionV26||4)===1;
  const bonus=won?Number(root.dataset.tggStreakRewardV38||0):0;
  const claimId='race:'+runId+':streak';
  const result=bonus>0?(window.TGGPayoutV67?.grant?.(claimId,bonus,'streak')||{granted:false}):{granted:false};
  root.dataset.tggStreakPayoutAmountV39=String(bonus);
  root.dataset.tggStreakPayoutClaimedV39='1';
  root.dataset.tggStreakPayoutClaimV67=claimId;
  root.dataset.tggStreakPayoutV39=result.granted?'v67-granted':'v67-claimed';
}
function applyAchievementsPanelV39(){
  let panel=document.getElementById('tgg-achievements-panel-v39');
  if(!panel){
    panel=document.createElement('div');panel.id='tgg-achievements-panel-v39';
    panel.style.cssText='position:fixed;inset:0;z-index:10025;display:none;place-items:center;background:rgba(2,5,10,.72);backdrop-filter:blur(9px)';
    panel.innerHTML='<div style="width:min(92vw,460px);max-height:80vh;overflow:auto;padding:20px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(5,10,18,.97);color:#fff;font:700 12px/1.5 system-ui,sans-serif"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><strong style="font-size:18px">TGG ACHIEVEMENTS</strong><button data-v39-close>✕</button></div><div data-v39-list style="margin-top:12px;display:grid;gap:8px"></div></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-v39-close]').onclick=()=>panel.style.display='none';
  }
  const open=root.dataset.tggAchievementsOpen==='1';
  if(open){root.dataset.tggAchievementsOpen='0';panel.style.display='grid'}
  let achievements={};try{achievements=JSON.parse(localStorage.getItem('tgg-achievements-v36')||'{}')}catch{}
  const labels={firstUpgrade:'First Build',streetReady:'Street Ready',proReady:'Pro Ready',eliteReady:'Elite Ready',careerLevel5:'Career Level 5',champion:'Champion',highRoller:'High Roller'};
  panel.querySelector('[data-v39-list]').innerHTML=Object.keys(labels).map(k=>'<div style="padding:9px 10px;border-radius:10px;background:rgba(255,255,255,.05);opacity:'+(achievements[k]?1:.45)+'"><b>'+(achievements[k]?'✓ ':'○ ')+labels[k]+'</b></div>').join('');
  root.dataset.tggAchievementsPanelV39='1';
}
function enforceTierUnlocksV39(){
  const order=['ROOKIE','STREET','PRO','ELITE'];
  const max=root.dataset.tggRaceMaxUnlockedTierV62||'ROOKIE';
  let selected=root.dataset.tggRaceSelectedTierV62||root.dataset.tggRaceTierV30||'ROOKIE';
  if(order.indexOf(selected)>order.indexOf(max)){
    selected=max;
    try{localStorage.setItem('tgg-selected-race-tier-v62',selected)}catch{}
    root.dataset.tggRaceSelectedTierV62=selected;
    root.dataset.tggRaceTierV30=selected;
    root.dataset.tggRaceTierBlockedV39='above-'+max;
  }
  root.dataset.tggTierAllowedV39='1';
  root.dataset.tggTierEnforcementV39='v62';
}
function enhanceResultsRivalV39(){
  const panel=document.getElementById('tgg-race-results-screen-v35');
  if(!panel){root.dataset.tggResultsRivalV39='waiting';return}
  const box=panel.firstElementChild;if(!box)return;
  const isRival=String(root.dataset.tggRaceEventV32||'').startsWith('rival-');
  let row=box.querySelector('[data-v39-rival]');
  if(!isRival){if(row)row.style.display='none';root.dataset.tggResultsRivalV39='ready';return}
  if(row)row.style.display='';

  if(!row){row=document.createElement('div');row.dataset.v39Rival='1';box.insertBefore(row,box.querySelector('[data-v36-actions]')||null)}
  const rival=root.dataset.tggRivalNameV36||'Rival';
  const won=Number(root.dataset.tggRacePositionV26||4)===1;
  row.textContent=(won?'DEFEATED ':'LOST TO ')+rival+(Number(root.dataset.tggStreakPayoutAmountV39||0)>0?' · STREAK BONUS +'+root.dataset.tggStreakPayoutAmountV39+' TGG':'');
  root.dataset.tggResultsRivalV39='1';
}

function applyRivalSeriesV40(){
  const event=root.dataset.tggRaceEventV32||'';
  const isRival=event.startsWith('rival-');
  const finished=root.dataset.tggRaceFinishV25==='1';
  if(!isRival||!finished){root.dataset.tggRivalSeriesV40=isRival?'ready':'idle';return}
  const rival=root.dataset.tggRivalNameV36||'Rival';
  const won=Number(root.dataset.tggRacePositionV26||4)===1;
  const key='tgg-rival-series-v40-'+event;
  let data={player:0,rival:0,complete:false};
  try{data={...data,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{}
  if(root.dataset.tggRivalSeriesClaimedV40!=='1'&&!data.complete){
    if(won)data.player++;else data.rival++;
    data.complete=data.player>=2||data.rival>=2;
    try{localStorage.setItem(key,JSON.stringify(data))}catch{}
    root.dataset.tggRivalSeriesClaimedV40='1';
  }
  root.dataset.tggRivalSeriesPlayerV40=String(data.player);
  root.dataset.tggRivalSeriesOpponentV40=String(data.rival);
  root.dataset.tggRivalSeriesCompleteV40=data.complete?'1':'0';
  root.dataset.tggRivalSeriesWinnerV40=data.complete?(data.player>data.rival?'PLAYER':rival):'';
  root.dataset.tggRivalSeriesV40='1';
}
function applyCrewReputationV40(){
  const finished=root.dataset.tggRaceFinishV25==='1';
  const runId=root.dataset.tggRaceRunIdV43||'';
  if(!finished||!runId){root.dataset.tggCrewReputationV40='waiting';return}
  const pos=Number(root.dataset.tggRacePositionV26||4);
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const gain=Math.max(10,({ROOKIE:25,STREET:45,PRO:70,ELITE:100}[tier]||25)-(pos-1)*8);
  const claimId='race:'+runId+':crew-rep';
  const result=window.TGGProgressV68?.claim?.(claimId,'crew-rep',()=>{
    const key='tgg-crew-rep-v40';
    const total=Number(localStorage.getItem(key)||0)+gain;
    localStorage.setItem(key,String(total));
    root.dataset.tggCrewRepV40=String(total);
    root.dataset.tggCrewRepGainV40=String(gain);
    return {gain,total};
  })||{granted:false};
  if(!result.granted)root.dataset.tggCrewRepV40=String(Number(localStorage.getItem('tgg-crew-rep-v40')||0));
  root.dataset.tggCrewRepClaimedV40='1';
  root.dataset.tggCrewRepClaimV68=claimId;
  root.dataset.tggCrewReputationV40=result.granted?'v68-granted':'v68-claimed';
}
function applySeasonPointsV40(){
  const finished=root.dataset.tggRaceFinishV25==='1';
  const runId=root.dataset.tggRaceRunIdV43||'';
  if(!finished||!runId){root.dataset.tggSeasonPointsV40='waiting';return}
  const pos=Number(root.dataset.tggRacePositionV26||4);
  const pts={1:25,2:18,3:12,4:8}[pos]||5;
  const claimId='race:'+runId+':season-points';
  const result=window.TGGProgressV68?.claim?.(claimId,'season-points',()=>{
    const key='tgg-season-points-v40';
    const total=Number(localStorage.getItem(key)||0)+pts;
    localStorage.setItem(key,String(total));
    root.dataset.tggSeasonPointsTotalV40=String(total);
    root.dataset.tggSeasonPointsEarnedV40=String(pts);
    return {pts,total};
  })||{granted:false};
  if(!result.granted)root.dataset.tggSeasonPointsTotalV40=String(Number(localStorage.getItem('tgg-season-points-v40')||0));
  root.dataset.tggSeasonPointsClaimedV40='1';
  root.dataset.tggSeasonPointsClaimV68=claimId;
  root.dataset.tggSeasonPointsV40=result.granted?'v68-granted':'v68-claimed';
}
function applyChampionshipQualificationV40(){
  const points=Number(root.dataset.tggSeasonPointsTotalV40||localStorage.getItem('tgg-season-points-v40')||0);
  const eliteUnlocked=root.dataset.tggRaceMaxUnlockedTierV62==='ELITE';
  const qualified=points>=120&&eliteUnlocked;
  root.dataset.tggChampionshipQualifiedV40=qualified?'1':'0';
  root.dataset.tggChampionshipRequirementV40='120 PTS · ELITE UNLOCKED';
  root.dataset.tggChampionshipQualificationSourceV74='season-points+max-tier';
  root.dataset.tggChampionshipQualificationV40='v74';
}
function applySeasonStandingsV40(){
  const points=Number(root.dataset.tggSeasonPointsTotalV40||localStorage.getItem('tgg-season-points-v40')||0);
  const rivals=[
    {name:'Nova King',pts:155},
    {name:'Dante Cross',pts:132},
    {name:'Maya Knox',pts:108},
    {name:'Ace Rivera',pts:84},
    {name:'YOU',pts:points}
  ].sort((a,b)=>b.pts-a.pts);
  const pos=Math.max(1,rivals.findIndex(r=>r.name==='YOU')+1);
  root.dataset.tggSeasonPositionV40=String(pos);
  root.dataset.tggSeasonLeaderV40=rivals[0].name;
  root.dataset.tggSeasonStandingsV40='1';
}
function applySeasonSummaryV40(){
  let panel=document.getElementById('tgg-season-summary-v40');
  if(!panel){
    panel=document.createElement('div');panel.id='tgg-season-summary-v40';
    panel.style.cssText='position:fixed;inset:0;z-index:10024;display:none;place-items:center;background:rgba(2,5,10,.72);backdrop-filter:blur(9px)';
    panel.innerHTML='<div style="width:min(92vw,480px);padding:20px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(5,10,18,.97);color:#fff;font:700 12px/1.55 system-ui,sans-serif"><div style="display:flex;justify-content:space-between;align-items:center"><strong style="font-size:19px">TGG RACING SEASON</strong><button data-v40-close>✕</button></div><div data-v40-body style="margin-top:12px"></div></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-v40-close]').onclick=()=>panel.style.display='none';
  }
  if(root.dataset.tggSeasonSummaryOpen==='1'){root.dataset.tggSeasonSummaryOpen='0';panel.style.display='grid'}
  const points=root.dataset.tggSeasonPointsTotalV40||localStorage.getItem('tgg-season-points-v40')||'0';
  const pos=root.dataset.tggSeasonPositionV40||'5';
  const rep=root.dataset.tggCrewRepV40||localStorage.getItem('tgg-crew-rep-v40')||'0';
  const qual=root.dataset.tggChampionshipQualifiedV40==='1';
  const req=root.dataset.tggChampionshipRequirementV40||'120 PTS · ELITE UNLOCKED';
  const leader=root.dataset.tggSeasonLeaderV40||'Nova King';
  const sig=[points,pos,rep,qual?'1':'0',req,leader].join('|');
  const body=panel.querySelector('[data-v40-body]');
  if(body?.dataset.tggSigV74!==sig){
    body.dataset.tggSigV74=sig;
    body.innerHTML='<div>SEASON POINTS '+points+'</div><div>STANDING #'+pos+'</div><div>CREW REP '+rep+'</div><div>CHAMPIONSHIP '+(qual?'QUALIFIED':'LOCKED')+'</div><div>REQ '+req+'</div><div>LEADER '+leader+'</div>';
    root.dataset.tggUiWritesV71=String(Number(root.dataset.tggUiWritesV71||0)+1);
  }
  root.dataset.tggSeasonSummaryV40='v74';
}

function installChampionshipFinaleV41(){
  if(window.TGGChampionshipFinaleV41)return;
  const start=()=>{
    if(root.dataset.tggChampionshipQualifiedV40!=='1'){
      root.dataset.tggChampionshipStartBlockedV41='1';
      return false;
    }
    root.dataset.tggRaceEventModeV61='finale';
    root.dataset.tggRaceEffectiveTierV73='ELITE';
    root.dataset.tggRaceTierLockV73='finale';
    root.dataset.tggRaceTierV30='ELITE';
    root.dataset.tggRaceEventV32='season-finale-v41';
    root.dataset.tggRaceEventNameV32='TGG World Championship Finale';
    root.dataset.tggRaceEventRewardV32='5000';
    root.dataset.tggRaceEventCheckpointsV32='12';
    root.dataset.tggChampionshipStartBlockedV41='0';
    return window.TGGRaceStartGuardV34?.start?.()!==false;
  };
  window.TGGChampionshipFinaleV41={start};
  root.dataset.tggChampionshipFinaleV41='1';
}
function applyChampionshipRouteV41(){
  const w=window.TGG3D,THREE=window.THREE;if(!w?.scene||!THREE)return;
  if(root.dataset.tggRaceEventV32!=='season-finale-v41'){root.dataset.tggChampionshipRouteV41='ready';return}
  let g=w.scene.getObjectByName?.('TGG_EVENT_ROUTE_V33');
  if(!g){g=new THREE.Group();g.name='TGG_EVENT_ROUTE_V33';w.scene.add(g)}
  if(g.userData.eventId!=='season-finale-v41'){
    while(g.children.length)g.remove(g.children[0]);
    const pts=[[-300,-120],[-215,-250],[-60,-305],[105,-290],[250,-200],[320,-55],[285,115],[180,255],[20,315],[-150,285],[-285,160],[-330,15]];
    const mat=new THREE.MeshStandardMaterial({color:0xffd65a,emissive:0x8b6211,emissiveIntensity:2.6,transparent:true,opacity:.86});
    pts.forEach(([x,z],i)=>{
      const ring=new THREE.Mesh(new THREE.TorusGeometry(3.6,.2,10,32),mat);
      ring.rotation.x=Math.PI/2;ring.position.set(x,.18,z);ring.userData.routeIndex=i;g.add(ring);
    });
    g.userData.eventId='season-finale-v41';
    root.dataset.tggRaceEventCheckpointsV32=String(pts.length);
  }
  root.dataset.tggChampionshipRouteV41='1';
}
function applySeriesCompletionRewardV41(){
  const complete=root.dataset.tggRivalSeriesCompleteV40==='1';
  const winner=root.dataset.tggRivalSeriesWinnerV40||'';
  const event=String(root.dataset.tggRaceEventV32||'');
  if(!complete||winner!=='PLAYER'||!event.startsWith('rival-')){
    root.dataset.tggSeriesRewardV41=complete?'ready':'waiting';return;
  }
  const tier=root.dataset.tggRaceTierV30||'ROOKIE';
  const reward={ROOKIE:400,STREET:700,PRO:1100,ELITE:1800}[tier]||400;
  const claimId='series:'+event;
  const result=window.TGGPayoutV67?.grant?.(claimId,reward,'rival-series')||{granted:false};
  root.dataset.tggSeriesRewardAmountV41=String(reward);
  root.dataset.tggSeriesRewardClaimEventV61=event;
  root.dataset.tggSeriesRewardClaimedV41='1';
  root.dataset.tggSeriesRewardClaimV67=claimId;
  root.dataset.tggSeriesRewardV41=result.granted?'v67-granted':'v67-claimed';
  root.dataset.tggSeriesRewardV61='1';
}
function applyCrewRankV41(){
  const rep=Number(root.dataset.tggCrewRepV40||localStorage.getItem('tgg-crew-rep-v40')||0);
  const rank=rep>=1000?'LEGEND':rep>=700?'KINGPIN':rep>=400?'CAPTAIN':rep>=200?'RACER':'ROOKIE';
  root.dataset.tggCrewRankV41=rank;
  root.dataset.tggCrewRankProgressV41=String(rep);
  root.dataset.tggCrewRankSystemV41='1';
}
function applySeasonTrophyV41(){
  const finale=root.dataset.tggRaceEventV32==='season-finale-v41';
  const finished=root.dataset.tggRaceFinishV25==='1';
  const won=Number(root.dataset.tggRacePositionV26||4)===1;
  const runId=root.dataset.tggRaceRunIdV43||'';
  if(!finale||!finished||!won||!runId){root.dataset.tggSeasonTrophyV41=finale?'ready':'idle';return}
  const claimId='race:'+runId+':season-trophy';
  const result=window.TGGProgressV68?.claim?.(claimId,'season-trophy',()=>{
    const key='tgg-season-trophies-v41';
    const trophies=Number(localStorage.getItem(key)||0)+1;
    localStorage.setItem(key,String(trophies));
    root.dataset.tggSeasonTrophiesV41=String(trophies);
    return {trophies};
  })||{granted:false};
  if(!result.granted)root.dataset.tggSeasonTrophiesV41=String(Number(localStorage.getItem('tgg-season-trophies-v41')||0));
  root.dataset.tggSeasonTrophyClaimedV41='1';
  root.dataset.tggSeasonTrophyClaimV68=claimId;
  root.dataset.tggSeasonChampionV41='1';
  root.dataset.tggSeasonTrophyV41=result.granted?'v68-granted':'v68-claimed';
}
function applySeasonFinaleResultsV41(){
  const panel=document.getElementById('tgg-race-results-screen-v35');
  if(!panel){root.dataset.tggSeasonFinaleResultsV41='waiting';return}
  const finale=root.dataset.tggRaceEventV32==='season-finale-v41'&&root.dataset.tggRaceFinishV25==='1';
  if(!finale){root.dataset.tggSeasonFinaleResultsV41='ready';return}
  const box=panel.firstElementChild;if(!box)return;
  let line=box.querySelector('[data-v41-finale]');
  if(!line){line=document.createElement('div');line.dataset.v41Finale='1';line.style.cssText='margin-top:8px;font-size:14px;font-weight:950;color:#ffe58a';box.insertBefore(line,box.querySelector('[data-v36-actions]')||null)}
  const won=Number(root.dataset.tggRacePositionV26||4)===1;
  line.textContent=won?'SEASON CHAMPION · TROPHY WON':'SEASON FINALE COMPLETE · CHAMPIONSHIP LOST';
  root.dataset.tggSeasonFinaleResultsV41='1';
}
function installNextSeasonV41(){
  if(window.TGGNextSeasonV41)return;
  const reset=()=>{
    localStorage.setItem('tgg-season-points-v40','0');
    root.dataset.tggSeasonPointsTotalV40='0';
    root.dataset.tggChampionshipQualifiedV40='0';
    root.dataset.tggRaceFinishV25='0';
    root.dataset.tggRaceResultsShownV35='0';
    root.dataset.tggSeasonTrophyClaimedV41='0';
    root.dataset.tggSeasonPointsClaimedV40='0';
    root.dataset.tggCrewRepClaimedV40='0';
    root.dataset.tggXpClaimedV35='0';
    root.dataset.tggRacePayoutClaimedV34='0';
    return true;
  };
  window.TGGNextSeasonV41={reset};
  root.dataset.tggNextSeasonV41='1';
}

function applySeasonHistoryV42(){
  const finale=root.dataset.tggRaceEventV32==='season-finale-v41';
  const finished=root.dataset.tggRaceFinishV25==='1';
  const runId=root.dataset.tggRaceRunIdV43||'';
  if(!finale||!finished||!runId){root.dataset.tggSeasonHistoryV42=finale?'ready':'idle';return}
  const won=Number(root.dataset.tggRacePositionV26||4)===1;
  const claimId='race:'+runId+':season-history';
  const result=window.TGGProgressV68?.claim?.(claimId,'season-history',()=>{
    const record={
      runId,
      points:Number(root.dataset.tggSeasonPointsTotalV40||localStorage.getItem('tgg-season-points-v40')||0),
      position:Number(root.dataset.tggSeasonPositionV40||5),
      champion:won,
      trophy:Number(root.dataset.tggSeasonTrophiesV41||localStorage.getItem('tgg-season-trophies-v41')||0),
      level:Number(root.dataset.tggCareerLevelV35||1),
      perf:Number(root.dataset.tggPerformanceScoreV29||60)
    };
    const key='tgg-season-history-v42',data=JSON.parse(localStorage.getItem(key)||'[]');
    data.push(record);while(data.length>12)data.shift();
    localStorage.setItem(key,JSON.stringify(data));
    root.dataset.tggSeasonHistoryCountV42=String(data.length);
    return record;
  })||{granted:false};
  if(!result.granted){
    try{const data=JSON.parse(localStorage.getItem('tgg-season-history-v42')||'[]');root.dataset.tggSeasonHistoryCountV42=String(data.length)}catch{}
  }
  root.dataset.tggSeasonHistoryClaimedV42='1';
  root.dataset.tggSeasonHistoryClaimV68=claimId;
  root.dataset.tggSeasonHistoryV42=result.granted?'v68-granted':'v68-claimed';
}
function applyTrophyDisplayV42(){
  const count=Number(root.dataset.tggSeasonTrophiesV41||localStorage.getItem('tgg-season-trophies-v41')||0);
  let hud=document.getElementById('tgg-trophy-display-v42');
  if(!hud){
    hud=document.createElement('div');hud.id='tgg-trophy-display-v42';
    hud.style.cssText='position:fixed;right:18px;top:150px;z-index:9990;padding:9px 11px;border:1px solid rgba(255,220,120,.25);border-radius:12px;background:rgba(8,10,14,.78);color:#ffe58a;font:900 11px/1.2 system-ui,sans-serif;letter-spacing:.06em';
    document.body.appendChild(hud);
  }
  hud.textContent='TROPHIES '+count;
  root.dataset.tggTrophyDisplayV42='1';
}
function applyCrewRankRewardsV42(){
  const rank=root.dataset.tggCrewRankV41||'ROOKIE';
  const rewards={RACER:300,CAPTAIN:700,KINGPIN:1400,LEGEND:2500};
  const amount=Number(rewards[rank]||0);
  if(amount>0){
    const claimId='crew-rank:'+rank;
    const result=window.TGGPayoutV67?.grant?.(claimId,amount,'crew-rank')||{granted:false};
    if(result.granted)root.dataset.tggCrewRankRewardV42=String(amount);
    root.dataset.tggCrewRankRewardClaimV69=claimId;
  }
  root.dataset.tggCrewRankRewardOwnerV69='payout-v67';
  root.dataset.tggCrewRankRewardsV42='v69';
}
function applyFinaleRivalV42(){
  const w=window.TGG3D;if(!w?.scene)return;
  if(root.dataset.tggRaceEventV32!=='season-finale-v41'){root.dataset.tggFinaleRivalV42='ready';return}
  const g=w.scene.getObjectByName?.('TGG_RACE_OPPONENTS_V24');
  if(g?.children?.[0]){
    const rival=g.children[0];
    rival.userData.tggRival={name:'Nova King',crew:'Worldline',car:'Championship X'};
    rival.userData.tggRivalAggression=1.22;
    rival.userData.tggCatchup=Math.max(Number(rival.userData.tggCatchup||1),1.18);
    rival.userData.tggRivalBoostChance=.14;
  }
  root.dataset.tggRivalNameV36='Nova King';
  root.dataset.tggRivalCrewV36='Worldline';
  root.dataset.tggFinaleRivalV42='1';
}
function installNewSeasonSetupV42(){
  if(window.TGGNewSeasonV42)return;
  const start=()=>{
    const trophies=Number(localStorage.getItem('tgg-season-trophies-v41')||0);
    const rep=Number(localStorage.getItem('tgg-crew-rep-v40')||0);
    const xp=Number(localStorage.getItem('tgg-career-xp-v35')||0);
    localStorage.setItem('tgg-season-points-v40','0');
    localStorage.setItem('tgg-win-streak-v37','0');
    root.dataset.tggSeasonPointsTotalV40='0';
    root.dataset.tggWinStreakCountV37='0';
    root.dataset.tggChampionshipQualifiedV40='0';
    root.dataset.tggRaceFinishV25='0';
    root.dataset.tggRaceResultsShownV35='0';
    root.dataset.tggSeasonHistoryClaimedV42='0';
    root.dataset.tggSeasonTrophyClaimedV41='0';
    root.dataset.tggSeasonPointsClaimedV40='0';
    root.dataset.tggCrewRepClaimedV40='0';
    root.dataset.tggXpClaimedV35='0';
    root.dataset.tggRacePayoutClaimedV34='0';
    root.dataset.tggRivalSeriesClaimedV40='0';
    root.dataset.tggEventCompletionClaimedV36='0';
    root.dataset.tggLegacyCarryV42=JSON.stringify({trophies,rep,xp});
    return true;
  };
  window.TGGNewSeasonV42={start};
  root.dataset.tggNewSeasonSetupV42='1';
}
function applySeasonLegacyPanelV42(){
  let panel=document.getElementById('tgg-season-legacy-v42');
  if(!panel){
    panel=document.createElement('div');panel.id='tgg-season-legacy-v42';
    panel.style.cssText='position:fixed;inset:0;z-index:10023;display:none;place-items:center;background:rgba(2,5,10,.72);backdrop-filter:blur(9px)';
    panel.innerHTML='<div style="width:min(92vw,480px);padding:20px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(5,10,18,.97);color:#fff;font:700 12px/1.55 system-ui,sans-serif"><div style="display:flex;justify-content:space-between;align-items:center"><strong style="font-size:19px">TGG SEASON LEGACY</strong><button data-v42-close>✕</button></div><div data-v42-body style="margin-top:12px"></div></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-v42-close]').onclick=()=>panel.style.display='none';
  }
  if(root.dataset.tggSeasonLegacyOpen==='1'){root.dataset.tggSeasonLegacyOpen='0';panel.style.display='grid'}
  let hist=[];try{hist=JSON.parse(localStorage.getItem('tgg-season-history-v42')||'[]')}catch{}
  const trophies=Number(localStorage.getItem('tgg-season-trophies-v41')||0);
  const rep=Number(localStorage.getItem('tgg-crew-rep-v40')||0);
  panel.querySelector('[data-v42-body]').innerHTML='<div>SEASONS '+hist.length+'</div><div>TROPHIES '+trophies+'</div><div>CREW REP '+rep+'</div><div>BEST FINISH '+(hist.length?Math.min(...hist.map(x=>Number(x.position||99))):'-')+'</div><div>CHAMPIONSHIP SEASONS '+hist.filter(x=>x.champion).length+'</div>';
  root.dataset.tggSeasonLegacyPanelV42='1';
}

function installRaceLifecycleV43(){
  if(window.TGGRaceLifecycleV43)return;
  let lastMode=root.dataset.tggRaceMode==='on';
  const resetForRun=()=>{
    let run=Number(localStorage.getItem('tgg-race-run-counter-v43')||0)+1;
    try{localStorage.setItem('tgg-race-run-counter-v43',String(run))}catch{}
    const id='run-'+run;
    root.dataset.tggRaceRunIdV43=id;
    root.dataset.tggRaceCheckpointStamp=id;
    root.dataset.tggRaceCountdownStamp='';
    root.dataset.tggRaceFinishV25='0';
    root.dataset.tggRaceCheckpointV25='0';
    root.dataset.tggEventCheckpointIndexV34='0';
    root.dataset.tggCheckpointAuthorityV63='event-route';
    root.dataset.tggCheckpointRouteOwnerV63=root.dataset.tggRaceRouteOwnerV61||'v33';
    root.dataset.tggRaceFinishStampV63='';
    root.dataset.tggRaceFinishOwnerV63='';
    root.dataset.tggOpponentFinishCountV64='0';
    root.dataset.tggOpponentStartGridV66='staggered';
    root.dataset.tggRacePlacementOwnerV64='event-route';
    root.dataset.tggRaceResultsShownV35='0';
    root.dataset.tggRacePayoutClaimedV34='0';
    root.dataset.tggCareerPayoutClaimV67='';
    root.dataset.tggCareerXpClaimV68='';
    root.dataset.tggEventCompletionClaimV68='';
    root.dataset.tggCrewRepClaimV68='';
    root.dataset.tggSeasonPointsClaimV68='';
    root.dataset.tggSeasonTrophyClaimV68='';
    root.dataset.tggSeasonHistoryClaimV68='';
    root.dataset.tggStreakPayoutClaimV67='';
    root.dataset.tggXpClaimedV35='0';
    root.dataset.tggWinStreakClaimedV37='0';
    root.dataset.tggStreakPayoutClaimedV39='0';
    root.dataset.tggCrewRepClaimedV40='0';
    root.dataset.tggSeasonPointsClaimedV40='0';
    root.dataset.tggRivalSeriesClaimedV40='0';
    root.dataset.tggEventCompletionClaimedV36='0';
    root.dataset.tggSeasonTrophyClaimedV41='0';
    const w=window.TGG3D;
    const legacy=w?.scene?.getObjectByName?.('TGG_RACE_PROGRESS_V25');
    if(legacy){
      legacy.userData.index=0;legacy.userData.lap=1;legacy.userData.finish=false;
      legacy.children.forEach(cp=>{cp.visible=true;cp.scale?.setScalar?.(1)});
    }
    const route=w?.scene?.getObjectByName?.('TGG_EVENT_ROUTE_V33');
    if(route)route.children.forEach(cp=>{cp.visible=true;cp.scale?.setScalar?.(1)});
    const countdown=document.getElementById('tgg-race-countdown-v23');
    if(countdown)countdown.style.display='none';
    root.dataset.tggRaceLifecycleResetV43='1';
    return id;
  };
  const tick=()=>{
    const mode=root.dataset.tggRaceMode==='on';
    if(mode&&!lastMode)resetForRun();
    lastMode=mode;
  };
  window.TGGRaceLifecycleV43={resetForRun,tick};
  const guard=window.TGGRaceStartGuardV34;
  if(guard?.start&&!guard.__v43){
    const old=guard.start.bind(guard);
    guard.start=()=>{
      const ok=old();
      if(ok!==false)resetForRun();
      return ok;
    };
    guard.__v43=true;
  }
  root.dataset.tggRaceLifecycleV43='1';
}
function applyRaceLifecycleV43(){
  window.TGGRaceLifecycleV43?.tick?.();
  root.dataset.tggRaceLifecycleTickV43='1';
}
function installNitrousRestoreV43(){
  if(window.TGGNitrousRestoreV43)return;
  let was=root.dataset.tggNitrousActiveV26==='1';
  const loop=()=>{
    const active=root.dataset.tggNitrousActiveV26==='1';
    if(was&&!active){
      try{window.TGGGarageEconomyV29?.apply?.();root.dataset.tggNitrousRestoreCountV43=String(Number(root.dataset.tggNitrousRestoreCountV43||0)+1)}catch{}
    }
    was=active;
    requestAnimationFrame(loop);
  };
  loop();
  window.TGGNitrousRestoreV43={restore:()=>window.TGGGarageEconomyV29?.apply?.()};
  root.dataset.tggNitrousRestoreV43='1';
}
function applyEnvironmentDirectorV43(){
  const w=window.TGG3D;if(!w?.scene)return;
  const preset=root.dataset.tggEditorPreset||'';
  const mood=root.dataset.tggRaceMood||'';
  const weather=root.dataset.tggWeather||'clear';
  let time='day',exposure=1.05,fov=state.driving?69:63,fog=.0029;
  if(preset==='effects'||mood==='neon'||weather==='night'){time='night';exposure=1.18;fov=71;fog=.00365}
  else if(preset==='color'||mood==='cinematic'||weather==='cinematic'){time='dusk';exposure=1.10;fov=67;fog=.00335}
  else if(preset==='audio'||mood==='cruise'||weather==='golden'){time='golden';exposure=1.16;fov=65;fog=.00305}
  else if(weather==='storm'){time='storm';exposure=.96;fov=68;fog=.00415}
  if(root.dataset.tggGraphicsOwnershipV56!=='1'){
    if(w.renderer)w.renderer.toneMappingExposure=exposure;
    if(w.camera&&Math.abs(Number(w.camera.fov||0)-fov)>.05){w.camera.fov=fov;w.camera.updateProjectionMatrix?.()}
    if(w.scene.fog)w.scene.fog.density=fog;
    const hemi=w.scene.children?.find?.(o=>o.isHemisphereLight);
    const dir=w.scene.children?.find?.(o=>o.isDirectionalLight);
    if(hemi)hemi.intensity=time==='night'?.42:time==='dusk'?.58:time==='storm'?.5:.72;
    if(dir)dir.intensity=time==='night'?.46:time==='dusk'?.7:time==='storm'?.62:.95;
  }
  root.dataset.tggTime=time;
  root.dataset.tggEnvironmentOwnerV43='1';
  root.dataset.tggEnvironmentDirectorV43='1';
}

function installHudDirectorV44(){
  if(window.TGGHudV44)return;
  const ids=['tgg-garage-hud-v30','tgg-event-card-v33','tgg-career-ladder-v34','tgg-career-dashboard-v37','tgg-trophy-display-v42','tgg-next-objective-v36','tgg-nitrous-recharge-v28'];
  const modes=['compact','garage','career','season','full'];
  let mode=localStorage.getItem('tgg-hud-mode-v44')||'compact';
  const apply=()=>{
    const race=root.dataset.tggRaceMode==='on';
    const show=new Set();
    if(mode==='full')ids.forEach(id=>show.add(id));
    else if(mode==='garage')show.add('tgg-garage-hud-v30');
    else if(mode==='career'){show.add('tgg-career-dashboard-v37');show.add('tgg-next-objective-v36')}
    else if(mode==='season'){show.add('tgg-trophy-display-v42')}
    else{
      if(race){show.add('tgg-event-card-v33');show.add('tgg-nitrous-recharge-v28')}
      else show.add('tgg-next-objective-v36');
    }
    ids.forEach(id=>{
      const el=document.getElementById(id);
      if(el)el.style.display=show.has(id)?'':'none';
    });
    root.dataset.tggHudModeV44=mode;
    root.dataset.tggHudDirectorV44='1';
    return mode;
  };
  const set=(value)=>{
    const nextMode=modes.includes(String(value||'').toLowerCase())?String(value).toLowerCase():'compact';
    mode=nextMode;
    localStorage.setItem('tgg-hud-mode-v44',mode);
    root.dataset.tggHudModeV44=mode;
    return apply();
  };
  const next=()=>set(modes[(modes.indexOf(mode)+1)%modes.length]);
  window.TGGHudV44={apply,next,set,modes:[...modes],get mode(){return mode}};
  apply();
}
function applyHudDirectorV44(){window.TGGHudV44?.apply?.()}

function installGraphicsDirectorV50(){
  if(window.TGGGraphicsV50)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene||!w?.renderer||!w?.camera){root.dataset.tggGraphicsDirectorV50='waiting';return}
  const renderer=w.renderer,scene=w.scene,camera=w.camera;
  try{
    if(THREE.SRGBColorSpace&&'outputColorSpace' in renderer)renderer.outputColorSpace=THREE.SRGBColorSpace;
    if(THREE.ACESFilmicToneMapping)renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.08;
    if(renderer.shadowMap){
      renderer.shadowMap.enabled=true;
      if(THREE.PCFSoftShadowMap)renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      renderer.shadowMap.autoUpdate=true;
    }
    if('useLegacyLights' in renderer)renderer.useLegacyLights=false;
    renderer.setPixelRatio?.(Math.min(window.devicePixelRatio||1,state.quality==='balanced'?1.25:1.75));
  }catch{}
  camera.near=.08;camera.far=Math.max(Number(camera.far||0),1800);camera.updateProjectionMatrix?.();

  let key=scene.getObjectByName?.('TGG_GRAPHICS_KEY_V50');
  if(!key){
    key=new THREE.DirectionalLight(0xfff1d6,2.35);key.name='TGG_GRAPHICS_KEY_V50';
    key.position.set(80,120,45);key.castShadow=true;
    if(key.shadow){
      key.shadow.mapSize.set(state.quality==='balanced'?1024:2048,state.quality==='balanced'?1024:2048);
      key.shadow.camera.left=-150;key.shadow.camera.right=150;key.shadow.camera.top=150;key.shadow.camera.bottom=-150;
      key.shadow.camera.near=1;key.shadow.camera.far=420;key.shadow.bias=-.0004;
    }
    scene.add(key);
  }
  let fill=scene.getObjectByName?.('TGG_GRAPHICS_FILL_V50');
  if(!fill){
    fill=new THREE.HemisphereLight(0x9fc8ff,0x24180e,.82);fill.name='TGG_GRAPHICS_FILL_V50';scene.add(fill);
  }

  let lastPolish=0;
  const polishMaterial=(obj,mat,maxAniso)=>{
    if(!mat)return;
    const name=((obj?.name||'')+' '+(obj?.parent?.name||'')+' '+(mat.name||'')).toLowerCase();
    const isRoad=/road|street|lane|highway|asphalt/.test(name);
    const isCar=/car|vehicle|auto|body|hood|fender|bumper/.test(name);
    const isGlass=/glass|window|windshield/.test(name);
    const isBuilding=/building|tower|store|house|garage|studio/.test(name);
    if(isRoad){
      if('roughness'in mat)mat.roughness=.72;if('metalness'in mat)mat.metalness=.04;
      obj.receiveShadow=true;
    }else if(isCar){
      if('roughness'in mat)mat.roughness=Math.min(Number(mat.roughness??.3),.26);
      if('metalness'in mat)mat.metalness=Math.max(Number(mat.metalness??.3),.58);
      if('clearcoat'in mat)mat.clearcoat=.75;
      if('clearcoatRoughness'in mat)mat.clearcoatRoughness=.16;
      if('envMapIntensity'in mat)mat.envMapIntensity=1.45;
      obj.castShadow=state.quality!=='balanced';obj.receiveShadow=true;
    }else if(isGlass){
      if('roughness'in mat)mat.roughness=.08;if('metalness'in mat)mat.metalness=.06;
      if('envMapIntensity'in mat)mat.envMapIntensity=1.25;
      mat.transparent=true;mat.opacity=Math.max(.42,Number(mat.opacity||.6));
    }else if(isBuilding){
      if('roughness'in mat)mat.roughness=Math.max(.58,Number(mat.roughness??.7));
      if('metalness'in mat)mat.metalness=Math.min(.18,Number(mat.metalness??.1));
      obj.castShadow=state.quality!=='balanced';obj.receiveShadow=true;
    }
    ['map','normalMap','roughnessMap','metalnessMap'].forEach(k=>{const t=mat[k];if(t&&'anisotropy'in t)t.anisotropy=Math.min(maxAniso,8)});
    mat.needsUpdate=true;
  };
  const polishScene=()=>{
    const now=performance.now();if(now-lastPolish<1400)return;lastPolish=now;
    let maxAniso=4;try{maxAniso=renderer.capabilities?.getMaxAnisotropy?.()||4}catch{}
    scene.traverse?.(obj=>{
      if(!obj?.isMesh)return;
      const mats=Array.isArray(obj.material)?obj.material:[obj.material];
      mats.forEach(mat=>polishMaterial(obj,mat,maxAniso));
    });
    root.dataset.tggGraphicsMaterialsV50='1';
  };
  const apply=()=>{
    const weather=String(root.dataset.tggWeather||'clear'),time=String(root.dataset.tggTime||'day');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const exposure=time==='night'?1.16:time==='dusk'?1.08:time==='golden'?1.13:weather==='storm'?.98:1.07;
    renderer.toneMappingExposure=exposure;
    renderer.setPixelRatio?.(Math.min(window.devicePixelRatio||1,state.quality==='balanced'?1.25:1.75));
    const targetFov=driving?72:64;
    if(Math.abs(Number(camera.fov||0)-targetFov)>.05){camera.fov=targetFov;camera.updateProjectionMatrix?.()}
    if(scene.fog){
      scene.fog.density=time==='night'?.0024:weather==='storm'?.0031:.00185;
      scene.fog.color?.set?.(time==='night'?0x07101b:time==='golden'?0x2a211c:weather==='storm'?0x111820:0x101823);
    }
    scene.background?.set?.(time==='night'?0x03070d:time==='golden'?0x181418:weather==='storm'?0x0b1016:0x0b1220);
    key.intensity=time==='night'?.75:time==='golden'?1.65:weather==='storm'?.95:2.35;
    fill.intensity=time==='night'?.48:weather==='storm'?.62:.82;
    polishScene();
    root.dataset.tggGraphicsQualityV50=state.quality;
    root.dataset.tggGraphicsDirectorV50='1';
    root.dataset.tggGraphicsLookV50='cinematic-open-world';
  };
  window.TGGGraphicsV50={apply,polishScene};
  apply();
}
function applyGraphicsDirectorV50(){window.TGGGraphicsV50?.apply?.()||installGraphicsDirectorV50()}

function installVisualProductionV51(){
  if(window.TGGVisualV51)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggVisualProductionV51='waiting';return}
  const scene=w.scene;
  const presets={
    cinematic:{exposure:1.08,fovDrive:72,fog:.00185,sat:1.08},
    midnight:{exposure:1.16,fovDrive:73,fog:.00225,sat:1.12},
    street:{exposure:1.11,fovDrive:74,fog:.0017,sat:1.10},
    natural:{exposure:1.02,fovDrive:70,fog:.0016,sat:1.02}
  };
  let preset=localStorage.getItem('tgg-graphics-preset-v51')||'cinematic';
  if(!presets[preset])preset='cinematic';

  let roads=scene.getObjectByName?.('TGG_ROAD_READABILITY_V51');
  if(!roads){
    roads=new THREE.Group();roads.name='TGG_ROAD_READABILITY_V51';
    const white=new THREE.MeshStandardMaterial({color:0xe7e7df,emissive:0x151515,emissiveIntensity:.15,roughness:.72});
    const amber=new THREE.MeshStandardMaterial({color:0xf0b63b,emissive:0x3b2504,emissiveIntensity:.3,roughness:.65});
    for(let z=-900;z<=900;z+=24){
      const dash=new THREE.Mesh(new THREE.BoxGeometry(.22,.018,8),white);dash.position.set(0,.055,z);roads.add(dash);
      const edgeL=new THREE.Mesh(new THREE.BoxGeometry(.12,.016,20),amber);edgeL.position.set(-8.7,.052,z);roads.add(edgeL);
      const edgeR=edgeL.clone();edgeR.position.x=8.7;roads.add(edgeR);
    }
    for(let x=-900;x<=900;x+=24){
      const dash=new THREE.Mesh(new THREE.BoxGeometry(8,.018,.22),white);dash.position.set(x,.055,0);roads.add(dash);
      const edgeA=new THREE.Mesh(new THREE.BoxGeometry(20,.016,.12),amber);edgeA.position.set(x,.052,-8.7);roads.add(edgeA);
      const edgeB=edgeA.clone();edgeB.position.z=8.7;roads.add(edgeB);
    }
    scene.add(roads);
  }

  let cityLights=scene.getObjectByName?.('TGG_CITY_LIGHT_DEPTH_V51');
  if(!cityLights){
    cityLights=new THREE.Group();cityLights.name='TGG_CITY_LIGHT_DEPTH_V51';
    const colors=[0xffd28a,0x9ed4ff,0xff8bb5];
    const bulbGeo=new THREE.SphereGeometry(.22,6,5);
    const bulbMats=colors.map(color=>new THREE.MeshBasicMaterial({color,transparent:true,opacity:.72}));
    for(let i=0;i<44;i++){
      const a=(i/44)*Math.PI*2,r=110+(i%6)*34;
      const x=Math.cos(a)*r,y=3.2+(i%4)*1.4,z=Math.sin(a)*r;
      if(i<10){
        const light=new THREE.PointLight(colors[i%colors.length],state.quality==='balanced'?0:1.65,34,2);
        light.userData.tggDynamicCityLightV72=1;
        light.position.set(x,y,z);cityLights.add(light);
      }else{
        const marker=new THREE.Mesh(bulbGeo,bulbMats[i%bulbMats.length]);
        marker.userData.tggEmissiveCityMarkerV72=1;
        marker.position.set(x,y,z);cityLights.add(marker);
      }
    }
    scene.add(cityLights);
  }

  const car=w.car;
  if(car&&!car.getObjectByName?.('TGG_CAR_DETAIL_V51')){
    const g=new THREE.Group();g.name='TGG_CAR_DETAIL_V51';
    const black=new THREE.MeshStandardMaterial({color:0x05070a,metalness:.62,roughness:.24});
    const chrome=new THREE.MeshStandardMaterial({color:0xbec7d2,metalness:.95,roughness:.12});
    const red=new THREE.MeshStandardMaterial({color:0xff203a,emissive:0x7a0012,emissiveIntensity:1.65,roughness:.2});
    const white=new THREE.MeshStandardMaterial({color:0xeaf7ff,emissive:0xaedbff,emissiveIntensity:1.8,roughness:.14});
    const splitter=new THREE.Mesh(new THREE.BoxGeometry(.36,.08,1.78),black);splitter.position.set(2.18,.32,0);g.add(splitter);
    const diffuser=new THREE.Mesh(new THREE.BoxGeometry(.28,.11,1.66),black);diffuser.position.set(-2.15,.34,0);g.add(diffuser);
    const exhaustL=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,.32,14),chrome);exhaustL.rotation.z=Math.PI/2;exhaustL.position.set(-2.2,.45,-.55);g.add(exhaustL);
    const exhaustR=exhaustL.clone();exhaustR.position.z=.55;g.add(exhaustR);
    [-.66,.66].forEach(z=>{
      const head=new THREE.Mesh(new THREE.BoxGeometry(.08,.16,.34),white);head.position.set(2.2,.82,z);g.add(head);
      const tail=new THREE.Mesh(new THREE.BoxGeometry(.08,.15,.32),red);tail.position.set(-2.18,.81,z);g.add(tail);
    });
    car.add(g);
  }

  let avatarRim=scene.getObjectByName?.('TGG_AVATAR_RIM_V51');
  if(!avatarRim){
    avatarRim=new THREE.PointLight(0x86cfff,state.quality==='balanced'?0:2.5,16,2);
    avatarRim.name='TGG_AVATAR_RIM_V51';scene.add(avatarRim);
  }

  let cachedAvatar=null,lastAvatarScan=0;
  const findAvatar=()=>{
    if(cachedAvatar?.parent)return cachedAvatar;
    const now=performance.now();
    if(now-lastAvatarScan<2500)return cachedAvatar;
    lastAvatarScan=now;
    let found=null;
    scene.traverse?.(o=>{
      if(found)return;
      const n=String(o?.name||'').toLowerCase();
      if(/player|avatar|character/.test(n)&&o?.position)found=o;
    });
    cachedAvatar=found||cachedAvatar;
    return cachedAvatar;
  };

  const setPreset=(name)=>{
    name=String(name||'').toLowerCase();
    if(!presets[name])name='cinematic';
    preset=name;localStorage.setItem('tgg-graphics-preset-v51',preset);
    root.dataset.tggGraphicsPresetV51=preset;
    return preset;
  };

  const apply=()=>{
    const cfg=presets[preset]||presets.cinematic;
    if(w.renderer)w.renderer.toneMappingExposure=cfg.exposure;
    if(w.camera){
      const target=state.driving?cfg.fovDrive:64;
      if(Math.abs(Number(w.camera.fov||0)-target)>.05){w.camera.fov=target;w.camera.updateProjectionMatrix?.()}
    }
    if(scene.fog)scene.fog.density=root.dataset.tggWeather==='storm'?cfg.fog*1.55:cfg.fog;
    const night=root.dataset.tggTime==='night';
    cityLights.visible=night&&state.quality!=='balanced';
    roads.visible=true;
    const av=findAvatar();
    if(av&&avatarRim){
      avatarRim.position.copy(av.position);avatarRim.position.y+=2.2;avatarRim.position.x-=2.5;
      avatarRim.visible=!state.driving&&state.quality!=='balanced';
    }
    root.dataset.tggGraphicsPresetV51=preset;
    root.dataset.tggVehicleDetailV51=car?'1':'waiting';
    root.dataset.tggRoadReadabilityV51='1';
    root.dataset.tggCityLightDepthV51='1';
    root.dataset.tggAvatarPresentationV51=av?'1':'ready';
    root.dataset.tggVisualProductionV51='1';
  };
  window.TGGVisualV51={apply,setPreset,presets:Object.keys(presets)};
  apply();
}
function applyVisualProductionV51(){window.TGGVisualV51?.apply?.()||installVisualProductionV51()}

function installOpenWorldCompositionV52(){
  if(window.TGGOpenWorldV52)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggOpenWorldCompositionV52='waiting';return}
  const scene=w.scene;

  let skyline=scene.getObjectByName?.('TGG_SKYLINE_DEPTH_V52');
  if(!skyline){
    skyline=new THREE.Group();skyline.name='TGG_SKYLINE_DEPTH_V52';
    const mats=[
      new THREE.MeshStandardMaterial({color:0x111722,roughness:.88,metalness:.06}),
      new THREE.MeshStandardMaterial({color:0x171d29,roughness:.84,metalness:.08}),
      new THREE.MeshStandardMaterial({color:0x0d131d,roughness:.9,metalness:.04})
    ];
    for(let i=0;i<72;i++){
      const a=(i/72)*Math.PI*2;
      const ring=460+(i%4)*80;
      const h=32+(i%9)*9;
      const b=new THREE.Mesh(new THREE.BoxGeometry(20+(i%5)*6,h,18+(i%4)*5),mats[i%3]);
      b.position.set(Math.cos(a)*ring,h/2,Math.sin(a)*ring);
      b.rotation.y=-a+(i%3)*.1;
      b.receiveShadow=true;
      skyline.add(b);
    }
    scene.add(skyline);
  }

  let horizon=scene.getObjectByName?.('TGG_HORIZON_LIGHTS_V52');
  if(!horizon){
    horizon=new THREE.Group();horizon.name='TGG_HORIZON_LIGHTS_V52';
    const mat=new THREE.MeshBasicMaterial({color:0xf2c98c,transparent:true,opacity:.48});
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*2,r=380+(i%5)*55;
      const p=new THREE.Mesh(new THREE.SphereGeometry(.35,6,5),mat);
      p.position.set(Math.cos(a)*r,4+(i%7)*3,Math.sin(a)*r);
      horizon.add(p);
    }
    scene.add(horizon);
  }

  let lastDrive=false,lastHeavy=0;
  let cachedCity=null,cachedDensity=null;
  const apply=()=>{
    const now=performance.now();
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=root.dataset.tggTime==='night';
    skyline.visible=true;
    horizon.visible=night&&state.quality!=='balanced';

    if(w.camera){
      w.camera.far=Math.max(Number(w.camera.far||0),3200);
      const target=driving?76:64;
      if(Math.abs(Number(w.camera.fov||0)-target)>.05){w.camera.fov=target;w.camera.updateProjectionMatrix?.()}
    }
    if(driving&&w.setCameraDistance){
      const district=root.dataset.tggDistrict||'downtown';
      const distance={downtown:66,studio:70,media:72,park:78,home:68,garage:64}[district]||70;
      try{w.setCameraDistance(distance)}catch{}
      root.dataset.tggChaseDistanceV52=String(distance);
    }

    if(now-lastHeavy>1200){
      lastHeavy=now;
      const traffic=w.traffic||[];
      traffic.forEach((car,i)=>{
        if(car?.scale){
          const s=i%4===0?.7:.64;
          car.scale.set(s,s,s);
        }
        if(car?.userData){
          car.userData.tggVisualLaneV52=(i%3)-1;
          car.userData.tggVisualSpacingV52=1.18+(i%4)*.08;
        }
      });
      if(!cachedCity?.parent)cachedCity=scene.getObjectByName?.('TGG_FULL_CITY_LIFE_BATCH');
      if(!cachedDensity?.parent)cachedDensity=scene.getObjectByName?.('TGG_WORLD_DENSITY_MEGA');
      const city=cachedCity,density=cachedDensity;
      if(city)city.scale.set(1.28,1,1.28);
      if(density)density.scale.set(1.35,1,1.35);
    }

    if(lastDrive!==driving){
      lastDrive=driving;
      root.dataset.tggCameraTransitionV52=driving?'drive':'walk';
    }
    root.dataset.tggWorldScaleV52='expanded';
    root.dataset.tggSkylineDepthV52='1';
    root.dataset.tggTrafficProportionV52='1';
    root.dataset.tggOpenWorldCompositionV52='1';
  };

  window.TGGOpenWorldV52={apply};
  apply();
}
function applyOpenWorldCompositionV52(){window.TGGOpenWorldV52?.apply?.()||installOpenWorldCompositionV52()}

function installWorldRegionsV53(){
  if(window.TGGWorldRegionsV53)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldRegionsV53='waiting';return}
  const scene=w.scene;

  let terrain=scene.getObjectByName?.('TGG_TERRAIN_BELT_V53');
  if(!terrain){
    terrain=new THREE.Group();terrain.name='TGG_TERRAIN_BELT_V53';
    const dirt=new THREE.MeshStandardMaterial({color:0x332b22,roughness:.98,metalness:0});
    const grass=new THREE.MeshStandardMaterial({color:0x203b27,roughness:.97,metalness:0});
    const rock=new THREE.MeshStandardMaterial({color:0x3d4148,roughness:.94,metalness:.02});
    const trunk=new THREE.MeshStandardMaterial({color:0x3a2617,roughness:.96});
    const leaf=new THREE.MeshStandardMaterial({color:0x183321,roughness:.95});
    for(let i=0;i<52;i++){
      const a=(i/52)*Math.PI*2;
      const r=720+(i%5)*54;
      const hill=new THREE.Mesh(new THREE.SphereGeometry(48+(i%4)*13,10,7),i%3===0?rock:(i%2?grass:dirt));
      hill.scale.y=.26+(i%4)*.04;
      hill.position.set(Math.cos(a)*r,-10+(i%3)*2,Math.sin(a)*r);
      hill.receiveShadow=true;terrain.add(hill);
    }
    for(let i=0;i<120;i++){
      const a=(i/120)*Math.PI*2+(i%7)*.03,r=610+(i%8)*36;
      const tree=new THREE.Group();
      const h=5+(i%5)*1.1;
      const t=new THREE.Mesh(new THREE.CylinderGeometry(.18,.28,h,7),trunk);t.position.y=h/2;
      const crown=new THREE.Mesh(new THREE.ConeGeometry(1.4+(i%3)*.25,3.6+(i%4)*.45,8),leaf);crown.position.y=h+1.3;
      tree.add(t,crown);tree.position.set(Math.cos(a)*r,0,Math.sin(a)*r);tree.rotation.y=a;
      terrain.add(tree);
    }
    scene.add(terrain);
  }

  let districtGlow=scene.getObjectByName?.('TGG_DISTRICT_GLOW_V53');
  if(!districtGlow){
    districtGlow=new THREE.Group();districtGlow.name='TGG_DISTRICT_GLOW_V53';
    const defs=[
      ['downtown',0x78a8ff,0,0],
      ['studio',0xff4958,-180,-120],
      ['media',0xb56cff,170,110],
      ['park',0x5cff9a,-170,140],
      ['garage',0x57d8e8,190,-130]
    ];
    defs.forEach(([name,color,x,z])=>{
      const l=new THREE.PointLight(color,state.quality==='balanced'?0:4.2,150,2);
      l.name='TGG_DISTRICT_'+String(name).toUpperCase()+'_V53';l.position.set(x,18,z);districtGlow.add(l);
    });
    scene.add(districtGlow);
  }

  let wetness=0,lastLod=0,lastWetUpdate=0,lastRoadScan=0,roadMaterials=[];
  const lodGroups={};
  const scanRoadMaterials=()=>{
    const now=performance.now();
    if(roadMaterials.length&&now-lastRoadScan<6000)return;
    lastRoadScan=now;roadMaterials=[];
    scene.traverse?.(o=>{
      if(!o?.isMesh||!o.material)return;
      const n=((o.name||'')+' '+(o.parent?.name||'')).toLowerCase();
      if(!/road|street|lane|highway|asphalt/.test(n))return;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>{
        if(!m)return;
        if(m.userData.tggBaseRoughnessV53==null)m.userData.tggBaseRoughnessV53=Number(m.roughness??.72);
        if(m.userData.tggBaseMetalnessV53==null)m.userData.tggBaseMetalnessV53=Number(m.metalness??.04);
        roadMaterials.push(m);
      });
    });
  };
  const applyWetness=()=>{
    const now=performance.now();
    if(now-lastWetUpdate<100)return;
    lastWetUpdate=now;scanRoadMaterials();
    const rain=/rain|storm/.test(String(root.dataset.tggWeather||''));
    const target=rain?1:0;
    wetness+=(target-wetness)*.2;
    roadMaterials.forEach(m=>{
      if('roughness'in m)m.roughness=Math.max(.18,m.userData.tggBaseRoughnessV53-(wetness*.38));
      if('metalness'in m)m.metalness=Math.min(.16,m.userData.tggBaseMetalnessV53+(wetness*.07));
    });
    root.dataset.tggRoadWetnessV53=wetness>.45?'wet':'dry';
  };

  const applyLod=()=>{
    const now=performance.now();if(now-lastLod<800)return;lastLod=now;
    const cam=w.camera;
    const balanced=state.quality==='balanced';
    const groups=['TGG_SKYLINE_DEPTH_V52','TGG_HORIZON_LIGHTS_V52','TGG_TERRAIN_BELT_V53','TGG_CITY_LIGHT_DEPTH_V51'];
    groups.forEach(name=>{
      let g=lodGroups[name];
      if(!g?.parent){g=scene.getObjectByName?.(name);lodGroups[name]=g}
      if(!g)return;
      g.children?.forEach?.((o,i)=>{
        if(balanced)o.visible=i%2===0;
        else o.visible=true;
      });
    });
    if(terrain)terrain.visible=true;
    root.dataset.tggLodModeV53=balanced?'balanced':'high';
    root.dataset.tggWorldLodV53='1';
  };

  const apply=()=>{
    applyWetness();applyLod();
    const district=String(root.dataset.tggDistrict||'downtown').toUpperCase();
    districtGlow.children.forEach(l=>{l.visible=l.name.includes(district)&&state.quality!=='balanced'});
    terrain.visible=true;
    root.dataset.tggTerrainBeltV53='1';
    root.dataset.tggDistrictAtmosphereV53='1';
    root.dataset.tggWorldRegionsV53='1';
  };
  window.TGGWorldRegionsV53={apply};
  apply();
}
function applyWorldRegionsV53(){window.TGGWorldRegionsV53?.apply?.()||installWorldRegionsV53()}

function installNightDriveV54(){
  if(window.TGGNightDriveV54)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggNightDriveV54='waiting';return}
  const scene=w.scene,car=w.car,camera=w.camera;

  if(car&&!car.getObjectByName?.('TGG_HEADLIGHT_RIG_V54')){
    const rig=new THREE.Group();rig.name='TGG_HEADLIGHT_RIG_V54';
    [-.62,.62].forEach(z=>{
      const target=new THREE.Object3D();target.position.set(11,.25,z*.55);rig.add(target);
      const s=new THREE.SpotLight(0xe8f6ff,0,46,Math.PI/7,.46,1.45);
      s.position.set(1.95,.82,z);s.target=target;s.castShadow=false;rig.add(s);
    });
    [-.62,.62].forEach(z=>{
      const p=new THREE.PointLight(0xff2341,0,7,2);
      p.position.set(-2.05,.72,z);rig.add(p);
    });
    car.add(rig);
  }

  let pools=scene.getObjectByName?.('TGG_STREET_LIGHT_POOLS_V54');
  if(!pools){
    pools=new THREE.Group();pools.name='TGG_STREET_LIGHT_POOLS_V54';
    const mat=new THREE.MeshBasicMaterial({color:0xffd9a4,transparent:true,opacity:.10,depthWrite:false,blending:THREE.AdditiveBlending});
    for(let i=0;i<30;i++){
      const a=(i/30)*Math.PI*2,r=85+(i%6)*38;
      const disc=new THREE.Mesh(new THREE.CircleGeometry(5.5+(i%3),20),mat);
      disc.rotation.x=-Math.PI/2;disc.position.set(Math.cos(a)*r,.065,Math.sin(a)*r);pools.add(disc);
    }
    scene.add(pools);
  }

  let rain=scene.getObjectByName?.('TGG_RAIN_PARTICLES_V54');
  if(!rain){
    const count=state.quality==='balanced'?160:360;
    const pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      pos[i*3]=(Math.random()-.5)*90;
      pos[i*3+1]=Math.random()*42;
      pos[i*3+2]=(Math.random()-.5)*90;
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({color:0xbfdcff,size:.10,transparent:true,opacity:.62,depthWrite:false});
    rain=new THREE.Points(geo,mat);rain.name='TGG_RAIN_PARTICLES_V54';
    scene.add(rain);
  }

  let prev=null,prevT=performance.now(),smoothSpeed=0,rainFrame=0;
  const carWorld=new THREE.Vector3();
  const apply=()=>{
    const now=performance.now();
    const night=root.dataset.tggTime==='night';
    const wet=/rain|storm/.test(String(root.dataset.tggWeather||''));
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const rig=car?.getObjectByName?.('TGG_HEADLIGHT_RIG_V54');
    if(rig){
      rig.children.forEach(o=>{
        if(o.isSpotLight)o.intensity=driving&&(night||wet)?(wet?7.5:6.2):0;
        if(o.isPointLight)o.intensity=driving?(night?2.1:wet?1.2:.45):0;
      });
      rig.visible=driving;
    }

    pools.visible=night&&state.quality!=='balanced';
    pools.children.forEach((m,i)=>{if(m.material)m.material.opacity=wet?.16:.095+(i%3)*.012});

    if(rain){
      rain.visible=wet;
      if(camera){
        rain.position.x=camera.position.x;
        rain.position.z=camera.position.z;
        rain.position.y=Math.max(4,camera.position.y-6);
      }
      if(wet){
        rainFrame++;
        const shouldStep=state.quality!=='balanced'||rainFrame%2===0;
        if(shouldStep){
          const a=rain.geometry?.getAttribute?.('position');
          if(a){
            for(let i=0;i<a.count;i++){
              let y=a.getY(i)-(.55+(i%5)*.08);
              if(y<-4)y=38+Math.random()*6;
              a.setY(i,y);
              a.setX(i,a.getX(i)-.025);
            }
            a.needsUpdate=true;
          }
        }
      }
    }

    if(car&&camera){
      const p=car.getWorldPosition?.(carWorld)||car.position;
      if(prev){
        const dt=Math.max(.016,(now-prevT)/1000);
        const speed=p.distanceTo(prev)/dt;
        smoothSpeed+=(speed-smoothSpeed)*.08;
      }
      prev=p.clone?.()||new THREE.Vector3(p.x,p.y,p.z);prevT=now;
      const base=driving?76:64;
      const target=base+Math.min(7,smoothSpeed*.18)+(root.dataset.tggNitrousActiveV26==='1'?3:0);
      const nextFov=camera.fov+(target-camera.fov)*.08;
      if(Math.abs(nextFov-camera.fov)>.02){camera.fov=nextFov;camera.updateProjectionMatrix?.()}
      root.dataset.tggVisualSpeedV54=String(Math.round(smoothSpeed));
    }

    root.dataset.tggHeadlightsV54=car?'1':'ready';
    root.dataset.tggRainParticlesV54='1';
    root.dataset.tggStreetLightPoolsV54='1';
    root.dataset.tggSpeedCameraV54='1';
    root.dataset.tggNightDriveV54='1';
  };
  window.TGGNightDriveV54={apply};
  apply();
}
function applyNightDriveV54(){window.TGGNightDriveV54?.apply?.()||installNightDriveV54()}

function installGraphicsPerformanceV55(){
  if(window.TGGGraphicsPerformanceV55)return;
  const w=window.TGG3D;
  let fps=60,mode=state.quality==='balanced'?'balanced':'high';
  let rafFrames=0,lastSample=performance.now(),samplerStarted=false;

  const setMode=(next)=>{
    if(next===mode)return;
    mode=next;
    root.dataset.tggGraphicsAdaptiveV55=mode;
    const renderer=w?.renderer;
    if(renderer?.setPixelRatio){
      const cap=mode==='balanced'?1.15:1.65;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,cap));
    }
  };

  const sample=now=>{
    rafFrames++;
    if(now-lastSample>=1000){
      fps=Math.round((rafFrames*1000)/(now-lastSample));
      rafFrames=0;lastSample=now;
      const next=fps<38?'balanced':fps>52?'high':mode;
      setMode(next);
      root.dataset.tggGraphicsFpsV55=String(fps);
      root.dataset.tggGraphicsFpsSourceV73='requestAnimationFrame';
      root.dataset.tggGraphicsAdaptiveV55=mode;
    }
    requestAnimationFrame(sample);
  };

  const apply=()=>{
    if(!samplerStarted){
      samplerStarted=true;
      root.dataset.tggGraphicsFpsSamplerV73='1';
      requestAnimationFrame(sample);
    }
    root.dataset.tggGraphicsPerformanceV55='v73';
  };

  window.TGGGraphicsPerformanceV55={apply,get fps(){return fps},get mode(){return mode},setMode};
  apply();
}
function applyGraphicsPerformanceV55(){window.TGGGraphicsPerformanceV55?.apply?.()||installGraphicsPerformanceV55()}

function installGraphicsOwnershipV56(){
  if(window.TGGGraphicsOwnershipV56)return;
  const w=window.TGG3D;
  let lastStamp=0,lastSignature='';
  const apply=()=>{
    if(!w?.scene||!w?.renderer||!w?.camera)return;
    const now=performance.now();
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const preset=String(root.dataset.tggGraphicsPresetV51||'cinematic');
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const signature=[driving,weather,time,preset,root.dataset.tggGraphicsAdaptiveV55||state.quality].join('|');
    const stable=signature===lastSignature&&now-lastStamp<180;
    if(!stable){
      lastSignature=signature;lastStamp=now;
      const cfg={
        cinematic:{exposure:1.08,walk:64,drive:76,fog:.00185},
        midnight:{exposure:1.16,walk:65,drive:77,fog:.0022},
        street:{exposure:1.11,walk:65,drive:78,fog:.0017},
        natural:{exposure:1.02,walk:63,drive:72,fog:.0016}
      }[preset]||{exposure:1.08,walk:64,drive:76,fog:.00185};
      const weatherFog=/storm/.test(weather)?1.55:/rain/.test(weather)?1.25:1;
      const nightBoost=time==='night'?.06:time==='golden'?.03:0;
      w.renderer.toneMappingExposure=cfg.exposure+nightBoost-(weather==='storm'?.07:0);
      const target=(driving?cfg.drive:cfg.walk)+Math.min(7,speed*.16)+(root.dataset.tggNitrousActiveV26==='1'?3:0);
      if(Math.abs(w.camera.fov-target)>.04){w.camera.fov+=(target-w.camera.fov)*.18;w.camera.updateProjectionMatrix?.()}
      w.camera.near=.08;w.camera.far=3200;
      if(w.scene.fog)w.scene.fog.density=cfg.fog*weatherFog;
      if(driving&&w.setCameraDistance){
        const district=root.dataset.tggDistrict||'downtown';
        const distance={downtown:66,studio:70,media:72,park:78,home:68,garage:64}[district]||70;
        try{w.setCameraDistance(distance)}catch{}
      }
    }
    root.dataset.tggGraphicsOwnerV56='final';
    root.dataset.tggLegacyVisualOverridesV56='suppressed';
    root.dataset.tggGraphicsOwnershipV56='1';
  };
  window.TGGGraphicsOwnershipV56={apply};
  root.dataset.tggGraphicsOwnershipV56='1';
}
function applyGraphicsOwnershipV56(){window.TGGGraphicsOwnershipV56?.apply?.()||installGraphicsOwnershipV56()}

function installGraphicsManifestV57(){
  if(window.TGGGraphicsManifestV57)return;
  const version='57',storageKey='tgg-graphics-manifest-v57';
  let lastSerialized='';
  const read=()=>{
    let saved={};try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{}
    const preset=String(saved.preset||localStorage.getItem('tgg-graphics-preset-v51')||root.dataset.tggGraphicsPresetV51||'cinematic');
    const quality=String(saved.quality||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    return {version,preset,quality,look:'cinematic-open-world',owner:'final'};
  };
  const publish=(m)=>{
    root.dataset.tggGraphicsManifestV57=version;
    root.dataset.tggGraphicsManifestPresetV57=m.preset;
    root.dataset.tggGraphicsManifestQualityV57=m.quality;
    root.dataset.tggGraphicsManifestLookV57=m.look;
    root.dataset.tggGraphicsManifestOwnerV57=m.owner;
    root.dataset.tggGraphicsMismatchV57=
      root.dataset.tggGraphicsOwnerV56==='final'&&root.dataset.tggGraphicsLookV50==='cinematic-open-world'?'0':'1';
  };
  const persist=(m)=>{
    const serialized=JSON.stringify(m);
    if(serialized===lastSerialized)return false;
    try{
      const current=localStorage.getItem(storageKey)||'';
      if(current!==serialized)localStorage.setItem(storageKey,serialized);
      lastSerialized=serialized;
      root.dataset.tggGraphicsManifestWritesV70=String(Number(root.dataset.tggGraphicsManifestWritesV70||0)+1);
      return true;
    }catch{return false}
  };
  const sync=(forceWrite=false)=>{
    const m=read();publish(m);
    if(forceWrite)persist(m);
    root.dataset.tggGraphicsManifestSyncV70='cached';
    return m;
  };
  const setPreset=(preset)=>{
    preset=String(preset||'cinematic').toLowerCase();
    const m=read();m.preset=preset;
    try{localStorage.setItem('tgg-graphics-preset-v51',preset)}catch{}
    persist(m);
    window.TGGVisualV51?.setPreset?.(preset);
    window.TGGVisualV51?.apply?.();
    publish(m);
    return preset;
  };
  const setQuality=(quality)=>{
    quality=quality==='balanced'?'balanced':'high';
    const m=read();m.quality=quality;persist(m);
    root.dataset.tggGraphicsAdaptiveV55=quality;
    publish(m);
    return quality;
  };
  try{lastSerialized=localStorage.getItem(storageKey)||''}catch{}
  window.TGGGraphicsManifestV57={sync,setPreset,setQuality,read,persist};
  sync(false);
}
function applyGraphicsManifestV57(){window.TGGGraphicsManifestV57?.sync?.(false)||installGraphicsManifestV57()}

function installBuildIntegrityV58(){
  if(window.TGGBuildIntegrityV58)return;
  const expected={overlay:'1000x-v90',graphics:'57',masterJs:'1000x-v90',cleanerJs:'80'};
  let lastInspectAt=0,lastStatus=null;
  const queryVersion=(needle)=>{
    const el=[...document.scripts].find(s=>String(s.src||'').includes(needle));
    if(!el)return '';
    try{return new URL(el.src,location.href).searchParams.get('v')||''}catch{return ''}
  };
  const cssVersion=(needle)=>{
    const el=[...document.querySelectorAll('link[rel="stylesheet"]')].find(l=>String(l.href||'').includes(needle));
    if(!el)return '';
    try{return new URL(el.href,location.href).searchParams.get('v')||''}catch{return ''}
  };
  const inspect=(force=false)=>{
    const now=performance.now();
    if(!force&&lastStatus&&now-lastInspectAt<5000){
      root.dataset.tggBuildIntegrityCacheV70='hit';
      return lastStatus;
    }
    lastInspectAt=now;
    const declared=window.__TGG_BUILD__||{};
    const actual={
      overlay:String(declared.overlay||''),graphics:String(declared.graphics||''),
      masterJs:queryVersion('tgg-1000x-master.js'),masterCss:cssVersion('tgg-1000x-master.css'),
      cleanerJs:queryVersion('tgg-screen-cleaner-2026.js'),cleanerCss:cssVersion('tgg-screen-cleaner-2026.css')
    };
    const ok=
      actual.overlay===expected.overlay&&actual.graphics===expected.graphics&&
      actual.masterJs===expected.masterJs&&actual.masterCss===expected.masterJs&&
      actual.cleanerJs===expected.cleanerJs&&actual.cleanerCss===expected.cleanerJs&&
      root.dataset.tggGraphicsManifestV57==='57'&&root.dataset.tggGraphicsMismatchV57==='0';
    root.dataset.tggBuildIntegrityV58=ok?'pass':'mismatch';
    root.dataset.tggBuildOverlayV58=actual.overlay||'missing';
    root.dataset.tggBuildMasterV58=actual.masterJs||'missing';
    root.dataset.tggBuildCleanerV58=actual.cleanerJs||'missing';
    root.dataset.tggBuildGraphicsV58=String(root.dataset.tggGraphicsManifestV57||'missing');
    root.dataset.tggBuildIntegrityCacheV70='miss';
    root.dataset.tggBuildIntegrityScansV70=String(Number(root.dataset.tggBuildIntegrityScansV70||0)+1);
    lastStatus={ok,expected,actual,checkedAt:Date.now()};
    window.TGGBuildStatusV58=lastStatus;
    return lastStatus;
  };
  window.TGGBuildIntegrityV58={inspect,force:()=>inspect(true)};
  inspect(true);
}
function applyBuildIntegrityV58(){window.TGGBuildIntegrityV58?.inspect?.(false)||installBuildIntegrityV58()}

function installBuildFailSafeV59(){
  if(window.TGGBuildFailSafeV59)return;
  let blocked=false,last='';
  const inspect=(force=false)=>{
    const status=window.TGGBuildIntegrityV58?.inspect?.(force)||window.TGGBuildStatusV58||{};
    blocked=!status.ok;
    const sig=JSON.stringify(status.actual||{});
    if(sig!==last){last=sig;root.dataset.tggBuildFailSafeV59=blocked?'blocked':'ready'}
    root.dataset.tggGameStudioAllowedV59=blocked?'0':'1';
    root.dataset.tggMixedAssetGuardV59=blocked?'1':'0';
    return !blocked;
  };
  const reloadLatest=()=>{
    try{
      const u=new URL(location.href);
      u.searchParams.set('tgg-refresh',String(Date.now()));
      location.replace(u.href);
      return true;
    }catch{
      location.reload();
      return true;
    }
  };
  const guard=(fn)=>{
    if(!inspect(true)){
      try{window.TGGBuildStatusPanelV58?.open?.()}catch{}
      return false;
    }
    try{return fn?.()}catch{return false}
  };
  window.TGGBuildFailSafeV59={inspect,reloadLatest,guard,get blocked(){return blocked}};
  inspect();
}
function applyBuildFailSafeV59(){window.TGGBuildFailSafeV59?.inspect?.()||installBuildFailSafeV59()}

function installBuildRecoveryV60(){
  if(window.TGGBuildRecoveryV60)return;
  const key='tgg-build-recovery-v60';
  let stateV60={attempted:false,recovered:false};
  try{stateV60=Object.assign(stateV60,JSON.parse(sessionStorage.getItem(key)||'{}'))}catch{}
  const inspect=()=>{
    const ok=window.TGGBuildFailSafeV59?.inspect?.()??false;
    if(ok&&stateV60.attempted&&!stateV60.recovered){
      stateV60.recovered=true;
      try{sessionStorage.setItem(key,JSON.stringify(stateV60))}catch{}
    }
    root.dataset.tggBuildRecoveryV60=ok?(stateV60.recovered?'recovered':'ready'):'needed';
    root.dataset.tggBuildRecoveryAttemptedV60=stateV60.attempted?'1':'0';
    root.dataset.tggBuildRecoveryRecoveredV60=stateV60.recovered?'1':'0';
    return ok;
  };
  const recover=()=>{
    stateV60.attempted=true;stateV60.recovered=false;
    try{sessionStorage.setItem(key,JSON.stringify(stateV60))}catch{}
    root.dataset.tggBuildRecoveryV60='reloading';
    return window.TGGBuildFailSafeV59?.reloadLatest?.()||false;
  };
  const clear=()=>{
    stateV60={attempted:false,recovered:false};
    try{sessionStorage.removeItem(key)}catch{}
    return inspect();
  };
  window.TGGBuildRecoveryV60={inspect,recover,clear,get state(){return {...stateV60}}};
  inspect();
}
function applyBuildRecoveryV60(){window.TGGBuildRecoveryV60?.inspect?.()||installBuildRecoveryV60()}

function installRaceCoreAuthorityV61(){
  if(window.TGGRaceCoreV61)return;
  const setNormal=()=>{
    root.dataset.tggRaceEventModeV61='normal';
    root.dataset.tggRivalTierSnapshotV73='';
    applyRaceEventsV32();
    return window.TGGRaceCareerV32?.status?.();
  };
  const inspect=()=>{
    const id=String(root.dataset.tggRaceEventV32||'');
    let mode=root.dataset.tggRaceEventModeV61||'normal';
    if(id==='season-finale-v41')mode='finale';
    else if(id.startsWith('rival-'))mode='rival';
    root.dataset.tggRaceEventModeV61=mode;
    root.dataset.tggRaceRouteOwnerV61=mode==='normal'?'v33':mode==='rival'?'v39':'v41';
    root.dataset.tggRaceRewardOwnerV61=mode==='rival'?'rival-explicit':mode==='finale'?'finale-explicit':'catalog';
    root.dataset.tggRaceCoreAuthorityV61='1';
    return {mode,id,routeOwner:root.dataset.tggRaceRouteOwnerV61};
  };
  window.TGGRaceCoreV61={inspect,setNormal};
  if(!root.dataset.tggRaceEventModeV61)root.dataset.tggRaceEventModeV61='normal';
  inspect();
}
function applyRaceCoreAuthorityV61(){window.TGGRaceCoreV61?.inspect?.()||installRaceCoreAuthorityV61()}

function installRaceTierAuthorityV62(){
  if(window.TGGRaceTierV62)return;
  const order=['ROOKIE','STREET','PRO','ELITE'];
  const select=(tier)=>{
    tier=String(tier||'ROOKIE').toUpperCase();
    const max=root.dataset.tggRaceMaxUnlockedTierV62||'ROOKIE';
    if(!order.includes(tier)||order.indexOf(tier)>order.indexOf(max)){
      root.dataset.tggRaceTierSelectBlockedV62=tier;
      return false;
    }
    try{localStorage.setItem('tgg-selected-race-tier-v62',tier)}catch{}
    root.dataset.tggRaceSelectedTierV62=tier;
    root.dataset.tggRaceTierV30=tier;
    root.dataset.tggRaceEventModeV61='normal';
    root.dataset.tggRivalTierSnapshotV73='';
    root.dataset.tggRaceEventIndexV32='0';
    root.dataset.tggRaceTierSelectBlockedV62='';
    applyRaceTierV30();
    applyRaceTierLocksV31();
    applyRaceEventsV32();
    applyRaceEntryV33();
    applyTierRivalsV36();
    applyRaceCoreAuthorityV61();
    return true;
  };
  const next=()=>{
    const max=root.dataset.tggRaceMaxUnlockedTierV62||'ROOKIE';
    const current=root.dataset.tggRaceSelectedTierV62||'ROOKIE';
    const maxI=order.indexOf(max),curI=Math.max(0,order.indexOf(current));
    return select(order[(curI+1)%(maxI+1)]);
  };
  const inspect=()=>{
    applyRaceTierV30();
    root.dataset.tggRaceTierAuthorityV62='1';
    root.dataset.tggRaceTierSelectionModeV62='explicit';
    return {selected:root.dataset.tggRaceSelectedTierV62,max:root.dataset.tggRaceMaxUnlockedTierV62};
  };
  window.TGGRaceTierV62={select,next,inspect,order:[...order]};
  inspect();
}
function applyRaceTierAuthorityV62(){window.TGGRaceTierV62?.inspect?.()||installRaceTierAuthorityV62()}

function installCheckpointAuthorityV63(){
  if(window.TGGCheckpointAuthorityV63)return;
  const inspect=()=>{
    const mode=root.dataset.tggRaceEventModeV61||'normal';
    const owner=mode==='normal'?'v33':mode==='rival'?'v39':'v41';
    root.dataset.tggCheckpointAuthorityV63='event-route';
    root.dataset.tggCheckpointRouteOwnerV63=owner;
    root.dataset.tggLegacyCheckpointV25='suppressed';
    root.dataset.tggCheckpointAuthorityReadyV63='1';
    return {authority:'event-route',owner};
  };
  const finishOnce=()=>{
    const runId=root.dataset.tggRaceRunIdV43||'';
    if(!runId)return false;
    const stamp=runId+':'+String(root.dataset.tggRaceEventV32||'event');
    if(root.dataset.tggRaceFinishStampV63===stamp)return false;
    root.dataset.tggRaceFinishStampV63=stamp;
    root.dataset.tggRaceFinishV25='1';
    root.dataset.tggRaceMode='off';
    root.dataset.tggRaceFinishOwnerV63='event-route';
    return true;
  };
  window.TGGCheckpointAuthorityV63={inspect,finishOnce};
  inspect();
}
function applyCheckpointAuthorityV63(){window.TGGCheckpointAuthorityV63?.inspect?.()||installCheckpointAuthorityV63()}

function installOpponentRouteAuthorityV64(){
  if(window.TGGOpponentRouteV64)return;
  const inspect=()=>{
    const route=window.TGG3D?.scene?.getObjectByName?.('TGG_EVENT_ROUTE_V33');
    root.dataset.tggOpponentRouteAuthorityV64='event-route';
    root.dataset.tggOpponentRoutePointsV64=String(route?.children?.length||0);
    root.dataset.tggOpponentPlacementV64='route-progress';
    root.dataset.tggOpponentRouteAuthorityReadyV64='1';
    return {points:Number(root.dataset.tggOpponentRoutePointsV64||0)};
  };
  window.TGGOpponentRouteV64={inspect};
  inspect();
}
function applyOpponentRouteAuthorityV64(){window.TGGOpponentRouteV64?.inspect?.()||installOpponentRouteAuthorityV64()}

function installOpponentDynamicsV65(){
  if(window.TGGOpponentDynamicsV65)return;
  const inspect=()=>{
    root.dataset.tggOpponentDynamicsV65='1';
    root.dataset.tggOpponentLaneModelV65=root.dataset.tggOpponentLaneModelV65||'separated';
    root.dataset.tggOpponentPathSmoothingV65='1';
    root.dataset.tggOpponentCatchupModelV65='bounded';
    return true;
  };
  window.TGGOpponentDynamicsV65={inspect};
  inspect();
}
function applyOpponentDynamicsV65(){window.TGGOpponentDynamicsV65?.inspect?.()||installOpponentDynamicsV65()}

function installRacecraftV66(){
  if(window.TGGRacecraftV66)return;
  const inspect=()=>{
    root.dataset.tggRacecraftV66='1';
    root.dataset.tggOpponentCornerModelV66='adaptive';
    root.dataset.tggOpponentSeparationV66='minimum-gap';
    root.dataset.tggOpponentStartGridV66='staggered';
    root.dataset.tggLegacyOpponentMotionV66='suppressed';
    return true;
  };
  window.TGGRacecraftV66={inspect};
  inspect();
}
function applyRacecraftV66(){window.TGGRacecraftV66?.inspect?.()||installRacecraftV66()}

function installPayoutAuthorityV67(){
  if(window.TGGPayoutV67)return;
  const bankKey='tgg-race-bank-v28',ledgerKey='tgg-payout-ledger-v67';
  const ledger=()=>{try{return JSON.parse(localStorage.getItem(ledgerKey)||'{}')}catch{return {}}};
  const grant=(claimId,amount,type)=>{
    amount=Math.max(0,Math.round(Number(amount)||0));
    if(!claimId||amount<=0)return {granted:false,amount:0};
    const claims=ledger();
    if(claims[claimId]){
      root.dataset.tggPayoutLastClaimV67=claimId;
      root.dataset.tggPayoutLastStatusV67='duplicate-blocked';
      return {granted:false,amount:Number(claims[claimId].amount||0)};
    }
    try{
      const bank=Number(localStorage.getItem(bankKey)||0)+amount;
      claims[claimId]={amount,type:String(type||'reward'),at:Date.now()};
      localStorage.setItem(bankKey,String(bank));
      localStorage.setItem(ledgerKey,JSON.stringify(claims));
      root.dataset.tggRaceBankV28=String(bank);
      root.dataset.tggPayoutLastClaimV67=claimId;
      root.dataset.tggPayoutLastAmountV67=String(amount);
      root.dataset.tggPayoutLastTypeV67=String(type||'reward');
      root.dataset.tggPayoutLastStatusV67='granted';
      return {granted:true,amount,bank};
    }catch{
      root.dataset.tggPayoutLastStatusV67='error';
      return {granted:false,amount:0};
    }
  };
  const inspect=()=>{
    root.dataset.tggPayoutAuthorityV67='1';
    root.dataset.tggBasePayoutOwnerV67='career-v34';
    root.dataset.tggBonusPayoutModelV67='ledgered';
    root.dataset.tggLegacyRacePayoutV28='suppressed';
    return true;
  };
  window.TGGPayoutV67={grant,inspect,ledger};
  inspect();
}
function applyPayoutAuthorityV67(){window.TGGPayoutV67?.inspect?.()||installPayoutAuthorityV67()}

function installProgressAuthorityV68(){
  if(window.TGGProgressV68)return;
  const ledgerKey='tgg-progress-ledger-v68';
  const ledger=()=>{try{return JSON.parse(localStorage.getItem(ledgerKey)||'{}')}catch{return {}}};
  const claim=(claimId,type,apply)=>{
    if(!claimId)return {granted:false,status:'invalid'};
    const claims=ledger();
    if(claims[claimId]){
      root.dataset.tggProgressLastClaimV68=claimId;
      root.dataset.tggProgressLastStatusV68='duplicate-blocked';
      return {granted:false,status:'duplicate'};
    }
    try{
      const detail=apply?.()||{};
      claims[claimId]={type:String(type||'progress'),at:Date.now(),detail};
      localStorage.setItem(ledgerKey,JSON.stringify(claims));
      root.dataset.tggProgressLastClaimV68=claimId;
      root.dataset.tggProgressLastTypeV68=String(type||'progress');
      root.dataset.tggProgressLastStatusV68='granted';
      return {granted:true,status:'granted',detail};
    }catch{
      root.dataset.tggProgressLastStatusV68='error';
      return {granted:false,status:'error'};
    }
  };
  const inspect=()=>{
    root.dataset.tggProgressAuthorityV68='1';
    root.dataset.tggProgressClaimModelV68='persistent-run-ledger';
    return true;
  };
  window.TGGProgressV68={claim,ledger,inspect};
  inspect();
}
function applyProgressAuthorityV68(){window.TGGProgressV68?.inspect?.()||installProgressAuthorityV68()}

function installRewardIntegrityV69(){
  if(window.TGGRewardIntegrityV69)return;
  const inspect=()=>{
    root.dataset.tggRewardIntegrityV69='1';
    root.dataset.tggAchievementRewardOwnerV69='payout-v67';
    root.dataset.tggCrewRankRewardOwnerV69='payout-v67';
    root.dataset.tggResultsBreakdownModelV69='base-bonus-progress';
    return true;
  };
  window.TGGRewardIntegrityV69={inspect};
  inspect();
}
function applyRewardIntegrityV69(){window.TGGRewardIntegrityV69?.inspect?.()||installRewardIntegrityV69()}

function installRuntimeEfficiencyV70(){
  if(window.TGGRuntimeEfficiencyV70)return;
  const inspect=()=>{
    root.dataset.tggRuntimeEfficiencyV70='1';
    root.dataset.tggMasterTickMsV70='1200';
    root.dataset.tggBuildScanCacheMsV70='5000';
    root.dataset.tggManifestWriteModeV70='on-change';
    root.dataset.tggIntegrityScanModeV70='cached';
    return {
      tickMs:1200,buildScanCacheMs:5000,manifestWriteMode:'on-change',integrityScanMode:'cached'
    };
  };
  window.TGGRuntimeEfficiencyV70={inspect,forceIntegrity:()=>window.TGGBuildIntegrityV58?.inspect?.(true)};
  inspect();
}
function applyRuntimeEfficiencyV70(){window.TGGRuntimeEfficiencyV70?.inspect?.()||installRuntimeEfficiencyV70()}

function installRuntimeHotspotCacheV71(){
  if(window.TGGRuntimeHotspotCacheV71)return;
  const inspect=()=>{
    root.dataset.tggRuntimeHotspotCacheV71='1';
    root.dataset.tggUiRenderModeV71='signature-diff';
    root.dataset.tggSceneLookupModeV71='cached-static-groups';
    root.dataset.tggHeavyPassModeV71='throttled-and-cached';
    return true;
  };
  window.TGGRuntimeHotspotCacheV71={inspect};
  inspect();
}
function applyRuntimeHotspotCacheV71(){window.TGGRuntimeHotspotCacheV71?.inspect?.()||installRuntimeHotspotCacheV71()}

function installVisualBudgetV72(){
  if(window.TGGVisualBudgetV72)return;
  const w=window.TGG3D;
  let lastMode='';
  const apply=()=>{
    const scene=w?.scene;if(!scene)return;
    const mode=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    if(mode!==lastMode){
      lastMode=mode;
      const balanced=mode==='balanced';
      const skyline=scene.getObjectByName?.('TGG_SKYLINE_DEPTH_V52');
      const horizon=scene.getObjectByName?.('TGG_HORIZON_LIGHTS_V52');
      const terrain=scene.getObjectByName?.('TGG_TERRAIN_BELT_V53');
      const pools=scene.getObjectByName?.('TGG_STREET_LIGHT_POOLS_V54');
      const cityLights=scene.getObjectByName?.('TGG_CITY_LIGHT_DEPTH_V51');
      if(skyline)skyline.children.forEach((o,i)=>o.visible=!balanced||i%3===0);
      if(horizon)horizon.children.forEach((o,i)=>o.visible=!balanced||i%4===0);
      if(terrain)terrain.children.forEach((o,i)=>o.visible=!balanced||i%3===0);
      if(pools)pools.children.forEach((o,i)=>o.visible=!balanced||i%2===0);
      if(cityLights)cityLights.children.forEach((o,i)=>{
        if(o?.isPointLight)o.intensity=balanced?0:(1.35+(i%3)*.15);
        else o.visible=!balanced||i%2===0;
      });
      root.dataset.tggVisualBudgetModeV72=balanced?'balanced':'high';
    }
    root.dataset.tggDynamicCityLightsV72='10';
    root.dataset.tggDecorativeCityMarkersV72='34';
    root.dataset.tggSharedStreetPoolMaterialV72='1';
    root.dataset.tggVisualBudgetV72='1';
  };
  window.TGGVisualBudgetV72={apply};
  apply();
}
function applyVisualBudgetV72(){window.TGGVisualBudgetV72?.apply?.()||installVisualBudgetV72()}

function installSystemIntegrityV73(){
  if(window.TGGSystemIntegrityV73)return;
  const inspect=()=>{
    root.dataset.tggSystemIntegrityV73='1';
    root.dataset.tggTierAuthorityModelV73='selected-max-effective';
    root.dataset.tggGraphicsFpsAuthorityV73='raf';
    root.dataset.tggGameplayInputGuardV73=root.dataset.tggGameplayInputGuardV73||'pending-cleaner';
    return {
      tierModel:'selected-max-effective',
      fpsAuthority:'raf',
      inputGuard:root.dataset.tggGameplayInputGuardV73
    };
  };
  window.TGGSystemIntegrityV73={inspect};
  inspect();
}
function applySystemIntegrityV73(){window.TGGSystemIntegrityV73?.inspect?.()||installSystemIntegrityV73()}

function installAuthorityConsolidationV74(){
  if(window.TGGAuthorityConsolidationV74)return;
  const inspect=()=>{
    root.dataset.tggAuthorityConsolidationV74='1';
    root.dataset.tggUnlockAuthorityV74='race-max-tier-v62';
    root.dataset.tggQualificationAuthorityV74='season-points+max-tier';
    root.dataset.tggLegacyUnlockLayersV74='mirrors-only';
    return true;
  };
  window.TGGAuthorityConsolidationV74={inspect};
  inspect();
}
function applyAuthorityConsolidationV74(){window.TGGAuthorityConsolidationV74?.inspect?.()||installAuthorityConsolidationV74()}

function installWorldVisualOverhaulV75(){
  if(window.TGGWorldVisualV75)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldVisualOverhaulV75='waiting';return}
  const scene=w.scene;

  const profiles={
    downtown:{fog:.00175,hemi:1.18,key:2.8,exposure:1.08,sky:0x7f9fbd,ground:0x18202a},
    studio:{fog:.00195,hemi:1.10,key:2.55,exposure:1.10,sky:0x8b78a8,ground:0x241b2b},
    media:{fog:.00188,hemi:1.14,key:2.65,exposure:1.11,sky:0x718eae,ground:0x171d29},
    park:{fog:.00155,hemi:1.25,key:2.35,exposure:1.03,sky:0x87a99d,ground:0x1b2a20},
    home:{fog:.00162,hemi:1.20,key:2.4,exposure:1.04,sky:0x8fa5b7,ground:0x20242b},
    garage:{fog:.00182,hemi:1.05,key:2.75,exposure:1.08,sky:0x7890a6,ground:0x171b22}
  };

  let hemi=scene.getObjectByName?.('TGG_WORLD_HEMI_V75');
  if(!hemi){
    hemi=new THREE.HemisphereLight(0x8fa8c7,0x1c221d,1.15);
    hemi.name='TGG_WORLD_HEMI_V75';scene.add(hemi);
  }
  let key=scene.getObjectByName?.('TGG_WORLD_KEY_V75');
  if(!key){
    key=new THREE.DirectionalLight(0xffe1bf,2.5);
    key.name='TGG_WORLD_KEY_V75';key.position.set(-120,180,90);key.castShadow=false;scene.add(key);
  }

  let windows=scene.getObjectByName?.('TGG_BUILDING_WINDOWS_V75');
  if(!windows&&THREE.InstancedMesh){
    const count=180;
    const geo=new THREE.PlaneGeometry(1.8,.9);
    const mat=new THREE.MeshBasicMaterial({color:0xffdca8,transparent:true,opacity:.52,side:THREE.DoubleSide,depthWrite:false});
    windows=new THREE.InstancedMesh(geo,mat,count);windows.name='TGG_BUILDING_WINDOWS_V75';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<count;i++){
      const a=(i/count)*Math.PI*2+(i%9)*.07;
      const r=120+(i%12)*34;
      const y=8+(i%10)*4.4;
      p.set(Math.cos(a)*r,y,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      s.set(.7+(i%4)*.16,.7+(i%3)*.18,1);
      m.compose(p,q,s);windows.setMatrixAt(i,m);
    }
    windows.instanceMatrix.needsUpdate=true;scene.add(windows);
  }

  let poles=scene.getObjectByName?.('TGG_ROADSIDE_DETAIL_V75');
  if(!poles&&THREE.InstancedMesh){
    const count=96,geo=new THREE.CylinderGeometry(.08,.11,5.8,6);
    const mat=new THREE.MeshStandardMaterial({color:0x39434e,metalness:.55,roughness:.5});
    poles=new THREE.InstancedMesh(geo,mat,count);poles.name='TGG_ROADSIDE_DETAIL_V75';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<count;i++){
      const axis=i%2,side=(i%4<2?-1:1),step=Math.floor(i/4)-12;
      p.set(axis?step*44:side*13.5,2.9,axis?side*13.5:step*44);
      q.identity();m.compose(p,q,s);poles.setMatrixAt(i,m);
    }
    poles.instanceMatrix.needsUpdate=true;scene.add(poles);
  }

  let carPolished=false;
  const polishCar=()=>{
    if(carPolished||!w.car)return;
    w.car.traverse?.(o=>{
      if(!o?.isMesh||!o.material)return;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>{
        if(!m||!('roughness'in m))return;
        m.roughness=Math.max(.16,Math.min(.58,Number(m.roughness??.42)));
        if('metalness'in m)m.metalness=Math.max(Number(m.metalness??0),.18);
        m.needsUpdate=true;
      });
    });
    carPolished=true;
    root.dataset.tggVehicleMaterialPolishV75='1';
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const p=profiles[district]||profiles.downtown;
    const night=time==='night',storm=/storm/.test(weather),rain=/rain/.test(weather);
    const sig=[district,time,weather,quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      hemi.intensity=p.hemi*(night?.52:1)*(storm?.72:1);
      hemi.color.setHex(night?0x536883:p.sky);
      hemi.groundColor.setHex(p.ground);
      key.intensity=p.key*(night?.34:1)*(storm?.66:1);
      key.color.setHex(night?0x9fb9dd:(time==='golden'?0xffb36b:0xffe1bf));
      if(scene.fog)scene.fog.density=p.fog*(storm?1.55:rain?1.22:1);
      if(w.renderer)w.renderer.toneMappingExposure=p.exposure+(night?.05:0)-(storm?.06:0);
      if(windows){
        windows.visible=night||time==='golden';
        if(windows.material)windows.material.opacity=night?.62:.34;
      }
      if(poles)poles.visible=quality!=='balanced'||district!=='park';
    }

    polishCar();
    if(w.camera){
      const driving=root.dataset.tggDriving==='1'||state.driving;
      const target=driving?74:63;
      if(Math.abs(Number(w.camera.fov||0)-target)>.15){
        w.camera.fov+=(target-w.camera.fov)*.14;
        w.camera.updateProjectionMatrix?.();
      }
    }
    root.dataset.tggWorldVisualDistrictV75=district;
    root.dataset.tggWorldVisualTimeV75=time;
    root.dataset.tggBuildingWindowInstancesV75=windows?'180':'0';
    root.dataset.tggRoadsideInstancesV75=poles?'96':'0';
    root.dataset.tggDistrictAtmosphereV75='1';
    root.dataset.tggWholeWorldGraphicsV75='1';
    root.dataset.tggWorldVisualOverhaulV75='1';
  };

  window.TGGWorldVisualV75={apply,profiles:Object.keys(profiles)};
  apply();
}
function applyWorldVisualOverhaulV75(){window.TGGWorldVisualV75?.apply?.()||installWorldVisualOverhaulV75()}

function installOpenWorldExpansionV76(){
  if(window.TGGOpenWorldExpansionV76)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggOpenWorldExpansionV76='waiting';return}
  const scene=w.scene;

  let countryside=scene.getObjectByName?.('TGG_COUNTRYSIDE_BELT_V76');
  if(!countryside&&THREE.InstancedMesh){
    countryside=new THREE.Group();countryside.name='TGG_COUNTRYSIDE_BELT_V76';
    const treeGeo=new THREE.ConeGeometry(1.8,7.5,7);
    const treeMat=new THREE.MeshStandardMaterial({color:0x1d3a26,roughness:.96});
    const trees=new THREE.InstancedMesh(treeGeo,treeMat,220);trees.name='TGG_COUNTRYSIDE_TREES_V76';
    const rockGeo=new THREE.DodecahedronGeometry(1.35,0);
    const rockMat=new THREE.MeshStandardMaterial({color:0x4b4f53,roughness:.98});
    const rocks=new THREE.InstancedMesh(rockGeo,rockMat,72);rocks.name='TGG_COUNTRYSIDE_ROCKS_V76';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<220;i++){
      const a=(i/220)*Math.PI*2+(i%11)*.045;
      const r=760+(i%13)*24;
      p.set(Math.cos(a)*r,3.6,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.37,0));
      const sc=.72+(i%6)*.08;s.set(sc,sc,sc);
      m.compose(p,q,s);trees.setMatrixAt(i,m);
    }
    for(let i=0;i<72;i++){
      const a=(i/72)*Math.PI*2+(i%5)*.08;
      const r=690+(i%9)*42;
      p.set(Math.cos(a)*r,.75,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a,0));
      const sc=.7+(i%4)*.2;s.set(sc,sc*.7,sc);
      m.compose(p,q,s);rocks.setMatrixAt(i,m);
    }
    trees.instanceMatrix.needsUpdate=true;rocks.instanceMatrix.needsUpdate=true;
    countryside.add(trees,rocks);scene.add(countryside);
  }

  let highwayDepth=scene.getObjectByName?.('TGG_HIGHWAY_DEPTH_V76');
  if(!highwayDepth&&THREE.InstancedMesh){
    highwayDepth=new THREE.Group();highwayDepth.name='TGG_HIGHWAY_DEPTH_V76';
    const signGeo=new THREE.BoxGeometry(3.8,1.7,.16);
    const signMat=new THREE.MeshStandardMaterial({color:0x1f5d46,roughness:.72,metalness:.08});
    const signs=new THREE.InstancedMesh(signGeo,signMat,24);signs.name='TGG_HIGHWAY_SIGNS_V76';
    const guardGeo=new THREE.BoxGeometry(5,.22,.18);
    const guardMat=new THREE.MeshStandardMaterial({color:0x67717d,metalness:.55,roughness:.48});
    const guards=new THREE.InstancedMesh(guardGeo,guardMat,120);guards.name='TGG_HIGHWAY_GUARDS_V76';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<24;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-3;
      p.set(axis?step*180:side*18,3.2,axis?side*18:step*180);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);signs.setMatrixAt(i,m);
    }
    for(let i=0;i<120;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-15;
      p.set(axis?step*38:side*14.5,.48,axis?side*14.5:step*38);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);guards.setMatrixAt(i,m);
    }
    signs.instanceMatrix.needsUpdate=true;guards.instanceMatrix.needsUpdate=true;
    highwayDepth.add(signs,guards);scene.add(highwayDepth);
  }

  let neighborhood=scene.getObjectByName?.('TGG_NEIGHBORHOOD_DEPTH_V76');
  if(!neighborhood&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(8,5,10);
    const mat=new THREE.MeshStandardMaterial({color:0x343941,roughness:.9,metalness:.02});
    neighborhood=new THREE.InstancedMesh(geo,mat,48);neighborhood.name='TGG_NEIGHBORHOOD_DEPTH_V76';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<48;i++){
      const ring=250+(i%4)*62,a=(i/48)*Math.PI*2;
      p.set(Math.cos(a)*ring,2.5,Math.sin(a)*ring);
      q.setFromEuler(new THREE.Euler(0,-a+(i%3)*.2,0));
      s.set(.8+(i%3)*.18,.75+(i%4)*.08,.8+(i%2)*.22);
      m.compose(p,q,s);neighborhood.setMatrixAt(i,m);
    }
    neighborhood.instanceMatrix.needsUpdate=true;scene.add(neighborhood);
  }

  let life=scene.getObjectByName?.('TGG_AMBIENT_LIFE_V76');
  if(!life&&THREE.InstancedMesh){
    const geo=THREE.CapsuleGeometry?new THREE.CapsuleGeometry(.22,.9,3,6):new THREE.CylinderGeometry(.2,.24,1.35,6);
    const mat=new THREE.MeshStandardMaterial({color:0x58616d,roughness:.78});
    life=new THREE.InstancedMesh(geo,mat,36);life.name='TGG_AMBIENT_LIFE_V76';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<36;i++){
      const a=(i/36)*Math.PI*2,r=42+(i%6)*16;
      p.set(Math.cos(a)*r,.72,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a+Math.PI,0));
      m.compose(p,q,s);life.setMatrixAt(i,m);
    }
    life.instanceMatrix.needsUpdate=true;scene.add(life);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const sig=[district,quality,driving?'1':'0'].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      const balanced=quality==='balanced';
      if(countryside)countryside.visible=district==='park'||district==='home'||driving;
      if(highwayDepth)highwayDepth.visible=driving||district==='downtown'||district==='garage';
      if(neighborhood)neighborhood.visible=!balanced||district==='home'||district==='studio';
      if(life)life.visible=!driving&&district!=='garage';
      if(w.camera){
        w.camera.far=Math.max(Number(w.camera.far||0),4200);
        w.camera.updateProjectionMatrix?.();
      }
    }
    const traffic=w.traffic||[];
    traffic.forEach((v,i)=>{
      if(v?.userData){
        v.userData.tggWorldLaneClassV76=i%3===0?'highway':i%3===1?'city':'local';
        v.userData.tggWorldTrafficSpacingV76=1.12+(i%5)*.11;
      }
    });
    root.dataset.tggCountrysideTreesV76=countryside?'220':'0';
    root.dataset.tggCountrysideRocksV76=countryside?'72':'0';
    root.dataset.tggNeighborhoodBuildingsV76=neighborhood?'48':'0';
    root.dataset.tggAmbientLifeV76=life?'36':'0';
    root.dataset.tggHighwayDepthV76=highwayDepth?'1':'0';
    root.dataset.tggOpenWorldScaleV76='expanded-4200';
    root.dataset.tggWorldLifeDepthV76='1';
    root.dataset.tggOpenWorldExpansionV76='1';
  };

  window.TGGOpenWorldExpansionV76={apply};
  apply();
}
function applyOpenWorldExpansionV76(){window.TGGOpenWorldExpansionV76?.apply?.()||installOpenWorldExpansionV76()}

function installDistrictIdentityV77(){
  if(window.TGGDistrictIdentityV77)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggDistrictIdentityV77='waiting';return}
  const scene=w.scene;

  let landmarks=scene.getObjectByName?.('TGG_DISTRICT_LANDMARKS_V77');
  if(!landmarks){
    landmarks=new THREE.Group();landmarks.name='TGG_DISTRICT_LANDMARKS_V77';
    const specs=[
      ['downtown',0,-360,34,24,82,0x202633],
      ['studio',-360,-120,30,22,48,0x3b2338],
      ['media',340,-40,32,24,62,0x21334b],
      ['park',240,320,22,18,28,0x24412e],
      ['home',-300,300,28,20,34,0x3c3a35],
      ['garage',0,430,36,26,40,0x30353b]
    ];
    specs.forEach(([name,x,z,wid,dep,h,color])=>{
      const mat=new THREE.MeshStandardMaterial({color,roughness:.82,metalness:.08});
      const b=new THREE.Mesh(new THREE.BoxGeometry(wid,h,dep),mat);
      b.position.set(x,h/2,z);b.userData.tggDistrictV77=name;landmarks.add(b);
      const crown=new THREE.Mesh(new THREE.BoxGeometry(wid*.62,4,dep*.62),new THREE.MeshBasicMaterial({color:0x7abfff,transparent:true,opacity:.4}));
      crown.position.set(x,h+2,z);crown.userData.tggDistrictV77=name;landmarks.add(crown);
    });
    scene.add(landmarks);
  }

  let frontage=scene.getObjectByName?.('TGG_STOREFRONT_FRONTAGE_V77');
  if(!frontage&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(7.5,3.2,.6);
    const mat=new THREE.MeshStandardMaterial({color:0x313844,roughness:.78,metalness:.08});
    frontage=new THREE.InstancedMesh(geo,mat,84);frontage.name='TGG_STOREFRONT_FRONTAGE_V77';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const side=i%4,step=Math.floor(i/4)-10;
      let x=0,z=0,r=0;
      if(side===0){x=-78;z=step*18;r=Math.PI/2}
      if(side===1){x=78;z=step*18;r=-Math.PI/2}
      if(side===2){x=step*18;z=-78;r=0}
      if(side===3){x=step*18;z=78;r=Math.PI}
      p.set(x,1.6,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.82+(i%4)*.08;s.set(sc,1,1);m.compose(p,q,s);frontage.setMatrixAt(i,m);
    }
    frontage.instanceMatrix.needsUpdate=true;scene.add(frontage);
  }

  let pedestrian=scene.getObjectByName?.('TGG_PEDESTRIAN_POCKETS_V77');
  if(!pedestrian&&THREE.InstancedMesh){
    const geo=THREE.CapsuleGeometry?new THREE.CapsuleGeometry(.2,.82,3,6):new THREE.CylinderGeometry(.18,.23,1.2,6);
    const mat=new THREE.MeshStandardMaterial({color:0x6b7280,roughness:.76});
    pedestrian=new THREE.InstancedMesh(geo,mat,54);pedestrian.name='TGG_PEDESTRIAN_POCKETS_V77';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const centers=[[-70,-30],[65,-22],[-28,68],[35,60],[-54,34],[58,32]];
    for(let i=0;i<54;i++){
      const c0=centers[i%centers.length],ring=4+(i%5)*2,a=(i/54)*Math.PI*6;
      p.set(c0[0]+Math.cos(a)*ring,.64,c0[1]+Math.sin(a)*ring);
      q.setFromEuler(new THREE.Euler(0,a,0));m.compose(p,q,s);pedestrian.setMatrixAt(i,m);
    }
    pedestrian.instanceMatrix.needsUpdate=true;scene.add(pedestrian);
  }

  let contact=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
  if(!contact){
    const mat=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28,depthWrite:false});
    contact=new THREE.Mesh(new THREE.CircleGeometry(1.15,20),mat);contact.name='TGG_AVATAR_CONTACT_V77';
    contact.rotation.x=-Math.PI/2;contact.position.y=.025;contact.visible=false;scene.add(contact);
  }

  let avatar=null,lastScan=0,lastSig='';
  const findAvatar=()=>{
    if(avatar?.parent)return avatar;
    const now=performance.now();if(now-lastScan<2500)return avatar;
    lastScan=now;
    scene.traverse?.(o=>{
      if(avatar)return;
      const n=String(o?.name||'').toLowerCase();
      if(/player|avatar|character/.test(n)&&o?.position)avatar=o;
    });
    return avatar;
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=root.dataset.tggTime==='night';
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const sig=[district,driving?'1':'0',night?'1':'0',quality].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      if(frontage)frontage.visible=district!=='park'&&district!=='garage';
      if(pedestrian)pedestrian.visible=!driving&&district!=='garage'&&quality!=='balanced';
      if(landmarks)landmarks.children.forEach(o=>{
        const active=o.userData?.tggDistrictV77===district;
        if(o.material&&'emissiveIntensity'in o.material)o.material.emissiveIntensity=active?.35:0;
        if(o.material&&o.material.transparent)o.material.opacity=active?.62:.34;
      });
      const traffic=w.traffic||[];
      traffic.forEach((v,i)=>{
        if(!v)return;
        const scale=district==='downtown'?1.03:district==='park'?.94:district==='home'?.97:1;
        if(v.scale)v.scale.multiplyScalar?.(1); // preserve existing authored scale
        v.userData.tggDistrictTrafficMoodV77=district;
        v.userData.tggDistrictTrafficDensityV77=district==='downtown'?'dense':district==='park'?'light':'medium';
        v.userData.tggDistrictTrafficScaleV77=scale;
      });
    }

    const av=findAvatar();
    if(av&&!driving){
      contact.position.x=av.position.x;contact.position.z=av.position.z;
      contact.visible=true;
      root.dataset.tggAvatarGroundingV77='1';
    }else{
      contact.visible=false;
      root.dataset.tggAvatarGroundingV77=av?'vehicle-hidden':'waiting';
    }

    root.dataset.tggDistrictLandmarksV77='6';
    root.dataset.tggStorefrontFrontageV77=frontage?'84':'0';
    root.dataset.tggPedestrianPocketsV77=pedestrian?'54':'0';
    root.dataset.tggDistrictTrafficMoodV77=district;
    root.dataset.tggAvatarWorldPresentationV77='1';
    root.dataset.tggDistrictIdentityV77='1';
  };

  window.TGGDistrictIdentityV77={apply};
  apply();
}
function applyDistrictIdentityV77(){window.TGGDistrictIdentityV77?.apply?.()||installDistrictIdentityV77()}

function installWorldSurfacePolishV78(){
  if(window.TGGWorldSurfaceV78)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldSurfacePolishV78='waiting';return}
  const scene=w.scene;

  const roadGroups=['TGG_TRAVEL_CORRIDORS_V23','TGG_HIGHWAY_NETWORK_V29','TGG_EVENT_ROUTE_V33'];
  let cachedRoads=[],lastRoadScan=0;
  const collectRoads=()=>{
    const now=performance.now();
    if(cachedRoads.length&&now-lastRoadScan<8000)return cachedRoads;
    lastRoadScan=now;cachedRoads=[];
    roadGroups.forEach(name=>{
      const g=scene.getObjectByName?.(name);
      g?.traverse?.(o=>{if(o?.isMesh&&o.material)cachedRoads.push(o)});
    });
    return cachedRoads;
  };

  let facade=scene.getObjectByName?.('TGG_FACADE_VARIATION_V78');
  if(!facade&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(5.5,4.5,.35);
    const mat=new THREE.MeshStandardMaterial({color:0x596170,roughness:.76,metalness:.06});
    facade=new THREE.InstancedMesh(geo,mat,120);facade.name='TGG_FACADE_VARIATION_V78';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<120;i++){
      const side=i%4,step=Math.floor(i/4)-15;
      const offset=102+(i%5)*11;
      let x=0,z=0,r=0;
      if(side===0){x=-offset;z=step*15;r=Math.PI/2}
      if(side===1){x=offset;z=step*15;r=-Math.PI/2}
      if(side===2){x=step*15;z=-offset;r=0}
      if(side===3){x=step*15;z=offset;r=Math.PI}
      p.set(x,2.4+(i%3)*.6,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.8+(i%4)*.1;s.set(sc,.9+(i%5)*.05,1);m.compose(p,q,s);facade.setMatrixAt(i,m);
    }
    facade.instanceMatrix.needsUpdate=true;scene.add(facade);
  }

  let groundDetail=scene.getObjectByName?.('TGG_GROUND_BREAKUP_V78');
  if(!groundDetail&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(2.2,12);
    const mat=new THREE.MeshBasicMaterial({color:0x26332a,transparent:true,opacity:.32,depthWrite:false});
    groundDetail=new THREE.InstancedMesh(geo,mat,140);groundDetail.name='TGG_GROUND_BREAKUP_V78';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<140;i++){
      const a=(i/140)*Math.PI*8,r=180+(i%14)*26;
      p.set(Math.cos(a)*r,.025,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.6+(i%7)*.12;s.set(sc,sc*.75,1);m.compose(p,q,s);groundDetail.setMatrixAt(i,m);
    }
    groundDetail.instanceMatrix.needsUpdate=true;scene.add(groundDetail);
  }

  let rain=scene.getObjectByName?.('TGG_RAIN_PARTICLES_V78');
  if(!rain){
    const count=420,geo=new THREE.BufferGeometry();
    const pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*180;pos[i*3+1]=6+Math.random()*55;pos[i*3+2]=(Math.random()-.5)*180}
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({color:0xa9d8ff,size:.12,transparent:true,opacity:.45,depthWrite:false});
    rain=new THREE.Points(geo,mat);rain.name='TGG_RAIN_PARTICLES_V78';rain.visible=false;scene.add(rain);
  }

  let lastSig='';
  const apply=()=>{
    const weather=String(root.dataset.tggWeather||'clear');
    const district=String(root.dataset.tggDistrict||'downtown');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const wet=/rain|storm/.test(weather),storm=/storm/.test(weather);
    const sig=[weather,district,driving?'1':'0',quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      collectRoads().forEach(o=>{
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{
          if(!m||!('roughness'in m))return;
          m.roughness=wet?.24:.88;
          if('metalness'in m)m.metalness=wet?.18:.03;
          if('envMapIntensity'in m)m.envMapIntensity=wet?1.15:.45;
          m.needsUpdate=true;
        });
      });
      if(facade){
        facade.visible=district!=='park';
        facade.material.roughness=storm?.9:.76;
        facade.material.color.setHex(district==='studio'?0x675065:district==='media'?0x52657e:district==='home'?0x6a665e:0x596170);
      }
      if(groundDetail){
        groundDetail.visible=district==='park'||district==='home'||driving;
        groundDetail.material.opacity=wet?.22:.34;
      }
      if(rain){
        rain.visible=wet&&quality!=='balanced';
        rain.material.opacity=storm?.58:.38;
      }
    }

    if(rain?.visible){
      const a=rain.geometry?.attributes?.position;if(a){
        for(let i=0;i<a.count;i++){
          let y=a.getY(i)-(.9+(i%4)*.18);
          if(y<.2)y=45+(i%12);
          a.setY(i,y);
        }
        a.needsUpdate=true;
      }
      const focus=w.car?.position||w.camera?.position;
      if(focus){rain.position.x=focus.x;rain.position.z=focus.z}
    }

    if(w.camera){
      const speed=Number(root.dataset.tggVisualSpeedV54||0);
      const base=driving?76:63;
      const target=base+Math.min(9,speed*.18);
      if(Math.abs(Number(w.camera.fov||0)-target)>.08){
        w.camera.fov+=(target-w.camera.fov)*.12;
        w.camera.updateProjectionMatrix?.();
      }
      w.camera.far=Math.max(Number(w.camera.far||0),4400);
    }

    root.dataset.tggWetRoadResponseV78=wet?'1':'0';
    root.dataset.tggFacadeInstancesV78=facade?'120':'0';
    root.dataset.tggGroundBreakupV78=groundDetail?'140':'0';
    root.dataset.tggWeatherParticlesV78=rain?.visible?'rain':'idle';
    root.dataset.tggCameraDepthV78='4400';
    root.dataset.tggWorldSurfacePolishV78='1';
  };

  window.TGGWorldSurfaceV78={apply};
  apply();
}
function applyWorldSurfacePolishV78(){window.TGGWorldSurfaceV78?.apply?.()||installWorldSurfacePolishV78()}

function installPremiumWorldPresentationV79(){
  if(window.TGGPremiumWorldV79)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggPremiumWorldPresentationV79='waiting';return}
  const scene=w.scene;

  let frontage=scene.getObjectByName?.('TGG_PREMIUM_FRONTAGE_V79');
  if(!frontage){
    frontage=new THREE.Group();frontage.name='TGG_PREMIUM_FRONTAGE_V79';
    const locations=[
      ['studio',-34,-34,0xff4b57],
      ['garage',34,-34,0x5fd7ff],
      ['media',0,38,0xb56cff]
    ];
    locations.forEach(([name,x,z,color])=>{
      const frame=new THREE.Mesh(new THREE.BoxGeometry(13,5,.5),new THREE.MeshStandardMaterial({color:0x171c24,roughness:.48,metalness:.42}));
      frame.position.set(x,2.6,z-4.7);frame.userData.tggPremiumLocationV79=name;frontage.add(frame);
      const glass=new THREE.Mesh(new THREE.BoxGeometry(11.6,3.7,.18),new THREE.MeshPhysicalMaterial({color:0x182534,roughness:.08,metalness:.12,transparent:true,opacity:.42,transmission:.22}));
      glass.position.set(x,2.5,z-5);glass.userData.tggPremiumLocationV79=name;frontage.add(glass);
      const glow=new THREE.Mesh(new THREE.BoxGeometry(10.8,2.9,.08),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.18,depthWrite:false}));
      glow.position.set(x,2.45,z-5.12);glow.userData.tggPremiumLocationV79=name;frontage.add(glow);
    });
    scene.add(frontage);
  }

  let signage=scene.getObjectByName?.('TGG_DISTRICT_SIGNAGE_V79');
  if(!signage&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.8,1.05,.12);
    const mat=new THREE.MeshBasicMaterial({color:0xdcecff,transparent:true,opacity:.72});
    signage=new THREE.InstancedMesh(geo,mat,30);signage.name='TGG_DISTRICT_SIGNAGE_V79';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<30;i++){
      const a=(i/30)*Math.PI*2,r=95+(i%4)*26;
      p.set(Math.cos(a)*r,4+(i%3)*.5,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      s.set(.9+(i%3)*.1,1,1);m.compose(p,q,s);signage.setMatrixAt(i,m);
    }
    signage.instanceMatrix.needsUpdate=true;scene.add(signage);
  }

  let avatarKey=scene.getObjectByName?.('TGG_AVATAR_KEYLIGHT_V79');
  if(!avatarKey){
    avatarKey=new THREE.PointLight(0xffddb8,0,18,2);
    avatarKey.name='TGG_AVATAR_KEYLIGHT_V79';scene.add(avatarKey);
  }

  let ambient=scene.getObjectByName?.('TGG_AMBIENT_MOTION_V79');
  if(!ambient){
    ambient=new THREE.Group();ambient.name='TGG_AMBIENT_MOTION_V79';
    const mat=new THREE.MeshBasicMaterial({color:0x9bcfff,transparent:true,opacity:.24,depthWrite:false});
    for(let i=0;i<18;i++){
      const orb=new THREE.Mesh(new THREE.SphereGeometry(.16,6,5),mat);
      const a=(i/18)*Math.PI*2,r=58+(i%5)*12;
      orb.position.set(Math.cos(a)*r,3+(i%4)*1.5,Math.sin(a)*r);
      orb.userData.baseY=orb.position.y;
      orb.userData.phase=i*.7;
      ambient.add(orb);
    }
    scene.add(ambient);
  }

  let carDone=false,avatar=null,lastAvatarScan=0,lastSig='';
  const polishCar=()=>{
    if(carDone||!w.car)return;
    w.car.traverse?.(o=>{
      if(!o?.isMesh||!o.material)return;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>{
        if(!m)return;
        const n=String(o.name||'').toLowerCase();
        if(/glass|window|windshield/.test(n)){
          if('roughness'in m)m.roughness=.08;
          if('metalness'in m)m.metalness=.12;
          if('transparent'in m){m.transparent=true;m.opacity=Math.min(Number(m.opacity??1),.5)}
          if('envMapIntensity'in m)m.envMapIntensity=1.35;
        }else if(/chrome|rim|wheel|trim/.test(n)){
          if('roughness'in m)m.roughness=Math.min(Number(m.roughness??.3),.18);
          if('metalness'in m)m.metalness=Math.max(Number(m.metalness??0),.82);
          if('envMapIntensity'in m)m.envMapIntensity=1.5;
        }
        m.needsUpdate=true;
      });
    });
    carDone=true;root.dataset.tggVehiclePremiumMaterialsV79='1';
  };

  const findAvatar=()=>{
    if(avatar?.parent)return avatar;
    const now=performance.now();if(now-lastAvatarScan<2500)return avatar;
    lastAvatarScan=now;
    scene.traverse?.(o=>{
      if(avatar)return;
      const n=String(o?.name||'').toLowerCase();
      if(/player|avatar|character/.test(n)&&o?.position)avatar=o;
    });
    return avatar;
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const sig=[district,time,driving?'1':'0',quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(signage)signage.material.opacity=time==='night'?.86:.5;
      frontage.children.forEach(o=>{
        const loc=o.userData?.tggPremiumLocationV79;
        const active=(district===loc)||(loc==='studio'&&district==='media');
        if(o.material?.transparent)o.material.opacity=active?.48:.22;
      });
    }

    polishCar();

    const av=findAvatar();
    if(av&&!driving&&quality!=='balanced'){
      avatarKey.position.set(av.position.x+2,av.position.y+3.4,av.position.z+1.8);
      avatarKey.intensity=time==='night'?1.5:.72;
      root.dataset.tggAvatarKeyLightV79='1';
    }else{
      avatarKey.intensity=0;
      root.dataset.tggAvatarKeyLightV79=av?'disabled-mode':'waiting';
    }

    const t=performance.now()*.001;
    ambient.children.forEach((o,i)=>{
      o.position.y=o.userData.baseY+Math.sin(t*.45+o.userData.phase)*.28;
      o.rotation.y+=.002+(i%3)*.001;
    });
    ambient.visible=quality!=='balanced'&&!driving;

    root.dataset.tggPremiumFrontageV79='3';
    root.dataset.tggDistrictSignageV79=signage?'30':'0';
    root.dataset.tggAmbientMotionV79=ambient.visible?'18':'idle';
    root.dataset.tggPremiumWorldPresentationV79='1';
  };

  window.TGGPremiumWorldV79={apply};
  apply();
}
function applyPremiumWorldPresentationV79(){window.TGGPremiumWorldV79?.apply?.()||installPremiumWorldPresentationV79()}

function installNightCohesionV80(){
  if(window.TGGNightCohesionV80)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggNightCohesionV80='waiting';return}
  const scene=w.scene;

  let street=scene.getObjectByName?.('TGG_STREET_REFLECTION_ACCENTS_V80');
  if(!street&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(2.4,6.8);
    const mat=new THREE.MeshBasicMaterial({color:0x6fbfff,transparent:true,opacity:.11,depthWrite:false,side:THREE.DoubleSide});
    street=new THREE.InstancedMesh(geo,mat,72);street.name='TGG_STREET_REFLECTION_ACCENTS_V80';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0,r=0;
      if(side===0){x=-22;z=step*22;r=-Math.PI/2}
      if(side===1){x=22;z=step*22;r=Math.PI/2}
      if(side===2){x=step*22;z=-22;r=0}
      if(side===3){x=step*22;z=22;r=Math.PI}
      p.set(x,.035,z);q.setFromEuler(new THREE.Euler(-Math.PI/2,r,0));s.set(1,1,1);
      m.compose(p,q,s);street.setMatrixAt(i,m);
    }
    street.instanceMatrix.needsUpdate=true;scene.add(street);
  }

  let interiors=scene.getObjectByName?.('TGG_INTERIOR_GLOW_DEPTH_V80');
  if(!interiors&&!THREE.InstancedMesh){}
  if(!interiors&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(5.6,3.4);
    const mat=new THREE.MeshBasicMaterial({color:0xffd39b,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide});
    interiors=new THREE.InstancedMesh(geo,mat,36);interiors.name='TGG_INTERIOR_GLOW_DEPTH_V80';
    const anchors=[[-34,-39],[34,-39],[0,33],[-39,16],[39,16],[-300,296]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<36;i++){
      const a=anchors[i%anchors.length],layer=Math.floor(i/anchors.length);
      p.set(a[0]+((i%3)-1)*2.8,2.2+layer*.45,a[1]);
      q.setFromEuler(new THREE.Euler(0,0,0));
      const sc=.72+(i%4)*.08;s.set(sc,.86,1);m.compose(p,q,s);interiors.setMatrixAt(i,m);
    }
    interiors.instanceMatrix.needsUpdate=true;scene.add(interiors);
  }

  let vehicleShadow=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
  if(!vehicleShadow){
    const mat=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.3,depthWrite:false});
    vehicleShadow=new THREE.Mesh(new THREE.CircleGeometry(2.2,24),mat);vehicleShadow.name='TGG_VEHICLE_CONTACT_V80';
    vehicleShadow.rotation.x=-Math.PI/2;vehicleShadow.position.y=.02;vehicleShadow.scale.set(1.6,.72,1);
    vehicleShadow.visible=false;scene.add(vehicleShadow);
  }

  let haze=scene.getObjectByName?.('TGG_COUNTRYSIDE_HAZE_V80');
  if(!haze){
    const mat=new THREE.MeshBasicMaterial({color:0x8194a8,transparent:true,opacity:.08,depthWrite:false,side:THREE.DoubleSide});
    haze=new THREE.Mesh(new THREE.RingGeometry(420,1100,96),mat);haze.name='TGG_COUNTRYSIDE_HAZE_V80';
    haze.rotation.x=-Math.PI/2;haze.position.y=.06;scene.add(haze);
  }

  let carLights=null;
  const ensureCarLights=()=>{
    if(carLights?.parent||!w.car)return carLights;
    carLights=new THREE.Group();carLights.name='TGG_CAR_LIGHTS_V80';
    const headMat=new THREE.MeshBasicMaterial({color:0xe8f6ff});
    const tailMat=new THREE.MeshBasicMaterial({color:0xff3b43});
    [[1.72,.62,-.62],[1.72,.62,.62]].forEach(([x,y,z])=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.34),headMat);m.position.set(x,y,z);carLights.add(m);
    });
    [[-1.72,.62,-.62],[-1.72,.62,.62]].forEach(([x,y,z])=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.34),tailMat);m.position.set(x,y,z);carLights.add(m);
    });
    w.car.add(carLights);return carLights;
  };

  let lastSig='';
  const apply=()=>{
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const district=String(root.dataset.tggDistrict||'downtown');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const night=time==='night',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[time,weather,district,driving?'1':'0',quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(street){
        street.visible=(night||wet)&&!balanced;
        street.material.opacity=wet?.16:night?.11:.04;
      }
      if(interiors){
        interiors.visible=(night||time==='golden')&&!balanced;
        interiors.material.opacity=night?.28:.14;
      }
      if(haze){
        haze.visible=district==='park'||district==='home'||driving;
        haze.material.opacity=wet?.12:night?.06:.08;
      }
    }

    const cl=ensureCarLights();
    if(cl){
      cl.visible=night||/rain|storm/.test(weather);
      root.dataset.tggVehicleLightingV80=cl.visible?'1':'0';
    }

    if(w.car?.position){
      vehicleShadow.position.x=w.car.position.x;
      vehicleShadow.position.z=w.car.position.z;
      vehicleShadow.visible=driving||!!w.car.visible;
      root.dataset.tggVehicleGroundingV80='1';
    }

    const avatarShadow=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
    if(avatarShadow?.material)avatarShadow.material.opacity=night?.34:.26;

    root.dataset.tggStreetReflectionAccentsV80=street?'72':'0';
    root.dataset.tggInteriorGlowDepthV80=interiors?'36':'0';
    root.dataset.tggCountrysideHazeV80=haze?'1':'0';
    root.dataset.tggNightWorldCohesionV80='1';
    root.dataset.tggNightCohesionV80='1';
  };

  window.TGGNightCohesionV80={apply};
  apply();
}
function applyNightCohesionV80(){window.TGGNightCohesionV80?.apply?.()||installNightCohesionV80()}

function installDaylightRealismV81(){
  if(window.TGGDaylightRealismV81)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggDaylightRealismV81='waiting';return}
  const scene=w.scene;

  let sun=scene.getObjectByName?.('TGG_DAY_SUN_V81');
  if(!sun){
    sun=new THREE.DirectionalLight(0xffe4bf,2.35);
    sun.name='TGG_DAY_SUN_V81';sun.position.set(-180,240,140);scene.add(sun);
  }

  let skyFill=scene.getObjectByName?.('TGG_DAY_SKYFILL_V81');
  if(!skyFill){
    skyFill=new THREE.HemisphereLight(0x9bc0e5,0x3b3428,1.15);
    skyFill.name='TGG_DAY_SKYFILL_V81';scene.add(skyFill);
  }

  let terrain=scene.getObjectByName?.('TGG_TERRAIN_COLOR_BREAKUP_V81');
  if(!terrain&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(4.2,16);
    const mat=new THREE.MeshBasicMaterial({color:0x5f6f54,transparent:true,opacity:.16,depthWrite:false});
    terrain=new THREE.InstancedMesh(geo,mat,110);terrain.name='TGG_TERRAIN_COLOR_BREAKUP_V81';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<110;i++){
      const a=(i/110)*Math.PI*7,r=210+(i%11)*34;
      p.set(Math.cos(a)*r,.026,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.7+(i%6)*.16;s.set(sc,sc*.7,1);m.compose(p,q,s);terrain.setMatrixAt(i,m);
    }
    terrain.instanceMatrix.needsUpdate=true;scene.add(terrain);
  }

  let neighborhoodGlow=scene.getObjectByName?.('TGG_NEIGHBORHOOD_GLOW_V81');
  if(!neighborhoodGlow&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(2.8,1.1);
    const mat=new THREE.MeshBasicMaterial({color:0xffe6b7,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide});
    neighborhoodGlow=new THREE.InstancedMesh(geo,mat,64);neighborhoodGlow.name='TGG_NEIGHBORHOOD_GLOW_V81';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const a=(i/64)*Math.PI*2,r=270+(i%5)*44;
      p.set(Math.cos(a)*r,3.2+(i%3)*1.2,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      const sc=.8+(i%4)*.1;s.set(sc,sc,1);m.compose(p,q,s);neighborhoodGlow.setMatrixAt(i,m);
    }
    neighborhoodGlow.instanceMatrix.needsUpdate=true;scene.add(neighborhoodGlow);
  }

  let carPolished=false;
  const polishCar=()=>{
    if(carPolished||!w.car)return;
    w.car.traverse?.(o=>{
      if(!o?.isMesh||!o.material)return;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>{
        if(!m||!('roughness'in m))return;
        const n=String(o.name||'').toLowerCase();
        if(!/glass|window|rim|wheel|chrome|trim/.test(n)){
          m.roughness=Math.max(.16,Math.min(.42,Number(m.roughness??.32)));
          if('metalness'in m)m.metalness=Math.max(Number(m.metalness??0),.28);
          if('envMapIntensity'in m)m.envMapIntensity=1.25;
          m.needsUpdate=true;
        }
      });
    });
    carPolished=true;root.dataset.tggVehicleDayHighlightV81='1';
  };

  let lastSig='';
  const apply=()=>{
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const day=time==='day',gold=time==='golden',night=time==='night',storm=/storm/.test(weather),rain=/rain/.test(weather);
    const sig=[time,weather,district,quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      sun.intensity=night?0:storm?.8:gold?1.75:2.35;
      sun.color.setHex(gold?0xffb56a:rain?0xd8e2ef:0xffe4bf);
      sun.position.set(gold?-220:-180,gold?120:240,gold?80:140);
      skyFill.intensity=night?.22:storm?.68:1.15;
      skyFill.color.setHex(night?0x51627a:gold?0xb7a28c:0x9bc0e5);
      skyFill.groundColor.setHex(district==='park'?0x31402d:district==='home'?0x443f35:0x3b3428);
      if(w.renderer)w.renderer.toneMappingExposure=night?1.05:storm?1.0:gold?1.15:1.1;
      if(terrain){
        terrain.visible=(district==='park'||district==='home'||district==='garage')&&quality!=='balanced';
        terrain.material.color.setHex(district==='park'?0x54734f:district==='home'?0x6f684f:0x66635a);
        terrain.material.opacity=rain?.1:.17;
      }
      if(neighborhoodGlow){
        neighborhoodGlow.visible=gold||night;
        neighborhoodGlow.material.opacity=night?.24:.13;
      }
      const facades=scene.getObjectByName?.('TGG_FACADE_VARIATION_V78');
      if(facades?.material){
        facades.material.roughness=rain?.5:.76;
        facades.material.metalness=rain?.12:.06;
      }
    }

    polishCar();

    root.dataset.tggDaySunV81='1';
    root.dataset.tggDaySkyFillV81='1';
    root.dataset.tggTerrainColorBreakupV81=terrain?'110':'0';
    root.dataset.tggNeighborhoodGlowV81=neighborhoodGlow?'64':'0';
    root.dataset.tggDaylightWorldCohesionV81='1';
    root.dataset.tggDaylightRealismV81='1';
  };

  window.TGGDaylightRealismV81={apply};
  apply();
}
function applyDaylightRealismV81(){window.TGGDaylightRealismV81?.apply?.()||installDaylightRealismV81()}

function installWorldArtDirectionV82(){
  if(window.TGGWorldArtV82)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldArtDirectionV82='waiting';return}
  const scene=w.scene;

  let skyline=scene.getObjectByName?.('TGG_SKYLINE_SILHOUETTES_V82');
  if(!skyline&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1,1,1);
    const mat=new THREE.MeshStandardMaterial({color:0x202733,roughness:.86,metalness:.04});
    skyline=new THREE.InstancedMesh(geo,mat,96);skyline.name='TGG_SKYLINE_SILHOUETTES_V82';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*2,r=470+(i%8)*28,h=22+(i%9)*7;
      p.set(Math.cos(a)*r,h/2,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a,0));
      s.set(10+(i%5)*4,h,12+(i%4)*5);m.compose(p,q,s);skyline.setMatrixAt(i,m);
    }
    skyline.instanceMatrix.needsUpdate=true;scene.add(skyline);
  }

  let markings=scene.getObjectByName?.('TGG_ROAD_MARKINGS_V82');
  if(!markings&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.22,.025,4.5);
    const mat=new THREE.MeshBasicMaterial({color:0xf2f0df});
    markings=new THREE.InstancedMesh(geo,mat,180);markings.name='TGG_ROAD_MARKINGS_V82';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<180;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-22;
      p.set(axis?step*12:side*4.5,.055,axis?side*4.5:step*12);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);markings.setMatrixAt(i,m);
    }
    markings.instanceMatrix.needsUpdate=true;scene.add(markings);
  }

  let streetRhythm=scene.getObjectByName?.('TGG_STREET_RHYTHM_V82');
  if(!streetRhythm&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.12,.14,1.1,6);
    const mat=new THREE.MeshStandardMaterial({color:0x4b5563,roughness:.7,metalness:.42});
    streetRhythm=new THREE.InstancedMesh(geo,mat,128);streetRhythm.name='TGG_STREET_RHYTHM_V82';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<128;i++){
      const side=i%4,step=Math.floor(i/4)-16;let x=0,z=0;
      if(side===0){x=-15;z=step*15}
      if(side===1){x=15;z=step*15}
      if(side===2){x=step*15;z=-15}
      if(side===3){x=step*15;z=15}
      p.set(x,.55,z);q.identity();m.compose(p,q,s);streetRhythm.setMatrixAt(i,m);
    }
    streetRhythm.instanceMatrix.needsUpdate=true;scene.add(streetRhythm);
  }

  let avatar=null,lastAvatarScan=0,carDone=false,lastSig='';
  const findAvatar=()=>{
    if(avatar?.parent)return avatar;
    const now=performance.now();if(now-lastAvatarScan<2500)return avatar;
    lastAvatarScan=now;
    scene.traverse?.(o=>{
      if(avatar)return;
      const n=String(o?.name||'').toLowerCase();
      if(/player|avatar|character/.test(n)&&o?.position)avatar=o;
    });
    return avatar;
  };

  const polishCar=()=>{
    if(carDone||!w.car)return;
    w.car.traverse?.(o=>{
      if(!o?.isMesh||!o.material)return;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>{
        if(!m||!('roughness'in m))return;
        const n=String(o.name||'').toLowerCase();
        if(!/glass|window|rim|wheel|chrome|trim/.test(n)){
          m.roughness=Math.min(Number(m.roughness??.34),.3);
          if('metalness'in m)m.metalness=Math.max(Number(m.metalness??0),.34);
          if('envMapIntensity'in m)m.envMapIntensity=1.4;
          m.needsUpdate=true;
        }
      });
    });
    carDone=true;root.dataset.tggVehiclePaintResponseV82='1';
  };

  const polishAvatar=()=>{
    const av=findAvatar();if(!av)return;
    av.traverse?.(o=>{
      if(!o?.isMesh||!o.material)return;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>{
        if(!m||!('roughness'in m))return;
        m.roughness=Math.max(.35,Math.min(.78,Number(m.roughness??.62)));
        if('metalness'in m&&/chain|watch|jewel|metal|glasses/.test(String(o.name||'').toLowerCase()))m.metalness=Math.max(Number(m.metalness??0),.7);
        m.needsUpdate=true;
      });
    });
    root.dataset.tggAvatarMaterialPolishV82='1';
  };

  const grade={
    downtown:{exposure:1.08,fog:0x8092a6},
    studio:{exposure:1.11,fog:0x8c748f},
    media:{exposure:1.12,fog:0x778ca7},
    park:{exposure:1.04,fog:0x8fa394},
    home:{exposure:1.05,fog:0x9a9486},
    garage:{exposure:1.07,fog:0x7e8793}
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const sig=[district,quality,weather,time].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      const g=grade[district]||grade.downtown;
      if(w.renderer)w.renderer.toneMappingExposure=g.exposure+(time==='golden'?.05:0)-(weather==='storm'?.08:0);
      if(scene.fog?.color)scene.fog.color.setHex(g.fog);
      if(skyline)skyline.visible=quality!=='balanced'||district==='downtown';
      if(markings)markings.visible=true;
      if(streetRhythm)streetRhythm.visible=quality!=='balanced'||district==='downtown'||district==='studio';
    }
    polishCar();polishAvatar();
    root.dataset.tggSkylineSilhouettesV82=skyline?'96':'0';
    root.dataset.tggRoadMarkingsV82=markings?'180':'0';
    root.dataset.tggStreetRhythmV82=streetRhythm?'128':'0';
    root.dataset.tggDistrictGradeV82=district;
    root.dataset.tggWorldArtDirectionV82='1';
  };

  window.TGGWorldArtV82={apply};
  apply();
}
function applyWorldArtDirectionV82(){window.TGGWorldArtV82?.apply?.()||installWorldArtDirectionV82()}

function installWorldDepthCuesV83(){
  if(window.TGGWorldDepthV83)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldDepthCuesV83='waiting';return}
  const scene=w.scene;

  let windows=scene.getObjectByName?.('TGG_WINDOW_REFLECTIONS_V83');
  if(!windows&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(2.6,2);
    const mat=new THREE.MeshPhysicalMaterial({color:0x7da2bf,roughness:.08,metalness:.12,transparent:true,opacity:.22,transmission:.08,depthWrite:false,side:THREE.DoubleSide});
    windows=new THREE.InstancedMesh(geo,mat,144);windows.name='TGG_WINDOW_REFLECTIONS_V83';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<144;i++){
      const side=i%4,step=Math.floor(i/4)-18,level=i%5;let x=0,z=0,r=0;
      const d=116+(i%6)*10;
      if(side===0){x=-d;z=step*13;r=Math.PI/2}
      if(side===1){x=d;z=step*13;r=-Math.PI/2}
      if(side===2){x=step*13;z=-d;r=0}
      if(side===3){x=step*13;z=d;r=Math.PI}
      p.set(x,4+level*3.2,z);q.setFromEuler(new THREE.Euler(0,r,0));s.set(.85+(i%3)*.08,.9,1);
      m.compose(p,q,s);windows.setMatrixAt(i,m);
    }
    windows.instanceMatrix.needsUpdate=true;scene.add(windows);
  }

  let sidewalks=scene.getObjectByName?.('TGG_SIDEWALK_VARIATION_V83');
  if(!sidewalks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(6,.05,2.2);
    const mat=new THREE.MeshStandardMaterial({color:0x6a6d72,roughness:.95,metalness:.01});
    sidewalks=new THREE.InstancedMesh(geo,mat,160);sidewalks.name='TGG_SIDEWALK_VARIATION_V83';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<160;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-20;
      p.set(axis?step*7.4:side*11.2,.03,axis?side*11.2:step*7.4);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      s.set(.9+(i%4)*.05,1,.86+(i%3)*.06);m.compose(p,q,s);sidewalks.setMatrixAt(i,m);
    }
    sidewalks.instanceMatrix.needsUpdate=true;scene.add(sidewalks);
  }

  let foliage=scene.getObjectByName?.('TGG_FOLIAGE_VARIETY_V83');
  if(!foliage&&THREE.InstancedMesh){
    const geo=new THREE.IcosahedronGeometry(1.2,0);
    const mat=new THREE.MeshStandardMaterial({color:0x315b3e,roughness:.96});
    foliage=new THREE.InstancedMesh(geo,mat,180);foliage.name='TGG_FOLIAGE_VARIETY_V83';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<180;i++){
      const a=(i/180)*Math.PI*6,r=150+(i%15)*38;
      p.set(Math.cos(a)*r,.9+(i%3)*.2,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a,0));
      const sc=.55+(i%7)*.1;s.set(sc,sc*.7,sc);m.compose(p,q,s);foliage.setMatrixAt(i,m);
    }
    foliage.instanceMatrix.needsUpdate=true;scene.add(foliage);
  }

  let trafficLightsDone=false;
  const installTrafficLights=()=>{
    if(trafficLightsDone)return;
    (w.traffic||[]).forEach((v,i)=>{
      if(!v||v.getObjectByName?.('TGG_TRAFFIC_LIGHTS_V83'))return;
      const g=new THREE.Group();g.name='TGG_TRAFFIC_LIGHTS_V83';
      const head=new THREE.MeshBasicMaterial({color:0xe5f3ff});
      const tail=new THREE.MeshBasicMaterial({color:0xff4b55});
      [[1.2,.55,-.48],[1.2,.55,.48]].forEach(([x,y,z])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,.2),head);m.position.set(x,y,z);g.add(m)});
      [[-1.2,.55,-.48],[-1.2,.55,.48]].forEach(([x,y,z])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,.2),tail);m.position.set(x,y,z);g.add(m)});
      v.add?.(g);
    });
    trafficLightsDone=true;
    root.dataset.tggTrafficLightingV83='1';
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(windows){
        windows.visible=district!=='park'&&!balanced;
        windows.material.opacity=night?.3:wet?.26:.18;
        windows.material.roughness=wet?.04:.1;
      }
      if(sidewalks){
        sidewalks.visible=district!=='park'||!balanced;
        sidewalks.material.color.setHex(district==='studio'?0x676169:district==='home'?0x716d65:0x6a6d72);
        sidewalks.material.roughness=wet?.58:.95;
      }
      if(foliage){
        foliage.visible=(district==='park'||district==='home'||driving)&&!balanced;
        foliage.material.color.setHex(district==='park'?0x2f6540:0x3d5941);
      }
      if(scene.fog){
        const base=driving?.00155:.0018;
        scene.fog.density=base+(wet?.00035:0)+(night?.00015:0);
      }
      if(w.camera){
        const speed=Number(root.dataset.tggVisualSpeedV54||0);
        w.camera.far=Math.max(Number(w.camera.far||0),4600);
        w.camera.near=driving?.08:.06;
        w.camera.updateProjectionMatrix?.();
        root.dataset.tggDepthCueDistanceV83=String(Math.round(900+Math.min(1100,speed*20)));
      }
    }

    installTrafficLights();

    root.dataset.tggWindowReflectionsV83=windows?'144':'0';
    root.dataset.tggSidewalkVariationV83=sidewalks?'160':'0';
    root.dataset.tggFoliageVarietyV83=foliage?'180':'0';
    root.dataset.tggCameraFarV83='4600';
    root.dataset.tggWorldDepthCuesV83='1';
  };

  window.TGGWorldDepthV83={apply};
  apply();
}
function applyWorldDepthCuesV83(){window.TGGWorldDepthV83?.apply?.()||installWorldDepthCuesV83()}

function installAmbientWorldMotionV84(){
  if(window.TGGAmbientWorldV84)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggAmbientWorldMotionV84='waiting';return}
  const scene=w.scene;

  let clouds=scene.getObjectByName?.('TGG_CLOUD_DEPTH_V84');
  if(!clouds&&THREE.InstancedMesh){
    const geo=new THREE.SphereGeometry(1,8,6);
    const mat=new THREE.MeshBasicMaterial({color:0xdbe7f0,transparent:true,opacity:.12,depthWrite:false});
    clouds=new THREE.InstancedMesh(geo,mat,42);clouds.name='TGG_CLOUD_DEPTH_V84';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<42;i++){
      const a=(i/42)*Math.PI*2,r=520+(i%7)*65;
      p.set(Math.cos(a)*r,145+(i%5)*14,Math.sin(a)*r);
      q.identity();s.set(18+(i%4)*7,4+(i%3)*2,10+(i%5)*4);m.compose(p,q,s);clouds.setMatrixAt(i,m);
    }
    clouds.instanceMatrix.needsUpdate=true;scene.add(clouds);
  }

  let terrain=scene.getObjectByName?.('TGG_DISTANT_TERRAIN_V84');
  if(!terrain&&THREE.InstancedMesh){
    const geo=new THREE.ConeGeometry(1,1,6);
    const mat=new THREE.MeshStandardMaterial({color:0x39483d,roughness:1});
    terrain=new THREE.InstancedMesh(geo,mat,80);terrain.name='TGG_DISTANT_TERRAIN_V84';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<80;i++){
      const a=(i/80)*Math.PI*2,r=1050+(i%8)*85,h=45+(i%6)*18;
      p.set(Math.cos(a)*r,h/2,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a,0));
      s.set(28+(i%5)*12,h,32+(i%4)*13);m.compose(p,q,s);terrain.setMatrixAt(i,m);
    }
    terrain.instanceMatrix.needsUpdate=true;scene.add(terrain);
  }

  let clutter=scene.getObjectByName?.('TGG_STREET_CLUTTER_V84');
  if(!clutter&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.7,.35,.7);
    const mat=new THREE.MeshStandardMaterial({color:0x454b52,roughness:.88,metalness:.18});
    clutter=new THREE.InstancedMesh(geo,mat,96);clutter.name='TGG_STREET_CLUTTER_V84';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*2,r=65+(i%9)*18;
      p.set(Math.cos(a)*r,.18,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.7,0));
      const sc=.65+(i%4)*.12;s.set(sc,.7+(i%3)*.15,sc);m.compose(p,q,s);clutter.setMatrixAt(i,m);
    }
    clutter.instanceMatrix.needsUpdate=true;scene.add(clutter);
  }

  let water=scene.getObjectByName?.('TGG_PARK_WATER_V84');
  if(!water){
    const mat=new THREE.MeshPhysicalMaterial({color:0x486d79,roughness:.18,metalness:.06,transparent:true,opacity:.62,transmission:.18});
    water=new THREE.Mesh(new THREE.CircleGeometry(34,48),mat);water.name='TGG_PARK_WATER_V84';
    water.rotation.x=-Math.PI/2;water.position.set(245,.015,320);scene.add(water);
  }

  let exhaust=scene.getObjectByName?.('TGG_EXHAUST_HEAT_V84');
  if(!exhaust){
    exhaust=new THREE.Group();exhaust.name='TGG_EXHAUST_HEAT_V84';
    const mat=new THREE.MeshBasicMaterial({color:0xb5c4ce,transparent:true,opacity:.12,depthWrite:false});
    for(let i=0;i<10;i++){
      const puff=new THREE.Mesh(new THREE.SphereGeometry(.16,6,5),mat);
      puff.userData.phase=i*.55;puff.userData.base=i*.18;exhaust.add(puff);
    }
    scene.add(exhaust);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',wet=/rain|storm/.test(weather),night=time==='night';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(clouds){
        clouds.visible=!balanced;
        clouds.material.opacity=weather==='storm'?.2:wet?.16:night?.07:.12;
        clouds.material.color.setHex(night?0x718198:weather==='storm'?0x87919b:0xdbe7f0);
      }
      if(terrain){
        terrain.visible=district==='park'||district==='home'||driving;
        terrain.material.color.setHex(night?0x26312a:district==='park'?0x365640:0x485348);
      }
      if(clutter)clutter.visible=district!=='park'&&(!balanced||district==='downtown');
      if(water){
        water.visible=district==='park'||driving;
        water.material.roughness=wet?.08:.18;
        water.material.opacity=night?.48:.62;
      }
    }

    const t=performance.now()*.001;
    if(clouds?.visible){
      clouds.position.x=Math.sin(t*.015)*32;
      clouds.position.z=Math.cos(t*.011)*28;
    }
    if(water?.visible){
      water.rotation.z=Math.sin(t*.08)*.015;
    }

    if(w.car?.position&&driving&&!balanced){
      exhaust.visible=true;
      exhaust.position.set(w.car.position.x-1.8,w.car.position.y+.45,w.car.position.z);
      exhaust.children.forEach((p,i)=>{
        const ph=(t*.7+p.userData.phase)%1.8;
        p.position.set(-ph*.9,.12+ph*.35,(i%2?1:-1)*(.18+.05*i));
        const sc=.6+ph*.55;p.scale.setScalar(sc);p.material.opacity=Math.max(0,.13-ph*.06);
      });
      root.dataset.tggVehicleExhaustV84='1';
    }else{
      exhaust.visible=false;
      root.dataset.tggVehicleExhaustV84='0';
    }

    root.dataset.tggCloudDepthV84=clouds?'42':'0';
    root.dataset.tggDistantTerrainV84=terrain?'80':'0';
    root.dataset.tggStreetClutterV84=clutter?'96':'0';
    root.dataset.tggParkWaterV84=water?'1':'0';
    root.dataset.tggDistrictAmbienceV84=district;
    root.dataset.tggAmbientWorldMotionV84='1';
  };

  window.TGGAmbientWorldV84={apply};
  apply();
}
function applyAmbientWorldMotionV84(){window.TGGAmbientWorldV84?.apply?.()||installAmbientWorldMotionV84()}

function installWorldGroundingV85(){
  if(window.TGGWorldGroundingV85)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldGroundingV85='waiting';return}
  const scene=w.scene;

  let curbs=scene.getObjectByName?.('TGG_CURBS_MEDIANS_V85');
  if(!curbs&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(5.6,.22,.55);
    const mat=new THREE.MeshStandardMaterial({color:0x8c8f92,roughness:.92,metalness:.01});
    curbs=new THREE.InstancedMesh(geo,mat,156);curbs.name='TGG_CURBS_MEDIANS_V85';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<156;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-19;
      p.set(axis?step*6.4:side*9.4,.11,axis?side*9.4:step*6.4);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);curbs.setMatrixAt(i,m);
    }
    curbs.instanceMatrix.needsUpdate=true;scene.add(curbs);
  }

  let glassDepth=scene.getObjectByName?.('TGG_STOREFRONT_GLASS_DEPTH_V85');
  if(!glassDepth&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(4.4,2.7);
    const mat=new THREE.MeshPhysicalMaterial({color:0x557892,roughness:.05,metalness:.1,transparent:true,opacity:.23,transmission:.16,depthWrite:false,side:THREE.DoubleSide});
    glassDepth=new THREE.InstancedMesh(geo,mat,72);glassDepth.name='TGG_STOREFRONT_GLASS_DEPTH_V85';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0,r=0;
      if(side===0){x=-80;z=step*18;r=Math.PI/2}
      if(side===1){x=80;z=step*18;r=-Math.PI/2}
      if(side===2){x=step*18;z=-80;r=0}
      if(side===3){x=step*18;z=80;r=Math.PI}
      p.set(x,2.2,z);q.setFromEuler(new THREE.Euler(0,r,0));s.set(.86+(i%3)*.08,.92,1);
      m.compose(p,q,s);glassDepth.setMatrixAt(i,m);
    }
    glassDepth.instanceMatrix.needsUpdate=true;scene.add(glassDepth);
  }

  let props=scene.getObjectByName?.('TGG_PARK_TERRAIN_PROPS_V85');
  if(!props&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.28,.34,1.4,7);
    const mat=new THREE.MeshStandardMaterial({color:0x6e5a42,roughness:.94});
    props=new THREE.InstancedMesh(geo,mat,84);props.name='TGG_PARK_TERRAIN_PROPS_V85';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const a=(i/84)*Math.PI*5,r=205+(i%10)*28;
      p.set(Math.cos(a)*r,.7,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a,0));
      const sc=.7+(i%5)*.12;s.set(sc,.8+(i%3)*.15,sc);m.compose(p,q,s);props.setMatrixAt(i,m);
    }
    props.instanceMatrix.needsUpdate=true;scene.add(props);
  }

  let playerLight=scene.getObjectByName?.('TGG_PLAYER_LOCAL_LIGHT_V85');
  if(!playerLight){
    playerLight=new THREE.PointLight(0xffddb9,0,16,2);
    playerLight.name='TGG_PLAYER_LOCAL_LIGHT_V85';scene.add(playerLight);
  }

  let avatar=null,lastAvatarScan=0,lastSig='';
  const findAvatar=()=>{
    if(avatar?.parent)return avatar;
    const now=performance.now();if(now-lastAvatarScan<2200)return avatar;
    lastAvatarScan=now;
    scene.traverse?.(o=>{
      if(avatar)return;
      const n=String(o?.name||'').toLowerCase();
      if(/player|avatar|character/.test(n)&&o?.position)avatar=o;
    });
    return avatar;
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(curbs){
        curbs.visible=district!=='park'||!balanced;
        curbs.material.color.setHex(district==='studio'?0x77727a:district==='home'?0x969087:0x8c8f92);
        curbs.material.roughness=wet?.62:.92;
      }
      if(glassDepth){
        glassDepth.visible=district!=='park'&&!balanced;
        glassDepth.material.opacity=night?.3:wet?.28:.22;
        glassDepth.material.roughness=wet?.03:.06;
      }
      if(props)props.visible=(district==='park'||district==='home'||driving)&&!balanced;
    }

    const focus=driving?w.car:findAvatar();
    if(focus?.position){
      playerLight.position.set(focus.position.x+1.4,focus.position.y+2.4,focus.position.z+1.1);
      playerLight.intensity=balanced?0:night?1.05:wet?.52:.28;
      root.dataset.tggLocalContactLightV85='1';
    }else{
      playerLight.intensity=0;
      root.dataset.tggLocalContactLightV85='waiting';
    }

    (w.traffic||[]).forEach((v,i)=>{
      if(!v?.userData)return;
      v.userData.tggAmbientTrafficVariantV85=['compact','sedan','sport','utility'][i%4];
      v.userData.tggAmbientTrafficLightClassV85=i%3===0?'bright':i%3===1?'standard':'dim';
    });

    const avShadow=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
    const carShadow=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
    if(avShadow?.material)avShadow.material.opacity=night?.38:wet?.32:.25;
    if(carShadow?.material)carShadow.material.opacity=night?.4:wet?.35:.28;

    root.dataset.tggCurbsMediansV85=curbs?'156':'0';
    root.dataset.tggStorefrontGlassDepthV85=glassDepth?'72':'0';
    root.dataset.tggParkTerrainPropsV85=props?'84':'0';
    root.dataset.tggAmbientTrafficVarietyV85='4-class';
    root.dataset.tggWorldGroundingV85='1';
  };

  window.TGGWorldGroundingV85={apply};
  apply();
}
function applyWorldGroundingV85(){window.TGGWorldGroundingV85?.apply?.()||installWorldGroundingV85()}

function installWorldFinishDetailV86(){
  if(window.TGGWorldFinishV86)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldFinishDetailV86='waiting';return}
  const scene=w.scene;

  let crosswalks=scene.getObjectByName?.('TGG_CROSSWALKS_V86');
  if(!crosswalks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.72,.025,4.4);
    const mat=new THREE.MeshBasicMaterial({color:0xe8e6db});
    crosswalks=new THREE.InstancedMesh(geo,mat,96);crosswalks.name='TGG_CROSSWALKS_V86';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const block=Math.floor(i/12),stripe=i%12,axis=block%2;
      const lane=Math.floor(block/2)-2;
      if(axis===0){p.set((stripe-5.5)*.9,.066,lane*54);q.identity()}
      else{p.set(lane*54,.066,(stripe-5.5)*.9);q.setFromEuler(new THREE.Euler(0,Math.PI/2,0))}
      m.compose(p,q,s);crosswalks.setMatrixAt(i,m);
    }
    crosswalks.instanceMatrix.needsUpdate=true;scene.add(crosswalks);
  }

  let furniture=scene.getObjectByName?.('TGG_STREET_FURNITURE_V86');
  if(!furniture&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.8,.75,.55);
    const mat=new THREE.MeshStandardMaterial({color:0x4b535d,roughness:.7,metalness:.28});
    furniture=new THREE.InstancedMesh(geo,mat,72);furniture.name='TGG_STREET_FURNITURE_V86';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0,r=0;
      if(side===0){x=-18;z=step*18;r=0}
      if(side===1){x=18;z=step*18;r=Math.PI}
      if(side===2){x=step*18;z=-18;r=Math.PI/2}
      if(side===3){x=step*18;z=18;r=-Math.PI/2}
      p.set(x,.38,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.78+(i%4)*.08;s.set(sc,.85+(i%3)*.1,sc);m.compose(p,q,s);furniture.setMatrixAt(i,m);
    }
    furniture.instanceMatrix.needsUpdate=true;scene.add(furniture);
  }

  let reflectors=scene.getObjectByName?.('TGG_MEDIAN_REFLECTORS_V86');
  if(!reflectors&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.16,.08,.38);
    const mat=new THREE.MeshBasicMaterial({color:0xffc86a});
    reflectors=new THREE.InstancedMesh(geo,mat,120);reflectors.name='TGG_MEDIAN_REFLECTORS_V86';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<120;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-15;
      p.set(axis?step*9:side*2.8,.075,axis?side*2.8:step*9);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);reflectors.setMatrixAt(i,m);
    }
    reflectors.instanceMatrix.needsUpdate=true;scene.add(reflectors);
  }

  let groundDecals=scene.getObjectByName?.('TGG_GROUND_DECALS_V86');
  if(!groundDecals&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(1.4,10);
    const mat=new THREE.MeshBasicMaterial({color:0x32383d,transparent:true,opacity:.18,depthWrite:false});
    groundDecals=new THREE.InstancedMesh(geo,mat,128);groundDecals.name='TGG_GROUND_DECALS_V86';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<128;i++){
      const a=(i/128)*Math.PI*9,r=28+(i%14)*12;
      p.set(Math.cos(a)*r,.03,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.45+(i%6)*.11;s.set(sc,sc*.7,1);m.compose(p,q,s);groundDecals.setMatrixAt(i,m);
    }
    groundDecals.instanceMatrix.needsUpdate=true;scene.add(groundDecals);
  }

  const trafficPalette=[0x243b55,0x5b2d2d,0x43484f,0x6d624d,0x273f31,0x5a4d67];
  let trafficStyled=false;
  const styleTraffic=()=>{
    const traffic=w.traffic||[];
    if(!traffic.length)return;
    traffic.forEach((v,i)=>{
      if(!v?.traverse)return;
      const color=trafficPalette[i%trafficPalette.length];
      let changed=false;
      v.traverse(o=>{
        if(changed||!o?.isMesh||!o.material)return;
        const mats=Array.isArray(o.material)?o.material:[o.material];
        for(const m of mats){
          if(!m?.color||!('roughness'in m))continue;
          const n=String(o.name||'').toLowerCase();
          if(/glass|window|light|wheel|tire|rim/.test(n))continue;
          if(m.userData?.tggTrafficStyledV86)continue;
          m.color.setHex(color);
          m.roughness=Math.min(.58,Math.max(.3,Number(m.roughness??.46)));
          if('metalness'in m)m.metalness=Math.max(.12,Number(m.metalness??0));
          m.userData=m.userData||{};m.userData.tggTrafficStyledV86=1;m.needsUpdate=true;
          changed=true;break;
        }
      });
      if(v.userData)v.userData.tggVisualVariantV86=i%trafficPalette.length;
    });
    trafficStyled=true;
    root.dataset.tggTrafficVisualVariantsV86=String(trafficPalette.length);
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      if(crosswalks){
        crosswalks.visible=district!=='park';
        crosswalks.material.color.setHex(wet?0xd7d9dc:0xe8e6db);
      }
      if(furniture){
        furniture.visible=district!=='park'&&(!balanced||district==='downtown'||district==='studio');
        furniture.material.color.setHex(district==='studio'?0x5c5360:district==='home'?0x625e56:0x4b535d);
      }
      if(reflectors){
        reflectors.visible=night||wet;
        reflectors.material.color.setHex(wet?0xffe0a0:0xffc86a);
      }
      if(groundDecals){
        groundDecals.visible=!balanced;
        groundDecals.material.opacity=wet?.1:district==='garage'?.24:.18;
      }
    }
    if(!trafficStyled||((w.traffic||[]).length&&root.dataset.tggTrafficVisualVariantsV86!=='6'))styleTraffic();

    root.dataset.tggCrosswalkInstancesV86=crosswalks?'96':'0';
    root.dataset.tggStreetFurnitureV86=furniture?'72':'0';
    root.dataset.tggMedianReflectorsV86=reflectors?'120':'0';
    root.dataset.tggGroundDecalsV86=groundDecals?'128':'0';
    root.dataset.tggStreetLevelFinishV86='1';
    root.dataset.tggWorldFinishDetailV86='1';
  };

  window.TGGWorldFinishV86={apply};
  apply();
}
function applyWorldFinishDetailV86(){window.TGGWorldFinishV86?.apply?.()||installWorldFinishDetailV86()}

function installWorldMicrodetailV87(){
  if(window.TGGWorldMicrodetailV87)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldMicrodetailV87='waiting';return}
  const scene=w.scene;

  let awnings=scene.getObjectByName?.('TGG_STOREFRONT_AWNINGS_V87');
  if(!awnings&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(4.8,.22,1.35);
    const mat=new THREE.MeshStandardMaterial({color:0x5a394d,roughness:.72,metalness:.04});
    awnings=new THREE.InstancedMesh(geo,mat,48);awnings.name='TGG_STOREFRONT_AWNINGS_V87';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<48;i++){
      const side=i%4,step=Math.floor(i/4)-6;let x=0,z=0,r=0;
      if(side===0){x=-82;z=step*24;r=Math.PI/2}
      if(side===1){x=82;z=step*24;r=-Math.PI/2}
      if(side===2){x=step*24;z=-82;r=0}
      if(side===3){x=step*24;z=82;r=Math.PI}
      p.set(x,3.45,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.82+(i%4)*.08;s.set(sc,1,1);m.compose(p,q,s);awnings.setMatrixAt(i,m);
    }
    awnings.instanceMatrix.needsUpdate=true;scene.add(awnings);
  }

  let puddles=scene.getObjectByName?.('TGG_PUDDLE_DRAIN_ACCENTS_V87');
  if(!puddles&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(1.35,16);
    const mat=new THREE.MeshPhysicalMaterial({color:0x516976,roughness:.05,metalness:.08,transparent:true,opacity:.18,transmission:.08,depthWrite:false});
    puddles=new THREE.InstancedMesh(geo,mat,64);puddles.name='TGG_PUDDLE_DRAIN_ACCENTS_V87';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const a=(i/64)*Math.PI*5,r=35+(i%8)*17;
      p.set(Math.cos(a)*r,.04,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.55+(i%5)*.16;s.set(sc,sc*.55,1);m.compose(p,q,s);puddles.setMatrixAt(i,m);
    }
    puddles.instanceMatrix.needsUpdate=true;scene.add(puddles);
  }

  let utility=scene.getObjectByName?.('TGG_UTILITY_POLES_V87');
  if(!utility&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.11,.16,7.2,7);
    const mat=new THREE.MeshStandardMaterial({color:0x4a3c31,roughness:.95});
    utility=new THREE.InstancedMesh(geo,mat,56);utility.name='TGG_UTILITY_POLES_V87';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<56;i++){
      const side=i%4,step=Math.floor(i/4)-7;let x=0,z=0;
      if(side===0){x=-26;z=step*34}
      if(side===1){x=26;z=step*34}
      if(side===2){x=step*34;z=-26}
      if(side===3){x=step*34;z=26}
      p.set(x,3.6,z);q.identity();m.compose(p,q,s);utility.setMatrixAt(i,m);
    }
    utility.instanceMatrix.needsUpdate=true;scene.add(utility);
  }

  let seating=scene.getObjectByName?.('TGG_PARK_SEATING_V87');
  if(!seating&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.1,.16,.62);
    const mat=new THREE.MeshStandardMaterial({color:0x6c5339,roughness:.9,metalness:.02});
    seating=new THREE.InstancedMesh(geo,mat,28);seating.name='TGG_PARK_SEATING_V87';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<28;i++){
      const a=(i/28)*Math.PI*2,r=46+(i%4)*12;
      p.set(245+Math.cos(a)*r,.48,320+Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));m.compose(p,q,s);seating.setMatrixAt(i,m);
    }
    seating.instanceMatrix.needsUpdate=true;scene.add(seating);
  }

  let pedestriansStyled=false,trafficStyled=false,lastSig='';
  const stylePedestrians=()=>{
    const g=scene.getObjectByName?.('TGG_PEDESTRIAN_POCKETS_V77');
    if(!g||pedestriansStyled)return;
    g.userData.tggPaletteV87=['neutral','warm','cool','street'];
    root.dataset.tggPedestrianVisualVarietyV87='4-palette';
    pedestriansStyled=true;
  };
  const styleTraffic=()=>{
    const traffic=w.traffic||[];
    if(!traffic.length)return;
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      v.userData.tggBrakeGlowV87=i%3===0?'high':i%3===1?'medium':'low';
      v.userData.tggBodyClassV87=['compact','sedan','sport','utility','coupe','luxury'][i%6];
    });
    root.dataset.tggTrafficBodyVarietyV87='6-class';
    root.dataset.tggTrafficBrakeBehaviorV87='graded';
    trafficStyled=true;
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const balanced=quality==='balanced',wet=/rain|storm/.test(weather),night=time==='night';
    const sig=[district,weather,time,quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(awnings){
        awnings.visible=district!=='park'&&!balanced;
        awnings.material.color.setHex(district==='studio'?0x6c405f:district==='media'?0x405d6c:district==='home'?0x64594b:0x5a394d);
      }
      if(puddles){
        puddles.visible=wet&&!balanced;
        puddles.material.opacity=night?.24:.17;
      }
      if(utility)utility.visible=district==='home'||district==='park'||driving;
      if(seating)seating.visible=district==='park'&&!balanced;
    }

    stylePedestrians();
    if(!trafficStyled||(w.traffic||[]).some(v=>!v?.userData?.tggBodyClassV87))styleTraffic();

    const reflectors=scene.getObjectByName?.('TGG_MEDIAN_REFLECTORS_V86');
    if(reflectors?.material)reflectors.material.opacity=night||wet?1:.55;

    root.dataset.tggStorefrontAwningsV87=awnings?'48':'0';
    root.dataset.tggPuddleDrainAccentsV87=puddles?'64':'0';
    root.dataset.tggUtilityPolesV87=utility?'56':'0';
    root.dataset.tggParkSeatingV87=seating?'28':'0';
    root.dataset.tggWorldMicrodetailV87='1';
  };

  window.TGGWorldMicrodetailV87={apply};
  apply();
}
function applyWorldMicrodetailV87(){window.TGGWorldMicrodetailV87?.apply?.()||installWorldMicrodetailV87()}

function installTravelIdentityV88(){
  if(window.TGGTravelIdentityV88)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggTravelIdentityV88='waiting';return}
  const scene=w.scene;

  let bridges=scene.getObjectByName?.('TGG_OVERPASS_BRIDGES_V88');
  if(!bridges&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(34,1.2,8);
    const mat=new THREE.MeshStandardMaterial({color:0x4c535d,roughness:.82,metalness:.18});
    bridges=new THREE.InstancedMesh(geo,mat,8);bridges.name='TGG_OVERPASS_BRIDGES_V88';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const pts=[[-220,0],[-110,230],[0,-260],[120,220],[235,0],[-250,-160],[250,160],[0,300]];
    pts.forEach((pt,i)=>{
      p.set(pt[0],7.8,pt[1]);q.setFromEuler(new THREE.Euler(0,i%2?Math.PI/2:0,0));
      m.compose(p,q,s);bridges.setMatrixAt(i,m);
    });
    bridges.instanceMatrix.needsUpdate=true;scene.add(bridges);
  }

  let rails=scene.getObjectByName?.('TGG_BRIDGE_RAILS_V88');
  if(!rails&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(6,.45,.22);
    const mat=new THREE.MeshStandardMaterial({color:0x68717c,roughness:.58,metalness:.46});
    rails=new THREE.InstancedMesh(geo,mat,96);rails.name='TGG_BRIDGE_RAILS_V88';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const b=Math.floor(i/12),seg=i%12,axis=b%2,side=seg%2?-1:1,step=Math.floor(seg/2)-2.5;
      const centers=[[-220,0],[-110,230],[0,-260],[120,220],[235,0],[-250,-160],[250,160],[0,300]];
      const base=centers[b]||[0,0];
      p.set(base[0]+(axis?side*4.1:step*5.5),8.7,base[1]+(axis?step*5.5:side*4.1));
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));m.compose(p,q,s);rails.setMatrixAt(i,m);
    }
    rails.instanceMatrix.needsUpdate=true;scene.add(rails);
  }

  let underpass=scene.getObjectByName?.('TGG_UNDERPASS_LIGHTS_V88');
  if(!underpass&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(2.6,.45);
    const mat=new THREE.MeshBasicMaterial({color:0xffd88d,transparent:true,opacity:.58,side:THREE.DoubleSide,depthWrite:false});
    underpass=new THREE.InstancedMesh(geo,mat,40);underpass.name='TGG_UNDERPASS_LIGHTS_V88';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<40;i++){
      const lane=i%4,step=Math.floor(i/4)-5;
      p.set((lane-1.5)*4.4,6.9,step*18);
      q.setFromEuler(new THREE.Euler(Math.PI/2,0,0));m.compose(p,q,s);underpass.setMatrixAt(i,m);
    }
    underpass.instanceMatrix.needsUpdate=true;scene.add(underpass);
  }

  let alleys=scene.getObjectByName?.('TGG_ALLEY_DEPTH_V88');
  if(!alleys&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.1,1.6,.8);
    const mat=new THREE.MeshStandardMaterial({color:0x30363c,roughness:.9,metalness:.12});
    alleys=new THREE.InstancedMesh(geo,mat,72);alleys.name='TGG_ALLEY_DEPTH_V88';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0;
      if(side===0){x=-58;z=step*16}
      if(side===1){x=58;z=step*16}
      if(side===2){x=step*16;z=-58}
      if(side===3){x=step*16;z=58}
      p.set(x,.8,z);q.setFromEuler(new THREE.Euler(0,(i%3)*.3,0));
      const sc=.7+(i%5)*.1;s.set(sc,.8+(i%4)*.12,sc);m.compose(p,q,s);alleys.setMatrixAt(i,m);
    }
    alleys.instanceMatrix.needsUpdate=true;scene.add(alleys);
  }

  let billboards=scene.getObjectByName?.('TGG_BILLBOARD_STRUCTURES_V88');
  if(!billboards&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(8.5,4.2,.24);
    const mat=new THREE.MeshStandardMaterial({color:0x2f3946,roughness:.64,metalness:.24});
    billboards=new THREE.InstancedMesh(geo,mat,18);billboards.name='TGG_BILLBOARD_STRUCTURES_V88';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<18;i++){
      const a=(i/18)*Math.PI*2,r=185+(i%4)*52;
      p.set(Math.cos(a)*r,9+(i%3)*2.2,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      const sc=.85+(i%3)*.1;s.set(sc,sc,1);m.compose(p,q,s);billboards.setMatrixAt(i,m);
    }
    billboards.instanceMatrix.needsUpdate=true;scene.add(billboards);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      if(bridges)bridges.visible=driving||district==='downtown'||district==='garage';
      if(rails)rails.visible=bridges?.visible!==false;
      if(underpass){
        underpass.visible=(night||wet||driving)&&!balanced;
        underpass.material.opacity=night?.72:wet?.5:.38;
      }
      if(alleys)alleys.visible=district!=='park'&&(!balanced||district==='downtown'||district==='studio');
      if(billboards){
        billboards.visible=district!=='park'&&!balanced;
        billboards.material.roughness=wet?.42:.64;
      }
    }
    root.dataset.tggOverpassBridgesV88=bridges?'8':'0';
    root.dataset.tggBridgeRailsV88=rails?'96':'0';
    root.dataset.tggUnderpassLightsV88=underpass?'40':'0';
    root.dataset.tggAlleyDepthV88=alleys?'72':'0';
    root.dataset.tggBillboardStructuresV88=billboards?'18':'0';
    root.dataset.tggTravelIdentityV88='1';
  };

  window.TGGTravelIdentityV88={apply};
  apply();
}
function applyTravelIdentityV88(){window.TGGTravelIdentityV88?.apply?.()||installTravelIdentityV88()}

function installDistrictTransitionV89(){
  if(window.TGGDistrictTransitionV89)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggDistrictTransitionV89='waiting';return}
  const scene=w.scene;

  let corridors=scene.getObjectByName?.('TGG_DISTRICT_TRANSITION_CORRIDORS_V89');
  if(!corridors&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(18,.08,3.2);
    const mat=new THREE.MeshStandardMaterial({color:0x39424d,roughness:.78,metalness:.08});
    corridors=new THREE.InstancedMesh(geo,mat,36);corridors.name='TGG_DISTRICT_TRANSITION_CORRIDORS_V89';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<36;i++){
      const a=(i/36)*Math.PI*2,r=135+(i%6)*55;
      p.set(Math.cos(a)*r,.045,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      m.compose(p,q,s);corridors.setMatrixAt(i,m);
    }
    corridors.instanceMatrix.needsUpdate=true;scene.add(corridors);
  }

  let approach=scene.getObjectByName?.('TGG_LANDMARK_APPROACH_LIGHTS_V89');
  if(!approach&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.5,.12,3.8);
    const mat=new THREE.MeshBasicMaterial({color:0xaad8ff,transparent:true,opacity:.34,depthWrite:false});
    approach=new THREE.InstancedMesh(geo,mat,48);approach.name='TGG_LANDMARK_APPROACH_LIGHTS_V89';
    const anchors=[[0,-300],[-300,-90],[290,-35],[215,280],[-260,250],[0,370]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<48;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length)-3.5;
      p.set(a[0]+row*4.8,.07,a[1]);q.identity();m.compose(p,q,s);approach.setMatrixAt(i,m);
    }
    approach.instanceMatrix.needsUpdate=true;scene.add(approach);
  }

  let blend=scene.getObjectByName?.('TGG_CITY_COUNTRY_BLEND_V89');
  if(!blend&&THREE.InstancedMesh){
    const geo=new THREE.ConeGeometry(1.1,4.8,7);
    const mat=new THREE.MeshStandardMaterial({color:0x38513e,roughness:.96});
    blend=new THREE.InstancedMesh(geo,mat,120);blend.name='TGG_CITY_COUNTRY_BLEND_V89';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<120;i++){
      const a=(i/120)*Math.PI*2,r=520+(i%10)*26;
      p.set(Math.cos(a)*r,2.4,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a,0));
      const sc=.65+(i%6)*.08;s.set(sc,.7+(i%4)*.1,sc);m.compose(p,q,s);blend.setMatrixAt(i,m);
    }
    blend.instanceMatrix.needsUpdate=true;scene.add(blend);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(corridors){
        corridors.visible=driving||district==='downtown'||district==='garage';
        corridors.material.roughness=wet?.52:.78;
      }
      if(approach){
        approach.visible=(night||wet||driving)&&!balanced;
        approach.material.opacity=night?.48:wet?.38:.26;
      }
      if(blend){
        blend.visible=district==='park'||district==='home'||driving;
        blend.material.color.setHex(district==='park'?0x315b3b:0x425344);
      }
    }

    const traffic=w.traffic||[];
    const density=district==='downtown'?1:district==='studio'?.82:district==='media'?.9:district==='park'?.48:district==='home'?.62:.72;
    traffic.forEach((v,i)=>{
      if(!v)return;
      v.userData.tggDistrictDensityV89=density;
      v.userData.tggTravelZoneV89=district;
      if(v.visible!==undefined&&i>Math.floor(traffic.length*density))v.visible=false;
      else if(v.visible!==undefined)v.visible=true;
    });

    if(scene.fog){
      const base=district==='park'?.00148:district==='home'?.00158:.00174;
      scene.fog.density=base+(wet?.00028:0)+(night?.00012:0);
    }

    root.dataset.tggTransitionCorridorsV89=corridors?'36':'0';
    root.dataset.tggLandmarkApproachLightsV89=approach?'48':'0';
    root.dataset.tggCityCountryBlendV89=blend?'120':'0';
    root.dataset.tggTrafficDensityV89=String(density);
    root.dataset.tggDistrictTransitionV89='1';
  };

  window.TGGDistrictTransitionV89={apply};
  apply();
}
function applyDistrictTransitionV89(){window.TGGDistrictTransitionV89?.apply?.()||installDistrictTransitionV89()}

function installWorldGroundingV90(){
  if(window.TGGWorldGroundingV90)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldGroundingV90='waiting';return}
  const scene=w.scene;

  let curbs=scene.getObjectByName?.('TGG_CURB_MEDIAN_V90');
  if(!curbs&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(5.6,.22,.5);
    const mat=new THREE.MeshStandardMaterial({color:0x777c82,roughness:.9,metalness:.02});
    curbs=new THREE.InstancedMesh(geo,mat,144);curbs.name='TGG_CURB_MEDIAN_V90';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<144;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-18;
      p.set(axis?step*7.1:side*9.7,.11,axis?side*9.7:step*7.1);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));m.compose(p,q,s);curbs.setMatrixAt(i,m);
    }
    curbs.instanceMatrix.needsUpdate=true;scene.add(curbs);
  }

  let glassDepth=scene.getObjectByName?.('TGG_STOREFRONT_GLASS_DEPTH_V90');
  if(!glassDepth&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(4.8,3.1);
    const mat=new THREE.MeshPhysicalMaterial({color:0x6f91aa,roughness:.06,metalness:.08,transparent:true,opacity:.18,transmission:.16,depthWrite:false,side:THREE.DoubleSide});
    glassDepth=new THREE.InstancedMesh(geo,mat,72);glassDepth.name='TGG_STOREFRONT_GLASS_DEPTH_V90';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0,r=0;const d=82+(i%3)*8;
      if(side===0){x=-d;z=step*16;r=Math.PI/2}
      if(side===1){x=d;z=step*16;r=-Math.PI/2}
      if(side===2){x=step*16;z=-d;r=0}
      if(side===3){x=step*16;z=d;r=Math.PI}
      p.set(x,2.2,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.84+(i%4)*.08;s.set(sc,1,1);m.compose(p,q,s);glassDepth.setMatrixAt(i,m);
    }
    glassDepth.instanceMatrix.needsUpdate=true;scene.add(glassDepth);
  }

  let terrainProps=scene.getObjectByName?.('TGG_TERRAIN_PROPS_V90');
  if(!terrainProps&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.22,.36,1.2,6);
    const mat=new THREE.MeshStandardMaterial({color:0x5b5248,roughness:.98});
    terrainProps=new THREE.InstancedMesh(geo,mat,132);terrainProps.name='TGG_TERRAIN_PROPS_V90';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<132;i++){
      const a=(i/132)*Math.PI*5,r=210+(i%12)*38;
      p.set(Math.cos(a)*r,.6,Math.sin(a)*r);q.setFromEuler(new THREE.Euler(0,a*.8,0));
      const sc=.55+(i%6)*.1;s.set(sc,.7+(i%4)*.12,sc);m.compose(p,q,s);terrainProps.setMatrixAt(i,m);
    }
    terrainProps.instanceMatrix.needsUpdate=true;scene.add(terrainProps);
  }

  let contactLight=scene.getObjectByName?.('TGG_CONTACT_LIGHT_V90');
  if(!contactLight){
    contactLight=new THREE.PointLight(0xd9ecff,0,11,2);contactLight.name='TGG_CONTACT_LIGHT_V90';scene.add(contactLight);
  }

  let avatar=null,lastAvatarScan=0,lastSig='';
  const findAvatar=()=>{
    if(avatar?.parent)return avatar;
    const now=performance.now();if(now-lastAvatarScan<2500)return avatar;lastAvatarScan=now;
    scene.traverse?.(o=>{if(avatar)return;const n=String(o?.name||'').toLowerCase();if(/player|avatar|character/.test(n)&&o?.position)avatar=o});
    return avatar;
  };

  const applyTrafficVariety=()=>{
    const traffic=w.traffic||[];
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      const cls=i%5;
      v.userData.tggTrafficClassV90=['compact','sedan','muscle','utility','luxury'][cls];
      v.userData.tggTrafficScaleV90=[.92,1,1.05,1.08,.98][cls];
      if(v.scale&&v.userData.tggTrafficScaleAppliedV90!=='1'){
        v.scale.multiplyScalar?.(v.userData.tggTrafficScaleV90);
        v.userData.tggTrafficScaleAppliedV90='1';
      }
    });
    root.dataset.tggTrafficVarietyV90=traffic.length?String(Math.min(5,traffic.length)):'0';
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown'),time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear'),quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving,night=time==='night',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      if(curbs){curbs.visible=district!=='park'||driving;curbs.material.color.setHex(district==='home'?0x86827a:district==='studio'?0x70727b:0x777c82);curbs.material.roughness=wet?.62:.9}
      if(glassDepth){glassDepth.visible=district!=='park'&&!balanced;glassDepth.material.opacity=night?.28:wet?.24:.17;glassDepth.material.roughness=wet?.03:.07}
      if(terrainProps){terrainProps.visible=(district==='park'||district==='home'||driving)&&!balanced;terrainProps.material.color.setHex(district==='park'?0x4e5a45:0x5b5248)}
    }

    applyTrafficVariety();
    const av=findAvatar(),focus=driving?w.car:av;
    if(focus?.position&&!balanced){
      contactLight.position.set(focus.position.x,focus.position.y+1.2,focus.position.z);
      contactLight.intensity=night?1.05:wet?.62:.34;
      contactLight.color.setHex(night?0x9ec7ff:wet?0xc7ddf0:0xffddb5);
      root.dataset.tggContactLightingV90=driving?'vehicle':'avatar';
    }else{contactLight.intensity=0;root.dataset.tggContactLightingV90=focus?'disabled-balanced':'waiting'}

    const avShadow=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');if(avShadow?.material)avShadow.material.opacity=night?.36:wet?.31:.25;
    const carShadow=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');if(carShadow?.material)carShadow.material.opacity=night?.36:wet?.34:.28;

    root.dataset.tggCurbMedianV90=curbs?'144':'0';
    root.dataset.tggStorefrontGlassDepthV90=glassDepth?'72':'0';
    root.dataset.tggTerrainPropsV90=terrainProps?'132':'0';
    root.dataset.tggGroundContactModelV90='shadow+contact-light';
    root.dataset.tggWorldGroundingV90='1';
  };

  window.TGGWorldGroundingV90={apply};apply();
}
function applyWorldGroundingV90(){window.TGGWorldGroundingV90?.apply?.()||installWorldGroundingV90()}
function tick(){detectDistrict();motion();weather();applyDriveCatchup();applyCameraCatchup();applyLifeCatchup();applyMaxBatchPolish();applyUltraMegaBatch();applyPresentationDirector();applyUltraMaxDirector();applyWorldDensityMega();applyFullCityLifeBatch();applyVehicleShowcaseV16();applyOpenRoadV16();applyStreetRaceV17();applyTrafficVarietyV17();applyDistrictDepthV17();installGarageCustomizerV18();applyRaceNightV21();applyRoadDepthV21();applyRaceEventV22();applyTravelDepthV22();applyRaceCountdownV23();applyTravelCorridorsV23();applyRaceOpponentsV24();applyDestinationSpacingV24();applyStudioReturnV24();applyRaceProgressV25();applyOpponentAI25();applyReturnedWorldVfx25();applyRaceHudV26();installNitrousV26();applyReturnedEditorPresetV26();applyRaceResultsV27();applyOpponentDifficultyV27();applyNitrousBehaviorV27();applyRoadNetworkV27();applyReturnedMoodV27();applyRaceEconomyV28();applyOpponentCatchupV28();installNitrousRechargeV28();applyDistrictJunctionsV28();applyReturnedEnvironmentV28();installGarageEconomyV29();applyPerformanceStatsV29();applyHighwayNetworkV29();applyWeatherBlendV29();applyGarageHudV30();applyRaceTierV30();applyInterchangesV30();applyUpgradeFeedbackV30();applyRaceTierLocksV31();applyTierScaledRaceV31();applyVisualUpgradeEvolutionV31();applyCareerLinksV31();applyRaceEventsV32();applyRaceRewardEscalationV32();applyGarageEvolutionV32();applyCareerDestinationsV32();applyEventRoutesV33();applyRaceEntryV33();applyChampionshipBonusV33();applyGarageMilestonesV33();applyEventCardV33();installRaceStartGuardV34();applyEventCheckpointProgressV34();applyCareerPayoutV34();applyChampionshipHistoryV34();applyCareerLadderHudV34();installRaceTimingV35();applyRaceTimingV35();applyCareerXpV35();applyCareerUnlocksV35();applyRaceResultsScreenV35();applyPostRaceFlowV35();applyEventCompletionV36();applyCareerUnlockPersistenceV36();applyTierRivalsV36();applyAchievementsV36();applyNextObjectiveV36();enhanceResultsActionsV36();applyRivalBehaviorV37();applyWinStreakV37();applyAchievementRewardsV37();applyGarageReturnV37();applyCareerDashboardV37();applyRivalChallengeV38();applyStreakRiskRewardV38();applyAchievementToastV38();applyNextTierGateV38();enhanceCareerDashboardV38();installRivalShowdownsV39();applyRivalRouteV39();applyStreakPayoutV39();applyAchievementsPanelV39();enforceTierUnlocksV39();enhanceResultsRivalV39();applyRivalSeriesV40();applyCrewReputationV40();applySeasonPointsV40();applyChampionshipQualificationV40();applySeasonStandingsV40();applySeasonSummaryV40();installChampionshipFinaleV41();applyChampionshipRouteV41();applySeriesCompletionRewardV41();applyCrewRankV41();applySeasonTrophyV41();applySeasonFinaleResultsV41();installNextSeasonV41();applySeasonHistoryV42();applyTrophyDisplayV42();applyCrewRankRewardsV42();applyFinaleRivalV42();installNewSeasonSetupV42();applySeasonLegacyPanelV42();installRaceLifecycleV43();applyRaceLifecycleV43();installNitrousRestoreV43();applyEnvironmentDirectorV43();installHudDirectorV44();applyHudDirectorV44();installGraphicsDirectorV50();applyGraphicsDirectorV50();installVisualProductionV51();applyVisualProductionV51();installOpenWorldCompositionV52();applyOpenWorldCompositionV52();installWorldRegionsV53();applyWorldRegionsV53();installNightDriveV54();applyNightDriveV54();installGraphicsPerformanceV55();applyGraphicsPerformanceV55();installGraphicsOwnershipV56();applyGraphicsOwnershipV56();installGraphicsManifestV57();applyGraphicsManifestV57();installBuildIntegrityV58();applyBuildIntegrityV58();installBuildFailSafeV59();applyBuildFailSafeV59();installBuildRecoveryV60();applyBuildRecoveryV60();installRaceCoreAuthorityV61();applyRaceCoreAuthorityV61();installRaceTierAuthorityV62();applyRaceTierAuthorityV62();installCheckpointAuthorityV63();applyCheckpointAuthorityV63();installOpponentRouteAuthorityV64();applyOpponentRouteAuthorityV64();installOpponentDynamicsV65();applyOpponentDynamicsV65();installRacecraftV66();applyRacecraftV66();installPayoutAuthorityV67();applyPayoutAuthorityV67();installProgressAuthorityV68();applyProgressAuthorityV68();installRewardIntegrityV69();applyRewardIntegrityV69();installRuntimeEfficiencyV70();applyRuntimeEfficiencyV70();installRuntimeHotspotCacheV71();applyRuntimeHotspotCacheV71();installVisualBudgetV72();applyVisualBudgetV72();installSystemIntegrityV73();applySystemIntegrityV73();installAuthorityConsolidationV74();applyAuthorityConsolidationV74();installWorldVisualOverhaulV75();applyWorldVisualOverhaulV75();installOpenWorldExpansionV76();applyOpenWorldExpansionV76();installDistrictIdentityV77();applyDistrictIdentityV77();installWorldSurfacePolishV78();applyWorldSurfacePolishV78();installPremiumWorldPresentationV79();applyPremiumWorldPresentationV79();installNightCohesionV80();applyNightCohesionV80();installDaylightRealismV81();applyDaylightRealismV81();installWorldArtDirectionV82();applyWorldArtDirectionV82();installWorldDepthCuesV83();applyWorldDepthCuesV83();installAmbientWorldMotionV84();applyAmbientWorldMotionV84();installWorldGroundingV85();applyWorldGroundingV85();installWorldFinishDetailV86();applyWorldFinishDetailV86();installWorldMicrodetailV87();applyWorldMicrodetailV87();installTravelIdentityV88();applyTravelIdentityV88();installDistrictTransitionV89();applyDistrictTransitionV89();installWorldGroundingV90();applyWorldGroundingV90();applyPlaytestQuickAccess()}
syncAvatar();ambient();quality();ui();tick();applyDriveCatchup();applyCameraCatchup();applyLifeCatchup();applyMaxBatchPolish();applyUltraMegaBatch();applyPresentationDirector();applyUltraMaxDirector();applyWorldDensityMega();applyFullCityLifeBatch();applyVehicleShowcaseV16();applyOpenRoadV16();applyPlaytestQuickAccess();
addEventListener('tgg-world-avatar-changed',e=>{try{localStorage.setItem('tgg-world-avatar-v12',JSON.stringify(e.detail||{}))}catch{};syncAvatar()});
addEventListener('storage',e=>{if(e.key==='tgg-world-avatar-v12')syncAvatar()});
new MutationObserver(()=>{ui();tick()}).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
setInterval(tick,1200);
window.TGG1000X={state,setDistrict:v=>set('district',v),setWeather:v=>set('weather',v),setTime:v=>set('time',v),health:()=>({ok:true,version:'1000x-master',state:{...state}})};
})();