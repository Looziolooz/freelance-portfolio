"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangProvider";

// The shared playback engine behind every demo on the site.
//
// The demos were all built click-first: correct for someone who has decided to
// explore, useless for the visitor who is scrolling and has not decided
// anything yet. That visitor sees one frozen case and reads it as a picture, so
// the interactivity never gets discovered and the demo does the job of a
// screenshot at the cost of a component.
//
// So each demo now plays itself the moment it scrolls into view, and stops the
// moment the visitor takes over. Rules that make that bearable rather than
// annoying:
//
//   · It runs ONLY while on screen. An interval firing under a scrolled-past
//     section is state churn and re-renders for nobody.
//   · Touching anything stops it for good. Autoplay that resumes after a manual
//     pick fights the person using it, and loses.
//   · prefers-reduced-motion never autoplays at all — motion that redraws the
//     content is exactly what that setting is about, and a demo that changes on
//     its own is unusable for someone who needs to read slowly.
//   · The bar is a real control, not an indicator: the ticks are buttons, so the
//     thing that shows progress is also the thing that lets you go back.
//
// One engine, one bar and one swap animation for all four demos, because four
// hand-rolled versions of "it plays by itself" is four ways to drift.

export const DEMO_STEP_MS = 3600;

export function useDemoPlayer(count: number, interval: number = DEMO_STEP_MS) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [taken, setTaken] = useState(false);
  const [reduce, setReduce] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || taken) return;
    setPlaying(visible);
  }, [visible, reduce, taken]);

  useEffect(() => {
    if (!playing || count < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % count), interval);
    return () => clearInterval(t);
  }, [playing, count, interval]);

  // A language switch can swap the copy for a set with a different number of
  // cases, so never hand back an index the caller cannot use.
  const index = count > 0 ? i % count : 0;

  /** Manual selection: the visitor has taken over, so playback ends. */
  const pick = (n: number) => {
    setI(n);
    setTaken(true);
    setPlaying(false);
  };

  const toggle = () => {
    const next = !playing;
    setPlaying(next);
    setTaken(!next);
  };

  return { index, pick, playing, toggle, ref, reduce, interval };
}

const CSS = `
.dpl {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  margin-bottom: clamp(14px, 1.8vw, 18px);
}
.dpl__btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 7px 13px 7px 11px; cursor: pointer; font: inherit;
  border: 2px solid var(--ink-border); border-radius: var(--radius);
  background: var(--canvas-page); color: var(--ink-body);
  font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  transition: transform 0.16s var(--ease), box-shadow 0.16s var(--ease);
}
.dpl__btn:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--ink-shadow); }
.dpl__btn:focus-visible { outline: none; box-shadow: 3px 3px 0 var(--ink-shadow); transform: translate(-1px, -1px); }
.dpl__ico { width: 0; height: 0; border-style: solid; }
.dpl__ico--play { border-width: 5px 0 5px 8px; border-color: transparent transparent transparent currentColor; }
.dpl__ico--pause { width: 8px; height: 10px; border: 0; background: currentColor; clip-path: polygon(0 0, 3px 0, 3px 100%, 0 100%, 0 0, 5px 0, 8px 0, 8px 100%, 5px 100%, 5px 0); }

/* Ticks double as the chapter list: one per step, clickable, and the active one
   drains in real time so the visitor can see how long they have before it
   moves on. */
.dpl__ticks { display: flex; align-items: center; gap: 5px; }
.dpl__tick {
  position: relative; width: 26px; height: 6px; padding: 0; cursor: pointer;
  border: 1.5px solid var(--ink-border); border-radius: 999px;
  background: var(--canvas-page); overflow: hidden;
}
.dpl__tick[aria-current="true"] { background: color-mix(in oklch, var(--accent-green) 30%, transparent); }
.dpl__tick[aria-current="true"]::after {
  content: ""; position: absolute; inset: 0; transform-origin: left center;
  background: var(--accent-green); transform: scaleX(0);
}
.dpl.is-playing .dpl__tick[aria-current="true"]::after {
  animation: dpl-drain var(--dpl-dur, 3600ms) linear both;
}
.dpl:not(.is-playing) .dpl__tick[aria-current="true"]::after { transform: scaleX(1); }
@keyframes dpl-drain { from { transform: scaleX(0); } to { transform: scaleX(1); } }

.dpl__count { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); }

/* The swap. Same 420ms lift-and-fade in every demo, so moving between them
   feels like one system rather than four components that happen to animate. */
.dpl-swap { animation: dpl-swap 0.42s var(--ease) both; }
@keyframes dpl-swap {
  from { opacity: 0; transform: translateY(7px); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .dpl__btn { transition: none; }
  .dpl.is-playing .dpl__tick[aria-current="true"]::after { animation: none; transform: scaleX(1); }
  .dpl-swap { animation: none; }
}
`;

export function DemoPlayerBar({
  count,
  index,
  playing,
  interval = DEMO_STEP_MS,
  onToggle,
  onPick,
  labels,
}: {
  count: number;
  index: number;
  playing: boolean;
  interval?: number;
  onToggle: () => void;
  onPick: (n: number) => void;
  /** Per-step names, used for the tick labels so the control is navigable blind. */
  labels?: string[];
}) {
  const { t } = useLang();
  return (
    <div className={`dpl${playing ? " is-playing" : ""}`} style={{ ["--dpl-dur" as string]: `${interval}ms` }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <button type="button" className="dpl__btn" onClick={onToggle}>
        <span className={`dpl__ico dpl__ico--${playing ? "pause" : "play"}`} aria-hidden="true" />
        {playing ? t("demo.pause") : t("demo.play")}
      </button>
      <div className="dpl__ticks">
        {Array.from({ length: count }, (_, n) => (
          <button
            key={n}
            type="button"
            className="dpl__tick"
            aria-current={n === index}
            aria-label={labels?.[n] ?? `${t("demo.step")} ${n + 1}`}
            /* The drain restarts by itself: aria-current moves to a different
               element each step, so the ::after animation is applied fresh
               rather than continuing on the same node. */
            onClick={() => onPick(n)}
          />
        ))}
      </div>
      <span className="dpl__count">{index + 1} / {count}</span>
    </div>
  );
}
