// ==================== NUMBOT ANALYSIS ====================

// --- Equation enumeration cache ---
const _ncEquationCache = {};
let _ncBankStrings = null, _ncBankCodes = null;

function _enumerateEquations(length, ops) {
  const key = length + '-' + ops.join('');
  if (_ncEquationCache[key]) return _ncEquationCache[key];
  const results = [];
  for (const op of ops) {
    // Determine ranges for A and B based on operator
    let aMax, bMax;
    if (op === '+') { aMax = 999; bMax = 999; }
    else if (op === '-') { aMax = 999; bMax = 999; }
    else if (op === '*') { aMax = 999; bMax = 999; }
    else if (op === '/') { aMax = 999; bMax = 99; }
    else continue;

    for (let a = (op === '/' ? 1 : 0); a <= aMax; a++) {
      // Skip leading zeros: a can be 0 only as single digit
      const aStr = '' + a;
      if (aStr.length > 1 && aStr[0] === '0') continue;

      for (let b = (op === '-' ? 0 : (op === '/' ? 1 : 0)); b <= bMax; b++) {
        const bStr = '' + b;
        if (bStr.length > 1 && bStr[0] === '0') continue;

        let c;
        if (op === '+') c = a + b;
        else if (op === '-') { c = a - b; if (c < 0) continue; }
        else if (op === '*') c = a * b;
        else if (op === '/') { if (b === 0) continue; if (a % b !== 0) continue; c = a / b; }
        if (!Number.isInteger(c) || c < 0) continue;

        const cStr = '' + c;
        if (cStr.length > 1 && cStr[0] === '0') continue;

        const eq = aStr + op + bStr + '=' + cStr;
        if (eq.length === length) results.push(eq);
      }
    }
  }
  _ncEquationCache[key] = results;
  return results;
}

function _ensureNcCodes(length, ops) {
  const bank = _enumerateEquations(length, ops);
  _ncBankStrings = bank;
  _ncBankCodes = bank.map(eq => {
    const codes = [];
    for (let i = 0; i < eq.length; i++) codes.push(eq.charCodeAt(i));
    return codes;
  });
}

// --- Generic variable-length feedback ---
function _ncFbNum(gc, ac, len) {
  // Clone answer codes for marking
  const aUsed = new Uint8Array(len); // 0=available
  const rr = new Uint8Array(len);    // 0=absent,1=present,2=correct
  // Pass 1: exact matches
  for (let i = 0; i < len; i++) {
    if (gc[i] === ac[i]) { rr[i] = 2; aUsed[i] = 1; }
  }
  // Pass 2: present
  for (let i = 0; i < len; i++) {
    if (rr[i] === 2) continue;
    for (let j = 0; j < len; j++) {
      if (!aUsed[j] && gc[i] === ac[j]) { rr[i] = 1; aUsed[j] = 1; break; }
    }
  }
  // Encode as base-3 number
  let fb = 0;
  for (let i = 0; i < len; i++) fb = fb * 3 + rr[i];
  return fb;
}

function _ncFbNumToResult(num, len) {
  const labels = ['absent', 'present', 'correct'];
  const result = [];
  for (let i = len - 1; i >= 0; i--) {
    result[i] = labels[num % 3];
    num = (num / 3) | 0;
  }
  return result;
}

function _ncResultToFbNum(result) {
  const m = { correct: 2, present: 1, absent: 0 };
  let fb = 0;
  for (let i = 0; i < result.length; i++) fb = fb * 3 + m[result[i]];
  return fb;
}

// --- Solver ---
function numbotSolve(answer, difficulty) {
  const configs = {
    easy:    { length: 6, ops: ['+','-'] },
    medium:  { length: 7, ops: ['+','-'] },
    hard:    { length: 8, ops: ['+','-','*'] },
    extreme: { length: 8, ops: ['+','-','*','/'] },
    impossible: { length: 8, ops: ['+','-','*','/'] }
  };
  const cfg = configs[difficulty] || configs.easy;
  _ensureNcCodes(cfg.length, cfg.ops);
  const len = cfg.length;
  const hardMode = (difficulty === 'hard' || difficulty === 'extreme' || difficulty === 'impossible');
  const bankCodes = _ncBankCodes;
  const bankStrings = _ncBankStrings;
  const answerCodes = [];
  for (let i = 0; i < len; i++) answerCodes.push(answer.charCodeAt(i));

  const totalBuckets = Math.pow(3, len);
  const ALL_GREEN = totalBuckets - 1; // all 2's in base 3
  const buckets = new Int32Array(totalBuckets);
  let remaining = bankCodes.map((_, i) => i);
  const botGuesses = [];
  const knownCorrect = {}; // pos -> charCode
  const knownPresent = new Set(); // charCodes that must appear

  while (remaining.length > 0 && botGuesses.length < 10) {
    let bestIdx = remaining[0], bestEntropy = -1;
    const n = remaining.length;

    if (n <= 2) {
      bestIdx = remaining[0];
    } else {
      const remainSet = new Set(remaining);
      // For large banks, only search remaining candidates as guesses to keep fast
      const searchSet = bankCodes.length > 3000 ? remaining : bankCodes.map((_, i) => i);
      for (const gi of searchSet) {
        // Hard mode: skip guesses that don't satisfy constraints
        if (hardMode && botGuesses.length > 0) {
          const gc = bankCodes[gi];
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
        const gc = bankCodes[gi];
        buckets.fill(0, 0, totalBuckets);
        for (const ci of remaining) buckets[_ncFbNum(gc, bankCodes[ci], len)]++;
        let entropy = 0;
        for (let b = 0; b < totalBuckets; b++) {
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

    const guessWord = bankStrings[bestIdx];
    const fbN = _ncFbNum(bankCodes[bestIdx], answerCodes, len);
    const result = _ncFbNumToResult(fbN, len);
    botGuesses.push({ word: guessWord, result });

    // Update hard mode constraints
    if (hardMode) {
      for (let i = 0; i < len; i++) {
        if (result[i] === 'correct') {
          knownCorrect[i] = bankCodes[bestIdx][i];
          knownPresent.delete(bankCodes[bestIdx][i]);
        } else if (result[i] === 'present') {
          knownPresent.add(bankCodes[bestIdx][i]);
        }
      }
    }

    if (fbN === ALL_GREEN) break;
    remaining = remaining.filter(ci => _ncFbNum(bankCodes[bestIdx], bankCodes[ci], len) === fbN);
  }

  return botGuesses;
}

// --- Analysis ---
function computeNumbotAnalysis(state) {
  const configs = {
    easy:    { length: 6, ops: ['+','-'] },
    medium:  { length: 7, ops: ['+','-'] },
    hard:    { length: 8, ops: ['+','-','*'] },
    extreme: { length: 8, ops: ['+','-','*','/'] },
    impossible: { length: 8, ops: ['+','-','*','/'] }
  };
  const diff = (state.puzzle && state.puzzle.difficulty) || 'easy';
  const cfg = configs[diff] || configs.easy;
  _ensureNcCodes(cfg.length, cfg.ops);
  const len = cfg.length;
  const bankCodes = _ncBankCodes;
  const bankStrings = _ncBankStrings;
  const guesses = state.guesses;
  const numGuesses = guesses.length;
  const perGuess = [];
  const totalBuckets = Math.pow(3, len);
  const ALL_GREEN = totalBuckets - 1;
  const buckets = new Int32Array(totalBuckets);

  let remaining = bankCodes.map((_, i) => i);

  for (let g = 0; g < numGuesses; g++) {
    const guess = guesses[g];
    const guessWord = guess.word;
    const gc = [];
    for (let i = 0; i < len; i++) gc.push(guessWord.charCodeAt(i));
    const n = remaining.length;
    let guessSkill, guessLuck = 50;

    if (n <= 1) {
      guessSkill = (n === 1 && bankStrings[remaining[0]] === guessWord) ? 100 : 0;
    } else if (n === 2) {
      guessSkill = (bankStrings[remaining[0]] === guessWord || bankStrings[remaining[1]] === guessWord) ? 100 : 50;
    } else {
      // Player entropy
      buckets.fill(0, 0, totalBuckets);
      for (let ri = 0; ri < n; ri++) buckets[_ncFbNum(gc, bankCodes[remaining[ri]], len)]++;
      let playerEntropy = 0;
      for (let b = 0; b < totalBuckets; b++) {
        if (buckets[b] > 0) { const p = buckets[b] / n; playerEntropy -= p * Math.log2(p); }
      }

      // Best entropy (search remaining candidates only for speed)
      let bestEntropy = 0;
      for (let ai = 0; ai < remaining.length; ai++) {
        const agi = remaining[ai];
        const agc = bankCodes[agi];
        buckets.fill(0, 0, totalBuckets);
        for (let ri = 0; ri < n; ri++) buckets[_ncFbNum(agc, bankCodes[remaining[ri]], len)]++;
        let ent = 0;
        for (let b = 0; b < totalBuckets; b++) {
          if (buckets[b] > 0) { const p = buckets[b] / n; ent -= p * Math.log2(p); }
        }
        if (ent > bestEntropy) bestEntropy = ent;
      }
      if (playerEntropy > bestEntropy) bestEntropy = playerEntropy;
      guessSkill = bestEntropy > 0 ? Math.round((playerEntropy / bestEntropy) * 100) : 100;
    }

    // Luck: elimination percentile
    if (n > 1) {
      buckets.fill(0, 0, totalBuckets);
      for (let ri = 0; ri < n; ri++) buckets[_ncFbNum(gc, bankCodes[remaining[ri]], len)]++;
      const actualFbN = _ncResultToFbNum(guess.result);
      const actualCount = buckets[actualFbN] || 0;
      const actualEliminated = n - actualCount;
      let fewerCandidates = 0, equalCandidates = 0;
      for (let b = 0; b < totalBuckets; b++) {
        if (buckets[b] > 0) {
          const elim = n - buckets[b];
          if (elim < actualEliminated) fewerCandidates += buckets[b];
          else if (elim === actualEliminated) equalCandidates += buckets[b];
        }
      }
      guessLuck = Math.round((fewerCandidates + equalCandidates * 0.5) / n * 100);
    }

    // Filter remaining
    const actualFbN = _ncResultToFbNum(guess.result);
    const newRemaining = [];
    for (let ri = 0; ri < remaining.length; ri++) {
      if (_ncFbNum(gc, bankCodes[remaining[ri]], len) === actualFbN) newRemaining.push(remaining[ri]);
    }

    const totalBank = bankCodes.length;
    const eqsLeftCount = newRemaining.length;
    const displayEqs = newRemaining.slice(0, 5).map(idx => bankStrings[idx]);
    const eqsLeftList = eqsLeftCount < 5 && eqsLeftCount > 0
      ? `${eqsLeftCount}/${totalBank}: ${displayEqs.join(', ')}`
      : `${eqsLeftCount}/${totalBank}`;

    perGuess.push({
      word: guess.word, result: guess.result,
      skill: Math.min(guessSkill, 100), luck: guessLuck,
      remaining: n,
      eqsLeftCount, eqsLeftList
    });

    if (actualFbN === ALL_GREEN) { remaining = []; }
    else { remaining = newRemaining; }
  }

  // Overall scores
  const skillScores = perGuess.map(g => g.skill);
  const skill = Math.round(skillScores.reduce((a, b) => a + b, 0) / skillScores.length);

  let luckWeighted = 0, luckTotalW = 0;
  perGuess.forEach((g, i) => {
    const w = i === 0 ? 2 : 1;
    luckWeighted += g.luck * w;
    luckTotalW += w;
  });
  const luck = luckTotalW > 0 ? Math.round(luckWeighted / luckTotalW) : 50;

  // Insights
  const insights = [];
  const ka = new Set(), kp = {}, kc = {};
  for (let g = 0; g < numGuesses; g++) {
    const guess = guesses[g];
    if (g >= 1) {
      for (let i = 0; i < len; i++) {
        if (ka.has(guess.word[i])) {
          insights.push(`Guess ${g+1}: You reused <strong>${guess.word[i]}</strong> which was already gray`);
          break;
        }
      }
      for (let i = 0; i < len; i++) {
        if (kp[guess.word[i]] && kp[guess.word[i]].has(i)) {
          insights.push(`Guess ${g+1}: <strong>${guess.word[i]}</strong> was orange in position ${i+1} before — try it elsewhere`);
          break;
        }
      }
    }
    for (let i = 0; i < len; i++) {
      const ch = guess.word[i];
      if (guess.result[i] === 'correct') { kc[i] = ch; delete kp[ch]; }
      else if (guess.result[i] === 'present') { if (!kp[ch]) kp[ch] = new Set(); kp[ch].add(i); }
      else { if (!guess.result.some((r, j) => j !== i && guess.word[j] === ch && (r === 'correct' || r === 'present'))) ka.add(ch); }
    }
  }

  // Check if = position known but not exploited
  if (numGuesses >= 2) {
    const g1 = guesses[0];
    const eqPos = g1.word.indexOf('=');
    if (eqPos >= 0 && g1.result[eqPos] === 'correct') {
      for (let g = 1; g < numGuesses; g++) {
        if (guesses[g].word[eqPos] !== '=') {
          insights.push('The = position was locked in — use it to narrow down operand sizes');
          break;
        }
      }
    }
  }

  if (numGuesses >= 2) {
    const g1Chars = new Set(guesses[0].word.split(''));
    if (guesses[1].word.split('').filter(c => g1Chars.has(c)).length > Math.ceil(len * 0.6))
      insights.push('Try guesses with more unique characters to gather info faster');
  }
  if (numGuesses === 1 && state.won) insights.push('Incredible! Pure instinct (or luck).');
  if (numGuesses >= 1) {
    const g1g = guesses[0].result.filter(r => r === 'correct').length;
    if (g1g >= 2) insights.push(`Lucky start — ${g1g} blues on your opening guess!`);
  }
  if (skill >= 70 && luck <= 35) insights.push('Great deduction despite tough breaks!');
  else if (skill <= 35 && luck >= 70) insights.push('You got lucky! Pay more attention to the clues.');
  const finalInsights = insights.slice(0, 3);
  if (finalInsights.length === 0) finalInsights.push(state.won ? 'Solid play — well done!' : 'Tough equation! Keep practicing.');

  return { skill, luck, perGuess, insights: finalInsights };
}

function _renderNcMiniTiles(guess) {
  return guess.word.split('').map((ch, i) =>
    `<span class="nb-mini-tile ${guess.result[i]}">${ch}</span>`
  ).join('');
}

function _ncScoreColor(val, type) {
  if (type === 'skill') return val >= 70 ? 'var(--green)' : val >= 40 ? 'var(--orange)' : 'var(--red)';
  return val >= 70 ? '#a78bfa' : val >= 40 ? '#6366f1' : '#818cf8';
}

function showNumbotAnalysis() {
  const state = GS.challengeState.numcrunch;
  if (!state) { showNextOrFinish(); return; }

  const playerCount = state.guesses.length;
  const playerFailed = !state.won;

  const container = document.getElementById('game-container');
  container.innerHTML = `
    <div class="numbot-panel">
      <div class="numbot-header">🔢 Numbot Analysis</div>
      <div style="text-align:center;padding:32px 0;color:var(--fg2);font-size:14px">
        Analyzing your guesses...
      </div>
    </div>
  `;

  const analysisPromise = state._bgAnalysis || new Promise(resolve => {
    setTimeout(() => {
      try { resolve(computeNumbotAnalysis(state)); }
      catch(e) { console.error('Numbot analysis failed:', e); resolve(null); }
    }, 100);
  });
  const solverPromise = state._bgSolver || new Promise(resolve => {
    setTimeout(() => {
      try { resolve(numbotSolve(state.puzzle.equation, state.puzzle.difficulty)); }
      catch(e) { console.error('Numbot solver failed:', e); resolve([]); }
    }, 100);
  });

  Promise.all([analysisPromise, solverPromise]).then(([analysis, botGuessesResult]) => {
    if (!analysis) { showNextOrFinish(); return; }
    const { skill, luck, perGuess, insights } = analysis;
    const botGuesses = botGuessesResult || [];
    const botCount = botGuesses.length;

    const guessRowsHtml = perGuess.map((g, i) => {
      return `
      <div class="numbot-guess-row">
        <span class="nb-num">${i + 1}</span>
        <span class="nb-word">${_renderNcMiniTiles(g)}</span>
        <span class="nb-stat" style="color:${_ncScoreColor(g.skill,'skill')}">${g.skill}</span>
        <span class="nb-stat" style="color:${_ncScoreColor(g.luck,'luck')}">${g.luck}</span>
        <span class="nb-remaining" style="color:var(--fg2)">${g.eqsLeftList}</span>
      </div>`;
    }).join('');

    const botRowsHtml = botGuesses.map((g, i) => `
      <div class="bot-guess-row">
        ${_renderNcMiniTiles(g)}
      </div>
    `).join('');

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

    const insightsHtml = insights.map(i => `<div class="numbot-insight">${i}</div>`).join('');

    container.innerHTML = `
      <div class="numbot-panel">
        <div class="numbot-header">🔢 Numbot Analysis</div>

        <div class="numbot-guesses">
          <div class="numbot-guess-row nb-header">
            <span class="nb-num">#</span>
            <span class="nb-word">Your Guesses</span>
            <span class="nb-stat">Skill</span>
            <span class="nb-stat">Luck</span>
            <span class="nb-remaining">Remaining</span>
          </div>
          ${guessRowsHtml}
        </div>

        <div class="numbot-scores">
          <div class="numbot-score-box">
            <div class="score-icon">🎯</div>
            <div class="score-label">Overall Skill</div>
            <div class="score-number" id="numbot-skill-num">0</div>
            <div class="numbot-bar"><div class="numbot-bar-fill skill-bar" style="width:${skill}%"></div></div>
          </div>
          <div class="numbot-score-box">
            <div class="score-icon">🍀</div>
            <div class="score-label">Overall Luck</div>
            <div class="score-number" id="numbot-luck-num">0</div>
            <div class="numbot-bar"><div class="numbot-bar-fill luck-bar" style="width:${luck}%"></div></div>
          </div>
        </div>

        <div class="numbot-comparison">
          <div class="numbot-comp-header">⚔️ You vs Numbot</div>
          <div class="numbot-vs">
            <div class="numbot-vs-side">
              <div class="vs-label">You</div>
              <div class="vs-count">${playerFailed ? '✗' : playerCount}</div>
              <div class="vs-unit">${playerFailed ? 'failed' : 'guess' + (playerCount !== 1 ? 'es' : '')}</div>
              <div class="vs-guesses">${perGuess.map(g => `<div class="bot-guess-row">${_renderNcMiniTiles(g)}</div>`).join('')}</div>
            </div>
            <div class="numbot-vs-divider">vs</div>
            <div class="numbot-vs-side">
              <div class="vs-label">Numbot 🔢</div>
              <div class="vs-count">${botCount || '?'}</div>
              <div class="vs-unit">guess${botCount !== 1 ? 'es' : ''}</div>
              <div class="vs-guesses">${botRowsHtml}</div>
            </div>
          </div>
          <div class="numbot-verdict" style="color:${verdictColor};background:${verdictBg}">
            ${verdictText}
          </div>
        </div>

        <div class="numbot-insights">
          <h4>💡 Insights</h4>
          ${insightsHtml}
        </div>

        <button class="btn btn-primary" id="numbot-continue" style="min-width:140px">
          Continue →
        </button>
      </div>
    `;

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
    animateCount('numbot-skill-num', skill);
    animateCount('numbot-luck-num', luck);

    document.getElementById('numbot-continue').addEventListener('click', () => showNextOrFinish());
  });
}

