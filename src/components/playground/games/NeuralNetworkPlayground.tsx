"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useTranslations } from "next-intl";
import { GameShell } from "../shared";
import { initWeights, forward, trainStep, computeAccuracy } from "../utils/neuralNetwork";
import type { NNWeights } from "../utils/neuralNetwork";

export const NeuralNetworkPlayground = memo(() => {
  const tp = useTranslations("lab.playground");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number; cls: number }[]>([]);
  const [hiddenSize, setHiddenSize] = useState(4);
  const [weights, setWeights] = useState<NNWeights>(() => initWeights(4));
  const [training, setTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [brushClass, setBrushClass] = useState(0);
  const trainingRef = useRef(false);
  const weightsRef = useRef(weights);
  const pointsRef = useRef(points);
  const epochRef = useRef(0);

  weightsRef.current = weights;
  pointsRef.current = points;

  // Reset weights when hidden size changes
  useEffect(() => {
    const w = initWeights(hiddenSize);
    setWeights(w);
    weightsRef.current = w;
    setEpoch(0);
    epochRef.current = 0;
  }, [hiddenSize]);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const w = weightsRef.current;

    // Decision boundary - sample grid
    const res = 30;
    const cellW = W / res;
    const cellH = H / res;
    for (let gx = 0; gx < res; gx++) {
      for (let gy = 0; gy < res; gy++) {
        const nx = (gx + 0.5) / res;
        const ny = (gy + 0.5) / res;
        const { output } = forward(w, nx, ny);
        const r = Math.round(239 * output + 59 * (1 - output));
        const g = Math.round(68 * output + 130 * (1 - output));
        const b = Math.round(68 * output + 246 * (1 - output));
        ctx.fillStyle = `rgba(${r},${g},${b},0.25)`;
        ctx.fillRect(gx * cellW, gy * cellH, cellW + 1, cellH + 1);
      }
    }

    // Grid lines
    ctx.strokeStyle = "rgba(128,128,128,0.15)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * W;
      const y = (i / 10) * H;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Data points
    for (const p of pointsRef.current) {
      const px = p.x * W;
      const py = p.y * H;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = p.cls === 1 ? "#EF4444" : "#3B82F6";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, []);

  // Animation loop for training
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      if (trainingRef.current && pointsRef.current.length >= 2) {
        const newW = trainStep(weightsRef.current, pointsRef.current, 0.5);
        weightsRef.current = newW;
        epochRef.current += 1;
        if (epochRef.current % 5 === 0) {
          setWeights({ ...newW });
          setEpoch(epochRef.current);
          setAccuracy(computeAccuracy(newW, pointsRef.current));
        }
      }
      draw();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [draw]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const newPoints = [...pointsRef.current, { x, y, cls: brushClass }];
    setPoints(newPoints);
    pointsRef.current = newPoints;
  };

  const toggleTraining = () => {
    trainingRef.current = !trainingRef.current;
    setTraining(trainingRef.current);
  };

  const clearAll = () => {
    setPoints([]);
    pointsRef.current = [];
    const w = initWeights(hiddenSize);
    setWeights(w);
    weightsRef.current = w;
    setEpoch(0);
    epochRef.current = 0;
    setAccuracy(0);
    trainingRef.current = false;
    setTraining(false);
  };

  return (
    <GameShell title={tp("neuralTitle")} icon="🧬">
      <style>{`
        @keyframes nn-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .nn-training { animation: nn-pulse 1s ease-in-out infinite; }
      `}</style>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-section)] font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-text-muted)]">{tp("brush")}</span>
          <button
            onClick={() => setBrushClass(0)}
            className={`px-2 py-1 rounded border transition-all ${brushClass === 0 ? "border-blue-500 bg-blue-500/20 text-blue-400" : "border-[var(--color-border)] text-[var(--color-text-muted)]"}`}
          >● {tp("blue")}</button>
          <button
            onClick={() => setBrushClass(1)}
            className={`px-2 py-1 rounded border transition-all ${brushClass === 1 ? "border-red-500 bg-red-500/20 text-red-400" : "border-[var(--color-border)] text-[var(--color-text-muted)]"}`}
          >● {tp("red")}</button>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <span className="text-[var(--color-text-muted)] whitespace-nowrap">{tp("hidden")}</span>
          <input
            type="range" min={2} max={8} value={hiddenSize}
            onChange={e => setHiddenSize(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
          />
          <span className="text-[var(--color-primary)] font-bold w-4 text-center">{hiddenSize}</span>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative rounded-lg overflow-hidden border border-[var(--color-border)]" style={{ aspectRatio: "4/3" }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair"
          style={{ imageRendering: "pixelated", background: "var(--color-bg-section)" }}
        />
        {points.length < 2 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center font-mono space-y-1 bg-[var(--color-bg)]/80 px-4 py-3 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-[var(--color-text-muted)]">{tp("clickToPlace")}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{tp("addBothPoints")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Status & controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className={`${training ? "nn-training text-green-400" : "text-[var(--color-text-muted)]"}`}>
            {training ? `● ${tp("training")}` : `○ ${tp("idle")}`}
          </span>
          <span className="text-[var(--color-text-muted)]">{tp("epoch")} <span className="text-[var(--color-primary)]">{epoch}</span></span>
          <span className="text-[var(--color-text-muted)]">{tp("accuracy")} <span className={`font-bold ${accuracy >= 80 ? "text-green-400" : accuracy >= 50 ? "text-amber-400" : "text-[var(--color-text)]"}`}>{accuracy}%</span></span>
          <span className="text-[var(--color-text-muted)]">{tp("points")} {points.length}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleTraining}
            disabled={points.length < 2}
            className={`min-h-[36px] px-4 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
              training
                ? "border-amber-500/50 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                : "border-green-500/50 text-green-400 bg-green-500/10 hover:bg-green-500/20"
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {training ? `⏸ ${tp("pause")}` : `▶ ${tp("train")}`}
          </button>
          <button
            onClick={clearAll}
            className="min-h-[36px] px-4 py-1.5 rounded-lg font-mono text-xs font-bold border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all"
          >
            ✕ {tp("clear")}
          </button>
        </div>
      </div>

      {/* Network diagram */}
      <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-section)]">
        <p className="text-[10px] font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">{tp("networkArch")}</p>
        <div className="flex items-center justify-center gap-6 sm:gap-10 py-2">
          {/* Input layer */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase">{tp("inputLayer")}</span>
            {["x", "y"].map(label => (
              <div key={label} className="w-8 h-8 rounded-full border-2 border-blue-500/60 bg-blue-500/10 flex items-center justify-center">
                <span className="text-[10px] font-mono text-blue-400 font-bold">{label}</span>
              </div>
            ))}
          </div>
          {/* Lines placeholder */}
          <div className="text-[var(--color-text-muted)] text-lg">→</div>
          {/* Hidden layer */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase">{tp("hiddenLayer")}({hiddenSize})</span>
            <div className="flex flex-col items-center gap-1" style={{ maxHeight: 120, overflow: "hidden" }}>
              {Array.from({ length: Math.min(hiddenSize, 6) }, (_, i) => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 border-purple-500/60 bg-purple-500/10 flex items-center justify-center ${training ? "nn-training" : ""}`}>
                  <span className="text-[8px] font-mono text-purple-400">{i + 1}</span>
                </div>
              ))}
              {hiddenSize > 6 && <span className="text-[9px] text-[var(--color-text-muted)]">+{hiddenSize - 6}</span>}
            </div>
          </div>
          <div className="text-[var(--color-text-muted)] text-lg">→</div>
          {/* Output */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase">{tp("outputLayer")}</span>
            <div className="w-8 h-8 rounded-full border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center">
              <span className="text-[10px] font-mono text-green-400 font-bold">σ</span>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
});
