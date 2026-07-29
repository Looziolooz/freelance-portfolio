"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { useLang } from "./LangProvider";

// GDPR / ePrivacy consent gate. The only non-essential technology on the site is
// Vercel's cookieless analytics — we still load it ONLY after explicit consent,
// which is the conservative, defensible stance. Choice is stored in localStorage
// (no cookie), so the banner is shown once. Essential storage (theme, language,
// login session) is exempt and always allowed.
type Consent = "accepted" | "rejected";
const KEY = "cookie-consent-v1";

export default function CookieConsent() {
  const { t } = useLang();
  const [consent, setConsent] = useState<Consent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(KEY);
    if (saved === "accepted" || saved === "rejected") setConsent(saved);
  }, []);

  const choose = (c: Consent) => {
    try { localStorage.setItem(KEY, c); } catch { /* private mode */ }
    setConsent(c);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Analytics loads only with consent. */}
      {consent === "accepted" && <Analytics />}

      {consent === null && (
        <div className="cookie-banner" role="dialog" aria-live="polite" aria-label={t("cookie.title")}>
          <div className="cookie-banner__inner">
            <p className="cookie-banner__text">
              {t("cookie.banner")}{" "}
              <a href="/cookie">{t("cookie.link")}</a>
            </p>
            <div className="cookie-banner__actions">
              <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => choose("rejected")}>
                {t("cookie.reject")}
              </button>
              <button type="button" className="cookie-btn cookie-btn--primary" onClick={() => choose("accepted")}>
                {t("cookie.accept")}
              </button>
            </div>
          </div>

          <style>{`
            .cookie-banner {
              position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
              display: flex; justify-content: center;
              padding: clamp(10px, 2vw, 18px);
              pointer-events: none;
            }
            .cookie-banner__inner {
              pointer-events: auto;
              display: flex; flex-wrap: wrap; align-items: center; gap: 14px;
              max-width: 900px; width: 100%;
              padding: 14px 16px;
              background: var(--canvas-panel-yellow); color: var(--ink-body);
              border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
              box-shadow: var(--shadow-card);
            }
            .cookie-banner__text {
              margin: 0; flex: 1 1 320px; min-width: 0;
              font-family: var(--font-ui); font-size: 13.5px; line-height: 1.5; color: var(--ink-body);
            }
            .cookie-banner__text a { color: var(--accent-green-deep); text-underline-offset: 3px; }
            .cookie-banner__actions { display: flex; gap: 10px; flex-shrink: 0; }
            .cookie-btn {
              font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .02em;
              padding: 9px 16px; border: 2px solid var(--ink-border); border-radius: var(--radius);
              cursor: pointer; white-space: nowrap;
            }
            .cookie-btn--ghost { background: var(--canvas-page); color: var(--ink-body); }
            .cookie-btn--primary { background: var(--accent-green); color: var(--btn-ink); box-shadow: 3px 3px 0 var(--ink-shadow); }
            .cookie-btn--primary:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--ink-shadow); }
            @media (max-width: 560px) {
              .cookie-banner__actions { width: 100%; }
              .cookie-btn { flex: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
