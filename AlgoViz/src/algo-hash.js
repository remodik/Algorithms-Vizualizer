const DEFAULT_HASH_KEYS = [15, 11, 27, 4, 33, 22, 17];
const DEFAULT_HASH_SIZE = 11;

let hashArr = [];
let hashTableLinear = [];

function getHashKeys() {
  const input = document.getElementById("hash-keys-input");
  if (!input || !input.value.trim()) return DEFAULT_HASH_KEYS;
  const parsed = input.value
    .split(/[,\s]+/)
    .map((s) => parseInt(s.trim()))
    .filter((x) => !isNaN(x) && x >= 0);
  return parsed.length >= 1 ? parsed : DEFAULT_HASH_KEYS;
}

function getHashSize() {
  const input = document.getElementById("hash-size-input");
  if (!input) return DEFAULT_HASH_SIZE;
  const v = parseInt(input.value);
  return !isNaN(v) && v >= 5 && v <= 31 ? v : DEFAULT_HASH_SIZE;
}

// Размер таблицы передаётся явно: во время прогона он зафиксирован, поэтому
// hashFn не должен перечитывать поле ввода (иначе изменение размера в процессе
// даёт индекс за пределами массива). Без аргумента — берём текущий из DOM.
// Сама хеш-функция — из протестированного ядра AlgoCore.
function hashFn(key, size) {
  return AlgoCore.hashFn(key, size ?? getHashSize());
}

function resetHash() {
  running = paused = false;
  if (pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
  opsCount = 0;
  updateOpsDisplay("hash");

  const sz = getHashSize();
  hashArr = Array.from({ length: sz }, () => []);
  hashTableLinear = new Array(sz).fill(null);

  const viz = document.getElementById("hash-viz");
  if (viz) viz.innerHTML = "";

  const codeEl = document.getElementById("hash-code");
  if (codeEl) {
    const langCodes = CODES[currentLang] || CODES.js;
    codeEl.innerHTML = langCodes[currentHash] ?? CODES.js[currentHash] ?? "";
  }

  const statusEl = document.getElementById("hash-status");
  if (statusEl) statusEl.textContent = "Нажми «Запустить»";

  const btn = document.getElementById("btn-hash-run");
  if (btn) btn.disabled = false;

  const pb = document.getElementById("btn-hash-pause");
  if (pb) pb.textContent = "⏸ Пауза";

  renderDesc("hash-desc", currentHash);
  buildHashViz();
}

function buildHashViz() {
  const viz = document.getElementById("hash-viz");
  if (!viz) return;

  const isChaining = currentHash === "hashChaining";
  const HASH_KEYS = getHashKeys();
  const HASH_TABLE_SIZE = getHashSize();

  viz.innerHTML = "";

  const keysInfo = document.createElement("div");
  keysInfo.style.cssText =
    "font-size:11px;color:var(--muted);margin-bottom:10px;text-align:center";
  keysInfo.textContent =
    "Ключи: [" +
    HASH_KEYS.join(", ") +
    "]  |  Размер таблицы: " +
    HASH_TABLE_SIZE +
    "  |  hash(k) = k mod " +
    HASH_TABLE_SIZE;
  viz.appendChild(keysInfo);

  const table = document.createElement("div");
  table.id = "hash-table-viz";
  table.style.cssText =
    "display:flex;flex-direction:column;gap:4px;max-width:500px;margin:0 auto";
  viz.appendChild(table);

  for (let i = 0; i < HASH_TABLE_SIZE; i++) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:8px";

    const idx = document.createElement("div");
    idx.style.cssText =
      "width:28px;text-align:right;font-size:11px;color:var(--muted);font-family:var(--font-mono);flex-shrink:0";
    idx.textContent = i;

    const slot = document.createElement("div");
    slot.id = "hash-slot-" + i;
    slot.style.cssText =
      "min-width:44px;height:34px;border:1px solid var(--border);border-radius:6px;" +
      "display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);" +
      "font-size:12px;font-weight:700;background:rgba(255,255,255,0.03);color:var(--muted);flex-shrink:0";
    slot.textContent = isChaining ? "[ ]" : "—";

    const chain = document.createElement("div");
    chain.id = "hash-chain-" + i;
    chain.style.cssText =
      "display:flex;align-items:center;gap:4px;flex-wrap:wrap";

    row.appendChild(idx);
    row.appendChild(slot);
    row.appendChild(chain);
    table.appendChild(row);
  }
}

function selectHash(name) {
  if (running) return;
  currentHash = name;
  document
    .querySelectorAll("#section-hash .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  const card = document.getElementById("card-" + name);
  if (card) card.classList.add("selected");
  resetHash();
  syncURL();
}

function toggleHashPause() {
  togglePauseGeneric("btn-hash-pause");
}

async function runHash() {
  if (running) return;
  running = true;
  paused = false;
  opsCount = 0;
  updateOpsDisplay("hash");

  const btn = document.getElementById("btn-hash-run");
  if (btn) btn.disabled = true;

  const status = (t) => {
    const el = document.getElementById("hash-status");
    if (el) el.textContent = t;
  };

  const d = () =>
    [500, 350, 200, 100, 40][
      +document.getElementById("hash-speed-slider").value - 1
    ];

  if (currentHash === "hashChaining") {
    const HASH_KEYS = getHashKeys();
    const HASH_TABLE_SIZE = getHashSize();
    hashArr = Array.from({ length: HASH_TABLE_SIZE }, () => []);
    buildHashViz();
    status("Цепочки: вставляем ключи");
    await delayP(d() * 1.5);

    for (const key of HASH_KEYS) {
      if (!running) break;
      const h = hashFn(key, HASH_TABLE_SIZE);

      const slotEl = document.getElementById("hash-slot-" + h);
      if (slotEl) {
        slotEl.style.background = withAlpha("amber", 0.25);
        slotEl.style.borderColor = "var(--amber)";
        slotEl.style.color = "var(--amber)";
      }
      status(
        "hash(" + key + ") = " + key + " mod " + HASH_TABLE_SIZE + " = " + h,
      );
      await delayP(d() * 2);

      hashArr[h].push(key);
      opsCount++;
      updateOpsDisplay("hash");
      renderChainSlot(h, key);
      status(
        "Вставлен " +
          key +
          " → слот " +
          h +
          (hashArr[h].length > 1 ? " (коллизия!)" : ""),
      );

      if (slotEl) {
        slotEl.style.background = "rgba(62,201,138,0.15)";
        slotEl.style.borderColor = PALETTE.green;
        slotEl.style.color = PALETTE.green;
      }
      await delayP(d());
    }

    if (running) status("Цепочки: все ключи вставлены ✓");
  } else if (currentHash === "hashLinear") {
    const HASH_KEYS = getHashKeys();
    const HASH_TABLE_SIZE = getHashSize();
    hashTableLinear = new Array(HASH_TABLE_SIZE).fill(null);
    buildHashViz();
    status("Линейное зондирование: вставляем ключи");
    await delayP(d() * 1.5);

    for (const key of HASH_KEYS) {
      if (!running) break;
      let h = hashFn(key, HASH_TABLE_SIZE);
      let probes = 0;
      status(
        "hash(" + key + ") = " + key + " mod " + HASH_TABLE_SIZE + " = " + h,
      );
      await delayP(d() * 1.5);

      while (hashTableLinear[h] !== null) {
        const slotEl = document.getElementById("hash-slot-" + h);
        if (slotEl) {
          slotEl.style.background = withAlpha("red", 0.2);
          slotEl.style.borderColor = PALETTE.red;
        }
        status(
          "Коллизия в слоте " +
            h +
            " (занят " +
            hashTableLinear[h] +
            "), пробуем " +
            ((h + 1) % HASH_TABLE_SIZE),
        );
        await delayP(d() * 1.5);
        if (slotEl) {
          slotEl.style.background = "rgba(255,255,255,0.03)";
          slotEl.style.borderColor = "var(--border)";
        }
        h = (h + 1) % HASH_TABLE_SIZE;
        probes++;
        opsCount++;
        updateOpsDisplay("hash");
        if (probes > HASH_TABLE_SIZE) break;
      }

      if (hashTableLinear[h] === null) {
        hashTableLinear[h] = key;
        opsCount++;
        updateOpsDisplay("hash");
        const slotEl = document.getElementById("hash-slot-" + h);
        if (slotEl) {
          slotEl.textContent = key;
          slotEl.style.background = withAlpha("green", 0.15);
          slotEl.style.borderColor = PALETTE.green;
          slotEl.style.color = PALETTE.green;
        }
        status(
          "Вставлен " +
            key +
            " → слот " +
            h +
            (probes > 0 ? " (после " + probes + " проб)" : "") +
            " ✓",
        );
        await delayP(d());
      } else {
        status("Таблица переполнена! Невозможно вставить " + key);
      }
    }

    if (running) status("Линейное зондирование: все ключи вставлены ✓");
  }

  running = false;
  if (btn) btn.disabled = false;
}

function renderChainSlot(slotIdx, newKey) {
  const chainEl = document.getElementById("hash-chain-" + slotIdx);
  const slotEl = document.getElementById("hash-slot-" + slotIdx);
  if (!chainEl) return;

  const items = hashArr[slotIdx];
  if (slotEl) {
    slotEl.textContent = "→";
    slotEl.style.color = "var(--text)";
  }

  chainEl.innerHTML = "";
  items.forEach((k, i) => {
    if (i > 0) {
      const arrow = document.createElement("span");
      arrow.style.cssText = "color:var(--muted);font-size:11px";
      arrow.textContent = "→";
      chainEl.appendChild(arrow);
    }
    const node = document.createElement("div");
    node.style.cssText =
      "width:36px;height:34px;border:1px solid var(--border);border-radius:6px;" +
      "display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);" +
      "font-size:12px;font-weight:700;" +
      (k === newKey
        ? `background:${withAlpha("green", 0.2)};border-color:${PALETTE.green};color:${PALETTE.green}`
        : `background:${withAlpha("blue", 0.12)};border-color:${withAlpha("blue", 0.4)};color:var(--text)`);
    node.textContent = k;
    chainEl.appendChild(node);
  });
}

// Loads last of all scripts, so this `load` handler runs after the default
// init in algo-graph-dp.js — letting applyState() override the defaults with
// the user's saved language / speeds and any deep-linked algorithm.
window.addEventListener("load", applyState);
