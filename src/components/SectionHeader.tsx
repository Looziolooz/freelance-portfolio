"use client";

import { useState } from "react";
import CursorTrack from "./CursorTrack";
import Typewriter from "./Typewriter";

export default function SectionHeader({
  num,
  title,
  meta,
}: {
  num: string;
  title: string;
  meta?: string;
}) {
  const [typed, setTyped] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr auto",
        alignItems: "flex-end",
        gap: 24,
        padding: "0 0 28px",
        borderBottom: "3px solid var(--ink-border)",
        marginBottom: 56,
      }}
    >
      <div className="label" style={{ fontWeight: 400 }}>
        {num}
      </div>
      <h2
        style={{
          margin: 0,
          fontSize: "clamp(28px, 5.5vw, 88px)",
          letterSpacing: -2,
          fontWeight: 500,
          lineHeight: 0.98,
          overflowWrap: "break-word",
          hyphens: "auto",
        }}
      >
        {typed ? (
          <CursorTrack strength={10}>{title}</CursorTrack>
        ) : (
          <Typewriter text={title} speed={35} onDone={() => setTyped(true)} />
        )}
      </h2>
      {meta && (
        <div className="label" style={{ textAlign: "right", fontSize: 10 }}>
          {meta}
        </div>
      )}
    </div>
  );
}
