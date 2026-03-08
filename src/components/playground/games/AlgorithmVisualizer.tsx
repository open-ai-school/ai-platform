"use client";

import { useState, useEffect, useRef, memo } from "react";
import { useTranslations } from "next-intl";
import { GameShell } from "../shared";
import { generateArray, bubbleSortGen, quickSortGen, mergeSortGen, ALGO_COLORS } from "../utils/sortingAlgorithms";
import type { SortAlgo, AlgoState } from "../utils/sortingAlgorithms";

export const AlgorithmVisualizer = memo(() => {
  const tp = useTranslations("lab.playground");
  const ARRAY_SIZE = 24;
  const [baseArray, setBaseArray] = useState<number[]>(() => generateArray(ARRAY_SIZE));
  const [algos, setAlgos] = useState<Record<SortAlgo, AlgoState>>(() => ({
    bubble: { name: "Bubble Sort", array: [...baseArray], ops: 0, done: false, comparing: [], swapping: [] },
    quick: { name: "Quick Sort", array: [...baseArray], ops: 0, done: false, comparing: [], swapping: [] },
    merge: { name: "Merge Sort", array: [...baseArray], ops: 0, done: false, comparing: [], swapping: [] },
  }));
  const [racing, setRacing] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [bet, setBet] = useState<SortAlgo | null>(null);
  const [winner, setWinner] = useState<SortAlgo | null>(null);
  const [betResult, setBetResult] = useState<"won" | "lost" | null>(null);
  const gensRef = useRef<Record<SortAlgo, Generator> | null>(null);
  const frameRef = useRef<number>(0);
  const racingRef = useRef(false);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const startRace = () => {
    const arr = generateArray(ARRAY_SIZE);
    setBaseArray(arr);
    setWinner(null);
    setBetResult(null);

    const initial: Record<SortAlgo, AlgoState> = {
      bubble: { name: "Bubble Sort", array: [...arr], ops: 0, done: false, comparing: [], swapping: [] },
      quick: { name: "Quick Sort", array: [...arr], ops: 0, done: false, comparing: [], swapping: [] },
      merge: { name: "Merge Sort", array: [...arr], ops: 0, done: false, comparing: [], swapping: [] },
    };
    setAlgos(initial);

    gensRef.current = {
      bubble: bubbleSortGen(arr),
      quick: quickSortGen(arr),
      merge: mergeSortGen(arr),
    };

    racingRef.current = true;
    setRacing(true);
  };

  useEffect(() => {
    if (!racing || !gensRef.current) return;

    let lastTime = 0;
    const interval = () => {
      const speed = speedRef.current;
      const delay = speed === 1 ? 80 : speed === 2 ? 30 : 8;
      const now = performance.now();
      if (now - lastTime < delay) {
        frameRef.current = requestAnimationFrame(interval);
        return;
      }
      lastTime = now;

      if (!gensRef.current || !racingRef.current) return;

      const updates: Partial<Record<SortAlgo, AlgoState>> = {};
      let anyActive = false;
      const _firstDone: SortAlgo | null = null;

      for (const key of ["bubble", "quick", "merge"] as SortAlgo[]) {
        const gen = gensRef.current[key];
        const result = gen.next();
        if (result.done) {
          updates[key] = { ...updates[key]!, done: true } as AlgoState;
        } else {
          anyActive = true;
          const v = result.value as { array: number[]; comparing: number[]; swapping: number[]; ops: number };
          updates[key] = {
            name: key === "bubble" ? "Bubble Sort" : key === "quick" ? "Quick Sort" : "Merge Sort",
            array: v.array,
            ops: v.ops,
            done: false,
            comparing: v.comparing,
            swapping: v.swapping,
          };
        }
      }

      setAlgos(prev => {
        const next = { ...prev };
        let winnerFound: SortAlgo | null = null;
        for (const key of ["bubble", "quick", "merge"] as SortAlgo[]) {
          if (updates[key]) {
            next[key] = { ...prev[key], ...updates[key] };
          }
          // Check if this just finished
          const gen = gensRef.current![key];
          const peek = gen.next();
          if (peek.done && !prev[key].done) {
            next[key] = { ...next[key], done: true };
            if (!winnerFound && !prev.bubble.done && !prev.quick.done && !prev.merge.done) {
              winnerFound = key;
            }
          }
        }
        return next;
      });

      if (!anyActive) {
        racingRef.current = false;
        setRacing(false);
      }

      frameRef.current = requestAnimationFrame(interval);
    };

    frameRef.current = requestAnimationFrame(interval);
    return () => cancelAnimationFrame(frameRef.current);
  }, [racing]);

  // Detect winner
  useEffect(() => {
    if (winner) return;
    for (const key of ["merge", "quick", "bubble"] as SortAlgo[]) {
      if (algos[key].done) {
        setWinner(key);
        if (bet) {
          setBetResult(bet === key ? "won" : "lost");
        }
        racingRef.current = false;
        setRacing(false);
        return;
      }
    }
  }, [algos, winner, bet]);

  const resetRace = () => {
    racingRef.current = false;
    cancelAnimationFrame(frameRef.current);
    setRacing(false);
    setWinner(null);
    setBet(null);
    setBetResult(null);
    const arr = generateArray(ARRAY_SIZE);
    setBaseArray(arr);
    setAlgos({
      bubble: { name: "Bubble Sort", array: [...arr], ops: 0, done: false, comparing: [], swapping: [] },
      quick: { name: "Quick Sort", array: [...arr], ops: 0, done: false, comparing: [], swapping: [] },
      merge: { name: "Merge Sort", array: [...arr], ops: 0, done: false, comparing: [], swapping: [] },
    });
  };

  const renderBars = (state: AlgoState, color: string) => {
    const max = ARRAY_SIZE;
    return (
      <div className="flex items-end gap-[2px] h-28 sm:h-36">
        {state.array.map((val, i) => {
          const isComparing = state.comparing.includes(i);
          const isSwapping = state.swapping.includes(i);
          const heightPct = (val / max) * 100;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all"
              style={{
                height: `${heightPct}%`,
                backgroundColor: isSwapping ? "#FBBF24" : isComparing ? "#FF6B6B" : state.done ? "#00FF88" : color,
                opacity: isComparing || isSwapping ? 1 : 0.7,
                transition: "height 0.05s ease, background-color 0.1s ease",
                boxShadow: isSwapping ? `0 0 8px ${color}` : "none",
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <GameShell title={tp("algoRace")} icon="🏁">
      <style>{`
        @keyframes algo-flash { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .algo-winner { animation: algo-flash 0.5s ease-in-out 3; }
      `}</style>

      {/* Bet selection */}
      {!racing && !winner && (
        <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-section)]">
          <p className="text-xs font-mono text-[var(--color-text-muted)] mb-3 uppercase tracking-wider">{tp("placeBet")}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {(["bubble", "quick", "merge"] as SortAlgo[]).map(algo => (
              <button
                key={algo}
                onClick={() => setBet(algo)}
                className={`flex-1 min-w-[100px] px-3 py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                  bet === algo
                    ? `border-[${ALGO_COLORS[algo]}] bg-[${ALGO_COLORS[algo]}]/20`
                    : "border-[var(--color-border)] hover:border-[var(--color-text-muted)]"
                }`}
                style={{
                  color: ALGO_COLORS[algo],
                  borderColor: bet === algo ? ALGO_COLORS[algo] : undefined,
                  backgroundColor: bet === algo ? `${ALGO_COLORS[algo]}15` : undefined,
                }}
              >
                {bet === algo ? "★ " : ""}{algo === "bubble" ? tp("bubbleSort") : algo === "quick" ? tp("quickSort") : tp("mergeSort")}
              </button>
            ))}
          </div>
          <button
            onClick={startRace}
            className="w-full min-h-[40px] px-4 py-2 rounded-lg font-mono text-sm font-bold border border-green-500/50 text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-all"
          >
            {tp("startRaceBtn")}
          </button>
        </div>
      )}

      {/* Speed controls */}
      {(racing || winner) && (
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded font-mono text-[10px] border transition-all ${
                  speed === s ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          {winner && (
            <button
              onClick={resetRace}
              className="px-3 py-1 rounded-lg font-mono text-xs font-bold border border-[var(--color-primary)]/50 text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-all"
            >
              {tp("newRace")}
            </button>
          )}
        </div>
      )}

      {/* Algorithm visualizations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(["bubble", "quick", "merge"] as SortAlgo[]).map(key => {
          const state = algos[key];
          const isWinner = winner === key;
          return (
            <div
              key={key}
              className={`p-3 rounded-lg border bg-[var(--color-bg-section)] transition-all ${
                isWinner ? "border-green-500/60 algo-winner" : "border-[var(--color-border)]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold" style={{ color: ALGO_COLORS[key] }}>
                  {state.name}
                  {isWinner && " 🏆"}
                </span>
                {bet === key && <span className="text-[9px] font-mono text-amber-400">{tp("yourBet")}</span>}
              </div>
              {renderBars(state, ALGO_COLORS[key])}
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  {tp("opsLabel")} <span style={{ color: ALGO_COLORS[key] }}>{state.ops}</span>
                </span>
                <span className={`text-[10px] font-mono ${state.done ? "text-green-400" : "text-[var(--color-text-muted)]"}`}>
                  {state.done ? tp("doneStatus") : racing ? tp("sortingStatus") : tp("readyStatus")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Result */}
      {winner && betResult && (
        <div className={`p-4 rounded-lg border text-center font-mono ${
          betResult === "won" ? "border-green-500/40 bg-green-500/10" : "border-red-500/30 bg-red-500/5"
        }`}>
          <p className="text-lg font-bold mb-1">
            {betResult === "won" ? tp("betWon") : tp("betLost")}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {winner === "merge" && tp("mergeWins")}
            {winner === "quick" && tp("quickWins")}
            {winner === "bubble" && tp("bubbleWins")}
          </p>
          <div className="mt-3 flex justify-center gap-4 text-xs text-[var(--color-text-muted)]">
            <span>Bubble: <span className="text-blue-400">{algos.bubble.ops}</span> ops</span>
            <span>Quick: <span className="text-purple-400">{algos.quick.ops}</span> ops</span>
            <span>Merge: <span className="text-green-400">{algos.merge.ops}</span> ops</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[10px] font-mono text-[var(--color-text-muted)]">
        <span><span className="inline-block w-2 h-2 rounded-sm bg-[#FF6B6B] mr-1" /> {tp("comparingLegend")}</span>
        <span><span className="inline-block w-2 h-2 rounded-sm bg-[#FBBF24] mr-1" /> {tp("swappingLegend")}</span>
        <span><span className="inline-block w-2 h-2 rounded-sm bg-[#00FF88] mr-1" /> {tp("sortedLegend")}</span>
      </div>
    </GameShell>
  );
});
