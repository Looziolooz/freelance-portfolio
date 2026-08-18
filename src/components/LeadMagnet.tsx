"use client";

import { useRef, useState } from "react";
import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";
import { submitLead } from "@/lib/leadForm";

// The URL field needs a full http(s) address. Browsers treat a bare "iltuosito.it"
// as a valid type=url value (they auto-prepend http:// during validation), so the
// native check never fires and a scheme-less address goes out as a broken link.
// Validate it here and tell the visitor exactly what's missing.
const isFullUrl = (v: string) => /^https?:\/\/\S+$/i.test(v.trim());

// Lead magnet: a free site audit in exchange for an email. The form sends the
// lead via the in-house /api/lead route (see lib/leadForm) and shows an inline
// thank-you. If no backend key is configured (or the request fails) it falls
// back to a prefilled mailto, so a lead is never lost. Honest offer: a real
// audit within 24h.
const CONTACT = "hello@looz.design";

export default function LeadMagnet() {
  const { t } = useLang();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [urlBlurred, setUrlBlurred] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const urlRef = useRef<HTMLInputElement>(null);

  const urlInvalid = url.trim() !== "" && !isFullUrl(url);
  const showUrlWarn = urlInvalid && urlBlurred;

  const mailtoFallback = () => {
    const subject = encodeURIComponent(t("lead.mail.subject"));
    const body = encodeURIComponent(
      `${t("lead.mail.body")}\n\n${t("lead.url")}: ${url}\n${t("lead.email")}: ${email}`,
    );
    window.location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    if (urlInvalid) {
      setUrlBlurred(true);
      urlRef.current?.focus();
      return;
    }
    const honey = String(new FormData(e.currentTarget).get("_honey") ?? "");
    setStatus("sending");
    const ok = await submitLead({
      subject: `Audit gratuito richiesto — ${url}`,
      from_name: "LOoz.design · audit",
      replyto: email,
      email,
      site: url,
      honey,
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
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="lead-hp" />
            <label className="lead-field">
              <span className="lead-field__label">{t("lead.url")}</span>
              <input
                ref={urlRef}
                type="url"
                required
                inputMode="url"
                placeholder="https://iltuosito.it"
                value={url}
                aria-invalid={urlInvalid || undefined}
                aria-describedby={urlInvalid ? "lead-url-warn" : undefined}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={() => setUrlBlurred(true)}
                className="lead-input"
              />
              {showUrlWarn && (
                <p id="lead-url-warn" className="lead-warn" role="alert">
                  {t("lead.url.warn")}
                </p>
              )}
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
