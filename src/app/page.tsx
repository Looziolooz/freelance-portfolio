import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import HeroMotion from "@/components/HeroMotion";
import WorkEditorial from "@/components/WorkEditorial";
import TechStack from "@/components/TechStack";
import ScrollProgress from "@/components/ScrollProgress";
import WayfindingNav from "@/components/WayfindingNav";
import ScrollReveal from "@/components/ScrollReveal";
import SkillsList from "@/components/SkillsList";

// Below-the-fold sections are code-split out of the initial bundle to cut the
// first-load JS (and TBT). ssr stays on (default) so the HTML is still
// server-rendered — no SEO/LCP/CLS regression, just deferred hydration JS.
const Trust = dynamic(() => import("@/components/Trust"));
const Plans = dynamic(() => import("@/components/Plans"));
const Faq = dynamic(() => import("@/components/Faq"));
const LeadMagnet = dynamic(() => import("@/components/LeadMagnet"));
const CinematicFooter = dynamic(() => import("@/components/CinematicFooter"));


export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <WayfindingNav />
      <HeroMotion />
      {/* Five doors right under the hero: the entry crossing the viewport
          centre lights up, and each one is a real link. */}
      <SkillsList />
      {/* La prova prima delle promesse: i lavori stanno subito sotto le
          quattro porte. Griglia editoriale, non piu' galleria orizzontale
          bloccata: si legge tutta in una scrollata invece di costringere a
          trascinare, e le due card larghe danno il ritmo. */}
      <WorkEditorial />
      {/* …and immediately what they are built with. Fills the slot the MacBook
          showcase used to occupy: demos first, then the toolkit behind them. */}
      <TechStack />
      <main className="container">
        {/* Conversion funnel: hero → doors (the four disciplines) → trust (proof) →
            method/pricing (the offer) → FAQ (answer objections) → lead magnet
            (capture) → final CTA (footer). The selected-works viewer lives on its
            own /work page (linked from the nav + hero CTA). */}
        {/* Il bento dei sei servizi stava qui e non c'e' piu'. Era la sesta
            tassonomia del sito: la lista sotto la hero apre quattro porte, e
            ottocento pixel piu' sotto il bento ne prometteva sei, diverse. Con
            un asse solo l'offerta si racconta nelle quattro pagine servizio, e
            la home smette di contraddirsi da sola. Il componente resta su
            disco, le sue chiavi restano nel dizionario. */}
        <ScrollReveal><Trust /></ScrollReveal>
        <Plans />
        <ScrollReveal><Faq /></ScrollReveal>
        <ScrollReveal><LeadMagnet /></ScrollReveal>
      </main>
      <CinematicFooter />
    </>
  );
}
