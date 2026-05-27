"use client";

import { useEffect } from "react";

export default function ScrollProgress() {
  useEffect(() => {
    const el = document.querySelector(".scroll-progress") as HTMLElement;
    if (!el) return;

    const update = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${height > 0 ? scroll / height : 0})`;
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
