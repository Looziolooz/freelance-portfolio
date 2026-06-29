"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { PROJECTS, type Project } from "@/lib/projects";

// Projects as a card grid. Cover clips auto-loop while the card is on screen
// (IntersectionObserver — off-screen clips pause to save resources); clicking
// opens the in-site demo viewer at /work/[slug]. Cards with only a screenshot
// show it static; repo-only cards fall back to their brand swatch. Reduced-motion
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

  // Auto-loop the cover only while the card is on screen (and pause otherwise),
  // so we don't run every clip at once. Reduced-motion → stay on the poster.
  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <li className="pg-item">
      <Link
        href={`/work/${p.slug}`}
        className="pg-card"
        style={{ ["--sw" as string]: p.swatch ?? "#16151a" } as React.CSSProperties}
        aria-label={`${title} — ${t("work.viewDemo")}`}
      >
        <span className="pg-media">
          {p.coverVideo ? (
            <video
              ref={vref}
              src={p.coverVideo}
              poster={p.image}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              style={{ objectPosition: p.imagePosition ?? "center" }}
            />
          ) : p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={title} loading="lazy" style={{ objectPosition: p.imagePosition ?? "center top" }} />
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
      </Link>
    </li>
  );
}
