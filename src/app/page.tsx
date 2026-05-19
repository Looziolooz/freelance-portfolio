import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ maxWidth: 1760, margin: "0 auto" }}>
        <Hero />
        <Ticker />
        <About />
        <Work />
        <Stack />
        <Contact />
      </main>
    </>
  );
}
