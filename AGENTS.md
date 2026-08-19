# AGENTS.md

Handoff for whoever picks this up next. Written 2026-08-11, at commit `a1a9a21`.

Read `CLAUDE.md`, `DESIGN.md` and `PRODUCT.md` first — they are the standing
rules and they win over anything here. This file adds what those three cannot:
the current state, the queue, and the specific ways this repo has already wasted
someone's afternoon.

---

## 1. Hard rules

These are not preferences. Breaking one is a defect.

- **Git identity is `Looziolooz <Looziolooz@users.noreply.github.com>`.** Never
  commit or push as the savantmedia.se work account. Never name the owner's
  employer anywhere in the codebase or copy.
- **Never invent testimonials, client names, or logos.** Real ones live in
  `src/lib/testimonials.ts`, which is empty on purpose. An empty array is
  correct; a plausible-sounding quote is fraud.
- **The assistant must cost nothing.** Groq free tier only. Never propose,
  scaffold, or document a paid LLM key.
- **Every project on the site is a demo unless it says otherwise.** The copy
  says "automazione dimostrativa" / invented businesses for a reason. Do not
  quietly upgrade a demo into a client case study.
- **Read `DESIGN.md` before any visual decision.** Palette is Parchment &
  Forest: light parchment canvas, ink text, ochre gold fills that take DARK text
  (never white), forest green links, teal/sage as cool accents. Emerald is
  retired. Display type is Fraunces, body is General Sans. Never Inter or
  system-ui.
- **Copy priority is Italian**, with EN and SV mirrored. Write like a person:
  no em-dashes, no forced triplets, no "X, not Y" constructions.

## 2. How to verify anything

```bash
npx tsc --noEmit                      # types
npm test                              # 40 tests, 5 files
npx eslint <changed files>            # see §5 for the two rules that bite
npx impeccable detect src             # design detectors, see accepted finding below
STRIPE_SECRET_KEY="" npm run build    # must survive a missing Stripe key
```

`npx impeccable detect src` reports exactly one accepted finding: Inter inside
the codepen sandbox wrapper (`src/lib/codepen-catalog.ts`). That is pen demo
content, not site UI. Any other finding is real.

**Check the live domain after every deploy**, not just localhost. Two bugs this
year were invisible locally: marquee posters 404ing in production only, and a
route that looked broken purely because the deploy was mid-swap. `https://looz.design`.

## 3. Where the non-obvious things live

- **`src/i18n/index.ts`** — one file, three blocks in the order `it`, `en`, `sv`.
  There are no per-locale files. Scripts that edit it select a locale by the
  *nth occurrence* of a key. Every `work.proj.*` key must exist exactly three
  times; verify with:
  ```bash
  grep -o '"work\.proj\.[a-z0-9-]*"' src/i18n/index.ts | sort | uniq -c | awk '$1!=3'
  ```
- **`src/lib/projects.ts`** — the single source of truth for work. `featured`
  controls visibility, `coverVideo` decides whether a project can appear in the
  marquee and showcase at all (both filter on it), `demo` makes the detail page
  embed a live iframe instead of a still.
- **`src/components/FlowDiagram.tsx`** — the three-stage read (what it is, what
  got built, what it changed) on every project detail page. It is a live
  component, not a video, and the docblock explains why at length. It is driven
  entirely by copy the project already has, so it translates for free and cannot
  contradict the page.
- **`src/lib/useRotation.ts`** — the marquee, showcase and gallery draw a fresh
  random window each visit. The hook exists in the shape it does because two
  simpler versions are forbidden by lint; read its docblock before "simplifying".
- **`src/app/servizi/*`** — service landing pages, hardcoded Italian on purpose
  (crawlable surfaces for Italian queries). They share `shared-css.ts`.
- **Diagram generator** — the automation covers are rendered from a parametric
  `flow.html` + a config object per flow. Those files live in the session
  scratchpad, **not in the repo**. If you need to regenerate a cover you will
  have to rebuild the generator; `FlowDiagram.tsx` is the living version of the
  same design and is the better starting point.

## 4. The queue

### Decided, just needs doing

1. **Self-host Fraunces and JetBrains Mono.** `src/app/layout.tsx` pulls both
   from `next/font/google`, which fetches from `fonts.gstatic.com` *at build
   time*. On 2026-08-11 that CDN returned 404s and failed a local build; two
   retries passed. The same hiccup on Vercel fails a deploy. General Sans is
   already self-hosted in `src/app/fonts/` — follow that pattern. This is the
   highest-value item in the list because it removes a dependency that can break
   production for reasons nobody controls.
2. **Dead code from finished work.** `credit?: string` in `src/lib/projects.ts`
   and its renderer in `src/app/work/[slug]/page.tsx` are now unused — the field
   is a legitimate mechanism, so keep it or remove it deliberately, but decide.
   `ProjectShowcase.tsx` has an unused `Image` import that lint flags.

### Needs the owner's decision — do not guess

3. **Swedish prices.** The rule is now one price list: euros for IT/EN, kronor
   for SV, converted at 10.95 and rounded. That cut the Swedish site price from
   8 900 kr to **7 700 kr** (−13%) and the monthly from 290 to 275. He may want
   a round 8 000 kr instead. The rate is a snapshot, not a live formula — if it
   drifts far, it needs re-deciding, not silently re-converting.
4. **Bento cells for "Visibilità online" and "Dati dal web".** Both now have
   demos but no `/servizi/*` page, so they are the only unlinked service cells.
   **Warning before you add one:** the bento grid currently holds exactly seven
   cells after the image and headline, which fills three rows of four with no
   gap. Adding a linked cell does not change the count, but adding a *cell*
   does, and it will strand one in a row of four. Measure before and after.
5. **Marquee legibility.** The old automation mp4s render at 0.42x there, which
   puts 12.5px body text on screen at about five pixels — decorative, not
   readable. A reduced variant carrying only the three stage labels was offered
   and not yet approved.
6. **Marquee ordering.** The automations are the newest entries, so they take
   the first slots. Interleaving them with the website demos was offered and not
   yet approved. It is one reorder in `projects.ts`.
7. **Claude Cowork pricing.** `/servizi/claude-cowork` scopes installation as
   "mezza giornata" and consulting as "su preventivo", deliberately without
   figures. Numbers are his call.

### Owner-only, cannot be done from a coding session

8. ~~**`www.looz.design` throws a browser security warning.**~~ **Done 2026-08-18**:
   `www.looz.design` is attached to the `freelance-portfolio` project with a 308
   redirect to `looz.design`, certificate issued.
9. ~~**`hello@looz.design` does not exist — no MX record.**~~ **Done 2026-08-18**:
   ImprovMX account configured via its API, domain added and `active: true`,
   alias `hello@looz.design` → `lorenzo.dastoli@gmail.com`. Zone records live:
   MX 10 `mx1.improvmx.com`, MX 20 `mx2.improvmx.com`, SPF
   `v=spf1 include:spf.improvmx.com ~all`, DMARC
   `v=DMARC1; p=none; rua=mailto:hello@looz.design`. DKIM absent on purpose —
   only needed to *send* from the domain, not to receive.

10. ~~**Forms send via Resend, blocked on one owner action.**~~ **Done 2026-08-18**:
    `node scripts/resend-setup.mjs` ran to the end: domain `looz.design` registered
    in Resend (EU, id `7331df66-439a-46ac-94e5-ff1a9c71d455`) and verified, DKIM/SPF
    records in the Vercel zone, branded `lead-notification` template created and
    published, `RESEND_API_KEY` stored for production + preview, production
    redeployed, and a real proof lead returned HTTP 200. Two robustness fixes live
    in the script from that run: it treats Resend's 403 "registered already" as
    "exists, resume", and it never re-triggers `/verify` on an already-verified
    domain (that POST flips the status back to `pending` for ~5 minutes). The
    script remains safe to re-run; it skips whatever already exists.

    To refresh the branded email after editing `src/lib/email-template.ts`, re-run
    the same command with the current key.

Both were done from a coding session with `vercel login` on the **Looziolooz**
account. CLI domain/API calls must pass the team scope explicitly
(`--scope loozioloozs-projects`, or `teamId=team_h4Ey4sXXkpFVLP91QwZD0tVu` in
the REST API): without it, Vercel resolves to the user's personal scope and
every domain call returns 403 "You don't have access", even though the domain
is owned by the team.

## 5. Traps that have already cost time

- **`vercel env add <KEY> preview` loops forever.** It answers
  `action_required / git_branch_required` and, in its own `next[]` hint, suggests
  the exact command you just ran — including `--value ... --yes`. Running it
  again gets the same refusal. Use the REST API instead:

      POST https://api.vercel.com/v10/projects/freelance-portfolio/env?teamId=team_h4Ey4sXXkpFVLP91QwZD0tVu
      {"key":"...","value":"...","type":"encrypted","target":["preview"]}

  The CLI token lives at
  `~/AppData/Roaming/xdg.data/com.vercel.cli/auth.json` (NOT the paths the docs
  list). Production adds work fine through the CLI; only `preview` loops.

- **`git push` does not trigger a deploy on this project.** Pushing `main` left
  production serving a two-hour-old deployment while the fix sat in the repo,
  which reads exactly like "the fix did not work". After any push whose change
  must go live, run `vercel deploy --prod --yes --scope loozioloozs-projects`
  and confirm with `vercel inspect https://looz.design` that `created` is
  seconds, not hours, old.


- **Turbopack serves stale CSS.** Edits to `globals.css` often do not recompile.
  Symptom: your rule is in the file and not in the browser. Fix: kill whatever
  holds port 3000, `rm -rf .next`, restart. Do not spend an hour re-reading your
  selector first.
- **`images.qualities` in `next.config.ts` must list every `q` value used.**
  An unlisted `q` returns **400 in production only** — dev is fine, which is how
  it shipped.
- **Never do a first-match string replacement on a page file.** A script
  targeting `<p style={{ fontSize: "var(--fs-lg)"` matched the *not-found*
  branch first and deleted the header and the component's constants. Use exact,
  unique anchors, and read the diff before committing.
- **Two lint rules will reject the obvious React.** `setState` inside an effect
  is an error, and so is reading a ref during render. `useRotation.ts` is the
  worked example of getting a client-only value without either.
- **PowerShell here-strings (`@'…'@`) do not work in a bash shell.** Use a
  heredoc. This mangled a commit message once.
- **`npm run build` exit code is not the same as "no errors in the output".**
  Check `$?` explicitly. A build that printed a full route table had still
  exited 1.
- **Prices appear in more places than you expect.** A figure lives in the
  engagement cards, the FAQ answer, the cost note, the hosting note, `/prezzi`,
  the service pages, and JSON-LD `offers`. Changing one and not the rest is the
  default failure. Grep for the number across `src/`, all three locales.

## 6. State as of this handoff

Six services are sold and all six now have something to look at: websites (many
demos), automations (four), agents (the site's own assistant is the demo), social
content, visibility, and web data. `/servizi/` has four landing pages —
`siti-web`, `automazioni`, `agenti-ai`, `claude-cowork`. The gallery holds 21
featured projects. Tests pass at 40, the build is clean, and every route checked
on the live domain returns 200.
