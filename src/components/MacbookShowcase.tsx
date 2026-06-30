"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { useLang } from "./LangProvider";
import MacScreen from "./MacScreen";

// Scroll-driven MacBook that opens to reveal a bespoke screen telling one idea:
// the value travels from my computer to your business. Adapted from the Aceternity
// component to the brand (parchment stage, Fraunces title, Lorenzo.studio mark on
// the lid, framer-motion). Full-bleed, under the hero.
//
// Desktop (≥1100): the Aceternity laptop. Below: a compact laptop (lid + deck)
// whose lid OPENS on scroll (rotateX) — same "opens as you reach it" behaviour,
// retuned for the narrow viewport (no 200vh gap).
export default function MacbookShowcase() {
  const { t } = useLang();
  const lidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lid = lidRef.current;
    if (!lid) return;
    // Desktop uses the Aceternity laptop; reduced-motion gets a static open lid.
    if (window.matchMedia("(min-width: 1100px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(
      lid,
      { rotateX: -78 },
      {
        rotateX: 0,
        ease: "none",
        scrollTrigger: { trigger: lid, start: "top 88%", end: "top 40%", scrub: 0.6 },
      },
    );
    ScrollTrigger.refresh();
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="showcase" className="mbk-sec" aria-label={t("macbook.title")}>
      {/* Desktop: scroll-driven laptop that opens to the live circuit. */}
      <div className="mbk-desktop">
        <MacbookScroll title={t("macbook.title")} showGradient={false} screen={<MacScreen uid="mcd" />} />
      </div>
      {/* Tablet/phone: a compact laptop whose lid opens on scroll (rotateX). */}
      <div className="mbk-mobile">
        <h2 className="mbk-mobile__title">{t("macbook.title")}</h2>
        <div className="mbk-mobile__device">
          <div className="mbk-mobile__lid" ref={lidRef}>
            <div className="mbk-mobile__screen">
              <MacScreen uid="mcm" />
            </div>
          </div>
          <div className="mbk-mobile__deck" aria-hidden="true">
            <span className="mbk-mobile__notch" />
          </div>
        </div>
      </div>
    </section>
  );
}
