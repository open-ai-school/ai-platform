"use client";

import { useState } from "react";

/* ─── Mobile expandable section (CSS transitions, no framer-motion) ─── */

export function MobileSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--color-border)]/50 last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-3.5 px-4 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-text)]/[0.03] transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-base">{icon}</span>
          {title}
        </span>
        <span className="text-xs text-[var(--color-text-muted)] transition-transform duration-200">
          {expanded ? "−" : "+"}
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
