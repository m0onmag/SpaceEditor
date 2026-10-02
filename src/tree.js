(()=>{
const closed=new Set();
const nm=document.getElementById('cmd-name'),hd=document.getElementById('editor-header');
const sync=()=>{hd.style.display=nm.textContent.trim()==='-'?'none':''};
new MutationObserver(sync).observe(nm,{childList:true,characterData:true,subtree:true});sync();
const P={
  chev:'<path d="m9 6 6 6-6 6"/>',
  folder:'<path d="M3 7.5a2 2 0 0 1 2-2h3.8l2 2H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  note:'<path d="M13 20l7-7"/><path d="M13 20v-6a1 1 0 0 1 1-1h6V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7"/>'};
const svg=(n,c)=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;

window.rebuildSidebar=function(){
  const list=document.getElementById('side-list'),q=document.getElementById('search-inp').value.toLowerCase(),top=list.scrollTop;
  const root={f:new Map(),c:[]};
  cmds.forEach((c,i)=>{
    if(q&&!c.name.toLowerCase().includes(q)&&!c.path.join('/').toLowerCase().includes(q))return;
    let n=root;
    for(const p of c.path){if(!n.f.has(p))n.f.set(p,{f:new Map(),c:[]});n=n.f.get(p)}
    n.c.push(i);
  });
  const count=n=>n.c.length+[...n.f.values()].reduce((s,x)=>s+count(x),0);

  function item(idx){
    const hv=Object.values(asgn[idx]||{}).some(a=>a.files&&a.files.length);
    const el=document.createElement('div');
    el.className='side-item'+(idx===selIdx?' active':'');
    el.dataset.i=idx;
    el.innerHTML=`<span class="side-dot ${hv?'voiced':'empty'}"></span><span class="side-name"></span>${notes[noteKey(idx)]?`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" style="font-size:14px;color:var(--t3)">${P.note}</svg>`:''}`;
    el.querySelector('.side-name').textContent=cmds[idx].name;
    el.onclick=()=>selectCmd(idx);
    return el;
  }
  function render(n,parent,key){
    for(const [name,ch] of n.f){
      const k=key+'/'+name,shut=!q&&closed.has(k);
      const row=document.createElement('div');
      row.className='fold'+(shut?'':' open');
      row.innerHTML=svg('chev','chev')+svg('folder','fi')+`<span class="side-name"></span><span class="fcnt">${count(ch)}</span>`;
      row.querySelector('.side-name').textContent=name;
      const g=document.createElement('div'),inner=document.createElement('div');
      g.className='tg'+(shut?' c':'');g.appendChild(inner);
      row.onclick=()=>{const s=g.classList.toggle('c');row.classList.toggle('open',!s);s?closed.add(k):closed.delete(k)};
      parent.append(row,g);
      render(ch,inner,k);
    }
    for(const idx of n.c)parent.appendChild(item(idx));
  }
  const frag=document.createDocumentFragment();
  render(root,frag,'');
  list.innerHTML='';list.appendChild(frag);list.scrollTop=top;
};

window.markSidebar=function(){
  const list=document.getElementById('side-list');
  const old=list.querySelector('.side-item.active');
  if(old)old.classList.remove('active');
  const el=list.querySelector('.side-item[data-i="'+selIdx+'"]');
  if(el)el.classList.add('active');
};
})();
