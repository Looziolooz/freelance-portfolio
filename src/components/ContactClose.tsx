"use client";

import Link from "next/link";
import { useLang } from "./LangProvider";
import BookingCalendar from "./BookingCalendar";

// Homepage closer (carries #contact): "Book a live discovery" + the booking
// calendar, plus a "Let's talk" that leads to the fuller /contatti form page.
export default function ContactClose() {
  const { t } = useLang();
  return (
    <section id="contact" className="cc">
      <div className="cc-inner">
        <div className="cc-head">
          <span className="cc-eyebrow">{t("contact.kicker")}</span>
          <h2 className="cc-title">{t("contact.title")}</h2>
          <p className="cc-sub">{t("contact.sub")}</p>
        </div>

        <BookingCalendar />

        <div className="cc-alt">
          <span className="cc-alt__or">{t("contact.or")}</span>
          <Link href="/contatti" className="neo-btn neo-btn-lg" style={{ textDecoration: "none", padding: "13px 26px", fontSize: 15, background: "var(--canvas-panel-yellow)", color: "var(--ink-body)" }}>
            {t("contact.lets")} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
