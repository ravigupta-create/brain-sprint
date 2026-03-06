// ==================== INTEGRATION ====================

const CHALLENGE_INSTRUCTIONS = {
  blocks: {
    steps: [
      'Steps of a process are shown in a scrambled order',
      'Tap two blocks to swap their positions, or drag to reorder',
      'Arrange all steps into the correct logical sequence',
      'Press Submit when you think the order is right'
    ],
    tip: 'On harder difficulties, some blocks are distractors that don\'t belong!'
  },
  economy: {
    steps: [
      'Read the scenario describing a system to optimize',
      'Adjust the sliders to change variable values',
      'Watch the output score and make sure all constraints are met',
      'Press Submit once you hit the target score'
    ],
    tip: 'The gauge turns green when you\'ve reached the target. Multiple attempts cost points.'
  },
  paradox: {
    steps: [
      'Read the logic puzzle or probability scenario carefully',
      'Consider each answer option before choosing',
      'Tap the answer you believe is correct',
      'Your choice is final — no second attempts!'
    ],
    tip: 'On Easy difficulty, a hint is provided to help guide your thinking.'
  },
  escape: {
    steps: [
      'Navigate through a 5-screen branching story',
      'Read each scenario carefully before choosing',
      'Pick the best action from the available options',
      'Optimal choices earn 20 points each (100 max)'
    ],
    tip: 'Read each scenario carefully — some choices seem safe but aren\'t optimal!'
  },
  wordsearch: {
    steps: [
      'Find the hidden words in the grid of letters',
      'Tap each letter of a word in order, one by one',
      'Letters must be adjacent and in a straight line',
      'Press Submit when done — score is based on words found'
    ],
    tip: 'Tap a selected letter to undo. Wrong paths flash red and reset. Harder difficulties add diagonal and backward words!'
  },
  wordro: {
    steps: [
      'Crack the hidden 5-letter code word',
      'Type or tap letters, then press Enter to submit a guess',
      'Blue = correct letter & position, Orange = right letter wrong spot, Gray = not in word',
      'Use the feedback to narrow down the answer within your allowed guesses'
    ],
    tip: 'On Hard/Extreme you must reuse confirmed hints. Fewer guesses are allowed on harder difficulties!'
  },
  numgrid: {
    steps: [
      'Fill every empty cell in the number grid',
      'Each row, column, and box must contain each digit exactly once',
      'Tap a cell to select it, then tap a number to fill it in',
      'Press Submit when the grid is complete'
    ],
    tip: 'Larger grids on harder difficulties! Use arrow keys and number keys for faster input.'
  },
  wordhive: {
    steps: [
      'Find words using the 7 letter petals shown',
      'Every word must include the center letter',
      'Type or tap letters, then press Enter to submit each word',
      'Press Submit when you\'re done — score is based on words found vs target'
    ],
    tip: 'Easier difficulties accept shorter words (3+ letters). Harder ones require longer words and a higher percentage found. Use Shuffle to rearrange the petals!'
  },
  pulse: {
    steps: [
      'A cursor bounces across the track',
      'Tap or press space when the cursor is inside the zone',
      'Each hit shrinks the zone and speeds up the cursor',
      'Game ends when you miss — survive as long as you can!'
    ],
    tip: 'Watch the rhythm of the cursor and anticipate its position.'
  },
  deduction: {
    steps: [
      'Six crew members have hidden roles — one is a saboteur',
      'Each round, pick a question to ask the crew and read their responses',
      'After reading responses, eliminate one suspect',
      'Win by keeping the saboteur alive through all 5 rounds'
    ],
    tip: 'The saboteur may lie depending on difficulty. Cross-reference answers to spot inconsistencies!'
  },
  memory: {
    steps: [
      'A grid of face-down cards hides matching pairs',
      'Flip two cards at a time — matches stay revealed',
      'Non-matching cards flip back after a short delay',
      'Find all pairs before time runs out for the best score'
    ],
    tip: 'Consecutive matches earn combo bonuses! Try to remember card positions.'
  },
  maze: {
    steps: [
      'Navigate from the top-left corner to the bottom-right exit',
      'Use arrow keys or WASD on desktop, swipe on mobile',
      'Walls block your path — find the route through',
      'Score is based on path efficiency and time'
    ],
    tip: 'The optimal path length is shown — try to stay close to it!'
  },
  mosaic: {
    steps: [
      'A grid is divided into colored zones, each with a rule to satisfy',
      'Select a number token from the pool, then tap a cell to place it',
      'On Hard/Extreme, linked pairs (capsules) fill two adjacent cells at once — tap again to rotate',
      'Tap a filled cell to return its token to the pool',
      'When all cells are filled, press Check — score is based on zones solved correctly'
    ],
    tip: 'Pay attention to the rule on each zone. Tap a selected linked pair to rotate it before placing!'
  },
  numcrunch: {
    steps: [
      'Guess the hidden math equation',
      'Type digits and operators, then press Enter',
      'Green = right character, right spot',
      'Orange = right character, wrong spot',
      'Gray = character not in the equation'
    ],
    tip: 'Your guess must be a valid equation (e.g., 12+34=46). The = sign is part of the equation!'
  }
};

function startGame() {
  if (GS.selectedChallenges.length === 0) return;
  // Sort challenges in canonical order
  GS.selectedChallenges.sort((a,b) => CHALLENGE_ORDER.indexOf(a) - CHALLENGE_ORDER.indexOf(b));
  GS.currentChallengeIdx = 0;
  // Preserve results from already-completed challenges in this session
  if (!GS.timerRunning) {
    GS.results = {};
    GS.attempts = {};
  }
  GS.challengeState = {};
  setupRNG();
  navigateTo('screen-game');
  loadCurrentChallenge();
}

function loadCurrentChallenge() {
  const ch = GS.selectedChallenges[GS.currentChallengeIdx];
  const total = GS.selectedChallenges.length;
  const current = GS.currentChallengeIdx + 1;
  document.getElementById('game-challenge-label').textContent = `${CHALLENGE_ICONS[ch]} ${CHALLENGE_NAMES[ch]}`;
  document.getElementById('game-progress-label').textContent = `${current} of ${total}`;
  document.getElementById('btn-submit-challenge').style.display = 'none';
  document.getElementById('btn-next-challenge').style.display = 'none';
  // Show intro screen
  const info = CHALLENGE_INSTRUCTIONS[ch];
  const c = document.getElementById('game-container');
  let html = `<div class="intro-screen">`;
  html += `<div class="intro-icon">${CHALLENGE_ICONS[ch]}</div>`;
  html += `<div class="intro-title">${CHALLENGE_NAMES[ch]}</div>`;
  html += `<div class="intro-steps">`;
  info.steps.forEach((step, i) => {
    html += `<div class="intro-step"><span class="intro-step-num">${i+1}</span><span>${step}</span></div>`;
  });
  html += `</div>`;
  html += `<div class="intro-tip">💡 ${info.tip}</div>`;
  if (ch === 'mosaic') {
    html += `<button class="btn btn-secondary btn-lg btn-full" style="margin-bottom:8px" onclick="showMosaicSymbolGuide()">Symbol Guide</button>`;
  }
  html += `<button class="btn btn-primary btn-lg btn-full" onclick="beginChallenge()">Start Game</button>`;
  html += `</div>`;
  c.innerHTML = html;
}

function beginChallenge() {
  // Start timer on first challenge
  if (GS.currentChallengeIdx === 0 && !GS.timerRunning) {
    startTimer();
  }
  const ch = GS.selectedChallenges[GS.currentChallengeIdx];
  switch(ch) {
    case 'paradox': renderParadox(getParadoxPuzzle()); break;
    case 'blocks': renderBlocks(getBlocksPuzzle()); break;
    case 'economy': renderEconomy(getEconomyPuzzle()); break;
    case 'escape': renderEscape(getEscapePuzzle()); break;
    case 'wordsearch': renderWordsearch(getWordsearchPuzzle()); break;
    case 'wordro': renderWordro(getWordroPuzzle()); break;
    case 'numgrid': renderNumgrid(getNumgridPuzzle()); break;
    case 'wordhive': renderWordhive(getWordhivePuzzle()); break;
    case 'pulse': renderPulse(getPulsePuzzle()); break;
    case 'deduction': renderDeduction(getDeductionPuzzle()); break;
    case 'memory': renderMemory(getMemoryPuzzle()); break;
    case 'maze': renderMaze(getMazePuzzle()); break;
    case 'mosaic': renderMosaic(getMosaicPuzzle()); break;
    case 'numcrunch': renderNumcrunch(getNumcrunchPuzzle()); break;
  }
}

function submitChallenge() {
  const ch = GS.selectedChallenges[GS.currentChallengeIdx];
  switch(ch) {
    case 'blocks': submitBlocks(); break;
    case 'economy': submitEconomy(); break;
    case 'wordsearch': submitWordsearch(); break;
    case 'wordro': submitWordro(); break;
    case 'numgrid': submitNumgrid(); break;
    case 'wordhive': submitWordhive(); break;
    case 'numcrunch': numcrunchSubmitGuess(); break;
    // paradox, escape, pulse, deduction, memory, maze, mosaic, and numcrunch handle their own submission
  }
}

function showNextOrFinish() {
  // Remove the just-completed challenge from selection
  const currentCh = GS.selectedChallenges[GS.currentChallengeIdx];
  GS.selectedChallenges = GS.selectedChallenges.filter(ch => ch !== currentCh);
  document.getElementById('btn-submit-challenge').style.display = 'none';
  document.getElementById('btn-next-challenge').style.display = 'none';
  if (GS.selectedChallenges.length > 0) {
    // Go back to challenge select with remaining challenges still selected
    GS.screenStack = GS.screenStack.filter(s => s !== 'screen-game');
    showScreen('screen-challenge-select');
    updateChallengeSelectUI();
  } else {
    // All done — restore selectedChallenges from results for the results screen
    stopTimer();
    GS.selectedChallenges = Object.keys(GS.results).sort((a,b) => CHALLENGE_ORDER.indexOf(a) - CHALLENGE_ORDER.indexOf(b));
    setTimeout(() => showResults(), 800);
  }
}

function nextChallenge() {
  GS.currentChallengeIdx++;
  loadCurrentChallenge();
}

