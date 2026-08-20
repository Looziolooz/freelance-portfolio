/**
 * Quali file in /brand-logos sono il marchio VERO.
 *
 * Le venti cartelle esistono tutte, ma quasi tutti i file dentro sono
 * ricostruzioni tipografiche generate: il nome del brand scritto in un carattere
 * simile. Sembrano loghi finche' non li si mette accanto a quello vero, e allora
 * si vedono per quello che sono, cioe' lettere.
 *
 * Questo elenco dice quali sono autentici. Chi disegna una copertina o una
 * scheda guideline lo consulta e usa il file solo se e' vero; per tutti gli
 * altri resta il monogramma disegnato, che almeno non finge.
 *
 * Come si aggiunge un marchio: si mette il file in
 * `public/brand-logos/<slug>/` (mark.png per il segno, wordmark.png per il
 * logotipo scritto) e si aggiunge la riga qui sotto. Niente altro.
 */
export type LogoParts = {
  mark?: boolean;
  wordmark?: boolean;
  /** Il colore su cui il marchio e disegnato sul sito del progetto. */
  bg?: string;
};

export const REAL_LOGOS: Record<string, LogoParts> = {
  // Il tondo giallo con la signora e la fascia rossa: preso dal sito vero del
  // progetto, dove vive come file. Sostituisce una "B" bianca su disco giallo.
  brasilena: { mark: true },

  // Fotografati dall insegna dei siti demo, dove il marchio non e un file ma
  // testo composto: e l unico posto in cui esiste. Il fondo e quello del sito,
  // campionato, cosi la copertina puo farne una fascia invece di una figurina.
  // segno e logotipo, presi insieme
  "ai-visibility": { wordmark: true, bg: "#0a0b15" },
  // insegna in maiuscolo spaziato
  "barberia": { wordmark: true, bg: "#050301" },
  // globo piu il nome per esteso
  "bella-calabria": { wordmark: true, bg: "#1c1c1c" },
  // il logotipo; il pay-off ALLA BRACE sul sito sta altrove
  "brado": { wordmark: true, bg: "#1c150e" },
  // il riquadro con le due righe, come sul sito
  "buss-travel": { wordmark: true, bg: "#3b5253" },
  // Artigiano con la riga GELATERIA · DAL 1978
  "gelateria": { wordmark: true, bg: "#813535" },
  // piccolo in origine, non ingrandito per non sfocarlo
  "mirzz": { wordmark: true, bg: "#6cbf7b" },
  // NORDBAGERIET con SEDAN 1952; l emblema della spiga sta fuori dal link
  "nordbageriet": { wordmark: true, bg: "#0f1c18" },
  // Lievita, con TROPEA · DAL 2014
  "pizzeria-restaurant": { wordmark: true, bg: "#ffffff" },
  // Golden Dragon con TABLE GRILL & SUSHI; il sigillo rosso sta fuori dal link
  "sushi": { wordmark: true, bg: "#f2eee4" },
  // VESPA · HERITAGE
  "vespa-heritage": { wordmark: true, bg: "#3a3d3f" },
  // il cerchio concentrico piu Prana
  "yoga": { wordmark: true, bg: "#171e19" },
};

export function hasRealMark(slug: string): boolean {
  return REAL_LOGOS[slug]?.mark === true;
}

export function hasRealWordmark(slug: string): boolean {
  return REAL_LOGOS[slug]?.wordmark === true;
}

/** Il fondo del marchio, se il file lo porta con se. */
export function logoBg(slug: string): string | undefined {
  return REAL_LOGOS[slug]?.bg;
}
