"use client";

import { useId } from "react";
import Image from "next/image";
import { Motif } from "./BrandKit";
import { merchSrc, type MerchPhoto } from "@/lib/brand-merch";
import { onColor, type BrandKit as Kit } from "@/lib/brand-kits";

// Visual examples for the client-facing pages of the brand manual: the mark in
// the places a client actually recognises (a social avatar, a browser tab, a
// sign over the door, a stamp), and the things you can hold (a team tee, a cap,
// an apron, a tote, a sticker, a name badge).
//
// Everything is drawn from the kit — no photography, no external asset — so a
// brand gets its own merch board the moment its colours exist.

// ---- The same objects, photographed ------------------------------------------
// Where a brand has real photographs of its merch they run right through the
// document — the cover, the mark page, the type page, the board, the merch page
// — because "here is the identity on things you can hold" is the argument the
// whole manual is making, and a drawing only ever illustrates it.
//
// Contained, not cropped. The photos arrive at every aspect from 0.56 to 2.24;
// `cover` in a square tile would slice a wordmark in half, and a half-wordmark
// in a brand manual is worse than no photograph. Each tile is painted the
// photo's own edge colour instead (see lib/brand-merch.ts), so the letterbox
// band reads as part of the shot rather than as a gap.
export function MerchPhotos({
  slug,
  photos,
  alt,
  className,
  sizes = "(max-width: 760px) 30vw, 180px",
}: {
  slug: string;
  photos: MerchPhoto[];
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (photos.length === 0) return null;
  return (
    <div className={`bm-photos ${className ?? ""}`}>
      {photos.map((photo) => (
        <span key={photo.i} className="bm-photo" style={{ background: photo.bg }}>
          <Image
            src={merchSrc(slug, photo)}
            alt={alt}
            fill
            sizes={sizes}
            loading="lazy"
            style={{ objectFit: "contain" }}
          />
        </span>
      ))}
    </div>
  );
}

// ---- The mark where a client sees it ------------------------------------------
export function LogoInUse({ kit, labels }: { kit: Kit; labels: [string, string, string, string] }) {
  const onPrimary = onColor(kit, kit.primary);
  const onInk = onColor(kit, kit.ink);

  return (
    <div className="bm-use">
      {/* Social avatar */}
      <figure>
        <div className="bm-use__cell" style={{ background: kit.paper }}>
          <span className="bm-avatar" style={{ background: kit.primary, color: onPrimary, fontFamily: kit.display }}>
            {kit.monogram}
          </span>
          <span className="bm-avatar__handle" style={{ color: kit.ink }}>@{kit.domain.split(".")[0]}</span>
        </div>
        <figcaption>{labels[0]}</figcaption>
      </figure>

      {/* Browser tab */}
      <figure>
        <div className="bm-use__cell" style={{ background: kit.paper }}>
          <span className="bm-tab" style={{ background: kit.paper, borderColor: `color-mix(in srgb, ${kit.ink} 22%, transparent)`, color: kit.ink }}>
            <i style={{ background: kit.primary, color: onPrimary, fontFamily: kit.display }}>{kit.monogram.slice(0, 1)}</i>
            {kit.name}
          </span>
        </div>
        <figcaption>{labels[1]}</figcaption>
      </figure>

      {/* Sign over the door */}
      <figure>
        <div className="bm-use__cell bm-use__cell--wall">
          <span className="bm-sign" style={{ background: kit.ink, color: onInk }}>
            <span style={{ display: "inline-flex", color: kit.accent }}><Motif name={kit.motif} size={15} /></span>
            <span style={{ fontFamily: kit.display, letterSpacing: kit.tracking }}>{kit.name}</span>
          </span>
        </div>
        <figcaption>{labels[2]}</figcaption>
      </figure>

      {/* Stamp */}
      <figure>
        <div className="bm-use__cell" style={{ background: kit.paper }}>
          <span className="bm-stamp" style={{ borderColor: kit.primary, color: kit.primary, fontFamily: kit.display }}>
            {kit.monogram}
          </span>
        </div>
        <figcaption>{labels[3]}</figcaption>
      </figure>
    </div>
  );
}

// ---- Wearables and giveaways --------------------------------------------------
// Objects, not clip-art. Three things do the work, and they are exactly what the
// first version was missing:
//
//   1. AIR. Every shape is inset to roughly 3–21 of the 24-unit box, and the cell
//      carries a full em of padding, so nothing grazes the tile border. The
//      complaint that they "came out of the edges" was not clipping — measured at
//      five widths, no shape ever left the viewBox — it was objects drawn hard
//      against it.
//   2. LIGHT. One colour-agnostic gradient (white at the top-left, black at the
//      bottom-right, both at low opacity) laid over the garment's own fill, so a
//      near-white tote and a near-black tee each get a lit side and a shaded one
//      with no colour maths and no per-brand tuning.
//   3. CONTACT. A soft ellipse under each object. Without it a silhouette floats
//      in a swatch; with it, it sits on a surface.
//
// Then each object is built like the real thing — collar and hem on a tee, panel
// seams and a top button on a cap, two handles and a base seam on a tote, a
// sleeve on the cup, a die-cut sheet for the stickers — and the printed mark is
// the size a printer would actually use: small and high on the chest, not a
// chest-wide word. Eight identical centred monograms is what made them read as
// one object drawn eight times.

const TEE = "M9.2 4 5.2 6 3.4 10.9l2.9 1v8.7h11.4v-8.7l2.9-1L18.8 6l-4-2a3.1 3.1 0 0 1-5.6 0Z";
const APRON = "M9.6 4.4a2.5 2.5 0 0 0 4.8 0l2.9 1.7v2.8l-1.8.9v9.9a.7.7 0 0 1-.7.7H8.8a.7.7 0 0 1-.7-.7v-9.9l-1.8-.9V6.1Z";
const TOTE = "M6 9.4h12v11.2H6Z";
const CUP = "M7.4 9.2h9.2l-1.1 10.7a1 1 0 0 1-1 .9H9.5a1 1 0 0 1-1-.9Z";
const COLLAR = "M9.2 4a3.1 3.1 0 0 0 5.6 0";

/** Lit top-left, shaded bottom-right. Reads on any fill, light or dark. */
function Shading({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.02" />
        <stop offset="1" stopColor="#000" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  );
}

function Item({
  label,
  ground,
  shadeId,
  contact = 6.4,
  children,
}: {
  label: string;
  ground: string;
  shadeId: string;
  /** Half-width of the contact shadow, in viewBox units. */
  contact?: number;
  children: React.ReactNode;
}) {
  return (
    <figure>
      <div className="bm-cell" style={{ background: ground }}>
        <svg viewBox="0 0 24 24" className="bm-garment" aria-hidden="true">
          <Shading id={shadeId} />
          <ellipse cx="12" cy="21.9" rx={contact} ry="0.62" fill="#000" opacity="0.13" />
          {children}
        </svg>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export function Merch({ kit, labels }: { kit: Kit; labels: string[] }) {
  const { primary, accent, paper, ink, display, name, monogram, domain } = kit;
  const onPrimary = onColor(kit, primary);
  const onInk = onColor(kit, ink);
  const onAccent = onColor(kit, accent);
  const seam = `color-mix(in srgb, ${ink} 26%, transparent)`;
  const word = name.split(" ")[0].toUpperCase();
  const shade = `${useId().replace(/:/g, "")}-shade`;
  const lit = `url(#${shade})`;

  // Three grounds in rotation, so a row of eight tiles has a rhythm instead of
  // eight identical grey squares.
  const g1 = `color-mix(in srgb, ${ink} 7%, ${paper})`;
  const g2 = `color-mix(in srgb, ${accent} 22%, ${paper})`;
  const g3 = `color-mix(in srgb, ${primary} 11%, ${paper})`;

  return (
    <div className="bm-grid">
      {/* Tee in the house colour — collar, sleeve seams, hem, and the mark where
          it is really printed: small, high, left of centre. */}
      <Item label={labels[0]} ground={g1} shadeId={shade}>
        <path d={TEE} fill={primary} />
        <path d={TEE} fill={lit} />
        <path d={COLLAR} fill="none" stroke={seam} strokeWidth="0.4" />
        <path d="M6.3 11.9 8 11.3M17.7 11.9 16 11.3M6.9 18.9h10.2" fill="none" stroke={seam} strokeWidth="0.3" />
        <text x="9.1" y="10.6" fontSize="1.5" fontFamily={display} fill={onPrimary}>{monogram}</text>
      </Item>

      {/* Dark tee — a chest print at a printable width, not a chest-wide word */}
      <Item label={labels[1]} ground={g2} shadeId={shade}>
        <path d={TEE} fill={ink} />
        <path d={TEE} fill={lit} />
        <path d={COLLAR} fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.4" />
        <text x="12" y="13.3" textAnchor="middle" fontSize="1.35" fontFamily={display} fill={onInk} letterSpacing="0.1">{word}</text>
        <path d="M9.7 14.2h4.6" stroke={accent} strokeWidth="0.32" />
        <path d="M6.9 18.9h10.2" stroke="#fff" strokeOpacity="0.12" strokeWidth="0.3" />
      </Item>

      {/* Apron — neck loop, waist ties, a stitched pocket, the name above it */}
      <Item label={labels[2]} ground={g3} shadeId={shade} contact={5.6}>
        <path d="M9.6 4.4a2.5 2.5 0 0 1 4.8 0" fill="none" stroke={seam} strokeWidth="0.42" />
        <path d={APRON} fill={accent} />
        <path d={APRON} fill={lit} />
        <path d="M6.3 11.4 3.6 12.6M17.7 11.4l2.7 1.2" fill="none" stroke={seam} strokeWidth="0.42" />
        <rect x="9.3" y="14.4" width="5.4" height="3.6" rx="0.3" fill="none" stroke={seam} strokeWidth="0.34" />
        <path d="M9.3 15.2h5.4" stroke={seam} strokeWidth="0.24" />
        <text x="12" y="13.2" textAnchor="middle" fontSize="1.25" fontFamily={display} fill={onAccent} letterSpacing="0.1">{word}</text>
      </Item>

      {/* Cap — panel seams, a top button, brim in the house colour */}
      <Item label={labels[3]} ground={g1} shadeId={shade} contact={5.2}>
        <path d="M5.2 15.6a6.8 6.8 0 0 1 13.6 0Z" fill={ink} />
        <path d="M5.2 15.6a6.8 6.8 0 0 1 13.6 0Z" fill={lit} />
        <path d="M12 8.8v6.8M8.9 9.7l-1 5.9M15.1 9.7l1 5.9" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="0.3" />
        <circle cx="12" cy="8.9" r="0.42" fill={primary} />
        <path d="M4.6 15.6h15.3a1.5 1.5 0 0 1 0 3H4.6Z" fill={primary} />
        <path d="M4.6 15.6h15.3a1.5 1.5 0 0 1 0 3H4.6Z" fill={lit} />
        <text x="12" y="14.2" textAnchor="middle" fontSize="2.1" fontFamily={display} fill={onInk}>{monogram.slice(0, 1)}</text>
      </Item>

      {/* Tote — two handles, a base seam, the name at poster size */}
      <Item label={labels[4]} ground={g2} shadeId={shade} contact={6}>
        <path d="M8.6 9.4V7.7a1.5 1.5 0 0 1 3 0v1.7M12.4 9.4V7.7a1.5 1.5 0 0 1 3 0v1.7" fill="none" stroke={seam} strokeWidth="0.5" />
        <path d={TOTE} fill={paper} />
        <path d={TOTE} fill={lit} />
        <path d={TOTE} fill="none" stroke={seam} strokeWidth="0.36" />
        <path d="M6 19.3h12" stroke={seam} strokeWidth="0.26" />
        <text x="12" y="15.6" textAnchor="middle" fontSize="1.9" fontFamily={display} fill={ink} letterSpacing="0.04">{word}</text>
      </Item>

      {/* Takeaway cup — lid rim, a sleeve in the house colour, the mark on it */}
      <Item label={labels[5]} ground={g3} shadeId={shade} contact={4.6}>
        <path d={CUP} fill={paper} />
        <path d="M8.1 13.4h7.8l-.42 4.3H8.5Z" fill={primary} />
        <text x="12" y="16.6" textAnchor="middle" fontSize="1.7" fontFamily={display} fill={onPrimary}>{monogram}</text>
        <path d={CUP} fill={lit} />
        <rect x="6.5" y="6.6" width="11" height="2.6" rx="0.7" fill={ink} />
        <rect x="6.5" y="6.6" width="11" height="2.6" rx="0.7" fill={lit} />
        <rect x="7.4" y="9.2" width="9.2" height="0.45" fill="#000" opacity="0.16" />
      </Item>

      {/* Stickers — a die-cut sheet, which is how they are actually ordered */}
      <Item label={labels[6]} ground={g1} shadeId={shade} contact={6}>
        <rect x="4.6" y="5.4" width="14.8" height="15.2" rx="0.5" fill={paper} />
        <rect x="4.6" y="5.4" width="14.8" height="15.2" rx="0.5" fill={lit} />
        <rect x="4.6" y="5.4" width="14.8" height="15.2" rx="0.5" fill="none" stroke={seam} strokeWidth="0.3" strokeDasharray="0.9 0.7" />
        <circle cx="9.4" cy="10.2" r="3.5" fill={accent} />
        <text x="9.4" y="11.5" textAnchor="middle" fontSize="2.6" fontFamily={display} fill={onAccent}>{monogram}</text>
        {/* The small die-cut carries the motif: a word set at this size renders
            as a smear, which is worse than no word. */}
        <circle cx="15.4" cy="10.2" r="2.4" fill={ink} />
        <g transform="translate(13.6 8.4) scale(0.15)" style={{ color: onInk }}>
          <Motif name={kit.motif} size={24} />
        </g>
        <rect x="6.6" y="15.2" width="10.8" height="3.6" rx="1.8" fill={primary} />
        <text x="12" y="17.7" textAnchor="middle" fontSize="1.3" fontFamily={display} fill={onPrimary} letterSpacing="0.08">{word}</text>
      </Item>

      {/* Name badge, hanging off a lanyard the way it does round a neck */}
      <figure>
        <div className="bm-cell" style={{ background: g2 }}>
          <span className="bm-lanyard" aria-hidden="true">
            <i style={{ borderColor: ink }} />
            <span className="bm-clip" style={{ background: ink }} />
            <span className="bm-badge" style={{ background: paper, borderColor: primary, color: ink }}>
              <b style={{ fontFamily: display, color: primary }}>{name}</b>
              <i>{domain}</i>
            </span>
          </span>
        </div>
        <figcaption>{labels[7]}</figcaption>
      </figure>
    </div>
  );
}
