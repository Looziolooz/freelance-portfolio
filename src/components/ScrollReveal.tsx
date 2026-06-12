"use client";

import { useEffect, useRef } from "react";

export default function ScrollReveal({ children, className = "reveal" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          // Once the entrance animation ends, drop it entirely: a fill-mode
          // transform (even identity) makes this wrapper the containing block
          // for position:fixed, which breaks ScrollTrigger pinning inside.
          el.addEventListener(
            "animationend",
            () => el.classList.add("reveal-done"),
            { once: true }
          );
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
