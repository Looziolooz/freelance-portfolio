"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Counts up to a number when it scrolls into view (once). Keeps an optional
 * prefix/suffix so "40+", "6a", "10" all animate but render with their unit.
 * Static (final value) under prefers-reduced-motion.
 */
export default function CountUp({
  value,
  suffix = "",
  duration = 1400,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduce) {
      setN(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          // easeOutExpo for a confident, decelerating count
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setN(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration, reduce]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
