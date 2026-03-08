import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="text-8xl font-bold text-[var(--color-primary)] opacity-20">404</div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">{t("title")}</h1>
        <p className="text-[var(--color-text-muted)]">{t("description")}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:brightness-110 transition-all"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
