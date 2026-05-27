"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TierBadge } from "@/components/auth/TierBadge";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main
      style={{
        padding: "100px 20px",
        maxWidth: 600,
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

      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>
        Il Mio Account
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
              color: "var(--ink-body)",
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
            background: "var(--accent-coral)",
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
            color: "var(--accent-coral)",
            cursor: "pointer",
          }}
        >
          Esci
        </button>
      </div>
    </main>
  );
}
