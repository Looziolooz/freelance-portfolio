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
// Order is deliberate: the two build services first (highest intent, highest
// figure), then the two automation ones, then the two subscriptions last. A
// reader scanning the price column meets the numbers descending, so the
// monthly figures land as relief rather than as another cost.
// `proof` is the demo that already exists for that service. The page had a real
// trust gap — zero evidence next to any figure — and the honest fix was never
// testimonials (there are none, deliberately) but the work itself, which was
// sitting two clicks away with nothing pointing at it from here. Landing pages
// have no demo yet, so that card carries no link rather than a hollow one.
const SERVICES: { k: string; n: string; monthly?: boolean; proof?: string }[] = [
  { k: "ecom", n: "01", proof: "/work/pizzeria-restaurant" },
  { k: "landing", n: "02" },
  { k: "autom", n: "03", proof: "/work/solleciti-pagamento" },
  { k: "agent", n: "04", proof: "/work/assistente-whatsapp" },
  { k: "visib", n: "05", monthly: true, proof: "/work/audit-visibilita" },
  { k: "content", n: "06", monthly: true, proof: "/work/contenuti-social" },
];

const FAQ = ["1", "2", "3", "4"];

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
              other: readers could not tell whether the monthly replaced the build or came
              after it. Shown as its own tier, the order answers that by itself. */}
          <div className="prz-tiers prz-tiers--three">
            {/* The web build is flagged as the recommended tier: the rubric's
                "no anchor" gap was real — three cards with no entry point means
                the eye picks by price alone, and the cheapest thing on the page
                is a 25€ subscription that is not the product. */}
            <div className="prz-tier prz-tier--rec">
              <span className="prz-tier__badge">{t("prezzi.rec")}</span>
              <h3 className="prz-tier__name">{t("home.eng.web.title")}</h3>
              <p className="prz-tier__for"><em>{t("prezzi.forLabel")}</em> {t("prezzi.for.web")}</p>
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
              <p className="prz-tier__for"><em>{t("prezzi.forLabel")}</em> {t("prezzi.for.monthly")}</p>
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
              <p className="prz-tier__for"><em>{t("prezzi.forLabel")}</em> {t("prezzi.for.retainer")}</p>
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

        {/* Everything the studio sells that is NOT the website.
            This page was titled "quanto costa, scritto qui" while answering for
            one service out of the six on the homepage: a visitor arriving from
            the e-commerce or the AI-agent cell found the promise and no figure.
            Starting points only, per the hybrid we settled on — a published
            floor filters the enquiries that were never going to fit, and the
            final number still comes out of the call. */}
        <section className="prz-sec" aria-label={t("prezzi.svc.title")}>
          <h2 className="prz-sec__title">{t("prezzi.svc.title")}</h2>
          <p className="prz-lead">{t("prezzi.svc.sub")}</p>
          {/* Each card carries a three-row spec table. A bare figure invites the
              question it cannot answer ("why that number, and what makes it go
              up?"), which is the question that would otherwise arrive by email
              before anyone books a call. Answering it on the page turns the
              price from an assertion into a rule the reader can apply to their
              own case. */}
          <div className="prz-svcs">
            {SERVICES.map(({ k, n, monthly, proof }) => (
              <article key={k} className="prz-svc">
                <span className="prz-svc__n">{n}</span>
                <h3 className="prz-svc__name">{t(`prezzi.svc.${k}.title`)}</h3>
                <p className="prz-svc__scope">{t(`prezzi.svc.${k}.scope`)}</p>
                <p className="prz-svc__for"><em>{t("prezzi.forLabel")}</em> {t(`prezzi.svc.${k}.for`)}</p>

                <dl className="prz-svc__spec">
                  {(["inc", "time", "driver"] as const).map((row) => (
                    <div key={row} className="prz-svc__row">
                      <dt>{t(`prezzi.svc.l.${row}`)}</dt>
                      <dd>{t(`prezzi.svc.${k}.${row}`)}</dd>
                    </div>
                  ))}
                </dl>

                <p className="prz-svc__price">
                  <span className="prz-svc__from">{t("prezzi.svc.from")}</span>
                  <span className="prz-svc__fig">{t(`prezzi.svc.${k}.price`)}</span>
                  {monthly && <span className="prz-svc__per">{t("prezzi.svc.permonth")}</span>}
                </p>
                {proof && (
                  <a className="prz-svc__proof" href={proof}>
                    {t("prezzi.svc.proof")} <span aria-hidden="true">→</span>
                  </a>
                )}
              </article>
            ))}
          </div>
          <p className="plans-costnote">{t("prezzi.svc.note")}</p>
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

        {/* The four objections that otherwise arrive by email before anyone
            books. Answering them on the page also gives an AI assistant fetching
            /prezzi something to quote for "can I cancel" and "what if I leave",
            which it previously could not find anywhere on this URL. */}
        <section className="prz-sec" aria-label={t("prezzi.faq.title")}>
          <h2 className="prz-sec__title">{t("prezzi.faq.title")}</h2>
          <dl className="prz-faq">
            {FAQ.map((n) => (
              <div key={n} className="prz-faq__row">
                <dt>{t(`prezzi.faq.q${n}`)}</dt>
                <dd>{t(`prezzi.faq.a${n}`)}</dd>
              </div>
            ))}
          </dl>
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
