function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function getDelay() {
  return [300, 180, 90, 40, 10][
    +document.getElementById("speed-slider").value - 1
  ];
}
function getGraphDelay() {
  return [400, 250, 150, 80, 30][
    +document.getElementById("graph-speed-slider").value - 1
  ];
}
function getDPDelay() {
  return [400, 250, 150, 80, 30][
    +document.getElementById("dp-speed-slider").value - 1
  ];
}

function genArr(n = 14, sorted = false) {
  const a = Array.from(
    { length: n },
    () => Math.floor(Math.random() * 75) + 10,
  );
  return sorted ? a.sort((a, b) => a - b) : a;
}

function renderBars(id, values, states = {}) {
  const c = document.getElementById(id);
  if (!c) return;
  const maxV = Math.max(...values, 1);
  const w = Math.max(
    14,
    Math.floor((c.offsetWidth - values.length * 3) / values.length),
  );
  c.innerHTML = values
    .map((v, i) => {
      const cls = states[i] || "default";
      const h = Math.round((v / maxV) * 100) + 10;
      return `<div class="bar" style="height:${h}px;width:${w}px;background:${COLORS[cls] || COLORS.default}">${v}</div>`;
    })
    .join("");
}

function switchLang(lang) {
  if (running) return;
  currentLang = lang;
  document
    .querySelectorAll(".lang-btn")
    .forEach((b) => b.classList.remove("active"));
  const btn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
  if (btn) btn.classList.add("active");
  try {
    localStorage.setItem("av-lang", lang);
  } catch (e) {}
  updateCodeDisplay();
}

function updateCodeDisplay() {
  const langCodes = CODES[currentLang] || CODES.js;
  if (document.getElementById("section-sort").classList.contains("active")) {
    document.getElementById("sort-code").innerHTML =
      langCodes[currentAlgo] ?? CODES.js[currentAlgo] ?? "";
    renderDesc("sort-desc", currentAlgo);
  } else if (
    document.getElementById("section-search").classList.contains("active")
  ) {
    document.getElementById("search-code").innerHTML =
      langCodes[currentSearch] ?? CODES.js[currentSearch] ?? "";
    renderDesc("search-desc", currentSearch);
  } else if (
    document.getElementById("section-graph").classList.contains("active")
  ) {
    document.getElementById("graph-code").innerHTML =
      langCodes[currentGraph] ?? CODES.js[currentGraph] ?? "";
    renderDesc("graph-desc", currentGraph);
  } else if (
    document.getElementById("section-dp").classList.contains("active")
  ) {
    document.getElementById("dp-code").innerHTML =
      langCodes[currentDP] ?? CODES.js[currentDP] ?? "";
    renderDesc("dp-desc", currentDP);
  } else if (
    document.getElementById("section-hash")?.classList.contains("active")
  ) {
    document.getElementById("hash-code").innerHTML =
      langCodes[currentHash] ?? CODES.js[currentHash] ?? "";
    renderDesc("hash-desc", currentHash);
  } else if (
    document.getElementById("section-backtrack")?.classList.contains("active")
  ) {
    document.getElementById("backtrack-code").innerHTML =
      langCodes[currentBacktrack] ?? CODES.js[currentBacktrack] ?? "";
    renderDesc("backtrack-desc", currentBacktrack);
  } else if (
    document.getElementById("section-string")?.classList.contains("active")
  ) {
    document.getElementById("string-code").innerHTML =
      langCodes[currentString] ?? CODES.js[currentString] ?? "";
    renderDesc("string-desc", currentString);
  } else if (
    document.getElementById("section-tree")?.classList.contains("active")
  ) {
    document.getElementById("tree-code").innerHTML =
      langCodes[currentTree] ?? CODES.js[currentTree] ?? "";
    renderDesc("tree-desc", currentTree);
  }
}

function selectAlgo(name) {
  if (running) return;
  currentAlgo = name;
  document
    .querySelectorAll("#section-sort .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  document.getElementById("card-" + name).classList.add("selected");
  resetSort();
  syncURL();
}

function selectSearch(name) {
  if (running) return;
  currentSearch = name;
  document
    .querySelectorAll("#section-search .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  document.getElementById("card-" + name).classList.add("selected");
  resetSearch();
  syncURL();
}

function selectGraph(name) {
  if (running) return;
  currentGraph = name;
  document
    .querySelectorAll("#section-graph .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  document.getElementById("card-" + name).classList.add("selected");
  if (name === "toposort") generateDAG();
  else if (graphIsDirected) generateGraph();
  resetGraph();
  syncURL();
}

function selectDP(name) {
  if (running) return;
  currentDP = name;
  document
    .querySelectorAll("#section-dp .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  document.getElementById("card-" + name).classList.add("selected");
  resetDP();
  syncURL();
}

function switchSection(name, el) {
  running = false;
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document.getElementById("section-" + name).classList.add("active");
  el.classList.add("active");
  if (name === "sort") resetSort();
  else if (name === "search") resetSearch();
  else if (name === "graph") {
    // The canvas has no size until its section is visible, so a graph
    // generated on load (while hidden) lays out into a 0×0 canvas. Generate
    // it now that the section is shown and the canvas can be measured.
    const c = document.getElementById("graph-canvas");
    if (c && (c.width === 0 || graphNodes.length === 0)) {
      if (currentGraph === "toposort") generateDAG();
      else generateGraph();
    }
    resetGraph();
  } else if (name === "dp") resetDP();
  else if (name === "hash") resetHash();
  else if (name === "backtrack") resetBacktrack();
  else if (name === "string") resetString();
  else if (name === "tree") resetTree();
  syncURL();
}

function resetSort() {
  running = false;
  const ci = document.getElementById("custom-arr-input");
  if (ci && ci.value.trim()) {
    const p = ci.value
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((x) => !isNaN(x) && x > 0 && x <= 99);
    sortArr = p.length >= 2 ? p : genArr(14);
  } else {
    sortArr = genArr(14);
  }
  renderBars("sort-viz", sortArr, {});
  const lc = CODES[currentLang] || CODES.js;
  document.getElementById("sort-code").innerHTML =
    lc[currentAlgo] ?? CODES.js[currentAlgo] ?? "";
  document.getElementById("sort-status").textContent = "Нажми «Запустить»";
  document.getElementById("btn-run").disabled = false;
  const ops = document.getElementById("sort-ops");
  if (ops) ops.textContent = "сравнений: 0 · обменов: 0";
  hideSortScrubber();
  renderDesc("sort-desc", currentAlgo);
}

function resetSearch() {
  running = false;
  const needsSorted =
    currentSearch === "binary" ||
    currentSearch === "jump" ||
    currentSearch === "interpolation" ||
    currentSearch === "exponential" ||
    currentSearch === "ternary";
  searchArr = needsSorted ? genArr(16, true) : genArr(16);
  renderBars("search-viz", searchArr, {});
  const langCodes = CODES[currentLang] || CODES.js;
  document.getElementById("search-code").innerHTML =
    langCodes[currentSearch] ?? CODES.js[currentSearch] ?? "";
  document.getElementById("search-status").textContent = needsSorted
    ? "массив отсортирован"
    : "";
  document.getElementById("btn-search-run").disabled = false;
  renderDesc("search-desc", currentSearch);
}

async function runSort() {
  if (running) return;
  running = true;
  document.getElementById("btn-run").disabled = true;
  const arr = [...sortArr];
  const n = arr.length;
  const d = getDelay;
  // Separate metrics: comparisons (key vs key) and swaps/writes (array stores).
  // Far more instructive than a single counter — e.g. selection sort does many
  // comparisons but ≤ n swaps, insertion sort does many writes, etc.
  let comparisons = 0,
    swaps = 0;
  const updateOps = () => {
    const el = document.getElementById("sort-ops");
    if (el) el.textContent = `сравнений: ${comparisons} · обменов: ${swaps}`;
  };
  const cmp = () => {
    comparisons++;
    updateOps();
  };
  const swp = (k = 1) => {
    swaps += k;
    updateOps();
  };
  // Record every visual update as a frame so the run can be scrubbed
  // backward/forward after it finishes (see showSortFrame).
  sortFrames = [];
  let lastStatus = "";
  const status = (t) => {
    lastStatus = t;
    document.getElementById("sort-status").textContent = t;
  };
  const render = (s) => {
    renderBars("sort-viz", arr, s);
    sortFrames.push({ arr: [...arr], s: { ...s }, status: lastStatus });
  };

  if (currentAlgo === "bubble") {
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        render({ [j]: "comparing", [j + 1]: "comparing" });
        await delay(d());
        cmp();
        if (arr[j] > arr[j + 1]) {
          render({ [j]: "swapping", [j + 1]: "swapping" });
          await delay(d());
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swp();
        }
        status(`i=${i}, j=${j} → сравниваем ${arr[j]} и ${arr[j + 1]}`);
        if (!running) break;
      }
      const s = {};
      for (let k = n - i - 1; k < n; k++) s[k] = "sorted";
      render(s);
      if (!running) break;
    }
  } else if (currentAlgo === "selection") {
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        render({ [i]: "swapping", [minIdx]: "pivot", [j]: "comparing" });
        await delay(d());
        cmp();
        if (arr[j] < arr[minIdx]) minIdx = j;
        status(`Минимум от i=${i}: arr[${minIdx}]=${arr[minIdx]}`);
        if (!running) break;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swp();
      }
      const s = {};
      for (let k = 0; k <= i; k++) s[k] = "sorted";
      render(s);
      await delay(d());
      if (!running) break;
    }
  } else if (currentAlgo === "insertion") {
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      const s = {};
      for (let k = 0; k < i; k++) s[k] = "sorted";
      s[i] = "comparing";
      render(s);
      await delay(d());
      while (j >= 0 && arr[j] > key) {
        cmp();
        arr[j + 1] = arr[j];
        j--;
        swp();
        const s2 = {};
        for (let k = 0; k <= i; k++) s2[k] = "sorted";
        s2[j + 1] = "swapping";
        render(s2);
        await delay(d());
        status(`Сдвигаем ${arr[j + 1]} вправо`);
        if (!running) break;
      }
      arr[j + 1] = key;
      const s3 = {};
      for (let k = 0; k <= i; k++) s3[k] = "sorted";
      render(s3);
      if (!running) break;
    }
  } else if (currentAlgo === "shell") {
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        const temp = arr[i];
        let j = i;
        const s = {};
        for (let k = 0; k < i; k++) if (k % gap === i % gap) s[k] = "sorted";
        s[i] = "comparing";
        render(s);
        await delay(d());
        while (j >= gap && arr[j - gap] > temp) {
          cmp();
          arr[j] = arr[j - gap];
          j -= gap;
          swp();
          const s2 = {};
          for (let k = 0; k <= i; k++)
            if (k % gap === i % gap) s2[k] = "sorted";
          s2[j] = "swapping";
          render(s2);
          await delay(d());
          status(`gap=${gap}: сдвигаем`);
          if (!running) break;
        }
        arr[j] = temp;
      }
    }
  } else if (currentAlgo === "quick") {
    const steps = [];
    function qs(a, lo, hi) {
      if (lo >= hi) return;
      const pivot = a[hi];
      let i = lo - 1;
      for (let j = lo; j < hi; j++) {
        steps.push({ t: "cmp", i, j, hi, arr: [...a] });
        if (a[j] <= pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ t: "swp", i, j, hi, arr: [...a] });
        }
      }
      [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
      steps.push({ t: "place", p: i + 1, arr: [...a] });
      qs(a, lo, i);
      qs(a, i + 2, hi);
    }
    const tmp = [...arr];
    qs(tmp, 0, n - 1);
    for (const step of steps) {
      arr.splice(0, arr.length, ...step.arr);
      if (step.t === "cmp") {
        cmp();
        render({ [step.j]: "comparing", [step.hi]: "pivot" });
      } else if (step.t === "swp") {
        swp();
        render({
          [step.i]: "swapping",
          [step.j]: "swapping",
          [step.hi]: "pivot",
        });
      } else {
        swp();
        render({ [step.p]: "sorted" });
      }
      status(
        step.t === "cmp"
          ? `Сравниваем arr[${step.j}] с pivot`
          : step.t === "swp"
            ? `Меняем местами`
            : `Pivot на месте: ${step.p}`,
      );
      await delay(d());
      if (!running) break;
    }
  } else if (currentAlgo === "merge") {
    const steps = [];
    function ms(a, l, r) {
      if (r - l <= 1) return;
      const m = Math.floor((l + r) / 2);
      ms(a, l, m);
      ms(a, m, r);
      const tmp = [...a];
      let i = l,
        j = m,
        k = l;
      while (i < m && j < r) {
        steps.push({ c: [i, j], arr: [...a] });
        if (tmp[i] <= tmp[j]) {
          a[k++] = tmp[i++];
        } else {
          a[k++] = tmp[j++];
        }
        steps.push({ s: [k - 1], arr: [...a] });
      }
      while (i < m) {
        a[k++] = tmp[i++];
        steps.push({ s: [k - 1], arr: [...a] });
      }
      while (j < r) {
        a[k++] = tmp[j++];
        steps.push({ s: [k - 1], arr: [...a] });
      }
    }
    const tmp2 = [...arr];
    ms(tmp2, 0, n);
    for (const step of steps) {
      arr.splice(0, arr.length, ...step.arr);
      const s = {};
      if (step.c) {
        cmp();
        step.c.forEach((i) => (s[i] = "comparing"));
      }
      if (step.s) {
        swp();
        step.s.forEach((i) => (s[i] = "swapping"));
      }
      render(s);
      await delay(d());
      if (!running) break;
    }
  } else if (currentAlgo === "heap") {
    const steps = [];
    function heapify(a, n, i) {
      let largest = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && a[l] > a[largest]) largest = l;
      if (r < n && a[r] > a[largest]) largest = r;
      if (largest !== i) {
        [a[i], a[largest]] = [a[largest], a[i]];
        steps.push({ t: "heap", i, largest, arr: [...a] });
        heapify(a, n, largest);
      }
    }
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
    for (let i = n - 1; i > 0; i--) {
      steps.push({ t: "swap", a: 0, b: i, arr: [...arr] });
      [arr[0], arr[i]] = [arr[i], arr[0]];
      heapify(arr, i, 0);
    }
    const orig = [...sortArr];
    for (const step of steps) {
      if (step.t === "heap") {
        cmp();
        cmp();
        swp();
        render({ [step.i]: "comparing", [step.largest]: "swapping" });
        status(`Heapify: сравниваем ${step.i} и ${step.largest}`);
      } else {
        swp();
        render({ [step.a]: "swapping", [step.b]: "pivot" });
        status(`Меняем корень с позицией ${step.b}`);
      }
      await delay(d());
      if (!running) break;
    }
  } else if (currentAlgo === "radix") {
    const max = Math.max(...arr);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const output = new Array(n).fill(0),
        count = new Array(10).fill(0);
      for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
      for (let i = 1; i < 10; i++) count[i] += count[i - 1];
      for (let i = n - 1; i >= 0; i--) {
        const idx = Math.floor(arr[i] / exp) % 10;
        output[--count[idx]] = arr[i];
        swp();
        const s = {};
        for (let k = 0; k < n; k++) s[k] = "excluded";
        s[i] = "comparing";
        s[count[idx]] = "swapping";
        render(s);
        await delay(d());
        status(`Разряд ${exp}: распределяем`);
        if (!running) break;
      }
      for (let i = 0; i < n; i++) arr[i] = output[i];
      render({});
      await delay(d());
    }
  } else if (currentAlgo === "counting") {
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);
    const output = new Array(n);
    for (let i = 0; i < n; i++) {
      render({ [i]: "comparing" });
      status("Counting: arr[" + i + "]=" + arr[i]);
      await delay(d());
      count[arr[i]]++;
      if (!running) break;
    }
    for (let i = 1; i <= max; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
      const pos = --count[arr[i]];
      output[pos] = arr[i];
      swp();
      const s = {};
      for (let k = 0; k < n; k++) s[k] = "excluded";
      s[i] = "swapping";
      render(s);
      status("Placing " + arr[i] + " → pos " + pos);
      await delay(d());
      if (!running) break;
    }
    for (let i = 0; i < n; i++) arr[i] = output[i];
    render({});
    await delay(d());
  } else if (currentAlgo === "timsort") {
    const MIN_RUN = 4;

    // ── Фаза 1: insertion sort каждого блока размером MIN_RUN ──
    for (let i = 0; i < n && running; i += MIN_RUN) {
      const right = Math.min(i + MIN_RUN - 1, n - 1);
      status(`Insertion sort: блок [${i}..${right}]`);
      for (let x = i + 1; x <= right && running; x++) {
        const key = arr[x];
        let j = x - 1;
        const s = {};
        for (let k = i; k < x; k++) s[k] = "sorted";
        s[x] = "comparing";
        render(s);
        await delay(d());
        while (j >= i && arr[j] > key) {
          cmp();
          arr[j + 1] = arr[j];
          j--;
          swp();
          const s2 = {};
          for (let k = i; k <= right; k++) s2[k] = "sorted";
          s2[j + 1] = "swapping";
          render(s2);
          await delay(d());
          if (!running) break;
        }
        arr[j + 1] = key;
      }
      // Пометить готовый блок
      const sf = {};
      for (let k = i; k <= right; k++) sf[k] = "sorted";
      render(sf);
      await delay(d());
    }

    // ── Фаза 2: слияние блоков ──
    for (let size = MIN_RUN; size < n && running; size *= 2) {
      for (let left = 0; left < n && running; left += 2 * size) {
        const mid = Math.min(left + size - 1, n - 1);
        const right = Math.min(left + 2 * size - 1, n - 1);
        if (mid >= right) continue;
        status(`Merge: [${left}..${mid}] + [${mid + 1}..${right}]`);
        const sm = {};
        for (let k = left; k <= mid; k++) sm[k] = "comparing";
        for (let k = mid + 1; k <= right; k++) sm[k] = "swapping";
        render(sm);
        await delay(d());
        // Слияние двух отсортированных половин
        const tmp = arr.slice(left, right + 1);
        const midRel = mid - left + 1;
        let i2 = 0,
          j2 = midRel,
          k2 = left;
        while (i2 < midRel && j2 < tmp.length) {
          cmp();
          arr[k2++] = tmp[i2] <= tmp[j2] ? tmp[i2++] : tmp[j2++];
          swp();
        }
        while (i2 < midRel) {
          arr[k2++] = tmp[i2++];
          swp();
        }
        while (j2 < tmp.length) {
          arr[k2++] = tmp[j2++];
          swp();
        }
        const sf2 = {};
        for (let k = left; k <= right; k++) sf2[k] = "sorted";
        render(sf2);
        await delay(d());
      }
    }
  }

  if (running) {
    const all = {};
    for (let k = 0; k < n; k++) all[k] = "sorted";
    status("Готово! ✓");
    render(all); // record the final "all sorted" frame with its status
  }
  running = false;
  document.getElementById("btn-run").disabled = false;
  enableSortScrubber();
}

// ── Time-travel playback for the sort section ────────────────────────────
// runSort records a frame on every visual update; these let the user replay
// the run in either direction once it has finished.
let sortFrames = [];
let sortFrameIdx = 0;

function showSortFrame(i) {
  if (running || !sortFrames.length) return;
  i = Math.max(0, Math.min(sortFrames.length - 1, i));
  sortFrameIdx = i;
  const f = sortFrames[i];
  renderBars("sort-viz", f.arr, f.s);
  const st = document.getElementById("sort-status");
  if (st) st.textContent = f.status || "";
  const sl = document.getElementById("sort-frame-slider");
  if (sl) sl.value = i;
  const lbl = document.getElementById("sort-frame-label");
  if (lbl) lbl.textContent = `кадр ${i + 1} / ${sortFrames.length}`;
}

function sortStepBack() {
  showSortFrame(sortFrameIdx - 1);
}
function sortStepFwd() {
  showSortFrame(sortFrameIdx + 1);
}

function enableSortScrubber() {
  const row = document.getElementById("sort-playback");
  const has = sortFrames.length > 0;
  if (row) row.style.display = has ? "flex" : "none";
  if (!has) return;
  const sl = document.getElementById("sort-frame-slider");
  if (sl) {
    sl.max = sortFrames.length - 1;
    sl.value = sortFrames.length - 1;
  }
  sortFrameIdx = sortFrames.length - 1;
  const lbl = document.getElementById("sort-frame-label");
  if (lbl) lbl.textContent = `кадр ${sortFrames.length} / ${sortFrames.length}`;
}

function hideSortScrubber() {
  sortFrames = [];
  sortFrameIdx = 0;
  const row = document.getElementById("sort-playback");
  if (row) row.style.display = "none";
}

async function runSearch() {
  if (running) return;
  running = true;
  document.getElementById("btn-search-run").disabled = true;
  const arr = [...searchArr];
  const target = +document.getElementById("search-target").value;
  const n = arr.length;
  const status = (t) =>
    (document.getElementById("search-status").textContent = t);
  const render = (s) => renderBars("search-viz", arr, s);
  const d = getDelay;

  if (currentSearch === "linear") {
    let found = false;
    for (let i = 0; i < n; i++) {
      render({ [i]: "comparing" });
      status(`arr[${i}] = ${arr[i]}`);
      await delay(d() * 2);
      if (arr[i] === target) {
        render({ [i]: "found" });
        status(`Найдено! index = ${i}`);
        found = true;
        break;
      }
      render({ [i]: "excluded" });
      await delay(d());
      if (!running) break;
    }
    if (!found && running) status(`${target} не найден`);
  } else if (currentSearch === "binary") {
    let lo = 0,
      hi = n - 1,
      found = false;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const s = {};
      for (let k = 0; k < lo; k++) s[k] = "excluded";
      for (let k = hi + 1; k < n; k++) s[k] = "excluded";
      s[mid] = "comparing";
      render(s);
      status(`lo=${lo} hi=${hi} mid=${mid} → arr[${mid}]=${arr[mid]}`);
      await delay(d() * 2);
      if (arr[mid] === target) {
        const s2 = { ...s };
        s2[mid] = "found";
        render(s2);
        status(`Найдено! index = ${mid}`);
        found = true;
        break;
      } else if (arr[mid] < target) lo = mid + 1;
      else hi = mid - 1;
      if (!running) break;
      await delay(d());
    }
    if (!found && running) status(`${target} не найден`);
  } else if (currentSearch === "jump") {
    let step = Math.floor(Math.sqrt(n));
    let prev = 0,
      found = false;
    while (Math.min(step, n) - 1 < n && arr[Math.min(step, n) - 1] < target) {
      const s = {};
      for (let k = 0; k < prev; k++) s[k] = "excluded";
      s[Math.min(step, n) - 1] = "comparing";
      render(s);
      status(`Прыжок: проверяем блок [${prev}, ${Math.min(step, n) - 1}]`);
      await delay(d() * 2);
      prev = step;
      step += Math.floor(Math.sqrt(n));
      if (prev >= n) break;
    }
    let i = prev;
    while (i < Math.min(step, n) && arr[i] < target) {
      const s = {};
      for (let k = 0; k < prev; k++) s[k] = "excluded";
      s[i] = "comparing";
      render(s);
      status(`Линейный поиск: arr[${i}]=${arr[i]}`);
      await delay(d() * 2);
      i++;
    }
    if (i < n && arr[i] === target) {
      const s = {};
      for (let k = 0; k < prev; k++) s[k] = "excluded";
      s[i] = "found";
      render(s);
      status(`Найдено! index = ${i}`);
      found = true;
    }
    if (!found && running) status(`${target} не найден`);
  } else if (currentSearch === "interpolation") {
    let lo = 0,
      hi = n - 1,
      found = false;
    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
      const pos =
        lo + Math.floor(((target - arr[lo]) / (arr[hi] - arr[lo])) * (hi - lo));
      const s = {};
      for (let k = 0; k < lo; k++) s[k] = "excluded";
      for (let k = hi + 1; k < n; k++) s[k] = "excluded";
      s[pos] = "comparing";
      render(s);
      status(`pos = ${pos} (интерполяция)`);
      await delay(d() * 2);
      if (arr[pos] === target) {
        s[pos] = "found";
        render(s);
        status(`Найдено! index = ${pos}`);
        found = true;
        break;
      }
      if (arr[pos] < target) lo = pos + 1;
      else hi = pos - 1;
      if (!running) break;
    }
    if (!found && running) status(`${target} не найден`);
  } else if (currentSearch === "exponential") {
    if (arr[0] === target) {
      render({ [0]: "found" });
      status("Найдено! index = 0");
    } else {
      let i = 1;
      while (i < n && arr[i] <= target) {
        const s = {};
        for (let k = 0; k < i; k++) s[k] = "excluded";
        s[i] = "comparing";
        render(s);
        status(`Экспоненциальный рост: i=${i}`);
        await delay(d() * 2);
        i *= 2;
      }
      let lo = i / 2,
        hi = Math.min(i, n - 1);
      let found = false;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const s = {};
        for (let k = 0; k < lo; k++) s[k] = "excluded";
        for (let k = hi + 1; k < n; k++) s[k] = "excluded";
        s[mid] = "comparing";
        render(s);
        status(`Бинарный поиск: mid=${mid}`);
        await delay(d() * 2);
        if (arr[mid] === target) {
          s[mid] = "found";
          render(s);
          status(`Найдено! index = ${mid}`);
          found = true;
          break;
        }
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
      if (!found && running) status(`${target} не найден`);
    }
  } else if (currentSearch === "ternary") {
    let lo = 0,
      hi = n - 1,
      found = false;
    while (lo <= hi && running) {
      const third = Math.floor((hi - lo) / 3);
      const mid1 = lo + third;
      const mid2 = hi - third;
      const s = {};
      for (let k = 0; k < lo; k++) s[k] = "excluded";
      for (let k = hi + 1; k < n; k++) s[k] = "excluded";
      s[mid1] = "comparing";
      if (mid2 !== mid1) s[mid2] = "pivot";
      render(s);
      status(
        `lo=${lo} mid1=${mid1}(${arr[mid1]}) mid2=${mid2}(${arr[mid2]}) hi=${hi}`,
      );
      await delay(d() * 2);
      if (arr[mid1] === target) {
        render({ ...s, [mid1]: "found" });
        status(`Найдено! index = ${mid1}`);
        found = true;
        break;
      }
      if (arr[mid2] === target) {
        render({ ...s, [mid2]: "found" });
        status(`Найдено! index = ${mid2}`);
        found = true;
        break;
      }
      if (target < arr[mid1]) hi = mid1 - 1;
      else if (target > arr[mid2]) lo = mid2 + 1;
      else {
        lo = mid1 + 1;
        hi = mid2 - 1;
      }
      await delay(d());
    }
    if (!found && running) status(`${target} не найден`);
  }
  running = false;
  document.getElementById("btn-search-run").disabled = false;
}

// ── Keyboard accessibility ──
// The algorithm cards are clickable <div>s, so they aren't reachable or
// operable by keyboard out of the box. Make them focusable and let
// Enter / Space activate them (the :focus-visible ring is styled in CSS).
(function enableCardKeyboardNav() {
  document.querySelectorAll(".algo-card").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const el = document.activeElement;
    if (el && el.classList.contains("algo-card")) {
      e.preventDefault();
      el.click();
    }
  });
})();

// ── Persistent settings + URL deep-linking ──────────────────────────────
// One source of truth for "which algorithm is selected" per section, used
// both to write the URL hash (#section/algo) and to restore from it. The
// select* functions call syncURL() after a selection; applyState() runs once
// on load (after the default init) to restore language, slider speeds and
// the deep-linked algorithm.

// section name → its current-selection getter + selector function.
const SECTION_STATE = {
  sort: { get: () => currentAlgo, select: (n) => selectAlgo(n) },
  search: { get: () => currentSearch, select: (n) => selectSearch(n) },
  graph: { get: () => currentGraph, select: (n) => selectGraph(n) },
  dp: { get: () => currentDP, select: (n) => selectDP(n) },
  hash: { get: () => currentHash, select: (n) => selectHash(n) },
  backtrack: {
    get: () => currentBacktrack,
    select: (n) => selectBacktrack(n),
  },
  string: { get: () => currentString, select: (n) => selectString(n) },
  tree: { get: () => currentTree, select: (n) => selectTree(n) },
};

function activeSectionName() {
  const s = document.querySelector(".section.active");
  return s ? s.id.replace("section-", "") : "sort";
}

// Reflect the current section + selection into the URL (replaceState so we
// don't flood the back-button history on every click).
function syncURL() {
  const sec = activeSectionName();
  const st = SECTION_STATE[sec];
  const sel = st ? st.get() : "";
  const hash = "#" + sec + (sel ? "/" + sel : "");
  if (location.hash !== hash) {
    try {
      history.replaceState(null, "", hash);
    } catch (e) {
      location.hash = hash;
    }
  }
}

// Apply a #section/algo hash: switch section then select the algorithm.
// replaceState in syncURL never fires hashchange, so this can't loop.
function applyHash() {
  const parts = location.hash.replace(/^#/, "").split("/");
  const sec = parts[0];
  const sel = parts[1];
  if (!sec || !document.getElementById("section-" + sec)) return;
  const tab = document.querySelector(`.tab[onclick*="'${sec}'"]`);
  const sectionEl = document.getElementById("section-" + sec);
  if (tab && !sectionEl.classList.contains("active")) switchSection(sec, tab);
  if (sel && SECTION_STATE[sec] && document.getElementById("card-" + sel)) {
    SECTION_STATE[sec].select(sel);
  }
}

// Run once on load, AFTER the default init handler (see algo-hash.js).
function applyState() {
  // 1. Restore code language.
  try {
    const lang = localStorage.getItem("av-lang");
    if (lang && CODES[lang]) switchLang(lang);
  } catch (e) {}

  // 2. Restore speed sliders and keep them persisted on change.
  document.querySelectorAll('input[type="range"]').forEach((sl) => {
    const key = "av-speed-" + sl.id;
    try {
      const v = localStorage.getItem(key);
      if (v !== null) sl.value = v;
    } catch (e) {}
    sl.addEventListener("input", () => {
      try {
        localStorage.setItem(key, sl.value);
      } catch (e) {}
    });
  });

  // 3. Restore the deep-linked algorithm and react to future hash changes.
  applyHash();
  window.addEventListener("hashchange", applyHash);
}
