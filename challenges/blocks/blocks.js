// ==================== CHALLENGE 1: LOGIC BLOCKS ====================
const BLOCKS_BANK = [
  // level 1 = everyday knowledge (easy+)
  {
    id:'recipe_bread', name:'Baking Bread', level:1,
    steps:['Mix flour, yeast, salt, and water','Knead the dough for 10 minutes','Let the dough rise for 1 hour','Punch down and shape the loaf','Let it rise again for 30 minutes','Preheat oven to 375°F','Bake for 30-35 minutes','Cool on a wire rack before slicing'],
    distractors:['Add baking soda and vinegar','Freeze the dough overnight']
  },
  {
    id:'cake_bake', name:'Baking a Cake', level:1,
    steps:['Preheat oven to 350°F','Cream butter and sugar together','Beat in eggs one at a time','Mix in vanilla extract','Combine dry ingredients separately','Alternate adding dry mix and milk to batter','Pour into greased pans','Bake for 25-30 minutes and cool before frosting'],
    distractors:['Add raw meat to the batter','Bake at 600°F for 5 minutes']
  },
  {
    id:'fire_build', name:'Building a Campfire', level:1,
    steps:['Clear the area and create a fire ring','Gather tinder (dry leaves, paper)','Collect kindling (small twigs)','Prepare fuel wood (larger logs)','Place tinder in the center','Arrange kindling in a teepee shape over tinder','Light the tinder','Gradually add larger pieces of fuel wood'],
    distractors:['Pour gasoline on everything','Start with the largest logs']
  },
  {
    id:'plant_grow', name:'Growing a Plant from Seed', level:1,
    steps:['Select appropriate seeds for the season','Prepare soil with nutrients','Plant seeds at the correct depth','Water the soil gently','Ensure adequate sunlight exposure','Thin seedlings once they sprout','Fertilize as plants grow','Harvest when mature'],
    distractors:['Plant seeds on concrete','Water with saltwater']
  },
  {
    id:'first_aid', name:'Treating a Minor Wound', level:1,
    steps:['Wash your hands thoroughly','Apply gentle pressure to stop bleeding','Clean the wound with clean water','Apply antibiotic ointment','Cover with a sterile bandage','Change the bandage daily','Watch for signs of infection','Seek medical care if it worsens'],
    distractors:['Apply dirt to the wound','Ignore it completely']
  },
  {
    id:'essay_write', name:'Writing an Essay', level:1,
    steps:['Understand the prompt or question','Research and gather sources','Create a thesis statement','Outline the main arguments','Write the introduction','Develop body paragraphs with evidence','Write the conclusion','Proofread and revise'],
    distractors:['Submit without reading it','Copy from the internet']
  },
  {
    id:'cpr_steps', name:'Performing CPR', level:1,
    steps:['Check the scene for safety','Check if the person is responsive','Call emergency services (911)','Place person on their back on a firm surface','Put heel of hand on center of chest','Push hard and fast (100-120 compressions/min)','Give 2 rescue breaths after 30 compressions','Continue until help arrives'],
    distractors:['Give the person water','Check their temperature first']
  },
  {
    id:'recycle', name:'Recycling Process', level:1,
    steps:['Consumer places item in recycling bin','Collection truck picks up recyclables','Materials transported to recycling facility','Items sorted by material type','Materials cleaned and processed','Processed into raw material form','Raw materials sold to manufacturers','New products created from recycled materials'],
    distractors:['Dump everything in landfill','Burn all materials']
  },
  {
    id:'laundry', name:'Doing Laundry', level:1,
    steps:['Sort clothes by color and fabric type','Check pockets for items','Load clothes into the washing machine','Add detergent','Select the wash cycle and temperature','Start the machine','Move clean clothes to the dryer','Fold and put away when dry'],
    distractors:['Wash everything in hot water','Add bleach to colored clothes']
  },
  {
    id:'make_sandwich', name:'Making a Sandwich', level:1,
    steps:['Gather bread, protein, and toppings','Lay out two slices of bread','Spread condiments on the bread','Add lettuce and tomato','Layer on the meat or protein','Add cheese if desired','Place the top slice of bread','Cut in half and serve'],
    distractors:['Toast the lettuce','Put ice cream inside']
  },
  {
    id:'brush_teeth', name:'Brushing Your Teeth', level:1,
    steps:['Wet your toothbrush','Apply toothpaste to the brush','Brush the outer surfaces of teeth','Brush the inner surfaces of teeth','Brush the chewing surfaces','Brush your tongue gently','Spit out the toothpaste','Rinse your mouth with water'],
    distractors:['Swallow the toothpaste','Use soap instead of toothpaste']
  },
  {
    id:'mail_letter', name:'Mailing a Letter', level:1,
    steps:['Write your letter or card','Fold it and place in an envelope','Seal the envelope','Write the recipient address in the center','Write your return address in the top left','Attach the correct postage stamp','Take it to a mailbox or post office','The postal service delivers it'],
    distractors:['Put the letter in the trash','Leave the envelope open']
  },
  {
    id:'morning_routine', name:'Getting Ready for School', level:1,
    steps:['Wake up when your alarm goes off','Get out of bed and stretch','Brush your teeth and wash your face','Get dressed in your clothes','Eat breakfast','Pack your backpack','Put on shoes and jacket','Head out the door'],
    distractors:['Go back to sleep','Skip breakfast and lunch']
  },
  {
    id:'flat_tire', name:'Changing a Flat Tire', level:1,
    steps:['Pull over to a safe, flat spot','Turn on hazard lights','Get the spare tire and jack from the trunk','Loosen the lug nuts slightly','Place the jack and raise the car','Remove the lug nuts and flat tire','Put on the spare tire','Lower the car and tighten the lug nuts'],
    distractors:['Keep driving on the flat','Remove the tire while the car is on the ground']
  },
  // level 2 = general knowledge (medium+)
  {
    id:'sci_method', name:'The Scientific Method', level:2,
    steps:['Observe a phenomenon','Form a question','Research existing knowledge','Formulate a hypothesis','Design and conduct an experiment','Analyze the data','Draw conclusions','Communicate results'],
    distractors:['Skip to publishing results','Choose the data that fits']
  },
  {
    id:'democracy_law', name:'How a Bill Becomes Law', level:2,
    steps:['A member of Congress introduces the bill','Bill is assigned to a committee','Committee reviews, amends, and votes','Bill goes to the full chamber for debate','Chamber votes on the bill','If passed, sent to the other chamber','Both chambers reconcile differences','President signs or vetoes the bill'],
    distractors:['The president writes the bill alone','Citizens vote directly on each bill']
  },
  {
    id:'startup_launch', name:'Launching a Startup', level:2,
    steps:['Identify a problem worth solving','Research the market and competitors','Build a minimum viable product (MVP)','Get feedback from early users','Iterate based on feedback','Develop a business model','Seek funding or revenue','Scale the product and team'],
    distractors:['Rent a large office immediately','Hire 50 employees before launch']
  },
  {
    id:'recipe_pasta', name:'Making Fresh Pasta', level:2,
    steps:['Mound flour on a clean surface','Create a well in the center','Crack eggs into the well','Beat eggs with a fork gradually mixing flour','Knead until smooth and elastic','Wrap in plastic and rest 30 minutes','Roll out thin with a rolling pin','Cut into desired shape and cook 2-3 minutes'],
    distractors:['Boil the flour first','Add yeast to make it rise']
  },
  {
    id:'photo_digital', name:'Taking a Great Photo', level:2,
    steps:['Assess the available light','Choose an interesting composition','Set appropriate camera settings','Focus on the subject','Check the background for distractions','Take the photo at the right moment','Review the image on screen','Post-process for color and exposure'],
    distractors:['Always use maximum zoom','Cover the lens with your finger']
  },
  {
    id:'chess_open', name:'A Standard Chess Opening', level:2,
    steps:['Control the center with a pawn move (e4 or d4)','Develop knights before bishops','Castle early to protect the king','Connect the rooks by developing all pieces','Avoid moving the same piece twice in opening','Don\'t bring the queen out too early','Establish pawn structure','Transition into the middlegame'],
    distractors:['Move the rook pawns first','Sacrifice the queen on move 2']
  },
  {
    id:'photo_process', name:'Developing Film Photography', level:2,
    steps:['Expose film to light through camera','Remove film from camera in darkroom','Submerge film in developer solution','Rinse in stop bath','Fix the image with fixer solution','Wash thoroughly with water','Hang to dry in dust-free area','Print onto photographic paper'],
    distractors:['Expose the film to sunlight','Scan the negative with a printer']
  },
  // level 3 = technical (hard/extreme only)
  {
    id:'algo_bubble', name:'Bubble Sort Algorithm', level:3,
    steps:['Start with an unsorted array','Compare adjacent elements','If left > right, swap them','Move to the next pair','Repeat until end of array','If any swaps occurred, restart from beginning','Array is now sorted'],
    distractors:['Divide the array in half','Pick a random pivot element']
  },
  {
    id:'algo_binary', name:'Binary Search', level:3,
    steps:['Start with a sorted array','Set low=0 and high=length-1','Calculate mid = (low+high)/2','Compare target with array[mid]','If equal, return mid','If target < array[mid], set high=mid-1','If target > array[mid], set low=mid+1','Repeat until low > high'],
    distractors:['Sort the array first','Swap low and high pointers']
  },
  {
    id:'algo_dijkstra', name:'Dijkstra\'s Shortest Path', level:3,
    steps:['Set distance to source as 0, all others as infinity','Add all nodes to unvisited set','Pick unvisited node with smallest distance','For each neighbor, calculate tentative distance','If tentative distance < current, update it','Mark current node as visited','Repeat until destination is visited or set is empty'],
    distractors:['Sort all edges by weight first','Remove the longest edge']
  },
  {
    id:'web_request', name:'HTTP Request Lifecycle', level:3,
    steps:['User enters URL in browser','Browser performs DNS lookup','TCP connection established (3-way handshake)','Browser sends HTTP request','Server processes the request','Server sends HTTP response','Browser parses HTML','Browser renders the page'],
    distractors:['Browser compiles the JavaScript to machine code','Server sends email notification']
  },
  {
    id:'compile_run', name:'Compiling & Running Code', level:3,
    steps:['Write source code in a text editor','Save the file with correct extension','Run the preprocessor (if applicable)','Compile source code to object code','Link object code with libraries','Generate executable binary','Load executable into memory','CPU executes the instructions'],
    distractors:['Email the code to the compiler','Print the code on paper first']
  },
  {
    id:'git_workflow', name:'Git Feature Branch Workflow', level:3,
    steps:['Pull latest changes from main branch','Create a new feature branch','Write code and make changes','Stage changes with git add','Commit with a descriptive message','Push branch to remote','Open a pull request for review','Merge into main after approval'],
    distractors:['Delete the main branch','Force push directly to production']
  },
  {
    id:'algo_merge', name:'Merge Sort', level:3,
    steps:['If array has one element, it is sorted','Divide the array into two halves','Recursively sort the left half','Recursively sort the right half','Create an empty result array','Compare front elements of both halves','Add the smaller element to result','Repeat until all elements are merged'],
    distractors:['Swap random elements','Sort each element individually']
  },
  {
    id:'debug_process', name:'Debugging a Program', level:3,
    steps:['Reproduce the bug consistently','Read the error message carefully','Identify the relevant code section','Add logging or use a debugger','Form a hypothesis about the cause','Test the hypothesis with a fix','Verify the fix doesn\'t break other things','Document what caused the bug'],
    distractors:['Delete all the code','Restart the computer repeatedly']
  },
  {
    id:'ml_pipeline', name:'Machine Learning Pipeline', level:3,
    steps:['Define the problem and success metric','Collect and clean the dataset','Perform exploratory data analysis','Split data into train/validation/test sets','Select and train a model','Tune hyperparameters on validation set','Evaluate on the test set','Deploy the model to production'],
    distractors:['Test on the training data','Skip data cleaning']
  },
  {
    id:'tcp_handshake', name:'TCP Three-Way Handshake', level:3,
    steps:['Client sends SYN packet to server','Server receives SYN','Server sends SYN-ACK packet back','Client receives SYN-ACK','Client sends ACK packet','Server receives ACK','Connection is established','Data transfer begins'],
    distractors:['Client sends data before connecting','Server ignores all packets']
  },
];

function getBlocksPuzzle() {
  const diff = GS.difficulty;
  const maxLevel = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;
  const pool = BLOCKS_BANK.filter(b => b.level <= maxLevel);
  const template = rngPick(pool);
  let numBlocks, numDistractors;
  switch(diff) {
    case 'easy': numBlocks = 4; numDistractors = 0; break;
    case 'medium': numBlocks = rngInt(5,6); numDistractors = 0; break;
    case 'hard': numBlocks = rngInt(6,7); numDistractors = 1; break;
    case 'extreme': numBlocks = rngInt(7,8); numDistractors = 2; break;
    case 'impossible': numBlocks = 8; numDistractors = 2; break;
  }
  numBlocks = Math.min(numBlocks, template.steps.length);
  // Pick a contiguous subsequence or spread
  const steps = template.steps.slice(0, numBlocks);
  const correctOrder = [...steps];
  let allBlocks = [...steps];
  // Add distractors
  const distractors = rngShuffle(template.distractors).slice(0, numDistractors);
  allBlocks.push(...distractors);
  // Shuffle
  const shuffled = rngShuffle(allBlocks);
  return {
    name: template.name,
    blocks: shuffled,
    correctOrder,
    distractors
  };
}

function renderBlocks(puzzle) {
  GS.challengeState.blocks = {
    puzzle,
    currentOrder: [...puzzle.blocks],
    attempts: 0,
    swapSelected: null,
    submitted: false
  };
  const c = document.getElementById('game-container');
  let html = `<div style="margin-bottom:12px"><strong>${puzzle.name}</strong></div>`;
  html += `<div class="blocks-container" id="blocks-container">`;
  puzzle.blocks.forEach((text, i) => {
    html += `<div class="block-item" draggable="true" data-idx="${i}" onclick="tapBlock(${i})">
      <span class="block-handle">⠿</span>
      <span class="block-num">${i+1}</span>
      <span class="block-text">${text}</span>
    </div>`;
  });
  html += `</div>`;
  html += `<div id="blocks-feedback" style="margin-top:8px"></div>`;
  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'inline-flex';
  setupBlocksDragDrop();
}

function setupBlocksDragDrop() {
  const container = document.getElementById('blocks-container');
  if (!container) return;
  // Desktop HTML5 drag-and-drop
  let dragIdx = null;
  container.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.block-item');
    if (!item) return;
    dragIdx = parseInt(item.dataset.idx);
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  container.addEventListener('dragend', (e) => {
    const item = e.target.closest('.block-item');
    if (item) item.classList.remove('dragging');
    document.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over'));
  });
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const item = e.target.closest('.block-item');
    if (item) {
      document.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over'));
      item.classList.add('drag-over');
    }
  });
  container.addEventListener('drop', (e) => {
    e.preventDefault();
    const item = e.target.closest('.block-item');
    if (!item || dragIdx === null) return;
    const dropIdx = parseInt(item.dataset.idx);
    if (dragIdx !== dropIdx) swapBlocks(dragIdx, dropIdx);
    document.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over','dragging'));
    dragIdx = null;
  });
  // Mobile touch drag-and-drop
  const ts = {idx:-1, ghost:null, moved:false, sx:0, sy:0};
  function onTouchMove(e) {
    const t = e.touches[0];
    if (!ts.moved && Math.abs(t.clientX - ts.sx) + Math.abs(t.clientY - ts.sy) > 10) {
      ts.moved = true;
      const src = container.querySelectorAll('.block-item')[ts.idx];
      ts.ghost = src.cloneNode(true);
      ts.ghost.className = 'block-item block-drag-ghost';
      const w = src.offsetWidth;
      ts.ghost.style.width = w + 'px';
      ts.gw = w / 2; ts.gh = 0;
      document.body.appendChild(ts.ghost);
      ts.gh = ts.ghost.offsetHeight / 2;
      src.classList.add('dragging');
    }
    if (ts.moved && ts.ghost) {
      e.preventDefault();
      ts.ghost.style.transform = `translate(${t.clientX - ts.gw}px,${t.clientY - ts.gh}px)`;
      ts.ghost.style.left = '0'; ts.ghost.style.top = '0';
      container.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over'));
      ts.ghost.style.pointerEvents = 'none';
      const under = document.elementFromPoint(t.clientX, t.clientY);
      ts.ghost.style.pointerEvents = '';
      if (under) {
        const bi = under.closest('.block-item');
        if (bi) bi.classList.add('drag-over');
      }
    }
  }
  function onTouchEnd(e) {
    if (ts.moved && ts.ghost) {
      const t = e.changedTouches[0];
      ts.ghost.style.pointerEvents = 'none';
      const under = document.elementFromPoint(t.clientX, t.clientY);
      ts.ghost.remove();
      ts.ghost = null;
      container.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over','dragging'));
      if (under) {
        const bi = under.closest('.block-item');
        if (bi) {
          const dropIdx = parseInt(bi.dataset.idx);
          if (ts.idx !== dropIdx) swapBlocks(ts.idx, dropIdx);
        }
      }
    }
    ts.idx = -1; ts.moved = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }
  container.querySelectorAll('.block-item').forEach((el, i) => {
    el.addEventListener('touchstart', (e) => {
      if (GS.challengeState.blocks.submitted) return;
      ts.idx = parseInt(el.dataset.idx); ts.moved = false;
      ts.sx = e.touches[0].clientX; ts.sy = e.touches[0].clientY;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.addEventListener('touchmove', onTouchMove, {passive:false});
      document.addEventListener('touchend', onTouchEnd);
    }, {passive:true});
  });
}

// Tap-to-swap
function tapBlock(idx) {
  const state = GS.challengeState.blocks;
  if (state.submitted) return;
  if (state.swapSelected === null) {
    state.swapSelected = idx;
    updateBlocksUI();
  } else if (state.swapSelected === idx) {
    state.swapSelected = null;
    updateBlocksUI();
  } else {
    swapBlocks(state.swapSelected, idx);
    state.swapSelected = null;
  }
}

function swapBlocks(a, b) {
  const state = GS.challengeState.blocks;
  const arr = state.currentOrder;
  [arr[a], arr[b]] = [arr[b], arr[a]];
  updateBlocksUI();
}

function updateBlocksUI() {
  const state = GS.challengeState.blocks;
  const container = document.getElementById('blocks-container');
  container.innerHTML = '';
  state.currentOrder.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'block-item' + (state.swapSelected === i ? ' selected-swap' : '');
    if (state.puzzle.distractors.includes(text)) div.classList.add('distractor');
    div.draggable = true;
    div.dataset.idx = i;
    div.onclick = () => tapBlock(i);
    div.innerHTML = `<span class="block-handle">⠿</span><span class="block-num">${i+1}</span><span class="block-text">${text}</span>`;
    container.appendChild(div);
  });
  setupBlocksDragDrop();
}

function submitBlocks() {
  const state = GS.challengeState.blocks;
  state.attempts++;
  // Remove distractors from user order, check against correct
  const userOrder = state.currentOrder.filter(t => !state.puzzle.distractors.includes(t));
  const correct = state.puzzle.correctOrder;
  let allCorrect = userOrder.length === correct.length;
  if (allCorrect) {
    for (let i = 0; i < correct.length; i++) {
      if (userOrder[i] !== correct[i]) { allCorrect = false; break; }
    }
  }
  // Check distractors are not interspersed (they should be separate)
  // Actually, user just needs correct order of non-distractors. Distractors can be anywhere.
  if (allCorrect) {
    state.submitted = true;
    const score = Math.max(0, 100 - (state.attempts - 1) * 15);
    GS.results.blocks = score;
    if (GS.mode === 'daily') {
      setDailyCompletion('blocks', score);
      lsSet('daily-blocks-state-'+getDailyDateStr(), { attempts: state.attempts, correctOrder: state.puzzle.correctOrder, puzzleName: state.puzzle.name });
    }
    // Highlight correct
    const container = document.getElementById('blocks-container');
    container.querySelectorAll('.block-item').forEach(b => {
      b.style.borderColor = 'var(--green)';
      b.style.background = 'rgba(106,170,100,0.1)';
    });
    setTimeout(() => {
      if (!document.getElementById('game-container')) return;
      const emoji = state.attempts === 1 ? '🏆' : state.attempts <= 3 ? '🎉' : '✅';
      const distractorCount = state.puzzle.distractors ? state.puzzle.distractors.length : 0;
      const stats = [
        { label: 'Attempts', value: state.attempts },
        { label: 'Steps', value: state.puzzle.correctOrder.length }
      ];
      if (distractorCount > 0) stats.push({ label: 'Distractors', value: distractorCount });
      showChallengeSummary({
        emoji,
        score,
        title: state.attempts === 1 ? 'Perfect Order!' : 'Correct!',
        stats
      });
    }, 500);
  } else {
    // Shake
    const container = document.getElementById('blocks-container');
    container.style.animation = 'shake 0.4s';
    setTimeout(() => container.style.animation = '', 400);
    document.getElementById('blocks-feedback').innerHTML = `<div style="color:var(--red)">Not quite right. Try again! (Attempt ${state.attempts})</div>`;
  }
}

