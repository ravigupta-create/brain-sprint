// ==================== CHALLENGE 16: QUICK MATH ====================

function getQuickMathPuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:       { time: 60, ops: ['+','-'], range: [1,20], target: 10 },
    medium:     { time: 60, ops: ['+','-','*'], range: [1,30], target: 15 },
    hard:       { time: 45, ops: ['+','-','*'], range: [2,50], target: 15 },
    extreme:    { time: 40, ops: ['+','-','*','/'], range: [2,99], target: 18 },
    impossible: { time: 30, ops: ['+','-','*','/'], range: [5,99], target: 20 }
  };
  return { ...(configs[d] || configs.medium), difficulty: d };
}

function renderQuickMath(puzzle) {
  const c = document.getElementById('game-container');
  document.getElementById('btn-submit-challenge').style.display = 'none';

  GS.challengeState.quickmath = {
    puzzle,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
    currentProblem: null,
    timeLeft: puzzle.time,
    timerId: null,
    gameOver: false,
    totalAnswered: 0
  };

  let html = '<div class="qm-container">';
  html += '<div class="qm-stats">';
  html += `<span class="qm-timer" id="qm-timer">${puzzle.time}s</span>`;
  html += '<span class="qm-score" id="qm-score">0</span>';
  html += `<span class="qm-streak" id="qm-streak">🔥 0</span>`;
  html += '</div>';
  html += '<div class="qm-problem" id="qm-problem"></div>';
  html += '<div class="qm-feedback" id="qm-feedback"></div>';
  html += '<input type="number" class="qm-input" id="qm-input" inputmode="numeric" autocomplete="off" placeholder="?">';
  html += '<div class="qm-numpad" id="qm-numpad">';
  for (let i = 1; i <= 9; i++) {
    html += `<button class="qm-num-btn" onclick="qmNumPress('${i}')">${i}</button>`;
  }
  html += '<button class="qm-num-btn qm-negative" onclick="qmNumPress(\'-\')">±</button>';
  html += '<button class="qm-num-btn" onclick="qmNumPress(\'0\')">0</button>';
  html += '<button class="qm-num-btn qm-enter" onclick="qmSubmitAnswer()">✓</button>';
  html += '</div>';
  html += '</div>';
  if (!GS.timerEnabled) {
    html += '<button class="btn btn-secondary btn-lg btn-full" style="margin-top:12px" onclick="endQuickMath()">Finish</button>';
  }

  c.innerHTML = html;

  // Focus input
  const input = document.getElementById('qm-input');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); qmSubmitAnswer(); }
  });
  setTimeout(() => input.focus(), 100);

  // Generate first problem
  qmNextProblem();

  // Start timer
  const st = GS.challengeState.quickmath;
  if (GS.timerEnabled) {
    st.timerId = setInterval(() => {
      st.timeLeft--;
      const el = document.getElementById('qm-timer');
      if (el) {
        el.textContent = st.timeLeft + 's';
        if (st.timeLeft <= 10) el.classList.add('qm-timer-low');
      }
      if (st.timeLeft <= 0) {
        clearInterval(st.timerId);
        endQuickMath();
      }
    }, 1000);
  } else {
    const el = document.getElementById('qm-timer');
    if (el) el.textContent = '∞';
  }
}

function qmGenerateProblem() {
  const st = GS.challengeState.quickmath;
  const p = st.puzzle;
  const op = p.ops[Math.floor(Math.random() * p.ops.length)];
  let a, b, answer;

  if (op === '+') {
    a = Math.floor(Math.random() * (p.range[1] - p.range[0] + 1)) + p.range[0];
    b = Math.floor(Math.random() * (p.range[1] - p.range[0] + 1)) + p.range[0];
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * (p.range[1] - p.range[0] + 1)) + p.range[0];
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  } else if (op === '*') {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    answer = a * b;
  } else if (op === '/') {
    b = Math.floor(Math.random() * 11) + 2;
    answer = Math.floor(Math.random() * 15) + 1;
    a = b * answer;
  }

  return { a, b, op, answer, text: `${a} ${op === '*' ? '×' : op === '/' ? '÷' : op} ${b}` };
}

function qmNextProblem() {
  const st = GS.challengeState.quickmath;
  if (st.gameOver) return;
  st.currentProblem = qmGenerateProblem();
  const el = document.getElementById('qm-problem');
  if (el) {
    el.textContent = st.currentProblem.text + ' = ?';
    el.classList.remove('qm-problem-enter');
    void el.offsetWidth;
    el.classList.add('qm-problem-enter');
  }
  const input = document.getElementById('qm-input');
  if (input) { input.value = ''; input.focus(); }
}

function qmNumPress(key) {
  const st = GS.challengeState.quickmath;
  if (!st || st.gameOver) return;
  const input = document.getElementById('qm-input');
  if (!input) return;

  if (key === '-') {
    if (input.value.startsWith('-')) input.value = input.value.slice(1);
    else input.value = '-' + input.value;
  } else {
    input.value += key;
  }
  input.focus();
}

function qmSubmitAnswer() {
  const st = GS.challengeState.quickmath;
  if (!st || st.gameOver || !st.currentProblem) return;
  const input = document.getElementById('qm-input');
  const val = parseInt(input.value, 10);
  const feedback = document.getElementById('qm-feedback');

  if (isNaN(val)) {
    if (feedback) feedback.textContent = 'Enter a number';
    return;
  }

  st.totalAnswered++;

  if (val === st.currentProblem.answer) {
    st.correct++;
    st.streak++;
    if (st.streak > st.bestStreak) st.bestStreak = st.streak;
    SFX.pop();
    if (feedback) {
      feedback.textContent = '✓ Correct!';
      feedback.className = 'qm-feedback qm-correct';
    }
    // Bonus time for streaks
    if (GS.timerEnabled && st.streak > 0 && st.streak % 5 === 0) {
      st.timeLeft = Math.min(st.timeLeft + 3, st.puzzle.time);
      const timerEl = document.getElementById('qm-timer');
      if (timerEl) timerEl.textContent = st.timeLeft + 's';
      if (feedback) feedback.textContent = '✓ Correct! +3s bonus!';
      SFX.streak();
    }
  } else {
    st.wrong++;
    st.streak = 0;
    SFX.wrong();
    if (feedback) {
      feedback.textContent = `✗ ${st.currentProblem.text} = ${st.currentProblem.answer}`;
      feedback.className = 'qm-feedback qm-wrong';
    }
  }

  const scoreEl = document.getElementById('qm-score');
  if (scoreEl) scoreEl.textContent = st.correct;
  const streakEl = document.getElementById('qm-streak');
  if (streakEl) streakEl.textContent = '🔥 ' + st.streak;

  setTimeout(() => {
    if (feedback) feedback.className = 'qm-feedback';
    qmNextProblem();
  }, 400);
}

function endQuickMath() {
  const st = GS.challengeState.quickmath;
  st.gameOver = true;
  if (st.timerId) clearInterval(st.timerId);

  const score = Math.min(100, Math.round(100 * st.correct / st.puzzle.target));
  GS.results.quickmath = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('quickmath', score);
    lsSet('daily-quickmath-state-' + getDailyDateStr(), {
      correct: st.correct, wrong: st.wrong, total: st.totalAnswered,
      bestStreak: st.bestStreak, target: st.puzzle.target
    });
  }

  const accuracy = st.totalAnswered > 0 ? Math.round(100 * st.correct / st.totalAnswered) : 0;

  showChallengeSummary({
    emoji: score >= 80 ? '⚡' : score >= 50 ? '🧮' : '🐌',
    score,
    title: score >= 80 ? 'Lightning Fast!' : score >= 50 ? 'Solid Math!' : 'Keep Practicing!',
    stats: [
      { label: 'Correct answers', value: `${st.correct} / ${st.puzzle.target} target` },
      { label: 'Accuracy', value: accuracy + '%' },
      { label: 'Best streak', value: st.bestStreak },
      { label: 'Total answered', value: st.totalAnswered }
    ]
  });
}
