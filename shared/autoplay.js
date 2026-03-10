// ==================== AUTOPLAY BOT (secret cheat: "srg2") ====================
// Session-only. No localStorage. Resets on reload.
// Designed to look human: gaussian timing, thinking pauses, imperfect play.

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
  if (e.key.length === 1) {
    AUTOPLAY._buf += e.key.toLowerCase();
    if (AUTOPLAY._buf.length > 20) AUTOPLAY._buf = AUTOPLAY._buf.slice(-20);
    if (AUTOPLAY._buf.endsWith('srg2') && !AUTOPLAY.unlocked) {
      AUTOPLAY.unlocked = true;
      showToast('\u{1F916} Autoplay unlocked! Press Space to toggle.');
      return;
    }
  }
  if (e.key === ' ' && AUTOPLAY.unlocked && !isText) {
    e.preventDefault();
    e.stopPropagation();
    if (AUTOPLAY.active) stopAutoplay(); else startAutoplay();
  }
}, true);

function startAutoplay() {
  AUTOPLAY.active = true;
  AUTOPLAY.busy = false;
  showBotBadge(true);
  if (AUTOPLAY.interval) clearInterval(AUTOPLAY.interval);
  AUTOPLAY.interval = setInterval(autoplayTick, 600);
  autoplayTick();
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
  badge.textContent = 'BOT ON';
  badge.style.display = on ? 'block' : 'none';
}

// ===================== HUMAN-LIKE TIMING =====================
// Gaussian-distributed delays (Box-Muller) — right-skewed, realistic
function gaussRand() {
  const u1 = Math.random(), u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
}

function gDelay(mean, sd) {
  return Math.max(mean * 0.25, mean + gaussRand() * sd);
}

// Per-challenge "reading/thinking" time before first action (ms)
const BOT_THINK = {
  paradox:2200, blocks:1600, economy:2200, escape:2800, wordsearch:1800,
  wordro:1200, numgrid:2000, wordhive:1400, pulse:800, deduction:2000,
  memory:1200, maze:1000, mosaic:1800, numcrunch:1500, colorcode:1500,
  quickmath:400, pattern:1200, oddoneout:1000, estimation:1800, hanoi:1400,
  simon:600, chainword:1200, typing:600, reaction:400, nummemory:400,
  stroop:400, sliding:1200, spotdiff:1000, scramble:1400, math24:2000,
  aim:400, vismemory:400, chimp:500, rotation:1400, pathtracer:400,
  association:800, sortrace:1000, rhythm:400
};

// Common 5-letter words for Wordro intermediate guesses
const BOT_OPENERS = [
  'CRANE','SLATE','TRACE','AUDIO','RAISE','STARE','ADIEU','ROAST','CRATE',
  'TEARS','SNARE','IRATE','STONE','HEART','LEARN','MONEY','WATER','HOUSE',
  'LIGHT','DREAM','PLANT','EARTH','WORLD','BRAIN','TRAIN','SUGAR','OCEAN',
  'CLOUD','NIGHT','DANCE','SMILE','BRAVE','QUIET','FRESH','FROST','GHOST',
  'PRIDE','STEAM','WHEAT','BLEND','CLIMB','SWIRL'
];

// ===================== MAIN TICK =====================
function autoplayTick() {
  if (!AUTOPLAY.active || AUTOPLAY.busy) return;

  // UI buttons: intro, summary, feedback, results
  const introBtn = document.querySelector('.intro-screen .btn-primary');
  if (introBtn) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) introBtn.click(); AUTOPLAY.busy = false; }, gDelay(900, 250));
    return;
  }
  const continueBtn = document.querySelector('.cs-panel .btn-primary');
  if (continueBtn && continueBtn.textContent.includes('Continue')) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) continueBtn.click(); AUTOPLAY.busy = false; }, gDelay(700, 200));
    return;
  }
  for (const fn of ['continueNumMemory','retryNumMemory','finishNumMemory']) {
    const btn = document.querySelector(`[onclick="${fn}()"]`);
    if (btn) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) btn.click(); AUTOPLAY.busy = false; }, gDelay(500, 150));
      return;
    }
  }
  const gcBtns = document.querySelectorAll('#game-container .btn');
  for (const btn of gcBtns) {
    const t = btn.textContent;
    if (t.includes('See Score') || t.includes('Next Level') || t.includes('Try Again')) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) btn.click(); AUTOPLAY.busy = false; }, gDelay(500, 150));
      return;
    }
  }
  const resultsScreen = document.getElementById('screen-results');
  if (resultsScreen && resultsScreen.classList.contains('active')) return;
  const gameScreen = document.getElementById('screen-game');
  if (!gameScreen || !gameScreen.classList.contains('active')) return;

  // Dispatch to challenge bot
  const ch = GS.selectedChallenges[GS.currentChallengeIdx];
  if (!ch) return;
  let st = GS.challengeState[ch];
  if (!st && (ch === 'numgrid' || ch === 'wordhive')) st = GS.challengeState;
  if (!st) return;

  // Initial thinking delay — simulates reading the challenge
  if (!st._botReady) {
    if (!st._botThinkStart) {
      st._botThinkStart = Date.now();
      st._botThinkDur = gDelay(BOT_THINK[ch] || 1500, (BOT_THINK[ch] || 1500) * 0.3);
    }
    if (Date.now() - st._botThinkStart < st._botThinkDur) return;
    st._botReady = true;
  }

  try { botDispatch(ch, st); } catch(e) { /* continue */ }
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

// --- PARADOX ---
function botParadox(st) {
  if (st.answered) return;
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) selectParadoxOption(st.puzzle.correct); AUTOPLAY.busy = false; }, gDelay(800, 250));
}

// --- BLOCKS ---
function botBlocks(st) {
  if (st.submitted) return;
  const correct = st.puzzle.correctOrder;
  const current = st.currentOrder;
  for (let i = 0; i < current.length; i++) {
    if (i < correct.length && current[i] !== correct[i]) {
      const ti = current.indexOf(correct[i]);
      if (ti >= 0 && ti !== i) {
        AUTOPLAY.busy = true;
        setTimeout(() => {
          if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
          tapBlock(i);
          setTimeout(() => { if (AUTOPLAY.active) tapBlock(ti); AUTOPLAY.busy = false; }, gDelay(350, 80));
        }, gDelay(400, 100));
        return;
      }
    }
  }
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) submitBlocks(); AUTOPLAY.busy = false; }, gDelay(500, 120));
}

// --- ECONOMY ---
function botEconomy(st) {
  if (st.submitted) return;
  const puzzle = st.puzzle;
  const vars = puzzle.activeVars;
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
    cur[v.key] = v.max;
    tryVals(vi + 1, cur);
  }
  tryVals(0, {});
  AUTOPLAY.busy = true;
  let delay = 0;
  Object.keys(bestVals).forEach(key => {
    delay += gDelay(350, 80);
    setTimeout(() => {
      if (!AUTOPLAY.active) return;
      const s = document.getElementById('slider-' + key);
      if (s) { s.value = bestVals[key]; updateEconomySlider(key, bestVals[key]); }
    }, delay);
  });
  delay += gDelay(600, 150);
  setTimeout(() => { if (AUTOPLAY.active) submitEconomy(); AUTOPLAY.busy = false; }, delay);
}

// --- ESCAPE ---
function botEscape(st) {
  if (st.screenIdx >= 5) return;
  const screen = st.puzzle.screens[st.screenIdx];
  if (!screen) return;
  const nextBtn = document.getElementById('btn-escape-next');
  if (nextBtn && nextBtn.style.display !== 'none') {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) advanceEscape(); AUTOPLAY.busy = false; }, gDelay(1200, 300));
    return;
  }
  const btns = document.querySelectorAll('.escape-choice');
  if (btns.length > 0 && btns[0].disabled) return;
  const optIdx = screen.choices.findIndex(c => c.optimal);
  if (optIdx >= 0) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) selectEscapeChoice(optIdx); AUTOPLAY.busy = false; }, gDelay(1800, 500));
  }
}

// --- WORDSEARCH ---
function botWordsearch(st) {
  const puzzle = st.puzzle;
  const next = puzzle.placements.find(p => !st.foundWords.includes(p.word));
  if (!next) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) submitWordsearch(); AUTOPLAY.busy = false; }, gDelay(500, 120));
    return;
  }
  if (st.selectedCells.length > 0) st.selectedCells.length = 0;
  AUTOPLAY.busy = true;
  const wordIdx = st.foundWords.length;
  let delay = gDelay(900 + wordIdx * 350, 200); // scanning time grows for later words
  next.cells.forEach(cell => {
    delay += gDelay(130, 30);
    ((r, c, d) => { setTimeout(() => { if (AUTOPLAY.active) tapWsCell(r, c); }, d); })(cell.r, cell.c, delay);
  });
  delay += gDelay(250, 60);
  setTimeout(() => { AUTOPLAY.busy = false; }, delay);
}

// --- WORDRO (Wordle) — multi-guess for realism ---
function botWordro(st) {
  if (st.gameOver || st.won) return;
  if (st.revealInProgress) return;
  if (st.currentGuess.length > 0) return;

  // Decide which row to solve on (once per game)
  if (st._botSolveRow === undefined) {
    const r = Math.random();
    st._botSolveRow = r < 0.12 ? 1 : r < 0.55 ? 2 : r < 0.88 ? 3 : 4;
    st._botSolveRow = Math.min(st._botSolveRow, st.puzzle.maxGuesses - 1);
  }

  let word;
  if (st.currentRow >= st._botSolveRow) {
    word = st.puzzle.word;
  } else {
    word = botWordroIntermediate(st);
    if (!word) word = st.puzzle.word; // fallback
  }

  AUTOPLAY.busy = true;
  let delay = gDelay(600, 150);
  for (const ch of word) {
    delay += gDelay(160, 40);
    ((c, d) => { setTimeout(() => { if (AUTOPLAY.active) wordroKeyPress(c); }, d); })(ch.toUpperCase(), delay);
  }
  delay += gDelay(350, 80);
  setTimeout(() => { if (AUTOPLAY.active) wordroKeyPress('ENTER'); AUTOPLAY.busy = false; }, delay);
}

function botWordroIntermediate(st) {
  const answer = st.puzzle.word.toUpperCase();
  const used = new Set(st.guesses.map(g => g.word));

  // First guess: pick a known opener
  if (st.currentRow === 0) {
    const shuffled = BOT_OPENERS.slice().sort(() => Math.random() - 0.5);
    for (const w of shuffled) {
      if (w === answer) continue;
      if (used.has(w)) continue;
      if (typeof WORDRO_BANK_SET !== 'undefined' && !WORDRO_BANK_SET.has(w.toLowerCase())) continue;
      return w;
    }
  }

  // Later guesses: pick word from bank with partial letter overlap
  if (typeof WORDRO_BANK_SET !== 'undefined') {
    const ansLetters = new Set(answer.toLowerCase().split(''));
    const skip = Math.floor(Math.random() * 800);
    let count = 0, best = null, bestScore = -1;
    for (const w of WORDRO_BANK_SET) {
      if (w.length !== 5) continue;
      if (w.toUpperCase() === answer || used.has(w.toUpperCase())) continue;
      if (++count < skip) continue;
      const shared = w.split('').filter(c => ansLetters.has(c)).length;
      if (shared >= 1 && shared <= 4 && shared > bestScore) { bestScore = shared; best = w.toUpperCase(); }
      if (count > skip + 60) break;
    }
    if (best) return best;
  }
  return null;
}

// --- NUMGRID ---
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
          setTimeout(() => { if (AUTOPLAY.active) numgridInput(solution[r][c]); AUTOPLAY.busy = false; }, gDelay(180, 40));
        }, gDelay(250, 60));
        return;
      }
    }
  }
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) submitNumgrid(); AUTOPLAY.busy = false; }, gDelay(500, 120));
}

// --- WORDHIVE ---
function botWordhive(st) {
  const gs = GS.challengeState;
  if (!gs || !gs.validWords) return;
  const found = gs.found || [];
  if (found.length >= (gs.target || gs.validWords.length)) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) submitWordhive(); AUTOPLAY.busy = false; }, gDelay(500, 120));
    return;
  }
  const nextWord = gs.validWords.find(w => !found.includes(w));
  if (!nextWord) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) submitWordhive(); AUTOPLAY.busy = false; }, gDelay(500, 120));
    return;
  }
  if (gs.input && gs.input.length > 0) return;
  AUTOPLAY.busy = true;
  let delay = gDelay(500, 120);
  for (const ch of nextWord) {
    delay += gDelay(130, 35);
    ((c, d) => { setTimeout(() => { if (AUTOPLAY.active) wordhiveTap(c); }, d); })(ch, delay);
  }
  delay += gDelay(220, 50);
  setTimeout(() => { if (AUTOPLAY.active) wordhiveEnter(); AUTOPLAY.busy = false; }, delay);
}

// --- PULSE — only click near center of zone for safety ---
function botPulse(st) {
  if (st.gameOver || st.waiting) return;
  const pos = st.position, start = st.zoneStart, end = start + st.zoneSize;
  const margin = st.zoneSize * 0.18;
  if (pos >= start + margin && pos <= end - margin) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active && !st.gameOver) hitPulse(); AUTOPLAY.busy = false; }, gDelay(45, 15));
  }
}

// --- DEDUCTION ---
function botDeduction(st) {
  const p = st.puzzle;
  if (st.phase === 'question') {
    const qBtns = document.querySelectorAll('.deduction-q-btn:not(:disabled)');
    if (qBtns.length > 0) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) qBtns[0].click(); AUTOPLAY.busy = false; }, gDelay(800, 200));
    }
    return;
  }
  if (st.phase === 'responses') {
    const proceedBtn = document.querySelector('[onclick="goToDeductionEliminate()"]');
    if (proceedBtn) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) proceedBtn.click(); AUTOPLAY.busy = false; }, gDelay(1200, 300));
    }
    return;
  }
  if (st.phase === 'eliminate') {
    for (let i = 0; i < p.characters.length; i++) {
      if (i !== p.saboteurIdx && !p.characters[i].eliminated) {
        AUTOPLAY.busy = true;
        setTimeout(() => { if (AUTOPLAY.active) selectDeductionEliminate(i); AUTOPLAY.busy = false; }, gDelay(900, 250));
        return;
      }
    }
  }
}

// --- MEMORY — exploration phase, simulates discovering card positions ---
function botMemory(st) {
  if (st.locked) return;
  const grid = st.puzzle.grid, rows = st.puzzle.rows, cols = st.puzzle.cols;

  // Init bot's "discovered" memory
  if (!st._botSeen) { st._botSeen = {}; st._botFlips = 0; }

  // Build list of unmatched cards
  const unmatched = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!grid[r][c].matched) unmatched.push({r, c, sym: grid[r][c].symbol});

  if (unmatched.length < 2) return;

  // Check if we know any pair from previous exploration
  for (const sym in st._botSeen) {
    const locs = st._botSeen[sym].filter(p => !grid[p.r][p.c].matched);
    if (locs.length >= 2) {
      // 8% chance to "forget" for realism (skip this pair once) — but not early game
      if (st._botFlips > 6 && Math.random() < 0.08) continue;
      const [a, b] = locs;
      AUTOPLAY.busy = true;
      setTimeout(() => {
        if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
        flipMemoryCard(a.r, a.c);
        setTimeout(() => { if (AUTOPLAY.active) flipMemoryCard(b.r, b.c); AUTOPLAY.busy = false; }, gDelay(450, 100));
      }, gDelay(400, 90));
      return;
    }
  }

  // Exploration: flip two random unmatched cards to discover them
  const shuffled = unmatched.sort(() => Math.random() - 0.5);
  // Prefer cards we haven't seen yet
  const unseen = shuffled.filter(c => {
    const seen = st._botSeen[c.sym];
    return !seen || !seen.some(p => p.r === c.r && p.c === c.c);
  });
  const pool = unseen.length >= 2 ? unseen : shuffled;
  const c1 = pool[0], c2 = pool[1] || pool[0];
  if (c1.r === c2.r && c1.c === c2.c) return; // same card, skip

  AUTOPLAY.busy = true;
  setTimeout(() => {
    if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
    flipMemoryCard(c1.r, c1.c);
    // Record what we "see"
    const s1 = grid[c1.r][c1.c].symbol;
    if (!st._botSeen[s1]) st._botSeen[s1] = [];
    if (!st._botSeen[s1].some(p => p.r === c1.r && p.c === c1.c)) st._botSeen[s1].push({r: c1.r, c: c1.c});
    st._botFlips++;

    setTimeout(() => {
      if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
      flipMemoryCard(c2.r, c2.c);
      const s2 = grid[c2.r][c2.c].symbol;
      if (!st._botSeen[s2]) st._botSeen[s2] = [];
      if (!st._botSeen[s2].some(p => p.r === c2.r && p.c === c2.c)) st._botSeen[s2].push({r: c2.r, c: c2.c});
      st._botFlips++;
      AUTOPLAY.busy = false;
    }, gDelay(500, 120));
  }, gDelay(450, 100));
}

// --- MAZE ---
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
    setTimeout(() => { if (AUTOPLAY.active) moveMazePlayer(next.r - pr, next.c - pc); AUTOPLAY.busy = false; }, gDelay(140, 35));
  } else {
    botMazeBFS(st);
  }
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
      setTimeout(() => { if (AUTOPLAY.active) moveMazePlayer(path[0].dr, path[0].dc); AUTOPLAY.busy = false; }, gDelay(140, 35));
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

// --- MOSAIC ---
function botMosaic(st) {
  const checkBtn = document.querySelector('[onclick="checkMosaicSolution()"]');
  const tokenBtns = document.querySelectorAll('.mosaic-token:not(.placed)');
  if (tokenBtns.length === 0 && checkBtn) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) checkMosaicSolution(); AUTOPLAY.busy = false; }, gDelay(600, 150));
    return;
  }
  if (tokenBtns.length > 0) {
    const emptyCells = document.querySelectorAll('.mosaic-cell:not(.filled)');
    if (emptyCells.length > 0) {
      AUTOPLAY.busy = true;
      setTimeout(() => {
        if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
        tokenBtns[0].click();
        setTimeout(() => { if (AUTOPLAY.active) emptyCells[0].click(); AUTOPLAY.busy = false; }, gDelay(350, 80));
      }, gDelay(400, 100));
    }
  }
}

// --- NUMCRUNCH — thinking delay then type ---
function botNumcrunch(st) {
  if (st.gameOver || st.won) return;
  if (st.revealInProgress) return;
  if (st.currentGuess.length > 0) return;
  AUTOPLAY.busy = true;
  const eq = st.puzzle.equation;
  let delay = gDelay(2200, 600); // significant thinking time
  for (const ch of eq) {
    delay += gDelay(170, 45);
    const key = ch === '\u00d7' ? '*' : ch === '\u00f7' ? '/' : ch;
    ((k, d) => { setTimeout(() => { if (AUTOPLAY.active) numcrunchKeyPress(k); }, d); })(key, delay);
  }
  delay += gDelay(350, 80);
  setTimeout(() => { if (AUTOPLAY.active) numcrunchKeyPress('ENTER'); AUTOPLAY.busy = false; }, delay);
}

// --- COLORCODE (Mastermind) — multi-guess for realism ---
function botColorcode(st) {
  if (st.gameOver) return;
  if (!st.currentGuess || !st.currentGuess.some(c => c === null || c === undefined)) return;

  // Decide when to guess correctly
  if (st._botSolveRow === undefined) {
    st._botSolveRow = 2 + Math.floor(Math.random() * 2); // row 2-3
    st._botSolveRow = Math.min(st._botSolveRow, st.puzzle.maxGuesses - 1);
  }

  const code = st.puzzle.code, colors = st.puzzle.colors, row = st.currentRow;
  let target;
  if (row >= st._botSolveRow) {
    target = code;
  } else {
    // Random plausible guess (but use some correct colors for partial matches)
    target = code.map((c, i) => {
      if (Math.random() < 0.3) return c; // 30% chance each slot is correct — creates partial feedback
      return colors[Math.floor(Math.random() * colors.length)];
    });
  }

  AUTOPLAY.busy = true;
  let delay = gDelay(600, 150);
  for (let slot = 0; slot < target.length; slot++) {
    delay += gDelay(250, 60);
    const ci = colors.indexOf(target[slot]);
    ((s, c, d) => {
      setTimeout(() => {
        if (!AUTOPLAY.active) return;
        selectColorSlot(row, s);
        setTimeout(() => { if (AUTOPLAY.active) pickColor(c); }, gDelay(140, 35));
      }, d);
    })(slot, ci, delay);
  }
  delay += gDelay(550, 120);
  setTimeout(() => { if (AUTOPLAY.active) submitColorCode(); AUTOPLAY.busy = false; }, delay);
}

// --- QUICKMATH — thinking time proportional to difficulty ---
function botQuickmath(st) {
  if (st.gameOver || !st.currentProblem) return;
  const answer = st.currentProblem.answer;
  if (answer === undefined || answer === null) return;
  const ansStr = String(answer);
  AUTOPLAY.busy = true;
  // Thinking time scales with answer magnitude
  let delay = gDelay(500 + Math.min(Math.abs(answer), 100) * 4, 120);
  const input = document.getElementById('qm-input');
  if (input) input.value = '';
  st.userAnswer = '';
  for (const ch of ansStr) {
    delay += gDelay(110, 30);
    ((k, d) => { setTimeout(() => { if (AUTOPLAY.active) qmNumPress(k); }, d); })(ch, delay);
  }
  delay += gDelay(180, 40);
  setTimeout(() => { if (AUTOPLAY.active) qmSubmitAnswer(); AUTOPLAY.busy = false; }, delay);
}

// --- PATTERN ---
function botPattern(st) {
  if (st.gameOver) return;
  const round = st.puzzle.rounds[st.currentRound];
  if (!round) return;
  const idx = round.choices.indexOf(round.answer);
  if (idx >= 0) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) selectPatternAnswer(idx); AUTOPLAY.busy = false; }, gDelay(900, 250));
  }
}

// --- ODDONEOUT ---
function botOddoneout(st) {
  if (st.gameOver) return;
  const round = st.puzzle.rounds[st.currentRound];
  if (!round) return;
  const idx = round.items.indexOf(round.oddItem);
  if (idx >= 0) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) selectOddItem(idx); AUTOPLAY.busy = false; }, gDelay(800, 200));
  }
}

// --- ESTIMATION — fuzzy answer (±3-10% error) for realism ---
function botEstimation(st) {
  if (st.gameOver) return;
  const round = st.puzzle.rounds ? st.puzzle.rounds[st.currentRound] : null;
  if (!round) return;
  const answer = round.answer;
  const input = document.getElementById('est-input');
  if (!input) return;
  // Human-like error: small random offset
  const errorPct = (Math.random() * 0.08 + 0.02) * (Math.random() < 0.5 ? 1 : -1);
  const guess = Math.round(answer * (1 + errorPct));
  AUTOPLAY.busy = true;
  input.value = guess;
  input.dispatchEvent(new Event('input', {bubbles: true}));
  setTimeout(() => { if (AUTOPLAY.active) submitEstimation(); AUTOPLAY.busy = false; }, gDelay(600, 150));
}

// --- HANOI ---
function botHanoi(st) {
  if (st.gameOver) return;
  if (!st._botMoves) {
    st._botMoves = [];
    st._botMoveIdx = 0;
    solveHanoi(st.puzzle.discs, 0, 2, 1, st._botMoves);
  }
  if (st._botMoveIdx >= st._botMoves.length) return;
  const move = st._botMoves[st._botMoveIdx];
  AUTOPLAY.busy = true;
  setTimeout(() => {
    if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
    hanoiTapPeg(move.from);
    setTimeout(() => { if (AUTOPLAY.active) hanoiTapPeg(move.to); st._botMoveIdx++; AUTOPLAY.busy = false; }, gDelay(250, 60));
  }, gDelay(300, 70));
}

function solveHanoi(n, from, to, aux, moves) {
  if (n === 0) return;
  solveHanoi(n - 1, from, aux, to, moves);
  moves.push({from, to});
  solveHanoi(n - 1, aux, to, from, moves);
}

// --- SIMON — delay increases with sequence length ---
function botSimon(st) {
  if (st.gameOver || st.playing || !st.inputEnabled) return;
  const pos = st.playerInput.length;
  const expected = st.sequence[pos];
  if (expected === undefined) return;
  const delay = gDelay(280 + pos * 45, 60 + pos * 12);
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) simonPlayerTap(expected); AUTOPLAY.busy = false; }, delay);
}

// --- CHAINWORD ---
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
  setTimeout(() => { if (AUTOPLAY.active) submitChainword(); AUTOPLAY.busy = false; }, gDelay(400, 100));
}

// --- TYPING — realistic WPM (60-130ms/char with micro-pauses) ---
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
    const isPause = i > 0 && Math.random() < 0.07;
    delay += isPause ? gDelay(260, 60) : gDelay(90, 25);
    ((ch, d) => {
      setTimeout(() => {
        if (!AUTOPLAY.active) return;
        input.value += ch;
        st.typed = input.value;
        input.dispatchEvent(new Event('input', {bubbles: true}));
      }, d);
    })(word[i], delay);
  }
  delay += gDelay(100, 25);
  setTimeout(() => { if (AUTOPLAY.active) submitTypingWord(st); AUTOPLAY.busy = false; }, delay);
}

// --- REACTION — gaussian variability, realistic timing ---
function botReaction(st) {
  if (st.done) return;
  if (st.phase === 'waiting' || st.phase === 'result') {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) handleReactionClick(); AUTOPLAY.busy = false; }, gDelay(600, 180));
    return;
  }
  if (st.phase === 'green') {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) handleReactionClick(); AUTOPLAY.busy = false; }, gDelay(250, 50));
    return;
  }
  // Red phase: do nothing
}

// --- NUMMEMORY — type digit by digit ---
function botNummemory(st) {
  if (st.done) return;
  if (st.phase === 'show' || st.phase === 'feedback') return;
  if (st.phase === 'input') {
    const input = document.getElementById('nummem-input');
    if (!input || input.value.length > 0) return;
    AUTOPLAY.busy = true;
    const num = String(st.currentNumber);
    let delay = gDelay(500, 120); // recall pause
    for (let i = 0; i < num.length; i++) {
      delay += gDelay(200, 50);
      ((digit, d) => {
        setTimeout(() => {
          if (!AUTOPLAY.active) return;
          input.value += digit;
          input.dispatchEvent(new Event('input', {bubbles: true}));
        }, d);
      })(num[i], delay);
    }
    delay += gDelay(350, 80);
    setTimeout(() => { if (AUTOPLAY.active) submitNumMemory(); AUTOPLAY.busy = false; }, delay);
  }
}

// --- STROOP — cognitive interference delay ---
function botStroop(st) {
  if (st.done || !st.currentColor) return;
  // Stroop effect: incongruent = slower
  const wordEl = document.querySelector('.stroop-word');
  const congruent = wordEl && wordEl.textContent.trim().toUpperCase() === st.currentColor.name.toUpperCase();
  const delay = congruent ? gDelay(380, 80) : gDelay(750, 180);
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) pickStroop(st.currentColor.name); AUTOPLAY.busy = false; }, delay);
}

// --- SLIDING — Manhattan distance heuristic + anti-cycling ---
function botSliding(st) {
  if (st.done) return;
  if (!st._botHistory) st._botHistory = [];
  const neighbors = getSlidingNeighbors(st.emptyIdx, st.size);
  let bestIdx = -1, bestScore = Infinity;
  for (const idx of neighbors) {
    if (st._botHistory.length > 0 && idx === st._botHistory[st._botHistory.length - 1]) continue;
    const test = [...st.tiles];
    test[st.emptyIdx] = test[idx];
    test[idx] = 0;
    const score = manhattanDist(test, st.size);
    if (score < bestScore) { bestScore = score; bestIdx = idx; }
  }
  if (bestIdx === -1) bestIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
  st._botHistory.push(st.emptyIdx);
  if (st._botHistory.length > 8) st._botHistory.shift();
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) clickSlidingTile(bestIdx); AUTOPLAY.busy = false; }, gDelay(160, 40));
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

// --- SPOTDIFF — scanning time increases ---
function botSpotdiff(st) {
  if (st.done) return;
  for (const idx of st.diffIndices) {
    if (!st.found.has(idx)) {
      const scanDelay = gDelay(900 + st.found.size * 500, 200);
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) clickSpotDiff(idx); AUTOPLAY.busy = false; }, scanDelay);
      return;
    }
  }
}

// --- SCRAMBLE — thinking time ---
function botScramble(st) {
  if (st.done || st.gameOver || !st.currentWord) return;
  const input = document.getElementById('scr-input');
  if (!input || input.value.length > 0) return;
  AUTOPLAY.busy = true;
  const thinkDelay = gDelay(1100 + st.currentWord.length * 120, 300);
  setTimeout(() => {
    if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
    input.value = st.currentWord;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    setTimeout(() => { if (AUTOPLAY.active) submitScrambleWord(); AUTOPLAY.busy = false; }, gDelay(350, 80));
  }, thinkDelay);
}

// --- MATH24 — significant thinking time ---
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
    setTimeout(() => { if (AUTOPLAY.active) submitMath24(); AUTOPLAY.busy = false; }, gDelay(400, 100));
  }, gDelay(3500, 900));
}

function findSolution24(nums) {
  const ops = ['+','-','*','/'];
  const perms = permutations(nums);
  for (const p of perms) {
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

// --- AIM — variability based on target size ---
function botAim(st) {
  if (st.done) return;
  const target = document.querySelector('.aim-target');
  if (target) {
    const size = target.offsetWidth || 40;
    const delay = gDelay(320 + (60 - Math.min(size, 60)) * 4, 60);
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) target.click(); AUTOPLAY.busy = false; }, delay);
  }
}

// --- VISMEMORY ---
function botVismemory(st) {
  if (st.done || st.phase === 'show') return;
  if (st.phase === 'input') {
    for (const idx of st.highlighted) {
      if (!st.found.has(idx)) {
        AUTOPLAY.busy = true;
        setTimeout(() => { if (AUTOPLAY.active) clickVisMemCell(idx); AUTOPLAY.busy = false; }, gDelay(350, 80));
        return;
      }
    }
  }
}

// --- CHIMP — delay increases with number value ---
function botChimp(st) {
  if (st.done) return;
  if (st.phase === 'show') {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) clickChimpCell(1); AUTOPLAY.busy = false; }, gDelay(700, 180));
    return;
  }
  if (st.phase === 'input') {
    const next = st.nextExpected;
    const delay = gDelay(220 + next * 45, 40 + next * 10);
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) clickChimpCell(next); AUTOPLAY.busy = false; }, delay);
  }
}

// --- ROTATION ---
function botRotation(st) {
  if (st.done) return;
  const options = document.querySelectorAll('.rotation-option');
  for (const opt of options) {
    if (opt.getAttribute('onclick')?.includes('true')) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) opt.click(); AUTOPLAY.busy = false; }, gDelay(900, 250));
      return;
    }
  }
}

// --- PATHTRACER — delay increases with path position ---
function botPathtracer(st) {
  if (st.done || st.phase === 'show') return;
  if (st.phase === 'input') {
    const nextIdx = st.playerPath.length;
    if (nextIdx < st.path.length) {
      const delay = gDelay(350 + nextIdx * 55, 60 + nextIdx * 12);
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) clickPathCell(st.path[nextIdx]); AUTOPLAY.busy = false; }, delay);
    }
  }
}

// --- ASSOCIATION ---
function botAssociation(st) {
  if (st.done) return;
  const btns = document.querySelectorAll('.assoc-btn');
  for (const btn of btns) {
    const onclick = btn.getAttribute('onclick') || '';
    const m = onclick.match(/pickAssociation\('([^']*)','([^']*)'\)/);
    if (m && m[1] === m[2]) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) btn.click(); AUTOPLAY.busy = false; }, gDelay(700, 180));
      return;
    }
  }
}

// --- SORTRACE ---
function botSortrace(st) {
  if (st.done || st.gameOver || !st.correctOrder || !st.currentItems) return;
  for (let i = 0; i < st.currentItems.length; i++) {
    if (st.currentItems[i] !== st.correctOrder[i]) {
      const ci = st.currentItems.indexOf(st.correctOrder[i]);
      if (ci > i) {
        AUTOPLAY.busy = true;
        setTimeout(() => { if (AUTOPLAY.active) moveSortItem(ci, -1); AUTOPLAY.busy = false; }, gDelay(200, 50));
        return;
      }
    }
  }
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) submitSortRound(); AUTOPLAY.busy = false; }, gDelay(500, 120));
}

// --- RHYTHM ---
function botRhythm(st) {
  if (st.done || st.phase === 'listen') return;
  if (st.phase === 'tap') {
    if (st.playerTaps.length >= st.beatCount) return;
    if (st.playerTaps.length === 0) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active && st.phase === 'tap') tapRhythm(); AUTOPLAY.busy = false; }, gDelay(150, 40));
      return;
    }
    const tapIdx = st.playerTaps.length;
    if (tapIdx < st.pattern.length) {
      const expectedGap = st.pattern[tapIdx] - st.pattern[tapIdx - 1];
      const elapsed = performance.now() - st.startTime - st.playerTaps[st.playerTaps.length - 1];
      const remaining = expectedGap - elapsed;
      if (remaining <= 30) {
        const jitter = (Math.random() - 0.5) * 50;
        AUTOPLAY.busy = true;
        setTimeout(() => { if (AUTOPLAY.active && st.phase === 'tap') tapRhythm(); AUTOPLAY.busy = false; }, Math.max(0, jitter));
      }
    }
  }
}
