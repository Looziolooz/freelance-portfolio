"use client";

import Link from "next/link";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { useLang } from "./LangProvider";

// The capability list under the hero: five words, each one a door.
//
// Scroll highlight: whichever entry is crossing the middle of the viewport is
// the lit one. That is `useInView` with a margin that collapses the root to a
// single horizontal line at 50% — `-50% 0px -50% 0px` leaves a zero-height band
// across the centre, so "in view" here means "on the centre line" and nothing
// else. Steadier and cheaper than measuring distances in a scroll handler.
//
// The lit/unlit change is a CSS transition rather than Motion's `animate()`:
// colour and opacity on five nodes is exactly what the compositor is for, and
// keeping it declarative lets the hover, focus and reduced-motion states compose
// with it for free instead of fighting an imperative tween.
//
// Destinations, and the soft spots, stated plainly. `Branding` points at /work
// because the brand manuals living there ARE the branding proof, and
// `Development` points at /processo because that is where the build is
// described. Neither has a service page of its own. `Marketing` has none either
// and lands on /prezzi, which describes visibility and content. Repoint them
// here, in one place, when pages exist. /servizi/agenti-ai and
// /servizi/claude-cowork are deliberately absent: five entries, and these are
// the five words that were asked for.
const ENTRIES = [
  { label: "Branding", href: "/work" },
  { label: "Web design", href: "/servizi/siti-web" },
  { label: "Marketing", href: "/prezzi" },
  { label: "Development", href: "/processo" },
  { label: "Automazioni AI", href: "/servizi/automazioni" },
] as const;

const CSS = `
.skl {
  --skl-ground: #1B1813;
  --skl-ink: #F4F1EA;
  --skl-dim: #6E675C;
  position: relative;
  background: var(--skl-ground);
  color: var(--skl-ink);
  border-top: 3px solid var(--ink-border);
  border-bottom: 3px solid var(--ink-border);
  padding: clamp(48px, 8vw, 120px) 0;
  overflow: hidden;
}
.skl__inner { display: flex; align-items: flex-start; gap: clamp(18px, 4vw, 56px); }

/* The rotated label, as in the reference: mono, tracked, reading bottom-up. */
.skl__label {
  flex: 0 0 auto;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--font-mono);
  font-size: clamp(11px, 1.1vw, 13px);
  font-weight: 700;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--skl-ink);
  padding-top: 0.4em;
}

.skl__list { list-style: none; margin: 0; padding: 0; min-width: 0; flex: 1 1 auto; }
.skl__item + .skl__item { margin-top: clamp(2px, 0.6vw, 10px); }

.skl__link {
  display: flex;
  align-items: baseline;
  gap: 0.4em;
  text-decoration: none;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(34px, 8.5vw, 104px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--skl-dim);
  transition: color 0.4s var(--ease), opacity 0.4s var(--ease);
}
/* On the centre line, hovered, or focused: lit. */
.skl__item.is-on .skl__link,
.skl__link:hover,
.skl__link:focus-visible { color: var(--skl-ink); }
.skl__link:focus-visible { outline: 2px solid var(--accent-green); outline-offset: 6px; }

/* Pointing at one dims the rest, so the list answers the cursor as a whole. */
.skl__list:hover .skl__link { opacity: 0.45; }
.skl__list:hover .skl__link:hover { opacity: 1; }

.skl__arrow {
  font-size: 0.34em;
  color: var(--accent-green);
  opacity: 0;
  transform: translateX(-0.3em);
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
}
.skl__item.is-on .skl__arrow,
.skl__link:hover .skl__arrow,
.skl__link:focus-visible .skl__arrow { opacity: 1; transform: translateX(0); }

@media (prefers-reduced-motion: reduce) {
  .skl__link, .skl__arrow { transition: none; }
}
`;

function Entry({ label, href }: { label: string; href: string }) {
  const ref = useRef<HTMLLIElement>(null);
  // A zero-height root band across the viewport's middle: "in view" here means
  // "this element is on the centre line".
  const onCentre = useInView(ref, { margin: "-50% 0px -50% 0px" });
  return (
    <li ref={ref} className={`skl__item${onCentre ? " is-on" : ""}`}>
      <Link href={href} className="skl__link">
        {label}
        <span className="skl__arrow" aria-hidden="true">&#8599;</span>
      </Link>
    </li>
  );
}

export default function SkillsList() {
  const { t } = useLang();
  return (
    <section className="skl" aria-label={t("skills.label")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="container skl__inner">
        <span className="skl__label" aria-hidden="true">{t("skills.label")}</span>
        <ul className="skl__list">
          {ENTRIES.map((e) => (
            <Entry key={e.href} label={e.label} href={e.href} />
          ))}
        </ul>
      </div>
    </section>
  );
}
