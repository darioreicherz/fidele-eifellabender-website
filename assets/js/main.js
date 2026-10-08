(async()=>{
const up=document.querySelector("[data-upcoming]"),past=document.querySelector("[data-past]"),nxt=document.querySelector("[data-next-events]");
if(!up&&!nxt)return;
let data=[];
try{const r=await fetch("data/termine.json");if(!r.ok)throw 0;data=await r.json();}
catch(e){const m="<p>Termine konnten nicht geladen werden. Bitte fragen Sie per E-Mail an.</p>";if(up)up.innerHTML=m;if(nxt)nxt.innerHTML=m;return;}
const today=new Date().toISOString().slice(0,10);
const fmt=d=>new Date(d+"T12:00:00").toLocaleDateString("de-DE",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
const list=a=>"<ul class=\"events\">"+a.map(e=>`<li><time datetime="${e.datum}">${fmt(e.datum)}</time>${e.titel.replace(/</g,"&lt;")}, ${e.zeit}</li>`).join("")+"</ul>";
const upc=data.filter(e=>e.datum>=today).sort((a,b)=>a.datum.localeCompare(b.datum));
const old=data.filter(e=>e.datum<today).sort((a,b)=>b.datum.localeCompare(a.datum));
const none="<p>Aktuell sind keine Termine veröffentlicht. Fragen Sie uns gern per E-Mail.</p>";
if(up)up.innerHTML=upc.length?list(upc):none;
if(nxt)nxt.innerHTML=upc.length?list(upc.slice(0,3)):none;
if(past)past.innerHTML=old.length?list(old):"";
})();