// ==================== MATH 24 ====================

function getMath24Puzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { rounds: 3, maxNum: 9,  target: 24, timeLimit: 60 },
    medium:     { rounds: 4, maxNum: 10, target: 24, timeLimit: 45 },
    hard:       { rounds: 5, maxNum: 12, target: 24, timeLimit: 35 },
    extreme:    { rounds: 5, maxNum: 13, target: 24, timeLimit: 30 },
    impossible: { rounds: 6, maxNum: 13, target: 24, timeLimit: 25 }
  };
  const cfg = configs[diff];
  // Pre-generate solvable puzzles
  const puzzles = [];
  for (let i = 0; i < cfg.rounds; i++) {
    let nums;
    let attempts = 0;
    do {
      nums = [rngInt(1, cfg.maxNum), rngInt(1, cfg.maxNum), rngInt(1, cfg.maxNum), rngInt(1, cfg.maxNum)];
      attempts++;
    } while (!canMake24(nums) && attempts < 200);
    if (!canMake24(nums)) nums = [1, 2, 3, 4]; // fallback
    puzzles.push(nums);
  }
  return { puzzles, ...cfg, difficulty: diff };
}

function canMake24(nums) {
  return findSolution24(nums) !== null;
}

function findSolution24(nums) {
  const ops = ['+', '-', '*', '/'];
  const perms = permutations(nums);
  for (const p of perms) {
    for (const o1 of ops) {
      for (const o2 of ops) {
        for (const o3 of ops) {
          // Try different groupings
          // ((a o1 b) o2 c) o3 d
          let r = applyOp(applyOp(applyOp(p[0], o1, p[1]), o2, p[2]), o3, p[3]);
          if (Math.abs(r - 24) < 0.001) return `((${p[0]} ${o1} ${p[1]}) ${o2} ${p[2]}) ${o3} ${p[3]}`;
          // (a o1 (b o2 c)) o3 d
          r = applyOp(applyOp(p[0], o1, applyOp(p[1], o2, p[2])), o3, p[3]);
          if (Math.abs(r - 24) < 0.001) return `(${p[0]} ${o1} (${p[1]} ${o2} ${p[2]})) ${o3} ${p[3]}`;
          // (a o1 b) o2 (c o3 d)
          r = applyOp(applyOp(p[0], o1, p[1]), o2, applyOp(p[2], o3, p[3]));
          if (Math.abs(r - 24) < 0.001) return `(${p[0]} ${o1} ${p[1]}) ${o2} (${p[2]} ${o3} ${p[3]})`;
          // a o1 ((b o2 c) o3 d)
          r = applyOp(p[0], o1, applyOp(applyOp(p[1], o2, p[2]), o3, p[3]));
          if (Math.abs(r - 24) < 0.001) return `${p[0]} ${o1} ((${p[1]} ${o2} ${p[2]}) ${o3} ${p[3]})`;
          // a o1 (b o2 (c o3 d))
          r = applyOp(p[0], o1, applyOp(p[1], o2, applyOp(p[2], o3, p[3])));
          if (Math.abs(r - 24) < 0.001) return `${p[0]} ${o1} (${p[1]} ${o2} (${p[2]} ${o3} ${p[3]}))`;
        }
      }
    }
  }
  return null;
}

function applyOp(a, op, b) {
  switch(op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : Infinity;
  }
  return NaN;
}

function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

function renderMath24(puzzle) {
  const state = {
    puzzle,
    round: 0,
    correct: 0,
    skipped: 0,
    timeLeft: puzzle.timeLimit,
    timer: null,
    done: false
  };
  GS.challengeState.math24 = state;
  showMath24Round(state);
}

function showMath24Round(state) {
  if (state.round >= state.puzzle.puzzles.length) {
    finishMath24(state);
    return;
  }

  state.timeLeft = state.puzzle.timeLimit;
  const nums = state.puzzle.puzzles[state.round];

  const c = document.getElementById('game-container');
  c.innerHTML = `<div class="math24-game">
    <div class="math24-header">
      <span>Round ${state.round + 1} / ${state.puzzle.puzzles.length}</span>
      <span>✓${state.correct}</span>
      <span>⏱ <span id="m24-time">${GS.timerEnabled ? state.timeLeft : '∞'}</span>s</span>
    </div>
    <div class="math24-target">Make <span class="math24-24">24</span></div>
    <div class="math24-numbers">
      ${nums.map(n => `<div class="math24-num">${n}</div>`).join('')}
    </div>
    <div class="math24-hint">Use +, −, ×, ÷ and parentheses</div>
    <input type="text" class="math24-input" id="m24-input" placeholder="e.g. (8-2)*(5-1)" autocomplete="off" autocapitalize="off">
    <div class="math24-buttons">
      <button class="btn btn-primary btn-lg" onclick="submitMath24()" style="flex:1">Check</button>
      <button class="btn btn-secondary" onclick="skipMath24()" style="flex:0.5">Skip</button>
    </div>
    <div class="math24-feedback" id="m24-feedback"></div>
  </div>`;

  document.getElementById('m24-input').focus();
  document.getElementById('m24-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitMath24();
  });

  if (GS.timerEnabled) {
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(() => {
      state.timeLeft--;
      const el = document.getElementById('m24-time');
      if (el) {
        el.textContent = state.timeLeft;
        if (state.timeLeft <= 5) el.style.color = 'var(--red)';
      }
      if (state.timeLeft <= 0) skipMath24();
    }, 1000);
  }
}

function submitMath24() {
  const state = GS.challengeState.math24;
  if (state.done) return;

  const input = document.getElementById('m24-input').value.trim();
  if (!input) return;

  const feedback = document.getElementById('m24-feedback');
  const nums = state.puzzle.puzzles[state.round];

  // Validate expression uses only the given numbers
  // Extract all numbers from expression
  const exprNums = input.match(/\d+/g);
  if (!exprNums) {
    if (feedback) feedback.textContent = 'Enter a valid math expression';
    return;
  }
  const sortedExpr = exprNums.map(Number).sort((a, b) => a - b);
  const sortedGiven = [...nums].sort((a, b) => a - b);
  if (sortedExpr.length !== sortedGiven.length || !sortedExpr.every((n, i) => n === sortedGiven[i])) {
    if (feedback) { feedback.textContent = 'Use exactly the four given numbers!'; feedback.style.color = 'var(--red)'; }
    return;
  }

  // Validate only allowed characters
  const sanitized = input.replace(/[0-9+\-*/×÷().  ]/g, '');
  if (sanitized.length > 0) {
    if (feedback) { feedback.textContent = 'Invalid characters in expression'; feedback.style.color = 'var(--red)'; }
    return;
  }

  // Evaluate
  try {
    const evalExpr = input.replace(/×/g, '*').replace(/÷/g, '/');
    const result = Function('"use strict"; return (' + evalExpr + ')')();
    if (Math.abs(result - 24) < 0.001) {
      state.correct++;
      if (state.timer) clearInterval(state.timer);
      SFX.correct();
      if (feedback) { feedback.textContent = '✓ Correct! = 24'; feedback.style.color = 'var(--green)'; }
      state.round++;
      setTimeout(() => showMath24Round(state), 800);
    } else {
      if (feedback) { feedback.textContent = `= ${Math.round(result * 100) / 100}, not 24!`; feedback.style.color = 'var(--red)'; }
      SFX.wrong();
    }
  } catch {
    if (feedback) { feedback.textContent = 'Invalid expression'; feedback.style.color = 'var(--red)'; }
  }
}

function skipMath24() {
  const state = GS.challengeState.math24;
  if (state.done) return;
  if (state.timer) clearInterval(state.timer);
  state.skipped++;

  // Show solution
  const nums = state.puzzle.puzzles[state.round];
  const solution = findSolution24(nums);
  const feedback = document.getElementById('m24-feedback');
  if (feedback) {
    feedback.textContent = solution ? `Solution: ${solution}` : 'No solution found';
    feedback.style.color = 'var(--fg2)';
  }
  SFX.wrong();
  state.round++;
  setTimeout(() => showMath24Round(state), 1500);
}

function finishMath24(state) {
  state.done = true;
  if (state.timer) clearInterval(state.timer);
  const score = Math.round((state.correct / state.puzzle.puzzles.length) * 100);

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('math24', score);
    lsSet('daily-math24-state-' + getDailyDateStr(), { correct: state.correct, skipped: state.skipped, rounds: state.puzzle.puzzles.length });
  }
  showChallengeSummary({
    emoji: score === 100 ? '🎲' : score >= 60 ? '🧮' : '😰',
    score,
    title: score >= 90 ? 'Math Wizard!' : score >= 60 ? 'Good Computing!' : 'Numbers Are Hard!',
    stats: [
      { label: 'Solved', value: `${state.correct} / ${state.puzzle.puzzles.length}` },
      { label: 'Skipped', value: state.skipped }
    ]
  });
}
