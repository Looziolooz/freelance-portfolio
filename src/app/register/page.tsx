"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (user) {
    router.push("/members-only");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(email, password, name || undefined);
      router.push("/members-only");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
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
            padding: "40px 36px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginBottom: 24,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              color: "var(--ink-body)",
            }}
          >
            &larr; Home
          </Link>

          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            Registrati
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-muted)", marginBottom: 28 }}>
            Crea un account per accedere ai contenuti
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label htmlFor="name" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Nome (opzionale)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="neo-input"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="neo-input"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="neo-input"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <p style={{ color: "var(--accent-coral)", fontSize: 13, margin: 0 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="neo-btn neo-btn-lg neo-btn-block"
              style={{
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.7 : 1,
                marginTop: 4,
              }}
            >
              {busy ? "Registrazione..." : "Registrati"}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: 13, textAlign: "center", color: "var(--ink-muted)" }}>
            Hai già un account?{" "}
            <Link href="/login" style={{ fontWeight: 600, textDecoration: "underline" }}>
              Accedi
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
