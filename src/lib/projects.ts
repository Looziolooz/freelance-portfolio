// Single source of truth for portfolio projects, shared by the home Work
// section and the in-site demo viewer at /work/[slug].
// - `demo`  = a live, embeddable URL (shown in-site via iframe)
// - `repo`  = source code (opened externally)
// - `image` = cover screenshot (used when there is no embeddable demo)
// Titles/tags/blurbs live in i18n under work.proj.{key}[.tags|.blurb].

export type Project = {
  id: string;
  key: string;
  slug: string;
  demo?: string;
  repo?: string;
  image?: string;
  // CSS object-position for the cover when the source is wider/taller than the
  // 16/10 card (e.g. a full-page screenshot). Defaults to "center"; use "left"
  // to keep a left-anchored composition (headline) from being cropped.
  imagePosition?: string;
  featured?: boolean;
  swatch?: string;
  // Temporarily pulled from the gallery AND its detail page (e.g. awaiting the
  // client's go-ahead to show it publicly). Data is kept; just not displayed.
  hidden?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "21",
    key: "21",
    slug: "ai-visibility",
    demo: "https://ai-visibility-rho.vercel.app/",
    repo: "https://github.com/Looziolooz/ai-visibility",
    image: "/projects/ai-visibility.png",
    featured: true,
    swatch: "#1b1a2e",
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
  },
  {
    id: "19",
    key: "19",
    slug: "bellitalia",
    repo: "https://github.com/Looziolooz/bellitalia",
    image: "/projects/bellitalia.png",
    featured: true,
    swatch: "#b9cdd6",
  },
  {
    id: "20",
    key: "20",
    slug: "bella-calabria",
    repo: "https://github.com/Looziolooz/bella-calabria",
    image: "/projects/bella-calabria.png",
    imagePosition: "left center", // 2.06:1 screenshot — keep the headline, crop the right
    featured: true,
    swatch: "#d8b896",
  },
  {
    id: "16",
    key: "16",
    slug: "brasilena",
    demo: "https://brasilena-website.vercel.app/",
    repo: "https://github.com/Looziolooz/brasilena-website",
    image: "/projects/brasilena.png",
    featured: true,
    swatch: "#FFD21E",
    hidden: true, // pending owners' OK — not shown for now
  },
  {
    id: "17",
    key: "17",
    slug: "barberia",
    demo: "https://barberia-ashy-beta.vercel.app/en",
    repo: "https://github.com/Looziolooz/barberia",
    image: "/projects/barberia.png",
    featured: true,
    swatch: "#cdbfa6",
  },
  {
    id: "11",
    key: "11",
    slug: "fotografo",
    demo: "https://fotografo-five.vercel.app/en",
    repo: "https://github.com/Looziolooz/fotografo",
    image: "/projects/fotografo.png",
    featured: true,
    swatch: "#f0e6d8",
  },
  {
    id: "12",
    key: "12",
    slug: "real-estate",
    repo: "https://github.com/Looziolooz/real-estate",
    featured: true,
    swatch: "#dce8f0",
  },
  {
    id: "13",
    key: "13",
    slug: "aurelia",
    demo: "https://aurelia-seven-fawn.vercel.app/en",
    repo: "https://github.com/Looziolooz/aurelia",
    image: "/projects/aurelia.png",
    featured: true,
    swatch: "#e8d8d8",
  },
  {
    id: "05",
    key: "05",
    slug: "pizzeria-lorenzo",
    demo: "https://lorenzospizzaria.netlify.app/",
  },
  {
    id: "07",
    key: "07",
    slug: "weather-se",
    demo: "https://weather-se.netlify.app/",
  },
  {
    id: "14",
    key: "14",
    slug: "couffer",
    repo: "https://github.com/Looziolooz/couffer",
  },
  {
    id: "15",
    key: "15",
    slug: "pizzeria-restaurant",
    demo: "https://pizzeria-restaurant.vercel.app/",
    repo: "https://github.com/Looziolooz/pizzeria-restaurant",
    image: "/projects/pizzeria-restaurant.png",
    featured: true,
    swatch: "#e8c4a0",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
