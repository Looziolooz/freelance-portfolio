// Single source of truth for portfolio projects, shared by the /work page
// viewer and the in-site demo viewer at /work/[slug].
// - `demo`  = a live, embeddable URL (shown in-site via iframe)
// - `repo`  = source code (opened externally)
// - `image` = cover screenshot (used when there is no embeddable demo)
// Titles/tags/blurbs live in i18n under work.proj.{key}[.tags|.blurb].
//
// `category` drives the filter bar on /work. It is derived from each
// project's nature, not its tech stack: "website" (siti vetrina/landing),
// "saas" (prodotti/app con area utente), "automazione" (flussi dati/regole),
// "ai" (agenti e automazioni guidate da LLM).

export type ProjectCategory = "website" | "saas" | "automazione" | "ai";

export type Project = {
  id: string;
  key: string;
  slug: string;
  demo?: string;
  repo?: string;
  image?: string;
  // Short looping cover clip (muted, autoplay) shown in the /work viewer instead
  // of the static `image`. `image` stays as the poster + reduced-motion fallback.
  coverVideo?: string;
  // CSS object-position for the cover when the source is wider/taller than the
  // 16/10 card (e.g. a full-page screenshot). Defaults to "center"; use "left"
  // to keep a left-anchored composition (headline) from being cropped.
  imagePosition?: string;
  featured?: boolean;
  swatch?: string;
  // Filter category shown on /work.
  category?: ProjectCategory;
  // Temporarily pulled from the gallery AND its detail page (e.g. awaiting the
  // client's go-ahead to show it publicly). Data is kept; just not displayed.
  hidden?: boolean;
  // Demo that references a real, third-party brand. Renders an explicit
  // "independent concept, not affiliated/endorsed" disclaimer on the detail page
  // so it can be shown safely as a portfolio concept piece.
  concept?: boolean;
  // Visible attribution for work built on someone else licensed material.
  // CC BY requires the credit where the derived work is shown, not in a repo file.
  credit?: string;
};

// Order shown in the filter bar (after "Tutti"). The labels themselves live in
// i18n under work.filter.{id}.
export const CATEGORIES: ProjectCategory[] = ["website", "saas", "automazione", "ai"];

export const PROJECTS: Project[] = [
  {
    id: "35",
    key: "helios",
    slug: "helios",
    demo: "https://helios-snowy-beta.vercel.app/",
    image: "/projects/helios.png",
    featured: true,
    swatch: "#FFB43D",
    category: "website",
  },
  {
    id: "34",
    key: "mercato",
    slug: "mappa-mercato",
    image: "/projects/mappa-mercato.png",
    coverVideo: "/projects/mappa-mercato.mp4",
    featured: true,
    swatch: "#143A2B",
    category: "automazione",
  },
  {
    id: "33",
    key: "seo",
    slug: "audit-visibilita",
    image: "/projects/audit-seo.png",
    coverVideo: "/projects/audit-seo.mp4",
    featured: true,
    swatch: "#143A2B",
    category: "automazione",
  },
  {
    id: "32",
    key: "whatsapp",
    slug: "assistente-whatsapp",
    image: "/projects/whatsapp-ai.png",
    coverVideo: "/projects/whatsapp-ai.mp4",
    featured: true,
    swatch: "#143A2B",
    category: "ai",
  },
  {
    id: "31",
    key: "social",
    slug: "contenuti-social",
    image: "/projects/social-ai.png",
    coverVideo: "/projects/social-ai.mp4",
    featured: true,
    swatch: "#143A2B",
    category: "ai",
  },
  {
    id: "30",
    key: "email",
    slug: "risposte-email",
    image: "/projects/email-ai.png",
    coverVideo: "/projects/email-ai.mp4",
    featured: true,
    swatch: "#143A2B",
    category: "ai",
  },
  {
    id: "29",
    key: "solleciti",
    slug: "solleciti-pagamento",
    image: "/projects/solleciti.png",
    coverVideo: "/projects/solleciti.mp4",
    featured: true,
    swatch: "#143A2B",
    category: "automazione",
  },
  {
    id: "28",
    key: "nordbageriet",
    slug: "nordbageriet",
    demo: "https://bakery-tan-two.vercel.app",
    repo: "https://github.com/Looziolooz/bakery",
    image: "/projects/nordbageriet.png",
    coverVideo: "/projects/nordbageriet.mp4",
    featured: true,
    swatch: "#17130D",
    category: "website",
  },
  {
    id: "27",
    key: "buss-travel",
    slug: "buss-travel",
    demo: "https://buss-travel.vercel.app/",
    repo: "https://github.com/Looziolooz/buss-travel",
    image: "/projects/buss-travel.png",
    coverVideo: "/projects/buss-travel.mp4",
    featured: true,
    swatch: "#26333B",
    category: "website",
  },
  {
    id: "26",
    key: "aliva",
    slug: "aliva",
    demo: "https://pileggi-olio.vercel.app/",
    repo: "https://github.com/Looziolooz/pileggi-olio",
    image: "/projects/aliva.png",
    coverVideo: "/projects/aliva.mp4",
    featured: true,
    swatch: "#5D6C45",
    concept: true, // Azienda Agricola Paone is a real producer — shown as an independent concept
    category: "website",
  },
  {
    id: "25",
    key: "yoga",
    slug: "yoga",
    demo: "https://yoga-two-beryl.vercel.app/",
    repo: "https://github.com/Looziolooz/yoga",
    image: "/projects/yoga.png",
    coverVideo: "/projects/yoga.mp4",
    featured: true,
    swatch: "#A4B0A0",
    category: "website",
  },
  {
    id: "24",
    key: "sushi",
    slug: "sushi",
    demo: "https://sushi-lyart-ten.vercel.app/",
    repo: "https://github.com/Looziolooz/sushi",
    image: "/projects/sushi.png",
    coverVideo: "/projects/sushi.mp4",
    featured: true,
    swatch: "#C6A15B",
    category: "website",
  },
  {
    id: "23",
    key: "brado",
    slug: "brado",
    demo: "https://brado-vert.vercel.app/",
    repo: "https://github.com/Looziolooz/brado",
    image: "/projects/brado.png",
    coverVideo: "/projects/brado.mp4",
    featured: true,
    swatch: "#241a14",
    category: "website",
  },
  {
    id: "22",
    key: "22",
    slug: "gelateria",
    demo: "https://gelateria-theta.vercel.app/",
    repo: "https://github.com/Looziolooz/gelateria-",
    image: "/projects/gelateria.png",
    coverVideo: "/projects/gelateria.mp4",
    featured: true,
    swatch: "#e9ddc8",
    category: "website",
  },
  {
    id: "21",
    key: "21",
    slug: "ai-visibility",
    demo: "https://ai-visibility-rho.vercel.app/",
    repo: "https://github.com/Looziolooz/ai-visibility",
    image: "/projects/ai-visibility.png",
    coverVideo: "/projects/ai-visibility.mp4",
    featured: true,
    swatch: "#1b1a2e",
    category: "saas",
  },
  {
    id: "18",
    key: "18",
    slug: "vespa-heritage",
    demo: "https://vespa-heritage.vercel.app/",
    repo: "https://github.com/Looziolooz/vespa-heritage",
    image: "/projects/vespa-heritage.png",
    featured: true,
    swatch: "#cfc9bf",
    category: "website",
  },
  {
    id: "20",
    key: "20",
    slug: "bella-calabria",
    demo: "https://bella-calabria.vercel.app/",
    repo: "https://github.com/Looziolooz/bella-calabria",
    image: "/projects/bella-calabria.png",
    imagePosition: "left center", // 2.06:1 screenshot — keep the headline, crop the right
    featured: true,
    swatch: "#d8b896",
    category: "website",
  },
  {
    id: "16",
    key: "16",
    slug: "brasilena",
    demo: "https://brasilena-website.vercel.app/",
    repo: "https://github.com/Looziolooz/brasilena-website",
    image: "/projects/brasilena.png",
    coverVideo: "/projects/brasilena.mp4",
    featured: true,
    swatch: "#FFD21E",
    concept: true, // references a real brand — shown as an independent concept
    category: "website",
  },
  {
    id: "17",
    key: "17",
    slug: "barberia",
    demo: "https://barberia-ashy-beta.vercel.app/en",
    repo: "https://github.com/Looziolooz/barberia",
    image: "/projects/barberia.png",
    coverVideo: "/projects/barberia.mp4",
    featured: true,
    swatch: "#cdbfa6",
    category: "website",
  },
  {
    id: "11",
    key: "11",
    slug: "fotografo",
    demo: "https://fotografo-five.vercel.app/en",
    repo: "https://github.com/Looziolooz/fotografo",
    image: "/projects/fotografo.png",
    coverVideo: "/projects/fotografo.mp4",
    featured: true,
    swatch: "#f0e6d8",
    category: "website",
  },
  {
    id: "13",
    key: "13",
    slug: "aurelia",
    demo: "https://aurelia-seven-fawn.vercel.app/en",
    repo: "https://github.com/Looziolooz/aurelia",
    image: "/projects/aurelia.png",
    coverVideo: "/projects/aurelia.mp4",
    featured: true,
    swatch: "#e8d8d8",
    category: "website",
  },
  {
    id: "05",
    key: "05",
    slug: "pizzeria-lorenzo",
    demo: "https://lorenzospizzaria.netlify.app/",
    category: "website",
  },
  {
    id: "07",
    key: "07",
    slug: "weather-se",
    demo: "https://weather-se.netlify.app/",
    category: "saas",
  },
  {
    id: "14",
    key: "14",
    slug: "couffer",
    repo: "https://github.com/Looziolooz/couffer",
    category: "saas",
  },
  {
    id: "15",
    key: "15",
    slug: "pizzeria-restaurant",
    demo: "https://pizzeria-restaurant.vercel.app/",
    repo: "https://github.com/Looziolooz/pizzeria-restaurant",
    image: "/projects/pizzeria-restaurant.png",
    coverVideo: "/projects/pizzeria-restaurant.mp4",
    featured: true,
    swatch: "#e8c4a0",
    category: "website",
  },
  {
    id: "35",
    key: "ferrari",
    slug: "ferrari-f8-tributo",
    demo: "https://ferrari-delta-rose.vercel.app/",
    featured: true,
    swatch: "#C8102E",
    concept: true, // references the Ferrari brand — shown as an independent concept
    category: "website",
  },
  {
    id: "36",
    key: "mirzz",
    slug: "mirzz",
    demo: "https://energy-drink-mocha-ten.vercel.app/",
    featured: true,
    swatch: "#FF7A1A",
    concept: true, // references the MIRZZ brand — shown as an independent concept
    category: "website",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
