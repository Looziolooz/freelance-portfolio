"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useLang } from "./LangProvider";
import { PROJECTS, type Project } from "@/lib/projects";
import { DISCIPLINES } from "@/lib/disciplines";
import { useRotation } from "@/lib/useRotation";

// La sezione dei lavori sulla home.
//
// Prima era una galleria orizzontale che si trascinava mentre la pagina restava
// bloccata, e raggruppava i progetti per il vecchio campo `category`
// (website/saas/automazione/ai) che il sito ha ritirato passando a un asse solo.
//
// Poi e' diventata una griglia editoriale col titolo appoggiato sopra
// l'immagine, come nel mockup. Guardata renderizzata, quella versione leggeva
// dozzinale, e il motivo e' preciso: il mockup era disegnato per fotografie,
// mentre queste copertine sono schermate di interfacce. Una targa scura
// appoggiata su una schermata sembra un adesivo, i veli di colore impastavano
// le copertine in poltiglie beige e verdine, e la rotazione all'hover e' un
// gesto giocoso che dice il contrario di "studio".
//
// Questa versione segue la regola dei portfolio seri: l'immagine si mostra
// pulita e intera, il testo sta sotto in una didascalia. Nessun velo, nessuna
// targa, nessun titolo che litiga con il testo dentro la schermata. Il ritmo
// resta editoriale (card larghe e strette, colonne sfalsate) perche' li' il
// mockup aveva ragione; cambia il modo di presentare il singolo lavoro.
//
// Il movimento e' quello che si concede uno studio: la card si alza di poco,
// l'ombra secca compare, l'immagine cresce appena. Niente rotazioni.
//
// Niente anni: il dato non esiste sui progetti e inventarlo sarebbe una data
// falsa su un portfolio. L'occhiello porta la disciplina, che e' vera.

// Il ritmo: `wide` occupa entrambe le colonne, `offset` sfalsa la colonna.
// I formati seguono le sorgenti, misurate: 14 copertine su 19 sono 1280x720,
// cioe 16:9, e le restanti stanno fra 1,6 e 2,14. Incorniciare a 16/10 una
// sorgente 16:9 con object-fit: cover significa tagliarle i lati, ed e
// esattamente il difetto che si vedeva. Le tessere ora sono 16/9, quindi per la
// maggioranza delle copertine il taglio e zero. Le card larghe restano
// panoramiche a 2/1, dove il taglio e verticale e modesto: perdere un filo di
// alto e basso di una schermata costa molto meno che perderne i bordi.
const LAYOUT = [
  { wide: true, ratio: "2 / 1", offset: 0 },
  { wide: false, ratio: "16 / 9", offset: 8 },
  { wide: false, ratio: "16 / 9", offset: 0 },
  { wide: true, ratio: "2 / 1", offset: 0 },
  { wide: false, ratio: "16 / 9", offset: 0 },
  { wide: false, ratio: "16 / 9", offset: 14 },
] as const;

/**
 * A quale disciplina appartiene un progetto, dalla piu' specifica alla piu'
 * generale: un sito ha quasi sempre anche un fascicolo di marca, e dirgli
 * "Marchio" sarebbe vero ma inutile.
 */
const ORDER = ["visibilita", "automazioni-ai", "siti-web", "marchio"] as const;
function disciplineOf(p: Project) {
  for (const id of ORDER) {
    const d = DISCIPLINES.find((x) => x.id === id);
    if (d?.select(p)) return d;
  }
  return undefined;
}

/** Tutti i lavori che hanno una copertina da mostrare. */
const POOL = PROJECTS.filter((p) => p.featured && !p.hidden && (p.coverVideo || p.image));

/** Al massimo due lavori della stessa disciplina fra i sei mostrati. */
const PER_DISCIPLINE = 2;

/**
 * Sei lavori scelti dall ordine ricevuto, con un tetto per disciplina.
 *
 * Prima la regola era "uno per disciplina", e misurando dieci visite si e'
 * visto che il primo posto non cambiava mai. Non era sfortuna: la disciplina
 * "Marchio" ha un solo membro esclusivo, perche' ogni altro progetto con un
 * fascicolo e' anche un sito e come sito viene classificato. Chiedere una quota
 * per ogni disciplina significava chiedere sempre quel progetto.
 *
 * Il tetto ottiene la varieta' senza inchiodare nessun posto: nessuna
 * estrazione mostra sei siti di fila, e nessun lavoro e' obbligato a esserci.
 * Se il tetto non basta a riempire i sei posti, il secondo giro lo ignora:
 * meglio due lavori in piu' della stessa disciplina che una griglia con i
 * buchi.
 *
 * I filmati finiscono in testa perche' le prime due posizioni sono le card
 * larghe, dove una copertina che si muove rende piu' di una ferma.
 */
function pick(order: readonly Project[]): Project[] {
  const out: Project[] = [];
  const seen = new Map<string, number>();

  for (const p of order) {
    if (out.length >= LAYOUT.length) break;
    const id = disciplineOf(p)?.id ?? "altro";
    const n = seen.get(id) ?? 0;
    if (n >= PER_DISCIPLINE) continue;
    seen.set(id, n + 1);
    out.push(p);
  }
  for (const p of order) {
    if (out.length >= LAYOUT.length) break;
    if (!out.includes(p)) out.push(p);
  }

  return out
    .slice(0, LAYOUT.length)
    .sort((a, b) => Number(Boolean(b.coverVideo)) - Number(Boolean(a.coverVideo)));
}

const CSS = `
.wke {
  position: relative;
  padding: clamp(52px, 8vw, 104px) 0;
  background: var(--canvas-page);
}

.wke__head {
  display: grid;
  gap: clamp(24px, 4vw, 40px);
  border-bottom: 2px solid var(--ink-border);
  padding-bottom: clamp(24px, 3vw, 40px);
  margin-bottom: clamp(34px, 5vw, 64px);
}
@media (min-width: 1000px) { .wke__head { grid-template-columns: 1fr 300px; align-items: end; } }
.wke__kicker {
  display: flex; align-items: center; gap: 12px;
  font-family: var(--font-mono);
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 22px;
}
.wke__dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--ink-border); background: var(--accent-green); flex: 0 0 auto; }
.wke__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(40px, 6.4vw, 84px);
  line-height: 0.98;
  letter-spacing: -0.03em;
  color: var(--fg);
  text-wrap: balance;
  max-width: 14ch;
}
.wke__sub { margin: 0; font-size: 16px; line-height: 1.65; color: var(--ink-muted); }
.wke__hint { margin: 18px 0 0; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-muted); }

.wke__grid { display: grid; grid-template-columns: 1fr; gap: clamp(20px, 2.6vw, 36px); }
@media (min-width: 900px) { .wke__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

.wke__card {
  display: flex;
  flex-direction: column;
  background: var(--canvas-panel-yellow);
  border: 2px solid color-mix(in srgb, var(--ink-border) 24%, transparent);
  border-radius: 6px;
  overflow: hidden;
  text-decoration: none;
  color: var(--ink-body);
  transition:
    transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.28s ease;
}
/* Il movimento che si concede uno studio: si alza di poco e prende peso.
   Nessuna rotazione: quella leggeva come un tema comprato. */
.wke__card:hover, .wke__card:focus-visible {
  transform: translateY(-5px);
  border-color: var(--ink-border);
  box-shadow: 7px 8px 0 var(--ink-shadow);
}
.wke__card:focus-visible { outline: 3px solid var(--accent-green-deep); outline-offset: 3px; }
.wke--wide { grid-column: 1 / -1; }
@media (min-width: 900px) {
  .wke--off8 { margin-top: 34px; }
  .wke--off14 { margin-top: 58px; }
}

/* L'immagine si mostra intera e nei suoi colori: nessun velo, nessuna targa. */
.wke__media { position: relative; display: block; width: 100%; overflow: hidden; background: var(--canvas-slider-track); }
.wke__media img, .wke__media video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.wke__card:hover .wke__media img, .wke__card:hover .wke__media video { transform: scale(1.035); }
/* Una linea sola sotto l'immagine: separa la copertina dalla didascalia senza
   incorniciare due volte. */
.wke__media::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 2px;
  background: color-mix(in srgb, var(--ink-border) 24%, transparent);
}

.wke__body { display: flex; flex-direction: column; gap: 10px; padding: clamp(18px, 2vw, 26px) clamp(18px, 2vw, 26px) clamp(20px, 2.2vw, 28px); }
@media (min-width: 900px) {
  /* Sulle card larghe la didascalia si apre su due colonne: il nome a sinistra,
     la descrizione a destra. E' il modo in cui una monografia presenta un
     progetto, e riempie una larghezza che altrimenti resterebbe vuota. */
  .wke--wide .wke__body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: clamp(28px, 4vw, 64px);
    align-items: start;
  }
  .wke--wide .wke__head2 { grid-row: 1; grid-column: 1; }
  .wke--wide .wke__desc { grid-column: 2; grid-row: 1; margin: 0; align-self: end; }
  .wke--wide .wke__meta { grid-column: 1 / -1; }
}

.wke__eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono);
  font-size: 10.5px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent-green-deep);
}
/* Il colore del progetto, ridotto a un segno: identita' senza tingere la foto. */
.wke__swatch { width: 9px; height: 9px; border-radius: 50%; border: 1.5px solid var(--ink-border); flex: 0 0 auto; }

.wke__name {
  margin: 6px 0 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(23px, 2.1vw, 31px);
  line-height: 1.06;
  letter-spacing: -0.015em;
  color: var(--fg);
  text-wrap: balance;
}
.wke--wide .wke__name { font-size: clamp(28px, 3vw, 44px); }

.wke__desc {
  margin: 4px 0 0;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--ink-muted);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.wke--wide .wke__desc { -webkit-line-clamp: 3; }

.wke__meta {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px;
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid color-mix(in srgb, var(--ink-border) 18%, transparent);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.wke__open { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; color: var(--accent-green-deep); font-weight: 700; }
.wke__card:hover .wke__open { color: var(--ink-body); }

.wke__foot {
  display: flex; flex-direction: column; gap: 18px;
  border-top: 2px solid var(--ink-border);
  margin-top: clamp(38px, 5vw, 72px);
  padding-top: clamp(20px, 2.6vw, 34px);
}
@media (min-width: 760px) { .wke__foot { flex-direction: row; align-items: center; justify-content: space-between; } }
.wke__foot p { margin: 0; font-family: var(--font-display); font-size: clamp(20px, 2.4vw, 28px); color: var(--fg); }
.wke__all {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--fg); text-decoration: underline; text-underline-offset: 4px;
}
.wke__all:hover, .wke__all:focus-visible { color: var(--accent-green-deep); }

@media (prefers-reduced-motion: reduce) {
  .wke__card, .wke__media img, .wke__media video { transition: none; }
  .wke__card:hover, .wke__card:focus-visible { transform: none; }
  .wke__card:hover .wke__media img, .wke__card:hover .wke__media video { transform: none; }
}
`;

function Card({ p, slot, index }: { p: Project; slot: (typeof LAYOUT)[number]; index: number }) {
  const { t } = useLang();
  const vref = useRef<HTMLVideoElement>(null);
  const d = disciplineOf(p);
  const name = t(`work.proj.${p.key}`);
  const blurbKey = `work.proj.${p.key}.blurb`;
  const blurb = t(blurbKey);
  const tagKey = `work.proj.${p.key}.tags`;
  const rawTags = t(tagKey);
  const tags =
    rawTags === tagKey
      ? []
      : rawTags.split(/[·,|]/).map((x) => x.trim()).filter(Boolean).slice(0, 3);

  // Dove tagliare la copertina. Le schermate di siti si leggono dall alto,
  // dove c e la testata; i diagrammi delle automazioni sono centrati nella loro
  // tela con i margini attorno, e tagliati dall alto lasciavano una fascia vuota
  // dentro la card. Il progetto puo sempre imporre la sua posizione.
  const focus =
    p.imagePosition ??
    (p.category === "automazione" || p.category === "ai" ? "center" : "center top");

  const play = () => {
    const v = vref.current;
    if (!v) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  };
  const pause = () => vref.current?.pause();

  return (
    <Link
      href={`/work/${p.slug}`}
      prefetch={false}
      className={[
        "wke__card",
        slot.wide ? "wke--wide" : "",
        slot.offset === 8 ? "wke--off8" : slot.offset === 14 ? "wke--off14" : "",
      ].filter(Boolean).join(" ")}
      aria-label={`${name} — ${t("work.viewDemo")}`}
      onMouseEnter={play}
      onMouseLeave={pause}
    >
      <span className="wke__media" style={{ aspectRatio: slot.ratio }}>
        {p.coverVideo ? (
          <video
            ref={vref}
            src={p.coverVideo}
            poster={p.image}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            style={{ objectPosition: focus }}
          />
        ) : (
          <Image
            src={p.image as string}
            alt={name}
            fill
            sizes={slot.wide ? "100vw" : "(max-width: 900px) 100vw, 50vw"}
            loading={index === 0 ? "eager" : "lazy"}
            style={{ objectFit: "cover", objectPosition: focus }}
          />
        )}
      </span>

      <span className="wke__body">
        <span className="wke__head2">
          {d && (
            <span className="wke__eyebrow">
              <span
                className="wke__swatch"
                style={{ background: p.swatch ?? "var(--accent-green-deep)" }}
                aria-hidden="true"
              />
              {t(`${d.key}.label`)}
            </span>
          )}
          <span className="wke__name" style={{ display: "block" }}>{name}</span>
        </span>
        {blurb !== blurbKey && (
          <span className="wke__desc" style={{ display: "-webkit-box" }}>{blurb}</span>
        )}
        <span className="wke__meta">
          {tags.join(" · ")}
          <span className="wke__open">
            {t("work.viewDemo")} <span aria-hidden="true">↗</span>
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function WorkEditorial() {
  const { t } = useLang();
  // Ordine autoriale sul server, estrazione nuova a ogni visita sul client.
  const items = pick(useRotation(POOL));
  const range = `01—${String(items.length).padStart(2, "0")}`;

  return (
    <section className="wke" aria-label={t("workmq.eyebrow")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="container">
        <header className="wke__head">
          <div>
            <span className="wke__kicker">
              <span className="wke__dot" aria-hidden="true" />
              {t("wke.archive")} / {range}
            </span>
            <h2 className="wke__title">{t("wke.title")}</h2>
          </div>
          <div>
            <p className="wke__sub">{t("wke.sub")}</p>
            <p className="wke__hint">{t("wke.hint")}</p>
          </div>
        </header>

        <div className="wke__grid">
          {items.map((p, i) => (
            <Card key={p.id} p={p} slot={LAYOUT[i]} index={i} />
          ))}
        </div>

        <footer className="wke__foot">
          <p>{t("wke.foot")}</p>
          <Link href="/work" className="wke__all">
            {t("wke.all")} <span aria-hidden="true">↗</span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
