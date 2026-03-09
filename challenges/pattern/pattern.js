// ==================== CHALLENGE 17: PATTERN LOCK ====================

function getPatternPuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:       { seqLen: 5, choices: 3, rounds: 5 },
    medium:     { seqLen: 5, choices: 4, rounds: 5 },
    hard:       { seqLen: 6, choices: 4, rounds: 4 },
    extreme:    { seqLen: 6, choices: 5, rounds: 4 },
    impossible: { seqLen: 7, choices: 5, rounds: 3 }
  };
  const cfg = configs[d] || configs.medium;
  const rounds = [];
  for (let r = 0; r < cfg.rounds; r++) {
    rounds.push(generatePatternRound(cfg, d));
  }
  return { ...cfg, rounds, difficulty: d };
}

function generatePatternRound(cfg, diff) {
  const type = rngPick(['arithmetic','geometric','fibonacci','alternating','square','double','custom']);

  let sequence, answer, rule;

  if (type === 'arithmetic') {
    const start = rngInt(1, 20);
    const step = rngInt(1, diff === 'easy' ? 5 : 15);
    sequence = [];
    for (let i = 0; i < cfg.seqLen; i++) sequence.push(start + step * i);
    answer = start + step * cfg.seqLen;
    rule = `Add ${step} each time`;
  } else if (type === 'geometric') {
    const start = rngInt(1, 5);
    const ratio = rngInt(2, diff === 'easy' ? 3 : 4);
    sequence = [];
    for (let i = 0; i < cfg.seqLen; i++) sequence.push(start * Math.pow(ratio, i));
    answer = start * Math.pow(ratio, cfg.seqLen);
    if (answer > 100000) return generatePatternRound(cfg, diff);
    rule = `Multiply by ${ratio} each time`;
  } else if (type === 'fibonacci') {
    const a = rngInt(1, 5);
    const b = rngInt(1, 8);
    sequence = [a, b];
    for (let i = 2; i < cfg.seqLen; i++) sequence.push(sequence[i-1] + sequence[i-2]);
    answer = sequence[cfg.seqLen - 1] + sequence[cfg.seqLen - 2];
    rule = 'Each number is the sum of the two before it';
  } else if (type === 'alternating') {
    const a = rngInt(1, 10);
    const stepA = rngInt(2, 6);
    const b = rngInt(1, 10);
    const stepB = rngInt(1, 5);
    sequence = [];
    for (let i = 0; i < cfg.seqLen; i++) {
      sequence.push(i % 2 === 0 ? a + stepA * Math.floor(i/2) : b + stepB * Math.floor(i/2));
    }
    answer = cfg.seqLen % 2 === 0
      ? a + stepA * Math.floor(cfg.seqLen / 2)
      : b + stepB * Math.floor(cfg.seqLen / 2);
    rule = 'Two interleaved sequences';
  } else if (type === 'square') {
    const start = rngInt(1, 6);
    sequence = [];
    for (let i = 0; i < cfg.seqLen; i++) sequence.push((start + i) * (start + i));
    answer = (start + cfg.seqLen) * (start + cfg.seqLen);
    rule = `Consecutive perfect squares starting from ${start}²`;
  } else if (type === 'double') {
    const start = rngInt(1, 10);
    const add = rngInt(1, 5);
    sequence = [start];
    for (let i = 1; i < cfg.seqLen; i++) sequence.push(sequence[i-1] * 2 + add);
    answer = sequence[cfg.seqLen - 1] * 2 + add;
    if (answer > 100000) return generatePatternRound(cfg, diff);
    rule = `Double and add ${add}`;
  } else {
    // Custom: differences increase
    const start = rngInt(1, 10);
    const diffStart = rngInt(1, 4);
    const diffStep = rngInt(1, 3);
    sequence = [start];
    for (let i = 1; i < cfg.seqLen; i++) {
      sequence.push(sequence[i-1] + diffStart + diffStep * (i - 1));
    }
    answer = sequence[cfg.seqLen - 1] + diffStart + diffStep * (cfg.seqLen - 1);
    rule = `Differences increase by ${diffStep} each time`;
  }

  // Generate wrong choices
  const choices = [answer];
  const offsets = [-3, -2, -1, 1, 2, 3, 5, 7, -5, 10, -10];
  while (choices.length < cfg.choices) {
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    const wrong = answer + offset;
    if (wrong > 0 && !choices.includes(wrong)) choices.push(wrong);
  }

  return { sequence, answer, choices: rngShuffle(choices), rule, type };
}

function renderPattern(puzzle) {
  const c = document.getElementById('game-container');
  document.getElementById('btn-submit-challenge').style.display = 'none';
  GS.challengeState.pattern = {
    puzzle,
    currentRound: 0,
    correct: 0,
    answers: [],
    gameOver: false
  };
  renderPatternRound();
}

function renderPatternRound() {
  const st = GS.challengeState.pattern;
  const p = st.puzzle;
  const c = document.getElementById('game-container');

  if (st.currentRound >= p.rounds.length) {
    endPattern();
    return;
  }

  const round = p.rounds[st.currentRound];
  let html = '<div class="pt-container">';
  html += `<div class="pt-progress">Round ${st.currentRound + 1} of ${p.rounds.length}</div>`;
  html += '<div class="pt-label">What comes next?</div>';

  // Sequence display
  html += '<div class="pt-sequence">';
  round.sequence.forEach((num, i) => {
    html += `<span class="pt-num" style="animation-delay:${i * 0.08}s">${num}</span>`;
    if (i < round.sequence.length - 1) html += '<span class="pt-arrow">→</span>';
  });
  html += '<span class="pt-mystery">?</span>';
  html += '</div>';

  // Choices
  html += '<div class="pt-choices">';
  round.choices.forEach((choice, i) => {
    html += `<button class="pt-choice-btn" id="pt-choice-${i}" onclick="selectPatternAnswer(${i})">${choice}</button>`;
  });
  html += '</div>';

  html += '<div class="pt-feedback" id="pt-feedback"></div>';
  html += '</div>';

  c.innerHTML = html;
}

function selectPatternAnswer(choiceIdx) {
  const st = GS.challengeState.pattern;
  if (st.gameOver) return;
  const round = st.puzzle.rounds[st.currentRound];
  const chosen = round.choices[choiceIdx];
  const correct = chosen === round.answer;

  // Disable all buttons
  document.querySelectorAll('.pt-choice-btn').forEach(btn => btn.disabled = true);

  // Highlight correct/incorrect
  const selectedBtn = document.getElementById('pt-choice-' + choiceIdx);
  if (correct) {
    selectedBtn.classList.add('pt-correct');
    st.correct++;
    SFX.correct();
  } else {
    selectedBtn.classList.add('pt-incorrect');
    SFX.wrong();
    // Show correct answer
    round.choices.forEach((c, i) => {
      if (c === round.answer) document.getElementById('pt-choice-' + i).classList.add('pt-correct');
    });
  }

  st.answers.push({ correct, chosen, answer: round.answer });

  // Show rule
  const feedback = document.getElementById('pt-feedback');
  if (feedback) {
    feedback.innerHTML = `<strong>${correct ? '✓ Correct!' : '✗ Wrong!'}</strong> ${round.rule}`;
    feedback.className = 'pt-feedback ' + (correct ? 'pt-fb-correct' : 'pt-fb-wrong');
  }

  // Replace mystery with answer
  const mystery = document.querySelector('.pt-mystery');
  if (mystery) {
    mystery.textContent = round.answer;
    mystery.classList.add(correct ? 'pt-reveal-correct' : 'pt-reveal-wrong');
  }

  // Next round after delay
  st.currentRound++;
  setTimeout(() => renderPatternRound(), 1800);
}

function endPattern() {
  const st = GS.challengeState.pattern;
  st.gameOver = true;
  const score = Math.round(100 * st.correct / st.puzzle.rounds.length);

  GS.results.pattern = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('pattern', score);
    lsSet('daily-pattern-state-' + getDailyDateStr(), {
      correct: st.correct, total: st.puzzle.rounds.length
    });
  }

  let reviewHtml = '';
  st.answers.forEach((a, i) => {
    const icon = a.correct ? '✓' : '✗';
    const round = st.puzzle.rounds[i];
    reviewHtml += `<div class="cs-choice"><span>${icon}</span><span style="flex:1">${round.sequence.join(', ')}, <strong>${a.answer}</strong> (${round.rule})</span></div>`;
  });

  showChallengeSummary({
    emoji: score >= 80 ? '🔮' : score >= 50 ? '🧩' : '❓',
    score,
    title: score >= 80 ? 'Pattern Master!' : score >= 50 ? 'Good Eye!' : 'Tricky Patterns!',
    stats: [
      { label: 'Correct', value: `${st.correct} / ${st.puzzle.rounds.length}` }
    ],
    miniReview: reviewHtml
  });
}
