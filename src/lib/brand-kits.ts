// Per-project brand identity kits. Each kit is a self-contained identity for that
// client: a monogram, a full colour palette with roles, a type direction, and the
// written foundation (positioning, voice, attributes, contexts).
//
// The kits feed three surfaces:
//   - the navigable brand manual on /work/[slug]  (BrandDeck — the document a
//     client leafs through BEFORE approving the build)
//   - the print-ready sheet on /work/[slug]/brand-sheet
//   - the applications mood board (BrandBento)
//
// Colours are scoped via CSS variables, so the rest of the site keeps its own
// palette. Fonts use widely-available stacks (plus the site faces) so each brand
// reads distinct with zero extra webfont loads.
//
// The four narrative fields are REQUIRED in practice: page 03 of the manual is
// the positioning page, and a client-facing document with an empty positioning
// page is worth nothing. They stay optional in the type only because the
// automation demos (email, solleciti, …) have no client brand and therefore no
// kit at all.

import type { Lang } from "@/i18n";

export type BrandRole = "primary" | "secondary" | "accent" | "paper" | "ink";

export type Localized<T> = Partial<Record<Lang, T>>;

export type BrandColor = {
  name: string;
  hex: string;
  role: BrandRole;
  /** Legible text colour on this swatch. */
  on: string;
};

/**
 * What this particular business actually hands out or wears. A coach operator
 * has no apron and a bakery supplier has no lanyard; giving every brand the same
 * eight objects is what made the merch page read as a template.
 */
export type MerchItem =
  | "tee" | "teeDark" | "polo" | "hoodie" | "apron" | "cape"
  | "cap" | "tote" | "paperBag" | "box"
  | "cup" | "mug" | "bottle"
  | "sticker" | "badge" | "lanyard" | "notebook" | "towel" | "mat";

export type BrandShape = "circle" | "square" | "ring" | "shield";
export type BrandMotif =
  | "sun" | "laurel" | "scooter" | "boot" | "razor"
  | "cone" | "signal" | "wave" | "flame" | "leaf"
  | "wheat" | "route" | "cloud" | "scissors" | "bolt" | "none";

export type BrandKit = {
  slug: string;
  /** Brand name (matches the project title shown on the detail page). */
  name: string;
  monogram: string;
  tagline: string;
  domain: string;
  shape: BrandShape;
  motif: BrandMotif;
  /** CSS font-family for the wordmark / monogram / display. */
  display: string;
  /** CSS font-family for body / captions. */
  body: string;
  /** Wordmark tracking (letter-spacing). */
  tracking: string;
  paper: string;
  ink: string;
  primary: string;
  accent: string;
  /** Positioning line: what the brand is, before what it looks like. */
  story?: Localized<string>;
  /** Personality / tone descriptor. */
  voice?: Localized<string>;
  /** Four brand attributes, each verifiable in a concrete design choice. */
  principles?: Localized<string[]>;
  /** Three contexts the mark actually has to live in. */
  usage?: Localized<string[]>;
  /** The objects this business really carries. Defaults to a generic set. */
  merch?: MerchItem[];
  palette: BrandColor[];
};

const SANS = "var(--font-ui), system-ui, sans-serif";

export const BRAND_KITS: Record<string, BrandKit> = {
  // Campionato dalla build viva: il fondo e' la notte (#04090C), non un grigio
  // scuro, e l'ambra e' l'unico colore caldo. E' la tesi del prodotto messa in
  // palette: l'impianto lavora anche quando il sole non c'e'.
  helios: {
    slug: "helios",
    name: "Helios",
    monogram: "H",
    tagline: "Bollette a zero, giorno e notte.",
    domain: "helios.it",
    shape: "circle",
    motif: "sun",
    display: 'Outfit, "Century Gothic", system-ui, sans-serif',
    body: SANS,
    tracking: "-0.01em",
    paper: "#04090C",
    ink: "#E6F0EA",
    primary: "#FFB43D",
    accent: "#3DDC91",
    story: {
      it: "Helios installa fotovoltaico con accumulo e vende una cosa sola: la bolletta che smette di arrivare. Non parla di ambiente, parla di anni di rientro, e mette il calcolo in mano a chi legge invece di tenerlo in agenzia.",
      en: "Helios installs solar with battery storage and sells one thing: the bill that stops arriving. It does not talk about the environment, it talks about payback years, and it hands the calculation to the reader instead of keeping it in the office.",
      sv: "Helios installerar solceller med batterilager och säljer en enda sak: räkningen som slutar komma. Den talar inte om miljön, den talar om återbetalningstid, och lämnar kalkylen till läsaren i stället för att behålla den på kontoret.",
    },
    voice: {
      it: "Da preventivo, non da brochure: numeri con accanto la loro fonte, e un no detto chiaro quando l'impianto non conviene.",
      en: "Quote-like, not brochure-like: numbers with their source beside them, and a plain no when the system does not pay off.",
      sv: "Som en offert, inte en broschyr: siffror med sin källa bredvid, och ett tydligt nej när anläggningen inte lönar sig.",
    },
    principles: {
      it: ["La notte è il fondo, non un tema scuro", "Ogni numero dichiara da dove viene", "L'ambra solo dove si agisce", "Il verde solo per il risparmio"],
      en: ["Night is the ground, not a dark theme", "Every number declares where it comes from", "Amber only where you act", "Green only for the saving"],
      sv: ["Natten är botten, inte ett mörkt tema", "Varje siffra redovisar sitt ursprung", "Bärnsten bara där man agerar", "Grönt bara för besparingen"],
    },
    usage: {
      it: ["Preventivo e scheda impianto", "Furgone e divise dei montatori", "Cartello di cantiere sul tetto"],
      en: ["Quote and system data sheet", "Van and installers' workwear", "Site sign on the roof"],
      sv: ["Offert och anläggningsblad", "Skåpbil och montörernas arbetskläder", "Byggskylt på taket"],
    },
    merch: ["polo", "hoodie", "cap", "notebook", "bottle"],
    palette: [
      { name: "Sole", hex: "#FFB43D", role: "primary", on: "#100C02" },
      { name: "Notte", hex: "#04090C", role: "paper", on: "#E6F0EA" },
      { name: "Risparmio", hex: "#3DDC91", role: "accent", on: "#04090C" },
      { name: "Salvia", hex: "#8BA398", role: "secondary", on: "#04090C" },
      { name: "Luce", hex: "#E6F0EA", role: "ink", on: "#04090C" },
    ],
  },

  aliva: {
    slug: "aliva",
    name: "Aliva",
    monogram: "A",
    tagline: "Passione per l'olio, ricchezza della nostra terra.",
    domain: "aliva.it",
    shape: "circle",
    motif: "leaf",
    display: '"Plantin MT Pro", Georgia, "Times New Roman", serif',
    body: SANS,
    tracking: "0.2em",
    paper: "#F6F3EA",
    ink: "#2A2D22",
    primary: "#5D6C45",
    accent: "#CCD4BF",
    story: {
      it: "Aliva mette in bottiglia un uliveto di famiglia: raccolta a mano, frangitura in giornata, una sola cultivar. L'etichetta parla di terra, non di gastronomia di lusso.",
      en: "Aliva bottles a family olive grove: picked by hand, milled the same day, a single cultivar. The label talks about land, not about luxury food.",
      sv: "Aliva tappar en familjs olivlund: handplockat, pressat samma dag, en enda sort. Etiketten talar om jord, inte om lyxmat.",
    },
    voice: {
      it: "Sobria e contadina: si parla di raccolto, di acidità e di stagione, mai di eccellenza o di tradizione millenaria.",
      en: "Plain and farm-side: it talks about harvest, acidity and season, never about excellence or thousand-year tradition.",
      sv: "Enkel och lantlig: den talar om skörd, syra och säsong, aldrig om excellens eller tusenårig tradition.",
    },
    principles: {
      it: ["Una cultivar", "Raccolto datato", "Etichetta leggibile", "Verde spento, mai brillante"],
      en: ["One cultivar", "Dated harvest", "A label you can read", "Muted green, never bright"],
      sv: ["En sort", "Daterad skörd", "En etikett man kan läsa", "Dämpat grönt, aldrig skarpt"],
    },
    usage: {
      it: ["Etichette e cartoni da sei", "Banchi di fiere e mercati", "Vendita diretta online"],
      en: ["Labels and six-bottle cases", "Fair and market stands", "Direct online sales"],
      sv: ["Etiketter och sexpack", "Mässor och marknadsstånd", "Direktförsäljning online"],
    },
    merch: ["bottle", "box", "apron", "tote", "tee"],
    palette: [
      { name: "Oliva", hex: "#5D6C45", role: "primary", on: "#F6F3EA" },
      { name: "Terra", hex: "#43463A", role: "secondary", on: "#F6F3EA" },
      { name: "Salvia", hex: "#CCD4BF", role: "accent", on: "#2A2D22" },
      { name: "Avorio", hex: "#F6F3EA", role: "paper", on: "#2A2D22" },
      { name: "Corteccia", hex: "#2A2D22", role: "ink", on: "#F6F3EA" },
    ],
  },

  yoga: {
    slug: "yoga",
    name: "Prana",
    monogram: "P",
    tagline: "Ritrova il tuo equilibrio.",
    domain: "prana-yoga.it",
    shape: "circle",
    motif: "sun",
    display: '"Marcellus", Georgia, "Times New Roman", serif',
    body: SANS,
    tracking: "0.14em",
    paper: "#141B16",
    ink: "#ECE5D3",
    primary: "#C29A5E",
    accent: "#A4B0A0",
    story: {
      it: "Prana è uno studio di quartiere: poche lezioni, sale piccole, insegnanti che ti chiamano per nome. L'identità è notturna e calda perché quasi tutte le pratiche si tengono dopo il lavoro.",
      en: "Prana is a neighbourhood studio: few classes, small rooms, teachers who know your name. The identity is dark and warm because most of the practice happens after work.",
      sv: "Prana är en kvartersstudio: få pass, små salar, lärare som kan ditt namn. Identiteten är mörk och varm eftersom det mesta sker efter jobbet.",
    },
    voice: {
      it: "Calma e diretta: istruzioni chiare, nessun sanscrito lasciato senza traduzione, nessuna promessa di trasformazione.",
      en: "Calm and direct: clear instructions, no untranslated Sanskrit, no promises of transformation.",
      sv: "Lugn och rak: tydliga instruktioner, ingen oöversatt sanskrit, inga löften om förvandling.",
    },
    principles: {
      it: ["Luce bassa", "Oro come unico accento", "Spazio prima del testo", "Nessuna posa acrobatica"],
      en: ["Low light", "Gold as the only accent", "Space before text", "No acrobatic poses"],
      sv: ["Lågt ljus", "Guld som enda accent", "Utrymme före text", "Inga akrobatiska positioner"],
    },
    usage: {
      it: ["Orario lezioni e abbonamenti", "Insegne e vetrofanie", "Post e storie di quartiere"],
      en: ["Class timetable and passes", "Signage and window graphics", "Neighbourhood posts and stories"],
      sv: ["Schema och klippkort", "Skyltar och fönstergrafik", "Inlägg och stories för kvarteret"],
    },
    merch: ["mat", "towel", "tee", "tote", "badge"],
    palette: [
      { name: "Oro", hex: "#C29A5E", role: "primary", on: "#141B16" },
      { name: "Muschio", hex: "#1D2620", role: "secondary", on: "#ECE5D3" },
      { name: "Salvia", hex: "#A4B0A0", role: "accent", on: "#141B16" },
      { name: "Foresta", hex: "#141B16", role: "paper", on: "#ECE5D3" },
      { name: "Crema", hex: "#ECE5D3", role: "ink", on: "#141B16" },
    ],
  },

  // Re-sampled from the live build: the site is a LIGHT editorial grill room on
  // parchment with a small red mark, not the black-and-gold omakase counter the
  // first kit described.
  sushi: {
    slug: "sushi",
    name: "Golden Dragon",
    monogram: "金",
    tagline: "Un'esperienza fusion nel cuore di Milano.",
    domain: "goldendragonmilano.it",
    shape: "square",
    motif: "wave",
    display: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
    body: SANS,
    tracking: "0.02em",
    paper: "#F1EDE4",
    ink: "#131315",
    primary: "#C0443A",
    accent: "#E7E0D0",
    story: {
      it: "Golden Dragon è un table grill fusion a Milano: si cucina al tavolo, senza fumo, su una carta corta. La pagina è chiara e da rivista, perché il nero lo mettono già i piatti.",
      en: "Golden Dragon is a fusion table grill in Milan: cooking at the table, smokeless, on a short menu. The page is light and magazine-like, because the plates already bring the black.",
      sv: "Golden Dragon är en fusion-bordsgrill i Milano: man lagar vid bordet, röklöst, på en kort meny. Sidan är ljus och tidningslik, för svärtan står rätterna för.",
    },
    voice: {
      it: "Asciutta e precisa: si nominano il taglio, la cottura e il giorno, senza gli aggettivi di un menù turistico.",
      en: "Dry and precise: it names the cut, the cooking and the day, with none of the adjectives of a tourist menu.",
      sv: "Torr och precis: den nämner styckningen, tillagningen och dagen, utan turistmenyns adjektiv.",
    },
    principles: {
      it: ["Carta chiara, piatti scuri", "Rosso solo sul marchio", "Fotografia ravvicinata", "Menù corto"],
      en: ["Light paper, dark plates", "Red on the mark only", "Close-up photography", "A short menu"],
      sv: ["Ljust papper, mörka rätter", "Rött endast på märket", "Närbilder", "Kort meny"],
    },
    usage: {
      it: ["Menù e carta dei sakè", "Prenotazioni e conferme", "Insegna e vetrina"],
      en: ["Menu and sake list", "Bookings and confirmations", "Sign and shopfront"],
      sv: ["Meny och sakelista", "Bokningar och bekräftelser", "Skylt och skyltfönster"],
    },
    merch: ["apron", "tee", "paperBag", "cap", "badge"],
    palette: [
      { name: "Rosso timbro", hex: "#C0443A", role: "primary", on: "#F1EDE4" },
      { name: "Legno", hex: "#956A48", role: "secondary", on: "#F1EDE4" },
      { name: "Sabbia", hex: "#E7E0D0", role: "accent", on: "#131315" },
      { name: "Carta", hex: "#F1EDE4", role: "paper", on: "#131315" },
      { name: "Inchiostro", hex: "#131315", role: "ink", on: "#F1EDE4" },
    ],
  },

  brado: {
    slug: "brado",
    name: "Brado",
    monogram: "B",
    tagline: "Carne brada, fuoco vero.",
    domain: "brado.it",
    shape: "square",
    motif: "flame",
    display: '"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
    body: SANS,
    tracking: "0.16em",
    paper: "#F3E9D8",
    ink: "#1A1310",
    primary: "#D93A22",
    accent: "#E9A93C",
    story: {
      it: "Brado è una macelleria con la griglia: animali allevati allo stato brado, taglio a vista, cottura sul fuoco. Il marchio è grosso e volutamente ruvido, come un timbro sulla carta da banco.",
      en: "Brado is a butcher with a grill: free-range animals, cutting in full view, cooking over fire. The mark is heavy and deliberately rough, like a stamp on counter paper.",
      sv: "Brado är en slaktare med grill: frigående djur, styckning i öppen sikt, tillagning över eld. Märket är grovt och medvetet ojämnt, som en stämpel på diskpapper.",
    },
    voice: {
      it: "Schietta e breve: si dicono la razza, il taglio e il peso, e si smette.",
      en: "Blunt and short: it gives the breed, the cut and the weight, then stops.",
      sv: "Rak och kort: den anger ras, styckdetalj och vikt, sedan slutar den.",
    },
    principles: {
      it: ["Nero su carta grezza", "Un solo rosso", "Caratteri pesanti", "Nessuna foto patinata"],
      en: ["Black on rough paper", "One red only", "Heavy type", "No glossy photography"],
      sv: ["Svart på grovt papper", "Endast en röd", "Tunga typsnitt", "Inga polerade bilder"],
    },
    usage: {
      it: ["Carta da banco ed etichette", "Lavagna dei tagli", "Insegna e furgone"],
      en: ["Counter paper and labels", "Cuts blackboard", "Sign and van"],
      sv: ["Diskpapper och etiketter", "Styckningstavla", "Skylt och skåpbil"],
    },
    merch: ["apron", "paperBag", "tee", "cap", "sticker"],
    palette: [
      { name: "Fuoco", hex: "#D93A22", role: "primary", on: "#F3E9D8" },
      { name: "Brace", hex: "#7A2E1C", role: "secondary", on: "#F3E9D8" },
      { name: "Oro", hex: "#E9A93C", role: "accent", on: "#1A1310" },
      { name: "Pane", hex: "#F3E9D8", role: "paper", on: "#1A1310" },
      { name: "Carbone", hex: "#1A1310", role: "ink", on: "#F3E9D8" },
    ],
  },

  // Re-sampled from the live build: an ivory page that is almost entirely
  // photography, with a letterspaced serif wordmark. The first kit's bordeaux is
  // not on the site.
  fotografo: {
    slug: "fotografo",
    name: "Atelier Solari",
    monogram: "AS",
    tagline: "Wedding photography, Tuscany & Amalfi.",
    domain: "ateliersolari.it",
    shape: "ring",
    motif: "sun",
    display: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif',
    body: '"Iowan Old Style", Georgia, serif',
    tracking: "0.3em",
    paper: "#F3F0E7",
    ink: "#171410",
    primary: "#8A6A4A",
    accent: "#E8D6C1",
    story: {
      it: "Atelier Solari racconta il matrimonio come un racconto di luce e tempo. La pagina è avorio e quasi tutta fotografia: il marchio compare una volta sola, in alto, e poi lascia il posto alle immagini.",
      en: "Atelier Solari tells the wedding as a story of light and time. The page is ivory and almost entirely photography: the mark appears once, at the top, then gets out of the way.",
      sv: "Atelier Solari berättar om bröllop som en historia om ljus och tid. Sidan är elfenbensvit och nästan bara fotografi: märket syns en gång, högst upp, och lämnar sedan plats.",
    },
    voice: {
      it: "Elegante, intima e cinematica: la voce è sobria e alta, senza mai diventare artificiale o decorativa.",
      en: "Elegant, intimate and cinematic: the voice is restrained and elevated, without ever becoming artificial or decorative.",
      sv: "Elegant, intim och filmisk: rösten är avhållsam och förhöjd, utan att någonsin bli konstgjord eller dekorativ.",
    },
    principles: {
      it: [
        "La fotografia occupa la pagina",
        "Marchio una volta sola",
        "Toni caldi presi dalle immagini",
        "Eleganza senza eccesso",
      ],
      en: [
        "Photography fills the page",
        "The mark appears once",
        "Warm tones taken from the images",
        "Elegance without excess",
      ],
      sv: [
        "Fotografiet fyller sidan",
        "Märket syns en gång",
        "Varma toner hämtade ur bilderna",
        "Elegans utan överdrift",
      ],
    },
    usage: {
      it: [
        "Matrimoni in Toscana e Costiera Amalfitana",
        "Portfolio fotografico e gallerie di eventi",
        "Comunicazione premium per clienti internazionali",
      ],
      en: [
        "Weddings in Tuscany and the Amalfi Coast",
        "Photography portfolio and event galleries",
        "Premium communication for international clients",
      ],
      sv: [
        "Bröllop i Toscana och Amalfi-kusten",
        "Fotografiskt portfolio och evenemangsgallerier",
        "Premiumkommunikation för internationella kunder",
      ],
    },
    merch: ["tote", "notebook", "lanyard", "cap", "sticker"],
    palette: [
      { name: "Legno", hex: "#8A6A4A", role: "primary", on: "#F3F0E7" },
      { name: "Oliva chiara", hex: "#7F765D", role: "secondary", on: "#F3F0E7" },
      { name: "Pesca", hex: "#E8D6C1", role: "accent", on: "#171410" },
      { name: "Avorio", hex: "#F3F0E7", role: "paper", on: "#171410" },
      { name: "Bruno", hex: "#171410", role: "ink", on: "#F3F0E7" },
    ],
  },

  // Re-sampled from the live build: near-black stage, cream Didone wordmark, one
  // copper rule. The first kit had it as a light industrial manual, which is the
  // opposite of what the page does.
  aurelia: {
    slug: "aurelia",
    name: "Aurelia Pro X1",
    monogram: "A",
    tagline: "Il caffè, scolpito.",
    domain: "aurelia.coffee",
    shape: "circle",
    motif: "laurel",
    display: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif',
    body: SANS,
    tracking: "0.34em",
    paper: "#0B0A09",
    ink: "#F0E9DC",
    primary: "#B5703A",
    accent: "#8A7A62",
    story: {
      it: "Aurelia Pro X1 è una macchina da caffè presentata come un oggetto scolpito: fondo nero, un filo di rame, e il prodotto illuminato da solo. Niente cucina, niente colazione, niente persone.",
      en: "The Aurelia Pro X1 is an espresso machine presented as a sculpted object: black stage, one copper rule, the product lit on its own. No kitchen, no breakfast, no people.",
      sv: "Aurelia Pro X1 är en espressomaskin presenterad som ett skulpterat föremål: svart scen, en kopparlinje, produkten ensam i ljuset. Inget kök, ingen frukost, inga människor.",
    },
    voice: {
      it: "Tecnica e pacata: pressione, temperatura e materiali, senza racconti sull'esperienza del caffè.",
      en: "Technical and unhurried: pressure, temperature and materials, with no story about the coffee experience.",
      sv: "Teknisk och lugn: tryck, temperatur och material, utan berättelser om kaffeupplevelsen.",
    },
    principles: {
      it: ["Fondo nero sempre", "Rame come unico calore", "Il prodotto illuminato da solo", "Nessun effetto vapore"],
      en: ["Always a black stage", "Copper as the only warmth", "The product lit alone", "No steam effects"],
      sv: ["Alltid svart scen", "Koppar som enda värme", "Produkten ensam i ljuset", "Inga ångeffekter"],
    },
    usage: {
      it: ["Pagina di lancio e configuratore", "Scheda prodotto e manuale", "Fiere di settore"],
      en: ["Launch page and configurator", "Product sheet and manual", "Trade fairs"],
      sv: ["Lanseringssida och konfigurator", "Produktblad och manual", "Branschmässor"],
    },
    merch: ["cup", "mug", "box", "apron", "tee"],
    palette: [
      { name: "Rame", hex: "#B5703A", role: "primary", on: "#0B0A09" },
      { name: "Tostato", hex: "#3A2317", role: "secondary", on: "#F0E9DC" },
      { name: "Cenere", hex: "#8A7A62", role: "accent", on: "#0B0A09" },
      { name: "Notte", hex: "#0B0A09", role: "paper", on: "#F0E9DC" },
      { name: "Panna", hex: "#F0E9DC", role: "ink", on: "#0B0A09" },
    ],
  },

  // Re-sampled from the live build: the scooter is OCHRE in a grey concrete
  // studio. The first kit had a vintage light blue that appears nowhere.
  "vespa-heritage": {
    slug: "vespa-heritage",
    name: "Vespa Heritage",
    monogram: "VH",
    tagline: "La Dolce Vita. Reborn.",
    domain: "vespaheritage.it",
    shape: "shield",
    motif: "scooter",
    display: '"Futura", "Gill Sans", "Trebuchet MS", sans-serif',
    body: SANS,
    tracking: "0.2em",
    paper: "#E9E9E7",
    ink: "#15181A",
    primary: "#A96F14",
    accent: "#D6A23A",
    story: {
      it: "Vespa Heritage è un'edizione concept del 1968 rimessa in strada: un solo scooter ocra in uno studio di cemento, smontato e rimontato dallo scroll. Nessuna nostalgia da cartolina.",
      en: "Vespa Heritage is a 1968 concept edition put back on the road: one ochre scooter in a concrete studio, taken apart and rebuilt by the scroll. No postcard nostalgia.",
      sv: "Vespa Heritage är en konceptutgåva från 1968 tillbaka på vägen: en ockrafärgad skoter i en betongstudio, isärtagen och ihopsatt av scrollen. Ingen vykortsnostalgi.",
    },
    voice: {
      it: "Documentaria: date, numeri di telaio e colori originali, detti una volta sola.",
      en: "Documentary: dates, frame numbers and original colours, stated once.",
      sv: "Dokumentär: datum, ramnummer och originalfärger, sagda en gång.",
    },
    principles: {
      it: ["Ocra sul cemento", "Un solo soggetto per schermata", "Luce di studio, mai esterni", "Nessun filtro vintage"],
      en: ["Ochre on concrete", "One subject per screen", "Studio light, never location", "No vintage filters"],
      sv: ["Ockra på betong", "Ett motiv per skärm", "Studioljus, aldrig på plats", "Inga vintagefilter"],
    },
    usage: {
      it: ["Pagina di lancio", "Scheda tecnica e certificato", "Materiale per concessionari"],
      en: ["Launch page", "Spec sheet and certificate", "Dealer material"],
      sv: ["Lanseringssida", "Datablad och certifikat", "Återförsäljarmaterial"],
    },
    merch: ["tee", "cap", "sticker", "tote", "notebook"],
    palette: [
      { name: "Ocra", hex: "#A96F14", role: "primary", on: "#E9E9E7" },
      { name: "Cemento", hex: "#5B5C5C", role: "secondary", on: "#E9E9E7" },
      { name: "Ambra", hex: "#D6A23A", role: "accent", on: "#15181A" },
      { name: "Calce", hex: "#E9E9E7", role: "paper", on: "#15181A" },
      { name: "Officina", hex: "#15181A", role: "ink", on: "#E9E9E7" },
    ],
  },

  // Re-sampled from the live build, which trades as CALABRIA ESCAPES: a dark
  // editorial travel journal with one ochre accent. The first kit had a light
  // sand page and a Tyrrhenian blue that is nowhere on the site.
  "bella-calabria": {
    slug: "bella-calabria",
    name: "Calabria Escapes",
    monogram: "CE",
    tagline: "Cartoline dalla Calabria.",
    domain: "calabriaescapes.it",
    shape: "circle",
    motif: "sun",
    display: '"Haettenschweiler", "Arial Narrow", "Helvetica Neue", Impact, sans-serif',
    body: SANS,
    tracking: "0.1em",
    paper: "#141414",
    ink: "#F2EFE9",
    primary: "#E8B025",
    accent: "#CBB596",
    story: {
      it: "Calabria Escapes è un portale di viaggi gestito da chi vive sul posto: case, spiagge e offerte verificate una per una, presentate come un diario di viaggio su fondo nero.",
      en: "Calabria Escapes is a travel portal run by people who live there: houses, beaches and offers checked one by one, presented as a travel journal on a black ground.",
      sv: "Calabria Escapes är en reseportal driven av folk som bor där: hus, stränder och erbjudanden kontrollerade ett i taget, presenterade som en resedagbok på svart botten.",
    },
    voice: {
      it: "Ospitale e concreta: distanze in minuti, stagioni vere, prezzi scritti per intero.",
      en: "Warm and concrete: distances in minutes, real seasons, prices written in full.",
      sv: "Gästvänlig och konkret: avstånd i minuter, riktiga säsonger, priser skrivna i sin helhet.",
    },
    principles: {
      it: ["Fondo nero, foto grandi", "Un solo ocra", "Prezzo sempre visibile", "Nessun superlativo"],
      en: ["Black ground, big photographs", "One ochre only", "Price always visible", "No superlatives"],
      sv: ["Svart botten, stora bilder", "Endast en ockra", "Priset alltid synligt", "Inga superlativ"],
    },
    usage: {
      it: ["Schede alloggio e ricerca", "Conferme di prenotazione", "Campagne stagionali"],
      en: ["Listing pages and search", "Booking confirmations", "Seasonal campaigns"],
      sv: ["Boendesidor och sök", "Bokningsbekräftelser", "Säsongskampanjer"],
    },
    merch: ["tote", "cap", "tee", "lanyard", "notebook"],
    palette: [
      { name: "Ocra", hex: "#E8B025", role: "primary", on: "#141414" },
      { name: "Pietra", hex: "#8C7A5E", role: "secondary", on: "#141414" },
      { name: "Sabbia", hex: "#CBB596", role: "accent", on: "#141414" },
      { name: "Notte", hex: "#141414", role: "paper", on: "#F2EFE9" },
      { name: "Calce", hex: "#F2EFE9", role: "ink", on: "#141414" },
    ],
  },

  // Re-sampled from the live build: black hero, cream section, heavy grotesque
  // caps, no colour at all. The first kit had petrol green and brass, neither of
  // which is on the page.
  barberia: {
    slug: "barberia",
    name: "Barberia",
    monogram: "B",
    tagline: "Barbering, grooming & wellness.",
    domain: "barberia.studio",
    shape: "square",
    motif: "razor",
    display: '"Helvetica Neue", "Arial Black", Helvetica, Arial, sans-serif',
    body: SANS,
    tracking: "0.04em",
    paper: "#ECE9E0",
    ink: "#0A0908",
    primary: "#1C1917",
    accent: "#8A7A62",
    story: {
      it: "Barberia lavora su appuntamento, con un listino esposto e un solo tono: nero. La sala è scura, la sezione del team è chiara, e non c'è nessun colore a distrarre dalle facce.",
      en: "Barberia works by appointment, with the price list on show and a single tone: black. The room is dark, the team section is light, and no colour distracts from the faces.",
      sv: "Barberia arbetar på tid, med prislistan synlig och en enda ton: svart. Salongen är mörk, teamavsnittet ljust, och ingen färg drar blicken från ansiktena.",
    },
    voice: {
      it: "Cortese e misurata: si parla di tempi, prezzi e cura, mai di stile di vita.",
      en: "Courteous and measured: it talks about times, prices and care, never about lifestyle.",
      sv: "Artig och avvägd: den talar om tider, priser och skötsel, aldrig om livsstil.",
    },
    principles: {
      it: ["Nero e crema, niente altro", "Maiuscolo pesante", "Listino sempre esposto", "Fotografia in penombra"],
      en: ["Black and cream, nothing else", "Heavy caps", "Price list on show", "Low-light photography"],
      sv: ["Svart och gräddvitt, inget mer", "Tunga versaler", "Prislistan synlig", "Foto i dunkel"],
    },
    usage: {
      it: ["Prenotazioni online", "Insegna e specchi", "Tessere e prodotti da banco"],
      en: ["Online booking", "Sign and mirrors", "Cards and counter products"],
      sv: ["Bokning online", "Skylt och speglar", "Kort och diskprodukter"],
    },
    merch: ["cape", "towel", "tee", "badge", "sticker"],
    palette: [
      { name: "Nero", hex: "#1C1917", role: "primary", on: "#ECE9E0" },
      { name: "Fumo", hex: "#4B453E", role: "secondary", on: "#ECE9E0" },
      { name: "Cuoio", hex: "#8A7A62", role: "accent", on: "#0A0908" },
      { name: "Crema", hex: "#ECE9E0", role: "paper", on: "#0A0908" },
      { name: "Pece", hex: "#0A0908", role: "ink", on: "#ECE9E0" },
    ],
  },

  // Re-sampled from the live build: the ground is a full-bleed cone photograph
  // that changes hue with the flavour, and the only UI colour is a terracotta
  // pill. The first kit's pistachio green is nowhere on the page.
  gelateria: {
    slug: "gelateria",
    name: "Artigiano Gelateria",
    monogram: "AG",
    tagline: "Cambia gusto, cambia sfondo.",
    domain: "artigianogelateria.it",
    shape: "circle",
    motif: "cone",
    display: '"Hoefler Text", "Constantia", "Iowan Old Style", Georgia, serif',
    body: SANS,
    tracking: "0.12em",
    paper: "#F4EDE1",
    ink: "#17120E",
    primary: "#C2603B",
    accent: "#A14645",
    story: {
      it: "Artigiano fa gelato dal 1978 in tre botteghe calabresi. La schermata è una sola: il cono a tutto campo, e il fondo che prende il colore del gusto scelto.",
      en: "Artigiano has made gelato since 1978 in three Calabrian shops. There is one screen: the cone full-bleed, and a ground that takes the colour of the flavour on show.",
      sv: "Artigiano har gjort glass sedan 1978 i tre kalabriska butiker. Det finns en skärm: struten i helbild, och en botten som tar smakens färg.",
    },
    voice: {
      it: "Semplice e familiare: il gusto, gli ingredienti e l'orario, con la voce di chi serve al banco.",
      en: "Simple and familiar: the flavour, the ingredients and the opening hours, in the voice of whoever is serving.",
      sv: "Enkel och familjär: smaken, ingredienserna och öppettiderna, med samma röst som den som står i disken.",
    },
    principles: {
      it: ["Il fondo prende il colore del gusto", "Un cono per schermata", "Terracotta come unico bottone", "Foto vere, mai rendering"],
      en: ["The ground takes the flavour's colour", "One cone per screen", "Terracotta as the only button", "Real photographs, never renders"],
      sv: ["Botten tar smakens färg", "En strut per skärm", "Terrakotta som enda knapp", "Riktiga foton, aldrig renderingar"],
    },
    usage: {
      it: ["Coni, vaschette e coperchi", "Lavagna dei gusti", "Ritiri e ordini online"],
      en: ["Cones, tubs and lids", "Flavour blackboard", "Pickups and online orders"],
      sv: ["Strutar, baljor och lock", "Smaktavla", "Avhämtning och onlinebeställning"],
    },
    merch: ["cup", "apron", "cap", "paperBag", "tee"],
    palette: [
      { name: "Terracotta", hex: "#C2603B", role: "primary", on: "#F4EDE1" },
      { name: "Caramello", hex: "#8E5A11", role: "secondary", on: "#F4EDE1" },
      { name: "Amarena", hex: "#A14645", role: "accent", on: "#F4EDE1" },
      { name: "Panna", hex: "#F4EDE1", role: "paper", on: "#17120E" },
      { name: "Cacao", hex: "#17120E", role: "ink", on: "#F4EDE1" },
    ],
  },

  // Re-sampled from the live build: a near-black indigo dashboard with violet as
  // the only accent. The first kit had the light "mist" as the paper, which
  // inverted the whole product.
  "ai-visibility": {
    slug: "ai-visibility",
    name: "AI Visibility",
    monogram: "AI",
    tagline: "See how AI engines talk about your brand.",
    domain: "aivisibility.io",
    shape: "square",
    motif: "signal",
    display: "var(--font-ui), system-ui, sans-serif",
    body: SANS,
    tracking: "-0.01em",
    paper: "#0B0B15",
    ink: "#EDEDF7",
    primary: "#6364FA",
    accent: "#A6A8FF",
    story: {
      it: "AI Visibility misura quanto un marchio viene citato dai motori generativi. È un cruscotto, quindi lavora al buio: pannelli indaco, numeri chiari e un solo viola a segnalare il dato che conta.",
      en: "AI Visibility measures how often a brand gets cited by generative engines. It is a dashboard, so it works in the dark: indigo panels, light figures, and a single violet marking the number that matters.",
      sv: "AI Visibility mäter hur ofta ett varumärke citeras av generativa motorer. Det är en instrumentpanel, så den arbetar i mörker: indigopaneler, ljusa tal och en enda violett som markerar det som räknas.",
    },
    voice: {
      it: "Analitica e neutra: indici, fonti e differenze, senza allarmi né entusiasmo.",
      en: "Analytical and neutral: indices, sources and deltas, with no alarms and no enthusiasm.",
      sv: "Analytisk och neutral: index, källor och förändringar, utan larm och utan entusiasm.",
    },
    principles: {
      it: ["Fondo scuro sempre", "Dato prima del grafico", "Un solo viola", "Nessuna metafora spaziale"],
      en: ["Always a dark ground", "Number before chart", "One violet only", "No space metaphors"],
      sv: ["Alltid mörk botten", "Siffran före diagrammet", "Endast en violett", "Inga rymdmetaforer"],
    },
    usage: {
      it: ["Cruscotto e report", "Documentazione del prodotto", "Materiali di vendita"],
      en: ["Dashboard and reports", "Product documentation", "Sales material"],
      sv: ["Instrumentpanel och rapporter", "Produktdokumentation", "Säljmaterial"],
    },
    merch: ["hoodie", "mug", "sticker", "notebook", "lanyard"],
    palette: [
      { name: "Violet", hex: "#6364FA", role: "primary", on: "#0B0B15" },
      { name: "Panel", hex: "#27293E", role: "secondary", on: "#EDEDF7" },
      { name: "Periwinkle", hex: "#A6A8FF", role: "accent", on: "#0B0B15" },
      { name: "Void", hex: "#0B0B15", role: "paper", on: "#EDEDF7" },
      { name: "Mist", hex: "#EDEDF7", role: "ink", on: "#0B0B15" },
    ],
  },

  // Re-sampled from the live build, which trades as LIEVITA: deep green, one
  // yellow, white. The first kit described a generic tomato-and-crust pizzeria.
  "pizzeria-restaurant": {
    slug: "pizzeria-restaurant",
    name: "Lievita",
    monogram: "L",
    tagline: "Pizza vera. A Tropea.",
    domain: "lievita.it",
    shape: "circle",
    motif: "flame",
    display: '"Haettenschweiler", "Arial Narrow", "Helvetica Neue", Impact, sans-serif',
    body: SANS,
    tracking: "0.02em",
    paper: "#FFFFFF",
    ink: "#0B1F17",
    primary: "#075C3F",
    accent: "#FFDD00",
    story: {
      it: "Lievita è una pizzeria a lievito madre di Tropea: farine bio macinate a pietra, 24 ore di lievitazione, cipolla rossa del posto. Due colori e un carattere condensato, come una insegna dipinta.",
      en: "Lievita is a sourdough pizzeria in Tropea: stone-milled organic flour, a 24-hour prove, local red onion. Two colours and a condensed face, like a painted sign.",
      sv: "Lievita är ett surdegspizzeria i Tropea: stenmalet ekologiskt mjöl, 24 timmars jäsning, lokal rödlök. Två färger och ett kondenserat typsnitt, som en målad skylt.",
    },
    voice: {
      it: "Accogliente e pratica: impasto, tempi di lievitazione e orari, senza retorica napoletana.",
      en: "Welcoming and practical: the dough, the proving times and the opening hours, with no Neapolitan rhetoric.",
      sv: "Välkomnande och praktisk: degen, jästiderna och öppettiderna, utan neapolitansk retorik.",
    },
    principles: {
      it: ["Verde e giallo, niente altro", "Condensato maiuscolo", "Il giallo non porta testo piccolo", "Foto del prodotto, non del locale"],
      en: ["Green and yellow, nothing else", "Condensed caps", "The yellow carries no small text", "Photograph the product, not the room"],
      sv: ["Grönt och gult, inget mer", "Kondenserade versaler", "Gult bär ingen liten text", "Fotografera produkten, inte lokalen"],
    },
    usage: {
      it: ["Menù in sala e online", "Cartoni e sacchetti", "Prenotazioni e ordini"],
      en: ["In-room and online menu", "Boxes and bags", "Bookings and orders"],
      sv: ["Meny i salen och online", "Kartonger och påsar", "Bokningar och beställningar"],
    },
    merch: ["apron", "box", "cap", "paperBag", "tee"],
    palette: [
      { name: "Basilico", hex: "#075C3F", role: "primary", on: "#FFFFFF" },
      { name: "Alloro", hex: "#0B3A29", role: "secondary", on: "#FFFFFF" },
      { name: "Giallo", hex: "#FFDD00", role: "accent", on: "#0B1F17" },
      { name: "Farina", hex: "#FFFFFF", role: "paper", on: "#0B1F17" },
      { name: "Forno", hex: "#0B1F17", role: "ink", on: "#FFFFFF" },
    ],
  },

  // Re-sampled from the live site after its redesign: the old yellow/green
  // serif kit no longer matched anything on the page.
  brasilena: {
    slug: "brasilena",
    name: "Brasilena",
    monogram: "B",
    tagline: "Il caffè freddo prima che fosse hype.",
    domain: "brasilena.it",
    shape: "circle",
    motif: "wave",
    // The site sets condensed all-caps headlines (Teko); a narrow grotesque
    // carries the same voice without another webfont.
    display: '"Oswald", "Haettenschweiler", "Arial Narrow", Impact, sans-serif',
    body: SANS,
    tracking: "0.06em",
    paper: "#FFCC00",
    ink: "#6A3F40",
    primary: "#FFCC00",
    accent: "#FE3E29",
    story: {
      it: "Brasilena è la gassosa al caffè calabrese del 1930: il giallo della lattina è già il marchio, quindi l'identità lo prende come fondo e non gli mette niente sopra.",
      en: "Brasilena is the Calabrian coffee soda from 1930: the yellow of the can is already the mark, so the identity takes it as the ground and puts nothing on top of it.",
      sv: "Brasilena är den kalabriska kaffeläsken från 1930: burkens gula är redan märket, så identiteten tar den som botten och lägger inget ovanpå.",
    },
    voice: {
      it: "Popolare e sicura: poche parole, tono da manifesto, nessuna spiegazione del prodotto.",
      en: "Popular and confident: few words, poster tone, no explaining of the product.",
      sv: "Folklig och självsäker: få ord, affischton, ingen förklaring av produkten.",
    },
    principles: {
      it: ["Giallo come fondo", "Condensato maiuscolo", "Una parola per manifesto", "Nessuna sfumatura"],
      en: ["Yellow as the ground", "Condensed caps", "One word per poster", "No gradients"],
      sv: ["Gult som botten", "Kondenserade versaler", "Ett ord per affisch", "Inga toningar"],
    },
    usage: {
      it: ["Lattina e confezioni", "Manifesti e affissioni", "Post e video brevi"],
      en: ["Can and packaging", "Posters and billboards", "Posts and short video"],
      sv: ["Burk och förpackning", "Affischer och utomhus", "Inlägg och korta videor"],
    },
    merch: ["bottle", "box", "tee", "cap", "sticker"],
    palette: [
      { name: "Giallo", hex: "#FFCC00", role: "primary", on: "#6A3F40" },
      { name: "Caffè", hex: "#6A3F40", role: "secondary", on: "#FFCC00" },
      { name: "Rosso", hex: "#FE3E29", role: "accent", on: "#FFF6E5" },
      { name: "Panna", hex: "#F4F2EA", role: "paper", on: "#6A3F40" },
      { name: "Inchiostro", hex: "#2A1A16", role: "ink", on: "#FFCC00" },
    ],
  },

  // Sampled from the live build: a dark green-black photographic stage, a
  // letterspaced serif wordmark in cream, and gold for the 1952 script.
  nordbageriet: {
    slug: "nordbageriet",
    name: "Nordbageriet",
    monogram: "N",
    tagline: "The Nordic bakery solution.",
    domain: "nordbageriet.se",
    shape: "shield",
    motif: "wheat",
    display: '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',
    body: SANS,
    tracking: "0.26em",
    paper: "#F1EBDF",
    ink: "#0F1B17",
    primary: "#B69244",
    accent: "#2A3A33",
    story: {
      it: "Nordbageriet rifornisce panetterie e ristoranti nel nord Europa dal 1952. Il sito è una vetrina al buio: forno fotografato in penombra, marchio in crema spaziato, e l'oro solo sull'anno.",
      en: "Nordbageriet has supplied bakeries and restaurants across northern Europe since 1952. The site is a shop window at night: the bakery shot in low light, a letterspaced cream wordmark, gold on the year alone.",
      sv: "Nordbageriet har levererat till bagerier och restauranger i norra Europa sedan 1952. Sajten är ett skyltfönster i mörker: bageriet fotograferat i dunkel, ordmärket glesat i gräddvitt, guld bara på årtalet.",
    },
    voice: {
      it: "Professionale e concreta: formati, rese e tempi di consegna, con la calma di chi lavora all'ingrosso.",
      en: "Professional and concrete: formats, yields and delivery times, in the calm of a wholesale trade.",
      sv: "Professionell och konkret: format, utbyten och leveranstider, med grossistens lugn.",
    },
    principles: {
      it: ["Fotografia in penombra", "Marchio spaziato, mai compresso", "Oro solo sull'anno", "Nessun corsivo manoscritto"],
      en: ["Low-light photography", "A letterspaced mark, never tightened", "Gold on the year alone", "No handwritten script"],
      sv: ["Foto i dunkel", "Glesat märke, aldrig hoptryckt", "Guld bara på årtalet", "Ingen handskriven skrivstil"],
    },
    usage: {
      it: ["Catalogo prodotti e listini", "Imballi e sacchi", "Area partner e rete vendita"],
      en: ["Product catalogue and price lists", "Packaging and sacks", "Partner area and sales network"],
      sv: ["Produktkatalog och prislistor", "Emballage och säckar", "Partnerområde och säljnät"],
    },
    merch: ["apron", "polo", "paperBag", "box", "cap"],
    palette: [
      { name: "Oro 1952", hex: "#B69244", role: "primary", on: "#0F1B17" },
      { name: "Malto", hex: "#5E4F35", role: "secondary", on: "#F1EBDF" },
      { name: "Bosco", hex: "#2A3A33", role: "accent", on: "#F1EBDF" },
      { name: "Farina", hex: "#F1EBDF", role: "paper", on: "#0F1B17" },
      { name: "Forno", hex: "#0F1B17", role: "ink", on: "#F1EBDF" },
    ],
  },

  // Sampled from the live build: a deep teal photographic hero, heavy grotesque
  // caps, and one saturated yellow on the logo and the booking button.
  "buss-travel": {
    slug: "buss-travel",
    name: "Buss Travel",
    monogram: "BT",
    tagline: "Beyond borders by coach.",
    domain: "busstravel.eu",
    shape: "square",
    motif: "route",
    display: '"Helvetica Neue", "Arial Black", Helvetica, Arial, sans-serif',
    body: SANS,
    tracking: "0.04em",
    paper: "#F2F4F4",
    ink: "#08222A",
    primary: "#0F4553",
    accent: "#FEDA00",
    story: {
      it: "Buss Travel gestisce linee di pullman e tour in ventisette paesi. La schermata di apertura è una strada al crepuscolo con la rete disegnata sopra: prima si capisce dove si va, poi si prenota.",
      en: "Buss Travel runs scheduled coaches and tours across twenty-seven countries. The opening screen is a road at dusk with the network drawn over it: you see where the routes go, then you book.",
      sv: "Buss Travel kör linjebussar och turer i tjugosju länder. Startskärmen är en väg i skymning med nätet ritat över: först ser man vart linjerna går, sedan bokar man.",
    },
    voice: {
      it: "Chiara e operativa: destinazione, durata e prezzo, nell'ordine in cui servono.",
      en: "Clear and operational: destination, duration and price, in the order they are needed.",
      sv: "Tydlig och operativ: destination, restid och pris, i den ordning de behövs.",
    },
    principles: {
      it: ["Giallo solo su marchio e prenota", "Mappa prima della foto", "Maiuscolo pesante sui titoli", "Nessuna immagine di repertorio"],
      en: ["Yellow on the mark and the booking only", "Map before photo", "Heavy caps on headlines", "No stock imagery"],
      sv: ["Gult endast på märket och bokningen", "Karta före foto", "Tunga versaler i rubriker", "Inga stockbilder"],
    },
    usage: {
      it: ["Mappa della rete e orari", "Biglietti e conferme", "Livrea e segnaletica di fermata"],
      en: ["Network map and timetables", "Tickets and confirmations", "Livery and stop signage"],
      sv: ["Nätkarta och tidtabeller", "Biljetter och bekräftelser", "Dekor och hållplatsskyltar"],
    },
    merch: ["polo", "lanyard", "cap", "tote", "notebook"],
    palette: [
      { name: "Crepuscolo", hex: "#0F4553", role: "primary", on: "#F2F4F4" },
      { name: "Asfalto", hex: "#4A5A5C", role: "secondary", on: "#F2F4F4" },
      { name: "Giallo", hex: "#FEDA00", role: "accent", on: "#08222A" },
      { name: "Nebbia", hex: "#F2F4F4", role: "paper", on: "#08222A" },
      { name: "Notte", hex: "#08222A", role: "ink", on: "#F2F4F4" },
    ],
  },

  // Sampled from the live build, which trades as JAVASCRIPT PIZZERIA: a red
  // header card over a pizza photograph, system sans, nothing else.
  "pizzeria-lorenzo": {
    slug: "pizzeria-lorenzo",
    name: "JavaScript Pizzeria",
    monogram: "JP",
    tagline: "Welcome. Ready to start?",
    domain: "javascriptpizzeria.it",
    shape: "square",
    motif: "flame",
    display: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    body: SANS,
    tracking: "0.01em",
    paper: "#FBF9F6",
    ink: "#1E1B19",
    primary: "#E34A3A",
    accent: "#F2C14E",
    story: {
      it: "JavaScript Pizzeria è un ordinatore da asporto ridotto all'osso: una fotografia, una scheda bianca, un bottone rosso. Tutto quello che serve per far partire un ordine.",
      en: "JavaScript Pizzeria is a takeaway orderer stripped to the bone: one photograph, one white card, one red button. Everything an order needs to start.",
      sv: "JavaScript Pizzeria är en avhämtningsbeställare skalad till benet: ett foto, ett vitt kort, en röd knapp. Allt en beställning behöver för att börja.",
    },
    voice: {
      it: "Diretta e breve: cosa c'è, quanto costa, quando è pronta.",
      en: "Direct and short: what there is, what it costs, when it is ready.",
      sv: "Rak och kort: vad som finns, vad det kostar, när det är klart.",
    },
    principles: {
      it: ["Un bottone per schermata", "Rosso solo sull'azione", "La scheda sta sopra la foto", "Nessun passaggio in più"],
      en: ["One button per screen", "Red on the action only", "The card sits over the photograph", "No extra step"],
      sv: ["En knapp per skärm", "Rött endast på handlingen", "Kortet ligger över fotot", "Inget extra steg"],
    },
    usage: {
      it: ["Ordini da telefono e desktop", "Insegna e menù da parete", "Cartoni e volantini"],
      en: ["Phone and desktop orders", "Sign and wall menu", "Boxes and flyers"],
      sv: ["Beställning via telefon och dator", "Skylt och väggmeny", "Kartonger och flygblad"],
    },
    merch: ["box", "apron", "cap", "paperBag", "tee"],
    palette: [
      { name: "Pomodoro", hex: "#E34A3A", role: "primary", on: "#FBF9F6" },
      { name: "Brace", hex: "#8C3A2E", role: "secondary", on: "#FBF9F6" },
      { name: "Crosta", hex: "#F2C14E", role: "accent", on: "#1E1B19" },
      { name: "Piatto", hex: "#FBF9F6", role: "paper", on: "#1E1B19" },
      { name: "Inchiostro", hex: "#1E1B19", role: "ink", on: "#FBF9F6" },
    ],
  },

  // Sampled from the live build: a peach-to-cream gradient sky, white cards, and
  // the temperature as the one blue thing on the screen.
  "weather-se": {
    slug: "weather-se",
    name: "Väder",
    monogram: "V",
    tagline: "Broken clouds. Still a lovely day.",
    domain: "vader.se",
    shape: "circle",
    motif: "cloud",
    display: '"Avenir Next", "Avenir", "Segoe UI", "Trebuchet MS", sans-serif',
    body: SANS,
    tracking: "0.02em",
    paper: "#FDF7F1",
    ink: "#1C2733",
    primary: "#3E8BE0",
    accent: "#FCC8A3",
    story: {
      it: "Väder mostra il meteo svedese senza pubblicità e senza icone animate: un cielo che sfuma dal pesca al bianco, una scheda, e i gradi come unica cosa blu della schermata.",
      en: "Väder shows the Swedish forecast with no ads and no animated icons: a sky fading from peach to white, one card, and the degrees as the only blue thing on screen.",
      sv: "Väder visar den svenska prognosen utan annonser och animerade ikoner: en himmel som tonar från persika till vitt, ett kort, och graderna som det enda blå på skärmen.",
    },
    voice: {
      it: "Essenziale e affidabile: gradi, vento e probabilità, senza commento.",
      en: "Spare and dependable: degrees, wind and probability, with no commentary.",
      sv: "Avskalad och pålitlig: grader, vind och sannolikhet, utan kommentar.",
    },
    principles: {
      it: ["Il cielo è lo sfondo", "Il blu solo sui gradi", "Una scheda per volta", "Nessuna pubblicità"],
      en: ["The sky is the background", "Blue on the degrees only", "One card at a time", "No advertising"],
      sv: ["Himlen är bakgrunden", "Blått endast på graderna", "Ett kort i taget", "Ingen reklam"],
    },
    usage: {
      it: ["App e widget", "Schermate di ricerca città", "Icona e schermata di avvio"],
      en: ["App and widgets", "City search screens", "Icon and splash screen"],
      sv: ["App och widgetar", "Sökskärmar för orter", "Ikon och startskärm"],
    },
    merch: ["tee", "mug", "sticker", "tote", "notebook"],
    palette: [
      { name: "Gradi", hex: "#3E8BE0", role: "primary", on: "#FDF7F1" },
      { name: "Ardesia", hex: "#5C6B7A", role: "secondary", on: "#FDF7F1" },
      { name: "Pesca", hex: "#FCC8A3", role: "accent", on: "#1C2733" },
      { name: "Bruma", hex: "#FDF7F1", role: "paper", on: "#1C2733" },
      { name: "Notte", hex: "#1C2733", role: "ink", on: "#FDF7F1" },
    ],
  },

  couffer: {
    slug: "couffer",
    name: "Couffer",
    monogram: "C",
    tagline: "Il salone, gestito.",
    domain: "couffer.app",
    shape: "square",
    motif: "scissors",
    display: '"Optima", "Candara", "Gill Sans", "Segoe UI", sans-serif',
    body: SANS,
    tracking: "0.24em",
    paper: "#F6F1F0",
    ink: "#1D1618",
    primary: "#7C4B57",
    accent: "#D9A48F",
    story: {
      it: "Couffer è il gestionale di un salone: agenda, magazzino e portale clienti in un pannello solo. L'identità deve restare gentile anche dopo otto ore di uso.",
      en: "Couffer is a salon's back office: diary, stock and client portal in a single panel. The identity has to stay gentle after eight hours of use.",
      sv: "Couffer är salongens backoffice: kalender, lager och kundportal i en enda panel. Identiteten måste förbli mjuk även efter åtta timmars användning.",
    },
    voice: {
      it: "Chiara e paziente: un'istruzione per volta, nessun gergo gestionale.",
      en: "Clear and patient: one instruction at a time, no back-office jargon.",
      sv: "Tydlig och tålmodig: en instruktion i taget, ingen systemjargong.",
    },
    principles: {
      it: ["Prugna e cipria", "Contrasto alto sui testi", "Icone a tratto sottile", "Rosso solo per gli errori"],
      en: ["Plum and blush", "High contrast on text", "Thin line icons", "Red for errors only"],
      sv: ["Plommon och puder", "Hög kontrast i text", "Tunna linjeikoner", "Rött endast för fel"],
    },
    usage: {
      it: ["Pannello di gestione", "Portale clienti e conferme", "Etichette dei prodotti in vendita"],
      en: ["Admin panel", "Client portal and confirmations", "Retail product labels"],
      sv: ["Adminpanel", "Kundportal och bekräftelser", "Etiketter för butiksprodukter"],
    },
    merch: ["cape", "towel", "badge", "mug", "sticker"],
    palette: [
      { name: "Prugna", hex: "#7C4B57", role: "primary", on: "#F6F1F0" },
      { name: "Ardesia", hex: "#4A4046", role: "secondary", on: "#F6F1F0" },
      { name: "Cipria", hex: "#D9A48F", role: "accent", on: "#1D1618" },
      { name: "Lino", hex: "#F6F1F0", role: "paper", on: "#1D1618" },
      { name: "Inchiostro", hex: "#1D1618", role: "ink", on: "#F6F1F0" },
    ],
  },
  // Sampled from the live build: a near-black hero with the car, then light spec
  // pages in black on off-white, and the livery red only where the site itself
  // offers it (the "ROSSO" chip).
  //
  // Named for the EDITION, not the marque. The project is an independent concept
  // and the page says so, but a brand manual is the one artefact that could be
  // mistaken for a company's own, so the document carries the concept's name and
  // its own byline rather than presenting itself as Ferrari's.
  "ferrari-f8-tributo": {
    slug: "ferrari-f8-tributo",
    name: "F8 Tributo Edition",
    monogram: "F8",
    tagline: "720 cavalli, 2.9 secondi.",
    domain: "f8tributo.it",
    shape: "shield",
    motif: "route",
    display: '"Helvetica Neue", "Arial Black", Helvetica, Arial, sans-serif',
    body: SANS,
    tracking: "-0.01em",
    paper: "#EEEEF0",
    ink: "#0B0B0B",
    primary: "#C8102E",
    accent: "#B9B9B6",
    story: {
      it: "Un concept indipendente di pagina di lancio per la F8 Tributo: apertura al buio con la vettura, poi schede tecniche in nero su bianco e il rosso solo dove serve. Nessun legame con Ferrari S.p.A.",
      en: "An independent concept for an F8 Tributo launch page: it opens in the dark with the car, then spec pages in black on off-white, and the red only where it earns its place. Not affiliated with Ferrari S.p.A.",
      sv: "Ett oberoende koncept för en lanseringssida till F8 Tributo: den öppnar i mörker med bilen, sedan datablad i svart på benvitt, och rött bara där det gör nytta. Ingen koppling till Ferrari S.p.A.",
    },
    voice: {
      it: "Tecnica e trattenuta: cavalli, secondi e chilogrammi, messi accanto al modello precedente e lasciati parlare.",
      en: "Technical and held back: horsepower, seconds and kilograms, set beside the previous model and left to speak.",
      sv: "Teknisk och återhållen: hästkrafter, sekunder och kilogram, ställda intill föregående modell och lämnade att tala.",
    },
    principles: {
      it: ["Il rosso è la vettura, non la pagina", "Nero per l'emozione, bianco per i dati", "Un numero per riga", "Nessun superlativo"],
      en: ["The red is the car, not the page", "Black for the feeling, white for the data", "One figure per row", "No superlatives"],
      sv: ["Rött är bilen, inte sidan", "Svart för känslan, vitt för datan", "En siffra per rad", "Inga superlativ"],
    },
    usage: {
      it: ["Pagina di lancio e configuratore", "Confronto tecnico fra modelli", "Percorso d'ordine e test drive"],
      en: ["Launch page and configurator", "Model-to-model spec comparison", "Order path and test drive"],
      sv: ["Lanseringssida och konfigurator", "Teknisk jämförelse mellan modeller", "Orderflöde och provkörning"],
    },
    merch: ["cap", "polo", "notebook", "tote", "sticker"],
    palette: [
      { name: "Rosso livrea", hex: "#C8102E", role: "primary", on: "#EEEEF0" },
      { name: "Grafite", hex: "#3A3A3A", role: "secondary", on: "#EEEEF0" },
      { name: "Argento", hex: "#B9B9B6", role: "accent", on: "#0B0B0B" },
      { name: "Bianco", hex: "#EEEEF0", role: "paper", on: "#0B0B0B" },
      { name: "Asfalto", hex: "#0B0B0B", role: "ink", on: "#EEEEF0" },
    ],
  },

  // Sampled from the live build. This is the one kit whose palette IS the
  // product: four flavours, four colours, each taking a whole panel. So the
  // manual lists five colours and four of them are brand colours — the fourth
  // flavour rides as a second accent rather than being left out of a document
  // whose whole subject is "one colour, one flavour".
  mirzz: {
    slug: "mirzz",
    name: "MIRZZ",
    monogram: "M",
    tagline: "Un colore, un gusto.",
    domain: "mirzz.com",
    shape: "square",
    motif: "bolt",
    display: '"Haettenschweiler", "Arial Narrow", "Helvetica Neue", Impact, sans-serif',
    body: SANS,
    tracking: "0.01em",
    paper: "#0A0A0A",
    ink: "#FEFEFE",
    primary: "#70B6FE",
    accent: "#E682B4",
    story: {
      it: "Un concept indipendente di energy drink dove il colore è il nome del gusto: quattro lattine, quattro colori, e la pagina che cambia fondo insieme al gusto. Zero zuccheri, caffeina da chicco verde.",
      en: "An independent concept for an energy drink where the colour is the name of the flavour: four cans, four colours, and a page whose ground changes with the flavour. No sugar, caffeine from green coffee bean.",
      sv: "Ett oberoende koncept för en energidryck där färgen är smakens namn: fyra burkar, fyra färger, och en sida vars botten byter med smaken. Inget socker, koffein från grönt kaffebönor.",
    },
    voice: {
      it: "Breve e sicura: il gusto, il colore e i grammi. Niente promesse di prestazione, niente gergo da palestra.",
      en: "Short and confident: the flavour, the colour and the grams. No performance promises, no gym jargon.",
      sv: "Kort och självsäker: smaken, färgen och grammen. Inga prestationslöften, ingen gymjargong.",
    },
    principles: {
      it: ["Il colore è il nome del gusto", "Fondo nero, un colore per volta", "Condensato pesante maiuscolo", "Niente etichette da decifrare"],
      en: ["The colour is the flavour's name", "Black ground, one colour at a time", "Heavy condensed caps", "No label to decipher"],
      sv: ["Färgen är smakens namn", "Svart botten, en färg i taget", "Tunga kondenserade versaler", "Ingen etikett att tolka"],
    },
    usage: {
      it: ["Lattine e confezioni da quattro", "Pagina prodotto e kit di prova", "Frigo e espositori da banco"],
      en: ["Cans and four-packs", "Product page and trial kit", "Fridges and counter displays"],
      sv: ["Burkar och fyrpack", "Produktsida och provkit", "Kylar och diskdisplayer"],
    },
    merch: ["bottle", "box", "tee", "cap", "sticker"],
    palette: [
      { name: "Arctic", hex: "#70B6FE", role: "primary", on: "#0A0A0A" },
      { name: "Solar", hex: "#F38560", role: "secondary", on: "#0A0A0A" },
      { name: "Bloom", hex: "#E682B4", role: "accent", on: "#0A0A0A" },
      { name: "Surge", hex: "#6DC07C", role: "accent", on: "#0A0A0A" },
      { name: "Nero", hex: "#0A0A0A", role: "paper", on: "#FEFEFE" },
      { name: "Bianco", hex: "#FEFEFE", role: "ink", on: "#0A0A0A" },
    ],
  },
};

export function getBrandKit(slug: string): BrandKit | undefined {
  return BRAND_KITS[slug];
}

// ---- Colour maths used by the brand manual ------------------------------------
// HEX → RGB / HSL, so the colour page can print the same swatch in the three
// notations a printer or a developer actually asks for. CMYK is deliberately
// absent: an unmanaged conversion would put a number on the page that no press
// can honour.

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Legible text colour for a brand ground, picked between the kit's own paper and
 * ink. Several kits reuse one hex in two roles (Brasilena's yellow is both paper
 * and primary), so hardcoding "paper on primary" makes a page vanish.
 */
export function onColor(kit: BrandKit, background: string): string {
  return contrastRatio(background, kit.paper) >= contrastRatio(background, kit.ink)
    ? kit.paper
    : kit.ink;
}

/**
 * Ground for the manual's two painted surfaces (the cover and the sign-off
 * panel). The primary is the intended choice, but a few kits own a primary that
 * carries no small text at 4.5:1 against either of their own text colours —
 * Brado's fire red tops out at 4.0 — and those pages hold a version line and a
 * domain, not just a headline. Those kits fall back to their ink.
 */
export function documentGround(kit: BrandKit): string {
  return contrastRatio(onColor(kit, kit.primary), kit.primary) >= 4.5 ? kit.primary : kit.ink;
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, Math.round(l * 100)];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
