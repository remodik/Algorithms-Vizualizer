let graphNodes = [];
let graphEdges = [];
let graphAdj = [];
let pauseResolve = null;
let paused = false;
let opsCount = 0;

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

  drawGraph();
}

function drawGraph(distArr, srcNode) {
  const canvas = document.getElementById("graph-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const nc = {
    default: "#4f8ef7",
    queued: "#f0a030",
    current: "#e85555",
    visited: "#3ec98a",
  };
  const ec = {
    default: "rgba(255,255,255,0.18)",
    active: "#f0a030",
    relaxed: "#3ec98a",
  };

  for (const e of graphEdges) {
    const f = graphNodes[e.from],
      t = graphNodes[e.to];
    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.lineTo(t.x, t.y);
    ctx.strokeStyle = ec[e.state || "default"] || ec.default;
    ctx.lineWidth = e.state === "active" || e.state === "relaxed" ? 3 : 2;
    ctx.stroke();
    const mx = (f.x + t.x) / 2,
      my = (f.y + t.y) / 2;
    ctx.fillStyle = e.state === "relaxed" ? "#3ec98a" : "rgba(255,255,255,0.5)";
    ctx.font = "bold 10px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(e.w, mx, my - 7);
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
      ctx.fillStyle = node.id === srcNode ? "#f0a030" : "rgba(255,255,255,0.6)";
      ctx.font = "10px JetBrains Mono";
      ctx.fillText(dv === Infinity ? "∞" : dv, node.x, node.y + 32);
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
  opsCount = 0;
  updateOpsDisplay("graph");
  drawGraph();
  document.getElementById("graph-code").innerHTML =
    CODES[currentLang][currentGraph];
  document.getElementById("graph-status").textContent = "";
  document.getElementById("btn-graph-run").disabled = false;
  const pb = document.getElementById("btn-pause");
  if (pb) {
    pb.textContent = "⏸ Пауза";
  }
  renderDesc("graph-desc", currentGraph);
}

async function runGraph() {
  if (running) return;
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
  }

  running = false;
  document.getElementById("btn-graph-run").disabled = false;
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
      item.className = "fib-item";
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
    grid.style.gridTemplateColumns = "repeat(9, 1fr)";
    for (let i = 0; i <= 4; i++)
      for (let w = 0; w <= 8; w++) {
        const cell = document.createElement("div");
        cell.className = "dp-cell";
        cell.id = "dp-" + i + "-" + w;
        cell.textContent = "0";
        if (i === 0) cell.style.background = "rgba(62,201,138,0.1)";
        grid.appendChild(cell);
      }
    document.getElementById("knapsack-info").textContent =
      "Веса: [2,3,4,5] | Ценности: [3,4,5,6] | Вместимость: 8";
  } else if (currentDP === "lcs") {
    buildLCSGrid();
  } else if (currentDP === "lis") {
    buildLISBars();
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
  grid.style.gridTemplateColumns = "repeat(" + (n + 2) + ", 1fr)";
  function hCell(txt) {
    const c = document.createElement("div");
    c.className = "dp-cell";
    c.style.background = "rgba(79,142,247,0.1)";
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
      if (i === 0 || j === 0) cell.style.background = "rgba(62,201,138,0.1)";
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
      "width:30px;background:#4f8ef7;border-radius:3px 3px 0 0;height:" +
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
      document.getElementById("lis-bar-" + i).style.background = "#f0a030";
      document.getElementById("lis-dp-" + i).classList.add("computing");
      for (let j = 0; j < i && running; j++) {
        document.getElementById("lis-bar-" + j).style.background = "#e85555";
        status("arr[" + i + "]=" + arr[i] + " vs arr[" + j + "]=" + arr[j]);
        await delayP(d());
        opsCount++;
        if (arr[j] < arr[i]) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
          document.getElementById("lis-dpv-" + i).textContent = dp[i];
          document.getElementById("lis-bar-" + i).style.background = "#9b6dff";
        }
        document.getElementById("lis-bar-" + j).style.background = "#3ec98a";
        updateOpsDisplay("dp");
      }
      document.getElementById("lis-dp-" + i).classList.remove("computing");
      document.getElementById("lis-dp-" + i).classList.add("computed");
      document.getElementById("lis-bar-" + i).style.background = "#3ec98a";
    }
    if (running) {
      const best = Math.max(...dp);
      status("LIS длина = " + best + " ✓");
    }
  }

  running = false;
  document.getElementById("btn-dp-run").disabled = false;
}

window.addEventListener("load", () => {
  resetSort();
  resetSearch();
  generateGraph();
  resetDP();
});
