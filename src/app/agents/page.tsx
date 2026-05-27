"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import SectionHeader from "@/components/SectionHeader";
import AgentNav from "@/components/AgentNav";
import { useLang } from "@/components/LangProvider";
import ParallaxIndex from "@/components/ParallaxIndex";
import CursorTrack from "@/components/CursorTrack";
import Typewriter from "@/components/Typewriter";
import ScrollReveal from "@/components/ScrollReveal";

const AGENTS = [
  {
    initials: "PA",
    name: "ProjectAgent",
    roleKey: "agent.hub.role.project",
    descKey: "agent.hub.desc.project",
    href: "/agents/projects",
  },
  {
    initials: "CA",
    name: "CareerAgent",
    roleKey: "agent.hub.role.career",
    descKey: "agent.hub.desc.career",
    href: "/agents/career",
  },
  {
    initials: "BA",
    name: "BusinessAdvisor",
    roleKey: "agent.hub.role.client",
    descKey: "agent.hub.desc.client",
    href: "/agents/services",
  },
  {
    initials: "RA",
    name: "ResearchAgent",
    roleKey: "agent.hub.role.research",
    descKey: "agent.hub.desc.research",
    href: "/agents/research",
  },
];

function AgentCard({ a, idx }: { a: typeof AGENTS[number]; idx: number }) {
  const { t } = useLang();
  const [hover, setHover] = useState(false);

  return (
    <a
      href={a.href}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="reticule-link"
    >
      <div
        className={`reveal reveal-d${(idx % 5) + 1}`}
        style={{
          border: "1px solid var(--line)",
          borderRadius: 4,
          background: "var(--panel)",
          display: "flex",
          flexDirection: "column",
          padding: 32,
          transition: "transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s",
          transform: hover ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hover
            ? "0 20px 40px -20px color-mix(in oklch, var(--fg) 25%, transparent)"
            : "0 0 0 transparent",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: hover ? "var(--accent)" : "color-mix(in oklch, var(--accent) 60%, var(--bg))",
            color: "var(--accentInk)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 20,
            transition: "background .3s, transform .4s cubic-bezier(.22,1,.36,1)",
            transform: hover ? "scale(1.08) rotate(-6deg)" : "scale(1) rotate(0)",
          }}
        >
          {a.initials}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--accent)",
            letterSpacing: 1.6,
            textTransform: "uppercase",
            marginBottom: 6,
            transition: "color .3s",
          }}
        >
          {t(a.roleKey)}
        </div>
        <h3
          style={{
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: -0.4,
            color: "var(--fg)",
            margin: "0 0 10px",
          }}
        >
          <CursorTrack strength={6}>{a.name}</CursorTrack>
        </h3>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            color: "var(--fg)",
            opacity: 0.75,
            margin: 0,
          }}
        >
          {t(a.descKey)}
        </p>
        <span
          className="arrow-blink"
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 24,
            right: 28,
            fontSize: 16,
          }}
        >
          →
        </span>
      </div>
    </a>
  );
}

export default function AgentsHub() {
  const { t } = useLang();
  const [typed, setTyped] = useState(false);

  return (
    <>
      <AgentNav />
      <section
        className="section-indexed"
        style={{
          padding: "clamp(80px, 8vw, 140px) 0",
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <ParallaxIndex>01</ParallaxIndex>
        <SectionHeader
          num={t("agent.hub.num")}
          title={t("agent.hub.title")}
          meta={t("agent.hub.meta")}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginBottom: 96,
          }}
        >
          {AGENTS.map((a, i) => (
            <AgentCard key={a.name} a={a} idx={i} />
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
          <ScrollReveal>
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
                {t("agent.hub.chat.label")}
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
                {typed ? (
                  <>
                    <CursorTrack strength={10}>
                      {t("agent.hub.chat.title.p1")}{" "}
                    </CursorTrack>
                    <span
                      style={{
                        background: "var(--accent)",
                        color: "var(--accentInk)",
                        padding: "0 0.08em",
                      }}
                    >
                      {t("agent.hub.chat.title.highlight")}
                    </span>
                  </>
                ) : (
                  <Typewriter
                    text={t("agent.hub.chat.title.p1") + " " + t("agent.hub.chat.title.highlight")}
                    speed={40}
                    onDone={() => setTyped(true)}
                  />
                )}
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
                {t("agent.hub.chat.desc")}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal className="reveal reveal-d2">
            <div style={{ position: "relative" }}>
              <div
                className="reticule-corners"
                aria-hidden="true"
                style={{ zIndex: 1, color: "var(--accent)", pointerEvents: "none" }}
              >
                <span /><span /><span /><span />
              </div>
              <AgentChat
                agentType="welcome"
                initialMessage={t("agent.chat.welcome")}
                agentInitials="WA"
                agentName="WelcomeAgent"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
