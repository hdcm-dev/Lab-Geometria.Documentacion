// Conductor de navegador sobre el Chrome que ya corre en 127.0.0.1:9333.
// Uso: node nav.mjs '<json de pasos>'   ó   node nav.mjs --archivo pasos.json
// Paso: {a:"goto",url} {a:"click",sel} {a:"fill",sel,val} {a:"press",sel,key}
//       {a:"key",key} {a:"wait",ms} {a:"shot",name,full?,sel?} {a:"eval",file|src}
//       {a:"a11y"} {a:"tab",n} {a:"viewport",w,h} {a:"red",perfil} {a:"tema",v}
//       {a:"url"} {a:"consola"} {a:"texto",sel?}
import { chromium } from './node_modules/playwright-core/index.mjs';
import { readFileSync } from 'node:fs';

const arg = process.argv[2] === '--archivo' ? readFileSync(process.argv[3], 'utf8') : process.argv[2];
const pasos = JSON.parse(arg);

const b = await chromium.connectOverCDP('http://127.0.0.1:9333');
const ctx = b.contexts()[0];
let p = ctx.pages()[0] || await ctx.newPage();

// La consola se acumula en la propia pagina para sobrevivir entre invocaciones.
if (!p.__enganchado) {
  p.on('console', m => { if (m.type()==='error'||m.type()==='warning') CONSOLA.push(`[${m.type()}] ${m.text()}`); });
  p.on('pageerror', e => CONSOLA.push(`[pageerror] ${e.message}`));
  p.__enganchado = true;
}
const CONSOLA = [];
p.on('console', m => { if (m.type()==='error'||m.type()==='warning') CONSOLA.push(`[${m.type()}] ${m.text()}`); });
p.on('pageerror', e => CONSOLA.push(`[pageerror] ${e.message}`));

const salida = [];
const di = (x) => salida.push(x);

const PERFILES = {
  lento:   { offline:false, latency:400, downloadThroughput: 400*1024/8, uploadThroughput: 400*1024/8 },
  '3g':    { offline:false, latency:150, downloadThroughput: 780*1024/8, uploadThroughput: 330*1024/8 },
  normal:  { offline:false, latency:0, downloadThroughput:-1, uploadThroughput:-1 },
};

for (const s of pasos) {
  try {
    if (s.a === 'goto')      { await p.goto(s.url, {waitUntil: s.wait||'load', timeout: 60000}); di(`goto ${s.url} -> ${p.url()}`); }
    else if (s.a==='click')  { await p.click(s.sel, {timeout: s.timeout||15000}); di(`click ${s.sel}`); }
    else if (s.a==='fill')   { await p.fill(s.sel, s.val, {timeout:15000}); di(`fill ${s.sel}`); }
    else if (s.a==='press')  { await p.press(s.sel, s.key, {timeout:15000}); di(`press ${s.sel} ${s.key}`); }
    else if (s.a==='key')    { await p.keyboard.press(s.key); di(`key ${s.key}`); }
    else if (s.a==='wait')   { await p.waitForTimeout(s.ms); di(`wait ${s.ms}`); }
    else if (s.a==='esperar'){ await p.waitForSelector(s.sel, {timeout: s.timeout||15000, state: s.estado||'visible'}); di(`esperar ${s.sel}`); }
    else if (s.a==='viewport'){ await p.setViewportSize({width:s.w, height:s.h}); di(`viewport ${s.w}x${s.h}`); }
    else if (s.a==='url')    { di(`url ${p.url()} | titulo ${await p.title()}`); }
    else if (s.a==='texto')  { di((await p.locator(s.sel||'body').innerText()).slice(0, s.max||4000)); }
    else if (s.a==='shot')   {
      const destino = `${process.env.SHOTS||'.'}/${s.name}.png`;
      if (s.sel) await p.locator(s.sel).screenshot({path:destino});
      else await p.screenshot({path:destino, fullPage: !!s.full});
      di(`shot ${destino}`);
    }
    else if (s.a === 'eval') {
      const src = s.file ? readFileSync(s.file,'utf8') : s.src;
      const r = await p.evaluate(src);
      di(typeof r === 'string' ? r : JSON.stringify(r, null, 1));
    }
    else if (s.a === 'a11y') {
      di(await p.locator(s.sel||'body').ariaSnapshot());
    }
    else if (s.a === 'tab') {
      const paradas = [];
      for (let i=0;i<(s.n||30);i++) {
        await p.keyboard.press('Tab');
        const info = await p.evaluate(() => {
          const e = document.activeElement; if (!e) return null;
          const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
          return { et: e.tagName.toLowerCase(), id: e.id||null, cls: (e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className||'').toString().slice(0,60),
                   txt: (e.innerText||e.value||e.getAttribute('aria-label')||'').toString().trim().slice(0,50),
                   outline: cs.outlineStyle+' '+cs.outlineWidth+' '+cs.outlineColor, boxShadow: cs.boxShadow.slice(0,60),
                   caja: `${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.x)},${Math.round(r.y)}`, visible: r.width>0&&r.height>0 };
        });
        paradas.push(`${i+1}. ${info? `${info.et}${info.id?'#'+info.id:''} "${info.txt}" caja=${info.caja} outline=${info.outline} sombra=${info.boxShadow}` : 'nada'}`);
      }
      di(paradas.join('\n'));
    }
    else if (s.a === 'red') {
      const cdp = await ctx.newCDPSession(p);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', PERFILES[s.perfil]||PERFILES.normal);
      di(`red ${s.perfil}`);
    }
    else di(`paso desconocido ${JSON.stringify(s)}`);
  } catch (e) {
    di(`ERROR en ${JSON.stringify(s)}: ${e.message.split('\n')[0]}`);
    if (s.corte !== false) break;
  }
}
if (CONSOLA.length) di('--- consola ---\n' + CONSOLA.join('\n'));
console.log(salida.join('\n'));
await b.close().catch(()=>{});
