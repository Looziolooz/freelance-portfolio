"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { useAuth } from "./auth/AuthProvider";

const TIER_ORDER: Record<string, number> = { FREE: 0, SUPPORTER: 1, PRO: 2 };
type Lang3 = "html" | "css" | "js";

// The code viewer for a single component. Pro (€20/mo) members get the real
// HTML/CSS/JS tabs (fetched from the tier-gated API); everyone else gets a
// blurred teaser + unlock CTA. The API enforces the gate server-side too.
export default function ComponentCode({ slug }: { slug: string }) {
  const { user, loading } = useAuth();
  const isPro = (TIER_ORDER[user?.tier ?? "FREE"] ?? 0) >= TIER_ORDER.PRO;

  if (loading) return null;
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
