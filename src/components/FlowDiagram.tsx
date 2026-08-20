"use client";

import { useEffect, useRef } from "react";
import { useLang } from "./LangProvider";
import type { Project } from "@/lib/projects";

// Three stages, one grammar, every project: what it is, what got built, what it
// changed. The automations already read this way and it was the thing people
// understood fastest, so the websites now use the same shape.
//
// This is a live component and not another rendered mp4, for three reasons that
// all came out of measuring the ones we had:
//
//   1. Translation. Text baked into a video needs one render per language —
//      four flows became twelve files, and the fifteen demos would have made it
//      fifty-seven. Here the strings come from i18n, so a new language costs
//      nothing and never drifts from the rest of the page.
//   2. Legibility. In the marquee the 1280px diagrams are drawn at 0.42x, which
//      puts 12.5px body text on screen at roughly five pixels. Live text scales
//      with its container instead of being resampled to mush.
//   3. Truth. It is built from the copy that already describes each project, so
//      it cannot say something the rest of the page contradicts.
//
// The text is present at rest and the animation only traces the direction of
// travel. Nothing is hidden until it plays, so it survives reduced-motion, a
// crawler, and a visitor who never scrolls it into view.
const CSS = `
.fdg { container-type: inline-size; margin: 0 0 30px; }
.fdg__grid { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: stretch; gap: 12px; }
.fdg__stage {
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-panel-grey); box-shadow: 4px 4px 0 var(--ink-shadow);
  padding: 16px 18px; display: flex; flex-direction: column; gap: 7px; min-width: 0;
}
.fdg__stage--rule { background: var(--ground-deep); }
.fdg__stage--out { background: var(--canvas-panel-yellow); }
.fdg__cap { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-green-deep); font-weight: 700; }
.fdg__stage--rule .fdg__cap { color: var(--accent-green); }
.fdg__title { font-family: var(--font-display); font-weight: 600; font-size: clamp(15px, 2.4cqw, 21px); line-height: 1.14; letter-spacing: -0.01em; margin: 0; color: var(--fg); }
.fdg__stage--rule .fdg__title { color: var(--canvas-page); }
.fdg__body { margin: 0; font-size: clamp(11.5px, 1.5cqw, 13.5px); line-height: 1.5; color: var(--ink-muted); }
.fdg__stage--rule .fdg__body { color: var(--canvas-page); opacity: 0.85; }
.fdg__stack { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-muted); }

/* The connector is its own grid column so the cards keep equal widths. */
.fdg__wire { align-self: center; position: relative; width: 34px; height: 3px; background: var(--ink-border); opacity: 0.32; }
.fdg__bead {
  position: absolute; top: 50%; left: 0; width: 13px; height: 13px; border-radius: 50%;
  background: var(--accent-green); border: 2px solid var(--ink-border);
  transform: translate(-50%, -50%); opacity: 0;
}
.fdg.is-run .fdg__bead { animation: fdg-bead 3.4s var(--ease) infinite; }
.fdg.is-run .fdg__wire:nth-of-type(2) .fdg__bead { animation-delay: .55s; }
@keyframes fdg-bead {
  0%, 8%   { left: 0;    opacity: 0; }
  14%      { opacity: 1; }
  38%      { left: 100%; opacity: 1; }
  44%, 100%{ left: 100%; opacity: 0; }
}
/* A border pulse walks the three stages so the order reads without arrows. */
.fdg.is-run .fdg__stage { animation: fdg-lift 3.4s var(--ease) infinite; }
.fdg.is-run .fdg__stage--rule { animation-delay: .55s; }
.fdg.is-run .fdg__stage--out { animation-delay: 1.1s; }
@keyframes fdg-lift {
  0%, 12%, 46%, 100% { box-shadow: 4px 4px 0 var(--ink-shadow); transform: none; }
  24%, 34%           { box-shadow: 7px 7px 0 var(--ink-shadow); transform: translate(-2px, -2px); }
}

/* Under roughly a phone's width the row becomes a column and the connectors
   turn upright, because three cards side by side stop being readable long
   before they stop fitting. */
@container (max-width: 640px) {
  .fdg__grid { grid-template-columns: 1fr; }
  .fdg__wire { width: 3px; height: 26px; justify-self: center; }
  .fdg__bead { left: 50%; top: 0; }
  .fdg.is-run .fdg__bead { animation-name: fdg-bead-v; }
  @keyframes fdg-bead-v {
    0%, 8%   { top: 0;    opacity: 0; }
    14%      { opacity: 1; }
    38%      { top: 100%; opacity: 1; }
    44%, 100%{ top: 100%; opacity: 0; }
  }
}

@media (prefers-reduced-motion: reduce) {
  .fdg.is-run .fdg__bead, .fdg.is-run .fdg__stage { animation: none; }
  .fdg__bead { opacity: 1; left: 50%; }
}
`;

export default function FlowDiagram({ project }: { project: Project }) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  // Only animate while on screen. An infinite keyframe left running under a
  // scrolled-past section is work the compositor does for nobody.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle("is-run", e.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const title = t(`work.proj.${project.key}`);
  const tags = t(`work.proj.${project.key}.tags`);
  const blurb = t(`work.proj.${project.key}.blurb`);
  const value = t(`work.proj.${project.key}.value`);

  // A missing key returns the key itself, so a project without copy gets no
  // diagram rather than a card reading "work.proj.x.value".
  const missing = (s: string, k: string) => s === `work.proj.${project.key}${k}`;
  if (missing(blurb, ".blurb") || missing(value, ".value")) return null;

  return (
    <div className="fdg" ref={ref} role="group" aria-label={t("flow.aria")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="fdg__grid">
        <div className="fdg__stage">
          <span className="fdg__cap">01 · {t("flow.s1")}</span>
          {/* Non un titolo: ripete parola per parola l'H1 della pagina, e sta
              dentro una figura (role="group"). Nell'indice era un doppione
              che faceva anche saltare i livelli. */}
          <p className="fdg__title">{title}</p>
          {!missing(tags, ".tags") && <span className="fdg__stack">{tags}</span>}
        </div>

        <div className="fdg__wire" aria-hidden="true"><span className="fdg__bead" /></div>

        <div className="fdg__stage fdg__stage--rule">
          <span className="fdg__cap">02 · {t("flow.s2")}</span>
          <p className="fdg__body">{blurb}</p>
        </div>

        <div className="fdg__wire" aria-hidden="true"><span className="fdg__bead" /></div>

        <div className="fdg__stage fdg__stage--out">
          <span className="fdg__cap">03 · {t("flow.s3")}</span>
          <p className="fdg__body">{value}</p>
        </div>
      </div>
    </div>
  );
}
