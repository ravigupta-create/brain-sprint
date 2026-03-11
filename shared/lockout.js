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

// ==================== PASSWORD GATE ====================
let _gateAttempts = 0;
let _gateTimer = null;
let _gateAuth = false; // resets on every reload

// Re-check auth when tab gains focus (catches already-open tabs)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) showPasswordGate();
});
window.addEventListener('focus', () => showPasswordGate());

function showPasswordGate() {
  // Skip if already authenticated this page load
  if (_gateAuth) return;

  // Check if currently locked out (persists across reloads via localStorage)
  const lockUntil = parseInt(localStorage.getItem('bs_gate_until') || '0');
  if (Date.now() < lockUntil) {
    _showGateLockout(lockUntil);
    return;
  }
  // Clear expired lockout
  localStorage.removeItem('bs_gate_until');

  // Restore attempt count from localStorage so reloading doesn't reset it
  _gateAttempts = parseInt(localStorage.getItem('bs_gate_attempts') || '0');

  _showGateInput();
}

function _showGateInput() {
  const el = document.getElementById('lockout-screen');
  el.style.display = 'flex';
  document.getElementById('lockout-input').style.display = '';
  document.getElementById('lockout-input').value = '';
  document.getElementById('lockout-input').type = 'password';
  document.getElementById('lockout-error').textContent = '';
  document.querySelector('#lockout-screen button').style.display = '';
  document.querySelector('#lockout-screen div:nth-child(1)').textContent = '🧠';
  document.querySelector('#lockout-screen div:nth-child(2)').textContent = 'Brain Sprint';
  document.querySelector('#lockout-screen div:nth-child(3)').textContent = 'Enter password to continue.';
  document.querySelector('#lockout-screen button').onclick = tryPasswordGate;
  document.getElementById('lockout-input').onkeydown = (e) => {
    if (e.key === 'Enter') tryPasswordGate();
  };
  setTimeout(() => document.getElementById('lockout-input').focus(), 50);
}

function _showGateLockout(until) {
  const el = document.getElementById('lockout-screen');
  el.style.display = 'flex';
  document.getElementById('lockout-input').style.display = 'none';
  document.querySelector('#lockout-screen button').style.display = 'none';
  document.querySelector('#lockout-screen div:nth-child(1)').textContent = '🔒';
  document.querySelector('#lockout-screen div:nth-child(2)').textContent = 'Too Many Attempts';
  const msgEl = document.querySelector('#lockout-screen div:nth-child(3)');
  const errEl = document.getElementById('lockout-error');

  function updateTimer() {
    const remaining = Math.max(0, until - Date.now());
    if (remaining <= 0) {
      clearInterval(_gateTimer);
      _gateTimer = null;
      localStorage.removeItem('bs_gate_until');
      localStorage.removeItem('bs_gate_attempts');
      _gateAttempts = 0;
      _showGateInput();
      return;
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.ceil((remaining % 60000) / 1000);
    msgEl.textContent = 'Try again in ' + (mins > 0 ? mins + 'm ' : '') + secs + 's';
    errEl.textContent = '';
  }
  updateTimer();
  if (_gateTimer) clearInterval(_gateTimer);
  _gateTimer = setInterval(updateTimer, 1000);
}

function tryPasswordGate() {
  const val = document.getElementById('lockout-input').value;
  if (val === 'srg213') {
    _gateAuth = true;
    localStorage.removeItem('bs_gate_attempts');
    localStorage.removeItem('bs_gate_until');
    _gateAttempts = 0;
    document.getElementById('lockout-screen').style.display = 'none';
    document.getElementById('lockout-input').type = 'text';
  } else {
    _gateAttempts++;
    localStorage.setItem('bs_gate_attempts', String(_gateAttempts));
    if (_gateAttempts >= 4) {
      // Lock out for 5 minutes
      const until = Date.now() + 5 * 60 * 1000;
      localStorage.setItem('bs_gate_until', String(until));
      _showGateLockout(until);
      return;
    }
    const left = 4 - _gateAttempts;
    document.getElementById('lockout-error').textContent =
      'Wrong password (' + left + ' attempt' + (left !== 1 ? 's' : '') + ' left)';
    const inp = document.getElementById('lockout-input');
    inp.style.animation = 'shake 0.4s';
    setTimeout(() => inp.style.animation = '', 400);
    inp.value = '';
    inp.focus();
  }
}
