"use client";

import { useProgress } from "@/hooks/useProgress";

export function LessonProgressBadge({ slug }: { slug: string }) {
  const { isCompleted } = useProgress();

  if (!isCompleted(slug)) return null;

  return (
    <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">
      ✓
    </span>
  );
}
