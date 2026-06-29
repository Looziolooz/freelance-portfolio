Build a scroll-driven **vertical Timeline** as a reusable component, using **React + Tailwind CSS v4 + TypeScript**, **motion/react** for the scroll animation, and shadcn/ui conventions (the `cn` helper from `@/lib/utils`, file under `components/ui`). A thin rail on the left fills with a gradient as the visitor scrolls through the timeline; each entry has a sticky dot marker and a big sticky year/label that stays pinned while its content (a paragraph plus a 2-column image grid, or a checklist) scrolls past on the right. The demo is personalized for our studio: the milestones of a small web studio, on a light parchment theme with ink text. Match every detail below.

## Setup

Assumes an existing app with **shadcn/ui** initialized (`components.json` present, Tailwind v4, the `cn` helper at `@/lib/utils`). If not, run:

```bash
npx shadcn@latest init        # Tailwind v4 + TypeScript, writes @/lib/utils with cn()
```

Install the runtime dep:

```bash
npm i motion
```

`cn` should already exist at `@/lib/utils` from the shadcn init:

```ts
// @/lib/utils
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Tailwind v4 needs no `tailwind.config` for this. The masked rail uses arbitrary properties (`[mask-image:...]`, `[linear-gradient(...)]`), which Tailwind v4 passes through. The brand colors below are hard-coded as arbitrary values so the component drops into any theme; swap them for your design tokens if you have them.

### Brand palette (this studio)

| token        | hex       | used for                                    |
| ------------ | --------- | ------------------------------------------- |
| parchment    | `#efe9dc` | page canvas                                 |
| parchment-2  | `#f4efe4` | marker fill, lighter canvas stop            |
| ink          | `#26221d` | body text                                   |
| ink-muted    | `#6b6256` | sticky year labels, subtitle                |
| ochre-gold   | `#c8972e` | rail fill (leading edge)                    |
| forest       | `#1f4d3a` | rail fill (trailing), checklist ticks, accents |
| teal         | `#2f6f68` | optional cool accent                        |

The rail gradient runs **ochre-gold → forest** (this replaces the original purple/blue). Gold fills always carry dark text, never white.

## Component file

Create `components/ui/timeline.tsx`. This is the canonical Timeline: `useScroll` bound to the container with `offset: ["start 10%", "end 50%"]`, `useTransform` driving the fill height and opacity, sticky labels, and the masked gradient rail.

```tsx
"use client";

import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TimelineEntry {
  /** The year or label, e.g. "2024" or "Oggi". */
  title: string;
  /** The right-hand content: a paragraph + image grid, a checklist, anything. */
  content: React.ReactNode;
}

export const Timeline = ({
  data,
  heading = "Il percorso dello studio.",
  subtitle = "Dai primi siti agli agenti AI di oggi, un anno alla volta.",
}: {
  data: TimelineEntry[];
  heading?: string;
  subtitle?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Measure the rail's full height so the fill can map progress -> pixels.
  // Re-measure on resize and after images load (they change layout height).
  useEffect(() => {
    const measure = () => {
      if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  // Optional: log progress while tuning the offsets.
  useMotionValueEvent(scrollYProgress, "change", () => {});

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-[#efe9dc] font-sans md:px-10"
      ref={containerRef}
      style={{
        backgroundImage:
          "radial-gradient(1200px 700px at 50% -8%, #f4efe4 0%, #efe9dc 60%, #ece5d6 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
        <h2 className="mb-4 max-w-4xl font-serif text-2xl font-semibold tracking-tight text-[#26221d] md:text-5xl">
          {heading}
        </h2>
        <p className="max-w-sm text-sm text-[#6b6256] md:text-base">{subtitle}</p>
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:gap-10 md:pt-40"
          >
            {/* Sticky column: dot marker + big year label, pinned while content scrolls. */}
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f4efe4] shadow-[0_2px_10px_-4px_rgba(38,34,29,0.25)] md:left-3">
                <div className="h-3.5 w-3.5 rounded-full border border-[#d8cdb6] bg-[#efe9dc] shadow-[0_0_0_3px_rgba(200,151,46,0.16)]" />
              </div>
              <h3 className="hidden font-serif text-xl font-semibold text-[#6b6256] md:block md:pl-20 md:text-5xl">
                {item.title}
              </h3>
            </div>

            {/* Content column */}
            <div className="relative w-full pr-4 pl-20 md:pl-4">
              <h3 className="mb-4 block text-left font-serif text-2xl font-semibold text-[#6b6256] md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* The rail: a faint masked track with a gradient fill that grows on scroll. */}
        <div
          style={{ height: height + "px" }}
          className={cn(
            "absolute top-0 left-8 w-[2px] overflow-hidden",
            "[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]",
            "bg-[linear-gradient(to_bottom,transparent_0%,rgba(38,34,29,0.14)_12%,rgba(38,34,29,0.14)_88%,transparent_100%)]",
          )}
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-[linear-gradient(to_top,#1f4d3a_0%,#c8972e_80%,rgba(200,151,46,0)_100%)]"
          />
        </div>
      </div>
    </div>
  );
};
```

Notes on the rail:

- The outer track is positioned at `left-8` (32px). The dot markers are at `left-3` and are 40px wide, so the dot's center lands on the rail. If you change `left-8`, move the markers to match.
- `[mask-image:...]` fades the track (and the fill) to transparent at the top and bottom 10%, so it never ends with a hard edge.
- The fill uses `bg-[linear-gradient(to_top,...)]`: forest at the bottom, ochre-gold near the top, fading to transparent at the very tip. Because the gradient is `to top` and the element grows downward, the bright gold edge always leads the fill as it descends.

## Demo file (personalized for our clients)

Create `components/timeline-demo.tsx`. Three milestones of the studio, Italian-first, light parchment theme, ink text. Each entry is a paragraph plus a 2-column image grid; the last entry is a checklist of what is live now plus a grid.

```tsx
import React from "react";
import { Timeline } from "@/components/ui/timeline";

// Small helpers so the demo stays readable.
function Grid({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((img) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          loading="lazy"
          className="h-20 w-full rounded-xl object-cover shadow-[0_8px_22px_-10px_rgba(38,34,29,0.28),0_24px_40px_-24px_rgba(38,34,29,0.22)] md:h-44 lg:h-60"
        />
      ))}
    </div>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15px] leading-snug text-[#26221d] md:text-[17px]">
      <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#1f4d3a]">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#f4efe4" strokeWidth="3">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </li>
  );
}

const para =
  "mb-6 max-w-[56ch] text-[15px] leading-relaxed text-[#26221d] md:text-[17px]";

export default function TimelineDemo() {
  const data = [
    {
      title: "2024",
      content: (
        <div>
          <p className={para}>
            Lo studio prende forma. I primi siti vanno online e arrivano i primi
            clienti felici, quelli che ti chiamano per dirti grazie. Poco codice
            inutile, molta cura, e la voglia di fare le cose per bene.
          </p>
          <Grid
            images={[
              {
                src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=85&fm=webp",
                alt: "Spazio di lavoro luminoso dello studio",
              },
              {
                src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&q=85&fm=webp",
                alt: "Interni di un ufficio moderno con vetrate",
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: "2025",
      content: (
        <div>
          <p className={para}>
            Arrivano gli e-commerce e la visibilita su Google. I clienti iniziano
            a vendere mentre dormono e a farsi trovare da chi li cerca. Con loro
            crescono anche i progetti, i primi piu grandi e ambiziosi.
          </p>
          <Grid
            images={[
              {
                src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1280&q=85&fm=webp",
                alt: "Acquisti online da un negozio e-commerce",
              },
              {
                src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&q=85&fm=webp",
                alt: "Grafici e dati di un progetto in crescita",
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: "Oggi",
      content: (
        <div>
          <p className={para}>Quello che e gia vivo, oggi, per chi lavora con lo studio.</p>
          <ul className="mb-7 flex max-w-[56ch] flex-col gap-3">
            <Check>Siti che vendono, non solo belli da guardare</Check>
            <Check>Agenti AI che rispondono ai clienti al posto tuo</Check>
            <Check>Automazioni che tolgono il lavoro ripetitivo</Check>
            <Check>Componenti pronti, da rivendere e riusare</Check>
          </ul>
          <Grid
            images={[
              {
                src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1280&q=85&fm=webp",
                alt: "Codice di un sito su uno schermo pulito",
              },
              {
                src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1280&q=85&fm=webp",
                alt: "Designer al lavoro su un progetto creativo",
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <Timeline
      data={data}
      heading="Il percorso dello studio."
      subtitle="Dai primi siti agli agenti AI di oggi, un anno alla volta."
    />
  );
}
```

## How the motion works

- **`useScroll`** is bound to `containerRef` (the whole component) with `offset: ["start 10%", "end 50%"]`. So `scrollYProgress` is 0 when the container's top reaches 10% down the viewport, and 1 when the container's bottom reaches the middle of the viewport. That window is what the fill animates across.
- **Rail height** is measured from the inner `ref` (the entries' wrapper) with `getBoundingClientRect().height` on mount, on resize, and you should re-measure after images load since they change the layout height.
- **`heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])`** maps progress to pixels: the gradient fill grows from 0 to the full rail height as you scroll.
- **`opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])`** fades the fill in over the first 10% so it does not pop on at the top.
- **Sticky labels**: each entry's left column is `sticky top-40`, so the big year stays pinned while its paragraph and images scroll past on the right, then releases when the next entry pushes it up.

## Brand and accessibility notes

- The rail gradient is **ochre-gold → forest** (`to_top, #1f4d3a 0%, #c8972e 80%, transparent 100%`); this is the brand replacement for the original purple/blue. Keep gold for the leading edge and forest for the trail.
- Year labels are intentionally **muted ink** (`#6b6256`), so they read as quiet timestamps and let the content lead.
- Provide real `alt` text on every image (the demo does). Swap the Unsplash placeholders for real photos of the studio's work whenever you have them.
- For reduced motion: gate with `prefers-reduced-motion`. The component is already readable with the rail un-filled, so the simplest path is to render the fill at full height (skip the `useTransform`) so the timeline is fully visible without scrolling.
- Headline uses a serif display face (`font-serif`) for the brand voice. If you have a serif token configured (e.g. Fraunces via a CSS variable), swap `font-serif` for it.
```
