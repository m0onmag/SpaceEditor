(function(){
window.ACCENTS=[['w',null],['blue','96,165,250'],['violet','167,139,250'],['pink','244,114,182'],['red','248,113,113'],['orange','251,146,60'],['yellow','250,204,21'],['green','74,222,128'],['teal','45,212,191']];
window.ACC_CUR=null;
window.applyAccent=function(id){
  var d=document.documentElement,s=d.style,a=null,i;
  for(i=0;i<ACCENTS.length;i++)if(ACCENTS[i][0]===id)a=ACCENTS[i][1];
  ['--acc','--pri-a','--pri-b','--pri-t','--pri-sh'].forEach(function(p){s.removeProperty(p)});
  d.classList.toggle('ac',!!a);
  window.ACC_CUR=a;
  if(!a)return;
  var p=a.split(',').map(Number);
  s.setProperty('--acc',a);
  s.setProperty('--pri-a','rgb('+a+')');
  s.setProperty('--pri-b','rgb('+p.map(function(v){return Math.round(v*.78)}).join(',')+')');
  s.setProperty('--pri-t','#000');
  s.setProperty('--pri-sh','inset 0 1px 0 rgba(255,255,255,.5),0 8px 28px rgba('+a+',.38),0 0 0 1px rgba('+a+',.55)');
};
try{
  var s=(window.api&&api.loadSettings&&api.loadSettings())||{},l=s.theme==='light'||(s.theme==='auto'&&matchMedia('(prefers-color-scheme: light)').matches);
  document.documentElement.dataset.theme=l?'light':'dark';
  document.documentElement.lang=s.lang||'ru';
  applyAccent(s.accent);
}catch(e){}
})();
