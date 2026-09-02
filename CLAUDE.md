# CLAUDE.md

Guidance for Claude when working in this repository.

## Design System
Always read [DESIGN.md](DESIGN.md) before making any visual or UI decision.
[PRODUCT.md](PRODUCT.md) carries the product/audience context for design tooling.
The **impeccable** skill (design guidance + deterministic detectors) is installed
locally in `.claude/` (gitignored) — reinstall with `npx impeccable install`;
run `npx impeccable detect src` before shipping UI changes. Accepted finding:
Inter inside the codepen sandbox wrapper (pen demo content, not site UI).
All font choices, colours, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval. When reviewing code, flag anything
that doesn't match DESIGN.md (notably: the palette is Parchment & Forest — light
parchment canvas, ink text, ochre gold accent for fills (with DARK text, never white),
forest green for links, teal/sage as cool accents; emerald is retired; display type is
Fraunces, body is General Sans, never Inter/system).

## Product
`LOoz.design` (formerly Lorenzo.studio — that domain belongs to an unrelated business) —
an Italian-market freelance studio portfolio that sells outcomes
(websites & e-commerce, visibility, social content, automation, web data, AI agents
for solo founders). Funnel: content → membership → consulting. Copy priority is
**IT**, with EN/SV mirrored. Keep the brand discreet — never reference the user's
employer.

## Social content & the free-audit lead magnet
Two service lines on this site now have a production path behind them. The
operating rule lives in the vault (`Panel/REGOLE-GLOBALI.md`, section 5); the
project-specific part is:

- **Social content retainer** — topics are researched, not invented. Mine the
  audience's own words (ScrapeCreators `comment-mining`, `outlier-post-finder`)
  before writing a post or a reel script. This is also the cheapest defence
  against copy that reads as AI-generated, which DESIGN.md and the copy rules
  already forbid.
- **The "audit gratuito" lead magnet** is currently a promise fulfilled by hand
  over mailto. `claude-ads` can turn it into a repeatable, dated, versioned
  artifact, and its audit path runs **from a CSV export** — no API credentials
  and no seat in the client's ad account, just the export. Keep the
  `launch`/`optimize` branch (which writes to live accounts) disabled.
- Neither tool is installed yet, and both must go in **as plugins, never with
  their standalone installers** — those flood the global skill namespace.
- Generated assets keep coming from Higgsfield/Canva and land in `public/`,
  registered in ASSETS.md. `/ads create` only produces briefs, not files.
