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
  _reactionRAF: null,
  _botClicking: false,
  maxMode: false
};

// --- Cheat code detection via reset code box only ---
document.addEventListener('DOMContentLoaded', function() {
  const resetInput = document.getElementById('reset-password');
  if (resetInput) {
    resetInput.addEventListener('input', function() {
      if (!AUTOPLAY.unlocked && resetInput.value === 'srg2') {
        AUTOPLAY.unlocked = true;
        resetInput.value = '';
        showToast('Verified');
        showAutoplayPrompt();
      }
    });
  }
});

// --- Keyboard: Shift toggle + input blocking ---
document.addEventListener('keydown', function(e) {
  // Don't intercept keys while typing in command prompt
  if (e.target && e.target.id === 'autoplay-cmd') return;
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

// --- Command prompt after unlock ---
function showAutoplayPrompt() {
  if (document.getElementById('autoplay-prompt')) return;
  const box = document.createElement('div');
  box.id = 'autoplay-prompt';
  box.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9999;background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:16px 24px;box-shadow:0 8px 32px rgba(0,0,0,0.3);text-align:center;';
  box.innerHTML = '<div style="font-size:11px;color:var(--fg2);margin-bottom:8px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">Enter command</div>' +
    '<input id="autoplay-cmd" type="text" autocomplete="off" spellcheck="false" style="background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:8px 14px;color:var(--fg);font-size:15px;font-family:var(--font-mono,monospace);width:120px;outline:none;text-align:center;">';
  document.body.appendChild(box);
  const input = document.getElementById('autoplay-cmd');
  setTimeout(() => input.focus(), 50);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase();
      box.remove();
      if (val === 'max') {
        AUTOPLAY.maxMode = true;
        showToast('Max mode');
        startAutoplay();
      }
    }
    if (e.key === 'Escape') box.remove();
  });
  // Click outside to close
  setTimeout(() => {
    document.addEventListener('click', function _close(ev) {
      const b = document.getElementById('autoplay-prompt');
      if (!b || !b.contains(ev.target)) {
        if (b) b.remove();
        document.removeEventListener('click', _close);
      }
    });
  }, 200);
}

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
  if (AUTOPLAY.maxMode) AUTOPLAY._reactionRAF = requestAnimationFrame(reactionMaxLoop);
  autoplayTick();
}

function stopAutoplay() {
  AUTOPLAY.active = false;
  if (AUTOPLAY.interval) { clearInterval(AUTOPLAY.interval); AUTOPLAY.interval = null; }
  if (AUTOPLAY._pulseRAF) { cancelAnimationFrame(AUTOPLAY._pulseRAF); AUTOPLAY._pulseRAF = null; }
  if (AUTOPLAY._reactionRAF) { cancelAnimationFrame(AUTOPLAY._reactionRAF); AUTOPLAY._reactionRAF = null; }
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
  badge.textContent = AUTOPLAY.maxMode ? 'MAX' : 'AUTO';
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
  wordro:600, numgrid:800, wordhive:600, pulse:0, deduction:800,
  memory:500, maze:400, mosaic:800, numcrunch:800, colorcode:600,
  quickmath:200, pattern:600, oddoneout:500, estimation:800, hanoi:600,
  simon:300, chainword:600, typing:200, reaction:200, nummemory:200,
  stroop:200, sliding:600, spotdiff:500, scramble:600, math24:1000,
  aim:200, vismemory:200, chimp:300, rotation:600, pathtracer:200,
  association:400, sortrace:500, rhythm:200
};

// ===================== REACTION — precise 50ms in max mode =====================
function reactionMaxLoop() {
  if (!AUTOPLAY.active || !AUTOPLAY.maxMode) return;
  AUTOPLAY._reactionRAF = requestAnimationFrame(reactionMaxLoop);
  const ch = GS.selectedChallenges && GS.selectedChallenges[GS.currentChallengeIdx];
  if (ch !== 'reaction') return;
  const st = GS.challengeState && GS.challengeState[ch];
  if (!st || st.done || AUTOPLAY.busy) return;
  // Reset flag when phase leaves green so it's ready for next round
  if (st.phase !== 'green') { st._botScheduled = false; return; }
  if (st.phase === 'green' && st.greenTime && !st._botScheduled) {
    st._botScheduled = true;
    AUTOPLAY.busy = true;
    // Calculate exact remaining time to hit 50ms from greenTime
    const elapsed = performance.now() - st.greenTime;
    const remaining = 50 - elapsed;
    if (remaining <= 0) {
      // Already past 50ms, click immediately
      AUTOPLAY._botClicking = true;
      handleReactionClick();
      AUTOPLAY._botClicking = false;
      setTimeout(() => { AUTOPLAY.busy = false; }, 40);
    } else {
      // Tight poll for precise timing
      const target = st.greenTime + 50;
      const poll = () => {
        if (performance.now() >= target) {
          if (AUTOPLAY.active && st.phase === 'green') {
            AUTOPLAY._botClicking = true;
            handleReactionClick();
            AUTOPLAY._botClicking = false;
          }
          setTimeout(() => { AUTOPLAY.busy = false; }, 40);
        } else {
          setTimeout(poll, 0);
        }
      };
      poll();
    }
  }
}

// ===================== PULSE — predictive timing for 100/100 on impossible =====================
function pulseFastLoop() {
  if (!AUTOPLAY.active) return;
  AUTOPLAY._pulseRAF = requestAnimationFrame(pulseFastLoop);
  const ch = GS.selectedChallenges && GS.selectedChallenges[GS.currentChallengeIdx];
  if (ch !== 'pulse') return;
  const st = GS.challengeState && GS.challengeState[ch];
  if (!st || st.gameOver || st.waiting || AUTOPLAY.busy) return;

  // Already hit target → stop clicking, let game end naturally with 100/100
  if (st.hits >= st.puzzle.targetHits) return;

  const center = st.zoneStart + st.zoneSize / 2;

  // If cursor is currently in zone, click immediately
  if (st.position >= st.zoneStart && st.position <= st.zoneStart + st.zoneSize) {
    AUTOPLAY.busy = true;
    AUTOPLAY._botClicking = true;
    const cursor = document.getElementById('pulse-cursor');
    if (cursor) cursor.style.left = st.position + '%';
    hitPulse();
    AUTOPLAY._botClicking = false;
    setTimeout(() => { AUTOPLAY.busy = false; }, 40);
    return;
  }

  // Predictive: simulate cursor to find when it reaches zone center, schedule precise click
  const timeMs = botPredictPulseTime(st.position, st.direction, st.speed, center);
  if (timeMs > 0) {
    AUTOPLAY.busy = true;
    const delay = Math.max(1, timeMs - 2); // 2ms early for setTimeout jitter
    setTimeout(() => {
      if (!AUTOPLAY.active || st.gameOver || st.waiting) {
        AUTOPLAY.busy = false;
        return;
      }
      // Force position to zone center for perfect visual precision
      st.position = center;
      const cursor = document.getElementById('pulse-cursor');
      if (cursor) cursor.style.left = center + '%';
      AUTOPLAY._botClicking = true;
      hitPulse();
      AUTOPLAY._botClicking = false;
      setTimeout(() => { AUTOPLAY.busy = false; }, 40);
    }, delay);
  }
}

// Simulate cursor bounce motion to predict time to reach target position
function botPredictPulseTime(pos, dir, speed, target) {
  let p = pos, d = dir;
  const step = 0.0001; // 0.1ms precision
  for (let i = 1; i <= 15000; i++) { // max 1.5s
    p += d * speed * step;
    if (p >= 98) { p = 98; d = -1; }
    if (p <= 2) { p = 2; d = 1; }
    if (Math.abs(p - target) < 0.5) return i * 0.1;
  }
  return 50; // fallback
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
  // Bot analysis buttons (numbot + wordrobot)
  for (const id of ['numbot-continue', 'wordrobot-continue']) {
    const btn = document.getElementById(id);
    if (btn) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) btn.click(); AUTOPLAY.busy = false; }, gDelay(500, 120));
      return;
    }
  }
  for (const id of ['btn-see-numbot', 'btn-see-wordbot']) {
    const btn = document.getElementById(id);
    if (btn) {
      AUTOPLAY.busy = true;
      setTimeout(() => { if (AUTOPLAY.active) btn.click(); AUTOPLAY.busy = false; }, gDelay(400, 100));
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
  if (!st && ch === 'mosaic' && typeof mosaicState !== 'undefined' && mosaicState) st = mosaicState;
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
    const v = vars[vi], step = Math.max((v.max - v.min) / 20, 1);
    for (let val = v.min; val <= v.max; val += step) {
      cur[v.key] = Math.round(val * 100) / 100;
      tryVals(vi + 1, cur);
    }
    cur[v.key] = v.max; tryVals(vi + 1, cur);
  }
  tryVals(0, {});
  // Hill-climbing refinement: 3 rounds of finer local search around best
  for (let round = 0; round < 3; round++) {
    const refined = {...bestVals};
    for (const v of vars) {
      const range = (v.max - v.min) / Math.pow(5, round + 1);
      const fineStep = range / 10;
      const center = refined[v.key];
      for (let val = Math.max(v.min, center - range); val <= Math.min(v.max, center + range); val += Math.max(fineStep, 0.01)) {
        refined[v.key] = Math.round(val * 100) / 100;
        const all = {};
        puzzle.variables.forEach(pv => { all[pv.key] = pv.default; });
        Object.assign(all, refined);
        if (puzzle.constraints.every(c => c.check(all))) {
          const out = puzzle.output(all);
          if (out > bestOutput) { bestOutput = out; bestVals = {...refined}; }
        }
      }
      refined[v.key] = bestVals[v.key]; // reset to best for next variable
    }
  }
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
  if (!mosaicState || !mosaicState.puzzle) return;
  const ms = mosaicState;
  const puzzle = ms.puzzle;
  const grid = ms.grid;
  const rows = puzzle.rows, cols = puzzle.cols;

  // Build target grid from zone solution values (once)
  if (!ms._botTarget) {
    ms._botTarget = Array.from({length: rows}, () => Array(cols).fill(null));
    for (const zone of puzzle.zones) {
      zone.cells.forEach((cell, i) => {
        ms._botTarget[cell.r][cell.c] = zone.solutionValues[i];
      });
    }
  }
  const target = ms._botTarget;

  // All cells filled → check solution
  if (grid.every(row => row.every(v => v !== null))) {
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) checkMosaicSolution(); AUTOPLAY.busy = false; }, gDelay(350, 80));
    return;
  }

  // Place linked tokens first (more constrained)
  for (let ti = 0; ti < puzzle.tokenPool.length; ti++) {
    if (ms.tokenPlaced[ti]) continue;
    const tok = puzzle.tokenPool[ti];
    if (tok.type !== 'linked') continue;
    const [v1, v2] = tok.values;
    // Try horizontal: (r,c) and (r,c+1)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 1; c++) {
        if (grid[r][c] !== null || grid[r][c+1] !== null) continue;
        if (target[r][c] === v1 && target[r][c+1] === v2) {
          return botPlaceMosaicToken(ti, r, c, 'horizontal');
        }
      }
    }
    // Try vertical: (r,c) and (r+1,c)
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== null || grid[r+1][c] !== null) continue;
        if (target[r][c] === v1 && target[r+1][c] === v2) {
          return botPlaceMosaicToken(ti, r, c, 'vertical');
        }
      }
    }
  }

  // Then place single tokens
  for (let ti = 0; ti < puzzle.tokenPool.length; ti++) {
    if (ms.tokenPlaced[ti]) continue;
    const tok = puzzle.tokenPool[ti];
    if (tok.type !== 'single') continue;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== null) continue;
        if (target[r][c] === tok.value) {
          return botPlaceMosaicToken(ti, r, c, null);
        }
      }
    }
  }
}

function botPlaceMosaicToken(tokenIdx, r, c, needOrient) {
  const tok = mosaicState.puzzle.tokenPool[tokenIdx];
  AUTOPLAY.busy = true;
  setTimeout(() => {
    if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
    selectMosaicToken(tokenIdx);
    // If linked and wrong orientation, rotate first
    if (needOrient && tok.type === 'linked' && tok.orientation !== needOrient) {
      setTimeout(() => {
        if (!AUTOPLAY.active) { AUTOPLAY.busy = false; return; }
        selectMosaicToken(tokenIdx); // rotates orientation
        setTimeout(() => {
          if (AUTOPLAY.active) placeMosaicToken(r, c);
          AUTOPLAY.busy = false;
        }, gDelay(100, 25));
      }, gDelay(100, 25));
    } else {
      setTimeout(() => {
        if (AUTOPLAY.active) placeMosaicToken(r, c);
        AUTOPLAY.busy = false;
      }, gDelay(150, 35));
    }
  }, gDelay(200, 50));
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
  // Guard: don't re-answer the same problem during 400ms feedback delay
  if (st._botLastProblem === st.currentProblem.text) return;
  const answer = st.currentProblem.answer;
  if (answer === undefined || answer === null) return;
  const ansStr = String(answer);
  st._botLastProblem = st.currentProblem.text;
  AUTOPLAY.busy = true;
  let delay = gDelay(300 + Math.min(Math.abs(answer), 50) * 3, 60);
  const input = document.getElementById('qm-input');
  if (input) input.value = '';
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
  // In max mode, green phase is handled by reactionMaxLoop RAF for precise 50ms
  if (AUTOPLAY.maxMode) return;
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
  // Pre-compute optimal solution path once using IDA*
  if (!st._botPath && !st._botPathFailed) {
    st._botPath = solveSlidingIDA(st.tiles, st.size);
    st._botStep = 0;
    if (!st._botPath) st._botPathFailed = true;
  }
  // Execute pre-computed path
  if (st._botPath && st._botStep < st._botPath.length) {
    const tileIdx = st._botPath[st._botStep];
    AUTOPLAY.busy = true;
    setTimeout(() => {
      if (AUTOPLAY.active) clickSlidingTile(tileIdx);
      st._botStep++;
      AUTOPLAY.busy = false;
    }, gDelay(50, 12));
    return;
  }
  // Fallback: improved greedy with visited-state tracking
  if (!st._visited) st._visited = new Set();
  const key = st.tiles.join(',');
  st._visited.add(key);
  const neighbors = getSlidingNeighbors(st.emptyIdx, st.size);
  let bestIdx = -1, bestScore = Infinity;
  for (const idx of neighbors) {
    const test = [...st.tiles]; test[st.emptyIdx] = test[idx]; test[idx] = 0;
    const testKey = test.join(',');
    const score = manhattanDist(test, st.size) + (st._visited.has(testKey) ? 1000 : 0);
    if (score < bestScore) { bestScore = score; bestIdx = idx; }
  }
  if (bestIdx === -1) bestIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
  AUTOPLAY.busy = true;
  setTimeout(() => { if (AUTOPLAY.active) clickSlidingTile(bestIdx); AUTOPLAY.busy = false; }, gDelay(50, 12));
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

// IDA* solver for sliding puzzle — optimal for 3x3/4x4, weighted for 5x5
function solveSlidingIDA(tiles, size) {
  const N = size * size;
  const goalRow = new Uint8Array(N);
  const goalCol = new Uint8Array(N);
  for (let v = 1; v < N; v++) {
    goalRow[v] = (v - 1) / size | 0;
    goalCol[v] = (v - 1) % size;
  }

  function manhattan(state) {
    let h = 0;
    for (let i = 0; i < N; i++) {
      const v = state[i];
      if (v === 0) continue;
      h += Math.abs((i / size | 0) - goalRow[v]) + Math.abs(i % size - goalCol[v]);
    }
    return h;
  }

  function linearConflict(state) {
    let lc = 0;
    for (let row = 0; row < size; row++) {
      const base = row * size;
      for (let i = base; i < base + size; i++) {
        const v = state[i];
        if (v === 0 || goalRow[v] !== row) continue;
        for (let j = i + 1; j < base + size; j++) {
          const w = state[j];
          if (w === 0 || goalRow[w] !== row) continue;
          if (goalCol[v] > goalCol[w]) lc++;
        }
      }
    }
    for (let col = 0; col < size; col++) {
      for (let i = col; i < N; i += size) {
        const v = state[i];
        if (v === 0 || goalCol[v] !== col) continue;
        for (let j = i + size; j < N; j += size) {
          const w = state[j];
          if (w === 0 || goalCol[w] !== col) continue;
          if (goalRow[v] > goalRow[w]) lc++;
        }
      }
    }
    return lc * 2;
  }

  const W = size <= 4 ? 1 : 2; // weight: optimal for <=4x4, fast suboptimal for 5x5
  const LIMIT = size <= 3 ? 500000 : size <= 4 ? 10000000 : 20000000;

  const state = new Int8Array(tiles);
  let empty = -1;
  for (let i = 0; i < N; i++) { if (state[i] === 0) { empty = i; break; } }

  const initH = manhattan(state) + linearConflict(state);
  if (initH === 0) return [];

  let nodeCount = 0;
  let found = false;
  const path = [];

  const DR = [-1, 1, 0, 0];
  const DC = [0, 0, -1, 1];
  const OPP = [1, 0, 3, 2];

  function search(eIdx, g, bound, lastDir) {
    const hVal = manhattan(state) + linearConflict(state);
    const f = g + W * hVal;
    if (f > bound) return f;
    if (hVal === 0) { found = true; return -1; }
    if (++nodeCount > LIMIT) return Infinity;

    let minT = Infinity;
    const eRow = eIdx / size | 0, eCol = eIdx % size;

    for (let dir = 0; dir < 4; dir++) {
      if (lastDir >= 0 && dir === OPP[lastDir]) continue;
      const nr = eRow + DR[dir], nc = eCol + DC[dir];
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      const ni = nr * size + nc;

      state[eIdx] = state[ni];
      state[ni] = 0;
      path.push(ni);

      const t = search(ni, g + 1, bound, dir);
      if (found) return -1;
      if (t < minT) minT = t;

      state[ni] = state[eIdx];
      state[eIdx] = 0;
      path.pop();
    }
    return minT;
  }

  let bound = W * initH;
  while (bound < Infinity && !found) {
    nodeCount = 0;
    const t = search(empty, 0, bound, -1);
    if (found) return Array.from(path);
    if (t === Infinity) break;
    bound = t;
  }
  return null;
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
  if (!st._botSolution) {
    // No solution found — skip this round instead of getting stuck
    AUTOPLAY.busy = true;
    setTimeout(() => { if (AUTOPLAY.active) skipMath24(); AUTOPLAY.busy = false; }, gDelay(500, 120));
    return;
  }
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
