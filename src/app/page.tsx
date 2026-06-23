import Nav from "@/components/Nav";
import HeroMotion from "@/components/HeroMotion";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Services from "@/components/Services";
import Plans from "@/components/Plans";
import ScrollProgress from "@/components/ScrollProgress";
import WayfindingNav from "@/components/WayfindingNav";
import ScrollReveal from "@/components/ScrollReveal";
import ContactClose from "@/components/ContactClose";
import CinematicFooter from "@/components/CinematicFooter";


export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <WayfindingNav />
      <HeroMotion />
      {/* Projects: full-bleed dark "blinds" paged viewer (own black stage). */}
      <Projects />
      <main className="container">
        {/* Studio funnel (hexart-style): hero → works → founder (trust) →
            services (what) → engagements/pricing (offer) → final CTA (footer). */}
        <ScrollReveal><About /></ScrollReveal>
        <ScrollReveal><Services /></ScrollReveal>
        <Plans />
      </main>
      <ContactClose />
      <CinematicFooter />
    </>
  );
}
