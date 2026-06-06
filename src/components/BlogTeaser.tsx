"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import ParallaxIndex from "./ParallaxIndex";

// Surfaces the latest content on the homepage — content is the top of the
// funnel (read -> subscribe -> consult), so it shouldn't be buried at /blog.
// Pulls from the same /api/contents the blog uses, drops "projects" (they have
// the Work section), and links into the article.
interface Item {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  createdAt: string;
}

export default function BlogTeaser() {
  const { t, lang } = useLang();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const url = new URL("/api/contents", window.location.origin);
    url.searchParams.set("lang", lang);
    fetch(url.toString())
      .then((r) => r.json())
      .then((json) => {
        if (!json?.success) return;
        const list = (json.data as Item[])
          .filter((i) => i.category === "blog")
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
          .slice(0, 3);
        setItems(list);
      })
      .catch(() => {});
  }, [lang]);

  return (
    <section
      id="blog"
      className="section section-indexed"
      aria-label={t("home.journal.title")}
      style={{ position: "relative" }}
    >
      <ParallaxIndex>07</ParallaxIndex>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="section-head__num">{t("home.journal.tag")}</span>
        <h2 className="section-head__title" style={{ fontSize: "clamp(28px, 5vw, 64px)" }}>
          {t("home.journal.title")}
        </h2>
        <span className="label" style={{ alignSelf: "end", textAlign: "right" }}>
          {t("home.journal.meta")}
        </span>
      </div>

      {items.length === 0 ? (
        <p style={{ color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          {t("home.journal.empty")}
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/blog/${item.slug}`}
              className="neo-card"
              style={{
                textDecoration: "none",
                color: "var(--ink-body)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 210,
              }}
            >
              <span
                style={{
                  alignSelf: "flex-start",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--accent-green-deep)",
                }}
              >
                {item.category}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: 21,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.18,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  flex: 1,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "var(--ink-body)",
                  opacity: 0.78,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.description}
              </p>
              <span
                className="arrow-blink"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--accent-green-deep)",
                }}
              >
                {t("home.journal.read")} →
              </span>
            </Link>
          ))}
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <Link
          href="/blog"
          className="neo-btn"
          style={{
            display: "inline-block",
            padding: "11px 20px",
            background: "var(--accent-green)",
            color: "#fff",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            letterSpacing: 0.3,
            textDecoration: "none",
          }}
        >
          {t("home.journal.cta")} →
        </Link>
      </div>
    </section>
  );
}
