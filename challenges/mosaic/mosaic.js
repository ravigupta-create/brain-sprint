// ==================== CHALLENGE 13: MOSAIC ====================

const MOSAIC_ZONE_COLORS = [
  {bg:'rgba(99,102,241,0.12)',border:'#6366f1'},
  {bg:'rgba(236,72,153,0.12)',border:'#ec4899'},
  {bg:'rgba(34,197,94,0.12)',border:'#22c55e'},
  {bg:'rgba(245,158,11,0.12)',border:'#f59e0b'},
  {bg:'rgba(139,92,246,0.12)',border:'#8b5cf6'},
  {bg:'rgba(20,184,166,0.12)',border:'#14b8a6'},
  {bg:'rgba(244,63,94,0.12)',border:'#f43f5e'},
  {bg:'rgba(59,130,246,0.12)',border:'#3b82f6'}
];

let mosaicState = null;

function getMosaicPuzzle() {
  const diff = GS.difficulty || 'easy';
  const cfg = {
    easy:    {rows:3,cols:4,valueRange:4,ruleTypes:['sum','same'],par:60,linkedPairs:0},
    medium:  {rows:4,cols:4,valueRange:5,ruleTypes:['sum','same','different'],par:90,linkedPairs:2},
    hard:    {rows:4,cols:5,valueRange:6,ruleTypes:['sum','same','different','ascending'],par:120,linkedPairs:3},
    extreme: {rows:5,cols:5,valueRange:6,ruleTypes:['sum','same','different','ascending'],par:150,linkedPairs:4}
  }[diff];
  const {rows,cols,valueRange,ruleTypes,par,linkedPairs} = cfg;
  const zones = partitionMosaicGrid(rows, cols);
  // Build solution grid
  const solutionGrid = Array.from({length:rows}, () => Array(cols).fill(null));
  zones.forEach(zone => {
    const vals = generateMosaicZoneValues(zone, valueRange, ruleTypes);
    zone.solutionValues = vals.values;
    zone.rule = vals.rule;
    zone.ruleDisplay = vals.ruleDisplay;
    vals.values.forEach((v, i) => {
      const cell = zone.cells[i];
      solutionGrid[cell.r][cell.c] = v;
    });
  });
  // Build zone lookup for adjacency checks
  const zoneMap = Array.from({length:rows}, () => Array(cols).fill(-1));
  zones.forEach((z, zi) => z.cells.forEach(cell => zoneMap[cell.r][cell.c] = zi));
  // Find linked pairs: adjacent cells in the same zone
  const pairedCells = new Set();
  const pairs = [];
  if (linkedPairs > 0) {
    const candidates = [];
    for (let r = 0; r < rows; r++) {
      for (let c2 = 0; c2 < cols; c2++) {
        // Check right neighbor
        if (c2 + 1 < cols && zoneMap[r][c2] === zoneMap[r][c2+1]) {
          candidates.push({r1:r,c1:c2,r2:r,c2:c2+1});
        }
        // Check bottom neighbor
        if (r + 1 < rows && zoneMap[r][c2] === zoneMap[r+1][c2]) {
          candidates.push({r1:r,c1:c2,r2:r+1,c2:c2});
        }
      }
    }
    // Shuffle candidates
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    // Pick non-overlapping pairs
    for (const cand of candidates) {
      if (pairs.length >= linkedPairs) break;
      const k1 = `${cand.r1},${cand.c1}`, k2 = `${cand.r2},${cand.c2}`;
      if (pairedCells.has(k1) || pairedCells.has(k2)) continue;
      pairedCells.add(k1);
      pairedCells.add(k2);
      pairs.push(cand);
    }
  }
  // Build token pool with linked and single tokens
  const tokenPool = [];
  // Add linked pair tokens
  pairs.forEach(p => {
    tokenPool.push({type:'linked', values:[solutionGrid[p.r1][p.c1], solutionGrid[p.r2][p.c2]], orientation:'horizontal'});
  });
  // Add single tokens for unpaired cells
  for (let r = 0; r < rows; r++) {
    for (let c2 = 0; c2 < cols; c2++) {
      if (!pairedCells.has(`${r},${c2}`)) {
        tokenPool.push({type:'single', value:solutionGrid[r][c2]});
      }
    }
  }
  // Shuffle token pool
  for (let i = tokenPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tokenPool[i], tokenPool[j]] = [tokenPool[j], tokenPool[i]];
  }
  return {rows, cols, zones, tokenPool, par};
}

function partitionMosaicGrid(rows, cols) {
  const used = Array.from({length:rows}, () => Array(cols).fill(false));
  const zones = [];
  const shapes = [[2,2],[1,3],[3,1],[1,2],[2,1]];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (used[r][c]) continue;
      // Shuffle shapes to get variety
      const shuffled = shapes.slice().sort(() => Math.random() - 0.5);
      let placed = false;
      for (const [sh, sw] of shuffled) {
        if (r + sh > rows || c + sw > cols) continue;
        let fits = true;
        for (let dr = 0; dr < sh && fits; dr++)
          for (let dc = 0; dc < sw && fits; dc++)
            if (used[r+dr][c+dc]) fits = false;
        if (!fits) continue;
        const cells = [];
        for (let dr = 0; dr < sh; dr++)
          for (let dc = 0; dc < sw; dc++) {
            used[r+dr][c+dc] = true;
            cells.push({r:r+dr, c:c+dc});
          }
        zones.push({cells, shapeRows:sh, shapeCols:sw, colorIdx:zones.length % MOSAIC_ZONE_COLORS.length});
        placed = true;
        break;
      }
      if (!placed) {
        used[r][c] = true;
        zones.push({cells:[{r,c}], shapeRows:1, shapeCols:1, colorIdx:zones.length % MOSAIC_ZONE_COLORS.length});
      }
    }
  }
  return zones;
}

function generateMosaicZoneValues(zone, valueRange, ruleTypes) {
  const n = zone.cells.length;
  const isSingleLine = zone.shapeRows === 1 || zone.shapeCols === 1;
  const available = ruleTypes.filter(r => r !== 'ascending' || (isSingleLine && n >= 2));
  const rule = available[Math.floor(Math.random() * available.length)];
  let values, ruleDisplay;
  switch(rule) {
    case 'sum': {
      values = [];
      for (let i = 0; i < n; i++) values.push(Math.floor(Math.random() * valueRange) + 1);
      const s = values.reduce((a,b) => a+b, 0);
      ruleDisplay = `${s}`;
      break;
    }
    case 'same': {
      const v = Math.floor(Math.random() * valueRange) + 1;
      values = Array(n).fill(v);
      ruleDisplay = 'ALL =';
      break;
    }
    case 'different': {
      if (n > valueRange) {
        // Fallback to sum if not enough unique values
        values = [];
        for (let i = 0; i < n; i++) values.push(Math.floor(Math.random() * valueRange) + 1);
        const s = values.reduce((a,b) => a+b, 0);
        ruleDisplay = `${s}`;
        zone.rule = 'sum';
        return {values, rule:'sum', ruleDisplay};
      }
      const pool = [];
      for (let i = 1; i <= valueRange; i++) pool.push(i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      values = pool.slice(0, n);
      ruleDisplay = 'ALL \u2260';
      break;
    }
    case 'ascending': {
      const pool = [];
      for (let i = 1; i <= valueRange; i++) pool.push(i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      values = pool.slice(0, n).sort((a,b) => a - b);
      // Ensure strictly ascending — if duplicates, regenerate
      let strict = true;
      for (let i = 1; i < values.length; i++) if (values[i] <= values[i-1]) strict = false;
      if (!strict) {
        // Build strictly ascending sequence
        values = [];
        let start = Math.floor(Math.random() * (valueRange - n + 1)) + 1;
        for (let i = 0; i < n; i++) values.push(start + i);
      }
      ruleDisplay = '\u2197';
      break;
    }
  }
  return {values, rule, ruleDisplay};
}

function showMosaicSymbolGuide() {
  const c = document.getElementById('game-container');
  const diff = GS.difficulty || 'easy';
  const hasLinked = diff === 'medium' || diff === 'hard' || diff === 'extreme';
  let html = `<div class="intro-screen" style="text-align:left">`;
  html += `<div style="text-align:center;font-size:28px;font-weight:800;margin-bottom:16px">Mosaic Symbol Guide</div>`;
  html += `<div style="display:flex;flex-direction:column;gap:14px">`;
  // Sum rule
  html += `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg2);border-radius:var(--radius-lg)">
    <div style="min-width:56px;text-align:center;font-size:22px;font-weight:800;color:var(--accent)">12</div>
    <div><div style="font-weight:700;margin-bottom:2px">Sum</div><div style="font-size:13px;color:var(--fg2)">A plain number means all cells in the zone must add up to that total.</div></div>
  </div>`;
  // Same rule
  html += `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg2);border-radius:var(--radius-lg)">
    <div style="min-width:56px;text-align:center;font-size:22px;font-weight:800;color:var(--accent)">ALL =</div>
    <div><div style="font-weight:700;margin-bottom:2px">All Same</div><div style="font-size:13px;color:var(--fg2)">Every cell in the zone must contain the same number.</div></div>
  </div>`;
  // Different rule
  html += `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg2);border-radius:var(--radius-lg)">
    <div style="min-width:56px;text-align:center;font-size:22px;font-weight:800;color:var(--accent)">ALL \u2260</div>
    <div><div style="font-weight:700;margin-bottom:2px">All Different</div><div style="font-size:13px;color:var(--fg2)">Every cell in the zone must have a unique number — no repeats.</div></div>
  </div>`;
  // Ascending rule
  html += `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg2);border-radius:var(--radius-lg)">
    <div style="min-width:56px;text-align:center;font-size:22px;font-weight:800;color:var(--accent)">\u2197</div>
    <div><div style="font-weight:700;margin-bottom:2px">Ascending</div><div style="font-size:13px;color:var(--fg2)">Numbers must increase from left to right (or top to bottom). Each number must be larger than the previous.</div></div>
  </div>`;
  // Linked pairs (only on hard/extreme)
  if (hasLinked) {
    html += `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg2);border-radius:var(--radius-lg)">
      <div style="min-width:56px;display:flex;align-items:center;justify-content:center;gap:2px">
        <span style="width:22px;height:22px;border-radius:50%;background:var(--accent);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">3</span>
        <span style="width:8px;height:3px;background:var(--accent);border-radius:2px"></span>
        <span style="width:22px;height:22px;border-radius:50%;background:var(--accent);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">5</span>
      </div>
      <div><div style="font-weight:700;margin-bottom:2px">Linked Pair</div><div style="font-size:13px;color:var(--fg2)">A capsule with two numbers that fills two adjacent cells at once. Tap to select, tap again to rotate (\u2194/\u2195), then tap a cell to place.</div></div>
    </div>`;
  }
  html += `</div>`;
  html += `<button class="btn btn-primary btn-lg btn-full" style="margin-top:20px" onclick="beginChallenge()">Start Game</button>`;
  html += `</div>`;
  c.innerHTML = html;
}

function renderMosaic(puzzle) {
  mosaicState = {
    puzzle,
    grid: Array.from({length:puzzle.rows}, () => Array(puzzle.cols).fill(null)),
    selectedToken: null,
    tokenPlaced: Array(puzzle.tokenPool.length).fill(false),
    cellTokenIdx: Array.from({length:puzzle.rows}, () => Array(puzzle.cols).fill(-1)),
    cellPartner: Array.from({length:puzzle.rows}, () => Array(puzzle.cols).fill(null)),
    checked: false
  };
  const c = document.getElementById('game-container');
  const cellSize = Math.min(Math.floor((Math.min(window.innerWidth, 600) - 40) / puzzle.cols), 60);
  let html = `<div class="mosaic-stats"><span>Zones: ${puzzle.zones.length}</span><span>Par: ${puzzle.par}s</span></div>`;
  // Build zone lookup
  const zoneMap = Array.from({length:puzzle.rows}, () => Array(puzzle.cols).fill(-1));
  puzzle.zones.forEach((z, zi) => z.cells.forEach(cell => zoneMap[cell.r][cell.c] = zi));
  // Grid
  html += `<div class="mosaic-grid" style="grid-template-columns:repeat(${puzzle.cols},${cellSize}px);grid-template-rows:repeat(${puzzle.rows},${cellSize}px);width:${cellSize*puzzle.cols}px">`;
  for (let r = 0; r < puzzle.rows; r++) {
    for (let c2 = 0; c2 < puzzle.cols; c2++) {
      const zi = zoneMap[r][c2];
      const zone = puzzle.zones[zi];
      const color = MOSAIC_ZONE_COLORS[zone.colorIdx];
      // Determine borders: thick on zone edges, thin inside
      const bTop = (r === 0 || zoneMap[r-1][c2] !== zi) ? `3px solid ${color.border}` : `1px solid var(--border)`;
      const bBottom = (r === puzzle.rows-1 || zoneMap[r+1][c2] !== zi) ? `3px solid ${color.border}` : `1px solid var(--border)`;
      const bLeft = (c2 === 0 || zoneMap[r][c2-1] !== zi) ? `3px solid ${color.border}` : `1px solid var(--border)`;
      const bRight = (c2 === puzzle.cols-1 || zoneMap[r][c2+1] !== zi) ? `3px solid ${color.border}` : `1px solid var(--border)`;
      // Show rule label in top-left cell of zone
      const isTopLeft = zone.cells[0].r === r && zone.cells[0].c === c2;
      const label = isTopLeft ? `<span class="mosaic-zone-label">${zone.ruleDisplay}</span>` : '';
      html += `<div class="mosaic-cell" id="mcell-${r}-${c2}" data-r="${r}" data-c="${c2}" style="background:${color.bg};border-top:${bTop};border-bottom:${bBottom};border-left:${bLeft};border-right:${bRight}" onclick="placeMosaicToken(${r},${c2})">${label}</div>`;
    }
  }
  html += `</div>`;
  // Token pool
  html += `<div class="mosaic-pool" id="mosaic-pool">`;
  puzzle.tokenPool.forEach((tok, i) => {
    if (tok.type === 'linked') {
      const orientClass = tok.orientation === 'vertical' ? ' vertical-orient' : '';
      const orientIcon = tok.orientation === 'vertical' ? '↕' : '↔';
      html += `<div class="mosaic-token linked${orientClass}" id="mtoken-${i}" draggable="true" onclick="selectMosaicToken(${i})"><span class="linked-val">${tok.values[0]}</span><span class="linked-bridge"></span><span class="linked-val">${tok.values[1]}</span><span class="linked-orient">${orientIcon}</span></div>`;
    } else {
      html += `<div class="mosaic-token" id="mtoken-${i}" draggable="true" onclick="selectMosaicToken(${i})">${tok.value}</div>`;
    }
  });
  html += `</div>`;
  // Check button (hidden until all placed)
  html += `<button class="btn btn-primary btn-full btn-lg mosaic-check-btn" id="mosaic-check-btn" style="display:none" onclick="checkMosaicSolution()">Check Solution</button>`;
  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'none';
  initMosaicDragDrop();
}

function initMosaicDragDrop() {
  const st = mosaicState;
  const puzzle = st.puzzle;
  // Desktop HTML5 drag-and-drop
  puzzle.tokenPool.forEach((tok, i) => {
    const el = document.getElementById(`mtoken-${i}`);
    el.addEventListener('dragstart', (e) => {
      if (st.checked || st.tokenPlaced[i]) { e.preventDefault(); return; }
      e.dataTransfer.setData('text/plain', String(i));
      e.dataTransfer.effectAllowed = 'move';
      if (st.selectedToken !== null && st.selectedToken !== i) {
        document.getElementById(`mtoken-${st.selectedToken}`).classList.remove('selected-token');
      }
      st.selectedToken = i;
      el.classList.add('selected-token');
      setTimeout(() => el.classList.add('dragging'), 0);
    });
    el.addEventListener('dragend', () => { el.classList.remove('dragging'); });
  });
  for (let r = 0; r < puzzle.rows; r++) {
    for (let c2 = 0; c2 < puzzle.cols; c2++) {
      const cell = document.getElementById(`mcell-${r}-${c2}`);
      cell.addEventListener('dragover', (e) => { e.preventDefault(); cell.classList.add('drop-target'); });
      cell.addEventListener('dragleave', () => { cell.classList.remove('drop-target'); });
      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('drop-target');
        const tIdx = parseInt(e.dataTransfer.getData('text/plain'));
        if (isNaN(tIdx)) return;
        st.selectedToken = tIdx;
        placeMosaicToken(r, c2);
      });
    }
  }
  // Mobile touch drag-and-drop
  const ts = {idx:-1, ghost:null, moved:false, sx:0, sy:0};
  function onTouchMove(e) {
    const t = e.touches[0];
    if (!ts.moved && Math.abs(t.clientX - ts.sx) + Math.abs(t.clientY - ts.sy) > 10) {
      ts.moved = true;
      const src = document.getElementById(`mtoken-${ts.idx}`);
      ts.ghost = src.cloneNode(true);
      ts.ghost.className = 'mosaic-token mosaic-drag-ghost' +
        (src.classList.contains('linked') ? ' linked' : '') +
        (src.classList.contains('vertical-orient') ? ' vertical-orient' : '');
      ts.ghost.removeAttribute('id');
      document.body.appendChild(ts.ghost);
      ts.gw = ts.ghost.offsetWidth / 2; ts.gh = ts.ghost.offsetHeight / 2;
      src.classList.add('dragging');
      if (st.selectedToken !== null && st.selectedToken !== ts.idx) {
        document.getElementById(`mtoken-${st.selectedToken}`).classList.remove('selected-token');
      }
      st.selectedToken = ts.idx;
      src.classList.add('selected-token');
    }
    if (ts.moved && ts.ghost) {
      e.preventDefault();
      ts.ghost.style.left = (t.clientX - ts.gw) + 'px';
      ts.ghost.style.top = (t.clientY - ts.gh) + 'px';
      document.querySelectorAll('.mosaic-cell.drop-target').forEach(el => el.classList.remove('drop-target'));
      ts.ghost.style.pointerEvents = 'none';
      const under = document.elementFromPoint(t.clientX, t.clientY);
      ts.ghost.style.pointerEvents = '';
      if (under) { const mc = under.closest('.mosaic-cell'); if (mc) mc.classList.add('drop-target'); }
    }
  }
  function onTouchEnd(e) {
    const src = document.getElementById(`mtoken-${ts.idx}`);
    if (ts.moved && ts.ghost) {
      const t = e.changedTouches[0];
      ts.ghost.style.pointerEvents = 'none';
      const under = document.elementFromPoint(t.clientX, t.clientY);
      ts.ghost.remove();
      ts.ghost = null;
      document.querySelectorAll('.mosaic-cell.drop-target').forEach(el => el.classList.remove('drop-target'));
      if (under) {
        const mc = under.closest('.mosaic-cell');
        if (mc) { st.selectedToken = ts.idx; placeMosaicToken(parseInt(mc.dataset.r), parseInt(mc.dataset.c)); }
      }
      if (src) src.classList.remove('dragging');
    }
    ts.idx = -1; ts.moved = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }
  puzzle.tokenPool.forEach((tok, i) => {
    document.getElementById(`mtoken-${i}`).addEventListener('touchstart', (e) => {
      if (st.checked || st.tokenPlaced[i]) return;
      ts.idx = i; ts.moved = false;
      ts.sx = e.touches[0].clientX; ts.sy = e.touches[0].clientY;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.addEventListener('touchmove', onTouchMove, {passive:false});
      document.addEventListener('touchend', onTouchEnd);
    }, {passive:true});
  });
}

function selectMosaicToken(idx) {
  if (mosaicState.checked || mosaicState.tokenPlaced[idx]) return;
  const tok = mosaicState.puzzle.tokenPool[idx];
  if (mosaicState.selectedToken === idx) {
    // If linked pair, rotate instead of deselecting
    if (tok.type === 'linked') {
      tok.orientation = tok.orientation === 'horizontal' ? 'vertical' : 'horizontal';
      const el = document.getElementById(`mtoken-${idx}`);
      el.classList.toggle('vertical-orient');
      el.querySelector('.linked-orient').textContent = tok.orientation === 'vertical' ? '↕' : '↔';
    } else {
      mosaicState.selectedToken = null;
      document.getElementById(`mtoken-${idx}`).classList.remove('selected-token');
    }
  } else {
    // Deselect previous
    if (mosaicState.selectedToken !== null) {
      document.getElementById(`mtoken-${mosaicState.selectedToken}`).classList.remove('selected-token');
    }
    mosaicState.selectedToken = idx;
    document.getElementById(`mtoken-${idx}`).classList.add('selected-token');
  }
}

function clearMosaicCell(r, c) {
  const st = mosaicState;
  st.grid[r][c] = null;
  st.cellTokenIdx[r][c] = -1;
  st.cellPartner[r][c] = null;
  const cell = document.getElementById(`mcell-${r}-${c}`);
  const label = cell.querySelector('.mosaic-zone-label');
  cell.textContent = '';
  if (label) cell.appendChild(label);
  cell.classList.remove('filled', 'linked-cell');
}

function fillMosaicCell(r, c, value, tIdx, isLinked) {
  const st = mosaicState;
  st.grid[r][c] = value;
  st.cellTokenIdx[r][c] = tIdx;
  const cell = document.getElementById(`mcell-${r}-${c}`);
  const label = cell.querySelector('.mosaic-zone-label');
  cell.textContent = value;
  if (label) cell.insertBefore(label, cell.firstChild);
  cell.classList.add('filled');
  if (isLinked) cell.classList.add('linked-cell');
}

function placeMosaicToken(r, c) {
  if (mosaicState.checked) return;
  const st = mosaicState;
  // If cell is filled, return its token to pool
  if (st.grid[r][c] !== null) {
    const tIdx = st.cellTokenIdx[r][c];
    const tok = st.puzzle.tokenPool[tIdx];
    // If linked pair, clear both cells
    if (tok.type === 'linked') {
      const partner = st.cellPartner[r][c];
      clearMosaicCell(r, c);
      if (partner) clearMosaicCell(partner.r, partner.c);
    } else {
      clearMosaicCell(r, c);
    }
    st.tokenPlaced[tIdx] = false;
    document.getElementById(`mtoken-${tIdx}`).classList.remove('used');
    document.getElementById('mosaic-check-btn').style.display = 'none';
    return;
  }
  // If no token selected, do nothing
  if (st.selectedToken === null) return;
  const tIdx = st.selectedToken;
  const tok = st.puzzle.tokenPool[tIdx];
  if (tok.type === 'linked') {
    // Compute partner cell based on orientation
    const dr = tok.orientation === 'vertical' ? 1 : 0;
    const dc = tok.orientation === 'horizontal' ? 1 : 0;
    const r2 = r + dr, c2 = c + dc;
    // Validate partner in-bounds and empty
    if (r2 >= st.puzzle.rows || c2 >= st.puzzle.cols) return;
    if (st.grid[r2][c2] !== null) return;
    // Place both cells
    fillMosaicCell(r, c, tok.values[0], tIdx, true);
    fillMosaicCell(r2, c2, tok.values[1], tIdx, true);
    st.cellPartner[r][c] = {r:r2, c:c2};
    st.cellPartner[r2][c2] = {r, c};
  } else {
    fillMosaicCell(r, c, tok.value, tIdx, false);
  }
  st.tokenPlaced[tIdx] = true;
  st.selectedToken = null;
  // Update UI
  document.getElementById(`mtoken-${tIdx}`).classList.remove('selected-token');
  document.getElementById(`mtoken-${tIdx}`).classList.add('used');
  // Check if all cells filled
  const allFilled = st.grid.every(row => row.every(v => v !== null));
  if (allFilled) {
    document.getElementById('mosaic-check-btn').style.display = '';
  }
}

function checkMosaicSolution() {
  if (mosaicState.checked) return;
  const st = mosaicState;
  let correct = 0;
  const total = st.puzzle.zones.length;
  // Clear previous error indicators
  document.querySelectorAll('.mosaic-zone-error').forEach(el => el.remove());
  st.puzzle.zones.forEach(zone => {
    const vals = zone.cells.map(({r,c}) => st.grid[r][c]);
    let ok = false;
    switch(zone.rule) {
      case 'sum': {
        const target = zone.solutionValues.reduce((a,b) => a+b, 0);
        ok = vals.reduce((a,b) => a+b, 0) === target;
        break;
      }
      case 'same': ok = vals.every(v => v === vals[0]); break;
      case 'different': ok = new Set(vals).size === vals.length; break;
      case 'ascending': {
        ok = true;
        for (let i = 1; i < vals.length; i++) if (vals[i] <= vals[i-1]) ok = false;
        break;
      }
    }
    if (ok) correct++;
    // Flash cells
    zone.cells.forEach(({r,c}) => {
      const cell = document.getElementById(`mcell-${r}-${c}`);
      cell.classList.add(ok ? 'zone-correct' : 'zone-wrong');
    });
    // Add red circle next to zone label if wrong
    if (!ok) {
      const topLeft = zone.cells[0];
      const cell = document.getElementById(`mcell-${topLeft.r}-${topLeft.c}`);
      const label = cell.querySelector('.mosaic-zone-label');
      if (label) {
        const dot = document.createElement('span');
        dot.className = 'mosaic-zone-error';
        dot.textContent = '\u25CF';
        label.appendChild(dot);
      }
    }
  });
  if (correct === total) {
    // All correct — finish
    mosaicState.checked = true;
    document.getElementById('mosaic-check-btn').style.display = 'none';
    const score = 100;
    setTimeout(() => endMosaic(score, correct, total), 800);
  } else {
    // Some wrong — let user keep trying
    st.mosaicAttempts = (st.mosaicAttempts || 0) + 1;
    // Remove flash classes after animation
    setTimeout(() => {
      document.querySelectorAll('.mosaic-cell.zone-correct,.mosaic-cell.zone-wrong').forEach(el => {
        el.classList.remove('zone-correct', 'zone-wrong');
      });
    }, 700);
  }
}

function endMosaic(score, correctZones, totalZones) {
  if (!document.getElementById('game-container')) return;
  const attempts = (mosaicState.mosaicAttempts || 0);
  // Deduct points for extra attempts: -10 per retry, min 10
  const finalScore = Math.max(10, score - (attempts * 10));
  GS.results['mosaic'] = finalScore;
  if (GS.mode === 'daily') {
    setDailyCompletion('mosaic', finalScore);
    lsSet('daily-mosaic-state-'+getDailyDateStr(), { correctZones, totalZones, attempts, score: finalScore });
  }
  const stats = [
    { label: 'Zones correct', value: `${correctZones} / ${totalZones}` }
  ];
  if (attempts > 0) stats.push({ label: 'Retry penalty', value: `-${attempts * 10} pts` });
  showChallengeSummary({
    emoji: '🎨',
    score: finalScore,
    title: finalScore >= 80 ? 'Excellent!' : finalScore >= 50 ? 'Good Effort!' : 'Keep Practicing!',
    stats
  });
}

