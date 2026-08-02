"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "./LangProvider";
import { useAuth } from "./auth/AuthProvider";
import { isPreLaunch } from "@/lib/launch";
import type { Lang } from "@/i18n";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();
  const pathname = usePathname();

  // On the homepage (full-bleed hero) the menu stays hidden until the first
  // scroll; on other pages it stays visible so navigation is always reachable.
  const hideTop = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const langs: { k: Lang; label: string }[] = [
    { k: "it", label: "IT" },
    { k: "en", label: "EN" },
    { k: "sv", label: "SV" },
  ];

  const BORDER = "3px solid var(--ink-border)";

  return (
    <div className={`topbar${scrolled ? " is-scrolled" : ""}${hideTop ? " is-hidden" : ""}${pathname === "/agents" ? " topbar--onyellow" : ""}`}>
      <div className="topbar__inner">
        {/* Wordmark */}
        <a href="/" className="wordmark-link">
          {t("nav.logo.before")}<span className="accent">{t("nav.logo.dot")}</span>{t("nav.logo.after")}
        </a>

        {/* Desktop nav links */}
        <div
          className={`topbar__nav nav-links ${menuOpen ? "open" : ""}`}
        >
          <a href="/work" onClick={() => setMenuOpen(false)}>{t("nav.work")}</a>
          <a href="/processo" onClick={() => setMenuOpen(false)}>{t("nav.process")}</a>
          <a href="/agents" onClick={() => setMenuOpen(false)}>{t("nav.agents")}</a>
          {/* Persistent conversion CTA — the free audit is the funnel's entry
              point, so it stays reachable from every page. */}
          <a
            href="/contatti"
            className="neo-btn neo-btn-sm neo-btn--primary"
            style={{
              textDecoration: "none",
              color: "var(--btn-ink)", // .topbar__nav a would win the cascade otherwise
              padding: "6px 16px",
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.cta")} <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
          {/* Pre-launch: blog, components shop, memberships and auth stay hidden
              (flip LAUNCH_MODE in lib/launch.ts to reveal them). */}
          {!isPreLaunch && (
            <>
              <a href="/blog" onClick={() => setMenuOpen(false)}>{t("nav.blog")}</a>
              <a href="/componenti" onClick={() => setMenuOpen(false)}>{t("nav.components")}</a>
              <a href="/membership" onClick={() => setMenuOpen(false)}>{t("nav.membership")}</a>
              <a
                href={user ? "/account" : "/login"}
                className="neo-btn neo-btn-sm"
                style={{
                  textDecoration: "none",
                  color: "var(--btn-ink)",
                  padding: "6px 16px",
                  fontSize: 13,
                }}
                onClick={() => setMenuOpen(false)}
              >
                {user ? t("nav.account") : t("nav.login")}
              </a>
            </>
          )}

          {/* Mobile-only: language switcher lives here since the desktop locale
              extras are hidden below 768px. */}
          <div className="nav-mobile-extras" style={{ display: "none" }}>
            {langs.map((l) => (
              <button
                key={l.k}
                onClick={() => { setLang(l.k); }}
                className="status-pill"
                style={{
                  border: BORDER,
                  fontFamily: "var(--font-mono)",
                  background: lang === l.k ? "var(--accent-peach)" : "var(--canvas-panel-yellow)",
                }}
                aria-label={`${t("nav.lang." + l.k)}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right extras */}
        <div className="topbar__right nav-locale-extras">
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="status-pill"
              style={{ border: BORDER, fontFamily: "var(--font-mono)" }}
              aria-label="Lingua"
            >
              {t(`nav.lang.${lang}`)}
            </button>
            {langOpen && (
              <div
                className="neo-panel-cream"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 6px)",
                  border: BORDER,
                  borderRadius: "var(--radius)",
                  padding: 4,
                  boxShadow: "6px 6px 0 var(--ink-shadow)",
                  minWidth: 130,
                  zIndex: 60,
                }}
              >
                {langs.map((l) => (
                  <button
                    key={l.k}
                    onClick={() => { setLang(l.k); setLangOpen(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      width: "100%",
                      border: lang === l.k ? BORDER : "3px solid transparent",
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      background: lang === l.k ? "var(--accent-peach)" : "transparent",
                      fontSize: 12,
                      fontFamily: "var(--font-ui)",
                      color: "var(--ink-body)",
                      textAlign: "left",
                      fontWeight: lang === l.k ? 600 : 400,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{l.label}</span>
                    <span style={{ marginLeft: "auto", color: "var(--ink-muted)" }}>{t(`lang.${l.k}`)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "var(--accent-peach)",
            border: BORDER,
            borderRadius: "var(--radius)",
            color: "var(--btn-ink)",
            cursor: "pointer",
            fontSize: 18,
            padding: "6px 10px",
            boxShadow: "4px 4px 0 var(--ink-shadow)",
          }}
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </div>
  );
}
