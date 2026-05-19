"use client";

import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";

const metaItems = (t: (k: string) => string) => [
  { label: t("about.meta.location"), value: t("about.meta.location.val") },
  { label: t("about.meta.works"), value: t("about.meta.works.val") },
  { label: t("about.meta.langs"), value: t("about.meta.langs.val") },
  { label: t("about.meta.edu"), value: t("about.meta.edu.val") },
];

export default function About() {
  const { t } = useLang();

  return (
    <section
      id="about"
      style={{
        padding: "clamp(80px, 8vw, 140px) clamp(24px, 4vw, 60px)",
        borderTop: "1px solid var(--line)",
      }}
    >
      <SectionHeader
        num={t("about.num")}
        title={t("about.title")}
        meta={t("about.meta")}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 60,
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "clamp(24px, 3vw, 42px)",
              lineHeight: 1.25,
              letterSpacing: -0.8,
              fontWeight: 500,
              color: "var(--fg)",
              margin: 0,
            }}
          >
            {t("about.lede.p1")}{" "}
            <span
              style={{
                background: "var(--accent)",
                color: "var(--accentInk)",
                padding: "0 0.08em",
              }}
            >
              {t("about.lede.highlight")}
            </span>{" "}
            {t("about.lede.p2")}
            <br />
            {t("about.lede.p3")}
          </p>
          <div
            style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
              paddingTop: 24,
              borderTop: "1px solid var(--line)",
            }}
          >
            {metaItems(t).map((m) => (
              <div key={m.label}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1.4,
                    color: "var(--muted)",
                    marginBottom: 8,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{ fontSize: 17, color: "var(--fg)", fontWeight: 500 }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: "var(--fg)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <p>{t("about.body.p1")}</p>
          <p style={{ color: "var(--muted)" }}>{t("about.body.p2")}</p>
          <p>{t("about.body.p3")}</p>
        </div>
      </div>
    </section>
  );
}
