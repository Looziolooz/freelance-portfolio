"use client";

import { createContext, useContext, useEffect } from "react";

// Light-only. The dark theme was removed — this provider keeps the light theme
// applied and clears any previously-stored "dark" preference (so returning
// visitors who had dark on get light). The useTheme() API is preserved as a
// no-op so existing consumers keep working.
type Theme = "light";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ctx = createContext<ThemeCtx>({ theme: "light", setTheme: () => {}, toggle: () => {} });

export const useTheme = () => useContext(ctx);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    try { localStorage.setItem("theme", "light"); } catch { /* private mode */ }
  }, []);

  return (
    <ctx.Provider value={{ theme: "light", setTheme: () => {}, toggle: () => {} }}>
      {children}
    </ctx.Provider>
  );
}
