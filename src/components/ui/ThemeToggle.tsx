"use client";

import { useTheme } from "@open-ai-school/ai-ui-library";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-14 h-7 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] transition-colors duration-300 hover:border-[var(--color-primary)]/40 active:scale-95 shrink-0"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      role="switch"
      aria-checked={isDark}
    >
      {/* Sun icon — left side */}
      <svg
        className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? "opacity-30" : "opacity-70 text-amber-500"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>

      {/* Moon icon — right side */}
      <svg
        className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? "opacity-70 text-indigo-400" : "opacity-30"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>

      {/* Sliding dot */}
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-sm transition-all duration-300 ${
          isDark
            ? "left-[calc(100%-1.625rem)] bg-indigo-500"
            : "left-0.5 bg-amber-400"
        }`}
      />
    </button>
  );
}
