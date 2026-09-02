import { describe, it, expect } from "vitest";
import { resolveLang, isLang, LANGS, dict } from "@/i18n";

describe("isLang", () => {
  it("accepts the three site languages and nothing else", () => {
    for (const l of LANGS) expect(isLang(l)).toBe(true);
    for (const junk of ["", "de", "IT", "en-GB", null, undefined]) {
      expect(isLang(junk)).toBe(false);
    }
  });

  it("covers exactly the languages the dictionary ships", () => {
    expect([...LANGS].sort()).toEqual(Object.keys(dict).sort());
  });
});

describe("resolveLang", () => {
  it("lets a shared link carry its language, and remembers it", () => {
    expect(resolveLang("sv", null)).toEqual({ lang: "sv", persist: true });
  });

  it("prefers the link over a preference saved on an earlier visit", () => {
    // The point of the feature: sending ?lang=en to someone who once browsed
    // in Italian must open English, not their stale choice.
    expect(resolveLang("en", "it")).toEqual({ lang: "en", persist: true });
  });

  it("falls back to the saved choice when the link says nothing", () => {
    expect(resolveLang(null, "en")).toEqual({ lang: "en", persist: false });
  });

  it("ignores a junk or unsupported ?lang= and keeps the saved choice", () => {
    expect(resolveLang("de", "sv")).toEqual({ lang: "sv", persist: false });
    expect(resolveLang("", "sv")).toEqual({ lang: "sv", persist: false });
  });

  it("returns nothing when there is no signal, so SSR Italian stands", () => {
    expect(resolveLang(null, null)).toBeNull();
    expect(resolveLang("fr", "klingon")).toBeNull();
  });

  it("treats an explicit ?lang=it as a real choice worth persisting", () => {
    expect(resolveLang("it", "sv")).toEqual({ lang: "it", persist: true });
  });
});
