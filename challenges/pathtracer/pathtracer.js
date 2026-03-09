// ==================== PATH TRACER ====================

function getPathTracerPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { gridSize: 3, startLen: 3, showSpeed: 600, lives: 3 },
    medium:     { gridSize: 4, startLen: 4, showSpeed: 500, lives: 3 },
    hard:       { gridSize: 4, startLen: 5, showSpeed: 400, lives: 2 },
    extreme:    { gridSize: 5, startLen: 5, showSpeed: 350, lives: 2 },
    impossible: { gridSize: 5, startLen: 6, showSpeed: 300, lives: 1 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderPathTracer(puzzle) {
  const state = {
    puzzle, level: 1, pathLen: puzzle.startLen,
    path: [], playerPath: [], phase: 'show',
    lives: puzzle.lives, maxLives: puzzle.lives,
    maxLevel: 0, done: false, showIdx: 0
  };
  GS.challengeState.pathtracer = state;
  startPathRound(state);
}

function startPathRound(state) {
  const { gridSize } = state.puzzle;
  const total = gridSize * gridSize;

  // Generate random connected path
  const path = [];
  let current = Math.floor(GS.rng() * total);
  path.push(current);

  for (let i = 1; i < state.pathLen; i++) {
    const row = Math.floor(current / gridSize);
    const col = current % gridSize;
    const neighbors = [];
    if (row > 0) neighbors.push(current - gridSize);
    if (row < gridSize - 1) neighbors.push(current + gridSize);
    if (col > 0) neighbors.push(current - 1);
    if (col < gridSize - 1) neighbors.push(current + 1);
    // Filter out already visited
    const available = neighbors.filter(n => !path.includes(n));
    if (available.length === 0) break;
    current = available[Math.floor(GS.rng() * available.length)];
    path.push(current);
  }

  state.path = path;
  state.playerPath = [];
  state.phase = 'show';
  state.showIdx = 0;

  drawPathGrid(state);
  animatePathShow(state);
}

function animatePathShow(state) {
  if (state.showIdx >= state.path.length) {
    // Done showing, wait a moment then switch to input
    setTimeout(() => {
      state.phase = 'input';
      drawPathGrid(state);
    }, 400);
    return;
  }
  state.showIdx++;
  drawPathGrid(state);
  setTimeout(() => animatePathShow(state), state.puzzle.showSpeed);
}

function drawPathGrid(state) {
  const c = document.getElementById('game-container');
  const { gridSize } = state.puzzle;
  const total = gridSize * gridSize;
  const cellSize = Math.min(64, Math.floor(300 / gridSize));

  const pathSet = new Set(state.phase === 'show' ? state.path.slice(0, state.showIdx) : []);
  const playerSet = new Set(state.playerPath);
  const lastShown = state.phase === 'show' && state.showIdx > 0 ? state.path[state.showIdx - 1] : -1;

  let html = `<div class="pathtr-game">
    <div class="pathtr-header">
      <span class="pathtr-level">Level ${state.level} — ${state.pathLen} nodes</span>
      <span class="pathtr-lives">${'❤️'.repeat(state.lives)}${'🖤'.repeat(state.maxLives - state.lives)}</span>
    </div>
    <div class="pathtr-instruction">${state.phase === 'show' ? 'Watch the path!' : `Retrace it! (${state.playerPath.length}/${state.path.length})`}</div>
    <div class="pathtr-grid" style="grid-template-columns:repeat(${gridSize},${cellSize}px)">`;

  for (let i = 0; i < total; i++) {
    let cls = 'pathtr-cell';
    if (state.phase === 'show') {
      if (pathSet.has(i)) cls += ' pathtr-shown';
      if (i === lastShown) cls += ' pathtr-head';
    } else {
      if (playerSet.has(i)) cls += ' pathtr-traced';
    }
    const clickable = state.phase === 'input' && !playerSet.has(i);
    html += `<div class="${cls}" style="width:${cellSize}px;height:${cellSize}px" ${clickable ? `onclick="clickPathCell(${i})"` : ''}></div>`;
  }

  html += `</div></div>`;
  c.innerHTML = html;
}

function clickPathCell(idx) {
  const state = GS.challengeState.pathtracer;
  if (state.done || state.phase !== 'input') return;

  const expectedIdx = state.playerPath.length;
  if (expectedIdx >= state.path.length) return;

  if (state.path[expectedIdx] === idx) {
    state.playerPath.push(idx);
    SFX.pop();
    drawPathGrid(state);

    if (state.playerPath.length >= state.path.length) {
      // Level complete!
      state.maxLevel = state.level;
      state.level++;
      state.pathLen++;
      SFX.correct();
      setTimeout(() => startPathRound(state), 700);
    }
  } else {
    state.lives--;
    SFX.wrong();
    // Show correct path briefly
    state.phase = 'show';
    state.showIdx = state.path.length;
    drawPathGrid(state);

    setTimeout(() => {
      if (state.lives <= 0) {
        finishPathTracer(state);
      } else {
        startPathRound(state);
      }
    }, 1200);
  }
}

function finishPathTracer(state) {
  state.done = true;
  const target = { easy: 6, medium: 7, hard: 8, extreme: 9, impossible: 10 };
  const t = target[state.puzzle.difficulty] || 7;
  const score = Math.min(100, Math.round((state.maxLevel / t) * 100));

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('pathtracer', score);
    lsSet('daily-pathtracer-state-' + getDailyDateStr(), { maxLevel: state.maxLevel, maxPathLen: state.puzzle.startLen + state.maxLevel - 1 });
  }
  showChallengeSummary({
    emoji: score >= 90 ? '✏️' : score >= 60 ? '🛤️' : '😶‍🌫️',
    score,
    title: state.maxLevel >= 8 ? 'Path Master!' : state.maxLevel >= 5 ? 'Good Tracing!' : 'Keep Following!',
    stats: [
      { label: 'Max level', value: state.maxLevel },
      { label: 'Longest path', value: state.puzzle.startLen + state.maxLevel - 1 + ' nodes' },
      { label: 'Grid size', value: `${state.puzzle.gridSize}×${state.puzzle.gridSize}` }
    ]
  });
}
