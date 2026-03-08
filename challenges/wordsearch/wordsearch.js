// ==================== CHALLENGE 5: WORD SEARCH ====================
const WORDSEARCH_BANK = [
  {theme:'Space', words:['PLANET','GALAXY','NEBULA','COMET','ASTEROID','ORBIT','ECLIPSE','QUASAR','METEOR','COSMOS','ROCKET','SATURN']},
  {theme:'Kitchen', words:['SPATULA','WHISK','GRATER','COLANDER','SKILLET','LADLE','TONGS','PEELER','BLENDER','SAUCEPAN','MORTAR','KETTLE']},
  {theme:'Programming', words:['FUNCTION','VARIABLE','ARRAY','OBJECT','STRING','BOOLEAN','LOOP','CLASS','MODULE','SYNTAX','COMPILE','DEBUG']},
  {theme:'Animals', words:['DOLPHIN','PANTHER','FALCON','PENGUIN','GIRAFFE','BUFFALO','OCTOPUS','LOBSTER','HAMSTER','SPARROW','JAGUAR','WALRUS']},
  {theme:'Music', words:['RHYTHM','MELODY','CHORD','TEMPO','OCTAVE','GUITAR','VIOLIN','TREBLE','SONATA','HARMONY','BRIDGE','CHORUS']},
  {theme:'Ocean', words:['CURRENT','CORAL','ANCHOR','HARBOR','KELP','TRENCH','WHALE','SHORE','LAGOON','PLANKTON','REEF','TIDE']},
  {theme:'Sports', words:['SPRINT','TROPHY','RACKET','GOALIE','TACKLE','WICKET','JAVELIN','HURDLE','SERVE','VOLLEY','DRIBBLE','PADDLE']},
  {theme:'Weather', words:['THUNDER','CYCLONE','MONSOON','DROUGHT','BREEZE','TORNADO','BLIZZARD','FROST','DRIZZLE','RAINBOW','HAIL','SQUALL']},
  {theme:'Chemistry', words:['ELEMENT','PROTON','NEUTRON','ISOTOPE','MOLECULE','CATALYST','SOLVENT','CRYSTAL','POLYMER','REAGENT','FLASK','BOND']},
  {theme:'Geography', words:['PLATEAU','CANYON','GLACIER','TUNDRA','DELTA','VOLCANO','PRAIRIE','ISLAND','FJORD','BASIN','RIDGE','VALLEY']},
  {theme:'Literature', words:['NOVEL','CHAPTER','STANZA','SONNET','FABLE','MEMOIR','SATIRE','PROSE','ALLEGORY','EPILOGUE','GENRE','VERSE']},
  {theme:'Movies', words:['DIRECTOR','CAMERA','SCRIPT','SEQUEL','TRAILER','MONTAGE','CINEMA','STUDIO','ACTOR','SCENE','FRAME','REEL']},
  {theme:'Technology', words:['BROWSER','SERVER','ROUTER','PIXEL','SENSOR','WIDGET','CACHE','FIREWALL','MODEM','CLOUD','DRONE','LASER']},
  {theme:'Nature', words:['FOREST','MEADOW','STREAM','BOULDER','CANYON','WILLOW','ORCHID','BLOSSOM','FERN','MOSS','PEBBLE','GROVE']},
  {theme:'Medicine', words:['VACCINE','SYMPTOM','THERAPY','SURGEON','PLASMA','TISSUE','MARROW','TENDON','BIOPSY','DOSAGE','PULSE','TRIAGE']},
  {theme:'Architecture', words:['COLUMN','FACADE','CORNICE','DOME','ATRIUM','TURRET','PARAPET','PILLAR','BALCONY','GARGOYLE','VAULT','SPIRE']},
  {theme:'Fashion', words:['FABRIC','STITCH','VELVET','DENIM','COTTON','LINEN','CORSET','PLEAT','COLLAR','BUTTON','ZIPPER','THREAD']},
  {theme:'Mythology', words:['PHOENIX','DRAGON','TITAN','ORACLE','CENTAUR','SPHINX','KRAKEN','SIREN','HYDRA','GRIFFIN','NYMPH','CYCLOPS']},
  {theme:'Cooking', words:['SIMMER','BRAISE','SAUTE','BLANCH','POACH','FLAMBE','REDUCE','GARNISH','FOLD','WHIP','ROAST','STEAM']},
  {theme:'Math', words:['MATRIX','VECTOR','PRIME','FACTOR','MEDIAN','COSINE','RADIUS','VERTEX','ANGLE','TANGENT','PROOF','GRAPH']},
  {theme:'Garden', words:['COMPOST','TRELLIS','MULCH','PRUNE','SEEDLING','HARVEST','TOPSOIL','FLOWER','SPROUT','HEDGE','PETAL','BLOOM']},
  {theme:'Colors', words:['CRIMSON','SCARLET','INDIGO','VIOLET','AMBER','MAROON','SILVER','BRONZE','IVORY','CORAL','TEAL','KHAKI']},
  {theme:'Countries', words:['BRAZIL','CANADA','EGYPT','FRANCE','GERMANY','ICELAND','JAPAN','KENYA','MEXICO','NORWAY','PERU','SWEDEN','TURKEY','VIETNAM']},
  {theme:'Dinosaurs', words:['RAPTOR','FOSSIL','JURASSIC','THEROPOD','SAUROPOD','EXTINCT','PREDATOR','SKELETON','CARNIVORE','HERBIVORE','TRIASSIC','TRACKWAY']},
  {theme:'Dance', words:['WALTZ','TANGO','SALSA','BALLET','RUMBA','FOXTROT','POLKA','SAMBA','MAMBO','PIROUETTE','ROUTINE','PARTNER','TWIRL','SWING']},
  {theme:'Photography', words:['APERTURE','SHUTTER','EXPOSURE','TRIPOD','FILTER','PORTRAIT','BOKEH','FOCAL','LENS','FLASH','PANORAMA','MACRO','ZOOM','CONTRAST']},
  {theme:'Board Games', words:['CHECKMATE','PAWN','BISHOP','ROOK','DICE','TOKEN','BOARD','SPINNER','STRATEGY','PLAYER','DOMINO','CASTLE','KNIGHT','BLUFF']},
  {theme:'Desserts', words:['BROWNIE','TRUFFLE','SOUFFLE','PUDDING','CUSTARD','ECLAIR','GELATO','SORBET','TIRAMISU','MACARON','MOUSSE','COBBLER','STRUDEL','TART']},
  {theme:'Vegetables', words:['BROCCOLI','SPINACH','ZUCCHINI','EGGPLANT','ARTICHOKE','CELERY','PARSNIP','TURNIP','RADISH','ENDIVE','SHALLOT','CABBAGE','ARUGULA','LEEK']},
  {theme:'Flowers', words:['JASMINE','DAHLIA','PEONY','TULIP','MARIGOLD','IRIS','LILAC','ZINNIA','AZALEA','ASTER','POPPY','CROCUS','PRIMROSE','BEGONIA']},
  {theme:'Trees', words:['CYPRESS','HICKORY','JUNIPER','MAGNOLIA','REDWOOD','SEQUOIA','BIRCH','CEDAR','SPRUCE','HEMLOCK','POPLAR','SYCAMORE','CHESTNUT','MAPLE']},
  {theme:'Birds', words:['CARDINAL','PELICAN','TOUCAN','OSPREY','HERON','MAGPIE','CONDOR','FINCH','WREN','ROBIN','HAWK','EAGLE','CRANE','STARLING']},
  {theme:'Fish', words:['SALMON','MARLIN','GROUPER','HALIBUT','SNAPPER','SWORDFISH','TROUT','PERCH','CATFISH','FLOUNDER','TUNA','ANCHOVY','MINNOW','BASS']},
  {theme:'Insects', words:['CRICKET','FIREFLY','MANTIS','LADYBUG','MONARCH','BEETLE','CICADA','HORNET','TERMITE','DRAGONFLY','APHID','WASP','LOCUST','EARWIG']},
  {theme:'Reptiles', words:['IGUANA','PYTHON','COBRA','GECKO','VIPER','TORTOISE','MONITOR','CHAMELEON','TUATARA','SKINK','MAMBA','CAIMAN','ADDER','BASILISK']},
  {theme:'Gemstones', words:['DIAMOND','EMERALD','SAPPHIRE','RUBY','TOPAZ','GARNET','OPAL','JADE','ONYX','PEARL','AMETHYST','AGATE','TURQUOISE','ZIRCON']},
  {theme:'Currencies', words:['DOLLAR','POUND','FRANC','RUPEE','PESO','DINAR','CROWN','SHILLING','LIRA','FLORIN','RUBLE','GUILDER','MARK','RAND']},
  {theme:'Languages', words:['ARABIC','BENGALI','FRENCH','GERMAN','HINDI','ITALIAN','KOREAN','MANDARIN','POLISH','RUSSIAN','SPANISH','SWEDISH','TAMIL','TURKISH']},
  {theme:'Emotions', words:['JOY','ANGER','SORROW','FEAR','DISGUST','ENVY','PRIDE','SHAME','GUILT','HOPE','TRUST','SURPRISE','CONTEMPT','RELIEF']},
  {theme:'Tools', words:['HAMMER','WRENCH','PLIERS','CHISEL','CLAMP','DRILL','MALLET','LEVEL','TROWEL','HACKSAW','SCRAPER','LATHE','ANVIL','VISE']},
  {theme:'Furniture', words:['ARMCHAIR','CABINET','DRESSER','OTTOMAN','BOOKCASE','WARDROBE','CREDENZA','FUTON','LOVESEAT','RECLINER','BENCH','STOOL','HUTCH','CRADLE']},
  {theme:'Fabrics', words:['CHIFFON','SATIN','SILK','CASHMERE','FLANNEL','TWEED','SUEDE','LEATHER','BURLAP','MUSLIN','TAFFETA','ORGANZA','CORDUROY','FLEECE']},
  {theme:'Spices', words:['CINNAMON','TURMERIC','PAPRIKA','CUMIN','SAFFRON','NUTMEG','OREGANO','CAYENNE','CLOVE','GINGER','THYME','BASIL','CORIANDER','CARDAMOM']},
  {theme:'Pasta', words:['LINGUINE','FUSILLI','PENNE','RIGATONI','FARFALLE','ORZO','GNOCCHI','RAVIOLI','LASAGNA','ROTINI','CANNELLONI','MACARONI','TORTELLINI']},
  {theme:'Cheese', words:['CHEDDAR','BRIE','GOUDA','GRUYERE','STILTON','HAVARTI','FONTINA','RICOTTA','COLBY','EDAM','ASIAGO','MUENSTER','PROVOLONE','MANCHEGO']},
  {theme:'Coffee', words:['ESPRESSO','LATTE','MOCHA','ARABICA','ROBUSTA','CAPPUCCINO','MACCHIATO','RISTRETTO','DOPPIO','BARISTA','DRIP','ROAST','CREMA','BLEND']},
  {theme:'Tea', words:['OOLONG','MATCHA','CHAMOMILE','DARJEELING','PEKOE','ROOIBOS','SENCHA','BREW','STEEP','INFUSION','CEYLON','BERGAMOT','HERBAL','TISANE']},
  {theme:'Yoga', words:['CHAKRA','MANTRA','ASANA','LOTUS','VINYASA','BALANCE','POSTURE','STRETCH','MEDITATE','BREATHE','MINDFUL','ALIGN','FLEX','FOCUS']},
  {theme:'Martial Arts', words:['KARATE','JUDO','AIKIDO','TAEKWONDO','KENDO','STANCE','SPARRING','DOJO','SENSEI','STRIKE','BLOCK','GRAPPLE','THROW','KATA']},
  {theme:'Card Games', words:['POKER','BRIDGE','SHUFFLE','TRUMP','DEALER','BLUFF','FLUSH','DISCARD','JOKER','SPADE','HEARTS','CLUBS','WAGER','ANTE']},
  {theme:'Astronomy', words:['PULSAR','SUPERNOVA','EQUINOX','SOLSTICE','ZENITH','PARSEC','DWARF','BINARY','REDSHIFT','CORONA','FLARE','LUNAR','SOLAR','NOVA']},
  {theme:'Geology', words:['BASALT','GRANITE','OBSIDIAN','SANDSTONE','LIMESTONE','MAGMA','SHALE','SLATE','MINERAL','STRATA','BEDROCK','EROSION','GNEISS','PUMICE']},
  {theme:'Marine Life', words:['SEAHORSE','STARFISH','JELLYFISH','MANATEE','BARNACLE','URCHIN','ANEMONE','NAUTILUS','OYSTER','CLAM','MUSSEL','SHRIMP','SPONGE','CORAL']},
  {theme:'Dog Breeds', words:['BEAGLE','COLLIE','POODLE','BULLDOG','MASTIFF','WHIPPET','BOXER','HUSKY','CORGI','DALMATIAN','SPANIEL','TERRIER','POINTER','SETTER']},
  {theme:'Cat Breeds', words:['SIAMESE','PERSIAN','BENGAL','RAGDOLL','BURMESE','BIRMAN','MANX','BOMBAY','KORAT','SIBERIAN','TONKINESE','SPHYNX','SAVANNAH','OCICAT']},
  {theme:'Composers', words:['BACH','MOZART','CHOPIN','BRAHMS','HANDEL','VIVALDI','MAHLER','DEBUSSY','DVORAK','STRAUSS','SCHUBERT','PUCCINI','VERDI','WAGNER']},
  {theme:'Painters', words:['PICASSO','MONET','RENOIR','VERMEER','CEZANNE','MATISSE','TITIAN','GOYA','RUBENS','TURNER','MUNCH','KLIMT','WARHOL','DEGAS']},
  {theme:'Inventions', words:['COMPASS','DYNAMITE','TELEGRAPH','TURBINE','BATTERY','RADIO','RADAR','TRANSISTOR','PRINTING','ENGINE','WHEEL','LEVER','TELEPHONE','MAGNET']},
  {theme:'Circus', words:['ACROBAT','JUGGLER','TRAPEZE','RINGMASTER','TIGHTROPE','CLOWN','STILTS','CANNON','HOOP','TENT','AERIALIST','MAGICIAN','UNICYCLE','COSTUME']},
  {theme:'Pirates', words:['PLANK','TREASURE','CAPTAIN','CUTLASS','GALLEON','CORSAIR','FLAGSHIP','MUTINY','PARROT','DOUBLOON','VOYAGE','PLUNDER','ANCHOR','CANNON']},
  {theme:'Camping', words:['CAMPFIRE','LANTERN','CANTEEN','BACKPACK','TENT','HIKING','TRAIL','FIREWOOD','MATCHES','CANOE','SHELTER','THERMOS','KAYAK','BONFIRE']},
  {theme:'Space Travel', words:['CAPSULE','COCKPIT','BOOSTER','PAYLOAD','MISSION','DOCKING','STATION','GRAVITY','MODULE','ALTITUDE','THRUSTER','LIFTOFF','REENTRY','DESCENT']},
];

function getWordsearchPuzzle() {
  const diff = GS.difficulty;
  let gridSize, wordCount, directions;
  switch(diff) {
    case 'easy':    gridSize=8;  wordCount=4;  directions=[[0,1],[1,0]]; break;
    case 'medium':  gridSize=10; wordCount=6;  directions=[[0,1],[1,0],[1,1],[1,-1]]; break;
    case 'hard':    gridSize=12; wordCount=8;  directions=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0]]; break;
    case 'extreme': gridSize=14; wordCount=10; directions=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]]; break;
    case 'impossible': gridSize=16; wordCount=14; directions=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]]; break;
  }
  const themeObj = rngPickUnseen(WORDSEARCH_BANK, 'wordsearch', 'theme');
  // Pick words that fit in the grid
  const candidates = rngShuffle([...themeObj.words]).filter(w => w.length <= gridSize);
  const grid = Array.from({length:gridSize}, () => Array(gridSize).fill(''));
  const placements = [];

  for (const word of candidates) {
    if (placements.length >= wordCount) break;
    const placed = placeWsWord(grid, word, directions, gridSize);
    if (placed) placements.push(placed);
  }

  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') grid[r][c] = letters[Math.floor(GS.rng() * 26)];
    }
  }
  return {
    grid, gridSize,
    words: placements.map(p => p.word),
    placements,
    theme: themeObj.theme,
    showWords: true
  };
}

function placeWsWord(grid, word, directions, gridSize) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const [dr, dc] = directions[Math.floor(GS.rng() * directions.length)];
    let minR, maxR, minC, maxC;
    if (dr > 0)      { minR = 0; maxR = gridSize - word.length; }
    else if (dr < 0) { minR = word.length - 1; maxR = gridSize - 1; }
    else             { minR = 0; maxR = gridSize - 1; }
    if (dc > 0)      { minC = 0; maxC = gridSize - word.length; }
    else if (dc < 0) { minC = word.length - 1; maxC = gridSize - 1; }
    else             { minC = 0; maxC = gridSize - 1; }
    if (minR > maxR || minC > maxC) continue;

    const r = minR + Math.floor(GS.rng() * (maxR - minR + 1));
    const c = minC + Math.floor(GS.rng() * (maxC - minC + 1));
    let fits = true;
    const cells = [];
    for (let i = 0; i < word.length; i++) {
      const nr = r + dr * i, nc = c + dc * i;
      if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) { fits = false; break; }
      if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { fits = false; break; }
      cells.push({r:nr, c:nc});
    }
    if (fits) {
      cells.forEach((cell, i) => { grid[cell.r][cell.c] = word[i]; });
      return { word, cells };
    }
  }
  return null;
}

function renderWordsearch(puzzle) {
  GS.challengeState.wordsearch = { puzzle, foundWords:[], selectedCells:[] };
  const c = document.getElementById('game-container');
  const isMobile = window.innerWidth <= 480;
  const fontSize = puzzle.gridSize <= 8 ? 16 : puzzle.gridSize <= 10 ? 14 : puzzle.gridSize <= 12 ? (isMobile ? 13 : 12) : (isMobile ? 12 : 11);
  let html = `<div style="margin-bottom:8px;text-align:center"><strong>Theme: ${puzzle.theme}</strong></div>`;
  html += `<div class="ws-wordlist" id="ws-wordlist">`;
  if (puzzle.showWords) {
    puzzle.words.forEach(w => { html += `<span class="ws-word" data-word="${w}">${w}</span>`; });
  } else {
    html += `<span class="ws-word">Find ${puzzle.words.length} hidden words</span>`;
  }
  html += `</div>`;
  html += `<div id="ws-found-count" style="text-align:center;font-size:13px;color:var(--fg2);margin-bottom:6px">Found: 0 / ${puzzle.words.length}</div>`;
  html += `<div class="ws-grid" id="ws-grid" style="grid-template-columns:repeat(${puzzle.gridSize},1fr);font-size:${fontSize}px">`;
  for (let r = 0; r < puzzle.gridSize; r++) {
    for (let col = 0; col < puzzle.gridSize; col++) {
      html += `<div class="ws-cell" data-r="${r}" data-c="${col}" onclick="tapWsCell(${r},${col})">${puzzle.grid[r][col]}</div>`;
    }
  }
  html += `</div>`;
  html += `<div id="ws-feedback" style="margin-top:10px;text-align:center"></div>`;
  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'inline-flex';
}

function tapWsCell(r, c) {
  const state = GS.challengeState.wordsearch;
  const sel = state.selectedCells;
  // Tapping an already-selected cell: deselect from that point onward
  const existingIdx = sel.findIndex(s => s.r === r && s.c === c);
  if (existingIdx >= 0) {
    sel.length = existingIdx; // remove from that cell onward
    updateWsGridUI();
    return;
  }
  // Must be adjacent and in a straight line with existing selection
  if (sel.length > 0) {
    const last = sel[sel.length - 1];
    const adjR = Math.abs(r - last.r);
    const adjC = Math.abs(c - last.c);
    const isAdj = adjR <= 1 && adjC <= 1 && (adjR + adjC > 0);
    if (!isAdj) { sel.length = 0; } // restart if not adjacent
    // If 2+ cells, enforce straight line direction
    if (sel.length >= 2 && isAdj) {
      const dr = sel[1].r - sel[0].r;
      const dc = sel[1].c - sel[0].c;
      if (r - last.r !== dr || c - last.c !== dc) {
        sel.length = 0; // restart if direction changed
      }
    }
  }
  sel.push({r, c});
  // Build the current word from selected cells
  const word = sel.map(s => state.puzzle.grid[s.r][s.c]).join('');
  // Check for an exact match against placements
  const placement = state.puzzle.placements.find(p => {
    if (state.foundWords.includes(p.word)) return false;
    if (p.word !== word) return false;
    if (p.cells.length !== sel.length) return false;
    return p.cells.every((pc, i) => pc.r === sel[i].r && pc.c === sel[i].c);
  });
  if (placement) {
    state.foundWords.push(placement.word);
    sel.length = 0;
    if (state.puzzle.showWords) {
      const wordEl = document.querySelector(`.ws-word[data-word="${placement.word}"]`);
      if (wordEl) wordEl.classList.add('found');
    }
    showToast(`Found: ${placement.word}!`);
    document.getElementById('ws-found-count').textContent = `Found: ${state.foundWords.length} / ${state.puzzle.words.length}`;
    if (state.foundWords.length === state.puzzle.words.length) {
      document.getElementById('ws-feedback').innerHTML = `<div style="color:var(--green);font-weight:700;animation:pop 0.4s">All words found!</div>`;
    }
  }
  // Check if current selection can't possibly match any word (dead end)
  if (sel.length > 0) {
    const canMatch = state.puzzle.placements.some(p => {
      if (state.foundWords.includes(p.word)) return false;
      if (p.cells.length < sel.length) return false;
      return sel.every((s, i) => p.cells[i].r === s.r && p.cells[i].c === s.c);
    });
    if (!canMatch) {
      // Flash red briefly then clear
      updateWsGridUI();
      document.querySelectorAll('.ws-cell.selected').forEach(el => { el.style.background = 'rgba(231,76,60,0.3)'; });
      setTimeout(() => { sel.length = 0; updateWsGridUI(); }, 300);
      return;
    }
  }
  updateWsGridUI();
}

function updateWsGridUI() {
  const state = GS.challengeState.wordsearch;
  document.querySelectorAll('.ws-cell').forEach(cell => {
    cell.classList.remove('selected','highlight');
    cell.style.background = '';
  });
  // Mark found cells
  state.puzzle.placements.forEach(p => {
    if (state.foundWords.includes(p.word)) {
      p.cells.forEach(cl => {
        const el = document.querySelector(`.ws-cell[data-r="${cl.r}"][data-c="${cl.c}"]`);
        if (el) el.classList.add('found');
      });
    }
  });
  // Mark selected cells
  state.selectedCells.forEach(s => {
    const el = document.querySelector(`.ws-cell[data-r="${s.r}"][data-c="${s.c}"]`);
    if (el) el.classList.add('selected');
  });
}

function submitWordsearch() {
  const state = GS.challengeState.wordsearch;
  const score = Math.round(100 * (state.foundWords.length / state.puzzle.words.length));
  GS.results.wordsearch = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('wordsearch', score);
    lsSet('daily-wordsearch-state-'+getDailyDateStr(), { foundWords: state.foundWords, totalWords: state.puzzle.words.length, words: state.puzzle.words, theme: state.puzzle.theme });
  }
  // Reveal unfound words
  state.puzzle.placements.forEach(p => {
    if (!state.foundWords.includes(p.word)) {
      p.cells.forEach(cl => {
        const el = document.querySelector(`.ws-cell[data-r="${cl.r}"][data-c="${cl.c}"]`);
        if (el && !el.classList.contains('found')) {
          el.style.background = 'rgba(231,76,60,0.15)';
          el.style.color = 'var(--red)';
          el.style.borderColor = 'var(--red)';
        }
      });
    }
  });
  // Disable further taps
  document.querySelectorAll('.ws-cell').forEach(cell => { cell.disabled = true; cell.style.pointerEvents = 'none'; cell.style.cursor = 'default'; });
  setTimeout(() => {
    if (!document.getElementById('game-container')) return;
    const allWords = state.puzzle.words;
    const foundSet = new Set(state.foundWords);
    const wordTags = allWords.map(w =>
      `<span class="cs-tag ${foundSet.has(w) ? 'found' : 'missed'}">${w}</span>`
    ).join(' ');
    showChallengeSummary({
      emoji: score === 100 ? '🔠' : '👍',
      score,
      title: score === 100 ? 'Perfect!' : 'Nice Try!',
      stats: [
        { label: 'Words found', value: `${state.foundWords.length} / ${allWords.length}` },
        { label: 'Theme', value: state.puzzle.theme }
      ],
      miniReview: wordTags
    });
  }, 500);
}

