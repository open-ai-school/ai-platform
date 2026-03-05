import { redirect } from "next/navigation";

export default async function LessonsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const basePath = locale === "en" ? "" : `/${locale}`;
  redirect(`${basePath}/programs/ai-seeds`);
}

