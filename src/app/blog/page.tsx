"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useLang } from "@/components/LangProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TierBadge } from "@/components/auth/TierBadge";
import { levelForContent, LEVELS, LEVEL_ORDER } from "@/lib/content-levels";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tier: string;
  imageUrl: string | null;
  createdAt: string;
  locked: boolean;
}

export default function BlogPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const { user } = useAuth();
  const { lang } = useLang();

  useEffect(() => {
    const url = new URL("/api/contents", window.location.origin);
    if (category) url.searchParams.set("category", category);
    url.searchParams.set("lang", lang);
    fetch(url.toString())
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setContents(json.data);
      })
      .finally(() => setLoading(false));
  }, [category, lang]);

  const categories = [
    { value: "", label: "Tutti" },
    { value: "blog", label: "Articoli" },
    { value: "guide", label: "Guide" },
    { value: "prompts", label: "Prompt" },
    { value: "tutorials", label: "Tutorial" },
    { value: "projects", label: "Progetti" },
  ];

  return (
    <main
      style={{
        padding: "100px 20px 80px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: 32,
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          color: "var(--ink-body)",
        }}
      >
        &larr; Home
      </Link>

      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 8 }}>
          Blog & Contenuti
        </h1>
        <p style={{ fontSize: 15, color: "var(--ink-muted)", maxWidth: 500 }}>
          Articoli, prompt, tutorial e progetti.{" "}
          <Link
            href="/membership"
            style={{ fontWeight: 600, textDecoration: "underline" }}
          >
            Abbonati
          </Link>{" "}
          per sbloccare tutto.
        </p>

        {/* Level legend — sets honest expectations about who each piece is for. */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginTop: 20,
            padding: "14px 16px",
            border: "2px solid var(--ink-border)",
            borderRadius: "var(--radius)",
            background: "var(--canvas-panel-yellow)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              color: "var(--ink-muted)",
              alignSelf: "center",
            }}
          >
            Livelli
          </span>
          {LEVEL_ORDER.map((k) => (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  padding: "2px 8px",
                  borderRadius: "var(--radius-sm)",
                  border: "2px solid var(--ink-border)",
                  background: LEVELS[k].bg,
                  color: LEVELS[k].fg,
                }}
              >
                {LEVELS[k].label}
              </span>
              <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{LEVELS[k].blurb}</span>
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className="neo-btn neo-btn-sm"
            style={{
              cursor: "pointer",
              background: category === c.value ? "var(--accent-peach)" : "var(--canvas-page)",
              color: "var(--ink-body)",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: "var(--ink-muted)", fontWeight: 600 }}>
          Caricamento...
        </div>
      ) : contents.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "var(--ink-muted)", fontWeight: 600 }}>
          Nessun contenuto ancora.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: 28,
          }}
        >
          {contents.map((item) => {
            const isLocked =
              item.locked ||
              (item.tier !== "FREE" && user?.tier !== item.tier && user?.tier !== "PRO");
            const lvl = levelForContent(item.slug, item.category);

            return (
              <div
                key={item.id}
                style={{ position: "relative", opacity: isLocked ? 0.55 : 1 }}
              >
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
                    padding: 28,
                  }}
                >
                  {isLocked && (
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 14,
                        fontSize: 20,
                        opacity: 0.7,
                      }}
                    >
                      🔒
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
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
                      {item.category}
                    </span>
                    <TierBadge tier={item.tier} />
                    {lvl && (
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 10px",
                          borderRadius: "var(--radius)",
                          border: "2px solid var(--ink-border)",
                          background: LEVELS[lvl].bg,
                          color: LEVELS[lvl].fg,
                          textTransform: "uppercase",
                          fontWeight: 700,
                          letterSpacing: 0.4,
                        }}
                      >
                        {LEVELS[lvl].label}
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--ink-muted)",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </p>

                  {!isLocked ? (
                    <Link
                      href={`/blog/${item.slug}`}
                      style={{
                        display: "inline-block",
                        marginTop: 16,
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "underline",
                        color: "var(--ink-body)",
                      }}
                    >
                      Leggi &rarr;
                    </Link>
                  ) : (
                    <Link
                      href="/membership"
                      style={{
                        display: "inline-block",
                        marginTop: 16,
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "underline",
                        color: "var(--ink-body)",
                      }}
                    >
                      Sblocca &rarr;
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
