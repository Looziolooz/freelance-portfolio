import Link from "next/link";

// Branded 404 (Next's default was unstyled). Server component: correct 404
// status + noindex come from Next automatically.
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--canvas-page)",
        color: "var(--ink-body)",
        fontFamily: "var(--font-ui)",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "var(--ink-muted)", margin: 0 }}>
          ERRORE 404
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05, margin: "10px 0 14px" }}>
          Pagina non trovata.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-muted)", margin: "0 0 26px" }}>
          Il link è sbagliato o la pagina non esiste più. I progetti, però, sono tutti al loro posto.
        </p>
        <Link
          href="/"
          className="neo-btn neo-btn-lg neo-btn--primary"
          style={{ textDecoration: "none", color: "var(--btn-ink)", padding: "13px 26px", fontSize: 16 }}
        >
          Torna alla home →
        </Link>
      </div>
    </main>
  );
}
