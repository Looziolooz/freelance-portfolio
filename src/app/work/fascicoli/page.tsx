"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import BrandDeckList from "@/components/BrandDeckList";
import ScrollProgress from "@/components/ScrollProgress";
import ContactClose from "@/components/ContactClose";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/components/LangProvider";
import { DISCIPLINES, disciplineProjects } from "@/lib/disciplines";

// L'archivio dei manuali di marca: ogni fascicolo si sfoglia sul posto, una
// pagina alla volta.
//
// Sta sotto /work e non sotto /servizi perché è un corpo di lavoro, non
// un'offerta. La pagina che vende il marchio è /servizi/marchio e rimanda qui
// per la prova; comprimere diciassette manuali dentro una pagina commerciale
// avrebbe sprecato la cosa migliore che il sito ha da mostrare.
export default function FascicoliPage() {
  const { t } = useLang();
  const marchio = DISCIPLINES.find((d) => d.id === "marchio")!;
  const items = disciplineProjects(marchio);

  return (
    <>
      <ScrollProgress />
      <Nav />
      <header
        className="container"
        style={{ paddingTop: "calc(var(--topbar-h) + clamp(44px, 7vw, 96px))" }}
      >
        <div className="ct-head">
          <Link
            href={`/servizi/${marchio.slug}`}
            className="ct-kicker"
            style={{ textDecoration: "none", width: "fit-content" }}
          >
            {t("disc.marchio.label")} ←
          </Link>
          <h1 className="ct-title">{t("fascicoli.title")}</h1>
          <p className="ct-sub">{t("fascicoli.sub")}</p>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-body)",
              opacity: 0.6,
            }}
          >
            {items.length} {t("disc.many")}
          </span>
        </div>
      </header>

      <BrandDeckList items={items} />

      <ContactClose />
      <SiteFooter />
    </>
  );
}
