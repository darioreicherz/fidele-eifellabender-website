(async()=>{
const show=document.querySelector("[data-slideshow]"),gal=document.querySelector("[data-gallery]");
if(!show&&!gal)return;
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
let years;
try{const r=await fetch("data/galerie.json");if(!r.ok)throw 0;years=(await r.json()).jahre;}
catch(e){(show||gal).innerHTML="<p class=\"wrap\">Fotos konnten nicht geladen werden.</p>";return;}
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const loads=src=>new Promise(res=>{const i=new Image();i.onload=()=>res(true);i.onerror=()=>res(false);i.src=src;});
const all=[];
years.forEach(y=>y.fotos.forEach(f=>{f.jahr=y.jahr;all.push(f);}));
(await Promise.all(all.map(f=>loads(f.datei)))).forEach((ok,i)=>all[i].ok=ok);
const alt=f=>f.alt||`Foto der Band aus ${f.jahr} [VEREIN KLÄREN: Alt-Text]`;

if(show){
  let ph=all.filter(f=>f.ok);
  for(let i=ph.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ph[i],ph[j]]=[ph[j],ph[i]];}
  ph=ph.slice(0,12);
  if(!ph.length){show.innerHTML="<p class=\"wrap\">Fotos folgen. [VEREIN KLÄREN: Bilder in assets/img/galerie/JAHR/ ablegen]</p>";}
  else{
    show.innerHTML=`<div class="ss" role="group" aria-roledescription="Diashow" aria-label="Fotos der Band" tabindex="0"><ul class="ss-track">${ph.map((f,i)=>`<li class="ss-slide"><button type="button" tabindex="-1" data-i="${i}" aria-label="Bild ${i+1} von ${ph.length}: ${esc(alt(f))}"><img src="${esc(f.datei)}" alt="" width="1200" height="400"></button></li>`).join("")}</ul></div>
<div class="ss-ctl"><button type="button" class="btn-sec" data-act="prev">Zurück</button><button type="button" class="btn-sec" data-act="play" aria-pressed="false">Pause</button><button type="button" class="btn-sec" data-act="next">Weiter</button></div><p class="small ss-status" aria-live="off"></p>`;
    const box=show.querySelector(".ss"),track=show.querySelector(".ss-track"),slides=[...track.children],st=show.querySelector(".ss-status"),pb=show.querySelector("[data-act=play]");
    let cur=0,timer=null,hold=false,playing=false;
    const layout=()=>{track.style.transform=`translateX(${box.clientWidth/2-(cur+.5)*slides[0].offsetWidth}px)`;
      slides.forEach((s,i)=>{s.classList.toggle("is-current",i===cur);s.querySelector("button").toggleAttribute("aria-current",i===cur);});
      st.textContent=`Bild ${cur+1} von ${ph.length}`;};
    const go=n=>{cur=(n+ph.length)%ph.length;layout();};
    const play=on=>{playing=on;clearInterval(timer);if(on)timer=setInterval(()=>{if(!hold&&!document.hidden)go(cur+1);},5000);
      pb.textContent=on?"Pause":"Abspielen";pb.setAttribute("aria-pressed",String(!on));st.setAttribute("aria-live",on?"off":"polite");};
    track.style.transition="none";layout();requestAnimationFrame(()=>requestAnimationFrame(()=>track.style.transition=""));
    addEventListener("resize",layout);
    show.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
      if(b.dataset.i!==undefined)go(+b.dataset.i);
      else if(b.dataset.act==="prev")go(cur-1);else if(b.dataset.act==="next")go(cur+1);else if(b.dataset.act==="play")play(!playing);});
    box.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")go(cur-1);if(e.key==="ArrowRight")go(cur+1);});
    let x0=null;box.addEventListener("pointerdown",e=>x0=e.clientX);
    box.addEventListener("pointerup",e=>{if(x0!==null&&Math.abs(e.clientX-x0)>50)go(cur+(e.clientX<x0?1:-1));x0=null;});
    ["pointerenter","focusin"].forEach(t=>show.addEventListener(t,()=>hold=true));
    ["pointerleave","focusout"].forEach(t=>show.addEventListener(t,()=>hold=false));
    play(!reduce&&ph.length>1);
  }
}

if(gal){
  const lb=document.createElement("dialog");lb.className="lb";lb.setAttribute("aria-label","Großansicht");
  lb.innerHTML=`<figure><img alt="" src=""><figcaption></figcaption></figure><div class="ss-ctl"><button type="button" class="btn-sec" data-lb="prev">Zurück</button><button type="button" class="btn-sec" data-lb="next">Weiter</button><button type="button" class="btn-sec" data-lb="close">Schließen</button></div>`;
  document.body.append(lb);
  let list=[],idx=0;
  const view=()=>{const f=list[idx];const im=lb.querySelector("img");im.src=f.datei;im.alt=alt(f);lb.querySelector("figcaption").textContent=`${f.jahr}, Foto: ${f.urheber||"[VEREIN KLÄREN]"} (${idx+1} von ${list.length})`;};
  lb.addEventListener("click",e=>{const a=e.target.dataset?.lb;if(a==="close"||e.target===lb)lb.close();
    if(a==="prev"){idx=(idx-1+list.length)%list.length;view();}if(a==="next"){idx=(idx+1)%list.length;view();}});
  gal.innerHTML=[...years].sort((a,b)=>b.jahr-a.jahr).map(y=>{const fs=y.fotos.filter(f=>f.ok);
    return `<section class="yr" aria-labelledby="y${y.jahr}"><div class="yr-head"><h2 id="y${y.jahr}">${y.jahr}</h2>${fs.length?`<div><button type="button" class="btn-sec" data-dir="-1" aria-label="${y.jahr}: nach links blättern">←</button> <button type="button" class="btn-sec" data-dir="1" aria-label="${y.jahr}: nach rechts blättern">→</button></div>`:""}</div>`+
    (fs.length?`<ul class="yr-row" tabindex="0" aria-label="Fotos ${y.jahr}">${fs.map(f=>`<li><button type="button" class="thumb" data-y="${y.jahr}" data-f="${esc(f.datei)}"><img src="${esc(f.datei)}" width="480" height="320" loading="lazy" alt="${esc(alt(f))}"><span class="small">Foto: ${esc(f.urheber||"[VEREIN KLÄREN]")}</span></button></li>`).join("")}</ul>`:`<p>Für ${y.jahr} sind noch keine Fotos hinterlegt.</p>`)+`</section>`;}).join("");
  gal.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    if(b.dataset.dir){const row=b.closest(".yr").querySelector(".yr-row");row.scrollBy({left:b.dataset.dir*row.clientWidth*.8,behavior:reduce?"auto":"smooth"});}
    else if(b.dataset.f){list=all.filter(f=>f.ok&&f.jahr==b.dataset.y);idx=list.findIndex(f=>f.datei===b.dataset.f);view();lb.showModal();}});
}
})();
