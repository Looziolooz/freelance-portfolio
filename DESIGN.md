# Design System — lorenzo.hacks

> Read this before any visual or UI change. Fonts, colours, spacing, and
> aesthetic direction are defined here. Don't deviate without explicit approval.
> Tokens live in [`src/app/globals.css`](src/app/globals.css) (`:root`).

## Product Context
- **What this is:** a freelance studio-of-one portfolio that sells outcomes — websites & e-commerce, online visibility, social content, automation of repetitive work, web-data collection, and AI agents for solo founders.
- **Who it's for:** small and large businesses in the **Italian market** (IT primary; EN/SV also supported).
- **Memorable thing:** *real craft, not a template.* Every choice serves the impression that a human with taste built this — which is what converts skeptical clients into consulting calls.
- **Project type:** marketing portfolio + funnel (content → membership → consulting), with an in-app AI agent layer.

## Aesthetic Direction
- **Direction:** warm neo-brutalist. Exposed structure (thick ink borders, hard offset shadows), warm paper canvas, mono technical labels, expressive serif display.
- **Decoration level:** intentional — borders + hard shadows + light paper texture do the work; no blur, no gradients, no glassmorphism.
- **Mood:** hand-built, confident, growth-minded. Craft over polish-for-its-own-sake.
- **Anti-slop guardrails:** no purple gradients, no 3-column icon-in-circle grids, no centered-everything, no soft drop shadows, no Inter/Geist/system-ui as display or body.

## Typography
- **Display / Hero:** **Fraunces** (variable "soft serif", optical sizing). Used on hero h1, `.section-head__title`, project card titles, detail `<h1>`. Loaded via `next/font` → CSS var `--font-fraunces`, exposed as `--font-display`.
- **Body / UI:** **General Sans** (Fontshare). Loaded via `<link>` in [`layout.tsx`](src/app/layout.tsx); exposed as `--font-sans` / `--font-ui`.
- **Mono / Labels:** **JetBrains Mono** (`next/font`) → `--font-mono`. Eyebrows, stats, badges, code, the wordmark accent context.
- **Scale (px):** display `clamp(34, 5.4vw, 96)` · h1 28 · h2 22 · lg 18 · base 16 · sm 14 · xs 12 · badge 10.
- **Weights:** 400 / 500 / 600 (display headings 500–600; never 700+ on Fraunces display).
- **Tracking:** display `-0.02em`; tight `-0.02em`; never tighter than `-0.02em` on the serif (it cramps).

## Color
- **Approach:** restrained — warm neutrals + **one emerald accent**. Colour is meaningful, not decorative.
- **Canvas:** page `#FFFCF7` · panel-yellow `#fff4da` · panel-grey `#fafafa`.
- **Primary accent — emerald green:**
  - `--accent-green` `#0E8A57` — fills (badges, section-number chips, hero highlight, pillar index) with **white** text.
  - `--accent-green-deep` `#0A6E45` — text-on-cream (links, wordmark accent, value labels) for AA contrast.
  - `--accent-green-bright` `#14A36B` — dark-mode colored shadow.
  - Legacy `--accent-coral*` tokens are **aliases** of the green now — do not reintroduce red.
- **Warm secondary:** peach `#ffc480` / peach-deep `#F6A623` — `.neo-btn` background (friendly secondary CTA).
- **Decor:** teal `#2F8F7A` — "available" status dot only.
- **Ink:** border/body/shadow `#14110D` · muted `#5C5349`.
- **Dark mode:** canvas `#16140F` · ink `#F4F1EA` · colored shadow `#14A36B` (emerald). Surfaces are redesigned, not inverted.

## Spacing
- **Base unit:** 4px. **Density:** comfortable.
- **Scale:** 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 (`--space-1`…`--space-16`).

## Layout
- **Approach:** hybrid — disciplined grid for cards/app, editorial for the hero.
- **Max content width:** 1200px (`--container-max`); agent pages 1440.
- **Card grid:** `repeat(auto-fit, minmax(280–320px, 1fr))`, gap 24–32.
- **Border radius:** sm 2 · base 4 · lg 12 · full 9999. Cards/panels use `lg`; controls use `base`.
- **Project cards:** one shape everywhere — `.neo-card` body, 3px ink border, 16/10 cover, hard offset shadow, hover lift `translate(-2px,-2px)`, serif title, mono `Valore` line.

## Motion
- **Approach:** intentional. Entrance reveals + meaningful hover/state transitions; nothing decorative.
- **Easing:** `--ease` `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Duration:** fast 150ms · base 200ms · slow 300ms.
- **Signature:** neo offset shadows shift on hover (panel 8px, card 6px, control 4px); buttons press to `translate(6px,6px)` with shadow removed.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-05 | Accent changed coral red → emerald green | User dislike of red; green codes growth/value/marketing — the brand's pitch. Vibrant tone for fills, deep tone for text-on-cream contrast. |
| 2026-06-05 | Display/body type changed Inter Tight → Fraunces + General Sans | Inter is the #1 "AI default" and flattened the "real craft" message; an expressive serif is rare among dev portfolios and signals taste. |
| 2026-06-05 | Added homepage Services band (6 pillars) + outcome-first copy | Reposition from "AI orchestrator / n8n / scraper" to a services business; lead with business outcomes, not tools. |
| 2026-06-05 | Added "Valore" (value) line to every project | Show the business outcome (e.g. admin panel controlling bookings/sales/stock), not just the stack. |
| 2026-06-05 | Initial design system documented | Created by /design-consultation; formalises the warm neo-brutalist system already in `globals.css`. |
