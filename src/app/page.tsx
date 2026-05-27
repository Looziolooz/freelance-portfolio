import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Contact from "@/components/Contact";
import ScrollProgress from "@/components/ScrollProgress";
import WayfindingNav from "@/components/WayfindingNav";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollReveal from "@/components/ScrollReveal";
import AgentsShowcase from "@/components/AgentsShowcase";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <WayfindingNav />
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <Hero />
        <Ticker />
        <ScrollReveal><About /></ScrollReveal>
        <ScrollReveal><Work /></ScrollReveal>
        <ScrollReveal><Stack /></ScrollReveal>
        <AgentsShowcase />
        <ScrollReveal><Contact /></ScrollReveal>
      </main>
      <ScrollToTop />
    </>
  );
}
