"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { it } from "@/i18n/langs/it";
import type { Lang } from "@/i18n";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const ctx = createContext<LangCtx>({
  lang: "it",
  setLang: () => {},
  t: (k: string) => k,
});

export const useLang = () => useContext(ctx);

// Solo l'italiano viaggia nel bundle: e' la lingua sorgente e quella dell'SSR.
// Inglese e svedese arrivano in lazy import QUANDO servono (scelta esplicita
// dell'utente, o scelta salvata da una visita precedente). Prima dello split il
// dizionario intero, in tre lingue, pesava sul JS di OGNI pagina, e ogni scheda
// del catalogo lo ingrassava per tre.
export default function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");
  const packs = useRef<Partial<Record<Lang, Record<string, string>>>>({ it });

  // La lingua diventa attiva solo A PACCHETTO CARICATO: mai un frame di chiavi
  // grezze. Nel frattempo resta l'italiano, come prima dello split (il vecchio
  // provider mostrava comunque IT fino all'idratazione).
  const activate = (l: Lang) => {
    if (packs.current[l]) {
      setLangState(l);
      return;
    }
    const load = l === "en" ? import("@/i18n/langs/en").then((m) => m.en) : import("@/i18n/langs/sv").then((m) => m.sv);
    load.then((pack) => {
      packs.current[l] = pack;
      setLangState(l);
    });
  };

  useEffect(() => {
    // Only an EXPLICIT user choice switches language. No navigator.language
    // auto-detect: Googlebot renders with an en-US locale, and auto-switching
    // made it index English copy on pages that declare lang="it" (SEO audit).
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && ["it", "en", "sv"].includes(saved)) {
      activate(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (l: Lang) => {
    localStorage.setItem("lang", l);
    activate(l);
  };

  const t = (key: string, vars?: Record<string, string>) => {
    let val = packs.current[lang]?.[key] ?? it[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        val = val.replace(`{${k}}`, v);
      }
    }
    return val;
  };

  // Render immediately with the SSR default (IT) so content paints without waiting
  // for hydration — no more whole-page visibility:hidden gate (which delayed
  // FCP/LCP on slow connections). Non-IT visitors get a brief swap on mount.
  return <ctx.Provider value={{ lang, setLang, t }}>{children}</ctx.Provider>;
}
