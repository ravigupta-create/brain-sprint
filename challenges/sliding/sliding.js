// ==================== SLIDING PUZZLE ====================

function getSlidingPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { size: 3, optimalMoves: 22 },
    medium:     { size: 3, optimalMoves: 22 },
    hard:       { size: 4, optimalMoves: 80 },
    extreme:    { size: 4, optimalMoves: 80 },
    impossible: { size: 5, optimalMoves: 200 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderSliding(puzzle) {
  const size = puzzle.size;
  const total = size * size;
  // Create solved state
  const solved = [];
  for (let i = 1; i < total; i++) solved.push(i);
  solved.push(0); // 0 = empty

  // Shuffle by making random valid moves (guarantees solvability)
  const tiles = [...solved];
  let emptyIdx = total - 1;
  const shuffleMoves = size === 3 ? 100 : size === 4 ? 200 : 400;
  for (let i = 0; i < shuffleMoves; i++) {
    const neighbors = getSlidingNeighbors(emptyIdx, size);
    const pick = neighbors[Math.floor(GS.rng() * neighbors.length)];
    tiles[emptyIdx] = tiles[pick];
    tiles[pick] = 0;
    emptyIdx = pick;
  }

  const state = {
    puzzle, size, tiles, solved, emptyIdx,
    moves: 0, startTime: null, done: false
  };
  GS.challengeState.sliding = state;

  drawSliding(state);
}

function getSlidingNeighbors(idx, size) {
  const row = Math.floor(idx / size);
  const col = idx % size;
  const neighbors = [];
  if (row > 0) neighbors.push(idx - size);
  if (row < size - 1) neighbors.push(idx + size);
  if (col > 0) neighbors.push(idx - 1);
  if (col < size - 1) neighbors.push(idx + 1);
  return neighbors;
}

function drawSliding(state) {
  const c = document.getElementById('game-container');
  const { size, tiles, moves } = state;
  const tileSize = Math.min(70, Math.floor(320 / size));

  let html = `<div class="sliding-game">
    <div class="sliding-info">
      <span>Moves: <strong id="sliding-moves">${moves}</strong></span>
    </div>
    <div class="sliding-grid" style="grid-template-columns:repeat(${size},${tileSize}px);grid-template-rows:repeat(${size},${tileSize}px);gap:3px">`;

  tiles.forEach((tile, idx) => {
    if (tile === 0) {
      html += `<div class="sliding-cell sliding-empty" data-idx="${idx}"></div>`;
    } else {
      const isCorrect = tile === idx + 1;
      html += `<div class="sliding-cell sliding-tile ${isCorrect ? 'sliding-correct' : ''}" data-idx="${idx}" onclick="clickSlidingTile(${idx})" style="width:${tileSize}px;height:${tileSize}px;font-size:${tileSize > 50 ? 20 : 14}px">${tile}</div>`;
    }
  });
  html += `</div></div>`;
  c.innerHTML = html;
}

function clickSlidingTile(idx) {
  const state = GS.challengeState.sliding;
  if (state.done) return;

  if (!state.startTime) state.startTime = performance.now();

  const neighbors = getSlidingNeighbors(state.emptyIdx, state.size);
  if (!neighbors.includes(idx)) return;

  // Swap
  state.tiles[state.emptyIdx] = state.tiles[idx];
  state.tiles[idx] = 0;
  state.emptyIdx = idx;
  state.moves++;
  SFX.click();

  drawSliding(state);

  // Check win
  if (isSlidingSolved(state)) {
    finishSliding(state);
  }
}

function isSlidingSolved(state) {
  for (let i = 0; i < state.tiles.length; i++) {
    if (state.tiles[i] !== state.solved[i]) return false;
  }
  return true;
}

function finishSliding(state) {
  state.done = true;
  const elapsed = ((performance.now() - state.startTime) / 1000).toFixed(1);
  // Score: based on moves efficiency
  // For a 3x3 (8-puzzle), average random solution is ~22 moves
  // For 4x4, ~80. For 5x5, ~200
  const target = state.puzzle.optimalMoves;
  const efficiency = target / Math.max(state.moves, 1);
  let score;
  if (efficiency >= 1) score = 100;
  else if (efficiency >= 0.5) score = Math.round(50 + efficiency * 50);
  else score = Math.round(efficiency * 100);
  score = Math.max(0, Math.min(100, score));

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('sliding', score);
    lsSet('daily-sliding-state-' + getDailyDateStr(), { moves: state.moves, size: state.size, elapsed });
  }
  showChallengeSummary({
    emoji: score === 100 ? '🏆' : score >= 60 ? '🧊' : '🤷',
    score,
    title: score >= 90 ? 'Puzzle Master!' : score >= 60 ? 'Well Solved!' : 'Lots of Sliding!',
    stats: [
      { label: 'Moves', value: state.moves },
      { label: 'Grid size', value: `${state.size}×${state.size}` },
      { label: 'Time', value: elapsed + 's' },
      { label: 'Target moves', value: '≤' + target }
    ]
  });
}
