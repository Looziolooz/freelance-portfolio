Build an **animated testimonials** block in React + TypeScript styled with **shadcn/ui** + **Tailwind CSS v4**. It is a two-column layout: on the left a stack of portrait images where the active photo springs forward and the inactive ones sit behind with a small random rotation; on the right the person's name, role, and their quote revealed **word by word with a blur-in**. Round prev/next buttons step through, and it autoplays every 5 seconds. Reproduce both files below faithfully. The demo is personalized for **lorenzo.studio** (Italian copy, parchment surface, ochre-gold and forest-green accents).

## Setup checklist

1. A React app with **TypeScript** (Next.js App Router or Vite).
2. **Tailwind CSS v4** installed and wired up.
3. **shadcn/ui** initialized:
   ```bash
   npx shadcn@latest init
   ```
   This creates `@/lib/utils` exporting `cn` and sets the default component path to `@/components/ui`.
4. Install the runtime dependencies:
   ```bash
   npm i motion @tabler/icons-react
   ```
   `motion` ships the `motion/react` entry point (the maintained successor to `framer-motion`); `@tabler/icons-react` provides the arrow icons.
5. If you don't have it yet, the `cn` helper (`@/lib/utils`):
   ```ts
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
6. Fonts: the demo uses **Fraunces** (display) and **General Sans** (body). Load them however your stack prefers (`next/font`, a `<link>`, or a `@font-face`/Fontshare import). They aren't required for the mechanic — swap in your own brand fonts freely.

Two files: `components/ui/animated-testimonials.tsx` (the reusable primitive, verbatim) and `components/animated-testimonials-demo.tsx` (our personalized usage).

---

## `components/ui/animated-testimonials.tsx`

Copy this verbatim. The component keeps an `active` index, rotates the photo stack with `motion`, reveals the quote one word at a time, and autoplays on a 5s interval. Each inactive photo gets a **stable random rotation** (computed once with `useMemo` from `Math.random()`), so the stack looks hand-placed without reshuffling every render.

```tsx
"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay]);

  // Stable per-card tilt: -10deg .. +10deg, computed once.
  const rotations = useMemo(
    () => testimonials.map(() => Math.floor(Math.random() * 21) - 10),
    [testimonials],
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        {/* Left: the rotating portrait stack */}
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: rotations[index],
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : rotations[index],
                    zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -40, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: rotations[index],
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: name, role, and the word-by-word quote */}
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="font-serif text-2xl font-semibold text-[#26221d]">
              {testimonials[active].name}
            </h3>
            <p className="text-sm font-medium text-[#2f6f68]">
              {testimonials[active].designation}
            </p>
            <motion.p className="mt-8 text-lg text-[#6b6256]">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              aria-label="Testimonianza precedente"
              className="group/button flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#f4efe4] transition-colors hover:bg-[#c8972e]"
            >
              <IconArrowLeft className="h-5 w-5 text-[#26221d] transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Testimonianza successiva"
              className="group/button flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#f4efe4] transition-colors hover:bg-[#c8972e]"
            >
              <IconArrowRight className="h-5 w-5 text-[#26221d] transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

> The buttons use ochre-gold on hover with a **dark ink icon** (`text-[#26221d]`) — never a white icon on gold, per the brand. If you want plain `<svg>` arrows instead of Tabler, drop the `@tabler/icons-react` import and inline two chevron paths.

---

## `components/animated-testimonials-demo.tsx`

Our personalized demo: five warm, specific Italian client testimonials for a web studio, each about a site that brought more clients, bookings, or sales. Portraits are verified Unsplash photos.

```tsx
"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "Prima ricevevo gli ordini a voce, su fogli che si perdevano. Adesso le torte si prenotano dal sito anche di notte e arrivo in laboratorio con la giornata gia organizzata. Nel primo mese le richieste sono quasi raddoppiate.",
      name: "Giulia Ferraro",
      designation: "Pasticceria Aurora",
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1280&q=85&fm=webp",
    },
    {
      quote:
        "Avevo un catalogo bellissimo ma nessuno comprava. Hanno rifatto le schede prodotto e il percorso di acquisto, e in tre mesi le vendite online sono cresciute del quaranta per cento. Ora il negozio lavora anche mentre dormo.",
      name: "Marco Bianchi",
      designation: "E-commerce di arredo",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1280&q=85&fm=webp",
    },
    {
      quote:
        "Il vecchio sito non rendeva giustizia al mio lavoro. Quello nuovo mette le foto al centro e i clienti arrivano gia convinti. Chiudo piu matrimoni e con meno telefonate di trattativa.",
      name: "Sara De Luca",
      designation: "Studio fotografico",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1280&q=85&fm=webp",
    },
    {
      quote:
        "Volevamo riempire i tavoli anche nelle sere piu tranquille. Con il menu chiaro e la prenotazione diretta abbiamo coperto il martedi e il mercoledi, e molti ospiti dicono di averci scelto proprio dal sito.",
      name: "Luca Moretti",
      designation: "Ristorante",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=85&fm=webp",
    },
    {
      quote:
        "Passavo le serate a rispondere agli stessi messaggi per fissare le lezioni di prova. Adesso le persone prenotano da sole in pochi minuti e io ho recuperato tempo per seguire chi e gia in sala.",
      name: "Elena Conti",
      designation: "Studio di pilates",
      src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1280&q=85&fm=webp",
    },
  ];

  return <AnimatedTestimonials testimonials={testimonials} autoplay />;
}
```

> Using `next/image` instead of a plain `<img>`? Swap the `<img>` in the primitive for `<Image fill className="rounded-3xl object-cover object-center" ... />` and allow `images.unsplash.com` in `next.config` `images.remotePatterns`. For the stacked layout, `fill` plus the `absolute inset-0` wrapper is the cleanest fit.

### How the effect works

- **The photo stack.** Every photo is `absolute inset-0` inside a fixed-height (`h-80`) relative box, with `origin-bottom` so it pivots from its base like a fanned deck of cards. `motion` animates each one between an active and inactive state: the active photo goes to `scale 1`, `rotate 0`, `opacity 1`, `zIndex 40`, with a quick `y: [0, -40, 0]` hop so it **springs up**; the inactive ones drop to `scale 0.95`, `opacity 0.7`, are pushed back on the `z` axis, and keep their **stable random `rotate`** (from the `useMemo` array, `-10deg .. +10deg`).
- **Word-by-word blur-in.** The quote is split on spaces; each word is a `motion.span` that animates `filter: blur(10px) -> blur(0)`, `opacity 0 -> 1`, and `y: 5 -> 0`, with `delay: 0.02 * index` so the words clear left to right. Re-keying the wrapper on `active` replays the whole reveal when the testimonial changes.
- **Autoplay + controls.** A `useEffect` sets a `setInterval(handleNext, 5000)` when `autoplay` is on and clears it on unmount. `handleNext` / `handlePrev` wrap with modulo so the carousel loops in both directions.

### Brand notes (lorenzo.studio)

- Canvas is light **parchment**; name is **ink** `#26221d` in Fraunces, role is **teal** `#2f6f68`, and the quote is muted ink `#6b6256`.
- The round prev/next buttons sit on soft parchment `#f4efe4` and fill **ochre-gold** `#c8972e` on hover, always with a **dark ink icon** — never white on gold.
- Copy stays human and Italian-first: warm, specific, no hype. Mirror EN/SV as needed. Keep one outcome per quote (more bookings, more sales, time saved) so each testimonial earns its place.
```
