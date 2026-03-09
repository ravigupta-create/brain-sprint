// ==================== RESULTS ====================

function showResults() {
  navigateTo('screen-results');
  document.getElementById('timer-display').style.display = 'block';
  const multiplier = MULTIPLIERS[GS.difficulty];
  const timeStr = formatTime(GS.timerElapsed);
  document.getElementById('results-time').textContent = `Time: ${timeStr}`;
  document.getElementById('results-multiplier').textContent = `${multiplier}x (${GS.difficulty})`;

  // Score breakdown
  const breakdown = document.getElementById('score-breakdown');
  let totalRaw = 0;
  let html = '';
  GS.selectedChallenges.forEach(ch => {
    const score = GS.results[ch] || 0;
    totalRaw += score;
    const isPerfect = score === 100;
    html += `<div class="score-row animate-slide-up">
      <div class="ch-info">
        <span class="ch-icon-sm">${CHALLENGE_ICONS[ch]}</span>
        <span class="ch-label">${CHALLENGE_NAMES[ch]}</span>
      </div>
      <span class="ch-score ${isPerfect?'perfect':''}">${score}/100</span>
    </div>`;
  });
  breakdown.innerHTML = html;

  const finalScore = Math.round(totalRaw * multiplier);
  // Animated count-up with micro-pulses
  animateCountUp('results-score', 0, finalScore, 1500);

  // Share box
  const shareText = generateShareText(finalScore, timeStr, multiplier);
  document.getElementById('share-box').textContent = shareText;

  // Save stats
  updateStats(finalScore);

  // Confetti based on average score
  const avg = totalRaw / GS.selectedChallenges.length;
  if (avg >= 80) { setTimeout(() => launchConfetti(120), 600); }
  else if (avg >= 50) { setTimeout(() => launchConfetti(50), 600); }

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

function generateShareText(score, time, multiplier) {
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
  return `🧠 Brain Sprint ${GS.mode === 'daily' ? date : '(Practice)'}\n${label} | ${GS.difficulty} (${multiplier}x)\nScore: ${score}/${maxPossible} | ${time}\n${emoji}`;
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

