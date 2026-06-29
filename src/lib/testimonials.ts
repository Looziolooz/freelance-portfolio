// Real client testimonials shown in the Trust section (homepage). Kept empty
// until there are genuine ones — we never invent social proof. To add one, push
// an object below; the Trust section renders them automatically (and hides the
// block entirely while the list is empty).
//
// Example shape:
//   { quote: "Lorenzo ha rifatto il nostro sito e le richieste sono raddoppiate.",
//     name: "Maria Rossi", role: "Titolare, Gelateria X", project: "gelateria" }

export type Testimonial = {
  /** The quote, in the client's words. */
  quote: string;
  /** Person's name. */
  name: string;
  /** Role / company (optional). */
  role?: string;
  /** Optional project slug to link to (matches PROJECTS in lib/projects). */
  project?: string;
};

export const TESTIMONIALS: Testimonial[] = [];
