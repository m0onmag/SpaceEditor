(()=>{
const NS='http://www.w3.org/2000/svg';
const I={
waveform:'<path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/>',
download:'<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14"/>',
bolt:'<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
'folder-open':'<path d="M4 20h13.2a2 2 0 0 0 1.9-1.4L21 11H7.6a2 2 0 0 0-1.9 1.4zM4 20V6a2 2 0 0 1 2-2h3.5l2 2H17a2 2 0 0 1 2 2v3"/>',
'device-floppy':'<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7.5 3v5h7V3M7 21v-6.5h10V21"/>',
minus:'<path d="M5 12h14"/>',
square:'<rect x="5.5" y="5.5" width="13" height="13" rx="3.5"/>',
x:'<path d="m6 6 12 12M18 6 6 18"/>',
search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
package:'<path d="M12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4M12 11v10"/>',
list:'<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
volume:'<path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4zM15.5 9a4 4 0 0 1 0 6M18.2 6.3a8 8 0 0 1 0 11.4"/>',
pencil:'<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19zM14.5 6.5l3 3"/>',
dice:'<rect x="4" y="4" width="16" height="16" rx="4.5"/><path stroke-width="2.6" d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01"/>',
pin:'<path d="M9 4h6l-1 5 3 3v2H7v-2l3-3zM12 14v7"/>',
check:'<path d="m5 12.5 4.5 4.5L19 7"/>',
'map-pin':'<path d="M12 21s7-5.8 7-11a7 7 0 0 0-14 0c0 5.2 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
microphone:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
sliders:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
note:'<path d="M13 20l7-7"/><path d="M13 20v-6a1 1 0 0 1 1-1h6V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7"/>',
'brand-telegram':'<path d="M15 10l-4 4 6 6 4-16-18 7 4 2 2 6 3-4"/>',
'brand-github':'<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
bug:'<path d="m8 2 1.9 1.9M14.1 3.9 16 2M9 7.1v-1a3 3 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/><path d="M12 20v-9M6.5 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M21 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
message:'<path d="M8 9h8M8 13h6"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/>',
'alert-triangle':'<path d="M10.4 4.2 2.6 17.7a1.9 1.9 0 0 0 1.6 2.8h15.6a1.9 1.9 0 0 0 1.6-2.8L13.6 4.2a1.9 1.9 0 0 0-3.2 0zM12 9.5v4M12 17h.01"/>',
pointer:'<path d="M7.9 17.6a1.2 1.2 0 0 0 2.2.3l2.1-3.1 4.9 4.9a1.1 1.1 0 0 0 1.5 0l1-1a1.1 1.1 0 0 0 0-1.5l-4.9-4.9 3.1-2.1a1.2 1.2 0 0 0-.3-2.2L6 4.2z"/>',
terminal:'<rect x="3" y="4.5" width="18" height="15" rx="4"/><path d="m7.5 9.5 3 2.5-3 2.5M13 15h3.5"/>',
file:'<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8zM14 3v5h5"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
contrast:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
sun:'<circle cx="12" cy="12" r="3.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
wave:'<path d="M3 12c1.5-4 3-4 4.5 0s3 4 4.5 0 3-4 4.5 0 3 4 4.5 0"/>',
pause:'<rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/>',
'shield-check':'<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2.2 2.2L15 10.5"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
user:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
folder:'<path d="M3 7.5a2 2 0 0 1 2-2h3.8l2 2H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
bell:'<path d="M6 17v-6a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4"/>',
refresh:'<path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v4.5h-4.5"/>',
moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
settings:'<path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>',
monitor:'<rect x="3" y="4" width="18" height="12.5" rx="3.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',
zoom:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.9-4.9M10.5 8v5M8 10.5h5"/>',
'window-top':'<rect x="3" y="4" width="18" height="16" rx="3.5"/><path d="M3 9h18M12 17v-5M9.5 14.2 12 11.7l2.5 2.5"/>',
photo:'<rect x="3" y="4" width="18" height="16" rx="4"/><path d="m3 16 5-5 4 4 3-3 6 5"/><circle cx="16.5" cy="8.8" r="1.3"/>',
play:'<path d="M8 5.6v12.8a1 1 0 0 0 1.5.9l10.3-6.4a1 1 0 0 0 0-1.7L9.5 4.7A1 1 0 0 0 8 5.6z"/>',
ban:'<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
diamond:'<path d="M6.5 4h11L22 9.5 12 21 2 9.5z"/><path d="M2 9.5h20M9 4 7 9.5 12 21l5-11.5L15 4"/>',
'skip-back':'<path d="M5.5 5v14"/><path d="M19 6.5v11a1 1 0 0 1-1.6.8l-7.2-5.5a1 1 0 0 1 0-1.6l7.2-5.5A1 1 0 0 1 19 6.5z"/>',
power:'<path d="M12 3.5v8M7 6.6a7.5 7.5 0 1 0 10 0"/>',
lifebuoy:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
copy:'<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'};

function swap(root){
  const list=root.matches?.('i.ti')?[root]:[...(root.querySelectorAll?.('i.ti')||[])];
  for(const el of list){
    const n=[...el.classList].find(c=>c.startsWith('ti-'));if(!n||!I[n.slice(3)])continue;
    const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
    s.setAttribute('class',['ic',...[...el.classList].filter(c=>c!=='ti'&&!c.startsWith('ti-'))].join(' '));
    if(el.getAttribute('style'))s.setAttribute('style',el.getAttribute('style'));
    s.innerHTML=I[n.slice(3)];el.replaceWith(s);
  }
}

const bg=document.createElement('div');bg.id='bg';
bg.innerHTML='<canvas id="gl"></canvas>';
document.body.prepend(bg);
const dim=document.createElement('div');dim.id='dim';document.body.appendChild(dim);

const defs=document.createElementNS(NS,'svg');defs.setAttribute('style','position:absolute;width:0;height:0');document.body.appendChild(defs);
let uid=0;
const CFG=[['.logo-pill',2],['.btn-ghost',2],['.win-btn',2],['.edit-btn',2],['.step-badge',2],['.empty-icon-wrap',3],['#statusbar',7],['#sidebar',14],['.glass-card',12],['.upd-toast',10],['.modal',16,1]];

const DM=new Map();
function dispMap(w,h,r,b){
  const key=w+'x'+h+'x'+r+'x'+b;
  const hit=DM.get(key);if(hit){DM.delete(key);DM.set(key,hit);return hit}
  const k=Math.min(1,560/Math.max(w,h)),W=Math.max(2,Math.round(w*k)),H=Math.max(2,Math.round(h*k)),R=r*k,B=b*k;
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d'),im=x.createImageData(W,H),d=im.data;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){
    const px=i+.5-W/2,py=j+.5-H/2,qx=Math.abs(px)-(W/2-R),qy=Math.abs(py)-(H/2-R);
    const ox=Math.max(qx,0),oy=Math.max(qy,0),len=Math.hypot(ox,oy);
    const dist=-(len+Math.min(Math.max(qx,qy),0)-R);
    let nx,ny;
    if(len>0){nx=ox/len*Math.sign(px);ny=oy/len*Math.sign(py)}else if(qx>qy){nx=Math.sign(px);ny=0}else{nx=0;ny=Math.sign(py)}
    let m=0;if(dist<B){m=Math.pow(1-Math.max(dist,0)/B,1.8)}
    const o=(j*W+i)*4;d[o]=128-nx*m*127;d[o+1]=128-ny*m*127;d[o+2]=128;d[o+3]=255;
  }
  x.putImageData(im,0,0);
  const url=c.toDataURL();
  c.width=c.height=0;
  DM.set(key,url);
  if(DM.size>24)DM.delete(DM.keys().next().value);
  return url;
}
const ch=(a)=>`<feColorMatrix in="${a[0]}" values="${a[1]}" result="${a[2]}"/>`;
function build(el,force){
  if(el._plain)return;
  const w=el.offsetWidth,h=el.offsetHeight;if(w<4||h<4)return;
  if(!force&&el._id&&el._w===w&&el._h===h)return;
  el._w=w;el._h=h;
  const r=Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius)||0,w/2,h/2);
  const b=Math.max(6,Math.min(30,Math.min(w,h)/2)),S=Math.min(56,b*1.7)*(window.LGK??1),id=el._id||(el._id='lg'+ ++uid);
  document.getElementById(id)?.remove();
  const disp=(s,res)=>`<feDisplacementMap in="b" in2="m" scale="${s}" xChannelSelector="R" yChannelSelector="G" result="${res}"/>`;
  defs.insertAdjacentHTML('beforeend',
   `<filter id="${id}" x="0" y="0" width="${w}" height="${h}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceGraphic" stdDeviation="${el._b}" result="b"/>
    <feImage href="${dispMap(w,h,r,b)}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="m"/>
    ${disp(S,'d1')}${ch(['d1','1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0','r'])}
    ${disp(S*.92,'d2')}${ch(['d2','0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0','g'])}
    ${disp(S*.84,'d3')}${ch(['d3','0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0','bl'])}
    <feBlend in="r" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="bl" mode="screen" result="o"/>
    <feColorMatrix in="o" type="saturate" values="1.7"/></filter>`);
  el.style.setProperty('--lgf',`url(#${id})`);
}
const pend=new Set();
let rbT=0;
function flush(){
  const l=[...pend];pend.clear();
  for(const el of l)if(el.isConnected)build(el);
}
const ro=new ResizeObserver(es=>{
  for(const e of es){
    const el=e.target;
    if(!el._id)build(el);else pend.add(el);
  }
  if(pend.size){clearTimeout(rbT);rbT=setTimeout(flush,110)}
});
window.lgRebuild=()=>document.querySelectorAll('.lg').forEach(el=>build(el,true));
function adopt(root){
  if(root.nodeType!==1)return;
  for(const [sel,bl,pl] of CFG){
    const els=[...(root.matches(sel)?[root]:[]),...root.querySelectorAll(sel)];
    for(const el of els){if(el._lg)continue;el._lg=1;el._b=bl;el._plain=pl||!!el.closest('.modal');el.classList.add('lg');ro.observe(el)}
  }
}
function drop(root){
  if(root.nodeType!==1)return;
  for(const el of [root,...root.querySelectorAll('.lg')]){
    if(!el._lg)continue;
    ro.unobserve(el);pend.delete(el);el._lg=0;
    if(el._id)document.getElementById(el._id)?.remove();
    el._id=null;
  }
}

let pmE=null,pmR=0;
document.addEventListener('pointermove',e=>{
  pmE=e;
  if(pmR)return;
  pmR=requestAnimationFrame(()=>{
    pmR=0;
    const ev=pmE;if(!ev)return;
    const el=ev.target.closest?.('.lg');if(!el)return;
    const r=el.getBoundingClientRect(),x=ev.clientX-r.left;
    el.style.setProperty('--mx',x+'px');
    el.style.setProperty('--my',ev.clientY-r.top+'px');
    el.style.setProperty('--ang',(215+(x/r.width-.5)*80)+'deg');
  });
},{passive:true});
document.addEventListener('pointerup',e=>{
  const el=e.target.closest?.('.btn,.win-btn,.edit-btn,.mode-btn,.empty-icon-wrap');if(!el||el.disabled||document.body.classList.contains('calm'))return;
  el.animate([{transform:'scale(.93)'},{transform:'scale(1.08,1.04)',offset:.4},{transform:'scale(.98)',offset:.7},{transform:'scale(1)'}],{duration:580,easing:'cubic-bezier(.2,.8,.2,1)'});
});

new MutationObserver(ms=>{
  for(const m of ms){
    m.removedNodes.forEach(drop);
    m.addedNodes.forEach(n=>{
      if(n.nodeType!==1)return;
      if(n.closest('#side-list'))return;
      swap(n);adopt(n);
      if(n.matches('.seq-step'))n.style.animationDelay=Math.min([...n.parentNode.children].indexOf(n)*35,420)+'ms';
      if(n.matches('.overlay'))document.body.classList.add('mo');
    });
    if(m.removedNodes.length&&!document.querySelector('.overlay'))document.body.classList.remove('mo');
  }
}).observe(document.body,{childList:true,subtree:true});

swap(document.body);adopt(document.body);
})();
