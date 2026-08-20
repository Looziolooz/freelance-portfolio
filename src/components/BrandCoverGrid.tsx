"use client";

import Link from "next/link";
import Image from "next/image";
import { dimOn } from "@/lib/contrast";
import { hasRealMark } from "@/lib/brand-logo-files";
import { Monogram } from "./BrandKit";
import { useLang } from "./LangProvider";
import { getBrandKit } from "@/lib/brand-kits";
import type { Project } from "@/lib/projects";

// Le copertine dei fascicoli, una per marchio.
//
// Prima /servizi/marchio e /servizi/siti-web mostravano la stessa cosa: una
// griglia di schermate di siti. Due pagine identiche a colpo d'occhio, che e'
// il modo piu' rapido per far credere che il lavoro sia lo stesso. Ma il lavoro
// di marca non e' un sito: e' il fascicolo che si consegna, e la sua copertina
// e' la prima cosa che un cliente vede.
//
// Quindi qui non si mostrano schermate. Ogni riquadro E' la copertina del
// manuale di quel marchio, costruita con i suoi dati veri: la sua carta, il suo
// inchiostro, il suo carattere display con la sua spaziatura, il suo monogramma
// nella forma che gli appartiene, e la sua palette come striscia in fondo.
// Diciassette copertine diverse una dall'altra, e nessuna immagine da caricare:
// e' tutto testo e colore.

const COVER_CSS = `
.bcg { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: clamp(16px, 2vw, 26px); }

.bcg__cover {
  position: relative;
  display: flex;
  flex-direction: column;
  aspect-ratio: 1 / 1.32;
  padding: clamp(18px, 2vw, 26px);
  border: 3px solid var(--ink-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  text-decoration: none;
  overflow: hidden;
  transition: transform var(--dur-base) var(--ease), box-shadow var(--dur-base) var(--ease);
}
.bcg__cover:hover, .bcg__cover:focus-visible {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-card-hover, 8px 8px 0 var(--ink-shadow));
}
.bcg__cover:focus-visible { outline: 3px solid var(--accent-green-deep); outline-offset: 3px; }

/* La riga in alto: cosa e' questo documento. Mono, piccola, tracciata. */
.bcg__kind {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.bcg__mark { flex: 1 1 auto; display: grid; place-items: center; padding: 14px 0; }
/* Il segno vero, alla stessa misura del monogramma che sostituisce. */
.bcg__mark-real { display: block; position: relative; width: 92px; height: 92px; }

/* Il logo vero, non il nome ricomposto con il carattere del kit. I file stanno
   in /brand-logos, sono PNG trasparenti alti 168px, e finora non li usava
   nessuno: la copertina mostrava una ricostruzione tipografica di una cosa che
   esisteva gia' disegnata. */
/* display:block e obbligatorio: e uno <span>, e uno span in linea ignora
   altezza e larghezza, quindi l immagine in posizione assoluta riempiva una
   scatola alta zero e il logo non si vedeva. */
.bcg__logo { display: block; position: relative; width: 100%; height: 38px; }
.bcg__tag {
  margin-top: 6px;
  font-size: 12.5px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
/* Niente opacita' su queste tre righe: smorzava anche il contrasto, e su carte
   chiare le portava fra 3,79 e 4,48. Il grigio ora e' calcolato sul fondo vero
   di ogni kit (dimOn), quindi resta quieto ma misurabile. */
.bcg__domain {
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
}

/* La palette come striscia sul bordo basso: si legge come il taglio colorato
   di un libro, e dice in un colpo che dentro c'e' un sistema. */
.bcg__strip { position: absolute; inset: auto 0 0 0; display: flex; height: 8px }
.bcg__strip span { flex: 1 1 0 }

@media (prefers-reduced-motion: reduce) {
  .bcg__cover { transition: none; }
  .bcg__cover:hover, .bcg__cover:focus-visible { transform: none; }
}
`;

export default function BrandCoverGrid({ items }: { items: Project[] }) {
  const { t } = useLang();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: COVER_CSS }} />
      <div className="bcg">
        {items.map((p) => {
          const kit = getBrandKit(p.slug);
          if (!kit) return null;
          // Il grigio delle righe secondarie, misurato sulla carta di QUESTO
          // kit: la stessa opacita' su carte diverse da contrasti diversi.
          const quieto = dimOn(kit.ink, kit.paper);
          return (
            <Link
              key={p.id}
              href={`/work/${p.slug}`}
              prefetch={false}
              className="bcg__cover"
              style={{ background: kit.paper, color: kit.ink }}
              aria-label={`${kit.name} — ${t("bdeck.eyebrow")}`}
            >
              <span className="bcg__kind" style={{ color: quieto }}>{t("bdeck.eyebrow")}</span>

              <span className="bcg__mark">
                {/* Il segno, non le iniziali: sotto c'e' gia' il logo scritto,
                    e ripetere le lettere due volte non e' un marchio.
                    Dove il segno vero esiste come file (elenco in
                    brand-logo-files) si usa quello; il monogramma disegnato
                    resta per gli altri, che e' un segnaposto onesto. */}
                {hasRealMark(p.slug) ? (
                  <span className="bcg__mark-real">
                    <Image
                      src={`/brand-logos/${p.slug}/mark.png`}
                      alt=""
                      fill
                      sizes="92px"
                      style={{ objectFit: "contain" }}
                    />
                  </span>
                ) : (
                  <Monogram kit={kit} variant="solid" size={92} glyph="motif" />
                )}
              </span>

              <span>
                <span className="bcg__logo">
                  <Image
                    src={`/brand-logos/${p.slug}/wordmark.png`}
                    alt={kit.name}
                    fill
                    sizes="(max-width: 720px) 60vw, 240px"
                    style={{ objectFit: "contain", objectPosition: "left center" }}
                  />
                </span>
                {kit.tagline && (
                  <span className="bcg__tag" style={{ fontFamily: kit.body, display: "-webkit-box", color: quieto }}>
                    {kit.tagline}
                  </span>
                )}
                {kit.domain && <span className="bcg__domain" style={{ display: "block", color: quieto }}>{kit.domain}</span>}
              </span>

              <span className="bcg__strip" aria-hidden="true">
                {kit.palette.slice(0, 6).map((c) => (
                  <span key={c.hex} style={{ background: c.hex }} />
                ))}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
