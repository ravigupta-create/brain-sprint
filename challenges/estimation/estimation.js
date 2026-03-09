// ==================== CHALLENGE 19: ESTIMATION STATION ====================

const ESTIMATION_BANK = [
  { q:'How many bones in the adult human body?', answer:206, unit:'bones', hint:'More than 200' },
  { q:'How many countries are in the world?', answer:195, unit:'countries', hint:'Close to 200' },
  { q:'How many teeth does an adult human have?', answer:32, unit:'teeth', hint:'Between 28-36' },
  { q:'How tall is the Eiffel Tower in meters?', answer:330, unit:'meters', hint:'Over 300m' },
  { q:'How many keys on a standard piano?', answer:88, unit:'keys', hint:'Less than 100' },
  { q:'How many elements in the periodic table?', answer:118, unit:'elements', hint:'Over 100' },
  { q:'How many minutes in a week?', answer:10080, unit:'minutes', hint:'Over 10,000' },
  { q:'How many hearts does an octopus have?', answer:3, unit:'hearts', hint:'More than 1' },
  { q:'How many miles is a marathon?', answer:26, unit:'miles', hint:'Between 20-30' },
  { q:'How many cards in a standard deck (no jokers)?', answer:52, unit:'cards', hint:'Around 50' },
  { q:'How many chromosomes do humans have?', answer:46, unit:'chromosomes', hint:'Between 40-50' },
  { q:'Speed of sound in m/s at sea level?', answer:343, unit:'m/s', hint:'Between 300-400' },
  { q:'How many moons does Jupiter have?', answer:95, unit:'moons', hint:'A lot!' },
  { q:'How many states in the USA?', answer:50, unit:'states', hint:'Exactly round' },
  { q:'How many squares on a chess board?', answer:64, unit:'squares', hint:'A power of 2' },
  { q:'How many players on a soccer team (on field)?', answer:11, unit:'players', hint:'10-15' },
  { q:'How many feet in a mile?', answer:5280, unit:'feet', hint:'Over 5000' },
  { q:'How many days in a leap year?', answer:366, unit:'days', hint:'One more than usual' },
  { q:'Average resting heart rate (bpm)?', answer:72, unit:'bpm', hint:'60-80 range' },
  { q:'How many letters in the Greek alphabet?', answer:24, unit:'letters', hint:'Around 24' },
  { q:'Distance from Earth to Moon in km (thousands)?', answer:384, unit:'thousand km', hint:'About 384,000' },
  { q:'Boiling point of water in Fahrenheit?', answer:212, unit:'°F', hint:'Over 200' },
  { q:'How many bones in a human hand?', answer:27, unit:'bones', hint:'More than 20' },
  { q:'How many muscles in the human body?', answer:600, unit:'muscles', hint:'Several hundred' },
  { q:'How many vertices does a dodecahedron have?', answer:20, unit:'vertices', hint:'Around 20' },
  { q:'Number of symphonies Beethoven composed?', answer:9, unit:'symphonies', hint:'Less than 10' },
  { q:'How many time zones are there?', answer:24, unit:'time zones', hint:'Same as hours in a day' },
  { q:'How many rings in the Olympic symbol?', answer:5, unit:'rings', hint:'Less than 10' },
  { q:'Speed of light in km/s (thousands)?', answer:300, unit:'thousand km/s', hint:'About 300,000' },
  { q:'How many lines in a sonnet?', answer:14, unit:'lines', hint:'Around 14' },
  { q:'Diameter of Earth in km (thousands)?', answer:13, unit:'thousand km', hint:'About 12,700' },
  { q:'How many stomachs does a cow have?', answer:4, unit:'stomachs', hint:'More than 1' },
  { q:'How many dots on a pair of dice?', answer:42, unit:'dots', hint:'Between 40-50' },
  { q:'Highest possible score in bowling?', answer:300, unit:'points', hint:'A perfect game' },
  { q:'How many Harry Potter books are there?', answer:7, unit:'books', hint:'Less than 10' },
  { q:'How many stripes on the US flag?', answer:13, unit:'stripes', hint:'Same as original colonies' },
];

function getEstimationPuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:       { rounds: 4, showHint: true, tolerance: 0.30 },
    medium:     { rounds: 5, showHint: true, tolerance: 0.20 },
    hard:       { rounds: 5, showHint: false, tolerance: 0.15 },
    extreme:    { rounds: 6, showHint: false, tolerance: 0.10 },
    impossible: { rounds: 6, showHint: false, tolerance: 0.05 }
  };
  const cfg = configs[d] || configs.medium;
  const shuffled = rngShuffle([...ESTIMATION_BANK]);
  const rounds = shuffled.slice(0, cfg.rounds);
  return { ...cfg, rounds, difficulty: d };
}

function renderEstimation(puzzle) {
  document.getElementById('btn-submit-challenge').style.display = 'none';
  GS.challengeState.estimation = {
    puzzle, currentRound: 0, totalScore: 0, answers: [], gameOver: false
  };
  renderEstimationRound();
}

function renderEstimationRound() {
  const st = GS.challengeState.estimation;
  const p = st.puzzle;
  const c = document.getElementById('game-container');

  if (st.currentRound >= p.rounds.length) { endEstimation(); return; }

  const round = p.rounds[st.currentRound];
  let html = '<div class="est-container">';
  html += `<div class="est-progress">Question ${st.currentRound + 1} of ${p.rounds.length}</div>`;
  html += `<div class="est-question">${round.q}</div>`;
  if (p.showHint) {
    html += `<div class="est-hint">💡 Hint: ${round.hint}</div>`;
  }
  html += `<div class="est-input-row">`;
  html += `<input type="number" class="est-input" id="est-input" inputmode="numeric" autocomplete="off" placeholder="Your guess">`;
  html += `<span class="est-unit">${round.unit}</span>`;
  html += `</div>`;
  html += `<button class="btn btn-primary btn-full" onclick="submitEstimation()" style="margin-top:12px">Lock In</button>`;
  html += '<div class="est-feedback" id="est-feedback"></div>';
  html += '</div>';
  c.innerHTML = html;

  const input = document.getElementById('est-input');
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submitEstimation(); } });
  setTimeout(() => input.focus(), 100);
}

function submitEstimation() {
  const st = GS.challengeState.estimation;
  if (st.gameOver) return;
  const input = document.getElementById('est-input');
  const guess = parseFloat(input.value);
  if (isNaN(guess)) {
    const feedback = document.getElementById('est-feedback');
    if (feedback) { feedback.textContent = 'Enter a number'; feedback.className = 'est-feedback est-fb-wrong'; }
    return;
  }

  const round = st.puzzle.rounds[st.currentRound];
  const answer = round.answer;
  const error = Math.abs(guess - answer) / answer;
  const tolerance = st.puzzle.tolerance;

  let roundScore;
  if (error <= tolerance * 0.25) roundScore = 100;
  else if (error <= tolerance * 0.5) roundScore = 80;
  else if (error <= tolerance) roundScore = 60;
  else if (error <= tolerance * 2) roundScore = 30;
  else roundScore = 0;

  st.totalScore += roundScore;
  st.answers.push({ guess, answer: round.answer, score: roundScore, error });

  // Disable input
  input.disabled = true;
  document.querySelector('.est-container .btn').disabled = true;

  const feedback = document.getElementById('est-feedback');
  const direction = guess > answer ? 'too high' : guess < answer ? 'too low' : 'exactly right';
  const icon = roundScore >= 60 ? '✓' : '✗';
  const cls = roundScore >= 60 ? 'est-fb-correct' : 'est-fb-wrong';

  if (roundScore >= 60) SFX.correct(); else SFX.wrong();

  if (feedback) {
    feedback.innerHTML = `<strong>${icon} ${roundScore >= 60 ? 'Close!' : 'Off!'}</strong> The answer is <strong>${answer} ${round.unit}</strong>. Your guess was ${direction}. (+${roundScore} pts)`;
    feedback.className = 'est-feedback ' + cls;
  }

  st.currentRound++;
  setTimeout(() => renderEstimationRound(), 2200);
}

function endEstimation() {
  const st = GS.challengeState.estimation;
  st.gameOver = true;
  const maxScore = st.puzzle.rounds.length * 100;
  const score = Math.round(100 * st.totalScore / maxScore);

  GS.results.estimation = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('estimation', score);
    lsSet('daily-estimation-state-' + getDailyDateStr(), {
      totalScore: st.totalScore, rounds: st.puzzle.rounds.length
    });
  }

  let reviewHtml = '';
  st.answers.forEach((a, i) => {
    const round = st.puzzle.rounds[i];
    const icon = a.score >= 60 ? '✓' : '✗';
    reviewHtml += `<div class="cs-choice"><span>${icon}</span><span style="flex:1">${round.q}<br><small>Guess: ${a.guess} | Answer: ${a.answer} (+${a.score})</small></span></div>`;
  });

  showChallengeSummary({
    emoji: score >= 80 ? '🎯' : score >= 50 ? '📐' : '🤷',
    score,
    title: score >= 80 ? 'Great Estimator!' : score >= 50 ? 'Not Bad!' : 'Way Off!',
    stats: [
      { label: 'Points earned', value: `${st.totalScore} / ${maxScore}` },
      { label: 'Tolerance', value: `±${Math.round(st.puzzle.tolerance * 100)}%` }
    ],
    miniReview: reviewHtml
  });
}
