// ==================== INTEGRATION ====================

const CHALLENGE_INSTRUCTIONS = {
  blocks: {
    steps: [
      'You\'ll see a list of steps for a real-world process (like "how to make a sandwich") but they\'re all jumbled up',
      'Your job: put them in the correct order from first to last',
      'Tap one block, then tap another to swap them — or drag and drop blocks into position',
      'When you think the order is right, press Submit. You get fewer points for each wrong attempt'
    ],
    tip: 'On Hard+, some blocks are fakes that don\'t belong in the process at all — leave those at the bottom! Read every step carefully before rearranging.'
  },
  economy: {
    steps: [
      'You\'re given a mini scenario (like running a farm or factory) with 3-4 sliders you can adjust',
      'Each slider controls something (water, price, workers, etc.) — drag them to change values',
      'A live score updates as you move sliders, but you also have constraints (rules you can\'t break)',
      'Get the score above the green target line while keeping all constraints satisfied, then press Submit'
    ],
    tip: 'The gauge at the top turns green when you\'ve hit the target. Watch out — breaking a constraint (shown in red) means instant failure! Each extra Submit attempt costs points, so try to get it right the first time.'
  },
  paradox: {
    steps: [
      'You\'ll read a short brain teaser — a tricky logic puzzle, probability question, or classic paradox',
      'Think carefully! These are designed to be counterintuitive and trick you',
      'When you\'re ready, tap the answer you think is correct from the multiple choice options',
      'You only get one shot — once you tap an answer, it\'s locked in and you\'ll see the explanation'
    ],
    tip: 'Don\'t rush! On Easy, a hint appears above the choices. On harder difficulties, the puzzles are trickier and there are more answer options to choose from.'
  },
  escape: {
    steps: [
      'You\'re dropped into a short story with 5 scenes — like escaping a haunted house or surviving on a deserted island',
      'At each scene, you read what\'s happening and choose what to do from 2-4 options',
      'Each choice is scored: the "optimal" choice earns 20 points, less ideal choices earn fewer',
      'After 5 scenes, your total is added up (max 100). There\'s no going back — each choice is final!'
    ],
    tip: 'Think about what would actually work best in the situation, not just what sounds cool. Some choices seem safe but aren\'t optimal. On harder difficulties, there are more wrong options to trick you.'
  },
  wordsearch: {
    steps: [
      'A grid of letters hides several words related to a theme (shown above the grid)',
      'To select a word: tap the first letter, then tap each next letter one by one — they must be in a straight line (horizontal, vertical, or diagonal) and adjacent',
      'Found words get highlighted and crossed off the list. Tap a highlighted letter to deselect and start over',
      'Find as many words as you can, then press Submit. Your score = percentage of words found'
    ],
    tip: 'The word list shows you exactly what to look for. Words can go forward or backward! On harder difficulties, words can be placed diagonally and reversed. If you tap a wrong letter, it flashes red — just start that word over.'
  },
  wordro: {
    steps: [
      'There\'s a hidden 5-letter word and you need to guess it — like Wordle!',
      'Type a 5-letter word using the keyboard (on-screen or physical) and press Enter to submit your guess',
      'Each letter in your guess gets colored: Blue = correct letter in the correct spot, Orange = correct letter but in the wrong spot, Gray = this letter isn\'t in the word at all',
      'Use the color feedback to narrow down the word. You have limited guesses (6 on Easy, down to 3 on Impossible)'
    ],
    tip: 'Start with a word that has common letters like "ARISE" or "STARE". On Hard+, you must reuse letters that were confirmed correct (blue/orange). The on-screen keyboard also shows which letters you\'ve tried.'
  },
  numgrid: {
    steps: [
      'This is a Sudoku-style puzzle! You see a grid with some numbers already filled in (gray = given, can\'t change)',
      'Fill in the empty cells so that every row, every column, and every outlined box contains each number exactly once',
      'Tap an empty cell to select it (it highlights), then tap a number from the pad below to fill it in. Tap "Clear" to erase',
      'When every cell is filled, press Submit. Wrong cells will be highlighted — fix them and try again'
    ],
    tip: 'Easy = 4x4 grid (digits 1-4), Medium = 6x6, Hard+ = full 9x9 Sudoku. You can also use arrow keys to move between cells and number keys to type. Look for rows/columns with only one empty cell — those are freebies!'
  },
  wordhive: {
    steps: [
      'Seven letters are arranged in a honeycomb pattern — one in the center and six around it',
      'Make words (3+ letters) using only these seven letters. Every word MUST include the center letter',
      'Type letters by tapping the petals or using your keyboard, then press Enter to submit each word. You can reuse letters within a word',
      'Keep finding words until you hit the target number shown at the top, then press Submit to finish'
    ],
    tip: 'You can use each letter more than once in the same word (e.g., if "A" is available, "BANANA" could work). Hit Shuffle to rearrange the outer petals — sometimes a new arrangement helps you see words. The Delete button removes your last typed letter.'
  },
  pulse: {
    steps: [
      'A small dot (cursor) bounces left and right across a horizontal track at the top',
      'There\'s a highlighted green zone somewhere on the track — tap the screen or press Space when the cursor is inside that zone',
      'If you hit it: great! The zone shrinks smaller and the cursor speeds up, making the next hit harder',
      'If you miss (tap when the cursor is outside the zone): game over! Your score depends on how many hits you survived'
    ],
    tip: 'Watch the cursor\'s rhythm for a moment before your first tap. The cursor bounces predictably — time your taps to its movement pattern. On harder difficulties, the zone starts smaller and the cursor starts faster.'
  },
  deduction: {
    steps: [
      'Six characters are shown — five are innocent crew members and one is secretly a saboteur. Your goal is to figure out who the saboteur is and NOT eliminate them',
      'Each round, pick a question from the list (like "Who do you trust most?" or "What is your role?") — everyone will answer',
      'Read the responses carefully. The saboteur may lie! Compare answers to spot who\'s being inconsistent',
      'After reading, you must eliminate one character. You WIN by surviving all 5 rounds with the saboteur still alive — which means only eliminating innocents'
    ],
    tip: 'Wait — you want to KEEP the saboteur alive? Yes! The twist is that you need to figure out who the saboteur is so you can avoid eliminating them. On Extreme/Impossible, a "decoy" innocent gives answers identical to the saboteur, making it much harder to tell them apart.'
  },
  memory: {
    steps: [
      'A grid of face-down cards is shown. Each card has a matching pair hidden somewhere in the grid',
      'Tap a card to flip it over and see what\'s on it. Then tap a second card to flip it too',
      'If the two cards match: they stay face-up and you score! If they don\'t match: both flip back face-down after a moment',
      'Find all matching pairs before the timer runs out. Fewer moves = higher score'
    ],
    tip: 'Pay attention to cards you\'ve already flipped — even mismatched ones reveal useful info! Finding matches in a row earns combo bonuses (2x, 3x, etc.). On harder difficulties, there are more cards and less time.'
  },
  maze: {
    steps: [
      'You\'re the blue dot in the top-left corner. The exit (red dot) is in the bottom-right corner',
      'Navigate through the maze by using arrow keys or WASD on a keyboard, or swiping on a touchscreen',
      'Walls block your path — you can\'t walk through them. Find the route that gets you to the exit',
      'Your score is based on two things: how close your path was to the shortest possible route, and how fast you finished'
    ],
    tip: 'The "optimal steps" count is shown so you know the shortest possible path. Try to stay close to that number! On harder difficulties the maze is larger (up to 25x25). If you hit a dead end, backtrack and try a different direction.'
  },
  mosaic: {
    steps: [
      'A grid is divided into colored zones. Each zone has a rule written on it (like "sum = 10" or "all even" or "ascending order")',
      'Below the grid is a pool of number tokens. Tap a token to select it, then tap an empty cell to place it there. Tap a filled cell to remove its token back to the pool',
      'Your goal: place numbers so that every zone\'s rule is satisfied. For example, if a zone says "sum = 10", the numbers inside that zone must add up to 10',
      'When all cells are filled, press Check. Each correct zone earns points. Wrong zones are highlighted so you can fix and retry (but retries cost points)'
    ],
    tip: 'Read ALL the zone rules before placing anything. On Hard+, some tokens are "linked pairs" (shown as capsules with two numbers) — they fill two adjacent cells at once. Tap a selected linked pair again to rotate it before placing!'
  },
  numcrunch: {
    steps: [
      'There\'s a hidden math equation (like "12+34=46") and you need to guess it — like Wordle but for math!',
      'Type a valid math equation using the on-screen keyboard (digits 0-9, operators +−×÷, and =), then press Enter',
      'Each character gets colored: Green = right character in the right spot, Orange = this character is in the equation but in a different spot, Gray = this character isn\'t in the equation',
      'Use the feedback to figure out the hidden equation. Your guess MUST be a valid, true equation (both sides must be equal)'
    ],
    tip: 'The equation is always in the format "number operator number = result" (e.g., "9+3=12" or "48÷6=08"). The = sign is part of the equation and takes up a slot! Start by guessing common equations to figure out which digits and operators are used.'
  },
  colorcode: {
    steps: [
      'A secret code made of colored circles is hidden — your job is to crack it! Think Mastermind board game',
      'Click on an empty slot in your guess row to select it, then click a color from the palette below to fill it in. Fill all slots to complete your guess',
      'Press Submit to check your guess. You\'ll get feedback pegs: Black peg = right color in the right position, White peg = right color but wrong position, No peg = that color isn\'t in the code',
      'Use the feedback to logically narrow down the code. You have limited guesses (more on Easy, fewer on Impossible)'
    ],
    tip: 'A good strategy: first, figure out WHICH colors are in the code by trying all different colors. Then figure out WHERE each color goes using the black/white peg feedback. Colors CAN repeat in the code!'
  },
  quickmath: {
    steps: [
      'A math problem appears on screen (like "7 + 13 = ?") and a countdown timer is running',
      'Type your answer using the number pad or keyboard and press Enter (or tap the checkmark) to submit',
      'If correct: new problem appears instantly. If wrong: the correct answer flashes and a new problem appears',
      'Keep solving problems until the timer hits zero. Your score = how many you got right compared to the target number'
    ],
    tip: 'Speed is everything! Every 5 correct answers in a row earns +3 bonus seconds on the clock. A wrong answer resets your streak but doesn\'t cost time. On Easy it\'s just addition/subtraction; on Hard+ you get multiplication and division too.'
  },
  pattern: {
    steps: [
      'You\'ll see a sequence of numbers (like 2, 4, 8, 16, ?) with the last number hidden',
      'Figure out the pattern (adding, multiplying, squares, etc.) and select the correct next number from the multiple choice options below',
      'After you choose, the correct answer and the rule behind the pattern are revealed',
      'You play multiple rounds — each correct answer earns points. Your final score is based on how many you got right'
    ],
    tip: 'Common patterns: adding the same number each time (+3, +3, +3), multiplying (×2, ×2, ×2), perfect squares (1, 4, 9, 16...), Fibonacci (each = sum of previous two), or two interleaved sequences. Try subtracting consecutive numbers to spot the pattern!'
  },
  oddoneout: {
    steps: [
      'A grid of items appears — they could be numbers, emojis, or words. All of them belong to the same category except one',
      'For example: you might see a grid of fruits with one vegetable hidden among them, or a grid of even numbers with one odd number',
      'Tap the item that doesn\'t belong before the timer runs out! The correct answer and explanation are shown after each round',
      'You play multiple rounds. Your score = percentage of rounds you got correct'
    ],
    tip: 'First, figure out what category the items share (prime numbers? mammals? multiples of 3?). Then scan for the one that breaks the rule. On harder difficulties, the grid is bigger and you have less time per round.'
  },
  estimation: {
    steps: [
      'A trivia-style question asks you to estimate a number — like "How many bones in the human body?" or "How tall is the Eiffel Tower in meters?"',
      'Type your best numerical guess into the input field and press "Lock In" to submit',
      'Points are based on how close your guess is to the real answer: very close = 100 points, somewhat close = 60-80, way off = 0',
      'You play multiple rounds. After each round, the correct answer is revealed along with how your guess compared'
    ],
    tip: 'You don\'t need to be exact — just close! On Easy/Medium, a hint is shown (like "Over 200" or "Between 40-50") to help narrow it down. On Hard+, no hints are given and the tolerance for "close enough" is much tighter.'
  },
  hanoi: {
    steps: [
      'You\'ll see three pegs (A, B, C) with a stack of colored discs on peg A, arranged from largest at the bottom to smallest on top',
      'Your goal: move ALL the discs from peg A to peg C. Tap peg A to pick up its top disc (it lifts up), then tap peg C (or B) to drop it there',
      'The key rule: you can NEVER place a larger disc on top of a smaller one. You can use peg B as a temporary holding area',
      'Try to solve it in as few moves as possible. Your score is based on how close you are to the optimal (minimum) number of moves'
    ],
    tip: 'The minimum moves for n discs is 2^n - 1 (so 3 discs = 7 moves, 5 discs = 31 moves). Strategy: to move n discs from A to C, first move the top n-1 discs to B, then move the bottom disc to C, then move the n-1 discs from B to C. Tap a selected peg again to deselect (put the disc back down).'
  },
  simon: {
    steps: [
      'Colored buttons are shown on screen. Watch carefully as they light up one at a time in a sequence — each plays a unique tone',
      'After the sequence finishes playing, it\'s your turn! Tap the buttons in the exact same order they lit up',
      'If you repeat the sequence correctly, a new color is added to the end and the whole sequence plays again (now one step longer)',
      'If you tap the wrong button at any point, the game is over! Your score depends on how many rounds you survived'
    ],
    tip: 'Each color has its own sound — listening can help as much as watching! Try to remember the sequence in chunks (like "red-blue, then green-yellow") rather than individual colors. On harder difficulties, there are more colors (up to 8) and the sequence plays faster.'
  },
  chainword: {
    steps: [
      'A starting word is shown (like "apple"). Your job: type a new word that starts with the LAST letter of that word',
      'For example: "apple" ends in E, so you could type "elephant" (starts with E). Then "elephant" ends in T, so next you\'d type "tree", etc.',
      'Type your word in the text box and press Go (or Enter). You have a time limit for each word!',
      'Keep building the chain until you reach the target length or run out of time. No repeating words! Your score = chain length vs target'
    ],
    tip: 'Think ahead! Words ending in common letters (E, S, T, R) give you more options for the next word. Avoid words ending in uncommon letters like X, Z, or Q. On harder difficulties, the minimum word length is longer (4-5 letters) and you have less time per word.'
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
  if (ch === 'pulse') {
    html += `<div class="timer-note">⏱ Timer cannot be disabled — timing is the gameplay!</div>`;
  } else {
    const chTimerOn = getChallengeTimer(ch);
    html += `<div class="timer-toggle-row">
      <span class="timer-toggle-label">⏱ Timer</span>
      <span class="timer-toggle-status ${chTimerOn ? 'on' : 'off'}" id="timer-status">${chTimerOn ? 'ON' : 'OFF'}</span>
      <label class="toggle-switch">
        <input type="checkbox" id="timer-toggle" ${chTimerOn ? 'checked' : ''} onchange="toggleChallengeTimer('${ch}')">
        <span class="toggle-slider"></span>
      </label>
    </div>`;
  }
  if (ch === 'mosaic') {
    html += `<button class="btn btn-secondary btn-lg btn-full" style="margin-bottom:8px" onclick="showMosaicSymbolGuide()">Symbol Guide</button>`;
  }
  html += `<button class="btn btn-primary btn-lg btn-full" onclick="beginChallenge()">Start Game</button>`;
  html += `</div>`;
  c.innerHTML = html;
}

function beginChallenge() {
  // Set timer state for this specific challenge
  const ch = GS.selectedChallenges[GS.currentChallengeIdx];
  GS.timerEnabled = (ch === 'pulse') ? true : getChallengeTimer(ch);
  // Start global elapsed timer on first challenge
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
    case 'colorcode': renderColorCode(getColorCodePuzzle()); break;
    case 'quickmath': renderQuickMath(getQuickMathPuzzle()); break;
    case 'pattern': renderPattern(getPatternPuzzle()); break;
    case 'oddoneout': renderOddOneOut(getOddOneOutPuzzle()); break;
    case 'estimation': renderEstimation(getEstimationPuzzle()); break;
    case 'hanoi': renderHanoi(getHanoiPuzzle()); break;
    case 'simon': renderSimon(getSimonPuzzle()); break;
    case 'chainword': renderChainword(getChainwordPuzzle()); break;
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

function getChallengeTimer(ch) {
  const p = getPrefs();
  if (!p.challengeTimers) p.challengeTimers = {};
  return ch in p.challengeTimers ? p.challengeTimers[ch] : p.timerEnabled !== false;
}

function toggleChallengeTimer(ch) {
  const cb = document.getElementById('timer-toggle');
  const p = getPrefs();
  if (!p.challengeTimers) p.challengeTimers = {};
  p.challengeTimers[ch] = cb.checked;
  savePrefs(p);
  const status = document.getElementById('timer-status');
  if (status) {
    status.textContent = cb.checked ? 'ON' : 'OFF';
    status.className = 'timer-toggle-status ' + (cb.checked ? 'on' : 'off');
  }
}

function toggleGlobalTimer() {
  const cb = document.getElementById('global-timer-cb');
  const on = cb.checked;
  const p = getPrefs();
  p.timerEnabled = on;
  p.challengeTimers = {}; // reset all per-challenge overrides
  savePrefs(p);
  GS.timerEnabled = on;
  const status = document.getElementById('global-timer-status');
  if (status) {
    status.textContent = on ? 'ON' : 'OFF';
    status.className = 'timer-toggle-status ' + (on ? 'on' : 'off');
  }
}

