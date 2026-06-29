"use client";

import { useLang } from "./LangProvider";

// Objection-handling FAQ. Native <details>/<summary> = accessible, zero JS, and
// the page stays usable without scripts. Keys live under faq.<id>.q / .a.
const QUESTIONS = ["price", "time", "small", "risk", "own", "where", "after"] as const;

export default function Faq() {
  const { t } = useLang();
  return (
    <section id="faq" className="faq" aria-label={t("faq.title")}>
      <header className="faq-head">
        <span className="faq-eyebrow">{t("faq.eyebrow")}</span>
        <h2 className="faq-title">{t("faq.title")}</h2>
      </header>

      <div className="faq-list">
        {QUESTIONS.map((q) => (
          <details key={q} className="faq-item" name="faq">
            <summary className="faq-q">
              <span>{t(`faq.${q}.q`)}</span>
              <span className="faq-mark" aria-hidden="true" />
            </summary>
            <div className="faq-a">
              <p>{t(`faq.${q}.a`)}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
