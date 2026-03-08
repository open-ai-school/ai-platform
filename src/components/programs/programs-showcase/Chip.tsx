"use client";

import React from "react";

/* ─── Chip ─── */
export function Chip({ children, color, filled }: { children: React.ReactNode; color?: string; filled?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full font-semibold border transition-colors"
      style={
        filled && color
          ? { borderColor: `${color}40`, color, backgroundColor: `${color}12` }
          : color
            ? { borderColor: `${color}25`, color: "var(--color-text-muted)" }
            : { borderColor: "var(--color-border)", color: "var(--color-text-muted)" }
      }
    >
      {children}
    </span>
  );
}
