// ==================== CORE ====================

// --- PRNG (Mulberry32) ---
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = Math.imul(31, h) + s.charCodeAt(i) | 0; }
  return h;
}
function getDailyDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// --- State ---
const GS = {
  mode: 'daily', // daily | practice
  difficulty: null,
  selectedChallenges: [],
  currentChallengeIdx: 0,
  timerStart: 0,
  timerElapsed: 0,
  timerRunning: false,
  timerRAF: null,
  results: {},
  rng: null,
  screenStack: ['screen-landing'],
  challengeState: {},
  attempts: {},
};
const MULTIPLIERS = { easy: 1, medium: 1.5, hard: 2, extreme: 3 };
const CHALLENGE_NAMES = { blocks:'Logic Blocks', economy:'Tiny Economy', paradox:'Mini Paradox', escape:'Escape Puzzle', wordsearch:'Word Search', wordro:'Decipher', numgrid:'Number Grid', wordhive:'Word Bloom', pulse:'Perfect Pulse', deduction:'Deduction', memory:'Memory Flip', maze:'Maze Runner', mosaic:'Mosaic', numcrunch:'Number Crunch' };
const CHALLENGE_ICONS = { blocks:'🧩', economy:'📊', paradox:'🤔', escape:'🚪', wordsearch:'🔠', wordro:'🔐', numgrid:'🔢', wordhive:'🌼', pulse:'💗', deduction:'🕵️', memory:'🃏', maze:'🌀', mosaic:'🎨', numcrunch:'🧮' };
const CHALLENGE_ORDER = ['blocks','economy','paradox','escape','wordsearch','wordro','numgrid','wordhive','pulse','deduction','memory','maze','mosaic','numcrunch'];
const COMPLETED_REVIEW_HANDLERS = {};

// --- localStorage ---
function lsGet(k, def) { try { const v = localStorage.getItem('bs-'+k); return v ? JSON.parse(v) : def; } catch { return def; } }
function lsSet(k, v) { try { localStorage.setItem('bs-'+k, JSON.stringify(v)); } catch { if (!window._bsStorageWarned) { window._bsStorageWarned = true; showToast('Storage unavailable — progress won\'t be saved in private browsing'); } } }
function getDailyCompletion() { return lsGet('daily-'+getDailyDateStr(), {}); }
function setDailyCompletion(ch, score) {
  const d = getDailyCompletion();
  d[ch] = score;
  lsSet('daily-'+getDailyDateStr(), d);
}
// --- Challenge Summary Helper ---
function showChallengeSummary(config) {
  // config: { emoji, score, title, stats: [{label, value}], miniReview?, answerReveal?, difficulty? }
  const c = document.getElementById('game-container');
  const diff = config.difficulty || GS.difficulty;
  const diffLabel = diff ? diff.charAt(0).toUpperCase() + diff.slice(1) : '';
  let html = '<div class="cs-panel">';
  html += `<span class="cs-emoji">${config.emoji}</span>`;
  html += `<div class="cs-score">${config.score}<span>/100</span></div>`;
  if (config.title) html += `<div class="cs-title">${config.title}</div>`;
  if (diffLabel) html += `<div class="cs-diff-badge ${diff}">${diffLabel}</div>`;
  if (config.stats && config.stats.length > 0) {
    html += '<div class="cs-stats">';
    config.stats.forEach(s => {
      html += `<div class="cs-stat-row"><span class="cs-stat-label">${s.label}</span><span class="cs-stat-value">${s.value}</span></div>`;
    });
    html += '</div>';
  }
  if (config.miniReview) {
    html += `<div class="cs-mini-review">${config.miniReview}</div>`;
  }
  if (config.answerReveal) {
    html += `<div class="cs-answer">${config.answerReveal}</div>`;
  }
  html += `<button class="btn btn-primary btn-lg btn-full" style="margin-top:16px" onclick="showNextOrFinish()">Continue →</button>`;
  html += '</div>';
  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'none';
  // Screen flash + confetti based on score
  if (config.score === 100) { screenFlash('gold'); launchConfetti(60); }
  else if (config.score >= 60) screenFlash('green');
  else if (config.score === 0) screenFlash('red');
}

function getStats() { return lsGet('stats', { played:0, totalScore:0, bestScore:0, streak:0, maxStreak:0, lastDate:null }); }
function saveStats(s) { lsSet('stats', s); }
function getHistory() { return lsGet('history', []); }
function addHistory(entry) {
  const h = getHistory();
  h.unshift(entry);
  if (h.length > 30) h.length = 30;
  lsSet('history', h);
}
function getPrefs() { return lsGet('prefs', { theme:'light', lastDiff:'medium' }); }
function savePrefs(p) { lsSet('prefs', p); }

// --- Theme ---
function initTheme() {
  const p = getPrefs();
  if (p.theme === 'dark') document.body.classList.add('dark');
}
function toggleTheme() {
  document.body.classList.toggle('dark');
  const p = getPrefs();
  p.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  savePrefs(p);
}

// --- Timer ---
function startTimer() {
  GS.timerStart = performance.now();
  GS.timerRunning = true;
  GS.timerElapsed = 0;
  document.getElementById('timer-display').style.display = 'block';
  updateTimer();
}
function updateTimer() {
  if (!GS.timerRunning) return;
  GS.timerElapsed = performance.now() - GS.timerStart;
  document.getElementById('timer-display').textContent = formatTime(GS.timerElapsed);
  GS.timerRAF = requestAnimationFrame(updateTimer);
}
function stopTimer() {
  GS.timerRunning = false;
  if (GS.timerRAF) cancelAnimationFrame(GS.timerRAF);
  document.getElementById('timer-display').textContent = formatTime(GS.timerElapsed);
}
function pauseTimer() {
  if (!GS.timerRunning) return;
  GS.timerRunning = false;
  GS.timerElapsed = performance.now() - GS.timerStart;
  if (GS.timerRAF) cancelAnimationFrame(GS.timerRAF);
}
function resumeTimer() {
  if (GS.timerRunning) return;
  GS.timerStart = performance.now() - GS.timerElapsed;
  GS.timerRunning = true;
  updateTimer();
}
function formatTime(ms) {
  const totalSec = ms / 1000;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec.toFixed(2)}`;
}

// --- Screen Management ---
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  // Back button
  const backBtn = document.getElementById('btn-back');
  backBtn.style.display = (id === 'screen-landing') ? 'none' : 'block';
  // Timer visibility
  const timer = document.getElementById('timer-display');
  if (id === 'screen-game') timer.style.display = 'block';
  else if (id !== 'screen-results') timer.style.display = 'none';
  // Landing particles
  if (id === 'screen-landing') startLandingParticles();
  else stopLandingParticles();
}
function goBack() {
  if (GS.screenStack.length > 1) {
    GS.screenStack.pop();
    const prev = GS.screenStack[GS.screenStack.length - 1];
    showScreen(prev);
  }
}
function navigateTo(id) {
  GS.screenStack.push(id);
  showScreen(id);
}

// --- Confetti Engine ---
function launchConfetti(count = 80) {
  const colors = ['#6366f1','#818cf8','#ec4899','#f59e0b','#6aaa64','#c9b458','#a855f7'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const size = Math.random() * 8 + 4;
    const isCircle = Math.random() > 0.5;
    el.style.cssText = `
      left:${Math.random()*100}vw;
      width:${size}px;height:${isCircle ? size : size*1.5}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${isCircle ? '50%' : '2px'};
      --fall-duration:${1.8 + Math.random()*1.5}s;
      --spin:${360 + Math.random()*720}deg;
      animation-delay:${Math.random()*0.4}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

// --- Screen Flash ---
function screenFlash(type) {
  // type: 'gold', 'green', 'red'
  const el = document.createElement('div');
  el.className = 'screen-flash ' + type;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 700);
}

// --- Landing Particle System ---
let _particleRAF = null;
function startLandingParticles() {
  let canvas = document.getElementById('landing-particles');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'landing-particles';
    document.body.appendChild(canvas);
  }
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  const particles = [];
  const count = 30;
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#6366f1';
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    // Draw particles
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = accent;
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    _particleRAF = requestAnimationFrame(draw);
  }
  draw();
}
function stopLandingParticles() {
  if (_particleRAF) { cancelAnimationFrame(_particleRAF); _particleRAF = null; }
  const canvas = document.getElementById('landing-particles');
  if (canvas) canvas.style.display = 'none';
}

// --- Button Ripple ---
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 550);
});

// --- Toast ---
function showToast(msg, duration=2000) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('toast-exit'); setTimeout(() => t.remove(), 300); }, duration - 300);
}

// --- Seed setup ---
function setupRNG() {
  if (GS.mode === 'daily') {
    GS.rng = mulberry32(hashStr(getDailyDateStr()));
  } else {
    GS.rng = mulberry32(Date.now());
  }
}
// Utility: pick random item
function rngPick(arr) { return arr[Math.floor(GS.rng() * arr.length)]; }
function rngShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(GS.rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function rngInt(min, max) { return Math.floor(GS.rng() * (max - min + 1)) + min; }
function rngFloat(min, max) { return GS.rng() * (max - min) + min; }

// --- Navigation handlers ---
function selectMode(mode) {
  GS.mode = mode;
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('mode-' + mode).classList.add('selected');
}

function goToDifficulty() {
  navigateTo('screen-difficulty');
  // Pre-select last difficulty
  const prefs = getPrefs();
  if (prefs.lastDiff) selectDifficulty(prefs.lastDiff);
}

function selectDifficulty(diff) {
  GS.difficulty = diff;
  document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`[data-diff="${diff}"]`).classList.add('selected');
  document.getElementById('btn-to-challenges').disabled = false;
  const p = getPrefs(); p.lastDiff = diff; savePrefs(p);
}

function goToChallengeSelect() {
  navigateTo('screen-challenge-select');
  GS.selectedChallenges = [];
  updateChallengeSelectUI();
}

function updateChallengeSelectUI() {
  const daily = getDailyCompletion();
  document.querySelectorAll('.challenge-card').forEach(c => {
    const ch = c.dataset.ch;
    c.classList.remove('selected','completed-today');
    if (GS.mode === 'daily' && daily[ch] !== undefined) {
      c.classList.add('completed-today');
    }
    if (GS.selectedChallenges.includes(ch)) c.classList.add('selected');
  });
  const fullSprint = document.getElementById('btn-full-sprint');
  if (GS.selectedChallenges.length === CHALLENGE_ORDER.length) {
    fullSprint.classList.add('selected');
    fullSprint.style.borderColor = 'var(--accent)';
    fullSprint.style.background = 'var(--accent-light)';
  } else {
    fullSprint.classList.remove('selected');
    fullSprint.style.borderColor = '';
    fullSprint.style.background = '';
  }
  document.getElementById('btn-start').disabled = GS.selectedChallenges.length === 0;
}

function toggleChallenge(ch) {
  if (GS.mode === 'daily') {
    const daily = getDailyCompletion();
    if (daily[ch] !== undefined) {
      showCompletedReview(ch, daily[ch]);
      return;
    }
  }
  const idx = GS.selectedChallenges.indexOf(ch);
  if (idx >= 0) GS.selectedChallenges.splice(idx, 1);
  else GS.selectedChallenges.push(ch);
  updateChallengeSelectUI();
}

function showCompletedReview(ch, score) {
  navigateTo('screen-game');
  document.getElementById('game-challenge-label').textContent = `${CHALLENGE_ICONS[ch]} ${CHALLENGE_NAMES[ch]}`;
  document.getElementById('game-progress-label').textContent = 'Completed';
  document.getElementById('btn-submit-challenge').style.display = 'none';
  document.getElementById('btn-next-challenge').style.display = 'none';
  const c = document.getElementById('game-container');
  c.innerHTML = `
    <div style="text-align:center;padding:40px 16px">
      <div style="font-size:48px;margin-bottom:12px">${CHALLENGE_ICONS[ch]}</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:4px">${CHALLENGE_NAMES[ch]}</div>
      <div style="font-size:14px;color:var(--fg2);margin-bottom:24px">Completed today — Score: ${score}/100</div>
      <button class="btn btn-primary btn-lg" id="btn-see-results" style="min-width:200px">See Puzzle Results</button>
      <button class="btn btn-secondary btn-lg" onclick="goToLanding()" style="min-width:200px;margin-top:10px">Back</button>
    </div>
  `;
  document.getElementById('btn-see-results').addEventListener('click', () => {
    showCompletedPuzzleResults(ch, score);
  });
}

function showCompletedPuzzleResults(ch, score) {
  const c = document.getElementById('game-container');
  // Check for custom full handler (e.g., wordro, numcrunch with interactive replay)
  if (COMPLETED_REVIEW_HANDLERS[ch] && COMPLETED_REVIEW_HANDLERS[ch](c, score)) return;
  // Try rich review from saved daily state
  const stateKey = 'daily-' + ch + '-state-' + getDailyDateStr();
  const saved = lsGet(stateKey, null);
  if (saved) {
    let reviewHtml = '<div class="cs-panel">';
    reviewHtml += `<span class="cs-emoji">${CHALLENGE_ICONS[ch]}</span>`;
    reviewHtml += `<div class="cs-score">${score}<span>/100</span></div>`;
    reviewHtml += `<div class="cs-title">${CHALLENGE_NAMES[ch]}</div>`;
    reviewHtml += '<div class="cs-stats">';
    if (ch === 'paradox') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Result</span><span class="cs-stat-value">${saved.correct ? '✅ Correct' : '❌ Incorrect'}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Answer</span><span class="cs-stat-value">${saved.options[saved.correctIdx]}</span></div>`;
      reviewHtml += '</div>';
      reviewHtml += `<div class="cs-mini-review"><div style="line-height:1.6">${saved.explanation}</div></div>`;
    } else if (ch === 'blocks') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Puzzle</span><span class="cs-stat-value">${saved.puzzleName}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Attempts</span><span class="cs-stat-value">${saved.attempts}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Steps</span><span class="cs-stat-value">${saved.correctOrder.length}</span></div>`;
      reviewHtml += '</div>';
    } else if (ch === 'economy') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Scenario</span><span class="cs-stat-value">${saved.puzzleName}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Attempts</span><span class="cs-stat-value">${saved.attempts}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Efficiency</span><span class="cs-stat-value">${saved.efficiency}%</span></div>`;
      reviewHtml += '</div>';
    } else if (ch === 'escape') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Optimal choices</span><span class="cs-stat-value">${saved.score / 20} / 5</span></div>`;
      reviewHtml += '</div>';
      if (saved.choices) {
        reviewHtml += '<div class="cs-mini-review">';
        saved.choices.forEach(c => {
          reviewHtml += `<div class="cs-choice"><span>${c.optimal ? '✓' : '✗'}</span><span style="flex:1">${c.text}</span></div>`;
        });
        reviewHtml += '</div>';
      }
    } else if (ch === 'wordsearch') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Words found</span><span class="cs-stat-value">${saved.foundWords.length} / ${saved.totalWords}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Theme</span><span class="cs-stat-value">${saved.theme}</span></div>`;
      reviewHtml += '</div>';
      const foundSet = new Set(saved.foundWords);
      reviewHtml += '<div class="cs-mini-review">' + saved.words.map(w =>
        `<span class="cs-tag ${foundSet.has(w) ? 'found' : 'missed'}">${w}</span>`
      ).join(' ') + '</div>';
    } else if (ch === 'numgrid') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Attempts</span><span class="cs-stat-value">${saved.attempts}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Grid size</span><span class="cs-stat-value">${saved.size}×${saved.size}</span></div>`;
      reviewHtml += '</div>';
    } else if (ch === 'wordhive') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Words found</span><span class="cs-stat-value">${saved.found.length} / ${saved.validWords.length}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Target</span><span class="cs-stat-value">${saved.target}</span></div>`;
      reviewHtml += '</div>';
      const missed = saved.validWords.filter(w => !saved.found.includes(w)).slice(0, 10);
      let tags = saved.found.map(w => `<span class="cs-tag found">${w}</span>`).join(' ');
      if (missed.length > 0) tags += `<div style="margin-top:8px;font-size:12px;color:var(--fg2);margin-bottom:4px">Missed:</div>` + missed.map(w => `<span class="cs-tag missed">${w}</span>`).join(' ');
      reviewHtml += '<div class="cs-mini-review">' + tags + '</div>';
    } else if (ch === 'pulse') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Rounds survived</span><span class="cs-stat-value">${saved.hits} / ${saved.targetHits}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Final speed</span><span class="cs-stat-value">${saved.speed}%/s</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Zone size</span><span class="cs-stat-value">${typeof saved.zoneSize === 'number' ? saved.zoneSize.toFixed(1) : saved.zoneSize}%</span></div>`;
      reviewHtml += '</div>';
    } else if (ch === 'deduction') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Result</span><span class="cs-stat-value">${saved.won ? '🕵️ Won' : '💀 Lost'}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Rounds</span><span class="cs-stat-value">${saved.rounds}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Saboteur</span><span class="cs-stat-value">${saved.saboteur.emoji} ${saved.saboteur.name}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Role / Trait</span><span class="cs-stat-value">${saved.saboteur.role} · ${saved.saboteur.trait}</span></div>`;
      reviewHtml += '</div>';
      if (saved.eliminations && saved.eliminations.length > 0) {
        reviewHtml += '<div class="cs-mini-review"><div style="font-size:12px;color:var(--fg2);margin-bottom:4px">Eliminations:</div>';
        saved.eliminations.forEach(e => {
          reviewHtml += `<div class="cs-choice"><span>${e.isSaboteur ? '✗' : '✓'}</span><span style="flex:1">${e.emoji} ${e.name} (${e.role})</span></div>`;
        });
        reviewHtml += '</div>';
      }
    } else if (ch === 'memory') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Pairs found</span><span class="cs-stat-value">${saved.pairsFound} / ${saved.totalPairs}</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Moves</span><span class="cs-stat-value">${saved.moves} (par: ${saved.parMoves})</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Combo bonus</span><span class="cs-stat-value">${saved.comboBonus} pts</span></div>`;
      reviewHtml += '</div>';
    } else if (ch === 'maze') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Steps</span><span class="cs-stat-value">${saved.steps} (optimal: ${saved.optimalSteps})</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Time</span><span class="cs-stat-value">${saved.elapsed}s</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Path efficiency</span><span class="cs-stat-value">${saved.pathEff} pts</span></div>`;
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Time bonus</span><span class="cs-stat-value">${saved.timeBonus} pts</span></div>`;
      reviewHtml += '</div>';
    } else if (ch === 'mosaic') {
      reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Zones correct</span><span class="cs-stat-value">${saved.correctZones} / ${saved.totalZones}</span></div>`;
      if (saved.attempts > 0) reviewHtml += `<div class="cs-stat-row"><span class="cs-stat-label">Retry penalty</span><span class="cs-stat-value">-${saved.attempts * 10} pts</span></div>`;
      reviewHtml += '</div>';
    } else {
      reviewHtml += '</div>';
    }
    reviewHtml += `<button class="btn btn-secondary btn-lg btn-full" style="margin-top:16px" onclick="goToLanding()">← Back</button>`;
    reviewHtml += '</div>';
    c.innerHTML = reviewHtml;
    return;
  }

  // Fallback for missing saved state
  const fallbackMsg = (ch === 'wordro')
    ? 'Puzzle data not available — completed before review feature was added.'
    : 'Completed today';
  c.innerHTML = `
    <div style="text-align:center;padding:40px 16px">
      <div style="font-size:48px;margin-bottom:12px">${CHALLENGE_ICONS[ch]}</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:8px">${CHALLENGE_NAMES[ch]}</div>
      <div style="font-size:48px;font-weight:800;color:${score >= 60 ? 'var(--green)' : 'var(--orange)'};margin-bottom:8px">${score}/100</div>
      <div style="font-size:14px;color:var(--fg2);margin-bottom:24px">${fallbackMsg}</div>
      <button class="btn btn-secondary btn-lg" onclick="goToLanding()" style="min-width:200px">← Back</button>
    </div>
  `;
}

function selectFullSprint() {
  const daily = GS.mode === 'daily' ? getDailyCompletion() : {};
  GS.selectedChallenges = CHALLENGE_ORDER.filter(ch => daily[ch] === undefined);
  updateChallengeSelectUI();
}

function goToLanding() {
  stopTimer();
  document.getElementById('timer-display').style.display = 'none';
  GS.selectedChallenges = [];
  GS.screenStack = ['screen-landing', 'screen-difficulty', 'screen-challenge-select'];
  showScreen('screen-challenge-select');
  updateChallengeSelectUI();
}
