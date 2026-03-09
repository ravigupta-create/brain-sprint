// ==================== WORD SCRAMBLE ====================

const SCRAMBLE_WORDS = {
  easy: ['cake','tree','fish','lamp','bird','rain','star','frog','milk','moon','bear','gift','snow','wave','sail','jump','pink','gold','nest','leaf','wing','door','bell','ring','fire','book','hand','pool','road','hill'],
  medium: ['brain','water','house','light','dream','stone','flame','cloud','grape','ocean','magic','tiger','plant','frost','honey','river','queen','angel','candy','lemon','steel','crown','globe','medal','pearl','swift'],
  hard: ['bridge','castle','garden','stream','forest','temple','rocket','silver','puzzle','knight','planet','marble','frozen','shadow','dragon','beacon','jungle','sunset','velvet','spirit','throne','voyage','harbor','wonder'],
  extreme: ['journey','mystery','kingdom','crystal','phoenix','harmony','thunder','fantasy','warrior','diamond','volcano','glacier','compass','feather','illusion','chimney','lantern','mustard','whisper','blossom','network','cabinet','stadium','quantum'],
  impossible: ['treasure','elephant','mountain','universe','champion','calendar','daughter','exercise','fortress','guardian','metaphor','spectrum','labyrinth','symphony','midnight','question','wanderer','strength','absolute','business']
};

function getScramblePuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { rounds: 5, timePerWord: 20, hintLetters: 2 },
    medium:     { rounds: 6, timePerWord: 15, hintLetters: 1 },
    hard:       { rounds: 7, timePerWord: 12, hintLetters: 0 },
    extreme:    { rounds: 8, timePerWord: 10, hintLetters: 0 },
    impossible: { rounds: 8, timePerWord: 8,  hintLetters: 0 }
  };
  const cfg = configs[diff];
  const pool = SCRAMBLE_WORDS[diff] || SCRAMBLE_WORDS.medium;
  const words = [];
  const used = new Set();
  for (let i = 0; i < cfg.rounds; i++) {
    let word;
    do { word = rngPick(pool); } while (used.has(word));
    used.add(word);
    words.push(word);
  }
  return { words, ...cfg, difficulty: diff };
}

function renderScramble(puzzle) {
  const state = {
    puzzle,
    round: 0,
    correct: 0,
    wrong: 0,
    currentWord: '',
    scrambled: '',
    timeLeft: 0,
    timer: null,
    hintUsed: false,
    done: false
  };
  GS.challengeState.scramble = state;
  showScrambleRound(state);
}

function showScrambleRound(state) {
  if (state.round >= state.puzzle.words.length) {
    finishScramble(state);
    return;
  }

  state.currentWord = state.puzzle.words[state.round];
  state.hintUsed = false;
  state.timeLeft = state.puzzle.timePerWord;

  // Scramble the word (make sure it's different from original)
  let scrambled;
  let attempts = 0;
  do {
    scrambled = state.currentWord.split('').sort(() => GS.rng() - 0.5).join('');
    attempts++;
  } while (scrambled === state.currentWord && attempts < 20);
  state.scrambled = scrambled;

  const c = document.getElementById('game-container');
  let hintHtml = '';
  if (state.puzzle.hintLetters > 0) {
    const hint = state.currentWord.slice(0, state.puzzle.hintLetters);
    hintHtml = `<div class="scramble-hint">Starts with: <strong>${hint.toUpperCase()}</strong></div>`;
  }

  c.innerHTML = `<div class="scramble-game">
    <div class="scramble-header">
      <span>Round ${state.round + 1} / ${state.puzzle.words.length}</span>
      <span>✓${state.correct} ✗${state.wrong}</span>
      <span>⏱ <span id="scr-time">${GS.timerEnabled ? state.timeLeft : '∞'}</span>s</span>
    </div>
    <div class="scramble-letters" id="scr-letters">
      ${scrambled.split('').map(l => `<span class="scramble-letter">${l.toUpperCase()}</span>`).join('')}
    </div>
    ${hintHtml}
    <input type="text" class="scramble-input" id="scr-input" placeholder="Type the word..." autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="${state.currentWord.length + 2}">
    <button class="btn btn-primary btn-lg" onclick="submitScrambleWord()" style="width:100%;margin-top:8px">Submit</button>
    <button class="btn btn-secondary" onclick="skipScrambleWord()" style="width:100%;margin-top:6px;font-size:13px">Skip →</button>
  </div>`;

  const input = document.getElementById('scr-input');
  input.focus();
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitScrambleWord();
  });

  if (GS.timerEnabled) {
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(() => {
      state.timeLeft--;
      const el = document.getElementById('scr-time');
      if (el) {
        el.textContent = state.timeLeft;
        if (state.timeLeft <= 3) el.style.color = 'var(--red)';
      }
      if (state.timeLeft <= 0) {
        skipScrambleWord();
      }
    }, 1000);
  }
}

function submitScrambleWord() {
  const state = GS.challengeState.scramble;
  if (state.done) return;
  if (state.timer) clearInterval(state.timer);

  const input = document.getElementById('scr-input');
  const answer = input.value.trim().toLowerCase();
  if (!answer) return;

  if (answer === state.currentWord) {
    state.correct++;
    SFX.correct();
  } else {
    state.wrong++;
    SFX.wrong();
  }

  // Brief feedback
  const letters = document.getElementById('scr-letters');
  if (letters) {
    letters.innerHTML = state.currentWord.split('').map(l => `<span class="scramble-letter scramble-solved">${l.toUpperCase()}</span>`).join('');
  }

  state.round++;
  setTimeout(() => showScrambleRound(state), 600);
}

function skipScrambleWord() {
  const state = GS.challengeState.scramble;
  if (state.done) return;
  if (state.timer) clearInterval(state.timer);
  state.wrong++;
  SFX.wrong();

  const letters = document.getElementById('scr-letters');
  if (letters) {
    letters.innerHTML = state.currentWord.split('').map(l => `<span class="scramble-letter scramble-missed">${l.toUpperCase()}</span>`).join('');
  }

  state.round++;
  setTimeout(() => showScrambleRound(state), 800);
}

function finishScramble(state) {
  state.done = true;
  if (state.timer) clearInterval(state.timer);
  const score = Math.round((state.correct / state.puzzle.words.length) * 100);

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('scramble', score);
    lsSet('daily-scramble-state-' + getDailyDateStr(), { correct: state.correct, wrong: state.wrong, total: state.puzzle.words.length });
  }
  showChallengeSummary({
    emoji: score === 100 ? '🔀' : score >= 60 ? '📝' : '🤔',
    score,
    title: score >= 90 ? 'Anagram Ace!' : score >= 60 ? 'Good Unscrambling!' : 'Tricky Letters!',
    stats: [
      { label: 'Correct', value: `${state.correct} / ${state.puzzle.words.length}` },
      { label: 'Skipped/Wrong', value: state.wrong }
    ]
  });
}
