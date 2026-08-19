"use client";

import { useEffect, useRef, useState } from "react";
import BrandDeck from "./BrandDeck";
import { useLang } from "./LangProvider";
import { getBrandKit } from "@/lib/brand-kits";
import type { Project } from "@/lib/projects";

// /work/branding is the fascicolo page: every brand's manual, one after the
// other, instead of a grid of cards that only promises them.
//
// A deck is cheaper than it looks — it mounts one page at a time, so a whole
// manual is about seventy nodes and one screen tall. Seventeen of them is a
// long page, not a heavy one. What IS worth avoiding is seventeen covers
// fetching their photography during the first paint, so a deck stays a titled
// placeholder until it comes within a screen of the viewport, and only then
// mounts. Scrolling fast never catches an empty frame: the placeholder holds
// the same height the deck will take.
//
// The rootMargin is generous on purpose. A reader scrolling steadily should
// never see the swap; a reader flinging the page will, and a name on its brand
// colour is a better thing to fly past than a blank.

const DECK_MIN_H = 1010;

const CSS = `
.bdl { display: flex; flex-direction: column; gap: clamp(28px, 5vw, 72px); }
.bdl__item { scroll-margin-top: calc(var(--topbar-h) + 24px); }
.bdl__ph {
  min-height: ${DECK_MIN_H}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--ink-border);
  border-radius: var(--radius);
}
.bdl__ph span {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 54px);
  letter-spacing: -0.02em;
}
@media (max-width: 760px) { .bdl__ph { min-height: 620px; } }
`;

function Deck({ p }: { p: Project }) {
  const { t } = useLang();
  const kit = getBrandKit(p.slug);
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver (or an old engine): mount rather than show a
    // placeholder for ever.
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  if (!kit) return null;

  return (
    <div ref={ref} className="bdl__item" id={`brand-${p.slug}`}>
      {mounted ? (
        <BrandDeck
          kit={kit}
          slug={p.slug}
          demo={p.demo}
          stack={t(`work.proj.${p.key}.tags`)}
          siteImage={p.image}
          siteVideo={p.coverVideo}
        />
      ) : (
        <div
          className="bdl__ph"
          style={{ background: kit.paper, color: kit.ink }}
          aria-hidden="true"
        >
          <span style={{ fontFamily: kit.display }}>{kit.name}</span>
        </div>
      )}
    </div>
  );
}

export default function BrandDeckList({ items }: { items: Project[] }) {
  return (
    <div className="container">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="bdl">
        {items.map((p) => (
          <Deck key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
