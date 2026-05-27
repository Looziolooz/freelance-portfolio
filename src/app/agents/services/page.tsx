"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import SectionHeader from "@/components/SectionHeader";
import AgentNav from "@/components/AgentNav";
import { useLang } from "@/components/LangProvider";

const SERVICES = [
  {
    name: "AI Workflow Automation",
    price: "€2,000 – €15,000",
    timeline: "2–8 weeks",
    desc: "n8n pipelines, GPT routers, data orchestration, and custom automation that ships real work — not demos.",
    tech: ["n8n", "OpenAI", "Claude", "Python"],
  },
  {
    name: "Web Scraping & Data",
    price: "€1,500 – €10,000",
    timeline: "1–6 weeks",
    desc: "Scraper networks, pricing dashboards, PDF processing, and structured data extraction at scale.",
    tech: ["Python", "Playwright", "Puppeteer", "APIs"],
  },
  {
    name: "Web Development",
    price: "€3,000 – €25,000",
    timeline: "3–12 weeks",
    desc: "Full-stack web applications with Next.js, React, and modern architecture. From landing pages to platforms.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind"],
  },
  {
    name: "Technical Consulting",
    price: "€100 – €200/hr",
    timeline: "Ongoing",
    desc: "System architecture, tech stack advice, code review, and automation strategy for teams that ship.",
    tech: ["Architecture", "DevOps", "Security"],
  },
];

const STEPS = [
  "Initial consultation",
  "Proposal & quote",
  "Kickoff & planning",
  "Development sprints",
  "Testing & QA",
  "Deployment",
  "Support",
];

export default function ServicesAgentPage() {
  const { t } = useLang();
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  const ask = (q: string) => {
    setCurrentQuestion(`${q} [${Date.now()}]`);
    setTimeout(() => setCurrentQuestion(""), 500);
  };

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
        num={t("agent.services.num")}
        title={t("agent.services.title")}
        meta={t("agent.services.meta")}
      />

      {/* Services grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          marginBottom: 96,
        }}
      >
        {SERVICES.map((s) => (
          <div
            key={s.name}
            style={{
              border: "1px solid var(--line)",
              borderRadius: 4,
              background: "var(--panel)",
              padding: 28,
              display: "flex",
              flexDirection: "column",
              transition:
                "transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s",
              transform:
                hovered === s.name ? "translateY(-4px)" : "translateY(0)",
              boxShadow:
                hovered === s.name
                  ? "0 20px 40px -20px color-mix(in oklch, var(--fg) 25%, transparent)"
                  : "0 0 0 transparent",
            }}
            onMouseEnter={() => setHovered(s.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: -0.3,
                color: "var(--fg)",
                margin: "0 0 10px",
              }}
            >
              {s.name}
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--fg)",
                opacity: 0.75,
                margin: "0 0 20px",
                flex: 1,
              }}
            >
              {s.desc}
            </p>
            <div
              style={{
                display: "flex",
                gap: 20,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                borderTop: "1px solid var(--line)",
                paddingTop: 16,
                marginBottom: 16,
              }}
            >
              <span>{s.price}</span>
              <span>·</span>
              <span>{s.timeline}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 20,
              }}
            >
              {s.tech.map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "3px 10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: 0.4,
                    border: "1px solid var(--line)",
                    borderRadius: 999,
                    color: "var(--muted)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={() =>
                ask(`Tell me more about your ${s.name.toLowerCase()} services`)
              }
              style={{
                padding: "6px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                border: "1px solid var(--accent)",
                borderRadius: 4,
                background: "transparent",
                color: "var(--accent)",
                cursor: "pointer",
                letterSpacing: 0.4,
                alignSelf: "flex-start",
              }}
            >
              {t("agent.ask.service", { name: s.name })}
            </button>
          </div>
        ))}
      </div>

      {/* Process */}
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
            {t("agent.services.process.title")}
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
            {t("agent.services.process.meta")}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 24,
          }}
        >
          {STEPS.map((step, i) => (
            <div key={step} style={{ textAlign: "left" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "var(--accentInk)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--fg)",
                  lineHeight: 1.4,
                  letterSpacing: 0.3,
                }}
              >
                {step}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() =>
              ask("Explain your client engagement process in detail")
            }
            style={{
              padding: "8px 20px",
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
            {t("agent.services.learn")}
          </button>
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
            {t("agent.services.chat.label")}
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
            {t("agent.services.chat.title.p1")}{" "}
            <span
              style={{
                background: "var(--accent)",
                color: "var(--accentInk)",
                padding: "0 0.08em",
              }}
            >
              {t("agent.services.chat.title.highlight")}
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
            {t("agent.services.chat.desc")}
          </p>
        </div>
        <div>
          <AgentChat
            agentType="client"
            initialMessage={t("agent.chat.client")}
            agentInitials="BA"
            agentName="BusinessAdvisor"
            directQuestion={currentQuestion}
          />
        </div>
      </div>
    </section>
    </>
  );
}
