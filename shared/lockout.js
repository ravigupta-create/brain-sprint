// ==================== DAILY RESET ====================
function tryResetDaily() {
  const input = document.getElementById('reset-password');
  if (input.value === '1313') {
    // Clear today's daily completion
    const key = 'bs-daily-' + getDailyDateStr();
    try { localStorage.removeItem(key); } catch {}
    input.value = '';
    showToast('Daily challenges reset!');
    // Refresh challenge select UI if on that screen
    updateChallengeSelectUI();
  } else {
    input.value = '';
    input.style.animation = 'shake 0.4s';
    setTimeout(() => input.style.animation = '', 400);
    showToast('Wrong code');
  }
}

// ==================== LOCKOUT SYSTEM ====================
const _BLOCKED = [
  'fuck','shit','damn','hell','ass','bitch','dick','cock','cunt','piss',
  'slut','whore','fag','nig','tit','wank','twat','prick','arse','bollock'
];

function _checkCurse(text) {
  const t = text.toLowerCase();
  return _BLOCKED.some(w => t.includes(w));
}

let _lockAttempts = 0;

function lockSite() {
  localStorage.setItem('bs_locked', '1');
  _lockAttempts = 0;
  _showLockScreen();
}

function _showLockScreen() {
  if (localStorage.getItem('bs_banned') === '1') {
    _showBanned();
    return;
  }
  const el = document.getElementById('lockout-screen');
  el.style.display = 'flex';
  document.getElementById('lockout-input').style.display = '';
  document.getElementById('lockout-error').textContent = '';
  document.getElementById('lockout-input').value = '';
  document.querySelector('#lockout-screen button').style.display = '';
  document.querySelector('#lockout-screen div:nth-child(3)').textContent =
    'This site has been locked. Enter the password to continue.';
  setTimeout(() => document.getElementById('lockout-input').focus(), 50);
  document.getElementById('lockout-input').onkeydown = (e) => {
    if (e.key === 'Enter') tryUnlockSite();
  };
}

function _showBanned() {
  const el = document.getElementById('lockout-screen');
  el.style.display = 'flex';
  document.getElementById('lockout-input').style.display = 'none';
  document.querySelector('#lockout-screen button').style.display = 'none';
  document.getElementById('lockout-error').textContent = '';
  document.querySelector('#lockout-screen div:nth-child(3)').textContent =
    'Access has been permanently revoked.';
}

function tryUnlockSite() {
  const val = document.getElementById('lockout-input').value.trim();
  if (val.toLowerCase() === 'saavan') {
    localStorage.removeItem('bs_locked');
    _lockAttempts = 0;
    document.getElementById('lockout-screen').style.display = 'none';
  } else {
    _lockAttempts++;
    if (_lockAttempts >= 2) {
      localStorage.setItem('bs_banned', '1');
      _showBanned();
      return;
    }
    document.getElementById('lockout-error').textContent =
      'Wrong password (' + (2 - _lockAttempts) + ' attempt left)';
    const inp = document.getElementById('lockout-input');
    inp.style.animation = 'shake 0.4s';
    setTimeout(() => inp.style.animation = '', 400);
    inp.value = '';
    inp.focus();
  }
}

function checkLockOnLoad() {
  if (localStorage.getItem('bs_banned') === '1') {
    _showBanned();
  } else if (localStorage.getItem('bs_locked') === '1') {
    _showLockScreen();
  }
}
