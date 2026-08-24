"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import BookingCalendar from "@/components/BookingCalendar";
import LeadMagnet from "@/components/LeadMagnet";
import { useLang } from "@/components/LangProvider";
import { submitLead } from "@/lib/leadForm";

const EMAIL = "hello@looz.design";

export default function ContattiPage() {
  const { t } = useLang();
  const [fullname, setFullname] = useState("");
  const [workemail, setWorkemail] = useState("");
  const [website, setWebsite] = useState("");
  // Optional on purpose: a required budget field is the fastest way to lose a
  // good lead who has never bought a site before, which is why the last option
  // is "non lo so ancora". It still qualifies everyone who does have a figure.
  const [budget, setBudget] = useState("");
  const [describe, setDescribe] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const mailtoFallback = () => {
    const subject = t("contatti.inquiry.subject");
    const body =
      `${t("contatti.inquiry.intro")}\n\n` +
      `${t("contatti.f.fullname")}: ${fullname}\n` +
      `${t("contatti.f.workemail")}: ${workemail}\n` +
      `${t("contatti.f.website")}: ${website}\n` +
      `${t("contatti.f.budget")}: ${budget || "—"}\n\n` +
      `${t("contatti.f.describe")}:\n${describe}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const honey = String(new FormData(e.currentTarget).get("_honey") ?? "");
    setStatus("sending");
    const ok = await submitLead({
      subject: t("contatti.inquiry.subject"),
      from_name: `LOoz.design · contatti — ${fullname || "—"}`,
      replyto: workemail,
      name: fullname,
      email: workemail,
      website,
      honey,
      message:
        `${t("contatti.inquiry.intro")}\n\n` +
        `${t("contatti.f.fullname")}: ${fullname}\n` +
        `${t("contatti.f.workemail")}: ${workemail}\n` +
        `${t("contatti.f.website")}: ${website}\n` +
        `${t("contatti.f.budget")}: ${budget || "—"}\n\n` +
        `${t("contatti.f.describe")}:\n${describe}`,
    });
    if (ok) {
      setStatus("done");
    } else {
      setStatus("idle");
      mailtoFallback();
    }
  };

  return (
    <>
      <Nav />
      <main
        className="container"
        style={{ paddingTop: "calc(var(--topbar-h) + clamp(44px, 7vw, 96px))", paddingBottom: "clamp(70px, 9vw, 130px)" }}
      >
        <header className="ct-head">
          <span className="ct-kicker">{t("contatti.num")}</span>
          <h1 className="ct-title">{t("contatti.title")}</h1>
          <p className="ct-sub">{t("contatti.sub")}</p>
          {/* Visible, copyable email + response promise at the point of action
              (the mailto-only path lost leads on machines without a mail client). */}
          <p style={{ margin: "14px 0 0", fontSize: "var(--fs-base)", color: "var(--ink-muted)" }}>
            {t("contatti.email.line")}{" "}
            <a href={`mailto:${EMAIL}`} style={{ color: "var(--accent-green-deep)", fontWeight: 600 }}>
              {EMAIL}
            </a>
            {" "}· {t("contatti.email.reply")}
          </p>
        </header>

        {/* The nav CTA promises a free audit — so the audit form comes FIRST,
            before the higher-commitment project/call cards (SEO/SXO audit). */}
        <LeadMagnet />

        <div className="ct-grid">
          {/* Way 1 — project inquiry */}
          <div className="ct-card">
            <h2 className="ct-card__title">{t("contatti.way1.title")}</h2>
            <p className="ct-card__body">{t("contatti.way1.body")}</p>
            {status === "done" ? (
              <div
                role="status"
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, padding: "18px 0" }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: "50%",
                    background: "var(--accent-green-deep)", color: "var(--canvas-page)",
                    fontSize: 22, fontWeight: 700, border: "2px solid var(--ink-border)",
                  }}
                >
                  ✓
                </span>
                <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink-body)" }}>
                  {t("lead.done")}
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-muted)" }}>
                  {t("lead.done.sub")}
                </p>
              </div>
            ) : (
              <form onSubmit={send} className="ct-form">
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="lead-hp" />
                <input name="fullname" className="ct-input" type="text" required placeholder={t("contatti.f.fullname")} value={fullname} onChange={(e) => setFullname(e.target.value)} />
                <input name="workemail" className="ct-input" type="email" required placeholder={t("contatti.f.workemail")} value={workemail} onChange={(e) => setWorkemail(e.target.value)} />
                <input name="website" className="ct-input" type="text" placeholder={t("contatti.f.website")} value={website} onChange={(e) => setWebsite(e.target.value)} />
                <span className="ct-select">
                  <select
                    className="ct-input"
                    aria-label={t("contatti.f.budget")}
                    name="budget"
                    data-empty={budget === "" ? "true" : "false"}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    <option value="">{t("contatti.f.budget")}</option>
                    {t("contatti.f.budget.opts").split("|").map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </span>
                <textarea name="describe" className="ct-input ct-textarea" required rows={4} placeholder={t("contatti.f.describe")} value={describe} onChange={(e) => setDescribe(e.target.value)} />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="neo-btn neo-btn--primary"
                  style={{ alignSelf: "flex-start", padding: "13px 26px", fontSize: 15, opacity: status === "sending" ? 0.65 : 1, cursor: status === "sending" ? "wait" : "pointer" }}
                >
                  {t("contatti.way1.cta")} <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
          </div>

          {/* Way 2 — book a discovery call */}
          <div className="ct-card">
            <h2 className="ct-card__title">{t("contatti.way2.title")}</h2>
            <p className="ct-card__body">{t("contatti.way2.body")}</p>
            <BookingCalendar />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
