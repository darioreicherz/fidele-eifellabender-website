/* Dekorative Instrumente am Seitenrand. Sie reagieren nur auf das Scrollen
   (Position, Neigung und einzelne Teile wie Ventile, Klappen, Sticks).
   Rein dekorativ: aria-hidden, nicht anklickbar, nicht fokussierbar. */
(()=>{
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const wide=document.body.classList.contains("wide");
const mq=matchMedia(wide?"(min-width:88rem)":"(min-width:62rem)");

const S=(vb,inner)=>`<svg viewBox="${vb}" aria-hidden="true" focusable="false">${inner}</svg>`;
const valve=(x,n,y0)=>`<g class="p-valve v${n}"><line class="s-light t3" x1="${x}" y1="${y0+4}" x2="${x}" y2="${y0+20}"/><circle class="f-light" cx="${x}" cy="${y0}" r="5"/></g>`;

const GITARRE=S("0 0 80 220",
`<rect class="f-gray" x="35" y="20" width="10" height="84" rx="2"/>
<path class="f-red" d="M40 98C14 98 8 122 22 136C4 148 4 190 40 208C76 190 76 148 58 136C72 122 66 98 40 98Z"/>
<rect class="f-red" x="31" y="2" width="18" height="24" rx="4"/>
<circle class="f-light" cx="27" cy="8" r="2.4"/><circle class="f-light" cx="27" cy="18" r="2.4"/><circle class="f-light" cx="53" cy="8" r="2.4"/><circle class="f-light" cx="53" cy="18" r="2.4"/>
<circle class="f-dark" cx="40" cy="156" r="11"/>
<rect class="f-dark" x="29" y="178" width="22" height="6" rx="2"/>
<g class="p-strings"><line class="s-light t1" x1="37" y1="24" x2="35" y2="181"/><line class="s-light t1" x1="39" y1="24" x2="38" y2="181"/><line class="s-light t1" x1="41" y1="24" x2="42" y2="181"/><line class="s-light t1" x1="43" y1="24" x2="45" y2="181"/></g>`);

const TROMPETE=S("0 0 220 100",
`<path class="s-gray t7" d="M8 56H22"/>
<path class="s-red t6" d="M22 56H154"/>
<path class="s-red t6" d="M50 56C50 12 136 12 136 56"/>
<path class="f-red" d="M150 56L206 18Q218 56 206 94Z"/>
<ellipse class="s-light t3" cx="209" cy="56" rx="8" ry="38"/>
${valve(72,1,40)}${valve(92,2,40)}${valve(112,3,40)}
<rect class="f-light o-gray" x="66" y="56" width="12" height="26" rx="3"/><rect class="f-light o-gray" x="86" y="56" width="12" height="26" rx="3"/><rect class="f-light o-gray" x="106" y="56" width="12" height="26" rx="3"/>`);

const SNARE=S("0 0 120 100",
`<path class="f-light o-gray" d="M14 40V76Q60 94 106 76V40Z"/>
<path class="s-red t5" d="M14 54Q60 70 106 54"/>
<ellipse class="f-light o-gray" cx="60" cy="40" rx="46" ry="14"/>
<line class="s-gray t5 p-stL" x1="22" y1="0" x2="54" y2="30"/>
<line class="s-gray t5 p-stR" x1="98" y1="0" x2="66" y2="30"/>`);

const HIHAT=S("0 0 100 170",
`<line class="s-gray t4" x1="50" y1="30" x2="50" y2="150"/>
<path class="s-gray t4" d="M50 150L22 166M50 150L78 166M50 150V168"/>
<ellipse class="f-light o-gray" cx="50" cy="40" rx="42" ry="7"/>
<g class="p-hh"><ellipse class="f-light o-gray" cx="50" cy="28" rx="42" ry="7"/><ellipse class="f-red" cx="50" cy="25" rx="9" ry="4"/></g>`);

const SAXOPHON=S("0 0 110 230",
`<path class="s-gray t7" d="M8 24L24 12"/>
<path class="s-red t9" d="M24 12C42 8 48 20 48 34"/>
<path class="s-red t12" d="M48 34V150C48 200 90 200 90 160V140"/>
<path class="f-red" d="M82 140H98L108 110H72Z"/>
<path class="s-light t3" d="M72 110H108"/>
<g class="keys"><circle class="p-key a f-light" cx="48" cy="62" r="5"/><circle class="p-key b f-light" cx="48" cy="82" r="5"/><circle class="p-key c f-light" cx="48" cy="102" r="5"/><circle class="p-key a f-light" cx="48" cy="122" r="5"/><circle class="p-key b f-light" cx="48" cy="142" r="5"/></g>`);

const KLARINETTE=S("0 0 50 240",
`<path class="f-red" d="M20 4H30L32 22H18Z"/>
<rect class="f-gray" x="17" y="22" width="16" height="14"/>
<rect class="f-dark o-gray" x="18" y="36" width="14" height="150" rx="3"/>
<path class="f-dark o-gray" d="M18 186L8 218Q25 226 42 218L32 186Z"/>
<g class="keys"><circle class="p-key a f-light" cx="25" cy="56" r="4"/><circle class="p-key b f-light" cx="25" cy="76" r="4"/><circle class="p-key c f-light" cx="25" cy="96" r="4"/><circle class="p-key a f-red" cx="25" cy="116" r="4"/><circle class="p-key b f-light" cx="25" cy="136" r="4"/><circle class="p-key c f-light" cx="25" cy="156" r="4"/></g>`);

const TENORHORN=S("0 0 130 150",
`<circle class="s-red t6" cx="58" cy="90" r="44"/>
<circle class="s-red t5" cx="58" cy="90" r="30"/>
<path class="f-red" d="M84 58L106 14L130 28L108 72Z"/>
<path class="s-light t3" d="M106 14L130 28"/>
<path class="s-gray t6" d="M14 82C4 58 16 34 34 28L44 24"/>
${valve(44,1,34)}${valve(58,2,34)}${valve(72,3,34)}
<rect class="f-light o-gray" x="39" y="50" width="10" height="22" rx="3"/><rect class="f-light o-gray" x="53" y="50" width="10" height="22" rx="3"/><rect class="f-light o-gray" x="67" y="50" width="10" height="22" rx="3"/>`);

const BECKEN=S("0 0 130 170",
`<line class="s-gray t4" x1="65" y1="40" x2="65" y2="150"/>
<path class="s-gray t4" d="M65 150L36 166M65 150L94 166M65 150V168"/>
<g class="p-cym"><ellipse class="f-light o-red" cx="65" cy="34" rx="58" ry="11"/><path class="s-red t2" d="M20 36Q65 47 110 36"/><ellipse class="f-red" cx="65" cy="30" rx="13" ry="6"/></g>`);

/* side: l/r, top in %, w/h in rem, rot: Grundneigung, R: Schwankung in Grad,
   A: Auslenkung in px, f: Scroll-Tempo, ph: Phase */
const ITEMS=[
 {n:"Gitarre",  side:"l",top:12,w:3.2,h:8.8,rot:-8, R:9, A:30,f:1.0,ph:0.2,svg:GITARRE},
 {n:"Trompete", side:"l",top:36,w:6.2,h:2.8,rot:-64,R:10,A:34,f:0.8,ph:1.7,svg:TROMPETE},
 {n:"Snare",    side:"l",top:58,w:5.4,h:4.5,rot:-6, R:6, A:26,f:1.2,ph:3.1,svg:SNARE},
 {n:"Hi-Hat",   side:"l",top:78,w:3.8,h:6.4,rot:5,  R:5, A:28,f:0.9,ph:4.4,svg:HIHAT},
 {n:"Saxophon", side:"r",top:11,w:3.8,h:8.0,rot:8,  R:9, A:32,f:0.9,ph:0.9,svg:SAXOPHON},
 {n:"Klarinette",side:"r",top:37,w:1.9,h:9.0,rot:14, R:8, A:30,f:1.1,ph:2.4,svg:KLARINETTE},
 {n:"Tenorhorn",side:"r",top:57,w:5.0,h:5.8,rot:0,  R:16,A:28,f:0.8,ph:3.8,svg:TENORHORN},
 {n:"Becken",   side:"r",top:76,w:5.4,h:7.0,rot:-4, R:5, A:26,f:1.0,ph:5.2,svg:BECKEN}
];

const deco=document.createElement("div");
deco.className="deco";deco.setAttribute("aria-hidden","true");
ITEMS.forEach(it=>{
  const el=document.createElement("div");
  el.className=`inst inst--${it.side}`;
  el.style.setProperty("--w",it.w+"rem");el.style.setProperty("--h",it.h+"rem");el.style.top=it.top+"%";
  el.innerHTML=it.svg;deco.append(el);it.el=el;
  it.s={y:0,r:it.rot,k1:.5,k2:.5,k3:.5};
});
document.body.append(deco);

const target=(it,sy)=>{
  const t=sy*0.0042*it.f+it.ph,u=sy*0.011*it.f+it.ph*2;
  return {y:Math.sin(t)*it.A, r:it.rot+Math.sin(t*1.35+1)*it.R,
          k1:.5+.5*Math.sin(u), k2:.5+.5*Math.sin(u+1.9), k3:.5+.5*Math.sin(u+3.8)};
};
const apply=it=>{const s=it.s,e=it.el.style;
  e.transform=`translate3d(0,${s.y.toFixed(1)}px,0) rotate(${s.r.toFixed(1)}deg)`;
  e.setProperty("--k1",s.k1.toFixed(3));e.setProperty("--k2",s.k2.toFixed(3));e.setProperty("--k3",s.k3.toFixed(3));};

/* Startzustand ohne Sprung */
ITEMS.forEach(it=>{Object.assign(it.s,target(it,scrollY));apply(it);});
if(reduce)return;   /* bei reduzierter Bewegung bleiben die Instrumente statisch */

/* Weiches Nachziehen (gedämpft, ohne Überschwingen), jederzeit unterbrechbar */
let raf=0;
const tick=()=>{raf=0;if(!mq.matches)return;
  const sy=scrollY;let moving=false;
  ITEMS.forEach(it=>{const t=target(it,sy),s=it.s;
    for(const k in t){const d=t[k]-s[k];s[k]+=d*0.16;if(Math.abs(d)>0.004)moving=true;}
    apply(it);});
  if(moving)raf=requestAnimationFrame(tick);};
addEventListener("scroll",()=>{if(!raf)raf=requestAnimationFrame(tick);},{passive:true});
})();
