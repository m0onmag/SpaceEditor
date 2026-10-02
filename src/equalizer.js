(()=>{
const M=56;
const FMIN=45,FMAX=16000;
const ALPHA=.62;

let cv,g,W=0,H=0,dpr=1;
let active=false,raf=0,sid=0,starting=false;
let ac=null,an=null,stream=null,buf=null,rng=[];
let eS=0,silent=true,lf=0,grKey='',gr=null,shCol='';
const lvl=new Float32Array(M);

function build(){
  cv=document.createElement('canvas');cv.id='bgeq';
  g=cv.getContext('2d');
}

function fit(){
  const r=cv.getBoundingClientRect();
  dpr=Math.min(devicePixelRatio||1,2);
  W=r.width;H=r.height;grKey='';
  cv.width=Math.max(2,Math.round(W*dpr));cv.height=Math.max(2,Math.round(H*dpr));
  g.setTransform(dpr,0,0,dpr,0,0);
}

async function getStream(){
  try{
    const id=window.api&&api.eqSource?await api.eqSource():null;
    if(id){
      const s=await navigator.mediaDevices.getUserMedia({
        audio:{mandatory:{chromeMediaSource:'desktop'}},
        video:{mandatory:{chromeMediaSource:'desktop',chromeMediaSourceId:id}}
      });
      s.getVideoTracks().forEach(t=>{t.stop();s.removeTrack(t)});
      if(s.getAudioTracks().length)return s;
      s.getTracks().forEach(t=>t.stop());
    }
  }catch{}
  try{
    const s=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
    s.getVideoTracks().forEach(t=>{t.stop();s.removeTrack(t)});
    if(s.getAudioTracks().length)return s;
    s.getTracks().forEach(t=>t.stop());
  }catch{}
  return null;
}

function attach(s){
    try{ac&&ac.close()}catch{}
    stream=s;
    ac=new AudioContext();
    an=ac.createAnalyser();
    an.fftSize=4096;an.smoothingTimeConstant=.5;an.minDecibels=-85;an.maxDecibels=-18;
    ac.createMediaStreamSource(stream).connect(an);
    ac.resume().catch(()=>{});
    buf=new Uint8Array(an.frequencyBinCount);
    const bh=ac.sampleRate/an.fftSize,fmax=Math.min(FMAX,ac.sampleRate/2-100);
    rng=[];
    for(let k=0;k<M;k++){
      const lo=FMIN*Math.pow(fmax/FMIN,k/M),hi=FMIN*Math.pow(fmax/FMIN,(k+1)/M);
      const a=Math.max(1,Math.floor(lo/bh));
      rng.push([a,Math.min(buf.length,Math.max(a+1,Math.ceil(hi/bh)))]);
    }
}

async function startAudio(my){
  starting=true;
  try{
    const s=await getStream();
    if(!active||my!==sid){s&&s.getTracks().forEach(t=>t.stop());return}
    if(!s)return;
    attach(s);
  }finally{starting=false}
}

async function revive(){
  if(!active||starting||!an)return;
  starting=true;const my=++sid;
  try{
    const s=await getStream();
    if(!active||my!==sid){s&&s.getTracks().forEach(t=>t.stop());return}
    const old=stream;
    if(s){attach(s);try{old&&old.getTracks().forEach(t=>t.stop())}catch{}}
    else if(old&&old.getAudioTracks().some(t=>t.readyState==='live'))attach(old);
  }finally{starting=false}
}

function stopAudio(){
  try{stream&&stream.getTracks().forEach(t=>t.stop())}catch{}
  try{ac&&ac.close()}catch{}
  stream=ac=an=buf=null;rng=[];
  lvl.fill(0);eS=0;silent=true;
}

function frame(now){
  raf=requestAnimationFrame(frame);
  if(silent&&now-lf<33)return;
  lf=now;
  const t=now/1000;
  let sum=0;
  if(an)an.getByteFrequencyData(buf);
  for(let k=0;k<M;k++){
    let v=0;
    if(an){
      const a=rng[k][0],b=rng[k][1];let s=0,mx=0;
      for(let j=a;j<b;j++){const x=buf[j];s+=x;if(x>mx)mx=x}
      const raw=(s/(b-a))*.45+mx*.55;
      v=Math.pow(Math.max(0,(raw*(1+k/M*.55)-62)/193),1.2);
      if(v>1)v=1;
    }
    sum+=v;
    lvl[k]+=(v-lvl[k])*(v>lvl[k]?.6:.13);
  }
  eS+=(sum/M-eS)*.06;
  silent=eS<.012;

  const rgb=document.documentElement.dataset.theme==='light'?'0,0,0':'255,255,255';
  g.clearRect(0,0,W,H);
  const sw=W/(2*M),bw=Math.max(2,sw*.58),cx=W/2;
  const gk=rgb+'|'+H;
  if(gk!==grKey){
    grKey=gk;
    gr=g.createLinearGradient(0,0,0,H);
    gr.addColorStop(0,`rgba(${rgb},${.08*ALPHA})`);gr.addColorStop(.55,`rgba(${rgb},${.6*ALPHA})`);gr.addColorStop(1,`rgba(${rgb},${ALPHA})`);
    shCol=`rgba(${rgb},${.5*ALPHA})`;
  }
  g.fillStyle=gr;
  g.shadowColor=shCol;g.shadowBlur=(6+eS*36)*dpr;
  g.beginPath();
  for(let k=0;k<M;k++){
    let v=lvl[k];
    if(silent)v=Math.max(v,.035+.02*Math.sin(t*2.2+k*.5));
    const h=Math.max(bw,v*H*.94),y=H-h;
    g.roundRect(cx+k*sw+(sw-bw)/2,y,bw,h,bw/2);
    g.roundRect(cx-(k+1)*sw+(sw-bw)/2,y,bw,h,bw/2);
  }
  g.fill();
}

const startLoop=()=>{if(!raf&&active&&!document.hidden)raf=requestAnimationFrame(frame)};
const stopLoop=()=>{cancelAnimationFrame(raf);raf=0};

function setActive(on){
  if(on===active)return;
  active=on;
  if(on){
    if(!cv)build();
    if(!cv.isConnected)document.getElementById('bg').appendChild(cv);
    fit();
    void cv.offsetWidth;cv.classList.add('on');
    startLoop();
    if(!an&&!starting)startAudio(++sid);
  }else{
    cv.classList.remove('on');
    setTimeout(()=>{
      if(active)return;
      stopLoop();stopAudio();cv.remove();
    },700);
  }
}

addEventListener('resize',()=>{if(active)fit()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopLoop();else{startLoop();revive()}});

const origMode=window.bgMode;
window.bgMode=m=>{origMode&&origMode(m);setActive(m==='off')};
})();
