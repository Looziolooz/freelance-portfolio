import { getComponentSource } from "@/lib/codepen-catalog";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api-response";

// Gated code — the clean, copy-paste HTML/CSS/JS. Only Pro (€20/mo) members get
// it. Tier is read live from the DB (the JWT cookie can be stale after a Stripe
// upgrade), so a fresh subscription unlocks without re-login.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const src = await getComponentSource(slug);
  if (!src) return error("Not found", 404);

  const session = await getSession();
  if (!session) return error("Login required", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { tier: true },
  });
  if (user?.tier !== "PRO") return error("Pro membership required", 403);

  return success({ html: src.html, css: src.css, js: src.js });
}
