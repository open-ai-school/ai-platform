"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const basePath = ["en", "fr", "nl", "hi", "te"].includes(locale)
    ? locale === "en"
      ? ""
      : `/${locale}`
    : "";

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={`${basePath}/`} className="flex items-center gap-2 font-semibold text-base mb-3">
              <span className="text-lg">🎓</span>
              <span>Open AI School</span>
            </Link>
            <p className="text-sm text-[var(--color-text-muted)]">
              {t("tagline")}
            </p>
          </div>

          {/* Learn */}
          <div>
            <h3 className="font-semibold text-sm mb-3">{t("learnHeader")}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>
                <Link href={`${basePath}/programs`} className="hover:text-[var(--color-primary)]">
                  Programs
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/programs/ai-seeds`} className="hover:text-[var(--color-primary)]">
                  {t("lessons")}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/playground`} className="hover:text-[var(--color-primary)]">
                  {t("playground")}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/dashboard`} className="hover:text-[var(--color-primary)]">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/about`} className="hover:text-[var(--color-primary)]">
                  {t("about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-sm mb-3">{t("communityHeader")}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>
                <a
                  href="https://github.com/open-ai-school"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-primary)]"
                >
                  {t("github")}
                </a>
              </li>
              <li>
                <a href="https://github.com/open-ai-school/ai-seeds/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)]">
                  {t("contributing")}
                </a>
              </li>
              <li>
                <a href="https://github.com/open-ai-school/ai-seeds/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)]">
                  {t("coc")}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm mb-3">{t("supportHeader")}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>
                <a href="https://github.com/sponsors/rameshreddy-adutla" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)]">
                  {t("sponsor")} ❤️
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-muted)]">
          <p>{t("madeWith")}</p>
          <p>{t("license")}</p>
        </div>
      </div>
    </footer>
  );
}
