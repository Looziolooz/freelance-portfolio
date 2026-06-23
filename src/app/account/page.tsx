"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TierBadge } from "@/components/auth/TierBadge";
import Nav from "@/components/Nav";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Nav />
      <main
        className="container"
        style={{
          paddingTop: "calc(var(--topbar-h) + 48px)",
          paddingBottom: 80,
          maxWidth: 620,
        }}
      >
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 26,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          textDecoration: "none",
          color: "var(--ink-muted)",
        }}
      >
        <span className="btn-arrow" aria-hidden="true" style={{ marginLeft: 0 }}>←</span> Home
      </Link>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px, 5vw, 48px)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 32 }}>
        Il mio account
      </h1>

      <div style={{ position: "relative", marginBottom: 24 }}>
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
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Email</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{user.email}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Piano</span>
            <TierBadge tier={user.tier} />
          </div>

          {user.name && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Nome</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</span>
            </div>
          )}
        </div>
      </div>

      {user.tier === "FREE" ? (
        <div style={{ position: "relative", marginBottom: 12 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--ink-shadow)",
              borderRadius: "var(--radius)",
              transform: "translate(4px, 4px)",
            }}
          />
          <Link
            href="/membership"
            className="neo-btn neo-btn-block neo-btn-lg"
            style={{
              position: "relative",
              zIndex: 2,
              textDecoration: "none",
              color: "var(--btn-ink)",
            }}
          >
            Passa a un Piano Premium
          </Link>
        </div>
      ) : (
        <div style={{ position: "relative", marginBottom: 12 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--ink-shadow)",
              borderRadius: "var(--radius)",
              transform: "translate(4px, 4px)",
            }}
          />
          <div
            className="neo-panel-cream"
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              padding: "14px 24px",
              border: "3px solid var(--ink-border)",
              borderRadius: "var(--radius)",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Sei abbonato al piano {user.tier === "SUPPORTER" ? "Supporter" : "Pro"}
          </div>
        </div>
      )}

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--ink-shadow)",
            borderRadius: "var(--radius)",
            transform: "translate(4px, 4px)",
          }}
        />
        <button
          onClick={logout}
          className="neo-btn neo-btn-block neo-btn-lg"
          style={{
            position: "relative",
            zIndex: 2,
            background: "var(--canvas-page)",
            color: "var(--ink-body)",
            cursor: "pointer",
          }}
        >
          Esci
        </button>
      </div>
      </main>
    </>
  );
}
