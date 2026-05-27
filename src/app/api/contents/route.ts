import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, canAccess } from "@/lib/auth";
import { success, error } from "@/lib/api-response";
import type { Lang } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const userTier = session?.tier ?? "FREE";

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const raw = (searchParams.get("lang") || "IT").toUpperCase();
    const lang = (["IT", "EN", "SV"].includes(raw) ? raw : "IT") as Lang;

    const where: Record<string, unknown> = { published: true, lang };
    if (category) where.category = category;

    const contents = await prisma.content.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        tier: true,
        lang: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    const accessible = contents.map((c: { id: string; title: string; slug: string; description: string; category: string; tier: string; lang: string; imageUrl: string | null; createdAt: Date }) => ({
      ...c,
      locked: !canAccess(userTier, c.tier),
    }));

    return success(accessible);
  } catch (e) {
    console.error("Contents error:", e);
    return error("Internal server error", 500);
  }
}
