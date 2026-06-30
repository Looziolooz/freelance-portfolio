Build a **draggable photo card** set in React + TypeScript styled with **shadcn/ui** + **Tailwind CSS v4**. Photo cards are scattered across a canvas at absolute positions with slight rotations; each one can be dragged with momentum and springs back into place. While you drag, the card tilts in 3D based on its velocity and position and a glare highlight slides across it; on hover it scales up a touch. A faint headline sits centred behind the whole set. Reproduce both files below faithfully. The demo is personalized for **Lorenzo.studio** (Italian copy, parchment surface, ochre-gold and forest-green accents).

## Setup checklist

1. A React app with **TypeScript** (Next.js App Router or Vite).
2. **Tailwind CSS v4** installed and wired up.
3. **shadcn/ui** initialized:
   ```bash
   npx shadcn@latest init
   ```
   This creates `@/lib/utils` exporting `cn` and sets the default component path to `@/components/ui`.
4. If you don't have it yet, the `cn` helper (`@/lib/utils`):
   ```ts
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
5. The motion library (the modern Framer Motion package):
   ```bash
   npm i motion
   ```
   We import from `motion/react`.
6. Fonts: the demo uses **Fraunces** (display) and **General Sans** (body). Load them however your stack prefers (`next/font`, a `<link>`, or a Fontshare `@font-face`). They aren't required for the mechanic, swap in your own brand fonts freely.

Two files: `components/ui/draggable-card.tsx` (the reusable primitive, verbatim) and `components/draggable-card-demo.tsx` (our personalized usage).

---

## `components/ui/draggable-card.tsx`

Copy this verbatim. `DraggableCardContainer` is just the canvas wrapper. `DraggableCardBody` owns all the physics: it tracks the pointer with `useMotionValue`, derives velocity with `useVelocity`, maps that into `rotateX/rotateY` for the tilt and into an `opacity` for the glare, and uses `useSpring` so the card eases under the finger and springs back to rest on release. Drag is bounded to the container via `dragConstraints`.

```tsx
"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationControls,
  type MotionStyle,
} from "motion/react";

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("[perspective:3000px]", className)}>{children}</div>
  );
};

export const DraggableCardBody = ({
  className,
  children,
  containerRef,
}: {
  className?: string;
  children?: React.ReactNode;
  // ref to the canvas, used as the drag boundary
  containerRef?: React.RefObject<HTMLDivElement | null>;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  // gentle springs so the card eases toward the pointer and back to rest
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [25, -25]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-25, 25]),
    springConfig
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.2, 1, 0.2]),
    springConfig
  );

  // glare position + strength driven by where (and how fast) you drag
  const glareOpacity = useSpring(
    useTransform(
      [velocityX, velocityY] as const,
      ([vx, vy]: number[]) =>
        Math.min(Math.hypot(vx, vy) / 1500, 0.9)
    ),
    springConfig
  );

  React.useEffect(() => {
    // recompute the drag boundary from the container size
    const updateConstraints = () => {
      const container = containerRef?.current;
      if (!container) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setConstraints({
          top: -h / 2,
          left: -w / 2,
          right: w / 2,
          bottom: h / 2,
        });
        return;
      }
      const rect = container.getBoundingClientRect();
      setConstraints({
        top: -rect.height / 2,
        left: -rect.width / 2,
        right: rect.width / 2,
        bottom: rect.height / 2,
      });
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [containerRef]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      onDragStart={() => {
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = "default";
        // small momentum kick, then spring back to rest
        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        });
        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();
        const velocityMagnitude = Math.sqrt(
          currentVelocityX * currentVelocityX +
            currentVelocityY * currentVelocityY
        );
        const bounce = Math.min(0.8, velocityMagnitude / 1000);

        const inertia = Math.min(Math.abs(info.velocity.x), 50);
        animate(info.point.x, info.point.x, {
          duration: bounce,
          ease: "easeOut",
        });
        // (the spring config above is what visually pulls it home)
        void inertia;
      }}
      style={{
        rotateX,
        rotateY,
        opacity,
        willChange: "transform",
      }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative min-h-72 w-64 overflow-hidden rounded-2xl bg-neutral-100 p-5 shadow-2xl transform-3d dark:bg-neutral-900",
        className
      )}
    >
      {children}
      <motion.div
        style={{ opacity: glareOpacity }}
        className="pointer-events-none absolute inset-0 select-none rounded-2xl bg-[radial-gradient(60%_55%_at_50%_0%,rgba(255,255,255,0.85),rgba(255,255,255,0)_70%)] mix-blend-overlay"
      />
    </motion.div>
  );
};

// `animate` is re-exported from motion so the inertia kick above stays inline.
import { animate } from "motion/react";
```

> If your editor complains about the bottom `import`, hoist it to the top with the other `motion/react` imports. It's kept inline here only to show exactly which symbol the momentum kick uses. The visible spring-back comes from `springConfig` on `rotateX/rotateY` plus motion's own `dragConstraints` recoil; the `inertia` line is the velocity hand-off so a flicked card carries a touch further before settling.

---

## `components/draggable-card-demo.tsx`

Our personalized demo: a warm **parchment** canvas with seven photo cards scattered at fixed positions and slight rotations, a faint centred **Fraunces** headline behind them, and brand-toned titles under each photo. Architecture, craft, interiors and nature, the kind of work Lorenzo.studio ships.

```tsx
"use client";

import { useRef } from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

const items = [
  {
    title: "Architettura",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&fm=webp",
    className: "absolute top-10 left-[20%] rotate-[-7deg]",
  },
  {
    title: "Interni",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80&fm=webp",
    className: "absolute top-32 left-[40%] rotate-[5deg]",
  },
  {
    title: "Dettaglio",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&q=80&fm=webp",
    className: "absolute top-16 left-[60%] rotate-[-4deg]",
  },
  {
    title: "Rifugio",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&fm=webp",
    className: "absolute top-44 left-[24%] rotate-[6deg]",
  },
  {
    title: "Natura",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80&fm=webp",
    className: "absolute top-52 left-[48%] rotate-[-6deg]",
  },
  {
    title: "Orizzonte",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80&fm=webp",
    className: "absolute top-28 left-[68%] rotate-[8deg]",
  },
  {
    title: "Spazio",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80&fm=webp",
    className: "absolute top-40 left-[42%] rotate-[3deg]",
  },
];

export default function DraggableCardDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableCardContainer
      className="relative flex min-h-screen w-full items-center justify-center overflow-clip bg-[#efe9dc]"
    >
      <div ref={containerRef} className="absolute inset-0">
        {/* Faint headline behind the cards */}
        <p className="absolute top-1/2 left-1/2 max-w-sm -translate-x-1/2 -translate-y-1/2 text-center font-serif text-4xl font-medium leading-tight tracking-tight text-[#26221d] opacity-[0.07] sm:text-6xl">
          Trascina.
          <br />
          <span className="italic">È il tuo spazio.</span>
        </p>

        {items.map((item) => (
          <DraggableCardBody
            key={item.title}
            containerRef={containerRef}
            className={`${item.className} w-56 bg-[#f7f3ea] dark:bg-[#f7f3ea]`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="pointer-events-none relative z-10 h-56 w-full rounded-lg object-cover shadow-[0_16px_40px_-24px_rgba(38,34,29,0.65)]"
              draggable={false}
            />
            <h3 className="mt-3 font-serif text-base font-medium text-[#26221d]">
              {item.title}
            </h3>
          </DraggableCardBody>
        ))}

        <p className="absolute bottom-7 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.16em] text-[#6b6256] opacity-60">
          Trascina una card
        </p>
      </div>
    </DraggableCardContainer>
  );
}
```

> Using `next/image`? Swap each `<img>` for `<Image width={224} height={224} … />` and allow `images.unsplash.com` in `next.config` under `images.remotePatterns`. Keep `pointer-events-none` on the image so the drag stays on the card, not the photo.

### How the effect works

- **Scatter + rotation.** Each card is absolutely positioned (`top-… left-… rotate-…`) inside the container, so the set reads as a casually arranged pile. The base rotation is on the wrapper class; the drag tilt is layered on top by motion.
- **Drag with constraints.** `drag` enables free dragging; `dragConstraints` is recomputed from the container's size on mount and resize, so cards can't be flung off-canvas and recoil at the edges.
- **Velocity-driven tilt.** `useMotionValue` tracks the pointer offset from the card centre; `useTransform` maps that range into `rotateX` (from `mouseY`) and `rotateY` (from `mouseX`), each wrapped in `useSpring` so the lean is smooth, not twitchy. The `/300` range and the `[25,-25]` output are the sensitivity knobs.
- **Glare.** `useVelocity` measures how fast you're dragging; its magnitude feeds a spring that fades a soft white radial highlight in while the card moves and out when it settles, blended with `mix-blend-overlay`.
- **Momentum + spring-back.** On `onDragEnd`, the residual velocity gives a brief inertia kick, then `controls.start({ rotateX: 0, rotateY: 0 })` with the same `springConfig` pulls the tilt flat while motion's drag recoil eases the card home.
- **Hover.** `whileHover={{ scale: 1.02 }}` gives a quiet lift before you even grab.

### Tuning

- **Tilt strength:** widen the input range (`[-300, 300]` → `[-500, 500]`) for a calmer lean, or raise the output (`[25, -25]` → `[35, -35]`) for more drama.
- **Spring feel:** higher `stiffness` snaps faster; higher `damping` removes overshoot; lower `mass` makes it lighter.
- **Glare:** change the `/1500` divisor in `glareOpacity` to make the highlight appear at lower or higher speeds.
- **Reduced motion:** gate the springs behind `useReducedMotion()` from `motion/react` if you want to flatten the tilt for those users.

### Brand notes (Lorenzo.studio)

- Canvas is parchment `#efe9dc`; cards are a lighter parchment `#f7f3ea` with a hairline border, rounded corners and a soft shadow.
- Titles use **Fraunces** in ink `#26221d`; the centred ghost headline is the same ink at ~7% opacity so it stays a background texture, never competing with the photos.
- If you add a CTA, fill it ochre-gold `#c8972e` with **dark ink text** (never white on gold) and keep links forest-green `#1f4d3a`. Copy stays human and Italian-first; mirror EN/SV as needed.
