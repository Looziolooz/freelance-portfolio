// The studio mark: LO.oz as a STAMP — the name inside a bordered lozenge with
// the site's hard offset shadow, and "design" alongside behind a hairline.
//
// Chosen from four directions. The reason it won: the mark now speaks the same
// language as every button and panel on the site (3px ink border, offset
// shadow) instead of being loose text that happened to sit above them. What it
// costs is width in the top bar, which is why `suffix` exists.
//
// The dot is untouched. Its ink ring is eight em-based shadows built to scale
// from 24px to 160px, and it is what already tied the name to those same
// borders. The frame changed; the detail did not.
//
// The Ø experiment is parked (see the trial page): slashing both O's turned the
// name into a face, and a face competes with the work it sits above. What the
// trial did settle is that the mark needs exactly one accent, and the dot is the
// right carrier — it is the smallest mark in the word, it already separates the
// two halves of the name, and colouring it costs no legibility because nothing
// depends on reading it.
//
// The colour lives in --wordmark-dot, not inline, so the whole identity changes
// in one line rather than in three components.
//
// Also here so the mark is drawn identically everywhere: it previously existed
// as loose text in the nav, the footer and the laptop screen, which is three
// places to drift apart the first time one is edited. The name is the same in
// Italian, English and Swedish, so it is deliberately not routed through i18n —
// a "translation" that repeats one string three times is somewhere to fall out
// of sync, not a feature.
export default function Wordmark({
  className,
  suffix = true,
  compact = false,
}: {
  className?: string;
  /** La parola "design" accanto al nome. Si spegne dove lo spazio non c'e'. */
  suffix?: boolean;
  /**
   * Taglia compatta: bordo piu' sottile e ombra piu' corta, per quando il
   * marchio sta dentro una riga di testo invece che da solo. Senza, la
   * pastiglia legge come un bottone caduto in mezzo a un paragrafo.
   */
  compact?: boolean;
}) {
  return (
    <span
      className={`wm-stamp${compact ? " wm-stamp--compact" : ""}${className ? ` ${className}` : ""}`}
    >
      <span className="wm-stamp__name">
        LO<span className="wm-dot">.</span>oz
      </span>
      {suffix && <span className="wm-stamp__suffix">design</span>}
    </span>
  );
}
