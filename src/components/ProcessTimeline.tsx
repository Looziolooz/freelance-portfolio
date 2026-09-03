"use client";

import { useTransform, useMotionValue, useMotionValueEvent, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

// Aceternity-style vertical timeline, re-themed to Parchment & Forest.
// Sticky dots + large phase labels stay fixed while the content scrolls past on
// the right. Each phase carries a realistic photo. framer-motion (the package
// installed here) — same API as motion/react.
//
// The rail is a JOURNEY LINE: one SVG path that draws itself forward with the
// reader's scroll, in the same connector language as the automation canvas on
// the project pages (WorkflowCanvas), so the two surfaces read as one system.
//
// It was a div whose height animated, which cannot curve, cannot carry a drawing
// head, and cannot be dashed. Two constraints shaped the curve:
//
//   1. The dots are `position: sticky`. They slide ALONG the rail, so the line
//      has to be exactly vertical at every dot or it drifts off them. The
//      serpentine therefore bows out only in the empty stretches BETWEEN phases
//      and returns to the spine at each dot's centre.
//   2. `pathLength={1}` normalises the path, so one `strokeDashoffset` from 1 to
//      0 draws the whole journey in order regardless of how long the page is —
//      no re-measuring when a phase's photo changes height.
//
// Each phase dot carries a `is-reached` class, toggled from the same scroll
// progress that drives the dash: the core is hollow until the drawn head passes
// its marker, then fills with the ochre→forest gradient. The head is a single
// dot, placed on the path the way the automation canvas places its bead.
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const readMotion = () => window.matchMedia(MOTION_QUERY).matches;
const readMotionOnServer = () => false;

// SVG-local geometry. The svg sits at left 4px, so the spine at x=24 lands on
// the dot centre (left 6 + 44/2 = 28).
// The spine sits at the middle of the svg, so the same path data works whether
// CSS puts the route hard left (phones) or dead centre (desktop): only the box
// moves. Wide enough that the zig never leaves the viewBox.
const SPINE_X = 100;
const SVG_W = 200;
// Two waypoints per empty stretch, alternating sides, so the route zig-zags
// rather than leaning. Both curves in a stretch are the same size; the whole
// zig alternates left/right per stretch, so it reads as an even sawtooth.
// Amplitude scales with the track: at 390px a big swing would cross into the
// body text, which starts 64px in from the row.
const ZIG_MIN = 18;
const ZIG_MAX = 46;
const ZIG_RATIO = 0.055;

export type TimelineEntry = {
  phase: string;
  title: string;
  statement: string;
  body: string;
  bullets: string[];
  /** Concrete expectations per phase: deliverable, duration, what the client provides. */
  meta?: { label: string; value: string }[];
  image: string;
  alt: string;
  // Intrinsic pixel size — the frame takes the photo's natural aspect ratio so
  // it fills edge-to-edge with the WHOLE image (no cropping, no letterbox bars).
  w: number;
  h: number;
};

const round = (n: number) => Math.round(n * 10) / 10;

// How much the curve is allowed to lean out of a corner. 0 is the polyline this
// started as; much above 1 and the route loops back on itself.
const SMOOTHING = 0.9;

/**
 * A rounded path through every waypoint, in order.
 *
 * Catmull-Rom converted to cubic Béziers: it passes exactly through each point,
 * which is what keeps the dots on the line, while the corners between them come
 * out as curves rather than as kinks. A plain polyline read as a folded ribbon.
 */
function smooth(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  let d = `M${round(pts[0][0])} ${round(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const [x0, y0] = at(i - 1);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    const [x3, y3] = at(i + 2);
    const k = SMOOTHING / 6;
    const c1x = x1 + (x2 - x0) * k;
    const c1y = y1 + (y2 - y0) * k;
    const c2x = x2 - (x3 - x1) * k;
    const c2y = y2 - (y3 - y1) * k;
    d += ` C${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(x2)} ${round(y2)}`;
  }
  return d;
}

export default function ProcessTimeline({ entries }: { entries: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLElement | null)[]>([]);
  const drawnRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);
  // Mirrors of the measured state, read from scroll callbacks without making
  // the callback depend on a re-render (and without reading state during render).
  const heightRef = useRef(0);
  const dotYsRef = useRef<number[]>([]);
  const [height, setHeight] = useState(0);
  const [dotYs, setDotYs] = useState<number[]>([]);
  const [trackW, setTrackW] = useState(0);
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, readMotionOnServer);

  // The line has to pass through each dot, so it needs to know where they are.
  // Measured from the DOM rather than derived from the CSS padding scale, because
  // every phase is a different height (the photos keep their own aspect ratio).
  useEffect(() => {
    const measure = () => {
      const track = ref.current;
      if (!track) return;
      const h = track.getBoundingClientRect().height;
      heightRef.current = h;
      setHeight(h);
      const w = track.getBoundingClientRect().width;
      setTrackW(w);
      const ys = rowRefs.current.map((row) => {
        const dot = row?.querySelector<HTMLElement>(".ptl-dot");
        if (!dot) return 0;
        // offsetTop, deliberately, not getBoundingClientRect: the dot is
        // `position: sticky`, so its painted box is wherever the reader has
        // scrolled it to, while the path needs its RESTING position. Sticky
        // does not move layout offsets, so walking the offsetParent chain
        // gives the same answer at any scroll depth.
        let y = 0;
        let el: HTMLElement | null = dot;
        while (el && el !== track) {
          y += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return y + dot.offsetHeight / 2;
      });
      dotYsRef.current = ys;
      setDotYs(ys);
    };
    measure();
    window.addEventListener("resize", measure);
    // Photos land after first paint and move every dot below them.
    const imgs = ref.current?.querySelectorAll("img") ?? [];
    imgs.forEach((img) => img.addEventListener("load", measure));
    return () => {
      window.removeEventListener("resize", measure);
      imgs.forEach((img) => img.removeEventListener("load", measure));
    };
  }, [entries]);

  // Journey progress, 0..1, computed by hand instead of with useScroll(target).
  // framer-motion's useScroll measures the target's rect once and then does not
  // reliably re-measure it when lazy photos load afterwards, which froze the
  // whole line (the deployed site shipped with the bead parked at ~30%). The
  // ResizeObserver below re-measures on every layout change, so the draw keeps
  // in step with the actual track.
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // The draw window: starts when the track's top passes 18% down the
      // viewport, finishes when its bottom reaches 78%. Same window the old
      // useScroll call used.
      const topLine = vh * 0.18;
      const bottomLine = vh * 0.78;
      const travel = rect.height - (bottomLine - topLine);
      if (travel <= 0) {
        scrollYProgress.set(1);
        return;
      }
      const t = (topLine - rect.top) / travel;
      scrollYProgress.set(Math.min(1, Math.max(0, t)));
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      ro.disconnect();
    };
  }, [scrollYProgress]);

  // One dash, the length of the whole path, pulled back into view as you scroll.
  const dashOffset = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  // The route, as waypoints: the spine at every dot, and two zig points across
  // each empty stretch. Every dot is a waypoint on the spine, which is the
  // constraint the sticky dots impose; the zig happens in between, where there
  // is nothing to knock out of alignment.
  const d = (() => {
    if (height <= 0 || dotYs.length === 0) return `M${SPINE_X} 0 L${SPINE_X} ${Math.max(height, 1)}`;
    const amp = Math.max(ZIG_MIN, Math.min(ZIG_MAX, trackW * ZIG_RATIO));
    const pts: [number, number][] = [[SPINE_X, 0], [SPINE_X, dotYs[0]]];
    for (let i = 1; i < dotYs.length; i += 1) {
      const from = dotYs[i - 1];
      const span = dotYs[i] - from;
      // Two equal curves, this stretch leaning right then left (or the reverse
      // on even stretches), so the path describes an even zig-zag.
      const dir = i % 2 === 1 ? 1 : -1;
      pts.push([SPINE_X + dir * amp, from + span / 3]);
      pts.push([SPINE_X - dir * amp, from + (span * 2) / 3]);
      pts.push([SPINE_X, dotYs[i]]);
    }
    pts.push([SPINE_X, height]);
    return smooth(pts);
  })();

  // The drawing head. Placed from the real path with getPointAtLength, the same
  // way the automation canvas moves its bead, so the two behave identically.
  const placeBead = useCallback((progress: number) => {
    const path = drawnRef.current;
    const bead = beadRef.current;
    if (!path || !bead) return;
    const total = path.getTotalLength();
    if (!total) return;
    const p = path.getPointAtLength(total * Math.min(1, Math.max(0, progress)));
    bead.setAttribute("cx", String(round(p.x)));
    bead.setAttribute("cy", String(round(p.y)));
  }, []);

  // Each phase dot fills in as the drawn head passes its marker. The head's
  // path hugs the spine (the zig is small against the vertical run), so the
  // fraction of the track the head has covered ≈ its vertical fraction — no
  // arc-length bookkeeping needed to decide when a dot is reached.
  const lightDots = useCallback((progress: number) => {
    const h = heightRef.current;
    const ys = dotYsRef.current;
    if (h <= 0 || ys.length === 0) return;
    const p = Math.min(1, Math.max(0, progress));
    ys.forEach((y, i) => {
      const dot = dotRefs.current[i];
      if (dot) dot.classList.toggle("is-reached", p >= y / h);
    });
  }, []);

  const onProgress = useCallback(
    (latest: number) => {
      placeBead(latest);
      lightDots(latest);
    },
    [placeBead, lightDots],
  );

  useMotionValueEvent(scrollYProgress, "change", onProgress);
  useEffect(() => {
    const progress = reduced ? 1 : scrollYProgress.get();
    placeBead(progress);
    lightDots(progress);
  }, [d, placeBead, lightDots, reduced, scrollYProgress]);

  return (
    <div ref={containerRef} className="ptl">
      <div ref={ref} className="ptl-track">
        {entries.map((e, i) => (
          <div
            key={i}
            className={`ptl-row ${i % 2 === 1 ? "ptl-row--right" : "ptl-row--left"}`}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
          >
              {/* sticky marker: dot + big phase label */}
              <div className="ptl-marker">
                <span
                  className="ptl-dot"
                  aria-hidden="true"
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                >
                  <span className="ptl-dot__core" />
                </span>
              {/* Visual duplicate of the content heading (sticky rail) — kept out
                  of the document outline (the audit found every phase H2 twice). */}
              <div className="ptl-marker__label" aria-hidden="true">
                <span className="ptl-phase">{e.phase}</span>
                <p className="ptl-title" style={{ margin: 0 }}>{e.title}</p>
              </div>
            </div>

            {/* content */}
            <div className="ptl-content">
              <div className="ptl-content__head">
                <span className="ptl-phase">{e.phase}</span>
                <h2 className="ptl-title">{e.title}</h2>
              </div>
              <p className="ptl-statement">{e.statement}</p>
              <p className="ptl-body">{e.body}</p>
              {e.meta && (
                <dl className="ptl-meta">
                  {e.meta.map((m, mi) => (
                    <div key={mi} className="ptl-meta__row">
                      <dt>{m.label}</dt>
                      <dd>{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <ul className="ptl-bullets">
                {e.bullets.map((b, bi) => (
                  <li key={bi}>
                    <span className="ptl-tick" aria-hidden="true">+</span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* The photo follows the texts, at the same width as the paragraph,
                  in a fixed rectangular frame (aspect-ratio + cover, so every
                  phase reads the same even though the sources differ in shape).
                  A caption, not a hero: the corner scrim + LO.oz keep it quiet. */}
              <div className="ptl-photo">
                {e.image && (
                  <>
                    <Image
                      src={e.image}
                      alt={e.alt}
                      fill
                      sizes="(max-width: 880px) calc(100vw - 64px), 460px"
                      style={{ objectFit: "cover" }}
                    />
                    <span className="ptl-photo__scrim" aria-hidden="true" />
                    <span className="ptl-photo__cap">LO.oz</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* The journey line. Decorative: the phases are numbered in real text,
            so nothing here carries meaning a screen reader needs. */}
        <svg
          className="ptl-line"
          width={SVG_W}
          height={Math.max(height, 1)}
          viewBox={`0 0 ${SVG_W} ${Math.max(height, 1)}`}
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="ptlDraw" x1="0" y1="0" x2="0" y2={Math.max(height, 1)} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="var(--accent-green)" />
              <stop offset="1" stopColor="var(--accent-green-deep)" />
            </linearGradient>
          </defs>

          {/* the route not yet travelled */}
          <path className="ptl-line__track" d={d} />

          {/* the route travelled, drawn by pulling one full-length dash into view */}
          <motion.path
            ref={drawnRef}
            className="ptl-line__drawn"
            d={d}
            pathLength={1}
            strokeDasharray="1 1"
            style={
              reduced
                ? { strokeDashoffset: 0, opacity: 1 }
                : { strokeDashoffset: dashOffset, opacity: lineOpacity }
            }
          />

          {/* the drawing head: one dot, hidden when the reader has asked for
              less motion. Placed on the path like the automation canvas. */}
          {!reduced && (
            <circle
              ref={beadRef}
              className="ptl-line__bead"
              r="5"
              cx={SPINE_X}
              cy="0"
            />
          )}
        </svg>
      </div>

      <style>{`
        .ptl {
          position: relative; width: 100%;
          /* Where the route runs. On a phone there is only one column, so it
             hugs the left the way a timeline does; from 880px the content
             alternates either side of it and it runs down the middle. */
          --ptl-spine: calc(clamp(16px, 5vw, 40px) + 28px);
          --ptl-gutter: 96px;
        }
        .ptl-track { position: relative; max-width: 1100px; margin: 0 auto; padding: 0 clamp(16px, 5vw, 40px); }

        .ptl-row { display: flex; justify-content: flex-start; padding-top: clamp(40px, 7vw, 110px); }
        .ptl-row:first-child { padding-top: clamp(20px, 4vw, 56px); }

        /* marker column */
        .ptl-marker { position: sticky; top: calc(var(--topbar-h) + 48px); z-index: 3; align-self: flex-start; display: flex; align-items: center; }
        .ptl-dot {
          position: absolute; left: 6px; display: grid; place-items: center;
          width: 44px; height: 44px; border-radius: 50%;
          border: 3px solid var(--ink-border); background: var(--canvas-page);
          box-shadow: var(--shadow-badge);
        }
        .ptl-dot__core {
          width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--ink-border);
          /* Hollow until the journey reaches this phase; the filled state is
             driven by the scroll-linked .is-reached class. */
          background: var(--canvas-page);
          transition: background 0.45s var(--ease), box-shadow 0.45s var(--ease);
        }
        .ptl-dot.is-reached .ptl-dot__core {
          background: linear-gradient(145deg, var(--accent-green), var(--accent-green-deep));
          box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent-green) 26%, transparent);
        }
        .ptl-marker__label { display: none; }

        /* content column */
        .ptl-content { position: relative; width: 100%; padding-left: 64px; }
        .ptl-content__head { margin-bottom: 14px; }
        .ptl-phase { display: block; font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-green-deep); }
        .ptl-title { margin: 4px 0 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(30px, 5vw, 52px); line-height: 1.0; letter-spacing: -0.02em; color: var(--ink-body); }

        .ptl-statement { margin: 0 0 14px; font-family: var(--font-display); font-size: clamp(20px, 2.4vw, 30px); font-weight: 500; line-height: 1.18; letter-spacing: -0.01em; color: var(--ink-body); }
        .ptl-body { margin: 0 0 22px; font-size: clamp(15px, 1.3vw, 17px); line-height: 1.65; color: var(--ink-muted); max-width: none; }

        .ptl-meta { margin: 0 0 22px; border: 3px solid var(--ink-border); border-radius: var(--radius); background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow); padding: 4px 16px; }
        .ptl-meta__row { display: flex; gap: 14px; align-items: baseline; padding: 10px 0; }
        .ptl-meta__row + .ptl-meta__row { border-top: 1.5px solid color-mix(in oklch, var(--ink-border) 16%, transparent); }
        .ptl-meta dt { flex-shrink: 0; width: 132px; margin: 0; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent-green-deep); }
        .ptl-meta dd { margin: 0; font-size: 14.5px; line-height: 1.5; color: var(--ink-body); }
        .ptl-bullets { list-style: none; margin: 0 0 26px; padding: 0; display: flex; flex-direction: column; }
        .ptl-bullets li { display: flex; align-items: baseline; gap: 12px; font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--ink-body); padding: 11px 0; border-bottom: 1.5px solid color-mix(in oklch, var(--ink-border) 20%, transparent); }
        .ptl-bullets li:first-child { border-top: 1.5px solid color-mix(in oklch, var(--ink-border) 20%, transparent); }
        .ptl-tick { color: var(--accent-green-deep); font-weight: 800; flex-shrink: 0; }

        .ptl-photo {
          /* A fixed rectangular frame at the paragraph's width: every phase
             reads the same height even though the sources differ in shape, and
             the image is cropped (cover) to fill it. A caption, not a hero. */
          position: relative; width: 100%; aspect-ratio: 3 / 2; overflow: hidden; line-height: 0;
          border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
        }
        .ptl-photo__scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(160px 160px at 100% 100%, rgba(20,17,13,0.72), transparent 72%),
            linear-gradient(to top, rgba(20,17,13,0.5), transparent 40%),
            linear-gradient(to left, rgba(20,17,13,0.4), transparent 36%);
        }
        .ptl-photo__cap {
          position: absolute; right: 14px; bottom: 12px; z-index: 2; pointer-events: none;
          font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.05em;
          line-height: 1; color: var(--canvas-page); text-shadow: 0 1px 4px rgba(0,0,0,0.45);
        }

        /* The line sits behind the sticky dots. The spine at x=24 plus the svg's
           own 4px offset lands on the dot centre (left 6 + 44/2 = 28). The mask
           fades both ends so the route does not start and stop with a hard cut. */
        .ptl-line {
          /* The track is padded, and the dots are positioned INSIDE that padding,
             so an absolute left offset measured from the track's own box lands a
             whole padding-width to the left of them. Measured 40px out at 1440. */
          position: absolute; left: calc(var(--ptl-spine) - ${SPINE_X}px);
          top: 0; z-index: 1; overflow: visible;
          pointer-events: none;
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 5%, #000 95%, transparent);
          mask-image: linear-gradient(to bottom, transparent, #000 5%, #000 95%, transparent);
        }
        .ptl-line__track {
          stroke: color-mix(in oklch, var(--ink-border) 18%, transparent);
          stroke-width: 3; stroke-linecap: round; stroke-linejoin: round;
        }
        .ptl-line__drawn {
          stroke: url(#ptlDraw);
          stroke-width: 3; stroke-linecap: round; stroke-linejoin: round;
          /* A faint ochre glow under the travelled route, so the drawn stretch
             reads as the lit path the way the automation canvas lights its. */
          filter: drop-shadow(0 0 2.5px color-mix(in oklch, var(--accent-green) 45%, transparent));
        }
        .ptl-line__bead {
          fill: var(--accent-green);
          stroke: var(--ink-border);
          stroke-width: 2;
          filter: drop-shadow(0 0 3px color-mix(in oklch, var(--accent-green) 60%, transparent));
        }

        @media (min-width: 880px) {
          /* Three columns: content, the gutter the route runs down, content.
             Phases alternate sides so the eye crosses the line at every step
             instead of running down one edge of the page. */
          .ptl { --ptl-spine: 50%; }
          .ptl-row {
            display: grid;
            grid-template-columns: 1fr var(--ptl-gutter) 1fr;
            gap: 0; padding-top: clamp(80px, 9vw, 150px);
          }
          .ptl-marker { grid-column: 2; grid-row: 1; min-width: 0; justify-content: center; }
          /* Static, so the dot centres itself in the gutter and therefore on the
             route. On phones it is absolutely placed against the left edge. */
          .ptl-dot { position: static; }
          /* The big phase label now travels WITH its content, on whichever side
             that content is, so it stays next to the text it titles. */
          .ptl-marker__label { display: none; }
          .ptl-content { padding-left: 0; min-width: 0; }
          .ptl-content__head { display: block; margin-bottom: 18px; }
          .ptl-content__head .ptl-title { font-size: clamp(30px, 3.2vw, 44px); overflow-wrap: anywhere; }

          /* Text keeps a small share of its side of the line: a narrow block
             hugged against the route, with the empty column space on the outer
             edge. The photo lives inside that block, so it lands at the same
             width as the paragraph. */
          .ptl-content { max-width: clamp(380px, 38vw, 460px); }
          .ptl-row--left .ptl-content { grid-column: 1; grid-row: 1; justify-self: end; padding-right: 24px; }
          .ptl-row--right .ptl-content { grid-column: 3; grid-row: 1; justify-self: start; padding-left: 24px; }

          /* Body copy stays left-aligned on both sides: alternating the rag is
             the one thing that would genuinely cost readability. The paragraph
             is the photo's width, so the two read as one caption block. */
          .ptl-photo { max-width: 100%; }
        }

        /* Belt and braces: the React path already renders complete under
           reduced motion, and this covers the first paint before the store reads.
           The dots all read as reached too — nothing walks the line, so nothing
           stays hollow. */
        @media (prefers-reduced-motion: reduce) {
          .ptl-line__drawn { stroke-dashoffset: 0 !important; opacity: 1 !important; }
          .ptl-line__bead { display: none; }
          .ptl-dot__core,
          .ptl-dot.is-reached .ptl-dot__core {
            background: linear-gradient(145deg, var(--accent-green), var(--accent-green-deep));
            transition: none;
          }
        }

        /* La riga dt/dd stava su una sola riga con un dt fisso a 132px che non
           poteva stringersi. Sommato all'indentazione della timeline, al dd
           restava troppo poco e l'ultima parola finiva tagliata dal ritaglio
           orizzontale della pagina (7px oltre il bordo a 360px). Impilati,
           tutti e due prendono la colonna intera. */
        @media (max-width: 480px) {
          .ptl-meta__row { flex-direction: column; gap: 4px; align-items: flex-start; }
          .ptl-meta dt { width: auto; }
        }
      `}</style>
    </div>
  );
}
