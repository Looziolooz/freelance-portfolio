"""Cut a generated contact sheet of merch mockups into separate files.

Image models are happy to return a dozen mockups as one grid. The brand manual
wants one file per object, so this finds the grid instead of being told it: the
gutters between tiles are the columns and rows with the lowest pixel variance,
because a gutter is flat background while a tile always holds an object.

It also reports the average colour of each tile against the kit's palette, which
is how the Aliva sheet was caught coming back navy-and-gold instead of
olive-and-ivory — a mistake that is obvious in a contact sheet and invisible once
the tiles are separate files.

Usage
    python scripts/merch-slice.py <sheet.png> <slug> [name1 name2 ...]
    python scripts/merch-slice.py <sheet.png> <slug> --probe     # grid only, write nothing

Names are applied in reading order. Missing names fall back to `tile-NN`.
Nothing is deleted; the sheet stays until you remove it.
"""

import io
import os
import re
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KITS = os.path.join(ROOT, "src", "lib", "brand-kits.ts")


def kit_palette(slug):
    """The kit's four key colours, for the drift check."""
    src = io.open(KITS, encoding="utf-8").read()
    m = re.search(r'\n  "?' + re.escape(slug) + r'"?: \{\n(.*?)\n  \},\n', src, re.S)
    if not m:
        return {}
    body = m.group(1)
    out = {}
    for field in ("paper", "ink", "primary", "accent"):
        mm = re.search(r'\n    %s: "(#[0-9A-Fa-f]{6})"' % field, body)
        if mm:
            h = mm.group(1).lstrip("#")
            out[field] = tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    return out


def runs_below(values, threshold, min_len):
    idx = np.where(values < threshold)[0]
    out, start, prev = [], None, None
    for i in idx:
        if start is None:
            start = prev = i
            continue
        if i - prev > 1:
            if prev - start + 1 >= min_len:
                out.append((int(start), int(prev)))
            start = i
        prev = i
    if start is not None and prev - start + 1 >= min_len:
        out.append((int(start), int(prev)))
    return out


def bands(gutters, extent, min_size):
    """Turn gutter runs into the spans between them."""
    edges = [0] + [ (s + e) // 2 for s, e in gutters ] + [extent]
    out = []
    for a, b in zip(edges, edges[1:]):
        if b - a >= min_size:
            out.append((a, b))
    return out


def detect_cards(img, min_frac=0.01):
    """Find bright tiles on a dark ground as connected components.

    The variance projection assumes a regular grid of rows and columns. Sheets
    that lay white cards on black break both assumptions at once: the gutters and
    the card interiors are equally flat, and a card may span two rows. Labelling
    the bright regions makes no assumption about the arrangement at all.
    """
    from scipy import ndimage

    a = np.asarray(img.convert("L")).astype(float)
    mask = a > (a.max() * 0.72)
    mask = ndimage.binary_closing(mask, np.ones((9, 9)))
    lab, n = ndimage.label(mask)
    boxes = []
    area_min = a.size * min_frac
    for sl in ndimage.find_objects(lab):
        h = sl[0].stop - sl[0].start
        w = sl[1].stop - sl[1].start
        if h * w < area_min:
            continue
        # A sheet whose tiles carry light frames can bridge into one blob that
        # swallows the page; that is not a tile, it is a failed detection.
        if h * w > a.size * 0.6:
            continue
        boxes.append((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop))
    # reading order: top-to-bottom in bands, then left-to-right
    boxes.sort(key=lambda b: (round(b[1] / max(1, img.height) * 6), b[0]))
    return boxes


def detect(img, pct=13):
    a = np.asarray(img.convert("RGB")).astype(float)
    h, w = a.shape[:2]
    colv, rowv = a.var(axis=(0, 2)), a.var(axis=(1, 2))
    cg = runs_below(colv, np.percentile(colv, pct), 3)
    rg = runs_below(rowv, np.percentile(rowv, pct), 3)
    return bands(cg, w, w // 20), bands(rg, h, h // 20)


def drift(tile, palette):
    """How far the tile's dominant colours sit from the kit — a rough alarm."""
    if not palette:
        return ""
    small = tile.convert("RGB").resize((60, 60))
    px = np.asarray(small).reshape(-1, 3).astype(float)
    near = 0
    for p in px:
        if min(np.linalg.norm(p - np.array(c)) for c in palette.values()) < 70:
            near += 1
        continue
    share = near / len(px)
    return "OFF-PALETTE" if share < 0.45 else ("check" if share < 0.7 else "ok")


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    sheet_path, slug = sys.argv[1], sys.argv[2]
    rest = sys.argv[3:]
    probe = "--probe" in rest
    names = [r for r in rest if r != "--probe"]

    img = Image.open(sheet_path)

    # Two layouts turn up. A regular grid yields to the variance projection; a
    # sheet of bright cards on a dark ground does not, because there the gutters
    # and the card interiors are equally flat and a card may span two rows. Try
    # the card labeller first and keep it when it finds a sensible set.
    boxes = detect_cards(img)
    if len(boxes) >= 4:
        print("sheet %dx%d -> %d cards (component labelling)"
              % (img.width, img.height, len(boxes)))
    else:
        cols, rows = detect(img)
        boxes = [(x0, y0, x1, y1) for y0, y1 in rows for x0, x1 in cols]
        print("sheet %dx%d -> %d cols x %d rows = %d tiles (grid)"
              % (img.width, img.height, len(cols), len(rows), len(boxes)))

    palette = kit_palette(slug)
    out_dir = os.path.join(ROOT, "public", "brand-merch", slug)
    if not probe:
        os.makedirs(out_dir, exist_ok=True)

    for i, (x0, y0, x1, y1) in enumerate(boxes):
        pad = 6
        tile = img.crop((x0 + pad, y0 + pad, x1 - pad, y1 - pad)).convert("RGB")
        name = names[i] if i < len(names) else "tile-%02d" % i
        print("  %-16s %4dx%-4d  %s" % (name, tile.width, tile.height, drift(tile, palette)))
        if not probe:
            tile.save(os.path.join(out_dir, name + ".jpg"), "JPEG",
                      quality=90, optimize=True)

    if not probe:
        print("written to public/brand-merch/%s/" % slug)


if __name__ == "__main__":
    main()
