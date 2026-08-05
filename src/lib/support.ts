// "Offrimi un caffè" — voluntary support for the free content (prompts, guides).
//
// OFF until the free content actually exists: asking for a tip before giving
// anything away reads as begging, after it reads as thanks. Flip SUPPORT_MODE to
// "on" the day the first free prompts publish.
//
// The destination is an env var so the platform can change (Ko-fi, Buy Me a
// Coffee, PayPal.me, Stripe payment link) without touching components. Set
// NEXT_PUBLIC_COFFEE_URL in .env.local and in the Vercel project.
export type SupportMode = "off" | "on";

// `as SupportMode` (not a plain annotation): without it TS narrows the constant
// to the literal "off" and flags the comparison below as impossible.
export const SUPPORT_MODE = "off" as SupportMode;

export const COFFEE_URL = process.env.NEXT_PUBLIC_COFFEE_URL || "";

/** True only when both the switch is on AND a destination is configured, so the
 *  button can never render pointing nowhere. */
export const isSupportEnabled = SUPPORT_MODE === "on" && COFFEE_URL.length > 0;
