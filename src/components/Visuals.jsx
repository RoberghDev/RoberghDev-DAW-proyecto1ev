import React, { useEffect, useRef, useState } from 'react';
import { COLECCIONES, buscarProducto, precioTexto, resumenProducto } from '../data.js';

let threePromise;
function loadThree() {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (!threePromise) threePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/js/vendor/three.min.js';
    script.onload = () => resolve(window.THREE);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return threePromise;
}
function watchMesh(THREE, collection, index) {
  const group = new THREE.Group();
  const copper = ['#b77850','#b77850','#b77850','#232120','#b77850','#b77850'][index];
  const caseMaterial = new THREE.MeshStandardMaterial({ color: copper, metalness: .8, roughness: .27 });
  const dialMaterial = new THREE.MeshStandardMaterial({ color: index === 1 || index === 4 ? '#e5dfd5' : '#171615', metalness: .45, roughness: .38 });
  const strapMaterial = new THREE.MeshStandardMaterial({ color: index === 2 ? '#20272a' : index === 3 ? '#101010' : '#3a2419', metalness: .12, roughness: .62 });
  const caseBody = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, .25, 64), caseMaterial);
  caseBody.rotation.x = Math.PI / 2; group.add(caseBody);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(.92, .09, 14, 64), caseMaterial); bezel.position.z = .16; group.add(bezel);
  const face = new THREE.Mesh(new THREE.CircleGeometry(.84, 64), dialMaterial); face.position.z = .14; group.add(face);
  const strapGeometry = new THREE.BoxGeometry(.48, 1.35, .12);
  [-1,1].forEach((side) => { const strap = new THREE.Mesh(strapGeometry, strapMaterial); strap.position.set(0, side * 1.35, -.02); group.add(strap); });
  const handMaterial = new THREE.MeshStandardMaterial({ color: index === 1 ? '#252321' : '#d39a72', metalness: .55, roughness: .3 });
  for (let i=0;i<12;i++) { const angle = i * Math.PI / 6; const marker = new THREE.Mesh(new THREE.BoxGeometry(.045, .12, .025), handMaterial); marker.position.set(Math.sin(angle)*.69, Math.cos(angle)*.69, .18); marker.rotation.z = -angle; group.add(marker); }
  const hand = (length,width,z,rotation) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(width,length,.025),handMaterial); mesh.position.set(0,length*.34,z); mesh.rotation.z=rotation; group.add(mesh); };
  hand(.65,.055,.2,.4); hand(.42,.075,.22,-.8);
  const pin = new THREE.Mesh(new THREE.SphereGeometry(.075,16,12),caseMaterial); pin.position.z=.24; group.add(pin);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.24,24),caseMaterial); crown.rotation.x=Math.PI/2; crown.position.set(1.08,0,0); group.add(crown);
  group.userData.collection=collection.id;
  return group;
}

export function Hero() {
  const canvasRef=useRef(null); const [active,setActive]=useState(0); const [spinning,setSpinning]=useState(false);
  useEffect(()=>{
    let cancelled=false, frame=0, renderer, scene, camera, carousel, resizeObserver;
    loadThree().then((THREE)=>{
      if(cancelled)return;
      try {
        renderer=new THREE.WebGLRenderer({canvas:canvasRef.current,antialias:true,alpha:true});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7)); renderer.setClearColor(0x000000,0);
        scene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(33,1,.1,80);camera.position.set(0,0,10);
        scene.add(new THREE.AmbientLight(0xcbb8a4,1.35));
        const keyLight=new THREE.DirectionalLight(0xffdfc5,2.4);keyLight.position.set(-4,5,7);scene.add(keyLight);
        const rim=new THREE.PointLight(0xb8754f,24,20);rim.position.set(4,-2,4);scene.add(rim);
        carousel=new THREE.Group();scene.add(carousel);
        COLECCIONES.forEach((collection,index)=>{const mesh=watchMesh(THREE,collection,index);const angle=index*Math.PI*2/COLECCIONES.length;mesh.position.set(Math.sin(angle)*2.65,0,-Math.cos(angle)*.45);mesh.rotation.y=angle*.12;mesh.scale.setScalar(index===0?1.12:.9);carousel.add(mesh);});
        const resize=()=>{const rect=canvasRef.current.getBoundingClientRect();const width=Math.max(1,rect.width),height=Math.max(1,rect.height);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();};
        resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvasRef.current);
        const draw=()=>{if(cancelled)return;carousel.rotation.y += spinning ? .004 : (active * -Math.PI*2/COLECCIONES.length-carousel.rotation.y)*.045;renderer.render(scene,camera);frame=requestAnimationFrame(draw);};
        draw();document.documentElement.classList.remove('no-webgl');
      } catch { document.documentElement.classList.add('no-webgl'); }
    }).catch(()=>{document.documentElement.classList.add('no-webgl');});
    return ()=>{cancelled=true;cancelAnimationFrame(frame);resizeObserver?.disconnect();if(renderer){renderer.dispose();} };
  },[active,spinning]);
  const choose=(index)=>setActive((index+COLECCIONES.length)%COLECCIONES.length);
  const collection=COLECCIONES[active], product=buscarProducto(collection.principal);
  const subtitle=collection.sub.split(/<br\s*\/?\s*>/i);
  return <section className="hero" id="inicio" aria-label="Colecciones OKIDOKEI"><canvas id="hero3d" ref={canvasRef} aria-hidden="true" /><svg className="hero-fallback" aria-hidden="true"><use href="#emblem" /></svg><div className="hero-ui"><div className="tabs" role="tablist" aria-label="Colecciones">{COLECCIONES.map((item,index)=><button className="hero-tab" type="button" role="tab" key={item.id} aria-selected={active===index} tabIndex={active===index?0:-1} onClick={()=>choose(index)} onKeyDown={(event)=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=(index+(event.key==='ArrowRight'?1:-1)+COLECCIONES.length)%COLECCIONES.length;choose(next);event.currentTarget.parentElement.children[next].focus();}}}>{item.nombre}</button>)}</div><div className="hero-copy"><h1 className="hero-title" id="heroTitle" aria-label={collection.titulo}>{collection.titulo}</h1><p className="hero-sub" id="heroSub">{subtitle.map((part,index)=><span key={index}>{index>0&&<br/>}{part}</span>)}</p><span className="hero-dash" aria-hidden="true"/><a className="btn btn-outline" id="heroExplore" href={`colecciones.html#${collection.id}`}>Explorar colección</a></div></div><div className="hero-foot"><div className="counter"><strong id="heroCount">{String(active+1).padStart(2,'0')}</strong><span className="progress" aria-hidden="true"><i id="heroProgress" style={{width:`${((active+1)/COLECCIONES.length)*100}%`}}/></span><span>06</span></div><div className="drag-hint"><svg className="icon" aria-hidden="true"><use href="#i-drag"/></svg>Arrastra para girar</div><div className="hero-actions"><a className="hero-model" id="heroModel" href={`producto.html#${product.id}`}><span className="spec" id="heroSpec">{resumenProducto(product)}</span><span className="price" id="heroPrice">{precioTexto(product.precio)}</span></a><button className="round-btn" id="spinBtn" type="button" aria-pressed={spinning} aria-label="Girar el reloj 360 grados" onClick={()=>setSpinning((value)=>!value)}><svg className="icon" aria-hidden="true"><use href="#i-rotate"/></svg></button><button className="round-btn" id="prevBtn" type="button" aria-label="Reloj anterior" onClick={()=>choose(active-1)}><svg className="icon" aria-hidden="true"><use href="#i-left"/></svg></button><button className="round-btn" id="nextBtn" type="button" aria-label="Reloj siguiente" onClick={()=>choose(active+1)}><svg className="icon" aria-hidden="true"><use href="#i-right"/></svg></button></div></div></section>;
}

export function GearCanvas() {
  const ref=useRef(null);
  useEffect(()=>{const canvas=ref.current,context=canvas.getContext('2d');let raf=0,visible=true,start=performance.now();let width=0,height=0,dpr=1;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let observer;
    const resize=()=>{const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;context.setTransform(dpr,0,0,dpr,0,0);};
    const gear=(x,y,radius,teeth,angle)=>{context.save();context.translate(x,y);context.rotate(angle);context.fillStyle='#a97450';context.strokeStyle='#d5ad8f';context.lineWidth=2;context.beginPath();for(let i=0;i<teeth*4;i++){const a=i*Math.PI/(teeth*2),r=radius*(i%4<2?1:.86);const px=Math.cos(a)*r,py=Math.sin(a)*r;i?context.lineTo(px,py):context.moveTo(px,py);}context.closePath();context.fill();context.stroke();context.fillStyle='#24201d';context.beginPath();context.arc(0,0,radius*.68,0,Math.PI*2);context.fill();context.strokeStyle='#c48d68';context.lineWidth=3;context.beginPath();context.arc(0,0,radius*.18,0,Math.PI*2);context.stroke();context.restore();};
    const draw=(now)=>{if(!visible)return;context.clearRect(0,0,width,height);const time=reduced?0:(now-start)/1200;gear(width*.36,height*.52,Math.min(width,height)*.23,14,time);gear(width*.67,height*.52,Math.min(width,height)*.15,10,-time*1.4);gear(width*.53,height*.26,Math.min(width,height)*.1,8,time*1.75);raf=requestAnimationFrame(draw);};
    resize();observer=new ResizeObserver(resize);observer.observe(canvas);const intersection=new IntersectionObserver((entries)=>{visible=entries[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(draw);else if(!visible){cancelAnimationFrame(raf);raf=0;}});intersection.observe(canvas);raf=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(raf);observer.disconnect();intersection.disconnect();};
  },[]);
  return <canvas ref={ref} data-engranajes role="img" aria-label="Animación de los engranajes de un movimiento mecánico"/>;
}
