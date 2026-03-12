export default function MockInterviewLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 animate-pulse">
      <div className="h-10 w-80 bg-[var(--color-bg-card)] rounded-lg mb-4 mx-auto" />
      <div className="h-5 w-96 bg-[var(--color-bg-card)] rounded-lg mb-12 mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
          />
        ))}
      </div>
    </div>
  );
}
