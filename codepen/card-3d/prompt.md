Build a **3D tilt card** in React + TypeScript styled with **shadcn/ui** + **Tailwind CSS v4**. The card tracks the cursor and rotates on its X/Y axes with CSS perspective; inner items lift toward the viewer via `translateZ` on hover and settle back flat on mouse leave. Reproduce both files below faithfully. The demo is personalized for **lorenzo.studio** (Italian copy, parchment surface, ochre-gold and forest-green accents).

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
5. Fonts: the demo uses **Fraunces** (display) and **General Sans** (body). Load them however your stack prefers (e.g. `next/font`, a `<link>`, or a `@font-face`/Fontshare import). They aren't required for the mechanic — swap in your own brand fonts freely.

Two files: `components/ui/3d-card.tsx` (the reusable primitive, verbatim) and `components/3d-card-demo.tsx` (our personalized usage).

---

## `components/ui/3d-card.tsx`

Copy this verbatim. `CardContainer` owns the perspective and writes the `rotateY/rotateX` on mousemove; `CardItem` reads a `MouseEnter` context and lifts itself with `translateZ` (and any other translate/rotate props) while the pointer is inside, resetting to 0 on leave.

```tsx
"use client";

import { cn } from "@/lib/utils";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn(
          "py-20 flex items-center justify-center",
          containerClassName
        )}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            className
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    handleAnimations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <Tag
      ref={ref}
      className={cn("w-fit transition duration-200 ease-linear", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Create a hook to use the MouseEnterContext
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
```

---

## `components/3d-card-demo.tsx`

Our personalized demo: a warm **parchment** card with **ink** text, an ochre-gold CTA (dark text on gold, per brand) and a forest-green link. Title lifts at `translateZ={50}`, the paragraph at `60`, the image at `100`, and the bottom row at `20`.

```tsx
"use client";

import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export default function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="group/card relative h-auto w-[30rem] max-w-full rounded-[18px] border border-black/10 bg-[#f3efe6] p-7 shadow-[0_24px_60px_-28px_rgba(44,42,37,0.45)]">
        <CardItem
          translateZ={50}
          className="font-serif text-2xl font-semibold text-[#2c2a25]"
        >
          Fai volare il tuo brand
        </CardItem>

        <CardItem
          as="p"
          translateZ={60}
          className="mt-2 max-w-sm text-sm leading-relaxed text-[#6b6457]"
        >
          Passa il mouse sulla card: la stessa cura che mettiamo in ogni progetto.
        </CardItem>

        <CardItem translateZ={100} className="mt-5 w-full">
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1280&q=85&fm=webp"
            height={1000}
            width={1000}
            className="h-60 w-full rounded-[14px] object-cover shadow-[0_16px_40px_-24px_rgba(44,42,37,0.65)]"
            alt="Interno di uno studio luminoso e curato"
          />
        </CardItem>

        <div className="mt-6 flex items-center justify-between">
          <CardItem
            as="a"
            href="#"
            translateZ={20}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2f5d4a]"
          >
            Scopri come →
          </CardItem>

          <CardItem
            as="button"
            translateZ={20}
            className="rounded-full bg-[#c79a3a] px-5 py-2.5 text-sm font-semibold text-[#2c2a25] transition-colors hover:bg-[#b3852b]"
          >
            Parliamone
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
```

> Using a plain `<img>` instead of `next/image`? Drop the `import Image` line and replace the `<Image .../>` with `<img src="…" className="h-60 w-full rounded-[14px] object-cover …" alt="…" />`. The `next.config` `images.remotePatterns` must allow `images.unsplash.com` if you keep `next/image`.

### How the effect works

- **Perspective + tilt.** `CardContainer` sets `perspective: 1000px` on the outer wrapper and `transform-style: preserve-3d` on the tilting child. On `mousemove` it computes `x = (clientX - left - width/2) / 25` and `y = (clientY - top - height/2) / 25` and writes `rotateY(x) rotateX(y)`. On leave it resets to `0deg`.
- **Depth on the items.** Each `CardItem` lives on the `preserve-3d` surface. When the pointer enters, it applies its `translateZ` (50 / 60 / 100 / 20 here) so the elements lift toward the viewer at different depths; on leave every transform returns to `0`. The `transition duration-200 ease-linear` makes the lift smooth.
- **Tuning.** Larger `translateZ` = more dramatic pop. The `/ 25` divisor controls tilt sensitivity (smaller = stronger tilt). Keep the title/image/CTA on clearly different Z values so the parallax reads.

### Brand notes (lorenzo.studio)

- Card surface is warm parchment `#f3efe6` with a hairline border and a soft shadow; corners `rounded-[18px]`, width `~30rem`.
- The CTA fill is ochre-gold `#c79a3a` with **dark ink text** `#2c2a25` — never white text on gold.
- The "Scopri come" link is forest-green `#2f5d4a`. Copy stays human and Italian-first; mirror EN/SV as needed.
