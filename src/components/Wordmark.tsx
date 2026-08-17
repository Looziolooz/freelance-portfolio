// The studio mark: LO.oz, where the only colour in the whole name is the dot.
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
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      LO<span className="wm-dot">.</span>oz
    </span>
  );
}
