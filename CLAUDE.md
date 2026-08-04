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
