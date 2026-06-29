import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { stripe, PRICE_IDS, createCustomer } from "@/lib/stripe";
import { success, error } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { tier } = await req.json();

    if (!["SUPPORTER", "PRO", "LIFETIME"].includes(tier)) {
      return error("Invalid tier");
    }

    // LIFETIME is a one-time payment that grants permanent PRO access.
    const isLifetime = tier === "LIFETIME";
    const priceId = isLifetime ? PRICE_IDS.LIFETIME : PRICE_IDS[tier];
    if (!priceId) {
      return error("Price ID not configured for this tier");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user) return error("User not found", 404);

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await createCustomer(user.email, user.name ?? undefined);
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const checkout = await stripe.checkout.sessions.create({
      mode: isLifetime ? "payment" : "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      client_reference_id: user.id,
      // Lifetime purchases grant PRO; the webhook reads tier from here.
      metadata: { userId: user.id, tier: isLifetime ? "PRO" : tier, kind: isLifetime ? "lifetime" : "subscription" },
      success_url: `${origin}/members-only?checkout=success`,
      cancel_url: `${origin}/membership?checkout=cancelled`,
      ...(isLifetime
        ? {}
        : { subscription_data: { metadata: { userId: user.id, tier } } }),
    });

    return success({ url: checkout.url });
  } catch (e) {
    console.error("Checkout error:", e);
    return error("Internal server error", 500);
  }
}
