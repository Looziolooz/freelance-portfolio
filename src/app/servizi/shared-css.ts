// Shared styles for the /servizi/* landing pages (same neo-brutalist mold).
export const SV_CSS = `
.sv { padding-top: calc(var(--topbar-h) + clamp(44px, 7vw, 96px)); padding-bottom: clamp(70px, 9vw, 130px); }
.sv-head { max-width: 780px; }
.sv-lede { font-size: clamp(17px, 1.8vw, 20px); line-height: 1.6; color: var(--ink-muted); max-width: 640px; margin: 18px 0 0; }
.sv-sec { margin-top: clamp(48px, 7vw, 88px); }
.sv-h2 { font-family: var(--font-display); font-size: clamp(26px, 3.6vw, 40px); font-weight: 600; letter-spacing: -0.015em; margin: 0 0 18px; }
.sv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
.sv-card { border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow); padding: 18px 20px; }
.sv-card h3 { font-family: var(--font-display); font-size: 19px; font-weight: 600; margin: 0 0 6px; }
.sv-card p { margin: 0; font-size: 14.5px; line-height: 1.55; color: var(--ink-muted); }
.sv-proof { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
.sv-proof__card { display: block; border: 3px solid var(--ink-border); border-radius: var(--radius-lg); overflow: hidden; background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow); text-decoration: none; color: var(--ink-body); transition: transform .15s ease-out, box-shadow .15s ease-out; }
.sv-proof__card:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 var(--ink-shadow); color: var(--ink-body); }
.sv-proof__img { position: relative; aspect-ratio: 16/10; }
.sv-proof__body { padding: 12px 16px 14px; }
.sv-proof__name { font-family: var(--font-display); font-size: 18px; font-weight: 600; }
.sv-proof__blurb { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 4px 0 0; font-size: 13px; line-height: 1.45; color: var(--ink-muted); }
.sv-price { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; max-width: 880px; }
.sv-price__card { border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow); padding: 24px; }
.sv-price__name { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent-green-deep); }
.sv-price__big { font-family: var(--font-display); font-size: clamp(24px, 3vw, 34px); font-weight: 600; margin: 8px 0 10px; }
.sv-price__body { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--ink-body); }
.sv-cta { margin-top: clamp(56px, 8vw, 100px); border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--accent-green); box-shadow: 6px 6px 0 var(--ink-shadow); padding: clamp(30px, 5vw, 56px); text-align: center; }
.sv-cta h2 { font-family: var(--font-display); font-size: clamp(26px, 4vw, 46px); font-weight: 600; letter-spacing: -0.02em; color: var(--btn-ink); margin: 0 0 10px; }
.sv-cta p { margin: 0 auto 24px; max-width: 520px; font-size: 16px; line-height: 1.6; color: var(--btn-ink); }
.sv-guar { display: flex; flex-wrap: wrap; gap: 12px; }
.sv-guar span { font-family: var(--font-mono); font-size: 12.5px; font-weight: 700; letter-spacing: .03em; padding: 9px 15px; border: 2px solid var(--ink-border); border-radius: 999px; background: var(--canvas-panel-yellow); }
`;
