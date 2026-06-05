"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import SectionHeader from "@/components/SectionHeader";
import AgentNav from "@/components/AgentNav";
import { useLang } from "@/components/LangProvider";

type Project = {
  title: string;
  year: string;
  tech: string;
  desc: string;
  value: string;
  highlights: string[];
  image?: string;
};

const PROJECTS: Project[] = [
  {
    title: "Atelier Solari",
    year: "2026",
    tech: "Next.js 16 · Tailwind CSS 4 · i18n",
    desc: "Wedding photography studio website for Tuscany & Amalfi Coast. Medium format film aesthetic with multilingual support.",
    value: "Multilingual site that brings in wedding enquiries from Italian and international clients, with no middlemen.",
    highlights: ["Next.js 16", "i18n IT/EN/SV", "Tailwind CSS 4"],
    image: "/projects/fotografo.png",
  },
  {
    title: "Pizzeria Restaurant",
    year: "2026",
    tech: "Next.js 16 · Tailwind CSS 4 · TypeScript",
    desc: "Complete restaurant website with digital menu, online ordering, table reservation, checkout flow, and admin panel.",
    value: "Admin panel for online orders, table bookings and a live menu: fewer phone calls, more covers.",
    highlights: ["Online ordering", "Reservations", "Admin panel"],
    image: "/projects/pizzeria-restaurant.png",
  },
  {
    title: "Aurelia Pro X1",
    year: "2026",
    tech: "Next.js · Python · Blender · 3D",
    desc: "Premium espresso machine product landing page with 3D configurator, colour variants, and multilingual support.",
    value: "3D configurator that lets customers choose and personalise the premium product online, cutting pre-sale questions.",
    highlights: ["3D configurator", "Blender", "Python"],
    image: "/projects/aurelia.png",
  },
  {
    title: "Couffer",
    year: "2026",
    tech: "Next.js 16 · Tailwind CSS 4 · TypeScript",
    desc: "Full salon management platform with booking, services, products, client portal, staff dashboard, and admin panel.",
    value: "Full salon management: bookings, staff, product stock and a client portal in a single panel.",
    highlights: ["Booking", "Admin dashboard", "Client portal"],
  },
  {
    title: "Nordhem",
    year: "2026",
    tech: "Next.js 16 · Tailwind CSS 4 · i18n",
    desc: "Scandinavian luxury real estate agency website with property grid, filters, detail drawer, and multilingual interface.",
    value: "Property catalogue with filters and detailed pages: clients arrive informed and leads are better qualified.",
    highlights: ["Property listings", "Multilingual", "Responsive"],
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
              border: "3px solid var(--ink-border)",
              borderRadius: "var(--radius-lg)",
              background: "var(--canvas-panel-yellow)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              transition:
                "transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s",
              transform:
                hovered === p.title ? "translate(-2px, -2px)" : "translate(0, 0)",
              boxShadow:
                hovered === p.title
                  ? "8px 8px 0 var(--ink-shadow)"
                  : "6px 6px 0 var(--ink-shadow)",
            }}
            onMouseEnter={() => setHovered(p.title)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              style={{
                aspectRatio: "16/10",
                background: "color-mix(in oklch, var(--accent-green) 8%, var(--canvas-page))",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "3px solid var(--ink-border)",
              }}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent 0 14px, color-mix(in oklch, var(--ink-body) 6%, transparent) 14px 15px)",
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      fontFamily: "var(--font-mono)",
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: -0.4,
                      color: "color-mix(in oklch, var(--ink-body) 40%, transparent)",
                    }}
                  >
                    {p.title}
                  </div>
                </>
              )}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-body)",
                  background: "color-mix(in oklch, var(--canvas-page) 82%, transparent)",
                  border: "1.5px solid var(--ink-border)",
                  borderRadius: 5,
                  padding: "2px 7px",
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
                  color: "var(--ink-body)",
                  background: "color-mix(in oklch, var(--canvas-page) 82%, transparent)",
                  border: "1.5px solid var(--ink-border)",
                  borderRadius: 5,
                  padding: "2px 7px",
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
                  color: "var(--ink-muted)",
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {p.tech}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 23,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  color: "var(--ink-body)",
                  margin: "0 0 10px",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--ink-body)",
                  opacity: 0.75,
                  margin: "0 0 14px",
                }}
              >
                {p.desc}
              </p>
              <div
                style={{
                  marginBottom: 16,
                  paddingTop: 12,
                  borderTop: "1px solid color-mix(in oklch, var(--ink-body) 14%, transparent)",
                  display: "flex",
                  gap: 10,
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "var(--accent-green-deep)",
                    flexShrink: 0,
                  }}
                >
                  {t("work.value.label")}
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ink-body)", opacity: 0.9 }}>
                  {p.value}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 16,
                  marginTop: "auto",
                }}
              >
                {p.highlights.map((h) => (
                  <span
                    key={h}
                    className="neo-badge"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--fg-on-coral)",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <button
                  className="neo-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    ask(`Tell me more about the ${p.title} project`);
                  }}
                  style={{
                    padding: "6px 16px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-body)",
                    letterSpacing: 0.4,
                  }}
                >
                  {t("agent.projects.details")}
                </button>
                <button
                  className="neo-btn"
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
                    background: "var(--canvas-panel-grey)",
                    color: "var(--ink-body)",
                    letterSpacing: 0.4,
                  }}
                >
                  {t("agent.projects.tech")}
                </button>
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
            {t("agent.projects.chat.label")}
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
            {t("agent.projects.chat.title.p1")}{" "}
            <span
              style={{
                background: "var(--accent-coral)",
                color: "var(--fg-on-coral)",
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
              color: "var(--ink-body)",
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
