import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { error } from "@/lib/api-response";

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
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;
        const subscriptionId = session.subscription;
        const customerId = session.customer;

        if (userId && tier) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              tier: tier as any,
              stripeCustomerId: customerId,
            },
          });

          await prisma.subscription.create({
            data: {
              userId,
              stripePriceId: session.mode === "subscription"
                ? (session as any).line_items?.data?.[0]?.price?.id ?? ""
                : "",
              stripeSessionId: session.id,
              stripeSubId: subscriptionId,
              tier: tier as any,
              status: "active",
              currentPeriodStart: new Date(
                (session as any).current_period_start * 1000
              ),
              currentPeriodEnd: new Date(
                (session as any).current_period_end * 1000
              ),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const subId = subscription.id;
        const status = subscription.status;
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const tier =
          priceId === process.env.STRIPE_SUPPORTER_PRICE_ID
            ? "SUPPORTER"
            : priceId === process.env.STRIPE_PRO_PRICE_ID
            ? "PRO"
            : null;

        const existingSub = await prisma.subscription.findUnique({
          where: { stripeSubId: subId },
        });

        if (existingSub) {
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: {
              status,
              currentPeriodStart: subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000)
                : undefined,
              currentPeriodEnd: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : undefined,
            },
          });

          if (status === "active" && tier && existingSub.tier !== tier) {
            await prisma.user.update({
              where: { id: existingSub.userId },
              data: { tier: tier as any },
            });
          }

          if (status === "canceled" || status === "unpaid" || status === "incomplete_expired") {
            await prisma.user.update({
              where: { id: existingSub.userId },
              data: { tier: "FREE" },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const subId = invoice.subscription;
        if (subId) {
          const sub = await prisma.subscription.findUnique({
            where: { stripeSubId: subId as string },
          });
          if (sub) {
            await prisma.user.update({
              where: { id: sub.userId },
              data: { tier: "FREE" },
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
