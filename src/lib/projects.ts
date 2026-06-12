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
  featured?: boolean;
  swatch?: string;
};

export const PROJECTS: Project[] = [
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
