import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import HeroMotion from "@/components/HeroMotion";
import WorkEditorial from "@/components/WorkEditorial";
import TechStack from "@/components/TechStack";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollReveal from "@/components/ScrollReveal";
import SectorEntry from "@/components/SectorEntry";

// Below-the-fold sections are code-split out of the initial bundle to cut the
// first-load JS (and TBT). ssr stays on (default) so the HTML is still
// server-rendered — no SEO/LCP/CLS regression, just deferred hydration JS.
const Trust = dynamic(() => import("@/components/Trust"));
const LeadMagnet = dynamic(() => import("@/components/LeadMagnet"));
const CinematicFooter = dynamic(() => import("@/components/CinematicFooter"));

// La home in sei fermate: hero → settori → prova → strumenti → fiducia →
// audit. Prima erano nove, con tre sistemi di navigazione accesi insieme
// (barra, binario laterale, quattro porte) che non condividevano un'etichetta.
//
// Cosa se n'e' andato e dove vive adesso:
// - WayfindingNav: il binario laterale duplicava la barra con parole sue.
// - SkillsList: le quattro porte-disciplina chiedevano al visitatore di
//   riconoscersi in un nostro mestiere. SectorEntry gli chiede che attivita'
//   ha, e porta al catalogo (la pagina che prima non aveva una porta in home).
// - Plans: i tre ingaggi vivono gia' in /prezzi, raggiungibile dalla barra.
// - Faq: vive in /prezzi e nelle schede soluzione, dove le domande nascono.
// I componenti restano su disco e le loro chiavi nel dizionario.
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <HeroMotion />
      {/* La domanda a cui chi arriva sa gia' rispondere: che attivita' hai. */}
      <SectorEntry />
      {/* La prova prima delle promesse: griglia editoriale dei lavori. */}
      <WorkEditorial />
      {/* …and immediately what they are built with. Fills the slot the MacBook
          showcase used to occupy: demos first, then the toolkit behind them. */}
      <TechStack />
      <main className="container">
        <ScrollReveal><Trust /></ScrollReveal>
        <ScrollReveal><LeadMagnet /></ScrollReveal>
      </main>
      <CinematicFooter />
    </>
  );
}
