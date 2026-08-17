"""Shave the contact sheet's own furniture off the edges of a sliced merch photo.

Several generated sheets separate their tiles with a thin rule in the brand's
accent colour. The slicer cuts between tiles, not through them, so that rule
survives as a hard vertical or horizontal bar down one side of the finished
photograph — visible as a gold line beside the Prana blocks and bottle, and it
reads as a rendering fault rather than as part of the shot.

A stripe is a line that is FLAT along its own length and DIFFERENT from the
picture a little further in. Both tests matter: flat alone would eat the plain
background half these photos are shot against, and different alone would eat the
edge of any object that reaches the frame.

Only edges are considered, and only the outer 9%, so nothing can be trimmed out
of the middle of a photograph.

Usage
    python scripts/merch-trim.py            # every brand, in place
    python scripts/merch-trim.py --dry-run  # report only
    python scripts/merch-trim.py yoga aliva # named brands
"""

import io
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "brand-merch")

# A stripe is uniform along itself...
FLAT = 14.0
# ...and this far from the picture 6px inside it.
DIFFERENT = 34.0
# Never look further in than this share of the dimension.
MARGIN = 0.09
PROBE = 6


def _scan(lines):
    """How many leading lines of `lines` are sheet furniture."""
    limit = max(1, int(len(lines) * MARGIN))
    cut = 0
    for i in range(limit):
        line = lines[i]
        if line.reshape(-1, 3).std(axis=0).mean() > FLAT:
            break
        inner = lines[min(i + PROBE, len(lines) - 1)]
        if np.abs(line.mean(axis=0) - inner.mean(axis=0)).mean() < DIFFERENT:
            break
        cut = i + 1
    return cut


def trim_box(im):
    a = np.asarray(im.convert("RGB")).astype(float)
    top = _scan(a)
    bottom = _scan(a[::-1])
    left = _scan(a.transpose(1, 0, 2))
    right = _scan(a.transpose(1, 0, 2)[::-1])
    return left, top, a.shape[1] - right, a.shape[0] - bottom


def main():
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry = "--dry-run" in sys.argv
    wanted = set(args)

    trimmed = checked = 0
    for slug in sorted(os.listdir(SRC)):
        folder = os.path.join(SRC, slug)
        if not os.path.isdir(folder) or (wanted and slug not in wanted):
            continue
        for f in sorted(x for x in os.listdir(folder) if x.endswith(".jpg")):
            path = os.path.join(folder, f)
            im = Image.open(path)
            checked += 1
            box = trim_box(im)
            if box == (0, 0, im.width, im.height):
                continue
            trimmed += 1
            print("  %-22s %-16s %dx%d -> %dx%d"
                  % (slug, f, im.width, im.height, box[2] - box[0], box[3] - box[1]))
            if not dry:
                im.convert("RGB").crop(box).save(path, "JPEG", quality=90, optimize=True)

    print("%d checked, %d trimmed%s" % (checked, trimmed, " (dry run)" if dry else ""))


if __name__ == "__main__":
    main()
