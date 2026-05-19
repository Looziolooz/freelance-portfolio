"use client";

import { useState, useEffect } from "react";
import { useLang } from "./LangProvider";

const dots = (t: (k: string) => string) => [
  { num: "40+", label: t("hero.stat.workflows") },
  { num: "10", label: t("hero.stat.projects") },
  { num: "6a", label: t("hero.stat.web") },
  { num: "2026", label: t("hero.stat.bookings") },
];

export default function Hero() {
  const [time, setTime] = useState("");
  const { t, lang } = useLang();

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString(
          lang === "sv" ? "sv-SE" : lang === "en" ? "en-GB" : "it-IT",
          { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Stockholm" }
        )
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lang]);

  return (
    <section
      id="top"
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(360px, 460px)",
        gap: 0,
        padding: "120px 0 40px",
        position: "relative",
      }}
    >
      <div
        style={{
          padding: "60px 48px 40px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 60,
          minWidth: 0,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1.8,
              color: "var(--muted)",
              marginBottom: 32,
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  marginRight: 8,
                  verticalAlign: "middle",
                  boxShadow: "0 0 8px var(--accent)",
                }}
              />
              {t("hero.available")}
            </span>
            <span>{t("hero.version")}</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 112px)",
              lineHeight: 0.95,
              fontWeight: 500,
              letterSpacing: -3,
              margin: 0,
              color: "var(--fg)",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              hyphens: "auto",
            }}
          >
            {t("hero.orchestro")}
            <br />
            <span
              style={{
                background: "var(--accent)",
                color: "var(--accentInk)",
                padding: "0.04em 0.08em",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                lineHeight: 1.1,
              }}
            >
              {t("hero.sistemi")}
            </span>{" "}
            {t("hero.che")}
            <br />
            {t("hero.fanno")}
            <br />
            {t("hero.noioso")}
          </h1>
          <div
            style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 8 }}
          >
            <span
              style={{
                padding: "9px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                background: "var(--fg)",
                color: "var(--bg)",
                borderRadius: 999,
                letterSpacing: 0.3,
              }}
            >
              {t("hero.pill.ai")}
            </span>
            <span
              style={{
                padding: "9px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--fg)",
                letterSpacing: 0.3,
              }}
            >
              {t("hero.pill.n8n")}
            </span>
            <span
              style={{
                padding: "9px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--fg)",
                letterSpacing: 0.3,
              }}
            >
              {t("hero.pill.designer")}
            </span>
            <span
              style={{
                padding: "9px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--fg)",
                letterSpacing: 0.3,
              }}
            >
              {t("hero.pill.scraper")}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 40,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          {dots(t).map((s) => (
            <div
              key={s.label}
              style={{
                borderTop: "1px solid var(--fg)",
                paddingTop: 12,
                minWidth: 130,
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: -1,
                  color: "var(--fg)",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                  color: "var(--muted)",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "100px 48px 0 0",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "min(clamp(300px, 28vw, 480px), 100%)",
            aspectRatio: "1/1",
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
            background: "var(--bg)",
            flexShrink: 0,
            border: "3px solid var(--fg)",
          }}
        >
          <img
            src="/lorenzo.webp"
            alt="Lorenzo Dastoli"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%) contrast(1.08) brightness(1.04)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.5,
              mixBlendMode: "overlay",
              pointerEvents: "none",
              borderRadius: "50%",
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 24,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg)",
            background: "color-mix(in oklch, var(--bg) 85%, transparent)",
            padding: "6px 14px",
            borderRadius: 999,
            letterSpacing: 0.8,
            border: "1px solid var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          STO · {time}
        </div>
      </div>
    </section>
  );
}
