import Link from "next/link";

export function BlogDropdownContent({ basePath, t }: { basePath: string; t: (key: string) => string }) {
  return (
    <div className="w-[280px] p-4">
      <div className="flex items-center gap-3 px-3 mb-3">
        <span className="text-2xl">📝</span>
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)]">{t("blog")}</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t("latestArticles")}</p>
        </div>
      </div>
      <div className="pt-3 border-t border-[var(--color-border)]/50 px-3">
        <Link
          href={`${basePath}/blog`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
          role="menuitem"
        >
          {t("readBlog")}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
