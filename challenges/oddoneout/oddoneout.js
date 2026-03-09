// ==================== CHALLENGE 18: SPOT THE ODD ONE OUT ====================

const ODD_CATEGORIES = [
  { name:'Even numbers', items:['2','4','6','8','10','12','14','16','18','20','22','24'], odd:'7', oddLabel:'7 is odd' },
  { name:'Even numbers', items:['2','4','6','8','10','12','14','16','18','20','22','24'], odd:'15', oddLabel:'15 is odd' },
  { name:'Fruits', items:['🍎','🍊','🍋','🍇','🍓','🍑','🍒','🫐','🍌','🥝','🍍','🥭'], odd:'🥕', oddLabel:'Carrot is a vegetable' },
  { name:'Fruits', items:['🍎','🍊','🍋','🍇','🍓','🍑','🍒','🫐','🍌','🥝','🍍','🥭'], odd:'🥦', oddLabel:'Broccoli is a vegetable' },
  { name:'Square numbers', items:['1','4','9','16','25','36','49','64','81','100','121','144'], odd:'50', oddLabel:'50 is not a perfect square' },
  { name:'Square numbers', items:['1','4','9','16','25','36','49','64','81','100','121','144'], odd:'15', oddLabel:'15 is not a perfect square' },
  { name:'Prime numbers', items:['2','3','5','7','11','13','17','19','23','29','31','37'], odd:'9', oddLabel:'9 = 3×3, not prime' },
  { name:'Prime numbers', items:['2','3','5','7','11','13','17','19','23','29','31','37'], odd:'21', oddLabel:'21 = 3×7, not prime' },
  { name:'Mammals', items:['🐶','🐱','🐭','🐰','🦊','🐻','🐼','🦁','🐯','🐮','🐷','🐵'], odd:'🐍', oddLabel:'Snake is a reptile' },
  { name:'Mammals', items:['🐶','🐱','🐭','🐰','🦊','🐻','🐼','🦁','🐯','🐮','🐷','🐵'], odd:'🐸', oddLabel:'Frog is an amphibian' },
  { name:'Multiples of 3', items:['3','6','9','12','15','18','21','24','27','30','33','36'], odd:'14', oddLabel:'14 is not a multiple of 3' },
  { name:'Multiples of 3', items:['3','6','9','12','15','18','21','24','27','30','33','36'], odd:'22', oddLabel:'22 is not a multiple of 3' },
  { name:'Vowels', items:['A','E','I','O','U','A','E','I','O','U','A','E'], odd:'K', oddLabel:'K is a consonant' },
  { name:'Musical instruments', items:['🎸','🎹','🥁','🎺','🎻','🪗','🎷','🪘','🎸','🎹','🥁','🎺'], odd:'🎨', oddLabel:'Palette is art, not music' },
  { name:'Ocean animals', items:['🐟','🐠','🐡','🦈','🐬','🐳','🦑','🐙','🦀','🦞','🐚','🪸'], odd:'🦅', oddLabel:'Eagle is a bird' },
  { name:'Weather', items:['☀️','🌧️','⛈️','🌩️','❄️','🌤️','🌦️','🌨️','🌪️','☁️','🌫️','🌈'], odd:'🎄', oddLabel:'Christmas tree is not weather' },
  { name:'Fibonacci numbers', items:['1','1','2','3','5','8','13','21','34','55','89','144'], odd:'10', oddLabel:'10 is not in the Fibonacci sequence' },
  { name:'Fibonacci numbers', items:['1','1','2','3','5','8','13','21','34','55','89','144'], odd:'4', oddLabel:'4 is not in the Fibonacci sequence' },
  { name:'Sports', items:['⚽','🏀','🎾','🏈','⚾','🏐','🏒','🥊','🏓','🏸','⛳','🎳'], odd:'🎭', oddLabel:'Theater is not a sport' },
  { name:'Powers of 2', items:['1','2','4','8','16','32','64','128','256','512','1024','2048'], odd:'100', oddLabel:'100 is not a power of 2' },
  { name:'Countries in Europe', items:['France','Spain','Italy','Germany','Sweden','Norway','Poland','Greece','Austria','Belgium','Portugal','Finland'], odd:'Brazil', oddLabel:'Brazil is in South America' },
  { name:'Colors of the rainbow', items:['Red','Orange','Yellow','Green','Blue','Indigo','Violet','Red','Orange','Yellow','Green','Blue'], odd:'Pink', oddLabel:'Pink is not in the rainbow' },
  { name:'Planets', items:['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune','Mercury','Venus','Earth','Mars'], odd:'Pluto', oddLabel:'Pluto is a dwarf planet' },
  { name:'Divisible by 5', items:['5','10','15','20','25','30','35','40','45','50','55','60'], odd:'23', oddLabel:'23 is not divisible by 5' },
];

function getOddOneOutPuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:       { gridSize: 9,  rounds: 4, timePerRound: 15 },
    medium:     { gridSize: 12, rounds: 5, timePerRound: 12 },
    hard:       { gridSize: 16, rounds: 5, timePerRound: 10 },
    extreme:    { gridSize: 16, rounds: 6, timePerRound: 8 },
    impossible: { gridSize: 20, rounds: 6, timePerRound: 6 }
  };
  const cfg = configs[d] || configs.medium;
  const rounds = [];
  const shuffled = rngShuffle([...ODD_CATEGORIES]);
  for (let i = 0; i < cfg.rounds; i++) {
    const cat = shuffled[i % shuffled.length];
    const normal = rngShuffle([...cat.items]).slice(0, cfg.gridSize - 1);
    const insertPos = rngInt(0, normal.length);
    normal.splice(insertPos, 0, cat.odd);
    rounds.push({ items: normal, oddItem: cat.odd, oddIdx: insertPos, category: cat.name, explanation: cat.oddLabel });
  }
  return { ...cfg, rounds, difficulty: d };
}

function renderOddOneOut(puzzle) {
  document.getElementById('btn-submit-challenge').style.display = 'none';
  GS.challengeState.oddoneout = {
    puzzle, currentRound: 0, correct: 0, answers: [], gameOver: false,
    timeLeft: puzzle.timePerRound, timerId: null
  };
  renderOddRound();
}

function renderOddRound() {
  const st = GS.challengeState.oddoneout;
  const p = st.puzzle;
  const c = document.getElementById('game-container');

  if (st.currentRound >= p.rounds.length) { endOddOneOut(); return; }
  if (st.timerId) clearInterval(st.timerId);

  const round = p.rounds[st.currentRound];
  st.timeLeft = p.timePerRound;

  const cols = Math.ceil(Math.sqrt(round.items.length));
  let html = '<div class="odd-container">';
  html += `<div class="odd-header"><span class="odd-round">Round ${st.currentRound + 1}/${p.rounds.length}</span><span class="odd-timer" id="odd-timer">${st.timeLeft}s</span></div>`;
  html += '<div class="odd-prompt">Find the one that doesn\'t belong!</div>';
  html += `<div class="odd-grid" style="grid-template-columns:repeat(${cols},1fr)">`;
  round.items.forEach((item, i) => {
    html += `<button class="odd-cell" id="odd-cell-${i}" onclick="selectOddItem(${i})">${item}</button>`;
  });
  html += '</div>';
  html += '<div class="odd-feedback" id="odd-feedback"></div>';
  html += '</div>';
  c.innerHTML = html;

  // Start timer
  st.timerId = setInterval(() => {
    st.timeLeft--;
    const el = document.getElementById('odd-timer');
    if (el) {
      el.textContent = st.timeLeft + 's';
      if (st.timeLeft <= 3) el.classList.add('odd-timer-low');
    }
    if (st.timeLeft <= 0) {
      clearInterval(st.timerId);
      st.timerId = null;
      handleOddTimeout();
    }
  }, 1000);
}

function selectOddItem(idx) {
  const st = GS.challengeState.oddoneout;
  if (st.gameOver) return;
  if (st.timerId) { clearInterval(st.timerId); st.timerId = null; }

  const round = st.puzzle.rounds[st.currentRound];
  const correct = round.items[idx] === round.oddItem;

  // Disable all cells
  document.querySelectorAll('.odd-cell').forEach(btn => btn.disabled = true);

  const selectedEl = document.getElementById('odd-cell-' + idx);
  if (correct) {
    selectedEl.classList.add('odd-correct');
    st.correct++;
    SFX.correct();
  } else {
    selectedEl.classList.add('odd-wrong');
    SFX.wrong();
    // Highlight the correct one
    round.items.forEach((item, i) => {
      if (item === round.oddItem) {
        document.getElementById('odd-cell-' + i).classList.add('odd-correct');
      }
    });
  }

  st.answers.push({ correct, round: st.currentRound });

  const feedback = document.getElementById('odd-feedback');
  if (feedback) {
    feedback.innerHTML = `<strong>${correct ? '✓' : '✗'}</strong> ${round.explanation}`;
    feedback.className = 'odd-feedback ' + (correct ? 'odd-fb-correct' : 'odd-fb-wrong');
  }

  st.currentRound++;
  setTimeout(() => renderOddRound(), 1800);
}

function handleOddTimeout() {
  const st = GS.challengeState.oddoneout;
  const round = st.puzzle.rounds[st.currentRound];
  document.querySelectorAll('.odd-cell').forEach(btn => btn.disabled = true);
  round.items.forEach((item, i) => {
    if (item === round.oddItem) {
      document.getElementById('odd-cell-' + i).classList.add('odd-correct');
    }
  });
  st.answers.push({ correct: false, round: st.currentRound });
  SFX.wrong();
  const feedback = document.getElementById('odd-feedback');
  if (feedback) {
    feedback.innerHTML = `<strong>Time's up!</strong> ${round.explanation}`;
    feedback.className = 'odd-feedback odd-fb-wrong';
  }
  st.currentRound++;
  setTimeout(() => renderOddRound(), 1800);
}

function endOddOneOut() {
  const st = GS.challengeState.oddoneout;
  st.gameOver = true;
  if (st.timerId) { clearInterval(st.timerId); st.timerId = null; }
  const score = Math.round(100 * st.correct / st.puzzle.rounds.length);
  GS.results.oddoneout = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('oddoneout', score);
    lsSet('daily-oddoneout-state-' + getDailyDateStr(), {
      correct: st.correct, total: st.puzzle.rounds.length
    });
  }

  showChallengeSummary({
    emoji: score >= 80 ? '👁️' : score >= 50 ? '🔍' : '🙈',
    score,
    title: score >= 80 ? 'Eagle Eye!' : score >= 50 ? 'Good Spot!' : 'Tricky Ones!',
    stats: [
      { label: 'Correct', value: `${st.correct} / ${st.puzzle.rounds.length}` }
    ]
  });
}
