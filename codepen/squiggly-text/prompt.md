# SquigglyText — testo che ondeggia (shadcn/ui + motion)

Un componente che avvolge una o più parole in un filtro SVG di turbolenza e le fa
*ondeggiare* in continuazione, ciclando una serie di filtri `feTurbulence`
pre-renderizzati nel tempo. Perfetto per far risaltare la parola chiave di un
titolo — qui, in versione Lorenzo.studio, è un headline italiano dove **vendite**
(e **lento**) si increspano nell'oro ocra del brand, ink scuro su pergamena.

L'effetto è puramente CSS/SVG a runtime: nessun canvas, nessuna immagine. `motion`
serve solo a leggere il tempo trascorso e scegliere quale filtro applicare a ogni
frame.

---

## 1. Setup (checklist)

1. Progetto **shadcn/ui** già inizializzato (`npx shadcn@latest init`), con
   **Tailwind CSS v4** e **TypeScript**.
2. Helper `cn` disponibile in `@/lib/utils` (lo scaffold di shadcn lo crea già):
   ```ts
   // lib/utils.ts
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
3. Installa l'unica dipendenza runtime:
   ```bash
   npm i motion
   ```
4. Percorso componenti di default: `components/ui` (il `ui/` di shadcn). Il demo
   sta in `components/`.

Nessun altro pacchetto serve: i filtri sono SVG inline, la palette è gestita con
classi Tailwind.

---

## 2. Il componente — `components/ui/squiggly-text.tsx`

Riprodotto fedele all'originale: stesse prop, stessi default, stessa logica
(`useId` per ID di filtro unici, `steps` filtri con `seed` crescente e `scale`
che alterna sui valori della tupla, `useTime` → `useTransform` per selezionare il
filtro attivo). Mantieni le prop e i commenti così come sono.

```tsx
"use client";

import React, { useId } from "react";
import { motion, useTime, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export interface SquigglyTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  steps?: number;        // default 5
  stepDuration?: number; // default 80 (ms between filter swaps)
  scale?: number | [number, number]; // default [6, 8] (max displacement px; tuple alternates per step)
  baseFrequency?: number; // default 0.02
  numOctaves?: number;    // default 3
  as?: "span" | "div";    // default "span"
}

export function SquigglyText({
  children,
  steps = 5,
  stepDuration = 80,
  scale = [6, 8],
  baseFrequency = 0.02,
  numOctaves = 3,
  as = "span",
  className,
  style,
}: SquigglyTextProps) {
  const reactId = useId();
  const safeId = reactId.replace(/[:_]/g, "");
  const filterId = (i: number) => `squiggly-${safeId}-${i}`;

  const filters = React.useMemo(
    () => Array.from({ length: steps }, (_, i) => `url(#${filterId(i)})`),
    [steps, safeId],
  );

  const time = useTime();
  const filter = useTransform(
    time,
    (t) => filters[Math.floor(t / stepDuration) % filters.length],
  );

  const scaleAt = (i: number) =>
    Array.isArray(scale) ? scale[i % scale.length] : scale;

  const Wrapper = as === "div" ? motion.div : motion.span;

  return (
    <Wrapper style={{ filter, ...style }} className={cn("inline-block", className)}>
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {Array.from({ length: steps }).map((_, i) => (
            <filter id={filterId(i)} key={i}>
              <feTurbulence baseFrequency={baseFrequency} numOctaves={numOctaves} result="noise" seed={i} />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={scaleAt(i)} />
            </filter>
          ))}
        </defs>
      </svg>
      {children}
    </Wrapper>
  );
}
```

### Le prop in breve
| Prop | Default | Cosa fa |
|------|---------|---------|
| `children` | — | il testo (o nodi) da far ondeggiare |
| `steps` | `5` | quanti filtri pre-renderizzati ciclare (più filtri = ciclo più lungo) |
| `stepDuration` | `80` | ms tra uno scambio di filtro e l'altro (più basso = wobble più nervoso) |
| `scale` | `[6, 8]` | spostamento massimo in px; con una tupla alterna i valori per step, con un numero resta fisso |
| `baseFrequency` | `0.02` | frequenza della turbolenza (più alto = increspatura più fitta) |
| `numOctaves` | `3` | dettaglio del rumore |
| `as` | `"span"` | elemento wrapper, `"span"` o `"div"` |
| `className` / `style` | — | inoltrati al wrapper |

---

## 3. Il demo personalizzato — `components/squiggly-text-demo.tsx`

Versione Lorenzo.studio: headline italiano centrato, **vendite** ondeggia
nell'oro ocra del brand (`text-[#E8A12C]`) con un wobble più marcato, e **lento**
ondeggia in modo più sobrio. Testo ink scuro su pergamena, tipo grande e
responsive.

```tsx
"use client";

import React from "react";
import { SquigglyText } from "@/components/ui/squiggly-text";

export default function SquigglyTextDemo() {
  return (
    <div className="flex min-h-[40rem] w-full items-center justify-center bg-[#F5EEDF] px-6 py-12">
      <h1 className="max-w-[14ch] text-center text-5xl font-semibold leading-[1.04] tracking-[-0.02em] text-[#221E17] md:text-7xl lg:text-8xl">
        Quante{" "}
        <SquigglyText stepDuration={70} scale={[6, 9]} className="text-[#E8A12C]">
          vendite
        </SquigglyText>{" "}
        ti costa
        <br />
        un sito{" "}
        <SquigglyText scale={5} className="text-[#E8A12C]">
          lento
        </SquigglyText>
        ?
      </h1>
    </div>
  );
}
```

### Note di personalizzazione
- **Palette Parchment & Forest.** Canvas pergamena `#F5EEDF`, testo ink `#221E17`,
  parole ondeggianti in oro ocra `#E8A12C`. Se hai i token nel tema, sostituisci
  gli hex con le tue variabili (es. `text-[var(--accent)]`).
- **Tipo display.** Per restare in linea con il brand, applica un serif editoriale
  (es. Fraunces) all'`<h1>` tramite la tua classe di font; il componente non impone
  un font.
- **Due ritmi diversi.** `vendite` usa `stepDuration={70}` + `scale={[6, 9]}`
  (ondeggia più forte e più veloce, è la parola-amo); `lento` usa `scale={5}`
  fisso (più trattenuto). Cambia questi due valori per dosare l'effetto.
- **Accessibilità.** È puramente decorativo: il testo resta leggibile e
  selezionabile, gli SVG sono `aria-hidden`. Se vuoi fermare il movimento sotto
  `prefers-reduced-motion`, avvolgi il rendering animato in un check
  (`useReducedMotion` di `motion/react`) e mostra il testo senza `<SquigglyText>`.

---

## 4. Come funziona (in due righe)

1. Il componente monta `steps` filtri SVG: ognuno è una `feTurbulence` (con `seed`
   diverso, così il pattern di rumore cambia) seguita da una `feDisplacementMap`
   che spinge i pixel del testo di `scale` px.
2. `useTime()` dà i millisecondi trascorsi; `useTransform` li mappa su
   `filters[floor(t / stepDuration) % filters.length]`, cioè cambia filtro ogni
   `stepDuration` ms. Scorrendo tra filtri con rumore diverso, le lettere sembrano
   *vibrare* di continuo, senza bisogno di interazione.
