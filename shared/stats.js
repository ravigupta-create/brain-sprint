// ==================== STATS ====================

function updateStats(score) {
  const stats = getStats();
  stats.played++;
  stats.totalScore += score;
  if (score > stats.bestScore) stats.bestScore = score;
  // Streak
  const today = getDailyDateStr();
  if (GS.mode === 'daily') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
    if (stats.lastDate === yesterdayStr || stats.lastDate === today) {
      if (stats.lastDate !== today) stats.streak++;
    } else {
      stats.streak = 1;
    }
    if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
    stats.lastDate = today;
  }
  saveStats(stats);
  // History
  addHistory({
    date: getDailyDateStr(),
    mode: GS.mode,
    difficulty: GS.difficulty,
    challenges: GS.selectedChallenges,
    results: {...GS.results},
    score: score,
    time: GS.timerElapsed,
    timeStr: formatTime(GS.timerElapsed)
  });
}

function showStats() {
  navigateTo('screen-stats');
  renderStatsScreen();
}

function renderStatsScreen() {
  const stats = getStats();
  const avg = stats.played > 0 ? Math.round(stats.totalScore / stats.played) : 0;
  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-box"><div class="stat-val">${stats.played}</div><div class="stat-label">Played</div></div>
    <div class="stat-box"><div class="stat-val">${stats.bestScore}</div><div class="stat-label">Best</div></div>
    <div class="stat-box"><div class="stat-val">${avg}</div><div class="stat-label">Average</div></div>
    <div class="stat-box"><div class="stat-val">${stats.streak}</div><div class="stat-label">Streak</div></div>
  `;
  // Last 7 days streak bar
  const bar = document.getElementById('streak-bar');
  let barHtml = '';
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const done = lsGet('daily-'+dStr, null) !== null;
    const isToday = i === 0;
    barHtml += `<div class="streak-day ${done?'done':''} ${isToday?'today':''}" title="${dStr}"></div>`;
  }
  bar.innerHTML = barHtml;
  // History
  const history = getHistory();
  const histDiv = document.getElementById('history-list');
  if (history.length === 0) {
    histDiv.innerHTML = '<div style="color:var(--fg2);text-align:center">No games yet</div>';
    return;
  }
  let histHtml = '<div class="section-sub">Recent Games</div>';
  history.slice(0, 10).forEach(h => {
    const emojis = h.challenges.map(ch => CHALLENGE_ICONS[ch]).join('');
    histHtml += `<div class="score-row">
      <div class="ch-info">
        <span class="ch-icon-sm">${emojis}</span>
        <span class="ch-label">${h.date} (${h.mode}/${h.difficulty})</span>
      </div>
      <span class="ch-score">${h.score} — ${h.timeStr || formatTime(h.time)}</span>
    </div>`;
  });
  histDiv.innerHTML = histHtml;
}

function closeStats() {
  document.getElementById('stats-modal').classList.remove('active');
}

