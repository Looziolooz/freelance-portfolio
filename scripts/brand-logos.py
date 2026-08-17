"""Render every brand kit's mark to a transparent PNG.

Why this exists
---------------
The logos only ever existed as live CSS inside the brand manual. That is fine
for the page and useless for everything else: you cannot drop a CSS rule into
Canva's Smartmockups, into a printer's artwork slot, or into the "logo files"
the manual's delivery page promises the client (SVG, PDF, PNG, EPS). This makes
the PNG half real.

Transparency without a transparent screenshot
--------------------------------------------
The browse daemon cannot omit the page background, so each mark is rendered
twice, once over white and once over black, and the alpha is recovered from the
difference:

    alpha  = 1 - (white - black)          per channel, then the max
    colour = black / alpha

That is exact, including the antialiased edges of the type, which a chroma key
would chew up.

Usage
    python scripts/brand-logos.py            # every brand
    python scripts/brand-logos.py aliva      # just one
"""

import io
import json
import os
import re
import subprocess
import sys
import tempfile
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KITS = os.path.join(ROOT, "src", "lib", "brand-kits.ts")
OUT = os.path.join(ROOT, "public", "brand-logos")
BROWSE = os.path.expanduser("~/.claude/skills/gstack/browse/dist/browse")

# The site's own faces, so `var(--font-*)` stacks resolve the way they do on the
# page rather than falling back to Times.
FONT_LINKS = """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=JetBrains+Mono:wght@400;700&family=Oswald:wght@500;600;700&family=Archivo+Black&family=Playfair+Display:wght@500;600;700&family=Marcellus&family=Libre+Baskerville:wght@400;700&family=Lora:wght@500;600&family=Cinzel:wght@500;600&family=Roboto+Slab:wght@500;700&family=Jost:wght@500;600&family=Montserrat:wght@600;700&display=block" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=block" rel="stylesheet">
"""

# The kits name real desktop faces (Haettenschweiler, Plantin, Didot, Copperplate).
# A headless Chromium has almost none of them, and a logo file exported in the
# WRONG typeface is worse than no file at all — so each stack gets a web face
# chosen to match its weight and skeleton. The stack itself is left untouched;
# this only decides what the render falls back TO.
FALLBACK = [
    ("Haettenschweiler", "Oswald"), ("Arial Narrow", "Oswald"), ("Impact", "Oswald"),
    ("Arial Black", "Archivo Black"), ("Helvetica Neue", "Archivo Black"),
    ("Didot", "Playfair Display"), ("Bodoni MT", "Playfair Display"),
    ("Baskerville Old Face", "Libre Baskerville"), ("Baskerville", "Libre Baskerville"),
    ("Plantin MT Pro", "Lora"), ("Iowan Old Style", "Lora"),
    ("Copperplate", "Cinzel"), ("Big Caslon", "Cinzel"),
    ("Rockwell", "Roboto Slab"), ("Bookman Old Style", "Roboto Slab"),
    ("Futura", "Jost"), ("Gill Sans", "Jost"), ("Century Gothic", "Jost"),
    ("Avenir Next", "Montserrat"), ("Avenir", "Montserrat"),
    ("Optima", "Montserrat"), ("Hoefler Text", "Lora"),
    ("Palatino Linotype", "Lora"), ("Book Antiqua", "Lora"),
    ("Marcellus", "Marcellus"),
]


def with_fallback(stack: str) -> str:
    """Prepend the matching web face, and single-quote the family names.

    The stack goes into a style="..." attribute, so a double quote inside it
    closes the attribute early and the whole declaration is dropped — which is
    exactly what happened on the first run: every wordmark rendered in Times
    because no font-family ever applied. CSS accepts single quotes.
    """
    for desktop, web in FALLBACK:
        if desktop.lower() in stack.lower():
            stack = "'%s', %s" % (web, stack)
            break
    return stack.replace('"', "'")


def read_kits():
    src = io.open(KITS, encoding="utf-8").read()
    kits = []
    for m in re.finditer(r'\n  "?([a-z0-9-]+)"?: \{\n(.*?)\n  \},\n', src, re.S):
        slug, body = m.group(1), m.group(2)

        def s(field):
            mm = re.search(r'\n    %s: "([^"]*)"' % field, body)
            return mm.group(1) if mm else ""

        display = re.search(r"\n    display: (.+),", body)
        kits.append({
            "slug": slug,
            "name": s("name"),
            "monogram": s("monogram"),
            "tracking": s("tracking"),
            "paper": s("paper"),
            "ink": s("ink"),
            "primary": s("primary"),
            "display": with_fallback((display.group(1).strip() if display else '"Georgia", serif').strip("'")),
        })
    return kits


def page(kits, ground):
    """One row per brand: the wordmark, then the monogram in a filled disc."""
    cells = []
    for k in kits:
        cells.append(f"""
<div class="row">
  <div class="cell" id="word-{k['slug']}">
    <span style="font-family:{k['display']};letter-spacing:{k['tracking']};color:{k['ink']}">{k['name']}</span>
  </div>
  <div class="cell" id="mark-{k['slug']}">
    <span class="disc" style="background:{k['primary']};font-family:{k['display']}">{k['monogram']}</span>
  </div>
</div>""")
    return f"""<!doctype html><meta charset="utf-8">{FONT_LINKS}
<style>
  html,body {{ margin:0; background:{ground}; }}
  .row {{ display:flex; gap:40px; padding:30px 40px; align-items:center; }}
  .cell {{ display:inline-flex; align-items:center; justify-content:center; padding:18px 24px; }}
  .cell span {{ font-size:120px; font-weight:600; line-height:1.1; white-space:nowrap; }}
  .disc {{ width:200px; height:200px; border-radius:50%; display:grid; place-items:center;
           font-size:96px; color:#fff; }}
</style>
{''.join(cells)}
"""


def shoot(html, out_dir, ids):
    """Render the page and screenshot each element by id."""
    tmp = os.path.join(tempfile.gettempdir(), "brand-logos.html")
    io.open(tmp, "w", encoding="utf-8").write(html)
    subprocess.run([BROWSE, "goto", "file:///" + tmp.replace("\\", "/")],
                   capture_output=True, text=True)
    # Wait for the webfonts, not for a guess: a screenshot taken before they
    # land bakes the fallback into the file.
    for _ in range(20):
        r = subprocess.run([BROWSE, "js", "document.fonts.status"], capture_output=True, text=True)
        if "loaded" in (r.stdout or ""):
            break
        time.sleep(0.5)
    time.sleep(1.5)
    for el in ids:
        subprocess.run([BROWSE, "screenshot", "--selector", "#" + el,
                        os.path.join(out_dir, el + ".png")],
                       capture_output=True, text=True)


def unmatte(white_path, black_path, out_path):
    """Recover colour + alpha from the two renders."""
    from PIL import Image
    w = Image.open(white_path).convert("RGB")
    b = Image.open(black_path).convert("RGB")
    if w.size != b.size:
        b = b.resize(w.size)
    wp, bp = w.load(), b.load()
    out = Image.new("RGBA", w.size)
    op = out.load()
    for y in range(w.size[1]):
        for x in range(w.size[0]):
            wr, wg, wb = wp[x, y]
            br, bg, bb = bp[x, y]
            # alpha per channel: 1 - (white - black); take the strongest signal
            a = max(0, min(255, 255 - max(wr - br, wg - bg, wb - bb)))
            if a == 0:
                op[x, y] = (0, 0, 0, 0)
            else:
                f = 255.0 / a
                op[x, y] = (min(255, int(br * f)), min(255, int(bg * f)), min(255, int(bb * f)), a)
    out.save(out_path)


def main():
    wanted = set(sys.argv[1:])
    kits = [k for k in read_kits() if not wanted or k["slug"] in wanted]
    if not kits:
        sys.exit("no kits matched")

    ids = []
    for k in kits:
        ids += ["word-" + k["slug"], "mark-" + k["slug"]]

    tmpdir = tempfile.mkdtemp(prefix="logos-")
    white_dir = os.path.join(tmpdir, "white")
    black_dir = os.path.join(tmpdir, "black")
    os.makedirs(white_dir); os.makedirs(black_dir)

    shoot(page(kits, "#ffffff"), white_dir, ids)
    shoot(page(kits, "#000000"), black_dir, ids)

    made = 0
    for k in kits:
        d = os.path.join(OUT, k["slug"])
        os.makedirs(d, exist_ok=True)
        for kind, el in (("wordmark", "word-" + k["slug"]), ("mark", "mark-" + k["slug"])):
            wp = os.path.join(white_dir, el + ".png")
            bp = os.path.join(black_dir, el + ".png")
            if os.path.exists(wp) and os.path.exists(bp):
                unmatte(wp, bp, os.path.join(d, kind + ".png"))
                made += 1
    print(json.dumps({"brands": len(kits), "files": made, "out": OUT}))


if __name__ == "__main__":
    main()
