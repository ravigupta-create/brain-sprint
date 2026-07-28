// ==================== GHOST RACE ====================
// Records per-challenge input timelines so the player can race their best run.
// v1 focus: a live "ghost timer" strip during any timed challenge that shows the
// delta vs. the best recorded run. Zero coupling to individual challenge code —
// just piggybacks on GS.timer* and the score-lands-here point (showChallengeSummary).
//
// Data model (localStorage: bs-ghost):
//   { [`${challenge}-${difficulty}`]: { time, score, ts, events?: [{t, name, data?}] } }
//
// A "record" is stored only when it beats the previous best time at the same
// (challenge, difficulty) AND both scores are within 5 pts of each other (so a
// fast garbage run doesn't overwrite a slow perfect run).

const Ghost = (function () {
  const STORAGE_KEY = 'ghost';
  const RAF_INTERVAL_MS = 100;

  let recording = null; // { challenge, difficulty, events, startedAt }
  let replay = null;    // { data, rafHandle, hostEl }

  function _all() { return lsGet(STORAGE_KEY, {}); }
  function _save(obj) { lsSet(STORAGE_KEY, obj); }
  function _key(ch, diff) { return `${ch}-${diff}`; }

  function has(challenge, difficulty) {
    return !!_all()[_key(challenge, difficulty)];
  }
  function best(challenge, difficulty) {
    return _all()[_key(challenge, difficulty)] || null;
  }

  // Called by the timer when a challenge run begins.
  function begin(challenge, difficulty) {
    stopReplay();
    recording = { challenge, difficulty, events: [], startedAt: performance.now() };
    _mountBar(challenge, difficulty);
    _armReplayIfAvailable(challenge, difficulty);
  }

  // Optional: challenges can log semantic events (unused by v1 UI but persisted for future replay).
  function event(name, data) {
    if (!recording) return;
    recording.events.push({ t: Math.round(performance.now() - recording.startedAt), name, data });
    if (recording.events.length > 5000) recording.events.length = 5000;
  }

  // Called from showChallengeSummary — persist if it beats prior best time at similar quality.
  function finalize(score) {
    stopReplay();
    if (!recording) { _unmountBar(); return; }
    const { challenge, difficulty, events, startedAt } = recording;
    recording = null;
    const time = Math.round(performance.now() - startedAt);
    const all = _all();
    const prev = all[_key(challenge, difficulty)];
    const qualifies = !prev || (score >= (prev.score - 5) && time < prev.time);
    if (qualifies && time > 500) { // ignore trivial <0.5s runs
      all[_key(challenge, difficulty)] = {
        time, score, ts: Date.now(),
        events: events.length > 0 ? events : undefined
      };
      _save(all);
    }
    _unmountBar();
  }

  // If the user backs out of a challenge without finishing, drop the recording.
  function cancel() {
    recording = null;
    stopReplay();
    _unmountBar();
  }

  function stopReplay() {
    if (replay && replay.rafHandle) cancelAnimationFrame(replay.rafHandle);
    replay = null;
  }

  function _armReplayIfAvailable(challenge, difficulty) {
    const b = best(challenge, difficulty);
    if (!b) return;
    replay = { data: b };
    _tick();
  }

  function _tick() {
    if (!replay || !recording) return;
    const elapsed = performance.now() - recording.startedAt;
    _updateBar(elapsed);
    replay.rafHandle = requestAnimationFrame(_tick);
  }

  function _mountBar(challenge, difficulty) {
    _unmountBar();
    const host = document.getElementById('game-container');
    if (!host) return;
    const b = best(challenge, difficulty);
    const bar = document.createElement('div');
    bar.id = 'ghost-bar';
    bar.className = 'ghost-bar';
    bar.innerHTML = b
      ? `<span class="ghost-bar-label">👻 Racing your best</span>
         <span class="ghost-bar-target">${_fmt(b.time)}</span>
         <span id="ghost-bar-delta" class="ghost-bar-delta ghost-delta-ahead">±0.00s</span>`
      : `<span class="ghost-bar-label">👻 Recording your run…</span>`;
    host.parentNode.insertBefore(bar, host);
  }

  function _updateBar(elapsedMs) {
    if (!replay) return;
    const el = document.getElementById('ghost-bar-delta');
    if (!el) return;
    const target = replay.data.time;
    const delta = elapsedMs - target;
    if (delta <= 0) {
      el.textContent = '−' + _fmt(-delta);
      el.className = 'ghost-bar-delta ghost-delta-ahead';
    } else {
      el.textContent = '+' + _fmt(delta);
      el.className = 'ghost-bar-delta ghost-delta-behind';
    }
  }

  function _unmountBar() {
    const el = document.getElementById('ghost-bar');
    if (el) el.remove();
  }

  function _fmt(ms) {
    const s = ms / 1000;
    return s < 10 ? s.toFixed(2) + 's' : s.toFixed(1) + 's';
  }

  // Clear a stored ghost (exposed for a future "reset best" button; unused by UI in v1).
  function clear(challenge, difficulty) {
    const all = _all();
    delete all[_key(challenge, difficulty)];
    _save(all);
  }

  return { begin, event, finalize, cancel, has, best, clear };
})();
if (typeof globalThis !== 'undefined') globalThis.Ghost = Ghost;
