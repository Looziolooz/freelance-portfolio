// The single section-header for the whole site. Two visual variants share one
// markup/typography contract so sections read as one system:
//   - "plain"  → mono eyebrow + Fraunces title + optional muted sub (funnel
//                sections: Trust, Method, FAQ, Audit). tone="ink" flips the
//                colours for headers sitting on the ochre Audit panel.
//   - "badge"  → boxed number badge + rule + title (legacy index pattern).
// Replaces the per-section bespoke headers (.trust-head/.faq-head/.lead-copy/…).

type Props = {
  eyebrow: string;
  title: string;
  sub?: string;
  variant?: "plain" | "badge";
  tone?: "default" | "ink";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  sub,
  variant = "plain",
  tone = "default",
  className,
}: Props) {
  if (variant === "badge") {
    return (
      <div className={["section-head", className].filter(Boolean).join(" ")}>
        <span className="section-head__num">{eyebrow}</span>
        <h2 className="section-head__title">{title}</h2>
        {sub && (
          <span className="label" style={{ alignSelf: "end", textAlign: "right" }}>
            {sub}
          </span>
        )}
      </div>
    );
  }

  return (
    <header
      className={["sec-head", tone === "ink" ? "sec-head--ink" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="sec-head__eyebrow">{eyebrow}</span>
      <h2 className="sec-head__title">{title}</h2>
      {sub && <p className="sec-head__sub">{sub}</p>}
    </header>
  );
}
