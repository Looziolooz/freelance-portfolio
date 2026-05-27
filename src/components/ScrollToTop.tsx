"use client";

import { useEffect, useRef } from "react";

export default function ScrollToTop() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = ref.current;
    if (!btn) return;

    const update = () => {
      btn.classList.toggle("is-visible", window.scrollY > 400);
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className="scroll-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      <span className="scroll-to-top-glyph">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6,11 L6,1 M1.5,5.5 L6,1 L10.5,5.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
        </svg>
      </span>
    </button>
  );
}
