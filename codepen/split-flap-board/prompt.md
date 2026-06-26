Costruisci un tabellone Solari a palette ribaltabili (split-flap departure board) per **React + TypeScript** con **shadcn/ui** e **Tailwind CSS v4**. Il componente si chiama `TextFlippingBoard`. L'effetto: una griglia di celle alte; a ogni nuovo messaggio ogni cella scorre tra caratteri casuali e poi si ferma sul carattere finale, con un ribaltamento meccanico a ogni cambio (la falda superiore ruota verso il basso e scopre il nuovo carattere). Circa il 20% degli scatti accende un colore accento. I token colore `{G}{O}{T}{S}{W}` diventano quadrati di colore pieno. Il testo viene mandato a capo sulle colonne e centrato; i messaggi si alternano ogni 6 secondi.

### Setup

Serve un progetto con shadcn/ui gia inizializzato:

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

### Costanti del modello (riproducile esatte)

```ts
export const BOARD_ROWS = 6;
export const BOARD_COLS = 22;

// Set di caratteri delle palette. Nessun accento: il tabellone non li ha.
export const FLAP_CHARS =
  " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$()-+&=;:'\"%,./?°";

// Tempistiche
export const COL_DELAY = 30;     // ms di ritardo iniziale per colonna
export const ROW_DELAY = 20;     // ms di ritardo iniziale per riga
export const STEP_INTERVAL = 55; // ms tra uno scatto di scramble e il successivo
export const FLASH_CHANCE = 0.2; // quota di scatti che accendono un accento
export const FLIP_MS = 130;      // durata di un ribaltamento
export const CYCLE_MS = 6000;    // permanenza di ogni messaggio

// Palette accento del brand: [riempimento, inchiostro sul riempimento].
export const ACCENTS: [string, string][] = [
  ["#c8972e", "#26221d"], // oro — testo scuro
  ["#1f4d3a", "#f4efe4"], // foresta — testo chiaro
  ["#2f6f68", "#f4efe4"], // teal — testo chiaro
  ["#b85c34", "#f4efe4"], // terracotta — testo chiaro
  ["#8a9a6b", "#26221d"], // salvia — testo scuro
];

// Token colore -> quadrato di colore pieno (al posto della palette).
export const COLOR_MAP: Record<string, string> = {
  G: "#1f4d3a",
  O: "#c8972e",
  T: "#2f6f68",
  S: "#8a9a6b",
  W: "#f4efe4",
};
```

### Come funziona l'effetto, in breve

1. **Layout.** Ogni messaggio ha righe separate da `\n`. Ogni riga va a capo a `BOARD_COLS` colonne per parole intere, poi il blocco di righe viene centrato in verticale sul tabellone e ogni riga centrata in orizzontale. Risultato: una matrice `BOARD_ROWS x BOARD_COLS` di caratteri target.
2. **Scramble per cella.** Ogni cella parte con un ritardo `col*COL_DELAY + row*ROW_DELAY`, cosi il movimento attraversa il tabellone in diagonale. Poi scatta ogni `STEP_INTERVAL` ms tra caratteri casuali di `FLAP_CHARS`. Numero di scatti: 12-20 per un carattere reale, 6-10 per uno spazio (gli spazi si calmano negli ultimi scatti).
3. **Ribaltamento meccanico.** A ogni cambio di carattere la falda superiore mostra il vecchio carattere e ruota `rotateX(0 -> -90deg)` con origine sul bordo inferiore, scoprendo le meta statiche gia impostate sul nuovo carattere; una falda inferiore risale `rotateX(90 -> 0deg)` con origine sul bordo superiore. Si usa `perspective` sulla cella + la Web Animations API.
4. **Flash accento.** Circa il `FLASH_CHANCE` degli scatti colora la cella con un accento del brand preso a caso da `ACCENTS`.
5. **Tessere colore.** Se il carattere target e una chiave di `COLOR_MAP` la cella diventa un quadrato di colore pieno invece di una palette.
6. **Ciclo.** I messaggi si alternano ogni `CYCLE_MS`.

### File 1 — `components/ui/text-flipping-board.tsx`

Riproducilo cosi com'e. Props: `messages` (array di stringhe, `\n` per andare a capo), `rows`, `cols`, `cycleMs`, `className`.

```tsx
"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const BOARD_ROWS = 6;
const BOARD_COLS = 22;
const FLAP_CHARS =
  " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$()-+&=;:'\"%,./?°";
const COL_DELAY = 30;
const ROW_DELAY = 20;
const STEP_INTERVAL = 55;
const FLASH_CHANCE = 0.2;
const FLIP_MS = 130;

const ACCENTS: [string, string][] = [
  ["#c8972e", "#26221d"],
  ["#1f4d3a", "#f4efe4"],
  ["#2f6f68", "#f4efe4"],
  ["#b85c34", "#f4efe4"],
  ["#8a9a6b", "#26221d"],
];
const COLOR_MAP: Record<string, string> = {
  G: "#1f4d3a",
  O: "#c8972e",
  T: "#2f6f68",
  S: "#8a9a6b",
  W: "#f4efe4",
};

type Cell = {
  el: HTMLDivElement;
  topGlyph: HTMLDivElement;
  botGlyph: HTMLDivElement;
  row: number;
  col: number;
  current: string;
  timer: ReturnType<typeof setTimeout> | null;
};

type TextFlippingBoardProps = {
  messages: string[];
  rows?: number;
  cols?: number;
  cycleMs?: number;
  className?: string;
};

function randomFlapChar(): string {
  return FLAP_CHARS.charAt(Math.floor(Math.random() * FLAP_CHARS.length));
}

// Manda a capo per parole a `cols`, poi centra il blocco verticalmente e ogni
// riga orizzontalmente. Ritorna una matrice rows x cols di caratteri target.
function layout(message: string, rows: number, cols: number): string[][] {
  const rawLines = message.split("\n");
  let wrapped: string[] = [];
  for (const raw of rawLines) {
    const words = raw.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      if (!line.length) line = word;
      else if (line.length + 1 + word.length <= cols) line += " " + word;
      else {
        wrapped.push(line);
        line = word;
      }
    }
    if (line.length || words.length === 0) wrapped.push(line);
  }
  if (wrapped.length > rows) wrapped = wrapped.slice(0, rows);

  const topPad = Math.floor((rows - wrapped.length) / 2);
  const target: string[][] = [];
  for (let r = 0; r < rows; r += 1) {
    const rowChars: string[] = [];
    const src = r - topPad;
    const text = src >= 0 && src < wrapped.length ? wrapped[src] : "";
    const leftPad = Math.floor((cols - text.length) / 2);
    for (let c = 0; c < cols; c += 1) {
      const idx = c - leftPad;
      rowChars.push(idx >= 0 && idx < text.length ? text.charAt(idx) : " ");
    }
    target.push(rowChars);
  }
  return target;
}

export const TextFlippingBoard: React.FC<TextFlippingBoardProps> = ({
  messages,
  rows = BOARD_ROWS,
  cols = BOARD_COLS,
  cycleMs = 6000,
  className,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !messages.length) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    grid.style.gridTemplateColumns = `repeat(${cols}, var(--sfb-cell-w, 26px))`;
    grid.style.gridAutoRows = "var(--sfb-cell-h, 52px)";

    // ---- costruisci la griglia ----
    const cells: Cell[] = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const el = document.createElement("div");
        el.className = "sfb-cell";

        const topHalf = document.createElement("div");
        topHalf.className = "sfb-half sfb-half-top";
        const topGlyph = document.createElement("div");
        topGlyph.className = "sfb-glyph";
        topHalf.appendChild(topGlyph);

        const botHalf = document.createElement("div");
        botHalf.className = "sfb-half sfb-half-bottom";
        const botGlyph = document.createElement("div");
        botGlyph.className = "sfb-glyph";
        botHalf.appendChild(botGlyph);

        el.appendChild(topHalf);
        el.appendChild(botHalf);
        grid.appendChild(el);

        cells.push({ el, topGlyph, botGlyph, row: r, col: c, current: " ", timer: null });
      }
    }

    const setGlyph = (cell: Cell, ch: string) => {
      cell.topGlyph.textContent = ch;
      cell.botGlyph.textContent = ch;
      cell.current = ch;
    };
    const clearTile = (cell: Cell) => {
      cell.el.classList.remove("is-tile");
      cell.el.style.removeProperty("background");
      cell.el.style.removeProperty("color");
    };
    const applyTile = (cell: Cell, color: string) => {
      cell.el.classList.add("is-tile");
      cell.el.style.background = color;
      cell.el.style.color = color === "#f4efe4" ? "#2b2a26" : "#f4efe4";
      setGlyph(cell, " ");
    };
    const flash = (cell: Cell, on: boolean) => {
      if (on) {
        const a = ACCENTS[Math.floor(Math.random() * ACCENTS.length)];
        cell.el.style.setProperty("--sfb-flash", a[0]);
        cell.el.style.setProperty("--sfb-flash-ink", a[1]);
        cell.el.classList.add("is-flash");
      } else {
        cell.el.classList.remove("is-flash");
      }
    };

    // Un ribaltamento: falda superiore col vecchio carattere ruota giu, falda
    // inferiore col nuovo carattere risale. Senza WAAPI: swap istantaneo.
    const flip = (cell: Cell, newChar: string) => {
      const oldChar = cell.current;
      setGlyph(cell, newChar);
      if (reduceMotion || typeof cell.el.animate !== "function" || oldChar === newChar) return;

      const leafTop = document.createElement("div");
      leafTop.className = "sfb-leaf sfb-leaf-top";
      const lt = document.createElement("div");
      lt.className = "sfb-glyph";
      lt.style.alignSelf = "flex-start";
      lt.textContent = oldChar;
      leafTop.appendChild(lt);

      const leafBot = document.createElement("div");
      leafBot.className = "sfb-leaf sfb-leaf-bottom";
      const lb = document.createElement("div");
      lb.className = "sfb-glyph";
      lb.style.alignSelf = "flex-end";
      lb.textContent = newChar;
      leafBot.appendChild(lb);

      cell.el.appendChild(leafTop);
      cell.el.appendChild(leafBot);

      const aTop = leafTop.animate(
        [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }],
        { duration: FLIP_MS * 0.55, easing: "cubic-bezier(0.36, 0, 0.66, -0.2)", fill: "forwards" },
      );
      aTop.onfinish = () => {
        leafTop.remove();
        const aBot = leafBot.animate(
          [{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }],
          { duration: FLIP_MS * 0.45, easing: "cubic-bezier(0.34, 1.2, 0.64, 1)", fill: "forwards" },
        );
        aBot.onfinish = () => leafBot.remove();
      };
    };

    const driveCell = (cell: Cell, targetChar: string) => {
      if (cell.timer) {
        clearTimeout(cell.timer);
        cell.timer = null;
      }
      flash(cell, false);

      if (Object.prototype.hasOwnProperty.call(COLOR_MAP, targetChar)) {
        const color = COLOR_MAP[targetChar];
        const tileDelay = cell.col * COL_DELAY + cell.row * ROW_DELAY;
        cell.timer = setTimeout(() => applyTile(cell, color), tileDelay);
        return;
      }
      clearTile(cell);

      const isSpace = targetChar === " ";
      const steps = isSpace
        ? 6 + Math.floor(Math.random() * 5)
        : 12 + Math.floor(Math.random() * 9);
      const startDelay = cell.col * COL_DELAY + cell.row * ROW_DELAY;
      let step = 0;

      const tick = () => {
        if (step >= steps) {
          flash(cell, false);
          flip(cell, targetChar);
          cell.timer = null;
          return;
        }
        const ch = isSpace && step > steps - 3 ? " " : randomFlapChar();
        flash(cell, Math.random() < FLASH_CHANCE);
        flip(cell, ch);
        step += 1;
        cell.timer = setTimeout(tick, STEP_INTERVAL);
      };
      cell.timer = setTimeout(tick, startDelay);
    };

    const showMessage = (message: string) => {
      const target = layout(message, rows, cols);
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          driveCell(cells[r * cols + c], target[r][c]);
        }
      }
    };

    if (reduceMotion) {
      const t0 = layout(messages[0], rows, cols);
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const cell = cells[r * cols + c];
          const ch = t0[r][c];
          if (Object.prototype.hasOwnProperty.call(COLOR_MAP, ch)) applyTile(cell, COLOR_MAP[ch]);
          else setGlyph(cell, ch);
        }
      }
      return () => {
        cells.forEach((cell) => cell.el.remove());
      };
    }

    let msgIndex = 0;
    showMessage(messages[msgIndex]);
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      showMessage(messages[msgIndex]);
    }, cycleMs);

    return () => {
      clearInterval(interval);
      cells.forEach((cell) => {
        if (cell.timer) clearTimeout(cell.timer);
        cell.el.remove();
      });
    };
  }, [messages, rows, cols, cycleMs]);

  return (
    <div className={cn("sfb-board", className)} aria-hidden="true">
      <div ref={gridRef} className="sfb-grid" />
    </div>
  );
};
```

> Nota su `motion`: il ribaltamento usa la Web Animations API nativa (`element.animate`), che e piu adatta a centinaia di micro-animazioni indipendenti come queste. Tieni comunque `motion` installato: lo usi per far entrare il tabellone nella pagina (vedi demo) o per legare il ciclo dei messaggi allo scroll con `useInView`.

### File 2 — gli stili del tabellone

Con Tailwind v4 puoi tenere queste classi in un blocco CSS importato una volta (`app/globals.css` o un file dedicato importato dal componente). Le celle, le falde e le tessere colore vivono qui perche sono create in modo imperativo.

```css
/* text-flipping-board.css */
.sfb-board {
  --sfb-cell-w: 26px;
  --sfb-cell-h: 52px; /* celle alte ~3:6 */
  --sfb-gap: 5px;
  display: inline-block;
  background: #f4efe4;          /* pannello pergamena */
  padding: 22px;
  border-radius: 18px;
  border: 1px solid rgba(42, 38, 32, 0.1);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.6) inset,
    0 24px 60px -28px rgba(38, 34, 29, 0.45),
    0 8px 22px -16px rgba(38, 34, 29, 0.3);
}

.sfb-grid {
  display: grid;
  grid-template-columns: repeat(22, var(--sfb-cell-w));
  grid-auto-rows: var(--sfb-cell-h);
  gap: var(--sfb-gap);
}

.sfb-cell {
  position: relative;
  width: var(--sfb-cell-w);
  height: var(--sfb-cell-h);
  border-radius: 4px;
  background: #d8d4c8;          /* cella grigio caldo chiaro */
  color: #2b2a26;              /* glifo inchiostro scuro */
  font-family: "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", monospace;
  font-weight: 600;
  font-size: 26px;
  line-height: 1;
  overflow: hidden;
  perspective: 220px;          /* 3D per il ribaltamento */
  box-shadow: 0 1px 2px rgba(38, 34, 29, 0.18);
}

/* cucitura scura tra falda alta e bassa */
.sfb-cell::after {
  content: "";
  position: absolute;
  left: 0; right: 0; top: 50%;
  height: 1px;
  transform: translateY(-0.5px);
  background: rgba(38, 34, 29, 0.32);
  z-index: 6;
  pointer-events: none;
}

/* striscia decorativa rigata in fondo a ogni cella */
.sfb-cell::before {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 4px;
  z-index: 7;
  pointer-events: none;
  background: repeating-linear-gradient(
    -45deg,
    rgba(38, 34, 29, 0.22) 0 2px,
    rgba(38, 34, 29, 0) 2px 4px
  );
}

/* meta statiche: ognuna contiene un glifo a tutta altezza, ritagliato a meta */
.sfb-half {
  position: absolute;
  left: 0; right: 0;
  height: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  z-index: 2;
}
.sfb-half-top { top: 0; align-items: flex-start; }
.sfb-half-bottom { bottom: 0; align-items: flex-end; }

.sfb-glyph {
  height: 200%;                /* altezza piena dentro una meta */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.sfb-half-top .sfb-glyph { align-self: flex-start; }
.sfb-half-bottom .sfb-glyph { align-self: flex-end; }

/* falde animate, sopra le meta statiche durante un ribaltamento */
.sfb-leaf {
  position: absolute;
  left: 0; right: 0;
  height: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  z-index: 4;
  backface-visibility: hidden;
  will-change: transform;
}
.sfb-leaf-top {
  top: 0;
  align-items: flex-start;
  transform-origin: bottom center;
  background: #d8d4c8;
  box-shadow: 0 1px 3px rgba(38, 34, 29, 0.25);
}
.sfb-leaf-bottom {
  bottom: 0;
  align-items: flex-end;
  transform-origin: top center;
  background: #d4d0c3;
}

/* tessera colore: quadrato pieno al posto della palette */
.sfb-cell.is-tile { color: #2b2a26; }
.sfb-cell.is-tile .sfb-half,
.sfb-cell.is-tile .sfb-leaf { display: none; }
.sfb-cell.is-tile::before { opacity: 0; }

/* flash accento su uno scatto di scramble */
.sfb-cell.is-flash .sfb-half,
.sfb-cell.is-flash .sfb-leaf-top { background: var(--sfb-flash, #c8972e); }
.sfb-cell.is-flash { color: var(--sfb-flash-ink, #26221d); }

@media (prefers-reduced-motion: reduce) {
  .sfb-leaf { display: none; }
}
```

### File 3 — `components/text-flipping-board-demo.tsx`

La demo, personalizzata con righe italiane da tabellone partenze per fondatori e PMI. Senza accenti, perche il set di caratteri non li prevede. Il tabellone entra in pagina con un fade morbido tramite `motion`.

```tsx
"use client";
import { motion } from "motion/react";
import { TextFlippingBoard } from "@/components/ui/text-flipping-board";
import "@/components/ui/text-flipping-board.css";

// \n forza l'andata a capo tra le due righe del tabellone.
const MESSAGES = [
  "DESTINAZIONE\nCRESCITA",
  "IMBARCO IMMEDIATO\nPER IL TUO SITO",
  "MENO RUMORE\nPIU VENDITE",
  "DAL BRAND\nAL FATTURATO",
  "PROSSIMA PARTENZA\nLORENZO STUDIO",
];

export default function TextFlippingBoardDemo() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#efe9dc] px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <TextFlippingBoard messages={MESSAGES} cycleMs={6000} />
      </motion.div>
    </div>
  );
}
```

Personalizzazioni applicate, da tenere o adattare al tuo brand:

- **Messaggi.** Cinque righe in italiano pensate per chi vende un sito o un servizio. Cambiale liberamente: ogni riga si manda a capo da sola sulle 22 colonne e resta centrata. Evita gli accenti (non sono nel set `FLAP_CHARS`); scrivi `PIU` non `PIÙ`.
- **Palette accento** (`ACCENTS`): oro `#c8972e` (testo scuro), foresta `#1f4d3a` (testo chiaro), teal `#2f6f68` (testo chiaro), terracotta `#b85c34` (testo chiaro), salvia `#8a9a6b` (testo scuro). L'oro vuole sempre testo scuro, mai bianco.
- **Tema chiaro.** Tela e pannello pergamena (`#efe9dc` / `#f4efe4`), celle grigio caldo chiaro (`#d8d4c8`), glifi inchiostro (`#2b2a26`), pannello arrotondato con ombra morbida e striscia rigata in fondo a ogni cella.
- **Tessere colore.** Inserisci `{G}{O}{T}{S}{W}` (foresta, oro, teal, salvia, pergamena) dentro un messaggio per disegnare quadrati di colore pieno: utili per bordi, scacchiere o un piccolo logo a mosaico. Esempio: `"GG  CRESCITA  GG"`.
- **Dimensione celle.** Regola `--sfb-cell-w` e `--sfb-cell-h` sul `.sfb-board` per ingrandire o rimpicciolire tutto il tabellone senza toccare la logica.
- **Ritmo.** `STEP_INTERVAL` (velocita dello scramble), `COL_DELAY`/`ROW_DELAY` (sfasamento diagonale), `cycleMs` (permanenza di ogni messaggio). Alza i valori per un movimento piu calmo, abbassali per renderlo nervoso.

Con `prefers-reduced-motion` il tabellone salta scramble e ribaltamenti e mostra subito il primo messaggio statico, restando leggibile.
