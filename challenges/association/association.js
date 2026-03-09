// ==================== WORD ASSOCIATION ====================

const ASSOCIATION_PUZZLES = [
  { word: 'Ocean', correct: 'Wave', wrong: ['Mountain','Forest','Desert'] },
  { word: 'King', correct: 'Crown', wrong: ['Shoe','Lamp','Clock'] },
  { word: 'Pencil', correct: 'Paper', wrong: ['Hammer','Spoon','Pillow'] },
  { word: 'Moon', correct: 'Night', wrong: ['Day','Noon','Dawn'] },
  { word: 'Doctor', correct: 'Hospital', wrong: ['Library','Stadium','Airport'] },
  { word: 'Winter', correct: 'Snow', wrong: ['Sand','Leaf','Petal'] },
  { word: 'Camera', correct: 'Photo', wrong: ['Song','Flavor','Breeze'] },
  { word: 'Compass', correct: 'Direction', wrong: ['Color','Sound','Weight'] },
  { word: 'Library', correct: 'Book', wrong: ['Ball','Car','Cake'] },
  { word: 'Thunder', correct: 'Lightning', wrong: ['Rainbow','Sunset','Breeze'] },
  { word: 'Bee', correct: 'Honey', wrong: ['Silk','Wool','Cotton'] },
  { word: 'Telescope', correct: 'Star', wrong: ['Seed','Shell','Stone'] },
  { word: 'Piano', correct: 'Music', wrong: ['Paint','Dance','Sculpt'] },
  { word: 'Anchor', correct: 'Ship', wrong: ['Train','Plane','Bicycle'] },
  { word: 'Nest', correct: 'Bird', wrong: ['Fish','Cat','Horse'] },
  { word: 'Volcano', correct: 'Lava', wrong: ['Water','Air','Ice'] },
  { word: 'Clock', correct: 'Time', wrong: ['Space','Color','Sound'] },
  { word: 'Seed', correct: 'Plant', wrong: ['Rock','Cloud','Flame'] },
  { word: 'Feather', correct: 'Light', wrong: ['Heavy','Hard','Loud'] },
  { word: 'Diamond', correct: 'Gem', wrong: ['Wood','Clay','Wool'] },
  { word: 'Knight', correct: 'Armor', wrong: ['Basket','Pillow','Curtain'] },
  { word: 'Candle', correct: 'Flame', wrong: ['Water','Soil','Metal'] },
  { word: 'Passport', correct: 'Travel', wrong: ['Cook','Sleep','Read'] },
  { word: 'Stethoscope', correct: 'Heart', wrong: ['Brain','Bone','Skin'] },
  { word: 'Palette', correct: 'Paint', wrong: ['Sing','Write','Dance'] },
  { word: 'Jury', correct: 'Trial', wrong: ['School','Market','Church'] },
  { word: 'Rocket', correct: 'Space', wrong: ['Ocean','Cave','Field'] },
  { word: 'Microscope', correct: 'Cell', wrong: ['Planet','Mountain','Building'] },
  { word: 'Fossil', correct: 'Dinosaur', wrong: ['Robot','Satellite','Computer'] },
  { word: 'Compass', correct: 'North', wrong: ['Fast','Loud','Bright'] },
  { word: 'Cactus', correct: 'Desert', wrong: ['Jungle','Ocean','Tundra'] },
  { word: 'Scalpel', correct: 'Surgery', wrong: ['Cooking','Painting','Writing'] },
  { word: 'Gavel', correct: 'Judge', wrong: ['Chef','Pilot','Teacher'] },
  { word: 'Constellation', correct: 'Sky', wrong: ['Ground','Sea','Cave'] },
  { word: 'Sphinx', correct: 'Egypt', wrong: ['China','Brazil','Japan'] },
  { word: 'Glacier', correct: 'Ice', wrong: ['Fire','Sand','Dust'] },
  { word: 'Equation', correct: 'Math', wrong: ['Art','Music','History'] },
  { word: 'Verdict', correct: 'Court', wrong: ['Kitchen','Garden','Office'] },
  { word: 'Pigment', correct: 'Color', wrong: ['Sound','Taste','Smell'] },
  { word: 'Hemisphere', correct: 'Globe', wrong: ['Cube','Pyramid','Cone'] }
];

function getAssociationPuzzle() {
  const diff = GS.difficulty || 'medium';
  const configs = {
    easy:       { rounds: 6,  options: 3, timePerRound: 10 },
    medium:     { rounds: 8,  options: 4, timePerRound: 8 },
    hard:       { rounds: 10, options: 4, timePerRound: 6 },
    extreme:    { rounds: 12, options: 5, timePerRound: 5 },
    impossible: { rounds: 14, options: 5, timePerRound: 4 }
  };
  return { ...configs[diff], difficulty: diff };
}

function renderAssociation(puzzle) {
  const state = {
    puzzle, round: 0, correct: 0, streak: 0, bestStreak: 0,
    timer: null, timeLeft: 0, done: false,
    usedPuzzles: new Set()
  };
  GS.challengeState.association = state;
  showAssocRound(state);
}

function showAssocRound(state) {
  if (state.round >= state.puzzle.rounds) { finishAssociation(state); return; }

  // Pick unused puzzle
  let pIdx;
  do { pIdx = Math.floor(GS.rng() * ASSOCIATION_PUZZLES.length); } while (state.usedPuzzles.has(pIdx) && state.usedPuzzles.size < ASSOCIATION_PUZZLES.length);
  state.usedPuzzles.add(pIdx);
  const p = ASSOCIATION_PUZZLES[pIdx];

  state.timeLeft = state.puzzle.timePerRound;

  // Build options
  const options = [p.correct];
  const wrongPool = [...p.wrong];
  while (options.length < state.puzzle.options && wrongPool.length > 0) {
    const idx = Math.floor(GS.rng() * wrongPool.length);
    options.push(wrongPool.splice(idx, 1)[0]);
  }
  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(GS.rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const c = document.getElementById('game-container');
  c.innerHTML = `<div class="assoc-game">
    <div class="assoc-header">
      <span>${state.round + 1} / ${state.puzzle.rounds}</span>
      <span>${state.streak > 0 ? '🔥' + state.streak : ''}</span>
      <span>✓${state.correct}</span>
    </div>
    <div class="assoc-prompt">
      <div class="assoc-label">Most related to:</div>
      <div class="assoc-word">${p.word}</div>
    </div>
    ${GS.timerEnabled ? `<div class="assoc-timer-bar"><div class="assoc-timer-fill" id="assoc-timer"></div></div>` : ''}
    <div class="assoc-options">
      ${options.map(opt => `<button class="assoc-btn" onclick="pickAssociation('${opt.replace(/'/g,"\\'")}','${p.correct.replace(/'/g,"\\'")}')">${opt}</button>`).join('')}
    </div>
  </div>`;

  if (GS.timerEnabled) {
    const timerEl = document.getElementById('assoc-timer');
    if (timerEl) {
      timerEl.style.transition = `width ${state.puzzle.timePerRound}s linear`;
      setTimeout(() => { if (timerEl) timerEl.style.width = '0%'; }, 50);
    }
    if (state.timer) clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      state.streak = 0;
      SFX.wrong();
      state.round++;
      showAssocRound(state);
    }, state.puzzle.timePerRound * 1000);
  }
}

function pickAssociation(picked, correct) {
  const state = GS.challengeState.association;
  if (state.done) return;
  if (state.timer) clearTimeout(state.timer);

  if (picked === correct) {
    state.correct++;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    SFX.correct();
  } else {
    state.streak = 0;
    SFX.wrong();
  }

  // Highlight correct
  document.querySelectorAll('.assoc-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('assoc-correct');
    else if (btn.textContent === picked && picked !== correct) btn.classList.add('assoc-wrong');
  });

  state.round++;
  setTimeout(() => showAssocRound(state), 500);
}

function finishAssociation(state) {
  state.done = true;
  if (state.timer) clearTimeout(state.timer);
  const score = Math.round((state.correct / state.puzzle.rounds) * 100);

  GS.results[GS.selectedChallenges[GS.currentChallengeIdx]] = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('association', score);
    lsSet('daily-association-state-' + getDailyDateStr(), { correct: state.correct, rounds: state.puzzle.rounds, bestStreak: state.bestStreak });
  }
  showChallengeSummary({
    emoji: score >= 90 ? '💬' : score >= 60 ? '🤔' : '😶',
    score,
    title: score >= 90 ? 'Word Wizard!' : score >= 60 ? 'Good Connections!' : 'Keep Associating!',
    stats: [
      { label: 'Correct', value: `${state.correct} / ${state.puzzle.rounds}` },
      { label: 'Best streak', value: state.bestStreak }
    ]
  });
}
