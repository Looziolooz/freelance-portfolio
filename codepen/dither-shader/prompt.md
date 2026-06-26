Build a reusable **`DitherShader`** React component that renders any image to a `<canvas>` with real-time **ordered dithering** (Bayer 4×4 / 8×8, plus halftone, noise and crosshatch modes) and a configurable **colorMode** (grayscale, duotone, custom palette, or original-quantized). Ship it as a shadcn/ui-style primitive: **Tailwind CSS v4 + TypeScript**, `cn` imported from `@/lib/utils`, file placed under `components/ui/`. The demo is personalized as an on-brand ink-on-parchment duotone poster.

## Project setup (shadcn/ui + Tailwind v4 + TypeScript)

Assumes a React app with TypeScript. If shadcn/ui is not initialised yet:

```bash
# Tailwind v4
npm install tailwindcss @tailwindcss/vite
# shadcn CLI (writes components.json, sets up the components/ui alias)
npx shadcn@latest init
```

`app/globals.css` (Tailwind v4 uses a single import, no `tailwind.config` needed for this component):

```css
@import "tailwindcss";
```

Make sure the `@/lib/utils` helper exists (shadcn creates it on `init`). If not, add it:

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```bash
npm install clsx tailwind-merge
```

Path alias (`tsconfig.json`) so `@/lib/utils` and `@/components/ui` resolve:

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

## The component — `components/ui/dither-shader.tsx`

Drop this file in as-is. It is fully typed, framework-agnostic (no other deps), and uses `cn` for class composition.

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

export type DitherMode = "bayer4" | "bayer8" | "halftone" | "noise" | "crosshatch";
export type ColorMode = "grayscale" | "duotone" | "palette" | "original";
export type ObjectFit = "cover" | "contain";

export interface DitherShaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Image URL. Use crossOrigin-safe hosts (e.g. images.unsplash.com) for pixel reads. */
  src: string;
  /** Source pixels per dither cell. Higher = chunkier. 1–8. Default 3. */
  gridSize?: number;
  /** Dither algorithm. Default "bayer8". */
  ditherMode?: DitherMode;
  /** How output pixels are coloured. Default "duotone". */
  colorMode?: ColorMode;
  /** Swap light/dark. Default false. */
  invert?: boolean;
  /** Dark tone for duotone (hex). Default "#26221d". */
  primaryColor?: string;
  /** Light tone for duotone (hex). Default "#f4efe4". */
  secondaryColor?: string;
  /** Palette for colorMode="palette" (hex[]). Mapped by luminance bands. */
  palette?: string[];
  /** Threshold bias, -255..255. Default 0. */
  threshold?: number;
  /** Brightness, -255..255. Default 0. */
  brightness?: number;
  /** Contrast, -255..255. Default 0. */
  contrast?: number;
  /** Animate the dither (shifts the matrix each frame). Default false. */
  animated?: boolean;
  /** Frames-per-shift when animated. 1 = every frame. Default 6. */
  animationSpeed?: number;
  /** How the image fills the canvas. Default "cover". */
  objectFit?: ObjectFit;
}

/* ---------------------------------------------------------------------------
 * Dither matrices (normalised at runtime to 0..1 thresholds)
 * ------------------------------------------------------------------------- */

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

interface RGB { r: number; g: number; b: number; }

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

/* ---------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------- */

export function DitherShader({
  src,
  gridSize = 3,
  ditherMode = "bayer8",
  colorMode = "duotone",
  invert = false,
  primaryColor = "#26221d",
  secondaryColor = "#f4efe4",
  palette,
  threshold = 0,
  brightness = 0,
  contrast = 0,
  animated = false,
  animationSpeed = 6,
  objectFit = "cover",
  className,
  ...rest
}: DitherShaderProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const rafRef = React.useRef<number>(0);
  const frameRef = React.useRef<number>(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const primary = hexToRgb(primaryColor);
    const secondary = hexToRgb(secondaryColor);
    const paletteRgb = (palette ?? []).map(hexToRgb);

    /** Ordered-dither threshold for cell (x, y), returns 0..1.
     *  shift lets us animate by rotating the matrix origin. */
    function orderedThreshold(x: number, y: number, shift: number): number {
      if (ditherMode === "bayer4") {
        const n = 4, div = 16;
        return (BAYER_4[(y + shift) % n][(x + shift) % n] + 0.5) / div;
      }
      if (ditherMode === "bayer8") {
        const n = 8, div = 64;
        return (BAYER_8[(y + shift) % n][(x + shift) % n] + 0.5) / div;
      }
      if (ditherMode === "noise") {
        // Hashed white noise — stable per-cell, jitters with shift when animated.
        const s = Math.sin((x + shift) * 12.9898 + (y + shift) * 78.233) * 43758.5453;
        return s - Math.floor(s);
      }
      if (ditherMode === "halftone") {
        // Concentric dot screen: distance from a 4×4 cell centre → ring threshold.
        const cx = ((x % 4) - 1.5) / 1.5;
        const cy = ((y % 4) - 1.5) / 1.5;
        return Math.min(1, Math.sqrt(cx * cx + cy * cy) / 1.4142);
      }
      // crosshatch: diagonal line screens that cross as it darkens.
      const a = (x + y + shift) % 4 === 0 ? 0.25 : 1;
      const b = (x - y + shift) % 4 === 0 ? 0.25 : 1;
      return Math.min(a, b);
    }

    /** Map a 0..255 luminance + on/off decision to an output RGB. */
    function colourFor(lum: number, on: boolean): RGB {
      switch (colorMode) {
        case "grayscale": {
          const v = on ? 255 : 0;
          return { r: v, g: v, b: v };
        }
        case "duotone":
          return on ? secondary : primary;
        case "palette": {
          if (!paletteRgb.length) return on ? secondary : primary;
          // Quantise luminance into palette bands; dithering selects neighbours.
          const idx = Math.min(
            paletteRgb.length - 1,
            Math.floor((lum / 255) * paletteRgb.length + (on ? 0.5 : -0.5)),
          );
          return paletteRgb[clampIdx(idx, paletteRgb.length)];
        }
        case "original":
        default: {
          // Quantise the original colour to 2 levels per channel using the same
          // on/off bit, so the photo keeps its hue but gains the dither texture.
          const k = on ? 255 : 0;
          return { r: k, g: k, b: k };
        }
      }
    }

    function clampIdx(i: number, len: number) {
      return i < 0 ? 0 : i > len - 1 ? len - 1 : i;
    }

    function draw() {
      const img = imgRef.current;
      if (!img || !canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const lowW = Math.max(2, Math.round(rect.width / gridSize));
      const lowH = Math.max(2, Math.round(rect.height / gridSize));
      if (canvas.width !== lowW) canvas.width = lowW;
      if (canvas.height !== lowH) canvas.height = lowH;

      // object-fit crop (centred).
      const ir = img.width / img.height;
      const cr = lowW / lowH;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      const fitCover = objectFit === "cover";
      if (fitCover ? ir > cr : ir < cr) {
        sw = img.height * cr; sx = (img.width - sw) / 2;
      } else {
        sh = img.width / cr; sy = (img.height - sh) / 2;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, lowW, lowH);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, lowW, lowH);

      const image = ctx.getImageData(0, 0, lowW, lowH);
      const d = image.data;
      const cf = (259 * (contrast + 255)) / (255 * (259 - contrast));
      const shift = animated ? Math.floor(frameRef.current / animationSpeed) % 8 : 0;
      const keepHue = colorMode === "original" || colorMode === "palette";

      for (let y = 0; y < lowH; y++) {
        for (let x = 0; x < lowW; x++) {
          const i = (y * lowW + x) * 4;

          let lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          lum += brightness;
          lum = cf * (lum - 128) + 128;
          lum = clamp255(lum);

          const t = orderedThreshold(x, y, shift) * 255 + threshold;
          let on = lum > t;
          if (invert) on = !on;

          if (colorMode === "original" && keepHue) {
            // Keep the source hue, dither only the brightness via the matrix.
            const f = on ? 1.15 : 0.6;
            d[i] = clamp255(d[i] * f);
            d[i + 1] = clamp255(d[i + 1] * f);
            d[i + 2] = clamp255(d[i + 2] * f);
            d[i + 3] = 255;
          } else {
            const c = colourFor(lum, on);
            d[i] = c.r; d[i + 1] = c.g; d[i + 2] = c.b; d[i + 3] = 255;
          }
        }
      }
      ctx.putImageData(image, 0, 0);
    }

    function loop() {
      frameRef.current++;
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    const img = new Image();
    img.crossOrigin = "anonymous"; // required to read pixels without tainting
    img.onload = () => {
      imgRef.current = img;
      if (animated) loop();
      else draw();
    };
    img.src = src;

    const onResize = () => { if (!animated) draw(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [
    src, gridSize, ditherMode, colorMode, invert, primaryColor, secondaryColor,
    palette, threshold, brightness, contrast, animated, animationSpeed, objectFit,
  ]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)} {...rest}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full [image-rendering:pixelated]"
        aria-hidden
      />
    </div>
  );
}
```

### Notes on the algorithm

- **Resolution trick.** The canvas backing store is sized to `width / gridSize` so each source cell becomes one canvas pixel, then CSS scales it up with `image-rendering: pixelated`. That keeps the dither crisp instead of blurred, and makes the work cheap (you process a small buffer, not the full frame).
- **Ordered dithering.** Every cell compares its luminance against a position-dependent threshold from the Bayer matrix (normalised `(value + 0.5) / N²`). Because the matrix tiles the plane, you get the classic structured grain with no per-pixel error to carry — fast and deterministic.
- **Luminance + tone.** Luminance is the perceptual `0.299/0.587/0.114` mix, then `brightness` (additive) and `contrast` (standard contrast factor) are applied before thresholding.
- **colorMode.** `duotone` maps the on/off bit to `secondaryColor`/`primaryColor`; `grayscale` to white/black; `palette` quantises luminance into palette bands; `original` keeps the source hue and dithers only its brightness.
- **animated.** Rotates the matrix origin by `frame / animationSpeed`, so the grain shimmers without recomputing the source.
- **CORS.** `crossOrigin="anonymous"` plus a host that returns `Access-Control-Allow-Origin: *` (Unsplash does) is what lets `getImageData` read pixels instead of throwing a security error.

## Personalised demo — `app/page.tsx` (or any route)

An on-brand poster: a premium portrait rendered as an ink-on-parchment duotone inside a rounded, bordered frame with a small caption. The duotone uses **ink `#26221d`** for shadows and **parchment `#f4efe4`** for highlights.

```tsx
import { DitherShader } from "@/components/ui/dither-shader";

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-7 bg-[#efe9dc] p-12 text-[#26221d]">
      <figure className="flex w-[min(420px,86vw)] flex-col gap-3.5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-[#26221d]/15 bg-[#f4efe4] shadow-[0_26px_60px_-28px_rgba(38,34,29,0.55)]">
          <DitherShader
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=85&fm=webp"
            gridSize={3}
            ditherMode="bayer8"
            colorMode="duotone"
            primaryColor="#26221d"     /* ink — shadows */
            secondaryColor="#f4efe4"   /* parchment — highlights */
            contrast={18}
            brightness={6}
            objectFit="cover"
          />
        </div>
        <figcaption className="flex items-baseline justify-between gap-3 text-xs text-[#26221d]/70">
          <span className="font-serif text-[15px] italic text-[#1f4d3a]">
            Poster · duotono
          </span>
          <span className="tabular-nums tracking-wide">Bayer 8×8 · ink / parchment</span>
        </figcaption>
      </figure>

      <div className="w-[min(420px,86vw)] text-center">
        <p className="mb-1.5 font-serif text-[26px] italic">DitherShader</p>
        <p className="text-[13.5px] leading-relaxed text-[#26221d]/70">
          Una foto resa su canvas con dithering ordinato. Niente filtri pesanti:
          solo una matrice di soglie e due colori scelti bene.
        </p>
      </div>
    </main>
  );
}
```

Swap `ditherMode` to `bayer4`, `halftone`, `noise` or `crosshatch`, or set `colorMode="palette"` with a `palette={["#26221d","#1f4d3a","#c8972e","#f4efe4"]}` to get a four-tone poster. For a quiet animation, pass `animated animationSpeed={8}`.
