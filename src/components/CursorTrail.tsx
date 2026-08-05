"use client";

import { useEffect, useRef } from "react";
import { PROJECTS } from "@/lib/projects";

// Wrapper that drops project covers along the cursor as it crosses the section:
// the work literally follows you to the point of decision. Real thumbnails only,
// so the flourish doubles as proof.
//
// Direct DOM (not React state) on purpose — a mousemove that re-renders the tree
// would stutter. Nodes remove themselves on animationend, so nothing accumulates.
// Desktop pointers only, and disabled entirely under reduced-motion.
const COVERS = PROJECTS.filter((p) => p.featured && !p.hidden && p.image)
  .map((p) => p.image as string)
  .slice(0, 10);

const CSS = `
.ctrail { position: relative; }
/* Above the content, not behind it: the section is mostly one big card, and
   ghosts trapped underneath would never be seen. pointer-events:none keeps the
   form fully clickable, and each ghost is gone in 900ms. */
.ctrail__layer { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 3; }
.ctrail__ghost {
  position: absolute; width: 116px; aspect-ratio: 16 / 10; object-fit: cover;
  border: 3px solid var(--ink-border); border-radius: var(--radius);
  box-shadow: 4px 4px 0 var(--ink-shadow);
  transform-origin: center; will-change: transform, opacity;
  animation: ctrail-pop 900ms cubic-bezier(.2,.7,.3,1) forwards;
}
@keyframes ctrail-pop {
  0%   { opacity: 0; transform: translate(-50%, -50%) rotate(var(--r)) scale(.72); }
  14%  { opacity: 1; transform: translate(-50%, -50%) rotate(var(--r)) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -46%) rotate(var(--r)) scale(.88); }
}
/* Keep the section's own content above the ghosts. */
.ctrail > *:not(.ctrail__layer) { position: relative; z-index: 1; }
`;

export default function CursorTrail({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const layer = layerRef.current;
    if (!host || !layer || !COVERS.length) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = 0;
    let lastX = 0;
    let lastY = 0;
    let i = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // Two gates: time since last drop, and distance travelled — a resting
      // cursor should not pile ghosts on one spot.
      if (now - last < 90) return;
      if (Math.hypot(x - lastX, y - lastY) < 55) return;
      last = now;
      lastX = x;
      lastY = y;

      const img = document.createElement("img");
      img.src = COVERS[i++ % COVERS.length];
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.className = "ctrail__ghost";
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      // Deterministic tilt from the counter (no Math.random → no hydration risk).
      img.style.setProperty("--r", `${((i * 37) % 17) - 8}deg`);
      img.addEventListener("animationend", () => img.remove(), { once: true });
      layer.appendChild(img);
    };

    host.addEventListener("mousemove", onMove);
    return () => {
      host.removeEventListener("mousemove", onMove);
      layer.replaceChildren();
    };
  }, []);

  return (
    <div ref={hostRef} className="ctrail">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={layerRef} className="ctrail__layer" aria-hidden="true" />
      {children}
    </div>
  );
}
