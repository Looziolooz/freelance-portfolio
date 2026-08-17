// Frames captured from each live demo build (hero + two scrolled views), used by
// the brand manual's photography page. Regenerate with `bash scripts/brand-shots.sh`
// after a demo is redesigned; this list is what the page checks before rendering,
// so a project missing from it simply skips that page.

const WITH_SHOTS = new Set([
  "ai-visibility",
  "aliva",
  "aurelia",
  "barberia",
  "bella-calabria",
  "brado",
  "brasilena",
  "buss-travel",
  "ferrari-f8-tributo",
  "fotografo",
  "gelateria",
  "mirzz",
  "nordbageriet",
  "pizzeria-lorenzo",
  "pizzeria-restaurant",
  "sushi",
  "vespa-heritage",
  "weather-se",
  "yoga",
]);

export function brandShots(slug: string): string[] {
  return WITH_SHOTS.has(slug) ? [1, 2, 3].map((n) => `/brand-shots/${slug}/${n}.jpg`) : [];
}
