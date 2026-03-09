// ==================== SORT RACE ====================

const SORT_CATEGORIES = [
  { name: 'Numbers (ascending)', items: () => { const n = []; for(let i=0;i<6;i++) n.push(Math.floor(Math.random()*100)+1); return n.sort((a,b)=>a-b).map(String); }, type: 'number' },
  { name: 'Planets (from Sun)', items: () => ['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'], type: 'fixed' },
  { name: 'Months (calendar order)', items: () => ['January','February','March','April','May','June','July','August','September','October','November','December'], type: 'fixed' },
  { name: 'Rainbow colors (ROYGBIV)', items: () => ['Red','Orange','Yellow','Green','Blue','Indigo','Violet'], type: 'fixed' },
  { name: 'Days of the week', items: () => ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], type: 'fixed' },
  { name: 'Roman numerals (ascending)', items: () => ['I','II','III','IV','V','VI','VII','VIII','IX','X'], type: 'fixed' },
  { name: 'Musical notes (ascending)', items: () => ['C','D','E','F','G','A','B'], type: 'fixed' },
  { name: 'Continents (by area, largest first)', items: () => ['Asia','Africa','North America','South America','Antarctica','Europe','Australia'], type: 'fixed' },
  { name: 'Alphabet positions', items: () => { const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; const picked = []; while(picked.length<6){const l=letters[Math.floor(Math.random()*26)];if(!picked.includes(l))picked.push(l);} return picked.sort(); }, type: 'letter' },
  { name: 'Tallest to shortest', items: () => ['Giraffe','Elephant','Horse','Human','Dog','Cat','Hamster'], type: 'fixed' },
  { name: 'Largest to smallest (animals)', items: () => ['Blue Whale','Elephant','Hippo','Lion','Wolf','Fox','Rabbit'], type: 'fixed' },
  { name: 'Speed (fastest first)', items: () => ['Cheetah','Lion','Horse','Human','Turtle','Snail'], type: 'fixed' },
];

function getSortRacePuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { rounds: 3, itemCount: 4, timeLimit: 30 },
    medium:     { rounds: 4, itemCount: 5, timeLimit: 25 },
    hard:       { rounds: 5, itemCount: 6, timeLimit: 20 },
    extreme:    { rounds: 5, itemCount: 7, timeLimit: 16 },
    impossible: { rounds: 6, itemCount: 8, timeLimit: 14 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderSortRace(puzzle) {
  const state = {
    puzzle, round: 0, correct: 0,
    timeLeft: 0, timer: null, done: false,
    currentItems: [], correctOrder: [], usedCats: new Set()
  };
  GS.challengeState.sortrace = state;
  showSortRound(state);
}

function showSortRound(state) {
  if (state.round >= state.puzzle.rounds) { finishSortRace(state); return; }

  // Pick category
  let catIdx;
  do { catIdx = Math.floor(GS.rng() * SORT_CATEGORIES.length); } while (state.usedCats.has(catIdx) && state.usedCats.size < SORT_CATEGORIES.length);
  state.usedCats.add(catIdx);
  const cat = SORT_CATEGORIES[catIdx];
  const allItems = cat.items();
  const items = allItems.slice(0, state.puzzle.itemCount);
  state.correctOrder = [...items];

  // Shuffle for display
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(GS.rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  state.currentItems = shuffled;
  state.timeLeft = state.puzzle.timeLimit;

  drawSortGrid(state, cat.name);

  if (GS.timerEnabled) {
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(() => {
      state.timeLeft--;
      const el = document.getElementById('sort-time');
      if (el) {
        el.textContent = state.timeLeft;
        if (state.timeLeft <= 5) el.style.color = 'var(--red)';
      }
      if (state.timeLeft <= 0) {
        clearInterval(state.timer);
        SFX.wrong();
        state.round++;
        setTimeout(() => showSortRound(state), 600);
      }
    }, 1000);
  }
}

function drawSortGrid(state, categoryName) {
  const c = document.getElementById('game-container');
  let html = `<div class="sort-game">
    <div class="sort-header">
      <span>Round ${state.round + 1} / ${state.puzzle.rounds}</span>
      <span>✓${state.correct}</span>
      <span>⏱ <span id="sort-time">${GS.timerEnabled ? state.timeLeft : '∞'}</span>s</span>
    </div>
    <div class="sort-category">${categoryName}</div>
    <div class="sort-list" id="sort-list">`;

  state.currentItems.forEach((item, i) => {
    html += `<div class="sort-item" draggable="false" data-idx="${i}">
      <span class="sort-handle">☰</span>
      <span class="sort-text">${item}</span>
      <div class="sort-arrows">
        <button class="sort-arrow" onclick="moveSortItem(${i},-1)">▲</button>
        <button class="sort-arrow" onclick="moveSortItem(${i},1)">▼</button>
      </div>
    </div>`;
  });

  html += `</div>
    <button class="btn btn-primary btn-lg" onclick="submitSortRound()" style="width:100%;margin-top:10px">Check Order</button>
  </div>`;
  c.innerHTML = html;
}

function moveSortItem(idx, dir) {
  const state = GS.challengeState.sortrace;
  if (state.done) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= state.currentItems.length) return;
  [state.currentItems[idx], state.currentItems[newIdx]] = [state.currentItems[newIdx], state.currentItems[idx]];
  SFX.click();
  const catIdx = [...state.usedCats].pop();
  const cat = SORT_CATEGORIES[catIdx];
  drawSortGrid(state, cat.name);
}

function submitSortRound() {
  const state = GS.challengeState.sortrace;
  if (state.done) return;
  if (state.timer) clearInterval(state.timer);

  const isCorrect = state.currentItems.every((item, i) => item === state.correctOrder[i]);
  if (isCorrect) {
    state.correct++;
    SFX.correct();
  } else {
    SFX.wrong();
    // Show correct order briefly
    const list = document.getElementById('sort-list');
    if (list) {
      list.innerHTML = state.correctOrder.map(item =>
        `<div class="sort-item sort-revealed"><span class="sort-text">${item}</span></div>`
      ).join('');
    }
  }

  state.round++;
  setTimeout(() => showSortRound(state), isCorrect ? 500 : 1200);
}

function finishSortRace(state) {
  state.done = true;
  if (state.timer) clearInterval(state.timer);
  const score = Math.round((state.correct / state.puzzle.rounds) * 100);

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('sortrace', score);
    lsSet('daily-sortrace-state-' + getDailyDateStr(), { correct: state.correct, rounds: state.puzzle.rounds });
  }
  showChallengeSummary({
    emoji: score >= 90 ? '📋' : score >= 60 ? '📊' : '🤷',
    score,
    title: score >= 90 ? 'Sort Master!' : score >= 60 ? 'Good Ordering!' : 'Out of Order!',
    stats: [
      { label: 'Correct', value: `${state.correct} / ${state.puzzle.rounds}` },
      { label: 'Items per round', value: state.puzzle.itemCount }
    ]
  });
}
