"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { POINTS, PointIcon } from "./Trust";
import { SC_ENGINE_CSS } from "./scrollcraft/engine-css";

// La sezione fiducia come atto scrollcraft: la pagina si ferma, il titolo si
// monta riga per riga, le quattro carte entrano una alla volta sotto la
// rotella, la griglia deriva piano per tutto il viaggio, poi rilascia. Stesso
// contenuto e stesse chiavi di Trust.tsx: cambia il tempo, non le parole.
//
// L'engine e' quello della skill scroll-craft, vendored testuale in
// ./scrollcraft/engine.js e mai modificato. Convivenza con la motion esistente:
// - Lenis: l'engine ha un suo lerp che sommato a Lenis darebbe doppio
//   smoothing (il problema documentato in HeroMotion). Con window.lenis
//   presente il lerp va a 1 e l'unico a levigare resta Lenis.
// - ScrollTrigger: il pin allunga la pagina, quindi dopo il mount (e dopo il
//   re-layout su fonts.ready) si chiama ScrollTrigger.refresh(), o il sipario
//   del footer misurerebbe posizioni vecchie.
//
// Gli attributi data-sc-* stanno SEMPRE nel markup e sono inerti: lo stato
// nascosto ([data-sc-cue]{opacity:0}) vive nel CSS dell'engine, che viene
// iniettato solo qui sotto, imperativamente, PRIMA del mount. Una prima
// versione aggiungeva gli attributi via stato React e perdeva la corsa col
// commit: l'engine a volte leggeva il DOM prima che gli attributi ci fossero,
// e l'atto restava un flusso qualsiasi. Cosi' invece: JS spento, telefono
// (<900px) o reduced-motion = niente CSS, niente engine, sezione statica
// leggibile per intero; desktop = palco.
export default function TrustAct() {
  const { t } = useLang();
  // Il root del mount e' il WRAPPER, non la sezione: il collettore dell'engine
  // fa root.querySelectorAll('[data-sc-act]'), cioe' discendenti soltanto, e
  // montato sull'atto stesso registrava zero atti (verificato: instances 1,
  // acts 0). E' il genere di dettaglio per cui l'engine non si tocca e ci si
  // adatta dal proprio lato.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 900px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!wide || reduce) return;
    let alive = true;
    let styleEl: HTMLStyleElement | null = null;
    (async () => {
      // @ts-expect-error modulo vanilla vendored, si registra su window
      await import("./scrollcraft/engine.js");
      if (!alive || !ref.current) return;
      type SC = { mount: (el: Element, o?: { lerp?: number }) => unknown };
      const sc = (window as unknown as { ScrollCraft?: SC }).ScrollCraft;
      if (!sc) return;
      styleEl = document.createElement("style");
      styleEl.textContent = SC_ENGINE_CSS + ACT_CSS;
      document.head.appendChild(styleEl);
      // Due frame: il primo applica il CSS appena entrato nel CSSOM, il
      // secondo lascia misurare all'engine un layout gia' assestato.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!alive || !ref.current) return;
        const hasLenis = Boolean((window as unknown as { lenis?: unknown }).lenis);
        sc.mount(ref.current, { lerp: hasLenis ? 1 : 0.14 });
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
          document.fonts?.ready.then(() => ScrollTrigger.refresh());
        });
      }));
    })();
    return () => {
      alive = false;
      styleEl?.remove();
    };
  }, []);

  return (
    <div ref={ref}>
    <section
      id="perche"
      className="trust trust-act"
      aria-label={t("trust.title")}
      data-sc-act="pin"
      data-sc-span="1.8"
    >
      <div className="sc-stage trust-act__stage">
        <div className="trust__inner">
          <header className="sec-head">
            <span className="sec-head__eyebrow" data-sc-cue="0.02">
              {t("trust.eyebrow")}
            </span>
            <h2 className="sec-head__title" data-sc-kinetic="lines" data-sc-cue="0.05">
              {t("trust.title")}
            </h2>
            {/* Niente cue sulla sub: in .trust sta a opacita' 0.78 per design
                (attenuata sul fondo scuro) e una cue di opacita' ci
                litigherebbe; l'harness la segnava come "mai a piena opacita'".
                Visibile dall'ingresso, che e' anche piu' quieto. */}
            <p className="sec-head__sub">{t("trust.sub")}</p>
          </header>

          {/* La deriva lenta copre l'intero viaggio del pin: senza, l'harness
              segnava scroll morto dopo l'ultima cue. -0.05 = ~45px, un respiro. */}
          <ul className="trust-grid" data-sc-parallax="-0.05">
            {POINTS.map((k, i) => (
              <li key={k} className="trust-card" data-sc-cue={String(0.2 + i * 0.13)}>
                <span className="trust-card__ic"><PointIcon k={k} /></span>
                <h3 className="trust-card__t">{t(`trust.${k}.title`)}</h3>
                <p className="trust-card__d">{t(`trust.${k}.desc`)}</p>
              </li>
            ))}
          </ul>

          <Link href="/work" className="trust-proof" data-sc-cue="0.78">
            {t("trust.cta")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
    </div>
  );
}

// Solo l'adattamento dell'atto: la veste resta .trust/.trust-* in globals.css.
// Qui si centra il palco e si spegne il padding del flusso, che dentro un
// viewport intero non serve piu'.
const ACT_CSS = `
.trust-act[data-sc-act] { padding: 0; }
.trust-act[data-sc-act] .sc-stage { display: grid; align-content: center; }
.trust-act[data-sc-act] .trust__inner { width: 100%; }
`;
