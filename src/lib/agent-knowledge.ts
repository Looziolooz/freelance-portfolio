import type { Lang } from "@/generated/prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Assistant knowledge base + free lexical retriever ("RAG memory", no embeddings)
//
// The on-site assistant runs cost-free on Groq, which has no embedding API, so we
// keep retrieval fully in-process and deterministic: a curated, multilingual set
// of short factual statements (KNOWLEDGE), retrieved per user message by lexical
// overlap between the query and each entry's keywords + body. Core facts (bio,
// contact, pricing, engagements) are always included; everything else is pulled
// in only when relevant, keeping the prompt small and grounded.
// ─────────────────────────────────────────────────────────────────────────────

export interface KBEntry {
  /** Stable kebab-case id. */
  id: string;
  /** project | service | engagement | tool | pricing | bio | contact | membership | faq */
  category: string;
  /** Lowercased match terms, trilingual + synonyms. */
  keywords: string[];
  /** The fact, one short statement per language. */
  text: Record<Lang, string>;
}

/** Categories whose entries are ALWAYS injected (small, high-value core facts). */
export const CORE_CATEGORIES = new Set(["bio", "contact", "pricing", "engagement"]);

// Stopwords across the three site languages (+ common query glue). Kept short on
// purpose — only words that carry no retrieval signal.
const STOPWORDS = new Set([
  // IT
  "che", "chi", "cosa", "come", "con", "per", "una", "uno", "del", "della", "delle", "dei", "degli",
  "sono", "essere", "puoi", "puo", "può", "fare", "fai", "mio", "mia", "miei", "tuo", "tua", "vorrei",
  "quale", "quali", "quanto", "quanta", "dove", "perche", "perché", "anche", "più", "piu", "non", "sul", "sulla",
  // EN
  "the", "and", "for", "with", "you", "your", "can", "could", "what", "which", "how", "are", "have",
  "does", "this", "that", "from", "about", "into", "would", "should", "want", "need", "make", "made",
  // SV
  "och", "att", "som", "för", "med", "kan", "vad", "hur", "har", "din", "ditt", "jag", "vill", "vilka",
  // glue
  "lorenzo", "hacks",
]);

/** Lowercase, strip accents/punctuation, drop short + stop words. */
function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Score an entry against the (pre-tokenized) query. Keyword hits weigh more than
 * incidental body-token overlap so a "vespa" or "prezzo" query lands on the right
 * entry rather than on whatever else happens to share a word.
 */
function scoreEntry(qTokens: Set<string>, e: KBEntry, lang: Lang): number {
  let score = 0;
  for (const kw of e.keywords) {
    for (const t of tokenize(kw)) {
      if (qTokens.has(t)) {
        score += 3;
        break;
      }
    }
  }
  const body = new Set(tokenize(`${e.text[lang]} ${e.id.replace(/-/g, " ")} ${e.category}`));
  for (const t of qTokens) if (body.has(t)) score += 1;
  return score;
}

/** Top-k knowledge entries relevant to `query`, excluding the core set (added separately). */
export function retrieveKnowledge(query: string, lang: Lang, k = 8): KBEntry[] {
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0) return [];
  return KNOWLEDGE.filter((e) => !CORE_CATEGORIES.has(e.category))
    .map((e) => ({ e, s: scoreEntry(qTokens, e, lang) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => x.e);
}

/** The always-on core facts. */
export function coreKnowledge(): KBEntry[] {
  return KNOWLEDGE.filter((e) => CORE_CATEGORIES.has(e.category));
}

/** Generic lexical top-k over arbitrary items (used to filter live DB rows). */
export function rankByQuery<T>(query: string, items: T[], getText: (it: T) => string, k: number): T[] {
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0) return items.slice(0, k);
  const scored = items
    .map((it) => {
      const body = new Set(tokenize(getText(it)));
      let s = 0;
      for (const t of qTokens) if (body.has(t)) s += 1;
      return { it, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  // Fall back to the most recent items if nothing matches, so the catalog is
  // never empty for a generic message.
  return (scored.length ? scored.map((x) => x.it) : items).slice(0, k);
}

const CATEGORY_HEADING: Record<string, string> = {
  bio: "About Lorenzo",
  contact: "Contact & how to start",
  pricing: "Pricing & how Lorenzo charges",
  engagement: "Engagements",
  membership: "Membership",
  service: "Services",
  project: "Projects",
  tool: "Tools & tech stack",
  faq: "Good to know",
};

/** Render entries to a compact markdown block grouped by category. */
export function renderKnowledge(entries: KBEntry[], lang: Lang): string {
  if (entries.length === 0) return "";
  const order = ["bio", "contact", "pricing", "engagement", "membership", "service", "project", "tool", "faq"];
  const seen = new Set<string>();
  const sections: string[] = [];
  for (const cat of order) {
    const inCat = entries.filter((e) => e.category === cat && !seen.has(e.id));
    if (!inCat.length) continue;
    inCat.forEach((e) => seen.add(e.id));
    sections.push(
      `## ${CATEGORY_HEADING[cat] ?? cat}\n` + inCat.map((e) => `- ${e.text[lang]}`).join("\n"),
    );
  }
  // any categories not in `order`
  const rest = entries.filter((e) => !seen.has(e.id));
  if (rest.length) {
    sections.push(rest.map((e) => `- ${e.text[lang]}`).join("\n"));
  }
  return sections.join("\n\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE — distilled from across the site (projects, services, engagements,
// tools, pricing, membership, bio, contact) plus a completeness-FAQ pass.
// Stored as raw {it,en,sv} and mapped to per-language text below.
// ─────────────────────────────────────────────────────────────────────────────
interface RawEntry {
  id: string;
  category: string;
  keywords: string[];
  it: string;
  en: string;
  sv: string;
}

const RAW: RawEntry[] = [
  // ── Projects ───────────────────────────────────────────────────────────────
  {
    id: "project-vespa-heritage",
    category: "project",
    keywords: ["vespa heritage", "vespa", "vespa primavera", "scrollytelling", "landing page", "concept", "premium", "scooter", "motorino", "next.js", "framer motion", "canvas", "animazione", "animation", "scroll", "heritage", "1968", "lancio prodotto", "product launch", "produktlansering"],
    it: "Vespa Heritage è una landing scrollytelling (concept) per un'edizione heritage della Vespa Primavera 1968: una sequenza su canvas guidata dallo scroll smonta e rimonta la Vespa mentre lo sfondo si tinge del colore di ogni fotogramma. Costruita con Next.js 14, Framer Motion e Canvas. Una pagina di lancio che fa desiderare il prodotto: animazione e racconto al posto della solita scheda tecnica, per presentare un articolo premium. Demo live: https://vespa-heritage.vercel.app/",
    en: "Vespa Heritage is a scrollytelling landing (concept) for a heritage edition of the 1968 Vespa Primavera: a scroll-driven canvas sequence takes the Vespa apart and back together while the background tints to each frame's colour. Built with Next.js 14, Framer Motion and Canvas. A launch page that makes the product desirable: animation and story instead of the usual spec sheet, to present a premium item. Live demo: https://vespa-heritage.vercel.app/",
    sv: "Vespa Heritage är en scrollytelling-landningssida (concept) för en heritage-utgåva av Vespa Primavera 1968: en scrolldriven canvas-sekvens tar isär och sätter ihop Vespan medan bakgrunden färgas av varje bildrutas färg. Byggd med Next.js 14, Framer Motion och Canvas. En lanseringssida som gör produkten åtråvärd: animation och berättelse i stället för det vanliga databladet, för att presentera en premiumprodukt. Live-demo: https://vespa-heritage.vercel.app/",
  },
  {
    id: "project-bellitalia",
    category: "project",
    keywords: ["bell'italia", "bellitalia", "italia", "italy", "italien", "turismo", "tourism", "turism", "viaggi", "travel", "resor", "destinazioni", "destinations", "landing animata", "animated landing", "polaroid", "cartoline", "postcards", "vykort", "gsap", "scrolltrigger", "lenis", "carosello", "carousel", "tradizioni", "sapori"],
    it: "Bell'Italia è una landing animata sui luoghi più belli d'Italia: carosello hero a tutto schermo con 8 destinazioni, diario di cartoline polaroid che si spargono allo scroll e griglia di tradizioni e sapori che zooma. Costruita con GSAP, ScrollTrigger e Lenis. Vetrina emozionale che fa venire voglia di partire: racconta una meta con animazioni curate e invoglia a esplorare l'offerta.",
    en: "Bell'Italia is an animated landing about Italy's most beautiful places: full-screen hero carousel with 8 destinations, a polaroid postcard diary that scatters on scroll, and a traditions-and-flavours grid that zooms. Built with GSAP, ScrollTrigger and Lenis. An emotional showcase that makes you want to travel: it tells a destination's story with crafted animation and invites visitors to explore the offer.",
    sv: "Bell'Italia är en animerad landningssida om Italiens vackraste platser: helskärms hero-karusell med 8 destinationer, en polaroid-vykortsdagbok som sprids vid scroll och ett rutnät med traditioner och smaker som zoomar. Byggd med GSAP, ScrollTrigger och Lenis. En känslosam skyltning som får dig att vilja resa: den berättar en destinations historia med genomarbetad animation och bjuder in besökaren att utforska utbudet.",
  },
  {
    id: "project-bella-calabria",
    category: "project",
    keywords: ["bella calabria", "calabria", "kalabrien", "viaggi", "travel", "resor", "turismo", "tourism", "turism", "portale viaggi", "travel portal", "reseportal", "alloggi", "stays", "boenden", "prenotazione", "booking", "bokning", "airbnb", "voli", "flights", "flyg", "dashboard", "admin", "gsap", "lenis", "next.js", "tailwind"],
    it: "Bella Calabria è un portale di viaggi per la Calabria: homepage con scroll animato (GSAP + Lenis), listing alloggi con ricerca, filtri e prenotazione tipo Airbnb, ricerca voli, offerte e una dashboard admin per gestire alloggi, prenotazioni e offerte. Costruito con Next.js 14, Tailwind e GSAP. Piattaforma di prenotazione completa con pannello di gestione: il cliente prenota online e l'attività controlla alloggi, richieste e offerte da un'unica dashboard.",
    en: "Bella Calabria is a travel portal for Calabria: an animated scroll homepage (GSAP + Lenis), stay listings with search, filters and Airbnb-style booking, flight search, deals, and an admin dashboard to manage stays, bookings, and offers. Built with Next.js 14, Tailwind and GSAP. A complete booking platform with a management panel: customers book online while the business controls stays, requests, and deals from a single dashboard.",
    sv: "Bella Calabria är en reseportal för Kalabrien: en animerad scroll-startsida (GSAP + Lenis), boendelistor med sök, filter och Airbnb-liknande bokning, flygsök, erbjudanden och en admin-panel för att hantera boenden, bokningar och erbjudanden. Byggd med Next.js 14, Tailwind och GSAP. En komplett bokningsplattform med hanteringspanel: kunder bokar online medan verksamheten styr boenden, förfrågningar och erbjudanden från en enda panel.",
  },
  {
    id: "project-barberia",
    category: "project",
    keywords: ["barberia", "barbiere", "barber", "barbershop", "barberare", "prenotazione online", "online booking", "onlinebokning", "listino servizi", "services menu", "galleria", "gallery", "tagli", "cuts", "next.js", "tailwind", "typescript", "parrucchiere"],
    it: "Barberia è un sito per barbershop con prenotazione online, listino servizi, galleria tagli e contatti. Costruito con Next.js 16, Tailwind 4 e TypeScript. Prenotazioni online che riempiono l'agenda e tagliano le telefonate: meno tempo al telefono, più clienti in poltrona. Demo live: https://barberia-ashy-beta.vercel.app/en",
    en: "Barberia is a barbershop website with online booking, services menu, cuts gallery, and contact. Built with Next.js 16, Tailwind 4 and TypeScript. Online bookings that fill the calendar and cut phone calls: less time on the phone, more clients in the chair. Live demo: https://barberia-ashy-beta.vercel.app/en",
    sv: "Barberia är en barberarsajt med onlinebokning, tjänstemeny, galleri och kontakt. Byggd med Next.js 16, Tailwind 4 och TypeScript. Onlinebokningar som fyller kalendern och minskar telefonsamtalen: mindre tid i telefon, fler kunder i stolen. Live-demo: https://barberia-ashy-beta.vercel.app/en",
  },
  {
    id: "project-fotografo",
    category: "project",
    keywords: ["atelier solari", "fotografo", "photographer", "fotograf", "fotografia", "photography", "matrimoni", "weddings", "bröllop", "toscana", "tuscany", "costiera amalfitana", "amalfi coast", "amalfikusten", "vintage", "lusso", "luxury", "multilingua", "multilingual", "next.js", "tailwind", "i18n"],
    it: "Atelier Solari è un sito per studio fotografico di matrimoni in Toscana e Costiera Amalfitana con design vintage-lusso. Costruito con Next.js 16, Tailwind 4 e i18n. Sito multilingua che porta richieste di matrimoni da clienti italiani e internazionali, senza intermediari. Demo live: https://fotografo-five.vercel.app/en",
    en: "Atelier Solari is a wedding photography studio site for Tuscany and the Amalfi Coast with vintage-luxury design. Built with Next.js 16, Tailwind 4 and i18n. A multilingual site that brings in wedding enquiries from Italian and international clients, with no middlemen. Live demo: https://fotografo-five.vercel.app/en",
    sv: "Atelier Solari är en bröllopsfotografistudio-sajt för Toscana och Amalfikusten med vintage-lyx-design. Byggd med Next.js 16, Tailwind 4 och i18n. En flerspråkig sajt som drar in bröllopsförfrågningar från italienska och internationella kunder, utan mellanhänder. Live-demo: https://fotografo-five.vercel.app/en",
  },
  {
    id: "project-real-estate",
    category: "project",
    keywords: ["nordhem", "immobiliare", "real estate", "fastighet", "agenzia immobiliare", "real estate agency", "fastighetsmäklare", "scandinava", "scandinavian", "skandinavisk", "lusso", "luxury", "lyx", "proprietà", "properties", "egendom", "filtri", "filters", "trilingue", "trilingual", "trespråkig", "next.js", "tailwind", "i18n"],
    it: "Nordhem è un'agenzia immobiliare scandinava di lusso con griglia proprietà, filtri e supporto trilingue. Costruita con Next.js 16, Tailwind 4 e i18n. Catalogo immobili con filtri e schede dettagliate: i clienti arrivano già informati e i lead sono più qualificati.",
    en: "Nordhem is an upscale Scandinavian real estate agency with property grid, filters, and trilingual support. Built with Next.js 16, Tailwind 4 and i18n. A property catalogue with filters and detailed pages: clients arrive informed and leads are better qualified.",
    sv: "Nordhem är en exklusiv skandinavisk fastighetsmäklarwebbplats med egendomsrutnät, filter och trespråksstöd. Byggd med Next.js 16, Tailwind 4 och i18n. En fastighetskatalog med filter och detaljerade sidor: kunder kommer pålästa och leads blir mer kvalificerade.",
  },
  {
    id: "project-aurelia",
    category: "project",
    keywords: ["aurelia pro x1", "aurelia", "macchina caffè", "espresso machine", "espressomaskin", "caffè", "coffee", "kaffe", "configuratore 3d", "3d configurator", "3d-konfigurator", "landing page", "premium", "varianti colore", "colour variants", "färgvarianter", "next.js", "python", "3d"],
    it: "Aurelia Pro X1 è una landing page per una macchina caffè espresso premium con configuratore 3D e varianti colore. Costruita con Next.js, Python e 3D. Configuratore 3D che fa scegliere e personalizzare il prodotto premium online, riducendo le domande pre-acquisto. Demo live: https://aurelia-seven-fawn.vercel.app/en",
    en: "Aurelia Pro X1 is a premium espresso machine landing page with 3D configurator and colour variants. Built with Next.js, Python and 3D. A 3D configurator that lets customers choose and personalise the premium product online, cutting pre-sale questions. Live demo: https://aurelia-seven-fawn.vercel.app/en",
    sv: "Aurelia Pro X1 är en landningssida för en premium espressomaskin med 3D-konfigurator och färgvarianter. Byggd med Next.js, Python och 3D. En 3D-konfigurator där kunder väljer och anpassar premiumprodukten online, vilket minskar frågor före köp. Live-demo: https://aurelia-seven-fawn.vercel.app/en",
  },
  {
    id: "project-pizzeria-lorenzo",
    category: "project",
    keywords: ["pizzeria", "ristorante", "restaurant", "restaurang", "pizza", "javascript", "css", "netlify", "cibo", "food"],
    it: "Pizzeria è un sito per pizzeria/ristorante costruito con JavaScript e CSS. Demo live: https://lorenzospizzaria.netlify.app/",
    en: "Pizzeria is a pizzeria/restaurant website built with JavaScript and CSS. Live demo: https://lorenzospizzaria.netlify.app/",
    sv: "Pizzeria är en pizzeria-/restaurangwebbplats byggd med JavaScript och CSS. Live-demo: https://lorenzospizzaria.netlify.app/",
  },
  {
    id: "project-weather-se",
    category: "project",
    keywords: ["weather app", "meteo", "weather", "väder", "app", "previsioni", "forecast", "prognos", "javascript", "api", "svezia", "sweden", "sverige"],
    it: "Weather App è un'app meteo costruita con JavaScript e API. Demo live: https://weather-se.netlify.app/",
    en: "Weather App is a weather app built with JavaScript and an API. Live demo: https://weather-se.netlify.app/",
    sv: "Weather App är en väderapp byggd med JavaScript och API. Live-demo: https://weather-se.netlify.app/",
  },
  {
    id: "project-couffer",
    category: "project",
    keywords: ["couffer", "salone", "salon", "salong", "parrucchiere", "hairdresser", "frisör", "gestione salone", "salon management", "salongshantering", "prenotazioni", "booking", "bokning", "e-commerce", "e-handel", "admin", "magazzino", "stock", "lager", "portale clienti", "client portal", "next.js", "tailwind", "typescript"],
    it: "Couffer è una piattaforma di gestione salone con prenotazioni, e-commerce prodotti e pannello admin. Costruita con Next.js 16, Tailwind 4 e TypeScript. Gestione completa del salone: prenotazioni, staff, magazzino prodotti e portale clienti in un unico pannello.",
    en: "Couffer is a salon management platform with booking, product e-commerce, and an admin panel. Built with Next.js 16, Tailwind 4 and TypeScript. Full salon management: bookings, staff, product stock and a client portal in a single panel.",
    sv: "Couffer är en salongshanteringsplattform med bokning, produkt-e-handel och adminpanel. Byggd med Next.js 16, Tailwind 4 och TypeScript. Komplett salongshantering: bokningar, personal, produktlager och kundportal i en enda panel.",
  },
  {
    id: "project-pizzeria-restaurant",
    category: "project",
    keywords: ["pizzeria restaurant", "ristorante", "restaurant", "restaurang", "pizzeria", "menu digitale", "digital menu", "digital meny", "ordini online", "online ordering", "onlinebeställning", "prenotazione tavoli", "table reservations", "bordsreservering", "admin", "pizza", "cibo", "food", "next.js", "tailwind", "typescript"],
    it: "Pizzeria Restaurant è un sito ristorante completo con menu digitale, ordini online e prenotazione tavoli. Costruito con Next.js 16, Tailwind 4 e TypeScript. Pannello admin per ordini online, prenotazioni tavoli e menu in tempo reale: meno telefonate, più coperti. Demo live: https://pizzeria-restaurant.vercel.app/",
    en: "Pizzeria Restaurant is a complete restaurant website with digital menu, online ordering, and table reservations. Built with Next.js 16, Tailwind 4 and TypeScript. An admin panel for online orders, table bookings and a live menu: fewer phone calls, more covers. Live demo: https://pizzeria-restaurant.vercel.app/",
    sv: "Pizzeria Restaurant är en fullständig restaurangwebbplats med digital meny, onlinebeställning och bordsreservering. Byggd med Next.js 16, Tailwind 4 och TypeScript. En adminpanel för onlinebeställningar, bordsbokningar och en live-meny: färre telefonsamtal, fler gäster. Live-demo: https://pizzeria-restaurant.vercel.app/",
  },
  // ── Services ───────────────────────────────────────────────────────────────
  {
    id: "service-sites-ecommerce",
    category: "service",
    keywords: ["siti", "sito web", "e-commerce", "negozio online", "website", "online store", "webshop", "ecommerce", "webb", "e-handel", "webbplats", "webbutik", "conversione", "conversion", "landing page", "vetrina"],
    it: "Siti e negozi online su misura per piccole e grandi aziende. Veloci, curati e fatti per trasformare i visitatori in clienti.",
    en: "Custom websites and online stores for businesses of any size. Fast, polished, built to turn visitors into customers.",
    sv: "Skräddarsydda webbplatser och webbutiker för företag i alla storlekar. Snabba, genomarbetade, byggda för att konvertera.",
  },
  {
    id: "service-visibility-seo",
    category: "service",
    keywords: ["visibilità online", "seo", "motori di ricerca", "essere trovati", "online visibility", "search engines", "ranking", "synlighet online", "sökmotorer", "sökmotoroptimering", "presenza", "presence", "närvaro", "google"],
    it: "Ti faccio trovare dai clienti giusti: SEO, struttura e presenza pensate per i motori di ricerca e per chi cerca te.",
    en: "I help the right clients find you: SEO, structure and presence built for search engines and for the people looking for you.",
    sv: "Jag hjälper rätt kunder att hitta dig: SEO, struktur och närvaro byggd för sökmotorer och för dem som letar efter dig.",
  },
  {
    id: "service-social-content",
    category: "service",
    keywords: ["contenuti social", "social media", "creazione contenuti", "costo zero", "social content", "content creation", "zero cost", "sociala innehåll", "sociala medier", "innehåll", "utan kostnad", "riconoscibilità", "brand"],
    it: "Creo contenuti per i social in modo semplice e a costo zero, così resti presente e riconoscibile senza perderci ore.",
    en: "I create social content simply and at zero cost, so you stay present and recognisable without losing hours.",
    sv: "Jag skapar innehåll för sociala medier enkelt och utan kostnad, så att du syns och känns igen utan att lägga timmar.",
  },
  {
    id: "service-automation",
    category: "service",
    keywords: ["automazioni", "automazione", "processi ripetitivi", "email", "fatture", "report", "automations", "repetitive tasks", "invoices", "reports", "workflow", "automationer", "mejl", "fakturor", "rapporter", "risparmio di tempo", "time saving"],
    it: "I processi ripetitivi li fa la macchina: email, fatture, report. Meno errori, più tempo per il lavoro che conta.",
    en: "Repetitive work runs itself: email, invoices, reports. Fewer errors, more time for the work that matters.",
    sv: "Repetitivt arbete sköter sig själv: mejl, fakturor, rapporter. Färre fel, mer tid för det som betyder något.",
  },
  {
    id: "service-web-data",
    category: "service",
    keywords: ["dati dal web", "web data", "web scraping", "raccolta dati", "data collection", "marketing", "webbdata", "datainsamling", "data från webben", "analisi", "analysis", "decisioni", "scraping"],
    it: "Raccolgo e organizzo dati dal web e li trasformo in valore concreto per le tue scelte di marketing.",
    en: "I collect and organise data from the web and turn it into real value for your marketing decisions.",
    sv: "Jag samlar in och organiserar data från webben och gör den till konkret värde för dina marknadsbeslut.",
  },
  {
    id: "service-ai-agents",
    category: "service",
    keywords: ["agenti ai", "agente ai", "ai agents", "intelligenza artificiale", "artificial intelligence", "email", "appuntamenti", "fatturazione", "riassunti clienti", "scheduling", "invoicing", "client summaries", "ai-agenter", "artificiell intelligens", "bokningar", "fakturering", "kundsammanfattningar", "solo founder", "chi lavora da solo", "ensam"],
    it: "Per chi lavora da solo: agenti su misura per email e appuntamenti, fatturazione, scrittura mail e riassunti dei clienti.",
    en: "For solo founders: custom agents for email and scheduling, invoicing, drafting mail and client summaries.",
    sv: "För dig som jobbar ensam: skräddarsydda agenter för mejl och bokningar, fakturering, mejlutkast och kundsammanfattningar.",
  },
  // ── Tools / stack ──────────────────────────────────────────────────────────
  {
    id: "stack-ai-automation",
    category: "tool",
    keywords: ["claude", "claude code", "mcp", "n8n", "openai", "langchain", "groq", "make", "zapier", "prompt design", "ai", "intelligenza artificiale", "automazione", "automation", "automatisering", "agenti", "agents", "agenter", "llm"],
    it: "AI / Automazione: gli strumenti principali sono Claude, Claude Code, MCP, n8n, OpenAI e LangChain, affiancati da Groq, Make, Zapier e il prompt design.",
    en: "AI / Automation: the primary tools are Claude, Claude Code, MCP, n8n, OpenAI and LangChain, supported by Groq, Make, Zapier and prompt design.",
    sv: "AI / Automation: de främsta verktygen är Claude, Claude Code, MCP, n8n, OpenAI och LangChain, kompletterade med Groq, Make, Zapier och prompt design.",
  },
  {
    id: "stack-frontend",
    category: "tool",
    keywords: ["react", "next.js", "nextjs", "typescript", "tailwind", "gsap", "framer motion", "scrolltrigger", "lenis", "three.js", "threejs", "mdx", "frontend", "front-end", "web", "sito", "siti", "website", "webbplats", "interfaccia", "interface", "gränssnitt"],
    it: "Frontend: gli strumenti principali sono React, Next.js, TypeScript, Tailwind e GSAP, con Framer Motion, ScrollTrigger, Lenis, Three.js e MDX a supporto.",
    en: "Frontend: the primary tools are React, Next.js, TypeScript, Tailwind and GSAP, supported by Framer Motion, ScrollTrigger, Lenis, Three.js and MDX.",
    sv: "Frontend: de främsta verktygen är React, Next.js, TypeScript, Tailwind och GSAP, kompletterade med Framer Motion, ScrollTrigger, Lenis, Three.js och MDX.",
  },
  {
    id: "stack-data-backend",
    category: "tool",
    keywords: ["supabase", "postgres", "postgresql", "prisma", "node.js", "nodejs", "playwright", "puppeteer", "rest", "webhook", "vercel", "python", "data", "dati", "backend", "database", "web data", "web scraping", "scraping"],
    it: "Dati / Backend: gli strumenti principali sono Supabase, Postgres, Prisma, Node.js e Playwright, con Puppeteer, REST, Webhook, Vercel e Python a supporto.",
    en: "Data / Backend: the primary tools are Supabase, Postgres, Prisma, Node.js and Playwright, supported by Puppeteer, REST, Webhook, Vercel and Python.",
    sv: "Data / Backend: de främsta verktygen är Supabase, Postgres, Prisma, Node.js och Playwright, kompletterade med Puppeteer, REST, Webhook, Vercel och Python.",
  },
  {
    id: "stack-design-craft",
    category: "tool",
    keywords: ["figma", "illustrator", "photoshop", "canva", "branding", "strategy", "strategia", "strategi", "ux/ui", "ux", "ui", "copywriting", "design", "grafica", "craft", "identità", "identity", "identitet", "formgivning"],
    it: "Design / Craft: gli strumenti principali sono Figma, Illustrator, Photoshop e Canva, con branding, strategia, UX/UI e copywriting a supporto.",
    en: "Design / Craft: the primary tools are Figma, Illustrator, Photoshop and Canva, supported by branding, strategy, UX/UI and copywriting.",
    sv: "Design / Craft: de främsta verktygen är Figma, Illustrator, Photoshop och Canva, kompletterade med branding, strategi, UX/UI och copywriting.",
  },
  // ── Engagements ────────────────────────────────────────────────────────────
  {
    id: "engagement-brand-system",
    category: "engagement",
    keywords: ["sistema di brand", "brand system", "varumärkessystem", "brand strategy", "strategia di brand", "varumärkesstrategi", "identità visiva", "visual identity", "messaggio", "messaging", "budskap", "asset di lancio", "launch assets", "branding", "collaborazione", "engagement", "samarbete"],
    it: "Sistema di brand: costruisco un sistema attorno a cosa vendi, a chi è rivolto e a come si trasforma in risultati concreti di business. Include strategia di brand, sistema di identità visiva, fondamenta del messaggio e asset di lancio.",
    en: "Brand System: build a system around what you sell, who it's for, and how it converts into business outcomes. Includes brand strategy, a visual identity system, a messaging foundation, and core launch assets.",
    sv: "Varumärkessystem: jag bygger ett system kring vad du säljer, vem det är för och hur det omvandlas till affärsresultat. Inkluderar varumärkesstrategi, ett visuellt identitetssystem, budskapsgrund och lanseringsmaterial.",
  },
  {
    id: "engagement-conversion-website",
    category: "engagement",
    keywords: ["sito che converte", "conversion website", "konverteringswebbplats", "sito web", "website", "webbplats", "strategia dell'offerta", "offer strategy", "copywriting", "ux", "ui", "design", "mobile", "cro", "conversion rate", "landing", "e-commerce", "collaborazione", "engagement", "samarbete"],
    it: "Sito che converte: un sito costruito attorno alla tua offerta, al tuo cliente e a un solo obiettivo, trasformare i visitatori in clienti. Include strategia dell'offerta, copywriting di brand, design UX/UI, ottimizzazione mobile e miglioramenti CRO.",
    en: "Conversion Website: a website built around your offer, your buyer, and one outcome: turning visitors into customers. Includes offer strategy, brand copywriting, UX/UI design, mobile optimization, and CRO improvements.",
    sv: "Konverteringswebbplats: en webbplats byggd kring ditt erbjudande, din köpare och ett enda mål, att förvandla besökare till kunder. Inkluderar erbjudandestrategi, varumärkescopy, UX/UI-design, mobiloptimering och CRO-förbättringar.",
  },
  {
    id: "engagement-retainer",
    category: "engagement",
    keywords: ["gestione continuativa", "retainer", "löpande uppdrag", "gestione del brand", "brand management", "varumärkeshantering", "creazione contenuti", "content creation", "esecuzione marketing", "marketing execution", "marknadsföring", "project manager", "abbonamento", "mensile", "ongoing", "continuativo", "collaborazione", "engagement", "samarbete"],
    it: "Gestione continuativa (retainer): gestisco l'output visivo, i contenuti e l'esecuzione marketing del tuo brand, così resti coerente e visibile senza assumere in casa. Include gestione del brand, creazione contenuti, esecuzione marketing e un project manager dedicato.",
    en: "Retainer: I run your brand's visual output, content, and marketing execution so you stay consistent and visible without hiring in-house. Includes brand management, content creation, marketing execution, and a dedicated project manager.",
    sv: "Löpande uppdrag (retainer): jag sköter ditt varumärkes visuella output, innehåll och marknadsföring så att du förblir konsekvent och synlig utan att anställa internt. Inkluderar varumärkeshantering, innehållsproduktion, marknadsföring och en dedikerad projektledare.",
  },
  {
    id: "engagements-how-it-works",
    category: "engagement",
    keywords: ["prezzo", "prezzi", "listino", "preventivo", "quanto costa", "price", "pricing", "quote", "cost", "pris", "kostnad", "offert", "call conoscitiva", "intro call", "introsamtal", "modulo di contatto", "contact form", "kontaktformulär", "come iniziare", "how to start", "come si lavora", "how i work", "compila il modulo", "fill the form", "fyll i formuläret"],
    it: "Le collaborazioni (sistema di brand, sito che converte, gestione continuativa) non hanno prezzi di listino fissi: lo scopo reale si definisce in una breve call conoscitiva. Ogni collaborazione parte da quella call e il modo per iniziare è compilare il modulo di contatto.",
    en: "The engagements (Brand System, Conversion Website, Retainer) have no fixed list prices: the real scope is set in a short intro call. Every engagement starts with that call, and the way to begin is to fill out the contact form.",
    sv: "Samarbetena (varumärkessystem, konverteringswebbplats, löpande uppdrag) har inga fasta listpriser: den verkliga omfattningen bestäms i ett kort introsamtal. Varje samarbete börjar med det samtalet, och du kommer igång genom att fylla i kontaktformuläret.",
  },
  // ── Pricing ────────────────────────────────────────────────────────────────
  {
    id: "pricing-one-off-payment",
    category: "pricing",
    keywords: ["pagamento unico", "una tantum", "una volta", "one-off", "pay once", "engångsbetalning", "betala en gång", "prezzo progetto", "costo", "quanto costa", "preventivo", "supporto incluso", "3 mesi supporto", "nessun ricorrente", "no recurring", "lavoro finito", "finished work", "price", "pris", "kostnad", "offert"],
    it: "Una delle opzioni è il pagamento unico: paghi una volta e ricevi il lavoro finito, con 3 mesi di supporto inclusi; dopodiché è tuo, senza costi ricorrenti. La cifra viene preventivata progetto per progetto.",
    en: "One option is a one-off payment: you pay once and get the finished work, with 3 months of support included, then it's yours with no recurring cost. The figure is quoted per project.",
    sv: "Ett alternativ är en engångsbetalning: du betalar en gång och får det färdiga arbetet, med 3 månaders support inkluderat, och sedan är det ditt utan löpande kostnad. Summan offereras per projekt.",
  },
  {
    id: "pricing-subscription-tiers",
    category: "pricing",
    keywords: ["abbonamento", "subscription", "abonnemang", "all-inclusive", "tutto incluso", "25 euro al mese", "25€/mese", "39 euro al mese", "39€/mese", "hosting", "dominio", "domain", "domän", "aggiornamenti", "updates", "supporto", "gestione contenuti", "content management", "innehållshantering", "mensile", "monthly", "månad", "sito web incluso", "quanto costa un sito", "prezzo sito", "pris webbplats"],
    it: "C'è anche un abbonamento tutto incluso: 25€/mese coprono sito, hosting, dominio, aggiornamenti e supporto; oppure 39€/mese che aggiungono la gestione attiva dei contenuti (modifiche mensili a testi e sezioni, aggiornamento foto, piccole modifiche).",
    en: "There's also an all-inclusive subscription: 25€/month covers the site, hosting, domain, updates and support; or 39€/month which adds active content management (monthly text and section changes, photo updates, small tweaks).",
    sv: "Det finns även ett allt-inkluderat abonnemang: 25€/månad täcker webbplatsen, hosting, domän, uppdateringar och support; eller 39€/månad som lägger till aktiv innehållshantering (månatliga text- och sektionsändringar, fotouppdateringar, små justeringar).",
  },
  {
    id: "pricing-complex-work-consultation",
    category: "pricing",
    keywords: ["lavoro complesso", "complex work", "komplext arbete", "automazioni", "automation", "agenti ai", "ai agents", "integrazioni", "integrations", "integrationer", "preventivo personalizzato", "tailored quote", "skräddarsydd offert", "consulenza", "consultation", "konsultation", "prezzo automazione", "quanto costa un agente ai"],
    it: "Per il lavoro complesso — automazioni, agenti AI, integrazioni su misura — si parte da una consulenza personalizzata e un preventivo dedicato. Per numeri esatti, meglio una chiamata veloce o hello@lorenzo.hacks.",
    en: "For complex work — automations, AI agents, custom integrations — it starts with a personalised consultation and a tailored quote. For exact numbers, a quick call or hello@lorenzo.hacks is best.",
    sv: "För komplext arbete — automatiseringar, AI-agenter, skräddarsydda integrationer — börjar det med en personlig konsultation och en skräddarsydd offert. För exakta siffror är ett snabbt samtal eller hello@lorenzo.hacks bäst.",
  },
  {
    id: "pricing-no-fixed-figure",
    category: "pricing",
    keywords: ["prezzo fisso", "fixed price", "fast pris", "quanto costa", "how much", "hur mycket kostar", "preventivo", "quote", "offert", "caso per caso", "case by case", "fall till fall", "stima", "estimate", "uppskattning", "chiamata", "call", "samtal", "contatto", "contact", "kontakt"],
    it: "Ogni lavoro viene preventivato caso per caso, quindi non c'è una cifra fissa di sviluppo. Invece di inventare un numero, Lorenzo spiega cosa determina il costo e propone una chiamata veloce o un contatto a hello@lorenzo.hacks per una stima reale.",
    en: "Every job is quoted case by case, so there's no fixed development figure. Rather than inventing a number, Lorenzo explains what drives the cost and offers a quick call or hello@lorenzo.hacks for a real estimate.",
    sv: "Varje uppdrag offereras från fall till fall, så det finns ingen fast utvecklingssumma. I stället för att hitta på en siffra förklarar Lorenzo vad som driver kostnaden och erbjuder ett snabbt samtal eller hello@lorenzo.hacks för en riktig uppskattning.",
  },
  // ── Membership ─────────────────────────────────────────────────────────────
  {
    id: "membership-overview",
    category: "membership",
    keywords: ["membership", "abbonamenti", "medlemskap", "piani", "plans", "planer", "prezzi", "pricing", "priser", "prompt", "workflow", "guide", "guides", "guider", "sblocca", "unlock", "lås upp", "da 5 euro al mese", "from 5 euro", "från 5€", "stripe", "cancella quando vuoi", "cancel anytime", "avsluta när du vill"],
    it: "La membership sblocca prompt, workflow e guide, a partire da 5€/mese. I pagamenti sono sicuri tramite Stripe e puoi passare a un livello superiore o cancellare in qualsiasi momento.",
    en: "The membership unlocks prompts, workflows, and guides, from €5/mo. Payments are secure via Stripe and you can upgrade or cancel anytime.",
    sv: "Medlemskapet låser upp prompts, workflows och guider, från 5€/mån. Betalningar sker säkert via Stripe och du kan uppgradera eller avsluta när du vill.",
  },
  {
    id: "membership-tier-free",
    category: "membership",
    keywords: ["free", "gratis", "gratuito", "piano free", "free plan", "gratisplan", "0 euro", "blog", "articoli", "articles", "artiklar", "demo", "progetti pubblici", "public projects", "contenuti gratuiti", "free content", "gratis innehåll", "inizia gratis"],
    it: "Il piano Free costa 0€ per sempre e dà accesso base al portfolio: blog e articoli visibili, demo dei progetti pubblici e contenuti free sempre accessibili.",
    en: "The Free plan costs €0 forever and gives basic portfolio access: visible blog and articles, public demo projects, and free content always accessible.",
    sv: "Free-planen kostar 0€ för alltid och ger grundläggande portföljåtkomst: synlig blogg och artiklar, offentliga demoprojekt och gratis innehåll som alltid är tillgängligt.",
  },
  {
    id: "membership-tier-supporter",
    category: "membership",
    keywords: ["supporter", "piano supporter", "supporter plan", "5 euro al mese", "5€/mese", "5€/mån", "prompt immagini ai", "midjourney", "dall-e", "prompt video ai", "runway", "pika", "trucchi avanzati", "advanced tricks", "tekniker", "contenuti esclusivi", "exclusive content", "exklusivt innehåll", "ogni settimana", "weekly", "varje vecka"],
    it: "Il piano Supporter costa 5€/mese ed è per chi vuole approfondire: include tutto del piano Free più prompt per immagini AI (Midjourney, DALL·E), prompt per video AI (Runway, Pika), trucchi e tecniche avanzate e contenuti esclusivi ogni settimana.",
    en: "The Supporter plan costs €5/month and is for those who want to go deeper: it includes everything in Free plus AI image prompts (Midjourney, DALL·E), AI video prompts (Runway, Pika), advanced tricks and techniques, and exclusive content every week.",
    sv: "Supporter-planen kostar 5€/månad och är för dem som vill fördjupa sig: den inkluderar allt i Free plus prompts för AI-bilder (Midjourney, DALL·E), prompts för AI-video (Runway, Pika), avancerade trick och tekniker samt exklusivt innehåll varje vecka.",
  },
  {
    id: "membership-tier-pro",
    category: "membership",
    keywords: ["pro", "piano pro", "pro plan", "20 euro al mese", "20€/mese", "20€/mån", "più popolare", "most popular", "mest populär", "workflow n8n", "n8n", "strumenti avanzati", "advanced tools", "progetti completi", "full projects", "codice", "code", "kod", "consulenza prioritaria", "priority support", "early access", "professionisti", "creator"],
    it: "Il piano Pro costa 20€/mese ed è il più popolare, pensato per professionisti e creator: include tutto del piano Supporter più workflow n8n personalizzati, strumenti avanzati di lavoro, progetti completi con codice, consulenza prioritaria via email e accesso in anteprima ai nuovi tool.",
    en: "The Pro plan costs €20/month and is the most popular, made for professionals and creators: it includes everything in Supporter plus custom n8n workflows, advanced work tools, full projects with code, priority email support, and early access to new tools.",
    sv: "Pro-planen kostar 20€/månad och är den mest populära, gjord för proffs och kreatörer: den inkluderar allt i Supporter plus skräddarsydda n8n-workflows, avancerade arbetsverktyg, kompletta projekt med kod, prioriterad e-postsupport och tidig tillgång till nya verktyg.",
  },
  {
    id: "membership-free-vs-paid-content",
    category: "membership",
    keywords: ["contenuti gratis", "free content", "gratis innehåll", "contenuti a pagamento", "paid content", "betalt innehåll", "differenza", "difference", "skillnad", "cosa è gratis", "what is free", "vad är gratis", "blog gratis", "guide gratuite", "free guides", "esclusivo", "exclusive", "paywall"],
    it: "I contenuti gratuiti — blog, articoli e demo dei progetti pubblici — restano sempre accessibili senza abbonarsi. I contenuti a pagamento (prompt, workflow, progetti completi con codice, tecniche avanzate) si sbloccano con i piani Supporter (5€/mese) o Pro (20€/mese).",
    en: "Free content — blog, articles, and public demo projects — stays accessible without subscribing. Paid content (prompts, workflows, full projects with code, advanced techniques) is unlocked with the Supporter (€5/month) or Pro (€20/month) plans.",
    sv: "Gratis innehåll — blogg, artiklar och offentliga demoprojekt — förblir tillgängligt utan abonnemang. Betalt innehåll (prompts, workflows, kompletta projekt med kod, avancerade tekniker) låses upp med Supporter- (5€/månad) eller Pro-planen (20€/månad).",
  },
  // ── Bio ────────────────────────────────────────────────────────────────────
  {
    id: "bio-background-experience",
    category: "bio",
    keywords: ["lorenzo", "chi è", "background", "esperienza", "react", "next.js", "frontend", "sviluppatore", "developer", "design", "branding", "concept", "sei anni", "6 anni", "experience", "six years", "designer", "erfarenhet", "utvecklare", "bakgrund", "hyper island", "alumni", "alumnus", "formazione", "education", "utbildning", "competenze", "skills"],
    it: "Lorenzo Dastoli lavora nel punto in cui si incontrano sviluppo web, automazione e AI. Alle spalle ha sei anni a sviluppare frontend in React e Next.js e un background nel design tra branding e concept; è alumnus di Hyper Island. Tratta il codice come uno strumento per risolvere problemi concreti di business.",
    en: "Lorenzo Dastoli works where web development, automation and AI meet. He brings six years shipping React and Next.js frontends plus a design background in branding and concept, and is a Hyper Island alumnus. He treats code as a tool to solve concrete business problems.",
    sv: "Lorenzo Dastoli arbetar där webbutveckling, automation och AI möts. Han har sex år bakom sig med React- och Next.js-frontends och en designbakgrund inom branding och koncept, och är Hyper Island-alumn. Han behandlar kod som ett verktyg för att lösa konkreta affärsproblem.",
  },
  {
    id: "bio-location",
    category: "bio",
    keywords: ["dove", "sede", "location", "stoccolma", "stockholm", "svezia", "sweden", "sverige", "europa", "europe", "remoto", "remote", "distans", "based", "città", "where", "var"],
    it: "Lorenzo ha sede a Stoccolma, in Svezia. Lavora in tutta Europa e da remoto.",
    en: "Lorenzo is based in Stockholm, Sweden. He works across Europe and remotely.",
    sv: "Lorenzo är baserad i Stockholm, Sverige. Han arbetar i hela Europa och på distans.",
  },
  {
    id: "bio-availability",
    category: "bio",
    keywords: ["disponibile", "disponibilità", "available", "availability", "tillgänglig", "progetti", "projects", "projekt", "2026", "maggio", "may", "maj", "quando", "when", "när", "libero", "booking", "prenotare", "ingaggiare", "hire"],
    it: "Lorenzo è disponibile per nuovi progetti da maggio 2026.",
    en: "Lorenzo is available for new projects from May 2026.",
    sv: "Lorenzo är tillgänglig för nya projekt från maj 2026.",
  },
  {
    id: "bio-languages",
    category: "bio",
    keywords: ["lingue", "languages", "språk", "italiano", "italian", "italienska", "inglese", "english", "engelska", "svedese", "swedish", "svenska", "clienti", "clients", "klienter", "parla", "speaks", "talar"],
    it: "Lorenzo lavora principalmente con clienti italiani, ma anche in inglese e svedese (IT · EN · SV).",
    en: "Lorenzo works mostly with Italian clients, but also in English and Swedish (IT · EN · SV).",
    sv: "Lorenzo arbetar mestadels med italienska kunder, men även på engelska och svenska (IT · EN · SV).",
  },
  // ── Contact ────────────────────────────────────────────────────────────────
  {
    id: "contact-channels",
    category: "contact",
    keywords: ["contatto", "contatti", "contact", "kontakt", "email", "e-mail", "e-post", "posta", "telefono", "phone", "telefon", "numero", "number", "linkedin", "github", "social", "canali", "channels", "kanaler", "hello@lorenzo.hacks", "looziolooz"],
    it: "Puoi contattare lorenzo.hacks via email a hello@lorenzo.hacks, per telefono al +46 (0)763 12 33 45, su LinkedIn (in/lorenzo-dastoli) e su GitHub (@Looziolooz). Tempo di risposta entro 24 ore.",
    en: "You can reach lorenzo.hacks by email at hello@lorenzo.hacks, by phone at +46 (0)763 12 33 45, on LinkedIn (in/lorenzo-dastoli) and on GitHub (@Looziolooz). Reply within 24 hours.",
    sv: "Du kan nå lorenzo.hacks via e-post på hello@lorenzo.hacks, per telefon på +46 (0)763 12 33 45, på LinkedIn (in/lorenzo-dastoli) och på GitHub (@Looziolooz). Svar inom 24 timmar.",
  },
  {
    id: "how-to-start",
    category: "contact",
    keywords: ["come iniziare", "how to start", "hur man börjar", "iniziare", "start", "börja", "primo passo", "next step", "nästa steg", "prenota", "book", "boka", "chiamata", "call", "samtal", "modulo", "form", "formulär", "preventivo", "consulenza", "contattare"],
    it: "Il primo passo è una breve chiamata conoscitiva oppure scrivere a hello@lorenzo.hacks o compilare il modulo di contatto, raccontando il problema o l'idea da realizzare. La risposta arriva entro 24 ore.",
    en: "The next step is a quick intro call, or emailing hello@lorenzo.hacks or filling in the contact form, describing the problem or idea you'd like to tackle. Reply comes within 24 hours.",
    sv: "Första steget är ett kort introsamtal, eller att mejla hello@lorenzo.hacks eller fylla i kontaktformuläret och berätta om problemet eller idén du vill förverkliga. Svar kommer inom 24 timmar.",
  },
  // ── FAQ (completeness pass) ────────────────────────────────────────────────
  {
    id: "faq-delivery-timelines",
    category: "faq",
    keywords: ["tempi", "tempi di consegna", "quanto tempo", "quanto ci vuole", "scadenze", "consegna", "timeline", "delivery time", "how long", "turnaround", "deadline", "leveranstid", "hur lång tid", "tidslinje"],
    it: "I tempi dipendono dall'ambito del lavoro: un sito semplice di solito richiede qualche settimana, mentre automazioni, agenti AI o piattaforme più complesse richiedono di più e vengono pianificati dopo la call conoscitiva. Per una stima precisa basta raccontare il progetto.",
    en: "Timelines depend on scope: a simple site usually takes a few weeks, while automations, AI agents or more complex platforms take longer and are planned after the intro call. For a precise estimate, just describe the project.",
    sv: "Tidsramen beror på omfattningen: en enkel sajt tar oftast några veckor, medan automationer, AI-agenter eller mer komplexa plattformar tar längre tid och planeras efter introsamtalet. För en exakt uppskattning, beskriv bara projektet.",
  },
  {
    id: "faq-revisions",
    category: "faq",
    keywords: ["revisioni", "modifiche", "correzioni", "round di revisione", "quante modifiche", "revisions", "changes", "edits", "feedback rounds", "revideringar", "ändringar", "justeringar"],
    it: "Le modifiche fanno parte del processo: durante il progetto si lavora a giri di feedback finché il risultato non è quello giusto, senza un limite rigido fissato a contratto. Con l'abbonamento all-inclusive le piccole modifiche restano incluse anche dopo il lancio.",
    en: "Revisions are part of the process: during the project we work in feedback rounds until the result is right, without a rigid contractual cap. With the all-inclusive subscription, small changes stay included even after launch.",
    sv: "Ändringar är en del av processen: under projektet jobbar vi i feedbackrundor tills resultatet sitter, utan ett strikt kontraktstak. Med det allt-inkluderade abonnemanget ingår små ändringar även efter lansering.",
  },
  {
    id: "faq-ownership-site-domain-code",
    category: "faq",
    keywords: ["proprietà", "a chi appartiene", "dominio", "codice", "possesso", "di chi è il sito", "ownership", "who owns", "domain", "source code", "yours", "ägande", "vem äger", "domän", "källkod"],
    it: "Con il pagamento una tantum il lavoro finito è tuo: dopo i 3 mesi di supporto inclusi resta tuo senza costi ricorrenti. Sito, dominio e codice appartengono a te; con l'abbonamento all-inclusive dominio e hosting sono gestiti da Lorenzo finché l'abbonamento è attivo.",
    en: "With the one-off payment the finished work is yours: after the 3 months of included support it stays yours with no recurring cost. The site, domain and code belong to you; with the all-inclusive subscription the domain and hosting are managed by Lorenzo while the subscription is active.",
    sv: "Med engångsbetalningen är det färdiga arbetet ditt: efter de 3 månaderna med support som ingår förblir det ditt utan löpande kostnad. Sajt, domän och kod tillhör dig; med det allt-inkluderade abonnemanget sköts domän och hosting av Lorenzo så länge abonnemanget är aktivt.",
  },
  {
    id: "faq-hosting-maintenance",
    category: "faq",
    keywords: ["hosting", "manutenzione", "dopo il lancio", "supporto", "aggiornamenti", "dominio incluso", "maintenance", "after launch", "support", "updates", "underhåll", "efter lansering", "uppdateringar"],
    it: "Dopo il lancio ci sono due strade: con il pagamento una tantum sono inclusi 3 mesi di supporto e poi il sito è tuo da gestire. In alternativa l'abbonamento all-inclusive da 25€/mese copre sito, hosting, dominio, aggiornamenti e supporto continui; a 39€/mese si aggiunge la gestione attiva dei contenuti.",
    en: "After launch there are two paths: with the one-off payment you get 3 months of support included, then the site is yours to run. Alternatively the all-inclusive subscription at €25/month covers the site, hosting, domain, updates and ongoing support; at €39/month it adds active content management.",
    sv: "Efter lansering finns två vägar: med engångsbetalningen ingår 3 månaders support, sedan är sajten din att sköta. Alternativt täcker det allt-inkluderade abonnemanget på 25€/mån sajt, hosting, domän, uppdateringar och löpande support; för 39€/mån tillkommer aktiv innehållshantering.",
  },
  {
    id: "faq-ecommerce-platforms",
    category: "faq",
    keywords: ["e-commerce", "ecommerce", "negozio online", "shop", "carrello", "vendere online", "piattaforma", "online store", "cart", "sell online", "platform", "webbutik", "e-handel", "sälja online"],
    it: "Lorenzo costruisce negozi online su misura con stack moderno (Next.js e TypeScript), con catalogo prodotti, carrello, gestione magazzino e pannello admin, come nei progetti Couffer e Pizzeria Restaurant. Non è legato a un'unica piattaforma: la soluzione si adatta a cosa vendi e a come vuoi gestirlo.",
    en: "Lorenzo builds custom online stores on a modern stack (Next.js and TypeScript), with product catalogue, cart, stock management and an admin panel, like the Couffer and Pizzeria Restaurant projects. He isn't tied to a single platform: the solution adapts to what you sell and how you want to run it.",
    sv: "Lorenzo bygger skräddarsydda webbutiker på en modern stack (Next.js och TypeScript), med produktkatalog, varukorg, lagerhantering och adminpanel, som i projekten Couffer och Pizzeria Restaurant. Han är inte låst till en enda plattform: lösningen anpassas efter vad du säljer och hur du vill sköta det.",
  },
  {
    id: "faq-seo-specifics",
    category: "faq",
    keywords: ["seo", "google", "posizionamento", "essere trovato", "visibilità", "motori di ricerca", "ranking", "search engines", "get found", "visibility", "synlighet", "sökmotorer", "hittas på google"],
    it: "La visibilità non è un add-on: i siti nascono già con struttura, contenuti e impostazioni pensate per i motori di ricerca e per chi cerca te. Lorenzo lavora su SEO tecnica, struttura delle pagine e presenza online, e i siti multilingua (IT/EN/SV) aiutano a raggiungere clienti italiani e internazionali.",
    en: "Visibility isn't an add-on: sites are built from the start with structure, content and setup made for search engines and for the people looking for you. Lorenzo works on technical SEO, page structure and online presence, and multilingual sites (IT/EN/SV) help reach Italian and international clients.",
    sv: "Synlighet är inget tillägg: sajterna byggs från start med struktur, innehåll och inställningar gjorda för sökmotorer och för dem som letar efter dig. Lorenzo jobbar med teknisk SEO, sidstruktur och närvaro online, och flerspråkiga sajter (IT/EN/SV) hjälper att nå italienska och internationella kunder.",
  },
  {
    id: "faq-payment-invoicing",
    category: "faq",
    keywords: ["pagamento", "fattura", "fatturazione", "come si paga", "metodi di pagamento", "stripe", "carta", "payment", "invoice", "billing", "how to pay", "card", "betalning", "faktura", "betalningssätt", "kort"],
    it: "Per i progetti il pagamento è una tantum (lavoro finito) oppure un abbonamento mensile all-inclusive (25€ o 39€ al mese). Gli abbonamenti al sito (Supporter, Pro) si pagano in modo sicuro con carta tramite Stripe e si possono disdire quando vuoi; per i progetti su misura le condizioni si concordano nella call conoscitiva.",
    en: "For projects, payment is either one-off (finished work) or a monthly all-inclusive subscription (€25 or €39/month). The site memberships (Supporter, Pro) are paid securely by card via Stripe and can be cancelled anytime; for custom projects the terms are agreed in the intro call.",
    sv: "För projekt är betalningen antingen en engångsbetalning (färdigt arbete) eller ett månadsvis allt-inkluderat abonnemang (25€ eller 39€/mån). Sajtens medlemskap (Supporter, Pro) betalas säkert med kort via Stripe och kan sägas upp när som helst; för skräddarsydda projekt avtalas villkoren i introsamtalet.",
  },
  {
    id: "faq-remote-onsite-countries",
    category: "faq",
    keywords: ["remoto", "in presenza", "dove lavori", "paesi", "italia", "svezia", "europa", "a distanza", "remote", "on-site", "countries", "where do you work", "italy", "sweden", "europe", "distans", "på plats", "länder", "var jobbar du"],
    it: "Lorenzo lavora da remoto con base a Stoccolma e collabora con clienti in tutta Europa, soprattutto italiani ma anche inglesi e svedesi. Tutto il processo — call, sviluppo, consegna — funziona online, quindi la posizione del cliente non è un limite.",
    en: "Lorenzo works remotely, based in Stockholm, and collaborates with clients across Europe — mostly Italian, but also English and Swedish. The whole process — calls, development, delivery — runs online, so the client's location isn't a limit.",
    sv: "Lorenzo jobbar på distans med bas i Stockholm och samarbetar med kunder i hela Europa — främst italienska, men även engelska och svenska. Hela processen — samtal, utveckling, leverans — sker online, så kundens plats är ingen begränsning.",
  },
  {
    id: "faq-languages-spoken",
    category: "faq",
    keywords: ["lingue", "che lingue parli", "italiano", "inglese", "svedese", "comunicazione", "languages", "what languages", "italian", "english", "swedish", "språk", "vilka språk", "italienska", "engelska", "svenska"],
    it: "Lorenzo lavora in italiano, inglese e svedese, così la comunicazione e i materiali del progetto possono essere nella tua lingua. L'assistente del sito risponde anche in altre lingue, adattandosi a quella in cui scrivi.",
    en: "Lorenzo works in Italian, English and Swedish, so communication and project materials can be in your language. The site assistant also replies in other languages, adapting to whichever one you write in.",
    sv: "Lorenzo jobbar på italienska, engelska och svenska, så kommunikation och projektmaterial kan vara på ditt språk. Sajtens assistent svarar även på andra språk och anpassar sig till det du skriver på.",
  },
  {
    id: "faq-response-time",
    category: "faq",
    keywords: ["tempo di risposta", "quanto risponde", "rispondi presto", "risposta", "24 ore", "response time", "how fast reply", "get back to me", "svarstid", "hur snabbt svar", "återkoppling"],
    it: "Lorenzo risponde di solito entro 24 ore. L'assistente del sito invece risponde subito, a qualsiasi ora, e può già spiegarti cosa può fare Lorenzo e cosa guida il prezzo prima ancora di sentirlo.",
    en: "Lorenzo usually replies within 24 hours. The site assistant, on the other hand, answers instantly, any time of day, and can already explain what Lorenzo can do and what drives the price before you even speak to him.",
    sv: "Lorenzo svarar oftast inom 24 timmar. Sajtens assistent svarar däremot direkt, när som helst på dygnet, och kan redan förklara vad Lorenzo kan göra och vad som påverkar priset innan du ens pratar med honom.",
  },
  {
    id: "faq-free-intro-call",
    category: "faq",
    keywords: ["call conoscitiva", "chiamata gratuita", "consulenza gratuita", "primo incontro", "preventivo", "come iniziare", "free call", "intro call", "discovery call", "free consultation", "quote", "introsamtal", "gratis samtal", "kostnadsfri konsultation", "offert"],
    it: "Sì: ogni collaborazione parte da una breve call conoscitiva, senza impegno, per capire il problema e trovare la soluzione giusta. Da lì arriva un preventivo su misura; per fissarla basta scrivere a hello@lorenzo.hacks o compilare il modulo nella sezione contatti.",
    en: "Yes: every engagement starts with a short, no-obligation intro call to understand the problem and find the right solution. From there you get a tailored quote; to set it up just email hello@lorenzo.hacks or fill the form in the contact section.",
    sv: "Ja: varje samarbete börjar med ett kort, förutsättningslöst introsamtal för att förstå problemet och hitta rätt lösning. Därifrån får du en skräddarsydd offert; för att boka, mejla hello@lorenzo.hacks eller fyll i formuläret i kontaktsektionen.",
  },
  {
    id: "faq-agents-run-cost-free-groq",
    category: "faq",
    keywords: ["costo agente", "agente ai gratis", "groq", "costi llm", "spese ai", "costo zero", "questo assistente", "agent cost", "ai agent free", "llm cost", "no cost", "this assistant", "agentkostnad", "gratis ai-agent", "kostnadsfri ai"],
    it: "Gli agenti AI che costruisce Lorenzo — incluso questo assistente con cui stai parlando — possono girare a costo zero usando Groq come motore AI, quindi non c'è una bolletta mensile per token o per chiamate al modello. È lo stesso tipo di agente sempre attivo che può rispondere ai clienti per la tua attività.",
    en: "The AI agents Lorenzo builds — including this very assistant you're talking to — can run cost-free using Groq as the AI engine, so there's no monthly bill for tokens or model calls. It's the same kind of always-on agent that can answer clients for your business.",
    sv: "AI-agenterna som Lorenzo bygger — inklusive den här assistenten du pratar med — kan köras kostnadsfritt med Groq som AI-motor, så det finns ingen månadsräkning för tokens eller modellanrop. Det är samma sorts alltid-på-agent som kan svara kunder åt ditt företag.",
  },
  {
    id: "faq-data-privacy-gdpr",
    category: "faq",
    keywords: ["gdpr", "privacy", "dati personali", "trattamento dati", "sicurezza dati", "cookie", "conformità", "data privacy", "personal data", "data handling", "security", "compliance", "dataskydd", "personuppgifter", "integritet", "säkerhet"],
    it: "Lorenzo costruisce siti e automazioni con attenzione alla privacy e ai dati: i tuoi dati e quelli dei tuoi clienti restano sotto il tuo controllo e si raccoglie solo ciò che serve. Per esigenze specifiche di GDPR o trattamento dati se ne parla nella call così da impostare tutto in modo corretto.",
    en: "Lorenzo builds sites and automations with privacy and data in mind: your data and your clients' data stay under your control, and only what's needed is collected. For specific GDPR or data-handling needs, it's discussed in the call so everything is set up correctly.",
    sv: "Lorenzo bygger sajter och automationer med integritet och data i åtanke: dina och dina kunders uppgifter förblir under din kontroll, och bara det som behövs samlas in. Specifika GDPR- eller databehandlingsbehov tas upp i samtalet så att allt sätts upp korrekt.",
  },
  {
    id: "faq-process-how-project-runs",
    category: "faq",
    keywords: ["processo", "come funziona un progetto", "fasi", "passaggi", "come si lavora", "iter", "process", "how a project works", "steps", "stages", "workflow", "hur ett projekt fungerar", "steg", "faser"],
    it: "Un progetto segue un percorso chiaro: parte da una breve call conoscitiva per capire problema e obiettivo, poi strategia e design, sviluppo con giri di feedback, e infine lancio con supporto incluso. Per i lavori complessi (automazioni, agenti AI, integrazioni) si parte da una consulenza personalizzata e un preventivo su misura.",
    en: "A project follows a clear path: it starts with a short intro call to understand the problem and goal, then strategy and design, development with feedback rounds, and finally launch with support included. For complex work (automations, AI agents, integrations) it starts with a personalised consultation and a tailored quote.",
    sv: "Ett projekt följer en tydlig väg: det börjar med ett kort introsamtal för att förstå problem och mål, sedan strategi och design, utveckling med feedbackrundor, och slutligen lansering med support inkluderad. För komplexa uppdrag (automationer, AI-agenter, integrationer) börjar det med en personlig konsultation och en skräddarsydd offert.",
  },
  {
    id: "faq-mobile-responsive",
    category: "faq",
    keywords: ["mobile", "responsive", "cellulare", "telefono", "tablet", "adattabile", "mobile-friendly", "phone", "mobil", "responsiv", "telefon", "surfplatta"],
    it: "Tutti i siti sono ottimizzati per mobile e si adattano a telefono, tablet e desktop: i clienti oggi arrivano soprattutto da smartphone, quindi l'esperienza è curata su ogni schermo.",
    en: "Every site is mobile-optimized and adapts to phone, tablet and desktop: most visitors today come from smartphones, so the experience is polished on every screen.",
    sv: "Alla sajter är mobiloptimerade och anpassar sig till telefon, surfplatta och desktop: de flesta besökare kommer idag från mobilen, så upplevelsen är genomarbetad på varje skärm.",
  },
  {
    id: "faq-multilingual-sites",
    category: "faq",
    keywords: ["multilingua", "più lingue", "sito in più lingue", "traduzione", "internazionale", "i18n", "multilingual", "multiple languages", "translation", "international", "flerspråkig", "flera språk", "översättning", "internationell"],
    it: "Lorenzo costruisce siti multilingua (per esempio IT/EN/SV), utili per raggiungere clienti italiani e internazionali da un unico sito, come nei progetti Atelier Solari e Nordhem. Le lingue si scelgono in base al tuo mercato.",
    en: "Lorenzo builds multilingual sites (for example IT/EN/SV), useful for reaching Italian and international clients from a single site, as in the Atelier Solari and Nordhem projects. The languages are chosen based on your market.",
    sv: "Lorenzo bygger flerspråkiga sajter (till exempel IT/EN/SV), användbart för att nå italienska och internationella kunder från en enda sajt, som i projekten Atelier Solari och Nordhem. Språken väljs utifrån din marknad.",
  },
];

export const KNOWLEDGE: KBEntry[] = RAW.map((e) => ({
  id: e.id,
  category: e.category,
  keywords: e.keywords,
  text: { IT: e.it, EN: e.en, SV: e.sv },
}));
