"use client";

import type { Dispatch, SetStateAction } from "react";
import type { ShapeKind } from "./types";
import { COLORS, PALETTE } from "./types";
import type { DynamicTranslate } from "@/lib/i18n-utils";

interface CanvasToolbarProps {
  t: DynamicTranslate;
  activeTool: ShapeKind | null;
  connectMode: boolean;
  zoomPct: number;
  saveIndicator: string | null;
  statusText: string;
  setShowPicker: Dispatch<SetStateAction<boolean>>;
  clearAll: () => void;
  undo: () => void;
  setConnectMode: Dispatch<SetStateAction<boolean>>;
  setConnectFrom: Dispatch<SetStateAction<string | null>>;
  setActiveTool: Dispatch<SetStateAction<ShapeKind | null>>;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
}

/* ── toolbar ──────────────────────────────────────────────────── */
export function CanvasToolbar({
  t, activeTool, connectMode, zoomPct, saveIndicator, statusText,
  setShowPicker, clearAll, undo, setConnectMode, setConnectFrom, setActiveTool,
  zoomIn, zoomOut, zoomReset,
}: CanvasToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-card)" }}>
      {/* file actions */}
      <button onClick={() => setShowPicker(true)} className="px-2.5 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} title={t("myDesignsTooltip")}>
        📁
      </button>
      <button onClick={clearAll} className="px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#ef4444", color: "#fff" }} title={t("clearTooltip")}>
        🗑
      </button>
      <button onClick={undo} className="px-2.5 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} title={t("undoTooltip")}>
        ↩
      </button>
      <div className="w-px h-5 mx-0.5" style={{ background: "var(--color-border)" }} />

      {/* connect */}
      <button
        onClick={() => { setConnectMode((c) => !c); setConnectFrom(null); setActiveTool(() => null); }}
        className="px-2.5 py-1.5 rounded-lg text-xs font-medium border"
        style={{
          borderColor: connectMode ? "var(--color-primary)" : "var(--color-border)",
          background: connectMode ? "var(--color-primary)" : "transparent",
          color: connectMode ? "#fff" : "var(--color-text)",
        }}
        title={t("connectTooltip")}
      >
        →
      </button>
      <div className="w-px h-5 mx-0.5" style={{ background: "var(--color-border)" }} />

      {/* shape palette */}
      {PALETTE.map((p) => (
        <button
          key={p.kind}
          onClick={() => { setActiveTool((prev) => (prev === p.kind ? null : p.kind)); setConnectMode(() => false); }}
          className="px-2 py-1.5 rounded-lg text-[11px] font-medium border transition-all"
          style={{
            borderColor: activeTool === p.kind ? COLORS[p.kind] : "var(--color-border)",
            background: activeTool === p.kind ? `${COLORS[p.kind]}20` : "transparent",
            color: activeTool === p.kind ? COLORS[p.kind] : "var(--color-text)",
          }}
          title={t(p.labelKey)}
        >
          <span className="mr-0.5">{p.icon}</span><span className="hidden sm:inline">{t(p.labelKey)}</span>
        </button>
      ))}
      <div className="w-px h-5 mx-0.5" style={{ background: "var(--color-border)" }} />

      {/* zoom controls */}
      <button onClick={zoomOut} className="px-2 py-1.5 rounded-lg text-xs font-bold border" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} title={t("zoomOutTooltip")}>−</button>
      <button onClick={zoomReset} className="px-2 py-1.5 rounded-lg text-[10px] font-mono border min-w-[42px] text-center" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} title={t("resetZoomTooltip")}>{zoomPct}%</button>
      <button onClick={zoomIn} className="px-2 py-1.5 rounded-lg text-xs font-bold border" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} title={t("zoomInTooltip")}>+</button>

      {/* save indicator + status */}
      <span className="ml-auto flex items-center gap-2 text-[10px]" style={{ color: "var(--color-text-muted)" }}>
        {saveIndicator && <span className="text-emerald-500 font-medium animate-pulse">✓ {saveIndicator}</span>}
        <span className="hidden sm:inline">{statusText}</span>
      </span>
    </div>
  );
}
