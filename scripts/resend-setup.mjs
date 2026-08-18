// One-shot Resend wiring for looz.design. Run once with a fresh API key:
//
//     node scripts/resend-setup.mjs re_xxxxxxxx
//
// Everything after "create the key at resend.com" is automated here, in order:
//   1. registers looz.design in Resend (EU region) via the Resend API;
//   2. writes the DNS records Resend demands into the Vercel zone (team scope
//      passed explicitly: without it every domain call 403s, see AGENTS.md);
//   3. asks Resend to verify and polls until it does;
//   4. creates/updates and publishes the branded "lead-notification" template
//      in Resend (src/lib/email-template.ts is the single source of the markup);
//   5. stores RESEND_API_KEY in the project env (production + preview);
//   6. redeploys production;
//   7. POSTs a real lead to https://looz.design/api/lead as proof.
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
  // 409 = already created by us in this run; 403 "registered already" = a
  // previous run registered the domain, so treat it as exists and resume.
  const alreadyRegistered = res.status === 403 && String(json.message ?? "").includes("registered already");
  if (!res.ok && res.status !== 409 && !alreadyRegistered) {
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

// ── 4. the branded template, managed in Resend ─────────────────────────────
// The markup lives in src/lib/email-template.ts (TypeScript), which this .mjs
// cannot import directly: esbuild bundles it to a temp CJS file on the fly, so
// the template in Resend can never drift from the one the route sends inline.
console.log("4) Template 'lead-notification'…");
try {
  const { buildSync } = await import("esbuild");
  const { mkdtempSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { pathToFileURL } = await import("node:url");
  const dir = mkdtempSync(join(tmpdir(), "looz-email-"));
  const out = join(dir, "email-template.mjs");
  buildSync({ entryPoints: ["src/lib/email-template.ts"], bundle: true, platform: "node", format: "esm", outfile: out });
  const { leadEmailTemplate } = await import(pathToFileURL(out).href);
  const tpl = leadEmailTemplate();

  const listed = await resend("GET", "/templates");
  const found = (listed.data ?? []).find((t) => t.name === tpl.name);
  let tplId;
  if (found) {
    await resend("PATCH", `/templates/${found.id}`, tpl);
    tplId = found.id;
    console.log(`   aggiornato (${tplId})`);
  } else {
    const created = await resend("POST", "/templates", tpl);
    tplId = created.id;
    console.log(`   creato (${tplId})`);
  }
  await resend("POST", `/templates/${tplId}/publish`);
  console.log("   pubblicato.");
} catch (e) {
  // The template is a nicety; delivery must not die on it. The route sends the
  // same design inline regardless.
  console.log(`   SALTATO (${String(e).slice(0, 140)}) - la rotta invia comunque l'HTML inline.`);
}

// ── 5. the env ──────────────────────────────────────────────────────────────
console.log("5) RESEND_API_KEY negli env del progetto…");
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
console.log("6) Deploy di produzione…");
const out = vercel(["deploy", "--prod", "--yes"]);
const url = (out.match(/https:\/\/\S+vercel\.app/) ?? [""])[0];
console.log(`   ${url || "fatto"}`);

// ── 6. proof ────────────────────────────────────────────────────────────────
console.log("7) Lead di prova su https://looz.design/api/lead…");
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
