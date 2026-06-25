"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { useAuth } from "./auth/AuthProvider";

const TIER_ORDER: Record<string, number> = { FREE: 0, SUPPORTER: 1, PRO: 2 };
type Lang3 = "html" | "css" | "js";

// The gated viewer for a single item. Pro (€20/mo) members get the real content
// (fetched from the tier-gated API); everyone else gets a blurred teaser + unlock
// CTA. The API enforces the gate server-side too. "prompt" items reveal the AI
// codegen prompt; "pen" items reveal the HTML/CSS/JS tabs.
export default function ComponentCode({
  slug,
  kind = "pen",
}: {
  slug: string;
  kind?: "pen" | "prompt";
}) {
  const { user, loading } = useAuth();
  const isPro = (TIER_ORDER[user?.tier ?? "FREE"] ?? 0) >= TIER_ORDER.PRO;

  if (loading) return null;
  if (kind === "prompt") return isPro ? <PromptPanel slug={slug} /> : <LockedPrompt />;
  return isPro ? <CodePanel slug={slug} /> : <LockedCode />;
}

function CodePanel({ slug }: { slug: string }) {
  const { t } = useLang();
  const [code, setCode] = useState<Record<Lang3, string> | null>(null);
  const [tab, setTab] = useState<Lang3>("html");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/componenti/${slug}/code`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => json?.success && setCode(json.data))
      .catch(() => {});
  }, [slug]);

  if (!code) {
    return (
      <div style={{ padding: 24, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-muted)" }}>
        {t("components.loading")}
      </div>
    );
  }

  const tabs: Lang3[] = ["html", "css", "js"];
  const copy = () => {
    navigator.clipboard?.writeText(code[tab] || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "3px solid var(--ink-border)" }}>
        {tabs.map((l) => (
          <button
            key={l}
            onClick={() => setTab(l)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              padding: "10px 16px",
              border: "none",
              borderRight: "2px solid var(--ink-border)",
              background: tab === l ? "var(--accent-green)" : "transparent",
              color: tab === l ? "var(--btn-ink)" : "var(--ink-muted)",
              cursor: "pointer",
            }}
          >
            {l}
          </button>
        ))}
        <button
          onClick={copy}
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            padding: "10px 16px",
            border: "none",
            background: "transparent",
            color: "var(--accent-green-deep)",
            cursor: "pointer",
          }}
        >
          {copied ? t("components.copied") : t("components.copy")}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: 18,
          maxHeight: 440,
          overflow: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: 12.5,
          lineHeight: 1.6,
          background: "var(--canvas-panel-grey)",
          color: "var(--ink-body)",
          whiteSpace: "pre",
        }}
      >
        <code>{code[tab] || `/* ${tab}: — */`}</code>
      </pre>
    </div>
  );
}

function LockedCode() {
  const { t } = useLang();
  const sample = [
    "const tl = gsap.timeline({",
    "  scrollTrigger: { trigger: '#hero', scrub: 1 },",
    "});",
    "tl.from('.layer', { yPercent: 30, opacity: 0,",
    "  stagger: 0.12, ease: 'power3.out' });",
    "ScrollSmoother.create({ smooth: 1.2, effects: true });",
  ];
  return (
    <div className="neo-card" style={{ position: "relative", padding: 0, overflow: "hidden" }}>
      <pre
        aria-hidden="true"
        style={{
          margin: 0,
          padding: 18,
          fontFamily: "var(--font-mono)",
          fontSize: 12.5,
          lineHeight: 1.6,
          background: "var(--canvas-panel-grey)",
          color: "var(--ink-muted)",
          filter: "blur(5px)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <code>{sample.join("\n")}</code>
      </pre>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 10,
          padding: 24,
          background: "color-mix(in oklch, var(--canvas-page) 60%, transparent)",
        }}
      >
        <div style={{ fontSize: 30 }}>🔒</div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600 }}>
          {t("components.locked.title")}
        </h3>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-muted)", maxWidth: 380, lineHeight: 1.5 }}>
          {t("components.locked.body")}
        </p>
        <Link
          href="/membership"
          className="neo-btn neo-btn--primary"
          style={{ display: "inline-block", padding: "11px 22px", textDecoration: "none", fontWeight: 700, marginTop: 4 }}
        >
          {t("components.locked.cta")}
        </Link>
      </div>
    </div>
  );
}

// Pro-only prompt viewer: the full, copy-paste AI codegen prompt for a
// prompt-kind item, served by the same tier-gated API.
function PromptPanel({ slug }: { slug: string }) {
  const { t } = useLang();
  const [prompt, setPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/componenti/${slug}/code`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => json?.success && setPrompt(json.data.prompt ?? ""))
      .catch(() => {});
  }, [slug]);

  if (prompt === null) {
    return (
      <div style={{ padding: 24, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-muted)" }}>
        {t("components.loading")}
      </div>
    );
  }

  const copy = () => {
    navigator.clipboard?.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "3px solid var(--ink-border)" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            padding: "10px 16px",
            borderRight: "2px solid var(--ink-border)",
            background: "var(--accent-green)",
            color: "var(--btn-ink)",
          }}
        >
          {t("components.prompt.label")}
        </span>
        <button
          onClick={copy}
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            padding: "10px 16px",
            border: "none",
            background: "transparent",
            color: "var(--accent-green-deep)",
            cursor: "pointer",
          }}
        >
          {copied ? t("components.copied") : t("components.copyPrompt")}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: 18,
          maxHeight: 520,
          overflow: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: 12.5,
          lineHeight: 1.6,
          background: "var(--canvas-panel-grey)",
          color: "var(--ink-body)",
          whiteSpace: "pre-wrap",
        }}
      >
        <code>{prompt}</code>
      </pre>
    </div>
  );
}

function LockGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green-deep)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "0 0 auto" }}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function LockedPrompt() {
  const { t } = useLang();
  const sample = [
    "Build a full-screen, dark-themed hero section",
    "using React 18 + TypeScript + Vite + Tailwind CSS",
    "and lucide-react for icons. The signature feature",
    "is a cursor-following spotlight that reveals a",
    "second image through a soft circular mask.",
    "",
    "const SPOTLIGHT_R = 260;",
    "smooth.x += (mouse.x - smooth.x) * 0.1;",
    "smooth.y += (mouse.y - smooth.y) * 0.1;",
    "ctx.createRadialGradient(x, y, 0, x, y, R);",
    "// canvas.toDataURL() -> maskImage on the layer",
    "Fonts: Inter + Playfair Display (italic display).",
    "Heading: 'Light holds' / 'the shape of home'.",
    "Nav: Projects / Studio / Interiors / Process.",
  ];
  const benefits = [
    t("components.locked.benefit1"),
    t("components.locked.benefit2"),
    t("components.locked.benefit3"),
  ];
  return (
    <div
      className="neo-card"
      style={{ position: "relative", padding: 0, overflow: "hidden", minHeight: 430, display: "flex" }}
    >
      {/* Blurred teaser of the real prompt sitting behind the gate. */}
      <pre
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          padding: 18,
          fontFamily: "var(--font-mono)",
          fontSize: 12.5,
          lineHeight: 1.7,
          background: "var(--canvas-panel-grey)",
          color: "var(--ink-muted)",
          filter: "blur(5px)",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
        }}
      >
        <code>{sample.join("\n")}</code>
      </pre>

      {/* Frosted upsell overlay. */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 13,
          padding: "40px 28px",
          background:
            "linear-gradient(180deg, color-mix(in oklch, var(--canvas-page) 80%, transparent), color-mix(in oklch, var(--canvas-page) 93%, transparent))",
          WebkitBackdropFilter: "blur(2px)",
          backdropFilter: "blur(2px)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--accent-green)",
            border: "2px solid var(--ink-border)",
            color: "var(--btn-ink)",
          }}
        >
          <LockGlyph />
        </span>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            color: "var(--ink-muted)",
          }}
        >
          {t("components.locked.proEyebrow")}
        </span>

        <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, letterSpacing: "-0.01em" }}>
          {t("components.locked.promptTitle")}
        </h3>
        <p style={{ margin: 0, fontSize: 14, color: "var(--ink-muted)", maxWidth: 400, lineHeight: 1.55 }}>
          {t("components.locked.promptBody")}
        </p>

        <ul style={{ listStyle: "none", margin: "2px 0", padding: 0, display: "flex", flexDirection: "column", gap: 9, textAlign: "left" }}>
          {benefits.map((b) => (
            <li key={b} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 500, color: "var(--ink-body)" }}>
              <CheckGlyph />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/membership"
          className="neo-btn neo-btn--primary"
          style={{ display: "inline-block", padding: "12px 26px", textDecoration: "none", fontWeight: 700, marginTop: 6 }}
        >
          {t("components.locked.ctaShort")}
        </Link>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-muted)" }}>
          {t("components.locked.reassure")}
        </span>
      </div>
    </div>
  );
}
