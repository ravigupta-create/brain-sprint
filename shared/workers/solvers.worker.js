// Brain Sprint solvers — pure computation, isolated from the main thread.
// No DOM, no imports; self-contained so each request is deterministic.
//
// Protocol:
//   post: { id, type, payload }
//   reply: { id, ok: true, result } | { id, ok: false, error }

self.addEventListener('message', (ev) => {
  const { id, type, payload } = ev.data || {};
  try {
    let result;
    switch (type) {
      case 'sliding-ida': result = slidingIDA(payload.tiles, payload.size); break;
      case 'ping':        result = 'pong'; break;
      default: throw new Error('unknown solver type: ' + type);
    }
    self.postMessage({ id, ok: true, result });
  } catch (e) {
    self.postMessage({ id, ok: false, error: String((e && e.message) || e) });
  }
});

// IDA* for the sliding puzzle. Optimal for size ≤ 4, weighted for size 5.
// Returns an array of empty-cell indices representing the moves, or null if not solved.
function slidingIDA(tiles, size) {
  const N = size * size;
  const goalRow = new Uint8Array(N);
  const goalCol = new Uint8Array(N);
  for (let v = 1; v < N; v++) {
    goalRow[v] = (v - 1) / size | 0;
    goalCol[v] = (v - 1) % size;
  }

  function manhattan(state) {
    let h = 0;
    for (let i = 0; i < N; i++) {
      const v = state[i];
      if (v === 0) continue;
      h += Math.abs((i / size | 0) - goalRow[v]) + Math.abs(i % size - goalCol[v]);
    }
    return h;
  }

  function linearConflict(state) {
    let lc = 0;
    for (let row = 0; row < size; row++) {
      const base = row * size;
      for (let i = base; i < base + size; i++) {
        const v = state[i];
        if (v === 0 || goalRow[v] !== row) continue;
        for (let j = i + 1; j < base + size; j++) {
          const w = state[j];
          if (w === 0 || goalRow[w] !== row) continue;
          if (goalCol[v] > goalCol[w]) lc++;
        }
      }
    }
    for (let col = 0; col < size; col++) {
      for (let i = col; i < N; i += size) {
        const v = state[i];
        if (v === 0 || goalCol[v] !== col) continue;
        for (let j = i + size; j < N; j += size) {
          const w = state[j];
          if (w === 0 || goalCol[w] !== col) continue;
          if (goalRow[v] > goalRow[w]) lc++;
        }
      }
    }
    return lc * 2;
  }

  const W = size <= 4 ? 1 : 2;
  const LIMIT = size <= 3 ? 500000 : size <= 4 ? 10000000 : 20000000;

  const state = new Int8Array(tiles);
  let empty = -1;
  for (let i = 0; i < N; i++) { if (state[i] === 0) { empty = i; break; } }

  const initH = manhattan(state) + linearConflict(state);
  if (initH === 0) return [];

  let nodeCount = 0;
  let found = false;
  const path = [];

  const DR = [-1, 1, 0, 0];
  const DC = [0, 0, -1, 1];
  const OPP = [1, 0, 3, 2];

  function search(eIdx, g, bound, lastDir) {
    const hVal = manhattan(state) + linearConflict(state);
    const f = g + W * hVal;
    if (f > bound) return f;
    if (hVal === 0) { found = true; return -1; }
    if (++nodeCount > LIMIT) return Infinity;

    let minT = Infinity;
    const eRow = eIdx / size | 0, eCol = eIdx % size;

    for (let dir = 0; dir < 4; dir++) {
      if (lastDir >= 0 && dir === OPP[lastDir]) continue;
      const nr = eRow + DR[dir], nc = eCol + DC[dir];
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      const ni = nr * size + nc;

      state[eIdx] = state[ni];
      state[ni] = 0;
      path.push(ni);

      const t = search(ni, g + 1, bound, dir);
      if (found) return -1;
      if (t < minT) minT = t;

      state[ni] = state[eIdx];
      state[eIdx] = 0;
      path.pop();
    }
    return minT;
  }

  let bound = W * initH;
  while (bound < Infinity && !found) {
    nodeCount = 0;
    const t = search(empty, 0, bound, -1);
    if (found) return Array.from(path);
    if (t === Infinity) break;
    bound = t;
  }
  return null;
}
