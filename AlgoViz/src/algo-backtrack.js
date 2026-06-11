const DEFAULT_QUEENS_N = 6;

function getQueensN() {
  const input = document.getElementById("backtrack-size-input");
  if (!input) return DEFAULT_QUEENS_N;
  const v = parseInt(input.value);
  return !isNaN(v) && v >= 4 && v <= 8 ? v : DEFAULT_QUEENS_N;
}

function selectBacktrack(name) {
  if (running) return;
  currentBacktrack = name;
  document
    .querySelectorAll("#section-backtrack .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  const card = document.getElementById("card-" + name);
  if (card) card.classList.add("selected");
  resetBacktrack();
  if (typeof syncURL === "function") syncURL();
}

function toggleBacktrackPause() {
  togglePauseGeneric("btn-backtrack-pause");
}

function buildQueensBoard() {
  const viz = document.getElementById("backtrack-viz");
  if (!viz) return;
  const N = getQueensN();
  viz.innerHTML = "";

  const info = document.createElement("div");
  info.style.cssText =
    "font-size:11px;color:var(--muted);margin-bottom:10px;text-align:center";
  info.textContent = `Доска ${N}×${N} — расставляем ${N} ферзей`;
  viz.appendChild(info);

  const board = document.createElement("div");
  board.id = "queens-board";
  const cell = Math.min(48, Math.floor(360 / N));
  board.style.cssText =
    `display:grid;grid-template-columns:repeat(${N}, ${cell}px);` +
    `gap:0;margin:0 auto;width:max-content;` +
    `border:2px solid var(--border);border-radius:6px;overflow:hidden`;

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const c = document.createElement("div");
      c.id = "q-" + row + "-" + col;
      const light = (row + col) % 2 === 0;
      c.style.cssText =
        `width:${cell}px;height:${cell}px;display:flex;align-items:center;` +
        `justify-content:center;font-size:${Math.floor(cell * 0.6)}px;` +
        `background:${light ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)"};` +
        `transition:background 0.15s`;
      board.appendChild(c);
    }
  }
  viz.appendChild(board);
}

function resetBacktrack() {
  running = paused = false;
  if (pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
  opsCount = 0;
  updateOpsDisplay("backtrack");

  buildQueensBoard();

  const codeEl = document.getElementById("backtrack-code");
  if (codeEl) {
    const langCodes = CODES[currentLang] || CODES.js;
    codeEl.innerHTML =
      langCodes[currentBacktrack] ?? CODES.js[currentBacktrack] ?? "";
  }

  const statusEl = document.getElementById("backtrack-status");
  if (statusEl) statusEl.textContent = "Нажми «Запустить»";

  const btn = document.getElementById("btn-backtrack-run");
  if (btn) btn.disabled = false;

  const pb = document.getElementById("btn-backtrack-pause");
  if (pb) pb.textContent = "⏸ Пауза";

  renderDesc("backtrack-desc", currentBacktrack);
}

function qCell(row, col) {
  return document.getElementById("q-" + row + "-" + col);
}
function paintCell(row, col, bg, glyph) {
  const el = qCell(row, col);
  if (!el) return;
  if (bg !== undefined) el.style.background = bg;
  if (glyph !== undefined) el.textContent = glyph;
}
function cellBase(row, col) {
  return (row + col) % 2 === 0
    ? "rgba(255,255,255,0.06)"
    : "rgba(255,255,255,0.02)";
}

async function runBacktrack() {
  if (running) return;
  running = true;
  paused = false;
  opsCount = 0;
  updateOpsDisplay("backtrack");

  const btn = document.getElementById("btn-backtrack-run");
  if (btn) btn.disabled = true;

  const status = (t) => {
    const el = document.getElementById("backtrack-status");
    if (el) el.textContent = t;
  };
  const d = () =>
    [520, 360, 220, 110, 45][
      +document.getElementById("backtrack-speed-slider").value - 1
    ];

  const N = getQueensN();
  buildQueensBoard();
  const board = new Array(N).fill(-1);

  const isSafe = (row, col) => {
    for (let c = 0; c < col; c++) {
      const r = board[c];
      if (r === row) return false;
      if (Math.abs(r - row) === col - c) return false;
    }
    return true;
  };

  async function place(col) {
    if (!running) return false;
    if (col === N) return true;

    for (let row = 0; row < N && running; row++) {
      paintCell(row, col, withAlpha("amber", 0.3));
      status(`Столбец ${col}: пробуем строку ${row}`);
      await delayP(d());
      opsCount++;
      updateOpsDisplay("backtrack");
      if (!running) return false;

      if (isSafe(row, col)) {
        board[col] = row;
        paintCell(row, col, withAlpha("green", 0.3), "♛");
        status(`Ставим ферзя на (стр ${row}, ст ${col})`);
        await delayP(d());

        if (await place(col + 1)) return true;

        board[col] = -1;
        paintCell(row, col, withAlpha("red", 0.25), "");
        status(`Откат: убираем ферзя с (стр ${row}, ст ${col})`);
        await delayP(d());
        paintCell(row, col, cellBase(row, col), "");
      } else {
        paintCell(row, col, withAlpha("red", 0.25), "✕");
        await delayP(d());
        paintCell(row, col, cellBase(row, col), "");
      }
    }
    return false;
  }

  const solved = await place(0);

  if (running) {
    if (solved) {
      for (let col = 0; col < N; col++) {
        if (board[col] >= 0)
          paintCell(board[col], col, withAlpha("green", 0.35), "♛");
      }
      status(`Решение найдено! Расстановка: [${board.join(", ")}] ✓`);
    } else {
      status("Решения не существует для этой доски");
    }
  }

  running = false;
  if (btn) btn.disabled = false;
}
