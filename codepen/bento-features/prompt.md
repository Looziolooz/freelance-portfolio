Build a **"Features" bento section** (an adaptation of the Aceternity UI `FeaturesSection`) for an Italian freelance studio site, using **React + TypeScript + Tailwind CSS v4 + shadcn/ui**. It is a centered heading over a `lg:grid-cols-6` grid of four feature cells. Each cell has a title, a short description, and a visual "skeleton" pinned to its lower half:

1. a product **screenshot** with soft fade gradients top and bottom,
2. a **fan** of three small rotated photos,
3. a **video thumbnail** with a play button, where the image blurs on hover,
4. a real, auto-spinning **WebGL globe** drawn with `cobe`, peeking out of the cell corner.

Light parchment theme, ink text, ochre-gold accents. Match the structure, the four skeletons, and the globe exactly. Copy is Italian.

---

### 1. Setup

Assumes a React + TypeScript app with Tailwind CSS v4 and shadcn/ui already initialized (`npx shadcn@latest init`). Then:

```bash
npm install motion @tabler/icons-react cobe
```

- **`motion`** — animation library (the `motion/react` import path; the successor to framer-motion). Used here for the per-cell entrance fade.
- **`@tabler/icons-react`** — icon set for the cell glyphs and the play button.
- **`cobe`** — a tiny (~5kb) WebGL globe. Its default export `createGlobe` paints a spinning globe onto a `<canvas>`.

shadcn/ui gives you the `cn` helper at **`@/lib/utils`** (it merges class names with `clsx` + `tailwind-merge`). All custom components go under **`@/components/ui/`**. If `@/lib/utils` is missing, create it:

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### Brand tokens (Tailwind v4, in your global CSS)

Tailwind v4 reads design tokens from an `@theme` block. Add these so the parchment palette is available as utilities (`bg-parchment`, `text-ink`, `text-gold`, etc.):

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-parchment: #efe9dc;
  --color-parchment-soft: #f4efe4;
  --color-ink: #26221d;
  --color-ink-muted: #6b6256;
  --color-gold: #c8972e;
  --color-forest: #1f4d3a;
  --color-teal: #2f6f68;

  --font-display: "Fraunces", Georgia, serif;
  --font-sans: "General Sans", ui-sans-serif, system-ui, sans-serif;
}
```

Load **Fraunces** (display) and **General Sans** (body) however your app loads fonts (next/font, a `<link>`, or Fontshare for General Sans). The heading and cell titles use `font-display`; everything else uses `font-sans`.

> Accessibility note on gold: when a surface is filled with `--color-gold`, the text or icon on top must be **dark** (`text-ink`), never white. The play button below follows this.

---

### 2. The section shell — `FeaturesSection`

```tsx
// components/ui/features-section.tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  SkeletonScreenshot,
  SkeletonFan,
  SkeletonVideo,
  SkeletonGlobe,
} from "./feature-skeletons";

const features = [
  {
    title: "Siti che convertono",
    description:
      "Pagine veloci e curate nei dettagli, pensate per guidare ogni visita verso una richiesta di contatto.",
    skeleton: <SkeletonScreenshot />,
    className: "col-span-1 lg:col-span-3 border-b lg:border-r",
  },
  {
    title: "Contenuti che si notano",
    description:
      "Foto, reel e caroselli pronti per i social, con un'identità riconoscibile in ogni scatto.",
    skeleton: <SkeletonFan />,
    className: "col-span-1 lg:col-span-3 border-b",
  },
  {
    title: "Guarda i risultati",
    description:
      "Un breve video racconta i numeri reali dei progetti: traffico, contatti e vendite a confronto.",
    skeleton: <SkeletonVideo />,
    className: "col-span-1 lg:col-span-3 lg:border-r",
  },
  {
    title: "I tuoi clienti, ovunque",
    description:
      "Visibilità e automazioni che lavorano giorno e notte, raggiungendo le persone giuste in ogni fuso orario.",
    skeleton: <SkeletonGlobe />,
    className: "col-span-1 lg:col-span-3",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl lg:text-[2.85rem] lg:leading-[1.05]">
          Tutto quello che serve per crescere online.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-muted lg:text-lg">
          Dal sito alle automazioni: gli strumenti giusti per trasformare i
          visitatori in clienti, senza disperdere tempo o budget.
        </p>
      </div>

      <div className="mt-14 overflow-hidden rounded-3xl border border-ink/10">
        <div className="grid grid-cols-1 lg:grid-cols-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} className={feature.className} index={i}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}

const FeatureCard = ({
  children,
  className,
  index,
}: {
  children?: React.ReactNode;
  className?: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex min-h-[20rem] flex-col overflow-hidden border-ink/10 bg-parchment-soft p-7",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => (
  <h3 className="font-display text-xl font-medium tracking-tight text-ink">
    {children}
  </h3>
);

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => (
  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
    {children}
  </p>
);
```

Notes that make the bento read right:
- Grid is `lg:grid-cols-6`; every cell spans **3** columns, so two cells per row on desktop, one per row on mobile.
- The borders (`lg:border-r`, `border-b`) are applied per cell in `className` so the grid draws clean interior dividers without doubling on the edges.
- Each card is `relative` + `overflow-hidden` so the skeletons can be absolutely pinned and the globe can spill past the corner.

---

### 3. The four skeletons + the Globe — `feature-skeletons.tsx`

All skeletons live in the lower portion of the card, below the title/description. They use verified Unsplash images (the `w=1280&q=85&fm=webp` query keeps them light).

```tsx
// components/ui/feature-skeletons.tsx
"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/* ── 1 · Site screenshot with top + bottom fade gradients ───────────────── */
export const SkeletonScreenshot = () => (
  <div className="group relative mt-6 h-44 w-full">
    <div className="absolute inset-0 overflow-hidden rounded-t-2xl shadow-[0_-6px_30px_rgba(38,34,29,0.08)]">
      <div
        className="absolute inset-0 bg-cover bg-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1280&q=85&fm=webp')",
        }}
      />
      {/* top + bottom fades into the parchment card */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-parchment-soft to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-parchment-soft to-transparent" />
    </div>
  </div>
);

/* ── 2 · Fan of small rotated photos ────────────────────────────────────── */
const fanPhotos = [
  { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1280&q=85&fm=webp", rotate: "-rotate-[11deg]", z: "z-10" },
  { url: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1280&q=85&fm=webp", rotate: "rotate-0", z: "z-20" },
  { url: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=1280&q=85&fm=webp", rotate: "rotate-[11deg]", z: "z-10" },
];

export const SkeletonFan = () => (
  <div className="group relative mt-6 flex h-44 w-full items-center justify-center">
    {fanPhotos.map((p, i) => (
      <div
        key={i}
        className={cn(
          "mx-[-14px] h-[138px] w-[108px] rounded-xl border-4 border-parchment-soft bg-cover bg-center shadow-[0_10px_26px_rgba(38,34,29,0.16)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          p.rotate,
          p.z,
          i === 0 && "group-hover:-translate-x-3 group-hover:-rotate-[15deg]",
          i === 1 && "group-hover:-translate-y-3",
          i === 2 && "group-hover:translate-x-3 group-hover:rotate-[15deg]"
        )}
        style={{ backgroundImage: `url('${p.url}')` }}
      />
    ))}
  </div>
);

/* ── 3 · Video thumbnail with play button (blurs on hover) ──────────────── */
export const SkeletonVideo = () => (
  <button
    type="button"
    aria-label="Riproduci il video dei risultati"
    className="group relative mt-6 block h-44 w-full overflow-hidden rounded-2xl"
  >
    <div
      className="absolute inset-0 bg-cover bg-center transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:blur-[5px]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1551434678-e076c223a692?w=1280&q=85&fm=webp')",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-ink/5" />
    {/* gold disc, DARK icon on gold — never white */}
    <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ink shadow-[0_12px_30px_rgba(200,151,46,0.4)] transition-transform duration-300 group-hover:scale-110">
      <IconPlayerPlayFilled className="ml-0.5 h-5 w-5" />
    </span>
  </button>
);

/* ── 4 · Spinning cobe globe peeking from the corner ────────────────────── */
export const SkeletonGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    const onRender = (state: Record<string, unknown>) => {
      state.phi = phi;
      phi += 0.006;
    };

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: 600,
      height: 600,
      phi: 0,
      theta: 0.28,
      dark: 0, // light globe to sit on the parchment card
      diffuse: 1.1,
      mapSamples: 16000,
      mapBrightness: 5.4,
      baseColor: [0.184, 0.435, 0.408], // teal  #2f6f68
      markerColor: [0.784, 0.592, 0.18], // gold  #c8972e
      glowColor: [0.937, 0.914, 0.863], // parchment glow
      markers: [
        { location: [41.9028, 12.4964], size: 0.06 }, // Roma
        { location: [45.4642, 9.19], size: 0.05 }, // Milano
        { location: [40.8518, 14.2681], size: 0.045 }, // Napoli
        { location: [48.8566, 2.3522], size: 0.05 }, // Parigi
        { location: [51.5074, -0.1278], size: 0.05 }, // Londra
        { location: [40.7128, -74.006], size: 0.05 }, // New York
        { location: [59.3293, 18.0686], size: 0.045 }, // Stoccolma
      ],
      onRender,
    });

    return () => globe.destroy();
  }, []);

  return (
    <div className="relative mt-6 h-44 w-full">
      {/* the globe is larger than the cell and spills past the bottom edge */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute left-1/2 top-8 aspect-square h-[300px] w-[300px] -translate-x-1/2"
        style={{ contain: "layout paint size" }}
      />
    </div>
  );
};
```

How the **Globe** works:
- `createGlobe(canvas, opts)` returns a globe instance; call `globe.destroy()` in the effect cleanup so React strict-mode / unmount doesn't leak WebGL contexts.
- The render is driven by `onRender(state)`: bumping `state.phi` by a tiny amount each frame is what produces the slow auto-rotation. `theta` tilts the axis so the lit hemisphere faces the viewer.
- Colors are RGB triples in the `0..1` range. The values above are the brand hexes converted: teal base, gold markers, parchment glow.
- Render at 2x the CSS size (`width/height: 600` for a 300px canvas) for a crisp globe on retina; the `markers` are the cities you serve, gold dots on the surface.
- `dark: 0` keeps the globe light so it reads on the parchment card; flip to `1` for a dark theme.

---

### 4. Use it

```tsx
import { FeaturesSection } from "@/components/ui/features-section";

export default function Page() {
  return (
    <main className="bg-parchment">
      <FeaturesSection />
    </main>
  );
}
```

### Customizing

- **Swap the cells** by editing the `features` array: change titles, descriptions, and which skeleton each cell uses.
- **Different images**: replace the Unsplash URLs in `SkeletonScreenshot`, `SkeletonFan`, and `SkeletonVideo`. Keep the `?w=1280&q=85&fm=webp` query for small, fast images.
- **Globe cities**: edit the `markers` array (`[latitude, longitude]`, plus a `size`) to highlight the places your clients are.
- **Three columns instead of two**: set the grid to `lg:grid-cols-3` and give each cell `lg:col-span-1`. Adjust the per-cell border classes so the dividers still line up.
- **Reduced motion**: the entrance animation already runs once on view; if you want to disable it, gate the `motion.div` props behind a `useReducedMotion()` check from `motion/react`.
