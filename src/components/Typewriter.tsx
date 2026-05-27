"use client";

import { useEffect, useRef, useState } from "react";

export default function Typewriter({ text, speed = 45, className, onDone }: { text: string; speed?: number; className?: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const obsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!obsRef.current || started.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          started.current = true;
          let i = 0;
          const fn = () => {
            if (i > text.length) { setDone(true); onDone?.(); return; }
            setDisplayed(text.slice(0, i));
            i++;
            const ch = text[i - 1];
            setTimeout(fn, ch === "." || ch === "," || ch === "!" ? speed * 6 : speed);
          };
          fn();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(obsRef.current);
    return () => obs.disconnect();
  }, [text, speed]);

  const lines = displayed.split("\n");

  return (
    <div ref={obsRef} className={className}>
      {lines.map((l, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {l}
        </span>
      ))}
      <span
        className={done ? "" : "caret-blink"}
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 300,
          opacity: done ? 0 : 1,
          marginLeft: 2,
        }}
      >
        ▎
      </span>
    </div>
  );
}
