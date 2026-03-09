// ==================== SOUND EFFECTS (Web Audio API) ====================

const SFX = {
  _ctx: null,
  _muted: false,

  init() {
    // Lazy init on first user interaction
    if (this._ctx) return;
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch { this._ctx = null; }
    this._muted = lsGet('sfx-muted', false);
    this._updateIcon();
  },

  _ensure() {
    if (!this._ctx) this.init();
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
    return this._ctx && !this._muted;
  },

  _play(freq, type, duration, vol, ramp) {
    if (!this._ensure()) return;
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (ramp) osc.frequency.linearRampToValueAtTime(ramp, ctx.currentTime + duration);
    gain.gain.setValueAtTime(vol || 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  },

  _playChord(freqs, type, duration, vol) {
    freqs.forEach(f => this._play(f, type, duration, (vol || 0.1) / freqs.length));
  },

  // --- Sound effects ---

  click() {
    this._play(800, 'sine', 0.06, 0.08);
  },

  correct() {
    if (!this._ensure()) return;
    this._play(523, 'sine', 0.12, 0.12);
    setTimeout(() => this._play(659, 'sine', 0.12, 0.12), 80);
    setTimeout(() => this._play(784, 'sine', 0.18, 0.1), 160);
  },

  wrong() {
    this._play(200, 'square', 0.15, 0.08);
    setTimeout(() => this._play(180, 'square', 0.2, 0.06), 120);
  },

  win() {
    if (!this._ensure()) return;
    const notes = [523, 587, 659, 784, 1047];
    notes.forEach((f, i) => {
      setTimeout(() => this._play(f, 'sine', 0.2, 0.1), i * 100);
    });
  },

  lose() {
    if (!this._ensure()) return;
    const notes = [392, 349, 330, 262];
    notes.forEach((f, i) => {
      setTimeout(() => this._play(f, 'sine', 0.25, 0.08), i * 150);
    });
  },

  tick() {
    this._play(1000, 'sine', 0.03, 0.05);
  },

  pop() {
    this._play(600, 'sine', 0.08, 0.1, 900);
  },

  streak() {
    if (!this._ensure()) return;
    this._play(880, 'sine', 0.1, 0.1);
    setTimeout(() => this._play(1047, 'sine', 0.1, 0.1), 60);
    setTimeout(() => this._play(1319, 'sine', 0.15, 0.08), 120);
  },

  // --- Mute toggle ---

  toggle() {
    this._muted = !this._muted;
    lsSet('sfx-muted', this._muted);
    this._updateIcon();
    if (!this._muted) this.click();
  },

  _updateIcon() {
    const btn = document.getElementById('btn-sound');
    if (btn) btn.textContent = this._muted ? '🔇' : '🔊';
  }
};

// Init on first click/tap
document.addEventListener('click', function _sfxInit() {
  SFX.init();
  document.removeEventListener('click', _sfxInit);
}, { once: true });
