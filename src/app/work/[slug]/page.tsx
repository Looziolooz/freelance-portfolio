"use client";

import { use } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { getProject } from "@/lib/projects";

// In-site project viewer. Live demos are embedded in an iframe so the visitor
// stays on the portfolio instead of being sent to the external deploy. The
// "open in a new tab" control is always present as the fallback for sites that
// block framing (X-Frame-Options). Repo-only projects show the cover + code link.
export default function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLang();
  const project = getProject(slug);

  const pagePad: React.CSSProperties = {
    paddingTop: "calc(var(--topbar-h) + var(--space-10))",
    paddingBottom: "var(--space-16)",
  };

  const back = (
    <Link
      href="/#work"
      className="label"
      style={{ display: "inline-block", marginBottom: 24, textDecoration: "none" }}
    >
      ← {t("work.back")}
    </Link>
  );

  if (!project) {
    return (
      <main className="container" style={pagePad}>
        {back}
        <p style={{ fontSize: "var(--fs-lg)", color: "var(--ink-muted)" }}>{t("work.notfound")}</p>
      </main>
    );
  }

  const title = t(`work.proj.${project.key}`);
  const tags = t(`work.proj.${project.key}.tags`);
  const blurb = t(`work.proj.${project.key}.blurb`);

  return (
    <main className="container" style={pagePad}>
      {back}

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
          borderBottom: "3px solid var(--ink-border)",
          paddingBottom: 18,
          margin: "8px 0 28px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              letterSpacing: "var(--tracking-tight)",
              lineHeight: 1,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-xs)",
              color: "var(--ink-muted)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginTop: 10,
            }}
          >
            {tags}
          </p>
        </div>
      </header>

      <p style={{ fontSize: "var(--fs-lg)", lineHeight: "var(--lh-loose)", maxWidth: 680, marginBottom: 28 }}>
        {blurb}
      </p>

      {project.demo ? (
        <>
          <p className="label" style={{ marginBottom: 12 }}>
            {t("work.demohint")}
          </p>
          <div className="offset block offset--panel" style={{ display: "block", width: "100%" }}>
            <div className="offset__layer" />
            <div className="offset__fg" style={{ overflow: "hidden" }}>
              <iframe
                src={project.demo}
                title={title}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                style={{ display: "block", width: "100%", height: "74vh", border: 0, background: "#fff" }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="offset block offset--panel" style={{ display: "block", width: "100%", maxWidth: 920 }}>
          <div className="offset__layer" />
          <div className="offset__fg neo-panel-cream" style={{ overflow: "hidden" }}>
            {project.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={title}
                style={{ display: "block", width: "100%", aspectRatio: "16/10", objectFit: "cover" }}
              />
            )}
            <p style={{ margin: 0, padding: "20px 24px", color: "var(--ink-muted)", fontSize: "var(--fs-sm)" }}>
              {t("work.codeonly")}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
