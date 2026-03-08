function StatusBar({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
      <span>{left}</span>
      {right && <span>{right}</span>}
    </div>
  );
}

export default StatusBar;
