"use client";

import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import MagneticButton from "@/components/MagneticButton";
import { useLang } from "@/components/LangProvider";

// /prezzi — the figures, what they cover, and what happens after you pay.
//
// Split off the homepage on purpose: "Come lavoro" was absorbing the offer, the
// deliverables, the process, hosting options and the add-ons, and would have
// become the longest block on the page, pushing FAQ and contact far down the
// scroll. The homepage keeps the three figures and links here.
//
// Copy is deliverable-level throughout (five pages / SSL / titles and
// descriptions), not activity-level (UX design, CRO): a buyer can count the
// first kind and cannot evaluate the second.
export default function PrezziPage() {
  const { t } = useLang();


  return (
    <>
      <Nav />
      <main className="container prz">
        <header className="prz-head">
          <span className="prz-head__kicker">{t("prezzi.kicker")}</span>
          <h1 className="prz-head__title">{t("prezzi.title")}</h1>
          <p className="prz-head__sub">{t("prezzi.sub")}</p>
          <ul className="plans-signals">
            {t("home.plans.signals").split("|").map((sig) => (
              <li key={sig} className="plans-signals__item">{sig}</li>
            ))}
          </ul>
        </header>

        {/* Offer + the two figures side by side */}
        <section className="prz-sec" aria-label={t("prezzi.offer.title")}>
          <h2 className="prz-sec__title">{t("prezzi.offer.title")}</h2>
          <p className="prz-lead">{t("prezzi.offer.body")}</p>

          {/* Build, then the optional aftercare. The monthly used to live only
              inside a footnote, which left the two offers undefined against each
              other: readers could not tell whether €25 replaced the €300 or came
              after it. Shown as its own tier, the order answers that by itself. */}
          <div className="prz-tiers prz-tiers--three">
            <div className="prz-tier">
              <h3 className="prz-tier__name">{t("home.eng.web.title")}</h3>
              <p className="prz-tier__price">
                {t("home.eng.web.price")}
                <span className="prz-tier__note">{t("home.eng.web.priceNote")}</span>
              </p>
              <ul className="prz-list">
                {t("home.eng.web.features").split("|").map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="prz-tier">
              <h3 className="prz-tier__name">{t("prezzi.monthly.title")}</h3>
              <p className="prz-tier__price">
                {t("prezzi.monthly.price")}
                <span className="prz-tier__note">{t("prezzi.monthly.note")}</span>
              </p>
              <ul className="prz-list">
                {t("prezzi.monthly.items").split("|").map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="prz-tier__plus">{t("prezzi.monthly.plus")}</p>
            </div>

            <div className="prz-tier">
              <h3 className="prz-tier__name">{t("home.eng.retainer.title")}</h3>
              <p className="prz-tier__price">
                {t("home.eng.retainer.price")}
                <span className="prz-tier__note">{t("home.eng.retainer.priceNote")}</span>
              </p>
              <ul className="prz-list">
                {t("home.eng.retainer.features").split("|").map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="plans-costnote">{t("home.plans.costnote")}</p>
        </section>

        {/* How it works */}
        <section className="prz-sec" aria-label={t("home.plans.how.title")}>
          <h2 className="prz-sec__title">{t("home.plans.how.title")}</h2>
          <ol className="plans-how__steps">
            {t("home.plans.how.steps").split("|").map((step, i) => (
              <li key={step} className="plans-how__step">
                <span className="plans-how__n">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Hosting and domain — the two routes, and who pays for what */}
        <section className="prz-sec" aria-label={t("prezzi.hosting.title")}>
          <h2 className="prz-sec__title">{t("prezzi.hosting.title")}</h2>
          <p className="prz-lead">{t("prezzi.hosting.sub")}</p>
          <div className="prz-tiers prz-tiers--two">
            {(["mine", "yours"] as const).map((opt) => (
              <div key={opt} className="prz-tier">
                <h3 className="prz-tier__name">{t(`prezzi.hosting.${opt}.title`)}</h3>
                <ul className="prz-list">
                  {t(`prezzi.hosting.${opt}.items`).split("|").map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="plans-costnote">{t("prezzi.hosting.note")}</p>
        </section>

        {/* Paid add-ons, priced so leaving is a known cost rather than a
            negotiation. Figures converted from the reference at ~11.5 SEK/EUR. */}
        <section className="prz-sec" aria-label={t("prezzi.addon.title")}>
          <h2 className="prz-sec__title">{t("prezzi.addon.title")}</h2>
          <div className="prz-tiers prz-tiers--two">
            {(["move", "domain"] as const).map((a) => (
              <div key={a} className="prz-tier">
                <h3 className="prz-tier__name">{t(`prezzi.addon.${a}.title`)}</h3>
                <p className="prz-tier__price">{t(`prezzi.addon.${a}.price`)}</p>
                <ul className="prz-list">
                  {t(`prezzi.addon.${a}.items`).split("|").map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="plans-costnote">{t("prezzi.addon.note")}</p>
        </section>

        <section className="proc-cta" aria-label={t("prezzi.cta.title")}>
          <h2 className="proc-cta__title">{t("prezzi.cta.title")}</h2>
          <p className="proc-cta__body">{t("prezzi.cta.body")}</p>
          <div className="proc-cta__btns">
            <MagneticButton
              href="/contatti"
              className="neo-btn neo-btn-lg neo-btn--primary"
              style={{ textDecoration: "none", padding: "14px 26px", fontSize: 15 }}
            >
              {t("home.plans.cta")}
              <span className="btn-arrow" aria-hidden="true">→</span>
            </MagneticButton>
          </div>
        </section>
      </main>
      <CinematicFooter />
    </>
  );
}
