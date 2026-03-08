"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Shape, Arrow } from "./types";
import type { DynamicTranslate } from "@/lib/i18n-utils";

interface ArrowPathResult {
  d: string;
  mx: number;
  my: number;
}

interface ShapeEditorsProps {
  t: DynamicTranslate;
  editingId: string | null;
  shapes: Shape[];
  editText: string;
  setEditText: Dispatch<SetStateAction<string>>;
  commitShapeEdit: () => void;
  setEditingId: Dispatch<SetStateAction<string | null>>;
  editingArrowId: string | null;
  arrows: Arrow[];
  arrowPath: (a: Arrow) => ArrowPathResult | null;
  arrowEditText: string;
  setArrowEditText: Dispatch<SetStateAction<string>>;
  commitArrowEdit: () => void;
  setEditingArrowId: Dispatch<SetStateAction<string | null>>;
}

/* ── inline edit handlers for shapes and arrows ───────────────── */
export function ShapeEditors({
  t, editingId, shapes, editText, setEditText, commitShapeEdit, setEditingId,
  editingArrowId, arrows, arrowPath, arrowEditText, setArrowEditText, commitArrowEdit, setEditingArrowId,
}: ShapeEditorsProps) {
  return (
    <>
      {/* inline edit for shape label */}
      {editingId && (() => {
        const s = shapes.find((n) => n.id === editingId);
        if (!s) return null;
        return (
          <foreignObject x={s.x - 70} y={s.y - 14} width={140} height={28}>
            <input
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={commitShapeEdit}
              onKeyDown={(e) => { if (e.key === "Enter") commitShapeEdit(); if (e.key === "Escape") setEditingId(null); }}
              className="w-full h-full text-center text-xs rounded px-1"
              style={{ background: "var(--color-bg)", color: "var(--color-text)", border: "2px solid var(--color-primary)", outline: "none" }}
            />
          </foreignObject>
        );
      })()}

      {/* inline edit for arrow label */}
      {editingArrowId && (() => {
        const a = arrows.find((ar) => ar.id === editingArrowId);
        if (!a) return null;
        const path = arrowPath(a);
        if (!path) return null;
        return (
          <foreignObject x={path.mx - 50} y={path.my - 24} width={100} height={24}>
            <input
              autoFocus
              value={arrowEditText}
              placeholder={t("arrowLabelPlaceholder")}
              onChange={(e) => setArrowEditText(e.target.value)}
              onBlur={commitArrowEdit}
              onKeyDown={(e) => { if (e.key === "Enter") commitArrowEdit(); if (e.key === "Escape") setEditingArrowId(null); }}
              className="w-full h-full text-center text-[10px] rounded px-1"
              style={{ background: "var(--color-bg)", color: "var(--color-text)", border: "2px solid var(--color-primary)", outline: "none" }}
            />
          </foreignObject>
        );
      })()}
    </>
  );
}
