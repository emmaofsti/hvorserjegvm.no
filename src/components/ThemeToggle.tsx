"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

type Theme = "dark" | "light";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const t = document.documentElement.getAttribute("data-theme");
  return t === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(readTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  };

  // Avoid hydration mismatch — render a placeholder until client takes over
  if (!mounted) {
    return <span className="inline-flex h-9 w-9" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Bytt til lysmodus" : "Bytt til mørkmodus"}
      title={isDark ? "Lysmodus" : "Mørkmodus"}
      className="lg-capsule lg-energize inline-flex h-9 w-9 items-center justify-center bg-white/[0.04] border border-white/[0.10] text-slate-200 hover:bg-white/[0.08] hover:border-white/[0.18]"
    >
      {isDark ? (
        <Icon.Sun size={16} strokeWidth={2.2} />
      ) : (
        <Icon.Moon size={16} strokeWidth={2.2} />
      )}
    </button>
  );
}
