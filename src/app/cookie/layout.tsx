import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "Quali cookie usa LOoz.design, a cosa servono e come gestire il consenso.",
};

export default function CookieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
