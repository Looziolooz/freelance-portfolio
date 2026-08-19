"use client";

import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import MagneticButton from "@/components/MagneticButton";
import { useLang } from "@/components/LangProvider";

// /prezzi — how the cost is decided, what it covers, and what happens after you pay.
//
// The published figures were removed on the owner's call: they were reading as
// too blunt an opening for a studio whose quotes come out of a conversation.
// The page did NOT become "contact me for a quote", which would have been worth
// nothing and would have cost it the ranking it has. Every figure was replaced
// by the thing that decided that figure — page count, integrations, whether the
// copy exists or has to be written, whether it needs a shop, how much ongoing
// help is wanted — so a reader still finishes the page able to place themselves,
// and still knows which of their own decisions moves them up.
//
// Copy is deliverable-level throughout (five pages / SSL / titles and
// descriptions), not activity-level (UX design, CRO): a buyer can count the
// first kind and cannot evaluate the second.
// Order is deliberate: the two build services first (highest intent), then the
// two automation ones, then the two subscriptions last.
// `proof` is the demo that already exists for that service. The page had a real
// trust gap — zero evidence next to any claim — and the honest fix was never
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

// q1 repeated the header ("perche non c'e un listino" IS the page title) and
// q5 repeated the home FAQ's ownership answer. Four remain, each earning its row.
const FAQ = ["2", "3", "4", "6"];

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
          {/* Its own key rather than the homepage's `home.plans.signals`: that
              list opened with "clear price", which is no longer what this page
              promises. It promises a quote before anything starts. */}
          <ul className="plans-signals">
            {t("prezzi.signals").split("|").map((sig) => (
              <li key={sig} className="plans-signals__item">{sig}</li>
            ))}
          </ul>
        </header>

        {/* Offer + the three shapes a collaboration can take */}
        <section className="prz-sec" aria-label={t("prezzi.offer.title")}>
          <h2 className="prz-sec__title">{t("prezzi.offer.title")}</h2>
          <p className="prz-lead">{t("prezzi.offer.body")}</p>

          {/* Build, then the optional aftercare. The monthly used to live only
              inside a footnote, which left the two offers undefined against each
              other: readers could not tell whether the monthly replaced the build or came
              after it. Shown as its own tier, the order answers that by itself.
              Each card's strong line now names what the quote is measured in,
              and the footnote under it names what moves it — the two facts the
              figure used to stand in for. */}
          <div className="prz-tiers prz-tiers--three">
            {/* The web build is flagged as the recommended tier: with three
                cards and no entry point the eye picks by scanning order alone,
                and the subscription that is not the product sits in the middle. */}
            <div className="prz-tier prz-tier--rec">
              <span className="prz-tier__badge">{t("prezzi.rec")}</span>
              <h3 className="prz-tier__name">{t("home.eng.web.title")}</h3>
              <p className="prz-tier__for"><em>{t("prezzi.forLabel")}</em> {t("prezzi.for.web")}</p>
              <p className="prz-tier__price">
                {t("prezzi.tier.web.basis")}
                <span className="prz-tier__note">{t("prezzi.tier.web.note")}</span>
              </p>
              <ul className="prz-list">
                {t("home.eng.web.features").split("|").map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="prz-tier__plus">{t("prezzi.tier.web.moves")}</p>
            </div>

            <div className="prz-tier">
              <h3 className="prz-tier__name">{t("prezzi.monthly.title")}</h3>
              <p className="prz-tier__for"><em>{t("prezzi.forLabel")}</em> {t("prezzi.for.monthly")}</p>
              <p className="prz-tier__price">
                {t("prezzi.monthly.basis")}
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
                {t("prezzi.tier.retainer.basis")}
                <span className="prz-tier__note">{t("prezzi.tier.retainer.note")}</span>
              </p>
              <ul className="prz-list">
                {t("home.eng.retainer.features").split("|").map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="prz-tier__plus">{t("prezzi.tier.retainer.moves")}</p>
            </div>
          </div>
          <p className="plans-costnote">{t("prezzi.offer.note")}</p>
        </section>

        {/* Everything the studio sells that is NOT the website.
            A visitor arriving from the e-commerce or the AI-agent cell used to
            find a promise and no answer on cost. The answer here is not a
            figure: it is the two ends of each service — what the simplest
            version looks like, and what pushes it up — which is the part a
            reader can apply to their own case. */}
        {/* Le sei schede servizio stavano qui. Erano la quarta tassonomia
            del sito e ripetevano l'offerta con parole leggermente diverse da
            quelle del menu. "Cosa muove il preventivo" e' un'informazione per
            disciplina, e ora vive nella pagina di quella disciplina, dove il
            lettore la trova accanto ai lavori invece che in fondo a un elenco
            di sei. */}

        {/* How it works */}
        <section className="prz-sec prz-sec--how" aria-label={t("home.plans.how.title")}>
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

        {/* Paid add-ons. These two are the one place on the page where the work
            does not vary, so the honest thing to say is that the rate is fixed
            and told to you before it starts. Leaving stays a known cost rather
            than a negotiation, which was the whole point of listing them. */}
        <section className="prz-sec" aria-label={t("prezzi.addon.title")}>
          <h2 className="prz-sec__title">{t("prezzi.addon.title")}</h2>
          <div className="prz-tiers prz-tiers--two">
            {(["move", "domain"] as const).map((a) => (
              <div key={a} className="prz-tier">
                <h3 className="prz-tier__name">{t(`prezzi.addon.${a}.title`)}</h3>
                <p className="prz-tier__price">
                  {t(`prezzi.addon.${a}.basis`)}
                  <span className="prz-tier__note">{t(`prezzi.addon.${a}.note`)}</span>
                </p>
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

        {/* The objections that otherwise arrive by email before anyone books.
            Two were added when the figures came off, because taking them off
            provokes two new questions: why there is no list, and when the reader
            actually finds out. Answering them on the page also gives an AI
            assistant fetching /prezzi something to quote. */}
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
