"use client";

import { useLang } from "./LangProvider";
import { getWorkflow, getWorkflowGraph } from "@/lib/workflows";
import { DemoPlayerBar, useDemoPlayer } from "./DemoPlayer";
import WorkflowCanvas from "./WorkflowCanvas";

// The playable version of the automation diagrams.
//
// What it replaces: a rendered PNG per project, text baked in, Italian only, one
// frozen case. It showed the SHAPE of a process and none of its judgement, which
// is the only part a buyer is actually deciding about. Here the visitor picks the
// input and the middle stage shows which rule fired and the last stage shows what
// came out — including the cases where the automation deliberately does nothing.
//
// Three things are load-bearing:
//
//   1. Text stays in the DOM across a pick. The output is never swapped for a
//      spinner, so the aria-live region announces the result once and a visitor
//      on a screen reader gets the same content a sighted one does. The "it is
//      thinking" beat is carried by motion over stable text, not by hiding it.
//   2. A case is always selected, including on first paint. There is no empty
//      state to design, a crawler reads a complete example, and reduced-motion
//      visitors lose nothing but the bead.
//   3. Copy comes from lib/workflows.ts, keyed by the site language, so a new
//      language is a data edit and never a re-render of six video files.
const CSS = `
.wfd { container-type: inline-size; }
.wfd__hint {
  margin: 0 0 14px; font-family: var(--font-mono); font-size: 11.5px;
  letter-spacing: 0.04em; line-height: 1.5; color: var(--ink-muted);
}
.wfd__grid { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: stretch; gap: 12px; }
.wfd__stage {
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-panel-grey); box-shadow: 4px 4px 0 var(--ink-shadow);
  padding: 16px 18px; display: flex; flex-direction: column; gap: 9px; min-width: 0;
}
.wfd__stage--rule { background: var(--ground-deep); }
.wfd__stage--out { background: var(--canvas-panel-yellow); }
.wfd__cap {
  font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--accent-green-deep); font-weight: 700;
}
.wfd__stage--rule .wfd__cap { color: var(--accent-green); }
.wfd__title {
  font-family: var(--font-display); font-weight: 600; font-size: clamp(15px, 2.2cqw, 20px);
  line-height: 1.15; letter-spacing: -0.01em; margin: 0; color: var(--fg);
}
.wfd__stage--rule .wfd__title { color: var(--canvas-page); }

/* Stage 01 — the inputs. Real buttons, so keyboard and screen readers get the
   interaction for free and aria-pressed carries the selected state. */
.wfd__cases { display: flex; flex-direction: column; gap: 7px; margin-top: 2px; }
.wfd__case {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  width: 100%; text-align: left; padding: 9px 11px; cursor: pointer;
  border: 2px solid var(--ink-border); border-radius: var(--radius);
  background: var(--canvas-page); color: var(--ink-body); font: inherit;
  transition: transform 0.16s var(--ease), box-shadow 0.16s var(--ease), background 0.16s var(--ease);
}
.wfd__case:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--ink-shadow); }
.wfd__case:focus-visible { outline: none; box-shadow: 3px 3px 0 var(--ink-shadow); transform: translate(-1px, -1px); }
.wfd__case[aria-pressed="true"] { background: var(--accent-peach); box-shadow: 3px 3px 0 var(--ink-shadow); }
.wfd__case-label { font-family: var(--font-mono); font-size: clamp(10.5px, 1.35cqw, 12px); line-height: 1.4; }
.wfd__case-tag {
  font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--ink-muted); flex-shrink: 0;
}
.wfd__case[aria-pressed="true"] .wfd__case-tag { color: var(--ink-body); }

/* Stage 02 — the rule that fired for the current pick. */
.wfd__rule {
  margin: 0; font-family: var(--font-mono); font-size: clamp(11px, 1.4cqw, 12.5px);
  line-height: 1.55; color: var(--canvas-page); opacity: 0.9;
}
.wfd__badge {
  margin-top: auto; align-self: flex-start; display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent-green);
}
.wfd__badge::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--accent-green); }

/* Stage 03 — what came out. */
.wfd__out { display: flex; flex-direction: column; gap: 6px; }
.wfd__line { margin: 0; font-size: clamp(11.5px, 1.5cqw, 13.5px); line-height: 1.5; color: var(--ink-body); }
.wfd__status {
  margin-top: auto; align-self: flex-start; padding: 5px 11px;
  border: 2px solid var(--ink-border); border-radius: 999px;
  background: var(--accent-green); color: var(--ink-body);
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
}
/* A hand-off or a deliberate skip is not a send, and must not be dressed as one. */
.wfd__stage--out.is-held .wfd__status { background: var(--accent-peach); }


.wfd__wire { align-self: center; position: relative; width: 34px; height: 3px; background: var(--ink-border); opacity: 0.32; }
.wfd__bead {
  position: absolute; top: 50%; left: 0; width: 13px; height: 13px; border-radius: 50%;
  background: var(--accent-green); border: 2px solid var(--ink-border);
  transform: translate(-50%, -50%); opacity: 0;
}
.wfd__bead { animation: wfd-bead 0.62s var(--ease) 1; }
.wfd__wire--b .wfd__bead { animation-delay: 0.16s; }
@keyframes wfd-bead {
  0%   { left: 0;    opacity: 0; }
  18%  { opacity: 1; }
  82%  { left: 100%; opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@container (max-width: 700px) {
  .wfd__grid { grid-template-columns: 1fr; }
  .wfd__wire { width: 3px; height: 26px; justify-self: center; }
  .wfd__bead { left: 50%; top: 0; }
  .wfd__bead { animation-name: wfd-bead-v; }
  @keyframes wfd-bead-v {
    0%   { top: 0;    opacity: 0; }
    18%  { opacity: 1; }
    82%  { top: 100%; opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
}

@media (prefers-reduced-motion: reduce) {
  .wfd__case { transition: none; }
  .wfd__bead { animation: none; }
  .wfd__bead { opacity: 1; left: 50%; }
}
`;

export default function WorkflowDemo({ projectKey }: { projectKey: string }) {
  const { lang } = useLang();
  const wf = getWorkflow(projectKey, lang);
  const graph = getWorkflowGraph(projectKey);
  const count = wf?.cases.length ?? 0;
  const { index, pick, playing, toggle, ref } = useDemoPlayer(count);

  if (!wf) return null;
  const active = wf.cases[index] ?? wf.cases[0];

  return (
    <div className="wfd" ref={ref} role="group" aria-label={wf.s1title}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <p className="wfd__hint">{wf.hint}</p>

      <DemoPlayerBar
        count={count}
        index={index}
        playing={playing}
        onToggle={toggle}
        onPick={pick}
        labels={wf.cases.map((x) => x.label)}
      />

      {/* The canvas answers "what is this thing made of", the three stages below
          answer "what does it decide". A client who has seen an n8n or Make
          board reads the first picture instantly; the three stages are what
          convinces them the judgement is worth paying for. Both, in that order. */}
      {graph && (
        <WorkflowCanvas
          graph={graph}
          activePath={graph.paths[active.id] ?? []}
          playing={playing}
        />
      )}

      <div className="wfd__grid">
        <div className="wfd__stage">
          <span className="wfd__cap">01 · {wf.s1}</span>
          <h3 className="wfd__title">{wf.s1title}</h3>
          <div className="wfd__cases">
            {wf.cases.map((c, n) => (
              <button
                key={c.id}
                type="button"
                className="wfd__case"
                aria-pressed={n === index}
                onClick={() => pick(n)}
              >
                <span className="wfd__case-label">{c.label}</span>
                <span className="wfd__case-tag">{c.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="wfd__wire wfd__wire--a" aria-hidden="true"><span className="wfd__bead" key={index} /></div>

        <div className="wfd__stage wfd__stage--rule">
          <span className="wfd__cap">02 · {wf.s2}</span>
          <h3 className="wfd__title">{wf.s2title}</h3>
          <p className="wfd__rule dpl-swap" key={index}>{active.rule}</p>
          <span className="wfd__badge">{wf.badge}</span>
        </div>

        <div className="wfd__wire wfd__wire--b" aria-hidden="true"><span className="wfd__bead" key={index} /></div>

        <div className={`wfd__stage wfd__stage--out${active.held ? " is-held" : ""}`}>
          <span className="wfd__cap">03 · {wf.s3}</span>
          <h3 className="wfd__title">{wf.s3title}</h3>
          <div className="wfd__out dpl-swap" key={index} aria-live="polite">
            {active.out.map((line) => (
              <p key={line} className="wfd__line">{line}</p>
            ))}
          </div>
          <span className="wfd__status dpl-swap" key={`s${index}`}>{active.status}</span>
        </div>
      </div>
    </div>
  );
}
