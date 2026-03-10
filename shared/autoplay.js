// ==================== AUTOPLAY BOT (secret cheat: "srg2") ====================
// Session-only. No localStorage. Resets on reload.
// 100/100 performance. Bot has total control when active.

const AUTOPLAY = {
  unlocked: false,
  active: false,
  interval: null,
  busy: false,
  _buf: '',
  _pulseRAF: null,
  _botClicking: false
};

// --- Keystroke detection + input blocking ---
document.addEventListener('keydown', function(e) {
  // Cheat code detection (only when bot is off)
  if (e.key.length === 1 && !AUTOPLAY.active) {
    const tag = (e.target.tagName || '').toLowerCase();
    const isText = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
    AUTOPLAY._buf += e.key.toLowerCase();
    if (AUTOPLAY._buf.length > 20) AUTOPLAY._buf = AUTOPLAY._buf.slice(-20);
    if (AUTOPLAY._buf.endsWith('srg2') && !AUTOPLAY.unlocked) {
      AUTOPLAY.unlocked = true;
      showToast('Verified');
      return;
    }
  }
  // Shift toggle (always works when unlocked)
  if (e.key === 'Shift' && AUTOPLAY.unlocked) {
    e.preventDefault();
    e.stopPropagation();
    if (AUTOPLAY.active) stopAutoplay(); else startAutoplay();
    return;
  }
  // Block ALL other keyboard input while bot is active
  if (AUTOPLAY.active) {
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

// Block mouse events while bot is active (overlay catches them)
function showBotOverlay(on) {
  let ov = document.getElementById('autoplay-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'autoplay-overlay';
    ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9997;background:transparent;cursor:default;';
    document.body.appendChild(ov);
  }
  ov.style.display = on ? 'block' : 'none';
}

function startAutoplay() {
  AUTOPLAY.active = true;
  AUTOPLAY.busy = false;
  showBotBadge(true);
  showBotOverlay(true);
  if (AUTOPLAY.interval) clearInterval(AUTOPLAY.interval);
  AUTOPLAY.interval = setInterval(autoplayTick, 400);
  AUTOPLAY._pulseRAF = requestAnimationFrame(pulseFastLoop);
  autoplayTick();
}

function stopAutoplay() {
  AUTOPLAY.active = false;
  if (AUTOPLAY.interval) { clearInterval(AUTOPLAY.interval); AUTOPLAY.interval = null; }
  if (AUTOPLAY._pulseRAF) { cancelAnimationFrame(AUTOPLAY._pulseRAF); AUTOPLAY._pulseRAF = null; }
  showBotBadge(false);
  showBotOverlay(false);
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
  badge.textContent = 'AUTO';
  badge.style.display = on ? 'block' : 'none';
}

// ===================== TIMING =====================
function gaussRand() {
  const u1 = Math.random(), u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
}
function gDelay(mean, sd) {
  return Math.max(mean * 0.25, mean + gaussRand() * sd);
}

// Per-challenge thinking time (shorter for max score)
const BOT_THINK = {
  paradox:1200, blocks:800, economy:1200, escape:1400, wordsearch:800,
  wordro:600, numgrid:800, wordhive:600, pulse:300, deduction:800,
  memory:500, maze:400, mosaic:800, numcrunch:800, colorcode:600,
  quickmath:200, pattern:600, oddoneout:500, estimation:800, hanoi:600,
  simon:300, chainword:600, typing:200, reaction:200, nummemory:200,
  stroop:200, sliding:600, spotdiff:500, scramble:600, math24:1000,
  aim:200, vismemory:200, chimp:300, rotation:600, pathtracer:200,
  association:400, sortrace:500, rhythm:200
};

// ===================== PULSE — requestAnimationFrame for frame-perfect precision =====================
function pulseFastLoop() {
  if (!AUTOPLAY.active) return;
  AUTOPLAY._pulseRAF = requestAnimationFrame(pulseFastLoop);
  const ch = GS.selectedChallenges && GS.selectedChallenges[GS.currentChallengeIdx];
  if (ch !== 'pulse') return;
  const st = GS.challengeState && GS.challengeState[ch];
  if (!st || st.gameOver || st.waiting || AUTOPLAY.busy) return;
  if (!st._botReady) return; // wait for think time
  const pos = st.position, start = st.zoneStart, end = start + st.zoneSize;
  const center = (start + end) / 2, margin = st.zoneSize * 0.35;
  if (pos >= center - margin && pos <= center + margin) {
    AUTOPLAY.busy = true;
    hitPulse();
    setTimeout(() => { AUTOPLAY.busy = false; }, 40);
  }
}

// ===================== MAIN TICK =====================
function autoplayTick() {
  if (!AUTOPLAY.active || AUTOPLAY.busy) return;

  // UI buttons
  const introBtn = document.querySelector('.intro-screen .btn-primary');
  if (introBtn) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) introBtn.click(); AUTOPLAY.busy = false; }, gDelay(500, 120));
    return;
  }
  const continueBtn = document.querySelector('.cs-panel .btn-primary');
  if (continueBtn && continueBtn.textContent.includes('Continue')) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) continueBtn.click(); AUTOPLAY.busy = false; }, gDelay(400, 100));
    return;
  }
  for (const fn of ['continueNumMemory','retryNumMemory','finishNumMemory']) {
    const btn = document.querySelector(`[onclick="${fn}()"]`);
    if (btn) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) btn.click(); AUTOPLAY.busy = false; }, gDelay(350, 80));
      return;
    }
  }
  const gcBtns = document.querySelectorAll('#game-container .btn');
  for (const btn of gcBtns) {
    const t = btn.textContent;
    if (t.includes('See Score') || t.includes('Next Level')) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) btn.click(); AUTOPLAY.busy = false; }, gDelay(350, 80));
      return;
    }
  }

  // Results screen → auto-stop, give user full control
  const resultsScreen = document.getElementById('screen-results');
  if (resultsScreen && resultsScreen.classList.contains('active')) {
    stopAutoplay();
    return;
  }

  const gameScreen = document.getElementById('screen-game');
  if (!gameScreen || !gameScreen.classList.contains('active')) return;

  // Dispatch to challenge bot
  const ch = GS.selectedChallenges[GS.currentChallengeIdx];
  if (!ch) return;
  let st = GS.challengeState[ch];
  if (!st && (ch === 'numgrid' || ch === 'wordhive')) st = GS.challengeState;
  if (!st) return;

  // Thinking delay
  if (!st._botReady) {
    if (!st._botThinkStart) {
      st._botThinkStart = Date.now();
      st._botThinkDur = gDelay(BOT_THINK[ch] || 800, (BOT_THINK[ch] || 800) * 0.25);
    }
    if (Date.now() - st._botThinkStart < st._botThinkDur) return;
    st._botReady = true;
  }

  try { botDispatch(ch, st); } catch(e) {}
}

// ===================== DISPATCH =====================
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
    case 'pulse': return; // handled by pulseFastLoop RAF
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

// ===================== BOT HANDLERS (100/100 performance) =====================

function botParadox(st) {
  if (st.answered) return;
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) selectParadoxOption(st.puzzle.correct); AUTOPLAY.busy = false; }, gDelay(500, 120));
}

function botBlocks(st) {
  if (st.submitted) return;
  const correct = st.puzzle.correctOrder, current = st.currentOrder;
  for (let i = 0; i < current.length; i++) {
    if (i < correct.length && current[i] !== correct[i]) {
      const ti = current.indexOf(correct[i]);
      if (ti >= 0 && ti !== i) {
        AUTOPLAY.busy = true;
        setTimeout(() => {
          if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
          tapBlock(i);
          setTimeout(() => { if (AUTOPLAY.active) tapBlock(ti); AUTOPLAY.busy = false; }, gDelay(200, 50));
        }, gDelay(250, 60));
        return;
      }
    }
  }
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) submitBlocks(); AUTOPLAY.busy = false; }, gDelay(300, 70));
}

function botEconomy(st) {
  if (st.submitted) return;
  const puzzle = st.puzzle, vars = puzzle.activeVars;
  let bestOutput = -Infinity, bestVals = {};
  function tryVals(vi, cur) {
    if (vi >= vars.length) {
      const all = {};
      puzzle.variables.forEach(v => { all[v.key] = v.default; });
      Object.assign(all, cur);
      if (puzzle.constraints.every(c => c.check(all))) {
        const out = puzzle.output(all);
        if (out > bestOutput) { bestOutput = out; bestVals = {...cur}; }
      }
      return;
    }
    const v = vars[vi], step = Math.max((v.max - v.min) / 10, 1);
    for (let val = v.min; val <= v.max; val += step) {
      cur[v.key] = Math.round(val * 10) / 10;
      tryVals(vi + 1, cur);
    }
    cur[v.key] = v.max; tryVals(vi + 1, cur);
  }
  tryVals(0, {});
  AUTOPLAY.busy = true;
  let delay = 0;
  Object.keys(bestVals).forEach(key => {
    delay += gDelay(200, 50);
    setTimeout(() => {
      if (!AUTOPLAY.active) return;
      const s = document.getElementById('slider-' + key);
      if (s) { s.value = bestVals[key]; updateEconomySlider(key, bestVals[key]); }
    }, delay);
  });
  delay += gDelay(350, 80);
  setTimeout(() => { if (AUTOPLAY.active) submitEconomy(); AUTOPLAY.busy = false; }, delay);
}

function botEscape(st) {
  if (st.screenIdx >= 5) return;
  const screen = st.puzzle.screens[st.screenIdx];
  if (!screen) return;
  const nextBtn = document.getElementById('btn-escape-next');
  if (nextBtn && nextBtn.style.display !== 'none') {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) advanceEscape(); AUTOPLAY.busy = false; }, gDelay(600, 150));
    return;
  }
  const btns = document.querySelectorAll('.escape-choice');
  if (btns.length > 0 && btns[0].disabled) return;
  const optIdx = screen.choices.findIndex(c => c.optimal);
  if (optIdx >= 0) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) selectEscapeChoice(optIdx); AUTOPLAY.busy = false; }, gDelay(800, 200));
  }
}

function botWordsearch(st) {
  const next = st.puzzle.placements.find(p => !st.foundWords.includes(p.word));
  if (!next) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) submitWordsearch(); AUTOPLAY.busy = false; }, gDelay(300, 70));
    return;
  }
  if (st.selectedCells.length > 0) st.selectedCells.length = 0;
  AUTOPLAY.busy = true;
  let delay = gDelay(400 + st.foundWords.length * 150, 80);
  next.cells.forEach(cell => {
    delay += gDelay(80, 20);
    ((r, c, d) => { setTimeout(() => { if (AUTOPLAY.active) tapWsCell(r, c); }, d); })(cell.r, cell.c, delay);
  });
  delay += gDelay(150, 30);
  setTimeout(() => { AUTOPLAY.busy = false; }, delay);
}

// --- WORDRO — solve first guess for 100/100 ---
function botWordro(st) {
  if (st.gameOver || st.won || st.revealInProgress) return;
  if (st.currentGuess.length > 0) return;
  AUTOPLAY.busy = true;
  const word = st.puzzle.word;
  let delay = gDelay(400, 100);
  for (const ch of word) {
    delay += gDelay(120, 30);
    ((c, d) => { setTimeout(() => { if (AUTOPLAY.active) wordroKeyPress(c.toUpperCase()); }, d); })(ch, delay);
  }
  delay += gDelay(250, 60);
  setTimeout(() => { if (AUTOPLAY.active) wordroKeyPress('ENTER'); AUTOPLAY.busy = false; }, delay);
}

function botNumgrid(st) {
  const gs = GS.challengeState;
  if (!gs || !gs.solution) return;
  const solution = gs.solution, grid = gs.grid, puzzle = gs.puzzle;
  for (let r = 0; r < solution.length; r++) {
    for (let c = 0; c < solution[r].length; c++) {
      if (puzzle[r][c] !== 0) continue;
      if (grid[r][c] !== solution[r][c]) {
        AUTOPLAY.busy = true;
        setTimeout(() => {
          if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
          tapNumgridCell(r, c);
          setTimeout(() => { if (AUTOPLAY.active) numgridInput(solution[r][c]); AUTOPLAY.busy = false; }, gDelay(100, 25));
        }, gDelay(120, 30));
        return;
      }
    }
  }
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) submitNumgrid(); AUTOPLAY.busy = false; }, gDelay(300, 70));
}

function botWordhive(st) {
  const gs = GS.challengeState;
  if (!gs || !gs.validWords) return;
  const found = gs.found || [];
  if (found.length >= (gs.target || gs.validWords.length)) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) submitWordhive(); AUTOPLAY.busy = false; }, gDelay(300, 70));
    return;
  }
  const nextWord = gs.validWords.find(w => !found.includes(w));
  if (!nextWord) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) submitWordhive(); AUTOPLAY.busy = false; }, gDelay(300, 70));
    return;
  }
  if (gs.input && gs.input.length > 0) return;
  AUTOPLAY.busy = true;
  let delay = gDelay(300, 70);
  for (const ch of nextWord) {
    delay += gDelay(80, 20);
    ((c, d) => { setTimeout(() => { if (AUTOPLAY.active) wordhiveTap(c); }, d); })(ch, delay);
  }
  delay += gDelay(150, 35);
  setTimeout(() => { if (AUTOPLAY.active) wordhiveEnter(); AUTOPLAY.busy = false; }, delay);
}

function botDeduction(st) {
  const p = st.puzzle;
  if (st.phase === 'question') {
    const qBtns = document.querySelectorAll('.deduction-q-btn:not(:disabled)');
    if (qBtns.length > 0) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) qBtns[0].click(); AUTOPLAY.busy = false; }, gDelay(500, 120));
    }
    return;
  }
  if (st.phase === 'responses') {
    const proceedBtn = document.querySelector('[onclick="goToDeductionEliminate()"]');
    if (proceedBtn) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) proceedBtn.click(); AUTOPLAY.busy = false; }, gDelay(600, 150));
    }
    return;
  }
  if (st.phase === 'eliminate') {
    for (let i = 0; i < p.characters.length; i++) {
      if (i !== p.saboteurIdx && !p.characters[i].eliminated) {
        AUTOPLAY.busy = true;
        setTimeout(() => { if (AUTOPLAY.active) selectDeductionEliminate(i); AUTOPLAY.busy = false; }, gDelay(500, 120));
        return;
      }
    }
  }
}

// --- MEMORY — perfect pair matching for 100/100 ---
function botMemory(st) {
  if (st.locked) return;
  const grid = st.puzzle.grid;
  const symbolMap = {};
  for (let r = 0; r < st.puzzle.rows; r++)
    for (let c = 0; c < st.puzzle.cols; c++)
      if (!grid[r][c].matched) {
        const sym = grid[r][c].symbol;
        if (!symbolMap[sym]) symbolMap[sym] = [];
        symbolMap[sym].push({r, c});
      }
  for (const sym in symbolMap) {
    if (symbolMap[sym].length >= 2) {
      const [a, b] = symbolMap[sym];
      AUTOPLAY.busy = true;
      setTimeout(() => {
        if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
        flipMemoryCard(a.r, a.c);
        setTimeout(() => { if (AUTOPLAY.active) flipMemoryCard(b.r, b.c); AUTOPLAY.busy = false; }, gDelay(250, 60));
      }, gDelay(200, 50));
      return;
    }
  }
}

function botMaze(st) {
  if (st.finished) return;
  const path = st.puzzle.optimalPath;
  if (!path || path.length === 0) { botMazeBFS(st); return; }
  const pr = st.playerR, pc = st.playerC;
  let pathIdx = -1;
  for (let i = 0; i < path.length; i++) {
    if (path[i].r === pr && path[i].c === pc) { pathIdx = i; break; }
  }
  if (pathIdx >= 0 && pathIdx < path.length - 1) {
    const next = path[pathIdx + 1];
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) moveMazePlayer(next.r - pr, next.c - pc); AUTOPLAY.busy = false; }, gDelay(80, 20));
  } else { botMazeBFS(st); }
}

function botMazeBFS(st) {
  const p = st.puzzle, rows = p.rows, cols = p.cols;
  const visited = Array.from({length: rows}, () => Array(cols).fill(false));
  const queue = [{r: st.playerR, c: st.playerC, path: []}];
  visited[st.playerR][st.playerC] = true;
  const dirs = [{dr:-1,dc:0,wall:'top'},{dr:1,dc:0,wall:'bottom'},{dr:0,dc:-1,wall:'left'},{dr:0,dc:1,wall:'right'}];
  while (queue.length > 0) {
    const {r,c,path} = queue.shift();
    if (r === rows - 1 && c === cols - 1 && path.length > 0) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) moveMazePlayer(path[0].dr, path[0].dc); AUTOPLAY.busy = false; }, gDelay(80, 20));
      return;
    }
    for (const d of dirs) {
      const nr = r + d.dr, nc = c + d.dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc] || p.walls[r][c][d.wall]) continue;
      visited[nr][nc] = true;
      queue.push({r: nr, c: nc, path: [...path, {dr: d.dr, dc: d.dc}]});
    }
  }
}

function botMosaic(st) {
  const checkBtn = document.querySelector('[onclick="checkMosaicSolution()"]');
  const tokenBtns = document.querySelectorAll('.mosaic-token:not(.placed)');
  if (tokenBtns.length === 0 && checkBtn) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) checkMosaicSolution(); AUTOPLAY.busy = false; }, gDelay(350, 80));
    return;
  }
  if (tokenBtns.length > 0) {
    const emptyCells = document.querySelectorAll('.mosaic-cell:not(.filled)');
    if (emptyCells.length > 0) {
      AUTOPLAY.busy = true;
      setTimeout(() => {
        if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
        tokenBtns[0].click();
        setTimeout(() => { if (AUTOPLAY.active) emptyCells[0].click(); AUTOPLAY.busy = false; }, gDelay(200, 50));
      }, gDelay(250, 60));
    }
  }
}

// --- NUMCRUNCH — solve first guess ---
function botNumcrunch(st) {
  if (st.gameOver || st.won || st.revealInProgress) return;
  if (st.currentGuess.length > 0) return;
  AUTOPLAY.busy = true;
  const eq = st.puzzle.equation;
  let delay = gDelay(500, 120);
  for (const ch of eq) {
    delay += gDelay(100, 25);
    const key = ch === '\u00d7' ? '*' : ch === '\u00f7' ? '/' : ch;
    ((k, d) => { setTimeout(() => { if (AUTOPLAY.active) numcrunchKeyPress(k); }, d); })(key, delay);
  }
  delay += gDelay(200, 50);
  setTimeout(() => { if (AUTOPLAY.active) numcrunchKeyPress('ENTER'); AUTOPLAY.busy = false; }, delay);
}

// --- COLORCODE — solve first guess for 100/100 ---
function botColorcode(st) {
  if (st.gameOver) return;
  if (!st.currentGuess || !st.currentGuess.some(c => c === null || c === undefined)) return;
  const code = st.puzzle.code, colors = st.puzzle.colors, row = st.currentRow;
  AUTOPLAY.busy = true;
  let delay = gDelay(350, 80);
  for (let slot = 0; slot < code.length; slot++) {
    delay += gDelay(150, 35);
    const ci = colors.indexOf(code[slot]);
    ((s, c, d) => {
      setTimeout(() => {
        if (!AUTOPLAY.active) return;
        selectColorSlot(row, s);
        setTimeout(() => { if (AUTOPLAY.active) pickColor(c); }, gDelay(80, 20));
      }, d);
    })(slot, ci, delay);
  }
  delay += gDelay(300, 70);
  setTimeout(() => { if (AUTOPLAY.active) submitColorCode(); AUTOPLAY.busy = false; }, delay);
}

function botQuickmath(st) {
  if (st.gameOver || !st.currentProblem) return;
  const answer = st.currentProblem.answer;
  if (answer === undefined || answer === null) return;
  const ansStr = String(answer);
  AUTOPLAY.busy = true;
  let delay = gDelay(300 + Math.min(Math.abs(answer), 50) * 3, 60);
  const input = document.getElementById('qm-input');
  if (input) input.value = '';
  st.userAnswer = '';
  for (const ch of ansStr) {
    delay += gDelay(70, 18);
    ((k, d) => { setTimeout(() => { if (AUTOPLAY.active) qmNumPress(k); }, d); })(ch, delay);
  }
  delay += gDelay(100, 25);
  setTimeout(() => { if (AUTOPLAY.active) qmSubmitAnswer(); AUTOPLAY.busy = false; }, delay);
}

function botPattern(st) {
  if (st.gameOver) return;
  const round = st.puzzle.rounds[st.currentRound];
  if (!round) return;
  const idx = round.choices.indexOf(round.answer);
  if (idx >= 0) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) selectPatternAnswer(idx); AUTOPLAY.busy = false; }, gDelay(500, 120));
  }
}

function botOddoneout(st) {
  if (st.gameOver) return;
  const round = st.puzzle.rounds[st.currentRound];
  if (!round) return;
  const idx = round.items.indexOf(round.oddItem);
  if (idx >= 0) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) selectOddItem(idx); AUTOPLAY.busy = false; }, gDelay(450, 100));
  }
}

// --- ESTIMATION — exact answer for 100/100 ---
function botEstimation(st) {
  if (st.gameOver) return;
  const round = st.puzzle.rounds ? st.puzzle.rounds[st.currentRound] : null;
  if (!round) return;
  const input = document.getElementById('est-input');
  if (!input) return;
  AUTOPLAY.busy = true;
  input.value = round.answer;
  input.dispatchEvent(new Event('input', {bubbles: true}));
  setTimeout(() => { if (AUTOPLAY.active) submitEstimation(); AUTOPLAY.busy = false; }, gDelay(400, 100));
}

function botHanoi(st) {
  if (st.gameOver) return;
  if (!st._botMoves) {
    st._botMoves = []; st._botMoveIdx = 0;
    solveHanoi(st.puzzle.discs, 0, 2, 1, st._botMoves);
  }
  if (st._botMoveIdx >= st._botMoves.length) return;
  const move = st._botMoves[st._botMoveIdx];
  AUTOPLAY.busy = true;
  setTimeout(() => {
    if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
    hanoiTapPeg(move.from);
    setTimeout(() => { if (AUTOPLAY.active) hanoiTapPeg(move.to); st._botMoveIdx++; AUTOPLAY.busy = false; }, gDelay(150, 35));
  }, gDelay(180, 40));
}

function solveHanoi(n, from, to, aux, moves) {
  if (n === 0) return;
  solveHanoi(n - 1, from, aux, to, moves);
  moves.push({from, to});
  solveHanoi(n - 1, aux, to, from, moves);
}

function botSimon(st) {
  if (st.gameOver || st.playing || !st.inputEnabled) return;
  const pos = st.playerInput.length;
  const expected = st.sequence[pos];
  if (expected === undefined) return;
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) simonPlayerTap(expected); AUTOPLAY.busy = false; }, gDelay(200 + pos * 25, 40));
}

function botChainword(st) {
  if (st.gameOver) return;
  const chain = st.chain;
  const lastLetter = chain[chain.length - 1].slice(-1).toLowerCase();
  const minLen = st.puzzle.minLen || 3;
  const used = new Set(chain.map(w => w.toLowerCase()));
  let word = null;
  if (typeof WORDRO_BANK_SET !== 'undefined') {
    for (const w of WORDRO_BANK_SET) {
      if (w.length >= minLen && w[0] === lastLetter && !used.has(w)) { word = w; break; }
    }
  }
  if (!word && typeof TYPING_WORDS !== 'undefined') {
    for (const ws of Object.values(TYPING_WORDS)) {
      for (const w of ws) {
        if (w.length >= minLen && w[0].toLowerCase() === lastLetter && !used.has(w.toLowerCase())) { word = w; break; }
      }
      if (word) break;
    }
  }
  if (!word) {
    const cw = {a:'apple',b:'banana',c:'cherry',d:'dance',e:'eagle',f:'flower',g:'grape',h:'house',i:'island',j:'jungle',k:'knight',l:'lemon',m:'mango',n:'night',o:'orange',p:'peace',q:'queen',r:'river',s:'stone',t:'tiger',u:'uncle',v:'violet',w:'water',x:'xenon',y:'youth',z:'zebra'};
    word = cw[lastLetter] || lastLetter + 'ight';
  }
  const input = document.getElementById('chain-input');
  if (!input) return;
  AUTOPLAY.busy = true;
  input.value = word;
  input.dispatchEvent(new Event('input', {bubbles: true}));
  setTimeout(() => { if (AUTOPLAY.active) submitChainword(); AUTOPLAY.busy = false; }, gDelay(250, 60));
}

// --- TYPING — fast for max WPM ---
function botTyping(st) {
  if (st.done || st.currentWordIdx >= st.words.length) return;
  const word = st.words[st.currentWordIdx];
  const input = document.getElementById('typing-input');
  if (!input) return;
  if (!st.startTime) input.dispatchEvent(new Event('input', {bubbles: true}));
  AUTOPLAY.busy = true;
  input.value = '';
  let delay = 0;
  for (let i = 0; i < word.length; i++) {
    delay += gDelay(50, 15);
    ((ch, d) => {
      setTimeout(() => {
        if (!AUTOPLAY.active) return;
        input.value += ch;
        st.typed = input.value;
        input.dispatchEvent(new Event('input', {bubbles: true}));
      }, d);
    })(word[i], delay);
  }
  delay += gDelay(50, 12);
  setTimeout(() => { if (AUTOPLAY.active) submitTypingWord(st); AUTOPLAY.busy = false; }, delay);
}

// --- REACTION — fast for max score ---
function botReaction(st) {
  if (st.done) return;
  if (st.phase === 'waiting' || st.phase === 'result') {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) handleReactionClick(); AUTOPLAY.busy = false; }, gDelay(350, 80));
    return;
  }
  if (st.phase === 'green') {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) handleReactionClick(); AUTOPLAY.busy = false; }, gDelay(180, 30));
    return;
  }
}

function botNummemory(st) {
  if (st.done || st.phase === 'show' || st.phase === 'feedback') return;
  if (st.phase === 'input') {
    const input = document.getElementById('nummem-input');
    if (!input || input.value.length > 0) return;
    AUTOPLAY.busy = true;
    const num = String(st.currentNumber);
    let delay = gDelay(250, 60);
    for (let i = 0; i < num.length; i++) {
      delay += gDelay(100, 25);
      ((digit, d) => {
        setTimeout(() => {
          if (!AUTOPLAY.active) return;
          input.value += digit;
          input.dispatchEvent(new Event('input', {bubbles: true}));
        }, d);
      })(num[i], delay);
    }
    delay += gDelay(200, 50);
    setTimeout(() => { if (AUTOPLAY.active) submitNumMemory(); AUTOPLAY.busy = false; }, delay);
  }
}

// --- STROOP — fast, no interference ---
function botStroop(st) {
  if (st.done || !st.currentColor) return;
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) pickStroop(st.currentColor.name); AUTOPLAY.busy = false; }, gDelay(250, 60));
}

function botSliding(st) {
  if (st.done) return;
  if (!st._botHistory) st._botHistory = [];
  const neighbors = getSlidingNeighbors(st.emptyIdx, st.size);
  let bestIdx = -1, bestScore = Infinity;
  for (const idx of neighbors) {
    if (st._botHistory.length > 0 && idx === st._botHistory[st._botHistory.length - 1]) continue;
    const test = [...st.tiles]; test[st.emptyIdx] = test[idx]; test[idx] = 0;
    const score = manhattanDist(test, st.size);
    if (score < bestScore) { bestScore = score; bestIdx = idx; }
  }
  if (bestIdx === -1) bestIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
  st._botHistory.push(st.emptyIdx);
  if (st._botHistory.length > 8) st._botHistory.shift();
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) clickSlidingTile(bestIdx); AUTOPLAY.busy = false; }, gDelay(80, 20));
}

function manhattanDist(tiles, size) {
  let d = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === 0) continue;
    const t = tiles[i] - 1;
    d += Math.abs(Math.floor(i / size) - Math.floor(t / size)) + Math.abs(i % size - t % size);
  }
  return d;
}

function botSpotdiff(st) {
  if (st.done) return;
  for (const idx of st.diffIndices) {
    if (!st.found.has(idx)) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) clickSpotDiff(idx); AUTOPLAY.busy = false; }, gDelay(400 + st.found.size * 200, 80));
      return;
    }
  }
}

function botScramble(st) {
  if (st.done || st.gameOver || !st.currentWord) return;
  const input = document.getElementById('scr-input');
  if (!input || input.value.length > 0) return;
  AUTOPLAY.busy = true;
  setTimeout(() => {
    if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
    input.value = st.currentWord;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    setTimeout(() => { if (AUTOPLAY.active) submitScrambleWord(); AUTOPLAY.busy = false; }, gDelay(200, 50));
  }, gDelay(500, 120));
}

function botMath24(st) {
  if (st.done || st.gameOver || !st.puzzle || !st.puzzle.puzzles) return;
  const nums = st.puzzle.puzzles[st.round];
  if (!nums) return;
  if (!st._botSolution) st._botSolution = findSolution24(nums);
  if (!st._botSolution) return;
  const input = document.getElementById('m24-input');
  if (!input || input.value.length > 0) return;
  AUTOPLAY.busy = true;
  setTimeout(() => {
    if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
    input.value = st._botSolution;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    st._botSolution = null;
    setTimeout(() => { if (AUTOPLAY.active) submitMath24(); AUTOPLAY.busy = false; }, gDelay(250, 60));
  }, gDelay(1500, 400));
}

function findSolution24(nums) {
  const ops = ['+','-','*','/'], perms = permutations(nums);
  for (const p of perms)
    for (const o1 of ops) for (const o2 of ops) for (const o3 of ops) {
      const exprs = [
        `((${p[0]}${o1}${p[1]})${o2}${p[2]})${o3}${p[3]}`,
        `(${p[0]}${o1}(${p[1]}${o2}${p[2]}))${o3}${p[3]}`,
        `(${p[0]}${o1}${p[1]})${o2}(${p[2]}${o3}${p[3]})`,
        `${p[0]}${o1}((${p[1]}${o2}${p[2]})${o3}${p[3]})`,
        `${p[0]}${o1}(${p[1]}${o2}(${p[2]}${o3}${p[3]}))`
      ];
      for (const expr of exprs) {
        try { if (Math.abs(Function('"use strict";return(' + expr + ')')() - 24) < 0.001) return expr; } catch(e) {}
      }
    }
  return null;
}

function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of permutations(rest)) res.push([arr[i], ...p]);
  }
  return res;
}

function botAim(st) {
  if (st.done) return;
  const target = document.querySelector('.aim-target');
  if (target) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) target.click(); AUTOPLAY.busy = false; }, gDelay(180, 40));
  }
}

function botVismemory(st) {
  if (st.done || st.phase === 'show') return;
  if (st.phase === 'input') {
    for (const idx of st.highlighted) {
      if (!st.found.has(idx)) {
        AUTOPLAY.busy = true;
        setTimeout(() => { if (AUTOPLAY.active) clickVisMemCell(idx); AUTOPLAY.busy = false; }, gDelay(200, 50));
        return;
      }
    }
  }
}

function botChimp(st) {
  if (st.done) return;
  if (st.phase === 'show') {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) clickChimpCell(1); AUTOPLAY.busy = false; }, gDelay(400, 100));
    return;
  }
  if (st.phase === 'input') {
    const next = st.nextExpected;
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) clickChimpCell(next); AUTOPLAY.busy = false; }, gDelay(150 + next * 20, 30));
  }
}

function botRotation(st) {
  if (st.done) return;
  const options = document.querySelectorAll('.rotation-option');
  for (const opt of options) {
    if (opt.getAttribute('onclick')?.includes('true')) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) opt.click(); AUTOPLAY.busy = false; }, gDelay(500, 120));
      return;
    }
  }
}

function botPathtracer(st) {
  if (st.done || st.phase === 'show') return;
  if (st.phase === 'input') {
    const nextIdx = st.playerPath.length;
    if (nextIdx < st.path.length) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) clickPathCell(st.path[nextIdx]); AUTOPLAY.busy = false; }, gDelay(200 + nextIdx * 30, 40));
    }
  }
}

function botAssociation(st) {
  if (st.done) return;
  const btns = document.querySelectorAll('.assoc-btn');
  for (const btn of btns) {
    const onclick = btn.getAttribute('onclick') || '';
    const m = onclick.match(/pickAssociation\('([^']*)','([^']*)'\)/);
    if (m && m[1] === m[2]) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) btn.click(); AUTOPLAY.busy = false; }, gDelay(400, 100));
      return;
    }
  }
}

function botSortrace(st) {
  if (st.done || st.gameOver || !st.correctOrder || !st.currentItems) return;
  for (let i = 0; i < st.currentItems.length; i++) {
    if (st.currentItems[i] !== st.correctOrder[i]) {
      const ci = st.currentItems.indexOf(st.correctOrder[i]);
      if (ci > i) {
        AUTOPLAY.busy = true;
        setTimeout(() => { if (AUTOPLAY.active) moveSortItem(ci, -1); AUTOPLAY.busy = false; }, gDelay(120, 30));
        return;
      }
    }
  }
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) submitSortRound(); AUTOPLAY.busy = false; }, gDelay(300, 70));
}

function botRhythm(st) {
  if (st.done || st.phase === 'listen') return;
  if (st.phase === 'tap') {
    if (st.playerTaps.length >= st.beatCount) return;
    if (st.playerTaps.length === 0) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active && st.phase === 'tap') tapRhythm(); AUTOPLAY.busy = false; }, gDelay(100, 25));
      return;
    }
    const tapIdx = st.playerTaps.length;
    if (tapIdx < st.pattern.length) {
      const expectedGap = st.pattern[tapIdx] - st.pattern[tapIdx - 1];
      const elapsed = performance.now() - st.startTime - st.playerTaps[st.playerTaps.length - 1];
      if (expectedGap - elapsed <= 20) {
        const jitter = (Math.random() - 0.5) * 30;
        AUTOPLAY.busy = true;
        setTimeout(() => { if (AUTOPLAY.active && st.phase === 'tap') tapRhythm(); AUTOPLAY.busy = false; }, Math.max(0, jitter));
      }
    }
  }
}
