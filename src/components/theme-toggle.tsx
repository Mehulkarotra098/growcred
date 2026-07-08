"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";

const themeStorageKey = "growcred-theme";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(themeStorageKey);
  if (stored === "light" || stored === "dark") return stored;

  return "light";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function getCurrentTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const activeTheme = document.documentElement.dataset.theme;
  return activeTheme === "dark" || activeTheme === "light"
    ? activeTheme
    : getInitialTheme();
}

export function ThemeToggle({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  function toggleTheme() {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(themeStorageKey, nextTheme);
  }

  if (compact) {
    return (
      <button
        type="button"
        aria-label="Toggle color theme"
        onClick={toggleTheme}
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full border border-forest/10 bg-white/80 text-forest shadow-sm shadow-forest/5 ring-1 ring-forest/5 backdrop-blur transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
          className,
        )}
      >
        <span className="theme-toggle-compact-sun grid place-items-center">
          <Sun aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="theme-toggle-compact-moon place-items-center">
          <Moon aria-hidden="true" className="h-4 w-4" />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border border-forest/10 bg-white/80 px-2 py-1 text-forest shadow-sm shadow-forest/5 ring-1 ring-forest/5 backdrop-blur transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
        className,
      )}
    >
      <span
        className={cn(
          "theme-toggle-sun grid h-8 w-8 place-items-center rounded-full bg-lime text-forest transition",
        )}
      >
        <Sun aria-hidden="true" className="h-4 w-4" />
      </span>
      <span
        className={cn(
          "theme-toggle-moon grid h-8 w-8 place-items-center rounded-full bg-transparent text-forest/55 transition",
        )}
      >
        <Moon aria-hidden="true" className="h-4 w-4" />
      </span>
    </button>
  );
}
