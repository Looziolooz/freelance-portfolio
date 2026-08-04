# PRODUCT.md — LOoz.design

Design/product context for AI tooling (read by impeccable commands alongside DESIGN.md).

## What this is

`LOoz.design` (looz.design) — the portfolio/storefront of a one-person freelance studio
selling outcomes to Italian small businesses and solo founders: custom websites &
e-commerce, online visibility (SEO), social content, process automation, web data, and
AI agents. Copy priority is Italian; English and Swedish are mirrored client-side.

## Audience

Non-technical Italian small-business owners (ristoratrice, negoziante, solo founder) plus
a secondary developer audience for the components gallery. They are skeptical, on mobile,
and decide fast. Plain language wins; agency jargon loses ("discovery" is banned copy).

## Surface modes

- Home, /contatti: **Persuade** — funnel entry is the free site audit (2-field form, 24h reply).
- /work + project pages: **Experience** — 14 concept demos with live iframes and brand kits;
  honesty is a feature (explicit "demo/concept, not real clients" framing; NEVER fabricate
  testimonials or client logos).
- /processo, /agents digest: **Read**.

## Voice

First person, direct, concrete, warm ("Mi scrivi e ti rispondo in giornata"). Short
sentences. No em-dashes, no forced triplets, no "X not Y" constructions, no AI-tell copy.

## Visual world (pinned — see DESIGN.md, the brief wins)

Parchment & Forest, neo-brutalist: light parchment canvas (#F5EEDF), ink text (#221E17),
ochre gold fills with DARK text (#E8A12C — never white on ochre), forest green links
(#143A2B), sage/teal cool accents. 3px ink borders + hard offset shadows. NO glass, NO
blur, NO gradients (the in-hue ochre "sheen" ramp is the one sanctioned exception).
Type: Fraunces (display — pinned, keep despite overused-font warnings), General Sans
(body), JetBrains Mono (labels). Never Inter/system for site UI (pen demo content inside
the sandboxed gallery iframe is exempt).

## Anti-references

Generic SaaS templates, purple-blue gradients, glassmorphism, accent rails/side-tabs on
cards, centered-everything landing pages, testimonial walls (we have none by honesty).

## Constraints

- Assistant/agents must run at zero model cost (Groq free tier); never propose paid keys.
- Privacy posture: no street address, no city, first-name-only in public HTML.
- Pre-launch gating via src/lib/launch.ts (LAUNCH_MODE); hidden routes stay unlinked.
- Perf: dev-mode Lighthouse is meaningless; prod LCP ~1.1s must not regress. Hero video
  stays deferred-until-scroll; gallery cover clips are hover-driven, play once.
