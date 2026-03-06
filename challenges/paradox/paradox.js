// ==================== CHALLENGE 3: MINI PARADOX ====================
const PARADOX_BANK = [
  // --- Classic Probability ---
  {
    id:'monty1', cat:'probability',
    scenario:'You\'re on a game show. There are 3 doors: behind one is a car, behind the others are goats. You pick Door 1. The host, who knows what\'s behind the doors, opens Door 3 to reveal a goat. Should you switch to Door 2?',
    options:['Yes, switching gives 2/3 chance','No, it\'s 50/50 either way','It doesn\'t matter, probability is the same','No, sticking gives 2/3 chance'],
    correct:0,
    explanation:'This is the Monty Hall Problem. When you first picked, you had 1/3 chance. The other two doors collectively had 2/3. When the host reveals a goat, that 2/3 probability concentrates on the remaining door. Switching wins 2/3 of the time.',
    hint:'Think about where the 2/3 probability goes after a door is revealed.',
    difficulty:1
  },
  {
    id:'birthday1', cat:'probability',
    scenario:'In a room of 23 people, what is roughly the probability that at least two people share a birthday?',
    options:['About 50%','About 6%','About 25%','About 75%'],
    correct:0,
    explanation:'The Birthday Paradox: with 23 people, there\'s approximately a 50.7% chance of a shared birthday. This seems counterintuitive because we compare all possible pairs (253 pairs), not individuals to a fixed date.',
    hint:'Consider how many pairs of people can be formed.',
    difficulty:1
  },
  {
    id:'envelope1', cat:'probability',
    scenario:'Two envelopes each contain money. One has exactly twice the other. You pick one and see $100. Should you switch?',
    options:['Yes, expected value of switching is higher','No, expected value is the same','Only if you\'re risk-seeking','It depends on the total pool'],
    correct:1,
    explanation:'The Two Envelope Paradox: the naive calculation (50% chance of $50, 50% chance of $200 = EV $125) is flawed. Since you don\'t know which envelope is bigger, the expected value of switching is identical to keeping.',
    hint:'Is your reasoning symmetric? Would the same logic apply no matter which envelope you opened?',
    difficulty:2
  },
  {
    id:'simpson1', cat:'probability',
    scenario:'Hospital A has better survival rates than Hospital B for both simple and complex surgeries. Yet Hospital B has a better overall survival rate. Is this possible?',
    options:['Yes, this is Simpson\'s Paradox','No, this is mathematically impossible','Only with equal patient counts','Only if data is fabricated'],
    correct:0,
    explanation:'Simpson\'s Paradox occurs when a trend in subgroups reverses in combined data. Hospital B might take mostly simple cases (high survival), while Hospital A takes mostly complex cases. The combined rates can flip.',
    hint:'What if the hospitals handle very different proportions of simple vs complex cases?',
    difficulty:2
  },
  {
    id:'boy_girl1', cat:'probability',
    scenario:'A family has two children. You learn that at least one is a boy. What is the probability both are boys?',
    options:['1/3','1/2','1/4','2/3'],
    correct:0,
    explanation:'The possible equally likely combinations are BB, BG, GB (GG is eliminated). Only one of these three has two boys, so the probability is 1/3. This differs from "the OLDER child is a boy" which would give 1/2.',
    hint:'List all possible combinations of two children and eliminate impossible ones.',
    difficulty:2
  },
  {
    id:'sleeping1', cat:'probability',
    scenario:'Sleeping Beauty is put to sleep. A fair coin is flipped. If heads: she\'s woken once (Monday). If tails: she\'s woken twice (Monday and Tuesday), with memory erased between. When she wakes, what should she believe the probability of heads is?',
    options:['1/3','1/2','2/3','Cannot be determined'],
    correct:0,
    explanation:'The "thirder" position: there are 3 equally likely waking events (Mon-Heads, Mon-Tails, Tue-Tails). Since she can\'t distinguish them, P(Heads) = 1/3. The "halfer" position (1/2) is also defended, making this a genuine philosophical paradox.',
    hint:'Count the number of possible awakening events.',
    difficulty:3
  },
  {
    id:'bertrand1', cat:'probability',
    scenario:'You randomly draw a card from a box with 3 cards: one gold on both sides, one silver on both sides, one gold on one side and silver on the other. You see a gold side. What\'s the probability the other side is also gold?',
    options:['2/3','1/2','1/3','3/4'],
    correct:0,
    explanation:'Bertrand\'s Box Paradox: there are 3 equally likely gold faces you could see (2 from the gold-gold card, 1 from the mixed card). Two of those 3 gold faces have gold on the other side, so the probability is 2/3.',
    hint:'Count gold faces, not cards.',
    difficulty:2
  },
  // --- Logic Paradoxes ---
  {
    id:'barber1', cat:'logic',
    scenario:'In a village, the barber shaves everyone who does not shave themselves, and only those people. Who shaves the barber?',
    options:['This is a paradox — no consistent answer exists','The barber shaves himself','Someone outside the village','The barber doesn\'t need shaving'],
    correct:0,
    explanation:'Russell\'s Barber Paradox: If the barber shaves himself, he\'s shaving someone who shaves themselves (contradiction). If he doesn\'t, then he should shave himself (also contradiction). The scenario is logically impossible.',
    hint:'Try both assumptions: the barber shaves himself, and the barber doesn\'t.',
    difficulty:1
  },
  {
    id:'liar1', cat:'logic',
    scenario:'Consider the statement: "This sentence is false." Is it true or false?',
    options:['Neither — it\'s a paradox with no truth value','True','False','Both true and false simultaneously'],
    correct:0,
    explanation:'The Liar Paradox: if it\'s true, then it\'s false (as it claims). If it\'s false, then "this sentence is false" is false, meaning the sentence is true. It cannot consistently be either.',
    hint:'What happens if you assume it\'s true? What if false?',
    difficulty:1
  },
  {
    id:'ship1', cat:'logic',
    scenario:'The Ship of Theseus has every plank replaced one by one. The old planks are assembled into a second ship. Which ship is the "real" Ship of Theseus?',
    options:['There is no definitive answer — identity is ambiguous','The ship with all new planks (continuity of form)','The ship made from original planks (continuity of material)','Neither ship is the original'],
    correct:0,
    explanation:'The Ship of Theseus shows that "identity" is not a simple concept. Both ships have claims: one has continuity of form/function, the other continuity of material. This paradox exposes the limits of identity.',
    hint:'Consider what makes something "the same" object.',
    difficulty:1
  },
  {
    id:'heap1', cat:'logic',
    scenario:'If you remove one grain from a heap of sand, it\'s still a heap. By repeating, you\'d conclude a single grain is a heap. Where is the boundary?',
    options:['There is no sharp boundary — "heap" is vague','At exactly 100 grains','At exactly 1000 grains','The boundary depends on the observer'],
    correct:0,
    explanation:'The Sorites (Heap) Paradox: vague predicates like "heap" have no sharp boundary. This challenges classical logic\'s law of excluded middle and has led to development of fuzzy logic and supervaluationism.',
    hint:'Can any single grain removal change a heap to a non-heap?',
    difficulty:1
  },
  {
    id:'achilles1', cat:'logic',
    scenario:'Achilles gives a tortoise a head start. To overtake it, he must first reach where it was, but it has moved ahead. He must then reach THAT point, but it\'s moved again — infinitely. Does Achilles ever pass the tortoise?',
    options:['Yes — the infinite series converges to a finite time','No — he can never close an infinite series of gaps','Only if he\'s fast enough','Only in theory, not in practice'],
    correct:0,
    explanation:'Zeno\'s Paradox of Achilles: the sum of infinite decreasing intervals converges. If Achilles runs at 10 m/s and the tortoise at 1 m/s with a 10m lead, he catches up at 10/(10-1) = 1.11 seconds. Calculus resolves this.',
    hint:'What happens when you add up an infinite series where each term is much smaller than the last?',
    difficulty:2
  },
  // --- Game Theory ---
  {
    id:'prisoner1', cat:'game_theory',
    scenario:'In the Prisoner\'s Dilemma (one round), you and a partner can each cooperate or defect. Mutual cooperation: 1 year each. Mutual defection: 3 years each. One defects while other cooperates: defector goes free, cooperator gets 5 years. Rational choice?',
    options:['Defect — it\'s the dominant strategy','Cooperate — mutual benefit is better','It depends on what the other does','Randomly choose with 50/50'],
    correct:0,
    explanation:'In a single-round Prisoner\'s Dilemma, defection strictly dominates: regardless of what the other player does, you\'re better off defecting. This makes (Defect, Defect) the Nash equilibrium, despite mutual cooperation being collectively better.',
    hint:'Consider your best response if the other cooperates, then if they defect.',
    difficulty:2
  },
  {
    id:'newcomb1', cat:'game_theory',
    scenario:'A perfect predictor offers you two boxes. Box A is transparent with $1,000. Box B is opaque. If the predictor predicted you\'d take only Box B, it contains $1,000,000. If it predicted you\'d take both, Box B is empty. Take one box or both?',
    options:['Take only Box B ($1,000,000)','Take both boxes','It depends on whether you believe in free will','Take Box A only'],
    correct:0,
    explanation:'Newcomb\'s Paradox: Two valid reasoning methods conflict. Expected utility says take just Box B (the predictor is almost always right). Dominance principle says take both (the money is already placed). Most decision theorists favor one-boxing.',
    hint:'If the predictor has a nearly perfect track record, what do two-boxers typically end up with?',
    difficulty:3
  },
  {
    id:'stag1', cat:'game_theory',
    scenario:'Two hunters can each hunt a stag (requires both cooperating) or a hare (can catch alone). Stag gives 5 units each, hare gives 2 units. You can\'t communicate. What should you hunt?',
    options:['Stag — if you trust your partner','Hare — guaranteed payoff','Flip a coin','Stag is always dominant'],
    correct:0,
    explanation:'The Stag Hunt has two Nash equilibria: both hunt stag (payoff-dominant) or both hunt hare (risk-dominant). Unlike Prisoner\'s Dilemma, cooperation IS an equilibrium — but it requires trust. There\'s no single "rational" answer.',
    hint:'Unlike the Prisoner\'s Dilemma, mutual cooperation is stable here IF both choose it.',
    difficulty:2
  },
  // --- Math/Logic Puzzles ---
  {
    id:'blue_eyes1', cat:'logic',
    scenario:'100 islanders have blue eyes, 100 have brown. They can see others\' eyes but not their own. Anyone who deduces their own eye color must leave at midnight. A visitor says "I see someone with blue eyes." When do the blue-eyed people leave?',
    options:['On day 100','On day 1','On day 50','They never leave'],
    correct:0,
    explanation:'This is the Blue Eyes puzzle (common knowledge). The visitor\'s statement adds common knowledge. With 1 blue-eyed person, they\'d leave day 1. With 2, day 2 (each waits to see if the other leaves). By induction, 100 blue-eyed people leave on day 100.',
    hint:'Start with just 1 blue-eyed person. Then consider 2. See the pattern?',
    difficulty:3
  },
  {
    id:'hat1', cat:'logic',
    scenario:'Three people wear hats (from 2 red, 3 blue). Each sees others\' hats but not their own. Person A sees two blue hats and can\'t determine their own. Person B, hearing this, also sees two hats but can\'t determine their own. Can Person C determine theirs?',
    options:['Yes — C has a blue hat','Yes — C has a red hat','No — not enough information','Only if C can see A and B'],
    correct:0,
    explanation:'If C had red, then B would see one red (C) and one blue (A or vice versa). If B also saw red on A, B could deduce blue. But B can\'t tell — meaning B doesn\'t see red on both A and C. Since A can\'t tell (sees two blue), and B can\'t tell, C deduces blue.',
    hint:'What would B see if C had a red hat? Would B then be able to figure out their own?',
    difficulty:3
  },
  {
    id:'pirates1', cat:'game_theory',
    scenario:'5 pirates split 100 gold coins. The most senior proposes a split; if at least half accept, it passes. Otherwise, they throw that pirate overboard and the next proposes. Pirate 1 (most senior) proposes. What\'s the optimal strategy?',
    options:['Give 1 coin each to pirates 3 and 5, keep 98','Split equally: 20 each','Give 99 to pirate 2 to guarantee approval','Give 50 to pirate 2, keep 50'],
    correct:0,
    explanation:'Working backward: Pirate 5 alone keeps 100. Pirate 4 needs pirate 5, offers 5 one coin. Pirate 3 needs one vote: offers 4 one coin. Pirate 2 needs two votes: offers 3 and 5 one coin each. Pirate 1 needs two votes: offers 3 and 5 one coin each (better than their backward-induction payoff), keeps 98.',
    hint:'Work backwards from what happens with 2 pirates, then 3, then 4...',
    difficulty:3
  },
  {
    id:'coin_weigh1', cat:'logic',
    scenario:'You have 12 coins. One is fake and either heavier or lighter. Using a balance scale exactly 3 times, can you find the fake coin AND determine if it\'s heavier or lighter?',
    options:['Yes — 3 weighings can distinguish 24 outcomes','No — 3 weighings can only distinguish 8 outcomes','Yes, but only if the fake is heavier','Only with 4 weighings'],
    correct:0,
    explanation:'Each weighing has 3 outcomes (left heavy, balanced, right heavy), so 3 weighings give 3³ = 27 possible results. Since there are 24 possibilities (12 coins × heavier or lighter), it\'s theoretically possible — and a specific algorithm exists.',
    hint:'How many distinct outcomes can 3 weighings produce? (Each has 3 possible results.)',
    difficulty:3
  },
  // --- More probability ---
  {
    id:'false_pos1', cat:'probability',
    scenario:'A disease affects 1% of people. A test is 95% accurate (both sensitivity and specificity). You test positive. What\'s the approximate probability you actually have the disease?',
    options:['About 16%','About 95%','About 50%','About 1%'],
    correct:0,
    explanation:'Base Rate Fallacy: Using Bayes\' theorem: P(disease|positive) = (0.01 × 0.95) / (0.01 × 0.95 + 0.99 × 0.05) = 0.0095/0.0590 ≈ 16%. The low base rate means most positives are false positives.',
    hint:'Consider how many false positives occur in the 99% of healthy people.',
    difficulty:2
  },
  {
    id:'dice1', cat:'probability',
    scenario:'You roll two fair dice. At least one shows a 6. What\'s the probability both show a 6?',
    options:['1/11','1/6','1/36','2/11'],
    correct:0,
    explanation:'There are 36 equally likely outcomes. 11 of them include at least one 6 (6 with first die + 6 with second die - 1 overlap). Only 1 of those 11 is double sixes. So P = 1/11.',
    hint:'Count outcomes with at least one 6, then count double-6 outcomes.',
    difficulty:2
  },
  {
    id:'russian1', cat:'probability',
    scenario:'Russian roulette: a revolver has 2 bullets in adjacent chambers out of 6. After one empty shot, you can spin again or pull again. Which gives better survival odds?',
    options:['Pull again (3/4 survival vs 2/3)','Spin again (2/3 survival vs 3/4)','Both give equal odds','Depends on bullet positions'],
    correct:0,
    explanation:'After surviving, you\'re at one of 4 empty chambers. Of those 4, only 1 is followed by a bullet (the one right before the loaded pair). So pulling again: 3/4 survival. Spinning: 4/6 = 2/3. Pulling is safer.',
    hint:'Of the 4 empty chambers you could be at, how many have another empty chamber next?',
    difficulty:3
  },
  {
    id:'bayes_taxi1', cat:'probability',
    scenario:'A city has 85% green taxis and 15% blue. A witness identifies a taxi in an accident as blue. Witnesses correctly identify color 80% of the time. What\'s the probability the taxi was actually blue?',
    options:['About 41%','About 80%','About 15%','About 60%'],
    correct:0,
    explanation:'Bayes\' theorem: P(Blue|Witness says blue) = P(witness says blue|Blue) × P(Blue) / P(witness says blue) = (0.80 × 0.15) / (0.80 × 0.15 + 0.20 × 0.85) = 0.12/0.29 ≈ 41%.',
    hint:'Consider how many green taxis would be misidentified as blue.',
    difficulty:2
  },
  // --- More Logic ---
  {
    id:'unexpected1', cat:'logic',
    scenario:'A judge tells a prisoner: "You will be hanged one day next week, and you won\'t know the day in advance." The prisoner reasons it can\'t be Friday (he\'d know Thursday night), then Thursday (same logic), etc. He concludes it\'s impossible. Is he right?',
    options:['No — the surprise hanging is still possible','Yes — the logic is airtight','Only if the week has fewer than 5 days','It depends on the prisoner\'s memory'],
    correct:0,
    explanation:'The Unexpected Hanging Paradox: the prisoner\'s backward induction is flawed. By concluding it\'s impossible, he\'s surprised when hanged on (say) Wednesday. The paradox shows the limits of self-referential reasoning about knowledge and surprise.',
    hint:'If the prisoner is CERTAIN it won\'t happen, can he truly not be surprised?',
    difficulty:2
  },
  {
    id:'croc1', cat:'logic',
    scenario:'A crocodile steals a child and says: "If you guess correctly what I\'ll do, I\'ll return the child." The mother says: "You will NOT return my child." What should the crocodile do?',
    options:['It\'s a paradox — neither option is consistent','Return the child (she guessed wrong)','Keep the child (she guessed right)','The crocodile can choose freely'],
    correct:0,
    explanation:'The Crocodile Dilemma: If it keeps the child, the mother was right, so it should return the child. But then she was wrong, so it should keep the child. Neither action is consistent — a genuine logical paradox.',
    hint:'Try each option and check if it\'s consistent with the mother\'s guess.',
    difficulty:2
  },
  {
    id:'omnipotence1', cat:'logic',
    scenario:'Can an omnipotent being create a stone so heavy that even they cannot lift it?',
    options:['The question reveals a paradox in the concept of omnipotence','Yes — and then they lift it anyway','No — omnipotence means they can lift anything','Yes — they sacrifice some power to create it'],
    correct:0,
    explanation:'The Omnipotence Paradox: If yes, there\'s something they can\'t do (lift it). If no, there\'s something they can\'t do (create it). Either way, omnipotence is self-contradictory, suggesting the concept needs refinement.',
    hint:'Consider what happens in both the "yes" and "no" cases.',
    difficulty:1
  },
  {
    id:'grandfather1', cat:'logic',
    scenario:'If you travel back in time and prevent your grandfather from meeting your grandmother, you\'d never be born — so you could never travel back to prevent it. Is time travel self-contradictory?',
    options:['It creates an unresolvable causal loop','No — a parallel universe is created','Your grandfather would still meet her somehow','Time prevents paradoxes automatically'],
    correct:0,
    explanation:'The Grandfather Paradox highlights the logical contradictions of backwards causation. It\'s a key argument against certain models of time travel. Solutions include many-worlds interpretation, Novikov self-consistency principle, or simply declaring such travel impossible.',
    hint:'Can an effect prevent its own cause?',
    difficulty:1
  },
  // --- Decision Theory / Social ---
  {
    id:'trolley1', cat:'ethics',
    scenario:'A trolley is headed toward 5 people. You can flip a switch to divert it to another track where it will hit 1 person. Is it moral to flip the switch?',
    options:['There is no universal answer — it depends on moral framework','Yes — utilitarianism demands saving more lives','No — actively causing death is always wrong','Yes — inaction is also a choice'],
    correct:0,
    explanation:'The Trolley Problem divides moral philosophers: utilitarians say flip (5 > 1), deontologists may say you shouldn\'t use someone as a means. The variant where you push someone off a bridge to stop the trolley shows that our intuitions are inconsistent.',
    hint:'Would your answer change if you had to physically push someone?',
    difficulty:1
  },
  {
    id:'utility1', cat:'probability',
    scenario:'You can have $1,000,000 for certain, or a 50% chance at $3,000,000 (and 50% chance of $0). A pure expected-value calculator would pick the gamble. What do most people choose?',
    options:['The sure $1,000,000 (risk aversion)','The gamble (higher expected value)','They\'re indifferent (same utility)','Depends on current wealth'],
    correct:0,
    explanation:'This demonstrates risk aversion and the diminishing marginal utility of money. The certainty equivalent of most people for a 50/50 gamble between $0 and $3M is well below $1.5M. Daniel Kahneman and Amos Tversky formalized this in Prospect Theory.',
    hint:'Would losing $1M hurt more than gaining $1M helps?',
    difficulty:1
  },
  {
    id:'voting1', cat:'game_theory',
    scenario:'In an election, your single vote almost never changes the outcome. Voting has costs (time, effort). From a purely rational self-interest perspective, should you vote?',
    options:['The "paradox of voting" — rational self-interest says no, yet people vote','Yes — your vote always matters','No — and most people shouldn\'t','Only in close elections'],
    correct:0,
    explanation:'The Paradox of Voting (Downs Paradox): if voting is costly and one vote rarely decides an election, rational self-interest predicts zero turnout. Yet billions vote. This suggests motivations beyond narrow rationality: civic duty, expressive value, social norms.',
    hint:'If everyone reasoned this way, what would happen?',
    difficulty:2
  },
  // --- Knights & Knaves generators ---
  {
    id:'kk_gen', cat:'knights_knaves', generator: true, difficulty:2
  },
  {
    id:'kk_gen2', cat:'knights_knaves', generator: true, difficulty:3
  },
  // --- More probability puzzles ---
  {
    id:'sock1', cat:'probability',
    scenario:'A drawer has 10 black socks and 10 white socks. In complete darkness, what\'s the minimum number of socks you must pull out to guarantee a matching pair?',
    options:['3','2','4','11'],
    correct:0,
    explanation:'By the Pigeonhole Principle: with 2 colors, pulling 3 socks guarantees at least two share a color. The worst case is pulling one of each color first, then the third must match one.',
    hint:'Think about the worst case: you pull different colors each time.',
    difficulty:1
  },
  {
    id:'handshake1', cat:'logic',
    scenario:'At a party of 10 people, everyone shakes hands with a different number of people. How many handshakes did the host\'s spouse have?',
    options:['It\'s impossible — the host\'s spouse must have the same as the host','0 handshakes','9 handshakes','4 handshakes'],
    correct:3,
    explanation:'With 10 people, if everyone has a different number (0-9), the person with 9 handshakes shook everyone\'s hand — so the person with 0 is their spouse. The person with 8 shook everyone except the 0 person — so the person with 1 is their spouse. By pairing (9,0), (8,1), (7,2), (6,3), the host and spouse both have 4 (since they must share a count).',
    hint:'Pair up: who is the spouse of the person who shook 9 hands?',
    difficulty:3
  },
  {
    id:'100prisoners1', cat:'probability',
    scenario:'100 prisoners each must find their own number in 100 boxes (50 attempts each). They can\'t communicate after starting. What\'s the best strategy\'s success probability?',
    options:['About 31% using the loop strategy','Less than 1%','50%','100% with the right plan'],
    correct:0,
    explanation:'The 100 Prisoners Problem: each prisoner follows the chain starting from their own number. This succeeds unless there\'s a loop longer than 50. The probability of no long loop is approximately 1 - ln(2) ≈ 31%. Random guessing gives (1/2)^100 ≈ 0%.',
    hint:'If each prisoner follows a chain of box → number → next box, what could go wrong?',
    difficulty:3
  },
  {
    id:'ant1', cat:'logic',
    scenario:'100 ants on a 1-meter stick, each walking 1 cm/s in a random direction. When two ants meet, both reverse. How long until all ants have fallen off?',
    options:['Exactly 100 seconds','Depends on starting positions','200 seconds at most','50 seconds on average'],
    correct:0,
    explanation:'The key insight: when two ants collide and reverse, it\'s equivalent to them passing through each other. So each "ant" (really each trajectory) continues to an edge. The longest any trajectory takes is 100 cm ÷ 1 cm/s = 100 seconds.',
    hint:'What if ants could pass through each other? Would the outcome be different?',
    difficulty:3
  },
];

// Knights & Knaves generator
function generateKnightsKnaves(rng, difficulty) {
  const names = ['Alice','Bob','Carol','Dave','Eve','Frank'];
  const shuffled = rngShuffle(names).slice(0, difficulty >= 3 ? 3 : 2);
  const isKnight = shuffled.map(() => rng() > 0.5);

  if (shuffled.length === 2) {
    const [a, b] = shuffled;
    const [aK, bK] = isKnight;
    // A says "We are both knights" or "B is a knight" or "At least one of us is a knave" etc.
    const statements = [];
    let scenario, correct, explanation;
    if (aK) {
      // Knight A says truth
      if (bK) {
        scenario = `${a} says: "We are both knights." ${b} says: "That is true."`;
        correct = `${a} is a knight, ${b} is a knight`;
        explanation = `${a} (knight) tells truth: both are knights. ${b} (knight) confirms truthfully.`;
      } else {
        scenario = `${a} says: "${b} is a knave." ${b} says: "${a} is a knave."`;
        correct = `${a} is a knight, ${b} is a knave`;
        explanation = `${a} (knight) tells truth: ${b} is a knave. ${b} (knave) lies: calls ${a} a knave, but ${a} is actually a knight.`;
      }
    } else {
      if (bK) {
        scenario = `${a} says: "I am a knight." ${b} says: "${a} is a knave."`;
        correct = `${a} is a knave, ${b} is a knight`;
        explanation = `Knaves can say "I am a knight" (lying). ${b} (knight) tells truth that ${a} is a knave.`;
      } else {
        scenario = `${a} says: "We are both knaves." ${b} says: "${a} is a knight."`;
        correct = `Both are knaves`;
        explanation = `Wait — a knave can't truthfully say "we are both knaves." So ${a} must be a knight? But then the statement is false. Actually, ${a} can't say this consistently as either type. Let's reconsider: ${a} says "At least one of us is a knight." If ${a} is a knave, this is a lie, meaning neither is a knight — both knaves. Then ${b} (knave) says "${a} is a knight" — a lie. Consistent!`;
        scenario = `${a} says: "At least one of us is a knight." ${b} says: "${a} is a knight."`;
        correct = `${a} is a knave, ${b} is a knave`;
        explanation = `If ${a} is a knave, "${a}t least one is a knight" is a lie → both are knaves. ${b} (knave) lies by calling ${a} a knight. Consistent.`;
      }
    }

    const wrongOptions = [
      `${a} is a knight, ${b} is a knave`,
      `${a} is a knave, ${b} is a knight`,
      `Both are knights`,
      `Both are knaves`
    ].filter(o => o !== correct);

    const options = rngShuffle([correct, ...wrongOptions.slice(0, 3)]);
    return {
      id: 'kk_' + Date.now(),
      scenario: `On an island, knights always tell the truth and knaves always lie.\n\n${scenario}\n\nWhat are they?`,
      options,
      correct: options.indexOf(correct),
      explanation,
      hint: 'Assume each person is a knight and check for contradictions.',
      difficulty
    };
  }

  // 3-person variant (harder)
  const [a, b, c] = shuffled;
  const types = [rng()>0.5, rng()>0.5, rng()>0.5];
  const label = (k) => k ? 'knight' : 'knave';
  let scenario = `On an island, knights always tell truth and knaves always lie.\n\n`;
  scenario += `${a} says: "${b} is a ${types[1] ? 'knight' : 'knave'}."\n`;
  if (types[0]) {
    // A is knight, tells truth about B
  } else {
    // A is knave, lies about B — flip B's label in statement
    scenario = `On an island, knights always tell truth and knaves always lie.\n\n`;
    scenario += `${a} says: "${b} is a ${types[1] ? 'knave' : 'knight'}."\n`;
  }
  scenario += `${b} says: "${c} and I are ${types[1]===types[2] ? 'the same type' : 'different types'}."\n`;
  if (!types[1]) {
    scenario = scenario.replace(
      `${b} says: "${c} and I are ${types[1]===types[2] ? 'the same type' : 'different types'}."\n`,
      `${b} says: "${c} and I are ${types[1]===types[2] ? 'different types' : 'the same type'}."\n`
    );
  }
  scenario += `${c} says: "There are more knights than knaves here."`;
  if (!types[2]) {
    scenario = scenario.replace(
      `${c} says: "There are more knights than knaves here."`,
      `${c} says: "There are more knaves than knights here."`
    );
  }

  const knightCount = types.filter(Boolean).length;
  const correct = `${a}: ${label(types[0])}, ${b}: ${label(types[1])}, ${c}: ${label(types[2])}`;
  const wrongOpts = [];
  for (let i = 0; i < 8; i++) {
    const t = [!!(i&4), !!(i&2), !!(i&1)];
    const opt = `${a}: ${label(t[0])}, ${b}: ${label(t[1])}, ${c}: ${label(t[2])}`;
    if (opt !== correct) wrongOpts.push(opt);
  }
  const options = rngShuffle([correct, ...rngShuffle(wrongOpts).slice(0,3)]);

  return {
    id: 'kk3_' + Date.now(),
    scenario,
    options,
    correct: options.indexOf(correct),
    explanation: `${a} is a ${label(types[0])}, ${b} is a ${label(types[1])}, ${c} is a ${label(types[2])}. Verify each statement against their type.`,
    hint: 'Start with one assumption and check if all statements are consistent.',
    difficulty: 3
  };
}

function getParadoxPuzzle() {
  const diff = GS.difficulty;
  const diffLevel = {easy:1,medium:2,hard:3,extreme:3}[diff];
  // Filter by difficulty
  let pool = PARADOX_BANK.filter(p => {
    if (p.generator) return p.difficulty <= diffLevel;
    return p.difficulty <= diffLevel;
  });
  const chosen = rngPick(pool);
  if (chosen.generator) {
    return generateKnightsKnaves(GS.rng, diffLevel);
  }
  // Adjust options count by difficulty
  let puzzle = {...chosen};
  if (diff === 'easy' && puzzle.options.length > 3) {
    // Keep correct + 2 wrong
    const correctOpt = puzzle.options[puzzle.correct];
    const wrong = puzzle.options.filter((_,i) => i !== puzzle.correct);
    const kept = rngShuffle(wrong).slice(0,2);
    puzzle.options = rngShuffle([correctOpt, ...kept]);
    puzzle.correct = puzzle.options.indexOf(correctOpt);
  }
  if (diff === 'extreme' && puzzle.options.length < 5) {
    // Add a plausible distractor
    puzzle.options.push('The question itself is flawed');
    // correct index unchanged since we append
  }
  return puzzle;
}

function renderParadox(puzzle) {
  GS.challengeState.paradox = { puzzle, answered: false, selectedIdx: null };
  const c = document.getElementById('game-container');
  let html = `<div class="paradox-scenario">${puzzle.scenario.replace(/\n/g,'<br>')}</div>`;
  if (GS.difficulty === 'easy' && puzzle.hint) {
    html += `<div class="paradox-hint">💡 Hint: ${puzzle.hint}</div>`;
  }
  html += `<div class="options-list" id="paradox-options">`;
  puzzle.options.forEach((opt, i) => {
    html += `<button class="option-btn" onclick="selectParadoxOption(${i})" data-idx="${i}">${opt}</button>`;
  });
  html += `</div>`;
  html += `<div id="paradox-explanation" style="display:none"></div>`;
  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'none';
}

function selectParadoxOption(idx) {
  const state = GS.challengeState.paradox;
  if (state.answered) return;
  state.answered = true;
  state.selectedIdx = idx;
  const correct = state.puzzle.correct;
  const btns = document.querySelectorAll('#paradox-options .option-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    if (i === idx && i !== correct) btn.classList.add('incorrect');
  });
  // Score
  const score = (idx === correct) ? 100 : 0;
  GS.results.paradox = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('paradox', score);
    lsSet('daily-paradox-state-'+getDailyDateStr(), { selectedIdx: idx, correct: idx === correct, question: state.puzzle.question, options: state.puzzle.options, correctIdx: correct, explanation: state.puzzle.explanation });
  }
  // Show summary after a beat
  setTimeout(() => {
    if (!document.getElementById('game-container')) return;
    showChallengeSummary({
      emoji: idx === correct ? '✅' : '❌',
      score,
      title: idx === correct ? 'Correct!' : 'Incorrect',
      stats: [
        { label: 'Answer', value: state.puzzle.options[correct] }
      ],
      miniReview: `<div style="line-height:1.6">${state.puzzle.explanation}</div>`
    });
  }, 600);
}

