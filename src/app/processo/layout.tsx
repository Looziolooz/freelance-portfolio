import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Processo",
  description:
    "Il metodo in quattro fasi: ascolto, strategia, costruzione, lancio e crescita. Cosa succede dal primo contatto al sito online, senza sorprese.",
};

export default function ProcessoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
