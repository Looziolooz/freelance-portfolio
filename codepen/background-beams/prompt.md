Build a **Background Beams With Collision** background component for a React app: several thin gradient beams fall from the top of a container at different x positions and speeds, and each time a beam reaches the bottom line it triggers a small particle **explosion** (a burst of spans flying out plus a glow), then resets above the top and falls again. On top, a centered headline. Reproduce every detail below faithfully, including the collision detection and the explosion.

### Stack & setup
- **shadcn/ui** project on **Tailwind CSS v4** + **TypeScript**.
- Animation lib: **motion** (the `motion/react` package, the successor to framer-motion). Install: `npm i motion`.
- Use the shadcn `cn` helper from `@/lib/utils` (clsx + tailwind-merge).
- Place the component at `components/ui/background-beams-with-collision.tsx`.

If `@/lib/utils` doesn't exist yet, create it:
```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Brand tokens (use these exact hex values)
- Parchment canvas: `#efe9dc` → `#f4efe4` → `#f7f3ea` (top to bottom).
- Ink text: `#26221d`.
- Ochre-gold: `#c8972e`. Teal: `#2f6f68`. Forest: `#1f4d3a`.
- Beams run **teal into gold**; explosions are **gold**.

### Component: `components/ui/background-beams-with-collision.tsx`

```tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // Each beam: an initial x position, a delay, a duration, and a height. The
  // values are staggered so the beams fall as an irregular shower, not a wave.
  const beams = [
    { initialX: 40, translateX: 40, duration: 7, repeatDelay: 3, delay: 2 },
    { initialX: 160, translateX: 160, duration: 6, repeatDelay: 3, delay: 4 },
    { initialX: 280, translateX: 280, duration: 7, repeatDelay: 7, className: "h-6" },
    { initialX: 420, translateX: 420, duration: 5, repeatDelay: 14, delay: 4 },
    { initialX: 560, translateX: 560, duration: 11, repeatDelay: 2, className: "h-20" },
    { initialX: 720, translateX: 720, duration: 6, repeatDelay: 4, delay: 2, className: "h-12" },
    { initialX: 880, translateX: 880, duration: 9, repeatDelay: 2, className: "h-6" },
    { initialX: 1000, translateX: 1000, duration: 8, repeatDelay: 4, delay: 1 },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "h-screen relative flex items-center w-full justify-center overflow-hidden",
        // light parchment-to-cream wash instead of the original's dark slate
        "bg-gradient-to-b from-[#efe9dc] via-[#f4efe4] to-[#f7f3ea]",
        className
      )}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {children}

      {/* The collision floor: a thin line the beams detect against. */}
      <div
        ref={containerRef}
        className="absolute bottom-0 bg-transparent w-full inset-x-0 pointer-events-none"
        style={{
          boxShadow:
            "0 0 24px rgba(31,77,58,0.06), 0 1px 0 rgba(31,77,58,0.12)",
        }}
      />
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement | null>;
    parentRef: React.RefObject<HTMLDivElement | null>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({ detected: false, coordinates: null });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        // Collision = the beam's bottom edge reaches the floor line.
        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;
          setCollision({
            detected: true,
            coordinates: { x: relativeX, y: relativeY },
          });
          setCycleCollisionDetected(true);
        }
      }
    };
    const interval = setInterval(checkCollision, 50);
    return () => clearInterval(interval);
  }, [cycleCollisionDetected, containerRef, parentRef]);

  // After an explosion, clear it and re-key the beam so it falls again.
  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      const t1 = setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);
      const t2 = setTimeout(() => {
        setBeamKey((prev) => prev + 1);
      }, 2000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || 0,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || "1800px",
            translateX: beamOptions.translateX || "0px",
            rotate: beamOptions.rotate || 0,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          // teal head fading up into gold, transparent tail
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full",
          "bg-gradient-to-t from-[#2f6f68] via-[#c8972e] to-transparent",
          "drop-shadow-[0_0_6px_rgba(200,151,46,0.25)]",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});
CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  // ~20 gold particles, each with a randomized end position, fanning outward.
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      {/* central glow that blooms and fades */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 1.5] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute -inset-x-6 -inset-y-6 m-auto h-12 w-12 rounded-full bg-[radial-gradient(circle,rgba(200,151,46,0.55)_0%,rgba(200,151,46,0.18)_45%,rgba(200,151,46,0)_70%)]"
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-[#d8a93f] to-[#c8972e]"
        />
      ))}
    </div>
  );
};
```

### How the collision works (do not simplify this)
1. Each beam is a `motion.div` that animates `translateY` from above the top (`-200px`) down past the bottom (`1800px`), looping forever with a per-beam `duration`, `delay`, and `repeatDelay`.
2. `CollisionMechanism` polls every 50ms with `setInterval`, comparing the beam's `getBoundingClientRect().bottom` against the floor's `containerRect.top`. When the beam's bottom edge reaches the floor, that's a collision.
3. On collision it records the impact point **relative to the parent** (`relativeX`, `relativeY`) and flips `cycleCollisionDetected` so the same fall can't double-fire.
4. The impact point renders an `<Explosion>`: one central glow + 20 gold `motion.span` particles with randomized `directionX` (-40..40) and `directionY` (upward), each fading out over a random duration.
5. After 2s the collision state clears and the beam is re-keyed (`beamKey += 1`), which remounts the `motion.div` so it falls again from the top.

### The personalized demo (page that uses it)
Render the component with a centered Italian headline. Second line is a brand gradient clip-text (ochre-gold to teal to forest).

```tsx
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function Demo() {
  return (
    <BackgroundBeamsWithCollision>
      <h1 className="relative z-20 px-6 text-center font-serif text-4xl font-normal leading-tight tracking-tight text-[#26221d] md:text-6xl lg:text-7xl">
        Cosa c'e di piu bello dei beam?{" "}
        <span className="block bg-gradient-to-r from-[#c8972e] via-[#2f6f68] to-[#1f4d3a] bg-clip-text italic text-transparent">
          Beam che esplodono.
        </span>
      </h1>
    </BackgroundBeamsWithCollision>
  );
}
```

Map `font-serif` to a Playfair-style display face in your Tailwind theme (or swap the class for your own display font). Keep the canvas light and the motion elegant: thin beams, soft gold bursts, nothing harsh.

### Notes
- Tailwind v4: no `tailwind.config.js` content array is needed; arbitrary values like `bg-[#efe9dc]` and `bg-[radial-gradient(...)]` work out of the box.
- `motion/react` is a drop-in for `framer-motion` here (`motion`, `AnimatePresence`). If you're still on `framer-motion`, change only the import path.
- For accessibility, the whole background is decorative; the headline carries the meaning. If you want to honor reduced motion, gate the `setInterval` and the beam variants behind a `useReducedMotion()` check from `motion/react`.
