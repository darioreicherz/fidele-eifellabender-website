/* Geführtes Anfrageformular: ohne JavaScript sind alle Schritte untereinander sichtbar und das Formular lässt sich normal absenden */
(()=>{
const form=document.getElementById("anfrage-form");if(!form)return;
const steps=[...form.querySelectorAll("fieldset[data-step]")];
const nav=form.querySelector("[data-nav]"),back=form.querySelector("[data-back]"),next=form.querySelector("[data-next]");
const prog=form.querySelector("[data-progress]"),label=form.querySelector("[data-step-label]"),bar=form.querySelector(".bar span");
const status=form.querySelector("[data-status]"),sum=form.querySelector("[data-summary]");
const other=form.querySelector("[data-other]"),sonst=form.elements.fest_sonst;
const N=steps.length;let cur=0;

form.classList.add("js");nav.hidden=false;prog.hidden=false;
form.elements.t.value=Date.now();
const d=new Date();const iso=new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
form.elements.datum.min=iso;

const val=n=>(form.elements[n]&&form.elements[n].value||"").trim();
const fmtDate=s=>s?new Date(s+"T12:00:00").toLocaleDateString("de-DE",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}):"";

/* Vorauswahl über ?fest=… */
const q=new URLSearchParams(location.search).get("fest");
if(q){const r=[...form.elements.fest].find(x=>x.value.toLowerCase().startsWith(q.toLowerCase()));if(r)r.checked=true;}
const syncOther=()=>{const o=val("fest")==="Anderes Fest";other.hidden=!o;sonst.required=false;};
form.addEventListener("change",e=>{if(e.target.name==="fest")syncOther();});syncOther();

/* Prüfung je Schritt */
const rules={
1:()=>val("fest")?[]:[["fest","Bitte wählen Sie eine Festart."]],
2:()=>{const e=[];const dv=val("datum");
  if(!dv)e.push(["datum","Bitte wählen Sie ein Datum."]);else if(dv<iso)e.push(["datum","Das Datum liegt in der Vergangenheit."]);
  if(!val("beginn"))e.push(["beginn","Bitte wählen Sie eine Beginnzeit."]);
  if(!val("dauer"))e.push(["dauer","Bitte wählen Sie die Spieldauer."]);return e;},
3:()=>{const e=[];if(!/^\d{5}$/.test(val("plz")))e.push(["plz","Bitte geben Sie eine fünfstellige Postleitzahl ein."]);
  if(!val("ort"))e.push(["ort","Bitte geben Sie den Ort an."]);return e;},
4:()=>{const e=[];if(!val("name"))e.push(["name","Bitte geben Sie Ihren Namen an."]);
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val("email")))e.push(["email","Bitte geben Sie eine gültige E-Mail-Adresse an."]);return e;},
5:()=>form.elements.datenschutz.checked?[]:[["datenschutz","Bitte stimmen Sie der Datenschutzerklärung zu."]]
};
function field(n){const f=form.elements[n];return f&&f.length&&!f.tagName?f[0]:f;}
function check(i){
  const fs=steps[i],box=fs.querySelector(".err");
  fs.querySelectorAll("[aria-invalid]").forEach(x=>x.removeAttribute("aria-invalid"));
  const errs=rules[i+1]();
  if(!errs.length){box.hidden=true;box.textContent="";return true;}
  errs.forEach(([n])=>{const f=field(n);if(f)f.setAttribute("aria-invalid","true");});
  box.textContent=errs.map(x=>x[1]).join(" ");box.hidden=false;
  const f=field(errs[0][0]);if(f)f.focus();
  return false;
}

function summary(){
  const fest=val("fest")==="Anderes Fest"&&val("fest_sonst")?"Anderes Fest: "+val("fest_sonst"):val("fest");
  const rows=[["Festart",fest,1],["Termin",fmtDate(val("datum"))+(val("beginn")?", "+val("beginn"):""),2],["Spieldauer",val("dauer"),2],
   ["Ort",(val("plz")+" "+val("ort")).trim()+(val("location")?" ("+val("location")+")":""),3],["Umgebung",val("umgebung"),3],["Gäste",val("gaeste"),3],
   ["Name",val("name"),4],["E-Mail",val("email"),4],["Telefon",val("tel"),4],["Nachricht",val("nachricht"),4]].filter(r=>r[1]);
  sum.textContent="";
  rows.forEach(([k,v,s])=>{
    const dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=k;dd.textContent=v;
    const b=document.createElement("button");b.type="button";b.className="linklike";b.textContent="Ändern";b.setAttribute("aria-label",k+" ändern");
    b.addEventListener("click",()=>show(s-1));dd.append(" ",b);sum.append(dt,dd);
  });
  return rows;
}

function show(i,focus=true){
  cur=i;
  steps.forEach((s,j)=>{s.hidden=j!==i;});
  label.textContent="Schritt "+(i+1)+" von "+N;bar.style.width=((i+1)/N*100)+"%";
  back.hidden=i===0;next.hidden=i===N-1;
  if(i===N-1)summary();
  status.textContent="";
  if(focus){const l=steps[i].querySelector("legend");l.tabIndex=-1;l.focus();}
}
next.addEventListener("click",()=>{if(check(cur))show(cur+1);});
back.addEventListener("click",()=>{if(cur>0)show(cur-1);});
/* Enter in einem Feld geht zum nächsten Schritt statt abzusenden */
form.addEventListener("keydown",e=>{if(e.key==="Enter"&&cur<N-1&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="BUTTON"){e.preventDefault();next.click();}});
show(0,false);

form.addEventListener("submit",async e=>{
  e.preventDefault();
  for(let i=0;i<N;i++){if(!check(i)){show(i,false);check(i);return;}}
  const btn=form.querySelector("button[type=submit]");btn.disabled=true;status.textContent="Anfrage wird gesendet …";
  try{
    const r=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});
    const j=await r.json().catch(()=>({}));
    if(!r.ok||!j.ok)throw 0;
    form.innerHTML='<div class="done" tabindex="-1"><h3>Vielen Dank!</h3><p>Ihre Anfrage ist bei uns eingegangen. Wir melden uns so bald wie möglich bei Ihnen.</p></div>';
    form.querySelector(".done").focus();
  }catch(_){
    const rows=summary();
    const body="Buchungsanfrage\n\n"+rows.map(r=>r[0]+": "+r[1]).join("\n");
    status.textContent="";
    status.innerHTML='Das Senden hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder schreiben Sie uns direkt: <a></a>';
    const a=status.querySelector("a");a.textContent="Anfrage per E-Mail senden";
    a.href="mailto:info@fidele-eifellaender.de?subject="+encodeURIComponent("Buchungsanfrage")+"&body="+encodeURIComponent(body);
    btn.disabled=false;
  }
});
})();
