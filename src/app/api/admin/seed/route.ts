import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api-response";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    const existing = await prisma.content.count();
    if (existing > 0) {
      return error("Database already seeded", 400);
    }

    const seedUser = await prisma.user.create({
      data: {
        email: "admin@lorenzodastoli.com",
        name: "Lorenzo Dastoli",
        passwordHash: await hashPassword("admin123"),
        tier: "PRO",
      },
    });

    const articles = await prisma.content.createMany({
      data: [
        // ===== FREE — Blog =====
        {
          title: "How I Automated My Entire Client Onboarding with n8n",
          slug: "automated-client-onboarding-n8n",
          description: "A step-by-step breakdown of the pipeline that saved 95% of manual processing time.",
          body: `I remember the day a client sent me a PDF with 15 steps for onboarding. Each step involved a different platform: email, Slack, Airtable, Google Drive, DocuSign, and more. I knew there had to be a better way.

## The Trigger

Every new lead starts the same way: they fill out a Google Form. That single webhook trigger kicks off an n8n workflow that handles everything.

## The Workflow

\`\`\`
Google Form → n8n Webhook → AI Classifier → Airtable
  → Slack Notification → Stripe Invoice → Google Calendar
  → Gmail Sequence → Done
\`\`\`

## Key Components

**AI Classification**: I use Groq's Llama 3 to read the form response and classify the lead type, urgency, and service category. This determines which path the workflow takes.

**Conditional Logic**: Enterprise leads get a different email sequence than freelancers. High urgency triggers a Slack alert to my phone.

**Error Handling**: Every step has a fallback. If Stripe fails, the lead is flagged and I get notified instead of losing them.

## Results

- 95% reduction in manual work
- Zero data entry errors
- 24/7 processing (they get invoices at 3am if they want)
- 40% faster close rate

The best part? Once it's built, it runs forever. That's the beauty of automation.`,
          category: "blog", tier: "FREE", lang: "EN", published: true,
        },
        {
          title: "Come ho automatizzato l'onboarding clienti con n8n",
          slug: "automatizzato-onboarding-clienti-n8n",
          description: "Il pipeline che ha risparmiato il 95% del tempo di elaborazione manuale.",
          body: `Ricordo il giorno in cui un cliente mi inviò un PDF con 15 passaggi per l'onboarding. Ogni passaggio coinvolgeva una piattaforma diversa: email, Slack, Airtable, Google Drive, DocuSign e altro. Sapevo che doveva esserci un modo migliore.

## Il Trigger

Ogni nuovo lead inizia allo stesso modo: compila un Google Form. Quel singolo webhook attiva un workflow n8n che gestisce tutto.

## Il Workflow

\`\`\`
Google Form → n8n Webhook → AI Classifier → Airtable
  → Slack Notification → Stripe Invoice → Google Calendar
  → Gmail Sequence → Fatto
\`\`\`

## Componenti Chiave

**Classificazione AI**: Uso Groq's Llama 3 per leggere la risposta e classificare il tipo di lead, urgenza e categoria di servizio.

**Logica condizionale**: I lead enterprise ricevono sequenze email diverse dai freelancer. L'alta urgenza attiva un alert Slack sul mio telefono.

**Gestione errori**: Ogni passo ha un fallback. Se Stripe fallisce, il lead viene segnalato e vengo notificato.

## Risultati

- 95% di lavoro manuale eliminato
- Zero errori di inserimento
- Elaborazione 24/7
- 40% di chiusura più veloce

La parte migliore? Una volta costruito, funziona per sempre. Questa è la bellezza dell'automazione.`,
          category: "blog", tier: "FREE", lang: "IT", published: true,
        },
        {
          title: "Hur Jag Automatiserade Hela Klientintroduktionen med n8n",
          slug: "automatiserad-klientintroduktion-n8n",
          description: "En steg-för-steg-genomgång av pipelinen som sparade 95% manuell handläggningstid.",
          body: `Jag minns dagen då en klient skickade en PDF med 15 steg för introduktion. Varje steg involverade en annan plattform: e-post, Slack, Airtable, Google Drive, DocuSign och mer. Jag visste att det måste finnas ett bättre sätt.

## Utlösaren

Varje ny lead börjar på samma sätt: de fyller i ett Google Formulär. Den enda webhooken startar ett n8n-workflow som hanterar allt.

## Workflowet

\`\`\`
Google Form → n8n Webhook → AI Klassificerare → Airtable
  → Slack Notification → Stripe Invoice → Google Calendar
  → Gmail Sequence → Klart
\`\`\`

## Nyckelkomponenter

**AI-klassificering**: Jag använder Groqs Llama 3 för att läsa formulärsvaret och klassificera lead-typ, brådska och servicekategori.

**Villkorslogik**: Enterprise-leads får en annan e-postsekvens än frilansare. Hög brådska utlöser ett Slack-larm till min telefon.

**Felhantering**: Varje steg har en fallback. Om Stripe misslyckas markeras leadet och jag meddelas istället.

## Resultat

- 95% minskning av manuellt arbete
- Noll datainmatningsfel
- 24/7 bearbetning (de får fakturor kl 03 om de vill)
- 40% snabbare avslutningsgrad

Det bästa? När det är byggt kör det för evigt. Det är skönheten med automatisering.`,
          category: "blog", tier: "FREE", lang: "SV", published: true,
        },
        {
          title: "Web Scraping Architecture: Lessons from 3 Years of Data Collection",
          slug: "web-scraping-architecture-lessons",
          description: "Distributed scraping systems, proxy rotation, anti-detection — everything I learned building scrapers that collect millions of data points.",
          body: `After three years of building data collection systems, I've made every mistake in the book. Here's what actually works.

## The Stack

- **Playwright** for browser automation
- **Custom proxy rotator** with health checking
- **Redis queue** for job distribution
- **SQLite** for storage (surprisingly capable at scale)

## Anti-Detection

The cat-and-mouse game of web scraping never ends. Here's what I've found works:

**Browser Fingerprinting**: Randomize viewport, user agent, WebGL vendor, and font list on every session. Playwright makes this possible.

**Timing Patterns**: Human-like delays between actions. Record and replay actual human interaction patterns.

**CAPTCHA Handling**: When CAPTCHAs appear, I use a queue system that slows down and rotates proxies aggressively. Most sites give up after a few retries.

## Scaling

Horizontal scaling with Redis is the way to go. Each worker picks up a job, processes it, and reports back. If a worker dies, the job goes back to the queue.

## The One Thing I Wish I Knew

Log everything. Every request, every response, every error. When something breaks at 3am, you need to know exactly what happened.`,
          category: "blog", tier: "FREE", lang: "EN", published: true,
        },
        {
          title: "Architettura di Web Scraping: Lezioni da 3 Anni di Raccolta Dati",
          slug: "architettura-web-scraping-lezioni",
          description: "Sistemi di scraping distribuito, rotazione proxy, anti-rilevamento — tutto ciò che ho imparato.",
          body: `Dopo tre anni a costruire sistemi di raccolta dati, ho fatto ogni errore possibile. Ecco cosa funziona davvero.

## Lo Stack

- **Playwright** per automazione browser
- **Proxy rotator** con health checking
- **Redis queue** per distribuzione job
- **SQLite** per storage

## Anti-Rilevamento

Il gioco del gatto e del topo dello scraping non finisce mai:

**Browser Fingerprinting**: Randomizza viewport, user agent, vendor WebGL e font in ogni sessione.

**Pattern Temporali**: Ritardi simili a quelli umani tra le azioni. Registra e riproduci pattern di interazione reali.

**Gestione CAPTCHA**: Sistema di coda che rallenta e ruota i proxy aggressivamente.

## Scaling

Lo scaling orizzontale con Redis è la soluzione. Ogni worker prende un job, lo processa e riporta il risultato.

## Una Cosa Che Vorrei Aver Saputo

Logga tutto. Ogni richiesta, ogni risposta, ogni errore. Quando qualcosa si rompe alle 3 di notte, devi sapere esattamente cos'è successo.`,
          category: "blog", tier: "FREE", lang: "IT", published: true,
        },
        {
          title: "Web Scraping Arkitektur: Lärdomar från 3 års Datainsamling",
          slug: "web-scraping-arkitektur-lardomar",
          description: "Distribuerade skrapningssystem, proxyrotation, anti-detektion — allt jag lärt mig som bygger skrapare som samlar miljontals datapunkter.",
          body: `Efter tre år av att bygga datainsamlingssystem har jag gjort varje misstag i boken. Här är vad som faktiskt fungerar.

## Stacken

- **Playwright** för webbläsarautomation
- **Anpassad proxyrotator** med hälsokontroll
- **Redis-kö** för jobbdistribution
- **SQLite** för lagring (förvånansvärt kapabel i skala)

## Anti-Detektion

Katt-och-råtta-leken med web scraping tar aldrig slut. Här är vad som fungerar:

**Webbläsar-fingerprinting**: Randomisera viewport, user agent, WebGL-leverantör och teckensnitt i varje session. Playwright gör detta möjligt.

**Timing-mönster**: Människoliknande fördröjningar mellan handlingar. Spela in och återspela faktiska interaktionsmönster.

**CAPTCHA-hantering**: När CAPTCHA visas använder jag ett kösystem som saktar ner och roterar proxy aggressivt.

## Skalning

Horisontell skalning med Redis är vägen. Varje arbetare plockar upp ett jobb, bearbetar det och rapporterar tillbaka.

## Det Enda Jag Önskar Jag Hade Vetat

Logga allt. Varje förfrågan, varje svar, varje fel. När något går sönder kl 03 behöver du veta exakt vad som hände.`,
          category: "blog", tier: "FREE", lang: "SV", published: true,
        },
        {
          title: "Designing for AI: UX Principles for the Age of Agents",
          slug: "designing-for-ai-ux-principles",
          description: "How interface design changes when AI is the core interaction model — lessons from building agentic interfaces.",
          body: `Traditional UX patterns break when AI enters the picture. Users don't click buttons anymore — they converse, delegate, and review. Here's what I've learned designing for AI-first products.

## 1. Progressive Disclosure

Don't show every capability at once. Start with a simple input and reveal complexity as needed. The best AI interfaces feel like a conversation, not a control panel.

## 2. Confidence Indicators

Users need to know how sure the AI is about its response. A simple colored dot (green = confident, yellow = uncertain, red = guessing) makes a huge difference in trust.

## 3. The Edit Button

Every AI output needs an edit path. Let users tweak, refine, and iterate. The magic isn't in the first generation — it's in the feedback loop.

## 4. Graceful Degradation

What happens when the AI is unavailable? Cache recent responses. Show a friendly message. Let the user know what's happening. Never show a generic error.

## 5. Streaming is Non-Negotiable

If your AI takes more than 500ms, stream the response. Seeing tokens appear in real time makes the wait feel instant. It also gives users the chance to read as the response forms.

The best AI interfaces disappear. They feel like magic, not software.`,
          category: "blog", tier: "FREE", lang: "EN", published: true,
        },
        {
          title: "Progettare per l'AI: Principi UX per l'Epoca degli Agenti",
          slug: "progettare-per-ai-principi-ux",
          description: "Come il design delle interfacce cambia quando l'AI è il modello di interazione principale.",
          body: `I pattern UX tradizionali si rompono quando entra in gioco l'AI. Gli utenti non cliccano più bottoni — conversano, delegano e revisionano.

## 1. Divulgazione Progressiva

Non mostrare ogni funzionalità subito. Inizia con un input semplice e rivela la complessità gradualmente.

## 2. Indicatori di Confidenza

Gli utenti devono sapere quanto è sicura l'AI della sua risposta. Un semplice punto colorato fa una grande differenza.

## 3. Il Pulsante Modifica

Ogni output AI ha bisogno di un percorso di modifica. Lascia che gli utenti perfezionino e iterino.

## 4. Degradazione Graduale

Cosa succede quando l'AI non è disponibile? Fai cache delle risposte recenti. Mostra un messaggio amichevole.

## 5. Lo Streaming è Indispensabile

Se la tua AI impiega più di 500ms, fai streaming della risposta. Vedere i token apparire in tempo reale rende l'attesa istantanea.

Le migliori interfacce AI scompaiono. Sembrano magia, non software.`,
          category: "blog", tier: "FREE", lang: "IT", published: true,
        },
        {
          title: "Design för AI: UX-principer för Agenternas Tid",
          slug: "design-for-ai-ux-principer",
          description: "Hur gränssnittsdesign förändras när AI är den centrala interaktionsmodellen — lärdomar från att bygga agentiska gränssnitt.",
          body: `Traditionella UX-mönster bryts när AI kommer in i bilden. Användare klickar inte längre på knappar — de konverserar, delegerar och granskar. Här är vad jag lärt mig om att designa för AI-första produkter.

## 1. Progressiv Avslöjande

Visa inte alla funktioner på en gång. Börja med en enkel inmatning och avslöja komplexitet efter behov. De bästa AI-gränssnitten känns som en konversation, inte en kontrollpanel.

## 2. Förtroendeindikatorer

Användare behöver veta hur säker AI är på sitt svar. En enkel färgad prick (grön = säker, gul = osäker, röd = gissning) gör stor skillnad för förtroendet.

## 3. Redigeringsknappen

Varje AI-utdata behöver en redigeringsväg. Låt användare justera, förfina och iterera. Magin ligger inte i första generationen — den ligger i återkopplingsslingan.

## 4. Graceful Degradation

Vad händer när AI inte är tillgänglig? Cachelagra senaste svar. Visa ett vänligt meddelande. Låt användaren veta vad som händer. Visa aldrig ett generiskt fel.

## 5. Streaming är Ickeförhandlingsbart

Om din AI tar mer än 500ms, strömma svaret. Att se tokens dyka upp i realtid får väntan att kännas omedelbar.

De bästa AI-gränssnitten försvinner. De känns som magi, inte programvara.`,
          category: "blog", tier: "FREE", lang: "SV", published: true,
        },
        {
          title: "Why I Switched from Traditional CMS to AI-Powered Portfolios",
          slug: "ai-powered-portfolios",
          description: "The reasoning behind building a portfolio that thinks — and why static pages are a thing of the past.",
          body: `For years, portfolios were static galleries. Show your work, list your skills, wait for someone to email you. I wanted something different.

## The Problem with Static

A static portfolio is a brochure. It tells visitors what you've done, but it doesn't engage them. It doesn't answer their specific questions. It doesn't adapt.

## The AI Agent Approach

Each agent on this site has a specific role: the Project Agent knows every detail of my work, the Career Agent can assess job fit, the Research Agent stays current with trends.

When you ask a question, the agent dynamically assembles the answer from my actual data. No templated responses. Real, contextual answers.

## What This Unlocks

- **24/7 qualification** — Visitors get answers instantly
- **Personalized navigation** — Each visitor sees what matters to them
- **Conversion tracking** — I know exactly what questions lead to hires
- **Continuous learning** — The system gets smarter with every interaction

The future of portfolios isn't showing work. It's having conversations about work.`,
          category: "blog", tier: "FREE", lang: "EN", published: true,
        },
        {
          title: "Perché sono passato dai CMS tradizionali ai Portfolio AI",
          slug: "portfolio-potenziati-da-ai",
          description: "Il ragionamento dietro la costruzione di un portfolio che pensa — e perché le pagine statiche sono superate.",
          body: `Per anni, i portfolio sono state gallerie statiche. Mostra il tuo lavoro, elenca le tue competenze, aspetta che qualcuno ti scriva. Io volevo qualcosa di diverso.

## Il Problema dello Statico

Un portfolio statico è un brochure. Dice ai visitatori cosa hai fatto, ma non li coinvolge. Non risponde alle loro domande specifiche.

## L'Approccio Agente AI

Ogni agente su questo sito ha un ruolo specifico: l'Agente Progetti conosce ogni dettaglio del mio lavoro, l'Agente Carriera valuta il fit lavorativo.

Quando fai una domanda, l'agente assembla dinamicamente la risposta dai miei dati reali.

## Cosa Sblocca

- **Qualifica 24/7** — I visitatori ottengono risposte istantanee
- **Navigazione personalizzata** — Ogni visitatore vede ciò che conta per lui
- **Monitoraggio conversioni** — So esattamente quali domande portano a assunzioni

Il futuro dei portfolio non è mostrare lavoro. È avere conversazioni sul lavoro.`,
          category: "blog", tier: "FREE", lang: "IT", published: true,
        },
        {
          title: "Varför Jag Bytade från Traditionell CMS till AI-drivna Portfolios",
          slug: "varfor-jag-bytade-till-ai-portfolios",
          description: "Resonemanget bakom att bygga ett portfolio som tänker — och varför statiska sidor är ett minne blott.",
          body: `I åratal var portfolios statiska gallerier. Visa ditt arbete, lista dina färdigheter, vänta på att någon mejlar dig. Jag ville ha något annorlunda.

## Problemet med Statiskt

Ett statiskt portfolio är en broschyr. Det berättar för besökare vad du gjort, men det engagerar dem inte. Det svarar inte på deras specifika frågor. Det anpassar sig inte.

## AI-agentansatsen

Varje agent på denna webbplats har en specifik roll: Projektagenten kan alla detaljer om mitt arbete, Karriäragenten kan bedöma jobbpassning.

När du ställer en fråga, sätter agenten dynamiskt ihop svaret från mina faktiska data. Inga mallade svar. Verkliga, kontextuella svar.

## Vad Detta Möjliggör

- **24/7 kvalificering** — Besökare får svar direkt
- **Personlig navigering** — Varje besökare ser vad som är relevant för dem
- **Konverteringsspårning** — Jag vet exakt vilka frågor som leder till anställningar

Framtidens portfolios handlar inte om att visa arbete. Det handlar om att ha samtal om arbete.`,
          category: "blog", tier: "FREE", lang: "SV", published: true,
        },

        // ===== SUPPORTER — Prompts & Tutorials =====
        {
          title: "Midjourney Prompt Library: Cinematic Portraits Vol.1",
          slug: "midjourney-cinematic-portraits-vol1",
          description: "20 curated cinematic portrait prompts with mood, lighting, and composition breakdowns. For Midjourney V6+.",
          body: `This is a collection of portrait prompts I've refined over months of experimentation. Each comes with notes on why it works.

## Golden Hour Portrait
\`\`\`
Cinematic golden hour portrait, warm amber sidelight, soft bokeh background, 85mm lens, shallow depth of field, natural skin texture, award-winning photography, film grain --ar 3:4 --style raw --s 600 --v 6.1
\`\`\`
**Why it works**: The 85mm focal length creates natural compression. Golden hour provides warm, flattering light. Style raw avoids over-processing.

## Moody Street Portrait
\`\`\`
Moody street portrait at night, neon sign lighting, rain reflections on pavement, cinematic shadows, Fujifilm Provia color grade, grainy texture, urban atmosphere --ar 4:5 --style raw --s 500 --v 6.1
\`\`\`
**Why it works**: Neon + rain creates natural color contrast. Provia film simulation adds realistic color science.

## Natural Light Studio
\`\`\`
Studio portrait, large soft window light from left, minimalist background, natural makeup, catch lights in eyes, editorial photography style, medium format look --ar 4:5 --style raw --s 400 --v 6.1
\`\`\`
**Why it works**: Large window light mimics a softbox. The catch light in the eyes adds life. Medium format reference changes the depth rendering.

## Dramatic Profile
\`\`\`
Dramatic profile portrait, Rembrandt lighting, dark background, single hard light source, strong shadows, textured skin, black and white, high contrast, film noir aesthetic --ar 3:4 --style raw --s 700 --v 6.1
\`\`\`

## Environmental Portrait
\`\`\`
Environmental portrait in a workshop, morning light through dusty windows, tools in background, working clothes, candid moment, documentary style, warm tones --ar 16:9 --style raw --s 500 --v 6.1
\`\`\`

## Pro Tips

1. **Start with lighting**, not subject. The quality of light determines 80% of the result.
2. **Use aspect ratio as a creative choice**. 4:5 is intimate, 16:9 is cinematic, 1:1 is classic.
3. **Style raw is your friend** for realistic portraits. Style expressive for artistic ones.
4. **Stack lighting descriptors** — "soft window light" + "fill from left" + "rim light from behind" creates complex, professional lighting setups.

Each prompt above has been tested and produces consistent, high-quality results. Adjust the seed parameter (--s) to taste.`,
          category: "prompts", tier: "SUPPORTER", lang: "EN", published: true,
        },
        {
          title: "Libreria Prompt Midjourney: Ritratti Cinematografici Vol.1",
          slug: "midjourney-ritratti-cinematografici-vol1",
          description: "20 prompt per ritratti cinematografici curati con breakdown di mood, luce e composizione.",
          body: `Questa è una collezione di prompt per ritratti che ho perfezionato in mesi di sperimentazione.

## Ritratto Golden Hour
\`\`\`
Ritratto cinematografico golden hour, calda luce laterale ambrata, sfondo soft bokeh, obiettivo 85mm, profondità di campo ridotta, texture naturale della pelle --ar 3:4 --style raw --s 600 --v 6.1
\`\`\`

## Ritratto Notturno
\`\`\`
Ritratto notturno, illuminazione al neon, riflessi di pioggia sull'asfalto, ombre cinematografiche, grana, atmosfera urbana --ar 4:5 --style raw --s 500 --v 6.1
\`\`\`

## Studio Luce Naturale
\`\`\`
Ritratto in studio, grande finestra con luce soffusa da sinistra, sfondo minimalista, occhi con riflessi, stile editoriale --ar 4:5 --style raw --s 400 --v 6.1
\`\`\`

## Profilo Drammatico
\`\`\`
Ritratto di profilo drammatico, illuminazione Rembrandt, sfondo scuro, singola fonte di luce dura, ombre forti, bianco e nero, alto contrasto --ar 3:4 --style raw --s 700 --v 6.1
\`\`\`

## Suggerimenti

1. Inizia dalla **luce**, non dal soggetto
2. Usa l'aspect ratio come scelta creativa
3. Style raw è ideale per ritratti realistici
4. Combina descrittori di luce per setup professionali`,
          category: "prompts", tier: "SUPPORTER", lang: "IT", published: true,
        },
        {
          title: "Midjourney Promptbibliotek: Filmiska Porträtt Vol.1",
          slug: "midjourney-filmiska-portratt-vol1",
          description: "20 kuraterade filmiska porträttprompt med mood, ljussättning och kompositionsanalys. För Midjourney V6+.",
          body: `Detta är en samling porträttprompt som jag finslipat under månader av experimenterande. Varje prompt kommer med anteckningar om varför den fungerar.

## Golden Hour-porträtt
\`\`\`
Filmisk golden hour-porträtt, varm bärnstensfärgad sidoljus, mjuk bokeh-bakgrund, 85mm objektiv, grunt skärpedjup, naturlig hudtextur, prisbelönt fotografi, filmkorn --ar 3:4 --style raw --s 600 --v 6.1
\`\`\`
**Varför det fungerar**: 85mm brännvidd skapar naturlig kompression. Golden hour ger varmt, smickrande ljus. Style raw undviker överbearbetning.

## Stämningsfullt Gatuporterätt
\`\`\`
Stämningsfullt gatuporterätt på natten, neonskyltbelysning, regnreflektioner på asfalt, filmiska skuggor, Fujifilm Provia färggradering, kornig textur, urban atmosfär --ar 4:5 --style raw --s 500 --v 6.1
\`\`\`

## Naturlig Ljussättning Studio
\`\`\`
Studio porträtt, stort mjukt fönsterljus från vänster, minimalistisk bakgrund, naturlig makeup, fångstljus i ögonen, redaktionell fotostil, mellanformat look --ar 4:5 --style raw --s 400 --v 6.1
\`\`\`

## Dramatisk Profil
\`\`\`
Dramatiskt profilporträtt, Rembrandt-belysning, mörk bakgrund, enkel hård ljuskälla, starka skuggor, texturerad hud, svartvitt, hög kontrast, film noir-estetik --ar 3:4 --style raw --s 700 --v 6.1
\`\`\`

## Proffstips

1. **Börja med ljus**, inte motiv. Ljusets kvalitet bestämmer 80% av resultatet.
2. **Använd bildförhållande som kreativt val**. 4:5 är intimt, 16:9 är filmiskt.
3. **Style raw är din vän** för realistiska porträtt.
4. **Stapla ljusbeskrivningar** — "mjukt fönsterljus" + "fyllnad från vänster" skapar komplexa belysningsuppsättningar.`,
          category: "prompts", tier: "SUPPORTER", lang: "SV", published: true,
        },
        {
          title: "Runway Gen-3 Alpha: Complete Prompting Guide",
          slug: "runway-gen3-prompting-guide",
          description: "Advanced techniques for generating cinema-quality video with Runway Gen-3 Alpha. Camera moves, style consistency, and common pitfalls.",
          body: `Runway Gen-3 Alpha is a paradigm shift in AI video. Here's how to get the most out of it.

## Camera Movement Prompts

\`\`\`
Slow dolly push through foggy forest, cinematic tracking shot, dramatic reveal, 4K ultra realistic, depth of field, natural morning light, smooth 24fps motion
\`\`\`

\`\`\`
Orbiting camera around subject, 360 degree slow rotation, cinematic lighting, shallow depth of field, professional grade, smooth motion blur
\`\`\`

\`\`\`
Top-down establishing shot, slowly descending, bird's eye view, wide landscape, cinematic, clouds casting shadows on terrain
\`\`\`

## Style Consistency

To maintain visual consistency across multiple clips:

1. **Use reference images** — Upload a frame from your first generation as style reference
2. **Repeat key descriptors** — Keep lighting, camera, and mood descriptors identical
3. **Maintain aspect ratio** — Switching ratios breaks continuity
4. **Color grade consistently** — Use similar color terms across all prompts

## Common Pitfalls

- **Fast motion breaks coherence** — Keep motion descriptors moderate
- **Complex scenes lose focus** — Simplify backgrounds for complex actions
- **Multiple subjects confuse the model** — Focus on one primary subject
- **Extreme close-ups can distort** — Medium shots are more stable

## Advanced Technique: Prompt Chaining

Generate a scene, then use the last frame as input for the next generation. This creates seamless transitions between clips.`,
          category: "prompts", tier: "SUPPORTER", lang: "EN", published: true,
        },
        {
          title: "Runway Gen-3 Alpha: Guida Completa ai Prompt",
          slug: "runway-gen3-guida-completa-prompt",
          description: "Tecniche avanzate per video di qualità cinematografica con Runway Gen-3 Alpha.",
          body: `Runway Gen-3 Alpha è un cambio di paradigma nel video AI.

## Movimenti di Camera

\`\`\`
Slow dolly push attraverso foresta nebbiosa, cinematic tracking shot, rivelazione drammatica, 4K ultra realistico, luce mattutina naturale, motion 24fps fluido
\`\`\`

\`\`\`
Camera orbitante intorno al soggetto, rotazione lenta 360 gradi, illuminazione cinematografica, profondità di campo ridotta
\`\`\`

## Consistenza Stilistica

1. Usa **immagini di riferimento** dal primo clip
2. Ripeti **descrittori chiave** identici
3. Mantieni lo stesso **aspect ratio**
4. **Grading colore** coerente tra clip

## Errori Comuni

- Il movimento veloce rompe la coerenza
- Scene complesse perdono il focus
- Soggetti multipli confondono il modello
- Primissimi piani possono distorcere`,
          category: "prompts", tier: "SUPPORTER", lang: "IT", published: true,
        },
        {
          title: "Runway Gen-3 Alpha: Komplett Promptguide",
          slug: "runway-gen3-komplett-promptguide",
          description: "Avancerade tekniker för att generera filmkvalitetsvideo med Runway Gen-3 Alpha. Kamerarörelser, stilkonstans och vanliga fallgropar.",
          body: `Runway Gen-3 Alpha är ett paradigmskifte inom AI-video. Här är hur du får ut det mesta av det.

## Kamerarörelser

\`\`\`
Långsam dolly-in genom dimmig skog, filmisk tracking shot, dramatisk avslöjning, 4K ultrarealistisk, skärpedjup, naturligt morgonljus, jämn 24fps-rörelse
\`\`\`

\`\`\`
Kamera som kretsar runt motiv, 360 graders långsam rotation, filmisk belysning, grunt skärpedjup, professionell kvalitet, jämn rörelseoskärpa
\`\`\`

## Stilkonsistens

För att bibehålla visuell konsistens över flera klipp:

1. **Använd referensbilder** — Ladda upp en bildruta från din första generation som stilreferens
2. **Upprepa nyckelbeskrivningar** — Håll ljus-, kamera- och stämningsbeskrivningar identiska
3. **Behåll bildförhållande** — Att byta förhållande bryter kontinuiteten
4. **Färggradera konsekvent** — Använd liknande färgtermer i alla prompt

## Vanliga Fallgropar

- **Snabb rörelse bryter koherens** — Håll rörelsebeskrivningar måttliga
- **Komplexa scener tappar fokus** — Förenkla bakgrunder för komplexa handlingar
- **Flera motiv förvirrar modellen** — Fokusera på ett primärt motiv
- **Extrema närbilder kan förvränga** — Mellanbilder är stabilare

## Avancerad Teknik: Promptkedjor

Generera en scen, använd sedan den sista bildrutan som indata för nästa generation. Detta skapar sömlösa övergångar mellan klipp.`,
          category: "prompts", tier: "SUPPORTER", lang: "SV", published: true,
        },
        {
          title: "10 n8n Production Workflows I Run Daily",
          slug: "n8n-production-workflows-daily",
          description: "Real workflows I use every day — from email processing to social media automation.",
          body: `Here are the workflows I actually run in production. No theory, just working code.

## 1. Email Triage

Every email gets classified by AI: urgent client, newsletter, spam, or follow-up. Urgent emails trigger Slack alerts. Newsletters get archived. Follow-ups get added to my task list.

## 2. Social Media Cross-Poster

Write once, publish everywhere. A single Google Doc triggers posting to LinkedIn, Twitter/X, and Medium with platform-optimized formatting.

## 3. Invoice Reminder System

If a Stripe invoice remains unpaid for 5 days, the system sends a polite reminder. At 10 days, it escalates to my phone. At 15 days, it pauses the service.

## 4. Client Report Generator

Weekly, the system pulls data from multiple sources (analytics, sales, support tickets) and generates a PDF report sent automatically to each client.

## 5. Content Backup Pipeline

Every piece of content I create (blog posts, prompts, code snippets) gets automatically backed up to GitHub, Google Drive, and a local NAS.

## 6. YouTube to Blog Transcriber

New uploads trigger transcription via Whisper, AI rewriting into blog format, and publishing to the site. Saves 2-3 hours per video.

## 7. Meeting Notes Processor

Calendar events with notes attached get processed: summary extraction, task creation in Todoist, and归档 to Notion.

## 8. Uptime Monitor with Auto-Remediation

Every 5 minutes, check my services. If something is down, try restarting. If that fails, alert me with a screenshot of the error.

## 9. Lead Qualification Pipeline

New leads from the contact form get classified by AI, enriched with LinkedIn data, and ranked by priority. High-priority leads get instant SMS.

## 10. Personal Finance Aggregator

Bank transactions get pulled daily, categorized by AI, and visualized in a dashboard. Monday morning I get a spending summary.

Each workflow is built with error handling, logging, and monitoring. They run 24/7 on a $5 VPS.`,
          category: "tutorials", tier: "SUPPORTER", lang: "EN", published: true,
        },
        {
          title: "10 Workflow n8n che Eseguo Ogni Giorno in Produzione",
          slug: "n8n-workflow-produzione-giornalieri",
          description: "Workflow reali che uso ogni giorno — dalla gestione email all'automazione social.",
          body: `Ecco i workflow che eseguo realmente in produzione. Nessuna teoria, solo codice funzionante.

## 1. Triage Email

Ogni email viene classificata dall'AI: cliente urgente, newsletter, spam o follow-up.

## 2. Cross-Poster Social

Scrivi una volta, pubblica ovunque. Un singolo Google Doc attiva la pubblicazione su LinkedIn, Twitter/X e Medium.

## 3. Promemoria Fatture

Se una fattura Stripe rimane non pagata per 5 giorni, il sistema invia un promemoria educato.

## 4. Generatore Report Clienti

Settimanalmente, il sistema raccoglie dati da più fonti e genera un PDF inviato automaticamente.

## 5. Backup Contenuti

Ogni contenuto che creo viene automaticamente salvato su GitHub, Google Drive e NAS locale.

## 6. YouTube a Blog

Nuovi upload attivano trascrizione via Whisper, riscrittura AI in formato blog e pubblicazione.

## 7. Processore Note Riunioni

Le note delle riunioni vengono elaborate: estrazione riassunto, creazione task in Todoist.

## 8. Monitor Uptime

Ogni 5 minuti controllo i servizi. Se qualcosa è giù, provo a riavviare.

## 9. Qualifica Lead

Nuovi lead dal form contatti vengono classificati dall'AI, arricchiti con dati LinkedIn.

## 10. Finanza Personale

Le transazioni bancarie vengono categorizzate dall'AI e visualizzate in una dashboard.`,
          category: "tutorials", tier: "SUPPORTER", lang: "IT", published: true,
        },
        {
          title: "10 n8n Produktionsworkflows Jag Kör Dagligen",
          slug: "n8n-produktionsworkflows-dagliga",
          description: "Verkliga workflows jag använder varje dag — från e-posthantering till social media-automation.",
          body: `Här är workflows jag faktiskt kör i produktion. Ingen teori, bara fungerande kod.

## 1. E-posttriage

Varje e-post klassificeras av AI: brådskande klient, nyhetsbrev, skräp eller uppföljning. Brådskande e-post utlöser Slack-larm. Nyhetsbrev arkiveras.

## 2. Social Media-korspublicering

Skriv en gång, publicera överallt. Ett enda Google Doc utlöser publicering till LinkedIn, Twitter/X och Medium med plattformsoptimerad formatering.

## 3. Fakturapåminnelsesystem

Om en Stripe-faktura förblir obetald i 5 dagar skickar systemet en artig påminnelse. Vid 10 dagar eskalerar det till min telefon. Vid 15 dagar pausas tjänsten.

## 4. Klientrapportgenerator

Varje vecka hämtar systemet data från flera källor och genererar en PDF-rapport som skickas automatiskt till varje klient.

## 5. Innehållsbackup-pipeline

Varje innehåll jag skapar (blogginlägg, prompt, kodavsnitt) säkerhetskopieras automatiskt till GitHub, Google Drive och lokal NAS.

## 6. YouTube till Blogg-transkribering

Nya uppladdningar utlöser transkribering via Whisper, AI-omskrivning till bloggformat och publicering.

## 7. Mötesanteckningsprocessor

Kalenderhändelser med anteckningar bearbetas: sammanfattningsextraktion, uppgiftsskapande i Todoist.

## 8. Upptidsmonitor med automatisk åtgärd

Var 5:e minut kontrolleras mina tjänster. Om något är nere, försök omstart. Om det misslyckas, larma mig med skärmdump.

## 9. Leadkvalificeringspipeline

Nya leads från kontaktformuläret klassificeras av AI, berikas med LinkedIn-data och rangordnas efter prioritet.

## 10. Personlig ekonomiskontroll

Banktransaktioner hämtas dagligen, kategoriseras av AI och visualiseras i en dashboard.

Varje workflow är byggd med felhantering, loggning och övervakning. De körs 24/7 på en $5 VPS.`,
          category: "tutorials", tier: "SUPPORTER", lang: "SV", published: true,
        },
        {
          title: "DALL·E 3 Advanced Prompt Engineering",
          slug: "dalle3-advanced-prompt-engineering",
          description: "Structure, parameters, and techniques for getting exactly what you want from DALL·E 3.",
          body: `DALL·E 3 understands natural language better than any image model before it. But there's an art to getting exactly what you want.

## The Prompt Structure

\`\`\`
[SUBJECT] + [ACTION/POSE] + [ENVIRONMENT] + [LIGHTING] + [STYLE] + [COLOR PALETTE] + [MOOD] + [COMPOSITION]
\`\`\`

## Example

\`\`\`
A woman in her 30s with freckles, sitting at a vintage coffee shop window, reading a worn paperback, warm afternoon light streaming in, impressionist painting style, earth tones with pops of amber, contemplative mood, rule of thirds composition, visible brush strokes
\`\`\`

## Parameters That Work

| Element | What to specify |
|---------|----------------|
| Lighting | golden hour, soft diffused, dramatic side, neon, candlelight |
| Style | photorealism, oil painting, vector art, minimalist, vaporwave |
| Mood | melancholic, energetic, serene, mysterious, nostalgic |
| Composition | close-up, wide shot, Dutch angle, bird's eye, worm's eye |
| Color | complementary, monochrome, pastel, vibrant, earth tones |

## Techniques

**Negative Prompting**: Describe what you DON'T want. "No text, no watermarks, no people in background, no blur"

**Style Chaining**: Reference art styles in combination. "Studio Ghibli backgrounds with realism character design and Moebius linework"

**Atmosphere First**: Describe the atmosphere before anything else. "Foggy morning in Tokyo" as a prompt starter sets the entire mood.

## Common Mistakes

1. **Overcrowding** — More than 5-6 elements causes confusion
2. **Contradictory descriptors** — "Bright sunlight" + "moody shadows" confuses the model
3. **Abstract concepts** — "Innovation" or "synergy" don't generate well
4. **Mixed styles** — Don't combine "photorealistic" with "watercolor"`,
          category: "prompts", tier: "SUPPORTER", lang: "EN", published: true,
        },
        {
          title: "DALL·E 3: Ingegneria Avanzata dei Prompt",
          slug: "dalle3-ingegneria-avanzata-prompt",
          description: "Struttura, parametri e tecniche per ottenere esattamente ciò che vuoi da DALL·E 3.",
          body: `DALL·E 3 capisce il linguaggio naturale meglio di qualsiasi modello prima di lui.

## La Struttura del Prompt

\`\`\`
[SOGGETTO] + [AZIONE/POSA] + [AMBIENTE] + [LUCE] + [STILE] + [PALETTA COLORI] + [MOOD] + [COMPOSIZIONE]
\`\`\`

## Parametri che Funzionano

| Elemento | Cosa specificare |
|----------|-----------------|
| Luce | golden hour, soft diffused, dramatic side, neon |
| Stile | photorealism, oil painting, vector art, minimal |
| Mood | malinconico, energico, sereno, misterioso |
| Composizione | close-up, wide shot, Dutch angle |
| Colore | complementari, monocromatico, pastello |

## Tecniche

**Prompt Negativo**: Descrivi cosa NON vuoi. "No text, no watermark"

**Style Chaining**: Combina stili artistici. "Sfondi Studio Ghibli con design characters realism"

## Errori Comuni

1. Troppi elementi (5-6 max)
2. Descrittori contraddittori
3. Concetti astratti
4. Stili misti`,
          category: "prompts", tier: "SUPPORTER", lang: "IT", published: true,
        },
        {
          title: "DALL·E 3 Avancerad Promptteknik",
          slug: "dalle3-avancerad-promptteknik",
          description: "Struktur, parametrar och tekniker för att få exakt vad du vill ha från DALL·E 3.",
          body: `DALL·E 3 förstår naturligt språk bättre än någon bildmodell före den. Men det finns en konst i att få exakt vad du vill ha.

## Promptstrukturen

\`\`\`
[SUBJEKT] + [HANDLING/POSITION] + [MILJÖ] + [LJUSSÄTTNING] + [STIL] + [FÄRGPALETT] + [STÄMNING] + [KOMPOSITION]
\`\`\`

## Parametrar Som Fungerar

| Element | Vad du ska specificera |
|---------|----------------------|
| Ljussättning | golden hour, mjukt diffust, dramatisk sida, neon |
| Stil | fotorealism, oljemålning, vektorkonst, minimalistisk |
| Stämning | melankolisk, energisk, fridfull, mystisk, nostalgisk |
| Komposition | närbild, vidvinkel, Dutch angle, fågelperspektiv |
| Färg | komplementär, monokrom, pastell, vibrerande |

## Tekniker

**Negativ Promptning**: Beskriv vad du INTE vill ha. "Ingen text, inga vattenstämplar, inga personer i bakgrunden"

**Stilkedjor**: Referera konststilar i kombination. "Studio Ghibli-bakgrunder med realistisk karaktärsdesign"

**Atmosfär Först**: Beskriv atmosfären före allt annat. "Dimmi morgon i Tokyo" sätter hela stämningen direkt.

## Vanliga Misstag

1. **Överbelastning** — Mer än 5-6 element skapar förvirring
2. **Motsägelsefulla beskrivningar** — "Starkt solljus" + "stämningsfulla skuggor" förvirrar modellen
3. **Abstrakta koncept** — "Innovation" eller "synergi" genereras inte bra
4. **Blandade stilar** — Kombinera inte "fotorealistisk" med "akvarell"`,
          category: "prompts", tier: "SUPPORTER", lang: "SV", published: true,
        },

        // ===== PRO — Projects & Advanced =====
        {
          title: "Full Automation Pipeline: Lead to Invoice (Complete Blueprint)",
          slug: "lead-to-invoice-pipeline-blueprint",
          description: "Complete production workflow connecting 7 services with AI classification, error handling, and monitoring.",
          body: `## Architecture Overview

\`\`\`
Google Forms → n8n Orchestrator → AI Classification → Multi-route Pipeline
  ├── Enterprise: → Slack → Airtable → Stripe → Calendar → Gmail
  ├── Freelance:  → Discord → Notion → PayPal → Calendly
  └── Unknown:    → Manual Review Queue → SMS Alert
\`\`\`

## Components

### 1. Orchestrator (n8n)

The central nervous system. Every webhook, every conditional, every error handler lives here.

### 2. AI Classification (Groq Llama-3)

\`\`\`typescript
const classification = await classifyLead({
  formData,
  categories: ['enterprise', 'freelance', 'partner'],
  urgency: ['low', 'medium', 'high', 'critical'],
  confidence: 0.7, // minimum threshold
});
\`\`\`

### 3. CRM (Airtable)

All leads are stored in Airtable with status tracking, notes, and pipeline stage.

### 4. Payments (Stripe)

Automatic invoice generation with proper tax handling and receipt delivery.

### 5. Calendar (Google Calendar)

Meeting scheduling with buffer times and prep reminders.

### 6. Email (Gmail API)

Contextual sequences based on lead type and behavior.

### 7. Monitoring (Custom Dashboard)

Real-time metrics, error logs, and weekly performance reports.

## Error Handling

Every node has a fallback. If Stripe fails, the lead goes to a "payment pending" state. If AI classification fails, it defaults to manual review.

\`\`\`typescript
try {
  await createStripeInvoice(lead);
} catch (error) {
  await markForManualReview(lead);
  await notifyAdmin('Stripe failed for lead: ' + lead.id);
  // Continue processing — don't block the pipeline
}
\`\`\`

## Deployment

The entire pipeline runs on a $10/month VPS with automatic restarts and database backups. The average lead-to-invoice time dropped from 3 days to 12 minutes.`,
          category: "projects", tier: "PRO", lang: "EN", published: true,
        },
        {
          title: "Pipeline Automazione Completa: Da Lead a Fattura",
          slug: "pipeline-automazione-lead-fattura",
          description: "Workflow completo in produzione che connette 7 servizi con classificazione AI e monitoraggio.",
          body: `## Architettura

\`\`\`
Google Forms → n8n → Classificazione AI → Multi-route
  ├── Enterprise: → Slack → Airtable → Stripe → Calendar
  ├── Freelance:  → Discord → Notion → PayPal
  └── Sconosciuto: → Coda Revisione Manuale
\`\`\`

## Componenti

### 1. Orchestratore (n8n)
Il sistema nervoso centrale. Ogni webhook, condizione e gestore errori vive qui.

### 2. Classificazione AI (Groq Llama-3)
Analisi del form con categorie enterprise, freelance, partner e urgenza.

### 3. CRM (Airtable)
Tutti i lead con status, note e fase pipeline.

### 4. Pagamenti (Stripe)
Fatture automatiche con gestione tasse e ricevute.

### 5. Monitoraggio
Metriche real-time, log errori, report settimanali.

## Gestione Errori
Ogni nodo ha un fallback. Se Stripe fallisce, il lead va in "pagamento in sospeso".

## Deployment
L'intera pipeline gira su un VPS da 10$/mese. Il tempo medio da lead a fattura è passato da 3 giorni a 12 minuti.`,
          category: "projects", tier: "PRO", lang: "IT", published: true,
        },
        {
          title: "Komplett Automationspipeline: Lead till Faktura",
          slug: "komplett-automationspipeline-lead-faktura",
          description: "Komplett produktionsworkflow som kopplar ihop 7 tjänster med AI-klassificering, felhantering och övervakning.",
          body: `## Arkitekturöversikt

\`\`\`
Google Forms → n8n Orkestrator → AI-klassificering → Multi-rutt Pipeline
  ├── Enterprise: → Slack → Airtable → Stripe → Kalender → Gmail
  ├── Frilans:    → Discord → Notion → PayPal → Calendly
  └── Okänd:      → Manuell Granskningskö → SMS-larm
\`\`\`

## Komponenter

### 1. Orkestrator (n8n)
Det centrala nervsystemet. Varje webhook, varje villkor, varje felhanterare bor här.

### 2. AI-klassificering (Groq Llama-3)
Analyserar formuläret med kategorier enterprise, frilans, partner och brådska.

### 3. CRM (Airtable)
Alla leads lagras i Airtable med statusspårning, anteckningar och pipeline-steg.

### 4. Betalningar (Stripe)
Automatisk fakturering med korrekt skattehantering och kvittoleverans.

### 5. Kalender (Google Kalender)
Mötesbokning med bufferttider och påminnelser.

### 6. E-post (Gmail API)
Kontextuella sekvenser baserade på lead-typ och beteende.

### 7. Övervakning (Anpassad Dashboard)
Realtidsmetrik, felloggar och veckovisa prestandarapporter.

## Felhantering
Varje nod har en fallback. Om Stripe misslyckas går leadet till "betalning väntande"-status.

## Driftsättning
Hela pipelinen körs på en $10/månad VPS. Genomsnittlig tid från lead till faktura sjönk från 3 dagar till 12 minuter.`,
          category: "projects", tier: "PRO", lang: "SV", published: true,
        },
        {
          title: "Advanced Scraping Framework: Production-Grade Architecture",
          slug: "advanced-scraping-framework-architecture",
          description: "Full source code and architecture for a distributed scraping system with anti-detection, queue management, and data pipelines.",
          body: `## Framework Architecture

\`\`\`
[Job Queue (Redis)] → [Proxy Manager] → [Worker Pool] → [Data Pipeline]
                                            ↓
                                  [Health Monitor] → [Alert System]
\`\`\`

## Core Components

### Proxy Manager

\`\`\`typescript
interface ProxyConfig {
  url: string;
  country: string;
  speed: number;
  successRate: number;
  lastTested: Date;
}

class ProxyManager {
  private proxies: ProxyConfig[] = [];
  private blacklist: Set<string> = new Set();

  async getOptimal(country?: string): Promise<ProxyConfig> {
    // Returns the fastest, most reliable proxy
  }

  async reportFailure(proxy: ProxyConfig): Promise<void> {
    // Track failures, blacklist after threshold
  }
}
\`\`\`

### Worker Pool

\`\`\`typescript
class ScraperWorker {
  private browser: Browser;
  private context: BrowserContext;

  async process(job: ScrapeJob): Promise<ScrapeResult> {
    const proxy = await proxyManager.getOptimal(job.country);
    this.context = await this.browser.newContext({
      proxy: { server: proxy.url },
      viewport: { width: random(1024, 1920), height: random(768, 1080) },
      userAgent: randomUserAgent(),
    });
    // ... processing logic
  }
}
\`\`\`

### Anti-Detection Features

1. **Browser Fingerprint Randomization**: Viewport, user agent, WebGL, fonts, timezone
2. **Human Behavior Simulation**: Random delays, scroll patterns, mouse movements
3. **Session Management**: Automatic cookie and cache rotation
4. **CAPTCHA Handling**: Detection + queue backpressure + manual queue

## Performance

| Metric | Value |
|--------|-------|
| Concurrent workers | 10-50 (configurable) |
| Pages/hour (single worker) | ~500 |
| Success rate | 97-99% |
| Proxy rotation interval | Every 3-5 requests |
| Memory per worker | ~80MB |

This framework powers all my data collection projects and handles millions of requests monthly.`,
          category: "projects", tier: "PRO", lang: "EN", published: true,
        },
        {
          title: "Framework di Scraping Avanzato: Architettura Production-Grade",
          slug: "framework-scraping-avanzato-architettura",
          description: "Codice sorgente e architettura per un sistema di scraping distribuito con anti-rilevamento.",
          body: `## Architettura del Framework

\`\`\`
[Job Queue (Redis)] → [Proxy Manager] → [Worker Pool] → [Data Pipeline]
\`\`\`

## Componenti Core

### Proxy Manager
Seleziona proxy veloci e affidabili. Traccia fallimenti. Blacklist automatica.

### Worker Pool
Workers Playwright con proxy randomizzati, fingerprint browser variabili.

### Anti-Rilevamento

1. Randomizzazione fingerprint browser
2. Simulazione comportamento umano
3. Rotazione automatica cookie/cache
4. Gestione CAPTCHA

## Performance

| Metrica | Valore |
|---------|--------|
| Workers concorrenti | 10-50 |
| Pagine/ora (singolo worker) | ~500 |
| Tasso successo | 97-99% |
| Rotazione proxy | Ogni 3-5 richieste |

Questo framework alimenta tutti i miei progetti di raccolta dati.`,
          category: "projects", tier: "PRO", lang: "IT", published: true,
        },
        {
          title: "Avancerat Skrapningsramverk: Produktionsredo Arkitektur",
          slug: "avancerat-skrapningsramverk-arkitektur",
          description: "Full källkod och arkitektur för ett distribuerat skrapningssystem med anti-detektion, köhantering och datapipelines.",
          body: `## Ramverksarkitektur

\`\`\`
[Job Queue (Redis)] → [Proxy Manager] → [Worker Pool] → [Data Pipeline]
                                            ↓
                                  [Health Monitor] → [Alert System]
\`\`\`

## Kärnkomponenter

### Proxy Manager
Väljer snabba och pålitliga proxyservrar. Spårar misslyckanden. Automatisk svartlistning.

### Worker Pool
Playwright-arbetare med randomiserade proxyservrar, variabla webbläsar-fingeravtryck.

### Anti-Detektion

1. **Webbläsar Fingerprint-randomisering**: Viewport, user agent, WebGL, teckensnitt, tidszon
2. **Mänskligt Beteende-simulering**: Slumpmässiga fördröjningar, scrollmönster, musrörelser
3. **Sessionshantering**: Automatisk cookie- och cache-rotation
4. **CAPTCHA-hantering**: Detektion + kö-motryck + manuell kö

## Prestanda

| Metrik | Värde |
|--------|-------|
| Samtidiga arbetare | 10-50 (konfigurerbart) |
| Sidor/timme (en arbetare) | ~500 |
| Framgångsfrekvens | 97-99% |
| Proxyrotation | Var 3-5 förfrågan |

Detta ramverk driver alla mina datainsamlingsprojekt och hanterar miljontals förfrågningar månatligen.`,
          category: "projects", tier: "PRO", lang: "SV", published: true,
        },
        {
          title: "AI Analytics Dashboard: Full-Stack Implementation",
          slug: "ai-analytics-dashboard-implementation",
          description: "Complete code for a real-time analytics dashboard with natural language querying powered by a custom LLM pipeline.",
          body: `## Stack

- **Frontend**: Next.js 16 + Tailwind + Recharts (real-time charts)
- **Backend**: Python FastAPI + WebSocket + Redis
- **AI**: Groq Llama-3 + RAG pipeline on company data
- **Database**: PostgreSQL (analytics) + Redis (cache + real-time)

## Real-time Dashboard

\`\`\`typescript
// Frontend: Real-time chart component
function RevenueChart() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com/realtime');
    ws.onmessage = (event) => {
      const point = JSON.parse(event.data);
      setData(prev => [...prev.slice(-100), point]); // Keep last 100 points
    };
    return () => ws.close();
  }, []);

  return <RealtimeChart data={data} />;
}
\`\`\`

## Natural Language Queries

\`\`\`python
# Backend: Natural language to SQL
class NLQueryEngine:
    def __init__(self):
        self.schema = self.load_schema()
        self.llm = GroqLLM(model="llama3-70b")

    def query(self, question: str) -> QueryResult:
        # 1. Classify intent (chart vs table vs summary)
        # 2. Generate SQL from natural language
        # 3. Execute SQL against PostgreSQL
        # 4. Generate human-readable explanation
        # 5. Return result + visualization config
        pass
\`\`\`

## Key Features

### Real-time Streaming
WebSocket connections stream new data points as they arrive. Charts update in real-time with smooth animations.

### AI Insights
The LLM automatically detects anomalies, trends, and patterns. "Revenue dropped 15% this week compared to last" — surfaced without manual analysis.

### Custom Reports
Users can save any query as a report. Reports are emailed daily/weekly/monthly with updated charts and AI summary.

## Deployment

\`\`\`yaml
# docker-compose.yml
services:
  api: python app.py
  frontend: next build && next start
  redis: redis:alpine
  postgres: postgres:16
\`\`\`

This dashboard handles 50+ concurrent users with sub-100ms query times.`,
          category: "projects", tier: "PRO", lang: "EN", published: true,
        },
        {
          title: "Dashboard Analisi AI: Implementazione Full-Stack",
          slug: "dashboard-analisi-ai-full-stack",
          description: "Codice completo per una dashboard analytics in tempo reale con query in linguaggio naturale.",
          body: `## Stack

- **Frontend**: Next.js 16 + Tailwind + Recharts
- **Backend**: Python FastAPI + WebSocket + Redis
- **AI**: Groq Llama-3 + RAG pipeline
- **Database**: PostgreSQL + Redis

## Dashboard in Tempo Reale

Componenti React con WebSocket per streaming dati. Grafici si aggiornano in real-time con animazioni fluide.

## Query in Linguaggio Naturale

Engine Python che converte domande in SQL, esegue query, genera spiegazioni.

## Funzionalità Chiave

### Streaming Real-time
Connessioni WebSocket inviano nuovi dati. Grafici si aggiornano istantaneamente.

### Insight AI
L'LLM rileva automaticamente anomalie, trend e pattern.

### Report Personalizzati
Gli utenti salvano query come report. Invio email giornaliero/settimanale con grafici aggiornati.

## Performance
50+ utenti concorrenti con tempi di query sub-100ms.`,
          category: "projects", tier: "PRO", lang: "IT", published: true,
        },
        {
          title: "AI Analytics Dashboard: Full-Stack Implementering",
          slug: "ai-analys-dashboard-fullstack",
          description: "Fullständig kod för en realtidsanalysdashboard med naturligt språkfrågor driven av en anpassad LLM-pipeline.",
          body: `## Stack

- **Frontend**: Next.js 16 + Tailwind + Recharts (realtidsdiagram)
- **Backend**: Python FastAPI + WebSocket + Redis
- **AI**: Groq Llama-3 + RAG-pipeline på företagsdata
- **Databas**: PostgreSQL (analys) + Redis (cache + realtid)

## Realtidsdashboard

React-komponenter med WebSocket för dataströmning. Diagram uppdateras i realtid med jämna animationer.

## Naturliga Språkfrågor

Python-motor som konverterar frågor till SQL, utför frågor och genererar läsbara förklaringar.

## Nyckelfunktioner

### Realtidsströmning
WebSocket-anslutningar strömmar nya datapunkter när de anländer. Diagram uppdateras i realtid.

### AI-insikter
LLM upptäcker automatiskt anomalier, trender och mönster. "Intäkterna sjönk 15% denna vecka" — visas utan manuell analys.

### Anpassade Rapporter
Användare kan spara frågor som rapporter. Rapporter skickas via e-post dagligen/veckovis med uppdaterade diagram.

## Driftsättning

\`\`\`yaml
services:
  api: python app.py
  frontend: next build && next start
  redis: redis:alpine
  postgres: postgres:16
\`\`\`

Denna dashboard hanterar 50+ samtidiga användare med sub-100ms frågetider.`,
          category: "projects", tier: "PRO", lang: "SV", published: true,
        },
        {
          title: "Custom AI Agent Framework: Building Your Own Specialist Agents",
          slug: "custom-ai-agent-framework",
          description: "How I built a modular agent framework with tool use, memory, and multi-agent orchestration.",
          body: `## The Problem

Off-the-shelf AI agents are too generic. They don't know your business, your tools, or your constraints.

## The Solution

A modular framework where each agent is a specialist with specific tools, memory, and decision boundaries.

## Architecture

\`\`\`typescript
interface AgentConfig {
  name: string;
  role: string;
  model: 'llama3-70b' | 'gpt-4';
  tools: Tool[];
  memory: MemoryConfig;
  maxIterations: number;
}

class SpecialistAgent {
  private config: AgentConfig;
  private tools: Map<string, Tool>;
  private memory: MemoryStore;

  async handle(input: string): Promise<AgentResponse> {
    // 1. Understand the request
    // 2. Plan the approach
    // 3. Execute tools (with retry logic)
    // 4. Synthesize results
    // 5. Return formatted response
  }
}
\`\`\`

## Tool System

\`\`\`typescript
interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (params: any) => Promise<any>;
}

const tools: Tool[] = [
  { name: 'search_web', description: 'Search the web', ... },
  { name: 'read_database', description: 'Query SQL database', ... },
  { name: 'send_email', description: 'Send email via Gmail', ... },
];
\`\`\`

## Memory System

Agents have short-term memory (conversation context) and long-term memory (vector store). This allows them to remember preferences, past interactions, and learned patterns.

## Multi-Agent Orchestration

Complex tasks are handled by an orchestrator that delegates to specialist agents:

\`\`\`
User Request → Orchestrator → Task Decomposition
  ├── Research Agent → Web search + summarization
  ├── Code Agent → Implementation + testing
  └── Review Agent → Quality check + feedback
      → Orchestrator → Final response
\`\`\`

## Real-World Use

This framework powers all the agents on this portfolio site. Each agent is a specialist with access to specific data and tools, coordinated by a lightweight orchestrator.`,
          category: "projects", tier: "PRO", lang: "EN", published: true,
        },
        {
          title: "Framework Agenti AI Personalizzati: Agenti Specialisti Modulari",
          slug: "framework-agenti-ai-personalizzati",
          description: "Come ho costruito un framework modulare per agenti AI con tool use, memoria e orchestrazione.",
          body: `## Il Problema

Gli agenti AI standard sono troppo generici. Non conoscono il tuo business, i tuoi strumenti o i tuoi vincoli.

## La Soluzione

Un framework modulare dove ogni agente è uno specialista con strumenti, memoria e confini decisionali specifici.

## Sistema Tool

Interfaccia TypeScript per tool con nome, descrizione, parametri e funzione execute. Ogni agente ha accesso a tool specifici.

## Sistema Memoria

Memoria a breve termine (contesto conversazione) e lungo termine (vector store). Permette di ricordare preferenze e pattern appresi.

## Orchestrazione Multi-Agente

Compiti complessi gestiti da un orchestrator che delega a specialisti:

\`\`\`
Richiesta → Orchestrator → Decomposizione
  ├── Agente Ricerca → Web search
  ├── Agente Codice → Implementazione
  └── Agente Review → Quality check
\`\`\`

## Uso Reale

Questo framework alimenta tutti gli agenti su questo portfolio.`,
          category: "projects", tier: "PRO", lang: "IT", published: true,
        },
        {
          title: "Anpassat AI-agentramverk: Bygg Dina Egna Specialistagenter",
          slug: "anpassat-ai-agentramverk-specialister",
          description: "Hur jag byggde ett modulärt agentramverk med verktygsanvändning, minne och multi-agentorkestrering.",
          body: `## Problemet

Standard AI-agenter är för generiska. De känner inte till ditt företag, dina verktyg eller dina begränsningar.

## Lösningen

Ett modulärt ramverk där varje agent är en specialist med specifika verktyg, minne och beslutsgränser.

## Arkitektur

\`\`\`typescript
interface AgentConfig {
  name: string;
  role: string;
  model: 'llama3-70b' | 'gpt-4';
  tools: Tool[];
  memory: MemoryConfig;
  maxIterations: number;
}

class SpecialistAgent {
  private config: AgentConfig;
  private tools: Map<string, Tool>;
  private memory: MemoryStore;

  async handle(input: string): Promise<AgentResponse> {
    // 1. Förstå förfrågan
    // 2. Planera tillvägagångssätt
    // 3. Utför verktyg (med återförsök)
    // 4. Sammanställ resultat
  }
}
\`\`\`

## Verktygssystem

\`\`\`typescript
interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (params: any) => Promise<any>;
}
\`\`\`

## Minnessystem

Agenter har korttidsminne (konversationskontext) och långtidsminne (vektorlagring). Detta gör att de kan komma ihåg preferenser, tidigare interaktioner och inlärda mönster.

## Multi-Agent Orkestrering

Komplexa uppgifter hanteras av en orkestrator som delegerar till specialistagenter:

\`\`\`
Användarfråga → Orkestrator → Uppgiftsnedbrytning
  ├── Forskningsagent → Webbsökning + sammanfattning
  ├── Kodagent → Implementering + testning
  └── Granskningsagent → Kvalitetskontroll + feedback
      → Orkestrator → Slutligt svar
\`\`\`

## Verklig Användning

Detta ramverk driver alla agenter på denna portföljsida. Varje agent är en specialist med tillgång till specifik data och verktyg.`,
          category: "projects", tier: "PRO", lang: "SV", published: true,
        },

        // Atelier Solari (Fotografo) — EN / IT / SV
        {
          title: "Atelier Solari — Wedding Photography Studio",
          slug: "atelier-solari-wedding-photography",
          description: "Wedding photography studio website for Tuscany & Amalfi Coast. Medium format film aesthetic, Next.js 16, Tailwind CSS 4, i18n IT/EN/SV.",
          body: "Atelier Solari is a wedding photography studio based in Florence and Positano, specializing in Tuscany and Amalfi Coast weddings. The site features a vintage-luxury design system with Cormorant Garamond and DM Sans fonts, a warm sepia palette (#F5F0EB, #8B7355, #C9A878), and full bilingual support. Built with Next.js 16 App Router and Tailwind CSS 4.",
          category: "projects", tier: "PRO", lang: "EN", published: true,
        },
        {
          title: "Atelier Solari — Studio Fotografico Matrimoni",
          slug: "atelier-solari-studio-fotografico",
          description: "Sito per studio fotografico di matrimoni in Toscana e Costiera Amalfitana. Next.js 16, Tailwind CSS 4, i18n.",
          body: "Atelier Solari è uno studio di fotografia matrimoniale con sede tra Firenze e Positano. Il sito presenta un design system vintage-lusso con font Cormorant Garamond e DM Sans, palette seppia calda e supporto bilingue. Costruito con Next.js 16 App Router e Tailwind CSS 4.",
          category: "projects", tier: "PRO", lang: "IT", published: true,
        },
        {
          title: "Atelier Solari — Bröllopsfotografistudio",
          slug: "atelier-solari-brollopsfotografi",
          description: "Bröllopsfotografistudio för Toscana & Amalfikusten. Mediumformat filmestetik, Next.js 16, Tailwind CSS 4, i18n.",
          body: "Atelier Solari är en bröllopsfotografistudio baserad i Florens och Positano, specialiserad på bröllop i Toscana och Amalfikusten. Webbplatsen har ett vintage-lyx designsystem med typsnitten Cormorant Garamond och DM Sans, varm sepia-palett och flerspråksstöd.",
          category: "projects", tier: "PRO", lang: "SV", published: true,
        },

        // Nordhem (Real Estate) — EN / IT / SV
        {
          title: "Nordhem — Scandinavian Real Estate Agency",
          slug: "nordhem-scandinavian-real-estate",
          description: "Upscale Scandinavian real estate agency website with property grid, filters, detail drawer, multilingual IT/SV/EN.",
          body: "Nordhem is a Next.js 16 + Tailwind CSS v4 project that replicates an upscale Scandinavian real estate agency website. Features include asymmetric property grid with filters, detail drawer philosophy section, testimonial carousel, lead capture form, and three-language support (Italian, Swedish, English). The design system uses Instrument Serif, JetBrains Mono, and Space Grotesk fonts.",
          category: "projects", tier: "PRO", lang: "EN", published: true,
        },
        {
          title: "Nordhem — Agenzia Immobiliare Scandinava",
          slug: "nordhem-agenzia-immobiliare",
          description: "Sito agenzia immobiliare scandinava di lusso con griglia proprietà, filtri, drawer dettagli, multilingua IT/SV/EN.",
          body: "Nordhem è un progetto Next.js 16 + Tailwind CSS v4 che replica il sito di un'agenzia immobiliare scandinava di fascia alta. Include griglia proprietà asimmetrica con filtri, drawer dettagli, filosofia, carosello testimonial, form lead capture e supporto trilingue.",
          category: "projects", tier: "PRO", lang: "IT", published: true,
        },
        {
          title: "Nordhem — Skandinavisk Fastighetsmäklare",
          slug: "nordhem-skandinavisk-fastighetsmaklare",
          description: "Exklusiv skandinavisk fastighetsmäklarwebbplats med egendomsrutnät, filter, detaljpanel, flerspråkig IT/SV/EN.",
          body: "Nordhem är ett Next.js 16 + Tailwind CSS v4-projekt som återskapar en exklusiv skandinavisk fastighetsmäklarwebbplats. Funktioner inkluderar asymmetriskt egendomsrutnät med filter, detaljpanel, filosofi, testimonialkarusell, leadformulär och trespråksstöd.",
          category: "projects", tier: "PRO", lang: "SV", published: true,
        },

        // Aurelia Pro X1 — EN / IT / SV
        {
          title: "Aurelia Pro X1 — Espresso Machine Landing Page",
          slug: "aurelia-pro-x1-espresso-machine",
          description: "Premium espresso machine product landing page with 3D configurator, colour variants, and 3D/Blender pipeline.",
          body: "AURELIA Pro X1 is a premium espresso machine product showcase with a sleek landing page featuring multiple colour options (Black, Green, Light Blue, Red), product feature sections, and a 3D configurator built with a Python/Blender pipeline. The site is built with Next.js and includes multilingual support.",
          category: "projects", tier: "PRO", lang: "EN", published: true,
        },
        {
          title: "Aurelia Pro X1 — Landing Page Macchina Caffè",
          slug: "aurelia-pro-x1-landing-page",
          description: "Landing page premium per macchina espresso con configuratore 3D, varianti colore e pipeline Blender/Python.",
          body: "AURELIA Pro X1 è una pagina di presentazione per una macchina da caffè espresso premium con configurare 3D, varianti colore (Nero, Verde, Azzurro, Rosso) e sezioni prodotto. Costruita con Next.js e pipeline Python/Blender per la modellazione 3D.",
          category: "projects", tier: "PRO", lang: "IT", published: true,
        },
        {
          title: "Aurelia Pro X1 — Espressomaskin Landningssida",
          slug: "aurelia-pro-x1-espressomaskin",
          description: "Premium espressomaskin produktlandningssida med 3D-konfigurator, färgvarianter och Blender/Python-pipeline.",
          body: "AURELIA Pro X1 är en premium espressomaskinproduktshowcase med en elegant landningssida som har flera färgalternativ, produktfunktioner och en 3D-konfigurator byggd med Python/Blender-pipeline.",
          category: "projects", tier: "PRO", lang: "SV", published: true,
        },

        // Couffer — Salon Management Platform — EN / IT / SV
        {
          title: "Couffer — Salon Management Platform",
          slug: "couffer-salon-management",
          description: "Full salon management platform with booking, services, products, client portal, staff dashboard, and admin panel.",
          body: "Couffer is a complete salon management platform with a public booking system, service catalog (haircuts, color, styling, manicure, massage), e-commerce for professional products, client portal with appointment history and loyalty points, staff dashboard for managing schedules, and a full admin panel with CRM, invoicing, and analytics. Built with Next.js 16, Tailwind CSS 4, and TypeScript. Features client loyalty levels (Bronze, Silver, Gold), real-time inventory management, and staff performance tracking.",
          category: "projects", tier: "PRO", lang: "EN", published: true,
        },
        {
          title: "Couffer — Piattaforma Gestione Salone",
          slug: "couffer-gestione-salone",
          description: "Piattaforma completa per gestione salone con prenotazioni, servizi, prodotti, portale clienti, dashboard staff e pannello admin.",
          body: "Couffer è una piattaforma completa per la gestione di un salone di parrucchiere/estetica. Include sistema di prenotazione pubblico, catalogo servizi (taglio, colore, styling, manicure, massaggi), e-commerce prodotti professionali, portale clienti con storico e punti fedeltà, dashboard staff e pannello admin con CRM, fatturazione e analisi. Costruita con Next.js 16, Tailwind CSS 4 e TypeScript.",
          category: "projects", tier: "PRO", lang: "IT", published: true,
        },
        {
          title: "Couffer — Salongshanteringsplattform",
          slug: "couffer-salongshantering",
          description: "Full salongshanteringsplattform med bokning, tjänster, produkter, kundportal, personaldashboard och adminpanel.",
          body: "Couffer är en komplett plattform för salongshantering med ett offentligt bokningssystem, tjänstekatalog, e-handel för professionella produkter, kundportal med bokningshistorik och lojalitetspoäng, personaldashboard och adminpanel med CRM, fakturering och analys. Byggd med Next.js 16, Tailwind CSS 4 och TypeScript.",
          category: "projects", tier: "PRO", lang: "SV", published: true,
        },

        // Pizzeria Restaurant — EN / IT / SV
        {
          title: "Pizzeria Restaurant — Full Restaurant Website",
          slug: "pizzeria-restaurant-full-website",
          description: "Complete restaurant website with digital menu, online ordering, table reservations, checkout flow, and admin panel.",
          body: "A full-featured restaurant website for a pizzeria including a digital menu with categories, online ordering system with cart and checkout, table reservation system, about page, contact page with location, confirmation flow, and a complete admin panel for managing orders, menu items, and reservations. Built with Next.js 16, Tailwind CSS 4, and TypeScript.",
          category: "projects", tier: "PRO", lang: "EN", published: true,
        },
        {
          title: "Pizzeria Ristorante — Sito Completo",
          slug: "pizzeria-ristorante-sito-completo",
          description: "Sito web completo per ristorante con menu digitale, ordini online, prenotazioni tavoli, checkout e pannello admin.",
          body: "Un sito web completo per una pizzeria con menu digitale categorizzato, sistema di ordinazione online con carrello e checkout, prenotazione tavoli, pagina chi siamo, contatti con mappa, flusso di conferma e pannello admin per gestione ordini, menu e prenotazioni. Costruito con Next.js 16, Tailwind CSS 4 e TypeScript.",
          category: "projects", tier: "PRO", lang: "IT", published: true,
        },
        {
          title: "Pizzeria Restaurang — Fullständig Webbplats",
          slug: "pizzeria-restaurang-full-webbplats",
          description: "Fullständig restaurangwebbplats med digital meny, onlinebeställning, bordsreservering, kassaflöde och adminpanel.",
          body: "En fullfjädrad restaurangwebbplats för en pizzeria med digital meny, onlinebeställningssystem med varukorg och kassa, bordsreserveringssystem, om-sida, kontaktsida med plats, bekräftelseflöde och en komplett adminpanel. Byggd med Next.js 16, Tailwind CSS 4 och TypeScript.",
          category: "projects", tier: "PRO", lang: "SV", published: true,
        },
      ],
    });

    return success({
      user: {
        id: seedUser.id,
        email: seedUser.email,
        tier: seedUser.tier,
        password: "admin123",
      },
      articlesCreated: articles.count,
    }, 201);
  } catch (e) {
    console.error("Seed error:", e);
    return error("Failed to seed database", 500);
  }
}
