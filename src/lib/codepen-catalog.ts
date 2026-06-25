// Server-only catalog of sellable UI components. Each pen lives in /codepen/<slug>
// as index.html (required) + index.css + index.js (optional) — the same shape a
// CodePen export uses. The live preview is public (it's the visible result); the
// clean, copy-paste code is gated behind the Pro (€20/mo) membership.
import { promises as fs } from "fs";
import path from "path";

// "pen" → the sellable artifact is the HTML/CSS/JS (live preview + gated code).
// "prompt" → the artifact is an AI codegen prompt: the live preview shows the
// rendered result, the prompt itself (prompt.md) is the gated, copy-paste product.
export type ComponentKind = "pen" | "prompt";

export interface ComponentMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  kind: ComponentKind;
}
export interface ComponentSource extends ComponentMeta {
  html: string;
  css: string;
  js: string;
  prompt: string;
}

const ROOT = path.join(process.cwd(), "codepen");

// Curated metadata per pen (title / description / tags). Folders not listed here
// fall back to a prettified slug. Add an entry per slug as new pens land in /codepen.
// `kind` is not declared here — it's derived from whether a prompt.md exists.
const META: Record<string, { title: string; description: string; tags: string[] }> = {
  "lume-hero": {
    title: "Lume — Spotlight Reveal Hero",
    description:
      "Hero full-screen, dark, con riflettore che segue il cursore e rivela una seconda immagine sotto una maschera circolare morbida. React + TypeScript + Tailwind, animazioni d'ingresso premium. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Tailwind", "Spotlight"],
  },
  "atlas-3d": {
    title: "Atlas — 3D Studio Portfolio",
    description:
      "Landing per studio 3D, tema scuro e titoli clip-text argento. Centerpiece magnetico che insegue il cursore, marquee doppio guidato dallo scroll, paragrafo che si rivela lettera per lettera e card progetto sticky che si impilano. React + Tailwind + Framer Motion. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Framer Motion", "Scroll", "3D"],
  },
  "vesper-studio": {
    title: "Vesper — Cinematic Studio Landing",
    description:
      "Landing dark e cinematografica per uno studio creativo: crema calda su nero, texture noise, titoli con word pull-up, reveal del testo carattere per carattere allo scroll, video di sfondo e card in sequenza. React + Tailwind + framer-motion. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Tailwind", "framer-motion", "Cinematic"],
  },
  "atelier-nord": {
    title: "Atelier Nord — Video Hero & Menu",
    description:
      "Hero full-screen con video di sfondo in loop, menu mobile a tendina con hamburger animato e testo che entra con stagger al caricamento. Look minimale bianco-su-nero con CTA a pillola. React + Tailwind + lucide-react. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Tailwind", "Video", "Menu"],
  },
  "sereno": {
    title: "Sereno — Glassmorphism Video Hero",
    description:
      "Hero a tutto schermo con video di sfondo in loop, nav e feature pill in glassmorphism sopra il video, pillola di cattura email inline e menu mobile. React + Tailwind, display serif Cormorant Garamond. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Tailwind", "Glassmorphism", "Video"],
  },
};

function prettify(slug: string): string {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function readFileSafe(p: string): Promise<string> {
  try {
    return await fs.readFile(p, "utf8");
  } catch {
    return "";
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function listComponentSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(ROOT, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

async function metaFor(slug: string): Promise<ComponentMeta> {
  const m = META[slug];
  const isPrompt = await fileExists(path.join(ROOT, slug, "prompt.md"));
  return {
    slug,
    title: m?.title ?? prettify(slug),
    description: m?.description ?? "",
    tags: m?.tags ?? [],
    kind: isPrompt ? "prompt" : "pen",
  };
}

export async function listComponents(): Promise<ComponentMeta[]> {
  const slugs = await listComponentSlugs();
  return Promise.all(slugs.map(metaFor));
}

export async function getComponentSource(slug: string): Promise<ComponentSource | null> {
  const slugs = await listComponentSlugs();
  if (!slugs.includes(slug)) return null;
  const dir = path.join(ROOT, slug);
  const [meta, html, css, js, prompt] = await Promise.all([
    metaFor(slug),
    readFileSafe(path.join(dir, "index.html")),
    readFileSafe(path.join(dir, "index.css")),
    readFileSafe(path.join(dir, "index.js")),
    readFileSafe(path.join(dir, "prompt.md")),
  ]);
  return { ...meta, html, css, js, prompt };
}

// Standalone preview document loaded into the sandboxed iframe. GSAP + plugins
// are bundled from a CDN since most pens rely on them; `markers` is forced off so
// debug overlays never leak into the preview, and the user JS is wrapped so one
// pen's runtime error can't blank the frame.
export function buildPreviewDoc(src: Pick<ComponentSource, "html" | "css" | "js">): string {
  const cdn = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist";
  const js = src.js.replace(/markers\s*:\s*true/g, "markers:false");
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap" rel="stylesheet">
<script src="${cdn}/gsap.min.js"></script>
<script src="${cdn}/ScrollTrigger.min.js"></script>
<script src="${cdn}/ScrollSmoother.min.js"></script>
<style>html,body{margin:0;padding:0}${src.css}</style>
</head>
<body>
${src.html}
<script>window.addEventListener('DOMContentLoaded',function(){try{${js}
}catch(e){console.error('[preview]',e)}});<\/script>
</body>
</html>`;
}
