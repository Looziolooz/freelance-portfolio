"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ctx = createContext<ThemeCtx>({
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
});

export const useTheme = () => useContext(ctx);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setThemeState(saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
    }
    setMounted(true);
  }, []);

  const apply = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  }, []);

  const setTheme = useCallback(
    (t: Theme) => {
      setThemeState(t);
      apply(t);
    },
    [apply]
  );

  const toggle = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  useEffect(() => {
    if (mounted) apply(theme);
  }, [theme, mounted, apply]);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <ctx.Provider value={{ theme, setTheme, toggle }}>{children}</ctx.Provider>;
}
