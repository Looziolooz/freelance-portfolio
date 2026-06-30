"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";

// Lead magnet: a free site audit in exchange for an email. Zero-cost capture —
// submitting opens a prefilled email to hello@Lorenzo.studio, so the lead lands
// in the inbox with no backend. (Swap the submit for Formspree/Tally later for a
// real list.) Honest offer: a quick, genuine audit reply within 24h.
const CONTACT = "hello@Lorenzo.studio";

export default function LeadMagnet() {
  const { t } = useLang();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(t("lead.mail.subject"));
    const body = encodeURIComponent(`${t("lead.mail.body")}\n\n${t("lead.url")}: ${url}\n${t("lead.email")}: ${email}`);
    window.location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="audit" className="lead" aria-label={t("lead.title")}>
      <div className="lead-inner">
        <div className="lead-copy">
          <SectionHeader eyebrow={t("lead.eyebrow")} title={t("lead.title")} sub={t("lead.sub")} tone="ink" />
          <ul className="lead-list">
            <li>{t("lead.b1")}</li>
            <li>{t("lead.b2")}</li>
            <li>{t("lead.b3")}</li>
          </ul>
        </div>

        <form className="lead-form" onSubmit={onSubmit}>
          <label className="lead-field">
            <span className="lead-field__label">{t("lead.url")}</span>
            <input
              type="url"
              required
              inputMode="url"
              placeholder="https://iltuosito.it"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="lead-input"
            />
          </label>
          <label className="lead-field">
            <span className="lead-field__label">{t("lead.email")}</span>
            <input
              type="email"
              required
              inputMode="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lead-input"
            />
          </label>
          <button type="submit" className="neo-btn neo-btn-lg neo-btn--primary lead-btn">
            {t("lead.btn")} <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
          <p className="lead-note">{t("lead.note")}</p>
        </form>
      </div>
    </section>
  );
}
