"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useLang } from "@/components/LangProvider";
import ComponentCode from "@/components/ComponentCode";

interface ComponentMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  kind: "pen" | "prompt";
}

export default function ComponentDetailPage() {
  const { t } = useLang();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [meta, setMeta] = useState<ComponentMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch("/api/componenti")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setMeta((json.data as ComponentMeta[]).find((c) => c.slug === slug) ?? null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Nav />
      <main
        className="container"
        style={{ paddingTop: "calc(var(--topbar-h) + 48px)", paddingBottom: 96, maxWidth: 1040 }}
      >
        <Link
          href="/componenti"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 28,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            textDecoration: "none",
            color: "var(--ink-muted)",
          }}
        >
          <span className="btn-arrow" aria-hidden="true" style={{ marginLeft: 0 }}>←</span> {t("components.back")}
        </Link>

        {loading ? (
          <div style={{ padding: 80, textAlign: "center", color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {t("components.loading")}
          </div>
        ) : !meta ? (
          <div style={{ padding: 80, textAlign: "center", color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {t("components.notfound")}
          </div>
        ) : (
          <>
            <header style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4.4vw, 52px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 10px" }}>
                {meta.title}
              </h1>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {meta.kind === "prompt" && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                      border: "2px solid var(--ink-border)",
                      background: "var(--accent-green)",
                      color: "var(--btn-ink)",
                    }}
                  >
                    {t("components.promptBadge")}
                  </span>
                )}
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                      border: "2px solid var(--ink-border)",
                      background: "var(--canvas-page)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {meta.description && (
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--ink-muted)", maxWidth: 640 }}>
                  {meta.description}
                </p>
              )}
            </header>

            {/* Big, interactive single preview */}
            <div className="neo-card" style={{ padding: 0, overflow: "hidden", marginBottom: 18 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  borderBottom: "3px solid var(--ink-border)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-muted)",
                }}
              >
                <span style={{ display: "inline-flex", gap: 5 }}>
                  <i style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent-decor-green)", border: "1.5px solid var(--ink-border)" }} />
                  <i style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent-peach)", border: "1.5px solid var(--ink-border)" }} />
                  <i style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent-green)", border: "1.5px solid var(--ink-border)" }} />
                </span>
                <span style={{ marginLeft: 6 }}>{t("components.preview")} · {meta.slug}</span>
                <a
                  href={`/api/componenti/${meta.slug}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: "auto", color: "var(--accent-green-deep)", fontWeight: 700, textDecoration: "none" }}
                >
                  {t("components.fullscreen")} ↗
                </a>
              </div>
              <iframe
                src={`/api/componenti/${meta.slug}/preview`}
                title={meta.title}
                sandbox="allow-scripts allow-pointer-lock"
                style={{ width: "100%", height: 560, border: 0, display: "block", background: "#fff" }}
              />
            </div>

            <ComponentCode slug={meta.slug} kind={meta.kind} />
          </>
        )}
      </main>
    </>
  );
}
