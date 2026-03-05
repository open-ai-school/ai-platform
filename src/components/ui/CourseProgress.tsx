"use client";

import { useProgress } from "@/hooks/useProgress";
import Link from "next/link";

export function CourseProgress({
  totalLessons,
  basePath,
  programSlug,
}: {
  totalLessons: number;
  basePath: string;
  programSlug?: string;
}) {
  const { completedCount } = useProgress(programSlug);

  if (completedCount === 0) return null;

  const percentage = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="max-w-md mx-auto mt-10 p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="font-medium">📚 Your Progress</span>
        <span className="text-[var(--color-text-muted)]">
          {completedCount}/{totalLessons} lessons ({percentage}%)
        </span>
      </div>
      <div className="progress-bar mb-4">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {completedCount === totalLessons ? (
        <p className="text-center text-sm font-semibold text-[var(--color-accent)]">
          🏆 All lessons completed!
        </p>
      ) : (
        <Link
          href={basePath}
          className="block text-center text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          Continue learning →
        </Link>
      )}
    </div>
  );
}
