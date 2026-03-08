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
  // --- Additional Probability & Bayesian ---
  {
    id:'gambler1', cat:'probability',
    scenario:'A fair coin has landed heads 9 times in a row. What is the probability the next flip is heads?',
    options:['50% — each flip is independent','Less than 50% — tails is "due"','More than 50% — the coin is "hot"','It depends on the type of coin'],
    correct:0,
    explanation:'The Gambler\'s Fallacy: a fair coin has no memory. Each flip is independent with P(heads) = 0.5, regardless of previous outcomes. The belief that tails is "due" is a well-documented cognitive bias.',
    hint:'Does the coin remember what it did before?',
    difficulty:1
  },
  {
    id:'monty_variant1', cat:'probability',
    scenario:'Monty Hall variant: 100 doors, 1 car, 99 goats. You pick door 1. Monty opens 98 doors showing goats, leaving door 1 and door 57. Should you switch?',
    options:['Yes — switching gives 99/100 chance','No — it\'s now 50/50','It doesn\'t matter','Switching gives 98/100 chance'],
    correct:0,
    explanation:'This extreme version makes the Monty Hall logic clearer. Your initial pick had 1/100 chance. The other 99 doors collectively had 99/100. Monty revealing 98 goats concentrates that 99/100 onto the single remaining door.',
    hint:'Where does the 99/100 probability concentrate after 98 doors are opened?',
    difficulty:1
  },
  {
    id:'regression1', cat:'probability',
    scenario:'A sports team has a record-breaking season. Next season, they\'ll most likely:',
    options:['Perform closer to their historical average','Break the record again','Perform even better — momentum carries','Perform much worse due to pressure'],
    correct:0,
    explanation:'Regression to the mean: extreme performances are partly due to luck/random variation. Since that luck is unlikely to repeat, subsequent performance tends to move toward the average. This isn\'t about "choking" — it\'s pure statistics.',
    hint:'How much of an exceptional performance is skill vs. luck?',
    difficulty:1
  },
  {
    id:'prosecutor1', cat:'probability',
    scenario:'DNA evidence matches the defendant with a 1 in 1 million chance of a random match. The prosecutor argues there\'s therefore a 1 in 1 million chance the defendant is innocent. Is this correct?',
    options:['No — this confuses P(evidence|innocent) with P(innocent|evidence)','Yes — the math is straightforward','It depends on the jury\'s judgment','No — DNA evidence is unreliable'],
    correct:0,
    explanation:'The Prosecutor\'s Fallacy: P(match|innocent) \u2260 P(innocent|match). In a city of 5 million, about 5 people would match. Without other evidence, the defendant has roughly a 1 in 5 chance of being the source, not 999,999 in 1,000,000.',
    hint:'How many people in a large city would also match by chance?',
    difficulty:2
  },
  {
    id:'hot_hand1', cat:'probability',
    scenario:'A basketball player makes 5 shots in a row. Their teammates believe they have a "hot hand" and should keep shooting. Statistically, is the hot hand real?',
    options:['Recent research suggests it IS real but very small','No — each shot is completely independent','Yes — momentum is a proven force','It depends on the player\'s skill level'],
    correct:0,
    explanation:'The Hot Hand debate has evolved. Originally (Gilovich, 1985), it was called a fallacy. But Miller & Sanjurjo (2018) found a subtle statistical bias in the original study. Correcting for it reveals a small but real hot hand effect, though far smaller than people perceive.',
    hint:'The original "hot hand fallacy" paper had a subtle statistical error discovered decades later.',
    difficulty:2
  },
  {
    id:'exchange1', cat:'probability',
    scenario:'You and a friend each put money in your wallets. You compare: whoever has less money wins the other\'s wallet. You reason: "I might lose my $X but could gain more than $X." Your friend reasons identically. Can you BOTH have positive expected value?',
    options:['No — this is the Wallet Paradox; the symmetry means neither has an edge','Yes — both can have positive expected value','The person with less money has the advantage','It depends on the amounts'],
    correct:0,
    explanation:'The Wallet (or Necktie) Paradox: both players use identical reasoning to conclude they have an advantage, which is impossible in a zero-sum game. The error is conditioning on your own amount as fixed while treating the other\'s as random.',
    hint:'Can both players simultaneously have a positive expected value in a zero-sum game?',
    difficulty:2
  },
  {
    id:'inspection1', cat:'probability',
    scenario:'Buses arrive every 10 minutes on average. You arrive at a random time. What\'s your expected wait?',
    options:['More than 5 minutes — due to the inspection paradox','Exactly 5 minutes — half the average interval','Less than 5 minutes','Exactly 10 minutes'],
    correct:0,
    explanation:'The Inspection Paradox (or Bus Paradox): if bus intervals vary, you\'re more likely to arrive during a LONG interval. With exponential arrivals (Poisson process), the expected wait is the full 10 minutes! With any variance, the expected wait exceeds half the mean interval.',
    hint:'Are you equally likely to arrive during a short gap or a long gap between buses?',
    difficulty:2
  },
  {
    id:'bayes_disease2', cat:'probability',
    scenario:'A screening test with 99% sensitivity and 99% specificity is applied to a disease with prevalence 1 in 10,000. You test positive. What\'s the approximate probability you have the disease?',
    options:['About 1%','About 99%','About 50%','About 10%'],
    correct:0,
    explanation:'Even with 99% accuracy, Bayes\' theorem yields: P(disease|+) = (0.0001 \u00D7 0.99) / (0.0001 \u00D7 0.99 + 0.9999 \u00D7 0.01) \u2248 0.0099/0.0199 \u2248 0.98%. The extremely low base rate means almost all positives are false positives.',
    hint:'Out of 10,000 people tested, how many healthy people will falsely test positive?',
    difficulty:2
  },
  {
    id:'nontransitive1', cat:'probability',
    scenario:'Die A beats Die B more than half the time. Die B beats Die C more than half the time. Must Die A beat Die C more than half the time?',
    options:['No — non-transitive dice can create a "rock-paper-scissors" cycle','Yes — transitivity applies to all comparisons','Only if the dice are fair','Yes — the stronger die always wins'],
    correct:0,
    explanation:'Non-transitive dice violate our intuition that "better than" is transitive. Efron\'s dice demonstrate this: A>B, B>C, C>A, each winning about 2/3 of the time. Warren Buffett once tried to trick Bill Gates with these dice.',
    hint:'Think about rock-paper-scissors. Can a similar cycle exist with dice?',
    difficulty:2
  },
  {
    id:'waittime1', cat:'probability',
    scenario:'You flip a fair coin repeatedly. What is the expected number of flips to get two heads in a row?',
    options:['6','4','3','8'],
    correct:0,
    explanation:'Let E be the expected flips. If you flip tails (prob 1/2), you wasted 1 flip: E = 1 + E. If heads then tails (prob 1/4): E = 2 + E. If heads then heads (prob 1/4): done in 2. So E = (1/2)(1+E) + (1/4)(2+E) + (1/4)(2). Solving: E = 6.',
    hint:'Set up an equation for the expected value by considering what happens after your first flip.',
    difficulty:2
  },
  // --- Economic Paradoxes ---
  {
    id:'diamond_water1', cat:'ethics',
    scenario:'Water is essential for survival; diamonds are not. Yet diamonds cost far more than water. Why?',
    options:['Marginal utility — water is abundant so the next unit is worth less','Because diamonds are more beautiful','Because the diamond industry controls prices','Water should actually cost more'],
    correct:0,
    explanation:'The Diamond-Water Paradox (Adam Smith) is resolved by marginal utility theory. Total utility of water is enormous, but its marginal utility (value of one more unit) is low due to abundance. Diamonds are scarce, so marginal utility (and price) is high.',
    hint:'Price reflects the value of the NEXT unit, not the total value of the good.',
    difficulty:1
  },
  {
    id:'braess1', cat:'game_theory',
    scenario:'A city adds a new road to reduce congestion. Surprisingly, traffic gets worse for everyone. Is this possible?',
    options:['Yes — this is Braess\'s Paradox','No — more capacity always helps','Only if the road is poorly designed','Only during construction'],
    correct:0,
    explanation:'Braess\'s Paradox: adding capacity to a network can worsen performance when agents selfishly optimize. Drivers choosing the individually optimal route create a new Nash equilibrium where everyone is worse off. Real examples include Seoul and Stuttgart.',
    hint:'What happens when everyone tries to use the "best" new route?',
    difficulty:1
  },
  {
    id:'giffen1', cat:'ethics',
    scenario:'Usually, when a good\'s price rises, people buy less. Can a price increase ever cause people to buy MORE of that good?',
    options:['Yes — Giffen goods exhibit this behavior','No — the law of demand is absolute','Only for luxury goods','Only during hyperinflation'],
    correct:0,
    explanation:'A Giffen good is an inferior staple (e.g., bread for very poor households). When its price rises, the income effect (they\'re poorer, so they eat more of the cheap staple and less of expensive alternatives) dominates the substitution effect. Documented with rice in China (Jensen & Miller, 2008).',
    hint:'What happens to a very poor person\'s diet when the price of their staple food rises?',
    difficulty:2
  },
  {
    id:'jevons1', cat:'ethics',
    scenario:'A new technology makes coal usage 50% more efficient. A naive prediction says coal consumption will fall. What actually happened historically?',
    options:['Coal consumption increased — this is the Jevons Paradox','Coal consumption fell by roughly 50%','Coal consumption stayed the same','Coal was replaced by other fuels'],
    correct:0,
    explanation:'Jevons Paradox (1865): increased efficiency makes a resource effectively cheaper, which increases total demand. More efficient steam engines made coal-powered industry profitable in more applications, dramatically increasing total coal use. This applies today to energy and technology.',
    hint:'What happens to demand when something becomes cheaper to use?',
    difficulty:1
  },
  {
    id:'allais1', cat:'game_theory',
    scenario:'Choose: A) 100% chance of $1M, or B) 89% chance of $1M, 10% chance of $5M, 1% chance of $0. Then choose: C) 11% chance of $1M, or D) 10% chance of $5M. Most people pick A and D. Is this rational?',
    options:['No — choosing A and D violates expected utility theory','Yes — both choices maximize expected value','Yes — risk preferences can vary','A and D are the utility-maximizing choices'],
    correct:0,
    explanation:'The Allais Paradox: if you prefer A over B (certainty effect), consistency requires preferring C over D. But most people pick A and D, violating the independence axiom of expected utility theory. This helped inspire prospect theory.',
    hint:'Compare the difference between A and B with the difference between C and D.',
    difficulty:3
  },
  {
    id:'st_petersburg1', cat:'probability',
    scenario:'A game: flip a coin until tails. If tails on flip n, you win $2^n. The expected value is: $2 + $2 + $2 + ... = infinity. How much would you pay to play?',
    options:['Most people pay less than $20 despite infinite expected value','You should pay any amount — infinite EV','Most people pay around $1,000','The expected value is actually finite'],
    correct:0,
    explanation:'The St. Petersburg Paradox: the expected value is infinite (\u03A3 1/2^n \u00D7 2^n = \u03A3 1 = \u221E), yet people won\'t pay much. This motivated Daniel Bernoulli (1738) to propose utility theory — the utility of money is logarithmic, making the expected utility finite.',
    hint:'Would you really risk $10,000 for a game that usually pays $2 or $4?',
    difficulty:3
  },
  // --- Philosophical Paradoxes ---
  {
    id:'theseus_axe1', cat:'logic',
    scenario:'George Washington\'s axe: the handle has been replaced 3 times and the head twice. Is it still Washington\'s axe?',
    options:['This is the same paradox as the Ship of Theseus — identity is ambiguous','Yes — the history makes it authentic','No — none of the original material remains','Only if documented replacements were authorized'],
    correct:0,
    explanation:'This is a folksy version of the Ship of Theseus paradox. If every component is replaced, continuity of form and narrative persist, but material continuity is lost. There\'s no objectively correct answer — it depends on one\'s theory of identity.',
    hint:'Is identity about material or about continuity of story?',
    difficulty:1
  },
  {
    id:'teleport1', cat:'logic',
    scenario:'A teleporter scans your body, destroys the original, and creates a perfect copy at the destination. Is the copy "you"?',
    options:['This is an open philosophical question with no consensus','Yes — same pattern means same person','No — the original was killed','Only if consciousness transfers'],
    correct:0,
    explanation:'The Teleporter Paradox challenges personal identity. Physicalists might say yes (same pattern = same person). Others argue the original\'s continuity of consciousness is broken. A variant: what if the original isn\'t destroyed? Are there now two "yous"?',
    hint:'What if the machine malfunctioned and didn\'t destroy the original?',
    difficulty:1
  },
  {
    id:'mary_room1', cat:'logic',
    scenario:'Mary is a scientist who knows everything physical about color but has lived in a black-and-white room her whole life. When she sees red for the first time, does she learn something new?',
    options:['This is debated — it challenges whether physical facts capture all knowledge','No — she already knew everything about color','Yes — proving physicalism is false','She can\'t learn anything new'],
    correct:0,
    explanation:'Mary\'s Room (Frank Jackson, 1982) challenges physicalism. If Mary learns something new (what red "looks like"), then physical facts don\'t exhaust all knowledge, suggesting qualia exist beyond physics. Physicalists respond that she gains a new ability (recognition), not new knowledge.',
    hint:'Is knowing the wavelength of red the same as experiencing red?',
    difficulty:2
  },
  {
    id:'chinese_room1', cat:'logic',
    scenario:'A person in a room follows English rules to manipulate Chinese symbols, producing correct Chinese responses. They don\'t understand Chinese. Does the system "understand" Chinese?',
    options:['This is Searle\'s argument — it\'s hotly debated whether syntax can produce understanding','Yes — the system as a whole understands','No — understanding requires consciousness','Yes — the rules constitute understanding'],
    correct:0,
    explanation:'The Chinese Room (John Searle, 1980) argues that symbol manipulation (syntax) cannot produce understanding (semantics). Critics respond with the "systems reply" (the room as a whole understands) or "robot reply" (embodiment might be needed). The debate remains central to AI philosophy.',
    hint:'Can following rules you don\'t understand ever constitute understanding?',
    difficulty:2
  },
  {
    id:'experience_machine1', cat:'ethics',
    scenario:'You can permanently plug into a machine that gives you any experiences you desire — indistinguishable from reality. Do you plug in?',
    options:['Most people refuse — suggesting we value more than just experience','Yes — maximizing pleasure is rational','No — because the machine might malfunction','It depends on the quality of simulation'],
    correct:0,
    explanation:'Nozick\'s Experience Machine (1974) challenges hedonism (the view that pleasure is the only good). Most people refuse, suggesting they value authenticity, actual accomplishment, and contact with reality — not just the experience of these things.',
    hint:'If experiences were ALL that mattered, why would anyone refuse?',
    difficulty:1
  },
  // --- Set Theory & Infinity ---
  {
    id:'hilbert1', cat:'logic',
    scenario:'Hilbert\'s Hotel has infinitely many rooms, all occupied. A new guest arrives. Can they be accommodated?',
    options:['Yes — move each guest from room n to room n+1','No — all rooms are occupied','Only if someone leaves','Only if the hotel expands'],
    correct:0,
    explanation:'Hilbert\'s Hotel shows that infinity behaves counterintuitively. Moving each guest from room n to room n+1 frees room 1. You can even accommodate infinitely many new guests (move guest n to room 2n, freeing all odd rooms). This illustrates that \u221E + 1 = \u221E.',
    hint:'In a hotel with rooms numbered 1, 2, 3, ..., can every guest shift one room over?',
    difficulty:1
  },
  {
    id:'cantor1', cat:'logic',
    scenario:'Are there more integers or more real numbers between 0 and 1?',
    options:['More real numbers — by Cantor\'s diagonal argument, it\'s a larger infinity','The same — both are infinite','More integers — they go on forever','They can\'t be compared — infinity is infinity'],
    correct:0,
    explanation:'Cantor\'s diagonal argument (1891) proves the reals are uncountably infinite, while integers are countably infinite. Any attempted list of reals between 0 and 1 can be defeated by constructing a number differing in the nth digit from the nth entry. So |\u211D| > |\u2124|.',
    hint:'Try to list ALL decimals between 0 and 1. Can you always find one you missed?',
    difficulty:2
  },
  {
    id:'banach_tarski1', cat:'logic',
    scenario:'Can a solid ball be decomposed into a finite number of pieces and reassembled into TWO identical copies of the original ball?',
    options:['Yes — the Banach-Tarski paradox proves this using the axiom of choice','No — matter cannot be created','Only in theory, never in practice','Only if the pieces can stretch'],
    correct:0,
    explanation:'The Banach-Tarski Paradox (1924): using the axiom of choice, a ball can be split into 5 pieces that reassemble into 2 balls of the original size. The "pieces" are non-measurable sets that can\'t exist physically. This challenges our intuition about volume and the axiom of choice.',
    hint:'The pieces are so bizarre they can\'t even be assigned a volume.',
    difficulty:3
  },
  {
    id:'russells_set1', cat:'logic',
    scenario:'Consider the set of all sets that do not contain themselves. Does this set contain itself?',
    options:['Neither answer is consistent — this is Russell\'s Paradox','Yes — it belongs in its own collection','No — sets don\'t contain themselves','The set doesn\'t exist'],
    correct:0,
    explanation:'Russell\'s Paradox (1901): if the set contains itself, it shouldn\'t (by definition). If it doesn\'t contain itself, it should. This paradox destroyed naive set theory and led to axiomatic set theories (ZFC) that restrict which collections qualify as sets.',
    hint:'Try assuming it contains itself, then try assuming it doesn\'t.',
    difficulty:1
  },
  {
    id:'galileo1', cat:'logic',
    scenario:'There seem to be fewer perfect squares (1, 4, 9, 16, ...) than natural numbers (1, 2, 3, 4, ...). But each natural number n maps to exactly one square n\u00B2. Are there the same number?',
    options:['Yes — both sets are countably infinite and can be paired one-to-one','No — squares are a proper subset so there are fewer','It depends on how you count','Neither — infinity can\'t be compared'],
    correct:0,
    explanation:'Galileo\'s Paradox (1638): a proper subset of an infinite set can be the same "size" (cardinality). The bijection n \u2192 n\u00B2 shows |{naturals}| = |{perfect squares}|. This is actually the DEFINITION of infinite sets: a set is infinite if it\'s equinumerous with a proper subset.',
    hint:'Can you pair each natural number with exactly one perfect square, and vice versa?',
    difficulty:2
  },
  // --- Voting & Social Choice ---
  {
    id:'condorcet1', cat:'game_theory',
    scenario:'In an election: 1/3 of voters prefer A>B>C, 1/3 prefer B>C>A, 1/3 prefer C>A>B. Is there a Condorcet winner (beats every other candidate head-to-head)?',
    options:['No — this creates a cycle: A beats B, B beats C, C beats A','Yes — A wins overall','Yes — it\'s a three-way tie','Yes — use instant runoff to determine the winner'],
    correct:0,
    explanation:'The Condorcet Paradox: with these preferences, A beats B (2/3), B beats C (2/3), and C beats A (2/3) in pairwise comparisons. Group preferences are cyclic even though individual preferences are transitive. This shows majority rule can be inconsistent.',
    hint:'Check each pair of candidates: who would win A vs B? B vs C? C vs A?',
    difficulty:2
  },
  {
    id:'arrow1', cat:'game_theory',
    scenario:'Arrow\'s Impossibility Theorem says that no ranked voting system with 3+ candidates can simultaneously satisfy all of which set of "fair" properties?',
    options:['Unanimity, independence of irrelevant alternatives, and non-dictatorship','Majority rule and proportionality','Anonymity and neutrality','Monotonicity and participation'],
    correct:0,
    explanation:'Arrow\'s Theorem (1951): no ranked-choice voting system for 3+ candidates can satisfy all three: (1) if everyone prefers A to B, society does too (unanimity), (2) the A-vs-B ranking depends only on individual A-vs-B preferences (IIA), and (3) no single voter is a dictator.',
    hint:'The three properties involve unanimity, irrelevant alternatives, and non-dictatorship.',
    difficulty:3
  },
  {
    id:'approval1', cat:'game_theory',
    scenario:'In a plurality election (most votes wins), there are 3 candidates. You prefer A > B > C. Polls show B and C are leading. Should you vote for A (your true preference)?',
    options:['Voting for B might be strategically better — this is the spoiler effect','Always vote for your true preference','Vote for C to shake things up','Don\'t vote — your vote doesn\'t matter'],
    correct:0,
    explanation:'Strategic voting and the spoiler effect: in plurality systems, voting for a third-place candidate you love can help elect the candidate you hate most by splitting the vote. This is why Duverger\'s Law predicts two-party dominance under plurality voting.',
    hint:'If A has no chance of winning, is voting for A actually helping or hurting your interests?',
    difficulty:1
  },
  // --- Cognitive Biases & Statistical Fallacies ---
  {
    id:'survivorship1', cat:'probability',
    scenario:'Someone studies only successful companies to find what made them succeed. What bias is this?',
    options:['Survivorship bias — failed companies with the same traits are ignored','Confirmation bias','Selection bias','Availability bias'],
    correct:0,
    explanation:'Survivorship Bias: analyzing only winners systematically excludes evidence from failures. Many failed companies also had the "success traits" found in survivors. Famously illustrated by Abraham Wald\'s WWII analysis: armor the spots where returning planes WEREN\'T hit (the hit planes didn\'t return).',
    hint:'What about companies that had the same traits but still failed?',
    difficulty:1
  },
  {
    id:'linda1', cat:'probability',
    scenario:'Linda is 31, single, outspoken, and a philosophy major who cares about social justice. Which is more probable? A) Linda is a bank teller. B) Linda is a bank teller AND active in the feminist movement.',
    options:['A — the conjunction of two events can\'t be more probable than either alone','B — the description fits a feminist bank teller better','They\'re equally likely','Neither — we need more information'],
    correct:0,
    explanation:'The Conjunction Fallacy (Tversky & Kahneman, 1983): P(A and B) \u2264 P(A), always. "Bank teller AND feminist" is a subset of "bank teller." Yet ~85% of respondents choose B because the description is representative of a feminist. Representativeness overrides logic.',
    hint:'Can "bank teller AND X" ever be more likely than "bank teller" alone?',
    difficulty:1
  },
  {
    id:'anchoring1', cat:'probability',
    scenario:'Group A is asked: "Is the Mississippi River longer or shorter than 500 miles?" then asked to estimate its length. Group B gets the same question but with 5,000 miles. Which group gives higher estimates?',
    options:['Group B — the higher anchor pulls estimates upward','Group A — they overcompensate','Both groups give similar estimates','It depends on geography knowledge'],
    correct:0,
    explanation:'Anchoring Bias (Tversky & Kahneman, 1974): arbitrary numbers influence subsequent judgments. Even clearly irrelevant anchors (like spinning a roulette wheel) affect estimates of unrelated quantities. The actual length is ~2,340 miles, but Group B\'s estimates will be systematically higher.',
    hint:'Does hearing a large number before estimating make you think bigger?',
    difficulty:1
  },
  {
    id:'base_rate_neglect1', cat:'probability',
    scenario:'A cab company has 85% green cabs and 15% blue cabs. A cab was in an accident. No witness, no other info. What color was the cab most likely?',
    options:['Green — with 85% prior probability','Blue — blue drivers are more reckless','Equally likely without a witness','Cannot be determined'],
    correct:0,
    explanation:'When no diagnostic evidence is available, the rational estimate is the base rate: 85% green. People often ignore base rates when given vivid but non-diagnostic information. Without ANY evidence, the prior probability IS the best estimate.',
    hint:'With no other information, what\'s your best guess based on proportions alone?',
    difficulty:1
  },
  // --- Decision Theory ---
  {
    id:'ellsberg1', cat:'probability',
    scenario:'Urn 1: 50 red and 50 black balls. Urn 2: 100 balls, red and black in unknown proportions. You win $100 for drawing red. Which urn do you choose?',
    options:['Most people choose Urn 1 — demonstrating ambiguity aversion','Urn 2 — unknown proportions could be favorable','Both are identical in expected value','Urn 2 — more potential upside'],
    correct:0,
    explanation:'The Ellsberg Paradox (1961): both urns have 50% expected probability of red if you have no information about Urn 2. Yet most people prefer Urn 1 (known risk over unknown risk). This "ambiguity aversion" violates expected utility theory and Savage\'s axioms.',
    hint:'What\'s your best estimate for the proportion of red in Urn 2 with no information?',
    difficulty:2
  },
  {
    id:'sunk_cost1', cat:'ethics',
    scenario:'You\'ve spent $100 on a non-refundable concert ticket. On the night of the concert, you feel sick and would prefer to stay home. What should you do?',
    options:['Stay home — the $100 is a sunk cost and irrelevant to the decision','Go — you already paid $100','Go — otherwise the money is wasted','It depends on how much $100 means to you'],
    correct:0,
    explanation:'The Sunk Cost Fallacy: the $100 is spent regardless of whether you go. The rational decision compares only future outcomes: the concert experience while sick vs. resting at home. Past expenditures should not influence future decisions, yet they routinely do.',
    hint:'Is the $100 coming back whether you go or stay?',
    difficulty:1
  },
  {
    id:'toxin1', cat:'game_theory',
    scenario:'A billionaire offers you $1M if at midnight tonight you INTEND to drink a mildly toxic (but not dangerous) drink tomorrow. You get the $1M for the intention alone — you don\'t actually have to drink it. Can you genuinely intend to drink it?',
    options:['This is paradoxical — knowing you don\'t have to drink it undermines the intention','Yes — just intend it, then don\'t drink','Yes — $1M motivates genuine intention','No — intentions must be about future actions you\'ll perform'],
    correct:0,
    explanation:'Kavka\'s Toxin Puzzle (1983): since you get the $1M for the intention (at midnight) and can then freely choose not to drink (tomorrow), you know you won\'t drink it. But knowing you won\'t drink it means you can\'t genuinely intend to. Rational intentions seem to require expected follow-through.',
    hint:'If you know you\'ll change your mind later, can you truly intend something now?',
    difficulty:3
  },
  {
    id:'buridan1', cat:'logic',
    scenario:'A perfectly rational donkey is placed exactly between two identical, equidistant bales of hay. It has no reason to prefer one over the other. What happens?',
    options:['Buridan\'s Paradox: pure rationality provides no basis for choosing, yet choosing is rational','It picks the left bale','It picks randomly','It alternates looking at both'],
    correct:0,
    explanation:'Buridan\'s Ass: a perfectly rational agent with no reason to prefer one option over another appears to be unable to choose, leading to starvation. This paradox challenges deterministic rationality and suggests that sometimes arbitrary choice is more rational than analysis paralysis.',
    hint:'Can a perfectly logical being choose between two identical options?',
    difficulty:1
  },
  // --- Quantum / Physics Concepts ---
  {
    id:'schrodinger1', cat:'logic',
    scenario:'Schr\u00F6dinger\'s cat is in a box with a quantum device that has a 50% chance of releasing poison. Before you open the box, is the cat alive or dead?',
    options:['In quantum mechanics, the cat is in a superposition of both states until observed','The cat is either alive or dead — we just don\'t know','The cat is alive until the poison is released','The question is meaningless — cats aren\'t quantum objects'],
    correct:0,
    explanation:'Schr\u00F6dinger\'s Cat (1935) was designed to show the absurdity of applying quantum superposition to macroscopic objects. In quantum mechanics, the cat is both alive AND dead until measurement collapses the wave function. The paradox highlights the measurement problem.',
    hint:'Quantum mechanics says particles are in superposition until observed. What about cats?',
    difficulty:1
  },
  {
    id:'epr1', cat:'logic',
    scenario:'Two entangled particles are separated by light-years. Measuring one instantly affects the other\'s state. Does this allow faster-than-light communication?',
    options:['No — no usable information can be transmitted (no-communication theorem)','Yes — the effect is instantaneous','Only with enough entangled particles','Only in theory, not in practice'],
    correct:0,
    explanation:'The EPR Paradox (Einstein, Podolsky, Rosen, 1935): while measurement of one entangled particle instantly determines the other\'s state, you can\'t control WHICH outcome you get. Without a classical channel to compare results, no information is transmitted.',
    hint:'Can you control the outcome of your measurement to encode a message?',
    difficulty:2
  },
  {
    id:'quantum_zeno1', cat:'logic',
    scenario:'In quantum mechanics, frequently observing an unstable particle can prevent it from decaying. This means:',
    options:['Observation can freeze quantum evolution — the Quantum Zeno Effect','Observation has no effect on quantum systems','The particle decays faster when observed','This only works in thought experiments'],
    correct:0,
    explanation:'The Quantum Zeno Effect: repeated measurement can "freeze" a quantum system in its initial state. Each measurement collapses the wave function back to the initial state before it can evolve significantly. This has been experimentally confirmed with trapped ions.',
    hint:'What happens if you keep collapsing the wave function back to the initial state?',
    difficulty:3
  },
  {
    id:'fermi1', cat:'logic',
    scenario:'There are billions of stars in our galaxy, many with habitable planets, and the universe is billions of years old. Yet we see no evidence of alien civilizations. This is:',
    options:['The Fermi Paradox — "Where is everybody?"','Not a paradox — aliens probably don\'t exist','Easily explained by the vastness of space','Evidence that we are the first civilization'],
    correct:0,
    explanation:'The Fermi Paradox: given the age and size of the universe, we should expect many advanced civilizations, yet we see no evidence. Proposed solutions include the Great Filter, the Zoo Hypothesis, or that interstellar travel is simply too hard.',
    hint:'If even a fraction of stars have habitable planets, where are the aliens?',
    difficulty:1
  },
  // --- Mathematical Puzzles ---
  {
    id:'missing_dollar1', cat:'logic',
    scenario:'Three friends pay $30 for a hotel room ($10 each). The clerk realizes it should be $25 and gives $5 to the bellboy. The bellboy keeps $2 and returns $1 to each friend. Each friend paid $9 (total $27), plus $2 the bellboy kept = $29. Where\'s the missing dollar?',
    options:['There is no missing dollar — the $27 already includes the bellboy\'s $2','The hotel has it','The bellboy has it','Math error in the problem'],
    correct:0,
    explanation:'The "missing dollar" is a misdirection. The friends paid $27 total: $25 went to the hotel, $2 to the bellboy. Adding the bellboy\'s $2 to the $27 is double-counting — the $2 is already INSIDE the $27. The correct accounting: $27 paid = $25 hotel + $2 bellboy. Plus $3 returned = $30 original.',
    hint:'Is the bellboy\'s $2 in addition to the $27, or part of it?',
    difficulty:1
  },
  {
    id:'birthday_higher1', cat:'probability',
    scenario:'How many people do you need in a room to have a greater than 99% chance that at least two share a birthday?',
    options:['57','100','183','365'],
    correct:0,
    explanation:'Following the birthday problem formula: with 57 people, the probability of at least one shared birthday exceeds 99%. This is surprisingly low because of the number of possible pairs: C(57,2) = 1,596 pairs, each with a 1/365 chance of matching.',
    hint:'It\'s far fewer than half of 365.',
    difficulty:2
  },
  {
    id:'monkeys1', cat:'probability',
    scenario:'A monkey typing randomly on a keyboard will eventually type the complete works of Shakespeare, given infinite time. Is this true?',
    options:['Yes — the infinite monkey theorem is mathematically proven','No — the probability is too low even with infinite time','Only for short works','It depends on the keyboard layout'],
    correct:0,
    explanation:'The Infinite Monkey Theorem: with infinite time, any finite sequence (including Shakespeare\'s works) will be typed with probability 1. Each attempt has a tiny but non-zero probability. Over infinite trials, the probability of NEVER succeeding approaches zero.',
    hint:'If something has a non-zero probability, what happens over infinite trials?',
    difficulty:2
  },
  // --- More Game Theory ---
  {
    id:'dollar_auction1', cat:'game_theory',
    scenario:'An auctioneer auctions a $1 bill. Highest bidder gets the dollar, but the SECOND-highest bidder also pays their bid and gets nothing. Both start bidding at $0.05. What typically happens?',
    options:['Bidding escalates well past $1 — both players try to avoid being second','Bidding stops at $1.00','Bidding stops at $0.50','Nobody bids — it\'s obviously a trap'],
    correct:0,
    explanation:'The Dollar Auction (Shubik, 1971): once two players are invested, each bid is justified by "I\'d rather pay $X and win $1 than pay $(X-0.05) and win nothing." This escalation of commitment has no rational stopping point. It models real-world phenomena like arms races.',
    hint:'If you\'ve bid $0.90 and someone bids $0.95, should you bid $1.00? What about $1.05?',
    difficulty:2
  },
  {
    id:'tragedy_commons1', cat:'game_theory',
    scenario:'10 farmers share a common pasture. Each can add one more cow (gaining $100) but overgrazing costs everyone $20. Individual rational choice?',
    options:['Add the cow — $100 gain vs $20 personal cost, but this collectively destroys the commons','Don\'t add — preserve the common resource','Add only if fewer than 5 farmers add','Randomly decide'],
    correct:0,
    explanation:'The Tragedy of the Commons (Hardin, 1968): each farmer gains $100 but bears only 1/10 of the $200 total overgrazing cost ($20). Individually rational to add a cow, but if all do, everyone loses.',
    hint:'Each farmer gains $100 but only suffers $20 in damage. What does everyone do?',
    difficulty:2
  },
  {
    id:'backward_induction1', cat:'game_theory',
    scenario:'A centipede game: two players alternate. Each can "take" $X or "pass." The pot grows each round. By backward induction, the rational first move is to take immediately. But real players usually pass. Why?',
    options:['Backward induction assumes common knowledge of rationality, which humans doubt','Players are irrational','Players don\'t understand the game','Taking is always best'],
    correct:0,
    explanation:'The Centipede Paradox: backward induction says player 1 should take immediately. But this assumes perfect rationality AND that each player trusts the other is rational. Real players pass because the assumption fails in practice.',
    hint:'Backward induction requires that everyone knows everyone is perfectly rational.',
    difficulty:3
  },
  // --- Information Theory ---
  {
    id:'ravens1', cat:'logic',
    scenario:'"All ravens are black" is logically equivalent to "All non-black things are non-ravens." So observing a red apple (non-black, non-raven) confirms that all ravens are black. Is this valid?',
    options:['Technically yes, but the confirmation is negligibly small — this is Hempel\'s Paradox','No — apples and ravens are unrelated','Yes — and the confirmation is significant','Only if you\'ve also observed ravens'],
    correct:0,
    explanation:'Hempel\'s Raven Paradox (1945): by logical equivalence, a red apple DOES confirm "all ravens are black" — but infinitesimally. The confirmation is proportional to 1/(number of non-black objects), which is essentially zero.',
    hint:'The logical equivalence is valid, but how much evidence does a single apple provide?',
    difficulty:3
  },
  {
    id:'surprise_test1', cat:'logic',
    scenario:'A teacher says "there will be a surprise quiz one day this week." Students use backward induction to prove it\'s impossible. On Wednesday, the quiz arrives — and they\'re surprised. What went wrong?',
    options:['The students\' reasoning was self-defeating — by "proving" no surprise, they guaranteed surprise','The teacher cheated','The logic was correct but the teacher ignored it','Backward induction doesn\'t apply to quizzes'],
    correct:0,
    explanation:'This is a variant of the Unexpected Hanging Paradox. The students\' backward induction eliminates each day. But their conclusion ("no quiz possible") is itself what makes the quiz surprising. The reasoning is self-undermining.',
    hint:'If you\'re 100% sure there won\'t be a quiz, can the quiz still surprise you?',
    difficulty:2
  },
  {
    id:'two_child_tuesday1', cat:'probability',
    scenario:'A man says: "I have two children. One is a boy born on a Tuesday." What is the probability both children are boys?',
    options:['13/27','1/3','1/2','1/4'],
    correct:0,
    explanation:'The Tuesday Boy Problem: adding "born on Tuesday" changes the answer from 1/3 to 13/27 \u2248 48%. There are 27 equally likely gender-day combinations with at least one Tuesday-boy. Of those, 13 have two boys.',
    hint:'The day of the week matters because it changes how many cases you count.',
    difficulty:3
  },
  {
    id:'three_prisoner1', cat:'probability',
    scenario:'Three prisoners: A, B, C. One will be pardoned (randomly). A asks the guard to name a prisoner (other than A) who will be executed. The guard says B will be executed. Should A feel better about being pardoned?',
    options:['No — A still has a 1/3 chance; C now has 2/3','Yes — it\'s now 1/2 between A and C','Yes — knowing B is out helps A','It depends on the guard\'s strategy'],
    correct:0,
    explanation:'The Three Prisoners Problem (equivalent to Monty Hall): A had 1/3, B had 1/3, C had 1/3. After hearing "B," A still has 1/3, but C now has 2/3. The information doesn\'t help A — it helps C.',
    hint:'This is structurally identical to the Monty Hall Problem.',
    difficulty:2
  },
  {
    id:'power_paradox1', cat:'game_theory',
    scenario:'In a weighted voting system: Player A has 50 votes, B has 49, C has 1. Majority needed is 51. How much power does C really have?',
    options:['Equal to B — both C and B are needed equally to form a majority with A','Very little — C has only 1 vote','None — C can never make a difference','Proportional to votes: 1/100'],
    correct:0,
    explanation:'The Paradox of Power in voting: despite having vastly different vote counts, B (49 votes) and C (1 vote) have IDENTICAL power. Neither can pass anything alone; both need A. By the Banzhaf power index, A has 3/5 power, B and C each have 1/5.',
    hint:'In which winning coalitions is B critical? In which is C critical?',
    difficulty:3
  },
  {
    id:'simpson_vote1', cat:'probability',
    scenario:'Candidate X wins the popular vote in every district, yet Candidate Y wins the overall popular vote. Is this possible?',
    options:['Yes — this is a form of Simpson\'s Paradox applied to elections','No — winning every district guarantees the overall win','Only with two districts','Only with gerrymandering'],
    correct:0,
    explanation:'Simpson\'s Paradox in elections: if Y wins by huge margins in a few large districts while X wins by small margins in many small districts, Y can have more total votes while X wins more districts.',
    hint:'What if Y wins some districts by massive margins while X barely wins others?',
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
  const diffLevel = {easy:1,medium:2,hard:3,extreme:3,impossible:3}[diff];
  // Filter by difficulty
  let pool = PARADOX_BANK.filter(p => {
    if (p.generator) return p.difficulty <= diffLevel;
    return p.difficulty <= diffLevel;
  });
  const chosen = rngPickUnseen(pool, 'paradox', 'id');
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
  if ((diff === 'extreme' || diff === 'impossible') && puzzle.options.length < 5) {
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

