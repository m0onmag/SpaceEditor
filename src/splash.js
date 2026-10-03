(()=>{
const q=new URLSearchParams(location.search);
const en=q.get('lang')==='en';
document.documentElement.dataset.theme=q.get('theme')==='light'?'light':'dark';
document.documentElement.lang=en?'en':'ru';
if(q.get('calm')==='1')document.documentElement.classList.add('calm');
document.getElementById('msg').textContent=en?'Starting up, sir…':'Запускаю, сэр…';
})();
