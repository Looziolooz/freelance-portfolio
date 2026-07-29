"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";
import { submitLead } from "@/lib/leadForm";

// Lead magnet: a free site audit in exchange for an email. The form sends the
// lead by email via Web3Forms (see lib/leadForm) and shows an inline thank-you.
// If no backend key is configured (or the request fails) it falls back to a
// prefilled mailto, so a lead is never lost. Honest offer: a real audit within 24h.
const CONTACT = "hello@lorenzo.studio";

export default function LeadMagnet() {
  const { t } = useLang();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const mailtoFallback = () => {
    const subject = encodeURIComponent(t("lead.mail.subject"));
    const body = encodeURIComponent(
      `${t("lead.mail.body")}\n\n${t("lead.url")}: ${url}\n${t("lead.email")}: ${email}`,
    );
    window.location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const ok = await submitLead({
      subject: `Audit gratuito richiesto — ${url}`,
      from_name: "lorenzo.studio · audit",
      replyto: email,
      email,
      site: url,
      message: `Richiesta di audit gratuito del sito.\n\nSito: ${url}\nEmail: ${email}`,
    });
    if (ok) {
      setStatus("done");
    } else {
      // No backend configured (or a network error) — never drop the lead.
      setStatus("idle");
      mailtoFallback();
    }
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

        {status === "done" ? (
          <div
            className="lead-form"
            role="status"
            style={{ alignItems: "center", justifyContent: "center", textAlign: "center", gap: 12, minHeight: 220 }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: "50%",
                background: "var(--accent-green-deep)", color: "var(--canvas-page)",
                fontSize: 22, fontWeight: 700, border: "2px solid var(--ink-border)",
              }}
            >
              ✓
            </span>
            <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--ink-body)" }}>
              {t("lead.done")}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-muted)" }}>
              {t("lead.done.sub")}
            </p>
          </div>
        ) : (
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
            <button
              type="submit"
              disabled={status === "sending"}
              className="neo-btn neo-btn-lg neo-btn--primary lead-btn"
              style={{ opacity: status === "sending" ? 0.65 : 1, cursor: status === "sending" ? "wait" : "pointer" }}
            >
              {t("lead.btn")} <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
            <p className="lead-note">{t("lead.note")}</p>
          </form>
        )}
      </div>
    </section>
  );
}
