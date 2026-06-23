"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Magnetic anchor — the element drifts toward the cursor inside its hit-area,
 * springs back on leave. A leaf interaction (no pinned/fixed descendants), so
 * it is safe alongside the GSAP scroll machinery. Renders a plain <a> under
 * prefers-reduced-motion.
 */
export default function MagneticButton({
  href,
  children,
  className,
  style,
  strength = 0.4,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.5 });

  if (reduce) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    );
  }

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ ...style, x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.a>
  );
}
