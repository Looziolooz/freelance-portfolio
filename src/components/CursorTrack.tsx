"use client";

import { useEffect, useRef } from "react";

export default function CursorTrack({ children, strength = 8 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ease = Math.max(0, 1 - dist * 1.2);
      el.style.setProperty("--tx", `${dx * strength * ease}px`);
      el.style.setProperty("--ty", `${dy * strength * ease}px`);
    };

    const reset = () => {
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    };

    const parent = el.closest("section") || el.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", update);
      parent.addEventListener("mouseleave", reset);
    }

    return () => {
      if (parent) {
        parent.removeEventListener("mousemove", update);
        parent.removeEventListener("mouseleave", reset);
      }
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      style={{
        transform: "translate(var(--tx, 0px), var(--ty, 0px))",
        transition: "transform .12s ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
