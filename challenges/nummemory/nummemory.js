// ==================== NUMBER MEMORY ====================

function getNumMemoryPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { startLen: 3, showTime: 3000, lives: 3 },
    medium:     { startLen: 4, showTime: 2500, lives: 2 },
    hard:       { startLen: 5, showTime: 2000, lives: 2 },
    extreme:    { startLen: 6, showTime: 1500, lives: 1 },
    impossible: { startLen: 7, showTime: 1000, lives: 1 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderNumMemory(puzzle) {
  const state = {
    puzzle,
    level: 1,
    numLen: puzzle.startLen,
    currentNumber: '',
    lives: puzzle.lives,
    maxLives: puzzle.lives,
    maxLevel: 0,
    phase: 'show', // show, input, feedback
    done: false
  };
  GS.challengeState.nummemory = state;
  startNumMemoryRound(state);
}

function startNumMemoryRound(state) {
  // Generate random number of current length
  let num = '';
  for (let i = 0; i < state.numLen; i++) {
    num += (i === 0) ? String(rngInt(1, 9)) : String(rngInt(0, 9));
  }
  state.currentNumber = num;
  state.phase = 'show';

  const c = document.getElementById('game-container');
  c.innerHTML = `<div class="nummem-game">
    <div class="nummem-info">
      <span class="nummem-level">Level ${state.level}</span>
      <span class="nummem-lives">${'❤️'.repeat(state.lives)}${'🖤'.repeat(state.maxLives - state.lives)}</span>
    </div>
    <div class="nummem-display" id="nummem-display">
      <div class="nummem-number" id="nummem-number">${num}</div>
      <div class="nummem-hint">Memorize this number!</div>
      <div class="nummem-timer-bar"><div class="nummem-timer-fill" id="nummem-timer-fill"></div></div>
    </div>
  </div>`;

  // Animate timer bar
  setTimeout(() => {
    const fill = document.getElementById('nummem-timer-fill');
    if (fill) {
      fill.style.transitionDuration = (state.puzzle.showTime / 1000) + 's';
      fill.style.width = '0%';
    }
  }, 50);

  // Hide number after showTime
  setTimeout(() => {
    if (state.phase !== 'show') return;
    state.phase = 'input';
    showNumMemoryInput(state);
  }, state.puzzle.showTime);
}

function showNumMemoryInput(state) {
  const c = document.getElementById('game-container');
  c.innerHTML = `<div class="nummem-game">
    <div class="nummem-info">
      <span class="nummem-level">Level ${state.level}</span>
      <span class="nummem-lives">${'❤️'.repeat(state.lives)}${'🖤'.repeat(state.maxLives - state.lives)}</span>
    </div>
    <div class="nummem-display">
      <div class="nummem-question">What was the number?</div>
      <div class="nummem-digits">${state.numLen} digits</div>
      <input type="text" class="nummem-input" id="nummem-input" maxlength="${state.numLen}" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="${'_'.repeat(state.numLen)}">
      <button class="btn btn-primary btn-lg" onclick="submitNumMemory()" style="margin-top:12px; width:100%">Submit</button>
    </div>
  </div>`;
  const input = document.getElementById('nummem-input');
  input.focus();
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitNumMemory();
  });
}

function submitNumMemory() {
  const state = GS.challengeState.nummemory;
  if (state.done || state.phase !== 'input') return;
  const input = document.getElementById('nummem-input');
  const answer = input.value.trim();
  if (answer.length === 0) return;

  state.phase = 'feedback';
  const correct = answer === state.currentNumber;

  if (correct) {
    state.maxLevel = state.level;
    state.level++;
    state.numLen++;
    SFX.correct();
    showNumMemoryFeedback(state, true);
  } else {
    state.lives--;
    SFX.wrong();
    if (state.lives <= 0) {
      showNumMemoryFeedback(state, false, true);
    } else {
      showNumMemoryFeedback(state, false, false);
    }
  }
}

function showNumMemoryFeedback(state, correct, gameOver) {
  const c = document.getElementById('game-container');
  let html = `<div class="nummem-game">
    <div class="nummem-info">
      <span class="nummem-level">Level ${state.level - (correct ? 1 : 0)}</span>
      <span class="nummem-lives">${'❤️'.repeat(state.lives)}${'🖤'.repeat(state.maxLives - state.lives)}</span>
    </div>
    <div class="nummem-display">
      <div class="nummem-feedback ${correct ? 'correct' : 'wrong'}">
        ${correct ? '✓ Correct!' : '✗ Wrong!'}
      </div>
      <div class="nummem-number nummem-reveal">${state.currentNumber}</div>`;

  if (gameOver) {
    html += `<div class="nummem-gameover">Game Over — Reached Level ${state.maxLevel}</div>`;
  }
  html += `<button class="btn btn-primary btn-lg" onclick="${gameOver ? 'finishNumMemory()' : correct ? 'continueNumMemory()' : 'retryNumMemory()'}" style="margin-top:16px;width:100%">${gameOver ? 'See Score' : correct ? 'Next Level →' : 'Try Again'}</button>`;
  html += `</div></div>`;
  c.innerHTML = html;
}

function continueNumMemory() {
  const state = GS.challengeState.nummemory;
  startNumMemoryRound(state);
}

function retryNumMemory() {
  const state = GS.challengeState.nummemory;
  startNumMemoryRound(state);
}

function finishNumMemory() {
  const state = GS.challengeState.nummemory;
  state.done = true;
  // Score based on max level reached relative to difficulty
  const baseTarget = { easy: 5, medium: 6, hard: 7, extreme: 8, impossible: 9 };
  const target = baseTarget[state.puzzle.difficulty] || 6;
  const score = Math.min(100, Math.round((state.maxLevel / target) * 100));

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('nummemory', score);
    lsSet('daily-nummemory-state-' + getDailyDateStr(), { maxLevel: state.maxLevel, startLen: state.puzzle.startLen });
  }
  showChallengeSummary({
    emoji: score === 100 ? '🧠' : score >= 60 ? '💭' : '😵',
    score,
    title: state.maxLevel >= 10 ? 'Photographic Memory!' : state.maxLevel >= 6 ? 'Sharp Mind!' : 'Room to Grow',
    stats: [
      { label: 'Max level', value: state.maxLevel },
      { label: 'Max digits', value: state.puzzle.startLen + state.maxLevel - 1 },
      { label: 'Target level', value: target },
      { label: 'Lives used', value: state.maxLives - state.lives + '/' + state.maxLives }
    ]
  });
}
