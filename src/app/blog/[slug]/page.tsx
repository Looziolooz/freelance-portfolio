"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useLang } from "@/components/LangProvider";
import { useEffect, useState, use, type ReactNode } from "react";
import Link from "next/link";
import { TierBadge } from "@/components/auth/TierBadge";
import { ProtectedContent } from "@/components/auth/ProtectedContent";
import { levelForContent, LEVELS, programmingForContent, PROG } from "@/lib/content-levels";
import { isPreviewUnlockAll } from "@/lib/preview";

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

// Block-level renderer for the article body. Tracks fenced code blocks (```)
// so code is emitted into a .neo-code-box instead of being dropped, and wraps
// consecutive "- " items in a single <ul>.
// Inline markdown: **bold**, *italic*, [text](url), `code`. Recurses so a bold
// link (**[x](/y)**) renders correctly. Used for paragraphs, list items, headings.
function renderInline(text: string, keyBase = 0): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  let last = 0;
  let k = keyBase;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(
        <a
          key={k++}
          href={m[2]}
          style={{ color: "var(--accent-green-deep)", fontWeight: 600, textDecoration: "underline" }}
        >
          {m[1]}
        </a>
      );
    } else if (m[3] !== undefined) {
      nodes.push(<strong key={k++}>{renderInline(m[3], k * 100)}</strong>);
    } else if (m[4] !== undefined) {
      nodes.push(<em key={k++}>{renderInline(m[4], k * 100)}</em>);
    } else if (m[5] !== undefined) {
      nodes.push(
        <code
          key={k++}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.9em",
            background: "var(--canvas-panel-yellow)",
            padding: "1px 5px",
            borderRadius: 4,
          }}
        >
          {m[5]}
        </code>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderArticleBody(body: string): ReactNode[] {
  const lines = body.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trimStart().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip the closing fence
      blocks.push(
        <pre
          key={key++}
          className="neo-code-box"
          style={{ overflowX: "auto", margin: "20px 0", whiteSpace: "pre" }}
        >
          <code>{code.join("\n")}</code>
        </pre>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} style={{ margin: "0 0 12px", paddingLeft: 22 }}>
          {items.map((it, j) => (
            <li key={j} style={{ marginBottom: 4, fontSize: 15 }}>
              {renderInline(it)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} style={{ fontSize: 18, fontWeight: 600, marginTop: 28, marginBottom: 8 }}>
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // The body repeats the H1 title, which is already shown in the header card.
    // Skip it instead of printing a literal "# ..." line. (Checked after ##/###,
    // which never match "# " — a single hash + space.)
    if (line.startsWith("# ")) {
      i++;
      continue;
    }

    if (line.trim() === "") {
      blocks.push(<div key={key++} style={{ height: 12 }} />);
      i++;
      continue;
    }

    // Explanatory image: a line that is just ![alt](src). Rendered as an
    // on-brand figure (ink border + hard offset shadow); alt becomes the caption.
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (img) {
      blocks.push(
        <figure key={key++} style={{ margin: "24px 0", textAlign: "center" }}>
          <img
            src={img[2]}
            alt={img[1]}
            loading="lazy"
            style={{
              maxWidth: "100%",
              height: "auto",
              border: "3px solid var(--ink-border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "6px 6px 0 var(--ink-shadow)",
              background: "var(--canvas-page)",
            }}
          />
          {img[1] ? (
            <figcaption
              style={{ marginTop: 10, fontSize: 13, color: "var(--ink-muted)", fontStyle: "italic" }}
            >
              {img[1]}
            </figcaption>
          ) : null}
        </figure>
      );
      i++;
      continue;
    }

    blocks.push(
      <p key={key++} style={{ marginBottom: 12 }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return blocks;
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
  const userCanView =
    content.tier === "FREE" ||
    (content.tier === "SUPPORTER" &&
      (userTier === "SUPPORTER" || userTier === "PRO")) ||
    (content.tier === "PRO" && userTier === "PRO");
  const preview = isPreviewUnlockAll();
  const canView = userCanView || preview;
  const previewUnlocked = preview && !userCanView;

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
        {previewUnlocked ? (
          <span
            title="Sbloccato dalla modalità anteprima per sviluppo. In produzione è riservato ai membri."
            style={{
              fontSize: 11,
              padding: "2px 10px",
              borderRadius: "var(--radius)",
              border: "2px dashed var(--ink-border)",
              background: "var(--canvas-page)",
              color: "var(--ink-body)",
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            Anteprima dev
          </span>
        ) : null}
        {(() => {
          const lvl = levelForContent(content.slug, content.category);
          return lvl ? (
            <span
              title={LEVELS[lvl].blurb[lang]}
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
              {LEVELS[lvl].label[lang]}
            </span>
          ) : null;
        })()}
        {(() => {
          const prog = programmingForContent(content.slug);
          return prog ? (
            <span
              title={PROG[prog].blurb[lang]}
              style={{
                fontSize: 11,
                padding: "2px 10px",
                borderRadius: "var(--radius)",
                border: "2px solid var(--ink-border)",
                background: PROG[prog].bg,
                color: PROG[prog].fg,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: 0.4,
              }}
            >
              {PROG[prog].label[lang]}
            </span>
          ) : null;
        })()}
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
            {renderArticleBody(content.body)}
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
