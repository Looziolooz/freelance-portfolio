"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LangProvider";
import { PROJECTS } from "@/lib/projects";

// Projects as a SCROLL-DRIVEN paged viewer with "curtains" transitions (inspired
// by motion+). The section is tall and its inner stage is sticky: scrolling
// advances one project per segment; each switch plays a DIFFERENT curtain effect
// (blinds, shutter, doors, wipe, iris, pixels, stagger — cycled = "mixed") in the
// next project's colour, so a visitor scrolls through EVERY project. Pills mirror
// progress + scroll to a project. Reduced motion → normal-height, instant switch.
const COLORS = ["#E8A12C", "#4FB0A0", "#9DB57F", "#F2B84E", "#E5623F"];
const EFFECTS = ["blinds", "shutter", "doors", "wipe", "iris", "pixels", "stagger"] as const;
const CURTAIN_MS = 900; // duration of each phase (cover / reveal)

function curtainCells(fx: string): number[] {
  // per-cell transition delays (ms) for the chosen effect
  switch (fx) {
    case "shutter": return Array.from({ length: 10 }, (_, i) => i * 40);
    case "stagger": return Array.from({ length: 24 }, (_, i) => ((i % 6) + Math.floor(i / 6)) * 46);
    case "pixels": return Array.from({ length: 48 }, (_, i) => Math.round((((i * 37) % 48) / 48) * 340));
    case "doors": return [0, 0];
    case "wipe": return [0];
    case "iris": return [0];
    default: return Array.from({ length: 9 }, (_, i) => i * 46); // blinds
  }
}

export default function Projects() {
  const { t } = useLang();
  const items = PROJECTS.filter((p) => p.featured && !p.hidden);
  const n = items.length;

  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");
  const [curtain, setCurtain] = useState(COLORS[0]);
  const [curtainFx, setCurtainFx] = useState<string>("blinds");
  const [scrollDrive, setScrollDrive] = useState(false);
  const [segVh, setSegVh] = useState(60);

  const busy = useRef(false);
  const pending = useRef<number | null>(null);
  const currentRef = useRef(0);
  const timers = useRef<number[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);

  const colorOf = (i: number) => COLORS[i % COLORS.length];
  const num = (i: number) => String(i + 1).padStart(2, "0");

  const goTo = useCallback(
    (i: number) => {
      if (i < 0 || i >= n) return;
      if (busy.current) { pending.current = i; return; }
      if (i === currentRef.current) return;
      busy.current = true;
      currentRef.current = i;
      setCurrent(i);
      setCurtain(colorOf(i));
      setCurtainFx(EFFECTS[i % EFFECTS.length]);
      setPhase("cover");
      timers.current.push(
        window.setTimeout(() => {
          setShown(i);
          setPhase("reveal");
          timers.current.push(
            window.setTimeout(() => {
              setPhase("idle");
              busy.current = false;
              if (pending.current !== null && pending.current !== currentRef.current) {
                const nx = pending.current;
                pending.current = null;
                goTo(nx);
              } else {
                pending.current = null;
              }
            }, CURTAIN_MS + 60),
          );
        }, CURTAIN_MS),
      );
    },
    [n],
  );

  // Decide mode once (client): reduced motion → no scroll-jacking.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setSegVh(window.matchMedia("(max-width: 768px)").matches ? 48 : 60);
    setScrollDrive(true);
  }, []);

  // Pin via sticky + map scroll progress → project index (after the tall height
  // is in the DOM, so start/end measure correctly).
  useEffect(() => {
    if (!scrollDrive) return;
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const idx = Math.max(0, Math.min(n - 1, Math.round(self.progress * (n - 1))));
        if (idx !== currentRef.current) goTo(idx);
      },
    });
    stRef.current = st;
    ScrollTrigger.refresh();
    return () => { st.kill(); stRef.current = null; };
  }, [scrollDrive, segVh, n, goTo]);

  useEffect(() => {
    const tm = timers.current;
    return () => tm.forEach(clearTimeout);
  }, []);

  const onPill = (i: number) => {
    if (!scrollDrive) { goTo(i); return; }
    const st = stRef.current;
    if (!st) { goTo(i); return; }
    const target = st.start + (n > 1 ? i / (n - 1) : 0) * (st.end - st.start);
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis;
    if (lenis?.scrollTo) lenis.scrollTo(target, { duration: 0.8 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  const p = items[shown];
  const acc = colorOf(shown);
  const valueKey = `work.proj.${p.key}.value`;
  const value = t(valueKey);
  const hasValue = value !== valueKey;

  return (
    <section
      ref={sectionRef}
      id="work"
      className={`pb${scrollDrive ? " pb--scroll" : ""}`}
      style={scrollDrive ? { height: `calc(100svh + ${(n - 1) * segVh}vh)` } : undefined}
      aria-label={t("work.title")}
    >
      <div className="pb-sticky">
        <div className="pb-stage">
          <article className="pb-page" key={shown}>
            <div className="pb-page__text">
              <span className="pb-eyebrow" style={{ color: acc }}>
                &gt; {t("work.pagelabel")} {num(shown)}
              </span>
              <h2 className="pb-title" style={{ color: acc }}>
                {t(`work.proj.${p.key}`)}
              </h2>
              <div className="pb-meta">{t(`work.proj.${p.key}.tags`)}</div>
              <p className="pb-blurb">{t(`work.proj.${p.key}.blurb`)}</p>
              {hasValue && (
                <p className="pb-value">
                  <span style={{ color: acc }}>{t("work.value.label")}</span> {value}
                </p>
              )}
              <div className="pb-cta">
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noreferrer" className="pb-btn" style={{ background: acc, borderColor: acc, color: "#0a0a0a" }}>
                    {t("work.live")} ↗
                  </a>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer" className="pb-btn pb-btn--ghost">
                    {t("work.code")} ↗
                  </a>
                )}
                <Link href={`/work/${p.slug}`} className="pb-btn pb-btn--ghost">
                  {t("work.details")} →
                </Link>
              </div>
              <span className="pb-counter">
                {num(shown)} / {String(n).padStart(2, "0")}
              </span>
            </div>

            <div className="pb-page__media" style={{ background: p.swatch ?? "#16151a" }}>
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={t(`work.proj.${p.key}`)} style={{ objectPosition: p.imagePosition ?? "center top" }} />
              ) : (
                <span className="pb-tex" aria-hidden="true" />
              )}
            </div>
          </article>

          {/* Curtain transition — effect cycles per project */}
          <div className={`pb-curtain pb-curtain--${curtainFx} ${phase !== "idle" ? phase : ""}`} aria-hidden="true" style={{ ["--c" as string]: curtain } as React.CSSProperties}>
            {curtainCells(curtainFx).map((d, i) => (
              <span key={i} className="pb-cell" style={{ transitionDelay: `${d}ms` }} />
            ))}
          </div>
        </div>

        <div className="pb-nav" aria-label={t("work.title")}>
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              className={`pb-pill ${i === current ? "is-active" : ""}`}
              style={i === current ? { color: colorOf(i), borderColor: colorOf(i) } : undefined}
              aria-current={i === current}
              onClick={() => onPill(i)}
            >
              {t(`work.proj.${it.key}`)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
