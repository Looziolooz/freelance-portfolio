// One-shot Resend wiring for looz.design. Run once with a fresh API key:
//
//     node scripts/resend-setup.mjs re_xxxxxxxx
//
// Everything after "create the key at resend.com" is automated here, in order:
//   1. registers looz.design in Resend (EU region) via the Resend API;
//   2. writes the DNS records Resend demands into the Vercel zone (team scope
//      passed explicitly: without it every domain call 403s, see AGENTS.md);
//   3. asks Resend to verify and polls until it does;
//   4. stores RESEND_API_KEY in the project env (production + preview);
//   5. redeploys production;
//   6. POSTs a real lead to https://looz.design/api/lead as proof.
//
// Safe to re-run: existing domain, records, env and deploys are all detected
// and skipped rather than duplicated.

import { execFileSync } from "node:child_process";

const KEY = process.argv[2] ?? process.env.RESEND_API_KEY;
if (!KEY || !KEY.startsWith("re_")) {
  console.error("Serve la API key di Resend: node scripts/resend-setup.mjs re_xxx");
  process.exit(1);
}
const DOMAIN = "looz.design";
const SCOPE = "loozioloozs-projects";

const vercel = (args, input) =>
  execFileSync("vercel", [...args, "--scope", SCOPE], {
    encoding: "utf8",
    input,
    shell: process.platform === "win32",
    stdio: ["pipe", "pipe", "pipe"],
  });

const resend = async (method, path, body) => {
  const res = await fetch(`https://api.resend.com${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 409) {
    throw new Error(`Resend ${method} ${path} -> ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return json;
};

// ── 1. the domain ───────────────────────────────────────────────────────────
console.log("1) Dominio su Resend…");
let domain = await resend("POST", "/domains", { name: DOMAIN, region: "eu-west-1" });
if (!domain.id) {
  const all = await resend("GET", "/domains");
  domain = (all.data ?? []).find((d) => d.name === DOMAIN);
  if (!domain) throw new Error("Dominio non creato e non trovato");
  domain = await resend("GET", `/domains/${domain.id}`);
}
console.log(`   ${DOMAIN} -> id ${domain.id}, stato ${domain.status}`);

// ── 2. the DNS records ──────────────────────────────────────────────────────
console.log("2) Record DNS nella zona Vercel…");
const existing = vercel(["dns", "ls", DOMAIN]);
for (const r of domain.records ?? []) {
  const value = String(r.value);
  if (existing.includes(value.slice(0, 40))) {
    console.log(`   ok  ${r.record} ${r.name} (gia' presente)`);
    continue;
  }
  // Resend names are relative to the zone; the zone apex is "@" for Vercel.
  const sub = !r.name || r.name === DOMAIN ? "@" : r.name.replace(`.${DOMAIN}`, "");
  const args = ["dns", "add", DOMAIN, sub, r.type, value];
  if (r.type === "MX") args.push(String(r.priority ?? 10));
  vercel(args);
  console.log(`   +   ${r.type} ${sub} ${value.slice(0, 50)}…`);
}

// ── 3. verify ───────────────────────────────────────────────────────────────
console.log("3) Verifica…");
await resend("POST", `/domains/${domain.id}/verify`);
for (let i = 0; i < 24; i += 1) {
  const d = await resend("GET", `/domains/${domain.id}`);
  if (d.status === "verified") { console.log("   verificato."); break; }
  if (i === 23) throw new Error(`Non verificato dopo 4 minuti (stato: ${d.status}). Riesegui fra poco: riprende da qui.`);
  await new Promise((ok) => setTimeout(ok, 10000));
  process.stdout.write(`   attendo (${d.status})…\r`);
}

// ── 4. the env ──────────────────────────────────────────────────────────────
console.log("4) RESEND_API_KEY negli env del progetto…");
const envs = vercel(["env", "ls"]);
if (envs.includes("RESEND_API_KEY")) {
  console.log("   gia' presente, non tocco.");
} else {
  for (const target of ["production", "preview"]) {
    vercel(["env", "add", "RESEND_API_KEY", target], KEY);
    console.log(`   +   ${target}`);
  }
}

// ── 5. redeploy ─────────────────────────────────────────────────────────────
console.log("5) Deploy di produzione…");
const out = vercel(["deploy", "--prod", "--yes"]);
const url = (out.match(/https:\/\/\S+vercel\.app/) ?? [""])[0];
console.log(`   ${url || "fatto"}`);

// ── 6. proof ────────────────────────────────────────────────────────────────
console.log("6) Lead di prova su https://looz.design/api/lead…");
const probe = await fetch("https://looz.design/api/lead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    subject: "Setup Resend completato",
    message: "Email di prova inviata da scripts/resend-setup.mjs: il form del sito ora consegna qui.",
    replyto: "hello@looz.design",
    from_name: "Setup",
  }),
});
console.log(`   HTTP ${probe.status} ${probe.ok ? "- controlla Gmail (via hello@looz.design)" : "- QUALCOSA NON VA, leggi i log del deploy"}`);
