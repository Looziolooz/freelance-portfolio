import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import HeroMotion from "@/components/HeroMotion";
import WorkMarquee from "@/components/WorkMarquee";
import TechStack from "@/components/TechStack";
import BentoShift from "@/components/BentoShift";
import ScrollProgress from "@/components/ScrollProgress";
import WayfindingNav from "@/components/WayfindingNav";
import ScrollReveal from "@/components/ScrollReveal";

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
      {/* Proof before claims: the live demo covers run right under the hero. */}
      <WorkMarquee />
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
