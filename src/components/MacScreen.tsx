"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

// Laptop screen: the "dal mio computer alla tua azienda" process circuit. Inline
// SVG (reacts to the site language + theme), adapted to Parchment & Forest. The
// flowing dashes + traveling dots carry the value path from the computer to the
// company. Language follows the global site toggle (IT/EN/SV); non-interactive
// since the scroll-driven laptop owns the pointer.
//
// `uid` namespaces all SVG ids so multiple instances (desktop laptop + mobile
// static card) can coexist without duplicate-id collisions.
const DOTS = [
  { path: "p-main", tone: "gold", dur: 4.6 },
  { path: "p-g1", tone: "gold", dur: 3.6 },
  { path: "p-g2", tone: "gold", dur: 3.9 },
  { path: "p-n1", tone: "sage", dur: 3.4 },
  { path: "p-n2", tone: "sage", dur: 2.6 },
  { path: "p-n3", tone: "sage", dur: 4.1 },
] as const;

export default function MacScreen({ uid = "mc" }: { uid?: string }) {
  const { t } = useLang();
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const id = (s: string) => `${uid}-${s}`;

  return (
    <div className="macscreen" aria-hidden="true">
      <svg className="mc-svg" viewBox="0 -60 1200 900" preserveAspectRatio="xMidYMid meet" role="img">
        <defs>
          <marker id={id("ah-gold")} markerWidth="9" markerHeight="9" refX="5.5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" className="mc-gold-f" />
          </marker>
          <marker id={id("ah-sage")} markerWidth="9" markerHeight="9" refX="5.5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" className="mc-sage-f" />
          </marker>
          <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* window panel = the framed photo */}
        <rect x="12" y="14" width="1176" height="752" rx="18" className="mc-panel mc-ink-s" strokeWidth="2" />
        <rect x="12" y="14" width="1176" height="54" rx="18" className="mc-bar" />
        <rect x="12" y="50" width="1176" height="18" className="mc-bar" />
        <line x1="12" y1="68" x2="1188" y2="68" className="mc-ink-s" strokeWidth="1.4" opacity="0.5" />
        <circle cx="44" cy="41" r="6.5" className="mc-gold-f" />
        <circle cx="66" cy="41" r="6.5" className="mc-sage-f" />
        <circle cx="88" cy="41" r="6.5" className="mc-ink-f" />
        <text x="600" y="46" textAnchor="middle" className="mc-wordmark" fontSize="15" letterSpacing="6" opacity="0.7">
          Lorenzo.studio
        </text>

        {/* left text column */}
        <text x="70" y="170" className="mc-eyebrow" fontSize="15">{t("macscreen.kicker")}</text>
        <text x="68" y="230" className="mc-title" fontSize="33">{t("macscreen.title1")}</text>
        <text x="68" y="272" className="mc-title" fontSize="33">{t("macscreen.title2")}</text>
        <text x="70" y="322" className="mc-body" fontSize="19">{t("macscreen.body1")}</text>
        <text x="70" y="350" className="mc-body" fontSize="19">{t("macscreen.body2")}</text>

        {/* connections */}
        <g fill="none" strokeLinecap="round">
          <path id={id("p-main")} d="M 312 470 L 948 470" className="mc-ink-s" strokeWidth="2" strokeDasharray="9 11" opacity="0.7" />
          <path d="M 312 470 L 948 470" className="mc-gold-s flow" strokeWidth="2.4" />

          <path id={id("p-g1")} d="M 1010 386 C 1010 300 968 250 920 232" className="mc-goldsoft-s" strokeWidth="2" opacity="0.5" />
          <path d="M 1010 386 C 1010 300 968 250 920 232" className="mc-gold-s flow" strokeWidth="2.2" markerEnd={`url(#${id("ah-gold")})`} />
          <path id={id("p-g2")} d="M 818 282 C 766 352 690 382 634 404" className="mc-goldsoft-s" strokeWidth="2" opacity="0.5" />
          <path d="M 818 282 C 766 352 690 382 634 404" className="mc-gold-s flow" strokeWidth="2.2" markerEnd={`url(#${id("ah-gold")})`} />

          <path id={id("p-n1")} d="M 616 452 C 610 508 606 544 600 582" className="mc-sage-s" strokeWidth="2" opacity="0.5" />
          <path d="M 616 452 C 610 508 606 544 600 582" className="mc-sage-s flow slow" strokeWidth="2.4" markerEnd={`url(#${id("ah-sage")})`} />
          <path id={id("p-n2")} d="M 660 612 C 690 616 712 616 742 616" className="mc-sage-s" strokeWidth="2" opacity="0.5" />
          <path d="M 660 612 C 690 616 712 616 742 616" className="mc-sage-s flow slow" strokeWidth="2.4" />
          <path id={id("p-n3")} d="M 858 598 C 930 558 982 516 1006 472" className="mc-sage-s" strokeWidth="2" opacity="0.5" />
          <path d="M 858 598 C 930 558 982 516 1006 472" className="mc-sage-s flow slow" strokeWidth="2.4" markerEnd={`url(#${id("ah-sage")})`} />
        </g>

        {/* traveling dots */}
        <g>
          {!reduce &&
            DOTS.map((d) => {
              const fill = d.tone === "gold" ? "mc-gold-f" : "mc-sage-f";
              return (
                <g key={d.path}>
                  <circle r="8" className={fill} opacity="0.28" filter={`url(#${id("soft")})`}>
                    <animateMotion dur={`${d.dur}s`} repeatCount="indefinite" rotate="auto">
                      <mpath href={`#${id(d.path)}`} />
                    </animateMotion>
                  </circle>
                  <circle r="4.5" className={fill}>
                    <animateMotion dur={`${d.dur}s`} repeatCount="indefinite" rotate="auto">
                      <mpath href={`#${id(d.path)}`} />
                    </animateMotion>
                  </circle>
                </g>
              );
            })}
        </g>

        {/* dots on the main line under the middle nodes */}
        <circle cx="440" cy="470" r="5" className="mc-gold-f" />
        <circle cx="620" cy="470" r="5" className="mc-gold-f" />
        <circle cx="780" cy="470" r="5" className="mc-gold-f" />

        {/* nodes / icons */}
        {/* computer box */}
        <g className="mc-icon mc-breathe">
          <rect x="190" y="388" width="120" height="84" rx="16" className="mc-panel-f mc-ink-s" strokeWidth="2.4" />
          <path d="M243 416 l-13 14 l13 14 M257 416 l13 14 l-13 14" fill="none" className="mc-ink-s" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* architettura: blueprint */}
        <g transform="translate(440,408)">
          <g className="mc-icon mc-breathe mc-d1">
            <rect x="-22" y="-20" width="44" height="36" rx="3" fill="none" className="mc-ink-s" strokeWidth="2.4" />
            <rect x="-13" y="-11" width="16" height="14" fill="none" className="mc-ink-s" strokeWidth="2" />
            <path d="M3 -4 H14 M-2 3 V16" className="mc-ink-s" strokeWidth="2" fill="none" />
            <circle cx="-22" cy="16" r="3.4" className="mc-gold-f" />
          </g>
        </g>
        {/* automazione: cloud + gear */}
        <g transform="translate(620,405)">
          <g className="mc-icon mc-breathe mc-d2">
            <path d="M-26 6 a13 13 0 0 1 6 -25 a16 16 0 0 1 30 4 a11 11 0 0 1 2 21 Z" fill="none" className="mc-ink-s" strokeWidth="2.4" strokeLinejoin="round" />
            <g transform="translate(6,2)">
              <circle r="9.5" className="mc-panel-f mc-ink-s" strokeWidth="2.2" />
              <circle r="3.4" fill="none" className="mc-ink-s" strokeWidth="2" />
              <g className="mc-ink-s" strokeWidth="2" strokeLinecap="round" fill="none">
                <path d="M0 -13 V-9" />
                <path d="M0 9 V13" />
                <path d="M-13 0 H-9" />
                <path d="M9 0 H13" />
                <path d="M-9 -9 l3 3" />
                <path d="M9 9 l-3 -3" />
                <path d="M9 -9 l-3 3" />
                <path d="M-9 9 l3 -3" />
              </g>
            </g>
          </g>
        </g>
        {/* spedizione: rocket */}
        <g transform="translate(780,408)">
          <g className="mc-icon mc-breathe mc-d3">
            <path d="M0 -24 C12 -14 13 2 6 14 H-6 C-13 2 -12 -14 0 -24 Z" fill="none" className="mc-ink-s" strokeWidth="2.4" strokeLinejoin="round" />
            <circle cx="0" cy="-7" r="4.6" fill="none" className="mc-gold-s" strokeWidth="2.2" />
            <path d="M-6 14 l-7 8 l5 -1 M6 14 l7 8 l-5 -1" fill="none" className="mc-ink-s" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M-2 16 l2 8 l2 -8" fill="none" className="mc-gold-s" strokeWidth="2.2" strokeLinejoin="round" />
          </g>
        </g>
        {/* azienda box: rising chart */}
        <g className="mc-icon mc-breathe mc-d4">
          <rect x="950" y="388" width="120" height="84" rx="16" className="mc-panel-f mc-ink-s" strokeWidth="2.4" />
          <path d="M972 452 L992 432 L1008 442 L1040 410" fill="none" className="mc-ink-s" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="1036" y="406" width="8" height="8" rx="1.5" className="mc-gold-f" />
        </g>
        {/* monitoraggio: dashboard */}
        <g transform="translate(840,225)">
          <g className="mc-icon mc-breathe mc-d2">
            <rect x="-78" y="-46" width="156" height="92" rx="14" className="mc-panel-f mc-ink-s" strokeWidth="2.6" />
            <rect x="-66" y="-34" width="60" height="56" rx="6" fill="none" className="mc-ink-s" strokeWidth="2" />
            <circle cx="-36" cy="-6" r="14" fill="none" className="mc-ink-s" strokeWidth="2" />
            <path d="M-36 -6 V-20 A14 14 0 0 1 -23 -1 Z" className="mc-gold-f" opacity="0.85" />
            <g transform="translate(6,0)">
              <circle cx="34" cy="-22" r="12" fill="none" className="mc-ink-s" strokeWidth="2" />
              <path d="M34 -22 L34 -34 M34 -22 L44 -18" className="mc-gold-s" strokeWidth="2.4" fill="none" />
              <g className="mc-ink-s" strokeWidth="2.4" strokeLinecap="round" fill="none">
                <path d="M12 18 V8" />
                <path d="M24 18 V2" />
                <path d="M36 18 V10" />
              </g>
              <path d="M48 14 L56 4 L62 9" fill="none" className="mc-sage-s" strokeWidth="2.4" strokeLinejoin="round" />
            </g>
          </g>
        </g>
        {/* servizi: stacked layers */}
        <g transform="translate(600,615)">
          <g className="mc-icon mc-breathe mc-d1">
            <path d="M0 -22 L26 -10 L0 2 L-26 -10 Z" className="mc-sage-f mc-ink-s" strokeWidth="2.2" strokeLinejoin="round" opacity="0.55" />
            <path d="M-26 -1 L0 11 L26 -1" fill="none" className="mc-ink-s" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M-26 9 L0 21 L26 9" fill="none" className="mc-ink-s" strokeWidth="2.2" strokeLinejoin="round" />
          </g>
        </g>
        {/* scalabilita: network / globe */}
        <g transform="translate(800,615)">
          <g className="mc-icon mc-breathe mc-d3">
            <circle r="16" fill="none" className="mc-ink-s" strokeWidth="2.2" />
            <ellipse rx="7" ry="16" fill="none" className="mc-ink-s" strokeWidth="1.6" />
            <path d="M-16 -5 H16 M-16 5 H16" className="mc-ink-s" strokeWidth="1.6" fill="none" />
            <g className="mc-sage-s" strokeWidth="2" fill="none">
              <path d="M16 -12 L34 -18 M16 0 L36 0 M16 12 L34 18" />
            </g>
            <g className="mc-gold-f">
              <circle cx="36" cy="-18" r="3.4" />
              <circle cx="38" cy="0" r="3.4" />
              <circle cx="36" cy="18" r="3.4" />
            </g>
          </g>
        </g>

        {/* node labels */}
        <text x="250" y="506" textAnchor="middle" className="mc-lbl mc-muted">{t("macscreen.n.computer")}</text>
        <text x="440" y="506" textAnchor="middle" className="mc-lbl">{t("macscreen.n.architettura")}</text>
        <text x="620" y="506" textAnchor="middle" className="mc-lbl">{t("macscreen.n.automazione")}</text>
        <text x="780" y="506" textAnchor="middle" className="mc-lbl">{t("macscreen.n.spedizione")}</text>
        <text x="1010" y="506" textAnchor="middle" className="mc-lbl mc-muted">{t("macscreen.n.azienda")}</text>

        <text x="840" y="300" textAnchor="middle" className="mc-lbl">
          <tspan x="840" dy="0">{t("macscreen.n.monitoraggio1")}</tspan>
          <tspan x="840" dy="18">{t("macscreen.n.monitoraggio2")}</tspan>
        </text>
        <text x="600" y="688" textAnchor="middle" className="mc-lbl">
          <tspan x="600" dy="0">{t("macscreen.n.servizi1")}</tspan>
          <tspan x="600" dy="18">{t("macscreen.n.servizi2")}</tspan>
        </text>
        <text x="800" y="688" textAnchor="middle" className="mc-lbl">
          <tspan x="800" dy="0">{t("macscreen.n.scalabilita1")}</tspan>
          <tspan x="800" dy="18">{t("macscreen.n.scalabilita2")}</tspan>
        </text>

        {/* sparkle */}
        <path d="M1120 690 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" className="mc-goldsoft-f" opacity="0.6" />
      </svg>
    </div>
  );
}
