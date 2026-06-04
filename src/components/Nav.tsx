"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { useLang } from "./LangProvider";
import { useAuth } from "./auth/AuthProvider";
import type { Lang } from "@/i18n";

export default function Nav() {
  const [t2, setT2] = useState(Date.now());
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();

  useEffect(() => {
    const id = setInterval(() => setT2(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const hhmm = new Date(t2).toLocaleTimeString(lang === "sv" ? "sv-SE" : lang === "en" ? "en-GB" : "it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Stockholm",
  });

  const langs: { k: Lang; label: string }[] = [
    { k: "it", label: "IT" },
    { k: "en", label: "EN" },
    { k: "sv", label: "SV" },
  ];

  const BORDER = "3px solid var(--ink-border)";

  return (
    <div className="topbar">
      <div className="topbar__inner">
        {/* Wordmark */}
        <a href="/" className="wordmark-link">
          {t("nav.logo.before")}<span className="accent">{t("nav.logo.dot")}</span>{t("nav.logo.after")}
        </a>

        {/* Desktop nav links */}
        <div
          className={`topbar__nav nav-links ${menuOpen ? "open" : ""}`}
        >
          <a href="/#work" onClick={() => setMenuOpen(false)}>{t("nav.work")}</a>
          <a href="/agents" onClick={() => setMenuOpen(false)}>{t("nav.agents")}</a>
          <a href="/blog" onClick={() => setMenuOpen(false)}>{t("nav.blog")}</a>
          <a href="/membership" onClick={() => setMenuOpen(false)}>{t("nav.membership")}</a>
          <a
            href={user ? "/account" : "/login"}
            className="neo-btn neo-btn-sm"
            style={{
              textDecoration: "none",
              color: "var(--ink-body)",
              padding: "6px 16px",
              fontSize: 13,
            }}
            onClick={() => setMenuOpen(false)}
          >
            {user ? t("nav.account") : t("nav.login")}
          </a>
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

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="status-pill"
              style={{
                border: BORDER,
                fontFamily: "var(--font-ui)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              aria-label={t("nav.theme")}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 0,
                  background: theme === "light" ? "var(--accent-peach)" : "var(--ink-border)",
                  border: "2px solid var(--ink-border)",
                  display: "inline-block",
                }}
              />
              {theme === "light" ? t("nav.theme.light") : t("nav.theme.dark")}
            </button>
            {themeOpen && (
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
                {(["light", "dark"] as const).map((t2) => (
                  <button
                    key={t2}
                    onClick={() => { setTheme(t2); setThemeOpen(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      width: "100%",
                      border: theme === t2 ? BORDER : "3px solid transparent",
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      background: theme === t2 ? "var(--accent-peach)" : "transparent",
                      fontSize: 12,
                      fontFamily: "var(--font-ui)",
                      color: "var(--ink-body)",
                      textAlign: "left",
                      fontWeight: theme === t2 ? 600 : 400,
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 0,
                        background: t2 === "light" ? "var(--canvas-page)" : "var(--ink-border)",
                        border: "2px solid var(--ink-border)",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    {t2 === "light" ? t("nav.theme.light") : t("nav.theme.dark")}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
            {t("nav.sto")} · {hhmm}
          </span>
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "var(--accent-peach)",
            border: BORDER,
            borderRadius: "var(--radius)",
            color: "var(--ink-body)",
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
