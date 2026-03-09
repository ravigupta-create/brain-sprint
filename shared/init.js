// ==================== INIT ====================
function init() {
  checkLockOnLoad();
  initTheme();
  SFX.init();
  SFX._updateIcon();
  loadBloomWords();
  // Show today's date on the Daily button and calendar icon
  const d = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const monthsFull = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('cal-month').textContent = months[d.getMonth()];
  document.getElementById('cal-day').textContent = d.getDate();
  document.getElementById('daily-label').textContent = `${monthsFull[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  // Check if daily already done
  if (GS.mode === 'daily') {
    const daily = getDailyCompletion();
    // Update challenge cards if already completed
  }
}
init();
