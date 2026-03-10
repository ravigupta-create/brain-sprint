// ==================== AUTOPLAY BOT (secret cheat: "srg2") ====================
// Session-only. No localStorage. Resets on reload.

const AUTOPLAY = {
  unlocked: false,
  active: false,
  interval: null,
  busy: false,
  _buf: ''
};

// --- Keystroke detection ---
document.addEventListener('keydown', function(e) {
  const tag = (e.target.tagName || '').toLowerCase();
  const isText = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;

  // Buffer cheat code detection (always, even in text fields)
  if (e.key.length === 1) {
    AUTOPLAY._buf += e.key.toLowerCase();
    if (AUTOPLAY._buf.length > 20) AUTOPLAY._buf = AUTOPLAY._buf.slice(-20);
    if (AUTOPLAY._buf.endsWith('srg2') && !AUTOPLAY.unlocked) {
      AUTOPLAY.unlocked = true;
      showToast('🤖 Autoplay unlocked! Press Space to toggle.');
      return;
    }
  }

  // Spacebar toggle (only outside text inputs)
  if (e.key === ' ' && AUTOPLAY.unlocked && !isText) {
    e.preventDefault();
    e.stopPropagation();
    if (AUTOPLAY.active) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }
}, true); // capture phase so we intercept before game handlers

function startAutoplay() {
  AUTOPLAY.active = true;
  AUTOPLAY.busy = false;
  showBotBadge(true);
  if (AUTOPLAY.interval) clearInterval(AUTOPLAY.interval);
  AUTOPLAY.interval = setInterval(autoplayTick, 600);
  autoplayTick(); // immediate first tick
}

function stopAutoplay() {
  AUTOPLAY.active = false;
  if (AUTOPLAY.interval) { clearInterval(AUTOPLAY.interval); AUTOPLAY.interval = null; }
  showBotBadge(false);
}

// --- Badge ---
function showBotBadge(on) {
  let badge = document.getElementById('autoplay-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'autoplay-badge';
    badge.className = 'autoplay-badge';
    document.body.appendChild(badge);
  }
  if (on) {
    badge.textContent = 'BOT ON';
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
}

// --- Human-like delays ---
function humanDelay(min, max) {
  return min + Math.random() * (max - min);
}

function scheduleAction(fn, minMs, maxMs) {
  setTimeout(() => { if (AUTOPLAY.active) fn(); }, humanDelay(minMs, maxMs));
}

function scheduleSequence(actions, minGap, maxGap, onDone) {
  let delay = 0;
  actions.forEach((fn, i) => {
    delay += humanDelay(minGap, maxGap);
    setTimeout(() => { if (AUTOPLAY.active) fn(); }, delay);
  });
  if (onDone) setTimeout(() => { if (AUTOPLAY.active) onDone(); }, delay + humanDelay(minGap, maxGap));
}

// --- Main tick ---
function autoplayTick() {
  if (!AUTOPLAY.active || AUTOPLAY.busy) return;

  // 1. Intro screen? Click "Start Game"
  const introBtn = document.querySelector('.intro-screen .btn-primary');
  if (introBtn && introBtn.textContent.includes('Start Game')) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { introBtn.click(); AUTOPLAY.busy = false; }, 300, 600);
    return;
  }

  // 2. Challenge summary? Click "Continue →"
  const continueBtn = document.querySelector('.cs-panel .btn-primary');
  if (continueBtn && continueBtn.textContent.includes('Continue')) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { continueBtn.click(); AUTOPLAY.busy = false; }, 400, 800);
    return;
  }

  // 3. Feedback screens with buttons (nummemory, etc.)
  const feedbackBtns = ['continueNumMemory', 'retryNumMemory', 'finishNumMemory'];
  for (const fnName of feedbackBtns) {
    const btn = document.querySelector(`[onclick="${fnName}()"]`);
    if (btn) {
      AUTOPLAY.busy = true;
      scheduleAction(() => { btn.click(); AUTOPLAY.busy = false; }, 300, 600);
      return;
    }
  }

  // 4. "See Score" or "Next Level" type buttons in game container
  const gcBtns = document.querySelectorAll('#game-container .btn');
  for (const btn of gcBtns) {
    const t = btn.textContent;
    if (t.includes('See Score') || t.includes('Next Level') || t.includes('Try Again')) {
      AUTOPLAY.busy = true;
      scheduleAction(() => { btn.click(); AUTOPLAY.busy = false; }, 300, 500);
      return;
    }
  }

  // 5. Results screen? Click "Play Again"
  const resultsScreen = document.getElementById('screen-results');
  if (resultsScreen && resultsScreen.classList.contains('active')) {
    return; // Stop at results
  }

  // 6. Not in game screen? Skip
  const gameScreen = document.getElementById('screen-game');
  if (!gameScreen || !gameScreen.classList.contains('active')) return;

  // 7. Dispatch to per-challenge bot
  const ch = GS.selectedChallenges[GS.currentChallengeIdx];
  if (!ch) return;
  const st = GS.challengeState[ch];
  if (!st) return;

  try {
    botDispatch(ch, st);
  } catch(e) {
    // Silently continue
  }
}

// --- Per-challenge dispatchers ---
function botDispatch(ch, st) {
  switch(ch) {
    case 'paradox': return botParadox(st);
    case 'blocks': return botBlocks(st);
    case 'economy': return botEconomy(st);
    case 'escape': return botEscape(st);
    case 'wordsearch': return botWordsearch(st);
    case 'wordro': return botWordro(st);
    case 'numgrid': return botNumgrid(st);
    case 'wordhive': return botWordhive(st);
    case 'pulse': return botPulse(st);
    case 'deduction': return botDeduction(st);
    case 'memory': return botMemory(st);
    case 'maze': return botMaze(st);
    case 'mosaic': return botMosaic(st);
    case 'numcrunch': return botNumcrunch(st);
    case 'colorcode': return botColorcode(st);
    case 'quickmath': return botQuickmath(st);
    case 'pattern': return botPattern(st);
    case 'oddoneout': return botOddoneout(st);
    case 'estimation': return botEstimation(st);
    case 'hanoi': return botHanoi(st);
    case 'simon': return botSimon(st);
    case 'chainword': return botChainword(st);
    case 'typing': return botTyping(st);
    case 'reaction': return botReaction(st);
    case 'nummemory': return botNummemory(st);
    case 'stroop': return botStroop(st);
    case 'sliding': return botSliding(st);
    case 'spotdiff': return botSpotdiff(st);
    case 'scramble': return botScramble(st);
    case 'math24': return botMath24(st);
    case 'aim': return botAim(st);
    case 'vismemory': return botVismemory(st);
    case 'chimp': return botChimp(st);
    case 'rotation': return botRotation(st);
    case 'pathtracer': return botPathtracer(st);
    case 'association': return botAssociation(st);
    case 'sortrace': return botSortrace(st);
    case 'rhythm': return botRhythm(st);
  }
}

// ===================== BOT HANDLERS =====================

// --- PARADOX: click correct option ---
function botParadox(st) {
  if (st.answered) return;
  AUTOPLAY.busy = true;
  const idx = st.puzzle.correct;
  scheduleAction(() => { selectParadoxOption(idx); AUTOPLAY.busy = false; }, 400, 800);
}

// --- BLOCKS: sort into correct order ---
function botBlocks(st) {
  if (st.submitted) return;
  // Find first mismatch between currentOrder and correctOrder
  const correct = st.puzzle.correctOrder;
  const current = st.currentOrder;
  // Find first wrong position (ignoring distractors)
  for (let i = 0; i < current.length; i++) {
    if (i < correct.length && current[i] !== correct[i]) {
      // Find correct block and swap
      const targetIdx = current.indexOf(correct[i]);
      if (targetIdx >= 0 && targetIdx !== i) {
        AUTOPLAY.busy = true;
        scheduleAction(() => {
          tapBlock(i);
          scheduleAction(() => {
            tapBlock(targetIdx);
            AUTOPLAY.busy = false;
          }, 200, 400);
        }, 200, 400);
        return;
      }
    }
  }
  // If all match, submit
  AUTOPLAY.busy = true;
  scheduleAction(() => { submitBlocks(); AUTOPLAY.busy = false; }, 300, 600);
}

// --- ECONOMY: brute-force optimal slider values ---
function botEconomy(st) {
  if (st.submitted) return;
  const puzzle = st.puzzle;
  // Try to find optimal values by testing
  const vars = puzzle.activeVars;
  let bestOutput = -Infinity;
  let bestVals = {};

  // Brute force each variable in steps
  function tryVals(vidx, current) {
    if (vidx >= vars.length) {
      const allVals = {};
      puzzle.variables.forEach(v => { allVals[v.key] = v.default; });
      Object.assign(allVals, current);
      const ok = puzzle.constraints.every(c => c.check(allVals));
      if (ok) {
        const out = puzzle.output(allVals);
        if (out > bestOutput) { bestOutput = out; bestVals = {...current}; }
      }
      return;
    }
    const v = vars[vidx];
    const step = (v.max - v.min) / 10;
    for (let val = v.min; val <= v.max; val += Math.max(step, 1)) {
      current[v.key] = Math.round(val * 10) / 10;
      tryVals(vidx + 1, current);
    }
    // Also try max
    current[v.key] = v.max;
    tryVals(vidx + 1, current);
  }
  tryVals(0, {});

  // Set sliders to best values
  AUTOPLAY.busy = true;
  const keys = Object.keys(bestVals);
  let delay = 0;
  keys.forEach(key => {
    delay += humanDelay(150, 300);
    setTimeout(() => {
      if (!AUTOPLAY.active) return;
      const slider = document.getElementById('slider-' + key);
      if (slider) {
        slider.value = bestVals[key];
        updateEconomySlider(key, bestVals[key]);
      }
    }, delay);
  });
  delay += humanDelay(400, 700);
  setTimeout(() => {
    if (!AUTOPLAY.active) return;
    submitEconomy();
    AUTOPLAY.busy = false;
  }, delay);
}

// --- ESCAPE: click optimal choice ---
function botEscape(st) {
  if (st.screenIdx >= 5) return;
  const screen = st.puzzle.screens[st.screenIdx];
  if (!screen) return;
  // Check if "Next Scene" button is visible
  const nextBtn = document.getElementById('btn-escape-next');
  if (nextBtn && nextBtn.style.display !== 'none') {
    AUTOPLAY.busy = true;
    scheduleAction(() => { advanceEscape(); AUTOPLAY.busy = false; }, 300, 600);
    return;
  }
  // Check if choices are disabled (already chosen)
  const btns = document.querySelectorAll('.escape-choice');
  if (btns.length > 0 && btns[0].disabled) return;
  // Find optimal
  const optIdx = screen.choices.findIndex(c => c.optimal);
  if (optIdx >= 0) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { selectEscapeChoice(optIdx); AUTOPLAY.busy = false; }, 400, 800);
  }
}

// --- WORDSEARCH: tap cells for each word ---
function botWordsearch(st) {
  const puzzle = st.puzzle;
  // Find next unfound word
  const nextPlacement = puzzle.placements.find(p => !st.foundWords.includes(p.word));
  if (!nextPlacement) {
    // All found, submit
    AUTOPLAY.busy = true;
    scheduleAction(() => { submitWordsearch(); AUTOPLAY.busy = false; }, 300, 600);
    return;
  }
  // Clear current selection first
  if (st.selectedCells.length > 0) {
    st.selectedCells.length = 0;
  }
  // Tap each cell in the word
  AUTOPLAY.busy = true;
  const cells = nextPlacement.cells;
  let delay = 0;
  cells.forEach((cell, i) => {
    delay += humanDelay(100, 250);
    setTimeout(() => { if (AUTOPLAY.active) tapWsCell(cell.r, cell.c); }, delay);
  });
  delay += humanDelay(200, 400);
  setTimeout(() => { AUTOPLAY.busy = false; }, delay);
}

// --- WORDRO: type the correct word ---
function botWordro(st) {
  if (st.gameOver || st.won) return;
  if (st.revealInProgress) return;
  if (st.currentGuess.length > 0) return; // already typing
  AUTOPLAY.busy = true;
  const word = st.puzzle.word;
  let delay = 0;
  for (const ch of word) {
    delay += humanDelay(100, 250);
    setTimeout(() => { if (AUTOPLAY.active) wordroKeyPress(ch); }, delay);
  }
  delay += humanDelay(200, 400);
  setTimeout(() => { if (AUTOPLAY.active) wordroKeyPress('ENTER'); AUTOPLAY.busy = false; }, delay);
}

// --- NUMGRID: fill in solution ---
function botNumgrid(st) {
  // numgrid replaces GS.challengeState entirely
  const gs = GS.challengeState;
  if (!gs || !gs.solution) return;
  const solution = gs.solution;
  const grid = gs.grid;
  const puzzle = gs.puzzle;
  // Find first empty/wrong cell
  for (let r = 0; r < solution.length; r++) {
    for (let c = 0; c < solution[r].length; c++) {
      if (puzzle[r][c] !== 0) continue; // given cell
      if (grid[r][c] !== solution[r][c]) {
        AUTOPLAY.busy = true;
        scheduleAction(() => {
          tapNumgridCell(r, c);
          scheduleAction(() => {
            numgridInput(solution[r][c]);
            AUTOPLAY.busy = false;
          }, 100, 200);
        }, 100, 250);
        return;
      }
    }
  }
  // All filled, submit
  AUTOPLAY.busy = true;
  scheduleAction(() => { submitNumgrid(); AUTOPLAY.busy = false; }, 300, 500);
}

// --- WORDHIVE: type valid words ---
function botWordhive(st) {
  // wordhive replaces GS.challengeState entirely
  const gs = GS.challengeState;
  if (!gs || !gs.validWords) return;
  const found = gs.found || [];
  if (found.length >= (gs.target || gs.validWords.length)) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { submitWordhive(); AUTOPLAY.busy = false; }, 300, 500);
    return;
  }
  // Find next unfound word
  const nextWord = gs.validWords.find(w => !found.includes(w));
  if (!nextWord) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { submitWordhive(); AUTOPLAY.busy = false; }, 300, 500);
    return;
  }
  if (gs.input && gs.input.length > 0) return; // already typing
  AUTOPLAY.busy = true;
  let delay = 0;
  for (const ch of nextWord) {
    delay += humanDelay(80, 200);
    setTimeout(() => { if (AUTOPLAY.active) wordhiveTap(ch); }, delay);
  }
  delay += humanDelay(150, 300);
  setTimeout(() => { if (AUTOPLAY.active) wordhiveEnter(); AUTOPLAY.busy = false; }, delay);
}

// --- PULSE: hit when cursor is in zone ---
function botPulse(st) {
  if (st.gameOver || st.waiting) return;
  const pos = st.position;
  const zoneStart = st.zoneStart;
  const zoneSize = st.zoneSize;
  // Check if in zone (with slight imperfection)
  if (pos >= zoneStart && pos <= zoneStart + zoneSize) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { hitPulse(); AUTOPLAY.busy = false; }, 30, 80);
  }
}

// --- DEDUCTION: ask questions then eliminate non-saboteurs ---
function botDeduction(st) {
  const p = st.puzzle;
  if (st.phase === 'question') {
    // Pick first available question
    const qBtns = document.querySelectorAll('.deduction-q-btn:not(:disabled)');
    if (qBtns.length > 0) {
      AUTOPLAY.busy = true;
      scheduleAction(() => { qBtns[0].click(); AUTOPLAY.busy = false; }, 300, 600);
    }
    return;
  }
  if (st.phase === 'responses') {
    // Click "Proceed to Eliminate"
    const proceedBtn = document.querySelector('[onclick="goToDeductionEliminate()"]');
    if (proceedBtn) {
      AUTOPLAY.busy = true;
      scheduleAction(() => { proceedBtn.click(); AUTOPLAY.busy = false; }, 400, 700);
    }
    return;
  }
  if (st.phase === 'eliminate') {
    // Eliminate a non-saboteur (to WIN - the goal is to keep saboteur alive)
    const sabIdx = p.saboteurIdx;
    const chars = p.characters;
    for (let i = 0; i < chars.length; i++) {
      if (i !== sabIdx && !chars[i].eliminated) {
        AUTOPLAY.busy = true;
        scheduleAction(() => { selectDeductionEliminate(i); AUTOPLAY.busy = false; }, 300, 600);
        return;
      }
    }
  }
}

// --- MEMORY: flip matching pairs ---
function botMemory(st) {
  if (st.locked) return;
  const grid = st.puzzle.grid;
  // Build symbol map
  const symbolMap = {};
  for (let r = 0; r < st.puzzle.rows; r++) {
    for (let c = 0; c < st.puzzle.cols; c++) {
      if (grid[r][c].matched) continue;
      const sym = grid[r][c].symbol;
      if (!symbolMap[sym]) symbolMap[sym] = [];
      symbolMap[sym].push({r, c});
    }
  }
  // Find a pair
  for (const sym in symbolMap) {
    if (symbolMap[sym].length >= 2) {
      const [a, b] = symbolMap[sym];
      AUTOPLAY.busy = true;
      scheduleAction(() => {
        flipMemoryCard(a.r, a.c);
        scheduleAction(() => {
          flipMemoryCard(b.r, b.c);
          AUTOPLAY.busy = false;
        }, 300, 500);
      }, 200, 400);
      return;
    }
  }
}

// --- MAZE: follow optimal path ---
function botMaze(st) {
  if (st.finished) return;
  const path = st.puzzle.optimalPath;
  if (!path || path.length === 0) return;
  // Find current position in optimal path or compute next move
  const pr = st.playerR, pc = st.playerC;
  // Find where we are in optimal path
  let pathIdx = -1;
  for (let i = 0; i < path.length; i++) {
    if (path[i].r === pr && path[i].c === pc) { pathIdx = i; break; }
  }
  if (pathIdx >= 0 && pathIdx < path.length - 1) {
    const next = path[pathIdx + 1];
    const dr = next.r - pr;
    const dc = next.c - pc;
    AUTOPLAY.busy = true;
    scheduleAction(() => { moveMazePlayer(dr, dc); AUTOPLAY.busy = false; }, 80, 180);
  } else {
    // Not on optimal path - use BFS to get to exit
    botMazeBFS(st);
  }
}

function botMazeBFS(st) {
  const p = st.puzzle;
  const rows = p.rows, cols = p.cols;
  const goalR = rows - 1, goalC = cols - 1;
  const visited = Array.from({length: rows}, () => Array(cols).fill(false));
  const queue = [{r: st.playerR, c: st.playerC, path: []}];
  visited[st.playerR][st.playerC] = true;
  const dirs = [{dr:-1,dc:0,wall:'top'},{dr:1,dc:0,wall:'bottom'},{dr:0,dc:-1,wall:'left'},{dr:0,dc:1,wall:'right'}];
  while (queue.length > 0) {
    const {r,c,path} = queue.shift();
    if (r === goalR && c === goalC) {
      if (path.length > 0) {
        AUTOPLAY.busy = true;
        scheduleAction(() => { moveMazePlayer(path[0].dr, path[0].dc); AUTOPLAY.busy = false; }, 80, 180);
      }
      return;
    }
    for (const d of dirs) {
      const nr = r + d.dr, nc = c + d.dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (visited[nr][nc]) continue;
      if (p.walls[r][c][d.wall]) continue;
      visited[nr][nc] = true;
      queue.push({r: nr, c: nc, path: [...path, {dr: d.dr, dc: d.dc}]});
    }
  }
}

// --- MOSAIC: place tokens using trial ---
function botMosaic(st) {
  // Check if there's a check button
  const checkBtn = document.querySelector('[onclick="checkMosaicSolution()"]');
  // Find empty cells and try to place tokens
  const tokenBtns = document.querySelectorAll('.mosaic-token:not(.placed)');
  if (tokenBtns.length === 0 && checkBtn) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { checkMosaicSolution(); AUTOPLAY.busy = false; }, 400, 700);
    return;
  }
  // Select first available token
  if (tokenBtns.length > 0) {
    const emptyCells = document.querySelectorAll('.mosaic-cell:not(.filled)');
    if (emptyCells.length > 0) {
      AUTOPLAY.busy = true;
      scheduleAction(() => {
        tokenBtns[0].click();
        scheduleAction(() => {
          emptyCells[0].click();
          AUTOPLAY.busy = false;
        }, 200, 400);
      }, 200, 400);
    }
  }
}

// --- NUMCRUNCH: type the equation ---
function botNumcrunch(st) {
  if (st.gameOver || st.won) return;
  if (st.revealInProgress) return;
  if (st.currentGuess.length > 0) return;
  AUTOPLAY.busy = true;
  const eq = st.puzzle.equation;
  let delay = 0;
  for (const ch of eq) {
    delay += humanDelay(100, 250);
    const key = ch === '×' ? '*' : ch === '÷' ? '/' : ch;
    setTimeout(() => { if (AUTOPLAY.active) numcrunchKeyPress(key); }, delay);
  }
  delay += humanDelay(200, 400);
  setTimeout(() => { if (AUTOPLAY.active) numcrunchKeyPress('ENTER'); AUTOPLAY.busy = false; }, delay);
}

// --- COLORCODE: place correct colors ---
function botColorcode(st) {
  if (st.gameOver) return;
  const code = st.puzzle.code;
  const row = st.currentRow;
  const guess = st.guesses ? st.guesses[row] : st.currentGuess;
  // Check if current row needs filling
  if (!st.currentGuess || st.currentGuess.some(c => c === null || c === undefined)) {
    AUTOPLAY.busy = true;
    let delay = 0;
    for (let slot = 0; slot < code.length; slot++) {
      delay += humanDelay(150, 300);
      const colorIdx = st.puzzle.colors.indexOf(code[slot]);
      ((s, ci) => {
        setTimeout(() => {
          if (!AUTOPLAY.active) return;
          selectColorSlot(row, s);
          scheduleAction(() => { pickColor(ci); }, 100, 200);
        }, delay);
      })(slot, colorIdx);
    }
    delay += humanDelay(400, 600);
    setTimeout(() => { if (AUTOPLAY.active) { submitColorCode(); } AUTOPLAY.busy = false; }, delay);
  }
}

// --- QUICKMATH: calculate and type answer ---
function botQuickmath(st) {
  if (st.gameOver || !st.currentProblem) return;
  const answer = st.currentProblem.answer;
  if (answer === undefined || answer === null) return;
  const ansStr = String(answer);
  AUTOPLAY.busy = true;
  // Clear existing input
  const input = document.getElementById('qm-input');
  if (input) input.value = '';
  st.userAnswer = '';
  let delay = 0;
  for (const ch of ansStr) {
    delay += humanDelay(60, 150);
    const key = ch === '-' ? '-' : ch;
    setTimeout(() => { if (AUTOPLAY.active) qmNumPress(key); }, delay);
  }
  delay += humanDelay(100, 250);
  setTimeout(() => { if (AUTOPLAY.active) qmSubmitAnswer(); AUTOPLAY.busy = false; }, delay);
}

// --- PATTERN: click correct answer ---
function botPattern(st) {
  if (st.gameOver) return;
  const round = st.puzzle.rounds[st.currentRound];
  if (!round) return;
  const correctIdx = round.choices.indexOf(round.answer);
  if (correctIdx >= 0) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { selectPatternAnswer(correctIdx); AUTOPLAY.busy = false; }, 300, 600);
  }
}

// --- ODDONEOUT: click the odd item ---
function botOddoneout(st) {
  if (st.gameOver) return;
  const round = st.puzzle.rounds[st.currentRound];
  if (!round) return;
  const oddIdx = round.items.indexOf(round.oddItem);
  if (oddIdx >= 0) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { selectOddItem(oddIdx); AUTOPLAY.busy = false; }, 300, 600);
  }
}

// --- ESTIMATION: type exact answer ---
function botEstimation(st) {
  if (st.gameOver) return;
  const round = st.puzzle.rounds ? st.puzzle.rounds[st.currentRound] : null;
  if (!round) return;
  const answer = round.answer;
  const input = document.getElementById('est-input');
  if (!input) return;
  AUTOPLAY.busy = true;
  input.value = answer;
  // Trigger input event
  input.dispatchEvent(new Event('input', {bubbles: true}));
  scheduleAction(() => { submitEstimation(); AUTOPLAY.busy = false; }, 300, 500);
}

// --- HANOI: solve optimally using recursive algorithm ---
function botHanoi(st) {
  if (st.gameOver) return;
  // Compute optimal move sequence
  if (!st._botMoves) {
    st._botMoves = [];
    st._botMoveIdx = 0;
    solveHanoi(st.puzzle.discs, 0, 2, 1, st._botMoves);
  }
  if (st._botMoveIdx >= st._botMoves.length) return;
  const move = st._botMoves[st._botMoveIdx];
  AUTOPLAY.busy = true;
  scheduleAction(() => {
    hanoiTapPeg(move.from);
    scheduleAction(() => {
      hanoiTapPeg(move.to);
      st._botMoveIdx++;
      AUTOPLAY.busy = false;
    }, 150, 300);
  }, 150, 300);
}

function solveHanoi(n, from, to, aux, moves) {
  if (n === 0) return;
  solveHanoi(n - 1, from, aux, to, moves);
  moves.push({from, to});
  solveHanoi(n - 1, aux, to, from, moves);
}

// --- SIMON: replay the sequence ---
function botSimon(st) {
  if (st.gameOver || st.playing || !st.inputEnabled) return;
  const expected = st.sequence[st.playerInput.length];
  if (expected === undefined) return;
  AUTOPLAY.busy = true;
  scheduleAction(() => { simonPlayerTap(expected); AUTOPLAY.busy = false; }, 200, 450);
}

// --- CHAINWORD: find valid word starting with last letter ---
function botChainword(st) {
  if (st.gameOver) return;
  const chain = st.chain;
  const lastWord = chain[chain.length - 1];
  const lastLetter = lastWord[lastWord.length - 1].toLowerCase();
  const minLen = st.puzzle.minLen || 3;

  // Try to find a word from the global word list
  const used = new Set(chain.map(w => w.toLowerCase()));
  let word = null;

  // Check if there's a WORD_LIST or similar global
  const wordList = (typeof TYPING_WORDS !== 'undefined')
    ? [].concat(...Object.values(TYPING_WORDS))
    : [];

  // Also try BS_WORD_SET if available
  if (typeof BS_WORD_SET !== 'undefined') {
    for (const w of BS_WORD_SET) {
      if (w.length >= minLen && w[0].toLowerCase() === lastLetter && !used.has(w.toLowerCase())) {
        word = w;
        break;
      }
    }
  }

  if (!word) {
    for (const w of wordList) {
      if (w.length >= minLen && w[0].toLowerCase() === lastLetter && !used.has(w.toLowerCase())) {
        word = w;
        break;
      }
    }
  }

  if (!word) {
    // Generate a common word starting with the letter
    const commonWords = {
      a:'apple',b:'banana',c:'cherry',d:'dance',e:'eagle',f:'flower',g:'grape',
      h:'house',i:'island',j:'jungle',k:'knight',l:'lemon',m:'mango',n:'night',
      o:'orange',p:'peace',q:'queen',r:'river',s:'stone',t:'tiger',u:'uncle',
      v:'violet',w:'water',x:'xenon',y:'youth',z:'zebra'
    };
    word = commonWords[lastLetter] || lastLetter + 'ight';
  }

  const input = document.getElementById('chain-input');
  if (input) {
    AUTOPLAY.busy = true;
    input.value = word;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    scheduleAction(() => { submitChainword(); AUTOPLAY.busy = false; }, 200, 400);
  }
}

// --- TYPING: type the current word ---
function botTyping(st) {
  if (st.done) return;
  if (st.currentWordIdx >= st.words.length) return;
  const word = st.words[st.currentWordIdx];
  const input = document.getElementById('typing-input');
  if (!input) return;
  // Start timer if not started
  if (!st.startTime) {
    input.dispatchEvent(new Event('input', {bubbles: true}));
  }
  AUTOPLAY.busy = true;
  input.value = '';
  let delay = 0;
  for (const ch of word) {
    delay += humanDelay(30, 80);
    ((character) => {
      setTimeout(() => {
        if (!AUTOPLAY.active) return;
        input.value += character;
        st.typed = input.value;
        input.dispatchEvent(new Event('input', {bubbles: true}));
      }, delay);
    })(ch);
  }
  delay += humanDelay(50, 120);
  setTimeout(() => {
    if (!AUTOPLAY.active) return;
    submitTypingWord(st);
    AUTOPLAY.busy = false;
  }, delay);
}

// --- REACTION: click at the right time ---
function botReaction(st) {
  if (st.done) return;
  if (st.phase === 'waiting' || st.phase === 'result') {
    AUTOPLAY.busy = true;
    scheduleAction(() => { handleReactionClick(); AUTOPLAY.busy = false; }, 300, 600);
    return;
  }
  if (st.phase === 'green') {
    // React with slight human delay
    AUTOPLAY.busy = true;
    scheduleAction(() => { handleReactionClick(); AUTOPLAY.busy = false; }, 180, 280);
    return;
  }
  // If red, do nothing - wait for green
}

// --- NUMMEMORY: type the memorized number ---
function botNummemory(st) {
  if (st.done) return;
  if (st.phase === 'show') return; // still showing
  if (st.phase === 'feedback') {
    // Click continue/retry/finish button
    return; // handled by main tick's button scanner
  }
  if (st.phase === 'input') {
    const input = document.getElementById('nummem-input');
    if (!input) return;
    AUTOPLAY.busy = true;
    const num = st.currentNumber;
    input.value = num;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    scheduleAction(() => { submitNumMemory(); AUTOPLAY.busy = false; }, 200, 400);
  }
}

// --- STROOP: pick the display color ---
function botStroop(st) {
  if (st.done) return;
  if (!st.currentColor) return;
  AUTOPLAY.busy = true;
  scheduleAction(() => { pickStroop(st.currentColor.name); AUTOPLAY.busy = false; }, 200, 500);
}

// --- SLIDING: solve step by step ---
function botSliding(st) {
  if (st.done) return;
  // Find a tile adjacent to empty that should be moved
  const neighbors = getSlidingNeighbors(st.emptyIdx, st.size);
  // Use simple strategy: try each neighbor and pick the one that improves state
  let bestIdx = -1;
  let bestScore = countCorrectTiles(st.tiles, st.solved);

  for (const idx of neighbors) {
    // Simulate swap
    const test = [...st.tiles];
    test[st.emptyIdx] = test[idx];
    test[idx] = 0;
    const score = countCorrectTiles(test, st.solved);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  }

  // If no improvement, just pick a random neighbor
  if (bestIdx === -1) {
    bestIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
  }

  AUTOPLAY.busy = true;
  scheduleAction(() => { clickSlidingTile(bestIdx); AUTOPLAY.busy = false; }, 80, 180);
}

function countCorrectTiles(tiles, solved) {
  let count = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === solved[i]) count++;
  }
  return count;
}

// --- SPOTDIFF: click all differences ---
function botSpotdiff(st) {
  if (st.done) return;
  // Find first unfound diff
  for (const idx of st.diffIndices) {
    if (!st.found.has(idx)) {
      AUTOPLAY.busy = true;
      scheduleAction(() => { clickSpotDiff(idx); AUTOPLAY.busy = false; }, 200, 500);
      return;
    }
  }
}

// --- SCRAMBLE: type unscrambled word ---
function botScramble(st) {
  if (st.done || st.gameOver) return;
  if (!st.currentWord) return;
  const input = document.getElementById('scr-input');
  if (!input) return;
  AUTOPLAY.busy = true;
  input.value = st.currentWord;
  input.dispatchEvent(new Event('input', {bubbles: true}));
  scheduleAction(() => { submitScrambleWord(); AUTOPLAY.busy = false; }, 200, 400);
}

// --- MATH24: find and type a solution ---
function botMath24(st) {
  if (st.done || st.gameOver) return;
  if (!st.puzzle || !st.puzzle.puzzles) return;
  const nums = st.puzzle.puzzles[st.round];
  const solution = findSolution24(nums);
  const input = document.getElementById('m24-input');
  if (!input || !solution) return;
  AUTOPLAY.busy = true;
  input.value = solution;
  input.dispatchEvent(new Event('input', {bubbles: true}));
  scheduleAction(() => { submitMath24(); AUTOPLAY.busy = false; }, 300, 500);
}

function findSolution24(nums) {
  const ops = ['+','-','*','/'];
  // Try all permutations of 4 numbers
  const perms = permutations(nums);
  for (const p of perms) {
    for (const o1 of ops) {
      for (const o2 of ops) {
        for (const o3 of ops) {
          // Try different bracket patterns
          const exprs = [
            `((${p[0]}${o1}${p[1]})${o2}${p[2]})${o3}${p[3]}`,
            `(${p[0]}${o1}(${p[1]}${o2}${p[2]}))${o3}${p[3]}`,
            `(${p[0]}${o1}${p[1]})${o2}(${p[2]}${o3}${p[3]})`,
            `${p[0]}${o1}((${p[1]}${o2}${p[2]})${o3}${p[3]})`,
            `${p[0]}${o1}(${p[1]}${o2}(${p[2]}${o3}${p[3]}))`
          ];
          for (const expr of exprs) {
            try {
              if (Math.abs(Function('"use strict";return(' + expr + ')')() - 24) < 0.001) {
                return expr;
              }
            } catch(e) {}
          }
        }
      }
    }
  }
  return null;
}

function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

// --- AIM: click target elements ---
function botAim(st) {
  if (st.done) return;
  const target = document.querySelector('.aim-target');
  if (target) {
    AUTOPLAY.busy = true;
    scheduleAction(() => { target.click(); AUTOPLAY.busy = false; }, 150, 350);
  }
}

// --- VISMEMORY: click memorized tiles ---
function botVismemory(st) {
  if (st.done) return;
  if (st.phase === 'show') return; // still showing
  if (st.phase === 'input') {
    // Click a highlighted tile that hasn't been found
    for (const idx of st.highlighted) {
      if (!st.found.has(idx)) {
        AUTOPLAY.busy = true;
        scheduleAction(() => { clickVisMemCell(idx); AUTOPLAY.busy = false; }, 200, 400);
        return;
      }
    }
  }
}

// --- CHIMP: click numbers in order ---
function botChimp(st) {
  if (st.done) return;
  if (st.phase === 'show') {
    // Click number 1 to start
    AUTOPLAY.busy = true;
    scheduleAction(() => { clickChimpCell(1); AUTOPLAY.busy = false; }, 400, 700);
    return;
  }
  if (st.phase === 'input') {
    const next = st.nextExpected;
    AUTOPLAY.busy = true;
    scheduleAction(() => { clickChimpCell(next); AUTOPLAY.busy = false; }, 150, 350);
  }
}

// --- ROTATION: pick correct option ---
function botRotation(st) {
  if (st.done) return;
  // Find the correct option
  const options = document.querySelectorAll('.rotation-option');
  for (let i = 0; i < options.length; i++) {
    // The correct option has data-correct="true" or similar
    const opt = options[i];
    if (opt.dataset.correct === 'true' || opt.getAttribute('onclick')?.includes('true')) {
      AUTOPLAY.busy = true;
      scheduleAction(() => { opt.click(); AUTOPLAY.busy = false; }, 300, 600);
      return;
    }
  }
}

// --- PATHTRACER: click dots in order ---
function botPathtracer(st) {
  if (st.done) return;
  if (st.phase === 'show') return; // still showing
  if (st.phase === 'input') {
    const nextIdx = st.playerPath.length;
    if (nextIdx < st.path.length) {
      const cellIdx = st.path[nextIdx];
      AUTOPLAY.busy = true;
      scheduleAction(() => { clickPathCell(cellIdx); AUTOPLAY.busy = false; }, 200, 450);
    }
  }
}

// --- ASSOCIATION: pick correct word ---
function botAssociation(st) {
  if (st.done) return;
  // Find button where picked === correct (both args in onclick match)
  const btns = document.querySelectorAll('.assoc-btn');
  for (const btn of btns) {
    const onclick = btn.getAttribute('onclick') || '';
    // onclick format: pickAssociation('Word','CorrectWord')
    const m = onclick.match(/pickAssociation\('([^']*)','([^']*)'\)/);
    if (m && m[1] === m[2]) {
      AUTOPLAY.busy = true;
      scheduleAction(() => { btn.click(); AUTOPLAY.busy = false; }, 300, 600);
      return;
    }
  }
}

// --- SORTRACE: arrange items in correct order ---
function botSortrace(st) {
  if (st.done || st.gameOver) return;
  if (!st.correctOrder || !st.currentItems) return;
  // Find first item out of place and move it
  for (let i = 0; i < st.currentItems.length; i++) {
    if (st.currentItems[i] !== st.correctOrder[i]) {
      // Find where the correct item is
      const correctItem = st.correctOrder[i];
      const currentIdx = st.currentItems.indexOf(correctItem);
      if (currentIdx > i) {
        // Move it up
        AUTOPLAY.busy = true;
        scheduleAction(() => { moveSortItem(currentIdx, -1); AUTOPLAY.busy = false; }, 100, 250);
        return;
      }
    }
  }
  // All correct, submit
  AUTOPLAY.busy = true;
  scheduleAction(() => { submitSortRound(); AUTOPLAY.busy = false; }, 300, 500);
}

// --- RHYTHM: tap with correct timing ---
function botRhythm(st) {
  if (st.done) return;
  if (st.phase === 'listen') return; // still listening
  if (st.phase === 'tap') {
    if (st.playerTaps.length >= st.beatCount) return;
    // For first tap, just tap immediately
    if (st.playerTaps.length === 0) {
      AUTOPLAY.busy = true;
      scheduleAction(() => { tapRhythm(); AUTOPLAY.busy = false; }, 100, 200);
      return;
    }
    // For subsequent taps, match the gap from the pattern
    const tapIdx = st.playerTaps.length;
    if (tapIdx < st.pattern.length) {
      const expectedGap = st.pattern[tapIdx] - st.pattern[tapIdx - 1];
      const elapsed = performance.now() - st.startTime - st.playerTaps[st.playerTaps.length - 1];
      const remaining = expectedGap - elapsed;
      if (remaining <= 30) {
        // Time to tap (with slight imperfection ±20ms)
        const jitter = (Math.random() - 0.5) * 40;
        AUTOPLAY.busy = true;
        setTimeout(() => {
          if (AUTOPLAY.active && st.phase === 'tap') tapRhythm();
          AUTOPLAY.busy = false;
        }, Math.max(0, jitter));
      }
      // Otherwise wait for next tick
    }
  }
}
