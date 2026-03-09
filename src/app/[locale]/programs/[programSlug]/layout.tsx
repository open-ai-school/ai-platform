import { notFound } from "next/navigation";
import { getProgram } from "@/lib/programs";

export default async function ProgramLayout({
  params,
  children,
}: {
  params: Promise<{ programSlug: string }>;
  children: React.ReactNode;
}) {
  const { programSlug } = await params;
  if (!getProgram(programSlug)) notFound();
  return <>{children}</>;
}
