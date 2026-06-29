import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, tierForPrice, PRICE_IDS } from "@/lib/stripe";
import { error } from "@/lib/api-response";

// Period start/end + price id are read defensively: on newer Stripe API
// versions they live on the subscription ITEM, on older ones on the
// subscription itself. `sub` is loosely typed so both shapes work.
function readSub(sub: any) {
  const item = sub?.items?.data?.[0];
  const startUnix = sub?.current_period_start ?? item?.current_period_start ?? null;
  const endUnix = sub?.current_period_end ?? item?.current_period_end ?? null;
  return {
    priceId: (item?.price?.id ?? null) as string | null,
    status: (sub?.status ?? "active") as string,
    currentPeriodStart: startUnix ? new Date(startUnix * 1000) : null,
    currentPeriodEnd: endUnix ? new Date(endUnix * 1000) : null,
  };
}

const idOf = (v: unknown): string | null =>
  typeof v === "string" ? v : (v as { id?: string } | null)?.id ?? null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) return error("Missing stripe-signature", 400);

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return error("Webhook secret not configured", 500);

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      return error("Invalid signature", 400);
    }

    switch (event.type) {
      // A checkout completed → grant the tier and record the subscription. The
      // Checkout Session carries neither the period dates nor the price, so we
      // retrieve the subscription itself. Upsert keeps it idempotent (Stripe
      // can and does resend this event).
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId: string | undefined = session.metadata?.userId;
        const tier: string | undefined = session.metadata?.tier;
        const customerId = idOf(session.customer);
        const subscriptionId = idOf(session.subscription);

        if (userId && tier && subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const { priceId, status, currentPeriodStart, currentPeriodEnd } = readSub(sub);

          await prisma.user.update({
            where: { id: userId },
            data: { tier: tier as any, stripeCustomerId: customerId ?? undefined },
          });

          await prisma.subscription.upsert({
            where: { stripeSubId: subscriptionId },
            create: {
              userId,
              stripePriceId: priceId ?? "",
              stripeSessionId: session.id,
              stripeSubId: subscriptionId,
              tier: tier as any,
              status,
              currentPeriodStart,
              currentPeriodEnd,
            },
            update: {
              status,
              stripePriceId: priceId ?? "",
              stripeSessionId: session.id,
              currentPeriodStart,
              currentPeriodEnd,
            },
          });
        } else if (userId && tier && session.mode === "payment") {
          // One-time lifetime purchase → grant PRO permanently. There's no Stripe
          // subscription, so no subscription.*/invoice.* event ever downgrades it.
          // Recorded as a row with status "lifetime" and no period end; keyed by
          // the payment intent so resent events stay idempotent.
          const purchaseId = idOf(session.payment_intent) ?? (session.id as string);
          await prisma.user.update({
            where: { id: userId },
            data: { tier: tier as any, stripeCustomerId: customerId ?? undefined },
          });
          await prisma.subscription.upsert({
            where: { stripeSubId: purchaseId },
            create: {
              userId,
              stripePriceId: PRICE_IDS.LIFETIME || "",
              stripeSessionId: session.id,
              stripeSubId: purchaseId,
              tier: tier as any,
              status: "lifetime",
              currentPeriodStart: new Date(),
              currentPeriodEnd: null,
            },
            update: { status: "lifetime", stripeSessionId: session.id },
          });
        }
        break;
      }

      // Subscription changed/cancelled → keep the row + the user's tier in sync.
      // Self-healing: if the checkout row was never written, we recreate it here
      // (resolving the user from the existing row, the Stripe customer, or the
      // subscription metadata) so a cancel always downgrades correctly.
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const { priceId, status, currentPeriodStart, currentPeriodEnd } = readSub(sub);
        const tier = tierForPrice(priceId);
        const customerId = idOf(sub.customer);

        const existingSub = await prisma.subscription.findUnique({
          where: { stripeSubId: sub.id },
        });
        let userId: string | null = existingSub?.userId ?? null;
        if (!userId && customerId) {
          const u = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
          userId = u?.id ?? null;
        }
        if (!userId) userId = sub.metadata?.userId ?? null;
        if (!userId) break;

        await prisma.subscription.upsert({
          where: { stripeSubId: sub.id },
          create: {
            userId,
            stripePriceId: priceId ?? "",
            stripeSubId: sub.id,
            tier: (tier ?? existingSub?.tier ?? "FREE") as any,
            status,
            currentPeriodStart,
            currentPeriodEnd,
          },
          update: {
            status,
            currentPeriodStart,
            currentPeriodEnd,
            ...(tier ? { tier: tier as any } : {}),
          },
        });

        const isLive =
          event.type !== "customer.subscription.deleted" &&
          (status === "active" || status === "trialing");
        if (isLive && tier) {
          await prisma.user.update({ where: { id: userId }, data: { tier: tier as any } });
        } else if (
          event.type === "customer.subscription.deleted" ||
          ["canceled", "unpaid", "incomplete_expired"].includes(status)
        ) {
          await prisma.user.update({ where: { id: userId }, data: { tier: "FREE" } });
        }
        break;
      }

      // A renewal payment failed → revoke access until it's resolved.
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const subId = idOf(invoice.subscription);
        if (subId) {
          const sub = await prisma.subscription.findUnique({ where: { stripeSubId: subId } });
          if (sub) {
            await prisma.user.update({ where: { id: sub.userId }, data: { tier: "FREE" } });
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: "past_due" },
            });
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (e) {
    console.error("Webhook error:", e);
    return error("Webhook handler error", 500);
  }
}
