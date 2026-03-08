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
  },
  {
    id:'airline1', name:'Airline Route Planning',
    scenario:'Optimize your regional airline\'s operations by balancing ticket prices, fleet usage, crew, and fuel reserves.',
    variables:[
      {name:'Ticket Price', key:'ticket', min:50, max:500, unit:'$', default:200},
      {name:'Daily Flights', key:'flights', min:1, max:20, unit:'', default:8},
      {name:'Crew Size', key:'crew', min:2, max:30, unit:'', default:12},
      {name:'Fuel Reserve', key:'fuel', min:10, max:100, unit:'%', default:40}
    ],
    output: (v) => {
      const demand = 300 - v.ticket * 0.5 + v.crew * 2;
      const passengers = Math.min(Math.max(0, demand), v.flights * 30);
      const revenue = passengers * v.ticket;
      const fuelCost = v.flights * v.fuel * 8;
      const crewCost = v.crew * 120;
      const safetyBonus = v.fuel >= 30 ? 500 : -1000;
      return Math.round(Math.max(0, (revenue - fuelCost - crewCost + safetyBonus) / 50));
    },
    constraints:[
      {desc:'Crew ≥ Flights × 1.5 (safety regs)', check: (v) => v.crew >= v.flights * 1.5}
    ],
    maxOutput: 150
  },
  {
    id:'school1', name:'School Planning',
    scenario:'Allocate your school\'s budget to maximize student performance and satisfaction.',
    variables:[
      {name:'Teacher Hiring', key:'teachers', min:5, max:50, unit:'', default:20},
      {name:'Technology Budget', key:'tech', min:0, max:100, unit:'%', default:30},
      {name:'Extracurriculars', key:'extra', min:0, max:100, unit:'%', default:25},
      {name:'Class Size', key:'classsize', min:10, max:40, unit:'', default:25}
    ],
    output: (v) => {
      const teacherQuality = Math.sqrt(v.teachers) * 5;
      const techBoost = Math.sqrt(v.tech) * 3;
      const engagement = v.extra > 60 ? 15 + (v.extra - 60) * 0.1 : v.extra * 0.25;
      const classPenalty = v.classsize > 25 ? (v.classsize - 25) * 1.5 : 0;
      const ratio = v.teachers > 0 ? Math.min(1.2, 20 / v.classsize) : 0;
      return Math.round(Math.max(0, (teacherQuality + techBoost + engagement - classPenalty) * ratio));
    },
    constraints:[
      {desc:'Tech + Extracurriculars ≤ 100%', check: (v) => v.tech + v.extra <= 100}
    ],
    maxOutput: 90
  },
  {
    id:'zoo1', name:'Zoo Management',
    scenario:'Balance animal habitats, staff, and visitor experience to maximize zoo revenue and animal welfare.',
    variables:[
      {name:'Animal Species', key:'species', min:5, max:80, unit:'', default:30},
      {name:'Habitat Quality', key:'habitat', min:1, max:10, unit:'', default:5},
      {name:'Staff Count', key:'staff', min:5, max:60, unit:'', default:25},
      {name:'Ticket Price', key:'ticket', min:5, max:60, unit:'$', default:25}
    ],
    output: (v) => {
      const attraction = v.species * v.habitat * 0.3;
      const visitors = Math.max(0, attraction * 3 - v.ticket * 1.5 + 50);
      const welfare = v.staff >= v.species * 0.5 ? 1 : v.staff / (v.species * 0.5);
      const revenue = visitors * v.ticket;
      const costs = v.staff * 100 + v.species * v.habitat * 20;
      const profit = revenue - costs;
      return Math.round(Math.max(0, profit / 30 + welfare * 20));
    },
    constraints:[
      {desc:'Staff ≥ Species ÷ 3 (animal care)', check: (v) => v.staff >= v.species / 3}
    ],
    maxOutput: 120
  },
  {
    id:'festival1', name:'Music Festival',
    scenario:'Plan a music festival by balancing headliners, stages, security, and ticket pricing.',
    variables:[
      {name:'Headliner Budget', key:'headliners', min:0, max:100, unit:'%', default:40},
      {name:'Number of Stages', key:'stages', min:1, max:8, unit:'', default:3},
      {name:'Security Staff', key:'security', min:10, max:200, unit:'', default:60},
      {name:'Ticket Price', key:'ticket', min:20, max:300, unit:'$', default:100}
    ],
    output: (v) => {
      const lineup = Math.sqrt(v.headliners) * 6;
      const variety = Math.sqrt(v.stages) * 8;
      const attendance = Math.max(0, 500 + lineup * 30 + variety * 20 - v.ticket * 2);
      const safety = v.security >= attendance * 0.05 ? 1 : v.security / (attendance * 0.05);
      const revenue = attendance * v.ticket;
      const costs = v.headliners * 200 + v.stages * 5000 + v.security * 150;
      return Math.round(Math.max(0, (revenue - costs) / 200 * safety));
    },
    constraints:[
      {desc:'Security ≥ 30 per stage', check: (v) => v.security >= v.stages * 30}
    ],
    maxOutput: 150
  },
  {
    id:'hospital1', name:'Hospital ER Management',
    scenario:'Manage ER resources to minimize patient wait times and maximize care quality.',
    variables:[
      {name:'Doctors on Shift', key:'doctors', min:1, max:20, unit:'', default:8},
      {name:'Nurses on Shift', key:'nurses', min:2, max:40, unit:'', default:16},
      {name:'Beds Available', key:'beds', min:5, max:50, unit:'', default:20},
      {name:'Triage Strictness', key:'triage', min:1, max:10, unit:'', default:5}
    ],
    output: (v) => {
      const capacity = Math.min(v.beds, v.doctors * 4, v.nurses * 2.5);
      const patientFlow = 30;
      const treated = Math.min(capacity, patientFlow);
      const waitScore = treated >= patientFlow ? 30 : 30 * (treated / patientFlow);
      const careQuality = Math.sqrt(v.doctors) * 5 + Math.sqrt(v.nurses) * 3;
      const triageBonus = v.triage >= 4 && v.triage <= 7 ? 10 : 10 - Math.abs(v.triage - 5.5) * 2;
      const staffFatigue = (v.doctors + v.nurses) < 15 ? 10 : 0;
      return Math.round(Math.max(0, waitScore + careQuality + triageBonus - staffFatigue));
    },
    constraints:[
      {desc:'Nurses ≥ Doctors × 1.5 (staffing ratio)', check: (v) => v.nurses >= v.doctors * 1.5}
    ],
    maxOutput: 95
  },
  {
    id:'pizza1', name:'Pizza Delivery Empire',
    scenario:'Optimize your pizza delivery business by balancing speed, quality, drivers, and menu size.',
    variables:[
      {name:'Delivery Drivers', key:'drivers', min:1, max:20, unit:'', default:8},
      {name:'Menu Items', key:'menu', min:3, max:30, unit:'', default:12},
      {name:'Oven Temperature', key:'temp', min:200, max:500, unit:'°F', default:400},
      {name:'Dough Quality', key:'dough', min:1, max:10, unit:'', default:5}
    ],
    output: (v) => {
      const speed = v.drivers * 5;
      const variety = Math.sqrt(v.menu) * 4;
      const cookQuality = -(v.temp - 425) * (v.temp - 425) / 500 + 25;
      const tasteScore = v.dough * 3;
      const complexity = v.menu > 15 ? (v.menu - 15) * 1.2 : 0;
      const deliveryCapacity = Math.min(v.drivers * 8, 100);
      const orders = Math.min(deliveryCapacity, variety * 5 + tasteScore + cookQuality);
      return Math.round(Math.max(0, orders + cookQuality + tasteScore - complexity));
    },
    constraints:[
      {desc:'Oven temp between 300-475°F', check: (v) => v.temp >= 300 && v.temp <= 475}
    ],
    maxOutput: 120
  },
  {
    id:'colony1', name:'Space Colony',
    scenario:'Manage a Mars colony\'s resources to maximize population growth and sustainability.',
    variables:[
      {name:'Oxygen Production', key:'oxygen', min:10, max:100, unit:'%', default:40},
      {name:'Food Farms', key:'farms', min:1, max:20, unit:'', default:8},
      {name:'Solar Panels', key:'solar', min:5, max:100, unit:'', default:30},
      {name:'Research Labs', key:'labs', min:0, max:15, unit:'', default:5}
    ],
    output: (v) => {
      const lifesupport = v.oxygen >= 50 ? 1 : v.oxygen / 50;
      const food = Math.sqrt(v.farms) * 8;
      const power = v.solar >= 40 ? 1 : v.solar / 40;
      const innovation = Math.sqrt(v.labs) * 5;
      const sustainability = Math.min(food, v.oxygen * 0.5) * 0.3;
      return Math.round(Math.max(0, (food + innovation + sustainability) * lifesupport * power * 3));
    },
    constraints:[
      {desc:'Oxygen ≥ 30% (breathable atmosphere)', check: (v) => v.oxygen >= 30},
      {desc:'Solar panels ≥ 20 (minimum power)', check: (v) => v.solar >= 20}
    ],
    maxOutput: 100
  },
  {
    id:'aquarium1', name:'Aquarium Design',
    scenario:'Design a public aquarium that maximizes visitor enjoyment and fish health.',
    variables:[
      {name:'Tank Size', key:'tank', min:100, max:5000, unit:'gal', default:1500},
      {name:'Fish Species', key:'species', min:1, max:50, unit:'', default:15},
      {name:'Filtration Quality', key:'filter', min:1, max:10, unit:'', default:5},
      {name:'Lighting Level', key:'light', min:1, max:10, unit:'', default:5}
    ],
    output: (v) => {
      const bioload = v.species * 80;
      const tankHealth = bioload <= v.tank ? 1 : Math.max(0, 1 - (bioload - v.tank) / v.tank);
      const filtration = Math.min(1.2, v.filter / 6);
      const fishHealth = tankHealth * filtration * 40;
      const lightSweet = -(v.light - 6) * (v.light - 6) + 36;
      const diversity = Math.sqrt(v.species) * 6;
      const spectacle = v.tank > 2000 ? 10 : v.tank / 200;
      return Math.round(Math.max(0, fishHealth + lightSweet * 0.5 + diversity + spectacle));
    },
    constraints:[
      {desc:'Fish species × 100 ≤ Tank size (stocking limit)', check: (v) => v.species * 100 <= v.tank}
    ],
    maxOutput: 100
  },
  {
    id:'themepark1', name:'Theme Park Operations',
    scenario:'Run a theme park by balancing ride count, staff, pricing, and maintenance to maximize daily profit.',
    variables:[
      {name:'Rides Open', key:'rides', min:3, max:30, unit:'', default:12},
      {name:'Park Staff', key:'staff', min:10, max:150, unit:'', default:60},
      {name:'Entry Price', key:'price', min:10, max:120, unit:'$', default:50},
      {name:'Maintenance Budget', key:'maint', min:0, max:100, unit:'%', default:40}
    ],
    output: (v) => {
      const appeal = Math.sqrt(v.rides) * 15 + (v.maint > 50 ? 10 : v.maint * 0.2);
      const visitors = Math.max(0, appeal * 10 - v.price * 1.5 + 100);
      const staffCoverage = v.staff >= v.rides * 5 ? 1 : v.staff / (v.rides * 5);
      const breakdowns = v.maint < 30 ? (30 - v.maint) * 0.02 : 0;
      const satisfaction = staffCoverage * (1 - breakdowns);
      const revenue = visitors * v.price * satisfaction;
      const costs = v.staff * 80 + v.rides * 200 + v.maint * 50;
      return Math.round(Math.max(0, (revenue - costs) / 100));
    },
    constraints:[
      {desc:'Staff ≥ Rides × 3 (minimum operations)', check: (v) => v.staff >= v.rides * 3}
    ],
    maxOutput: 150
  },
  {
    id:'movie1', name:'Movie Production',
    scenario:'Produce a blockbuster film by allocating budget across cast, effects, marketing, and script development.',
    variables:[
      {name:'Cast Budget', key:'cast', min:0, max:100, unit:'%', default:30},
      {name:'Visual Effects', key:'vfx', min:0, max:100, unit:'%', default:25},
      {name:'Marketing', key:'marketing', min:0, max:100, unit:'%', default:25},
      {name:'Script Development', key:'script', min:0, max:100, unit:'%', default:20}
    ],
    output: (v) => {
      const total = v.cast + v.vfx + v.marketing + v.script;
      if (total === 0) return 0;
      const starPower = Math.sqrt(v.cast) * 4;
      const spectacle = Math.sqrt(v.vfx) * 3;
      const buzz = Math.sqrt(v.marketing) * 3.5;
      const story = v.script < 10 ? 2 : Math.sqrt(v.script) * 4;
      const quality = starPower + spectacle + story;
      const reach = 0.4 + buzz / 40;
      const boxOffice = quality * reach;
      return Math.round(Math.max(0, boxOffice));
    },
    constraints:[
      {desc:'Total budget ≤ 100%', check: (v) => v.cast + v.vfx + v.marketing + v.script <= 100},
      {desc:'Script ≥ 5% (need a story!)', check: (v) => v.script >= 5}
    ],
    maxOutput: 100
  },
  {
    id:'sports1', name:'Sports Team Management',
    scenario:'Build a championship team by balancing player salaries, training, scouting, and facilities.',
    variables:[
      {name:'Star Player Budget', key:'stars', min:0, max:100, unit:'%', default:40},
      {name:'Training Intensity', key:'training', min:1, max:10, unit:'', default:5},
      {name:'Scouting Investment', key:'scouting', min:0, max:50, unit:'%', default:15},
      {name:'Facility Quality', key:'facility', min:1, max:10, unit:'', default:5}
    ],
    output: (v) => {
      const talent = Math.sqrt(v.stars) * 5 + Math.sqrt(v.scouting) * 3;
      const prep = v.training * v.facility * 0.3;
      const overtraining = v.training > 8 ? (v.training - 8) * 5 : 0;
      const chemistry = Math.abs(v.stars - 60) < 20 ? 10 : 10 - Math.abs(v.stars - 60) * 0.2;
      const injury = v.training > 7 && v.facility < 5 ? 15 : 0;
      return Math.round(Math.max(0, talent + prep + chemistry - overtraining - injury));
    },
    constraints:[
      {desc:'Stars + Scouting ≤ 80% (salary cap)', check: (v) => v.stars + v.scouting <= 80}
    ],
    maxOutput: 90
  },
  {
    id:'bakery1', name:'Bakery Operations',
    scenario:'Run your bakery by balancing production volume, ingredient quality, variety, and opening hours.',
    variables:[
      {name:'Daily Batches', key:'batches', min:1, max:20, unit:'', default:8},
      {name:'Ingredient Grade', key:'grade', min:1, max:10, unit:'', default:5},
      {name:'Product Variety', key:'variety', min:2, max:20, unit:'items', default:8},
      {name:'Open Hours', key:'hours', min:4, max:16, unit:'hrs', default:10}
    ],
    output: (v) => {
      const capacity = v.batches * v.hours * 0.5;
      const qualityAppeal = Math.sqrt(v.grade) * 8;
      const varietyAppeal = Math.sqrt(v.variety) * 5;
      const demand = qualityAppeal + varietyAppeal + v.hours * 1.5;
      const sold = Math.min(capacity, demand * 3);
      const revenue = sold * (v.grade * 0.5 + 2);
      const costs = v.batches * v.grade * 3 + v.hours * 8 + v.variety * 5;
      const freshness = v.batches > 12 ? 0.85 : 1;
      return Math.round(Math.max(0, (revenue - costs) * freshness));
    },
    constraints:[
      {desc:'Batches × Variety ≤ 120 (oven capacity)', check: (v) => v.batches * v.variety <= 120}
    ],
    maxOutput: 150
  },
  {
    id:'construction1', name:'Construction Project',
    scenario:'Manage a building project by balancing crew size, equipment, material quality, and timeline.',
    variables:[
      {name:'Crew Size', key:'crew', min:5, max:80, unit:'', default:30},
      {name:'Equipment Rental', key:'equip', min:1, max:10, unit:'', default:5},
      {name:'Material Quality', key:'material', min:1, max:10, unit:'', default:5},
      {name:'Target Weeks', key:'weeks', min:4, max:52, unit:'wks', default:20}
    ],
    output: (v) => {
      const productivity = v.crew * Math.sqrt(v.equip) * 0.8;
      const workDone = productivity * v.weeks;
      const buildingSize = 1000;
      const completion = Math.min(1, workDone / buildingSize);
      const quality = v.material * 5 + (v.weeks > 15 ? 10 : v.weeks * 0.67);
      const cost = v.crew * v.weeks * 10 + v.equip * v.weeks * 50 + v.material * 200;
      const budget = 15000;
      const underBudget = cost <= budget ? 20 : 20 - (cost - budget) / 500;
      return Math.round(Math.max(0, completion * 50 + quality + underBudget));
    },
    constraints:[
      {desc:'Crew × Weeks ≤ 2000 (labor hours budget)', check: (v) => v.crew * v.weeks <= 2000}
    ],
    maxOutput: 120
  },
  {
    id:'shipping1', name:'Shipping Logistics',
    scenario:'Optimize a shipping company by balancing fleet size, route planning, warehouse capacity, and speed.',
    variables:[
      {name:'Trucks', key:'trucks', min:1, max:30, unit:'', default:10},
      {name:'Route Efficiency', key:'route', min:1, max:10, unit:'', default:5},
      {name:'Warehouse Size', key:'warehouse', min:100, max:2000, unit:'sq ft', default:600},
      {name:'Delivery Speed', key:'speed', min:1, max:10, unit:'', default:5}
    ],
    output: (v) => {
      const capacity = v.trucks * 50;
      const storage = v.warehouse * 0.8;
      const throughput = Math.min(capacity, storage) * v.route * 0.1;
      const speedBonus = Math.sqrt(v.speed) * 8;
      const fuelCost = v.trucks * v.speed * 3;
      const warehouseCost = v.warehouse * 0.1;
      const revenue = throughput * (2 + v.speed * 0.3);
      const profit = revenue - fuelCost - warehouseCost;
      return Math.round(Math.max(0, profit * 0.5 + speedBonus));
    },
    constraints:[
      {desc:'Warehouse ≥ Trucks × 40 (parking + loading)', check: (v) => v.warehouse >= v.trucks * 40}
    ],
    maxOutput: 130
  },
  {
    id:'library1', name:'Library Management',
    scenario:'Manage a public library to maximize community engagement and literacy scores.',
    variables:[
      {name:'Book Collection', key:'books', min:100, max:10000, unit:'', default:3000},
      {name:'Librarians', key:'staff', min:1, max:20, unit:'', default:6},
      {name:'Program Hours', key:'programs', min:0, max:40, unit:'hrs/wk', default:15},
      {name:'Digital Resources', key:'digital', min:0, max:100, unit:'%', default:30}
    ],
    output: (v) => {
      const collection = Math.sqrt(v.books) * 2;
      const staffHelp = Math.sqrt(v.staff) * 8;
      const events = v.programs > 30 ? 20 + (v.programs - 30) * 0.2 : v.programs * 0.67;
      const techAccess = Math.sqrt(v.digital) * 4;
      const staffCapacity = v.staff * 6;
      const programPenalty = v.programs > staffCapacity ? (v.programs - staffCapacity) * 1.5 : 0;
      return Math.round(Math.max(0, collection + staffHelp + events + techAccess - programPenalty));
    },
    constraints:[
      {desc:'Programs ≤ Staff × 8 (bandwidth)', check: (v) => v.programs <= v.staff * 8}
    ],
    maxOutput: 100
  },
  {
    id:'petstore1', name:'Pet Store',
    scenario:'Run a pet store by balancing animal variety, care quality, pricing, and store space.',
    variables:[
      {name:'Animal Types', key:'types', min:2, max:20, unit:'', default:8},
      {name:'Care Quality', key:'care', min:1, max:10, unit:'', default:5},
      {name:'Price Markup', key:'markup', min:10, max:100, unit:'%', default:40},
      {name:'Store Size', key:'space', min:200, max:2000, unit:'sq ft', default:800}
    ],
    output: (v) => {
      const appeal = Math.sqrt(v.types) * 6 + v.care * 2;
      const customers = Math.max(0, appeal * 3 - v.markup * 0.2 + 10);
      const spacePerType = v.types > 0 ? v.space / v.types : 0;
      const animalHealth = spacePerType >= 80 ? 1 : spacePerType / 80;
      const salesPerCustomer = (1 + v.markup / 100) * 15;
      const revenue = customers * salesPerCustomer;
      const costs = v.types * v.care * 15 + v.space * 0.5;
      const reputation = v.care >= 7 ? 15 : v.care * 2;
      return Math.round(Math.max(0, (revenue - costs) * animalHealth * 0.3 + reputation));
    },
    constraints:[
      {desc:'Space ≥ Types × 50 (minimum habitat)', check: (v) => v.space >= v.types * 50}
    ],
    maxOutput: 100
  },
  {
    id:'waterpark1', name:'Water Park',
    scenario:'Design a water park by balancing slides, pools, lifeguards, and water recycling to maximize fun and safety.',
    variables:[
      {name:'Water Slides', key:'slides', min:1, max:15, unit:'', default:6},
      {name:'Pool Area', key:'pools', min:500, max:5000, unit:'sq ft', default:2000},
      {name:'Lifeguards', key:'guards', min:2, max:30, unit:'', default:10},
      {name:'Water Recycling', key:'recycle', min:0, max:100, unit:'%', default:50}
    ],
    output: (v) => {
      const thrill = Math.sqrt(v.slides) * 10;
      const relaxation = Math.sqrt(v.pools) * 1.5;
      const totalAttractions = v.slides * 200 + v.pools;
      const safetyRatio = v.guards * 300 / Math.max(1, totalAttractions);
      const safety = Math.min(1, safetyRatio);
      const ecoBonus = v.recycle > 70 ? 10 : v.recycle * 0.14;
      const waterCost = (100 - v.recycle) * 0.3;
      const funScore = (thrill + relaxation + ecoBonus - waterCost) * safety;
      return Math.round(Math.max(0, funScore));
    },
    constraints:[
      {desc:'Lifeguards ≥ Slides + Pools÷500', check: (v) => v.guards >= v.slides + Math.floor(v.pools / 500)}
    ],
    maxOutput: 100
  },
  {
    id:'foodtruck1', name:'Food Truck Business',
    scenario:'Optimize your food truck by choosing location time, menu focus, portion size, and social media effort.',
    variables:[
      {name:'Hours at Location', key:'hours', min:2, max:12, unit:'hrs', default:6},
      {name:'Menu Focus', key:'focus', min:1, max:10, unit:'', default:5},
      {name:'Portion Size', key:'portion', min:1, max:10, unit:'', default:5},
      {name:'Social Media', key:'social', min:0, max:100, unit:'%', default:30}
    ],
    output: (v) => {
      const lunchRush = v.hours >= 4 && v.hours <= 8 ? 15 : 15 - Math.abs(v.hours - 6) * 2;
      const menuAppeal = v.focus >= 3 && v.focus <= 6 ? v.focus * 4 : v.focus * 2;
      const valueScore = v.portion * 2 - v.portion * v.portion * 0.08;
      const buzz = Math.sqrt(v.social) * 4;
      const foodCost = v.portion * v.hours * 2;
      const revenue = (lunchRush + menuAppeal + valueScore + buzz) * v.hours * 0.5;
      return Math.round(Math.max(0, revenue - foodCost));
    },
    constraints:[
      {desc:'Hours ≤ 10 (daily permit limit)', check: (v) => v.hours <= 10}
    ],
    maxOutput: 120
  }
];

function getEconomyPuzzle() {
  const diff = GS.difficulty;
  const template = rngPickUnseen(ECONOMY_BANK, 'economy', 'id');
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

  const icons = {farm1:'\u{1F33E}',factory1:'\u{1F3ED}',city1:'\u{1F3DB}\uFE0F',cafe1:'\u2615',energy1:'\u26A1',game_dev1:'\u{1F3AE}',diet1:'\u{1F957}',invest1:'\u{1F4B0}',spaceship1:'\u{1F680}',restaurant1:'\u{1F37D}\uFE0F',fitness1:'\u{1F4AA}',eco_island1:'\u{1F3DD}\uFE0F',airline1:'\u2708\uFE0F',school1:'\u{1F3EB}',zoo1:'\u{1F981}',festival1:'\u{1F3B5}',hospital1:'\u{1F3E5}',pizza1:'\u{1F355}',colony1:'\u{1F30C}',aquarium1:'\u{1F41F}',themepark1:'\u{1F3A2}',movie1:'\u{1F3AC}',sports1:'\u26BD',bakery1:'\u{1F950}',construction1:'\u{1F3D7}\uFE0F',shipping1:'\u{1F69A}',library1:'\u{1F4DA}',petstore1:'\u{1F43E}',waterpark1:'\u{1F3CA}',foodtruck1:'\u{1F69B}'};
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

