// ==================== ELO — adaptive per-challenge rating ====================
// Player has a rating per challenge. Each difficulty is an "opponent" at a fixed rating.
// After a run, the puzzle's expected score (E) is compared to the actual score fraction (S).
// Delta = K * (S - E). K decays as games played grows (provisional → stable).
//
// All state persisted under localStorage key 'bs-elo'. Fully local, zero deps.
// Fail-safe: any missing hooks / stats fall back to sane defaults; never throws.

const ELO_BASE = 1000;
const ELO_DIFFICULTY = { easy: 800, medium: 1000, hard: 1200, extreme: 1500, impossible: 1800 };
const ELO_SCALE = 400;      // classical Elo scale
const ELO_K_MAX = 40;       // K for provisional players (few games)
const ELO_K_MIN = 16;       // K after ~30+ games
const ELO_PROVISIONAL_GAMES = 30;

function _eloAll() { return lsGet('elo', {}); }
function _eloSave(obj) { lsSet('elo', obj); }

function getRating(challenge) {
  const all = _eloAll();
  const entry = all[challenge];
  return entry ? entry.rating : ELO_BASE;
}

function getGamesPlayed(challenge) {
  const all = _eloAll();
  const entry = all[challenge];
  return entry ? entry.games : 0;
}

function _kFactor(games) {
  if (games >= ELO_PROVISIONAL_GAMES) return ELO_K_MIN;
  const t = games / ELO_PROVISIONAL_GAMES;
  return ELO_K_MAX + (ELO_K_MIN - ELO_K_MAX) * t;
}

function _expected(player, opponent) {
  return 1 / (1 + Math.pow(10, (opponent - player) / ELO_SCALE));
}

// Called after every challenge with the final 0-100 score.
// difficulty is one of the MULTIPLIERS keys. Silent-safe for unknown difficulties.
function updateRating(challenge, difficulty, score) {
  if (!challenge || typeof score !== 'number' || !isFinite(score)) return null;
  if (!(difficulty in ELO_DIFFICULTY)) return null;
  const opp = ELO_DIFFICULTY[difficulty];
  const all = _eloAll();
  const prev = all[challenge] || { rating: ELO_BASE, games: 0, peak: ELO_BASE, lastDelta: 0 };
  const S = Math.max(0, Math.min(1, score / 100));
  const E = _expected(prev.rating, opp);
  const K = _kFactor(prev.games);
  const delta = Math.round(K * (S - E));
  const next = {
    rating: prev.rating + delta,
    games: prev.games + 1,
    peak: Math.max(prev.peak || prev.rating, prev.rating + delta),
    lastDelta: delta
  };
  all[challenge] = next;
  _eloSave(all);
  return { prev: prev.rating, next: next.rating, delta, expected: E, actual: S, opponent: opp };
}

// Suggest the difficulty whose opponent rating is closest to the player's current rating
// on that challenge — or, if no challenge chosen yet, the average rating across played
// challenges. Returns null if we have zero data.
function suggestDifficultyFor(challenge) {
  const r = challenge ? getRating(challenge) : suggestOverallRating();
  if (r == null) return null;
  let bestDiff = null, bestGap = Infinity;
  for (const [diff, opp] of Object.entries(ELO_DIFFICULTY)) {
    const gap = Math.abs(opp - r);
    if (gap < bestGap) { bestGap = gap; bestDiff = diff; }
  }
  return bestDiff;
}

function suggestOverallRating() {
  const all = _eloAll();
  const entries = Object.values(all);
  if (entries.length === 0) return null;
  let sum = 0, n = 0;
  entries.forEach((e) => { sum += e.rating * e.games; n += e.games; });
  return n > 0 ? Math.round(sum / n) : null;
}

// Render a compact rating panel for the stats screen.
function renderEloSection() {
  const all = _eloAll();
  const challenges = Object.keys(all);
  if (challenges.length === 0) return '';
  challenges.sort((a, b) => (all[b].rating || 0) - (all[a].rating || 0));
  const overall = suggestOverallRating();
  const suggested = suggestDifficultyFor(null);

  let html = '<div class="section-sub" style="margin-top:16px">Skill Rating</div>';
  html += `<div class="elo-summary" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:10px">
    <div>
      <div style="font-size:12px;color:var(--fg2);text-transform:uppercase;letter-spacing:.5px">Overall</div>
      <div style="font-size:22px;font-weight:800">${overall ?? '—'}</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:12px;color:var(--fg2);text-transform:uppercase;letter-spacing:.5px">Suggested</div>
      <div style="font-size:16px;font-weight:700;text-transform:capitalize">${suggested ?? '—'}</div>
    </div>
  </div>`;

  html += '<div class="elo-list">';
  challenges.forEach((ch) => {
    const e = all[ch];
    const dTxt = e.lastDelta === 0 ? '±0' : (e.lastDelta > 0 ? '+' + e.lastDelta : String(e.lastDelta));
    const dCls = e.lastDelta > 0 ? 'up' : (e.lastDelta < 0 ? 'down' : 'flat');
    html += `<div class="score-row" style="animation:none">
      <div class="ch-info">
        <span class="ch-icon-sm">${CHALLENGE_ICONS[ch] || '❓'}</span>
        <span class="ch-label">${CHALLENGE_NAMES[ch] || ch}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-weight:800">${e.rating}</span>
        <span class="elo-delta elo-delta-${dCls}" style="font-size:12px;color:${e.lastDelta > 0 ? 'var(--green,#6aaa64)' : e.lastDelta < 0 ? 'var(--red,#e11d48)' : 'var(--fg2)'};min-width:36px;text-align:right">${dTxt}</span>
      </div>
    </div>`;
  });
  html += '</div>';
  return html;
}

// Small helper for the difficulty select screen: mark the suggested tile.
function markSuggestedDifficultyTile() {
  const diff = suggestDifficultyFor(null);
  if (!diff) return;
  document.querySelectorAll('.diff-card').forEach((card) => {
    card.querySelectorAll('.diff-suggested-badge').forEach((b) => b.remove());
    if (card.dataset.diff === diff) {
      const badge = document.createElement('div');
      badge.className = 'diff-suggested-badge';
      badge.textContent = '★ Suggested for you';
      badge.style.cssText = 'position:absolute;top:6px;right:8px;font-size:10px;font-weight:700;color:var(--accent);background:var(--accent-light,rgba(99,102,241,.15));padding:2px 6px;border-radius:8px;letter-spacing:.3px';
      card.style.position = card.style.position || 'relative';
      card.appendChild(badge);
    }
  });
}
