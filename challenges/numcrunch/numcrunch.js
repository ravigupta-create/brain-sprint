// ==================== CHALLENGE 14: NUMBER CRUNCH ====================

function getNumcrunchPuzzle() {
  const diff = GS.difficulty || 'easy';
  const configs = {
    easy:    { length: 6, maxGuesses: 6, ops: ['+','-'] },
    medium:  { length: 7, maxGuesses: 6, ops: ['+','-'] },
    hard:    { length: 8, maxGuesses: 5, ops: ['+','-','*'] },
    extreme: { length: 8, maxGuesses: 4, ops: ['+','-','*','/'] },
    impossible: { length: 8, maxGuesses: 3, ops: ['+','-','*','/'] }
  };
  const cfg = configs[diff] || configs.easy;
  const { length, maxGuesses, ops } = cfg;

  for (let attempt = 0; attempt < 5000; attempt++) {
    const op = ops[Math.floor(GS.rng() * ops.length)];
    let a, b, result;
    if (op === '+') {
      a = Math.floor(GS.rng() * 99) + 1;
      b = Math.floor(GS.rng() * 99) + 1;
      result = a + b;
    } else if (op === '-') {
      a = Math.floor(GS.rng() * 99) + 2;
      b = Math.floor(GS.rng() * (a - 1)) + 1;
      result = a - b;
    } else if (op === '*') {
      a = Math.floor(GS.rng() * 30) + 2;
      b = Math.floor(GS.rng() * 20) + 2;
      result = a * b;
    } else if (op === '/') {
      b = Math.floor(GS.rng() * 12) + 2;
      result = Math.floor(GS.rng() * 20) + 1;
      a = b * result;
    }
    if (result <= 0) continue;
    const eq = '' + a + op + b + '=' + result;
    if (eq.length === length) {
      const hardMode = (diff === 'hard' || diff === 'extreme' || diff === 'impossible');
      return { equation: eq, length, maxGuesses, difficulty: diff, hardMode };
    }
  }
  // Fallback
  const fallbacks = { 6: '9+3=12', 7: '15+7=22', 8: '23+45=68' };
  const eq = fallbacks[length] || '9+3=12';
  const hardMode = (diff === 'hard' || diff === 'extreme' || diff === 'impossible');
  return { equation: eq, length: eq.length, maxGuesses, difficulty: diff, hardMode };
}

function renderNumcrunch(puzzle) {
  const c = document.getElementById('game-container');
  const state = {
    puzzle,
    guesses: [],
    currentGuess: '',
    currentRow: 0,
    gameOver: false,
    won: false,
    revealInProgress: false,
    keyStates: {},
    revealedHints: { correct: {}, present: new Set() }
  };
  GS.challengeState.numcrunch = state;

  const diffLabel = puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1);
  const hardTag = puzzle.hardMode ? ' (Hard Mode)' : '';
  let html = '<div style="text-align:center">';
  // Header bar with badge + guesses counter
  html += '<div class="nc-header-bar">';
  html += '<span class="nc-diff-badge ' + puzzle.difficulty + '">' + diffLabel + hardTag + '</span>';
  html += '<span class="nc-guesses-left" id="nc-guesses-left">' + puzzle.maxGuesses + ' guesses left</span>';
  html += '</div>';
  // Board
  html += '<div class="nc-board" id="nc-board">';
  for (let r = 0; r < puzzle.maxGuesses; r++) {
    const activeClass = (r === 0) ? ' nc-active-row' : '';
    html += '<div class="nc-row' + activeClass + '" id="nc-row-' + r + '">';
    for (let col = 0; col < puzzle.length; col++) {
      html += '<div class="nc-tile" id="nc-tile-' + r + '-' + col + '"></div>';
    }
    html += '</div>';
  }
  html += '</div>';

  // Message area
  html += '<div class="nc-msg" id="nc-msg"></div>';

  // Keyboard
  const rows = [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['+','-','*','/','='],
    ['ENTER','DEL']
  ];
  html += '<div class="nc-keyboard" id="nc-keyboard">';
  rows.forEach(row => {
    html += '<div class="nc-kb-row">';
    row.forEach(key => {
      const isWide = (key === 'ENTER' || key === 'DEL');
      const label = key === 'DEL' ? '⌫' : key;
      html += `<button class="nc-key${isWide?' wide':''}" id="nc-key-${key}" onclick="numcrunchKeyPress('${key}')">${label}</button>`;
    });
    html += '</div>';
  });
  html += '</div>';
  html += '</div>';

  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'none';

  // Physical keyboard support — cleanup old handler first
  if (state._keyHandler) document.removeEventListener('keydown', state._keyHandler);
  state._keyHandler = function(e) {
    if (document.getElementById('lockout-screen').style.display !== 'none') return;
    if (state.gameOver) return;
    if (e.key === 'Enter' || e.key === 'Return') { numcrunchKeyPress('ENTER'); e.preventDefault(); }
    else if (e.key === 'Backspace' || e.key === 'Delete') { numcrunchKeyPress('DEL'); e.preventDefault(); }
    else if (/^[0-9+\-*\/=]$/.test(e.key)) { numcrunchKeyPress(e.key); e.preventDefault(); }
  };
  document.addEventListener('keydown', state._keyHandler);
}

function numcrunchKeyPress(key) {
  const state = GS.challengeState.numcrunch;
  if (!state || state.gameOver || state.revealInProgress) return;

  const msgEl = document.getElementById('nc-msg');
  if (msgEl && key !== 'ENTER') msgEl.textContent = '';

  if (key === 'DEL') {
    if (state.currentGuess.length > 0) {
      state.currentGuess = state.currentGuess.slice(0, -1);
      numcrunchUpdateCurrentRow();
    }
    return;
  }

  if (key === 'ENTER') {
    numcrunchSubmitGuess();
    return;
  }

  // Digit or operator key
  if (state.currentGuess.length < state.puzzle.length) {
    state.currentGuess += key;
    numcrunchUpdateCurrentRow();
    // Pop animation
    const tile = document.getElementById('nc-tile-' + state.currentRow + '-' + (state.currentGuess.length - 1));
    if (tile) {
      tile.classList.add('pop');
      setTimeout(() => tile.classList.remove('pop'), 100);
    }
  }
}

function numcrunchUpdateCurrentRow() {
  const state = GS.challengeState.numcrunch;
  for (let col = 0; col < state.puzzle.length; col++) {
    const tile = document.getElementById('nc-tile-' + state.currentRow + '-' + col);
    if (!tile) continue;
    if (col < state.currentGuess.length) {
      tile.textContent = state.currentGuess[col];
      tile.classList.add('filled');
    } else {
      tile.textContent = '';
      tile.classList.remove('filled');
    }
  }
}

function ncShakeRow(state, msgEl, msg) {
  msgEl.textContent = msg;
  msgEl.style.color = 'var(--red)';
  const row = document.getElementById('nc-row-' + state.currentRow);
  if (row) { row.classList.add('animate-shake'); setTimeout(() => row.classList.remove('animate-shake'), 400); }
}

function ncCheckHardMode(state, guess) {
  if (!state.puzzle.hardMode) return null;
  const hints = state.revealedHints;
  // Check green constraints: confirmed chars must stay in same position
  for (const posStr in hints.correct) {
    const pos = parseInt(posStr);
    const ch = hints.correct[pos];
    if (guess[pos] !== ch) return `Must use ${ch} in position ${pos + 1}`;
  }
  // Check orange constraints: present chars must appear somewhere
  for (const ch of hints.present) {
    if (!guess.includes(ch)) return `Must use ${ch} somewhere`;
  }
  return null;
}

function numcrunchSubmitGuess() {
  const state = GS.challengeState.numcrunch;
  const msgEl = document.getElementById('nc-msg');

  if (state.currentGuess.length !== state.puzzle.length) {
    ncShakeRow(state, msgEl, 'Not enough characters');
    return;
  }

  // Validate: must contain exactly one '='
  const eqParts = state.currentGuess.split('=');
  if (eqParts.length !== 2 || !eqParts[0] || !eqParts[1]) {
    ncShakeRow(state, msgEl, 'Must contain exactly one = sign');
    return;
  }

  const leftExpr = eqParts[0];
  const rightExpr = eqParts[1];

  // Validate left side is a valid expression
  if (!/^[0-9+\-*\/]+$/.test(leftExpr)) {
    ncShakeRow(state, msgEl, 'Left side must be a valid expression');
    return;
  }
  // Validate right side is a whole number
  if (!/^[0-9]+$/.test(rightExpr)) {
    ncShakeRow(state, msgEl, 'Right side must be a whole number');
    return;
  }
  // Check for leading zeros
  const numTokens = leftExpr.match(/[0-9]+/g) || [];
  for (const tok of numTokens) {
    if (tok.length > 1 && tok[0] === '0') {
      ncShakeRow(state, msgEl, 'No leading zeros allowed');
      return;
    }
  }
  if (rightExpr.length > 1 && rightExpr[0] === '0') {
    ncShakeRow(state, msgEl, 'No leading zeros allowed');
    return;
  }
  // Check for division by zero
  if (/\/0(?![0-9])/.test(leftExpr)) {
    ncShakeRow(state, msgEl, 'Cannot divide by zero');
    return;
  }

  let leftVal, rightVal;
  try {
    leftVal = Function('"use strict"; return (' + leftExpr + ')')();
    rightVal = parseInt(rightExpr, 10);
  } catch {
    ncShakeRow(state, msgEl, 'Left side must be a valid expression');
    return;
  }

  if (!Number.isFinite(leftVal)) {
    ncShakeRow(state, msgEl, 'Left side must be a valid expression');
    return;
  }

  if (leftVal !== rightVal) {
    // Show actual vs expected
    const actualStr = Number.isInteger(leftVal) ? '' + leftVal : leftVal.toFixed(2);
    ncShakeRow(state, msgEl, leftExpr + ' = ' + actualStr + ', not ' + rightExpr);
    return;
  }

  const guess = state.currentGuess;

  // Hard mode check
  const hardErr = ncCheckHardMode(state, guess);
  if (hardErr) {
    ncShakeRow(state, msgEl, hardErr);
    return;
  }

  const answer = state.puzzle.equation;
  const len = state.puzzle.length;
  const result = Array(len).fill('absent');

  // First pass: correct (exact match)
  const answerChars = answer.split('');
  const guessChars = guess.split('');
  for (let i = 0; i < len; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'correct';
      answerChars[i] = null;
      guessChars[i] = null;
    }
  }
  // Second pass: present
  for (let i = 0; i < len; i++) {
    if (guessChars[i] === null) continue;
    const idx = answerChars.indexOf(guessChars[i]);
    if (idx !== -1) {
      result[i] = 'present';
      answerChars[idx] = null;
    }
  }

  // Update hard mode hints after computing result
  if (state.puzzle.hardMode) {
    for (let i = 0; i < len; i++) {
      if (result[i] === 'correct') {
        state.revealedHints.correct[i] = guess[i];
      } else if (result[i] === 'present') {
        state.revealedHints.present.add(guess[i]);
      }
    }
  }

  state.guesses.push({ word: guess, result });
  msgEl.textContent = '';

  // Lock input during reveal
  state.revealInProgress = true;

  // Remove active row glow from current row
  const curRowEl = document.getElementById('nc-row-' + state.currentRow);
  if (curRowEl) curRowEl.classList.remove('nc-active-row');

  // Reveal tiles with flip animation
  const row = state.currentRow;
  for (let col = 0; col < len; col++) {
    const tile = document.getElementById('nc-tile-' + row + '-' + col);
    if (!tile) continue;
    const delay = col * 300;
    setTimeout(() => {
      tile.classList.add('reveal');
      setTimeout(() => {
        tile.classList.add(result[col]);
        tile.classList.remove('reveal', 'filled');
      }, 250);
    }, delay);
  }

  // Update keyboard and check win/loss after animation
  setTimeout(() => {
    for (let i = 0; i < len; i++) {
      const ch = guess[i];
      const keyEl = document.getElementById('nc-key-' + ch);
      if (!keyEl) continue;
      const current = state.keyStates[ch];
      if (result[i] === 'correct') {
        state.keyStates[ch] = 'correct';
      } else if (result[i] === 'present' && current !== 'correct') {
        state.keyStates[ch] = 'present';
      } else if (!current) {
        state.keyStates[ch] = 'absent';
      }
      keyEl.className = 'nc-key' + (state.keyStates[ch] ? ' ' + state.keyStates[ch] : '');
    }

    const won = result.every(r => r === 'correct');
    state.currentRow++;
    state.currentGuess = '';

    // Update guesses-left counter
    const glEl = document.getElementById('nc-guesses-left');
    if (glEl) {
      const left = state.puzzle.maxGuesses - state.currentRow;
      glEl.textContent = left + ' guess' + (left !== 1 ? 'es' : '') + ' left';
      if (left <= 1 && !won) glEl.classList.add('low');
      else glEl.classList.remove('low');
    }

    if (won) {
      state.gameOver = true;
      state.won = true;
      msgEl.textContent = '';
      // Win celebration: color cascade on winning row
      for (let col = 0; col < len; col++) {
        const tile = document.getElementById('nc-tile-' + (state.currentRow - 1) + '-' + col);
        if (tile) {
          setTimeout(() => {
            tile.classList.add('nc-win-cascade');
            tile.style.animationDelay = (col * 0.15) + 's';
          }, col * 100);
        }
      }
      if (state._keyHandler) document.removeEventListener('keydown', state._keyHandler);
      setTimeout(() => submitNumcrunch(), 2000);
    } else if (state.currentRow >= state.puzzle.maxGuesses) {
      state.gameOver = true;
      state.won = false;
      msgEl.textContent = '';
      if (state._keyHandler) document.removeEventListener('keydown', state._keyHandler);
      setTimeout(() => submitNumcrunch(), 1500);
    } else {
      // Add active row glow to next row
      const nextRow = document.getElementById('nc-row-' + state.currentRow);
      if (nextRow) nextRow.classList.add('nc-active-row');
    }
    state.revealInProgress = false;
  }, len * 300 + 300);
}

function submitNumcrunch() {
  const state = GS.challengeState.numcrunch;
  if (!state) return;
  let score = 0;
  if (state.won) {
    const guessNum = state.guesses.length;
    switch(guessNum) {
      case 1: score = 100; break;
      case 2: score = 90; break;
      case 3: score = 75; break;
      case 4: score = 60; break;
      case 5: score = 40; break;
      case 6: score = 25; break;
    }
  }
  GS.results.numcrunch = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('numcrunch', score);
    lsSet('daily-numcrunch-state-'+getDailyDateStr(), {
      guesses: state.guesses,
      won: state.won,
      puzzle: { equation: state.puzzle.equation, length: state.puzzle.length, maxGuesses: state.puzzle.maxGuesses, difficulty: state.puzzle.difficulty, hardMode: state.puzzle.hardMode }
    });
  }

  document.getElementById('btn-submit-challenge').style.display = 'none';
  showNumbotAnalysis();
}

// Register completed review handler for daily puzzle replay
COMPLETED_REVIEW_HANDLERS.numcrunch = function(c, score) {
  const savedState = lsGet('daily-numcrunch-state-'+getDailyDateStr(), null);
  if (!savedState || !savedState.puzzle) return false;
  const puzzle = savedState.puzzle;
  const guesses = savedState.guesses;
  const diffLabel = puzzle.difficulty ? puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1) : '';
  const hardTag = puzzle.hardMode ? ' (Hard Mode)' : '';
  let html = '<div style="text-align:center">';
  if (diffLabel) {
    html += '<div class="nc-header-bar" style="margin-bottom:10px"><span class="nc-diff-badge ' + (puzzle.difficulty||'') + '">' + diffLabel + hardTag + '</span></div>';
  }
  html += '<div class="nc-board">';
  for (let r = 0; r < puzzle.maxGuesses; r++) {
    html += '<div class="nc-row">';
    for (let col = 0; col < puzzle.length; col++) {
      html += '<div class="nc-tile" id="nc-review-' + r + '-' + col + '"></div>';
    }
    html += '</div>';
  }
  html += '</div>';
  html += '<div class="nc-msg">' + (savedState.won ? '<span style="color:var(--green)">Solved!</span>' : 'The equation was <strong>' + puzzle.equation + '</strong>') + '</div>';
  html += '<div style="margin-top:16px;display:flex;flex-direction:column;align-items:center;gap:10px">';
  html += '<button class="btn btn-primary btn-lg" id="btn-see-numbot" style="min-width:200px">See Numbot Analysis</button>';
  html += '<button class="btn btn-secondary btn-lg" onclick="goToLanding()" style="min-width:200px">Back</button>';
  html += '</div>';
  html += '</div>';
  c.innerHTML = html;
  for (let r = 0; r < guesses.length; r++) {
    const g = guesses[r];
    for (let col = 0; col < puzzle.length; col++) {
      const tile = document.getElementById('nc-review-' + r + '-' + col);
      if (!tile) continue;
      tile.textContent = g.word[col];
      tile.classList.add(g.result[col]);
    }
  }

  // Wire up "See Numbot Analysis" button
  document.getElementById('btn-see-numbot').addEventListener('click', () => {
    GS.challengeState.numcrunch = savedState;
    showNumbotAnalysis();
    const swapBtn = () => {
      const cont = document.getElementById('numbot-continue');
      if (cont) {
        cont.textContent = '\u2190 Back';
        cont.onclick = () => goToLanding();
      } else {
        setTimeout(swapBtn, 200);
      }
    };
    setTimeout(swapBtn, 200);
  });
  return true;
};
