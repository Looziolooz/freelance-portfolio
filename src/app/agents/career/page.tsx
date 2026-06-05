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
            borderBottom: "3px solid var(--ink-border)",
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
              color: "var(--ink-body)",
            }}
          >
            {t("agent.career.skills.title")}
          </h3>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-muted)",
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
                border: "3px solid var(--ink-border)",
                borderRadius: "var(--radius-lg)",
                background: "var(--canvas-panel-yellow)",
                padding: 28,
                transition:
                  "transform .2s ease-out, box-shadow .2s ease-out",
                transform:
                  hoveredCard === s.id
                    ? "translate(-2px, -2px)"
                    : "translate(0, 0)",
                boxShadow:
                  hoveredCard === s.id
                    ? "8px 8px 0 var(--ink-shadow)"
                    : "6px 6px 0 var(--ink-shadow)",
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
                  color: "var(--ink-muted)",
                  paddingBottom: 14,
                  borderBottom: "3px solid var(--ink-border)",
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
                      color: "var(--ink-body)",
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
                      color: "var(--ink-muted)",
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
                className="neo-btn neo-btn-sm"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-body)",
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
            borderBottom: "3px solid var(--ink-border)",
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
              color: "var(--ink-body)",
            }}
          >
            {t("agent.career.experience.title")}
          </h3>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-muted)",
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
                borderBottom: "3px solid var(--ink-border)",
                textDecoration: "none",
                color: "var(--ink-body)",
                transition: "background .2s, padding .2s",
                cursor: "default",
              }}
              onMouseEnter={(ev) => {
                (ev.currentTarget as HTMLElement).style.background =
                  "var(--canvas-panel-yellow)";
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
                  color: "var(--ink-muted)",
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
                  color: "var(--ink-muted)",
                }}
              >
                {e.company}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-muted)",
                  lineHeight: 1.4,
                }}
              >
                {e.desc}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: "var(--ink-body)",
                  textAlign: "right",
                }}
                onClick={() =>
                  ask(`Tell me more about your experience at ${e.company}`)
                }
              >
                <span
                  className="neo-badge"
                  style={{
                    cursor: "pointer",
                    fontSize: 11,
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
          borderTop: "3px solid var(--ink-border)",
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
              color: "var(--ink-muted)",
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
              color: "var(--ink-body)",
              margin: 0,
            }}
          >
            {t("agent.career.chat.title.p1")}{" "}
            <span
              style={{
                background: "var(--accent-coral)",
                color: "var(--fg-on-coral)",
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
              color: "var(--ink-body)",
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
            agentInitials="LH"
            agentName="percorso"
            directQuestion={currentQuestion}
          />
        </div>
      </div>
    </section>
    </>
  );
}
