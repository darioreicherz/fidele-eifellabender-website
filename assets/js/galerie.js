(async()=>{
const show=document.querySelector("[data-slideshow]"),gal=document.querySelector("[data-gallery]");
if(!show&&!gal)return;
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
let years;
try{const r=await fetch("data/galerie.json");if(!r.ok)throw 0;years=(await r.json()).jahre;}
catch(e){(show||gal).innerHTML="<p class=\"wrap\">Fotos konnten nicht geladen werden.</p>";return;}
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const loads=src=>new Promise(res=>{const i=new Image();i.onload=()=>res({w:i.naturalWidth||3,h:i.naturalHeight||2});i.onerror=()=>res(null);i.src=src;});
const all=[];
years.forEach(y=>y.fotos.forEach(f=>{f.jahr=y.jahr;all.push(f);}));
(await Promise.all(all.map(f=>loads(f.datei)))).forEach((d,i)=>{all[i].ok=!!d;if(d){all[i].w=d.w;all[i].h=d.h;}});
const alt=f=>f.alt||`Foto der Band aus ${f.jahr} [VEREIN KLÄREN: Alt-Text]`;

/* Offene Pfeilspitze (Winkelklammer), keine geschlossenen Dreiecke */
const chev=right=>`<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="26" height="26"><polyline points="${right?"9 4 17 12 9 20":"15 4 7 12 15 20"}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const arrows=(num,labelPrev,labelNext,attr)=>`<button type="button" class="arrow arrow-prev" ${attr}="${num?"-1":"prev"}" aria-label="${labelPrev}">${chev(false)}</button><button type="button" class="arrow arrow-next" ${attr}="${num?"1":"next"}" aria-label="${labelNext}">${chev(true)}</button>`;
const ICON_PAUSE=`<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14M16 5v14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`;
const ICON_PLAY=`<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>`;
const ICON_CLOSE=`<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="22" height="22"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`;

/* ---------- Diashow Startseite: endloses, zentriertes Karussell ---------- */
if(show){
  const MAXO=4,SC=[1,.76,.6,.48,.38];   /* sichtbare Nachbarn je Seite, Größe je Abstand zur Mitte */
  let ph=all.filter(f=>f.ok);
  for(let i=ph.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ph[i],ph[j]]=[ph[j],ph[i]];}
  ph=ph.slice(0,12);
  if(!ph.length){show.innerHTML="<p class=\"wrap\">Fotos folgen. [VEREIN KLÄREN: Bilder in assets/img/galerie/JAHR/ ablegen]</p>";}
  else{
    const N0=ph.length,many=N0>1;
    /* Bei wenigen Fotos wird die Reihe wiederholt, damit die Schleife links und rechts nie leer läuft */
    const M=many?N0*Math.ceil((2*MAXO+1)/N0):1;
    const slots=Array.from({length:M},(_,i)=>ph[i%N0]);
    show.innerHTML=`<div class="ss-wrap"><div class="ss" role="group" aria-roledescription="Karussell" aria-label="Fotos der Band" tabindex="0"><ul class="ss-track">${slots.map((f,i)=>`<li class="ss-slide" role="group" aria-roledescription="Folie" aria-label="Bild ${i%N0+1} von ${N0}"><img src="${esc(f.datei)}" alt="${esc(alt(f))}" width="${f.w}" height="${f.h}" draggable="false"></li>`).join("")}</ul></div>${many?arrows(false,"Vorheriges Foto","Nächstes Foto","data-act")+`<button type="button" class="ss-pause" data-act="play" aria-label="Diashow anhalten">${ICON_PAUSE}</button>`:""}</div><p class="sr-only" aria-live="off" data-status></p>`;
    const box=show.querySelector(".ss"),els=[...box.querySelectorAll(".ss-slide")],st=show.querySelector("[data-status]"),pb=show.querySelector(".ss-pause");
    let cur=0,timer=null,hovered=false,focused=false,playing=false,suppress=false;
    const half=Math.floor(M/2),hid=els.map(()=>true);

    const layout=()=>{
      const bw=box.clientWidth,bh=box.clientHeight,H=bh*.88,gap=Math.max(8,Math.round(H*.035));
      /* Größe je Foto: gleiche Höhe, Breite nach Seitenverhältnis, nie zugeschnitten */
      const dim=i=>{const f=slots[i],ar=f.w/f.h;let w=H*ar,h=H;const cap=bw*.7;if(w>cap){w=cap;h=cap/ar;}return{w,h};};
      /* Mittelpunkte der Nachbarn: überall gleicher Abstand, die Mitte bleibt zentriert */
      const cx={0:bw/2},d0=dim(cur);let eR=bw/2+d0.w/2,eL=bw/2-d0.w/2;
      for(let k=1;k<=MAXO&&M>1;k++){
        const wr=dim((cur+k)%M).w*SC[k],wl=dim((cur-k+M)%M).w*SC[k];
        cx[k]=eR+gap+wr/2;eR=cx[k]+wr/2;
        cx[-k]=eL-gap-wl/2;eL=cx[-k]-wl/2;
      }
      els.forEach((el,i)=>{
        const off=((i-cur+M+half)%M)-half,a=Math.abs(off),k=Math.min(a,MAXO),hidden=a>MAXO;
        const d=dim(i),s=SC[k],x=cx[off<0?-k:k];
        /* Sprung von einer ausgeblendeten Seite zur anderen ohne sichtbare Fahrt */
        el.classList.toggle("jump",hid[i]&&hidden);
        el.style.width=d.w+"px";el.style.height=d.h+"px";el.style.top=(bh-d.h)/2+"px";
        el.style.transform=`translate3d(${x-d.w/2}px,0,0) scale(${s})`;
        el.style.zIndex=20-a;el.dataset.d=Math.min(a,MAXO+1);el.dataset.off=off;
        el.classList.toggle("is-current",off===0);
        el.setAttribute("aria-hidden",String(off!==0));
        hid[i]=hidden;
      });
      st.textContent=`Bild ${cur%N0+1} von ${N0}`;
    };
    const settle=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>els.forEach(el=>el.classList.remove("jump"))));
    const go=d=>{if(M<2)return;cur=((cur+d)%M+M)%M;layout();};
    const play=on=>{playing=on;clearInterval(timer);
      if(on)timer=setInterval(()=>{if(!hovered&&!focused&&!document.hidden)go(1);},3500);
      if(pb){pb.innerHTML=on?ICON_PAUSE:ICON_PLAY;pb.setAttribute("aria-label",on?"Diashow anhalten":"Diashow abspielen");}
      st.setAttribute("aria-live",on?"off":"polite");};
    els.forEach(el=>el.classList.add("jump"));layout();settle();
    addEventListener("resize",()=>{els.forEach(el=>el.classList.add("jump"));layout();settle();});
    show.addEventListener("click",e=>{if(suppress)return;
      const b=e.target.closest("button");
      if(b){if(b.dataset.act==="prev")go(-1);else if(b.dataset.act==="next")go(1);else if(b.dataset.act==="play")play(!playing);return;}
      const li=e.target.closest(".ss-slide");if(li){const off=+li.dataset.off;if(off&&Math.abs(off)<=MAXO)go(off);}});
    box.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")go(-1);if(e.key==="ArrowRight")go(1);});
    let x0=null;box.addEventListener("pointerdown",e=>x0=e.clientX);
    box.addEventListener("pointerup",e=>{if(x0!==null&&Math.abs(e.clientX-x0)>50){suppress=true;setTimeout(()=>suppress=false,0);go(e.clientX<x0?1:-1);}x0=null;});
    show.addEventListener("pointerenter",()=>hovered=true);show.addEventListener("pointerleave",()=>hovered=false);
    show.addEventListener("focusin",()=>focused=true);show.addEventListener("focusout",()=>focused=false);
    play(!reduce&&many);
  }
}

/* ---------- Galerie nach Jahren ---------- */
if(gal){
  const lb=document.createElement("dialog");lb.className="lb";lb.setAttribute("aria-label","Großansicht");
  lb.innerHTML=`<div class="lb-stage"><img alt="" src="">${arrows(false,"Vorheriges Foto","Nächstes Foto","data-lb")}<button type="button" class="lb-close" data-lb="close" aria-label="Großansicht schließen">${ICON_CLOSE}</button></div><p class="lb-cap small"></p>`;
  document.body.append(lb);
  let list=[],idx=0;
  const view=()=>{const f=list[idx];const im=lb.querySelector("img");im.src=f.datei;im.alt=alt(f);lb.querySelector(".lb-cap").textContent=`${f.jahr}, Foto: ${f.urheber||"[VEREIN KLÄREN]"} (${idx+1} von ${list.length})`;
    lb.querySelectorAll(".arrow").forEach(a=>a.hidden=list.length<2);};
  const step=d=>{idx=(idx+d+list.length)%list.length;view();};
  lb.addEventListener("click",e=>{const b=e.target.closest("button");const a=b?.dataset.lb;if(a==="close"||e.target===lb)lb.close();if(a==="prev")step(-1);if(a==="next")step(1);});
  lb.addEventListener("keydown",e=>{if(list.length<2)return;if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1);});

  gal.innerHTML=[...years].sort((a,b)=>b.jahr-a.jahr).map(y=>{const fs=y.fotos.filter(f=>f.ok);
    return `<section class="yr" aria-labelledby="y${y.jahr}"><div class="yr-head"><h2 id="y${y.jahr}">${y.jahr}</h2></div>`+
    (fs.length?`<div class="yr-wrap"><ul class="yr-row" tabindex="0" aria-label="Fotos ${y.jahr}">${fs.map(f=>`<li><button type="button" class="thumb" data-y="${y.jahr}" data-f="${esc(f.datei)}"><img src="${esc(f.datei)}" width="480" height="320" loading="lazy" alt="${esc(alt(f))}"><span class="small">Foto: ${esc(f.urheber||"[VEREIN KLÄREN]")}</span></button></li>`).join("")}</ul>${arrows(true,`${y.jahr}: zurückblättern`,`${y.jahr}: weiterblättern`,"data-dir")}</div>`:`<p>Für ${y.jahr} sind noch keine Fotos hinterlegt.</p>`)+`</section>`;}).join("");

  /* Pfeile am Zeilenrand: ausgegraut am Anfang/Ende, ausgeblendet ohne Überlauf */
  const state=row=>{const w=row.parentElement,p=w.querySelector(".arrow-prev"),n=w.querySelector(".arrow-next");
    const over=row.scrollWidth>row.clientWidth+2;p.hidden=n.hidden=!over;
    p.setAttribute("aria-disabled",String(row.scrollLeft<=2));
    n.setAttribute("aria-disabled",String(row.scrollLeft+row.clientWidth>=row.scrollWidth-2));};
  const rows=[...gal.querySelectorAll(".yr-row")];
  rows.forEach(r=>{state(r);r.addEventListener("scroll",()=>state(r),{passive:true});});
  addEventListener("resize",()=>rows.forEach(state));

  gal.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    if(b.dataset.dir){if(b.getAttribute("aria-disabled")==="true")return;const row=b.closest(".yr-wrap").querySelector(".yr-row");row.scrollBy({left:b.dataset.dir*row.clientWidth*.8,behavior:reduce?"auto":"smooth"});}
    else if(b.dataset.f){list=all.filter(f=>f.ok&&f.jahr==b.dataset.y);idx=list.findIndex(f=>f.datei===b.dataset.f);view();lb.showModal();}});
}
})();
