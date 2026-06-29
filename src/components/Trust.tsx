"use client";

import Link from "next/link";
import { useLang } from "./LangProvider";
import { TESTIMONIALS } from "@/lib/testimonials";

// Trust signals — honest reassurances only (no invented testimonials/logos).
// Real client quotes, when there are any, come from lib/testimonials.ts and
// render below; the block stays hidden while that list is empty.
const POINTS = ["own", "price", "speed", "lang"] as const;

function PointIcon({ k }: { k: (typeof POINTS)[number] }) {
  const p = {
    width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
    stroke: "var(--accent-green-deep)", strokeWidth: 2,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
  };
  switch (k) {
    case "own": // key (ownership, no lock-in)
      return (<svg {...p}><circle cx="8" cy="8" r="4" /><path d="M11 11l8 8M16 16l2-2M18.5 18.5l1.5-1.5" /></svg>);
    case "price": // tag (price agreed up front)
      return (<svg {...p}><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z" /><circle cx="8" cy="8" r="1.4" fill="var(--accent-green-deep)" stroke="none" /></svg>);
    case "speed": // clock (24h reply)
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
    case "lang": // globe (Stockholm, 3 languages)
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><ellipse cx="12" cy="12" rx="4" ry="9" /></svg>);
    default:
      return null;
  }
}

export default function Trust() {
  const { t } = useLang();
  return (
    <section id="perche" className="trust" aria-label={t("trust.title")}>
      <header className="trust-head">
        <span className="trust-eyebrow">{t("trust.eyebrow")}</span>
        <h2 className="trust-title">{t("trust.title")}</h2>
        <p className="trust-sub">{t("trust.sub")}</p>
      </header>

      <ul className="trust-grid">
        {POINTS.map((k) => (
          <li key={k} className="trust-card">
            <span className="trust-card__ic"><PointIcon k={k} /></span>
            <h3 className="trust-card__t">{t(`trust.${k}.title`)}</h3>
            <p className="trust-card__d">{t(`trust.${k}.desc`)}</p>
          </li>
        ))}
      </ul>

      {TESTIMONIALS.length > 0 && (
        <div className="trust-testi">
          {TESTIMONIALS.map((x, i) => (
            <figure key={i} className="trust-quote">
              <blockquote className="trust-quote__q">“{x.quote}”</blockquote>
              <figcaption className="trust-quote__c">
                {x.name}
                {x.role ? <span className="trust-quote__role"> — {x.role}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <Link href="/work" className="trust-proof">
        {t("trust.cta")} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
