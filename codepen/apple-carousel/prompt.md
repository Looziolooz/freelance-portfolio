Build an **Apple Cards Carousel** for a React + Next.js (App Router) project, in the style of the Aceternity UI component. It is a horizontally scrollable row of tall, rounded image cards, each with a category label and a title overlaid at the top. Round left/right buttons scroll the row one card at a time. Clicking a card expands it into a centered modal with a blurred backdrop, rich content, and a close button (Escape, the close button, and an outside click all close it). The cards stagger-fade in as they enter view.

This guide reproduces the component faithfully and personalizes the demo for **Lorenzo.studio** (heading "Conosci lo studio." + our five services).

## Stack & setup

- **shadcn/ui** + **Tailwind CSS v4** + **TypeScript**.
- Motion library: **`motion`** (the successor to framer-motion). Import from `motion/react`.
- Icons: **`@tabler/icons-react`**.
- The `cn` helper from **`@/lib/utils`** (shadcn's default `clsx` + `tailwind-merge` wrapper).
- A custom hook **`@/hooks/use-outside-click`**.
- Component lives at **`components/ui/apple-cards-carousel.tsx`**.

Install the dependencies:

```bash
npm i motion @tabler/icons-react
```

If you scaffolded with the shadcn CLI, `@/lib/utils` already exists. If not, create it:

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Make sure your `tsconfig.json` has the `@/*` path alias pointing at the project root (shadcn sets this up for you):

```json
{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }
```

## The outside-click hook

Create `hooks/use-outside-click.ts`. It fires the callback when a `mousedown`/`touchstart` lands outside the referenced element — used to close the modal when the visitor clicks the blurred backdrop.

```tsx
// hooks/use-outside-click.ts
import { useEffect, type RefObject } from "react";

export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking the element itself or its descendants.
      if (!ref.current || ref.current.contains(event.target as Node)) return;
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

## The component

Create `components/ui/apple-cards-carousel.tsx`. It is a client component (it uses refs, effects, and `IntersectionObserver`-style scroll state), so it starts with `"use client"`.

It exposes three pieces:
- `Carousel` — the scroll row, the arrows, and a `CarouselContext` that lets a card open above its siblings.
- `Card` — a single card with the open/close modal behaviour.
- A `Card` data shape: `{ category, title, src, content }`.

```tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";

export interface CardType {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
}

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
}

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          {/* Right-edge fade so cards bleed off-screen cleanly */}
          <div className="absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l" />

          <div className="flex flex-row justify-start gap-4 pl-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                  },
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#f4efe4] disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scheda precedente"
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-[#26221d]" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#f4efe4] disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scheda successiva"
          >
            <IconArrowNarrowRight className="h-6 w-6 text-[#26221d]" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: CardType;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/55 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-2xl rounded-3xl bg-[#f4efe4] p-4 font-sans md:p-12"
            >
              <button
                className="sticky top-4 right-0 ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#26221d] transition-transform hover:rotate-90"
                onClick={handleClose}
                aria-label="Chiudi"
              >
                <IconX className="h-5 w-5 text-[#f4efe4]" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2f6f68]"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-2 font-serif text-3xl font-medium text-[#26221d] md:text-4xl"
              >
                {card.title}
              </motion.p>
              <div className="py-10 text-base leading-relaxed text-[#6b6256]">
                {card.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-[#26221d] md:h-[40rem] md:w-96"
      >
        {/* Top shade so the category + title stay legible over the photo */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/60 via-black/10 to-transparent" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-sm font-medium text-white/80"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left font-serif text-xl font-medium [text-wrap:balance] text-white md:text-2xl"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="absolute inset-0 z-10 object-cover transition-transform duration-700 hover:scale-105"
        />
      </motion.button>
    </>
  );
};

// next/image with a tiny blur-in on load, so cards never flash an empty box.
const BlurImage = ({ src, className, alt, ...rest }: ImageProps) => {
  const [loading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "h-full w-full transition duration-500",
        loading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      alt={alt ?? "Background"}
      {...rest}
    />
  );
};
```

A few faithful details from the original to keep:
- The scroll row hides its scrollbar with `[scrollbar-width:none]` (add a global `.no-scrollbar::-webkit-scrollbar { display: none }` if you want to hide it in WebKit too).
- The last card has `last:pr-[5%] md:last:pr-[33%]` so it can scroll fully into view past the right fade.
- Each card animates in with `opacity 0 → 1`, `y: 20 → 0`, staggered by `delay: 0.2 * index`.
- The modal locks body scroll (`document.body.style.overflow = "hidden"`) while open and releases it on close.
- `layout` enables shared-layout transitions (the card morphs into the modal via matching `layoutId`s). Leave it `false` for the simpler cross-fade used here, or pass `layout` for the morph.

## Fonts

The component uses a serif display face for titles (`font-serif`) and a clean sans for body/labels (`font-sans`). Map them to **Fraunces** (display) and a General Sans-style sans in your Tailwind/Next font setup. With `next/font`:

```ts
// app/fonts.ts
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
```

Then in `app/globals.css` (Tailwind v4 uses the `@theme` inline block):

```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
}
```

Add both `variable` classes to `<body>` in `app/layout.tsx`.

## Demo, personalized for Lorenzo.studio

Create a section that renders the carousel with our heading and five services. Drop this into a page or a section component.

```tsx
// components/sections/conosci-lo-studio.tsx
"use client";

import { Carousel, Card, type CardType } from "@/components/ui/apple-cards-carousel";

const services: CardType[] = [
  {
    category: "Siti & E-commerce",
    title: "Siti che vendono, non solo belli.",
    src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80&auto=format&fit=crop",
    content: (
      <p>
        Un sito curato fa una bella impressione, ma è la vendita che paga le
        bollette. Partiamo da come si muove chi ti visita: dove clicca, dove si
        ferma, dove abbandona il carrello. Poi costruiamo pagine veloci, chiare e
        fatte per portare la persona dal &laquo;sto guardando&raquo; al &laquo;ho
        comprato&raquo;, senza passaggi inutili.
      </p>
    ),
  },
  {
    category: "Visibilità",
    title: "Farti trovare quando ti cercano.",
    src: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=900&q=80&auto=format&fit=crop",
    content: (
      <p>
        Le persone ti cercano già, su Google e sulle mappe, nel momento in cui
        hanno bisogno di te. Il punto è esserci quando succede. Lavoriamo su quello
        che cercano davvero i tuoi clienti, sistemiamo la scheda Google, i testi e
        le recensioni, così quando digitano il tuo servizio nella tua zona sei tu a
        comparire, non il concorrente.
      </p>
    ),
  },
  {
    category: "Automazioni",
    title: "Il lavoro ripetitivo, fatto da solo.",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop",
    content: (
      <p>
        Preventivi copiati a mano, mail uguali ripetute dieci volte, dati spostati
        da un foglio all&apos;altro: ore che spariscono ogni settimana. Colleghiamo
        gli strumenti che usi già e lasciamo che il lavoro ripetitivo si faccia da
        solo, in silenzio e senza errori. Tu ti tieni le decisioni, la macchina si
        prende le scocciature.
      </p>
    ),
  },
  {
    category: "AI",
    title: "Un assistente che risponde ai clienti.",
    src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80&auto=format&fit=crop",
    content: (
      <p>
        Un assistente addestrato sulla tua attività risponde alle domande di sempre
        a qualsiasi ora: prezzi, orari, disponibilità, come prenotare. I clienti
        hanno una risposta subito, anche quando tu hai chiuso, e a te arrivano solo
        le richieste che valgono davvero il tuo tempo. Niente abbonamenti costosi: lo
        costruiamo per costare quanto meno possibile.
      </p>
    ),
  },
  {
    category: "Social",
    title: "Contenuti che fanno parlare di te.",
    src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&q=80&auto=format&fit=crop",
    content: (
      <p>
        Non servono mille post: serve qualche contenuto giusto, con una voce che è
        la tua e non quella di tutti. Definiamo poche idee solide, un ritmo che
        riesci a mantenere e un modo di raccontare il tuo lavoro che resta in testa.
        Meno rincorsa all&apos;algoritmo, più persone che si ricordano di te quando
        devono scegliere.
      </p>
    ),
  },
];

export function ConosciLoStudio() {
  const cards = services.map((card, index) => (
    <Card key={card.title} card={card} index={index} />
  ));

  return (
    <section className="w-full bg-[#efe9dc] py-16">
      <div className="mx-auto max-w-7xl px-8">
        <h2 className="font-serif text-4xl font-medium tracking-tight text-[#26221d] md:text-6xl">
          Conosci lo studio.
        </h2>
        <p className="mt-3 text-[#6b6256]">
          Scorri di lato o tocca una scheda per aprirla.
        </p>
      </div>
      <Carousel items={cards} />
    </section>
  );
}
```

Register the Unsplash host in `next.config.js` so `next/image` will serve the photos:

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};
```

## Palette

The demo is themed to **Parchment & Forest**: parchment canvas `#efe9dc` (cards/modal use the lighter `#f4efe4`), ink text `#26221d`, ink-muted `#6b6256`, teal `#2f6f68` for the modal category label, and ochre-gold `#c8972e` is available for accents (always pair gold fills with dark text). Swap the photos and copy for any brand; the mechanics stay the same.
