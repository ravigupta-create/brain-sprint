// ==================== CHALLENGE 21: SIMON SAYS ====================

function getSimonPuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:       { startLen: 3, maxLen: 8,  speed: 600, colors: 4 },
    medium:     { startLen: 4, maxLen: 10, speed: 500, colors: 4 },
    hard:       { startLen: 4, maxLen: 12, speed: 400, colors: 6 },
    extreme:    { startLen: 5, maxLen: 14, speed: 300, colors: 6 },
    impossible: { startLen: 6, maxLen: 16, speed: 220, colors: 8 }
  };
  return { ...(configs[d] || configs.medium), difficulty: d };
}

const SIMON_COLORS = [
  { name: 'Red',    bg: '#e74c3c', glow: '#ff6b6b', freq: 329.63 },
  { name: 'Blue',   bg: '#3498db', glow: '#5dade2', freq: 440.00 },
  { name: 'Green',  bg: '#2ecc71', glow: '#58d68d', freq: 554.37 },
  { name: 'Yellow', bg: '#f1c40f', glow: '#f9e154', freq: 659.25 },
  { name: 'Purple', bg: '#9b59b6', glow: '#bb8fce', freq: 783.99 },
  { name: 'Orange', bg: '#e67e22', glow: '#f0a04b', freq: 880.00 },
  { name: 'Teal',   bg: '#1abc9c', glow: '#48c9b0', freq: 987.77 },
  { name: 'Pink',   bg: '#e91e63', glow: '#f06292', freq: 1046.50 }
];

function renderSimon(puzzle) {
  document.getElementById('btn-submit-challenge').style.display = 'none';

  const sequence = [];
  for (let i = 0; i < puzzle.startLen; i++) {
    sequence.push(rngInt(0, puzzle.colors - 1));
  }

  GS.challengeState.simon = {
    puzzle,
    sequence,
    playerInput: [],
    round: 1,
    maxRound: puzzle.maxLen - puzzle.startLen + 1,
    playing: false,
    inputEnabled: false,
    gameOver: false,
    score: 0
  };

  drawSimon();
  setTimeout(() => playSimonSequence(), 800);
}

function drawSimon() {
  const st = GS.challengeState.simon;
  const c = document.getElementById('game-container');
  const colorCount = st.puzzle.colors;

  let html = '<div class="simon-container">';
  html += `<div class="simon-stats">`;
  html += `<span>Round: <strong>${st.round}</strong></span>`;
  html += `<span>Sequence: <strong>${st.sequence.length}</strong></span>`;
  html += `</div>`;

  html += `<div class="simon-status" id="simon-status">Watch the pattern...</div>`;

  // Build grid — 2 columns for 4 colors, 3 for 6, 4 for 8
  const cols = colorCount <= 4 ? 2 : colorCount <= 6 ? 3 : 4;
  html += `<div class="simon-grid" style="grid-template-columns:repeat(${cols},1fr)">`;
  for (let i = 0; i < colorCount; i++) {
    const col = SIMON_COLORS[i];
    html += `<button class="simon-btn" id="simon-btn-${i}" data-idx="${i}"
      style="background:${col.bg}"
      onclick="simonPlayerTap(${i})" disabled>${col.name}</button>`;
  }
  html += '</div>';

  html += '<div class="simon-msg" id="simon-msg"></div>';
  html += '</div>';
  c.innerHTML = html;
}

function playSimonSequence() {
  const st = GS.challengeState.simon;
  if (st.gameOver) return;

  st.inputEnabled = false;
  st.playing = true;
  st.playerInput = [];

  const status = document.getElementById('simon-status');
  if (status) status.textContent = 'Watch the pattern...';

  // Disable all buttons during playback
  document.querySelectorAll('.simon-btn').forEach(b => b.disabled = true);

  let i = 0;
  const speed = st.puzzle.speed;

  function playNext() {
    if (i >= st.sequence.length) {
      st.playing = false;
      st.inputEnabled = true;
      document.querySelectorAll('.simon-btn').forEach(b => b.disabled = false);
      if (status) status.textContent = 'Your turn! Repeat the pattern';
      return;
    }

    const colorIdx = st.sequence[i];
    highlightSimonBtn(colorIdx, speed * 0.7);
    i++;
    setTimeout(playNext, speed);
  }

  setTimeout(playNext, 400);
}

function highlightSimonBtn(idx, duration) {
  const btn = document.getElementById('simon-btn-' + idx);
  if (!btn) return;
  const col = SIMON_COLORS[idx];
  btn.style.background = col.glow;
  btn.style.transform = 'scale(1.08)';
  btn.style.boxShadow = `0 0 20px ${col.glow}, 0 0 40px ${col.bg}`;
  btn.classList.add('simon-flash');

  // Play tone
  simonPlayTone(col.freq, duration / 1000);

  setTimeout(() => {
    btn.style.background = col.bg;
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '';
    btn.classList.remove('simon-flash');
  }, duration);
}

function simonPlayTone(freq, dur) {
  try {
    if (!SFX._ctx) SFX.init();
    const ctx = SFX._ctx;
    if (!ctx || SFX._muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch(e) {}
}

function simonPlayerTap(idx) {
  const st = GS.challengeState.simon;
  if (!st.inputEnabled || st.gameOver || st.playing) return;

  const col = SIMON_COLORS[idx];
  highlightSimonBtn(idx, 200);

  st.playerInput.push(idx);

  const pos = st.playerInput.length - 1;
  if (st.playerInput[pos] !== st.sequence[pos]) {
    // Wrong!
    st.gameOver = true;
    st.inputEnabled = false;
    SFX.wrong();
    document.querySelectorAll('.simon-btn').forEach(b => b.disabled = true);

    const status = document.getElementById('simon-status');
    if (status) { status.textContent = 'Wrong! Game over'; status.style.color = 'var(--red)'; }

    setTimeout(() => endSimon(), 1000);
    return;
  }

  if (st.playerInput.length === st.sequence.length) {
    // Completed this round!
    st.inputEnabled = false;
    st.score++;
    SFX.correct();
    document.querySelectorAll('.simon-btn').forEach(b => b.disabled = true);

    const status = document.getElementById('simon-status');
    if (status) { status.textContent = 'Correct!'; status.style.color = 'var(--green)'; }

    // Check if we've reached max
    if (st.sequence.length >= st.puzzle.maxLen) {
      st.gameOver = true;
      setTimeout(() => endSimon(), 800);
      return;
    }

    // Add new color to sequence
    st.sequence.push(rngInt(0, st.puzzle.colors - 1));
    st.round++;
    st.playerInput = [];

    setTimeout(() => {
      drawSimon();
      setTimeout(() => playSimonSequence(), 600);
    }, 1000);
  }
}

function endSimon() {
  const st = GS.challengeState.simon;
  const totalRounds = st.puzzle.maxLen - st.puzzle.startLen + 1;
  const score = Math.min(100, Math.round((st.score / totalRounds) * 100));

  GS.results.simon = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('simon', score);
    lsSet('daily-simon-state-' + getDailyDateStr(), {
      roundsCompleted: st.score, totalRounds, seqLength: st.sequence.length
    });
  }

  showChallengeSummary({
    emoji: score >= 80 ? '🧠' : score >= 50 ? '🔔' : '😵',
    score,
    title: score === 100 ? 'Perfect Memory!' : score >= 80 ? 'Impressive!' : score >= 50 ? 'Good Try!' : 'Keep Practicing!',
    stats: [
      { label: 'Rounds completed', value: st.score },
      { label: 'Max sequence', value: st.sequence.length },
      { label: 'Colors', value: st.puzzle.colors },
      { label: 'Speed', value: st.puzzle.speed + 'ms' }
    ]
  });
}
