"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { RevealStagger, RevealItem } from "@/components/Reveal";
import CountUp from "@/components/CountUp";

const TIERS = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    currency: "€",
    period: "sempre",
    description: "Accesso base al portfolio",
    features: [
      "Blog e articoli visibili",
      "Demo projects pubblici",
      "Contenuti free sempre accessibili",
    ],
    cta: "Inizia gratis",
    href: "/register",
    featured: false,
  },
  {
    id: "SUPPORTER",
    name: "Supporter",
    price: 5,
    currency: "€",
    period: "mese",
    description: "Per chi vuole approfondire",
    features: [
      "Tutto del piano Free",
      "Prompt per immagini AI (Midjourney, DALL·E)",
      "Prompt per video AI (Runway, Pika)",
      "Trucchi e tecniche avanzate",
      "Contenuti esclusivi ogni settimana",
    ],
    cta: "Diventa Supporter",
    href: "#",
    featured: false,
  },
  {
    id: "PRO",
    name: "Pro",
    price: 20,
    currency: "€",
    period: "mese",
    description: "Per professionisti e creator",
    features: [
      "Tutto del piano Supporter",
      "Workflow personalizzati n8n",
      "Strumenti avanzati di lavoro",
      "Progetti completi con codice",
      "Consulenza prioritaria via email",
      "Accesso a nuovi tool in anteprima",
    ],
    cta: "Diventa Pro",
    href: "#",
    featured: false,
  },
  {
    id: "LIFETIME",
    name: "A vita",
    price: 100,
    currency: "€",
    period: "una tantum",
    description: "Accesso a vita a tutti i componenti",
    features: [
      "Tutti i componenti: codice + prompt completi",
      "Un nuovo componente avanzato ogni settimana",
      "Accesso a vita, pagamento unico",
      "Nessun abbonamento, nessun rinnovo",
      "Tutti gli aggiornamenti futuri inclusi",
    ],
    cta: "Sblocca a vita",
    href: "#",
    featured: true,
  },
];

export default function MembershipPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (tier: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(tier);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const json = await res.json();
      if (json.success && json.data.url) {
        window.location.href = json.data.url;
      } else {
        alert("Errore: " + (json.error || "Impossibile avviare il pagamento"));
      }
    } catch {
      alert("Errore di connessione");
    } finally {
      setLoading(null);
    }
  };

  const isSubscribed = (tierId: string) => {
    if (!user) return false;
    if (tierId === "FREE") return user.tier === "FREE";
    return user.tier === tierId;
  };

  return (
    <>
      <Nav />
      <main
        className="container"
        style={{
          paddingTop: "calc(var(--topbar-h) + 56px)",
          paddingBottom: 100,
          maxWidth: 1120,
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 36,
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

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 64 }}>
          <span
            className="cap-pill cap-pill--solid"
            style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}
          >
            <span className="cap-pill__dot" />
            Membership
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6vw, 76px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              margin: "20px 0 14px",
            }}
          >
            Sblocca il{" "}
            <span
              style={{
                background: "var(--accent-green-sheen)",
                color: "var(--btn-ink)",
                padding: "0 0.12em",
                borderRadius: 4,
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                boxShadow: "3px 3px 0 var(--ink-shadow)",
              }}
            >
              know-how
            </span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--ink-muted)",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Prompt, workflow e guide che uso davvero nel lavoro. Passa a un livello superiore o
            cancella quando vuoi, senza vincoli.
          </p>
        </header>

        <RevealStagger
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
            gap: 30,
            alignItems: "stretch",
          }}
        >
          {TIERS.map((tier) => {
            const subscribed = isSubscribed(tier.id);
            const ink = "var(--ink-body)";
            return (
              <RevealItem key={tier.id} style={{ display: "flex", width: "100%" }}>
                <div style={{ position: "relative", width: "100%", display: "flex" }}>
                  {tier.featured && (
                    <span
                      className="neo-badge neo-badge-tilt"
                      style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%) rotate(-5deg)",
                        background: "var(--accent-green-sheen)",
                        padding: "4px 16px",
                        fontSize: 11,
                        zIndex: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Miglior valore
                    </span>
                  )}
                  <div
                    className="neo-card neo-card--shine accent-rail"
                    style={{
                      position: "relative",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      padding: "34px 28px",
                      background: tier.featured
                        ? "var(--canvas-panel-yellow)"
                        : "var(--canvas-panel-grey)",
                      boxShadow: tier.featured
                        ? "8px 8px 0 var(--ink-shadow), 0 28px 56px -26px rgba(14,138,87,0.45)"
                        : "var(--shadow-card)",
                    }}
                  >

                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 26,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      margin: "0 0 4px",
                      color: tier.featured ? "var(--accent-green-deep)" : ink,
                    }}
                  >
                    {tier.name}
                  </h2>
                  <p style={{ fontSize: 13.5, color: "var(--ink-muted)", margin: "0 0 18px" }}>
                    {tier.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 22 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 46, fontWeight: 600, letterSpacing: -1 }}>
                      {tier.currency}
                      <CountUp value={tier.price} />
                    </span>
                    <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>
                      {tier.id === "LIFETIME" ? " " : "/"}{tier.period}
                    </span>
                  </div>

                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 26px 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: 11,
                      flex: 1,
                      borderTop: "1px solid color-mix(in oklch, var(--ink-body) 14%, transparent)",
                      paddingTop: 18,
                    }}
                  >
                    {tier.features.map((f, i) => (
                      <li key={i} style={{ fontSize: 13.5, display: "flex", alignItems: "baseline", gap: 10, lineHeight: 1.45 }}>
                        <span style={{ color: "var(--accent-green-deep)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {subscribed ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "12px 24px",
                        border: "3px solid var(--ink-border)",
                        borderRadius: "var(--radius)",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "var(--font-mono)",
                        background: "color-mix(in oklch, var(--accent-green) 14%, transparent)",
                      }}
                    >
                      ✓ Piano attuale
                    </div>
                  ) : tier.id === "FREE" ? (
                    <a
                      href="/register"
                      className="neo-btn neo-btn-block"
                      style={{ textDecoration: "none", color: "var(--btn-ink)", padding: "12px 24px", fontSize: 14, fontWeight: 600 }}
                    >
                      {tier.cta}
                      <span className="btn-arrow" aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => handleCheckout(tier.id)}
                      disabled={loading === tier.id}
                      className={`neo-btn neo-btn-block${tier.featured ? " neo-btn--primary" : ""}`}
                      style={{
                        padding: "12px 24px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: loading === tier.id ? "not-allowed" : "pointer",
                        opacity: loading === tier.id ? 0.7 : 1,
                      }}
                    >
                      {loading === tier.id ? "Reindirizzamento…" : tier.cta}
                      {loading !== tier.id && <span className="btn-arrow" aria-hidden="true">→</span>}
                    </button>
                  )}
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>

        <div
          style={{
            marginTop: 60,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 12.5,
            color: "var(--ink-muted)",
            letterSpacing: 0.2,
          }}
        >
          <p style={{ margin: 0 }}>Pagamenti sicuri via Stripe · Cancellazione in qualsiasi momento.</p>
          <p style={{ marginTop: 6 }}>
            Già abbonato?{" "}
            <Link href="/account" style={{ fontWeight: 600, color: "var(--accent-green-deep)" }}>
              Gestisci abbonamento →
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
