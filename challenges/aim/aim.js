// ==================== AIM TRAINER ====================

function getAimPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { targets: 10, targetSize: 60, timeLimit: 20, shrinkRate: 0 },
    medium:     { targets: 15, targetSize: 50, timeLimit: 20, shrinkRate: 0.1 },
    hard:       { targets: 20, targetSize: 40, timeLimit: 18, shrinkRate: 0.15 },
    extreme:    { targets: 25, targetSize: 32, timeLimit: 16, shrinkRate: 0.2 },
    impossible: { targets: 30, targetSize: 26, timeLimit: 15, shrinkRate: 0.25 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderAim(puzzle) {
  const state = {
    puzzle, hit: 0, miss: 0, total: puzzle.targets,
    currentSize: puzzle.targetSize, times: [],
    targetTime: 0, done: false, timeLeft: puzzle.timeLimit, timer: null
  };
  GS.challengeState.aim = state;

  const c = document.getElementById('game-container');
  c.innerHTML = `<div class="aim-game">
    <div class="aim-header">
      <span>🎯 <span id="aim-hit">0</span>/${state.total}</span>
      <span>Miss: <span id="aim-miss">0</span></span>
      <span>⏱ <span id="aim-time">${GS.timerEnabled ? state.timeLeft : '∞'}</span>s</span>
    </div>
    <div class="aim-arena" id="aim-arena" onclick="aimMiss(event)">
      <div class="aim-start-msg" id="aim-start-msg">Click anywhere to start!</div>
    </div>
  </div>`;
}

function aimMiss(e) {
  const state = GS.challengeState.aim;
  if (state.done) return;
  if (e.target.classList.contains('aim-target')) return;
  if (document.getElementById('aim-start-msg')) {
    document.getElementById('aim-start-msg').remove();
    spawnAimTarget(state);
    if (GS.timerEnabled) startAimTimer(state);
    return;
  }
  state.miss++;
  const el = document.getElementById('aim-miss');
  if (el) el.textContent = state.miss;
  SFX.wrong();
}

function spawnAimTarget(state) {
  if (state.done || state.hit >= state.total) { finishAim(state); return; }
  const arena = document.getElementById('aim-arena');
  if (!arena) return;
  // Remove old target
  const old = arena.querySelector('.aim-target');
  if (old) old.remove();

  const size = Math.max(16, Math.round(state.currentSize));
  const rect = arena.getBoundingClientRect();
  const maxX = rect.width - size - 10;
  const maxY = rect.height - size - 10;
  const x = 10 + Math.random() * maxX;
  const y = 10 + Math.random() * maxY;

  const target = document.createElement('div');
  target.className = 'aim-target';
  target.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  target.onclick = function(e) {
    e.stopPropagation();
    hitAimTarget(state);
  };
  arena.appendChild(target);
  state.targetTime = performance.now();
}

function hitAimTarget(state) {
  if (state.done) return;
  const time = Math.round(performance.now() - state.targetTime);
  state.times.push(time);
  state.hit++;
  state.currentSize -= state.puzzle.shrinkRate * state.puzzle.targetSize;
  SFX.pop();

  document.getElementById('aim-hit').textContent = state.hit;

  if (state.hit >= state.total) {
    finishAim(state);
  } else {
    spawnAimTarget(state);
  }
}

function startAimTimer(state) {
  state.timer = setInterval(() => {
    state.timeLeft--;
    const el = document.getElementById('aim-time');
    if (el) {
      el.textContent = state.timeLeft;
      if (state.timeLeft <= 5) el.style.color = 'var(--red)';
    }
    if (state.timeLeft <= 0) finishAim(state);
  }, 1000);
}

function finishAim(state) {
  if (state.done) return;
  state.done = true;
  if (state.timer) clearInterval(state.timer);

  const accuracy = state.hit + state.miss > 0 ? Math.round(state.hit / (state.hit + state.miss) * 100) : 0;
  const avgTime = state.times.length > 0 ? Math.round(state.times.reduce((a,b) => a+b, 0) / state.times.length) : 0;
  const completion = Math.round((state.hit / state.total) * 100);
  const score = Math.min(100, Math.round(completion * 0.6 + accuracy * 0.4));

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('aim', score);
    lsSet('daily-aim-state-' + getDailyDateStr(), { hit: state.hit, miss: state.miss, total: state.total, avgTime, accuracy });
  }
  showChallengeSummary({
    emoji: score >= 90 ? '🎯' : score >= 60 ? '🎪' : '😵',
    score,
    title: score >= 90 ? 'Sharpshooter!' : score >= 60 ? 'Good Aim!' : 'Keep Practicing!',
    stats: [
      { label: 'Targets hit', value: `${state.hit} / ${state.total}` },
      { label: 'Misses', value: state.miss },
      { label: 'Accuracy', value: accuracy + '%' },
      { label: 'Avg speed', value: avgTime + 'ms' }
    ]
  });
}
