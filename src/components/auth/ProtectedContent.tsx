"use client";

import { useAuth } from "./AuthProvider";
import Link from "next/link";
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
      <div
        style={{
          textAlign: "center",
          padding: "48px 0",
          color: "var(--ink-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          letterSpacing: 0.5,
        }}
      >
        Caricamento…
      </div>
    );
  }

  if ((TIER_ORDER[userTier] ?? 0) >= (TIER_ORDER[tier] ?? 0)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div
      className="offset block offset--panel"
      style={{ display: "block", width: "100%", maxWidth: 520, margin: "0 auto" }}
    >
      <div className="offset__layer" />
      <div className="offset__fg neo-panel-cream" style={{ padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <h3 style={{ fontSize: "var(--fs-h2)", fontWeight: 700, margin: "0 0 8px" }}>
          Contenuto Bloccato
        </h3>
        <p style={{ fontSize: "var(--fs-sm)", color: "var(--ink-muted)", margin: "0 0 20px" }}>
          Questo contenuto è disponibile per i membri{" "}
          {tier === "SUPPORTER" ? "Supporter" : "Pro"}.
        </p>
        <Link
          href="/membership"
          className="neo-btn"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            textDecoration: "none",
            color: "var(--ink-body)",
            fontWeight: 600,
          }}
        >
          Vedi Piani
        </Link>
      </div>
    </div>
  );
}
