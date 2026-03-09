// ==================== RESULTS ====================

function getGrade(score) {
  if (score >= 95) return 'S';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

function showResults() {
  navigateTo('screen-results');
  const multiplier = MULTIPLIERS[GS.difficulty];
  const timeStr = GS.timerEnabled ? formatTime(GS.timerElapsed) : 'untimed';
  if (GS.timerEnabled) {
    document.getElementById('timer-display').style.display = 'block';
    document.getElementById('results-time').textContent = `Time: ${timeStr}`;
  } else {
    document.getElementById('timer-display').style.display = 'none';
    document.getElementById('results-time').textContent = 'Time: --:--';
  }
  document.getElementById('results-multiplier').textContent = `${multiplier}x (${GS.difficulty})`;

  // Score breakdown with grades
  const breakdown = document.getElementById('score-breakdown');
  let totalRaw = 0;
  let html = '';
  GS.selectedChallenges.forEach((ch, i) => {
    const score = GS.results[ch] || 0;
    totalRaw += score;
    const isPerfect = score === 100;
    const grade = getGrade(score);
    html += `<div class="score-row animate-slide-up" style="animation-delay:${0.05*i}s">
      <div class="ch-info">
        <span class="ch-icon-sm">${CHALLENGE_ICONS[ch]}</span>
        <span class="ch-label">${CHALLENGE_NAMES[ch]}</span>
      </div>
      <div style="display:flex;align-items:center">
        <span class="ch-score ${isPerfect?'perfect':''}">${score}/100</span>
        <span class="grade-badge grade-${grade}" style="animation-delay:${0.05*i + 0.3}s">${grade}</span>
      </div>
    </div>`;
  });
  breakdown.innerHTML = html;

  const finalScore = Math.round(totalRaw * multiplier);
  const avgScore = Math.round(totalRaw / GS.selectedChallenges.length);
  const overallGrade = getGrade(avgScore);

  // Overall grade display
  const scoreEl = document.getElementById('results-score');
  scoreEl.setAttribute('data-grade', overallGrade);

  // Animated count-up with micro-pulses
  animateCountUp('results-score', 0, finalScore, 1500);

  // XP award
  if (typeof awardXP === 'function') {
    const xpResult = awardXP(finalScore, GS.difficulty, GS.selectedChallenges.length);
    const xpRow = document.getElementById('xp-earned-row');
    if (xpRow) {
      xpRow.innerHTML = `<span class="xp-earned-label">XP Earned:</span><span class="xp-earned-value">+${xpResult.xpEarned}</span>`;
      xpRow.style.display = 'flex';
    }
  }

  // Overall grade badge after score
  setTimeout(() => {
    const gradeEl = document.getElementById('overall-grade-badge');
    if (gradeEl) {
      gradeEl.className = `grade-badge overall-grade grade-${overallGrade}`;
      gradeEl.textContent = overallGrade;
      gradeEl.style.display = 'inline-flex';
    }
  }, 1600);

  // Share box
  const shareText = generateShareText(finalScore, timeStr, multiplier, overallGrade);
  document.getElementById('share-box').textContent = shareText;

  // Save stats
  updateStats(finalScore);

  // Confetti based on average score
  if (avgScore >= 80) { setTimeout(() => launchConfetti(120), 600); }
  else if (avgScore >= 50) { setTimeout(() => launchConfetti(50), 600); }

  // Check achievements
  setTimeout(() => checkAchievements(finalScore), 1500);
}

function animateCountUp(elemId, start, end, duration) {
  const el = document.getElementById(elemId);
  const range = end - start;
  const startTime = performance.now();
  let lastPulse = 0;
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.round(start + range * eased);
    el.textContent = current;
    // Micro-pulse every ~15% progress
    const pulseThreshold = Math.floor(progress * 7);
    if (pulseThreshold > lastPulse && progress < 1) {
      lastPulse = pulseThreshold;
      el.classList.remove('score-pulse');
      void el.offsetWidth;
      el.classList.add('score-pulse');
    }
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Final landing pop
      el.classList.remove('score-pulse');
      el.classList.add('score-land');
      setTimeout(() => el.classList.remove('score-land'), 350);
    }
  }
  requestAnimationFrame(update);
}

function generateShareText(score, time, multiplier, grade) {
  const date = getDailyDateStr();
  const maxPossible = GS.selectedChallenges.length * 100 * multiplier;
  let emoji = '';
  GS.selectedChallenges.forEach(ch => {
    const s = GS.results[ch] || 0;
    if (s === 100) emoji += '🟢';
    else if (s >= 60) emoji += '🟡';
    else if (s > 0) emoji += '🟠';
    else emoji += '🔴';
  });
  const isFullSprint = GS.selectedChallenges.length === CHALLENGE_ORDER.length;
  const label = isFullSprint ? 'Full Sprint' : `${GS.selectedChallenges.length} Challenge${GS.selectedChallenges.length > 1 ? 's' : ''}`;
  const gradeText = grade ? ` | Grade: ${grade}` : '';
  return `🧠 Brain Sprint ${GS.mode === 'daily' ? date : '(Practice)'}\n${label} | ${GS.difficulty} (${multiplier}x)\nScore: ${score}/${maxPossible} | ${time}${gradeText}\n${emoji}`;
}

function copyShare() {
  const text = document.getElementById('share-box').textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied!');
  });
}
