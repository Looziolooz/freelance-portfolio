Build a **DottedGlowBackground** component for React + shadcn/ui — a `<canvas>` grid of dots that each pulse their alpha in a triangle wave and glow (canvas `shadowBlur` in a glow color) when bright. Ship it as a reusable background primitive, then assemble the demo below: a tidy parchment card with a forest-green monogram badge, a tagline + arrow footer row, and the shimmering dotted canvas behind it, faded at the edges by a radial mask.

The component is framework-agnostic in spirit but here it targets a **shadcn/ui + Tailwind v4 + TypeScript** project. Match every detail.

### Stack & setup
Assumes a Vite or Next.js app already wired for **shadcn/ui** with **Tailwind CSS v4** and **TypeScript**. If you're starting clean:

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install tailwindcss @tailwindcss/vite
npx shadcn@latest init
```

- Tailwind v4 is configured via the `@tailwindcss/vite` plugin (or `@import "tailwindcss";` in your CSS) — there is **no `tailwind.config.js` color block** to edit; tokens live as CSS variables.
- shadcn writes the `cn` helper to `@/lib/utils`. If it isn't there yet:

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- Components live under `@/components/ui` (the shadcn convention). We'll add two files there.

### Design tokens (Lorenzo.studio palette)
Add these CSS variables once, in your global stylesheet (e.g. `src/index.css`, after `@import "tailwindcss";`). The canvas reads the dot/glow colors from `--dg-dot` / `--dg-glow`, so you can retheme without touching JS — including light/dark variants.

```css
:root {
  --dg-parchment: #efe9dc;
  --dg-parchment-2: #f4efe4;
  --dg-ink: #26221d;
  --dg-ink-muted: #6b6256;
  --dg-gold: #c8972e;
  --dg-forest: #1f4d3a;
  --dg-teal: #2f6f68;

  /* Canvas-driven colors (swap --dg-glow to --dg-teal for the cool variant) */
  --dg-dot: var(--dg-ink-muted);   /* #6b6256 */
  --dg-glow: var(--dg-gold);       /* #c8972e — or #2f6f68 teal */
}

.dark {
  /* Same dots, slightly hotter glow on a dark canvas */
  --dg-dot: #7a7164;
  --dg-glow: #e8b25e;
}
```

### Component A — `DottedGlowBackground`

Create `src/components/ui/dotted-glow-background.tsx`. It renders an absolutely-positioned `<canvas>` that fills its nearest positioned parent. Every detail of the animation matches the original:

- **Grid:** dots are laid out every `gap` px. **Odd rows are offset by half a gap** (brick / hex feel).
- **Per-dot life:** each dot stores its own `phase` (random `0..2π`) and `speed` (random in `[speedMin, speedMax]`).
- **Pulse:** a **triangle wave** `0→1→0` of `phase + time * speed` drives the dot's alpha between `0.12` and `1.0`. No easing libs — it's pure math.
- **Glow:** when the wave value `w > 0.6`, set `ctx.shadowBlur = glowBlur * w` and `ctx.shadowColor = glowColor`; otherwise `shadowBlur = 0`. Dots only "light up" near their peak, which reads as a slow shimmer.
- **DPR + resize:** size the backing store to `cssSize * devicePixelRatio` and `ctx.setTransform(dpr,0,0,dpr,0,0)` so you draw in CSS pixels at full sharpness; rebuild the grid on resize.
- **Global opacity** multiplies every dot's alpha; **background fade** is delegated to a radial CSS mask on the canvas (the `backgroundOpacity` prop tunes its center hardness).
- **Reduced motion:** under `prefers-reduced-motion: reduce`, paint one static, dimmed frame and stop.

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DottedGlowBackgroundProps
  extends React.HTMLAttributes<HTMLCanvasElement> {
  /** Distance between dots, in CSS px. */
  gap?: number;
  /** Dot radius, in CSS px. */
  radius?: number;
  /** Dot color. Defaults to the `--dg-dot` CSS variable. */
  color?: string;
  /** Glow color used for shadowBlur when a dot is bright. Defaults to `--dg-glow`. */
  glowColor?: string;
  /** Global layer opacity (0..1). */
  opacity?: number;
  /** Center hardness of the radial edge fade (0..1). Higher = solid further out. */
  backgroundOpacity?: number;
  /** Min / max per-dot pulse speed. */
  speedMin?: number;
  speedMax?: number;
  /** Multiplier from elapsed time → phase. */
  speedScale?: number;
  /** Max shadowBlur (px) at a dot's peak. */
  glowBlur?: number;
}

interface Dot {
  x: number;
  y: number;
  phase: number;
  speed: number;
}

function readVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

/** Triangle wave 0→1→0 over a normalized phase. */
function triangle(p: number) {
  const t = p - Math.floor(p);
  return t < 0.5 ? t * 2 : 2 - t * 2;
}

export function DottedGlowBackground({
  gap = 22,
  radius = 1.6,
  color,
  glowColor,
  opacity = 0.85,
  backgroundOpacity = 0.38,
  speedMin = 0.4,
  speedMax = 1.1,
  speedScale = 0.0014,
  glowBlur = 7,
  className,
  style,
  ...props
}: DottedGlowBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const dotsRef = React.useRef<Dot[]>([]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dotColor = color ?? readVar("--dg-dot", "#6b6256");
    const glow = glowColor ?? readVar("--dg-glow", "#c8972e");

    let cssW = 0;
    let cssH = 0;

    const buildGrid = () => {
      const dots: Dot[] = [];
      let row = 0;
      for (let y = gap; y < cssH - gap * 0.5; y += gap) {
        const offset = row % 2 === 1 ? gap / 2 : 0;
        for (let x = gap + offset; x < cssW - gap * 0.5; x += gap) {
          dots.push({
            x,
            y,
            phase: Math.random() * Math.PI * 2,
            speed: speedMin + Math.random() * (speedMax - speedMin),
          });
        }
        row++;
      }
      dotsRef.current = dots;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.globalAlpha = opacity * 0.55;
      ctx.fillStyle = dotColor;
      for (const d of dotsRef.current) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = dotColor;
      const t = now * speedScale;
      for (const d of dotsRef.current) {
        const w = triangle(d.phase + t * d.speed);
        const a = 0.12 + w * 0.88;
        ctx.globalAlpha = opacity * a;
        if (w > 0.6) {
          ctx.shadowBlur = glowBlur * w;
          ctx.shadowColor = glow;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      drawStatic();
    } else {
      rafRef.current = requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [
    gap,
    radius,
    color,
    glowColor,
    opacity,
    speedMin,
    speedMax,
    speedScale,
    glowBlur,
  ]);

  // Radial mask fades the dots out toward the edges. `backgroundOpacity`
  // sets where the solid center ends (0..1 → ~20%..60% of the radius).
  const inner = Math.round(20 + backgroundOpacity * 60);
  const maskImage = `radial-gradient(circle at 50% 50%, #000 ${inner}%, transparent 78%)`;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ WebkitMaskImage: maskImage, maskImage, ...style }}
      {...props}
    />
  );
}
```

### Component B — the demo card

Create `src/components/ui/dotted-glow-card.tsx`. It's a self-contained showcase: the dotted background behind a parchment card with a forest monogram and a tagline/arrow footer.

- **Stage:** a relatively-positioned flex container that centers the card and clips the canvas. Give it the parchment radial backdrop.
- **Badge:** a 64px rounded square in **forest** `#1f4d3a` with a Playfair-italic **"L"** in parchment, centered in the top region.
- **Footer row:** tagline **"Studio digitale che vende."** on the left, an arrow button on the right. The arrow uses the **ochre** fill — so per the brand rule its icon is **dark ink, never white**.

```tsx
import { ArrowRight } from "lucide-react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export function DottedGlowCard() {
  return (
    <div
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden p-8"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 12%, var(--dg-parchment-2), var(--dg-parchment) 70%)",
      }}
    >
      <DottedGlowBackground />

      <article
        className="relative z-10 flex min-h-[232px] w-full max-w-[340px] flex-col items-center justify-between rounded-[18px] border px-[26px] pb-[22px] pt-7 backdrop-blur-sm"
        style={{
          background: "rgba(244, 239, 228, 0.86)",
          borderColor: "rgba(38, 34, 29, 0.10)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.6), 0 18px 40px -24px rgba(38,34,29,.45), 0 2px 8px -4px rgba(38,34,29,.18)",
        }}
      >
        <div className="flex flex-1 items-center justify-center">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-[34px] italic leading-none"
            style={{
              background: "var(--dg-forest)",
              color: "var(--dg-parchment-2)",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.12), 0 10px 22px -10px rgba(20,58,43,.55)",
            }}
          >
            L
          </span>
        </div>

        <div
          className="flex w-full items-center justify-between gap-4 border-t pt-[18px]"
          style={{ borderColor: "rgba(38, 34, 29, 0.10)" }}
        >
          <p
            className="m-0 text-sm font-medium tracking-tight"
            style={{ color: "var(--dg-ink)" }}
          >
            Studio digitale che vende.
          </p>
          <span
            className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full"
            style={{
              background: "var(--dg-gold)",
              color: "var(--dg-ink)", // ochre fill → dark icon, never white
              boxShadow: "0 6px 16px -8px rgba(200,151,46,.7)",
            }}
          >
            <ArrowRight size={18} strokeWidth={2} />
          </span>
        </div>
      </article>
    </div>
  );
}
```

`lucide-react` ships with shadcn; if it's missing: `npm install lucide-react`. Don't forget the **Playfair Display** font (load it once via `next/font`, a `<link>`, or `@fontsource/playfair-display`) so the monogram renders italic serif.

### Props reference (DottedGlowBackground)
| Prop | Default | Purpose |
| --- | --- | --- |
| `gap` | `22` | px between dots; odd rows are offset by half this |
| `radius` | `1.6` | dot radius in px |
| `color` | `--dg-dot` | dot fill (CSS var fallback `#6b6256`) |
| `glowColor` | `--dg-glow` | glow color when a dot peaks (`#c8972e` / teal `#2f6f68`) |
| `opacity` | `0.85` | global layer opacity multiplier |
| `backgroundOpacity` | `0.38` | radial-mask center hardness (edge fade) |
| `speedMin` / `speedMax` | `0.4` / `1.1` | per-dot pulse speed range |
| `speedScale` | `0.0014` | time → phase factor (overall tempo) |
| `glowBlur` | `7` | max `shadowBlur` px at a dot's peak |

### Variants to try
- **Cool glow:** `glowColor="#2f6f68"` (teal) for a calmer, less golden shimmer.
- **Denser field:** `gap={16}` `radius={1.4}` for a finer mesh; raise `glowBlur` to `9`.
- **Hero backdrop:** drop the card, set `backgroundOpacity={0.55}`, and place headline text in the positioned parent — the canvas already fills `inset-0`.

### Notes
- The canvas only reads colors from CSS variables on mount, so theme swaps that change `--dg-dot` / `--dg-glow` take effect on remount (or pass `color`/`glowColor` props directly for live theming).
- `shadowBlur` is the cost center: on huge canvases, raise `gap` or lower `glowBlur` before anything else.
- Honor the brand rule everywhere — **ochre fills carry dark ink text/icons, never white**.
