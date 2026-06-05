"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import SectionHeader from "@/components/SectionHeader";
import AgentNav from "@/components/AgentNav";
import { useLang } from "@/components/LangProvider";

const TOPICS = [
  {
    title: "AI in Web Development",
    query: "Tell me about AI in web development",
  },
  {
    title: "Modern Frontend Frameworks",
    query: "Compare modern frontend frameworks",
  },
  {
    title: "Cloud Architecture Patterns",
    query: "Explain cloud architecture patterns",
  },
];

export default function ResearchAgentPage() {
  const { t } = useLang();
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tech1, setTech1] = useState("");
  const [tech2, setTech2] = useState("");
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const ask = (q: string) => {
    setCurrentQuestion(`${q} [${Date.now()}]`);
    setTimeout(() => setCurrentQuestion(""), 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      ask(`Provide information about: ${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (tech1.trim() && tech2.trim()) {
      ask(`Compare ${tech1} vs ${tech2}`);
      setTech1("");
      setTech2("");
    }
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
        num={t("agent.research.num")}
        title={t("agent.research.title")}
        meta={t("agent.research.meta")}
      />

      {/* Search + Compare */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          marginBottom: 96,
        }}
      >
        <form onSubmit={handleSearch}>
          <div
            className="neo-card"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1.6,
                color: "var(--ink-muted)",
                marginBottom: 8,
              }}
            >
              {t("agent.research.search.label")}
            </div>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: -0.4,
                color: "var(--ink-body)",
                margin: "0 0 8px",
              }}
            >
              {t("agent.research.search.title")}
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--ink-body)",
                opacity: 0.75,
                margin: "0 0 20px",
              }}
            >
              {t("agent.research.search.desc")}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="neo-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("agent.research.search.placeholder")}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <button
                type="submit"
                className="neo-btn neo-btn-sm"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: 0.4,
                  color: "var(--ink-body)",
                }}
              >
                {t("agent.research.search.btn")}
              </button>
            </div>
          </div>
        </form>

        <form onSubmit={handleCompare}>
          <div
            className="neo-card"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1.6,
                color: "var(--ink-muted)",
                marginBottom: 8,
              }}
            >
              {t("agent.research.compare.label")}
            </div>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: -0.4,
                color: "var(--ink-body)",
                margin: "0 0 8px",
              }}
            >
              {t("agent.research.compare.title")}
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--ink-body)",
                opacity: 0.75,
                margin: "0 0 20px",
              }}
            >
              {t("agent.research.compare.desc")}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <input
                className="neo-input"
                value={tech1}
                onChange={(e) => setTech1(e.target.value)}
                placeholder={t("agent.research.compare.placeholder1")}
                style={{
                  padding: "8px 12px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <input
                className="neo-input"
                value={tech2}
                onChange={(e) => setTech2(e.target.value)}
                placeholder={t("agent.research.compare.placeholder2")}
                style={{
                  padding: "8px 12px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
            </div>
            <button
              type="submit"
              className="neo-btn neo-btn-sm"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: 0.4,
                alignSelf: "flex-start",
                color: "var(--ink-body)",
              }}
            >
              {t("agent.research.compare.btn")}
            </button>
          </div>
        </form>
      </div>

      {/* Topics */}
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
            {t("agent.research.trending.title")}
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
            {t("agent.research.trending.meta")}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
          }}
        >
          {TOPICS.map((topic) => (
            <div
               key={topic.title}
              style={{
                border: "3px solid var(--ink-border)",
                borderRadius: "var(--radius-lg)",
                background: "var(--canvas-panel-yellow)",
                padding: 28,
                display: "flex",
                flexDirection: "column",
                transition:
                  "transform .2s ease-out, box-shadow .2s ease-out",
                transform:
                  hoveredTopic === topic.title
                    ? "translate(-2px, -2px)"
                    : "translate(0, 0)",
                boxShadow:
                  hoveredTopic === topic.title
                    ? "8px 8px 0 var(--ink-shadow)"
                    : "6px 6px 0 var(--ink-shadow)",
              }}
              onMouseEnter={() => setHoveredTopic(topic.title)}
              onMouseLeave={() => setHoveredTopic(null)}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  letterSpacing: -0.3,
                  color: "var(--ink-body)",
                  margin: "0 0 10px",
                }}
              >
                {topic.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "var(--ink-body)",
                  opacity: 0.75,
                  margin: "0 0 20px",
                  flex: 1,
                }}
              >
                {t("agent.research.topic.desc")}
              </p>
              <button
                onClick={() => ask(topic.query)}
                className="neo-btn neo-btn-sm"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: 0.4,
                  alignSelf: "flex-start",
                  color: "var(--ink-body)",
                }}
              >
                {t("agent.research.learn")}
              </button>
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
            {t("agent.research.chat.label")}
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
            {t("agent.research.chat.title.p1")}{" "}
            <span
              style={{
                background: "var(--accent-coral)",
                color: "var(--fg-on-coral)",
                padding: "0 0.08em",
              }}
            >
              {t("agent.research.chat.title.highlight")}
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
            {t("agent.research.chat.desc")}
          </p>
        </div>
        <div>
          <AgentChat
            agentType="research"
            initialMessage={t("agent.chat.research")}
            agentInitials="LH"
            agentName="ricerca"
            directQuestion={currentQuestion}
          />
        </div>
      </div>
    </section>
    </>
  );
}
