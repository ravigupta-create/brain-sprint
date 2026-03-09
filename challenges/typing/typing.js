// ==================== TYPING SPEED ====================

const TYPING_WORDS = {
  easy: ['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','day','get','has','him','his','how','its','may','new','now','old','see','way','who','boy','did','cat','dog','run','big','let','say','she','too','use','red','sun','top','hat','hot','cup','fun','sit','bed','box'],
  medium: ['about','after','again','being','could','every','first','found','great','house','large','learn','never','other','place','plant','point','right','small','sound','spell','still','study','their','there','these','thing','think','those','three','under','water','where','which','world','would','write','young','above','along','began','below','city','close','earth','eight','field','group','heart','horse'],
  hard: ['ability','achieve','address','advance','against','already','another','because','believe','between','brought','capital','century','certain','chapter','changed','climate','college','company','control','country','culture','current','decided','defense','deliver','despite','develop','digital','economy','element','english','evening','exactly','example','explain','express','extreme','factors','feature','finally','foreign','forward','freedom','further','general','genuine','happily','history','however'],
  extreme: ['abandoned','abilities','abolition','absurdity','accelerate','accomplish','accusation','adaptation','adequately','adjustment','admiration','advertised','affiliated','aggravated','algorithms','allegation','ambassador','ammunition','appreciate','attributes','background','bankruptcy','barricaded','benefactor','binoculars','blueprints','boundaries','brilliance','calculated','camouflage','capability','casualties','celebrated','challenged','chancellor','chronicles','circulated','combustion','commentary','compromise'],
  impossible: ['accountability','acknowledgment','administration','approximately','archaeological','biodegradable','biotechnology','characterizing','circumstances','communication','comprehensive','concentration','consciousness','controversial','correspondence','demonstration','determination','discrimination','electromagnetic','environmental','extraordinary','fundamentalist','hallucination','implementation','infrastructure','interpretation','jurisprudence','kaleidoscopic','microprocessor','misconceptions','nanotechnology','organizational','pharmaceutical','predominantly','psychologically','questionnaire','recommendation','responsibility','simultaneously','transformation','understanding','unpredictable','vulnerability']
};

function getTypingPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { wordCount: 10, timeLimit: 45 },
    medium:     { wordCount: 12, timeLimit: 40 },
    hard:       { wordCount: 15, timeLimit: 35 },
    extreme:    { wordCount: 18, timeLimit: 30 },
    impossible: { wordCount: 20, timeLimit: 25 }
  };
  const cfg = configs[diff];
  const pool = TYPING_WORDS[diff] || TYPING_WORDS.medium;
  const words = [];
  for (let i = 0; i < cfg.wordCount; i++) {
    words.push(rngPick(pool));
  }
  return { words, timeLimit: cfg.timeLimit, difficulty: diff };
}

function renderTyping(puzzle) {
  const state = {
    puzzle,
    words: puzzle.words,
    currentWordIdx: 0,
    typed: '',
    correct: 0,
    wrong: 0,
    totalChars: 0,
    correctChars: 0,
    startTime: null,
    endTime: null,
    timeLeft: puzzle.timeLimit,
    timer: null,
    done: false
  };
  GS.challengeState.typing = state;

  const c = document.getElementById('game-container');
  let html = `<div class="typing-game">`;
  html += `<div class="typing-stats-bar">`;
  html += `<span class="typing-stat">⏱ <span id="typing-time">${state.timeLeft}</span>s</span>`;
  html += `<span class="typing-stat">✓ <span id="typing-correct">0</span></span>`;
  html += `<span class="typing-stat">✗ <span id="typing-wrong">0</span></span>`;
  html += `</div>`;
  html += `<div class="typing-word-display" id="typing-words"></div>`;
  html += `<input type="text" class="typing-input" id="typing-input" placeholder="Type the highlighted word..." autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">`;
  html += `<div class="typing-progress-bar"><div class="typing-progress-fill" id="typing-progress"></div></div>`;
  html += `</div>`;
  c.innerHTML = html;

  renderTypingWords(state);
  const input = document.getElementById('typing-input');
  input.focus();
  input.addEventListener('input', () => handleTypingInput(state));
  input.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      submitTypingWord(state);
    }
  });
  // Start timer on first keypress
  input.addEventListener('input', function startOnce() {
    if (!state.startTime) {
      state.startTime = performance.now();
      startTypingTimer(state);
    }
    input.removeEventListener('input', startOnce);
  }, { once: false });
}

function renderTypingWords(state) {
  const container = document.getElementById('typing-words');
  if (!container) return;
  let html = '';
  state.words.forEach((word, i) => {
    let cls = 'typing-word';
    if (i < state.currentWordIdx) cls += ' typing-word-done';
    else if (i === state.currentWordIdx) cls += ' typing-word-active';
    html += `<span class="${cls}" id="tw-${i}">${word}</span> `;
  });
  container.innerHTML = html;
  // Scroll active word into view
  const active = document.getElementById(`tw-${state.currentWordIdx}`);
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function handleTypingInput(state) {
  if (state.done) return;
  state.typed = document.getElementById('typing-input').value;
  const currentWord = state.words[state.currentWordIdx];
  const wordEl = document.getElementById(`tw-${state.currentWordIdx}`);
  if (!wordEl) return;
  // Live color feedback
  let html = '';
  for (let i = 0; i < currentWord.length; i++) {
    if (i < state.typed.length) {
      if (state.typed[i] === currentWord[i]) {
        html += `<span class="typing-char-correct">${currentWord[i]}</span>`;
      } else {
        html += `<span class="typing-char-wrong">${currentWord[i]}</span>`;
      }
    } else {
      html += currentWord[i];
    }
  }
  wordEl.innerHTML = html;
}

function submitTypingWord(state) {
  if (state.done) return;
  if (!state.startTime) {
    state.startTime = performance.now();
    startTypingTimer(state);
  }
  const currentWord = state.words[state.currentWordIdx];
  const typed = state.typed.trim();
  state.totalChars += currentWord.length;
  if (typed === currentWord) {
    state.correct++;
    state.correctChars += currentWord.length;
    SFX.correct();
  } else {
    state.wrong++;
    // Count correct chars
    for (let i = 0; i < Math.min(typed.length, currentWord.length); i++) {
      if (typed[i] === currentWord[i]) state.correctChars++;
    }
    SFX.wrong();
  }
  state.currentWordIdx++;
  document.getElementById('typing-correct').textContent = state.correct;
  document.getElementById('typing-wrong').textContent = state.wrong;
  // Update progress
  const pct = (state.currentWordIdx / state.words.length) * 100;
  document.getElementById('typing-progress').style.width = pct + '%';

  if (state.currentWordIdx >= state.words.length) {
    finishTyping(state);
  } else {
    document.getElementById('typing-input').value = '';
    state.typed = '';
    renderTypingWords(state);
    document.getElementById('typing-input').focus();
  }
}

function startTypingTimer(state) {
  if (!GS.timerEnabled) {
    document.getElementById('typing-time').textContent = '∞';
    return;
  }
  state.timer = setInterval(() => {
    state.timeLeft--;
    const el = document.getElementById('typing-time');
    if (el) {
      el.textContent = state.timeLeft;
      if (state.timeLeft <= 5) el.style.color = 'var(--red)';
    }
    if (state.timeLeft <= 0) {
      finishTyping(state);
    }
  }, 1000);
}

function finishTyping(state) {
  if (state.done) return;
  state.done = true;
  if (state.timer) clearInterval(state.timer);
  state.endTime = performance.now();
  const elapsed = (state.endTime - state.startTime) / 1000;
  const accuracy = state.totalChars > 0 ? Math.round((state.correctChars / state.totalChars) * 100) : 0;
  // WPM: (correct chars / 5) / (elapsed minutes)
  const wpm = elapsed > 0 ? Math.round((state.correctChars / 5) / (elapsed / 60)) : 0;
  const completionRate = state.currentWordIdx / state.words.length;
  // Score: 50% accuracy, 30% completion, 20% WPM bonus
  const accuracyScore = accuracy;
  const completionScore = Math.round(completionRate * 100);
  const wpmBonus = Math.min(100, Math.round(wpm * 1.5));
  const score = Math.min(100, Math.round(accuracyScore * 0.5 + completionScore * 0.3 + wpmBonus * 0.2));

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('typing', score);
    lsSet('daily-typing-state-' + getDailyDateStr(), { correct: state.correct, wrong: state.wrong, wpm, accuracy, wordsCompleted: state.currentWordIdx, totalWords: state.words.length });
  }
  showChallengeSummary({
    emoji: score === 100 ? '⌨️' : score >= 60 ? '⌨️' : '🐌',
    score,
    title: score >= 80 ? 'Lightning Fingers!' : score >= 50 ? 'Not Bad!' : 'Keep Practicing!',
    stats: [
      { label: 'Words typed', value: `${state.correct} / ${state.words.length}` },
      { label: 'WPM', value: wpm },
      { label: 'Accuracy', value: accuracy + '%' },
      { label: 'Time', value: Math.round(elapsed) + 's' }
    ]
  });
}
