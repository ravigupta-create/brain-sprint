// ==================== REACTION TIME ====================

function getReactionPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { rounds: 3, targetMs: 500 },
    medium:     { rounds: 5, targetMs: 400 },
    hard:       { rounds: 5, targetMs: 300 },
    extreme:    { rounds: 7, targetMs: 250 },
    impossible: { rounds: 7, targetMs: 200 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderReaction(puzzle) {
  const state = {
    puzzle,
    round: 0,
    totalRounds: puzzle.rounds,
    times: [],
    phase: 'waiting', // waiting, red, green, result, tooEarly
    greenTime: 0,
    timeout: null,
    done: false
  };
  GS.challengeState.reaction = state;
  const c = document.getElementById('game-container');
  c.innerHTML = `<div class="reaction-game">
    <div class="reaction-round">Round <span id="rx-round">1</span> / ${state.totalRounds}</div>
    <div class="reaction-zone" id="rx-zone" onclick="handleReactionClick()">
      <div class="reaction-text" id="rx-text">Tap to start</div>
      <div class="reaction-time-display" id="rx-time-display"></div>
    </div>
    <div class="reaction-results" id="rx-results"></div>
  </div>`;
}

function handleReactionClick() {
  const state = GS.challengeState.reaction;
  if (state.done) return;

  const zone = document.getElementById('rx-zone');
  const text = document.getElementById('rx-text');
  const timeDisplay = document.getElementById('rx-time-display');

  if (state.phase === 'waiting' || state.phase === 'result' || state.phase === 'tooEarly') {
    // Start new round - go to red
    state.phase = 'red';
    zone.className = 'reaction-zone reaction-red';
    text.textContent = 'Wait for green...';
    timeDisplay.textContent = '';
    const delay = 1000 + Math.random() * 3000;
    state.timeout = setTimeout(() => {
      if (state.phase !== 'red') return;
      state.phase = 'green';
      state.greenTime = performance.now();
      zone.className = 'reaction-zone reaction-green';
      text.textContent = 'CLICK NOW!';
    }, delay);
  } else if (state.phase === 'red') {
    // Too early!
    clearTimeout(state.timeout);
    state.phase = 'tooEarly';
    zone.className = 'reaction-zone reaction-early';
    text.textContent = 'Too early!';
    timeDisplay.textContent = 'Tap to retry this round';
    SFX.wrong();
  } else if (state.phase === 'green') {
    // Record time
    const reactionTime = Math.round(performance.now() - state.greenTime);
    state.times.push(reactionTime);
    state.round++;
    state.phase = 'result';
    zone.className = 'reaction-zone reaction-result';
    text.textContent = `${reactionTime}ms`;
    const quality = reactionTime < 200 ? 'Incredible!' : reactionTime < 300 ? 'Great!' : reactionTime < 400 ? 'Good' : reactionTime < 500 ? 'OK' : 'Slow';
    timeDisplay.textContent = quality;
    SFX.correct();
    document.getElementById('rx-round').textContent = Math.min(state.round + 1, state.totalRounds);
    updateReactionResults(state);

    if (state.round >= state.totalRounds) {
      setTimeout(() => finishReaction(state), 1000);
    } else {
      timeDisplay.textContent += ' — Tap for next round';
    }
  }
}

function updateReactionResults(state) {
  const el = document.getElementById('rx-results');
  let html = '<div class="reaction-times">';
  state.times.forEach((t, i) => {
    const cls = t < 250 ? 'fast' : t < 400 ? 'good' : 'slow';
    html += `<span class="rx-time-badge ${cls}">${t}ms</span>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

function finishReaction(state) {
  state.done = true;
  const avg = Math.round(state.times.reduce((a, b) => a + b, 0) / state.times.length);
  const best = Math.min(...state.times);
  const target = state.puzzle.targetMs;
  // Score: how much faster than target? 100 if avg <= target*0.6, 0 if avg >= target*2
  const ratio = avg / target;
  let score;
  if (ratio <= 0.6) score = 100;
  else if (ratio <= 1.0) score = Math.round(60 + (1 - ratio) / 0.4 * 40);
  else if (ratio <= 2.0) score = Math.round(60 * (1 - (ratio - 1)));
  else score = 0;
  score = Math.max(0, Math.min(100, score));

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('reaction', score);
    lsSet('daily-reaction-state-' + getDailyDateStr(), { times: state.times, avg, best });
  }
  showChallengeSummary({
    emoji: score === 100 ? '⚡' : score >= 60 ? '🏎️' : '🐢',
    score,
    title: avg < 250 ? 'Lightning Reflexes!' : avg < 350 ? 'Sharp!' : avg < 450 ? 'Decent' : 'Need More Coffee?',
    stats: [
      { label: 'Average', value: avg + 'ms' },
      { label: 'Best', value: best + 'ms' },
      { label: 'Target', value: '< ' + state.puzzle.targetMs + 'ms' },
      { label: 'Rounds', value: state.times.length }
    ]
  });
}
