"use client";

import Nav from "@/components/Nav";
import AssistantHero from "@/components/AssistantHero";

// One assistant. The site-wide widget is the main way in; this page is the
// dedicated, linkable home for it — a split hero with the live chat on the left
// and a mouse-scrub video on the right.
export default function AgentsPage() {
  return (
    <>
      <Nav />
      <AssistantHero />
    </>
  );
}
