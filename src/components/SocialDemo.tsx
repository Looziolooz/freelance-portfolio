"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";
import { DemoPlayerBar, useDemoPlayer } from "./DemoPlayer";
import { getSocialDemo, SOCIAL_CAROUSEL_SLIDES, SOCIAL_POST_IMAGE, SOCIAL_REELS } from "@/lib/social-demos";

// Worked examples for the social-content service: a post, a carousel and a reel,
// each built from a different real project.
//
// Three SECTIONS, not three tabs. Tabs made the page argue against itself: the
// pitch is "a stream of content every month", and the demo showed one artefact
// at a time with the other two hidden behind a control. It also put the carousel
// on a clock it could not finish inside — four slides sharing a step sized for a
// video meant the sequence looped back to its cover before reaching its
// conclusion, which is the slide that carries the result. Stacked, each format
// owns its own space and its own pace: nothing is hidden, nothing is cut off,
// and the amount of work per month is the first thing the page communicates.
//
// The chrome is deliberately generic. No platform logos, no borrowed UI, and
// above all no engagement numbers: a mock showing "2.4k likes" would be a
// fabricated result, which is the same thing as a fabricated testimonial. What
// is on display is the copy and the structure, so the frame's only job is to
// make the FORMAT legible (square, swipeable, vertical) and then get out of the
// way.
const CSS = `
.sdm { container-type: inline-size; }
.sdm__hint { margin: 0 0 clamp(20px, 2.6vw, 30px); font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.04em; line-height: 1.55; color: var(--ink-muted); max-width: 68ch; }

.sdm__sec { padding-top: clamp(22px, 3vw, 34px); border-top: 3px solid var(--ink-border); }
.sdm__sec + .sdm__sec { margin-top: clamp(26px, 3.6vw, 46px); }
.sdm__head { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
.sdm__n {
  padding: 3px 9px; border: 2px solid var(--ink-border); border-radius: var(--radius);
  background: var(--accent-green); color: var(--btn-ink);
  font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em;
}
.sdm__t { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(19px, 2vw, 25px); line-height: 1.1; letter-spacing: -0.02em; color: var(--fg); }
.sdm__src { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); }

.sdm__stage { display: grid; grid-template-columns: minmax(0, 340px) minmax(0, 1fr); gap: clamp(18px, 2.4vw, 32px); align-items: start; }
@container (max-width: 660px) { .sdm__stage { grid-template-columns: 1fr; } }

/* The artefact itself */
.sdm__frame {
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-page); box-shadow: var(--shadow-card); overflow: hidden;
}
.sdm__media { position: relative; display: block; width: 100%; background: var(--canvas-panel-grey); }
.sdm__media--square { aspect-ratio: 1 / 1; }
.sdm__media--tall { aspect-ratio: 9 / 16; }
.sdm__media img, .sdm__media video { width: 100%; height: 100%; object-fit: cover; display: block; }
.sdm__body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 9px; }
.sdm__caption { margin: 0; font-size: 13.5px; line-height: 1.55; color: var(--ink-body); white-space: pre-line; }
.sdm__tags { margin: 0; font-family: var(--font-mono); font-size: 11.5px; line-height: 1.5; color: var(--accent-green-deep); }

/* Carousel slides. Slide 1 carries the image; the rest are type on the brand
   grounds, which is how a real carousel is built — one hook, then reading. */
.sdm__slide { position: absolute; inset: 0; display: block; background: var(--canvas-panel-yellow); }
/* An author rule beats the user-agent's [hidden] { display: none }, so the
   display:flex above kept every slide painted, stacked, with the last one on
   top. The carousel looked frozen on its final slide no matter which dot was
   active. Restating it here is the fix, and it is why hidden + a display rule
   is a trap worth remembering. */
.sdm__slide[hidden] { display: none; }
.sdm__slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sdm__slide-cap {
  position: absolute; left: 16px; right: 16px; bottom: 16px;
  display: flex; flex-direction: column; gap: 5px; padding: 12px 14px;
  border: 2px solid var(--ink-border); border-radius: var(--radius);
  background: var(--canvas-page);
}
.sdm__slide-cap--end { background: var(--accent-green); }
.sdm__slide-t { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(17px, 4.4cqw, 24px); line-height: 1.1; letter-spacing: -0.02em; color: var(--fg); }
.sdm__slide-b { margin: 0; font-size: clamp(12.5px, 2.6cqw, 15px); line-height: 1.5; color: var(--ink-body); }
.sdm__nav { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 11px 14px; border-top: 2px solid var(--ink-border); }
.sdm__dots { display: flex; gap: 6px; }
.sdm__dot { width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid var(--ink-border); background: transparent; padding: 0; cursor: pointer; }
.sdm__dot[aria-current="true"] { background: var(--accent-green); }
.sdm__arrows { display: flex; gap: 6px; }
.sdm__arrow {
  width: 28px; height: 28px; display: grid; place-items: center; cursor: pointer; font: inherit; font-size: 13px;
  border: 2px solid var(--ink-border); border-radius: var(--radius); background: var(--canvas-panel-yellow); color: var(--ink-body);
}
.sdm__arrow:disabled { opacity: 0.35; cursor: default; }
.sdm__count { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); }

/* Reel text overlay — the only thing a sound-off viewer receives. */
.sdm__overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; padding: 18px; background: linear-gradient(to top, color-mix(in oklch, var(--ink-border) 78%, transparent) 0%, transparent 62%); }
.sdm__line { align-self: flex-start; margin: 0; padding: 5px 10px; border-radius: var(--radius); background: var(--canvas-page); color: var(--ink-body); font-family: var(--font-display); font-weight: 600; font-size: clamp(13px, 3.4cqw, 17px); line-height: 1.2; }
.sdm__line--cta { background: var(--accent-green); }
.sdm__gen { margin: 8px 0 0; padding-top: 9px; border-top: 1.5px solid color-mix(in oklch, var(--ink-border) 20%, transparent); font-size: 12.5px; line-height: 1.5; color: var(--ink-muted); }
.sdm__muted { display: inline-flex; align-items: center; gap: 6px; margin: 10px 0 0; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-muted); }

/* Three reels in a row. They drop to two, then one, before the vertical frames
   get too narrow to read the overlay type. */
.sdm__reels { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(12px, 1.6vw, 20px); }
@container (max-width: 760px) { .sdm__reels { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container (max-width: 460px) { .sdm__reels { grid-template-columns: 1fr; } }
.sdm__reel { margin: 0; }
.sdm__reel .sdm__body { gap: 6px; }
.sdm__reels-foot { margin-top: clamp(16px, 2vw, 22px); display: flex; flex-direction: column; gap: 4px; max-width: 74ch; }
.sdm__reels-foot .sdm__muted { margin: 6px 0 0; }

/* The side column: why the piece is shaped the way it is. */
/* Capped: the note is two lines and the column is a free 1fr, so without
   a measure it stretched to ~700px and the section read as mostly void. */
.sdm__aside { display: flex; flex-direction: column; gap: 6px; max-width: 54ch; }
.sdm__aside dt { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-green-deep); }
.sdm__aside dd { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--ink-body); }
/* Stessa cura per la demo dei contenuti: la fonte, i tag e il contatore
   scendevano a 10,5. */
@container (max-width: 660px) {
  .sdm__hint { font-size: 12.5px; }
  .sdm__src { font-size: 12px; }
  .sdm__tags { font-size: 12px; }
  .sdm__count { font-size: 12px; }
  .sdm__muted { font-size: 12px; }
}
`;

export default function SocialDemo() {
  const { lang } = useLang();
  const c = getSocialDemo(lang);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Each section runs its own playback, which is the reason for splitting them:
  // the carousel gets a pace that fits four slides of reading, the reel gets one
  // that fits a five-second film. One shared step suited neither.
  const CAR_MS = 1500;
  const car = useDemoPlayer(c.carousel.slides.length, CAR_MS);
  const slides = c.carousel.slides;

  return (
    <div className="sdm">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <p className="sdm__hint">{c.hint}</p>

      {/* 01 — the post. No player: a post is a single still, and a control that
          does nothing is worse than no control. */}
      <section className="sdm__sec">
        <header className="sdm__head">
          <span className="sdm__n">01</span>
          <h3 className="sdm__t">{c.tabPost}</h3>
          <span className="sdm__src">{c.sourceLabel}: {c.post.project}</span>
        </header>
        <div className="sdm__stage">
          <div className="sdm__frame">
            <div className="sdm__media sdm__media--square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SOCIAL_POST_IMAGE} alt="" aria-hidden="true" loading="lazy" width={800} height={800} />
            </div>
            <div className="sdm__body">
              <p className="sdm__caption">{c.post.caption}</p>
              <p className="sdm__tags">{c.post.tags}</p>
            </div>
          </div>
          <dl className="sdm__aside">
            <dt>{c.noteLabel}</dt>
            <dd>{c.post.note}</dd>
          </dl>
        </div>
      </section>

      {/* 02 — the carousel */}
      <section className="sdm__sec" ref={car.ref}>
        <header className="sdm__head">
          <span className="sdm__n">02</span>
          <h3 className="sdm__t">{c.tabCarousel}</h3>
          <span className="sdm__src">{c.sourceLabel}: {c.carousel.project}</span>
        </header>
        <DemoPlayerBar
          count={slides.length}
          index={car.index}
          playing={car.playing}
          interval={CAR_MS}
          onToggle={car.toggle}
          onPick={car.pick}
          labels={slides.map((s) => s.t)}
        />
        <div className="sdm__stage">
          <div className="sdm__frame">
            <div className="sdm__media sdm__media--square">
              {slides.map((s, i) => (
                // Every slide is a picture with a caption box, which is what a
                // real carousel is. The last one takes the ochre box so the
                // payoff is marked without needing a different kind of slide.
                <div key={s.t} className="sdm__slide" hidden={i !== car.index}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SOCIAL_CAROUSEL_SLIDES[i]} alt="" aria-hidden="true" loading="lazy" width={800} height={800} />
                  <div className={`sdm__slide-cap${i === slides.length - 1 ? " sdm__slide-cap--end" : ""}`}>
                    <h4 className="sdm__slide-t">{s.t}</h4>
                    <p className="sdm__slide-b">{s.b}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sdm__nav">
              <span className="sdm__count">{c.slideLabel} {car.index + 1}/{slides.length}</span>
              <div className="sdm__dots">
                {slides.map((s, i) => (
                  <button
                    key={s.t}
                    type="button"
                    className="sdm__dot"
                    aria-current={i === car.index}
                    aria-label={`${c.slideLabel} ${i + 1}`}
                    onClick={() => car.pick(i)}
                  />
                ))}
              </div>
              <div className="sdm__arrows">
                <button type="button" className="sdm__arrow" onClick={() => car.pick(car.index - 1)} disabled={car.index === 0} aria-label="←">←</button>
                <button type="button" className="sdm__arrow" onClick={() => car.pick(car.index + 1)} disabled={car.index === slides.length - 1} aria-label="→">→</button>
              </div>
            </div>
            <div className="sdm__body">
              <p className="sdm__caption">{c.carousel.caption}</p>
            </div>
          </div>
          <dl className="sdm__aside">
            <dt>{c.noteLabel}</dt>
            <dd>{c.carousel.note}</dd>
          </dl>
        </div>
      </section>

      {/* 03 — the reels. All three at once, not one rotating: three films that
          swap in the same frame read as one film that keeps changing its mind,
          and the visitor cannot tell whether they have seen everything. Side by
          side, the range across three different trades IS the argument. */}
      <section className="sdm__sec">
        <header className="sdm__head">
          <span className="sdm__n">03</span>
          <h3 className="sdm__t">{c.tabReel}</h3>
          <span className="sdm__src">{c.reel.items.map((x) => x.project).join(" · ")}</span>
        </header>

        <div className="sdm__reels">
          {c.reel.items.map((item, i) => {
            const a = SOCIAL_REELS[i];
            return (
              <figure className="sdm__frame sdm__reel" key={item.project}>
                <div className="sdm__media sdm__media--tall">
                  {still || !a ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a?.poster} alt="" aria-hidden="true" width={360} height={640} />
                  ) : (
                    <video src={a.video} poster={a.poster} autoPlay muted loop playsInline preload="none" aria-hidden="true" />
                  )}
                  <div className="sdm__overlay">
                    {item.lines.map((l, n) => (
                      <p key={l} className={`sdm__line${n === item.lines.length - 1 ? " sdm__line--cta" : ""}`}>
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
                <figcaption className="sdm__body">
                  <span className="sdm__src">{item.project}</span>
                  <p className="sdm__caption">{item.caption}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="sdm__reels-foot">
          <dl className="sdm__aside">
            <dt>{c.noteLabel}</dt>
            <dd>{c.reel.note}</dd>
          </dl>
          <p className="sdm__muted">{c.mutedLabel}</p>
          {/* Said out loud on purpose. "No film crew" is a stronger argument
              than a video pretending to have had one, and a generated clip
              presented as filmed is the same category of lie as an invented
              testimonial. */}
          <p className="sdm__gen">{c.reel.generated}</p>
        </div>
      </section>
    </div>
  );
}
