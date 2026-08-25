"use client";

import { useLang } from "./LangProvider";
import { isPreLaunch, HIDDEN_ROUTES } from "@/lib/launch";
import { LAUNCH_LINKS, SECTION_LINKS, SERVICE_LINKS } from "@/lib/site-links";
import Wordmark from "./Wordmark";

// The plain footer, for the pages the cinematic one deliberately skips.
//
// Why it exists. `CinematicFooter` is a fixed curtain-reveal that closes a page
// with a large call to action, and /work says in a comment that repeating those
// CTAs after the gallery would be noise. That reasoning is right about the CTAs
// and it threw out everything else with them: measured against a production
// build, SIX page groups shipped with no `<footer>` element at all — /work,
// /agents, /work/[slug] (every project page, twenty-three of them), /blog,
// /membership and /componenti.
//
// Two consequences, and only one of them is about search:
//
//   1. `/privacy` and `/cookie` were unreachable from those pages. For an
//      Italian-market site that is a compliance problem, not a preference.
//   2. The project pages are the ones that carry the brand manuals, the live
//      demos and the whole proof of the work — precisely what a person or a
//      model lands on from a search result. They offered no path onward to a
//      service, a price or a way to make contact.
//
// No CTA, because that was the sound reason the cinematic footer skipped these
// pages. Everything else matches the cinematic footer on purpose: same warm
// near-black ground, same literal colour tokens, the mark and the term band.
// The owner asked why the footer differed page to page, and the honest answer
// was that only the CTA needed to differ; the rest now does not.
export default function SiteFooter() {
  const { t } = useLang();

  // Stessa fonte dell'altro footer (site-links): un elenco solo, mai piu' due
  // liste gemelle che divergono. Niente /contatti qui: la colonna contatti gia'
  // ci punta, e la stringa nav.contact e' minuscola per la barra.
  const sections: { href: string; label: string }[] = [...SECTION_LINKS, ...LAUNCH_LINKS]
    .map((l) => ({ href: l.href, label: t(l.labelKey) }))
    .filter((s) => !(isPreLaunch && (HIDDEN_ROUTES as readonly string[]).includes(s.href)));

  return (
    <footer className="sfoot" aria-label="LO.oz">
      <div className="container sfoot__inner">
        <nav className="sfoot__col" aria-label={t("footer.services")}>
          <h2 className="sfoot__h">{t("footer.services")}</h2>
          <ul className="sfoot__list">
            {SERVICE_LINKS.map((s) => (
              <li key={s.href}>
                <a href={s.href}>{t(s.labelKey)}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="sfoot__col" aria-label={t("footer.discover")}>
          <h2 className="sfoot__h">{t("footer.discover")}</h2>
          <ul className="sfoot__list">
            {sections.map((s) => (
              <li key={s.href}>
                <a href={s.href}>{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sfoot__col">
          <h2 className="sfoot__h">{t("nav.contact")}</h2>
          <ul className="sfoot__list">
            <li>
              <a href="mailto:hello@looz.design">hello@looz.design</a>
            </li>
            <li>
              <a href="/contatti">{t("footer.book")}</a>
            </li>
            <li>
              <a href="/chi-sono">{t("chisono.label")}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container sfoot__bar">
        <Wordmark className="sfoot__mark" />
        <span>{t("contact.footer.copy")}</span>
        <span>{t("contact.footer.made")}</span>
        <span className="sfoot__legal">
          <a href="/privacy">{t("nav.privacy")}</a>
          <a href="/cookie">{t("nav.cookie")}</a>
        </span>
      </div>

      <style>{`
        /* Same four literal tokens as the cinematic footer, for the same
           reason it has them: the page tokens swap in dark mode, and the
           footer's black must stay black in both themes. */
        .sfoot {
          --cf-ground: #1B1813;
          --cf-ink: #F4F1EA;
          --cf-muted: #A89E8B;
          --cf-line: rgba(244, 241, 234, 0.22);
          margin-top: clamp(48px, 7vw, 96px);
          border-top: 3px solid var(--ink-border);
          background: var(--cf-ground);
          color: var(--cf-ink);
          font-family: var(--font-ui);
        }
        .sfoot__inner {
          display: grid; gap: clamp(24px, 4vw, 56px);
          grid-template-columns: 1fr;
          padding-top: clamp(30px, 4vw, 52px);
          padding-bottom: clamp(24px, 3vw, 38px);
        }
        .sfoot__col { min-width: 0; }
        /* A real heading per column: three link lists with no names read as one
           undifferentiated pile to anything that is not looking at the page. */
        .sfoot__h {
          margin: 0 0 12px; font-family: var(--font-mono); font-size: 10.5px;
          font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--cf-muted);
        }
        .sfoot__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 9px; }
        /* color declared on hover too: the global a:hover repaints links
           forest, which on this ground is black-on-black (same lesson as the
           cinematic footer's Servizi links). */
        .sfoot__list a {
          font-size: 14.5px; line-height: 1.4; color: var(--cf-ink);
          text-decoration: none; border-bottom: 1.5px solid transparent;
          transition: border-color 0.16s var(--ease), color 0.16s var(--ease);
        }
        .sfoot__list a:hover,
        .sfoot__list a:focus-visible { color: var(--accent-green); border-bottom-color: var(--accent-green); }

        .sfoot__bar {
          display: flex; flex-wrap: wrap; align-items: center; gap: 10px 22px;
          padding-top: 16px; padding-bottom: clamp(22px, 3vw, 34px);
          border-top: 1px solid var(--cf-line);
          font-family: var(--font-mono); font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--cf-muted);
        }
        /* The mark, at bar size. Its dot is the one piece of colour in the name
           (see Wordmark) and --wordmark-dot already carries it, so nothing is
           restyled here beyond the size. */
        /* Sul fondo scuro la pastiglia si rovescia: niente carta chiara sotto
           il nome, bordo e ombra presi dall'inchiostro chiaro del footer. */
        .sfoot__mark {
          background: transparent;
          border-color: var(--cf-ink);
          box-shadow: 3px 3px 0 color-mix(in srgb, var(--cf-ink) 34%, transparent);
        }
        .sfoot__mark .wm-stamp__suffix {
          color: var(--cf-muted);
          border-left-color: color-mix(in srgb, var(--cf-ink) 30%, transparent);
        }
        .sfoot__mark {
          font-family: var(--font-display); font-weight: 600; font-size: 17px;
          letter-spacing: -0.01em; text-transform: none; color: var(--cf-ink);
          margin-right: 4px;
        }
        .sfoot__legal { display: flex; gap: 16px; }
        .sfoot__bar a { color: var(--cf-muted); text-decoration: none; }
        .sfoot__bar a:hover,
        .sfoot__bar a:focus-visible { color: var(--accent-green-deep); }

        @media (min-width: 720px) {
          .sfoot__inner { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}</style>
    </footer>
  );
}
