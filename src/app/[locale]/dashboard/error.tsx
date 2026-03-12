"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <div className="text-center space-y-6">
        <div className="text-5xl">📊</div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">
          Failed to load your dashboard
        </h2>
        <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
          Something went wrong loading your progress. This is usually temporary.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:brightness-110 transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
