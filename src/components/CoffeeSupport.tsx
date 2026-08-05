"use client";

import { useLang } from "./LangProvider";
import { COFFEE_URL, isSupportEnabled } from "@/lib/support";

// Tip jar shown at the END of free content — never before it. Two sizes:
// `inline` closes an article, `compact` is a quiet line for sidebars/footers.
//
// Renders nothing at all while support is off (src/lib/support.ts), so it can
// ship now and go live with a one-line flip.
const CSS = `
.cof {
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-panel-yellow); box-shadow: 6px 6px 0 var(--ink-shadow);
  padding: clamp(22px, 3.4vw, 34px); margin: clamp(34px, 5vw, 56px) 0 0;
  display: flex; gap: clamp(16px, 2.5vw, 28px); align-items: center; flex-wrap: wrap;
}
.cof__cup { flex-shrink: 0; width: 56px; height: 56px; display: grid; place-items: center;
  border: 3px solid var(--ink-border); border-radius: 50%; background: var(--canvas-page);
  box-shadow: 3px 3px 0 var(--ink-shadow); }
.cof__cup svg { width: 27px; height: 27px; display: block; }
.cof__body { flex: 1 1 260px; min-width: 0; }
.cof__title { font-family: var(--font-display); font-size: clamp(19px, 2.2vw, 24px); font-weight: 600;
  letter-spacing: -0.01em; margin: 0 0 6px; color: var(--ink-body); }
.cof__sub { margin: 0; font-size: 14.5px; line-height: 1.55; color: var(--ink-muted); }
.cof__btn { flex-shrink: 0; }

.cof--compact { padding: 0; margin: 22px 0 0; border: none; background: none; box-shadow: none; gap: 10px; }
.cof--compact .cof__cup { width: 34px; height: 34px; font-size: 17px; border-width: 2px; box-shadow: 2px 2px 0 var(--ink-shadow); }
.cof--compact .cof__title { font-size: 15px; margin: 0; }
.cof--compact .cof__sub { display: none; }
`;

export default function CoffeeSupport({ variant = "inline" }: { variant?: "inline" | "compact" }) {
  const { t } = useLang();
  if (!isSupportEnabled) return null;

  return (
    <aside className={`cof${variant === "compact" ? " cof--compact" : ""}`} aria-label={t("coffee.title")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* Drawn, not an emoji: renders identically everywhere and keeps the
          ink-stroke language of the rest of the site. */}
      <span className="cof__cup" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-body)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
          <path d="M17 10.5h1.6a2.4 2.4 0 0 1 0 4.8H17" />
          <path d="M8 5.4c0-.9.9-1.2.9-2.1M12 5.4c0-.9.9-1.2.9-2.1" stroke="var(--accent-green-deep)" />
        </svg>
      </span>
      <div className="cof__body">
        <p className="cof__title">{t("coffee.title")}</p>
        <p className="cof__sub">{t("coffee.sub")}</p>
      </div>
      <a
        href={COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="neo-btn neo-btn--primary cof__btn"
        style={{ textDecoration: "none", color: "var(--btn-ink)", padding: "12px 22px", fontSize: 14.5 }}
      >
        {t("coffee.cta")} <span className="btn-arrow" aria-hidden="true">→</span>
      </a>
    </aside>
  );
}
