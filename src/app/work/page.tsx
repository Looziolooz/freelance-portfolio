"use client";

import Nav from "@/components/Nav";
import ProjectGallery from "@/components/ProjectGallery";
import ScrollProgress from "@/components/ScrollProgress";
import ContactClose from "@/components/ContactClose";
import { useLang } from "@/components/LangProvider";

// Dedicated "Lavori" page. A card grid: each card hover-plays its preview clip
// (with a cursor-following "demo" chip) and clicks through to the in-site demo
// viewer at /work/[slug]. A light page header gives the fixed nav a legible
// backdrop. The booking closer (ContactClose, #contact) sits below — after
// browsing the work, you can book a discovery call. No CinematicFooter here: it
// would just repeat the same CTAs.
export default function WorkPage() {
  const { t } = useLang();

  return (
    <>
      <ScrollProgress />
      <Nav />
      <header
        className="container"
        style={{ paddingTop: "calc(var(--topbar-h) + clamp(44px, 7vw, 96px))" }}
      >
        <div className="ct-head">
          <span className="ct-kicker">{t("nav.work")}</span>
          <h1 className="ct-title">{t("work.title")}</h1>
          <p className="ct-sub">{t("work.meta")}</p>
        </div>
      </header>
      <ProjectGallery />
      <ContactClose />
    </>
  );
}
