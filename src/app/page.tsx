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
import EntryGrid from "@/components/EntryGrid";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <WayfindingNav />
      <main className="container">
        <Hero />
        <Ticker />
        <ScrollReveal><EntryGrid /></ScrollReveal>
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
