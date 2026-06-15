import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, canAccess } from "@/lib/auth";
import { isPreviewUnlockAll } from "@/lib/preview";
import { success, error } from "@/lib/api-response";
import type { Lang } from "@/generated/prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    const userTier = session?.tier ?? "FREE";

    const { searchParams } = new URL(req.url);
    const raw = (searchParams.get("lang") || "IT").toUpperCase();
    const lang = (["IT", "EN", "SV"].includes(raw) ? raw : "IT") as Lang;

    const content = await prisma.content.findFirst({
      where: { slug: id, lang, published: true },
    });

    if (!content) {
      return error("Content not found", 404);
    }

    // Dev preview bypasses the paywall so gated guides are reviewable locally.
    if (!isPreviewUnlockAll() && !canAccess(userTier, content.tier)) {
      return error(
        `This content requires ${content.tier.toLowerCase()} tier or higher`,
        403
      );
    }

    return success(content);
  } catch (e) {
    console.error("Content detail error:", e);
    return error("Internal server error", 500);
  }
}
