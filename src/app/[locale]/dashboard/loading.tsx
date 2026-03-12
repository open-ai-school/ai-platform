export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 animate-pulse">
      <div className="h-8 w-64 bg-[var(--color-bg-card)] rounded-lg mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
          />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
          />
        ))}
      </div>
    </div>
  );
}
