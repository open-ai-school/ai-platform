import Link from "next/link";

export function AboutDropdownContent({ basePath, t }: { basePath: string; t: (key: string) => string }) {
  return (
    <div className="w-[300px] p-4">
      <div className="space-y-0.5">
        <Link
          href={`${basePath}/about`}
          className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-[var(--color-text)]/[0.04] transition-colors group/item"
         
        >
          <span className="text-base mt-0.5">🎯</span>
          <div>
            <span className="text-sm font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-primary)] transition-colors">
              {t("mission")}
            </span>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t("missionDesc")}</p>
          </div>
        </Link>
        <Link
          href={`${basePath}/about`}
          className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-[var(--color-text)]/[0.04] transition-colors group/item"
         
        >
          <span className="text-base mt-0.5">💜</span>
          <div>
            <span className="text-sm font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-primary)] transition-colors">
              {t("values")}
            </span>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t("valuesDesc")}</p>
          </div>
        </Link>
        <a
          href="https://github.com/ai-educademy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-[var(--color-text)]/[0.04] transition-colors group/item"
         
        >
          <span className="text-base mt-0.5">⭐</span>
          <div>
            <span className="text-sm font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-primary)] transition-colors">
              {t("openSource")}
            </span>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t("openSourceDesc")}</p>
          </div>
        </a>
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--color-border)]/50 px-3 flex flex-col gap-2">
        <Link
          href={`${basePath}/about`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
         
        >
          {t("meetCreator")}
          <span aria-hidden>→</span>
        </Link>
        <a
          href="https://github.com/ai-educademy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline"
         
        >
          {t("viewOnGithub")}
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
