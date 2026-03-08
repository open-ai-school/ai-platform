import Link from "next/link";

export function ProgramItem({
  slug,
  icon,
  basePath,
  t,
}: {
  slug: string;
  icon: string;
  basePath: string;
  t: (key: string) => string;
}) {
  const title = t(`${slug}.title`);
  const desc = t(`${slug}.homeDesc`);

  const content = (
    <div className="flex items-start gap-3 py-2 px-3 rounded-lg transition-colors group/item hover:bg-[var(--color-text)]/[0.04]">
      <span className="text-lg mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-primary)] transition-colors">
            {title}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );

  return (
    <Link href={`${basePath}/programs/${slug}`} role="menuitem">
      {content}
    </Link>
  );
}
