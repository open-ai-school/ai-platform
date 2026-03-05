"use client";

import Link from "next/link";
import { useGuestProfile } from "@/hooks/useGuestProfile";
import { useProgress } from "@/hooks/useProgress";

const ALL_SLUGS = ["what-is-ai", "how-machines-learn", "your-first-ai-model"];

export function WelcomeBanner({ basePath }: { basePath: string }) {
  const { profile, isSignedIn } = useGuestProfile();
  const { completed, completedCount } = useProgress();

  if (!isSignedIn) return null;

  const nextSlug = ALL_SLUGS.find((s) => !completed.includes(s)) || ALL_SLUGS[0];
  const percentage = Math.round((completedCount / ALL_SLUGS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-fade-up" style={{ animationDelay: "600ms" }}>
      <div className="p-6 rounded-2xl glass-card">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl">{profile?.avatar}</span>
          <div>
            <p className="font-semibold">
              Welcome back, {profile?.name}! 👋
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {completedCount === ALL_SLUGS.length
                ? "You've completed all available lessons! 🎉"
                : `${completedCount} of ${ALL_SLUGS.length} lessons completed`}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] via-purple-500 to-[var(--color-accent)] transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <Link
            href={`${basePath}/dashboard`}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            View Dashboard →
          </Link>
          {completedCount < ALL_SLUGS.length && (
            <Link
              href={`${basePath}/lessons/${nextSlug}`}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:brightness-110 transition-all active:scale-95"
            >
              Continue Learning →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
