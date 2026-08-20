"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "./LangProvider";
import Wordmark from "./Wordmark";
import { useAuth } from "./auth/AuthProvider";
import { isPreLaunch } from "@/lib/launch";
import { DISCIPLINES } from "@/lib/disciplines";
import type { Lang } from "@/i18n";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();
  const pathname = usePathname();

  // The bar stays on screen everywhere, homepage included. It used to hide over
  // the full-bleed hero until the first scroll, which looked good and left a
  // visitor who had gone three pages deep with no way back except the browser
  // button. Being able to leave a page is worth more than an uninterrupted hero.
  const hideTop = false;

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

  // Any navigation folds both the drawer and the submenu, so returning to a page
  // never finds the menu half-open from last time.
  const closeAll = () => { setMenuOpen(false); setSubOpen(false); };

  return (
    /* <header> e non <div>: cosi la barra diventa un punto di riferimento
       della pagina (banner), e il marchio piu le voci smettono di essere
       contenuto orfano per chi naviga per landmark. */
    <header className={`topbar${scrolled ? " is-scrolled" : ""}${hideTop ? " is-hidden" : ""}${pathname === "/agents" ? " topbar--onyellow" : ""}`}>
      <div className="topbar__inner">
        {/* Wordmark */}
        <a href="/" className="wordmark-link">
          <Wordmark />
        </a>

        {/* Desktop nav links */}
        <div
          className={`topbar__nav nav-links ${menuOpen ? "open" : ""}`}
        >
          {/* "Servizi" carries the four disciplines: the submenu now sits under
              the word that sells, and "Lavori" is a plain link to the archive. The panel opens on hover and
              on focus-within, so it is reachable by keyboard without any state;
              below 768px the whole nav is already a stacked column and the panel
              simply sits inline under its parent (see globals.css). */}
          <div className={`nav-sub${subOpen ? " is-open" : ""}`}>
            <a href={"/servizi/" + DISCIPLINES[0].slug} onClick={closeAll}>
              {t("nav.services")}
            </a>
            {/* The caret is a button, not decoration: on a touch screen there is
                no hover to open with, and "Lavori" itself has to stay a link to
                the page. So the word navigates and the caret unfolds. */}
            <button
              type="button"
              className="nav-sub__caret"
              aria-expanded={subOpen}
              aria-controls="nav-sub-panel"
              aria-label={t("nav.services")}
              onClick={() => setSubOpen((v) => !v)}
            >
              <span aria-hidden="true">▾</span>
            </button>
            {/* The inner wrapper exists for the mobile fold: collapsing a grid
                row from 0fr to 1fr animates on the compositor, and that trick
                needs exactly one child to clip. */}
            <div className="nav-sub__panel" id="nav-sub-panel">
              <div className="nav-sub__inner">
                {DISCIPLINES.map((d) => (
                  <a key={d.id} href={`/servizi/${d.slug}`} onClick={closeAll}>
                    {t(`${d.key}.label`)}
                    <span className="nav-sub__arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a href="/work" onClick={closeAll}>{t("nav.work")}</a>
          <a href="/processo" onClick={closeAll}>{t("nav.process")}</a>
          <a href="/prezzi" onClick={closeAll}>{t("nav.pricing")}</a>
          <a href="/agents" onClick={closeAll}>{t("nav.agents")}</a>
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
            onClick={closeAll}
          >
            {t("nav.cta")} <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
          {/* Pre-launch: blog, components shop, memberships and auth stay hidden
              (flip LAUNCH_MODE in lib/launch.ts to reveal them). */}
          {!isPreLaunch && (
            <>
              <a href="/blog" onClick={closeAll}>{t("nav.blog")}</a>
              <a href="/componenti" onClick={closeAll}>{t("nav.components")}</a>
              <a href="/membership" onClick={closeAll}>{t("nav.membership")}</a>
              <a
                href={user ? "/account" : "/login"}
                className="neo-btn neo-btn-sm"
                style={{
                  textDecoration: "none",
                  color: "var(--btn-ink)",
                  padding: "6px 16px",
                  fontSize: 13,
                }}
                onClick={closeAll}
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
          onClick={() => { setMenuOpen(!menuOpen); setSubOpen(false); }}
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
    </header>
  );
}
