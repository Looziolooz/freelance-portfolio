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
export type LogoParts = { mark?: boolean; wordmark?: boolean };

export const REAL_LOGOS: Record<string, LogoParts> = {
  // Il tondo giallo con la signora e la fascia rossa: preso dal sito vero del
  // progetto, dove vive come file. Sostituisce una "B" bianca su disco giallo.
  brasilena: { mark: true },
};

export function hasRealMark(slug: string): boolean {
  return REAL_LOGOS[slug]?.mark === true;
}

export function hasRealWordmark(slug: string): boolean {
  return REAL_LOGOS[slug]?.wordmark === true;
}
