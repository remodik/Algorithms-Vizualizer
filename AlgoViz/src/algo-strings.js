// ── String matching section: KMP + Rabin-Karp ────────────────────────────
// Renders the text as a fixed row of character cells and the pattern as a row
// that shifts under it. Shares the global run/pause machinery (running, paused,
// pauseResolve, opsCount, delayP, togglePauseGeneric).

const DEFAULT_STR_TEXT = "ABABDABACDABABCABAB";
const DEFAULT_STR_PAT = "ABABCABAB";
const STR_CELL = 26; // px per character cell

function getStrText() {
  const el = document.getElementById("string-text-input");
  const v = el && el.value.trim() ? el.value.trim() : DEFAULT_STR_TEXT;
  return v.toUpperCase();
}
function getStrPattern() {
  const el = document.getElementById("string-pat-input");
  const v = el && el.value.trim() ? el.value.trim() : DEFAULT_STR_PAT;
  return v.toUpperCase();
}

function selectString(name) {
  if (running) return;
  currentString = name;
  document
    .querySelectorAll("#section-string .algo-card")
    .forEach((c) => c.classList.remove("selected"));
  const card = document.getElementById("card-" + name);
  if (card) card.classList.add("selected");
  resetString();
  if (typeof syncURL === "function") syncURL();
}

function toggleStringPause() {
  togglePauseGeneric("btn-string-pause");
}

function strCellStyle(extra) {
  return (
    `min-width:${STR_CELL}px;height:${STR_CELL}px;display:flex;align-items:center;` +
    `justify-content:center;font-family:var(--font-mono);font-size:13px;font-weight:700;` +
    `border:1px solid var(--border);border-radius:4px;background:rgba(255,255,255,0.03);` +
    `color:var(--muted);flex-shrink:0;transition:all 0.15s;` +
    (extra || "")
  );
}

function buildStringViz() {
  const viz = document.getElementById("string-viz");
  if (!viz) return;
  const text = getStrText();
  const pat = getStrPattern();
  viz.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.style.cssText =
    "overflow-x:auto;padding:6px 0;display:flex;flex-direction:column;gap:6px";

  // Text row (indices + chars).
  const idxRow = document.createElement("div");
  idxRow.style.cssText = "display:flex;gap:3px";
  const textRow = document.createElement("div");
  textRow.style.cssText = "display:flex;gap:3px";
  for (let i = 0; i < text.length; i++) {
    const ix = document.createElement("div");
    ix.style.cssText = `min-width:${STR_CELL}px;text-align:center;font-size:9px;color:var(--muted);font-family:var(--font-mono);flex-shrink:0`;
    ix.textContent = i;
    idxRow.appendChild(ix);

    const c = document.createElement("div");
    c.id = "str-t-" + i;
    c.style.cssText = strCellStyle("color:var(--text)");
    c.textContent = text[i];
    textRow.appendChild(c);
  }

  // Pattern row, shifted via left margin.
  const patRow = document.createElement("div");
  patRow.id = "str-pat-row";
  patRow.style.cssText = "display:flex;gap:3px;transition:margin-left 0.2s";
  for (let j = 0; j < pat.length; j++) {
    const c = document.createElement("div");
    c.id = "str-p-" + j;
    c.style.cssText = strCellStyle(
      `background:${withAlpha("blue", 0.12)};color:var(--text)`,
    );
    c.textContent = pat[j];
    patRow.appendChild(c);
  }

  wrap.appendChild(idxRow);
  wrap.appendChild(textRow);
  wrap.appendChild(patRow);
  viz.appendChild(wrap);

  // Optional LPS array readout for KMP.
  if (currentString === "kmp") {
    const lps = document.createElement("div");
    lps.id = "str-lps";
    lps.style.cssText =
      "font-size:11px;color:var(--muted);margin-top:10px;font-family:var(--font-mono)";
    lps.textContent = "LPS: —";
    viz.appendChild(lps);
  }
}

function setPatternShift(shift) {
  const row = document.getElementById("str-pat-row");
  if (row) row.style.marginLeft = shift * (STR_CELL + 3) + "px";
}

function paintStrCell(prefix, i, bg, color) {
  const el = document.getElementById(prefix + i);
  if (!el) return;
  if (bg !== undefined) el.style.background = bg;
  if (color !== undefined) el.style.color = color;
}

function resetString() {
  running = paused = false;
  if (pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
  opsCount = 0;
  updateOpsDisplay("string");

  buildStringViz();

  const codeEl = document.getElementById("string-code");
  if (codeEl) {
    const langCodes = CODES[currentLang] || CODES.js;
    codeEl.innerHTML =
      langCodes[currentString] ?? CODES.js[currentString] ?? "";
  }

  const statusEl = document.getElementById("string-status");
  if (statusEl) statusEl.textContent = "Нажми «Запустить»";

  const btn = document.getElementById("btn-string-run");
  if (btn) btn.disabled = false;

  const pb = document.getElementById("btn-string-pause");
  if (pb) pb.textContent = "⏸ Пауза";

  renderDesc("string-desc", currentString);
}

async function runString() {
  if (running) return;
  running = true;
  paused = false;
  opsCount = 0;
  updateOpsDisplay("string");

  const btn = document.getElementById("btn-string-run");
  if (btn) btn.disabled = true;

  const status = (t) => {
    const el = document.getElementById("string-status");
    if (el) el.textContent = t;
  };
  const d = () =>
    [560, 380, 230, 120, 50][
      +document.getElementById("string-speed-slider").value - 1
    ];

  const text = getStrText();
  const pat = getStrPattern();
  buildStringViz();
  await delayP(d());

  if (currentString === "kmp") {
    await runKMP(text, pat, d, status);
  } else if (currentString === "rabinkarp") {
    await runRabinKarp(text, pat, d, status);
  }

  running = false;
  if (btn) btn.disabled = false;
}

async function runKMP(text, pat, d, status) {
  const n = text.length,
    m = pat.length;

  // ── Build LPS ──
  const lps = new Array(m).fill(0);
  let len = 0;
  status("Строим префикс-функцию (LPS)…");
  const lpsEl = document.getElementById("str-lps");
  for (let i = 1; i < m && running; ) {
    if (pat[i] === pat[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
    opsCount++;
    updateOpsDisplay("string");
    if (lpsEl) lpsEl.textContent = "LPS: [" + lps.join(", ") + "]";
    await delayP(d() * 0.6);
  }
  if (lpsEl) lpsEl.textContent = "LPS: [" + lps.join(", ") + "]";

  // ── Match ──
  let i = 0,
    j = 0;
  while (i < n && running) {
    setPatternShift(i - j);
    paintStrCell("str-t-", i, withAlpha("amber", 0.3), "var(--amber)");
    paintStrCell("str-p-", j, withAlpha("amber", 0.3), "var(--amber)");
    status(`Сравниваем text[${i}]='${text[i]}' и pat[${j}]='${pat[j]}'`);
    await delayP(d());
    opsCount++;
    updateOpsDisplay("string");

    if (text[i] === pat[j]) {
      paintStrCell("str-t-", i, withAlpha("green", 0.25), "var(--green)");
      paintStrCell("str-p-", j, withAlpha("green", 0.25), "var(--green)");
      i++;
      j++;
      if (j === m) {
        status(`Найдено! Совпадение на индексе ${i - j} ✓`);
        for (let k = 0; k < m; k++)
          paintStrCell("str-t-", i - m + k, withAlpha("green", 0.4), "#fff");
        await delayP(d());
        return;
      }
    } else {
      paintStrCell("str-t-", i, "rgba(255,255,255,0.03)", "var(--text)");
      if (j > 0) {
        // reset highlight on the pattern cells we leave behind
        for (let k = 0; k < m; k++)
          paintStrCell(
            "str-p-",
            k,
            withAlpha("blue", 0.12),
            "var(--text)",
          );
        status(`Несовпадение → прыжок по LPS: j = lps[${j - 1}] = ${lps[j - 1]}`);
        j = lps[j - 1];
      } else {
        i++;
      }
      await delayP(d() * 0.5);
    }
  }
  if (running) status(`Шаблон не найден`);
}

async function runRabinKarp(text, pat, d, status) {
  const B = 256,
    M = 101;
  const n = text.length,
    m = pat.length;
  if (m > n) {
    status("Шаблон длиннее текста — поиск невозможен");
    return;
  }

  let patH = 0,
    winH = 0,
    h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * B) % M;
  for (let i = 0; i < m; i++) {
    patH = (B * patH + pat.charCodeAt(i)) % M;
    winH = (B * winH + text.charCodeAt(i)) % M;
  }
  status(`Хеш шаблона = ${patH}. Считаем хеши окон…`);
  await delayP(d());

  for (let s = 0; s <= n - m && running; s++) {
    setPatternShift(s);
    // highlight current window
    for (let k = 0; k < m; k++)
      paintStrCell("str-t-", s + k, withAlpha("amber", 0.25), "var(--amber)");
    status(`Окно [${s}..${s + m - 1}]: хеш=${winH}, шаблон=${patH}`);
    await delayP(d());
    opsCount++;
    updateOpsDisplay("string");

    if (winH === patH) {
      // verify characters (guard against hash collisions)
      const match = text.slice(s, s + m) === pat;
      status(
        match
          ? `Хеши совпали и символы тоже → найдено на ${s} ✓`
          : `Хеши совпали, но символы — нет (коллизия), идём дальше`,
      );
      for (let k = 0; k < m; k++)
        paintStrCell(
          "str-t-",
          s + k,
          withAlpha(match ? "green" : "red", 0.35),
          match ? "#fff" : "var(--red)",
        );
      await delayP(d());
      if (match) return;
    }

    // clear window highlight before rolling
    for (let k = 0; k < m; k++)
      paintStrCell("str-t-", s + k, "rgba(255,255,255,0.03)", "var(--text)");

    if (s < n - m) {
      winH =
        (B * (winH - text.charCodeAt(s) * h) + text.charCodeAt(s + m)) % M;
      if (winH < 0) winH += M;
    }
    await delayP(d() * 0.4);
  }
  if (running) status(`Шаблон не найден`);
}
