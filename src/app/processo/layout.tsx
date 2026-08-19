import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Processo",
  description:
    "Ascolto e piano sono uguali per tutti. Poi la strada cambia: marchio, sito, automazioni AI o visibilità, ognuno con i suoi passi, i suoi tempi e quello che sposta il preventivo.",
};

export default function ProcessoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
