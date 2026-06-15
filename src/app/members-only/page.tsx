"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useLang } from "@/components/LangProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TierBadge } from "@/components/auth/TierBadge";

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

export default function MembersOnlyPage() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

  if (authLoading) return null;

  const categories = [
    { value: "", label: "Tutti" },
    { value: "blog", label: "Blog" },
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
          Area Membri
        </h1>
        {user ? (
          <p style={{ fontSize: 15, color: "var(--ink-muted)" }}>
            Benvenuto{user.name ? `, ${user.name}` : ""} —{" "}
            <TierBadge tier={user.tier} />{" "}
            <Link
              href="/account"
              style={{ fontWeight: 600, textDecoration: "underline", marginLeft: 8 }}
            >
              Gestisci account
            </Link>
          </p>
        ) : (
          <p style={{ fontSize: 15, color: "var(--ink-muted)" }}>
            <Link
              href="/login"
              style={{ fontWeight: 600, textDecoration: "underline" }}
            >
              Accedi
            </Link>{" "}
            o{" "}
            <Link
              href="/membership"
              style={{ fontWeight: 600, textDecoration: "underline" }}
            >
              abbonati
            </Link>{" "}
            per accedere a tutti i contenuti.
          </p>
        )}
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
          Nessun contenuto in questa categoria.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: 28,
          }}
        >
          {contents.map((item) => (
            <ContentCard key={item.id} item={item} user={user} />
          ))}
        </div>
      )}
    </main>
  );
}

function ContentCard({
  item,
  user,
}: {
  item: ContentItem;
  user: { tier: string } | null;
}) {
  const isLocked = item.locked;

  const cardContent = (
    <div style={{ position: "relative", opacity: isLocked ? 0.55 : 1 }}>
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
          overflow: "hidden",
        }}
      >
        {isLocked && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 14,
              fontSize: 18,
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
        </div>

        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
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
      </div>
    </div>
  );

  if (isLocked) {
    return <div>{cardContent}</div>;
  }

  return (
    <Link
      href={`/blog/${item.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {cardContent}
    </Link>
  );
}
