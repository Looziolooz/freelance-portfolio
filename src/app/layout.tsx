import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import LangProvider from "@/components/LangProvider";
import ClientLayout from "./ClientLayout";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "lorenzo.hacks — Automazione AI, n8n e sistemi su misura",
  description:
    "Orchestro sistemi che fanno il lavoro noioso. AI orchestrator, esperto n8n, designer, data scraper. Stoccolma.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${interTight.variable} ${jetbrainsMono.variable}`}
      data-theme="light"
    >
      <body className="antialiased" style={{ margin: 0, WebkitFontSmoothing: "antialiased" }}>
        <ThemeProvider>
          <LangProvider>
            <ClientLayout>{children}</ClientLayout>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
