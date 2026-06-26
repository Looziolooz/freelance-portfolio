Costruisci un componente **GooeyInput** per **React + TypeScript** con **shadcn/ui** e **Tailwind CSS v4**. È un controllo di ricerca a pillola: da chiuso è un piccolo bottone, quando si attiva si espande in un campo di testo più largo, mentre una bolla circolare staccata con l'icona di ricerca si fonde visivamente nella pillola grazie a un filtro SVG "gooey" (sfocatura gaussiana + matrice di contrasto + composite). L'effetto liquido è il cuore del componente: la bolla sembra una goccia che si stacca dalla pillola e poi vi rientra.

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

### Come funziona il filtro gooey

Il trucco è tutto in tre primitive SVG, applicate al contenitore che racchiude pillola + bolla:

1. `feGaussianBlur` sfoca le forme: i bordi diventano morbidi e si toccano.
2. `feColorMatrix` (la riga `goo`) rialza l'alfa con un guadagno alto e una soglia negativa: i pixel sfocati a metà spariscono, quelli densi restano pieni. Dove due forme sfocate si sovrappongono l'alfa risale e diventa un'unica massa liquida.
3. `feComposite operator="atop"` ridisegna la grafica originale nitida sopra la massa gooey, così solo la "giuntura" tra pillola e bolla sembra fusa, mentre testo e icona restano definiti.

I valori `19 -9` nella matrice controllano quanto la fusione è marcata. Più alto il guadagno, più la goccia è viscosa. `gooeyBlur` (la `stdDeviation`) regola quanto largo è il collo che collega le due forme: ~5 è un buon compromesso.

### File 1 — `components/ui/gooey-input.tsx`

Il componente. Riproducilo così com'è. Tutte le props restano: `placeholder`, `value`/`onValueChange` (modalità controllata), `defaultValue` (non controllata), `onSearch`, `className`, `collapsedWidth` (default 115), `expandedWidth` (default 200), `expandedOffset` (default 50), `gooeyBlur` (default 5).

```tsx
"use client";
import * as React from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type GooeyInputProps = {
  placeholder?: string;
  /** Modalità controllata: passa value + onValueChange. */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Modalità non controllata: valore iniziale. */
  defaultValue?: string;
  /** Invocata su Invio (o sul submit del form interno). */
  onSearch?: (value: string) => void;
  className?: string;
  collapsedWidth?: number; // larghezza da chiuso, default 115
  expandedWidth?: number;  // larghezza da aperto, default 200
  expandedOffset?: number; // di quanto la bolla esce a destra, default 50
  gooeyBlur?: number;      // stdDeviation della sfocatura gooey, default 5
};

let gooeyIdSeq = 0;

export function GooeyInput({
  placeholder = "Cosa ti serve?",
  value,
  onValueChange,
  defaultValue = "",
  onSearch,
  className,
  collapsedWidth = 115,
  expandedWidth = 200,
  expandedOffset = 50,
  gooeyBlur = 5,
}: GooeyInputProps) {
  // value controllato se arriva dall'esterno, altrimenti stato interno.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = isControlled ? (value as string) : internalValue;

  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // id univoco per il filtro, così più istanze in pagina non collidono.
  const filterId = React.useMemo(() => `gooey-input-${gooeyIdSeq++}`, []);

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const expand = () => {
    setOpen(true);
    // focus dopo che l'input è interattivo
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const collapse = () => {
    if (!currentValue) setOpen(false);
  };

  // Variants motion: la pillola anima la larghezza, la bolla la posizione/scala,
  // l'input l'opacità. Curva premium (easeOutExpo-like).
  const ease = [0.16, 1, 0.3, 1] as const;

  const pillVariants: Variants = {
    collapsed: { width: collapsedWidth },
    expanded: { width: expandedWidth },
  };

  const bubbleVariants: Variants = {
    collapsed: { x: -2, scale: 0.78 },
    expanded: { x: expandedOffset, scale: 1 },
  };

  const inputVariants: Variants = {
    collapsed: { opacity: 0 },
    expanded: { opacity: 1 },
  };

  const state = open ? "expanded" : "collapsed";

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      {/* Filtro gooey: sfocatura → matrice di contrasto → ridisegno nitido. */}
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={gooeyBlur} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Il filtro è applicato a QUESTO wrapper: pillola e bolla si fondono. */}
      <div
        className="relative flex h-[52px] items-center"
        style={{ filter: `url(#${filterId})` }}
      >
        <motion.form
          initial={false}
          animate={state}
          variants={pillVariants}
          transition={{ duration: 0.55, ease }}
          onSubmit={(e) => {
            e.preventDefault();
            onSearch?.(currentValue);
          }}
          className="absolute inset-y-0 left-0 flex items-center rounded-full bg-[#26221d] pl-[22px] pr-14"
        >
          <motion.input
            ref={inputRef}
            type="text"
            value={currentValue}
            placeholder={placeholder}
            aria-label={placeholder}
            autoComplete="off"
            spellCheck={false}
            initial={false}
            animate={state}
            variants={inputVariants}
            transition={{ duration: 0.35 }}
            onChange={(e) => setValue(e.target.value)}
            onBlur={collapse}
            className={cn(
              "h-full w-full border-0 bg-transparent text-[15px] font-medium tracking-tight text-[#f4efe4] caret-[#c8972e] outline-none placeholder:text-[#b8ad9c]",
              open ? "pointer-events-auto" : "pointer-events-none",
            )}
          />
        </motion.form>

        {/* Bolla di ricerca staccata: cliccabile da chiusa per espandere. */}
        <motion.button
          type="button"
          onClick={expand}
          aria-label="Apri la ricerca"
          initial={false}
          animate={state}
          variants={bubbleVariants}
          transition={{ duration: 0.55, ease }}
          className="absolute right-0 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#c8972e] text-[#26221d]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[22px] w-[22px]"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
```

Note sul funzionamento, per chi vuole regolare i tempi:

- **Espansione**: cliccando la bolla (`expand`) parte `open=true`. La pillola anima `width` da `collapsedWidth` (~115) a `expandedWidth` (~200), la bolla scivola a destra di `expandedOffset` (~50) e torna a `scale: 1`, l'input passa a `opacity: 1`. Il filtro gooey stira la giuntura, quindi la bolla sembra una goccia che si allunga e si stacca.
- **Chiusura**: su `blur` con campo vuoto (`collapse`) torna `open=false`. Se c'è del testo resta aperto, così l'utente non perde quello che ha scritto.
- **Controllato vs non controllato**: passa `value` + `onValueChange` per gestirlo dall'esterno; altrimenti usa `defaultValue` e lo stato interno fa il resto.
- **`onSearch`**: il form interno invoca `onSearch(value)` su Invio.
- **`gooeyBlur`**: alza la `stdDeviation` per un collo più largo e viscoso, abbassala per una fusione più sottile.
- **Accessibilità**: la bolla è un vero `<button>` con `aria-label`, l'input ha `aria-label` dal placeholder. L'effetto liquido è puramente visivo e non tocca il focus order.

### File 2 — `components/gooey-input-demo.tsx`

La demo, personalizzata con i nostri colori e l'italiano. Il controllo è centrato su fondo parchment; pillola ink con testo parchment, bolla ochre-gold con icona scura.

```tsx
"use client";
import { GooeyInput } from "@/components/ui/gooey-input";
import React from "react";

export default function GooeyInputDemo() {
  const [query, setQuery] = React.useState("");

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#efe9dc] px-6 py-16">
      <GooeyInput
        placeholder="Cosa ti serve?"
        value={query}
        onValueChange={setQuery}
        onSearch={(q) => console.log("cerca:", q)}
        collapsedWidth={115}
        expandedWidth={200}
        expandedOffset={50}
        gooeyBlur={5}
      />
    </div>
  );
}
```

Personalizzazioni applicate, da tenere o adattare al tuo brand:

- `placeholder="Cosa ti serve?"`: la domanda in italiano. Cambiala con la tua call to action.
- Pillola `bg-[#26221d]` (ink) con testo `text-[#f4efe4]` (parchment) e caret `caret-[#c8972e]` (gold). Per invertire, scambia sfondo e testo: pillola chiara, testo ink.
- Bolla `bg-[#c8972e]` (ochre-gold) con icona `text-[#26221d]` (testo scuro su oro, mai bianco).
- Fondo `bg-[#efe9dc]` (parchment) per far risaltare il contrasto della pillola.
- `gooeyBlur={5}`, `expandedOffset={50}`: la goccia si stacca in modo netto ma morbido. Alza `expandedOffset` per allontanare di più la bolla; alza `gooeyBlur` per un collo più "liquido".

Il componente parte chiuso e compatto: è perfetto in una navbar o accanto a un titolo, dove occupa poco spazio finché non serve, e l'espansione gooey gli dà un tocco premium senza librerie pesanti.
