import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { merchPhotos, merchPick, merchSpread, merchSrc } from "../brand-merch";
import { BRAND_KITS } from "../brand-kits";

// `brand-merch.ts` is generated from the filesystem by `scripts/merch-manifest.py`,
// so it goes stale the moment a photograph is moved — which happens often here,
// because photographs get pulled for a misspelled wordmark, a wrong palette or a
// Gemini watermark long after they were first sliced. A stale entry is a 404 in
// a document a client is being asked to approve, so it is worth a test.

const ROOT = join(__dirname, "..", "..", "..");
const MERCH_DIR = join(ROOT, "public", "brand-merch");

const brandFolders = readdirSync(MERCH_DIR).filter((d) =>
  statSync(join(MERCH_DIR, d)).isDirectory(),
);

describe("brand merch manifest", () => {
  it("names only files that exist", () => {
    const missing: string[] = [];
    for (const slug of brandFolders) {
      for (const photo of merchPhotos(slug)) {
        const path = join(ROOT, "public", "brand-merch", slug, `${photo.i}.jpg`);
        if (!existsSync(path)) missing.push(`${slug}/${photo.i}.jpg`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("lists every photo on disk", () => {
    const unlisted: string[] = [];
    for (const slug of brandFolders) {
      const listed = new Set(merchPhotos(slug).map((p) => p.i));
      const onDisk = readdirSync(join(MERCH_DIR, slug))
        .filter((f) => f.endsWith(".jpg"))
        .map((f) => f.replace(/\.jpg$/, ""));
      for (const item of onDisk) if (!listed.has(item)) unlisted.push(`${slug}/${item}`);
    }
    expect(unlisted).toEqual([]);
  });

  it("never lists a quarantined photo", () => {
    // These folders hold work that was judged and pulled: a misspelled or broken
    // wordmark, the wrong palette, a Gemini watermark, or a second shot of an
    // object already in the set. Shipping one of them is the failure this whole
    // review process exists to prevent.
    const held: string[] = [];
    for (const slug of brandFolders) {
      for (const quarantine of ["_rejected", "_rejected-text", "_offpalette", "_watermark", "_duplicate"]) {
        const dir = join(MERCH_DIR, slug, quarantine);
        if (!existsSync(dir)) continue;
        const listed = new Set(merchPhotos(slug).map((p) => p.i));
        for (const f of readdirSync(dir).filter((x) => x.endsWith(".jpg"))) {
          const item = f.replace(/\.jpg$/, "");
          // A name can legitimately exist in both places (`tag.jpg` kept for one
          // brand, quarantined for another), so only flag it when the live file
          // is genuinely gone.
          if (listed.has(item) && !existsSync(join(MERCH_DIR, slug, f))) {
            held.push(`${slug}/${quarantine}/${f}`);
          }
        }
      }
    }
    expect(held).toEqual([]);
  });

  it("only holds photos for a brand that has a kit", () => {
    // The folders are named by hand while slicing, and two were named after the
    // brand rather than the project (`lievita` for `pizzeria-restaurant`,
    // `solari` for `fotografo`). The manual looks photos up by project slug, so
    // those five and six photographs were on disk and invisible.
    const orphans = brandFolders.filter(
      (slug) => merchPhotos(slug).length > 0 && !(slug in BRAND_KITS),
    );
    expect(orphans).toEqual([]);
  });

  it("serves a path under the brand's own folder", () => {
    const [photo] = merchPhotos("nordbageriet");
    expect(merchSrc("nordbageriet", photo)).toBe(`/brand-merch/nordbageriet/${photo.i}.jpg`);
  });

  it("spreads without repeating, and asks for more than it has safely", () => {
    const all = merchPhotos("nordbageriet");
    const three = merchSpread("nordbageriet", 3);
    expect(three).toHaveLength(3);
    expect(new Set(three.map((p) => p.i)).size).toBe(3);

    const tooMany = merchSpread("nordbageriet", all.length + 5);
    expect(tooMany).toHaveLength(all.length);
    expect(new Set(tooMany.map((p) => p.i)).size).toBe(all.length);

    expect(merchSpread("a-brand-with-no-photos", 3)).toEqual([]);
  });

  it("picks by object name, in the order asked", () => {
    // The board labels its tiles by category, so a positional pick put a beanie
    // under "stationery".
    expect(merchPick("nordbageriet", ["letterhead"])?.i).toBe("letterhead");
    expect(merchPick("nordbageriet", ["nothing-like-this", "letterhead"])?.i).toBe("letterhead");
    expect(merchPick("nordbageriet", ["nothing-like-this"])).toBeNull();
    expect(merchPick("a-brand-with-no-photos", ["letterhead"])).toBeNull();
  });
});
