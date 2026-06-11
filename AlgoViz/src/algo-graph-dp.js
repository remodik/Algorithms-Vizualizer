let graphNodes = [];
let graphEdges = [];
let graphAdj = [];
let pauseResolve = null;
let paused = false;
let opsCount = 0;
let graphIsDirected = false;
let graphEditMode = false;
let edgeStartNode = null; // node id awaiting a second click to form an edge

function waitIfPaused() {
  return new Promise((res) => {
    if (!paused) {
      res();
      return;
    }
    pauseResolve = res;
  });
}

function togglePauseGeneric(btnId) {
  paused = !paused;
  const btn = document.getElementById(btnId);
  if (btn) btn.textContent = paused ? "▶ Продолжить" : "⏸ Пауза";
  if (!paused && pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
}

function toggleGraphPause() {
  togglePauseGeneric("btn-pause");
}
function toggleDPPause() {
  togglePauseGeneric("btn-dp-pause");
}

function stepOnce() {
  if (pauseResolve) {
    pauseResolve();
    pauseResolve = null;
    paused = true;
  }
}

async function delayP(ms) {
  await delay(ms);
  await waitIfPaused();
}

function updateOpsDisplay(section) {
  const el = document.getElementById(section + "-ops");
  if (el) el.textContent = "операций: " + opsCount;
}

function generateGraph() {
  const canvas = document.getElementById("graph-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const N = 8;
  graphNodes = [];
  graphEdges = [];
  graphAdj = Array(N)
    .fill(null)
    .map(() => []);

  const cx = canvas.width / 2,
    cy = canvas.height / 2;
  const r = Math.min(cx, cy) - 50;
  for (let i = 0; i < N; i++) {
    const a = (2 * Math.PI * i) / N - Math.PI / 2;
    graphNodes.push({
      id: i,
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
      state: "default",
    });
  }

  const added = new Set();
  function addEdge(u, v) {
    const key = Math.min(u, v) + "-" + Math.max(u, v);
    if (added.has(key)) return;
    added.add(key);
    const w = Math.floor(Math.random() * 9) + 1;
    graphAdj[u].push({ v, w });
    graphAdj[v].push({ v: u, w });
    graphEdges.push({ from: u, to: v, w, state: "default" });
  }
  for (let i = 1; i < N; i++) addEdge(i - 1, i);
  addEdge(0, N - 1);
  for (let i = 0; i < N; i++) {
    const t = Math.floor(Math.random() * N);
    if (t !== i) addEdge(i, t);
  }

  graphIsDirected = false;
  drawGraph();
}

function generateDAG() {
  const canvas = document.getElementById("graph-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const N = 8;
  graphNodes = [];
  graphEdges = [];
  graphAdj = Array(N)
    .fill(null)
    .map(() => []);

  const W = canvas.width,
    H = canvas.height;
  const layout = [
    { x: W * 0.1, y: H * 0.5 },
    { x: W * 0.3, y: H * 0.22 },
    { x: W * 0.3, y: H * 0.78 },
    { x: W * 0.52, y: H * 0.12 },
    { x: W * 0.52, y: H * 0.5 },
    { x: W * 0.52, y: H * 0.88 },
    { x: W * 0.75, y: H * 0.3 },
    { x: W * 0.75, y: H * 0.7 },
  ];

  for (let i = 0; i < N; i++)
    graphNodes.push({
      id: i,
      x: layout[i].x,
      y: layout[i].y,
      state: "default",
    });

  const dagEdges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [2, 5],
    [3, 6],
    [4, 6],
    [4, 7],
    [5, 7],
  ];
  for (const [u, v] of dagEdges) {
    graphAdj[u].push({ v, w: 1 });
    graphEdges.push({ from: u, to: v, w: 1, state: "default" });
  }

  graphIsDirected = true;
  drawGraph();
}

// ── Manual graph editing ─────────────────────────────────────────────────
// In edit mode: click empty canvas → add a node; click two nodes → add an
// (undirected, random-weight) edge; click the same node twice → cancel.
function setGraphHint(t) {
  const el = document.getElementById("graph-status");
  if (el) el.textContent = t;
}

function nodeAtPoint(x, y) {
  for (const n of graphNodes) {
    const dx = n.x - x,
      dy = n.y - y;
    if (dx * dx + dy * dy <= 24 * 24) return n; // 20px node radius + slack
  }
  return null;
}

function toggleGraphEdit() {
  if (running) return;
  graphEditMode = !graphEditMode;
  edgeStartNode = null;
  const btn = document.getElementById("btn-graph-edit");
  if (btn) {
    btn.textContent = graphEditMode ? "✓ Готово" : "✏️ Правка";
    btn.classList.toggle("btn-primary", graphEditMode);
  }
  graphNodes.forEach((n) => (n.state = "default"));
  drawGraph();
  setGraphHint(
    graphEditMode
      ? "Правка: клик по пустому месту — узел; по двум узлам — ребро."
      : "",
  );
}

function clearGraph() {
  if (running) return;
  graphNodes = [];
  graphEdges = [];
  graphAdj = [];
  edgeStartNode = null;
  graphIsDirected = false;
  drawGraph();
  if (!graphEditMode) toggleGraphEdit(); // jump straight into building
  else setGraphHint("Граф очищен. Добавляйте узлы кликом.");
}

function addManualEdge(u, v) {
  const exists = graphEdges.some(
    (e) => (e.from === u && e.to === v) || (e.from === v && e.to === u),
  );
  if (exists) {
    setGraphHint(`Ребро ${u}–${v} уже существует.`);
    return;
  }
  const w = Math.floor(Math.random() * 9) + 1;
  graphAdj[u] = graphAdj[u] || [];
  graphAdj[v] = graphAdj[v] || [];
  graphAdj[u].push({ v, w });
  graphAdj[v].push({ v: u, w });
  graphEdges.push({ from: u, to: v, w, state: "default" });
  setGraphHint(`Добавлено ребро ${u}–${v} (вес ${w}).`);
}

function handleGraphCanvasClick(ev) {
  if (!graphEditMode || running) return;
  const canvas = document.getElementById("graph-canvas");
  const rect = canvas.getBoundingClientRect();
  // CSS size and the canvas backing-store size can differ — scale the point.
  const x = ((ev.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((ev.clientY - rect.top) / rect.height) * canvas.height;
  const hit = nodeAtPoint(x, y);

  if (hit) {
    if (edgeStartNode === null) {
      edgeStartNode = hit.id;
      hit.state = "current";
      drawGraph();
      setGraphHint(`Узел ${hit.id} выбран — кликните второй узел для ребра.`);
    } else if (edgeStartNode === hit.id) {
      graphNodes.forEach((n) => (n.state = "default"));
      edgeStartNode = null;
      drawGraph();
      setGraphHint("Выбор отменён.");
    } else {
      addManualEdge(edgeStartNode, hit.id);
      graphNodes.forEach((n) => (n.state = "default"));
      edgeStartNode = null;
      drawGraph();
    }
  } else {
    const id = graphNodes.length;
    graphNodes.push({ id, x, y, state: "default" });
    graphAdj[id] = [];
    drawGraph();
    setGraphHint(`Добавлен узел ${id}. Всего узлов: ${graphNodes.length}.`);
  }
}

function drawGraph(distArr, srcNode) {
  const canvas = document.getElementById("graph-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const nc = {
    default: PALETTE.blue,
    queued: PALETTE.amber,
    current: PALETTE.red,
    visited: PALETTE.green,
  };
  const ec = {
    default: "rgba(255, 255, 255, 0.18)",
    active: PALETTE.amber,
    relaxed: PALETTE.green,
    mst: PALETTE.purple,
    topo: PALETTE.cyan,
  };

  for (const e of graphEdges) {
    const f = graphNodes[e.from],
      t = graphNodes[e.to];
    const col = ec[e.state || "default"] || ec.default;
    const lw = ["active", "relaxed", "mst", "topo"].includes(e.state) ? 3 : 2;

    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.lineTo(t.x, t.y);
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.stroke();

    if (graphIsDirected) {
      const NODE_R = 20;
      const angle = Math.atan2(t.y - f.y, t.x - f.x);
      const ax = t.x - Math.cos(angle) * (NODE_R + 4);
      const ay = t.y - Math.sin(angle) * (NODE_R + 4);
      const ALEN = 9;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(
        ax - ALEN * Math.cos(angle - Math.PI / 6),
        ay - ALEN * Math.sin(angle - Math.PI / 6),
      );
      ctx.moveTo(ax, ay);
      ctx.lineTo(
        ax - ALEN * Math.cos(angle + Math.PI / 6),
        ay - ALEN * Math.sin(angle + Math.PI / 6),
      );
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke();
    }

    const mx = (f.x + t.x) / 2,
      my = (f.y + t.y) / 2;
    ctx.fillStyle =
      e.state === "relaxed" || e.state === "mst"
        ? col
        : "rgba(255,255,255,0.5)";
    ctx.font = "bold 10px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (!graphIsDirected) ctx.fillText(e.w, mx, my - 7);
  }
  for (const node of graphNodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = nc[node.state] || nc.default;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.id.toString(), node.x, node.y);
    if (distArr) {
      const dv = distArr[node.id];
      ctx.fillStyle =
        node.id === srcNode ? PALETTE.amber : "rgba(255,255,255,0.6)";
      ctx.font = "10px JetBrains Mono";
      ctx.fillText(dv === Infinity ? "∞" : Math.round(dv), node.x, node.y + 32);
    }
  }
}

function resetGraph() {
  running = paused = false;
  if (pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
  graphNodes.forEach((n) => (n.state = "default"));
  graphEdges.forEach((e) => (e.state = "default"));
  edgeStartNode = null;
  opsCount = 0;
  updateOpsDisplay("graph");
  drawGraph();
  const langCodes = CODES[currentLang] || CODES.js;
  document.getElementById("graph-code").innerHTML =
    langCodes[currentGraph] ?? CODES.js[currentGraph] ?? "";
  document.getElementById("graph-status").textContent = "";
  document.getElementById("btn-graph-run").disabled = false;
  const pb = document.getElementById("btn-pause");
  if (pb) pb.textContent = "⏸ Пауза";
  const matEl = document.getElementById("graph-matrix");
  if (matEl && currentGraph !== "floydWarshall") matEl.style.display = "none";
  renderDesc("graph-desc", currentGraph);
}

async function runGraph() {
  if (running) return;
  if (graphNodes.length === 0) {
    document.getElementById("graph-status").textContent =
      "Граф пуст — добавьте узлы или создайте новый граф.";
    return;
  }
  running = true;
  paused = false;
  opsCount = 0;
  updateOpsDisplay("graph");
  document.getElementById("btn-graph-run").disabled = true;
  graphNodes.forEach((n) => (n.state = "default"));
  graphEdges.forEach((e) => (e.state = "default"));
  drawGraph();
  const d = getGraphDelay;
  const status = (t) =>
    (document.getElementById("graph-status").textContent = t);

  if (currentGraph === "bfs") {
    const vis = new Set(),
      q = [0];
    vis.add(0);
    graphNodes[0].state = "queued";
    drawGraph();
    status("BFS: старт с узла 0");
    await delayP(d() * 2);
    while (q.length > 0 && running) {
      const node = q.shift();
      graphNodes[node].state = "current";
      drawGraph();
      status("BFS: обрабатываем узел " + node);
      await delayP(d() * 2);
      opsCount++;
      graphNodes[node].state = "visited";
      for (const { v } of graphAdj[node]) {
        if (!vis.has(v)) {
          vis.add(v);
          q.push(v);
          graphNodes[v].state = "queued";
          drawGraph();
          status("BFS: добавляем " + v + " в очередь");
          await delayP(d());
          opsCount++;
        }
      }
      drawGraph();
      updateOpsDisplay("graph");
    }
    if (running) status("BFS завершён!");
  } else if (currentGraph === "dfs") {
    const vis = new Set();
    async function dfs(node) {
      if (!running) return;
      vis.add(node);
      graphNodes[node].state = "current";
      drawGraph();
      status("DFS: посещаем узел " + node);
      await delayP(d() * 2);
      opsCount++;
      graphNodes[node].state = "visited";
      drawGraph();
      updateOpsDisplay("graph");
      for (const { v } of graphAdj[node]) if (!vis.has(v)) await dfs(v);
    }
    await dfs(0);
    if (running) status("DFS завершён!");
  } else if (currentGraph === "dijkstra") {
    const n = graphNodes.length;
    const dist = new Array(n).fill(Infinity),
      vis = new Array(n).fill(false);
    dist[0] = 0;
    graphNodes[0].state = "queued";
    drawGraph(dist, 0);
    status("Dijkstra: старт с узла 0");
    await delayP(d() * 2);

    for (let iter = 0; iter < n && running; iter++) {
      let u = -1;
      for (let i = 0; i < n; i++)
        if (!vis[i] && (u === -1 || dist[i] < dist[u])) u = i;
      if (dist[u] === Infinity) break;
      vis[u] = true;
      graphNodes[u].state = "current";
      drawGraph(dist, 0);
      status("Dijkstra: узел " + u + ", dist=" + dist[u]);
      await delayP(d() * 2);
      opsCount++;

      for (const { v, w } of graphAdj[u]) {
        if (vis[v]) continue;
        const edge = graphEdges.find(
          (e) => (e.from === u && e.to === v) || (e.from === v && e.to === u),
        );
        if (edge) edge.state = "active";
        drawGraph(dist, 0);
        await delayP(d());
        opsCount++;
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          graphNodes[v].state = "queued";
          if (edge) edge.state = "relaxed";
          status("Relaxation: dist[" + v + "] = " + dist[v]);
          drawGraph(dist, 0);
          await delayP(d() * 1.5);
        } else {
          if (edge) edge.state = "default";
        }
      }
      graphNodes[u].state = "visited";
      drawGraph(dist, 0);
      updateOpsDisplay("graph");
    }
    if (running) {
      status(
        "Dijkstra завершён! [" +
          dist.map((x) => (x === Infinity ? "∞" : x)).join(", ") +
          "]",
      );
      drawGraph(dist, 0);
    }
  } else if (currentGraph === "bellmanFord") {
    const N = graphNodes.length;
    const dist = new Array(N).fill(Infinity);
    dist[0] = 0;
    graphNodes[0].state = "queued";
    drawGraph(dist, 0);
    status("Bellman-Ford: dist[0]=0, остальные=∞");
    await delayP(d() * 2);

    let updated = true;
    for (let iter = 0; iter < N - 1 && running && updated; iter++) {
      updated = false;
      status(`Итерация ${iter + 1} / ${N - 1}: релаксация всех рёбер`);
      for (const e of graphEdges) {
        if (!running) break;
        for (const [src, dst] of [
          [e.from, e.to],
          [e.to, e.from],
        ]) {
          if (dist[src] === Infinity) continue;
          e.state = "active";
          drawGraph(dist, 0);
          await delayP(d());
          opsCount++;
          if (dist[src] + e.w < dist[dst]) {
            dist[dst] = dist[src] + e.w;
            graphNodes[dst].state = "queued";
            e.state = "relaxed";
            status(`dist[${dst}] = ${dist[dst]}`);
            drawGraph(dist, 0);
            await delayP(d());
            updated = true;
          } else {
            e.state = "default";
          }
          updateOpsDisplay("graph");
        }
      }
    }
    graphEdges.forEach((e) => (e.state = "default"));
    graphNodes.forEach((n) => (n.state = "visited"));
    if (running) {
      status(
        "Bellman-Ford завершён! [" +
          dist.map((x) => (x === Infinity ? "∞" : x)).join(", ") +
          "]",
      );
      drawGraph(dist, 0);
    }
  } else if (currentGraph === "astar") {
    const N = graphNodes.length;
    const GOAL = N - 1;
    // Допустимая эвристика: масштабируем евклидово расстояние на МИНИМАЛЬНОе
    // отношение вес/длина среди всех рёбер. Тогда h(i) ≤ реальной стоимости
    // любого пути (т.к. каждое ребро стоит ≥ длина·minRatio), а значит A*
    // гарантированно находит оптимальный путь.
    let minRatio = Infinity;
    for (const e of graphEdges) {
      const f = graphNodes[e.from],
        t = graphNodes[e.to];
      const len = Math.hypot(f.x - t.x, f.y - t.y);
      if (len > 0) minRatio = Math.min(minRatio, e.w / len);
    }
    if (!isFinite(minRatio)) minRatio = 0;
    const heur = (i) => {
      const dx = graphNodes[i].x - graphNodes[GOAL].x;
      const dy = graphNodes[i].y - graphNodes[GOAL].y;
      return Math.hypot(dx, dy) * minRatio;
    };
    const gCost = new Array(N).fill(Infinity);
    const fCost = new Array(N).fill(Infinity);
    gCost[0] = 0;
    fCost[0] = heur(0);
    const openSet = new Set([0]);
    const closedSet = new Set();

    graphNodes[0].state = "queued";
    graphNodes[GOAL].state = "current";
    drawGraph(fCost, 0);
    status(`A*: старт=0, цель=${GOAL}`);
    await delayP(d() * 2);

    while (openSet.size > 0 && running) {
      let cur = -1;
      for (const n of openSet) if (cur === -1 || fCost[n] < fCost[cur]) cur = n;

      if (cur === GOAL) {
        graphNodes[GOAL].state = "visited";
        drawGraph(fCost, 0);
        status(`A* нашёл путь! g(${GOAL})=${gCost[GOAL].toFixed(1)} ✓`);
        break;
      }

      openSet.delete(cur);
      closedSet.add(cur);
      graphNodes[cur].state = "current";
      drawGraph(fCost, 0);
      status(
        `A*: узел ${cur}  f=${fCost[cur].toFixed(1)}  g=${gCost[cur].toFixed(1)}  h=${heur(cur).toFixed(1)}`,
      );
      await delayP(d() * 2);
      opsCount++;
      graphNodes[cur].state = "visited";

      for (const { v: nb, w } of graphAdj[cur]) {
        if (closedSet.has(nb)) continue;
        const tentG = gCost[cur] + w;
        const edge = graphEdges.find(
          (e) =>
            (e.from === cur && e.to === nb) || (e.from === nb && e.to === cur),
        );
        if (edge) edge.state = "active";
        drawGraph(fCost, 0);
        await delayP(d());
        if (tentG < gCost[nb]) {
          gCost[nb] = tentG;
          fCost[nb] = tentG + heur(nb);
          openSet.add(nb);
          graphNodes[nb].state = "queued";
          if (edge) edge.state = "relaxed";
          status(`A*: обновляем ${nb}  f=${fCost[nb].toFixed(1)}`);
          drawGraph(fCost, 0);
          await delayP(d());
        } else {
          if (edge) edge.state = "default";
        }
        opsCount++;
        updateOpsDisplay("graph");
      }
      drawGraph(fCost, 0);
      updateOpsDisplay("graph");
    }
    if (running && openSet.size === 0) status(`Путь до ${GOAL} не найден`);
  } else if (currentGraph === "toposort") {
    const N = graphNodes.length;
    const vis = new Set();
    const order = [];

    async function dfsTopoUtil(node) {
      if (!running) return;
      vis.add(node);
      graphNodes[node].state = "current";
      drawGraph();
      status(`DFS: посещаем узел ${node}`);
      await delayP(d() * 2);
      opsCount++;

      for (const { v } of graphAdj[node]) {
        if (!vis.has(v)) {
          const edge = graphEdges.find((e) => e.from === node && e.to === v);
          if (edge) edge.state = "topo";
          drawGraph();
          await delayP(d());
          await dfsTopoUtil(v);
        }
      }
      graphNodes[node].state = "visited";
      order.unshift(node);
      drawGraph();
      status(`Завершён ${node}. Порядок: [${order.join(" → ")}]`);
      await delayP(d());
      updateOpsDisplay("graph");
    }

    for (let i = 0; i < N && running; i++)
      if (!vis.has(i)) await dfsTopoUtil(i);

    if (running) {
      status(`Топологический порядок: ${order.join(" → ")} ✓`);
      drawGraph();
    }
  } else if (currentGraph === "floydWarshall") {
    const N = graphNodes.length;
    const INF = Infinity;
    const dp = Array.from({ length: N }, (_, i) =>
      Array.from({ length: N }, (_, j) => (i === j ? 0 : INF)),
    );
    for (const { from, to, w } of graphEdges) {
      dp[from][to] = Math.min(dp[from][to], w);
      dp[to][from] = Math.min(dp[to][from], w);
    }

    const matEl = document.getElementById("graph-matrix");
    if (matEl) {
      matEl.style.display = "block";
      renderFWMatrix(matEl, dp, N, -1, -1, -1);
    }
    status("Floyd-Warshall: инициализация матрицы");
    await delayP(d() * 2);

    for (let k = 0; k < N && running; k++) {
      graphNodes[k].state = "current";
      drawGraph();
      for (let i = 0; i < N && running; i++) {
        for (let j = 0; j < N && running; j++) {
          if (dp[i][k] !== INF && dp[k][j] !== INF) {
            const via = dp[i][k] + dp[k][j];
            if (via < dp[i][j]) {
              dp[i][j] = via;
              status(`k=${k}: dp[${i}][${j}] = ${via} (через ${k})`);
              if (matEl) renderFWMatrix(matEl, dp, N, k, i, j);
              opsCount++;
              updateOpsDisplay("graph");
              await delayP(d());
            }
          }
        }
      }
      graphNodes[k].state = "visited";
      drawGraph();
      await delayP(d() * 0.5);
    }
    if (running) {
      status("Floyd-Warshall завершён! Матрица всех кратчайших путей ✓");
      if (matEl) renderFWMatrix(matEl, dp, N, -1, -1, -1);
    }
  } else if (currentGraph === "prim") {
    const N = graphNodes.length;
    const inMST = new Array(N).fill(false);
    const key = new Array(N).fill(Infinity);
    key[0] = 0;
    graphNodes[0].state = "queued";
    drawGraph(key, 0);
    status("Prim: стартуем с узла 0");
    await delayP(d() * 2);
    let mstCost = 0;

    for (let iter = 0; iter < N && running; iter++) {
      let u = -1;
      for (let i = 0; i < N; i++)
        if (!inMST[i] && (u === -1 || key[i] < key[u])) u = i;
      if (u === -1 || key[u] === Infinity) break;

      inMST[u] = true;
      mstCost += key[u];
      graphNodes[u].state = "visited";
      drawGraph(key, 0);
      status(
        `Prim: добавляем узел ${u} (ключ=${key[u]}), MST стоимость=${mstCost}`,
      );
      await delayP(d() * 2);
      opsCount++;

      for (const { v, w } of graphAdj[u]) {
        if (inMST[v]) continue;
        const edge = graphEdges.find(
          (e) => (e.from === u && e.to === v) || (e.from === v && e.to === u),
        );
        if (edge) edge.state = "active";
        drawGraph(key, 0);
        await delayP(d());
        if (w < key[v]) {
          key[v] = w;
          graphNodes[v].state = "queued";
          if (edge) edge.state = "mst";
          status(`Prim: обновляем key[${v}] = ${w}`);
          drawGraph(key, 0);
          await delayP(d());
        } else {
          if (edge) edge.state = "default";
        }
        opsCount++;
        updateOpsDisplay("graph");
      }
    }
    if (running) {
      status(`Prim завершён! Стоимость MST = ${mstCost} ✓`);
      drawGraph(key, 0);
    }
  } else if (currentGraph === "kruskal") {
    const N = graphNodes.length;
    const parent = Array.from({ length: N }, (_, i) => i);
    const rank = new Array(N).fill(0);

    function find(x) {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }
    function unite(x, y) {
      const px = find(x),
        py = find(y);
      if (px === py) return false;
      if (rank[px] < rank[py]) parent[px] = py;
      else if (rank[px] > rank[py]) parent[py] = px;
      else {
        parent[py] = px;
        rank[px]++;
      }
      return true;
    }

    const sorted = [...graphEdges].sort((a, b) => a.w - b.w);
    graphEdges.forEach((e) => (e.state = "default"));
    drawGraph();
    status("Kruskal: рёбра отсортированы по весу");
    await delayP(d() * 2);

    let mstCost = 0,
      mstEdges = 0;
    for (const e of sorted) {
      if (!running) break;
      e.state = "active";
      drawGraph();
      status(`Kruskal: проверяем ребро ${e.from}-${e.to} (w=${e.w})`);
      await delayP(d() * 2);
      opsCount++;

      if (unite(e.from, e.to)) {
        e.state = "mst";
        mstCost += e.w;
        mstEdges++;
        graphNodes[e.from].state = "visited";
        graphNodes[e.to].state = "visited";
        drawGraph();
        status(
          `Kruskal: добавляем ${e.from}-${e.to}, MST стоимость=${mstCost}`,
        );
        await delayP(d() * 1.5);
        if (mstEdges === N - 1) break;
      } else {
        e.state = "default";
        drawGraph();
        status(`Kruskal: ребро ${e.from}-${e.to} создаёт цикл — пропускаем`);
        await delayP(d());
      }
      updateOpsDisplay("graph");
    }
    if (running) {
      status(`Kruskal завершён! Стоимость MST = ${mstCost} ✓`);
      drawGraph();
    }
  }

  running = false;
  document.getElementById("btn-graph-run").disabled = false;
}

function renderFWMatrix(container, dp, N, k, hi, hj) {
  const INF = Infinity;
  let html =
    '<table style="border-collapse:collapse;font-size:10px;font-family:var(--font-mono);margin-top:8px;width:100%">';
  html += "<tr><th style='padding:3px 5px;color:var(--muted)'></th>";
  for (let j = 0; j < N; j++)
    html += `<th style="padding:3px 5px;color:var(--muted)">${j}</th>`;
  html += "</tr>";
  for (let i = 0; i < N; i++) {
    html += `<tr><th style="padding:3px 5px;color:var(--muted)">${i}</th>`;
    for (let j = 0; j < N; j++) {
      const isActive = i === hi && j === hj;
      const isK = i === k || j === k;
      const bg = isActive
        ? withAlpha("amber", 0.35)
        : isK && k >= 0
          ? withAlpha("blue", 0.15)
          : "transparent";
      const col =
        dp[i][j] === INF
          ? "var(--muted)"
          : isActive
            ? "var(--amber)"
            : "var(--text)";
      const val = dp[i][j] === INF ? "∞" : dp[i][j];
      html += `<td style="padding:3px 5px;background:${bg};color:${col};text-align:center;border:1px solid var(--border)">${val}</td>`;
    }
    html += "</tr>";
  }
  html += "</table>";
  container.innerHTML =
    '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Матрица расстояний dp[i][j]</div>' +
    html;
}

function resetDP() {
  running = paused = false;
  if (pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
  opsCount = 0;
  updateOpsDisplay("dp");
  const viz = document.getElementById("dp-viz");
  viz.innerHTML = "";
  document.getElementById("dp-code").innerHTML = CODES[currentLang][currentDP];
  document.getElementById("dp-status").textContent = "";
  document.getElementById("btn-dp-run").disabled = false;
  const pb = document.getElementById("btn-dp-pause");
  if (pb) pb.textContent = "⏸ Пауза";

  if (currentDP === "fib") {
    viz.innerHTML = '<div class="fib-sequence" id="fib-container"></div>';
    const c = document.getElementById("fib-container");
    for (let i = 0; i <= 10; i++) {
      const item = document.createElement("div");
      item.className = "dp-cell lg";
      item.id = "fib-" + i;
      item.innerHTML =
        '<div style="font-size:10px;color:var(--muted)">F(' +
        i +
        ')</div><div id="fib-val-' +
        i +
        '">?</div>';
      c.appendChild(item);
    }
  } else if (currentDP === "knapsack") {
    viz.innerHTML =
      '<div class="dp-grid" id="knapsack-grid"></div><div style="margin-top:10px;font-size:12px;color:var(--muted)" id="knapsack-info"></div>';
    const grid = document.getElementById("knapsack-grid");
    grid.style.gridTemplateColumns = "repeat(9, 36px)";
    for (let i = 0; i <= 4; i++)
      for (let w = 0; w <= 8; w++) {
        const cell = document.createElement("div");
        cell.className = "dp-cell";
        cell.id = "dp-" + i + "-" + w;
        cell.textContent = "0";
        if (i === 0) cell.style.background = withAlpha("green", 0.1);
        grid.appendChild(cell);
      }
    document.getElementById("knapsack-info").textContent =
      "Веса: [2,3,4,5] | Ценности: [3,4,5,6] | Вместимость: 8";
  } else if (currentDP === "lcs") {
    buildLCSGrid();
  } else if (currentDP === "lis") {
    buildLISBars();
  } else if (currentDP === "coinChange") {
    buildCoinChangeGrid();
  } else if (currentDP === "editDistance") {
    buildEditDistGrid();
  } else if (currentDP === "matrixChain") {
    buildMatrixChainGrid();
  } else if (currentDP === "rodCutting") {
    buildRodCuttingBars();
  }
  renderDesc("dp-desc", currentDP);
}

function buildLCSGrid() {
  const A = [3, 1, 4, 1, 5, 9, 2, 6],
    B = [1, 5, 4, 1, 2, 6, 3];
  const m = A.length,
    n = B.length;
  const viz = document.getElementById("dp-viz");
  viz.innerHTML =
    '<div style="font-size:11px;color:var(--muted);margin-bottom:6px">A = [' +
    A.join(", ") +
    "] &nbsp; B = [" +
    B.join(", ") +
    ']</div><div class="dp-grid" id="lcs-grid"></div>';
  const grid = document.getElementById("lcs-grid");
  grid.style.gridTemplateColumns = "repeat(" + (n + 2) + ", 36px)";
  function hCell(txt) {
    const c = document.createElement("div");
    c.className = "dp-cell";
    c.style.background = withAlpha("blue", 0.1);
    c.textContent = txt;
    return c;
  }
  grid.appendChild(hCell(""));
  grid.appendChild(hCell("∅"));
  for (let j = 0; j < n; j++) grid.appendChild(hCell(B[j]));
  for (let i = 0; i <= m; i++) {
    grid.appendChild(hCell(i === 0 ? "∅" : A[i - 1]));
    for (let j = 0; j <= n; j++) {
      const cell = document.createElement("div");
      cell.className = "dp-cell";
      cell.id = "lcs-" + i + "-" + j;
      cell.textContent = "0";
      if (i === 0 || j === 0) cell.style.background = withAlpha("green", 0.1);
      grid.appendChild(cell);
    }
  }
}

function buildLISBars() {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
  const viz = document.getElementById("dp-viz");
  viz.innerHTML =
    '<div style="font-size:11px;color:var(--muted);margin-bottom:8px">arr = [' +
    arr.join(", ") +
    ']</div><div style="display:flex;gap:6px;align-items:flex-end;justify-content:center;height:120px;margin-bottom:8px" id="lis-bars"></div><div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap" id="lis-dp-row"></div>';
  const barsDiv = document.getElementById("lis-bars");
  const dpDiv = document.getElementById("lis-dp-row");
  arr.forEach((v, i) => {
    const bar = document.createElement("div");
    bar.style.cssText =
      "width:30px;background:" +
      PALETTE.blue +
      ";border-radius:3px 3px 0 0;height:" +
      (v * 10 + 10) +
      "px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:2px;font-size:10px;color:rgba(255,255,255,0.8);font-weight:700;transition:background 0.2s";
    bar.textContent = v;
    bar.id = "lis-bar-" + i;
    barsDiv.appendChild(bar);
    const dp = document.createElement("div");
    dp.className = "dp-cell";
    dp.id = "lis-dp-" + i;
    dp.innerHTML =
      '<div style="font-size:9px;color:var(--muted)">dp[' +
      i +
      ']</div><div id="lis-dpv-' +
      i +
      '">1</div>';
    dpDiv.appendChild(dp);
  });
}

function buildCoinChangeGrid() {
  const coins = [1, 3, 4, 5],
    amount = 7;
  const viz = document.getElementById("dp-viz");
  viz.innerHTML =
    '<div style="font-size:11px;color:var(--muted);margin-bottom:6px">Монеты: [' +
    coins.join(", ") +
    "] | Сумма: " +
    amount +
    '</div><div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap" id="coin-row"></div>' +
    '<div style="font-size:10px;color:var(--muted);margin-top:8px">dp[i] = минимум монет для суммы i</div>';
  const row = document.getElementById("coin-row");
  for (let i = 0; i <= amount; i++) {
    const cell = document.createElement("div");
    cell.className = "dp-cell";
    cell.id = "cc-" + i;
    cell.innerHTML =
      '<div style="font-size:9px;color:var(--muted)">dp[' +
      i +
      ']</div><div id="cc-v-' +
      i +
      '">' +
      (i === 0 ? "0" : "∞") +
      "</div>";
    row.appendChild(cell);
  }
}

function buildEditDistGrid() {
  const A = "ALGO",
    B = "LOG";
  const m = A.length,
    n = B.length;
  const viz = document.getElementById("dp-viz");
  viz.innerHTML =
    '<div style="font-size:11px;color:var(--muted);margin-bottom:6px">A = "' +
    A +
    '" &nbsp; B = "' +
    B +
    '"</div><div class="dp-grid" id="ed-grid"></div>';
  const grid = document.getElementById("ed-grid");
  grid.style.gridTemplateColumns = "repeat(" + (n + 2) + ", 36px)";
  function hCell(txt) {
    const c = document.createElement("div");
    c.className = "dp-cell";
    c.style.background = withAlpha("blue", 0.1);
    c.textContent = txt;
    return c;
  }
  grid.appendChild(hCell(""));
  grid.appendChild(hCell("∅"));
  for (let j = 0; j < n; j++) grid.appendChild(hCell(B[j]));
  for (let i = 0; i <= m; i++) {
    grid.appendChild(hCell(i === 0 ? "∅" : A[i - 1]));
    for (let j = 0; j <= n; j++) {
      const cell = document.createElement("div");
      cell.className = "dp-cell";
      cell.id = "ed-" + i + "-" + j;
      cell.textContent = i === 0 ? j : j === 0 ? i : "?";
      if (i === 0 || j === 0) cell.style.background = withAlpha("green", 0.1);
      grid.appendChild(cell);
    }
  }
}

function buildMatrixChainGrid() {
  const n = 4;
  const viz = document.getElementById("dp-viz");
  viz.innerHTML =
    '<div style="font-size:11px;color:var(--muted);margin-bottom:6px">A₀(10×30) · A₁(30×5) · A₂(5×60) · A₃(60×10)</div>' +
    '<div class="dp-grid" id="mc-grid"></div>' +
    '<div style="font-size:10px;color:var(--muted);margin-top:6px" id="mc-info">dp[i][j] = минимум скалярных умножений</div>';
  const grid = document.getElementById("mc-grid");
  grid.style.gridTemplateColumns = "repeat(" + (n + 1) + ", 36px)";
  function hCell(txt) {
    const c = document.createElement("div");
    c.className = "dp-cell";
    c.style.background = withAlpha("blue", 0.1);
    c.textContent = txt;
    return c;
  }
  grid.appendChild(hCell("i\\j"));
  for (let j = 0; j < n; j++) grid.appendChild(hCell(j));
  for (let i = 0; i < n; i++) {
    grid.appendChild(hCell(i));
    for (let j = 0; j < n; j++) {
      const cell = document.createElement("div");
      cell.className = "dp-cell";
      cell.id = "mc-" + i + "-" + j;
      cell.textContent = i === j ? "0" : i > j ? "—" : "?";
      if (i > j) cell.style.opacity = "0.3";
      grid.appendChild(cell);
    }
  }
}

function buildRodCuttingBars() {
  const prices = [1, 5, 8, 9, 10, 17, 17, 20];
  const n = prices.length;
  const viz = document.getElementById("dp-viz");
  viz.innerHTML =
    '<div style="font-size:11px;color:var(--muted);margin-bottom:8px">Цены: [' +
    prices.join(", ") +
    "] для длин [1.." +
    n +
    "]</div>" +
    '<div style="display:flex;gap:6px;align-items:flex-end;justify-content:center;height:120px;margin-bottom:8px" id="rc-bars"></div>' +
    '<div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap" id="rc-dp-row"></div>';
  const barsDiv = document.getElementById("rc-bars");
  const dpDiv = document.getElementById("rc-dp-row");
  prices.forEach((v, i) => {
    const bar = document.createElement("div");
    bar.style.cssText =
      "width:30px;background:" +
      PALETTE.blue +
      ";border-radius:3px 3px 0 0;height:" +
      (v * 5 + 10) +
      "px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:2px;" +
      "font-size:10px;color:rgba(255,255,255,0.8);font-weight:700;transition:background 0.2s";
    bar.textContent = v;
    bar.id = "rc-bar-" + i;
    barsDiv.appendChild(bar);
    const dp = document.createElement("div");
    dp.className = "dp-cell";
    dp.id = "rc-dp-" + i;
    dp.innerHTML =
      '<div style="font-size:9px;color:var(--muted)">dp[' +
      (i + 1) +
      ']</div><div id="rc-dpv-' +
      i +
      '">0</div>';
    dpDiv.appendChild(dp);
  });
}

async function runDP() {
  if (running) return;
  running = true;
  paused = false;
  opsCount = 0;
  updateOpsDisplay("dp");
  document.getElementById("btn-dp-run").disabled = true;
  const d = getDPDelay;
  const status = (t) => (document.getElementById("dp-status").textContent = t);

  if (currentDP === "fib") {
    const n = 10,
      dp = new Array(n + 1).fill(0);
    dp[1] = 1;
    document.getElementById("fib-val-0").textContent = "0";
    document.getElementById("fib-0").classList.add("computed");
    document.getElementById("fib-val-1").textContent = "1";
    document.getElementById("fib-1").classList.add("computed");
    for (let i = 2; i <= n && running; i++) {
      document.getElementById("fib-" + i).classList.add("computing");
      document.getElementById("fib-" + (i - 1)).classList.add("current");
      document.getElementById("fib-" + (i - 2)).classList.add("current");
      status(
        "F(" +
          i +
          ") = F(" +
          (i - 1) +
          ") + F(" +
          (i - 2) +
          ") = " +
          dp[i - 1] +
          " + " +
          dp[i - 2],
      );
      await delayP(d() * 2);
      opsCount++;
      dp[i] = dp[i - 1] + dp[i - 2];
      document.getElementById("fib-val-" + i).textContent = dp[i];
      document.getElementById("fib-" + i).classList.remove("computing");
      document.getElementById("fib-" + i).classList.add("computed");
      document.getElementById("fib-" + (i - 1)).classList.remove("current");
      document.getElementById("fib-" + (i - 2)).classList.remove("current");
      await delayP(d());
      updateOpsDisplay("dp");
    }
    if (running) status("F(" + 10 + ") = " + dp[10] + " ✓");
  } else if (currentDP === "knapsack") {
    const weights = [2, 3, 4, 5],
      values = [3, 4, 5, 6],
      W = 8,
      n = 4;
    const dp = Array(n + 1)
      .fill(null)
      .map(() => Array(W + 1).fill(0));
    for (let i = 1; i <= n && running; i++) {
      for (let w = 0; w <= W && running; w++) {
        const cell = document.getElementById("dp-" + i + "-" + w);
        cell.classList.add("computing");
        const depA = document.getElementById("dp-" + (i - 1) + "-" + w);
        if (depA) depA.classList.add("current");
        let depL = null;
        if (weights[i - 1] <= w) {
          depL = document.getElementById(
            "dp-" + (i - 1) + "-" + (w - weights[i - 1]),
          );
          if (depL) depL.classList.add("current");
        }
        if (weights[i - 1] <= w) {
          const inc = values[i - 1] + dp[i - 1][w - weights[i - 1]],
            exc = dp[i - 1][w];
          dp[i][w] = Math.max(inc, exc);
          status(
            "Предмет " +
              i +
              ", вес " +
              w +
              ": max(" +
              inc +
              ", " +
              exc +
              ") = " +
              dp[i][w],
          );
        } else {
          dp[i][w] = dp[i - 1][w];
          status("Предмет " + i + " не помещается, вес " + w + ": " + dp[i][w]);
        }
        await delayP(d());
        opsCount++;
        cell.textContent = dp[i][w];
        cell.classList.remove("computing");
        cell.classList.add("computed");
        if (depA) depA.classList.remove("current");
        if (depL) depL.classList.remove("current");
        updateOpsDisplay("dp");
      }
    }
    if (running) status("Максимальная ценность: " + dp[n][W] + " ✓");
  } else if (currentDP === "lcs") {
    const A = [3, 1, 4, 1, 5, 9, 2, 6],
      B = [1, 5, 4, 1, 2, 6, 3];
    const m = A.length,
      n = B.length;
    const dp = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0));
    for (let i = 1; i <= m && running; i++) {
      for (let j = 1; j <= n && running; j++) {
        const cell = document.getElementById("lcs-" + i + "-" + j);
        cell.classList.add("computing");
        const d1 = document.getElementById("lcs-" + (i - 1) + "-" + (j - 1));
        const d2 = document.getElementById("lcs-" + (i - 1) + "-" + j);
        const d3 = document.getElementById("lcs-" + i + "-" + (j - 1));
        [d1, d2, d3].forEach((x) => x && x.classList.add("current"));
        if (A[i - 1] === B[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          status(
            "A[" +
              A[i - 1] +
              "]==B[" +
              B[j - 1] +
              "] → dp[" +
              i +
              "][" +
              j +
              "]=" +
              dp[i][j],
          );
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          status(
            "A[" +
              A[i - 1] +
              "]≠B[" +
              B[j - 1] +
              "] → max(" +
              dp[i - 1][j] +
              "," +
              dp[i][j - 1] +
              ")=" +
              dp[i][j],
          );
        }
        await delayP(d());
        opsCount++;
        cell.textContent = dp[i][j];
        cell.classList.remove("computing");
        cell.classList.add("computed");
        [d1, d2, d3].forEach((x) => x && x.classList.remove("current"));
        updateOpsDisplay("dp");
      }
    }
    if (running) status("LCS длина = " + dp[m][n] + " ✓");
  } else if (currentDP === "lis") {
    const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
      n = arr.length,
      dp = new Array(n).fill(1);
    for (let i = 1; i < n && running; i++) {
      document.getElementById("lis-bar-" + i).style.background = PALETTE.amber;
      document.getElementById("lis-dp-" + i).classList.add("computing");
      for (let j = 0; j < i && running; j++) {
        document.getElementById("lis-bar-" + j).style.background = PALETTE.red;
        status("arr[" + i + "]=" + arr[i] + " vs arr[" + j + "]=" + arr[j]);
        await delayP(d());
        opsCount++;
        if (arr[j] < arr[i]) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
          document.getElementById("lis-dpv-" + i).textContent = dp[i];
          document.getElementById("lis-bar-" + i).style.background = PALETTE.purple;
        }
        document.getElementById("lis-bar-" + j).style.background = PALETTE.green;
        updateOpsDisplay("dp");
      }
      document.getElementById("lis-dp-" + i).classList.remove("computing");
      document.getElementById("lis-dp-" + i).classList.add("computed");
      document.getElementById("lis-bar-" + i).style.background = PALETTE.green;
    }
    if (running) {
      const best = Math.max(...dp);
      status("LIS длина = " + best + " ✓");
    }
  } else if (currentDP === "coinChange") {
    const coins = [1, 3, 4, 5],
      amount = 7;
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    document.getElementById("cc-v-0").textContent = "0";
    document.getElementById("cc-0").classList.add("computed");
    status("Coin Change: dp[0]=0, остальные=∞");
    await delayP(d() * 2);

    for (let i = 1; i <= amount && running; i++) {
      const cell = document.getElementById("cc-" + i);
      cell.classList.add("computing");
      for (const c of coins) {
        if (!running) break;
        if (c <= i && dp[i - c] !== Infinity) {
          const prev = document.getElementById("cc-" + (i - c));
          if (prev) prev.classList.add("current");
          status(
            "dp[" +
              i +
              "]: монета " +
              c +
              " → dp[" +
              (i - c) +
              "]+1=" +
              (dp[i - c] + 1) +
              (dp[i - c] + 1 < dp[i] ? " ← лучше!" : ""),
          );
          await delayP(d());
          opsCount++;
          if (dp[i - c] + 1 < dp[i]) {
            dp[i] = dp[i - c] + 1;
            document.getElementById("cc-v-" + i).textContent = dp[i];
          }
          if (prev) prev.classList.remove("current");
        }
        updateOpsDisplay("dp");
      }
      cell.classList.remove("computing");
      cell.classList.add("computed");
      await delayP(d() * 0.5);
    }
    if (running) {
      status(
        "Минимум монет для " +
          amount +
          ": " +
          (dp[amount] === Infinity ? "невозможно" : dp[amount]) +
          " ✓",
      );
    }
  } else if (currentDP === "editDistance") {
    const A = "ALGO",
      B = "LOG";
    const m = A.length,
      n = B.length;
    const dp = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
    );
    status("Edit Distance: базовые случаи заполнены");
    await delayP(d() * 2);

    for (let i = 1; i <= m && running; i++) {
      for (let j = 1; j <= n && running; j++) {
        const cell = document.getElementById("ed-" + i + "-" + j);
        cell.classList.add("computing");
        const d1 = document.getElementById("ed-" + (i - 1) + "-" + (j - 1));
        const d2 = document.getElementById("ed-" + (i - 1) + "-" + j);
        const d3 = document.getElementById("ed-" + i + "-" + (j - 1));
        [d1, d2, d3].forEach((x) => x && x.classList.add("current"));

        if (A[i - 1] === B[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          status(
            "'" +
              A[i - 1] +
              "'=='" +
              B[j - 1] +
              "' → dp[" +
              i +
              "][" +
              j +
              "]=" +
              dp[i][j] +
              " (без операции)",
          );
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
          status(
            "'" +
              A[i - 1] +
              "'≠'" +
              B[j - 1] +
              "' → 1+min(" +
              dp[i - 1][j - 1] +
              "," +
              dp[i - 1][j] +
              "," +
              dp[i][j - 1] +
              ")=" +
              dp[i][j],
          );
        }
        await delayP(d());
        opsCount++;
        cell.textContent = dp[i][j];
        cell.classList.remove("computing");
        cell.classList.add("computed");
        [d1, d2, d3].forEach((x) => x && x.classList.remove("current"));
        updateOpsDisplay("dp");
      }
    }
    if (running)
      status('Edit Distance ("' + A + '" → "' + B + '") = ' + dp[m][n] + " ✓");
  } else if (currentDP === "matrixChain") {
    const dims = [10, 30, 5, 60, 10];
    const n = dims.length - 1;
    const dp = Array.from({ length: n }, () => new Array(n).fill(0));

    status("Matrix Chain: dp[i][i]=0 (одна матрица — 0 умножений)");
    await delayP(d() * 2);

    for (let len = 2; len <= n && running; len++) {
      for (let i = 0; i <= n - len && running; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;
        const cell = document.getElementById("mc-" + i + "-" + j);
        if (cell) cell.classList.add("computing");

        for (let k = i; k < j && running; k++) {
          const cost =
            dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
          status(
            "dp[" +
              i +
              "][" +
              j +
              "] k=" +
              k +
              ": " +
              dp[i][k] +
              "+" +
              dp[k + 1][j] +
              "+" +
              dims[i] +
              "×" +
              dims[k + 1] +
              "×" +
              dims[j + 1] +
              "=" +
              cost,
          );
          await delayP(d());
          opsCount++;
          if (cost < dp[i][j]) {
            dp[i][j] = cost;
            if (cell) cell.textContent = cost;
          }
          updateOpsDisplay("dp");
        }
        if (cell) {
          cell.classList.remove("computing");
          cell.classList.add("computed");
        }
        await delayP(d() * 0.3);
      }
    }
    if (running) {
      const ans = dp[0][n - 1];
      status("Matrix Chain: минимум операций = " + ans + " ✓");
      const info = document.getElementById("mc-info");
      if (info) info.textContent = "Минимум скалярных умножений: " + ans;
    }
  } else if (currentDP === "rodCutting") {
    const prices = [1, 5, 8, 9, 10, 17, 17, 20];
    const n = prices.length;
    const dp = new Array(n + 1).fill(0);

    status("Rod Cutting: dp[0]=0 (длина 0 → прибыль 0)");
    await delayP(d() * 2);

    for (let len = 1; len <= n && running; len++) {
      const dpCell = document.getElementById("rc-dp-" + (len - 1));
      const bar = document.getElementById("rc-bar-" + (len - 1));
      if (dpCell) dpCell.classList.add("computing");
      if (bar) bar.style.background = PALETTE.amber;

      for (let cut = 1; cut <= len && running; cut++) {
        const cutBar = document.getElementById("rc-bar-" + (cut - 1));
        if (cutBar) cutBar.style.background = PALETTE.red;
        const val = prices[cut - 1] + dp[len - cut];
        status(
          "длина " +
            len +
            ": разрез=" +
            cut +
            " → p[" +
            cut +
            "]=" +
            prices[cut - 1] +
            " + dp[" +
            (len - cut) +
            "]=" +
            val,
        );
        await delayP(d());
        opsCount++;
        if (val > dp[len]) {
          dp[len] = val;
          if (dpCell)
            document.getElementById("rc-dpv-" + (len - 1)).textContent =
              dp[len];
        }
        if (cutBar) cutBar.style.background = PALETTE.green;
        updateOpsDisplay("dp");
      }
      if (dpCell) {
        dpCell.classList.remove("computing");
        dpCell.classList.add("computed");
      }
      if (bar) bar.style.background = PALETTE.green;
      await delayP(d() * 0.3);
    }
    if (running)
      status("Rod Cutting: макс. прибыль для n=" + n + " = " + dp[n] + " ✓");
  }

  running = false;
  document.getElementById("btn-dp-run").disabled = false;
}

window.addEventListener("load", () => {
  resetSort();
  resetSearch();
  generateGraph();
  resetDP();
  const gc = document.getElementById("graph-canvas");
  if (gc) {
    gc.addEventListener("click", handleGraphCanvasClick);
    gc.style.cursor = "pointer";
  }
});
