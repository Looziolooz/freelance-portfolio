"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useLang } from "./LangProvider";
import { Monogram, Motif, Stationery } from "./BrandKit";
import { LogoInUse, Merch, MerchPhotos } from "./BrandMerch";
import BrandBoard from "./BrandBoard";
import BrandBento from "./BrandBento";
import { brandShots } from "@/lib/brand-shots";
import { merchPhotos, merchSpread } from "@/lib/brand-merch";
import { documentGround, hexToRgb, onColor, type BrandKit as Kit } from "@/lib/brand-kits";

// The brand manual a client leafs through BEFORE the build starts, thirteen
// pages, turned one at a time.
//
// Written for the person paying, not for a designer. Every page SHOWS the thing
// instead of specifying it: the mark as a social avatar and as a sign over a
// door, the colours with "where this one goes" in plain words, the real screens
// of the built site, the tees the staff will wear. The measurements a printer
// and a developer need are all real — and all on the last page, out of the way.
//
// Paper without a fixed canvas: the stage is the container (`container-type:
// inline-size`), the page sets its type in `cqw` and every measure inside it in
// `em`, so one rule set scales the whole spread. Under 760px the page drops the
// A4 ratio, pins the type at a readable size and grows downwards.

type Slide = { label: string; render: () => React.ReactNode };

const PAGE = (n: number) => String(n).padStart(2, "0");

// Long enough to read a page of a brand manual, short enough that the document
// is visibly moving on its own.
const AUTOPLAY_MS = 7000;

// Reduced motion decides only the DEFAULT. If the reader presses play anyway,
// that is a request, and it is honoured.
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const readMotion = () => window.matchMedia(MOTION_QUERY).matches;
const readMotionOnServer = () => false;

// The eleven numbered sections. Cover and contents sit in front of them, so
// section 01 lives on page 03.
const SECTION_KEYS = [
  "promise", "mark", "colour", "type", "board", "site",
  "print", "merch", "daily", "delivery", "specs",
] as const;

const SPEC_KEYS = ["clear", "min", "contrast", "grid", "scale", "motion", "files", "stock"] as const;

// What the site's own font variables resolve to, so the type page can name the
// face instead of quoting a CSS custom property back at the reader.
const SITE_FACES: Record<string, string> = {
  "--font-ui": "General Sans",
  "--font-sans": "General Sans",
  "--font-display": "Fraunces",
  "--font-mono": "JetBrains Mono",
};

const MERCH_ITEMS = [
  "tee", "teeDark", "apron", "cap", "tote", "cup", "sticker", "badge",
] as const;

// A coach operator has no apron and a yoga studio has no uniform, so the merch
// chapter cannot be called "what the team wears" for everyone. Which of the two
// this brand mostly carries decides its headline and its note.
const WEARABLE = new Set(["tee", "teeDark", "polo", "hoodie", "apron", "cape", "cap"]);

const BOARD_TILES = [
  "wordmark", "variants", "typecolour", "poster", "site", "packaging", "stationery", "social", "detail",
] as const;

export default function BrandDeck({
  kit,
  slug,
  demo,
  stack,
  siteImage,
  siteVideo,
}: {
  kit: Kit;
  slug: string;
  /** Live URL of the built demo, shown on the site page. */
  demo?: string;
  /** What it was built with, shown on the site page. */
  stack?: string;
  siteImage?: string;
  siteVideo?: string;
}) {
  const { t, lang } = useLang();
  const [index, setIndex] = useState(0);
  // null = the reader has not chosen, so the motion preference decides.
  const [playRequest, setPlayRequest] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, readMotionOnServer);
  const playing = playRequest ?? !reducedMotion;
  const stageRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const headingId = useId();

  // Turning the page for the reader. Anything the reader does themselves — the
  // arrows, a page number, a swipe, tabbing into the document — hands control
  // back and stops it, which is both the polite behaviour and WCAG 2.2.2.
  const jump = useCallback((next: number) => {
    setPlayRequest(false);
    setIndex(next);
  }, []);

  const story = kit.story?.[lang] ?? kit.story?.it ?? "";
  const voice = kit.voice?.[lang] ?? kit.voice?.it ?? "";
  const principles = kit.principles?.[lang] ?? kit.principles?.it ?? [];
  const usage = kit.usage?.[lang] ?? kit.usage?.it ?? [];

  const { ink, paper, primary, accent } = kit;
  const onInk = onColor(kit, ink);
  const ground = documentGround(kit);
  const onGround = onColor(kit, ground);
  const onPrimary = onColor(kit, primary);
  const shots = brandShots(slug);

  // Photographed merch, where this brand has any. Each page takes a different
  // slice at a different offset, so leafing through the document does not mean
  // meeting the same tote four times.
  const photos = merchPhotos(slug);
  const coverPhotos = merchSpread(slug, 3);
  const markPhotos = merchSpread(slug, 3, 1);
  const typePhotos = merchSpread(slug, 4, 2);

  // Wearables against everything else, from the objects this brand actually
  // carries. A tie, or a set with a real share of both, reads as mixed.
  const merchKind = (() => {
    const set = kit.merch ?? [];
    if (set.length === 0) return "mixed";
    const worn = set.filter((m) => WEARABLE.has(m)).length;
    if (worn === set.length) return "wear";
    if (worn === 0) return "goods";
    return worn / set.length >= 0.6 ? "wear" : worn / set.length <= 0.4 ? "goods" : "mixed";
  })();

  // "Fraunces" out of `"Fraunces", Georgia, serif` — the name a client can
  // repeat to a printer, which is the only reason it is on the page. Most kits
  // set their text face to the site's own stack, which starts with a CSS custom
  // property; printing `var(--font-ui)` at a client is worse than useless, so
  // the three site variables resolve to what they actually are.
  const faceName = (stack: string) => {
    const first = (stack.split(",")[0] ?? "").trim();
    const variable = first.match(/^var\(\s*(--[\w-]+)/)?.[1];
    if (variable) return SITE_FACES[variable] ?? first;
    return first.replace(/["']/g, "");
  };

  // ---- page furniture -----------------------------------------------------------
  const Head = ({ n, title }: { n: number; title: string }) => (
    <div className="bdeck-head">
      <span className="bdeck-head__sec">{PAGE(n)} — {title}</span>
      <span className="bdeck-head__brand">{kit.name}</span>
    </div>
  );

  const Foot = ({ n }: { n: number }) => (
    <div className="bdeck-foot">
      <span>{kit.name} · {t("bdeck.eyebrow")}</span>
      <span className="bdeck-foot__n">{PAGE(n)}</span>
    </div>
  );

  // Colour lives in CSS (var(--bk-primary)), not inline: the cover and the
  // sign-off sit ON the primary, where primary text is invisible, and an inline
  // style would outrank their override.
  const Label = ({ children }: { children: React.ReactNode }) => (
    <span className="bdeck-label">{children}</span>
  );

  // ---- the thirteen pages -------------------------------------------------------
  const slides: Slide[] = [
    {
      label: t("bdeck.s.cover"),
      render: () => (
        <div className="bdeck-page bdeck-page--cover" style={{ background: ground, color: onGround }}>
          <div className="bdeck-cover__copy">
            {/* The monogram, oversized and barely there. It fills the top half
                the composition was leaving empty, and it puts the brand's own
                letterform on the cover in the brand's own face. */}
            <span className="bdeck-cover__ghost" aria-hidden="true" style={{ fontFamily: kit.display }}>
              {kit.monogram}
            </span>

            <div className="bdeck-head">
              <span className="bdeck-head__sec">{t("bdeck.eyebrow")}</span>
            </div>
            <div className="bdeck-cover__mid">
              {/* The mark itself, present on every cover: with a photograph down
                  the side it was the one thing missing from the front page. */}
              <Monogram kit={kit} variant="outline" size={52} />
              <span className="bdeck-rule" style={{ background: accent }} />
              <h3 id={headingId} className="bdeck-cover__title" style={{ fontFamily: kit.display, letterSpacing: kit.tracking }}>
                {kit.name}
              </h3>
              <p className="bdeck-cover__tag">{kit.tagline}</p>
            </div>
            <div className="bdeck-cover__meta">
              <div>
                <Label>{t("bdeck.cover.brand")}</Label>
                <p>{kit.domain}</p>
              </div>
              <div>
                <Label>{t("bdeck.cover.doc")}</Label>
                <p>{t("bdeck.cover.version")}<br />{t("bdeck.cover.by")}</p>
              </div>
            </div>
          </div>

          {/* The built site, shown as a site. It used to bleed full-height down
              this column, which was wrong twice: a 1440×900 screenshot squeezed
              into a tall narrow slot with `cover` cuts an arbitrary vertical
              slice (you got half-letters of someone's headline), and filling that
              height meant upscaling the served 640w variant about 2×, which is
              where the graininess came from.
              Now it sits in a browser frame at its own 16:10, so nothing is
              cropped and the image is downscaled rather than stretched. The
              frame is 16:10 because every capture is 1440×900; six sites were
              coming back 1280×720 from a run where the viewport had been lost,
              and `cover` was eating their left and right edges to make up the
              difference.
              Under it, the identity off the screen: three of the brand's own
              photographed objects, so the cover says "a brand", not "a site". */}
          <div className="bdeck-cover__stage">
            {shots[0] ? (
              <>
                <span className="bdeck-browser" style={{ background: paper, color: ink }}>
                  <span className="bdeck-browser__bar">
                    <i /><i /><i />
                    <em>{kit.domain}</em>
                  </span>
                  <span className="bdeck-browser__shot">
                    <Image
                      src={shots[0]}
                      alt={`${kit.name} — ${t("bdeck.cover.shot")}`}
                      fill
                      sizes="(max-width: 760px) 88vw, 420px"
                      loading="lazy"
                      style={{ objectFit: "cover", objectPosition: "top center" }}
                    />
                  </span>
                </span>
                {coverPhotos.length === 0 && <span className="bdeck-cover__cap">{t("bdeck.cover.shot")}</span>}
              </>
            ) : (
              <Monogram kit={kit} variant="outline" size={120} />
            )}

            {coverPhotos.length > 0 && (
              <>
                <MerchPhotos
                  slug={slug}
                  photos={coverPhotos}
                  alt={`${kit.name} — ${t("bdeck.cover.merch")}`}
                  className="bm-photos--cover"
                  sizes="(max-width: 760px) 28vw, 130px"
                />
                <span className="bdeck-cover__cap">{t("bdeck.cover.merch")}</span>
              </>
            )}
          </div>
        </div>
      ),
    },

    {
      label: t("bdeck.s.contents"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={2} title={t("bdeck.s.contents")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.contents.headline")}</h3>

          <ol className="bdeck-toc">
            {SECTION_KEYS.map((key, i) => (
              <li key={key}>
                <button type="button" onClick={() => jump(i + 2)}>
                  <span className="bdeck-mono bdeck-accent">{PAGE(i + 1)}</span>
                  <span className="bdeck-toc__name">{t(`bdeck.s.${key}`)}</span>
                  <span className="bdeck-toc__dots" aria-hidden="true" />
                  <span className="bdeck-mono">{PAGE(i + 3)}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="bdeck-note bdeck-bottom" style={{ borderColor: accent }}>
            <Label>{t("bdeck.contents.note.title")}</Label>
            <p>{t("bdeck.contents.note")}</p>
          </div>
          <Foot n={2} />
        </div>
      ),
    },

    // 01 — what the brand promises
    {
      label: t("bdeck.s.promise"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={3} title={t("bdeck.s.promise")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.promise.headline")}</h3>

          <div className="bdeck-quote" style={{ borderColor: primary }}>
            <p style={{ fontFamily: kit.display }}>{story}</p>
          </div>

          <div className="bdeck-2col">
            <div>
              <Label>{t("bdeck.promise.attrs")}</Label>
              <ul className="bdeck-chips">
                {principles.map((p) => <li key={p} style={{ borderColor: primary, color: primary }}>{p}</li>)}
              </ul>
            </div>
            <div>
              <Label>{t("bdeck.promise.where")}</Label>
              <ul className="bdeck-list">{usage.map((u) => <li key={u}>{u}</li>)}</ul>
            </div>
          </div>

          <div className="bdeck-note bdeck-bottom" style={{ borderColor: accent }}>
            <Label>{t("bdeck.promise.voice")}</Label>
            <p>{voice}</p>
          </div>
          <Foot n={3} />
        </div>
      ),
    },

    // 02 — the mark, and where it actually turns up
    {
      label: t("bdeck.s.mark"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={4} title={t("bdeck.s.mark")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.mark.headline")}</h3>

          <div className="bdeck-logo">
            <div className="bdeck-logo__primary" style={{ borderColor: `color-mix(in srgb, ${ink} 18%, transparent)` }}>
              <Label>{t("bdeck.mark.primary")}</Label>
              <div className="bdeck-lockup">
                <Monogram kit={kit} variant="solid" size={64} />
                <span className="bdeck-lockup__word" style={{ fontFamily: kit.display, letterSpacing: kit.tracking }}>{kit.name}</span>
              </div>
            </div>
            <div className="bdeck-logo__grid bdeck-logo__grid--two">
              <figure style={{ borderColor: `color-mix(in srgb, ${ink} 18%, transparent)` }}>
                <div className="bdeck-logo__cell"><Monogram kit={kit} variant="outline" size={44} /></div>
                <figcaption>{t("bdeck.mark.monogram")}</figcaption>
              </figure>
              <figure style={{ borderColor: `color-mix(in srgb, ${ink} 18%, transparent)` }}>
                <div className="bdeck-logo__cell" style={{ background: ink, color: onInk }}>
                  <span className="bdeck-lockup__word bdeck-lockup__word--sm" style={{ fontFamily: kit.display, letterSpacing: kit.tracking }}>{kit.name}</span>
                </div>
                <figcaption>{t("bdeck.mark.negative")}</figcaption>
              </figure>
            </div>
          </div>

          <div>
            <Label>{t("bdeck.mark.inuse")}</Label>
            <LogoInUse
              kit={kit}
              labels={[t("bdeck.mark.use.avatar"), t("bdeck.mark.use.tab"), t("bdeck.mark.use.sign"), t("bdeck.mark.use.stamp")]}
            />
          </div>

          {/* The four cells above are drawn, which shows the mark's placement.
              These show it existing. */}
          {markPhotos.length > 0 && (
            <div>
              <Label>{t("bdeck.mark.real")}</Label>
              <MerchPhotos
                slug={slug}
                photos={markPhotos}
                alt={`${kit.name} — ${t("bdeck.mark.real")}`}
                className="bm-photos--three"
                sizes="(max-width: 760px) 30vw, 200px"
              />
            </div>
          )}

          <p className="bdeck-p bdeck-muted bdeck-bottom">{t("bdeck.mark.note")}</p>
          <Foot n={4} />
        </div>
      ),
    },

    // 03 — the colours, each with the job it does
    {
      label: t("bdeck.s.colour"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={5} title={t("bdeck.s.colour")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.colour.headline")}</h3>

          <div className="bdeck-roles">
            {kit.palette.map((c) => {
              const [r, g, b] = hexToRgb(c.hex);
              return (
                <div key={c.hex} className="bdeck-role">
                  <span className="bdeck-role__chip" style={{ background: c.hex }} />
                  <div className="bdeck-role__meta">
                    <strong>{c.name}</strong>
                    <p>{t(`bdeck.colour.role.${c.role}`)}</p>
                    <span className="bdeck-mono bdeck-muted">{c.hex.toUpperCase()} · RGB {r} {g} {b}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bdeck-note bdeck-bottom" style={{ borderColor: accent }}>
            <Label>{t("bdeck.colour.mix")}</Label>
            <div className="bdeck-ratio">
              <span style={{ background: paper, flex: 60 }} />
              <span style={{ background: ink, flex: 30 }} />
              <span style={{ background: primary, flex: 8 }} />
              <span style={{ background: accent, flex: 2 }} />
            </div>
            <p>{t("bdeck.colour.mix.body")}</p>
          </div>
          <Foot n={5} />
        </div>
      ),
    },

    // 04 — the two faces, as a foundry would show them
    //
    // This page was two bordered boxes of running text. It showed each face at
    // exactly one size, gave nothing to compare, and read as a form. A specimen
    // is the opposite: the letterform big enough to see what it is, the whole
    // character set so a printer knows what they are getting, the name so the
    // client can repeat it, and the ladder from headline to caption so the
    // relationship between the sizes is visible rather than described.
    {
      label: t("bdeck.s.type"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={6} title={t("bdeck.s.type")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.type.headline")}</h3>

          {/* The display face, on the house colour, at the size it is bought for */}
          <div className="bdeck-spec">
            <div className="bdeck-spec__big" style={{ background: primary, color: onPrimary }}>
              {/* No kit tracking here: that value is tuned for the wordmark, and
                  on a two-letter specimen it reads as "A" and "a" side by side. */}
              <span className="bdeck-spec__aa" style={{ fontFamily: kit.display }}>Aa</span>
              <span className="bdeck-spec__set" style={{ fontFamily: kit.display }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ&nbsp;&nbsp;abcdefghijklmnopqrstuvwxyz&nbsp;&nbsp;0123456789
              </span>
            </div>
            <div className="bdeck-spec__meta">
              <Label>{t("bdeck.type.specimen")}</Label>
              <p className="bdeck-spec__name" style={{ fontFamily: kit.display, letterSpacing: kit.tracking }}>
                {faceName(kit.display)}
              </p>
              <p className="bdeck-spec__note">{t("bdeck.type.titles.note")}</p>
            </div>
          </div>

          {/* The text face, quieter, on paper, because that is where it lives */}
          <div className="bdeck-spec">
            <div
              className="bdeck-spec__big"
              style={{ background: `color-mix(in srgb, ${ink} 6%, ${paper})`, border: `1px solid color-mix(in srgb, ${ink} 16%, transparent)` }}
            >
              <span className="bdeck-spec__aa" style={{ fontFamily: kit.body }}>Aa</span>
              <span className="bdeck-spec__set" style={{ fontFamily: kit.body }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ&nbsp;&nbsp;abcdefghijklmnopqrstuvwxyz&nbsp;&nbsp;0123456789
              </span>
            </div>
            <div className="bdeck-spec__meta">
              <Label>{t("bdeck.type.specimen.body")}</Label>
              <p className="bdeck-spec__name" style={{ fontFamily: kit.body }}>{faceName(kit.body)}</p>
              <p className="bdeck-spec__note">{t("bdeck.type.text.note")}</p>
            </div>
          </div>

          {/* The ladder. Real sentences at the real ratios, so the steps between
              the sizes are something you can see rather than read about. */}
          <div>
            <Label>{t("bdeck.type.scale")}</Label>
            <div className="bdeck-scale">
              {([
                ["h1", "2.5em", kit.display, kit.tracking, kit.name],
                ["h2", "1.45em", kit.display, "normal", kit.tagline],
                ["body", "0.9em", kit.body, "normal", story],
                ["caption", "0.68em", kit.body, "0.04em", kit.domain],
              ] as const).map(([key, size, face, track, sample]) => (
                <div key={key} className="bdeck-scale__row">
                  <span className="bdeck-scale__key">{t(`bdeck.type.scale.${key}`)}</span>
                  <span
                    className="bdeck-scale__sample"
                    style={{ fontFamily: face, fontSize: size, letterSpacing: track, fontWeight: key === "h1" || key === "h2" ? 600 : 400 }}
                  >
                    {sample}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {typePhotos.length > 0 && (
            <div>
              <Label>{t("bdeck.type.wild")}</Label>
              <MerchPhotos
                slug={slug}
                photos={typePhotos}
                alt={`${kit.name} — ${t("bdeck.type.wild")}`}
                sizes="(max-width: 760px) 24vw, 150px"
              />
            </div>
          )}

          <p className="bdeck-p bdeck-muted bdeck-bottom">{t("bdeck.type.note")}</p>
          <Foot n={6} />
        </div>
      ),
    },

    // 05 — the board: the identity applied, all at once
    {
      label: t("bdeck.s.board"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={7} title={t("bdeck.s.board")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.board.headline")}</h3>
          <BrandBoard kit={kit} slug={slug} shots={shots} labels={BOARD_TILES.map((k) => t(`bdeck.board.t.${k}`))} />
          <p className="bdeck-p bdeck-muted">{t("bdeck.board.note")}</p>
          <Foot n={7} />
        </div>
      ),
    },

    // 06 — the built site, in its own frames
    {
      label: t("bdeck.s.site"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={8} title={t("bdeck.s.site")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.site.headline")}</h3>

          {(shots.length > 0 || siteImage) && (
            <div className="bdeck-shots">
              {(shots.length > 0 ? shots : [siteImage as string]).map((src, i) => (
                <figure key={src} className={i === 0 ? "bdeck-shots__lead" : undefined}>
                  <Image
                    src={src}
                    alt={`${kit.name} — ${t("bdeck.s.site")}`}
                    fill
                    sizes="(max-width: 760px) 90vw, 520px"
                    loading="lazy"
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                  />
                </figure>
              ))}
            </div>
          )}

          <div className="bdeck-2col bdeck-bottom">
            <div>
              <Label>{t("bdeck.site.live")}</Label>
              <p className="bdeck-p">{demo ?? kit.domain}</p>
            </div>
            {stack && (
              <div>
                <Label>{t("bdeck.site.stack")}</Label>
                <p className="bdeck-p">{stack}</p>
              </div>
            )}
          </div>
          <Foot n={8} />
        </div>
      ),
    },

    // 07 — print
    {
      label: t("bdeck.s.print"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={9} title={t("bdeck.s.print")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.print.headline")}</h3>
          <Stationery kit={kit} slug={slug} />
          <p className="bdeck-p bdeck-muted bdeck-bottom">{t("bdeck.print.note")}</p>
          <Foot n={9} />
        </div>
      ),
    },

    // 08 — what the team wears and what you hand out
    {
      label: t("bdeck.s.merch"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={10} title={t("bdeck.s.merch")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t(`bdeck.merch.headline.${merchKind}`)}</h3>

          {/* What exists, then what is still to be made. Brands with no photos
              yet show only the drawn set, exactly as before. */}
          {photos.length > 0 && (
            <div>
              <Label>{t("bdeck.merch.photos")}</Label>
              <MerchPhotos
                slug={slug}
                photos={photos.slice(0, 8)}
                alt={`${kit.name} — ${t("bdeck.merch.photos")}`}
                sizes="(max-width: 760px) 24vw, 150px"
              />
            </div>
          )}

          <div>
            {photos.length > 0 && <Label>{t("bdeck.merch.drawn")}</Label>}
            <Merch kit={kit} labels={MERCH_ITEMS.map((k) => t(`bdeck.merch.t.${k}`))} />
          </div>

          <p className="bdeck-p bdeck-muted bdeck-bottom">
            {t(`bdeck.merch.note.${merchKind === "goods" ? "goods" : "wear"}`)}
          </p>
          <Foot n={10} />
        </div>
      ),
    },

    // 09 — everyday digital
    {
      label: t("bdeck.s.daily"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={11} title={t("bdeck.s.daily")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.daily.headline")}</h3>
          <BrandBento kit={kit} siteImage={siteImage} siteVideo={siteVideo} />
          <p className="bdeck-p bdeck-muted">{t("bdeck.daily.note")}</p>
          <Foot n={11} />
        </div>
      ),
    },

    // 10 — what you get, and what happens next
    {
      label: t("bdeck.s.delivery"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={12} title={t("bdeck.s.delivery")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.del.headline")}</h3>

          <div className="bdeck-2col">
            <div>
              <Label>{t("bdeck.del.assets")}</Label>
              <ul className="bdeck-list">
                <li>{t("bdeck.del.assets.logo")}</li>
                <li>{t("bdeck.del.assets.colour")}</li>
                <li>{t("bdeck.del.assets.type")}</li>
                <li>{t("bdeck.del.assets.doc")}</li>
              </ul>
            </div>
            <div>
              <Label>{t("bdeck.del.steps")}</Label>
              <ol className="bdeck-steps-list">
                <li>{t("bdeck.del.step1")}</li>
                <li>{t("bdeck.del.step2")}</li>
                <li>{t("bdeck.del.step3")}</li>
              </ol>
            </div>
          </div>

          <div className="bdeck-signoff bdeck-bottom" style={{ background: ground, color: onGround }}>
            <div>
              <Label>{t("bdeck.del.next")}</Label>
              <p style={{ fontFamily: kit.display }}>{t("bdeck.del.next.body")}</p>
            </div>
            <span className="bdeck-signoff__mark" style={{ color: accent }}>
              <Motif name={kit.motif} size={34} />
            </span>
          </div>
          <Foot n={12} />
        </div>
      ),
    },

    // 11 — the appendix: everything a printer or a developer will ask for
    {
      label: t("bdeck.s.specs"),
      render: () => (
        <div className="bdeck-page" style={{ background: paper, color: ink }}>
          <Head n={13} title={t("bdeck.s.specs")} />
          <h3 className="bdeck-h" style={{ fontFamily: kit.display }}>{t("bdeck.specs.headline")}</h3>
          <p className="bdeck-p bdeck-muted">{t("bdeck.specs.intro")}</p>

          <dl className="bdeck-specs bdeck-specs--two">
            {SPEC_KEYS.map((k) => (
              <div key={k}>
                <dt>{t(`bdeck.specs.${k}`)}</dt>
                <dd className="bdeck-mono">{t(`bdeck.specs.${k}.body`)}</dd>
              </div>
            ))}
          </dl>

          <div className="bdeck-note bdeck-bottom" style={{ borderColor: accent }}>
            <Label>{t("bdeck.specs.faces")}</Label>
            <p>
              <span style={{ fontFamily: kit.display }}>{t("bdeck.type.titles")}</span>
              {" · "}
              {kit.display.split(",")[0].replace(/"/g, "")}
              {" — "}
              <span style={{ fontFamily: kit.body }}>{t("bdeck.type.text")}</span>
              {" · "}
              {kit.body.split(",")[0].replace(/"/g, "").replace("var(--font-ui)", "General Sans")}
            </p>
          </div>
          <Foot n={13} />
        </div>
      ),
    },
  ];

  const total = slides.length;
  const go = useCallback((next: number) => jump(Math.max(0, Math.min(total - 1, next))), [jump, total]);

  // Autoplay. Three things hold it back, all of them deliberate: the reader
  // pressing pause, the deck being off screen (otherwise it burns through
  // thirteen pages while the visitor reads something else), and a stated
  // preference for reduced motion.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // A timeout keyed on `index`, not an interval: a page the reader turned by
  // hand gets its full dwell time rather than whatever was left on the clock.
  useEffect(() => {
    if (!playing || !inView) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, inView, index, total]);

  // Arrows move the document only while the reader is inside it, so the deck
  // never steals the arrow keys from the page it lives on.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(total - 1); }
  };

  // Keep the turned page in view: on a phone the deck is taller than the screen,
  // so page 7 would otherwise open scrolled to its middle.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = stageRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [index]);

  const vars = {
    ["--bk-paper"]: paper,
    ["--bk-ink"]: ink,
    ["--bk-primary"]: primary,
    ["--bk-accent"]: accent,
  } as React.CSSProperties;

  return (
    <section className="bdeck" style={vars} aria-labelledby={headingId} onKeyDown={onKeyDown}>
      <header className="bdeck-bar">
        <span className="bdeck-bar__eyebrow">{t("bdeck.eyebrow")}</span>
        <p className="bdeck-bar__intro">{t("bdeck.intro")}</p>
      </header>

      <div
        className="bdeck-stage"
        ref={stageRef}
        tabIndex={0}
        role="group"
        onFocus={() => setPlayRequest(false)}
        aria-roledescription={t("bdeck.page")}
        aria-label={`${PAGE(index + 1)} / ${PAGE(total)} — ${slides[index].label}`}
        onTouchStart={(e) => { touchX.current = e.changedTouches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 44) go(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {/* Keyed on the page number so React remounts the sheet and the turn
            animation replays instead of being reconciled away. */}
        <div key={index}>{slides[index].render()}</div>
      </div>

      <nav className="bdeck-nav" aria-label={t("bdeck.eyebrow")}>
        {/* Keyed on the page so the bar restarts its run with every turn. */}
        {playing && inView && (
          <span key={index} className="bdeck-nav__progress" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} aria-hidden="true" />
        )}

        <button
          type="button"
          className="bdeck-nav__play"
          onClick={() => setPlayRequest(!playing)}
          aria-label={playing ? t("bdeck.pause") : t("bdeck.play")}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4" y="3" width="3" height="10" rx="1" /><rect x="9" y="3" width="3" height="10" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.4v9.2a.6.6 0 0 0 .93.5l7-4.6a.6.6 0 0 0 0-1l-7-4.6a.6.6 0 0 0-.93.5Z" /></svg>
          )}
        </button>

        <button type="button" className="bdeck-nav__arrow" onClick={() => go(index - 1)} disabled={index === 0} aria-label={t("bdeck.prev")}>←</button>

        <ol className="bdeck-nav__pages">
          {slides.map((s, i) => (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === index ? "true" : undefined}
                aria-label={`${PAGE(i + 1)} — ${s.label}`}
                title={s.label}
              >
                {PAGE(i + 1)}
              </button>
            </li>
          ))}
        </ol>

        {/* Silent while it turns itself: a page announcement every seven seconds
            is noise, not information. */}
        <span className="bdeck-nav__count" aria-live={playing ? "off" : "polite"}>
          {PAGE(index + 1)} <i>/</i> {PAGE(total)}
        </span>

        <button type="button" className="bdeck-nav__arrow" onClick={() => go(index + 1)} disabled={index === total - 1} aria-label={t("bdeck.next")}>→</button>
      </nav>
    </section>
  );
}
