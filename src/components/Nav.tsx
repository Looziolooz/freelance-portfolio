"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { useLang } from "./LangProvider";
import type { Lang } from "@/i18n";

export default function Nav() {
  const [t2, setT2] = useState(Date.now());
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLang();

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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        letterSpacing: 0.4,
        background: "color-mix(in oklch, var(--bg) 80%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <a
        href="#top"
        style={{ color: "var(--fg)", textDecoration: "none", fontWeight: 500 }}
      >
        LD<span style={{ color: "var(--muted)" }}>.</span>portfolio
      </a>

      <div
        className={`nav-links ${menuOpen ? "open" : ""}`}
        style={{ display: "flex", gap: 28, color: "var(--fg)" }}
      >
        <a href="#work" style={{ color: "inherit", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
          {t("nav.work")}
        </a>
        <a href="#about" style={{ color: "inherit", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
          {t("nav.about")}
        </a>
        <a href="#stack" style={{ color: "inherit", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
          {t("nav.stack")}
        </a>
        <a href="#contact" style={{ color: "inherit", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
          {t("nav.contact")}
        </a>
      </div>

      <div
        className="nav-locale-extras"
        style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--muted)" }}
      >
        {/* Language */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              background: "none",
              border: "1px solid var(--line)",
              borderRadius: 999,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--fg)",
            }}
            aria-label="Lingua"
          >
            {t(`nav.lang.${lang}`)}
          </button>
          {langOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                background: "var(--bg)",
                border: "1px solid var(--line)",
                borderRadius: 6,
                padding: 4,
                boxShadow: "0 12px 24px -8px color-mix(in oklch, var(--fg) 20%, transparent)",
                minWidth: 130,
              }}
            >
              {langs.map((l) => (
                <button
                  key={l.k}
                  onClick={() => {
                    setLang(l.k);
                    setLangOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    background: lang === l.k ? "var(--panel)" : "transparent",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: "var(--fg)",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: lang === l.k ? "var(--accent)" : "var(--line)",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span>{t(`lang.${l.k}`)}</span>
                  <span style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 10 }}>
                    {l.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            style={{
              background: "none",
              border: "1px solid var(--line)",
              borderRadius: 999,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--fg)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            aria-label={t("nav.theme")}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
              }}
            />
            {theme === "light" ? t("nav.theme.light") : t("nav.theme.dark")}
          </button>
          {themeOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                background: "var(--bg)",
                border: "1px solid var(--line)",
                borderRadius: 6,
                padding: 4,
                boxShadow: "0 12px 24px -8px color-mix(in oklch, var(--fg) 20%, transparent)",
                minWidth: 130,
              }}
            >
              {(["light", "dark"] as const).map((t2) => (
                <button
                  key={t2}
                  onClick={() => {
                    setTheme(t2);
                    setThemeOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    border: theme === t2 ? "1px solid var(--fg)" : "1px solid transparent",
                    borderRadius: 4,
                    cursor: "pointer",
                    background: theme === t2 ? "var(--panel)" : "transparent",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: "var(--fg)",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: t2 === "light" ? "#FEFDDF" : "#0A1931",
                      border: `1px solid ${t2 === "light" ? "#2D3A3A" : "#EFEFEF"}`,
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

        <span>
          {t("nav.sto")} · {hhmm}
        </span>
      </div>

      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: "none",
          border: "none",
          color: "var(--fg)",
          cursor: "pointer",
          fontSize: 18,
          padding: 4,
        }}
        aria-label="Menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </div>
  );
}
