// ==================== CHALLENGE 8: WORD BLOOM ====================

let BLOOM_WORDS = [];
let _bloomWordsLoaded = false;

function loadBloomWords() {
  if (_bloomWordsLoaded) return Promise.resolve();
  return fetch('words.txt')
    .then(r => r.text())
    .then(text => {
      BLOOM_WORDS = text.split('\n')
        .map(w => w.trim().toLowerCase())
        .filter(w => w.length >= 3 && w.length <= 7 && /^[a-z]+$/.test(w));
      _bloomWordsLoaded = true;
    })
    .catch(() => {
      // Fallback: use WORDRO_ANSWERS only
      BLOOM_WORDS = [];
      _bloomWordsLoaded = true;
    });
}

function _buildBloomPool() {
  if (GS._bloomPool) return GS._bloomPool;
  const pool = new Set();
  // Add all words.txt words (3-7 letters)
  BLOOM_WORDS.forEach(w => { if (w.length >= 3 && w.length <= 7) pool.add(w.toLowerCase()); });
  // Add full WORDRO_BANK (12,953 five-letter words)
  WORDRO_BANK.forEach(w => pool.add(w.toLowerCase()));
  // Add WORDRO_ANSWERS
  WORDRO_ANSWERS.forEach(w => pool.add(w.toLowerCase()));
  GS._bloomPool = [...pool];
  return GS._bloomPool;
}

function getWordhivePuzzle() {
  const diff = GS.difficulty;
  // Difficulty only affects how many words you need to find
  let target;
  if (diff === 'easy')        { target = 5; }
  else if (diff === 'medium') { target = 12; }
  else if (diff === 'hard')       { target = 20; }
  else if (diff === 'impossible') { target = 45; }
  else                            { target = 30; }

  const minLen = 3;
  const centerPool = 'earstlnio';
  const allWords = _buildBloomPool();

  let bestSet = null, bestCenter = null, bestValid = [];

  for (let attempt = 0; attempt < 300; attempt++) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const shuffled = rngShuffle(alphabet);
    const letters = shuffled.slice(0, 7);
    // Pick center letter (biased toward common letters)
    const poolLetters = letters.filter(l => centerPool.includes(l));
    const center = poolLetters.length > 0 ? rngPick(poolLetters) : rngPick(letters);
    const letterSet = new Set(letters);
    // Find valid words: uses only these 7 letters, includes center letter
    const valid = allWords.filter(w => {
      if (w.length < minLen) return false;
      if (!w.includes(center)) return false;
      for (const ch of w) if (!letterSet.has(ch)) return false;
      return true;
    });
    // Want puzzles with many possible words (at least target + buffer)
    if (valid.length >= Math.max(target + 5, 20)) {
      bestSet = letters;
      bestCenter = center;
      bestValid = valid;
      break;
    }
    if (valid.length >= target && (!bestSet || valid.length > bestValid.length)) {
      bestSet = letters;
      bestCenter = center;
      bestValid = valid;
    }
  }

  if (!bestSet) {
    bestSet = ['a','r','i','s','e','l','t'];
    bestCenter = 'a';
    const ls = new Set(bestSet);
    bestValid = allWords.filter(w => w.length >= minLen && w.includes('a') && [...w].every(ch => ls.has(ch)));
  }

  const outer = bestSet.filter(l => l !== bestCenter);
  return { center: bestCenter, outer: rngShuffle(outer), validWords: bestValid, target, minLen };
}

function renderWordhive(data) {
  const { center, outer, validWords, target, minLen } = data;
  // Clean up old handler before overwriting state
  if (GS.challengeState._keyHandler) document.removeEventListener('keydown', GS.challengeState._keyHandler);

  GS.challengeState = {
    center, outer: [...outer], validWords, target, minLen: minLen || 3,
    input: '',
    found: [],
    message: ''
  };

  const c = document.getElementById('game-container');
  c.innerHTML = `<div class="wordhive-wrap">
    <div class="wordhive-progress" id="wh-progress">0 / ${target} words</div>
    <div class="wordhive-input-display" id="wh-input"></div>
    <div class="wordhive-msg" id="wh-msg"></div>
    <div class="wordhive-hive" id="wh-hive"></div>
    <div class="wordhive-actions">
      <button onclick="wordhiveDelete()">Delete</button>
      <button onclick="wordhiveShuffle()">Shuffle</button>
      <button onclick="wordhiveEnter()">Enter</button>
    </div>
    <div class="wordhive-found" id="wh-found"></div>
  </div>`;

  updateWordhiveHiveUI();
  document.getElementById('btn-submit-challenge').style.display = 'inline-flex';
  GS.challengeState._keyHandler = (e) => {
    if (e.key === 'Enter') { wordhiveEnter(); return; }
    if (e.key === 'Backspace') { wordhiveDelete(); return; }
    const k = e.key.toLowerCase();
    if (k.length === 1 && k >= 'a' && k <= 'z') {
      const allLetters = [GS.challengeState.center, ...GS.challengeState.outer];
      if (allLetters.includes(k)) wordhiveTap(k);
    }
  };
  document.addEventListener('keydown', GS.challengeState._keyHandler);
}

function updateWordhiveHiveUI() {
  const st = GS.challengeState;
  const hive = document.getElementById('wh-hive');
  // Circular petal positions: center + 6 evenly spaced around
  const cx = 76, cy = 76, radius = 68;
  const positions = [{x: cx, y: cy}];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * Math.PI / 180;
    positions.push({x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle)});
  }
  let html = '';
  // Center
  html += `<div class="wordhive-hex wh-center" style="left:${positions[0].x}px;top:${positions[0].y}px" onclick="wordhiveTap('${st.center}')">${st.center.toUpperCase()}</div>`;
  // Outer
  for (let i = 0; i < 6; i++) {
    const letter = st.outer[i] || '';
    const p = positions[i + 1];
    html += `<div class="wordhive-hex wh-outer" style="left:${p.x}px;top:${p.y}px" onclick="wordhiveTap('${letter}')">${letter.toUpperCase()}</div>`;
  }
  hive.innerHTML = html;
}

function wordhiveTap(letter) {
  if (GS.challengeState.done) return;
  GS.challengeState.input += letter;
  updateWordhiveInputUI();
}

function wordhiveDelete() {
  const st = GS.challengeState;
  if (st.done) return;
  st.input = st.input.slice(0, -1);
  updateWordhiveInputUI();
}

function wordhiveShuffle() {
  const st = GS.challengeState;
  // Shuffle outer letters
  const shuffled = rngShuffle(st.outer);
  st.outer = shuffled;
  updateWordhiveHiveUI();
}

function wordhiveEnter() {
  const st = GS.challengeState;
  if (st.done) return;
  const word = st.input.toLowerCase();
  st.input = '';

  if (word.length < st.minLen) {
    st.message = `Words must be at least ${st.minLen} letters`;
    updateWordhiveInputUI();
    return;
  }
  if (!word.includes(st.center)) {
    st.message = 'Must include center letter';
    updateWordhiveInputUI();
    return;
  }
  if (st.found.includes(word)) {
    st.message = 'Already found!';
    updateWordhiveInputUI();
    return;
  }
  if (st.validWords.includes(word)) {
    st.found.push(word);
    st.message = 'Nice!';
    updateWordhiveInputUI();
    // Lock input when target reached
    if (st.found.length >= st.target) {
      st.done = true;
      st.message = 'Target reached!';
      updateWordhiveInputUI();
    }
    return;
  } else {
    st.message = 'Not in word list';
  }
  updateWordhiveInputUI();
}

function updateWordhiveInputUI() {
  const st = GS.challengeState;
  document.getElementById('wh-input').textContent = st.input.toUpperCase();
  document.getElementById('wh-msg').textContent = st.message;
  document.getElementById('wh-progress').textContent = `${st.found.length} / ${st.target} words`;
  // Found words
  const foundEl = document.getElementById('wh-found');
  foundEl.innerHTML = st.found.map(w => `<span class="wh-tag">${w}</span>`).join('');
  // Clear message after delay
  if (st.message) {
    setTimeout(() => {
      if (GS.challengeState.message === st.message) {
        GS.challengeState.message = '';
        const el = document.getElementById('wh-msg');
        if (el) el.textContent = '';
      }
    }, 1500);
  }
}

function submitWordhive() {
  const st = GS.challengeState;
  if (st._keyHandler) document.removeEventListener('keydown', st._keyHandler);

  const score = Math.min(100, Math.round(100 * st.found.length / st.target));
  GS.results.wordhive = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('wordhive', score);
    lsSet('daily-wordhive-state-'+getDailyDateStr(), { found: st.found, target: st.target, validWords: st.validWords, centerLetter: st.center, letters: st.outer });
  }

  // Show results
  const missed = st.validWords.filter(w => !st.found.includes(w)).slice(0, 10);
  const foundTags = st.found.map(w => `<span class="cs-tag found">${w}</span>`).join(' ');
  const missedTags = missed.map(w => `<span class="cs-tag missed">${w}</span>`).join(' ');
  let review = foundTags;
  if (missedTags) review += `<div style="margin-top:8px;font-size:12px;color:var(--fg2);margin-bottom:4px">Missed:</div>` + missedTags;
  showChallengeSummary({
    emoji: score >= 80 ? '🎉' : score >= 50 ? '👍' : '🐝',
    score,
    title: score >= 80 ? 'Brilliant!' : score >= 50 ? 'Good Job!' : 'Keep Buzzing!',
    stats: [
      { label: 'Words found', value: `${st.found.length} / ${st.validWords.length}` },
      { label: 'Target', value: st.target }
    ],
    miniReview: review
  });
}

