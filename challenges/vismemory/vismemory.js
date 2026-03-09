// ==================== VISUAL MEMORY ====================

function getVisMemoryPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { startTiles: 3, gridSize: 3, showTime: 2000, lives: 3 },
    medium:     { startTiles: 3, gridSize: 4, showTime: 1500, lives: 3 },
    hard:       { startTiles: 4, gridSize: 4, showTime: 1200, lives: 2 },
    extreme:    { startTiles: 5, gridSize: 5, showTime: 1000, lives: 2 },
    impossible: { startTiles: 6, gridSize: 5, showTime: 800,  lives: 1 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderVisMemory(puzzle) {
  const state = {
    puzzle, level: 1, activeTiles: puzzle.startTiles,
    gridSize: puzzle.gridSize, highlighted: [],
    phase: 'show', lives: puzzle.lives, maxLives: puzzle.lives,
    found: new Set(), maxLevel: 0, done: false
  };
  GS.challengeState.vismemory = state;
  startVisMemRound(state);
}

function startVisMemRound(state) {
  const total = state.gridSize * state.gridSize;
  // Pick random tiles to highlight
  const indices = [];
  while (indices.length < state.activeTiles) {
    const idx = Math.floor(GS.rng() * total);
    if (!indices.includes(idx)) indices.push(idx);
  }
  state.highlighted = indices;
  state.found = new Set();
  state.phase = 'show';

  drawVisMemGrid(state, true);

  // Hide after showTime
  setTimeout(() => {
    if (state.phase !== 'show') return;
    state.phase = 'input';
    drawVisMemGrid(state, false);
  }, state.puzzle.showTime);
}

function drawVisMemGrid(state, showHighlighted) {
  const c = document.getElementById('game-container');
  const { gridSize } = state;
  const cellSize = Math.min(64, Math.floor(300 / gridSize));

  let html = `<div class="vismem-game">
    <div class="vismem-header">
      <span class="vismem-level">Level ${state.level}</span>
      <span class="vismem-lives">${'❤️'.repeat(state.lives)}${'🖤'.repeat(state.maxLives - state.lives)}</span>
      <span class="vismem-count">${state.activeTiles} tiles</span>
    </div>
    <div class="vismem-instruction">${showHighlighted ? 'Memorize the blue tiles!' : 'Tap the tiles that were blue!'}</div>
    <div class="vismem-grid" style="grid-template-columns:repeat(${gridSize},${cellSize}px)">`;

  const total = gridSize * gridSize;
  for (let i = 0; i < total; i++) {
    const isHighlighted = state.highlighted.includes(i);
    const isFound = state.found.has(i);
    let cls = 'vismem-cell';
    if (showHighlighted && isHighlighted) cls += ' vismem-active';
    else if (isFound) cls += ' vismem-found';
    const clickable = !showHighlighted && !isFound;
    html += `<div class="${cls}" style="width:${cellSize}px;height:${cellSize}px" ${clickable ? `onclick="clickVisMemCell(${i})"` : ''}></div>`;
  }

  html += `</div></div>`;
  c.innerHTML = html;
}

function clickVisMemCell(idx) {
  const state = GS.challengeState.vismemory;
  if (state.done || state.phase !== 'input') return;

  if (state.highlighted.includes(idx)) {
    state.found.add(idx);
    SFX.correct();
    drawVisMemGrid(state, false);
    if (state.found.size >= state.highlighted.length) {
      // Level complete!
      state.maxLevel = state.level;
      state.level++;
      state.activeTiles++;
      // Grow grid if needed
      if (state.activeTiles > state.gridSize * state.gridSize * 0.6) {
        state.gridSize = Math.min(7, state.gridSize + 1);
      }
      setTimeout(() => startVisMemRound(state), 600);
    }
  } else {
    state.lives--;
    SFX.wrong();
    // Flash wrong cell
    const cells = document.querySelectorAll('.vismem-cell');
    if (cells[idx]) {
      cells[idx].classList.add('vismem-wrong');
      setTimeout(() => {
        if (state.lives <= 0) {
          finishVisMemory(state);
        } else {
          drawVisMemGrid(state, false);
        }
      }, 500);
    }
  }
}

function finishVisMemory(state) {
  state.done = true;
  const target = { easy: 6, medium: 7, hard: 8, extreme: 9, impossible: 10 };
  const t = target[state.puzzle.difficulty] || 7;
  const score = Math.min(100, Math.round((state.maxLevel / t) * 100));

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('vismemory', score);
    lsSet('daily-vismemory-state-' + getDailyDateStr(), { maxLevel: state.maxLevel, maxTiles: state.puzzle.startTiles + state.maxLevel - 1 });
  }
  showChallengeSummary({
    emoji: score >= 90 ? '🧠' : score >= 60 ? '🟦' : '😶‍🌫️',
    score,
    title: state.maxLevel >= 8 ? 'Photographic!' : state.maxLevel >= 5 ? 'Sharp Eyes!' : 'Keep Trying!',
    stats: [
      { label: 'Max level', value: state.maxLevel },
      { label: 'Max tiles', value: state.puzzle.startTiles + state.maxLevel - 1 },
      { label: 'Lives left', value: state.lives }
    ]
  });
}
