"""Fail on a backtick inside a CSS-in-JS template literal, and on unbalanced braces.

Both mistakes are silent in different ways and both were made in this repo.

A backtick inside `const CSS = ` ... `` ends the literal, so the build dies with a
bewildering "Expected '</', got 'ident'" pointing at a CSS comment. That one is at
least loud. The other is worse: an unclosed brace makes every rule after it part
of an invalid block, the build passes, and a whole component silently loses its
styling. The cinematic footer shipped with its ground transparent and its 345px
watermark rendering at 16px because of one stray line.

    python scripts/check-css-literals.py
"""

import glob
import io
import re
import sys

BLOCKS = (
    ("const CSS", r"const CSS = `(.*?)\n`;"),
    ("<style>", r"<style[^>]*>\{`(.*?)`\}</style>"),
)

problems = []
for path in sorted(glob.glob("src/**/*.tsx", recursive=True)):
    text = io.open(path, encoding="utf-8").read()
    for label, pattern in BLOCKS:
        for match in re.finditer(pattern, text, re.S):
            css = match.group(1)
            line = text[: match.start()].count("\n") + 1
            if "`" in css:
                problems.append("%s:%d  %s  backtick inside the CSS literal" % (path, line, label))
            opened, closed = css.count("{"), css.count("}")
            if opened != closed:
                problems.append(
                    "%s:%d  %s  unbalanced braces: %d open, %d close"
                    % (path, line, label, opened, closed)
                )

for p in problems:
    print(p)
print("%d CSS literal problem(s)" % len(problems))
sys.exit(1 if problems else 0)
