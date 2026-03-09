// ==================== RHYTHM TAP ====================

function getRhythmPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { startBeats: 3, maxLevel: 6,  tolerance: 200, lives: 3 },
    medium:     { startBeats: 4, maxLevel: 8,  tolerance: 150, lives: 3 },
    hard:       { startBeats: 4, maxLevel: 9,  tolerance: 120, lives: 2 },
    extreme:    { startBeats: 5, maxLevel: 10, tolerance: 100, lives: 2 },
    impossible: { startBeats: 5, maxLevel: 12, tolerance: 80,  lives: 1 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderRhythm(puzzle) {
  const state = {
    puzzle, level: 1, beatCount: puzzle.startBeats,
    pattern: [], // timestamps relative to first beat
    playerTaps: [],
    phase: 'listen', // listen, tap, feedback
    lives: puzzle.lives, maxLives: puzzle.lives,
    maxLevel: 0, done: false, playbackTimer: null, startTime: 0
  };
  GS.challengeState.rhythm = state;
  showRhythmUI(state);
}

function showRhythmUI(state) {
  const c = document.getElementById('game-container');
  c.innerHTML = `<div class="rhythm-game">
    <div class="rhythm-header">
      <span class="rhythm-level">Level ${state.level} — ${state.beatCount} beats</span>
      <span class="rhythm-lives">${'❤️'.repeat(state.lives)}${'🖤'.repeat(state.maxLives - state.lives)}</span>
    </div>
    <div class="rhythm-instruction" id="rhythm-instruction">Listen to the rhythm...</div>
    <div class="rhythm-visual" id="rhythm-visual">
      ${Array(state.beatCount).fill(0).map((_, i) => `<div class="rhythm-dot" id="rhythm-dot-${i}"></div>`).join('')}
    </div>
    <div class="rhythm-pad" id="rhythm-pad" onclick="tapRhythm()">
      <div class="rhythm-pad-text" id="rhythm-pad-text">🔊 Playing...</div>
    </div>
  </div>`;

  generateAndPlayRhythm(state);
}

function generateAndPlayRhythm(state) {
  // Generate rhythm pattern (timestamps in ms)
  const pattern = [0]; // first beat at time 0
  const minGap = 200;
  const maxGap = 600;
  for (let i = 1; i < state.beatCount; i++) {
    const gap = minGap + Math.floor(GS.rng() * (maxGap - minGap));
    pattern.push(pattern[i-1] + gap);
  }
  state.pattern = pattern;
  state.phase = 'listen';

  // Play the pattern with audio + visual
  playRhythmPattern(state, 0);
}

function playRhythmPattern(state, idx) {
  if (idx >= state.pattern.length) {
    // Done playing, switch to tap mode
    setTimeout(() => {
      state.phase = 'tap';
      state.playerTaps = [];
      state.startTime = 0;
      const inst = document.getElementById('rhythm-instruction');
      const padText = document.getElementById('rhythm-pad-text');
      if (inst) inst.textContent = 'Now tap the same rhythm!';
      if (padText) padText.textContent = '🥁 TAP HERE';
      // Reset dots
      for (let i = 0; i < state.beatCount; i++) {
        const dot = document.getElementById(`rhythm-dot-${i}`);
        if (dot) dot.classList.remove('rhythm-dot-active');
      }
    }, 500);
    return;
  }

  const delay = idx === 0 ? 500 : state.pattern[idx] - state.pattern[idx-1];
  setTimeout(() => {
    // Visual feedback
    const dot = document.getElementById(`rhythm-dot-${idx}`);
    if (dot) {
      dot.classList.add('rhythm-dot-active');
      setTimeout(() => dot.classList.remove('rhythm-dot-active'), 200);
    }
    // Audio - use different frequencies for variety
    rhythmBeep(400 + idx * 50);
    playRhythmPattern(state, idx + 1);
  }, idx === 0 ? 500 : delay);
}

function rhythmBeep(freq) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

function tapRhythm() {
  const state = GS.challengeState.rhythm;
  if (state.done || state.phase !== 'tap') return;

  const now = performance.now();
  if (state.playerTaps.length === 0) {
    state.startTime = now;
  }
  state.playerTaps.push(now - state.startTime);

  // Visual feedback
  const idx = state.playerTaps.length - 1;
  const dot = document.getElementById(`rhythm-dot-${idx}`);
  if (dot) dot.classList.add('rhythm-dot-player');
  rhythmBeep(400 + idx * 50);

  // Pulse the pad
  const pad = document.getElementById('rhythm-pad');
  if (pad) {
    pad.classList.add('rhythm-pad-pulse');
    setTimeout(() => pad.classList.remove('rhythm-pad-pulse'), 150);
  }

  if (state.playerTaps.length >= state.beatCount) {
    setTimeout(() => evaluateRhythm(state), 300);
  }
}

function evaluateRhythm(state) {
  state.phase = 'feedback';
  // Compare timing patterns (relative gaps)
  const expected = state.pattern;
  const actual = state.playerTaps;
  const tolerance = state.puzzle.tolerance;

  let totalError = 0;
  for (let i = 1; i < expected.length; i++) {
    const expectedGap = expected[i] - expected[i-1];
    const actualGap = actual[i] - actual[i-1];
    totalError += Math.abs(expectedGap - actualGap);
  }
  const avgError = totalError / (expected.length - 1);
  const passed = avgError <= tolerance;

  if (passed) {
    state.maxLevel = state.level;
    state.level++;
    state.beatCount++;
    SFX.correct();
    const inst = document.getElementById('rhythm-instruction');
    if (inst) inst.textContent = `✓ Great rhythm! (±${Math.round(avgError)}ms)`;
    setTimeout(() => showRhythmUI(state), 800);
  } else {
    state.lives--;
    SFX.wrong();
    const inst = document.getElementById('rhythm-instruction');
    if (inst) inst.textContent = `✗ Off by ±${Math.round(avgError)}ms (need ≤${tolerance}ms)`;
    if (state.lives <= 0) {
      setTimeout(() => finishRhythm(state), 800);
    } else {
      setTimeout(() => showRhythmUI(state), 1000);
    }
  }
}

function finishRhythm(state) {
  state.done = true;
  const target = state.puzzle.maxLevel;
  const score = Math.min(100, Math.round((state.maxLevel / target) * 100));

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('rhythm', score);
    lsSet('daily-rhythm-state-' + getDailyDateStr(), { maxLevel: state.maxLevel, maxBeats: state.puzzle.startBeats + state.maxLevel - 1 });
  }
  showChallengeSummary({
    emoji: score >= 90 ? '🥁' : score >= 60 ? '🎵' : '🔇',
    score,
    title: state.maxLevel >= 8 ? 'Rhythm Machine!' : state.maxLevel >= 4 ? 'Got the Beat!' : 'Keep the Tempo!',
    stats: [
      { label: 'Max level', value: state.maxLevel },
      { label: 'Max beats', value: state.puzzle.startBeats + state.maxLevel - 1 },
      { label: 'Tolerance', value: '±' + state.puzzle.tolerance + 'ms' }
    ]
  });
}
