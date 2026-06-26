Build a scroll-driven **MacBook reveal** section as a reusable component, using **React + Tailwind CSS v4 + TypeScript**, **motion/react** for the scroll animation, **@tabler/icons-react** for keyboard glyphs, and shadcn/ui conventions (the `cn` helper from `@/lib/utils`, file under `components/ui`). As the visitor scrolls, a tilted MacBook lid opens flat, the screen scales up, and a headline above fades up and out. The screen shows a clean dashboard, so it reads as "a site we could build for you". Match every detail below.

## Setup

Assumes an existing app with **shadcn/ui** initialized (`components.json` present, Tailwind v4, the `cn` helper at `@/lib/utils`). If not, run:

```bash
npx shadcn@latest init        # Tailwind v4 + TypeScript, writes @/lib/utils with cn()
```

Install the runtime deps:

```bash
npm i motion @tabler/icons-react
```

`cn` should already exist at `@/lib/utils` from the shadcn init:

```ts
// @/lib/utils
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Tailwind v4 needs no `tailwind.config` for this; the utilities below are stock. The 3D transforms use arbitrary properties (`[transform-style:preserve-3d]`, `[perspective:...]`), which Tailwind v4 passes through.

## Component file

Create `components/ui/macbook-scroll.tsx`.

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import {
  IconCommand,
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconCaretDownFilled,
  IconWorld,
  IconSearch,
  IconMicrophone,
  IconBrightnessDown,
  IconBrightnessUp,
  IconPlayerTrackPrev,
  IconPlayerTrackNext,
  IconPlayerSkipForward,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface MacbookScrollProps {
  /** Headline shown above the laptop. Plain string or any node. */
  title?: string | React.ReactNode;
  /** Screen image src (the “site” on the lid). Use object-cover. */
  src?: string;
  /** Small neutral mark on the closed-lid badge area. Keep it discreet. */
  badge?: React.ReactNode;
  /** Show the row of glowing gradients under the laptop. */
  showGradient?: boolean;
}

export const MacbookScroll = ({
  title,
  src,
  badge,
  showGradient = true,
}: MacbookScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scale to a phone-sized rig on small screens so it fits without overflow.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Screen scales up as you scroll; lid rotates from closed/tilted to flat.
  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.2, isMobile ? 1 : 1.5]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.6, isMobile ? 1 : 1.5]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={ref}
      className="flex min-h-[200vh] shrink-0 scale-[0.35] transform flex-col items-center justify-start py-0 [perspective:800px] sm:scale-50 md:scale-100 md:py-40"
    >
      <motion.h2
        style={{ translateY: textTransform, opacity: textOpacity }}
        className="mb-20 text-center font-serif text-3xl font-bold text-neutral-800 md:text-5xl dark:text-white"
      >
        {title ?? (
          <span>
            Il tuo sito, costruito per vendere. <br />
            <span className="italic text-[#1f4d3a]">Sul serio.</span>
          </span>
        )}
      </motion.h2>

      {/* Lid */}
      <Lid src={src} scaleX={scaleX} scaleY={scaleY} rotate={rotate} translate={translate} />

      {/* Base: keyboard deck, trackpad, speakers, power button */}
      <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-gray-200 dark:bg-[#272729]">
        {/* above the keyboard */}
        <div className="relative h-10 w-full">
          <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
        </div>
        <div className="relative flex">
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
          <div className="mx-auto h-full w-[80%]">
            <Keypad />
          </div>
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
        </div>
        <Trackpad />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tr-3xl rounded-tl-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
        {showGradient && (
          <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
        )}
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src?: string;
}) => {
  return (
    <div className="relative [perspective:800px]">
      {/* closed-lid back face — neutral, no third-party logo */}
      <div
        style={{ transform: "perspective(800px) rotateX(-25deg) translateZ(0px)", transformOrigin: "bottom", transformStyle: "preserve-3d" }}
        className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div
          style={{ boxShadow: "0px 2px 0px 2px #171717 inset" }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
        >
          <span className="font-serif text-2xl italic text-white/25">ls</span>
        </div>
      </div>
      {/* screen face — opens flat on scroll */}
      <motion.div
        style={{ scaleX, scaleY, rotateX: rotate, translateY: translate, transformStyle: "preserve-3d", transformOrigin: "top" }}
        className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div className="absolute inset-0 rounded-lg bg-[#272729]" />
        <img
          src={src}
          alt="Anteprima del sito"
          className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top"
        />
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div
      className="mx-auto my-1 h-32 w-[40%] rounded-xl"
      style={{ boxShadow: "0px 0px 1px 1px #00000020 inset" }}
    />
  );
};

export const Keypad = () => {
  return (
    <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1">
      {/* Row 1 — function row */}
      <KBRow>
        <KBKey className="w-10 items-end justify-start pb-[2px] pl-[4px]">esc</KBKey>
        <KBKey><IconBrightnessDown className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F1</span></KBKey>
        <KBKey><IconBrightnessUp className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F2</span></KBKey>
        <KBKey><IconWorld className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F3</span></KBKey>
        <KBKey><IconSearch className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F4</span></KBKey>
        <KBKey><IconMicrophone className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F5</span></KBKey>
        <KBKey><IconPlayerTrackPrev className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F6</span></KBKey>
        <KBKey><IconPlayerSkipForward className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F7</span></KBKey>
        <KBKey><IconPlayerTrackNext className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F8</span></KBKey>
        <KBKey><IconVolume3 className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F9</span></KBKey>
        <KBKey><IconVolume2 className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F10</span></KBKey>
        <KBKey><IconVolume className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F11</span></KBKey>
        <KBKey><IconVolume className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F12</span></KBKey>
      </KBRow>
      {/* Row 2 — number row */}
      <KBRow>
        {["~","!","@","#","$","%","^","&","*","(",")","–","+"].map((k) => (
          <KBKey key={k}>{k}</KBKey>
        ))}
        <KBKey className="w-10 items-end justify-end pr-[4px] pb-[2px]">delete</KBKey>
      </KBRow>
      {/* Row 3 — QWERTY */}
      <KBRow>
        <KBKey className="w-10 items-end justify-start pb-[2px] pl-[4px]">tab</KBKey>
        {["Q","W","E","R","T","Y","U","I","O","P","{","}","|"].map((k) => (
          <KBKey key={k}>{k}</KBKey>
        ))}
      </KBRow>
      {/* Row 4 — home row */}
      <KBRow>
        <KBKey className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]">caps lock</KBKey>
        {["A","S","D","F","G","H","J","K","L",":",'"'].map((k) => (
          <KBKey key={k}>{k}</KBKey>
        ))}
        <KBKey className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]">return</KBKey>
      </KBRow>
      {/* Row 5 — shift row */}
      <KBRow>
        <KBKey className="w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]">shift</KBKey>
        {["Z","X","C","V","B","N","M","<",">","?"].map((k) => (
          <KBKey key={k}>{k}</KBKey>
        ))}
        <KBKey className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]">shift</KBKey>
      </KBRow>
      {/* Row 6 — bottom row with spacebar + arrows */}
      <KBRow>
        <KBKey className="flex-col items-start justify-end pl-1 pb-[2px]"><span className="block">fn</span></KBKey>
        <KBKey className="flex-col items-start justify-end pl-1 pb-[2px]"><IconCommand className="h-[6px] w-[6px]" /><span className="mt-1 block">control</span></KBKey>
        <KBKey className="flex-col items-start justify-end pl-1 pb-[2px]"><span className="block">⌥</span><span className="block">option</span></KBKey>
        <KBKey className="w-8 flex-col items-start justify-end pl-1 pb-[2px]"><IconCommand className="h-[6px] w-[6px]" /><span className="mt-1 block">command</span></KBKey>
        <KBKey className="w-[8.2rem]" />
        <KBKey className="w-8 flex-col items-start justify-end pl-1 pb-[2px]"><IconCommand className="h-[6px] w-[6px]" /><span className="mt-1 block">command</span></KBKey>
        <KBKey className="flex-col items-start justify-end pl-1 pb-[2px]"><span className="block">⌥</span><span className="block">option</span></KBKey>
        <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
          <KBKey className="h-3 w-6"><IconCaretUpFilled className="h-[6px] w-[6px]" /></KBKey>
          <div className="flex">
            <KBKey className="h-3 w-6"><IconCaretLeftFilled className="h-[6px] w-[6px]" /></KBKey>
            <KBKey className="h-3 w-6"><IconCaretDownFilled className="h-[6px] w-[6px]" /></KBKey>
            <KBKey className="h-3 w-6"><IconCaretRightFilled className="h-[6px] w-[6px]" /></KBKey>
          </div>
        </div>
      </KBRow>
    </div>
  );
};

const KBRow = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">{children}</div>
);

const KBKey = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div
    className={cn(
      "flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#0A090D] p-[0.5px] text-[5px] text-neutral-200",
      className,
    )}
    style={{ boxShadow: "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset" }}
  >
    <div className="flex w-full flex-col items-center justify-center">{children}</div>
  </div>
);

export const SpeakerGrid = () => (
  <div
    className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
    style={{
      backgroundImage: "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
      backgroundSize: "3px 3px",
    }}
  />
);
```

## Usage (personalized for our clients)

The screen image should look like a real site we could ship, so the visitor pictures their own business on it. Use a clean dashboard or landing screenshot, `object-cover`.

```tsx
import { MacbookScroll } from "@/components/ui/macbook-scroll";

export default function VendePerTe() {
  return (
    <section className="w-full overflow-hidden bg-[#faf8f3] dark:bg-[#0b0b0b]">
      <MacbookScroll
        title={
          <span>
            Il tuo sito, costruito per vendere. <br />
            <span className="italic text-[#1f4d3a]">Sul serio.</span>
          </span>
        }
        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&q=85&fm=webp"
        badge={<span className="font-serif text-sm italic text-neutral-500">ls</span>}
        showGradient
      />
    </section>
  );
}
```

Swap `src` for a real screenshot of the client’s own site once it exists (a pizzeria’s ordering page, a barber’s booking flow, a gelateria’s catalog). The whole point is recognition: they see their business, opened on a MacBook, the moment they land.

## How the motion works

- **`useScroll`** is bound to the section (`min-h-[200vh]`) with `offset: ["start start", "end start"]`, so progress runs 0 to 1 across the section’s travel past the top of the viewport.
- **Lid rotation**: `useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0])`. It holds the closed tilt at -28deg through the first tenth, then opens to flat (0deg) by 30%. The lid rotates around `transformOrigin: "top"`, hinged at the deck.
- **Screen scale**: `scaleX` 1.2 to 1.5 and `scaleY` 0.6 to 1.5 over the first 30%, so the panel grows from a squashed, tilted plate into a full screen as it opens.
- **Title**: `translateY` 0 to 100 and `opacity` 1 to 0 over the first 20%, so the headline lifts and fades before the laptop is fully open.
- **Mobile**: below 768px the rig scales to 1 (vs 1.5) so the laptop fits a phone without overflow; the outer wrapper also steps `scale-[0.35] sm:scale-50 md:scale-100`.

## Brand and accessibility notes

- Keep the closed-lid mark neutral. The `ls` monogram is a placeholder; never put a third-party logo on the lid.
- Headline uses a serif display face for the brand voice. If you have a serif configured (e.g. Fraunces via a CSS variable), swap `font-serif` for your token.
- Wrap the section in `overflow-hidden` so the lifted screen never causes a horizontal scrollbar.
- For reduced motion, gate the section: respect `prefers-reduced-motion` by rendering the lid already-open (skip the `useScroll` transforms) so the dashboard is visible without scrolling.
