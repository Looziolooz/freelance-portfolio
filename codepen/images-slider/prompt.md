Build a full-bleed **Images Slider** hero: a slideshow where each image enters with a 3D pop (it scales up from zero while a 45° tilt flattens out) and the outgoing image slides up off the top. A dark overlay sits over the photo, and centered above it sits a gradient-clip heading and a glassy pill button. Autoplay advances every 5 seconds; the left and right arrow keys change slides. This is the canonical Aceternity **ImagesSlider**, reproduced faithfully and personalized for a studio that builds websites for Italian clients.

Stack: **React 18 + TypeScript**, **shadcn/ui** conventions, **Tailwind CSS v4**, and **motion/react** for the animation. The component lives at `components/ui/images-slider.tsx`; the demo at `components/images-slider-demo.tsx`.

---

## Setup checklist

1. A React + TypeScript app with **Tailwind CSS v4** configured (Vite or Next.js App Router both work). If it is a Next.js app, the component is a client component — keep the `"use client"` directive at the top of the file.
2. **shadcn/ui** initialized (`npx shadcn@latest init`). This is what gives you the `@/` path alias and the `cn` helper.
3. Install the animation library:
   ```bash
   npm i motion
   ```
   The import path is `motion/react` (the successor to `framer-motion`).
4. Confirm the `cn` utility exists at `@/lib/utils`. If shadcn did not create it, add it:
   ```ts
   // lib/utils.ts
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
   ```bash
   npm i clsx tailwind-merge
   ```
5. Create the two files below under `components/ui/` and `components/`.

No extra Tailwind config is needed — every class used is a stock utility. The component reads its height from whatever you pass via `className` (e.g. `h-[40rem]`).

---

## File 1 — `components/ui/images-slider.tsx`

This is the canonical component. It preloads every image before showing anything (so a slide never flashes half-loaded), keeps the active index in state, advances on autoplay, and listens for the arrow keys. `AnimatePresence` mounts exactly one `<motion.img>` per index; the `key={currentIndex}` is what makes motion run the exit on the old image and the enter on the new one. `slideVariants` holds the whole motion: `initial` is the pre-pop state (`scale: 0`, `rotateX: 45`), `visible` is the settled state reached in 0.5s with the original cubic-bezier, and `upExit` / `downExit` push the leaving image 150% up or down over 1s. The container carries `perspective: 1000px` so the `rotateX` reads as real depth.

```tsx
"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadImages = () => {
    setLoading(true);
    const loadPromises = images.map((image) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = () => resolve(image);
        img.onerror = reject;
      });
    });

    Promise.all(loadPromises)
      .then((loaded) => {
        setLoadedImages(loaded);
        setLoading(false);
      })
      .catch((error) => console.error("Failed to load images", error));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // autoplay
    let interval: ReturnType<typeof setInterval> | undefined;
    if (autoplay) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slideVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      rotateX: 45,
    },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1.0] as const,
      },
    },
    upExit: {
      opacity: 1,
      y: "-150%",
      transition: {
        duration: 1,
      },
    },
    downExit: {
      opacity: 1,
      y: "150%",
      transition: {
        duration: 1,
      },
    },
  };

  const areImagesLoaded = loadedImages.length > 0;

  return (
    <div
      className={cn(
        "overflow-hidden h-full w-full relative flex items-center justify-center",
        className
      )}
      style={{
        perspective: "1000px",
      }}
    >
      {areImagesLoaded && children}
      {areImagesLoaded && overlay && (
        <div
          className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)}
        />
      )}

      {areImagesLoaded && (
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit={direction === "up" ? "upExit" : "downExit"}
            variants={slideVariants}
            className="image h-full w-full absolute inset-0 object-cover object-center"
          />
        </AnimatePresence>
      )}
    </div>
  );
};
```

Notes that matter when you reproduce it:

- **Preloading is not optional.** Nothing renders until `loadedImages.length > 0`, which is why the children and overlay are guarded by `areImagesLoaded`. Skipping this brings back the half-loaded flash.
- **`key={currentIndex}` drives the transition.** `AnimatePresence` watches that key. When it changes, the old `motion.img` runs its `exit` variant and the new one runs `initial → animate`. Don't replace it with an array map.
- **`perspective: "1000px"`** lives on the container as an inline style. Without it the `rotateX: 45` looks like a flat squash instead of a tilt.
- **`direction`** picks `upExit` vs `downExit` — the leaving image goes off the top or the bottom. Default `"up"`.
- **`overlay`** defaults to a `bg-black/60` panel at `z-40`; your content should sit above it (the demo uses `z-50`). You can pass a custom node or `overlayClassName` to tune it.

---

## File 2 — `components/images-slider-demo.tsx`

The personalized usage. The heading is Italian and clips a top-to-bottom white → light-grey gradient through the text; the button is a glassy, backdrop-blurred pill, here with an **ochre-gold** accent border and glow (the original used emerald) and a small arrow. The whole content block is one `motion.div` that fades and lifts in. The four images are full-bleed architecture, interior, and landscape shots.

```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { ImagesSlider } from "@/components/ui/images-slider";

export function ImagesSliderDemo() {
  const images = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85&fm=webp",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1600&q=85&fm=webp",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=85&fm=webp",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=85&fm=webp",
  ];

  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-50 flex flex-col justify-center items-center text-center px-6"
      >
        <motion.p className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold max-w-3xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4 leading-[1.05]">
          Immagini che fermano <br /> lo scroll.
        </motion.p>

        <button className="px-6 py-3 mt-4 inline-flex items-center gap-2 backdrop-blur-sm rounded-full bg-white/10 border border-[#c8972e]/70 text-white text-center font-medium shadow-[0_14px_40px_rgba(200,151,46,0.25)] transition-all hover:bg-white/20 hover:border-[#c8972e] hover:shadow-[0_18px_50px_rgba(200,151,46,0.35)]">
          <span>Scopri</span>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </motion.div>
    </ImagesSlider>
  );
}
```

How the personalization maps to the original:

- **Heading** — "Immagini che fermano lo scroll." Italian, displayed in a serif (load **Playfair Display** if you want the exact look of the preview; otherwise it falls back to your serif stack). The gradient clip is `bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400`, i.e. white at the top fading to light grey at the bottom — the same technique the original used, just our copy.
- **Button** — "Scopri" with a right arrow. It stays glassy (`bg-white/10 backdrop-blur-sm rounded-full`) but the accent is **ochre-gold** `#c8972e` on the border, the focus ring, and the soft glow shadow, with **white** text — replacing the emerald of the original. Keep the dark cinematic look: this is a full-bleed image hero and the `bg-black/60` overlay is intentional, it is what makes the gold and the white type read.
- **Images** — four verified, full-bleed Unsplash photos (a bright modern interior, a misty forest, a warm lit kitchen, a golden mountain landscape). Swap in your own client work; just keep them landscape and high-resolution so `object-cover` has room to crop.

### Using Playfair Display for the heading (optional, matches the preview)

If you want the serif headline exactly as shown, register the font once. In a Next.js App Router project:

```tsx
// app/layout.tsx
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600"],
});

// add `playfair.variable` to <html className={...}>
```

```css
/* globals.css — map Tailwind's font-serif to the variable */
@theme inline {
  --font-serif: var(--font-playfair), Georgia, serif;
}
```

In a Vite project, add the Google Fonts `<link>` to `index.html` and set `font-serif` to `'Playfair Display', serif` in your Tailwind theme instead.

---

## Drop it on a page

```tsx
import { ImagesSliderDemo } from "@/components/images-slider-demo";

export default function Page() {
  return <ImagesSliderDemo />;
}
```

## Behaviour to expect

- On first paint nothing shows until all four images finish preloading, then the first slide pops in.
- Every 5 seconds the current image slides up and off the top while the next pops in from `scale: 0` / `rotateX: 45`.
- The left and right arrow keys step backward and forward through the slides.
- Pass `direction="down"` to make images leave downward, `autoplay={false}` to stop the timer, `overlay={false}` to drop the dark panel, or `overlayClassName="bg-black/40"` to soften it.
- Each `<ImagesSlider>` sizes itself from the height you pass via `className`; the demo uses `h-[40rem]`. For a true full-bleed hero use `h-screen`.
