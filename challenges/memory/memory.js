// ==================== CHALLENGE 11: MEMORY FLIP ====================

function getMemoryPuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:    { rows: 3, cols: 4, pairs: 6,  time: 90,  parMoves: 10 },
    medium:  { rows: 4, cols: 4, pairs: 8,  time: 75,  parMoves: 14 },
    hard:    { rows: 4, cols: 5, pairs: 10, time: 60,  parMoves: 18 },
    extreme: { rows: 6, cols: 6, pairs: 18, time: 90,  parMoves: 32 },
    impossible: { rows: 6, cols: 6, pairs: 18, time: 45, parMoves: 24 }
  };
  const cfg = configs[d] || configs.medium;
  const symbols = ['🍎','🍋','🍇','🌸','🔥','💎','🎵','⚡','🌙','🍀','🎯','🦋','🌈','⭐','🎪','🐙','🎲','🔔','❄️','🌻'];
  const picked = rngShuffle(symbols).slice(0, cfg.pairs);
  const deck = rngShuffle([...picked, ...picked]);
  const grid = [];
  let idx = 0;
  for (let r = 0; r < cfg.rows; r++) {
    const row = [];
    for (let c = 0; c < cfg.cols; c++) {
      row.push({ symbol: deck[idx++], matched: false });
    }
    grid.push(row);
  }
  return { ...cfg, grid };
}

function renderMemory(puzzle) {
  const c = document.getElementById('game-container');
  document.getElementById('btn-submit-challenge').style.display = 'none';
  GS.challengeState.memory = {
    puzzle, flipped: [], moves: 0, pairsFound: 0, combo: 0, comboBonus: 0,
    locked: false, timeLeft: puzzle.time, timerId: null, started: false
  };
  const st = GS.challengeState.memory;

  let html = `<div style="padding:8px 0">`;
  html += `<div class="memory-stats"><span id="mem-pairs">Pairs: 0/${puzzle.pairs}</span><span id="mem-moves">Moves: 0</span><span id="mem-timer">⏱ ${puzzle.time}s</span></div>`;
  html += `<div class="memory-grid" id="memory-grid" style="grid-template-columns:repeat(${puzzle.cols},1fr)">`;
  for (let r = 0; r < puzzle.rows; r++) {
    for (let cc = 0; cc < puzzle.cols; cc++) {
      html += `<div class="memory-card" id="mc-${r}-${cc}" onclick="flipMemoryCard(${r},${cc})">
        <div class="memory-card-inner">
          <div class="memory-card-front">?</div>
          <div class="memory-card-back">${puzzle.grid[r][cc].symbol}</div>
        </div>
      </div>`;
    }
  }
  html += `</div></div>`;
  c.innerHTML = html;

  // Start countdown
  st.timerId = setInterval(() => {
    st.timeLeft--;
    const el = document.getElementById('mem-timer');
    if (el) el.textContent = `⏱ ${st.timeLeft}s`;
    if (st.timeLeft <= 0) {
      clearInterval(st.timerId);
      endMemoryGame(false);
    }
  }, 1000);
}

function flipMemoryCard(r, cc) {
  const st = GS.challengeState.memory;
  if (st.locked) return;
  if (st.puzzle.grid[r][cc].matched) return;
  if (st.flipped.length >= 2) return;
  // Don't flip same card twice
  if (st.flipped.some(f => f.r === r && f.c === cc)) return;

  const card = document.getElementById(`mc-${r}-${cc}`);
  card.classList.add('flipped');
  st.flipped.push({ r, c: cc });

  if (st.flipped.length === 2) {
    st.moves++;
    document.getElementById('mem-moves').textContent = `Moves: ${st.moves}`;
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const st = GS.challengeState.memory;
  const [a, b] = st.flipped;
  const symA = st.puzzle.grid[a.r][a.c].symbol;
  const symB = st.puzzle.grid[b.r][b.c].symbol;

  st.locked = true;

  if (symA === symB) {
    // Match!
    st.puzzle.grid[a.r][a.c].matched = true;
    st.puzzle.grid[b.r][b.c].matched = true;
    st.pairsFound++;
    st.combo++;

    setTimeout(() => {
      const cardA = document.getElementById(`mc-${a.r}-${a.c}`);
      const cardB = document.getElementById(`mc-${b.r}-${b.c}`);
      if (cardA) { cardA.classList.add('matched', 'match-anim'); }
      if (cardB) { cardB.classList.add('matched', 'match-anim'); }

      // Combo popup
      if (st.combo >= 2) {
        st.comboBonus += st.combo * 2;
        const popup = document.createElement('div');
        popup.className = 'memory-combo';
        popup.textContent = `${st.combo}x Combo!`;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 800);
      }

      document.getElementById('mem-pairs').textContent = `Pairs: ${st.pairsFound}/${st.puzzle.pairs}`;
      st.flipped = [];
      st.locked = false;

      if (st.pairsFound === st.puzzle.pairs) {
        clearInterval(st.timerId);
        setTimeout(() => endMemoryGame(true), 400);
      }
    }, 300);
  } else {
    // No match
    st.combo = 0;
    setTimeout(() => {
      const cardA = document.getElementById(`mc-${a.r}-${a.c}`);
      const cardB = document.getElementById(`mc-${b.r}-${b.c}`);
      if (cardA) cardA.classList.remove('flipped');
      if (cardB) cardB.classList.remove('flipped');
      st.flipped = [];
      st.locked = false;
    }, 700);
  }
}

function endMemoryGame(completed) {
  const st = GS.challengeState.memory;
  if (st.timerId) clearInterval(st.timerId);
  let score;
  if (completed) {
    const efficiency = Math.min(1, st.puzzle.parMoves / st.moves);
    const bonus = Math.min(20, st.comboBonus);
    score = Math.min(100, Math.round(efficiency * 80 + bonus));
  } else {
    score = Math.min(50, Math.round((st.pairsFound / st.puzzle.pairs) * 50));
  }

  GS.results.memory = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('memory', score);
    lsSet('daily-memory-state-'+getDailyDateStr(), { completed, pairsFound: st.pairsFound, totalPairs: st.puzzle.pairs, moves: st.moves, parMoves: st.puzzle.parMoves, comboBonus: Math.min(20, st.comboBonus) });
  }

  showChallengeSummary({
    emoji: completed ? '🃏' : '⏱️',
    score,
    title: completed ? 'All Pairs Found!' : "Time's Up!",
    stats: [
      { label: 'Pairs found', value: `${st.pairsFound} / ${st.puzzle.pairs}` },
      { label: 'Moves', value: `${st.moves} (par: ${st.puzzle.parMoves})` },
      { label: 'Combo bonus', value: `${Math.min(20, st.comboBonus)} pts` }
    ]
  });
}

