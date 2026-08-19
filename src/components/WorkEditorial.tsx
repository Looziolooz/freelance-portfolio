"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useLang } from "./LangProvider";
import { PROJECTS, type Project } from "@/lib/projects";
import { DISCIPLINES } from "@/lib/disciplines";

// La sezione dei lavori sulla home, come griglia editoriale.
//
// Prima era una galleria orizzontale che si trascinava mentre la pagina restava
// bloccata, e raggruppava i progetti per il vecchio campo `category`
// (website/saas/automazione/ai) che il sito ha ritirato quando e' passato a un
// asse solo. Era l'ultimo posto che parlava ancora la vecchia lingua.
//
// La forma viene dal mockup che il proprietario ha scelto: griglia asimmetrica,
// due card larghe che spezzano il ritmo, colonne sfalsate in verticale, e
// all'hover la card ruota di poco con l'ombra secca mentre l'immagine sotto
// cresce. Del mockup si riusa esattamente questo, cioe' struttura, ritmo e
// movimento. Non si riusa niente del suo contenuto: i marchi erano inventati
// (Atelier Nord, Casa Lenta, Marea Botanica), gli anni pure, gli stack pure, e
// le immagini stavano su un bucket di terzi. Qui ci sono i progetti veri, con le
// loro copertine in /public e la disciplina a cui appartengono.
//
// Niente anni: i progetti non hanno un campo anno e inventarne uno sarebbe una
// data falsa su un portfolio. L'occhiello porta la disciplina, che e'
// un'informazione vera e per giunta cliccabile.

// Il ritmo del mockup, slot per slot. `wide` occupa entrambe le colonne.
// `offset` sfalsa la colonna in verticale, che e' quello che impedisce alla
// griglia di leggersi come una tabella.
const LAYOUT = [
  { shape: "hero", tone: "forest", h: 480, offset: 0 },
  { shape: "tile", tone: "paper", h: 370, offset: 8 },
  { shape: "tile", tone: "ochre", h: 370, offset: 0 },
  { shape: "band", tone: "paper", h: 330, offset: 0 },
  { shape: "tile", tone: "paper", h: 330, offset: 0 },
  { shape: "tile", tone: "forest", h: 330, offset: 14 },
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

/**
 * Sei lavori: uno per disciplina, poi si riempie con quelli che hanno una
 * copertina. Le card grandi sono le prime due della lista, quindi in testa
 * vanno i progetti che hanno un video invece di una sola immagine.
 */
function pick(): Project[] {
  const live = PROJECTS.filter((p) => p.featured && !p.hidden && (p.coverVideo || p.image));
  const out: Project[] = [];
  for (const d of DISCIPLINES) {
    const found = live.find((p) => !out.includes(p) && disciplineOf(p)?.id === d.id);
    if (found) out.push(found);
  }
  for (const p of live) {
    if (out.length >= LAYOUT.length) break;
    if (!out.includes(p)) out.push(p);
  }
  // I filmati davanti: le due card larghe sono quelle che si notano di piu'.
  return out
    .slice(0, LAYOUT.length)
    .sort((a, b) => Number(Boolean(b.coverVideo)) - Number(Boolean(a.coverVideo)));
}

const ITEMS = pick();

const CSS = `
.wke {
  position: relative;
  padding: clamp(52px, 8vw, 104px) 0;
  background: var(--canvas-page);
  /* La carta punteggiata del mockup: costa un gradiente, non un'immagine. */
  background-image: radial-gradient(color-mix(in srgb, var(--ink-border) 13%, transparent) 0.7px, transparent 0.7px);
  background-size: 7px 7px;
}

.wke__head {
  display: grid;
  gap: clamp(24px, 4vw, 40px);
  border-bottom: 2px solid var(--ink-border);
  padding-bottom: clamp(24px, 3vw, 40px);
  margin-bottom: clamp(34px, 5vw, 64px);
}
@media (min-width: 1000px) {
  .wke__head { grid-template-columns: 1fr 280px; align-items: end; }
}
.wke__kicker {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 22px;
}
.wke__dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  border: 2px solid var(--ink-border);
  background: var(--accent-green);
  flex: 0 0 auto;
}
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

.wke__grid { display: grid; grid-template-columns: 1fr; gap: clamp(18px, 2.4vw, 32px); }
@media (min-width: 900px) { .wke__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

/* Sotto i 900px il testo centrato della card larga non ha spazio per stare
   comodo dentro un'altezza fissa: la si lascia crescere. */
@media (max-width: 899px) {
  .wke--band .wke__media { height: auto !important; min-height: 340px; }
  .wke--band .wke__media img, .wke--band .wke__media video { position: absolute; inset: 0; height: 100%; }
  .wke__over--centre {
    position: absolute;
    inset: auto 18px 18px auto;
    left: 18px;
    transform: none;
    max-width: calc(100% - 36px);
  }
}

.wke__card {
  position: relative;
  display: block;
  overflow: hidden;
  border: 3px solid var(--ink-border);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
}
.wke__card:hover, .wke__card:focus-visible {
  transform: rotate(-1.15deg) scale(1.015);
  box-shadow: 9px 10px 0 var(--ink-shadow);
}
/* Le card pari ruotano dall'altra parte, cosi' la griglia non pende da un lato. */
.wke__card:nth-child(even):hover, .wke__card:nth-child(even):focus-visible { transform: rotate(1.15deg) scale(1.015); }
.wke__card:focus-visible { outline: 3px solid var(--accent-green-deep); outline-offset: 4px; }

.wke--wide { grid-column: 1 / -1; }
@media (min-width: 900px) {
  .wke--off8 { margin-top: 32px; }
  .wke--off14 { margin-top: 56px; }
}

.wke--forest { background: var(--accent-green-deep); color: var(--canvas-page); }
.wke--paper { background: var(--canvas-panel-yellow); color: var(--ink-body); }
/* Regola di marca: sui riempimenti ocra il testo resta scuro, mai bianco. */
.wke--ochre { background: var(--accent-green); color: var(--ink-body); }

.wke__media { position: relative; display: block; overflow: hidden; }
.wke__media img, .wke__media video {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease;
}
.wke__card:hover .wke__media img, .wke__card:hover .wke__media video {
  transform: scale(1.08);
  filter: saturate(1.12) contrast(1.04);
}
/* Il velo di colore che tiene insieme copertine molto diverse fra loro. */
.wke__wash { position: absolute; inset: 0; transition: opacity 0.25s ease; }
.wke--forest .wke__wash { background: var(--accent-green-deep); opacity: 0.52; }
.wke--paper .wke__wash { background: var(--accent-green); opacity: 0.42; mix-blend-mode: multiply; }
.wke--ochre .wke__wash { background: var(--ink-border); opacity: 0.34; }
.wke__card:hover .wke__wash { opacity: 0.7; }

/* Un velo appena accennato: serve solo a staccare la piastra dall'immagine,
   non a garantire il contrasto. Di quello si occupa la piastra stessa. */
.wke__media::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--ink-border) 34%, transparent) 0%,
    transparent 58%
  );
}

/* La piastra: il testo si porta dietro il suo fondo, quindi resta leggibile
   sopra qualunque copertina, fotografia o schermata che sia. */
.wke__over {
  position: absolute;
  inset: auto 18px 18px;
  z-index: 2;
  max-width: min(560px, calc(100% - 36px));
  padding: 16px 20px 18px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--ink-border) 90%, transparent);
  backdrop-filter: blur(2px);
}
.wke--hero .wke__over { max-width: min(620px, calc(100% - 60px)); inset: auto 28px 26px; }
/* Sulla card centrale la piastra sta a sinistra e lascia respirare l'immagine. */
.wke__over--centre {
  inset: auto auto 50% auto;
  left: clamp(18px, 3vw, 44px);
  transform: translateY(50%);
  max-width: min(620px, calc(100% - clamp(36px, 6vw, 88px)));
}

.wke__eyebrow {
  display: block;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-green);
  margin-bottom: 10px;
}
/* Sulla piastra il fondo e' scuro qualunque sia il tono della card, quindi
   l'occhiello resta ocra e il titolo chiaro senza eccezioni per tono. */
.wke__over .wke__eyebrow { color: var(--accent-green); }

.wke__name {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 0.95;
  letter-spacing: -0.02em;
  /* Misurato sulle card strette: a 5vw un nome come "Contenuti social da un
     progetto" andava a due righe strettissime. Il titolo si adatta alla
     larghezza della card, non a quella della finestra. */
  font-size: clamp(25px, 2.9vw, 40px);
  color: var(--canvas-page);
  text-wrap: balance;
  /* Due righe al massimo: oltre, il nome smette di essere un'insegna. */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.wke--hero .wke__name, .wke--band .wke__name { font-size: clamp(32px, 4.2vw, 58px); }
.wke__blurb {
  margin: 14px 0 0;
  max-width: 46ch;
  font-size: 14px;
  line-height: 1.55;
  color: var(--canvas-panel-yellow);
  /* Tre righe e basta: sopra una fotografia un paragrafo non si legge, e una
     card e' un invito ad aprire, non il posto dove raccontare tutto. */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.wke__body { padding: 20px 22px; }
.wke__body .wke__eyebrow { color: var(--ink-muted); }
.wke--forest .wke__body .wke__eyebrow { color: var(--accent-green); }
.wke__body p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.wke--paper .wke__body p, .wke--ochre .wke__body p { color: color-mix(in srgb, var(--ink-body) 78%, transparent); }
.wke--forest .wke__body p { color: var(--canvas-panel-yellow); }

.wke__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.wke__tag {
  border: 2px solid var(--ink-border);
  border-radius: 999px;
  padding: 4px 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
}
.wke--forest .wke__tag { border: 1px solid var(--canvas-page); }
.wke__strip {
  display: flex; flex-wrap: wrap; gap: 8px;
  border-top: 2px solid var(--canvas-page);
  padding: 14px 24px;
}

.wke__foot {
  display: flex;
  flex-direction: column;
  gap: 18px;
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
  .wke__card, .wke__media img, .wke__media video, .wke__wash { transition: none; }
  .wke__card:hover, .wke__card:focus-visible,
  .wke__card:nth-child(even):hover, .wke__card:nth-child(even):focus-visible { transform: none; }
  .wke__card:hover .wke__media img, .wke__card:hover .wke__media video { transform: none; filter: none; }
}
`;

function Card({ p, slot, index }: { p: Project; slot: (typeof LAYOUT)[number]; index: number }) {
  const { t } = useLang();
  const vref = useRef<HTMLVideoElement>(null);
  const d = disciplineOf(p);
  const name = t(`work.proj.${p.key}`);
  const blurb = t(`work.proj.${p.key}.blurb`);
  const rawTags = t(`work.proj.${p.key}.tags`);
  const tags = rawTags === `work.proj.${p.key}.tags` ? [] : rawTags.split(/[·,|]/).map((x) => x.trim()).filter(Boolean).slice(0, 3);

  const play = () => {
    const v = vref.current;
    if (!v) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  };
  const pause = () => vref.current?.pause();

  const eyebrow = d ? t(`${d.key}.label`) : "";
  const over = slot.shape === "band";

  return (
    <Link
      href={`/work/${p.slug}`}
      prefetch={false}
      className={[
        "wke__card",
        `wke--${slot.tone}`,
        `wke--${slot.shape}`,
        slot.shape === "hero" || slot.shape === "band" ? "wke--wide" : "",
        slot.offset === 8 ? "wke--off8" : slot.offset === 14 ? "wke--off14" : "",
      ].filter(Boolean).join(" ")}
      aria-label={`${name} — ${t("work.viewDemo")}`}
      onMouseEnter={play}
      onMouseLeave={pause}
    >
      <span className="wke__media" style={{ height: slot.h }}>
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
            style={{ objectPosition: p.imagePosition ?? "center" }}
          />
        ) : (
          <Image
            src={p.image as string}
            alt={name}
            fill
            sizes={slot.shape === "tile" ? "(max-width: 900px) 100vw, 50vw" : "100vw"}
            loading={index === 0 ? "eager" : "lazy"}
            style={{ objectFit: "cover", objectPosition: p.imagePosition ?? "center" }}
          />
        )}
        <span className="wke__wash" aria-hidden="true" />
        <span className={`wke__over${over ? " wke__over--centre" : ""}`}>
          {eyebrow && <span className="wke__eyebrow">{eyebrow}</span>}
          <h3 className="wke__name">{name}</h3>
          {(slot.shape === "hero" || over) && blurb !== `work.proj.${p.key}.blurb` && (
            <p className="wke__blurb">{blurb}</p>
          )}
        </span>
      </span>

      {slot.shape === "hero" ? (
        tags.length > 0 && (
          <span className="wke__strip">
            {tags.map((tg) => (
              <span key={tg} className="wke__tag">{tg}</span>
            ))}
          </span>
        )
      ) : (
        <span className="wke__body">
          {slot.shape === "tile" && blurb !== `work.proj.${p.key}.blurb` && <p>{blurb}</p>}
          {tags.length > 0 && (
            <span className="wke__tags">
              {tags.map((tg) => (
                <span key={tg} className="wke__tag">{tg}</span>
              ))}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

export default function WorkEditorial() {
  const { t } = useLang();
  const range = `01—${String(ITEMS.length).padStart(2, "0")}`;

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
          {ITEMS.map((p, i) => (
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
