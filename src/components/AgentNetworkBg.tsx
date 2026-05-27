"use client";

export default function AgentNetworkBg() {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.2,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <defs>
        <linearGradient id="net-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E87F24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFC947" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="net-grad-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFC947" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E87F24" stopOpacity="0.2" />
        </linearGradient>
        <style>{`
          @keyframes pulse-node {
            0%, 100% { r: 4; opacity: 0.4; }
            50% { r: 6; opacity: 0.8; }
          }
          @keyframes pulse-ring {
            0%, 100% { r: 9; opacity: 0.15; }
            50% { r: 14; opacity: 0.35; }
          }
          @keyframes pulse-ring2 {
            0%, 100% { r: 14; opacity: 0.08; }
            50% { r: 22; opacity: 0.2; }
          }
          @keyframes data-flow {
            to { stroke-dashoffset: -60; }
          }
          @keyframes data-flow-reverse {
            to { stroke-dashoffset: 60; }
          }
          @keyframes node-glow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.5; }
          }
          .net-path { fill: none; stroke: url(#net-grad); stroke-width: 1.5; stroke-dasharray: 6 8; animation: data-flow 3s linear infinite; }
          .net-path-rev { fill: none; stroke: url(#net-grad-dark); stroke-width: 1.5; stroke-dasharray: 4 10; animation: data-flow-reverse 4s linear infinite; }
          .net-node { fill: var(--accent, #E87F24); animation: pulse-node 3s ease-in-out infinite; }
          .net-ring { fill: none; stroke: var(--accent, #E87F24); stroke-width: 1; animation: pulse-ring 3s ease-in-out infinite; }
          .net-ring2 { fill: none; stroke: var(--accent, #E87F24); stroke-width: 0.5; animation: pulse-ring2 4s ease-in-out infinite; }
          .net-glow { fill: var(--accent, #E87F24); animation: node-glow 2s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Connection lines */}
      <path className="net-path" d="M 180 200 Q 350 120 500 280" />
      <path className="net-path-rev" d="M 500 280 Q 650 380 800 200" />
      <path className="net-path" d="M 800 200 Q 950 280 1050 180" />
      <path className="net-path-rev" d="M 180 200 Q 250 350 400 400" />
      <path className="net-path" d="M 400 400 Q 550 450 700 380" />
      <path className="net-path-rev" d="M 700 380 Q 850 420 1050 350" />
      <path className="net-path" d="M 180 200 Q 400 480 700 380" />
      <path className="net-path-rev" d="M 500 280 Q 750 150 1050 180" />
      <path className="net-path" d="M 400 400 Q 600 200 800 200" />
      <path className="net-path-rev" d="M 800 200 Q 900 350 1050 350" />

      {/* Data packets — small moving dots along paths */}
      <circle className="net-glow" cx="180" cy="200"><animateMotion dur="3s" repeatCount="indefinite" path="M 180 200 Q 350 120 500 280" /></circle>
      <circle className="net-glow" cx="1050" cy="180"><animateMotion dur="4s" repeatCount="indefinite" path="M 1050 180 Q 950 280 800 200" /></circle>
      <circle className="net-glow" cx="400" cy="400"><animateMotion dur="3s" repeatCount="indefinite" path="M 400 400 Q 550 450 700 380" /></circle>
      <circle className="net-glow" cx="700" cy="380"><animateMotion dur="4s" repeatCount="indefinite" path="M 700 380 Q 850 420 1050 350" /></circle>
      <circle className="net-glow" cx="500" cy="280"><animateMotion dur="3s" repeatCount="indefinite" path="M 500 280 Q 750 150 1050 180" /></circle>

      {/* Nodes */}
      <g>
        <circle className="net-ring2" cx="180" cy="200" />
        <circle className="net-ring" cx="180" cy="200" />
        <circle className="net-node" cx="180" cy="200" />
      </g>
      <g>
        <circle className="net-ring2" cx="500" cy="280" />
        <circle className="net-ring" cx="500" cy="280" />
        <circle className="net-node" cx="500" cy="280" style={{ animationDelay: "-0.7s" }} />
      </g>
      <g>
        <circle className="net-ring2" cx="800" cy="200" />
        <circle className="net-ring" cx="800" cy="200" />
        <circle className="net-node" cx="800" cy="200" style={{ animationDelay: "-1.4s" }} />
      </g>
      <g>
        <circle className="net-ring2" cx="1050" cy="180" />
        <circle className="net-ring" cx="1050" cy="180" />
        <circle className="net-node" cx="1050" cy="180" style={{ animationDelay: "-0.3s" }} />
      </g>
      <g>
        <circle className="net-ring2" cx="400" cy="400" />
        <circle className="net-ring" cx="400" cy="400" />
        <circle className="net-node" cx="400" cy="400" style={{ animationDelay: "-1s" }} />
      </g>
      <g>
        <circle className="net-ring2" cx="700" cy="380" />
        <circle className="net-ring" cx="700" cy="380" />
        <circle className="net-node" cx="700" cy="380" style={{ animationDelay: "-1.8s" }} />
      </g>
      <g>
        <circle className="net-ring2" cx="1050" cy="350" />
        <circle className="net-ring" cx="1050" cy="350" />
        <circle className="net-node" cx="1050" cy="350" style={{ animationDelay: "-0.5s" }} />
      </g>
    </svg>
  );
}
