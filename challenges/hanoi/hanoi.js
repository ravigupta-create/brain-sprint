// ==================== CHALLENGE 20: TOWER OF HANOI ====================

function getHanoiPuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:       { discs: 3, optimalMoves: 7 },
    medium:     { discs: 4, optimalMoves: 15 },
    hard:       { discs: 5, optimalMoves: 31 },
    extreme:    { discs: 6, optimalMoves: 63 },
    impossible: { discs: 7, optimalMoves: 127 }
  };
  return { ...(configs[d] || configs.medium), difficulty: d };
}

function renderHanoi(puzzle) {
  document.getElementById('btn-submit-challenge').style.display = 'none';
  const pegs = [[], [], []];
  for (let i = puzzle.discs; i >= 1; i--) pegs[0].push(i);

  GS.challengeState.hanoi = {
    puzzle, pegs, moves: 0, selectedPeg: null, gameOver: false
  };

  drawHanoi();
}

function drawHanoi() {
  const st = GS.challengeState.hanoi;
  const c = document.getElementById('game-container');
  const maxDisc = st.puzzle.discs;
  const colors = ['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c'];

  let html = '<div class="hanoi-container">';
  html += `<div class="hanoi-stats"><span>Moves: <strong id="hanoi-moves">${st.moves}</strong></span><span>Optimal: <strong>${st.puzzle.optimalMoves}</strong></span></div>`;
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

function endHanoi() {
  const st = GS.challengeState.hanoi;
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
}
