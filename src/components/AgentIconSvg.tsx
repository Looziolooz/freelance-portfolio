"use client";

import { type ReactNode } from "react";

type AgentType = "project" | "career" | "business" | "research";

// ── Chatbot base condiviso ──
function ChatbotBase({ children, h }: { children: ReactNode; h: boolean }) {
  const s = h ? 1 : 0.55;
  return (
    <g opacity={s}>
      {/* Antenna */}
      <line x1="40" y1="6" x2="40" y2="14" stroke="var(--accent, #E87F24)" strokeWidth="1.2" strokeLinecap="round" opacity={0.4 * s} />
      <circle cx="40" cy="5" r="1.5" fill="var(--accent, #E87F24)" opacity={0.3 * s} />

      {/* Corpo */}
      <rect x="33" y="34" width="14" height="14" rx="4" fill="var(--accent, #E87F24)" opacity={0.08 * s} stroke="var(--accent, #E87F24)" strokeWidth="0.6" />
      <rect x="33" y="34" width="14" height="6" rx="4" fill="var(--accent, #E87F24)" opacity={0.06 * s} />

      {/* Braccia */}
      <line x1="33" y1="38" x2="27" y2="34" stroke="var(--accent, #E87F24)" strokeWidth="1" strokeLinecap="round" opacity={0.3 * s} />
      <circle cx="27" cy="34" r="1.5" fill="var(--accent, #E87F24)" opacity={0.3 * s} />
      <line x1="47" y1="38" x2="53" y2="34" stroke="var(--accent, #E87F24)" strokeWidth="1" strokeLinecap="round" opacity={0.3 * s} />
      <circle cx="53" cy="34" r="1.5" fill="var(--accent, #E87F24)" opacity={0.3 * s} />

      {/* Testa */}
      <circle cx="40" cy="22" r="12" fill="var(--accent, #E87F24)" opacity={0.1 * s} stroke="var(--accent, #E87F24)" strokeWidth="0.8" />

      {/* Schermo/visore */}
      <rect x="32" y="16" width="16" height="10" rx="2" fill="var(--bg, #FEFDDF)" stroke="var(--fg)" strokeWidth="0.4" opacity={0.12 * s} />

      {/* Ologramma visore */}
      <g opacity={0.7 * s}>
        {children}
      </g>
    </g>
  );
}

// ── ProjectChat: mostra progetti, stack, implementazioni in bubble ──
function ProjectChat({ h }: { h: boolean }) {
  return (
    <ChatbotBase h={h}>
      <g transform="translate(32, 17)">
        {/* Chat bubble */}
        <rect x="0" y="0" width="16" height="8" rx="2" fill="var(--accent, #E87F24)" opacity={0.2} />
        {/* Project card */}
        <rect x="2" y="1" width="5" height="3" rx="0.5" fill="var(--accent, #E87F24)" opacity={h ? 0.5 : 0.2} />
        <rect x="2" y="4.5" width="12" height="0.5" rx="0.2" fill="var(--fg)" opacity={0.15} />
        {/* Stack tag */}
        <rect x="2" y="5.5" width="3" height="1.5" rx="0.3" fill="var(--accent, #E87F24)" opacity={h ? 0.35 : 0.1} />
        <rect x="5.5" y="5.5" width="2" height="1.5" rx="0.3" fill="var(--fg)" opacity={0.1} />
        <rect x="8" y="5.5" width="2.5" height="1.5" rx="0.3" fill="var(--fg)" opacity={0.1} />
      </g>
      {/* Seconda bubble sull'hover */}
      {h && (
        <g transform="translate(34, 10)">
          <rect x="0" y="0" width="12" height="5" rx="2" fill="var(--accent, #E87F24)" opacity="0.15">
            <animate attributeName="opacity" values="0.15;0.25;0.15" dur="2s" repeatCount="indefinite" />
          </rect>
          <line x1="2" y1="1.5" x2="10" y2="1.5" stroke="var(--fg)" strokeWidth="0.4" opacity="0.2" />
          <line x1="2" y1="3" x2="8" y2="3" stroke="var(--fg)" strokeWidth="0.4" opacity="0.15" />
          <rect x="9" y="0.5" width="2" height="1.5" rx="0.3" fill="var(--accent, #E87F24)" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.5s" repeatCount="indefinite" />
          </rect>
        </g>
      )}
      {/* Occhi — entusiasti */}
      <g transform="translate(35, 19)">
        <circle cx="1.5" cy="0" r="1.2" fill="var(--bg, #FEFDDF)" opacity={h ? 0.9 : 0.4} />
        <circle cx="6.5" cy="0" r="1.2" fill="var(--bg, #FEFDDF)" opacity={h ? 0.9 : 0.4} />
        <circle cx="2" cy="-0.2" r="0.6" fill="var(--accent, #E87F24)" opacity={h ? 0.7 : 0.2} />
        <circle cx="7" cy="-0.2" r="0.6" fill="var(--accent, #E87F24)" opacity={h ? 0.7 : 0.2} />
      </g>
      {/* Bocca — parla */}
      <g transform="translate(38, 26)">
        <rect x="0" y="0" width="4" height="1.5" rx="0.5" fill="var(--accent, #E87F24)" opacity={h ? 0.5 : 0.15}>
          {h && <animate attributeName="width" values="4;6;4" dur="0.4s" repeatCount="indefinite" />}
        </rect>
      </g>
      {/* Frecce di caricamento sull'hover */}
      {h && (
        <g transform="translate(30, 12)">
          <path d="M 0 0 L 2 -2 L 4 0" fill="none" stroke="var(--accent, #E87F24)" strokeWidth="0.5" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0;0.5" dur="0.8s" repeatCount="indefinite" />
          </path>
        </g>
      )}
    </ChatbotBase>
  );
}

// ── CareerChat: mostra skill, esperienza, valutazioni ──
function CareerChat({ h }: { h: boolean }) {
  return (
    <ChatbotBase h={h}>
      <g transform="translate(32, 17)">
        {/* Bubble skill */}
        <rect x="0" y="0" width="16" height="8" rx="2" fill="var(--accent, #E87F24)" opacity={h ? 0.2 : 0.08} />
        {/* Skill bars */}
        <rect x="2" y="1" width="8" height="1" rx="0.3" fill="var(--accent, #E87F24)" opacity={h ? 0.5 : 0.15} />
        <rect x="2" y="2.5" width="6" height="1" rx="0.3" fill="var(--accent, #E87F24)" opacity={h ? 0.4 : 0.12} />
        <rect x="2" y="4" width="10" height="1" rx="0.3" fill="var(--accent, #E87F24)" opacity={h ? 0.6 : 0.18} />
        <rect x="2" y="5.5" width="4" height="1" rx="0.3" fill="var(--fg)" opacity={0.1} />
      </g>
      {h && (
        <g transform="translate(34, 10)">
          <rect x="0" y="0" width="14" height="4" rx="2" fill="var(--accent, #E87F24)" opacity="0.12">
            <animate attributeName="opacity" values="0.12;0.22;0.12" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="2" y="0.5" width="6" height="0.5" rx="0.2" fill="var(--fg)" opacity="0.15" />
          <rect x="2" y="1.5" width="3" height="0.5" rx="0.2" fill="var(--fg)" opacity="0.1" />
          <rect x="2" y="2.5" width="4" height="0.5" rx="0.2" fill="var(--fg)" opacity="0.1" />
          <circle cx="11" cy="2" r="1.5" fill="var(--accent, #E87F24)" opacity="0.3">
            <animate attributeName="r" values="1.5;2;1.5" dur="1s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
      {/* Occhi — istruttivi */}
      <g transform="translate(35, 19)">
        <circle cx="1.5" cy="0" r="1.5" fill="var(--bg, #FEFDDF)" opacity={h ? 0.9 : 0.35} />
        <circle cx="6.5" cy="0" r="1.5" fill="var(--bg, #FEFDDF)" opacity={h ? 0.9 : 0.35} />
        <circle cx="2" cy="-0.3" r="0.7" fill="var(--accent, #E87F24)" opacity={h ? 0.7 : 0.2} />
        <circle cx="7" cy="-0.3" r="0.7" fill="var(--accent, #E87F24)" opacity={h ? 0.7 : 0.2} />
      </g>
      {/* Bocca — sorriso istruttivo */}
      <path d="M 37 26 Q 40 28 43 26" fill="none" stroke="var(--accent, #E87F24)" strokeWidth="0.6" opacity={h ? 0.5 : 0.15}>
        {h && <animate attributeName="d" values="M 37 26 Q 40 28 43 26;M 36.5 26 Q 40 28.5 43.5 26;M 37 26 Q 40 28 43 26" dur="1.5s" repeatCount="indefinite" />}
      </path>
    </ChatbotBase>
  );
}

// ── BusinessChat: servizi, prezzi, processo ──
function BusinessChat({ h }: { h: boolean }) {
  return (
    <ChatbotBase h={h}>
      <g transform="translate(32, 17)">
        <rect x="0" y="0" width="16" height="8" rx="2" fill="var(--accent, #E87F24)" opacity={h ? 0.2 : 0.08} />
        {/* Price tag */}
        <rect x="2" y="1" width="12" height="2" rx="0.5" fill="var(--accent, #E87F24)" opacity={h ? 0.35 : 0.1} />
        <text x="4" y="2.5" fontSize="2.5" fill="var(--bg, #FEFDDF)" opacity={h ? 0.7 : 0.2}>€€€</text>
        {/* Service boxes */}
        <rect x="2" y="3.5" width="3.5" height="1.5" rx="0.3" fill="var(--fg)" opacity={h ? 0.2 : 0.06} />
        <rect x="6" y="3.5" width="3.5" height="1.5" rx="0.3" fill="var(--fg)" opacity={h ? 0.2 : 0.06} />
        <rect x="10" y="3.5" width="3.5" height="1.5" rx="0.3" fill="var(--fg)" opacity={h ? 0.2 : 0.06} />
        {/* Handshake */}
        <line x1="4" y1="7" x2="6" y2="7" stroke="var(--accent, #E87F24)" strokeWidth="0.8" opacity={h ? 0.4 : 0.1} />
      </g>
      {h && (
        <g transform="translate(34, 9)">
          <rect x="0" y="0" width="12" height="5" rx="2" fill="var(--accent, #E87F24)" opacity="0.1">
            <animate attributeName="opacity" values="0.1;0.2;0.1" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <line x1="2" y1="1" x2="10" y2="1" stroke="var(--fg)" strokeWidth="0.4" opacity="0.15" />
          <line x1="2" y1="2.5" x2="7" y2="2.5" stroke="var(--fg)" strokeWidth="0.4" opacity="0.1" />
          <rect x="2" y="3.5" width="3" height="0.8" rx="0.2" fill="var(--accent, #E87F24)" opacity="0.3" />
        </g>
      )}
      {/* Occhi — sicuri, socchiusi */}
      <g transform="translate(35, 19)">
        <path d="M 0.5 0 Q 1.5 -0.5 2.5 0" fill="none" stroke="var(--fg)" strokeWidth="0.8" opacity={h ? 0.6 : 0.15} />
        <path d="M 5.5 0 Q 6.5 -0.5 7.5 0" fill="none" stroke="var(--fg)" strokeWidth="0.8" opacity={h ? 0.6 : 0.15} />
      </g>
      {/* Bocca — smirk */}
      <path d="M 38 26 Q 40 27.5 42 26" fill="none" stroke="var(--accent, #E87F24)" strokeWidth="0.7" opacity={h ? 0.5 : 0.15} />
    </ChatbotBase>
  );
}

// ── ResearchChat: confronti, trend, dati ──
function ResearchChat({ h }: { h: boolean }) {
  return (
    <ChatbotBase h={h}>
      <g transform="translate(32, 17)">
        <rect x="0" y="0" width="16" height="8" rx="2" fill="var(--accent, #E87F24)" opacity={h ? 0.2 : 0.08} />
        {/* Comparison */}
        <rect x="2" y="1" width="5.5" height="2.5" rx="0.5" fill="var(--fg)" opacity={h ? 0.15 : 0.05} />
        <rect x="8.5" y="1" width="5.5" height="2.5" rx="0.5" fill="var(--fg)" opacity={h ? 0.15 : 0.05} />
        <text x="3.5" y="2.5" fontSize="2" fill="var(--fg)" opacity={h ? 0.3 : 0.08}>A</text>
        <text x="10" y="2.5" fontSize="2" fill="var(--fg)" opacity={h ? 0.3 : 0.08}>B</text>
        {/* VS */}
        <text x="6.5" y="2.5" fontSize="2.5" fill="var(--accent, #E87F24)" opacity={h ? 0.5 : 0.12}>vs</text>
        {/* Trend line */}
        <polyline points="2,6.5 4,5.5 6,6 8,4.5 10,3 12,4 14,2.5" fill="none" stroke="var(--accent, #E87F24)" strokeWidth="0.6" opacity={h ? 0.4 : 0.08} />
      </g>
      {h && (
        <g transform="translate(44, 8)">
          <circle cx="0" cy="0" r="0.6" fill="var(--accent, #E87F24)" opacity="0.7">
            <animate attributeName="r" values="0.6;1.2;0.6" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
      {/* Occhi — curiosi */}
      <g transform="translate(35, 19)">
        <circle cx="1.5" cy="0" r="1.8" fill="var(--bg, #FEFDDF)" opacity={h ? 0.85 : 0.3} />
        <circle cx="6.5" cy="0" r="1.8" fill="var(--bg, #FEFDDF)" opacity={h ? 0.85 : 0.3} />
        <circle cx="1.8" cy="-0.3" r="0.8" fill="var(--accent, #E87F24)" opacity={h ? 0.7 : 0.2} />
        <circle cx="6.8" cy="-0.3" r="0.8" fill="var(--accent, #E87F24)" opacity={h ? 0.7 : 0.2} />
        <circle cx="1.5" cy="-1.5" r="0.4" fill="var(--accent, #E87F24)" opacity={h ? 0.4 : 0} />
        <circle cx="6.5" cy="-1.5" r="0.4" fill="var(--accent, #E87F24)" opacity={h ? 0.4 : 0} />
      </g>
      {/* Bocca — 'o' di scoperta */}
      <ellipse cx="40" cy="26" rx="1.5" ry="1" fill="var(--accent, #E87F24)" opacity={h ? 0.4 : 0.1}>
        {h && <animate attributeName="ry" values="1;1.5;1" dur="1.5s" repeatCount="indefinite" />}
      </ellipse>
    </ChatbotBase>
  );
}

const AGENTS: Record<AgentType, (props: { h: boolean }) => ReactNode> = {
  project: ProjectChat,
  career: CareerChat,
  business: BusinessChat,
  research: ResearchChat,
};

export default function AgentIconSvg({ type, hovered }: { type: AgentType; hovered: boolean }) {
  const Agent = AGENTS[type];
  return (
    <div style={{ width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
        <defs>
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-1.5px); }
            }
            .float { animation: float 3s ease-in-out infinite; transform-origin: 40px 40px; }
          `}</style>
        </defs>
        <g className="float">
          <Agent h={hovered} />
        </g>
      </svg>
    </div>
  );
}
