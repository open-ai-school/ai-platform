"use client";

import type { SavedCanvas } from "./types";
import type { DynamicTranslate } from "@/lib/i18n-utils";

interface CanvasPickerProps {
  t: DynamicTranslate;
  savedList: SavedCanvas[];
  newCanvas: () => void;
  loadCanvas: (c: SavedCanvas) => void;
  deleteCanvas: (id: string) => void;
}

/* ── canvas picker overlay ────────────────────────────────────── */
export function CanvasPicker({ t, savedList, newCanvas, loadCanvas, deleteCanvas }: CanvasPickerProps) {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-6 p-8" style={{ color: "var(--color-text)", minHeight: 450, background: "var(--color-bg-card)" }}>
      <h3 className="text-lg font-semibold">{t("yourDesigns")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl">
        {/* new canvas card */}
        <button
          onClick={newCanvas}
          className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all hover:scale-[1.02]"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          <span className="text-3xl">+</span>
          <span className="text-sm font-medium">{t("newCanvas")}</span>
        </button>
        {/* saved canvases */}
        {savedList.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]"
            style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
            onClick={() => loadCanvas(c)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold truncate">{c.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteCanvas(c.id); }}
                className="text-xs px-1.5 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                style={{ color: "#ef4444" }}
                title={t("deleteTooltip")}
              >✕</button>
            </div>
            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              {t("shapesArrows", { shapes: c.data.shapes?.length || 0, arrows: c.data.arrows?.length || 0 })}
            </span>
            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              {new Date(c.updatedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
      {savedList.length === 0 && (
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{t("noDesigns")}</p>
      )}
    </div>
  );
}
