// ==================== SPOT THE DIFFERENCE ====================

const SPOTDIFF_SYMBOLS = ['🍎','🍊','🍋','🍇','🍓','🫐','🥝','🍑','🥭','🍒','🌽','🥕','🥦','🌶️','🥑','🍄','🌰','🥜','🎃','🍉','⭐','💎','🔷','🔶','❤️','💜','💚','🧡','🤍','🖤','🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦆','🦅'];

function getSpotDiffPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { gridSize: 4, diffCount: 2, timeLimit: 30 },
    medium:     { gridSize: 5, diffCount: 3, timeLimit: 25 },
    hard:       { gridSize: 5, diffCount: 4, timeLimit: 20 },
    extreme:    { gridSize: 6, diffCount: 5, timeLimit: 18 },
    impossible: { gridSize: 6, diffCount: 6, timeLimit: 15 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderSpotDiff(puzzle) {
  const { gridSize, diffCount, timeLimit } = puzzle;
  const totalCells = gridSize * gridSize;

  // Create base grid
  const pool = rngShuffle(SPOTDIFF_SYMBOLS).slice(0, Math.min(totalCells, SPOTDIFF_SYMBOLS.length));
  const baseGrid = [];
  for (let i = 0; i < totalCells; i++) {
    baseGrid.push(pool[i % pool.length]);
  }

  // Create modified grid — change `diffCount` cells
  const modGrid = [...baseGrid];
  const diffIndices = [];
  const usedPositions = new Set();
  while (diffIndices.length < diffCount) {
    const idx = Math.floor(GS.rng() * totalCells);
    if (usedPositions.has(idx)) continue;
    usedPositions.add(idx);
    // Pick a different symbol
    let newSymbol;
    do {
      newSymbol = SPOTDIFF_SYMBOLS[Math.floor(GS.rng() * SPOTDIFF_SYMBOLS.length)];
    } while (newSymbol === baseGrid[idx]);
    modGrid[idx] = newSymbol;
    diffIndices.push(idx);
  }

  const state = {
    puzzle, gridSize, baseGrid, modGrid, diffIndices: new Set(diffIndices),
    found: new Set(), timeLeft: timeLimit, timer: null, done: false
  };
  GS.challengeState.spotdiff = state;

  drawSpotDiff(state);

  if (GS.timerEnabled) {
    state.timer = setInterval(() => {
      state.timeLeft--;
      const el = document.getElementById('sd-time');
      if (el) {
        el.textContent = state.timeLeft;
        if (state.timeLeft <= 5) el.style.color = 'var(--red)';
      }
      if (state.timeLeft <= 0) finishSpotDiff(state);
    }, 1000);
  }
}

function drawSpotDiff(state) {
  const c = document.getElementById('game-container');
  const { gridSize, baseGrid, modGrid } = state;
  const cellSize = Math.min(48, Math.floor(300 / gridSize));

  let html = `<div class="spotdiff-game">
    <div class="spotdiff-header">
      <span>Found: <strong id="sd-found">${state.found.size}</strong> / ${state.diffIndices.size}</span>
      <span>⏱ <span id="sd-time">${GS.timerEnabled ? state.timeLeft : '∞'}</span>s</span>
    </div>
    <div class="spotdiff-label">Original</div>
    <div class="spotdiff-grids">
      <div class="spotdiff-grid" style="grid-template-columns:repeat(${gridSize},${cellSize}px)">`;

  baseGrid.forEach((sym, i) => {
    const isFound = state.found.has(i);
    html += `<div class="sd-cell ${isFound ? 'sd-found' : ''}" style="width:${cellSize}px;height:${cellSize}px;font-size:${cellSize > 36 ? 22 : 16}px">${sym}</div>`;
  });

  html += `</div>
    <div class="spotdiff-label">Modified — tap the differences!</div>
    <div class="spotdiff-grid" style="grid-template-columns:repeat(${gridSize},${cellSize}px)">`;

  modGrid.forEach((sym, i) => {
    const isFound = state.found.has(i);
    html += `<div class="sd-cell sd-clickable ${isFound ? 'sd-found' : ''}" onclick="clickSpotDiff(${i})" style="width:${cellSize}px;height:${cellSize}px;font-size:${cellSize > 36 ? 22 : 16}px">${sym}</div>`;
  });

  html += `</div></div></div>`;
  c.innerHTML = html;
}

function clickSpotDiff(idx) {
  const state = GS.challengeState.spotdiff;
  if (state.done) return;
  if (state.found.has(idx)) return;

  if (state.diffIndices.has(idx)) {
    state.found.add(idx);
    SFX.correct();
    drawSpotDiff(state);
    if (state.found.size >= state.diffIndices.size) {
      finishSpotDiff(state);
    }
  } else {
    SFX.wrong();
    // Flash wrong
    const cells = document.querySelectorAll('.sd-clickable');
    if (cells[idx]) {
      cells[idx].classList.add('sd-wrong');
      setTimeout(() => cells[idx].classList.remove('sd-wrong'), 400);
    }
  }
}

function finishSpotDiff(state) {
  if (state.done) return;
  state.done = true;
  if (state.timer) clearInterval(state.timer);

  const found = state.found.size;
  const total = state.diffIndices.size;
  const score = Math.round((found / total) * 100);

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('spotdiff', score);
    lsSet('daily-spotdiff-state-' + getDailyDateStr(), { found, total, gridSize: state.gridSize });
  }
  showChallengeSummary({
    emoji: score === 100 ? '🔍' : score >= 60 ? '👀' : '😶‍🌫️',
    score,
    title: score === 100 ? 'Eagle Eye!' : score >= 60 ? 'Good Observation!' : 'They Slipped By!',
    stats: [
      { label: 'Differences found', value: `${found} / ${total}` },
      { label: 'Grid size', value: `${state.gridSize}×${state.gridSize}` }
    ]
  });
}
