// ==================== ACHIEVEMENTS ====================

const ACHIEVEMENTS = [
  { id: 'first_game',    icon: '🎮', name: 'First Steps',      desc: 'Complete your first challenge' },
  { id: 'perfect_score', icon: '💯', name: 'Perfectionist',    desc: 'Score 100 on any challenge' },
  { id: 'full_sprint',   icon: '🏃', name: 'Full Sprint',      desc: 'Complete all challenges in one session' },
  { id: 'streak_3',      icon: '🔥', name: 'On Fire',          desc: 'Reach a 3-day daily streak' },
  { id: 'streak_7',      icon: '⚡', name: 'Unstoppable',      desc: 'Reach a 7-day daily streak' },
  { id: 'streak_30',     icon: '🏆', name: 'Monthly Master',   desc: 'Reach a 30-day daily streak' },
  { id: 'games_10',      icon: '🎯', name: 'Dedicated',        desc: 'Play 10 sessions' },
  { id: 'games_50',      icon: '🧠', name: 'Brain Athlete',    desc: 'Play 50 sessions' },
  { id: 'games_100',     icon: '👑', name: 'Sprint Legend',     desc: 'Play 100 sessions' },
  { id: 'speed_5min',    icon: '⏱️', name: 'Speed Demon',      desc: 'Finish a full sprint under 5 minutes' },
  { id: 'impossible_win',icon: '💀', name: 'Impossible Victor', desc: 'Score 80+ on impossible difficulty' },
  { id: 'all_perfect',   icon: '✨', name: 'Flawless Sprint',  desc: 'Score 100 on every challenge in a session' },
  { id: 'score_1000',    icon: '📈', name: 'High Roller',      desc: 'Score 1000+ in a single session' },
  { id: 'daily_complete',icon: '📅', name: 'Daily Driver',     desc: 'Complete all daily challenges in one day' },
  { id: 'night_owl',     icon: '🦉', name: 'Night Owl',        desc: 'Play after midnight' }
];

function getAchievements() { return lsGet('achievements', {}); }
function saveAchievements(a) { lsSet('achievements', a); }

function unlockAchievement(id) {
  const achs = getAchievements();
  if (achs[id]) return false; // Already unlocked
  achs[id] = { date: getDailyDateStr(), time: Date.now() };
  saveAchievements(achs);
  const def = ACHIEVEMENTS.find(a => a.id === id);
  if (def) showAchievementPopup(def);
  return true;
}

function showAchievementPopup(def) {
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `<span class="ach-icon">${def.icon}</span><div><div class="ach-label">Achievement Unlocked!</div><div class="ach-name">${def.name}</div></div>`;
  document.body.appendChild(popup);
  SFX.streak();
  setTimeout(() => { popup.classList.add('ach-exit'); setTimeout(() => popup.remove(), 400); }, 3000);
}

function checkAchievements(finalScore) {
  const stats = getStats();

  // First game
  if (stats.played >= 1) unlockAchievement('first_game');

  // Perfect score
  const results = GS.results;
  if (Object.values(results).some(s => s === 100)) unlockAchievement('perfect_score');

  // Full sprint
  if (GS.selectedChallenges.length === CHALLENGE_ORDER.length) unlockAchievement('full_sprint');

  // All perfect in session
  if (GS.selectedChallenges.length > 1 && Object.values(results).every(s => s === 100)) unlockAchievement('all_perfect');

  // Streaks
  if (stats.streak >= 3) unlockAchievement('streak_3');
  if (stats.streak >= 7) unlockAchievement('streak_7');
  if (stats.streak >= 30) unlockAchievement('streak_30');

  // Games played
  if (stats.played >= 10) unlockAchievement('games_10');
  if (stats.played >= 50) unlockAchievement('games_50');
  if (stats.played >= 100) unlockAchievement('games_100');

  // Speed demon: full sprint under 5 min
  if (GS.selectedChallenges.length === CHALLENGE_ORDER.length && GS.timerElapsed < 300000) {
    unlockAchievement('speed_5min');
  }

  // Impossible win (80+ on impossible)
  if (GS.difficulty === 'impossible') {
    const avg = Object.values(results).reduce((s, v) => s + v, 0) / Object.values(results).length;
    if (avg >= 80) unlockAchievement('impossible_win');
  }

  // High roller (1000+ score in session)
  if (finalScore >= 1000) unlockAchievement('score_1000');

  // Daily complete (all daily challenges done)
  if (GS.mode === 'daily') {
    const daily = getDailyCompletion();
    if (CHALLENGE_ORDER.every(ch => daily[ch] !== undefined)) unlockAchievement('daily_complete');
  }

  // Night owl
  if (new Date().getHours() >= 0 && new Date().getHours() < 5) unlockAchievement('night_owl');
}

function renderAchievementsSection() {
  const achs = getAchievements();
  const unlocked = ACHIEVEMENTS.filter(a => achs[a.id]);
  const locked = ACHIEVEMENTS.filter(a => !achs[a.id]);

  let html = '<div class="section-sub" style="margin-top:20px">Achievements (' + unlocked.length + '/' + ACHIEVEMENTS.length + ')</div>';
  html += '<div class="ach-grid">';
  unlocked.forEach(a => {
    html += `<div class="ach-card unlocked"><span class="ach-card-icon">${a.icon}</span><div class="ach-card-name">${a.name}</div><div class="ach-card-desc">${a.desc}</div></div>`;
  });
  locked.forEach(a => {
    html += `<div class="ach-card locked"><span class="ach-card-icon">🔒</span><div class="ach-card-name">???</div><div class="ach-card-desc">${a.desc}</div></div>`;
  });
  html += '</div>';
  return html;
}
