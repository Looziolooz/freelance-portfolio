"use client";

import { useState, useSyncExternalStore } from "react";

/** mulberry32 — small, fast, and deterministic given a seed. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates on a copy — the pool is module-scope and must not be mutated. */
function shuffle<T>(pool: readonly T[], seed: number): T[] {
  const rand = rng(seed);
  const out = pool.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const newSeed = () => Math.floor(Math.random() * 0x100000000);
/** Never emits, so the snapshot is read once per mount and never again. */
const noSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * A rotating window onto a longer list: every visit shows a different draw, so
 * the surfaces that only have room for a few projects stop showing the same few
 * forever. The marquee had room for 8 of 17 and the showcase for 3, which meant
 * nine pieces of work were published and never once seen on the home page.
 *
 * Shuffling during render would desync the server HTML from the first client
 * render and break hydration, so the first paint is deliberately NOT random.
 * `useSyncExternalStore` is the sanctioned way to answer differently on the two:
 * React takes the server snapshot while hydrating, then re-renders with the
 * client one. Until that second pass the list is the head of the pool — newest
 * first, the authored order — which is what crawlers and no-JS visitors keep,
 * and is the right answer for them anyway.
 *
 * The randomness lives in a seed rather than in the shuffle, so the draw is
 * reproducible for as long as the component is mounted: re-renders from a
 * language or theme change replay the same order instead of swapping work under
 * the cursor. `useState` is what guarantees that — a `useMemo` may be discarded
 * and recomputed, which here would look like the page reshuffling itself.
 *
 * `pool` and `take` are read fresh on every render by design; both are module
 * constants at every call site today, and a changing pool should re-draw.
 */
export function useRotation<T>(pool: readonly T[], take: number = pool.length): T[] {
  const mounted = useSyncExternalStore(noSubscribe, onClient, onServer);
  const [seed] = useState(newSeed);

  return mounted ? shuffle(pool, seed).slice(0, take) : pool.slice(0, take);
}
