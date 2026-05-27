"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import SectionHeader from "@/components/SectionHeader";
import AgentNav from "@/components/AgentNav";
import { useLang } from "@/components/LangProvider";

const PROJECTS = [
  {
    title: "E-commerce Platform",
    year: "2023",
    tech: "React · Node.js · MongoDB · Express",
    desc: "Full-stack e-commerce platform with product management, shopping cart, and Stripe payment processing.",
    highlights: ["RESTful API", "JWT auth", "Responsive"],
  },
  {
    title: "Task Management App",
    year: "2022",
    tech: "Vue.js · Firebase · Tailwind CSS",
    desc: "Real-time task management with collaborative features, notifications, and drag-and-drop progress tracking.",
    highlights: ["Real-time sync", "PWA", "Drag & drop"],
  },
  {
    title: "Data Visualization Dashboard",
    year: "2021",
    tech: "Python · Django · D3.js · PostgreSQL",
    desc: "Interactive dashboard for visualizing complex datasets with filtering, sorting, and CSV/PDF export.",
    highlights: ["Interactive charts", "Export", "Responsive"],
  },
  {
    title: "AI Chatbot",
    year: "2024",
    tech: "Next.js · OpenAI · n8n",
    desc: "Conversational AI chatbot for client support with natural language understanding and workflow automation.",
    highlights: ["LLM integration", "n8n pipeline", "Context-aware"],
  },
  {
    title: "Atelier Solari",
    year: "2026",
    tech: "Next.js 16 · Tailwind CSS 4 · i18n",
    desc: "Wedding photography studio website for Tuscany & Amalfi Coast. Medium format film aesthetic with multilingual support.",
    highlights: ["Next.js 16", "i18n IT/EN/SV", "Tailwind CSS 4"],
    url: "https://github.com/Looziolooz/fotografo",
  },
  {
    title: "Nordhem",
    year: "2026",
    tech: "Next.js 16 · Tailwind CSS 4 · i18n",
    desc: "Scandinavian luxury real estate agency website with property grid, filters, detail drawer, and multilingual interface.",
    highlights: ["Property listings", "Multilingual", "Responsive"],
    url: "https://github.com/Looziolooz/real-estate",
  },
  {
    title: "Aurelia Pro X1",
    year: "2026",
    tech: "Next.js · Python · Blender · 3D",
    desc: "Premium espresso machine product landing page with 3D configurator, colour variants, and multilingual support.",
    highlights: ["3D configurator", "Blender", "Python"],
    url: "https://github.com/Looziolooz/aurelia",
  },
  {
    title: "Couffer",
    year: "2026",
    tech: "Next.js 16 · Tailwind CSS 4 · TypeScript",
    desc: "Full salon management platform with booking, services, products, client portal, staff dashboard, and admin panel.",
    highlights: ["Booking", "Admin dashboard", "Client portal"],
    url: "https://github.com/Looziolooz/couffer",
  },
  {
    title: "Pizzeria Restaurant",
    year: "2026",
    tech: "Next.js 16 · Tailwind CSS 4 · TypeScript",
    desc: "Complete restaurant website with digital menu, online ordering, table reservation, checkout flow, and admin panel.",
    highlights: ["Online ordering", "Reservations", "Admin panel"],
    url: "https://github.com/Looziolooz/pizzeria-restaurant",
  },
];

export default function ProjectsAgentPage() {
  const { t } = useLang();
  const [currentQuestion, setCurrentQuestion] = useState("");

  const ask = (q: string) => {
    setCurrentQuestion(`${q} [${Date.now()}]`);
    setTimeout(() => setCurrentQuestion(""), 500);
  };

  const [hovered, setHovered] = useState<string | null>(null);

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
        num={t("agent.projects.num")}
        title={t("agent.projects.title")}
        meta={t("agent.projects.meta")}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          marginBottom: 96,
        }}
      >
        {PROJECTS.map((p) => (
          <div
            key={p.title}
            style={{
              border: "1px solid var(--line)",
              borderRadius: 4,
              background: "var(--panel)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              transition:
                "transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s",
              transform:
                hovered === p.title ? "translateY(-4px)" : "translateY(0)",
              boxShadow:
                hovered === p.title
                  ? "0 20px 40px -20px color-mix(in oklch, var(--fg) 25%, transparent)"
                  : "0 0 0 transparent",
            }}
            onMouseEnter={() => setHovered(p.title)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              style={{
                aspectRatio: "16/9",
                background: "color-mix(in oklch, var(--accent) 8%, var(--bg))",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent 0 14px, color-mix(in oklch, var(--fg) 6%, transparent) 14px 15px)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  fontFamily: "var(--font-mono)",
                  fontSize: 20,
                  fontWeight: 500,
                  letterSpacing: -0.4,
                  color: "color-mix(in oklch, var(--fg) 40%, transparent)",
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "color-mix(in oklch, var(--fg) 60%, transparent)",
                }}
              >
                {t("agent.projects.prefix")}{PROJECTS.indexOf(p) + 1}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "color-mix(in oklch, var(--fg) 60%, transparent)",
                }}
              >
                {p.year}
              </div>
            </div>
            <div style={{ padding: "22px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--muted)",
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {p.tech}
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: -0.4,
                  color: "var(--fg)",
                  margin: "0 0 10px",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--fg)",
                  opacity: 0.75,
                  margin: "0 0 16px",
                  flex: 1,
                }}
              >
                {p.desc}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 16,
                }}
              >
                {p.highlights.map((h) => (
                  <span
                    key={h}
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
                    {h}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    ask(`Tell me more about the ${p.title} project`);
                  }}
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
                  }}
                >
                  {t("agent.projects.details")}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    ask(
                      `What technologies were used in the ${p.title} project?`
                    );
                  }}
                  style={{
                    padding: "6px 16px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    border: "1px solid var(--line)",
                    borderRadius: 4,
                    background: "transparent",
                    color: "var(--fg)",
                    cursor: "pointer",
                    letterSpacing: 0.4,
                  }}
                >
                  {t("agent.projects.tech")}
                </button>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      padding: "6px 16px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      border: "1px solid var(--line)",
                      borderRadius: 4,
                      background: "transparent",
                      color: "var(--fg)",
                      cursor: "pointer",
                      letterSpacing: 0.4,
                      textDecoration: "none",
                      marginLeft: "auto",
                    }}
                  >
                    {t("agent.projects.github")}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
            {t("agent.projects.chat.label")}
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
            {t("agent.projects.chat.title.p1")}{" "}
            <span
              style={{
                background: "var(--accent)",
                color: "var(--accentInk)",
                padding: "0 0.08em",
              }}
            >
              {t("agent.projects.chat.title.highlight")}
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
            {t("agent.projects.chat.desc")}
          </p>
        </div>
        <div>
          <AgentChat
            agentType="project"
            initialMessage={t("agent.chat.project")}
            agentInitials="PA"
            agentName="ProjectAgent"
            directQuestion={currentQuestion}
          />
        </div>
      </div>
    </section>
    </>
  );
}
