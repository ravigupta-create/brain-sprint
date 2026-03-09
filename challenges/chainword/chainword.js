// ==================== CHALLENGE 22: WORD CHAIN ====================

const CHAIN_WORD_BANK = [
  'apple','plane','earth','heart','three','house','mouse','stone','store','tower',
  'water','later','watch','match','march','chart','chair','chain','china','shine',
  'share','shark','sharp','shape','shade','shale','whale','while','white','write',
  'right','light','night','sight','siren','risen','river','diver','liver','lived',
  'loved','lover','cover','coven','oven','over','open','opera','alter','amber',
  'ember','ever','even','event','invent','intent','tent','sent','lent','rent',
  'dent','deny','many','mane','cane','came','cape','tape','tale','pale',
  'page','cage','care','dare','bare','bark','dark','dart','cart','card',
  'ward','warm','worm','word','cord','corn','horn','born','burn','turn',
  'torn','town','down','dawn','drawn','drain','train','trail','trial','tribal',
  'brain','grain','rain','pain','paid','said','sail','tail','tall','wall',
  'walk','talk','tank','bank','band','land','lane','lake','bake','make',
  'wake','wave','cave','gave','have','hive','five','fire','tire','wire',
  'wide','ride','hide','side','slide','glide','guide','pride','bride','bridge',
  'ridge','ledge','hedge','wedge','edge','fudge','judge','nudge','budge','badge',
  'blade','blame','flame','frame','crane','grape','drape','crepe','grade','trade',
  'space','place','peace','beach','reach','teach','peach','leach','least','feast',
  'beast','yeast','toast','coast','boast','roast','ghost','those','chose','close',
  'stone','phone','drone','prone','prune','plume','flume','flute','brute','route',
  'trout','shout','scout','snout','stout','spout','sprout','about','doubt','count',
  'mount','found','sound','round','bound','pound','mound','wound','cloud','proud',
  'crowd','crown','brown','grown','blown','flown','known','shown','throw','glow',
  'flow','slow','snow','know','grow','blow','plow','crow','brow','brew'
];

function getChainwordPuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:       { chainLen: 4, timePerWord: 15, minWordLen: 3, showHint: true },
    medium:     { chainLen: 5, timePerWord: 12, minWordLen: 3, showHint: true },
    hard:       { chainLen: 6, timePerWord: 10, minWordLen: 4, showHint: false },
    extreme:    { chainLen: 7, timePerWord: 8,  minWordLen: 4, showHint: false },
    impossible: { chainLen: 8, timePerWord: 6,  minWordLen: 5, showHint: false }
  };
  return { ...(configs[d] || configs.medium), difficulty: d };
}

function renderChainword(puzzle) {
  document.getElementById('btn-submit-challenge').style.display = 'none';

  // Pick a starting word
  const validStarters = CHAIN_WORD_BANK.filter(w => w.length >= puzzle.minWordLen);
  const startWord = rngPick(validStarters);

  GS.challengeState.chainword = {
    puzzle,
    chain: [startWord],
    currentIdx: 1,
    timeLeft: puzzle.timePerWord,
    timer: null,
    score: 0,
    gameOver: false,
    maxChain: puzzle.chainLen
  };

  drawChainword();
  startChainwordTimer();
}

function drawChainword() {
  const st = GS.challengeState.chainword;
  const c = document.getElementById('game-container');
  const lastWord = st.chain[st.chain.length - 1];
  const lastChar = lastWord[lastWord.length - 1].toUpperCase();

  let html = '<div class="chain-container">';
  html += `<div class="chain-stats">`;
  html += `<span>Chain: <strong>${st.chain.length}</strong> / ${st.maxChain}</span>`;
  html += `<span class="chain-timer ${st.timeLeft <= 3 ? 'chain-timer-low' : ''}" id="chain-timer">${st.timeLeft}s</span>`;
  html += `</div>`;

  // Show chain
  html += '<div class="chain-words">';
  st.chain.forEach((w, i) => {
    const isLast = i === st.chain.length - 1;
    html += `<span class="chain-word ${isLast ? 'chain-word-current' : ''}">${w}</span>`;
    if (i < st.chain.length - 1) html += '<span class="chain-arrow">→</span>';
  });
  html += '</div>';

  html += `<div class="chain-prompt">Enter a word starting with "<strong>${lastChar}</strong>"</div>`;

  if (st.puzzle.showHint) {
    html += `<div class="chain-hint">The word must start with the last letter of the previous word</div>`;
  }

  html += `<div class="chain-input-row">`;
  html += `<input type="text" class="chain-input" id="chain-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type a word...">`;
  html += `<button class="btn btn-primary" onclick="submitChainword()">Go</button>`;
  html += `</div>`;

  html += '<div class="chain-feedback" id="chain-feedback"></div>';
  html += '</div>';
  c.innerHTML = html;

  const input = document.getElementById('chain-input');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submitChainword(); }
  });
  setTimeout(() => input.focus(), 100);
}

function startChainwordTimer() {
  const st = GS.challengeState.chainword;
  st.timeLeft = st.puzzle.timePerWord;
  if (st.timer) clearInterval(st.timer);

  if (GS.timerEnabled) {
    st.timer = setInterval(() => {
      st.timeLeft--;
      const timerEl = document.getElementById('chain-timer');
      if (timerEl) {
        timerEl.textContent = st.timeLeft + 's';
        if (st.timeLeft <= 3) timerEl.classList.add('chain-timer-low');
      }

      if (st.timeLeft <= 0) {
        clearInterval(st.timer);
        st.gameOver = true;
        SFX.wrong();
        const feedback = document.getElementById('chain-feedback');
        if (feedback) {
          feedback.textContent = 'Time\'s up!';
          feedback.className = 'chain-feedback chain-fb-wrong';
        }
        setTimeout(() => endChainword(), 1200);
      }
    }, 1000);
  } else {
    const timerEl = document.getElementById('chain-timer');
    if (timerEl) timerEl.textContent = '∞';
  }
}

function submitChainword() {
  const st = GS.challengeState.chainword;
  if (st.gameOver) return;

  const input = document.getElementById('chain-input');
  const word = input.value.trim().toLowerCase();
  const feedback = document.getElementById('chain-feedback');

  if (!word) return;

  const lastWord = st.chain[st.chain.length - 1];
  const requiredChar = lastWord[lastWord.length - 1].toLowerCase();

  // Validate: starts with last letter
  if (word[0] !== requiredChar) {
    if (feedback) {
      feedback.textContent = `Word must start with "${requiredChar.toUpperCase()}"!`;
      feedback.className = 'chain-feedback chain-fb-wrong';
    }
    SFX.wrong();
    input.value = '';
    input.focus();
    return;
  }

  // Validate: min length
  if (word.length < st.puzzle.minWordLen) {
    if (feedback) {
      feedback.textContent = `Word must be at least ${st.puzzle.minWordLen} letters!`;
      feedback.className = 'chain-feedback chain-fb-wrong';
    }
    SFX.wrong();
    input.value = '';
    input.focus();
    return;
  }

  // Validate: not already used
  if (st.chain.includes(word)) {
    if (feedback) {
      feedback.textContent = 'Already used that word!';
      feedback.className = 'chain-feedback chain-fb-wrong';
    }
    SFX.wrong();
    input.value = '';
    input.focus();
    return;
  }

  // Validate: only letters
  if (!/^[a-z]+$/.test(word)) {
    if (feedback) {
      feedback.textContent = 'Only letters allowed!';
      feedback.className = 'chain-feedback chain-fb-wrong';
    }
    input.value = '';
    input.focus();
    return;
  }

  // Accept the word (we're lenient — any English-looking word is accepted)
  st.chain.push(word);
  st.score++;
  SFX.correct();

  // Check if chain is complete
  if (st.chain.length >= st.maxChain) {
    clearInterval(st.timer);
    st.gameOver = true;
    if (feedback) {
      feedback.textContent = 'Chain complete!';
      feedback.className = 'chain-feedback chain-fb-correct';
    }
    setTimeout(() => endChainword(), 1000);
    return;
  }

  // Next word
  clearInterval(st.timer);
  drawChainword();
  startChainwordTimer();
}

function endChainword() {
  const st = GS.challengeState.chainword;
  if (st.timer) clearInterval(st.timer);

  const targetLinks = st.maxChain - 1; // links needed beyond starting word
  const achievedLinks = st.chain.length - 1;
  const score = Math.min(100, Math.round((achievedLinks / targetLinks) * 100));

  GS.results.chainword = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('chainword', score);
    lsSet('daily-chainword-state-' + getDailyDateStr(), {
      chain: st.chain, targetLen: st.maxChain
    });
  }

  let chainReview = '';
  st.chain.forEach((w, i) => {
    chainReview += `<span class="cs-tag found">${w}</span>`;
    if (i < st.chain.length - 1) chainReview += ' → ';
  });

  showChallengeSummary({
    emoji: score >= 80 ? '🔗' : score >= 50 ? '⛓️' : '💔',
    score,
    title: score === 100 ? 'Perfect Chain!' : score >= 80 ? 'Great Links!' : score >= 50 ? 'Decent Chain' : 'Chain Broken!',
    stats: [
      { label: 'Chain length', value: st.chain.length },
      { label: 'Target', value: st.maxChain },
      { label: 'Min word length', value: st.puzzle.minWordLen }
    ],
    miniReview: chainReview
  });
}
