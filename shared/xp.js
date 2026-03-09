// ==================== XP & LEVELING SYSTEM ====================

const XP_LEVELS = [
  { level: 1,  xp: 0,     title: 'Beginner',        color: '#94a3b8' },
  { level: 2,  xp: 100,   title: 'Novice',           color: '#6366f1' },
  { level: 3,  xp: 300,   title: 'Learner',          color: '#818cf8' },
  { level: 4,  xp: 600,   title: 'Thinker',          color: '#22c55e' },
  { level: 5,  xp: 1000,  title: 'Puzzler',          color: '#16a34a' },
  { level: 6,  xp: 1600,  title: 'Scholar',          color: '#0ea5e9' },
  { level: 7,  xp: 2400,  title: 'Strategist',       color: '#0284c7' },
  { level: 8,  xp: 3500,  title: 'Expert',           color: '#a855f7' },
  { level: 9,  xp: 5000,  title: 'Master',           color: '#9333ea' },
  { level: 10, xp: 7000,  title: 'Grandmaster',      color: '#f59e0b' },
  { level: 11, xp: 10000, title: 'Genius',            color: '#ea580c' },
  { level: 12, xp: 14000, title: 'Prodigy',           color: '#dc2626' },
  { level: 13, xp: 20000, title: 'Legend',             color: '#ec4899' },
  { level: 14, xp: 28000, title: 'Mythic',             color: '#db2777' },
  { level: 15, xp: 40000, title: 'Transcendent',       color: '#f97316' }
];

function getXPData() {
  return lsGet('xp-data', { totalXP: 0, level: 1 });
}

function saveXPData(data) {
  lsSet('xp-data', data);
}

function getCurrentLevel(totalXP) {
  let current = XP_LEVELS[0];
  for (const lvl of XP_LEVELS) {
    if (totalXP >= lvl.xp) current = lvl;
    else break;
  }
  return current;
}

function getNextLevel(currentLevel) {
  const idx = XP_LEVELS.findIndex(l => l.level === currentLevel.level);
  return idx < XP_LEVELS.length - 1 ? XP_LEVELS[idx + 1] : null;
}

function calculateXP(score, difficulty, challengeCount) {
  // Base XP = score
  let xp = score;
  // Difficulty bonus
  const diffMultiplier = { easy: 1, medium: 1.3, hard: 1.6, extreme: 2, impossible: 3 };
  xp *= (diffMultiplier[difficulty] || 1);
  // Multi-challenge bonus
  if (challengeCount >= 5) xp *= 1.2;
  if (challengeCount >= 15) xp *= 1.3;
  if (challengeCount >= 30) xp *= 1.5;
  return Math.round(xp);
}

function awardXP(score, difficulty, challengeCount) {
  const xpEarned = calculateXP(score, difficulty, challengeCount);
  const data = getXPData();
  const oldLevel = getCurrentLevel(data.totalXP);
  data.totalXP += xpEarned;
  const newLevel = getCurrentLevel(data.totalXP);
  data.level = newLevel.level;
  saveXPData(data);

  if (newLevel.level > oldLevel.level) {
    showLevelUpPopup(newLevel);
  }

  return { xpEarned, totalXP: data.totalXP, level: newLevel, oldLevel };
}

function showLevelUpPopup(level) {
  const popup = document.createElement('div');
  popup.className = 'levelup-popup';
  popup.innerHTML = `
    <div class="levelup-glow" style="--level-color:${level.color}"></div>
    <div class="levelup-content">
      <div class="levelup-icon">⬆️</div>
      <div class="levelup-label">LEVEL UP!</div>
      <div class="levelup-level" style="color:${level.color}">Level ${level.level}</div>
      <div class="levelup-title">${level.title}</div>
    </div>
  `;
  document.body.appendChild(popup);
  SFX.win();
  launchConfetti(80);
  setTimeout(() => { popup.classList.add('levelup-exit'); setTimeout(() => popup.remove(), 500); }, 3500);
}

function renderXPBar() {
  const data = getXPData();
  const current = getCurrentLevel(data.totalXP);
  const next = getNextLevel(current);
  const xpInLevel = data.totalXP - current.xp;
  const xpForLevel = next ? (next.xp - current.xp) : 1;
  const progress = next ? Math.min(100, (xpInLevel / xpForLevel) * 100) : 100;

  return `<div class="xp-bar-container">
    <div class="xp-level-badge" style="background:${current.color}">Lv.${current.level}</div>
    <div class="xp-info">
      <div class="xp-title-row">
        <span class="xp-title">${current.title}</span>
        <span class="xp-amount">${data.totalXP.toLocaleString()} XP</span>
      </div>
      <div class="xp-track">
        <div class="xp-fill" style="width:${progress}%;background:${current.color}"></div>
      </div>
      ${next ? `<div class="xp-next">${next.xp - data.totalXP} XP to ${next.title}</div>` : '<div class="xp-next">MAX LEVEL</div>'}
    </div>
  </div>`;
}
