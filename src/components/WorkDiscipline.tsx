"use client";

import Link from "next/link";
import Nav from "./Nav";
import ProjectGallery from "./ProjectGallery";
import ScrollProgress from "./ScrollProgress";
import ContactClose from "./ContactClose";
import SiteFooter from "./SiteFooter";
import { useLang } from "./LangProvider";
import { DISCIPLINES, disciplineProjects, type Discipline } from "@/lib/disciplines";

// One page per discipline, all of them built from here. The header states what the
// discipline is, the grid shows only that discipline's work, and the dark band
// at the bottom carries the others so a visitor who landed on Marketing can
// step sideways instead of back.

const CSS = `
.wd-count {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-body);
  opacity: 0.6;
}

/* Second line under a card: the brand manual, on the branding page. */
.pg-second {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  margin-top: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-green-deep);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--accent-green-deep) 34%, transparent);
  padding-bottom: 2px;
  transition: color 0.25s var(--ease), border-color 0.25s var(--ease);
}
.pg-second:hover,
.pg-second:focus-visible {
  color: var(--accent-green-deep);
  border-color: var(--accent-green-deep);
}


/* The other disciplines, on the dark ground the skills list uses. */
.wd-more {
  --wd-ground: #1B1813;
  --wd-ink: #F4F1EA;
  --wd-dim: #A89E8B;
  background: var(--wd-ground);
  color: var(--wd-ink);
  border-top: 3px solid var(--ink-border);
  padding: clamp(40px, 6vw, 88px) 0;
  margin-top: clamp(40px, 6vw, 96px);
}
.wd-more__label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--wd-dim);
  display: block;
  margin-bottom: clamp(16px, 2.5vw, 28px);
}
.wd-more__list { list-style: none; margin: 0; padding: 0; }
.wd-more__item + .wd-more__item { border-top: 1px solid rgba(244, 241, 234, 0.14); }
.wd-more__link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 18px;
  padding: clamp(12px, 1.8vw, 20px) 0;
  text-decoration: none;
  color: var(--wd-ink);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(24px, 4vw, 44px);
  letter-spacing: -0.01em;
  transition: color 0.3s var(--ease);
}
/* The name steps right on hover, the count stays put. Moving it with a
   transform rather than padding keeps the row off the layout path. */
.wd-more__name { display: inline-block; transition: transform 0.3s var(--ease); }
.wd-more__link:hover .wd-more__name,
.wd-more__link:focus-visible .wd-more__name { transform: translateX(12px); }
.wd-more__n {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--wd-dim);
  flex: 0 0 auto;
}
.wd-more__link:focus-visible { outline: 2px solid var(--accent-green); outline-offset: 4px; }

@media (prefers-reduced-motion: reduce) {
  .wd-more__name, .pg-second { transition: none; }
}
`;

export default function WorkDiscipline({ d }: { d: Discipline }) {
  const { t } = useLang();
  const items = disciplineProjects(d);
  const others = DISCIPLINES.filter((o) => o.id !== d.id);


  return (
    <>
      <ScrollProgress />
      <Nav />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header
        className="container"
        style={{ paddingTop: "calc(var(--topbar-h) + clamp(44px, 7vw, 96px))" }}
      >
        <div className="ct-head">
          <Link href="/work" className="ct-kicker" style={{ textDecoration: "none", width: "fit-content" }}>
            {t("nav.work")} ←
          </Link>
          <h1 className="ct-title">{t(`${d.key}.title`)}</h1>
          <p className="ct-sub">{t(`${d.key}.sub`)}</p>
          <span className="wd-count">
            {items.length} {items.length === 1 ? t("disc.one") : t("disc.many")}
          </span>
        </div>
      </header>

      <ProjectGallery items={items} showFilters={false} lead={d.lead} />


      <section className="wd-more" aria-label={t("disc.other")}>
        <div className="container">
          <span className="wd-more__label">{t("disc.other")}</span>
          <ul className="wd-more__list">
            {others.map((o) => (
              <li key={o.id} className="wd-more__item">
                <Link href={`/work/${o.slug}`} className="wd-more__link">
                  <span className="wd-more__name">{t(`${o.key}.label`)}</span>
                  <span className="wd-more__n" aria-hidden="true">
                    {String(disciplineProjects(o).length).padStart(2, "0")} ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactClose />
      <SiteFooter />
    </>
  );
}
