"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "./LangProvider";
import ParallaxIndex from "./ParallaxIndex";
import CursorTrack from "./CursorTrack";
import Typewriter from "./Typewriter";
import AgentNetworkBg from "./AgentNetworkBg";
import AgentIconSvg from "./AgentIconSvg";

const AGENTS = [
  {
    iconType: "project" as const,
    name: "ProjectAgent",
    roleKey: "agent.showcase.role.project",
    descKey: "agent.showcase.desc.project",
    href: "/agents/projects",
  },
  {
    iconType: "career" as const,
    name: "CareerAgent",
    roleKey: "agent.showcase.role.career",
    descKey: "agent.showcase.desc.career",
    href: "/agents/career",
  },
  {
    iconType: "business" as const,
    name: "BusinessAdvisor",
    roleKey: "agent.showcase.role.client",
    descKey: "agent.showcase.desc.client",
    href: "/agents/services",
  },
  {
    iconType: "research" as const,
    name: "ResearchAgent",
    roleKey: "agent.showcase.role.research",
    descKey: "agent.showcase.desc.research",
    href: "/agents/research",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      delay: 0.15 + i * 0.12,
    },
  }),
};

function AgentShowcaseCard({ a, i }: { a: typeof AGENTS[number]; i: number }) {
  const { t } = useLang();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={a.href}
      custom={i}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.98 }}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "color-mix(in oklch, var(--bg) 70%, transparent)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        padding: 32,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <AgentIconSvg type={a.iconType} hovered={hovered} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--accent)",
          letterSpacing: 1.6,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {t(a.roleKey)}
      </div>
      <h3
        style={{
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: -0.4,
          color: "var(--fg)",
          margin: "0 0 8px",
        }}
      >
        {a.name}
      </h3>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: "var(--fg)",
          opacity: 0.65,
          margin: 0,
        }}
      >
        {t(a.descKey)}
      </p>
      <motion.span
        style={{
          position: "absolute",
          bottom: 24,
          right: 28,
          fontSize: 18,
          color: "var(--fg)",
          display: "inline-block",
        }}
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

export default function AgentsShowcase() {
  const { t } = useLang();
  const [typed, setTyped] = useState(false);

  return (
    <section
      id="agents"
      className="section-indexed"
      style={{
        padding: "clamp(100px, 10vw, 160px) 0",
        borderTop: "1px solid var(--line)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AgentNetworkBg />
      <ParallaxIndex>05</ParallaxIndex>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr auto",
            alignItems: "flex-end",
            gap: 24,
            padding: "0 0 28px",
            borderBottom: "1px solid var(--fg)",
            marginBottom: 56,
          }}
        >
          <div className="label" style={{ fontWeight: 400 }}>
            {t("agent.showcase.num")}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 5.5vw, 88px)",
              letterSpacing: -2,
              fontWeight: 500,
              lineHeight: 0.98,
            }}
          >
            {typed ? (
              <CursorTrack strength={10}>{t("agent.showcase.title")}</CursorTrack>
            ) : (
              <Typewriter text={t("agent.showcase.title")} speed={35} onDone={() => setTyped(true)} />
            )}
          </h2>
          <div className="label" style={{ textAlign: "right", fontSize: 10 }}>
            {t("agent.showcase.meta")}
          </div>
        </div>

        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {AGENTS.map((a, i) => (
            <AgentShowcaseCard key={a.name} a={a} i={i} />
          ))}
        </motion.div>

        <motion.div
          style={{
            textAlign: "center",
            marginTop: 48,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, type: "spring", stiffness: 60 }}
        >
          <motion.a
            href="/agents"
            className="reticule-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              letterSpacing: 0.5,
              color: "var(--fg)",
              textDecoration: "none",
              padding: "12px 24px",
              border: "1px solid var(--line)",
              borderRadius: 4,
            }}
            whileHover={{ gap: 14 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            Explore all agents
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
