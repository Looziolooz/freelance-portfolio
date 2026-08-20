"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";

// Engagements — tre modi di lavorare insieme (nessun listino: lo scopo si
// decide in una call).
//
// Prima era un bento: due celle in alto e la gestione continuativa come barra
// scura a tutta larghezza. Aveva gia' una gerarchia, ma chiedeva comunque al
// lettore di leggere tutti e tre i blocchi per capire quale lo riguarda, ed era
// il blocco piu' alto della seconda meta' della pagina, proprio dove la home
// perde ritmo.
//
// Ora e' una scelta: un binario con i tre modi, e un pannello che cambia. Chi
// sa cosa cerca legge solo quello; chi non lo sa scorre tre righe invece di tre
// schede.
//
// I due pannelli non attivi restano nel DOM con l'attributo `hidden` invece di
// non essere renderizzati: un motore di ricerca e un assistente AI continuano a
// leggere tutte e tre le offerte, che su una pagina che vende e' esattamente
// quello che serve.
const KEYS = ["brand", "web", "retainer"] as const;
type Key = (typeof KEYS)[number];

export default function Plans() {
  const { t } = useLang();
  // "web" e' il modo piu' richiesto: si apre su quello invece che sul primo
  // della lista, cosi' il pannello che si vede per primo e' quello che serve
  // alla maggioranza dei visitatori.
  const [picked, setPicked] = useState<Key>("web");

  return (
    <section id="piani" className="plans" aria-label={t("home.plans.title")}>
      <SectionHeader
        eyebrow={t("home.plans.tag")}
        title={t("home.plans.title")}
        sub={t("home.plans.meta")}
      />

      {/* Le tre cose che chi compra vuole sistemate prima di leggere il resto.
          Chip mono, non prosa: si scorrono. */}
      <ul className="plans-signals">
        {t("home.plans.signals").split("|").map((sig) => (
          <li key={sig} className="plans-signals__item">{sig}</li>
        ))}
      </ul>

      <div className="plans-pick">
        <div className="plans-rail" role="tablist" aria-label={t("home.plans.title")}>
          {KEYS.map((k, i) => {
            const on = k === picked;
            return (
              <button
                key={k}
                type="button"
                role="tab"
                id={`plan-tab-${k}`}
                aria-selected={on}
                aria-controls={`plan-panel-${k}`}
                className={`plans-rail__btn${on ? " is-on" : ""}`}
                onClick={() => setPicked(k)}
              >
                <span className="plans-rail__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="plans-rail__t">{t(`home.eng.${k}.title`)}</span>
                <span className="plans-rail__go" aria-hidden="true">→</span>
              </button>
            );
          })}
          <p className="plans-rail__note">{t("home.plans.note")}</p>
        </div>

        <div className="plans-panels">
          {KEYS.map((k) => {
            const on = k === picked;
            return (
              <div
                key={k}
                id={`plan-panel-${k}`}
                role="tabpanel"
                aria-labelledby={`plan-tab-${k}`}
                className="plans-panel"
                hidden={!on}
              >
                <div className="plans-panel__head">
                  <h3 className="plans-panel__title">{t(`home.eng.${k}.title`)}</h3>
                  <span className="plans-panel__price">{t(`home.eng.${k}.price`)}</span>
                </div>
                <p className="plans-panel__desc">{t(`home.eng.${k}.desc`)}</p>

                <ul className="plans-panel__features">
                  {t(`home.eng.${k}.features`).split("|").map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <p className="plans-panel__note">{t(`home.eng.${k}.priceNote`)}</p>

                <div className="plans-panel__actions">
                  <a href="/contatti" className="neo-btn neo-btn--primary">
                    {t("home.plans.cta")} <span aria-hidden="true">→</span>
                  </a>
                  <a href="/prezzi" className="plans-pricelink">
                    {t("home.plans.pricelink")} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            );
          })}

          {/* Cosa coprono e cosa non coprono le cifre. Sta sotto la scheda e
              non sotto il binario: e' una nota sull'offerta che stai leggendo,
              non sull'elenco dei tre modi. */}
          <p className="plans-costnote">{t("home.plans.costnote")}</p>
        </div>
      </div>

    </section>
  );
}
