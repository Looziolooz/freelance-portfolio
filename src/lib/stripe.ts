import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-04-22.dahlia" as const,
});

export const PRICE_IDS: Record<string, string> = {
  SUPPORTER: process.env.STRIPE_SUPPORTER_PRICE_ID ?? "",
  PRO: process.env.STRIPE_PRO_PRICE_ID ?? "",
};

export async function createCheckoutSession(
  priceId: string,
  customerId: string | undefined,
  successUrl: string,
  cancelUrl: string
) {
  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createCustomer(email: string, name?: string) {
  return stripe.customers.create({ email, name });
}
