// Stili del catalogo /soluzioni. Sta qui e non in globals.css per la stessa
// ragione per cui ci sta SV_CSS: e' il vestito di una sezione, non un token del
// sistema, e globals.css e' gia' a 3300 righe di roba condivisa davvero.
//
// Le pagine soluzione riusano lo stampo di /servizi (SV_CSS) e le pastiglie di
// filtro della galleria (.pg-filter). Qui sotto c'e' solo quello che non
// esisteva ancora: la scheda soluzione, la lista di cosa costruisco e la
// griglia dei settori.
export const SOL_CSS = `
.sol-crumb { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent-green-deep); text-decoration: none; margin-bottom: 14px; }
.sol-crumb:hover { color: var(--accent-green-deep); text-decoration: underline; }

/* ── Filtri dell'hub ────────────────────────────────────────────────────── */
.sol-filters { margin: clamp(26px, 4vw, 40px) 0 0; }
.sol-filters + .sol-filters { margin-top: 18px; }
.sol-filters__label { display: block; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-muted); margin: 0 0 10px; }
/* La riga di pastiglie e' la stessa della galleria (.pg-filters), ma li' porta
   il margine basso di una sezione autonoma: qui sono due righe accostate. */
.sol-filters .pg-filters { margin-bottom: 0; }

/* ── Griglia delle soluzioni ────────────────────────────────────────────── */
.sol-grid { list-style: none; margin: clamp(28px, 4vw, 44px) 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: clamp(14px, 2vw, 20px); }
.sol-card {
  display: flex; flex-direction: column; height: 100%;
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow);
  padding: 20px 20px 18px; text-decoration: none; color: var(--ink-body);
  transition: transform .15s ease-out, box-shadow .15s ease-out;
}
.sol-card:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 var(--ink-shadow); color: var(--ink-body); }
.sol-card:focus-visible { outline: 3px solid var(--accent-green-deep); outline-offset: 3px; }
.sol-card__top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.sol-card__disc { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--accent-green-deep); }
/* Dice se dietro c'e' una demo o no. Scomoda di proposito: un catalogo dove
   tutto sembra gia' fatto e' il catalogo di chiunque altro, e la differenza si
   vede solo se e' dichiarata sulla scheda invece che scoperta dopo il clic.
   Il pieno ocra va a chi la demo ce l'ha, con testo scuro come vuole DESIGN.md. */
/* Etichetta, non pastiglia: l'informazione resta (e' integrita' del catalogo)
   ma smette di competere con il titolo. Il punto ocra marca chi ha la demo. */
.sol-card__tier { flex: none; display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 9.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-muted); }
.sol-card__tier.is-demo { color: var(--accent-green-deep); }
.sol-card__tier.is-demo::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--accent-green); border: 1.5px solid var(--ink-border); }
.sol-card__title { font-family: var(--font-display); font-size: 20px; font-weight: 600; letter-spacing: -0.015em; line-height: 1.22; margin: 9px 0 0; }
.sol-card__lede { margin: 8px 0 0; font-size: 14.5px; line-height: 1.55; color: var(--ink-muted); }
.sol-card__tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 16px 0 0; padding-top: 14px; border-top: 2px solid color-mix(in srgb, var(--ink-border) 26%, transparent); }
.sol-tag { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 5px 9px; border: 2px solid var(--ink-border); border-radius: 999px; color: var(--ink-muted); }
/* Il divisorio della scheda sta appiccicato in alto quando la lede e' corta:
   spinge i tag in fondo cosi' le schede di una riga finiscono allineate. */
.sol-card__tags { margin-top: auto; }

.sol-empty { margin: clamp(28px, 4vw, 44px) 0 0; padding: 26px 24px; border: 3px dashed var(--ink-border); border-radius: var(--radius-lg); color: var(--ink-muted); font-size: 15.5px; line-height: 1.6; }
.sol-empty button { margin-left: 8px; font: inherit; color: var(--accent-green-deep); font-weight: 600; background: none; border: 0; padding: 0; cursor: pointer; text-decoration: underline; }

/* ── Griglia dei settori ────────────────────────────────────────────────── */
.sol-sectors { list-style: none; margin: 22px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
.sol-sector {
  display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
  border: 3px solid var(--ink-border); border-radius: var(--radius); padding: 15px 17px;
  background: var(--canvas-panel-grey); text-decoration: none; color: var(--ink-body);
  font-family: var(--font-display); font-size: 17px; font-weight: 600;
  transition: background .15s ease-out, transform .15s ease-out;
}
.sol-sector:hover { background: var(--accent-green); color: var(--btn-ink); transform: translate(-2px, -2px); }
.sol-sector i { font-style: normal; font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .06em; opacity: .7; font-variant-numeric: tabular-nums; }

/* ── Card settore dell'hub ──────────────────────────────────────────────── */
.sol-seccards { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; }
.sol-seccard {
  display: flex; flex-direction: column; gap: 6px; height: 100%;
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-panel-grey); padding: 18px 18px 15px;
  text-decoration: none; color: var(--ink-body);
  transition: background .15s ease-out, transform .15s ease-out, box-shadow .15s ease-out;
}
.sol-seccard:hover { background: var(--canvas-panel-yellow); transform: translate(-2px, -2px); box-shadow: 5px 5px 0 var(--ink-shadow); color: var(--ink-body); }
.sol-seccard:focus-visible { outline: 3px solid var(--accent-green-deep); outline-offset: 3px; }
.sol-seccard__name { font-family: var(--font-display); font-size: 19px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.2; }
/* La promessa e' il titolo della pagina settore: la stessa frase che si trova
   dall'altra parte del clic, cosi' la card non promette niente di suo. */
.sol-seccard__promise { font-size: 13.5px; line-height: 1.45; color: var(--ink-muted); }
.sol-seccard__n { margin-top: auto; padding-top: 8px; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--accent-green-deep); font-variant-numeric: tabular-nums; }

/* ── La riga dei quattro mestieri, in fondo all'hub ─────────────────────── */
.sol-trades { margin-top: clamp(40px, 6vw, 72px); display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px 18px; }
.sol-trades__lbl { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--ink-muted); }
.sol-trades__link { font-size: 14px; color: var(--accent-green-deep); font-weight: 600; text-decoration: none; border-bottom: 1.5px solid transparent; transition: border-color .16s var(--ease); }
.sol-trades__link:hover, .sol-trades__link:focus-visible { border-bottom-color: var(--accent-green-deep); }

/* ── Corpo della pagina soluzione ───────────────────────────────────────── */
.sol-prose { max-width: 660px; font-size: clamp(16px, 1.6vw, 17.5px); line-height: 1.68; color: var(--ink-body); margin: 0; }
.sol-prose + .sol-prose { margin-top: 14px; }

/* ── Da valutare se oggi (autodiagnosi) ─────────────────────────────────── */
.sol-signals__lbl { margin: 22px 0 10px; font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent-green-deep); }
.sol-signals { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; max-width: 720px; }
.sol-signals li { position: relative; padding: 11px 16px 11px 40px; border: 2px solid var(--ink-border); border-radius: var(--radius); background: var(--canvas-panel-grey); font-size: 15.5px; line-height: 1.5; }
/* Casella vuota, non una spunta: sono cose da riconoscere, non risultati gia'
   ottenuti, e una spunta verde le farebbe leggere come promesse mantenute. */
.sol-signals li::before {
  content: ""; position: absolute; left: 15px; top: 15px;
  width: 12px; height: 12px; border: 2px solid var(--accent-green-deep); border-radius: 3px;
}

/* ── Cosa è previsto ────────────────────────────────────────────────────── */
.sol-build { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; max-width: 760px; counter-reset: sol-b; }
.sol-build li { position: relative; padding: 17px 20px 17px 52px; border: 3px solid var(--ink-border); border-radius: var(--radius); background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow); }
.sol-build li::before {
  content: counter(sol-b, decimal-leading-zero);
  counter-increment: sol-b;
  position: absolute; left: 18px; top: 19px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  color: var(--accent-green-deep);
}
.sol-build h3 { font-family: var(--font-display); font-size: 17.5px; font-weight: 600; margin: 0 0 5px; line-height: 1.25; }
.sol-build p { margin: 0; font-size: 15px; line-height: 1.55; color: var(--ink-body); }

/* ── Cosa non è compreso ────────────────────────────────────────────────── */
.sol-excludes { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; max-width: 720px; }
.sol-excludes li { position: relative; padding-left: 26px; font-size: 15.5px; line-height: 1.55; color: var(--ink-muted); }
.sol-excludes li::before {
  content: ""; position: absolute; left: 4px; top: 11px;
  width: 11px; height: 2px; background: var(--ink-muted); opacity: .7;
}

/* ── Fasi e tempi ───────────────────────────────────────────────────────── */
.sol-phases { list-style: none; margin: 0 0 18px; padding: 0 0 0 24px; position: relative; max-width: 760px; }
.sol-phases::before {
  content: ""; position: absolute; left: 5px; top: 14px; bottom: 14px; width: 1px;
  background: color-mix(in srgb, var(--ink-border) 34%, transparent);
}
.sol-phase { position: relative; padding: 12px 0; }
.sol-phase::before {
  content: ""; position: absolute; left: -24px; top: 19px;
  width: 11px; height: 11px; border-radius: 50%;
  background: var(--canvas-page); border: 2px solid var(--accent-green-deep);
}
.sol-phase__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; }
.sol-phase__name { font-family: var(--font-display); font-size: 17.5px; font-weight: 600; }
.sol-phase__when { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--accent-green-deep); padding: 3px 9px; border: 2px solid var(--ink-border); border-radius: 999px; }
.sol-phase__body { margin: 6px 0 0; font-size: 15px; line-height: 1.55; color: var(--ink-body); max-width: 62ch; }

.sol-time { display: flex; align-items: center; gap: 14px; max-width: 760px; border: 3px solid var(--ink-border); border-radius: var(--radius); background: var(--canvas-panel-grey); padding: 18px 20px; font-size: 15.5px; line-height: 1.55; }
.sol-time__mark { flex: none; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent-green-deep); }

/* ── Con cosa si collega ────────────────────────────────────────────────── */
.sol-chips { display: flex; flex-wrap: wrap; gap: 9px; margin: 0; padding: 0; list-style: none; }
.sol-chips li { font-family: var(--font-mono); font-size: 12.5px; font-weight: 700; letter-spacing: .03em; padding: 9px 15px; border: 2px solid var(--ink-border); border-radius: 999px; background: var(--canvas-panel-yellow); }

/* ── Dettagli pratici: escluso, integrazioni e FAQ dietro un details ────── */
.sol-more { max-width: 760px; border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--canvas-panel-grey); }
.sol-more > summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: clamp(16px, 1.8vw, 22px); }
.sol-more > summary::-webkit-details-marker { display: none; }
.sol-more__title { font-family: var(--font-display); font-size: clamp(19px, 2vw, 24px); font-weight: 600; letter-spacing: -0.01em; }
.sol-more__mark { position: relative; flex: 0 0 auto; width: 16px; height: 16px; }
.sol-more__mark::before, .sol-more__mark::after { content: ""; position: absolute; background: var(--accent-green-deep); border-radius: 2px; }
.sol-more__mark::before { top: 7px; left: 0; width: 16px; height: 2.5px; }
.sol-more__mark::after { left: 7px; top: 0; width: 2.5px; height: 16px; transition: transform .2s var(--ease), opacity .2s var(--ease); }
.sol-more[open] .sol-more__mark::after { transform: rotate(90deg); opacity: 0; }
.sol-more__sub { margin: 0; padding: 0 clamp(16px, 1.8vw, 22px) 14px; font-size: 13.5px; line-height: 1.55; color: var(--ink-muted); max-width: 62ch; }
.sol-more__body { padding: 4px clamp(16px, 1.8vw, 22px) clamp(18px, 2vw, 24px); display: grid; gap: clamp(22px, 2.6vw, 32px); }
.sol-more__h { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent-green-deep); margin: 0 0 10px; }
@media (prefers-reduced-motion: reduce) { .sol-more__mark::after { transition: none; } }

/* Le FAQ riusano .faq-list/.faq-item/.faq-q/.faq-a di globals.css: sono lo
   stesso oggetto della home e della pagina prezzi, e duplicarne lo stile
   significherebbe farli divergere alla prima modifica. Qui serve solo togliere
   il margine della sezione autonoma. */
.sol-faq .faq-list { max-width: 760px; }

/* Nota in piccolo (il disclaimer sui concept). Il filetto e' orizzontale e non
   laterale: la barra colorata a sinistra e' il tic piu' riconoscibile delle UI
   generate, e il rilevatore di impeccable la segna come tale. */
.sol-note { margin: 18px 0 0; max-width: 720px; padding-top: 12px; border-top: 2px solid color-mix(in srgb, var(--ink-border) 30%, transparent); font-size: 13px; line-height: 1.6; color: var(--ink-muted); }

@media (max-width: 480px) {
  .sol-card { padding: 17px 16px 16px; }
  .sol-build li { padding: 13px 15px 13px 42px; }
  .sol-time { flex-direction: column; align-items: flex-start; gap: 8px; }
}

@media (prefers-reduced-motion: reduce) {
  .sol-card, .sol-sector { transition: none; }
  .sol-card:hover, .sol-sector:hover { transform: none; }
}
`;
