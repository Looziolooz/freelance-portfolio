"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useLang } from "@/components/LangProvider";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { TierBadge } from "@/components/auth/TierBadge";
import { ProtectedContent } from "@/components/auth/ProtectedContent";

interface ContentDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  category: string;
  tier: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
}

export default function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user } = useAuth();
  const { lang } = useLang();
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/contents/${slug}?lang=${lang}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setContent(json.data);
        else setError(json.error || "Contenuto non trovato");
      })
      .catch(() => setError("Errore di caricamento"))
      .finally(() => setLoading(false));
  }, [slug, lang]);

  if (loading) {
    return (
      <main
        style={{
          padding: "100px 20px",
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
          color: "var(--ink-muted)",
          fontWeight: 600,
        }}
      >
        Caricamento...
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          padding: "100px 20px",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <Link
          href="/blog"
          style={{
            display: "inline-block",
            marginBottom: 32,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            color: "var(--ink-body)",
          }}
        >
          &larr; Blog
        </Link>
        <div style={{ textAlign: "center", padding: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.7 }}>🔒</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Contenuto Bloccato
          </h2>
          <p style={{ fontSize: 14, color: "var(--ink-muted)", marginBottom: 24 }}>{error}</p>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ position: "absolute", inset: 0, background: "var(--ink-shadow)", borderRadius: "var(--radius)", transform: "translate(4px, 4px)" }} />
            <Link
              href="/membership"
              className="neo-btn"
              style={{
                position: "relative",
                zIndex: 2,
                display: "inline-block",
                padding: "12px 28px",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                color: "var(--ink-body)",
              }}
            >
              Vedi Piani
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!content) return null;

  const userTier = user?.tier ?? "FREE";
  const canView =
    content.tier === "FREE" ||
    (content.tier === "SUPPORTER" &&
      (userTier === "SUPPORTER" || userTier === "PRO")) ||
    (content.tier === "PRO" && userTier === "PRO");

  return (
    <main
      style={{
        padding: "100px 20px 80px",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <Link
        href="/blog"
        style={{
          display: "inline-block",
          marginBottom: 32,
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          color: "var(--ink-body)",
        }}
      >
        &larr; Blog
      </Link>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 11,
            padding: "2px 10px",
            borderRadius: "var(--radius)",
            border: "2px solid var(--ink-border)",
            background: "var(--canvas-page)",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {content.category}
        </span>
        <TierBadge tier={content.tier} />
      </div>

      <div style={{ position: "relative", marginBottom: 40 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--ink-shadow)",
            borderRadius: "var(--radius-lg)",
            transform: "translate(8px, 8px)",
          }}
        />
        <div
          className="neo-panel-cream"
          style={{
            position: "relative",
            zIndex: 2,
            border: "3px solid var(--ink-border)",
            borderRadius: "var(--radius-lg)",
            padding: "32px 28px",
          }}
        >
          <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>
            {content.title}
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.6, margin: 0 }}>
            {content.description}
          </p>
        </div>
      </div>

      {canView ? (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--ink-shadow)",
              borderRadius: "var(--radius-lg)",
              transform: "translate(8px, 8px)",
            }}
          />
          <div
            className="neo-panel-white"
            style={{
              position: "relative",
              zIndex: 2,
              border: "3px solid var(--ink-border)",
              borderRadius: "var(--radius-lg)",
              padding: "32px 28px",
              fontSize: 15,
              lineHeight: 1.8,
              maxWidth: "none",
            }}
          >
            {content.body.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} style={{ fontSize: 18, fontWeight: 600, marginTop: 28, marginBottom: 8 }}>
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("```")) {
                const lang2 = line.replace("```", "").trim();
                if (!lang2) return <div key={i} />;
                return <div key={i} />;
              }
              if (line.startsWith("- ")) {
                return (
                  <li
                    key={i}
                    style={{
                      marginLeft: 20,
                      marginBottom: 4,
                      fontSize: 15,
                    }}
                  >
                    {line.replace("- ", "")}
                  </li>
                );
              }
              const codeMatch = line.match(/^`{3}(\w+)?$/);
              if (codeMatch) return <div key={i} />;

              if (line.trim() === "") return <div key={i} style={{ height: 12 }} />;

              return (
                <p key={i} style={{ marginBottom: 12 }}>
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      ) : (
        <ProtectedContent tier={content.tier}>
          <div />
        </ProtectedContent>
      )}
    </main>
  );
}
