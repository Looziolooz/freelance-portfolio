"use client";

import { useEffect, useState } from "react";
import AgentChat from "./AgentChat";
import { useLang } from "./LangProvider";

// The single, site-wide assistant. One floating button on every page opens one
// chat — no specialists to choose between. Other parts of the site can open it
// by dispatching window event "open-assistant" (e.g. the homepage CTA).
export default function AssistantWidget() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("open-assistant", openIt);
    return () => window.removeEventListener("open-assistant", openIt);
  }, []);

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={t("assistant.label")}
          style={{
            position: "fixed",
            bottom: 84,
            right: "clamp(12px, 2.5vw, 24px)",
            zIndex: 70,
            width: "min(384px, calc(100vw - 24px))",
          }}
        >
          <AgentChat
            agentType="welcome"
            initialMessage={t("agent.chat.welcome")}
            agentInitials="LH"
            agentName={t("assistant.label")}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t("assistant.close") : t("assistant.toggle")}
        aria-expanded={open}
        style={{
          position: "fixed",
          bottom: "clamp(12px, 2.5vw, 24px)",
          right: "clamp(12px, 2.5vw, 24px)",
          zIndex: 71,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "11px 18px",
          background: "var(--accent-green)",
          color: "#fff",
          border: "3px solid var(--ink-border)",
          borderRadius: "var(--radius-full)",
          boxShadow: "4px 4px 0 var(--ink-shadow)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.3,
          cursor: "pointer",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#fff",
            border: "1.5px solid var(--ink-border)",
            flexShrink: 0,
          }}
        />
        {open ? t("assistant.close") : t("assistant.label")}
      </button>
    </>
  );
}
