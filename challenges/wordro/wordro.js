function getWordroPuzzle() {
  const diff = GS.difficulty;
  let maxGuesses;
  switch(diff) {
    case 'easy':    maxGuesses = 6; break;
    case 'medium':  maxGuesses = 6; break;
    case 'hard':    maxGuesses = 5; break;
    case 'extreme': maxGuesses = 4; break;
  }
  const pool = diff === 'easy' ? WORDRO_EASY : WORDRO_ANSWERS;
  const word = rngPick(pool).toUpperCase();
  const hardMode = (diff === 'hard' || diff === 'extreme');
  return { word, maxGuesses, hardMode, difficulty: diff };
}

function renderWordro(puzzle) {
  const c = document.getElementById('game-container');
  const state = {
    puzzle,
    guesses: [],
    currentGuess: '',
    currentRow: 0,
    gameOver: false,
    won: false,
    revealInProgress: false,
    revealedHints: { correct: {}, present: new Set() },
    keyStates: {},
    _bgAnalysis: null,   // background analysis promise
    _bgSolver: null      // background solver promise
  };
  GS.challengeState.wordro = state;

  let html = '<div style="text-align:center">';
  // Board
  html += '<div class="wordro-board" id="wordro-board">';
  for (let r = 0; r < puzzle.maxGuesses; r++) {
    html += '<div class="wordro-row" id="wordro-row-' + r + '">';
    for (let col = 0; col < 5; col++) {
      html += '<div class="wordro-tile" id="wordro-tile-' + r + '-' + col + '"></div>';
    }
    html += '</div>';
  }
  html += '</div>';

  // Message area
  html += '<div class="wordro-msg" id="wordro-msg"></div>';

  // Keyboard
  const rows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','DEL']
  ];
  html += '<div class="wordro-keyboard" id="wordro-keyboard">';
  rows.forEach(row => {
    html += '<div class="wordro-kb-row">';
    row.forEach(key => {
      const isWide = (key === 'ENTER' || key === 'DEL');
      const label = key === 'DEL' ? '⌫' : key;
      html += `<button class="wordro-key${isWide?' wide':''}" id="wordro-key-${key}" onclick="wordroKeyPress('${key}')">${label}</button>`;
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
    if (e.key === 'Enter' || e.key === 'Return') { wordroKeyPress('ENTER'); e.preventDefault(); }
    else if (e.key === 'Backspace' || e.key === 'Delete') { wordroKeyPress('DEL'); e.preventDefault(); }
    else if (/^[a-zA-Z]$/.test(e.key)) { wordroKeyPress(e.key.toUpperCase()); e.preventDefault(); }
    else if (e.keyCode === 13) { wordroKeyPress('ENTER'); e.preventDefault(); }
    else if (e.keyCode === 8 || e.keyCode === 46) { wordroKeyPress('DEL'); e.preventDefault(); }
  };
  document.addEventListener('keydown', state._keyHandler);
}

function wordroKeyPress(key) {
  const state = GS.challengeState.wordro;
  if (!state || state.gameOver || state.revealInProgress) return;

  // Clear any previous error message on new input
  const msgEl = document.getElementById('wordro-msg');
  if (msgEl && key !== 'ENTER') msgEl.textContent = '';

  if (key === 'DEL') {
    if (state.currentGuess.length > 0) {
      state.currentGuess = state.currentGuess.slice(0, -1);
      wordroUpdateCurrentRow();
    }
    return;
  }

  if (key === 'ENTER') {
    try {
      wordroSubmitGuess();
    } catch(err) {
      const m = document.getElementById('wordro-msg');
      if (m) { m.textContent = 'Error: ' + err.message; m.style.color = 'var(--red)'; }
      console.error('Wordro submit error:', err);
    }
    return;
  }

  // Letter key
  if (state.currentGuess.length < 5) {
    state.currentGuess += key;
    wordroUpdateCurrentRow();
    // Pop animation on latest tile
    const tile = document.getElementById('wordro-tile-' + state.currentRow + '-' + (state.currentGuess.length - 1));
    if (tile) {
      tile.classList.add('pop');
      setTimeout(() => tile.classList.remove('pop'), 100);
    }
    // Curse word check
    if (_checkCurse(state.currentGuess)) {
      state.currentGuess = '';
      wordroUpdateCurrentRow();
      lockSite();
      return;
    }
  }
}

function wordroUpdateCurrentRow() {
  const state = GS.challengeState.wordro;
  for (let col = 0; col < 5; col++) {
    const tile = document.getElementById('wordro-tile-' + state.currentRow + '-' + col);
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

function wordroSubmitGuess() {
  const state = GS.challengeState.wordro;
  const msgEl = document.getElementById('wordro-msg');
  if (state.currentGuess.length !== 5) {
    msgEl.textContent = 'Not enough letters';
    msgEl.style.color = 'var(--red)';
    // Shake current row
    const row = document.getElementById('wordro-row-' + state.currentRow);
    if (row) { row.classList.add('animate-shake'); setTimeout(() => row.classList.remove('animate-shake'), 400); }
    return;
  }

  // Validate guess is in word bank
  if (!WORDRO_BANK_SET.has(state.currentGuess.toLowerCase())) {
    msgEl.textContent = 'Not in word list';
    msgEl.style.color = 'var(--red)';
    const row = document.getElementById('wordro-row-' + state.currentRow);
    if (row) { row.classList.add('animate-shake'); setTimeout(() => row.classList.remove('animate-shake'), 400); }
    return;
  }

  // Hard mode enforcement
  if (state.puzzle.hardMode && state.guesses.length > 0) {
    const guess = state.currentGuess;
    // Must use correct (green) letters in their positions
    for (const [pos, letter] of Object.entries(state.revealedHints.correct)) {
      if (guess[parseInt(pos)] !== letter) {
        msgEl.textContent = `Must use ${letter} in position ${parseInt(pos) + 1}`;
        msgEl.style.color = 'var(--red)';
        const row = document.getElementById('wordro-row-' + state.currentRow);
        if (row) { row.classList.add('animate-shake'); setTimeout(() => row.classList.remove('animate-shake'), 400); }
        return;
      }
    }
    // Must use present (yellow) letters somewhere
    for (const letter of state.revealedHints.present) {
      if (!guess.includes(letter)) {
        msgEl.textContent = `Must use ${letter} somewhere`;
        msgEl.style.color = 'var(--red)';
        const row = document.getElementById('wordro-row-' + state.currentRow);
        if (row) { row.classList.add('animate-shake'); setTimeout(() => row.classList.remove('animate-shake'), 400); }
        return;
      }
    }
  }

  const guess = state.currentGuess;
  const answer = state.puzzle.word;
  const result = Array(5).fill('absent');

  // First pass: find correct (green)
  const answerLetters = answer.split('');
  const guessLetters = guess.split('');
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = 'correct';
      answerLetters[i] = null;
      guessLetters[i] = null;
    }
  }
  // Second pass: find present (yellow)
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === null) continue;
    const idx = answerLetters.indexOf(guessLetters[i]);
    if (idx !== -1) {
      result[i] = 'present';
      answerLetters[idx] = null;
    }
  }

  // Update hints for hard mode
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') {
      state.revealedHints.correct[i] = guess[i];
      state.revealedHints.present.delete(guess[i]); // promoted to correct
    } else if (result[i] === 'present') {
      if (!state.revealedHints.correct[Object.keys(state.revealedHints.correct).find(k => state.revealedHints.correct[k] === guess[i])]) {
        state.revealedHints.present.add(guess[i]);
      }
    }
  }

  state.guesses.push({ word: guess, result });
  msgEl.textContent = '';

  // NOTE: Background analysis and solver are deferred to game end
  // to avoid freezing the UI during gameplay (these are very expensive)

  // Lock input during reveal animation
  state.revealInProgress = true;

  // Reveal tiles with flip animation
  const row = state.currentRow;
  for (let col = 0; col < 5; col++) {
    const tile = document.getElementById('wordro-tile-' + row + '-' + col);
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

  // Update keyboard after all tiles revealed
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      const letter = guess[i];
      const keyEl = document.getElementById('wordro-key-' + letter);
      if (!keyEl) continue;
      const current = state.keyStates[letter];
      // Priority: correct > present > absent
      if (result[i] === 'correct') {
        state.keyStates[letter] = 'correct';
      } else if (result[i] === 'present' && current !== 'correct') {
        state.keyStates[letter] = 'present';
      } else if (!current) {
        state.keyStates[letter] = 'absent';
      }
      keyEl.className = 'wordro-key' + (state.keyStates[letter] ? ' ' + state.keyStates[letter] : '');
    }

    // Check win/loss
    const won = result.every(r => r === 'correct');
    state.currentRow++;
    state.currentGuess = '';

    if (won) {
      state.gameOver = true;
      state.won = true;
      msgEl.textContent = 'Brilliant!';
      msgEl.style.color = 'var(--green)';
      // Bounce winning row
      for (let col = 0; col < 5; col++) {
        const tile = document.getElementById('wordro-tile-' + (state.currentRow - 1) + '-' + col);
        if (tile) { setTimeout(() => tile.classList.add('animate-bounce'), col * 100); }
      }
      if (state._keyHandler) document.removeEventListener('keydown', state._keyHandler);
      setTimeout(() => submitWordro(), 1800);
    } else if (state.currentRow >= state.puzzle.maxGuesses) {
      state.gameOver = true;
      state.won = false;
      msgEl.innerHTML = `The word was <strong>${answer}</strong>`;
      msgEl.style.color = 'var(--red)';
      if (state._keyHandler) document.removeEventListener('keydown', state._keyHandler);
      setTimeout(() => submitWordro(), 1500);
    }
    // Unlock input for next guess (if game not over)
    state.revealInProgress = false;
  }, 5 * 300 + 300);
}

function submitWordro() {
  const state = GS.challengeState.wordro;
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
  GS.results.wordro = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('wordro', score);
    // Save game state for review
    lsSet('daily-wordro-state-'+getDailyDateStr(), {
      guesses: state.guesses,
      won: state.won,
      puzzle: { word: state.puzzle.word, maxGuesses: state.puzzle.maxGuesses }
    });
  }
  // Disable keyboard
  document.querySelectorAll('.wordro-key').forEach(k => { k.disabled = true; k.style.pointerEvents = 'none'; k.style.cursor = 'default'; });
  const msgEl = document.getElementById('wordro-msg');
  if (msgEl) {
    const label = state.won ? 'Solved' : 'Failed';
    msgEl.innerHTML = `<div style="color:${state.won?'var(--green)':'var(--red)'};font-weight:700;animation:pop 0.4s">${label}! Score: ${score}/100 (${state.guesses.length}/${state.puzzle.maxGuesses} guesses)</div>`;
  }
  showWordrobotAnalysis();
}

// Register completed review handler for daily puzzle replay
COMPLETED_REVIEW_HANDLERS.wordro = function(c, score) {
  const savedState = lsGet('daily-wordro-state-'+getDailyDateStr(), null);
  if (!savedState || !savedState.puzzle) return false;
  // Reconstruct the completed Wordro board from saved state
  const puzzle = savedState.puzzle;
  const guesses = savedState.guesses;
  const maxGuesses = puzzle.maxGuesses;

  let html = '<div style="text-align:center">';
  // Board
  html += '<div class="wordro-board" id="wordro-board">';
  for (let r = 0; r < maxGuesses; r++) {
    html += '<div class="wordro-row" id="wordro-row-' + r + '">';
    for (let col = 0; col < 5; col++) {
      html += '<div class="wordro-tile" id="wordro-tile-' + r + '-' + col + '"></div>';
    }
    html += '</div>';
  }
  html += '</div>';

  // Message area
  html += '<div class="wordro-msg" id="wordro-msg"></div>';

  // Keyboard
  const rows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','DEL']
  ];
  html += '<div class="wordro-keyboard" id="wordro-keyboard">';
  rows.forEach(row => {
    html += '<div class="wordro-kb-row">';
    row.forEach(key => {
      const isWide = (key === 'ENTER' || key === 'DEL');
      const label = key === 'DEL' ? '⌫' : key;
      html += `<button class="wordro-key${isWide?' wide':''}" id="wordro-key-${key}" disabled>${label}</button>`;
    });
    html += '</div>';
  });
  html += '</div>';

  // Buttons
  html += '<div style="margin-top:16px;display:flex;flex-direction:column;align-items:center;gap:10px">';
  html += '<button class="btn btn-primary btn-lg" id="btn-see-wordrobot" style="min-width:200px">See Wordrobot Analysis</button>';
  html += '<button class="btn btn-secondary btn-lg" onclick="goToLanding()" style="min-width:200px">Back</button>';
  html += '</div>';
  html += '</div>';
  c.innerHTML = html;

  // Fill in tiles with letters and colors (no animation, instant)
  const keyStates = {};
  for (let r = 0; r < guesses.length; r++) {
    const g = guesses[r];
    for (let col = 0; col < 5; col++) {
      const tile = document.getElementById('wordro-tile-' + r + '-' + col);
      if (!tile) continue;
      tile.textContent = g.word[col];
      tile.classList.add(g.result[col]);
    }
    // Update key states
    for (let i = 0; i < 5; i++) {
      const letter = g.word[i];
      const current = keyStates[letter];
      if (g.result[i] === 'correct') {
        keyStates[letter] = 'correct';
      } else if (g.result[i] === 'present' && current !== 'correct') {
        keyStates[letter] = 'present';
      } else if (!current) {
        keyStates[letter] = 'absent';
      }
    }
  }
  // Apply key states to keyboard
  for (const [letter, state] of Object.entries(keyStates)) {
    const keyEl = document.getElementById('wordro-key-' + letter);
    if (keyEl) keyEl.className = 'wordro-key ' + state;
  }

  // Show win/loss message
  const msgEl = document.getElementById('wordro-msg');
  if (savedState.won) {
    msgEl.textContent = 'Brilliant!';
    msgEl.style.color = 'var(--green)';
  } else {
    msgEl.innerHTML = `The word was <strong>${puzzle.word}</strong>`;
    msgEl.style.color = 'var(--red)';
  }

  // Wire up "See Wordrobot Analysis" button
  document.getElementById('btn-see-wordrobot').addEventListener('click', () => {
    GS.challengeState.wordro = savedState;
    showWordrobotAnalysis();
    const swapBtn = () => {
      const cont = document.getElementById('wordrobot-continue');
      if (cont) {
        cont.textContent = '← Back';
        cont.onclick = () => goToLanding();
      } else {
        setTimeout(swapBtn, 200);
      }
    };
    setTimeout(swapBtn, 200);
  });
  return true;
};
