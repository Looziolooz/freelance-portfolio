/**
 * Contrasto misurato, non stimato.
 *
 * Il sito colora molte righe con la tinta del marchio del progetto, e finora
 * decideva il colore del testo in due modi che sembrano ragionevoli e non lo
 * sono: una soglia di luminosita' scelta a occhio, e l'opacita' usata per
 * "smorzare" una riga secondaria. Su un fondo chiaro la prima sceglieva il
 * bianco (1,63 su #E8C4A0), la seconda portava sotto soglia righe che a piena
 * forza passavano.
 *
 * Qui il colore lo decide il rapporto di contrasto, con la formula WCAG.
 */

function channels(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hex(r: number, g: number, b: number): string {
  const p = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${p(r)}${p(g)}${p(b)}`;
}

/** Luminanza relativa secondo WCAG 2.1. */
export function luminance(color: string): number {
  const [r, g, b] = channels(color).map((c) => c / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Rapporto di contrasto fra due colori pieni: da 1 (uguali) a 21. */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Il colore di testo migliore fra quelli proposti, sopra un dato fondo.
 * Vince chi misura di piu', non chi sembra piu' giusto.
 */
export function readableOn(bg: string, candidates: string[] = ["#16151A", "#FFFFFF"]): string {
  let best = candidates[0];
  let bestRatio = 0;
  for (const c of candidates) {
    const r = contrast(c, bg);
    if (r > bestRatio) {
      bestRatio = r;
      best = c;
    }
  }
  return best;
}

/**
 * Una riga secondaria vuole essere piu' quieta del titolo. Invece di abbassare
 * l'opacita' a caso, qui il testo si avvicina al fondo finche' puo', e si ferma
 * un passo prima della soglia: quieto quanto la leggibilita' permette.
 *
 * Restituisce un colore pieno, non una trasparenza, cosi' il valore e' quello
 * che il browser misurera' davvero.
 */
export function dimOn(ink: string, bg: string, target = 4.5): string {
  const [ir, ig, ib] = channels(ink);
  const [br, bg_, bb] = channels(bg);
  const at = (t: number) => hex(ir + (br - ir) * t, ig + (bg_ - ig) * t, ib + (bb - ib) * t);

  // Se nemmeno a piena forza ci arriva, il fondo e' il problema: meglio il
  // colore piu' contrastato disponibile che una mezza misura.
  if (contrast(ink, bg) < target) return readableOn(bg, [ink, "#16151A", "#FFFFFF"]);

  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (contrast(at(mid), bg) >= target) lo = mid;
    else hi = mid;
  }
  return at(lo);
}
