Build a macOS-style **floating dock** in React + TypeScript styled with **shadcn/ui** + **Tailwind CSS v4**. The dock is a horizontal bar of icon buttons; each icon (and its container) **magnifies based on the cursor's horizontal distance** — growing from ~40px to ~80px as the pointer nears, then easing back — with a tooltip that pops above the focused icon. A separate **collapsed mobile variant** shows a single trigger that fans the items out. This is a faithful reproduction of the Aceternity "FloatingDock". The demo is personalized for **lorenzo.studio** (Italian labels, parchment surface, ink icons, ochre-gold hover accent).

## Setup checklist

1. A React app with **TypeScript** (Next.js App Router or Vite).
2. **Tailwind CSS v4** installed and wired up.
3. **shadcn/ui** initialized:
   ```bash
   npx shadcn@latest init
   ```
   This creates `@/lib/utils` exporting `cn` and sets the default component path to `@/components/ui`.
4. Install the runtime deps:
   ```bash
   npm i motion @tabler/icons-react
   ```
   - **motion** — `motion/react` is the current package name for Framer Motion (`useMotionValue`, `useTransform`, `useSpring`, `AnimatePresence`, `motion.div`).
   - **@tabler/icons-react** — the icon set used in the demo.
5. If you don't have it yet, the `cn` helper (`@/lib/utils`):
   ```ts
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
6. Fonts: the demo uses **Fraunces** (display) and **General Sans** (body). Load them however your stack prefers (`next/font`, a `<link>`, or `@font-face`/Fontshare). They aren't required for the mechanic — swap in your own brand fonts freely.

Two files: `components/ui/floating-dock.tsx` (the reusable primitive, verbatim) and `components/floating-dock-demo.tsx` (our personalized usage).

---

## `components/ui/floating-dock.tsx`

Copy this verbatim. `FloatingDock` renders both layouts and picks one by breakpoint. `FloatingDockDesktop` tracks a single `mouseX` motion value; each `IconContainer` measures its own center, derives `distance = mouseX - center`, and maps that distance through `useTransform` bump curves into width/height/icon-size, then smooths each with `useSpring`. `FloatingDockMobile` is a collapsed trigger that toggles an `AnimatePresence` stack.

```tsx
"use client";

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

export type DockItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: { delay: idx * 0.05 },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  key={item.title}
                  aria-label={item.title}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#26221d]/10 bg-[#f4efe4] shadow-[0_6px_16px_-10px_rgba(38,34,29,0.55)]"
                >
                  <div className="h-5 w-5 text-[#26221d]">{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Apri il menu"
        aria-expanded={open}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border border-[#26221d]/12 shadow-[0_10px_26px_-14px_rgba(38,34,29,0.6)] transition-colors",
          open ? "bg-[#c8972e]" : "bg-[#f4efe4]"
        )}
      >
        <IconLayoutNavbarCollapse className="h-6 w-6 text-[#26221d]" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  // One motion value tracks the cursor x; -Infinity means "pointer away",
  // which collapses every icon to its resting size.
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl border border-[#26221d]/10 bg-white/40 px-4 pb-3 shadow-[0_18px_44px_-22px_rgba(38,34,29,0.5)] backdrop-blur-sm md:flex",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // distance from the cursor to this icon's horizontal center
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Map distance -> size. Inside ±150px the icon grows; the bump peaks at 0.
  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  // Spring smoothing so the magnify glides instead of snapping.
  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const width = useSpring(widthTransform, spring);
  const height = useSpring(heightTransform, spring);
  const widthIcon = useSpring(widthTransformIcon, spring);
  const heightIcon = useSpring(heightTransformIcon, spring);

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} aria-label={title}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-2xl border border-[#26221d]/10 bg-[#f4efe4] text-[#26221d] shadow-[0_6px_16px_-10px_rgba(38,34,29,0.55)] transition-colors hover:bg-[#c8972e]"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-9 left-1/2 w-fit whitespace-nowrap rounded-full bg-[#26221d] px-2.5 py-1 text-xs font-medium text-[#f4efe4]"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
```

---

## `components/floating-dock-demo.tsx`

Our personalized dock: five Italian destinations with Tabler icons in **ink**, a warm **parchment** surface, and an **ochre-gold** hover accent (dark ink icon on gold, per brand — never white on gold). Center it wherever you mount it.

```tsx
"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconHome,
  IconBriefcase2,
  IconSettings2,
  IconLayoutGrid,
  IconMail,
} from "@tabler/icons-react";

export default function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full" />,
      href: "/",
    },
    {
      title: "Lavori",
      icon: <IconBriefcase2 className="h-full w-full" />,
      href: "/lavori",
    },
    {
      title: "Servizi",
      icon: <IconSettings2 className="h-full w-full" />,
      href: "/servizi",
    },
    {
      title: "Componenti",
      icon: <IconLayoutGrid className="h-full w-full" />,
      href: "/componenti",
    },
    {
      title: "Contatti",
      icon: <IconMail className="h-full w-full" />,
      href: "/contatti",
    },
  ];

  return (
    <div className="flex min-h-72 w-full items-end justify-center rounded-2xl bg-[radial-gradient(120%_90%_at_50%_0%,#f4efe4_0%,#efe9dc_70%)] pb-12">
      <FloatingDock items={links} />
    </div>
  );
}
```

### How the magnify works

- **One cursor value, many readers.** `FloatingDockDesktop` keeps a single `mouseX = useMotionValue(Infinity)`. `onMouseMove` writes `e.pageX`; `onMouseLeave` resets to `Infinity` so every icon falls back to its resting 40px.
- **Distance per icon.** Each `IconContainer` reads its own `getBoundingClientRect()` and computes `distance = mouseX - (rect.x + rect.width / 2)` via `useTransform`. That's the signed horizontal gap between the cursor and the icon's center.
- **Distance → size bump.** `useTransform(distance, [-150, 0, 150], [40, 80, 40])` is the magnify curve: at the icon (`distance ≈ 0`) the box is 80px; ±150px away it's back to 40px; in between it interpolates. The inner icon scales on the same curve `[20, 40, 20]` so the glyph grows with its container.
- **Spring smoothing.** Each transform is wrapped in `useSpring(value, { mass: 0.1, stiffness: 150, damping: 12 })` so widths *glide* toward their target instead of snapping — this is the macOS "rubber" feel. Lower `stiffness` or higher `mass` = lazier; higher `damping` = less overshoot.
- **Tooltip.** A per-icon `hovered` state drives an `AnimatePresence` label that rises in above the focused icon and exits cleanly.
- **Mobile collapse.** Below `md`, the desktop bar is `hidden` and `FloatingDockMobile` shows a single round trigger. Tapping it toggles an `AnimatePresence` column that fans the items upward with a staggered delay (`(length - 1 - idx) * 0.05`), reversing on close.

### Tuning

- **Magnify reach / strength.** The `±150` in the `useTransform` input domain is how far the bump extends; the `80` (and icon `40`) is the peak size. Widen the domain for a gentler ripple, raise the peak for a punchier pop.
- **Spring feel.** `{ mass, stiffness, damping }` is the whole personality. Defaults give a quick, lightly-bouncy macOS dock; bump `mass` to `0.2` for a heavier slide.

### Brand notes (lorenzo.studio)

- Dock surface is translucent over warm parchment (`#efe9dc` / `#f4efe4`) with a hairline `#26221d/10` border and a soft drop shadow; corners `rounded-2xl`.
- Icons are **ink** `#26221d`; the hover/active accent fill is ochre-gold `#c8972e` with the **ink icon kept on top** — never white on gold.
- Labels are Italian (Home, Lavori, Servizi, Componenti, Contatti). Copy stays human and Italian-first; mirror EN/SV as needed (Home, Work, Services, Components, Contact / Hem, Arbeten, Tjänster, Komponenter, Kontakt).
- For cool accents elsewhere, forest `#1f4d3a` (links) and teal `#2f6f68` (secondary) pair with this palette.
```
