// ── Pure algorithm core (no DOM) ─────────────────────────────────────────
// Canonical, side-effect-free implementations of the algorithms the
// visualizer animates. The viz files own the *animated* step-by-step versions
// (which are inherently coupled to rendering); this module is the plain,
// unit-tested reference and is reused by the app where a non-animated result
// is all that's needed (e.g. building a BST, hashing a key).
//
// Loads as a classic <script> in the browser (assigns globalThis.AlgoCore) and
// as an ESM side-effect import in Node tests (which then read globalThis).

(function (root) {
  "use strict";

  // ---- Sorting (return a new sorted array; never mutate the input) ----
  const bubbleSort = (input) => {
    const a = input.slice();
    for (let i = 0; i < a.length - 1; i++)
      for (let j = 0; j < a.length - i - 1; j++)
        if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    return a;
  };

  const insertionSort = (input) => {
    const a = input.slice();
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = key;
    }
    return a;
  };

  const mergeSort = (input) => {
    if (input.length <= 1) return input.slice();
    const mid = input.length >> 1;
    const left = mergeSort(input.slice(0, mid));
    const right = mergeSort(input.slice(mid));
    const out = [];
    let i = 0,
      j = 0;
    while (i < left.length && j < right.length)
      out.push(left[i] <= right[j] ? left[i++] : right[j++]);
    while (i < left.length) out.push(left[i++]);
    while (j < right.length) out.push(right[j++]);
    return out;
  };

  const quickSort = (input) => {
    const a = input.slice();
    const qs = (lo, hi) => {
      if (lo >= hi) return;
      const pivot = a[hi];
      let i = lo - 1;
      for (let j = lo; j < hi; j++) {
        if (a[j] <= pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
        }
      }
      [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
      qs(lo, i);
      qs(i + 2, hi);
    };
    qs(0, a.length - 1);
    return a;
  };

  const heapSort = (input) => {
    const a = input.slice();
    const n = a.length;
    const heapify = (size, i) => {
      let largest = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < size && a[l] > a[largest]) largest = l;
      if (r < size && a[r] > a[largest]) largest = r;
      if (largest !== i) {
        [a[i], a[largest]] = [a[largest], a[i]];
        heapify(size, largest);
      }
    };
    for (let i = (n >> 1) - 1; i >= 0; i--) heapify(n, i);
    for (let i = n - 1; i > 0; i--) {
      [a[0], a[i]] = [a[i], a[0]];
      heapify(i, 0);
    }
    return a;
  };

  const isSorted = (a) => {
    for (let i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false;
    return true;
  };

  // ---- Searching (return index, or -1) ----
  const linearSearch = (a, target) => {
    for (let i = 0; i < a.length; i++) if (a[i] === target) return i;
    return -1;
  };

  const binarySearch = (a, target) => {
    let lo = 0,
      hi = a.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (a[mid] === target) return mid;
      if (a[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  };

  // ---- Binary Search Tree ----
  // Immutable-root style: insert returns the (possibly new) root.
  const bstInsert = (root, val) => {
    const node = { val, left: null, right: null };
    if (!root) return node;
    let cur = root;
    while (true) {
      if (val < cur.val) {
        if (!cur.left) {
          cur.left = node;
          return root;
        }
        cur = cur.left;
      } else if (val > cur.val) {
        if (!cur.right) {
          cur.right = node;
          return root;
        }
        cur = cur.right;
      } else return root; // duplicate ignored
    }
  };

  const bstFromArray = (values) => {
    let root = null;
    for (const v of values) root = bstInsert(root, v);
    return root;
  };

  const bstSearch = (root, val) => {
    let cur = root;
    while (cur) {
      if (val === cur.val) return cur;
      cur = val < cur.val ? cur.left : cur.right;
    }
    return null;
  };

  const bstInorder = (root) => {
    const out = [];
    (function rec(n) {
      if (!n) return;
      rec(n.left);
      out.push(n.val);
      rec(n.right);
    })(root);
    return out;
  };

  // ---- String matching ----
  const kmpBuildLPS = (pat) => {
    const lps = new Array(pat.length).fill(0);
    let len = 0;
    for (let i = 1; i < pat.length; ) {
      if (pat[i] === pat[len]) lps[i++] = ++len;
      else if (len > 0) len = lps[len - 1];
      else lps[i++] = 0;
    }
    return lps;
  };

  const kmpSearch = (text, pat) => {
    if (pat.length === 0) return 0;
    const lps = kmpBuildLPS(pat);
    let i = 0,
      j = 0;
    while (i < text.length) {
      if (text[i] === pat[j]) {
        i++;
        j++;
        if (j === pat.length) return i - j;
      } else if (j > 0) j = lps[j - 1];
      else i++;
    }
    return -1;
  };

  const rabinKarp = (text, pat) => {
    const B = 256,
      M = 101;
    const m = pat.length,
      n = text.length;
    if (m === 0) return 0;
    if (m > n) return -1;
    let patH = 0,
      winH = 0,
      h = 1;
    for (let i = 0; i < m - 1; i++) h = (h * B) % M;
    for (let i = 0; i < m; i++) {
      patH = (B * patH + pat.charCodeAt(i)) % M;
      winH = (B * winH + text.charCodeAt(i)) % M;
    }
    for (let s = 0; s <= n - m; s++) {
      if (patH === winH && text.slice(s, s + m) === pat) return s;
      if (s < n - m) {
        winH =
          (B * (winH - text.charCodeAt(s) * h) + text.charCodeAt(s + m)) % M;
        if (winH < 0) winH += M;
      }
    }
    return -1;
  };

  // ---- Backtracking: N-Queens (first solution as board[col] = row) ----
  const solveNQueens = (N) => {
    const board = new Array(N).fill(-1);
    const isSafe = (row, col) => {
      for (let c = 0; c < col; c++) {
        const r = board[c];
        if (r === row || Math.abs(r - row) === col - c) return false;
      }
      return true;
    };
    const place = (col) => {
      if (col === N) return true;
      for (let row = 0; row < N; row++) {
        if (isSafe(row, col)) {
          board[col] = row;
          if (place(col + 1)) return true;
          board[col] = -1;
        }
      }
      return false;
    };
    return place(0) ? board.slice() : null;
  };

  // ---- Disjoint Set Union (union by rank + path compression) ----
  const makeDSU = (n) => {
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    const find = (x) => {
      while (parent[x] !== x) x = parent[x] = parent[parent[x]];
      return x;
    };
    const union = (a, b) => {
      const ra = find(a),
        rb = find(b);
      if (ra === rb) return false;
      if (rank[ra] < rank[rb]) parent[ra] = rb;
      else if (rank[ra] > rank[rb]) parent[rb] = ra;
      else {
        parent[rb] = ra;
        rank[ra]++;
      }
      return true;
    };
    return { find, union, connected: (a, b) => find(a) === find(b) };
  };

  // ---- Hashing ----
  const hashFn = (key, size) => ((key % size) + size) % size;

  const AlgoCore = {
    bubbleSort,
    insertionSort,
    mergeSort,
    quickSort,
    heapSort,
    isSorted,
    linearSearch,
    binarySearch,
    bstInsert,
    bstFromArray,
    bstSearch,
    bstInorder,
    kmpBuildLPS,
    kmpSearch,
    rabinKarp,
    solveNQueens,
    makeDSU,
    hashFn,
  };

  root.AlgoCore = AlgoCore;
})(typeof globalThis !== "undefined" ? globalThis : this);
