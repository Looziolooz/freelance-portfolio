import { describe, it, expect } from "vitest";
import {
  BRAND_KITS,
  contrastRatio,
  documentGround,
  getBrandKit,
  hexToHsl,
  hexToRgb,
  onColor,
} from "@/lib/brand-kits";
import { PROJECTS } from "@/lib/projects";

const LANGS = ["it", "en", "sv"] as const;

// The six automation demos sell a workflow, not a client brand: there is no
// identity to write guidelines for, so they deliberately have no kit and their
// project page renders no brand manual.
const NO_BRAND = new Set([
  "mappa-mercato",
  "audit-visibilita",
  "assistente-whatsapp",
  "contenuti-social",
  "risposte-email",
  "solleciti-pagamento",
  // Concept landing demos that cite a real third-party brand: shown as
  // portfolio pieces with a disclaimer, not client work with a brand manual.
  "ferrari-f8-tributo",
  "mirzz",
]);

describe("fotografo brand kit", () => {
  it("contains a multilingual brand foundation for all site languages", () => {
    const kit = getBrandKit("fotografo");

    expect(kit).toBeTruthy();
    expect(kit?.story?.it).toMatch(/luce|tempo|matrimonio/i);
    expect(kit?.story?.en).toMatch(/light|time|wedding/i);
    expect(kit?.story?.sv).toMatch(/ljus|tid|bröllop/i);
    expect(kit?.voice?.it).toMatch(/elegante|intima|cinematica|squisita/i);
    expect(kit?.voice?.en).toMatch(/elegant|intimate|cinematic|refined/i);
    expect(kit?.voice?.sv).toMatch(/elegant|intim|cinematisk|raffinerad/i);
    // Re-pointed when the kit was re-sampled from the live build: the site is an
    // ivory page that is almost entirely photography, so the attributes are
    // about the photography carrying the page, not about light and time.
    expect(kit?.principles?.it).toEqual(expect.arrayContaining([expect.stringMatching(/fotografia|marchio/i)]));
    expect(kit?.principles?.en).toEqual(expect.arrayContaining([expect.stringMatching(/photograph|mark/i)]));
    expect(kit?.principles?.sv).toEqual(expect.arrayContaining([expect.stringMatching(/fotografi|märket/i)]));
    expect(kit?.usage?.it).toEqual(expect.arrayContaining([expect.stringMatching(/matrimonio|eventi/i)]));
    expect(kit?.usage?.en).toEqual(expect.arrayContaining([expect.stringMatching(/wedding|events/i)]));
    expect(kit?.usage?.sv).toEqual(expect.arrayContaining([expect.stringMatching(/bröllop|evenemang/i)]));
  });
});

describe("brand manual coverage", () => {
  it("gives every client project a kit", () => {
    const missing = PROJECTS.filter((p) => !p.hidden && !NO_BRAND.has(p.slug) && !getBrandKit(p.slug)).map(
      (p) => p.slug,
    );
    expect(missing, `projects with no brand kit: ${missing.join(", ")}`).toEqual([]);
  });

  it("keys every kit by its own slug", () => {
    for (const [key, kit] of Object.entries(BRAND_KITS)) expect(kit.slug).toBe(key);
  });
});

// Page 03 of the manual is the positioning page. A kit missing one of these
// four fields renders a client-facing document with a blank spread on it, which
// no type checker catches because they are optional on the type.
describe.each(Object.keys(BRAND_KITS))("%s brand kit", (slug) => {
  const kit = BRAND_KITS[slug];

  it.each(LANGS)("has the written foundation in %s", (lang) => {
    expect(kit.story?.[lang]?.length ?? 0).toBeGreaterThan(40);
    expect(kit.voice?.[lang]?.length ?? 0).toBeGreaterThan(20);
    expect(kit.principles?.[lang]).toHaveLength(4);
    expect(kit.usage?.[lang]).toHaveLength(3);
  });

  it("carries all five palette roles", () => {
    expect([...new Set(kit.palette.map((c) => c.role))].sort()).toEqual([
      "accent",
      "ink",
      "paper",
      "primary",
      "secondary",
    ]);
  });

  // Every page of the manual is set in the kit's own ink on its own paper. A
  // pairing below 4.5:1 makes the whole document unreadable, not one label.
  it("reads: ink on paper clears 4.5:1", () => {
    expect(contrastRatio(kit.ink, kit.paper)).toBeGreaterThanOrEqual(4.5);
  });

  // The cover and the sign-off are painted surfaces carrying small print (the
  // version line, the domain), so the ground has to clear 4.5:1, not the 3:1
  // large-text bar the headline alone would need.
  it("reads: the cover small print survives on its ground", () => {
    const ground = documentGround(kit);
    expect(contrastRatio(onColor(kit, ground), ground)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("colour notation", () => {
  it("converts hex to the notations printed on the colour page", () => {
    expect(hexToRgb("#5D6C45")).toEqual([93, 108, 69]);
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
    expect(hexToHsl("#000000")).toEqual([0, 0, 0]);
    expect(hexToHsl("#FF0000")).toEqual([0, 100, 50]);
  });

  it("measures contrast against the WCAG anchors", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
  });
});
