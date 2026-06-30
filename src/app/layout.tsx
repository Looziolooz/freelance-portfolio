import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
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

// Body/UI face: General Sans — self-hosted via next/font/local. Removes the
// render-blocking 3rd-party request to fontshare and the late font swap: the
// woff2 ship from our own origin and next/font generates a size-adjusted
// fallback, so the face applies fast with ~0 CLS. Exposed as --font-general-sans;
// globals.css points --font-sans at it.
const generalSans = localFont({
  src: [
    { path: "./fonts/general-sans/general-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/general-sans/general-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/general-sans/general-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/general-sans/general-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Lorenzo.studio — Siti, automazioni e agenti AI per la tua impresa",
  description:
    "Sviluppo siti su misura per piccole e grandi aziende, automazione dei processi ripetitivi, contenuti social e agenti AI. Più visibilità, meno lavoro manuale, dati dal web che generano valore.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${fraunces.variable} ${jetbrainsMono.variable} ${generalSans.variable}`}
      data-theme="light"
    >
      {/* No inline style here: globals.css already sets `html,body{margin:0}` and
          body `-webkit-font-smoothing:antialiased`. An inline shorthand style on
          <body> serialized differently on server vs client → hydration mismatch. */}
      <body className="antialiased">
        <ThemeProvider>
          <LangProvider>
            <ClientLayout>{children}</ClientLayout>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
