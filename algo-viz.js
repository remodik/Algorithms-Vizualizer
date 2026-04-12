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
  document
    .querySelector(`.lang-btn[data-lang="${lang}"]`)
    .classList.add("active");
  updateCodeDisplay();
}

function updateCodeDisplay() {
  if (document.getElementById("section-sort").classList.contains("active")) {
    document.getElementById("sort-code").innerHTML =
      CODES[currentLang][currentAlgo];
    renderDesc("sort-desc", currentAlgo);
  } else if (
    document.getElementById("section-search").classList.contains("active")
  ) {
    document.getElementById("search-code").innerHTML =
      CODES[currentLang][currentSearch];
    renderDesc("search-desc", currentSearch);
  } else if (
    document.getElementById("section-graph").classList.contains("active")
  ) {
    document.getElementById("graph-code").innerHTML =
      CODES[currentLang][currentGraph];
    renderDesc("graph-desc", currentGraph);
  } else if (
    document.getElementById("section-dp").classList.contains("active")
  ) {
    document.getElementById("dp-code").innerHTML =
      CODES[currentLang][currentDP];
    renderDesc("dp-desc", currentDP);
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
}

function selectSearch(name) {
  if (running) return;
  currentSearch = name;
  document
    .querySelectorAll("#section-search .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  document.getElementById("card-" + name).classList.add("selected");
  resetSearch();
}

function selectGraph(name) {
  if (running) return;
  currentGraph = name;
  document
    .querySelectorAll("#section-graph .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  document.getElementById("card-" + name).classList.add("selected");
  resetGraph();
}

function selectDP(name) {
  if (running) return;
  currentDP = name;
  document
    .querySelectorAll("#section-dp .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  document.getElementById("card-" + name).classList.add("selected");
  resetDP();
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
  else if (name === "graph") resetGraph();
  else if (name === "dp") resetDP();
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
  document.getElementById("sort-code").innerHTML =
    CODES[currentLang][currentAlgo];
  document.getElementById("sort-status").textContent = "Нажми «Запустить»";
  document.getElementById("btn-run").disabled = false;
  const ops = document.getElementById("sort-ops");
  if (ops) ops.textContent = "операций: 0";
  renderDesc("sort-desc", currentAlgo);
}

function resetSearch() {
  running = false;
  searchArr =
    currentSearch === "binary" ||
    currentSearch === "jump" ||
    currentSearch === "interpolation" ||
    currentSearch === "exponential"
      ? genArr(16, true)
      : genArr(16);
  renderBars("search-viz", searchArr, {});
  document.getElementById("search-code").innerHTML =
    CODES[currentLang][currentSearch];
  document.getElementById("search-status").textContent =
    currentSearch === "binary" ||
    currentSearch === "jump" ||
    currentSearch === "interpolation" ||
    currentSearch === "exponential"
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
  let ops = 0;
  const updateOps = () => {
    const el = document.getElementById("sort-ops");
    if (el) el.textContent = "операций: " + ops;
  };
  const status = (t) =>
    (document.getElementById("sort-status").textContent = t);
  const render = (s) => renderBars("sort-viz", arr, s);

  if (currentAlgo === "bubble") {
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        render({ [j]: "comparing", [j + 1]: "comparing" });
        await delay(d());
        if (arr[j] > arr[j + 1]) {
          render({ [j]: "swapping", [j + 1]: "swapping" });
          await delay(d());
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
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
        if (arr[j] < arr[minIdx]) minIdx = j;
        status(`Минимум от i=${i}: arr[${minIdx}]=${arr[minIdx]}`);
        if (!running) break;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
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
        arr[j + 1] = arr[j];
        j--;
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
          arr[j] = arr[j - gap];
          j -= gap;
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
      if (step.t === "cmp")
        render({ [step.j]: "comparing", [step.hi]: "pivot" });
      else if (step.t === "swp")
        render({
          [step.i]: "swapping",
          [step.j]: "swapping",
          [step.hi]: "pivot",
        });
      else render({ [step.p]: "sorted" });
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
      if (step.c) step.c.forEach((i) => (s[i] = "comparing"));
      if (step.s) step.s.forEach((i) => (s[i] = "swapping"));
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
        render({ [step.i]: "comparing", [step.largest]: "swapping" });
        status(`Heapify: сравниваем ${step.i} и ${step.largest}`);
      } else {
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
        const s = {};
        for (let k = 0; k < n; k++) s[k] = "excluded";
        s[i] = "comparing";
        s[count[idx]] = "swapping";
        renderBars("sort-viz", arr, s);
        await delay(d());
        status(`Разряд ${exp}: распределяем`);
        if (!running) break;
      }
      for (let i = 0; i < n; i++) arr[i] = output[i];
      renderBars("sort-viz", arr, {});
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
  }

  if (running) {
    const all = {};
    for (let k = 0; k < n; k++) all[k] = "sorted";
    render(all);
    status("Готово! ✓");
  }
  running = false;
  document.getElementById("btn-run").disabled = false;
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
  }
  running = false;
  document.getElementById("btn-search-run").disabled = false;
}
