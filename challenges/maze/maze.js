// ==================== CHALLENGE 12: MAZE RUNNER ====================

function getMazePuzzle() {
  const d = GS.difficulty;
  const configs = {
    easy:    { rows: 7,  cols: 7,  timeBonus: 30 },
    medium:  { rows: 11, cols: 11, timeBonus: 45 },
    hard:    { rows: 15, cols: 15, timeBonus: 60 },
    extreme: { rows: 19, cols: 19, timeBonus: 90 }
  };
  const cfg = configs[d] || configs.medium;
  const walls = generateMaze(cfg.rows, cfg.cols);
  const optimal = solveMaze(walls, cfg.rows, cfg.cols);
  return { ...cfg, walls, optimalLen: optimal.length };
}

function generateMaze(rows, cols) {
  // Recursive backtracker — produces a perfect maze
  // walls[r][c] = { top, right, bottom, left } — all start true
  const walls = [];
  for (let r = 0; r < rows; r++) {
    walls[r] = [];
    for (let c = 0; c < cols; c++) {
      walls[r][c] = { top: true, right: true, bottom: true, left: true };
    }
  }
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const dirs = [[-1,0,'top','bottom'],[0,1,'right','left'],[1,0,'bottom','top'],[0,-1,'left','right']];

  function carve(r, c) {
    visited[r][c] = true;
    const shuffled = rngShuffle([0,1,2,3]);
    for (const di of shuffled) {
      const [dr, dc, wall, opp] = dirs[di];
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        walls[r][c][wall] = false;
        walls[nr][nc][opp] = false;
        carve(nr, nc);
      }
    }
  }
  carve(0, 0);
  return walls;
}

function solveMaze(walls, rows, cols) {
  // BFS from (0,0) to (rows-1,cols-1)
  const dirs = [[-1,0,'top'],[0,1,'right'],[1,0,'bottom'],[0,-1,'left']];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [[0, 0, [{r:0,c:0}]]];
  visited[0][0] = true;

  while (queue.length > 0) {
    const [r, c, path] = queue.shift();
    if (r === rows - 1 && c === cols - 1) return path;
    for (const [dr, dc, wall] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && !walls[r][c][wall]) {
        visited[nr][nc] = true;
        queue.push([nr, nc, [...path, {r:nr,c:nc}]]);
      }
    }
  }
  return [{r:0,c:0}]; // fallback
}

function renderMaze(puzzle) {
  const c = document.getElementById('game-container');
  document.getElementById('btn-submit-challenge').style.display = 'none';

  const cellSize = Math.min(Math.floor((Math.min(window.innerWidth, 600) - 48) / puzzle.cols), 36);

  GS.challengeState.maze = {
    puzzle, playerR: 0, playerC: 0, steps: 0,
    visited: Array.from({ length: puzzle.rows }, () => Array(puzzle.cols).fill(false)),
    startTime: Date.now(), finished: false
  };
  GS.challengeState.maze.visited[0][0] = true;

  let html = `<div style="padding:8px 0">`;
  html += `<div class="maze-stats"><span id="maze-steps">Steps: 0</span><span id="maze-optimal">Optimal: ${puzzle.optimalLen - 1}</span></div>`;
  html += `<div class="maze-grid" id="maze-grid" style="grid-template-columns:repeat(${puzzle.cols},${cellSize}px);grid-auto-rows:${cellSize}px">`;
  for (let r = 0; r < puzzle.rows; r++) {
    for (let cc = 0; cc < puzzle.cols; cc++) {
      const w = puzzle.walls[r][cc];
      let cls = 'maze-cell';
      if (w.top) cls += ' wall-top';
      if (w.left) cls += ' wall-left';
      // Only render right/bottom on outer edges to avoid doubling with adjacent cell
      if (cc === puzzle.cols - 1 && w.right) cls += ' wall-right';
      if (r === puzzle.rows - 1 && w.bottom) cls += ' wall-bottom';
      // Fill 2x2 corner gap at top-left where adjacent walls meet but this cell has no border
      if (r > 0 && cc > 0 && !w.top && !w.left &&
          puzzle.walls[r-1][cc].left && puzzle.walls[r][cc-1].top) {
        cls += ' corner-tl';
      }
      if (r === 0 && cc === 0) cls += ' player visited';
      if (r === puzzle.rows - 1 && cc === puzzle.cols - 1) cls += ' goal';
      let content = '';
      if (r === 0 && cc === 0) content = '●';
      if (r === puzzle.rows - 1 && cc === puzzle.cols - 1) content = '🏁';
      html += `<div class="${cls}" id="mz-${r}-${cc}">${content}</div>`;
    }
  }
  html += `</div>`;
  html += `<div class="maze-dpad">`;
  html += `<div></div><button onclick="moveMazePlayer(-1,0)">↑</button><div></div>`;
  html += `<button onclick="moveMazePlayer(0,-1)">←</button><div></div><button onclick="moveMazePlayer(0,1)">→</button>`;
  html += `<div></div><button onclick="moveMazePlayer(1,0)">↓</button><div></div>`;
  html += `</div></div>`;
  c.innerHTML = html;

  // Keyboard handler — cleanup old handler first
  if (GS.challengeState.maze && GS.challengeState.maze._keyHandler) document.removeEventListener('keydown', GS.challengeState.maze._keyHandler);
  const keyHandler = (e) => {
    if (GS.challengeState.maze.finished) return;
    let dr = 0, dc = 0;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { dr = -1; }
    else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { dr = 1; }
    else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { dc = -1; }
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { dc = 1; }
    else return;
    e.preventDefault();
    moveMazePlayer(dr, dc);
  };
  document.addEventListener('keydown', keyHandler);
  GS.challengeState.maze._keyHandler = keyHandler;

  // Touch/swipe handler
  const grid = document.getElementById('maze-grid');
  let touchStartX = 0, touchStartY = 0;
  grid.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  grid.addEventListener('touchend', (e) => {
    if (GS.challengeState.maze.finished) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      moveMazePlayer(0, dx > 0 ? 1 : -1);
    } else {
      moveMazePlayer(dy > 0 ? 1 : -1, 0);
    }
  }, { passive: true });
}

function moveMazePlayer(dr, dc) {
  const st = GS.challengeState.maze;
  if (st.finished) return;
  const p = st.puzzle;
  const nr = st.playerR + dr, nc = st.playerC + dc;

  // Check bounds
  if (nr < 0 || nr >= p.rows || nc < 0 || nc >= p.cols) {
    const grid = document.getElementById('maze-grid');
    if (grid) { grid.classList.remove('shake'); void grid.offsetWidth; grid.classList.add('shake'); }
    return;
  }

  // Check wall
  const wallDir = dr === -1 ? 'top' : dr === 1 ? 'bottom' : dc === -1 ? 'left' : 'right';
  if (p.walls[st.playerR][st.playerC][wallDir]) {
    const grid = document.getElementById('maze-grid');
    if (grid) { grid.classList.remove('shake'); void grid.offsetWidth; grid.classList.add('shake'); }
    return;
  }

  // Move
  const oldCell = document.getElementById(`mz-${st.playerR}-${st.playerC}`);
  if (oldCell) { oldCell.classList.remove('player'); oldCell.textContent = ''; }

  st.playerR = nr;
  st.playerC = nc;
  st.steps++;
  st.visited[nr][nc] = true;

  updateMazeVisuals();

  document.getElementById('maze-steps').textContent = `Steps: ${st.steps}`;

  // Check goal
  if (nr === p.rows - 1 && nc === p.cols - 1) {
    endMazeGame();
  }
}

function updateMazeVisuals() {
  const st = GS.challengeState.maze;
  const p = st.puzzle;
  for (let r = 0; r < p.rows; r++) {
    for (let c = 0; c < p.cols; c++) {
      const cell = document.getElementById(`mz-${r}-${c}`);
      if (!cell) continue;
      cell.classList.toggle('visited', st.visited[r][c]);
      cell.classList.toggle('player', r === st.playerR && c === st.playerC);
      if (r === st.playerR && c === st.playerC) {
        cell.textContent = '●';
      } else if (r === p.rows - 1 && c === p.cols - 1) {
        cell.textContent = '🏁';
      } else {
        cell.textContent = '';
      }
    }
  }
}

function endMazeGame() {
  const st = GS.challengeState.maze;
  st.finished = true;
  if (st._keyHandler) { document.removeEventListener('keydown', st._keyHandler); st._keyHandler = null; }

  const elapsed = (Date.now() - st.startTime) / 1000;
  const optimalSteps = st.puzzle.optimalLen - 1;
  const pathEff = Math.min(1, optimalSteps / st.steps) * 85;
  const timeBonus = elapsed < st.puzzle.timeBonus ? Math.round((1 - elapsed / st.puzzle.timeBonus) * 15) : 0;
  const score = Math.min(100, Math.round(pathEff + timeBonus));

  GS.results.maze = score;
  if (GS.mode === 'daily') {
    setDailyCompletion('maze', score);
    lsSet('daily-maze-state-'+getDailyDateStr(), { steps: st.steps, optimalSteps, elapsed: +elapsed.toFixed(1), score, pathEff: Math.round(pathEff), timeBonus });
  }

  setTimeout(() => {
    if (!document.getElementById('game-container')) return;
    showChallengeSummary({
      emoji: score >= 80 ? '🌟' : score >= 50 ? '🌀' : '😵',
      score,
      title: score >= 80 ? 'Speed Runner!' : score >= 50 ? 'Escaped!' : 'Lost in the Maze',
      stats: [
        { label: 'Steps', value: `${st.steps} (optimal: ${optimalSteps})` },
        { label: 'Time', value: `${elapsed.toFixed(1)}s` },
        { label: 'Path efficiency', value: `${Math.round(pathEff)} pts` },
        { label: 'Time bonus', value: `${timeBonus} pts` }
      ]
    });
  }, 400);
}

