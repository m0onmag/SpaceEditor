(()=>{
const cv=document.getElementById('gl');if(!cv)return;
cv.style.imageRendering='auto';
const VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FS=`#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 R;uniform float T;uniform vec2 M;uniform float L;uniform float O;uniform float Z;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;mat2 r=mat2(.8,-.6,.6,.8);for(int i=0;i<6;i++){if(float(i)>=O)break;s+=a*n(p);p=r*p*2.02+7.;a*=.5;}return s;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y,m=(M-.5*R)/R.y;
  float t=T*.045;
  vec2 p=uv*1.7,d=uv-m;
  float md=exp(-dot(d,d)*7.);
  p+=d*md*.4;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
  vec2 r=q;
  if(Z>.5)r=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*1.4),fbm(p+3.*q+vec2(8.3,2.8)-t*1.1));
  float f=fbm(p+3.*r);
  float g=f*13.;
  float k=abs(fract(g)-.5);
  #ifdef GL_OES_standard_derivatives
  float w=fwidth(g)*.6;
  #else
  float w=0.;
  #endif
  w=max(w,.035);
  float line=smoothstep(.465-w,.465+w,k);
  float silk=pow(smoothstep(.15,.95,f),2.4);
  float ridge=smoothstep(.55,.95,r.x)*.35;
  float c=silk*.3+ridge*.18+line*(.1+.22*q.y)+md*.09;
  c*=1.-.55*dot(uv,uv);
  c+=(h(gl_FragCoord.xy+fract(T))-.5)*.03;
  vec3 col=vec3(max(c,0.));
  col=mix(col,vec3(.955)-col*1.05,L);
  gl_FragColor=vec4(col,1.);
}`;

let gl=null,pr=null,uR,uT,uM,uL,uO,uZ,lost=false;

function init(){
  gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'high-performance'});
  if(!gl)return false;
  gl.getExtension('OES_standard_derivatives');
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
  pr=gl.createProgram();
  gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));
  gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return false;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  uR=gl.getUniformLocation(pr,'R');uT=gl.getUniformLocation(pr,'T');uM=gl.getUniformLocation(pr,'M');
  uL=gl.getUniformLocation(pr,'L');uO=gl.getUniformLocation(pr,'O');uZ=gl.getUniformLocation(pr,'Z');
  return true;
}
if(!init())return;

const DPR=Math.min(window.devicePixelRatio||1,2);
const MAXPX=3.4e6;
let QA=1;
let SC=1,mode='live',raf=0,last=0,light=0,W=0,H=0,mx=0,my=0,tx=0,ty=0,tt=0,ready=false,focused=true;
let accT=0,accN=0;
const isPaused=()=>document.hidden||!focused||lost;
function scale(){
  const cap=Math.sqrt(MAXPX/Math.max(1,innerWidth*innerHeight));
  return Math.max(.4,Math.min(DPR*(mode==='lite'?.75:1),cap)*QA);
}
function size(){
  const oW=W||1,oH=H||1;
  SC=scale();
  W=cv.width=Math.max(2,Math.round(innerWidth*SC));
  H=cv.height=Math.max(2,Math.round(innerHeight*SC));
  if(!lost)gl.viewport(0,0,W,H);
  if(!mx){mx=tx=W*.6;my=ty=H*.5}
  else{const a=W/oW,b=H/oH;mx*=a;tx*=a;my*=b;ty*=b}
  if(ready&&!raf&&mode!=='off')render();
}
function render(){
  if(lost)return;
  gl.uniform2f(uR,W,H);gl.uniform1f(uT,tt);gl.uniform2f(uM,mx,my);gl.uniform1f(uL,light);
  gl.uniform1f(uO,mode==='lite'?4:6);gl.uniform1f(uZ,mode==='lite'?0:1);
  gl.drawArrays(gl.TRIANGLES,0,3);
}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{tx=e.clientX*SC;ty=H-e.clientY*SC},{passive:true});
function frame(now){
  raf=requestAnimationFrame(frame);
  const dt=now-last;last=now;
  if(dt>0&&dt<200){
    accT+=dt;accN++;
    if(accN>=45){
      if(accT/accN>22&&QA>.55){QA=Math.max(.55,QA*.87);size()}
      accT=accN=0;
    }
  }else{accT=accN=0}
  tt+=Math.max(0,Math.min(dt,100))/1000;
  mx+=(tx-mx)*.06;my+=(ty-my)*.06;
  render();
}
function run(){
  if(raf||mode==='off'||isPaused())return;
  last=performance.now();accT=accN=0;
  raf=requestAnimationFrame(frame);
}
function stop(){cancelAnimationFrame(raf);raf=0}

function sync(){isPaused()?stop():run()}
addEventListener('blur',()=>{focused=false;sync()});
addEventListener('focus',()=>{focused=true;sync()});
document.addEventListener('visibilitychange',sync);

cv.addEventListener('webglcontextlost',e=>{
  e.preventDefault();
  lost=true;
  stop();
});
cv.addEventListener('webglcontextrestored',()=>{
  if(!init())return;
  lost=false;
  gl.viewport(0,0,W,H);
  if(mode==='off')return;
  isPaused()?render():run();
});

window.bgTheme=l=>{light=l?1:0;if(ready&&!raf&&mode!=='off')render()};
window.bgMode=m=>{
  if(m===mode&&(m==='off'?cv.style.display==='none':(raf||isPaused())))return;
  mode=m;stop();
  if(m==='off'){cv.style.display='none';return}
  cv.style.display='';
  QA=1;accT=accN=0;size();
  isPaused()?render():run();
};
ready=true;
isPaused()?render():run();
})();
