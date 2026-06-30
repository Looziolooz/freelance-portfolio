"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Aceternity-style vertical timeline, re-themed to Parchment & Forest.
// A thin rail on the left fills with an ochre→forest gradient as you scroll;
// sticky dots + large phase labels stay fixed while the content scrolls past on
// the right. Each phase carries a realistic photo. framer-motion (the package
// installed here) — same API as motion/react.
export type TimelineEntry = {
  phase: string;
  title: string;
  statement: string;
  body: string;
  bullets: string[];
  image: string;
  alt: string;
};

export default function ProcessTimeline({ entries }: { entries: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [entries]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 18%", "end 78%"],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], [0, height]);
  const fillOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  return (
    <div ref={containerRef} className="ptl">
      <div ref={ref} className="ptl-track">
        {entries.map((e, i) => (
          <div key={i} className="ptl-row">
            {/* sticky marker: dot + big phase label */}
            <div className="ptl-marker">
              <span className="ptl-dot" aria-hidden="true">
                <span className="ptl-dot__core" />
              </span>
              <div className="ptl-marker__label">
                <span className="ptl-phase">{e.phase}</span>
                <h2 className="ptl-title">{e.title}</h2>
              </div>
            </div>

            {/* content */}
            <div className="ptl-content">
              <div className="ptl-content__head">
                <span className="ptl-phase">{e.phase}</span>
                <h2 className="ptl-title">{e.title}</h2>
              </div>
              <p className="ptl-statement">{e.statement}</p>
              <p className="ptl-body">{e.body}</p>
              <ul className="ptl-bullets">
                {e.bullets.map((b, bi) => (
                  <li key={bi}>
                    <span className="ptl-tick" aria-hidden="true">+</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="ptl-photo">
                {e.image && (
                  <Image
                    src={e.image}
                    alt={e.alt}
                    fill
                    sizes="(max-width: 880px) 100vw, 620px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* the rail — faint track + scroll-driven ochre→forest fill */}
        <div className="ptl-rail" style={{ height }}>
          <motion.div
            className="ptl-rail__fill"
            style={{ height: fillHeight, opacity: fillOpacity }}
          />
        </div>
      </div>

      <style>{`
        .ptl { position: relative; width: 100%; }
        .ptl-track { position: relative; max-width: 1100px; margin: 0 auto; padding: 0 clamp(16px, 5vw, 40px); }

        .ptl-row { display: flex; justify-content: flex-start; padding-top: clamp(40px, 7vw, 110px); }
        .ptl-row:first-child { padding-top: clamp(20px, 4vw, 56px); }

        /* marker column */
        .ptl-marker { position: sticky; top: calc(var(--topbar-h) + 48px); z-index: 3; align-self: flex-start; display: flex; align-items: center; }
        .ptl-dot {
          position: absolute; left: 6px; display: grid; place-items: center;
          width: 44px; height: 44px; border-radius: 50%;
          border: 3px solid var(--ink-border); background: var(--canvas-page);
          box-shadow: var(--shadow-badge);
        }
        .ptl-dot__core {
          width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--ink-border);
          background: linear-gradient(145deg, var(--accent-green), var(--accent-green-deep));
        }
        .ptl-marker__label { display: none; }

        /* content column */
        .ptl-content { position: relative; width: 100%; padding-left: 64px; }
        .ptl-content__head { margin-bottom: 14px; }
        .ptl-phase { display: block; font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-green-deep); }
        .ptl-title { margin: 4px 0 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(30px, 5vw, 52px); line-height: 1.0; letter-spacing: -0.02em; color: var(--ink-body); }

        .ptl-statement { margin: 0 0 14px; font-family: var(--font-display); font-size: clamp(20px, 2.4vw, 30px); font-weight: 500; line-height: 1.18; letter-spacing: -0.01em; color: var(--ink-body); }
        .ptl-body { margin: 0 0 22px; font-size: clamp(15px, 1.3vw, 17px); line-height: 1.65; color: var(--ink-muted); max-width: 60ch; }

        .ptl-bullets { list-style: none; margin: 0 0 26px; padding: 0; display: flex; flex-direction: column; }
        .ptl-bullets li { display: flex; align-items: baseline; gap: 12px; font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--ink-body); padding: 11px 0; border-bottom: 1.5px solid color-mix(in oklch, var(--ink-border) 20%, transparent); }
        .ptl-bullets li:first-child { border-top: 1.5px solid color-mix(in oklch, var(--ink-border) 20%, transparent); }
        .ptl-tick { color: var(--accent-green-deep); font-weight: 800; flex-shrink: 0; }

        .ptl-photo {
          position: relative; width: 100%; aspect-ratio: 16 / 10; overflow: hidden;
          border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
          background: linear-gradient(150deg, color-mix(in oklch, var(--accent-green) 30%, var(--canvas-page)), color-mix(in oklch, var(--accent-green-deep) 22%, var(--canvas-page)));
          box-shadow: var(--shadow-card);
        }

        /* the rail sits at the dot's centre (left 6px + 44/2 = 28px) */
        .ptl-rail {
          position: absolute; left: 28px; top: 0; width: 3px; overflow: hidden;
          background: linear-gradient(to bottom, transparent 0%, color-mix(in oklch, var(--ink-border) 16%, transparent) 8%, color-mix(in oklch, var(--ink-border) 16%, transparent) 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent);
          mask-image: linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent);
        }
        .ptl-rail__fill {
          position: absolute; left: 0; top: 0; width: 3px; border-radius: 9999px;
          background: linear-gradient(to bottom, var(--accent-green), var(--accent-green-deep));
        }

        @media (min-width: 880px) {
          .ptl-row { gap: 56px; padding-top: clamp(80px, 9vw, 150px); }
          .ptl-marker { gap: 0; min-width: 360px; max-width: 360px; }
          .ptl-dot { left: 6px; }
          .ptl-marker__label { display: block; padding-left: 72px; }
          /* Sized so the longest single word ("Costruzione") fits inside the marker
             column; overflow-wrap is a safety net so nothing can spill over the
             content text on the right. */
          .ptl-marker__label .ptl-title { font-size: clamp(32px, 3.4vw, 46px); overflow-wrap: anywhere; }
          .ptl-content { padding-left: 0; min-width: 0; }
          .ptl-content__head { display: none; }
          .ptl-photo { max-width: 620px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ptl-rail__fill { opacity: 1 !important; height: 100% !important; }
        }
      `}</style>
    </div>
  );
}
