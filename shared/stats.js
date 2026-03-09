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
    <div class="stat-box"><div class="stat-val" data-target="${stats.played}">0</div><div class="stat-label">Played</div></div>
    <div class="stat-box"><div class="stat-val" data-target="${stats.bestScore}">0</div><div class="stat-label">Best</div></div>
    <div class="stat-box"><div class="stat-val" data-target="${avg}">0</div><div class="stat-label">Average</div></div>
    <div class="stat-box"><div class="stat-val" data-target="${stats.streak}">0</div><div class="stat-label">Streak</div></div>
  `;
  // Count-up animation for stat values
  document.querySelectorAll('#stats-grid .stat-val[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target) || 0;
    if (target === 0) return;
    const duration = 800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  // XP bar in stats
  const xpBarEl = document.getElementById('stats-xp-bar');
  if (xpBarEl && typeof renderXPBar === 'function') {
    xpBarEl.innerHTML = renderXPBar();
  }

  // Streak calendar (current month)
  renderStreakCalendar();

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
  } else {
    let histHtml = '<div class="section-sub">Recent Games</div>';
    history.slice(0, 10).forEach((h, i) => {
      const emojis = h.challenges.map(ch => CHALLENGE_ICONS[ch] || '❓').join('');
      const grade = typeof getGrade === 'function' && h.challenges.length > 0
        ? getGrade(Math.round(Object.values(h.results || {}).reduce((a,b)=>a+b,0) / h.challenges.length))
        : '';
      histHtml += `<div class="score-row" style="animation-delay:${0.1 + i * 0.06}s">
        <div class="ch-info">
          <span class="ch-icon-sm">${emojis.slice(0, 12)}${emojis.length > 12 ? '…' : ''}</span>
          <span class="ch-label">${h.date} (${h.mode}/${h.difficulty})</span>
        </div>
        <span class="ch-score">${h.score}${grade ? ' <span class="grade-badge grade-'+grade+'" style="width:24px;height:24px;font-size:12px">'+grade+'</span>' : ''}</span>
      </div>`;
    });
    histDiv.innerHTML = histHtml;
  }

  // Achievements
  const achDiv = document.getElementById('achievements-section');
  if (achDiv) achDiv.innerHTML = renderAchievementsSection();
}

function renderStreakCalendar() {
  const calDiv = document.getElementById('streak-calendar');
  if (!calDiv) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayLabels = ['S','M','T','W','T','F','S'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  let html = `<div class="streak-calendar">
    <div class="streak-cal-header">
      <span class="streak-cal-title">Activity Calendar</span>
      <span class="streak-cal-month">${monthNames[month]} ${year}</span>
    </div>
    <div class="streak-cal-grid">`;

  // Day labels
  dayLabels.forEach(d => {
    html += `<div class="streak-cal-day-label">${d}</div>`;
  });

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="streak-cal-cell empty"></div>`;
  }

  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dailyData = lsGet('daily-' + dateStr, null);
    const played = dailyData !== null;
    const isToday = d === today;
    const isFuture = d > today;
    let cls = 'streak-cal-cell';
    if (played) cls += ' played';
    if (isToday) cls += ' today';
    if (isFuture) cls += ' future';
    html += `<div class="${cls}" title="${dateStr}">${d}</div>`;
  }

  html += `</div></div>`;
  calDiv.innerHTML = html;
}

function closeStats() {
  document.getElementById('stats-modal').classList.remove('active');
}
