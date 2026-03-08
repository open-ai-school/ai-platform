function GameOverScreen({ emoji, stat, label, onReplay, replayText }: { emoji: string; stat: string; label: string; onReplay: () => void; replayText: string }) {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="text-6xl animate-bounce">{emoji}</div>
      <p className="text-4xl font-bold font-mono">{stat}</p>
      <p className="text-sm text-[var(--color-text-muted)] font-mono">{label}</p>
      <button onClick={onReplay} className="min-h-[48px] px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg shadow-indigo-500/20 font-mono">
        ▶ {replayText}
      </button>
    </div>
  );
}

export default GameOverScreen;
