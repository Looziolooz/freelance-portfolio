"use client";

import Nav from "@/components/Nav";
import AgentChat from "@/components/AgentChat";
import SectionHeader from "@/components/SectionHeader";
import { useLang } from "@/components/LangProvider";

// One assistant. The site-wide widget is the main way in; this page is the
// dedicated, linkable home for it (and the no-JS fallback for the homepage CTA).
export default function AgentsPage() {
  const { t } = useLang();

  return (
    <>
      <Nav />
      <main
        className="container"
        style={{
          paddingTop: "calc(var(--topbar-h) + 48px)",
          paddingBottom: 96,
          maxWidth: 820,
        }}
      >
        <SectionHeader
          num={t("home.assist.tag")}
          title={t("home.assist.title")}
          meta={t("home.svc.agents.title")}
        />
        <p
          style={{
            fontSize: "var(--fs-lg)",
            lineHeight: "var(--lh-loose)",
            color: "var(--fg)",
            opacity: 0.85,
            maxWidth: 640,
            margin: "0 0 20px",
          }}
        >
          {t("home.assist.body")}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", margin: "0 0 32px" }}>
          <span className="cap-pill cap-pill--solid" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>
            <span className="ping-host" style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff" }} />
            </span>
            {t("agent.chat.online")}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-muted)" }}>
            Risponde in tempo reale · IT · EN · SV
          </span>
        </div>
        <AgentChat
          agentType="welcome"
          initialMessage={t("agent.chat.welcome")}
          agentInitials="LH"
          agentName={t("assistant.label")}
        />
      </main>
    </>
  );
}
