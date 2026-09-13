(() => {
  const th=[...document.querySelectorAll('table thead th')].map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().slice(0,18), x:Math.round(r.x), w:Math.round(r.width), right:Math.round(r.right)}});
  let choque=[]; for(let i=1;i<th.length;i++) if(th[i].x < th[i-1].right-1) choque.push(`${th[i-1].t} termina en ${th[i-1].right} y ${th[i].t} empieza en ${th[i].x}`);
  const celda=document.querySelector('table tbody th, table tbody td');
  const nom=[...document.querySelectorAll('table tbody tr')].slice(0,1).map(tr=>[...tr.children].map(c=>{const r=c.getBoundingClientRect();return {t:c.innerText.trim().replace(/\n/g,'|').slice(0,30), w:Math.round(r.width), h:Math.round(r.height), wrap:getComputedStyle(c).overflowWrap+'/'+getComputedStyle(c).wordBreak}}));
  const cont=document.querySelector('table').parentElement;
  return {w:innerWidth, th, choque, primeraFila:nom, filaAlto: Math.round(document.querySelector('table tbody tr').getBoundingClientRect().height),
          contenedorTabla:{sel:cont.className.slice(0,40), overflowX:getComputedStyle(cont).overflowX, sw:cont.scrollWidth, cw:cont.clientWidth}};
})()
