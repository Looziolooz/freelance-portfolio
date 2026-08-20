// Mette tutti i ritagli su un foglio solo, per guardarli in un colpo.
//
// colpo invece che uno per volta. Da cancellare quando i loghi sono a posto.
import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const DIR = process.argv[2];
const files = readdirSync(DIR).filter((f) => f.endsWith(".png")).sort();
const W = 900;
const RIGA = 110;

const righe = [];
for (const f of files) {
  const buf = readFileSync(`${DIR}/${f}`);
  // Le misure vanno prese DOPO il rifilo: metadata() legge quelle dell'ingresso,
  // e ridimensionare con quelle faceva ritagliare invece che contenere, cioe'
  // mangiava le lettere ai lati. Da qui "olden Drago" al posto di Golden Dragon.
  const rifilato = await sharp(buf).trim({ threshold: 12 }).png().toBuffer();
  const m = await sharp(rifilato).metadata();
  const scala = Math.min((W - 210) / (m.width || 1), (RIGA - 24) / (m.height || 1), 1);
  const w = Math.max(1, Math.round((m.width || 1) * scala));
  const h = Math.max(1, Math.round((m.height || 1) * scala));
  const png = await sharp(rifilato).resize(w, h, { fit: "inside" }).png().toBuffer();
  righe.push({ nome: f.replace(".raw.png", ""), png, w, h });
}

const H = righe.length * RIGA;
const etichette = righe
  .map((r, i) => `<text x="12" y="${i * RIGA + RIGA / 2 + 5}" font-family="monospace" font-size="14" fill="#221E17">${r.nome}</text>`)
  .join("");
const fondo = await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 245, g: 238, b: 223, alpha: 1 } },
})
  .composite([
    { input: Buffer.from(`<svg width="${W}" height="${H}">${etichette}
      ${righe.map((_, i) => `<line x1="0" y1="${(i + 1) * RIGA}" x2="${W}" y2="${(i + 1) * RIGA}" stroke="#CFC6B4"/>`).join("")}
    </svg>`), top: 0, left: 0 },
    ...righe.map((r, i) => ({ input: r.png, top: i * RIGA + Math.round((RIGA - r.h) / 2), left: 200 })),
  ])
  .png()
  .toBuffer();
writeFileSync(`${DIR}/foglio.png`, fondo);
console.log(`foglio con ${righe.length} ritagli`);
