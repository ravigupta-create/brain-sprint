// ==================== CHALLENGE 9: PERFECT PULSE ====================

function getPulsePuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:    { startZone: 35, startSpeed: 55, zoneShrink: 0.90, speedMult: 1.06, targetHits: 8 },
    medium:  { startZone: 28, startSpeed: 75, zoneShrink: 0.88, speedMult: 1.08, targetHits: 10 },
    hard:    { startZone: 22, startSpeed: 95, zoneShrink: 0.86, speedMult: 1.10, targetHits: 13 },
    extreme: { startZone: 16, startSpeed: 115, zoneShrink: 0.84, speedMult: 1.12, targetHits: 16 }
  };
  return configs[d] || configs.medium;
}

function renderPulse(puzzle) {
  const c = document.getElementById('game-container');
  let ticksHtml = '';
  for (let i = 0; i <= 20; i++) ticksHtml += '<div class="pulse-track-tick"></div>';

  c.innerHTML = `
    <div style="padding:16px 0">
      <div class="pulse-stats">
        <div><span class="pulse-round" id="pulse-round">Round 1</span></div>
        <div class="pulse-speed" id="pulse-speed">${puzzle.startSpeed}%/s</div>
      </div>
      <div class="pulse-track" id="pulse-track">
        <div class="pulse-track-ticks">${ticksHtml}</div>
        <div class="pulse-zone pulse-zone-glow" id="pulse-zone"></div>
        <div class="pulse-cursor" id="pulse-cursor"></div>
      </div>
      <div class="pulse-tap-area" id="pulse-tap-area">
        Tap or press Space to lock in
      </div>
    </div>`;

  const zoneStart = 20 + Math.random() * (80 - puzzle.startZone - 20);
  GS.challengeState.pulse = {
    puzzle,
    position: 50,
    direction: 1,
    speed: puzzle.startSpeed,
    zoneStart: zoneStart,
    zoneSize: puzzle.startZone,
    hits: 0,
    gameOver: false,
    waiting: false,
    lastTime: null,
    rafId: null
  };

  updatePulseVisuals();

  // Bind input — cleanup old handler first
  if (GS.challengeState.pulse._keyHandler) document.removeEventListener('keydown', GS.challengeState.pulse._keyHandler);
  const tapArea = document.getElementById('pulse-tap-area');
  tapArea.addEventListener('click', hitPulse);
  const keyHandler = (e) => { if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); hitPulse(); } };
  document.addEventListener('keydown', keyHandler);
  GS.challengeState.pulse._keyHandler = keyHandler;

  // Start after a brief moment
  setTimeout(() => startPulseGame(), 400);
}

function updatePulseVisuals() {
  const st = GS.challengeState.pulse;
  const track = document.getElementById('pulse-track');
  if (!track) return;
  const zone = document.getElementById('pulse-zone');
  const cursor = document.getElementById('pulse-cursor');

  zone.style.left = st.zoneStart + '%';
  zone.style.width = st.zoneSize + '%';
  cursor.style.left = st.position + '%';
}

function startPulseGame() {
  const st = GS.challengeState.pulse;
  if (st.gameOver) return;
  st.lastTime = null;
  st.rafId = requestAnimationFrame(animatePulse);
}

function animatePulse(timestamp) {
  const st = GS.challengeState.pulse;
  if (!st || st.gameOver || st.waiting) return;

  if (st.lastTime === null) { st.lastTime = timestamp; st.rafId = requestAnimationFrame(animatePulse); return; }

  const dt = (timestamp - st.lastTime) / 1000;
  st.lastTime = timestamp;

  // Move cursor: speed is in %/s
  st.position += st.direction * st.speed * dt;

  // Bounce at edges (2% padding)
  if (st.position >= 98) { st.position = 98; st.direction = -1; }
  if (st.position <= 2) { st.position = 2; st.direction = 1; }

  // Update cursor visual
  const cursor = document.getElementById('pulse-cursor');
  if (cursor) cursor.style.left = st.position + '%';

  st.rafId = requestAnimationFrame(animatePulse);
}

function hitPulse() {
  const st = GS.challengeState.pulse;
  if (!st || st.gameOver || st.waiting) return;

  const inZone = st.position >= st.zoneStart && st.position <= st.zoneStart + st.zoneSize;

  if (inZone) {
    showPulseHit();
  } else {
    endPulseGame();
  }
}

function showPulseHit() {
  const st = GS.challengeState.pulse;
  st.waiting = true;
  st.hits++;

  // Flash feedback
  const track = document.getElementById('pulse-track');
  const zone = document.getElementById('pulse-zone');
  const roundEl = document.getElementById('pulse-round');
  const speedEl = document.getElementById('pulse-speed');

  if (track) { track.classList.add('pulse-hit-flash'); setTimeout(() => track.classList.remove('pulse-hit-flash'), 400); }
  if (zone) { zone.classList.add('pulse-hit-pop'); setTimeout(() => zone.classList.remove('pulse-hit-pop'), 300); }

  // Update round display with count-up animation
  if (roundEl) { roundEl.textContent = `Round ${st.hits + 1}`; roundEl.classList.add('pulse-counter-up'); setTimeout(() => roundEl.classList.remove('pulse-counter-up'), 300); }

  // Shrink zone + increase speed
  st.zoneSize = Math.max(4, st.zoneSize * st.puzzle.zoneShrink);
  st.speed = st.speed * st.puzzle.speedMult;

  // Reposition zone randomly (keep within bounds)
  const maxStart = 96 - st.zoneSize;
  st.zoneStart = 4 + Math.random() * (maxStart - 4);

  // Update speed display
  if (speedEl) speedEl.textContent = Math.round(st.speed) + '%/s';

  // Update zone visual
  updatePulseVisuals();

  // Resume after pause
  setTimeout(() => {
    if (st.gameOver) return;
    st.waiting = false;
    st.lastTime = null;
    st.rafId = requestAnimationFrame(animatePulse);
  }, 400);
}

function endPulseGame() {
  const st = GS.challengeState.pulse;
  st.gameOver = true;
  st.waiting = true;
  if (st.rafId) cancelAnimationFrame(st.rafId);

  // Remove input handlers
  if (st._keyHandler) { document.removeEventListener('keydown', st._keyHandler); st._keyHandler = null; }

  // Miss feedback
  const track = document.getElementById('pulse-track');
  if (track) { track.classList.add('pulse-miss-flash'); }
  const cursor = document.getElementById('pulse-cursor');
  if (cursor) { cursor.style.background = 'var(--red)'; cursor.style.boxShadow = '0 0 8px var(--red), 0 0 16px rgba(231,76,60,0.4)'; }

  // Calculate score
  const score = Math.min(100, Math.round(100 * st.hits / st.puzzle.targetHits));
  GS.results.pulse = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('pulse', score);
    lsSet('daily-pulse-state-'+getDailyDateStr(), { hits: st.hits, targetHits: st.puzzle.targetHits, speed: Math.round(st.speed), zoneSize: st.zoneSize });
  }

  // Show results after a beat
  setTimeout(() => {
    if (!document.getElementById('game-container')) return;
    showChallengeSummary({
      emoji: score >= 80 ? '🎯' : score >= 50 ? '💗' : '💔',
      score,
      title: score >= 80 ? 'Sharp Reflexes!' : score >= 50 ? 'Good Timing!' : 'Too Slow!',
      stats: [
        { label: 'Rounds survived', value: `${st.hits} / ${st.puzzle.targetHits}` },
        { label: 'Final speed', value: `${Math.round(st.speed)}%/s` },
        { label: 'Zone size', value: `${st.zoneSize.toFixed(1)}%` }
      ]
    });
  }, 800);
}

