import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import LangProvider from "@/components/LangProvider";
import ClientLayout from "./ClientLayout";
import "./globals.css";

// Display: Fraunces — an expressive "soft serif" with optical sizing. Carries
// the craft/taste signal that a neutral sans (the old Inter Tight) flattened.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// Mono: technical labels, code, stat readouts.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "lorenzo.studio — Siti, automazioni e agenti AI per la tua impresa",
  description:
    "Sviluppo siti su misura per piccole e grandi aziende, automazione dei processi ripetitivi, contenuti social e agenti AI. Più visibilità, meno lavoro manuale, dati dal web che generano valore.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${fraunces.variable} ${jetbrainsMono.variable}`}
      data-theme="light"
    >
      <body className="antialiased" style={{ margin: 0, WebkitFontSmoothing: "antialiased" }}>
        {/* Body/UI face: General Sans (Fontshare). React 19 hoists these to <head>. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <ThemeProvider>
          <LangProvider>
            <ClientLayout>{children}</ClientLayout>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
