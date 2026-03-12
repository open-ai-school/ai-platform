import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";

const BASE_URL = "https://aieducademy.org";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const canonical = `${BASE_URL}${locale === "en" ? "" : `/${locale}`}/contact`;

  return {
    title: `${t("title")} | AI Educademy`,
    description: t("subtitle"),
    alternates: {
      canonical,
      ...buildAlternates("/contact"),
    },
    openGraph: {
      title: `${t("title")} | AI Educademy`,
      description: t("subtitle"),
      url: canonical,
      type: "website",
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
