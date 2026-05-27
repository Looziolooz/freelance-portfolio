"use client";

import { useLang } from "./LangProvider";

export default function Ticker() {
  const { t } = useLang();

  const items = Array.from({ length: 11 }, (_, i) => t(`ticker.${i}`));

  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "3px solid var(--ink-border)",
        borderBottom: "3px solid var(--ink-border)",
        padding: "14px 0",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          animation: "ticker 40s linear infinite",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: 1.8,
          color: "var(--muted)",
          width: "max-content",
        }}
      >
        {[...items, ...items].map((x, i) => (
          <span key={i}>
            {x}{" "}
            <span style={{ margin: "0 16px", color: "var(--line)" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
