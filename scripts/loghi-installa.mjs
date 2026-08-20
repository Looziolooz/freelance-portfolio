// Rifila i ritagli e li installa come wordmark.png.
//
//
// Il ritaglio arriva con il fondo del sito incorporato: bianco per Lievita, blu
// notte per Buss Travel, verde scuro per Nordbageriet. Non lo tolgo, per due
// motivi: molti di questi loghi sono chiari su fondo scuro, e togliendo il fondo
// resterebbero lettere bianche invisibili sulla carta chiara della copertina; e
// un marchio mostrato nel suo campo di colore e' esattamente come lo mostra un
// manuale. Quindi campiono quel colore e lo porto con me, cosi' la copertina puo
// fare del logo una fascia invece di una figurina appiccicata.
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const OUT = process.argv[2];
const DIR = `${OUT}/estratti2`;

// Guardati uno per uno sul foglio di contatto. Fuori restano: aurelia (esce
// nera), fotografo (e' la manina social @solari, non il logo), ferrari (solo
// lettere spaziate) e aliva (non trovato sul sito).
const BUONI = [
  "ai-visibility", "barberia", "bella-calabria", "brado", "buss-travel",
  "gelateria", "mirzz", "nordbageriet", "pizzeria-restaurant", "sushi",
  "vespa-heritage", "yoga",
];

const ALTEZZA = 168; // come i file gia' in casa

const righe = [];
for (const slug of BUONI) {
  const f = `${DIR}/${slug}.raw.png`;
  if (!existsSync(f)) { console.log(`${slug.padEnd(20)} — manca il ritaglio`); continue; }

  // Il colore del fondo: il pixel in alto a sinistra del ritaglio grezzo, prima
  // di rifilare, perche' dopo il rifilo quel bordo non c'e' piu'.
  const grezzo = sharp(readFileSync(f));
  const { data: primo } = await grezzo.clone().extract({ left: 0, top: 0, width: 2, height: 2 }).raw().toBuffer({ resolveWithObject: true });
  const bg = `#${[primo[0], primo[1], primo[2]].map((c) => c.toString(16).padStart(2, "0")).join("")}`;

  const rifilato = await grezzo.clone().trim({ threshold: 10 }).png().toBuffer();
  const m = await sharp(rifilato).metadata();
  const png = await sharp(rifilato)
    // Mai ingrandire: un ritaglio alto 35px portato a 168 e' sfocato, e la
    // copertina lo mostra alto 38, quindi non serve.
    .resize({ height: ALTEZZA, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const dest = `public/brand-logos/${slug}`;
  mkdirSync(dest, { recursive: true });
  writeFileSync(`${dest}/wordmark.png`, png);
  const fin = await sharp(png).metadata();
  righe.push({ slug, bg, w: fin.width, h: fin.height });
  console.log(`${slug.padEnd(20)} ${m.width}x${m.height} -> ${fin.width}x${fin.height}  fondo ${bg}  ${Math.round(png.length / 1024)}kB`);
}

writeFileSync(`${OUT}/installati.json`, JSON.stringify(righe, null, 1));
console.log(`\n${righe.length} loghi installati`);
