"use client";

const TIER_COLORS: Record<string, string> = {
  FREE: "bg-green-500/20 text-green-600 dark:text-green-400",
  SUPPORTER: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  PRO: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
};

const TIER_LABELS: Record<string, string> = {
  FREE: "Free",
  SUPPORTER: "Supporter",
  PRO: "Pro",
};

export function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        TIER_COLORS[tier] ?? ""
      }`}
    >
      {TIER_LABELS[tier] ?? tier}
    </span>
  );
}
