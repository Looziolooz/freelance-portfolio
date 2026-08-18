"use client";

import { useLang } from "./LangProvider";

// A full-width band of one infinitely scrolling row, skewed off the horizontal.
//
// Extracted rather than written: the cinematic footer already had this exact
// thing built into it, absolutely positioned and tangled up with the footer's
// own colours. It is now one component that the footer uses and that can be
// dropped between any two sections.
//
// Three details are doing the real work.
//
// **Two tilts, because they are not the same look.** `rotate(-2deg) scale(1.06)`
// turns the whole band, letters included, and needs the scale to cover the
// triangular gaps rotation opens at the left and right edges. That is what the
// cinematic footer has always looked like, so `tilt="rotate"` is its default and
// nothing about it changed.
//
// `tilt="skew"` is the other one: skewX keeps the top and bottom edges horizontal
// and slants only the sides, which run off screen at full width, so no scale is
// needed. Skewing the container would drag the letters into a fake italic, so the
// inner row is counter-skewed and the type stands up straight inside a leaning
// band. That is the shape for a standalone full-width section.
//
// **The row is duplicated, and the copy is hidden from assistive tech.** A
// seamless loop needs two copies so the second is in place when the first
// leaves, and the animation travels exactly -50%. The footer read BOTH copies to
// a screen reader, so the whole term list was announced twice; here the second
// carries `aria-hidden`.
//
// **It stops.** Paused on hover, because text moving under a cursor that wants to
// read it is hostile, and no animation at all under `prefers-reduced-motion`.

const CSS = `
/* The wrapper exists to swallow the horizontal overhang: a tilted full-width
   band sticks out past 100% and the page picks up a pixel or two of scroll.
   Measured: body 1441 against a 1440 viewport.
   Two details, both learned the hard way.
   overflow-x:clip and NOT overflow:hidden, because hidden clips BOTH axes and a
   rotated band is taller than its own box: hidden sliced the diagonal into a
   horizontal strip with its letters cut off top and bottom.
   And the wrapper needs vertical room for that overhang, which grows with the
   viewport (width x sin(angle)), so it is padded in vw rather than px. */
.mqb-clip {
  width: 100%;
  overflow-x: clip;
  padding-block: var(--mqb-room, 5.5vw);
}

.mqb {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-top: 3px solid var(--mqb-line, var(--ink-border));
  border-bottom: 3px solid var(--mqb-line, var(--ink-border));
  background: var(--mqb-bg, var(--canvas-panel-yellow));
  color: var(--mqb-ink, var(--ink-muted));
  padding: var(--mqb-pad, 12px) 0;
}
.mqb--rotate { transform: rotate(var(--mqb-angle, -2deg)) scale(var(--mqb-scale, 1.06)); box-shadow: var(--shadow-card); }
.mqb--skew { transform: skewX(var(--mqb-angle, -2deg)); }
.mqb__track {
  display: inline-flex;
  width: max-content;
  font-family: var(--font-mono);
  font-size: var(--mqb-size, 22px);
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  white-space: nowrap;
  animation: mqb-scroll var(--mqb-speed, 38s) linear infinite;
}
.mqb:hover .mqb__track { animation-play-state: paused; }
.mqb__row { display: inline-flex; align-items: center; }
.mqb__term { padding: 0 26px; }
.mqb__sep { color: var(--mqb-accent, var(--accent-green-deep)); }

/* Two keyframe sets, because the skew variant has to keep counter-skewing the
   row while it travels, and one transform property cannot hold both.
   (No backticks in this block: it is a JS template literal and one would end it.) */
@keyframes mqb-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes mqb-scroll-skew {
  from { transform: skewX(calc(var(--mqb-angle, -2deg) * -1)) translateX(0); }
  to   { transform: skewX(calc(var(--mqb-angle, -2deg) * -1)) translateX(-50%); }
}
.mqb--skew .mqb__track {
  transform: skewX(calc(var(--mqb-angle, -2deg) * -1));
  animation-name: mqb-scroll-skew;
}

@media (prefers-reduced-motion: reduce) {
  .mqb__track { animation: none; }
}
`;

function Row({ terms, hidden }: { terms: string[]; hidden?: boolean }) {
  return (
    <div className="mqb__row" aria-hidden={hidden || undefined}>
      {terms.map((term, i) => (
        <span key={i} className="mqb__row">
          <span className="mqb__term">{term}</span>
          <span className="mqb__sep" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export default function MarqueeBand({
  terms,
  tilt = "rotate",
  angle = "-6deg",
  speed = "38s",
  size,
  pad,
  room,
  background,
  ink,
  line,
  accent,
  className,
  style,
}: {
  /** Defaults to the site ticker terms when omitted. */
  terms?: string[];
  /**
   * `rotate` turns the whole band and scales it slightly to cover the corner
   * gaps: the cinematic footer's long-standing look, and the default so that
   * nothing changes for it. `skew` slants the sides only and keeps the type
   * upright, which is the shape for a standalone full-width section.
   */
  tilt?: "rotate" | "skew";
  /** Type size inside the band. */
  size?: string;
  /** Vertical padding, which is what makes the band itself taller. */
  pad?: string;
  /** Clear space above and below, for the tilt to lean into. */
  room?: string;
  /** Skew angle, as a CSS angle. The spec calls for -2deg. */
  angle?: string;
  /** One full loop of the doubled track. */
  speed?: string;
  background?: string;
  ink?: string;
  line?: string;
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { t } = useLang();
  const items =
    terms && terms.length > 0
      ? terms
      : Array.from({ length: 10 }, (_, i) => t(`ticker.${i}`)).filter(Boolean);

  if (items.length === 0) return null;

  // The custom properties belong on the WRAPPER, not on the band. `--mqb-room`
  // is read by `.mqb-clip` itself, and CSS variables inherit downwards only:
  // set on the child, the wrapper silently kept its fallback and no value of
  // `room` moved anything. The band still sees every variable by inheritance.
  const vars = {
    "--mqb-angle": angle,
    "--mqb-speed": speed,
    // A steeper rotation needs a bigger cover scale or daylight shows at the
    // corners. 1 + |angle| / 22 keeps up: 1.06 at 2 degrees, 1.27 at 6.
    "--mqb-scale": tilt === "rotate" ? 1 + Math.abs(parseFloat(angle)) / 22 : 1,
    ...(size ? { "--mqb-size": size } : null),
    ...(pad ? { "--mqb-pad": pad } : null),
    ...(room ? { "--mqb-room": room } : null),
    ...(background ? { "--mqb-bg": background } : null),
    ...(ink ? { "--mqb-ink": ink } : null),
    ...(line ? { "--mqb-line": line } : null),
    ...(accent ? { "--mqb-accent": accent } : null),
    ...style,
  } as React.CSSProperties;

  return (
    <div className="mqb-clip" style={vars}>
    <div className={`mqb mqb--${tilt} ${className ?? ""}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mqb__track">
        <Row terms={items} />
        <Row terms={items} hidden />
      </div>
    </div>
    </div>
  );
}
