"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Premium entrance reveal (Framer Motion). Fades + rises into view once.
 *
 * SAFETY: only use on sections that are NOT GSAP-pinned and are NOT ancestors
 * of a pinned/`position:fixed` child (the Hero burst-canvas and the Work sticky
 * gallery rely on that). Services / EntryGrid / Plans / Stack are safe siblings.
 * Honors prefers-reduced-motion by rendering a plain wrapper.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  style,
  amount = 0.18,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  amount?: number;
  as?: "div" | "section";
}) {
  const reduce = useReducedMotion();
  const Tag = (as === "section" ? motion.section : motion.div) as typeof motion.div;

  if (reduce) {
    const Plain = as === "section" ? "section" : "div";
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** Parent that staggers its `RevealItem` children as the group enters view. */
export function RevealStagger({
  children,
  className,
  stagger = 0.08,
  style,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** A single staggered child. Pass-through wrapper that joins the stagger. */
export function RevealItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={className} style={style} variants={revealItemVariants}>
      {children}
    </motion.div>
  );
}
