export default function ContactLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 animate-pulse">
      {/* Hero skeleton */}
      <div className="text-center mb-12">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-section)] mx-auto mb-5" />
        <div className="h-9 w-56 bg-[var(--color-bg-section)] rounded-xl mx-auto mb-3" />
        <div className="h-5 w-80 bg-[var(--color-bg-section)] rounded-lg mx-auto" />
      </div>

      {/* Form skeleton */}
      <div className="rounded-2xl border border-[var(--color-border)] p-6 sm:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-[var(--color-bg-section)] rounded" />
            <div className="h-12 bg-[var(--color-bg-section)] rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 bg-[var(--color-bg-section)] rounded" />
            <div className="h-12 bg-[var(--color-bg-section)] rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-[var(--color-bg-section)] rounded" />
          <div className="h-12 bg-[var(--color-bg-section)] rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-[var(--color-bg-section)] rounded" />
          <div className="h-32 bg-[var(--color-bg-section)] rounded-xl" />
        </div>
        <div className="h-12 w-36 bg-[var(--color-bg-section)] rounded-xl" />
      </div>

      {/* Contact info skeleton */}
      <div className="mt-12 text-center space-y-4">
        <div className="h-5 w-48 bg-[var(--color-bg-section)] rounded-lg mx-auto" />
        <div className="h-4 w-56 bg-[var(--color-bg-section)] rounded mx-auto" />
        <div className="flex justify-center gap-4 mt-4">
          <div className="w-10 h-10 rounded-full bg-[var(--color-bg-section)]" />
          <div className="w-10 h-10 rounded-full bg-[var(--color-bg-section)]" />
          <div className="w-10 h-10 rounded-full bg-[var(--color-bg-section)]" />
        </div>
      </div>
    </div>
  );
}
