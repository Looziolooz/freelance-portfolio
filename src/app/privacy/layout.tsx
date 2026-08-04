import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Come vengono trattati i dati personali su LOoz.design: titolare, finalità, diritti e contatti.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
