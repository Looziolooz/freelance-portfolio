"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "./LangProvider";
import ParallaxIndex from "./ParallaxIndex";
import CursorTrack from "./CursorTrack";
import Typewriter from "./Typewriter";
import AgentNetworkBg from "./AgentNetworkBg";

// One assistant, not a wall of specialists. This band introduces it and opens
// the site-wide widget (window "open-assistant"), with /agents as the no-JS
// fallback page.
function openAssistant() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("open-assistant"));
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
          className="head-3col"
          style={{
            padding: "0 0 28px",
            borderBottom: "1px solid var(--fg)",
            marginBottom: 48,
          }}
        >
          <div className="label" style={{ fontWeight: 400 }}>
            {t("home.assist.tag")}
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 72px)",
              letterSpacing: "-0.02em",
              fontWeight: 500,
              lineHeight: 1.0,
            }}
          >
            {typed ? (
              <CursorTrack strength={10}>{t("home.assist.title")}</CursorTrack>
            ) : (
              <Typewriter text={t("home.assist.title")} speed={35} onDone={() => setTyped(true)} />
            )}
          </h2>
          <div className="label head-3col__meta" style={{ textAlign: "right", fontSize: 10 }}>
            {t("home.svc.agents.title")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 32,
            maxWidth: 760,
          }}
        >
          <p
            style={{
              margin: 0,
              flex: "1 1 360px",
              fontSize: "var(--fs-lg)",
              lineHeight: "var(--lh-loose)",
              color: "var(--fg)",
              opacity: 0.85,
            }}
          >
            {t("home.assist.body")}
          </p>
          <motion.button
            type="button"
            onClick={openAssistant}
            whileHover={{ y: -2 }}
            whileTap={{ y: 2 }}
            className="neo-btn"
            style={{
              flexShrink: 0,
              padding: "13px 24px",
              background: "var(--accent-green)",
              color: "#fff",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              letterSpacing: 0.3,
            }}
          >
            {t("home.assist.cta")} →
          </motion.button>
        </div>
      </div>
    </section>
  );
}
