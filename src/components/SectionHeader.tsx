"use client";

import { useState } from "react";
import CursorTrack from "./CursorTrack";
import Typewriter from "./Typewriter";

// One section header for the whole site, built on the system .section-head so
// the signature coral number badge appears consistently. The large animated
// title is kept (brand voice) via a font-size override on .section-head__title.
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
    <div className="section-head">
      <span className="section-head__num">{num}</span>
      <h2 className="section-head__title" style={{ fontSize: "clamp(28px, 5.5vw, 80px)" }}>
        {typed ? (
          <CursorTrack strength={10}>{title}</CursorTrack>
        ) : (
          <Typewriter text={title} speed={35} onDone={() => setTyped(true)} />
        )}
      </h2>
      {meta && (
        <span className="label" style={{ alignSelf: "end", textAlign: "right" }}>
          {meta}
        </span>
      )}
    </div>
  );
}
