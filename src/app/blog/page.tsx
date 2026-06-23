"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useLang } from "@/components/LangProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { TierBadge } from "@/components/auth/TierBadge";
import { Reveal } from "@/components/Reveal";
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
  const { t, lang } = useLang();

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
    { value: "", label: t("blog.cat.all") },
    { value: "blog", label: t("blog.cat.blog") },
    { value: "guide", label: t("blog.cat.guide") },
    { value: "prompts", label: t("blog.cat.prompts") },
    { value: "tutorials", label: t("blog.cat.tutorials") },
    { value: "projects", label: t("blog.cat.projects") },
  ];

  return (
    <>
      <Nav />
      <main
        className="container"
        style={{
          paddingTop: "calc(var(--topbar-h) + 48px)",
          paddingBottom: 96,
          maxWidth: 1120,
        }}
      >
        <Link
          href="/"
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
          <span className="btn-arrow" aria-hidden="true" style={{ marginLeft: 0 }}>←</span> Home
        </Link>

        <div style={{ marginBottom: 40 }}>
          <span
            className="cap-pill cap-pill--solid"
            style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}
          >
            <span className="cap-pill__dot" />
            Blog
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(38px, 5.4vw, 68px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.03,
              margin: "18px 0 12px",
            }}
          >
            {t("blog.title")}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink-muted)", maxWidth: 540 }}>
            {t("blog.intro.lead")}{" "}
            <Link href="/membership" style={{ fontWeight: 600, color: "var(--accent-green-deep)" }}>
              {t("blog.intro.subscribe")}
            </Link>{" "}
            {t("blog.intro.tail")}
          </p>

          {/* Level legend — sets honest expectations about who each piece is for. */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              marginTop: 22,
              padding: "14px 18px",
              border: "3px solid var(--ink-border)",
              borderRadius: "var(--radius-lg)",
              background: "var(--canvas-panel-yellow)",
              boxShadow: "var(--shadow-card)",
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
              {t("blog.levels.legend")}
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
                  {LEVELS[k].label[lang]}
                </span>
                <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{LEVELS[k].blurb[lang]}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 34, flexWrap: "wrap" }}>
          {categories.map((c) => {
            const active = category === c.value;
            return (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`neo-btn neo-btn-sm${active ? " neo-btn--primary" : ""}`}
                style={{
                  cursor: "pointer",
                  background: active ? undefined : "var(--canvas-panel-grey)",
                  color: active ? undefined : "var(--ink-body)",
                  boxShadow: active ? "4px 4px 0 var(--ink-shadow)" : "3px 3px 0 var(--ink-shadow)",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {t("blog.loading")}
          </div>
        ) : contents.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {t("blog.empty")}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
              gap: 28,
            }}
          >
            {contents.map((item, i) => {
              const isLocked =
                item.locked ||
                (item.tier !== "FREE" && user?.tier !== item.tier && user?.tier !== "PRO");
              const lvl = levelForContent(item.slug, item.category);

              return (
                <Reveal key={item.id} delay={(i % 3) * 0.05} style={{ display: "flex" }}>
                  <div
                    className="neo-card neo-card--shine accent-rail"
                    style={{
                      position: "relative",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      opacity: isLocked ? 0.62 : 1,
                    }}
                  >
                    {isLocked && (
                      <div style={{ position: "absolute", top: 14, right: 16, fontSize: 18, opacity: 0.75, zIndex: 5 }}>
                        🔒
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          padding: "2px 9px",
                          borderRadius: "var(--radius-sm)",
                          border: "2px solid var(--ink-border)",
                          background: "var(--canvas-page)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          letterSpacing: 0.4,
                        }}
                      >
                        {item.category}
                      </span>
                      <TierBadge tier={item.tier} />
                      {lvl && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 9px",
                            borderRadius: "var(--radius-sm)",
                            border: "2px solid var(--ink-border)",
                            background: LEVELS[lvl].bg,
                            color: LEVELS[lvl].fg,
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: 0.4,
                          }}
                        >
                          {LEVELS[lvl].label[lang]}
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 21,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        margin: "0 0 8px",
                        lineHeight: 1.22,
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: 13.5,
                        color: "var(--ink-muted)",
                        lineHeight: 1.55,
                        margin: 0,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </p>

                    <Link
                      href={isLocked ? "/membership" : `/blog/${item.slug}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginTop: 18,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12.5,
                        fontWeight: 700,
                        letterSpacing: 0.3,
                        textTransform: "uppercase",
                        textDecoration: "none",
                        color: "var(--accent-green-deep)",
                      }}
                    >
                      {isLocked ? t("blog.card.unlock") : t("blog.card.read")}
                      <span className="btn-arrow" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
