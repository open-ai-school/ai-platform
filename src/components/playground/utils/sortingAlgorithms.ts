export type SortAlgo = "bubble" | "quick" | "merge";

export interface AlgoState {
  name: string;
  array: number[];
  ops: number;
  done: boolean;
  comparing: number[];
  swapping: number[];
}

export function generateArray(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generator-based sorts that yield after each step
export function* bubbleSortGen(arr: number[]): Generator<{ array: number[]; comparing: number[]; swapping: number[]; ops: number }> {
  const a = [...arr];
  let ops = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      ops++;
      yield { array: [...a], comparing: [j, j + 1], swapping: [], ops };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { array: [...a], comparing: [], swapping: [j, j + 1], ops };
      }
    }
  }
  yield { array: [...a], comparing: [], swapping: [], ops };
}

export function* quickSortGen(arr: number[]): Generator<{ array: number[]; comparing: number[]; swapping: number[]; ops: number }> {
  const a = [...arr];
  let ops = 0;

  function* partition(lo: number, hi: number): Generator<{ array: number[]; comparing: number[]; swapping: number[]; ops: number }> {
    const pivot = a[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      ops++;
      yield { array: [...a], comparing: [j, hi], swapping: [], ops };
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        if (i !== j) yield { array: [...a], comparing: [], swapping: [i, j], ops };
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    yield { array: [...a], comparing: [], swapping: [i + 1, hi], ops };
  }

  function* qsort(lo: number, hi: number): Generator<{ array: number[]; comparing: number[]; swapping: number[]; ops: number }> {
    if (lo < hi) {
      const _pivot = a[lo + Math.floor((hi - lo + 1) / 2)]; // just for partition index
      // inline partition
      let i = lo - 1;
      for (let j = lo; j < hi; j++) {
        ops++;
        yield { array: [...a], comparing: [j, hi], swapping: [], ops };
        if (a[j] <= a[hi]) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          if (i !== j) yield { array: [...a], comparing: [], swapping: [i, j], ops };
        }
      }
      [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
      yield { array: [...a], comparing: [], swapping: [i + 1, hi], ops };
      const pi = i + 1;
      yield* qsort(lo, pi - 1);
      yield* qsort(pi + 1, hi);
    }
  }

  // Suppress unused warning
  void partition;
  yield* qsort(0, a.length - 1);
  yield { array: [...a], comparing: [], swapping: [], ops };
}

export function* mergeSortGen(arr: number[]): Generator<{ array: number[]; comparing: number[]; swapping: number[]; ops: number }> {
  const a = [...arr];
  let ops = 0;

  function* msort(lo: number, hi: number): Generator<{ array: number[]; comparing: number[]; swapping: number[]; ops: number }> {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    yield* msort(lo, mid);
    yield* msort(mid + 1, hi);

    // Merge
    const temp: number[] = [];
    let i = lo, j = mid + 1;
    while (i <= mid && j <= hi) {
      ops++;
      yield { array: [...a], comparing: [i, j], swapping: [], ops };
      if (a[i] <= a[j]) { temp.push(a[i++]); }
      else { temp.push(a[j++]); }
    }
    while (i <= mid) { temp.push(a[i++]); ops++; }
    while (j <= hi) { temp.push(a[j++]); ops++; }

    for (let k = 0; k < temp.length; k++) {
      a[lo + k] = temp[k];
      yield { array: [...a], comparing: [], swapping: [lo + k], ops };
    }
  }

  yield* msort(0, a.length - 1);
  yield { array: [...a], comparing: [], swapping: [], ops };
}

export const ALGO_COLORS: Record<SortAlgo, string> = {
  bubble: "#3B82F6",
  quick: "#A855F7",
  merge: "#00FF88",
};
