"use client";

import { useLang } from "./LangProvider";
import { getVisibilityDemo } from "@/lib/service-demos";
import { DemoPlayerBar, useDemoPlayer } from "./DemoPlayer";

// "Visibilità online" made visible.
//
// The demo everyone builds for this service is a ranking before/after, and it
// is the one thing that cannot be shown honestly: no ranking was won on these
// demonstration projects, and promising a position is the oldest lie in the
// trade. So the two panels show a mechanical consequence instead — what a search
// engine can read off the page, and what an AI assistant can answer about the
// business from it. Both are true by construction, both are checkable by the
// visitor on their own site tonight, and neither claims a place in a list.
//
// The before/after toggle is the whole argument: same business, same product,
// same photos. What changed is only whether the machine could read it.
const CSS = `
.vdm { container-type: inline-size; }
.vdm__hint { margin: 0 0 14px; font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.04em; line-height: 1.55; color: var(--ink-muted); max-width: 70ch; }
.vdm__bar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 14px; }
.vdm__queries { display: flex; flex-wrap: wrap; gap: 7px; }
.vdm__q {
  display: inline-flex; align-items: center; gap: 7px; padding: 8px 12px; cursor: pointer; font: inherit; text-align: left;
  border: 2px solid var(--ink-border); border-radius: var(--radius);
  background: var(--canvas-page); color: var(--ink-body);
  font-family: var(--font-mono); font-size: 11.5px; line-height: 1.35;
  transition: transform 0.16s var(--ease), box-shadow 0.16s var(--ease), background 0.16s var(--ease);
}
.vdm__q::before { content: "⌕"; color: var(--ink-muted); font-size: 13px; }
.vdm__q:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--ink-shadow); }
.vdm__q:focus-visible { outline: none; box-shadow: 3px 3px 0 var(--ink-shadow); transform: translate(-1px, -1px); }
.vdm__q[aria-pressed="true"] { background: var(--accent-green); color: var(--btn-ink); box-shadow: 3px 3px 0 var(--ink-shadow); }
.vdm__q[aria-pressed="true"]::before { color: var(--btn-ink); }

/* The before/after switch: two halves of one control, so the pair reads as one
   state rather than as two independent buttons. */
.vdm__switch { display: inline-flex; border: 2px solid var(--ink-border); border-radius: var(--radius); overflow: hidden; box-shadow: 3px 3px 0 var(--ink-shadow); }
.vdm__half {
  padding: 8px 14px; cursor: pointer; font: inherit; border: 0; background: var(--canvas-page); color: var(--ink-muted);
  font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
}
.vdm__half + .vdm__half { border-left: 2px solid var(--ink-border); }
.vdm__half[aria-pressed="true"] { background: var(--ground-deep); color: var(--canvas-page); }

.vdm__gap {
  margin: 0 0 clamp(16px, 2vw, 22px); padding: 13px 16px;
  border: 2px solid var(--ink-border); border-radius: var(--radius);
  background: var(--canvas-panel-grey);
}
.vdm__gap dt { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-green-deep); }
.vdm__gap dd { margin: 5px 0 0; font-size: 14px; line-height: 1.55; color: var(--ink-body); }

.vdm__panels { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(14px, 1.8vw, 22px); }
@container (max-width: 680px) { .vdm__panels { grid-template-columns: 1fr; } }
.vdm__panel {
  display: flex; flex-direction: column; gap: 11px; padding: clamp(15px, 1.7vw, 20px);
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-panel-yellow); box-shadow: var(--shadow-card);
}
.vdm__panel-t { margin: 0; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-green-deep); }

/* A search result, drawn plainly: link line, url, description. No Google
   chrome, no logo — the shape is the point, the brand is not ours to borrow. */
.vdm__serp { padding: 13px 14px; border: 2px solid var(--ink-border); border-radius: var(--radius); background: var(--canvas-page); }
.vdm__serp-url { margin: 0; font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); }
.vdm__serp-title { margin: 4px 0 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(15px, 1.6vw, 18px); line-height: 1.2; color: var(--accent-green-deep); }
.vdm__serp-desc { margin: 5px 0 0; font-size: 13px; line-height: 1.5; color: var(--ink-body); }

/* The assistant exchange. */
.vdm__ask { display: flex; flex-direction: column; gap: 4px; }
.vdm__ask-l { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); }
.vdm__ask-q { margin: 0; padding: 9px 12px; border: 2px solid var(--ink-border); border-radius: var(--radius); background: var(--canvas-page); font-family: var(--font-mono); font-size: 12px; line-height: 1.45; color: var(--ink-body); }
.vdm__answer { margin: 0; padding: 13px 14px; border: 2px solid var(--ink-border); border-radius: var(--radius); background: var(--ground-deep); color: var(--canvas-page); font-size: 13.5px; line-height: 1.55; }
.vdm__answer--thin { opacity: 0.72; font-style: italic; }

.vdm__note { margin: clamp(14px, 1.8vw, 20px) 0 0; font-family: var(--font-mono); font-size: 11px; line-height: 1.6; color: var(--ink-muted); max-width: 74ch; }

@media (prefers-reduced-motion: reduce) { .vdm__q { transition: none; } }
`;

export default function VisibilityDemo() {
  const { lang } = useLang();
  const c = getVisibilityDemo(lang);

  // The story is six beats, not three: each query is worth seeing broken and
  // then fixed, and the whole argument lives in the cut between the two. One
  // player walks all six so a visitor who never clicks still watches a page go
  // from unreadable to answerable, three times over.
  const steps = c.cases.length * 2;
  const { index, pick, playing, toggle, ref } = useDemoPlayer(steps, 3000);
  const picked = Math.floor(index / 2);
  const fixed = index % 2 === 1;
  const setPicked = (n: number) => pick(n * 2);
  const setFixed = (v: boolean) => pick(picked * 2 + (v ? 1 : 0));

  const k = c.cases[picked] ?? c.cases[0];
  const serp = fixed ? k.serpAfter : k.serpBefore;

  return (
    <div className="vdm" ref={ref} role="group" aria-label={c.serpTitle}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <p className="vdm__hint">{c.hint}</p>

      <DemoPlayerBar
        count={steps}
        index={index}
        playing={playing}
        onToggle={toggle}
        onPick={pick}
        labels={c.cases.flatMap((x) => [`${x.query} — ${c.beforeLabel}`, `${x.query} — ${c.afterLabel}`])}
      />

      <div className="vdm__bar">
        <div className="vdm__queries">
          {c.cases.map((x, i) => (
            <button
              key={x.id}
              type="button"
              className="vdm__q"
              aria-pressed={i === picked}
              onClick={() => setPicked(i)}
            >
              {x.query}
            </button>
          ))}
        </div>
        <div className="vdm__switch" role="group" aria-label={`${c.beforeLabel} / ${c.afterLabel}`}>
          <button type="button" className="vdm__half" aria-pressed={!fixed} onClick={() => setFixed(false)}>
            {c.beforeLabel}
          </button>
          <button type="button" className="vdm__half" aria-pressed={fixed} onClick={() => setFixed(true)}>
            {c.afterLabel}
          </button>
        </div>
      </div>

      <dl className="vdm__gap">
        <dt>{fixed ? c.s2fixed : c.s2}</dt>
        <dd className="dpl-swap" key={index}>{fixed ? k.fix : k.gap}</dd>
      </dl>

      <div className="vdm__panels">
        <section className="vdm__panel">
          <h4 className="vdm__panel-t">{c.serpTitle}</h4>
          <div className="vdm__serp dpl-swap" key={index} aria-live="polite">
            <p className="vdm__serp-url">{serp.url}</p>
            <p className="vdm__serp-title">{serp.title}</p>
            <p className="vdm__serp-desc">{serp.desc}</p>
          </div>
        </section>

        <section className="vdm__panel">
          <h4 className="vdm__panel-t">{c.aiTitle}</h4>
          <div className="vdm__ask">
            <span className="vdm__ask-l">{c.aiPrompt}</span>
            <p className="vdm__ask-q">{k.query}</p>
          </div>
          <p className={`vdm__answer dpl-swap${fixed ? "" : " vdm__answer--thin"}`} key={index} aria-live="polite">
            {fixed ? k.aiAfter : k.aiBefore}
          </p>
        </section>
      </div>

      <p className="vdm__note">{c.disclaimer}</p>
    </div>
  );
}
