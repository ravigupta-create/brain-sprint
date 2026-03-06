// ==================== CHALLENGE 7: NUMBER GRID ====================

function generateNumgridSolution(size, boxR, boxC) {
  const grid = Array.from({length: size}, () => Array(size).fill(0));
  const digits = [];
  for (let d = 1; d <= size; d++) digits.push(d);

  function isValid(r, c, num) {
    for (let i = 0; i < size; i++) {
      if (grid[r][i] === num || grid[i][c] === num) return false;
    }
    const br = Math.floor(r / boxR) * boxR, bc = Math.floor(c / boxC) * boxC;
    for (let dr = 0; dr < boxR; dr++)
      for (let dc = 0; dc < boxC; dc++)
        if (grid[br + dr][bc + dc] === num) return false;
    return true;
  }

  function fill(pos) {
    if (pos === size * size) return true;
    const r = Math.floor(pos / size), c = pos % size;
    const order = rngShuffle(digits);
    for (const num of order) {
      if (isValid(r, c, num)) {
        grid[r][c] = num;
        if (fill(pos + 1)) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  }

  fill(0);
  return grid;
}

function hasNumgridUniqueSolution(puzzle, size, boxR, boxC) {
  const grid = puzzle.map(r => [...r]);
  let count = 0;

  function isValid(r, c, num) {
    for (let i = 0; i < size; i++) {
      if (grid[r][i] === num || grid[i][c] === num) return false;
    }
    const br = Math.floor(r / boxR) * boxR, bc = Math.floor(c / boxC) * boxC;
    for (let dr = 0; dr < boxR; dr++)
      for (let dc = 0; dc < boxC; dc++)
        if (grid[br + dr][bc + dc] === num) return false;
    return true;
  }

  function solve(pos) {
    if (count > 1) return;
    while (pos < size * size && grid[Math.floor(pos / size)][pos % size] !== 0) pos++;
    if (pos === size * size) { count++; return; }
    const r = Math.floor(pos / size), c = pos % size;
    for (let num = 1; num <= size; num++) {
      if (isValid(r, c, num)) {
        grid[r][c] = num;
        solve(pos + 1);
        grid[r][c] = 0;
      }
    }
  }

  solve(0);
  return count === 1;
}

function removeNumgridCells(solution, size, boxR, boxC, reveal) {
  const puzzle = solution.map(r => [...r]);
  const total = size * size;
  const toRemove = total - reveal;
  const positions = rngShuffle(Array.from({length: total}, (_, i) => i));
  let removed = 0;
  const checkUnique = size <= 6;

  for (const pos of positions) {
    if (removed >= toRemove) break;
    const r = Math.floor(pos / size), c = pos % size;
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    if (checkUnique && !hasNumgridUniqueSolution(puzzle, size, boxR, boxC)) {
      puzzle[r][c] = backup;
    } else {
      removed++;
    }
  }
  return puzzle;
}

function getNumgridPuzzle() {
  const diff = GS.difficulty;
  let size, boxR, boxC, reveal;
  if (diff === 'easy')    { size = 4; boxR = 2; boxC = 2; reveal = 10; }
  else if (diff === 'medium') { size = 6; boxR = 2; boxC = 3; reveal = 18; }
  else if (diff === 'hard')   { size = 9; boxR = 3; boxC = 3; reveal = 28; }
  else                        { size = 9; boxR = 3; boxC = 3; reveal = 23; }

  const solution = generateNumgridSolution(size, boxR, boxC);
  const puzzle = removeNumgridCells(solution, size, boxR, boxC, reveal);
  return { puzzle, solution, size, boxR, boxC };
}

function renderNumgrid(data) {
  const { puzzle, solution, size, boxR, boxC } = data;
  GS.challengeState = {
    puzzle: puzzle.map(r => [...r]),
    solution,
    grid: puzzle.map(r => [...r]),
    size, boxR, boxC,
    selectedR: -1, selectedC: -1,
    attempts: 0
  };

  const c = document.getElementById('game-container');
  const ngCellSize = Math.min(38, Math.floor((Math.min(window.innerWidth, 600) - 40) / size));
  let html = `<div style="text-align:center">`;
  html += `<div class="numgrid-board" style="grid-template-columns:repeat(${size},${ngCellSize}px)">`;
  for (let r = 0; r < size; r++) {
    for (let col = 0; col < size; col++) {
      const given = puzzle[r][col] !== 0;
      const val = puzzle[r][col] || '';
      let cls = 'ng-cell';
      if (given) cls += ' ng-given';
      // Box borders
      if ((col + 1) % boxC === 0 && col < size - 1) cls += ' ng-box-right';
      if ((r + 1) % boxR === 0 && r < size - 1) cls += ' ng-box-bottom';
      html += `<div class="${cls}" data-r="${r}" data-c="${col}" onclick="tapNumgridCell(${r},${col})">${val}</div>`;
    }
  }
  html += `</div>`;
  html += `<div class="numgrid-pad">`;
  for (let d = 1; d <= size; d++) {
    html += `<button onclick="numgridInput(${d})">${d}</button>`;
  }
  html += `<button class="ng-pad-clear" onclick="numgridInput(0)">Clear</button>`;
  html += `</div>`;
  html += `</div>`;
  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'inline-flex';

  // Keyboard support — cleanup old handler first
  if (GS.challengeState._keyHandler) document.removeEventListener('keydown', GS.challengeState._keyHandler);
  GS.challengeState._keyHandler = (e) => {
    const num = parseInt(e.key);
    if (num >= 1 && num <= size) numgridInput(num);
    else if (e.key === 'Backspace' || e.key === 'Delete') numgridInput(0);
    else if (e.key === 'ArrowUp' && GS.challengeState.selectedR > 0) tapNumgridCell(GS.challengeState.selectedR - 1, GS.challengeState.selectedC);
    else if (e.key === 'ArrowDown' && GS.challengeState.selectedR < size - 1) tapNumgridCell(GS.challengeState.selectedR + 1, GS.challengeState.selectedC);
    else if (e.key === 'ArrowLeft' && GS.challengeState.selectedC > 0) tapNumgridCell(GS.challengeState.selectedR, GS.challengeState.selectedC - 1);
    else if (e.key === 'ArrowRight' && GS.challengeState.selectedC < size - 1) tapNumgridCell(GS.challengeState.selectedR, GS.challengeState.selectedC + 1);
  };
  document.addEventListener('keydown', GS.challengeState._keyHandler);
  initNumgridDragDrop();
}

function tapNumgridCell(r, c) {
  const st = GS.challengeState;
  if (st.puzzle[r][c] !== 0) return; // given cell
  st.selectedR = r;
  st.selectedC = c;
  updateNumgridUI();
}

function numgridInput(num) {
  const st = GS.challengeState;
  if (st.selectedR < 0) return;
  st.grid[st.selectedR][st.selectedC] = num;
  updateNumgridUI();
}

function updateNumgridUI() {
  const st = GS.challengeState;
  const cells = document.querySelectorAll('.ng-cell');
  cells.forEach(cell => {
    const r = +cell.dataset.r, c = +cell.dataset.c;
    cell.classList.remove('ng-selected', 'ng-error', 'ng-correct');
    if (r === st.selectedR && c === st.selectedC) cell.classList.add('ng-selected');
    cell.textContent = st.grid[r][c] || '';
  });
}

function initNumgridDragDrop() {
  const st = GS.challengeState;
  const padBtns = document.querySelectorAll('.numgrid-pad button:not(.ng-pad-clear)');
  // Desktop HTML5 drag
  padBtns.forEach(btn => {
    btn.setAttribute('draggable', 'true');
    btn.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', btn.textContent);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });
  document.querySelectorAll('.ng-cell:not(.ng-given)').forEach(cell => {
    cell.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; cell.classList.add('ng-drop-target'); });
    cell.addEventListener('dragleave', () => cell.classList.remove('ng-drop-target'));
    cell.addEventListener('drop', e => {
      e.preventDefault();
      cell.classList.remove('ng-drop-target');
      const num = parseInt(e.dataTransfer.getData('text/plain'));
      if (num >= 1 && num <= st.size) {
        const r = +cell.dataset.r, c = +cell.dataset.c;
        st.selectedR = r; st.selectedC = c;
        st.grid[r][c] = num;
        updateNumgridUI();
      }
    });
  });
  // Mobile touch drag
  const ts = {val:0, ghost:null, moved:false, sx:0, sy:0};
  function onTouchMove(e) {
    const t = e.touches[0];
    if (!ts.moved && Math.abs(t.clientX - ts.sx) + Math.abs(t.clientY - ts.sy) > 10) {
      ts.moved = true;
      ts.ghost = document.createElement('div');
      ts.ghost.className = 'ng-drag-ghost';
      ts.ghost.textContent = ts.val;
      document.body.appendChild(ts.ghost);
    }
    if (ts.moved && ts.ghost) {
      e.preventDefault();
      ts.ghost.style.left = (t.clientX - 21) + 'px';
      ts.ghost.style.top = (t.clientY - 21) + 'px';
      document.querySelectorAll('.ng-cell.ng-drop-target').forEach(el => el.classList.remove('ng-drop-target'));
      ts.ghost.style.pointerEvents = 'none';
      const under = document.elementFromPoint(t.clientX, t.clientY);
      if (under) { const nc = under.closest('.ng-cell:not(.ng-given)'); if (nc) nc.classList.add('ng-drop-target'); }
    }
  }
  function onTouchEnd(e) {
    if (ts.moved && ts.ghost) {
      const t = e.changedTouches[0];
      ts.ghost.style.pointerEvents = 'none';
      const under = document.elementFromPoint(t.clientX, t.clientY);
      ts.ghost.remove(); ts.ghost = null;
      document.querySelectorAll('.ng-cell.ng-drop-target').forEach(el => el.classList.remove('ng-drop-target'));
      if (under) {
        const nc = under.closest('.ng-cell:not(.ng-given)');
        if (nc) {
          const r = +nc.dataset.r, c = +nc.dataset.c;
          st.selectedR = r; st.selectedC = c;
          st.grid[r][c] = ts.val;
          updateNumgridUI();
        }
      }
    }
    ts.val = 0; ts.moved = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }
  padBtns.forEach(btn => {
    btn.addEventListener('touchstart', e => {
      const t = e.touches[0];
      ts.val = parseInt(btn.textContent);
      ts.sx = t.clientX; ts.sy = t.clientY; ts.moved = false;
      document.addEventListener('touchmove', onTouchMove, {passive:false});
      document.addEventListener('touchend', onTouchEnd);
    }, {passive:true});
  });
}

function submitNumgrid() {
  const st = GS.challengeState;
  // Check if all cells filled
  for (let r = 0; r < st.size; r++)
    for (let c = 0; c < st.size; c++)
      if (st.grid[r][c] === 0) { showToast('Fill in all cells first'); return; }

  st.attempts++;
  // Check against solution
  let correct = true;
  const cells = document.querySelectorAll('.ng-cell');
  cells.forEach(cell => {
    const r = +cell.dataset.r, c = +cell.dataset.c;
    cell.classList.remove('ng-error', 'ng-correct');
    if (st.grid[r][c] === st.solution[r][c]) {
      cell.classList.add('ng-correct');
    } else {
      cell.classList.add('ng-error');
      correct = false;
    }
  });

  if (correct) {
    const score = Math.max(0, 100 - (st.attempts - 1) * 20);
    if (GS.challengeState._keyHandler) document.removeEventListener('keydown', GS.challengeState._keyHandler);
    GS.results.numgrid = score;
    if (GS.mode === 'daily') {
      setDailyCompletion('numgrid', score);
      lsSet('daily-numgrid-state-'+getDailyDateStr(), { attempts: st.attempts, size: st.size });
    }
    setTimeout(() => {
      if (!document.getElementById('game-container')) return;
      showChallengeSummary({
        emoji: st.attempts === 1 ? '🏆' : st.attempts <= 3 ? '🎉' : '✅',
        score,
        title: st.attempts === 1 ? 'First Try!' : 'Solved!',
        stats: [
          { label: 'Attempts', value: st.attempts },
          { label: 'Grid size', value: `${st.size}×${st.size}` }
        ]
      });
    }, 500);
  } else {
    showToast('Some cells are incorrect — try again!');
  }
}

