"use client";

import { useEffect, useRef } from "react";
import { useLang } from "./LangProvider";

// Full homepage section list, in the order they appear on the page, localized.
// Keep ids in sync with the section ids rendered in page.tsx / the components.
const SECTIONS = [
  { id: "top", it: "Intro", en: "Intro", sv: "Intro" },
  { id: "servizi", it: "Servizi", en: "Services", sv: "Tjänster" },
  { id: "perche", it: "Perché", en: "Why me", sv: "Varför" },
  { id: "piani", it: "Metodo", en: "Method", sv: "Metod" },
  { id: "faq", it: "FAQ", en: "FAQ", sv: "FAQ" },
  { id: "audit", it: "Audit", en: "Audit", sv: "Audit" },
] as const;

export default function WayfindingNav() {
  const { lang } = useLang();
  const listRef = useRef<HTMLUListElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const labelFor = (s: (typeof SECTIONS)[number]) => s[lang] ?? s.en;

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>(".wayfinding-link");
    const list = listRef.current;
    const activeLabel = labelRef.current;
    if (!links.length || !list) return;

    const update = () => {
      const viewBottom = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      const atBottom = viewBottom >= totalHeight - 50;

      let activeIdx = 0;

      if (atBottom) {
        activeIdx = SECTIONS.length - 1;
      } else {
        const mid = window.innerHeight * 0.4;
        for (let i = SECTIONS.length - 1; i >= 0; i--) {
          const el = document.getElementById(SECTIONS[i].id);
          if (el && el.getBoundingClientRect().top <= mid) {
            activeIdx = i;
            break;
          }
        }
      }

      links.forEach((link, i) => {
        link.classList.toggle("is-active", i === activeIdx);
      });

      if (activeLabel) {
        activeLabel.textContent = labelFor(SECTIONS[activeIdx]);
      }

      const activeLink = links[activeIdx];
      const listHeight = list.offsetHeight;
      const linkCenter = activeLink.offsetTop + activeLink.offsetHeight / 2;
      const offset = listHeight / 2 - linkCenter;
      list.style.transform = `translateY(${offset}px)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [lang]);

  return (
    <nav className="wayfinding-nav" aria-label="Page sections">
      <span ref={labelRef} className="wayfinding-active-label" aria-hidden="true">Intro</span>
      <ul ref={listRef} className="wayfinding-list">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="wayfinding-link" data-section={s.id}>
              <span className="wayfinding-label">{labelFor(s)}</span>
              <span className="wayfinding-tick" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <style>{`
        .wayfinding-nav {
          position: fixed;
          right: clamp(.75rem, 1.6vw, 1.5rem);
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          padding: 1.25rem 0;
          pointer-events: auto;
          display: none;
        }

        .wayfinding-active-label {
          position: absolute;
          right: calc(18px + .75rem);
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: .02em;
          white-space: nowrap;
          pointer-events: none;
          opacity: 1;
          transition: opacity .18s ease-out;
          padding: 3px 8px;
          border-radius: 4px;
          color: var(--fg);
          background: var(--canvas-page);
          border: 1px solid var(--line);
        }

        .wayfinding-list {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0;
          margin: 0;
          padding: 0;
          list-style: none;
          transition: transform .36s cubic-bezier(.25,1,.5,1);
          will-change: transform;
        }

        .wayfinding-list::before {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--rule);
          pointer-events: none;
        }

        .wayfinding-link {
          position: relative;
          display: block;
          width: 120px;
          height: 28px;
          color: var(--muted);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: .02em;
          white-space: nowrap;
          text-decoration: none;
          transition: color .18s ease-out;
        }

        .wayfinding-link:focus-visible {
          outline: 2px solid var(--fg);
          outline-offset: 4px;
          border-radius: 2px;
        }

        .wayfinding-label {
          position: absolute;
          right: calc(18px + .75rem);
          top: 50%;
          transform: translate(-6px,-50%);
          opacity: 0;
          pointer-events: none;
          transition: opacity .26s ease-out .12s, transform .26s ease-out .12s;
          padding: 3px 8px;
          border-radius: 4px;
          color: var(--fg);
          background: var(--canvas-page);
          border: 1px solid var(--line);
        }

        .wayfinding-tick {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          display: block;
          width: 6px;
          height: 1px;
          background: currentColor;
          opacity: .4;
          transition: width .26s ease-out .12s, opacity .22s ease-out .12s;
        }

        .wayfinding-link.is-active {
          color: var(--fg);
        }

        .wayfinding-link.is-active .wayfinding-tick {
          width: 18px;
          opacity: 1;
        }

        .wayfinding-nav:hover .wayfinding-label,
        .wayfinding-nav:focus-within .wayfinding-label {
          opacity: 1;
          transform: translateY(-50%);
          pointer-events: auto;
          transition-delay: 0ms;
        }

        .wayfinding-nav:hover .wayfinding-tick,
        .wayfinding-nav:focus-within .wayfinding-tick {
          width: 12px;
          opacity: .7;
          transition-delay: 0ms;
        }

        .wayfinding-link:hover {
          color: var(--fg);
        }

        .wayfinding-link:hover .wayfinding-tick {
          width: 14px;
          opacity: 1;
        }

        .wayfinding-link.is-active .wayfinding-label {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        @media (min-width: 768px) {
          .wayfinding-nav { display: block; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wayfinding-list,
          .wayfinding-label,
          .wayfinding-tick,
          .wayfinding-link {
            transition: none;
          }
        }
      `}</style>
    </nav>
  );
}
