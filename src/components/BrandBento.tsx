"use client";

import { Motif } from "./BrandKit";
import type { BrandKit as Kit } from "@/lib/brand-kits";

// A brand "mood board" bento — an applications showcase generated entirely from
// a BrandKit (colours, monogram, name, tagline, fonts, motif). No external
// photos: every tile (app icon on a phone, wordmark lockup, claim card, logo
// construction grid, lifestyle/mood card, app-store banner) is drawn from the
// kit so it works for every brand. Inspiration (not a clone) from a polished
// brand-identity mood board. Rendered inside the on-page BrandKit showcase.

// blend two brand hexes (k = 0..1 amount of `a`)
function mix(a: string, b: string, k: number) {
  return `color-mix(in oklab, ${a} ${Math.round(k * 100)}%, ${b})`;
}

function StoreBadge({ kind, ink, paper }: { kind: "apple" | "play"; ink: string; paper: string }) {
  return (
    <span
      className="bb-store"
      style={{ background: ink, color: paper, borderColor: mix(paper, ink, 0.35) }}
    >
      {kind === "apple" ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.04c-.03-2.72 2.22-4.02 2.32-4.09-1.27-1.86-3.25-2.11-3.95-2.14-1.68-.17-3.28 1-4.13 1-.85 0-2.17-.98-3.57-.95-1.84.03-3.53 1.07-4.48 2.72-1.91 3.32-.49 8.24 1.37 10.94.91 1.32 2 2.8 3.42 2.75 1.37-.05 1.89-.89 3.55-.89 1.65 0 2.12.89 3.57.86 1.47-.03 2.41-1.35 3.31-2.68 1.04-1.53 1.47-3.01 1.49-3.09-.03-.01-2.86-1.1-2.89-4.36zM14.6 5.2c.75-.91 1.26-2.18 1.12-3.44-1.08.04-2.39.72-3.17 1.63-.7.8-1.31 2.09-1.15 3.32 1.21.09 2.45-.61 3.2-1.51z"/></svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
      )}
      <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.05 }}>
        <span style={{ fontSize: 6.5, opacity: 0.8 }}>{kind === "apple" ? "Download on the" : "GET IT ON"}</span>
        <span style={{ fontSize: 10, fontWeight: 700 }}>{kind === "apple" ? "App Store" : "Google Play"}</span>
      </span>
    </span>
  );
}

export default function BrandBento({
  kit,
  siteImage,
  siteVideo,
}: {
  kit: Kit;
  /** Real screenshot of the built site (preferred). */
  siteImage?: string;
  /** Looping cover clip of the built site (used if no screenshot). */
  siteVideo?: string;
}) {
  const { paper, ink, primary, accent, display, body, tracking, name, monogram, tagline, domain } = kit;

  // A short, claim-style 2-liner from the tagline.
  const claim = tagline.replace(/[.,]\s*$/, "");

  return (
    <div className="bb" style={{ ["--bb-body" as string]: body }}>
      {/* A — app icon on a phone */}
      <div className="bb-tile bb--a" style={{ background: mix(accent, paper, 0.28) }}>
        <div className="bb-phone" style={{ background: "#0b0b0d", color: "#fff" }}>
          <span className="bb-phone__time">9:41</span>
          <div className="bb-appicon" style={{ background: primary, color: paper, fontFamily: display }}>
            {monogram.slice(0, 1).toLowerCase()}
            <span className="bb-appicon__badge" style={{ background: accent, color: ink }}>2</span>
          </div>
          <span className="bb-appname">{name.split(" ")[0]}</span>
        </div>
      </div>

      {/* B — wordmark lockup */}
      <div className="bb-tile bb--b bb-center" style={{ background: primary, color: paper }}>
        <span
          className="bb-word"
          style={{ fontFamily: display, letterSpacing: tracking, color: paper }}
        >
          {name}
          <i className="bb-word__dot" style={{ background: accent }} />
        </span>
      </div>

      {/* C — marketing claim card (tall) */}
      <div className="bb-tile bb--c" style={{ background: mix(accent, paper, 0.42), color: ink }}>
        <span className="bb-pill" style={{ color: primary }}>
          <span className="bb-pill__dot" style={{ background: primary, color: paper, fontFamily: display }}>
            {monogram.slice(0, 1).toLowerCase()}
          </span>
          {name}
          <span className="bb-pill__bars" aria-hidden="true">
            <i style={{ background: primary }} /><i style={{ background: mix(primary, paper, 0.4) }} /><i style={{ background: mix(primary, paper, 0.2) }} />
          </span>
        </span>
        <h3 className="bb-claim" style={{ fontFamily: display, color: primary }}>{claim}.</h3>
        <div className="bb-scene" style={{ background: `linear-gradient(160deg, ${mix(primary, paper, 0.85)}, ${accent})`, color: paper }}>
          <span className="bb-scene__motif" style={{ color: paper }}><Motif name={kit.motif} size={42} /></span>
        </div>
      </div>

      {/* D — lifestyle / mood card (tall, dark) */}
      <div
        className="bb-tile bb--d bb-mood"
        style={{ background: `linear-gradient(180deg, ${ink} 0%, ${mix(primary, ink, 0.5)} 70%, ${accent} 130%)`, color: paper }}
      >
        <span className="bb-moon" style={{ background: `radial-gradient(circle at 35% 35%, ${paper}, ${mix(accent, paper, 0.5)})` }} />
        <span className="bb-rings" style={{ borderColor: mix(accent, ink, 0.5) }} />
        <span className="bb-star" style={{ left: "22%", top: "16%" }} />
        <span className="bb-star" style={{ left: "70%", top: "12%" }} />
        <span className="bb-star" style={{ left: "82%", top: "30%" }} />
        <div className="bb-mood__copy">
          <p className="bb-mood__lines" style={{ fontFamily: display }}>
            {claim.split(/[, ]+/).slice(0, 3).map((w, i) => (
              <span key={i} style={{ color: i === 2 ? accent : paper }}>{w}</span>
            ))}
          </p>
          <p className="bb-mood__sub">{domain}</p>
        </div>
      </div>

      {/* E — logo construction grid */}
      <div className="bb-tile bb--e bb-grid-tile" style={{ background: mix(primary, paper, 0.1) }}>
        <span className="bb-grid-lines" style={{ ["--bb-line" as string]: mix(primary, paper, 0.22) }} />
        <span className="bb-construct" style={{ fontFamily: display, color: mix(primary, paper, 0.55) }}>{monogram.slice(0, 1).toLowerCase()}</span>
        {[[26, 70], [50, 32], [74, 70], [38, 50], [62, 50]].map(([x, y], i) => (
          <span key={i} className="bb-node" style={{ left: `${x}%`, top: `${y}%`, background: primary, borderColor: paper }} />
        ))}
      </div>

      {/* G — website preview: the real built site in a browser frame */}
      <div className="bb-tile bb--g bb-site" style={{ background: mix(primary, paper, 0.08), borderColor: mix(ink, paper, 0.18) }}>
        <div className="bb-site__bar" style={{ background: paper, borderColor: mix(ink, paper, 0.14) }}>
          <span className="bb-site__dots" aria-hidden="true">
            <i style={{ background: "#ec6a5e" }} /><i style={{ background: "#f4bf4f" }} /><i style={{ background: "#61c554" }} />
          </span>
          <span className="bb-site__url" style={{ background: mix(ink, paper, 0.06), color: ink, fontFamily: "var(--font-mono)" }}>{domain}</span>
        </div>
        <div className="bb-site__media" style={{ background: mix(primary, paper, 0.14) }}>
          {siteImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={siteImage} alt={`${name} — sito web`} loading="lazy" decoding="async" />
          ) : siteVideo ? (
            <video src={siteVideo} muted loop autoPlay playsInline preload="none" aria-label={`${name} — sito web`} />
          ) : (
            // Brand wireframe of the page structure (when no screenshot exists).
            <div className="bb-wire" aria-hidden="true">
              <span className="bb-wire__nav" style={{ background: primary }}>
                <i style={{ background: paper }} /><i style={{ background: mix(paper, primary, 0.5) }} /><i style={{ background: mix(paper, primary, 0.5) }} />
              </span>
              <span className="bb-wire__hero" style={{ background: mix(accent, paper, 0.5) }}>
                <b style={{ background: ink }} /><b style={{ background: mix(ink, paper, 0.4), width: "55%" }} /><b style={{ background: primary, width: 60, height: 14, borderRadius: 5 }} />
              </span>
              <span className="bb-wire__row">
                <i style={{ background: mix(primary, paper, 0.3) }} /><i style={{ background: mix(primary, paper, 0.3) }} /><i style={{ background: mix(primary, paper, 0.3) }} />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* F — app-store banner (wide) */}
      <div
        className="bb-tile bb--f bb-banner"
        style={{ background: `linear-gradient(110deg, ${primary} 0%, ${mix(primary, ink, 0.5)} 55%, ${ink} 100%)`, color: paper }}
      >
        <div className="bb-banner__copy">
          <span className="bb-banner__word" style={{ fontFamily: display, letterSpacing: tracking }}>{name}</span>
          <h3 className="bb-banner__claim" style={{ fontFamily: display }}>
            {claim} <span style={{ color: accent }}>{domain.split(".")[0]}.</span>
          </h3>
          <div className="bb-badges">
            <StoreBadge kind="apple" ink={"#0b0b0d"} paper={"#fff"} />
            <StoreBadge kind="play" ink={"#0b0b0d"} paper={"#fff"} />
          </div>
        </div>
        <div className="bb-screen" style={{ background: mix(ink, primary, 0.55), color: paper, borderColor: mix(paper, ink, 0.3) }}>
          <div className="bb-screen__top">
            <span style={{ opacity: 0.7, fontSize: 8 }}>{name.split(" ")[0]}</span>
            <span style={{ display: "inline-flex", color: accent }}><Motif name={kit.motif} size={12} /></span>
          </div>
          <span className="bb-screen__hi" style={{ fontFamily: display }}>{claim.split(/[, ]+/)[0]}</span>
          <div className="bb-ring" style={{ borderColor: mix(accent, ink, 0.4), color: paper }}>
            <svg viewBox="0 0 40 40" className="bb-ring__svg" aria-hidden="true">
              <circle cx="20" cy="20" r="16" fill="none" stroke={mix(paper, ink, 0.22)} strokeWidth="4" />
              <circle cx="20" cy="20" r="16" fill="none" stroke={accent} strokeWidth="4" strokeDasharray="100 100" strokeDashoffset="22" strokeLinecap="round" transform="rotate(-90 20 20)" />
            </svg>
            <span className="bb-ring__num" style={{ fontFamily: display }}>85</span>
          </div>
          <div className="bb-screen__row" style={{ background: mix(paper, ink, 0.12) }}>
            <span style={{ width: 16, height: 16, borderRadius: 5, background: accent, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 8.5, opacity: 0.85 }}>{tagline.split(/[, ]+/).slice(0, 2).join(" ")}</span>
          </div>
        </div>
      </div>

      <style>{`
        .bb { display: grid; gap: 14px; grid-template-columns: 1fr; font-family: var(--bb-body, var(--font-ui)); }
        .bb-tile { position: relative; overflow: hidden; border-radius: 16px; padding: 18px; min-height: clamp(150px, 20vw, 190px); border: 1px solid rgba(0,0,0,.06); }
        .bb-center { display: flex; align-items: center; justify-content: center; }
        @media (min-width: 720px) {
          .bb {
            grid-template-columns: 1fr 1fr 1.18fr;
            grid-auto-rows: minmax(150px, auto);
            grid-template-areas: "a b c" "d e c" "d g g" "f f f";
          }
          .bb--a { grid-area: a; } .bb--b { grid-area: b; } .bb--c { grid-area: c; }
          .bb--d { grid-area: d; } .bb--e { grid-area: e; } .bb--g { grid-area: g; } .bb--f { grid-area: f; }
        }

        /* A — phone + app icon */
        .bb--a { display: flex; align-items: flex-start; justify-content: center; padding-top: 22px; }
        .bb-phone { width: 124px; border-radius: 22px 22px 14px 14px; padding: 10px 12px 16px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 10px 24px rgba(0,0,0,.22); }
        .bb-phone__time { align-self: flex-end; font-size: 9px; font-weight: 600; opacity: .9; }
        .bb-appicon { position: relative; width: 56px; height: 56px; border-radius: 15px; display: grid; place-items: center; font-size: 30px; font-weight: 700; box-shadow: 0 6px 14px rgba(0,0,0,.3); }
        .bb-appicon__badge { position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; border-radius: 50%; font-size: 10px; font-weight: 700; display: grid; place-items: center; border: 2px solid #0b0b0d; }
        .bb-appname { font-size: 10px; opacity: .92; }

        /* B — wordmark */
        .bb-word { position: relative; font-size: clamp(26px, 4.4vw, 40px); font-weight: 600; line-height: 1; text-align: center; padding: 0 6px; }
        .bb-word__dot { position: absolute; top: 6%; right: -2px; width: 7px; height: 7px; border-radius: 50%; }

        /* C — claim */
        .bb--c { display: flex; flex-direction: column; gap: 12px; }
        .bb-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; }
        .bb-pill__dot { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; }
        .bb-pill__bars { display: inline-flex; gap: 4px; margin-left: auto; align-items: center; }
        .bb-pill__bars i { width: 18px; height: 3px; border-radius: 2px; display: inline-block; }
        .bb-claim { margin: 0; font-size: clamp(22px, 2.6vw, 32px); font-weight: 600; line-height: 1.06; letter-spacing: -0.01em; }
        .bb-scene { margin-top: auto; height: 92px; border-radius: 14px; display: grid; place-items: center; box-shadow: inset 0 -20px 40px rgba(0,0,0,.12); }

        /* D — mood */
        .bb-mood { display: flex; align-items: flex-end; }
        .bb-moon { position: absolute; top: 18px; left: 18px; width: 30px; height: 30px; border-radius: 50%; box-shadow: 0 0 24px rgba(255,255,255,.35); }
        .bb-rings { position: absolute; right: 12%; top: 30%; width: 70px; height: 70px; border-radius: 50%; border: 1.5px solid; opacity: .5; }
        .bb-star { position: absolute; width: 2.5px; height: 2.5px; border-radius: 50%; background: rgba(255,255,255,.85); }
        .bb-mood__copy { position: relative; z-index: 2; }
        .bb-mood__lines { margin: 0; display: flex; flex-direction: column; font-size: clamp(18px, 2.2vw, 26px); font-weight: 600; line-height: 1.12; text-transform: capitalize; }
        .bb-mood__sub { margin: 8px 0 0; font-size: 11px; opacity: .72; font-family: var(--font-mono); letter-spacing: .04em; }

        /* E — construction grid */
        .bb-grid-tile { display: grid; place-items: center; }
        .bb-grid-lines { position: absolute; inset: 0; background-image: linear-gradient(var(--bb-line) 1px, transparent 1px), linear-gradient(90deg, var(--bb-line) 1px, transparent 1px); background-size: 12.5% 12.5%; }
        .bb-construct { position: relative; z-index: 1; font-size: clamp(80px, 10vw, 128px); font-weight: 700; line-height: 1; opacity: .85; }
        .bb-node { position: absolute; z-index: 2; width: 8px; height: 8px; border-radius: 50%; transform: translate(-50%, -50%); border: 2px solid; }

        /* F — banner */
        .bb-banner { display: flex; align-items: center; gap: 18px; padding: 22px 24px; min-height: 170px; }
        .bb-banner__copy { flex: 1; min-width: 0; }
        .bb-banner__word { font-size: 14px; font-weight: 600; opacity: .92; }
        .bb-banner__claim { margin: 8px 0 14px; font-size: clamp(18px, 2.3vw, 28px); font-weight: 600; line-height: 1.1; }
        .bb-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .bb-store { display: inline-flex; align-items: center; gap: 7px; padding: 5px 10px; border-radius: 8px; border: 1px solid; }
        .bb-screen { flex-shrink: 0; width: 132px; align-self: stretch; max-height: 150px; border-radius: 16px 16px 0 0; border: 1px solid; padding: 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 12px 30px rgba(0,0,0,.3); }
        .bb-screen__top { display: flex; align-items: center; justify-content: space-between; }
        .bb-screen__hi { font-size: 15px; font-weight: 600; }
        .bb-ring { position: relative; width: 56px; height: 56px; margin: 2px auto 0; display: grid; place-items: center; }
        .bb-ring__svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .bb-ring__num { font-size: 16px; font-weight: 700; }
        .bb-screen__row { display: flex; align-items: center; gap: 7px; padding: 6px; border-radius: 9px; margin-top: auto; }

        /* G — website preview (browser frame) */
        .bb-site { padding: 0; display: flex; flex-direction: column; border: 1px solid; }
        .bb-site__bar { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-bottom: 1px solid; }
        .bb-site__dots { display: inline-flex; gap: 5px; flex-shrink: 0; }
        .bb-site__dots i { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
        .bb-site__url { flex: 1; font-size: 10px; padding: 4px 10px; border-radius: 6px; letter-spacing: .02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bb-site__media { flex: 1; min-height: 130px; overflow: hidden; }
        .bb-site__media img, .bb-site__media video { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        .bb-wire { height: 100%; min-height: 150px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .bb-wire__nav { display: flex; align-items: center; gap: 8px; padding: 9px 11px; border-radius: 7px; }
        .bb-wire__nav i { height: 6px; border-radius: 3px; display: inline-block; }
        .bb-wire__nav i:first-child { width: 34px; }
        .bb-wire__nav i:not(:first-child) { width: 22px; margin-left: auto; }
        .bb-wire__nav i:last-child { margin-left: 0; }
        .bb-wire__hero { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 16px; border-radius: 9px; }
        .bb-wire__hero b { height: 10px; width: 80%; border-radius: 4px; display: block; }
        .bb-wire__row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .bb-wire__row i { height: 36px; border-radius: 7px; display: block; }

        @media (max-width: 719px) {
          .bb-banner { flex-direction: column; align-items: stretch; }
          .bb-screen { width: 100%; max-height: none; border-radius: 14px; }
          .bb-screen__row { margin-top: 8px; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .bb-tile { transition: transform .2s var(--ease, ease); }
        }
      `}</style>
    </div>
  );
}
