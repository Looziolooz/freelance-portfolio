"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/components/LangProvider";
import { SV_CSS } from "@/app/servizi/shared-css";

// Chi sono: tre capoversi onesti e una chiamata. Niente timeline inventate,
// niente loghi di aziende: la prova del lavoro sta in /work, questa pagina
// dice solo chi risponde alle email.
export default function Page() {
  const { t } = useLang();
  const paragraphs = t("chisono.body").split("|").map((p) => p.trim());
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SV_CSS }} />
      <Nav />
      <main className="container sv">
        <header className="sv-head">
          <span className="ct-kicker">{t("chisono.label")}</span>
          <h1 className="ct-title">{t("chisono.title")}</h1>
          <p className="sv-lede">{t("chisono.sub")}</p>
        </header>
        <section className="sv-sec" aria-label={t("chisono.title")} style={{ maxWidth: 660 }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: "clamp(16px, 1.6vw, 17.5px)", lineHeight: 1.68, margin: i ? "16px 0 0" : 0 }}>
              {p}
            </p>
          ))}
          <p style={{ margin: "26px 0 0" }}>
            <Link href="/contatti" className="neo-btn" style={{ textDecoration: "none", color: "var(--ink-body)", padding: "12px 24px", fontSize: 15 }}>
              {t("chisono.cta")} →
            </Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
