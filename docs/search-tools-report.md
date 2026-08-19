# Report: strumenti per migliorare le ricerche

Data: 2026-08-18. Analisi dei sette riferimenti proposti, valutati per il contesto di
looz.design: sito portfolio, assistente sul sito, e servizi venduti (siti, automazioni,
agenti AI, social, visibilità, dati dal web). Vincoli di progetto rispettati: l'assistente
deve costare zero (free tier Groq), niente LLM a pagamento come predefinito, ogni progetto
è un demo salvo diversa indicazione.

## Cosa significa "migliorare le ricerche" qui

Tre assi, vanno tenuti separati perché ogni strumento serve uno solo di questi:

1. **Ricerca dentro il sito** — far trovare progetti e servizi a chi atterra su looz.design.
2. **Ricerca web per l'assistente** — dare al bot del sito (oggi Groq + API route, senza
   accesso alla rete) la capacità di leggere e cercare pagine, e produrre ricerche profonde.
3. **Servizio da vendere** — "ricerca nel sito", "web data", "deep research" come offerte
   per i clienti (i demo del sito servono proprio a questo).

---

## 1. TimesFM — Google Research (28k★, Apache-2.0)

**Che cos'è.** Modello foundation pretrained per *time-series forecasting* (previsione di
serie temporali), non per ricerca. Versione 2.5: 200M di parametri, contesto fino a 16k.
Gira in Python con torch/flax, peso scaricato da HuggingFace. Google lo offre anche via
BigQuery ML e Google Sheets.

**Rilevanza.** Nessuna sui tre assi. Non fa ricerca testuale né semantica. Può entrare solo
in un ipotetico demo "dati dal web" che preveda andamenti (es. traffico, vendite): un forecast
da mostrare a un cliente. Richiede un runtime Python dedicato e scaricare un modello: è un
progetto a sé, non un pezzo da infilare nel sito.

**Verdetto: fuori scope** per il tema ricerche. Tengo il riferimento solo se un giorno serve
un demo di previsione dati.

## 2. training-data-analyst — GoogleCloudPlatform (8.6k★, Apache-2.0)

**Che cos'è.** Notebook e lab dei corsi di formazione GCP (BigQuery, ML, Dataflow, Vertex…).
È materiale didattico, non uno strumento integrabile.

**Rilevanza.** Nessuna per i tre assi. Al massimo come fonte di studio su come Google organizza
pipeline dati, utile a Lorenzo per parlare con clienti tecnici, ma non si installa da nessuna parte.

**Verdetto: fuori scope.** Lettura opzionale, non implementazione.

## 3. Unsloth — unslothai (73.5k★, Apache-2.0 core / AGPL-3.0 Studio)

**Che cos'è.** App desktop / Studio / libreria per eseguire e *addestrare* LLM localmente:
fine-tuning 2× più veloce con ~70% in meno di VRAM, supporta LoRA/QLoRA/GRPO/DPO, esporta in
GGUF. Non è uno strumento di ricerca.

**Rilevanza.** Indiretta e solo sul fronte "agenti da vendere": è la strada pratica per
costruire un assistente *fine-tunato* su dati di un cliente (tono, catalogo, FAQ) da mostrare
come demo. Anche i modelli embedding addestrati qui possono alimentare la ricerca semantica
(vuoto coperto da Meilisearch, vedi sotto). Non serve invece all'assistente del sito: un
fine-tuning richiede GPU locale e un flusso di lavoro, non gira su serverless.

Nota licenza: il core è Apache-2.0, ma l'interfaccia Studio è AGPL-3.0 — rilevante solo se si
rivende la UI, non se si usa la libreria per generare i modelli.

**Verdetto: possibile, ma su un asse diverso.** Vale la pena solo quando si vuole offrire
"assistenti su misura" ai clienti. Non è una strategia di ricerca.

## 4. Agent-Reach — Panniantong (72.7k★, MIT)

**Che cos'è.** Un *capability layer* per agenti a riga di comando (Claude Code, OpenClaw,
Cursor): in un'unica installazione sceglie, installa e monitora i tool per dare all'agente
occhi sulla rete. Legge pagine web (Jina Reader), trascrizioni YouTube (yt-dlp), repo GitHub
(gh CLI), feed RSS, ricerca semantica web (Exa via MCP), e canali social via sessione browser
(Twitter, Reddit, LinkedIn, Instagram, B站, 小红书…). Zero costi API, open source, `doctor`
verifica cosa funziona.

**Rilevanza.** ALTA, sul secondo asse (assistente) e come demo per il servizio "agenti".
È esattamente il problema che l'assistente di looz.design ha oggi: non può andare online.
Il pattern "leggi pagina + cerca sul web + estrai da social" è la strategia per far passare il
bot da chatbot a ricerca vera.

**Cautela onesta:**
- È pensato per agenti CLI locali; la pagina del sito gira su serverless Next.js, quindi il
  porting richiede di estrarre i singoli canali (Jina Reader e una ricerca web) dentro una API
  route, non di montare l'intero CLI.
- I canali social usano cookie/sessioni di un browser reale: rischio account (sconsigliato su
  account principali) e questioni ToS. Per i demo meglio limitarsi ai canali zero-config
  (web, YouTube, GitHub, RSS, Exa).
- Progetto molto nuovo e a crescita rapidissima: prima di fidarsi dei cookie vale una lettura
  del codice. Il MIT aiuta, ma la vigilanza è a carico di chi lo adotta.

**Verdetto: la direzione giusta per dare ricerca web all'assistente**, da adottare per parti
(web + YouTube + RSS + ricerca), non in blocco.

## 5. Meilisearch — meilisearch (59k★, MIT)

**Che cos'è.** Motore di ricerca open source, velocissimo (search-as-you-type <50ms), con
tolleranza ai refusi, filtri, facet, geosearch, e ricerca *ibrida* (full-text + semantica a
vettori). Un singolo binario, API REST, SDK per ogni linguaggio, MCP e LangChain. Community
Edition MIT gratuita anche in produzione; l'Enterprise (sharding) è commerciale ma non serve.

**Rilevanza.** ALTA su due assi:
1. **Ricerca dentro il sito** — è la scelta ovvia per indicizzare progetti e servizi di
   looz.design e per il servizio "ricerca nel sito" da vendere ai clienti (il classico: siti
   con catalogo, documentazione, directory).
2. **Base per RAG** — la ricerca semantica/ibrida è il retriever di un assistente che risponde
   citando i contenuti del sito.

La semantica richiede un provider di embedding: si può restare gratis con modelli self-hosted
o embedding gratuiti, ma va dichiarato nel preventivo.

**Verdetto: la prima scelta concreta.** Self-hostato rispetta il vincolo di costo zero.

## 6. LibreChat — web search (documentazione)

**Che cos'è.** Non uno strumento, ma la *ricetta* che LibreChat (ChatGPT open source) usa per
la ricerca web: un **provider di ricerca** (Serper, SearXNG, Tavily) + uno **scraper**
(Firecrawl, Tavily) + un **reranker** opzionale (Jina, Cohere). SearXNG è self-hostato e
gratis; Tavily ha un free tier.

**Rilevanza.** MEDIA, come schema mentale: "search + scrape + rerank" è il modo giusto di
costruire la ricerca web dell'assistente, molto più semplice di Agent-Reach quando si vuole
solo leggere risultati web. LibreChat stesso (una chat completa da installare) non c'entra
con looz.design.

**Verdetto: da copiare come architettura, non da installare.** Per l'assistente del sito,
una route che chiama SearXNG (o il free tier di Tavily) e poi riassume con Groq è la via
leggera e a costo zero.

## 7. GPT Researcher — assafelovic (29k★, Apache-2.0)

**Che cos'è.** Agente autonomo di *deep research*: genera domande, lancia più agenti in
parallelo, scansiona 20+ fonti, produce un report con citazioni. Rilasciabile come report PDF/
docx/markdown. Supporta qualsiasi LLM (anche OpenAI-compatible via `OPENAI_BASE_URL`) e Tavily
come retriever. Installabile anche come skill per Claude.

**Rilevanza.** ALTA sul terzo asse, **come servizio e come demo**, non per l'assistente del sito:
- È l'offerta "ricerche di mercato / approfondimenti con citazioni" da vendere ai clienti,
  anche come demo del servizio agenti.
- Poiché accetta endpoint OpenAI-compatibili, può girare sul **free tier Groq** rispettando il
  vincolo di costo zero (da verificare sul campo: qualità e rate limit).
- Costa ~5 minuti e ~$0,4 a ricerca con o3-mini "high"; con Groq gratis ma più lento/limitato.

**Verdetto: il candidato per il servizio "ricerca approfondita".** Una demo sul sito che
produce un report citato sarebbe molto più credibile di un chatbot.

---

## 8. The Silver Searcher (ag) — ggreer (27.1k★, Apache-2.0)

**Che cos'è.** Cerca testo dentro i file di un progetto, come ack ma molto più veloce:
usa thread paralleli, `mmap`, Boyer-Moore per le stringhe e il JIT di PCRE per le regex, e
rispetta `.gitignore`/`.ignore`. È un comando da terminale per sviluppatori (su Windows si
installa con winget o choco). Storicamente importante: è il padre concettuale di **ripgrep**
(`rg`), che oggi lo ha largamente superato in velocità e manutenzione.

**Rilevanza.** Nessuna sui tre assi: non fa ricerca dentro il sito, non dà ricerca web
all'assistente e non è un servizio da vendere. È un attrezzo per la postazione di chi scrive
codice: utile a Lorenzo per cercare nei sorgenti di questo e altri repo, ma non tocca looz.design
né l'offerta.

**Verdetto: fuori scope.** Se serve cercare nel codice, meglio ripgrep (più veloce, attivo).

## 9. DocsGPT — arc53 (18.2k★, MIT)

**Che cos'è.** Piattaforma open-source "private AI" per agenti, assistenti e ricerca
enterprise: backend Flask + frontend React, deploy con Docker. Fa RAG sui documenti (PDF,
DOCX, CSV, XLSX, EPUB, MD, HTML, immagini, audio), ingesta dal web (URL, sitemap, Reddit,
GitHub, crawler), risponde con citazioni in una UI pulita, espone API key, widget React e bot
Discord/Telegram pronti, e supporta più modelli (OpenAI, Google, Anthropic, locali via
Ollama/llama.cpp). Roadmap: agent builder, deep research, connettori SharePoint/Confluence.

**Rilevanza.** ALTA sul terzo asse e alta anche sul primo, con una differenza chiave rispetto
alle altre voci: è un **prodotto completo da far usare a un cliente**, non una ricetta:
- È l'offerta "assistente che conosce i tuoi documenti/sito, con citazioni" da installare per
  un cliente, o da proporre come demo del servizio agenti. Widget e API chiavi in mano.
- Come base per la ricerca nel sito coprirebbe sia "chat con i contenuti" sia ricerca classica,
  ma è molto più pesante di Meilisearch: serve Docker + risorse, non sta in una route Vercel.
- Costo: il software è gratis (MIT, self-host), ma il modello lo sceglie chi lo ospita. Per
  restare a costo zero serve un modello locale (Ollama) su una macchina dedicata, che non è
  "zero costi" nel senso di questo report; con API a pagamento il costo ricade sul cliente.
  Il README non dichiara supporto a endpoint OpenAI-compatibili (da verificare prima).

**Verdetto: il candidato "chiavi in mano" per il servizio da vendere.** Più maturo di GPT
Researcher come prodotto, ma va venduto come installazione per il cliente (self-host con il
suo modello), non come demo gratis sul sito di looz.

## 10. Google Places Autocomplete (New) — Places API (a pagamento)

**Che cos'è.** Servizio web (`places.googleapis.com/v1/places:autocomplete`) che restituisce
predizioni di luoghi e di query mentre l'utente digita: nomi, indirizzi, città, plus codes.
Si raffinano con `locationBias`/`locationRestriction` (cerchio o viewport), `regionCode`,
`includedRegionCodes`, `includedPrimaryTypes` (es. solo ristoranti), `languageCode`. Le
predizioni restituite sono max 5 e vanno mostrate con il logo Google. I `sessionToken`
raggruppano digitazione+selezione in una sessione per il billing.

**Rilevanza.** Limitata e fuori dai tre assi, con un'unica eccezione vendibile:
- Non è un motore di ricerca di contenuti: è un componente di UX per form e geolocalizzazione
  (inserimento indirizzi, "trova il negozio più vicino"). Sul sito di looz non serve: il form
  di contatto non raccoglie indirizzi.
- Come servizio da vendere ha un mercato: form con indirizzo validato e store locator per
  clienti locali (ristoranti, negozi, studi professionali). Ma è una feature, non una strategia
  di ricerca, e per il tema del report è fuori scope.
- Vincolo: richiede account Google Cloud con carta e billing. Non esiste free tier, ma i nuovi
  account hanno un credito mensile di ~$200 che copre un uso piccolo. I session token tagliano
  il costo. Questo contrasta con la regola "l'assistente deve costare nulla": per looz.design
  non va usato, per il cliente è un suo costo (e i prezzi cambiano nel tempo).

**Verdetto: fuori scope ora.** Riaprire solo se si offre esplicitamente "geolocalizzazione /
form con indirizzo validato" come feature vendibile a clienti locali, tenendo presente che è
a pagamento (salvo credito $200/mese).

## 11. OpenSEO — every-app (12.5k★, MIT)

**Che cos'è.** Alternativa open source a Semrush/Ahrefs: tool SEO all-in-one (keyword
research, rank tracking, competitor insights, backlink, site audit, AI visibility) con UI
moderna e workflow mirati. Espone un **server MCP** e agent skills: un agente AI (Claude Code,
OpenClaw, Hermes) può interrogare i dati SEO direttamente. Self-host in due modi: Docker (uso
personale) o Cloudflare (free plan, multi-dispositivo). Il software è MIT e gratis; i **dati
provengono da DataForSEO**, API a pagamento pay-as-you-go con una propria chiave (no
abbonamento, paghi quello che usi). Esiste anche un hosted ufficiale a $10/mese.

**Rilevanza.** MEDIA-ALTA sul terzo asse, nulla sugli altri due:
- Non tocca la ricerca del sito né la ricerca web dell'assistente: è strumentazione SEO.
- Come servizio da vendere è credibile: report di rank tracking, audit, backlink e keyword per
  i clienti, e il MCP lo rende usabile da un agente per produrre analisi in linguaggio naturale.
- Due ostacoli: (1) richiede una chiave **DataForSEO a pagamento**, che estende il principio
  "costo zero" dai modelli LLM ai dati; (2) Lorenzo ha già una suite di skill SEO in locale
  (inclusa `seo-dataforseo`, che usa lo stesso DataForSEO): OpenSEO aggiunge UI e MCP, ma il
  costo dei dati resta identico.
- Self-host Cloudflare gratis, ma è un monolite Next.js+Postgres su Cloudflare Workers: non è
  una route da infilare nel sito su Vercel.

**Verdetto: candidato interessante ma condizionato.** Vale come servizio vendibile "SEO con
report automatizzati via agente" solo se si accetta un costo dati (DataForSEO pay-as-you-go).
Senza quella decisione resta fuori scope come gli altri.

## Sintesi comparativa

| Strumento | Licenza | Cosa fa | Ricerca sito | Ricerca web assistente | Servizio da vendere | Costo |
|---|---|---|---|---|---|---|
| TimesFM | Apache-2.0 | Forecasting serie temporali | — | — | bassa (demo previsioni) | gratis, runtime Python |
| training-data-analyst | Apache-2.0 | Corsi GCP | — | — | — | gratis, solo lettura |
| Unsloth | Apache-2.0/AGPL | Fine-tuning LLM locali | — | — | media (assistenti su misura) | gratis, GPU locale |
| **Agent-Reach** | MIT | Internet per agenti (web/YouTube/GitHub/RSS/social) | — | **alta** | alta (demo agenti) | gratis |
| **Meilisearch** | MIT | Ricerca full-text + semantica | **alta** | alta (RAG) | **alta** | gratis self-host |
| LibreChat web search | (docs) | Ricetta search+scrape+rerank | — | media (architettura) | media | SearXNG gratis |
| **GPT Researcher** | Apache-2.0 | Deep research con citazioni | — | media | **alta** | LLM free tier (Groq) |
| The Silver Searcher (ag) | Apache-2.0 | Ricerca testo in file (CLI) | — | — | — | gratis, solo locale |
| **DocsGPT** | MIT | Piattaforma RAG/assistenti enterprise | **alta** | media | **alta** | gratis self-host; modello a scelta |
| Google Places Autocomplete (New) | proprietaria | Autocomplete indirizzi/luoghi (UX form) | — | — | media (clienti locali) | a pagamento; credito $200/mese |
| **OpenSEO** | MIT | Tool SEO all-in-one (keyword/rank/backlink/audit) + MCP | — | — | **media-alta** | software gratis; dati DataForSEO a pagamento |

## Raccomandazione

In ordine di priorità, coerente con i vincoli:

1. **Meilisearch → ricerca nel sito.** La mossa più concreta e vendibile: indicizza
   progetti/servizi di looz.design, e diventa il demo del servizio "ricerca nel sito" per i
   clienti. Self-hosted, gratis.
2. **Ricetta ricerca web per l'assistente** (pattern LibreChat, fonti da Agent-Reach):
   una route `/api/search` che interroga SearXNG o il free tier di Tavily, legge le pagine con
   Jina Reader, e riassume con Groq. Zero costi, nessun cookie.
3. **DocsGPT come servizio "chiavi in mano" da vendere ai clienti**: assistente sui loro
   documenti/sito con citazioni, widget pronto, self-host MIT. Non come demo sul sito di looz:
   pesante (Docker) e il modello non è gratis senza una macchina dedicata.
4. **OpenSEO come servizio "SEO con report via agente", solo se si accetta DataForSEO
   a pagamento.** Il MCP + le skill lo rendono usabile da un agente per report rank/keyword
   per i clienti, in linea con l'offerta visibilità. Senza la decisione sul costo dati,
   resta fuori scope.
5. **GPT Researcher come servizio/demo "ricerca approfondita"**, puntato su Groq per
   rispettare il costo zero. Da testare qualità e limiti del free tier prima di prometterlo.
6. **Agent-Reach in blocco: solo dopo.** È la soluzione più completa ma la più rischiosa
   (cookie, social, maturità). Vale come ispirazione di canali, non come dipendenza.
7. **TimesFM, training-data-analyst, Unsloth, The Silver Searcher, Google Places
   Autocomplete: fuori scope ora.** Riaprire TimesFM/Unsloth solo se si entra in previsione
   dati o assistenti fine-tunati per clienti; Places Autocomplete solo se si vende
   geolocalizzazione per clienti locali (feature a pagamento). The Silver Searcher è solo un
   comodo strumento locale per chi sviluppa: l'equivalente moderno è ripgrep.
