Build the Aceternity **Carousel** (3D perspective slider) in React + TypeScript styled with **shadcn/ui** + **Tailwind CSS v4**. Full-bleed square slides sit inside a `perspective` stage: the active slide is flat and large, the inactive ones scale down and tilt back a few degrees on the X axis, and the active slide's image parallax-shifts toward the cursor. A title and a white pill button overlay the active slide; round prev/next controls below slide the deck between cards on a `translateX` track. Reproduce both files below faithfully. The demo is personalized for **Lorenzo.studio** (Italian copy, parchment surface, ochre-gold and forest-green accents).

## Setup checklist

1. A React app with **TypeScript** (Next.js App Router or Vite).
2. **Tailwind CSS v4** installed and wired up.
3. **shadcn/ui** initialized:
   ```bash
   npx shadcn@latest init
   ```
   This creates `@/lib/utils` exporting `cn` and sets the default component path to `@/components/ui`.
4. Install the icon dependency:
   ```bash
   npm i @tabler/icons-react
   ```
5. If you don't have it yet, the `cn` helper (`@/lib/utils`):
   ```ts
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
6. Fonts: the demo uses **Fraunces** (display) and **General Sans** (body). Load them however your stack prefers (`next/font`, a `<link>`, or a `@font-face`/Fontshare import). They aren't required for the mechanic, so swap in your own brand fonts freely.

Two files: `components/ui/carousel-3d.tsx` (the reusable primitive, verbatim) and `components/carousel-3d-demo.tsx` (our personalized usage).

---

## `components/ui/carousel-3d.tsx`

Copy this verbatim. `Carousel` owns the perspective stage, the active index, the `translateX` track, autoplay, and prev/next. Each `Slide` reads whether it's active and, when active, listens to pointer movement on the stage to drive a CSS-variable parallax (`--x`/`--y`, divided by 30 in the transform). Inactive slides render scaled-down and `rotateX`-tilted.

```tsx
"use client";

import { cn } from "@/lib/utils";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type CarouselSlide = {
  title: string;
  src: string;
  button?: string;
  alt?: string;
};

type CarouselContextType = {
  current: number;
  stageRef: React.RefObject<HTMLDivElement | null>;
};

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined
);

const useCarousel = () => {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Slide must be used within <Carousel>");
  return ctx;
};

export const Carousel = ({
  slides,
  autoplay = true,
  interval = 4000,
  className,
}: {
  slides: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
  className?: string;
}) => {
  const [current, setCurrent] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (to: number) => setCurrent(((to % count) + count) % count),
    [count]
  );
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  // Autoplay: advance every `interval` ms; hovering the component pauses it.
  useEffect(() => {
    if (!autoplay || paused) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % count), interval);
    return () => clearInterval(id);
  }, [autoplay, paused, interval, count]);

  return (
    <CarouselContext.Provider value={{ current, stageRef }}>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-7",
          className
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Stage owns the perspective; overflow-hidden clips the off-screen slides */}
        <div
          ref={stageRef}
          className="relative h-[70vmin] max-h-[520px] w-[70vmin] max-w-[520px] overflow-hidden rounded-[26px] [perspective:1200px]"
        >
          <ul
            className="flex h-full transition-transform duration-700 [transform-style:preserve-3d] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <Slide key={slide.src} slide={slide} index={i} />
            ))}
          </ul>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Slide precedente"
            onClick={prev}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-black/15 bg-[#f4efe4] text-[#26221d] shadow-[0_10px_24px_-16px_rgba(38,34,29,0.6)] transition-all hover:-translate-y-px hover:border-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-[#f4efe4] active:translate-y-0 active:scale-95"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Slide successiva"
            onClick={next}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-black/15 bg-[#f4efe4] text-[#26221d] shadow-[0_10px_24px_-16px_rgba(38,34,29,0.6)] transition-all hover:-translate-y-px hover:border-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-[#f4efe4] active:translate-y-0 active:scale-95"
          >
            <IconArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

const Slide = ({ slide, index }: { slide: CarouselSlide; index: number }) => {
  const { current, stageRef } = useCarousel();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isActive = index === current;

  // Cursor parallax — only the active slide listens. Offset from the stage
  // centre is written to --x/--y; the transform divides by 30 so the image
  // drifts gently toward the pointer. Reset to 0 on leave or when deactivated.
  useEffect(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) return;

    const reset = () => {
      img.style.setProperty("--x", "0px");
      img.style.setProperty("--y", "0px");
    };

    if (!isActive) {
      reset();
      return;
    }

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      img.style.setProperty("--x", `${e.clientX - (r.left + r.width / 2)}px`);
      img.style.setProperty("--y", `${e.clientY - (r.top + r.height / 2)}px`);
    };

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", reset);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", reset);
    };
  }, [isActive, stageRef]);

  return (
    <li
      className={cn(
        "relative h-full w-full flex-[0_0_100%] origin-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isActive
          ? "scale-100 opacity-100 [transform:rotateX(0deg)]"
          : "scale-[0.82] opacity-55 saturate-[0.85] brightness-90 [transform:rotateX(8deg)]"
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[24px] shadow-[0_30px_70px_-34px_rgba(38,34,29,0.55)]">
        <img
          ref={imgRef}
          src={slide.src}
          alt={slide.alt ?? slide.title}
          draggable={false}
          style={{
            transform: isActive
              ? "translate(calc(var(--x,0px)/30), calc(var(--y,0px)/30)) scale(1.06)"
              : "translate(0,0) scale(1.04)",
          }}
          className="absolute -inset-[6%] h-[112%] w-[112%] select-none object-cover transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
        {/* Bottom shade so the title + pill stay legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#26221d]/60 via-[#26221d]/15 to-transparent" />

        {/* Overlay — fades/rises in only while the slide is active */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex flex-col items-start gap-[18px] p-[30px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            isActive
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3.5 opacity-0"
          )}
        >
          <h3 className="m-0 font-serif text-[clamp(26px,5.2vmin,40px)] font-semibold leading-[1.02] tracking-[-0.01em] text-[#f4efe4] [text-shadow:0_2px_18px_rgba(38,34,29,0.45)]">
            {slide.title}
          </h3>
          {slide.button && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#f4efe4] px-6 py-[11px] text-sm font-semibold text-[#26221d] shadow-[0_12px_28px_-14px_rgba(38,34,29,0.7)] transition-all hover:-translate-y-px hover:bg-white active:translate-y-0 active:scale-[0.97]"
            >
              {slide.button}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
```

---

## `components/carousel-3d-demo.tsx`

Our personalized demo: four square slides tied to what we ship, each with a white **Esplora** pill. Images are premium Unsplash photos, square-cropped to fit the slide.

```tsx
"use client";

import { Carousel, type CarouselSlide } from "@/components/ui/carousel-3d";

const slides: CarouselSlide[] = [
  {
    title: "Siti su misura",
    button: "Esplora",
    src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1000&h=1000&q=85&fit=crop&fm=webp",
    alt: "Scrivania luminosa con lavoro di design in corso",
  },
  {
    title: "E-commerce che converte",
    button: "Esplora",
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&h=1000&q=85&fit=crop&fm=webp",
    alt: "Carrello e acquisti, vetrina di un e-commerce",
  },
  {
    title: "Brand che si notano",
    button: "Esplora",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&h=1000&q=85&fit=crop&fm=webp",
    alt: "Spazio creativo curato per un brand riconoscibile",
  },
  {
    title: "Automazioni intelligenti",
    button: "Esplora",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&h=1000&q=85&fit=crop&fm=webp",
    alt: "Circuiti e tecnologia per automazioni intelligenti",
  },
];

export default function Carousel3DDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,#f4efe4_0%,#efe9dc_60%,#e8e1d1_100%)] px-5 py-8">
      <Carousel slides={slides} autoplay interval={4000} />
    </div>
  );
}
```

### How the effect works

- **Perspective stage.** The stage sets `[perspective:1200px]` and `overflow-hidden`, so the deck reads in 3D while off-screen slides are clipped. The `<ul>` is a flex track with `[transform-style:preserve-3d]`; moving `translateX(-current*100%)` slides one square into view at a time with a `cubic-bezier(0.16,1,0.3,1)` easing.
- **Active vs inactive.** The active slide is `scale-100` and flat (`rotateX(0deg)`); inactive slides are `scale-[0.82]`, dimmed (`opacity-55`, slight desaturate/darken) and tilted `rotateX(8deg)`, so they recede behind the active one.
- **Cursor parallax.** Only the active `Slide` attaches a `mousemove` listener to the stage. It writes the pointer's offset from the stage centre into `--x`/`--y`; the image transform is `translate(calc(var(--x)/30), calc(var(--y)/30)) scale(1.06)`, so the photo drifts gently toward the cursor and settles back on leave. The image is oversized (`-inset-[6%]`, `112%`) so the shift never exposes an edge.
- **Overlay.** The title (Fraunces) and the white **Esplora** pill sit over a bottom gradient shade and fade/rise in only while the slide is active.
- **Controls + autoplay.** Round prev/next buttons call `go(current ± 1)` with wrap-around. Autoplay advances every `interval` ms (default 4000) and pauses while the pointer is over the component, so it's lively on its own but never fights the visitor.
- **Tuning.** Larger `rotateX` and a smaller inactive `scale` deepen the recession. The `/30` divisor sets parallax strength (smaller = stronger drift). Bump `interval` for a slower deck.

### Brand notes (Lorenzo.studio)

- Canvas is light **parchment** (`#efe9dc`/`#f4efe4`); text is **ink** `#26221d`.
- The **Esplora** pill is parchment-white with dark ink text. On this component the pill is deliberately light, not gold; reserve ochre-gold `#c8972e` (always with dark text, never white) for solid CTAs elsewhere.
- The prev/next controls fill **forest-green** `#1f4d3a` on hover with parchment text. Copy stays human and Italian-first; mirror EN/SV as needed.
- Swap the four Unsplash photos for your own project shots when you have them, keeping them square so the slide stays full-bleed.
