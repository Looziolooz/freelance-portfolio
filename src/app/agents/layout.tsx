import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assistente AI",
  description:
    "Fai una domanda all'assistente AI dello studio: risponde su servizi, progetti e prezzi in italiano, inglese e svedese. Ed è l'esempio vivo degli agenti che costruisco.",
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
