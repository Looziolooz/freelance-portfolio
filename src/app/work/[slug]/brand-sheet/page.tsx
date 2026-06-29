"use client";

import { use } from "react";
import Link from "next/link";
import BrandSheet from "@/components/BrandSheet";
import { getBrandKit } from "@/lib/brand-kits";
import { getProject } from "@/lib/projects";
import { useLang } from "@/components/LangProvider";

// Printable brand sheet for a project. Clean page (no site nav) with a sticky
// toolbar that triggers the browser print → Save as PDF. @page/@media print live
// in BrandSheet. The toolbar is hidden when printing.
export default function BrandSheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLang();
  const kit = getBrandKit(slug);
  const project = getProject(slug);

  if (!kit || !project || project.hidden) {
    return (
      <main className="container" style={{ paddingTop: "clamp(48px, 8vw, 96px)", paddingBottom: 96 }}>
        <Link href={`/work/${slug}`} className="label" style={{ textDecoration: "none" }}>
          ← {t("brandkit.back")}
        </Link>
        <p style={{ marginTop: 20, fontSize: "var(--fs-lg)", color: "var(--ink-muted)" }}>{t("brandkit.notfound")}</p>
      </main>
    );
  }

  return (
    <>
      <div className="bsheet-bar">
        <Link href={`/work/${slug}`}>← {t("brandkit.back")}</Link>
        <button type="button" onClick={() => window.print()}>
          {t("brandkit.print")} <span aria-hidden="true">↓</span>
        </button>
      </div>
      <main style={{ padding: "clamp(16px, 4vw, 32px) clamp(12px, 4vw, 24px) 64px", background: "var(--canvas-grad)" }}>
        <BrandSheet kit={kit} />
      </main>
    </>
  );
}
