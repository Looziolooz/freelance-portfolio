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
    id: "16",
    key: "16",
    slug: "brasilena",
    repo: "https://github.com/Looziolooz/brasilena-website",
    image: "/projects/brasilena.png",
    featured: true,
    swatch: "#FFD21E",
  },
  {
    id: "11",
    key: "11",
    slug: "fotografo",
    repo: "https://github.com/Looziolooz/fotografo",
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
    repo: "https://github.com/Looziolooz/aurelia",
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
    repo: "https://github.com/Looziolooz/pizzeria-restaurant",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
