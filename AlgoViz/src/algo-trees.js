// ── Trees section: Binary Search Tree ─────────────────────────────────────
// Animated insert + search on a BST drawn to a canvas. Node x-coordinates come
// from an in-order index (so order reads left→right); y from depth. Shares the
// global run/pause machinery (running, paused, pauseResolve, opsCount, delayP).

const DEFAULT_BST_VALUES = [50, 30, 70, 20, 40, 60, 80, 35];
const DEFAULT_BST_TARGET = 35;
const TREE_NODE_R = 17;

let bstRoot = null;

function getBSTValues() {
  const el = document.getElementById("tree-values-input");
  if (!el || !el.value.trim()) return DEFAULT_BST_VALUES;
  const parsed = el.value
    .split(/[,\s]+/)
    .map((s) => parseInt(s.trim()))
    .filter((x) => !isNaN(x));
  return parsed.length ? parsed : DEFAULT_BST_VALUES;
}

function getBSTTarget() {
  const el = document.getElementById("tree-target-input");
  if (!el || el.value.trim() === "") return DEFAULT_BST_TARGET;
  const v = parseInt(el.value);
  return isNaN(v) ? DEFAULT_BST_TARGET : v;
}

function bstNewNode(val) {
  return { val, left: null, right: null, x: 0, y: 0, state: "default" };
}

// Non-animated build delegates to the unit-tested pure core (AlgoCore).
function bstInsertSilent(val) {
  bstRoot = AlgoCore.bstInsert(bstRoot, val);
}

function bstForEach(node, fn) {
  if (!node) return;
  fn(node);
  bstForEach(node.left, fn);
  bstForEach(node.right, fn);
}

function bstCount() {
  let c = 0;
  bstForEach(bstRoot, () => c++);
  return c;
}

function bstClearStates() {
  bstForEach(bstRoot, (n) => (n.state = "default"));
}

function sizeTreeCanvas() {
  const c = document.getElementById("tree-canvas");
  if (!c) return null;
  if (c.offsetWidth > 0) {
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;
  }
  return c;
}

// Assign x by in-order position, y by depth.
function layoutTree() {
  const c = document.getElementById("tree-canvas");
  if (!c) return;
  const n = Math.max(bstCount(), 1);
  const xStep = c.width / (n + 1);
  const yStep = 56;
  let counter = 0;
  (function rec(node, depth) {
    if (!node) return;
    rec(node.left, depth + 1);
    node.x = ++counter * xStep;
    node.y = 36 + depth * yStep;
    rec(node.right, depth + 1);
  })(bstRoot, 0);
}

function drawTree() {
  const c = sizeTreeCanvas();
  if (!c) return;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  layoutTree();

  const nodeColor = {
    default: PALETTE.blue,
    comparing: PALETTE.amber,
    path: PALETTE.purple,
    found: PALETTE.green,
    inserted: PALETTE.green,
  };

  // Edges first.
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  bstForEach(bstRoot, (node) => {
    for (const child of [node.left, node.right]) {
      if (child) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(child.x, child.y);
        ctx.stroke();
      }
    }
  });

  // Nodes.
  bstForEach(bstRoot, (node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, TREE_NODE_R, 0, 2 * Math.PI);
    ctx.fillStyle = nodeColor[node.state] || nodeColor.default;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.val.toString(), node.x, node.y);
  });
}

function selectTree(name) {
  if (running) return;
  currentTree = name;
  document
    .querySelectorAll("#section-tree .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  const card = document.getElementById("card-" + name);
  if (card) card.classList.add("selected");
  resetTree();
  if (typeof syncURL === "function") syncURL();
}

function toggleTreePause() {
  togglePauseGeneric("btn-tree-pause");
}

function resetTree() {
  running = paused = false;
  if (pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
  opsCount = 0;
  updateOpsDisplay("tree");

  // Build the tree instantly so there is something to see before running.
  bstRoot = null;
  for (const v of getBSTValues()) bstInsertSilent(v);
  drawTree();

  const codeEl = document.getElementById("tree-code");
  if (codeEl) {
    const langCodes = CODES[currentLang] || CODES.js;
    codeEl.innerHTML = langCodes[currentTree] ?? CODES.js[currentTree] ?? "";
  }

  const statusEl = document.getElementById("tree-status");
  if (statusEl) statusEl.textContent = "Нажми «Запустить»";

  const btn = document.getElementById("btn-tree-run");
  if (btn) btn.disabled = false;

  const pb = document.getElementById("btn-tree-pause");
  if (pb) pb.textContent = "⏸ Пауза";

  renderDesc("tree-desc", currentTree);
}

async function bstInsertAnimated(val, d, status) {
  if (!bstRoot) {
    bstRoot = bstNewNode(val);
    bstRoot.state = "inserted";
    status(`Дерево пустое — ${val} становится корнем`);
    drawTree();
    await delayP(d());
    return;
  }
  let cur = bstRoot;
  while (cur && running) {
    cur.state = "comparing";
    drawTree();
    status(`Вставка ${val}: сравниваем с ${cur.val}`);
    await delayP(d());
    opsCount++;
    updateOpsDisplay("tree");
    if (val === cur.val) {
      status(`${val} уже есть в дереве — пропускаем`);
      cur.state = "default";
      drawTree();
      return;
    }
    const dir = val < cur.val ? "left" : "right";
    cur.state = "path";
    if (!cur[dir]) {
      const node = bstNewNode(val);
      node.state = "inserted";
      cur[dir] = node;
      status(
        `Вставляем ${val} как ${dir === "left" ? "левого" : "правого"} потомка ${cur.val}`,
      );
      drawTree();
      await delayP(d());
      return;
    }
    cur = cur[dir];
  }
}

async function bstSearchAnimated(target, d, status) {
  let cur = bstRoot;
  while (cur && running) {
    cur.state = "comparing";
    drawTree();
    status(`Поиск ${target}: сравниваем с ${cur.val}`);
    await delayP(d());
    opsCount++;
    updateOpsDisplay("tree");
    if (target === cur.val) {
      cur.state = "found";
      drawTree();
      status(`Найдено ${target}! ✓`);
      await delayP(d());
      return true;
    }
    cur.state = "path";
    cur = target < cur.val ? cur.left : cur.right;
  }
  if (running) status(`${target} нет в дереве`);
  return false;
}

async function runTree() {
  if (running) return;
  running = true;
  paused = false;
  opsCount = 0;
  updateOpsDisplay("tree");

  const btn = document.getElementById("btn-tree-run");
  if (btn) btn.disabled = true;

  const status = (t) => {
    const el = document.getElementById("tree-status");
    if (el) el.textContent = t;
  };
  const d = () =>
    [620, 420, 260, 130, 55][
      +document.getElementById("tree-speed-slider").value - 1
    ];

  // Phase 1: build the tree from scratch, animated.
  bstRoot = null;
  drawTree();
  const values = getBSTValues();
  status("Строим BST по очереди вставкой значений…");
  await delayP(d());
  for (const v of values) {
    if (!running) break;
    await bstInsertAnimated(v, d, status);
    bstClearStates();
    drawTree();
  }

  // Phase 2: search for the target.
  if (running) {
    const target = getBSTTarget();
    status(`Дерево построено. Ищем ${target}…`);
    await delayP(d());
    await bstSearchAnimated(target, d, status);
  }

  running = false;
  if (btn) btn.disabled = false;
}
