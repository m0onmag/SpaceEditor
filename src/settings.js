(()=>{
const D={lang:'ru',accent:'w',autosave:true,favs:[],theme:'dark',bg:'live',lens:true,k:1,bri:1,calm:false,rand:'r',first:true,warn:true,warnClose:true,confirmAll:true,zoom:1,top:false,autoUpdate:true,voice:true,sir:true,vol:1};
let S={...D};
try{S={...D,...((window.api&&api.loadSettings&&api.loadSettings())||{})}}catch{}
window.VS=S;
const save=()=>{try{window.api&&api.saveSettings&&api.saveSettings(S)}catch{}};
window.toggleFav=n=>{const a=Array.isArray(S.favs)?S.favs:[];S.favs=a.includes(n)?a.filter(x=>x!==n):[...a,n];save()};
window.clearFavs=()=>{S.favs=[];save()};

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
window.PERF=PERF;
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
    if(o.say)say(o.say);
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
  window.applyAccent&&applyAccent(S.accent);
  window.bgAccent&&bgAccent(window.ACC_CUR);
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
  window.started.then(()=>say('lite'));
}

const fv=v=>String(v||'').replace(/^(\d+\.\d+)\.0$/,'$1');
let VER='1.0',updState=null,progCb=null;
try{VER=fv(api.getVersion())||VER}catch{}
document.title='SpaceEditor | v'+VER;
try{api.onUpdateProgress(p=>progCb&&progCb(p))}catch{}
const TABS=[['gen','s_gen','sliders'],['gfx','s_gfx','monitor'],['edit','s_edit','pencil'],['about','s_about','info']];
const X=(k,tag='span')=>`<${tag} data-tx="${k}">${t(k)}</${tag}>`;
const IC={lang:'globe',theme:'contrast',zoom:'zoom',top:'window-top',bg:'photo',bri:'sun',lens:'diamond',k:'wave',calm:'pause',rand:'microphone',first:'skip-back',confirmAll:'shield-check',warn:'download',warnClose:'power',autoUpdate:'refresh',voice:'microphone',sir:'user',vol:'volume',preset:'sliders',accent:'palette',fps:'monitor',autosave:'device-floppy'};
const ii=n=>`<i class="ti ti-${n}" aria-hidden="true"></i>`;
const ico=k=>`<div class="set-ico"><i class="ti ti-${IC[k]}" aria-hidden="true"></i></div>`;
const sw=k=>`<button class="sw" data-k="${k}" role="switch"></button>`;
const PRESETS={low:{bg:'lite',lens:false,k:1,calm:true},bal:{bg:'lite',lens:true,k:1,calm:false},max:{bg:'live',lens:true,k:1,calm:false}};
const curPreset=()=>Object.keys(PRESETS).find(n=>Object.keys(PRESETS[n]).every(k=>S[k]===PRESETS[n][k]))||'';
const swatches=()=>`<div class="set-grp"><div class="set-row">${ico('accent')}<div>${X('s_accent','b')}${X('s_accent_d','small')}</div></div><div class="swatches" data-k="accent">${ACCENTS.map(([id,c])=>`<button class="swatch${c?'':' w'}" data-v="${id}"${c?` style="--sw:${c}"`:''} aria-label="${id}"></button>`).join('')}</div></div>`;
const fpsRow=()=>`<div class="set-row" data-r="fps">${ico('fps')}<div>${X('s_fps','b')}<small id="fps-d">${t('fps_wait')}</small></div><div class="rc fps"><span class="fps-n" id="fps-n">--</span><span class="fps-bar"><i id="fps-f"></i></span></div></div>`;
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

const kb=(...k)=>`<span style="display:flex;gap:4px;align-items:center;flex-shrink:0">${k.map(x=>`<kbd style="padding:2px 7px;border-radius:6px;border:1px solid rgba(128,128,128,.4);background:rgba(128,128,128,.12);font:inherit;font-size:11px;line-height:1.5">${x}</kbd>`).join('')}</span>`;
const hkRow=(l,ic,...k)=>`<div class="about-row"><span class="ab-l"><i class="ti ti-${ic}" aria-hidden="true"></i>${X(l)}</span>${kb(...k)}</div>`;
const hotkeys=()=>`<div class="set-row"><div class="set-ico"><i class="ti ti-keyboard" aria-hidden="true"></i></div><div>${X('s_hk','b')}</div></div><div class="about-list">`+
  hkRow('s_hkSave','device-floppy','Ctrl','S')+
  hkRow('s_hkOpen','folder-open','Ctrl','O')+
  hkRow('s_hkFind','search','Ctrl','F')+
  hkRow('s_hkUndo','arrow-back-up','Ctrl','Z')+
  hkRow('s_hkRedo','arrow-forward-up','Ctrl','Y')+
  hkRow('s_hkNav','arrows-vertical','↑','↓')+
  hkRow('s_hkEsc','x','Esc')+
  `</div>`;

const PANES={
gen:()=>
  grp('lang',[['ru','lang_ru',FL.ru],['en','lang_en',FL.en]])+
  grp('theme',[['dark','th_dark',ii('moon')],['light','th_light',ii('sun')],['auto','th_auto',ii('contrast')]])+
  swatches()+
  row('zoom',rc('zoom',.8,1.4,.05))+
  row('top',sw('top'))+
  row('autoUpdate',sw('autoUpdate'))+
  row('voice',sw('voice'))+
  row('sir',sw('sir'))+
  row('vol',rc('vol',0,1,.05)),
gfx:()=>
  grp('preset',[['low','pr_low',ii('pause')],['bal','pr_bal',ii('contrast')],['max','pr_max',ii('diamond')]])+
  grp('bg',[['live','bgLive',ii('play')],['lite','bgLite',ii('bolt')],['off','bgOff',ii('ban')]])+
  fpsRow()+
  row('bri',rc('bri',.3,1.5,.05))+
  row('lens',sw('lens'))+
  row('k',rc('k',.4,1.6,.1))+
  row('calm',sw('calm')),
edit:()=>
  grp('rand',[['r','random',ii('dice')],['f','fixed',ii('pin')]])+
  row('autosave',sw('autosave'))+
  row('first',sw('first'))+
  row('confirmAll',sw('confirmAll'))+
  row('warn',sw('warn'))+
  row('warnClose',sw('warnClose'))+
  hotkeys(),
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
const inl=s=>escHtml(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
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
    progCb=put;put(0);say('updDl');
    let i;try{i=await api.installUpdate()}catch{i=null}
    progCb=null;
    if(i&&i.ok){small.textContent=t('s_upInst');say('installed');return}
    okB._busy=false;okB.disabled=false;hideB.disabled=false;bar.hidden=true;
    small.textContent=t('s_upInstErr');say('instFail');
  };
  document.body.appendChild(el);
  toast=el;
}
async function autoCheck(){
  if(S.autoUpdate===false)return;
  let r;try{r=await api.checkUpdate()}catch{r=null}
  if(!r||!r.ok||!r.update||S.autoUpdate===false)return;
  updState={k:'s_upNew',p:{v:fv(r.latest)}};
  showUpdateToast(r);say('newVer');
}
if(S.autoUpdate!==false)setTimeout(autoCheck,3000);

window.openSettings=function(){
  if(document.querySelector('.overlay'))return;
  let tab='gen';
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
    ov.querySelectorAll('.swatch').forEach(b=>b.classList.toggle('on',b.dataset.v===S.accent));
    $('#s-tabs').style.setProperty('--i',TABS.findIndex(x=>x[0]===tab));
    ov.querySelectorAll('.sw[data-k]').forEach(b=>b.setAttribute('aria-checked',!!S[b.dataset.k]));
    ov.querySelectorAll('.segn[data-k]').forEach(g=>{
      const bs=[...g.querySelectorAll('.mode-btn')],cur=String(g.dataset.k==='preset'?curPreset():S[g.dataset.k]);
      bs.forEach(b=>b.classList.toggle('active',b.dataset.v===cur));
      g.style.setProperty('--i',Math.max(0,bs.findIndex(b=>b.dataset.v===cur)));
      g.classList.toggle('none',!bs.some(b=>b.classList.contains('active')));
    });
    ov.querySelectorAll('input[type=range]').forEach(r=>{
      const k=r.dataset.k,lo=+r.min,hi=+r.max;
      r.value=S[k];r.style.setProperty('--p',((S[k]-lo)/(hi-lo)*100)+'%');
      const v=$('.rv[data-v="'+k+'"]');if(v)v.textContent=Math.round(S[k]*100)+'%';
    });
    const kr=$('[data-r="k"]');
    if(kr){kr.style.opacity=S.lens?1:.4;$('input[data-k="k"]').disabled=!S.lens}
    const vr=$('[data-r="vol"]');
    if(vr){vr.style.opacity=S.voice?1:.4;$('input[data-k="vol"]').disabled=!S.voice}
    const sr=$('[data-r="sir"]');
    if(sr){sr.style.opacity=S.voice?1:.4;$('.sw[data-k="sir"]').disabled=!S.voice}
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
      if(r&&r.ok)say('setSaved');
      flash(ex,expHTML,r&&r.ok?'check':'alert-triangle',t(r&&r.ok?'s_exOk':'s_copyErr'));
    };
    const im=pane.querySelector('#s-imp');
    if(im)im.onclick=async()=>{
      if(im._busy)return;im._busy=true;
      let r;try{r=await api.importSettings(t('dlgImp'))}catch{r=null}
      if(r&&r.canceled){im._busy=false;return}
      if(!r||!r.ok){say('badSettings');flash(im,impHTML,'alert-triangle',t('s_imBad'));return}
      if(!await notice({title:t('impT'),text:t('impText'),ok:t('impOk'),cancel:t('cancel')})){im._busy=false;return}
      set({...r.settings,perfDone:true},true);
      mergeNotes(r.notes);
      say('setLoaded');
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
      say('egg');fade(t('s_egg'),()=>setTimeout(()=>fade(t('s_author'),()=>{au._busy=false}),2600));
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
      if(!r||!r.ok){up._busy=false;put('s_upErr');say('updFail');return}
      if(!r.update){up._busy=false;put('s_upLatest',{v:fv(r.current)});say('latest');return}
      put('s_upNew',{v:fv(r.latest)});say('newVer');
      const dirtyNow=typeof dirty!=='undefined'&&dirty;
      const txt=r.canInstall?t('upText',{v:fv(r.latest),c:fv(r.current)})+(dirtyNow?' '+t('upDirty'):''):t('upTextWeb',{v:fv(r.latest),c:fv(r.current)});
      if(!await notice({title:t('upT'),text:txt,ok:t(r.canInstall?'upOk':'upOkWeb'),cancel:t('cancel')})){up._busy=false;return}
      if(!r.canInstall){up._busy=false;api.openLink('releases');return}
      progCb=p=>put('s_upDl',{p});
      put('s_upDl',{p:0});say('updDl');
      let i;try{i=await api.installUpdate()}catch{i=null}
      progCb=null;
      if(i&&i.ok){put('s_upInst');say('installed');return}
      up._busy=false;put('s_upInstErr');say('instFail');
    };
    pane.querySelectorAll('.swatch').forEach(b=>b.onclick=()=>set({accent:b.dataset.v}));
    const fn=pane.querySelector('#fps-n');
    if(fn){
      const tick=()=>{
        const st=window.bgStat?bgStat():null,fb=pane.querySelector('#fps-f'),fd=pane.querySelector('#fps-d');
        let txt,col='',n='--',w=0;
        if(!st||S.bg==='off')txt=t('fps_off');
        else if(!st.run||!st.fps)txt=t('fps_wait');
        else{
          const v=Math.round(st.fps),k=v>=52?'good':v>=30?'ok':'bad',q=Math.round(st.q*100);
          n=v+' FPS';w=Math.min(1,v/60)*100;col={good:'#4ade80',ok:'#fbbf24',bad:'#f87171'}[k];
          txt=t('fps_'+k)+(q<100?' · '+t('fps_q',{q}):'');
        }
        fn.textContent=n;fn.style.color=col;fd.textContent=txt;fb.style.width=w+'%';fb.style.background=col||'';
      };
      tick();
      const iv=setInterval(()=>{if(!fn.isConnected){clearInterval(iv);return}tick()},500);
    }
    pane.querySelectorAll('.sw[data-k]').forEach(b=>b.onclick=async()=>{
      const k=b.dataset.k;
      if(k==='lens'&&!S.lens&&PERF&&!await notice({title:t('perfT'),text:t('perfLens'),say:'weakPc',ok:t('perfLiveOk'),cancel:t('cancel')}))return;
      if(k==='calm'&&S.calm&&PERF&&PERF.calm&&!await notice({title:t('perfT'),text:t('perfCalm'),say:'weakPc',ok:t('perfLiveOk'),cancel:t('cancel')}))return;
      set({[k]:!S[k]});
      if(k==='sir')say('start');
    });
    pane.querySelectorAll('.segn[data-k]').forEach(g=>g.querySelectorAll('.mode-btn').forEach(b=>b.onclick=async()=>{
      const k=g.dataset.k,v=b.dataset.v;
      if(k==='preset'){
        if(v==='max'&&PERF&&!await notice({title:t('perfT'),text:t('perfLive'),say:'weakPc',ok:t('perfLiveOk'),cancel:t('cancel')}))return;
        set({...PRESETS[v]},true);return;
      }
      if(k==='bg'&&v==='live'&&S.bg!=='live'&&PERF&&!await notice({title:t('perfT'),text:t('perfLive'),say:'weakPc',ok:t('perfLiveOk'),cancel:t('cancel')}))return;
      if(k==='theme')setTheme(v);else set({[k]:v});
    }));
    pane.querySelectorAll('input[type=range]').forEach(r=>{
      const k=r.dataset.k;
      r.oninput=e=>{S[k]=+(+e.target.value).toFixed(2);paint();if(k==='bri')apply(false);if(k==='vol')window.voiceGain()};
      r.onchange=()=>{save();apply(k==='k');if(k==='vol')say('start')};
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
    quick(()=>set({...D,favs:S.favs,perfDone:true},true));say('reset');
  };
  const close=()=>{document.removeEventListener('keydown',esc);ov.remove()};
  const esc=e=>{if(e.key==='Escape')close()};
  document.addEventListener('keydown',esc);
  $('#s-ok').onclick=close;
  ov.onclick=e=>{if(e.target===ov)close()};
  show();
};
})();
