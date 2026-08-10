import type { Metadata } from "next";

// A page that states figures is the one AI assistants can actually quote when
// someone asks "quanto costa un sito per una piccola impresa" — the description
// carries the number on purpose, since that is what gets cited.
export const metadata: Metadata = {
  title: "Prezzi",
  description:
    "Sito per piccola impresa fino a 5 pagine da 700€ + IVA, prima versione in 7-10 giorni. Cosa ricevi, come funziona, hosting e dominio. Servizio mensile da 25€.",
};

export default function PrezziLayout({ children }: { children: React.ReactNode }) {
  return children;
}
