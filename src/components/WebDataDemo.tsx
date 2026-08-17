"use client";

import { useLang } from "./LangProvider";
import { getWebDataDemo } from "@/lib/service-demos";
import { DemoPlayerBar, useDemoPlayer } from "./DemoPlayer";

// "Web data" made visible.
//
// The service is abstract until someone sees the artefact, so the artefact is
// the demo: public listings go in, an ordered sheet comes out, and under it the
// three lines that are the actual reason to want the sheet. A visitor who has
// never commissioned data work can tell in four seconds whether this is useful
// to them, which no paragraph about "raccolta e organizzazione dati" achieves.
//
// The rows are labelled a sample rather than dressed as a real market study, and
// the summary lines describe the full set the sheet came from, not the five rows
// on screen — the count is stated so nobody reads five as the total.
const CSS = `
.wdd { container-type: inline-size; }
.wdd__hint { margin: 0 0 14px; font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.04em; line-height: 1.55; color: var(--ink-muted); max-width: 70ch; }
.wdd__picks { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: clamp(15px, 1.9vw, 20px); }
.wdd__pick {
  display: inline-flex; align-items: baseline; gap: 9px; padding: 8px 13px; cursor: pointer; font: inherit;
  border: 2px solid var(--ink-border); border-radius: var(--radius);
  background: var(--canvas-page); color: var(--ink-body);
  font-family: var(--font-mono); font-size: 11.5px;
  transition: transform 0.16s var(--ease), box-shadow 0.16s var(--ease), background 0.16s var(--ease);
}
.wdd__pick:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--ink-shadow); }
.wdd__pick:focus-visible { outline: none; box-shadow: 3px 3px 0 var(--ink-shadow); transform: translate(-1px, -1px); }
.wdd__pick[aria-pressed="true"] { background: var(--accent-green); color: var(--btn-ink); box-shadow: 3px 3px 0 var(--ink-shadow); }
.wdd__pick-n { font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); }
.wdd__pick[aria-pressed="true"] .wdd__pick-n { color: var(--btn-ink); }

.wdd__rule { display: flex; align-items: flex-start; gap: 10px; margin: 0 0 clamp(15px, 1.9vw, 20px); padding: 12px 15px; border: 2px solid var(--ink-border); border-radius: var(--radius); background: var(--ground-deep); }
.wdd__rule::before { content: "→"; flex: none; color: var(--accent-green); font-family: var(--font-mono); }
.wdd__rule p { margin: 0; font-family: var(--font-mono); font-size: 12px; line-height: 1.5; color: var(--canvas-page); opacity: 0.92; }

/* The sheet. Given a real grid look — header band, ruled rows, monospaced
   figures — because "it comes out as a spreadsheet" is the single fact the
   buyer needs, and a prose description of a spreadsheet never lands. */
.wdd__sheet { border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--canvas-page); box-shadow: var(--shadow-card); overflow: hidden; }
.wdd__sheet-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 11px 15px; border-bottom: 2px solid var(--ink-border); background: var(--canvas-panel-grey); }
.wdd__sheet-t { margin: 0; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-green-deep); }
.wdd__sheet-n { font-family: var(--font-mono); font-size: 10.5px; color: var(--ink-muted); }
.wdd__scroll { overflow-x: auto; }
.wdd__table { width: 100%; border-collapse: collapse; min-width: 460px; }
.wdd__table th {
  text-align: left; padding: 9px 15px; border-bottom: 2px solid var(--ink-border);
  font-family: var(--font-mono); font-size: 9.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted);
}
.wdd__table td { padding: 10px 15px; border-bottom: 1.5px solid color-mix(in oklch, var(--ink-border) 16%, transparent); font-size: 13.5px; line-height: 1.4; color: var(--ink-body); }
.wdd__table tr:last-child td { border-bottom: 0; }
.wdd__table td:nth-child(3) { font-family: var(--font-mono); font-size: 12px; white-space: nowrap; }
.wdd__flag { display: inline-block; padding: 2px 8px; border: 1.5px solid var(--ink-border); border-radius: 999px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
/* The absence of a site is the opportunity this sheet exists to find, so it is
   the value that gets the accent, not the presence. */
.wdd__flag--no { background: var(--accent-green); color: var(--btn-ink); }
.wdd__flag--yes { background: transparent; color: var(--ink-muted); }

.wdd__findings { margin: clamp(15px, 1.9vw, 20px) 0 0; padding: clamp(15px, 1.7vw, 20px); border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--canvas-panel-yellow); box-shadow: var(--shadow-card); }
.wdd__findings-t { margin: 0 0 10px; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-green-deep); }
.wdd__findings ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 9px; }
.wdd__findings li { padding: 8px 13px; border: 2px solid var(--ink-border); border-radius: var(--radius); background: var(--canvas-page); font-size: 13.5px; line-height: 1.35; color: var(--ink-body); }

.wdd__note { margin: 14px 0 0; font-family: var(--font-mono); font-size: 11px; line-height: 1.6; color: var(--ink-muted); max-width: 74ch; }

@media (prefers-reduced-motion: reduce) { .wdd__pick { transition: none; } }
`;

export default function WebDataDemo() {
  const { lang } = useLang();
  const c = getWebDataDemo(lang);
  const { index: picked, pick, playing, toggle, ref } = useDemoPlayer(c.cases.length);

  const k = c.cases[picked] ?? c.cases[0];

  return (
    <div className="wdd" ref={ref} role="group" aria-label={c.s3}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <p className="wdd__hint">{c.hint}</p>

      <DemoPlayerBar
        count={c.cases.length}
        index={picked}
        playing={playing}
        onToggle={toggle}
        onPick={pick}
        labels={c.cases.map((x) => x.label)}
      />

      <div className="wdd__picks">
        {c.cases.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className="wdd__pick"
            aria-pressed={i === picked}
            onClick={() => pick(i)}
          >
            <span>{x.label}</span>
            <span className="wdd__pick-n">{x.tag}</span>
          </button>
        ))}
      </div>

      <div className="wdd__rule dpl-swap" key={`r${picked}`}>
        <p>{k.rule}</p>
      </div>

      <div className="wdd__sheet dpl-swap" key={`s${picked}`}>
        <div className="wdd__sheet-head">
          <h4 className="wdd__sheet-t">{c.s3}</h4>
          <span className="wdd__sheet-n">{k.tag}</span>
        </div>
        <div className="wdd__scroll">
          <table className="wdd__table">
            <thead>
              <tr>
                <th scope="col">{c.colName}</th>
                <th scope="col">{c.colArea}</th>
                <th scope="col">{c.colRating}</th>
                <th scope="col">{c.colSite}</th>
              </tr>
            </thead>
            <tbody>
              {k.rows.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td>{r.area}</td>
                  <td>{r.rating}</td>
                  <td>
                    <span className={`wdd__flag wdd__flag--${r.site ? "yes" : "no"}`}>
                      {r.site ? c.yes : c.no}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="wdd__findings dpl-swap" key={`f${picked}`}>
        <h4 className="wdd__findings-t">{c.findingsTitle}</h4>
        <ul>
          {k.findings.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <p className="wdd__note">{c.disclaimer}</p>
    </div>
  );
}
