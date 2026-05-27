"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import SectionHeader from "@/components/SectionHeader";
import AgentNav from "@/components/AgentNav";
import { useLang } from "@/components/LangProvider";

const SKILLS = [
  {
    label: "AI / Automation",
    id: "ai",
    primary: ["n8n", "OpenAI", "Claude", "LangChain"],
    secondary: ["Prompt Engineering", "Data Pipelines"],
  },
  {
    label: "Frontend",
    id: "frontend",
    primary: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    secondary: ["Framer Motion", "Vue.js"],
  },
  {
    label: "Backend / Data",
    id: "backend",
    primary: ["Node.js", "Python", "Flask", "PostgreSQL"],
    secondary: ["MongoDB", "REST APIs"],
  },
  {
    label: "Design / Craft",
    id: "design",
    primary: ["UI/UX Design", "Branding", "Figma"],
    secondary: ["Illustrator", "Photoshop"],
  },
];

const EXPERIENCE = [
  {
    title: "AI Orchestrator & Full-Stack Developer",
    period: "2020 – Present",
    company: "Freelance / Self-Employed",
    desc: "AI workflow automation, n8n pipelines, web scraping, full-stack development for clients across Europe.",
  },
  {
    title: "Frontend Developer",
    period: "2018 – 2020",
    company: "Digital Agency, Stockholm",
    desc: "React & Next.js development, responsive design, and client-facing project delivery.",
  },
  {
    title: "Designer & Developer",
    period: "2016 – 2018",
    company: "Branding Studio, Milan",
    desc: "Branding, concept design, and frontend development for mid-market brands.",
  },
];

export default function CareerAgentPage() {
  const { t } = useLang();
  const [currentQuestion, setCurrentQuestion] = useState("");

  const ask = (q: string) => {
    setCurrentQuestion(`${q} [${Date.now()}]`);
    setTimeout(() => setCurrentQuestion(""), 500);
  };

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <>
      <AgentNav />
      <section
        style={{
          padding: "clamp(110px, 10vw, 160px) clamp(24px, 4vw, 60px) clamp(80px, 8vw, 140px)",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
      <SectionHeader
        num={t("agent.career.num")}
        title={t("agent.career.title")}
        meta={t("agent.career.meta")}
      />

      {/* Skills */}
      <div style={{ marginBottom: 96 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "1px solid var(--fg)",
            paddingBottom: 14,
            marginBottom: 40,
          }}
        >
          <h3
            style={{
              fontSize: 28,
              margin: 0,
              fontWeight: 500,
              letterSpacing: -0.5,
              color: "var(--fg)",
            }}
          >
            {t("agent.career.skills.title")}
          </h3>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--muted)",
              letterSpacing: 1.4,
              textTransform: "uppercase",
            }}
          >
            {t("agent.career.skills.meta")}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 32,
          }}
        >
          {SKILLS.map((s) => (
            <div
              key={s.id}
              style={{
                border: "1px solid var(--line)",
                borderRadius: 4,
                background: "var(--panel)",
                padding: 28,
                transition:
                  "transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s",
                transform:
                  hoveredCard === s.id
                    ? "translateY(-4px)"
                    : "translateY(0)",
                boxShadow:
                  hoveredCard === s.id
                    ? "0 20px 40px -20px color-mix(in oklch, var(--fg) 25%, transparent)"
                    : "0 0 0 transparent",
              }}
              onMouseEnter={() => setHoveredCard(s.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1.6,
                  color: "var(--muted)",
                  paddingBottom: 14,
                  borderBottom: "1px solid var(--line)",
                  marginBottom: 20,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{s.label}</span>
                <span>0{SKILLS.indexOf(s) + 1}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                {s.primary.map((x) => (
                  <div
                    key={x}
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: -0.3,
                      color: "var(--fg)",
                    }}
                  >
                    {x}
                  </div>
                ))}
                {s.secondary.map((x) => (
                  <div
                    key={x}
                    style={{
                      fontSize: 20,
                      fontWeight: 400,
                      letterSpacing: -0.3,
                      color: "var(--muted)",
                    }}
                  >
                    {x}
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  ask(`Tell me more about your ${s.label.toLowerCase()} skills`)
                }
                style={{
                  padding: "6px 14px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  border: "1px solid var(--accent)",
                  borderRadius: 4,
                  background: "transparent",
                  color: "var(--accent)",
                  cursor: "pointer",
                  letterSpacing: 0.4,
                }}
              >
                {t("agent.ask.skills")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div style={{ marginBottom: 96 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "1px solid var(--fg)",
            paddingBottom: 14,
            marginBottom: 40,
          }}
        >
          <h3
            style={{
              fontSize: 28,
              margin: 0,
              fontWeight: 500,
              letterSpacing: -0.5,
              color: "var(--fg)",
            }}
          >
            {t("agent.career.experience.title")}
          </h3>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--muted)",
              letterSpacing: 1.4,
              textTransform: "uppercase",
            }}
          >
            {t("agent.career.experience.meta")}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {EXPERIENCE.map((e, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 2fr 1fr 200px 80px",
                alignItems: "center",
                padding: "24px 16px",
                borderBottom: "1px solid var(--line)",
                textDecoration: "none",
                color: "var(--fg)",
                transition: "background .2s, padding .2s",
                cursor: "default",
              }}
              onMouseEnter={(ev) => {
                (ev.currentTarget as HTMLElement).style.background =
                  "var(--panel)";
              }}
              onMouseLeave={(ev) => {
                (ev.currentTarget as HTMLElement).style.background =
                  "transparent";
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  letterSpacing: -0.4,
                }}
              >
                {e.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                {e.company}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--muted)",
                  lineHeight: 1.4,
                }}
              >
                {e.desc}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: "var(--fg)",
                  textAlign: "right",
                }}
                onClick={() =>
                  ask(`Tell me more about your experience at ${e.company}`)
                }
              >
                <span
                  style={{
                    cursor: "pointer",
                    padding: "4px 12px",
                    border: "1px solid var(--accent)",
                    borderRadius: 4,
                    fontSize: 11,
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {t("agent.career.ask.btn")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 60,
          alignItems: "flex-start",
          borderTop: "1px solid var(--line)",
          paddingTop: 56,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1.8,
              color: "var(--muted)",
              marginBottom: 12,
            }}
          >
            {t("agent.career.chat.label")}
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 500,
              letterSpacing: -1.2,
              lineHeight: 1.05,
              color: "var(--fg)",
              margin: 0,
            }}
          >
            {t("agent.career.chat.title.p1")}{" "}
            <span
              style={{
                background: "var(--accent)",
                color: "var(--accentInk)",
                padding: "0 0.08em",
              }}
            >
              {t("agent.career.chat.title.highlight")}
            </span>
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.55,
              color: "var(--fg)",
              opacity: 0.75,
              marginTop: 16,
              maxWidth: 380,
            }}
          >
            {t("agent.career.chat.desc")}
          </p>
        </div>
        <div>
          <AgentChat
            agentType="career"
            initialMessage={t("agent.chat.career")}
            agentInitials="CA"
            agentName="CareerAgent"
            directQuestion={currentQuestion}
          />
        </div>
      </div>
    </section>
    </>
  );
}
