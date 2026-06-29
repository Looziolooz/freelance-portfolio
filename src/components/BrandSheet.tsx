"use client";

import { useLang } from "./LangProvider";
import { Monogram, Motif, BrandPalette, Stationery } from "./BrandKit";
import type { BrandKit as Kit } from "@/lib/brand-kits";

// Print-ready brand sheet (A4) for a project. Rendered at /work/[slug]/brand-sheet
// and printed to PDF via the browser. Reuses the shared BrandKit pieces. Brand
// colours are scoped via --bk-* vars; print-color-adjust keeps fills in the PDF.
export default function BrandSheet({ kit }: { kit: Kit }) {
  const { t } = useLang();
  const vars = {
    ["--bk-paper"]: kit.paper,
    ["--bk-ink"]: kit.ink,
    ["--bk-primary"]: kit.primary,
    ["--bk-accent"]: kit.accent,
  } as React.CSSProperties;

  return (
    <div className="bsheet" style={vars}>
      {/* Page 1 — cover */}
      <section className="bsheet-page bsheet-cover" style={{ background: kit.primary, color: kit.paper }}>
        <span className="bsheet-cover__kicker">{t("brandkit.sheet.title")}</span>
        <div className="bsheet-cover__mark"><Monogram kit={kit} variant="reverse" size={156} /></div>
        <h1 className="bsheet-cover__name" style={{ fontFamily: kit.display, letterSpacing: kit.tracking }}>{kit.name}</h1>
        <p className="bsheet-cover__tag">{kit.tagline}</p>
        <span className="bsheet-cover__domain" style={{ borderTop: `2px solid ${kit.accent}` }}>{kit.domain}</span>
      </section>

      {/* Page 2 — marks, palette, type */}
      <section className="bsheet-page" style={{ background: kit.paper, color: kit.ink }}>
        <h2 className="bsheet-h" style={{ color: kit.primary, fontFamily: kit.display }}>{t("brandkit.monogram")}</h2>
        <div className="bk-marks">
          <div className="bk-mark-cell" style={{ background: kit.paper }}><Monogram kit={kit} variant="solid" size={108} /></div>
          <div className="bk-mark-cell" style={{ background: kit.ink }}><Monogram kit={kit} variant="reverse" size={80} /></div>
          <div className="bk-mark-cell" style={{ background: kit.paper }}><Monogram kit={kit} variant="outline" size={80} /></div>
          <div className="bk-mark-cell bk-mark-cell--word" style={{ background: kit.paper }}>
            <span style={{ display: "inline-flex", color: kit.accent }}><Motif name={kit.motif} size={26} /></span>
            <span className="bk-wordmark" style={{ fontFamily: kit.display, letterSpacing: kit.tracking, color: kit.ink }}>{kit.name}</span>
          </div>
        </div>

        <h2 className="bsheet-h" style={{ color: kit.primary, fontFamily: kit.display }}>{t("brandkit.palette")}</h2>
        <BrandPalette kit={kit} />

        <h2 className="bsheet-h" style={{ color: kit.primary, fontFamily: kit.display }}>{t("brandkit.type")}</h2>
        <div className="bsheet-type">
          <span className="bsheet-type__display" style={{ fontFamily: kit.display }}>Aa Bb Cc Dd · {kit.monogram}</span>
          <span className="bsheet-type__body" style={{ fontFamily: kit.body }}>
            The quick brown fox jumps over the lazy dog — 0123456789
          </span>
        </div>
      </section>

      {/* Page 3 — stationery */}
      <section className="bsheet-page" style={{ background: kit.paper, color: kit.ink }}>
        <h2 className="bsheet-h" style={{ color: kit.primary, fontFamily: kit.display }}>{t("brandkit.stationery")}</h2>
        <Stationery kit={kit} />
        <span className="bsheet-foot">{kit.name} · {kit.domain} · {t("brandkit.sheet.title")}</span>
      </section>

      <style>{`
        .bsheet { --sheet-w: 210mm; max-width: var(--sheet-w); margin: 0 auto; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bsheet-page {
          width: 100%;
          min-height: 0;
          padding: clamp(20px, 4vw, 40px);
          border: 1px solid var(--line, #ddd);
          border-radius: 10px;
          margin: 0 0 18px;
          box-shadow: 0 8px 30px rgba(0,0,0,.10);
        }
        .bsheet-h { margin: 26px 0 14px; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
        .bsheet-page > .bsheet-h:first-child { margin-top: 0; }

        .bsheet-cover { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 14px; }
        .bsheet-cover__kicker { font-family: var(--font-mono); font-size: 11px; letter-spacing: .28em; text-transform: uppercase; opacity: .75; }
        .bsheet-cover__mark { margin: 6px 0; }
        .bsheet-cover__name { margin: 0; font-size: clamp(34px, 6vw, 58px); font-weight: 600; line-height: 1.02; }
        .bsheet-cover__tag { margin: 0; font-size: 15px; opacity: .9; }
        .bsheet-cover__domain { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; padding-top: 12px; margin-top: 8px; }

        .bsheet-type { display: flex; flex-direction: column; gap: 10px; padding: 18px; border: 2px solid currentColor; border-radius: 10px; }
        .bsheet-type__display { font-size: clamp(28px, 5vw, 44px); font-weight: 600; line-height: 1; }
        .bsheet-type__body { font-size: 16px; opacity: .82; }
        .bsheet-foot { display: block; margin-top: 22px; font-family: var(--font-mono); font-size: 10px; letter-spacing: .08em; opacity: .6; }

        .bsheet-bar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px clamp(16px, 4vw, 32px); background: var(--canvas-page); border-bottom: 3px solid var(--ink-border); }
        .bsheet-bar a, .bsheet-bar button { font-family: var(--font-ui); font-size: 14px; cursor: pointer; text-decoration: none; }
        .bsheet-bar a { color: var(--ink-body); }
        .bsheet-bar button { border: 3px solid var(--ink-border); border-radius: var(--radius); background: var(--accent-green); color: var(--btn-ink); padding: 9px 18px; box-shadow: 4px 4px 0 var(--ink-shadow); }

        @page { size: A4; margin: 12mm; }
        @media print {
          .bsheet-bar { display: none !important; }
          .topbar, .wayfinding-nav, .assistant-fab { display: none !important; }
          .bsheet-page { break-inside: avoid; break-after: page; border: none; border-radius: 0; box-shadow: none; margin: 0; padding: 0; }
          .bsheet-page:last-child { break-after: auto; }
          .bsheet-cover { min-height: 240mm; }
        }
      `}</style>
    </div>
  );
}
