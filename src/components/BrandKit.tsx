"use client";

import Link from "next/link";
import { useLang } from "./LangProvider";
import BrandBento from "./BrandBento";
import type { BrandKit as Kit, BrandMotif } from "@/lib/brand-kits";

// On-page brand identity showcase for a project detail page: a custom monogram
// system, the full colour palette with roles, and print-ready stationery mockups.
// Brand colours are scoped to this section via CSS variables (set on the root),
// so the rest of the site keeps its own palette. The shared presentational pieces
// (Monogram / Motif / BrandPalette / Stationery) are reused by the printable
// brand sheet at /work/[slug]/brand-sheet.

type Variant = "solid" | "reverse" | "outline";

// ---- Motif (small brand mark) -------------------------------------------------
export function Motif({ name, size = 26 }: { name: BrandMotif; size?: number }) {
  if (name === "none") return null;
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
  const s = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "sun":
      return (<svg {...p}><circle cx="12" cy="12" r="4.2" {...s} /><g {...s}>{[0,45,90,135,180,225,270,315].map(a=>{const r=(a*Math.PI)/180;return <line key={a} x1={12+Math.cos(r)*7} y1={12+Math.sin(r)*7} x2={12+Math.cos(r)*9.5} y2={12+Math.sin(r)*9.5}/>;})}</g></svg>);
    case "laurel":
      return (<svg {...p}><g {...s}><path d="M12 21 V8"/><path d="M12 18c-3 0-5-2-5-4 2 0 5 1 5 4z"/><path d="M12 18c3 0 5-2 5-4-2 0-5 1-5 4z"/><path d="M12 13c-2.6 0-4.3-1.7-4.3-3.4 1.7 0 4.3.8 4.3 3.4z"/><path d="M12 13c2.6 0 4.3-1.7 4.3-3.4-1.7 0-4.3.8-4.3 3.4z"/></g></svg>);
    case "scooter":
      return (<svg {...p}><g {...s}><circle cx="6" cy="16" r="3"/><circle cx="18" cy="16" r="3"/><path d="M6 16h6l2-6h3"/><path d="M12 10l1.6 6"/><path d="M9 10h4"/></g></svg>);
    case "boot":
      return (<svg {...p}><path d="M9 3v9l-3 3 0 4 5 0 0-3 4-3 0-10z" {...s}/></svg>);
    case "razor":
      return (<svg {...p}><g {...s}><path d="M4 18l8-8 4 1-9 9z"/><path d="M16 11l4-4"/></g></svg>);
    case "cone":
      return (<svg {...p}><g {...s}><path d="M7.5 9a4.5 4.5 0 0 1 9 0z"/><path d="M7.5 9l4.5 11 4.5-11"/></g></svg>);
    case "signal":
      return (<svg {...p}><g {...s}><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><path d="M8.5 8.5a5 5 0 0 0 0 7"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M6 6a8.5 8.5 0 0 0 0 12"/><path d="M18 6a8.5 8.5 0 0 1 0 12"/></g></svg>);
    case "wave":
      return (<svg {...p}><path d="M3 13c2-3 4-3 6 0s4 3 6 0 4-3 6 0" {...s}/></svg>);
    case "flame":
      return (<svg {...p}><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 1 2 2 2 0-2-0-4 0-6z" {...s}/></svg>);
    case "leaf":
      return (<svg {...p}><g {...s}><path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14z"/><path d="M5 19c4-4 7-6 11-8"/></g></svg>);
    default:
      return null;
  }
}

// ---- Monogram mark ------------------------------------------------------------
function variantColors(kit: Kit, v: Variant) {
  if (v === "solid") return { bg: kit.primary, fg: kit.paper, border: kit.primary };
  if (v === "reverse") return { bg: kit.ink, fg: kit.paper, border: kit.ink };
  return { bg: kit.paper, fg: kit.ink, border: kit.ink }; // outline
}

export function Monogram({ kit, variant = "solid", size = 120 }: { kit: Kit; variant?: Variant; size?: number }) {
  const c = variantColors(kit, variant);
  const isRing = kit.shape === "ring";
  const isShield = kit.shape === "shield";
  const radius = kit.shape === "circle" || kit.shape === "ring" ? "50%" : kit.shape === "square" ? "16%" : "0";

  const style: React.CSSProperties = {
    width: size,
    height: size,
    display: "grid",
    placeItems: "center",
    fontFamily: kit.display,
    fontWeight: 600,
    fontSize: size * (kit.monogram.length > 1 ? 0.4 : 0.5),
    letterSpacing: kit.monogram.length > 1 ? "0.02em" : "0",
    lineHeight: 1,
    borderRadius: radius,
    background: isRing ? c.bg : c.bg,
    color: isRing ? c.border : c.fg,
    border: variant === "outline" ? `2.5px solid ${c.border}` : isRing ? `${Math.max(3, size * 0.06)}px solid ${c.border}` : "none",
    boxShadow: isRing ? `inset 0 0 0 2px ${c.border}` : "none",
    clipPath: isShield ? "polygon(50% 0%, 100% 24%, 100% 62%, 50% 100%, 0% 62%, 0% 24%)" : undefined,
    userSelect: "none",
  };
  if (isShield) { style.background = c.bg; style.color = c.fg; style.border = "none"; style.boxShadow = "none"; }

  return <span style={style} aria-hidden="true">{kit.monogram}</span>;
}

// ---- Palette ------------------------------------------------------------------
export function BrandPalette({ kit }: { kit: Kit }) {
  const { t } = useLang();
  return (
    <div className="bk-palette">
      {kit.palette.map((c) => (
        <div key={c.hex} className="bk-swatch" style={{ background: c.hex, color: c.on }}>
          <span className="bk-swatch__role">{t(`brandkit.role.${c.role}`)}</span>
          <span className="bk-swatch__name">{c.name}</span>
          <span className="bk-swatch__hex">{c.hex.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Stationery (CSS mockups) -------------------------------------------------
export function Stationery({ kit }: { kit: Kit }) {
  const { t } = useLang();
  return (
    <div className="bk-stationery">
      {/* Business card — front */}
      <figure className="bk-mock">
        <div className="bk-card bk-card--front" style={{ background: kit.paper, color: kit.ink }}>
          <div className="bk-card__top" style={{ color: kit.primary }}>
            <Monogram kit={kit} variant="outline" size={34} />
            <span className="bk-card__name" style={{ fontFamily: kit.display, letterSpacing: kit.tracking }}>{kit.name}</span>
          </div>
          <span className="bk-card__tag" style={{ color: kit.ink }}>{kit.tagline}</span>
          <span className="bk-card__rule" style={{ background: kit.accent }} />
          <span className="bk-card__contact">{kit.domain}</span>
        </div>
        <figcaption className="bk-mock__cap">{t("brandkit.card.front")}</figcaption>
      </figure>

      {/* Business card — back */}
      <figure className="bk-mock">
        <div className="bk-card bk-card--back" style={{ background: kit.primary, color: kit.paper }}>
          <Monogram kit={kit} variant="reverse" size={46} />
        </div>
        <figcaption className="bk-mock__cap">{t("brandkit.card.back")}</figcaption>
      </figure>

      {/* Letterhead */}
      <figure className="bk-mock">
        <div className="bk-letter" style={{ background: kit.paper, color: kit.ink }}>
          <div className="bk-letter__head">
            <span style={{ color: kit.primary, display: "inline-flex" }}><Motif name={kit.motif} size={18} /></span>
            <span className="bk-letter__name" style={{ fontFamily: kit.display, letterSpacing: kit.tracking, color: kit.primary }}>{kit.name}</span>
          </div>
          <div className="bk-letter__lines">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} style={{ background: kit.ink, opacity: i === 0 ? 0.5 : 0.16, width: i === 0 ? "42%" : i === 6 ? "60%" : "100%" }} />
            ))}
          </div>
          <span className="bk-letter__foot" style={{ borderTop: `2px solid ${kit.accent}`, color: kit.ink }}>{kit.domain}</span>
        </div>
        <figcaption className="bk-mock__cap">{t("brandkit.letterhead")}</figcaption>
      </figure>

      {/* Envelope */}
      <figure className="bk-mock">
        <div className="bk-env" style={{ background: kit.paper, color: kit.ink, borderColor: kit.ink }}>
          <span className="bk-env__flap" style={{ borderTopColor: kit.accent }} />
          <div className="bk-env__from">
            <Monogram kit={kit} variant="solid" size={26} />
            <span style={{ fontFamily: kit.display, letterSpacing: kit.tracking, fontSize: 11 }}>{kit.name}</span>
          </div>
          <div className="bk-env__addr">
            <span style={{ background: kit.ink, opacity: 0.5 }} />
            <span style={{ background: kit.ink, opacity: 0.22 }} />
            <span style={{ background: kit.ink, opacity: 0.22 }} />
          </div>
        </div>
        <figcaption className="bk-mock__cap">{t("brandkit.envelope")}</figcaption>
      </figure>
    </div>
  );
}

// ---- Section ------------------------------------------------------------------
export default function BrandKit({
  kit,
  siteImage,
  siteVideo,
}: {
  kit: Kit;
  siteImage?: string;
  siteVideo?: string;
}) {
  const { t } = useLang();
  const vars = {
    ["--bk-paper"]: kit.paper,
    ["--bk-ink"]: kit.ink,
    ["--bk-primary"]: kit.primary,
    ["--bk-accent"]: kit.accent,
  } as React.CSSProperties;

  return (
    <section className="bkit" style={vars} aria-label={t("brandkit.title")}>
      <header className="bkit-head">
        <span className="bkit-eyebrow">{t("brandkit.eyebrow")}</span>
        <h2 className="bkit-title" style={{ fontFamily: kit.display, letterSpacing: kit.tracking }}>{kit.name}</h2>
        <p className="bkit-sub">{t("brandkit.sub")}</p>
      </header>

      {/* Monogram system */}
      <div className="bkit-block">
        <span className="bkit-block__label"><i>01</i> {t("brandkit.monogram")}</span>
        <div className="bk-marks">
          <div className="bk-mark-cell" style={{ background: kit.paper }}><Monogram kit={kit} variant="solid" size={120} /></div>
          <div className="bk-mark-cell" style={{ background: kit.ink }}><Monogram kit={kit} variant="reverse" size={88} /></div>
          <div className="bk-mark-cell" style={{ background: kit.paper }}><Monogram kit={kit} variant="outline" size={88} /></div>
          <div className="bk-mark-cell bk-mark-cell--word" style={{ background: kit.paper, color: kit.primary }}>
            <span style={{ display: "inline-flex", color: kit.accent }}><Motif name={kit.motif} size={28} /></span>
            <span className="bk-wordmark" style={{ fontFamily: kit.display, letterSpacing: kit.tracking, color: kit.ink }}>{kit.name}</span>
            <span className="bk-wordmark__tag" style={{ color: kit.primary }}>{kit.tagline}</span>
          </div>
        </div>
      </div>

      {/* Type direction */}
      <div className="bkit-block">
        <span className="bkit-block__label"><i>02</i> {t("brandkit.type")}</span>
        <div className="bkit-type">
          <div className="bkit-type__col">
            <span className="bkit-type__aa" style={{ fontFamily: kit.display, color: kit.primary }}>Aa</span>
            <div className="bkit-type__meta">
              <span className="bkit-type__role">{t("brandkit.type.display")}</span>
              <span className="bkit-type__spec" style={{ fontFamily: kit.display, letterSpacing: kit.tracking, color: kit.ink }}>{kit.name}</span>
            </div>
          </div>
          <div className="bkit-type__col">
            <span className="bkit-type__aa" style={{ fontFamily: kit.body, color: kit.ink }}>Aa</span>
            <div className="bkit-type__meta">
              <span className="bkit-type__role">{t("brandkit.type.body")}</span>
              <span className="bkit-type__spec" style={{ fontFamily: kit.body, color: kit.ink }}>ABCDEFG abcdefg 0123456789</span>
            </div>
          </div>
        </div>
      </div>

      {/* Palette */}
      <div className="bkit-block">
        <span className="bkit-block__label"><i>03</i> {t("brandkit.palette")}</span>
        <BrandPalette kit={kit} />
      </div>

      {/* Stationery */}
      <div className="bkit-block">
        <span className="bkit-block__label"><i>04</i> {t("brandkit.stationery")}</span>
        <Stationery kit={kit} />
      </div>

      {/* Applications showcase (bento mood board) */}
      <div className="bkit-block">
        <span className="bkit-block__label"><i>05</i> {t("brandkit.applications")}</span>
        <BrandBento kit={kit} siteImage={siteImage} siteVideo={siteVideo} />
      </div>

      <Link href={`/work/${kit.slug}/brand-sheet`} className="bkit-download">
        {t("brandkit.download")} <span aria-hidden="true">↓</span>
      </Link>
    </section>
  );
}
