import { PROJECTS, type Project } from "./projects";
import { getBrandKit } from "./brand-kits";

// The disciplines the work is shown under, each its own page below /work.
//
// Static route segments win over the `[slug]` one in Next, so /work/branding
// resolves here and not as a project called "branding"; all four names were
// checked against the 26 project slugs and none collides.
//
// What each set actually holds:
//
//   branding        17 projects, every one with a brand kit and a browsable
//                   fascicolo. The richest set on the site.
//   web-design      16 built sites, each with a live demo.
//   automazioni-ai   6 flows, the automation and agent demos.
//   marketing        3, and they are the SAME three that appear under
//                   automazioni-ai. Visibility, social and market data are sold
//                   as marketing but built as automations, so the overlap is
//                   real rather than a filtering mistake.
//
// There was a fifth, Development. It came out again: one project is not a body
// of work, and a page that has to apologise for its own gallery argues against
// the studio instead of for it. The build story lives on /processo.
//
// When more marketing work exists, it goes in MARKETING_SLUGS here and the page
// fills out on its own.

export type DisciplineId =
  | "branding"
  | "web-design"
  | "marketing"
  | "automazioni-ai";

export type Discipline = {
  id: DisciplineId;
  /** URL segment under /work. */
  slug: string;
  /**
   * i18n key prefix: disc.<id>.label / .title / .sub / .extra
   *
   * The visible name is `<key>.label` and NOT a literal here: an Italian visitor
   * reads "Marchi" and "Sviluppo", a Swedish one "Varumärke" and "Utveckling".
   * Only the slug stays fixed, so the URLs do not move between languages.
   */
  key: string;
  /** Which featured projects belong here. */
  select: (p: Project) => boolean;
  /**
   * What each card should lead with. `manual` sends the reader to the brand
   * fascicolo, `demo` to the built site, `flow` to the automation diagram.
   */
  lead: "manual" | "demo" | "flow";
};

const live = (p: Project) => Boolean(p.featured) && !p.hidden;

/** Projects sold as marketing, built as automations. See the note above. */
const MARKETING_SLUGS = ["audit-visibilita", "contenuti-social", "mappa-mercato"];

export const DISCIPLINES: Discipline[] = [
  {
    id: "branding",
    slug: "branding",
    key: "disc.branding",
    select: (p) => live(p) && Boolean(getBrandKit(p.slug)),
    lead: "manual",
  },
  {
    id: "web-design",
    slug: "web-design",
    key: "disc.web-design",
    select: (p) => live(p) && p.category === "website",
    lead: "demo",
  },
  {
    id: "marketing",
    slug: "marketing",
    key: "disc.marketing",
    select: (p) => live(p) && MARKETING_SLUGS.includes(p.slug),
    lead: "flow",
  },
  {
    id: "automazioni-ai",
    slug: "automazioni-ai",
    key: "disc.automazioni-ai",
    select: (p) => live(p) && (p.category === "automazione" || p.category === "ai"),
    lead: "flow",
  },
];

export function getDiscipline(slug: string): Discipline | undefined {
  return DISCIPLINES.find((d) => d.slug === slug);
}

export function disciplineProjects(d: Discipline): Project[] {
  return PROJECTS.filter(d.select);
}
