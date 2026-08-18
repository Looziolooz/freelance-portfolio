import type { Lang } from "@/i18n";

// Worked examples for the "contenuti social" service.
//
// That service was the only one on the homepage sold with no artefact attached:
// the bento cell promises "contenuti pronti da pubblicare" and the visitor never
// sees one. A price and a promise, no object.
//
// Three formats, three DIFFERENT real projects from the portfolio, so the demo
// cannot read as one lucky case dressed three ways. Every factual claim below is
// taken from the project's own copy in i18n (Nordbageriet since 1952, the
// gelateria's three shops since 1978, Brado's beechwood charcoal), because a
// demo that invents facts about real work is worth less than no demo.
//
// Deliberately absent: like counts, view counts, follower numbers, "sold out in
// 3 days". The site already refuses fabricated testimonials; invented engagement
// is the same lie with a smaller font. These are labelled as examples of the
// craft, and the craft is the copy and the structure, not the numbers.

export type CarouselSlide = { t: string; b: string };

export type SocialDemoCopy = {
  hint: string;
  tabPost: string;
  tabCarousel: string;
  tabReel: string;
  /** Chrome labels shared by the three formats. */
  sourceLabel: string;
  noteLabel: string;
  slideLabel: string;
  mutedLabel: string;
  post: { project: string; caption: string; tags: string; note: string };
  carousel: { project: string; slides: CarouselSlide[]; caption: string; note: string };
  /** One entry per clip in SOCIAL_REELS, same order. */
  reel: { note: string; generated: string; items: { project: string; lines: string[]; caption: string }[] };
};

export const SOCIAL_POST_IMAGE = "/projects/nordbageriet.png";
// One image per carousel slide, in slide order. Text-only slides were the
// problem: on a platform where the picture is what stops the thumb, three of the
// four slides carried nothing to stop it with, and the sequence read as
// unfinished. These are generated the same way as the reels — a photo of a
// counter at rush hour, a phone taking the booking, the shop closed with the
// bags already packed — so the carousel now tells its story in pictures and uses
// the text as the caption it actually is.
export const SOCIAL_CAROUSEL_SLIDES = [
  "/social/car-slide1.jpg",
  "/social/car-slide2.jpg",
  "/social/car-slide3.jpg",
  "/social/car-slide4.jpg",
];
// Real 9:16 footage, generated with Higgsfield (kling3_0, 5s, std) from the
// facts Brado's own project page already states. It replaces a 16:9 screen
// recording of the website cropped into a vertical frame, which read as a mock
// to anyone who actually posts reels — and the reel is the one format on this
// page where the medium IS the product being sold.
// Master clip: see the result_url in public/social/reel-brado.json (CloudFront,
// expires); regenerating costs ~9 credits via scripts/social-reels.ps1.
// Paths live here rather than inside each language, because a file path is not
// a translation and repeating it three times is three places to mistype it.
export const SOCIAL_REELS = [
  { video: "/social/reel-brado.mp4", poster: "/social/reel-brado.jpg" },
  { video: "/social/reel-gelateria.mp4", poster: "/social/reel-gelateria.jpg" },
  { video: "/social/reel-nordbageriet.mp4", poster: "/social/reel-nordbageriet.jpg" },
];

const COPY: Record<Lang, SocialDemoCopy> = {
  it: {
    hint: "Tre formati, tre progetti veri del portfolio. Nessun numero inventato: quello che vedi è il testo e la struttura, che è la parte che si paga.",
    tabPost: "Post",
    tabCarousel: "Carosello",
    tabReel: "Reel",
    sourceLabel: "Dal progetto",
    noteLabel: "Perché è costruito così",
    slideLabel: "Slide",
    mutedLabel: "Senza audio, come lo guardano quasi tutti",
    post: {
      project: "Nordbageriet",
      caption:
        "Dal 1952 riforniscono panetterie in mezza Svezia. Da oggi il catalogo si sfoglia online, in inglese e in svedese, e i punti vendita si trovano sulla mappa.\n\nUn fornitore B2B che finalmente si presenta come un marchio, non come un listino in PDF.",
      tags: "#panificazione #b2b #nuovosito #svezia",
      note:
        "Un post B2B non vende il prodotto, fa capire al buyer con chi sta parlando. Per questo la prima riga è l’anno e non il servizio: 1952 fa il lavoro che nessun aggettivo farebbe.",
    },
    carousel: {
      project: "Artigiano Gelateria",
      slides: [
        { t: "Dal 1978, tre botteghe", b: "Cosenza, Catanzaro, Lamezia." },
        { t: "Il problema", b: "Un solo telefono che squillava per ogni ordine, mentre al banco c’era la coda." },
        { t: "Cosa è cambiato", b: "Il ritiro si prenota dal sito. L’ordine arriva in cassa già scritto." },
        { t: "Il risultato", b: "Si ordina anche a bottega chiusa, e c’è meno coda quando è aperta." },
      ],
      caption: "Quattro slide per raccontare un lavoro senza dire una sola volta «sito web».",
      note:
        "Un carosello funziona quando ogni slide regge da sola: chi si ferma alla seconda deve comunque aver capito qualcosa. Per questo il problema arriva prima della soluzione, e il risultato è l’ultima cosa che si legge.",
    },
    reel: {
      generated: "I video li costruisco con l’AI partendo da quello che c’è: una foto, un video già girato, o solo un prompt. Da lì escono le riprese e gli effetti. È il motivo per cui un reel al mese sta dentro un abbonamento, senza troupe e senza giornata di shooting.",
      note:
        "Il reel non spiega, mostra. Il testo in sovrimpressione non è una didascalia: è l’unica cosa che arriva a chi guarda senza audio, cioè quasi tutti. L’ultima riga è sempre l’unica che chiede qualcosa.",
      items: [
        {
          project: "Brado",
          lines: [
            "Manzo italiano, allevamento brado.",
            "Brace di faggio.",
            "Pane lievitato in casa.",
            "Il tavolo si prenota dal sito.",
          ],
          caption: "Cinque secondi, quattro frasi, nessuna voce fuori campo.",
        },
        {
          project: "Artigiano Gelateria",
          lines: [
            "Gelato artigianale dal 1978.",
            "Il pistacchio si fa la mattina.",
            "Tre botteghe, stesso banco.",
            "Il ritiro si prenota dal sito.",
          ],
          caption: "Stessa struttura, mestiere completamente diverso.",
        },
        {
          project: "Nordbageriet",
          lines: [
            "Riforniscono panetterie dal 1952.",
            "Ogni mattina, in mezza Svezia.",
            "Catalogo online, in due lingue.",
            "I punti vendita sono sulla mappa.",
          ],
          caption: "Un B2B non è condannato a essere noioso.",
        },
      ],
    },
  },
  en: {
    hint: "Three formats, three real projects from the portfolio. No invented numbers: what you see is the copy and the structure, which is the part you pay for.",
    tabPost: "Post",
    tabCarousel: "Carousel",
    tabReel: "Reel",
    sourceLabel: "From the project",
    noteLabel: "Why it is built this way",
    slideLabel: "Slide",
    mutedLabel: "Sound off, the way nearly everyone watches",
    post: {
      project: "Nordbageriet",
      caption:
        "They have supplied bakeries across half of Sweden since 1952. From today the catalogue is online, in English and Swedish, and the stockists are on the map.\n\nA B2B supplier that finally introduces itself as a brand, not as a price list in PDF.",
      tags: "#baking #b2b #newwebsite #sweden",
      note:
        "A B2B post does not sell the product, it tells the buyer who they are dealing with. That is why the first line is the year and not the service: 1952 does the work no adjective would.",
    },
    carousel: {
      project: "Artigiano Gelateria",
      slides: [
        { t: "Since 1978, three shops", b: "Cosenza, Catanzaro, Lamezia." },
        { t: "The problem", b: "One phone line ringing for every order, while a queue built at the counter." },
        { t: "What changed", b: "Pickup is booked from the site. The order reaches the counter already written." },
        { t: "The result", b: "Orders come in with the shop closed, and there is less queue when it is open." },
      ],
      caption: "Four slides telling the story of a job without once saying the words “new website”.",
      note:
        "A carousel works when every slide stands on its own: someone who stops at the second must still have learned something. That is why the problem comes before the solution, and the result is the last thing read.",
    },
    reel: {
      generated: "I build the video with AI from whatever already exists: a photo, footage you have, or just a prompt. The shots and the effects come out of that. It is the reason a reel a month fits inside a retainer, with no crew and no shoot day.",
      note:
        "A reel does not explain, it shows. The on-screen text is not a caption: it is the only thing that reaches a viewer with the sound off, which is nearly all of them. The last line is always the only one that asks for anything.",
      items: [
        {
          project: "Brado",
          lines: [
            "Italian beef, pasture-raised.",
            "Beechwood charcoal.",
            "Bread leavened in house.",
            "Book the table from the site.",
          ],
          caption: "Five seconds, four lines, no voiceover.",
        },
        {
          project: "Artigiano Gelateria",
          lines: [
            "Artisan gelato since 1978.",
            "The pistachio is made each morning.",
            "Three shops, one counter.",
            "Book pickup from the site.",
          ],
          caption: "Same structure, an entirely different trade.",
        },
        {
          project: "Nordbageriet",
          lines: [
            "Supplying bakeries since 1952.",
            "Every morning, across half of Sweden.",
            "Catalogue online, in two languages.",
            "The stockists are on the map.",
          ],
          caption: "B2B is not condemned to be boring.",
        },
      ],
    },
  },
  sv: {
    hint: "Tre format, tre riktiga projekt ur portföljen. Inga påhittade siffror: det du ser är texten och strukturen, vilket är den del du betalar för.",
    tabPost: "Inlägg",
    tabCarousel: "Karusell",
    tabReel: "Reel",
    sourceLabel: "Från projektet",
    noteLabel: "Varför den är byggd så här",
    slideLabel: "Bild",
    mutedLabel: "Utan ljud, som nästan alla tittar",
    post: {
      project: "Nordbageriet",
      caption:
        "Sedan 1952 levererar de till bagerier i halva Sverige. Från och med idag bläddrar du katalogen online, på engelska och svenska, och återförsäljarna finns på kartan.\n\nEn B2B-leverantör som äntligen presenterar sig som ett varumärke, inte som en prislista i PDF.",
      tags: "#bageri #b2b #nysajt #sverige",
      note:
        "Ett B2B-inlägg säljer inte produkten, det låter köparen förstå vem hen har att göra med. Därför är första raden årtalet och inte tjänsten: 1952 gör jobbet som inget adjektiv skulle göra.",
    },
    carousel: {
      project: "Artigiano Gelateria",
      slides: [
        { t: "Sedan 1978, tre butiker", b: "Cosenza, Catanzaro, Lamezia." },
        { t: "Problemet", b: "En enda telefon som ringde för varje beställning, medan kön växte vid disken." },
        { t: "Vad som ändrades", b: "Upphämtningen bokas på sajten. Beställningen når disken färdigskriven." },
        { t: "Resultatet", b: "Beställningar kommer in med stängd butik, och kön är kortare när den är öppen." },
      ],
      caption: "Fyra bilder som berättar ett jobb utan att en enda gång säga ”ny sajt”.",
      note:
        "En karusell fungerar när varje bild bär sig själv: den som stannar vid den andra ska ändå ha lärt sig något. Därför kommer problemet före lösningen, och resultatet är det sista man läser.",
    },
    reel: {
      generated: "Videon bygger jag med AI utifrån det som redan finns: ett foto, material du har, eller bara en prompt. Tagningarna och effekterna kommer därifrån. Det är därför en reel i månaden ryms i ett abonnemang, utan filmteam och utan inspelningsdag.",
      note:
        "En reel förklarar inte, den visar. Texten i bild är ingen bildtext: den är det enda som når den som tittar utan ljud, alltså nästan alla. Sista raden är alltid den enda som ber om något.",
      items: [
        {
          project: "Brado",
          lines: [
            "Italienskt nötkött, frigående.",
            "Glöd av bokträ.",
            "Bröd jäst på plats.",
            "Boka bordet på sajten.",
          ],
          caption: "Fem sekunder, fyra rader, ingen speakerröst.",
        },
        {
          project: "Artigiano Gelateria",
          lines: [
            "Hantverksglass sedan 1978.",
            "Pistagen görs varje morgon.",
            "Tre butiker, samma disk.",
            "Boka upphämtning på sajten.",
          ],
          caption: "Samma struktur, ett helt annat hantverk.",
        },
        {
          project: "Nordbageriet",
          lines: [
            "Levererar till bagerier sedan 1952.",
            "Varje morgon, i halva Sverige.",
            "Katalog online, på två språk.",
            "Återförsäljarna finns på kartan.",
          ],
          caption: "B2B är inte dömt att vara tråkigt.",
        },
      ],
    },
  },
};

export function getSocialDemo(lang: Lang): SocialDemoCopy {
  return COPY[lang];
}
