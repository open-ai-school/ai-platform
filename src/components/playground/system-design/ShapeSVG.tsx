"use client";

import type { ShapeKind } from "./types";
import { W, H } from "./types";

/* ── shape SVG renderers ──────────────────────────────────────── */
export function ShapeSVG({ kind, color, w = W, h = H }: { kind: ShapeKind; color: string; w?: number; h?: number }) {
  const f = `${color}22`, s = color;
  switch (kind) {
    case "server":
      return <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={f} stroke={s} strokeWidth={2} />;
    case "database":
      return (
        <g>
          <ellipse cx={0} cy={0} rx={w / 2.4} ry={h / 2} fill={f} stroke={s} strokeWidth={2} />
          <ellipse cx={0} cy={-h / 4} rx={w / 2.4} ry={h / 5} fill="none" stroke={s} strokeWidth={1} opacity={0.4} />
        </g>
      );
    case "decision":
      return <polygon points={`0,${-h / 1.5} ${w / 2},0 0,${h / 1.5} ${-w / 2},0`} fill={f} stroke={s} strokeWidth={2} />;
    case "service":
      return <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={f} stroke={s} strokeWidth={2} />;
    case "queue":
      return (
        <g>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={4} fill={f} stroke={s} strokeWidth={2} />
          <line x1={w / 2 - 18} y1={-h / 2 + 6} x2={w / 2 - 18} y2={h / 2 - 6} stroke={s} strokeWidth={1.5} />
          <line x1={w / 2 - 30} y1={-h / 2 + 6} x2={w / 2 - 30} y2={h / 2 - 6} stroke={s} strokeWidth={1.5} />
        </g>
      );
    case "client":
      return (
        <g>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={f} stroke={s} strokeWidth={2} />
          <rect x={-w / 2 + 6} y={-h / 2 + 4} width={w - 12} height={h - 18} rx={2} fill="none" stroke={s} strokeWidth={1} opacity={0.4} />
        </g>
      );
    case "cloud":
      return (
        <g>
          <ellipse cx={0} cy={2} rx={w / 2.2} ry={h / 2.5} fill={f} stroke={s} strokeWidth={2} />
          <ellipse cx={-w / 5} cy={-h / 6} rx={w / 5} ry={h / 4} fill={f} stroke={s} strokeWidth={1.5} />
          <ellipse cx={w / 6} cy={-h / 5} rx={w / 4} ry={h / 3.5} fill={f} stroke={s} strokeWidth={1.5} />
        </g>
      );
    case "text":
      return <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="transparent" stroke="none" />;
  }
}
