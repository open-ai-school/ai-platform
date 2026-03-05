"use client";

import { useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const SHAPES = ["circle", "square", "triangle", "line", "star"];
const SHAPE_EMOJIS: Record<string, string> = {
  circle: "⭕",
  square: "⬜",
  triangle: "🔺",
  line: "➖",
  star: "⭐",
};

export function DrawingRecogniser() {
  const t = useTranslations("playground.imageClassifier");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [predictions, setPredictions] = useState<
    { label: string; confidence: number }[]
  >([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    []
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#6366f1";
      ctx.lineTo(x, y);
      ctx.stroke();
      setHasDrawn(true);
    },
    [isDrawing]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    if (hasDrawn) {
      analyseDrawing();
    }
  }, [hasDrawn]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPredictions([]);
    setHasDrawn(false);
  }, []);

  const analyseDrawing = useCallback(() => {
    // Simple heuristic-based analysis for demo purposes
    // In production, this would use TensorFlow.js with a trained model
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Count drawn pixels and their positions
    let drawnPixels = 0;
    let sumX = 0, sumY = 0;
    let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 50) {
        drawnPixels++;
        const px = (i / 4) % canvas.width;
        const py = Math.floor(i / 4 / canvas.width);
        sumX += px;
        sumY += py;
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      }
    }

    if (drawnPixels < 10) return;

    const width = maxX - minX;
    const height = maxY - minY;
    const aspectRatio = width / (height || 1);
    const density = drawnPixels / ((width * height) || 1);

    // Simple shape heuristics
    const scores: Record<string, number> = {
      circle: 0,
      square: 0,
      triangle: 0,
      line: 0,
      star: 0,
    };

    // Circle: aspect ratio ~1, moderate density
    if (aspectRatio > 0.7 && aspectRatio < 1.4) scores.circle += 40;
    if (density > 0.01 && density < 0.05) scores.circle += 30;

    // Square: aspect ratio ~1, higher density
    if (aspectRatio > 0.7 && aspectRatio < 1.4) scores.square += 30;
    if (density > 0.03 && density < 0.08) scores.square += 20;

    // Triangle: moderate aspect, lower density
    if (aspectRatio > 0.6 && aspectRatio < 1.6) scores.triangle += 20;
    if (density > 0.005 && density < 0.03) scores.triangle += 25;

    // Line: extreme aspect ratio
    if (aspectRatio > 2.5 || aspectRatio < 0.4) scores.line += 60;

    // Star: many drawn pixels, complex shape
    if (drawnPixels > 500) scores.star += 20;
    if (density > 0.02 && density < 0.06) scores.star += 15;

    // Add randomness for realism
    Object.keys(scores).forEach((key) => {
      scores[key] += Math.random() * 15;
    });

    // Normalize to percentages
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const sorted = SHAPES.map((shape) => ({
      label: shape,
      confidence: Math.round((scores[shape] / total) * 100),
    })).sort((a, b) => b.confidence - a.confidence);

    setPredictions(sorted);
  }, []);

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full max-w-md mx-auto border-2 border-dashed border-[var(--color-border)] rounded-xl cursor-crosshair bg-white touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-[var(--color-text-muted)] text-lg">
              ✏️ {t("draw")}
            </p>
          </div>
        )}
      </div>

      {/* Clear button */}
      <div className="text-center">
        <button
          onClick={clearCanvas}
          className="px-6 py-2 border border-[var(--color-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-bg)] transition-colors"
        >
          🗑️ {t("clear")}
        </button>
      </div>

      {/* Predictions */}
      {predictions.length > 0 && (
        <div className="max-w-md mx-auto">
          <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">
            {t("guess")}
          </h3>
          <div className="space-y-2">
            {predictions.map((pred, idx) => (
              <div
                key={pred.label}
                className="flex items-center gap-3"
              >
                <span className="text-xl w-8">
                  {SHAPE_EMOJIS[pred.label]}
                </span>
                <span className="text-sm font-medium w-20 capitalize">
                  {t(`shapes.${pred.label}`)}
                </span>
                <div className="flex-1 bg-[var(--color-bg)] rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-primary)]/30"
                    }`}
                    style={{ width: `${pred.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-mono w-10 text-right">
                  {pred.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
