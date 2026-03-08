// Simple neural network math
export function sigmoid(x: number): number { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); }
export function sigmoidDeriv(x: number): number { return x * (1 - x); }

export interface NNWeights {
  w1: number[][]; b1: number[];
  w2: number[]; b2: number;
}

export function initWeights(hidden: number): NNWeights {
  const rand = () => (Math.random() - 0.5) * 2;
  return {
    w1: Array.from({ length: hidden }, () => [rand(), rand()]),
    b1: Array.from({ length: hidden }, rand),
    w2: Array.from({ length: hidden }, rand),
    b2: rand(),
  };
}

export function forward(w: NNWeights, x: number, y: number): { hidden: number[]; output: number } {
  const hidden = w.w1.map((wh, i) => sigmoid(wh[0] * x + wh[1] * y + w.b1[i]));
  const output = sigmoid(hidden.reduce((s, h, i) => s + h * w.w2[i], 0) + w.b2);
  return { hidden, output };
}

export function trainStep(w: NNWeights, points: { x: number; y: number; cls: number }[], lr: number): NNWeights {
  const nw: NNWeights = {
    w1: w.w1.map(r => [...r]), b1: [...w.b1], w2: [...w.w2], b2: w.b2,
  };

  for (const p of points) {
    const { hidden, output } = forward(w, p.x, p.y);
    const err = p.cls - output;
    const dOut = err * sigmoidDeriv(output);

    for (let i = 0; i < w.w2.length; i++) {
      const dHidden = dOut * w.w2[i] * sigmoidDeriv(hidden[i]);
      nw.w2[i] += lr * dOut * hidden[i];
      nw.w1[i][0] += lr * dHidden * p.x;
      nw.w1[i][1] += lr * dHidden * p.y;
      nw.b1[i] += lr * dHidden;
    }
    nw.b2 += lr * dOut;
  }
  return nw;
}

export function computeAccuracy(w: NNWeights, points: { x: number; y: number; cls: number }[]): number {
  if (points.length === 0) return 0;
  let correct = 0;
  for (const p of points) {
    const { output } = forward(w, p.x, p.y);
    if ((output >= 0.5 ? 1 : 0) === p.cls) correct++;
  }
  return Math.round((correct / points.length) * 100);
}
