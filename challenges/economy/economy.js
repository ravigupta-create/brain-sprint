// ==================== CHALLENGE 2: TINY ECONOMY ====================
const ECONOMY_BANK = [
  {
    id:'farm1', name:'Small Farm Optimization',
    scenario:'You manage a small farm with limited water and land. Allocate resources to maximize crop yield.',
    variables:[
      {name:'Water Allocation', key:'water', min:0, max:100, unit:'%', default:50},
      {name:'Fertilizer Amount', key:'fert', min:0, max:100, unit:'kg', default:50},
      {name:'Planting Density', key:'density', min:10, max:100, unit:'%', default:50},
      {name:'Harvest Timing', key:'timing', min:1, max:10, unit:'weeks', default:5}
    ],
    output: (v) => {
      const water = Math.min(v.water, 80) * 1.2 - Math.max(0, v.water - 80) * 2;
      const fert = v.fert * 0.8 - (v.fert * v.fert) / 300;
      const dens = v.density * 0.7 - (v.density * v.density) / 250;
      const time = -(v.timing - 6) * (v.timing - 6) + 36;
      return Math.round(water + fert + dens + time);
    },
    optimal: {water:80, fert:120, density:88, timing:6},
    constraints:[
      {desc:'Water + Fertilizer ≤ 150', check: (v) => v.water + v.fert <= 150}
    ],
    maxOutput: 200
  },
  {
    id:'factory1', name:'Widget Factory',
    scenario:'Optimize your widget factory by balancing worker count, machine speed, and quality control.',
    variables:[
      {name:'Workers', key:'workers', min:1, max:50, unit:'', default:25},
      {name:'Machine Speed', key:'speed', min:1, max:100, unit:'%', default:50},
      {name:'Quality Control', key:'qc', min:0, max:100, unit:'%', default:50},
      {name:'Shift Length', key:'shift', min:4, max:12, unit:'hrs', default:8}
    ],
    output: (v) => {
      const base = v.workers * v.speed * 0.02;
      const quality = 1 - (100 - v.qc) * 0.005;
      const fatigue = v.shift > 8 ? 1 - (v.shift - 8) * 0.08 : 1;
      const overhead = v.workers > 30 ? 0.9 : 1;
      return Math.round(base * quality * fatigue * overhead);
    },
    constraints:[
      {desc:'Workers × Shift ≤ 300 (labor budget)', check: (v) => v.workers * v.shift <= 300}
    ],
    maxOutput: 100
  },
  {
    id:'city1', name:'City Budget Allocation',
    scenario:'Allocate your city\'s budget across departments to maximize citizen happiness.',
    variables:[
      {name:'Education', key:'edu', min:0, max:100, unit:'%', default:25},
      {name:'Healthcare', key:'health', min:0, max:100, unit:'%', default:25},
      {name:'Infrastructure', key:'infra', min:0, max:100, unit:'%', default:25},
      {name:'Public Safety', key:'safety', min:0, max:100, unit:'%', default:25}
    ],
    output: (v) => {
      const total = v.edu + v.health + v.infra + v.safety;
      if (total === 0) return 0;
      const balance = 1 - Math.abs(v.edu-v.health)/(total) * 0.3 - Math.abs(v.infra-v.safety)/(total) * 0.2;
      const eduScore = Math.sqrt(v.edu) * 3;
      const healthScore = Math.sqrt(v.health) * 3.5;
      const infraScore = Math.sqrt(v.infra) * 2.5;
      const safetyScore = Math.sqrt(v.safety) * 2;
      return Math.round((eduScore + healthScore + infraScore + safetyScore) * balance);
    },
    constraints:[
      {desc:'Total budget ≤ 100%', check: (v) => v.edu + v.health + v.infra + v.safety <= 100}
    ],
    maxOutput: 100
  },
  {
    id:'cafe1', name:'Coffee Shop Pricing',
    scenario:'Set prices and quantities to maximize daily profit at your coffee shop.',
    variables:[
      {name:'Coffee Price', key:'price', min:1, max:10, unit:'$', default:4},
      {name:'Cups to Brew', key:'cups', min:10, max:200, unit:'', default:80},
      {name:'Marketing Spend', key:'marketing', min:0, max:50, unit:'$', default:20},
      {name:'Quality Grade', key:'quality', min:1, max:10, unit:'', default:5}
    ],
    output: (v) => {
      const demand = 120 - v.price * 12 + v.marketing * 1.5 + v.quality * 8;
      const sold = Math.min(v.cups, Math.max(0, demand));
      const revenue = sold * v.price;
      const cost = v.cups * 1.5 + v.marketing + v.quality * 3;
      return Math.round(revenue - cost);
    },
    constraints:[
      {desc:'Price ≤ $8 (market cap)', check: (v) => v.price <= 8}
    ],
    maxOutput: 200
  },
  {
    id:'energy1', name:'Energy Grid Mix',
    scenario:'Balance your city\'s energy sources to minimize cost while meeting demand and emission targets.',
    variables:[
      {name:'Solar', key:'solar', min:0, max:100, unit:'MW', default:30},
      {name:'Wind', key:'wind', min:0, max:100, unit:'MW', default:30},
      {name:'Natural Gas', key:'gas', min:0, max:100, unit:'MW', default:30},
      {name:'Nuclear', key:'nuclear', min:0, max:50, unit:'MW', default:10}
    ],
    output: (v) => {
      const total = v.solar + v.wind + v.gas + v.nuclear;
      const demand = 100;
      const surplus = Math.max(0, total - demand);
      const deficit = Math.max(0, demand - total);
      const cost = v.solar * 0.5 + v.wind * 0.4 + v.gas * 0.8 + v.nuclear * 0.3;
      const emissions = v.gas * 2;
      const score = 100 - cost * 0.3 - emissions * 0.5 - deficit * 3 - surplus * 0.5;
      return Math.round(Math.max(0, score));
    },
    constraints:[
      {desc:'Total power ≥ 100 MW (meet demand)', check: (v) => v.solar + v.wind + v.gas + v.nuclear >= 100},
      {desc:'Gas emissions ≤ 80 (limit)', check: (v) => v.gas * 2 <= 80}
    ],
    maxOutput: 80
  },
  {
    id:'game_dev1', name:'Game Development Studio',
    scenario:'Allocate your team\'s effort to ship the best game possible before the deadline.',
    variables:[
      {name:'Gameplay Dev', key:'gameplay', min:0, max:100, unit:'%', default:25},
      {name:'Graphics Polish', key:'graphics', min:0, max:100, unit:'%', default:25},
      {name:'Bug Testing', key:'testing', min:0, max:100, unit:'%', default:25},
      {name:'Marketing Push', key:'marketing', min:0, max:100, unit:'%', default:25}
    ],
    output: (v) => {
      const total = v.gameplay + v.graphics + v.testing + v.marketing;
      if (total === 0) return 0;
      const gameQuality = Math.sqrt(v.gameplay) * 4;
      const visualAppeal = Math.sqrt(v.graphics) * 2.5;
      const stability = v.testing < 15 ? 0.5 : Math.min(1, v.testing / 40);
      const reach = 0.5 + v.marketing / 200;
      return Math.round((gameQuality + visualAppeal) * stability * reach);
    },
    constraints:[
      {desc:'Total effort ≤ 100%', check: (v) => v.gameplay + v.graphics + v.testing + v.marketing <= 100}
    ],
    maxOutput: 100
  },
  {
    id:'diet1', name:'Balanced Diet Planner',
    scenario:'Plan daily food portions to maximize a health score while staying within calorie limits.',
    variables:[
      {name:'Protein', key:'protein', min:0, max:200, unit:'g', default:60},
      {name:'Carbs', key:'carbs', min:0, max:400, unit:'g', default:200},
      {name:'Fats', key:'fats', min:0, max:150, unit:'g', default:60},
      {name:'Vegetables', key:'veg', min:0, max:500, unit:'g', default:200}
    ],
    output: (v) => {
      const cal = v.protein * 4 + v.carbs * 4 + v.fats * 9;
      const proteinScore = Math.min(30, v.protein * 0.4);
      const carbScore = v.carbs > 300 ? 15 : v.carbs * 0.1;
      const fatScore = v.fats > 80 ? 10 : v.fats * 0.25;
      const vegScore = Math.min(30, v.veg * 0.1);
      const calPenalty = Math.abs(cal - 2000) / 100;
      return Math.round(Math.max(0, proteinScore + carbScore + fatScore + vegScore - calPenalty));
    },
    constraints:[
      {desc:'Calories between 1500-2500', check: (v) => { const c=v.protein*4+v.carbs*4+v.fats*9; return c>=1500&&c<=2500; }}
    ],
    maxOutput: 90
  },
  {
    id:'invest1', name:'Investment Portfolio',
    scenario:'Allocate funds across asset classes to maximize risk-adjusted returns.',
    variables:[
      {name:'Stocks', key:'stocks', min:0, max:100, unit:'%', default:40},
      {name:'Bonds', key:'bonds', min:0, max:100, unit:'%', default:30},
      {name:'Real Estate', key:'realestate', min:0, max:100, unit:'%', default:20},
      {name:'Crypto', key:'crypto', min:0, max:100, unit:'%', default:10}
    ],
    output: (v) => {
      const total = v.stocks + v.bonds + v.realestate + v.crypto;
      if (total === 0) return 0;
      const ret = v.stocks * 0.10 + v.bonds * 0.04 + v.realestate * 0.07 + v.crypto * 0.15;
      const risk = v.stocks * 0.15 + v.bonds * 0.03 + v.realestate * 0.10 + v.crypto * 0.40;
      const sharpe = risk > 0 ? ret / risk : 0;
      return Math.round(sharpe * 100);
    },
    constraints:[
      {desc:'Total allocation = 100%', check: (v) => v.stocks + v.bonds + v.realestate + v.crypto === 100}
    ],
    maxOutput: 100
  },
  {
    id:'spaceship1', name:'Spaceship Resource Allocation',
    scenario:'Manage your spaceship\'s limited power across systems for a successful mission.',
    variables:[
      {name:'Life Support', key:'life', min:10, max:100, unit:'%', default:30},
      {name:'Engines', key:'engines', min:0, max:100, unit:'%', default:30},
      {name:'Shields', key:'shields', min:0, max:100, unit:'%', default:20},
      {name:'Sensors', key:'sensors', min:0, max:100, unit:'%', default:20}
    ],
    output: (v) => {
      const total = v.life + v.engines + v.shields + v.sensors;
      const survival = v.life >= 30 ? 1 : v.life / 30;
      const speed = Math.sqrt(v.engines) * 2;
      const defense = Math.sqrt(v.shields) * 1.5;
      const intel = Math.sqrt(v.sensors) * 1;
      return Math.round((speed + defense + intel) * survival * 5);
    },
    constraints:[
      {desc:'Total power ≤ 100%', check: (v) => v.life + v.engines + v.shields + v.sensors <= 100},
      {desc:'Life Support ≥ 20% (minimum)', check: (v) => v.life >= 20}
    ],
    maxOutput: 100
  },
  {
    id:'restaurant1', name:'Restaurant Management',
    scenario:'Balance menu pricing, staff, and ingredients to maximize nightly profit.',
    variables:[
      {name:'Menu Price Level', key:'price', min:1, max:10, unit:'', default:5},
      {name:'Kitchen Staff', key:'staff', min:1, max:20, unit:'', default:8},
      {name:'Ingredient Quality', key:'quality', min:1, max:10, unit:'', default:5},
      {name:'Seating Capacity', key:'seats', min:10, max:100, unit:'', default:40}
    ],
    output: (v) => {
      const appeal = v.quality * 3 - v.price * 2 + 15;
      const customers = Math.min(v.seats, Math.max(0, appeal * 4));
      const throughput = Math.min(customers, v.staff * 6);
      const revenue = throughput * v.price * 3;
      const costs = v.staff * 15 + v.quality * throughput * 2 + v.seats * 0.5;
      return Math.round(Math.max(0, revenue - costs));
    },
    constraints:[
      {desc:'Staff × 3 ≤ Seats (reasonable ratio)', check: (v) => v.staff * 3 <= v.seats}
    ],
    maxOutput: 200
  },
  {
    id:'fitness1', name:'Workout Optimizer',
    scenario:'Plan your weekly workout to maximize fitness gains without overtraining.',
    variables:[
      {name:'Cardio Sessions', key:'cardio', min:0, max:7, unit:'/week', default:3},
      {name:'Strength Sessions', key:'strength', min:0, max:7, unit:'/week', default:3},
      {name:'Session Duration', key:'duration', min:15, max:120, unit:'min', default:45},
      {name:'Intensity Level', key:'intensity', min:1, max:10, unit:'', default:5}
    ],
    output: (v) => {
      const totalSessions = v.cardio + v.strength;
      const totalMinutes = totalSessions * v.duration;
      const cardioGain = v.cardio * Math.sqrt(v.duration) * v.intensity * 0.3;
      const strengthGain = v.strength * Math.sqrt(v.duration) * v.intensity * 0.4;
      const overtraining = totalMinutes > 400 ? (totalMinutes - 400) * 0.1 : 0;
      const recovery = totalSessions > 5 ? (totalSessions - 5) * 5 : 0;
      return Math.round(Math.max(0, cardioGain + strengthGain - overtraining - recovery));
    },
    constraints:[
      {desc:'Total sessions ≤ 6/week (recovery)', check: (v) => v.cardio + v.strength <= 6}
    ],
    maxOutput: 100
  },
  {
    id:'eco_island1', name:'Island Ecosystem',
    scenario:'Balance animal populations on an island to maximize biodiversity score.',
    variables:[
      {name:'Herbivores', key:'herb', min:0, max:200, unit:'', default:80},
      {name:'Predators', key:'pred', min:0, max:50, unit:'', default:15},
      {name:'Plant Cover', key:'plants', min:10, max:100, unit:'%', default:60},
      {name:'Water Sources', key:'water', min:1, max:20, unit:'', default:8}
    ],
    output: (v) => {
      const foodChain = v.pred > 0 && v.herb > v.pred * 3 ? 20 : 5;
      const plantHealth = Math.min(30, v.plants * 0.4);
      const carrying = v.water * 12;
      const overPop = v.herb + v.pred > carrying ? (v.herb + v.pred - carrying) * 0.3 : 0;
      const diversity = Math.min(25, Math.sqrt(v.herb) * 1.5 + Math.sqrt(v.pred) * 3);
      const waterScore = Math.min(15, v.water * 1.5);
      return Math.round(Math.max(0, foodChain + plantHealth + diversity + waterScore - overPop));
    },
    constraints:[
      {desc:'Herbivores > Predators × 2 (food chain)', check: (v) => v.herb > v.pred * 2}
    ],
    maxOutput: 90
  }
];

function getEconomyPuzzle() {
  const diff = GS.difficulty;
  const template = rngPick(ECONOMY_BANK);
  let numVars;
  switch(diff) {
    case 'easy': numVars = 2; break;
    case 'medium': numVars = 3; break;
    case 'hard': numVars = rngInt(3,4); break;
    case 'extreme': numVars = 4; break;
    case 'impossible': numVars = 4; break;
  }
  numVars = Math.min(numVars, template.variables.length);
  const vars = template.variables.slice(0, numVars);
  // Find optimal by brute-force sampling
  let bestOutput = -Infinity;
  for (let i = 0; i < 2000; i++) {
    const testVals = {};
    vars.forEach(v => { testVals[v.key] = v.min + GS.rng() * (v.max - v.min); });
    // Add defaults for missing vars
    template.variables.forEach(v => { if (!testVals[v.key]) testVals[v.key] = v.default; });
    const constraintsOk = template.constraints.every(c => c.check(testVals));
    if (constraintsOk) {
      const out = template.output(testVals);
      if (out > bestOutput) bestOutput = out;
    }
  }
  const threshold = {easy:0.60, medium:0.75, hard:0.85, extreme:0.95, impossible:0.99}[diff];
  return { ...template, activeVars: vars, bestOutput: Math.max(bestOutput, 1), threshold };
}

function renderEconomy(puzzle) {
  GS.challengeState.economy = { puzzle, attempts: 0, submitted: false, values: {} };
  puzzle.activeVars.forEach(v => { GS.challengeState.economy.values[v.key] = v.default; });
  puzzle.variables.forEach(v => {
    if (!GS.challengeState.economy.values[v.key]) GS.challengeState.economy.values[v.key] = v.default;
  });

  const icons = {farm1:'\u{1F33E}',factory1:'\u{1F3ED}',city1:'\u{1F3DB}\uFE0F',cafe1:'\u2615',energy1:'\u26A1',game_dev1:'\u{1F3AE}',diet1:'\u{1F957}',invest1:'\u{1F4B0}',spaceship1:'\u{1F680}',restaurant1:'\u{1F37D}\uFE0F',fitness1:'\u{1F4AA}',eco_island1:'\u{1F3DD}\uFE0F'};
  const icon = icons[puzzle.id] || '\u{1F4CA}';
  const diffColors = {easy:'#6aaa64',medium:'#c9b458',hard:'#f59e0b',extreme:'#e74c3c',impossible:'#dc2626'};
  const dc = diffColors[GS.difficulty] || '#6366f1';
  const target = Math.round(puzzle.bestOutput * puzzle.threshold);
  const circumference = Math.round(2 * Math.PI * 52 * 100) / 100;

  const c = document.getElementById('game-container');
  let html = `<div class="eco-dashboard">`;

  // Scenario Card
  html += `<div class="eco-scenario-card">
    <div class="eco-scenario-icon">${icon}</div>
    <div class="eco-scenario-content">
      <div class="eco-scenario-title">${puzzle.name}</div>
      <div class="eco-scenario-desc">${puzzle.scenario}</div>
      <span class="eco-difficulty-badge" style="background:${dc}18;color:${dc}">${GS.difficulty.toUpperCase()}</span>
    </div>
  </div>`;

  // Parameters
  html += `<div class="eco-section-label">Parameters</div>`;
  html += `<div class="eco-variables-section">`;
  puzzle.activeVars.forEach(v => {
    const pct = ((v.default - v.min) / (v.max - v.min)) * 100;
    html += `<div class="eco-var-card">
      <div class="eco-var-header">
        <span class="eco-var-name">${v.name}</span>
        <span class="eco-var-value" id="eco-val-${v.key}">${v.default}${v.unit ? ' '+v.unit : ''}</span>
      </div>
      <input type="range" class="eco-range" id="slider-${v.key}" min="${v.min}" max="${v.max}" value="${v.default}"
        style="background:linear-gradient(to right,var(--accent) ${pct}%,var(--bg3) ${pct}%)"
        oninput="updateEconomySlider('${v.key}',this.value)">
      <div class="eco-var-range"><span>${v.min}${v.unit?' '+v.unit:''}</span><span>${v.max}${v.unit?' '+v.unit:''}</span></div>
    </div>`;
  });
  html += `</div>`;

  // Performance Dashboard
  html += `<div class="eco-section-label">Performance</div>`;
  html += `<div class="eco-metrics">`;
  html += `<div class="eco-gauge-panel">
    <div class="eco-gauge-wrapper">
      <svg class="eco-gauge-svg" viewBox="0 0 120 120">
        <circle class="eco-gauge-bg" cx="60" cy="60" r="52"/>
        <circle class="eco-gauge-progress" id="eco-gauge-ring" cx="60" cy="60" r="52"
          stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"/>
      </svg>
      <div class="eco-gauge-center">
        <div class="eco-gauge-score" id="eco-gauge-score">0</div>
        <div class="eco-gauge-label">Output</div>
      </div>
    </div>
  </div>`;
  html += `<div class="eco-stats-panel">
    <div class="eco-stat"><div class="eco-stat-label">Target</div><div class="eco-stat-value">${target}</div></div>
    <div class="eco-stat"><div class="eco-stat-label">Efficiency</div><div class="eco-stat-value" id="eco-efficiency" style="color:var(--red)">0%</div></div>
    <div class="eco-stat"><div class="eco-stat-label">Attempts</div><div class="eco-stat-value" id="eco-attempts">0</div></div>
  </div>`;
  html += `</div>`;

  // Constraints
  html += `<div class="eco-section-label">Constraints</div>`;
  html += `<div class="eco-constraints-panel" id="eco-constraints">`;
  puzzle.constraints.forEach((cn, i) => {
    html += `<div class="eco-constraint" id="eco-constraint-${i}">
      <span class="eco-constraint-icon">\u25CB</span>
      <span>${cn.desc}</span>
    </div>`;
  });
  html += `</div>`;

  html += `<div id="economy-feedback" style="margin-top:8px"></div>`;
  html += `</div>`;

  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'inline-flex';
  updateEconomyDisplay();
}

function updateEconomySlider(key, val) {
  const state = GS.challengeState.economy;
  state.values[key] = parseFloat(val);
  const v = state.puzzle.activeVars.find(x => x.key === key);
  document.getElementById('eco-val-' + key).textContent = val + (v && v.unit ? ' ' + v.unit : '');
  const slider = document.getElementById('slider-' + key);
  if (slider && v) {
    const pct = ((val - v.min) / (v.max - v.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--accent) ${pct}%, var(--bg3) ${pct}%)`;
  }
  updateEconomyDisplay();
}

function updateEconomyDisplay() {
  const state = GS.challengeState.economy;
  const puzzle = state.puzzle;
  const allVals = {};
  puzzle.variables.forEach(v => { allVals[v.key] = v.default; });
  Object.assign(allVals, state.values);

  const output = puzzle.output(allVals);
  const pct = Math.max(0, Math.min(100, (output / puzzle.bestOutput) * 100));
  const efficiency = Math.round(pct);

  // Update SVG gauge
  const circumference = Math.round(2 * Math.PI * 52 * 100) / 100;
  const offset = circumference * (1 - pct / 100);
  const ring = document.getElementById('eco-gauge-ring');
  ring.style.strokeDashoffset = offset;
  document.getElementById('eco-gauge-score').textContent = output;

  // Color coding
  let color;
  if (pct >= puzzle.threshold * 100) color = 'var(--green)';
  else if (pct >= puzzle.threshold * 70) color = 'var(--yellow)';
  else color = 'var(--red)';
  ring.style.stroke = color;
  if (pct >= puzzle.threshold * 100) ring.classList.add('at-target');
  else ring.classList.remove('at-target');
  document.getElementById('eco-gauge-score').style.color = color;
  document.getElementById('eco-efficiency').textContent = efficiency + '%';
  document.getElementById('eco-efficiency').style.color = color;

  // Constraints
  puzzle.constraints.forEach((cn, i) => {
    const el = document.getElementById('eco-constraint-' + i);
    const ok = cn.check(allVals);
    el.className = 'eco-constraint ' + (ok ? 'met' : 'unmet');
    el.querySelector('.eco-constraint-icon').textContent = ok ? '\u2713' : '\u2717';
  });
}

function submitEconomy() {
  const state = GS.challengeState.economy;
  state.attempts++;
  document.getElementById('eco-attempts').textContent = state.attempts;
  const puzzle = state.puzzle;
  const allVals = {};
  puzzle.variables.forEach(v => { allVals[v.key] = v.default; });
  Object.assign(allVals, state.values);

  const constraintsOk = puzzle.constraints.every(c => c.check(allVals));
  if (!constraintsOk) {
    document.getElementById('economy-feedback').innerHTML = `<div class="eco-feedback-fail">\u26A0 Constraints not met. Adjust your parameters.</div>`;
    return;
  }

  const output = puzzle.output(allVals);
  const pct = output / puzzle.bestOutput;
  if (pct >= puzzle.threshold) {
    state.submitted = true;
    const rawScore = Math.round(Math.min(100, (pct / 1) * 100));
    const penalty = Math.max(0, (state.attempts - 1) * 10);
    const score = Math.max(0, rawScore - penalty);
    GS.results.economy = score;
    if (GS.mode === 'daily') {
      setDailyCompletion('economy', score);
      lsSet('daily-economy-state-'+getDailyDateStr(), { attempts: state.attempts, efficiency: Math.round(pct * 100), puzzleName: puzzle.name });
    }
    document.querySelectorAll('#game-container input[type=range]').forEach(s => s.disabled = true);
    setTimeout(() => {
      if (!document.getElementById('game-container')) return;
      showChallengeSummary({
        emoji: '🎯',
        score,
        title: 'Target Reached!',
        stats: [
          { label: 'Attempts', value: state.attempts },
          { label: 'Efficiency', value: Math.round(pct * 100) + '%' }
        ]
      });
    }, 400);
  } else {
    document.getElementById('economy-feedback').innerHTML = `<div class="eco-feedback-fail">\u{1F4C9} Output at ${Math.round(pct*100)}% efficiency \u2014 target is ${Math.round(puzzle.threshold*100)}%. Keep optimizing!</div>`;
  }
}

