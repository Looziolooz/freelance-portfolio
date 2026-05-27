"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const TIERS = [
  {
    id: "FREE",
    name: "Free",
    price: "0",
    currency: "€",
    period: "sempre",
    description: "Accesso base al portfolio",
    features: [
      "Blog e articoli visibili",
      "Demo projects pubblici",
      "Contenuti free sempre accessibili",
    ],
    cta: "Inizia Gratis",
    href: "/register",
    featured: false,
  },
  {
    id: "SUPPORTER",
    name: "Supporter",
    price: "5",
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
    price: "20",
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
    <main
      style={{
        padding: "100px 20px 80px",
        maxWidth: 1100,
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

      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 12 }}>
          Piani e Prezzi
        </h1>
        <p style={{ fontSize: 16, color: "var(--ink-muted)", maxWidth: 500, margin: "0 auto" }}>
          Scegli il piano che fa per te. Puoi passare a un livello superiore o cancellare quando vuoi.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 32,
          alignItems: "start",
        }}
      >
        {TIERS.map((tier) => {
          const subscribed = isSubscribed(tier.id);
          return (
            <div key={tier.id} style={{ position: "relative" }}>
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
                className={tier.featured ? "neo-panel-cream" : "neo-panel-white"}
                style={{
                  position: "relative",
                  zIndex: 2,
                  border: "3px solid var(--ink-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "36px 28px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {tier.featured && (
                  <div
                    className="neo-badge neo-badge-tilt"
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%) rotate(-6deg)",
                      padding: "4px 18px",
                      fontSize: 12,
                    }}
                  >
                    Più Popolare
                  </div>
                )}

                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                  {tier.name}
                </h2>
                <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 16 }}>
                  {tier.description}
                </p>

                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 40, fontWeight: 700 }}>
                    {tier.currency}{tier.price}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--ink-muted)", marginLeft: 6 }}>
                    /{tier.period}
                  </span>
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 28px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flex: 1,
                  }}
                >
                  {tier.features.map((f, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span style={{ color: "var(--accent-coral)", fontWeight: 700 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {subscribed ? (
                  <div
                    className="neo-panel-cream"
                    style={{
                      textAlign: "center",
                      padding: "12px 24px",
                      border: "3px solid var(--ink-border)",
                      borderRadius: "var(--radius)",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Piano Attuale
                  </div>
                ) : tier.id === "FREE" ? (
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "var(--ink-shadow)", borderRadius: "var(--radius)", transform: "translate(4px, 4px)" }} />
                    <a
                      href="/register"
                      className="neo-btn neo-btn-block"
                      style={{
                        position: "relative",
                        zIndex: 2,
                        textDecoration: "none",
                        color: "var(--ink-body)",
                        padding: "12px 24px",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {tier.cta}
                    </a>
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "var(--ink-shadow)", borderRadius: "var(--radius)", transform: "translate(4px, 4px)" }} />
                    <button
                      onClick={() => handleCheckout(tier.id)}
                      disabled={loading === tier.id}
                      className="neo-btn neo-btn-block"
                      style={{
                        position: "relative",
                        zIndex: 2,
                        padding: "12px 24px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: loading === tier.id ? "not-allowed" : "pointer",
                        opacity: loading === tier.id ? 0.7 : 1,
                      }}
                    >
                      {loading === tier.id ? "Reindirizzamento..." : tier.cta}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 56,
          textAlign: "center",
          fontSize: 13,
          color: "var(--ink-muted)",
        }}
      >
        <p>Pagamenti sicuri tramite Stripe. Cancellazione in qualsiasi momento.</p>
        <p style={{ marginTop: 4 }}>
          Già abbonato?{" "}
          <Link href="/account" style={{ fontWeight: 600, textDecoration: "underline" }}>
            Gestisci abbonamento
          </Link>
        </p>
      </div>
    </main>
  );
}
