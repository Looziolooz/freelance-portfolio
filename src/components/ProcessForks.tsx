"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useLang } from "./LangProvider";

// /processo used to draw one journey for everybody: four phases, and the third
// one quietly held "site, e-commerce, automations and AI" in a single bullet
// list. That is four different jobs wearing one costume. A brand is agreed on
// paper and handed over; a site is built in previews; an automation is a flow
// that must survive contact with real cases; visibility is not a delivery at
// all, it is a rhythm. Pretending they share phases 03 and 04 made the page
// vague exactly where a buyer wants it specific.
//
// So the shared line now stops after the two phases that ARE genuinely shared —
// the call and the plan — and this is where it forks. Four roads, each with its
// own steps, its own clock, and its own answer to "what moves the price".
//
// Drawn as a fork rather than laid out as three comparison cards, because the
// page's whole argument is a line you can follow, and the truthful picture is
// one start splitting into four. The splitting curve is measured in real pixels
// (a viewBox stretched by preserveAspectRatio="none" would thin the stroke on
// one axis), and it only exists on the wide layout: stacked on a phone there is
// nothing to fork, so the lanes simply follow one another.

const FORK_H = 96;

const PATHS = [
  { key: "brand", work: "/work/branding", service: null },
  { key: "site", work: "/work/web-design", service: "/servizi/siti-web" },
  { key: "autom", work: "/work/automazioni-ai", service: "/servizi/automazioni" },
  { key: "visib", work: "/work/marketing", service: null },
] as const;

const CSS = `
.pfk { padding-top: clamp(48px, 6vw, 92px); }

.pfk__fork { display: block; width: 100%; height: ${FORK_H}px; overflow: visible; }
.pfk__fork path {
  fill: none;
  stroke: var(--accent-gold, var(--accent-green-deep));
  stroke-width: 2;
  stroke-linecap: round;
  /* Drawn in when the fork reaches the reader, using the same one-long-dash
     trick as the journey line above it. */
  stroke-dasharray: var(--pfk-len) var(--pfk-len);
  stroke-dashoffset: var(--pfk-len);
  transition: stroke-dashoffset 1.1s var(--ease);
}
.pfk.is-drawn .pfk__fork path { stroke-dashoffset: 0; }

.pfk__lanes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(14px, 2vw, 30px);
  align-items: start;
}

.pfk__lane { display: flex; flex-direction: column; gap: 12px; min-width: 0; }

.pfk__n {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--ink-muted);
}
.pfk__name {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(20px, 1.9vw, 27px);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--fg);
}
.pfk__tag { margin: 0; font-size: 14.5px; line-height: 1.5; color: var(--ink-body); }

/* The steps ride their own short rail, so each road still looks like a road. */
.pfk__steps { list-style: none; margin: 4px 0 0; padding: 0 0 0 20px; position: relative; }
.pfk__steps::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: color-mix(in srgb, var(--ink-border) 34%, transparent);
}
.pfk__steps li { position: relative; padding: 7px 0; font-size: 14px; line-height: 1.45; color: var(--ink-body); }
.pfk__steps li::before {
  content: "";
  position: absolute;
  left: -20px;
  top: 14px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--canvas-page);
  border: 2px solid var(--accent-green-deep);
}

.pfk__meta { margin: 6px 0 0; display: flex; flex-direction: column; gap: 10px; }
.pfk__meta div { display: flex; flex-direction: column; gap: 3px; }
.pfk__meta dt {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.pfk__meta dd { margin: 0; font-size: 13.5px; line-height: 1.45; color: var(--ink-body); }

.pfk__links { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 4px; }
.pfk__link {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-green-deep);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--accent-green-deep) 34%, transparent);
  padding-bottom: 2px;
}
.pfk__link:hover, .pfk__link:focus-visible { border-color: var(--accent-green-deep); }

@media (max-width: 1020px) {
  .pfk__fork { display: none; }
  .pfk__lanes { grid-template-columns: 1fr; gap: clamp(30px, 6vw, 48px); }
  .pfk__lane { border-top: 2px solid var(--ink-border); padding-top: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .pfk__fork path { transition: none; stroke-dashoffset: 0; }
}
`;

/**
 * One start at the top centre, one branch per lane head.
 *
 * The lane centres are MEASURED, not divided out of the width: the grid has a
 * clamped gap between columns, so `width / lanes * (i + 0.5)` lands about a
 * dozen pixels beside each lane instead of on it — enough to read as a mistake.
 */
function forkPath(width: number, centres: number[]): string {
  if (width <= 0 || centres.length === 0) return "";
  const x0 = width / 2;
  // A single cubic per branch: leaves the trunk vertically, arrives at the lane
  // head vertically, so the joins read as one continuous road.
  return centres
    .map((x) => `M${x0} 0 C ${x0} ${FORK_H * 0.45}, ${x} ${FORK_H * 0.55}, ${x} ${FORK_H}`)
    .join(" ");
}

export default function ProcessForks() {
  const { t } = useLang();
  const i = (k: string) => t(`processo.fork.${k}`);
  const ref = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lanesRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [centres, setCentres] = useState<number[]>([]);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  // Real pixels, re-measured on resize: the curve has to land on the lane
  // centres the grid actually produced, not on the ones a formula guessed.
  useEffect(() => {
    const svg = svgRef.current;
    const lanes = lanesRef.current;
    if (!svg || !lanes) return;
    const measure = () => {
      const box = svg.getBoundingClientRect();
      setWidth(svg.clientWidth);
      setCentres(
        Array.from(lanes.children, (lane) => {
          const r = (lane as HTMLElement).getBoundingClientRect();
          return r.left - box.left + r.width / 2;
        }),
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    ro.observe(lanes);
    return () => ro.disconnect();
  }, []);

  const d = forkPath(width, centres);

  return (
    <section
      ref={ref}
      className={`pfk${inView ? " is-drawn" : ""}`}
      aria-label={i("title")}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="container">
        <div className="sec-head">
          <span className="sec-head__eyebrow">{i("kicker")}</span>
          <h2 className="sec-head__title">{i("title")}</h2>
          <p className="sec-head__sub">{i("sub")}</p>
        </div>

        <svg
          ref={svgRef}
          className="pfk__fork"
          viewBox={`0 0 ${Math.max(width, 1)} ${FORK_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          style={{ ["--pfk-len" as string]: `${FORK_H * 2}px` }}
        >
          {d && <path d={d} />}
        </svg>

        <div className="pfk__lanes" ref={lanesRef}>
          {PATHS.map((p, n) => (
            <div key={p.key} className="pfk__lane">
              <span className="pfk__n">{String(n + 1).padStart(2, "0")}</span>
              <h3 className="pfk__name">{i(`${p.key}.name`)}</h3>
              <p className="pfk__tag">{i(`${p.key}.tag`)}</p>

              <ol className="pfk__steps">
                {i(`${p.key}.steps`).split("|").map((s, si) => (
                  <li key={si}>{s}</li>
                ))}
              </ol>

              <dl className="pfk__meta">
                <div>
                  <dt>{i("lbl.time")}</dt>
                  <dd>{i(`${p.key}.time`)}</dd>
                </div>
                <div>
                  <dt>{i("lbl.driver")}</dt>
                  <dd>{i(`${p.key}.driver`)}</dd>
                </div>
              </dl>

              <div className="pfk__links">
                <Link href={p.work} className="pfk__link">
                  {i("lbl.work")} ↗
                </Link>
                {p.service && (
                  <Link href={p.service} className="pfk__link">
                    {i("lbl.service")} ↗
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
