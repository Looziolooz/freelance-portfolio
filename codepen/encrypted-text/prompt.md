Costruisci un componente di testo "decrittato" per **React + TypeScript** con **shadcn/ui** e **Tailwind CSS v4**. L'effetto: il testo parte come una sequenza di caratteri casuali (gibberish) e rivela i caratteri reali da sinistra a destra, uno ogni `revealDelayMs`. I caratteri non ancora rivelati continuano a cambiare ogni `flipDelayMs`. Gli spazi restano sempre spazi. I caratteri cifrati usano una classe muted, quelli rivelati una classe di colore pieno. L'animazione parte una volta sola quando l'elemento entra nel viewport.

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

### File 1 — `components/ui/encrypted-text.tsx`

Il componente. Riproducilo così com'è. Tutte le props restano: `text`, `className`, `revealDelayMs` (default 50), `charset`, `flipDelayMs` (default 50), `encryptedClassName`, `revealedClassName`.

```tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

type EncryptedTextProps = {
  text: string;
  className?: string;
  revealDelayMs?: number; // default 50 (ms between revealing each real char)
  charset?: string;
  flipDelayMs?: number;   // default 50 (ms between gibberish flips)
  encryptedClassName?: string;
  revealedClassName?: string;
};

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function generateRandomCharacter(charset: string): string {
  const index = Math.floor(Math.random() * charset.length);
  return charset.charAt(index);
}

function generateGibberishPreservingSpaces(original: string, charset: string): string {
  if (!original) return "";
  let result = "";
  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i];
    result += ch === " " ? " " : generateRandomCharacter(charset);
  }
  return result;
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [revealCount, setRevealCount] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastFlipTimeRef = useRef<number>(0);
  const scrambleCharsRef = useRef<string[]>(
    text ? generateGibberishPreservingSpaces(text, charset).split("") : [],
  );

  useEffect(() => {
    if (!isInView) return;
    const initial = text ? generateGibberishPreservingSpaces(text, charset) : "";
    scrambleCharsRef.current = initial.split("");
    startTimeRef.current = performance.now();
    lastFlipTimeRef.current = startTimeRef.current;
    setRevealCount(0);
    let isCancelled = false;
    const update = (now: number) => {
      if (isCancelled) return;
      const elapsedMs = now - startTimeRef.current;
      const totalLength = text.length;
      const currentRevealCount = Math.min(totalLength, Math.floor(elapsedMs / Math.max(1, revealDelayMs)));
      setRevealCount(currentRevealCount);
      if (currentRevealCount >= totalLength) return;
      const timeSinceLastFlip = now - lastFlipTimeRef.current;
      if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
        for (let index = 0; index < totalLength; index += 1) {
          if (index >= currentRevealCount) {
            scrambleCharsRef.current[index] = text[index] !== " " ? generateRandomCharacter(charset) : " ";
          }
        }
        lastFlipTimeRef.current = now;
      }
      animationFrameRef.current = requestAnimationFrame(update);
    };
    animationFrameRef.current = requestAnimationFrame(update);
    return () => { isCancelled = true; if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current); };
  }, [isInView, text, revealDelayMs, charset, flipDelayMs]);

  if (!text) return null;
  return (
    <motion.span ref={ref} className={cn(className)} aria-label={text} role="text">
      {text.split("").map((char, index) => {
        const isRevealed = index < revealCount;
        const displayChar = isRevealed ? char : char === " " ? " " : (scrambleCharsRef.current[index] ?? generateRandomCharacter(charset));
        return (<span key={index} className={cn(isRevealed ? revealedClassName : encryptedClassName)}>{displayChar}</span>);
      })}
    </motion.span>
  );
};
```

Note sul funzionamento, per chi vuole regolare i tempi:

- `useInView(ref, { once: true })` fa partire l'animazione una sola volta, quando lo `<span>` entra nel viewport.
- `revealCount = floor(elapsedMs / revealDelayMs)`: il numero di caratteri rivelati cresce nel tempo. Abbassa `revealDelayMs` per una rivelazione più rapida.
- Ogni `flipDelayMs` i caratteri ancora cifrati vengono ri-sorteggiati dal `charset`. Gli spazi restano spazi così le parole mantengono la forma.
- `encryptedClassName` colora i caratteri cifrati, `revealedClassName` quelli rivelati.

### File 2 — `components/encrypted-text-demo.tsx`

La demo, personalizzata con la nostra riga in italiano. Testo centrato e grande su fondo chiaro, monospace; caratteri cifrati in ink muted, rivelati in ink scuro.

```tsx
import { EncryptedText } from "@/components/ui/encrypted-text";
import React from "react";

export default function EncryptedTextDemo() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#f4efe6] px-6 py-12">
      <p className="mx-auto max-w-2xl text-center font-mono text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
        <EncryptedText
          text="Trasformiamo le idee in siti che vendono."
          encryptedClassName="text-[#9a8f80]"
          revealedClassName="text-[#26221d]"
          revealDelayMs={55}
          flipDelayMs={50}
        />
      </p>
    </div>
  );
}
```

Personalizzazioni applicate, da tenere o adattare al tuo brand:

- `text` con la riga italiana. Cambiala con la tua headline; l'effetto si adatta a qualsiasi lunghezza.
- `encryptedClassName="text-[#9a8f80]"`: ink muted per i caratteri ancora cifrati.
- `revealedClassName="text-[#26221d]"`: ink scuro per i caratteri rivelati.
- `font-mono` per dare il carattere "terminale"; la larghezza fissa rende il gibberish più leggibile mentre cambia.
- `revealDelayMs={55}` e `flipDelayMs={50}`: ritmo morbido. Alza i valori per rallentare, abbassali per accelerare.

L'effetto parte da solo quando la riga entra nel viewport (`once: true`), quindi funziona bene come headline di una sezione che si rivela allo scroll.
