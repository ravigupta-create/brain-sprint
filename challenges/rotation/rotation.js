// ==================== MENTAL ROTATION ====================

// Shape generation: each shape is a set of connected cells on a small grid
const ROTATION_SHAPES = [
  [[0,0],[1,0],[2,0],[2,1]], // L
  [[0,0],[1,0],[1,1],[2,1]], // S
  [[0,0],[0,1],[1,0],[1,1],[2,0]], // P
  [[0,0],[1,0],[2,0],[1,1]], // T
  [[0,0],[1,0],[2,0],[3,0],[3,1]], // Long L
  [[0,0],[0,1],[1,1],[2,1],[2,0]], // U
  [[0,0],[1,0],[1,1],[1,2]], // Corner
  [[0,0],[0,1],[0,2],[1,2],[2,2]], // Reverse L
  [[0,0],[1,0],[2,0],[2,1],[2,2]], // Big L
  [[0,1],[1,0],[1,1],[1,2],[2,1]]  // Plus
];

function getRotationPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { rounds: 5,  options: 3, allowMirror: false },
    medium:     { rounds: 7,  options: 4, allowMirror: false },
    hard:       { rounds: 8,  options: 4, allowMirror: true },
    extreme:    { rounds: 10, options: 5, allowMirror: true },
    impossible: { rounds: 12, options: 6, allowMirror: true }
  };
  return { ...configs[diff], difficulty: diff };
}

function rotateShape(cells, times) {
  let result = cells.map(c => [...c]);
  for (let t = 0; t < times; t++) {
    result = result.map(([r, c]) => [c, -r]);
  }
  // Normalize to positive coordinates
  const minR = Math.min(...result.map(c => c[0]));
  const minC = Math.min(...result.map(c => c[1]));
  return result.map(([r, c]) => [r - minR, c - minC]);
}

function mirrorShape(cells) {
  const maxC = Math.max(...cells.map(c => c[1]));
  return cells.map(([r, c]) => [r, maxC - c]);
}

function shapesEqual(a, b) {
  if (a.length !== b.length) return false;
  const sa = a.map(c => c.join(',')).sort().join(';');
  const sb = b.map(c => c.join(',')).sort().join(';');
  return sa === sb;
}

function isRotationOf(original, candidate) {
  for (let r = 0; r < 4; r++) {
    if (shapesEqual(rotateShape(original, r), candidate)) return true;
  }
  return false;
}

function renderRotation(puzzle) {
  const state = {
    puzzle, round: 0, correct: 0, done: false
  };
  GS.challengeState.rotation = state;
  showRotationRound(state);
}

function showRotationRound(state) {
  if (state.round >= state.puzzle.rounds) { finishRotation(state); return; }

  const baseShape = ROTATION_SHAPES[Math.floor(GS.rng() * ROTATION_SHAPES.length)];
  // Rotate the base randomly
  const baseRotation = Math.floor(GS.rng() * 4);
  const displayShape = rotateShape(baseShape, baseRotation);

  // Create answer: another rotation of the same shape
  const answerRotation = (baseRotation + 1 + Math.floor(GS.rng() * 3)) % 4;
  const correctShape = rotateShape(baseShape, answerRotation);

  // Create distractors: mirrors and different shapes
  const options = [{ shape: correctShape, correct: true }];
  // Add mirror if allowed
  if (state.puzzle.allowMirror) {
    const mirrored = mirrorShape(rotateShape(baseShape, Math.floor(GS.rng() * 4)));
    if (!isRotationOf(baseShape, mirrored)) {
      options.push({ shape: mirrored, correct: false });
    }
  }
  // Fill with other shapes
  const otherShapes = ROTATION_SHAPES.filter(s => !shapesEqual(s, baseShape));
  while (options.length < state.puzzle.options && otherShapes.length > 0) {
    const idx = Math.floor(GS.rng() * otherShapes.length);
    const s = otherShapes.splice(idx, 1)[0];
    const rot = Math.floor(GS.rng() * 4);
    options.push({ shape: rotateShape(s, rot), correct: false });
  }
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(GS.rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const c = document.getElementById('game-container');
  let html = `<div class="rotation-game">
    <div class="rotation-header">
      <span>Round ${state.round + 1} / ${state.puzzle.rounds}</span>
      <span>✓ ${state.correct}</span>
    </div>
    <div class="rotation-instruction">Which shape is the same, just rotated?</div>
    <div class="rotation-reference">${drawShapeSVG(displayShape, 80)}</div>
    <div class="rotation-options">`;

  options.forEach((opt, i) => {
    html += `<div class="rotation-option" onclick="pickRotation(${i}, ${opt.correct})">${drawShapeSVG(opt.shape, 60)}</div>`;
  });

  html += `</div></div>`;
  c.innerHTML = html;
}

function drawShapeSVG(cells, size) {
  const maxR = Math.max(...cells.map(c => c[0])) + 1;
  const maxC = Math.max(...cells.map(c => c[1])) + 1;
  const cellSize = Math.floor(size / Math.max(maxR, maxC));
  const w = maxC * cellSize;
  const h = maxR * cellSize;
  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
  cells.forEach(([r, c]) => {
    svg += `<rect x="${c * cellSize + 1}" y="${r * cellSize + 1}" width="${cellSize - 2}" height="${cellSize - 2}" rx="3" fill="var(--accent)" />`;
  });
  svg += '</svg>';
  return svg;
}

function pickRotation(idx, correct) {
  const state = GS.challengeState.rotation;
  if (state.done) return;

  const options = document.querySelectorAll('.rotation-option');
  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    if (i === idx) opt.classList.add(correct ? 'rotation-correct' : 'rotation-wrong');
  });

  if (correct) { state.correct++; SFX.correct(); }
  else { SFX.wrong(); }

  state.round++;
  setTimeout(() => showRotationRound(state), 600);
}

function finishRotation(state) {
  state.done = true;
  const score = Math.round((state.correct / state.puzzle.rounds) * 100);

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('rotation', score);
    lsSet('daily-rotation-state-' + getDailyDateStr(), { correct: state.correct, rounds: state.puzzle.rounds });
  }
  showChallengeSummary({
    emoji: score >= 90 ? '🔄' : score >= 60 ? '🧩' : '😵‍💫',
    score,
    title: score >= 90 ? 'Spatial Genius!' : score >= 60 ? 'Good Rotation!' : 'Keep Turning!',
    stats: [
      { label: 'Correct', value: `${state.correct} / ${state.puzzle.rounds}` },
      { label: 'Mirrors included', value: state.puzzle.allowMirror ? 'Yes' : 'No' }
    ]
  });
}
