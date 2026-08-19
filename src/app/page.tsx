import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import HeroMotion from "@/components/HeroMotion";
import WorkGallery from "@/components/WorkGallery";
import TechStack from "@/components/TechStack";
import BentoShift from "@/components/BentoShift";
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
      {/* Proof before claims: the live demos sit right under the hero. A
          horizontal gallery rather than a grid — you walk the work, one card
          at a time, in the same order the reader meets it. NB: this pinned
          stage must never be wrapped in a transformed motion container
          (ScrollReveal) — see WorkGallery's docblock. */}
      <WorkGallery />
      {/* …and immediately what they are built with. Fills the slot the MacBook
          showcase used to occupy: demos first, then the toolkit behind them. */}
      <TechStack />
      <main className="container">
        {/* Conversion funnel: hero → services (what I offer) → trust (proof) →
            method/pricing (the offer) → FAQ (answer objections) → lead magnet
            (capture) → final CTA (footer). The selected-works viewer lives on its
            own /work page (linked from the nav + hero CTA). */}
        <ScrollReveal><BentoShift /></ScrollReveal>
        <ScrollReveal><Trust /></ScrollReveal>
        <Plans />
        <ScrollReveal><Faq /></ScrollReveal>
        <ScrollReveal><LeadMagnet /></ScrollReveal>
      </main>
      <CinematicFooter />
    </>
  );
}
