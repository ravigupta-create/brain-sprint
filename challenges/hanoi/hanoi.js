// ==================== CHALLENGE 20: TOWER OF HANOI ====================

function getHanoiPuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:       { discs: 3, optimalMoves: 7,   timeLimit: 0 },
    medium:     { discs: 4, optimalMoves: 15,  timeLimit: 0 },
    hard:       { discs: 5, optimalMoves: 31,  timeLimit: 120 },
    extreme:    { discs: 6, optimalMoves: 63,  timeLimit: 90 },
    impossible: { discs: 7, optimalMoves: 127, timeLimit: 60 }
  };
  return { ...(configs[d] || configs.medium), difficulty: d };
}

function solveHanoiOptimal(n, from, to, aux) {
  if (n === 0) return [];
  return [
    ...solveHanoiOptimal(n - 1, from, aux, to),
    { from, to },
    ...solveHanoiOptimal(n - 1, aux, to, from)
  ];
}

function renderHanoi(puzzle) {
  document.getElementById('btn-submit-challenge').style.display = 'none';
  const pegs = [[], [], []];
  for (let i = puzzle.discs; i >= 1; i--) pegs[0].push(i);

  GS.challengeState.hanoi = {
    puzzle, pegs, moves: 0, selectedPeg: null, gameOver: false,
    timeLeft: puzzle.timeLimit, timerId: null
  };

  drawHanoi();

  // Start countdown if applicable
  const hasTimer = puzzle.timeLimit > 0 && GS.timerEnabled;
  if (hasTimer) {
    const hst = GS.challengeState.hanoi;
    hst.timerId = setInterval(() => {
      hst.timeLeft--;
      const tel = document.getElementById('hanoi-timer');
      if (tel) {
        tel.textContent = hst.timeLeft + 's';
        if (hst.timeLeft <= 10) tel.classList.add('hanoi-timer-low');
      }
      if (hst.timeLeft <= 0) {
        clearInterval(hst.timerId);
        endHanoiTimeout();
      }
    }, 1000);
  }
}

function drawHanoi() {
  const st = GS.challengeState.hanoi;
  const c = document.getElementById('game-container');
  const maxDisc = st.puzzle.discs;
  const colors = ['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c'];

  const hasTimer = st.puzzle.timeLimit > 0 && GS.timerEnabled;
  let html = '<div class="hanoi-container">';
  html += `<div class="hanoi-stats"><span>Moves: <strong id="hanoi-moves">${st.moves}</strong></span>${hasTimer ? `<span class="hanoi-countdown" id="hanoi-timer">${st.timeLeft}s</span>` : ''}<span>Optimal: <strong>${st.puzzle.optimalMoves}</strong></span></div>`;
  html += '<div class="hanoi-pegs">';

  for (let p = 0; p < 3; p++) {
    const isSelected = st.selectedPeg === p;
    const canSelect = !st.gameOver && st.pegs[p].length > 0;
    const topDisc = st.pegs[p].length > 0 ? st.pegs[p][st.pegs[p].length - 1] : null;
    const canDrop = st.selectedPeg !== null && st.selectedPeg !== p &&
      (st.pegs[p].length === 0 || st.pegs[p][st.pegs[p].length - 1] > st.pegs[st.selectedPeg][st.pegs[st.selectedPeg].length - 1]);

    html += `<div class="hanoi-peg-col ${isSelected ? 'hanoi-selected' : ''}" onclick="hanoiTapPeg(${p})">`;
    html += '<div class="hanoi-rod"></div>';
    html += '<div class="hanoi-discs">';

    for (let d = 0; d < st.pegs[p].length; d++) {
      const disc = st.pegs[p][d];
      const width = 30 + (disc / maxDisc) * 70;
      const isTop = d === st.pegs[p].length - 1;
      const liftClass = isSelected && isTop ? ' hanoi-disc-lift' : '';
      html += `<div class="hanoi-disc${liftClass}" style="width:${width}%;background:${colors[(disc - 1) % colors.length]}">${disc}</div>`;
    }
    html += '</div>';
    if (canDrop) html += '<div class="hanoi-drop-hint">Drop here</div>';
    html += `<div class="hanoi-peg-label">${p === 0 ? 'A' : p === 1 ? 'B' : 'C'}</div>`;
    html += '</div>';
  }

  html += '</div>';
  html += '<div class="hanoi-msg" id="hanoi-msg"></div>';
  html += '</div>';
  c.innerHTML = html;
}

function hanoiTapPeg(pegIdx) {
  const st = GS.challengeState.hanoi;
  if (st.gameOver) return;

  if (st.selectedPeg === null) {
    // Select a peg to pick up from
    if (st.pegs[pegIdx].length === 0) return;
    st.selectedPeg = pegIdx;
    SFX.tick();
    drawHanoi();
  } else if (st.selectedPeg === pegIdx) {
    // Deselect
    st.selectedPeg = null;
    drawHanoi();
  } else {
    // Try to move
    const fromPeg = st.pegs[st.selectedPeg];
    const toPeg = st.pegs[pegIdx];
    const disc = fromPeg[fromPeg.length - 1];

    if (toPeg.length > 0 && toPeg[toPeg.length - 1] < disc) {
      // Invalid move
      SFX.wrong();
      const msg = document.getElementById('hanoi-msg');
      if (msg) {
        msg.textContent = 'Can\'t place a larger disc on a smaller one!';
        msg.style.color = 'var(--red)';
      }
      st.selectedPeg = null;
      drawHanoi();
      return;
    }

    // Valid move
    fromPeg.pop();
    toPeg.push(disc);
    st.moves++;
    st.selectedPeg = null;
    SFX.pop();
    drawHanoi();

    // Check win: all discs on peg C (index 2)
    if (st.pegs[2].length === st.puzzle.discs) {
      st.gameOver = true;
      setTimeout(() => endHanoi(), 600);
    }
  }
}

function endHanoiTimeout() {
  const st = GS.challengeState.hanoi;
  st.gameOver = true;
  if (st.timerId) { clearInterval(st.timerId); st.timerId = null; }

  GS.results.hanoi = 0;
  if (GS.mode === 'daily') {
    setDailyCompletion('hanoi', 0);
    lsSet('daily-hanoi-state-' + getDailyDateStr(), {
      moves: st.moves, optimal: st.puzzle.optimalMoves, discs: st.puzzle.discs
    });
  }

  SFX.lose();
  showChallengeSummary({
    emoji: '⏱️',
    score: 0,
    title: "Time's Up!",
    stats: [
      { label: 'Moves made', value: st.moves },
      { label: 'Optimal moves', value: st.puzzle.optimalMoves },
      { label: 'Discs', value: st.puzzle.discs }
    ]
  });
  // Add replay button
  const panel = document.querySelector('.cs-panel');
  if (panel) {
    const continueBtn = panel.querySelector('.btn-primary');
    const replayBtn = document.createElement('button');
    replayBtn.className = 'btn btn-secondary btn-lg btn-full';
    replayBtn.style.marginTop = '8px';
    replayBtn.textContent = '🗼 Show Optimal Solution';
    replayBtn.onclick = showHanoiOptimalSolution;
    continueBtn.parentNode.insertBefore(replayBtn, continueBtn);
  }
}

function endHanoi() {
  const st = GS.challengeState.hanoi;
  if (st.timerId) { clearInterval(st.timerId); st.timerId = null; }
  const optimal = st.puzzle.optimalMoves;
  const ratio = optimal / st.moves;
  const score = Math.min(100, Math.max(0, Math.round(ratio * 100)));

  GS.results.hanoi = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('hanoi', score);
    lsSet('daily-hanoi-state-' + getDailyDateStr(), {
      moves: st.moves, optimal, discs: st.puzzle.discs
    });
  }

  showChallengeSummary({
    emoji: score >= 80 ? '🗼' : score >= 50 ? '🏗️' : '🧱',
    score,
    title: score === 100 ? 'Perfect Solve!' : score >= 80 ? 'Efficient!' : 'Keep Practicing!',
    stats: [
      { label: 'Your moves', value: st.moves },
      { label: 'Optimal moves', value: optimal },
      { label: 'Discs', value: st.puzzle.discs },
      { label: 'Efficiency', value: Math.round(ratio * 100) + '%' }
    ]
  });
  // Add replay button if not optimal
  if (st.moves > optimal) {
    const panel = document.querySelector('.cs-panel');
    if (panel) {
      const continueBtn = panel.querySelector('.btn-primary');
      const replayBtn = document.createElement('button');
      replayBtn.className = 'btn btn-secondary btn-lg btn-full';
      replayBtn.style.marginTop = '8px';
      replayBtn.textContent = '🗼 Show Optimal Solution';
      replayBtn.onclick = showHanoiOptimalSolution;
      continueBtn.parentNode.insertBefore(replayBtn, continueBtn);
    }
  }
}

function showHanoiOptimalSolution() {
  const st = GS.challengeState.hanoi;
  const puzzle = st.puzzle;
  const c = document.getElementById('game-container');
  const maxDisc = puzzle.discs;
  const colors = ['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c'];

  // Reset pegs to initial state
  const pegs = [[], [], []];
  for (let i = puzzle.discs; i >= 1; i--) pegs[0].push(i);

  const moves = solveHanoiOptimal(puzzle.discs, 0, 2, 1);

  function renderFrame(moveNum) {
    let html = '<div class="hanoi-container">';
    html += `<div class="hanoi-stats"><span>Optimal Solution</span><span>Move: <strong>${moveNum}</strong> / ${moves.length}</span></div>`;
    html += '<div class="hanoi-pegs">';
    for (let p = 0; p < 3; p++) {
      html += '<div class="hanoi-peg-col">';
      html += '<div class="hanoi-rod"></div>';
      html += '<div class="hanoi-discs">';
      for (let d = 0; d < pegs[p].length; d++) {
        const disc = pegs[p][d];
        const width = 30 + (disc / maxDisc) * 70;
        html += `<div class="hanoi-disc" style="width:${width}%;background:${colors[(disc - 1) % colors.length]}">${disc}</div>`;
      }
      html += '</div>';
      html += `<div class="hanoi-peg-label">${'ABC'[p]}</div>`;
      html += '</div>';
    }
    html += '</div>';
    html += `<div class="hanoi-msg" style="text-align:center;font-size:13px;color:var(--fg2);margin-top:8px">${moveNum > 0 ? 'Move disc from ' + 'ABC'[moves[moveNum-1].from] + ' → ' + 'ABC'[moves[moveNum-1].to] : 'Starting position'}</div>`;
    html += '<button class="btn btn-primary btn-lg btn-full" style="margin-top:12px" onclick="showNextOrFinish()">Continue →</button>';
    html += '</div>';
    c.innerHTML = html;
    document.getElementById('btn-submit-challenge').style.display = 'none';
  }

  renderFrame(0);

  const delay = Math.max(80, Math.min(500, 3500 / moves.length));
  moves.forEach((move, i) => {
    setTimeout(() => {
      const disc = pegs[move.from].pop();
      pegs[move.to].push(disc);
      renderFrame(i + 1);
    }, (i + 1) * delay);
  });
}
