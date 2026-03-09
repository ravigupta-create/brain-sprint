// ==================== CHIMP TEST ====================

function getChimpPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { startNums: 4, gridCols: 5, gridRows: 4, lives: 3 },
    medium:     { startNums: 4, gridCols: 6, gridRows: 4, lives: 3 },
    hard:       { startNums: 5, gridCols: 7, gridRows: 5, lives: 2 },
    extreme:    { startNums: 6, gridCols: 8, gridRows: 5, lives: 2 },
    impossible: { startNums: 7, gridCols: 8, gridRows: 5, lives: 1 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderChimp(puzzle) {
  const state = {
    puzzle, level: 1, numCount: puzzle.startNums,
    positions: [], // {idx, num}
    nextExpected: 1, phase: 'show', // show, input
    lives: puzzle.lives, maxLives: puzzle.lives,
    maxLevel: 0, done: false
  };
  GS.challengeState.chimp = state;
  startChimpRound(state);
}

function startChimpRound(state) {
  const { gridCols, gridRows } = state.puzzle;
  const totalCells = gridCols * gridRows;

  // Place numbers at random positions
  const usedPositions = new Set();
  const positions = [];
  for (let n = 1; n <= state.numCount; n++) {
    let pos;
    do { pos = Math.floor(GS.rng() * totalCells); } while (usedPositions.has(pos));
    usedPositions.add(pos);
    positions.push({ idx: pos, num: n });
  }
  state.positions = positions;
  state.nextExpected = 1;
  state.phase = 'show';

  drawChimpGrid(state);
}

function drawChimpGrid(state) {
  const c = document.getElementById('game-container');
  const { gridCols, gridRows } = state.puzzle;
  const totalCells = gridCols * gridRows;
  const cellSize = Math.min(52, Math.floor(340 / gridCols));

  const posMap = {};
  state.positions.forEach(p => { posMap[p.idx] = p; });

  let html = `<div class="chimp-game">
    <div class="chimp-header">
      <span class="chimp-level">Level ${state.level} — ${state.numCount} numbers</span>
      <span class="chimp-lives">${'❤️'.repeat(state.lives)}${'🖤'.repeat(state.maxLives - state.lives)}</span>
    </div>
    <div class="chimp-grid" style="grid-template-columns:repeat(${gridCols},${cellSize}px)">`;

  for (let i = 0; i < totalCells; i++) {
    const posInfo = posMap[i];
    if (posInfo) {
      const showNum = state.phase === 'show' || posInfo.num < state.nextExpected;
      const isClicked = posInfo.num < state.nextExpected;
      let cls = 'chimp-cell chimp-has-num';
      if (isClicked) cls += ' chimp-clicked';
      if (state.phase === 'input' && !isClicked) cls += ' chimp-hidden';
      html += `<div class="${cls}" style="width:${cellSize}px;height:${cellSize}px;font-size:${cellSize > 40 ? 18 : 14}px" onclick="clickChimpCell(${posInfo.num})">${showNum ? posInfo.num : ''}</div>`;
    } else {
      html += `<div class="chimp-cell chimp-empty" style="width:${cellSize}px;height:${cellSize}px"></div>`;
    }
  }

  html += `</div></div>`;
  c.innerHTML = html;
}

function clickChimpCell(num) {
  const state = GS.challengeState.chimp;
  if (state.done) return;

  // On first click, hide numbers
  if (state.phase === 'show' && num === 1) {
    state.phase = 'input';
    state.nextExpected = 1;
  }

  if (state.phase !== 'input') return;

  if (num === state.nextExpected) {
    state.nextExpected++;
    SFX.pop();
    drawChimpGrid(state);

    if (state.nextExpected > state.numCount) {
      // Level complete!
      state.maxLevel = state.level;
      state.level++;
      state.numCount++;
      setTimeout(() => startChimpRound(state), 500);
    }
  } else {
    state.lives--;
    SFX.wrong();
    if (state.lives <= 0) {
      finishChimp(state);
    } else {
      // Show correct positions briefly, then retry same level
      state.phase = 'show';
      drawChimpGrid(state);
      setTimeout(() => startChimpRound(state), 1200);
    }
  }
}

function finishChimp(state) {
  state.done = true;
  const target = { easy: 7, medium: 8, hard: 9, extreme: 10, impossible: 11 };
  const t = target[state.puzzle.difficulty] || 8;
  const score = Math.min(100, Math.round((state.maxLevel / t) * 100));

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('chimp', score);
    lsSet('daily-chimp-state-' + getDailyDateStr(), { maxLevel: state.maxLevel, maxNums: state.puzzle.startNums + state.maxLevel - 1 });
  }
  showChallengeSummary({
    emoji: score >= 90 ? '🐒' : score >= 60 ? '🧠' : '🙈',
    score,
    title: state.maxLevel >= 9 ? 'Chimp Champion!' : state.maxLevel >= 5 ? 'Good Memory!' : 'Chimps Still Win!',
    stats: [
      { label: 'Max level', value: state.maxLevel },
      { label: 'Max numbers', value: state.puzzle.startNums + state.maxLevel - 1 },
      { label: 'Target', value: t + ' levels' }
    ]
  });
}
