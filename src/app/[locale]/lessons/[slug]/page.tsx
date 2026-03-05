import { redirect } from "next/navigation";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const basePath = locale === "en" ? "" : `/${locale}`;
  redirect(`${basePath}/programs/ai-seeds/lessons/${slug}`);
}
