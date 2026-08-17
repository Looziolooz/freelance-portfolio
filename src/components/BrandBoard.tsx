"use client";

import Image from "next/image";
import { Monogram, Motif } from "./BrandKit";
import { merchPick, merchSrc } from "@/lib/brand-merch";
import { onColor, type BrandKit as Kit } from "@/lib/brand-kits";

// The one page a client looks at and immediately says yes or no: a 3×3 board of
// the identity applied — wordmark, variants, type and colour, a poster, the real
// site, packaging, stationery, social, and a second frame of the real site.
//
// Seven tiles are drawn from the kit, so any brand gets a board. Two are real
// frames from the live build (public/brand-shots), which is what keeps the board
// from looking like a template with someone else's product photographed in it.
// Where a brand also has photographed merch, the packaging and stationery tiles
// hand over to the photographs: a drawn box next to a real screenshot is the
// weakest thing on the board, and there is no reason to draw what exists.
//
// Matched by object, never by position. Both tiles carry a category label, and a
// positional pick put a beanie under "stationery" — so each tile names the files
// it will accept and keeps its drawing when the brand has none of them.

// What counts as packaging, and what counts as something that comes off a desk.
// Ordered by how well each object reads at tile size.
const PACKAGING = ["box", "paperbag", "bottle", "cup", "tag", "luggagetag", "pouch", "tin", "jar", "label"] as const;
const STATIONERY = ["letterhead", "businesscard", "envelope", "cardholder", "folder", "notebook", "postcard", "menu"] as const;

function Tile({
  label,
  className,
  style,
  children,
}: {
  label: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <figure className={`bb3-tile ${className ?? ""}`} style={style}>
      <div className="bb3-tile__inner">{children}</div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export default function BrandBoard({
  kit,
  slug,
  shots,
  labels,
}: {
  kit: Kit;
  /** Which brand, so the board can look up its photographed merch. */
  slug: string;
  /** Frames from the live demo build; the board falls back to drawn tiles. */
  shots: string[];
  /** [wordmark, variants, type&colour, poster, site, packaging, stationery, social, detail] */
  labels: string[];
}) {
  const { paper, ink, primary, accent, display, tracking, name, monogram, tagline, domain } = kit;
  const onPrimary = onColor(kit, primary);
  const onInk = onColor(kit, ink);
  const onAccent = onColor(kit, accent);
  const short = name.split(" ")[0];
  const line = tagline.replace(/[.]\s*$/, "");
  // 15%, not 8%: on the kits whose paper is near-black (MIRZZ, Prana, Aurelia)
  // a weaker mix left the paper-coloured card DARKER than the wall it sits on,
  // so the wordmark tile read as a hole instead of a printed card.
  const wall = `color-mix(in srgb, ${ink} 15%, ${paper})`;
  const packaging = merchPick(slug, PACKAGING);
  const stationery = merchPick(slug, STATIONERY);


  return (
    <div className="bb3">
      {/* 1 — the wordmark, printed on a card, lying on a wall */}
      <Tile label={labels[0]} style={{ background: wall }}>
        <div className="bb3-card" style={{ background: paper, color: ink }}>
          <span style={{ fontFamily: display, letterSpacing: tracking }} className="bb3-card__word">{name}</span>
          <span className="bb3-card__sub">{domain}</span>
        </div>
      </Tile>

      {/* 2 — the four versions side by side */}
      <Tile label={labels[1]} style={{ background: paper }}>
        <div className="bb3-variants">
          <span style={{ color: primary, fontFamily: display, letterSpacing: tracking }}>{short}</span>
          <Monogram kit={kit} variant="solid" size={34} />
          <Monogram kit={kit} variant="outline" size={34} />
          <span className="bb3-variants__neg" style={{ background: ink, color: onInk, fontFamily: display }}>{monogram}</span>
        </div>
      </Tile>

      {/* 3 — type and colour, the way a printer asks for them */}
      <Tile label={labels[2]} style={{ background: paper, color: ink }}>
        <div className="bb3-spec">
          <span className="bb3-spec__aa" style={{ fontFamily: display, color: primary }}>Aa</span>
          <div className="bb3-spec__dots">
            <i style={{ background: primary }} />
            <i style={{ background: accent }} />
            <i style={{ background: ink }} />
          </div>
        </div>
      </Tile>

      {/* 4 — a poster: the promise at full size, in one colour */}
      <Tile label={labels[3]} style={{ background: primary, color: onPrimary }}>
        <div className="bb3-poster">
          <span style={{ display: "inline-flex", color: accent }}><Motif name={kit.motif} size={20} /></span>
          <strong style={{ fontFamily: display }}>{line}</strong>
          <span>{domain}</span>
        </div>
      </Tile>

      {/* 5 — the real site, big. The centre of the board is the actual work. */}
      <Tile label={labels[4]} className="bb3-tile--photo" style={{ background: ink }}>
        {shots[0] ? (
          <Image src={shots[0]} alt={`${name} — ${labels[4]}`} fill sizes="(max-width: 760px) 90vw, 360px" loading="lazy" style={{ objectFit: "cover" }} />
        ) : (
          <div className="bb3-poster" style={{ color: onInk }}><strong style={{ fontFamily: display }}>{short}</strong></div>
        )}
      </Tile>

      {/* 6 — packaging: photographed if it exists, drawn if it does not */}
      {packaging ? (
        <Tile label={labels[5]} className="bb3-tile--photo" style={{ background: packaging.bg }}>
          <Image src={merchSrc(slug, packaging)} alt={`${name} — ${labels[5]}`} fill sizes="(max-width: 760px) 90vw, 360px" loading="lazy" style={{ objectFit: "contain" }} />
        </Tile>
      ) : (
      <Tile label={labels[5]} style={{ background: wall }}>
        <div className="bb3-pack">
          <span className="bb3-pack__box" style={{ background: paper, borderColor: `color-mix(in srgb, ${ink} 22%, transparent)`, color: primary, fontFamily: display }}>{monogram}</span>
          <span className="bb3-pack__bottle" style={{ background: primary, color: onPrimary }}>
            <i style={{ background: onPrimary }} />
            <b style={{ fontFamily: display }}>{short}</b>
          </span>
          <span className="bb3-pack__tag" style={{ background: accent, color: onAccent, fontFamily: display }}>{monogram}</span>
        </div>
      </Tile>
      )}

      {/* 7 — stationery, overlapping the way it lands on a desk */}
      {stationery ? (
        <Tile label={labels[6]} className="bb3-tile--photo" style={{ background: stationery.bg }}>
          <Image src={merchSrc(slug, stationery)} alt={`${name} — ${labels[6]}`} fill sizes="(max-width: 760px) 90vw, 360px" loading="lazy" style={{ objectFit: "contain" }} />
        </Tile>
      ) : (
      <Tile label={labels[6]} style={{ background: wall }}>
        <div className="bb3-flat">
          <span className="bb3-flat__sheet" style={{ background: paper, borderColor: `color-mix(in srgb, ${ink} 14%, transparent)` }}>
            <i style={{ background: primary }} />
            <i style={{ background: `color-mix(in srgb, ${ink} 18%, transparent)` }} />
            <i style={{ background: `color-mix(in srgb, ${ink} 18%, transparent)`, width: "60%" }} />
          </span>
          <span className="bb3-flat__card" style={{ background: primary, color: onPrimary, fontFamily: display }}>{short}</span>
          <span className="bb3-flat__env" style={{ background: paper, borderColor: `color-mix(in srgb, ${ink} 22%, transparent)` }}>
            <i style={{ background: accent }} />
          </span>
        </div>
      </Tile>
      )}

      {/* 8 — the social grid and the phone */}
      <Tile label={labels[7]} style={{ background: paper }}>
        <div className="bb3-social">
          <span className="bb3-social__grid">
            <i style={{ background: primary }} />
            <i style={{ background: accent }} />
            <i style={{ background: `color-mix(in srgb, ${primary} 45%, ${paper})` }} />
            <i style={{ background: `color-mix(in srgb, ${accent} 55%, ${paper})` }} />
            <i style={{ background: ink }} />
            <i style={{ background: `color-mix(in srgb, ${primary} 22%, ${paper})` }} />
          </span>
          <span className="bb3-phone" style={{ background: ink, color: onInk }}>
            <b style={{ background: primary, color: onPrimary, fontFamily: display }}>{monogram.slice(0, 1)}</b>
            <i style={{ fontFamily: display }}>{short}</i>
          </span>
        </div>
      </Tile>

      {/* 9 — a second frame of the real build */}
      <Tile label={labels[8]} className="bb3-tile--photo" style={{ background: ink }}>
        {shots[2] ? (
          <Image src={shots[2]} alt={`${name} — ${labels[8]}`} fill sizes="(max-width: 760px) 90vw, 360px" loading="lazy" style={{ objectFit: "cover" }} />
        ) : (
          <div className="bb3-poster" style={{ color: onInk }}><span>{domain}</span></div>
        )}
      </Tile>
    </div>
  );
}
