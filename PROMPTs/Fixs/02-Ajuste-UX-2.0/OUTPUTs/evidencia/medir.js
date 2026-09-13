(() => {
  const lum = ([r,g,b]) => { const f=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)}; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const rgb = s => { const m=s.match(/rgba?\(([^)]+)\)/); if(!m) return null; const p=m[1].split(',').map(x=>parseFloat(x)); return {c:[p[0],p[1],p[2]], a:p.length>3?p[3]:1}; };
  const mezcla = (f,b) => f.c.map((v,i)=>v*f.a + b[i]*(1-f.a));
  const fondoDe = el => { let n=el; while(n && n.nodeType===1){ const c=rgb(getComputedStyle(n).backgroundColor); if(c && c.a>0) return c.a===1?c.c:mezcla(c, fondoDe(n.parentElement)||[255,255,255]); n=n.parentElement; } return [255,255,255]; };
  const ratio=(a,b)=>{const L1=lum(a),L2=lum(b);return ((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05));};
  const sel = el => { let s=el.tagName.toLowerCase(); if(el.id) s+='#'+el.id; else if(el.className && typeof el.className==='string' && el.className.trim()) s+='.'+el.className.trim().split(/\s+/).slice(0,2).join('.'); return s; };
  const visible = el => { const r=el.getBoundingClientRect(); const cs=getComputedStyle(el); return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&cs.opacity!=='0'; };

  // 1. contraste de todo nodo de texto propio
  const contrastes=[]; const vistos=new Set();
  document.querySelectorAll('main *, nav *, header *, footer *').forEach(el=>{
    if(!visible(el)) return;
    const propio=Array.from(el.childNodes).filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
    if(!propio) return;
    const cs=getComputedStyle(el); const f=rgb(cs.color); if(!f) return;
    const fondo=fondoDe(el); const col=f.a===1?f.c:mezcla(f,fondo);
    const px=parseFloat(cs.fontSize); const peso=parseInt(cs.fontWeight)||400;
    const grande = px>=24 || (px>=18.66 && peso>=700);
    const r=ratio(col,fondo); const piso=grande?3:4.5;
    const clave=sel(el)+'|'+propio.slice(0,20);
    if(vistos.has(clave)) return; vistos.add(clave);
    if(r<piso) contrastes.push({sel:sel(el), txt:propio.slice(0,40), px, peso, ratio:+r.toFixed(2), piso, color:cs.color, fondo:`rgb(${fondo.map(Math.round).join(',')})`});
  });

  // 2. objetivos < 24x24
  const chicos=[];
  document.querySelectorAll('a,button,input,select,textarea,[role=button],[role=checkbox],[role=treeitem],summary').forEach(el=>{
    if(!visible(el)) return; const r=el.getBoundingClientRect();
    if(r.width<24||r.height<24) chicos.push({sel:sel(el), txt:(el.innerText||el.value||el.getAttribute('aria-label')||'').trim().slice(0,30), w:+r.width.toFixed(1), h:+r.height.toFixed(1)});
  });

  // 3. censo tipografico
  const tipos={};
  document.querySelectorAll('main *, nav *').forEach(el=>{ if(!visible(el))return; const t=Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()); if(!t)return; const cs=getComputedStyle(el); const k=`${parseFloat(cs.fontSize)}px/${cs.fontWeight}`; tipos[k]=(tipos[k]||0)+1; });

  // 4. nombre accesible ausente
  const sinNombre=[];
  document.querySelectorAll('button,a,input,select,textarea,[role=button],[role=checkbox]').forEach(el=>{
    if(!visible(el))return;
    const n=(el.getAttribute('aria-label')||el.getAttribute('title')||el.innerText||'').trim() ||
            (el.labels&&el.labels.length?Array.from(el.labels).map(l=>l.innerText).join(' ').trim():'') ||
            (el.getAttribute('aria-labelledby')?document.getElementById(el.getAttribute('aria-labelledby'))?.innerText||'':'');
    if(!n) sinNombre.push({sel:sel(el), html:el.outerHTML.slice(0,90)});
  });

  // 5. desborde horizontal
  const desborde = document.documentElement.scrollWidth > window.innerWidth+1
     ? {scrollWidth:document.documentElement.scrollWidth, innerWidth:window.innerWidth,
        culpables: Array.from(document.querySelectorAll('main *,nav *')).filter(e=>{const r=e.getBoundingClientRect();return r.right>window.innerWidth+1&&visible(e)}).slice(0,6).map(e=>({sel:sel(e), right:Math.round(e.getBoundingClientRect().right)}))}
     : null;

  // 6. regiones vivas y marca de menu activo
  const vivas = Array.from(document.querySelectorAll('[aria-live],[role=alert],[role=status]')).map(e=>({sel:sel(e), live:e.getAttribute('aria-live')||e.getAttribute('role'), txt:e.innerText.trim().slice(0,40)}));
  const menu = Array.from(document.querySelectorAll('nav a')).map(a=>({txt:a.innerText.trim().slice(0,30), cur:a.getAttribute('aria-current'), cls:(a.className||'').slice(0,50)}));

  // 7. escala de espaciados usados en contenedores principales
  return {url:location.pathname, ancho:window.innerWidth, contrastes, chicos, tipos, sinNombre, desborde, vivas, menu};
})()
