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
  "bento-features": {
    title: "Bento Features — Griglia con Globo",
    description:
      "Sezione \"features\" in stile bento: titolo centrato e griglia a 6 colonne con quattro celle. Ogni cella ha titolo, descrizione e una visual: screenshot di un sito con sfumature in alto e in basso, ventaglio di foto ruotate, anteprima video con play che sfoca all'hover e un globo WebGL che ruota da solo (libreria cobe). React + Tailwind v4 + shadcn/ui + motion. Tema parchment chiaro, testo ink, accenti oro. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Bento", "Globe"],
  },
  "background-beams": {
    title: "Background Beams — Beam che esplodono",
    description:
      "Sfondo animato in stile Aceternity: beam verticali sottili cadono dall'alto a velocita e posizioni diverse e, quando toccano la linea di fondo, scatenano una piccola esplosione di particelle dorate. Titolo centrato con clip-text gradiente del brand. React + Tailwind v4 + motion/react. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Animation", "Background"],
  },
  "lume-hero": {
    title: "Lume — Spotlight Reveal Hero",
    description:
      "Hero full-screen, dark, con riflettore che segue il cursore e rivela una seconda immagine sotto una maschera circolare morbida. React + TypeScript + Tailwind, animazioni d'ingresso premium. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Tailwind", "Spotlight"],
  },
  "carousel-3d": {
    title: "Carousel — 3D Perspective Slider",
    description:
      "Slider 3D in prospettiva: slide quadrate a tutto schermo dentro uno stage con perspective, la slide attiva piatta e grande mentre le altre rimpiccioliscono e si inclinano sull'asse X. L'immagine attiva fa parallax verso il cursore, titolo e pillola bianca in overlay, controlli tondi prev/next e auto-avanzamento ogni 4s. React + shadcn/ui + Tailwind v4 + TypeScript. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Carousel", "3D"],
  },
  "draggable-cards": {
    title: "Draggable Cards — Photo Pile Fisica",
    description:
      "Card fotografiche sparse sulla tela con leggere rotazioni: trascini ognuna con inerzia e ritorno elastico, mentre si inclina in 3D dalla velocita e un riflesso le scorre sopra. Hover che ingrandisce, idle drift che fa respirare il mucchio e un titolo sfumato dietro. React + TypeScript + Tailwind v4 + motion. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Drag", "Physics"],
  },
  "floating-dock": {
    title: "Floating Dock — Magnify Dock alla macOS",
    description:
      "Barra dock in stile macOS: ogni icona si ingrandisce in base alla distanza orizzontale dal cursore, con molla di smorzamento e tooltip, piu una variante mobile collassata. L'anteprima ha un'auto-demo che fa scorrere un cursore virtuale avanti e indietro sulla dock. React + shadcn/ui + Tailwind v4 + Motion, icone Tabler. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Dock", "Motion"],
  },
  "testimonials": {
    title: "Animated Testimonials — Carosello Recensioni",
    description:
      "Recensioni a due colonne: a sinistra una pila di ritratti che ruotano ed entrano in scena con la foto attiva che balza in primo piano, a destra nome, ruolo e citazione rivelata parola per parola con un blur morbido. Pulsanti tondi avanti/indietro e autoplay ogni 5s. React + shadcn/ui + Tailwind v4 + Motion, icone Tabler, demo con clienti italiani di uno studio web. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Carousel", "Motion"],
  },
  "split-flap-board": {
    title: "Split-Flap Board — Tabellone Solari",
    description:
      "Tabellone Solari a palette ribaltabili: una griglia di celle alte che scorrono tra caratteri casuali e si fermano sul messaggio, con ribaltamento meccanico, flash d'accento del brand e tessere colore. Righe italiane da tabellone partenze che si alternano ogni 6s. React + TypeScript + Tailwind v4 + motion. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Animation", "Text"],
  },
  "macbook-scroll": {
    title: "MacBook Scroll — Il tuo sito che si apre",
    description:
      "Sezione guidata dallo scroll: un MacBook 3D inclinato si apre da chiuso a schermo piatto mentre scorri, lo schermo cresce e il titolo sfuma verso l'alto. Sullo schermo una dashboard pulita, cosi il visitatore immagina il proprio sito. React + Tailwind v4 + motion/react. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Scroll", "3D"],
  },
  "squiggly-text": {
    title: "SquigglyText — Titolo che Ondeggia",
    description:
      "Titolo in cui le parole chiave si increspano di continuo con un filtro SVG di turbolenza, in oro ocra su pergamena. React + motion/react. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "SVG", "Text"],
  },
  "gooey-input": {
    title: "Gooey Input — Ricerca a pillola liquida",
    description:
      "Controllo di ricerca a pillola che si espande da bottone a campo testo, con una bolla d'icona staccata che si fonde nella pillola tramite un filtro SVG gooey. Pillola ink, bolla oro, su parchment. React + TypeScript + shadcn/ui + Tailwind v4 + motion/react. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "SVG", "Input"],
  },
  "card-3d": {
    title: "Card 3D — Tilt al passaggio del mouse",
    description:
      "Card 3D che segue il cursore e si inclina sugli assi X/Y con prospettiva; titolo, immagine e pulsanti si sollevano a profondita diverse con translateZ. Nel preview un dolce auto-tilt mostra la profondita anche senza mouse. Superficie parchment, link verde foresta, CTA oro ocra. React + shadcn/ui + Tailwind. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "3D", "Hover"],
  },
  "ascii-art": {
    title: "AsciiArt — Ritratto in caratteri",
    description:
      "Un'immagine resa interamente come arte ASCII su canvas: la foto viene campionata in una griglia a bassa risoluzione e ogni cella diventa un carattere in base alla luminosita. Inchiostro su carta, 110 colonne, rivelazione typewriter in loop. React + TypeScript + Canvas. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Canvas", "ASCII"],
  },
  "globe-3d": {
    title: "Globe3D — Mappamondo 3D dei clienti",
    description:
      "Terra 3D testurizzata che ruota da sola, si trascina con il mouse e ha un alone d'atmosfera teal. Segnaposto dorati nelle citta dei clienti, da Milano a Stoccolma. React Three Fiber + drei + three su shadcn/ui e Tailwind v4. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Three.js", "3D"],
  },
  "dither-shader": {
    title: "DitherShader — Poster Duotono su Canvas",
    description:
      "Componente che rende una foto su canvas con dithering ordinato (matrici di Bayer 4x4/8x8, piu halftone, noise e crosshatch) e colorMode grayscale, duotono, palette o originale quantizzato. La demo e un poster on-brand ink su parchment. React + Tailwind v4 + TypeScript. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Canvas", "Shader"],
  },
  "dotted-glow": {
    title: "DottedGlow — Sfondo a Puntini Pulsanti",
    description:
      "Sfondo su canvas con una griglia di puntini sfalsati: ognuno ha fase e velocita proprie e pulsa l'alpha con onda triangolare, accendendo un bagliore quando e luminoso. Demo: card parchment con monogramma forest e tagline. React + Canvas, shadcn/ui + Tailwind v4. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Canvas", "Background"],
  },
  "encrypted-text": {
    title: "Encrypted Text — Testo Decrittato",
    description:
      "Headline che parte come caratteri casuali e rivela il testo reale da sinistra a destra, mentre i caratteri non ancora svelati continuano a cambiare. Cifrati in ink muted, rivelati in ink scuro, monospace su carta. React + TypeScript + motion/react. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Text", "Animation"],
  },
  "apple-carousel": {
    title: "Apple Cards Carousel — Schede che si espandono",
    description:
      "Carosello orizzontale di schede alte con immagine, categoria e titolo in sovrimpressione; frecce tonde per scorrere e schede che si aprono in una modale centrata con sfondo sfocato (chiusura con Esc, click esterno e pulsante). Ingresso in stagger e drift automatico della fila. shadcn/ui + Tailwind v4 + motion. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Carousel", "Modal"],
  },
  "expandable-cards": {
    title: "Expandable Cards — Lista che si espande in modale",
    description:
      "Una lista di card che, al clic, si espandono con una transizione shared-layout in una modale centrata: immagine grande, titolo, CTA e descrizione scorrevole con maschera sfumata, sopra uno sfondo oscurato. Chiusura con X, Esc o clic fuori. React + Tailwind v4 + motion/react. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Modal", "Motion"],
  },
  "file-upload": {
    title: "File Upload — Dropzone con Grid Pattern",
    description:
      "Area di upload in stile Aceternity: sfondo a scacchiera animato con maschera radiale, tile di caricamento che si solleva e fluttua al passaggio del mouse, drag & drop o click per aggiungere file. Ogni file appare in una card animata con nome, peso, tipo e data. React + Tailwind v4 + motion/react + react-dropzone. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Upload", "Motion"],
  },
  "timeline": {
    title: "Timeline — Il percorso dello studio",
    description:
      "Timeline verticale in stile Aceternity: una rotaia sottile a sinistra si riempie con un gradiente oro ocra verso verde foresta mentre scorri, puntini sticky e grandi etichette d'anno che restano fisse mentre il contenuto scorre a destra. Personalizzata con le tappe dello studio, tema parchment chiaro. React + Tailwind v4 + motion/react. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Scroll", "Timeline"],
  },
  "images-slider": {
    title: "Images Slider — Slideshow con pop 3D",
    description:
      "Slideshow a tutto schermo in stile Aceternity: ogni immagine entra con un pop 3D (scala da zero mentre un'inclinazione di 45 gradi si appiattisce) e quella uscente scorre verso l'alto, su uno strato scuro. Titolo con clip-text sfumato e pillola glassy con bagliore oro, autoplay e frecce. React + shadcn/ui + Tailwind v4 + motion/react. Il prompt completo si sblocca con il Pro.",
    tags: ["React", "Slider", "Motion"],
  },
  "video-showcase": {
    title: "Video Showcase — Clip cliccabile",
    description:
      "Un player video a tutto schermo che parte in autoplay muto e in loop; al clic attivi l'audio e metti in play o pausa, con pulsante play centrale e badge audio. Cornice parchment, bordo ink, accento oro. HTML + CSS + JS puro, nessun framework. Il codice si sblocca con il Pro.",
    tags: ["Video", "HTML", "CSS"],
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
