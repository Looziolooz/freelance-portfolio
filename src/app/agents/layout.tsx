import type { Metadata } from "next";
import { KNOWLEDGE } from "@/lib/agent-knowledge";

export const metadata: Metadata = {
  title: "Assistente AI",
  description:
    "Fai una domanda all'assistente AI dello studio: risponde su servizi, progetti e prezzi in italiano, inglese e svedese. Ed è l'esempio vivo degli agenti che costruisco.",
};

// Crawlable mirror of the assistant's knowledge (SEO audit: the best-written,
// most factual content on the site lived only inside Groq prompts — invisible
// to every crawler). Rendered SERVER-SIDE from the same KNOWLEDGE array the
// assistant uses, so the two can never drift. Italian only: it matches the
// SSR language of the rest of the site.
const GROUPS: { key: string; title: string }[] = [
  { key: "pricing", title: "Prezzi e formule" },
  { key: "engagement", title: "Come si lavora" },
  { key: "faq", title: "Domande frequenti" },
];

function KnowledgeDigest() {
  return (
    <section
      aria-label="L'assistente in breve"
      className="container"
      style={{ padding: "clamp(40px, 7vw, 88px) 0 clamp(60px, 8vw, 110px)" }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(26px, 3.6vw, 40px)",
          fontWeight: 600,
          letterSpacing: "-0.015em",
          margin: "0 0 10px",
          color: "var(--ink-body)",
        }}
      >
        Preferisci leggere? L&apos;assistente in breve.
      </h2>
      <p style={{ margin: "0 0 26px", fontSize: "var(--fs-base)", color: "var(--ink-muted)", maxWidth: 640 }}>
        Le stesse risposte che dà l&apos;assistente, nero su bianco: prezzi, metodo di lavoro e domande frequenti.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 880 }}>
        {GROUPS.map((g) => {
          const entries = KNOWLEDGE.filter((e) => e.category === g.key);
          if (!entries.length) return null;
          return (
            <details
              key={g.key}
              style={{
                border: "3px solid var(--ink-border)",
                borderRadius: "var(--radius-lg)",
                background: "var(--canvas-panel-yellow)",
                boxShadow: "4px 4px 0 var(--ink-shadow)",
                padding: "4px 0",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  padding: "14px 20px",
                  fontFamily: "var(--font-display)",
                  fontSize: 19,
                  fontWeight: 600,
                  color: "var(--ink-body)",
                }}
              >
                {g.title}
              </summary>
              <ul style={{ listStyle: "none", margin: 0, padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {entries.map((e) => (
                  <li
                    key={e.id}
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.55,
                      color: "var(--ink-body)",
                      paddingTop: 10,
                      borderTop: "1.5px solid color-mix(in oklch, var(--ink-border) 14%, transparent)",
                    }}
                  >
                    {e.text.IT}
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </section>
  );
}

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <KnowledgeDigest />
    </>
  );
}
