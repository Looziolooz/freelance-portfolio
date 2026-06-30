Build an **Expandable Card** (the Aceternity "standard" list variant) in React + TypeScript styled with **shadcn/ui** + **Tailwind CSS v4**, animated with **motion/react**. A centered list of row cards (small image, title, subtitle, a pill CTA) expands on click via a **shared-layout `layoutId` transition** into a centered modal: large image on top, title/subtitle, CTA, and a scrollable description under a fade mask, over a dimmed backdrop. Close it with the **X** button, **Escape**, or an **outside-click** (a `use-outside-click` hook). Reproduce all three files below faithfully. The demo is personalized for **Lorenzo.studio** (Italian copy, parchment surface, ochre-gold and forest-green accents).

## Setup checklist

1. A React app with **TypeScript** (Next.js App Router or Vite).
2. **Tailwind CSS v4** installed and wired up.
3. **shadcn/ui** initialized:
   ```bash
   npx shadcn@latest init
   ```
   This creates `@/lib/utils` exporting `cn` and sets the default component path to `@/components/ui`.
4. Install the animation library (this component uses the modern `motion` package, imported as `motion/react`):
   ```bash
   npm i motion
   ```
5. If you don't have it yet, the `cn` helper (`@/lib/utils`):
   ```ts
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
6. Fonts: the demo uses **Fraunces** (display) and **General Sans** (body). Load them however your stack prefers (`next/font`, a `<link>`, or a `@font-face`/Fontshare import). They aren't required for the mechanic — swap in your own brand fonts freely.

Three files: `hooks/use-outside-click.ts` (the close-on-outside-click hook, verbatim), `components/ui/expandable-card.tsx` (the reusable primitive, verbatim), and `components/expandable-card-demo.tsx` (our personalized usage).

---

## `hooks/use-outside-click.ts`

Copy this verbatim. It fires `callback` when a `mousedown`/`touchstart` lands anywhere outside the referenced element — that's how clicking the dimmed backdrop closes the modal.

```ts
import { useEffect, type RefObject } from "react";

export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking the element itself or its descendants.
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}
```

---

## `components/ui/expandable-card.tsx`

Copy this verbatim. The same `layoutId`s on the card and the modal (`card-${title}`, `image-${title}`, `title-${title}`, `subtitle-${title}`, `cta-${title}`) make `motion` morph the row into the modal (shared-layout transition) instead of cross-fading. The active card is held in state; `AnimatePresence` mounts the backdrop + modal while one is open.

```tsx
"use client";

import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";

export type ExpandableCardItem = {
  title: string;
  subtitle: string;
  src: string;
  ctaLabel: string;
  ctaHref?: string;
  /** Long description shown in the open modal. String or any node. */
  content: ReactNode | (() => ReactNode);
};

const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-[#26221d]"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

export function ExpandableCardList({
  items,
  className,
}: {
  items: ExpandableCardItem[];
  className?: string;
}) {
  const [active, setActive] = useState<ExpandableCardItem | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {/* Dimmed backdrop */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#1a1713]/55 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Centered modal */}
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute right-4 top-4 z-[60] flex h-9 w-9 items-center justify-center rounded-full bg-[#faf7f0] shadow-md"
              aria-label="Chiudi"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="flex max-h-[90vh] w-full max-w-[30rem] flex-col overflow-hidden rounded-[22px] border border-black/10 bg-[#faf7f0] shadow-[0_40px_90px_-40px_rgba(38,34,29,0.7)]"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                {/* Swap for next/image if you prefer; see note below. */}
                <img
                  src={active.src}
                  alt={active.title}
                  width={600}
                  height={240}
                  className="h-[230px] w-full bg-[#e7dec9] object-cover"
                />
              </motion.div>

              <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
                <div className="min-w-0">
                  <motion.h3
                    layoutId={`title-${active.title}-${id}`}
                    className="font-serif text-[1.4rem] font-semibold leading-tight text-[#26221d]"
                  >
                    {active.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`subtitle-${active.subtitle}-${id}`}
                    className="mt-1 text-[0.95rem] text-[#6b6256]"
                  >
                    {active.subtitle}
                  </motion.p>
                </div>

                <motion.a
                  layoutId={`cta-${active.title}-${id}`}
                  href={active.ctaHref ?? "#"}
                  className="shrink-0 rounded-full bg-[#c8972e] px-5 py-2.5 text-sm font-semibold text-[#26221d] transition-colors hover:bg-[#b3852b]"
                >
                  {active.ctaLabel}
                </motion.a>
              </div>

              <div className="relative flex-1 overflow-y-auto px-5 pb-6 pt-1 [mask-image:linear-gradient(to_bottom,transparent,#000_18px,#000_calc(100%-24px),transparent)]">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[0.95rem] leading-relaxed text-[#6b6256]"
                >
                  {typeof active.content === "function"
                    ? active.content()
                    : active.content}
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* The list of row cards */}
      <ul
        className={cn(
          "mx-auto flex w-full max-w-[36rem] flex-col gap-2.5",
          className
        )}
      >
        {items.map((item) => (
          <motion.li
            layoutId={`card-${item.title}-${id}`}
            key={`card-${item.title}-${id}`}
            onClick={() => setActive(item)}
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-black/10 bg-[#faf7f0] p-3 transition-colors hover:bg-[#fffdf8]"
          >
            <motion.div
              layoutId={`image-${item.title}-${id}`}
              className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#e7dec9]"
            >
              <img
                src={item.src}
                alt={item.title}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <div className="min-w-0 flex-1">
              <motion.h3
                layoutId={`title-${item.title}-${id}`}
                className="font-serif text-[1.05rem] font-semibold leading-tight text-[#26221d]"
              >
                {item.title}
              </motion.h3>
              <motion.p
                layoutId={`subtitle-${item.subtitle}-${id}`}
                className="mt-0.5 text-[0.9rem] text-[#6b6256]"
              >
                {item.subtitle}
              </motion.p>
            </div>

            <motion.button
              layoutId={`cta-${item.title}-${id}`}
              className="shrink-0 rounded-full border border-[#1f4d3a]/35 px-4 py-2 text-sm font-semibold text-[#1f4d3a] transition-colors hover:border-[#c8972e] hover:bg-[#c8972e] hover:text-[#26221d]"
            >
              {item.ctaLabel}
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </>
  );
}
```

> Using `next/image` instead of plain `<img>`? Replace each `<img .../>` with `<Image .../>` (keep `width`/`height` and the same `className`), and allow `images.unsplash.com` in `next.config` under `images.remotePatterns`. The `motion` wrappers stay exactly as they are.

---

## `components/expandable-card-demo.tsx`

Our personalized demo: four Lorenzo.studio services as rows, each opening into a modal with a short Italian description. The CTA reads **"Scopri"**.

```tsx
"use client";

import { ExpandableCardList, type ExpandableCardItem } from "@/components/ui/expandable-card";

const services: ExpandableCardItem[] = [
  {
    title: "Sito vetrina",
    subtitle: "Per farti trovare e contattare",
    ctaLabel: "Scopri",
    src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1280&q=85&fm=webp",
    content:
      "Un sito chiaro e veloce che racconta chi sei e cosa offri. Pagine che caricano in un attimo, testi pensati per convincere e un modulo di contatto sempre a portata di mano. Online in pochi giorni, pronto a trasformare le visite in richieste vere.",
  },
  {
    title: "E-commerce",
    subtitle: "Per vendere mentre dormi",
    ctaLabel: "Scopri",
    src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1280&q=85&fm=webp",
    content:
      "Uno store che incassa anche di notte. Schede prodotto curate, carrello senza intoppi e pagamenti sicuri con carta o bonifico. Gestisci ordini e magazzino da un pannello semplice, mentre i clienti comprano quando vogliono, da qualsiasi dispositivo.",
  },
  {
    title: "Visibilità locale",
    subtitle: "Primo su Google in zona",
    ctaLabel: "Scopri",
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1280&q=85&fm=webp",
    content:
      "Quando qualcuno cerca un servizio come il tuo qui vicino, devi comparire tu. Scheda Google curata, recensioni che contano e parole giuste per la tua zona. Così il telefono squilla e la gente entra, senza spendere una fortuna in pubblicità.",
  },
  {
    title: "Assistente AI",
    subtitle: "Risponde ai clienti 24/7",
    ctaLabel: "Scopri",
    src: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1280&q=85&fm=webp",
    content:
      "Un assistente che non va mai in pausa. Risponde alle domande più frequenti, prende prenotazioni e raccoglie i contatti anche di notte e nel weekend. Parla la lingua dei tuoi clienti e passa a te solo le richieste che contano davvero.",
  },
];

export default function ExpandableCardDemo() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f4efe4] px-5 py-14">
      <ExpandableCardList items={services} />
    </section>
  );
}
```

### How the effect works

- **Shared-layout, not a fade.** The row and the open modal share the same `layoutId` set (`card-…`, `image-…`, `title-…`, `subtitle-…`, `cta-…`, keyed by `useId()` so several lists can coexist). When `active` flips from `null` to an item, `motion` interpolates each element's position and size between its row and modal layouts — the small thumbnail grows into the 230px header image, the title slides up, the pill travels to the corner. It reads as one card expanding, because it literally is.
- **AnimatePresence.** The backdrop and modal are conditionally rendered inside `<AnimatePresence>`, so they animate in on open and animate out on close instead of popping. The close button fades independently.
- **Three ways to close.** The **X** button calls `setActive(null)`. **Escape** is handled by the `keydown` listener in the effect. **Outside-click** comes from `useOutsideClick(ref, …)` on the modal card — any pointer down outside it (i.e. on the backdrop) closes it.
- **Scroll + fade mask.** The description region is `overflow-y-auto` with a `mask-image` linear-gradient that fades the text in at the top and out at the bottom, so long copy scrolls cleanly under the fixed header.
- **Body scroll lock.** While a card is open, `document.body.style.overflow` is set to `hidden` so the page behind the backdrop can't scroll.

### Brand notes (Lorenzo.studio)

- Surfaces are warm parchment (`#faf7f0` cards on an `#f4efe4` canvas) with a hairline border and a soft shadow; rows `rounded-2xl`, modal `rounded-[22px]`, max width `~30rem`.
- The modal CTA fill is ochre-gold `#c8972e` with **dark ink text** `#26221d` — never white text on gold. On the row the CTA is an outlined forest-green `#1f4d3a` pill that fills gold on hover.
- Titles use the **Fraunces** serif; body uses **General Sans**. Copy stays human and Italian-first; mirror EN/SV as needed. CTA label: **"Scopri"**.
```
