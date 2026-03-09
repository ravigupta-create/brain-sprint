// ==================== STROOP TEST ====================

const STROOP_COLORS = [
  { name: 'RED', hex: '#dc2626' },
  { name: 'BLUE', hex: '#2563eb' },
  { name: 'GREEN', hex: '#16a34a' },
  { name: 'YELLOW', hex: '#ca8a04' },
  { name: 'PURPLE', hex: '#9333ea' },
  { name: 'ORANGE', hex: '#ea580c' },
  { name: 'PINK', hex: '#db2777' },
  { name: 'TEAL', hex: '#0d9488' }
];

function getStroopPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { rounds: 8,  timePerRound: 5,  colorCount: 4, congruentChance: 0.4 },
    medium:     { rounds: 12, timePerRound: 4,  colorCount: 5, congruentChance: 0.25 },
    hard:       { rounds: 15, timePerRound: 3,  colorCount: 6, congruentChance: 0.15 },
    extreme:    { rounds: 18, timePerRound: 2.5, colorCount: 7, congruentChance: 0.1 },
    impossible: { rounds: 20, timePerRound: 2,  colorCount: 8, congruentChance: 0.05 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderStroop(puzzle) {
  const colors = STROOP_COLORS.slice(0, puzzle.colorCount);
  const state = {
    puzzle,
    colors,
    round: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
    currentWord: null,
    currentColor: null,
    roundTimer: null,
    timeLeft: 0,
    done: false,
    totalReactionTime: 0,
    roundStart: 0
  };
  GS.challengeState.stroop = state;
  showStroopRound(state);
}

function showStroopRound(state) {
  if (state.round >= state.puzzle.rounds) {
    finishStroop(state);
    return;
  }

  const colors = state.colors;
  // Pick word and display color (usually different)
  const congruent = GS.rng() < state.puzzle.congruentChance;
  const wordColor = colors[Math.floor(GS.rng() * colors.length)];
  let displayColor;
  if (congruent) {
    displayColor = wordColor;
  } else {
    do {
      displayColor = colors[Math.floor(GS.rng() * colors.length)];
    } while (displayColor.name === wordColor.name);
  }

  state.currentWord = wordColor.name;
  state.currentColor = displayColor;
  state.timeLeft = state.puzzle.timePerRound;
  state.roundStart = performance.now();

  const c = document.getElementById('game-container');
  let html = `<div class="stroop-game">
    <div class="stroop-header">
      <span class="stroop-progress">${state.round + 1} / ${state.puzzle.rounds}</span>
      <span class="stroop-streak">${state.streak > 0 ? '🔥' + state.streak : ''}</span>
      <span class="stroop-score">✓${state.correct} ✗${state.wrong}</span>
    </div>
    <div class="stroop-instruction">What COLOR is the text?</div>
    <div class="stroop-word" style="color:${displayColor.hex}">${wordColor.name}</div>
    <div class="stroop-timer-bar"><div class="stroop-timer-fill" id="stroop-timer"></div></div>
    <div class="stroop-options" id="stroop-options">`;

  // Shuffle color options
  const shuffled = [...colors].sort(() => GS.rng() - 0.5);
  shuffled.forEach(color => {
    html += `<button class="stroop-btn" style="background:${color.hex}" onclick="pickStroop('${color.name}')">${color.name}</button>`;
  });
  html += `</div></div>`;
  c.innerHTML = html;

  // Start round timer
  if (GS.timerEnabled) {
    const timerEl = document.getElementById('stroop-timer');
    if (timerEl) {
      timerEl.style.transition = `width ${state.puzzle.timePerRound}s linear`;
      setTimeout(() => { if (timerEl) timerEl.style.width = '0%'; }, 50);
    }
    if (state.roundTimer) clearTimeout(state.roundTimer);
    state.roundTimer = setTimeout(() => {
      if (state.done) return;
      state.wrong++;
      state.streak = 0;
      SFX.wrong();
      state.round++;
      showStroopRound(state);
    }, state.puzzle.timePerRound * 1000);
  }
}

function pickStroop(colorName) {
  const state = GS.challengeState.stroop;
  if (state.done) return;
  if (state.roundTimer) clearTimeout(state.roundTimer);

  const reactionTime = performance.now() - state.roundStart;
  state.totalReactionTime += reactionTime;

  const correct = colorName === state.currentColor.name;
  if (correct) {
    state.correct++;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    SFX.correct();
  } else {
    state.wrong++;
    state.streak = 0;
    SFX.wrong();
  }

  // Brief flash feedback
  const opts = document.getElementById('stroop-options');
  if (opts) {
    opts.querySelectorAll('.stroop-btn').forEach(btn => {
      if (btn.textContent === state.currentColor.name) {
        btn.classList.add('stroop-correct-btn');
      } else if (btn.textContent === colorName && !correct) {
        btn.classList.add('stroop-wrong-btn');
      }
      btn.disabled = true;
    });
  }

  state.round++;
  setTimeout(() => showStroopRound(state), 400);
}

function finishStroop(state) {
  state.done = true;
  if (state.roundTimer) clearTimeout(state.roundTimer);
  const accuracy = Math.round((state.correct / state.puzzle.rounds) * 100);
  const avgReaction = state.correct > 0 ? Math.round(state.totalReactionTime / (state.correct + state.wrong)) : 0;
  const score = Math.min(100, accuracy);

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('stroop', score);
    lsSet('daily-stroop-state-' + getDailyDateStr(), { correct: state.correct, wrong: state.wrong, bestStreak: state.bestStreak, avgReaction, rounds: state.puzzle.rounds });
  }
  showChallengeSummary({
    emoji: score === 100 ? '🌈' : score >= 60 ? '🎨' : '😵‍💫',
    score,
    title: score >= 90 ? 'Brain vs Eyes — You Won!' : score >= 60 ? 'Solid Focus!' : 'The Stroop Effect Got You!',
    stats: [
      { label: 'Correct', value: `${state.correct} / ${state.puzzle.rounds}` },
      { label: 'Best streak', value: state.bestStreak },
      { label: 'Avg reaction', value: avgReaction + 'ms' },
      { label: 'Accuracy', value: accuracy + '%' }
    ]
  });
}
