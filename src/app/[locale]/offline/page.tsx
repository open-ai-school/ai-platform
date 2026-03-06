import { useTranslations } from "next-intl";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  const t = useTranslations("pwa");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <WifiOff className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        {t("offline")}
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        {t("offlineMessage")}
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
      >
        {t("goHome")}
      </Link>
    </div>
  );
}
