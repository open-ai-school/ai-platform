"use client";

import { useProgress } from "@/hooks/useProgress";
import Link from "next/link";
import { useState } from "react";

interface LessonCompleteProps {
  slug: string;
  totalLessons: number;
  currentIndex: number;
  nextSlug?: string;
  nextTitle?: string;
  basePath: string;
}

export function LessonComplete({
  slug,
  totalLessons,
  currentIndex,
  nextSlug,
  nextTitle,
  basePath,
}: LessonCompleteProps) {
  const { isCompleted, markComplete, completedCount } = useProgress();
  const [justCompleted, setJustCompleted] = useState(false);
  const completed = isCompleted(slug);

  const handleComplete = () => {
    markComplete(slug);
    setJustCompleted(true);
  };

  return (
    <div className="mt-12 space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
        <span>
          Lesson {currentIndex + 1} of {totalLessons}
        </span>
        <span>
          {completed ? completedCount : completedCount} of {totalLessons}{" "}
          completed
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${(completedCount / totalLessons) * 100}%` }}
        />
      </div>

      {/* Complete button or completion state */}
      <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
        {completed ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-[var(--color-accent)]">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xl font-bold">
                {justCompleted ? "🎉 Lesson completed!" : "✅ Completed"}
              </span>
            </div>

            {completedCount === totalLessons && (
              <p className="text-lg font-semibold text-[var(--color-primary)]">
                🏆 Congratulations! You&apos;ve completed all lessons!
              </p>
            )}

            {nextSlug && (
              <Link
                href={`${basePath}/${nextSlug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:brightness-110 transition-all"
              >
                Next: {nextTitle} →
              </Link>
            )}
          </div>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full px-6 py-4 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-lg hover:brightness-110 transition-all active:scale-[0.98] cursor-pointer"
          >
            ✅ Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
}
