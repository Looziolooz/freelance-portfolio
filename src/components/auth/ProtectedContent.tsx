"use client";

import { useAuth } from "./AuthProvider";
import type { ReactNode } from "react";

const TIER_ORDER: Record<string, number> = {
  FREE: 0,
  SUPPORTER: 1,
  PRO: 2,
};

export function ProtectedContent({
  tier,
  children,
  fallback,
}: {
  tier: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, loading } = useAuth();
  const userTier = user?.tier ?? "FREE";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if ((TIER_ORDER[userTier] ?? 0) >= (TIER_ORDER[tier] ?? 0)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div className="text-center py-12 px-6 rounded-xl border border-dashed border-[var(--accent)]/30">
      <div className="text-4xl mb-4">🔒</div>
      <h3 className="text-lg font-bold mb-2">Content Bloccato</h3>
      <p className="text-sm opacity-70 mb-4">
        Questo contenuto è disponibile per i membri{" "}
        {tier === "SUPPORTER" ? "Supporter" : "Pro"}.
      </p>
      <a
        href="/membership"
        className="inline-block px-6 py-2 rounded-full bg-[var(--accent)] text-white font-medium text-sm hover:opacity-80 transition-opacity"
      >
        Vedi Piani
      </a>
    </div>
  );
}
