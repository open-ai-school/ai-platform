import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://openaischool.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "playground" });
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/playground`,
    },
    openGraph: {
      title: `${t("pageTitle")} | Open AI School`,
      description: t("pageDescription"),
    },
  };
}

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
