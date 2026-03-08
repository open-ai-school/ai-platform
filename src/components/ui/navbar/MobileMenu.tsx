"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { NavProgram } from "./navData";

/* ─── Mobile program list helper ─── */

export function MobilePrograms({
  basePath,
  closeMobile,
  pathLabel,
  programs,
}: {
  basePath: string;
  closeMobile: () => void;
  pathLabel: string;
  programs: NavProgram[];
  trackSlug: string;
}) {
  const tP = useTranslations("programs");
  return (
    <div className="mb-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5 px-1">
        {pathLabel}
      </p>
      {programs.map((p) => (
        <Link
          key={p.slug}
          href={`${basePath}/programs/${p.slug}`}
          onClick={closeMobile}
          className="flex items-center gap-2.5 py-2 px-1 rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-text)]/[0.04]"
        >
          <span>{p.icon}</span>
          <span className="font-medium">{tP(`${p.slug}.title`)}</span>
        </Link>
      ))}
    </div>
  );
}
