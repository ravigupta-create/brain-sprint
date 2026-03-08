// ==================== WORDROBOT ANALYSIS ====================

// --- Precomputed char codes for fast integer-only feedback ---
let _wbCodes = null, _waCodes = null, _weCodes = null, _wbUpper = null, _waUpper = null, _weUpper = null;

function _ensureWordCodes() {
  if (_wbCodes) return;
  _wbUpper = WORDRO_BANK.map(w => w.toUpperCase());
  _waUpper = WORDRO_ANSWERS.map(w => w.toUpperCase());
  _weUpper = WORDRO_EASY.map(w => w.toUpperCase());
  _wbCodes = _wbUpper.map(w => [w.charCodeAt(0),w.charCodeAt(1),w.charCodeAt(2),w.charCodeAt(3),w.charCodeAt(4)]);
  _waCodes = _waUpper.map(w => [w.charCodeAt(0),w.charCodeAt(1),w.charCodeAt(2),w.charCodeAt(3),w.charCodeAt(4)]);
  _weCodes = _weUpper.map(w => [w.charCodeAt(0),w.charCodeAt(1),w.charCodeAt(2),w.charCodeAt(3),w.charCodeAt(4)]);
}

function _resultToFbNum(result) {
  const m = { correct: 2, present: 1, absent: 0 };
  return m[result[0]]*81 + m[result[1]]*27 + m[result[2]]*9 + m[result[3]]*3 + m[result[4]];
}

function _fbNumToResult(num) {
  const labels = ['absent', 'present', 'correct'];
  return [
    labels[(num / 81) | 0],
    labels[((num % 81) / 27) | 0],
    labels[((num % 27) / 9) | 0],
    labels[((num % 9) / 3) | 0],
    labels[num % 3]
  ];
}

function computeFeedback(guess, answer) {
  const result = Array(5).fill('absent');
  const answerLetters = answer.split('');
  const guessLetters = guess.split('');
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = 'correct';
      answerLetters[i] = null;
      guessLetters[i] = null;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === null) continue;
    const idx = answerLetters.indexOf(guessLetters[i]);
    if (idx !== -1) {
      result[i] = 'present';
      answerLetters[idx] = null;
    }
  }
  return result;
}

function filterCandidates(wordBank, guesses) {
  return wordBank.filter(candidate => {
    const w = candidate.toUpperCase();
    for (const g of guesses) {
      const fb = computeFeedback(g.word, w);
      for (let i = 0; i < 5; i++) {
        if (fb[i] !== g.result[i]) return false;
      }
    }
    return true;
  });
}

// Fast numeric feedback for solver (no allocations in hot path)
function _fbNum(gc, ac) {
  let a0=ac[0],a1=ac[1],a2=ac[2],a3=ac[3],a4=ac[4];
  let r0=0,r1=0,r2=0,r3=0,r4=0;
  if(gc[0]===a0){r0=2;a0=0}
  if(gc[1]===a1){r1=2;a1=0}
  if(gc[2]===a2){r2=2;a2=0}
  if(gc[3]===a3){r3=2;a3=0}
  if(gc[4]===a4){r4=2;a4=0}
  if(!r0){const c=gc[0];if(a0&&c===a0){r0=1;a0=0}else if(a1&&c===a1){r0=1;a1=0}else if(a2&&c===a2){r0=1;a2=0}else if(a3&&c===a3){r0=1;a3=0}else if(a4&&c===a4){r0=1;a4=0}}
  if(!r1){const c=gc[1];if(a0&&c===a0){r1=1;a0=0}else if(a1&&c===a1){r1=1;a1=0}else if(a2&&c===a2){r1=1;a2=0}else if(a3&&c===a3){r1=1;a3=0}else if(a4&&c===a4){r1=1;a4=0}}
  if(!r2){const c=gc[2];if(a0&&c===a0){r2=1;a0=0}else if(a1&&c===a1){r2=1;a1=0}else if(a2&&c===a2){r2=1;a2=0}else if(a3&&c===a3){r2=1;a3=0}else if(a4&&c===a4){r2=1;a4=0}}
  if(!r3){const c=gc[3];if(a0&&c===a0){r3=1;a0=0}else if(a1&&c===a1){r3=1;a1=0}else if(a2&&c===a2){r3=1;a2=0}else if(a3&&c===a3){r3=1;a3=0}else if(a4&&c===a4){r3=1;a4=0}}
  if(!r4){const c=gc[4];if(a0&&c===a0){r4=1;a0=0}else if(a1&&c===a1){r4=1;a1=0}else if(a2&&c===a2){r4=1;a2=0}else if(a3&&c===a3){r4=1;a3=0}else if(a4&&c===a4){r4=1;a4=0}}
  return r0*81+r1*27+r2*9+r3*3+r4;
}

function wordrobotSolve(answer, difficulty) {
  _ensureWordCodes();
  const solverCodes = difficulty === 'easy' ? _weCodes : _waCodes;
  const solverUpper = difficulty === 'easy' ? _weUpper : _waUpper;
  const answerUp = answer.toUpperCase();
  const answerCodes = [answerUp.charCodeAt(0),answerUp.charCodeAt(1),answerUp.charCodeAt(2),answerUp.charCodeAt(3),answerUp.charCodeAt(4)];
  const ALL_GREEN = 242;
  const hardMode = (difficulty === 'hard' || difficulty === 'extreme' || difficulty === 'impossible');
  const buckets = new Int32Array(243);
  let remaining = solverCodes.map((_,i) => i);
  const botGuesses = [];
  // Hard mode tracking: known correct positions and required present letters
  const knownCorrect = {}; // pos -> charCode
  const knownPresent = new Set(); // charCodes that must appear

  while (remaining.length > 0 && botGuesses.length < 10) {
    let bestIdx = remaining[0], bestEntropy = -1;
    const n = remaining.length;

    if (n <= 2) {
      bestIdx = remaining[0];
    } else {
      const remainSet = new Set(remaining);
      for (let gi = 0; gi < solverCodes.length; gi++) {
        // Hard mode: skip guesses that don't satisfy constraints
        if (hardMode && botGuesses.length > 0) {
          const gc = solverCodes[gi];
          let valid = true;
          for (const pos in knownCorrect) {
            if (gc[pos] !== knownCorrect[pos]) { valid = false; break; }
          }
          if (valid && knownPresent.size > 0) {
            for (const cc of knownPresent) {
              if (!gc.includes(cc)) { valid = false; break; }
            }
          }
          if (!valid) continue;
        }
        const gc = solverCodes[gi];
        buckets.fill(0);
        for (const ci of remaining) buckets[_fbNum(gc, solverCodes[ci])]++;
        let entropy = 0;
        for (let b = 0; b < 243; b++) {
          if (buckets[b] > 0) {
            const p = buckets[b] / n;
            entropy -= p * Math.log2(p);
          }
        }
        if (entropy > bestEntropy + 1e-9 ||
            (Math.abs(entropy - bestEntropy) < 1e-9 && remainSet.has(gi) && !remainSet.has(bestIdx))) {
          bestEntropy = entropy;
          bestIdx = gi;
        }
      }
    }

    const guessWord = solverUpper[bestIdx];
    const fbN = _fbNum(solverCodes[bestIdx], answerCodes);
    const result = _fbNumToResult(fbN);
    botGuesses.push({ word: guessWord, result });

    // Update hard mode constraints
    if (hardMode) {
      for (let i = 0; i < 5; i++) {
        if (result[i] === 'correct') {
          knownCorrect[i] = solverCodes[bestIdx][i];
          knownPresent.delete(solverCodes[bestIdx][i]);
        } else if (result[i] === 'present') {
          knownPresent.add(solverCodes[bestIdx][i]);
        }
      }
    }

    if (fbN === ALL_GREEN) break;
    remaining = remaining.filter(ci => _fbNum(solverCodes[bestIdx], solverCodes[ci]) === fbN);
  }

  return botGuesses;
}

function computeWordrobotAnalysis(state) {
  _ensureWordCodes();
  const guesses = state.guesses;
  const numGuesses = guesses.length;
  const perGuess = [];
  const ALL_GREEN = 242;
  const buckets = new Int32Array(243);
  const _hideWords = new Set(['SLAVE']);

  // Build index array of all bank words as initial remaining set
  let remaining = _wbCodes.map((_, i) => i);

  // --- Build a lookup: answer word index in _wbCodes (for "search answers only" optimization) ---
  const answerPool = (state.puzzle && state.puzzle.difficulty === 'easy') ? _weUpper : _waUpper;
  const answerBankIdx = [];
  const wbSet = new Map();
  for (let i = 0; i < _wbUpper.length; i++) wbSet.set(_wbUpper[i], i);
  for (let i = 0; i < answerPool.length; i++) {
    const idx = wbSet.get(answerPool[i]);
    if (idx !== undefined) answerBankIdx.push(idx);
  }

  for (let g = 0; g < numGuesses; g++) {
    const guess = guesses[g];
    const guessWord = guess.word;
    const guessUp = guessWord.toUpperCase ? guessWord.toUpperCase() : guessWord;
    const gc = [guessUp.charCodeAt(0),guessUp.charCodeAt(1),guessUp.charCodeAt(2),guessUp.charCodeAt(3),guessUp.charCodeAt(4)];
    const n = remaining.length;
    let guessSkill, guessLuck = 50;

    if (n <= 1) {
      guessSkill = (n === 1 && _wbUpper[remaining[0]] === guessUp) ? 100 : 0;
    } else if (n === 2) {
      guessSkill = (_wbUpper[remaining[0]] === guessUp || _wbUpper[remaining[1]] === guessUp) ? 100 : 50;
    } else {
      // --- Player entropy using _fbNum + Int32Array ---
      buckets.fill(0);
      for (let ri = 0; ri < n; ri++) buckets[_fbNum(gc, _wbCodes[remaining[ri]])]++;
      let playerEntropy = 0;
      for (let b = 0; b < 243; b++) {
        if (buckets[b] > 0) { const p = buckets[b] / n; playerEntropy -= p * Math.log2(p); }
      }

      // --- Best entropy: search only WORDRO_ANSWERS words (2,313 vs 12,953) ---
      let bestEntropy = 0;
      for (let ai = 0; ai < answerBankIdx.length; ai++) {
        const agi = answerBankIdx[ai];
        const agc = _wbCodes[agi];
        buckets.fill(0);
        for (let ri = 0; ri < n; ri++) buckets[_fbNum(agc, _wbCodes[remaining[ri]])]++;
        let ent = 0;
        for (let b = 0; b < 243; b++) {
          if (buckets[b] > 0) { const p = buckets[b] / n; ent -= p * Math.log2(p); }
        }
        if (ent > bestEntropy) bestEntropy = ent;
      }

      // Also check player's own guess in case it's not in answers list
      if (playerEntropy > bestEntropy) bestEntropy = playerEntropy;

      guessSkill = bestEntropy > 0 ? Math.round((playerEntropy / bestEntropy) * 100) : 100;
    }

    // --- Luck: use Int32Array buckets (already computed pattern for player's guess) ---
    if (n > 1) {
      buckets.fill(0);
      for (let ri = 0; ri < n; ri++) buckets[_fbNum(gc, _wbCodes[remaining[ri]])]++;
      const actualFbN = _resultToFbNum(guess.result);
      const actualCount = buckets[actualFbN] || 0;
      const actualEliminated = n - actualCount;
      let fewerCandidates = 0, equalCandidates = 0;
      for (let b = 0; b < 243; b++) {
        if (buckets[b] > 0) {
          const elim = n - buckets[b];
          if (elim < actualEliminated) fewerCandidates += buckets[b];
          else if (elim === actualEliminated) equalCandidates += buckets[b];
        }
      }
      guessLuck = Math.round((fewerCandidates + equalCandidates * 0.5) / n * 100);
    }

    // --- Filter remaining for next guess using _fbNum ---
    const actualFbN = _resultToFbNum(guess.result);
    const newRemaining = [];
    for (let ri = 0; ri < remaining.length; ri++) {
      if (_fbNum(gc, _wbCodes[remaining[ri]]) === actualFbN) newRemaining.push(remaining[ri]);
    }

    // --- Words left data for UI (always based on full 12,953 word bank) ---
    const totalBank = _wbCodes.length;
    const wordsLeftCount = newRemaining.length;
    const displayWords = newRemaining.filter(idx => !_hideWords.has(_wbUpper[idx])).map(idx => _wbUpper[idx]);
    const wordsLeftList = wordsLeftCount < 5 && wordsLeftCount > 0
      ? `${wordsLeftCount.toLocaleString()}/${totalBank.toLocaleString()}: ${displayWords.join(', ')}`
      : `${wordsLeftCount.toLocaleString()}/${totalBank.toLocaleString()}`;

    perGuess.push({
      word: guess.word, result: guess.result,
      skill: Math.min(guessSkill, 100), luck: guessLuck,
      remaining: n,
      wordsLeftCount, wordsLeftList
    });

    if (actualFbN === ALL_GREEN) { remaining = []; }
    else { remaining = newRemaining; }
  }

  // --- OVERALL SCORES ---
  const skillScores = perGuess.map(g => g.skill);
  const skill = Math.round(skillScores.reduce((a, b) => a + b, 0) / skillScores.length);

  let luckWeighted = 0, luckTotalW = 0;
  perGuess.forEach((g, i) => {
    const w = i === 0 ? 2 : 1;
    luckWeighted += g.luck * w;
    luckTotalW += w;
  });
  const luck = luckTotalW > 0 ? Math.round(luckWeighted / luckTotalW) : 50;

  // --- INSIGHTS ---
  const insights = [];
  const ka = new Set(), kp = {}, kc = {};
  for (let g = 0; g < numGuesses; g++) {
    const guess = guesses[g];
    if (g >= 1) {
      for (let i = 0; i < 5; i++) {
        if (ka.has(guess.word[i])) {
          insights.push(`Guess ${g+1}: You reused <strong>${guess.word[i]}</strong> which was already gray`);
          break;
        }
      }
      for (const letter of Object.keys(kp)) {
        if (!guess.word.includes(letter) && !kc[Object.keys(kc).find(k => kc[k] === letter)]) {
          insights.push(`Guess ${g+1}: You could have used <strong>${letter}</strong> (orange) somewhere`);
          break;
        }
      }
      for (let i = 0; i < 5; i++) {
        if (kp[guess.word[i]] && kp[guess.word[i]].has(i)) {
          insights.push(`Guess ${g+1}: <strong>${guess.word[i]}</strong> was orange in position ${i+1} before — try it elsewhere`);
          break;
        }
      }
    }
    for (let i = 0; i < 5; i++) {
      const letter = guess.word[i];
      if (guess.result[i] === 'correct') { kc[i] = letter; delete kp[letter]; }
      else if (guess.result[i] === 'present') { if (!kp[letter]) kp[letter] = new Set(); kp[letter].add(i); }
      else { if (!guess.result.some((r, j) => j !== i && guess.word[j] === letter && (r === 'correct' || r === 'present'))) ka.add(letter); }
    }
  }
  if (numGuesses >= 2) {
    const g1l = new Set(guesses[0].word.split(''));
    if (guesses[1].word.split('').filter(l => g1l.has(l)).length > 2)
      insights.push('Try guesses with more unique letters to gather info faster');
  }
  if (numGuesses === 1 && state.won) insights.push('Incredible! Pure instinct (or luck).');
  if (numGuesses >= 1) {
    const g1g = guesses[0].result.filter(r => r === 'correct').length;
    if (g1g >= 2) insights.push(`Lucky start — ${g1g} blues on your opening guess!`);
  }
  if (skill >= 70 && luck <= 35) insights.push('Great deduction despite tough breaks!');
  else if (skill <= 35 && luck >= 70) insights.push('You got lucky! Pay more attention to the clues.');
  const finalInsights = insights.slice(0, 3);
  if (finalInsights.length === 0) finalInsights.push(state.won ? 'Solid play — well done!' : 'Tough word! Keep practicing.');

  return { skill, luck, perGuess, insights: finalInsights };
}

function _renderMiniTiles(guess) {
  return guess.word.split('').map((ch, i) =>
    `<span class="wg-mini-tile ${guess.result[i]}">${ch}</span>`
  ).join('');
}

function _scoreColor(val, type) {
  if (type === 'skill') return val >= 70 ? 'var(--green)' : val >= 40 ? 'var(--orange)' : 'var(--red)';
  return val >= 70 ? '#a78bfa' : val >= 40 ? '#6366f1' : '#818cf8';
}

function showWordrobotAnalysis() {
  const state = GS.challengeState.wordro;
  if (!state) { showNextOrFinish(); return; }

  const playerCount = state.guesses.length;
  const playerFailed = !state.won;

  // Show loading state immediately
  const container = document.getElementById('game-container');
  container.innerHTML = `
    <div class="wordrobot-panel">
      <div class="wordrobot-header">🤖 Wordrobot Analysis</div>
      <div style="text-align:center;padding:32px 0;color:var(--fg2);font-size:14px">
        Analyzing your guesses...
      </div>
    </div>
  `;

  // Compute analysis fresh with a small delay to allow loading UI to render
  const analysisPromise = state._bgAnalysis || new Promise(resolve => {
    setTimeout(() => {
      try { resolve(computeWordrobotAnalysis(state)); }
      catch(e) { console.error('Wordrobot analysis failed:', e); resolve(null); }
    }, 100);
  });
  const solverPromise = state._bgSolver || new Promise(resolve => {
    setTimeout(() => {
      try { resolve(wordrobotSolve(state.puzzle.word, state.puzzle.difficulty)); }
      catch(e) { console.error('Wordrobot solver failed:', e); resolve([]); }
    }, 100);
  });

  Promise.all([analysisPromise, solverPromise]).then(([analysis, botGuessesResult]) => {
    if (!analysis) { showNextOrFinish(); return; }
    const { skill, luck, perGuess, insights } = analysis;
    const botGuesses = botGuessesResult || [];
    const botCount = botGuesses.length;

    // Per-guess rows — words-left data precomputed in analysis
    const guessRowsHtml = perGuess.map((g, i) => {
      return `
      <div class="wordrobot-guess-row">
        <span class="wg-num">${i + 1}</span>
        <span class="wg-word">${_renderMiniTiles(g)}</span>
        <span class="wg-stat" style="color:${_scoreColor(g.skill,'skill')}">${g.skill}</span>
        <span class="wg-stat" style="color:${_scoreColor(g.luck,'luck')}">${g.luck}</span>
        <span class="wg-remaining" style="color:var(--fg2)">${g.wordsLeftList}</span>
      </div>`;
    }).join('');

    // Bot guess rows
    const botRowsHtml = botGuesses.map((g, i) => `
      <div class="bot-guess-row">
        ${_renderMiniTiles(g)}
      </div>
    `).join('');

    // Verdict
    let verdictText, verdictColor, verdictBg;
    if (botCount === 0) {
      verdictText = 'Bot solver unavailable';
      verdictColor = 'var(--fg2)'; verdictBg = 'var(--bg3)';
    } else if (playerFailed) {
      verdictText = `You didn't find it — the bot solved it in ${botCount}!`;
      verdictColor = 'var(--red)'; verdictBg = 'rgba(231,76,60,0.1)';
    } else if (playerCount < botCount) {
      verdictText = `You beat the bot by ${botCount - playerCount}! Impressive!`;
      verdictColor = 'var(--green)'; verdictBg = 'rgba(106,170,100,0.1)';
    } else if (playerCount === botCount) {
      verdictText = 'Tied with optimal play!';
      verdictColor = 'var(--green)'; verdictBg = 'rgba(106,170,100,0.1)';
    } else {
      verdictText = `Bot wins by ${playerCount - botCount} guess${playerCount - botCount > 1 ? 'es' : ''}`;
      verdictColor = 'var(--orange)'; verdictBg = 'rgba(245,158,11,0.1)';
    }

    const insightsHtml = insights.map(i => `<div class="wordrobot-insight">${i}</div>`).join('');

    container.innerHTML = `
      <div class="wordrobot-panel">
        <div class="wordrobot-header">🤖 Wordrobot Analysis</div>

        <div class="wordrobot-guesses">
          <div class="wordrobot-guess-row wg-header">
            <span class="wg-num">#</span>
            <span class="wg-word">Your Guesses</span>
            <span class="wg-stat">Skill</span>
            <span class="wg-stat">Luck</span>
            <span class="wg-remaining">Remaining</span>
          </div>
          ${guessRowsHtml}
        </div>

        <div class="wordrobot-scores">
          <div class="wordrobot-score-box">
            <div class="score-icon">🎯</div>
            <div class="score-label">Overall Skill</div>
            <div class="score-number" id="wordrobot-skill-num">0</div>
            <div class="wordrobot-bar"><div class="wordrobot-bar-fill skill-bar" style="width:${skill}%"></div></div>
          </div>
          <div class="wordrobot-score-box">
            <div class="score-icon">🍀</div>
            <div class="score-label">Overall Luck</div>
            <div class="score-number" id="wordrobot-luck-num">0</div>
            <div class="wordrobot-bar"><div class="wordrobot-bar-fill luck-bar" style="width:${luck}%"></div></div>
          </div>
        </div>

        <div class="wordrobot-comparison">
          <div class="wordrobot-comp-header">⚔️ You vs Wordrobot</div>
          <div class="wordrobot-vs">
            <div class="wordrobot-vs-side">
              <div class="vs-label">You</div>
              <div class="vs-count">${playerFailed ? '✗' : playerCount}</div>
              <div class="vs-unit">${playerFailed ? 'failed' : 'guess' + (playerCount !== 1 ? 'es' : '')}</div>
              <div class="vs-guesses">${perGuess.map(g => `<div class="bot-guess-row">${_renderMiniTiles(g)}</div>`).join('')}</div>
            </div>
            <div class="wordrobot-vs-divider">vs</div>
            <div class="wordrobot-vs-side">
              <div class="vs-label">Wordrobot 🤖</div>
              <div class="vs-count">${botCount || '?'}</div>
              <div class="vs-unit">guess${botCount !== 1 ? 'es' : ''}</div>
              <div class="vs-guesses">${botRowsHtml}</div>
            </div>
          </div>
          <div class="wordrobot-verdict" style="color:${verdictColor};background:${verdictBg}">
            ${verdictText}
          </div>
        </div>

        <div class="wordrobot-insights">
          <h4>💡 Insights</h4>
          ${insightsHtml}
        </div>

        <button class="btn btn-primary" id="wordrobot-continue" style="min-width:140px">
          Continue →
        </button>
      </div>
    `;

    // Animate score count-up
    const animateCount = (elId, target) => {
      const el = document.getElementById(elId);
      if (!el) return;
      const dur = 800, start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 100);
    };
    animateCount('wordrobot-skill-num', skill);
    animateCount('wordrobot-luck-num', luck);

    document.getElementById('wordrobot-continue').addEventListener('click', () => showNextOrFinish());
  });
}

