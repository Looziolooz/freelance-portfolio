"""Build the image-generation brief for the brand merch mockups.

Why this exists
---------------
The merch page draws its objects as vectors, which reads as clip-art. Real
photographs fix that, but every automated route costs money or watermarks the
output (see DESIGN.md). An open text-to-image model that the user runs
themselves — Qwen-Image, HunyuanImage, or anything comparable — is the free
route, and what it needs is a precise brief per brand and per object.

This generates that brief from `brand-kits.ts`, so it can never drift from the
kits, never invents a colour, and never asks for an object the brand does not
carry (a coach operator has no apron — the `merch` field decides).

The prompt shape follows what worked: subject and framing, the object and how
the mark is applied to it, the setting, the light, the lens, the exact hex
values, then a fidelity directive and a negative list. Models that render text
well still need to be told the wordmark is TEXT and must be spelled correctly.

Usage
    python scripts/merch-prompts.py            > docs/merch-prompts.md
    python scripts/merch-prompts.py aliva      # one brand
"""

import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KITS = os.path.join(ROOT, "src", "lib", "brand-kits.ts")

# Where each brand's photograph happens. Generated prompts are only as good as
# their setting; "on a white background" is what makes stock look like stock.
SETTING = {
    "aliva": "a stone olive mill in Calabria, crates of just-picked olives, low afternoon light",
    "yoga": "a small evening yoga studio, low warm light, bare wood floor, one lit candle out of focus",
    "sushi": "a lit open grill counter in a Milan dining room, pale parchment walls, dark plates",
    "brado": "a butcher's counter with a live grill behind, butcher paper, hanging steel hooks",
    "fotografo": "a sunlit ivory studio on the Amalfi coast, lemon tree and linen in soft focus",
    "aurelia": "a dark specialty coffee bar, one copper-lit espresso machine behind, near-black surfaces",
    "vespa-heritage": "a grey concrete workshop, a 1968 ochre scooter out of focus behind",
    "bella-calabria": "a dark stone terrace above the Tyrrhenian sea at dusk, warm lamp light",
    "barberia": "a dark barbershop with brass fittings and mirrors, low-key light, a cream tiled wall",
    "gelateria": "an artisan gelato counter, tubs of gelato in soft focus, warm amber lighting",
    "ai-visibility": "a dark studio desk at night, indigo screen glow, matte black surfaces",
    "pizzeria-restaurant": "a pizzeria in Tropea with a wood-fired oven lit behind, flour-dusted counter",
    "brasilena": "a bright Calabrian bar counter in summer, saturated yellow wall, hard sunlight",
    "nordbageriet": "a Nordic bakery before opening, dark green-black walls, bread cooling on racks",
    "buss-travel": "a European coach station at dawn, a coach out of focus behind, deep teal shadows",
    "pizzeria-lorenzo": "a small takeaway pizzeria counter, warm light, pizza boxes stacked behind",
    "weather-se": "a bright Stockholm apartment window in the morning, peach sky outside",
    "couffer": "a calm modern hair salon, plum and blush tones, soft daylight from a large window",
    "ferrari-f8-tributo": "a dark private garage, an out-of-focus red sports car behind, polished concrete",
    "mirzz": "a black studio backdrop with one saturated colour gel, crushed ice, condensation",
}

# What each object is, how the mark goes on it, and how it is framed.
# `person` items are shot waist-up with a real person, which is the whole point.
ITEM = {
    "tee":       ("a staff t-shirt in the brand's main colour", "a SMALL mark high on the left chest, roughly 7 cm wide", True),
    "teeDark":   ("a staff t-shirt in the brand's darkest colour", "the wordmark across the chest, roughly 18 cm wide", True),
    "polo":      ("a staff polo shirt in the brand's main colour, three-button placket", "a small embroidered mark on the left chest", True),
    "hoodie":    ("a heavyweight hoodie in the brand's darkest colour", "a small mark on the left chest, nothing on the back", True),
    "apron":     ("a cotton bib apron in the brand's accent colour, waist ties", "the wordmark embroidered on the chest panel", True),
    "cape":      ("a salon cutting cape in the brand's darkest colour", "a small mark at the collar", True),
    "cap":       ("a six-panel cap, crown in the brand's darkest colour, brim in the main colour", "the monogram embroidered on the front panel", False),
    "tote":      ("a natural cotton tote bag with two handles", "the wordmark printed large and centred", False),
    "paperBag":  ("a kraft paper takeaway bag with rope handles", "the wordmark printed on the front", False),
    "box":       ("a rigid printed cardboard box in the brand's main colour", "the wordmark on the lid", False),
    "cup":       ("a white paper takeaway cup with a printed sleeve in the brand's main colour", "the wordmark on the sleeve", False),
    "mug":       ("a matte ceramic mug in the brand's main colour", "the monogram on the side", False),
    "bottle":    ("a glass bottle with a printed paper label", "the wordmark on the label", False),
    "sticker":   ("a set of two die-cut vinyl stickers on a white backing sheet", "the monogram on one, the wordmark on the other", False),
    "badge":     ("a printed name badge on a woven lanyard", "the wordmark at the top of the card", False),
    "lanyard":   ("a woven lanyard with a clear card holder", "the wordmark repeated along the strap", False),
    "notebook":  ("a hardcover A5 notebook in the brand's main colour, elastic closure", "the monogram blind-debossed on the cover", False),
    "towel":     ("a folded cotton towel in the brand's accent colour", "the wordmark woven into the border", False),
    "mat":       ("a rolled yoga mat in the brand's accent colour", "the monogram at one end", False),
    # The three printed pieces. Every brand gets these, whatever it sells: they
    # are what a client actually takes to a printer, and the manual's print page
    # has a slot for each.
    "businesscard": ("a stack of business cards on a surface, top card face up, edges visible", "the mark and the name on the front, nothing else", False),
    "letterhead":   ("a single sheet of A4 letterhead lying flat, seen from above", "the mark at the head and the domain at the foot, with the body left as PLAIN UNREADABLE TEXTURE and no attempt at words", False),
    "envelope":     ("a closed C5 envelope lying flat, flap towards the camera", "the mark small on the flap or the top left corner", False),
}

# Handed out to every brand, in this order, after its own objects.
PRINTED = ["businesscard", "letterhead", "envelope"]

# Brands whose sheets have come back in the wrong colours more than once. The
# prohibition goes FIRST in the prompt, because a colour instruction buried under
# four lines of staging has already been ignored on every one of these.
DRIFTED = {
    "aliva": "olive green and ivory. There is NO NAVY BLUE and NO GOLD in this brand.",
    "gelateria": "terracotta and brick red. There is NO GREEN and NO OLIVE in this brand.",
    "ai-visibility": "near-black indigo and violet. There is NO CREAM PAPER and NO OAK WOOD in this brand.",
    "vespa-heritage": "ochre and warm gold. There is NO GREY, NO STEEL and NO BLACK-AND-WHITE in this brand.",
    "brasilena": "saturated yellow and red. There is NO CREAM and NO BROWN in this brand.",
}

NEGATIVE = (
    "no warped or garbled text, no misspelled words, no invented brand names, no doubled logos, "
    "no watermarks, no extra fingers, no extra limbs, no plastic skin, no waxy AI sheen, "
    "no oversaturated HDR, no flat stock-photo staging, no white cyclorama background, "
    "no other brands visible, no clipart, no illustration"
)


def read_kits():
    src = io.open(KITS, encoding="utf-8").read()
    out = []
    for m in re.finditer(r'\n  "?([a-z0-9-]+)"?: \{\n(.*?)\n  \},\n', src, re.S):
        slug, body = m.group(1), m.group(2)

        def f(name):
            mm = re.search(r'\n    %s: "([^"]*)"' % name, body)
            return mm.group(1) if mm else ""

        merch = re.search(r"\n    merch: \[([^\]]*)\]", body)
        pal = dict(re.findall(r'\{ name: "([^"]+)", hex: "(#[0-9A-Fa-f]{6})"', body))
        out.append({
            "slug": slug, "name": f("name"), "monogram": f("monogram"),
            "tagline": f("tagline"), "paper": f("paper"), "ink": f("ink"),
            "primary": f("primary"), "accent": f("accent"),
            "palette": pal,
            "merch": re.findall(r'"([a-zA-Z]+)"', merch.group(1)) if merch else [],
        })
    return out


def prompt_for(kit, item):
    what, mark, with_person = ITEM[item]
    setting = SETTING.get(kit["slug"], "a plain, warmly lit interior")
    drift = DRIFTED.get(kit["slug"])
    lead = ("COLOUR IS THE FIRST REQUIREMENT. This brand is %s Any image in other "
            "colours is a failed image, whatever else is right about it.\n" % drift) if drift else ""
    who = ("Waist-up photograph of a person wearing " if with_person
           else "Product photograph of ")
    frame = ("Crop from mid-chest to just above the brow — the object carries the frame, not the face."
             if with_person else
             "The object fills two thirds of the frame, held in a hand or resting on a surface.")
    return (
        f"{lead}"
        f"{who}{what}, in {setting}. {frame}\n"
        f"Branding: {mark}. The mark reads exactly \"{kit['name']}\" "
        f"(monogram \"{kit['monogram']}\") — it is real TEXT and must be spelled correctly and stay legible.\n"
        f"Colours, exact: main {kit['primary']}, accent {kit['accent']}, "
        f"ground {kit['paper']}, ink {kit['ink']}. No colour drift.\n"
        f"85mm lens, f/2.8, one large soft key at 45 degrees plus a practical light in shot, "
        f"shallow depth of field, real fabric and paper texture, editorial brand photography.\n"
        f"Avoid: {NEGATIVE}."
    )


def main():
    # Windows defaults stdout to cp1252, which cannot encode the arrows and
    # accents in this brief; redirecting to a file then dies mid-write.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    wanted = set(sys.argv[1:])
    kits = [k for k in read_kits() if not wanted or k["slug"] in wanted]

    total = sum(len(k["merch"]) + len(PRINTED) for k in kits)
    print("# Merch mockups — generation brief\n")
    print("Generated by `scripts/merch-prompts.py` from `src/lib/brand-kits.ts`. Do not edit by hand:")
    print("re-run the script after changing a kit.\n")
    print(f"**{len(kits)} brands, {total} images.** One prompt per object. Aspect **3:4 portrait**, "
          "at least 1400px on the long edge.\n")
    print("Save each result as `public/brand-merch/<slug>/<item>.jpg` using the filename given under "
          "each prompt — that is the path the brand manual looks for. Anything missing falls back to "
          "the drawn object, so a partial run is fine.\n")
    print("These models render text well but not perfectly: **check the spelling of the wordmark in "
          "every image before keeping it.** A misspelled logo in a brand manual is worse than no photo.\n")
    print("---\n")

    for k in kits:
        print(f"## {k['name']}  ·  `{k['slug']}`\n")
        print(f"*{k['tagline']}*  \n"
              f"Main `{k['primary']}` · accent `{k['accent']}` · ground `{k['paper']}` · ink `{k['ink']}`\n")
        for item in list(k["merch"]) + PRINTED:
            if item not in ITEM:
                continue
            print(f"### {item} → `public/brand-merch/{k['slug']}/{item}.jpg`\n")
            print("```")
            print(prompt_for(k, item))
            print("```\n")
        print("---\n")


if __name__ == "__main__":
    main()
