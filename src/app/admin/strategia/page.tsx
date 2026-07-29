// Internal strategy page. This is a SERVER component on purpose: the content is
// rendered on the server and only sent to requests that already passed the
// Basic-Auth gate in src/middleware.ts. Nothing here ships to the browser as
// source, so the strategy never leaks in a client bundle. Also hidden from
// nav/footer + noindex + robots-disallowed (admin/layout.tsx + lib/launch.ts).

type Month = {
  n: string;
  theme: string;
  goal: string;
  actions: string[];
  metric: string;
};

const MONTHS: Month[] = [
  {
    n: "01",
    theme: "Lancio & fondamenta",
    goal: "Esserci, mostrare stile e metodo, ottenere le prime call.",
    actions: [
      "Giorno 0: dominio + chiave Web3Forms + analytics; setup pagina FB (foto profilo, bio, CTA, link).",
      "Attiva i 5 pilastri di contenuto. Ritmo: 3–4 post + 1 reel a settimana.",
      "Sett. 1 esserci · 2 mostrare come lavori · 3 autorità + outreach diretto · 4 convertire.",
      "Nucleo Instagram + Facebook (cross-post) + LinkedIn per l'autorità. Entra nei gruppi FB.",
    ],
    metric: "Prime call prenotate / richieste di audit",
  },
  {
    n: "02",
    theme: "Ritmo & primi clienti",
    goal: "Trasformare l'interesse in lavoro pagato e consolidare l'abitudine.",
    actions: [
      "Outreach sistematico: 10–15 attività a settimana con offerta di audit gratuito.",
      "Chiudi 1–2 progetti reali e documenta il processo: diventeranno case study.",
      "Chiedi feedback/testimonianze ai primi clienti — reali, mai inventate (lib/testimonials.ts).",
      "Avvia il blog: 1–2 articoli (SEO + autorità), riadattando i post migliori. LinkedIn 2/sett.",
    ],
    metric: "Progetti chiusi · lead qualificati",
  },
  {
    n: "03",
    theme: "Autorità & motore contenuti",
    goal: "Diventare un riferimento, non solo un fornitore.",
    actions: [
      "Blog a regime (1 articolo/settimana): casi, guide, automazioni e AI per piccole imprese.",
      "Pubblica il primo case study (dal cliente del mese 2) sul sito e sui social.",
      "Serie educativa su IG/FB (caroselli + reels). Chiedi referral ai clienti soddisfatti.",
      "Pubblica le prime testimonianze reali nella sezione Trust della home.",
    ],
    metric: "Traffico organico al sito · lead da contenuti (non solo outreach)",
  },
  {
    n: "04",
    theme: "Scalare l'organico + primo test paid",
    goal: "Amplificare ciò che già funziona.",
    actions: [
      "Analizza i dati: quali canali e post portano lead? Raddoppia su quelli, taglia il resto.",
      "Solo SE il funnel converte (audit → call → cliente): piccolo test di retargeting a pagamento, budget minimo, solo chi ha già visitato.",
      "Valuta un canale video serio (Reels o primo YouTube/TikTok) se hai il ritmo.",
    ],
    metric: "Costo per lead (organico vs paid) · ROI del test",
  },
  {
    n: "05",
    theme: "Prodotti & membership",
    goal: "Attivare il secondo motore di ricavi: content → membership → consulting.",
    actions: [
      "Con un pubblico costruito, rivela la galleria componenti + gli abbonamenti (togli il flag LAUNCH_MODE in lib/launch.ts).",
      "Lancia l'accesso a vita €100 con una comunicazione dedicata (email + social).",
      "I servizi restano il core e girano in parallelo: la membership è un'aggiunta, non un sostituto.",
    ],
    metric: "Acquisti lifetime + lead servizi",
  },
  {
    n: "06",
    theme: "Sistema & ottimizzazione",
    goal: "Rendere ripetibile ciò che funziona.",
    actions: [
      "Rivedi 6 mesi di dati: canali, contenuti e offerte migliori. Elimina ciò che non rende.",
      "Sistematizza: template di post, calendario ricorrente, processo di outreach.",
      "Retention: aggiornamenti/newsletter ai contatti, upsell ai clienti esistenti.",
      "Decidi se rendere stabile il paid (se il test ha reso) e/o aprire un nuovo canale.",
    ],
    metric: "Pipeline · ricavi ricorrenti (membership) + progetti",
  },
];

const CSS = `
.stg { min-height: 100vh; background: var(--canvas-page); color: var(--ink-body); font-family: var(--font-ui); }
.stg-wrap { max-width: 880px; margin: 0 auto; padding: clamp(28px, 5vw, 72px) clamp(18px, 4vw, 40px) 120px; }

.stg-badge { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent-green-deep); background: var(--canvas-panel-yellow); border: 2px solid var(--ink-border); border-radius: 999px; padding: 5px 12px; }
.stg-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent-green); display: inline-block; }

.stg h1 { font-family: var(--font-display); font-weight: 600; font-size: clamp(30px, 5.5vw, 52px); line-height: 1.03; letter-spacing: -0.015em; margin: 16px 0 0; }
.stg-lede { font-size: clamp(16px, 1.6vw, 19px); line-height: 1.6; color: var(--ink-body); max-width: 62ch; margin: 16px 0 0; }
.stg-lede b { color: var(--accent-green-deep); }

.stg-funnel { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
.stg-funnel span { font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 7px 13px; border: 2px solid var(--ink-border); border-radius: 8px; background: var(--canvas-panel-yellow); }
.stg-funnel .arr { border: none; background: none; color: var(--ink-muted); padding: 7px 2px; }

.stg-months { position: relative; display: flex; flex-direction: column; gap: 20px; margin-top: clamp(40px, 7vw, 72px); }
.stg-months::before { content: ""; position: absolute; left: 27px; top: 22px; bottom: 22px; width: 3px; background: linear-gradient(to bottom, var(--accent-green), var(--accent-green-deep)); border-radius: 3px; }

.stg-m { position: relative; display: flex; gap: 20px; }
.stg-m__n { flex-shrink: 0; z-index: 1; width: 56px; height: 56px; border-radius: 50%; background: var(--canvas-page); border: 3px solid var(--ink-border); box-shadow: 4px 4px 0 var(--ink-shadow); display: grid; place-items: center; font-family: var(--font-mono); font-weight: 700; font-size: 17px; color: var(--accent-green-deep); }
.stg-m__body { flex: 1; min-width: 0; background: var(--canvas-panel-yellow); border: 3px solid var(--ink-border); border-radius: var(--radius-lg); box-shadow: 4px 4px 0 var(--ink-shadow); padding: 20px 22px; }
.stg-m__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; }
.stg-m__theme { font-family: var(--font-display); font-size: 22px; font-weight: 600; letter-spacing: -0.01em; }
.stg-m__lab { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-green-deep); }
.stg-m__goal { margin: 8px 0 0; font-family: var(--font-display); font-size: 16px; font-weight: 500; color: var(--ink-body); }
.stg-m__acts { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-direction: column; }
.stg-m__acts li { display: flex; gap: 10px; align-items: baseline; padding: 9px 0; border-top: 1.5px solid color-mix(in oklch, var(--ink-border) 16%, transparent); font-size: 14.5px; line-height: 1.5; color: var(--ink-body); }
.stg-m__acts li:first-child { border-top: none; padding-top: 2px; }
.stg-m__acts .tick { color: var(--accent-green-deep); font-weight: 800; flex-shrink: 0; }
.stg-m__metric { display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; letter-spacing: 0.03em; background: var(--accent-green); color: var(--btn-ink); border: 2px solid var(--ink-border); border-radius: 8px; padding: 6px 12px; box-shadow: 2px 2px 0 var(--ink-shadow); }
.stg-m__metric .k { opacity: 0.7; }

.stg-note { margin-top: clamp(40px, 7vw, 64px); border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--accent-green-deep); color: var(--canvas-page); box-shadow: 4px 4px 0 var(--ink-shadow); padding: 22px 24px; }
.stg-note h2 { font-family: var(--font-display); font-size: 22px; font-weight: 600; margin: 0 0 12px; color: var(--canvas-page); }
.stg-note ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.stg-note li { display: flex; gap: 10px; align-items: baseline; font-size: 14.5px; line-height: 1.5; }
.stg-note .x { color: var(--accent-green-bright); font-weight: 700; font-family: var(--font-mono); flex-shrink: 0; }

.stg-foot { margin-top: 48px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.04em; color: var(--ink-muted); }

@media (max-width: 560px) {
  .stg-months::before { left: 23px; }
  .stg-m { gap: 14px; }
  .stg-m__n { width: 48px; height: 48px; font-size: 15px; }
}
`;

export default function StrategiaAdmin() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="stg">
        <div className="stg-wrap">
          <header>
            <span className="stg-badge"><span className="stg-dot" aria-hidden="true" /> Pagina interna · non pubblica</span>
            <h1>Strategia · piano operativo mese per mese</h1>
            <p className="stg-lede">
              Bussola dei primi sei mesi. La tesi non cambia: usa i <b>siti demo</b> come contenuto,
              dai valore nei gruppi, porta tutto verso l'<b>audit gratuito</b>. Organico prima, paid solo
              quando il funnel converte da solo. Tutto punta al funnel di lungo periodo:
            </p>
            <div className="stg-funnel">
              <span>Contenuti</span><span className="arr">→</span>
              <span>Membership</span><span className="arr">→</span>
              <span>Consulenza</span>
            </div>
          </header>

          <div className="stg-months">
            {MONTHS.map((m) => (
              <section key={m.n} className="stg-m">
                <div className="stg-m__n">{m.n}</div>
                <div className="stg-m__body">
                  <div className="stg-m__head">
                    <span className="stg-m__lab">Mese {m.n}</span>
                    <span className="stg-m__theme">{m.theme}</span>
                  </div>
                  <p className="stg-m__goal">{m.goal}</p>
                  <ul className="stg-m__acts">
                    {m.actions.map((a, i) => (
                      <li key={i}><span className="tick" aria-hidden="true">+</span>{a}</li>
                    ))}
                  </ul>
                  <span className="stg-m__metric"><span className="k">Metrica ·</span> {m.metric}</span>
                </div>
              </section>
            ))}
          </div>

          <div className="stg-note">
            <h2>Regole d'oro (da non dimenticare mai)</h2>
            <ul>
              <li><span className="x">✕</span><span>Niente follower/like comprati e niente testimonianze o loghi finti. L'onestà è il vantaggio: i demo sono "concept, non clienti reali".</span></li>
              <li><span className="x">✕</span><span>Niente ads a pagamento finché l'organico non converte e non hai dati. Poi, semmai, retargeting minimo.</span></li>
              <li><span className="x">✕</span><span>Niente dispersione: 2–3 piattaforme fatte bene. Un contenuto → riadattato ovunque.</span></li>
              <li><span className="x">✕</span><span>La metrica che conta sono i lead (call, audit), non i follower. Il resto è ego.</span></li>
            </ul>
          </div>

          <p className="stg-foot">lorenzo.studio · documento interno · aggiorna man mano che impari cosa funziona.</p>
        </div>
      </div>
    </>
  );
}
