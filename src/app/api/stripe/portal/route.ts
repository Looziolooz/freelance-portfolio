import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createBillingPortalSession } from "@/lib/stripe";
import { success, error } from "@/lib/api-response";

// Opens the hosted Stripe Customer Portal for the logged-in subscriber so they
// can update their card, switch plan, or cancel. Card data never touches us.
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return error("User not found", 404);
    if (!user.stripeCustomerId) {
      return error("Nessun abbonamento da gestire", 400);
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const portal = await createBillingPortalSession(user.stripeCustomerId, `${origin}/account`);
    return success({ url: portal.url });
  } catch (e) {
    console.error("Portal error:", e);
    return error("Internal server error", 500);
  }
}
