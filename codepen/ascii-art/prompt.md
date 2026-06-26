Costruisci un componente **AsciiArt** per **React + TypeScript** con **shadcn/ui** e **Tailwind CSS v4**. L'effetto: un'immagine viene resa interamente come arte ASCII su un `<canvas>`. Il componente campiona la foto in una griglia a bassa risoluzione (`resolution` colonne, righe = colonne × 0.55), calcola la luminosità media di ogni cella e la mappa su un carattere preso da una rampa (dal più scuro al più chiaro), poi disegna i caratteri sul canvas. Supporta `animationStyle` "fade" / "typewriter" / "matrix", reso colorato o a tinta unita, e preset di charset. L'animazione parte una volta quando l'elemento entra nel viewport.

### Setup

Serve un progetto con shadcn/ui già inizializzato:

- **shadcn/ui** configurato (`npx shadcn@latest init`).
- **Tailwind CSS v4** attivo.
- **TypeScript**.
- Dipendenza per il motore di animazione: `npm i motion` (si importa da `motion/react`).
- L'helper `cn` in `@/lib/utils` (generato da shadcn). Se manca:

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Percorso di default dei componenti: `components/ui`.

Una sola avvertenza tecnica: per leggere i pixel dell'immagine il canvas non deve essere "tainted". Carica sempre l'immagine con `crossOrigin="anonymous"` e usa una sorgente che risponda con header CORS permissivi (le immagini di `images.unsplash.com` funzionano). Senza questo, `getImageData` lancia un'eccezione di sicurezza.

### File 1: `components/ui/ascii-art.tsx`

Il componente. Riproducilo così com'è. Tutte le props restano: `src`, `resolution` (default 110), `charset` (default `"standard"` o stringa custom), `color` (tinta unita o `"original"` per il colore campionato), `background`, `animationStyle` (default `"fade"`), `animationDuration` (ms, default 1500), `animateOnView` (default true), `className`.

```tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

type AnimationStyle = "fade" | "typewriter" | "matrix";

// Rampe pronte (dal carattere più scuro/denso a sinistra al più chiaro a destra).
// Su sfondo chiaro la rampa si comporta come "inchiostro su carta".
const CHARSET_PRESETS: Record<string, string> = {
  standard: " .,:;i1tfLCG08@",
  blocks: " ░▒▓█",
  minimal: " .:-=+*#%@",
  dots: " .·•●",
};

export type AsciiArtProps = {
  /** URL dell'immagine. Deve essere leggibile via CORS (vedi crossOrigin sotto). */
  src: string;
  /** Numero di colonne della griglia ASCII. Le righe sono resolution * 0.55. */
  resolution?: number;
  /** Nome di un preset (standard/blocks/minimal/dots) oppure una rampa custom. */
  charset?: string;
  /** Colore dei caratteri. "original" usa il colore campionato dal pixel. */
  color?: string;
  /** Colore di sfondo del canvas. */
  background?: string;
  /** Stile di rivelazione dei caratteri. */
  animationStyle?: AnimationStyle;
  /** Durata della rivelazione in ms. */
  animationDuration?: number;
  /** Se true, l'animazione parte quando il canvas entra nel viewport. */
  animateOnView?: boolean;
  className?: string;
};

const ROW_RATIO = 0.55; // le celle sono più alte che larghe: compensa il passo del font
const SUPERSAMPLE = 2;  // disegna a 2x per glifi nitidi su display hi-dpi

export const AsciiArt: React.FC<AsciiArtProps> = ({
  src,
  resolution = 110,
  charset = "standard",
  color = "#26221d",
  background = "#efe9dc",
  animationStyle = "fade",
  animationDuration = 1500,
  animateOnView = true,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isInView = useInView(containerRef, { once: true });
  const [ready, setReady] = useState(false);

  // Griglia campionata: indici nella rampa + colore per cella (per color="original").
  const gridRef = useRef<{
    cols: number;
    rows: number;
    chars: number[];
    colors: string[];
  } | null>(null);

  const ramp = CHARSET_PRESETS[charset] ?? charset;

  // 1) Carica l'immagine e campiona la griglia di luminosità.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cols = Math.max(8, Math.round(resolution));
    const rows = Math.max(1, Math.round(cols * ROW_RATIO));

    const img = new Image();
    img.crossOrigin = "anonymous"; // indispensabile per leggere i pixel
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d");
      if (!octx) return;

      // cover-fit: ritaglia per riempire la griglia mantenendo il soggetto centrato
      const targetAr = cols / rows;
      const ar = img.width / img.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ar > targetAr) {
        sw = img.height * targetAr;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / targetAr;
        sy = (img.height - sh) / 2;
      }
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);

      let data: Uint8ClampedArray;
      try {
        data = octx.getImageData(0, 0, cols, rows).data;
      } catch {
        // canvas "tainted": l'immagine non espone CORS. Vedi la nota nel Setup.
        return;
      }

      const last = ramp.length - 1;
      const chars: number[] = new Array(cols * rows);
      const colors: string[] = new Array(cols * rows);
      for (let i = 0; i < cols * rows; i += 1) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255; // luma Rec.601, 0..1
        // pixel più chiaro -> glifo più denso (inchiostro su carta)
        chars[i] = Math.round(lum * last);
        colors[i] = `rgb(${r},${g},${b})`;
      }

      gridRef.current = { cols, rows, chars, colors };
      setReady(true);
    };
    img.src = src;
    return () => {
      img.onload = null;
    };
  }, [src, resolution, ramp]);

  // 2) Disegna / anima quando la griglia è pronta (ed eventualmente in view).
  useEffect(() => {
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    if (!canvas || !grid || !ready) return;
    if (animateOnView && !isInView) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cols, rows, chars, colors } = grid;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * SUPERSAMPLE));
    canvas.height = Math.max(1, Math.round(rect.height * SUPERSAMPLE));
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    const total = cols * rows;
    // Ordine di rivelazione per stile: typewriter = lettura; matrix = per colonne; fade = tutto insieme.
    const order: number[] = new Array(total);
    for (let i = 0; i < total; i += 1) order[i] = i;
    if (animationStyle === "matrix") {
      order.sort((a, b) => {
        const ca = a % cols, cb = b % cols;
        if (ca !== cb) return ca - cb;
        return a - b;
      });
    }

    const fontPx = Math.max(1, cellH * 1.08);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const drawFrame = (progress: number, fadeAlpha: number) => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontPx}px 'Courier New', ui-monospace, monospace`;
      ctx.globalAlpha = animationStyle === "fade" ? fadeAlpha : 1;

      const limit =
        animationStyle === "fade" ? total : Math.floor(progress * total);
      for (let n = 0; n < limit; n += 1) {
        const idx = order[n];
        const ch = ramp.charAt(chars[idx]);
        if (ch === " ") continue;
        ctx.fillStyle = color === "original" ? colors[idx] : color;
        const cgrid = idx % cols;
        const rgrid = (idx - cgrid) / cols;
        ctx.fillText(ch, cgrid * cellW + cellW / 2, rgrid * cellH + cellH / 2);
      }
      ctx.globalAlpha = 1;
    };

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / Math.max(1, animationDuration));
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      drawFrame(eased, eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, isInView, animateOnView, animationStyle, animationDuration, color, background, ramp]);

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block h-full w-full"
        style={{ background }}
      />
    </div>
  );
};
```

Note sul funzionamento, per chi vuole regolarlo:

- **Campionamento**: la foto viene ridisegnata su un canvas offscreen `cols × rows` (cover-fit), poi `getImageData` legge un pixel per cella. La luminosità (luma Rec.601) sceglie il glifo nella rampa: chiaro → glifo denso, scuro → spazio. Per il look "chiaro su scuro" inverti la rampa o scambia `color` e `background`.
- **`resolution`**: più colonne = più dettaglio (e più caratteri da disegnare). 90–130 è il punto giusto per un ritratto. Le righe seguono sempre `resolution * 0.55` per via del passo verticale del monospace.
- **`charset`**: usa un preset (`standard`, `blocks`, `minimal`, `dots`) o passa una rampa custom (es. `" .oO@"`). Il primo carattere è il "vuoto", l'ultimo il "pieno".
- **`color`**: tinta unita (un hex) oppure `"original"` per ricolorare ogni glifo col pixel campionato.
- **`animationStyle`**: `"fade"` dissolve l'intera griglia; `"typewriter"` rivela in ordine di lettura; `"matrix"` rivela colonna per colonna dall'alto.
- **`animateOnView`**: con `useInView(..., { once: true })` l'animazione parte una sola volta quando il canvas entra nel viewport.
- **Nitidezza**: il canvas è disegnato a 2x (`SUPERSAMPLE`) e scalato via CSS, così i glifi restano puliti su schermi hi-dpi.

### File 2: `components/ascii-art-demo.tsx`

La demo, personalizzata col nostro brand: un ritratto reso a inchiostro su carta. Inchiostro `#26221d` su fondo parchment `#efe9dc`, 110 colonne, rivelazione typewriter.

```tsx
import { AsciiArt } from "@/components/ui/ascii-art";
import React from "react";

export default function AsciiArtDemo() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-[#efe9dc] px-6 py-12">
      <div className="aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-md border border-[#26221d]/12 shadow-xl">
        <AsciiArt
          src="https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=1280&q=85&fm=webp"
          resolution={110}
          charset="standard"
          color="#26221d"
          background="#efe9dc"
          animationStyle="typewriter"
          animationDuration={1500}
        />
      </div>
      <p className="text-center font-mono text-xs uppercase tracking-[0.14em] text-[#6b6256]">
        ritratto reso in caratteri, 110 colonne
      </p>
    </div>
  );
}
```

Personalizzazioni applicate, da tenere o adattare al tuo brand:

- `src` con un ritratto Unsplash ad alto contrasto: la luce direzionale dà alla rampa una bella gamma tonale. Serve una sorgente con CORS aperto (`images.unsplash.com` va bene).
- `color="#26221d"` su `background="#efe9dc"`: inchiostro scuro su carta. Per il look opposto (caratteri chiari su pannello scuro) scambia i due valori.
- `resolution={110}`: ritratto leggibile senza appesantire il rendering. Sali a 130 per più dettaglio.
- `animationStyle="typewriter"` con `animationDuration={1500}`: la foto si "scrive" da sola in lettura. Prova `"fade"` per una dissolvenza o `"matrix"` per la rivelazione a colonne.
- Il contenitore `aspect-[4/5]` tiene la proporzione del ritratto; cambiala (es. `aspect-square`) e il cover-fit interno si adatta.

L'effetto parte da solo quando il canvas entra nel viewport (`animateOnView`), quindi funziona come immagine di sezione che si compone allo scroll.
