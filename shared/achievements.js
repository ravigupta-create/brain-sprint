// ==================== ACHIEVEMENTS ====================

const ACHIEVEMENTS = [
  // Milestones
  { id: 'first_game',    icon: '🎮', name: 'First Steps',        desc: 'Complete your first challenge' },
  { id: 'games_10',      icon: '🎯', name: 'Dedicated',          desc: 'Play 10 sessions' },
  { id: 'games_50',      icon: '🧠', name: 'Brain Athlete',      desc: 'Play 50 sessions' },
  { id: 'games_100',     icon: '👑', name: 'Sprint Legend',       desc: 'Play 100 sessions' },
  // Scores
  { id: 'perfect_score', icon: '💯', name: 'Perfectionist',      desc: 'Score 100 on any challenge' },
  { id: 'all_perfect',   icon: '✨', name: 'Flawless Sprint',    desc: 'Score 100 on every challenge in a session' },
  { id: 'score_1000',    icon: '📈', name: 'High Roller',        desc: 'Score 1000+ in a single session' },
  { id: 'score_5000',    icon: '💰', name: 'Score Machine',      desc: 'Score 5000+ in a single session' },
  { id: 'triple_perfect',icon: '🌟', name: 'Hat Trick',          desc: 'Get 3 perfect scores in one session' },
  // Sprints
  { id: 'full_sprint',   icon: '🏃', name: 'Full Sprint',        desc: 'Complete all 30 challenges in one session' },
  { id: 'speed_5min',    icon: '⏱️', name: 'Speed Demon',        desc: 'Finish a full sprint under 5 minutes' },
  { id: 'speed_10min',   icon: '🚀', name: 'Rocket Pace',        desc: 'Finish a full sprint under 10 minutes' },
  // Streaks
  { id: 'streak_3',      icon: '🔥', name: 'On Fire',            desc: 'Reach a 3-day daily streak' },
  { id: 'streak_7',      icon: '⚡', name: 'Unstoppable',        desc: 'Reach a 7-day daily streak' },
  { id: 'streak_30',     icon: '🏆', name: 'Monthly Master',     desc: 'Reach a 30-day daily streak' },
  // Difficulty
  { id: 'impossible_win',icon: '💀', name: 'Impossible Victor',  desc: 'Average 80+ on impossible difficulty' },
  { id: 'extreme_perfect',icon:'🔮', name: 'Extreme Perfection', desc: 'Score 100 on extreme difficulty' },
  // Categories
  { id: 'word_master',   icon: '📚', name: 'Wordsmith',          desc: 'Score 90+ on all word challenges in one session' },
  { id: 'math_wizard',   icon: '🧮', name: 'Math Wizard',        desc: 'Score 90+ on all math/number challenges in one session' },
  { id: 'speed_king',    icon: '⚡', name: 'Speed King',         desc: 'Score 90+ on typing, reaction, and stroop in one session' },
  // Special
  { id: 'daily_complete',icon: '📅', name: 'Daily Driver',       desc: 'Complete all daily challenges in one day' },
  { id: 'night_owl',     icon: '🦉', name: 'Night Owl',          desc: 'Play after midnight' },
  { id: 'early_bird',    icon: '🐦', name: 'Early Bird',         desc: 'Play before 7 AM' },
  { id: 'no_timer',      icon: '♾️', name: 'Timeless',           desc: 'Complete a session with timers off' },
  // Leveling
  { id: 'level_5',       icon: '⬆️', name: 'Rising Star',       desc: 'Reach Level 5' },
  { id: 'level_10',      icon: '🌟', name: 'Elite',              desc: 'Reach Level 10' },
  { id: 'level_15',      icon: '👾', name: 'Transcendent',       desc: 'Reach max level (15)' }
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
  const results = GS.results;

  // First game
  if (stats.played >= 1) unlockAchievement('first_game');

  // Perfect score
  if (Object.values(results).some(s => s === 100)) unlockAchievement('perfect_score');

  // Triple perfect
  if (Object.values(results).filter(s => s === 100).length >= 3) unlockAchievement('triple_perfect');

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

  // Speed: full sprint under 5 or 10 min
  if (GS.selectedChallenges.length === CHALLENGE_ORDER.length) {
    if (GS.timerElapsed < 300000) unlockAchievement('speed_5min');
    if (GS.timerElapsed < 600000) unlockAchievement('speed_10min');
  }

  // Impossible win (80+ avg on impossible)
  if (GS.difficulty === 'impossible') {
    const avg = Object.values(results).reduce((s, v) => s + v, 0) / Object.values(results).length;
    if (avg >= 80) unlockAchievement('impossible_win');
  }

  // Extreme perfection
  if (GS.difficulty === 'extreme' && Object.values(results).some(s => s === 100)) {
    unlockAchievement('extreme_perfect');
  }

  // High roller (1000+ and 5000+)
  if (finalScore >= 1000) unlockAchievement('score_1000');
  if (finalScore >= 5000) unlockAchievement('score_5000');

  // Daily complete (all daily challenges done)
  if (GS.mode === 'daily') {
    const daily = getDailyCompletion();
    if (CHALLENGE_ORDER.every(ch => daily[ch] !== undefined)) unlockAchievement('daily_complete');
  }

  // Time of day
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) unlockAchievement('night_owl');
  if (hour >= 5 && hour < 7) unlockAchievement('early_bird');

  // No timer
  if (!GS.timerEnabled) unlockAchievement('no_timer');

  // Word master: score 90+ on all word challenges played
  const wordChallenges = ['wordsearch','wordro','wordhive','chainword','scramble'];
  const playedWords = wordChallenges.filter(ch => results[ch] !== undefined);
  if (playedWords.length >= 3 && playedWords.every(ch => results[ch] >= 90)) unlockAchievement('word_master');

  // Math wizard: score 90+ on all math challenges played
  const mathChallenges = ['numgrid','numcrunch','quickmath','pattern','math24'];
  const playedMath = mathChallenges.filter(ch => results[ch] !== undefined);
  if (playedMath.length >= 3 && playedMath.every(ch => results[ch] >= 90)) unlockAchievement('math_wizard');

  // Speed king: 90+ on typing, reaction, and stroop
  const speedChallenges = ['typing','reaction','stroop'];
  if (speedChallenges.every(ch => results[ch] >= 90)) unlockAchievement('speed_king');

  // Level achievements
  if (typeof getXPData === 'function') {
    const xp = getXPData();
    if (xp.level >= 5) unlockAchievement('level_5');
    if (xp.level >= 10) unlockAchievement('level_10');
    if (xp.level >= 15) unlockAchievement('level_15');
  }
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
