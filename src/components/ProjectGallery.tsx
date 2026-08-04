"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "./LangProvider";
import { PROJECTS, type Project } from "@/lib/projects";

// Projects as a card grid. Cover clips are hover-driven on desktop (play under
// the cursor, pause on leave, one run total — then they hold the last frame);
// touch devices play them once on viewport entry instead. Clicking opens the
// in-site demo viewer at /work/[slug]. Cards with only a screenshot show it
// static; repo-only cards fall back to their brand swatch. Reduced-motion
// keeps the poster still.
export default function ProjectGallery() {
  const { t } = useLang();
  const items = PROJECTS.filter((p) => p.featured && !p.hidden);

  return (
    <section id="work" className="pg" aria-label={t("work.title")}>
      <div className="container">
        <ul className="pg-grid">
          {items.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </ul>
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

  return (
    <li className="pg-item">
      <Link
        href={`/work/${p.slug}`}
        className="pg-card"
        style={{ ["--sw" as string]: p.swatch ?? "#16151a" } as React.CSSProperties}
        aria-label={`${title} — ${t("work.viewDemo")}`}
        onMouseEnter={hoverPlay}
        onMouseLeave={hoverPause}
      >
        <span className="pg-media">
          {p.coverVideo ? (
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
          ) : p.image ? (
            <Image
              src={p.image}
              alt={title}
              fill
              sizes="(max-width: 720px) 100vw, 50vw"
              loading="lazy"
              style={{ objectFit: "cover", objectPosition: p.imagePosition ?? "center top" }}
            />
          ) : (
            <span className="pg-tex" aria-hidden="true" />
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
