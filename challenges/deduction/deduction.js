// ==================== CHALLENGE 10: DEDUCTION ====================

function getDeductionPuzzle() {
  const d = GS.difficulty;
  const namePool = ['Alex','Blake','Casey','Dana','Ellis','Frankie','Gray','Harper','Jordan','Kai','Lee','Morgan','Nico','Pat','Quinn','Reese','Sam','Taylor'];
  const emojiPool = ['👤','👩','👨','🧑','👵','👴','🧔','👱','🧑‍🦰','🧑‍🦱'];
  const roles = rngShuffle(['Engineer','Doctor','Teacher','Chef','Artist','Pilot']);
  const traits = rngShuffle(['Honest','Brave','Clever','Calm','Loyal','Cautious']);
  const names = rngShuffle(namePool).slice(0,6);
  const emojis = rngShuffle(emojiPool).slice(0,6);
  const saboteurIdx = rngInt(0,5);
  const configs = {
    easy:       { questionChoices: 3, lieChance: 0.25, twinCount: 1, clueQuality: 'direct', hideInfo: false, rounds: 5, noisyHonest: false },
    medium:     { questionChoices: 3, lieChance: 0.4,  twinCount: 1, clueQuality: 'moderate', hideInfo: false, rounds: 5, noisyHonest: false },
    hard:       { questionChoices: 2, lieChance: 0.55, twinCount: 1, clueQuality: 'subtle', hideInfo: true, rounds: 5, noisyHonest: true },
    extreme:    { questionChoices: 2, lieChance: 0.65, twinCount: 2, clueQuality: 'minimal', hideInfo: true, rounds: 5, noisyHonest: true },
    impossible: { questionChoices: 2, lieChance: 0.5,  twinCount: 2, clueQuality: 'minimal', hideInfo: true, rounds: 4, noisyHonest: true }
  };
  const cfg = configs[d] || configs.medium;
  const characters = [];
  for (let i = 0; i < 6; i++) {
    characters.push({ name: names[i], emoji: emojis[i], role: roles[i], trait: traits[i], isSaboteur: i === saboteurIdx, isTwin: false, eliminated: false });
  }
  // Assign twins — always at least 1 innocent mirrors the saboteur
  const innocentIndices = [];
  for (let i = 0; i < 6; i++) { if (i !== saboteurIdx) innocentIndices.push(i); }
  const shuffledInnocents = rngShuffle(innocentIndices);
  for (let t = 0; t < cfg.twinCount && t < shuffledInnocents.length; t++) {
    characters[shuffledInnocents[t]].isTwin = true;
  }
  return { characters, saboteurIdx, config: cfg };
}

function renderDeduction(puzzle) {
  GS.challengeState.deduction = { puzzle, round: 1, phase: 'question', totalRounds: puzzle.config.rounds, questionHistory: [] };
  document.getElementById('btn-submit-challenge').style.display = 'none';
  renderDeductionRound();
}

function renderDeductionRound() {
  const st = GS.challengeState.deduction;
  const p = st.puzzle;
  const c = document.getElementById('game-container');
  const alive = p.characters.filter(ch => !ch.eliminated);

  if (st.round > st.totalRounds) { endDeduction(true); return; }

  let html = `<div style="padding:8px 0">`;
  html += `<div class="deduction-round-info"><span class="round-num">Round ${st.round} of ${st.totalRounds}</span><span>${alive.length} suspects remain</span></div>`;

  // Character grid
  html += `<div class="deduction-chars">`;
  p.characters.forEach((ch, i) => {
    const cls = ch.eliminated ? 'eliminated' : (st.phase === 'eliminate' ? 'target' : '');
    const infoText = p.config.hideInfo ? '???' : `${ch.role} · ${ch.trait}`;
    html += `<div class="deduction-char ${cls}" ${st.phase === 'eliminate' && !ch.eliminated ? `onclick="selectDeductionEliminate(${i})"` : ''}>
      <div class="dc-emoji">${ch.emoji}</div>
      <div class="dc-name">${ch.name}</div>
      <div class="dc-role">${infoText}</div>
    </div>`;
  });
  html += `</div>`;

  if (st.phase === 'question') {
    html += `<div class="deduction-phase-label">Choose a question to ask the crew:</div>`;
    const questions = generateDeductionQuestions(p, st);
    html += `<div class="deduction-questions">`;
    questions.forEach((q, i) => {
      html += `<button class="deduction-q-btn" onclick="selectDeductionQuestion(${i})">${q.text}</button>`;
    });
    html += `</div>`;
    st._currentQuestions = questions;
  } else if (st.phase === 'responses') {
    html += `<div class="deduction-phase-label">Crew responses:</div>`;
    html += `<div class="deduction-responses">`;
    st._currentResponses.forEach(r => {
      html += `<div class="deduction-resp"><span class="dr-name">${r.emoji} ${r.name}:</span> ${r.answer}</div>`;
    });
    html += `</div>`;
    html += `<button class="btn btn-primary btn-full" onclick="goToDeductionEliminate()" style="margin-top:12px">Eliminate a suspect →</button>`;
  } else if (st.phase === 'eliminate') {
    html += `<div class="deduction-elim-label">Tap a suspect to eliminate them</div>`;
  }

  html += `</div>`;
  c.innerHTML = html;
}

function generateDeductionQuestions(puzzle, st) {
  const alive = puzzle.characters.filter(ch => !ch.eliminated);
  const allQs = [];
  // Role query
  allQs.push({ type: 'role', text: `What roles does everyone claim to have?` });
  // Trait query
  allQs.push({ type: 'trait', text: `How would you describe your personality?` });
  // Accusation
  allQs.push({ type: 'accusation', text: `Who among you seems the most suspicious?` });
  // Alibi
  if (alive.length >= 3) {
    const a = alive[rngInt(0, alive.length - 1)];
    allQs.push({ type: 'alibi', target: a.name, text: `Can anyone vouch for ${a.name}?` });
  }
  // Targeted
  if (alive.length >= 2) {
    const t = alive[rngInt(0, alive.length - 1)];
    allQs.push({ type: 'targeted', target: t.name, text: `${t.name}, are you really a ${t.role}?` });
  }
  // Shuffle and pick
  const shuffled = rngShuffle(allQs);
  return shuffled.slice(0, puzzle.config.questionChoices);
}

function selectDeductionQuestion(idx) {
  const st = GS.challengeState.deduction;
  const p = st.puzzle;
  const q = st._currentQuestions[idx];
  const alive = p.characters.filter(ch => !ch.eliminated);
  const cfg = p.config;

  // Spontaneous: saboteur randomly decides to lie THIS round (no pattern)
  const sabLies = GS.rng() < cfg.lieChance;

  // Pre-compute shared lie content so saboteur + twins give matching answers
  const sabChar = p.characters[p.saboteurIdx];
  let sharedFakeTrait = null;
  let sharedAccuseTarget = null;
  let sharedAlibiDoubt = false;

  if (sabLies) {
    // Shared fake trait for trait questions
    const otherTraits = alive.filter(c => !c.isSaboteur && !c.isTwin).map(c => c.trait);
    sharedFakeTrait = otherTraits.length > 0 ? otherTraits[rngInt(0, otherTraits.length - 1)] : sabChar.trait;
    // Shared accusation target
    const targets = alive.filter(c => !c.isSaboteur && !c.isTwin);
    if (targets.length > 0 && rngInt(0, 2) > 0) {
      sharedAccuseTarget = targets[rngInt(0, targets.length - 1)].name;
    }
    // Shared alibi stance
    sharedAlibiDoubt = rngInt(0, 1) === 0;
  }

  const responses = [];
  alive.forEach(ch => {
    let answer = '';
    const isMimic = ch.isSaboteur || ch.isTwin;

    if (q.type === 'role') {
      if (isMimic && sabLies) {
        // Each mimic claims a different fake role (not their own)
        let fakeRoles = ['Engineer','Doctor','Teacher','Chef','Artist','Pilot'].filter(r => r !== ch.role);
        if (cfg.hideInfo) {
          const elimRoles = p.characters.filter(c => c.eliminated).map(c => c.role);
          const safer = fakeRoles.filter(r => elimRoles.includes(r));
          if (safer.length > 0) fakeRoles = safer;
        }
        const fakeRole = fakeRoles[rngInt(0, fakeRoles.length - 1)];
        const phrases = [`I'm the ${fakeRole}.`, `${fakeRole} — that's me.`, `I serve as the ${fakeRole}.`];
        answer = phrases[rngInt(0, phrases.length - 1)];
      } else {
        const phrases = [`I'm the ${ch.role}.`, `${ch.role} — that's me.`, `I serve as the ${ch.role}.`];
        answer = phrases[rngInt(0, phrases.length - 1)];
      }
    } else if (q.type === 'trait') {
      if (isMimic && sabLies) {
        // All mimics claim the SAME fake trait (links them)
        const phrases = [`I'd say I'm ${sharedFakeTrait}.`, `People tell me I'm ${sharedFakeTrait}.`, `${sharedFakeTrait}, definitely.`];
        answer = phrases[rngInt(0, phrases.length - 1)];
      } else {
        const phrases = [`I'd say I'm ${ch.trait}.`, `People tell me I'm ${ch.trait}.`, `${ch.trait}, definitely.`];
        answer = phrases[rngInt(0, phrases.length - 1)];
      }
    } else if (q.type === 'accusation') {
      if (isMimic) {
        if (sharedAccuseTarget && sabLies) {
          // All mimics accuse the SAME innocent (links them)
          const phrases = [
            `I think ${sharedAccuseTarget} has been acting strangely.`,
            `Something feels off about ${sharedAccuseTarget}.`,
            `I'm not totally sure about ${sharedAccuseTarget}.`
          ];
          answer = phrases[rngInt(0, phrases.length - 1)];
        } else {
          const vague = [`Hard to say.`, `Can't be sure.`, `I trust most of us.`, `Everyone seems fine to me.`];
          answer = vague[rngInt(0, vague.length - 1)];
        }
      } else {
        // Honest crew based on clue quality
        const saboteur = p.characters[p.saboteurIdx];
        if (cfg.clueQuality === 'direct') {
          answer = `${saboteur.name} gave me a bad feeling.`;
        } else if (cfg.clueQuality === 'moderate') {
          const hints = [`Someone here isn't what they seem.`, `I've noticed inconsistencies from one person.`, `Not everyone is telling the truth.`];
          answer = hints[rngInt(0, hints.length - 1)];
        } else {
          if (cfg.noisyHonest && rngInt(0, 2) > 0) {
            const others = alive.filter(c => c !== ch);
            const randomTarget = others[rngInt(0, others.length - 1)];
            const noisy = [
              `I think ${randomTarget.name} has been acting strangely.`,
              `Something feels off about ${randomTarget.name}.`,
              `I'm not totally sure about ${randomTarget.name}.`,
              `Hard to say.`, `Can't be sure.`, `Everyone seems fine to me.`
            ];
            answer = noisy[rngInt(0, noisy.length - 1)];
          } else {
            const vague = [`Hard to say.`, `I trust most of us.`, `Can't be sure.`, `No comment.`];
            answer = vague[rngInt(0, vague.length - 1)];
          }
        }
      }
    } else if (q.type === 'alibi') {
      const targetChar = alive.find(c => c.name === q.target);
      if (ch.name === q.target) {
        const self = [`I can speak for myself — I've been doing my job.`, `I've been working the whole time.`, `I have nothing to hide.`];
        answer = self[rngInt(0, self.length - 1)];
      } else if (isMimic && sabLies) {
        if (targetChar && !targetChar.isSaboteur && !targetChar.isTwin) {
          if (sharedAlibiDoubt) {
            const doubts = [`I wouldn't trust ${q.target} completely.`, `I'm not sure about ${q.target}.`, `Can't say for sure.`];
            answer = doubts[rngInt(0, doubts.length - 1)];
          } else {
            answer = `${q.target} seems fine to me.`;
          }
        } else {
          answer = `${q.target} seems fine to me.`;
        }
      } else {
        if (targetChar && targetChar.isSaboteur && cfg.clueQuality === 'direct') {
          answer = `Actually, I'm not sure about ${q.target}.`;
        } else if (cfg.noisyHonest && rngInt(0, 2) === 0) {
          const hedges = [`${q.target} has been reliable.`, `I think ${q.target} is fine.`, `Can't say for sure.`, `I'm not sure about ${q.target}.`];
          answer = hedges[rngInt(0, hedges.length - 1)];
        } else {
          answer = `${q.target} has been reliable.`;
        }
      }
    } else if (q.type === 'targeted') {
      if (ch.name === q.target) {
        if (cfg.noisyHonest || (isMimic && sabLies)) {
          const affirmations = [
            `Yes, I am the ${ch.role}. You can count on me.`,
            `Absolutely, I am!`,
            `Of course. Why would you doubt me?`,
            `That's right, I'm the ${ch.role}.`
          ];
          answer = affirmations[rngInt(0, affirmations.length - 1)];
        } else {
          answer = `Yes, I am the ${ch.role}. You can count on me.`;
        }
      } else {
        if (cfg.noisyHonest) {
          const comments = [`I believe so.`, `Seems legit.`, `I think so.`, `Can't say for certain.`, `I doubt it.`];
          answer = comments[rngInt(0, comments.length - 1)];
        } else if (isMimic && sabLies) {
          const targetChar = alive.find(c => c.name === q.target);
          answer = targetChar && !targetChar.isSaboteur && !targetChar.isTwin ? `I doubt it.` : `Seems legit.`;
        } else {
          answer = `I believe so.`;
        }
      }
    }
    responses.push({ name: ch.name, emoji: ch.emoji, answer });
  });

  st._currentResponses = rngShuffle(responses);
  st.questionHistory.push({ round: st.round, question: q.text, responses: st._currentResponses });
  st.phase = 'responses';
  renderDeductionRound();
}

function goToDeductionEliminate() {
  GS.challengeState.deduction.phase = 'eliminate';
  renderDeductionRound();
}

function selectDeductionEliminate(charIdx) {
  const st = GS.challengeState.deduction;
  const p = st.puzzle;
  const ch = p.characters[charIdx];
  if (ch.eliminated) return;

  ch.eliminated = true;

  if (ch.isSaboteur) {
    endDeduction(false);
    return;
  }

  st.round++;
  st.phase = 'question';
  renderDeductionRound();
}

function endDeduction(won) {
  const score = won ? 100 : 0;
  GS.results.deduction = score;
  if (GS.mode === 'daily') setDailyCompletion('deduction', score);

  const st = GS.challengeState.deduction;
  const saboteur = st.puzzle.characters[st.puzzle.saboteurIdx];
  if (GS.mode === 'daily') {
    const elims = st.puzzle.characters.filter(ch => ch.eliminated).map(ch => ({ name: ch.name, emoji: ch.emoji, role: ch.role, isSaboteur: ch.isSaboteur }));
    lsSet('daily-deduction-state-'+getDailyDateStr(), { won, saboteur: { name: saboteur.name, emoji: saboteur.emoji, role: saboteur.role, trait: saboteur.trait }, eliminations: elims, rounds: st.round });
  }
  const eliminated = st.puzzle.characters.filter(ch => ch.eliminated);
  const elimList = eliminated.map(ch =>
    `<div class="cs-choice"><span>${ch.isSaboteur ? '✗' : '✓'}</span><span style="flex:1">${ch.emoji} ${ch.name} (${ch.role})</span></div>`
  ).join('');
  showChallengeSummary({
    emoji: won ? '🕵️' : '💀',
    score,
    title: won ? 'Case Solved!' : 'You Lose!',
    stats: [
      { label: 'Rounds played', value: st.round },
      { label: 'Saboteur', value: `${saboteur.name} (${saboteur.emoji})` },
      { label: 'Role / Trait', value: `${saboteur.role} · ${saboteur.trait}` }
    ],
    miniReview: elimList ? `<div style="font-size:12px;color:var(--fg2);margin-bottom:4px">Eliminations:</div>${elimList}` : ''
  });
}
