"use client";

import { useEffect, useRef } from "react";

export default function ParallaxIndex({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (rect.top + rect.height / 2) / vh;
      const offset = (progress - 0.5) * 60;
      el.style.transform = `translateY(-50%) translateY(${offset}px)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <span ref={ref} className="section-index" aria-hidden="true">
      {children}
    </span>
  );
}
