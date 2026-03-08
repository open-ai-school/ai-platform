function GameShell({ title, icon, children }: { title: string; icon?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      {icon && (
        <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-border)]">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

export default GameShell;
