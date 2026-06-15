"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isPreviewUnlockAll } from "@/lib/preview";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await login(email, password);
      router.push("/members-only");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // Dev-only: skip the form and log in as a throwaway PRO user. A full reload
  // lets AuthProvider pick up the new session, then lands on the blog to review.
  const handleDevLogin = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/dev-login", { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Dev login non disponibile");
      window.location.href = "/blog";
    } catch (err: any) {
      setError(err.message);
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
            Accedi
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-muted)", marginBottom: 28 }}>
            Accedi ai contenuti riservati
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
              {busy ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>

          {isPreviewUnlockAll() && (
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: "2px dashed var(--ink-border)" }}>
              <button
                type="button"
                onClick={handleDevLogin}
                disabled={busy}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  cursor: busy ? "not-allowed" : "pointer",
                  background: "var(--canvas-page)",
                  color: "var(--ink-body)",
                  border: "2px dashed var(--ink-border)",
                  borderRadius: "var(--radius)",
                }}
              >
                Entra come dev (PRO)
              </button>
              <p style={{ marginTop: 8, fontSize: 11, color: "var(--ink-muted)", textAlign: "center" }}>
                Solo in sviluppo · sblocca tutti i contenuti
              </p>
            </div>
          )}

          <p style={{ marginTop: 20, fontSize: 13, textAlign: "center", color: "var(--ink-muted)" }}>
            Non hai un account?{" "}
            <Link href="/register" style={{ fontWeight: 600, textDecoration: "underline" }}>
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
