/**
 * Generic importer for the beginner content packs ("... da zero").
 * Reads markdown from a gitignored content/<pack>/ folder and upserts into
 * Content. Runs standalone against Supabase (no dev server needed):
 *   npx tsx scripts/import-pack.ts <pack>
 * e.g.
 *   npx tsx scripts/import-pack.ts claude-da-zero
 *   npx tsx scripts/import-pack.ts claude-code-da-zero
 *   npx tsx scripts/import-pack.ts claude-api-da-zero
 *   npx tsx scripts/import-pack.ts claude-cowork-da-zero
 *
 *   <pack>/articoli/ -> category "blog",  tier FREE       (public explainers)
 *   <pack>/guide/    -> category "guide", tier SUPPORTER  (membership-gated)
 *
 * Slugs: articoli -> "<pack>-<topic>", guide -> "guida-<pack>-<topic>".
 */
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient, type Lang, type Tier } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

try {
  // Node 22: load DATABASE_URL from .env without extra deps.
  (process as unknown as { loadEnvFile: (p: string) => void }).loadEnvFile(
    path.join(process.cwd(), ".env"),
  );
} catch {
  /* env may already be present */
}

const pack = process.argv[2];
if (!pack || !/^[a-z0-9-]+$/.test(pack)) {
  console.error(
    "Usage: npx tsx scripts/import-pack.ts <pack> [IT|EN|SV]   (e.g. claude-da-zero en)",
  );
  process.exit(1);
}
const lang = (process.argv[3] || "IT").toUpperCase();
if (!["IT", "EN", "SV"].includes(lang)) {
  console.error("Lang must be IT, EN, or SV");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ROOT = path.join(process.cwd(), "content", pack, lang.toLowerCase());
const PREZZO: Record<string, string> = {
  IT: "5€/mese",
  EN: "5€/month",
  SV: "5€/månad",
};
const FILL: Record<string, string> = {
  "[LINK-PAGAMENTO]": "/membership",
  "[PREZZO]": PREZZO[lang] ?? PREZZO.IT,
  "[NOME-SITO]": "lorenzo.hacks",
};

function fill(s: string): string {
  let out = s;
  for (const [k, v] of Object.entries(FILL)) out = out.split(k).join(v);
  return out;
}

function stripMd(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parse(md: string): { title: string; description: string } {
  const lines = md.split("\n");
  const titleLine = lines.find((l) => l.startsWith("# "));
  const title = titleLine ? stripMd(titleLine) : "Senza titolo";

  let seenTitle = false;
  let description = "";
  for (const l of lines) {
    if (!seenTitle) {
      if (l.startsWith("# ")) seenTitle = true;
      continue;
    }
    const t = l.trim();
    if (!t) continue;
    if (t.startsWith("#") || t.startsWith("---")) continue;
    if (t.startsWith("*") && t.endsWith("*")) continue;
    description = stripMd(t);
    if (description) break;
  }
  if (description.length > 200) description = description.slice(0, 197).trimEnd() + "…";
  return { title, description };
}

/** "01-cos-e-claude.md" -> "cos-e-claude" (drop extension + order number). */
function topicOf(filename: string): string {
  return filename.replace(/\.md$/, "").replace(/^\d+-/, "");
}

async function importDir(sub: "articoli" | "guide") {
  const dir = path.join(ROOT, sub);
  let files: string[] = [];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md"));
  } catch {
    return { count: 0, slugs: [] as string[], note: `not found: ${dir}` };
  }

  const tier = sub === "guide" ? "SUPPORTER" : "FREE";
  const category = sub === "guide" ? "guide" : "blog";
  const prefix = sub === "guide" ? `guida-${pack}-` : `${pack}-`;

  const slugs: string[] = [];
  for (const f of files.sort()) {
    const body = fill(await fs.readFile(path.join(dir, f), "utf8"));
    const { title, description } = parse(body);
    const slug = prefix + topicOf(f);
    await prisma.content.upsert({
      where: { slug_lang: { slug, lang: lang as Lang } },
      update: { title, description, body, category, tier: tier as Tier, published: true },
      create: { title, slug, description, body, category, lang: lang as Lang, tier: tier as Tier, published: true },
    });
    slugs.push(slug);
  }
  return { count: slugs.length, slugs };
}

async function main() {
  const articoli = await importDir("articoli");
  const guide = await importDir("guide");
  console.log(JSON.stringify({ pack, lang, articoli, guide }, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("IMPORT FAILED:", e);
  await prisma.$disconnect();
  process.exit(1);
});
