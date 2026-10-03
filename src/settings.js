(()=>{
const D={lang:'ru',theme:'dark',bg:'live',lens:true,k:1,bri:1,calm:false,rand:'r',first:true,warn:true,warnClose:true,confirmAll:true,zoom:1,top:false,autoUpdate:true};
let S={...D};
try{S={...D,...((window.api&&api.loadSettings&&api.loadSettings())||{})}}catch{}
window.VS=S;
const save=()=>{try{window.api&&api.saveSettings&&api.saveSettings(S)}catch{}};

function detectPerf(){
  try{
    let gpu='';
    const g=document.createElement('canvas').getContext('webgl');
    if(g){
      const e=g.getExtension('WEBGL_debug_renderer_info');
      gpu=String(e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER));
      g.getExtension('WEBGL_lose_context')?.loseContext();
    }
    const cores=navigator.hardwareConcurrency||4,mem=navigator.deviceMemory||8;
    if(!gpu||/swiftshader|llvmpipe|software|basic render/i.test(gpu))return{bg:'off',lens:false,calm:true};
    const oldIntel=/intel/i.test(gpu)&&/(HD Graphics|UHD Graphics|GMA)/i.test(gpu)&&!/iris|arc/i.test(gpu);
    if(oldIntel||cores<=2||mem<=2)return{bg:'lite',lens:false,calm:true};
    if(cores<=4||mem<=4)return{bg:'lite',lens:false};
    return null;
  }catch{return null}
}
const PERF=detectPerf();
let perfFirst=null;
if(S.perfDone!==true){
  if(PERF){Object.assign(S,PERF);perfFirst=PERF}
  S.perfDone=true;save();
}

function notice(o){
  return new Promise(res=>{
    const ov=document.createElement('div');ov.className='overlay';
    ov.innerHTML=`<div class="modal" style="width:430px"><div class="modal-hdr"><i class="ti ti-alert-triangle" aria-hidden="true"></i><span class="modal-title"></span></div><div class="modal-body"><div class="desc-text"></div></div><div class="modal-ftr"><button class="btn btn-ghost" id="pn-c"></button><button class="btn btn-primary" id="pn-ok"></button></div></div>`;
    ov.querySelector('.modal-title').textContent=o.title;
    ov.querySelector('.desc-text').textContent=o.text;
    ov.querySelector('#pn-ok').textContent=o.ok;
    if(o.cancel)ov.querySelector('#pn-c').textContent=o.cancel;else ov.querySelector('#pn-c').remove();
    document.body.appendChild(ov);
    const done=v=>{removeEventListener('keydown',esc,true);ov.remove();res(v)};
    const esc=e=>{if(e.key==='Escape'){e.stopPropagation();done(!o.cancel)}};
    addEventListener('keydown',esc,true);
    ov.querySelector('#pn-ok').onclick=()=>done(true);
    const c=ov.querySelector('#pn-c');if(c)c.onclick=()=>done(false);
    ov.onclick=e=>{if(e.target===ov)done(!o.cancel)};
  });
}
let tm,wz=1,wt=false,curLang=S.lang;
const mq=matchMedia('(prefers-color-scheme: light)');
const isLight=()=>S.theme==='light'||(S.theme==='auto'&&mq.matches);

function applyTheme(){
  const l=isLight();
  document.documentElement.dataset.theme=l?'light':'dark';
  window.bgTheme&&window.bgTheme(l);
}
mq.addEventListener('change',()=>{if(S.theme==='auto')applyTheme()});

function apply(rebuild){
  const b=document.body.classList;
  b.toggle('nolens',!S.lens);b.toggle('calm',S.calm);b.toggle('bgf',S.bri!==1);
  document.documentElement.style.setProperty('--bri',S.bri);
  applyTheme();
  window.LGK=S.k;
  window.bgMode&&window.bgMode(S.bg);
  if(S.lang!==curLang){curLang=S.lang;window.setLang&&window.setLang(S.lang)}
  if(S.zoom!==wz){wz=S.zoom;window.api&&api.setZoom&&api.setZoom(S.zoom)}
  if(S.top!==wt){wt=S.top;window.api&&api.setOnTop&&api.setOnTop(S.top)}
  if(rebuild){clearTimeout(tm);tm=setTimeout(()=>window.lgRebuild&&window.lgRebuild(),80)}
}
apply(S.k!==1);
if(perfFirst){
  const list=[t(perfFirst.bg==='off'?'perf_bg_off':'perf_bg_lite'),perfFirst.lens===false?t('perf_lens'):'',perfFirst.calm?t('perf_calm'):''].filter(Boolean).join(', ');
  setTimeout(()=>notice({title:t('perfT'),text:t('perfText',{list}),ok:t('perfOk')}),700);
}

const fv=v=>String(v||'').replace(/^(\d+\.\d+)\.0$/,'$1');
let VER='1.0',updState=null,progCb=null;
try{VER=fv(api.getVersion())||VER}catch{}
document.title='SpaceEditor | v'+VER;
try{api.onUpdateProgress(p=>progCb&&progCb(p))}catch{}
const TABS=[['gen','s_gen','sliders'],['gfx','s_gfx','monitor'],['edit','s_edit','pencil'],['about','s_about','info']];
const X=(k,tag='span')=>`<${tag} data-tx="${k}">${t(k)}</${tag}>`;
const IC={lang:'globe',theme:'contrast',zoom:'zoom',top:'window-top',bg:'photo',bri:'sun',lens:'diamond',k:'wave',calm:'pause',rand:'microphone',first:'skip-back',confirmAll:'shield-check',warn:'download',warnClose:'power',autoUpdate:'refresh'};
const ii=n=>`<i class="ti ti-${n}" aria-hidden="true"></i>`;
const ico=k=>`<div class="set-ico"><i class="ti ti-${IC[k]}" aria-hidden="true"></i></div>`;
const sw=k=>`<button class="sw" data-k="${k}" role="switch"></button>`;
const expHTML=()=>`${ii('download')} ${X('s_exp')}`;
const impHTML=()=>`${ii('folder-open')} ${X('s_imp')}`;
const updHTML=()=>`${ii('refresh')} ${X('s_upBtn')}`;
const rc=(k,lo,hi,st)=>`<div class="rc"><span class="rv" data-v="${k}"></span><input type="range" data-k="${k}" min="${lo}" max="${hi}" step="${st}"></div>`;
const row=(k,ctl)=>`<div class="set-row" data-r="${k}">${ico(k)}<div>${X('s_'+k,'b')}${X('s_'+k+'_d','small')}</div>${ctl}</div>`;
const FL={
  ru:'<svg class="flag" viewBox="0 0 24 16" width="20" height="14" aria-hidden="true" style="border-radius:3px;box-shadow:0 0 0 1px rgba(128,128,128,.4);flex-shrink:0"><rect width="24" height="5.4" fill="#fff"/><rect y="5.3" width="24" height="5.4" fill="#0039a6"/><rect y="10.6" width="24" height="5.4" fill="#d52b1e"/></svg>',
  en:'<svg class="flag" viewBox="0 0 60 30" preserveAspectRatio="none" width="20" height="14" aria-hidden="true" style="border-radius:3px;box-shadow:0 0 0 1px rgba(128,128,128,.4);flex-shrink:0"><rect width="60" height="30" fill="#012169"/><path d="M0 0L60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0L60 30M60 0L0 30" stroke="#c8102e" stroke-width="2"/><path d="M30 0V30M0 15H60" stroke="#fff" stroke-width="10"/><path d="M30 0V30M0 15H60" stroke="#c8102e" stroke-width="6"/></svg>'
};
const grp=(k,opts)=>`<div class="set-grp"><div class="set-row">${ico(k)}<div>${X('s_'+k,'b')}${X('s_'+k+'_d','small')}</div></div><div class="mode-row segn" data-k="${k}" style="--n:${opts.length}">${opts.map(([v,l,ic])=>ic?`<button class="mode-btn" data-v="${v}">${ic}<span data-tx="${l}">${t(l)}</span></button>`:`<button class="mode-btn" data-v="${v}" data-tx="${l}">${t(l)}</button>`).join('')}</div></div>`;

const PANES={
gen:()=>
  grp('lang',[['ru','lang_ru',FL.ru],['en','lang_en',FL.en]])+
  grp('theme',[['dark','th_dark',ii('moon')],['light','th_light',ii('sun')],['auto','th_auto',ii('contrast')]])+
  row('zoom',rc('zoom',.8,1.4,.05))+
  row('top',sw('top'))+
  row('autoUpdate',sw('autoUpdate')),
gfx:()=>
  grp('bg',[['live','bgLive',ii('play')],['lite','bgLite',ii('bolt')],['off','bgOff',ii('ban')]])+
  row('bri',rc('bri',.3,1.5,.05))+
  row('lens',sw('lens'))+
  row('k',rc('k',.4,1.6,.1))+
  row('calm',sw('calm')),
edit:()=>
  grp('rand',[['r','random',ii('dice')],['f','fixed',ii('pin')]])+
  row('first',sw('first'))+
  row('confirmAll',sw('confirmAll'))+
  row('warn',sw('warn'))+
  row('warnClose',sw('warnClose')),
about:()=>{
  return `<div class="about-hero"><div class="about-logo"></div><div class="about-info"><div class="about-top"><span class="about-name">SpaceEditor</span><span class="about-ver">v${VER}</span></div>
   ${X('s_desc','div').replace('<div','<div class="desc-text about-desc"')}</div></div>
   <div class="about-list"><div class="about-row set-row upd-row"><div class="set-ico"><i class="ti ti-refresh" aria-hidden="true"></i></div><div>${X('s_upd','b')}<small id="upd-st">${updState?t(updState.k,updState.p):t('s_upVer',{v:VER})}</small></div><button class="btn btn-ghost" id="s-upd">${updHTML()}</button></div>
   <div class="about-row uq" id="lg-w"><div class="uq-hdr"><span class="uq-t">${ii('list')}${X('s_log')}</span><span class="uq-meta"><span id="lg-v"></span><i class="uq-chev"></i></span></div><blockquote class="uq-q log-body" id="lg-b">${t('logLoading')}</blockquote></div></div>
   <div class="about-list">
     <div class="about-row"><span class="ab-l"><i class="ti ti-user" aria-hidden="true"></i>${X('s_by')}</span><b id="s-auth" style="cursor:pointer;user-select:none;transition:opacity .16s">${t('s_author')}</b></div>
     <div class="about-row"><span class="ab-l"><i class="ti ti-folder" aria-hidden="true"></i>${X('s_data')}</span><button class="btn btn-ghost" id="s-dir" title="%APPDATA%\\SpaceEditor"><i class="ti ti-folder-open" aria-hidden="true"></i> ${X('s_open')}</button></div>
     <div class="about-row"><span class="ab-l"><i class="ti ti-bell" aria-hidden="true"></i>${X('s_news')}</span><button class="btn btn-ghost" id="s-tg"><i class="ti ti-brand-telegram" aria-hidden="true"></i> ${X('s_tg')}</button></div>
     <div class="about-row"><span class="ab-l"><i class="ti ti-brand-github" aria-hidden="true"></i>${X('s_src')}</span><button class="btn btn-ghost" id="s-gh"><i class="ti ti-brand-github" aria-hidden="true"></i> ${X('s_gh')}</button></div>
     <div class="about-row"><span class="ab-l"><i class="ti ti-bug" aria-hidden="true"></i>${X('s_fb')}</span><button class="btn btn-ghost" id="s-fb"><i class="ti ti-message" aria-hidden="true"></i> ${X('s_fbb')}</button></div>
     <div class="about-row"><span class="ab-l"><i class="ti ti-device-floppy" aria-hidden="true"></i>${X('s_backup')}</span><span style="display:flex;gap:8px"><button class="btn btn-ghost" id="s-exp">${expHTML()}</button><button class="btn btn-ghost" id="s-imp">${impHTML()}</button></span></div>
     <div class="about-row"><span class="ab-l"><i class="ti ti-lifebuoy" aria-hidden="true"></i>${X('s_support')}</span><button class="btn btn-ghost" id="s-sup"><i class="ti ti-copy" aria-hidden="true"></i> ${X('s_copy')}</button></div>
   </div>`;
}
};

async function supportInfo(){
  const ua=navigator.userAgent,m=r=>(ua.match(r)||[])[1];
  let win='Windows';
  try{
    const nt=m(/Windows NT ([\d.]+)/);
    const h=await Promise.race([navigator.userAgentData?.getHighEntropyValues?.(['platformVersion']),new Promise(r=>setTimeout(r,800))]);
    const pv=h&&h.platformVersion;
    win='Windows '+(pv&&parseInt(pv)>=13?'11':'10')+(pv?' ('+pv+')':nt?' (NT '+nt+')':'');
  }catch{}
  let gpu='n/a';
  try{
    const g=document.createElement('canvas').getContext('webgl');
    if(g){const e=g.getExtension('WEBGL_debug_renderer_info');gpu=String(e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER));g.getExtension('WEBGL_lose_context')?.loseContext()}
  }catch{}
  const on=v=>v?'on':'off';
  return [
    'SpaceEditor v'+VER,
    win,
    'Electron '+(m(/Electron\/([\d.]+)/)||'?')+', Chromium '+(m(/Chrome\/([\d.]+)/)||'?'),
    'GPU: '+gpu,
    'CPU threads: '+(navigator.hardwareConcurrency||'?')+', RAM: '+(navigator.deviceMemory?'>='+navigator.deviceMemory+' GB':'?'),
    'Screen: '+screen.width+'x'+screen.height+' @'+devicePixelRatio+'x, zoom '+Math.round(S.zoom*100)+'%',
    'Settings: bg='+S.bg+', lens='+on(S.lens)+', strength='+S.k+', brightness='+S.bri+', calm='+on(S.calm)+', theme='+S.theme+', lang='+S.lang+', on-top='+on(S.top)
  ].join('\n');
}
async function copyText(txt){
  try{if(window.api&&api.copyText&&await api.copyText(txt))return true}catch{}
  try{await navigator.clipboard.writeText(txt);return true}catch{}
  try{
    const ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok;
  }catch{return false}
}

let logCache=null;
const escH=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const inl=s=>escH(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
function md(src){
  let out='',ul=false;
  const close=()=>{if(ul){out+='</ul>';ul=false}};
  for(const raw of String(src).replace(/\r/g,'').split('\n')){
    const l=raw.trim();
    if(!l){close();continue}
    let m=l.match(/^[-*+]\s+(.*)$/);
    if(m){if(!ul){out+='<ul class="lg-ul">';ul=true}out+='<li>'+inl(m[1])+'</li>';continue}
    close();
    m=l.match(/^#{1,6}\s+(.*)$/);
    if(m){out+='<div class="lg-h">'+inl(m[1])+'</div>';continue}
    out+='<p>'+inl(l)+'</p>';
  }
  close();
  return out;
}
async function loadLog(pane){
  const box=pane.querySelector('#lg-b'),ver=pane.querySelector('#lg-v'),wrap=pane.querySelector('#lg-w');
  if(!box)return;
  let r=logCache;
  if(!r){
    try{r=await api.getChangelog()}catch{r=null}
    if(r&&r.ok)logCache=r;
  }
  if(!box.isConnected)return;
  if(!r||!r.ok){box.textContent=t('logErr');return}
  if(r.empty){wrap.remove();return}
  const d=r.date?new Date(r.date).toLocaleDateString(S.lang==='en'?'en-GB':'ru-RU'):'';
  ver.textContent='v'+fv(r.version)+(d?' \u00b7 '+d:'');
  if(!r.body.trim()){box.textContent=t('logEmpty');return}
  box.innerHTML=md(r.body);
  if(box.scrollHeight>150){
    wrap.classList.add('long');
    wrap.onclick=()=>wrap.classList.toggle('open');
  }
}

function cleanSettings(src){
  const o={};
  if(!src||typeof src!=='object'||Array.isArray(src))return o;
  const en=(k,list)=>{if(list.includes(src[k]))o[k]=src[k]};
  const num=(k,lo,hi)=>{if(typeof src[k]==='number'&&isFinite(src[k]))o[k]=Math.min(hi,Math.max(lo,src[k]))};
  en('lang',['ru','en']);en('theme',['dark','light','auto']);en('bg',['live','lite','off']);en('rand',['r','f']);
  num('k',.4,1.6);num('bri',.3,1.5);num('zoom',.8,1.4);
  ['lens','calm','first','warn','warnClose','confirmAll','top','autoUpdate'].forEach(k=>{if(typeof src[k]==='boolean')o[k]=src[k]});
  return o;
}
function mergeNotes(n){
  if(!n||typeof n!=='object'||Array.isArray(n))return;
  let ch=false;
  for(const [k,v] of Object.entries(n))if(typeof v==='string'&&v.trim()){notes[k]=v;ch=true}
  if(!ch)return;
  try{api.saveNotes(notes)}catch{}
  try{rebuildSidebar()}catch{}
  try{if(selIdx>=0)renderEditor()}catch{}
}
function flash(btn,mk,icon,txt){
  btn.innerHTML=`${ii(icon)} <span>${txt}</span>`;
  setTimeout(()=>{btn.innerHTML=mk();btn._busy=false},1800);
}

let toast=null;
function hideToast(){
  if(!toast)return;
  const el=toast;toast=null;
  el.classList.add('out');
  setTimeout(()=>el.remove(),400);
}
function showUpdateToast(r){
  if(toast||!document.body)return;
  const el=document.createElement('div');el.className='upd-toast';
  el.innerHTML=`<div class="ut-top"><div class="set-ico">${ii('refresh')}</div><div><b></b><small></small></div></div><div class="ut-bar" hidden><i></i></div><div class="ut-btns"><button class="btn btn-ghost" id="ut-hide">${ii('x')} <span></span></button><button class="btn btn-primary" id="ut-ok">${ii('download')} <span></span></button></div>`;
  const small=el.querySelector('small'),bar=el.querySelector('.ut-bar'),fill=bar.firstChild;
  const hideB=el.querySelector('#ut-hide'),okB=el.querySelector('#ut-ok');
  el.querySelector('b').textContent=t('tstT');
  small.textContent=t('tstText',{v:fv(r.latest),c:fv(r.current)});
  hideB.querySelector('span').textContent=t('tstHide');
  okB.querySelector('span').textContent=t(r.canInstall?'tstUp':'upOkWeb');
  hideB.onclick=hideToast;
  okB.onclick=async()=>{
    if(okB._busy)return;
    if(!r.canInstall){api.openLink('releases');hideToast();return}
    const dirtyNow=typeof dirty!=='undefined'&&dirty;
    if(dirtyNow&&!await notice({title:t('upT'),text:t('upDirty'),ok:t('upOk'),cancel:t('cancel')}))return;
    okB._busy=true;okB.disabled=true;hideB.disabled=true;bar.hidden=false;
    const put=p=>{small.textContent=t('s_upDl',{p});fill.style.width=p+'%'};
    progCb=put;put(0);
    let i;try{i=await api.installUpdate()}catch{i=null}
    progCb=null;
    if(i&&i.ok){small.textContent=t('s_upInst');return}
    okB._busy=false;okB.disabled=false;hideB.disabled=false;bar.hidden=true;
    small.textContent=t('s_upInstErr');
  };
  document.body.appendChild(el);
  toast=el;
}
async function autoCheck(){
  if(S.autoUpdate===false)return;
  let r;try{r=await api.checkUpdate()}catch{r=null}
  if(!r||!r.ok||!r.update||S.autoUpdate===false)return;
  updState={k:'s_upNew',p:{v:fv(r.latest)}};
  showUpdateToast(r);
}
if(S.autoUpdate!==false)setTimeout(autoCheck,3000);

window.openSettings=function(tab0){
  if(document.querySelector('.overlay'))return;
  let tab=PANES[tab0]?tab0:'gen';
  const ov=document.createElement('div');ov.className='overlay';
  ov.innerHTML=`<div class="modal" style="width:540px;height:min(580px,86vh)">
  <div class="modal-hdr"><i class="ti ti-settings" aria-hidden="true"></i><span class="modal-title" data-tx="settings">${t('settings')}</span></div>
  <div class="modal-body">
    <div class="mode-row segn" id="s-tabs" style="--n:${TABS.length}">${TABS.map(([v,l,ic])=>`<button class="mode-btn" data-t="${v}"><i class="ti ti-${ic}" aria-hidden="true"></i><span data-tx="${l}">${t(l)}</span></button>`).join('')}</div>
    <div id="s-pane"></div>
  </div>
  <div class="modal-ftr"><button class="btn btn-ghost" id="s-reset"><i class="ti ti-refresh" aria-hidden="true"></i><span data-tx="s_reset">${t('s_reset')}</span></button><button class="btn btn-primary" id="s-ok"><i class="ti ti-check" aria-hidden="true"></i><span data-tx="s_ok">${t('s_ok')}</span></button></div></div>`;
  document.body.appendChild(ov);
  const $=s=>ov.querySelector(s);

  function texts(){ov.querySelectorAll('[data-tx]').forEach(e=>e.textContent=t(e.dataset.tx))}
  function paint(){
    ov.querySelectorAll('#s-tabs .mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.t===tab));
    $('#s-tabs').style.setProperty('--i',TABS.findIndex(x=>x[0]===tab));
    ov.querySelectorAll('.sw[data-k]').forEach(b=>b.setAttribute('aria-checked',!!S[b.dataset.k]));
    ov.querySelectorAll('.segn[data-k]').forEach(g=>{
      const bs=[...g.querySelectorAll('.mode-btn')],cur=String(S[g.dataset.k]);
      bs.forEach(b=>b.classList.toggle('active',b.dataset.v===cur));
      g.style.setProperty('--i',Math.max(0,bs.findIndex(b=>b.dataset.v===cur)));
    });
    ov.querySelectorAll('input[type=range]').forEach(r=>{
      const k=r.dataset.k,lo=+r.min,hi=+r.max;
      r.value=S[k];r.style.setProperty('--p',((S[k]-lo)/(hi-lo)*100)+'%');
      const v=$('.rv[data-v="'+k+'"]');if(v)v.textContent=Math.round(S[k]*100)+'%';
    });
    const kr=$('[data-r="k"]');
    if(kr){kr.style.opacity=S.lens?1:.4;$('input[data-k="k"]').disabled=!S.lens}
  }
  const set=(p,rb)=>{
    Object.assign(S,p);save();apply(rb);
    if('lang' in p)texts();
    if('autoUpdate' in p&&!p.autoUpdate)hideToast();
    paint();
  };
  const quick=fn=>{
    const c=document.documentElement.classList;
    c.add('nt');fn();
    requestAnimationFrame(()=>requestAnimationFrame(()=>c.remove('nt')));
  };
  const setTheme=v=>quick(()=>set({theme:v}));
  function bind(pane){
    const tg=pane.querySelector('#s-tg');
    if(tg)tg.onclick=()=>window.api&&api.openLink&&api.openLink('telegram');
    const gh=pane.querySelector('#s-gh');
    if(gh)gh.onclick=()=>window.api&&api.openLink&&api.openLink('github');
    const fb=pane.querySelector('#s-fb');
    if(fb)fb.onclick=()=>window.api&&api.openLink&&api.openLink('bug');
    const ex=pane.querySelector('#s-exp');
    if(ex)ex.onclick=async()=>{
      if(ex._busy)return;ex._busy=true;
      let r;try{r=await api.exportSettings(t('dlgExp'))}catch{r=null}
      if(r&&r.canceled){ex._busy=false;return}
      flash(ex,expHTML,r&&r.ok?'check':'alert-triangle',t(r&&r.ok?'s_exOk':'s_copyErr'));
    };
    const im=pane.querySelector('#s-imp');
    if(im)im.onclick=async()=>{
      if(im._busy)return;im._busy=true;
      let r;try{r=await api.importSettings(t('dlgImp'))}catch{r=null}
      if(r&&r.canceled){im._busy=false;return}
      if(!r||!r.ok){flash(im,impHTML,'alert-triangle',t('s_imBad'));return}
      if(!await notice({title:t('impT'),text:t('impText'),ok:t('impOk'),cancel:t('cancel')})){im._busy=false;return}
      set({...cleanSettings(r.settings),perfDone:true},true);
      mergeNotes(r.notes);
      flash(im,impHTML,'check',t('s_imOk'));
    };
    const sp=pane.querySelector('#s-sup');
    if(sp)sp.onclick=async()=>{
      if(sp._busy)return;sp._busy=true;
      const keep=sp.innerHTML;
      let ok=false;
      try{
        const info=await Promise.race([supportInfo(),new Promise(r=>setTimeout(()=>r('SpaceEditor v'+VER+'\n'+navigator.userAgent),2000))]);
        ok=await Promise.race([copyText(info),new Promise(r=>setTimeout(()=>r(false),2000))]);
      }catch{ok=false}
      sp.innerHTML=ok?`<i class="ti ti-check" aria-hidden="true"></i> <span>${t('s_copied')}</span>`:`<i class="ti ti-alert-triangle" aria-hidden="true"></i> <span>${t('s_copyErr')}</span>`;
      setTimeout(()=>{sp.innerHTML=keep;sp._busy=false},1800);
    };
    const au=pane.querySelector('#s-auth');
    if(au)au.onclick=()=>{
      if(au._busy)return;au._busy=true;
      const fade=(txt,next)=>{au.style.opacity=0;setTimeout(()=>{au.textContent=txt;au.style.opacity=1;next&&next()},170)};
      fade(t('s_egg'),()=>setTimeout(()=>fade(t('s_author'),()=>{au._busy=false}),2600));
    };
    const dr=pane.querySelector('#s-dir');
    if(dr)dr.onclick=()=>window.api&&api.openDataDir&&api.openDataDir();
    loadLog(pane);
    const up=pane.querySelector('#s-upd');
    if(up)up.onclick=async()=>{
      if(up._busy)return;up._busy=true;
      const st=pane.querySelector('#upd-st');
      const put=(k,p)=>{updState={k,p};if(st)st.textContent=t(k,p)};
      put('s_upChecking');
      let r;try{r=await api.checkUpdate()}catch{r=null}
      if(!r||!r.ok){up._busy=false;put('s_upErr');return}
      if(!r.update){up._busy=false;put('s_upLatest',{v:fv(r.current)});return}
      put('s_upNew',{v:fv(r.latest)});
      const dirtyNow=typeof dirty!=='undefined'&&dirty;
      const txt=r.canInstall?t('upText',{v:fv(r.latest),c:fv(r.current)})+(dirtyNow?' '+t('upDirty'):''):t('upTextWeb',{v:fv(r.latest),c:fv(r.current)});
      if(!await notice({title:t('upT'),text:txt,ok:t(r.canInstall?'upOk':'upOkWeb'),cancel:t('cancel')})){up._busy=false;return}
      if(!r.canInstall){up._busy=false;api.openLink('releases');return}
      progCb=p=>put('s_upDl',{p});
      put('s_upDl',{p:0});
      let i;try{i=await api.installUpdate()}catch{i=null}
      progCb=null;
      if(i&&i.ok){put('s_upInst');return}
      up._busy=false;put('s_upInstErr');
    };
    pane.querySelectorAll('.sw[data-k]').forEach(b=>b.onclick=async()=>{
      const k=b.dataset.k;
      if(k==='lens'&&!S.lens&&PERF&&!await notice({title:t('perfT'),text:t('perfLens'),ok:t('perfLiveOk'),cancel:t('cancel')}))return;
      set({[k]:!S[k]});
    });
    pane.querySelectorAll('.segn[data-k]').forEach(g=>g.querySelectorAll('.mode-btn').forEach(b=>b.onclick=async()=>{
      const k=g.dataset.k,v=b.dataset.v;
      if(k==='bg'&&v==='live'&&S.bg!=='live'&&PERF&&!await notice({title:t('perfT'),text:t('perfLive'),ok:t('perfLiveOk'),cancel:t('cancel')}))return;
      if(k==='theme')setTheme(v);else set({[k]:v});
    }));
    pane.querySelectorAll('input[type=range]').forEach(r=>{
      const k=r.dataset.k;
      r.oninput=e=>{S[k]=+(+e.target.value).toFixed(2);paint();if(k==='bri')apply(false)};
      r.onchange=()=>{save();apply(k==='k')};
    });
  }
  function show(){
    const pane=document.createElement('div');pane.id='s-pane';pane.className='pane';
    pane.innerHTML=PANES[tab]();
    $('#s-pane').replaceWith(pane);bind(pane);paint();
  }
  ov.querySelectorAll('#s-tabs .mode-btn').forEach(b=>b.onclick=()=>{if(tab===b.dataset.t)return;tab=b.dataset.t;show()});
  $('#s-reset').onclick=async()=>{
    if(!await notice({title:t('resetT'),text:t('resetText'),ok:t('resetOk'),cancel:t('cancel')}))return;
    quick(()=>set({...D,perfDone:true},true));
  };
  const close=()=>{document.removeEventListener('keydown',esc);ov.remove()};
  const esc=e=>{if(e.key==='Escape')close()};
  document.addEventListener('keydown',esc);
  $('#s-ok').onclick=close;
  ov.onclick=e=>{if(e.target===ov)close()};
  show();
};
})();
