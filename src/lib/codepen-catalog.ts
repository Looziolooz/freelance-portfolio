// Server-only catalog of sellable UI components. Each pen lives in /codepen/<slug>
// as index.html (required) + index.css + index.js (optional) — the same shape a
// CodePen export uses. The live preview is public (it's the visible result); the
// clean, copy-paste code is gated behind the Pro (€20/mo) membership.
import { promises as fs } from "fs";
import path from "path";

export interface ComponentMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}
export interface ComponentSource extends ComponentMeta {
  html: string;
  css: string;
  js: string;
}

const ROOT = path.join(process.cwd(), "codepen");

// Curated metadata; folders not listed here fall back to a prettified slug.
const META: Record<string, { title: string; description: string; tags: string[] }> = {
  startrek: {
    title: "Star Trek Crew",
    description:
      "Griglia di personaggi con hover, cursore custom e tipografia espressiva. Solo CSS layers + SVG.",
    tags: ["CSS", "Hover", "SVG"],
  },
  "video-scrub": {
    title: "Video Scrub on Scroll",
    description:
      "Un video pilotato dallo scroll con GSAP ScrollSmoother — scrubbing fluido fotogramma per fotogramma.",
    tags: ["GSAP", "ScrollTrigger", "Video"],
  },
  "GSAP-Video-Masked": {
    title: "Masked Video Reveal",
    description:
      "Testo che fa da maschera su un video, rivelato durante lo scroll con GSAP. Effetto editoriale d'impatto.",
    tags: ["GSAP", "Mask", "Video"],
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

function metaFor(slug: string): ComponentMeta {
  const m = META[slug];
  return {
    slug,
    title: m?.title ?? prettify(slug),
    description: m?.description ?? "",
    tags: m?.tags ?? [],
  };
}

export async function listComponents(): Promise<ComponentMeta[]> {
  const slugs = await listComponentSlugs();
  return slugs.map(metaFor);
}

export async function getComponentSource(slug: string): Promise<ComponentSource | null> {
  const slugs = await listComponentSlugs();
  if (!slugs.includes(slug)) return null;
  const dir = path.join(ROOT, slug);
  const [html, css, js] = await Promise.all([
    readFileSafe(path.join(dir, "index.html")),
    readFileSafe(path.join(dir, "index.css")),
    readFileSafe(path.join(dir, "index.js")),
  ]);
  return { ...metaFor(slug), html, css, js };
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
