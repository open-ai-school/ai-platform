"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ProgressEntry {
  lessonSlug: string;
  programSlug: string;
  locale: string;
  completedAt: string;
}

interface ContinueState {
  programSlug: string;
  programTitle: string;
  lastLessonSlug: string;
  completedCount: number;
  totalCount: number;
}

interface HomeContinueLearningProps {
  basePath: string;
  programTitles: Record<string, string>;
  lessonCounts: Record<string, number>;
}

export default function HomeContinueLearning({
  basePath,
  programTitles,
  lessonCounts,
}: HomeContinueLearningProps) {
  const { data: session, status } = useSession();
  const t = useTranslations("continueLearning");
  const [state, setState] = useState<ContinueState | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    async function fetchProgress() {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error("Failed to fetch progress");
        const data = await res.json();
        const entries: ProgressEntry[] = data.progress ?? [];

        if (entries.length === 0) {
          setState(null);
          setLoading(false);
          setTimeout(() => setVisible(true), 50);
          return;
        }

        // Find most recently completed lesson
        const sorted = [...entries].sort(
          (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
        );
        const latest = sorted[0];
        const programEntries = entries.filter((e) => e.programSlug === latest.programSlug);

        setState({
          programSlug: latest.programSlug,
          programTitle: programTitles[latest.programSlug] ?? latest.programSlug,
          lastLessonSlug: latest.lessonSlug,
          completedCount: programEntries.length,
          totalCount: lessonCounts[latest.programSlug] ?? programEntries.length,
        });
        setLoading(false);
        setTimeout(() => setVisible(true), 50);
      } catch {
        setLoading(false);
        setTimeout(() => setVisible(true), 50);
      }
    }

    fetchProgress();
  }, [status, programTitles, lessonCounts]);

  if (status !== "authenticated" || loading) return null;

  const progressPct = state ? Math.round((state.completedCount / state.totalCount) * 100) : 0;

  return (
    <div
      className="w-full py-4 sm:py-6 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-2xl border p-5 sm:p-6 backdrop-blur-md"
          style={{
            background: "var(--color-glass)",
            borderColor: "var(--color-glass-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {state ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {t("title")}
                </p>
                <p
                  className="text-lg font-bold truncate"
                  style={{ color: "var(--color-text)" }}
                >
                  {state.programTitle}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--color-border)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progressPct}%`,
                        background: "var(--color-primary)",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs whitespace-nowrap"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("progress", {
                      completed: state.completedCount,
                      total: state.totalCount,
                    })}
                  </span>
                </div>
              </div>
              <Link
                href={`${basePath}/programs/${state.programSlug}/${state.lastLessonSlug}`}
                className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-shadow duration-200"
                style={{
                  background: "var(--color-primary)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {t("continueCta")} →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p
                  className="text-lg font-bold mb-1"
                  style={{ color: "var(--color-text)" }}
                >
                  {t("startFirst")}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {t("startFirstDesc")}
                </p>
              </div>
              <Link
                href={`${basePath}/programs`}
                className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-shadow duration-200 border"
                style={{
                  color: "var(--color-primary)",
                  borderColor: "var(--color-primary)",
                }}
              >
                {t("startCta")} →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
