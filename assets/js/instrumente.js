/* Dekorative Instrumente am Seitenrand.
   - Je Seite eine andere, kleine Auswahl (siehe PAGES).
   - Sie reagieren nur auf das Scrollen: Position und Neigung folgen wie schwere Dinge
     an Federn (leichtes Nachschwingen), einzelne Teile (Ventile, Klappen, Sticks) bewegen sich unregelmäßig.
   - Rein dekorativ: aria-hidden, nicht anklickbar, nicht fokussierbar.
   - Hinter dem Fußbereich (siehe CSS) und bei reduzierter Bewegung statisch. */
(()=>{
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const wide=document.body.classList.contains("wide");
const mid=document.body.classList.contains("mid");
const mq=matchMedia(wide?"(min-width:88rem)":mid?"(min-width:74rem)":"(min-width:62rem)");

/* ---------- Zeichenhilfen ---------- */
const S=(vb,inner)=>`<svg viewBox="${vb}" aria-hidden="true" focusable="false">${inner}</svg>`;
const lg=(id,stops,vert)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${vert?0:1}" y2="${vert?1:0}">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
const RED=[[0,"#e2475f"],[.45,"#c8102e"],[1,"#8f0b21"]];
const METAL=[[0,"#ffffff"],[.5,"#e2e2e2"],[1,"#b0b0b0"]];
const DARK=[[0,"#5c5c5c"],[.4,"#333"],[1,"#171717"]];
/* Rohr mit Licht (oben links) und Schatten (unten rechts): wirkt rund statt flach */
const tube=(id,d,w)=>`<path id="${id}" class="s-red" d="${d}" style="stroke-width:${w}"/><use href="#${id}" class="s-hi" style="stroke-width:${(w*.3).toFixed(1)}" transform="translate(${(-w*.18).toFixed(1)},${(-w*.14).toFixed(1)})"/><use href="#${id}" class="s-lo" style="stroke-width:${(w*.16).toFixed(1)}" transform="translate(${(w*.3).toFixed(1)},${(w*.2).toFixed(1)})"/>`;
const valveStem=(id,x,n,y0,y1)=>`<g class="p-valve v${n}"><line x1="${x}" y1="${y0+3}" x2="${x}" y2="${y1}" stroke="#bdbdbd" stroke-width="3" stroke-linecap="round"/><circle cx="${x}" cy="${y0}" r="4.6" fill="url(#${id})" stroke="#8c8c8c" stroke-width="1"/></g>`;
const casing=(id,x,y,h)=>`<rect x="${x-4.5}" y="${y}" width="9" height="${h}" rx="3" fill="url(#${id})" stroke="#8c8c8c" stroke-width="1.2"/>`;

/* ---------- Instrumente ---------- */
const GITARRE=()=>S("0 0 80 220",
`<defs>${lg("gb",[[0,"#9a0c25"],[.35,"#d4203d"],[.65,"#c8102e"],[1,"#8f0b21"]])}${lg("gn",[[0,"#9a9a9a"],[.5,"#d8d8d8"],[1,"#888"]])}</defs>
<rect x="35" y="22" width="10" height="82" fill="url(#gn)"/>
<g stroke="#5c5c5c" stroke-width=".8">${[34,44,54,63,72,80,88,95].map(y=>`<line x1="35" x2="45" y1="${y}" y2="${y}"/>`).join("")}</g>
<path d="M31 3H49L47 26H33Z" fill="#2e2e2e" stroke="#8c8c8c" stroke-width="1"/>
<g fill="#ececec">${[7,14,21].map(y=>`<circle cx="28" cy="${y}" r="2.1"/><circle cx="52" cy="${y}" r="2.1"/>`).join("")}</g>
<path d="M40 98C14 98 8 122 22 136C4 148 4 190 40 208C76 190 76 148 58 136C72 122 66 98 40 98Z" fill="url(#gb)" stroke="#6f0a1a" stroke-width="2"/>
<path class="hl" d="M22 112C16 120 15 130 24 138"/><path class="hl" d="M15 160C13 172 17 186 26 194"/>
<circle cx="40" cy="156" r="11.5" fill="#171717"/><circle cx="40" cy="156" r="14" fill="none" stroke="#ececec" stroke-width="1.6"/><circle cx="40" cy="156" r="16" fill="none" stroke="#6f0a1a" stroke-width="1.2"/>
<rect x="28" y="180" width="24" height="6" rx="2" fill="#2e2e2e"/><line x1="30" x2="50" y1="181.6" y2="181.6" stroke="#ececec" stroke-width="1.2"/>
<g class="p-strings" stroke="#ececec" stroke-width=".8" opacity=".95">${[0,1,2,3,4,5].map(i=>`<line x1="${36.4+i*1.4}" y1="24" x2="${32.5+i*3}" y2="181.6"/>`).join("")}</g>`);

const TROMPETE=()=>S("0 0 220 100",
`<defs>${lg("tb",RED,true)}${lg("tm",METAL,true)}</defs>
<path d="M148 51C168 50 190 40 207 12Q221 54 207 96C190 68 168 58 148 57Z" fill="url(#tb)"/>
<path class="hl" d="M156 51C172 49 190 40 203 20"/>
${tube("t1","M20 54H152",5)}
${tube("t2","M34 54C16 54 16 70 34 70H138C148 70 152 64 154 58",5)}
${tube("t3","M46 54V38H76V54",4)}
<ellipse cx="211" cy="54" rx="7.5" ry="42" fill="none" stroke="#ececec" stroke-width="2.5"/>
${valveStem("tm",90,1,24,42)}${valveStem("tm",103,2,24,42)}${valveStem("tm",116,3,24,42)}
${casing("tm",90,40,40)}${casing("tm",103,40,40)}${casing("tm",116,40,40)}
<path d="M2 49H14L20 52V56L14 59H2Z" fill="url(#tm)" stroke="#8c8c8c" stroke-width="1.2"/>`);

const SNARE=()=>S("0 0 120 100",
`<defs>${lg("sm",[[0,"#b4b4b4"],[.3,"#f6f6f6"],[.7,"#d4d4d4"],[1,"#9a9a9a"]])}${lg("sb",[[0,"#8f0b21"],[.4,"#d4203d"],[1,"#8f0b21"]])}</defs>
<path d="M14 40V74Q60 92 106 74V40Z" fill="url(#sm)" stroke="#8c8c8c" stroke-width="1.5"/>
<path d="M14 51Q60 67 106 51V63Q60 79 14 63Z" fill="url(#sb)"/>
<g fill="#8c8c8c">${[26,46,74,94].map(x=>`<rect x="${x-2}" y="${x<60?44:44}" width="4" height="13" rx="1.5"/>`).join("")}</g>
<path d="M14 74Q60 92 106 74" fill="none" stroke="#8c8c8c" stroke-width="3"/>
<ellipse cx="60" cy="40" rx="46" ry="14" fill="#f7f7f7" stroke="#8c8c8c" stroke-width="3"/>
<ellipse cx="60" cy="40" rx="38" ry="10.5" fill="none" stroke="#d0d0d0" stroke-width="1.2"/>
<g class="p-stL"><line x1="22" y1="0" x2="54" y2="30" stroke="#9a9a9a" stroke-width="4.2" stroke-linecap="round"/><circle cx="54.5" cy="30.5" r="3.2" fill="#ececec" stroke="#8c8c8c" stroke-width="1"/></g>
<g class="p-stR"><line x1="98" y1="0" x2="66" y2="30" stroke="#9a9a9a" stroke-width="4.2" stroke-linecap="round"/><circle cx="65.5" cy="30.5" r="3.2" fill="#ececec" stroke="#8c8c8c" stroke-width="1"/></g>`);

const HIHAT=()=>S("0 0 100 170",
`<defs>${lg("hm",[[0,"#f7f7f7"],[.5,"#d9d9d9"],[1,"#a6a6a6"]],true)}${lg("hr",RED,true)}</defs>
<path d="M50 150L24 166M50 150L76 166M50 150V167" fill="none" stroke="#8c8c8c" stroke-width="3.5" stroke-linecap="round"/>
<line x1="50" y1="34" x2="50" y2="150" stroke="#8c8c8c" stroke-width="3.5"/>
<path d="M32 164H68L73 168H27Z" fill="#2e2e2e"/>
<ellipse cx="50" cy="42" rx="42" ry="7" fill="url(#hm)" stroke="#8c8c8c" stroke-width="1.2"/>
<ellipse cx="50" cy="42" rx="30" ry="4.6" fill="none" stroke="#bdbdbd" stroke-width=".8"/>
<g class="p-hh"><ellipse cx="50" cy="28" rx="42" ry="7" fill="url(#hm)" stroke="#8c8c8c" stroke-width="1.2"/><ellipse cx="50" cy="28" rx="30" ry="4.6" fill="none" stroke="#bdbdbd" stroke-width=".8"/><ellipse cx="50" cy="24.5" rx="9" ry="4" fill="url(#hr)"/></g>`);

const SAXOPHON=()=>S("0 0 110 230",
`<defs>${lg("sr",RED)}${lg("sm2",METAL,true)}</defs>
${tube("x1","M26 16C44 10 49 22 49 36",8)}
<path d="M6 26L22 14" stroke="#2e2e2e" stroke-width="9" stroke-linecap="round"/><path d="M10 21L19 15" stroke="#8c8c8c" stroke-width="10" stroke-linecap="round" opacity=".5"/>
${tube("x2","M49 36V152C49 198 92 198 92 160V138",13)}
<path d="M84 140H100L109 107Q92 100 75 107Z" fill="url(#sr)"/>
<path d="M73 107Q92 98 111 107" fill="none" stroke="#ececec" stroke-width="2.6" stroke-linecap="round"/>
<g stroke="#8c8c8c" stroke-width="1.6">${[60,80,100,120,140].map(y=>`<line x1="49" y1="${y}" x2="56" y2="${y}"/>`).join("")}</g>
<g>${[[60,"a"],[80,"b"],[100,"c"],[120,"a"],[140,"b"]].map(([y,c])=>`<circle class="p-key ${c}" cx="59" cy="${y}" r="4.6" fill="url(#sm2)" stroke="#8c8c8c" stroke-width="1"/>`).join("")}</g>`);

const KLARINETTE=()=>S("0 0 50 240",
`<defs>${lg("kd",DARK)}</defs>
<path d="M21 3H29L31 24H19Z" fill="url(#kd)" stroke="#8c8c8c" stroke-width="1"/>
<rect x="19.5" y="14" width="11" height="7" rx="1.5" fill="#bdbdbd"/>
<rect x="17" y="24" width="16" height="14" rx="2" fill="url(#kd)" stroke="#8c8c8c" stroke-width="1"/>
<rect x="18" y="38" width="14" height="70" rx="2" fill="url(#kd)" stroke="#8c8c8c" stroke-width="1"/>
<rect x="18" y="112" width="14" height="76" rx="2" fill="url(#kd)" stroke="#8c8c8c" stroke-width="1"/>
<g fill="#d9d9d9" stroke="#8c8c8c" stroke-width=".8"><rect x="16.5" y="35" width="17" height="4" rx="1"/><rect x="16.5" y="107" width="17" height="6" rx="1"/><rect x="16.5" y="186" width="17" height="4" rx="1"/></g>
<path d="M18 190L8 218Q25 227 42 218L32 190Z" fill="url(#kd)" stroke="#8c8c8c" stroke-width="1"/>
<line x1="21.5" y1="42" x2="21.5" y2="184" stroke="#fff" stroke-width="1.4" opacity=".25" stroke-linecap="round"/>
<g fill="#d9d9d9" stroke="#8c8c8c" stroke-width=".8"><rect x="12" y="78" width="6" height="4" rx="2"/><rect x="32" y="134" width="6" height="4" rx="2"/></g>
<g>${[[54,"a"],[74,"b"],[94,"c"],[126,"b"],[146,"c"],[166,"a"]].map(([y,c])=>`<circle class="p-key ${c}" cx="25" cy="${y}" r="3.6" fill="#ececec" stroke="#8c8c8c" stroke-width=".9"/>`).join("")}</g>`);

const TENORHORN=()=>S("0 0 130 150",
`<defs>${lg("hb",RED)}${lg("hm2",METAL,true)}</defs>
<path d="M82 58C92 44 100 30 104 12Q120 10 128 30C118 42 108 56 94 70Z" fill="url(#hb)"/>
<path d="M104 12Q120 10 128 30" fill="none" stroke="#ececec" stroke-width="2.6" stroke-linecap="round"/>
${tube("h1","M14 90a44 44 0 1 0 88 0a44 44 0 1 0 -88 0",7)}
${tube("h2","M28 90a30 30 0 1 0 60 0a30 30 0 1 0 -60 0",5)}
${tube("h3","M16 84C4 62 14 36 34 28",5)}
<path d="M34 28L46 22" stroke="#8c8c8c" stroke-width="6" stroke-linecap="round"/>
${valveStem("hm2",52,1,26,46)}${valveStem("hm2",65,2,26,46)}${valveStem("hm2",78,3,26,46)}
${casing("hm2",52,44,32)}${casing("hm2",65,44,32)}${casing("hm2",78,44,32)}`);

const BECKEN=()=>S("0 0 130 170",
`<defs>${lg("cm",[[0,"#f9f9f9"],[.5,"#d6d6d6"],[1,"#a3a3a3"]],true)}${lg("cr",RED,true)}</defs>
<path d="M65 150L36 166M65 150L94 166M65 150V168" fill="none" stroke="#8c8c8c" stroke-width="3.5" stroke-linecap="round"/>
<line x1="65" y1="40" x2="65" y2="150" stroke="#8c8c8c" stroke-width="3.5"/>
<g class="p-cym"><ellipse cx="65" cy="34" rx="58" ry="11" fill="url(#cm)" stroke="#8c8c8c" stroke-width="1.2"/>
<ellipse cx="65" cy="34" rx="46" ry="8.6" fill="none" stroke="#bdbdbd" stroke-width=".8"/><ellipse cx="65" cy="34" rx="34" ry="6.2" fill="none" stroke="#bdbdbd" stroke-width=".8"/>
<ellipse cx="65" cy="30" rx="13" ry="6.5" fill="url(#cr)" stroke="#8f0b21" stroke-width="1"/><path class="hl" d="M12 33Q30 24 52 22"/></g>
<rect x="61" y="38" width="8" height="5" rx="1.5" fill="#2e2e2e"/>`);

/* Grunddaten: w/h in rem, rot Grundneigung (Grad), R Schwankung, A Auslenkung in px,
   f Scroll-Tempo, ph Phase, resp Federzeit in s (verschieden, damit nichts im Gleichtakt schwingt) */
const LIB={
 "Gitarre":   {w:3.2,h:8.8,rot:-8, R:7, A:26,f:1.0,ph:.2, resp:.75,svg:GITARRE},
 "Trompete":  {w:6.2,h:2.8,rot:-64,R:8, A:30,f:.8, ph:1.7,resp:.62,svg:TROMPETE},
 "Snare":     {w:5.4,h:4.5,rot:-6, R:5, A:22,f:1.2,ph:3.1,resp:.5, svg:SNARE},
 "Hi-Hat":    {w:3.8,h:6.4,rot:5,  R:4, A:24,f:.9, ph:4.4,resp:.68,svg:HIHAT},
 "Saxophon":  {w:3.8,h:8.0,rot:8,  R:7, A:28,f:.9, ph:.9, resp:.8, svg:SAXOPHON},
 "Klarinette":{w:1.9,h:9.0,rot:12, R:6, A:26,f:1.1,ph:2.4,resp:.7, svg:KLARINETTE},
 "Tenorhorn": {w:5.0,h:5.8,rot:0,  R:12,A:24,f:.8, ph:3.8,resp:.58,svg:TENORHORN},
 "Becken":    {w:5.4,h:7.0,rot:-4, R:4, A:22,f:1.0,ph:5.2,resp:.55,svg:BECKEN}
};
/* Auswahl je Seite: [Instrument, Seite l/r, Position oben in %, Größenfaktor] */
const PAGES={
 "index":      [["Gitarre","l",13,1],["Trompete","l",40,1],["Snare","l",68,.95],["Saxophon","r",12,1],["Tenorhorn","r",42,1.05],["Becken","r",72,.95]],
 "die-band":   [["Klarinette","l",14,1.05],["Hi-Hat","l",62,1],["Trompete","r",16,1.05],["Gitarre","r",44,.95],["Snare","r",76,1]],
 "termine":    [["Saxophon","l",12,1],["Tenorhorn","l",46,.95],["Hi-Hat","l",76,1],["Gitarre","r",14,1],["Snare","r",58,1.05]],
 "galerie":    [["Trompete","l",14,1],["Becken","l",56,1],["Klarinette","r",12,1],["Tenorhorn","r",46,1],["Snare","r",76,1]],
 "kontakt":    [["Gitarre","l",16,1.05],["Saxophon","l",54,.95],["Trompete","r",16,1],["Hi-Hat","r",50,1.05],["Becken","r",76,.95]],
 "impressum":  [["Klarinette","l",18,1],["Becken","l",62,.95],["Gitarre","r",20,.95],["Hi-Hat","r",58,1]],
 "datenschutz":[["Snare","l",16,1],["Saxophon","l",52,1],["Tenorhorn","r",22,1],["Klarinette","r",60,1]]
};
const page=((location.pathname.split("/").pop()||"index").replace(/\.html?$/,""))||"index";
const pick=PAGES[page]||PAGES.index;

const ITEMS=pick.map(([n,side,top,sc],i)=>{const b=LIB[n];
  return {...b,n,side,top,sc,rot:(side==="r"&&Math.abs(b.rot)<30)?-b.rot:b.rot,dir:side==="l"?1:-1,
          ph:b.ph+i*.37,svg:b.svg()};});

const deco=document.createElement("div");
deco.className="deco";deco.setAttribute("aria-hidden","true");
ITEMS.forEach(it=>{
  const el=document.createElement("div");
  el.className=`inst inst--${it.side}`;
  el.style.setProperty("--w",(it.w*it.sc).toFixed(2)+"rem");el.style.setProperty("--h",(it.h*it.sc).toFixed(2)+"rem");el.style.top=it.top+"%";
  el.innerHTML=it.svg;deco.append(el);it.el=el;
  it.s={y:0,vy:0,r:it.rot,vr:0,k1:.5,k2:.5,k3:.5};
});
document.body.append(deco);

/* ---------- Bewegung ---------- */
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
/* Unregelmäßiges Greifen: zwei überlagerte Wellen, die meist offen oder meist gedrückt stehen */
const tap=u=>clamp((Math.sin(u)+.55*Math.sin(u*2.3+1.3)+.15)*1.1,0,1);
const target=(it,sy,sway)=>{
  const t=sy*0.0042*it.f+it.ph,u=sy*0.011*it.f+it.ph*2;
  return {y:Math.sin(t)*it.A, r:it.rot+Math.sin(t*1.35+1)*it.R+sway*it.dir,
          k1:tap(u), k2:tap(u+1.9), k3:tap(u+3.8)};
};
const apply=it=>{const s=it.s,e=it.el.style;
  e.transform=`translate3d(0,${s.y.toFixed(1)}px,0) rotate(${s.r.toFixed(1)}deg)`;
  e.setProperty("--k1",s.k1.toFixed(3));e.setProperty("--k2",s.k2.toFixed(3));e.setProperty("--k3",s.k3.toFixed(3));};

ITEMS.forEach(it=>{Object.assign(it.s,target(it,scrollY,0));apply(it);});
if(reduce)return;   /* bei reduzierter Bewegung bleiben die Instrumente statisch */

/* Federn mit leichtem Nachschwingen: Position gedämpft, Neigung etwas schwingfreudiger.
   Die Neigung bekommt zusätzlich einen Schubs aus der Scrollgeschwindigkeit (wie ein Anstoßen). */
const spring=(s,x,v,tgt,dt,w,z)=>{s[v]+=(-2*z*w*s[v]-w*w*(s[x]-tgt))*dt;s[x]+=s[v]*dt;};
let raf=0,last=0,lastY=scrollY,vel=0;
const tick=now=>{raf=0;if(!mq.matches){last=0;return;}
  const dt=last?Math.min(.033,(now-last)/1000):.016;last=now;
  const sy=scrollY;vel=vel*.8+((sy-lastY)/Math.max(dt,.001))*.2;lastY=sy;
  const sway=clamp(vel*.0035,-9,9);
  let moving=Math.abs(vel)>4;
  ITEMS.forEach(it=>{const t=target(it,sy,sway),s=it.s,w=6.283/it.resp;
    spring(s,"y","vy",t.y,dt,w,.85);
    spring(s,"r","vr",t.r,dt,w*1.1,.45);
    for(const k of ["k1","k2","k3"])s[k]+=(t[k]-s[k])*.22;
    if(Math.abs(s.vy)>.05||Math.abs(s.vr)>.03||Math.abs(s.y-t.y)>.1||Math.abs(s.r-t.r)>.05||Math.abs(s.k1-t.k1)>.004||Math.abs(s.k2-t.k2)>.004||Math.abs(s.k3-t.k3)>.004)moving=true;
    apply(it);});
  if(moving)raf=requestAnimationFrame(tick);else last=0;};
addEventListener("scroll",()=>{if(!raf)raf=requestAnimationFrame(tick);},{passive:true});
})();
