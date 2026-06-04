"use client";

const TIER_LABELS: Record<string, string> = {
  FREE: "Free",
  SUPPORTER: "Supporter",
  PRO: "Pro",
};

// Per-tier background within the system palette; the 3px ink border + offset
// come from .neo-badge, so all three read as the same family as the rest of
// the site (no more foreign Tailwind green/blue/purple pills).
const TIER_BG: Record<string, string> = {
  FREE: "var(--accent-decor-green)",
  SUPPORTER: "var(--accent-peach)",
  PRO: "var(--accent-coral)",
};

export function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className="neo-badge"
      style={{
        background: TIER_BG[tier] ?? "var(--canvas-panel-yellow)",
        color: tier === "PRO" ? "var(--fg-on-coral)" : "var(--ink-body)",
      }}
    >
      {TIER_LABELS[tier] ?? tier}
    </span>
  );
}
