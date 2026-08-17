import type { Lang } from "@/i18n";

// Visual previews for the two services that were hardest to picture: online
// visibility and web data.
//
// ── The honesty constraint on the visibility one ───────────────────────────────
// The obvious demo is a before/after ranking: "position 8 → position 2". It is
// also a lie. These are demonstration projects, no ranking was ever won for
// them, and inventing one is the same offence as inventing a testimonial, in a
// smaller font. Worse, it promises the one thing nobody honest can promise.
//
// So the demo shows a MECHANICAL consequence instead, which is true by
// construction and checkable by the visitor on their own site: what a search
// engine can read off the page, and what an AI assistant can answer about the
// business from it. Missing title, address living only in prose, no structured
// data — the snippet renders poorly and the assistant says it does not know.
// Fix those and both of them change, with no claim about where anyone ranks.
//
// ── The web-data one ───────────────────────────────────────────────────────────
// Shows the artefact: public listings going in, an ordered sheet coming out,
// with the summary lines that make the sheet worth having. Figures are labelled
// as a sample, not as a market study anyone commissioned.

export type VisibilityCase = {
  id: string;
  /** What someone types, or asks an assistant. */
  query: string;
  business: string;
  /** The one thing missing on the page. */
  gap: string;
  fix: string;
  /** Search result snippet, before and after the fix. */
  serpBefore: { title: string; url: string; desc: string };
  serpAfter: { title: string; url: string; desc: string };
  /** What an AI assistant can say about the business, before and after. */
  aiBefore: string;
  aiAfter: string;
};

export type VisibilityCopy = {
  hint: string;
  disclaimer: string;
  beforeLabel: string;
  afterLabel: string;
  s1: string;
  s2: string;
  s2fixed: string;
  serpTitle: string;
  aiTitle: string;
  aiPrompt: string;
  cases: VisibilityCase[];
};

export type WebDataRow = { name: string; area: string; rating: string; site: boolean };

export type WebDataCase = {
  id: string;
  label: string;
  tag: string;
  rule: string;
  rows: WebDataRow[];
  findings: string[];
};

export type WebDataCopy = {
  hint: string;
  disclaimer: string;
  s1: string;
  s2: string;
  s3: string;
  colName: string;
  colArea: string;
  colRating: string;
  colSite: string;
  yes: string;
  no: string;
  findingsTitle: string;
  cases: WebDataCase[];
};

const VISIBILITY: Record<Lang, VisibilityCopy> = {
  it: {
    hint: "Scegli cosa cerca un cliente. A sinistra quello che Google riesce a leggere della pagina, a destra quello che un assistente AI riesce a rispondere. Il pulsante mostra la stessa pagina prima e dopo la sistemata.",
    disclaimer: "Esempi costruiti su progetti dimostrativi. Mostrano cosa cambia sulla pagina, non una posizione promessa: dove finisci in classifica non lo decide né io né nessun altro fornitore.",
    beforeLabel: "Com’era",
    afterLabel: "Sistemata",
    s1: "Cosa cerca il cliente",
    s2: "Cosa mancava sulla pagina",
    s2fixed: "Cosa è stato sistemato",
    serpTitle: "Come ti legge Google",
    aiTitle: "Cosa risponde un assistente AI",
    aiPrompt: "Domanda posta all’assistente",
    cases: [
      {
        id: "gelato",
        query: "gelateria artigianale aperta ora a Cosenza",
        business: "Artigiano Gelateria",
        gap: "Indirizzo e orari scritti solo nel testo, fuori dai dati strutturati. Titolo uguale su tre pagine.",
        fix: "Titolo per pagina, indirizzo, orari e le tre botteghe messi nei dati strutturati.",
        serpBefore: { title: "Home | Gelateria", url: "artigianogelateria.it", desc: "Benvenuti nel nostro sito. Scopri i nostri prodotti e la nostra storia…" },
        serpAfter: { title: "Artigiano Gelateria — dal 1978 a Cosenza, Catanzaro e Lamezia", url: "artigianogelateria.it", desc: "Gelato artigianale dal 1978. Tre botteghe, ritiro prenotabile online. Aperto oggi 11:00–23:00." },
        aiBefore: "Non ho informazioni sugli orari di questa gelateria. Ti consiglio di chiamare direttamente.",
        aiAfter: "Artigiano Gelateria fa gelato artigianale dal 1978 e ha tre botteghe: Cosenza, Catanzaro e Lamezia. Oggi è aperta 11:00–23:00 e il ritiro si prenota dal sito.",
      },
      {
        id: "burger",
        query: "dove mangiare hamburger di carne italiana a Modena",
        business: "Brado",
        gap: "La materia prima raccontata solo dentro un video, senza una riga di testo che una macchina possa leggere.",
        fix: "Il racconto della carne e della cottura scritto in pagina, menù leggibile, prenotazione nei dati strutturati.",
        serpBefore: { title: "Brado", url: "brado.it", desc: "brado.it" },
        serpAfter: { title: "Brado — hamburger di manzo italiano allevato brado, Modena", url: "brado.it", desc: "Dal 2016. Manzo 100% italiano, brace di faggio, pane lievitato in casa. Prenota il tavolo online." },
        aiBefore: "A Modena ci sono diverse hamburgerie, ma non trovo dettagli sulla provenienza della carne.",
        aiAfter: "Brado, a Modena dal 2016, usa manzo 100% italiano da allevamento brado, cotto sulla brace di faggio, con pane lievitato in casa. Il tavolo si prenota dal sito.",
      },
      {
        id: "bakery",
        query: "leverantör av bageriprodukter i Sverige",
        business: "Nordbageriet",
        gap: "Sito in una lingua sola e catalogo dentro un PDF: per una macchina quelle pagine non esistono.",
        fix: "Catalogo in pagina invece che in allegato, versione svedese e inglese dichiarate correttamente.",
        serpBefore: { title: "Nordbageriet AB", url: "nordbageriet.se", desc: "Ladda ner vår katalog (PDF, 8 MB)" },
        serpAfter: { title: "Nordbageriet — bagerileverantör sedan 1952", url: "nordbageriet.se", desc: "Levererar till bagerier i hela Sverige sedan 1952. Sortiment, återförsäljare och partneryta. Svenska och engelska." },
        aiBefore: "Jag hittar företaget men inte vad de levererar.",
        aiAfter: "Nordbageriet är en bagerileverantör verksam sedan 1952, med sortiment och återförsäljare i hela Sverige och en egen partneryta för kunder.",
      },
    ],
  },
  en: {
    hint: "Pick what a customer searches for. On the left, what Google can read off the page; on the right, what an AI assistant can answer. The button shows the same page before and after the fix.",
    disclaimer: "Examples built on demonstration projects. They show what changes on the page, not a promised position: where you land in the ranking is not decided by me or by any other supplier.",
    beforeLabel: "As it was",
    afterLabel: "Fixed",
    s1: "What the customer searches",
    s2: "What was missing on the page",
    s2fixed: "What was fixed",
    serpTitle: "How Google reads you",
    aiTitle: "What an AI assistant answers",
    aiPrompt: "Question put to the assistant",
    cases: [
      {
        id: "gelato",
        query: "artisan gelato open now in Cosenza",
        business: "Artigiano Gelateria",
        gap: "Address and hours written only in the prose, outside the structured data. The same title on three pages.",
        fix: "A title per page, and address, hours and the three shops moved into the structured data.",
        serpBefore: { title: "Home | Gelateria", url: "artigianogelateria.it", desc: "Welcome to our website. Discover our products and our story…" },
        serpAfter: { title: "Artigiano Gelateria — since 1978 in Cosenza, Catanzaro and Lamezia", url: "artigianogelateria.it", desc: "Artisan gelato since 1978. Three shops, pickup bookable online. Open today 11:00–23:00." },
        aiBefore: "I don't have information on this gelateria's opening hours. I'd suggest calling them directly.",
        aiAfter: "Artigiano Gelateria has made artisan gelato since 1978 and has three shops: Cosenza, Catanzaro and Lamezia. It is open today 11:00–23:00 and pickup can be booked from the site.",
      },
      {
        id: "burger",
        query: "where to eat Italian-beef burgers in Modena",
        business: "Brado",
        gap: "The sourcing story told only inside a video, without one line of text a machine could read.",
        fix: "The beef and the cooking written out on the page, a readable menu, booking in the structured data.",
        serpBefore: { title: "Brado", url: "brado.it", desc: "brado.it" },
        serpAfter: { title: "Brado — pasture-raised Italian beef burgers, Modena", url: "brado.it", desc: "Since 2016. 100% Italian beef, beechwood charcoal, bread leavened in house. Book your table online." },
        aiBefore: "There are several burger places in Modena, but I can't find details on where the beef comes from.",
        aiAfter: "Brado, in Modena since 2016, uses 100% Italian pasture-raised beef grilled over beechwood charcoal, with bread leavened in house. Tables are booked from the site.",
      },
      {
        id: "bakery",
        query: "bakery products supplier in Sweden",
        business: "Nordbageriet",
        gap: "A single-language site with the catalogue inside a PDF: to a machine, those pages do not exist.",
        fix: "The catalogue on the page instead of in an attachment, with the Swedish and English versions declared properly.",
        serpBefore: { title: "Nordbageriet AB", url: "nordbageriet.se", desc: "Download our catalogue (PDF, 8 MB)" },
        serpAfter: { title: "Nordbageriet — bakery supplier since 1952", url: "nordbageriet.se", desc: "Supplying bakeries across Sweden since 1952. Range, stockists and a partner area. Swedish and English." },
        aiBefore: "I can find the company but not what they supply.",
        aiAfter: "Nordbageriet is a bakery supplier operating since 1952, with a product range and stockists across Sweden and a partner area for customers.",
      },
    ],
  },
  sv: {
    hint: "Välj vad en kund söker på. Till vänster vad Google kan läsa av sidan, till höger vad en AI-assistent kan svara. Knappen visar samma sida före och efter åtgärden.",
    disclaimer: "Exempel byggda på demonstrationsprojekt. De visar vad som ändras på sidan, inte en utlovad placering: var du hamnar i resultatlistan avgörs inte av mig eller någon annan leverantör.",
    beforeLabel: "Som det var",
    afterLabel: "Åtgärdat",
    s1: "Vad kunden söker på",
    s2: "Vad som saknades på sidan",
    s2fixed: "Vad som åtgärdades",
    serpTitle: "Så läser Google dig",
    aiTitle: "Vad en AI-assistent svarar",
    aiPrompt: "Frågan som ställdes till assistenten",
    cases: [
      {
        id: "gelato",
        query: "hantverksglass öppet nu i Cosenza",
        business: "Artigiano Gelateria",
        gap: "Adress och öppettider stod bara i brödtexten, utanför strukturerade data. Samma titel på tre sidor.",
        fix: "En titel per sida, och adress, öppettider och de tre butikerna flyttade in i strukturerade data.",
        serpBefore: { title: "Home | Gelateria", url: "artigianogelateria.it", desc: "Välkommen till vår sajt. Upptäck våra produkter och vår historia…" },
        serpAfter: { title: "Artigiano Gelateria — sedan 1978 i Cosenza, Catanzaro och Lamezia", url: "artigianogelateria.it", desc: "Hantverksglass sedan 1978. Tre butiker, upphämtning bokas online. Öppet idag 11:00–23:00." },
        aiBefore: "Jag har inga uppgifter om den här glassbarens öppettider. Ring dem gärna direkt.",
        aiAfter: "Artigiano Gelateria har gjort hantverksglass sedan 1978 och har tre butiker: Cosenza, Catanzaro och Lamezia. Idag är det öppet 11:00–23:00 och upphämtning bokas på sajten.",
      },
      {
        id: "burger",
        query: "var äta burgare på italienskt nötkött i Modena",
        business: "Brado",
        gap: "Berättelsen om råvaran fanns bara inuti en video, utan en rad text som en maskin kunde läsa.",
        fix: "Köttet och tillagningen utskrivna på sidan, läsbar meny, bordsbokning i strukturerade data.",
        serpBefore: { title: "Brado", url: "brado.it", desc: "brado.it" },
        serpAfter: { title: "Brado — burgare på frigående italienskt nötkött, Modena", url: "brado.it", desc: "Sedan 2016. 100 % italienskt nötkött, glöd av bokträ, bröd jäst på plats. Boka bord online." },
        aiBefore: "Det finns flera burgarställen i Modena, men jag hittar inga uppgifter om var köttet kommer ifrån.",
        aiAfter: "Brado, i Modena sedan 2016, använder 100 % italienskt frigående nötkött grillat över glöd av bokträ, med bröd jäst på plats. Bord bokas på sajten.",
      },
      {
        id: "bakery",
        query: "leverantör av bageriprodukter i Sverige",
        business: "Nordbageriet",
        gap: "En sajt på ett enda språk med katalogen inuti en PDF: för en maskin finns de sidorna inte.",
        fix: "Katalogen på sidan i stället för som bilaga, med svensk och engelsk version korrekt deklarerade.",
        serpBefore: { title: "Nordbageriet AB", url: "nordbageriet.se", desc: "Ladda ner vår katalog (PDF, 8 MB)" },
        serpAfter: { title: "Nordbageriet — bagerileverantör sedan 1952", url: "nordbageriet.se", desc: "Levererar till bagerier i hela Sverige sedan 1952. Sortiment, återförsäljare och partneryta. Svenska och engelska." },
        aiBefore: "Jag hittar företaget men inte vad de levererar.",
        aiAfter: "Nordbageriet är en bagerileverantör verksam sedan 1952, med sortiment och återförsäljare i hela Sverige och en egen partneryta för kunder.",
      },
    ],
  },
};

const WEBDATA: Record<Lang, WebDataCopy> = {
  it: {
    hint: "Scegli cosa cercare. Le schede pubbliche delle attività diventano un foglio ordinato, e sotto ci sono le tre righe che rendono il foglio utile.",
    disclaimer: "Righe di esempio, non uno studio di mercato commissionato da qualcuno. Su dati veri il foglio ha la stessa forma e molte più righe.",
    s1: "Cosa cerchi",
    s2: "Cosa fa",
    s3: "Il foglio che esce",
    colName: "Attività",
    colArea: "Zona",
    colRating: "Recensioni",
    colSite: "Sito",
    yes: "sì",
    no: "no",
    findingsTitle: "Cosa ci leggi dentro",
    cases: [
      {
        id: "parrucchieri",
        label: "Parrucchieri · Cosenza",
        tag: "47 attività",
        rule: "Legge le schede pubbliche, toglie i doppioni, incrocia recensioni e presenza online.",
        rows: [
          { name: "Salone Aurora", area: "Centro", rating: "4,6 · 128", site: true },
          { name: "Hair Lab", area: "Via Popilia", rating: "4,2 · 41", site: false },
          { name: "Studio Kappa", area: "Centro", rating: "4,8 · 203", site: true },
          { name: "Barber & Co", area: "Rende sud", rating: "3,9 · 17", site: false },
          { name: "Effetto Chioma", area: "Via Popilia", rating: "4,1 · 34", site: false },
        ],
        findings: ["31 su 47 non hanno un sito", "Media recensioni 4,1", "Via Popilia è la zona più scoperta"],
      },
      {
        id: "pizzerie",
        label: "Pizzerie · Rende",
        tag: "62 attività",
        rule: "Legge le schede pubbliche, toglie i doppioni, incrocia recensioni e presenza online.",
        rows: [
          { name: "Da Peppino", area: "Centro", rating: "4,7 · 512", site: true },
          { name: "Forno Vivo", area: "Quattromiglia", rating: "4,4 · 189", site: true },
          { name: "Pizza Più", area: "Commenda", rating: "3,8 · 63", site: false },
          { name: "Antica Ruota", area: "Centro", rating: "4,5 · 271", site: true },
          { name: "Il Cornicione", area: "Quattromiglia", rating: "4,2 · 96", site: false },
        ],
        findings: ["18 su 62 non prendono ordini online", "Media recensioni 4,4", "Il centro è la zona più satura"],
      },
      {
        id: "palestre",
        label: "Palestre · Catanzaro",
        tag: "23 attività",
        rule: "Legge le schede pubbliche, toglie i doppioni, incrocia recensioni e presenza online.",
        rows: [
          { name: "Atlas Fitness", area: "Lido", rating: "4,3 · 88", site: true },
          { name: "Body Center", area: "Centro", rating: "3,6 · 24", site: false },
          { name: "Wellness Point", area: "Santa Maria", rating: "4,0 · 51", site: false },
          { name: "Iron House", area: "Lido", rating: "4,5 · 112", site: true },
          { name: "Move Studio", area: "Centro", rating: "3,4 · 9", site: false },
        ],
        findings: ["9 su 23 non pubblicano gli orari", "Media recensioni 3,8", "Nessuna ha la prenotazione online"],
      },
    ],
  },
  en: {
    hint: "Pick what to look for. Public business listings become an ordered sheet, and underneath are the three lines that make the sheet worth having.",
    disclaimer: "Sample rows, not a market study anyone commissioned. On real data the sheet has the same shape and many more rows.",
    s1: "What you look for",
    s2: "What it does",
    s3: "The sheet that comes out",
    colName: "Business",
    colArea: "Area",
    colRating: "Reviews",
    colSite: "Site",
    yes: "yes",
    no: "no",
    findingsTitle: "What it tells you",
    cases: [
      {
        id: "parrucchieri",
        label: "Hairdressers · Cosenza",
        tag: "47 businesses",
        rule: "Reads the public listings, drops the duplicates, cross-checks reviews against online presence.",
        rows: [
          { name: "Salone Aurora", area: "Centre", rating: "4.6 · 128", site: true },
          { name: "Hair Lab", area: "Via Popilia", rating: "4.2 · 41", site: false },
          { name: "Studio Kappa", area: "Centre", rating: "4.8 · 203", site: true },
          { name: "Barber & Co", area: "Rende south", rating: "3.9 · 17", site: false },
          { name: "Effetto Chioma", area: "Via Popilia", rating: "4.1 · 34", site: false },
        ],
        findings: ["31 of 47 have no website", "Average rating 4.1", "Via Popilia is the thinnest area"],
      },
      {
        id: "pizzerie",
        label: "Pizzerias · Rende",
        tag: "62 businesses",
        rule: "Reads the public listings, drops the duplicates, cross-checks reviews against online presence.",
        rows: [
          { name: "Da Peppino", area: "Centre", rating: "4.7 · 512", site: true },
          { name: "Forno Vivo", area: "Quattromiglia", rating: "4.4 · 189", site: true },
          { name: "Pizza Più", area: "Commenda", rating: "3.8 · 63", site: false },
          { name: "Antica Ruota", area: "Centre", rating: "4.5 · 271", site: true },
          { name: "Il Cornicione", area: "Quattromiglia", rating: "4.2 · 96", site: false },
        ],
        findings: ["18 of 62 take no online orders", "Average rating 4.4", "The centre is the most crowded area"],
      },
      {
        id: "palestre",
        label: "Gyms · Catanzaro",
        tag: "23 businesses",
        rule: "Reads the public listings, drops the duplicates, cross-checks reviews against online presence.",
        rows: [
          { name: "Atlas Fitness", area: "Lido", rating: "4.3 · 88", site: true },
          { name: "Body Center", area: "Centre", rating: "3.6 · 24", site: false },
          { name: "Wellness Point", area: "Santa Maria", rating: "4.0 · 51", site: false },
          { name: "Iron House", area: "Lido", rating: "4.5 · 112", site: true },
          { name: "Move Studio", area: "Centre", rating: "3.4 · 9", site: false },
        ],
        findings: ["9 of 23 publish no opening hours", "Average rating 3.8", "None offer online booking"],
      },
    ],
  },
  sv: {
    hint: "Välj vad du letar efter. Offentliga företagsuppgifter blir ett ordnat ark, och under det ligger de tre raderna som gör arket värt att ha.",
    disclaimer: "Exempelrader, ingen marknadsstudie som någon beställt. På riktiga data har arket samma form och många fler rader.",
    s1: "Vad du letar efter",
    s2: "Vad den gör",
    s3: "Arket som kommer ut",
    colName: "Företag",
    colArea: "Område",
    colRating: "Omdömen",
    colSite: "Sajt",
    yes: "ja",
    no: "nej",
    findingsTitle: "Vad det säger dig",
    cases: [
      {
        id: "parrucchieri",
        label: "Frisörer · Cosenza",
        tag: "47 företag",
        rule: "Läser de offentliga uppgifterna, tar bort dubbletter, korsar omdömen med närvaro på nätet.",
        rows: [
          { name: "Salone Aurora", area: "Centrum", rating: "4,6 · 128", site: true },
          { name: "Hair Lab", area: "Via Popilia", rating: "4,2 · 41", site: false },
          { name: "Studio Kappa", area: "Centrum", rating: "4,8 · 203", site: true },
          { name: "Barber & Co", area: "Rende söder", rating: "3,9 · 17", site: false },
          { name: "Effetto Chioma", area: "Via Popilia", rating: "4,1 · 34", site: false },
        ],
        findings: ["31 av 47 saknar sajt", "Snittbetyg 4,1", "Via Popilia är tunnaste området"],
      },
      {
        id: "pizzerie",
        label: "Pizzerior · Rende",
        tag: "62 företag",
        rule: "Läser de offentliga uppgifterna, tar bort dubbletter, korsar omdömen med närvaro på nätet.",
        rows: [
          { name: "Da Peppino", area: "Centrum", rating: "4,7 · 512", site: true },
          { name: "Forno Vivo", area: "Quattromiglia", rating: "4,4 · 189", site: true },
          { name: "Pizza Più", area: "Commenda", rating: "3,8 · 63", site: false },
          { name: "Antica Ruota", area: "Centrum", rating: "4,5 · 271", site: true },
          { name: "Il Cornicione", area: "Quattromiglia", rating: "4,2 · 96", site: false },
        ],
        findings: ["18 av 62 tar inte emot beställningar online", "Snittbetyg 4,4", "Centrum är tätaste området"],
      },
      {
        id: "palestre",
        label: "Gym · Catanzaro",
        tag: "23 företag",
        rule: "Läser de offentliga uppgifterna, tar bort dubbletter, korsar omdömen med närvaro på nätet.",
        rows: [
          { name: "Atlas Fitness", area: "Lido", rating: "4,3 · 88", site: true },
          { name: "Body Center", area: "Centrum", rating: "3,6 · 24", site: false },
          { name: "Wellness Point", area: "Santa Maria", rating: "4,0 · 51", site: false },
          { name: "Iron House", area: "Lido", rating: "4,5 · 112", site: true },
          { name: "Move Studio", area: "Centrum", rating: "3,4 · 9", site: false },
        ],
        findings: ["9 av 23 publicerar inga öppettider", "Snittbetyg 3,8", "Ingen har onlinebokning"],
      },
    ],
  },
};

export function getVisibilityDemo(lang: Lang): VisibilityCopy {
  return VISIBILITY[lang];
}

export function getWebDataDemo(lang: Lang): WebDataCopy {
  return WEBDATA[lang];
}
