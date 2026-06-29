"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Last-gen smooth scroll. Lenis owns the scroll, GSAP's ticker owns the clock,
// and ScrollTrigger updates off Lenis — one scroll authority, so the sticky
// HeroMotion canvas scrubs cleanly. We removed html{scroll-behavior:smooth}
// (it would fight Lenis) and re-route in-page anchor clicks through lenis.scrollTo.
export default function SmoothScroll() {
  useEffect(() => {
    const mq = (q: string) => window.matchMedia(q).matches;
    // Smooth scroll is a desktop pointer/wheel enhancement. Skip it on
    // reduced-motion, touch, and small screens: there Lenis' continuous rAF
    // ticker only saturates a weaker main thread (tanking mobile LCP/TBT and
    // keeping the page from ever going idle), while native momentum scroll is
    // already smooth. Desktop keeps the premium feel.
    if (
      mq("(prefers-reduced-motion: reduce)") ||
      mq("(pointer: coarse)") ||
      mq("(max-width: 1024px)")
    )
      return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Expose for components that need to drive scroll programmatically
    // (e.g. the projects "blinds" viewer's pill nav).
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    // Lenis mounts after the HeroMotion trigger is created (child effects run
    // first), so re-measure all triggers against the Lenis-driven scroll.
    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      delete (window as unknown as { lenis?: Lenis }).lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
