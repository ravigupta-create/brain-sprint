// ==================== CHALLENGE 15: COLOR CODE ====================

function getColorCodePuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:       { slots: 4, numColors: 5,  maxGuesses: 10 },
    medium:     { slots: 4, numColors: 6,  maxGuesses: 8 },
    hard:       { slots: 5, numColors: 6,  maxGuesses: 8 },
    extreme:    { slots: 5, numColors: 7,  maxGuesses: 6 },
    impossible: { slots: 6, numColors: 8,  maxGuesses: 5 }
  };
  const cfg = configs[d] || configs.medium;
  const allColors = ['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c','#e91e63'];
  const colors = allColors.slice(0, cfg.numColors);
  const code = [];
  for (let i = 0; i < cfg.slots; i++) {
    code.push(colors[Math.floor(GS.rng() * colors.length)]);
  }
  return { ...cfg, colors, code, difficulty: d };
}

function renderColorCode(puzzle) {
  const c = document.getElementById('game-container');
  const state = {
    puzzle,
    guesses: [],
    currentGuess: Array(puzzle.slots).fill(null),
    selectedSlot: 0,
    currentRow: 0,
    gameOver: false,
    won: false
  };
  GS.challengeState.colorcode = state;
  document.getElementById('btn-submit-challenge').style.display = 'none';

  const diffLabel = puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1);
  let html = '<div style="text-align:center;padding:8px 0">';
  html += '<div class="cc-header">';
  html += `<span class="nc-diff-badge ${puzzle.difficulty}">${diffLabel}</span>`;
  html += `<span class="cc-guesses-left" id="cc-guesses-left">${puzzle.maxGuesses} guesses left</span>`;
  html += '</div>';

  // Board
  html += '<div class="cc-board" id="cc-board">';
  for (let r = 0; r < puzzle.maxGuesses; r++) {
    const active = r === 0 ? ' cc-active-row' : '';
    html += `<div class="cc-row${active}" id="cc-row-${r}">`;
    html += '<div class="cc-slots">';
    for (let s = 0; s < puzzle.slots; s++) {
      const sel = (r === 0 && s === 0) ? ' cc-selected' : '';
      html += `<div class="cc-slot${sel}" id="cc-slot-${r}-${s}" onclick="selectColorSlot(${r},${s})"></div>`;
    }
    html += '</div>';
    html += `<div class="cc-pegs" id="cc-pegs-${r}">`;
    for (let p = 0; p < puzzle.slots; p++) {
      html += '<div class="cc-peg"></div>';
    }
    html += '</div>';
    html += '</div>';
  }
  html += '</div>';

  // Message
  html += '<div class="cc-msg" id="cc-msg"></div>';

  // Color palette
  html += '<div class="cc-palette" id="cc-palette">';
  puzzle.colors.forEach((col, i) => {
    html += `<button class="cc-color-btn" style="background:${col}" onclick="pickColor(${i})" title="Color ${i+1}"></button>`;
  });
  html += '</div>';

  // Controls
  html += '<div class="cc-controls">';
  html += '<button class="btn btn-secondary" onclick="clearColorGuess()">Clear</button>';
  html += '<button class="btn btn-primary" onclick="submitColorCode()">Submit Guess</button>';
  html += '</div>';
  html += '</div>';

  c.innerHTML = html;
}

function selectColorSlot(row, slot) {
  const state = GS.challengeState.colorcode;
  if (!state || state.gameOver || row !== state.currentRow) return;
  state.selectedSlot = slot;
  // Update visual selection
  for (let s = 0; s < state.puzzle.slots; s++) {
    const el = document.getElementById(`cc-slot-${row}-${s}`);
    if (el) el.classList.toggle('cc-selected', s === slot);
  }
}

function pickColor(colorIdx) {
  const state = GS.challengeState.colorcode;
  if (!state || state.gameOver) return;
  const color = state.puzzle.colors[colorIdx];
  state.currentGuess[state.selectedSlot] = color;
  const el = document.getElementById(`cc-slot-${state.currentRow}-${state.selectedSlot}`);
  if (el) {
    el.style.background = color;
    el.classList.add('cc-filled');
    el.classList.add('pop');
    setTimeout(() => el.classList.remove('pop'), 150);
  }
  // Auto-advance to next empty slot
  for (let i = 1; i <= state.puzzle.slots; i++) {
    const next = (state.selectedSlot + i) % state.puzzle.slots;
    if (!state.currentGuess[next]) {
      selectColorSlot(state.currentRow, next);
      return;
    }
  }
}

function clearColorGuess() {
  const state = GS.challengeState.colorcode;
  if (!state || state.gameOver) return;
  state.currentGuess = Array(state.puzzle.slots).fill(null);
  for (let s = 0; s < state.puzzle.slots; s++) {
    const el = document.getElementById(`cc-slot-${state.currentRow}-${s}`);
    if (el) { el.style.background = ''; el.classList.remove('cc-filled'); }
  }
  selectColorSlot(state.currentRow, 0);
}

function submitColorCode() {
  const state = GS.challengeState.colorcode;
  if (!state || state.gameOver) return;
  const msg = document.getElementById('cc-msg');

  if (state.currentGuess.some(c => !c)) {
    if (msg) msg.textContent = 'Fill all slots first';
    const row = document.getElementById('cc-row-' + state.currentRow);
    if (row) { row.classList.add('animate-shake'); setTimeout(() => row.classList.remove('animate-shake'), 400); }
    return;
  }

  const guess = [...state.currentGuess];
  const code = [...state.puzzle.code];

  // Calculate feedback pegs
  let exact = 0, colorMatch = 0;
  const codeUsed = Array(code.length).fill(false);
  const guessUsed = Array(guess.length).fill(false);

  // First pass: exact matches
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === code[i]) {
      exact++;
      codeUsed[i] = true;
      guessUsed[i] = true;
    }
  }
  // Second pass: color matches (wrong position)
  for (let i = 0; i < guess.length; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < code.length; j++) {
      if (codeUsed[j]) continue;
      if (guess[i] === code[j]) {
        colorMatch++;
        codeUsed[j] = true;
        break;
      }
    }
  }

  const result = { guess, exact, colorMatch };
  state.guesses.push(result);

  // Animate pegs
  const pegsEl = document.getElementById('cc-pegs-' + state.currentRow);
  if (pegsEl) {
    const pegs = pegsEl.children;
    let pegIdx = 0;
    for (let i = 0; i < exact; i++) {
      pegs[pegIdx].classList.add('cc-peg-exact');
      pegIdx++;
    }
    for (let i = 0; i < colorMatch; i++) {
      pegs[pegIdx].classList.add('cc-peg-color');
      pegIdx++;
    }
    // Stagger animation
    for (let i = 0; i < pegs.length; i++) {
      pegs[i].style.animationDelay = (i * 0.1) + 's';
    }
  }

  // Remove active row
  const curRow = document.getElementById('cc-row-' + state.currentRow);
  if (curRow) curRow.classList.remove('cc-active-row');

  if (msg) msg.textContent = '';
  const won = exact === state.puzzle.slots;
  state.currentRow++;
  state.currentGuess = Array(state.puzzle.slots).fill(null);

  // Update guesses left
  const glEl = document.getElementById('cc-guesses-left');
  if (glEl) {
    const left = state.puzzle.maxGuesses - state.currentRow;
    glEl.textContent = left + ' guess' + (left !== 1 ? 'es' : '') + ' left';
    if (left <= 1 && !won) glEl.classList.add('low');
  }

  if (won) {
    state.gameOver = true;
    state.won = true;
    setTimeout(() => endColorCode(), 600);
  } else if (state.currentRow >= state.puzzle.maxGuesses) {
    state.gameOver = true;
    state.won = false;
    setTimeout(() => endColorCode(), 600);
  } else {
    // Activate next row
    const nextRow = document.getElementById('cc-row-' + state.currentRow);
    if (nextRow) nextRow.classList.add('cc-active-row');
    const firstSlot = document.getElementById(`cc-slot-${state.currentRow}-0`);
    if (firstSlot) firstSlot.classList.add('cc-selected');
    state.selectedSlot = 0;
  }
}

function endColorCode() {
  const state = GS.challengeState.colorcode;
  let score = 0;
  if (state.won) {
    const guessNum = state.guesses.length;
    const max = state.puzzle.maxGuesses;
    score = Math.min(100, Math.round(100 * (1 - (guessNum - 1) / max)));
    score = Math.max(25, score);
  }

  GS.results.colorcode = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('colorcode', score);
    lsSet('daily-colorcode-state-' + getDailyDateStr(), {
      won: state.won, guesses: state.guesses.length,
      maxGuesses: state.puzzle.maxGuesses, slots: state.puzzle.slots
    });
  }

  // Build code reveal
  let codeHtml = '<div style="display:flex;gap:6px;justify-content:center;margin-top:8px">';
  state.puzzle.code.forEach(col => {
    codeHtml += `<div style="width:24px;height:24px;border-radius:50%;background:${col};border:2px solid var(--border)"></div>`;
  });
  codeHtml += '</div>';

  showChallengeSummary({
    emoji: state.won ? '🎯' : '💀',
    score,
    title: state.won ? 'Code Cracked!' : 'Code Unbroken',
    stats: [
      { label: 'Guesses used', value: `${state.guesses.length} / ${state.puzzle.maxGuesses}` },
      { label: 'Code length', value: state.puzzle.slots },
      { label: 'Colors available', value: state.puzzle.colors.length }
    ],
    answerReveal: state.won ? '' : '<strong>The code was:</strong>' + codeHtml
  });
}
