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
    ['INTERACT',()=>window.TGGDestinationEnterV135?.enter?.('quick-access')||window.TGG3D?.interactNearest?.()],
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
  const expected={overlay:'1000x-v208',graphics:'57',masterJs:'1000x-v208',cleanerJs:'193'};
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
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);curbs.setMatrixAt(i,m);
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
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0,r=0;
      const d=82+(i%3)*8;
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
      p.set(Math.cos(a)*r,.6,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.8,0));
      const sc=.55+(i%6)*.1;s.set(sc,.7+(i%4)*.12,sc);m.compose(p,q,s);terrainProps.setMatrixAt(i,m);
    }
    terrainProps.instanceMatrix.needsUpdate=true;scene.add(terrainProps);
  }

  let contactLight=scene.getObjectByName?.('TGG_CONTACT_LIGHT_V90');
  if(!contactLight){
    contactLight=new THREE.PointLight(0xd9ecff,0,11,2);
    contactLight.name='TGG_CONTACT_LIGHT_V90';scene.add(contactLight);
  }

  let avatar=null,lastAvatarScan=0,lastSig='';
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

  const applyTrafficVariety=()=>{
    const traffic=w.traffic||[];
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      const cls=i%5;
      v.userData.tggTrafficClassV90=['compact','sedan','muscle','utility','luxury'][cls];
      v.userData.tggTrafficScaleV90=[.92,1,1.05,1.08,.98][cls];
      if(v.scale&&v.userData.tggTrafficScaleAppliedV90!=='1'){
        const s=v.userData.tggTrafficScaleV90;
        v.scale.multiplyScalar?.(s);
        v.userData.tggTrafficScaleAppliedV90='1';
      }
    });
    root.dataset.tggTrafficVarietyV90=traffic.length?String(Math.min(5,traffic.length)):'0';
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=time==='night',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(curbs){
        curbs.visible=district!=='park'||driving;
        curbs.material.color.setHex(district==='home'?0x86827a:district==='studio'?0x70727b:0x777c82);
        curbs.material.roughness=wet?.62:.9;
      }
      if(glassDepth){
        glassDepth.visible=district!=='park'&&!balanced;
        glassDepth.material.opacity=night?.28:wet?.24:.17;
        glassDepth.material.roughness=wet?.03:.07;
      }
      if(terrainProps){
        terrainProps.visible=(district==='park'||district==='home'||driving)&&!balanced;
        terrainProps.material.color.setHex(district==='park'?0x4e5a45:0x5b5248);
      }
    }

    applyTrafficVariety();

    const av=findAvatar();
    const focus=driving?w.car:av;
    if(focus?.position&&!balanced){
      contactLight.position.set(focus.position.x,focus.position.y+1.2,focus.position.z);
      contactLight.intensity=night?1.05:wet?.62:.34;
      contactLight.color.setHex(night?0x9ec7ff:wet?0xc7ddf0:0xffddb5);
      root.dataset.tggContactLightingV90=driving?'vehicle':'avatar';
    }else{
      contactLight.intensity=0;
      root.dataset.tggContactLightingV90=focus?'disabled-balanced':'waiting';
    }

    const avShadow=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
    if(avShadow?.material)avShadow.material.opacity=night?.36:wet?.31:.25;
    const carShadow=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
    if(carShadow?.material)carShadow.material.opacity=night?.36:wet?.34:.28;

    root.dataset.tggCurbMedianV90=curbs?'144':'0';
    root.dataset.tggStorefrontGlassDepthV90=glassDepth?'72':'0';
    root.dataset.tggTerrainPropsV90=terrainProps?'132':'0';
    root.dataset.tggGroundContactModelV90='shadow+contact-light';
    root.dataset.tggWorldGroundingV90='1';
  };

  window.TGGWorldGroundingV90={apply};
  apply();
}
function applyWorldGroundingV90(){window.TGGWorldGroundingV90?.apply?.()||installWorldGroundingV90()}

function installWorldScaleFinishV91(){
  if(window.TGGWorldScaleV91)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldScaleFinishV91='waiting';return}
  const scene=w.scene;

  let parking=scene.getObjectByName?.('TGG_PARKING_DETAIL_V91');
  if(!parking&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.12,.02,4.2);
    const mat=new THREE.MeshBasicMaterial({color:0xe7e3d0,transparent:true,opacity:.68});
    parking=new THREE.InstancedMesh(geo,mat,120);parking.name='TGG_PARKING_DETAIL_V91';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<120;i++){
      const lot=i%3,slot=i%40,row=Math.floor(slot/10),col=slot%10;
      const bases=[[-150,-120],[145,-105],[0,165]];
      const b=bases[lot];
      p.set(b[0]+(col-4.5)*3.2,.04,b[1]+(row-1.5)*6.5);
      q.identity();m.compose(p,q,s);parking.setMatrixAt(i,m);
    }
    parking.instanceMatrix.needsUpdate=true;scene.add(parking);
  }

  let lamps=scene.getObjectByName?.('TGG_LAMP_RHYTHM_V91');
  if(!lamps&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.07,.1,4.8,6);
    const mat=new THREE.MeshStandardMaterial({color:0x414a54,roughness:.62,metalness:.52});
    lamps=new THREE.InstancedMesh(geo,mat,96);lamps.name='TGG_LAMP_RHYTHM_V91';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-12;
      p.set(axis?step*22:side*13,2.4,axis?side*13:step*22);
      q.identity();m.compose(p,q,s);lamps.setMatrixAt(i,m);
    }
    lamps.instanceMatrix.needsUpdate=true;scene.add(lamps);
  }

  let laneEdges=scene.getObjectByName?.('TGG_LANE_EDGE_REFLECTORS_V91');
  if(!laneEdges&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.22,.07,.52);
    const mat=new THREE.MeshBasicMaterial({color:0xf7f0c8});
    laneEdges=new THREE.InstancedMesh(geo,mat,160);laneEdges.name='TGG_LANE_EDGE_REFLECTORS_V91';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<160;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-20;
      p.set(axis?step*10:side*7.2,.055,axis?side*7.2:step*10);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));m.compose(p,q,s);laneEdges.setMatrixAt(i,m);
    }
    laneEdges.instanceMatrix.needsUpdate=true;scene.add(laneEdges);
  }

  const managed=[
    'TGG_STREET_CLUTTER_V84','TGG_FOLIAGE_VARIETY_V83','TGG_TERRAIN_PROPS_V90',
    'TGG_STREET_RHYTHM_V82','TGG_SIDEWALK_VARIATION_V83','TGG_STOREFFRONT_GLASS_DEPTH_V90'
  ];

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=root.dataset.tggTime==='night';
    const balanced=quality==='balanced';
    const sig=[district,quality,driving?'1':'0',night?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(parking)parking.visible=district!=='park'&&(!balanced||district==='garage');
      if(lamps)lamps.visible=!balanced||night||district==='downtown';
      if(laneEdges){
        laneEdges.visible=driving||night;
        laneEdges.material.color.setHex(night?0xbfe7ff:0xf7f0c8);
      }
      managed.forEach(name=>{
        const g=scene.getObjectByName?.(name);if(!g)return;
        if(balanced&&name!=='TGG_SIDEWALK_VARIATION_V83')g.visible=false;
      });
    }

    const focus=w.car?.position||w.camera?.position;
    if(focus){
      const fx=focus.x||0,fz=focus.z||0;
      ['TGG_DISTANT_TERRAIN_V84','TGG_SKYLINE_SILHOUETTES_V82','TGG_CITY_COUNTRY_BLEND_V89'].forEach(name=>{
        const g=scene.getObjectByName?.(name);if(!g)return;
        const d=Math.hypot(fx,g.position?.x||0,fz-(g.position?.z||0));
        g.visible=d<3400;
      });
    }

    root.dataset.tggParkingDetailV91=parking?'120':'0';
    root.dataset.tggLampRhythmV91=lamps?'96':'0';
    root.dataset.tggLaneEdgeReflectorsV91=laneEdges?'160':'0';
    root.dataset.tggPropDensityModelV91='district+quality';
    root.dataset.tggWorldScaleFinishV91='1';
  };

  window.TGGWorldScaleV91={apply};
  apply();
}
function applyWorldScaleFinishV91(){window.TGGWorldScaleV91?.apply?.()||installWorldScaleFinishV91()}

function installMobilityEconomyV91(){
  if(window.TGGMobilityV91)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggMobilityEconomyV91='waiting';return}
  const scene=w.scene;

  const services={
    eats:{label:'TGG EATS',fare:18,gig:32,type:'delivery'},
    ride:{label:'TGG RIDE',fare:24,gig:38,type:'rideshare'},
    black:{label:'TGG BLACK',fare:48,gig:62,type:'premium-ride'},
    courier:{label:'TGG COURIER',fare:14,gig:28,type:'courier'},
    scooter:{label:'TGG SCOOTER',fare:6,gig:18,type:'rental'},
    bike:{label:'TGG BIKE',fare:4,gig:15,type:'rental'},
    moto:{label:'TGG MOTO',fare:16,gig:34,type:'motorcycle'}
  };

  let trucks=scene.getObjectByName?.('TGG_FOOD_TRUCKS_V91');
  if(!trucks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(4.6,2.3,2);
    const mat=new THREE.MeshStandardMaterial({color:0xc2413b,roughness:.56,metalness:.18});
    trucks=new THREE.InstancedMesh(geo,mat,12);trucks.name='TGG_FOOD_TRUCKS_V91';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const spots=[[-28,52],[32,54],[-70,-12],[72,-8],[-24,-72],[28,-70],[205,300],[250,345],[-275,270],[-315,315],[25,405],[-28,410]];
    spots.forEach((pt,i)=>{
      p.set(pt[0],1.15,pt[1]);q.setFromEuler(new THREE.Euler(0,i%2?Math.PI/2:0,0));m.compose(p,q,s);trucks.setMatrixAt(i,m);
    });
    trucks.instanceMatrix.needsUpdate=true;scene.add(trucks);
  }

  let scooters=scene.getObjectByName?.('TGG_SCOOTER_RENTALS_V91');
  if(!scooters&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.18,.75,.42);
    const mat=new THREE.MeshStandardMaterial({color:0x48d597,roughness:.5,metalness:.35});
    scooters=new THREE.InstancedMesh(geo,mat,40);scooters.name='TGG_SCOOTER_RENTALS_V91';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<40;i++){
      const a=(i/40)*Math.PI*2,r=48+(i%5)*13;
      p.set(Math.cos(a)*r,.38,Math.sin(a)*r);q.setFromEuler(new THREE.Euler(0,a,0));m.compose(p,q,s);scooters.setMatrixAt(i,m);
    }
    scooters.instanceMatrix.needsUpdate=true;scene.add(scooters);
  }

  let bikes=scene.getObjectByName?.('TGG_BIKE_RENTALS_V91');
  if(!bikes&&THREE.InstancedMesh){
    const geo=new THREE.TorusGeometry(.36,.045,6,14);
    const mat=new THREE.MeshStandardMaterial({color:0x61a8ff,roughness:.45,metalness:.42});
    bikes=new THREE.InstancedMesh(geo,mat,32);bikes.name='TGG_BIKE_RENTALS_V91';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<32;i++){
      const a=(i/32)*Math.PI*2,r=72+(i%4)*18;
      p.set(Math.cos(a)*r,.42,Math.sin(a)*r);q.setFromEuler(new THREE.Euler(0,a,0));m.compose(p,q,s);bikes.setMatrixAt(i,m);
    }
    bikes.instanceMatrix.needsUpdate=true;scene.add(bikes);
  }

  let motos=scene.getObjectByName?.('TGG_MOTORCYCLES_V91');
  if(!motos&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.75,.72,.55);
    const mat=new THREE.MeshStandardMaterial({color:0x272b31,roughness:.32,metalness:.62});
    motos=new THREE.InstancedMesh(geo,mat,18);motos.name='TGG_MOTORCYCLES_V91';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<18;i++){
      const a=(i/18)*Math.PI*2,r=88+(i%3)*30;
      p.set(Math.cos(a)*r,.42,Math.sin(a)*r);q.setFromEuler(new THREE.Euler(0,-a,0));m.compose(p,q,s);motos.setMatrixAt(i,m);
    }
    motos.instanceMatrix.needsUpdate=true;scene.add(motos);
  }

  let panel=document.getElementById('tgg-mobility-v91');
  if(!panel){
    panel=document.createElement('div');panel.id='tgg-mobility-v91';
    panel.style.cssText='position:fixed;right:14px;bottom:84px;z-index:10015;width:min(92vw,330px);padding:12px;border:1px solid rgba(255,255,255,.15);border-radius:14px;background:rgba(7,12,20,.92);color:#fff;font:700 12px/1.4 system-ui,sans-serif;display:none;backdrop-filter:blur(10px)';
    panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><strong style="font-size:14px">TGG MOBILITY + DELIVERY</strong><button data-close style="border:0;border-radius:8px;padding:5px 8px;font-weight:900">×</button></div><div data-status style="margin:7px 0;color:#bce6ff">Choose a service or gig.</div><div data-actions style="display:grid;grid-template-columns:1fr 1fr;gap:6px"></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-close]').onclick=()=>panel.style.display='none';
    const actions=panel.querySelector('[data-actions]');
    Object.entries(services).forEach(([key,s])=>{
      const b=document.createElement('button');b.type='button';b.textContent=s.label;
      b.style.cssText='padding:8px;border:0;border-radius:9px;font-weight:900';
      b.onclick=()=>window.TGGMobilityV91?.request?.(key);
      actions.appendChild(b);
      const g=document.createElement('button');g.type='button';g.textContent='WORK '+s.label.replace('TGG ','');
      g.style.cssText='padding:8px;border:0;border-radius:9px;font-weight:900';
      g.onclick=()=>window.TGGMobilityV91?.startGig?.(key);
      actions.appendChild(g);
    });
  }

  const setStatus=(msg)=>{const el=panel?.querySelector('[data-status]');if(el)el.textContent=msg};

  const request=(key)=>{
    const s=services[key];if(!s)return false;
    const id='req-'+Date.now().toString(36);
    root.dataset.tggMobilityRequestV91=id;
    root.dataset.tggMobilityServiceV91=key;
    root.dataset.tggMobilityRequestStatusV91='dispatched';
    setStatus(s.label+' dispatched · fare '+s.fare+' TGG');
    return {id,service:key,fare:s.fare};
  };

  const startGig=(key)=>{
    const s=services[key];if(!s)return false;
    const id='gig-'+Date.now().toString(36);
    root.dataset.tggMobilityGigV91=id;
    root.dataset.tggMobilityGigTypeV91=key;
    root.dataset.tggMobilityGigStatusV91='active';
    root.dataset.tggMobilityGigRewardV91=String(s.gig);
    setStatus('ACTIVE '+s.label+' gig · reward '+s.gig+' TGG');
    return {id,service:key,reward:s.gig};
  };

  const completeGig=()=>{
    const id=root.dataset.tggMobilityGigV91||'';
    const key=root.dataset.tggMobilityGigTypeV91||'';
    const s=services[key];if(!id||!s)return false;
    const claim='mobility:'+id;
    const result=window.TGGPayoutV67?.grant?.(claim,s.gig,'mobility-gig')||{granted:false};
    root.dataset.tggMobilityGigStatusV91=result.granted?'complete':'claimed';
    root.dataset.tggMobilityGigPayoutV91=String(s.gig);
    setStatus((result.granted?'COMPLETED ':'CLAIMED ')+s.label+' · '+s.gig+' TGG');
    return result;
  };

  const open=()=>{panel.style.display='block';setStatus('Choose a service or gig.')};

  const addQuick=()=>{
    const wrap=document.getElementById('tgg-playtest-quick');if(!wrap||wrap.querySelector('[data-tgg-mobility-v91]'))return;
    const b=document.createElement('button');b.type='button';b.dataset.tggMobilityV91='1';b.textContent='MOBILITY';
    b.onclick=open;wrap.appendChild(b);
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const balanced=quality==='balanced';
    if(trucks)trucks.visible=district!=='park'||district==='home';
    if(scooters)scooters.visible=!balanced&&district!=='garage';
    if(bikes)bikes.visible=!balanced&&(district==='park'||district==='home'||district==='downtown');
    if(motos)motos.visible=district==='garage'||district==='downtown'||district==='studio';
    addQuick();
    root.dataset.tggFoodTrucksV91=trucks?'12':'0';
    root.dataset.tggScooterRentalsV91=scooters?'40':'0';
    root.dataset.tggBikeRentalsV91=bikes?'32':'0';
    root.dataset.tggMotorcyclesV91=motos?'18':'0';
    root.dataset.tggMobilityServicesV91=String(Object.keys(services).length);
    root.dataset.tggMobilityEconomyV91='1';
  };

  window.TGGMobilityV91={services,request,startGig,completeGig,open,apply};
  apply();
}
function applyMobilityEconomyV91(){window.TGGMobilityV91?.apply?.()||installMobilityEconomyV91()}

function installMobilityWorldIntegrationV92(){
  if(window.TGGMobilityWorldV92)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggMobilityWorldIntegrationV92='waiting';return}
  const scene=w.scene;

  let hubs=scene.getObjectByName?.('TGG_MOBILITY_HUBS_V92');
  if(!hubs){
    hubs=new THREE.Group();hubs.name='TGG_MOBILITY_HUBS_V92';
    const specs=[
      ['ride',-42,18,0x5fd7ff],
      ['eats',42,20,0xff8a55],
      ['courier',-38,-44,0xffd166],
      ['scooter',38,-42,0x48d597],
      ['bike',8,72,0x61a8ff],
      ['moto',0,-82,0xb79cff]
    ];
    specs.forEach(([name,x,z,color])=>{
      const base=new THREE.Mesh(new THREE.CylinderGeometry(2.8,3.2,.26,18),new THREE.MeshStandardMaterial({color:0x252b33,roughness:.68,metalness:.22}));
      base.position.set(x,.13,z);base.userData.tggMobilityHubV92=name;hubs.add(base);
      const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,2.8,8),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.72}));
      beacon.position.set(x,1.55,z);beacon.userData.tggMobilityHubV92=name;hubs.add(beacon);
    });
    scene.add(hubs);
  }

  let curbZones=scene.getObjectByName?.('TGG_PICKUP_DROPOFF_V92');
  if(!curbZones&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(6.2,.04,1.35);
    const mat=new THREE.MeshBasicMaterial({color:0x6fd3ff,transparent:true,opacity:.22});
    curbZones=new THREE.InstancedMesh(geo,mat,48);curbZones.name='TGG_PICKUP_DROPOFF_V92';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const anchors=[[-36,10],[36,12],[-30,-34],[30,-36],[0,62],[0,-68]];
    for(let i=0;i<48;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length)-3.5;
      p.set(a[0]+row*7.2,.055,a[1]);
      q.identity();m.compose(p,q,s);curbZones.setMatrixAt(i,m);
    }
    curbZones.instanceMatrix.needsUpdate=true;scene.add(curbZones);
  }

  let signs=scene.getObjectByName?.('TGG_MOBILITY_SIGNS_V92');
  if(!signs&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.8,.72,.12);
    const mat=new THREE.MeshBasicMaterial({color:0xd9f0ff,transparent:true,opacity:.74});
    signs=new THREE.InstancedMesh(geo,mat,36);signs.name='TGG_MOBILITY_SIGNS_V92';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<36;i++){
      const a=(i/36)*Math.PI*2,r=58+(i%4)*16;
      p.set(Math.cos(a)*r,2.4+(i%3)*.4,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      const sc=.8+(i%3)*.1;s.set(sc,1,1);m.compose(p,q,s);signs.setMatrixAt(i,m);
    }
    signs.instanceMatrix.needsUpdate=true;scene.add(signs);
  }

  let truckGlow=scene.getObjectByName?.('TGG_FOOD_TRUCK_GLOW_V92');
  if(!truckGlow&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(2.7,18);
    const mat=new THREE.MeshBasicMaterial({color:0xffa15f,transparent:true,opacity:.12,depthWrite:false});
    truckGlow=new THREE.InstancedMesh(geo,mat,12);truckGlow.name='TGG_FOOD_TRUCK_GLOW_V92';
    const spots=[[-28,52],[32,54],[-70,-12],[72,-8],[-24,-72],[28,-70],[205,300],[250,345],[-275,270],[-315,315],[25,405],[-28,410]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    spots.forEach((pt,i)=>{
      p.set(pt[0],.03,pt[1]);q.setFromEuler(new THREE.Euler(-Math.PI/2,0,0));m.compose(p,q,s);truckGlow.setMatrixAt(i,m);
    });
    truckGlow.instanceMatrix.needsUpdate=true;scene.add(truckGlow);
  }

  let lastSig='';
  const availability={
    downtown:'ride,eats,courier,scooter,bike,moto',
    studio:'ride,eats,courier,scooter,moto',
    media:'ride,eats,courier,scooter,bike',
    park:'eats,scooter,bike',
    home:'ride,eats,courier,bike',
    garage:'ride,courier,moto'
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const available=availability[district]||availability.downtown;
    const sig=[district,time,weather,quality,driving?'1':'0',available].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(curbZones){
        curbZones.visible=!balanced||driving;
        curbZones.material.opacity=night?.34:wet?.28:.2;
        curbZones.material.color.setHex(night?0x86dfff:0x6fd3ff);
      }
      if(signs){
        signs.visible=!balanced;
        signs.material.opacity=night?.9:.68;
      }
      if(truckGlow){
        truckGlow.visible=(night||time==='golden')&&!balanced;
        truckGlow.material.opacity=night?.18:.1;
      }
      hubs.children.forEach(o=>{
        const svc=String(o.userData?.tggMobilityHubV92||'');
        const active=available.split(',').includes(svc);
        o.visible=active;
      });
    }

    const mobilityPanel=document.getElementById('tgg-mobility-v91');
    if(mobilityPanel)mobilityPanel.dataset.tggDistrictServicesV92=available;

    root.dataset.tggMobilityDistrictServicesV92=available;
    root.dataset.tggMobilityHubsV92='6';
    root.dataset.tggPickupDropoffZonesV92=curbZones?'48':'0';
    root.dataset.tggMobilitySignsV92=signs?'36':'0';
    root.dataset.tggFoodTruckGlowV92=truckGlow?'12':'0';
    root.dataset.tggMobilityWorldIntegrationV92='1';
  };

  window.TGGMobilityWorldV92={apply,availability};
  apply();
}
function applyMobilityWorldIntegrationV92(){window.TGGMobilityWorldV92?.apply?.()||installMobilityWorldIntegrationV92()}

function installWorldLifeDirectorV93(){
  if(window.TGGWorldLifeV93)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldLifeDirectorV93='waiting';return}
  const scene=w.scene;

  let awnings=scene.getObjectByName?.('TGG_BUSINESS_AWNINGS_V93');
  if(!awnings&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(4.4,.18,1.4);
    const mat=new THREE.MeshStandardMaterial({color:0x7a394d,roughness:.72,metalness:.05});
    awnings=new THREE.InstancedMesh(geo,mat,64);awnings.name='TGG_BUSINESS_AWNINGS_V93';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const side=i%4,step=Math.floor(i/4)-8;let x=0,z=0,r=0;
      const d=76+(i%3)*10;
      if(side===0){x=-d;z=step*17;r=Math.PI/2}
      if(side===1){x=d;z=step*17;r=-Math.PI/2}
      if(side===2){x=step*17;z=-d;r=0}
      if(side===3){x=step*17;z=d;r=Math.PI}
      p.set(x,3.7,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.8+(i%4)*.08;s.set(sc,1,1);m.compose(p,q,s);awnings.setMatrixAt(i,m);
    }
    awnings.instanceMatrix.needsUpdate=true;scene.add(awnings);
  }

  let commerceGlow=scene.getObjectByName?.('TGG_COMMERCE_GLOW_V93');
  if(!commerceGlow&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(2.1,16);
    const mat=new THREE.MeshBasicMaterial({color:0xffc16e,transparent:true,opacity:.1,depthWrite:false});
    commerceGlow=new THREE.InstancedMesh(geo,mat,40);commerceGlow.name='TGG_COMMERCE_GLOW_V93';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<40;i++){
      const a=(i/40)*Math.PI*2,r=54+(i%5)*22;
      p.set(Math.cos(a)*r,.026,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,0));m.compose(p,q,s);commerceGlow.setMatrixAt(i,m);
    }
    commerceGlow.instanceMatrix.needsUpdate=true;scene.add(commerceGlow);
  }

  let parkProps=scene.getObjectByName?.('TGG_PARK_LIFE_PROPS_V93');
  if(!parkProps&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.4,.32,.65);
    const mat=new THREE.MeshStandardMaterial({color:0x5b4a37,roughness:.92,metalness:.02});
    parkProps=new THREE.InstancedMesh(geo,mat,28);parkProps.name='TGG_PARK_LIFE_PROPS_V93';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<28;i++){
      const a=(i/28)*Math.PI*2,r=42+(i%4)*9;
      p.set(245+Math.cos(a)*r,.34,320+Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a,0));m.compose(p,q,s);parkProps.setMatrixAt(i,m);
    }
    parkProps.instanceMatrix.needsUpdate=true;scene.add(parkProps);
  }

  let serviceLights=scene.getObjectByName?.('TGG_SERVICE_ACTIVITY_V93');
  if(!serviceLights&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.45,.08,2.2);
    const mat=new THREE.MeshBasicMaterial({color:0x76d9ff,transparent:true,opacity:.24,depthWrite:false});
    serviceLights=new THREE.InstancedMesh(geo,mat,54);serviceLights.name='TGG_SERVICE_ACTIVITY_V93';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<54;i++){
      const side=i%3,step=Math.floor(i/3)-9;
      p.set(side===0?-12:side===1?12:step*8.4,.05,side<2?step*8.4:12);
      q.setFromEuler(new THREE.Euler(0,side===2?Math.PI/2:0,0));m.compose(p,q,s);serviceLights.setMatrixAt(i,m);
    }
    serviceLights.instanceMatrix.needsUpdate=true;scene.add(serviceLights);
  }

  let lastSig='';
  const districtActivity={
    downtown:{ped:1,traffic:1,business:1},
    studio:{ped:.78,traffic:.82,business:.92},
    media:{ped:.88,traffic:.9,business:.96},
    park:{ped:.72,traffic:.45,business:.5},
    home:{ped:.6,traffic:.62,business:.58},
    garage:{ped:.35,traffic:.72,business:.48}
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const cfg=districtActivity[district]||districtActivity.downtown;
    const night=time==='night',gold=time==='golden',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const weatherScale=wet?.72:1;
    const timeScale=night?1.08:gold?1.04:1;
    const pedLevel=Math.max(.15,cfg.ped*weatherScale*(driving?.6:1));
    const trafficLevel=Math.max(.2,cfg.traffic*(wet?.82:1));
    const businessLevel=Math.max(.2,cfg.business*timeScale);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(awnings){
        awnings.visible=district!=='park'&&!balanced;
        awnings.material.color.setHex(district==='studio'?0x6e415f:district==='media'?0x405f78:district==='home'?0x665545:0x7a394d);
      }
      if(commerceGlow){
        commerceGlow.visible=(night||gold)&&district!=='park'&&!balanced;
        commerceGlow.material.opacity=Math.min(.2,.07+businessLevel*.08);
      }
      if(parkProps)parkProps.visible=district==='park'||district==='home';
      if(serviceLights){
        serviceLights.visible=(night||wet||driving)&&!balanced;
        serviceLights.material.opacity=night?.34:wet?.29:.2;
      }
    }

    const pedestrians=[
      scene.getObjectByName?.('TGG_PEDESTRIAN_POCKETS_V77'),
      scene.getObjectByName?.('TGG_AMBIENT_LIFE_V76')
    ].filter(Boolean);
    pedestrians.forEach(g=>{
      g.visible=!balanced&&pedLevel>.3&&!driving;
      g.userData.tggActivityLevelV93=pedLevel;
    });

    const traffic=w.traffic||[];
    traffic.forEach((v,i)=>{
      if(!v)return;
      const active=i<Math.max(1,Math.round(traffic.length*trafficLevel));
      if(v.visible!==undefined)v.visible=active;
      if(v.userData){
        v.userData.tggWorldLifeActivityV93=active?'active':'culled';
        v.userData.tggWorldLifeDistrictV93=district;
      }
    });

    const mobility=scene.getObjectByName?.('TGG_MOBILITY_HUBS_V92');
    if(mobility)mobility.userData.tggWorldLifeActivityV93=businessLevel;

    root.dataset.tggBusinessAwningsV93=awnings?'64':'0';
    root.dataset.tggCommerceGlowV93=commerceGlow?'40':'0';
    root.dataset.tggParkLifePropsV93=parkProps?'28':'0';
    root.dataset.tggServiceActivityV93=serviceLights?'54':'0';
    root.dataset.tggPedestrianActivityV93=pedLevel.toFixed(2);
    root.dataset.tggTrafficActivityV93=trafficLevel.toFixed(2);
    root.dataset.tggBusinessActivityV93=businessLevel.toFixed(2);
    root.dataset.tggWorldLifeDirectorV93='1';
  };

  window.TGGWorldLifeV93={apply,districtActivity};
  apply();
}
function applyWorldLifeDirectorV93(){window.TGGWorldLifeV93?.apply?.()||installWorldLifeDirectorV93()}

function installWholeWorldIntegrationV94(){
  if(window.TGGWholeWorldV94)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWholeWorldIntegrationV94='waiting';return}
  const scene=w.scene;

  let plaza=scene.getObjectByName?.('TGG_PUBLIC_REALM_V94');
  if(!plaza&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.8,.08,3.8);
    const mat=new THREE.MeshStandardMaterial({color:0x555d66,roughness:.9,metalness:.03});
    plaza=new THREE.InstancedMesh(geo,mat,96);plaza.name='TGG_PUBLIC_REALM_V94';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*2,r=32+(i%8)*12;
      p.set(Math.cos(a)*r,.045,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.2,0));
      const sc=.78+(i%5)*.06;s.set(sc,1,sc);m.compose(p,q,s);plaza.setMatrixAt(i,m);
    }
    plaza.instanceMatrix.needsUpdate=true;scene.add(plaza);
  }

  let bollards=scene.getObjectByName?.('TGG_BOLLARDS_V94');
  if(!bollards&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.11,.14,.82,8);
    const mat=new THREE.MeshStandardMaterial({color:0x343b44,roughness:.62,metalness:.48});
    bollards=new THREE.InstancedMesh(geo,mat,72);bollards.name='TGG_BOLLARDS_V94';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<72;i++){
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0;
      if(side===0){x=-18;z=step*9}
      if(side===1){x=18;z=step*9}
      if(side===2){x=step*9;z=-18}
      if(side===3){x=step*9;z=18}
      p.set(x,.41,z);q.identity();m.compose(p,q,s);bollards.setMatrixAt(i,m);
    }
    bollards.instanceMatrix.needsUpdate=true;scene.add(bollards);
  }

  let districtGlow=scene.getObjectByName?.('TGG_DISTRICT_GLOW_V94');
  if(!districtGlow){
    districtGlow=new THREE.Group();districtGlow.name='TGG_DISTRICT_GLOW_V94';
    const specs=[
      ['downtown',0,-300,0x79c8ff],['studio',-300,-90,0xff6fb5],['media',290,-35,0x7aa7ff],
      ['park',215,280,0x7fdc9a],['home',-260,250,0xffd18a],['garage',0,370,0x8fdcff]
    ];
    specs.forEach(([name,x,z,color])=>{
      const m=new THREE.Mesh(new THREE.CircleGeometry(20,28),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.08,depthWrite:false}));
      m.rotation.x=-Math.PI/2;m.position.set(x,.02,z);m.userData.tggDistrictV94=name;districtGlow.add(m);
    });
    scene.add(districtGlow);
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
      if(plaza){
        plaza.visible=!balanced||district==='downtown'||district==='studio';
        plaza.material.roughness=wet?.56:.9;
        plaza.material.color.setHex(district==='studio'?0x625866:district==='park'?0x59645a:0x555d66);
      }
      if(bollards)bollards.visible=district!=='park'&&(!balanced||district==='downtown');
      districtGlow.children.forEach(o=>{
        const active=o.userData?.tggDistrictV94===district;
        o.material.opacity=active?(night?.22:wet?.14:.09):.025;
      });

      const mobility=scene.getObjectByName?.('TGG_MOBILITY_HUBS_V92');
      if(mobility)mobility.children.forEach(o=>{
        if(o.material&&'emissiveIntensity'in o.material)o.material.emissiveIntensity=night?.3:.08;
      });

      const awnings=scene.getObjectByName?.('TGG_BUSINESS_AWNINGS_V93');
      if(awnings?.material){
        awnings.material.roughness=wet?.48:.72;
        awnings.material.color.setHex(district==='studio'?0x74465e:district==='media'?0x4b617a:0x7a394d);
      }

      const commerce=scene.getObjectByName?.('TGG_COMMERCE_GLOW_V93');
      if(commerce?.material)commerce.material.opacity=night?.18:wet?.13:.08;
    }

    if(w.camera){
      const base=driving?76:63;
      const speed=Number(root.dataset.tggVisualSpeedV54||0);
      const target=base+Math.min(8,speed*.16);
      if(Math.abs(Number(w.camera.fov||0)-target)>.1){
        w.camera.fov+=(target-w.camera.fov)*.1;
        w.camera.updateProjectionMatrix?.();
      }
      w.camera.far=Math.max(Number(w.camera.far||0),4800);
    }

    root.dataset.tggPublicRealmV94=plaza?'96':'0';
    root.dataset.tggBollardsV94=bollards?'72':'0';
    root.dataset.tggDistrictGlowV94='6';
    root.dataset.tggIntegratedCameraDepthV94='4800';
    root.dataset.tggWholeWorldIntegrationV94='1';
  };

  window.TGGWholeWorldV94={apply};
  apply();
}
function applyWholeWorldIntegrationV94(){window.TGGWholeWorldV94?.apply?.()||installWholeWorldIntegrationV94()}

function installWholeWorldFinishV95(){
  if(window.TGGWholeWorldFinishV95)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWholeWorldFinishV95='waiting';return}
  const scene=w.scene;

  let transitionMesh=scene.getObjectByName?.('TGG_DISTRICT_BLEND_MESH_V95');
  if(!transitionMesh&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(18,7);
    const mat=new THREE.MeshBasicMaterial({color:0x6f8194,transparent:true,opacity:.055,depthWrite:false,side:THREE.DoubleSide});
    transitionMesh=new THREE.InstancedMesh(geo,mat,48);transitionMesh.name='TGG_DISTRICT_BLEND_MESH_V95';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<48;i++){
      const a=(i/48)*Math.PI*2,r=190+(i%6)*48;
      p.set(Math.cos(a)*r,.03,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.8+(i%4)*.1;s.set(sc,1,1);m.compose(p,q,s);transitionMesh.setMatrixAt(i,m);
    }
    transitionMesh.instanceMatrix.needsUpdate=true;scene.add(transitionMesh);
  }

  let interiorDepth=scene.getObjectByName?.('TGG_INTERIOR_DEPTH_V95');
  if(!interiorDepth&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(4.4,3.2,2.2);
    const mat=new THREE.MeshPhysicalMaterial({color:0x53606f,roughness:.16,metalness:.08,transparent:true,opacity:.14,transmission:.08});
    interiorDepth=new THREE.InstancedMesh(geo,mat,84);interiorDepth.name='TGG_INTERIOR_DEPTH_V95';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const side=i%4,step=Math.floor(i/4)-10;let x=0,z=0,r=0;
      const d=88+(i%4)*9;
      if(side===0){x=-d;z=step*15;r=Math.PI/2}
      if(side===1){x=d;z=step*15;r=-Math.PI/2}
      if(side===2){x=step*15;z=-d;r=0}
      if(side===3){x=step*15;z=d;r=Math.PI}
      p.set(x,1.75,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.82+(i%3)*.09;s.set(sc,.92+(i%4)*.03,1);m.compose(p,q,s);interiorDepth.setMatrixAt(i,m);
    }
    interiorDepth.instanceMatrix.needsUpdate=true;scene.add(interiorDepth);
  }

  let terrainBlend=scene.getObjectByName?.('TGG_TERRAIN_BLEND_V95');
  if(!terrainBlend&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(6,18);
    const mat=new THREE.MeshBasicMaterial({color:0x52604e,transparent:true,opacity:.1,depthWrite:false});
    terrainBlend=new THREE.InstancedMesh(geo,mat,96);terrainBlend.name='TGG_TERRAIN_BLEND_V95';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*5,r=420+(i%12)*28;
      p.set(Math.cos(a)*r,.02,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.65+(i%6)*.11;s.set(sc,sc*.8,1);m.compose(p,q,s);terrainBlend.setMatrixAt(i,m);
    }
    terrainBlend.instanceMatrix.needsUpdate=true;scene.add(terrainBlend);
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
      if(transitionMesh){
        transitionMesh.visible=!balanced||driving;
        transitionMesh.material.opacity=wet?.08:night?.065:.05;
        transitionMesh.material.color.setHex(
          district==='park'?0x607b67:district==='home'?0x786f61:district==='studio'?0x78667b:0x6f8194
        );
      }
      if(interiorDepth){
        interiorDepth.visible=district!=='park'&&!balanced;
        interiorDepth.material.opacity=night?.22:wet?.18:.13;
        interiorDepth.material.roughness=wet?.08:.16;
      }
      if(terrainBlend){
        terrainBlend.visible=district==='park'||district==='home'||driving;
        terrainBlend.material.color.setHex(district==='park'?0x4d684f:0x625f51);
        terrainBlend.material.opacity=wet?.07:.1;
      }
    }

    const traffic=w.traffic||[];
    const density=district==='downtown'?1:district==='media'?.9:district==='studio'?.84:district==='garage'?.76:district==='home'?.62:.46;
    traffic.forEach((v,i)=>{
      if(!v)return;
      const keep=i<Math.ceil(traffic.length*density);
      if(v.visible!==undefined)v.visible=keep;
      if(v.userData){
        v.userData.tggExplorationDensityV95=density;
        v.userData.tggExplorationZoneV95=district;
      }
    });

    if(w.camera){
      const speed=Number(root.dataset.tggVisualSpeedV54||0);
      const targetFov=driving?Math.min(84,72+speed*.22):62;
      if(Math.abs(Number(w.camera.fov||0)-targetFov)>.05){
        w.camera.fov+=(targetFov-w.camera.fov)*.1;
        w.camera.updateProjectionMatrix?.();
      }
      w.camera.far=Math.max(Number(w.camera.far||0),4800);
    }

    const avatarLight=scene.getObjectByName?.('TGG_AVATAR_KEYLIGHT_V79');
    if(avatarLight)avatarLight.intensity=driving?0:(night?1.25:wet?.7:.5);
    const contact=scene.getObjectByName?.('TGG_CONTACT_LIGHT_V90');
    if(contact)contact.intensity=balanced?0:(night?.9:wet?.58:.28);

    root.dataset.tggDistrictContinuityV95='1';
    root.dataset.tggInteriorDepthV95=interiorDepth?'84':'0';
    root.dataset.tggTerrainBlendV95=terrainBlend?'96':'0';
    root.dataset.tggExplorationTrafficDensityV95=String(density);
    root.dataset.tggExplorationCameraV95=driving?'drive-cohesive':'walk-cohesive';
    root.dataset.tggWholeWorldFinishV95='1';
  };

  window.TGGWholeWorldFinishV95={apply};
  apply();
}
function applyWholeWorldFinishV95(){window.TGGWholeWorldFinishV95?.apply?.()||installWholeWorldFinishV95()}

function installStreetCohesionV96(){
  if(window.TGGStreetCohesionV96)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggStreetCohesionV96='waiting';return}
  const scene=w.scene;

  let crosswalks=scene.getObjectByName?.('TGG_CROSSWALKS_V96');
  if(!crosswalks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.45,.018,3.6);
    const mat=new THREE.MeshBasicMaterial({color:0xf0eee5,transparent:true,opacity:.78});
    crosswalks=new THREE.InstancedMesh(geo,mat,128);crosswalks.name='TGG_CROSSWALKS_V96';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<128;i++){
      const intersection=Math.floor(i/16),stripe=i%16;
      const centers=[[-72,-72],[72,-72],[-72,72],[72,72],[-145,0],[145,0],[0,-145],[0,145]];
      const b=centers[intersection]||[0,0],axis=intersection%2;
      p.set(b[0]+(axis?stripe-7.5:0)*.72,.06,b[1]+(axis?0:stripe-7.5)*.72);
      q.setFromEuler(new THREE.Euler(0,axis?0:Math.PI/2,0));
      m.compose(p,q,s);crosswalks.setMatrixAt(i,m);
    }
    crosswalks.instanceMatrix.needsUpdate=true;scene.add(crosswalks);
  }

  let curbCuts=scene.getObjectByName?.('TGG_CURB_CUTS_V96');
  if(!curbCuts&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.6,.12,1.8);
    const mat=new THREE.MeshStandardMaterial({color:0x7a7d80,roughness:.93,metalness:.01});
    curbCuts=new THREE.InstancedMesh(geo,mat,64);curbCuts.name='TGG_CURB_CUTS_V96';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const a=(i/64)*Math.PI*2,r=92+(i%4)*42;
      p.set(Math.cos(a)*r,.06,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a,0));
      s.set(.85+(i%3)*.08,.7,1);m.compose(p,q,s);curbCuts.setMatrixAt(i,m);
    }
    curbCuts.instanceMatrix.needsUpdate=true;scene.add(curbCuts);
  }

  let utility=scene.getObjectByName?.('TGG_UTILITY_FIXTURES_V96');
  if(!utility&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.055,.075,5.8,6);
    const mat=new THREE.MeshStandardMaterial({color:0x3c444e,roughness:.66,metalness:.5});
    utility=new THREE.InstancedMesh(geo,mat,84);utility.name='TGG_UTILITY_FIXTURES_V96';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<84;i++){
      const side=i%4,step=Math.floor(i/4)-10;let x=0,z=0;
      if(side===0){x=-19;z=step*24}
      if(side===1){x=19;z=step*24}
      if(side===2){x=step*24;z=-19}
      if(side===3){x=step*24;z=19}
      p.set(x,2.9,z);q.identity();m.compose(p,q,s);utility.setMatrixAt(i,m);
    }
    utility.instanceMatrix.needsUpdate=true;scene.add(utility);
  }

  let interior=scene.getObjectByName?.('TGG_ENTRY_DEPTH_V96');
  if(!interior&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.6,3,2.8);
    const mat=new THREE.MeshPhysicalMaterial({color:0x4f5c69,roughness:.12,metalness:.06,transparent:true,opacity:.13,transmission:.09});
    interior=new THREE.InstancedMesh(geo,mat,60);interior.name='TGG_ENTRY_DEPTH_V96';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<60;i++){
      const side=i%4,step=Math.floor(i/4)-7;let x=0,z=0,r=0;
      const d=70+(i%4)*12;
      if(side===0){x=-d;z=step*18;r=Math.PI/2}
      if(side===1){x=d;z=step*18;r=-Math.PI/2}
      if(side===2){x=step*18;z=-d;r=0}
      if(side===3){x=step*18;z=d;r=Math.PI}
      p.set(x,1.6,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.82+(i%3)*.08;s.set(sc,.92,1);m.compose(p,q,s);interior.setMatrixAt(i,m);
    }
    interior.instanceMatrix.needsUpdate=true;scene.add(interior);
  }

  let shoulders=scene.getObjectByName?.('TGG_TERRAIN_SHOULDERS_V96');
  if(!shoulders&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(8,3.8);
    const mat=new THREE.MeshBasicMaterial({color:0x4e5b4b,transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide});
    shoulders=new THREE.InstancedMesh(geo,mat,96);shoulders.name='TGG_TERRAIN_SHOULDERS_V96';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*2,r=420+(i%8)*35;
      p.set(Math.cos(a)*r,.025,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.75+(i%5)*.1;s.set(sc,1,1);m.compose(p,q,s);shoulders.setMatrixAt(i,m);
    }
    shoulders.instanceMatrix.needsUpdate=true;scene.add(shoulders);
  }

  let contact=scene.getObjectByName?.('TGG_WORLD_CONTACT_LIGHT_V96');
  if(!contact){
    contact=new THREE.PointLight(0xddeeff,0,10,2);
    contact.name='TGG_WORLD_CONTACT_LIGHT_V96';scene.add(contact);
  }

  let avatar=null,lastAvatarScan=0,lastSig='';
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
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(crosswalks){
        crosswalks.visible=district!=='park';
        crosswalks.material.opacity=wet?.62:.78;
      }
      if(curbCuts){
        curbCuts.visible=district!=='park'||district==='home';
        curbCuts.material.roughness=wet?.58:.93;
      }
      if(utility)utility.visible=!balanced||district==='downtown'||district==='studio';
      if(interior){
        interior.visible=district!=='park'&&!balanced;
        interior.material.opacity=night?.22:wet?.18:.12;
      }
      if(shoulders){
        shoulders.visible=(district==='park'||district==='home'||driving)&&!balanced;
        shoulders.material.opacity=wet?.09:.14;
        shoulders.material.color.setHex(district==='park'?0x47634a:0x5b5a4d);
      }
    }

    const av=findAvatar();
    const focus=driving?w.car:av;
    if(focus?.position&&!balanced){
      contact.position.set(focus.position.x,focus.position.y+1.1,focus.position.z);
      contact.intensity=night?1.0:wet?.6:.3;
      contact.color.setHex(night?0xa6cfff:wet?0xc5dcec:0xffdfb8);
      root.dataset.tggStreetContactLightingV96=driving?'vehicle':'avatar';
    }else{
      contact.intensity=0;
      root.dataset.tggStreetContactLightingV96=focus?'disabled-balanced':'waiting';
    }

    root.dataset.tggCrosswalksV96=crosswalks?'128':'0';
    root.dataset.tggCurbCutsV96=curbCuts?'64':'0';
    root.dataset.tggUtilityFixturesV96=utility?'84':'0';
    root.dataset.tggEntryDepthV96=interior?'60':'0';
    root.dataset.tggTerrainShouldersV96=shoulders?'96':'0';
    root.dataset.tggStreetCohesionV96='1';
  };

  window.TGGStreetCohesionV96={apply};
  apply();
}
function applyStreetCohesionV96(){window.TGGStreetCohesionV96?.apply?.()||installStreetCohesionV96()}

function installUrbanFinishV97(){
  if(window.TGGUrbanFinishV97)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggUrbanFinishV97='waiting';return}
  const scene=w.scene;

  let rooftops=scene.getObjectByName?.('TGG_ROOFTOP_DETAIL_V97');
  if(!rooftops&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.2,1.4,2.4);
    const mat=new THREE.MeshStandardMaterial({color:0x4b5159,roughness:.84,metalness:.18});
    rooftops=new THREE.InstancedMesh(geo,mat,72);rooftops.name='TGG_ROOFTOP_DETAIL_V97';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const a=(i/72)*Math.PI*2,r=120+(i%8)*26,y=16+(i%6)*4;
      p.set(Math.cos(a)*r,y,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.5,0));
      const sc=.75+(i%5)*.12;s.set(sc,.8+(i%4)*.1,sc);m.compose(p,q,s);rooftops.setMatrixAt(i,m);
    }
    rooftops.instanceMatrix.needsUpdate=true;scene.add(rooftops);
  }

  let reflectors=scene.getObjectByName?.('TGG_LANE_REFLECTORS_V97');
  if(!reflectors&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.18,.05,.36);
    const mat=new THREE.MeshBasicMaterial({color:0xf7f0c2});
    reflectors=new THREE.InstancedMesh(geo,mat,220);reflectors.name='TGG_LANE_REFLECTORS_V97';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<220;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-27;
      p.set(axis?step*8:side*2.4,.065,axis?side*2.4:step*8);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);reflectors.setMatrixAt(i,m);
    }
    reflectors.instanceMatrix.needsUpdate=true;scene.add(reflectors);
  }

  let publicRealm=scene.getObjectByName?.('TGG_PUBLIC_REALM_V97');
  if(!publicRealm){
    publicRealm=new THREE.Group();publicRealm.name='TGG_PUBLIC_REALM_V97';
    const benchMat=new THREE.MeshStandardMaterial({color:0x5f4b3a,roughness:.88});
    const metalMat=new THREE.MeshStandardMaterial({color:0x47505a,roughness:.62,metalness:.42});
    for(let i=0;i<28;i++){
      const a=(i/28)*Math.PI*2,r=48+(i%5)*13;
      const bench=new THREE.Mesh(new THREE.BoxGeometry(2.6,.22,.7),benchMat);
      bench.position.set(Math.cos(a)*r,.65,Math.sin(a)*r);bench.rotation.y=-a;publicRealm.add(bench);
      const bin=new THREE.Mesh(new THREE.CylinderGeometry(.28,.32,.8,8),metalMat);
      bin.position.set(Math.cos(a)*(r+2.1),.4,Math.sin(a)*(r+2.1));publicRealm.add(bin);
    }
    scene.add(publicRealm);
  }

  let busStops=scene.getObjectByName?.('TGG_BUS_STOPS_V97');
  if(!busStops){
    busStops=new THREE.Group();busStops.name='TGG_BUS_STOPS_V97';
    const frameMat=new THREE.MeshStandardMaterial({color:0x38424c,roughness:.58,metalness:.5});
    const glassMat=new THREE.MeshPhysicalMaterial({color:0x7896ad,roughness:.08,metalness:.04,transparent:true,opacity:.22,transmission:.12});
    const pts=[[-80,20],[80,-20],[-20,80],[20,-80],[-150,45],[150,-45],[-45,-150],[45,150]];
    pts.forEach(([x,z],i)=>{
      const g=new THREE.Group();
      const roof=new THREE.Mesh(new THREE.BoxGeometry(4.5,.18,1.8),frameMat);roof.position.y=2.6;g.add(roof);
      const glass=new THREE.Mesh(new THREE.BoxGeometry(4.2,2.2,.12),glassMat);glass.position.set(0,1.45,-.8);g.add(glass);
      const bench=new THREE.Mesh(new THREE.BoxGeometry(2.6,.22,.6),frameMat);bench.position.set(0,.65,0);g.add(bench);
      g.position.set(x,0,z);g.rotation.y=i%2?Math.PI/2:0;busStops.add(g);
    });
    scene.add(busStops);
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
      if(rooftops)rooftops.visible=quality!=='balanced'||district==='downtown'||district==='media';
      if(reflectors){
        reflectors.visible=driving||night||wet;
        reflectors.material.color.setHex(wet?0xbfdfff:night?0xfff0b5:0xf7f0c2);
      }
      if(publicRealm)publicRealm.visible=!driving&&district!=='garage'&&!balanced;
      if(busStops)busStops.visible=district!=='park'&&(!balanced||district==='downtown'||district==='home');
    }

    root.dataset.tggRooftopDetailV97=rooftops?'72':'0';
    root.dataset.tggLaneReflectorsV97=reflectors?'220':'0';
    root.dataset.tggPublicRealmV97=publicRealm?'56':'0';
    root.dataset.tggBusStopsV97=busStops?'8':'0';
    root.dataset.tggUrbanFinishModeV97=district;
    root.dataset.tggUrbanFinishV97='1';
  };

  window.TGGUrbanFinishV97={apply};
  apply();
}
function applyUrbanFinishV97(){window.TGGUrbanFinishV97?.apply?.()||installUrbanFinishV97()}

function installEnvironmentalRealismV98(){
  if(window.TGGEnvironmentalRealismV98)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggEnvironmentalRealismV98='waiting';return}
  const scene=w.scene;

  let roadWear=scene.getObjectByName?.('TGG_ROAD_WEAR_V98');
  if(!roadWear&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(3.8,1.3);
    const mat=new THREE.MeshBasicMaterial({color:0x262a2f,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide});
    roadWear=new THREE.InstancedMesh(geo,mat,156);roadWear.name='TGG_ROAD_WEAR_V98';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<156;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-19;
      p.set(axis?step*7.8:side*3.2,.052,axis?side*3.2:step*7.8);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,axis?Math.PI/2:0));
      const sc=.75+(i%6)*.08;s.set(sc,.65+(i%4)*.08,1);m.compose(p,q,s);roadWear.setMatrixAt(i,m);
    }
    roadWear.instanceMatrix.needsUpdate=true;scene.add(roadWear);
  }

  let curbPaint=scene.getObjectByName?.('TGG_CURB_PAINT_V98');
  if(!curbPaint&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.8,.08,.18);
    const mat=new THREE.MeshBasicMaterial({color:0xd9d0b6,transparent:true,opacity:.48});
    curbPaint=new THREE.InstancedMesh(geo,mat,132);curbPaint.name='TGG_CURB_PAINT_V98';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<132;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-16;
      p.set(axis?step*8.1:side*10.05,.235,axis?side*10.05:step*8.1);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));m.compose(p,q,s);curbPaint.setMatrixAt(i,m);
    }
    curbPaint.instanceMatrix.needsUpdate=true;scene.add(curbPaint);
  }

  let windowLife=scene.getObjectByName?.('TGG_WINDOW_OCCUPANCY_V98');
  if(!windowLife&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.5,.82);
    const mat=new THREE.MeshBasicMaterial({color:0xffd8a6,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide});
    windowLife=new THREE.InstancedMesh(geo,mat,168);windowLife.name='TGG_WINDOW_OCCUPANCY_V98';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<168;i++){
      const side=i%4,step=Math.floor(i/4)-21,level=i%7;let x=0,z=0,r=0;
      const d=108+(i%5)*12;
      if(side===0){x=-d;z=step*11;r=Math.PI/2}
      if(side===1){x=d;z=step*11;r=-Math.PI/2}
      if(side===2){x=step*11;z=-d;r=0}
      if(side===3){x=step*11;z=d;r=Math.PI}
      p.set(x,5.5+level*3.4,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.72+(i%3)*.1;s.set(sc,sc,1);m.compose(p,q,s);windowLife.setMatrixAt(i,m);
    }
    windowLife.instanceMatrix.needsUpdate=true;scene.add(windowLife);
  }

  let parking=scene.getObjectByName?.('TGG_PARKING_EDGE_DETAIL_V98');
  if(!parking&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.12,.025,4.4);
    const mat=new THREE.MeshBasicMaterial({color:0xe3dfcf,transparent:true,opacity:.66});
    parking=new THREE.InstancedMesh(geo,mat,96);parking.name='TGG_PARKING_EDGE_DETAIL_V98';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const side=i%4,step=Math.floor(i/4)-12;let x=0,z=0,r=0;
      if(side===0){x=-13.2;z=step*9.5;r=0}
      if(side===1){x=13.2;z=step*9.5;r=0}
      if(side===2){x=step*9.5;z=-13.2;r=Math.PI/2}
      if(side===3){x=step*9.5;z=13.2;r=Math.PI/2}
      p.set(x,.062,z);q.setFromEuler(new THREE.Euler(0,r,0));m.compose(p,q,s);parking.setMatrixAt(i,m);
    }
    parking.instanceMatrix.needsUpdate=true;scene.add(parking);
  }

  let lastSig='',windPhase=0;
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather),storm=/storm/.test(weather);
    const sig=[district,time,weather,quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(roadWear){
        roadWear.visible=district!=='park';
        roadWear.material.opacity=wet?.11:district==='garage'?.22:.18;
      }
      if(curbPaint){
        curbPaint.visible=district!=='park'||!balanced;
        curbPaint.material.opacity=night?.58:.42;
        curbPaint.material.color.setHex(district==='studio'?0xe7c7d2:district==='media'?0xcbd9eb:0xd9d0b6);
      }
      if(windowLife){
        windowLife.visible=!balanced&&district!=='park';
        windowLife.material.opacity=night?.34:time==='golden'?.2:.08;
      }
      if(parking){
        parking.visible=district==='downtown'||district==='garage'||district==='studio'||district==='media';
        parking.material.opacity=wet?.72:.58;
      }
    }

    windPhase+=storm?.045:wet?.022:.012;
    const foliage=scene.getObjectByName?.('TGG_FOLIAGE_VARIETY_V83')||scene.getObjectByName?.('TGG_CITY_COUNTRY_BLEND_V89');
    if(foliage){
      foliage.rotation.z=Math.sin(windPhase)* (storm?.025:wet?.012:.006);
      foliage.rotation.x=Math.cos(windPhase*.7)* (storm?.014:.004);
      root.dataset.tggFoliageWindV98=storm?'storm':wet?'breeze':'light';
    }else root.dataset.tggFoliageWindV98='waiting';

    root.dataset.tggRoadWearV98=roadWear?'156':'0';
    root.dataset.tggCurbPaintV98=curbPaint?'132':'0';
    root.dataset.tggWindowOccupancyV98=windowLife?'168':'0';
    root.dataset.tggParkingEdgeDetailV98=parking?'96':'0';
    root.dataset.tggSurfaceAgingModelV98='district-weather-aware';
    root.dataset.tggEnvironmentalRealismV98='1';
  };

  window.TGGEnvironmentalRealismV98={apply};
  apply();
}
function applyEnvironmentalRealismV98(){window.TGGEnvironmentalRealismV98?.apply?.()||installEnvironmentalRealismV98()}

function installAtmosphericContinuityV99(){
  if(window.TGGAtmosphereV99)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggAtmosphericContinuityV99='waiting';return}
  const scene=w.scene;

  let puddles=scene.getObjectByName?.('TGG_PUDDLES_V99');
  if(!puddles&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(1.8,18);
    const mat=new THREE.MeshPhysicalMaterial({color:0x4f6572,roughness:.05,metalness:.05,transparent:true,opacity:.18,transmission:.12,depthWrite:false});
    puddles=new THREE.InstancedMesh(geo,mat,88);puddles.name='TGG_PUDDLES_V99';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<88;i++){
      const a=(i/88)*Math.PI*8,r=55+(i%12)*22;
      p.set(Math.cos(a)*r,.045,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.45+(i%7)*.12;s.set(sc,sc*.55,1);m.compose(p,q,s);puddles.setMatrixAt(i,m);
    }
    puddles.instanceMatrix.needsUpdate=true;scene.add(puddles);
  }

  let motes=scene.getObjectByName?.('TGG_ATMOSPHERIC_MOTES_V99');
  if(!motes){
    const count=180,geo=new THREE.BufferGeometry(),pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      pos[i*3]=(i%18-9)*8.5;
      pos[i*3+1]=1.2+(i%12)*1.7;
      pos[i*3+2]=(Math.floor(i/18)-5)*13.5;
    }
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({color:0xe3d7b2,size:.09,transparent:true,opacity:.2,depthWrite:false});
    motes=new THREE.Points(geo,mat);motes.name='TGG_ATMOSPHERIC_MOTES_V99';scene.add(motes);
  }

  let horizon=scene.getObjectByName?.('TGG_HORIZON_HAZE_V99');
  if(!horizon){
    const geo=new THREE.CylinderGeometry(980,980,170,64,1,true);
    const mat=new THREE.MeshBasicMaterial({color:0x8fa5b7,transparent:true,opacity:.035,depthWrite:false,side:THREE.BackSide});
    horizon=new THREE.Mesh(geo,mat);horizon.name='TGG_HORIZON_HAZE_V99';horizon.position.y=70;scene.add(horizon);
  }

  let blend=0,lastSig='',raf=0;
  const targetForWeather=wth=>/storm/.test(wth)?1:/rain/.test(wth)?.68:/fog|mist/.test(wth)?.48:0;

  const animate=()=>{
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const target=targetForWeather(weather);
    blend+=(target-blend)*.035;
    const t=performance.now()*.001;

    if(motes){
      const visible=quality!=='balanced'&&!/rain|storm/.test(weather)&&(district==='park'||district==='home'||district==='studio');
      motes.visible=visible;
      if(visible){
        motes.position.x=Math.sin(t*.12)*4.5;
        motes.position.z=Math.cos(t*.09)*3.5;
        motes.position.y=Math.sin(t*.18)*.35;
        motes.material.opacity=time==='golden'?.28:time==='night'?.08:.18;
      }
    }

    if(horizon){
      horizon.material.opacity=.025+blend*.055+(time==='golden'?.025:0);
      horizon.material.color.setHex(
        time==='golden'?0xc39a78:
        time==='night'?0x53667d:
        /storm/.test(weather)?0x6f7882:
        district==='park'?0x8fa99b:0x8fa5b7
      );
      const focus=driving?w.car?.position:w.camera?.position;
      if(focus){horizon.position.x=focus.x;horizon.position.z=focus.z}
    }

    root.dataset.tggWeatherBlendV99=blend.toFixed(2);
    raf=requestAnimationFrame(animate);
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(puddles){
        puddles.visible=wet&&!balanced&&district!=='park';
        puddles.material.opacity=/storm/.test(weather)?.28:.19;
        puddles.material.roughness=/storm/.test(weather)?.025:.05;
      }
      const roadWear=scene.getObjectByName?.('TGG_ROAD_WEAR_V98');
      if(roadWear?.material)roadWear.material.opacity=wet?.12:.18;
      const curbPaint=scene.getObjectByName?.('TGG_CURB_PAINT_V98');
      if(curbPaint?.material)curbPaint.material.opacity=wet?.36:.48;
    }

    root.dataset.tggPuddlesV99=puddles?'88':'0';
    root.dataset.tggAtmosphericMotesV99=motes?'180':'0';
    root.dataset.tggHorizonHazeV99=horizon?'1':'0';
    root.dataset.tggWeatherTransitionModelV99='smoothed';
    root.dataset.tggAtmosphericContinuityV99='1';
  };

  window.TGGAtmosphereV99={apply,get blend(){return blend},stop:()=>cancelAnimationFrame(raf)};
  apply();animate();
}
function applyAtmosphericContinuityV99(){window.TGGAtmosphereV99?.apply?.()||installAtmosphericContinuityV99()}

function installWorldMilestoneV100(){
  if(window.TGGWorldMilestoneV100)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldMilestoneV100='waiting';return}
  const scene=w.scene;

  let porch=scene.getObjectByName?.('TGG_NEIGHBORHOOD_PORCH_GLOW_V100');
  if(!porch&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.15,.52);
    const mat=new THREE.MeshBasicMaterial({color:0xffdf9e,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide});
    porch=new THREE.InstancedMesh(geo,mat,64);porch.name='TGG_NEIGHBORHOOD_PORCH_GLOW_V100';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const a=(i/64)*Math.PI*2,r=295+(i%4)*42;
      p.set(Math.cos(a)*r,2.25+(i%3)*.3,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      const sc=.82+(i%3)*.09;s.set(sc,sc,1);m.compose(p,q,s);porch.setMatrixAt(i,m);
    }
    porch.instanceMatrix.needsUpdate=true;scene.add(porch);
  }

  let decals=scene.getObjectByName?.('TGG_STREET_DECALS_V100');
  if(!decals&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.8,.62);
    const mat=new THREE.MeshBasicMaterial({color:0xc8c2b4,transparent:true,opacity:.15,depthWrite:false,side:THREE.DoubleSide});
    decals=new THREE.InstancedMesh(geo,mat,84);decals.name='TGG_STREET_DECALS_V100';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const a=(i/84)*Math.PI*8,r=42+(i%10)*19;
      p.set(Math.cos(a)*r,.04,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.6+(i%5)*.11;s.set(sc,sc*.55,1);m.compose(p,q,s);decals.setMatrixAt(i,m);
    }
    decals.instanceMatrix.needsUpdate=true;scene.add(decals);
  }

  let props=scene.getObjectByName?.('TGG_PUBLIC_SPACE_PROPS_V100');
  if(!props&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.8,.55,.55);
    const mat=new THREE.MeshStandardMaterial({color:0x4f565d,roughness:.86,metalness:.16});
    props=new THREE.InstancedMesh(geo,mat,48);props.name='TGG_PUBLIC_SPACE_PROPS_V100';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    const anchors=[[240,300],[260,326],[-292,286],[-316,308],[-42,-48],[38,-46]];
    for(let i=0;i<48;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length)-3.5;
      p.set(a[0]+row*3.6,.3,a[1]+((i%3)-1)*2.4);
      q.setFromEuler(new THREE.Euler(0,(i%2)*Math.PI/2,0));
      const sc=.82+(i%4)*.07;s.set(sc,1,1);m.compose(p,q,s);props.setMatrixAt(i,m);
    }
    props.instanceMatrix.needsUpdate=true;scene.add(props);
  }

  const lodGroups=[
    ['TGG_BUILDING_WINDOWS_V75',850],
    ['TGG_NEIGHBORHOOD_DEPTH_V76',1100],
    ['TGG_STOREFRONT_FRONTAGE_V77',700],
    ['TGG_FACADE_VARIATION_V78',900],
    ['TGG_DISTRICT_SIGNAGE_V79',760],
    ['TGG_STREET_REFLECTION_ACCENTS_V80',560],
    ['TGG_NEIGHBORHOOD_GLOW_V81',1000],
    ['TGG_STREET_RHYTHM_V82',650],
    ['TGG_WINDOW_REFLECTIONS_V83',900],
    ['TGG_STREET_CLUTTER_V84',520],
    ['TGG_CURB_MEDIAN_V90',720],
    ['TGG_PUDDLES_V99',420]
  ];
  const cached={};let lastBudget=0;

  const distanceBudget=()=>{
    const now=performance.now();if(now-lastBudget<1500)return;
    lastBudget=now;
    const focus=(root.dataset.tggDriving==='1'||state.driving)?w.car?.position:w.camera?.position;
    if(!focus)return;
    const balanced=(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high')==='balanced';
    lodGroups.forEach(([name,max])=>{
      let g=cached[name];if(!g?.parent){g=scene.getObjectByName?.(name);cached[name]=g}
      if(!g)return;
      const d=Math.hypot((g.position?.x||0)-focus.x,(g.position?.z||0)-focus.z);
      g.visible=d<(balanced?max*.68:max);
    });
    root.dataset.tggWorldDistanceBudgetV100=balanced?'balanced':'high';
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=time==='night',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(porch){
        porch.visible=(night||time==='golden')&&!balanced&&(district==='home'||district==='park'||driving);
        porch.material.opacity=night?.28:.15;
      }
      if(decals){
        decals.visible=district!=='park'&&(!balanced||district==='downtown');
        decals.material.opacity=wet?.09:.15;
      }
      if(props){
        props.visible=!balanced&&(district==='park'||district==='home'||district==='studio');
        props.material.color.setHex(district==='park'?0x596252:district==='studio'?0x55515b:0x4f565d);
      }
    }

    distanceBudget();

    if(scene.fog&&w.camera){
      const target=driving?0.00155:0.00172;
      scene.fog.density+=(target-scene.fog.density)*.08;
    }

    root.dataset.tggNeighborhoodPorchGlowV100=porch?'64':'0';
    root.dataset.tggStreetDecalsV100=decals?'84':'0';
    root.dataset.tggPublicSpacePropsV100=props?'48':'0';
    root.dataset.tggDistanceLodGroupsV100=String(lodGroups.length);
    root.dataset.tggWorldVisualMilestoneV100='1';
    root.dataset.tggWorldMilestoneV100='1';
  };

  window.TGGWorldMilestoneV100={apply,distanceBudget};
  apply();
}
function applyWorldMilestoneV100(){window.TGGWorldMilestoneV100?.apply?.()||installWorldMilestoneV100()}

function installWorldCohesionV101(){
  if(window.TGGWorldCohesionV101)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldCohesionV101='waiting';return}
  const scene=w.scene;

  let buildingDepth=scene.getObjectByName?.('TGG_BUILDING_DEPTH_V101');
  if(!buildingDepth&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1,1,1);
    const mat=new THREE.MeshStandardMaterial({color:0x2d343d,roughness:.88,metalness:.03});
    buildingDepth=new THREE.InstancedMesh(geo,mat,72);buildingDepth.name='TGG_BUILDING_DEPTH_V101';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const a=(i/72)*Math.PI*2,r=360+(i%6)*44,h=16+(i%8)*5;
      p.set(Math.cos(a)*r,h/2,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a,0));
      s.set(8+(i%4)*3,h,10+(i%5)*3);m.compose(p,q,s);buildingDepth.setMatrixAt(i,m);
    }
    buildingDepth.instanceMatrix.needsUpdate=true;scene.add(buildingDepth);
  }

  let publicSpace=scene.getObjectByName?.('TGG_PUBLIC_SPACE_DENSITY_V101');
  if(!publicSpace&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.18,.22,.9,6);
    const mat=new THREE.MeshStandardMaterial({color:0x555e67,roughness:.84,metalness:.18});
    publicSpace=new THREE.InstancedMesh(geo,mat,96);publicSpace.name='TGG_PUBLIC_SPACE_DENSITY_V101';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const anchors=[[0,0],[42,-32],[-46,-28],[210,290],[-270,260],[-40,-52],[38,-50]];
    for(let i=0;i<96;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length)-6;
      p.set(a[0]+row*2.6,.45,a[1]+((i%4)-1.5)*2.2);
      q.setFromEuler(new THREE.Euler(0,(i%3)*.4,0));m.compose(p,q,s);publicSpace.setMatrixAt(i,m);
    }
    publicSpace.instanceMatrix.needsUpdate=true;scene.add(publicSpace);
  }

  let wayfinding=scene.getObjectByName?.('TGG_EXPLORATION_CUES_V101');
  if(!wayfinding&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.8,.16,.5);
    const mat=new THREE.MeshBasicMaterial({color:0x9edcff,transparent:true,opacity:.34,depthWrite:false});
    wayfinding=new THREE.InstancedMesh(geo,mat,54);wayfinding.name='TGG_EXPLORATION_CUES_V101';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const points=[[0,-180],[-180,-40],[170,-20],[130,170],[-150,160],[0,230]];
    for(let i=0;i<54;i++){
      const a=points[i%points.length],row=Math.floor(i/points.length)-4;
      p.set(a[0]+row*5,.09,a[1]);q.identity();m.compose(p,q,s);wayfinding.setMatrixAt(i,m);
    }
    wayfinding.instanceMatrix.needsUpdate=true;scene.add(wayfinding);
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
      if(buildingDepth){
        buildingDepth.visible=!balanced||district==='downtown'||district==='media';
        buildingDepth.material.color.setHex(
          district==='studio'?0x403342:
          district==='media'?0x304050:
          district==='home'?0x3f3d38:
          district==='park'?0x324238:0x2d343d
        );
      }
      if(publicSpace){
        publicSpace.visible=!driving&&!balanced&&district!=='garage';
      }
      if(wayfinding){
        wayfinding.visible=(driving||district==='downtown'||district==='garage')&&!balanced;
        wayfinding.material.opacity=night?.48:wet?.42:.3;
      }
    }

    const traffic=w.traffic||[];
    const base=district==='downtown'?1:district==='media'?.88:district==='studio'?.8:district==='home'?.64:district==='park'?.46:.72;
    const timeFactor=night?1.08:time==='golden'?1.04:.95;
    const weatherFactor=wet?.82:1;
    const density=Math.max(.3,Math.min(1,base*timeFactor*weatherFactor));
    traffic.forEach((v,i)=>{
      if(!v)return;
      const show=i<Math.max(1,Math.ceil(traffic.length*density));
      if(v.visible!==undefined)v.visible=show;
      if(v.userData){
        v.userData.tggPresenceV101=show?'active':'culled';
        v.userData.tggDistrictPresenceV101=district;
      }
    });

    const ambience=
      district==='downtown'?'urban-core':
      district==='studio'?'creative-nightlife':
      district==='media'?'media-commercial':
      district==='park'?'green-open':
      district==='home'?'residential-calm':
      district==='garage'?'auto-industrial':'mixed';

    root.dataset.tggBuildingDepthV101=buildingDepth?'72':'0';
    root.dataset.tggPublicSpaceDensityV101=publicSpace?'96':'0';
    root.dataset.tggExplorationCuesV101=wayfinding?'54':'0';
    root.dataset.tggTrafficPresenceV101=density.toFixed(2);
    root.dataset.tggDistrictAmbienceModelV101=ambience;
    root.dataset.tggExplorationReadabilityV101='1';
    root.dataset.tggWorldCohesionV101='1';
  };

  window.TGGWorldCohesionV101={apply};
  apply();
}
function applyWorldCohesionV101(){window.TGGWorldCohesionV101?.apply?.()||installWorldCohesionV101()}

function installExplorationReadabilityV102(){
  if(window.TGGExplorationReadabilityV102)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggExplorationReadabilityV102='waiting';return}
  const scene=w.scene;

  let parking=scene.getObjectByName?.('TGG_PARKING_BAYS_V102');
  if(!parking&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.12,.018,4.6);
    const mat=new THREE.MeshBasicMaterial({color:0xe7e5da,transparent:true,opacity:.6});
    parking=new THREE.InstancedMesh(geo,mat,160);parking.name='TGG_PARKING_BAYS_V102';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<160;i++){
      const block=Math.floor(i/20),slot=i%20,axis=block%2;
      const baseX=(block<4?-1:1)*(120+(block%4)*42),baseZ=((block%4)-1.5)*86;
      p.set(baseX+(axis?slot*3.4-32:0),.05,baseZ+(axis?0:slot*3.4-32));
      q.setFromEuler(new THREE.Euler(0,axis?0:Math.PI/2,0));
      m.compose(p,q,s);parking.setMatrixAt(i,m);
    }
    parking.instanceMatrix.needsUpdate=true;scene.add(parking);
  }

  let transit=scene.getObjectByName?.('TGG_TRANSIT_STOPS_V102');
  if(!transit&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.6,2.4,.45);
    const mat=new THREE.MeshStandardMaterial({color:0x2e3945,roughness:.62,metalness:.24});
    transit=new THREE.InstancedMesh(geo,mat,18);transit.name='TGG_TRANSIT_STOPS_V102';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const pts=[[-90,-15],[90,-15],[-15,-90],[-15,90],[-240,-90],[250,-30],[205,255],[-235,235],[0,350],[-330,-10],[330,40],[-120,260],[130,260],[0,-280],[-280,120],[285,130],[-160,-220],[170,-215]];
    pts.forEach((pt,i)=>{
      p.set(pt[0],1.2,pt[1]);q.setFromEuler(new THREE.Euler(0,(i%2)*Math.PI/2,0));m.compose(p,q,s);transit.setMatrixAt(i,m);
    });
    transit.instanceMatrix.needsUpdate=true;scene.add(transit);
  }

  let seating=scene.getObjectByName?.('TGG_PLAZA_SEATING_V102');
  if(!seating&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.2,.32,.7);
    const mat=new THREE.MeshStandardMaterial({color:0x665d52,roughness:.9,metalness:.04});
    seating=new THREE.InstancedMesh(geo,mat,54);seating.name='TGG_PLAZA_SEATING_V102';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const anchors=[[0,0],[-40,-42],[42,-38],[205,290],[-260,250],[0,365]];
    for(let i=0;i<54;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length)-4;
      p.set(a[0]+row*3.6,.16,a[1]+((i%3)-1)*2.2);
      q.setFromEuler(new THREE.Euler(0,(i%4)*Math.PI/2,0));m.compose(p,q,s);seating.setMatrixAt(i,m);
    }
    seating.instanceMatrix.needsUpdate=true;scene.add(seating);
  }

  let signs=scene.getObjectByName?.('TGG_WAYFINDING_SIGNS_V102');
  if(!signs&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.4,1.15,.16);
    const mat=new THREE.MeshBasicMaterial({color:0x9edcff,transparent:true,opacity:.5});
    signs=new THREE.InstancedMesh(geo,mat,36);signs.name='TGG_WAYFINDING_SIGNS_V102';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const anchors=[[0,-220],[-220,-55],[220,-45],[165,205],[-185,205],[0,300]];
    for(let i=0;i<36;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length)-2.5;
      p.set(a[0]+row*4.6,2.6,a[1]);q.setFromEuler(new THREE.Euler(0,(i%2)*Math.PI/2,0));m.compose(p,q,s);signs.setMatrixAt(i,m);
    }
    signs.instanceMatrix.needsUpdate=true;scene.add(signs);
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
      if(parking){
        parking.visible=district!=='park'||driving;
        parking.material.opacity=wet?.78:.58;
      }
      if(transit){
        transit.visible=district!=='garage'||!driving;
        transit.material.color.setHex(district==='studio'?0x493b49:district==='media'?0x33465a:0x2e3945);
      }
      if(seating){
        seating.visible=!driving&&(!balanced||district==='park'||district==='downtown');
      }
      if(signs){
        signs.visible=!balanced||driving||night;
        signs.material.opacity=night?.72:wet?.6:.46;
      }
    }

    root.dataset.tggParkingBaysV102=parking?'160':'0';
    root.dataset.tggTransitStopsV102=transit?'18':'0';
    root.dataset.tggPlazaSeatingV102=seating?'54':'0';
    root.dataset.tggWayfindingSignsV102=signs?'36':'0';
    root.dataset.tggExplorationReadabilityModelV102='parking-transit-signage-public-space';
    root.dataset.tggExplorationReadabilityV102='1';
  };

  window.TGGExplorationReadabilityV102={apply};
  apply();
}
function applyExplorationReadabilityV102(){window.TGGExplorationReadabilityV102?.apply?.()||installExplorationReadabilityV102()}

function installStreetLevelRealismV103(){
  if(window.TGGStreetLevelRealismV103)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggStreetLevelRealismV103='waiting';return}
  const scene=w.scene;

  let crosswalks=scene.getObjectByName?.('TGG_CROSSWALKS_V103');
  if(!crosswalks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.7,.02,4.6);
    const mat=new THREE.MeshBasicMaterial({color:0xf3f1e7,transparent:true,opacity:.68});
    crosswalks=new THREE.InstancedMesh(geo,mat,112);crosswalks.name='TGG_CROSSWALKS_V103';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<112;i++){
      const block=Math.floor(i/14),stripe=i%14,axis=block%2;
      const base=[[-72,-72],[72,-72],[-72,72],[72,72],[-220,-80],[235,-30],[205,250],[-225,235]][block]||[0,0];
      p.set(base[0]+(axis?stripe*.82-5.3:0),.06,base[1]+(axis?0:stripe*.82-5.3));
      q.setFromEuler(new THREE.Euler(0,axis?0:Math.PI/2,0));
      m.compose(p,q,s);crosswalks.setMatrixAt(i,m);
    }
    crosswalks.instanceMatrix.needsUpdate=true;scene.add(crosswalks);
  }

  let utilities=scene.getObjectByName?.('TGG_UTILITY_SERVICE_PROPS_V103');
  if(!utilities&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.9,1.25,.65);
    const mat=new THREE.MeshStandardMaterial({color:0x59636d,roughness:.82,metalness:.28});
    utilities=new THREE.InstancedMesh(geo,mat,84);utilities.name='TGG_UTILITY_SERVICE_PROPS_V103';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const a=(i/84)*Math.PI*2,r=105+(i%7)*34;
      p.set(Math.cos(a)*r,.63,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a+(i%3)*.25,0));
      const sc=.78+(i%5)*.07;s.set(sc,.88+(i%4)*.06,sc);m.compose(p,q,s);utilities.setMatrixAt(i,m);
    }
    utilities.instanceMatrix.needsUpdate=true;scene.add(utilities);
  }

  let control=scene.getObjectByName?.('TGG_TRAFFIC_CONTROL_V103');
  if(!control&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.42,2.7,.42);
    const mat=new THREE.MeshStandardMaterial({color:0x343c45,roughness:.7,metalness:.36});
    control=new THREE.InstancedMesh(geo,mat,56);control.name='TGG_TRAFFIC_CONTROL_V103';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const pts=[[-78,-78],[78,-78],[-78,78],[78,78],[-228,-88],[243,-38],[213,258],[-233,243]];
    for(let i=0;i<56;i++){
      const pt=pts[i%pts.length],row=Math.floor(i/pts.length)-3;
      p.set(pt[0]+row*2.3,1.35,pt[1]+((i%2)?2.4:-2.4));
      q.identity();m.compose(p,q,s);control.setMatrixAt(i,m);
    }
    control.instanceMatrix.needsUpdate=true;scene.add(control);
  }

  let edges=scene.getObjectByName?.('TGG_WORLD_EDGE_TREATMENT_V103');
  if(!edges&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(12,1.8,2);
    const mat=new THREE.MeshStandardMaterial({color:0x4c514e,roughness:.96,metalness:.02});
    edges=new THREE.InstancedMesh(geo,mat,64);edges.name='TGG_WORLD_EDGE_TREATMENT_V103';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const a=(i/64)*Math.PI*2,r=640+(i%5)*28;
      p.set(Math.cos(a)*r,.9,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      const sc=.85+(i%4)*.08;s.set(sc,.8+(i%3)*.12,1);m.compose(p,q,s);edges.setMatrixAt(i,m);
    }
    edges.instanceMatrix.needsUpdate=true;scene.add(edges);
  }

  let streetLights=scene.getObjectByName?.('TGG_DISTRICT_STREET_LIGHTS_V103');
  if(!streetLights&&THREE.InstancedMesh){
    const geo=new THREE.SphereGeometry(.16,6,5);
    const mat=new THREE.MeshBasicMaterial({color:0xffddb2,transparent:true,opacity:.55,depthWrite:false});
    streetLights=new THREE.InstancedMesh(geo,mat,96);streetLights.name='TGG_DISTRICT_STREET_LIGHTS_V103';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*2,r=120+(i%8)*34;
      p.set(Math.cos(a)*r,4.8+(i%3)*.35,Math.sin(a)*r);
      q.identity();m.compose(p,q,s);streetLights.setMatrixAt(i,m);
    }
    streetLights.instanceMatrix.needsUpdate=true;scene.add(streetLights);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=time==='night',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(crosswalks){
        crosswalks.visible=district!=='park';
        crosswalks.material.opacity=wet?.76:.68;
      }
      if(utilities)utilities.visible=!balanced||district==='downtown'||district==='studio';
      if(control)control.visible=district!=='park'||driving;
      if(edges)edges.visible=district==='park'||district==='home'||driving;
      if(streetLights){
        streetLights.visible=night||wet;
        streetLights.material.opacity=night?.74:.46;
        streetLights.material.color.setHex(district==='studio'?0xffc2df:district==='media'?0xb8dcff:0xffddb2);
      }
    }

    root.dataset.tggCrosswalksV103=crosswalks?'112':'0';
    root.dataset.tggUtilityServicePropsV103=utilities?'84':'0';
    root.dataset.tggTrafficControlV103=control?'56':'0';
    root.dataset.tggWorldEdgeTreatmentV103=edges?'64':'0';
    root.dataset.tggDistrictStreetLightsV103=streetLights?'96':'0';
    root.dataset.tggStreetLevelRealismV103='1';
  };

  window.TGGStreetLevelRealismV103={apply};
  apply();
}
function applyStreetLevelRealismV103(){window.TGGStreetLevelRealismV103?.apply?.()||installStreetLevelRealismV103()}

function installLivingWorldMotionV104(){
  if(window.TGGLivingWorldV104)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggLivingWorldMotionV104='waiting';return}
  const scene=w.scene;
  let lastSig='',trafficLightState='go';

  const get=(name)=>scene.getObjectByName?.(name);
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const now=performance.now(),t=now*.001;
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    const pedestrians=get('TGG_PEDESTRIAN_POCKETS_V77')||get('TGG_AMBIENT_LIFE_V76');
    if(pedestrians&&!balanced&&!driving){
      pedestrians.position.x=Math.sin(t*.16)*.75;
      pedestrians.position.z=Math.cos(t*.13)*.55;
      pedestrians.rotation.y=Math.sin(t*.09)*.018;
      pedestrians.visible=district!=='garage';
      root.dataset.tggPedestrianMotionV104='drift';
    }else{
      if(pedestrians){pedestrians.position.x=0;pedestrians.position.z=0;pedestrians.rotation.y=0}
      root.dataset.tggPedestrianMotionV104=pedestrians?'idle':'waiting';
    }

    const foliage=get('TGG_FOLIAGE_VARIETY_V83')||get('TGG_COUNTRYSIDE_TREES_V76');
    if(foliage){
      foliage.rotation.z=Math.sin(t*.42)*(wet?.014:.008);
      foliage.rotation.x=Math.cos(t*.31)*(wet?.006:.003);
      root.dataset.tggFoliageMotionV104=wet?'weather-sway':'ambient-sway';
    }

    const clouds=get('TGG_CLOUD_DEPTH_V84');
    if(clouds&&!balanced){
      clouds.position.x=Math.sin(t*.018)*42;
      clouds.position.z=Math.cos(t*.013)*34;
      clouds.rotation.y=Math.sin(t*.006)*.02;
    }

    const storefront=get('TGG_STOREFRONT_GLASS_DEPTH_V90')||get('TGG_PREMIUM_FRONTAGE_V79');
    if(storefront?.material?.transparent){
      const base=night?.27:wet?.22:.16;
      storefront.material.opacity=base+Math.sin(t*.45)*.025;
      root.dataset.tggStorefrontPulseV104=night?'night-glow':'day-reflection';
    }else root.dataset.tggStorefrontPulseV104=storefront?'group':'waiting';

    const approach=get('TGG_LANDMARK_APPROACH_LIGHTS_V89');
    if(approach?.material?.transparent&&approach.visible){
      approach.material.opacity=(night?.48:wet?.36:.24)+(Math.sin(t*1.1)*.04);
    }

    const traffic=w.traffic||[];
    const phase=Math.floor(now/4500)%3;
    trafficLightState=phase===0?'go':phase===1?'caution':'stop';
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      v.userData.tggSignalStateV104=trafficLightState;
      v.userData.tggAmbientSpeedScaleV104=
        trafficLightState==='stop'?.78:trafficLightState==='caution'?.9:1;
      const lights=v.getObjectByName?.('TGG_TRAFFIC_LIGHTS_V83');
      if(lights)lights.visible=night||wet;
      if(v.rotation&&!driving&&district==='downtown'){
        v.rotation.y+=Math.sin(t*.08+i)*.0004;
      }
    });

    if(sig!==lastSig){
      lastSig=sig;
      const glow=get('TGG_NEIGHBORHOOD_GLOW_V81');
      if(glow?.material?.transparent)glow.material.opacity=night?.24:time==='golden'?.14:.06;
      const water=get('TGG_PARK_WATER_V84');
      if(water?.material)water.material.opacity=night?.48:wet?.58:.64;
    }

    root.dataset.tggTrafficSignalCycleV104=trafficLightState;
    root.dataset.tggDistrictMotionProfileV104=district;
    root.dataset.tggAmbientMotionQualityV104=balanced?'reduced':'full';
    root.dataset.tggLivingWorldMotionV104='1';
  };

  window.TGGLivingWorldV104={apply};
  apply();
}
function applyLivingWorldMotionV104(){window.TGGLivingWorldV104?.apply?.()||installLivingWorldMotionV104()}

function installExplorationLifeV105(){
  if(window.TGGExplorationLifeV105)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggExplorationLifeV105='waiting';return}
  const scene=w.scene;

  let activity=scene.getObjectByName?.('TGG_STOREFRONT_ACTIVITY_V105');
  if(!activity&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.7,1.65,.5);
    const mat=new THREE.MeshStandardMaterial({color:0x747b86,roughness:.8});
    activity=new THREE.InstancedMesh(geo,mat,48);activity.name='TGG_STOREFRONT_ACTIVITY_V105';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const anchors=[[-74,-28],[76,-26],[-28,75],[32,76],[-86,18],[88,22]];
    for(let i=0;i<48;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length)-3.5;
      p.set(a[0]+row*2.5,.82,a[1]+((i%3)-1)*1.5);
      q.setFromEuler(new THREE.Euler(0,(i%4)*Math.PI/2,0));
      m.compose(p,q,s);activity.setMatrixAt(i,m);
    }
    activity.instanceMatrix.needsUpdate=true;scene.add(activity);
  }

  let wildlife=scene.getObjectByName?.('TGG_WILDLIFE_MOTION_V105');
  if(!wildlife&&THREE.InstancedMesh){
    const geo=new THREE.ConeGeometry(.18,.6,5);
    const mat=new THREE.MeshStandardMaterial({color:0x49533f,roughness:.9});
    wildlife=new THREE.InstancedMesh(geo,mat,28);wildlife.name='TGG_WILDLIFE_MOTION_V105';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<28;i++){
      const a=(i/28)*Math.PI*2,r=360+(i%5)*44;
      p.set(Math.cos(a)*r,.32,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a,0));m.compose(p,q,s);wildlife.setMatrixAt(i,m);
    }
    wildlife.instanceMatrix.needsUpdate=true;scene.add(wildlife);
  }

  const ambientProfiles={
    downtown:{population:'busy',traffic:'dense',storefront:'active',nature:'low'},
    studio:{population:'creative',traffic:'medium',storefront:'active',nature:'low'},
    media:{population:'busy',traffic:'medium',storefront:'active',nature:'low'},
    park:{population:'relaxed',traffic:'light',storefront:'low',nature:'high'},
    home:{population:'residential',traffic:'light',storefront:'medium',nature:'medium'},
    garage:{population:'industrial',traffic:'medium',storefront:'low',nature:'low'}
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const profile=ambientProfiles[district]||ambientProfiles.downtown;
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(activity){
        activity.visible=!driving&&!balanced&&profile.storefront!=='low';
        activity.material.color.setHex(night?0x6f7f94:district==='studio'?0x78657c:0x747b86);
      }
      if(wildlife){
        wildlife.visible=(district==='park'||district==='home'||driving)&&!balanced;
        wildlife.material.color.setHex(wet?0x414a3d:district==='park'?0x4d6245:0x56604d);
      }
    }

    const t=performance.now()*.001;
    if(activity?.visible){
      activity.position.x=Math.sin(t*.11)*.38;
      activity.position.z=Math.cos(t*.09)*.3;
    }
    if(wildlife?.visible){
      wildlife.rotation.y=Math.sin(t*.18)*.08;
      wildlife.position.x=Math.sin(t*.07)*1.4;
      wildlife.position.z=Math.cos(t*.06)*1.1;
    }

    const traffic=w.traffic||[];
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      const className=v.userData.tggTrafficClassV90||['compact','sedan','muscle','utility','luxury'][i%5];
      const districtFactor=profile.traffic==='dense'?1:profile.traffic==='light'?.78:.9;
      const classFactor=className==='muscle'?1.04:className==='utility'?.86:className==='luxury'?.92:1;
      v.userData.tggAmbientBehaviorV105=
        district==='downtown'?'urban-flow':district==='park'?'scenic-slow':district==='home'?'residential-calm':'mixed-flow';
      v.userData.tggAmbientSpeedV105=Number((districtFactor*classFactor).toFixed(2));
    });

    root.dataset.tggAmbientPopulationV105=profile.population;
    root.dataset.tggAmbientTrafficV105=profile.traffic;
    root.dataset.tggAmbientStorefrontV105=profile.storefront;
    root.dataset.tggAmbientNatureV105=profile.nature;
    root.dataset.tggStorefrontActivityV105=activity?'48':'0';
    root.dataset.tggWildlifeMotionV105=wildlife?'28':'0';
    root.dataset.tggAmbientHooksV105='district+time+weather';
    root.dataset.tggExplorationLifeV105='1';
  };

  window.TGGExplorationLifeV105={apply,profiles:ambientProfiles};
  apply();
}
function applyExplorationLifeV105(){window.TGGExplorationLifeV105?.apply?.()||installExplorationLifeV105()}

function installFinalVisualOwnershipV106(){
  if(window.TGGFinalVisualV106)return;
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.scene||!THREE){root.dataset.tggFinalVisualOwnershipV106='waiting';return}
  const scene=w.scene;
  const profiles={
    downtown:{exposure:1.08,fog:0x8191a3,density:.00172},
    studio:{exposure:1.11,fog:0x8b748d,density:.00188},
    media:{exposure:1.10,fog:0x758aa4,density:.00180},
    park:{exposure:1.03,fog:0x8ba08e,density:.00146},
    home:{exposure:1.05,fog:0x948f82,density:.00156},
    garage:{exposure:1.07,fog:0x7d8792,density:.00176}
  };
  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const p=profiles[district]||profiles.downtown;
    const night=time==='night',gold=time==='golden',storm=/storm/.test(weather),rain=/rain/.test(weather);
    const balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      const exposure=p.exposure+(gold?.06:0)+(night?.02:0)-(storm?.08:rain?.03:0)-(balanced?.02:0);
      if(w.renderer)w.renderer.toneMappingExposure=Math.max(.92,Math.min(1.18,exposure));
      if(scene.fog){
        scene.fog.color?.setHex?.(night?0x556477:p.fog);
        scene.fog.density=p.density+(night?.00010:0)+(rain?.00022:0)+(storm?.00018:0)-(driving?.00008:0);
      }
      root.dataset.tggFinalGradeV106=district+'-'+time+'-'+weather;
      root.dataset.tggFinalQualityV106=quality;
    }

    if(w.camera){
      const base=driving?75:62;
      const speedBoost=driving?Math.min(10,speed*.2):0;
      const targetFov=base+speedBoost;
      if(Math.abs(Number(w.camera.fov||0)-targetFov)>.06){
        w.camera.fov+=(targetFov-w.camera.fov)*.12;
        w.camera.updateProjectionMatrix?.();
      }
      w.camera.far=Math.max(Number(w.camera.far||0),5000);
      w.camera.near=driving?.08:.06;
    }

    const groups=[
      ['TGG_CLOUD_DEPTH_V84',!balanced],
      ['TGG_FOLIAGE_VARIETY_V83',!balanced||district==='park'],
      ['TGG_WINDOW_REFLECTIONS_V83',!balanced&&district!=='park'],
      ['TGG_ATMOSPHERIC_MOTES_V99',!balanced],
      ['TGG_STOREFRONT_ACTIVITY_V105',!driving&&district!=='garage']
    ];
    groups.forEach(([name,visible])=>{
      const g=scene.getObjectByName?.(name);
      if(g)g.visible=!!visible;
    });

    root.dataset.tggFinalCameraFarV106='5000';
    root.dataset.tggFinalRenderOwnerV106='final-visual-v106';
    root.dataset.tggFogOwnerV106='final-visual-v106';
    root.dataset.tggExposureOwnerV106='final-visual-v106';
    root.dataset.tggCameraOwnerV106='final-visual-v106';
    root.dataset.tggWorldSystemsIntegratedV106='75-105';
    root.dataset.tggFinalVisualOwnershipV106='1';
  };
  window.TGGFinalVisualV106={apply,profiles};
  apply();
}
function applyFinalVisualOwnershipV106(){window.TGGFinalVisualV106?.apply?.()||installFinalVisualOwnershipV106()}

function installWorldConvergenceV107(){
  if(window.TGGWorldConvergenceV107)return;
  const w=window.TGG3D,THREE=window.THREE;
  if(!w?.scene||!THREE){root.dataset.tggWorldConvergenceV107='waiting';return}
  const scene=w.scene;
  let lastSig='';

  const groups={
    expensive:[
      'TGG_CLOUD_DEPTH_V84','TGG_WINDOW_REFLECTIONS_V83','TGG_ATMOSPHERIC_MOTES_V99',
      'TGG_STOREFRONT_ACTIVITY_V105','TGG_PEDESTRIAN_POCKETS_V77','TGG_AMBIENT_MOTION_V79'
    ],
    drivingHide:[
      'TGG_PEDESTRIAN_POCKETS_V77','TGG_AMBIENT_LIFE_V76','TGG_STOREFRONT_ACTIVITY_V105'
    ],
    park:[
      'TGG_FOLIAGE_VARIETY_V83','TGG_COUNTRYSIDE_BELT_V76','TGG_TERRAIN_PROPS_V90','TGG_PARK_WATER_V84'
    ]
  };

  const setVisible=(name,visible)=>{
    const g=scene.getObjectByName?.(name);
    if(g&&g.visible!==!!visible)g.visible=!!visible;
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      groups.expensive.forEach(name=>setVisible(name,!balanced));
      groups.drivingHide.forEach(name=>{if(driving)setVisible(name,false)});
      groups.park.forEach(name=>{
        if(district==='park'||district==='home'||driving)setVisible(name,!balanced||name==='TGG_PARK_WATER_V84');
      });

      const cityLights=scene.getObjectByName?.('TGG_CITY_LIGHT_DEPTH_V51');
      if(cityLights)cityLights.children.forEach(o=>{
        if(o?.isPointLight)o.intensity=balanced?0:(night?1.45:wet?.42:.08);
      });

      const avatarKey=scene.getObjectByName?.('TGG_AVATAR_KEYLIGHT_V79');
      if(avatarKey&&driving)avatarKey.intensity=0;

      const contact=scene.getObjectByName?.('TGG_CONTACT_LIGHT_V90');
      if(contact)contact.intensity=balanced?0:contact.intensity;

      root.dataset.tggWorldConvergenceProfileV107=[district,time,weather,quality,driving?'drive':'walk'].join('-');
    }

    const traffic=w.traffic||[];
    const density=Number(root.dataset.tggTrafficDensityV89||1);
    const allowed=Math.max(1,Math.ceil(traffic.length*(balanced?Math.min(.7,density):density)));
    traffic.forEach((v,i)=>{
      if(v?.visible!==undefined)v.visible=i<allowed;
    });

    if(w.camera){
      const targetFar=balanced?4200:5000;
      w.camera.far=targetFar;
      w.camera.near=driving?.08:.06;
      const base=driving?74:62;
      const target=base+(driving?Math.min(9,speed*.18):0);
      if(Math.abs(Number(w.camera.fov||0)-target)>.04){
        w.camera.fov+=(target-w.camera.fov)*.1;
      }
      w.camera.updateProjectionMatrix?.();
    }

    root.dataset.tggWorldConvergenceV107='1';
    root.dataset.tggVisualOwnerV107='world-convergence-v107';
    root.dataset.tggTrafficBudgetOwnerV107='world-convergence-v107';
    root.dataset.tggAmbientBudgetOwnerV107='world-convergence-v107';
    root.dataset.tggCameraBudgetOwnerV107='world-convergence-v107';
    root.dataset.tggIntegratedWorldRangeV107='75-106';
  };

  window.TGGWorldConvergenceV107={apply};
  apply();
}
function applyWorldConvergenceV107(){window.TGGWorldConvergenceV107?.apply?.()||installWorldConvergenceV107()}

function installSceneBudgetAuthorityV108(){
  if(window.TGGSceneBudgetV108)return;
  const w=window.TGG3D;
  if(!w?.scene){root.dataset.tggSceneBudgetAuthorityV108='waiting';return}
  const scene=w.scene;
  const names=[
    'TGG_CLOUD_DEPTH_V84','TGG_WINDOW_REFLECTIONS_V83','TGG_ATMOSPHERIC_MOTES_V99',
    'TGG_STOREFRONT_ACTIVITY_V105','TGG_PEDESTRIAN_POCKETS_V77','TGG_AMBIENT_MOTION_V79',
    'TGG_FOLIAGE_VARIETY_V83','TGG_COUNTRYSIDE_BELT_V76','TGG_TERRAIN_PROPS_V90',
    'TGG_PARK_WATER_V84','TGG_CITY_LIGHT_DEPTH_V51','TGG_AVATAR_KEYLIGHT_V79','TGG_CONTACT_LIGHT_V90'
  ];
  const refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };
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
      const visibility={
        TGG_CLOUD_DEPTH_V84:!balanced,
        TGG_WINDOW_REFLECTIONS_V83:!balanced&&district!=='park',
        TGG_ATMOSPHERIC_MOTES_V99:!balanced,
        TGG_STOREFRONT_ACTIVITY_V105:!driving&&district!=='garage'&&!balanced,
        TGG_PEDESTRIAN_POCKETS_V77:!driving&&district!=='garage'&&!balanced,
        TGG_AMBIENT_MOTION_V79:!driving&&!balanced,
        TGG_FOLIAGE_VARIETY_V83:(district==='park'||district==='home'||driving)&&!balanced,
        TGG_COUNTRYSIDE_BELT_V76:district==='park'||district==='home'||driving,
        TGG_TERRAIN_PROPS_V90:(district==='park'||district==='home'||driving)&&!balanced,
        TGG_PARK_WATER_V84:district==='park'||driving
      };
      Object.entries(visibility).forEach(([name,v])=>{const g=get(name);if(g&&g.visible!==v)g.visible=v});

      const cityLights=get('TGG_CITY_LIGHT_DEPTH_V51');
      if(cityLights)cityLights.children.forEach(o=>{
        if(o?.isPointLight)o.intensity=balanced?0:(night?1.45:wet?.42:.08);
      });

      const avatarKey=get('TGG_AVATAR_KEYLIGHT_V79');
      if(avatarKey&&driving)avatarKey.intensity=0;
      const contact=get('TGG_CONTACT_LIGHT_V90');
      if(contact&&balanced)contact.intensity=0;
    }

    root.dataset.tggSceneBudgetAuthorityV108='1';
    root.dataset.tggSceneVisibilityOwnerV108='scene-budget-v108';
    root.dataset.tggLightingBudgetOwnerV108='scene-budget-v108';
    root.dataset.tggCachedSceneRefsV108=String(names.length);
    root.dataset.tggLegacyVisualLayersV108='subordinate';
  };
  window.TGGSceneBudgetV108={apply,get};
  apply();
}
function applySceneBudgetAuthorityV108(){window.TGGSceneBudgetV108?.apply?.()||installSceneBudgetAuthorityV108()}

function installWorldStateAuthorityV109(){
  if(window.TGGWorldStateV109)return;
  const w=window.TGG3D;
  if(!w?.scene){root.dataset.tggWorldStateAuthorityV109='waiting';return}
  const scene=w.scene;
  const uniqueNames=[
    'TGG_CITY_LIGHT_DEPTH_V51','TGG_CLOUD_DEPTH_V84','TGG_WINDOW_REFLECTIONS_V83',
    'TGG_ATMOSPHERIC_MOTES_V99','TGG_STOREFRONT_ACTIVITY_V105','TGG_PEDESTRIAN_POCKETS_V77',
    'TGG_FOLIAGE_VARIETY_V83','TGG_COUNTRYSIDE_BELT_V76','TGG_TERRAIN_PROPS_V90',
    'TGG_PARK_WATER_V84','TGG_AVATAR_KEYLIGHT_V79','TGG_CONTACT_LIGHT_V90',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89','TGG_OVERPASS_BRIDGES_V88'
  ];
  let lastSig='',lastAuditAt=0;

  const auditDuplicates=()=>{
    const now=performance.now();
    if(now-lastAuditAt<8000)return;
    lastAuditAt=now;
    let suppressed=0;
    uniqueNames.forEach(name=>{
      const matches=[];
      scene.traverse?.(o=>{if(o?.name===name)matches.push(o)});
      if(matches.length>1){
        matches.slice(1).forEach(o=>{o.visible=false;o.userData.tggDuplicateSuppressedV109=1;suppressed++});
      }
    });
    root.dataset.tggDuplicateGroupsSuppressedV109=String(suppressed);
    root.dataset.tggDuplicateAuditV109='1';
  };

  const apply=()=>{
    const snapshot={
      district:String(root.dataset.tggDistrict||'downtown'),
      time:String(root.dataset.tggTime||'day'),
      weather:String(root.dataset.tggWeather||'clear'),
      quality:String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high'),
      driving:root.dataset.tggDriving==='1'||state.driving===true,
      race:root.dataset.tggRaceMode==='on'
    };
    const sig=[snapshot.district,snapshot.time,snapshot.weather,snapshot.quality,snapshot.driving?'1':'0',snapshot.race?'1':'0'].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      window.__TGG_WORLD_STATE_V109__={...snapshot,updatedAt:Date.now()};
      root.dataset.tggWorldStateSignatureV109=sig;
      root.dataset.tggWorldStateDistrictV109=snapshot.district;
      root.dataset.tggWorldStateTimeV109=snapshot.time;
      root.dataset.tggWorldStateWeatherV109=snapshot.weather;
      root.dataset.tggWorldStateQualityV109=snapshot.quality;
      root.dataset.tggWorldStateDrivingV109=snapshot.driving?'1':'0';
      root.dataset.tggWorldStateRaceV109=snapshot.race?'1':'0';
    }

    auditDuplicates();

    root.dataset.tggFinalVisualOwnerV109='scene-budget-v108';
    root.dataset.tggWorldStateOwnerV109='world-state-v109';
    root.dataset.tggSceneDuplicatePolicyV109='first-owner-wins';
    root.dataset.tggWorldStateAuthorityV109='1';
  };

  window.TGGWorldStateV109={apply,get snapshot(){return window.__TGG_WORLD_STATE_V109__||null},auditDuplicates};
  apply();
}
function applyWorldStateAuthorityV109(){window.TGGWorldStateV109?.apply?.()||installWorldStateAuthorityV109()}

function installSpatialStreamingV110(){
  if(window.TGGSpatialStreamingV110)return;
  const w=window.TGG3D;
  if(!w?.scene){root.dataset.tggSpatialStreamingV110='waiting';return}
  const scene=w.scene;
  const bands={
    near:220,
    mid:620,
    far:1450
  };
  const rules={
    TGG_STREET_CLUTTER_V84:'near',
    TGG_STREET_RHYTHM_V82:'near',
    TGG_SIDEWALK_VARIATION_V83:'mid',
    TGG_STOREFRONT_GLASS_DEPTH_V90:'mid',
    TGG_WINDOW_REFLECTIONS_V83:'mid',
    TGG_PEDESTRIAN_POCKETS_V77:'near',
    TGG_AMBIENT_LIFE_V76:'near',
    TGG_FOLIAGE_VARIETY_V83:'mid',
    TGG_TERRAIN_PROPS_V90:'mid',
    TGG_COUNTRYSIDE_BELT_V76:'far',
    TGG_DISTANT_TERRAIN_V84:'far',
    TGG_SKYLINE_SILHOUETTES_V82:'far',
    TGG_CLOUD_DEPTH_V84:'far',
    TGG_OVERPASS_BRIDGES_V88:'far',
    TGG_DISTRICT_TRANSITION_CORRIDORS_V89:'far'
  };
  const refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };
  let lastUpdate=0;
  const focusPos=()=>{
    if(root.dataset.tggDriving==='1'&&w.car?.position)return w.car.position;
    const av=scene.getObjectByName?.('TGG_PLAYER_AVATAR')||scene.getObjectByName?.('TGG_AVATAR')||null;
    if(av?.position)return av.position;
    return w.camera?.position||null;
  };
  const apply=()=>{
    const now=performance.now();
    if(now-lastUpdate<900)return;
    lastUpdate=now;
    const p=focusPos();if(!p)return;
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const balanced=quality==='balanced';
    let culled=0,kept=0;

    Object.entries(rules).forEach(([name,band])=>{
      const g=get(name);if(!g)return;
      const limit=bands[band]*(balanced?.78:1);
      const dx=(g.position?.x||0)-p.x,dz=(g.position?.z||0)-p.z;
      const d=Math.hypot(dx,dz);
      const baseVisible=g.visible!==false;
      const within=d<=limit||band==='far';
      const show=baseVisible&&within;
      if(g.visible!==show)g.visible=show;
      g.userData.tggSpatialBandV110=band;
      g.userData.tggSpatialDistanceV110=Math.round(d);
      g.userData.tggSpatialVisibleV110=show?'1':'0';
      show?kept++:culled++;
    });

    const traffic=w.traffic||[];
    const trafficLimit=balanced?10:18;
    traffic.forEach((v,i)=>{
      if(!v)return;
      if(i>=trafficLimit&&v.visible!==undefined)v.visible=false;
    });

    root.dataset.tggSpatialStreamingV110='1';
    root.dataset.tggSpatialStreamingOwnerV110='distance-bands';
    root.dataset.tggSpatialNearV110=String(bands.near);
    root.dataset.tggSpatialMidV110=String(bands.mid);
    root.dataset.tggSpatialFarV110=String(bands.far);
    root.dataset.tggSpatialGroupsKeptV110=String(kept);
    root.dataset.tggSpatialGroupsCulledV110=String(culled);
    root.dataset.tggTrafficBudgetV110=String(trafficLimit);
    root.dataset.tggSpatialStreamingQualityV110=quality;
  };
  window.TGGSpatialStreamingV110={apply,bands,rules,get};
  apply();
}
function applySpatialStreamingV110(){window.TGGSpatialStreamingV110?.apply?.()||installSpatialStreamingV110()}

function installSpatialStreamingCorrectnessV111(){
  if(window.TGGSpatialStreamingV111)return;
  const w=window.TGG3D;
  if(!w?.scene){root.dataset.tggSpatialStreamingV111='waiting';return}
  const scene=w.scene;

  const globalGroups=[
    'TGG_STREET_CLUTTER_V84',
    'TGG_STREET_RHYTHM_V82',
    'TGG_SIDEWALK_VARIATION_V83',
    'TGG_STOREFRONT_GLASS_DEPTH_V90',
    'TGG_WINDOW_REFLECTIONS_V83',
    'TGG_FOLIAGE_VARIETY_V83',
    'TGG_TERRAIN_PROPS_V90',
    'TGG_COUNTRYSIDE_BELT_V76',
    'TGG_DISTANT_TERRAIN_V84',
    'TGG_SKYLINE_SILHOUETTES_V82',
    'TGG_CLOUD_DEPTH_V84',
    'TGG_OVERPASS_BRIDGES_V88',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89'
  ];

  const localized=[
    ['TGG_PARK_WATER_V84',520],
    ['TGG_PREMIUM_FRONTAGE_V79',700],
    ['TGG_DISTRICT_LANDMARKS_V77',1200],
    ['TGG_INTERIOR_GLOW_DEPTH_V80',700]
  ];

  const refs={};
  const stateMap={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };

  const focusPos=()=>{
    if(root.dataset.tggDriving==='1'&&w.car?.position)return w.car.position;
    const av=scene.getObjectByName?.('TGG_PLAYER_AVATAR')||scene.getObjectByName?.('TGG_AVATAR')||null;
    return av?.position||w.camera?.position||null;
  };

  const upstreamVisible=(name,g)=>{
    const s=stateMap[name]||(stateMap[name]={desired:g.visible!==false,lastApplied:null});
    if(s.lastApplied!==null&&g.visible!==s.lastApplied){
      s.desired=g.visible!==false;
    }
    return s;
  };

  let last=0;
  const apply=()=>{
    const now=performance.now();
    if(now-last<900)return;
    last=now;

    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const balanced=quality==='balanced';
    const district=String(root.dataset.tggDistrict||'downtown');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const p=focusPos();
    let restored=0,culled=0,kept=0;

    globalGroups.forEach((name,i)=>{
      const g=get(name);if(!g)return;
      const s=upstreamVisible(name,g);
      let budgetVisible=s.desired;
      if(balanced){
        const critical=/SKYLINE|COUNTRYSIDE|DISTANT_TERRAIN|OVERPASS|TRANSITION/.test(name);
        budgetVisible=critical?s.desired:(s.desired&&i%2===0);
      }
      if(/PEDESTRIAN|AMBIENT_LIFE/.test(name)&&driving)budgetVisible=false;
      if(/FOLIAGE|TERRAIN_PROPS|COUNTRYSIDE/.test(name)&&!(district==='park'||district==='home'||driving))budgetVisible=false;
      if(g.visible!==budgetVisible){
        if(budgetVisible)restored++;else culled++;
        g.visible=budgetVisible;
      }
      s.lastApplied=budgetVisible;
      g.userData.tggStreamingPolicyV111='global-budget';
      budgetVisible?kept++:culled++;
    });

    localized.forEach(([name,limit])=>{
      const g=get(name);if(!g||!p)return;
      const s=upstreamVisible(name,g);
      const dx=(g.position?.x||0)-p.x,dz=(g.position?.z||0)-p.z;
      const dist=Math.hypot(dx,dz);
      const max=limit*(balanced?.78:1);
      const show=s.desired&&dist<=max;
      if(g.visible!==show){
        if(show)restored++;else culled++;
        g.visible=show;
      }
      s.lastApplied=show;
      g.userData.tggStreamingPolicyV111='localized-distance';
      g.userData.tggSpatialDistanceV111=Math.round(dist);
      show?kept++:culled++;
    });

    const traffic=w.traffic||[];
    const v89Density=Math.max(.15,Math.min(1,Number(root.dataset.tggTrafficDensityV89||1)));
    const densityLimit=Math.max(1,Math.ceil(traffic.length*v89Density));
    const perfLimit=balanced?10:18;
    const trafficLimit=Math.min(densityLimit,perfLimit);
    traffic.forEach((v,i)=>{
      if(!v)return;
      const show=i<trafficLimit;
      if(v.visible!==undefined)v.visible=show;
      v.userData.tggTrafficStreamingV111=show?'visible':'budget-hidden';
    });

    root.dataset.tggSpatialStreamingV111='1';
    root.dataset.tggSpatialStreamingOwnerV111='policy-aware';
    root.dataset.tggGlobalStreamingPolicyV111='quality+district';
    root.dataset.tggLocalizedStreamingPolicyV111='distance';
    root.dataset.tggStreamingRestoreV111=String(restored);
    root.dataset.tggStreamingGroupsKeptV111=String(kept);
    root.dataset.tggStreamingGroupsCulledV111=String(culled);
    root.dataset.tggTrafficBudgetV111=String(trafficLimit);
    root.dataset.tggStreamingRegressionGuardV111='1';
  };

  window.TGGSpatialStreamingV111={apply,get,state:stateMap};
  apply();
}
function applySpatialStreamingCorrectnessV111(){window.TGGSpatialStreamingV111?.apply?.()||installSpatialStreamingCorrectnessV111()}

function installWholeWorldConvergenceV112(){
  if(window.TGGWholeWorldConvergenceV112)return;
  const w=window.TGG3D;
  if(!w?.scene){root.dataset.tggWholeWorldConvergenceV112='waiting';return}
  const scene=w.scene;
  const refs={};
  const names=[
    'TGG_CURB_MEDIAN_V90','TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_TERRAIN_PROPS_V90',
    'TGG_CONTACT_LIGHT_V90','TGG_AVATAR_CONTACT_V77','TGG_VEHICLE_CONTACT_V80',
    'TGG_STREET_CLUTTER_V84','TGG_SIDEWALK_VARIATION_V83','TGG_FOLIAGE_VARIETY_V83',
    'TGG_WINDOW_REFLECTIONS_V83','TGG_COUNTRYSIDE_BELT_V76','TGG_DISTANT_TERRAIN_V84'
  ];
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };
  let last=0;
  const apply=()=>{
    const now=performance.now();
    if(now-last<900)return;
    last=now;

    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const district=String(root.dataset.tggDistrict||'downtown');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced';
    let present=0,visible=0;

    names.forEach(name=>{
      const g=get(name);if(!g)return;
      present++;
      if(g.visible!==false)visible++;
      g.userData.tggWholeWorldOwnerV112='converged';
    });

    const contact=get('TGG_CONTACT_LIGHT_V90');
    if(contact){
      if(balanced)contact.intensity=0;
      else if(contact.intensity>0){
        const cap=driving?1.0:.82;
        contact.intensity=Math.min(contact.intensity,cap);
      }
    }

    const glass=get('TGG_STOREFRONT_GLASS_DEPTH_V90');
    if(glass?.material){
      glass.material.opacity=Math.min(Number(glass.material.opacity??.18),balanced?.12:.24);
    }

    const terrain=get('TGG_TERRAIN_PROPS_V90');
    if(terrain)terrain.visible=!balanced&&(district==='park'||district==='home'||driving);

    const curbs=get('TGG_CURB_MEDIAN_V90');
    if(curbs)curbs.visible=district!=='park'||driving;

    root.dataset.tggWholeWorldConvergenceV112='1';
    root.dataset.tggWholeWorldOwnerV112='scene-budget+streaming+grounding';
    root.dataset.tggWholeWorldGroupsPresentV112=String(present);
    root.dataset.tggWholeWorldGroupsVisibleV112=String(visible);
    root.dataset.tggGroundingIntegratedV112='1';
    root.dataset.tggStreamingIntegratedV112='1';
    root.dataset.tggSceneBudgetIntegratedV112='1';
    root.dataset.tggVisualRegressionGuardV112='1';
  };
  window.TGGWholeWorldConvergenceV112={apply,get};
  apply();
}
function applyWholeWorldConvergenceV112(){window.TGGWholeWorldConvergenceV112?.apply?.()||installWholeWorldConvergenceV112()}

function installExplorationFidelityV113(){
  if(window.TGGExplorationFidelityV113)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggExplorationFidelityV113='waiting';return}
  const scene=w.scene;
  const refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };

  let beacons=get('TGG_WAYFINDING_BEACONS_V113');
  if(!beacons&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.28,2.8,.28);
    const mat=new THREE.MeshBasicMaterial({color:0x8ad5ff,transparent:true,opacity:.34,depthWrite:false});
    beacons=new THREE.InstancedMesh(geo,mat,24);beacons.name='TGG_WAYFINDING_BEACONS_V113';
    const anchors=[[0,-320],[-320,-100],[310,-45],[230,300],[-280,275],[0,395]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<24;i++){
      const a=anchors[i%anchors.length],ring=Math.floor(i/anchors.length);
      p.set(a[0]+(ring-1.5)*3.2,1.4,a[1]+((i%2)?3:-3));
      q.identity();m.compose(p,q,s);beacons.setMatrixAt(i,m);
    }
    beacons.instanceMatrix.needsUpdate=true;scene.add(beacons);refs[beacons.name]=beacons;
  }

  let pathMarks=get('TGG_EXPLORATION_PATH_MARKS_V113');
  if(!pathMarks&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.3,3.2);
    const mat=new THREE.MeshBasicMaterial({color:0xbde9ff,transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide});
    pathMarks=new THREE.InstancedMesh(geo,mat,64);pathMarks.name='TGG_EXPLORATION_PATH_MARKS_V113';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const a=(i/64)*Math.PI*2,r=155+(i%8)*28;
      p.set(Math.cos(a)*r,.045,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,-a));
      const sc=.72+(i%4)*.08;s.set(sc,1,1);m.compose(p,q,s);pathMarks.setMatrixAt(i,m);
    }
    pathMarks.instanceMatrix.needsUpdate=true;scene.add(pathMarks);refs[pathMarks.name]=pathMarks;
  }

  const focusPos=()=>{
    if(root.dataset.tggDriving==='1'&&w.car?.position)return w.car.position;
    const av=scene.getObjectByName?.('TGG_PLAYER_AVATAR')||scene.getObjectByName?.('TGG_AVATAR')||null;
    return av?.position||w.camera?.position||null;
  };

  let last=0,lastSig='';
  const apply=()=>{
    const now=performance.now();
    if(now-last<700)return;
    last=now;

    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced';
    const wet=/rain|storm/.test(weather),night=time==='night';
    const p=focusPos();
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(beacons){
        beacons.visible=!balanced||driving;
        beacons.material.opacity=night?.5:wet?.4:.28;
      }
      if(pathMarks){
        pathMarks.visible=driving||district==='downtown'||district==='garage';
        pathMarks.material.opacity=night?.18:wet?.16:.1;
      }
    }

    const frontage=get('TGG_PREMIUM_FRONTAGE_V79');
    const glow=get('TGG_INTERIOR_GLOW_DEPTH_V80');
    const landmarks=get('TGG_DISTRICT_LANDMARKS_V77');
    let interiorActive=0,landmarkNear=0;

    if(p&&frontage){
      const d=Math.hypot((frontage.position?.x||0)-p.x,(frontage.position?.z||0)-p.z);
      const show=d<760&&!balanced;
      frontage.visible=show;
      if(show)interiorActive++;
      frontage.userData.tggExplorationDistanceV113=Math.round(d);
    }
    if(p&&glow){
      const d=Math.hypot((glow.position?.x||0)-p.x,(glow.position?.z||0)-p.z);
      const show=d<680&&!balanced&&(night||time==='golden'||wet);
      glow.visible=show;
      if(show)interiorActive++;
      glow.userData.tggExplorationDistanceV113=Math.round(d);
    }
    if(p&&landmarks){
      landmarks.children?.forEach?.(o=>{
        const dx=(o.position?.x||0)-p.x,dz=(o.position?.z||0)-p.z;
        const d=Math.hypot(dx,dz);
        if(d<520)landmarkNear++;
      });
      landmarks.userData.tggNearbyLandmarkCountV113=landmarkNear;
    }

    const detailBudget=balanced?(driving?'medium':'low'):(driving?'high':'ultra');
    root.dataset.tggExplorationDetailBudgetV113=detailBudget;
    root.dataset.tggInteriorProximityActiveV113=String(interiorActive);
    root.dataset.tggNearbyLandmarksV113=String(landmarkNear);
    root.dataset.tggWayfindingBeaconsV113=beacons?'24':'0';
    root.dataset.tggExplorationPathMarksV113=pathMarks?'64':'0';
    root.dataset.tggExplorationFidelityOwnerV113='streaming-aware';
    root.dataset.tggExplorationFidelityV113='1';
  };

  window.TGGExplorationFidelityV113={apply,get};
  apply();
}
function applyExplorationFidelityV113(){window.TGGExplorationFidelityV113?.apply?.()||installExplorationFidelityV113()}

function installNearFieldFidelityV114(){
  if(window.TGGNearFieldV114)return;
  const w=window.TGG3D;
  if(!w?.scene){root.dataset.tggNearFieldFidelityV114='waiting';return}
  const scene=w.scene;
  const refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };
  const focusPos=()=>{
    if(root.dataset.tggDriving==='1'&&w.car?.position)return w.car.position;
    const av=get('TGG_PLAYER_AVATAR')||get('TGG_AVATAR');
    return av?.position||w.camera?.position||null;
  };
  const distTo=(g,p)=>{
    if(!g||!p)return Infinity;
    const x=Number(g.position?.x||0)-p.x,z=Number(g.position?.z||0)-p.z;
    return Math.hypot(x,z);
  };
  let last=0,lastSig='';
  const apply=()=>{
    const now=performance.now();
    if(now-last<500)return;
    last=now;
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',wet=/rain|storm/.test(weather),night=time==='night';
    const p=focusPos();
    const sig=[district,weather,time,quality,driving?'1':'0'].join('|');

    const glass=get('TGG_STOREFRONT_GLASS_DEPTH_V90');
    const windows=get('TGG_WINDOW_REFLECTIONS_V83');
    const curbs=get('TGG_CURB_MEDIAN_V90');
    const sidewalks=get('TGG_SIDEWALK_VARIATION_V83');
    const clutter=get('TGG_STREET_CLUTTER_V84');
    const foliage=get('TGG_FOLIAGE_VARIETY_V83');
    const avShadow=get('TGG_AVATAR_CONTACT_V77');
    const carShadow=get('TGG_VEHICLE_CONTACT_V80');
    const contact=get('TGG_CONTACT_LIGHT_V90');

    if(sig!==lastSig){
      lastSig=sig;
      if(glass?.material){
        glass.material.roughness=wet?.025:.065;
        glass.material.opacity=balanced?.1:night?.24:wet?.21:.16;
        if('envMapIntensity'in glass.material)glass.material.envMapIntensity=wet?1.35:1.05;
      }
      if(windows?.material){
        windows.material.roughness=wet?.035:.085;
        windows.material.opacity=balanced?.1:night?.28:wet?.24:.17;
      }
      if(curbs?.material){
        curbs.material.roughness=wet?.58:.88;
        if('metalness'in curbs.material)curbs.material.metalness=.02;
      }
      if(sidewalks?.material){
        sidewalks.material.roughness=wet?.62:.94;
      }
      if(clutter?.material){
        clutter.material.roughness=wet?.66:.86;
      }
      if(foliage?.material){
        foliage.material.roughness=wet?.78:.95;
      }
    }

    let nearGroups=0,farGroups=0;
    const maxNear=driving?280:170;
    [glass,windows,curbs,sidewalks,clutter,foliage].forEach(g=>{
      if(!g)return;
      const d=distTo(g,p);
      const near=d<=maxNear;
      g.userData.tggNearFieldDistanceV114=Math.round(d);
      g.userData.tggNearFieldV114=near?'near':'far';
      near?nearGroups++:farGroups++;
    });

    if(avShadow?.material)avShadow.material.opacity=balanced?.18:night?.36:wet?.31:.26;
    if(carShadow?.material)carShadow.material.opacity=balanced?.2:night?.38:wet?.34:.29;
    if(contact){
      const active=!balanced&&contact.intensity>0;
      contact.distance=driving?12:9;
      contact.decay=2;
      contact.userData.tggNearFieldOwnedV114='1';
      root.dataset.tggNearFieldContactLightV114=active?'active':'budgeted';
    }

    const traffic=w.traffic||[];
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      v.userData.tggNearFieldPriorityV114=i<10?'high':i<18?'medium':'low';
    });

    root.dataset.tggNearFieldFidelityV114='1';
    root.dataset.tggNearFieldOwnerV114='proximity-material-director';
    root.dataset.tggNearFieldMaterialResponseV114=wet?'wet':'dry';
    root.dataset.tggNearFieldGroupsNearV114=String(nearGroups);
    root.dataset.tggNearFieldGroupsFarV114=String(farGroups);
    root.dataset.tggNearFieldBudgetV114=balanced?'reduced':'full';
    root.dataset.tggNearFieldDistrictV114=district;
  };
  window.TGGNearFieldV114={apply,get};
  apply();
}
function applyNearFieldFidelityV114(){window.TGGNearFieldV114?.apply?.()||installNearFieldFidelityV114()}

function installStreetLifeFidelityV115(){
  if(window.TGGStreetLifeV115)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggStreetLifeFidelityV115='waiting';return}
  const scene=w.scene,refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };
  const focus=()=>{
    if(root.dataset.tggDriving==='1'&&w.car?.position)return w.car.position;
    return get('TGG_PLAYER_AVATAR')?.position||get('TGG_AVATAR')?.position||w.camera?.position||null;
  };

  let pools=get('TGG_INTERACTION_LIGHT_POOLS_V115');
  if(!pools&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(2.4,16);
    const mat=new THREE.MeshBasicMaterial({color:0xb7dcff,transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide});
    pools=new THREE.InstancedMesh(geo,mat,48);pools.name='TGG_INTERACTION_LIGHT_POOLS_V115';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    const anchors=[[-78,-18],[78,-18],[-36,-82],[36,-82],[-45,74],[45,74]];
    for(let i=0;i<48;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length)-3.5;
      p.set(a[0]+row*5.2,.035,a[1]+((i%2)?4:-4));
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,0));
      const sc=.75+(i%4)*.08;s.set(sc,sc,1);m.compose(p,q,s);pools.setMatrixAt(i,m);
    }
    pools.instanceMatrix.needsUpdate=true;scene.add(pools);refs[pools.name]=pools;
  }

  let sidewalkMarks=get('TGG_SIDEWALK_MICRODETAIL_V115');
  if(!sidewalkMarks&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(.7,1.8);
    const mat=new THREE.MeshBasicMaterial({color:0xc9c3b6,transparent:true,opacity:.09,depthWrite:false,side:THREE.DoubleSide});
    sidewalkMarks=new THREE.InstancedMesh(geo,mat,96);sidewalkMarks.name='TGG_SIDEWALK_MICRODETAIL_V115';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const side=i%4,step=Math.floor(i/4)-12;let x=0,z=0,r=0;
      if(side===0){x=-13.2;z=step*10.5;r=0}
      if(side===1){x=13.2;z=step*10.5;r=0}
      if(side===2){x=step*10.5;z=-13.2;r=Math.PI/2}
      if(side===3){x=step*10.5;z=13.2;r=Math.PI/2}
      p.set(x,.04,z);q.setFromEuler(new THREE.Euler(-Math.PI/2,r,0));
      const sc=.72+(i%3)*.08;s.set(sc,1,1);m.compose(p,q,s);sidewalkMarks.setMatrixAt(i,m);
    }
    sidewalkMarks.instanceMatrix.needsUpdate=true;scene.add(sidewalkMarks);refs[sidewalkMarks.name]=sidewalkMarks;
  }

  let last=0,lastSig='';
  const apply=()=>{
    const now=performance.now();if(now-last<500)return;last=now;
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const p=focus();
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(pools){
        pools.visible=!driving&&!balanced&&district!=='park';
        pools.material.opacity=night?.18:wet?.13:.08;
      }
      if(sidewalkMarks){
        sidewalkMarks.visible=!driving&&!balanced&&district!=='park';
        sidewalkMarks.material.opacity=wet?.13:.085;
      }
    }

    const pedestrians=get('TGG_PEDESTRIAN_POCKETS_V77')||get('TGG_AMBIENT_LIFE_V76');
    if(pedestrians&&p){
      const dx=(pedestrians.position?.x||0)-p.x,dz=(pedestrians.position?.z||0)-p.z;
      const d=Math.hypot(dx,dz);
      pedestrians.userData.tggNearFieldDistanceV115=Math.round(d);
      if(!driving&&!balanced)pedestrians.visible=d<360;
    }

    const frontage=get('TGG_PREMIUM_FRONTAGE_V79')||get('TGG_STOREFRONT_FRONTAGE_V77');
    if(frontage&&p){
      const dx=(frontage.position?.x||0)-p.x,dz=(frontage.position?.z||0)-p.z;
      const d=Math.hypot(dx,dz);
      frontage.userData.tggNearFieldDistanceV115=Math.round(d);
      frontage.userData.tggStreetLifePriorityV115=d<260?'near':'ambient';
    }

    const contact=get('TGG_CONTACT_LIGHT_V90');
    if(contact&&!balanced){
      const cap=driving?.8:.68;
      contact.intensity=Math.min(Number(contact.intensity||0),cap);
    }

    root.dataset.tggInteractionLightPoolsV115=pools?'48':'0';
    root.dataset.tggSidewalkMicrodetailV115=sidewalkMarks?'96':'0';
    root.dataset.tggStreetLifeModeV115=driving?'drive':balanced?'balanced':'walk';
    root.dataset.tggStreetLifeOwnerV115='near-field';
    root.dataset.tggStreetLifeFidelityV115='1';
  };
  window.TGGStreetLifeV115={apply,get};
  apply();
}
function applyStreetLifeFidelityV115(){window.TGGStreetLifeV115?.apply?.()||installStreetLifeFidelityV115()}

function installLivingStreetMotionV116(){
  if(window.TGGLivingStreetV116)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggLivingStreetMotionV116='waiting';return}
  const scene=w.scene,refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };
  const focus=()=>{
    if(root.dataset.tggDriving==='1'&&w.car?.position)return w.car.position;
    return get('TGG_PLAYER_AVATAR')?.position||get('TGG_AVATAR')?.position||w.camera?.position||null;
  };

  let last=0,lastSig='';
  const apply=()=>{
    const now=performance.now();if(now-last<350)return;last=now;
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const p=focus();
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    const pedestrians=get('TGG_PEDESTRIAN_POCKETS_V77')||get('TGG_AMBIENT_LIFE_V76');
    const foliage=get('TGG_FOLIAGE_VARIETY_V83')||get('TGG_CITY_COUNTRY_BLEND_V89');
    const frontage=get('TGG_PREMIUM_FRONTAGE_V79')||get('TGG_STOREFRONT_FRONTAGE_V77');
    const pools=get('TGG_INTERACTION_LIGHT_POOLS_V115');

    if(sig!==lastSig){
      lastSig=sig;
      if(pools?.material)pools.material.opacity=balanced?0:night?.2:wet?.14:.09;
      if(frontage?.children){
        frontage.children.forEach(o=>{
          if(!o?.material?.transparent)return;
          const base=Number(o.material.opacity??.2);
          o.material.opacity=Math.min(.58,base+(night?.09:wet?.04:0));
        });
      }
    }

    const t=now*.001;
    if(pedestrians&&!driving&&!balanced){
      pedestrians.rotation.y=Math.sin(t*.18)*.018;
      pedestrians.position.y=Math.sin(t*.9)*.015;
      root.dataset.tggPedestrianMotionV116='ambient';
    }else root.dataset.tggPedestrianMotionV116='budgeted';

    if(foliage&&!balanced){
      foliage.rotation.y=Math.sin(t*.12)*.006;
      foliage.rotation.z=Math.sin(t*.35)*.004;
      root.dataset.tggFoliageWindV116=wet?'rain-breeze':'light-breeze';
    }else root.dataset.tggFoliageWindV116='budgeted';

    const traffic=w.traffic||[];
    let brake=0,idle=0;
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      const speed=Number(v.userData.speed||v.userData.tggSpeed||0);
      const phase=(Math.sin(t*.7+i*.9)+1)*.5;
      const braking=speed<.35&&phase>.7;
      v.userData.tggTrafficBrakeCueV116=braking?'1':'0';
      v.userData.tggTrafficIdleCueV116=speed<.2?'1':'0';
      if(braking)brake++;if(speed<.2)idle++;
      const lights=v.getObjectByName?.('TGG_TRAFFIC_LIGHTS_V83');
      if(lights)lights.visible=night||wet||braking;
    });

    if(frontage&&p){
      const dx=Number(frontage.position?.x||0)-p.x,dz=Number(frontage.position?.z||0)-p.z;
      const d=Math.hypot(dx,dz);
      frontage.userData.tggProximityGlowV116=d<95?'near':d<180?'mid':'far';
      root.dataset.tggStorefrontProximityV116=frontage.userData.tggProximityGlowV116;
    }

    const ambience={downtown:1,studio:.88,media:.92,park:.58,home:.66,garage:.74}[district]||.8;
    root.dataset.tggTrafficBrakeCuesV116=String(brake);
    root.dataset.tggTrafficIdleCuesV116=String(idle);
    root.dataset.tggDistrictAmbientIntensityV116=String(ambience);
    root.dataset.tggLivingStreetOwnerV116='motion+proximity+traffic';
    root.dataset.tggLivingStreetMotionV116='1';
  };

  window.TGGLivingStreetV116={apply};
  apply();
}
function applyLivingStreetMotionV116(){window.TGGLivingStreetV116?.apply?.()||installLivingStreetMotionV116()}

function installExplorationMotionV117(){
  if(window.TGGExplorationMotionV117)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggExplorationMotionV117='waiting';return}
  const scene=w.scene,refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };
  const focus=()=>{
    if(root.dataset.tggDriving==='1'&&w.car?.position)return w.car.position;
    return get('TGG_PLAYER_AVATAR')?.position||get('TGG_AVATAR')?.position||w.camera?.position||null;
  };
  const dist=(obj,p)=>{
    if(!obj||!p)return Infinity;
    const dx=Number(obj.position?.x||0)-p.x,dz=Number(obj.position?.z||0)-p.z;
    return Math.hypot(dx,dz);
  };

  let last=0,lastSig='';
  const apply=()=>{
    const now=performance.now();if(now-last<300)return;last=now;
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const p=focus();
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    const signage=get('TGG_DISTRICT_SIGNAGE_V79');
    const glass=get('TGG_STOREFRONT_GLASS_DEPTH_V90')||get('TGG_WINDOW_REFLECTIONS_V83');
    const clutter=get('TGG_STREET_CLUTTER_V84');
    const foliage=get('TGG_FOLIAGE_VARIETY_V83')||get('TGG_CITY_COUNTRY_BLEND_V89');
    const lights=get('TGG_LANDMARK_APPROACH_LIGHTS_V89');
    const interaction=get('TGG_INTERACTION_LIGHT_POOLS_V115');

    if(sig!==lastSig){
      lastSig=sig;
      if(signage?.material)signage.material.opacity=balanced?.36:night?.88:wet?.66:.52;
      if(glass?.material){
        glass.material.opacity=balanced?.1:night?.27:wet?.23:.17;
        if('envMapIntensity'in glass.material)glass.material.envMapIntensity=wet?1.4:1.08;
      }
      if(lights?.material)lights.material.opacity=balanced?.18:night?.5:wet?.39:.25;
      if(interaction?.material)interaction.material.opacity=balanced?0:night?.21:wet?.14:.09;
    }

    let near=0,mid=0,far=0;
    [signage,glass,clutter,foliage,lights,interaction].forEach(obj=>{
      if(!obj)return;
      const d=dist(obj,p);
      const band=d<120?'near':d<300?'mid':'far';
      obj.userData.tggExplorationBandV117=band;
      if(band==='near')near++;else if(band==='mid')mid++;else far++;
    });

    const t=now*.001;
    if(signage&&!balanced){
      signage.position.y=Math.sin(t*.35)*.02;
      root.dataset.tggSignageMotionV117='subtle';
    }else root.dataset.tggSignageMotionV117='budgeted';

    if(foliage&&!balanced){
      const amp=wet?.008:.004;
      foliage.rotation.z=Math.sin(t*.45)*amp;
    }

    const traffic=w.traffic||[];
    let moving=0,stopped=0;
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      const speed=Math.abs(Number(v.userData.speed||v.userData.tggSpeed||0));
      const movingNow=speed>.25;
      movingNow?moving++:stopped++;
      v.userData.tggExplorationMotionV117=movingNow?'moving':'stopped';
      const lights=v.getObjectByName?.('TGG_TRAFFIC_LIGHTS_V83');
      if(lights)lights.visible=night||wet||(!movingNow&&((i+Math.floor(t))%3===0));
    });

    if(w.camera&&p){
      const targetFar=driving?4800:4400;
      if(Number(w.camera.far||0)!==targetFar){
        w.camera.far=targetFar;w.camera.updateProjectionMatrix?.();
      }
    }

    root.dataset.tggExplorationNearBandsV117=String(near);
    root.dataset.tggExplorationMidBandsV117=String(mid);
    root.dataset.tggExplorationFarBandsV117=String(far);
    root.dataset.tggTrafficMovingV117=String(moving);
    root.dataset.tggTrafficStoppedV117=String(stopped);
    root.dataset.tggExplorationDepthModeV117=driving?'drive-depth':'street-depth';
    root.dataset.tggExplorationMotionOwnerV117='proximity+traffic+ambient';
    root.dataset.tggExplorationMotionV117='1';
  };

  window.TGGExplorationMotionV117={apply};
  apply();
}
function applyExplorationMotionV117(){window.TGGExplorationMotionV117?.apply?.()||installExplorationMotionV117()}

function installEnvironmentalStorytellingV118(){
  if(window.TGGEnvironmentStoryV118)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggEnvironmentalStorytellingV118='waiting';return}
  const scene=w.scene,refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };

  let crosswalks=get('TGG_CROSSWALKS_V118');
  if(!crosswalks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.62,.025,5.4);
    const mat=new THREE.MeshBasicMaterial({color:0xf4f1e8,transparent:true,opacity:.78});
    crosswalks=new THREE.InstancedMesh(geo,mat,96);crosswalks.name='TGG_CROSSWALKS_V118';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const junctions=[[-72,-72],[72,-72],[-72,72],[72,72],[0,-108],[0,108],[-108,0],[108,0]];
    for(let i=0;i<96;i++){
      const j=junctions[Math.floor(i/12)%junctions.length],stripe=i%12;
      const axis=(Math.floor(i/12)%2)===0;
      const off=(stripe-5.5)*.72;
      p.set(j[0]+(axis?off:0),.06,j[1]+(axis?0:off));
      q.setFromEuler(new THREE.Euler(0,axis?0:Math.PI/2,0));
      m.compose(p,q,s);crosswalks.setMatrixAt(i,m);
    }
    crosswalks.instanceMatrix.needsUpdate=true;scene.add(crosswalks);refs[crosswalks.name]=crosswalks;
  }

  let streetProps=get('TGG_STREET_PROPS_V118');
  if(!streetProps&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.72,1.05,.72);
    const mat=new THREE.MeshStandardMaterial({color:0x4a525b,roughness:.82,metalness:.28});
    streetProps=new THREE.InstancedMesh(geo,mat,84);streetProps.name='TGG_STREET_PROPS_V118';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const a=(i/84)*Math.PI*2,r=58+(i%8)*20;
      p.set(Math.cos(a)*r,.52,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.7,0));
      const sc=.65+(i%5)*.08;s.set(sc,.72+(i%4)*.12,sc);m.compose(p,q,s);streetProps.setMatrixAt(i,m);
    }
    streetProps.instanceMatrix.needsUpdate=true;scene.add(streetProps);refs[streetProps.name]=streetProps;
  }

  let benches=get('TGG_BENCHES_V118');
  if(!benches&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.6,.18,.72);
    const mat=new THREE.MeshStandardMaterial({color:0x5d4633,roughness:.9,metalness:.08});
    benches=new THREE.InstancedMesh(geo,mat,36);benches.name='TGG_BENCHES_V118';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<36;i++){
      const a=(i/36)*Math.PI*2,r=86+(i%6)*18;
      p.set(Math.cos(a)*r,.55,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));m.compose(p,q,s);benches.setMatrixAt(i,m);
    }
    benches.instanceMatrix.needsUpdate=true;scene.add(benches);refs[benches.name]=benches;
  }

  let porch=get('TGG_PORCH_LIGHTS_V118');
  if(!porch&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(.5,.5);
    const mat=new THREE.MeshBasicMaterial({color:0xffd79b,transparent:true,opacity:.35,depthWrite:false,side:THREE.DoubleSide});
    porch=new THREE.InstancedMesh(geo,mat,56);porch.name='TGG_PORCH_LIGHTS_V118';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<56;i++){
      const a=(i/56)*Math.PI*2,r=275+(i%4)*38;
      p.set(Math.cos(a)*r,3.2+(i%3)*.8,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      const sc=.8+(i%3)*.1;s.set(sc,sc,1);m.compose(p,q,s);porch.setMatrixAt(i,m);
    }
    porch.instanceMatrix.needsUpdate=true;scene.add(porch);refs[porch.name]=porch;
  }

  let arrows=get('TGG_LANE_ARROWS_V118');
  if(!arrows&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.1,3);
    const mat=new THREE.MeshBasicMaterial({color:0xe8e6da,transparent:true,opacity:.5,depthWrite:false,side:THREE.DoubleSide});
    arrows=new THREE.InstancedMesh(geo,mat,48);arrows.name='TGG_LANE_ARROWS_V118';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<48;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-6;
      p.set(axis?step*26:side*3.6,.058,axis?side*3.6:step*26);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,axis?Math.PI/2:0));
      m.compose(p,q,s);arrows.setMatrixAt(i,m);
    }
    arrows.instanceMatrix.needsUpdate=true;scene.add(arrows);refs[arrows.name]=arrows;
  }

  const focus=()=>{
    if(root.dataset.tggDriving==='1'&&w.car?.position)return w.car.position;
    return get('TGG_PLAYER_AVATAR')?.position||get('TGG_AVATAR')?.position||w.camera?.position||null;
  };

  let last=0,lastSig='';
  const apply=()=>{
    const now=performance.now();if(now-last<450)return;last=now;
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const p=focus();
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(crosswalks?.material)crosswalks.material.opacity=wet?.88:.72;
      if(streetProps)streetProps.visible=district!=='park'&&(!balanced||district==='downtown');
      if(benches)benches.visible=!driving&&!balanced&&(district==='park'||district==='home'||district==='downtown');
      if(porch){
        porch.visible=(night||time==='golden')&&(district==='home'||district==='park'||driving);
        porch.material.opacity=night?.52:.28;
      }
      if(arrows)arrows.visible=driving||district==='downtown'||district==='garage';
    }

    let near=0;
    [crosswalks,streetProps,benches,porch,arrows].forEach(obj=>{
      if(!obj||!p)return;
      const dx=Number(obj.position?.x||0)-p.x,dz=Number(obj.position?.z||0)-p.z;
      const d=Math.hypot(dx,dz);
      obj.userData.tggStoryBandV118=d<140?'near':d<320?'mid':'far';
      if(d<140)near++;
    });

    const t=now*.001;
    if(porch?.visible&&!balanced)porch.material.opacity=(night?.46:.24)+Math.sin(t*.65)*.035;

    root.dataset.tggCrosswalksV118=crosswalks?'96':'0';
    root.dataset.tggStreetPropsV118=streetProps?'84':'0';
    root.dataset.tggBenchesV118=benches?'36':'0';
    root.dataset.tggPorchLightsV118=porch?'56':'0';
    root.dataset.tggLaneArrowsV118=arrows?'48':'0';
    root.dataset.tggStoryNearFieldV118=String(near);
    root.dataset.tggEnvironmentalStoryOwnerV118='street+neighborhood+navigation';
    root.dataset.tggEnvironmentalStorytellingV118='1';
  };

  window.TGGEnvironmentStoryV118={apply};
  apply();
}
function applyEnvironmentalStorytellingV118(){window.TGGEnvironmentStoryV118?.apply?.()||installEnvironmentalStorytellingV118()}

function installSurfaceStorytellingV119(){
  if(window.TGGSurfaceStoryV119)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggSurfaceStorytellingV119='waiting';return}
  const scene=w.scene,refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };

  let patches=get('TGG_ASPHALT_PATCHES_V119');
  if(!patches&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(5.2,2.8);
    const mat=new THREE.MeshStandardMaterial({color:0x2e3136,roughness:.93,metalness:.02,transparent:true,opacity:.72,side:THREE.DoubleSide});
    patches=new THREE.InstancedMesh(geo,mat,120);patches.name='TGG_ASPHALT_PATCHES_V119';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<120;i++){
      const axis=i%2,step=Math.floor(i/4)-15,side=i%4<2?-1:1;
      p.set(axis?step*11:side*5.8,.045,axis?side*5.8:step*11);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,axis?Math.PI/2:0));
      const sc=.72+(i%5)*.09;s.set(sc,.62+(i%4)*.1,1);
      m.compose(p,q,s);patches.setMatrixAt(i,m);
    }
    patches.instanceMatrix.needsUpdate=true;scene.add(patches);refs[patches.name]=patches;
  }

  let fences=get('TGG_EDGE_FENCES_V119');
  if(!fences&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.4,1.45,.09);
    const mat=new THREE.MeshStandardMaterial({color:0x4f5962,roughness:.74,metalness:.46});
    fences=new THREE.InstancedMesh(geo,mat,96);fences.name='TGG_EDGE_FENCES_V119';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*2,r=180+(i%8)*34;
      p.set(Math.cos(a)*r,.72,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      m.compose(p,q,s);fences.setMatrixAt(i,m);
    }
    fences.instanceMatrix.needsUpdate=true;scene.add(fences);refs[fences.name]=fences;
  }

  let utility=get('TGG_UTILITY_OBJECTS_V119');
  if(!utility&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.85,1.1,.55);
    const mat=new THREE.MeshStandardMaterial({color:0x586169,roughness:.82,metalness:.28});
    utility=new THREE.InstancedMesh(geo,mat,64);utility.name='TGG_UTILITY_OBJECTS_V119';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const a=(i/64)*Math.PI*2,r=72+(i%6)*22;
      p.set(Math.cos(a)*r,.55,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.6,0));
      const sc=.78+(i%4)*.08;s.set(sc,.82+(i%3)*.1,sc);m.compose(p,q,s);utility.setMatrixAt(i,m);
    }
    utility.instanceMatrix.needsUpdate=true;scene.add(utility);refs[utility.name]=utility;
  }

  let driveways=get('TGG_DRIVEWAY_TRANSITIONS_V119');
  if(!driveways&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(5.8,3.2);
    const mat=new THREE.MeshStandardMaterial({color:0x55595e,roughness:.92,metalness:.01,side:THREE.DoubleSide});
    driveways=new THREE.InstancedMesh(geo,mat,80);driveways.name='TGG_DRIVEWAY_TRANSITIONS_V119';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<80;i++){
      const a=(i/80)*Math.PI*2,r=235+(i%5)*34;
      p.set(Math.cos(a)*r,.04,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,-a));
      const sc=.78+(i%4)*.08;s.set(sc,.9,1);m.compose(p,q,s);driveways.setMatrixAt(i,m);
    }
    driveways.instanceMatrix.needsUpdate=true;scene.add(driveways);refs[driveways.name]=driveways;
  }

  let last=0,lastSig='';
  const apply=()=>{
    const now=performance.now();if(now-last<450)return;last=now;
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(patches?.material){
        patches.visible=!balanced||driving;
        patches.material.roughness=wet?.52:.93;
        patches.material.opacity=night?.82:wet?.8:.7;
      }
      if(fences?.material){
        fences.visible=district!=='downtown'||driving;
        fences.material.color.setHex(district==='park'?0x49584f:district==='home'?0x5e625d:0x4f5962);
        fences.material.roughness=wet?.58:.74;
      }
      if(utility?.material){
        utility.visible=district!=='park'&&(!balanced||district==='downtown'||district==='studio');
        utility.material.roughness=wet?.64:.82;
      }
      if(driveways?.material){
        driveways.visible=(district==='home'||district==='garage'||driving)&&!balanced;
        driveways.material.roughness=wet?.56:.92;
        driveways.material.color.setHex(district==='home'?0x5f5c55:0x55595e);
      }
    }

    root.dataset.tggAsphaltPatchesV119=patches?'120':'0';
    root.dataset.tggEdgeFencesV119=fences?'96':'0';
    root.dataset.tggUtilityObjectsV119=utility?'64':'0';
    root.dataset.tggDrivewayTransitionsV119=driveways?'80':'0';
    root.dataset.tggSurfaceStoryWeatherV119=wet?'wet':'dry';
    root.dataset.tggSurfaceStoryDistrictV119=district;
    root.dataset.tggSurfaceStorytellingV119='1';
  };

  window.TGGSurfaceStoryV119={apply};
  apply();
}
function applySurfaceStorytellingV119(){window.TGGSurfaceStoryV119?.apply?.()||installSurfaceStorytellingV119()}

function installWorldNavigationV120(){
  if(window.TGGWorldNavigationV120)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldNavigationV120='waiting';return}
  const scene=w.scene;

  const anchors=[
    ['downtown',0,-320,0x6ec8ff],
    ['studio',-300,-110,0xff6da8],
    ['media',300,-40,0xb68cff],
    ['park',220,300,0x7edc9b],
    ['home',-270,280,0xffd37a],
    ['garage',0,390,0x9ed8ff]
  ];

  let beacons=scene.getObjectByName?.('TGG_DESTINATION_BEACONS_V120');
  if(!beacons){
    beacons=new THREE.Group();beacons.name='TGG_DESTINATION_BEACONS_V120';
    anchors.forEach(([name,x,z,color])=>{
      const ring=new THREE.Mesh(
        new THREE.RingGeometry(2.4,3.1,32),
        new THREE.MeshBasicMaterial({color,transparent:true,opacity:.4,side:THREE.DoubleSide,depthWrite:false})
      );
      ring.rotation.x=-Math.PI/2;ring.position.set(x,.08,z);ring.userData.tggDestinationV120=name;beacons.add(ring);
      const pole=new THREE.Mesh(
        new THREE.CylinderGeometry(.08,.08,8,6),
        new THREE.MeshBasicMaterial({color,transparent:true,opacity:.28})
      );
      pole.position.set(x,4,z);pole.userData.tggDestinationV120=name;beacons.add(pole);
    });
    scene.add(beacons);
  }

  let wayfinding=scene.getObjectByName?.('TGG_WAYFINDING_MARKERS_V120');
  if(!wayfinding&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.8,.12,.5);
    const mat=new THREE.MeshBasicMaterial({color:0xaedcff,transparent:true,opacity:.34,depthWrite:false});
    wayfinding=new THREE.InstancedMesh(geo,mat,84);wayfinding.name='TGG_WAYFINDING_MARKERS_V120';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<84;i++){
      const a=(i/84)*Math.PI*2,r=110+(i%7)*46;
      p.set(Math.cos(a)*r,.065,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      m.compose(p,q,s);wayfinding.setMatrixAt(i,m);
    }
    wayfinding.instanceMatrix.needsUpdate=true;scene.add(wayfinding);
  }

  let districtLabels=scene.getObjectByName?.('TGG_DISTRICT_LABEL_GLOW_V120');
  if(!districtLabels&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(5.8,1.2);
    const mat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide});
    districtLabels=new THREE.InstancedMesh(geo,mat,18);districtLabels.name='TGG_DISTRICT_LABEL_GLOW_V120';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<18;i++){
      const a=anchors[i%anchors.length],layer=Math.floor(i/anchors.length);
      p.set(a[1],4.5+layer*.8,a[2]-6-layer*2.4);
      q.identity();s.set(.9-layer*.08,1,1);m.compose(p,q,s);districtLabels.setMatrixAt(i,m);
    }
    districtLabels.instanceMatrix.needsUpdate=true;scene.add(districtLabels);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      beacons?.children?.forEach(o=>{
        const active=o.userData?.tggDestinationV120===district;
        if(o.material)o.material.opacity=active?(night?.72:.5):(balanced?.12:.24);
      });
      if(wayfinding){
        wayfinding.visible=driving||!balanced;
        wayfinding.material.opacity=night?.42:wet?.38:.28;
      }
      if(districtLabels){
        districtLabels.visible=!balanced||driving;
        districtLabels.material.opacity=night?.34:.18;
      }
    }

    const focus=driving?w.car?.position:w.camera?.position;
    let nearest='none',nearestDist=Infinity;
    if(focus){
      anchors.forEach(([name,x,z])=>{
        const d=Math.hypot(focus.x-x,focus.z-z);
        if(d<nearestDist){nearestDist=d;nearest=name}
      });
    }
    root.dataset.tggNearestDestinationV120=nearest;
    root.dataset.tggNearestDestinationDistanceV120=Number.isFinite(nearestDist)?String(Math.round(nearestDist)):'0';
    root.dataset.tggDestinationBeaconsV120='6';
    root.dataset.tggWayfindingMarkersV120=wayfinding?'84':'0';
    root.dataset.tggDistrictLabelGlowV120=districtLabels?'18':'0';
    root.dataset.tggWorldNavigationV120='1';
  };

  window.TGGWorldNavigationV120={apply};
  apply();
}
function applyWorldNavigationV120(){window.TGGWorldNavigationV120?.apply?.()||installWorldNavigationV120()}

function installDestinationArchitectureV121(){
  if(window.TGGDestinationArchitectureV121)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggDestinationArchitectureV121='waiting';return}
  const scene=w.scene;
  const anchors=[
    ['downtown',0,-320,0x6ec8ff],
    ['studio',-300,-110,0xff6da8],
    ['media',300,-40,0xb68cff],
    ['park',220,300,0x7edc9b],
    ['home',-270,280,0xffd37a],
    ['garage',0,390,0x9ed8ff]
  ];

  let canopies=scene.getObjectByName?.('TGG_DESTINATION_CANOPIES_V121');
  if(!canopies&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(9,.45,4.8);
    const mat=new THREE.MeshStandardMaterial({color:0x313a45,roughness:.62,metalness:.26});
    canopies=new THREE.InstancedMesh(geo,mat,18);canopies.name='TGG_DESTINATION_CANOPIES_V121';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<18;i++){
      const a=anchors[i%anchors.length],layer=Math.floor(i/anchors.length);
      p.set(a[1],4.8+layer*.35,a[2]-10-layer*5);
      q.identity();s.set(.92-layer*.08,1,.9);m.compose(p,q,s);canopies.setMatrixAt(i,m);
    }
    canopies.instanceMatrix.needsUpdate=true;scene.add(canopies);
  }

  let bollards=scene.getObjectByName?.('TGG_ENTRY_BOLLARDS_V121');
  if(!bollards&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.16,.19,1.15,8);
    const mat=new THREE.MeshStandardMaterial({color:0x59636f,roughness:.54,metalness:.52});
    bollards=new THREE.InstancedMesh(geo,mat,72);bollards.name='TGG_ENTRY_BOLLARDS_V121';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<72;i++){
      const a=anchors[Math.floor(i/12)%anchors.length],slot=i%12,row=Math.floor(slot/6),col=slot%6;
      p.set(a[1]+(col-2.5)*1.8,.58,a[2]-5-row*3.2);
      q.identity();m.compose(p,q,s);bollards.setMatrixAt(i,m);
    }
    bollards.instanceMatrix.needsUpdate=true;scene.add(bollards);
  }

  let rooftops=scene.getObjectByName?.('TGG_ROOFTOP_EQUIPMENT_V121');
  if(!rooftops&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.2,1.1,1.8);
    const mat=new THREE.MeshStandardMaterial({color:0x4b535c,roughness:.82,metalness:.28});
    rooftops=new THREE.InstancedMesh(geo,mat,84);rooftops.name='TGG_ROOFTOP_EQUIPMENT_V121';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const a=(i/84)*Math.PI*2,r=118+(i%7)*30;
      p.set(Math.cos(a)*r,10+(i%6)*4.2,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.35,0));
      const sc=.7+(i%5)*.09;s.set(sc,.72+(i%4)*.08,sc);m.compose(p,q,s);rooftops.setMatrixAt(i,m);
    }
    rooftops.instanceMatrix.needsUpdate=true;scene.add(rooftops);
  }

  let shelters=scene.getObjectByName?.('TGG_TRANSIT_SHELTERS_V121');
  if(!shelters&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(5.2,2.7,.32);
    const mat=new THREE.MeshPhysicalMaterial({color:0x5e7487,roughness:.18,metalness:.18,transparent:true,opacity:.34,transmission:.12});
    shelters=new THREE.InstancedMesh(geo,mat,24);shelters.name='TGG_TRANSIT_SHELTERS_V121';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<24;i++){
      const a=(i/24)*Math.PI*2,r=92+(i%4)*42;
      p.set(Math.cos(a)*r,1.35,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      s.set(.88+(i%3)*.07,1,1);m.compose(p,q,s);shelters.setMatrixAt(i,m);
    }
    shelters.instanceMatrix.needsUpdate=true;scene.add(shelters);
  }

  let entryLights=scene.getObjectByName?.('TGG_DESTINATION_ENTRY_LIGHTS_V121');
  if(!entryLights&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.1,1.1);
    const mat=new THREE.MeshBasicMaterial({color:0xc9ecff,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide});
    entryLights=new THREE.InstancedMesh(geo,mat,36);entryLights.name='TGG_DESTINATION_ENTRY_LIGHTS_V121';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<36;i++){
      const a=anchors[Math.floor(i/6)%anchors.length],slot=i%6;
      p.set(a[1]+(slot-2.5)*1.7,.07,a[2]-7);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,0));m.compose(p,q,s);entryLights.setMatrixAt(i,m);
    }
    entryLights.instanceMatrix.needsUpdate=true;scene.add(entryLights);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=time==='night',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(canopies){
        canopies.visible=!balanced||district==='studio'||district==='garage'||district==='media';
        canopies.material.roughness=wet?.38:.62;
      }
      if(bollards)bollards.visible=!balanced||district==='downtown'||district==='studio'||district==='garage';
      if(rooftops)rooftops.visible=!balanced||district==='downtown';
      if(shelters){
        shelters.visible=district!=='park'||driving;
        shelters.material.opacity=night?.46:wet?.41:.3;
        shelters.material.roughness=wet?.08:.18;
      }
      if(entryLights){
        entryLights.visible=(night||wet||driving)&&!balanced;
        entryLights.material.opacity=night?.52:wet?.38:.24;
      }
    }

    root.dataset.tggDestinationCanopiesV121=canopies?'18':'0';
    root.dataset.tggEntryBollardsV121=bollards?'72':'0';
    root.dataset.tggRooftopEquipmentV121=rooftops?'84':'0';
    root.dataset.tggTransitSheltersV121=shelters?'24':'0';
    root.dataset.tggDestinationEntryLightsV121=entryLights?'36':'0';
    root.dataset.tggArrivalArchitectureV121='1';
    root.dataset.tggDestinationArchitectureV121='1';
  };

  window.TGGDestinationArchitectureV121={apply};
  apply();
}
function applyDestinationArchitectureV121(){window.TGGDestinationArchitectureV121?.apply?.()||installDestinationArchitectureV121()}

function installArrivalExperienceV122(){
  if(window.TGGArrivalExperienceV122)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggArrivalExperienceV122='waiting';return}
  const scene=w.scene;
  const anchors=[
    ['downtown',0,-320,0x6ec8ff],
    ['studio',-300,-110,0xff6da8],
    ['media',300,-40,0xb68cff],
    ['park',220,300,0x7edc9b],
    ['home',-270,280,0xffd37a],
    ['garage',0,390,0x9ed8ff]
  ];

  let plazas=scene.getObjectByName?.('TGG_DESTINATION_PLAZAS_V122');
  if(!plazas&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(18,.12,12);
    const mat=new THREE.MeshStandardMaterial({color:0x5d6268,roughness:.9,metalness:.02});
    plazas=new THREE.InstancedMesh(geo,mat,12);plazas.name='TGG_DESTINATION_PLAZAS_V122';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<12;i++){
      const a=anchors[i%anchors.length],layer=Math.floor(i/anchors.length);
      p.set(a[1],.06,a[2]-10-layer*15);
      q.identity();s.set(1-layer*.12,1,.92);m.compose(p,q,s);plazas.setMatrixAt(i,m);
    }
    plazas.instanceMatrix.needsUpdate=true;scene.add(plazas);
  }

  let parking=scene.getObjectByName?.('TGG_DESTINATION_PARKING_V122');
  if(!parking&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.12,.025,4.6);
    const mat=new THREE.MeshBasicMaterial({color:0xf5f0db,transparent:true,opacity:.5});
    parking=new THREE.InstancedMesh(geo,mat,96);parking.name='TGG_DESTINATION_PARKING_V122';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const a=anchors[Math.floor(i/16)%anchors.length],slot=i%16,row=Math.floor(slot/8),col=slot%8;
      p.set(a[1]+(col-3.5)*2.1,.08,a[2]+8+row*5.4);
      q.identity();m.compose(p,q,s);parking.setMatrixAt(i,m);
    }
    parking.instanceMatrix.needsUpdate=true;scene.add(parking);
  }

  let benches=scene.getObjectByName?.('TGG_DESTINATION_BENCHES_V122');
  if(!benches&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.4,.18,.55);
    const mat=new THREE.MeshStandardMaterial({color:0x4d4338,roughness:.9,metalness:.05});
    benches=new THREE.InstancedMesh(geo,mat,36);benches.name='TGG_DESTINATION_BENCHES_V122';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<36;i++){
      const a=anchors[Math.floor(i/6)%anchors.length],slot=i%6;
      p.set(a[1]+(slot-2.5)*3.4,.48,a[2]-16);
      q.setFromEuler(new THREE.Euler(0,slot%2?Math.PI:0,0));m.compose(p,q,s);benches.setMatrixAt(i,m);
    }
    benches.instanceMatrix.needsUpdate=true;scene.add(benches);
  }

  let arrivalTrees=scene.getObjectByName?.('TGG_DESTINATION_TREES_V122');
  if(!arrivalTrees&&THREE.InstancedMesh){
    const geo=new THREE.ConeGeometry(1.15,4.8,7);
    const mat=new THREE.MeshStandardMaterial({color:0x355b3d,roughness:.96});
    arrivalTrees=new THREE.InstancedMesh(geo,mat,48);arrivalTrees.name='TGG_DESTINATION_TREES_V122';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<48;i++){
      const a=anchors[Math.floor(i/8)%anchors.length],slot=i%8,row=Math.floor(slot/4),col=slot%4;
      p.set(a[1]+(col-1.5)*6.3,2.4,a[2]-22-row*6);
      q.setFromEuler(new THREE.Euler(0,(i%5)*.3,0));
      const sc=.72+(i%4)*.08;s.set(sc,.78+(i%3)*.09,sc);m.compose(p,q,s);arrivalTrees.setMatrixAt(i,m);
    }
    arrivalTrees.instanceMatrix.needsUpdate=true;scene.add(arrivalTrees);
  }

  let glow=scene.getObjectByName?.('TGG_DESTINATION_ARRIVAL_GLOW_V122');
  if(!glow&&THREE.InstancedMesh){
    const geo=new THREE.RingGeometry(4.8,6.4,32);
    const mat=new THREE.MeshBasicMaterial({color:0xbfe8ff,transparent:true,opacity:.14,depthWrite:false,side:THREE.DoubleSide});
    glow=new THREE.InstancedMesh(geo,mat,6);glow.name='TGG_DESTINATION_ARRIVAL_GLOW_V122';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    anchors.forEach((a,i)=>{
      p.set(a[1],.09,a[2]);q.setFromEuler(new THREE.Euler(-Math.PI/2,0,0));m.compose(p,q,s);glow.setMatrixAt(i,m);
    });
    glow.instanceMatrix.needsUpdate=true;scene.add(glow);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(plazas){
        plazas.visible=!balanced||district==='downtown'||district==='studio'||district==='garage';
        plazas.material.roughness=wet?.48:.9;
      }
      if(parking){
        parking.visible=driving||district==='garage'||district==='studio'||district==='media';
        parking.material.opacity=night?.68:wet?.6:.46;
      }
      if(benches)benches.visible=!balanced||district==='park'||district==='home';
      if(arrivalTrees){
        arrivalTrees.visible=district==='park'||district==='home'||!balanced;
        arrivalTrees.material.color.setHex(district==='park'?0x2f6640:0x355b3d);
      }
      if(glow){
        glow.visible=(night||wet||driving)&&!balanced;
        glow.material.opacity=night?.28:wet?.22:.16;
      }
    }

    const focus=driving?w.car?.position:w.camera?.position;
    let arrived='none',dist=Infinity;
    if(focus){
      anchors.forEach(([name,x,z])=>{
        const d=Math.hypot(focus.x-x,focus.z-z);
        if(d<dist){dist=d;arrived=name}
      });
    }
    root.dataset.tggArrivalDestinationV122=dist<38?arrived:'none';
    root.dataset.tggArrivalDistanceV122=Number.isFinite(dist)?String(Math.round(dist)):'0';
    root.dataset.tggDestinationPlazasV122=plazas?'12':'0';
    root.dataset.tggDestinationParkingV122=parking?'96':'0';
    root.dataset.tggDestinationBenchesV122=benches?'36':'0';
    root.dataset.tggDestinationTreesV122=arrivalTrees?'48':'0';
    root.dataset.tggDestinationArrivalGlowV122=glow?'6':'0';
    root.dataset.tggArrivalExperienceV122='1';
  };

  window.TGGArrivalExperienceV122={apply};
  apply();
}
function applyArrivalExperienceV122(){window.TGGArrivalExperienceV122?.apply?.()||installArrivalExperienceV122()}

function installInteractionReadabilityV123(){
  if(window.TGGInteractionReadabilityV123)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggInteractionReadabilityV123='waiting';return}
  const scene=w.scene;
  const anchors=[
    ['downtown',0,-320,0x6ec8ff,'business'],
    ['studio',-300,-110,0xff6da8,'studio'],
    ['media',300,-40,0xb68cff,'media'],
    ['park',220,300,0x7edc9b,'park'],
    ['home',-270,280,0xffd37a,'home'],
    ['garage',0,390,0x9ed8ff,'garage']
  ];

  let rings=scene.getObjectByName?.('TGG_INTERACTION_RINGS_V123');
  if(!rings){
    rings=new THREE.Group();rings.name='TGG_INTERACTION_RINGS_V123';
    anchors.forEach(([name,x,z,color,type])=>{
      const ring=new THREE.Mesh(
        new THREE.RingGeometry(1.8,2.5,32),
        new THREE.MeshBasicMaterial({color,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false})
      );
      ring.rotation.x=-Math.PI/2;ring.position.set(x,.1,z-7);
      ring.userData.tggInteractionNameV123=name;
      ring.userData.tggInteractionTypeV123=type;
      rings.add(ring);
    });
    scene.add(rings);
  }

  let entryGlow=scene.getObjectByName?.('TGG_INTERACTION_ENTRY_GLOW_V123');
  if(!entryGlow&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(2.2,.8);
    const mat=new THREE.MeshBasicMaterial({color:0xcdeeff,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide});
    entryGlow=new THREE.InstancedMesh(geo,mat,36);entryGlow.name='TGG_INTERACTION_ENTRY_GLOW_V123';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<36;i++){
      const a=anchors[Math.floor(i/6)%anchors.length],slot=i%6;
      p.set(a[1]+(slot-2.5)*1.1,1.8,a[2]-6.6);
      q.identity();m.compose(p,q,s);entryGlow.setMatrixAt(i,m);
    }
    entryGlow.instanceMatrix.needsUpdate=true;scene.add(entryGlow);
  }

  let guideDots=scene.getObjectByName?.('TGG_INTERACTION_GUIDE_DOTS_V123');
  if(!guideDots&&THREE.InstancedMesh){
    const geo=new THREE.SphereGeometry(.16,6,5);
    const mat=new THREE.MeshBasicMaterial({color:0xa9dcff,transparent:true,opacity:.26,depthWrite:false});
    guideDots=new THREE.InstancedMesh(geo,mat,60);guideDots.name='TGG_INTERACTION_GUIDE_DOTS_V123';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<60;i++){
      const a=anchors[Math.floor(i/10)%anchors.length],step=i%10;
      p.set(a[1],.18,a[2]-20+step*1.35);
      q.identity();m.compose(p,q,s);guideDots.setMatrixAt(i,m);
    }
    guideDots.instanceMatrix.needsUpdate=true;scene.add(guideDots);
  }

  let lastNearest='none',lastDist=Infinity;
  const nearest=()=>{
    const focus=(root.dataset.tggDriving==='1'||state.driving)?w.car?.position:w.camera?.position;
    if(!focus)return null;
    let out=null,dist=Infinity;
    anchors.forEach(a=>{
      const d=Math.hypot(focus.x-a[1],focus.z-a[2]);
      if(d<dist){dist=d;out=a}
    });
    return out?{anchor:out,dist}:null;
  };

  const apply=()=>{
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const n=nearest();
    const nearName=n?.anchor?.[0]||'none';
    const nearDist=n?.dist??Infinity;

    if(nearName!==lastNearest||Math.abs(nearDist-lastDist)>2){
      lastNearest=nearName;lastDist=nearDist;
      rings.children.forEach(o=>{
        const active=o.userData.tggInteractionNameV123===nearName;
        const close=active&&nearDist<42;
        o.material.opacity=close?(night?.58:.42):active?.22:.08;
        o.scale.setScalar(close?1.18:1);
      });
      if(entryGlow){
        entryGlow.visible=!balanced;
        entryGlow.material.opacity=nearDist<50?(night?.38:.28):wet?.24:.16;
      }
      if(guideDots){
        guideDots.visible=!balanced&&nearDist<120;
        guideDots.material.opacity=nearDist<55?.4:.22;
      }
    }

    root.dataset.tggNearestInteractionV123=nearName;
    root.dataset.tggNearestInteractionDistanceV123=Number.isFinite(nearDist)?String(Math.round(nearDist)):'none';
    root.dataset.tggInteractionReadyV123=nearDist<18?'1':'0';
    root.dataset.tggInteractionRingsV123='6';
    root.dataset.tggInteractionGuideDotsV123=guideDots?'60':'0';
    root.dataset.tggInteractionReadabilityV123='1';
  };

  window.TGGInteractionReadabilityV123={apply,anchors:anchors.map(a=>({name:a[0],type:a[4]}))};
  apply();
}
function applyInteractionReadabilityV123(){window.TGGInteractionReadabilityV123?.apply?.()||installInteractionReadabilityV123()}

function installDestinationInteractionV124(){
  if(window.TGGDestinationInteractionV124)return;
  const w=window.TGG3D,g=window.TGGGame;
  if(!w?.scene){root.dataset.tggDestinationInteractionV124='waiting';return}
  const destinations={
    downtown:{label:'DOWNTOWN BUSINESS',screen:'businessBoard',walk:18,drive:28},
    studio:{label:'RECORDING STUDIO',screen:'studio',walk:18,drive:28},
    media:{label:'MEDIA DISTRICT',screen:'media',walk:18,drive:28},
    park:{label:'TGG PARK',screen:'park',walk:20,drive:30},
    home:{label:'HOME DISTRICT',screen:'worldLifeBoard',walk:18,drive:28},
    garage:{label:'TGG GARAGE',screen:'garage',walk:18,drive:30}
  };

  let prompt=document.getElementById('tgg-destination-prompt-v124');
  if(!prompt){
    prompt=document.createElement('div');
    prompt.id='tgg-destination-prompt-v124';
    prompt.style.cssText='position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:10040;display:none;min-width:min(88vw,360px);padding:10px 12px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(5,10,18,.9);backdrop-filter:blur(10px);color:white;font:800 12px/1.4 system-ui,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.4)';
    prompt.innerHTML='<div data-v124-title style="font-size:13px;font-weight:950;letter-spacing:.06em"></div><div data-v124-meta style="opacity:.76;margin-top:2px"></div><button data-v124-enter style="margin-top:8px;width:100%;padding:9px 12px;border:0;border-radius:10px;font-weight:950">ENTER</button>';
    document.body?.appendChild(prompt);
  }

  const title=prompt?.querySelector?.('[data-v124-title]');
  const meta=prompt?.querySelector?.('[data-v124-meta]');
  const button=prompt?.querySelector?.('[data-v124-enter]');
  let current='none',distance=Infinity,ready=false,lastSig='';

  const resolve=()=>{
    const name=String(root.dataset.tggNearestInteractionV123||'none');
    const dist=Number(root.dataset.tggNearestInteractionDistanceV123||Infinity);
    const cfg=destinations[name];
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const threshold=cfg?(driving?cfg.drive:cfg.walk):0;
    return {name,dist,cfg,driving,threshold,ready:!!cfg&&Number.isFinite(dist)&&dist<=threshold};
  };

  const enter=()=>{
    const r=resolve();
    if(!r.ready||!r.cfg)return false;
    try{
      if(r.driving){
        root.dataset.tggArrivalModeV124='parked-handoff';
        root.dataset.tggDriving='0';
        state.driving=false;
      }else root.dataset.tggArrivalModeV124='walk-in';
      g?.show?.(r.cfg.screen);
      root.dataset.tggLastEnteredDestinationV124=r.name;
      root.dataset.tggDestinationEnterV124='1';
      return true;
    }catch{
      root.dataset.tggDestinationEnterV124='error';
      return false;
    }
  };

  button?.addEventListener?.('click',enter);

  const apply=()=>{
    const r=resolve();
    current=r.name;distance=r.dist;ready=r.ready;
    const near=!!r.cfg&&Number.isFinite(r.dist)&&r.dist<90;
    const sig=[r.name,Math.round(r.dist),r.driving?'1':'0',r.ready?'1':'0'].join('|');

    if(prompt&&sig!==lastSig){
      lastSig=sig;
      prompt.style.display=near?'block':'none';
      if(near&&r.cfg){
        title.textContent=r.cfg.label;
        meta.textContent=(r.driving?'DRIVE ARRIVAL':'WALK ARRIVAL')+' · '+Math.max(0,Math.round(r.dist))+'m';
        button.textContent=r.ready?(r.driving?'PARK & ENTER':'ENTER'):'APPROACH ENTRANCE';
        button.disabled=!r.ready;
        button.style.opacity=r.ready?'1':'.5';
      }
    }

    const rings=w.scene.getObjectByName?.('TGG_INTERACTION_RINGS_V123');
    rings?.children?.forEach?.(o=>{
      const active=o.userData?.tggInteractionNameV123===r.name;
      if(active){
        const pulse=.96+Math.sin(performance.now()*.004)*.07;
        o.scale.setScalar(r.ready?1.18*pulse:1);
      }
    });

    root.dataset.tggDestinationFocusV124=r.name;
    root.dataset.tggDestinationDistanceV124=Number.isFinite(r.dist)?String(Math.round(r.dist)):'none';
    root.dataset.tggDestinationApproachModeV124=r.driving?'drive':'walk';
    root.dataset.tggDestinationThresholdV124=String(r.threshold||0);
    root.dataset.tggDestinationReadyV124=r.ready?'1':'0';
    root.dataset.tggDestinationPromptV124=near?'visible':'hidden';
    root.dataset.tggDestinationInteractionAuthorityV124='1';
    root.dataset.tggDestinationInteractionV124='1';
  };

  window.TGGDestinationInteractionV124={apply,enter,resolve,get current(){return current},get ready(){return ready},get distance(){return distance}};
  apply();
}
function applyDestinationInteractionV124(){window.TGGDestinationInteractionV124?.apply?.()||installDestinationInteractionV124()}

function installDestinationRealismV125(){
  if(window.TGGDestinationRealismV125)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggDestinationRealismV125='waiting';return}
  const scene=w.scene;
  const anchors=[
    ['downtown',0,-320,0x6ec8ff],
    ['studio',-300,-110,0xff6da8],
    ['media',300,-40,0xb68cff],
    ['park',220,300,0x7edc9b],
    ['home',-270,280,0xffd37a],
    ['garage',0,390,0x9ed8ff]
  ];

  let entryGlow=scene.getObjectByName?.('TGG_DESTINATION_ENTRY_GLOW_V125');
  if(!entryGlow&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(8,3.6);
    const mat=new THREE.MeshBasicMaterial({color:0xcde7ff,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide});
    entryGlow=new THREE.InstancedMesh(geo,mat,24);entryGlow.name='TGG_DESTINATION_ENTRY_GLOW_V125';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<24;i++){
      const a=anchors[i%anchors.length],layer=Math.floor(i/anchors.length);
      p.set(a[1],2.2+layer*.45,a[2]-8-layer*2.2);
      q.identity();s.set(1-layer*.08,1,1);m.compose(p,q,s);entryGlow.setMatrixAt(i,m);
    }
    entryGlow.instanceMatrix.needsUpdate=true;scene.add(entryGlow);
  }

  let interiorDepth=scene.getObjectByName?.('TGG_DESTINATION_INTERIOR_DEPTH_V125');
  if(!interiorDepth&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(10,4.2,12);
    const mat=new THREE.MeshStandardMaterial({color:0x222831,roughness:.7,metalness:.05,transparent:true,opacity:.62});
    interiorDepth=new THREE.InstancedMesh(geo,mat,18);interiorDepth.name='TGG_DESTINATION_INTERIOR_DEPTH_V125';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<18;i++){
      const a=anchors[i%anchors.length],layer=Math.floor(i/anchors.length);
      p.set(a[1],2.1,a[2]-16-layer*14);
      q.identity();s.set(1-layer*.1,1,.9);m.compose(p,q,s);interiorDepth.setMatrixAt(i,m);
    }
    interiorDepth.instanceMatrix.needsUpdate=true;scene.add(interiorDepth);
  }

  let curbFlow=scene.getObjectByName?.('TGG_DESTINATION_CURB_FLOW_V125');
  if(!curbFlow&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.14,.03,4.8);
    const mat=new THREE.MeshBasicMaterial({color:0xf0df83,transparent:true,opacity:.5});
    curbFlow=new THREE.InstancedMesh(geo,mat,120);curbFlow.name='TGG_DESTINATION_CURB_FLOW_V125';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<120;i++){
      const a=anchors[Math.floor(i/20)%anchors.length],slot=i%20,row=Math.floor(slot/10),col=slot%10;
      p.set(a[1]+(col-4.5)*1.7,.065,a[2]+14+row*5.8);
      q.identity();m.compose(p,q,s);curbFlow.setMatrixAt(i,m);
    }
    curbFlow.instanceMatrix.needsUpdate=true;scene.add(curbFlow);
  }

  let zoneLight=scene.getObjectByName?.('TGG_DESTINATION_ZONE_LIGHT_V125');
  if(!zoneLight){
    zoneLight=new THREE.PointLight(0xbfe1ff,0,26,2);
    zoneLight.name='TGG_DESTINATION_ZONE_LIGHT_V125';scene.add(zoneLight);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const nearest=String(root.dataset.tggNearestInteractionV123||'none');
    const dist=Number(root.dataset.tggNearestInteractionDistanceV123||Infinity);
    const night=time==='night',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0',nearest,Math.round(dist)].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(entryGlow){
        entryGlow.visible=!balanced;
        entryGlow.material.opacity=night?.28:wet?.22:.14;
      }
      if(interiorDepth){
        interiorDepth.visible=!balanced||nearest!=='none';
        interiorDepth.material.opacity=night?.72:.58;
      }
      if(curbFlow){
        curbFlow.visible=driving||nearest!=='none';
        curbFlow.material.opacity=night?.68:.46;
      }
    }

    const target=anchors.find(a=>a[0]===nearest);
    if(target&&Number.isFinite(dist)&&dist<90&&!balanced){
      zoneLight.position.set(target[1],2.4,target[2]-6);
      zoneLight.intensity=dist<30?(night?1.65:.85):(night?.9:.45);
      zoneLight.color.setHex(target[3]);
      root.dataset.tggDestinationZoneLightV125=nearest;
    }else{
      zoneLight.intensity=0;
      root.dataset.tggDestinationZoneLightV125='idle';
    }

    const traffic=w.traffic||[];
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      const nearDestination=nearest!=='none'&&Number.isFinite(dist)&&dist<120;
      v.userData.tggDestinationTrafficFlowV125=nearDestination?'arrival-zone':'through-traffic';
      if(nearDestination&&i%4===0)v.userData.tggParkingIntentV125='pull-in';
      else v.userData.tggParkingIntentV125='pass';
    });

    root.dataset.tggDestinationEntryGlowV125=entryGlow?'24':'0';
    root.dataset.tggDestinationInteriorDepthV125=interiorDepth?'18':'0';
    root.dataset.tggDestinationCurbFlowV125=curbFlow?'120':'0';
    root.dataset.tggDestinationTrafficFlowV125='1';
    root.dataset.tggArrivalTransitionV125=driving?'drive-in':'walk-in';
    root.dataset.tggDestinationRealismV125='1';
  };

  window.TGGDestinationRealismV125={apply};
  apply();
}
function applyDestinationRealismV125(){window.TGGDestinationRealismV125?.apply?.()||installDestinationRealismV125()}

function installDestinationEcosystemV126(){
  if(window.TGGDestinationEcosystemV126)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggDestinationEcosystemV126='waiting';return}
  const scene=w.scene;
  const anchors=[
    ['downtown',0,-320,0x6ec8ff],
    ['studio',-300,-110,0xff6da8],
    ['media',300,-40,0xb68cff],
    ['park',220,300,0x7edc9b],
    ['home',-270,280,0xffd37a],
    ['garage',0,390,0x9ed8ff]
  ];

  let parked=scene.getObjectByName?.('TGG_PARKED_CARS_V126');
  if(!parked&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.4,1.05,1.55);
    const mat=new THREE.MeshStandardMaterial({color:0x46515e,roughness:.48,metalness:.42});
    parked=new THREE.InstancedMesh(geo,mat,48);parked.name='TGG_PARKED_CARS_V126';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<48;i++){
      const a=anchors[Math.floor(i/8)%anchors.length],slot=i%8;
      p.set(a[1]+(slot-3.5)*4.5,.56,a[2]+14+(slot%2)*4);
      q.setFromEuler(new THREE.Euler(0,slot%2?Math.PI:0,0));
      const sc=.9+(slot%3)*.05;s.set(sc,.94+(slot%2)*.04,sc);m.compose(p,q,s);parked.setMatrixAt(i,m);
    }
    parked.instanceMatrix.needsUpdate=true;scene.add(parked);
  }

  let shelters=scene.getObjectByName?.('TGG_TRANSIT_SHELTERS_V126');
  if(!shelters&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(4.8,2.4,.35);
    const mat=new THREE.MeshPhysicalMaterial({color:0x6f8fa8,roughness:.16,metalness:.12,transparent:true,opacity:.36,transmission:.1});
    shelters=new THREE.InstancedMesh(geo,mat,12);shelters.name='TGG_TRANSIT_SHELTERS_V126';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<12;i++){
      const a=anchors[i%anchors.length],layer=Math.floor(i/anchors.length);
      p.set(a[1]+(i%2?24:-24),1.2,a[2]-22-layer*7);
      q.setFromEuler(new THREE.Euler(0,i%2?Math.PI/2:-Math.PI/2,0));m.compose(p,q,s);shelters.setMatrixAt(i,m);
    }
    shelters.instanceMatrix.needsUpdate=true;scene.add(shelters);
  }

  let service=scene.getObjectByName?.('TGG_SERVICE_ZONES_V126');
  if(!service&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(7,.06,3.4);
    const mat=new THREE.MeshStandardMaterial({color:0x42474c,roughness:.88,metalness:.04});
    service=new THREE.InstancedMesh(geo,mat,30);service.name='TGG_SERVICE_ZONES_V126';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<30;i++){
      const a=anchors[Math.floor(i/5)%anchors.length],slot=i%5;
      p.set(a[1]+(slot-2)*8,.035,a[2]+28);
      q.identity();m.compose(p,q,s);service.setMatrixAt(i,m);
    }
    service.instanceMatrix.needsUpdate=true;scene.add(service);
  }

  let rooftop=scene.getObjectByName?.('TGG_ROOFTOP_EQUIPMENT_V126');
  if(!rooftop&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.3,1.25,1.8);
    const mat=new THREE.MeshStandardMaterial({color:0x59626b,roughness:.68,metalness:.5});
    rooftop=new THREE.InstancedMesh(geo,mat,72);rooftop.name='TGG_ROOFTOP_EQUIPMENT_V126';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const a=(i/72)*Math.PI*2,r=125+(i%6)*23;
      p.set(Math.cos(a)*r,14+(i%5)*5,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.6,0));
      const sc=.75+(i%4)*.1;s.set(sc,.8+(i%3)*.08,sc);m.compose(p,q,s);rooftop.setMatrixAt(i,m);
    }
    rooftop.instanceMatrix.needsUpdate=true;scene.add(rooftop);
  }

  let planters=scene.getObjectByName?.('TGG_DESTINATION_PLANTERS_V126');
  if(!planters&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.72,.88,.8,8);
    const mat=new THREE.MeshStandardMaterial({color:0x4b5248,roughness:.92,metalness:.02});
    planters=new THREE.InstancedMesh(geo,mat,60);planters.name='TGG_DESTINATION_PLANTERS_V126';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<60;i++){
      const a=anchors[Math.floor(i/10)%anchors.length],slot=i%10,row=slot%2,idx=Math.floor(slot/2);
      p.set(a[1]+(idx-2)*5.5,.4,a[2]-18-row*6.2);
      q.identity();const sc=.85+(i%3)*.06;s.set(sc,sc,sc);m.compose(p,q,s);planters.setMatrixAt(i,m);
    }
    planters.instanceMatrix.needsUpdate=true;scene.add(planters);
  }

  let approach=scene.getObjectByName?.('TGG_DESTINATION_WAYFINDING_V126');
  if(!approach&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.45,.06,5.8);
    const mat=new THREE.MeshBasicMaterial({color:0xb8dbff,transparent:true,opacity:.34,depthWrite:false});
    approach=new THREE.InstancedMesh(geo,mat,72);approach.name='TGG_DESTINATION_WAYFINDING_V126';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<72;i++){
      const a=anchors[Math.floor(i/12)%anchors.length],seg=i%12;
      p.set(a[1]+(seg-5.5)*1.8,.07,a[2]-30);
      q.identity();m.compose(p,q,s);approach.setMatrixAt(i,m);
    }
    approach.instanceMatrix.needsUpdate=true;scene.add(approach);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(parked){
        parked.visible=!balanced||district==='downtown'||district==='garage';
        parked.material.roughness=wet?.28:.48;
        parked.material.metalness=wet?.5:.42;
      }
      if(shelters){
        shelters.visible=district!=='park'&&!balanced;
        shelters.material.opacity=night?.46:wet?.42:.32;
      }
      if(service)service.visible=district!=='park'&&(driving||district==='garage'||district==='studio');
      if(rooftop)rooftop.visible=!balanced||district==='downtown'||district==='media';
      if(planters)planters.visible=district!=='garage';
      if(approach){
        approach.visible=(driving||night||wet)&&!balanced;
        approach.material.opacity=night?.52:wet?.42:.3;
      }
    }

    const focus=driving?w.car?.position:w.camera?.position;
    if(focus){
      [parked,shelters,service,rooftop,planters,approach].forEach(g=>{
        if(!g)return;
        g.userData.tggDestinationDistanceV126=Math.round(Math.hypot((g.position?.x||0)-focus.x,(g.position?.z||0)-focus.z));
      });
    }

    root.dataset.tggParkedCarsV126=parked?'48':'0';
    root.dataset.tggTransitSheltersV126=shelters?'12':'0';
    root.dataset.tggServiceZonesV126=service?'30':'0';
    root.dataset.tggRooftopEquipmentV126=rooftop?'72':'0';
    root.dataset.tggDestinationPlantersV126=planters?'60':'0';
    root.dataset.tggDestinationWayfindingV126=approach?'72':'0';
    root.dataset.tggDestinationEcosystemV126='1';
  };

  window.TGGDestinationEcosystemV126={apply};
  apply();
}
function applyDestinationEcosystemV126(){window.TGGDestinationEcosystemV126?.apply?.()||installDestinationEcosystemV126()}

function installWholeGameMegaBatchV127(){
  if(window.TGGWholeGameMegaV127)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWholeGameMegaV127='waiting';return}
  const scene=w.scene;
  const anchors=[
    ['downtown',0,-320],['studio',-300,-110],['media',300,-40],
    ['park',220,300],['home',-270,280],['garage',0,390]
  ];

  let interiors=scene.getObjectByName?.('TGG_MEGA_INTERIORS_V127');
  if(!interiors&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(8.5,3.6,9);
    const mat=new THREE.MeshStandardMaterial({color:0x242a31,roughness:.58,metalness:.08,transparent:true,opacity:.68});
    interiors=new THREE.InstancedMesh(geo,mat,36);interiors.name='TGG_MEGA_INTERIORS_V127';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<36;i++){
      const a=anchors[Math.floor(i/6)%anchors.length],slot=i%6;
      p.set(a[1]+(slot-2.5)*10,1.8,a[2]-20-(slot%2)*11);
      q.identity();s.set(.8+(slot%3)*.08,1,.85+(slot%2)*.08);m.compose(p,q,s);interiors.setMatrixAt(i,m);
    }
    interiors.instanceMatrix.needsUpdate=true;scene.add(interiors);
  }

  let people=scene.getObjectByName?.('TGG_POPULATION_V127');
  if(!people&&THREE.InstancedMesh){
    const geo=THREE.CapsuleGeometry?new THREE.CapsuleGeometry(.2,.8,3,6):new THREE.CylinderGeometry(.18,.22,1.15,6);
    const mat=new THREE.MeshStandardMaterial({color:0x707782,roughness:.76});
    people=new THREE.InstancedMesh(geo,mat,120);people.name='TGG_POPULATION_V127';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<120;i++){
      const a=anchors[Math.floor(i/20)%anchors.length],slot=i%20;
      const ang=(slot/20)*Math.PI*2,r=9+(slot%5)*4.2;
      p.set(a[1]+Math.cos(ang)*r,.62,a[2]+Math.sin(ang)*r);
      q.setFromEuler(new THREE.Euler(0,ang,0));m.compose(p,q,s);people.setMatrixAt(i,m);
    }
    people.instanceMatrix.needsUpdate=true;scene.add(people);
  }

  let foliage=scene.getObjectByName?.('TGG_REACTIVE_FOLIAGE_V127');
  if(!foliage&&THREE.InstancedMesh){
    const geo=new THREE.IcosahedronGeometry(.9,0);
    const mat=new THREE.MeshStandardMaterial({color:0x355a3c,roughness:.97});
    foliage=new THREE.InstancedMesh(geo,mat,160);foliage.name='TGG_REACTIVE_FOLIAGE_V127';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<160;i++){
      const a=(i/160)*Math.PI*8,r=190+(i%14)*31;
      p.set(Math.cos(a)*r,.72,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a,0));
      const sc=.5+(i%7)*.09;s.set(sc,sc*.72,sc);m.compose(p,q,s);foliage.setMatrixAt(i,m);
    }
    foliage.instanceMatrix.needsUpdate=true;scene.add(foliage);
  }

  let contact=scene.getObjectByName?.('TGG_MEGA_CONTACT_V127');
  if(!contact){
    contact=new THREE.PointLight(0xdbeeff,0,14,2);
    contact.name='TGG_MEGA_CONTACT_V127';scene.add(contact);
  }

  let avatar=null,lastAvatarScan=0,lastSig='';
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
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const density=district==='downtown'?1:district==='media'?.88:district==='studio'?.82:district==='home'?.65:district==='park'?.52:.72;
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(interiors){
        interiors.visible=!balanced||root.dataset.tggNearestInteractionV123!=='none';
        interiors.material.opacity=night?.76:wet?.7:.62;
      }
      if(people){
        people.visible=!driving&&district!=='garage';
        people.count=Math.max(18,Math.floor(120*density*(balanced?.55:1)));
      }
      if(foliage){
        foliage.visible=(district==='park'||district==='home'||driving)&&!balanced;
        foliage.material.color.setHex(wet?0x2f5940:district==='park'?0x386a44:0x405b42);
        foliage.material.roughness=wet?.72:.97;
      }
    }

    const traffic=w.traffic||[];
    const trafficCap=Math.max(1,Math.floor(traffic.length*density*(balanced?.7:1)));
    traffic.forEach((v,i)=>{
      if(!v)return;
      v.visible=i<trafficCap;
      if(v.userData){
        v.userData.tggMegaDensityV127=density;
        v.userData.tggMegaTrafficClassV127=['compact','sedan','muscle','luxury','utility'][i%5];
      }
    });

    const focus=driving?w.car:findAvatar();
    if(focus?.position&&!balanced){
      contact.position.set(focus.position.x,focus.position.y+1.4,focus.position.z);
      contact.intensity=night?1.1:wet?.68:.38;
      contact.color.setHex(night?0xa8caff:wet?0xc6e0f3:0xffddb8);
      root.dataset.tggMegaGroundingV127=driving?'vehicle':'avatar';
    }else{
      contact.intensity=0;
      root.dataset.tggMegaGroundingV127=focus?'balanced':'waiting';
    }

    root.dataset.tggMegaInteriorDepthV127=interiors?'36':'0';
    root.dataset.tggMegaPopulationV127=people?String(people.count):'0';
    root.dataset.tggMegaFoliageV127=foliage?'160':'0';
    root.dataset.tggMegaTrafficVisibleV127=String(trafficCap);
    root.dataset.tggMegaDensityControllerV127='district+quality+mode';
    root.dataset.tggWholeGameMegaV127='1';
  };

  window.TGGWholeGameMegaV127={apply};
  apply();
}
function applyWholeGameMegaBatchV127(){window.TGGWholeGameMegaV127?.apply?.()||installWholeGameMegaBatchV127()}

function installWorldPolishConvergenceV128(){
  if(window.TGGWorldPolishV128)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldPolishConvergenceV128='waiting';return}
  const scene=w.scene;

  let grime=scene.getObjectByName?.('TGG_ROAD_EDGE_GRIME_V128');
  if(!grime&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.3,5.8);
    const mat=new THREE.MeshBasicMaterial({color:0x17191d,transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide});
    grime=new THREE.InstancedMesh(geo,mat,180);grime.name='TGG_ROAD_EDGE_GRIME_V128';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<180;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-22;
      p.set(axis?step*12:side*8.9,.035,axis?side*8.9:step*12);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,axis?Math.PI/2:0,0));
      const sc=.7+(i%5)*.08;s.set(sc,1,1);m.compose(p,q,s);grime.setMatrixAt(i,m);
    }
    grime.instanceMatrix.needsUpdate=true;scene.add(grime);
  }

  let rooftop=scene.getObjectByName?.('TGG_ROOFLINE_SILHOUETTES_V128');
  if(!rooftop&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.08,.11,6.5,5);
    const mat=new THREE.MeshStandardMaterial({color:0x39424d,roughness:.7,metalness:.48});
    rooftop=new THREE.InstancedMesh(geo,mat,84);rooftop.name='TGG_ROOFLINE_SILHOUETTES_V128';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const a=(i/84)*Math.PI*2,r=150+(i%7)*34,h=18+(i%5)*6;
      p.set(Math.cos(a)*r,h,Math.sin(a)*r);
      q.identity();const sc=.8+(i%4)*.1;s.set(sc,1,sc);m.compose(p,q,s);rooftop.setMatrixAt(i,m);
    }
    rooftop.instanceMatrix.needsUpdate=true;scene.add(rooftop);
  }

  let destinationGlow=scene.getObjectByName?.('TGG_DESTINATION_GROUND_GLOW_V128');
  if(!destinationGlow&&THREE.InstancedMesh){
    const geo=new THREE.RingGeometry(5.6,7.8,32);
    const mat=new THREE.MeshBasicMaterial({color:0x8fd6ff,transparent:true,opacity:.09,depthWrite:false,side:THREE.DoubleSide});
    destinationGlow=new THREE.InstancedMesh(geo,mat,6);destinationGlow.name='TGG_DESTINATION_GROUND_GLOW_V128';
    const pts=[[0,-320],[-300,-110],[300,-40],[220,300],[-270,280],[0,390]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    pts.forEach((pt,i)=>{p.set(pt[0],.04,pt[1]);q.setFromEuler(new THREE.Euler(-Math.PI/2,0,0));m.compose(p,q,s);destinationGlow.setMatrixAt(i,m)});
    destinationGlow.instanceMatrix.needsUpdate=true;scene.add(destinationGlow);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const nearest=String(root.dataset.tggNearestInteractionV123||'none');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=time==='night',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality,nearest,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(grime){
        grime.visible=!balanced||driving;
        grime.material.opacity=wet?.2:night?.15:.1;
      }
      if(rooftop){
        rooftop.visible=!balanced||district==='downtown'||district==='media';
        rooftop.material.color.setHex(night?0x252e39:0x39424d);
      }
      if(destinationGlow){
        destinationGlow.visible=!balanced||nearest!=='none';
        destinationGlow.material.opacity=nearest!=='none'?.2:night?.12:.07;
      }
    }

    const contact=scene.getObjectByName?.('TGG_MEGA_CONTACT_V127');
    if(contact&&contact.intensity>0){
      contact.intensity=Math.min(contact.intensity,balanced?.55:1.15);
    }

    root.dataset.tggRoadEdgeGrimeV128=grime?'180':'0';
    root.dataset.tggRooflineSilhouettesV128=rooftop?'84':'0';
    root.dataset.tggDestinationGroundGlowV128=destinationGlow?'6':'0';
    root.dataset.tggWorldPolishModeV128=balanced?'balanced':'high';
    root.dataset.tggWorldPolishConvergenceV128='1';
  };

  window.TGGWorldPolishV128={apply};
  apply();
}
function applyWorldPolishConvergenceV128(){window.TGGWorldPolishV128?.apply?.()||installWorldPolishConvergenceV128()}

function installWholeWorldBudgetV129(){
  if(window.TGGWholeWorldBudgetV129)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWholeWorldBudgetV129='waiting';return}

  const groups={
    far:[
      'TGG_DISTANT_TERRAIN_V84','TGG_SKYLINE_SILHOUETTES_V82','TGG_ROOFLINE_SILHOUETTES_V128',
      'TGG_COUNTRYSIDE_BELT_V76','TGG_CITY_COUNTRY_BLEND_V89','TGG_CLOUD_DEPTH_V84'
    ],
    mid:[
      'TGG_NEIGHBORHOOD_DEPTH_V76','TGG_FACADE_VARIATION_V78','TGG_WINDOW_REFLECTIONS_V83',
      'TGG_REACTIVE_FOLIAGE_V127','TGG_FOLIAGE_VARIETY_V83','TGG_STREET_RHYTHM_V82'
    ],
    near:[
      'TGG_STOREFRONT_FRONTAGE_V77','TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_SIDEWALK_VARIATION_V83',
      'TGG_ROAD_MARKINGS_V82','TGG_ROAD_EDGE_GRIME_V128','TGG_DESTINATION_GROUND_GLOW_V128'
    ],
    life:[
      'TGG_POPULATION_V127','TGG_PEDESTRIAN_POCKETS_V77','TGG_AMBIENT_LIFE_V76',
      'TGG_PARKED_CARS_V126','TGG_TRANSIT_SHELTERS_V126'
    ]
  };

  const cache=new Map();
  const get=(name)=>{
    const old=cache.get(name);
    if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };
  const setVisible=(names,fn)=>names.forEach((name,i)=>{
    const g=get(name);if(!g)return;
    const visible=!!fn(g,i);
    if(g.visible!==visible)g.visible=visible;
  });

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const nearest=String(root.dataset.tggNearestInteractionV123||'none');
    const fps=Number(root.dataset.tggGraphicsFpsV55||60);
    const balanced=quality==='balanced'||fps<42;
    const interaction=nearest!=='none';
    const sig=[district,quality,driving?'1':'0',interaction?'1':'0',fps<42?'lowfps':'ok'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      setVisible(groups.far,(g,i)=>{
        if(!balanced)return true;
        if(driving)return i%2===0;
        return district==='downtown'?i%2===0:(district==='park'||district==='home')?i%3!==1:i%3===0;
      });
      setVisible(groups.mid,(g,i)=>{
        if(!balanced)return true;
        if(interaction)return i%2===0;
        return driving?i%3!==2:i%3===0;
      });
      setVisible(groups.near,(g,i)=>{
        if(!balanced)return true;
        if(interaction)return true;
        return driving?i%2===0:i%3!==1;
      });
      setVisible(groups.life,(g,i)=>{
        if(!balanced)return !driving||i>=3;
        if(driving)return i>=3&&i%2===1;
        return district==='downtown'||district==='studio'?i%2===0:i%3===0;
      });
    }

    const population=get('TGG_POPULATION_V127');
    if(population?.count!==undefined){
      const active=balanced?(driving?24:district==='downtown'?60:36):120;
      population.count=Math.min(120,active);
      root.dataset.tggPopulationBudgetV129=String(active);
    }

    const foliage=get('TGG_REACTIVE_FOLIAGE_V127');
    if(foliage?.count!==undefined){
      const active=balanced?(driving?64:80):160;
      foliage.count=Math.min(160,active);
      root.dataset.tggFoliageBudgetV129=String(active);
    }

    const windows=get('TGG_WINDOW_REFLECTIONS_V83');
    if(windows?.count!==undefined){
      const active=balanced?(driving?72:84):144;
      windows.count=Math.min(144,active);
      root.dataset.tggWindowBudgetV129=String(active);
    }

    root.dataset.tggWholeWorldBudgetV129='1';
    root.dataset.tggWholeWorldBudgetModeV129=balanced?'adaptive-balanced':'full';
    root.dataset.tggWholeWorldBudgetDriverV129=driving?'driving':'walking';
    root.dataset.tggWholeWorldBudgetInteractionV129=interaction?'near-destination':'free-roam';
    root.dataset.tggWholeWorldBudgetFpsV129=String(fps);
  };

  window.TGGWholeWorldBudgetV129={apply,groups,cache};
  apply();
}
function applyWholeWorldBudgetV129(){window.TGGWholeWorldBudgetV129?.apply?.()||installWholeWorldBudgetV129()}

function installRenderConvergenceV130(){
  if(window.TGGRenderConvergenceV130)return;
  const w=window.TGG3D,scene=w?.scene,renderer=w?.renderer,camera=w?.camera;
  if(!scene||!renderer||!camera){root.dataset.tggRenderConvergenceV130='waiting';return}

  const profiles={
    downtown:{exp:1.08,fog:0x8191a3,density:.00170},
    studio:{exp:1.11,fog:0x89788f,density:.00186},
    media:{exp:1.10,fog:0x788ca7,density:.00178},
    park:{exp:1.03,fog:0x8da291,density:.00144},
    home:{exp:1.05,fog:0x958f83,density:.00154},
    garage:{exp:1.07,fog:0x7e8791,density:.00174}
  };

  let lastSig='';
  const apply=()=>{
    const snapshot=window.__TGG_WORLD_STATE_V109__||{
      district:String(root.dataset.tggDistrict||'downtown'),
      time:String(root.dataset.tggTime||'day'),
      weather:String(root.dataset.tggWeather||'clear'),
      quality:String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high'),
      driving:root.dataset.tggDriving==='1'||state.driving===true,
      race:root.dataset.tggRaceMode==='on'
    };
    const district=String(snapshot.district||'downtown');
    const time=String(snapshot.time||'day');
    const weather=String(snapshot.weather||'clear');
    const driving=!!snapshot.driving;
    const race=!!snapshot.race;
    const fps=Number(root.dataset.tggGraphicsFpsV55||60);
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||'full');
    const balanced=budget==='adaptive-balanced'||snapshot.quality==='balanced'||fps<42;
    const p=profiles[district]||profiles.downtown;
    const night=time==='night',gold=time==='golden',storm=/storm/.test(weather),rain=/rain/.test(weather);
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const sig=[district,time,weather,driving?'1':'0',race?'1':'0',balanced?'1':'0',fps<42?'low':'ok'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      let exposure=p.exp+(gold?.055:0)+(night?.018:0)-(storm?.075:rain?.028:0)-(balanced?.018:0);
      exposure=Math.max(.93,Math.min(1.17,exposure));
      renderer.toneMappingExposure=exposure;

      if(scene.fog){
        scene.fog.color?.setHex?.(night?0x566579:p.fog);
        scene.fog.density=p.density+(night?.00009:0)+(rain?.00020:0)+(storm?.00017:0)-(driving?.00007:0);
      }

      if(renderer.shadowMap){
        renderer.shadowMap.enabled=!balanced;
        if('autoUpdate' in renderer.shadowMap)renderer.shadowMap.autoUpdate=!balanced||race;
      }

      if(renderer.setPixelRatio){
        const cap=balanced?1.12:1.58;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,cap));
        root.dataset.tggRenderPixelRatioCapV130=String(cap);
      }

      root.dataset.tggRenderExposureV130=exposure.toFixed(3);
      root.dataset.tggRenderFogDensityV130=scene.fog?Number(scene.fog.density||0).toFixed(5):'none';
      root.dataset.tggRenderShadowModeV130=balanced?'reduced':'full';
    }

    const baseFov=driving?74:62;
    const speedBoost=driving?Math.min(11,speed*.2):0;
    const raceBoost=race?2:0;
    const targetFov=baseFov+speedBoost+raceBoost;
    if(Math.abs(Number(camera.fov||0)-targetFov)>.05){
      camera.fov+=(targetFov-camera.fov)*.14;
      camera.updateProjectionMatrix?.();
    }
    camera.near=driving?.08:.06;
    camera.far=balanced?4800:5400;

    root.dataset.tggFinalRenderOwnerV130='render-convergence-v130';
    root.dataset.tggFinalExposureOwnerV130='render-convergence-v130';
    root.dataset.tggFinalFogOwnerV130='render-convergence-v130';
    root.dataset.tggFinalCameraOwnerV130='render-convergence-v130';
    root.dataset.tggFinalBudgetOwnerV130='whole-world-budget-v129';
    root.dataset.tggRenderCameraFarV130=String(camera.far);
    root.dataset.tggRenderConvergenceV130='1';
  };

  window.TGGRenderConvergenceV130={apply,profiles};
  apply();
}
function applyRenderConvergenceV130(){window.TGGRenderConvergenceV130?.apply?.()||installRenderConvergenceV130()}

function installNearFieldMaterialV131(){
  if(window.TGGNearFieldMaterialV131)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggNearFieldMaterialV131='waiting';return}

  let roadWear=scene.getObjectByName?.('TGG_ROAD_SURFACE_VARIATION_V131');
  if(!roadWear&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.6,5.2);
    const mat=new THREE.MeshBasicMaterial({color:0x20242a,transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide});
    roadWear=new THREE.InstancedMesh(geo,mat,220);roadWear.name='TGG_ROAD_SURFACE_VARIATION_V131';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<220;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-27;
      p.set(axis?step*10.5:side*3.4,.041,axis?side*3.4:step*10.5);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,axis?Math.PI/2:0,0));
      const sx=.65+(i%6)*.08,sy=.7+(i%5)*.09;s.set(sx,sy,1);
      m.compose(p,q,s);roadWear.setMatrixAt(i,m);
    }
    roadWear.instanceMatrix.needsUpdate=true;scene.add(roadWear);
  }

  let curbWear=scene.getObjectByName?.('TGG_CURB_WEAR_V131');
  if(!curbWear&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.8,.07,.16);
    const mat=new THREE.MeshStandardMaterial({color:0x555a60,roughness:.98,metalness:0});
    curbWear=new THREE.InstancedMesh(geo,mat,156);curbWear.name='TGG_CURB_WEAR_V131';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<156;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-19.5;
      p.set(axis?step*7.2:side*9.9,.225,axis?side*9.9:step*7.2);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);curbWear.setMatrixAt(i,m);
    }
    curbWear.instanceMatrix.needsUpdate=true;scene.add(curbWear);
  }

  let glassTint=scene.getObjectByName?.('TGG_STOREFRONT_TINT_V131');
  if(!glassTint&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(4.5,2.9);
    const mat=new THREE.MeshBasicMaterial({color:0x6f8ea6,transparent:true,opacity:.07,depthWrite:false,side:THREE.DoubleSide});
    glassTint=new THREE.InstancedMesh(geo,mat,72);glassTint.name='TGG_STOREFRONT_TINT_V131';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0,r=0;
      const d=81.6+(i%3)*8;
      if(side===0){x=-d;z=step*16;r=Math.PI/2}
      if(side===1){x=d;z=step*16;r=-Math.PI/2}
      if(side===2){x=step*16;z=-d;r=0}
      if(side===3){x=step*16;z=d;r=Math.PI}
      p.set(x,2.22,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.86+(i%4)*.06;s.set(sc,.96,1);m.compose(p,q,s);glassTint.setMatrixAt(i,m);
    }
    glassTint.instanceMatrix.needsUpdate=true;scene.add(glassTint);
  }

  let terrainMicro=scene.getObjectByName?.('TGG_TERRAIN_MICRODETAIL_V131');
  if(!terrainMicro&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(1.7,10);
    const mat=new THREE.MeshBasicMaterial({color:0x344438,transparent:true,opacity:.16,depthWrite:false});
    terrainMicro=new THREE.InstancedMesh(geo,mat,180);terrainMicro.name='TGG_TERRAIN_MICRODETAIL_V131';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<180;i++){
      const a=(i/180)*Math.PI*9,r=180+(i%15)*31;
      p.set(Math.cos(a)*r,.031,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.45+(i%8)*.1;s.set(sc,sc*.72,1);m.compose(p,q,s);terrainMicro.setMatrixAt(i,m);
    }
    terrainMicro.instanceMatrix.needsUpdate=true;scene.add(terrainMicro);
  }

  let contact=scene.getObjectByName?.('TGG_CONTACT_LIGHT_V131');
  if(!contact){
    contact=new THREE.PointLight(0xffddb7,0,10,2);
    contact.name='TGG_CONTACT_LIGHT_V131';scene.add(contact);
  }

  let avatar=null,lastAvatarScan=0,lastSig='';
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
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const driving=!!snap.driving||root.dataset.tggDriving==='1'||state.driving===true;
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||'full');
    const balanced=budget==='adaptive-balanced'||snap.quality==='balanced';
    const night=time==='night',wet=/rain|storm/.test(weather);
    const nearest=String(root.dataset.tggNearestInteractionV123||'none');
    const nearDestination=nearest!=='none';
    const sig=[district,time,weather,driving?'1':'0',balanced?'1':'0',nearDestination?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(roadWear){
        roadWear.visible=!balanced||driving;
        roadWear.material.opacity=wet?.16:night?.12:.09;
      }
      if(curbWear){
        curbWear.visible=!balanced||nearDestination||!driving;
        curbWear.material.color.setHex(wet?0x4b5158:district==='home'?0x66615b:0x555a60);
      }
      if(glassTint){
        glassTint.visible=district!=='park'&&(!balanced||nearDestination);
        glassTint.material.opacity=night?.11:wet?.1:.065;
        glassTint.material.color.setHex(district==='studio'?0x8b6f89:district==='media'?0x6d88a5:0x6f8ea6);
      }
      if(terrainMicro){
        terrainMicro.visible=(district==='park'||district==='home'||driving)&&(!balanced||nearDestination);
        terrainMicro.material.color.setHex(district==='park'?0x2f5138:0x465044);
        terrainMicro.material.opacity=wet?.1:.16;
      }
    }

    const focus=driving?w.car:findAvatar();
    if(focus?.position&&!balanced){
      contact.position.set(focus.position.x,focus.position.y+1.05,focus.position.z);
      contact.intensity=night?.9:wet?.55:.28;
      contact.color.setHex(night?0xa9cfff:wet?0xc7e0f4:district==='studio'?0xffc4dd:0xffddb7);
      root.dataset.tggNearFieldContactOwnerV131=driving?'vehicle':'avatar';
    }else{
      contact.intensity=0;
      root.dataset.tggNearFieldContactOwnerV131=focus?'balanced-disabled':'waiting';
    }

    root.dataset.tggRoadSurfaceVariationV131=roadWear?'220':'0';
    root.dataset.tggCurbWearV131=curbWear?'156':'0';
    root.dataset.tggStorefrontTintV131=glassTint?'72':'0';
    root.dataset.tggTerrainMicrodetailV131=terrainMicro?'180':'0';
    root.dataset.tggNearFieldBudgetAwareV131='1';
    root.dataset.tggNearFieldMaterialV131='1';
  };

  window.TGGNearFieldMaterialV131={apply};
  apply();
}
function applyNearFieldMaterialV131(){window.TGGNearFieldMaterialV131?.apply?.()||installNearFieldMaterialV131()}

function installDestinationThresholdsV132(){
  if(window.TGGDestinationThresholdsV132)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggDestinationThresholdsV132='waiting';return}

  const anchors={
    studio:[-34,-34],
    garage:[34,-34],
    media:[0,38],
    home:[-300,300],
    park:[245,320]
  };

  let thresholds=scene.getObjectByName?.('TGG_DESTINATION_THRESHOLDS_V132');
  if(!thresholds){
    thresholds=new THREE.Group();thresholds.name='TGG_DESTINATION_THRESHOLDS_V132';
    const frameMat=new THREE.MeshStandardMaterial({color:0x242b34,roughness:.58,metalness:.24});
    const glassMat=new THREE.MeshPhysicalMaterial({color:0x7796ac,roughness:.07,metalness:.08,transparent:true,opacity:.2,transmission:.14});
    Object.entries(anchors).forEach(([name,[x,z]],i)=>{
      const frame=new THREE.Mesh(new THREE.BoxGeometry(8.4,4.2,.45),frameMat);
      frame.position.set(x,2.1,z-4.6);frame.userData.tggDestinationV132=name;thresholds.add(frame);
      const glass=new THREE.Mesh(new THREE.BoxGeometry(7.4,3.25,.12),glassMat.clone());
      glass.position.set(x,2.05,z-4.88);glass.userData.tggDestinationV132=name;thresholds.add(glass);
      const canopy=new THREE.Mesh(new THREE.BoxGeometry(6.8,.22,2.6),frameMat);
      canopy.position.set(x,4.35,z-3.8);canopy.userData.tggDestinationV132=name;thresholds.add(canopy);
    });
    scene.add(thresholds);
  }

  let parking=scene.getObjectByName?.('TGG_DESTINATION_PARKING_V132');
  if(!parking&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.14,.025,4.8);
    const mat=new THREE.MeshBasicMaterial({color:0xded9c8,transparent:true,opacity:.58});
    parking=new THREE.InstancedMesh(geo,mat,80);parking.name='TGG_DESTINATION_PARKING_V132';
    const centers=[[-34,-20],[34,-20],[0,52],[-300,286],[245,306]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<80;i++){
      const c0=centers[i%centers.length],slot=Math.floor(i/centers.length)-8;
      p.set(c0[0]+slot*2.35,.045,c0[1]);
      q.identity();m.compose(p,q,s);parking.setMatrixAt(i,m);
    }
    parking.instanceMatrix.needsUpdate=true;scene.add(parking);
  }

  let approach=scene.getObjectByName?.('TGG_DESTINATION_APPROACH_V132');
  if(!approach&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.2,.035,3.2);
    const mat=new THREE.MeshBasicMaterial({color:0x8fc9ff,transparent:true,opacity:.2,depthWrite:false});
    approach=new THREE.InstancedMesh(geo,mat,60);approach.name='TGG_DESTINATION_APPROACH_V132';
    const centers=[[-34,-28],[34,-28],[0,44],[-300,294],[245,314]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<60;i++){
      const c0=centers[i%centers.length],step=Math.floor(i/centers.length)-6;
      p.set(c0[0]+step*1.55,.05,c0[1]);
      q.identity();m.compose(p,q,s);approach.setMatrixAt(i,m);
    }
    approach.instanceMatrix.needsUpdate=true;scene.add(approach);
  }

  let entranceLights=scene.getObjectByName?.('TGG_DESTINATION_LIGHTS_V132');
  if(!entranceLights){
    entranceLights=new THREE.Group();entranceLights.name='TGG_DESTINATION_LIGHTS_V132';
    Object.entries(anchors).forEach(([name,[x,z]],i)=>{
      const color=[0xff5f69,0x69d8ff,0xbc7dff,0xffd39c,0x8fffae][i%5];
      const light=new THREE.PointLight(color,0,16,2);
      light.position.set(x,3.1,z-4.2);light.userData.tggDestinationV132=name;entranceLights.add(light);
    });
    scene.add(entranceLights);
  }

  let loading=scene.getObjectByName?.('TGG_LOADING_ZONE_V132');
  if(!loading&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(5.2,.03,1.7);
    const mat=new THREE.MeshBasicMaterial({color:0xf0b54c,transparent:true,opacity:.2});
    loading=new THREE.InstancedMesh(geo,mat,20);loading.name='TGG_LOADING_ZONE_V132';
    const pts=[[-48,-30],[48,-30],[-14,48],[14,48],[-286,296]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<20;i++){
      const a=pts[i%pts.length],row=Math.floor(i/pts.length)-1.5;
      p.set(a[0]+row*5.8,.048,a[1]);q.identity();m.compose(p,q,s);loading.setMatrixAt(i,m);
    }
    loading.instanceMatrix.needsUpdate=true;scene.add(loading);
  }

  let lastSig='';
  const apply=()=>{
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const driving=!!snap.driving||root.dataset.tggDriving==='1'||state.driving===true;
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||'full');
    const balanced=budget==='adaptive-balanced'||snap.quality==='balanced';
    const nearest=String(root.dataset.tggNearestInteractionV123||'none');
    const active=nearest!=='none'?nearest:district;
    const night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,driving?'1':'0',balanced?'1':'0',active].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      thresholds?.children?.forEach(o=>{
        const isActive=String(o.userData?.tggDestinationV132||'')===active;
        if(o.material?.transparent)o.material.opacity=isActive?.34:(night?.22:.16);
      });
      if(parking){
        parking.visible=!balanced||driving;
        parking.material.opacity=wet?.42:.58;
      }
      if(approach){
        approach.visible=!balanced&&(night||wet||nearest!=='none');
        approach.material.opacity=nearest!=='none'?.34:night?.22:.16;
      }
      if(loading)loading.visible=(district==='studio'||district==='garage'||district==='media')&&!balanced;
      entranceLights?.children?.forEach(light=>{
        const isActive=String(light.userData?.tggDestinationV132||'')===active;
        light.intensity=balanced?0:(isActive?(night?1.15:.55):(night?.34:.12));
      });
    }

    root.dataset.tggDestinationThresholdCountV132='5';
    root.dataset.tggDestinationParkingV132=parking?'80':'0';
    root.dataset.tggDestinationApproachV132=approach?'60':'0';
    root.dataset.tggLoadingZonesV132=loading?'20':'0';
    root.dataset.tggDestinationActiveV132=active;
    root.dataset.tggDestinationThresholdsV132='1';
  };

  window.TGGDestinationThresholdsV132={apply};
  apply();
}
function applyDestinationThresholdsV132(){window.TGGDestinationThresholdsV132?.apply?.()||installDestinationThresholdsV132()}

function installInteractionFidelityV133(){
  if(window.TGGInteractionFidelityV133)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggInteractionFidelityV133='waiting';return}

  const anchors={
    studio:[-34,-34,0xff6672],
    garage:[34,-34,0x72dfff],
    media:[0,38,0xc68bff],
    home:[-300,300,0xffd4a0],
    park:[245,320,0x96ffb0]
  };

  let pads=scene.getObjectByName?.('TGG_INTERACTION_PADS_V133');
  if(!pads){
    pads=new THREE.Group();pads.name='TGG_INTERACTION_PADS_V133';
    Object.entries(anchors).forEach(([name,[x,z,color]])=>{
      const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.08,depthWrite:false});
      const disc=new THREE.Mesh(new THREE.CircleGeometry(5.2,28),mat);
      disc.name='TGG_INTERACTION_PAD_'+name.toUpperCase()+'_V133';
      disc.userData.tggDestinationV133=name;
      disc.rotation.x=-Math.PI/2;disc.position.set(x,.052,z-3.9);pads.add(disc);
    });
    scene.add(pads);
  }

  let bollards=scene.getObjectByName?.('TGG_ENTRY_BOLLARDS_V133');
  if(!bollards&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.09,.11,.95,7);
    const mat=new THREE.MeshStandardMaterial({color:0x4f5862,roughness:.62,metalness:.46});
    bollards=new THREE.InstancedMesh(geo,mat,40);bollards.name='TGG_ENTRY_BOLLARDS_V133';
    const centers=[[-34,-29.5],[34,-29.5],[0,42.5],[-300,304.5],[245,324.5]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<40;i++){
      const a=centers[i%centers.length],row=Math.floor(i/centers.length)-3.5;
      p.set(a[0]+row*1.65,.48,a[1]);q.identity();m.compose(p,q,s);bollards.setMatrixAt(i,m);
    }
    bollards.instanceMatrix.needsUpdate=true;scene.add(bollards);
  }

  let entryLights=scene.getObjectByName?.('TGG_INTERACTION_LIGHTS_V133');
  if(!entryLights){
    entryLights=new THREE.Group();entryLights.name='TGG_INTERACTION_LIGHTS_V133';
    Object.entries(anchors).forEach(([name,[x,z,color]])=>{
      const light=new THREE.PointLight(color,0,13,2);
      light.position.set(x,2.25,z-3.4);light.userData.tggDestinationV133=name;entryLights.add(light);
    });
    scene.add(entryLights);
  }

  let focusGlow=scene.getObjectByName?.('TGG_NEAR_FIELD_FOCUS_V133');
  if(!focusGlow){
    const mat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.0,depthWrite:false});
    focusGlow=new THREE.Mesh(new THREE.RingGeometry(4.6,6.4,36),mat);
    focusGlow.name='TGG_NEAR_FIELD_FOCUS_V133';focusGlow.rotation.x=-Math.PI/2;focusGlow.visible=false;scene.add(focusGlow);
  }

  let lastSig='';
  const apply=()=>{
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const driving=!!snap.driving||root.dataset.tggDriving==='1'||state.driving===true;
    const fps=Number(root.dataset.tggGraphicsFpsV55||60);
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||'full');
    const balanced=budget==='adaptive-balanced'||snap.quality==='balanced'||fps<42;
    const nearest=String(root.dataset.tggNearestInteractionV123||'none');
    const active=anchors[nearest]?nearest:(anchors[district]?district:'none');
    const interaction=nearest!=='none'&&!!anchors[nearest];
    const night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,driving?'1':'0',balanced?'1':'0',active,interaction?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      pads?.children?.forEach(o=>{
        const on=o.userData?.tggDestinationV133===active;
        o.material.opacity=balanced?0:(on?(interaction?.22:night?.15:.10):.035);
        o.visible=!balanced&&(night||wet||interaction);
      });
      entryLights?.children?.forEach(light=>{
        const on=light.userData?.tggDestinationV133===active;
        light.intensity=balanced?0:(on?(interaction?(night?1.35:.85):(night?.58:.26)):(night?.12:0));
      });
      if(bollards){
        bollards.visible=!balanced||interaction;
        bollards.material.roughness=wet?.46:.62;
      }
      if(focusGlow){
        if(interaction){
          const [x,z,color]=anchors[active];
          focusGlow.position.set(x,.056,z-3.9);
          focusGlow.material.color.setHex(color);
          focusGlow.material.opacity=balanced?.05:(night?.20:.13);
          focusGlow.visible=true;
        }else{
          focusGlow.visible=false;
        }
      }
    }

    const threshold=scene.getObjectByName?.('TGG_DESTINATION_THRESHOLDS_V132');
    threshold?.children?.forEach(o=>{
      const on=o.userData?.tggDestinationV132===active;
      if('renderOrder' in o)o.renderOrder=on?2:0;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>{
        if(!m)return;
        if('envMapIntensity' in m)m.envMapIntensity=on?(wet?1.45:1.15):.7;
        if('roughness' in m&&m.transparent)m.roughness=on?(wet?.035:.065):.11;
      });
    });

    const nearMaterial=scene.getObjectByName?.('TGG_STOREFRONT_TINT_V131');
    if(nearMaterial?.material){
      nearMaterial.material.opacity=balanced?.035:(interaction?.11:night?.085:.065);
    }

    root.dataset.tggInteractionPadCountV133='5';
    root.dataset.tggEntryBollardsV133=bollards?'40':'0';
    root.dataset.tggInteractionLightCountV133='5';
    root.dataset.tggInteractionFocusV133=interaction?active:'none';
    root.dataset.tggNearFarHandoffV133=interaction?'interaction-near':'world-far';
    root.dataset.tggDestinationMaterialFocusV133=active;
    root.dataset.tggInteractionFidelityV133='1';
  };

  window.TGGInteractionFidelityV133={apply,anchors:Object.keys(anchors)};
  apply();
}
function applyInteractionFidelityV133(){window.TGGInteractionFidelityV133?.apply?.()||installInteractionFidelityV133()}

function installInteractionPhysicalityV134(){
  if(window.TGGInteractionPhysicalityV134)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggInteractionPhysicalityV134='waiting';return}

  const anchors={
    studio:[-34,-34,0xff6672],
    garage:[34,-34,0x72dfff],
    media:[0,38,0xc68bff],
    home:[-300,300,0xffd4a0],
    park:[245,320,0x96ffb0]
  };

  let interiors=scene.getObjectByName?.('TGG_DESTINATION_INTERIOR_SHELLS_V134');
  if(!interiors){
    interiors=new THREE.Group();interiors.name='TGG_DESTINATION_INTERIOR_SHELLS_V134';
    Object.entries(anchors).forEach(([name,[x,z,color]],i)=>{
      const shellMat=new THREE.MeshStandardMaterial({color:0x151a21,roughness:.72,metalness:.08,side:THREE.BackSide});
      const shell=new THREE.Mesh(new THREE.BoxGeometry(8.6,4.5,9),shellMat);
      shell.position.set(x,2.15,z-8.4);shell.userData.tggDestinationV134=name;interiors.add(shell);
      const backMat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.10,depthWrite:false});
      const back=new THREE.Mesh(new THREE.PlaneGeometry(5.8,2.8),backMat);
      back.position.set(x,2.2,z-12.65);back.userData.tggDestinationV134=name;interiors.add(back);
      const floorMat=new THREE.MeshStandardMaterial({color:i===4?0x394838:0x252b33,roughness:.84,metalness:.04});
      const floor=new THREE.Mesh(new THREE.BoxGeometry(7.2,.08,7.4),floorMat);
      floor.position.set(x,.04,z-8.2);floor.userData.tggDestinationV134=name;interiors.add(floor);
    });
    scene.add(interiors);
  }

  let ramps=scene.getObjectByName?.('TGG_ENTRY_RAMPS_V134');
  if(!ramps&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.8,.12,2.4);
    const mat=new THREE.MeshStandardMaterial({color:0x6c7075,roughness:.92,metalness:.01});
    ramps=new THREE.InstancedMesh(geo,mat,30);ramps.name='TGG_ENTRY_RAMPS_V134';
    const centers=[[-34,-29.1],[34,-29.1],[0,42.9],[-300,304.9],[245,324.9]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<30;i++){
      const a=centers[i%centers.length],row=Math.floor(i/centers.length)-2.5;
      p.set(a[0]+row*1.5,.07,a[1]);
      q.identity();s.set(.9+(i%3)*.05,1,1);m.compose(p,q,s);ramps.setMatrixAt(i,m);
    }
    ramps.instanceMatrix.needsUpdate=true;scene.add(ramps);
  }

  let stops=scene.getObjectByName?.('TGG_PARKING_STOPS_V134');
  if(!stops&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.1,.18,.36);
    const mat=new THREE.MeshStandardMaterial({color:0x8a8d91,roughness:.93,metalness:.02});
    stops=new THREE.InstancedMesh(geo,mat,40);stops.name='TGG_PARKING_STOPS_V134';
    const centers=[[-34,-18],[34,-18],[0,54],[-300,284],[245,304]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<40;i++){
      const a=centers[i%centers.length],slot=Math.floor(i/centers.length)-3.5;
      p.set(a[0]+slot*2.5,.09,a[1]);q.identity();m.compose(p,q,s);stops.setMatrixAt(i,m);
    }
    stops.instanceMatrix.needsUpdate=true;scene.add(stops);
  }

  let thresholdShadow=scene.getObjectByName?.('TGG_THRESHOLD_SHADOWS_V134');
  if(!thresholdShadow&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(5.8,2.4);
    const mat=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.16,depthWrite:false});
    thresholdShadow=new THREE.InstancedMesh(geo,mat,20);thresholdShadow.name='TGG_THRESHOLD_SHADOWS_V134';
    const centers=[[-34,-30],[34,-30],[0,42],[-300,304],[245,324]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<20;i++){
      const a=centers[i%centers.length],row=Math.floor(i/centers.length)-1.5;
      p.set(a[0]+row*2.4,.048,a[1]);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,0));
      m.compose(p,q,s);thresholdShadow.setMatrixAt(i,m);
    }
    thresholdShadow.instanceMatrix.needsUpdate=true;scene.add(thresholdShadow);
  }

  let avatar=null,lastAvatarScan=0,lastSig='';
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
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const driving=!!snap.driving||root.dataset.tggDriving==='1'||state.driving===true;
    const fps=Number(root.dataset.tggGraphicsFpsV55||60);
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||'full');
    const balanced=budget==='adaptive-balanced'||snap.quality==='balanced'||fps<42;
    const nearest=String(root.dataset.tggNearestInteractionV123||'none');
    const active=anchors[nearest]?nearest:(anchors[district]?district:'none');
    const interaction=nearest!=='none'&&!!anchors[nearest];
    const night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,driving?'1':'0',balanced?'1':'0',active,interaction?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      interiors?.children?.forEach(o=>{
        const on=o.userData?.tggDestinationV134===active;
        o.visible=!balanced&&(on||interaction||district===o.userData?.tggDestinationV134);
        if(o.material?.transparent)o.material.opacity=on?(night?.18:.12):.06;
      });
      if(ramps){
        ramps.visible=!balanced||interaction;
        ramps.material.roughness=wet?.58:.92;
      }
      if(stops)stops.visible=!balanced||driving;
      if(thresholdShadow){
        thresholdShadow.visible=!balanced&&(interaction||night);
        thresholdShadow.material.opacity=night?.22:.14;
      }
    }

    const av=findAvatar();
    if(av&&!driving&&interaction){
      const target=anchors[nearest];
      if(target){
        const dx=target[0]-av.position.x,dz=target[1]-av.position.z;
        const desired=Math.atan2(dx,dz);
        const cur=Number(av.rotation?.y||0);
        let delta=((desired-cur+Math.PI)%(Math.PI*2))-Math.PI;
        if(av.rotation)av.rotation.y=cur+delta*.14;
        root.dataset.tggAvatarFacingV134=nearest;
      }
    }else root.dataset.tggAvatarFacingV134=av?'free':'waiting';

    if(w.car?.position&&interaction&&driving){
      root.dataset.tggVehicleArrivalV134=nearest;
    }else root.dataset.tggVehicleArrivalV134='none';

    root.dataset.tggInteriorShellsV134='5';
    root.dataset.tggEntryRampsV134=ramps?'30':'0';
    root.dataset.tggParkingStopsV134=stops?'40':'0';
    root.dataset.tggThresholdShadowsV134=thresholdShadow?'20':'0';
    root.dataset.tggInteractionPhysicalityV134='1';
  };

  window.TGGInteractionPhysicalityV134={apply};
  apply();
}
function applyInteractionPhysicalityV134(){window.TGGInteractionPhysicalityV134?.apply?.()||installInteractionPhysicalityV134()}

function installDestinationEnterAuthorityV135(){
  if(window.TGGDestinationEnterV135)return;
  let lastEnterAt=0,lastGamepad=false;

  const canType=()=>{
    const el=document.activeElement;
    const tag=String(el?.tagName||'').toLowerCase();
    return tag==='input'||tag==='textarea'||tag==='select'||el?.isContentEditable===true;
  };

  const resolve=()=>{
    const api=window.TGGDestinationInteractionV124;
    return api?.resolve?.()||{
      name:String(root.dataset.tggNearestInteractionV123||'none'),
      ready:root.dataset.tggDestinationReadyV124==='1',
      driving:root.dataset.tggDriving==='1'||state.driving===true
    };
  };

  const enter=(source='api')=>{
    const now=performance.now();
    if(now-lastEnterAt<650){
      root.dataset.tggDestinationEnterStatusV135='duplicate-blocked';
      return false;
    }
    const r=resolve();
    if(!r?.ready){
      root.dataset.tggDestinationEnterStatusV135='not-ready';
      return false;
    }
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    if(r.driving&&speed>4.5){
      root.dataset.tggDestinationEnterStatusV135='slow-down';
      root.dataset.tggDestinationEnterSourceV135=source;
      return false;
    }
    lastEnterAt=now;
    const ok=window.TGGDestinationInteractionV124?.enter?.()===true;
    root.dataset.tggDestinationEnterSourceV135=source;
    root.dataset.tggDestinationEnterStatusV135=ok?'entered':'failed';
    root.dataset.tggDestinationEnterNameV135=String(r.name||'none');
    if(ok){
      root.dataset.tggDestinationEnterCountV135=String(Number(root.dataset.tggDestinationEnterCountV135||0)+1);
      try{navigator.vibrate?.(35)}catch{}
    }
    return ok;
  };

  const onKey=e=>{
    if(canType()||e.repeat)return;
    if(e.key==='e'||e.key==='E'||e.key==='Enter'){
      const r=resolve();
      if(r?.ready){
        e.preventDefault();
        enter(e.key==='Enter'?'keyboard-enter':'keyboard-e');
      }
    }
  };
  addEventListener('keydown',onKey,{passive:false});

  const gamepadLoop=()=>{
    try{
      const gp=navigator.getGamepads?.()?.find(Boolean);
      const pressed=!!gp?.buttons?.[0]?.pressed;
      const r=resolve();
      const speed=Number(root.dataset.tggVisualSpeedV54||0);
      const allowed=!!r?.ready&&(!r.driving||speed<=4.5);
      root.dataset.tggDestinationGamepadReadyV135=allowed?'1':'0';
      if(pressed&&!lastGamepad&&allowed)enter('gamepad-a');
      lastGamepad=pressed;
    }catch{}
    requestAnimationFrame(gamepadLoop);
  };
  requestAnimationFrame(gamepadLoop);

  const apply=()=>{
    const r=resolve();
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    root.dataset.tggDestinationEnterAuthorityV135='1';
    root.dataset.tggDestinationInputModelV135='button+keyboard+gamepad+quick';
    root.dataset.tggDestinationStopGateV135=r?.driving?(speed<=4.5?'ready':'slow-down'):'walk';
    root.dataset.tggDestinationEnterReadyV135=r?.ready?'1':'0';
  };

  window.TGGDestinationEnterV135={enter,resolve,apply};
  apply();
}
function applyDestinationEnterAuthorityV135(){window.TGGDestinationEnterV135?.apply?.()||installDestinationEnterAuthorityV135()}

function installDestinationFlowV136(){
  if(window.TGGDestinationFlowV136)return;
  const w=window.TGG3D;
  const key='tgg-destination-flow-v136';
  let wrapped=false,lastSig='';

  const readPos=o=>{
    const p=o?.position;
    return p?{x:Number(p.x||0),y:Number(p.y||0),z:Number(p.z||0)}:null;
  };

  const snapshot=(name='none',source='api')=>{
    const driving=root.dataset.tggDriving==='1'||state.driving===true;
    const data={
      name:String(name||'none'),
      source:String(source||'api'),
      district:String(root.dataset.tggDistrict||state.district||'downtown'),
      time:String(root.dataset.tggTime||state.time||'day'),
      weather:String(root.dataset.tggWeather||state.weather||'clear'),
      driving,
      car:readPos(w?.car),
      camera:readPos(w?.camera),
      at:Date.now()
    };
    try{sessionStorage.setItem(key,JSON.stringify(data))}catch{}
    root.dataset.tggDestinationContextV136='saved';
    root.dataset.tggDestinationContextNameV136=data.name;
    root.dataset.tggDestinationContextModeV136=driving?'vehicle':'walk';
    return data;
  };

  const getSaved=()=>{try{return JSON.parse(sessionStorage.getItem(key)||'null')}catch{return null}};

  let veil=document.getElementById('tgg-destination-veil-v136');
  if(!veil){
    veil=document.createElement('div');
    veil.id='tgg-destination-veil-v136';
    veil.style.cssText='position:fixed;inset:0;z-index:10080;pointer-events:none;opacity:0;background:radial-gradient(circle at center,rgba(15,23,32,.18),rgba(2,5,9,.94));transition:opacity .22s ease';
    document.body?.appendChild(veil);
  }
  const flash=()=>{
    if(!veil)return;
    veil.style.opacity='1';
    setTimeout(()=>{veil.style.opacity='0'},180);
  };

  const wrapEnter=()=>{
    const api=window.TGGDestinationEnterV135;
    if(!api||wrapped||api.__tggFlowV136)return;
    const original=api.enter?.bind(api);
    if(typeof original!=='function')return;
    api.enter=(source='api')=>{
      const r=api.resolve?.()||{};
      if(r?.ready){
        snapshot(r.name,source);
        flash();
        root.dataset.tggDestinationTransitionV136='entering';
      }
      const ok=original(source);
      root.dataset.tggDestinationTransitionV136=ok?'entered':'blocked';
      if(ok){
        root.dataset.tggDestinationTransitionCountV136=String(Number(root.dataset.tggDestinationTransitionCountV136||0)+1);
        root.dataset.tggDestinationActiveV136=String(r?.name||'none');
      }
      return ok;
    };
    api.__tggFlowV136=true;wrapped=true;
  };

  const restoreContext=()=>{
    const data=getSaved();
    if(!data)return false;
    root.dataset.tggDestinationRestoreV136='available';
    root.dataset.tggDestinationRestoreNameV136=String(data.name||'none');
    root.dataset.tggDestinationRestoreModeV136=data.driving?'vehicle':'walk';
    return data;
  };

  const apply=()=>{
    wrapEnter();
    const data=getSaved();
    const active=String(root.dataset.tggDestinationActiveV136||'none');
    const sig=[active,data?.name||'none',data?.driving?'1':'0'].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      root.dataset.tggDestinationContinuityV136=data?'1':'0';
      root.dataset.tggDestinationContinuityModeV136=data?.driving?'vehicle':'walk';
    }
    root.dataset.tggDestinationFlowAuthorityV136='1';
    root.dataset.tggDestinationTransitionModelV136='snapshot+veil+restore-context';
  };

  window.TGGDestinationFlowV136={apply,snapshot,getSaved,restoreContext};
  apply();
}
function applyDestinationFlowV136(){window.TGGDestinationFlowV136?.apply?.()||installDestinationFlowV136()}

function installDestinationActivityV137(){
  if(window.TGGDestinationActivityV137)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggDestinationActivityV137='waiting';return}
  const scene=w.scene;

  const anchors={
    studio:[-34,-34,0xff6672],
    garage:[34,-34,0x72dfff],
    media:[0,38,0xc68bff],
    home:[-300,300,0xffd4a0],
    park:[245,320,0x96ffb0]
  };

  let zones=scene.getObjectByName?.('TGG_DESTINATION_ACTIVITY_ZONES_V137');
  if(!zones){
    zones=new THREE.Group();zones.name='TGG_DESTINATION_ACTIVITY_ZONES_V137';
    Object.entries(anchors).forEach(([name,[x,z,color]])=>{
      const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.06,depthWrite:false,side:THREE.DoubleSide});
      const ring=new THREE.Mesh(new THREE.RingGeometry(5.6,7.2,36),mat);
      ring.rotation.x=-Math.PI/2;ring.position.set(x,.035,z);ring.userData.tggDestinationV137=name;zones.add(ring);
    });
    scene.add(zones);
  }

  let parking=scene.getObjectByName?.('TGG_DESTINATION_PARKING_GUIDES_V137');
  if(!parking&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.18,.025,3.4);
    const mat=new THREE.MeshBasicMaterial({color:0xe9eef4,transparent:true,opacity:.5});
    parking=new THREE.InstancedMesh(geo,mat,60);parking.name='TGG_DESTINATION_PARKING_GUIDES_V137';
    const centers=[[-34,-18],[34,-18],[0,54],[-300,284],[245,304]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<60;i++){
      const a=centers[i%centers.length],slot=Math.floor(i/centers.length)-5.5;
      p.set(a[0]+slot*2.4,.045,a[1]);
      q.identity();m.compose(p,q,s);parking.setMatrixAt(i,m);
    }
    parking.instanceMatrix.needsUpdate=true;scene.add(parking);
  }

  let thresholds=scene.getObjectByName?.('TGG_DESTINATION_THRESHOLD_GLOW_V137');
  if(!thresholds&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(4.6,2.7);
    const mat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide});
    thresholds=new THREE.InstancedMesh(geo,mat,10);thresholds.name='TGG_DESTINATION_THRESHOLD_GLOW_V137';
    const entries=[[-34,-29.6],[34,-29.6],[0,43.4],[-300,305.4],[245,325.4]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<10;i++){
      const a=entries[i%entries.length],layer=Math.floor(i/entries.length);
      p.set(a[0],1.8+layer*.18,a[1]-.08*layer);
      q.identity();m.compose(p,q,s);thresholds.setMatrixAt(i,m);
    }
    thresholds.instanceMatrix.needsUpdate=true;scene.add(thresholds);
  }

  let people=scene.getObjectByName?.('TGG_DESTINATION_AMBIENT_PEOPLE_V137');
  if(!people&&THREE.InstancedMesh){
    const geo=THREE.CapsuleGeometry?new THREE.CapsuleGeometry(.18,.75,3,6):new THREE.CylinderGeometry(.17,.22,1.15,6);
    const mat=new THREE.MeshStandardMaterial({color:0x737b86,roughness:.8});
    people=new THREE.InstancedMesh(geo,mat,45);people.name='TGG_DESTINATION_AMBIENT_PEOPLE_V137';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const centers=[[-34,-25],[34,-25],[0,47],[-300,309],[245,329]];
    for(let i=0;i<45;i++){
      const a=centers[i%centers.length],j=Math.floor(i/centers.length),ang=(i%9)*.7;
      p.set(a[0]+Math.cos(ang)*(2.4+j*.45),.63,a[1]+Math.sin(ang)*(2+j*.35));
      q.setFromEuler(new THREE.Euler(0,ang+Math.PI,0));m.compose(p,q,s);people.setMatrixAt(i,m);
    }
    people.instanceMatrix.needsUpdate=true;scene.add(people);
  }

  let lastSig='';
  const apply=()=>{
    const nearest=String(root.dataset.tggNearestInteractionV123||root.dataset.tggDestinationEnterNameV135||'none');
    const ready=root.dataset.tggDestinationReadyV124==='1'||root.dataset.tggDestinationEnterReadyV135==='1';
    const driving=root.dataset.tggDriving==='1'||state.driving===true;
    const time=String(root.dataset.tggTime||state.time||'day');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const balanced=quality==='balanced',night=time==='night';
    const sig=[nearest,ready?'1':'0',driving?'1':'0',time,quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      zones.children.forEach(o=>{
        const active=o.userData?.tggDestinationV137===nearest;
        o.visible=active||nearest==='none';
        if(o.material)o.material.opacity=active&&ready?(night?.18:.12):.035;
      });
      if(parking){
        parking.visible=driving&&!balanced;
        parking.material.opacity=ready?.75:.42;
      }
      if(thresholds){
        thresholds.visible=!driving&&!balanced;
        thresholds.material.opacity=ready?(night?.28:.18):.08;
      }
      if(people)people.visible=!driving&&!balanced;
    }

    if(people?.visible){
      const t=performance.now()*.001;
      people.position.y=Math.sin(t*.55)*.025;
    }

    root.dataset.tggDestinationActivityZonesV137='5';
    root.dataset.tggDestinationParkingGuidesV137=parking?'60':'0';
    root.dataset.tggDestinationThresholdGlowV137=thresholds?'10':'0';
    root.dataset.tggDestinationAmbientPeopleV137=people?'45':'0';
    root.dataset.tggDestinationActivityTargetV137=nearest;
    root.dataset.tggDestinationArrivalModeV137=driving?'vehicle':'walk';
    root.dataset.tggDestinationActivityV137='1';
  };

  window.TGGDestinationActivityV137={apply};
  apply();
}
function applyDestinationActivityV137(){window.TGGDestinationActivityV137?.apply?.()||installDestinationActivityV137()}

function installWholeWorldVisualAuthorityV138(){
  if(window.TGGWholeWorldVisualV138)return;
  const w=window.TGG3D,scene=w?.scene,renderer=w?.renderer;
  if(!scene||!renderer){root.dataset.tggWholeWorldVisualAuthorityV138='waiting';return}
  const get=name=>scene.getObjectByName?.(name)||null;
  let lastSig='';
  const apply=()=>{
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const driving=!!(snap.driving||root.dataset.tggDriving==='1'||state.driving);
    const quality=String(snap.quality||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||'full');
    const balanced=quality==='balanced'||budget==='adaptive-balanced';
    const night=time==='night',wet=/rain|storm/.test(weather);
    const near=String(root.dataset.tggNearFarHandoffV133||'world-far')==='interaction-near';
    const sig=[district,weather,time,driving?'1':'0',balanced?'1':'0',near?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      const windows=get('TGG_WINDOW_REFLECTIONS_V83');
      const glass=get('TGG_STOREFRONT_GLASS_DEPTH_V90');
      const clouds=get('TGG_CLOUD_DEPTH_V84');
      const skyline=get('TGG_SKYLINE_SILHOUETTES_V82');
      const clutter=get('TGG_STREET_CLUTTER_V84');
      const foliage=get('TGG_FOLIAGE_VARIETY_V83');
      const trafficLights=scene.getObjectByName?.('TGG_TRAFFIC_LIGHTS_V83');
      const avShadow=get('TGG_AVATAR_CONTACT_V77');
      const carShadow=get('TGG_VEHICLE_CONTACT_V80');

      if(windows?.material){
        windows.material.opacity=balanced?.12:night?.28:wet?.24:.18;
        windows.material.roughness=wet?.035:.09;
      }
      if(glass?.material){
        glass.material.opacity=balanced?.12:near?.28:night?.24:.17;
        glass.material.roughness=wet?.03:.07;
      }
      if(clouds)clouds.visible=!balanced&&!near;
      if(skyline)skyline.visible=!balanced||district==='downtown'||driving;
      if(clutter)clutter.visible=!balanced&&district!=='park'&&!near;
      if(foliage)foliage.visible=!balanced&&(district==='park'||district==='home'||driving);
      if(trafficLights)trafficLights.visible=night||wet;
      if(avShadow?.material)avShadow.material.opacity=near?.38:night?.34:wet?.31:.25;
      if(carShadow?.material)carShadow.material.opacity=driving?(night?.38:wet?.35:.3):.18;

      if(renderer.shadowMap){
        renderer.shadowMap.enabled=!balanced||near;
        if('autoUpdate' in renderer.shadowMap)renderer.shadowMap.autoUpdate=near||!balanced;
      }
      if(renderer.setPixelRatio){
        const cap=near?Math.min(window.devicePixelRatio||1,1.7):balanced?1.15:1.55;
        renderer.setPixelRatio(cap);
      }
    }

    root.dataset.tggVisualNearModeV138=near?'interaction-near':'world-far';
    root.dataset.tggVisualDensityModeV138=balanced?'budgeted':'full';
    root.dataset.tggGlassAuthorityV138='central';
    root.dataset.tggShadowAuthorityV138='central';
    root.dataset.tggWholeWorldVisualAuthorityV138='1';
  };
  window.TGGWholeWorldVisualV138={apply};
  apply();
}
function applyWholeWorldVisualAuthorityV138(){window.TGGWholeWorldVisualV138?.apply?.()||installWholeWorldVisualAuthorityV138()}

function installStreetCompositionV139(){
  if(window.TGGStreetCompositionV139)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggStreetCompositionV139='waiting';return}

  let crosswalks=scene.getObjectByName?.('TGG_CROSSWALKS_V139');
  if(!crosswalks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.42,.025,3.4);
    const mat=new THREE.MeshBasicMaterial({color:0xe8e4d6,transparent:true,opacity:.7});
    crosswalks=new THREE.InstancedMesh(geo,mat,96);crosswalks.name='TGG_CROSSWALKS_V139';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const cluster=Math.floor(i/12),stripe=i%12;
      const anchors=[[-42,-42],[42,-42],[-42,42],[42,42],[0,-88],[0,88],[-88,0],[88,0]];
      const a=anchors[cluster]||[0,0];
      const axis=cluster>=4;
      p.set(a[0]+(axis?(stripe-5.5)*.72:0),.047,a[1]+(axis?0:(stripe-5.5)*.72));
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);crosswalks.setMatrixAt(i,m);
    }
    crosswalks.instanceMatrix.needsUpdate=true;scene.add(crosswalks);
  }

  let arrows=scene.getObjectByName?.('TGG_LANE_ARROWS_V139');
  if(!arrows&&THREE.InstancedMesh){
    const geo=new THREE.ConeGeometry(.45,1.8,3);
    const mat=new THREE.MeshBasicMaterial({color:0xd9d6ca,transparent:true,opacity:.58});
    arrows=new THREE.InstancedMesh(geo,mat,48);arrows.name='TGG_LANE_ARROWS_V139';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<48;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-6;
      p.set(axis?step*30:side*3.6,.051,axis?side*3.6:step*30);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,axis?Math.PI/2:0));
      m.compose(p,q,s);arrows.setMatrixAt(i,m);
    }
    arrows.instanceMatrix.needsUpdate=true;scene.add(arrows);
  }

  let benches=scene.getObjectByName?.('TGG_STREET_FURNITURE_V139');
  if(!benches&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.1,.38,.55);
    const mat=new THREE.MeshStandardMaterial({color:0x4a3d34,roughness:.9,metalness:.06});
    benches=new THREE.InstancedMesh(geo,mat,36);benches.name='TGG_STREET_FURNITURE_V139';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<36;i++){
      const a=(i/36)*Math.PI*2,r=54+(i%4)*26;
      p.set(Math.cos(a)*r,.35,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      m.compose(p,q,s);benches.setMatrixAt(i,m);
    }
    benches.instanceMatrix.needsUpdate=true;scene.add(benches);
  }

  let utility=scene.getObjectByName?.('TGG_UTILITY_BOXES_V139');
  if(!utility&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.8,1.25,.55);
    const mat=new THREE.MeshStandardMaterial({color:0x46505a,roughness:.78,metalness:.28});
    utility=new THREE.InstancedMesh(geo,mat,52);utility.name='TGG_UTILITY_BOXES_V139';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<52;i++){
      const side=i%4,step=Math.floor(i/4)-6;let x=0,z=0;
      if(side===0){x=-24;z=step*24}
      if(side===1){x=24;z=step*24}
      if(side===2){x=step*24;z=-24}
      if(side===3){x=step*24;z=24}
      p.set(x,.63,z);q.setFromEuler(new THREE.Euler(0,(i%3)*.24,0));
      m.compose(p,q,s);utility.setMatrixAt(i,m);
    }
    utility.instanceMatrix.needsUpdate=true;scene.add(utility);
  }

  let transit=scene.getObjectByName?.('TGG_TRANSIT_MARKERS_V139');
  if(!transit&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.16,3.4,.16);
    const mat=new THREE.MeshStandardMaterial({color:0x65717c,roughness:.62,metalness:.42});
    transit=new THREE.InstancedMesh(geo,mat,24);transit.name='TGG_TRANSIT_MARKERS_V139';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<24;i++){
      const a=(i/24)*Math.PI*2,r=105+(i%3)*34;
      p.set(Math.cos(a)*r,1.7,Math.sin(a)*r);
      q.identity();m.compose(p,q,s);transit.setMatrixAt(i,m);
    }
    transit.instanceMatrix.needsUpdate=true;scene.add(transit);
  }

  let lastSig='';
  const apply=()=>{
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const driving=!!(snap.driving||root.dataset.tggDriving==='1'||state.driving);
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||'full');
    const balanced=budget==='adaptive-balanced'||String(snap.quality||'high')==='balanced';
    const near=String(root.dataset.tggNearFarHandoffV133||'world-far')==='interaction-near';
    const wet=/rain|storm/.test(weather),night=time==='night';
    const sig=[district,weather,time,driving?'1':'0',balanced?'1':'0',near?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(crosswalks){
        crosswalks.visible=district!=='park';
        crosswalks.material.opacity=wet?.82:night?.74:.68;
      }
      if(arrows)arrows.visible=driving||district==='downtown'||district==='garage';
      if(benches)benches.visible=!driving&&!balanced&&(district==='downtown'||district==='studio'||district==='media'||district==='park');
      if(utility)utility.visible=!balanced||near;
      if(transit)transit.visible=!balanced&&(district==='downtown'||district==='media'||district==='studio');
    }

    root.dataset.tggCrosswalksV139=crosswalks?'96':'0';
    root.dataset.tggLaneArrowsV139=arrows?'48':'0';
    root.dataset.tggStreetFurnitureV139=benches?'36':'0';
    root.dataset.tggUtilityBoxesV139=utility?'52':'0';
    root.dataset.tggTransitMarkersV139=transit?'24':'0';
    root.dataset.tggStreetCompositionBudgetAwareV139='1';
    root.dataset.tggStreetCompositionV139='1';
  };

  window.TGGStreetCompositionV139={apply};
  apply();
}
function applyStreetCompositionV139(){window.TGGStreetCompositionV139?.apply?.()||installStreetCompositionV139()}

function installStreetEdgeRealismV140(){
  if(window.TGGStreetEdgeV140)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggStreetEdgeRealismV140='waiting';return}

  let gutters=scene.getObjectByName?.('TGG_GUTTER_CHANNELS_V140');
  if(!gutters&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(5.4,.035,.34);
    const mat=new THREE.MeshStandardMaterial({color:0x3b4148,roughness:.72,metalness:.12});
    gutters=new THREE.InstancedMesh(geo,mat,168);gutters.name='TGG_GUTTER_CHANNELS_V140';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<168;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-21;
      p.set(axis?step*6.8:side*10.35,.032,axis?side*10.35:step*6.8);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);gutters.setMatrixAt(i,m);
    }
    gutters.instanceMatrix.needsUpdate=true;scene.add(gutters);
  }

  let drains=scene.getObjectByName?.('TGG_STORM_DRAINS_V140');
  if(!drains&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.9,.045,.42);
    const mat=new THREE.MeshStandardMaterial({color:0x252b31,roughness:.55,metalness:.42});
    drains=new THREE.InstancedMesh(geo,mat,64);drains.name='TGG_STORM_DRAINS_V140';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<64;i++){
      const side=i%4,step=Math.floor(i/4)-8;let x=0,z=0,r=0;
      if(side===0){x=-10.2;z=step*18;r=0}
      if(side===1){x=10.2;z=step*18;r=0}
      if(side===2){x=step*18;z=-10.2;r=Math.PI/2}
      if(side===3){x=step*18;z=10.2;r=Math.PI/2}
      p.set(x,.052,z);q.setFromEuler(new THREE.Euler(0,r,0));
      m.compose(p,q,s);drains.setMatrixAt(i,m);
    }
    drains.instanceMatrix.needsUpdate=true;scene.add(drains);
  }

  let shoulders=scene.getObjectByName?.('TGG_LANE_EDGE_SHOULDERS_V140');
  if(!shoulders&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.28,.028,5.2);
    const mat=new THREE.MeshBasicMaterial({color:0xd5d0c2,transparent:true,opacity:.5});
    shoulders=new THREE.InstancedMesh(geo,mat,132);shoulders.name='TGG_LANE_EDGE_SHOULDERS_V140';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<132;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-16;
      p.set(axis?step*8.2:side*5.7,.052,axis?side*5.7:step*8.2);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);shoulders.setMatrixAt(i,m);
    }
    shoulders.instanceMatrix.needsUpdate=true;scene.add(shoulders);
  }

  let forecourts=scene.getObjectByName?.('TGG_DESTINATION_FORECOURTS_V140');
  if(!forecourts&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(6.5,28);
    const mat=new THREE.MeshStandardMaterial({color:0x50555b,roughness:.84,metalness:.04});
    forecourts=new THREE.InstancedMesh(geo,mat,5);forecourts.name='TGG_DESTINATION_FORECOURTS_V140';
    const anchors=[[-34,-34],[34,-34],[0,38],[-300,300],[245,320]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    anchors.forEach((a,i)=>{
      p.set(a[0],.028,a[1]);q.setFromEuler(new THREE.Euler(-Math.PI/2,0,0));
      const sc=[1.05,1.05,1.12,1.22,1.28][i]||1;s.set(sc,sc,1);m.compose(p,q,s);forecourts.setMatrixAt(i,m);
    });
    forecourts.instanceMatrix.needsUpdate=true;scene.add(forecourts);
  }

  let nearBreakup=scene.getObjectByName?.('TGG_NEAR_SURFACE_BREAKUP_V140');
  if(!nearBreakup&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(.9,10);
    const mat=new THREE.MeshBasicMaterial({color:0x2b3036,transparent:true,opacity:.08,depthWrite:false});
    nearBreakup=new THREE.InstancedMesh(geo,mat,220);nearBreakup.name='TGG_NEAR_SURFACE_BREAKUP_V140';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<220;i++){
      const a=(i/220)*Math.PI*10,r=18+(i%22)*4.8;
      p.set(Math.cos(a)*r,.041,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.45+(i%7)*.11;s.set(sc,sc*.7,1);m.compose(p,q,s);nearBreakup.setMatrixAt(i,m);
    }
    nearBreakup.instanceMatrix.needsUpdate=true;scene.add(nearBreakup);
  }

  let lastSig='';
  const apply=()=>{
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const quality=String(snap.quality||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const near=String(root.dataset.tggNearFarHandoffV133||'world-far')==='interaction-near';
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||'full');
    const balanced=quality==='balanced'||budget==='adaptive-balanced';
    const wet=/rain|storm/.test(weather),night=time==='night';
    const sig=[district,weather,time,balanced?'1':'0',near?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(gutters?.material){
        gutters.material.roughness=wet?.42:.72;
        gutters.material.color.setHex(wet?0x30363d:0x3b4148);
      }
      if(drains?.material){
        drains.material.roughness=wet?.34:.55;
        drains.visible=!balanced||near;
      }
      if(shoulders?.material)shoulders.material.opacity=night?.62:wet?.68:.5;
      if(forecourts?.material){
        forecourts.material.roughness=wet?.48:.84;
        forecourts.material.color.setHex(district==='studio'?0x57505b:district==='park'?0x515951:0x50555b);
      }
      if(nearBreakup){
        nearBreakup.visible=near&&!balanced;
        nearBreakup.material.opacity=wet?.11:.075;
      }
    }

    root.dataset.tggGutterChannelsV140=gutters?'168':'0';
    root.dataset.tggStormDrainsV140=drains?'64':'0';
    root.dataset.tggLaneEdgeShouldersV140=shoulders?'132':'0';
    root.dataset.tggDestinationForecourtsV140=forecourts?'5':'0';
    root.dataset.tggNearSurfaceBreakupV140=nearBreakup?'220':'0';
    root.dataset.tggStreetEdgeRealismV140='1';
  };

  window.TGGStreetEdgeV140={apply};
  apply();
}
function applyStreetEdgeRealismV140(){window.TGGStreetEdgeV140?.apply?.()||installStreetEdgeRealismV140()}

function installLivingWorldV141(){
  if(window.TGGLivingWorldV141)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggLivingWorldV141='waiting';return}

  let puddles=scene.getObjectByName?.('TGG_PUDDLE_ACCENTS_V141');
  if(!puddles&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(1.8,18);
    const mat=new THREE.MeshPhysicalMaterial({color:0x516d83,roughness:.08,metalness:.04,transparent:true,opacity:.12,transmission:.06,depthWrite:false});
    puddles=new THREE.InstancedMesh(geo,mat,84);puddles.name='TGG_PUDDLE_ACCENTS_V141';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-10;
      p.set(axis?step*18:side*6.2,.035,axis?side*6.2:step*18);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,0));
      const sx=.7+(i%5)*.18,sy=.45+(i%4)*.12;s.set(sx,sy,1);
      m.compose(p,q,s);puddles.setMatrixAt(i,m);
    }
    puddles.instanceMatrix.needsUpdate=true;scene.add(puddles);
  }

  let storefrontGlow=scene.getObjectByName?.('TGG_STOREFRONT_OCCUPANCY_V141');
  if(!storefrontGlow&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(3.8,2.2);
    const mat=new THREE.MeshBasicMaterial({color:0xffd79b,transparent:true,opacity:.11,depthWrite:false,side:THREE.DoubleSide});
    storefrontGlow=new THREE.InstancedMesh(geo,mat,96);storefrontGlow.name='TGG_STOREFRONT_OCCUPANCY_V141';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const side=i%4,step=Math.floor(i/4)-12;let x=0,z=0,r=0;
      const d=86+(i%4)*7;
      if(side===0){x=-d;z=step*14;r=Math.PI/2}
      if(side===1){x=d;z=step*14;r=-Math.PI/2}
      if(side===2){x=step*14;z=-d;r=0}
      if(side===3){x=step*14;z=d;r=Math.PI}
      p.set(x,2.5+(i%3)*.35,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.8+(i%4)*.08;s.set(sc,.9,1);m.compose(p,q,s);storefrontGlow.setMatrixAt(i,m);
    }
    storefrontGlow.instanceMatrix.needsUpdate=true;scene.add(storefrontGlow);
  }

  let lastSig='',lastWind=0;
  const apply=()=>{
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced';
    const sig=[time,weather,district,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(puddles){
        puddles.visible=wet&&!balanced;
        puddles.material.opacity=weather==='storm'?.18:.12;
        puddles.material.roughness=weather==='storm'?.045:.08;
      }
      if(storefrontGlow){
        storefrontGlow.visible=district!=='park'&&!balanced;
        storefrontGlow.material.opacity=night?.2:time==='golden'?.14:.08;
      }
    }

    const now=performance.now();
    if(now-lastWind>120){
      lastWind=now;
      const t=now*.001;
      const foliage=scene.getObjectByName?.('TGG_FOLIAGE_VARIETY_V83');
      const country=scene.getObjectByName?.('TGG_COUNTRYSIDE_TREES_V76');
      const clouds=scene.getObjectByName?.('TGG_CLOUD_DEPTH_V84');
      const sway=/storm/.test(weather)?.024:/rain/.test(weather)?.015:.007;
      if(foliage?.rotation)foliage.rotation.z=Math.sin(t*.55)*sway;
      if(country?.rotation)country.rotation.z=Math.sin(t*.42+.8)*sway*.65;
      if(clouds?.position){
        clouds.position.x=Math.sin(t*.018)*28;
        clouds.position.z=Math.cos(t*.014)*24;
      }
      root.dataset.tggWindResponseV141=String(sway.toFixed(3));
    }

    let trafficLit=0;
    (w.traffic||[]).forEach((v,i)=>{
      const lights=v?.getObjectByName?.('TGG_TRAFFIC_LIGHTS_V83');
      if(!lights)return;
      lights.visible=night||wet;
      if(lights.visible)trafficLit++;
      lights.children?.forEach((m,j)=>{
        if(!m?.material)return;
        if(j>=2&&m.material.color){
          const pulse=.82+.18*Math.sin(performance.now()*.002+i*.7);
          m.material.opacity=pulse;
          m.material.transparent=true;
        }
      });
    });

    root.dataset.tggPuddleAccentsV141=puddles?'84':'0';
    root.dataset.tggStorefrontOccupancyV141=storefrontGlow?'96':'0';
    root.dataset.tggTrafficLightAmbienceV141=String(trafficLit);
    root.dataset.tggLivingWorldMotionV141='1';
    root.dataset.tggLivingWorldV141='1';
  };

  window.TGGLivingWorldV141={apply};
  apply();
}
function applyLivingWorldV141(){window.TGGLivingWorldV141?.apply?.()||installLivingWorldV141()}

function installCurbsideWorldV142(){
  if(window.TGGCurbsideWorldV142)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggCurbsideWorldV142='waiting';return}

  let parked=scene.getObjectByName?.('TGG_PARKED_WORLD_V142');
  if(!parked&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.8,1.15,1.7);
    const mat=new THREE.MeshStandardMaterial({color:0x39414b,roughness:.42,metalness:.32});
    parked=new THREE.InstancedMesh(geo,mat,56);parked.name='TGG_PARKED_WORLD_V142';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<56;i++){
      const side=i%4,step=Math.floor(i/4)-7;let x=0,z=0,r=0;
      const d=13.5+(i%2)*2.1;
      if(side===0){x=-d;z=step*17;r=Math.PI/2}
      if(side===1){x=d;z=step*17;r=-Math.PI/2}
      if(side===2){x=step*17;z=-d;r=0}
      if(side===3){x=step*17;z=d;r=Math.PI}
      p.set(x,.58,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.88+(i%5)*.04;s.set(sc,.92+(i%3)*.05,sc);m.compose(p,q,s);parked.setMatrixAt(i,m);
    }
    parked.instanceMatrix.needsUpdate=true;scene.add(parked);
  }

  let baseAO=scene.getObjectByName?.('TGG_BUILDING_BASE_AO_V142');
  if(!baseAO&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(12,2.1);
    const mat=new THREE.MeshBasicMaterial({color:0x05070a,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide});
    baseAO=new THREE.InstancedMesh(geo,mat,96);baseAO.name='TGG_BUILDING_BASE_AO_V142';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*2,r=125+(i%8)*34;
      p.set(Math.cos(a)*r,.022,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sx=.7+(i%5)*.12,sy=.7+(i%4)*.08;s.set(sx,sy,1);m.compose(p,q,s);baseAO.setMatrixAt(i,m);
    }
    baseAO.instanceMatrix.needsUpdate=true;scene.add(baseAO);
  }

  let loading=scene.getObjectByName?.('TGG_LOADING_ZONE_MARKS_V142');
  if(!loading&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.16,.018,3.8);
    const mat=new THREE.MeshBasicMaterial({color:0xe7cf6b,transparent:true,opacity:.68});
    loading=new THREE.InstancedMesh(geo,mat,48);loading.name='TGG_LOADING_ZONE_MARKS_V142';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<48;i++){
      const side=i%4,step=Math.floor(i/4)-6;let x=0,z=0,r=0;
      if(side===0){x=-10.7;z=step*18;r=0}
      if(side===1){x=10.7;z=step*18;r=0}
      if(side===2){x=step*18;z=-10.7;r=Math.PI/2}
      if(side===3){x=step*18;z=10.7;r=Math.PI/2}
      p.set(x,.045,z);q.setFromEuler(new THREE.Euler(0,r,0));m.compose(p,q,s);loading.setMatrixAt(i,m);
    }
    loading.instanceMatrix.needsUpdate=true;scene.add(loading);
  }

  let planters=scene.getObjectByName?.('TGG_STREET_PLANTERS_V142');
  if(!planters&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.55,.62,.42,10);
    const mat=new THREE.MeshStandardMaterial({color:0x4a4f55,roughness:.82,metalness:.08});
    planters=new THREE.InstancedMesh(geo,mat,64);planters.name='TGG_STREET_PLANTERS_V142';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const side=i%4,step=Math.floor(i/4)-8;let x=0,z=0;
      if(side===0){x=-18;z=step*19}
      if(side===1){x=18;z=step*19}
      if(side===2){x=step*19;z=-18}
      if(side===3){x=step*19;z=18}
      p.set(x,.21,z);q.identity();
      const sc=.85+(i%4)*.06;s.set(sc,1,sc);m.compose(p,q,s);planters.setMatrixAt(i,m);
    }
    planters.instanceMatrix.needsUpdate=true;scene.add(planters);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(parked){
        parked.visible=district!=='park'&&(!balanced||district==='downtown'||district==='studio');
        parked.material.roughness=wet?.28:.42;
        parked.material.metalness=wet?.4:.32;
      }
      if(baseAO){
        baseAO.visible=!balanced||district==='downtown'||district==='media';
        baseAO.material.opacity=night?.22:wet?.2:.15;
      }
      if(loading){
        loading.visible=district==='downtown'||district==='studio'||district==='garage'||driving;
        loading.material.opacity=wet?.78:.64;
      }
      if(planters){
        planters.visible=district!=='garage'&&(!balanced||district==='park'||district==='home');
        planters.material.color.setHex(district==='park'?0x535b50:0x4a4f55);
      }
    }

    root.dataset.tggParkedWorldV142=parked?'56':'0';
    root.dataset.tggBuildingBaseAOV142=baseAO?'96':'0';
    root.dataset.tggLoadingZoneMarksV142=loading?'48':'0';
    root.dataset.tggStreetPlantersV142=planters?'64':'0';
    root.dataset.tggCurbsideOccupancyV142='1';
    root.dataset.tggCurbsideWorldV142='1';
  };

  window.TGGCurbsideWorldV142={apply};
  apply();
}
function applyCurbsideWorldV142(){window.TGGCurbsideWorldV142?.apply?.()||installCurbsideWorldV142()}

function installPublicSpaceV143(){
  if(window.TGGPublicSpaceV143)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggPublicSpaceV143='waiting';return}

  let crosswalks=scene.getObjectByName?.('TGG_CROSSWALKS_V143');
  if(!crosswalks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.55,.025,4.8);
    const mat=new THREE.MeshBasicMaterial({color:0xf1efe7,transparent:true,opacity:.78});
    crosswalks=new THREE.InstancedMesh(geo,mat,96);crosswalks.name='TGG_CROSSWALKS_V143';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const arm=i%4,row=Math.floor(i/4)%6,block=Math.floor(i/24)-1.5;
      let x=0,z=0,r=0;
      if(arm===0){x=-4+row*1.5;z=-24+block*48;r=0}
      if(arm===1){x=-4+row*1.5;z=24+block*48;r=0}
      if(arm===2){x=-24+block*48;z=-4+row*1.5;r=Math.PI/2}
      if(arm===3){x=24+block*48;z=-4+row*1.5;r=Math.PI/2}
      p.set(x,.052,z);q.setFromEuler(new THREE.Euler(0,r,0));m.compose(p,q,s);crosswalks.setMatrixAt(i,m);
    }
    crosswalks.instanceMatrix.needsUpdate=true;scene.add(crosswalks);
  }

  let stops=scene.getObjectByName?.('TGG_BUS_STOPS_V143');
  if(!stops&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(4.2,2.7,.18);
    const mat=new THREE.MeshPhysicalMaterial({color:0x7890a8,roughness:.12,metalness:.12,transparent:true,opacity:.38,transmission:.12});
    stops=new THREE.InstancedMesh(geo,mat,18);stops.name='TGG_BUS_STOPS_V143';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const pts=[[-42,-18],[42,18],[-72,54],[72,-54],[-110,-90],[110,90],[-150,40],[150,-40],[0,118],[0,-118],[-210,160],[210,-160],[-260,260],[260,-260],[-320,120],[320,-120],[-180,-260],[180,260]];
    pts.forEach((a,i)=>{p.set(a[0],1.4,a[1]);q.setFromEuler(new THREE.Euler(0,i%2?Math.PI/2:0,0));m.compose(p,q,s);stops.setMatrixAt(i,m)});
    stops.instanceMatrix.needsUpdate=true;scene.add(stops);
  }

  let benches=scene.getObjectByName?.('TGG_PUBLIC_BENCHES_V143');
  if(!benches&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.6,.22,.72);
    const mat=new THREE.MeshStandardMaterial({color:0x493e34,roughness:.9,metalness:.06});
    benches=new THREE.InstancedMesh(geo,mat,54);benches.name='TGG_PUBLIC_BENCHES_V143';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<54;i++){
      const a=(i/54)*Math.PI*2,r=58+(i%6)*23;
      p.set(Math.cos(a)*r,.42,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));m.compose(p,q,s);benches.setMatrixAt(i,m);
    }
    benches.instanceMatrix.needsUpdate=true;scene.add(benches);
  }

  let meters=scene.getObjectByName?.('TGG_PARKING_METERS_V143');
  if(!meters&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.08,.1,1.15,6);
    const mat=new THREE.MeshStandardMaterial({color:0x59636f,roughness:.62,metalness:.58});
    meters=new THREE.InstancedMesh(geo,mat,80);meters.name='TGG_PARKING_METERS_V143';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<80;i++){
      const side=i%4,step=Math.floor(i/4)-10;let x=0,z=0;
      if(side===0){x=-12.4;z=step*13}
      if(side===1){x=12.4;z=step*13}
      if(side===2){x=step*13;z=-12.4}
      if(side===3){x=step*13;z=12.4}
      p.set(x,.58,z);q.identity();m.compose(p,q,s);meters.setMatrixAt(i,m);
    }
    meters.instanceMatrix.needsUpdate=true;scene.add(meters);
  }

  let islands=scene.getObjectByName?.('TGG_CORNER_ISLANDS_V143');
  if(!islands&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(2.4,2.7,.22,16);
    const mat=new THREE.MeshStandardMaterial({color:0x73787d,roughness:.91,metalness:.02});
    islands=new THREE.InstancedMesh(geo,mat,16);islands.name='TGG_CORNER_ISLANDS_V143';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const pts=[[-22,-22],[22,-22],[-22,22],[22,22],[-70,-70],[70,-70],[-70,70],[70,70],[-118,-118],[118,-118],[-118,118],[118,118],[-166,-166],[166,-166],[-166,166],[166,166]];
    pts.forEach((a,i)=>{p.set(a[0],.11,a[1]);q.identity();m.compose(p,q,s);islands.setMatrixAt(i,m)});
    islands.instanceMatrix.needsUpdate=true;scene.add(islands);
  }

  let gather=scene.getObjectByName?.('TGG_PEDESTRIAN_GATHER_V143');
  if(!gather&&THREE.InstancedMesh){
    const geo=THREE.CapsuleGeometry?new THREE.CapsuleGeometry(.18,.78,3,6):new THREE.CylinderGeometry(.16,.21,1.15,6);
    const mat=new THREE.MeshStandardMaterial({color:0x737b86,roughness:.76});
    gather=new THREE.InstancedMesh(geo,mat,48);gather.name='TGG_PEDESTRIAN_GATHER_V143';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const hubs=[[-34,-34],[34,-34],[0,38],[-86,12],[86,-12],[-300,300],[245,320],[0,0]];
    for(let i=0;i<48;i++){
      const h=hubs[i%hubs.length],a=(i/48)*Math.PI*10,r=3+(i%4)*1.6;
      p.set(h[0]+Math.cos(a)*r,.62,h[1]+Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a,0));m.compose(p,q,s);gather.setMatrixAt(i,m);
    }
    gather.instanceMatrix.needsUpdate=true;scene.add(gather);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      if(crosswalks)crosswalks.material.opacity=wet?.9:.78;
      if(stops){stops.visible=district!=='park'&&!balanced;stops.material.opacity=night?.52:.38}
      if(benches)benches.visible=district!=='garage'&&(!balanced||district==='park'||district==='home');
      if(meters)meters.visible=district==='downtown'||district==='studio'||district==='media';
      if(islands)islands.visible=district!=='park'||driving;
      if(gather)gather.visible=!driving&&district!=='garage'&&!balanced;
    }
    root.dataset.tggCrosswalksV143=crosswalks?'96':'0';
    root.dataset.tggBusStopsV143=stops?'18':'0';
    root.dataset.tggPublicBenchesV143=benches?'54':'0';
    root.dataset.tggParkingMetersV143=meters?'80':'0';
    root.dataset.tggCornerIslandsV143=islands?'16':'0';
    root.dataset.tggPedestrianGatherV143=gather?'48':'0';
    root.dataset.tggPublicSpaceV143='1';
  };

  window.TGGPublicSpaceV143={apply};
  apply();
}
function applyPublicSpaceV143(){window.TGGPublicSpaceV143?.apply?.()||installPublicSpaceV143()}

function installPublicRealmV144(){
  if(window.TGGPublicRealmV144)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggPublicRealmV144='waiting';return}

  let streetTrees=scene.getObjectByName?.('TGG_STREET_TREES_V144');
  if(!streetTrees&&THREE.InstancedMesh){
    const geo=new THREE.ConeGeometry(.85,3.8,7);
    const mat=new THREE.MeshStandardMaterial({color:0x31533b,roughness:.96});
    streetTrees=new THREE.InstancedMesh(geo,mat,72);streetTrees.name='TGG_STREET_TREES_V144';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0;
      if(side===0){x=-17.5;z=step*17}
      if(side===1){x=17.5;z=step*17}
      if(side===2){x=step*17;z=-17.5}
      if(side===3){x=step*17;z=17.5}
      p.set(x,2,z);q.setFromEuler(new THREE.Euler(0,(i%5)*.3,0));
      const sc=.72+(i%6)*.07;s.set(sc,.8+(i%4)*.08,sc);m.compose(p,q,s);streetTrees.setMatrixAt(i,m);
    }
    streetTrees.instanceMatrix.needsUpdate=true;scene.add(streetTrees);
  }

  let cabinets=scene.getObjectByName?.('TGG_UTILITY_CABINETS_V144');
  if(!cabinets&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.9,1.25,.55);
    const mat=new THREE.MeshStandardMaterial({color:0x46505a,roughness:.72,metalness:.34});
    cabinets=new THREE.InstancedMesh(geo,mat,36);cabinets.name='TGG_UTILITY_CABINETS_V144';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<36;i++){
      const a=(i/36)*Math.PI*2,r=78+(i%6)*24;
      p.set(Math.cos(a)*r,.63,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a,0));m.compose(p,q,s);cabinets.setMatrixAt(i,m);
    }
    cabinets.instanceMatrix.needsUpdate=true;scene.add(cabinets);
  }

  let bins=scene.getObjectByName?.('TGG_PUBLIC_BINS_V144');
  if(!bins&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.34,.38,.82,10);
    const mat=new THREE.MeshStandardMaterial({color:0x303841,roughness:.78,metalness:.22});
    bins=new THREE.InstancedMesh(geo,mat,42);bins.name='TGG_PUBLIC_BINS_V144';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<42;i++){
      const a=(i/42)*Math.PI*2,r=52+(i%7)*20;
      p.set(Math.cos(a)*r,.41,Math.sin(a)*r);
      q.identity();m.compose(p,q,s);bins.setMatrixAt(i,m);
    }
    bins.instanceMatrix.needsUpdate=true;scene.add(bins);
  }

  let hydrants=scene.getObjectByName?.('TGG_HYDRANTS_V144');
  if(!hydrants&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.16,.2,.7,8);
    const mat=new THREE.MeshStandardMaterial({color:0xb63b36,roughness:.62,metalness:.28});
    hydrants=new THREE.InstancedMesh(geo,mat,28);hydrants.name='TGG_HYDRANTS_V144';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<28;i++){
      const side=i%4,step=Math.floor(i/4)-3;let x=0,z=0;
      if(side===0){x=-13.8;z=step*34}
      if(side===1){x=13.8;z=step*34}
      if(side===2){x=step*34;z=-13.8}
      if(side===3){x=step*34;z=13.8}
      p.set(x,.35,z);q.identity();m.compose(p,q,s);hydrants.setMatrixAt(i,m);
    }
    hydrants.instanceMatrix.needsUpdate=true;scene.add(hydrants);
  }

  let racks=scene.getObjectByName?.('TGG_BIKE_RACKS_V144');
  if(!racks&&THREE.InstancedMesh){
    const geo=new THREE.TorusGeometry(.42,.055,6,14,Math.PI);
    const mat=new THREE.MeshStandardMaterial({color:0x59636e,roughness:.54,metalness:.56});
    racks=new THREE.InstancedMesh(geo,mat,30);racks.name='TGG_BIKE_RACKS_V144';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<30;i++){
      const a=(i/30)*Math.PI*2,r=66+(i%5)*26;
      p.set(Math.cos(a)*r,.42,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,Math.PI/2));m.compose(p,q,s);racks.setMatrixAt(i,m);
    }
    racks.instanceMatrix.needsUpdate=true;scene.add(racks);
  }

  let wayfinding=scene.getObjectByName?.('TGG_WAYFINDING_V144');
  if(!wayfinding&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.8,.65,.12);
    const mat=new THREE.MeshBasicMaterial({color:0x9fd3ff,transparent:true,opacity:.46,depthWrite:false});
    wayfinding=new THREE.InstancedMesh(geo,mat,24);wayfinding.name='TGG_WAYFINDING_V144';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const pts=[[-34,-34],[34,-34],[0,38],[-39,20],[39,20],[0,92],[-92,0],[92,0],[0,-92],[-140,60],[140,-60],[-140,-60],[140,60],[-220,0],[220,0],[0,220],[0,-220],[-300,120],[300,-120],[-300,-120],[300,120],[-420,0],[420,0],[0,420]];
    pts.forEach((a,i)=>{p.set(a[0],2.1,a[1]);q.setFromEuler(new THREE.Euler(0,(i%4)*Math.PI/2,0));m.compose(p,q,s);wayfinding.setMatrixAt(i,m)});
    wayfinding.instanceMatrix.needsUpdate=true;scene.add(wayfinding);
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
      if(streetTrees){
        streetTrees.visible=district!=='garage'&&(!balanced||district==='park'||district==='home');
        streetTrees.material.color.setHex(district==='park'?0x2f6140:district==='home'?0x3f5842:0x31533b);
      }
      if(cabinets)cabinets.visible=district!=='park'||driving;
      if(bins)bins.visible=!balanced||district==='downtown'||district==='studio'||district==='media';
      if(hydrants)hydrants.visible=district!=='park'&&!balanced;
      if(racks)racks.visible=!driving&&district!=='garage'&&!balanced;
      if(wayfinding){
        wayfinding.visible=night||driving||district==='downtown';
        wayfinding.material.opacity=night?.58:wet?.5:.4;
      }
    }

    root.dataset.tggStreetTreesV144=streetTrees?'72':'0';
    root.dataset.tggUtilityCabinetsV144=cabinets?'36':'0';
    root.dataset.tggPublicBinsV144=bins?'42':'0';
    root.dataset.tggHydrantsV144=hydrants?'28':'0';
    root.dataset.tggBikeRacksV144=racks?'30':'0';
    root.dataset.tggWayfindingV144=wayfinding?'24':'0';
    root.dataset.tggHumanScaleWorldV144='1';
    root.dataset.tggPublicRealmV144='1';
  };

  window.TGGPublicRealmV144={apply};
  apply();
}
function applyPublicRealmV144(){window.TGGPublicRealmV144?.apply?.()||installPublicRealmV144()}

function installDestinationInteriorsV145(){
  if(window.TGGDestinationInteriorsV145)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggDestinationInteriorsV145='waiting';return}

  const anchors={
    studio:[-34,-34,0xff6672],
    garage:[34,-34,0x72dfff],
    media:[0,38,0xc68bff],
    home:[-300,300,0xffd4a0],
    park:[245,320,0x96ffb0],
    downtown:[0,-320,0x6ec8ff]
  };

  let interiors=scene.getObjectByName?.('TGG_DESTINATION_INTERIORS_V145');
  if(!interiors){
    interiors=new THREE.Group();interiors.name='TGG_DESTINATION_INTERIORS_V145';
    Object.entries(anchors).forEach(([name,a])=>{
      const g=new THREE.Group();g.name='TGG_INTERIOR_'+name.toUpperCase()+'_V145';g.userData.tggDestinationV145=name;
      const shellMat=new THREE.MeshStandardMaterial({color:0x20262e,roughness:.72,metalness:.08});
      const floorMat=new THREE.MeshStandardMaterial({color:0x343b43,roughness:.88,metalness:.03});
      const glassMat=new THREE.MeshPhysicalMaterial({color:0x6d8fa8,roughness:.06,metalness:.08,transparent:true,opacity:.22,transmission:.18,depthWrite:false});
      const accentMat=new THREE.MeshBasicMaterial({color:a[2],transparent:true,opacity:.22,depthWrite:false});
      const floor=new THREE.Mesh(new THREE.BoxGeometry(15,.16,12),floorMat);floor.position.set(a[0],.08,a[1]-8);g.add(floor);
      const back=new THREE.Mesh(new THREE.BoxGeometry(15,5,.4),shellMat);back.position.set(a[0],2.5,a[1]-14);g.add(back);
      const sideL=new THREE.Mesh(new THREE.BoxGeometry(.4,5,12),shellMat);sideL.position.set(a[0]-7.3,2.5,a[1]-8);g.add(sideL);
      const sideR=sideL.clone();sideR.position.x=a[0]+7.3;g.add(sideR);
      const glass=new THREE.Mesh(new THREE.PlaneGeometry(12,4),glassMat);glass.position.set(a[0],2.4,a[1]-2.1);g.add(glass);
      const accent=new THREE.Mesh(new THREE.PlaneGeometry(10,2.6),accentMat);accent.position.set(a[0],2.4,a[1]-13.75);g.add(accent);
      g.visible=false;interiors.add(g);
    });
    scene.add(interiors);
  }

  let threshold=scene.getObjectByName?.('TGG_DESTINATION_THRESHOLD_LIGHTS_V145');
  if(!threshold&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(4.2,.08,.6);
    const mat=new THREE.MeshBasicMaterial({color:0xcdefff,transparent:true,opacity:.34,depthWrite:false});
    threshold=new THREE.InstancedMesh(geo,mat,36);threshold.name='TGG_DESTINATION_THRESHOLD_LIGHTS_V145';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    const list=Object.values(anchors);
    for(let i=0;i<36;i++){
      const a=list[i%list.length],row=Math.floor(i/list.length)-2.5;
      p.set(a[0]+row*3.2,.07,a[1]-1.6);q.identity();m.compose(p,q,s);threshold.setMatrixAt(i,m);
    }
    threshold.instanceMatrix.needsUpdate=true;scene.add(threshold);
  }

  let lastActive='';
  const apply=()=>{
    const active=String(root.dataset.tggDestinationActiveV136||root.dataset.tggNearestInteractionV123||'none').toLowerCase();
    const district=String(root.dataset.tggDistrict||'downtown').toLowerCase();
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const balanced=quality==='balanced';
    const key=anchors[active]?active:(anchors[district]?district:'none');

    if(key!==lastActive){
      lastActive=key;
      interiors.children.forEach(g=>{
        const match=g.userData?.tggDestinationV145===key;
        g.visible=match&&!balanced;
      });
      root.dataset.tggInteriorActiveV145=key;
    }

    if(threshold){
      threshold.visible=!balanced;
      threshold.material.opacity=root.dataset.tggTime==='night'?.5:.28;
    }

    root.dataset.tggDestinationInteriorCountV145='6';
    root.dataset.tggInteriorVisibilityModelV145='active-only';
    root.dataset.tggThresholdLightingV145=threshold?'36':'0';
    root.dataset.tggDestinationInteriorsV145='1';
  };

  window.TGGDestinationInteriorsV145={apply};
  apply();
}
function applyDestinationInteriorsV145(){window.TGGDestinationInteriorsV145?.apply?.()||installDestinationInteriorsV145()}

function installDestinationInteriorDetailV146(){
  if(window.TGGDestinationInteriorDetailV146)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggDestinationInteriorDetailV146='waiting';return}

  const anchors={
    studio:[-34,-42,0xff6b75],
    garage:[34,-42,0x73ddff],
    media:[0,30,0xc58cff],
    home:[-300,292,0xffd6a6],
    park:[245,312,0x91ffae],
    downtown:[0,-328,0x6bc7ff]
  };

  let furniture=scene.getObjectByName?.('TGG_INTERIOR_FURNITURE_V146');
  if(!furniture&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.8,.8,.8);
    const mat=new THREE.MeshStandardMaterial({color:0x343b44,roughness:.76,metalness:.08});
    furniture=new THREE.InstancedMesh(geo,mat,96);furniture.name='TGG_INTERIOR_FURNITURE_V146';
    const list=Object.values(anchors),m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const a=list[i%list.length],row=Math.floor(i/list.length),col=(row%4)-1.5,depth=Math.floor(row/4);
      p.set(a[0]+col*2.8,.45,a[1]-depth*2.4);
      q.setFromEuler(new THREE.Euler(0,(i%3)*.25,0));
      const sc=.78+(i%5)*.08;s.set(sc,.8+(i%4)*.08,sc);m.compose(p,q,s);furniture.setMatrixAt(i,m);
    }
    furniture.instanceMatrix.needsUpdate=true;scene.add(furniture);
  }

  let seating=scene.getObjectByName?.('TGG_PUBLIC_SEATING_V146');
  if(!seating&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.8,.34,.8);
    const mat=new THREE.MeshStandardMaterial({color:0x4b535c,roughness:.8,metalness:.22});
    seating=new THREE.InstancedMesh(geo,mat,48);seating.name='TGG_PUBLIC_SEATING_V146';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<48;i++){
      const a=(i/48)*Math.PI*2,r=72+(i%6)*18;
      p.set(Math.cos(a)*r,.28,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a,0));m.compose(p,q,s);seating.setMatrixAt(i,m);
    }
    seating.instanceMatrix.needsUpdate=true;scene.add(seating);
  }

  let crosswalks=scene.getObjectByName?.('TGG_CROSSWALK_DETAIL_V146');
  if(!crosswalks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.55,.025,5.2);
    const mat=new THREE.MeshBasicMaterial({color:0xe8e6dc});
    crosswalks=new THREE.InstancedMesh(geo,mat,96);crosswalks.name='TGG_CROSSWALK_DETAIL_V146';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const block=Math.floor(i/12),stripe=i%12,axis=block%2,side=block%4<2?-1:1,offset=(stripe-5.5)*.72;
      p.set(axis?side*18:offset,.055,axis?offset:side*18);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));m.compose(p,q,s);crosswalks.setMatrixAt(i,m);
    }
    crosswalks.instanceMatrix.needsUpdate=true;scene.add(crosswalks);
  }

  let parking=scene.getObjectByName?.('TGG_PARKING_EDGE_V146');
  if(!parking&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.12,.02,4.4);
    const mat=new THREE.MeshBasicMaterial({color:0xe5e3d8});
    parking=new THREE.InstancedMesh(geo,mat,84);parking.name='TGG_PARKING_EDGE_V146';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<84;i++){
      const side=i%4,step=Math.floor(i/4)-10;let x=0,z=0,r=0;
      if(side===0){x=-28;z=step*6.4;r=0}
      if(side===1){x=28;z=step*6.4;r=0}
      if(side===2){x=step*6.4;z=-28;r=Math.PI/2}
      if(side===3){x=step*6.4;z=28;r=Math.PI/2}
      p.set(x,.045,z);q.setFromEuler(new THREE.Euler(0,r,0));m.compose(p,q,s);parking.setMatrixAt(i,m);
    }
    parking.instanceMatrix.needsUpdate=true;scene.add(parking);
  }

  let lights=scene.getObjectByName?.('TGG_DESTINATION_AMBIENT_LIGHTS_V146');
  if(!lights){
    lights=new THREE.Group();lights.name='TGG_DESTINATION_AMBIENT_LIGHTS_V146';
    Object.entries(anchors).forEach(([name,a],idx)=>{
      for(let j=0;j<3;j++){
        const light=new THREE.PointLight(a[2],0,13,2);
        light.position.set(a[0]+(j-1)*3.8,2.8,a[1]-3-j*1.8);
        light.userData.tggDestinationV146=name;
        lights.add(light);
      }
    });
    scene.add(lights);
  }

  let lastSig='';
  const apply=()=>{
    const active=String(root.dataset.tggDestinationActiveV136||root.dataset.tggNearestInteractionV123||'none').toLowerCase();
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced',night=time==='night';
    const sig=[active,district,time,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(furniture)furniture.visible=active!=='none'&&!driving;
      if(seating)seating.visible=!driving&&!balanced;
      if(crosswalks)crosswalks.visible=true;
      if(parking)parking.visible=district!=='park';
      lights.children.forEach(l=>{
        const match=String(l.userData?.tggDestinationV146||'')===active;
        l.intensity=match&&!balanced?(night?1.15:.62):0;
      });
    }

    root.dataset.tggInteriorFurnitureV146=furniture?'96':'0';
    root.dataset.tggPublicSeatingV146=seating?'48':'0';
    root.dataset.tggCrosswalkDetailV146=crosswalks?'96':'0';
    root.dataset.tggParkingEdgeV146=parking?'84':'0';
    root.dataset.tggDestinationAmbientLightsV146=lights?'18':'0';
    root.dataset.tggDestinationInteriorDetailV146='1';
  };

  window.TGGDestinationInteriorDetailV146={apply};
  apply();
}
function applyDestinationInteriorDetailV146(){window.TGGDestinationInteriorDetailV146?.apply?.()||installDestinationInteriorDetailV146()}

function installNearFieldIlluminationV147(){
  if(window.TGGNearFieldIlluminationV147)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggNearFieldIlluminationV147='waiting';return}

  let ceiling=scene.getObjectByName?.('TGG_INTERIOR_CEILING_LIGHTS_V147');
  if(!ceiling&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(2.2,.38);
    const mat=new THREE.MeshBasicMaterial({color:0xffefcf,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide});
    ceiling=new THREE.InstancedMesh(geo,mat,48);ceiling.name='TGG_INTERIOR_CEILING_LIGHTS_V147';
    const anchors=[[-34,-42],[34,-42],[0,30],[-300,292],[245,312],[0,-328]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<48;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length),col=(row%4)-1.5,depth=Math.floor(row/4);
      p.set(a[0]+col*2.6,4.2,a[1]-depth*2.6);
      q.setFromEuler(new THREE.Euler(Math.PI/2,0,0));
      m.compose(p,q,s);ceiling.setMatrixAt(i,m);
    }
    ceiling.instanceMatrix.needsUpdate=true;scene.add(ceiling);
  }

  let sills=scene.getObjectByName?.('TGG_STOREFRONT_SILL_AO_V147');
  if(!sills&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(3.8,.04,.42);
    const mat=new THREE.MeshBasicMaterial({color:0x080b10,transparent:true,opacity:.16,depthWrite:false});
    sills=new THREE.InstancedMesh(geo,mat,96);sills.name='TGG_STOREFRONT_SILL_AO_V147';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const side=i%4,step=Math.floor(i/4)-12;let x=0,z=0,r=0;
      const d=84+(i%4)*7;
      if(side===0){x=-d;z=step*14;r=Math.PI/2}
      if(side===1){x=d;z=step*14;r=-Math.PI/2}
      if(side===2){x=step*14;z=-d;r=0}
      if(side===3){x=step*14;z=d;r=Math.PI}
      p.set(x,.055,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.78+(i%5)*.07;s.set(sc,1,1);m.compose(p,q,s);sills.setMatrixAt(i,m);
    }
    sills.instanceMatrix.needsUpdate=true;scene.add(sills);
  }

  let studs=scene.getObjectByName?.('TGG_LANE_REFLECTORS_V147');
  if(!studs&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.16,.055,.34);
    const mat=new THREE.MeshBasicMaterial({color:0xf4e7a8,transparent:true,opacity:.72});
    studs=new THREE.InstancedMesh(geo,mat,160);studs.name='TGG_LANE_REFLECTORS_V147';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<160;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-20;
      p.set(axis?step*8.5:side*3.8,.065,axis?side*3.8:step*8.5);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);studs.setMatrixAt(i,m);
    }
    studs.instanceMatrix.needsUpdate=true;scene.add(studs);
  }

  let lastSig='';
  const apply=()=>{
    const active=String(root.dataset.tggDestinationActiveV136||root.dataset.tggNearestInteractionV123||'none').toLowerCase();
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=time==='night',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[active,district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(ceiling){
        ceiling.visible=active!=='none'&&!balanced;
        ceiling.material.opacity=night?.34:.2;
      }
      if(sills){
        sills.visible=district!=='park'&&!balanced;
        sills.material.opacity=wet?.22:night?.2:.14;
      }
      if(studs){
        studs.visible=true;
        studs.material.opacity=night?.95:wet?.86:.56;
      }
    }

    const traffic=w.traffic||[];
    traffic.forEach((v,i)=>{
      if(!v?.userData)return;
      v.userData.tggTrafficIdentityV147=['economy','sport','utility','premium','service'][i%5];
      v.userData.tggTrafficReflectorProfileV147=night?'night':'day';
    });

    const avShadow=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
    if(avShadow?.material)avShadow.material.opacity=night?.38:wet?.32:.24;
    const carShadow=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
    if(carShadow?.material)carShadow.material.opacity=night?.4:wet?.35:.27;

    root.dataset.tggInteriorCeilingLightsV147=ceiling?'48':'0';
    root.dataset.tggStorefrontSillAOV147=sills?'96':'0';
    root.dataset.tggLaneReflectorsV147=studs?'160':'0';
    root.dataset.tggTrafficIdentityModelV147='5-class';
    root.dataset.tggContactShadowCohesionV147='1';
    root.dataset.tggNearFieldIlluminationV147='1';
  };

  window.TGGNearFieldIlluminationV147={apply};
  apply();
}
function applyNearFieldIlluminationV147(){window.TGGNearFieldIlluminationV147?.apply?.()||installNearFieldIlluminationV147()}

function installVisualConvergenceV148(){
  if(window.TGGVisualConvergenceV148)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggVisualConvergenceV148='waiting';return}

  const profiles={
    downtown:{exposure:1.08,fog:0x7b8999,far:4700,near:.06},
    studio:{exposure:1.1,fog:0x826f82,far:4550,near:.06},
    media:{exposure:1.11,fog:0x74849a,far:4650,near:.06},
    park:{exposure:1.04,fog:0x87968b,far:5000,near:.07},
    home:{exposure:1.05,fog:0x8e897d,far:4900,near:.07},
    garage:{exposure:1.07,fog:0x777f8a,far:4600,near:.06}
  };

  let key=scene.getObjectByName?.('TGG_CONVERGENCE_KEY_V148');
  if(!key){
    key=new THREE.DirectionalLight(0xffe0bb,0);
    key.name='TGG_CONVERGENCE_KEY_V148';key.position.set(-90,150,70);scene.add(key);
  }
  let fill=scene.getObjectByName?.('TGG_CONVERGENCE_FILL_V148');
  if(!fill){
    fill=new THREE.HemisphereLight(0x8ca6c0,0x2b2b28,0);
    fill.name='TGG_CONVERGENCE_FILL_V148';scene.add(fill);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const p=profiles[district]||profiles.downtown;
    const night=time==='night',gold=time==='golden',storm=/storm/.test(weather),rain=/rain/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      const weatherCut=storm?.12:rain?.05:0;
      const timeBoost=gold?.05:night?.01:0;
      if(w.renderer){
        w.renderer.toneMappingExposure=Math.max(.88,p.exposure+timeBoost-weatherCut);
        if('outputColorSpace'in w.renderer&&THREE.SRGBColorSpace)w.renderer.outputColorSpace=THREE.SRGBColorSpace;
      }
      if(scene.fog){
        scene.fog.color?.setHex?.(night?0x263241:storm?0x65717e:p.fog);
        const base=district==='park'?.00145:district==='home'?.00155:.00168;
        scene.fog.density=base+(storm?.00042:rain?.00024:0)+(night?.00008:0);
      }
      if(w.camera){
        w.camera.near=p.near;
        w.camera.far=Math.max(Number(w.camera.far||0),p.far);
        const baseFov=driving?76:62;
        const speed=Number(root.dataset.tggVisualSpeedV54||0);
        const target=baseFov+(driving?Math.min(8,speed*.16):0);
        w.camera.fov+=(target-w.camera.fov)*.15;
        w.camera.updateProjectionMatrix?.();
      }

      key.intensity=balanced?0:night?.22:storm?.72:gold?1.0:1.18;
      key.color.setHex(night?0x99b7dd:gold?0xffb971:0xffe0bb);
      fill.intensity=balanced?.34:night?.48:storm?.72:.84;
      fill.color.setHex(night?0x60758d:0x8ca6c0);
      fill.groundColor.setHex(district==='park'?0x27372c:district==='home'?0x38352f:0x2b2b28);

      const windows=scene.getObjectByName?.('TGG_WINDOW_REFLECTIONS_V83');
      if(windows?.material)windows.material.opacity=balanced?.1:night?.3:rain?.24:.17;
      const storefront=scene.getObjectByName?.('TGG_STOREFRONT_GLASS_DEPTH_V90');
      if(storefront?.material)storefront.material.opacity=balanced?.08:night?.26:rain?.22:.16;
      const clouds=scene.getObjectByName?.('TGG_CLOUD_DEPTH_V84');
      if(clouds)clouds.visible=!balanced;
      const skyline=scene.getObjectByName?.('TGG_SKYLINE_SILHOUETTES_V82');
      if(skyline)skyline.visible=!balanced||district==='downtown';
    }

    const car=w.car;
    if(car){
      car.traverse?.(o=>{
        if(!o?.isMesh||!o.material)return;
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{
          if(!m)return;
          if('envMapIntensity'in m)m.envMapIntensity=balanced?.75:(night?1.2:1.35);
        });
      });
    }

    const avShadow=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
    if(avShadow?.material)avShadow.material.opacity=night?.37:rain?.31:.24;
    const carShadow=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
    if(carShadow?.material)carShadow.material.opacity=night?.39:rain?.34:.27;

    root.dataset.tggConvergenceDistrictV148=district;
    root.dataset.tggConvergenceTimeV148=time;
    root.dataset.tggConvergenceWeatherV148=weather;
    root.dataset.tggConvergenceQualityV148=quality;
    root.dataset.tggConvergenceCameraFarV148=String(Math.round(w.camera?.far||0));
    root.dataset.tggConvergenceToneV148='district-time-weather';
    root.dataset.tggVisualConvergenceV148='1';
  };

  window.TGGVisualConvergenceV148={apply,profiles};
  apply();
}
function applyVisualConvergenceV148(){window.TGGVisualConvergenceV148?.apply?.()||installVisualConvergenceV148()}

function installWorldScaleContinuityV149(){
  if(window.TGGWorldScaleContinuityV149)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggWorldScaleContinuityV149='waiting';return}

  let haze=scene.getObjectByName?.('TGG_DISTANCE_HAZE_BANDS_V149');
  if(!haze){
    haze=new THREE.Group();haze.name='TGG_DISTANCE_HAZE_BANDS_V149';
    const mat=new THREE.MeshBasicMaterial({color:0x91a2b2,transparent:true,opacity:.035,depthWrite:false,side:THREE.DoubleSide});
    [760,1180,1680].forEach((r,i)=>{
      const ring=new THREE.Mesh(new THREE.RingGeometry(r,r+150+i*55,96),mat.clone());
      ring.rotation.x=-Math.PI/2;ring.position.y=.08+i*.02;ring.userData.tggBandV149=i;
      haze.add(ring);
    });
    scene.add(haze);
  }

  let speedCues=scene.getObjectByName?.('TGG_TRAVEL_SPEED_CUES_V149');
  if(!speedCues&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.18,.02,5.5);
    const mat=new THREE.MeshBasicMaterial({color:0xbfdcff,transparent:true,opacity:.08});
    speedCues=new THREE.InstancedMesh(geo,mat,120);speedCues.name='TGG_TRAVEL_SPEED_CUES_V149';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<120;i++){
      const lane=i%4,step=Math.floor(i/4)-15;
      p.set((lane-1.5)*5.5,.045,step*18);
      q.identity();m.compose(p,q,s);speedCues.setMatrixAt(i,m);
    }
    speedCues.instanceMatrix.needsUpdate=true;scene.add(speedCues);
  }

  let bridgeLight=scene.getObjectByName?.('TGG_TRANSITION_LIGHT_V149');
  if(!bridgeLight){
    bridgeLight=new THREE.HemisphereLight(0x9eb6cc,0x2d302c,.22);
    bridgeLight.name='TGG_TRANSITION_LIGHT_V149';scene.add(bridgeLight);
  }

  const profiles={
    downtown:[0x9eb6cc,0x2d3038],
    studio:[0xa88fb4,0x312633],
    media:[0x8fa9c4,0x27313e],
    park:[0x9fb89e,0x29352b],
    home:[0xb0aa9a,0x36342f],
    garage:[0x96a2af,0x2e3237]
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced';
    const sig=[district,weather,time,driving?'1':'0',quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      const [sky,ground]=profiles[district]||profiles.downtown;
      bridgeLight.color.setHex(night?0x647c98:sky);
      bridgeLight.groundColor.setHex(ground);
      bridgeLight.intensity=balanced?.12:night?.16:.24;

      haze.children.forEach((ring,i)=>{
        ring.visible=!balanced||i===0;
        ring.material.color.setHex(night?0x506070:wet?0x8e9baa:sky);
        ring.material.opacity=(night?.055:wet?.045:.032)*(i===0?1:1.15);
      });
    }

    if(speedCues){
      speedCues.visible=driving&&!balanced;
      speedCues.material.opacity=Math.min(.24,.05+speed*.0045);
      speedCues.position.z=(performance.now()*.01*(.6+speed*.04))%18;
    }

    const avShadow=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
    const carShadow=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
    const grounding=night?.34:wet?.3:.24;
    if(avShadow?.material)avShadow.material.opacity=grounding;
    if(carShadow?.material)carShadow.material.opacity=Math.min(.38,grounding+.03);

    if(w.camera){
      const targetFar=driving?5000:4700;
      if(Number(w.camera.far||0)<targetFar){
        w.camera.far=targetFar;w.camera.updateProjectionMatrix?.();
      }
    }

    root.dataset.tggDistanceHazeBandsV149='3';
    root.dataset.tggTravelSpeedCuesV149=speedCues?'120':'0';
    root.dataset.tggTransitionLightV149='1';
    root.dataset.tggWorldContinuityFarV149=driving?'5000':'4700';
    root.dataset.tggWorldScaleContinuityV149='1';
  };

  window.TGGWorldScaleContinuityV149={apply};
  apply();
}
function applyWorldScaleContinuityV149(){window.TGGWorldScaleContinuityV149?.apply?.()||installWorldScaleContinuityV149()}

function installWholeWorldMilestoneV150(){
  if(window.TGGWholeWorldMilestoneV150)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggWholeWorldMilestoneV150='waiting';return}

  let drainage=scene.getObjectByName?.('TGG_DRAINAGE_GRATES_V150');
  if(!drainage&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1.15,.035,.45);
    const mat=new THREE.MeshStandardMaterial({color:0x34393f,roughness:.78,metalness:.56});
    drainage=new THREE.InstancedMesh(geo,mat,72);drainage.name='TGG_DRAINAGE_GRATES_V150';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<72;i++){
      const side=i%4,step=Math.floor(i/4)-9;let x=0,z=0,r=0;
      if(side===0){x=-10.6;z=step*15;r=0}
      if(side===1){x=10.6;z=step*15;r=0}
      if(side===2){x=step*15;z=-10.6;r=Math.PI/2}
      if(side===3){x=step*15;z=10.6;r=Math.PI/2}
      p.set(x,.055,z);q.setFromEuler(new THREE.Euler(0,r,0));m.compose(p,q,s);drainage.setMatrixAt(i,m);
    }
    drainage.instanceMatrix.needsUpdate=true;scene.add(drainage);
  }

  let puddles=scene.getObjectByName?.('TGG_SURFACE_PUDDLES_V150');
  if(!puddles&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(1.7,16);
    const mat=new THREE.MeshPhysicalMaterial({color:0x526b7d,roughness:.04,metalness:.16,transparent:true,opacity:.16,depthWrite:false});
    puddles=new THREE.InstancedMesh(geo,mat,84);puddles.name='TGG_SURFACE_PUDDLES_V150';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const a=(i/84)*Math.PI*8,r=36+(i%10)*16;
      p.set(Math.cos(a)*r,.061,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.55+(i%6)*.13;s.set(sc,sc*.6,1);m.compose(p,q,s);puddles.setMatrixAt(i,m);
    }
    puddles.instanceMatrix.needsUpdate=true;scene.add(puddles);
  }

  let porch=scene.getObjectByName?.('TGG_NEIGHBORHOOD_PORCH_LIGHTS_V150');
  if(!porch&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.22,.22,.08);
    const mat=new THREE.MeshBasicMaterial({color:0xffd59a,transparent:true,opacity:.58});
    porch=new THREE.InstancedMesh(geo,mat,48);porch.name='TGG_NEIGHBORHOOD_PORCH_LIGHTS_V150';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<48;i++){
      const a=(i/48)*Math.PI*2,r=300+(i%4)*48;
      p.set(Math.cos(a)*r,3.1+(i%3)*.7,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));m.compose(p,q,s);porch.setMatrixAt(i,m);
    }
    porch.instanceMatrix.needsUpdate=true;scene.add(porch);
  }

  let arrival=scene.getObjectByName?.('TGG_DESTINATION_APPROACH_V150');
  if(!arrival&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.28,.04,4.2);
    const mat=new THREE.MeshBasicMaterial({color:0xbfe5ff,transparent:true,opacity:.22,depthWrite:false});
    arrival=new THREE.InstancedMesh(geo,mat,60);arrival.name='TGG_DESTINATION_APPROACH_V150';
    const anchors=[[0,-330],[-330,-100],[320,-45],[235,300],[-285,275],[0,410]];
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<60;i++){
      const a=anchors[i%anchors.length],row=Math.floor(i/anchors.length)-4.5;
      p.set(a[0]+row*5.2,.065,a[1]);q.identity();m.compose(p,q,s);arrival.setMatrixAt(i,m);
    }
    arrival.instanceMatrix.needsUpdate=true;scene.add(arrival);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced';
    const sig=[district,weather,time,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(drainage){
        drainage.visible=district!=='park'||driving;
        drainage.material.roughness=wet?.5:.78;
      }
      if(puddles){
        puddles.visible=wet&&!balanced;
        puddles.material.opacity=weather==='storm'?.25:.17;
      }
      if(porch){
        porch.visible=(night||time==='golden')&&(district==='home'||district==='park'||driving);
        porch.material.opacity=night?.72:.42;
      }
      if(arrival){
        arrival.visible=(night||wet||driving)&&!balanced;
        arrival.material.opacity=night?.34:wet?.28:.18;
      }
    }

    const continuity=Number(root.dataset.tggWorldScaleContinuityV149==='1');
    const convergence=Number(root.dataset.tggVisualConvergenceV148==='1');
    const interiors=Number(root.dataset.tggDestinationInteriorsV145==='1');
    const publicRealm=Number(root.dataset.tggPublicRealmV144==='1');
    const worldScore=continuity+convergence+interiors+publicRealm;

    root.dataset.tggDrainageGratesV150=drainage?'72':'0';
    root.dataset.tggSurfacePuddlesV150=puddles?'84':'0';
    root.dataset.tggNeighborhoodPorchLightsV150=porch?'48':'0';
    root.dataset.tggDestinationApproachV150=arrival?'60':'0';
    root.dataset.tggWholeWorldConvergenceScoreV150=String(worldScore);
    root.dataset.tggWholeWorldMilestoneV150=worldScore===4?'1':'partial';
  };

  window.TGGWholeWorldMilestoneV150={apply};
  apply();
}
function applyWholeWorldMilestoneV150(){window.TGGWholeWorldMilestoneV150?.apply?.()||installWholeWorldMilestoneV150()}

function installEnvironmentalContinuityV151(){
  if(window.TGGEnvironmentalContinuityV151)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggEnvironmentalContinuityV151='waiting';return}

  let windows=scene.getObjectByName?.('TGG_OCCUPIED_WINDOWS_V151');
  if(!windows&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.35,.72);
    const mat=new THREE.MeshBasicMaterial({color:0xffd9a2,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide});
    windows=new THREE.InstancedMesh(geo,mat,160);windows.name='TGG_OCCUPIED_WINDOWS_V151';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<160;i++){
      const a=(i/160)*Math.PI*2,r=165+(i%10)*34,level=i%8;
      p.set(Math.cos(a)*r,6+level*3.8,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      s.set(.8+(i%3)*.08,.82+(i%4)*.05,1);m.compose(p,q,s);windows.setMatrixAt(i,m);
    }
    windows.instanceMatrix.needsUpdate=true;scene.add(windows);
  }

  let sheen=scene.getObjectByName?.('TGG_TRAVEL_SHEEN_V151');
  if(!sheen&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(2.2,9);
    const mat=new THREE.MeshBasicMaterial({color:0x88b8d6,transparent:true,opacity:.05,depthWrite:false,side:THREE.DoubleSide});
    sheen=new THREE.InstancedMesh(geo,mat,96);sheen.name='TGG_TRAVEL_SHEEN_V151';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-12;
      p.set(axis?step*18:side*4.2,.067,axis?side*4.2:step*18);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,axis?Math.PI/2:0,0));
      m.compose(p,q,s);sheen.setMatrixAt(i,m);
    }
    sheen.instanceMatrix.needsUpdate=true;scene.add(sheen);
  }

  let wetness=0,last=performance.now();
  const windTargets=[];
  ['TGG_COUNTRYSIDE_TREES_V76','TGG_FOLIAGE_VARIETY_V83','TGG_CITY_COUNTRY_BLEND_V89'].forEach(name=>{
    const o=scene.getObjectByName?.(name);if(o)windTargets.push(o);
  });

  const apply=()=>{
    const now=performance.now(),dt=Math.min(.25,(now-last)/1000);last=now;
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const raining=/rain|storm/.test(weather),storm=/storm/.test(weather),night=time==='night';
    const target=raining?(storm?1:.78):0;
    wetness+= (target-wetness)*Math.min(1,dt*(raining?1.15:.18));

    if(sheen){
      sheen.visible=wetness>.08&&quality!=='balanced';
      sheen.material.opacity=.03+wetness*.14;
    }
    const puddles=scene.getObjectByName?.('TGG_SURFACE_PUDDLES_V150');
    if(puddles?.material){
      puddles.visible=wetness>.12;
      puddles.material.opacity=.04+wetness*.28;
    }

    if(windows){
      windows.visible=(night||time==='golden')&&quality!=='balanced';
      windows.material.opacity=night?.34:.18;
      windows.material.color.setHex(district==='studio'?0xffb07a:district==='media'?0xbfdfff:district==='home'?0xffd6a1:0xffd9a2);
    }

    const t=now*.001,wind=storm?.035:raining?.018:.009;
    windTargets.forEach((o,i)=>{
      o.rotation.z=Math.sin(t*.55+i*.8)*wind;
      o.rotation.x=Math.cos(t*.39+i)*wind*.35;
    });

    root.dataset.tggWeatherWetnessV151=wetness.toFixed(2);
    root.dataset.tggOccupiedWindowsV151=windows?'160':'0';
    root.dataset.tggTravelSheenV151=sheen?'96':'0';
    root.dataset.tggWindResponseV151=windTargets.length?'1':'0';
    root.dataset.tggEnvironmentalContinuityV151='1';
  };

  window.TGGEnvironmentalContinuityV151={apply,get wetness(){return wetness}};
  apply();
}
function applyEnvironmentalContinuityV151(){window.TGGEnvironmentalContinuityV151?.apply?.()||installEnvironmentalContinuityV151()}

function installWorldContinuityDirectorV152(){
  if(window.TGGWorldContinuityV152)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWorldContinuityDirectorV152='waiting';return}

  const groups={
    sky:['TGG_CLOUD_DEPTH_V84','TGG_DISTANCE_HAZE_BANDS_V149','TGG_DISTANT_TERRAIN_V84'],
    city:['TGG_SKYLINE_SILHOUETTES_V82','TGG_BUILDING_WINDOWS_V75','TGG_OCCUPIED_WINDOWS_V151','TGG_WINDOW_REFLECTIONS_V83'],
    street:['TGG_ROAD_MARKINGS_V82','TGG_STREET_RHYTHM_V82','TGG_STREET_CLUTTER_V84','TGG_CURB_MEDIAN_V90','TGG_DRAINAGE_GRATES_V150'],
    life:['TGG_PEDESTRIAN_POCKETS_V77','TGG_AMBIENT_LIFE_V76','TGG_TRAFFIC_LIGHTS_V83'],
    nature:['TGG_COUNTRYSIDE_TREES_V76','TGG_FOLIAGE_VARIETY_V83','TGG_CITY_COUNTRY_BLEND_V89','TGG_TERRAIN_COLOR_BREAKUP_V81'],
    destinations:['TGG_DISTRICT_LANDMARKS_V77','TGG_PREMIUM_FRONTAGE_V79','TGG_DESTINATION_APPROACH_V150','TGG_LANDMARK_APPROACH_LIGHTS_V89'],
    weather:['TGG_RAIN_PARTICLES_V78','TGG_SURFACE_PUDDLES_V150','TGG_TRAVEL_SHEEN_V151','TGG_STREET_REFLECTION_ACCENTS_V80']
  };

  const refs={};
  const resolve=(name)=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    const next=scene.getObjectByName?.(name)||null;
    refs[name]=next;
    return next;
  };
  const visible=(name,on)=>{
    const o=resolve(name);if(o)o.visible=!!on;
  };
  const setOpacity=(name,value)=>{
    const o=resolve(name);if(!o)return;
    const mats=o.material?[o.material]:[];
    o.traverse?.(x=>{if(x?.material)mats.push(x.material)});
    [...new Set(mats)].forEach(m=>{if(m&&'opacity'in m){m.opacity=value;m.transparent=value<.999}});
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0',Math.round(speed/10)].join('|');

    if(sig!==lastSig){
      lastSig=sig;

      // High-level density policy.
      const cityHeavy=district==='downtown'||district==='studio'||district==='media';
      const natureHeavy=district==='park'||district==='home';
      groups.city.forEach(n=>visible(n,!balanced||cityHeavy));
      groups.nature.forEach(n=>visible(n,!balanced||natureHeavy||driving));
      groups.street.forEach(n=>visible(n,!balanced||cityHeavy||driving));
      groups.life.forEach(n=>visible(n,!driving&&(!balanced||district==='downtown'||district==='studio')));
      groups.destinations.forEach(n=>visible(n,!balanced||!driving||speed<55));

      // Weather layer consolidation.
      visible('TGG_RAIN_PARTICLES_V78',wet&&!balanced);
      visible('TGG_SURFACE_PUDDLES_V150',wet&&!balanced);
      visible('TGG_TRAVEL_SHEEN_V151',wet&&!balanced);
      visible('TGG_STREET_REFLECTION_ACCENTS_V80',(wet||night)&&!balanced);

      // Time-of-day continuity.
      visible('TGG_OCCUPIED_WINDOWS_V151',(night||time==='golden')&&!balanced);
      visible('TGG_BUILDING_WINDOWS_V75',(night||time==='golden')&&!balanced);
      setOpacity('TGG_CLOUD_DEPTH_V84',night?.07:wet?.16:.11);
      setOpacity('TGG_DISTANCE_HAZE_BANDS_V149',night?.05:wet?.042:.03);

      // Speed-aware clutter reduction while traveling.
      const fast=driving&&speed>58;
      if(fast){
        visible('TGG_STREET_CLUTTER_V84',false);
        visible('TGG_PEDESTRIAN_POCKETS_V77',false);
        visible('TGG_SIDEWALK_VARIATION_V83',false);
      }else{
        visible('TGG_SIDEWALK_VARIATION_V83',!balanced||cityHeavy);
      }

      // Camera and fog converge here so later layers don't fight.
      if(w.camera){
        const far=driving?5200:4800;
        if(Number(w.camera.far||0)!==far){
          w.camera.far=far;
          w.camera.updateProjectionMatrix?.();
        }
      }
      if(scene.fog){
        const base=natureHeavy?.0015:cityHeavy?.0017:.0016;
        scene.fog.density=base+(wet?.00025:0)+(night?.0001:0);
      }

      root.dataset.tggContinuityDensityV152=balanced?'balanced':fast?'travel':'full';
      root.dataset.tggContinuityDistrictV152=district;
      root.dataset.tggContinuityWeatherV152=wet?'wet':'dry';
      root.dataset.tggContinuityTravelV152=fast?'fast':'normal';
    }

    root.dataset.tggContinuityGroupCountV152=String(Object.keys(groups).length);
    root.dataset.tggWorldContinuityDirectorV152='1';
  };

  window.TGGWorldContinuityV152={apply,groups:Object.keys(groups)};
  apply();
}
function applyWorldContinuityDirectorV152(){window.TGGWorldContinuityV152?.apply?.()||installWorldContinuityDirectorV152()}

function installWorldPresentationAuthorityV153(){
  if(window.TGGWorldPresentationV153)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWorldPresentationAuthorityV153='waiting';return}

  const groups={
    skyline:['TGG_SKYLINE_SILHOUETTES_V82','TGG_DISTANT_TERRAIN_V84','TGG_DISTANCE_HAZE_BANDS_V149','TGG_ROOFTOP_EQUIPMENT_V154'],
    street:['TGG_ROAD_MARKINGS_V82','TGG_SIDEWALK_VARIATION_V83','TGG_CURB_MEDIAN_V90','TGG_STREET_RHYTHM_V82','TGG_DRAINAGE_GRATES_V150','TGG_LANE_REFLECTORS_V154'],
    cityLife:['TGG_PEDESTRIAN_POCKETS_V77','TGG_AMBIENT_LIFE_V76','TGG_STREET_CLUTTER_V84','TGG_PUBLIC_BENCHES_V143','TGG_PARKING_METERS_V143','TGG_UTILITY_CLUTTER_V154'],
    destinations:['TGG_DISTRICT_LANDMARKS_V77','TGG_PREMIUM_FRONTAGE_V79','TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_DESTINATION_APPROACH_V150'],
    interiors:['TGG_INTERIOR_GLOW_DEPTH_V80','TGG_INTERIOR_CEILING_LIGHTS_V147','TGG_STORE_SILL_AO_V147'],
    nature:['TGG_COUNTRYSIDE_TREES_V76','TGG_FOLIAGE_VARIETY_V83','TGG_CITY_COUNTRY_BLEND_V89','TGG_TERRAIN_COLOR_BREAKUP_V81','TGG_PARK_WATER_V84'],
    weather:['TGG_RAIN_PARTICLES_V78','TGG_SURFACE_PUDDLES_V150','TGG_TRAVEL_SHEEN_V151','TGG_STREET_REFLECTION_ACCENTS_V80'],
    traffic:['TGG_TRAFFIC_LIGHTS_V83']
  };

  const refs={};
  const resolve=(name)=>{
    const r=refs[name];
    if(r?.parent)return r;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };
  const vis=(list,on)=>list.forEach(n=>{const o=resolve(n);if(o)o.visible=!!on});

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather);
    const city=/downtown|studio|media|garage/.test(district),nature=/park|home/.test(district);
    const fast=driving&&speed>58;
    const sig=[district,time,weather,quality,driving?'1':'0',fast?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;

      vis(groups.skyline,!balanced||driving||city);
      vis(groups.street,!balanced||driving||city);
      vis(groups.cityLife,!driving&&!fast&&(!balanced||city));
      vis(groups.destinations,!fast&&(!balanced||!driving));
      vis(groups.interiors,!driving&&!fast&&(night||time==='golden'||district==='studio'||district==='media'));
      vis(groups.nature,!balanced||nature||driving);
      vis(groups.weather,wet&&!balanced);
      vis(groups.traffic,!balanced||night||wet);

      const clouds=resolve('TGG_CLOUD_DEPTH_V84');
      if(clouds?.material)clouds.material.opacity=night?.07:wet?.16:.11;
      const haze=resolve('TGG_DISTANCE_HAZE_BANDS_V149');
      if(haze?.material)haze.material.opacity=night?.05:wet?.045:.03;

      if(w.camera){
        const targetFar=fast?5600:driving?5300:4900;
        if(Math.abs(Number(w.camera.far||0)-targetFar)>1){
          w.camera.far=targetFar;
          w.camera.updateProjectionMatrix?.();
        }
      }

      if(scene.fog){
        const districtBase=nature?.00148:city?.00168:.00158;
        scene.fog.density=districtBase+(wet?.00028:0)+(night?.0001:0)+(fast?-.00012:0);
      }

      root.dataset.tggPresentationDensityV153=balanced?'balanced':fast?'travel-lite':city?'city-rich':nature?'nature-rich':'standard';
      root.dataset.tggPresentationDistrictV153=district;
      root.dataset.tggPresentationTravelModeV153=fast?'fast':driving?'drive':'walk';
    }

    const avatar=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
    const vehicle=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
    if(avatar?.material)avatar.material.opacity=driving?0:(night?.36:wet?.31:.25);
    if(vehicle?.material)vehicle.material.opacity=driving?(night?.38:wet?.35:.29):.18;

    root.dataset.tggPresentationLayerGroupsV153=String(Object.keys(groups).length);
    root.dataset.tggFinalVisibilityAuthorityV153='1';
    root.dataset.tggWholeWorldPresentationV153='1';
    root.dataset.tggWorldPresentationAuthorityV153='1';
  };

  window.TGGWorldPresentationV153={apply};
  apply();
}
function applyWorldPresentationAuthorityV153(){window.TGGWorldPresentationV153?.apply?.()||installWorldPresentationAuthorityV153()}

function installSurfaceRealityV154(){
  if(window.TGGSurfaceRealityV154)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggSurfaceRealityV154='waiting';return}
  const scene=w.scene;

  let roofs=scene.getObjectByName?.('TGG_ROOFTOP_EQUIPMENT_V154');
  if(!roofs&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(2.4,1.1,1.8);
    const mat=new THREE.MeshStandardMaterial({color:0x4b535d,roughness:.72,metalness:.38});
    roofs=new THREE.InstancedMesh(geo,mat,72);roofs.name='TGG_ROOFTOP_EQUIPMENT_V154';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<72;i++){
      const a=(i/72)*Math.PI*2,r=115+(i%8)*36;
      p.set(Math.cos(a)*r,12+(i%6)*5.2,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a*.6,0));
      const sc=.7+(i%4)*.12;s.set(sc,.8+(i%3)*.1,sc);m.compose(p,q,s);roofs.setMatrixAt(i,m);
    }
    roofs.instanceMatrix.needsUpdate=true;scene.add(roofs);
  }

  let reflectors=scene.getObjectByName?.('TGG_LANE_REFLECTORS_V154');
  if(!reflectors&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.22,.035,.48);
    const mat=new THREE.MeshBasicMaterial({color:0xfff1b0});
    reflectors=new THREE.InstancedMesh(geo,mat,160);reflectors.name='TGG_LANE_REFLECTORS_V154';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<160;i++){
      const axis=i%2,step=Math.floor(i/2)-40;
      p.set(axis?step*7.5:0,.06,axis?0:step*7.5);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));m.compose(p,q,s);reflectors.setMatrixAt(i,m);
    }
    reflectors.instanceMatrix.needsUpdate=true;scene.add(reflectors);
  }

  let utilities=scene.getObjectByName?.('TGG_UTILITY_CLUTTER_V154');
  if(!utilities&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.9,1.25,.65);
    const mat=new THREE.MeshStandardMaterial({color:0x3e464f,roughness:.84,metalness:.24});
    utilities=new THREE.InstancedMesh(geo,mat,88);utilities.name='TGG_UTILITY_CLUTTER_V154';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<88;i++){
      const a=(i/88)*Math.PI*2,r=72+(i%11)*14;
      p.set(Math.cos(a)*r,.63,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,a+(i%3)*.22,0));
      const sc=.72+(i%5)*.08;s.set(sc,.78+(i%4)*.08,sc);m.compose(p,q,s);utilities.setMatrixAt(i,m);
    }
    utilities.instanceMatrix.needsUpdate=true;scene.add(utilities);
  }

  let wind=scene.getObjectByName?.('TGG_FOLIAGE_WIND_V154');
  if(!wind){
    wind=new THREE.Group();wind.name='TGG_FOLIAGE_WIND_V154';scene.add(wind);
  }

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const balanced=quality==='balanced',night=time==='night',wet=/rain|storm/.test(weather),fast=driving&&speed>58;
    const city=/downtown|studio|media|garage/.test(district);
    const sig=[district,time,weather,quality,driving?'1':'0',fast?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(roofs)roofs.visible=!balanced&&city&&!fast;
      if(reflectors){
        reflectors.visible=(night||wet||driving)&&!balanced;
        reflectors.material.color.setHex(wet?0xc7ecff:0xfff1b0);
      }
      if(utilities)utilities.visible=!balanced&&city&&!fast;
    }

    const foliage=scene.getObjectByName?.('TGG_FOLIAGE_VARIETY_V83');
    if(foliage){
      const t=performance.now()*.001;
      foliage.rotation.y=Math.sin(t*.18)*.006;
      foliage.rotation.z=Math.sin(t*.31)*.004;
      root.dataset.tggFoliageWindV154='1';
    }else root.dataset.tggFoliageWindV154='0';

    root.dataset.tggRooftopEquipmentV154=roofs?'72':'0';
    root.dataset.tggLaneReflectorsV154=reflectors?'160':'0';
    root.dataset.tggUtilityClutterV154=utilities?'88':'0';
    root.dataset.tggSurfaceRealityModeV154=balanced?'balanced':fast?'travel-lite':'full';
    root.dataset.tggSurfaceRealityV154='1';
  };

  window.TGGSurfaceRealityV154={apply};
  apply();
}
function applySurfaceRealityV154(){window.TGGSurfaceRealityV154?.apply?.()||installSurfaceRealityV154()}

function installMaterialConvergenceV155(){
  if(window.TGGMaterialConvergenceV155)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggMaterialConvergenceV155='waiting';return}

  const named=[
    'TGG_FACADE_VARIATION_V78','TGG_SIDEWALK_VARIATION_V83','TGG_CURB_MEDIAN_V90',
    'TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_WINDOW_REFLECTIONS_V83','TGG_PREMIUM_FRONTAGE_V79',
    'TGG_ROOFTOP_EQUIPMENT_V154','TGG_UTILITY_CLUTTER_V154','TGG_OVERPASS_BRIDGES_V88',
    'TGG_BRIDGE_RAILS_V88','TGG_ALLEY_DEPTH_V88','TGG_PUBLIC_BENCHES_V143',
    'TGG_PARKING_METERS_V143','TGG_DRAINAGE_GRATES_V150'
  ];
  const refs={};
  const resolve=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };
  const matsOf=o=>{
    if(!o)return [];
    const mats=[];
    if(o.material)mats.push(...(Array.isArray(o.material)?o.material:[o.material]));
    o.traverse?.(x=>{if(x!==o&&x?.material)mats.push(...(Array.isArray(x.material)?x.material:[x.material]))});
    return [...new Set(mats)].filter(Boolean);
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced',fast=driving&&speed>58;
    const city=/downtown|studio|media|garage/.test(district);
    const sig=[district,weather,time,quality,driving?'1':'0',fast?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;

      named.forEach(name=>{
        const o=resolve(name);if(!o)return;
        const glass=/GLASS|WINDOW|PREMIUM_FRONTAGE/.test(name);
        const metal=/ROOFTOP|UTILITY|BRIDGE_RAILS|PARKING_METERS|DRAINAGE/.test(name);
        const ground=/SIDEWALK|CURB|ALLEY|OVERPASS/.test(name);

        matsOf(o).forEach(m=>{
          if('roughness'in m){
            let r=Number(m.roughness??.7);
            if(glass)r=wet?.035:.075;
            else if(metal)r=wet?.34:.56;
            else if(ground)r=wet?.5:.9;
            else r=wet?.52:.78;
            m.roughness=Math.max(.03,Math.min(.96,r));
          }
          if('metalness'in m){
            let v=Number(m.metalness??0);
            if(glass)v=Math.min(v,.14);
            else if(metal)v=Math.max(.28,Math.min(.62,v||.38));
            else if(ground)v=Math.min(v,.12);
            else v=Math.min(v,.22);
            m.metalness=v;
          }
          if('envMapIntensity'in m){
            const target=glass?(wet?1.35:1.05):metal?(wet?1.08:.78):wet?.72:.42;
            m.envMapIntensity=balanced?Math.min(target,.72):target;
          }
          if('opacity'in m&&m.transparent&&glass){
            m.opacity=night?.28:wet?.24:.18;
          }
          m.needsUpdate=true;
        });
      });

      const car=w.car;
      car?.traverse?.(o=>{
        if(!o?.isMesh||!o.material)return;
        const n=String(o.name||'').toLowerCase();
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{
          if(!m)return;
          if('envMapIntensity'in m){
            const glass=/glass|window|windshield/.test(n),metal=/chrome|rim|trim|wheel/.test(n);
            const target=glass?1.3:metal?1.42:1.18;
            m.envMapIntensity=balanced?Math.min(target,.9):target;
          }
          if('roughness'in m&&!/glass|window|windshield/.test(n)){
            m.roughness=Math.max(.14,Math.min(.48,Number(m.roughness??.32)));
          }
          m.needsUpdate=true;
        });
      });

      const avatar=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
      const vehicle=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
      if(avatar?.material)avatar.material.opacity=driving?0:(night?.34:wet?.3:.24);
      if(vehicle?.material)vehicle.material.opacity=driving?(night?.36:wet?.33:.27):.16;

      root.dataset.tggMaterialTravelModeV155=fast?'travel-lite':driving?'drive':'walk';
      root.dataset.tggMaterialDistrictV155=district;
      root.dataset.tggMaterialWeatherV155=wet?'wet':'dry';
    }

    root.dataset.tggMaterialGroupsV155=String(named.length);
    root.dataset.tggReflectionDisciplineV155='capped';
    root.dataset.tggSurfaceAgingV155=city?'urban':'natural';
    root.dataset.tggNearFieldMaterialAuthorityV155='1';
    root.dataset.tggMaterialConvergenceV155='1';
  };

  window.TGGMaterialConvergenceV155={apply};
  apply();
}
function applyMaterialConvergenceV155(){window.TGGMaterialConvergenceV155?.apply?.()||installMaterialConvergenceV155()}

function installSurfaceAgingV156(){
  if(window.TGGSurfaceAgingV156)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggSurfaceAgingV156='waiting';return}
  const scene=w.scene;

  const makeInstanced=(name,geo,mat,count,placer)=>{
    let o=scene.getObjectByName?.(name);
    if(o||!THREE.InstancedMesh)return o;
    o=new THREE.InstancedMesh(geo,mat,count);o.name=name;
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<count;i++){placer(i,p,q,s);m.compose(p,q,s);o.setMatrixAt(i,m)}
    o.instanceMatrix.needsUpdate=true;scene.add(o);return o;
  };

  const roadPatches=makeInstanced(
    'TGG_ROAD_PATCHES_V156',
    new THREE.PlaneGeometry(2.8,1.25),
    new THREE.MeshBasicMaterial({color:0x1f2328,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}),
    120,
    (i,p,q,s)=>{
      const axis=i%2,step=Math.floor(i/2)-30,lane=(i%6<3?-1:1)*(2.2+(i%3)*1.1);
      p.set(axis?step*9:lane,.066,axis?lane:step*9);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,axis?Math.PI/2:0));
      const sc=.65+(i%5)*.12;s.set(sc,.7+(i%4)*.1,1);
    }
  );

  const curbWear=makeInstanced(
    'TGG_CURB_WEAR_V156',
    new THREE.BoxGeometry(2.1,.03,.22),
    new THREE.MeshBasicMaterial({color:0x34383d,transparent:true,opacity:.2,depthWrite:false}),
    96,
    (i,p,q,s)=>{
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-12;
      p.set(axis?step*8.4:side*9.75,.235,axis?side*9.75:step*8.4);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));s.set(1,1,1);
    }
  );

  const wallGrime=makeInstanced(
    'TGG_WALL_GRIME_V156',
    new THREE.PlaneGeometry(3.4,1.1),
    new THREE.MeshBasicMaterial({color:0x24282d,transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide}),
    72,
    (i,p,q,s)=>{
      const side=i%4,step=Math.floor(i/4)-9,d=86+(i%4)*10;let x=0,z=0,r=0;
      if(side===0){x=-d;z=step*16;r=Math.PI/2}
      if(side===1){x=d;z=step*16;r=-Math.PI/2}
      if(side===2){x=step*16;z=-d;r=0}
      if(side===3){x=step*16;z=d;r=Math.PI}
      p.set(x,.68+(i%3)*.22,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.75+(i%5)*.08;s.set(sc,.72+(i%4)*.08,1);
    }
  );

  const tireMarks=makeInstanced(
    'TGG_TIRE_MARKS_V156',
    new THREE.PlaneGeometry(.34,5.4),
    new THREE.MeshBasicMaterial({color:0x111418,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide}),
    64,
    (i,p,q,s)=>{
      const a=(i/64)*Math.PI*2,r=34+(i%8)*16;
      p.set(Math.cos(a)*r,.071,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a+(i%3)*.18));
      s.set(.8+(i%4)*.08,.8+(i%5)*.06,1);
    }
  );

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced',fast=driving&&speed>58;
    const city=/downtown|studio|media|garage/.test(district);
    const sig=[district,weather,time,quality,driving?'1':'0',fast?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(roadPatches){
        roadPatches.visible=!balanced&&!fast;
        roadPatches.material.opacity=wet?.22:night?.32:.27;
      }
      if(curbWear){
        curbWear.visible=!balanced&&city&&!fast;
        curbWear.material.opacity=wet?.16:.22;
      }
      if(wallGrime){
        wallGrime.visible=!balanced&&city&&!fast;
        wallGrime.material.opacity=wet?.09:night?.15:.12;
      }
      if(tireMarks){
        tireMarks.visible=!balanced&&(district==='downtown'||district==='garage'||driving)&&!fast;
        tireMarks.material.opacity=wet?.1:.17;
      }
    }

    root.dataset.tggRoadPatchesV156=roadPatches?'120':'0';
    root.dataset.tggCurbWearV156=curbWear?'96':'0';
    root.dataset.tggWallGrimeV156=wallGrime?'72':'0';
    root.dataset.tggTireMarksV156=tireMarks?'64':'0';
    root.dataset.tggSurfaceAgingModeV156=balanced?'balanced':fast?'travel-lite':city?'urban-aged':'light-aged';
    root.dataset.tggSurfaceHistoryV156='1';
    root.dataset.tggSurfaceAgingV156='1';
  };

  window.TGGSurfaceAgingV156={apply};
  apply();
}
function applySurfaceAgingV156(){window.TGGSurfaceAgingV156?.apply?.()||installSurfaceAgingV156()}

function installEnvironmentalWeatheringV157(){
  if(window.TGGEnvironmentalWeatheringV157)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggEnvironmentalWeatheringV157='waiting';return}
  const scene=w.scene;

  let puddles=scene.getObjectByName?.('TGG_WEATHERING_PUDDLES_V157');
  if(!puddles&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(1.6,14);
    const mat=new THREE.MeshPhysicalMaterial({color:0x4b6170,roughness:.08,metalness:.08,transparent:true,opacity:.18,transmission:.08,depthWrite:false});
    puddles=new THREE.InstancedMesh(geo,mat,64);puddles.name='TGG_WEATHERING_PUDDLES_V157';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<64;i++){
      const a=(i/64)*Math.PI*4,r=38+(i%10)*22;
      p.set(Math.cos(a)*r,.035,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a));
      const sc=.55+(i%5)*.18;s.set(sc,sc*.62,1);m.compose(p,q,s);puddles.setMatrixAt(i,m);
    }
    puddles.instanceMatrix.needsUpdate=true;scene.add(puddles);
  }

  let grime=scene.getObjectByName?.('TGG_SURFACE_GRIME_V157');
  if(!grime&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(2.8,1.1);
    const mat=new THREE.MeshBasicMaterial({color:0x25282b,transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide});
    grime=new THREE.InstancedMesh(geo,mat,96);grime.name='TGG_SURFACE_GRIME_V157';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const side=i%4,step=Math.floor(i/4)-12,d=70+(i%4)*16;let x=0,z=0,r=0;
      if(side===0){x=-d;z=step*14;r=Math.PI/2}
      if(side===1){x=d;z=step*14;r=-Math.PI/2}
      if(side===2){x=step*14;z=-d;r=0}
      if(side===3){x=step*14;z=d;r=Math.PI}
      p.set(x,1.15+(i%3)*.25,z);q.setFromEuler(new THREE.Euler(0,r,0));
      const sc=.7+(i%4)*.1;s.set(sc,.8+(i%3)*.08,1);m.compose(p,q,s);grime.setMatrixAt(i,m);
    }
    grime.instanceMatrix.needsUpdate=true;scene.add(grime);
  }

  const materialTargets=[];
  let lastScan=0,lastSig='',carStamp='';
  const scanMaterials=()=>{
    const now=performance.now();if(materialTargets.length&&now-lastScan<10000)return;
    lastScan=now;materialTargets.length=0;
    const names=[
      'TGG_FACADE_VARIATION_V78','TGG_SIDEWALK_VARIATION_V83','TGG_CURB_MEDIAN_V90',
      'TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_PUBLIC_REALM_V144','TGG_SURFACE_REALITY_V154'
    ];
    names.forEach(name=>{
      const o=scene.getObjectByName?.(name);
      o?.traverse?.(n=>{
        if(!n?.material)return;
        const mats=Array.isArray(n.material)?n.material:[n.material];
        mats.forEach(m=>{if(m&&('roughness'in m)&&!materialTargets.includes(m))materialTargets.push(m)});
      });
      if(o?.material){
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{if(m&&('roughness'in m)&&!materialTargets.includes(m))materialTargets.push(m)});
      }
    });
  };

  const weatherCar=()=>{
    if(!w.car)return;
    const sig=String(root.dataset.tggWeather||'clear')+'|'+String(root.dataset.tggTime||'day');
    if(sig===carStamp)return;carStamp=sig;
    const wet=/rain|storm/.test(root.dataset.tggWeather||'');
    w.car.traverse?.(o=>{
      if(!o?.isMesh||!o.material)return;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>{
        if(!m||!('roughness'in m))return;
        const n=String(o.name||'').toLowerCase();
        if(/glass|window/.test(n)){
          m.roughness=wet?.035:.08;
          if('envMapIntensity'in m)m.envMapIntensity=wet?1.7:1.35;
        }else if(!/wheel|tire/.test(n)){
          m.roughness=wet?Math.max(.12,Number(m.roughness||.3)*.72):Math.min(.42,Math.max(.18,Number(m.roughness||.3)));
          if('envMapIntensity'in m)m.envMapIntensity=wet?1.6:1.25;
        }
        m.needsUpdate=true;
      });
    });
  };

  const apply=()=>{
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const wet=/rain|storm/.test(weather),storm=/storm/.test(weather),night=time==='night',balanced=quality==='balanced';
    const sig=[weather,time,district,quality].join('|');

    if(sig!==lastSig){
      lastSig=sig;scanMaterials();
      if(puddles){
        puddles.visible=wet&&!balanced;
        puddles.material.opacity=storm?.28:wet?.2:.08;
        puddles.material.roughness=storm?.04:.08;
      }
      if(grime){
        grime.visible=!balanced&&district!=='park';
        grime.material.opacity=wet?.07:night?.12:.1;
      }
      materialTargets.forEach(m=>{
        const base=Number(m.userData?.tggBaseRoughnessV157??m.roughness??.7);
        if(!m.userData)m.userData={};
        if(m.userData.tggBaseRoughnessV157===undefined)m.userData.tggBaseRoughnessV157=base;
        m.roughness=wet?Math.max(.16,base*.68):base;
        if('envMapIntensity'in m)m.envMapIntensity=wet?1.18:.72;
        m.needsUpdate=true;
      });
    }

    weatherCar();

    root.dataset.tggWeatheringPuddlesV157=puddles?'64':'0';
    root.dataset.tggSurfaceGrimeV157=grime?'96':'0';
    root.dataset.tggWeatheredMaterialTargetsV157=String(materialTargets.length);
    root.dataset.tggVehicleWeatherResponseV157=w.car?'1':'waiting';
    root.dataset.tggEnvironmentalWeatheringV157='1';
  };

  window.TGGEnvironmentalWeatheringV157={apply};
  apply();
}
function applyEnvironmentalWeatheringV157(){window.TGGEnvironmentalWeatheringV157?.apply?.()||installEnvironmentalWeatheringV157()}

function installEnvironmentalConvergenceV158(){
  if(window.TGGEnvironmentalConvergenceV158)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggEnvironmentalConvergenceV158='waiting';return}

  const refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };

  const groups={
    wear:['TGG_ROAD_PATCHES_V156','TGG_CURB_WEAR_V156','TGG_WALL_GRIME_V156','TGG_TIRE_MARKS_V156','TGG_SURFACE_GRIME_V157'],
    wet:['TGG_WEATHERING_PUDDLES_V157','TGG_PUDDLE_DRAIN_ACCENTS_V87','TGG_STREET_REFLECTION_ACCENTS_V80'],
    glass:['TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_WINDOW_REFLECTIONS_V83'],
    clutter:['TGG_STREET_CLUTTER_V84','TGG_UTILITY_CLUTTER_V154','TGG_STREET_FURNITURE_V86','TGG_STREET_RHYTHM_V82'],
    nature:['TGG_FOLIAGE_VARIETY_V83','TGG_CITY_COUNTRY_BLEND_V89','TGG_TERRAIN_PROPS_V90']
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced',fast=driving&&speed>58;
    const city=/downtown|studio|media|garage/.test(district);
    const nature=/park|home/.test(district);
    const sig=[district,weather,time,quality,driving?'1':'0',fast?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;

      groups.wear.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        o.visible=!balanced&&!fast&&(city||driving);
        if(o.material&&'opacity'in o.material&&o.material.transparent){
          o.material.opacity=wet?Math.max(.08,.18-i*.015):night?Math.max(.1,.24-i*.018):Math.max(.08,.2-i*.016);
        }
      });

      groups.wet.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        o.visible=wet&&!balanced&&!fast;
        if(o.material&&'opacity'in o.material)o.material.opacity=Math.max(.12,.28-i*.045);
      });

      groups.glass.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        o.visible=!balanced&&!fast&&district!=='park';
        if(o.material){
          if('roughness'in o.material)o.material.roughness=wet?.035:.075;
          if('opacity'in o.material)o.material.opacity=night?.28:wet?.24:.17;
        }
      });

      groups.clutter.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        const keep=!balanced&&!fast&&city&&(i<2||district==='downtown');
        o.visible=keep;
      });

      groups.nature.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        o.visible=!balanced&&(nature||driving);
        if(o.material&&'opacity'in o.material&&o.material.transparent)o.material.opacity=night?.16:.24;
      });

      if(scene.fog){
        const base=nature?.00152:city?.00172:.00162;
        scene.fog.density=base+(wet?.00028:0)+(night?.0001:0);
      }

      root.dataset.tggEnvironmentalDensityV158=balanced?'reduced':fast?'speed-reduced':city?'urban-rich':nature?'nature-rich':'balanced-world';
      root.dataset.tggEnvironmentalWetStackV158=wet?'active':'dry';
      root.dataset.tggEnvironmentalClutterPolicyV158='coordinated';
    }

    root.dataset.tggEnvironmentalConvergenceV158='1';
  };

  window.TGGEnvironmentalConvergenceV158={apply};
  apply();
}
function applyEnvironmentalConvergenceV158(){window.TGGEnvironmentalConvergenceV158?.apply?.()||installEnvironmentalConvergenceV158()}

function installEnvironmentalPresentationAuthorityV159(){
  if(window.TGGEnvironmentalPresentationV159)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggEnvironmentalPresentationAuthorityV159='waiting';return}

  const refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };

  const groups={
    wet:['TGG_WEATHERING_PUDDLES_V157','TGG_SURFACE_PUDDLES_V150','TGG_PUDDLE_DRAIN_ACCENTS_V87','TGG_STREET_REFLECTION_ACCENTS_V80'],
    wear:['TGG_ROAD_PATCHES_V156','TGG_CURB_WEAR_V156','TGG_WALL_GRIME_V156','TGG_TIRE_MARKS_V156','TGG_SURFACE_GRIME_V157'],
    glass:['TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_WINDOW_REFLECTIONS_V83'],
    clutter:['TGG_STREET_CLUTTER_V84','TGG_UTILITY_CLUTTER_V154','TGG_PUBLIC_BINS_V144','TGG_UTILITY_CABINETS_V144','TGG_STREET_FURNITURE_V139'],
    nature:['TGG_FOLIAGE_VARIETY_V83','TGG_CITY_COUNTRY_BLEND_V89','TGG_TERRAIN_PROPS_V90','TGG_STREET_TREES_V144']
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced',fast=driving&&speed>62;
    const city=/downtown|studio|media|garage/.test(district),nature=/park|home/.test(district);
    const density=balanced?'reduced':fast?'travel':city?'urban-rich':nature?'nature-rich':'full';
    const sig=[district,weather,time,quality,driving?'1':'0',fast?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;

      groups.wet.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        o.visible=wet&&!balanced&&!fast;
        if(o.material&&'opacity'in o.material)o.material.opacity=Math.max(.1,.3-i*.045);
      });

      groups.wear.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        o.visible=!balanced&&!fast&&(city||driving);
        if(o.material&&'opacity'in o.material&&o.material.transparent)
          o.material.opacity=wet?Math.max(.07,.17-i*.014):night?Math.max(.09,.22-i*.016):Math.max(.07,.19-i*.015);
      });

      groups.glass.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        o.visible=!balanced&&!fast&&district!=='park';
        if(o.material){
          if('roughness'in o.material)o.material.roughness=wet?.03:.07;
          if('opacity'in o.material)o.material.opacity=night?.3:wet?.25:.17;
        }
      });

      groups.clutter.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        o.visible=!balanced&&!fast&&city&&(district==='downtown'||i<2);
      });

      groups.nature.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        o.visible=!balanced&&(nature||driving);
        if(o.material&&'opacity'in o.material&&o.material.transparent)o.material.opacity=night?.15:.23;
      });

      if(scene.fog){
        const base=nature?.0015:city?.0017:.0016;
        scene.fog.density=base+(wet?.00026:0)+(night?.0001:0)+(fast?-.00012:0);
      }
    }

    root.dataset.tggEnvironmentalPresentationAuthorityV159='1';
    root.dataset.tggEnvironmentalPresentationDensityV159=density;
    root.dataset.tggEnvironmentalWetAuthorityV159=wet?'active':'dry';
    root.dataset.tggEnvironmentalGlassPolicyV159=balanced||fast?'reduced':'full';
    root.dataset.tggEnvironmentalNaturePolicyV159=nature||driving?'enabled':'limited';
    root.dataset.tggEnvironmentalFinalOwnerV159='presentation-authority';
  };

  window.TGGEnvironmentalPresentationV159={apply};
  apply();
}
function applyEnvironmentalPresentationAuthorityV159(){window.TGGEnvironmentalPresentationV159?.apply?.()||installEnvironmentalPresentationAuthorityV159()}

function installWorldTransitionSmoothingV160(){
  if(window.TGGWorldTransitionV160)return;
  const w=window.TGG3D,scene=w?.scene,renderer=w?.renderer;
  if(!scene){root.dataset.tggWorldTransitionSmoothingV160='waiting';return}

  const target={
    fog:scene.fog?.density||.0017,
    exposure:Number(renderer?.toneMappingExposure||1.08),
    wet:0,
    nature:0,
    city:1
  };
  const current={...target};
  let raf=0,last=performance.now(),lastStateSig='';

  const sampleTargets=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const wet=/rain|storm/.test(weather),night=time==='night',gold=time==='golden';
    const nature=/park|home/.test(district),city=/downtown|studio|media|garage/.test(district);
    const balanced=quality==='balanced',fast=driving&&speed>62;

    target.fog=(nature?.0015:city?.0017:.0016)+(wet?.00026:0)+(night?.0001:0)+(fast?-.00012:0);
    target.exposure=
      night?1.04:
      gold?1.14:
      weather==='storm'?1.0:
      wet?1.05:
      district==='studio'||district==='media'?1.1:1.08;
    target.wet=wet?1:0;
    target.nature=nature?1:driving?.35:0;
    target.city=city?1:.25;

    const sig=[district,weather,time,quality,driving?'1':'0',fast?'1':'0'].join('|');
    if(sig!==lastStateSig){
      lastStateSig=sig;
      root.dataset.tggWorldTransitionTargetV160=sig;
    }
  };

  const frame=now=>{
    const dt=Math.min(.05,Math.max(.001,(now-last)/1000));last=now;
    const k=1-Math.exp(-dt*4.2);
    current.fog+=(target.fog-current.fog)*k;
    current.exposure+=(target.exposure-current.exposure)*k;
    current.wet+=(target.wet-current.wet)*k;
    current.nature+=(target.nature-current.nature)*k;
    current.city+=(target.city-current.city)*k;

    if(scene.fog)scene.fog.density=current.fog;
    if(renderer)renderer.toneMappingExposure=current.exposure;

    root.dataset.tggWorldBlendFogV160=current.fog.toFixed(5);
    root.dataset.tggWorldBlendExposureV160=current.exposure.toFixed(3);
    root.dataset.tggWorldBlendWetV160=current.wet.toFixed(2);
    root.dataset.tggWorldBlendNatureV160=current.nature.toFixed(2);
    root.dataset.tggWorldBlendCityV160=current.city.toFixed(2);
    raf=requestAnimationFrame(frame);
  };

  const apply=()=>{
    sampleTargets();
    root.dataset.tggWorldTransitionSmoothingV160='1';
    root.dataset.tggWorldTransitionModeV160='raf-exponential';
    root.dataset.tggWorldTransitionOwnerV160='final-presentation-smoothing';
    if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}
  };

  window.TGGWorldTransitionV160={apply,sampleTargets,get target(){return {...target}},get current(){return {...current}}};
  apply();
}
function applyWorldTransitionSmoothingV160(){window.TGGWorldTransitionV160?.apply?.()||installWorldTransitionSmoothingV160()}

function installSurfaceTransitionSmoothingV161(){
  if(window.TGGSurfaceTransitionV161)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggSurfaceTransitionSmoothingV161='waiting';return}

  const refs={};
  const get=name=>{
    const cur=refs[name];
    if(cur?.parent)return cur;
    refs[name]=scene.getObjectByName?.(name)||null;
    return refs[name];
  };

  const channels=[
    {key:'wet',names:['TGG_WEATHERING_PUDDLES_V157','TGG_SURFACE_PUDDLES_V150','TGG_STREET_REFLECTION_ACCENTS_V80'],base:.26},
    {key:'glass',names:['TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_WINDOW_REFLECTIONS_V83'],base:.22},
    {key:'nature',names:['TGG_FOLIAGE_VARIETY_V83','TGG_CITY_COUNTRY_BLEND_V89','TGG_TERRAIN_PROPS_V90'],base:.2},
    {key:'clutter',names:['TGG_STREET_CLUTTER_V84','TGG_UTILITY_CLUTTER_V154','TGG_STREET_FURNITURE_V139'],base:1}
  ];

  const target={wet:0,glass:1,nature:0,clutter:1};
  const current={...target};
  let last=performance.now(),raf=0,lastSig='';

  const sample=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const wet=/rain|storm/.test(weather),balanced=quality==='balanced',fast=driving&&speed>62;
    const nature=/park|home/.test(district),city=/downtown|studio|media|garage/.test(district);

    target.wet=wet&&!balanced&&!fast?1:0;
    target.glass=!balanced&&!fast&&district!=='park'?1:0;
    target.nature=!balanced&&(nature||driving)?1:0;
    target.clutter=!balanced&&!fast&&city?1:0;

    const sig=[district,weather,time,quality,driving?'1':'0',fast?'1':'0'].join('|');
    if(sig!==lastSig){lastSig=sig;root.dataset.tggSurfaceTransitionTargetV161=sig}
  };

  const applyChannel=(ch,value)=>{
    ch.names.forEach((name,i)=>{
      const o=get(name);if(!o)return;
      const alpha=Math.max(0,Math.min(1,value));
      if(alpha>.015)o.visible=true;
      if(o.material&&'opacity'in o.material){
        const base=ch.base===1?1:Math.max(.06,ch.base-i*.035);
        o.material.transparent=true;
        o.material.opacity=base*alpha;
      }
      if(alpha<=.015)o.visible=false;
    });
  };

  const frame=now=>{
    const dt=Math.min(.05,Math.max(.001,(now-last)/1000));last=now;
    const k=1-Math.exp(-dt*5.4);
    for(const key of Object.keys(current))current[key]+=(target[key]-current[key])*k;
    channels.forEach(ch=>applyChannel(ch,current[ch.key]));

    root.dataset.tggSurfaceBlendWetV161=current.wet.toFixed(2);
    root.dataset.tggSurfaceBlendGlassV161=current.glass.toFixed(2);
    root.dataset.tggSurfaceBlendNatureV161=current.nature.toFixed(2);
    root.dataset.tggSurfaceBlendClutterV161=current.clutter.toFixed(2);
    raf=requestAnimationFrame(frame);
  };

  const apply=()=>{
    sample();
    root.dataset.tggSurfaceTransitionSmoothingV161='1';
    root.dataset.tggSurfaceTransitionModeV161='raf-material-fade';
    root.dataset.tggSurfaceTransitionOwnerV161='final-surface-continuity';
    if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}
  };

  window.TGGSurfaceTransitionV161={apply,sample,get target(){return {...target}},get current(){return {...current}}};
  apply();
}
function applySurfaceTransitionSmoothingV161(){window.TGGSurfaceTransitionV161?.apply?.()||installSurfaceTransitionSmoothingV161()}
function installWorldMotionCoherenceV162(){
  if(window.TGGWorldMotionCoherenceV162)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWorldMotionCoherenceV162='waiting';return}
  const names={
    foliage:['TGG_FOLIAGE_VARIETY_V83','TGG_COUNTRYSIDE_TREES_V76','TGG_CITY_COUNTRY_BLEND_V89'],
    water:['TGG_PARK_WATER_V84'],
    clouds:['TGG_CLOUD_DEPTH_V84'],
    signs:['TGG_DISTRICT_SIGNAGE_V79','TGG_LANDMARK_APPROACH_LIGHTS_V89'],
    life:['TGG_AMBIENT_LIFE_V76','TGG_PEDESTRIAN_POCKETS_V77','TGG_PEDESTRIAN_GATHER_V143']
  };
  const cache={};
  const get=(key)=>{
    const hit=cache[key];
    if(hit?.some?.(o=>o?.parent))return hit.filter(o=>o?.parent);
    cache[key]=(names[key]||[]).map(n=>scene.getObjectByName?.(n)).filter(Boolean);
    return cache[key];
  };
  let running=true,last=0;
  const frame=(now)=>{
    if(!running)return;
    requestAnimationFrame(frame);
    if(now-last<42)return;
    last=now;
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const reduced=quality==='balanced'||document.hidden;
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const wind=/storm/.test(weather)?1.7:/rain/.test(weather)?1.25:1;
    const t=now*.001;
    get('foliage').forEach((g,gi)=>{if(g?.visible){g.rotation.z=Math.sin(t*(.22+.04*gi))*.006*wind;g.rotation.x=Math.cos(t*(.17+.03*gi))*.003*wind}});
    get('water').forEach(g=>{if(g?.visible){g.rotation.z=Math.sin(t*.14)*.012;if(g.material&&'opacity'in g.material)g.material.opacity=Math.max(.42,Math.min(.68,.55+Math.sin(t*.3)*.035))}});
    get('clouds').forEach(g=>{if(g?.visible&&!reduced){g.position.x=Math.sin(t*.012)*38;g.position.z=Math.cos(t*.009)*31}});
    get('signs').forEach((g,gi)=>{if(g?.visible&&!reduced&&g.material&&'opacity'in g.material){const pulse=(time==='night'?.08:.03)*(.5+.5*Math.sin(t*(.6+.1*gi)));g.material.opacity=Math.max(.16,Math.min(.72,Number(g.material.opacity||.3)+pulse*.08))}});
    get('life').forEach((g,gi)=>{if(g?.visible&&!driving&&!reduced)g.position.y=Math.sin(t*(.8+.05*gi))*.025});
    root.dataset.tggWorldMotionFrameMsV162='42';
    root.dataset.tggWorldMotionBudgetV162=reduced?'reduced':'full';
    root.dataset.tggWorldMotionWeatherV162=weather;
    root.dataset.tggWorldMotionCoherenceV162='1';
  };
  window.TGGWorldMotionCoherenceV162={
    stop:()=>{running=false},
    start:()=>{if(!running){running=true;requestAnimationFrame(frame)}},
    inspect:()=>({budget:root.dataset.tggWorldMotionBudgetV162||'full',frameMs:42,weather:root.dataset.tggWorldMotionWeatherV162||'clear'})
  };
  requestAnimationFrame(frame);
}
function applyWorldMotionCoherenceV162(){
  if(!window.TGGWorldMotionCoherenceV162)installWorldMotionCoherenceV162();
  root.dataset.tggWorldMotionAuthorityV162='raf-budgeted-existing-groups';
}

function installWorldStreamingBudgetV163(){
  if(window.TGGWorldStreamingBudgetV163)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWorldStreamingBudgetV163='waiting';return}

  const names=[
    'TGG_SKYLINE_SILHOUETTES_V82','TGG_WINDOW_REFLECTIONS_V83','TGG_FOLIAGE_VARIETY_V83',
    'TGG_CLOUD_DEPTH_V84','TGG_DISTANT_TERRAIN_V84','TGG_STREET_CLUTTER_V84',
    'TGG_TERRAIN_PROPS_V90','TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_CITY_COUNTRY_BLEND_V89',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89','TGG_ALLEY_DEPTH_V88','TGG_OVERPASS_BRIDGES_V88',
    'TGG_NEIGHBORHOOD_DEPTH_V76','TGG_AMBIENT_LIFE_V76','TGG_PEDESTRIAN_POCKETS_V77',
    'TGG_ROADSIDE_DETAIL_V75','TGG_STREET_RHYTHM_V82','TGG_SIDEWALK_VARIATION_V83'
  ];
  const cache=new Map();
  const get=(name)=>{
    const hit=cache.get(name);
    if(hit?.parent)return hit;
    const obj=scene.getObjectByName?.(name)||null;
    if(obj)cache.set(name,obj);
    return obj;
  };
  const distanceTo=(obj,focus)=>{
    if(!obj?.position||!focus)return 0;
    const dx=(obj.position.x||0)-(focus.x||0),dz=(obj.position.z||0)-(focus.z||0);
    return Math.hypot(dx,dz);
  };

  let last=0,lastSig='';
  const apply=()=>{
    const now=performance.now();
    if(now-last<900)return;
    last=now;

    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const district=String(root.dataset.tggDistrict||'downtown');
    const focus=(driving?w.car?.position:null)||w.camera?.position||{x:0,z:0};
    const balanced=quality==='balanced';
    const near=driving?700:480;
    const mid=driving?1450:980;
    const far=driving?3000:2200;
    const sig=[quality,driving?'1':'0',district,Math.round((focus.x||0)/120),Math.round((focus.z||0)/120)].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      names.forEach((name,idx)=>{
        const o=get(name);if(!o)return;
        const d=distanceTo(o,focus);
        let visible=true;
        if(/CLOUD|DISTANT_TERRAIN|SKYLINE/.test(name))visible=d<=far||d===0;
        else if(/FOLIAGE|CITY_COUNTRY|NEIGHBORHOOD|ROADSIDE/.test(name))visible=d<=mid||d===0;
        else visible=d<=near||d===0;
        if(balanced&&/WINDOW|CLUTTER|PEDESTRIAN|AMBIENT_LIFE|STREET_RHYTHM|SIDEWALK/.test(name))visible=false;
        if(district==='park'&&/STOREFRONT|ALLEY/.test(name))visible=false;
        if(o.visible!==visible)o.visible=visible;
      });

      const traffic=w.traffic||[];
      const trafficLimit=balanced?(driving?8:6):(driving?16:12);
      traffic.forEach((v,i)=>{
        if(!v)return;
        const allowed=i<trafficLimit;
        if(v.visible!==allowed)v.visible=allowed;
        if(v.userData){
          v.userData.tggStreamingVisibleV163=allowed?'1':'0';
          v.userData.tggStreamingBudgetV163=trafficLimit;
        }
      });

      const pedNames=['TGG_AMBIENT_LIFE_V76','TGG_PEDESTRIAN_POCKETS_V77','TGG_PEDESTRIAN_GATHER_V143'];
      pedNames.forEach(name=>{
        const g=get(name);if(!g)return;
        g.visible=!driving&&!balanced&&district!=='garage';
      });

      root.dataset.tggStreamingNearV163=String(near);
      root.dataset.tggStreamingMidV163=String(mid);
      root.dataset.tggStreamingFarV163=String(far);
      root.dataset.tggTrafficBudgetV163=String(trafficLimit);
      root.dataset.tggWorldStreamingQualityV163=quality;
      root.dataset.tggWorldStreamingDistrictV163=district;
    }

    root.dataset.tggWorldStreamingBudgetV163='1';
    root.dataset.tggWorldStreamingModeV163='camera-distance-budgeted';
  };

  window.TGGWorldStreamingBudgetV163={apply,inspect:()=>({
    near:Number(root.dataset.tggStreamingNearV163||0),
    mid:Number(root.dataset.tggStreamingMidV163||0),
    far:Number(root.dataset.tggStreamingFarV163||0),
    traffic:Number(root.dataset.tggTrafficBudgetV163||0),
    quality:root.dataset.tggWorldStreamingQualityV163||'unknown'
  })};
  apply();
}
function applyWorldStreamingBudgetV163(){window.TGGWorldStreamingBudgetV163?.apply?.()||installWorldStreamingBudgetV163()}

function installFinalSceneCompositionV164(){
  if(window.TGGFinalSceneV164)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggFinalSceneCompositionV164='waiting';return}

  const bands={
    near:[
      'TGG_STOREFRONT_FRONTAGE_V77','TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_SIDEWALK_VARIATION_V83',
      'TGG_ROAD_MARKINGS_V82','TGG_CURB_MEDIAN_V90','TGG_STREET_RHYTHM_V82',
      'TGG_DRAINAGE_GRATES_V150','TGG_LANE_REFLECTORS_V154','TGG_UTILITY_CLUTTER_V154'
    ],
    mid:[
      'TGG_WINDOW_REFLECTIONS_V83','TGG_FACADE_VARIATION_V78','TGG_NEIGHBORHOOD_DEPTH_V76',
      'TGG_REACTIVE_FOLIAGE_V127','TGG_FOLIAGE_VARIETY_V83','TGG_CITY_COUNTRY_BLEND_V89',
      'TGG_DISTRICT_TRANSITION_CORRIDORS_V89','TGG_ALLEY_DEPTH_V88'
    ],
    far:[
      'TGG_SKYLINE_SILHOUETTES_V82','TGG_DISTANT_TERRAIN_V84','TGG_CLOUD_DEPTH_V84',
      'TGG_DISTANCE_HAZE_BANDS_V149','TGG_ROOFLINE_SILHOUETTES_V128','TGG_COUNTRYSIDE_BELT_V76'
    ],
    life:[
      'TGG_POPULATION_V127','TGG_PEDESTRIAN_POCKETS_V77','TGG_AMBIENT_LIFE_V76',
      'TGG_PEDESTRIAN_GATHER_V143','TGG_STOREFRONT_ACTIVITY_V105'
    ]
  };

  const cache=new Map();
  const get=name=>{
    const hit=cache.get(name);
    if(hit?.parent)return hit;
    const obj=scene.getObjectByName?.(name)||null;
    if(obj)cache.set(name,obj);
    return obj;
  };

  let lastSig='',last=0;
  const setBand=(names,on,limit=null)=>{
    names.forEach((name,i)=>{
      const o=get(name);if(!o)return;
      const visible=!!on&&(limit===null||i<limit);
      if(o.visible!==visible)o.visible=visible;
    });
  };

  const apply=()=>{
    const now=performance.now();if(now-last<750)return;last=now;
    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const fps=Number(root.dataset.tggGraphicsFpsV55||60);
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const wet=/rain|storm/.test(weather),night=time==='night';
    const balanced=quality==='balanced'||fps<42;
    const fast=driving&&speed>55;
    const city=/downtown|studio|media|garage/.test(district);
    const nature=/park|home/.test(district);
    const sig=[district,quality,balanced?'1':'0',driving?'1':'0',fast?'1':'0',wet?'1':'0',night?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      setBand(bands.near,!fast&&(!balanced||!driving),balanced?5:null);
      setBand(bands.mid,!fast||nature||city,balanced?5:null);
      setBand(bands.far,true,balanced?4:null);
      setBand(bands.life,!driving&&!fast&&district!=='garage',balanced?2:null);

      const population=get('TGG_POPULATION_V127');
      if(population?.count!==undefined){
        const count=balanced?(city?42:28):(city?96:nature?58:72);
        population.count=Math.min(Number(population.instanceMatrix?.count||120),count);
        root.dataset.tggFinalPopulationBudgetV164=String(count);
      }

      const windows=get('TGG_WINDOW_REFLECTIONS_V83');
      if(windows?.count!==undefined){
        const count=balanced?72:(night||wet?144:112);
        windows.count=Math.min(144,count);
        root.dataset.tggFinalWindowBudgetV164=String(count);
      }

      const foliage=get('TGG_REACTIVE_FOLIAGE_V127');
      if(foliage?.count!==undefined){
        const count=balanced?(nature?88:56):(nature?160:112);
        foliage.count=Math.min(160,count);
        root.dataset.tggFinalFoliageBudgetV164=String(count);
      }

      const traffic=w.traffic||[];
      const trafficLimit=balanced?(driving?8:6):(city?driving?16:13:nature?8:10);
      traffic.forEach((v,i)=>{
        if(!v)return;
        const visible=i<trafficLimit;
        if(v.visible!==visible)v.visible=visible;
        if(v.userData)v.userData.tggFinalTrafficVisibleV164=visible?'1':'0';
      });
      root.dataset.tggFinalTrafficBudgetV164=String(trafficLimit);

      if(scene.fog){
        const base=nature?.00145:city?.00165:.00155;
        scene.fog.density=base+(wet?.00024:0)+(night?.0001:0)+(fast?-.0001:0);
      }
      if(w.camera){
        const far=fast?5700:driving?5400:5000;
        if(Math.abs(Number(w.camera.far||0)-far)>1){w.camera.far=far;w.camera.updateProjectionMatrix?.()}
        root.dataset.tggFinalCameraFarV164=String(far);
      }
    }

    root.dataset.tggFinalSceneCompositionV164='1';
    root.dataset.tggFinalSceneOwnerV164='near-mid-far-life';
    root.dataset.tggFinalSceneModeV164=balanced?'adaptive-balanced':fast?'travel-lite':driving?'driving-rich':'walking-rich';
    root.dataset.tggFinalSceneCachedGroupsV164=String(cache.size);
  };

  window.TGGFinalSceneV164={apply,inspect:()=>({
    mode:root.dataset.tggFinalSceneModeV164||'unknown',
    traffic:Number(root.dataset.tggFinalTrafficBudgetV164||0),
    population:Number(root.dataset.tggFinalPopulationBudgetV164||0),
    cameraFar:Number(root.dataset.tggFinalCameraFarV164||0)
  })};
  apply();
}
function applyFinalSceneCompositionV164(){window.TGGFinalSceneV164?.apply?.()||installFinalSceneCompositionV164()}

function installCinematicFramingV165(){
  if(window.TGGCinematicFramingV165)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggCinematicFramingV165='waiting';return}

  let focusLight=scene.getObjectByName?.('TGG_FOCUS_LIGHT_V165');
  if(!focusLight){
    focusLight=new THREE.PointLight(0xffe2bf,0,14,2);
    focusLight.name='TGG_FOCUS_LIGHT_V165';
    scene.add(focusLight);
  }

  let avatar=null,lastAvatarScan=0,lastMode='';
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
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const speed=Number(root.dataset.tggVisualSpeedV54||0);
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const fps=Number(root.dataset.tggGraphicsFpsV55||60);
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const balanced=quality==='balanced'||fps<42;
    const fast=driving&&speed>55;
    const mode=balanced?'adaptive-balanced':fast?'travel-cinematic':driving?'drive-cinematic':'walk-cinematic';

    if(w.camera){
      const targetFov=balanced?(driving?74:62):(fast?82:driving?76:61);
      const current=Number(w.camera.fov||targetFov);
      if(Math.abs(current-targetFov)>.04){
        w.camera.fov=current+(targetFov-current)*.16;
        w.camera.updateProjectionMatrix?.();
      }
      root.dataset.tggCinematicFovV165=String(Number(w.camera.fov||targetFov).toFixed(2));
    }

    const subject=driving?w.car:findAvatar();
    if(subject?.position&&!balanced){
      focusLight.position.set(subject.position.x+2.2,subject.position.y+3.1,subject.position.z+1.6);
      const night=time==='night',wet=/rain|storm/.test(weather);
      focusLight.intensity=night?1.15:wet?.68:.42;
      focusLight.color.setHex(night?0xb7d7ff:wet?0xd8e7f2:0xffe2bf);
      root.dataset.tggCinematicFocusV165=driving?'vehicle':'avatar';
    }else{
      focusLight.intensity=0;
      root.dataset.tggCinematicFocusV165=subject?'budget-off':'waiting';
    }

    if(mode!==lastMode){
      lastMode=mode;
      const near=Number(root.dataset.tggFinalWindowBudgetV164||0)+Number(root.dataset.tggFinalPopulationBudgetV164||0);
      const mid=Number(root.dataset.tggFinalFoliageBudgetV164||0)+Number(root.dataset.tggFinalTrafficBudgetV164||0);
      const far=Number(root.dataset.tggFinalCameraFarV164||0);
      root.dataset.tggCinematicNearBudgetV165=String(near);
      root.dataset.tggCinematicMidBudgetV165=String(mid);
      root.dataset.tggCinematicFarBudgetV165=String(far);
    }

    root.dataset.tggCinematicModeV165=mode;
    root.dataset.tggCinematicFramingOwnerV165='final-scene-v164';
    root.dataset.tggCinematicFramingV165='1';
  };

  window.TGGCinematicFramingV165={apply,inspect:()=>({
    mode:root.dataset.tggCinematicModeV165||'unknown',
    fov:Number(root.dataset.tggCinematicFovV165||0),
    focus:root.dataset.tggCinematicFocusV165||'unknown'
  })};
  apply();
}
function applyCinematicFramingV165(){window.TGGCinematicFramingV165?.apply?.()||installCinematicFramingV165()}

function installWholeWorldGroundingAuthorityV166(){
  if(window.TGGWholeWorldGroundingV166)return;
  const inspect=()=>{
    const groundingReady=root.dataset.tggWorldGroundingV90==='1';
    root.dataset.tggWholeWorldGroundingAuthorityV166='1';
    root.dataset.tggGroundingSourceV166='world-grounding-v90';
    root.dataset.tggGroundingIntegrationV166=groundingReady?'integrated':'waiting';
    root.dataset.tggGroundingFeaturesV166='curb-glass-terrain-traffic-contact';
    root.dataset.tggGroundingFinalOwnerV166='whole-world-v166';
    return groundingReady;
  };
  window.TGGWholeWorldGroundingV166={inspect};
  inspect();
}
function applyWholeWorldGroundingAuthorityV166(){window.TGGWholeWorldGroundingV166?.inspect?.()||installWholeWorldGroundingAuthorityV166()}

function installWholeWorldAcceptanceV167(){
  if(window.TGGWholeWorldAcceptanceV167)return;
  const inspect=()=>{
    const checks={
      worldVisual:root.dataset.tggWorldVisualOverhaulV75==='1',
      openWorld:root.dataset.tggOpenWorldExpansionV76==='1',
      districtIdentity:root.dataset.tggDistrictIdentityV77==='1',
      surfacePolish:root.dataset.tggWorldSurfacePolishV78==='1',
      premiumWorld:root.dataset.tggPremiumWorldPresentationV79==='1',
      nightCohesion:root.dataset.tggNightCohesionV80==='1',
      daylight:root.dataset.tggDaylightRealismV81==='1',
      artDirection:root.dataset.tggWorldArtDirectionV82==='1',
      depthCues:root.dataset.tggWorldDepthCuesV83==='1',
      ambientMotion:root.dataset.tggAmbientWorldMotionV84==='1',
      grounding:root.dataset.tggWorldGroundingV90==='1',
      travelIdentity:root.dataset.tggTravelIdentityV88==='1',
      districtTransition:root.dataset.tggDistrictTransitionV89==='1',
      spatialStreaming:root.dataset.tggSpatialStreamingV110==='1'||root.dataset.tggSpatialStreamingCorrectnessV111==='1',
      destinationFlow:root.dataset.tggDestinationFlowV136==='1',
      interiors:root.dataset.tggDestinationInteriorsV145==='1',
      illumination:root.dataset.tggNearFieldIlluminationV147==='1',
      visualConvergence:root.dataset.tggVisualConvergenceV148==='1',
      continuity:root.dataset.tggWorldContinuityDirectorV152==='1',
      presentation:root.dataset.tggWorldPresentationAuthorityV153==='1',
      materialConvergence:root.dataset.tggMaterialConvergenceV155==='1',
      weathering:root.dataset.tggEnvironmentalWeatheringV157==='1',
      environmentalConvergence:root.dataset.tggEnvironmentalConvergenceV158==='1',
      transitionSmoothing:root.dataset.tggWorldTransitionSmoothingV160==='1',
      motionCoherence:root.dataset.tggWorldMotionCoherenceV162==='1',
      streamingBudget:root.dataset.tggWorldStreamingBudgetV163==='1',
      composition:root.dataset.tggFinalSceneCompositionV164==='1',
      framing:root.dataset.tggCinematicFramingV165==='1',
      groundingAuthority:root.dataset.tggWholeWorldGroundingAuthorityV166==='1'
    };
    const missing=Object.entries(checks).filter(([,ok])=>!ok).map(([k])=>k);
    const total=Object.keys(checks).length,passed=total-missing.length;
    root.dataset.tggWholeWorldAcceptanceV167='1';
    root.dataset.tggWholeWorldAcceptancePassedV167=String(passed);
    root.dataset.tggWholeWorldAcceptanceTotalV167=String(total);
    root.dataset.tggWholeWorldAcceptanceMissingV167=missing.join(',')||'none';
    root.dataset.tggWholeWorldReadyV167=missing.length===0?'pass':'waiting';
    root.dataset.tggWholeWorldIntegrationV167=missing.length===0?'full-stack':'partial-stack';
    root.dataset.tggWholeWorldAcceptanceOwnerV167='tgg-world-v167';
    window.TGGWholeWorldAcceptanceStateV167={checks,missing,passed,total,ready:missing.length===0};
    return window.TGGWholeWorldAcceptanceStateV167;
  };
  window.TGGWholeWorldAcceptanceV167={inspect};
  inspect();
}
function applyWholeWorldAcceptanceV167(){window.TGGWholeWorldAcceptanceV167?.inspect?.()||installWholeWorldAcceptanceV167()}

function installWholeWorldGraphicsSealV168(){
  if(window.TGGWholeWorldGraphicsSealV168)return;
  const w=window.TGG3D;
  const requiredObjects=[
    'TGG_BUILDING_WINDOWS_V75',
    'TGG_COUNTRYSIDE_BELT_V76',
    'TGG_DISTRICT_LANDMARKS_V77',
    'TGG_FACADE_VARIATION_V78',
    'TGG_PREMIUM_FRONTAGE_V79',
    'TGG_STREET_REFLECTION_ACCENTS_V80',
    'TGG_TERRAIN_COLOR_BREAKUP_V81',
    'TGG_SKYLINE_SILHOUETTES_V82',
    'TGG_WINDOW_REFLECTIONS_V83',
    'TGG_CLOUD_DEPTH_V84',
    'TGG_CURB_MEDIAN_V90',
    'TGG_OVERPASS_BRIDGES_V88',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89'
  ];
  const inspect=()=>{
    const scene=w?.scene;
    const acceptance=window.TGGWholeWorldAcceptanceV167?.inspect?.()||window.TGGWholeWorldAcceptanceStateV167||{};
    const mounted=scene?requiredObjects.filter(name=>!!scene.getObjectByName?.(name)):[];
    const missingObjects=requiredObjects.filter(name=>!mounted.includes(name));
    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const buildOk=root.dataset.tggBuildIntegrityV58==='pass';
    const acceptanceReady=acceptance.ready===true||root.dataset.tggWholeWorldReadyV167==='pass';
    const ready=acceptanceReady&&buildOk&&missingObjects.length===0;

    root.dataset.tggWholeWorldGraphicsSealV168='1';
    root.dataset.tggWholeWorldGraphicsReadyV168=ready?'pass':'waiting';
    root.dataset.tggWholeWorldGraphicsQualityV168=quality;
    root.dataset.tggWholeWorldGraphicsObjectsMountedV168=String(mounted.length);
    root.dataset.tggWholeWorldGraphicsObjectsTotalV168=String(requiredObjects.length);
    root.dataset.tggWholeWorldGraphicsMissingV168=missingObjects.join(',')||'none';
    root.dataset.tggWholeWorldGraphicsAcceptanceV168=acceptanceReady?'pass':'waiting';
    root.dataset.tggWholeWorldGraphicsBuildV168=buildOk?'pass':'waiting';
    root.dataset.tggWholeWorldGraphicsOwnerV168='tgg-world-v168';
    window.TGGWholeWorldGraphicsStateV168={ready,quality,mounted,missingObjects,acceptanceReady,buildOk};
    return window.TGGWholeWorldGraphicsStateV168;
  };
  window.TGGWholeWorldGraphicsSealV168={inspect};
  inspect();
}
function applyWholeWorldGraphicsSealV168(){window.TGGWholeWorldGraphicsSealV168?.inspect?.()||installWholeWorldGraphicsSealV168()}

function installWholeWorldStabilityV169(){
  if(window.TGGWholeWorldStabilityV169)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWholeWorldStabilityV169='waiting';return}

  const decorative=[
    'TGG_CLOUD_DEPTH_V84',
    'TGG_AMBIENT_MOTION_V79',
    'TGG_STREET_CLUTTER_V84',
    'TGG_FOLIAGE_VARIETY_V83',
    'TGG_TERRAIN_MICRODETAIL_V131',
    'TGG_WINDOW_REFLECTIONS_V83',
    'TGG_NEIGHBORHOOD_GLOW_V81',
    'TGG_STREET_REFLECTION_ACCENTS_V80',
    'TGG_INTERIOR_GLOW_DEPTH_V80'
  ];
  const essential=[
    'TGG_BUILDING_WINDOWS_V75',
    'TGG_COUNTRYSIDE_BELT_V76',
    'TGG_DISTRICT_LANDMARKS_V77',
    'TGG_SKYLINE_SILHOUETTES_V82',
    'TGG_OVERPASS_BRIDGES_V88',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89'
  ];
  let lastSig='',lastAt=0;

  const apply=()=>{
    const now=performance.now();
    if(now-lastAt<900)return;
    lastAt=now;

    const quality=root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const fps=Number(root.dataset.tggGraphicsFpsV55||60);
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const district=String(root.dataset.tggDistrict||'downtown');
    const seal=window.TGGWholeWorldGraphicsSealV168?.inspect?.()||window.TGGWholeWorldGraphicsStateV168||{};
    const acceptance=window.TGGWholeWorldAcceptanceV167?.inspect?.()||window.TGGWholeWorldAcceptanceStateV167||{};
    const buildOk=root.dataset.tggBuildIntegrityV58==='pass';

    let mode=quality==='balanced'?'balanced':'high';
    if(fps>0&&fps<34)mode='balanced';
    else if(fps>=52&&quality!=='balanced')mode='high';

    const sig=[mode,driving?'1':'0',district,buildOk?'1':'0',seal.ready?'1':'0'].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      const reduced=mode==='balanced';

      decorative.forEach((name,i)=>{
        const o=scene.getObjectByName?.(name);
        if(!o)return;
        // Preserve the most readable near-field effects while reducing distant decoration.
        const keep=!reduced || i%3===0 || (driving&&/REFLECTION|WINDOW/.test(name));
        o.visible=keep;
      });
      essential.forEach(name=>{
        const o=scene.getObjectByName?.(name);
        if(o)o.visible=true;
      });

      if(w.renderer?.setPixelRatio){
        const cap=reduced?1.1:1.55;
        w.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,cap));
      }
      if(w.renderer?.shadowMap){
        w.renderer.shadowMap.enabled=!reduced;
      }
    }

    const ready=buildOk&&(seal.ready===true||root.dataset.tggWholeWorldGraphicsReadyV168==='pass')&&
      (acceptance.ready===true||root.dataset.tggWholeWorldReadyV167==='pass');

    root.dataset.tggWholeWorldStabilityV169='1';
    root.dataset.tggWholeWorldFidelityModeV169=mode;
    root.dataset.tggWholeWorldDecorativeBudgetV169=mode==='balanced'?'reduced':'full';
    root.dataset.tggWholeWorldEssentialVisibilityV169='locked-on';
    root.dataset.tggWholeWorldStabilityReadyV169=ready?'pass':'waiting';
    root.dataset.tggWholeWorldStabilityFpsV169=String(fps||0);
    root.dataset.tggWholeWorldStabilityOwnerV169='tgg-world-v169';
    window.TGGWholeWorldStabilityStateV169={ready,mode,fps,buildOk,sealReady:!!seal.ready,acceptanceReady:!!acceptance.ready};
    return window.TGGWholeWorldStabilityStateV169;
  };

  window.TGGWholeWorldStabilityV169={apply,decorative,essential};
  apply();
}
function applyWholeWorldStabilityV169(){window.TGGWholeWorldStabilityV169?.apply?.()||installWholeWorldStabilityV169()}

function installWholeWorldPresentationV170(){
  if(window.TGGWholeWorldPresentationV170)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWholeWorldPresentationV170='waiting';return}
  let lastSig='',lastAt=0;

  const apply=()=>{
    const now=performance.now();
    if(now-lastAt<900)return window.TGGWholeWorldPresentationStateV170;
    lastAt=now;

    const stability=window.TGGWholeWorldStabilityV169?.apply?.()||window.TGGWholeWorldStabilityStateV169||{};
    const seal=window.TGGWholeWorldGraphicsSealV168?.inspect?.()||window.TGGWholeWorldGraphicsStateV168||{};
    const acceptance=window.TGGWholeWorldAcceptanceV167?.inspect?.()||window.TGGWholeWorldAcceptanceStateV167||{};
    const quality=root.dataset.tggWholeWorldFidelityModeV169||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high';
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const district=String(root.dataset.tggDistrict||'downtown');
    const wet=/rain|storm/.test(String(root.dataset.tggWeather||'clear'));
    const night=String(root.dataset.tggTime||'day')==='night';
    const sig=[quality,driving?'1':'0',district,wet?'1':'0',night?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      const reduced=quality==='balanced';

      const avatarShadow=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
      if(avatarShadow?.material){
        avatarShadow.material.opacity=reduced?.18:night?.34:wet?.3:.25;
        avatarShadow.visible=!driving;
      }

      const vehicleShadow=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
      if(vehicleShadow?.material){
        vehicleShadow.material.opacity=reduced?.2:night?.36:wet?.33:.28;
        vehicleShadow.visible=!!w.car&&(driving||w.car.visible!==false);
      }

      const contact=scene.getObjectByName?.('TGG_CONTACT_LIGHT_V90');
      if(contact){
        if(reduced)contact.intensity=0;
        else contact.intensity=night?.9:wet?.55:.28;
      }

      (w.traffic||[]).forEach(v=>{
        if(!v?.userData)return;
        v.userData.tggPresentationModeV170=quality;
        v.userData.tggPresentationDistrictV170=district;
      });

      if(w.car?.userData){
        w.car.userData.tggPresentationModeV170=quality;
        w.car.userData.tggPresentationDistrictV170=district;
      }
    }

    const ready=
      (acceptance.ready===true||root.dataset.tggWholeWorldReadyV167==='pass')&&
      (seal.ready===true||root.dataset.tggWholeWorldGraphicsReadyV168==='pass')&&
      (stability.ready===true||root.dataset.tggWholeWorldStabilityReadyV169==='pass')&&
      root.dataset.tggBuildIntegrityV58==='pass';

    root.dataset.tggWholeWorldPresentationV170='1';
    root.dataset.tggWholeWorldPresentationReadyV170=ready?'pass':'waiting';
    root.dataset.tggWholeWorldPresentationModeV170=quality;
    root.dataset.tggWholeWorldPresentationGroundingV170='avatar+vehicle+contact';
    root.dataset.tggWholeWorldPresentationTrafficV170='coherent';
    root.dataset.tggWholeWorldPresentationOwnerV170='tgg-world-v170';
    window.TGGWholeWorldPresentationStateV170={
      ready,quality,district,driving,
      acceptanceReady:!!acceptance.ready,
      sealReady:!!seal.ready,
      stabilityReady:!!stability.ready
    };
    return window.TGGWholeWorldPresentationStateV170;
  };

  window.TGGWholeWorldPresentationV170={apply,inspect:apply};
  apply();
}
function applyWholeWorldPresentationV170(){window.TGGWholeWorldPresentationV170?.apply?.()||installWholeWorldPresentationV170()}

function installWorldMomentV171(){
  if(window.TGGWorldMomentV171)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWorldMomentV171='waiting';return}
  const scene=w.scene;

  let localLights=scene.getObjectByName?.('TGG_DESTINATION_LOCAL_LIGHTS_V171');
  if(!localLights){
    localLights=new THREE.Group();localLights.name='TGG_DESTINATION_LOCAL_LIGHTS_V171';
    const pts=[
      [0,-320,0xffd7a3],[-300,-110,0xff9ec9],[300,-40,0xa4d6ff],
      [220,300,0xb8ffca],[-270,280,0xffdf9c],[0,390,0xc4d3ff]
    ];
    pts.forEach(([x,z,color],i)=>{
      const light=new THREE.PointLight(color,0,24,2);
      light.position.set(x,5.4,z);
      light.userData.tggDestinationIndexV171=i;
      localLights.add(light);
    });
    scene.add(localLights);
  }

  let curbGlow=scene.getObjectByName?.('TGG_NEARFIELD_CURB_GLOW_V171');
  if(!curbGlow&&THREE.InstancedMesh){
    const geo=new THREE.PlaneGeometry(1.2,4.4);
    const mat=new THREE.MeshBasicMaterial({color:0xcbd9e6,transparent:true,opacity:.055,depthWrite:false,side:THREE.DoubleSide});
    curbGlow=new THREE.InstancedMesh(geo,mat,96);curbGlow.name='TGG_NEARFIELD_CURB_GLOW_V171';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-12;
      p.set(axis?step*10.2:side*8.7,.042,axis?side*8.7:step*10.2);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,axis?Math.PI/2:0,0));
      m.compose(p,q,s);curbGlow.setMatrixAt(i,m);
    }
    curbGlow.instanceMatrix.needsUpdate=true;scene.add(curbGlow);
  }

  const materialTargets=[
    'TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_WINDOW_REFLECTIONS_V83',
    'TGG_ROAD_MARKINGS_V82','TGG_CURB_MEDIAN_V90','TGG_SIDEWALK_VARIATION_V83'
  ];
  const cache=new Map();
  const get=(name)=>{
    const old=cache.get(name);if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };

  let lastSig='',lastAt=0;
  const apply=()=>{
    const now=performance.now();
    if(now-lastAt<700)return window.TGGWorldMomentStateV171;
    lastAt=now;

    const presentation=window.TGGWholeWorldPresentationV170?.apply?.()||window.TGGWholeWorldPresentationStateV170||{};
    const quality=String(root.dataset.tggWholeWorldPresentationModeV170||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const night=time==='night',gold=time==='golden',wet=/rain|storm/.test(weather),balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      localLights.children.forEach((light,i)=>{
        if(!light?.isLight)return;
        const active=i===({downtown:0,studio:1,media:2,park:3,home:4,garage:5}[district]??0);
        light.intensity=balanced?0:active?(night?1.35:gold?.72:wet?.58:.34):(night?.18:0);
      });

      if(curbGlow){
        curbGlow.visible=!balanced&&(night||wet||gold);
        curbGlow.material.opacity=night?.085:wet?.07:.045;
      }

      materialTargets.forEach(name=>{
        const obj=get(name);if(!obj?.material)return;
        const mats=Array.isArray(obj.material)?obj.material:[obj.material];
        mats.forEach(m=>{
          if(!m)return;
          if('roughness'in m&&wet)m.roughness=Math.max(.04,Math.min(.58,Number(m.roughness||.4)));
          if('envMapIntensity'in m)m.envMapIntensity=wet?1.25:night?1.05:.72;
          m.needsUpdate=true;
        });
      });

      if(w.renderer){
        const base=Number(root.dataset.tggRenderExposureV130||w.renderer.toneMappingExposure||1.06);
        w.renderer.toneMappingExposure=Math.max(.94,Math.min(1.16,base+(gold?.018:0)+(district==='studio'?.012:0)));
      }
    }

    const ready=
      (presentation.ready===true||root.dataset.tggWholeWorldPresentationReadyV170==='pass')&&
      root.dataset.tggBuildIntegrityV58==='pass';

    root.dataset.tggDestinationLocalLightsV171=String(localLights.children.length);
    root.dataset.tggNearfieldCurbGlowV171=curbGlow?'96':'0';
    root.dataset.tggMaterialResponseV171='weather-aware';
    root.dataset.tggExplorationPresentationV171='district-local';
    root.dataset.tggWorldMomentReadyV171=ready?'pass':'waiting';
    root.dataset.tggWorldMomentV171='1';
    root.dataset.tggWorldMomentOwnerV171='tgg-world-v171';
    window.TGGWorldMomentStateV171={ready,quality,district,time,weather,driving};
    return window.TGGWorldMomentStateV171;
  };

  window.TGGWorldMomentV171={apply,inspect:apply};
  apply();
}
function applyWorldMomentV171(){window.TGGWorldMomentV171?.apply?.()||installWorldMomentV171()}

function installWorldMomentConvergenceV172(){
  if(window.TGGWorldMomentConvergenceV172)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWorldMomentConvergenceV172='waiting';return}

  let targetExposure=1.06,currentExposure=Number(w.renderer?.toneMappingExposure||1.06);
  let targetFog=Number(scene.fog?.density||.0017),currentFog=targetFog;
  let targetFov=Number(w.camera?.fov||63),lastSig='',lastAt=0;

  const districtExposure={downtown:1.06,studio:1.08,media:1.09,park:1.02,home:1.03,garage:1.05};
  const districtFog={downtown:.00172,studio:.00182,media:.00176,park:.00146,home:.00156,garage:.00168};

  const essentialNames=[
    'TGG_DISTRICT_LANDMARKS_V77',
    'TGG_SKYLINE_SILHOUETTES_V82',
    'TGG_OVERPASS_BRIDGES_V88',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89',
    'TGG_BUILDING_WINDOWS_V75'
  ];

  const apply=()=>{
    const now=performance.now();
    if(now-lastAt<120)return window.TGGWorldMomentConvergenceStateV172;
    lastAt=now;

    const moment=window.TGGWorldMomentV171?.apply?.()||window.TGGWorldMomentStateV171||{};
    const presentation=window.TGGWholeWorldPresentationV170?.apply?.()||window.TGGWholeWorldPresentationStateV170||{};
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggWholeWorldPresentationModeV170||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const wet=/rain|storm/.test(weather),storm=/storm/.test(weather),night=time==='night',gold=time==='golden';
    const reduced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      targetExposure=(districtExposure[district]||1.06)+(gold?.035:0)+(night?.015:0)-(storm?.07:wet?.025:0);
      targetFog=(districtFog[district]||.0017)+(wet?.00022:0)+(night?.00008:0);
      targetFov=driving?Math.min(80,74+Number(root.dataset.tggVisualSpeedV54||0)*.1):63;

      essentialNames.forEach(name=>{
        const o=scene.getObjectByName?.(name);
        if(o)o.visible=true;
      });

      const local=scene.getObjectByName?.('TGG_DESTINATION_LOCAL_LIGHTS_V171');
      if(local)local.visible=!reduced;
      const curb=scene.getObjectByName?.('TGG_NEARFIELD_CURB_GLOW_V171');
      if(curb)curb.visible=!reduced&&(night||wet||gold);
    }

    currentExposure+=(targetExposure-currentExposure)*.18;
    currentFog+=(targetFog-currentFog)*.16;
    if(w.renderer)w.renderer.toneMappingExposure=currentExposure;
    if(scene.fog)scene.fog.density=currentFog;
    if(w.camera){
      w.camera.fov+=(targetFov-Number(w.camera.fov||targetFov))*.14;
      w.camera.far=Math.max(Number(w.camera.far||0),4600);
      w.camera.updateProjectionMatrix?.();
    }

    const buildOk=root.dataset.tggBuildIntegrityV58==='pass';
    const momentReady=moment.ready===true||root.dataset.tggWorldMomentReadyV171==='pass';
    const presentationReady=presentation.ready===true||root.dataset.tggWholeWorldPresentationReadyV170==='pass';
    const ready=buildOk&&momentReady&&presentationReady;

    root.dataset.tggWorldMomentConvergenceV172='1';
    root.dataset.tggWorldTransitionSmoothingV172='exposure+fog+camera';
    root.dataset.tggWorldEssentialLayersV172='locked-on';
    root.dataset.tggWorldMomentConvergenceModeV172=quality;
    root.dataset.tggWorldMomentConvergenceReadyV172=ready?'pass':'waiting';
    root.dataset.tggWorldMomentConvergenceOwnerV172='tgg-world-v172';
    window.TGGWorldMomentConvergenceStateV172={ready,district,time,weather,quality,driving,buildOk,momentReady,presentationReady};
    return window.TGGWorldMomentConvergenceStateV172;
  };

  window.TGGWorldMomentConvergenceV172={apply,inspect:apply};
  apply();
}
function applyWorldMomentConvergenceV172(){window.TGGWorldMomentConvergenceV172?.apply?.()||installWorldMomentConvergenceV172()}

function installWholeWorldExperienceV173(){
  if(window.TGGWholeWorldExperienceV173)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWholeWorldExperienceV173='waiting';return}

  const essential=[
    'TGG_DISTRICT_LANDMARKS_V77',
    'TGG_SKYLINE_SILHOUETTES_V82',
    'TGG_OVERPASS_BRIDGES_V88',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89',
    'TGG_BUILDING_WINDOWS_V75',
    'TGG_ROAD_MARKINGS_V82'
  ];
  const decorative=[
    'TGG_CLOUD_DEPTH_V84','TGG_AMBIENT_MOTION_V79','TGG_STREET_CLUTTER_V84',
    'TGG_FOLIAGE_VARIETY_V83','TGG_TERRAIN_COLOR_BREAKUP_V81',
    'TGG_WINDOW_REFLECTIONS_V83','TGG_INTERIOR_GLOW_DEPTH_V80'
  ];
  const cache=new Map();
  const get=name=>{
    const old=cache.get(name);if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };

  let lastSig='',lastAt=0;
  const apply=()=>{
    const now=performance.now();
    if(now-lastAt<250)return window.TGGWholeWorldExperienceStateV173;
    lastAt=now;

    const convergence=window.TGGWorldMomentConvergenceV172?.apply?.()||window.TGGWorldMomentConvergenceStateV172||{};
    const stability=window.TGGWholeWorldStabilityV169?.apply?.()||window.TGGWholeWorldStabilityStateV169||{};
    const streaming=window.TGGWorldStreamingBudgetV163?.apply?.()||window.TGGWorldStreamingBudgetStateV163||{};
    const sceneComp=window.TGGFinalSceneCompositionV164?.apply?.()||window.TGGFinalSceneCompositionStateV164||{};

    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const quality=String(root.dataset.tggWholeWorldFidelityModeV169||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=quality==='balanced';
    const sig=[district,time,weather,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;

      essential.forEach(name=>{
        const o=get(name);if(o)o.visible=true;
      });

      decorative.forEach((name,i)=>{
        const o=get(name);if(!o)return;
        const keep=!balanced || (driving?i%2===0:i<3);
        o.visible=keep;
      });

      const pedestrians=get('TGG_PEDESTRIAN_POCKETS_V77');
      if(pedestrians)pedestrians.visible=!driving&&!balanced&&district!=='garage';

      const traffic=w.traffic||[];
      const limit=balanced?Math.ceil(traffic.length*.58):driving?traffic.length:Math.ceil(traffic.length*.82);
      traffic.forEach((v,i)=>{if(v&&v.visible!==undefined)v.visible=i<limit});
      root.dataset.tggWorldTrafficVisibleV173=String(Math.min(limit,traffic.length));

      if(w.camera){
        w.camera.far=Math.max(Number(w.camera.far||0),4600);
        w.camera.near=driving?.08:.06;
        w.camera.updateProjectionMatrix?.();
      }
    }

    const buildOk=root.dataset.tggBuildIntegrityV58==='pass';
    const convergenceReady=convergence.ready===true||root.dataset.tggWorldMomentConvergenceReadyV172==='pass';
    const stabilityReady=root.dataset.tggWholeWorldStabilityV169==='1';
    const sceneReady=root.dataset.tggFinalSceneCompositionV164==='1';
    const streamingReady=root.dataset.tggWorldStreamingBudgetV163==='1';
    const ready=buildOk&&convergenceReady&&stabilityReady&&sceneReady&&streamingReady;

    root.dataset.tggWholeWorldExperienceV173='1';
    root.dataset.tggWholeWorldExperienceModeV173=balanced?'balanced':'high';
    root.dataset.tggWholeWorldEssentialLayersV173='locked-on';
    root.dataset.tggWholeWorldDecorativePolicyV173=balanced?'budgeted':'full';
    root.dataset.tggWholeWorldExperienceIntegrationV173='district-time-weather-streaming-camera';
    root.dataset.tggWholeWorldExperienceReadyV173=ready?'pass':'waiting';
    root.dataset.tggWholeWorldExperienceOwnerV173='tgg-world-v173';
    window.TGGWholeWorldExperienceStateV173={
      ready,district,time,weather,quality,driving,buildOk,convergenceReady,stabilityReady,sceneReady,streamingReady
    };
    return window.TGGWholeWorldExperienceStateV173;
  };

  window.TGGWholeWorldExperienceV173={apply,inspect:apply};
  apply();
}
function applyWholeWorldExperienceV173(){window.TGGWholeWorldExperienceV173?.apply?.()||installWholeWorldExperienceV173()}

function installWholeWorldVisualQAV174(){
  if(window.TGGWholeWorldVisualQAV174)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWholeWorldVisualQAV174='waiting';return}

  const essential=[
    'TGG_DISTRICT_LANDMARKS_V77',
    'TGG_SKYLINE_SILHOUETTES_V82',
    'TGG_OVERPASS_BRIDGES_V88',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89',
    'TGG_BUILDING_WINDOWS_V75',
    'TGG_ROAD_MARKINGS_V82'
  ];
  const cache=new Map();
  const get=name=>{
    const old=cache.get(name);if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };

  let lastAt=0,lastResult=null;
  const inspect=(force=false)=>{
    const now=performance.now();
    if(!force&&lastResult&&now-lastAt<1500)return lastResult;
    lastAt=now;

    const experience=window.TGGWholeWorldExperienceV173?.apply?.()||window.TGGWholeWorldExperienceStateV173||{};
    const stateSnap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(stateSnap.district||root.dataset.tggDistrict||'downtown');
    const quality=String(root.dataset.tggWholeWorldFidelityModeV169||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=!!(stateSnap.driving||root.dataset.tggDriving==='1'||state.driving);
    const balanced=quality==='balanced';

    const missing=[];
    let repaired=0;
    essential.forEach(name=>{
      const o=get(name);
      if(!o){missing.push(name);return}
      if(o.visible===false){
        o.visible=true;
        repaired++;
      }
    });

    if(w.camera){
      const beforeFar=Number(w.camera.far||0);
      const beforeNear=Number(w.camera.near||0);
      const targetFar=4600,targetNear=driving?.08:.06;
      let changed=false;
      if(beforeFar<targetFar){w.camera.far=targetFar;changed=true}
      if(Math.abs(beforeNear-targetNear)>.001){w.camera.near=targetNear;changed=true}
      if(changed){w.camera.updateProjectionMatrix?.();repaired++}
    }

    if(w.renderer){
      if(w.renderer.shadowMap){
        const shouldEnable=!balanced||String(root.dataset.tggNearFarHandoffV133||'world-far')==='interaction-near';
        if(w.renderer.shadowMap.enabled!==shouldEnable){
          w.renderer.shadowMap.enabled=shouldEnable;repaired++;
        }
      }
      if(w.renderer.setPixelRatio){
        const current=Number(w.renderer.getPixelRatio?.()||1);
        const cap=balanced?1.15:1.65;
        const target=Math.min(window.devicePixelRatio||1,cap);
        if(Math.abs(current-target)>.08){w.renderer.setPixelRatio(target);repaired++}
      }
    }

    const traffic=w.traffic||[];
    const visibleTraffic=traffic.filter(v=>v?.visible!==false).length;
    const minimum=traffic.length?Math.max(1,Math.ceil(traffic.length*(balanced?.4:.6))):0;
    if(visibleTraffic<minimum){
      traffic.slice(0,minimum).forEach(v=>{if(v&&v.visible!==undefined)v.visible=true});
      repaired++;
    }

    const buildOk=root.dataset.tggBuildIntegrityV58==='pass';
    const experienceReady=experience.ready===true||root.dataset.tggWholeWorldExperienceReadyV173==='pass';
    const essentialReady=missing.length===0;
    const cameraReady=!w.camera||Number(w.camera.far||0)>=4600;
    const ready=buildOk&&experienceReady&&essentialReady&&cameraReady;

    root.dataset.tggWholeWorldVisualQAV174='1';
    root.dataset.tggVisualQAEssentialV174=essentialReady?'pass':'missing';
    root.dataset.tggVisualQAMissingV174=missing.join(',')||'none';
    root.dataset.tggVisualQARepairsV174=String(repaired);
    root.dataset.tggVisualQACameraV174=cameraReady?'pass':'fail';
    root.dataset.tggVisualQATrafficV174=String(traffic.filter(v=>v?.visible!==false).length);
    root.dataset.tggVisualQABuildV174=buildOk?'pass':'fail';
    root.dataset.tggVisualQAExperienceV174=experienceReady?'pass':'waiting';
    root.dataset.tggWholeWorldVisualQAReadyV174=ready?'pass':'waiting';
    root.dataset.tggWholeWorldVisualQAOwnerV174='tgg-world-v174';

    lastResult={ready,missing,repaired,district,quality,driving,buildOk,experienceReady,cameraReady};
    window.TGGWholeWorldVisualQAStateV174=lastResult;
    return lastResult;
  };

  window.TGGWholeWorldVisualQAV174={inspect,repair:()=>inspect(true)};
  inspect(true);
}
function applyWholeWorldVisualQAV174(){window.TGGWholeWorldVisualQAV174?.inspect?.()||installWholeWorldVisualQAV174()}

function installWholeWorldFinalVerificationV175(){
  if(window.TGGWholeWorldFinalVerificationV175)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWholeWorldFinalVerificationV175='waiting';return}

  const decorativeBalancedOff=[
    'TGG_CLOUD_DEPTH_V84',
    'TGG_AMBIENT_MOTION_V79',
    'TGG_STREET_REFLECTION_ACCENTS_V80',
    'TGG_TERRAIN_COLOR_BREAKUP_V81',
    'TGG_WINDOW_REFLECTIONS_V83'
  ];
  let lastAt=0,last=null;

  const inspect=(force=false)=>{
    const now=performance.now();
    if(!force&&last&&now-lastAt<2500)return last;
    lastAt=now;

    const qa=window.TGGWholeWorldVisualQAV174?.inspect?.(force)||window.TGGWholeWorldVisualQAStateV174||{};
    const fidelity=String(root.dataset.tggWholeWorldFidelityModeV169||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const balanced=fidelity==='balanced';

    let objectCount=0,meshCount=0,pointLights=0,visiblePointLights=0;
    scene.traverse?.(o=>{
      objectCount++;
      if(o?.isMesh||o?.isInstancedMesh)meshCount++;
      if(o?.isPointLight){pointLights++;if(o.visible!==false&&Number(o.intensity||0)>0)visiblePointLights++}
    });

    let decorativeAdjusted=0;
    decorativeBalancedOff.forEach(name=>{
      const o=scene.getObjectByName?.(name);
      if(!o)return;
      if(balanced&&o.visible!==false){o.visible=false;decorativeAdjusted++}
    });

    const checks={
      build:root.dataset.tggBuildIntegrityV58==='pass',
      graphicsSeal:root.dataset.tggWholeWorldGraphicsAcceptanceV168==='pass',
      stability:root.dataset.tggWholeWorldStabilityV169==='1',
      experience:root.dataset.tggWholeWorldExperienceReadyV173==='pass',
      visualQA:qa.ready===true||root.dataset.tggWholeWorldVisualQAReadyV174==='pass',
      essentials:root.dataset.tggVisualQAEssentialV174==='pass',
      missing:root.dataset.tggVisualQAMissingV174==='none'
    };
    const passed=Object.values(checks).filter(Boolean).length;
    const total=Object.keys(checks).length;
    const ready=passed===total;

    root.dataset.tggWholeWorldFinalVerificationV175='1';
    root.dataset.tggWholeWorldVerificationScoreV175=passed+'/'+total;
    root.dataset.tggWholeWorldReadyV175=ready?'pass':'waiting';
    root.dataset.tggWholeWorldVerificationMissingV175=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k).join(',')||'none';
    root.dataset.tggSceneObjectCountV175=String(objectCount);
    root.dataset.tggSceneMeshCountV175=String(meshCount);
    root.dataset.tggPointLightsV175=String(pointLights);
    root.dataset.tggVisiblePointLightsV175=String(visiblePointLights);
    root.dataset.tggAdaptiveCleanupV175=balanced?'balanced-final':'high-preserve';
    root.dataset.tggDecorativeAdjustedV175=String(decorativeAdjusted);
    root.dataset.tggWholeWorldFinalOwnerV175='tgg-world-v175';

    last={ready,checks,passed,total,objectCount,meshCount,pointLights,visiblePointLights,fidelity,decorativeAdjusted};
    window.TGGWholeWorldFinalVerificationStateV175=last;
    return last;
  };

  window.TGGWholeWorldFinalVerificationV175={inspect,verify:()=>inspect(true)};
  inspect(true);
}
function applyWholeWorldFinalVerificationV175(){window.TGGWholeWorldFinalVerificationV175?.inspect?.()||installWholeWorldFinalVerificationV175()}

function installPostQAPolishV176(){
  if(window.TGGPostQAPolishV176)return;
  const THREE=window.THREE,w=window.TGG3D,scene=w?.scene;
  if(!THREE||!scene){root.dataset.tggPostQAPolishV176='waiting';return}

  const destinationAnchors=[
    ['studio',-34,-34,0xff6774],
    ['garage',34,-34,0x73ddff],
    ['media',0,38,0xc99cff],
    ['home',-300,300,0xffd7aa],
    ['park',245,320,0x9dffb7]
  ];

  let beacons=scene.getObjectByName?.('TGG_DESTINATION_BEACONS_V176');
  if(!beacons){
    beacons=new THREE.Group();beacons.name='TGG_DESTINATION_BEACONS_V176';
    destinationAnchors.forEach(([name,x,z,color])=>{
      const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.12,depthWrite:false});
      const ring=new THREE.Mesh(new THREE.RingGeometry(5.5,7.1,36),mat);
      ring.rotation.x=-Math.PI/2;ring.position.set(x,.075,z);
      ring.userData.tggDestinationV176=name;beacons.add(ring);
    });
    scene.add(beacons);
  }

  let ambient=scene.getObjectByName?.('TGG_WORLD_AMBIENT_SWEEP_V176');
  if(!ambient){
    ambient=new THREE.Group();ambient.name='TGG_WORLD_AMBIENT_SWEEP_V176';
    const mat=new THREE.MeshBasicMaterial({color:0xc9ddff,transparent:true,opacity:.09,depthWrite:false});
    for(let i=0;i<20;i++){
      const dot=new THREE.Mesh(new THREE.SphereGeometry(.12,5,4),mat);
      const a=(i/20)*Math.PI*2,r=90+(i%5)*18;
      dot.position.set(Math.cos(a)*r,2.5+(i%4)*1.2,Math.sin(a)*r);
      dot.userData.tggPhaseV176=i*.41;
      dot.userData.tggBaseYV176=dot.position.y;
      ambient.add(dot);
    }
    scene.add(ambient);
  }

  const nearFieldNames=[
    'TGG_INTERACTION_PADS_V133',
    'TGG_NEAR_FIELD_FOCUS_V133',
    'TGG_STOREFRONT_GLASS_DEPTH_V90',
    'TGG_SIDEWALK_VARIATION_V83',
    'TGG_STREET_CLUTTER_V84'
  ];
  const farFieldNames=[
    'TGG_SKYLINE_SILHOUETTES_V82',
    'TGG_DISTANT_TERRAIN_V84',
    'TGG_COUNTRYSIDE_BELT_V76',
    'TGG_CLOUD_DEPTH_V84'
  ];

  let lastSig='';
  const apply=()=>{
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const driving=!!snap.driving||root.dataset.tggDriving==='1';
    const fidelity=String(root.dataset.tggWholeWorldFidelityModeV169||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const balanced=fidelity==='balanced';
    const night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,driving?'1':'0',fidelity].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      nearFieldNames.forEach(name=>{
        const o=scene.getObjectByName?.(name);if(!o)return;
        o.visible=!driving&&!balanced;
      });
      farFieldNames.forEach(name=>{
        const o=scene.getObjectByName?.(name);if(!o)return;
        o.visible=!balanced||driving||district==='park'||district==='home';
      });
      beacons.children.forEach(o=>{
        const active=o.userData?.tggDestinationV176===district;
        o.visible=!driving;
        if(o.material)o.material.opacity=active?.28:(night||wet?.16:.09);
      });
      ambient.visible=!balanced&&!driving;
      if(w.camera){
        const targetFar=driving?5000:4700;
        if(Number(w.camera.far||0)!==targetFar){
          w.camera.far=targetFar;
          w.camera.updateProjectionMatrix?.();
        }
      }
    }

    if(ambient.visible){
      const t=performance.now()*.001;
      ambient.children.forEach((o,i)=>{
        o.position.y=o.userData.tggBaseYV176+Math.sin(t*.32+o.userData.tggPhaseV176)*.24;
        o.rotation.y+=.0015+(i%3)*.0008;
      });
    }

    root.dataset.tggPostQAPolishV176='1';
    root.dataset.tggNearFieldBudgetV176=(!driving&&!balanced)?'active':'reduced';
    root.dataset.tggFarFieldBudgetV176=(!balanced||driving)?'active':'reduced';
    root.dataset.tggDestinationBeaconsV176='5';
    root.dataset.tggAmbientSweepV176=ambient.visible?'20':'idle';
    root.dataset.tggCameraRangeV176=driving?'5000':'4700';
    root.dataset.tggPostQAPolishOwnerV176='tgg-world-v176';
  };

  window.TGGPostQAPolishV176={apply};
  apply();
}
function applyPostQAPolishV176(){window.TGGPostQAPolishV176?.apply?.()||installPostQAPolishV176()}

function installFinalVisualConvergenceV177(){
  if(window.TGGFinalVisualConvergenceV177)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggFinalVisualConvergenceV177='waiting';return}

  const nearNames=[
    'TGG_INTERACTION_PADS_V133','TGG_NEAR_FIELD_FOCUS_V133','TGG_STOREFRONT_GLASS_DEPTH_V90',
    'TGG_SIDEWALK_VARIATION_V83','TGG_STREET_CLUTTER_V84','TGG_CURB_MEDIAN_V90'
  ];
  const midNames=[
    'TGG_FACADE_VARIATION_V78','TGG_BUILDING_WINDOWS_V75','TGG_DISTRICT_LANDMARKS_V77',
    'TGG_STOREFRONT_FRONTAGE_V77','TGG_NEIGHBORHOOD_DEPTH_V76','TGG_DISTRICT_SIGNAGE_V79'
  ];
  const farNames=[
    'TGG_SKYLINE_SILHOUETTES_V82','TGG_DISTANT_TERRAIN_V84','TGG_COUNTRYSIDE_BELT_V76',
    'TGG_CLOUD_DEPTH_V84','TGG_CITY_COUNTRY_BLEND_V89'
  ];
  const lifeNames=[
    'TGG_PEDESTRIAN_POCKETS_V77','TGG_AMBIENT_LIFE_V76','TGG_AMBIENT_MOTION_V79','TGG_WORLD_AMBIENT_SWEEP_V176'
  ];

  const cache=new Map();
  const get=(name)=>{
    const prev=cache.get(name);
    if(prev?.parent)return prev;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };
  const setVisible=(names,on)=>names.forEach(name=>{const o=get(name);if(o)o.visible=!!on});

  let lastSig='';
  const apply=()=>{
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const driving=!!snap.driving||root.dataset.tggDriving==='1'||state.driving===true;
    const fps=Number(root.dataset.tggGraphicsFpsV55||60);
    const fidelity=String(root.dataset.tggWholeWorldFidelityModeV169||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const balanced=fidelity==='balanced'||fps<40;
    const travel=driving&&Number(root.dataset.tggVisualSpeedV54||0)>22;
    const night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[district,time,weather,driving?'1':'0',balanced?'1':'0',travel?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      setVisible(nearNames,!driving&&!balanced);
      setVisible(midNames,!travel||district==='downtown'||district==='studio'||district==='media');
      setVisible(farNames,!balanced||driving||district==='park'||district==='home');
      setVisible(lifeNames,!driving&&!balanced);

      const beacons=get('TGG_DESTINATION_BEACONS_V176');
      beacons?.children?.forEach?.(o=>{
        const active=o.userData?.tggDestinationV176===district;
        o.visible=!driving;
        if(o.material)o.material.opacity=active?.30:(night||wet?.15:.08);
      });

      const glass=get('TGG_STOREFRONT_GLASS_DEPTH_V90');
      if(glass?.material){
        glass.material.opacity=night?.28:wet?.23:.16;
        glass.material.roughness=wet?.03:.07;
      }
      const sidewalks=get('TGG_SIDEWALK_VARIATION_V83');
      if(sidewalks?.material)sidewalks.material.roughness=wet?.6:.94;

      if(w.camera){
        const targetFar=travel?5200:driving?5000:4700;
        if(Number(w.camera.far||0)!==targetFar){
          w.camera.far=targetFar;
          w.camera.updateProjectionMatrix?.();
        }
      }
    }

    root.dataset.tggFinalVisualConvergenceV177='1';
    root.dataset.tggNearFieldOwnerV177='converged';
    root.dataset.tggMidFieldOwnerV177='converged';
    root.dataset.tggFarFieldOwnerV177='converged';
    root.dataset.tggWorldLifeOwnerV177='converged';
    root.dataset.tggVisualBudgetOwnerV177='world-state+fps';
    root.dataset.tggVisualConvergenceModeV177=balanced?'balanced':travel?'travel':'full';
    root.dataset.tggFinalVisualOwnerV177='tgg-world-v177';
  };

  window.TGGFinalVisualConvergenceV177={apply};
  apply();
}
function applyFinalVisualConvergenceV177(){window.TGGFinalVisualConvergenceV177?.apply?.()||installFinalVisualConvergenceV177()}

function installWholeWorldSealV178(){
  if(window.TGGWholeWorldSealV178)return;
  const w=window.TGG3D,scene=w?.scene,renderer=w?.renderer,camera=w?.camera;
  if(!scene||!renderer||!camera){root.dataset.tggWholeWorldSealV178='waiting';return}

  const required=[
    'TGG_DISTRICT_LANDMARKS_V77',
    'TGG_SKYLINE_SILHOUETTES_V82',
    'TGG_DISTANT_TERRAIN_V84',
    'TGG_COUNTRYSIDE_BELT_V76',
    'TGG_SIDEWALK_VARIATION_V83',
    'TGG_CURB_MEDIAN_V90',
    'TGG_STOREFRONT_FRONTAGE_V77',
    'TGG_STOREFRONT_GLASS_DEPTH_V90',
    'TGG_PEDESTRIAN_POCKETS_V77',
    'TGG_DESTINATION_BEACONS_V176',
    'TGG_CLOUD_DEPTH_V84',
    'TGG_CITY_COUNTRY_BLEND_V89'
  ];

  let lastAudit=0,lastResult=null;
  const audit=(force=false)=>{
    const now=performance.now();
    if(!force&&lastResult&&now-lastAudit<5000)return lastResult;
    lastAudit=now;

    window.TGGFinalVisualConvergenceV177?.apply?.();

    const mounted=[],missing=[];
    required.forEach(name=>{
      const obj=scene.getObjectByName?.(name);
      (obj?mounted:missing).push(name);
    });

    let objects=0,meshes=0,points=0,visiblePoints=0;
    scene.traverse?.(o=>{
      objects++;
      if(o?.isMesh||o?.isInstancedMesh)meshes++;
      if(o?.isPointLight){points++;if(o.visible!==false&&Number(o.intensity||0)>0)visiblePoints++}
    });

    const state=window.__TGG_WORLD_STATE_V109__||{};
    const driving=!!state.driving||root.dataset.tggDriving==='1'||state.driving===true;
    const minFar=driving?5000:4700;
    if(Number(camera.far||0)<minFar){
      camera.far=minFar;
      camera.updateProjectionMatrix?.();
    }

    const finalOwner=root.dataset.tggFinalVisualOwnerV177||'';
    const ownerOk=finalOwner==='tgg-world-v177';
    const integrityOk=root.dataset.tggBuildIntegrityV58==='pass';
    const worldReady=root.dataset.tggWholeWorldReadyV175==='1';
    const ok=missing.length===0&&ownerOk&&integrityOk&&worldReady;

    root.dataset.tggWholeWorldSealV178=ok?'pass':'review';
    root.dataset.tggWholeWorldSealMountedV178=String(mounted.length);
    root.dataset.tggWholeWorldSealRequiredV178=String(required.length);
    root.dataset.tggWholeWorldSealMissingV178=missing.join(',')||'none';
    root.dataset.tggWholeWorldSealOwnerV178='final-convergence-v177';
    root.dataset.tggWholeWorldSealBuildV178='1000x-v178';
    root.dataset.tggWholeWorldSealObjectsV178=String(objects);
    root.dataset.tggWholeWorldSealMeshesV178=String(meshes);
    root.dataset.tggWholeWorldSealPointLightsV178=String(points);
    root.dataset.tggWholeWorldSealVisiblePointLightsV178=String(visiblePoints);
    root.dataset.tggWholeWorldSealCameraFarV178=String(Math.round(Number(camera.far||0)));
    root.dataset.tggWholeWorldSealReadyV178=ok?'1':'0';

    lastResult={ok,mounted,missing,objects,meshes,points,visiblePoints,ownerOk,integrityOk,worldReady};
    window.__TGG_WHOLE_WORLD_SEAL_V178__=lastResult;
    return lastResult;
  };

  window.TGGWholeWorldSealV178={audit,required};
  audit(true);
}
function applyWholeWorldSealV178(){window.TGGWholeWorldSealV178?.audit?.(false)||installWholeWorldSealV178()}

function installProductionVisualSentinelV179(){
  if(window.TGGProductionVisualSentinelV179)return;
  const w=window.TGG3D,scene=w?.scene,camera=w?.camera;
  if(!scene||!camera){root.dataset.tggProductionVisualSentinelV179='waiting';return}

  const required=[
    'TGG_DISTRICT_LANDMARKS_V77','TGG_SKYLINE_SILHOUETTES_V82','TGG_DISTANT_TERRAIN_V84',
    'TGG_COUNTRYSIDE_BELT_V76','TGG_SIDEWALK_VARIATION_V83','TGG_CURB_MEDIAN_V90',
    'TGG_STOREFRONT_FRONTAGE_V77','TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_PEDESTRIAN_POCKETS_V77',
    'TGG_DESTINATION_BEACONS_V176','TGG_CLOUD_DEPTH_V84','TGG_CITY_COUNTRY_BLEND_V89'
  ];

  let lastAt=0,last=null;
  const inspect=(force=false)=>{
    const now=performance.now();
    if(!force&&last&&now-lastAt<4000)return last;
    lastAt=now;

    const seal=window.TGGWholeWorldSealV178?.audit?.(force)||window.TGGWholeWorldSealStateV178||{};
    const missing=required.filter(name=>!scene.getObjectByName?.(name));
    let pointLights=0,visiblePointLights=0;
    scene.traverse?.(o=>{
      if(o?.isPointLight){
        pointLights++;
        if(o.visible!==false&&Number(o.intensity||0)>0)visiblePointLights++;
      }
    });

    const state=window.__TGG_WORLD_STATE_V109__||{};
    const driving=!!state.driving||root.dataset.tggDriving==='1'||state.driving===true;
    const minFar=driving?5000:4700;
    if(Number(camera.far||0)<minFar){
      camera.far=minFar;
      camera.updateProjectionMatrix?.();
    }

    const owner=root.dataset.tggFinalVisualOwnerV177||'';
    const sealPass=root.dataset.tggWholeWorldSealV178==='pass'||seal.ok===true;
    const ownerPass=owner==='tgg-world-v177';
    const buildPass=root.dataset.tggBuildIntegrityV58==='pass';
    const pointLightBudget=visiblePointLights<=16;
    const ready=missing.length===0&&sealPass&&ownerPass&&buildPass&&pointLightBudget;

    root.dataset.tggProductionVisualSentinelV179=ready?'pass':'review';
    root.dataset.tggProductionVisualMissingV179=missing.join(',')||'none';
    root.dataset.tggProductionVisualOwnerV179=owner||'missing';
    root.dataset.tggProductionVisualBuildV179='1000x-v179';
    root.dataset.tggProductionVisualCameraFarV179=String(Math.round(Number(camera.far||0)));
    root.dataset.tggProductionVisualPointLightsV179=String(pointLights);
    root.dataset.tggProductionVisualVisiblePointLightsV179=String(visiblePointLights);
    root.dataset.tggProductionVisualPointLightBudgetV179=pointLightBudget?'pass':'review';
    root.dataset.tggProductionVisualReadyV179=ready?'1':'0';

    last={ready,missing,owner,pointLights,visiblePointLights,cameraFar:Number(camera.far||0),sealPass,buildPass,pointLightBudget};
    window.TGGProductionVisualStateV179=last;
    return last;
  };

  window.TGGProductionVisualSentinelV179={inspect};
  inspect(true);
}
function applyProductionVisualSentinelV179(){window.TGGProductionVisualSentinelV179?.inspect?.(false)||installProductionVisualSentinelV179()}

function installProductionHandoffV180(){
  if(window.TGGProductionHandoffV180)return;
  let lastAt=0,last=null;
  const inspect=(force=false)=>{
    const now=performance.now();
    if(!force&&last&&now-lastAt<4000)return last;
    lastAt=now;

    const integrity=window.TGGBuildIntegrityV58?.inspect?.(force)||window.TGGBuildStatusV58||{};
    const sentinel=window.TGGProductionVisualSentinelV179?.inspect?.(force)||window.TGGProductionVisualStateV179||{};
    const seal=window.TGGWholeWorldSealV178?.audit?.(force)||window.__TGG_WHOLE_WORLD_SEAL_V178__||{};
    const owner=root.dataset.tggFinalVisualOwnerV177||'';

    const integrityPass=integrity.ok===true&&root.dataset.tggBuildIntegrityV58==='pass';
    const sentinelPass=sentinel.ready===true||root.dataset.tggProductionVisualReadyV179==='1';
    const sealPass=seal.ok===true||root.dataset.tggWholeWorldSealV178==='pass';
    const ownerPass=owner==='tgg-world-v177';
    const ready=integrityPass&&sentinelPass&&sealPass&&ownerPass;

    root.dataset.tggProductionHandoffV180=ready?'pass':'review';
    root.dataset.tggProductionHandoffBuildV180='1000x-v180';
    root.dataset.tggProductionHandoffIntegrityV180=integrityPass?'pass':'review';
    root.dataset.tggProductionHandoffSentinelV180=sentinelPass?'pass':'review';
    root.dataset.tggProductionHandoffSealV180=sealPass?'pass':'review';
    root.dataset.tggProductionHandoffOwnerV180=ownerPass?'tgg-world-v177':'mismatch';
    root.dataset.tggProductionHandoffReadyV180=ready?'1':'0';

    last={ready,integrityPass,sentinelPass,sealPass,ownerPass,owner};
    window.TGGProductionHandoffStateV180=last;
    return last;
  };

  window.TGGProductionHandoffV180={inspect};
  inspect(true);
}
function applyProductionHandoffV180(){window.TGGProductionHandoffV180?.inspect?.(false)||installProductionHandoffV180()}

function installPostHandoffRefinementV181(){
  if(window.TGGPostHandoffRefinementV181)return;
  const w=window.TGG3D,scene=w?.scene,camera=w?.camera;
  if(!scene||!camera){root.dataset.tggPostHandoffRefinementV181='waiting';return}

  let fogDensity=Number(scene.fog?.density||.0017);
  let fogColor=scene.fog?.color?.clone?.()||null;
  let cameraFar=Number(camera.far||5000);
  let lastDistrict=String(root.dataset.tggDistrict||'downtown');
  let transitionTicks=0;

  const nearGroups=[
    'TGG_STOREFRONT_GLASS_DEPTH_V90',
    'TGG_SIDEWALK_VARIATION_V83',
    'TGG_CURB_MEDIAN_V90',
    'TGG_STREET_RHYTHM_V82',
    'TGG_PUBLIC_BENCHES_V143',
    'TGG_PARKING_METERS_V143'
  ];
  const cached=new Map();
  const get=name=>{
    const old=cached.get(name);
    if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cached.set(name,next);
    return next;
  };

  const apply=()=>{
    const stateSnap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(stateSnap.district||root.dataset.tggDistrict||'downtown');
    const driving=!!(stateSnap.driving||root.dataset.tggDriving==='1'||state.driving);
    const quality=String(root.dataset.tggWholeWorldFidelityModeV169||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const balanced=quality==='balanced';

    if(district!==lastDistrict){
      lastDistrict=district;
      transitionTicks=4;
    }else if(transitionTicks>0)transitionTicks--;

    if(scene.fog){
      const targetDensity=Number(scene.fog.density||fogDensity);
      fogDensity+=(targetDensity-fogDensity)*(transitionTicks>0?.28:.55);
      scene.fog.density=fogDensity;

      if(fogColor&&scene.fog.color){
        const target=scene.fog.color.clone();
        fogColor.lerp(target,transitionTicks>0?.22:.5);
        scene.fog.color.copy(fogColor);
      }
    }

    const desiredFar=Math.max(Number(camera.far||0),driving?5200:4900);
    cameraFar+=(desiredFar-cameraFar)*(driving?.32:.5);
    if(Math.abs(Number(camera.far||0)-cameraFar)>.5){
      camera.far=cameraFar;
      camera.updateProjectionMatrix?.();
    }

    nearGroups.forEach((name,i)=>{
      const o=get(name);if(!o)return;
      const shouldShow=!balanced||!driving||i<3;
      if(shouldShow&&o.visible===false)o.visible=true;
      if(o.material?.transparent&&transitionTicks>0){
        const base=Number(o.userData?.tggBaseOpacityV181??o.material.opacity??1);
        if(o.userData)o.userData.tggBaseOpacityV181=base;
        o.material.opacity=Math.max(.08,base*(.72+(.07*(4-transitionTicks))));
      }else if(o.material?.transparent&&o.userData?.tggBaseOpacityV181!=null){
        o.material.opacity=Number(o.userData.tggBaseOpacityV181);
      }
    });

    const car=w.car;
    if(car?.traverse){
      car.traverse(o=>{
        if(!o?.isMesh||!o.material)return;
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{
          if(!m||!('envMapIntensity'in m))return;
          const target=driving?1.35:1.2;
          m.envMapIntensity+=(target-Number(m.envMapIntensity||1))*0.18;
        });
      });
    }

    const handoff=window.TGGProductionHandoffV180?.inspect?.(false)||window.TGGProductionHandoffStateV180||{};
    const ready=handoff.ready===true||root.dataset.tggProductionHandoffReadyV180==='1';

    root.dataset.tggPostHandoffRefinementV181='1';
    root.dataset.tggTransitionSmoothingV181=transitionTicks>0?'active':'settled';
    root.dataset.tggNearFieldHysteresisV181='enabled';
    root.dataset.tggCameraMaterialContinuityV181='enabled';
    root.dataset.tggRefinementOwnerV181='subordinate-to-v177';
    root.dataset.tggProductionChainV181=ready?'preserved':'review';
    root.dataset.tggRefinementBuildV181='1000x-v181';

    window.TGGPostHandoffRefinementStateV181={
      ready,transitionTicks,district,driving,quality,
      fogDensity:Number(scene.fog?.density||0),cameraFar:Number(camera.far||0)
    };
    return window.TGGPostHandoffRefinementStateV181;
  };

  window.TGGPostHandoffRefinementV181={apply};
  apply();
}
function applyPostHandoffRefinementV181(){window.TGGPostHandoffRefinementV181?.apply?.()||installPostHandoffRefinementV181()}

function installWorldTransitionBlendV182(){
  if(window.TGGWorldTransitionBlendV182)return;
  const w=window.TGG3D,scene=w?.scene,renderer=w?.renderer;
  if(!scene||!renderer){root.dataset.tggWorldTransitionBlendV182='waiting';return}

  let exposure=Number(renderer.toneMappingExposure||1);
  let fogDensity=Number(scene.fog?.density||.0017);
  let wetness=/rain|storm/.test(String(root.dataset.tggWeather||''))?1:0;
  let trafficBlend=1;
  let lastSig='';

  const lerp=(a,b,t)=>a+(b-a)*t;
  const getState=()=>{
    const s=window.__TGG_WORLD_STATE_V109__||{};
    return {
      district:String(s.district||root.dataset.tggDistrict||'downtown'),
      time:String(s.time||root.dataset.tggTime||'day'),
      weather:String(s.weather||root.dataset.tggWeather||'clear'),
      driving:!!(s.driving||root.dataset.tggDriving==='1'||state.driving),
      quality:String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high')
    };
  };

  const apply=()=>{
    const s=getState();
    const night=s.time==='night',gold=s.time==='golden';
    const storm=/storm/.test(s.weather),rain=/rain/.test(s.weather);
    const wetTarget=storm||rain?1:0;
    const balanced=s.quality==='balanced';

    const exposureTargets={
      downtown:1.08,studio:1.11,media:1.10,park:1.03,home:1.05,garage:1.07
    };
    let targetExposure=exposureTargets[s.district]||1.08;
    targetExposure+=(gold?.045:0)+(night?.018:0)-(storm?.07:rain?.028:0)-(balanced?.015:0);
    exposure=lerp(exposure,targetExposure,.22);
    renderer.toneMappingExposure=exposure;

    if(scene.fog){
      const base=s.district==='park'?.00144:s.district==='home'?.00154:s.district==='studio'?.00186:.00170;
      const targetFog=base+(night?.00009:0)+(rain?.00018:0)+(storm?.00017:0)-(s.driving?.00006:0);
      fogDensity=lerp(fogDensity,targetFog,.20);
      scene.fog.density=fogDensity;
    }

    wetness=lerp(wetness,wetTarget,.16);

    const roadNames=['TGG_TRAVEL_CORRIDORS_V23','TGG_HIGHWAY_NETWORK_V29','TGG_EVENT_ROUTE_V33'];
    roadNames.forEach(name=>{
      const g=scene.getObjectByName?.(name);if(!g)return;
      g.traverse?.(o=>{
        if(!o?.isMesh||!o.material)return;
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{
          if(!m||!('roughness'in m))return;
          const dry=.86,wet=.25;
          m.roughness=lerp(Number(m.roughness??dry),lerp(dry,wet,wetness),.24);
          if('metalness'in m)m.metalness=lerp(Number(m.metalness??.03),lerp(.03,.16,wetness),.24);
          if('envMapIntensity'in m)m.envMapIntensity=lerp(Number(m.envMapIntensity??.5),lerp(.5,1.15,wetness),.24);
        });
      });
    });

    const cityLights=scene.getObjectByName?.('TGG_CITY_LIGHT_DEPTH_V51');
    if(cityLights){
      cityLights.children.forEach((o,i)=>{
        if(!o?.isPointLight)return;
        const target=night&&!balanced?(1.25+(i%3)*.14):0;
        o.intensity=lerp(Number(o.intensity||0),target,.22);
      });
    }

    const traffic=w.traffic||[];
    const densityTarget=s.district==='downtown'?1:s.district==='studio'?.82:s.district==='media'?.9:s.district==='park'?.48:s.district==='home'?.62:.72;
    trafficBlend=lerp(trafficBlend,densityTarget,.18);
    traffic.forEach((v,i)=>{
      if(!v||v.visible===undefined)return;
      const threshold=Math.floor(traffic.length*trafficBlend);
      const shouldShow=i<=threshold;
      if(v.userData)v.userData.tggVisibilityBlendTargetV182=shouldShow?'1':'0';
      v.visible=shouldShow;
    });

    const glass=scene.getObjectByName?.('TGG_STOREFRONT_GLASS_DEPTH_V90');
    if(glass?.material){
      const targetOpacity=night?.28:(wetTarget?.24:.17);
      glass.material.opacity=lerp(Number(glass.material.opacity??targetOpacity),targetOpacity,.18);
      if('roughness'in glass.material)glass.material.roughness=lerp(Number(glass.material.roughness??.07),wetTarget?.03:.07,.18);
    }

    const sig=[s.district,s.time,s.weather,s.quality,s.driving?'1':'0'].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      root.dataset.tggWorldTransitionStateV182=sig;
    }
    root.dataset.tggWorldTransitionBlendV182='1';
    root.dataset.tggWorldTransitionExposureV182=exposure.toFixed(3);
    root.dataset.tggWorldTransitionFogV182=fogDensity.toFixed(5);
    root.dataset.tggWorldTransitionWetnessV182=wetness.toFixed(3);
    root.dataset.tggWorldTransitionTrafficV182=trafficBlend.toFixed(3);
    root.dataset.tggWorldTransitionModeV182='smoothed';
  };

  window.TGGWorldTransitionBlendV182={apply};
  apply();
}
function applyWorldTransitionBlendV182(){window.TGGWorldTransitionBlendV182?.apply?.()||installWorldTransitionBlendV182()}

function installStreetMaterialContinuityV183(){
  if(window.TGGStreetMaterialContinuityV183)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggStreetMaterialContinuityV183='waiting';return}

  const names=[
    'TGG_CURB_MEDIAN_V90',
    'TGG_SIDEWALK_VARIATION_V83',
    'TGG_STOREFRONT_GLASS_DEPTH_V90',
    'TGG_ROAD_MARKINGS_V82',
    'TGG_STREET_RHYTHM_V82'
  ];
  const cache=new Map();
  const get=name=>{
    const hit=cache.get(name);
    if(hit?.parent)return hit;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };

  let contactIntensity=0,lastSig='';
  const apply=()=>{
    const snap=window.__TGG_WORLD_STATE_V109__||{};
    const district=String(snap.district||root.dataset.tggDistrict||'downtown');
    const time=String(snap.time||root.dataset.tggTime||'day');
    const weather=String(snap.weather||root.dataset.tggWeather||'clear');
    const driving=!!(snap.driving||root.dataset.tggDriving==='1'||state.driving);
    const quality=String(root.dataset.tggWholeWorldFidelityModeV169||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const balanced=quality==='balanced',wet=/rain|storm/.test(weather),night=time==='night';

    const curb=get(names[0]),sidewalk=get(names[1]),glass=get(names[2]),markings=get(names[3]),rhythm=get(names[4]);
    if(curb?.material){
      curb.material.roughness+=( (wet?.58:.9)-Number(curb.material.roughness??.9) )*.22;
      if('metalness'in curb.material)curb.material.metalness=.02;
    }
    if(sidewalk?.material){
      sidewalk.material.roughness+=( (wet?.62:.94)-Number(sidewalk.material.roughness??.94) )*.22;
    }
    if(glass?.material){
      const targetOpacity=balanced?.12:night?.27:wet?.22:.17;
      glass.material.opacity+=(targetOpacity-Number(glass.material.opacity??targetOpacity))*.2;
      if('roughness'in glass.material){
        const r=wet?.035:.075;
        glass.material.roughness+=(r-Number(glass.material.roughness??r))*.2;
      }
    }
    if(markings?.material&&'opacity'in markings.material){
      markings.material.opacity=wet?.88:1;
    }
    if(rhythm?.material&&'roughness'in rhythm.material){
      rhythm.material.roughness=wet?.52:.7;
    }

    const contact=scene.getObjectByName?.('TGG_CONTACT_LIGHT_V90');
    if(contact){
      const target=balanced?0:(night?1.0:wet?.58:.3);
      contactIntensity+=(target-contactIntensity)*.24;
      contact.intensity=contactIntensity;
    }

    const carShadow=scene.getObjectByName?.('TGG_VEHICLE_CONTACT_V80');
    const avatarShadow=scene.getObjectByName?.('TGG_AVATAR_CONTACT_V77');
    if(carShadow?.material)carShadow.material.opacity=night?.35:wet?.32:.27;
    if(avatarShadow?.material)avatarShadow.material.opacity=night?.34:wet?.3:.24;

    const sig=[district,time,weather,driving?'1':'0',quality].join('|');
    if(sig!==lastSig){lastSig=sig;root.dataset.tggStreetContinuityStateV183=sig}

    const handoff=window.TGGProductionHandoffV180?.inspect?.(false)||{};
    root.dataset.tggStreetMaterialContinuityV183='1';
    root.dataset.tggStreetMaterialOwnerV183='subordinate-to-v177';
    root.dataset.tggContactLightBlendV183='smoothed';
    root.dataset.tggNearFieldMaterialSetV183='curb-sidewalk-glass-markings-rhythm';
    root.dataset.tggProductionChainV183=(handoff.ready===true||root.dataset.tggProductionHandoffReadyV180==='1')?'preserved':'review';
  };

  window.TGGStreetMaterialContinuityV183={apply};
  apply();
}
function applyStreetMaterialContinuityV183(){window.TGGStreetMaterialContinuityV183?.apply?.()||installStreetMaterialContinuityV183()}

function installRuntimeConvergenceV184(){
  if(window.TGGRuntimeConvergenceV184)return;
  let timer=0,pending=false,lastRun=0,runs=0,coalesced=0,lastReason='boot';
  const minGap=220;
  const schedule=(reason='event')=>{
    lastReason=reason;
    const now=performance.now();
    if(pending){coalesced++;root.dataset.tggRuntimeCoalescedV184=String(coalesced);return false}
    const delay=Math.max(0,minGap-(now-lastRun));
    pending=true;
    timer=setTimeout(()=>{
      pending=false;lastRun=performance.now();runs++;
      root.dataset.tggRuntimeRunsV184=String(runs);
      root.dataset.tggRuntimeLastReasonV184=lastReason;
      try{ui();tick()}catch{}
    },delay);
    return true;
  };
  const inspect=()=>{
    root.dataset.tggRuntimeConvergenceV184='1';
    root.dataset.tggMutationTickModeV184='debounced-coalesced';
    root.dataset.tggRuntimeMinGapV184=String(minGap);
    root.dataset.tggRuntimeSchedulerOwnerV184='tgg-world-v184';
    root.dataset.tggProductionChainV184=
      root.dataset.tggProductionHandoffReadyV180==='1'&&
      root.dataset.tggStreetMaterialContinuityV183==='1'?'preserved':'review';
    return {runs,coalesced,pending,lastReason,minGap};
  };
  window.TGGRuntimeConvergenceV184={schedule,inspect};
  inspect();
}
function applyRuntimeConvergenceV184(){window.TGGRuntimeConvergenceV184?.inspect?.()||installRuntimeConvergenceV184()}

function installDeploymentConvergenceV185(){
  if(window.TGGDeploymentConvergenceV185)return;
  const inspect=()=>{
    const build=window.TGGBuildIntegrityV58?.inspect?.(false)||window.TGGBuildStatusV58||{};
    const checks={
      build:!!build.ok,
      finalVerification:root.dataset.tggWholeWorldReadyV175==='pass',
      visualOwner:root.dataset.tggFinalVisualOwnerV177==='tgg-world-v177',
      seal:root.dataset.tggWholeWorldSealReadyV178==='1',
      sentinel:root.dataset.tggProductionVisualReadyV179==='1',
      handoff:root.dataset.tggProductionHandoffReadyV180==='1',
      runtime:root.dataset.tggRuntimeConvergenceV184==='1'&&root.dataset.tggProductionChainV184==='preserved'
    };
    const missing=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
    const ready=missing.length===0;
    root.dataset.tggDeploymentConvergenceV185='1';
    root.dataset.tggDeploymentReadinessV185=ready?'pass':'review';
    root.dataset.tggDeploymentMissingV185=missing.join(',')||'none';
    root.dataset.tggDeploymentBuildV185='1000x-v185';
    root.dataset.tggDeploymentVisualOwnerV185='tgg-world-v177';
    root.dataset.tggDeploymentRuntimeOwnerV185='tgg-world-v184';
    root.dataset.tggDeploymentReleaseTrackV185='whole-world-convergence-v185';
    root.dataset.tggSourceDeploymentGapV185=ready?'closed':'pending';
    root.dataset.tggWholeWorldPreservedV185='1';
    return {ready,missing,checks};
  };
  window.TGGDeploymentConvergenceV185={inspect};
  inspect();
}
function applyDeploymentConvergenceV185(){window.TGGDeploymentConvergenceV185?.inspect?.()||installDeploymentConvergenceV185()}

function installReleaseBridgeV186(){
  if(window.TGGReleaseBridgeV186)return;
  const inspect=()=>{
    const deployment=window.TGGDeploymentConvergenceV185?.inspect?.()||{};
    const build=window.TGGBuildIntegrityV58?.inspect?.(false)||window.TGGBuildStatusV58||{};
    const visualOwner=root.dataset.tggFinalVisualOwnerV177||'';
    const runtimeOwner=root.dataset.tggRuntimeSchedulerOwnerV184||'';
    const checks={
      build:!!build.ok,
      deployment:deployment.ready===true||root.dataset.tggDeploymentReadinessV185==='pass',
      visual:visualOwner==='tgg-world-v177',
      runtime:runtimeOwner==='tgg-world-v184',
      preserved:root.dataset.tggWholeWorldPreservedV185==='1'
    };
    const missing=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
    const ready=missing.length===0;
    root.dataset.tggReleaseBridgeV186='1';
    root.dataset.tggReleaseBridgeReadyV186=ready?'pass':'review';
    root.dataset.tggReleaseBridgeMissingV186=missing.join(',')||'none';
    root.dataset.tggReleaseSourceV186='1000x-v186';
    root.dataset.tggReleaseVisualOwnerV186=visualOwner||'missing';
    root.dataset.tggReleaseRuntimeOwnerV186=runtimeOwner||'missing';
    root.dataset.tggReleaseDeploymentOwnerV186='tgg-world-v185';
    root.dataset.tggReleaseChainV186='v177-visual+v184-runtime+v185-deployment';
    root.dataset.tggReleaseWholeWorldV186='preserved';
    return {ready,missing,checks};
  };
  window.TGGReleaseBridgeV186={inspect};
  inspect();
}
function applyReleaseBridgeV186(){window.TGGReleaseBridgeV186?.inspect?.()||installReleaseBridgeV186()}

function installReleaseAcceptanceV187(){
  if(window.TGGReleaseAcceptanceV187)return;
  const inspect=()=>{
    const build=window.TGGBuildIntegrityV58?.inspect?.(false)||window.TGGBuildStatusV58||{};
    const bridge=window.TGGReleaseBridgeV186?.inspect?.()||{};
    const checks={
      build:!!build.ok,
      bridge:bridge.ready===true||root.dataset.tggReleaseBridgeReadyV186==='pass',
      visual:root.dataset.tggFinalVisualOwnerV177==='tgg-world-v177',
      runtime:root.dataset.tggRuntimeSchedulerOwnerV184==='tgg-world-v184',
      deployment:root.dataset.tggDeploymentReadinessV185==='pass',
      preserved:root.dataset.tggReleaseWholeWorldV186==='preserved',
      sourceGap:root.dataset.tggSourceDeploymentGapV185==='closed'
    };
    const missing=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
    const ready=missing.length===0;
    root.dataset.tggReleaseAcceptanceV187='1';
    root.dataset.tggReleaseAcceptanceReadyV187=ready?'pass':'review';
    root.dataset.tggReleaseAcceptanceMissingV187=missing.join(',')||'none';
    root.dataset.tggReleaseAcceptanceScoreV187=String(Object.values(checks).filter(Boolean).length)+'/7';
    root.dataset.tggReleaseAcceptanceBuildV187='1000x-v187';
    root.dataset.tggReleaseAcceptanceVisualOwnerV187='tgg-world-v177';
    root.dataset.tggReleaseAcceptanceRuntimeOwnerV187='tgg-world-v184';
    root.dataset.tggReleaseAcceptanceDeploymentOwnerV187='tgg-world-v185';
    root.dataset.tggReleaseAcceptanceBridgeOwnerV187='tgg-world-v186';
    root.dataset.tggReleaseAcceptanceWholeWorldV187='preserved';
    root.dataset.tggReleaseTrackV187='whole-world-release-acceptance';
    return {ready,missing,checks};
  };
  window.TGGReleaseAcceptanceV187={inspect};
  inspect();
}
function applyReleaseAcceptanceV187(){window.TGGReleaseAcceptanceV187?.inspect?.()||installReleaseAcceptanceV187()}

function installPostAcceptancePolishV188(){
  if(window.TGGPostAcceptancePolishV188)return;
  const w=window.TGG3D,scene=w?.scene,camera=w?.camera;
  if(!scene||!camera){root.dataset.tggPostAcceptancePolishV188='waiting';return}
  const cache=new Map(),get=name=>{
    const old=cache.get(name);if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;if(next)cache.set(name,next);return next;
  };
  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const quality=String(root.dataset.tggWholeWorldFidelityModeV169||root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=quality==='balanced';
    const sig=[district,weather,time,quality,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      const glass=get('TGG_STOREFRONT_GLASS_DEPTH_V90');
      const windows=get('TGG_WINDOW_REFLECTIONS_V83');
      const roads=get('TGG_ROAD_MARKINGS_V82');
      const clutter=get('TGG_STREET_CLUTTER_V84');
      const foliage=get('TGG_FOLIAGE_VARIETY_V83');
      const skyline=get('TGG_SKYLINE_SILHOUETTES_V82');

      if(glass?.material){
        glass.material.opacity=balanced?.12:night?.3:wet?.25:.18;
        if('roughness'in glass.material)glass.material.roughness=wet?.035:.075;
      }
      if(windows?.material){
        windows.material.opacity=balanced?.1:night?.31:wet?.25:.19;
        if('roughness'in windows.material)windows.material.roughness=wet?.04:.09;
      }
      if(roads?.material)roads.material.opacity=wet?.92:1;
      if(clutter)clutter.visible=district!=='park'&&(!balanced||district==='downtown');
      if(foliage)foliage.visible=(district==='park'||district==='home'||driving)&&!balanced;
      if(skyline)skyline.visible=!balanced||district==='downtown'||district==='media';

      const exposureBase={downtown:1.07,studio:1.10,media:1.11,park:1.03,home:1.04,garage:1.06}[district]||1.07;
      if(w.renderer)w.renderer.toneMappingExposure=exposureBase+(time==='golden'?.05:0)-(weather==='storm'?.07:0);
      camera.far=Math.max(Number(camera.far||0),5000);
      camera.updateProjectionMatrix?.();
    }

    const acceptance=window.TGGReleaseAcceptanceV187?.inspect?.()||{};
    const releaseReady=acceptance.ready===true||root.dataset.tggReleaseAcceptanceReadyV187==='pass';
    const ownerOk=root.dataset.tggFinalVisualOwnerV177==='tgg-world-v177';
    const runtimeOk=root.dataset.tggRuntimeSchedulerOwnerV184==='tgg-world-v184';
    const bridgeOk=root.dataset.tggReleaseBridgeReadyV186==='pass';
    const ready=releaseReady&&ownerOk&&runtimeOk&&bridgeOk;

    root.dataset.tggPostAcceptancePolishV188='1';
    root.dataset.tggPostAcceptanceReadyV188=ready?'pass':'review';
    root.dataset.tggPostAcceptanceBuildV188='1000x-v188';
    root.dataset.tggPostAcceptanceVisualOwnerV188=root.dataset.tggFinalVisualOwnerV177||'missing';
    root.dataset.tggPostAcceptanceRuntimeOwnerV188=root.dataset.tggRuntimeSchedulerOwnerV184||'missing';
    root.dataset.tggPostAcceptanceBridgeV188=bridgeOk?'pass':'review';
    root.dataset.tggPostAcceptanceReleaseV188=releaseReady?'pass':'review';
    root.dataset.tggPostAcceptanceCameraFarV188=String(Math.round(Number(camera.far||0)));
    root.dataset.tggPostAcceptanceModeV188='non-destructive-refinement';
    root.dataset.tggWholeWorldPreservedV188='1';
  };
  window.TGGPostAcceptancePolishV188={apply};
  apply();
}
function applyPostAcceptancePolishV188(){window.TGGPostAcceptancePolishV188?.apply?.()||installPostAcceptancePolishV188()}

function installPostAcceptanceGroundingV189(){
  if(window.TGGPostAcceptanceGroundingV189)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggPostAcceptanceGroundingV189='waiting';return}
  const cache=new Map(),get=name=>{
    const old=cache.get(name);if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;if(next)cache.set(name,next);return next;
  };
  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||root.dataset.tggGraphicsAdaptiveV55||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const wet=/rain|storm/.test(weather),night=time==='night',balanced=/balanced/.test(budget);
    const sig=[district,weather,time,budget,driving?'1':'0'].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      const curbs=get('TGG_CURB_MEDIAN_V90');
      const glass=get('TGG_STOREFRONT_GLASS_DEPTH_V90');
      const props=get('TGG_TERRAIN_PROPS_V90');
      const avatarShadow=get('TGG_AVATAR_CONTACT_V77');
      const vehicleShadow=get('TGG_VEHICLE_CONTACT_V80');
      const contact=get('TGG_CONTACT_LIGHT_V90');

      if(curbs?.material){
        curbs.material.roughness=wet?.58:.9;
        curbs.material.color.setHex(district==='home'?0x8a857a:district==='studio'?0x74727d:district==='park'?0x6f756b:0x7a7f86);
      }
      if(glass?.material){
        glass.material.opacity=balanced?.11:night?.3:wet?.26:.18;
        if('roughness'in glass.material)glass.material.roughness=wet?.03:.07;
      }
      if(props){
        props.visible=(district==='park'||district==='home'||driving)&&!balanced;
      }
      if(avatarShadow?.material)avatarShadow.material.opacity=night?.37:wet?.32:.26;
      if(vehicleShadow?.material)vehicleShadow.material.opacity=night?.38:wet?.35:.29;
      if(contact){
        contact.intensity=balanced?0:(night?1.08:wet?.65:.36);
      }
    }

    const acceptance=window.TGGReleaseAcceptanceV187?.inspect?.()||{};
    const releaseReady=acceptance.ready===true||root.dataset.tggReleaseAcceptanceReadyV187==='pass';
    const ownerOk=root.dataset.tggFinalVisualOwnerV177==='tgg-world-v177';
    const runtimeOk=root.dataset.tggRuntimeSchedulerOwnerV184==='tgg-world-v184';
    const bridgeOk=root.dataset.tggReleaseBridgeReadyV186==='pass';
    const preserved=releaseReady&&ownerOk&&runtimeOk&&bridgeOk;

    root.dataset.tggPostAcceptanceGroundingV189='1';
    root.dataset.tggPostAcceptanceGroundingReadyV189=preserved?'pass':'review';
    root.dataset.tggPostAcceptanceGroundingBuildV189='1000x-v189';
    root.dataset.tggGroundingRefinementModeV189='non-destructive';
    root.dataset.tggCurbGroundingRefinementV189='1';
    root.dataset.tggGlassDepthRefinementV189='1';
    root.dataset.tggContactShadowRefinementV189='1';
    root.dataset.tggWholeWorldPreservedV189='1';
  };
  window.TGGPostAcceptanceGroundingV189={apply};
  apply();
}
function applyPostAcceptanceGroundingV189(){window.TGGPostAcceptanceGroundingV189?.apply?.()||installPostAcceptanceGroundingV189()}

function installWholeWorldHarmonizationV190(){
  if(window.TGGWholeWorldHarmonizationV190)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWholeWorldHarmonizationV190='waiting';return}

  const names=[
    'TGG_BUILDING_WINDOWS_V75','TGG_COUNTRYSIDE_BELT_V76','TGG_STOREFRONT_FRONTAGE_V77',
    'TGG_RAIN_PARTICLES_V78','TGG_PREMIUM_FRONTAGE_V79','TGG_STREET_REFLECTION_ACCENTS_V80',
    'TGG_TERRAIN_COLOR_BREAKUP_V81','TGG_SKYLINE_SILHOUETTES_V82','TGG_WINDOW_REFLECTIONS_V83',
    'TGG_CLOUD_DEPTH_V84','TGG_CURB_MEDIAN_V90','TGG_OVERPASS_BRIDGES_V88',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89','TGG_INTERIOR_GLOW_DEPTH_V80'
  ];
  const cache=new Map();
  const get=name=>{
    const old=cache.get(name);
    if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||root.dataset.tggGraphicsAdaptiveV55||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const wet=/rain|storm/.test(weather),night=time==='night',gold=time==='golden',balanced=/balanced/.test(budget);
    const sig=[district,weather,time,budget,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      const city=district==='downtown'||district==='studio'||district==='media'||district==='garage';
      const country=district==='park'||district==='home';

      const windows=get('TGG_BUILDING_WINDOWS_V75');
      if(windows){
        windows.visible=!balanced&&(night||gold);
        if(windows.material)windows.material.opacity=night?.62:gold?.34:.2;
      }

      const countryside=get('TGG_COUNTRYSIDE_BELT_V76');
      if(countryside)countryside.visible=country||driving;

      const storefront=get('TGG_STOREFRONT_FRONTAGE_V77');
      if(storefront)storefront.visible=city&&!balanced;

      const rain=get('TGG_RAIN_PARTICLES_V78');
      if(rain)rain.visible=wet&&!balanced;

      const premium=get('TGG_PREMIUM_FRONTAGE_V79');
      if(premium)premium.visible=city;

      const reflect=get('TGG_STREET_REFLECTION_ACCENTS_V80');
      if(reflect){
        reflect.visible=(night||wet)&&!balanced&&city;
        if(reflect.material)reflect.material.opacity=wet?.17:night?.11:.05;
      }

      const terrain=get('TGG_TERRAIN_COLOR_BREAKUP_V81');
      if(terrain)terrain.visible=country&&!balanced;

      const skyline=get('TGG_SKYLINE_SILHOUETTES_V82');
      if(skyline)skyline.visible=city&&(!balanced||district==='downtown');

      const glass=get('TGG_WINDOW_REFLECTIONS_V83');
      if(glass)glass.visible=city&&!balanced;

      const clouds=get('TGG_CLOUD_DEPTH_V84');
      if(clouds){
        clouds.visible=!balanced;
        if(clouds.material)clouds.material.opacity=weather==='storm'?.2:wet?.16:night?.07:.12;
      }

      const curbs=get('TGG_CURB_MEDIAN_V90');
      if(curbs)curbs.visible=!country||driving;

      const bridges=get('TGG_OVERPASS_BRIDGES_V88');
      if(bridges)bridges.visible=driving||district==='downtown'||district==='garage';

      const transition=get('TGG_DISTRICT_TRANSITION_CORRIDORS_V89');
      if(transition)transition.visible=driving||city;

      const interior=get('TGG_INTERIOR_GLOW_DEPTH_V80');
      if(interior){
        interior.visible=(night||gold)&&city&&!balanced;
        if(interior.material)interior.material.opacity=night?.28:.14;
      }

      if(scene.fog){
        const base=country?.00148:driving?.00158:.00172;
        scene.fog.density=base+(wet?.0003:0)+(night?.00012:0);
      }

      if(w.renderer){
        const base=night?1.05:gold?1.13:1.08;
        w.renderer.toneMappingExposure=base-(weather==='storm'?.08:wet?.03:0);
      }
    }

    const acceptance=window.TGGReleaseAcceptanceV187?.inspect?.()||{};
    const ready=acceptance.ready===true||root.dataset.tggReleaseAcceptanceReadyV187==='pass';
    const preserved=
      ready&&
      root.dataset.tggFinalVisualOwnerV177==='tgg-world-v177'&&
      root.dataset.tggRuntimeSchedulerOwnerV184==='tgg-world-v184'&&
      root.dataset.tggReleaseBridgeReadyV186==='pass';

    root.dataset.tggWholeWorldHarmonizationV190='1';
    root.dataset.tggWholeWorldHarmonizationReadyV190=preserved?'pass':'review';
    root.dataset.tggWorldLayerCoordinationV190='district-time-weather-budget';
    root.dataset.tggWorldLayerModeV190=balanced?'balanced':'high';
    root.dataset.tggWorldLayerDistrictV190=district;
    root.dataset.tggWorldLayerDrivingV190=driving?'1':'0';
    root.dataset.tggPostAcceptancePreservedV190='1';
    root.dataset.tggWholeWorldHarmonizationBuildV190='1000x-v190';
  };

  window.TGGWholeWorldHarmonizationV190={apply};
  apply();
}
function applyWholeWorldHarmonizationV190(){window.TGGWholeWorldHarmonizationV190?.apply?.()||installWholeWorldHarmonizationV190()}

function installWholeWorldAuthorityV191(){
  if(window.TGGWholeWorldAuthorityV191)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggWholeWorldAuthorityV191='waiting';return}

  const controlled=[
    'TGG_BUILDING_WINDOWS_V75','TGG_COUNTRYSIDE_BELT_V76','TGG_STOREFRONT_FRONTAGE_V77',
    'TGG_RAIN_PARTICLES_V78','TGG_PREMIUM_FRONTAGE_V79','TGG_STREET_REFLECTION_ACCENTS_V80',
    'TGG_TERRAIN_COLOR_BREAKUP_V81','TGG_SKYLINE_SILHOUETTES_V82','TGG_WINDOW_REFLECTIONS_V83',
    'TGG_CLOUD_DEPTH_V84','TGG_CURB_MEDIAN_V90','TGG_OVERPASS_BRIDGES_V88',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89','TGG_INTERIOR_GLOW_DEPTH_V80',
    'TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_DISTANT_TERRAIN_V84','TGG_FOLIAGE_VARIETY_V83',
    'TGG_STREET_CLUTTER_V84','TGG_PARK_WATER_V84'
  ];
  const cache=new Map();
  const get=name=>{
    const old=cache.get(name);
    if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };

  let lastSig='';
  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||root.dataset.tggGraphicsAdaptiveV55||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const wet=/rain|storm/.test(weather),night=time==='night',gold=time==='golden';
    const balanced=/balanced/.test(budget);
    const city=['downtown','studio','media','garage'].includes(district);
    const country=['park','home'].includes(district);
    const sig=[district,weather,time,budget,driving?'1':'0'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      const setVisible=(name,on)=>{const o=get(name);if(o)o.visible=!!on;return o};

      const windows=setVisible('TGG_BUILDING_WINDOWS_V75',city&&!balanced&&(night||gold));
      if(windows?.material)windows.material.opacity=night?.62:.34;

      setVisible('TGG_COUNTRYSIDE_BELT_V76',country||driving);
      setVisible('TGG_STOREFRONT_FRONTAGE_V77',city&&!balanced);
      setVisible('TGG_RAIN_PARTICLES_V78',wet&&!balanced);
      setVisible('TGG_PREMIUM_FRONTAGE_V79',city);
      const refl=setVisible('TGG_STREET_REFLECTION_ACCENTS_V80',city&&!balanced&&(night||wet));
      if(refl?.material)refl.material.opacity=wet?.17:.11;
      setVisible('TGG_TERRAIN_COLOR_BREAKUP_V81',country&&!balanced);
      setVisible('TGG_SKYLINE_SILHOUETTES_V82',city&&(!balanced||district==='downtown'));
      setVisible('TGG_WINDOW_REFLECTIONS_V83',city&&!balanced);
      setVisible('TGG_CLOUD_DEPTH_V84',!balanced);
      setVisible('TGG_CURB_MEDIAN_V90',!country||driving);
      setVisible('TGG_OVERPASS_BRIDGES_V88',driving||district==='downtown'||district==='garage');
      setVisible('TGG_DISTRICT_TRANSITION_CORRIDORS_V89',driving||city);
      setVisible('TGG_INTERIOR_GLOW_DEPTH_V80',city&&!balanced&&(night||gold));
      setVisible('TGG_STOREFRONT_GLASS_DEPTH_V90',city&&!balanced);
      setVisible('TGG_DISTANT_TERRAIN_V84',country||driving);
      setVisible('TGG_FOLIAGE_VARIETY_V83',country&&!balanced);
      setVisible('TGG_STREET_CLUTTER_V84',city&&(!balanced||district==='downtown'));
      setVisible('TGG_PARK_WATER_V84',district==='park'||driving);

      if(scene.fog){
        const base=country?.00148:driving?.00158:.00172;
        scene.fog.density=base+(wet?.0003:0)+(night?.00012:0);
      }
      if(w.renderer){
        const exposure=night?1.05:gold?1.13:1.08;
        w.renderer.toneMappingExposure=exposure-(weather==='storm'?.08:wet?.03:0);
      }
    }

    const contact=scene.getObjectByName?.('TGG_CONTACT_LIGHT_V90');
    if(contact&&contact.intensity>0){
      const cap=balanced?.42:night?1.0:.62;
      contact.intensity=Math.min(contact.intensity,cap);
    }

    root.dataset.tggWholeWorldAuthorityV191='1';
    root.dataset.tggWholeWorldOwnerV191='final-convergence';
    root.dataset.tggWholeWorldControlledSystemsV191=String(controlled.length);
    root.dataset.tggWholeWorldConflictPolicyV191='last-writer-authority';
    root.dataset.tggWholeWorldVisualStateV191=[district,time,weather,budget].join(':');
    root.dataset.tggWholeWorldStableV191='1';
  };

  window.TGGWholeWorldAuthorityV191={apply,controlled:[...controlled]};
  apply();
}
function applyWholeWorldAuthorityV191(){window.TGGWholeWorldAuthorityV191?.apply?.()||installWholeWorldAuthorityV191()}

function installPostAuthorityRefinementV192(){
  if(window.TGGPostAuthorityRefinementV192)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggPostAuthorityRefinementV192='waiting';return}

  const targets=[
    'TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_CURB_MEDIAN_V90','TGG_SIDEWALK_VARIATION_V83',
    'TGG_STREET_RHYTHM_V82','TGG_WINDOW_REFLECTIONS_V83','TGG_INTERIOR_GLOW_DEPTH_V80'
  ];
  const cache=new Map();
  const get=name=>{
    const old=cache.get(name);
    if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };

  let lastSig='',settleTicks=0,lastDistrict=String(root.dataset.tggDistrict||'downtown');
  const opacityState=new Map();
  const smoothOpacity=(obj,target,rate=.35)=>{
    if(!obj?.material?.transparent)return;
    const key=obj.name||String(target);
    const prev=opacityState.has(key)?opacityState.get(key):Number(obj.material.opacity??target);
    const next=prev+(target-prev)*rate;
    opacityState.set(key,next);
    obj.material.opacity=next;
  };

  const apply=()=>{
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||root.dataset.tggGraphicsAdaptiveV55||'high');
    const driving=root.dataset.tggDriving==='1'||state.driving;
    const balanced=/balanced/.test(budget),night=time==='night',gold=time==='golden',wet=/rain|storm/.test(weather);
    const city=['downtown','studio','media','garage'].includes(district);
    const sig=[district,time,weather,budget,driving?'1':'0'].join('|');

    if(district!==lastDistrict){
      lastDistrict=district;
      settleTicks=5;
    }else if(settleTicks>0)settleTicks--;

    if(sig!==lastSig){
      lastSig=sig;
      targets.forEach(name=>get(name));
    }

    const glass=get('TGG_STOREFRONT_GLASS_DEPTH_V90');
    if(glass){
      const on=city&&!balanced;
      if(on)glass.visible=true;
      smoothOpacity(glass,on?(night?.28:wet?.24:.17):0,settleTicks>0?.22:.42);
      if(!on&&Number(glass.material?.opacity||0)<.015)glass.visible=false;
    }

    const win=get('TGG_WINDOW_REFLECTIONS_V83');
    if(win){
      const on=city&&!balanced;
      if(on)win.visible=true;
      smoothOpacity(win,on?(night?.3:wet?.26:.18):0,settleTicks>0?.2:.4);
      if(!on&&Number(win.material?.opacity||0)<.015)win.visible=false;
    }

    const interior=get('TGG_INTERIOR_GLOW_DEPTH_V80');
    if(interior){
      const on=city&&!balanced&&(night||gold);
      if(on)interior.visible=true;
      smoothOpacity(interior,on?(night?.28:.14):0,settleTicks>0?.2:.38);
      if(!on&&Number(interior.material?.opacity||0)<.015)interior.visible=false;
    }

    const curbs=get('TGG_CURB_MEDIAN_V90');
    const sidewalks=get('TGG_SIDEWALK_VARIATION_V83');
    const rhythm=get('TGG_STREET_RHYTHM_V82');
    if(curbs)curbs.visible=!['park','home'].includes(district)||driving||settleTicks>0;
    if(sidewalks)sidewalks.visible=district!=='park'||!balanced||settleTicks>0;
    if(rhythm)rhythm.visible=!balanced||district==='downtown'||district==='studio'||settleTicks>0;

    const contact=scene.getObjectByName?.('TGG_CONTACT_LIGHT_V90');
    if(contact){
      const cap=balanced?.38:night?.92:wet?.58:.48;
      const target=Math.min(Number(contact.intensity||0),cap);
      const prev=Number(root.dataset.tggContactLightSmoothedV192||target);
      const next=prev+(target-prev)*(settleTicks>0?.24:.48);
      contact.intensity=next;
      root.dataset.tggContactLightSmoothedV192=String(next.toFixed(3));
    }

    const authorityOk=
      root.dataset.tggWholeWorldAuthorityV191==='1'&&
      root.dataset.tggWholeWorldOwnerV191==='final-convergence'&&
      root.dataset.tggReleaseAcceptanceReadyV187==='pass';

    root.dataset.tggPostAuthorityRefinementV192=authorityOk?'1':'review';
    root.dataset.tggPostAuthorityOwnerV192='subordinate-to-v191';
    root.dataset.tggNearFieldTransitionV192='smoothed';
    root.dataset.tggContactLightTransitionV192='smoothed';
    root.dataset.tggAuthorityPreservedV192=authorityOk?'1':'0';
    root.dataset.tggTransitionSettleTicksV192=String(settleTicks);
  };

  window.TGGPostAuthorityRefinementV192={apply};
  apply();
}
function applyPostAuthorityRefinementV192(){window.TGGPostAuthorityRefinementV192?.apply?.()||installPostAuthorityRefinementV192()}

function installWholeWorldConflictAuditV193(){
  if(window.TGGWholeWorldConflictAuditV193)return;
  const scene=window.TGG3D?.scene;
  if(!scene){root.dataset.tggWholeWorldConflictAuditV193='waiting';return}

  const authoritative=new Set([
    'TGG_BUILDING_WINDOWS_V75','TGG_COUNTRYSIDE_BELT_V76','TGG_STOREFRONT_FRONTAGE_V77',
    'TGG_RAIN_PARTICLES_V78','TGG_PREMIUM_FRONTAGE_V79','TGG_STREET_REFLECTION_ACCENTS_V80',
    'TGG_TERRAIN_COLOR_BREAKUP_V81','TGG_SKYLINE_SILHOUETTES_V82','TGG_WINDOW_REFLECTIONS_V83',
    'TGG_CLOUD_DEPTH_V84','TGG_CURB_MEDIAN_V90','TGG_OVERPASS_BRIDGES_V88',
    'TGG_DISTRICT_TRANSITION_CORRIDORS_V89','TGG_INTERIOR_GLOW_DEPTH_V80',
    'TGG_STOREFRONT_GLASS_DEPTH_V90','TGG_DISTANT_TERRAIN_V84','TGG_FOLIAGE_VARIETY_V83',
    'TGG_STREET_CLUTTER_V84','TGG_PARK_WATER_V84','TGG_CONTACT_LIGHT_V90',
    'TGG_AVATAR_CONTACT_V77','TGG_VEHICLE_CONTACT_V80'
  ]);

  let lastAudit=0,duplicateCount=0,lastAuthorityStamp='';
  const audit=()=>{
    const now=performance.now();
    if(now-lastAudit<6000)return;
    lastAudit=now;

    const first=new Map();
    duplicateCount=0;
    scene.traverse?.(o=>{
      const name=String(o?.name||'');
      if(!authoritative.has(name))return;
      if(!first.has(name)){first.set(name,o);return}
      duplicateCount++;
      if(o.visible!==undefined)o.visible=false;
      o.userData=o.userData||{};
      o.userData.tggSuppressedDuplicateV193=1;
    });

    root.dataset.tggWholeWorldDuplicateLayersV193=String(duplicateCount);
    root.dataset.tggWholeWorldDuplicatePolicyV193='suppress-nondestructive';
    root.dataset.tggWholeWorldAuditAtV193=String(Date.now());
  };

  const apply=()=>{
    audit();
    window.TGGWholeWorldAuthorityV191?.apply?.();
    window.TGGPostAuthorityRefinementV192?.apply?.();

    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const budget=String(root.dataset.tggWholeWorldBudgetModeV129||root.dataset.tggGraphicsAdaptiveV55||'high');
    const stamp=[district,weather,time,budget,root.dataset.tggDriving||'0'].join('|');

    if(stamp!==lastAuthorityStamp){
      lastAuthorityStamp=stamp;
      root.dataset.tggWholeWorldAuthorityStampV193=stamp;
    }

    root.dataset.tggWholeWorldFinalOwnerV193='v191+v192';
    root.dataset.tggWholeWorldConflictAuditV193='1';
    root.dataset.tggWholeWorldConflictStateV193=duplicateCount===0?'clean':'duplicates-suppressed';
    root.dataset.tggWholeWorldPreservedV193='1';
  };

  window.TGGWholeWorldConflictAuditV193={apply,audit};
  apply();
}
function applyWholeWorldConflictAuditV193(){window.TGGWholeWorldConflictAuditV193?.apply?.()||installWholeWorldConflictAuditV193()}

function installAdaptiveSceneBudgetV194(){
  if(window.TGGAdaptiveSceneBudgetV194)return;
  const w=window.TGG3D,scene=w?.scene,camera=w?.camera;
  if(!scene||!camera){root.dataset.tggAdaptiveSceneBudgetV194='waiting';return}

  const tracked=[
    ['TGG_CLOUD_DEPTH_V84',42,'far'],
    ['TGG_DISTANT_TERRAIN_V84',80,'far'],
    ['TGG_SKYLINE_SILHOUETTES_V82',96,'far'],
    ['TGG_COUNTRYSIDE_BELT_V76',null,'far'],
    ['TGG_WINDOW_REFLECTIONS_V83',144,'mid'],
    ['TGG_FOLIAGE_VARIETY_V83',180,'mid'],
    ['TGG_STREET_CLUTTER_V84',96,'mid'],
    ['TGG_ROAD_SURFACE_VARIATION_V131',220,'mid'],
    ['TGG_STOREFRONT_GLASS_DEPTH_V90',72,'near'],
    ['TGG_SIDEWALK_VARIATION_V83',160,'near'],
    ['TGG_ROAD_MARKINGS_V82',180,'near'],
    ['TGG_STREET_RHYTHM_V82',128,'near'],
    ['TGG_PUDDLE_ACCENTS_V141',null,'near'],
    ['TGG_STREET_FURNITURE_V139',null,'near'],
    ['TGG_PUBLIC_REALM_V144',null,'life'],
    ['TGG_DESTINATION_AMBIENT_PEOPLE_V137',null,'life']
  ];

  const cache=new Map();
  const get=(name)=>{
    const old=cache.get(name);
    if(old?.parent)return old;
    const next=scene.getObjectByName?.(name)||null;
    if(next)cache.set(name,next);
    return next;
  };
  const baseCounts=new Map();
  tracked.forEach(([name,count])=>{if(Number.isFinite(count))baseCounts.set(name,count)});

  let lastMode='',lastSig='',lowSince=0,highSince=0;
  const modeFor=(fps,quality,driving,speed)=>{
    const now=performance.now();
    if(fps<36){if(!lowSince)lowSince=now;highSince=0}
    else if(fps>52){if(!highSince)highSince=now;lowSince=0}
    else {lowSince=0;highSince=0}
    const sustainedLow=lowSince&&now-lowSince>1800;
    const sustainedHigh=highSince&&now-highSince>3500;
    if(quality==='balanced'||sustainedLow)return 'performance';
    if(driving&&speed>26&&fps<46)return 'travel';
    if(lastMode==='performance'&&!sustainedHigh)return 'performance';
    return 'cinematic';
  };

  const setCount=(name,ratio)=>{
    const obj=get(name);if(!obj||obj.count===undefined)return;
    const base=baseCounts.get(name)||obj.count||0;
    obj.count=Math.max(1,Math.min(base,Math.round(base*ratio)));
  };

  const apply=()=>{
    window.TGGWholeWorldConflictAuditV193?.apply?.();
    window.TGGWholeWorldAuthorityV191?.apply?.();

    const district=String(root.dataset.tggDistrict||'downtown');
    const quality=String(root.dataset.tggGraphicsAdaptiveV55||state.quality||'high');
    const fps=Math.max(1,Number(root.dataset.tggGraphicsFpsV55||60));
    const driving=root.dataset.tggDriving==='1'||state.driving===true;
    const speed=Math.max(0,Number(root.dataset.tggVisualSpeedV54||0));
    const mode=modeFor(fps,quality,driving,speed);
    const city=['downtown','studio','media','garage'].includes(district);
    const country=['park','home'].includes(district);
    const sig=[district,quality,mode,driving?'1':'0',speed>26?'fast':'normal'].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      lastMode=mode;
      const performanceMode=mode==='performance';
      const travel=mode==='travel';

      tracked.forEach(([name,base,tier],i)=>{
        const obj=get(name);if(!obj)return;
        let visible=obj.visible!==false;
        if(performance){
          if(tier==='far')visible=(i%2===0)||(country&&/TERRAIN|COUNTRYSIDE/.test(name));
          if(tier==='mid')visible=country?/FOLIAGE|ROAD_SURFACE/.test(name):i%2===0;
          if(tier==='near')visible=!driving||i%2===0;
          if(tier==='life')visible=!driving&&district!=='garage';
        }else if(travel){
          if(tier==='far')visible=true;
          if(tier==='mid')visible=i%3!==1;
          if(tier==='near')visible=i%2===0;
          if(tier==='life')visible=false;
        }else{
          if(tier==='life')visible=!driving;
          else visible=true;
        }
        if(city&&tier==='far'&&/COUNTRYSIDE/.test(name)&&!driving)visible=false;
        if(country&&tier==='near'&&/STOREFRONT|STREET_RHYTHM/.test(name))visible=false;
        obj.visible=visible;
      });

      const ratio=mode==='performance'?.55:mode==='travel'?.72:1;
      setCount('TGG_CLOUD_DEPTH_V84',ratio);
      setCount('TGG_DISTANT_TERRAIN_V84',mode==='performance'?.68:1);
      setCount('TGG_SKYLINE_SILHOUETTES_V82',city?ratio:.45);
      setCount('TGG_WINDOW_REFLECTIONS_V83',city?ratio:.35);
      setCount('TGG_FOLIAGE_VARIETY_V83',country?ratio:.4);
      setCount('TGG_STREET_CLUTTER_V84',city?ratio:.35);
      setCount('TGG_ROAD_SURFACE_VARIATION_V131',mode==='performance'?.65:1);
      setCount('TGG_STOREFRONT_GLASS_DEPTH_V90',city?ratio:.3);
      setCount('TGG_SIDEWALK_VARIATION_V83',country?.45:ratio);
      setCount('TGG_ROAD_MARKINGS_V82',mode==='performance'?.72:1);
      setCount('TGG_STREET_RHYTHM_V82',city?ratio:.35);

      camera.far=mode==='performance'?4700:mode==='travel'?5600:5400;
      camera.updateProjectionMatrix?.();
    }

    root.dataset.tggAdaptiveSceneBudgetV194='1';
    root.dataset.tggAdaptiveSceneModeV194=lastMode||mode;
    root.dataset.tggAdaptiveSceneFpsV194=String(fps);
    root.dataset.tggAdaptiveSceneDriverV194=driving?'driving':'walking';
    root.dataset.tggAdaptiveSceneDistrictV194=district;
    root.dataset.tggAdaptiveSceneAuthorityV194='subordinate-to-v191-v193';
    root.dataset.tggAdaptiveSceneTrackedV194=String(tracked.length);
    root.dataset.tggAdaptiveSceneCameraFarV194=String(Math.round(Number(camera.far||0)));
    root.dataset.tggWholeWorldPreservedV194='1';
  };

  window.TGGAdaptiveSceneBudgetV194={apply,tracked,cache};
  apply();
}
function applyAdaptiveSceneBudgetV194(){window.TGGAdaptiveSceneBudgetV194?.apply?.()||installAdaptiveSceneBudgetV194()}

function installOpenWorldScaleAuthorityV195(){
  if(window.TGGOpenWorldScaleAuthorityV195)return;
  const w=window.TGG3D;
  if(!w?.scene||!w?.camera){root.dataset.tggOpenWorldScaleAuthorityV195='waiting';return}

  const distanceXZ=(a,b)=>{
    const dx=Number(a?.x||0)-Number(b?.x||0);
    const dz=Number(a?.z||0)-Number(b?.z||0);
    return Math.hypot(dx,dz);
  };
  const playerPos=()=>w.car?.position||w.avatar?.position||w.player?.position||w.camera?.position||{x:0,z:0};
  const bandFor=pos=>{
    const d=Math.hypot(Number(pos?.x||0),Number(pos?.z||0));
    return d>=190?'open-road':d>=125?'outskirts':d>=72?'metro':'core';
  };

  let lastStamp='';
  const apply=()=>{
    window.TGGAdaptiveSceneBudgetV194?.apply?.();
    const pos=playerPos();
    const band=bandFor(pos);
    const driving=root.dataset.tggDriving==='1'||state.driving===true;
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const performance=mode==='performance';
    const travel=mode==='travel'||band==='open-road';

    const far=performance?(driving?4700:4300):(travel?6200:5600);
    if(Math.abs(Number(w.camera.far||0)-far)>1){
      w.camera.far=far;
      w.camera.updateProjectionMatrix?.();
    }

    if(driving){
      const fov=band==='open-road'?73:band==='outskirts'?71:69;
      if(Math.abs(Number(w.camera.fov||0)-fov)>.2){
        w.camera.fov=fov;
        w.camera.updateProjectionMatrix?.();
      }
      if(w.setCameraDistance){
        const cameraDistance=band==='open-road'?(performance?58:66):band==='outskirts'?(performance?54:61):(performance?50:56);
        try{w.setCameraDistance(cameraDistance)}catch{}
      }
    }

    if(w.scene?.fog){
      const weather=String(root.dataset.tggWeather||'clear');
      const time=String(root.dataset.tggTime||'day');
      const base=performance?.00425:travel?.00275:.00325;
      const weatherAdd=/rain|storm|fog/.test(weather)?.00105:0;
      const nightAdd=time==='night'?.0002:0;
      w.scene.fog.density=Math.min(.006,base+weatherAdd+nightAdd);
    }

    const horizonNames=[
      'TGG_COUNTRYSIDE_BELT_V76',
      'TGG_DISTANT_TERRAIN_V84',
      'TGG_SKYLINE_SILHOUETTES_V82',
      'TGG_OVERPASS_BRIDGES_V88',
      'TGG_DISTRICT_TRANSITION_CORRIDORS_V89'
    ];
    horizonNames.forEach(name=>{
      const obj=w.scene.getObjectByName?.(name);
      if(!obj)return;
      obj.visible=true;
      obj.userData=obj.userData||{};
      obj.userData.tggScaleAuthorityV195=band;
    });

    (w.destinations||[]).forEach(dest=>{
      const anchor=dest?.group?.position||dest?.position||dest?.ring?.position||dest?.beam?.position;
      if(!anchor)return;
      const d=distanceXZ(pos,anchor);
      if(dest?.labelSprite){
        dest.labelSprite.visible=d<(performance?105:165);
        if(dest.labelSprite.material){
          dest.labelSprite.material.transparent=true;
          dest.labelSprite.material.opacity=d>120?.34:d>78?.58:.82;
        }
      }
      if(dest?.beam?.material)dest.beam.material.opacity=d>130?.025:d>78?.05:.075;
      if(dest?.ring?.material)dest.ring.material.opacity=d>130?.24:d>78?.4:.6;
    });

    (w.traffic||[]).forEach(vehicle=>{
      if(!vehicle?.position)return;
      const d=distanceXZ(pos,vehicle.position);
      vehicle.visible=d<(performance?175:285);
      vehicle.userData=vehicle.userData||{};
      vehicle.userData.tggTravelBandV195=band;
      vehicle.userData.tggDistanceV195=Math.round(d);
    });

    (w.pedestrians||[]).forEach(ped=>{
      if(!ped?.position)return;
      const d=distanceXZ(pos,ped.position);
      ped.visible=d<(performance?88:145);
      ped.userData=ped.userData||{};
      ped.userData.tggDistanceV195=Math.round(d);
    });

    const stamp=[band,driving?'drive':'foot',mode,root.dataset.tggDistrict||'downtown'].join('|');
    if(stamp!==lastStamp){
      lastStamp=stamp;
      root.dataset.tggOpenWorldScaleStampV195=stamp;
    }

    root.dataset.tggTravelBandV195=band;
    root.dataset.tggOpenWorldCameraFarV195=String(Math.round(Number(w.camera.far||0)));
    root.dataset.tggOpenWorldScaleAuthorityV195='1';
    root.dataset.tggOpenWorldScaleV195='expanded-travel';
    root.dataset.tggWholeWorldPreservedV195='1';
  };

  window.TGGOpenWorldScaleAuthorityV195={apply,bandFor};
  apply();
}
function applyOpenWorldScaleAuthorityV195(){window.TGGOpenWorldScaleAuthorityV195?.apply?.()||installOpenWorldScaleAuthorityV195()}

function installMidDistanceCompositionV196(){
  if(window.TGGMidDistanceCompositionV196)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggMidDistanceCompositionV196='waiting';return}
  const scene=w.scene;

  let rooftops=scene.getObjectByName?.('TGG_ROOFTOP_DEPTH_V196');
  if(!rooftops&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(1,1,1);
    const mat=new THREE.MeshStandardMaterial({color:0x303641,roughness:.86,metalness:.08});
    rooftops=new THREE.InstancedMesh(geo,mat,120);rooftops.name='TGG_ROOFTOP_DEPTH_V196';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<120;i++){
      const a=(i/120)*Math.PI*2,r=150+(i%10)*24,h=3+(i%5)*1.7;
      p.set(Math.cos(a)*r,18+(i%7)*5,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a,0));
      s.set(3+(i%4)*1.4,h,3.5+(i%3)*1.2);m.compose(p,q,s);rooftops.setMatrixAt(i,m);
    }
    rooftops.instanceMatrix.needsUpdate=true;scene.add(rooftops);
  }

  let poles=scene.getObjectByName?.('TGG_UTILITY_POLES_V196');
  if(!poles&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.11,.16,6.8,6);
    const mat=new THREE.MeshStandardMaterial({color:0x4a4f56,roughness:.78,metalness:.34});
    poles=new THREE.InstancedMesh(geo,mat,88);poles.name='TGG_UTILITY_POLES_V196';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<88;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-11;
      p.set(axis?step*26:side*19.2,3.4,axis?side*19.2:step*26);
      q.identity();m.compose(p,q,s);poles.setMatrixAt(i,m);
    }
    poles.instanceMatrix.needsUpdate=true;scene.add(poles);
  }

  let reflectors=scene.getObjectByName?.('TGG_LANE_REFLECTORS_V196');
  if(!reflectors&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.16,.05,.34);
    const mat=new THREE.MeshBasicMaterial({color:0xeaf6ff});
    reflectors=new THREE.InstancedMesh(geo,mat,220);reflectors.name='TGG_LANE_REFLECTORS_V196';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<220;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-27;
      p.set(axis?step*8.2:side*4.6,.07,axis?side*4.6:step*8.2);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);reflectors.setMatrixAt(i,m);
    }
    reflectors.instanceMatrix.needsUpdate=true;scene.add(reflectors);
  }

  const playerPos=()=>w.car?.position||w.avatar?.position||w.player?.position||w.camera?.position||{x:0,z:0};
  const distanceXZ=(a,b)=>Math.hypot(Number(a?.x||0)-Number(b?.x||0),Number(a?.z||0)-Number(b?.z||0));

  const updateTrafficLights=()=>{
    const pos=playerPos();
    (w.traffic||[]).forEach((vehicle,i)=>{
      if(!vehicle)return;
      const d=distanceXZ(pos,vehicle.position);
      const lights=vehicle.getObjectByName?.('TGG_TRAFFIC_LIGHTS_V83');
      if(lights){
        lights.visible=d<145;
        lights.children?.forEach((o,j)=>{
          if(o?.material){
            o.material.opacity=1;
            o.material.transparent=false;
            if(j>=2&&root.dataset.tggDriving==='1')o.material.color?.setHex?.(0xff3a43);
          }
        });
      }
      vehicle.userData=vehicle.userData||{};
      vehicle.userData.tggMidDistanceBandV196=d<70?'near':d<170?'mid':'far';
    });
  };

  let lastSig='';
  const apply=()=>{
    window.TGGOpenWorldScaleAuthorityV195?.apply?.();
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const band=String(root.dataset.tggTravelBandV195||'core');
    const district=String(root.dataset.tggDistrict||'downtown');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const performance=mode==='performance',night=time==='night',wet=/rain|storm/.test(weather);
    const sig=[mode,band,district,time,weather].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(rooftops){
        rooftops.visible=!performance||band==='core'||band==='metro';
        rooftops.material.color.setHex(night?0x252b34:district==='studio'?0x38333d:0x303641);
      }
      if(poles)poles.visible=!performance||band!=='open-road';
      if(reflectors){
        reflectors.visible=night||wet||band==='open-road';
        reflectors.material.color.setHex(wet?0xb9e8ff:0xf5f4d8);
      }
    }

    updateTrafficLights();

    root.dataset.tggRooftopDepthV196=rooftops?'120':'0';
    root.dataset.tggUtilityPolesV196=poles?'88':'0';
    root.dataset.tggLaneReflectorsV196=reflectors?'220':'0';
    root.dataset.tggTrafficLightDistanceModelV196='distance-aware';
    root.dataset.tggMidDistanceModeV196=mode;
    root.dataset.tggMidDistanceCompositionV196='1';
  };

  window.TGGMidDistanceCompositionV196={apply};
  apply();
}
function applyMidDistanceCompositionV196(){window.TGGMidDistanceCompositionV196?.apply?.()||installMidDistanceCompositionV196()}

function installProximityMaterialAuthorityV197(){
  if(window.TGGProximityMaterialAuthorityV197)return;
  const w=window.TGG3D,scene=w?.scene;
  if(!scene){root.dataset.tggProximityMaterialAuthorityV197='waiting';return}

  const playerPos=()=>w.car?.position||w.avatar?.position||w.player?.position||w.camera?.position||{x:0,z:0};
  const dXZ=(a,b)=>Math.hypot(Number(a?.x||0)-Number(b?.x||0),Number(a?.z||0)-Number(b?.z||0));
  let lastScan=0,nearMeshes=[],avatar=null;

  const scan=()=>{
    const now=performance.now();
    if(now-lastScan<6000&&nearMeshes.length)return;
    lastScan=now;nearMeshes=[];avatar=null;
    scene.traverse?.(o=>{
      if(!o?.isMesh)return;
      const name=String(o.name||'').toLowerCase();
      if(!avatar&&/player|avatar|character/.test(name))avatar=o;
      if(/road|street|sidewalk|curb|store|facade|building|garage|studio|shop|window|glass/.test(name))nearMeshes.push(o);
    });
    root.dataset.tggProximityTrackedMeshesV197=String(nearMeshes.length);
  };

  const tuneMat=(m,kind,near,wet,night)=>{
    if(!m)return;
    if('roughness'in m){
      if(kind==='road')m.roughness=wet?(near?.22:.34):(near?.78:.9);
      else if(kind==='glass')m.roughness=wet?.035:(near?.07:.13);
      else m.roughness=near?Math.min(Number(m.roughness??.62),.58):Math.max(Number(m.roughness??.62),.7);
    }
    if('metalness'in m){
      if(kind==='glass')m.metalness=Math.max(Number(m.metalness??0),.1);
      else if(kind==='road')m.metalness=wet?.16:.03;
      else if(near)m.metalness=Math.max(Number(m.metalness??0),.08);
    }
    if('envMapIntensity'in m)m.envMapIntensity=near?(night?1.35:1.15):.45;
    m.needsUpdate=true;
  };

  const apply=()=>{
    window.TGGMidDistanceCompositionV196?.apply?.();
    scan();
    const pos=playerPos();
    const wet=/rain|storm/.test(String(root.dataset.tggWeather||'clear'));
    const night=String(root.dataset.tggTime||'day')==='night';
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const nearCut=mode==='performance'?38:54;
    const midCut=mode==='performance'?92:128;

    let nearCount=0,midCount=0;
    nearMeshes.forEach(o=>{
      if(!o?.position||!o.material)return;
      const d=dXZ(pos,o.position);
      const near=d<nearCut,mid=d<midCut;
      if(near)nearCount++; else if(mid)midCount++;
      const name=String(o.name||'').toLowerCase();
      const kind=/glass|window/.test(name)?'glass':/road|street|sidewalk|curb/.test(name)?'road':'surface';
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>tuneMat(m,kind,near,wet,night));
      o.userData=o.userData||{};
      o.userData.tggProximityBandV197=near?'near':mid?'mid':'far';
    });

    const car=w.car;
    if(car?.traverse){
      car.traverse(o=>{
        if(!o?.isMesh||!o.material)return;
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{
          if('roughness'in m)m.roughness=Math.min(Number(m.roughness??.35),wet?.2:.3);
          if('envMapIntensity'in m)m.envMapIntensity=night?1.55:1.3;
          m.needsUpdate=true;
        });
      });
    }

    if(avatar?.traverse){
      avatar.traverse(o=>{
        if(!o?.isMesh||!o.material)return;
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{
          if('roughness'in m)m.roughness=Math.max(.34,Math.min(.72,Number(m.roughness??.58)));
          if('envMapIntensity'in m)m.envMapIntensity=night?1.08:.82;
          m.needsUpdate=true;
        });
      });
    }

    root.dataset.tggProximityNearCountV197=String(nearCount);
    root.dataset.tggProximityMidCountV197=String(midCount);
    root.dataset.tggProximityMaterialModeV197=mode;
    root.dataset.tggProximityMaterialAuthorityV197='1';
    root.dataset.tggWholeWorldPreservedV197='1';
  };

  window.TGGProximityMaterialAuthorityV197={apply,scan};
  apply();
}
function applyProximityMaterialAuthorityV197(){window.TGGProximityMaterialAuthorityV197?.apply?.()||installProximityMaterialAuthorityV197()}

function installOpenRoadEnvironmentAuthorityV198(){
  if(window.TGGOpenRoadEnvironmentAuthorityV198)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggOpenRoadEnvironmentAuthorityV198='waiting';return}
  const scene=w.scene;

  let group=scene.getObjectByName?.('TGG_OPEN_ROAD_ENVIRONMENT_V198');
  if(!group){
    group=new THREE.Group();
    group.name='TGG_OPEN_ROAD_ENVIRONMENT_V198';
    group.userData.tggOwner='V198';

    const trunkMat=new THREE.MeshStandardMaterial({color:0x3e3128,roughness:.95,metalness:.01});
    const leafMat=new THREE.MeshStandardMaterial({color:0x244a32,roughness:.9,metalness:.01});
    const railMat=new THREE.MeshStandardMaterial({color:0x7f8790,roughness:.5,metalness:.62});
    const signMat=new THREE.MeshStandardMaterial({color:0x173d62,roughness:.48,metalness:.22});
    const postMat=new THREE.MeshStandardMaterial({color:0x5b626c,roughness:.62,metalness:.46});

    if(THREE.InstancedMesh){
      const trunkGeo=new THREE.CylinderGeometry(.22,.3,4.6,7);
      const leafGeo=new THREE.ConeGeometry(1.45,4.8,8);
      const trunks=new THREE.InstancedMesh(trunkGeo,trunkMat,180);
      const crowns=new THREE.InstancedMesh(leafGeo,leafMat,180);
      trunks.name='TGG_OPEN_ROAD_TREE_TRUNKS_V198';
      crowns.name='TGG_OPEN_ROAD_TREE_CROWNS_V198';
      const mt=new THREE.Matrix4(),mc=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),st=new THREE.Vector3(),sc=new THREE.Vector3();
      for(let i=0;i<180;i++){
        const axis=i%2;
        const laneSide=i%4<2?-1:1;
        const step=Math.floor(i/4)-22;
        const offset=26+(i%5)*3.1;
        const jitter=((i*17)%11-5)*1.25;
        const x=axis?step*18+jitter:laneSide*offset;
        const z=axis?laneSide*offset:step*18+jitter;
        const scale=.72+(i%7)*.055;
        p.set(x,2.3*scale,z);q.identity();st.set(scale,scale,scale);mt.compose(p,q,st);trunks.setMatrixAt(i,mt);
        p.set(x,5.6*scale,z);sc.set(scale*1.05,scale,scale*1.05);mc.compose(p,q,sc);crowns.setMatrixAt(i,mc);
      }
      trunks.instanceMatrix.needsUpdate=true;crowns.instanceMatrix.needsUpdate=true;
      group.add(trunks,crowns);

      const railGeo=new THREE.BoxGeometry(5.8,.22,.16);
      const rails=new THREE.InstancedMesh(railGeo,railMat,96);
      rails.name='TGG_OPEN_ROAD_GUARDRAILS_V198';
      const mr=new THREE.Matrix4(),rp=new THREE.Vector3(),rq=new THREE.Quaternion(),rs=new THREE.Vector3(1,1,1);
      for(let i=0;i<96;i++){
        const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-12;
        rp.set(axis?step*15:side*10.8,.72,axis?side*10.8:step*15);
        rq.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
        mr.compose(rp,rq,rs);rails.setMatrixAt(i,mr);
      }
      rails.instanceMatrix.needsUpdate=true;group.add(rails);
    }

    for(let i=0;i<12;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-1;
      const post=new THREE.Mesh(new THREE.BoxGeometry(.16,3.4,.16),postMat);
      const sign=new THREE.Mesh(new THREE.BoxGeometry(2.8,1.4,.14),signMat);
      const x=axis?step*78:side*13.5,z=axis?side*13.5:step*78;
      post.position.set(x,1.7,z);sign.position.set(x,3.35,z);
      sign.rotation.y=axis?Math.PI/2:0;
      group.add(post,sign);
    }

    scene.add(group);
  }

  const playerPos=()=>w.car?.position||w.avatar?.position||w.player?.position||w.camera?.position||{x:0,z:0};
  let lastStamp='';
  const apply=()=>{
    window.TGGProximityMaterialAuthorityV197?.apply?.();
    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const driving=root.dataset.tggDriving==='1'||state.driving===true;
    const pos=playerPos();
    const radial=Math.hypot(Number(pos?.x||0),Number(pos?.z||0));
    const outer=band==='outskirts'||band==='open-road'||radial>105;
    const performance=mode==='performance';

    group.visible=outer||driving;
    group.children.forEach((obj,i)=>{
      if(!obj)return;
      if(performance&&obj.isMesh&&!obj.isInstancedMesh)obj.visible=i%2===0;
      else obj.visible=true;
      if(obj.isInstancedMesh)obj.frustumCulled=true;
    });

    const crowns=scene.getObjectByName?.('TGG_OPEN_ROAD_TREE_CROWNS_V198');
    if(crowns?.material){
      const wet=/rain|storm/.test(weather);
      const night=time==='night';
      crowns.material.color?.setHex?.(night?0x183326:wet?0x1f432e:0x244a32);
      crowns.material.roughness=wet?.78:.9;
      crowns.material.needsUpdate=true;
    }

    const rails=scene.getObjectByName?.('TGG_OPEN_ROAD_GUARDRAILS_V198');
    if(rails?.material){
      rails.material.envMapIntensity=time==='night'?1.15:.72;
      rails.material.needsUpdate=true;
    }

    const stamp=[band,mode,weather,time,driving?'drive':'foot'].join('|');
    if(stamp!==lastStamp){lastStamp=stamp;root.dataset.tggOpenRoadEnvironmentStampV198=stamp}
    root.dataset.tggOpenRoadEnvironmentAuthorityV198='1';
    root.dataset.tggOpenRoadEnvironmentVisibleV198=group.visible?'1':'0';
    root.dataset.tggOpenRoadEnvironmentBandV198=band;
    root.dataset.tggOpenRoadEnvironmentTreesV198='180';
    root.dataset.tggOpenRoadEnvironmentGuardrailsV198='96';
    root.dataset.tggWholeWorldPreservedV198='1';
  };

  window.TGGOpenRoadEnvironmentAuthorityV198={apply,group};
  apply();
}
function applyOpenRoadEnvironmentAuthorityV198(){window.TGGOpenRoadEnvironmentAuthorityV198?.apply?.()||installOpenRoadEnvironmentAuthorityV198()}

function installTravelLandmarkAuthorityV199(){
  if(window.TGGTravelLandmarkAuthorityV199)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggTravelLandmarkAuthorityV199='waiting';return}
  const scene=w.scene;

  let group=scene.getObjectByName?.('TGG_TRAVEL_LANDMARKS_V199');
  const landmarks=[];
  const makeSign=(label,color,x,z,y,rot=0)=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=160;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='rgba(4,8,13,.94)';ctx.fillRect(0,0,512,160);
    ctx.strokeStyle=color;ctx.lineWidth=8;ctx.strokeRect(8,8,496,144);
    ctx.fillStyle='#fff';ctx.font='900 34px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,256,80);
    const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:true}));
    sprite.position.set(x,y,z);sprite.scale.set(9.5,2.9,1);sprite.material.rotation=rot;
    return sprite;
  };

  if(!group){
    group=new THREE.Group();group.name='TGG_TRAVEL_LANDMARKS_V199';group.userData.tggOwner='V199';

    const concrete=new THREE.MeshStandardMaterial({color:0x4e535b,roughness:.92,metalness:.03});
    const dark=new THREE.MeshStandardMaterial({color:0x151a20,roughness:.72,metalness:.22});
    const serviceMat=new THREE.MeshStandardMaterial({color:0x264f73,roughness:.5,metalness:.22});
    const motelMat=new THREE.MeshStandardMaterial({color:0x6b4b3d,roughness:.7,metalness:.08});
    const dinerMat=new THREE.MeshStandardMaterial({color:0x7a2630,roughness:.5,metalness:.18});
    const theaterMat=new THREE.MeshStandardMaterial({color:0x2d3444,roughness:.68,metalness:.2});
    const glow=new THREE.MeshStandardMaterial({color:0xeef7ff,emissive:0x9ad8ff,emissiveIntensity:1.8,roughness:.28,metalness:.08});

    const addCompound=(id,label,x,z,wid,dep,h,mat,color,route)=>{
      const pad=new THREE.Mesh(new THREE.BoxGeometry(wid+8,.24,dep+8),concrete);pad.position.set(x,.12,z);pad.receiveShadow=true;
      const building=new THREE.Mesh(new THREE.BoxGeometry(wid,h,dep),mat);building.position.set(x,h/2,z);building.castShadow=true;building.receiveShadow=true;
      const awning=new THREE.Mesh(new THREE.BoxGeometry(wid*.72,.22,1.8),dark);awning.position.set(x,h*.62,z-dep/2-1);awning.castShadow=true;
      const sign=makeSign(label,color,x,z-dep/2-2.2,h*.78);
      group.add(pad,building,awning,sign);
      const entry={id,label,route,position:new THREE.Vector3(x,0,z),group:building,sign};
      building.userData={...(building.userData||{}),tggTravelLandmarkV199:id,tggRouteV199:route};
      landmarks.push(entry);return entry;
    };

    addCompound('roadside-service','TGG ROADSIDE SERVICE',0,-238,18,12,6.8,serviceMat,'#5fd7ff','garage');
    addCompound('highway-motel','TGG HIGHWAY MOTEL',236,34,24,11,8.2,motelMat,'#ffb36b','home');
    addCompound('night-diner','TGG NIGHT DINER',-228,-46,16,10,5.6,dinerMat,'#ff5964','businessBoard');
    addCompound('drive-in','TGG DRIVE-IN THEATER',54,244,22,8,5.2,theaterMat,'eventsBoard');

    const screen=new THREE.Mesh(new THREE.BoxGeometry(18,9,.4),theaterMat);screen.position.set(54,7.2,259);screen.castShadow=true;
    const screenFace=new THREE.Mesh(new THREE.BoxGeometry(17.1,8.1,.08),glow);screenFace.position.set(54,7.2,258.75);
    group.add(screen,screenFace);
    for(let row=0;row<4;row++)for(let col=0;col<6;col++){
      const stall=new THREE.Mesh(new THREE.BoxGeometry(2.6,.12,4.6),dark);
      stall.position.set(43+col*4.4,.08,226+row*5.4);group.add(stall);
    }

    const canopy=new THREE.Mesh(new THREE.BoxGeometry(19,.5,8),dark);canopy.position.set(0,5.1,-247);group.add(canopy);
    for(let i=-2;i<=2;i++){
      const pump=new THREE.Mesh(new THREE.BoxGeometry(1,2.3,.9),serviceMat);pump.position.set(i*3.2,1.2,-247);group.add(pump);
    }

    scene.add(group);
  }else{
    const defs=[
      ['roadside-service','TGG ROADSIDE SERVICE','garage',0,-238],
      ['highway-motel','TGG HIGHWAY MOTEL','home',236,34],
      ['night-diner','TGG NIGHT DINER','businessBoard',-228,-46],
      ['drive-in','TGG DRIVE-IN THEATER','eventsBoard',54,244]
    ];
    defs.forEach(([id,label,route,x,z])=>landmarks.push({id,label,route,position:new THREE.Vector3(x,0,z)}));
  }

  const playerPos=()=>w.car?.position||w.avatar?.position||w.player?.position||w.camera?.position||{x:0,z:0};
  const nearest=()=>{
    const pos=playerPos();
    let best=null,bestD=Infinity;
    landmarks.forEach(item=>{
      const d=Math.hypot(Number(pos.x||0)-item.position.x,Number(pos.z||0)-item.position.z);
      if(d<bestD){best=item;bestD=d}
    });
    return best?{...best,distance:bestD}:null;
  };

  const enterNearest=()=>{
    const near=nearest();
    if(!near||near.distance>20)return {ok:false,error:'travel_landmark_not_nearby',distance:near?.distance??null};
    document.dispatchEvent(new CustomEvent('tgg-travel-landmark-enter',{detail:{id:near.id,label:near.label,route:near.route,distance:near.distance}}));
    try{
      if(near.id==='drive-in')window.TGGGame?.show?.('eventsBoard');
      else if(near.id==='night-diner')window.TGGGame?.show?.('businessBoard');
      else if(near.id==='highway-motel')window.TGGGame?.show?.('home');
      else window.TGGGame?.show?.('garage');
    }catch{}
    root.dataset.tggTravelLandmarkLastEnterV199=near.id;
    return {ok:true,id:near.id,route:near.route,distance:near.distance};
  };

  let lastStamp='';
  const apply=()=>{
    window.TGGOpenRoadEnvironmentAuthorityV198?.apply?.();
    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const driving=root.dataset.tggDriving==='1'||state.driving===true;
    const near=nearest();
    const performance=mode==='performance';

    group.visible=band==='outskirts'||band==='open-road'||driving;
    group.children.forEach((o,i)=>{
      if(!o)return;
      if(o.isSprite)o.visible=!performance||near?.distance<150;
      else if(o.isMesh)o.visible=!performance||i%2===0||near?.distance<90;
    });

    root.dataset.tggTravelLandmarkNearestV199=near?.id||'none';
    root.dataset.tggTravelLandmarkDistanceV199=near?String(Math.round(near.distance)):'-1';
    root.dataset.tggTravelLandmarkInteractV199=near&&near.distance<=20?'ready':'far';
    root.dataset.tggTravelLandmarkCountV199=String(landmarks.length);
    root.dataset.tggTravelLandmarkAuthorityV199='1';
    root.dataset.tggWholeWorldPreservedV199='1';

    const stamp=[band,mode,driving?'drive':'foot',near?.id||'none',near?Math.round(near.distance/10):'-'].join('|');
    if(stamp!==lastStamp){lastStamp=stamp;root.dataset.tggTravelLandmarkStampV199=stamp}
  };

  window.TGGTravelLandmarkAuthorityV199={apply,nearest,enterNearest,landmarks};
  apply();
}
function applyTravelLandmarkAuthorityV199(){window.TGGTravelLandmarkAuthorityV199?.apply?.()||installTravelLandmarkAuthorityV199()}

function installOpenRoadFidelityV199(){
  if(window.TGGOpenRoadFidelityV199)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggOpenRoadFidelityV199='waiting';return}
  const scene=w.scene;

  let group=scene.getObjectByName?.('TGG_OPEN_ROAD_FIDELITY_V199');
  if(!group){
    group=new THREE.Group();
    group.name='TGG_OPEN_ROAD_FIDELITY_V199';
    group.userData.tggOwner='V199';

    if(THREE.InstancedMesh){
      const shoulderGeo=new THREE.BoxGeometry(6,.035,1.1);
      const shoulderMat=new THREE.MeshStandardMaterial({color:0x4b4f4d,roughness:.98,metalness:.01});
      const shoulders=new THREE.InstancedMesh(shoulderGeo,shoulderMat,120);
      shoulders.name='TGG_OPEN_ROAD_SHOULDERS_V199';

      const reflectorGeo=new THREE.BoxGeometry(.12,.18,.38);
      const reflectorMat=new THREE.MeshBasicMaterial({color:0xf4f1d6});
      const reflectors=new THREE.InstancedMesh(reflectorGeo,reflectorMat,160);
      reflectors.name='TGG_OPEN_ROAD_REFLECTORS_V199';

      const wearGeo=new THREE.PlaneGeometry(1.4,5.2);
      const wearMat=new THREE.MeshBasicMaterial({color:0x171a1c,transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide});
      const wear=new THREE.InstancedMesh(wearGeo,wearMat,132);
      wear.name='TGG_OPEN_ROAD_WEAR_V199';

      const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
      for(let i=0;i<120;i++){
        const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-15;
        p.set(axis?step*18:side*12.2,.028,axis?side*12.2:step*18);
        q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
        m.compose(p,q,s);shoulders.setMatrixAt(i,m);
      }
      for(let i=0;i<160;i++){
        const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-20;
        p.set(axis?step*13.5:side*10.6,.18,axis?side*10.6:step*13.5);
        q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
        m.compose(p,q,s);reflectors.setMatrixAt(i,m);
      }
      for(let i=0;i<132;i++){
        const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-16;
        p.set(axis?step*15.5:side*2.9,.044,axis?side*2.9:step*15.5);
        q.setFromEuler(new THREE.Euler(-Math.PI/2,0,axis?Math.PI/2:0));
        m.compose(p,q,s);wear.setMatrixAt(i,m);
      }
      shoulders.instanceMatrix.needsUpdate=true;
      reflectors.instanceMatrix.needsUpdate=true;
      wear.instanceMatrix.needsUpdate=true;
      group.add(shoulders,reflectors,wear);
    }

    for(let i=0;i<10;i++){
      const pole=new THREE.Mesh(
        new THREE.CylinderGeometry(.08,.11,5.4,6),
        new THREE.MeshStandardMaterial({color:0x505860,roughness:.65,metalness:.5})
      );
      const arm=new THREE.Mesh(
        new THREE.BoxGeometry(2.4,.08,.08),
        new THREE.MeshStandardMaterial({color:0x626a74,roughness:.58,metalness:.56})
      );
      const side=i%2?-1:1,step=Math.floor(i/2)-2;
      pole.position.set(side*15.6,2.7,step*92);
      arm.position.set(side*14.5,5.15,step*92);
      group.add(pole,arm);
    }

    scene.add(group);
  }

  let lastStamp='';
  const apply=()=>{
    window.TGGOpenRoadEnvironmentAuthorityV198?.apply?.();
    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const driving=root.dataset.tggDriving==='1'||state.driving===true;
    const wet=/rain|storm/.test(weather),night=time==='night';
    const outer=band==='outskirts'||band==='open-road'||driving;
    group.visible=outer;

    const shoulders=scene.getObjectByName?.('TGG_OPEN_ROAD_SHOULDERS_V199');
    const reflectors=scene.getObjectByName?.('TGG_OPEN_ROAD_REFLECTORS_V199');
    const wear=scene.getObjectByName?.('TGG_OPEN_ROAD_WEAR_V199');

    if(shoulders?.material){
      shoulders.material.color?.setHex?.(wet?0x3f4645:0x4b4f4d);
      shoulders.material.roughness=wet?.72:.98;
      shoulders.material.needsUpdate=true;
    }
    if(reflectors?.material){
      reflectors.material.color?.setHex?.(night||wet?0xfff2bb:0xe8e3c7);
      reflectors.material.opacity=mode==='performance'?.72:1;
      reflectors.material.transparent=mode==='performance';
      reflectors.material.needsUpdate=true;
    }
    if(wear?.material){
      wear.material.opacity=wet?.18:.1;
      wear.material.needsUpdate=true;
    }

    group.children.forEach((o,i)=>{
      if(mode==='performance'&&o.isMesh&&!o.isInstancedMesh)o.visible=i%2===0;
      else if(o.visible!==undefined)o.visible=true;
    });

    const stamp=[band,mode,weather,time,driving?'drive':'foot'].join('|');
    if(stamp!==lastStamp){lastStamp=stamp;root.dataset.tggOpenRoadFidelityStampV199=stamp}
    root.dataset.tggOpenRoadFidelityV199='1';
    root.dataset.tggOpenRoadFidelityVisibleV199=group.visible?'1':'0';
    root.dataset.tggOpenRoadShouldersV199='120';
    root.dataset.tggOpenRoadReflectorsV199='160';
    root.dataset.tggOpenRoadWearV199='132';
    root.dataset.tggOpenRoadUtilityV199='10';
    root.dataset.tggWholeWorldPreservedV199='1';
  };

  window.TGGOpenRoadFidelityV199={apply,group};
  apply();
}
function applyOpenRoadFidelityV199(){window.TGGOpenRoadFidelityV199?.apply?.()||installOpenRoadFidelityV199()}

function installWholeGameMilestoneV200(){
  if(window.TGGWholeGameV200)return;
  const inspect=()=>{
    const checks={
      buildIntegrity:root.dataset.tggBuildIntegrityV58==='pass',
      wholeWorldAuthority:root.dataset.tggWholeWorldAuthorityV191==='1'&&root.dataset.tggWholeWorldStableV191==='1',
      runtimeConvergence:root.dataset.tggRuntimeConvergenceV184==='1',
      adaptiveBudget:root.dataset.tggAdaptiveSceneBudgetV194==='1',
      openWorldScale:root.dataset.tggOpenWorldScaleAuthorityV195==='1',
      openRoad:root.dataset.tggOpenRoadEnvironmentAuthorityV198==='1'&&root.dataset.tggOpenRoadFidelityV199==='1',
      destinations:root.dataset.tggDestinationEcosystemV126==='1'&&root.dataset.tggDestinationActivityV137==='1',
      avatarVehicle:root.dataset.tggAvatarWorldPresentationV77==='1'&&(root.dataset.tggVehiclePremiumMaterialsV79==='1'||root.dataset.tggVehiclePaintResponseV82==='1'),
      creatorContext:root.dataset.tggCreatorHub==='1'&&root.dataset.tggCreatorAssetBridge==='1',
      navigation:root.dataset.tggWorldNavigationV120==='1'
    };
    const missing=Object.entries(checks).filter(([,ok])=>!ok).map(([k])=>k);
    const passed=Object.keys(checks).length-missing.length;
    root.dataset.tggWholeGameMilestoneV200='1';
    root.dataset.tggWholeGameVersionV200='1000x-v202';
    root.dataset.tggWholeGameMilestoneScoreV200=passed+'/'+Object.keys(checks).length;
    root.dataset.tggWholeGameMilestoneReadyV200=missing.length?'degraded':'pass';
    root.dataset.tggWholeGameMilestoneMissingV200=missing.join(',')||'none';
    root.dataset.tggWholeGameWorldOwnerV200='tgg-world-v191';
    root.dataset.tggWholeGameRuntimeOwnerV200='tgg-world-v184';
    root.dataset.tggWholeGameBudgetOwnerV200='tgg-world-v194';
    root.dataset.tggWholeGameScaleOwnerV200='tgg-world-v195';
    root.dataset.tggWholeGameRoadOwnerV200='tgg-world-v199';
    root.dataset.tggWholeGameCreatorContextV200='creator-hub+asset-bridge';
    root.dataset.tggWholeWorldPreservedV200='1';
    return {checks,missing,passed,total:Object.keys(checks).length,ready:missing.length===0};
  };
  window.TGGWholeGameV200={inspect};
  inspect();
}
function applyWholeGameMilestoneV200(){window.TGGWholeGameV200?.inspect?.()||installWholeGameMilestoneV200()}

function installRoadsideLifeAuthorityV201(){
  if(window.TGGRoadsideLifeAuthorityV201)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggRoadsideLifeAuthorityV201='waiting';return}
  const scene=w.scene;
  let group=scene.getObjectByName?.('TGG_ROADSIDE_LIFE_V201');

  if(!group){
    group=new THREE.Group();
    group.name='TGG_ROADSIDE_LIFE_V201';
    group.userData.tggOwner='V201';

    const glass=new THREE.MeshStandardMaterial({color:0x6f8fa8,roughness:.18,metalness:.12,transparent:true,opacity:.5});
    const dark=new THREE.MeshStandardMaterial({color:0x1b2026,roughness:.76,metalness:.14});
    const skin=new THREE.MeshStandardMaterial({color:0x9b735a,roughness:.9,metalness:0});
    const carColors=[0x27313d,0x7a2730,0x33544a,0x4d3c63,0x726241,0x223b59];
    const clothColors=[0x2b3440,0x6d2932,0x2d5343,0x4d3f61,0x756542];

    const addParked=(x,z,rot=0,i=0)=>{
      const car=new THREE.Group();
      const body=new THREE.Mesh(
        new THREE.BoxGeometry(3.8,.82,1.7),
        new THREE.MeshStandardMaterial({color:carColors[i%carColors.length],roughness:.42,metalness:.28})
      );
      body.position.y=.58;body.castShadow=true;body.receiveShadow=true;
      const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.8,.64,1.38),glass);
      cabin.position.set(.12,1.0,0);
      car.add(body,cabin);
      car.position.set(x,0,z);car.rotation.y=rot;
      car.userData.tggRoadsideLifeV201='parked';
      group.add(car);
    };

    const addPerson=(x,z,i=0,heading=0)=>{
      const person=new THREE.Group();
      const torso=new THREE.Mesh(
        new THREE.CylinderGeometry(.22,.28,.9,8),
        new THREE.MeshStandardMaterial({color:clothColors[i%clothColors.length],roughness:.8,metalness:.03})
      );
      torso.position.y=1.08;
      const head=new THREE.Mesh(new THREE.SphereGeometry(.19,10,8),skin);
      head.position.y=1.72;
      const legs=new THREE.Mesh(new THREE.BoxGeometry(.42,.78,.24),dark);
      legs.position.y=.42;
      person.add(torso,head,legs);
      person.position.set(x,0,z);person.rotation.y=heading;
      person.userData.tggRoadsideLifeV201='person';
      person.userData.tggBaseY=0;
      group.add(person);
    };

    [
      [-7,-253,0,0],[0,-253,0,1],[7,-253,0,2],
      [226,27,Math.PI/2,3],[226,36,Math.PI/2,4],[226,45,Math.PI/2,5],
      [-219,-53,-Math.PI/2,1],[-219,-44,-Math.PI/2,2],[-219,-35,-Math.PI/2,3],
      [43,226,0,4],[49,226,0,5],[55,226,0,0],[61,226,0,1],[67,226,0,2],
      [43,232,Math.PI,2],[49,232,Math.PI,3],[55,232,Math.PI,4],[61,232,Math.PI,5],[67,232,Math.PI,0]
    ].forEach(v=>addParked(...v));

    [
      [-6,-244,0,0],[5,-244,1,Math.PI],[2,-235,2,.5],
      [231,30,3,Math.PI/2],[231,40,4,-Math.PI/2],
      [-223,-43,0,0],[-232,-43,1,Math.PI],
      [47,238,2,0],[53,238,3,0],[59,238,4,Math.PI],[65,238,0,Math.PI]
    ].forEach(v=>addPerson(...v));

    scene.add(group);
  }

  const playerPos=()=>w.car?.position||w.avatar?.position||w.player?.position||w.camera?.position||{x:0,z:0};
  let lastStamp='';
  const apply=()=>{
    window.TGGOpenRoadFidelityV199?.apply?.();
    window.TGGTravelLandmarkAuthorityV199?.apply?.();

    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const near=window.TGGTravelLandmarkAuthorityV199?.nearest?.()||null;
    const performance=mode==='performance';
    const active=band==='outskirts'||band==='open-road'||Boolean(near&&near.distance<175);
    const pos=playerPos();
    let visibleVehicles=0,visiblePeople=0;

    group.visible=active;
    group.children.forEach((obj,i)=>{
      const kind=obj?.userData?.tggRoadsideLifeV201;
      if(!kind)return;
      const d=Math.hypot(Number(pos.x||0)-Number(obj.position.x||0),Number(pos.z||0)-Number(obj.position.z||0));
      if(kind==='parked'){
        obj.visible=active&&d<(performance?120:225);
        if(obj.visible)visibleVehicles++;
      }else{
        obj.visible=active&&d<(performance?72:130);
        if(obj.visible){
          visiblePeople++;
          obj.position.y=(obj.userData.tggBaseY||0)+Math.sin(window.performance.now()*.0015+i*.8)*.02;
        }
      }
    });

    const stamp=[band,mode,near?.id||'none'].join('|');
    if(stamp!==lastStamp){lastStamp=stamp;root.dataset.tggRoadsideLifeStampV201=stamp}
    root.dataset.tggRoadsideLifeAuthorityV201='1';
    root.dataset.tggRoadsideLifeActiveV201=active?'1':'0';
    root.dataset.tggRoadsideVehiclesV201=String(visibleVehicles);
    root.dataset.tggRoadsidePeopleV201=String(visiblePeople);
    root.dataset.tggRoadsideNearestV201=near?.id||'none';
    root.dataset.tggWholeWorldPreservedV201='1';
  };

  window.TGGRoadsideLifeAuthorityV201={apply,group};
  apply();
}
function applyRoadsideLifeAuthorityV201(){window.TGGRoadsideLifeAuthorityV201?.apply?.()||installRoadsideLifeAuthorityV201()}

function installRoadsideLightingAuthorityV202(){
  if(window.TGGRoadsideLightingAuthorityV202)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggRoadsideLightingAuthorityV202='waiting';return}
  const scene=w.scene;
  let group=scene.getObjectByName?.('TGG_ROADSIDE_LIGHTING_V202');

  if(!group){
    group=new THREE.Group();
    group.name='TGG_ROADSIDE_LIGHTING_V202';
    group.userData.tggOwner='V202';

    const poleMat=new THREE.MeshStandardMaterial({color:0x4b525c,roughness:.62,metalness:.48});
    const bulbMat=new THREE.MeshStandardMaterial({
      color:0xffe7b0,emissive:0xffc36a,emissiveIntensity:2.1,roughness:.28,metalness:.05
    });

    const defs=[
      [-10,-244,0xffd37a,10],[10,-244,0xffd37a,10],
      [229,26,0xffc88a,9],[229,44,0xffc88a,9],
      [-222,-54,0xff8f72,10],[-222,-36,0xff8f72,10],
      [42,241,0x8fcfff,12],[68,241,0x8fcfff,12]
    ];

    defs.forEach(([x,z,color,distance],i)=>{
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(.065,.1,4.2,7),poleMat);
      pole.position.set(x,2.1,z);pole.castShadow=true;
      const bulb=new THREE.Mesh(new THREE.SphereGeometry(.13,8,6),bulbMat.clone());
      bulb.position.set(x,4.2,z);
      bulb.material.color.setHex(color);bulb.material.emissive.setHex(color);
      const light=new THREE.PointLight(color,0,distance,2);
      light.position.set(x,4.05,z);
      light.userData.tggRoadsideLightV202=i;
      group.add(pole,bulb,light);
    });

    scene.add(group);
  }

  let lastStamp='';
  const apply=()=>{
    window.TGGRoadsideLifeAuthorityV201?.apply?.();
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const band=String(root.dataset.tggTravelBandV195||'core');
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const near=window.TGGTravelLandmarkAuthorityV199?.nearest?.()||null;
    const performance=mode==='performance';
    const night=time==='night';
    const wet=/rain|storm|fog/.test(weather);
    const outer=band==='outskirts'||band==='open-road'||Boolean(near&&near.distance<190);
    const active=outer&&(night||wet);
    const maxLights=performance?3:8;
    let visibleLights=0;

    group.visible=outer;
    const lights=group.children.filter(o=>o?.isPointLight);
    lights.forEach((light,i)=>{
      const on=active&&i<maxLights;
      light.visible=on;
      light.intensity=on?(night?(performance?4.8:7.5):(performance?3.4:5.2)):0;
      light.distance=performance?8.5:12;
      if(on)visibleLights++;
    });

    group.children.forEach((obj,i)=>{
      if(!obj?.isMesh)return;
      const isBulb=obj.geometry?.type==='SphereGeometry';
      if(isBulb&&obj.material?.emissive){
        obj.material.emissiveIntensity=active?(night?2.5:1.65):.28;
        obj.visible=outer&&(!performance||i%2===0);
      }else{
        obj.visible=outer&&(!performance||i%4!==1);
      }
    });

    const stamp=[mode,band,time,weather,near?.id||'none'].join('|');
    if(stamp!==lastStamp){lastStamp=stamp;root.dataset.tggRoadsideLightingStampV202=stamp}
    root.dataset.tggRoadsideLightingAuthorityV202='1';
    root.dataset.tggRoadsideLightingActiveV202=active?'1':'0';
    root.dataset.tggRoadsideLightsVisibleV202=String(visibleLights);
    root.dataset.tggRoadsideLightingModeV202=performance?'budget':'cinematic';
    root.dataset.tggWholeWorldPreservedV202='1';
  };

  window.TGGRoadsideLightingAuthorityV202={apply,group};
  apply();
}
function applyRoadsideLightingAuthorityV202(){window.TGGRoadsideLightingAuthorityV202?.apply?.()||installRoadsideLightingAuthorityV202()}

function installExplorationActivityV202(){
  if(window.TGGExplorationActivityV202)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggExplorationActivityV202='waiting';return}
  const scene=w.scene;

  let group=scene.getObjectByName?.('TGG_EXPLORATION_ACTIVITY_V202');
  if(!group){
    group=new THREE.Group();group.name='TGG_EXPLORATION_ACTIVITY_V202';group.userData.tggOwner='V202';

    const serviceMat=new THREE.MeshStandardMaterial({color:0x4c555e,roughness:.82,metalness:.12});
    const glowMat=new THREE.MeshBasicMaterial({color:0xffcf87,transparent:true,opacity:.36,depthWrite:false});
    const trashMat=new THREE.MeshStandardMaterial({color:0x30363d,roughness:.9,metalness:.18});

    const clusters=[
      [0,-238,0],[236,34,Math.PI/2],[-228,-46,-Math.PI/2],[54,244,0]
    ];
    clusters.forEach(([x,z,rot],ci)=>{
      for(let i=0;i<5;i++){
        const prop=new THREE.Mesh(new THREE.BoxGeometry(.55,.7,.55),trashMat);
        prop.position.set(x+(i-2)*2.1,.35,z+(ci%2?7:-7));
        prop.rotation.y=rot+(i%2)*.2;
        prop.userData.tggExplorationActivityV202='service-prop';
        group.add(prop);
      }
      for(let i=0;i<3;i++){
        const bollard=new THREE.Mesh(new THREE.CylinderGeometry(.1,.13,1.15,7),serviceMat);
        bollard.position.set(x+(i-1)*2.4,.58,z+(ci%2?-5.5:5.5));
        bollard.userData.tggExplorationActivityV202='bollard';
        group.add(bollard);
      }
      const pool=new THREE.Mesh(new THREE.CircleGeometry(3.8,20),glowMat);
      pool.rotation.x=-Math.PI/2;pool.position.set(x,.035,z);
      pool.userData.tggExplorationActivityV202='light-pool';
      group.add(pool);
    });
    scene.add(group);
  }

  let movers=[];
  const syncMovers=()=>{
    const roadside=scene.getObjectByName?.('TGG_ROADSIDE_LIFE_V201');
    movers=(roadside?.children||[]).filter(o=>o?.userData?.tggRoadsideLifeV201==='person');
    movers.forEach((o,i)=>{
      if(o.userData.tggV202BaseX===undefined){
        o.userData.tggV202BaseX=o.position.x;
        o.userData.tggV202BaseZ=o.position.z;
        o.userData.tggV202Phase=i*.63;
      }
    });
  };

  const apply=()=>{
    window.TGGRoadsideLifeAuthorityV201?.apply?.();
    const active=root.dataset.tggRoadsideLifeActiveV201==='1';
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const performanceMode=mode==='performance';
    const time=String(root.dataset.tggTime||'day');
    const weather=String(root.dataset.tggWeather||'clear');
    const wet=/rain|storm/.test(weather),night=time==='night';

    group.visible=active&&!performanceMode;
    group.children.forEach(o=>{
      const kind=o.userData?.tggExplorationActivityV202;
      if(kind==='light-pool'&&o.material){
        o.material.opacity=night?.5:wet?.3:.18;
      }
    });

    if(!movers.length)syncMovers();
    const now=window.performance.now()*.001;
    let moving=0;
    movers.forEach((o,i)=>{
      if(!o.visible||performanceMode)return;
      const phase=now*.22+Number(o.userData.tggV202Phase||0);
      const radius=1.2+(i%3)*.45;
      o.position.x=Number(o.userData.tggV202BaseX||0)+Math.sin(phase)*radius;
      o.position.z=Number(o.userData.tggV202BaseZ||0)+Math.cos(phase*.8)*radius*.55;
      o.rotation.y=Math.atan2(Math.cos(phase),-Math.sin(phase*.8));
      moving++;
    });

    root.dataset.tggExplorationActivityV202='1';
    root.dataset.tggExplorationServicePropsV202=String(group.children.filter(o=>o.userData?.tggExplorationActivityV202==='service-prop').length);
    root.dataset.tggExplorationBollardsV202=String(group.children.filter(o=>o.userData?.tggExplorationActivityV202==='bollard').length);
    root.dataset.tggExplorationLightPoolsV202=String(group.children.filter(o=>o.userData?.tggExplorationActivityV202==='light-pool').length);
    root.dataset.tggExplorationMovingPeopleV202=String(moving);
    root.dataset.tggRoadsideLifeBugfixV202='performance-shadow-fixed';
    root.dataset.tggWholeWorldPreservedV202='1';
  };

  window.TGGExplorationActivityV202={apply,group};
  apply();
}
function applyExplorationActivityV202(){window.TGGExplorationActivityV202?.apply?.()||installExplorationActivityV202()}

function installExplorationStreetRealismV203(){
  if(window.TGGExplorationStreetRealismV203)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggExplorationStreetRealismV203='waiting';return}
  const scene=w.scene;

  let crosswalks=scene.getObjectByName?.('TGG_CROSSWALK_READABILITY_V203');
  if(!crosswalks&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.52,.025,4.2);
    const mat=new THREE.MeshBasicMaterial({color:0xe8e5d8,transparent:true,opacity:.88});
    crosswalks=new THREE.InstancedMesh(geo,mat,96);crosswalks.name='TGG_CROSSWALK_READABILITY_V203';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const junction=Math.floor(i/12),stripe=i%12;
      const defs=[[-34,-34,0],[34,-34,0],[34,34,Math.PI/2],[-34,34,Math.PI/2],[-88,0,Math.PI/2],[88,0,Math.PI/2],[0,-88,0],[0,88,0]];
      const d=defs[junction]||[0,0,0];
      const off=(stripe-5.5)*.68;
      p.set(d[0]+(d[2]?off:0),.052,d[1]+(d[2]?0:off));
      q.setFromEuler(new THREE.Euler(0,d[2],0));m.compose(p,q,s);crosswalks.setMatrixAt(i,m);
    }
    crosswalks.instanceMatrix.needsUpdate=true;scene.add(crosswalks);
  }

  let curbPaint=scene.getObjectByName?.('TGG_CURB_PAINT_V203');
  if(!curbPaint&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(5.4,.04,.18);
    const mat=new THREE.MeshBasicMaterial({color:0xf0c85a,transparent:true,opacity:.66});
    curbPaint=new THREE.InstancedMesh(geo,mat,112);curbPaint.name='TGG_CURB_PAINT_V203';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<112;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-14;
      p.set(axis?step*7.2:side*9.45,.245,axis?side*9.45:step*7.2);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));m.compose(p,q,s);curbPaint.setMatrixAt(i,m);
    }
    curbPaint.instanceMatrix.needsUpdate=true;scene.add(curbPaint);
  }

  let service=scene.getObjectByName?.('TGG_ROADSIDE_SERVICE_DETAIL_V203');
  if(!service){
    service=new THREE.Group();service.name='TGG_ROADSIDE_SERVICE_DETAIL_V203';service.userData.tggOwner='V203';
    const dark=new THREE.MeshStandardMaterial({color:0x2b3137,roughness:.82,metalness:.18});
    const accent=new THREE.MeshStandardMaterial({color:0x50718f,roughness:.48,metalness:.22});
    const warm=new THREE.MeshStandardMaterial({color:0xffd08a,emissive:0xffb24a,emissiveIntensity:1.2,roughness:.4});
    const defs=[[-11,-238],[11,-238],[224,31],[-216,-45],[46,237],[64,237]];
    defs.forEach(([x,z],i)=>{
      const kiosk=new THREE.Mesh(new THREE.BoxGeometry(1.3,1.8,1.1),dark);kiosk.position.set(x,.9,z);
      const panel=new THREE.Mesh(new THREE.BoxGeometry(.92,.52,.05),i%2?accent:warm);panel.position.set(x,1.15,z-.58);
      service.add(kiosk,panel);
    });
    scene.add(service);
  }

  let lastStamp='';
  const apply=()=>{
    window.TGGRoadsideLifeAuthorityV201?.apply?.();
    window.TGGRoadsideLightingAuthorityV202?.apply?.();

    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const district=String(root.dataset.tggDistrict||'downtown');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const performance=mode==='performance';
    const wet=/rain|storm|fog/.test(weather);
    const night=time==='night';
    const outer=band==='outskirts'||band==='open-road';

    if(crosswalks){
      crosswalks.visible=!outer&&!performance;
      crosswalks.material.opacity=wet?.72:.88;
    }
    if(curbPaint){
      curbPaint.visible=!performance&&(district==='downtown'||district==='studio'||district==='media'||district==='garage');
      curbPaint.material.opacity=night?.76:wet?.58:.66;
    }
    if(service){
      service.visible=outer||district==='garage';
      service.children.forEach((o,i)=>{
        if(!o?.material)return;
        if('roughness'in o.material)o.material.roughness=wet?.42:.78;
        if(o.material.emissive)o.material.emissiveIntensity=night?1.6:.65;
        o.visible=!performance||i%2===0;
      });
    }

    const roads=['TGG_TRAVEL_CORRIDORS_V23','TGG_HIGHWAY_NETWORK_V29','TGG_DISTRICT_TRANSITION_CORRIDORS_V89'];
    let touched=0;
    roads.forEach(name=>{
      const g=scene.getObjectByName?.(name);
      g?.traverse?.(o=>{
        if(!o?.isMesh||!o.material)return;
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{
          if(!m||!('roughness'in m))return;
          m.roughness=wet?.46:Math.max(.72,Number(m.roughness??.82));
          if('metalness'in m)m.metalness=wet?.1:Math.min(.05,Number(m.metalness??.03));
          if('envMapIntensity'in m)m.envMapIntensity=wet?1.05:.42;
          m.needsUpdate=true;touched++;
        });
      });
    });

    const stamp=[band,mode,district,weather,time].join('|');
    if(stamp!==lastStamp){lastStamp=stamp;root.dataset.tggExplorationStreetStampV203=stamp}
    root.dataset.tggCrosswalkReadabilityV203=crosswalks?'96':'0';
    root.dataset.tggCurbPaintV203=curbPaint?'112':'0';
    root.dataset.tggRoadsideServiceDetailV203=service?'6':'0';
    root.dataset.tggStreetSurfaceMaterialsV203=String(touched);
    root.dataset.tggRoadsideLifeBugfixV203='performance-flag-fixed';
    root.dataset.tggWholeWorldPreservedV203='1';
    root.dataset.tggExplorationStreetRealismV203='1';
  };

  window.TGGExplorationStreetRealismV203={apply};
  apply();
}
function applyExplorationStreetRealismV203(){window.TGGExplorationStreetRealismV203?.apply?.()||installExplorationStreetRealismV203()}

function installWildernessEdgeAuthorityV204(){
  if(window.TGGWildernessEdgeAuthorityV204)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggWildernessEdgeAuthorityV204='waiting';return}
  const scene=w.scene;

  let treeLine=scene.getObjectByName?.('TGG_WILDERNESS_TREE_LINE_V204');
  if(!treeLine&&THREE.InstancedMesh){
    const geo=new THREE.CylinderGeometry(.45,.7,5.6,7);
    const mat=new THREE.MeshStandardMaterial({color:0x304c35,roughness:.96,metalness:0});
    treeLine=new THREE.InstancedMesh(geo,mat,180);
    treeLine.name='TGG_WILDERNESS_TREE_LINE_V204';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3();
    const rows=[
      {axis:'x',z:-168,from:-290,to:290},
      {axis:'x',z:168,from:-290,to:290},
      {axis:'z',x:-188,from:-260,to:260},
      {axis:'z',x:188,from:-260,to:260}
    ];
    for(let i=0;i<180;i++){
      const row=rows[i%rows.length],step=Math.floor(i/rows.length);
      const t=step/44;
      const bend=Math.sin(i*1.73)*5.5;
      const x=row.axis==='x'?(row.from+(row.to-row.from)*t):row.x+bend;
      const z=row.axis==='x'?row.z+bend:(row.from+(row.to-row.from)*t);
      p.set(x,2.8,z);
      q.setFromEuler(new THREE.Euler(0,(i*.73)%Math.PI,0));
      const scale=.72+(i%7)*.055;
      sc.set(scale,scale*(.92+(i%3)*.08),scale);
      m.compose(p,q,sc);treeLine.setMatrixAt(i,m);
    }
    treeLine.instanceMatrix.needsUpdate=true;
    scene.add(treeLine);
  }

  let guardrails=scene.getObjectByName?.('TGG_OPEN_ROAD_GUARDRAILS_V204');
  if(!guardrails&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(6,.45,.16);
    const mat=new THREE.MeshStandardMaterial({color:0x7f858b,roughness:.48,metalness:.72});
    guardrails=new THREE.InstancedMesh(geo,mat,96);
    guardrails.name='TGG_OPEN_ROAD_GUARDRAILS_V204';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3(1,1,1);
    for(let i=0;i<96;i++){
      const horizontal=i<48;
      const side=i%2===0?-1:1;
      const step=Math.floor((i%48)/2)-12;
      if(horizontal){
        p.set(step*11.2,1.05,side*142);
        q.setFromEuler(new THREE.Euler(0,0,0));
      }else{
        p.set(side*160,1.05,step*11.2);
        q.setFromEuler(new THREE.Euler(0,Math.PI/2,0));
      }
      m.compose(p,q,sc);guardrails.setMatrixAt(i,m);
    }
    guardrails.instanceMatrix.needsUpdate=true;
    scene.add(guardrails);
  }

  let roadside=scene.getObjectByName?.('TGG_WILDERNESS_ROADSIDE_V204');
  if(!roadside){
    roadside=new THREE.Group();
    roadside.name='TGG_WILDERNESS_ROADSIDE_V204';
    roadside.userData.tggOwner='V204';
    const signMat=new THREE.MeshStandardMaterial({color:0x4f5b43,roughness:.7,metalness:.1});
    const reflectorMat=new THREE.MeshStandardMaterial({color:0xffd56a,emissive:0xffa52b,emissiveIntensity:.75,roughness:.38});
    const postMat=new THREE.MeshStandardMaterial({color:0x5f6266,roughness:.7,metalness:.45});
    const points=[[-150,-108],[-150,108],[150,-108],[150,108],[-108,-150],[108,-150],[-108,150],[108,150]];
    points.forEach(([x,z],i)=>{
      const post=new THREE.Mesh(new THREE.BoxGeometry(.12,2.7,.12),postMat);
      post.position.set(x,1.35,z);
      const sign=new THREE.Mesh(new THREE.BoxGeometry(1.7,.9,.08),signMat);
      sign.position.set(x,2.35,z);
      sign.rotation.y=i<4?Math.PI/2:0;
      const marker=new THREE.Mesh(new THREE.BoxGeometry(.18,.38,.07),reflectorMat);
      marker.position.set(x,1,z);
      marker.rotation.y=sign.rotation.y;
      roadside.add(post,sign,marker);
    });
    scene.add(roadside);
  }

  const apply=()=>{
    window.TGGOpenRoadEnvironmentAuthorityV198?.apply?.();
    window.TGGRoadsideLifeAuthorityV201?.apply?.();
    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const outer=band==='outskirts'||band==='open-road';
    const performance=mode==='performance';
    const wet=/rain|storm|fog/.test(weather);
    const night=time==='night';

    if(treeLine){
      treeLine.visible=outer&&!performance;
      treeLine.material.color.setHex(wet?0x263e2c:night?0x23352a:0x304c35);
      treeLine.material.roughness=wet?.78:.96;
    }
    if(guardrails){
      guardrails.visible=outer;
      guardrails.material.envMapIntensity=wet?1.25:.55;
      guardrails.material.roughness=wet?.3:.48;
    }
    if(roadside){
      roadside.visible=outer&&!performance;
      roadside.children.forEach(o=>{
        if(o.material?.emissive)o.material.emissiveIntensity=night?1.55:wet?1.05:.55;
      });
    }

    root.dataset.tggWildernessTreeLineV204=treeLine&&treeLine.visible?'180':'0';
    root.dataset.tggOpenRoadGuardrailsV204=guardrails&&guardrails.visible?'96':'0';
    root.dataset.tggWildernessRoadsideV204=roadside&&roadside.visible?'1':'0';
    root.dataset.tggWildernessBandV204=outer?band:'city';
    root.dataset.tggWholeWorldPreservedV204='1';
    root.dataset.tggWildernessEdgeAuthorityV204='1';
  };

  window.TGGWildernessEdgeAuthorityV204={apply};
  apply();
}
function applyWildernessEdgeAuthorityV204(){window.TGGWildernessEdgeAuthorityV204?.apply?.()||installWildernessEdgeAuthorityV204()}

function installNaturalTravelAtmosphereV205(){
  if(window.TGGNaturalTravelAtmosphereV205)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggNaturalTravelAtmosphereV205='waiting';return}
  const scene=w.scene;

  let hills=scene.getObjectByName?.('TGG_NATURAL_TERRAIN_RELIEF_V205');
  if(!hills){
    hills=new THREE.Group();
    hills.name='TGG_NATURAL_TERRAIN_RELIEF_V205';
    hills.userData.tggOwner='V205';
    const geo=new THREE.SphereGeometry(1,18,10);
    const mats=[
      new THREE.MeshStandardMaterial({color:0x42533a,roughness:.98,metalness:0}),
      new THREE.MeshStandardMaterial({color:0x566145,roughness:.97,metalness:0}),
      new THREE.MeshStandardMaterial({color:0x394734,roughness:.99,metalness:0})
    ];
    const points=[
      [-310,-245,58,20,42],[-235,-315,68,24,48],[-120,-352,72,28,52],[35,-365,64,21,46],[180,-338,80,27,54],[315,-255,70,24,50],
      [345,-115,62,19,44],[366,35,76,24,49],[338,190,68,22,46],[255,315,82,28,56],[105,360,66,21,47],[-55,370,78,25,52],
      [-205,330,72,23,49],[-320,245,84,29,58],[-358,92,64,20,45],[-365,-72,74,24,51],
      [-245,-215,46,14,33],[-165,-255,52,16,35],[-35,-278,44,13,31],[98,-265,50,16,36],[218,-222,48,15,34],
      [254,-98,43,13,30],[270,54,47,14,32],[235,180,49,15,34],[118,250,44,13,31],[-25,272,50,15,35],[-155,248,48,14,33],[-252,142,45,13,31]
    ];
    points.forEach(([x,z,sx,sy,sz],i)=>{
      const mesh=new THREE.Mesh(geo,mats[i%mats.length]);
      mesh.position.set(x,-sy*.28,z);
      mesh.scale.set(sx,sy,sz);
      mesh.rotation.y=(i*.47)%Math.PI;
      mesh.userData.tggNaturalTravelAtmosphereV205='hill';
      mesh.userData.tggBaseColor=mesh.material.color.getHex();
      mesh.castShadow=false;mesh.receiveShadow=true;
      hills.add(mesh);
    });
    scene.add(hills);
  }

  let rockField=scene.getObjectByName?.('TGG_ROADSIDE_ROCK_FIELD_V205');
  if(!rockField&&THREE.InstancedMesh){
    const geo=new THREE.DodecahedronGeometry(.65,0);
    const mat=new THREE.MeshStandardMaterial({color:0x62635d,roughness:.94,metalness:.02});
    rockField=new THREE.InstancedMesh(geo,mat,84);
    rockField.name='TGG_ROADSIDE_ROCK_FIELD_V205';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3();
    for(let i=0;i<84;i++){
      const side=i%2===0?-1:1;
      const corridor=i%4<2?'x':'z';
      const step=Math.floor(i/4)-10;
      const jitter=Math.sin(i*2.31)*5.5;
      const x=corridor==='x'?step*17+jitter:side*(176+(i%5)*5);
      const z=corridor==='x'?side*(158+(i%6)*4):step*17+jitter;
      p.set(x,.38,z);
      q.setFromEuler(new THREE.Euler(i*.13,i*.61,i*.07));
      const size=.65+(i%7)*.09;sc.set(size*1.25,size,size*.9);
      m.compose(p,q,sc);rockField.setMatrixAt(i,m);
    }
    rockField.instanceMatrix.needsUpdate=true;
    scene.add(rockField);
  }

  const apply=()=>{
    window.TGGWildernessEdgeAuthorityV204?.apply?.();
    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const outer=band==='outskirts'||band==='open-road';
    const performance=mode==='performance';
    const travel=mode==='travel'||band==='open-road';
    const wet=/rain|storm|fog/.test(weather);
    const night=time==='night';

    if(hills){
      hills.visible=outer;
      hills.children.forEach((o,i)=>{
        o.visible=!performance||i%2===0;
        if(!o.material)return;
        const base=Number(o.userData?.tggBaseColor||0x42533a);
        if(night)o.material.color.setHex((base&0xfefefe)>>1);
        else if(wet)o.material.color.setHex(0x39463a+(i%3)*0x030303);
        else o.material.color.setHex(base);
        o.material.roughness=wet?.82:.98;
        if('envMapIntensity'in o.material)o.material.envMapIntensity=wet?.58:.2;
      });
    }

    if(rockField){
      rockField.visible=outer&&!performance;
      rockField.material.color.setHex(wet?0x4f5350:night?0x434744:0x62635d);
      rockField.material.roughness=wet?.72:.94;
      if('envMapIntensity'in rockField.material)rockField.material.envMapIntensity=wet?.7:.25;
    }

    if(scene.fog&&outer){
      const target=night?(travel?.00315:.00345):wet?(travel?.00345:.0038):(travel?.00245:.00285);
      scene.fog.density=performance?Math.max(target,.0034):target;
    }

    if(scene.background?.isColor&&outer){
      if(night)scene.background.setHex(0x0a1220);
      else if(wet)scene.background.setHex(0x81909a);
      else if(time==='sunset')scene.background.setHex(0xb88769);
    }

    root.dataset.tggNaturalTerrainReliefV205=hills&&hills.visible?String(hills.children.filter(o=>o.visible).length):'0';
    root.dataset.tggRoadsideRockFieldV205=rockField&&rockField.visible?'84':'0';
    root.dataset.tggNaturalTravelWeatherV205=weather;
    root.dataset.tggNaturalTravelTimeV205=time;
    root.dataset.tggNaturalTravelAtmosphereV205='1';
    root.dataset.tggWholeWorldPreservedV205='1';
  };

  window.TGGNaturalTravelAtmosphereV205={apply};
  apply();
}
function applyNaturalTravelAtmosphereV205(){window.TGGNaturalTravelAtmosphereV205?.apply?.()||installNaturalTravelAtmosphereV205()}

function installNaturalRegionRealismV206(){
  if(window.TGGNaturalRegionRealismV206)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggNaturalRegionRealismV206='waiting';return}
  const scene=w.scene;

  let creeks=scene.getObjectByName?.('TGG_NATURAL_DRAINAGE_V206');
  if(!creeks){
    creeks=new THREE.Group();creeks.name='TGG_NATURAL_DRAINAGE_V206';creeks.userData.tggOwner='V206';
    const waterMat=new THREE.MeshPhysicalMaterial({color:0x42636f,roughness:.16,metalness:.03,transparent:true,opacity:.58,transmission:.12});
    const bankMat=new THREE.MeshStandardMaterial({color:0x4a503b,roughness:.97,metalness:0});
    const strips=[
      [-330,-170,145,8,.28],[-255,245,118,7,-.62],[-55,-335,132,7,.08],[185,295,112,7,.56],[315,80,125,8,1.12]
    ];
    strips.forEach(([x,z,len,width,rot],i)=>{
      const bank=new THREE.Mesh(new THREE.PlaneGeometry(len,width+5,1,1),bankMat);
      bank.rotation.x=-Math.PI/2;bank.rotation.z=rot;bank.position.set(x,.018,z);bank.userData.tggDrainagePartV206='bank';
      const water=new THREE.Mesh(new THREE.PlaneGeometry(len,width,1,1),waterMat.clone());
      water.rotation.x=-Math.PI/2;water.rotation.z=rot;water.position.set(x,.026,z);water.userData.tggDrainagePartV206='water';
      water.material.opacity=.48+(i%3)*.05;
      creeks.add(bank,water);
    });
    scene.add(creeks);
  }

  let meadow=scene.getObjectByName?.('TGG_MEADOW_BREAKUP_V206');
  if(!meadow&&THREE.InstancedMesh){
    const geo=new THREE.CircleGeometry(7.5,14);
    const mat=new THREE.MeshBasicMaterial({color:0x4e6544,transparent:true,opacity:.22,depthWrite:false});
    meadow=new THREE.InstancedMesh(geo,mat,128);meadow.name='TGG_MEADOW_BREAKUP_V206';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<128;i++){
      const a=(i/128)*Math.PI*2+(i%9)*.13,r=520+(i%11)*27;
      p.set(Math.cos(a)*r,.035,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(-Math.PI/2,0,a*.7));
      const sc=.62+(i%7)*.11;s.set(sc,sc*(.72+(i%3)*.08),1);
      m.compose(p,q,s);meadow.setMatrixAt(i,m);
    }
    meadow.instanceMatrix.needsUpdate=true;scene.add(meadow);
  }

  let fences=scene.getObjectByName?.('TGG_RURAL_FENCE_LINES_V206');
  if(!fences&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(4.6,.18,.16);
    const mat=new THREE.MeshStandardMaterial({color:0x625444,roughness:.94,metalness:.01});
    fences=new THREE.InstancedMesh(geo,mat,108);fences.name='TGG_RURAL_FENCE_LINES_V206';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<108;i++){
      const side=i%4,step=Math.floor(i/4)-13;let x=0,z=0,r=0;
      if(side===0){x=-245;z=step*10.2;r=Math.PI/2}
      if(side===1){x=245;z=step*10.2;r=Math.PI/2}
      if(side===2){x=step*10.2;z=-245;r=0}
      if(side===3){x=step*10.2;z=245;r=0}
      p.set(x,.62,z);q.setFromEuler(new THREE.Euler(0,r,0));
      m.compose(p,q,s);fences.setMatrixAt(i,m);
    }
    fences.instanceMatrix.needsUpdate=true;scene.add(fences);
  }

  let grass=scene.getObjectByName?.('TGG_ROADSIDE_GRASS_BANDS_V206');
  if(!grass&&THREE.InstancedMesh){
    const geo=new THREE.ConeGeometry(.22,1.05,5);
    const mat=new THREE.MeshStandardMaterial({color:0x3f613f,roughness:.99,metalness:0});
    grass=new THREE.InstancedMesh(geo,mat,220);grass.name='TGG_ROADSIDE_GRASS_BANDS_V206';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<220;i++){
      const side=i%2?-1:1,corridor=i%4<2?'x':'z',step=Math.floor(i/4)-27,jitter=Math.sin(i*1.73)*2.7;
      const x=corridor==='x'?step*7.4+jitter:side*(112+(i%5)*3.2);
      const z=corridor==='x'?side*(112+(i%6)*3.1):step*7.4+jitter;
      p.set(x,.52,z);q.setFromEuler(new THREE.Euler(0,i*.43,0));
      const sc=.7+(i%5)*.09;s.set(sc,sc*(.86+(i%3)*.08),sc);
      m.compose(p,q,s);grass.setMatrixAt(i,m);
    }
    grass.instanceMatrix.needsUpdate=true;scene.add(grass);
  }

  let lastSig='';
  const apply=()=>{
    window.TGGNaturalTravelAtmosphereV205?.apply?.();
    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const outer=band==='outskirts'||band==='open-road';
    const performance=mode==='performance';
    const wet=/rain|storm|fog/.test(weather);
    const night=time==='night';
    const sig=[band,mode,weather,time].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(creeks){
        creeks.visible=outer;
        creeks.children.forEach((o,i)=>{
          if(!o.material)return;
          if(o.userData?.tggDrainagePartV206==='water'){
            o.material.color.setHex(night?0x233846:wet?0x385763:0x42636f);
            o.material.roughness=wet?.08:.16;
            o.material.opacity=wet?.68:.56;
          }else{
            o.material.color.setHex(wet?0x3f4738:night?0x30372e:0x4a503b);
          }
        });
      }
      if(meadow){
        meadow.visible=outer&&!performance;
        meadow.material.color.setHex(night?0x2d3c2c:wet?0x41583e:0x4e6544);
        meadow.material.opacity=wet?.18:.23;
      }
      if(fences){
        fences.visible=outer&&!performance;
        fences.material.color.setHex(night?0x40382f:wet?0x51483d:0x625444);
      }
      if(grass){
        grass.visible=outer;
        grass.material.color.setHex(night?0x29402c:wet?0x355238:0x3f613f);
      }
    }

    root.dataset.tggNaturalDrainageV206=creeks&&creeks.visible?'5':'0';
    root.dataset.tggMeadowBreakupV206=meadow&&meadow.visible?'128':'0';
    root.dataset.tggRuralFenceLinesV206=fences&&fences.visible?'108':'0';
    root.dataset.tggRoadsideGrassBandsV206=grass&&grass.visible?'220':'0';
    root.dataset.tggNaturalRegionBandV206=band;
    root.dataset.tggNaturalRegionRealismV206='1';
    root.dataset.tggWholeWorldPreservedV206='1';
  };

  window.TGGNaturalRegionRealismV206={apply};
  apply();
}
function applyNaturalRegionRealismV206(){window.TGGNaturalRegionRealismV206?.apply?.()||installNaturalRegionRealismV206()}

function installNaturalRoadEdgeV207(){
  if(window.TGGNaturalRoadEdgeV207)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggNaturalRoadEdgeV207='waiting';return}
  const scene=w.scene;

  let ditches=scene.getObjectByName?.('TGG_ROADSIDE_DITCHES_V207');
  if(!ditches&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(7.2,.16,1.1);
    const mat=new THREE.MeshStandardMaterial({color:0x4d503e,roughness:.98,metalness:0});
    ditches=new THREE.InstancedMesh(geo,mat,144);ditches.name='TGG_ROADSIDE_DITCHES_V207';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<144;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-18;
      p.set(axis?step*9.2:side*124,.06,axis?side*124:step*9.2);
      q.setFromEuler(new THREE.Euler(0,axis?Math.PI/2:0,0));
      m.compose(p,q,s);ditches.setMatrixAt(i,m);
    }
    ditches.instanceMatrix.needsUpdate=true;scene.add(ditches);
  }

  let hedges=scene.getObjectByName?.('TGG_RURAL_HEDGEROWS_V207');
  if(!hedges&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(5.4,1.1,1.35);
    const mat=new THREE.MeshStandardMaterial({color:0x35523a,roughness:.97,metalness:0});
    hedges=new THREE.InstancedMesh(geo,mat,96);hedges.name='TGG_RURAL_HEDGEROWS_V207';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    for(let i=0;i<96;i++){
      const a=(i/96)*Math.PI*2+(i%7)*.08,r=285+(i%6)*26;
      p.set(Math.cos(a)*r,.56,Math.sin(a)*r);
      q.setFromEuler(new THREE.Euler(0,-a+Math.PI/2,0));
      const sc=.76+(i%5)*.08;s.set(sc,.82+(i%4)*.07,1);
      m.compose(p,q,s);hedges.setMatrixAt(i,m);
    }
    hedges.instanceMatrix.needsUpdate=true;scene.add(hedges);
  }

  let posts=scene.getObjectByName?.('TGG_ROADSIDE_MARKER_POSTS_V207');
  if(!posts&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.14,1.4,.14);
    const mat=new THREE.MeshStandardMaterial({color:0xd7d8cf,roughness:.72,metalness:.04});
    posts=new THREE.InstancedMesh(geo,mat,168);posts.name='TGG_ROADSIDE_MARKER_POSTS_V207';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(1,1,1);
    for(let i=0;i<168;i++){
      const axis=i%2,side=i%4<2?-1:1,step=Math.floor(i/4)-21;
      p.set(axis?step*8.1:side*117,.7,axis?side*117:step*8.1);
      q.identity();m.compose(p,q,s);posts.setMatrixAt(i,m);
    }
    posts.instanceMatrix.needsUpdate=true;scene.add(posts);
  }

  let lastSig='';
  const apply=()=>{
    window.TGGNaturalRegionRealismV206?.apply?.();
    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const outer=band==='outskirts'||band==='open-road';
    const performance=mode==='performance';
    const wet=/rain|storm|fog/.test(weather);
    const night=time==='night';
    const sig=[band,mode,weather,time].join('|');

    if(sig!==lastSig){
      lastSig=sig;
      if(ditches){
        ditches.visible=outer;
        ditches.material.color.setHex(wet?0x444b3b:night?0x34382f:0x4d503e);
        ditches.material.roughness=wet?.8:.98;
      }
      if(hedges){
        hedges.visible=outer&&!performance;
        hedges.material.color.setHex(night?0x273a2c:wet?0x304936:0x35523a);
      }
      if(posts){
        posts.visible=outer;
        posts.material.color.setHex(night?0xb6c7d3:0xd7d8cf);
      }
    }

    root.dataset.tggRoadsideDitchesV207=ditches&&ditches.visible?'144':'0';
    root.dataset.tggRuralHedgerowsV207=hedges&&hedges.visible?'96':'0';
    root.dataset.tggRoadsideMarkerPostsV207=posts&&posts.visible?'168':'0';
    root.dataset.tggNaturalRoadEdgeBandV207=band;
    root.dataset.tggNaturalRoadEdgeOwnerV207='subordinate-to-v206';
    root.dataset.tggNaturalRoadEdgeV207='1';
    root.dataset.tggWholeWorldPreservedV207='1';
  };

  window.TGGNaturalRoadEdgeV207={apply};
  apply();
}
function applyNaturalRoadEdgeV207(){window.TGGNaturalRoadEdgeV207?.apply?.()||installNaturalRoadEdgeV207()}

function installLongHaulTravelAuthorityV208(){
  if(window.TGGLongHaulTravelAuthorityV208)return;
  const THREE=window.THREE,w=window.TGG3D;
  if(!THREE||!w?.scene){root.dataset.tggLongHaulTravelAuthorityV208='waiting';return}
  const scene=w.scene;

  const routes=[
    {id:'north',label:'NORTHLINE',x:0,z:-420,rot:0},
    {id:'south',label:'SOUTHLINE',x:0,z:420,rot:Math.PI},
    {id:'east',label:'EASTLINK',x:420,z:0,rot:-Math.PI/2},
    {id:'west',label:'WESTLINK',x:-420,z:0,rot:Math.PI/2}
  ];

  let routeMarkers=scene.getObjectByName?.('TGG_LONG_HAUL_ROUTE_MARKERS_V208');
  if(!routeMarkers){
    routeMarkers=new THREE.Group();
    routeMarkers.name='TGG_LONG_HAUL_ROUTE_MARKERS_V208';
    routes.forEach((route,idx)=>{
      const pole=new THREE.Mesh(
        new THREE.BoxGeometry(.22,4.8,.22),
        new THREE.MeshStandardMaterial({color:0x5b6268,roughness:.72,metalness:.18})
      );
      pole.position.set(route.x,2.4,route.z);
      pole.rotation.y=route.rot;
      pole.userData={tggRouteIdV208:route.id,tggRouteLabelV208:route.label};

      const sign=new THREE.Mesh(
        new THREE.BoxGeometry(5.6,1.6,.18),
        new THREE.MeshStandardMaterial({color:idx%2?0x193c62:0x1f4b38,roughness:.64,metalness:.06})
      );
      sign.position.set(route.x,5.1,route.z);
      sign.rotation.y=route.rot;
      sign.userData={tggRouteIdV208:route.id,tggRouteLabelV208:route.label,tggRouteSignV208:1};

      routeMarkers.add(pole,sign);
    });
    scene.add(routeMarkers);
  }

  let milestones=scene.getObjectByName?.('TGG_LONG_HAUL_MILESTONES_V208');
  if(!milestones&&THREE.InstancedMesh){
    const geo=new THREE.BoxGeometry(.2,1.15,.2);
    const mat=new THREE.MeshStandardMaterial({color:0xe3e1d4,roughness:.8,metalness:.03});
    milestones=new THREE.InstancedMesh(geo,mat,160);
    milestones.name='TGG_LONG_HAUL_MILESTONES_V208';
    const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3(1,1,1);
    for(let i=0;i<160;i++){
      const axis=i%2;
      const side=i%4<2?-1:1;
      const step=Math.floor(i/4)-20;
      const span=step*18.5;
      p.set(axis?span:side*136,.58,axis?side*136:span);
      q.identity();
      m.compose(p,q,sc);
      milestones.setMatrixAt(i,m);
    }
    milestones.instanceMatrix.needsUpdate=true;
    scene.add(milestones);
  }

  const playerPos=()=>w.car?.position||w.avatar?.position||w.player?.position||w.camera?.position||{x:0,z:0};
  const chooseRoute=pos=>{
    const ax=Math.abs(Number(pos?.x||0)),az=Math.abs(Number(pos?.z||0));
    if(ax>az)return Number(pos?.x||0)>=0?routes[2]:routes[3];
    return Number(pos?.z||0)>=0?routes[1]:routes[0];
  };

  let lastSig='';
  const apply=()=>{
    window.TGGNaturalRoadEdgeV207?.apply?.();
    const pos=playerPos();
    const band=String(root.dataset.tggTravelBandV195||'core');
    const mode=String(root.dataset.tggAdaptiveSceneModeV194||'cinematic');
    const weather=String(root.dataset.tggWeather||'clear');
    const time=String(root.dataset.tggTime||'day');
    const route=chooseRoute(pos);
    const outer=band==='outskirts'||band==='open-road';
    const performance=mode==='performance';
    const night=time==='night';
    const wet=/rain|storm|fog/.test(weather);
    const distanceFromCore=Math.round(Math.hypot(Number(pos?.x||0),Number(pos?.z||0)));

    if(routeMarkers){
      routeMarkers.visible=outer;
      routeMarkers.children.forEach(obj=>{
        if(!obj.material)return;
        if(obj.userData?.tggRouteSignV208){
          obj.material.emissive?.setHex?.(night?0x10263c:0x000000);
          obj.material.emissiveIntensity=night?.55:0;
          obj.material.roughness=wet?.4:.64;
        }else{
          obj.material.roughness=wet?.5:.72;
        }
      });
    }
    if(milestones){
      milestones.visible=outer&&!performance;
      milestones.material.color.setHex(night?0xc8d1d7:wet?0xd1d0c7:0xe3e1d4);
    }

    const sig=[route.id,band,mode,weather,time].join('|');
    if(sig!==lastSig){
      lastSig=sig;
      root.dataset.tggLongHaulRouteStampV208=sig;
    }

    root.dataset.tggLongHaulRouteV208=route.id;
    root.dataset.tggLongHaulRouteLabelV208=route.label;
    root.dataset.tggLongHaulDistanceFromCoreV208=String(distanceFromCore);
    root.dataset.tggLongHaulMilestonesV208=milestones&&milestones.visible?'160':'0';
    root.dataset.tggLongHaulSignsV208=routeMarkers&&routeMarkers.visible?'4':'0';
    root.dataset.tggLongHaulTravelAuthorityV208='1';
    root.dataset.tggWholeWorldPreservedV208='1';
  };

  window.TGGLongHaulTravelAuthorityV208={apply,chooseRoute};
  apply();
}
function applyLongHaulTravelAuthorityV208(){window.TGGLongHaulTravelAuthorityV208?.apply?.()||installLongHaulTravelAuthorityV208()}
function tick(){detectDistrict();motion();weather();applyDriveCatchup();applyCameraCatchup();applyLifeCatchup();applyMaxBatchPolish();applyUltraMegaBatch();applyPresentationDirector();applyUltraMaxDirector();applyWorldDensityMega();applyFullCityLifeBatch();applyVehicleShowcaseV16();applyOpenRoadV16();applyStreetRaceV17();applyTrafficVarietyV17();applyDistrictDepthV17();installGarageCustomizerV18();applyRaceNightV21();applyRoadDepthV21();applyRaceEventV22();applyTravelDepthV22();applyRaceCountdownV23();applyTravelCorridorsV23();applyRaceOpponentsV24();applyDestinationSpacingV24();applyStudioReturnV24();applyRaceProgressV25();applyOpponentAI25();applyReturnedWorldVfx25();applyRaceHudV26();installNitrousV26();applyReturnedEditorPresetV26();applyRaceResultsV27();applyOpponentDifficultyV27();applyNitrousBehaviorV27();applyRoadNetworkV27();applyReturnedMoodV27();applyRaceEconomyV28();applyOpponentCatchupV28();installNitrousRechargeV28();applyDistrictJunctionsV28();applyReturnedEnvironmentV28();installGarageEconomyV29();applyPerformanceStatsV29();applyHighwayNetworkV29();applyWeatherBlendV29();applyGarageHudV30();applyRaceTierV30();applyInterchangesV30();applyUpgradeFeedbackV30();applyRaceTierLocksV31();applyTierScaledRaceV31();applyVisualUpgradeEvolutionV31();applyCareerLinksV31();applyRaceEventsV32();applyRaceRewardEscalationV32();applyGarageEvolutionV32();applyCareerDestinationsV32();applyEventRoutesV33();applyRaceEntryV33();applyChampionshipBonusV33();applyGarageMilestonesV33();applyEventCardV33();installRaceStartGuardV34();applyEventCheckpointProgressV34();applyCareerPayoutV34();applyChampionshipHistoryV34();applyCareerLadderHudV34();installRaceTimingV35();applyRaceTimingV35();applyCareerXpV35();applyCareerUnlocksV35();applyRaceResultsScreenV35();applyPostRaceFlowV35();applyEventCompletionV36();applyCareerUnlockPersistenceV36();applyTierRivalsV36();applyAchievementsV36();applyNextObjectiveV36();enhanceResultsActionsV36();applyRivalBehaviorV37();applyWinStreakV37();applyAchievementRewardsV37();applyGarageReturnV37();applyCareerDashboardV37();applyRivalChallengeV38();applyStreakRiskRewardV38();applyAchievementToastV38();applyNextTierGateV38();enhanceCareerDashboardV38();installRivalShowdownsV39();applyRivalRouteV39();applyStreakPayoutV39();applyAchievementsPanelV39();enforceTierUnlocksV39();enhanceResultsRivalV39();applyRivalSeriesV40();applyCrewReputationV40();applySeasonPointsV40();applyChampionshipQualificationV40();applySeasonStandingsV40();applySeasonSummaryV40();installChampionshipFinaleV41();applyChampionshipRouteV41();applySeriesCompletionRewardV41();applyCrewRankV41();applySeasonTrophyV41();applySeasonFinaleResultsV41();installNextSeasonV41();applySeasonHistoryV42();applyTrophyDisplayV42();applyCrewRankRewardsV42();applyFinaleRivalV42();installNewSeasonSetupV42();applySeasonLegacyPanelV42();installRaceLifecycleV43();applyRaceLifecycleV43();installNitrousRestoreV43();applyEnvironmentDirectorV43();installHudDirectorV44();applyHudDirectorV44();installGraphicsDirectorV50();applyGraphicsDirectorV50();installVisualProductionV51();applyVisualProductionV51();installOpenWorldCompositionV52();applyOpenWorldCompositionV52();installWorldRegionsV53();applyWorldRegionsV53();installNightDriveV54();applyNightDriveV54();installGraphicsPerformanceV55();applyGraphicsPerformanceV55();installGraphicsOwnershipV56();applyGraphicsOwnershipV56();installGraphicsManifestV57();applyGraphicsManifestV57();installBuildIntegrityV58();applyBuildIntegrityV58();installBuildFailSafeV59();applyBuildFailSafeV59();installBuildRecoveryV60();applyBuildRecoveryV60();installRaceCoreAuthorityV61();applyRaceCoreAuthorityV61();installRaceTierAuthorityV62();applyRaceTierAuthorityV62();installCheckpointAuthorityV63();applyCheckpointAuthorityV63();installOpponentRouteAuthorityV64();applyOpponentRouteAuthorityV64();installOpponentDynamicsV65();applyOpponentDynamicsV65();installRacecraftV66();applyRacecraftV66();installPayoutAuthorityV67();applyPayoutAuthorityV67();installProgressAuthorityV68();applyProgressAuthorityV68();installRewardIntegrityV69();applyRewardIntegrityV69();installRuntimeEfficiencyV70();applyRuntimeEfficiencyV70();installRuntimeHotspotCacheV71();applyRuntimeHotspotCacheV71();installVisualBudgetV72();applyVisualBudgetV72();installSystemIntegrityV73();applySystemIntegrityV73();installAuthorityConsolidationV74();applyAuthorityConsolidationV74();installWorldVisualOverhaulV75();applyWorldVisualOverhaulV75();installOpenWorldExpansionV76();applyOpenWorldExpansionV76();installDistrictIdentityV77();applyDistrictIdentityV77();installWorldSurfacePolishV78();applyWorldSurfacePolishV78();installPremiumWorldPresentationV79();applyPremiumWorldPresentationV79();installNightCohesionV80();applyNightCohesionV80();installDaylightRealismV81();applyDaylightRealismV81();installWorldArtDirectionV82();applyWorldArtDirectionV82();installWorldDepthCuesV83();applyWorldDepthCuesV83();installAmbientWorldMotionV84();applyAmbientWorldMotionV84();installWorldGroundingV85();applyWorldGroundingV85();installWorldFinishDetailV86();applyWorldFinishDetailV86();installWorldMicrodetailV87();applyWorldMicrodetailV87();installTravelIdentityV88();applyTravelIdentityV88();installDistrictTransitionV89();applyDistrictTransitionV89();installWorldGroundingV90();applyWorldGroundingV90();installWorldScaleFinishV91();applyWorldScaleFinishV91();installMobilityEconomyV91();applyMobilityEconomyV91();installMobilityWorldIntegrationV92();applyMobilityWorldIntegrationV92();installWorldLifeDirectorV93();applyWorldLifeDirectorV93();installWholeWorldIntegrationV94();applyWholeWorldIntegrationV94();installWholeWorldFinishV95();applyWholeWorldFinishV95();installStreetCohesionV96();applyStreetCohesionV96();installUrbanFinishV97();applyUrbanFinishV97();installEnvironmentalRealismV98();applyEnvironmentalRealismV98();installAtmosphericContinuityV99();applyAtmosphericContinuityV99();installWorldMilestoneV100();applyWorldMilestoneV100();installWorldCohesionV101();applyWorldCohesionV101();installExplorationReadabilityV102();applyExplorationReadabilityV102();installStreetLevelRealismV103();applyStreetLevelRealismV103();installLivingWorldMotionV104();applyLivingWorldMotionV104();installExplorationLifeV105();applyExplorationLifeV105();installFinalVisualOwnershipV106();applyFinalVisualOwnershipV106();installWorldConvergenceV107();applyWorldConvergenceV107();installSceneBudgetAuthorityV108();applySceneBudgetAuthorityV108();installWorldStateAuthorityV109();applyWorldStateAuthorityV109();installSpatialStreamingV110();applySpatialStreamingV110();installSpatialStreamingCorrectnessV111();applySpatialStreamingCorrectnessV111();installWholeWorldConvergenceV112();applyWholeWorldConvergenceV112();installExplorationFidelityV113();applyExplorationFidelityV113();installNearFieldFidelityV114();applyNearFieldFidelityV114();installStreetLifeFidelityV115();applyStreetLifeFidelityV115();installLivingStreetMotionV116();applyLivingStreetMotionV116();installExplorationMotionV117();applyExplorationMotionV117();installEnvironmentalStorytellingV118();applyEnvironmentalStorytellingV118();installSurfaceStorytellingV119();applySurfaceStorytellingV119();installWorldNavigationV120();applyWorldNavigationV120();installDestinationArchitectureV121();applyDestinationArchitectureV121();installArrivalExperienceV122();applyArrivalExperienceV122();installInteractionReadabilityV123();applyInteractionReadabilityV123();installDestinationInteractionV124();applyDestinationInteractionV124();installDestinationRealismV125();applyDestinationRealismV125();installDestinationEcosystemV126();applyDestinationEcosystemV126();installWholeGameMegaBatchV127();applyWholeGameMegaBatchV127();installWorldPolishConvergenceV128();applyWorldPolishConvergenceV128();installWholeWorldBudgetV129();applyWholeWorldBudgetV129();installRenderConvergenceV130();applyRenderConvergenceV130();installNearFieldMaterialV131();applyNearFieldMaterialV131();installDestinationThresholdsV132();applyDestinationThresholdsV132();installInteractionFidelityV133();applyInteractionFidelityV133();installInteractionPhysicalityV134();applyInteractionPhysicalityV134();installDestinationEnterAuthorityV135();applyDestinationEnterAuthorityV135();installDestinationFlowV136();applyDestinationFlowV136();installDestinationActivityV137();applyDestinationActivityV137();installWholeWorldVisualAuthorityV138();applyWholeWorldVisualAuthorityV138();installStreetCompositionV139();applyStreetCompositionV139();installStreetEdgeRealismV140();applyStreetEdgeRealismV140();installLivingWorldV141();applyLivingWorldV141();installCurbsideWorldV142();applyCurbsideWorldV142();installPublicSpaceV143();applyPublicSpaceV143();installPublicRealmV144();applyPublicRealmV144();installDestinationInteriorsV145();applyDestinationInteriorsV145();installDestinationInteriorDetailV146();applyDestinationInteriorDetailV146();installNearFieldIlluminationV147();applyNearFieldIlluminationV147();installVisualConvergenceV148();applyVisualConvergenceV148();installWorldScaleContinuityV149();applyWorldScaleContinuityV149();installWholeWorldMilestoneV150();applyWholeWorldMilestoneV150();installEnvironmentalContinuityV151();applyEnvironmentalContinuityV151();installWorldContinuityDirectorV152();applyWorldContinuityDirectorV152();installWorldPresentationAuthorityV153();applyWorldPresentationAuthorityV153();installSurfaceRealityV154();applySurfaceRealityV154();installMaterialConvergenceV155();applyMaterialConvergenceV155();installSurfaceAgingV156();applySurfaceAgingV156();installEnvironmentalWeatheringV157();applyEnvironmentalWeatheringV157();installEnvironmentalConvergenceV158();applyEnvironmentalConvergenceV158();installEnvironmentalPresentationAuthorityV159();applyEnvironmentalPresentationAuthorityV159();installWorldTransitionSmoothingV160();applyWorldTransitionSmoothingV160();installSurfaceTransitionSmoothingV161();applySurfaceTransitionSmoothingV161();installWorldMotionCoherenceV162();applyWorldMotionCoherenceV162();installWorldStreamingBudgetV163();applyWorldStreamingBudgetV163();installFinalSceneCompositionV164();applyFinalSceneCompositionV164();installCinematicFramingV165();applyCinematicFramingV165();installWholeWorldGroundingAuthorityV166();applyWholeWorldGroundingAuthorityV166();installWholeWorldAcceptanceV167();applyWholeWorldAcceptanceV167();installWholeWorldGraphicsSealV168();applyWholeWorldGraphicsSealV168();installWholeWorldStabilityV169();applyWholeWorldStabilityV169();installWholeWorldPresentationV170();applyWholeWorldPresentationV170();installWorldMomentV171();applyWorldMomentV171();installWorldMomentConvergenceV172();applyWorldMomentConvergenceV172();installWholeWorldExperienceV173();applyWholeWorldExperienceV173();installWholeWorldVisualQAV174();applyWholeWorldVisualQAV174();installWholeWorldFinalVerificationV175();applyWholeWorldFinalVerificationV175();installPostQAPolishV176();applyPostQAPolishV176();installFinalVisualConvergenceV177();applyFinalVisualConvergenceV177();installWholeWorldSealV178();applyWholeWorldSealV178();installProductionVisualSentinelV179();applyProductionVisualSentinelV179();installProductionHandoffV180();applyProductionHandoffV180();installPostHandoffRefinementV181();applyPostHandoffRefinementV181();installWorldTransitionBlendV182();applyWorldTransitionBlendV182();installStreetMaterialContinuityV183();applyStreetMaterialContinuityV183();installRuntimeConvergenceV184();applyRuntimeConvergenceV184();installDeploymentConvergenceV185();applyDeploymentConvergenceV185();installReleaseBridgeV186();applyReleaseBridgeV186();installReleaseAcceptanceV187();applyReleaseAcceptanceV187();installPostAcceptancePolishV188();applyPostAcceptancePolishV188();installPostAcceptanceGroundingV189();applyPostAcceptanceGroundingV189();installWholeWorldHarmonizationV190();applyWholeWorldHarmonizationV190();installWholeWorldAuthorityV191();applyWholeWorldAuthorityV191();installPostAuthorityRefinementV192();applyPostAuthorityRefinementV192();installWholeWorldConflictAuditV193();applyWholeWorldConflictAuditV193();installAdaptiveSceneBudgetV194();applyAdaptiveSceneBudgetV194();installOpenWorldScaleAuthorityV195();applyOpenWorldScaleAuthorityV195();installMidDistanceCompositionV196();applyMidDistanceCompositionV196();installProximityMaterialAuthorityV197();applyProximityMaterialAuthorityV197();installOpenRoadEnvironmentAuthorityV198();applyOpenRoadEnvironmentAuthorityV198();installTravelLandmarkAuthorityV199();applyTravelLandmarkAuthorityV199();installOpenRoadFidelityV199();applyOpenRoadFidelityV199();installWholeGameMilestoneV200();applyWholeGameMilestoneV200();installRoadsideLifeAuthorityV201();applyRoadsideLifeAuthorityV201();installRoadsideLightingAuthorityV202();applyRoadsideLightingAuthorityV202();installExplorationStreetRealismV203();applyExplorationStreetRealismV203();installWildernessEdgeAuthorityV204();applyWildernessEdgeAuthorityV204();installNaturalTravelAtmosphereV205();applyNaturalTravelAtmosphereV205();installNaturalRegionRealismV206();applyNaturalRegionRealismV206();installNaturalRoadEdgeV207();applyNaturalRoadEdgeV207();installLongHaulTravelAuthorityV208();applyLongHaulTravelAuthorityV208();applyPlaytestQuickAccess()}
syncAvatar();ambient();quality();ui();tick();applyDriveCatchup();applyCameraCatchup();applyLifeCatchup();applyMaxBatchPolish();applyUltraMegaBatch();applyPresentationDirector();applyUltraMaxDirector();applyWorldDensityMega();applyFullCityLifeBatch();applyVehicleShowcaseV16();applyOpenRoadV16();applyOpenWorldScaleAuthorityV195();applyWildernessEdgeAuthorityV204();applyNaturalTravelAtmosphereV205();applyPlaytestQuickAccess();
addEventListener('tgg-world-avatar-changed',e=>{try{localStorage.setItem('tgg-world-avatar-v12',JSON.stringify(e.detail||{}))}catch{};syncAvatar()});
addEventListener('storage',e=>{if(e.key==='tgg-world-avatar-v12')syncAvatar()});
new MutationObserver(()=>{window.TGGRuntimeConvergenceV184?.schedule?.('mutation')}).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
setInterval(()=>{window.TGGRuntimeConvergenceV184?.schedule?.('interval')||tick()},1200);
window.TGG1000X={state,setDistrict:v=>set('district',v),setWeather:v=>set('weather',v),setTime:v=>set('time',v),health:()=>({ok:true,version:'1000x-master',state:{...state}})};
})();