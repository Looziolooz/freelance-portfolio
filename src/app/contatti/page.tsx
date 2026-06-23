"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import BookingCalendar from "@/components/BookingCalendar";
import { useLang } from "@/components/LangProvider";

const EMAIL = "hello@lorenzo.studio";

export default function ContattiPage() {
  const { t } = useLang();
  const [fullname, setFullname] = useState("");
  const [workemail, setWorkemail] = useState("");
  const [website, setWebsite] = useState("");
  const [describe, setDescribe] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = t("contatti.inquiry.subject");
    const body =
      `${t("contatti.inquiry.intro")}\n\n` +
      `${t("contatti.f.fullname")}: ${fullname}\n` +
      `${t("contatti.f.workemail")}: ${workemail}\n` +
      `${t("contatti.f.website")}: ${website}\n\n` +
      `${t("contatti.f.describe")}:\n${describe}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
        </header>

        <div className="ct-grid">
          {/* Way 1 — project inquiry */}
          <div className="ct-card">
            <h2 className="ct-card__title">{t("contatti.way1.title")}</h2>
            <p className="ct-card__body">{t("contatti.way1.body")}</p>
            <form onSubmit={send} className="ct-form">
              <input className="ct-input" type="text" required placeholder={t("contatti.f.fullname")} value={fullname} onChange={(e) => setFullname(e.target.value)} />
              <input className="ct-input" type="email" required placeholder={t("contatti.f.workemail")} value={workemail} onChange={(e) => setWorkemail(e.target.value)} />
              <input className="ct-input" type="text" placeholder={t("contatti.f.website")} value={website} onChange={(e) => setWebsite(e.target.value)} />
              <textarea className="ct-input ct-textarea" required rows={4} placeholder={t("contatti.f.describe")} value={describe} onChange={(e) => setDescribe(e.target.value)} />
              <button type="submit" className="neo-btn neo-btn--primary" style={{ alignSelf: "flex-start", padding: "13px 26px", fontSize: 15 }}>
                {t("contatti.way1.cta")} <span aria-hidden="true">→</span>
              </button>
            </form>
          </div>

          {/* Way 2 — book a discovery call */}
          <div className="ct-card">
            <h2 className="ct-card__title">{t("contatti.way2.title")}</h2>
            <p className="ct-card__body">{t("contatti.way2.body")}</p>
            <BookingCalendar />
          </div>
        </div>
      </main>
      <CinematicFooter />
    </>
  );
}
