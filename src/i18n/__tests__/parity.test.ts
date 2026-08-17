import { describe, expect, it } from "vitest";
import { dict } from "@/i18n";

// Key parity across IT / EN / SV.
//
// t() returns the KEY ITSELF when a lookup misses, so a key present in Italian
// and absent from Swedish does not throw, does not warn and does not fail a
// build: it renders as "home.eng.web.priceNote" on the live page, only for the
// visitors who switched language. That is the one class of i18n bug the types
// cannot catch, so it gets a test.
const LANGS = ["it", "en", "sv"] as const;

// The components gallery is the deliberate exception. Its titles and blurbs come
// from the catalog on the server in Italian, and callers use loc(), which falls
// back to that server value when the key is missing (see app/componenti/page.tsx).
// So EN and SV carry override keys that Italian has no reason to duplicate.
// Anything OUTSIDE this namespace that exists in one language and not another is
// a genuine hole.
const OVERRIDE_NAMESPACES = ["components.cat."];
const isOverride = (k: string) => OVERRIDE_NAMESPACES.some((p) => k.startsWith(p));

describe("i18n dictionaries", () => {
  const italian = new Set(Object.keys(dict.it));

  for (const lang of ["en", "sv"] as const) {
    it(`${lang} covers every Italian key`, () => {
      const missing = [...italian].filter((k) => !(k in dict[lang]));
      expect(missing, `missing in ${lang}: ${missing.join(", ")}`).toEqual([]);
    });

    it(`${lang} adds nothing outside the documented override namespaces`, () => {
      const extra = Object.keys(dict[lang]).filter((k) => !italian.has(k) && !isOverride(k));
      expect(extra, `extra in ${lang}: ${extra.join(", ")}`).toEqual([]);
    });
  }

  // An empty value renders as nothing at all, which is worse than a missing key:
  // the fallback never fires, so the string simply disappears from the page.
  it("has no empty strings in any language", () => {
    const empty: string[] = [];
    for (const lang of LANGS) {
      for (const [k, v] of Object.entries(dict[lang])) {
        if (!String(v).trim()) empty.push(`${lang}:${k}`);
      }
    }
    expect(empty).toEqual([]);
  });

  // A value identical to its key means the key got pasted in as the copy.
  it("has no value that is just its own key", () => {
    const echoed: string[] = [];
    for (const lang of LANGS) {
      for (const [k, v] of Object.entries(dict[lang])) {
        if (v === k) echoed.push(`${lang}:${k}`);
      }
    }
    expect(echoed).toEqual([]);
  });
});
