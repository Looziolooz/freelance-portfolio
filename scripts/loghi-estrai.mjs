// Estrae il marchio dall'insegna dei siti demo.
//
// Uso: node scripts/loghi-nomi.mjs <cartella>/nomi.json
//      node scripts/loghi-estrai.mjs <cartella> [slug ...]
//      node scripts/loghi-foglio.mjs <cartella>/estratti2   (per guardarli)
//      node scripts/loghi-installa.mjs <cartella>           (per installarli)
//
//
// La prima versione cercava "il primo link in cima" e infatti ha riportato a
// casa "Destinations", "Prenota" e una freccia indietro. Qui il criterio e' il
// NOME del marchio: si cerca l'elemento piu' piccolo che contiene quel nome
// nella fascia alta della pagina, e se accanto c'e' un emblema si sale al
// genitore che li tiene insieme, perche' il logo e' la coppia.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const CHROME = "C:/Users/loren/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe";
const PORT = 9394;
const OUT = process.argv[2];
mkdirSync(`${OUT}/estratti2`, { recursive: true });

const nomiKit = JSON.parse(readFileSync(`${OUT}/nomi.json`, "utf8"));
// Come il marchio si chiama SUL SITO, che non sempre e' come lo chiamiamo noi:
// il kit dice "Atelier Solari", l'insegna dice "Solari".
const ALIAS = {
  "bella-calabria": "Calabria Escapes",
  fotografo: "Solari",
  aurelia: "AURELIA",
  aliva: "Aliva",
  "ferrari-f8-tributo": "Ferrari",
  "pizzeria-restaurant": "Lievita",
  "pizzeria-lorenzo": "Pizzeria",
  "weather-se": "Weather",
};
const src = readFileSync("src/lib/projects.ts", "utf8");
const progetti = [];
for (const b of src.split(/\n  \{\n/).slice(1)) {
  const slug = b.match(/slug:\s*"([^"]+)"/)?.[1];
  const demo = b.match(/demo:\s*"([^"]+)"/)?.[1];
  const title = b.match(/title:\s*"([^"]+)"/)?.[1];
  if (slug && demo) progetti.push({ slug, demo, nome: ALIAS[slug] || nomiKit[slug] || title || slug });
}

const filtro = process.argv.slice(3);
const daFare = filtro.length ? progetti.filter((p) => filtro.includes(p.slug)) : progetti;

const proc = spawn(CHROME, [`--remote-debugging-port=${PORT}`, "--headless=new", "--disable-gpu",
  "--no-first-run", "--no-default-browser-check", "--hide-scrollbars",
  `--user-data-dir=${OUT}/estr2`, "about:blank"], { stdio: "ignore" });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let v;
for (let i = 0; i < 90; i++) {
  try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) { v = await r.json(); break; } } catch {}
  await wait(400);
}
const ws = new WebSocket(v.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pend = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); } };
const send = (m, p = {}, s) => new Promise((res, rej) => { const n = ++id; pend.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method: m, params: p, sessionId: s })); });
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
const ev = async (e) => (await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true }, sessionId)).result?.value;

const trova = (nome) => `(() => {
  const NOME = ${JSON.stringify(nome)};
  const norm = (t) => (t || '').replace(/\\s+/g, ' ').trim().toLowerCase();
  const chiavi = [norm(NOME), norm(NOME).replace(/[^a-z0-9]/g, ''), norm(NOME).split(' ')[0]];
  const vis = (e) => { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return false;
    const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 8 && r.top >= -20 && r.top < 340; };
  const combacia = (t) => { const n = norm(t); const c = n.replace(/[^a-z0-9]/g, '');
    return chiavi.some((k) => k.length > 2 && (n === k || n.startsWith(k + ' ') || c === k || c.startsWith(k))); };

  const trovati = [];
  for (const e of document.querySelectorAll('a, h1, h2, span, div, p, img, svg')) {
    if (!vis(e)) continue;
    const r = e.getBoundingClientRect();
    const testo = e.tagName === 'IMG' ? (e.alt || '') + ' ' + (e.getAttribute('src') || '') : e.textContent;
    const perNome = combacia(testo);
    const perFile = e.tagName === 'IMG' && /logo|wordmark|brand|lockup/i.test(e.getAttribute('src') || '');
    if (!perNome && !perFile) continue;
    if (norm(testo).length > NOME.length + 42) continue; // ha inghiottito mezza pagina
    trovati.push({ e, area: r.width * r.height, r, perFile });
  }
  if (!trovati.length) return null;

  // Il piu' piccolo che contiene il nome: e' il logo, non il contenitore.
  trovati.sort((a, b) => a.area - b.area);
  let scelto = trovati[0];

  // Si sale di un gradino per due motivi: se accanto c'e' un emblema (il logo e'
  // la coppia) oppure se il genitore aggiunge poco in altezza, che di solito
  // vuol dire il pay-off sotto il nome. Senza questa seconda regola tornavano a
  // casa "NORDBAGERIET" senza "SEDAN 1952" e "Golden Dragon" senza "TABLE GRILL
  // & SUSHI", cioe' meta' logo.
  let n = scelto.e;
  for (let i = 0; i < 3 && n.parentElement; i++) {
    const p = n.parentElement;
    const rp = p.getBoundingClientRect();
    const rn = n.getBoundingClientRect();
    const cresciuto = rp.width * rp.height;
    const haSegno = p.querySelector('img, svg') && !n.querySelector('img, svg');
    const soloPayoff = rp.height <= rn.height * 3.2 && rp.width <= rn.width * 1.45
      && (p.textContent || '').replace(/\s+/g, ' ').trim().length <= NOME.length + 40;
    if ((haSegno || soloPayoff) && cresciuto < scelto.area * 7 && rp.width < 560 && rp.height < 210) {
      scelto = { e: p, area: cresciuto, r: rp };
      n = p;
    } else break;
  }
  const r = scelto.e.getBoundingClientRect();
  return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height,
    txt: (scelto.e.textContent || scelto.e.alt || '').replace(/\\s+/g, ' ').trim().slice(0, 46),
    tag: scelto.e.tagName.toLowerCase() };
})()`;

const esito = [];
for (const p of daFare) {
  try {
    await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false }, sessionId);
    await send("Page.navigate", { url: p.demo }, sessionId);
    await wait(3600);
    await ev(`[...document.querySelectorAll('button, a')].filter(b => /accett|accept|godk|consent/i.test(b.textContent || '')).slice(0,2).forEach(b => b.click()); true`);
    // i caratteri e le immagini devono esserci: un logo fotografato prima che
    // il font arrivi e' il logo di un altro carattere.
    await ev(`document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true`);
    await ev(`Promise.all([...document.images].filter(i => !i.complete).slice(0, 12).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 2500); }))).then(() => true)`);
    await ev("window.scrollTo(0, 0); true");
    await wait(700);
    const c = await ev(trova(p.nome));
    if (!c) { console.log(`${p.slug.padEnd(20)} — nessun elemento col nome "${p.nome}"`); esito.push({ ...p, ok: false }); continue; }
    const pad = 8;
    const { data } = await send("Page.captureScreenshot", {
      format: "png",
      clip: { x: Math.max(0, c.x - pad), y: Math.max(0, c.y - pad), width: c.w + pad * 2, height: c.h + pad * 2, scale: 2 },
      captureBeyondViewport: true,
    }, sessionId);
    writeFileSync(`${OUT}/estratti2/${p.slug}.raw.png`, Buffer.from(data, "base64"));
    console.log(`${p.slug.padEnd(20)} ok  ${Math.round(c.w)}x${Math.round(c.h)}  <${c.tag}>  «${c.txt}»`);
    esito.push({ ...p, ok: true, txt: c.txt });
  } catch (e) {
    console.log(`${p.slug.padEnd(20)} — errore ${String(e).slice(0, 70)}`);
    esito.push({ ...p, ok: false });
  }
}
ws.close(); proc.kill();
writeFileSync(`${OUT}/estratti2/elenco.json`, JSON.stringify(esito, null, 1));
console.log("\nfatto");
