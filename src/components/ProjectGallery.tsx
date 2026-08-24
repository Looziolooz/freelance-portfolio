"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { readableOn, dimOn } from "@/lib/contrast";
import Image from "next/image";
import { useLang } from "./LangProvider";
import { PROJECTS, CATEGORIES, type Project, type ProjectCategory } from "@/lib/projects";

// Projects as a card grid. Cover clips are hover-driven on desktop (play under
// the cursor, pause on leave, one run total — then they hold the last frame);
// touch devices play them once on viewport entry instead. Clicking opens the
// in-site demo viewer at /work/[slug]. Cards with only a screenshot show it
// static; repo-only cards fall back to their brand swatch. Reduced-motion
// keeps the poster still.
// Module scope so the rotation hook gets a stable reference. Nothing is cut
// here — the grid shows every featured project — so rotating only changes which
// work greets you at the top of the page instead of it always being the same
// three rows.
const POOL = PROJECTS.filter((p) => p.featured && !p.hidden);

// Il colore del testo sopra la tinta di un marchio non si sceglie con una
// soglia di luminosita': quella decideva "bianco" per #E8C4A0, che misura 1,63.
// Vince chi contrasta di piu', calcolato sul colore vero.
function inkFor(hex: string | undefined): string {
  if (!hex) return "#fff";
  return readableOn(hex);
}

// The discipline pages under /work reuse this grid with their own slice of the
// pool and no filter row: on a page that already IS a filter, a second set of
// tabs would just contradict the page it sits on.
export default function ProjectGallery({
  items: itemsProp,
  showFilters = true,
}: {
  items?: Project[];
  showFilters?: boolean;
} = {}) {
  const { t } = useLang();
  // NOT rotated, unlike the marquee and the showcase. useRotation answers with
  // the authored order on the server and a shuffle after hydration, which is the
  // only hydration-safe way to randomise — but React then reorders all 23 DOM
  // nodes at once, and every card changes position. Measured on a production
  // build: one layout shift of 0.318, i.e. the whole of /work's CLS, from a
  // reshuffle that buys nothing here. The hook exists for surfaces that show a
  // FEW of many (the marquee takes 8, the showcase 3) and where the rotation is
  // what stops the rest of the work from never being seen. This grid shows
  // every featured project, so there is nothing for a rotation to rescue.
  const items = itemsProp ?? POOL;
  const [cat, setCat] = useState<ProjectCategory | "all">("all");

  const visible = cat === "all" ? items : items.filter((p) => p.category === cat);

  // Una pastiglia che apre un solo lavoro non e' un filtro, e' un vicolo:
  // "SaaS / App" prometteva una categoria e conteneva una card. Sotto i due
  // lavori la voce sparisce dalla riga (il lavoro resta dentro "Tutti").
  const filters: (ProjectCategory | "all")[] = [
    "all",
    ...CATEGORIES.filter((c) => items.filter((p) => p.category === c).length >= 2),
  ];

  // The count rides on the chip. Without it a tab holding one project reads as
  // broken; with it, the number is information you had before you clicked.
  const countFor = (f: ProjectCategory | "all") =>
    f === "all" ? items.length : items.filter((p) => p.category === f).length;

  return (
    <section id="work" className="pg" aria-label={t("work.title")}>
      <div className="container">
        {showFilters && (
        <div className="pg-filters" role="group" aria-label={t("work.filter.label")}>
          {filters.map((f) => {
            const active = f === cat;
            const label = f === "all" ? t("work.filter.all") : t(`work.filter.${f}`);
            return (
              <button
                key={f}
                type="button"
                className={`pg-filter${active ? " is-active" : ""}`}
                aria-pressed={active}
                onClick={() => setCat(f)}
              >
                {label} <i>{countFor(f)}</i>
              </button>
            );
          })}
        </div>
        )}
        {visible.length > 0 ? (
          <ul className="pg-grid">
            {visible.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </ul>
        ) : (
          <p className="pg-empty">{t("work.filter.empty")}</p>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const { t } = useLang();
  const vref = useRef<HTMLVideoElement>(null);
  const title = t(`work.proj.${p.key}`);
  const tags = t(`work.proj.${p.key}.tags`);
  const blurb = t(`work.proj.${p.key}.blurb`);
  const catLabel = p.category ? t(`work.filter.${p.category}`) : "";
  const ink = inkFor(p.swatch);

  // The cover clip is cursor-driven on desktop: it plays while the pointer is
  // over the card and pauses on leave; once finished it freezes on the last
  // frame and never replays (v.ended guard — play() would restart it). Touch
  // devices have no cursor, so there the clip plays once when the card scrolls
  // into view. Reduced-motion → stay on the poster in both cases.
  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: hover)").matches) return; // desktop: hover handlers below
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!v.ended) v.play().catch(() => {});
          } else if (!v.ended) {
            v.pause();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const hoverPlay = () => {
    const v = vref.current;
    if (!v || v.ended) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  };
  const hoverPause = () => {
    const v = vref.current;
    if (v && !v.ended) v.pause();
  };

  const hasCover = Boolean(p.coverVideo || p.image);

  return (
    <li className="pg-item">
      {/* Brand stripe + swatch give every card its own colour identity instead
          of the uniform template look: the colour comes from the project, not
          the card chrome. */}
      {/* prefetch={false} — the App Router prefetches every Link in the viewport,
          which on a gallery of two dozen cards is two dozen RSC round trips the
          moment the page opens: measured 63 requests for 72 KB and a `load` at
          2385 ms against a domReady of 44 ms. False does not mean never; it means
          on hover, which is the moment the visitor shows an intention. */}
      <Link
        href={`/work/${p.slug}`}
        prefetch={false}
        className="pg-card"
        style={{ ["--sw" as string]: p.swatch ?? "#16151a", ["--sw-ink" as string]: ink,
                 ["--sw-hint" as string]: dimOn(ink, p.swatch ?? "#16151a") } as React.CSSProperties}
        aria-label={`${title} — ${t("work.viewDemo")}`}
        onMouseEnter={hoverPlay}
        onMouseLeave={hoverPause}
      >
        <span className="pg-stripe" aria-hidden="true" />
        <span className="pg-media">
          {hasCover ? (
            p.coverVideo ? (
              <video
                ref={vref}
                src={p.coverVideo}
                poster={p.image ? `/_next/image?url=${encodeURIComponent(p.image)}&w=828&q=75` : undefined}
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
                style={{ objectPosition: p.imagePosition ?? "center" }}
              />
            ) : (
              <Image
                src={p.image as string}
                alt={title}
                fill
                sizes="(max-width: 720px) 100vw, 50vw"
                loading="lazy"
                style={{ objectFit: "cover", objectPosition: p.imagePosition ?? "center top" }}
              />
            )
          ) : (
            // No cover asset yet: show the brand colour as a living placeholder
            // with the project name, so the card reads as intentional rather
            // than an empty frame.
            <span className="pg-brand">
              <span className="pg-brand__name">{title}</span>
              <span className="pg-brand__hint">{t("work.viewDemo")} ↗</span>
            </span>
          )}
          {/* Category chip, coloured by the project's brand swatch — the single
              clearest signal that these are different kinds of work. */}
          {catLabel && (
            <span className="pg-cat" style={{ background: p.swatch ?? "#16151a", color: ink }}>
              {catLabel}
            </span>
          )}
          {/* Demo button pinned bottom-right — also masks the obscured Gemini
              mark that the cover clips carry in that corner. */}
          <span className="pg-demo">
            {t("work.viewDemo")} <span className="pg-demo__arrow">↗</span>
          </span>
        </span>
        <span className="pg-info">
          <span className="pg-name">{title}</span>
          {tags !== `work.proj.${p.key}.tags` && <span className="pg-tags">{tags}</span>}
        </span>
        {/* One buyer-language line per card (SEO/SXO audit: the cards only spoke
            in tech stacks, and crawlers learned nothing about the projects). */}
        {blurb !== `work.proj.${p.key}.blurb` && <span className="pg-blurb">{blurb}</span>}
      </Link>
    </li>
  );
}
