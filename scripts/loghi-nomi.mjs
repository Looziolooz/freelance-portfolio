// slug -> nome del marchio, letto dai kit.
//
// per riconoscere il logo dal NOME invece che dalla posizione nel menu.
import { readFileSync, writeFileSync } from "node:fs";

const s = readFileSync("src/lib/brand-kits.ts", "utf8");
const mappa = {};
// Ogni kit comincia con `  <chiave>: {` in cima al file dei kit.
const re = /^ {2}([a-z0-9-]+):\s*\{$/gm;
const punti = [...s.matchAll(re)].map((m) => ({ chiave: m[1], i: m.index }));
for (let k = 0; k < punti.length; k++) {
  const blocco = s.slice(punti[k].i, punti[k + 1]?.i ?? s.length);
  const slug = blocco.match(/slug:\s*"([^"]+)"/)?.[1] ?? punti[k].chiave;
  const name = blocco.match(/\n\s{4}name:\s*"([^"]+)"/)?.[1];
  if (name) mappa[slug] = name;
}
writeFileSync(process.argv[2], JSON.stringify(mappa, null, 1));
console.log(Object.entries(mappa).map(([k, v]) => `${k} :: ${v}`).join("\n"));
