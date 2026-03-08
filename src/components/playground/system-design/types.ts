/* ── types ─────────────────────────────────────────────────────── */
export type ShapeKind = "server" | "database" | "decision" | "service" | "queue" | "client" | "cloud" | "text";

export interface Shape {
  id: string;
  kind: ShapeKind;
  x: number;
  y: number;
  label: string;
}

export interface Arrow {
  id: string;
  from: string;
  to: string;
  label: string;
}

export type CanvasData = { shapes: Shape[]; arrows: Arrow[] };
export type Snapshot = CanvasData;

export interface SavedCanvas {
  id: string;
  name: string;
  data: CanvasData;
  updatedAt: string;
}

export const STORAGE_KEY = "aieducademy-canvas";

export const COLORS: Record<ShapeKind, string> = {
  server: "#6366f1",
  database: "#06b6d4",
  decision: "#f59e0b",
  service: "#10b981",
  queue: "#8b5cf6",
  client: "#ec4899",
  cloud: "#3b82f6",
  text: "#94a3b8",
};

export const PALETTE: { kind: ShapeKind; labelKey: string; icon: string }[] = [
  { kind: "server", labelKey: "shapeServer", icon: "▭" },
  { kind: "database", labelKey: "shapeDB", icon: "◎" },
  { kind: "decision", labelKey: "shapeGate", icon: "◇" },
  { kind: "service", labelKey: "shapeService", icon: "⬭" },
  { kind: "queue", labelKey: "shapeQueue", icon: "⊞" },
  { kind: "client", labelKey: "shapeClient", icon: "◻" },
  { kind: "cloud", labelKey: "shapeCloud", icon: "☁" },
  { kind: "text", labelKey: "shapeText", icon: "T" },
];

export const W = 120, H = 60;
let _counter = Date.now();
export const uid = () => `n${++_counter}`;

/* ── zoom controls ────────────────────────────────────────────── */
export const ZOOM_MIN = 0.25, ZOOM_MAX = 3, ZOOM_STEP = 0.15;
