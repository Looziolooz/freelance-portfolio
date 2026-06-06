/**
 * One-off importer for the "Connettori di Claude" content pack.
 * Reads markdown from the gitignored content/connettori/ folder and upserts
 * into Content. Runs standalone against Supabase (no dev server needed):
 *   npx tsx scripts/import-connettori.ts
 *
 *   articoli/ -> category "blog",  tier FREE       (public SEO lead magnets)
 *   guide/    -> category "guide", tier SUPPORTER  (unlocked by membership)
 */
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

try {
  // Node 22: load DATABASE_URL from .env without extra deps.
  (process as unknown as { loadEnvFile: (p: string) => void }).loadEnvFile(
    path.join(process.cwd(), ".env"),
  );
} catch {
  /* env may already be present */
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ROOT = path.join(process.cwd(), "content", "connettori");
const FILL: Record<string, string> = {
  "[LINK-PAGAMENTO]": "/membership",
  "[PREZZO]": "5€/mese",
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

function connectorOf(filename: string): string {
  return filename.replace(/\.md$/, "").split("-").slice(2).join("-");
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
  const prefix = sub === "guide" ? "guida-connettore-" : "connettore-";

  const slugs: string[] = [];
  for (const f of files.sort()) {
    const body = fill(await fs.readFile(path.join(dir, f), "utf8"));
    const { title, description } = parse(body);
    const slug = prefix + connectorOf(f);
    await prisma.content.upsert({
      where: { slug_lang: { slug, lang: "IT" } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update: { title, description, body, category, tier: tier as any, published: true },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      create: { title, slug, description, body, category, lang: "IT" as any, tier: tier as any, published: true },
    });
    slugs.push(slug);
  }
  return { count: slugs.length, slugs };
}

async function main() {
  const articoli = await importDir("articoli");
  const guide = await importDir("guide");
  console.log(JSON.stringify({ articoli, guide }, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("IMPORT FAILED:", e);
  await prisma.$disconnect();
  process.exit(1);
});
