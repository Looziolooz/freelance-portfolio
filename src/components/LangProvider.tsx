"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, type Lang } from "@/i18n";

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

export default function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && ["it", "en", "sv"].includes(saved)) {
      setLangState(saved);
    } else {
      const browser = navigator.language.slice(0, 2);
      if (["it", "en", "sv"].includes(browser)) {
        setLangState(browser as Lang);
      }
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: string, vars?: Record<string, string>) => {
    let val = dict[lang][key] ?? key;
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
