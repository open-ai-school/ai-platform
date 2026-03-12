export default function LessonLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 mb-8">
        <div className="h-4 w-20 bg-[var(--color-bg-card)] rounded" />
        <div className="h-4 w-4 bg-[var(--color-bg-card)] rounded" />
        <div className="h-4 w-32 bg-[var(--color-bg-card)] rounded" />
        <div className="h-4 w-4 bg-[var(--color-bg-card)] rounded" />
        <div className="h-4 w-24 bg-[var(--color-bg-card)] rounded" />
      </div>
      {/* Title skeleton */}
      <div className="h-10 w-3/4 bg-[var(--color-bg-card)] rounded-lg mb-4" />
      <div className="h-5 w-48 bg-[var(--color-bg-card)] rounded mb-12" />
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-full bg-[var(--color-bg-card)] rounded" />
        <div className="h-4 w-5/6 bg-[var(--color-bg-card)] rounded" />
        <div className="h-4 w-4/5 bg-[var(--color-bg-card)] rounded" />
        <div className="h-32 w-full bg-[var(--color-bg-card)] rounded-xl mt-6" />
        <div className="h-4 w-full bg-[var(--color-bg-card)] rounded mt-6" />
        <div className="h-4 w-3/4 bg-[var(--color-bg-card)] rounded" />
      </div>
    </div>
  );
}
