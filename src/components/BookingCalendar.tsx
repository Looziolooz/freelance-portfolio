"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

// Lightweight "book a discovery call" widget: pick a weekday + a slot, leave
// name/email, and it composes a mailto — zero backend, costs nothing (honours
// the "free" constraint). Swap the submit for a Cal.com/Calendly link later.
const SLOTS = ["09:00", "11:00", "14:00", "16:30"];
const EMAIL = "hello@Lorenzo.studio";

type Day = { key: string; dow: string; dom: string };

export default function BookingCalendar() {
  const { t, lang } = useLang();
  const [days, setDays] = useState<Day[]>([]);
  const [day, setDay] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Build the next 10 weekdays on the client (avoids SSR/hydration date drift).
  useEffect(() => {
    const locale = lang === "sv" ? "sv-SE" : lang === "en" ? "en-GB" : "it-IT";
    const out: Day[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (out.length < 10) {
      const wd = d.getDay();
      if (wd !== 0 && wd !== 6) {
        out.push({
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
          dow: d.toLocaleDateString(locale, { weekday: "short" }),
          dom: d.toLocaleDateString(locale, { day: "2-digit", month: "short" }),
        });
      }
      d.setDate(d.getDate() + 1);
    }
    setDays(out);
  }, [lang]);

  const ready = day && slot && name.trim() && email.trim();

  const book = () => {
    if (!ready) return;
    const subject = `${t("booking.subject")} — ${day} ${slot}`;
    const body =
      `${t("booking.body.intro")}\n\n` +
      `${t("booking.f.name")}: ${name}\n` +
      `${t("booking.f.email")}: ${email}\n` +
      `${t("booking.f.when")}: ${day} · ${slot} (CET)`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bk">
      <div className="bk-block">
        <span className="bk-label">{t("booking.pickday")}</span>
        <div className="bk-days">
          {days.map((d) => (
            <button
              key={d.key}
              type="button"
              className={`bk-day ${day === d.key ? "is-on" : ""}`}
              onClick={() => setDay(d.key)}
            >
              <span className="bk-day__dow">{d.dow}</span>
              <span className="bk-day__dom">{d.dom}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bk-block">
        <span className="bk-label">{t("booking.pickslot")}</span>
        <div className="bk-slots">
          {SLOTS.map((s) => (
            <button key={s} type="button" className={`bk-slot ${slot === s ? "is-on" : ""}`} onClick={() => setSlot(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bk-fields">
        <input className="bk-input" type="text" placeholder={t("booking.f.name")} value={name} onChange={(e) => setName(e.target.value)} />
        <input className="bk-input" type="email" placeholder={t("booking.f.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <button type="button" className="bk-submit neo-btn neo-btn--primary" onClick={book} disabled={!ready}>
        {t("booking.cta")} <span aria-hidden="true">→</span>
      </button>
      <p className="bk-note">{t("booking.note")}</p>
    </div>
  );
}
