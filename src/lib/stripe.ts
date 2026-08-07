import Stripe from "stripe";

// The API version is intentionally NOT pinned here: the installed SDK ships a
// matching default, and the webhook reads period fields defensively (top-level
// or per-item) so it keeps working across Stripe API versions. Pinning a string
// the SDK doesn't recognise is a silent runtime footgun.
//
// Built ON DEMAND, never at module load. The SDK throws "Neither apiKey nor
// config.authenticator provided" when constructed without a key, so an eager
// `new Stripe(process.env.STRIPE_SECRET_KEY ?? "")` made merely IMPORTING this
// file fatal wherever the secret is absent — which took `next build` down at
// "Collecting page data" on any environment without it, even though the paid
// surfaces are pre-launch (LAUNCH_MODE "minimal") and nothing on the public
// site touches Stripe. Deferring it means a missing key is a clean 500 from the
// one route that needed it, not a dead deploy.
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  client = new Stripe(key);
  return client;
}

export const PRICE_IDS: Record<string, string> = {
  SUPPORTER: process.env.STRIPE_SUPPORTER_PRICE_ID ?? "",
  PRO: process.env.STRIPE_PRO_PRICE_ID ?? "",
  // One-time "lifetime" price (€100). Bought via Checkout in `payment` mode and
  // grants permanent PRO access — see create-checkout + the webhook payment branch.
  LIFETIME: process.env.STRIPE_LIFETIME_PRICE_ID ?? "",
};

// Map a Stripe price id back to one of our tiers (used by the webhook to decide
// which tier a subscription grants). The lifetime price grants PRO.
export function tierForPrice(
  priceId: string | null | undefined
): "SUPPORTER" | "PRO" | null {
  if (!priceId) return null;
  if (priceId === PRICE_IDS.PRO) return "PRO";
  if (priceId === PRICE_IDS.LIFETIME) return "PRO";
  if (priceId === PRICE_IDS.SUPPORTER) return "SUPPORTER";
  return null;
}

export async function createCustomer(email: string, name?: string) {
  return getStripe().customers.create({ email, name });
}

// Hosted Stripe Customer Portal — lets a subscriber update payment method,
// switch plan, or cancel, with no card data ever touching our backend.
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
