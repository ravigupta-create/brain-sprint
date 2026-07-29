// ==================== WORKER CLIENT ====================
// Thin Promise wrapper around the solvers worker. Lazy-inits on first call.
// Auto-terminates after IDLE_MS to reclaim memory. Falls back to a rejected
// promise if Web Workers are unavailable so callers can degrade gracefully.

const Solvers = (function () {
  const IDLE_MS = 30_000;
  const DEFAULT_TIMEOUT_MS = 15_000;
  let worker = null;
  let idleTimer = null;
  let nextId = 1;
  const pending = new Map();

  function _ensure() {
    if (typeof Worker === 'undefined') return null;
    if (worker) return worker;
    try {
      worker = new Worker('shared/workers/solvers.worker.js');
      worker.onmessage = (ev) => {
        const { id, ok, result, error } = ev.data || {};
        const p = pending.get(id);
        if (!p) return;
        pending.delete(id);
        clearTimeout(p.timeoutHandle);
        _armIdle();
        ok ? p.resolve(result) : p.reject(new Error(error || 'worker error'));
      };
      worker.onerror = (err) => {
        // Fail every in-flight request; the worker may be dead.
        pending.forEach((p) => { clearTimeout(p.timeoutHandle); p.reject(err); });
        pending.clear();
        try { worker.terminate(); } catch (_) {}
        worker = null;
      };
    } catch (_) {
      worker = null;
    }
    return worker;
  }

  function _armIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (pending.size === 0 && worker) {
        try { worker.terminate(); } catch (_) {}
        worker = null;
      }
    }, IDLE_MS);
  }

  function run(type, payload, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    const w = _ensure();
    if (!w) return Promise.reject(new Error('workers unavailable'));
    return new Promise((resolve, reject) => {
      const id = nextId++;
      const timeoutHandle = setTimeout(() => {
        pending.delete(id);
        reject(new Error('solver timeout after ' + timeoutMs + 'ms'));
      }, timeoutMs);
      pending.set(id, { resolve, reject, timeoutHandle });
      try { w.postMessage({ id, type, payload }); }
      catch (e) { pending.delete(id); clearTimeout(timeoutHandle); reject(e); }
    });
  }

  // Web Workers require a real origin. Chrome/Safari refuse to construct a Worker
  // from a file:// document, so guard against that up front — otherwise the hint
  // button appears and blows up on click.
  function isAvailable() {
    if (typeof Worker === 'undefined') return false;
    try {
      const proto = (typeof location !== 'undefined' && location.protocol) || '';
      if (proto === 'file:') return false;
    } catch (_) {}
    return true;
  }

  return { run, isAvailable };
})();
if (typeof globalThis !== 'undefined') globalThis.Solvers = Solvers;
