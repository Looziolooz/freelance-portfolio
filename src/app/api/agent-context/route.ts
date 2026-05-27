import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api-response";
import type { Lang } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = (searchParams.get("lang") || "IT").toUpperCase();
    const lang = (["IT", "EN", "SV"].includes(raw) ? raw : "IT") as Lang;

    const contents = await prisma.content.findMany({
      where: { published: true, lang },
      orderBy: { createdAt: "desc" },
      select: {
        title: true,
        slug: true,
        description: true,
        body: true,
        category: true,
        tier: true,
      },
    });

    const projects = contents.filter((c) => c.category === "projects");
    const articles = contents.filter((c) => c.category !== "projects");

    return success({
      lang,
      projects: projects.map((p) => ({
        title: p.title,
        description: p.description,
        tier: p.tier,
      })),
      blogPosts: articles.map((a) => ({
        title: a.title,
        description: a.description,
        category: a.category,
        tier: a.tier,
      })),
    });
  } catch (e) {
    console.error("Agent context error:", e);
    return error("Internal server error", 500);
  }
}
