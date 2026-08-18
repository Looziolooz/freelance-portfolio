"use client";

import { useSyncExternalStore, useState } from "react";
import { useLang } from "./LangProvider";
import { submitLead } from "@/lib/leadForm";

// Lightweight "book a discovery call" widget: pick a weekday + a slot, leave
// name/email, and the request goes to hello@looz.design via /api/lead (Brevo
// free SMTP), with a mailto fallback so no request is ever lost. Swap the submit
// for a Cal.com/Calendly link later.
const SLOTS = ["09:00", "11:00", "14:00", "16:30"];
const EMAIL = "hello@looz.design";

type Day = { key: string; dow: string; dom: string };

// Never emits, so the snapshot is read once per mount (same trick as
// useRotation.ts): the server paints an empty grid, then the client fills it,
// which is how a date-dependent value avoids SSR/hydration drift.
const noSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/** The next 10 weekdays (skipping Sat/Sun), formatted for the current locale. */
function buildDays(lang: string): Day[] {
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
  return out;
}

export default function BookingCalendar() {
  const { t, lang } = useLang();
  const [day, setDay] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const mounted = useSyncExternalStore(noSubscribe, onClient, onServer);
  const days = mounted ? buildDays(lang) : [];

  const ready = day && slot && name.trim() && email.trim();

  const book = async () => {
    if (!ready || sent) return;
    const subject = `${t("booking.subject")} — ${day} ${slot}`;
    const body =
      `${t("booking.body.intro")}\n\n` +
      `${t("booking.f.name")}: ${name}\n` +
      `${t("booking.f.email")}: ${email}\n` +
      `${t("booking.f.when")}: ${day} · ${slot} (CET)`;
    const ok = await submitLead({
      subject,
      from_name: `LOoz.design · prenotazione — ${name}`,
      replyto: email,
      email,
      name,
      message: body,
    });
    if (ok) {
      setSent(true);
      return;
    }
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
        <input name="bk-name" className="bk-input" type="text" placeholder={t("booking.f.name")} value={name} onChange={(e) => setName(e.target.value)} />
        <input name="bk-email" className="bk-input" type="email" placeholder={t("booking.f.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <button type="button" className="bk-submit neo-btn neo-btn--primary" onClick={book} disabled={!ready || sent}>
        {sent ? "✓" : `${t("booking.cta")} →`}
      </button>
      {sent ? (
        <p className="bk-note" role="status" style={{ color: "var(--accent-green-deep)", fontWeight: 700 }}>{t("booking.done")}</p>
      ) : (
        <p className="bk-note">{t("booking.note")}</p>
      )}
    </div>
  );
}
