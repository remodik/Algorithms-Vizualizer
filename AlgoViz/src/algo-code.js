let currentAlgo = "bubble";
let currentSearch = "linear";
let currentGraph = "bfs";
let currentDP = "fib";
let currentHash = "hashChaining";
let currentBacktrack = "nqueens";
let currentString = "kmp";
let currentTree = "bst";
let currentLang = "js";
let running = false;
let sortArr = [],
  searchArr = [];

// ── Design tokens, read once from the CSS :root (single source of truth).
//    Change a colour in index.html and every canvas/inline use follows. ──
const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const PALETTE = {
  blue: cssVar("--blue"),
  amber: cssVar("--amber"),
  red: cssVar("--red"),
  green: cssVar("--green"),
  purple: cssVar("--purple"),
  teal: cssVar("--teal"),
  cyan: cssVar("--cyan"),
  pink: cssVar("--pink"),
  excluded: cssVar("--excluded"),
};

// Translucent variant of a token, e.g. withAlpha("amber", 0.25).
function withAlpha(token, a) {
  const hex = (PALETTE[token] || token).replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// Sort/search bar states → palette tokens.
const COLORS = {
  default: PALETTE.blue,
  comparing: PALETTE.amber,
  swapping: PALETTE.red,
  sorted: PALETTE.green,
  pivot: PALETTE.purple,
  found: PALETTE.green,
  excluded: PALETTE.excluded,
};

const CODES = {
  js: {
    bst: `<span class="cm">// Двоичное дерево поиска: левое поддерево &lt; узел &lt; правое.</span>
<span class="kw">class</span> <span class="ty">BST</span> {
  <span class="fn">insert</span>(val) {
    <span class="kw">const</span> node = { val, left: <span class="kw">null</span>, right: <span class="kw">null</span> };
    <span class="kw">if</span> (!<span class="kw">this</span>.root) { <span class="kw">this</span>.root = node; <span class="kw">return</span>; }
    <span class="kw">let</span> cur = <span class="kw">this</span>.root;
    <span class="kw">while</span> (<span class="kw">true</span>) {
      <span class="kw">if</span> (val < cur.val) {                <span class="cm">// идём влево</span>
        <span class="kw">if</span> (!cur.left) { cur.left = node; <span class="kw">return</span>; }
        cur = cur.left;
      } <span class="kw">else if</span> (val > cur.val) {         <span class="cm">// идём вправо</span>
        <span class="kw">if</span> (!cur.right) { cur.right = node; <span class="kw">return</span>; }
        cur = cur.right;
      } <span class="kw">else return</span>;                     <span class="cm">// дубликат</span>
    }
  }

  <span class="fn">search</span>(val) {
    <span class="kw">let</span> cur = <span class="kw">this</span>.root;
    <span class="kw">while</span> (cur) {
      <span class="kw">if</span> (val === cur.val) <span class="kw">return</span> cur;   <span class="cm">// найдено</span>
      cur = val < cur.val ? cur.left : cur.right;
    }
    <span class="kw">return</span> <span class="kw">null</span>;                        <span class="cm">// нет в дереве</span>
  }
}`,
    kmp: `<span class="cm">// Префикс-функция (LPS): длина наибольшего собственного</span>
<span class="cm">// префикса, совпадающего с суффиксом.</span>
<span class="kw">function</span> <span class="fn">buildLPS</span>(p) {
  <span class="kw">const</span> lps = <span class="ty">Array</span>(p.length).<span class="fn">fill</span>(<span class="nm">0</span>);
  <span class="kw">let</span> len = <span class="nm">0</span>;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i < p.length; ) {
    <span class="kw">if</span> (p[i] === p[len]) lps[i++] = ++len;
    <span class="kw">else if</span> (len > <span class="nm">0</span>) len = lps[len - <span class="nm">1</span>];
    <span class="kw">else</span> lps[i++] = <span class="nm">0</span>;
  }
  <span class="kw">return</span> lps;
}

<span class="kw">function</span> <span class="fn">kmp</span>(text, pat) {
  <span class="kw">const</span> lps = <span class="fn">buildLPS</span>(pat);
  <span class="kw">let</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>;            <span class="cm">// i — текст, j — шаблон</span>
  <span class="kw">while</span> (i < text.length) {
    <span class="kw">if</span> (text[i] === pat[j]) { i++; j++; }
    <span class="kw">else if</span> (j > <span class="nm">0</span>) j = lps[j - <span class="nm">1</span>]; <span class="cm">// сдвиг без отката i</span>
    <span class="kw">else</span> i++;
    <span class="kw">if</span> (j === pat.length) <span class="kw">return</span> i - j; <span class="cm">// найдено</span>
  }
  <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    rabinkarp: `<span class="kw">function</span> <span class="fn">rabinKarp</span>(text, pat) {
  <span class="kw">const</span> B = <span class="nm">256</span>, M = <span class="nm">101</span>; <span class="cm">// основание и простой модуль</span>
  <span class="kw">const</span> m = pat.length, n = text.length;
  <span class="kw">let</span> patH = <span class="nm">0</span>, winH = <span class="nm">0</span>, h = <span class="nm">1</span>;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < m - <span class="nm">1</span>; i++) h = (h * B) % M;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < m; i++) {
    patH = (B * patH + pat.<span class="fn">charCodeAt</span>(i)) % M;
    winH = (B * winH + text.<span class="fn">charCodeAt</span>(i)) % M;
  }
  <span class="kw">for</span> (<span class="kw">let</span> s = <span class="nm">0</span>; s <= n - m; s++) {
    <span class="kw">if</span> (patH === winH &&
        text.<span class="fn">slice</span>(s, s + m) === pat) <span class="kw">return</span> s; <span class="cm">// хеши совпали → проверка</span>
    <span class="kw">if</span> (s < n - m) {                       <span class="cm">// перекатываем хеш окна</span>
      winH = (B * (winH - text.<span class="fn">charCodeAt</span>(s) * h) +
              text.<span class="fn">charCodeAt</span>(s + m)) % M;
      <span class="kw">if</span> (winH < <span class="nm">0</span>) winH += M;
    }
  }
  <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    nqueens: `<span class="kw">function</span> <span class="fn">solveNQueens</span>(N) {
  <span class="kw">const</span> board = <span class="ty">Array</span>(N).<span class="fn">fill</span>(-<span class="nm">1</span>); <span class="cm">// board[col] = row</span>

  <span class="kw">function</span> <span class="fn">isSafe</span>(row, col) {
    <span class="kw">for</span> (<span class="kw">let</span> c = <span class="nm">0</span>; c < col; c++) {
      <span class="kw">const</span> r = board[c];
      <span class="kw">if</span> (r === row) <span class="kw">return</span> <span class="kw">false</span>;            <span class="cm">// та же строка</span>
      <span class="kw">if</span> (<span class="ty">Math</span>.<span class="fn">abs</span>(r - row) === col - c) <span class="kw">return</span> <span class="kw">false</span>; <span class="cm">// диагональ</span>
    }
    <span class="kw">return</span> <span class="kw">true</span>;
  }

  <span class="kw">function</span> <span class="fn">place</span>(col) {
    <span class="kw">if</span> (col === N) <span class="kw">return</span> <span class="kw">true</span>;          <span class="cm">// все ферзи расставлены</span>
    <span class="kw">for</span> (<span class="kw">let</span> row = <span class="nm">0</span>; row < N; row++) {
      <span class="kw">if</span> (<span class="fn">isSafe</span>(row, col)) {
        board[col] = row;                <span class="cm">// ставим</span>
        <span class="kw">if</span> (<span class="fn">place</span>(col + <span class="nm">1</span>)) <span class="kw">return</span> <span class="kw">true</span>;
        board[col] = -<span class="nm">1</span>;               <span class="cm">// откат (backtrack)</span>
      }
    }
    <span class="kw">return</span> <span class="kw">false</span>;
  }

  <span class="kw">return</span> <span class="fn">place</span>(<span class="nm">0</span>) ? board : <span class="kw">null</span>;
}`,
    bubble: `<span class="kw">function</span> <span class="fn">bubbleSort</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < n - <span class="nm">1</span>; i++) {
    <span class="kw">for</span> (<span class="kw">let</span> j = <span class="nm">0</span>; j < n - i - <span class="nm">1</span>; j++) {
      <span class="kw">if</span> (arr[j] > arr[j + <span class="nm">1</span>]) {
        [arr[j], arr[j + <span class="nm">1</span>]] = [arr[j + <span class="nm">1</span>], arr[j]];
      }
    }
  }
  <span class="kw">return</span> arr;
}`,
    selection: `<span class="kw">function</span> <span class="fn">selectionSort</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < n - <span class="nm">1</span>; i++) {
    <span class="kw">let</span> minIdx = i;
    <span class="kw">for</span> (<span class="kw">let</span> j = i + <span class="nm">1</span>; j < n; j++) {
      <span class="kw">if</span> (arr[j] < arr[minIdx]) minIdx = j;
    }
    <span class="kw">if</span> (minIdx !== i)
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  <span class="kw">return</span> arr;
}`,
    insertion: `<span class="kw">function</span> <span class="fn">insertionSort</span>(arr) {
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i < arr.length; i++) {
    <span class="kw">const</span> key = arr[i];
    <span class="kw">let</span> j = i - <span class="nm">1</span>;
    <span class="kw">while</span> (j >= <span class="nm">0</span> && arr[j] > key) {
      arr[j + <span class="nm">1</span>] = arr[j];
      j--;
    }
    arr[j + <span class="nm">1</span>] = key;
  }
  <span class="kw">return</span> arr;
}`,
    shell: `<span class="kw">function</span> <span class="fn">shellSort</span>(arr) {
  <span class="kw">let</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> gap = Math.<span class="fn">floor</span>(n/<span class="nm">2</span>); gap > <span class="nm">0</span>; gap = Math.<span class="fn">floor</span>(gap/<span class="nm">2</span>)) {
    <span class="kw">for</span> (<span class="kw">let</span> i = gap; i < n; i++) {
      <span class="kw">let</span> temp = arr[i];
      <span class="kw">let</span> j = i;
      <span class="kw">while</span> (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
  }
  <span class="kw">return</span> arr;
}`,
    quick: `<span class="kw">function</span> <span class="fn">quickSort</span>(arr, lo = <span class="nm">0</span>, hi = arr.length - <span class="nm">1</span>) {
  <span class="kw">if</span> (lo >= hi) <span class="kw">return</span> arr;
  <span class="kw">const</span> pivot = arr[hi];
  <span class="kw">let</span> i = lo - <span class="nm">1</span>;
  <span class="kw">for</span> (<span class="kw">let</span> j = lo; j < hi; j++) {
    <span class="kw">if</span> (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i+<span class="nm">1</span>], arr[hi]] = [arr[hi], arr[i+<span class="nm">1</span>]];
  <span class="kw">const</span> p = i + <span class="nm">1</span>;
  <span class="fn">quickSort</span>(arr, lo, p - <span class="nm">1</span>);
  <span class="fn">quickSort</span>(arr, p + <span class="nm">1</span>, hi);
  <span class="kw">return</span> arr;
}`,
    merge: `<span class="kw">function</span> <span class="fn">mergeSort</span>(arr) {
  <span class="kw">if</span> (arr.length <= <span class="nm">1</span>) <span class="kw">return</span> arr;
  <span class="kw">const</span> mid = Math.<span class="fn">floor</span>(arr.length / <span class="nm">2</span>);
  <span class="kw">const</span> left  = <span class="fn">mergeSort</span>(arr.<span class="fn">slice</span>(<span class="nm">0</span>, mid));
  <span class="kw">const</span> right = <span class="fn">mergeSort</span>(arr.<span class="fn">slice</span>(mid));
  <span class="kw">return</span> <span class="fn">merge</span>(left, right);
}

<span class="kw">function</span> <span class="fn">merge</span>(l, r) {
  <span class="kw">const</span> result = [];
  <span class="kw">let</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>;
  <span class="kw">while</span> (i < l.length && j < r.length)
    result.<span class="fn">push</span>(l[i] <= r[j] ? l[i++] : r[j++]);
  <span class="kw">return</span> result.<span class="fn">concat</span>(l.<span class="fn">slice</span>(i)).<span class="fn">concat</span>(r.<span class="fn">slice</span>(j));
}`,
    heap: `<span class="kw">function</span> <span class="fn">heapSort</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> i = Math.<span class="fn">floor</span>(n/<span class="nm">2</span>) - <span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
    <span class="fn">heapify</span>(arr, n, i);
  <span class="kw">for</span> (<span class="kw">let</span> i = n - <span class="nm">1</span>; i > <span class="nm">0</span>; i--) {
    [arr[<span class="nm">0</span>], arr[i]] = [arr[i], arr[<span class="nm">0</span>]];
    <span class="fn">heapify</span>(arr, i, <span class="nm">0</span>);
  }
  <span class="kw">return</span> arr;
}

<span class="kw">function</span> <span class="fn">heapify</span>(arr, n, i) {
  <span class="kw">let</span> largest = i, l = <span class="nm">2</span> * i + <span class="nm">1</span>, r = <span class="nm">2</span> * i + <span class="nm">2</span>;
  <span class="kw">if</span> (l < n && arr[l] > arr[largest]) largest = l;
  <span class="kw">if</span> (r < n && arr[r] > arr[largest]) largest = r;
  <span class="kw">if</span> (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    <span class="fn">heapify</span>(arr, n, largest);
  }
}`,
    radix: `<span class="kw">function</span> <span class="fn">radixSort</span>(arr) {
  <span class="kw">const</span> max = Math.<span class="fn">max</span>(...arr);
  <span class="kw">for</span> (<span class="kw">let</span> exp = <span class="nm">1</span>; Math.<span class="fn">floor</span>(max/exp) > <span class="nm">0</span>; exp *= <span class="nm">10</span>)
    <span class="fn">countingSort</span>(arr, exp);
  <span class="kw">return</span> arr;
}

<span class="kw">function</span> <span class="fn">countingSort</span>(arr, exp) {
  <span class="kw">const</span> output = <span class="kw">new</span> <span class="ty">Array</span>(arr.length).<span class="fn">fill</span>(<span class="nm">0</span>);
  <span class="kw">const</span> count = <span class="kw">new</span> <span class="ty">Array</span>(<span class="nm">10</span>).<span class="fn">fill</span>(<span class="nm">0</span>);
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < arr.length; i++)
    count[Math.<span class="fn">floor</span>(arr[i]/exp) % <span class="nm">10</span>]++;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i < <span class="nm">10</span>; i++) count[i] += count[i-<span class="nm">1</span>];
  <span class="kw">for</span> (<span class="kw">let</span> i = arr.length - <span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
    output[--count[Math.<span class="fn">floor</span>(arr[i]/exp) % <span class="nm">10</span>]] = arr[i];
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < arr.length; i++) arr[i] = output[i];
}`,
    counting: `<span class="kw">function</span> <span class="fn">countingSort</span>(arr) {
  <span class="kw">const</span> max = Math.<span class="fn">max</span>(...arr);
  <span class="kw">const</span> count = <span class="kw">new</span> <span class="ty">Array</span>(max + <span class="nm">1</span>).<span class="fn">fill</span>(<span class="nm">0</span>);
  <span class="kw">const</span> output = <span class="kw">new</span> <span class="ty">Array</span>(arr.length);
  <span class="kw">for</span> (<span class="kw">const</span> x <span class="kw">of</span> arr) count[x]++;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i <= max; i++) count[i] += count[i - <span class="nm">1</span>];
  <span class="kw">for</span> (<span class="kw">let</span> i = arr.length - <span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
    output[--count[arr[i]]] = arr[i];
  <span class="kw">return</span> output;
}`,
    timsort: `<span class="kw">const</span> MIN_RUN = <span class="nm">32</span>;

<span class="kw">function</span> <span class="fn">insertionSortRange</span>(arr, lo, hi) {
  <span class="kw">for</span> (<span class="kw">let</span> i = lo + <span class="nm">1</span>; i <= hi; i++) {
    <span class="kw">const</span> key = arr[i];
    <span class="kw">let</span> j = i - <span class="nm">1</span>;
    <span class="kw">while</span> (j >= lo && arr[j] > key) {
        arr[j+<span class="nm">1</span>] = arr[j--];
    }
    arr[j + <span class="nm">1</span>] = key;
  }
}

<span class="kw">function</span> <span class="fn">timsort</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < n; i += MIN_RUN)
    <span class="fn">insertionSortRange</span>(arr, i, Math.<span class="fn">min</span>(i + MIN_RUN - <span class="nm">1</span>, n - <span class="nm">1</span>));
  <span class="kw">for</span> (<span class="kw">let</span> size = MIN_RUN; size < n; size *= <span class="nm">2</span>) {
    <span class="kw">for</span> (<span class="kw">let</span> lo = <span class="nm">0</span>; lo < n; lo += <span class="nm">2</span> * size) {
      <span class="kw">const</span> mid = Math.<span class="fn">min</span>(lo + size - <span class="nm">1</span>, n - <span class="nm">1</span>);
      <span class="kw">const</span> hi = Math.<span class="fn">min</span>(lo + <span class="nm">2</span> * size - <span class="nm">1</span>, n - <span class="nm">1</span>);
      <span class="kw">if</span> (mid < hi) <span class="fn">merge</span>(arr, lo, mid, hi);
    }
  }
  <span class="kw">return</span> arr;
}`,
    linear: `<span class="kw">function</span> <span class="fn">linearSearch</span>(arr, target) {
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < arr.length; i++) {
    <span class="kw">if</span> (arr[i] === target) <span class="kw">return</span> i;
  }
  <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    binary: `<span class="kw">function</span> <span class="fn">binarySearch</span>(arr, target) {
  <span class="kw">let</span> lo = <span class="nm">0</span>, hi = arr.length - <span class="nm">1</span>;
  <span class="kw">while</span> (lo <= hi) {
    <span class="kw">const</span> mid = Math.<span class="fn">floor</span>((lo + hi) / <span class="nm">2</span>);
    <span class="kw">if</span> (arr[mid] === target) <span class="kw">return</span> mid;
    <span class="kw">if</span> (arr[mid] < target) lo = mid + <span class="nm">1</span>;
    <span class="kw">else</span> hi = mid - <span class="nm">1</span>;
  }
  <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    jump: `<span class="kw">function</span> <span class="fn">jumpSearch</span>(arr, target) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">let</span> step = Math.<span class="fn">floor</span>(Math.<span class="fn">sqrt</span>(n));
  <span class="kw">let</span> prev = <span class="nm">0</span>;
  <span class="kw">while</span> (arr[Math.<span class="fn">min</span>(step, n)-<span class="nm">1</span>] < target) {
    prev = step;
    step += Math.<span class="fn">floor</span>(Math.<span class="fn">sqrt</span>(n));
    <span class="kw">if</span> (prev >= n) <span class="kw">return</span> -<span class="nm">1</span>;
  }
  <span class="kw">while</span> (arr[prev] < target) {
    prev++;
    <span class="kw">if</span> (prev === Math.<span class="fn">min</span>(step, n)) <span class="kw">return</span> -<span class="nm">1</span>;
  }
  <span class="kw">return</span> arr[prev] === target ? prev : -<span class="nm">1</span>;
}`,
    interpolation: `<span class="kw">function</span> <span class="fn">interpolationSearch</span>(arr, target) {
  <span class="kw">let</span> lo = <span class="nm">0</span>, hi = arr.length - <span class="nm">1</span>;
  <span class="kw">while</span> (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    <span class="kw">if</span> (lo === hi) <span class="kw">return</span> arr[lo] === target ? lo : -<span class="nm">1</span>;
    <span class="kw">const</span> pos = lo + Math.<span class="fn">floor</span>(((target - arr[lo]) / (arr[hi] - arr[lo])) * (hi - lo));
    <span class="kw">if</span> (arr[pos] === target) <span class="kw">return</span> pos;
    <span class="kw">if</span> (arr[pos] < target) lo = pos + <span class="nm">1</span>;
    <span class="kw">else</span> hi = pos - <span class="nm">1</span>;
  }
  <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    exponential: `<span class="kw">function</span> <span class="fn">exponentialSearch</span>(arr, target) {
  <span class="kw">if</span> (arr[<span class="nm">0</span>] === target) <span class="kw">return</span> <span class="nm">0</span>;
  <span class="kw">let</span> i = <span class="nm">1</span>;
  <span class="kw">while</span> (i < arr.length && arr[i] <= target) i *= <span class="nm">2</span>;
  <span class="kw">return</span> <span class="fn">binarySearch</span>(arr, target, i/<span class="nm">2</span>, Math.<span class="fn">min</span>(i, arr.length-<span class="nm">1</span>));
}`,
    ternary: `<span class="kw">function</span> <span class="fn">ternarySearch</span>(arr, target) {
  <span class="kw">let</span> lo = <span class="nm">0</span>, hi = arr.length - <span class="nm">1</span>;
  <span class="kw">while</span> (lo <= hi) {
    <span class="kw">const</span> third = Math.<span class="fn">floor</span>((hi - lo) / <span class="nm">3</span>);
    <span class="kw">const</span> mid1 = lo + third;
    <span class="kw">const</span> mid2 = hi - third;
    <span class="kw">if</span> (arr[mid1] === target) <span class="kw">return</span> mid1;
    <span class="kw">if</span> (arr[mid2] === target) <span class="kw">return</span> mid2;
    <span class="kw">if</span> (target < arr[mid1])      hi = mid1 - <span class="nm">1</span>;
    <span class="kw">else if</span> (target > arr[mid2]) lo = mid2 + <span class="nm">1</span>;
    <span class="kw">else</span> { lo = mid1 + <span class="nm">1</span>; hi = mid2 - <span class="nm">1</span>; }
  }
  <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    bfs: `<span class="kw">function</span> <span class="fn">bfs</span>(graph, start) {
  <span class="kw">const</span> visited = <span class="kw">new</span> <span class="ty">Set</span>();
  <span class="kw">const</span> queue = [start];
  visited.<span class="fn">add</span>(start);
  <span class="kw">while</span> (queue.<span class="fn">length</span> > <span class="nm">0</span>) {
    <span class="kw">const</span> node = queue.<span class="fn">shift</span>();
    <span class="kw">for</span> (<span class="kw">const</span> neighbor <span class="kw">of</span> graph[node]) {
      <span class="kw">if</span> (!visited.<span class="fn">has</span>(neighbor)) {
        visited.<span class="fn">add</span>(neighbor);
        queue.<span class="fn">push</span>(neighbor);
      }
    }
  }
}`,
    dfs: `<span class="kw">function</span> <span class="fn">dfs</span>(graph, start, visited = <span class="kw">new</span> <span class="ty">Set</span>()) {
  visited.<span class="fn">add</span>(start);
  <span class="kw">for</span> (<span class="kw">const</span> neighbor <span class="kw">of</span> graph[start]) {
    <span class="kw">if</span> (!visited.<span class="fn">has</span>(neighbor)) {
      <span class="fn">dfs</span>(graph, neighbor, visited);
    }
  }
  <span class="kw">return</span> visited;
}`,
    dijkstra: `<span class="kw">function</span> <span class="fn">dijkstra</span>(graph, src) {
  <span class="kw">const</span> n = graph.length;
  <span class="kw">const</span> dist = <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="ty">Infinity</span>);
  <span class="kw">const</span> visited = <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="kw">false</span>);
  dist[src] = <span class="nm">0</span>;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < n; i++) {
    <span class="kw">const</span> u = dist.<span class="fn">reduce</span>((m, v, i) =>
      !visited[i] && v < dist[m] ? i : m, -<span class="nm">1</span>);
    visited[u] = <span class="kw">true</span>;
    <span class="kw">for</span> (<span class="kw">const</span> [v, w] <span class="kw">of</span> graph[u])
      <span class="kw">if</span> (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  }
  <span class="kw">return</span> dist;
}`,
    bellmanFord: `<span class="kw">function</span> <span class="fn">bellmanFord</span>(edges, n, src) {
  <span class="kw">const</span> dist = <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="ty">Infinity</span>);
  dist[src] = <span class="nm">0</span>;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < n - <span class="nm">1</span>; i++) {
    <span class="kw">let</span> updated = <span class="kw">false</span>;
    <span class="kw">for</span> (<span class="kw">const</span> {u, v, w} <span class="kw">of</span> edges) {
      <span class="kw">if</span> (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        updated = <span class="kw">true</span>;
      }
    }
    <span class="kw">if</span> (!updated) <span class="kw">break</span>;
  }
  <span class="kw">return</span> dist; <span class="cm">// проверь на отриц. цикл</span>
}`,
    astar: `<span class="kw">function</span> <span class="fn">aStar</span>(graph, src, goal, h) {
  <span class="kw">const</span> n = graph.length;
  <span class="kw">const</span> g = <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="ty">Infinity</span>);
  <span class="kw">const</span> f = <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="ty">Infinity</span>);
  g[src] = <span class="nm">0</span>; f[src] = <span class="fn">h</span>(src);
  <span class="kw">const</span> open = <span class="kw">new</span> <span class="ty">Set</span>([src]);
  <span class="kw">const</span> closed = <span class="kw">new</span> <span class="ty">Set</span>();
  <span class="kw">while</span> (open.size) {
    <span class="kw">let</span> cur = [...open].<span class="fn">reduce</span>((a, b) => f[a] < f[b] ? a : b);
    <span class="kw">if</span> (cur === goal) <span class="kw">return</span> g[goal];
    open.<span class="fn">delete</span>(cur); closed.<span class="fn">add</span>(cur);
    <span class="kw">for</span> (<span class="kw">const</span> [nb, w] <span class="kw">of</span> graph[cur]) {
      <span class="kw">if</span> (closed.<span class="fn">has</span>(nb)) <span class="kw">continue</span>;
      <span class="kw">const</span> tg = g[cur] + w;
      <span class="kw">if</span> (tg < g[nb]) {
        g[nb] = tg; f[nb] = tg + <span class="fn">h</span>(nb);
        open.<span class="fn">add</span>(nb);
      }
    }
  }
  <span class="kw">return</span> <span class="ty">Infinity</span>;
}`,
    toposort: `<span class="kw">function</span> <span class="fn">topoSort</span>(graph, n) {
  <span class="kw">const</span> vis = <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="kw">false</span>);
  <span class="kw">const</span> order = [];
  <span class="kw">function</span> <span class="fn">dfs</span>(u) {
    vis[u] = <span class="kw">true</span>;
    <span class="kw">for</span> (<span class="kw">const</span> v <span class="kw">of</span> graph[u]) <span class="kw">if</span> (!vis[v]) <span class="fn">dfs</span>(v);
    order.<span class="fn">unshift</span>(u); <span class="cm">// добавляем в начало</span>
  }
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < n; i++) <span class="kw">if</span> (!vis[i]) <span class="fn">dfs</span>(i);
  <span class="kw">return</span> order;
}`,
    floydWarshall: `<span class="kw">function</span> <span class="fn">floydWarshall</span>(graph) {
  <span class="kw">const</span> n = graph.length;
  <span class="kw">const</span> dp = graph.<span class="fn">map</span>(r => [...r]); <span class="cm">// копия</span>
  <span class="kw">for</span> (<span class="kw">let</span> k = <span class="nm">0</span>; k < n; k++)
    <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < n; i++)
      <span class="kw">for</span> (<span class="kw">let</span> j = <span class="nm">0</span>; j < n; j++)
        <span class="kw">if</span> (dp[i][k] + dp[k][j] < dp[i][j])
          dp[i][j] = dp[i][k] + dp[k][j];
  <span class="kw">return</span> dp; <span class="cm">// матрица всех кратчайших путей</span>
}`,
    prim: `<span class="kw">function</span> <span class="fn">prim</span>(graph, n) {
  <span class="kw">const</span> inMST = <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="kw">false</span>);
  <span class="kw">const</span> key = <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="ty">Infinity</span>);
  key[<span class="nm">0</span>] = <span class="nm">0</span>;
  <span class="kw">let</span> cost = <span class="nm">0</span>;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i < n; i++) {
    <span class="kw">const</span> u = key.<span class="fn">reduce</span>((m, v, i) =>
      !inMST[i] && v < key[m] ? i : m, <span class="nm">0</span>);
    inMST[u] = <span class="kw">true</span>; cost += key[u];
    <span class="kw">for</span> (<span class="kw">const</span> [v, w] <span class="kw">of</span> graph[u])
      <span class="kw">if</span> (!inMST[v] && w < key[v]) key[v] = w;
  }
  <span class="kw">return</span> cost;
}`,
    kruskal: `<span class="kw">function</span> <span class="fn">kruskal</span>(edges, n) {
  <span class="kw">const</span> par = Array.<span class="fn">from</span>({length: n}, (_, i) => i);
  <span class="kw">const</span> <span class="fn">find</span> = x => par[x] === x ? x : (par[x] = <span class="fn">find</span>(par[x]));
  <span class="kw">const</span> <span class="fn">unite</span> = (x, y) => {
    <span class="kw">const</span> [px, py] = [<span class="fn">find</span>(x), <span class="fn">find</span>(y)];
    <span class="kw">if</span> (px === py) <span class="kw">return false</span>;
    par[px] = py; <span class="kw">return true</span>;
  };
  <span class="kw">let</span> cost = <span class="nm">0</span>;
  <span class="kw">for</span> (<span class="kw">const</span> {u, v, w} <span class="kw">of</span> edges.<span class="fn">sort</span>((a, b) => a.w - b.w))
    <span class="kw">if</span> (<span class="fn">unite</span>(u, v)) cost += w;
  <span class="kw">return</span> cost;
}`,
    fib: `<span class="kw">function</span> <span class="fn">fibonacci</span>(n) {
  <span class="kw">const</span> dp = <span class="kw">new</span> <span class="ty">Array</span>(n + <span class="nm">1</span>).<span class="fn">fill</span>(<span class="nm">0</span>);
  dp[<span class="nm">1</span>] = <span class="nm">1</span>;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">2</span>; i <= n; i++) {
    dp[i] = dp[i - <span class="nm">1</span>] + dp[i - <span class="nm">2</span>];
  }
  <span class="kw">return</span> dp[n];
}`,
    knapsack: `<span class="kw">function</span> <span class="fn">knapsack</span>(weights, values, W) {
  <span class="kw">const</span> n = weights.<span class="fn">length</span>;
  <span class="kw">const</span> dp = <span class="ty">Array</span>.<span class="fn">from</span>({length: n+<span class="nm">1</span>}, () => <span class="kw">new</span> <span class="ty">Array</span>(W+<span class="nm">1</span>).<span class="fn">fill</span>(<span class="nm">0</span>));
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i <= n; i++) {
    <span class="kw">for</span> (<span class="kw">let</span> w = <span class="nm">0</span>; w <= W; w++) {
      <span class="kw">if</span> (weights[i-<span class="nm">1</span>] <= w)
        dp[i][w] = Math.<span class="fn">max</span>(values[i-<span class="nm">1</span>] + dp[i-<span class="nm">1</span>][w-weights[i-<span class="nm">1</span>]], dp[i-<span class="nm">1</span>][w]);
      <span class="kw">else</span>
        dp[i][w] = dp[i-<span class="nm">1</span>][w];
    }
  }
  <span class="kw">return</span> dp[n][W];
}`,
    lcs: `<span class="kw">function</span> <span class="fn">lcs</span>(a, b) {
  <span class="kw">const</span> m = a.length, n = b.length;
  <span class="kw">const</span> dp = <span class="ty">Array</span>.<span class="fn">from</span>({length: m+<span class="nm">1</span>}, () => <span class="kw">new</span> <span class="ty">Array</span>(n+<span class="nm">1</span>).<span class="fn">fill</span>(<span class="nm">0</span>));
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i <= m; i++)
    <span class="kw">for</span> (<span class="kw">let</span> j = <span class="nm">1</span>; j <= n; j++)
      dp[i][j] = a[i-<span class="nm">1</span>] === b[j-<span class="nm">1</span>]
        ? dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>] + <span class="nm">1</span>
        : Math.<span class="fn">max</span>(dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>]);
  <span class="kw">return</span> dp[m][n];
}`,
    lis: `<span class="kw">function</span> <span class="fn">lis</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">const</span> dp = <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="nm">1</span>);
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i < n; i++)
    <span class="kw">for</span> (<span class="kw">let</span> j = <span class="nm">0</span>; j < i; j++)
      <span class="kw">if</span> (arr[j] < arr[i])
        dp[i] = Math.<span class="fn">max</span>(dp[i], dp[j] + <span class="nm">1</span>);
  <span class="kw">return</span> Math.<span class="fn">max</span>(...dp);
}`,
    coinChange: `<span class="kw">function</span> <span class="fn">coinChange</span>(coins, amount) {
  <span class="kw">const</span> dp = <span class="kw">new</span> <span class="ty">Array</span>(amount + <span class="nm">1</span>).<span class="fn">fill</span>(<span class="ty">Infinity</span>);
  dp[<span class="nm">0</span>] = <span class="nm">0</span>;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i <= amount; i++)
    <span class="kw">for</span> (<span class="kw">const</span> c <span class="kw">of</span> coins)
      <span class="kw">if</span> (c <= i && dp[i - c] + <span class="nm">1</span> < dp[i])
        dp[i] = dp[i - c] + <span class="nm">1</span>;
  <span class="kw">return</span> dp[amount] === <span class="ty">Infinity</span> ? -<span class="nm">1</span> : dp[amount];
}
<span class="cm">// coinChange([1,3,4,5], 7) → 2  (3+4)</span>`,
    editDistance: `<span class="kw">function</span> <span class="fn">editDistance</span>(a, b) {
  <span class="kw">const</span> m = a.length, n = b.length;
  <span class="kw">const</span> dp = <span class="ty">Array</span>.<span class="fn">from</span>({length: m+<span class="nm">1</span>},
    (_, i) => <span class="ty">Array</span>.<span class="fn">from</span>({length: n+<span class="nm">1</span>}, (_, j) => i || j));
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i <= m; i++)
    <span class="kw">for</span> (<span class="kw">let</span> j = <span class="nm">1</span>; j <= n; j++)
      dp[i][j] = a[i-<span class="nm">1</span>] === b[j-<span class="nm">1</span>]
        ? dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>]
        : <span class="nm">1</span> + Math.<span class="fn">min</span>(dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>], dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>]);
  <span class="kw">return</span> dp[m][n];
}
<span class="cm">// editDistance("ALGO", "LOG") → 2</span>`,
    matrixChain: `<span class="kw">function</span> <span class="fn">matrixChain</span>(dims) {
  <span class="kw">const</span> n = dims.length - <span class="nm">1</span>;
  <span class="kw">const</span> dp = <span class="ty">Array</span>.<span class="fn">from</span>({length: n}, () => <span class="kw">new</span> <span class="ty">Array</span>(n).<span class="fn">fill</span>(<span class="nm">0</span>));
  <span class="kw">for</span> (<span class="kw">let</span> len = <span class="nm">2</span>; len <= n; len++) {
    <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">0</span>; i <= n - len; i++) {
      <span class="kw">const</span> j = i + len - <span class="nm">1</span>;
      dp[i][j] = <span class="ty">Infinity</span>;
      <span class="kw">for</span> (<span class="kw">let</span> k = i; k < j; k++) {
        <span class="kw">const</span> cost = dp[i][k] + dp[k+<span class="nm">1</span>][j]
                   + dims[i] * dims[k+<span class="nm">1</span>] * dims[j+<span class="nm">1</span>];
        <span class="kw">if</span> (cost < dp[i][j]) dp[i][j] = cost;
      }
    }
  }
  <span class="kw">return</span> dp[<span class="nm">0</span>][n-<span class="nm">1</span>];
}
<span class="cm">// matrixChain([10,30,5,60,10]) → 4500</span>`,
    rodCutting: `<span class="kw">function</span> <span class="fn">rodCutting</span>(prices) {
  <span class="kw">const</span> n = prices.length;
  <span class="kw">const</span> dp = <span class="kw">new</span> <span class="ty">Array</span>(n + <span class="nm">1</span>).<span class="fn">fill</span>(<span class="nm">0</span>);
  <span class="kw">for</span> (<span class="kw">let</span> len = <span class="nm">1</span>; len <= n; len++)
    <span class="kw">for</span> (<span class="kw">let</span> cut = <span class="nm">1</span>; cut <= len; cut++)
      dp[len] = Math.<span class="fn">max</span>(dp[len], prices[cut-<span class="nm">1</span>] + dp[len-cut]);
  <span class="kw">return</span> dp[n];
}
<span class="cm">// rodCutting([1,5,8,9,10,17,17,20]) → 22</span>`,
    hashChaining: `<span class="kw">class</span> <span class="ty">HashTableChaining</span> {
  <span class="kw">constructor</span>(size = <span class="nm">11</span>) {
    <span class="kw">this</span>.size = size;
    <span class="kw">this</span>.table = <span class="ty">Array</span>.<span class="fn">from</span>({length: size}, () => []);
  }
  <span class="fn">hash</span>(key) { <span class="kw">return</span> key % <span class="kw">this</span>.size; }
  <span class="fn">insert</span>(key) {
    <span class="kw">const</span> h = <span class="kw">this</span>.<span class="fn">hash</span>(key);
    <span class="kw">this</span>.table[h].<span class="fn">push</span>(key);
  }
  <span class="fn">search</span>(key) {
    <span class="kw">const</span> h = <span class="kw">this</span>.<span class="fn">hash</span>(key);
    <span class="kw">return</span> <span class="kw">this</span>.table[h].<span class="fn">includes</span>(key);
  }
}`,
    hashLinear: `<span class="kw">class</span> <span class="ty">HashTableLinear</span> {
  <span class="kw">constructor</span>(size = <span class="nm">11</span>) {
    <span class="kw">this</span>.size = size;
    <span class="kw">this</span>.table = <span class="kw">new</span> <span class="ty">Array</span>(size).<span class="fn">fill</span>(<span class="kw">null</span>);
  }
  <span class="fn">hash</span>(key) { <span class="kw">return</span> key % <span class="kw">this</span>.size; }
  <span class="fn">insert</span>(key) {
    <span class="kw">let</span> h = <span class="kw">this</span>.<span class="fn">hash</span>(key);
    <span class="kw">while</span> (<span class="kw">this</span>.table[h] !== <span class="kw">null</span>)
      h = (h + <span class="nm">1</span>) % <span class="kw">this</span>.size;
    <span class="kw">this</span>.table[h] = key;
  }
  <span class="fn">search</span>(key) {
    <span class="kw">let</span> h = <span class="kw">this</span>.<span class="fn">hash</span>(key);
    <span class="kw">while</span> (<span class="kw">this</span>.table[h] !== <span class="kw">null</span>) {
      <span class="kw">if</span> (<span class="kw">this</span>.table[h] === key) <span class="kw">return</span> h;
      h = (h + <span class="nm">1</span>) % <span class="kw">this</span>.size;
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
  }
}`,
  },
  python: {
    bst: `<span class="kw">class</span> <span class="ty">Node</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, val):
        self.val, self.left, self.right = val, <span class="kw">None</span>, <span class="kw">None</span>

<span class="kw">def</span> <span class="fn">insert</span>(root, val):
    <span class="kw">if</span> root <span class="kw">is</span> <span class="kw">None</span>:
        <span class="kw">return</span> <span class="ty">Node</span>(val)
    cur = root
    <span class="kw">while</span> <span class="kw">True</span>:
        <span class="kw">if</span> val < cur.val:
            <span class="kw">if</span> cur.left <span class="kw">is</span> <span class="kw">None</span>:
                cur.left = <span class="ty">Node</span>(val); <span class="kw">return</span> root
            cur = cur.left
        <span class="kw">elif</span> val > cur.val:
            <span class="kw">if</span> cur.right <span class="kw">is</span> <span class="kw">None</span>:
                cur.right = <span class="ty">Node</span>(val); <span class="kw">return</span> root
            cur = cur.right
        <span class="kw">else</span>:
            <span class="kw">return</span> root  <span class="cm"># дубликат</span>

<span class="kw">def</span> <span class="fn">search</span>(root, val):
    cur = root
    <span class="kw">while</span> cur:
        <span class="kw">if</span> val == cur.val:
            <span class="kw">return</span> cur
        cur = cur.left <span class="kw">if</span> val < cur.val <span class="kw">else</span> cur.right
    <span class="kw">return</span> <span class="kw">None</span>`,
    kmp: `<span class="kw">def</span> <span class="fn">build_lps</span>(p):
    lps = [<span class="nm">0</span>] * <span class="fn">len</span>(p)
    length = <span class="nm">0</span>
    i = <span class="nm">1</span>
    <span class="kw">while</span> i < <span class="fn">len</span>(p):
        <span class="kw">if</span> p[i] == p[length]:
            length += <span class="nm">1</span>; lps[i] = length; i += <span class="nm">1</span>
        <span class="kw">elif</span> length > <span class="nm">0</span>:
            length = lps[length - <span class="nm">1</span>]
        <span class="kw">else</span>:
            lps[i] = <span class="nm">0</span>; i += <span class="nm">1</span>
    <span class="kw">return</span> lps

<span class="kw">def</span> <span class="fn">kmp</span>(text, pat):
    lps = <span class="fn">build_lps</span>(pat)
    i = j = <span class="nm">0</span>
    <span class="kw">while</span> i < <span class="fn">len</span>(text):
        <span class="kw">if</span> text[i] == pat[j]:
            i += <span class="nm">1</span>; j += <span class="nm">1</span>
            <span class="kw">if</span> j == <span class="fn">len</span>(pat):
                <span class="kw">return</span> i - j  <span class="cm"># найдено</span>
        <span class="kw">elif</span> j > <span class="nm">0</span>:
            j = lps[j - <span class="nm">1</span>]
        <span class="kw">else</span>:
            i += <span class="nm">1</span>
    <span class="kw">return</span> -<span class="nm">1</span>`,
    rabinkarp: `<span class="kw">def</span> <span class="fn">rabin_karp</span>(text, pat):
    B, M = <span class="nm">256</span>, <span class="nm">101</span>
    m, n = <span class="fn">len</span>(pat), <span class="fn">len</span>(text)
    <span class="kw">if</span> m > n:
        <span class="kw">return</span> -<span class="nm">1</span>
    h = <span class="fn">pow</span>(B, m - <span class="nm">1</span>, M)
    pat_h = win_h = <span class="nm">0</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(m):
        pat_h = (B * pat_h + <span class="fn">ord</span>(pat[i])) % M
        win_h = (B * win_h + <span class="fn">ord</span>(text[i])) % M
    <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(n - m + <span class="nm">1</span>):
        <span class="kw">if</span> pat_h == win_h <span class="kw">and</span> text[s:s + m] == pat:
            <span class="kw">return</span> s  <span class="cm"># совпадение</span>
        <span class="kw">if</span> s < n - m:
            win_h = (B * (win_h - <span class="fn">ord</span>(text[s]) * h) + <span class="fn">ord</span>(text[s + m])) % M
    <span class="kw">return</span> -<span class="nm">1</span>`,
    nqueens: `<span class="kw">def</span> <span class="fn">solve_n_queens</span>(n):
    board = [-<span class="nm">1</span>] * n  <span class="cm"># board[col] = row</span>

    <span class="kw">def</span> <span class="fn">is_safe</span>(row, col):
        <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(col):
            r = board[c]
            <span class="kw">if</span> r == row <span class="kw">or</span> <span class="fn">abs</span>(r - row) == col - c:
                <span class="kw">return</span> <span class="kw">False</span>
        <span class="kw">return</span> <span class="kw">True</span>

    <span class="kw">def</span> <span class="fn">place</span>(col):
        <span class="kw">if</span> col == n:
            <span class="kw">return</span> <span class="kw">True</span>
        <span class="kw">for</span> row <span class="kw">in</span> <span class="fn">range</span>(n):
            <span class="kw">if</span> <span class="fn">is_safe</span>(row, col):
                board[col] = row
                <span class="kw">if</span> <span class="fn">place</span>(col + <span class="nm">1</span>):
                    <span class="kw">return</span> <span class="kw">True</span>
                board[col] = -<span class="nm">1</span>  <span class="cm"># откат</span>
        <span class="kw">return</span> <span class="kw">False</span>

    <span class="kw">return</span> board <span class="kw">if</span> <span class="fn">place</span>(<span class="nm">0</span>) <span class="kw">else</span> <span class="kw">None</span>`,
    bubble: `<span class="kw">def</span> <span class="fn">bubble_sort</span>(arr):
    n = <span class="fn">len</span>(arr)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n - <span class="nm">1</span>):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n - i - <span class="nm">1</span>):
            <span class="kw">if</span> arr[j] > arr[j + <span class="nm">1</span>]:
                arr[j], arr[j + <span class="nm">1</span>] = arr[j + <span class="nm">1</span>], arr[j]
    <span class="kw">return</span> arr`,
    selection: `<span class="kw">def</span> <span class="fn">selection_sort</span>(arr):
    n = <span class="fn">len</span>(arr)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n - <span class="nm">1</span>):
        min_idx = i
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(i + <span class="nm">1</span>, n):
            <span class="kw">if</span> arr[j] < arr[min_idx]:
                min_idx = j
        <span class="kw">if</span> min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    <span class="kw">return</span> arr`,
    insertion: `<span class="kw">def</span> <span class="fn">insertion_sort</span>(arr):
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, <span class="fn">len</span>(arr)):
        key = arr[i]
        j = i - <span class="nm">1</span>
        <span class="kw">while</span> j >= <span class="nm">0</span> <span class="kw">and</span> arr[j] > key:
            arr[j + <span class="nm">1</span>] = arr[j]
            j -= <span class="nm">1</span>
        arr[j + <span class="nm">1</span>] = key
    <span class="kw">return</span> arr`,
    shell: `<span class="kw">def</span> <span class="fn">shell_sort</span>(arr):
    n = <span class="fn">len</span>(arr)
    gap = n // <span class="nm">2</span>
    <span class="kw">while</span> gap > <span class="nm">0</span>:
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(gap, n):
            temp = arr[i]
            j = i
            <span class="kw">while</span> j >= gap <span class="kw">and</span> arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= <span class="nm">2</span>
    <span class="kw">return</span> arr`,
    quick: `<span class="kw">def</span> <span class="fn">quick_sort</span>(arr, lo=<span class="nm">0</span>, hi=<span class="kw">None</span>):
    <span class="kw">if</span> hi <span class="kw">is</span> <span class="kw">None</span>:
        hi = <span class="fn">len</span>(arr) - <span class="nm">1</span>
    <span class="kw">if</span> lo >= hi:
        <span class="kw">return</span> arr
    pivot = arr[hi]
    i = lo - <span class="nm">1</span>
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(lo, hi):
        <span class="kw">if</span> arr[j] <= pivot:
            i += <span class="nm">1</span>
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + <span class="nm">1</span>], arr[hi] = arr[hi], arr[i + <span class="nm">1</span>]
    p = i + <span class="nm">1</span>
    <span class="fn">quick_sort</span>(arr, lo, p - <span class="nm">1</span>)
    <span class="fn">quick_sort</span>(arr, p + <span class="nm">1</span>, hi)
    <span class="kw">return</span> arr`,
    merge: `<span class="kw">def</span> <span class="fn">merge_sort</span>(arr):
    <span class="kw">if</span> <span class="fn">len</span>(arr) <= <span class="nm">1</span>:
        <span class="kw">return</span> arr
    mid = <span class="fn">len</span>(arr) // <span class="nm">2</span>
    left = <span class="fn">merge_sort</span>(arr[:mid])
    right = <span class="fn">merge_sort</span>(arr[mid:])
    <span class="kw">return</span> <span class="fn">merge</span>(left, right)

<span class="kw">def</span> <span class="fn">merge</span>(left, right):
    result = []
    i = j = <span class="nm">0</span>
    <span class="kw">while</span> i < <span class="fn">len</span>(left) <span class="kw">and</span> j < <span class="fn">len</span>(right):
        <span class="kw">if</span> left[i] <= right[j]:
            result.<span class="fn">append</span>(left[i])
            i += <span class="nm">1</span>
        <span class="kw">else</span>:
            result.<span class="fn">append</span>(right[j])
            j += <span class="nm">1</span>
    result.<span class="fn">extend</span>(left[i:])
    result.<span class="fn">extend</span>(right[j:])
    <span class="kw">return</span> result`,
    heap: `<span class="kw">def</span> <span class="fn">heap_sort</span>(arr):
    n = <span class="fn">len</span>(arr)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n // <span class="nm">2</span> - <span class="nm">1</span>, -<span class="nm">1</span>, -<span class="nm">1</span>):
        <span class="fn">heapify</span>(arr, n, i)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n - <span class="nm">1</span>, <span class="nm">0</span>, -<span class="nm">1</span>):
        arr[<span class="nm">0</span>], arr[i] = arr[i], arr[<span class="nm">0</span>]
        <span class="fn">heapify</span>(arr, i, <span class="nm">0</span>)
    <span class="kw">return</span> arr

<span class="kw">def</span> <span class="fn">heapify</span>(arr, n, i):
    largest = i
    l, r = <span class="nm">2</span> * i + <span class="nm">1</span>, <span class="nm">2</span> * i + <span class="nm">2</span>
    <span class="kw">if</span> l < n <span class="kw">and</span> arr[l] > arr[largest]:
        largest = l
    <span class="kw">if</span> r < n <span class="kw">and</span> arr[r] > arr[largest]:
        largest = r
    <span class="kw">if</span> largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        <span class="fn">heapify</span>(arr, n, largest)`,
    radix: `<span class="kw">def</span> <span class="fn">radix_sort</span>(arr):
    max_val = <span class="fn">max</span>(arr)
    exp = <span class="nm">1</span>
    <span class="kw">while</span> max_val // exp > <span class="nm">0</span>:
        <span class="fn">counting_sort</span>(arr, exp)
        exp *= <span class="nm">10</span>
    <span class="kw">return</span> arr

<span class="kw">def</span> <span class="fn">counting_sort</span>(arr, exp):
    n = <span class="fn">len</span>(arr)
    output = [<span class="nm">0</span>] * n
    count = [<span class="nm">0</span>] * <span class="nm">10</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n):
        count[(arr[i] // exp) % <span class="nm">10</span>] += <span class="nm">1</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, <span class="nm">10</span>):
        count[i] += count[i - <span class="nm">1</span>]
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n - <span class="nm">1</span>, -<span class="nm">1</span>, -<span class="nm">1</span>):
        idx = (arr[i] // exp) % <span class="nm">10</span>
        count[idx] -= <span class="nm">1</span>
        output[count[idx]] = arr[i]
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n):
        arr[i] = output[i]`,
    counting: `<span class="kw">def</span> <span class="fn">counting_sort</span>(arr):
    max_val = <span class="fn">max</span>(arr)
    count = [<span class="nm">0</span>] * (max_val + <span class="nm">1</span>)
    output = [<span class="nm">0</span>] * <span class="fn">len</span>(arr)
    <span class="kw">for</span> x <span class="kw">in</span> arr:
        count[x] += <span class="nm">1</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, max_val + <span class="nm">1</span>):
        count[i] += count[i - <span class="nm">1</span>]
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(arr) - <span class="nm">1</span>, -<span class="nm">1</span>, -<span class="nm">1</span>):
        count[arr[i]] -= <span class="nm">1</span>
        output[count[arr[i]]] = arr[i]
    <span class="kw">return</span> output`,
    timsort: `<span class="kw">import</span> math

MIN_RUN = <span class="nm">32</span>

<span class="kw">def</span> <span class="fn">insertion_sort_range</span>(arr, lo, hi):
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(lo + <span class="nm">1</span>, hi + <span class="nm">1</span>):
        key = arr[i];
        j = i - <span class="nm">1</span>
        <span class="kw">while</span> j >= lo <span class="kw">and</span> arr[j] > key:
            arr[j + <span class="nm">1</span>] = arr[j];
            j -= <span class="nm">1</span>
        arr[j + <span class="nm">1</span>] = key

<span class="kw">def</span> <span class="fn">timsort</span>(arr):
    n = <span class="fn">len</span>(arr)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">0</span>, n, MIN_RUN):
        <span class="fn">insertion_sort_range</span>(arr, i, <span class="fn">min</span>(i + MIN_RUN - <span class="nm">1</span>, n - <span class="nm">1</span>))
    size = MIN_RUN
    <span class="kw">while</span> size < n:
        <span class="kw">for</span> lo <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">0</span>, n, <span class="nm">2</span> * size):
            mid = <span class="fn">min</span>(lo + size - <span class="nm">1</span>, n - <span class="nm">1</span>)
            hi  = <span class="fn">min</span>(lo + <span class="nm">2</span> * size - <span class="nm">1</span>, n - <span class="nm">1</span>)
            <span class="kw">if</span> mid < hi: <span class="fn">merge</span>(arr, lo, mid, hi)
        size *= <span class="nm">2</span>`,
    linear: `<span class="kw">def</span> <span class="fn">linear_search</span>(arr, target):
    <span class="kw">for</span> i, val <span class="kw">in</span> <span class="fn">enumerate</span>(arr):
        <span class="kw">if</span> val == target:
            <span class="kw">return</span> i
    <span class="kw">return</span> -<span class="nm">1</span>`,
    binary: `<span class="kw">def</span> <span class="fn">binary_search</span>(arr, target):
    lo, hi = <span class="nm">0</span>, <span class="fn">len</span>(arr) - <span class="nm">1</span>
    <span class="kw">while</span> lo <= hi:
        mid = (lo + hi) // <span class="nm">2</span>
        <span class="kw">if</span> arr[mid] == target:
            <span class="kw">return</span> mid
        <span class="kw">elif</span> arr[mid] < target:
            lo = mid + <span class="nm">1</span>
        <span class="kw">else</span>:
            hi = mid - <span class="nm">1</span>
    <span class="kw">return</span> -<span class="nm">1</span>`,
    jump: `<span class="kw">def</span> <span class="fn">jump_search</span>(arr, target):
    n = <span class="fn">len</span>(arr)
    step = <span class="fn">int</span>(n ** <span class="nm">0.5</span>)
    prev = <span class="nm">0</span>
    <span class="kw">while</span> arr[<span class="fn">min</span>(step, n) - <span class="nm">1</span>] < target:
        prev = step
        step += <span class="fn">int</span>(n ** <span class="nm">0.5</span>)
        <span class="kw">if</span> prev >= n:
            <span class="kw">return</span> -<span class="nm">1</span>
    <span class="kw">while</span> arr[prev] < target:
        prev += <span class="nm">1</span>
        <span class="kw">if</span> prev == <span class="fn">min</span>(step, n):
            <span class="kw">return</span> -<span class="nm">1</span>
    <span class="kw">return</span> prev <span class="kw">if</span> arr[prev] == target <span class="kw">else</span> -<span class="nm">1</span>`,
    interpolation: `<span class="kw">def</span> <span class="fn">interpolation_search</span>(arr, target):
    lo, hi = <span class="nm">0</span>, <span class="fn">len</span>(arr) - <span class="nm">1</span>
    <span class="kw">while</span> lo <= hi <span class="kw">and</span> target >= arr[lo] <span class="kw">and</span> target <= arr[hi]:
        <span class="kw">if</span> lo == hi:
            <span class="kw">return</span> lo <span class="kw">if</span> arr[lo] == target <span class="kw">else</span> -<span class="nm">1</span>
        pos = lo + <span class="fn">int</span>(((target - arr[lo]) / (arr[hi] - arr[lo])) * (hi - lo))
        <span class="kw">if</span> arr[pos] == target:
            <span class="kw">return</span> pos
        <span class="kw">if</span> arr[pos] < target:
            lo = pos + <span class="nm">1</span>
        <span class="kw">else</span>:
            hi = pos - <span class="nm">1</span>
    <span class="kw">return</span> -<span class="nm">1</span>`,
    exponential: `<span class="kw">def</span> <span class="fn">exponential_search</span>(arr, target):
    <span class="kw">if</span> arr[<span class="nm">0</span>] == target:
        <span class="kw">return</span> <span class="nm">0</span>
    i = <span class="nm">1</span>
    <span class="kw">while</span> i < <span class="fn">len</span>(arr) <span class="kw">and</span> arr[i] <= target:
        i *= <span class="nm">2</span>
    <span class="kw">return</span> <span class="fn">binary_search</span>(arr, target, i // <span class="nm">2</span>, <span class="fn">min</span>(i, <span class="fn">len</span>(arr) - <span class="nm">1</span>))`,
    ternary: `<span class="kw">def</span> <span class="fn">ternary_search</span>(arr, target):
    lo, hi = <span class="nm">0</span>, <span class="fn">len</span>(arr) - <span class="nm">1</span>
    <span class="kw">while</span> lo <= hi:
        third = (hi - lo) // <span class="nm">3</span>
        mid1 = lo + third
        mid2 = hi - third
        <span class="kw">if</span> arr[mid1] == target: <span class="kw">return</span> mid1
        <span class="kw">if</span> arr[mid2] == target: <span class="kw">return</span> mid2
        <span class="kw">if</span>   target < arr[mid1]: hi = mid1 - <span class="nm">1</span>
        <span class="kw">elif</span> target > arr[mid2]: lo = mid2 + <span class="nm">1</span>
        <span class="kw">else</span>: lo, hi = mid1 + <span class="nm">1</span>, mid2 - <span class="nm">1</span>
    <span class="kw">return</span> -<span class="nm">1</span>`,
    bfs: `<span class="kw">from</span> collections <span class="kw">import</span> deque

<span class="kw">def</span> <span class="fn">bfs</span>(graph, start):
    visited = <span class="fn">set</span>()
    queue = <span class="fn">deque</span>([start])
    visited.<span class="fn">add</span>(start)
    <span class="kw">while</span> queue:
        node = queue.<span class="fn">popleft</span>()
        <span class="cm"># обработка node</span>
        <span class="kw">for</span> neighbor <span class="kw">in</span> graph[node]:
            <span class="kw">if</span> neighbor <span class="kw">not in</span> visited:
                visited.<span class="fn">add</span>(neighbor)
                queue.<span class="fn">append</span>(neighbor)
    <span class="kw">return</span> visited`,
    dfs: `<span class="kw">def</span> <span class="fn">dfs</span>(graph, start, visited=<span class="kw">None</span>):
    <span class="kw">if</span> visited <span class="kw">is</span> <span class="kw">None</span>:
        visited = <span class="fn">set</span>()
    visited.<span class="fn">add</span>(start)
    <span class="cm"># обработка start</span>
    <span class="kw">for</span> neighbor <span class="kw">in</span> graph[start]:
        <span class="kw">if</span> neighbor <span class="kw">not in</span> visited:
            <span class="fn">dfs</span>(graph, neighbor, visited)
    <span class="kw">return</span> visited`,
    dijkstra: `<span class="kw">import</span> heapq

<span class="kw">def</span> <span class="fn">dijkstra</span>(graph, src):
    n = <span class="fn">len</span>(graph)
    dist = [<span class="fn">float</span>(<span class="st">'inf'</span>)] * n
    dist[src] = <span class="nm">0</span>
    pq = [(0, src)]
    <span class="kw">while</span> pq:
        d, u = heapq.<span class="fn">heappop</span>(pq)
        <span class="kw">if</span> d > dist[u]:
            <span class="kw">continue</span>
        <span class="kw">for</span> v, w <span class="kw">in</span> graph[u]:
            <span class="kw">if</span> dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.<span class="fn">heappush</span>(pq, (dist[v], v))
    <span class="kw">return</span> dist`,
    bellmanFord: `<span class="kw">def</span> <span class="fn">bellman_ford</span>(edges, n, src):
    dist = [<span class="fn">float</span>(<span class="st">'inf'</span>)] * n
    dist[src] = <span class="nm">0</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n - <span class="nm">1</span>):
        updated = <span class="kw">False</span>
        <span class="kw">for</span> u, v, w <span class="kw">in</span> edges:
            <span class="kw">if</span> dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = <span class="kw">True</span>
        <span class="kw">if not</span> updated: <span class="kw">break</span>
    <span class="kw">return</span> dist`,
    astar: `<span class="kw">import</span> heapq

<span class="kw">def</span> <span class="fn">a_star</span>(graph, src, goal, h):
    g = [<span class="fn">float</span>(<span class="st">'inf'</span>)] * <span class="fn">len</span>(graph)
    g[src] = <span class="nm">0</span>
    pq = [(<span class="fn">h</span>(src), src)]
    visited = <span class="fn">set</span>()
    <span class="kw">while</span> pq:
        f, u = heapq.<span class="fn">heappop</span>(pq)
        <span class="kw">if</span> u <span class="kw">in</span> visited: <span class="kw">continue</span>
        visited.<span class="fn">add</span>(u)
        <span class="kw">if</span> u == goal: <span class="kw">return</span> g[goal]
        <span class="kw">for</span> v, w <span class="kw">in</span> graph[u]:
            tg = g[u] + w
            <span class="kw">if</span> tg < g[v]:
                g[v] = tg
                heapq.<span class="fn">heappush</span>(pq, (tg + <span class="fn">h</span>(v), v))
    <span class="kw">return</span> <span class="fn">float</span>(<span class="st">'inf'</span>)`,
    toposort: `<span class="kw">def</span> <span class="fn">topo_sort</span>(graph, n):
    vis = [<span class="kw">False</span>] * n; order = []
    <span class="kw">def</span> <span class="fn">dfs</span>(u):
        vis[u] = <span class="kw">True</span>
        <span class="kw">for</span> v <span class="kw">in</span> graph[u]:
            <span class="kw">if not</span> vis[v]: <span class="fn">dfs</span>(v)
        order.<span class="fn">insert</span>(<span class="nm">0</span>, u)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n):
        <span class="kw">if not</span> vis[i]: <span class="fn">dfs</span>(i)
    <span class="kw">return</span> order`,
    floydWarshall: `<span class="kw">def</span> <span class="fn">floyd_warshall</span>(graph):
    n = <span class="fn">len</span>(graph)
    dp = [row[:] <span class="kw">for</span> row <span class="kw">in</span> graph]
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(n):
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n):
            <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n):
                <span class="kw">if</span> dp[i][k] + dp[k][j] < dp[i][j]:
                    dp[i][j] = dp[i][k] + dp[k][j]
    <span class="kw">return</span> dp`,
    prim: `<span class="kw">import</span> heapq

<span class="kw">def</span> <span class="fn">prim</span>(graph, n):
    in_mst = [<span class="kw">False</span>] * n
    key = [<span class="fn">float</span>(<span class="st">'inf'</span>)] * n
    key[<span class="nm">0</span>] = <span class="nm">0</span>
    pq = [(<span class="nm">0</span>, <span class="nm">0</span>)]
    cost = <span class="nm">0</span>
    <span class="kw">while</span> pq:
        w, u = heapq.<span class="fn">heappop</span>(pq)
        <span class="kw">if</span> in_mst[u]: <span class="kw">continue</span>
        in_mst[u] = <span class="kw">True</span>; cost += w
        <span class="kw">for</span> v, wt <span class="kw">in</span> graph[u]:
            <span class="kw">if not</span> in_mst[v] <span class="kw">and</span> wt < key[v]:
                key[v] = wt
                heapq.<span class="fn">heappush</span>(pq, (wt, v))
    <span class="kw">return</span> cost`,
    kruskal: `<span class="kw">def</span> <span class="fn">kruskal</span>(edges, n):
    parent = <span class="fn">list</span>(<span class="fn">range</span>(n))
    <span class="kw">def</span> <span class="fn">find</span>(x):
        <span class="kw">if</span> parent[x] != x: parent[x] = <span class="fn">find</span>(parent[x])
        <span class="kw">return</span> parent[x]
    cost = <span class="nm">0</span>
    <span class="kw">for</span> w, u, v <span class="kw">in</span> <span class="fn">sorted</span>(edges):
        pu, pv = <span class="fn">find</span>(u), <span class="fn">find</span>(v)
        <span class="kw">if</span> pu != pv:
            parent[pu] = pv; cost += w
    <span class="kw">return</span> cost`,
    fib: `<span class="kw">def</span> <span class="fn">fibonacci</span>(n):
    dp = [<span class="nm">0</span>] * (n + <span class="nm">1</span>)
    dp[<span class="nm">1</span>] = <span class="nm">1</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">2</span>, n + <span class="nm">1</span>):
        dp[i] = dp[i - <span class="nm">1</span>] + dp[i - <span class="nm">2</span>]
    <span class="kw">return</span> dp[n]`,
    knapsack: `<span class="kw">def</span> <span class="fn">knapsack</span>(weights, values, W):
    n = <span class="fn">len</span>(weights)
    dp = [[<span class="nm">0</span>] * (W + <span class="nm">1</span>) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n + <span class="nm">1</span>)]
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, n + <span class="nm">1</span>):
        <span class="kw">for</span> w <span class="kw">in</span> <span class="fn">range</span>(W + <span class="nm">1</span>):
            <span class="kw">if</span> weights[i - <span class="nm">1</span>] <= w:
                dp[i][w] = <span class="fn">max</span>(values[i - <span class="nm">1</span>] + dp[i - <span class="nm">1</span>][w - weights[i - <span class="nm">1</span>]],
                               dp[i - <span class="nm">1</span>][w])
            <span class="kw">else</span>:
                dp[i][w] = dp[i - <span class="nm">1</span>][w]
    <span class="kw">return</span> dp[n][W]`,
    lcs: `<span class="kw">def</span> <span class="fn">lcs</span>(a, b):
    m, n = <span class="fn">len</span>(a), <span class="fn">len</span>(b)
    dp = [[<span class="nm">0</span>] * (n + <span class="nm">1</span>) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(m + <span class="nm">1</span>)]
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, m + <span class="nm">1</span>):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, n + <span class="nm">1</span>):
            <span class="kw">if</span> a[i-<span class="nm">1</span>] == b[j-<span class="nm">1</span>]:
                dp[i][j] = dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>] + <span class="nm">1</span>
            <span class="kw">else</span>:
                dp[i][j] = <span class="fn">max</span>(dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>])
    <span class="kw">return</span> dp[m][n]`,
    lis: `<span class="kw">def</span> <span class="fn">lis</span>(arr):
    n = <span class="fn">len</span>(arr)
    dp = [<span class="nm">1</span>] * n
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, n):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(i):
            <span class="kw">if</span> arr[j] < arr[i]:
                dp[i] = <span class="fn">max</span>(dp[i], dp[j] + <span class="nm">1</span>)
    <span class="kw">return</span> <span class="fn">max</span>(dp)`,
    coinChange: `<span class="kw">def</span> <span class="fn">coin_change</span>(coins, amount):
    dp = [<span class="fn">float</span>(<span class="st">'inf'</span>)] * (amount + <span class="nm">1</span>)
    dp[<span class="nm">0</span>] = <span class="nm">0</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, amount + <span class="nm">1</span>):
        <span class="kw">for</span> c <span class="kw">in</span> coins:
            <span class="kw">if</span> c <= i <span class="kw">and</span> dp[i - c] + <span class="nm">1</span> < dp[i]:
                dp[i] = dp[i - c] + <span class="nm">1</span>
    <span class="kw">return</span> -<span class="nm">1</span> <span class="kw">if</span> dp[amount] == <span class="fn">float</span>(<span class="st">'inf'</span>) <span class="kw">else</span> dp[amount]
<span class="cm"># coin_change([1,3,4,5], 7) → 2</span>`,
    editDistance: `<span class="kw">def</span> <span class="fn">edit_distance</span>(a, b):
    m, n = <span class="fn">len</span>(a), <span class="fn">len</span>(b)
    dp = [[i <span class="kw">if</span> j == <span class="nm">0</span> <span class="kw">else</span> j <span class="kw">if</span> i == <span class="nm">0</span> <span class="kw">else</span> <span class="nm">0</span>
           <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n+<span class="nm">1</span>)] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(m+<span class="nm">1</span>)]
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, m+<span class="nm">1</span>):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, n+<span class="nm">1</span>):
            <span class="kw">if</span> a[i-<span class="nm">1</span>] == b[j-<span class="nm">1</span>]:
                dp[i][j] = dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>]
            <span class="kw">else</span>:
                dp[i][j] = <span class="nm">1</span> + <span class="fn">min</span>(dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>], dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>])
    <span class="kw">return</span> dp[m][n]
<span class="cm"># edit_distance("ALGO", "LOG") → 2</span>`,
    matrixChain: `<span class="kw">def</span> <span class="fn">matrix_chain</span>(dims):
    n = <span class="fn">len</span>(dims) - <span class="nm">1</span>
    dp = [[<span class="nm">0</span>] * n <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n)]
    <span class="kw">for</span> length <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">2</span>, n + <span class="nm">1</span>):
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n - length + <span class="nm">1</span>):
            j = i + length - <span class="nm">1</span>
            dp[i][j] = <span class="fn">float</span>(<span class="st">'inf'</span>)
            <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(i, j):
                cost = (dp[i][k] + dp[k+<span class="nm">1</span>][j]
                        + dims[i]*dims[k+<span class="nm">1</span>]*dims[j+<span class="nm">1</span>])
                <span class="kw">if</span> cost < dp[i][j]: dp[i][j] = cost
    <span class="kw">return</span> dp[<span class="nm">0</span>][n-<span class="nm">1</span>]
<span class="cm"># matrix_chain([10,30,5,60,10]) → 4500</span>`,
    rodCutting: `<span class="kw">def</span> <span class="fn">rod_cutting</span>(prices):
    n = <span class="fn">len</span>(prices)
    dp = [<span class="nm">0</span>] * (n + <span class="nm">1</span>)
    <span class="kw">for</span> length <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, n + <span class="nm">1</span>):
        <span class="kw">for</span> cut <span class="kw">in</span> <span class="fn">range</span>(<span class="nm">1</span>, length + <span class="nm">1</span>):
            dp[length] = <span class="fn">max</span>(dp[length], prices[cut-<span class="nm">1</span>] + dp[length-cut])
    <span class="kw">return</span> dp[n]
<span class="cm"># rod_cutting([1,5,8,9,10,17,17,20]) → 22</span>`,
    hashChaining: `<span class="kw">class</span> <span class="ty">HashTableChaining</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, size=<span class="nm">11</span>):
        self.size = size
        self.table = [[] <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(size)]
    <span class="kw">def</span> <span class="fn">_hash</span>(self, key): <span class="kw">return</span> key % self.size
    <span class="kw">def</span> <span class="fn">insert</span>(self, key):
        self.table[self.<span class="fn">_hash</span>(key)].<span class="fn">append</span>(key)
    <span class="kw">def</span> <span class="fn">search</span>(self, key):
        <span class="kw">return</span> key <span class="kw">in</span> self.table[self.<span class="fn">_hash</span>(key)]`,
    hashLinear: `<span class="kw">class</span> <span class="ty">HashTableLinear</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, size=<span class="nm">11</span>):
        self.size = size
        self.table = [<span class="kw">None</span>] * size
    <span class="kw">def</span> <span class="fn">_hash</span>(self, key): <span class="kw">return</span> key % self.size
    <span class="kw">def</span> <span class="fn">insert</span>(self, key):
        h = self.<span class="fn">_hash</span>(key)
        <span class="kw">while</span> self.table[h] <span class="kw">is not None</span>:
            h = (h + <span class="nm">1</span>) % self.size
        self.table[h] = key
    <span class="kw">def</span> <span class="fn">search</span>(self, key):
        h = self.<span class="fn">_hash</span>(key)
        <span class="kw">while</span> self.table[h] <span class="kw">is not None</span>:
            <span class="kw">if</span> self.table[h] == key: <span class="kw">return</span> h
            h = (h + <span class="nm">1</span>) % self.size
        <span class="kw">return</span> -<span class="nm">1</span>`,
  },
  cpp: {
    bst: `<span class="kw">struct</span> <span class="ty">Node</span> {
    <span class="ty">int</span> val;
    <span class="ty">Node</span> *left = <span class="kw">nullptr</span>, *right = <span class="kw">nullptr</span>;
    <span class="fn">Node</span>(<span class="ty">int</span> v) : val(v) {}
};

<span class="ty">Node</span>* <span class="fn">insert</span>(<span class="ty">Node</span>* root, <span class="ty">int</span> val) {
    <span class="kw">if</span> (!root) <span class="kw">return</span> <span class="kw">new</span> <span class="ty">Node</span>(val);
    <span class="ty">Node</span>* cur = root;
    <span class="kw">while</span> (<span class="kw">true</span>) {
        <span class="kw">if</span> (val < cur->val) {
            <span class="kw">if</span> (!cur->left) { cur->left = <span class="kw">new</span> <span class="ty">Node</span>(val); <span class="kw">return</span> root; }
            cur = cur->left;
        } <span class="kw">else if</span> (val > cur->val) {
            <span class="kw">if</span> (!cur->right) { cur->right = <span class="kw">new</span> <span class="ty">Node</span>(val); <span class="kw">return</span> root; }
            cur = cur->right;
        } <span class="kw">else return</span> root;
    }
}

<span class="ty">Node</span>* <span class="fn">search</span>(<span class="ty">Node</span>* root, <span class="ty">int</span> val) {
    <span class="kw">while</span> (root) {
        <span class="kw">if</span> (val == root->val) <span class="kw">return</span> root;
        root = val < root->val ? root->left : root->right;
    }
    <span class="kw">return</span> <span class="kw">nullptr</span>;
}`,
    kmp: `<span class="ty">vector</span>&lt;<span class="ty">int</span>&gt; <span class="fn">buildLPS</span>(<span class="kw">const</span> <span class="ty">string</span>& p) {
    <span class="ty">vector</span>&lt;<span class="ty">int</span>&gt; lps(p.<span class="fn">size</span>(), <span class="nm">0</span>);
    <span class="ty">int</span> len = <span class="nm">0</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i < (<span class="ty">int</span>)p.<span class="fn">size</span>(); ) {
        <span class="kw">if</span> (p[i] == p[len]) lps[i++] = ++len;
        <span class="kw">else if</span> (len > <span class="nm">0</span>) len = lps[len - <span class="nm">1</span>];
        <span class="kw">else</span> lps[i++] = <span class="nm">0</span>;
    }
    <span class="kw">return</span> lps;
}

<span class="ty">int</span> <span class="fn">kmp</span>(<span class="kw">const</span> <span class="ty">string</span>& text, <span class="kw">const</span> <span class="ty">string</span>& pat) {
    <span class="ty">vector</span>&lt;<span class="ty">int</span>&gt; lps = <span class="fn">buildLPS</span>(pat);
    <span class="ty">int</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>;
    <span class="kw">while</span> (i < (<span class="ty">int</span>)text.<span class="fn">size</span>()) {
        <span class="kw">if</span> (text[i] == pat[j]) {
            i++; j++;
            <span class="kw">if</span> (j == (<span class="ty">int</span>)pat.<span class="fn">size</span>()) <span class="kw">return</span> i - j;
        } <span class="kw">else if</span> (j > <span class="nm">0</span>) j = lps[j - <span class="nm">1</span>];
        <span class="kw">else</span> i++;
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    rabinkarp: `<span class="ty">int</span> <span class="fn">rabinKarp</span>(<span class="kw">const</span> <span class="ty">string</span>& text, <span class="kw">const</span> <span class="ty">string</span>& pat) {
    <span class="kw">const</span> <span class="ty">int</span> B = <span class="nm">256</span>, M = <span class="nm">101</span>;
    <span class="ty">int</span> m = pat.<span class="fn">size</span>(), n = text.<span class="fn">size</span>();
    <span class="kw">if</span> (m > n) <span class="kw">return</span> -<span class="nm">1</span>;
    <span class="ty">int</span> patH = <span class="nm">0</span>, winH = <span class="nm">0</span>, h = <span class="nm">1</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < m - <span class="nm">1</span>; i++) h = (h * B) % M;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < m; i++) {
        patH = (B * patH + pat[i]) % M;
        winH = (B * winH + text[i]) % M;
    }
    <span class="kw">for</span> (<span class="ty">int</span> s = <span class="nm">0</span>; s <= n - m; s++) {
        <span class="kw">if</span> (patH == winH && text.<span class="fn">compare</span>(s, m, pat) == <span class="nm">0</span>) <span class="kw">return</span> s;
        <span class="kw">if</span> (s < n - m) {
            winH = (B * (winH - text[s] * h) + text[s + m]) % M;
            <span class="kw">if</span> (winH < <span class="nm">0</span>) winH += M;
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    nqueens: `<span class="ty">vector</span>&lt;<span class="ty">int</span>&gt; board;

<span class="kw">bool</span> <span class="fn">isSafe</span>(<span class="ty">int</span> row, <span class="ty">int</span> col) {
    <span class="kw">for</span> (<span class="ty">int</span> c = <span class="nm">0</span>; c < col; c++) {
        <span class="ty">int</span> r = board[c];
        <span class="kw">if</span> (r == row || <span class="fn">abs</span>(r - row) == col - c) <span class="kw">return</span> <span class="kw">false</span>;
    }
    <span class="kw">return</span> <span class="kw">true</span>;
}

<span class="kw">bool</span> <span class="fn">place</span>(<span class="ty">int</span> col, <span class="ty">int</span> n) {
    <span class="kw">if</span> (col == n) <span class="kw">return</span> <span class="kw">true</span>;
    <span class="kw">for</span> (<span class="ty">int</span> row = <span class="nm">0</span>; row < n; row++) {
        <span class="kw">if</span> (<span class="fn">isSafe</span>(row, col)) {
            board[col] = row;
            <span class="kw">if</span> (<span class="fn">place</span>(col + <span class="nm">1</span>, n)) <span class="kw">return</span> <span class="kw">true</span>;
            board[col] = -<span class="nm">1</span>;  <span class="cm">// откат</span>
        }
    }
    <span class="kw">return</span> <span class="kw">false</span>;
}`,
    bubble: `<span class="kw">void</span> <span class="fn">bubbleSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> n = arr.<span class="fn">size</span>();
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n - <span class="nm">1</span>; i++) {
        <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">0</span>; j < n - i - <span class="nm">1</span>; j++) {
            <span class="kw">if</span> (arr[j] > arr[j + <span class="nm">1</span>]) {
                <span class="fn">swap</span>(arr[j], arr[j + <span class="nm">1</span>]);
            }
        }
    }
}`,
    selection: `<span class="kw">void</span> <span class="fn">selectionSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> n = arr.<span class="fn">size</span>();
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n - <span class="nm">1</span>; i++) {
        <span class="ty">int</span> minIdx = i;
        <span class="kw">for</span> (<span class="ty">int</span> j = i + <span class="nm">1</span>; j < n; j++) {
            <span class="kw">if</span> (arr[j] < arr[minIdx])
                minIdx = j;
        }
        <span class="kw">if</span> (minIdx != i)
            <span class="fn">swap</span>(arr[i], arr[minIdx]);
    }
}`,
    insertion: `<span class="kw">void</span> <span class="fn">insertionSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> n = arr.<span class="fn">size</span>();
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i < n; i++) {
        <span class="ty">int</span> key = arr[i];
        <span class="ty">int</span> j = i - <span class="nm">1</span>;
        <span class="kw">while</span> (j >= <span class="nm">0</span> && arr[j] > key) {
            arr[j + <span class="nm">1</span>] = arr[j];
            j--;
        }
        arr[j + <span class="nm">1</span>] = key;
    }
}`,
    shell: `<span class="kw">void</span> <span class="fn">shellSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> n = arr.<span class="fn">size</span>();
    <span class="kw">for</span> (<span class="ty">int</span> gap = n / <span class="nm">2</span>; gap > <span class="nm">0</span>; gap /= <span class="nm">2</span>) {
        <span class="kw">for</span> (<span class="ty">int</span> i = gap; i < n; i++) {
            <span class="ty">int</span> temp = arr[i];
            <span class="ty">int</span> j = i;
            <span class="kw">while</span> (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`,
    quick: `<span class="kw">void</span> <span class="fn">quickSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> lo, <span class="ty">int</span> hi) {
    <span class="kw">if</span> (lo >= hi) <span class="kw">return</span>;
    <span class="ty">int</span> pivot = arr[hi];
    <span class="ty">int</span> i = lo - <span class="nm">1</span>;
    <span class="kw">for</span> (<span class="ty">int</span> j = lo; j < hi; j++) {
        <span class="kw">if</span> (arr[j] <= pivot) {
            i++;
            <span class="fn">swap</span>(arr[i], arr[j]);
        }
    }
    <span class="fn">swap</span>(arr[i + <span class="nm">1</span>], arr[hi]);
    <span class="ty">int</span> p = i + <span class="nm">1</span>;
    <span class="fn">quickSort</span>(arr, lo, p - <span class="nm">1</span>);
    <span class="fn">quickSort</span>(arr, p + <span class="nm">1</span>, hi);
}
<span class="cm">// вызов: quickSort(arr, 0, arr.size() - 1)</span>`,
    merge: `<span class="ty">vector</span><<span class="ty">int</span>> <span class="fn">mergeSort</span>(<span class="ty">vector</span><<span class="ty">int</span>> arr) {
    <span class="kw">if</span> (arr.<span class="fn">size</span>() <= <span class="nm">1</span>) <span class="kw">return</span> arr;
    <span class="ty">int</span> mid = arr.<span class="fn">size</span>() / <span class="nm">2</span>;
    <span class="ty">vector</span><<span class="ty">int</span>> left(arr.<span class="fn">begin</span>(), arr.<span class="fn">begin</span>() + mid);
    <span class="ty">vector</span><<span class="ty">int</span>> right(arr.<span class="fn">begin</span>() + mid, arr.<span class="fn">end</span>());
    left = <span class="fn">mergeSort</span>(left);
    right = <span class="fn">mergeSort</span>(right);
    <span class="kw">return</span> <span class="fn">merge</span>(left, right);
}

<span class="ty">vector</span><<span class="ty">int</span>> <span class="fn">merge</span>(<span class="ty">vector</span><<span class="ty">int</span>>& l, <span class="ty">vector</span><<span class="ty">int</span>>& r) {
    <span class="ty">vector</span><<span class="ty">int</span>> result;
    <span class="ty">int</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>;
    <span class="kw">while</span> (i < l.<span class="fn">size</span>() && j < r.<span class="fn">size</span>())
        result.<span class="fn">push_back</span>(l[i] <= r[j] ? l[i++] : r[j++]);
    <span class="kw">while</span> (i < l.<span class="fn">size</span>()) result.<span class="fn">push_back</span>(l[i++]);
    <span class="kw">while</span> (j < r.<span class="fn">size</span>()) result.<span class="fn">push_back</span>(r[j++]);
    <span class="kw">return</span> result;
}`,
    heap: `<span class="kw">void</span> <span class="fn">heapSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> n = arr.<span class="fn">size</span>();
    <span class="kw">for</span> (<span class="ty">int</span> i = n/<span class="nm">2</span> - <span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
        <span class="fn">heapify</span>(arr, n, i);
    <span class="kw">for</span> (<span class="ty">int</span> i = n - <span class="nm">1</span>; i > <span class="nm">0</span>; i--) {
        <span class="fn">swap</span>(arr[<span class="nm">0</span>], arr[i]);
        <span class="fn">heapify</span>(arr, i, <span class="nm">0</span>);
    }
}

<span class="kw">void</span> <span class="fn">heapify</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> n, <span class="ty">int</span> i) {
    <span class="ty">int</span> largest = i, l = <span class="nm">2</span>*i + <span class="nm">1</span>, r = <span class="nm">2</span>*i + <span class="nm">2</span>;
    <span class="kw">if</span> (l < n && arr[l] > arr[largest]) largest = l;
    <span class="kw">if</span> (r < n && arr[r] > arr[largest]) largest = r;
    <span class="kw">if</span> (largest != i) {
        <span class="fn">swap</span>(arr[i], arr[largest]);
        <span class="fn">heapify</span>(arr, n, largest);
    }
}`,
    radix: `<span class="kw">void</span> <span class="fn">radixSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> maxVal = *<span class="fn">max_element</span>(arr.<span class="fn">begin</span>(), arr.<span class="fn">end</span>());
    <span class="kw">for</span> (<span class="ty">int</span> exp = <span class="nm">1</span>; maxVal/exp > <span class="nm">0</span>; exp *= <span class="nm">10</span>)
        <span class="fn">countingSort</span>(arr, exp);
}

<span class="kw">void</span> <span class="fn">countingSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> exp) {
    <span class="ty">int</span> n = arr.<span class="fn">size</span>();
    <span class="ty">vector</span><<span class="ty">int</span>> output(n), count(<span class="nm">10</span>, <span class="nm">0</span>);
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i++)
        count[(arr[i]/exp) % <span class="nm">10</span>]++;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i < <span class="nm">10</span>; i++) count[i] += count[i-<span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = n-<span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
        output[--count[(arr[i]/exp) % <span class="nm">10</span>]] = arr[i];
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i++) arr[i] = output[i];
}`,
    counting: `<span class="kw">void</span> <span class="fn">countingSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> max = *<span class="fn">max_element</span>(arr.<span class="fn">begin</span>(), arr.<span class="fn">end</span>());
    <span class="ty">vector</span><<span class="ty">int</span>> count(max + <span class="nm">1</span>, <span class="nm">0</span>), output(arr.<span class="fn">size</span>());
    <span class="kw">for</span> (<span class="ty">int</span> x : arr) count[x]++;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= max; i++) count[i] += count[i-<span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = arr.<span class="fn">size</span>()-<span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
        output[--count[arr[i]]] = arr[i];
    arr = output;
}`,
    timsort: `<span class="kw">const int</span> MIN_RUN = <span class="nm">32</span>;

<span class="kw">void</span> <span class="fn">insertionSortRange</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> lo, <span class="ty">int</span> hi) {
    <span class="kw">for</span> (<span class="ty">int</span> i = lo + <span class="nm">1</span>; i <= hi; i++) {
        <span class="ty">int</span> key = arr[i];
        <span class="ty">int</span> j = i - <span class="nm">1</span>;
        <span class="kw">while</span> (j >= lo && arr[j] > key) {
            arr[j+<span class="nm">1</span>] = arr[j--];
        }
        arr[j + <span class="nm">1</span>] = key;
    }
}

<span class="kw">void</span> <span class="fn">merge</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> lo, <span class="ty">int</span> mid, <span class="ty">int</span> hi) {
    <span class="ty">vector</span><<span class="ty">int</span>> left(arr.<span class="fn">begin</span>() + lo, arr.<span class="fn">begin</span>() + mid + <span class="nm">1</span>);
    <span class="ty">vector</span><<span class="ty">int</span>> right(arr.<span class="fn">begin</span>() + mid + <span class="nm">1</span>, arr.<span class="fn">begin</span>() + hi + <span class="nm">1</span>);
    <span class="ty">int</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>, k = lo;
    <span class="kw">while</span> (i < left.<span class="fn">size</span>() && j < right.<span class="fn">size</span>())
        arr[k++] = left[i]<=right[j] ? left[i++] : right[j++];
    <span class="kw">while</span> (i < left.<span class="fn">size</span>())
        arr[k++] = left[i++];
    <span class="kw">while</span> (j < right.<span class="fn">size</span>())
        arr[k++] = right[j++];
}

<span class="kw">void</span> <span class="fn">timSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> n = arr.<span class="fn">size</span>();
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i += MIN_RUN)
        <span class="fn">insertionSortRange</span>(arr, i, <span class="fn">min</span>(i + MIN_RUN - <span class="nm">1</span>, n - <span class="nm">1</span>));
    <span class="kw">for</span> (<span class="ty">int</span> size = MIN_RUN; size < n; size *= <span class="nm">2</span>) {
        <span class="kw">for</span> (<span class="ty">int</span> lo = <span class="nm">0</span>; lo < n; lo += <span class="nm">2</span> * size) {
            <span class="ty">int</span> mid = <span class="fn">min</span>(lo + size-<span class="nm">1</span>, n - <span class="nm">1</span>);
            <span class="ty">int</span> hi = <span class="fn">min</span>(lo + <span class="nm">2</span> * size-<span class="nm">1</span>, n-<span class="nm">1</span>);
            <span class="kw">if</span> (mid < hi) <span class="fn">merge</span>(arr, lo, mid, hi);
        }
    }
}`,
    linear: `<span class="ty">int</span> <span class="fn">linearSearch</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> target) {
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < arr.<span class="fn">size</span>(); i++) {
        <span class="kw">if</span> (arr[i] == target) <span class="kw">return</span> i;
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    binary: `<span class="ty">int</span> <span class="fn">binarySearch</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> target) {
    <span class="ty">int</span> lo = <span class="nm">0</span>, hi = arr.<span class="fn">size</span>() - <span class="nm">1</span>;
    <span class="kw">while</span> (lo <= hi) {
        <span class="ty">int</span> mid = lo + (hi - lo) / <span class="nm">2</span>;
        <span class="kw">if</span> (arr[mid] == target) <span class="kw">return</span> mid;
        <span class="kw">if</span> (arr[mid] < target) lo = mid + <span class="nm">1</span>;
        <span class="kw">else</span> hi = mid - <span class="nm">1</span>;
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    jump: `<span class="ty">int</span> <span class="fn">jumpSearch</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> target) {
    <span class="ty">int</span> n = arr.<span class="fn">size</span>();
    <span class="ty">int</span> step = <span class="fn">sqrt</span>(n);
    <span class="ty">int</span> prev = <span class="nm">0</span>;
    <span class="kw">while</span> (arr[<span class="fn">min</span>(step, n)-<span class="nm">1</span>] < target) {
        prev = step;
        step += <span class="fn">sqrt</span>(n);
        <span class="kw">if</span> (prev >= n) <span class="kw">return</span> -<span class="nm">1</span>;
    }
    <span class="kw">while</span> (arr[prev] < target) {
        prev++;
        <span class="kw">if</span> (prev == <span class="fn">min</span>(step, n)) <span class="kw">return</span> -<span class="nm">1</span>;
    }
    <span class="kw">return</span> (arr[prev] == target) ? prev : -<span class="nm">1</span>;
}`,
    interpolation: `<span class="ty">int</span> <span class="fn">interpolationSearch</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> target) {
    <span class="ty">int</span> lo = <span class="nm">0</span>, hi = arr.<span class="fn">size</span>() - <span class="nm">1</span>;
    <span class="kw">while</span> (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        <span class="kw">if</span> (lo == hi) <span class="kw">return</span> (arr[lo] == target) ? lo : -<span class="nm">1</span>;
        <span class="ty">int</span> pos = lo + ((<span class="kw">double</span>)(target - arr[lo]) / (arr[hi] - arr[lo])) * (hi - lo);
        <span class="kw">if</span> (arr[pos] == target) <span class="kw">return</span> pos;
        <span class="kw">if</span> (arr[pos] < target) lo = pos + <span class="nm">1</span>;
        <span class="kw">else</span> hi = pos - <span class="nm">1</span>;
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    exponential: `<span class="ty">int</span> <span class="fn">exponentialSearch</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> target) {
    <span class="kw">if</span> (arr[<span class="nm">0</span>] == target) <span class="kw">return</span> <span class="nm">0</span>;
    <span class="ty">int</span> i = <span class="nm">1</span>;
    <span class="kw">while</span> (i < arr.<span class="fn">size</span>() && arr[i] <= target) i *= <span class="nm">2</span>;
    <span class="kw">return</span> <span class="fn">binarySearch</span>(arr, target, i/<span class="nm">2</span>, <span class="fn">min</span>(i, (<span class="ty">int</span>)arr.<span class="fn">size</span>()-<span class="nm">1</span>));
}`,
    ternary: `<span class="kw">int</span> <span class="fn">ternary_search</span>(<span class="ty">const</span> <span class="ty">vector</span><<span class="ty">int</span>>& arr, <span class="ty">int</span> target) {
    <span class="ty">int</span> lo = <span class="nm">0</span>, hi = <span class="fn">static_cast</span><<span class="ty">int</span>>(arr.<span class="fn">size</span>()) - <span class="nm">1</span>;
    <span class="kw">while</span> (lo <= hi) {
        <span class="ty">int</span> third = (hi - lo) / <span class="nm">3</span>;
        <span class="ty">int</span> mid1 = lo + third;
        <span class="ty">int</span> mid2 = hi - third;
        <span class="kw">if</span> (arr[mid1] == target) <span class="kw">return</span> mid1;
        <span class="kw">if</span> (arr[mid2] == target) <span class="kw">return</span> mid2;
        <span class="kw">if</span> (target < arr[mid1]) hi = mid1 - <span class="nm">1</span>;
        <span class="kw">else if</span> (target > arr[mid2]) lo = mid2 + <span class="nm">1</span>;
        <span class="kw">else</span> {
            lo = mid1 + <span class="nm">1</span>
            hi = mid2 - <span class="nm">1</span>;
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    bfs: `<span class="kw">void</span> <span class="fn">bfs</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>>& graph, <span class="ty">int</span> start) {
    <span class="ty">vector</span><<span class="ty">bool</span>> visited(graph.<span class="fn">size</span>(), <span class="kw">false</span>);
    <span class="ty">queue</span><<span class="ty">int</span>> q;
    q.<span class="fn">push</span>(start);
    visited[start] = <span class="kw">true</span>;
    <span class="kw">while</span> (!q.<span class="fn">empty</span>()) {
        <span class="ty">int</span> node = q.<span class="fn">front</span>(); q.<span class="fn">pop</span>();
        <span class="kw">for</span> (<span class="ty">int</span> neighbor : graph[node]) {
            <span class="kw">if</span> (!visited[neighbor]) {
                visited[neighbor] = <span class="kw">true</span>;
                q.<span class="fn">push</span>(neighbor);
            }
        }
    }
}`,
    dfs: `<span class="kw">void</span> <span class="fn">dfs</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>>& graph, <span class="ty">int</span> start, <span class="ty">vector</span><<span class="ty">bool</span>>& visited) {
    visited[start] = <span class="kw">true</span>;
    <span class="kw">for</span> (<span class="ty">int</span> neighbor : graph[start]) {
        <span class="kw">if</span> (!visited[neighbor])
            <span class="fn">dfs</span>(graph, neighbor, visited);
    }
}`,
    dijkstra: `<span class="ty">vector</span><<span class="ty">int</span>> <span class="fn">dijkstra</span>(<span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">pair</span><<span class="ty">int</span>,<span class="ty">int</span>>>>& g, <span class="ty">int</span> src) {
    <span class="ty">int</span> n = g.<span class="fn">size</span>();
    <span class="ty">vector</span><<span class="ty">int</span>> dist(n, <span class="ty">INT_MAX</span>);
    <span class="ty">priority_queue</span><<span class="ty">pair</span><<span class="ty">int</span>,<span class="ty">int</span>>,<span class="ty">vector</span><<span class="ty">pair</span><<span class="ty">int</span>,<span class="ty">int</span>>>,<span class="ty">greater</span><>> pq;
    dist[src] = <span class="nm">0</span>;
    pq.<span class="fn">push</span>({<span class="nm">0</span>, src});
    <span class="kw">while</span> (!pq.<span class="fn">empty</span>()) {
        <span class="kw">auto</span> [d, u] = pq.<span class="fn">top</span>(); pq.<span class="fn">pop</span>();
        <span class="kw">if</span> (d > dist[u]) <span class="kw">continue</span>;
        <span class="kw">for</span> (<span class="kw">auto</span> [v, w] : g[u])
            <span class="kw">if</span> (dist[u] + w < dist[v])
                pq.<span class="fn">push</span>({dist[v] = dist[u]+w, v});
    }
    <span class="kw">return</span> dist;
}`,
    bellmanFord: `<span class="ty">vector</span><<span class="ty">int</span>> <span class="fn">bellmanFord</span>(<span class="ty">vector</span><<span class="ty">tuple</span><<span class="ty">int</span>,<span class="ty">int</span>,<span class="ty">int</span>>>& edges, <span class="ty">int</span> n, <span class="ty">int</span> src) {
    <span class="ty">vector</span><<span class="ty">int</span>> dist(n, <span class="ty">INT_MAX</span>);
    dist[src] = <span class="nm">0</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n - <span class="nm">1</span>; i++) {
        <span class="ty">bool</span> updated = <span class="kw">false</span>;
        <span class="kw">for</span> (<span class="kw">auto</span>& [u, v, w] : edges) {
            <span class="kw">if</span> (dist[u] != <span class="ty">INT_MAX</span> && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = <span class="kw">true</span>;
            }
        }
        <span class="kw">if</span> (!updated) <span class="kw">break</span>;
    }
    <span class="kw">return</span> dist;
}`,
    astar: `<span class="ty">int</span> <span class="fn">aStar</span>(<span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">pair</span><<span class="ty">int</span>,<span class="ty">int</span>>>>& graph, <span class="ty">int</span> src, <span class="ty">int</span> goal,
           <span class="ty">function</span><<span class="ty">int</span>(<span class="ty">int</span>)> h) {
    <span class="ty">int</span> n = graph.<span class="fn">size</span>();
    <span class="ty">vector</span><<span class="ty">int</span>> g(n, <span class="ty">INT_MAX</span>);
    g[src] = <span class="nm">0</span>;
    <span class="ty">priority_queue</span><<span class="ty">pair</span><<span class="ty">int</span>,<span class="ty">int</span>>,<span class="ty">vector</span><<span class="ty">pair</span><<span class="ty">int</span>,<span class="ty">int</span>>>,<span class="ty">greater</span><>> pq;
    pq.<span class="fn">push</span>({<span class="fn">h</span>(src), src});
    <span class="ty">vector</span><<span class="ty">bool</span>> visited(n, <span class="kw">false</span>);
    <span class="kw">while</span> (!pq.<span class="fn">empty</span>()) {
        <span class="kw">auto</span> [f, u] = pq.<span class="fn">top</span>(); pq.<span class="fn">pop</span>();
        <span class="kw">if</span> (visited[u]) <span class="kw">continue</span>;
        visited[u] = <span class="kw">true</span>;
        <span class="kw">if</span> (u == goal) <span class="kw">return</span> g[goal];
        <span class="kw">for</span> (<span class="kw">auto</span> [v, w] : graph[u]) {
            <span class="ty">int</span> tg = g[u] + w;
            <span class="kw">if</span> (tg < g[v]) {
                g[v] = tg;
                pq.<span class="fn">push</span>({tg + <span class="fn">h</span>(v), v});
            }
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    toposort: `<span class="kw">void</span> <span class="fn">dfsTopoSort</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>>& graph, <span class="ty">int</span> u,
                    <span class="ty">vector</span><<span class="ty">bool</span>>& visited, <span class="ty">vector</span><<span class="ty">int</span>>& order) {
    visited[u] = <span class="kw">true</span>;
    <span class="kw">for</span> (<span class="ty">int</span> v : graph[u])
        <span class="kw">if</span> (!visited[v]) <span class="fn">dfsTopoSort</span>(graph, v, visited, order);
    order.<span class="fn">push_back</span>(u);
}

<span class="ty">vector</span><<span class="ty">int</span>> <span class="fn">topoSort</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>>& graph, <span class="ty">int</span> n) {
    <span class="ty">vector</span><<span class="ty">bool</span>> visited(n, <span class="kw">false</span>);
    <span class="ty">vector</span><<span class="ty">int</span>> order;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i++)
        <span class="kw">if</span> (!visited[i]) <span class="fn">dfsTopoSort</span>(graph, i, visited, order);
    <span class="fn">reverse</span>(order.<span class="fn">begin</span>(), order.<span class="fn">end</span>());
    <span class="kw">return</span> order;
}`,
    floydWarshall: `<span class="kw">void</span> <span class="fn">floydWarshall</span>(<span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>>& dp) {
    <span class="ty">int</span> n = dp.<span class="fn">size</span>();
    <span class="kw">for</span> (<span class="ty">int</span> k = <span class="nm">0</span>; k < n; k++)
        <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i++)
            <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">0</span>; j < n; j++)
                <span class="kw">if</span> (dp[i][k] != <span class="ty">INT_MAX</span> && dp[k][j] != <span class="ty">INT_MAX</span>)
                    dp[i][j] = <span class="fn">min</span>(dp[i][j], dp[i][k] + dp[k][j]);
}`,
    prim: `<span class="ty">int</span> <span class="fn">prim</span>(<span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">pair</span><<span class="ty">int</span>,<span class="ty">int</span>>>>& graph, <span class="ty">int</span> n) {
    <span class="ty">vector</span><<span class="ty">bool</span>> inMST(n, <span class="kw">false</span>);
    <span class="ty">vector</span><<span class="ty">int</span>> key(n, <span class="ty">INT_MAX</span>);
    key[<span class="nm">0</span>] = <span class="nm">0</span>;
    <span class="ty">priority_queue</span><<span class="ty">pair</span><<span class="ty">int</span>,<span class="ty">int</span>>,<span class="ty">vector</span><<span class="ty">pair</span><<span class="ty">int</span>,<span class="ty">int</span>>>,<span class="ty">greater</span><>> pq;
    pq.<span class="fn">push</span>({<span class="nm">0</span>, <span class="nm">0</span>});
    <span class="ty">int</span> cost = <span class="nm">0</span>;
    <span class="kw">while</span> (!pq.<span class="fn">empty</span>()) {
        <span class="kw">auto</span> [w, u] = pq.<span class="fn">top</span>(); pq.<span class="fn">pop</span>();
        <span class="kw">if</span> (inMST[u]) <span class="kw">continue</span>;
        inMST[u] = <span class="kw">true</span>; cost += w;
        <span class="kw">for</span> (<span class="kw">auto</span> [v, wt] : graph[u])
            <span class="kw">if</span> (!inMST[v] && wt < key[v]) {
                key[v] = wt;
                pq.<span class="fn">push</span>({wt, v});
            }
    }
    <span class="kw">return</span> cost;
}`,
    kruskal: `<span class="ty">int</span> <span class="fn">find</span>(<span class="ty">vector</span><<span class="ty">int</span>>& parent, <span class="ty">int</span> x) {
    <span class="kw">if</span> (parent[x] != x) parent[x] = <span class="fn">find</span>(parent, parent[x]);
    <span class="kw">return</span> parent[x];
}

<span class="ty">int</span> <span class="fn">kruskal</span>(<span class="ty">vector</span><<span class="ty">tuple</span><<span class="ty">int</span>,<span class="ty">int</span>,<span class="ty">int</span>>>& edges, <span class="ty">int</span> n) {
    <span class="fn">sort</span>(edges.<span class="fn">begin</span>(), edges.<span class="fn">end</span>());
    <span class="ty">vector</span><<span class="ty">int</span>> parent(n);
    <span class="fn">iota</span>(parent.<span class="fn">begin</span>(), parent.<span class="fn">end</span>(), <span class="nm">0</span>);
    <span class="ty">int</span> cost = <span class="nm">0</span>;
    <span class="kw">for</span> (<span class="kw">auto</span>& [w, u, v] : edges) {
        <span class="ty">int</span> pu = <span class="fn">find</span>(parent, u), pv = <span class="fn">find</span>(parent, v);
        <span class="kw">if</span> (pu != pv) { parent[pu] = pv; cost += w; }
    }
    <span class="kw">return</span> cost;
}`,
    fib: `<span class="ty">int</span> <span class="fn">fibonacci</span>(<span class="ty">int</span> n) {
    <span class="ty">vector</span><<span class="ty">int</span>> dp(n + <span class="nm">1</span>, <span class="nm">0</span>);
    dp[<span class="nm">1</span>] = <span class="nm">1</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">2</span>; i <= n; i++)
        dp[i] = dp[i-<span class="nm">1</span>] + dp[i-<span class="nm">2</span>];
    <span class="kw">return</span> dp[n];
}`,
    knapsack: `<span class="ty">int</span> <span class="fn">knapsack</span>(<span class="ty">vector</span><<span class="ty">int</span>>& wt, <span class="ty">vector</span><<span class="ty">int</span>>& val, <span class="ty">int</span> W) {
    <span class="ty">int</span> n = wt.<span class="fn">size</span>();
    <span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>> dp(n+<span class="nm">1</span>, <span class="ty">vector</span><<span class="ty">int</span>>(W+<span class="nm">1</span>, <span class="nm">0</span>));
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= n; i++) {
        <span class="kw">for</span> (<span class="ty">int</span> w = <span class="nm">0</span>; w <= W; w++) {
            <span class="kw">if</span> (wt[i-<span class="nm">1</span>] <= w)
                dp[i][w] = <span class="fn">max</span>(val[i-<span class="nm">1</span>] + dp[i-<span class="nm">1</span>][w-wt[i-<span class="nm">1</span>]], dp[i-<span class="nm">1</span>][w]);
            <span class="kw">else</span>
                dp[i][w] = dp[i-<span class="nm">1</span>][w];
        }
    }
    <span class="kw">return</span> dp[n][W];
}`,
    lcs: `<span class="ty">int</span> <span class="fn">lcs</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">int</span>>& a, <span class="kw">const</span> <span class="ty">vector</span><<span class="ty">int</span>>& b) {
    <span class="ty">int</span> m = a.<span class="fn">size</span>(), n = b.<span class="fn">size</span>();
    <span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>> dp(m+<span class="nm">1</span>, <span class="ty">vector</span><<span class="ty">int</span>>(n+<span class="nm">1</span>, <span class="nm">0</span>));
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= m; i++)
        <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">1</span>; j <= n; j++)
            dp[i][j] = (a[i-<span class="nm">1</span>]==b[j-<span class="nm">1</span>])
                ? dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>] + <span class="nm">1</span>
                : <span class="fn">max</span>(dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>]);
    <span class="kw">return</span> dp[m][n];
}`,
    lis: `<span class="ty">int</span> <span class="fn">lis</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> n = arr.<span class="fn">size</span>();
    <span class="ty">vector</span><<span class="ty">int</span>> dp(n, <span class="nm">1</span>);
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i < n; i++)
        <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">0</span>; j < i; j++)
            <span class="kw">if</span> (arr[j] < arr[i])
                dp[i] = <span class="fn">max</span>(dp[i], dp[j] + <span class="nm">1</span>);
    <span class="kw">return</span> *<span class="fn">max_element</span>(dp.<span class="fn">begin</span>(), dp.<span class="fn">end</span>());
}`,
    coinChange: `<span class="ty">int</span> <span class="fn">coinChange</span>(<span class="ty">vector</span><<span class="ty">int</span>>& coins, <span class="ty">int</span> amount) {
    <span class="ty">vector</span><<span class="ty">int</span>> dp(amount + <span class="nm">1</span>, <span class="ty">INT_MAX</span>);
    dp[<span class="nm">0</span>] = <span class="nm">0</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= amount; i++)
        <span class="kw">for</span> (<span class="ty">int</span> c : coins)
            <span class="kw">if</span> (c <= i && dp[i - c] != <span class="ty">INT_MAX</span>)
                dp[i] = <span class="fn">min</span>(dp[i], dp[i - c] + <span class="nm">1</span>);
    <span class="kw">return</span> dp[amount] == <span class="ty">INT_MAX</span> ? -<span class="nm">1</span> : dp[amount];
}
<span class="cm">// coinChange({1,3,4,5}, 7) → 2</span>`,
    editDistance: `<span class="ty">int</span> <span class="fn">editDistance</span>(<span class="kw">const</span> <span class="ty">string</span>& a, <span class="kw">const</span> <span class="ty">string</span>& b) {
    <span class="ty">int</span> m = a.<span class="fn">size</span>(), n = b.<span class="fn">size</span>();
    <span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>> dp(m+<span class="nm">1</span>, <span class="ty">vector</span><<span class="ty">int</span>>(n+<span class="nm">1</span>));
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i <= m; i++) dp[i][<span class="nm">0</span>] = i;
    <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">0</span>; j <= n; j++) dp[<span class="nm">0</span>][j] = j;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= m; i++)
        <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">1</span>; j <= n; j++) {
            <span class="kw">if</span> (a[i-<span class="nm">1</span>] == b[j-<span class="nm">1</span>]) dp[i][j] = dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>];
            <span class="kw">else</span> dp[i][j] = <span class="nm">1</span> + <span class="fn">min</span>({dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>], dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>]});
        }
    <span class="kw">return</span> dp[m][n];
}
<span class="cm">// editDistance("ALGO", "LOG") → 2</span>`,
    matrixChain: `<span class="ty">int</span> <span class="fn">matrixChain</span>(<span class="ty">vector</span><<span class="ty">int</span>>& dims) {
    <span class="ty">int</span> n = dims.<span class="fn">size</span>() - <span class="nm">1</span>;
    <span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>> dp(n, <span class="ty">vector</span><<span class="ty">int</span>>(n, <span class="nm">0</span>));
    <span class="kw">for</span> (<span class="ty">int</span> len = <span class="nm">2</span>; len <= n; len++) {
        <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i <= n - len; i++) {
            <span class="ty">int</span> j = i + len - <span class="nm">1</span>;
            dp[i][j] = <span class="ty">INT_MAX</span>;
            <span class="kw">for</span> (<span class="ty">int</span> k = i; k < j; k++) {
                <span class="ty">int</span> cost = dp[i][k] + dp[k+<span class="nm">1</span>][j]
                          + dims[i] * dims[k+<span class="nm">1</span>] * dims[j+<span class="nm">1</span>];
                dp[i][j] = <span class="fn">min</span>(dp[i][j], cost);
            }
        }
    }
    <span class="kw">return</span> dp[<span class="nm">0</span>][n-<span class="nm">1</span>];
}
<span class="cm">// matrixChain({10,30,5,60,10}) → 4500</span>`,
    rodCutting: `<span class="ty">int</span> <span class="fn">rodCutting</span>(<span class="ty">vector</span><<span class="ty">int</span>>& prices) {
    <span class="ty">int</span> n = prices.<span class="fn">size</span>();
    <span class="ty">vector</span><<span class="ty">int</span>> dp(n + <span class="nm">1</span>, <span class="nm">0</span>);
    <span class="kw">for</span> (<span class="ty">int</span> len = <span class="nm">1</span>; len <= n; len++)
        <span class="kw">for</span> (<span class="ty">int</span> cut = <span class="nm">1</span>; cut <= len; cut++)
            dp[len] = <span class="fn">max</span>(dp[len], prices[cut-<span class="nm">1</span>] + dp[len-cut]);
    <span class="kw">return</span> dp[n];
}
<span class="cm">// rodCutting({1,5,8,9,10,17,17,20}) → 22</span>`,
    hashChaining: `<span class="kw">class</span> <span class="ty">HashTableChaining</span> {
    <span class="ty">int</span> size;
    <span class="ty">vector</span><<span class="ty">list</span><<span class="ty">int</span>>> table;
    <span class="ty">int</span> <span class="fn">_hash</span>(<span class="ty">int</span> key) <span class="kw">const</span> { <span class="kw">return</span> key % size; }
<span class="kw">public</span>:
    <span class="fn">HashTableChaining</span>(<span class="ty">int</span> sz = <span class="nm">11</span>) : size(sz), table(sz) {}
    <span class="kw">void</span> <span class="fn">insert</span>(<span class="ty">int</span> key) {
        table[<span class="fn">_hash</span>(key)].<span class="fn">push_back</span>(key);
    }
    <span class="ty">bool</span> <span class="fn">search</span>(<span class="ty">int</span> key) <span class="kw">const</span> {
        <span class="kw">auto</span>& chain = table[<span class="fn">_hash</span>(key)];
        <span class="kw">return</span> <span class="fn">find</span>(chain.<span class="fn">begin</span>(), chain.<span class="fn">end</span>(), key) != chain.<span class="fn">end</span>();
    }
};`,
    hashLinear: `<span class="kw">class</span> <span class="ty">HashTableLinear</span> {
    <span class="ty">int</span> size;
    <span class="ty">vector</span><<span class="ty">optional</span><<span class="ty">int</span>>> table;
    <span class="ty">int</span> <span class="fn">_hash</span>(<span class="ty">int</span> key) <span class="kw">const</span> { <span class="kw">return</span> key % size; }
<span class="kw">public</span>:
    <span class="fn">HashTableLinear</span>(<span class="ty">int</span> sz = <span class="nm">11</span>) : size(sz), table(sz) {}
    <span class="kw">void</span> <span class="fn">insert</span>(<span class="ty">int</span> key) {
        <span class="ty">int</span> h = <span class="fn">_hash</span>(key);
        <span class="kw">while</span> (table[h].<span class="fn">has_value</span>()) h = (h + <span class="nm">1</span>) % size;
        table[h] = key;
    }
    <span class="ty">int</span> <span class="fn">search</span>(<span class="ty">int</span> key) <span class="kw">const</span> {
        <span class="ty">int</span> h = <span class="fn">_hash</span>(key);
        <span class="kw">while</span> (table[h].<span class="fn">has_value</span>()) {
            <span class="kw">if</span> (*table[h] == key) <span class="kw">return</span> h;
            h = (h + <span class="nm">1</span>) % size;
        }
        <span class="kw">return</span> -<span class="nm">1</span>;
    }
};`,
  },
  java: {
    bst: `<span class="kw">class</span> <span class="ty">Node</span> {
    <span class="ty">int</span> val; <span class="ty">Node</span> left, right;
    <span class="fn">Node</span>(<span class="ty">int</span> v) { val = v; }
}

<span class="ty">Node</span> <span class="fn">insert</span>(<span class="ty">Node</span> root, <span class="ty">int</span> val) {
    <span class="kw">if</span> (root == <span class="kw">null</span>) <span class="kw">return</span> <span class="kw">new</span> <span class="ty">Node</span>(val);
    <span class="ty">Node</span> cur = root;
    <span class="kw">while</span> (<span class="kw">true</span>) {
        <span class="kw">if</span> (val < cur.val) {
            <span class="kw">if</span> (cur.left == <span class="kw">null</span>) { cur.left = <span class="kw">new</span> <span class="ty">Node</span>(val); <span class="kw">return</span> root; }
            cur = cur.left;
        } <span class="kw">else if</span> (val > cur.val) {
            <span class="kw">if</span> (cur.right == <span class="kw">null</span>) { cur.right = <span class="kw">new</span> <span class="ty">Node</span>(val); <span class="kw">return</span> root; }
            cur = cur.right;
        } <span class="kw">else return</span> root;
    }
}

<span class="ty">Node</span> <span class="fn">search</span>(<span class="ty">Node</span> root, <span class="ty">int</span> val) {
    <span class="kw">while</span> (root != <span class="kw">null</span>) {
        <span class="kw">if</span> (val == root.val) <span class="kw">return</span> root;
        root = val < root.val ? root.left : root.right;
    }
    <span class="kw">return</span> <span class="kw">null</span>;
}`,
    kmp: `<span class="kw">static int</span>[] <span class="fn">buildLPS</span>(<span class="ty">String</span> p) {
    <span class="ty">int</span>[] lps = <span class="kw">new</span> <span class="ty">int</span>[p.<span class="fn">length</span>()];
    <span class="ty">int</span> len = <span class="nm">0</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i < p.<span class="fn">length</span>(); ) {
        <span class="kw">if</span> (p.<span class="fn">charAt</span>(i) == p.<span class="fn">charAt</span>(len)) lps[i++] = ++len;
        <span class="kw">else if</span> (len > <span class="nm">0</span>) len = lps[len - <span class="nm">1</span>];
        <span class="kw">else</span> lps[i++] = <span class="nm">0</span>;
    }
    <span class="kw">return</span> lps;
}

<span class="kw">static int</span> <span class="fn">kmp</span>(<span class="ty">String</span> text, <span class="ty">String</span> pat) {
    <span class="ty">int</span>[] lps = <span class="fn">buildLPS</span>(pat);
    <span class="ty">int</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>;
    <span class="kw">while</span> (i < text.<span class="fn">length</span>()) {
        <span class="kw">if</span> (text.<span class="fn">charAt</span>(i) == pat.<span class="fn">charAt</span>(j)) {
            i++; j++;
            <span class="kw">if</span> (j == pat.<span class="fn">length</span>()) <span class="kw">return</span> i - j;
        } <span class="kw">else if</span> (j > <span class="nm">0</span>) j = lps[j - <span class="nm">1</span>];
        <span class="kw">else</span> i++;
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    rabinkarp: `<span class="kw">static int</span> <span class="fn">rabinKarp</span>(<span class="ty">String</span> text, <span class="ty">String</span> pat) {
    <span class="kw">final int</span> B = <span class="nm">256</span>, M = <span class="nm">101</span>;
    <span class="ty">int</span> m = pat.<span class="fn">length</span>(), n = text.<span class="fn">length</span>();
    <span class="kw">if</span> (m > n) <span class="kw">return</span> -<span class="nm">1</span>;
    <span class="ty">int</span> patH = <span class="nm">0</span>, winH = <span class="nm">0</span>, h = <span class="nm">1</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < m - <span class="nm">1</span>; i++) h = (h * B) % M;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < m; i++) {
        patH = (B * patH + pat.<span class="fn">charAt</span>(i)) % M;
        winH = (B * winH + text.<span class="fn">charAt</span>(i)) % M;
    }
    <span class="kw">for</span> (<span class="ty">int</span> s = <span class="nm">0</span>; s <= n - m; s++) {
        <span class="kw">if</span> (patH == winH && text.<span class="fn">regionMatches</span>(s, pat, <span class="nm">0</span>, m)) <span class="kw">return</span> s;
        <span class="kw">if</span> (s < n - m) {
            winH = (B * (winH - text.<span class="fn">charAt</span>(s) * h) + text.<span class="fn">charAt</span>(s + m)) % M;
            <span class="kw">if</span> (winH < <span class="nm">0</span>) winH += M;
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    nqueens: `<span class="kw">static boolean</span> <span class="fn">isSafe</span>(<span class="ty">int</span>[] board, <span class="ty">int</span> row, <span class="ty">int</span> col) {
    <span class="kw">for</span> (<span class="ty">int</span> c = <span class="nm">0</span>; c < col; c++) {
        <span class="ty">int</span> r = board[c];
        <span class="kw">if</span> (r == row || <span class="ty">Math</span>.<span class="fn">abs</span>(r - row) == col - c) <span class="kw">return</span> <span class="kw">false</span>;
    }
    <span class="kw">return</span> <span class="kw">true</span>;
}

<span class="kw">static boolean</span> <span class="fn">place</span>(<span class="ty">int</span>[] board, <span class="ty">int</span> col, <span class="ty">int</span> n) {
    <span class="kw">if</span> (col == n) <span class="kw">return</span> <span class="kw">true</span>;
    <span class="kw">for</span> (<span class="ty">int</span> row = <span class="nm">0</span>; row < n; row++) {
        <span class="kw">if</span> (<span class="fn">isSafe</span>(board, row, col)) {
            board[col] = row;
            <span class="kw">if</span> (<span class="fn">place</span>(board, col + <span class="nm">1</span>, n)) <span class="kw">return</span> <span class="kw">true</span>;
            board[col] = -<span class="nm">1</span>;  <span class="cm">// откат</span>
        }
    }
    <span class="kw">return</span> <span class="kw">false</span>;
}`,
    ternary: `<span class="kw">static int</span> <span class="fn">ternarySearch</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> target) {
    <span class="ty">int</span> lo = <span class="nm">0</span>, hi = arr.length - <span class="nm">1</span>;
    <span class="kw">while</span> (lo <= hi) {
        <span class="ty">int</span> third = (hi - lo) / <span class="nm">3</span>;
        <span class="ty">int</span> m1 = lo + third, m2 = hi - third;
        <span class="kw">if</span> (arr[m1] == target) <span class="kw">return</span> m1;
        <span class="kw">if</span> (arr[m2] == target) <span class="kw">return</span> m2;
        <span class="kw">if</span> (target < arr[m1]) hi = m1 - <span class="nm">1</span>;
        <span class="kw">else if</span> (target > arr[m2]) lo = m2 + <span class="nm">1</span>;
        <span class="kw">else</span> { lo = m1 + <span class="nm">1</span>; hi = m2 - <span class="nm">1</span>; }
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    bubble: `<span class="kw">public static void</span> <span class="fn">bubbleSort</span>(<span class="ty">int</span>[] arr) {
    <span class="ty">int</span> n = arr.length;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n - <span class="nm">1</span>; i++) {
        <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">0</span>; j < n - i - <span class="nm">1</span>; j++) {
            <span class="kw">if</span> (arr[j] > arr[j + <span class="nm">1</span>]) {
                <span class="ty">int</span> temp = arr[j];
                arr[j] = arr[j + <span class="nm">1</span>];
                arr[j + <span class="nm">1</span>] = temp;
            }
        }
    }
}`,
    selection: `<span class="kw">public static void</span> <span class="fn">selectionSort</span>(<span class="ty">int</span>[] arr) {
    <span class="ty">int</span> n = arr.length;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n - <span class="nm">1</span>; i++) {
        <span class="ty">int</span> minIdx = i;
        <span class="kw">for</span> (<span class="ty">int</span> j = i + <span class="nm">1</span>; j < n; j++) {
            <span class="kw">if</span> (arr[j] < arr[minIdx])
                minIdx = j;
        }
        <span class="kw">if</span> (minIdx != i) {
            <span class="ty">int</span> temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,
    insertion: `<span class="kw">public static void</span> <span class="fn">insertionSort</span>(<span class="ty">int</span>[] arr) {
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i < arr.length; i++) {
        <span class="ty">int</span> key = arr[i];
        <span class="ty">int</span> j = i - <span class="nm">1</span>;
        <span class="kw">while</span> (j >= <span class="nm">0</span> && arr[j] > key) {
            arr[j + <span class="nm">1</span>] = arr[j];
            j--;
        }
        arr[j + <span class="nm">1</span>] = key;
    }
}`,
    shell: `<span class="kw">public static void</span> <span class="fn">shellSort</span>(<span class="ty">int</span>[] arr) {
    <span class="ty">int</span> n = arr.length;
    <span class="kw">for</span> (<span class="ty">int</span> gap = n / <span class="nm">2</span>; gap > <span class="nm">0</span>; gap /= <span class="nm">2</span>) {
        <span class="kw">for</span> (<span class="ty">int</span> i = gap; i < n; i++) {
            <span class="ty">int</span> temp = arr[i];
            <span class="ty">int</span> j = i;
            <span class="kw">while</span> (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`,
    quick: `<span class="kw">public static void</span> <span class="fn">quickSort</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> lo, <span class="ty">int</span> hi) {
    <span class="kw">if</span> (lo >= hi) <span class="kw">return</span>;
    <span class="ty">int</span> pivot = arr[hi];
    <span class="ty">int</span> i = lo - <span class="nm">1</span>;
    <span class="kw">for</span> (<span class="ty">int</span> j = lo; j < hi; j++) {
        <span class="kw">if</span> (arr[j] <= pivot) {
            i++;
            <span class="ty">int</span> temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    <span class="ty">int</span> temp = arr[i + <span class="nm">1</span>];
    arr[i + <span class="nm">1</span>] = arr[hi];
    arr[hi] = temp;
    <span class="ty">int</span> p = i + <span class="nm">1</span>;
    <span class="fn">quickSort</span>(arr, lo, p - <span class="nm">1</span>);
    <span class="fn">quickSort</span>(arr, p + <span class="nm">1</span>, hi);
}
<span class="cm">// вызов: quickSort(arr, 0, arr.length - 1)</span>`,
    merge: `<span class="kw">public static int</span>[] <span class="fn">mergeSort</span>(<span class="ty">int</span>[] arr) {
    <span class="kw">if</span> (arr.length <= <span class="nm">1</span>) <span class="kw">return</span> arr;
    <span class="ty">int</span> mid = arr.length / <span class="nm">2</span>;
    <span class="ty">int</span>[] left = <span class="fn">mergeSort</span>(Arrays.<span class="fn">copyOfRange</span>(arr, <span class="nm">0</span>, mid));
    <span class="ty">int</span>[] right = <span class="fn">mergeSort</span>(Arrays.<span class="fn">copyOfRange</span>(arr, mid, arr.length));
    <span class="kw">return</span> <span class="fn">merge</span>(left, right);
}

<span class="kw">private static int</span>[] <span class="fn">merge</span>(<span class="ty">int</span>[] l, <span class="ty">int</span>[] r) {
    <span class="ty">int</span>[] result = <span class="kw">new int</span>[l.length + r.length];
    <span class="ty">int</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>, k = <span class="nm">0</span>;
    <span class="kw">while</span> (i < l.length && j < r.length)
        result[k++] = (l[i] <= r[j]) ? l[i++] : r[j++];
    <span class="kw">while</span> (i < l.length) result[k++] = l[i++];
    <span class="kw">while</span> (j < r.length) result[k++] = r[j++];
    <span class="kw">return</span> result;
}`,
    heap: `<span class="kw">public static void</span> <span class="fn">heapSort</span>(<span class="ty">int</span>[] arr) {
    <span class="ty">int</span> n = arr.length;
    <span class="kw">for</span> (<span class="ty">int</span> i = n/<span class="nm">2</span> - <span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
        <span class="fn">heapify</span>(arr, n, i);
    <span class="kw">for</span> (<span class="ty">int</span> i = n - <span class="nm">1</span>; i > <span class="nm">0</span>; i--) {
        <span class="ty">int</span> temp = arr[<span class="nm">0</span>];
        arr[<span class="nm">0</span>] = arr[i];
        arr[i] = temp;
        <span class="fn">heapify</span>(arr, i, <span class="nm">0</span>);
    }
}

<span class="kw">private static void</span> <span class="fn">heapify</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> n, <span class="ty">int</span> i) {
    <span class="ty">int</span> largest = i, l = <span class="nm">2</span>*i + <span class="nm">1</span>, r = <span class="nm">2</span>*i + <span class="nm">2</span>;
    <span class="kw">if</span> (l < n && arr[l] > arr[largest]) largest = l;
    <span class="kw">if</span> (r < n && arr[r] > arr[largest]) largest = r;
    <span class="kw">if</span> (largest != i) {
        <span class="ty">int</span> temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        <span class="fn">heapify</span>(arr, n, largest);
    }
}`,
    radix: `<span class="kw">public static void</span> <span class="fn">radixSort</span>(<span class="ty">int</span>[] arr) {
    <span class="ty">int</span> max = Arrays.<span class="fn">stream</span>(arr).<span class="fn">max</span>().<span class="fn">getAsInt</span>();
    <span class="kw">for</span> (<span class="ty">int</span> exp = <span class="nm">1</span>; max/exp > <span class="nm">0</span>; exp *= <span class="nm">10</span>)
        <span class="fn">countingSort</span>(arr, exp);
}

<span class="kw">private static void</span> <span class="fn">countingSort</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> exp) {
    <span class="ty">int</span> n = arr.length;
    <span class="ty">int</span>[] output = <span class="kw">new int</span>[n], count = <span class="kw">new int</span>[<span class="nm">10</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i++) count[(arr[i]/exp) % <span class="nm">10</span>]++;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i < <span class="nm">10</span>; i++) count[i] += count[i-<span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = n-<span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
        output[--count[(arr[i]/exp) % <span class="nm">10</span>]] = arr[i];
    System.<span class="fn">arraycopy</span>(output, <span class="nm">0</span>, arr, <span class="nm">0</span>, n);
}`,
    counting: `<span class="kw">public static int</span>[] <span class="fn">countingSort</span>(<span class="ty">int</span>[] arr) {
    <span class="ty">int</span> max = Arrays.<span class="fn">stream</span>(arr).<span class="fn">max</span>().<span class="fn">getAsInt</span>();
    <span class="ty">int</span>[] count = <span class="kw">new int</span>[max + <span class="nm">1</span>], output = <span class="kw">new int</span>[arr.length];
    <span class="kw">for</span> (<span class="ty">int</span> x : arr) count[x]++;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= max; i++) count[i] += count[i-<span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = arr.length-<span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
        output[--count[arr[i]]] = arr[i];
    <span class="kw">return</span> output;
}`,
    timsort: `<span class="kw">static final int</span> MIN_RUN = <span class="nm">32</span>;

<span class="kw">static void</span> <span class="fn">insertionSortRange</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> lo, <span class="ty">int</span> hi) {
    <span class="kw">for</span> (<span class="ty">int</span> i = lo + <span class="nm">1</span>; i <= hi; i++) {
        <span class="ty">int</span> key = arr[i], j = i - <span class="nm">1</span>;
        <span class="kw">while</span> (j >= lo && arr[j] > key) arr[j+<span class="nm">1</span>] = arr[j--];
        arr[j + <span class="nm">1</span>] = key;
    }
}

<span class="kw">static void</span> <span class="fn">merge</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> lo, <span class="ty">int</span> mid, <span class="ty">int</span> hi) {
    <span class="ty">int</span>[] left = Arrays.<span class="fn">copyOfRange</span>(arr, lo, mid + <span class="nm">1</span>);
    <span class="ty">int</span>[] right = Arrays.<span class="fn">copyOfRange</span>(arr, mid + <span class="nm">1</span>, hi + <span class="nm">1</span>);
    <span class="ty">int</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>, k = lo;
    <span class="kw">while</span> (i < left.length && j < right.length)
        arr[k++] = left[i]<=right[j] ? left[i++] : right[j++];
    <span class="kw">while</span> (i < left.length)
        arr[k++] = left[i++];
    <span class="kw">while</span> (j < right.length)
        arr[k++] = right[j++];
}

<span class="kw">static void</span> <span class="fn">timSort</span>(<span class="ty">int</span>[] arr) {
    <span class="ty">int</span> n = arr.length;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i += MIN_RUN)
        <span class="fn">insertionSortRange</span>(arr, i, Math.<span class="fn">min</span>(i + MIN_RUN - <span class="nm">1</span>, n - <span class="nm">1</span>));
    <span class="kw">for</span> (<span class="ty">int</span> size = MIN_RUN; size < n; size *= <span class="nm">2</span>) {
        <span class="kw">for</span> (<span class="ty">int</span> lo = <span class="nm">0</span>; lo < n; lo += <span class="nm">2</span> * size) {
            <span class="ty">int</span> mid = Math.<span class="fn">min</span>(lo + size - <span class="nm">1</span>, n - <span class="nm">1</span>);
            <span class="ty">int</span> hi = Math.<span class="fn">min</span>(lo + <span class="nm">2</span> * size - <span class="nm">1</span>, n - <span class="nm">1</span>);
            <span class="kw">if</span> (mid < hi)
                <span class="fn">merge</span>(arr, lo, mid, hi);
        }
    }
}`,
    linear: `<span class="kw">public static int</span> <span class="fn">linearSearch</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> target) {
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < arr.length; i++) {
        <span class="kw">if</span> (arr[i] == target) <span class="kw">return</span> i;
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    binary: `<span class="kw">public static int</span> <span class="fn">binarySearch</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> target) {
    <span class="ty">int</span> lo = <span class="nm">0</span>, hi = arr.length - <span class="nm">1</span>;
    <span class="kw">while</span> (lo <= hi) {
        <span class="ty">int</span> mid = lo + (hi - lo) / <span class="nm">2</span>;
        <span class="kw">if</span> (arr[mid] == target) <span class="kw">return</span> mid;
        <span class="kw">if</span> (arr[mid] < target) lo = mid + <span class="nm">1</span>;
        <span class="kw">else</span> hi = mid - <span class="nm">1</span>;
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    jump: `<span class="kw">public static int</span> <span class="fn">jumpSearch</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> target) {
    <span class="ty">int</span> n = arr.length;
    <span class="ty">int</span> step = (<span class="ty">int</span>)Math.<span class="fn">sqrt</span>(n);
    <span class="ty">int</span> prev = <span class="nm">0</span>;
    <span class="kw">while</span> (arr[Math.<span class="fn">min</span>(step, n)-<span class="nm">1</span>] < target) {
        prev = step;
        step += (<span class="ty">int</span>)Math.<span class="fn">sqrt</span>(n);
        <span class="kw">if</span> (prev >= n) <span class="kw">return</span> -<span class="nm">1</span>;
    }
    <span class="kw">while</span> (arr[prev] < target) {
        prev++;
        <span class="kw">if</span> (prev == Math.<span class="fn">min</span>(step, n)) <span class="kw">return</span> -<span class="nm">1</span>;
    }
    <span class="kw">return</span> (arr[prev] == target) ? prev : -<span class="nm">1</span>;
}`,
    interpolation: `<span class="kw">public static int</span> <span class="fn">interpolationSearch</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> target) {
    <span class="ty">int</span> lo = <span class="nm">0</span>, hi = arr.length - <span class="nm">1</span>;
    <span class="kw">while</span> (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        <span class="kw">if</span> (lo == hi) <span class="kw">return</span> (arr[lo] == target) ? lo : -<span class="nm">1</span>;
        <span class="ty">int</span> pos = lo + ((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]);
        <span class="kw">if</span> (arr[pos] == target) <span class="kw">return</span> pos;
        <span class="kw">if</span> (arr[pos] < target) lo = pos + <span class="nm">1</span>;
        <span class="kw">else</span> hi = pos - <span class="nm">1</span>;
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    exponential: `<span class="kw">public static int</span> <span class="fn">exponentialSearch</span>(<span class="ty">int</span>[] arr, <span class="ty">int</span> target) {
    <span class="kw">if</span> (arr[<span class="nm">0</span>] == target) <span class="kw">return</span> <span class="nm">0</span>;
    <span class="ty">int</span> i = <span class="nm">1</span>;
    <span class="kw">while</span> (i < arr.length && arr[i] <= target) i *= <span class="nm">2</span>;
    <span class="kw">return</span> <span class="fn">binarySearch</span>(arr, target, i/<span class="nm">2</span>, Math.<span class="fn">min</span>(i, arr.length-<span class="nm">1</span>));
}`,
    bfs: `<span class="kw">public static void</span> <span class="fn">bfs</span>(<span class="ty">List</span><<span class="ty">List</span><<span class="ty">Integer</span>>> graph, <span class="ty">int</span> start) {
    <span class="ty">boolean</span>[] visited = <span class="kw">new boolean</span>[graph.<span class="fn">size</span>()];
    <span class="ty">Queue</span><<span class="ty">Integer</span>> queue = <span class="kw">new</span> <span class="ty">LinkedList</span>();
    queue.<span class="fn">add</span>(start);
    visited[start] = <span class="kw">true</span>;
    <span class="kw">while</span> (!queue.<span class="fn">isEmpty</span>()) {
        <span class="ty">int</span> node = queue.<span class="fn">poll</span>();
        <span class="kw">for</span> (<span class="ty">int</span> neighbor : graph.<span class="fn">get</span>(node)) {
            <span class="kw">if</span> (!visited[neighbor]) {
                visited[neighbor] = <span class="kw">true</span>;
                queue.<span class="fn">add</span>(neighbor);
            }
        }
    }
}`,
    dfs: `<span class="kw">public static void</span> <span class="fn">dfs</span>(<span class="ty">List</span><<span class="ty">List</span><<span class="ty">Integer</span>>> graph, <span class="ty">int</span> start, <span class="ty">boolean</span>[] visited) {
    visited[start] = <span class="kw">true</span>;
    <span class="kw">for</span> (<span class="ty">int</span> neighbor : graph.<span class="fn">get</span>(start)) {
        <span class="kw">if</span> (!visited[neighbor])
            <span class="fn">dfs</span>(graph, neighbor, visited);
    }
}`,
    dijkstra: `<span class="kw">public static int</span>[] <span class="fn">dijkstra</span>(<span class="ty">List</span><<span class="ty">List</span><<span class="ty">int</span>[]>> g, <span class="ty">int</span> src) {
    <span class="ty">int</span> n = g.<span class="fn">size</span>();
    <span class="ty">int</span>[] dist = <span class="kw">new int</span>[n];
    Arrays.<span class="fn">fill</span>(dist, <span class="ty">Integer</span>.MAX_VALUE);
    dist[src] = <span class="nm">0</span>;
    <span class="ty">PriorityQueue</span><<span class="ty">int</span>[]> pq = <span class="kw">new</span> <span class="ty">PriorityQueue</span>(<span class="ty">Comparator</span>.<span class="fn">comparingInt</span>(x -> x[<span class="nm">0</span>]));
    pq.<span class="fn">offer</span>(<span class="kw">new int</span>[]{<span class="nm">0</span>, src});
    <span class="kw">while</span> (!pq.<span class="fn">isEmpty</span>()) {
        <span class="ty">int</span>[] cur = pq.<span class="fn">poll</span>();
        <span class="ty">int</span> d = cur[<span class="nm">0</span>], u = cur[<span class="nm">1</span>];
        <span class="kw">if</span> (d > dist[u]) <span class="kw">continue</span>;
        <span class="kw">for</span> (<span class="ty">int</span>[] e : g.<span class="fn">get</span>(u))
            <span class="kw">if</span> (dist[u] + e[<span class="nm">1</span>] < dist[e[<span class="nm">0</span>]]) {
                dist[e[<span class="nm">0</span>]] = dist[u] + e[<span class="nm">1</span>];
                pq.<span class="fn">offer</span>(<span class="kw">new int</span>[]{dist[e[<span class="nm">0</span>]], e[<span class="nm">0</span>]});
            }
    }
    <span class="kw">return</span> dist;
}`,
    fib: `<span class="kw">public static int</span> <span class="fn">fibonacci</span>(<span class="ty">int</span> n) {
    <span class="ty">int</span>[] dp = <span class="kw">new int</span>[n + <span class="nm">1</span>];
    dp[<span class="nm">1</span>] = <span class="nm">1</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">2</span>; i <= n; i++)
        dp[i] = dp[i-<span class="nm">1</span>] + dp[i-<span class="nm">2</span>];
    <span class="kw">return</span> dp[n];
}`,
    knapsack: `<span class="kw">public static int</span> <span class="fn">knapsack</span>(<span class="ty">int</span>[] wt, <span class="ty">int</span>[] val, <span class="ty">int</span> W) {
    <span class="ty">int</span> n = wt.length;
    <span class="ty">int</span>[][] dp = <span class="kw">new int</span>[n+<span class="nm">1</span>][W+<span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= n; i++) {
        <span class="kw">for</span> (<span class="ty">int</span> w = <span class="nm">0</span>; w <= W; w++) {
            <span class="kw">if</span> (wt[i-<span class="nm">1</span>] <= w)
                dp[i][w] = Math.<span class="fn">max</span>(val[i-<span class="nm">1</span>] + dp[i-<span class="nm">1</span>][w-wt[i-<span class="nm">1</span>]], dp[i-<span class="nm">1</span>][w]);
            <span class="kw">else</span>
                dp[i][w] = dp[i-<span class="nm">1</span>][w];
        }
    }
    <span class="kw">return</span> dp[n][W];
}`,
    lcs: `<span class="kw">public static int</span> <span class="fn">lcs</span>(<span class="ty">int</span>[] a, <span class="ty">int</span>[] b) {
    <span class="ty">int</span> m = a.length, n = b.length;
    <span class="ty">int</span>[][] dp = <span class="kw">new int</span>[m+<span class="nm">1</span>][n+<span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= m; i++)
        <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">1</span>; j <= n; j++)
            dp[i][j] = (a[i-<span class="nm">1</span>]==b[j-<span class="nm">1</span>])
                ? dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>] + <span class="nm">1</span>
                : Math.<span class="fn">max</span>(dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>]);
    <span class="kw">return</span> dp[m][n];
}`,
    lis: `<span class="kw">public static int</span> <span class="fn">lis</span>(<span class="ty">int</span>[] arr) {
    <span class="ty">int</span> n = arr.length;
    <span class="ty">int</span>[] dp = <span class="kw">new int</span>[n];
    Arrays.<span class="fn">fill</span>(dp, <span class="nm">1</span>);
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i < n; i++)
        <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">0</span>; j < i; j++)
            <span class="kw">if</span> (arr[j] < arr[i])
                dp[i] = Math.<span class="fn">max</span>(dp[i], dp[j] + <span class="nm">1</span>);
    <span class="kw">return</span> Arrays.<span class="fn">stream</span>(dp).<span class="fn">max</span>().<span class="fn">getAsInt</span>();
}`,
    bellmanFord: `<span class="kw">int</span>[] <span class="fn">bellmanFord</span>(<span class="ty">int</span>[][] edges, <span class="ty">int</span> n, <span class="ty">int</span> src) {
    <span class="ty">int</span>[] dist = <span class="kw">new</span> <span class="ty">int</span>[n];
    <span class="ty">Arrays</span>.<span class="fn">fill</span>(dist, <span class="ty">Integer</span>.MAX_VALUE);
    dist[src] = <span class="nm">0</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n - <span class="nm">1</span>; i++) {
        <span class="ty">boolean</span> updated = <span class="kw">false</span>;
        <span class="kw">for</span> (<span class="ty">int</span>[] e : edges) {
            <span class="ty">int</span> u = e[<span class="nm">0</span>], v = e[<span class="nm">1</span>], w = e[<span class="nm">2</span>];
            <span class="kw">if</span> (dist[u] != <span class="ty">Integer</span>.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = <span class="kw">true</span>;
            }
        }
        <span class="kw">if</span> (!updated) <span class="kw">break</span>;
    }
    <span class="kw">return</span> dist;
}`,
    astar: `<span class="ty">int</span> <span class="fn">aStar</span>(<span class="ty">List</span><<span class="ty">List</span><<span class="ty">int</span>[]>> graph, <span class="ty">int</span> src, <span class="ty">int</span> goal,
           <span class="ty">IntUnaryOperator</span> h) {
    <span class="ty">int</span> n = graph.<span class="fn">size</span>();
    <span class="ty">int</span>[] g = <span class="kw">new</span> <span class="ty">int</span>[n];
    <span class="ty">Arrays</span>.<span class="fn">fill</span>(g, <span class="ty">Integer</span>.MAX_VALUE);
    g[src] = <span class="nm">0</span>;
    <span class="ty">boolean</span>[] visited = <span class="kw">new</span> <span class="ty">boolean</span>[n];
    <span class="ty">PriorityQueue</span><<span class="ty">int</span>[]> pq = <span class="kw">new</span> <span class="ty">PriorityQueue</span>(<span class="ty">Comparator</span>.<span class="fn">comparingInt</span>(a -> a[<span class="nm">0</span>]));
    pq.<span class="fn">offer</span>(<span class="kw">new</span> <span class="ty">int</span>[]{h.<span class="fn">applyAsInt</span>(src), src});
    <span class="kw">while</span> (!pq.<span class="fn">isEmpty</span>()) {
        <span class="ty">int</span>[] cur = pq.<span class="fn">poll</span>();
        <span class="ty">int</span> u = cur[<span class="nm">1</span>];
        <span class="kw">if</span> (visited[u]) <span class="kw">continue</span>;
        visited[u] = <span class="kw">true</span>;
        <span class="kw">if</span> (u == goal) <span class="kw">return</span> g[goal];
        <span class="kw">for</span> (<span class="ty">int</span>[] edge : graph.<span class="fn">get</span>(u)) {
            <span class="ty">int</span> v = edge[<span class="nm">0</span>], w = edge[<span class="nm">1</span>];
            <span class="ty">int</span> tg = g[u] + w;
            <span class="kw">if</span> (tg < g[v]) {
                g[v] = tg;
                pq.<span class="fn">offer</span>(<span class="kw">new</span> <span class="ty">int</span>[]{tg + h.<span class="fn">applyAsInt</span>(v), v});
            }
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    toposort: `<span class="kw">void</span> <span class="fn">dfsTopoSort</span>(<span class="ty">List</span><<span class="ty">List</span><<span class="ty">Integer</span>>> graph, <span class="ty">int</span> u,
                   <span class="ty">boolean</span>[] visited, <span class="ty">Deque</span><<span class="ty">Integer</span>> order) {
    visited[u] = <span class="kw">true</span>;
    <span class="kw">for</span> (<span class="ty">int</span> v : graph.<span class="fn">get</span>(u))
        <span class="kw">if</span> (!visited[v]) <span class="fn">dfsTopoSort</span>(graph, v, visited, order);
    order.<span class="fn">push</span>(u);
}

<span class="ty">List</span><<span class="ty">Integer</span>> <span class="fn">topoSort</span>(<span class="ty">List</span><<span class="ty">List</span><<span class="ty">Integer</span>>> graph, <span class="ty">int</span> n) {
    <span class="ty">boolean</span>[] visited = <span class="kw">new</span> <span class="ty">boolean</span>[n];
    <span class="ty">Deque</span><<span class="ty">Integer</span>> order = <span class="kw">new</span> <span class="ty">ArrayDeque</span><>();
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i++)
        <span class="kw">if</span> (!visited[i]) <span class="fn">dfsTopoSort</span>(graph, i, visited, order);
    <span class="kw">return</span> <span class="kw">new</span> <span class="ty">ArrayList</span>(<span class="ty">Arrays</span>.<span class="fn">asList</span>(order.<span class="fn">toArray</span>()));
}`,
    floydWarshall: `<span class="kw">void</span> <span class="fn">floydWarshall</span>(<span class="ty">int</span>[][] dp) {
    <span class="ty">int</span> n = dp.length;
    <span class="kw">for</span> (<span class="ty">int</span> k = <span class="nm">0</span>; k < n; k++)
        <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i++)
            <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">0</span>; j < n; j++)
                <span class="kw">if</span> (dp[i][k] != <span class="ty">Integer</span>.MAX_VALUE &&
                    dp[k][j] != <span class="ty">Integer</span>.MAX_VALUE)
                    dp[i][j] = <span class="ty">Math</span>.<span class="fn">min</span>(dp[i][j], dp[i][k] + dp[k][j]);
}`,
    prim: `<span class="ty">int</span> <span class="fn">prim</span>(<span class="ty">List</span><<span class="ty">List</span><<span class="ty">int</span>[]>> graph, <span class="ty">int</span> n) {
    <span class="ty">boolean</span>[] inMST = <span class="kw">new</span> <span class="ty">boolean</span>[n];
    <span class="ty">int</span>[] key = <span class="kw">new</span> <span class="ty">int</span>[n];
    <span class="ty">Arrays</span>.<span class="fn">fill</span>(key, <span class="ty">Integer</span>.MAX_VALUE);
    key[<span class="nm">0</span>] = <span class="nm">0</span>;
    <span class="ty">PriorityQueue</span><<span class="ty">int</span>[]> pq = <span class="kw">new</span> <span class="ty">PriorityQueue</span>(<span class="ty">Comparator</span>.<span class="fn">comparingInt</span>(a -> a[<span class="nm">0</span>]));
    pq.<span class="fn">offer</span>(<span class="kw">new</span> <span class="ty">int</span>[]{<span class="nm">0</span>, <span class="nm">0</span>});
    <span class="ty">int</span> cost = <span class="nm">0</span>;
    <span class="kw">while</span> (!pq.<span class="fn">isEmpty</span>()) {
        <span class="ty">int</span>[] cur = pq.<span class="fn">poll</span>();
        <span class="ty">int</span> w = cur[<span class="nm">0</span>], u = cur[<span class="nm">1</span>];
        <span class="kw">if</span> (inMST[u]) <span class="kw">continue</span>;
        inMST[u] = <span class="kw">true</span>; cost += w;
        <span class="kw">for</span> (<span class="ty">int</span>[] edge : graph.<span class="fn">get</span>(u)) {
            <span class="ty">int</span> v = edge[<span class="nm">0</span>], wt = edge[<span class="nm">1</span>];
            <span class="kw">if</span> (!inMST[v] && wt < key[v]) {
                key[v] = wt;
                pq.<span class="fn">offer</span>(<span class="kw">new</span> <span class="ty">int</span>[]{wt, v});
            }
        }
    }
    <span class="kw">return</span> cost;
}`,
    kruskal: `<span class="ty">int</span>[] parent;

<span class="ty">int</span> <span class="fn">find</span>(<span class="ty">int</span> x) {
    <span class="kw">if</span> (parent[x] != x) parent[x] = <span class="fn">find</span>(parent[x]);
    <span class="kw">return</span> parent[x];
}

<span class="ty">int</span> <span class="fn">kruskal</span>(<span class="ty">int</span>[][] edges, <span class="ty">int</span> n) {
    parent = <span class="kw">new</span> <span class="ty">int</span>[n];
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < n; i++) parent[i] = i;
    <span class="ty">Arrays</span>.<span class="fn">sort</span>(edges, <span class="ty">Comparator</span>.<span class="fn">comparingInt</span>(e -> e[<span class="nm">0</span>]));
    <span class="ty">int</span> cost = <span class="nm">0</span>;
    <span class="kw">for</span> (<span class="ty">int</span>[] e : edges) {
        <span class="ty">int</span> pu = <span class="fn">find</span>(e[<span class="nm">1</span>]), pv = <span class="fn">find</span>(e[<span class="nm">2</span>]);
        <span class="kw">if</span> (pu != pv) { parent[pu] = pv; cost += e[<span class="nm">0</span>]; }
    }
    <span class="kw">return</span> cost;
}`,
    coinChange: `<span class="ty">int</span> <span class="fn">coinChange</span>(<span class="ty">int</span>[] coins, <span class="ty">int</span> amount) {
    <span class="ty">int</span>[] dp = <span class="kw">new</span> <span class="ty">int</span>[amount + <span class="nm">1</span>];
    <span class="ty">Arrays</span>.<span class="fn">fill</span>(dp, <span class="ty">Integer</span>.MAX_VALUE);
    dp[<span class="nm">0</span>] = <span class="nm">0</span>;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= amount; i++)
        <span class="kw">for</span> (<span class="ty">int</span> c : coins)
            <span class="kw">if</span> (c <= i && dp[i - c] != <span class="ty">Integer</span>.MAX_VALUE)
                dp[i] = <span class="ty">Math</span>.<span class="fn">min</span>(dp[i], dp[i - c] + <span class="nm">1</span>);
    <span class="kw">return</span> dp[amount] == <span class="ty">Integer</span>.MAX_VALUE ? -<span class="nm">1</span> : dp[amount];
}
<span class="cm">// coinChange(new int[]{1,3,4,5}, 7) → 2</span>`,
    editDistance: `<span class="ty">int</span> <span class="fn">editDistance</span>(<span class="ty">String</span> a, <span class="ty">String</span> b) {
    <span class="ty">int</span> m = a.<span class="fn">length</span>(), n = b.<span class="fn">length</span>();
    <span class="ty">int</span>[][] dp = <span class="kw">new</span> <span class="ty">int</span>[m + <span class="nm">1</span>][n + <span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i <= m; i++) dp[i][<span class="nm">0</span>] = i;
    <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">0</span>; j <= n; j++) dp[<span class="nm">0</span>][j] = j;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= m; i++)
        <span class="kw">for</span> (<span class="ty">int</span> j = <span class="nm">1</span>; j <= n; j++) {
            <span class="kw">if</span> (a.<span class="fn">charAt</span>(i-<span class="nm">1</span>) == b.<span class="fn">charAt</span>(j-<span class="nm">1</span>))
                dp[i][j] = dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>];
            <span class="kw">else</span>
                dp[i][j] = <span class="nm">1</span> + <span class="ty">Math</span>.<span class="fn">min</span>(dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>],
                               <span class="ty">Math</span>.<span class="fn">min</span>(dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>]));
        }
    <span class="kw">return</span> dp[m][n];
}
<span class="cm">// editDistance("ALGO", "LOG") → 2</span>`,
    matrixChain: `<span class="ty">int</span> <span class="fn">matrixChain</span>(<span class="ty">int</span>[] dims) {
    <span class="ty">int</span> n = dims.length - <span class="nm">1</span>;
    <span class="ty">int</span>[][] dp = <span class="kw">new</span> <span class="ty">int</span>[n][n];
    <span class="kw">for</span> (<span class="ty">int</span> len = <span class="nm">2</span>; len <= n; len++) {
        <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i <= n - len; i++) {
            <span class="ty">int</span> j = i + len - <span class="nm">1</span>;
            dp[i][j] = <span class="ty">Integer</span>.MAX_VALUE;
            <span class="kw">for</span> (<span class="ty">int</span> k = i; k < j; k++) {
                <span class="ty">int</span> cost = dp[i][k] + dp[k+<span class="nm">1</span>][j]
                          + dims[i] * dims[k+<span class="nm">1</span>] * dims[j+<span class="nm">1</span>];
                dp[i][j] = <span class="ty">Math</span>.<span class="fn">min</span>(dp[i][j], cost);
            }
        }
    }
    <span class="kw">return</span> dp[<span class="nm">0</span>][n-<span class="nm">1</span>];
}
<span class="cm">// matrixChain(new int[]{10,30,5,60,10}) → 4500</span>`,
    rodCutting: `<span class="ty">int</span> <span class="fn">rodCutting</span>(<span class="ty">int</span>[] prices) {
    <span class="ty">int</span> n = prices.length;
    <span class="ty">int</span>[] dp = <span class="kw">new</span> <span class="ty">int</span>[n + <span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> len = <span class="nm">1</span>; len <= n; len++)
        <span class="kw">for</span> (<span class="ty">int</span> cut = <span class="nm">1</span>; cut <= len; cut++)
            dp[len] = <span class="ty">Math</span>.<span class="fn">max</span>(dp[len], prices[cut-<span class="nm">1</span>] + dp[len-cut]);
    <span class="kw">return</span> dp[n];
}
<span class="cm">// rodCutting(new int[]{1,5,8,9,10,17,17,20}) → 22</span>`,
    hashChaining: `<span class="kw">class</span> <span class="ty">HashTableChaining</span> {
    <span class="kw">private final int</span> size;
    <span class="kw">private final</span> <span class="ty">List</span><<span class="ty">List</span><<span class="ty">Integer</span>>> table;

    <span class="fn">HashTableChaining</span>(<span class="ty">int</span> size) {
        <span class="kw">this</span>.size = size;
        table = <span class="kw">new</span> <span class="ty">ArrayList</span><>();
        <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">0</span>; i < size; i++) table.<span class="fn">add</span>(<span class="kw">new</span> <span class="ty">ArrayList</span>());
    }

    <span class="kw">private int</span> <span class="fn">hash</span>(<span class="ty">int</span> key) { <span class="kw">return</span> key % size; }

    <span class="kw">void</span> <span class="fn">insert</span>(<span class="ty">int</span> key) { table.<span class="fn">get</span>(<span class="fn">hash</span>(key)).<span class="fn">add</span>(key); }

    <span class="ty">boolean</span> <span class="fn">search</span>(<span class="ty">int</span> key) { <span class="kw">return</span> table.<span class="fn">get</span>(<span class="fn">hash</span>(key)).<span class="fn">contains</span>(key); }
}`,
    hashLinear: `<span class="kw">class</span> <span class="ty">HashTableLinear</span> {
    <span class="kw">private final int</span> size;
    <span class="kw">private final</span> <span class="ty">Integer</span>[] table;

    <span class="fn">HashTableLinear</span>(<span class="ty">int</span> size) {
        <span class="kw">this</span>.size = size;
        table = <span class="kw">new</span> <span class="ty">Integer</span>[size];
    }

    <span class="kw">private int</span> <span class="fn">hash</span>(<span class="ty">int</span> key) { <span class="kw">return</span> key % size; }

    <span class="kw">void</span> <span class="fn">insert</span>(<span class="ty">int</span> key) {
        <span class="ty">int</span> h = <span class="fn">hash</span>(key);
        <span class="kw">while</span> (table[h] != <span class="kw">null</span>) h = (h + <span class="nm">1</span>) % size;
        table[h] = key;
    }

    <span class="ty">int</span> <span class="fn">search</span>(<span class="ty">int</span> key) {
        <span class="ty">int</span> h = <span class="fn">hash</span>(key);
        <span class="kw">while</span> (table[h] != <span class="kw">null</span>) {
            <span class="kw">if</span> (table[h] == key) <span class="kw">return</span> h;
            h = (h + <span class="nm">1</span>) % size;
        }
        <span class="kw">return</span> -<span class="nm">1</span>;
    }
    }`,
  },
  go: {
    bst: `<span class="kw">type</span> <span class="ty">Node</span> <span class="kw">struct</span> {
    val         <span class="ty">int</span>
    left, right *<span class="ty">Node</span>
}

<span class="kw">func</span> <span class="fn">insert</span>(root *<span class="ty">Node</span>, val <span class="ty">int</span>) *<span class="ty">Node</span> {
    <span class="kw">if</span> root == <span class="kw">nil</span> {
        <span class="kw">return</span> &<span class="ty">Node</span>{val: val}
    }
    cur := root
    <span class="kw">for</span> {
        <span class="kw">if</span> val < cur.val {
            <span class="kw">if</span> cur.left == <span class="kw">nil</span> {
                cur.left = &<span class="ty">Node</span>{val: val}; <span class="kw">return</span> root
            }
            cur = cur.left
        } <span class="kw">else if</span> val > cur.val {
            <span class="kw">if</span> cur.right == <span class="kw">nil</span> {
                cur.right = &<span class="ty">Node</span>{val: val}; <span class="kw">return</span> root
            }
            cur = cur.right
        } <span class="kw">else</span> {
            <span class="kw">return</span> root
        }
    }
}

<span class="kw">func</span> <span class="fn">search</span>(root *<span class="ty">Node</span>, val <span class="ty">int</span>) *<span class="ty">Node</span> {
    <span class="kw">for</span> root != <span class="kw">nil</span> {
        <span class="kw">if</span> val == root.val {
            <span class="kw">return</span> root
        }
        <span class="kw">if</span> val < root.val {
            root = root.left
        } <span class="kw">else</span> {
            root = root.right
        }
    }
    <span class="kw">return</span> <span class="kw">nil</span>
}`,
    kmp: `<span class="kw">func</span> <span class="fn">buildLPS</span>(p <span class="ty">string</span>) []<span class="ty">int</span> {
    lps := <span class="fn">make</span>([]<span class="ty">int</span>, <span class="fn">len</span>(p))
    length := <span class="nm">0</span>
    <span class="kw">for</span> i := <span class="nm">1</span>; i < <span class="fn">len</span>(p); {
        <span class="kw">if</span> p[i] == p[length] {
            length++; lps[i] = length; i++
        } <span class="kw">else if</span> length > <span class="nm">0</span> {
            length = lps[length-<span class="nm">1</span>]
        } <span class="kw">else</span> {
            lps[i] = <span class="nm">0</span>; i++
        }
    }
    <span class="kw">return</span> lps
}

<span class="kw">func</span> <span class="fn">kmp</span>(text, pat <span class="ty">string</span>) <span class="ty">int</span> {
    lps := <span class="fn">buildLPS</span>(pat)
    i, j := <span class="nm">0</span>, <span class="nm">0</span>
    <span class="kw">for</span> i < <span class="fn">len</span>(text) {
        <span class="kw">if</span> text[i] == pat[j] {
            i++; j++
            <span class="kw">if</span> j == <span class="fn">len</span>(pat) {
                <span class="kw">return</span> i - j
            }
        } <span class="kw">else if</span> j > <span class="nm">0</span> {
            j = lps[j-<span class="nm">1</span>]
        } <span class="kw">else</span> {
            i++
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    rabinkarp: `<span class="kw">func</span> <span class="fn">rabinKarp</span>(text, pat <span class="ty">string</span>) <span class="ty">int</span> {
    <span class="kw">const</span> B, M = <span class="nm">256</span>, <span class="nm">101</span>
    m, n := <span class="fn">len</span>(pat), <span class="fn">len</span>(text)
    <span class="kw">if</span> m > n {
        <span class="kw">return</span> -<span class="nm">1</span>
    }
    patH, winH, h := <span class="nm">0</span>, <span class="nm">0</span>, <span class="nm">1</span>
    <span class="kw">for</span> i := <span class="nm">0</span>; i < m-<span class="nm">1</span>; i++ {
        h = (h * B) % M
    }
    <span class="kw">for</span> i := <span class="nm">0</span>; i < m; i++ {
        patH = (B*patH + <span class="ty">int</span>(pat[i])) % M
        winH = (B*winH + <span class="ty">int</span>(text[i])) % M
    }
    <span class="kw">for</span> s := <span class="nm">0</span>; s <= n-m; s++ {
        <span class="kw">if</span> patH == winH && text[s:s+m] == pat {
            <span class="kw">return</span> s
        }
        <span class="kw">if</span> s < n-m {
            winH = (B*(winH-<span class="ty">int</span>(text[s])*h) + <span class="ty">int</span>(text[s+m])) % M
            <span class="kw">if</span> winH < <span class="nm">0</span> {
                winH += M
            }
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    nqueens: `<span class="kw">func</span> <span class="fn">solveNQueens</span>(n <span class="ty">int</span>) []<span class="ty">int</span> {
    board := <span class="fn">make</span>([]<span class="ty">int</span>, n)
    <span class="kw">for</span> i := <span class="kw">range</span> board {
        board[i] = -<span class="nm">1</span>
    }
    <span class="kw">var</span> isSafe <span class="kw">func</span>(row, col <span class="ty">int</span>) <span class="ty">bool</span>
    isSafe = <span class="kw">func</span>(row, col <span class="ty">int</span>) <span class="ty">bool</span> {
        <span class="kw">for</span> c := <span class="nm">0</span>; c < col; c++ {
            r := board[c]
            <span class="kw">if</span> r == row || <span class="fn">abs</span>(r-row) == col-c {
                <span class="kw">return</span> <span class="kw">false</span>
            }
        }
        <span class="kw">return</span> <span class="kw">true</span>
    }
    <span class="kw">var</span> place <span class="kw">func</span>(col <span class="ty">int</span>) <span class="ty">bool</span>
    place = <span class="kw">func</span>(col <span class="ty">int</span>) <span class="ty">bool</span> {
        <span class="kw">if</span> col == n {
            <span class="kw">return</span> <span class="kw">true</span>
        }
        <span class="kw">for</span> row := <span class="nm">0</span>; row < n; row++ {
            <span class="kw">if</span> isSafe(row, col) {
                board[col] = row
                <span class="kw">if</span> place(col + <span class="nm">1</span>) {
                    <span class="kw">return</span> <span class="kw">true</span>
                }
                board[col] = -<span class="nm">1</span>
            }
        }
        <span class="kw">return</span> <span class="kw">false</span>
    }
    <span class="kw">if</span> place(<span class="nm">0</span>) {
        <span class="kw">return</span> board
    }
    <span class="kw">return</span> <span class="kw">nil</span>
}`,
    ternary: `<span class="kw">func</span> <span class="fn">ternarySearch</span>(arr []<span class="ty">int</span>, target <span class="ty">int</span>) <span class="ty">int</span> {
    lo, hi := <span class="nm">0</span>, <span class="fn">len</span>(arr)-<span class="nm">1</span>
    <span class="kw">for</span> lo <= hi {
        third := (hi - lo) / <span class="nm">3</span>
        m1, m2 := lo+third, hi-third
        <span class="kw">if</span> arr[m1] == target {
            <span class="kw">return</span> m1
        }
        <span class="kw">if</span> arr[m2] == target {
            <span class="kw">return</span> m2
        }
        <span class="kw">if</span> target < arr[m1] {
            hi = m1 - <span class="nm">1</span>
        } <span class="kw">else if</span> target > arr[m2] {
            lo = m2 + <span class="nm">1</span>
        } <span class="kw">else</span> {
            lo, hi = m1+<span class="nm">1</span>, m2-<span class="nm">1</span>
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    bubble: `<span class="kw">func</span> <span class="fn">bubbleSort</span>(arr []<span class="ty">int</span>) []<span class="ty">int</span> {
    n := <span class="fn">len</span>(arr)
    <span class="kw">for</span> i := <span class="nm">0</span>; i < n-<span class="nm">1</span>; i++ {
        <span class="kw">for</span> j := <span class="nm">0</span>; j < n-i-<span class="nm">1</span>; j++ {
            <span class="kw">if</span> arr[j] > arr[j+<span class="nm">1</span>] {
                arr[j], arr[j+<span class="nm">1</span>] = arr[j+<span class="nm">1</span>], arr[j]
            }
        }
    }
    <span class="kw">return</span> arr
}`,
    selection: `<span class="kw">func</span> <span class="fn">selectionSort</span>(arr []<span class="ty">int</span>) []<span class="ty">int</span> {
    n := <span class="fn">len</span>(arr)
    <span class="kw">for</span> i := <span class="nm">0</span>; i < n-<span class="nm">1</span>; i++ {
        minIdx := i
        <span class="kw">for</span> j := i + <span class="nm">1</span>; j < n; j++ {
            <span class="kw">if</span> arr[j] < arr[minIdx] {
                minIdx = j
            }
        }
        <span class="kw">if</span> minIdx != i {
            arr[i], arr[minIdx] = arr[minIdx], arr[i]
        }
    }
    <span class="kw">return</span> arr
}`,
    insertion: `<span class="kw">func</span> <span class="fn">insertionSort</span>(arr []<span class="ty">int</span>) []<span class="ty">int</span> {
    <span class="kw">for</span> i := <span class="nm">1</span>; i < <span class="fn">len</span>(arr); i++ {
        key := arr[i]
        j := i - <span class="nm">1</span>
        <span class="kw">for</span> j >= <span class="nm">0</span> && arr[j] > key {
            arr[j+<span class="nm">1</span>] = arr[j]
            j--
        }
        arr[j+<span class="nm">1</span>] = key
    }
    <span class="kw">return</span> arr
}`,
    shell: `<span class="kw">func</span> <span class="fn">shellSort</span>(arr []<span class="ty">int</span>) []<span class="ty">int</span> {
    n := <span class="fn">len</span>(arr)
    <span class="kw">for</span> gap := n / <span class="nm">2</span>; gap > <span class="nm">0</span>; gap /= <span class="nm">2</span> {
        <span class="kw">for</span> i := gap; i < n; i++ {
            temp := arr[i]
            j := i
            <span class="kw">for</span> j >= gap && arr[j-gap] > temp {
                arr[j] = arr[j-gap]
                j -= gap
            }
            arr[j] = temp
        }
    }
    <span class="kw">return</span> arr
}`,
    quick: `<span class="kw">func</span> <span class="fn">quickSort</span>(arr []<span class="ty">int</span>, lo, hi <span class="ty">int</span>) []<span class="ty">int</span> {
    <span class="kw">if</span> lo >= hi {
        <span class="kw">return</span> arr
    }
    pivot := arr[hi]
    i := lo - <span class="nm">1</span>
    <span class="kw">for</span> j := lo; j < hi; j++ {
        <span class="kw">if</span> arr[j] <= pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+<span class="nm">1</span>], arr[hi] = arr[hi], arr[i+<span class="nm">1</span>]
    p := i + <span class="nm">1</span>
    <span class="fn">quickSort</span>(arr, lo, p-<span class="nm">1</span>)
    <span class="fn">quickSort</span>(arr, p+<span class="nm">1</span>, hi)
    <span class="kw">return</span> arr
}
<span class="cm">// вызов: quickSort(arr, 0, len(arr)-1)</span>`,
    merge: `<span class="kw">func</span> <span class="fn">mergeSort</span>(arr []<span class="ty">int</span>) []<span class="ty">int</span> {
    <span class="kw">if</span> <span class="fn">len</span>(arr) <= <span class="nm">1</span> {
        <span class="kw">return</span> arr
    }
    mid := <span class="fn">len</span>(arr) / <span class="nm">2</span>
    left := <span class="fn">mergeSort</span>(arr[:mid])
    right := <span class="fn">mergeSort</span>(arr[mid:])
    <span class="kw">return</span> <span class="fn">merge</span>(left, right)
}

<span class="kw">func</span> <span class="fn">merge</span>(l, r []<span class="ty">int</span>) []<span class="ty">int</span> {
    result := <span class="fn">make</span>([]<span class="ty">int</span>, <span class="nm">0</span>, <span class="fn">len</span>(l)+<span class="fn">len</span>(r))
    i, j := <span class="nm">0</span>, <span class="nm">0</span>
    <span class="kw">for</span> i < <span class="fn">len</span>(l) && j < <span class="fn">len</span>(r) {
        <span class="kw">if</span> l[i] <= r[j] {
            result = <span class="fn">append</span>(result, l[i])
            i++
        } <span class="kw">else</span> {
            result = <span class="fn">append</span>(result, r[j])
            j++
        }
    }
    result = <span class="fn">append</span>(result, l[i:]...)
    result = <span class="fn">append</span>(result, r[j:]...)
    <span class="kw">return</span> result
}`,
    heap: `<span class="kw">func</span> <span class="fn">heapSort</span>(arr []<span class="ty">int</span>) []<span class="ty">int</span> {
    n := <span class="fn">len</span>(arr)
    <span class="kw">for</span> i := n/<span class="nm">2</span> - <span class="nm">1</span>; i >= <span class="nm">0</span>; i-- {
        <span class="fn">heapify</span>(arr, n, i)
    }
    <span class="kw">for</span> i := n - <span class="nm">1</span>; i > <span class="nm">0</span>; i-- {
        arr[<span class="nm">0</span>], arr[i] = arr[i], arr[<span class="nm">0</span>]
        <span class="fn">heapify</span>(arr, i, <span class="nm">0</span>)
    }
    <span class="kw">return</span> arr
}

<span class="kw">func</span> <span class="fn">heapify</span>(arr []<span class="ty">int</span>, n, i <span class="ty">int</span>) {
    largest := i
    l, r := <span class="nm">2</span>*i+<span class="nm">1</span>, <span class="nm">2</span>*i+<span class="nm">2</span>
    <span class="kw">if</span> l < n && arr[l] > arr[largest] {
        largest = l
    }
    <span class="kw">if</span> r < n && arr[r] > arr[largest] {
        largest = r
    }
    <span class="kw">if</span> largest != i {
        arr[i], arr[largest] = arr[largest], arr[i]
        <span class="fn">heapify</span>(arr, n, largest)
    }
}`,
    radix: `<span class="kw">func</span> <span class="fn">radixSort</span>(arr []<span class="ty">int</span>) []<span class="ty">int</span> {
    maxVal := <span class="fn">max</span>(arr)
    <span class="kw">for</span> exp := <span class="nm">1</span>; maxVal/exp > <span class="nm">0</span>; exp *= <span class="nm">10</span> {
        <span class="fn">countingSort</span>(arr, exp)
    }
    <span class="kw">return</span> arr
}

<span class="kw">func</span> <span class="fn">countingSort</span>(arr []<span class="ty">int</span>, exp <span class="ty">int</span>) {
    n := <span class="fn">len</span>(arr)
    output := <span class="fn">make</span>([]<span class="ty">int</span>, n)
    count := <span class="fn">make</span>([]<span class="ty">int</span>, <span class="nm">10</span>)
    <span class="kw">for</span> i := <span class="nm">0</span>; i < n; i++ {
        count[(arr[i]/exp)%<span class="nm">10</span>]++
    }
    <span class="kw">for</span> i := <span class="nm">1</span>; i < <span class="nm">10</span>; i++ {
        count[i] += count[i-<span class="nm">1</span>]
    }
    <span class="kw">for</span> i := n - <span class="nm">1</span>; i >= <span class="nm">0</span>; i-- {
        idx := (arr[i] / exp) % <span class="nm">10</span>
        count[idx]--
        output[count[idx]] = arr[i]
    }
    <span class="fn">copy</span>(arr, output)
}`,
    counting: `<span class="kw">func</span> <span class="fn">countingSort</span>(arr []<span class="ty">int</span>) []<span class="ty">int</span> {
    max := arr[<span class="nm">0</span>]
    <span class="kw">for</span> _, v := <span class="kw">range</span> arr { <span class="kw">if</span> v > max { max = v } }
    count := <span class="fn">make</span>([]<span class="ty">int</span>, max + <span class="nm">1</span>)
    output := <span class="fn">make</span>([]<span class="ty">int</span>, <span class="fn">len</span>(arr))
    <span class="kw">for</span> _, x := <span class="kw">range</span> arr {
        count[x]++
    }
    <span class="kw">for</span> i := <span class="nm">1</span>; i <= max; i++ {
        count[i] += count[i - <span class="nm">1</span>]
    }
    <span class="kw">for</span> i := <span class="fn">len</span>(arr) - <span class="nm">1</span>; i >= <span class="nm">0</span>; i-- {
        count[arr[i]]--
        output[count[arr[i]]] = arr[i]
    }
    <span class="kw">return</span> output
}`,
    timsort: `<span class="kw">const</span> MIN_RUN = <span class="nm">32</span>

<span class="kw">func</span> <span class="fn">insertionSortRange</span>(arr []<span class="ty">int</span>, lo, hi <span class="ty">int</span>) {
    <span class="kw">for</span> i := lo + <span class="nm">1</span>; i <= hi; i++ {
        key, j := arr[i], i-<span class="nm">1</span>
        <span class="kw">for</span> j >= lo && arr[j] > key {
            arr[j + <span class="nm">1</span>] = arr[j];
            j--
        }
        arr[j + <span class="nm">1</span>] = key
    }
}

<span class="kw">func</span> <span class="fn">merge</span>(arr []<span class="ty">int</span>, lo, mid, hi <span class="ty">int</span>) {
    left := <span class="fn">append</span>([]<span class="ty">int</span>{}, arr[lo : mid + <span class="nm">1</span>]...)
    right := <span class="fn">append</span>([]<span class="ty">int</span>{}, arr[mid + <span class="nm">1</span> : hi + <span class="nm">1</span>]...)
    i, j, k := <span class="nm">0</span>, <span class="nm">0</span>, lo
    <span class="kw">for</span> i < <span class="fn">len</span>(left) && j < <span class="fn">len</span>(right) {
        <span class="kw">if</span> left[i] <= right[j] { 
            arr[k] = left[i]; i++
        } <span class="kw">else</span> { 
            arr[k] = right[j]; j++
        }
        k++
    }
    <span class="kw">for</span> i < <span class="fn">len</span>(left)  { 
        arr[k] = left[i];
        i++; k++
    }
    <span class="kw">for</span> j < <span class="fn">len</span>(right) { 
        arr[k] = right[j];
        j++; k++
    }
}

<span class="kw">func</span> <span class="fn">timSort</span>(arr []<span class="ty">int</span>) {
    n := <span class="fn">len</span>(arr)
    <span class="kw">for</span> i := <span class="nm">0</span>; i < n; i += MIN_RUN {
        hi := i + MIN_RUN - <span class="nm">1</span>
        <span class="kw">if</span> hi >= n {
            hi = n - <span class="nm">1</span>
        }
        <span class="fn">insertionSortRange</span>(arr, i, hi)
    }
    <span class="kw">for</span> size := MIN_RUN; size < n; size *= <span class="nm">2</span> {
        <span class="kw">for</span> lo := <span class="nm">0</span>; lo < n; lo += <span class="nm">2</span> * size {
            mid := lo + size - <span class="nm">1</span>; 
            <span class="kw">if</span> mid >= n {
                mid = n - <span class="nm">1</span>
            }
            hi := lo + <span class="nm">2</span> * size - <span class="nm">1</span>; 
            <span class="kw">if</span> hi >= n {
                hi = n - <span class="nm">1</span>
            }
            <span class="kw">if</span> mid < hi { 
                <span class="fn">merge</span>(arr, lo, mid, hi) 
            }
        }
    }
}`,
    linear: `<span class="kw">func</span> <span class="fn">linearSearch</span>(arr []<span class="ty">int</span>, target <span class="ty">int</span>) <span class="ty">int</span> {
    <span class="kw">for</span> i, v := <span class="kw">range</span> arr {
        <span class="kw">if</span> v == target {
            <span class="kw">return</span> i
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    binary: `<span class="kw">func</span> <span class="fn">binarySearch</span>(arr []<span class="ty">int</span>, target <span class="ty">int</span>) <span class="ty">int</span> {
    lo, hi := <span class="nm">0</span>, <span class="fn">len</span>(arr)-<span class="nm">1</span>
    <span class="kw">for</span> lo <= hi {
        mid := (lo + hi) / <span class="nm">2</span>
        <span class="kw">if</span> arr[mid] == target {
            <span class="kw">return</span> mid
        }
        <span class="kw">if</span> arr[mid] < target {
            lo = mid + <span class="nm">1</span>
        } <span class="kw">else</span> {
            hi = mid - <span class="nm">1</span>
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    jump: `<span class="kw">func</span> <span class="fn">jumpSearch</span>(arr []<span class="ty">int</span>, target <span class="ty">int</span>) <span class="ty">int</span> {
    n := <span class="fn">len</span>(arr)
    step := <span class="fn">int</span>(math.<span class="fn">Sqrt</span>(<span class="fn">float64</span>(n)))
    prev := <span class="nm">0</span>
    <span class="kw">for</span> arr[<span class="fn">min</span>(step, n)-<span class="nm">1</span>] < target {
        prev = step
        step += <span class="fn">int</span>(math.<span class="fn">Sqrt</span>(<span class="fn">float64</span>(n)))
        <span class="kw">if</span> prev >= n {
            <span class="kw">return</span> -<span class="nm">1</span>
        }
    }
    <span class="kw">for</span> arr[prev] < target {
        prev++
        <span class="kw">if</span> prev == <span class="fn">min</span>(step, n) {
            <span class="kw">return</span> -<span class="nm">1</span>
        }
    }
    <span class="kw">if</span> arr[prev] == target {
        <span class="kw">return</span> prev
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    interpolation: `<span class="kw">func</span> <span class="fn">interpolationSearch</span>(arr []<span class="ty">int</span>, target <span class="ty">int</span>) <span class="ty">int</span> {
    lo, hi := <span class="nm">0</span>, <span class="fn">len</span>(arr)-<span class="nm">1</span>
    <span class="kw">for</span> lo <= hi && target >= arr[lo] && target <= arr[hi] {
        <span class="kw">if</span> lo == hi {
            <span class="kw">if</span> arr[lo] == target {
                <span class="kw">return</span> lo
            }
            <span class="kw">return</span> -<span class="nm">1</span>
        }
        pos := lo + ((target-arr[lo])*(hi-lo))/(arr[hi]-arr[lo])
        <span class="kw">if</span> arr[pos] == target {
            <span class="kw">return</span> pos
        }
        <span class="kw">if</span> arr[pos] < target {
            lo = pos + <span class="nm">1</span>
        } <span class="kw">else</span> {
            hi = pos - <span class="nm">1</span>
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    exponential: `<span class="kw">func</span> <span class="fn">exponentialSearch</span>(arr []<span class="ty">int</span>, target <span class="ty">int</span>) <span class="ty">int</span> {
    <span class="kw">if</span> arr[<span class="nm">0</span>] == target {
        <span class="kw">return</span> <span class="nm">0</span>
    }
    i := <span class="nm">1</span>
    <span class="kw">for</span> i < <span class="fn">len</span>(arr) && arr[i] <= target {
        i *= <span class="nm">2</span>
    }
    <span class="kw">return</span> <span class="fn">binarySearch</span>(arr, target, i/<span class="nm">2</span>, <span class="fn">min</span>(i, <span class="fn">len</span>(arr)-<span class="nm">1</span>))
}`,
    bfs: `<span class="kw">func</span> <span class="fn">bfs</span>(graph [][]<span class="ty">int</span>, start <span class="ty">int</span>) {
    visited := <span class="fn">make</span>([]<span class="ty">bool</span>, <span class="fn">len</span>(graph))
    queue := []<span class="ty">int</span>{start}
    visited[start] = <span class="kw">true</span>
    <span class="kw">for</span> <span class="fn">len</span>(queue) > <span class="nm">0</span> {
        node := queue[<span class="nm">0</span>]
        queue = queue[<span class="nm">1</span>:]
        <span class="kw">for</span> _, neighbor := <span class="kw">range</span> graph[node] {
            <span class="kw">if</span> !visited[neighbor] {
                visited[neighbor] = <span class="kw">true</span>
                queue = <span class="fn">append</span>(queue, neighbor)
            }
        }
    }
}`,
    dfs: `<span class="kw">func</span> <span class="fn">dfs</span>(graph [][]<span class="ty">int</span>, start <span class="ty">int</span>, visited []<span class="ty">bool</span>) {
    visited[start] = <span class="kw">true</span>
    <span class="kw">for</span> _, neighbor := <span class="kw">range</span> graph[start] {
        <span class="kw">if</span> !visited[neighbor] {
            <span class="fn">dfs</span>(graph, neighbor, visited)
        }
    }
}`,
    dijkstra: `<span class="kw">import</span> <span class="st">"container/heap"</span>

<span class="kw">func</span> <span class="fn">dijkstra</span>(graph [][][<span class="nm">2</span>]<span class="ty">int</span>, src <span class="ty">int</span>) []<span class="ty">int</span> {
    n := <span class="fn">len</span>(graph)
    dist := <span class="fn">make</span>([]<span class="ty">int</span>, n)
    <span class="kw">for</span> i := <span class="kw">range</span> dist { dist[i] = <span class="nm">1</span><<<span class="nm">62</span> }
    dist[src] = <span class="nm">0</span>
    pq := &<span class="ty">MinHeap</span>{{<span class="nm">0</span>, src}}
    heap.<span class="fn">Init</span>(pq)
    <span class="kw">for</span> pq.<span class="fn">Len</span>() > <span class="nm">0</span> {
        cur := heap.<span class="fn">Pop</span>(pq).(<span class="ty">Item</span>)
        <span class="kw">if</span> cur.d > dist[cur.node] { <span class="kw">continue</span> }
        <span class="kw">for</span> _, e := <span class="kw">range</span> graph[cur.node] {
            <span class="kw">if</span> nd := cur.d + e[<span class="nm">1</span>]; nd < dist[e[<span class="nm">0</span>]] {
                dist[e[<span class="nm">0</span>]] = nd
                heap.<span class="fn">Push</span>(pq, <span class="ty">Item</span>{nd, e[<span class="nm">0</span>]})
            }
        }
    }
    <span class="kw">return</span> dist
}`,
    fib: `<span class="kw">func</span> <span class="fn">fibonacci</span>(n <span class="ty">int</span>) <span class="ty">int</span> {
    dp := <span class="fn">make</span>([]<span class="ty">int</span>, n+<span class="nm">1</span>)
    dp[<span class="nm">1</span>] = <span class="nm">1</span>
    <span class="kw">for</span> i := <span class="nm">2</span>; i <= n; i++ {
        dp[i] = dp[i-<span class="nm">1</span>] + dp[i-<span class="nm">2</span>]
    }
    <span class="kw">return</span> dp[n]
}`,
    knapsack: `<span class="kw">func</span> <span class="fn">knapsack</span>(wt, val []<span class="ty">int</span>, W <span class="ty">int</span>) <span class="ty">int</span> {
    n := <span class="fn">len</span>(wt)
    dp := <span class="fn">make</span>([][]<span class="ty">int</span>, n+<span class="nm">1</span>)
    <span class="kw">for</span> i := <span class="kw">range</span> dp {
        dp[i] = <span class="fn">make</span>([]<span class="ty">int</span>, W+<span class="nm">1</span>)
    }
    <span class="kw">for</span> i := <span class="nm">1</span>; i <= n; i++ {
        <span class="kw">for</span> w := <span class="nm">0</span>; w <= W; w++ {
            <span class="kw">if</span> wt[i-<span class="nm">1</span>] <= w {
                dp[i][w] = <span class="fn">max</span>(val[i-<span class="nm">1</span>]+dp[i-<span class="nm">1</span>][w-wt[i-<span class="nm">1</span>]], dp[i-<span class="nm">1</span>][w])
            } <span class="kw">else</span> {
                dp[i][w] = dp[i-<span class="nm">1</span>][w]
            }
        }
    }
    <span class="kw">return</span> dp[n][W]
}`,
    lcs: `<span class="kw">func</span> <span class="fn">lcs</span>(a, b []<span class="ty">int</span>) <span class="ty">int</span> {
    m, n := <span class="fn">len</span>(a), <span class="fn">len</span>(b)
    dp := <span class="fn">make</span>([][]<span class="ty">int</span>, m+<span class="nm">1</span>)
    <span class="kw">for</span> i := <span class="kw">range</span> dp { dp[i] = <span class="fn">make</span>([]<span class="ty">int</span>, n+<span class="nm">1</span>) }
    <span class="kw">for</span> i := <span class="nm">1</span>; i <= m; i++ {
        <span class="kw">for</span> j := <span class="nm">1</span>; j <= n; j++ {
            <span class="kw">if</span> a[i-<span class="nm">1</span>] == b[j-<span class="nm">1</span>] { dp[i][j] = dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>] + <span class="nm">1</span>
            } <span class="kw">else if</span> dp[i-<span class="nm">1</span>][j] > dp[i][j-<span class="nm">1</span>] { dp[i][j] = dp[i-<span class="nm">1</span>][j]
            } <span class="kw">else</span> { dp[i][j] = dp[i][j-<span class="nm">1</span>] }
        }
    }
    <span class="kw">return</span> dp[m][n]
}`,
    lis: `<span class="kw">func</span> <span class="fn">lis</span>(arr []<span class="ty">int</span>) <span class="ty">int</span> {
    n := <span class="fn">len</span>(arr)
    dp := <span class="fn">make</span>([]<span class="ty">int</span>, n)
    <span class="kw">for</span> i := <span class="kw">range</span> dp { dp[i] = <span class="nm">1</span> }
    res := <span class="nm">1</span>
    <span class="kw">for</span> i := <span class="nm">1</span>; i < n; i++ {
        <span class="kw">for</span> j := <span class="nm">0</span>; j < i; j++ {
            <span class="kw">if</span> arr[j] < arr[i] && dp[j]+<span class="nm">1</span> > dp[i] {
                dp[i] = dp[j] + <span class="nm">1</span>
            }
        }
        <span class="kw">if</span> dp[i] > res { res = dp[i] }
    }
    <span class="kw">return</span> res
}`,
    bellmanFord: `<span class="kw">func</span> <span class="fn">bellmanFord</span>(edges [][<span class="nm">3</span>]<span class="ty">int</span>, n, src <span class="ty">int</span>) []<span class="ty">int</span> {
    dist := <span class="fn">make</span>([]<span class="ty">int</span>, n)
    <span class="kw">for</span> i := <span class="kw">range</span> dist { dist[i] = math.MaxInt32 }
    dist[src] = <span class="nm">0</span>
    <span class="kw">for</span> i := <span class="nm">0</span>; i < n-<span class="nm">1</span>; i++ {
        updated := <span class="kw">false</span>
        <span class="kw">for</span> _, e := <span class="kw">range</span> edges {
            u, v, w := e[<span class="nm">0</span>], e[<span class="nm">1</span>], e[<span class="nm">2</span>]
            <span class="kw">if</span> dist[u] != math.MaxInt32 && dist[u]+w < dist[v] {
                dist[v] = dist[u] + w
                updated = <span class="kw">true</span>
            }
        }
        <span class="kw">if</span> !updated { <span class="kw">break</span> }
    }
    <span class="kw">return</span> dist
}`,
    astar: `<span class="kw">type</span> <span class="ty">item</span> [<span class="nm">2</span>]<span class="ty">int</span>
<span class="kw">type</span> <span class="ty">minPQ</span> []<span class="ty">item</span>

<span class="kw">func</span> (h <span class="ty">minPQ</span>) <span class="fn">Len</span>() <span class="ty">int</span>{ <span class="kw">return</span> <span class="fn">len</span>(h) }
<span class="kw">func</span> (h <span class="ty">minPQ</span>) <span class="fn">Less</span>(i, j <span class="ty">int</span>) <span class="ty">bool</span>{ <span class="kw">return</span> h[i][<span class="nm">0</span>] < h[j][<span class="nm">0</span>] }
<span class="kw">func</span> (h <span class="ty">minPQ</span>) <span class="fn">Swap</span>(i, j <span class="ty">int</span>){
    h[i], h[j] = h[j], h[i]
}
<span class="kw">func</span> (h *<span class="ty">minPQ</span>) <span class="fn">Push</span>(x <span class="ty">any</span>){
    *h = <span class="fn">append</span>(*h, x.(<span class="ty">item</span>))
}
<span class="kw">func</span> (h *<span class="ty">minPQ</span>) <span class="fn">Pop</span>() <span class="ty">any</span> {
    old := *h; x := old[<span class="fn">len</span>(old) - <span class="nm">1</span>]; *h = old[:<span class="fn">len</span>(old) - <span class="nm">1</span>];
    <span class="kw">return</span> x
}

<span class="kw">func</span> <span class="fn">aStar</span>(graph [][][<span class="nm">2</span>]<span class="ty">int</span>, src, goal <span class="ty">int</span>, h <span class="kw">func</span>(<span class="ty">int</span>) <span class="ty">int</span>) <span class="ty">int</span> {
    n := <span class="fn">len</span>(graph)
    g := <span class="fn">make</span>([]<span class="ty">int</span>, n)
    <span class="kw">for</span> i := <span class="kw">range</span> g { g[i] = math.MaxInt32 }
    g[src] = <span class="nm">0</span>
    visited := <span class="fn">make</span>([]<span class="ty">bool</span>, n)
    q := &<span class="ty">minPQ</span>{{<span class="fn">h</span>(src), src}}
    heap.<span class="fn">Init</span>(q)
    <span class="kw">for</span> q.<span class="fn">Len</span>() > <span class="nm">0</span> {
        cur := heap.<span class="fn">Pop</span>(q).(<span class="ty">item</span>)
        u := cur[<span class="nm">1</span>]
        <span class="kw">if</span> visited[u] { <span class="kw">continue</span> }
        visited[u] = <span class="kw">true</span>
        <span class="kw">if</span> u == goal { <span class="kw">return</span> g[goal] }
        <span class="kw">for</span> _, e := <span class="kw">range</span> graph[u] {
            v, w := e[<span class="nm">0</span>], e[<span class="nm">1</span>]
            <span class="kw">if</span> tg := g[u] + w; tg < g[v] {
                g[v] = tg
                heap.<span class="fn">Push</span>(q, <span class="ty">item</span>{tg + <span class="fn">h</span>(v), v})
            }
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    toposort: `<span class="kw">func</span> <span class="fn">dfsTopoSort</span>(graph [][]<span class="ty">int</span>, u <span class="ty">int</span>, visited []<span class="ty">bool</span>, order *[]<span class="ty">int</span>) {
    visited[u] = <span class="kw">true</span>
    <span class="kw">for</span> _, v := <span class="kw">range</span> graph[u] {
        <span class="kw">if</span> !visited[v] {
            <span class="fn">dfsTopoSort</span>(graph, v, visited, order)
        }
    }
    *order = <span class="fn">append</span>(*order, u)
}

<span class="kw">func</span> <span class="fn">topoSort</span>(graph [][]<span class="ty">int</span>, n <span class="ty">int</span>) []<span class="ty">int</span> {
    visited := <span class="fn">make</span>([]<span class="ty">bool</span>, n)
    order := []<span class="ty">int</span>{}
    <span class="kw">for</span> i := <span class="nm">0</span>; i < n; i++ {
        <span class="kw">if</span> !visited[i] {
            <span class="fn">dfsTopoSort</span>(graph, i, visited, &order)
        }
    }
    <span class="kw">for</span> l, r := <span class="nm">0</span>, <span class="fn">len</span>(order)-<span class="nm">1</span>; l < r; l, r = l + <span class="nm">1</span>, r - <span class="nm">1</span> {
        order[l], order[r] = order[r], order[l]
    }
    <span class="kw">return</span> order
}`,
    floydWarshall: `<span class="kw">func</span> <span class="fn">floydWarshall</span>(dp [][]<span class="ty">int</span>) {
    n := <span class="fn">len</span>(dp)
    <span class="kw">for</span> k := <span class="nm">0</span>; k < n; k++ {
        <span class="kw">for</span> i := <span class="nm">0</span>; i < n; i++ {
            <span class="kw">for</span> j := <span class="nm">0</span>; j < n; j++ {
                <span class="kw">if</span> dp[i][k] != math.MaxInt32 && dp[k][j] != math.MaxInt32 {
                    <span class="kw">if</span> dp[i][k] + dp[k][j] < dp[i][j] {
                        dp[i][j] = dp[i][k] + dp[k][j]
                    }
                }
            }
        }
    }
}`,
    prim: `<span class="kw">func</span> <span class="fn">prim</span>(graph [][][<span class="nm">2</span>]<span class="ty">int</span>, n <span class="ty">int</span>) <span class="ty">int</span> {
    inMST := <span class="fn">make</span>([]<span class="ty">bool</span>, n)
    key := <span class="fn">make</span>([]<span class="ty">int</span>, n)
    <span class="kw">for</span> i := <span class="kw">range</span> key {
        key[i] = math.MaxInt32
    }
    key[<span class="nm">0</span>] = <span class="nm">0</span>
    q := &<span class="ty">minPQ</span>{{<span class="nm">0</span>, <span class="nm">0</span>}}
    heap.<span class="fn">Init</span>(q)
    cost := <span class="nm">0</span>
    <span class="kw">for</span> q.<span class="fn">Len</span>() > <span class="nm">0</span> {
        cur := heap.<span class="fn">Pop</span>(q).(<span class="ty">item</span>)
        w, u := cur[<span class="nm">0</span>], cur[<span class="nm">1</span>]
        <span class="kw">if</span> inMST[u] {
            <span class="kw">continue</span>
        }
        inMST[u] = <span class="kw">true</span>; cost += w
        <span class="kw">for</span> _, e := <span class="kw">range</span> graph[u] {
            v, wt := e[<span class="nm">0</span>], e[<span class="nm">1</span>]
            <span class="kw">if</span> !inMST[v] && wt < key[v] {
                key[v] = wt
                heap.<span class="fn">Push</span>(q, <span class="ty">item</span>{wt, v})
            }
        }
    }
    <span class="kw">return</span> cost
}`,
    kruskal: `<span class="kw">func</span> <span class="fn">kruskal</span>(edges [][<span class="nm">3</span>]<span class="ty">int</span>, n <span class="ty">int</span>) <span class="ty">int</span> {
    parent := <span class="fn">make</span>([]<span class="ty">int</span>, n)
    <span class="kw">for</span> i := <span class="kw">range</span> parent {
        parent[i] = i
    }
    <span class="kw">var</span> find <span class="kw">func</span>(<span class="ty">int</span>) <span class="ty">int</span>
    find = <span class="kw">func</span>(x <span class="ty">int</span>) <span class="ty">int</span> {
        <span class="kw">if</span> parent[x] != x {
            parent[x] = <span class="fn">find</span>(parent[x])
        }
        <span class="kw">return</span> parent[x]
    }
    sort.<span class="fn">Slice</span>(edges, <span class="kw">func</span>(i, j <span class="ty">int</span>) <span class="ty">bool</span> {
        <span class="kw">return</span> edges[i][<span class="nm">0</span>] < edges[j][<span class="nm">0</span>]
    })
    cost := <span class="nm">0</span>
    <span class="kw">for</span> _, e := <span class="kw">range</span> edges {
        w, u, v := e[<span class="nm">0</span>], e[<span class="nm">1</span>], e[<span class="nm">2</span>]
        pu, pv := <span class="fn">find</span>(u), <span class="fn">find</span>(v)
        <span class="kw">if</span> pu != pv {
            parent[pu] = pv; cost += w
        }
    }
    <span class="kw">return</span> cost
}`,
    coinChange: `<span class="kw">func</span> <span class="fn">coinChange</span>(coins []<span class="ty">int</span>, amount <span class="ty">int</span>) <span class="ty">int</span> {
    dp := <span class="fn">make</span>([]<span class="ty">int</span>, amount+<span class="nm">1</span>)
    <span class="kw">for</span> i := <span class="kw">range</span> dp {
        dp[i] = math.MaxInt32
    }
    dp[<span class="nm">0</span>] = <span class="nm">0</span>
    <span class="kw">for</span> i := <span class="nm">1</span>; i <= amount; i++ {
        <span class="kw">for</span> _, c := <span class="kw">range</span> coins {
            <span class="kw">if</span> c <= i && dp[i - c] != math.MaxInt32 && dp[i - c] + <span class="nm">1</span> < dp[i] {
                dp[i] = dp[i - c] + <span class="nm">1</span>
            }
        }
    }
    <span class="kw">if</span> dp[amount] == math.MaxInt32 {
        <span class="kw">return</span> -<span class="nm">1</span>
    }
    <span class="kw">return</span> dp[amount]
}
`,
    editDistance: `<span class="kw">func</span> <span class="fn">editDistance</span>(a, b <span class="ty">string</span>) <span class="ty">int</span> {
    m, n := <span class="fn">len</span>(a), <span class="fn">len</span>(b)
    dp := <span class="fn">make</span>([][]<span class="ty">int</span>, m+<span class="nm">1</span>)
    <span class="kw">for</span> i := <span class="kw">range</span> dp {
        dp[i] = <span class="fn">make</span>([]<span class="ty">int</span>, n+<span class="nm">1</span>)
    }
    <span class="kw">for</span> i := <span class="nm">0</span>; i <= m; i++ {
        dp[i][<span class="nm">0</span>] = i
    }
    <span class="kw">for</span> j := <span class="nm">0</span>; j <= n; j++ {
        dp[<span class="nm">0</span>][j] = j
    }
    <span class="kw">for</span> i := <span class="nm">1</span>; i <= m; i++ {
        <span class="kw">for</span> j := <span class="nm">1</span>; j <= n; j++ {
            <span class="kw">if</span> a[i - <span class="nm">1</span>] == b[j - <span class="nm">1</span>] {
                dp[i][j] = dp[i - <span class="nm">1</span>][j - <span class="nm">1</span>]
            } <span class="kw">else</span> {
                dp[i][j] = <span class="nm">1</span> + <span class="fn">min</span>(dp[i - <span class="nm">1</span>][j - <span class="nm">1</span>], <span class="fn">min</span>(dp[i - <span class="nm">1</span>][j], dp[i][j - <span class="nm">1</span>]))
            }
        }
    }
    <span class="kw">return</span> dp[m][n]
}
`,
    matrixChain: `<span class="kw">func</span> <span class="fn">matrixChain</span>(dims []<span class="ty">int</span>) <span class="ty">int</span> {
    n := <span class="fn">len</span>(dims) - <span class="nm">1</span>
    dp := <span class="fn">make</span>([][]<span class="ty">int</span>, n)
    <span class="kw">for</span> i := <span class="kw">range</span> dp {
        dp[i] = <span class="fn">make</span>([]<span class="ty">int</span>, n)
    }
    <span class="kw">for</span> length := <span class="nm">2</span>; length <= n; length++ {
        <span class="kw">for</span> i := <span class="nm">0</span>; i <= n - length; i++ {
            j := i + length - <span class="nm">1</span>
            dp[i][j] = math.MaxInt32
            <span class="kw">for</span> k := i; k < j; k++ {
                cost := dp[i][k] + dp[k+<span class="nm">1</span>][j] + dims[i] * dims[k + <span class="nm">1</span>] * dims[j + <span class="nm">1</span>]
                <span class="kw">if</span> cost < dp[i][j] { dp[i][j] = cost }
            }
        }
    }
    <span class="kw">return</span> dp[<span class="nm">0</span>][n-<span class="nm">1</span>]
}
`,
    rodCutting: `<span class="kw">func</span> <span class="fn">rodCutting</span>(prices []<span class="ty">int</span>) <span class="ty">int</span> {
    n := <span class="fn">len</span>(prices)
    dp := <span class="fn">make</span>([]<span class="ty">int</span>, n+<span class="nm">1</span>)
    <span class="kw">for</span> length := <span class="nm">1</span>; length <= n; length++ {
        <span class="kw">for</span> cut := <span class="nm">1</span>; cut <= length; cut++ {
            <span class="kw">if</span> v := prices[cut-<span class="nm">1</span>] + dp[length-cut]; v > dp[length] {
                dp[length] = v
            }
        }
    }
    <span class="kw">return</span> dp[n]
}
`,
    hashChaining: `<span class="kw">type</span> <span class="ty">HashTableChaining</span> <span class="kw">struct</span> {
    size  <span class="ty">int</span>
    table [][]<span class="ty">int</span>
}

<span class="kw">func</span> <span class="fn">NewHashTableChaining</span>(size <span class="ty">int</span>) *<span class="ty">HashTableChaining</span> {
    <span class="kw">return</span> &<span class="ty">HashTableChaining</span>{size, <span class="fn">make</span>([][]<span class="ty">int</span>, size)}
}
<span class="kw">func</span> (h *<span class="ty">HashTableChaining</span>) <span class="fn">hash</span>(key <span class="ty">int</span>) <span class="ty">int</span> { <span class="kw">return</span> key % h.size }
<span class="kw">func</span> (h *<span class="ty">HashTableChaining</span>) <span class="fn">Insert</span>(key <span class="ty">int</span>) {
    i := h.<span class="fn">hash</span>(key)
    h.table[i] = <span class="fn">append</span>(h.table[i], key)
}
<span class="kw">func</span> (h *<span class="ty">HashTableChaining</span>) <span class="fn">Search</span>(key <span class="ty">int</span>) <span class="ty">bool</span> {
    <span class="kw">for</span> _, v := <span class="kw">range</span> h.table[h.<span class="fn">hash</span>(key)] {
        <span class="kw">if</span> v == key { <span class="kw">return</span> <span class="kw">true</span> }
    }
    <span class="kw">return</span> <span class="kw">false</span>
}`,
    hashLinear: `<span class="kw">type</span> <span class="ty">HashTableLinear</span> <span class="kw">struct</span> {
    size  <span class="ty">int</span>
    table []*<span class="ty">int</span>
}

<span class="kw">func</span> <span class="fn">NewHashTableLinear</span>(size <span class="ty">int</span>) *<span class="ty">HashTableLinear</span> {
    <span class="kw">return</span> &<span class="ty">HashTableLinear</span>{size, <span class="fn">make</span>([]*<span class="ty">int</span>, size)}
}
<span class="kw">func</span> (h *<span class="ty">HashTableLinear</span>) <span class="fn">hash</span>(key <span class="ty">int</span>) <span class="ty">int</span> { <span class="kw">return</span> key % h.size }
<span class="kw">func</span> (h *<span class="ty">HashTableLinear</span>) <span class="fn">Insert</span>(key <span class="ty">int</span>) {
    i := h.<span class="fn">hash</span>(key)
    <span class="kw">for</span> h.table[i] != <span class="kw">nil</span> { i = (i + <span class="nm">1</span>) % h.size }
    h.table[i] = &key
}
<span class="kw">func</span> (h *<span class="ty">HashTableLinear</span>) <span class="fn">Search</span>(key <span class="ty">int</span>) <span class="ty">int</span> {
    i := h.<span class="fn">hash</span>(key)
    <span class="kw">for</span> h.table[i] != <span class="kw">nil</span> {
        <span class="kw">if</span> *h.table[i] == key { <span class="kw">return</span> i }
        i = (i + <span class="nm">1</span>) % h.size
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
  },
  rust: {
    bst: `<span class="kw">struct</span> <span class="ty">Node</span> {
    val: <span class="ty">i32</span>,
    left: <span class="ty">Option</span>&lt;<span class="ty">Box</span>&lt;<span class="ty">Node</span>&gt;&gt;,
    right: <span class="ty">Option</span>&lt;<span class="ty">Box</span>&lt;<span class="ty">Node</span>&gt;&gt;,
}

<span class="kw">fn</span> <span class="fn">insert</span>(root: <span class="ty">Option</span>&lt;<span class="ty">Box</span>&lt;<span class="ty">Node</span>&gt;&gt;, val: <span class="ty">i32</span>) -> <span class="ty">Option</span>&lt;<span class="ty">Box</span>&lt;<span class="ty">Node</span>&gt;&gt; {
    <span class="kw">match</span> root {
        <span class="ty">None</span> => <span class="ty">Some</span>(<span class="ty">Box</span>::<span class="fn">new</span>(<span class="ty">Node</span> { val, left: <span class="ty">None</span>, right: <span class="ty">None</span> })),
        <span class="ty">Some</span>(<span class="kw">mut</span> node) => {
            <span class="kw">if</span> val < node.val {
                node.left = <span class="fn">insert</span>(node.left.<span class="fn">take</span>(), val);
            } <span class="kw">else if</span> val > node.val {
                node.right = <span class="fn">insert</span>(node.right.<span class="fn">take</span>(), val);
            }
            <span class="ty">Some</span>(node)
        }
    }
}

<span class="kw">fn</span> <span class="fn">search</span>(root: &<span class="ty">Option</span>&lt;<span class="ty">Box</span>&lt;<span class="ty">Node</span>&gt;&gt;, val: <span class="ty">i32</span>) -> <span class="ty">bool</span> {
    <span class="kw">match</span> root {
        <span class="ty">None</span> => <span class="kw">false</span>,
        <span class="ty">Some</span>(node) <span class="kw">if</span> val == node.val => <span class="kw">true</span>,
        <span class="ty">Some</span>(node) <span class="kw">if</span> val < node.val => <span class="fn">search</span>(&node.left, val),
        <span class="ty">Some</span>(node) => <span class="fn">search</span>(&node.right, val),
    }
}`,
    kmp: `<span class="kw">fn</span> <span class="fn">build_lps</span>(p: &[<span class="ty">u8</span>]) -> <span class="ty">Vec</span>&lt;<span class="ty">usize</span>&gt; {
    <span class="kw">let mut</span> lps = <span class="fn">vec!</span>[<span class="nm">0</span>; p.<span class="fn">len</span>()];
    <span class="kw">let mut</span> len = <span class="nm">0</span>;
    <span class="kw">let mut</span> i = <span class="nm">1</span>;
    <span class="kw">while</span> i < p.<span class="fn">len</span>() {
        <span class="kw">if</span> p[i] == p[len] { len += <span class="nm">1</span>; lps[i] = len; i += <span class="nm">1</span>; }
        <span class="kw">else if</span> len > <span class="nm">0</span> { len = lps[len - <span class="nm">1</span>]; }
        <span class="kw">else</span> { lps[i] = <span class="nm">0</span>; i += <span class="nm">1</span>; }
    }
    lps
}

<span class="kw">fn</span> <span class="fn">kmp</span>(text: &[<span class="ty">u8</span>], pat: &[<span class="ty">u8</span>]) -> <span class="ty">i32</span> {
    <span class="kw">let</span> lps = <span class="fn">build_lps</span>(pat);
    <span class="kw">let</span> (<span class="kw">mut</span> i, <span class="kw">mut</span> j) = (<span class="nm">0</span>, <span class="nm">0</span>);
    <span class="kw">while</span> i < text.<span class="fn">len</span>() {
        <span class="kw">if</span> text[i] == pat[j] {
            i += <span class="nm">1</span>; j += <span class="nm">1</span>;
            <span class="kw">if</span> j == pat.<span class="fn">len</span>() { <span class="kw">return</span> (i - j) <span class="kw">as</span> <span class="ty">i32</span>; }
        } <span class="kw">else if</span> j > <span class="nm">0</span> { j = lps[j - <span class="nm">1</span>]; }
        <span class="kw">else</span> { i += <span class="nm">1</span>; }
    }
    -<span class="nm">1</span>
}`,
    rabinkarp: `<span class="kw">fn</span> <span class="fn">rabin_karp</span>(text: &[<span class="ty">u8</span>], pat: &[<span class="ty">u8</span>]) -> <span class="ty">i32</span> {
    <span class="kw">let</span> (b, m_mod) = (<span class="nm">256i64</span>, <span class="nm">101i64</span>);
    <span class="kw">let</span> (m, n) = (pat.<span class="fn">len</span>(), text.<span class="fn">len</span>());
    <span class="kw">if</span> m > n { <span class="kw">return</span> -<span class="nm">1</span>; }
    <span class="kw">let mut</span> h = <span class="nm">1i64</span>;
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="nm">0</span>..m - <span class="nm">1</span> { h = (h * b) % m_mod; }
    <span class="kw">let</span> (<span class="kw">mut</span> pat_h, <span class="kw">mut</span> win_h) = (<span class="nm">0i64</span>, <span class="nm">0i64</span>);
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..m {
        pat_h = (b * pat_h + pat[i] <span class="kw">as</span> <span class="ty">i64</span>) % m_mod;
        win_h = (b * win_h + text[i] <span class="kw">as</span> <span class="ty">i64</span>) % m_mod;
    }
    <span class="kw">for</span> s <span class="kw">in</span> <span class="nm">0</span>..=n - m {
        <span class="kw">if</span> pat_h == win_h && &text[s..s + m] == pat { <span class="kw">return</span> s <span class="kw">as</span> <span class="ty">i32</span>; }
        <span class="kw">if</span> s < n - m {
            win_h = (b * (win_h - text[s] <span class="kw">as</span> <span class="ty">i64</span> * h) + text[s + m] <span class="kw">as</span> <span class="ty">i64</span>) % m_mod;
            <span class="kw">if</span> win_h < <span class="nm">0</span> { win_h += m_mod; }
        }
    }
    -<span class="nm">1</span>
}`,
    nqueens: `<span class="kw">fn</span> <span class="fn">is_safe</span>(board: &[<span class="ty">i32</span>], row: <span class="ty">i32</span>, col: <span class="ty">usize</span>) -> <span class="ty">bool</span> {
    <span class="kw">for</span> c <span class="kw">in</span> <span class="nm">0</span>..col {
        <span class="kw">let</span> r = board[c];
        <span class="kw">if</span> r == row || (r - row).<span class="fn">abs</span>() == (col - c) <span class="kw">as</span> <span class="ty">i32</span> { <span class="kw">return</span> <span class="kw">false</span>; }
    }
    <span class="kw">true</span>
}

<span class="kw">fn</span> <span class="fn">place</span>(board: &<span class="kw">mut</span> <span class="ty">Vec</span>&lt;<span class="ty">i32</span>&gt;, col: <span class="ty">usize</span>, n: <span class="ty">usize</span>) -> <span class="ty">bool</span> {
    <span class="kw">if</span> col == n { <span class="kw">return</span> <span class="kw">true</span>; }
    <span class="kw">for</span> row <span class="kw">in</span> <span class="nm">0</span>..n <span class="kw">as</span> <span class="ty">i32</span> {
        <span class="kw">if</span> <span class="fn">is_safe</span>(board, row, col) {
            board[col] = row;
            <span class="kw">if</span> <span class="fn">place</span>(board, col + <span class="nm">1</span>, n) { <span class="kw">return</span> <span class="kw">true</span>; }
            board[col] = -<span class="nm">1</span>;
        }
    }
    <span class="kw">false</span>
}`,
    ternary: `<span class="kw">fn</span> <span class="fn">ternary_search</span>(arr: &[<span class="ty">i32</span>], target: <span class="ty">i32</span>) -> <span class="ty">i32</span> {
    <span class="kw">let</span> (<span class="kw">mut</span> lo, <span class="kw">mut</span> hi) = (<span class="nm">0i32</span>, arr.<span class="fn">len</span>() <span class="kw">as</span> <span class="ty">i32</span> - <span class="nm">1</span>);
    <span class="kw">while</span> lo <= hi {
        <span class="kw">let</span> third = (hi - lo) / <span class="nm">3</span>;
        <span class="kw">let</span> (m1, m2) = (lo + third, hi - third);
        <span class="kw">if</span> arr[m1 <span class="kw">as</span> <span class="ty">usize</span>] == target { <span class="kw">return</span> m1; }
        <span class="kw">if</span> arr[m2 <span class="kw">as</span> <span class="ty">usize</span>] == target { <span class="kw">return</span> m2; }
        <span class="kw">if</span> target < arr[m1 <span class="kw">as</span> <span class="ty">usize</span>] { hi = m1 - <span class="nm">1</span>; }
        <span class="kw">else if</span> target > arr[m2 <span class="kw">as</span> <span class="ty">usize</span>] { lo = m2 + <span class="nm">1</span>; }
        <span class="kw">else</span> { lo = m1 + <span class="nm">1</span>; hi = m2 - <span class="nm">1</span>; }
    }
    -<span class="nm">1</span>
}`,
    lcs: `<span class="kw">fn</span> <span class="fn">lcs</span>(a: &[<span class="ty">u8</span>], b: &[<span class="ty">u8</span>]) -> <span class="ty">usize</span> {
    <span class="kw">let</span> (m, n) = (a.<span class="fn">len</span>(), b.<span class="fn">len</span>());
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="fn">vec!</span>[<span class="nm">0</span>; n + <span class="nm">1</span>]; m + <span class="nm">1</span>];
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..=m {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">1</span>..=n {
            dp[i][j] = <span class="kw">if</span> a[i - <span class="nm">1</span>] == b[j - <span class="nm">1</span>] {
                dp[i - <span class="nm">1</span>][j - <span class="nm">1</span>] + <span class="nm">1</span>
            } <span class="kw">else</span> {
                dp[i - <span class="nm">1</span>][j].<span class="fn">max</span>(dp[i][j - <span class="nm">1</span>])
            };
        }
    }
    dp[m][n]
}`,
    lis: `<span class="kw">fn</span> <span class="fn">lis</span>(arr: &[<span class="ty">i32</span>]) -> <span class="ty">usize</span> {
    <span class="kw">if</span> arr.<span class="fn">is_empty</span>() { <span class="kw">return</span> <span class="nm">0</span>; }
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="nm">1</span>; arr.<span class="fn">len</span>()];
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..arr.<span class="fn">len</span>() {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..i {
            <span class="kw">if</span> arr[j] < arr[i] { dp[i] = dp[i].<span class="fn">max</span>(dp[j] + <span class="nm">1</span>); }
        }
    }
    *dp.<span class="fn">iter</span>().<span class="fn">max</span>().<span class="fn">unwrap</span>()
}`,
    bubble: `<span class="kw">fn</span> <span class="fn">bubble_sort</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">len</span>();
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..n-<span class="nm">1</span> {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..n-i-<span class="nm">1</span> {
            <span class="kw">if</span> arr[j] > arr[j+<span class="nm">1</span>] {
                arr.<span class="fn">swap</span>(j, j+<span class="nm">1</span>);
            }
        }
    }
}`,
    selection: `<span class="kw">fn</span> <span class="fn">selection_sort</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">len</span>();
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..n-<span class="nm">1</span> {
        <span class="kw">let mut</span> min_idx = i;
        <span class="kw">for</span> j <span class="kw">in</span> i+<span class="nm">1</span>..n {
            <span class="kw">if</span> arr[j] < arr[min_idx] {
                min_idx = j;
            }
        }
        <span class="kw">if</span> min_idx != i {
            arr.<span class="fn">swap</span>(i, min_idx);
        }
    }
}`,
    insertion: `<span class="kw">fn</span> <span class="fn">insertion_sort</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>]) {
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..arr.<span class="fn">len</span>() {
        <span class="kw">let</span> key = arr[i];
        <span class="kw">let mut</span> j = i;
        <span class="kw">while</span> j > <span class="nm">0</span> && arr[j-<span class="nm">1</span>] > key {
            arr[j] = arr[j-<span class="nm">1</span>];
            j -= <span class="nm">1</span>;
        }
        arr[j] = key;
    }
}`,
    shell: `<span class="kw">fn</span> <span class="fn">shell_sort</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">len</span>();
    <span class="kw">let mut</span> gap = n / <span class="nm">2</span>;
    <span class="kw">while</span> gap > <span class="nm">0</span> {
        <span class="kw">for</span> i <span class="kw">in</span> gap..n {
            <span class="kw">let</span> temp = arr[i];
            <span class="kw">let mut</span> j = i;
            <span class="kw">while</span> j >= gap && arr[j - gap] > temp {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
        gap /= <span class="nm">2</span>;
    }
}`,
    quick: `<span class="kw">fn</span> <span class="fn">quick_sort</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>]) {
    <span class="kw">if</span> arr.<span class="fn">len</span>() <= <span class="nm">1</span> {
        <span class="kw">return</span>;
    }
    <span class="kw">let</span> len = arr.<span class="fn">len</span>();
    <span class="kw">let</span> pivot = arr[len - <span class="nm">1</span>];
    <span class="kw">let mut</span> i = <span class="nm">0</span>;
    <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..len-<span class="nm">1</span> {
        <span class="kw">if</span> arr[j] <= pivot {
            arr.<span class="fn">swap</span>(i, j);
            i += <span class="nm">1</span>;
        }
    }
    arr.<span class="fn">swap</span>(i, len - <span class="nm">1</span>);
    <span class="kw">let</span> (left, right) = arr.<span class="fn">split_at_mut</span>(i);
    <span class="fn">quick_sort</span>(left);
    <span class="fn">quick_sort</span>(&<span class="kw">mut</span> right[<span class="nm">1</span>..]);
}`,
    merge: `<span class="kw">fn</span> <span class="fn">merge_sort</span>(arr: &[<span class="ty">i32</span>]) -> <span class="ty">Vec</span><<span class="ty">i32</span>> {
    <span class="kw">if</span> arr.<span class="fn">len</span>() <= <span class="nm">1</span> {
        <span class="kw">return</span> arr.<span class="fn">to_vec</span>();
    }
    <span class="kw">let</span> mid = arr.<span class="fn">len</span>() / <span class="nm">2</span>;
    <span class="kw">let</span> left = <span class="fn">merge_sort</span>(&arr[..mid]);
    <span class="kw">let</span> right = <span class="fn">merge_sort</span>(&arr[mid..]);
    <span class="fn">merge</span>(&left, &right)
}

<span class="kw">fn</span> <span class="fn">merge</span>(left: &[<span class="ty">i32</span>], right: &[<span class="ty">i32</span>]) -> <span class="ty">Vec</span><<span class="ty">i32</span>> {
    <span class="kw">let mut</span> result = <span class="ty">Vec</span>::<span class="fn">with_capacity</span>(left.<span class="fn">len</span>() + right.<span class="fn">len</span>());
    <span class="kw">let</span> (<span class="kw">mut</span> i, <span class="kw">mut</span> j) = (<span class="nm">0</span>, <span class="nm">0</span>);
    <span class="kw">while</span> i < left.<span class="fn">len</span>() && j < right.<span class="fn">len</span>() {
        <span class="kw">if</span> left[i] <= right[j] {
            result.<span class="fn">push</span>(left[i]);
            i += <span class="nm">1</span>;
        } <span class="kw">else</span> {
            result.<span class="fn">push</span>(right[j]);
            j += <span class="nm">1</span>;
        }
    }
    result.<span class="fn">extend_from_slice</span>(&left[i..]);
    result.<span class="fn">extend_from_slice</span>(&right[j..]);
    result
}`,
    heap: `<span class="kw">fn</span> <span class="fn">heap_sort</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">len</span>();
    <span class="kw">for</span> i <span class="kw">in</span> (<span class="nm">0</span>..n/<span class="nm">2</span>).<span class="fn">rev</span>() {
        <span class="fn">heapify</span>(arr, n, i);
    }
    <span class="kw">for</span> i <span class="kw">in</span> (<span class="nm">1</span>..n).<span class="fn">rev</span>() {
        arr.<span class="fn">swap</span>(<span class="nm">0</span>, i);
        <span class="fn">heapify</span>(arr, i, <span class="nm">0</span>);
    }
}

<span class="kw">fn</span> <span class="fn">heapify</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>], n: <span class="ty">usize</span>, i: <span class="ty">usize</span>) {
    <span class="kw">let mut</span> largest = i;
    <span class="kw">let</span> (l, r) = (<span class="nm">2</span>*i + <span class="nm">1</span>, <span class="nm">2</span>*i + <span class="nm">2</span>);
    <span class="kw">if</span> l < n && arr[l] > arr[largest] { largest = l; }
    <span class="kw">if</span> r < n && arr[r] > arr[largest] { largest = r; }
    <span class="kw">if</span> largest != i {
        arr.<span class="fn">swap</span>(i, largest);
        <span class="fn">heapify</span>(arr, n, largest);
    }
}`,
    radix: `<span class="kw">fn</span> <span class="fn">radix_sort</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>]) {
    <span class="kw">let</span> max_val = *arr.<span class="fn">iter</span>().<span class="fn">max</span>().<span class="fn">unwrap</span>();
    <span class="kw">let mut</span> exp = <span class="nm">1</span>;
    <span class="kw">while</span> max_val / exp > <span class="nm">0</span> {
        <span class="fn">counting_sort</span>(arr, exp);
        exp *= <span class="nm">10</span>;
    }
}

<span class="kw">fn</span> <span class="fn">counting_sort</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>], exp: <span class="ty">i32</span>) {
    <span class="kw">let</span> n = arr.<span class="fn">len</span>();
    <span class="kw">let mut</span> output = <span class="fn">vec!</span>[<span class="nm">0</span>; n];
    <span class="kw">let mut</span> count = [<span class="nm">0</span>; <span class="nm">10</span>];
    <span class="kw">for</span> &val <span class="kw">in</span> arr.<span class="fn">iter</span>() {
        count[((val / exp) % <span class="nm">10</span>) <span class="kw">as</span> <span class="ty">usize</span>] += <span class="nm">1</span>;
    }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..<span class="nm">10</span> { count[i] += count[i-<span class="nm">1</span>]; }
    <span class="kw">for</span> i <span class="kw">in</span> (<span class="nm">0</span>..n).<span class="fn">rev</span>() {
        <span class="kw">let</span> idx = ((arr[i] / exp) % <span class="nm">10</span>) <span class="kw">as</span> <span class="ty">usize</span>;
        count[idx] -= <span class="nm">1</span>;
        output[count[idx]] = arr[i];
    }
    arr.<span class="fn">copy_from_slice</span>(&output);
}`,
    counting: `<span class="kw">fn</span> <span class="fn">counting_sort</span>(arr: &[<span class="ty">usize</span>]) -> <span class="ty">Vec</span><<span class="ty">usize</span>> {
    <span class="kw">let</span> max = *arr.<span class="fn">iter</span>().<span class="fn">max</span>().<span class="fn">unwrap</span>();
    <span class="kw">let mut</span> count = <span class="fn">vec!</span>[<span class="nm">0usize</span>; max + <span class="nm">1</span>];
    <span class="kw">let mut</span> output = <span class="fn">vec!</span>[<span class="nm">0</span>; arr.<span class="fn">len</span>()];
    <span class="kw">for</span> &x <span class="kw">in</span> arr { count[x] += <span class="nm">1</span>; }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..=max { count[i] += count[i - <span class="nm">1</span>]; }
    <span class="kw">for</span> &x <span class="kw">in</span> arr.<span class="fn">iter</span>().<span class="fn">rev</span>() {
        count[x] -= <span class="nm">1</span>;
        output[count[x]] = x;
    }
    output
}`,
    timsort: `<span class="kw">const</span> MIN_RUN: <span class="ty">usize</span> = <span class="nm">32</span>;

<span class="kw">fn</span> <span class="fn">insertion_sort_range</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>], lo: <span class="ty">usize</span>, hi: <span class="ty">usize</span>) {
    <span class="kw">for</span> i <span class="kw">in</span> lo + <span class="nm">1</span>..=hi {
        <span class="kw">let</span> key = arr[i];
        <span class="kw">let mut</span> j = i;
        <span class="kw">while</span> j > lo && arr[j - <span class="nm">1</span>] > key {
            arr[j] = arr[j - <span class="nm">1</span>];
            j -= <span class="nm">1</span>;
        }
        arr[j] = key;
    }
}

<span class="kw">fn</span> <span class="fn">merge</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>], lo: <span class="ty">usize</span>, mid: <span class="ty">usize</span>, hi: <span class="ty">usize</span>) {
    <span class="kw">let</span> left = arr[lo..=mid].<span class="fn">to_vec</span>();
    <span class="kw">let</span> right = arr[mid + <span class="nm">1</span>..=hi].<span class="fn">to_vec</span>();
    <span class="kw">let</span> (<span class="kw">mut</span> i, <span class="kw">mut</span> j, <span class="kw">mut</span> k) = (<span class="nm">0</span>, <span class="nm">0</span>, lo);

    <span class="kw">while</span> i < left.<span class="fn">len</span>() && j < right.<span class="fn">len</span>() {
        <span class="kw">if</span> left[i] <= right[j] {
            arr[k] = left[i];
            i += <span class="nm">1</span>;
        } <span class="kw">else</span> {
            arr[k] = right[j];
            j += <span class="nm">1</span>;
        }
        k += <span class="nm">1</span>;
    }
    <span class="kw">while</span> i < left.<span class="fn">len</span>() {
        arr[k] = left[i];
        i += <span class="nm">1</span>; k += <span class="nm">1</span>;
    }
    <span class="kw">while</span> j < right.<span class="fn">len</span>() {
        arr[k] = right[j];
        j += <span class="nm">1</span>; k += <span class="nm">1</span>;
    }
}

<span class="kw">fn</span> <span class="fn">tim_sort</span>(arr: &<span class="kw">mut</span> [<span class="ty">i32</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">len</span>();

    <span class="kw">let mut</span> i = <span class="nm">0</span>;
    <span class="kw">while</span> i < n {
        <span class="kw">let</span> hi = (i + MIN_RUN - <span class="nm">1</span>).<span class="fn">min</span>(n - <span class="nm">1</span>);
        <span class="fn">insertion_sort_range</span>(arr, i, hi);
        i += MIN_RUN;
    }

    <span class="kw">let mut</span> size = MIN_RUN;
    <span class="kw">while</span> size < n {
        <span class="kw">let mut</span> lo = <span class="nm">0</span>;
        <span class="kw">while</span> lo < n {
            <span class="kw">let</span> mid = (lo + size - <span class="nm">1</span>).<span class="fn">min</span>(n - <span class="nm">1</span>);
            <span class="kw">let</span> hi  = (lo + <span class="nm">2</span> * size - <span class="nm">1</span>).<span class="fn">min</span>(n - <span class="nm">1</span>);
            <span class="kw">if</span> mid < hi {
                <span class="fn">merge</span>(arr, lo, mid, hi);
            }
            lo += <span class="nm">2</span> * size;
        }
        size *= <span class="nm">2</span>;
    }
}`,
    linear: `<span class="kw">fn</span> <span class="fn">linear_search</span>(arr: &[<span class="ty">i32</span>], target: <span class="ty">i32</span>) -> <span class="ty">Option</span><<span class="ty">usize</span>> {
    <span class="kw">for</span> (i, &val) <span class="kw">in</span> arr.<span class="fn">iter</span>().<span class="fn">enumerate</span>() {
        <span class="kw">if</span> val == target {
            <span class="kw">return</span> <span class="ty">Some</span>(i);
        }
    }
    <span class="ty">None</span>
}`,
    binary: `<span class="kw">fn</span> <span class="fn">binary_search</span>(arr: &[<span class="ty">i32</span>], target: <span class="ty">i32</span>) -> <span class="ty">Option</span><<span class="ty">usize</span>> {
    <span class="kw">let mut</span> lo = <span class="nm">0</span>;
    <span class="kw">let mut</span> hi = arr.<span class="fn">len</span>();
    <span class="kw">while</span> lo < hi {
        <span class="kw">let</span> mid = (lo + hi) / <span class="nm">2</span>;
        <span class="kw">if</span> arr[mid] == target {
            <span class="kw">return</span> <span class="ty">Some</span>(mid);
        } <span class="kw">else if</span> arr[mid] < target {
            lo = mid + <span class="nm">1</span>;
        } <span class="kw">else</span> {
            hi = mid;
        }
    }
    <span class="ty">None</span>
}`,
    jump: `<span class="kw">fn</span> <span class="fn">jump_search</span>(arr: &[<span class="ty">i32</span>], target: <span class="ty">i32</span>) -> <span class="ty">Option</span><<span class="ty">usize</span>> {
    <span class="kw">let</span> n = arr.<span class="fn">len</span>();
    <span class="kw">let</span> step = (<span class="fn">sqrt</span>(n <span class="kw">as</span> <span class="ty">f64</span>) <span class="kw">as</span> <span class="ty">usize</span>).<span class="fn">max</span>(<span class="nm">1</span>);
    <span class="kw">let mut</span> prev = <span class="nm">0</span>;
    <span class="kw">while</span> arr[step.<span class="fn">min</span>(n)-<span class="nm">1</span>] < target {
        prev = step;
        <span class="kw">let</span> next_step = step + (<span class="fn">sqrt</span>(n <span class="kw">as</span> <span class="ty">f64</span>) <span class="kw">as</span> <span class="ty">usize</span>);
        <span class="kw">if</span> prev >= n { <span class="kw">return</span> <span class="ty">None</span>; }
    }
    <span class="kw">while</span> arr[prev] < target {
        prev += <span class="nm">1</span>;
        <span class="kw">if</span> prev == step.<span class="fn">min</span>(n) { <span class="kw">return</span> <span class="ty">None</span>; }
    }
    <span class="kw">if</span> arr[prev] == target { <span class="ty">Some</span>(prev) } <span class="kw">else</span> { <span class="ty">None</span> }
}`,
    interpolation: `<span class="kw">fn</span> <span class="fn">interpolation_search</span>(arr: &[<span class="ty">i32</span>], target: <span class="ty">i32</span>) -> <span class="ty">Option</span><<span class="ty">usize</span>> {
    <span class="kw">let mut</span> lo = <span class="nm">0</span>;
    <span class="kw">let mut</span> hi = arr.<span class="fn">len</span>() - <span class="nm">1</span>;
    <span class="kw">while</span> lo <= hi && target >= arr[lo] && target <= arr[hi] {
        <span class="kw">if</span> lo == hi {
            <span class="kw">return</span> <span class="kw">if</span> arr[lo] == target { <span class="ty">Some</span>(lo) } <span class="kw">else</span> { <span class="ty">None</span> };
        }
        <span class="kw">let</span> pos = lo + ((target - arr[lo]) <span class="kw">as</span> <span class="ty">usize</span> * (hi - lo)) / (arr[hi] - arr[lo]) <span class="kw">as</span> <span class="ty">usize</span>;
        <span class="kw">if</span> arr[pos] == target { <span class="kw">return</span> <span class="ty">Some</span>(pos); }
        <span class="kw">if</span> arr[pos] < target { lo = pos + <span class="nm">1</span>; } <span class="kw">else</span> { hi = pos - <span class="nm">1</span>; }
    }
    <span class="ty">None</span>
}`,
    exponential: `<span class="kw">fn</span> <span class="fn">exponential_search</span>(arr: &[<span class="ty">i32</span>], target: <span class="ty">i32</span>) -> <span class="ty">Option</span><<span class="ty">usize</span>> {
    <span class="kw">if</span> arr[<span class="nm">0</span>] == target { <span class="kw">return</span> <span class="ty">Some</span>(<span class="nm">0</span>); }
    <span class="kw">let mut</span> i = <span class="nm">1</span>;
    <span class="kw">while</span> i < arr.<span class="fn">len</span>() && arr[i] <= target { i *= <span class="nm">2</span>; }
    <span class="fn">binary_search</span>(&arr[i/<span class="nm">2</span>..i.<span class="fn">min</span>(arr.<span class="fn">len</span>())], target)
        .<span class="fn">map</span>(|idx| idx + i/<span class="nm">2</span>)
}`,
    bfs: `<span class="kw">fn</span> <span class="fn">bfs</span>(graph: &[<span class="ty">Vec</span><<span class="ty">usize</span>>], start: <span class="ty">usize</span>) {
    <span class="kw">let mut</span> visited = <span class="fn">vec!</span>[<span class="kw">false</span>; graph.<span class="fn">len</span>()];
    <span class="kw">let mut</span> queue = <span class="ty">VecDeque</span>::<span class="fn">new</span>();
    queue.<span class="fn">push_back</span>(start);
    visited[start] = <span class="kw">true</span>;
    <span class="kw">while</span> <span class="kw">let</span> <span class="ty">Some</span>(node) = queue.<span class="fn">pop_front</span>() {
        <span class="kw">for</span> &neighbor <span class="kw">in</span> &graph[node] {
            <span class="kw">if</span> !visited[neighbor] {
                visited[neighbor] = <span class="kw">true</span>;
                queue.<span class="fn">push_back</span>(neighbor);
            }
        }
    }
}`,
    dfs: `<span class="kw">fn</span> <span class="fn">dfs</span>(graph: &[<span class="ty">Vec</span><<span class="ty">usize</span>>], start: <span class="ty">usize</span>, visited: &<span class="kw">mut</span> [<span class="ty">bool</span>]) {
    visited[start] = <span class="kw">true</span>;
    <span class="kw">for</span> &neighbor <span class="kw">in</span> &graph[start] {
        <span class="kw">if</span> !visited[neighbor] {
            <span class="fn">dfs</span>(graph, neighbor, visited);
        }
    }
}`,
    dijkstra: `<span class="kw">use</span> std::collections::BinaryHeap;
<span class="kw">use</span> std::cmp::Reverse;

<span class="kw">fn</span> <span class="fn">dijkstra</span>(graph: &[<span class="ty">Vec</span><(<span class="ty">usize</span>, <span class="ty">u64</span>)>], src: <span class="ty">usize</span>) -> <span class="ty">Vec</span><<span class="ty">u64</span>> {
    <span class="kw">let mut</span> dist = <span class="fn">vec!</span>[<span class="ty">u64</span>::MAX; graph.<span class="fn">len</span>()];
    dist[src] = <span class="nm">0</span>;
    <span class="kw">let mut</span> pq = BinaryHeap::<span class="fn">new</span>();
    pq.<span class="fn">push</span>(Reverse((<span class="nm">0u64</span>, src)));
    <span class="kw">while let</span> Some(Reverse((d, u))) = pq.<span class="fn">pop</span>() {
        <span class="kw">if</span> d > dist[u] { <span class="kw">continue</span>; }
        <span class="kw">for</span> &(v, w) <span class="kw">in</span> &graph[u] {
            <span class="kw">let</span> nd = dist[u] + w;
            <span class="kw">if</span> nd < dist[v] { dist[v] = nd; pq.<span class="fn">push</span>(Reverse((nd, v))); }
        }
    }
    dist
}`,
    fib: `<span class="kw">fn</span> <span class="fn">fibonacci</span>(n: <span class="ty">usize</span>) -> <span class="ty">usize</span> {
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="nm">0</span>; n + <span class="nm">1</span>];
    <span class="kw">if</span> n >= <span class="nm">1</span> { dp[<span class="nm">1</span>] = <span class="nm">1</span>; }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">2</span>..=n {
        dp[i] = dp[i-<span class="nm">1</span>] + dp[i-<span class="nm">2</span>];
    }
    dp[n]
}`,
    knapsack: `<span class="kw">fn</span> <span class="fn">knapsack</span>(wt: &[<span class="ty">usize</span>], val: &[<span class="ty">usize</span>], w: <span class="ty">usize</span>) -> <span class="ty">usize</span> {
    <span class="kw">let</span> n = wt.<span class="fn">len</span>();
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="fn">vec!</span>[<span class="nm">0</span>; w + <span class="nm">1</span>]; n + <span class="nm">1</span>];
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..=n {
        <span class="kw">for</span> cap <span class="kw">in</span> <span class="nm">0</span>..=w {
            <span class="kw">if</span> wt[i-<span class="nm">1</span>] <= cap {
                dp[i][cap] = dp[i-<span class="nm">1</span>][cap]
                    .<span class="fn">max</span>(val[i-<span class="nm">1</span>] + dp[i-<span class="nm">1</span>][cap-wt[i-<span class="nm">1</span>]]);
            } <span class="kw">else</span> {
                dp[i][cap] = dp[i-<span class="nm">1</span>][cap];
            }
        }
    }
    dp[n][w]
}`,
    bellmanFord: `<span class="kw">fn</span> <span class="fn">bellman_ford</span>(edges: &[[<span class="ty">i32</span>; <span class="nm">3</span>]], n: <span class="ty">usize</span>, src: <span class="ty">usize</span>) -> <span class="ty">Vec</span><<span class="ty">i32</span>> {
    <span class="kw">let mut</span> dist = <span class="fn">vec!</span>[<span class="ty">i32</span>::MAX; n];
    dist[src] = <span class="nm">0</span>;
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="nm">0</span>..n - <span class="nm">1</span> {
        <span class="kw">let mut</span> updated = <span class="kw">false</span>;
        <span class="kw">for</span> e <span class="kw">in</span> edges {
            <span class="kw">let</span> (u, v, w) = (e[<span class="nm">0</span>] <span class="kw">as</span> <span class="ty">usize</span>, e[<span class="nm">1</span>] <span class="kw">as</span> <span class="ty">usize</span>, e[<span class="nm">2</span>]);
            <span class="kw">if</span> dist[u] != <span class="ty">i32</span>::MAX && dist[u] + w < dist[v] {
                dist[v] = dist[u] + w;
                updated = <span class="kw">true</span>;
            }
        }
        <span class="kw">if</span> !updated { <span class="kw">break</span>; }
    }
    dist
}`,
    astar: `<span class="kw">use</span> std::collections::<span class="ty">BinaryHeap</span>;
<span class="kw">use</span> std::cmp::<span class="ty">Reverse</span>;

<span class="kw">fn</span> <span class="fn">a_star</span>(graph: &[<span class="ty">Vec</span><(<span class="ty">usize</span>, <span class="ty">i32</span>)>], src: <span class="ty">usize</span>, goal: <span class="ty">usize</span>,
          h: <span class="kw">impl</span> <span class="ty">Fn</span>(<span class="ty">usize</span>) -> <span class="ty">i32</span>) -> <span class="ty">i32</span> {
    <span class="kw">let</span> n = graph.<span class="fn">len</span>();
    <span class="kw">let mut</span> g = <span class="fn">vec!</span>[<span class="ty">i32</span>::MAX; n];
    g[src] = <span class="nm">0</span>;
    <span class="kw">let mut</span> visited = <span class="fn">vec!</span>[<span class="kw">false</span>; n];
    <span class="kw">let mut</span> pq = <span class="ty">BinaryHeap</span>::<span class="fn">new</span>();
    pq.<span class="fn">push</span>(<span class="ty">Reverse</span>((<span class="fn">h</span>(src), src)));
    <span class="kw">while let</span> <span class="ty">Some</span>(<span class="ty">Reverse</span>((_, u))) = pq.<span class="fn">pop</span>() {
        <span class="kw">if</span> visited[u] { <span class="kw">continue</span>; }
        visited[u] = <span class="kw">true</span>;
        <span class="kw">if</span> u == goal { <span class="kw">return</span> g[goal]; }
        <span class="kw">for</span> &(v, w) <span class="kw">in</span> &graph[u] {
            <span class="kw">let</span> tg = g[u] + w;
            <span class="kw">if</span> tg < g[v] {
                g[v] = tg;
                pq.<span class="fn">push</span>(<span class="ty">Reverse</span>((tg + <span class="fn">h</span>(v), v)));
            }
        }
    }
    -<span class="nm">1</span>
}`,
    toposort: `<span class="kw">fn</span> <span class="fn">dfs_topo</span>(graph: &[<span class="ty">Vec</span><<span class="ty">usize</span>>], u: <span class="ty">usize</span>,
             visited: &<span class="kw">mut</span> <span class="ty">Vec</span><<span class="ty">bool</span>>, order: &<span class="kw">mut</span> <span class="ty">Vec</span><<span class="ty">usize</span>>) {
    visited[u] = <span class="kw">true</span>;
    <span class="kw">for</span> &v <span class="kw">in</span> &graph[u] {
        <span class="kw">if</span> !visited[v] { <span class="fn">dfs_topo</span>(graph, v, visited, order); }
    }
    order.<span class="fn">push</span>(u);
}

<span class="kw">fn</span> <span class="fn">topo_sort</span>(graph: &[<span class="ty">Vec</span><<span class="ty">usize</span>>], n: <span class="ty">usize</span>) -> <span class="ty">Vec</span><<span class="ty">usize</span>> {
    <span class="kw">let mut</span> visited = <span class="fn">vec!</span>[<span class="kw">false</span>; n];
    <span class="kw">let mut</span> order = <span class="ty">Vec</span>::<span class="fn">new</span>();
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..n {
        <span class="kw">if</span> !visited[i] { <span class="fn">dfs_topo</span>(graph, i, &<span class="kw">mut</span> visited, &<span class="kw">mut</span> order); }
    }
    order.<span class="fn">reverse</span>();
    order
}`,
    floydWarshall: `<span class="kw">fn</span> <span class="fn">floyd_warshall</span>(dp: &<span class="kw">mut</span> <span class="ty">Vec</span><<span class="ty">Vec</span><<span class="ty">i32</span>>>) {
    <span class="kw">let</span> n = dp.<span class="fn">len</span>();
    <span class="kw">for</span> k <span class="kw">in</span> <span class="nm">0</span>..n {
        <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..n {
            <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..n {
                <span class="kw">if</span> dp[i][k] != <span class="ty">i32</span>::MAX && dp[k][j] != <span class="ty">i32</span>::MAX {
                    <span class="kw">let</span> via = dp[i][k] + dp[k][j];
                    <span class="kw">if</span> via < dp[i][j] { dp[i][j] = via; }
                }
            }
        }
    }
}`,
    prim: `<span class="kw">use</span> std::collections::<span class="ty">BinaryHeap</span>;
<span class="kw">use</span> std::cmp::<span class="ty">Reverse</span>;

<span class="kw">fn</span> <span class="fn">prim</span>(graph: &[<span class="ty">Vec</span><(<span class="ty">usize</span>, <span class="ty">i32</span>)>], n: <span class="ty">usize</span>) -> <span class="ty">i32</span> {
    <span class="kw">let mut</span> in_mst = <span class="fn">vec!</span>[<span class="kw">false</span>; n];
    <span class="kw">let mut</span> key = <span class="fn">vec!</span>[<span class="ty">i32</span>::MAX; n];
    key[<span class="nm">0</span>] = <span class="nm">0</span>;
    <span class="kw">let mut</span> pq = <span class="ty">BinaryHeap</span>::<span class="fn">new</span>();
    pq.<span class="fn">push</span>(<span class="ty">Reverse</span>((<span class="nm">0i32</span>, <span class="nm">0usize</span>)));
    <span class="kw">let mut</span> cost = <span class="nm">0</span>;
    <span class="kw">while let</span> <span class="ty">Some</span>(<span class="ty">Reverse</span>((w, u))) = pq.<span class="fn">pop</span>() {
        <span class="kw">if</span> in_mst[u] { <span class="kw">continue</span>; }
        in_mst[u] = <span class="kw">true</span>;
        cost += w;
        <span class="kw">for</span> &(v, wt) <span class="kw">in</span> &graph[u] {
            <span class="kw">if</span> !in_mst[v] && wt < key[v] {
                key[v] = wt;
                pq.<span class="fn">push</span>(<span class="ty">Reverse</span>((wt, v)));
            }
        }
    }
    cost
}`,
    kruskal: `<span class="kw">fn</span> <span class="fn">find</span>(parent: &<span class="kw">mut</span> <span class="ty">Vec</span><<span class="ty">usize</span>>, x: <span class="ty">usize</span>) -> <span class="ty">usize</span> {
    <span class="kw">if</span> parent[x] != x { parent[x] = <span class="fn">find</span>(parent, parent[x]); }
    parent[x]
}

<span class="kw">fn</span> <span class="fn">kruskal</span>(edges: &<span class="kw">mut</span> <span class="ty">Vec</span><(<span class="ty">i32</span>, <span class="ty">usize</span>, <span class="ty">usize</span>)>, n: <span class="ty">usize</span>) -> <span class="ty">i32</span> {
    edges.<span class="fn">sort</span>();
    <span class="kw">let mut</span> parent: <span class="ty">Vec</span><<span class="ty">usize</span>> = (<span class="nm">0</span>..n).<span class="fn">collect</span>();
    <span class="kw">let mut</span> cost = <span class="nm">0</span>;
    <span class="kw">for</span> &(w, u, v) <span class="kw">in</span> edges.<span class="fn">iter</span>() {
        <span class="kw">let</span> pu = <span class="fn">find</span>(&<span class="kw">mut</span> parent, u);
        <span class="kw">let</span> pv = <span class="fn">find</span>(&<span class="kw">mut</span> parent, v);
        <span class="kw">if</span> pu != pv { parent[pu] = pv; cost += w; }
    }
    cost
}`,
    coinChange: `<span class="kw">fn</span> <span class="fn">coin_change</span>(coins: &[<span class="ty">i32</span>], amount: <span class="ty">usize</span>) -> <span class="ty">i32</span> {
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="ty">i32</span>::MAX; amount + <span class="nm">1</span>];
    dp[<span class="nm">0</span>] = <span class="nm">0</span>;
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..=amount {
        <span class="kw">for</span> &c <span class="kw">in</span> coins {
            <span class="kw">let</span> c = c <span class="kw">as</span> <span class="ty">usize</span>;
            <span class="kw">if</span> c <= i && dp[i - c] != <span class="ty">i32</span>::MAX {
                dp[i] = dp[i].<span class="fn">min</span>(dp[i - c] + <span class="nm">1</span>);
            }
        }
    }
    <span class="kw">if</span> dp[amount] == <span class="ty">i32</span>::MAX { -<span class="nm">1</span> } <span class="kw">else</span> { dp[amount] }
}
`,
    editDistance: `<span class="kw">fn</span> <span class="fn">edit_distance</span>(a: &<span class="ty">str</span>, b: &<span class="ty">str</span>) -> <span class="ty">usize</span> {
    <span class="kw">let</span> (a, b): (<span class="ty">Vec</span><_>, <span class="ty">Vec</span><_>) = (a.<span class="fn">bytes</span>().<span class="fn">collect</span>(), b.<span class="fn">bytes</span>().<span class="fn">collect</span>());
    <span class="kw">let</span> (m, n) = (a.<span class="fn">len</span>(), b.<span class="fn">len</span>());
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="fn">vec!</span>[<span class="nm">0usize</span>; n + <span class="nm">1</span>]; m + <span class="nm">1</span>];
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..=m { dp[i][<span class="nm">0</span>] = i; }
    <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..=n { dp[<span class="nm">0</span>][j] = j; }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..=m {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">1</span>..=n {
            dp[i][j] = <span class="kw">if</span> a[i-<span class="nm">1</span>] == b[j-<span class="nm">1</span>] {
                dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>]
            } <span class="kw">else</span> {
                <span class="nm">1</span> + dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>].<span class="fn">min</span>(dp[i-<span class="nm">1</span>][j]).<span class="fn">min</span>(dp[i][j-<span class="nm">1</span>])
            };
        }
    }
    dp[m][n]
}
`,
    matrixChain: `<span class="kw">fn</span> <span class="fn">matrix_chain</span>(dims: &[<span class="ty">usize</span>]) -> <span class="ty">usize</span> {
    <span class="kw">let</span> n = dims.<span class="fn">len</span>() - <span class="nm">1</span>;
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="fn">vec!</span>[<span class="nm">0usize</span>; n]; n];
    <span class="kw">for</span> length <span class="kw">in</span> <span class="nm">2</span>..=n {
        <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..=n - length {
            <span class="kw">let</span> j = i + length - <span class="nm">1</span>;
            dp[i][j] = <span class="ty">usize</span>::MAX;
            <span class="kw">for</span> k <span class="kw">in</span> i..j {
                <span class="kw">let</span> cost = dp[i][k] + dp[k+<span class="nm">1</span>][j]
                          + dims[i] * dims[k+<span class="nm">1</span>] * dims[j+<span class="nm">1</span>];
                <span class="kw">if</span> cost < dp[i][j] { dp[i][j] = cost; }
            }
        }
    }
    dp[<span class="nm">0</span>][n-<span class="nm">1</span>]
}
`,
    rodCutting: `<span class="kw">fn</span> <span class="fn">rod_cutting</span>(prices: &[<span class="ty">i32</span>]) -> <span class="ty">i32</span> {
    <span class="kw">let</span> n = prices.<span class="fn">len</span>();
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="nm">0i32</span>; n + <span class="nm">1</span>];
    <span class="kw">for</span> length <span class="kw">in</span> <span class="nm">1</span>..=n {
        <span class="kw">for</span> cut <span class="kw">in</span> <span class="nm">1</span>..=length {
            dp[length] = dp[length].<span class="fn">max</span>(prices[cut-<span class="nm">1</span>] + dp[length-cut]);
        }
    }
    dp[n]
}
`,
    hashChaining: `<span class="kw">struct</span> <span class="ty">HashTableChaining</span> {
    size:  <span class="ty">usize</span>,
    table: <span class="ty">Vec</span><<span class="ty">Vec</span><<span class="ty">i32</span>>>,
}

<span class="kw">impl</span> <span class="ty">HashTableChaining</span> {
    <span class="kw">fn</span> <span class="fn">new</span>(size: <span class="ty">usize</span>) -> <span class="ty">Self</span> {
        <span class="ty">Self</span> { size, table: <span class="fn">vec!</span>[<span class="fn">vec!</span>[]; size] }
    }
    <span class="kw">fn</span> <span class="fn">hash</span>(&<span class="kw">self</span>, key: <span class="ty">i32</span>) -> <span class="ty">usize</span> { (key <span class="kw">as</span> <span class="ty">usize</span>) % <span class="kw">self</span>.size }
    <span class="kw">fn</span> <span class="fn">insert</span>(&<span class="kw">mut self</span>, key: <span class="ty">i32</span>) {
        <span class="kw">let</span> h = <span class="kw">self</span>.<span class="fn">hash</span>(key);
        <span class="kw">self</span>.table[h].<span class="fn">push</span>(key);
    }
    <span class="kw">fn</span> <span class="fn">search</span>(&<span class="kw">self</span>, key: <span class="ty">i32</span>) -> <span class="ty">bool</span> {
        <span class="kw">self</span>.table[<span class="kw">self</span>.<span class="fn">hash</span>(key)].<span class="fn">contains</span>(&key)
    }
}`,
    hashLinear: `<span class="kw">struct</span> <span class="ty">HashTableLinear</span> {
    size:  <span class="ty">usize</span>,
    table: <span class="ty">Vec</span><<span class="ty">Option</span><<span class="ty">i32</span>>>,
}

<span class="kw">impl</span> <span class="ty">HashTableLinear</span> {
    <span class="kw">fn</span> <span class="fn">new</span>(size: <span class="ty">usize</span>) -> <span class="ty">Self</span> {
        <span class="ty">Self</span> { size, table: <span class="fn">vec!</span>[<span class="ty">None</span>; size] }
    }
    <span class="kw">fn</span> <span class="fn">hash</span>(&<span class="kw">self</span>, key: <span class="ty">i32</span>) -> <span class="ty">usize</span> { (key <span class="kw">as</span> <span class="ty">usize</span>) % <span class="kw">self</span>.size }
    <span class="kw">fn</span> <span class="fn">insert</span>(&<span class="kw">mut self</span>, key: <span class="ty">i32</span>) {
        <span class="kw">let mut</span> h = <span class="kw">self</span>.<span class="fn">hash</span>(key);
        <span class="kw">while self</span>.table[h].<span class="fn">is_some</span>() { h = (h + <span class="nm">1</span>) % <span class="kw">self</span>.size; }
        <span class="kw">self</span>.table[h] = <span class="ty">Some</span>(key);
    }
    <span class="kw">fn</span> <span class="fn">search</span>(&<span class="kw">self</span>, key: <span class="ty">i32</span>) -> <span class="ty">i32</span> {
        <span class="kw">let mut</span> h = <span class="kw">self</span>.<span class="fn">hash</span>(key);
        <span class="kw">while let</span> <span class="ty">Some</span>(v) = <span class="kw">self</span>.table[h] {
            <span class="kw">if</span> v == key { <span class="kw">return</span> h <span class="kw">as</span> <span class="ty">i32</span>; }
            h = (h + <span class="nm">1</span>) % <span class="kw">self</span>.size;
        }
        -<span class="nm">1</span>
    }
}`,
  },
  kotlin: {
    bst: `<span class="kw">class</span> <span class="ty">Node</span>(<span class="kw">val</span> v: <span class="ty">Int</span>) {
    <span class="kw">var</span> left: <span class="ty">Node</span>? = <span class="kw">null</span>
    <span class="kw">var</span> right: <span class="ty">Node</span>? = <span class="kw">null</span>
}

<span class="kw">fun</span> <span class="fn">insert</span>(root: <span class="ty">Node</span>?, value: <span class="ty">Int</span>): <span class="ty">Node</span> {
    <span class="kw">if</span> (root == <span class="kw">null</span>) <span class="kw">return</span> <span class="ty">Node</span>(value)
    <span class="kw">var</span> cur = root
    <span class="kw">while</span> (<span class="kw">true</span>) {
        <span class="kw">if</span> (value < cur!!.v) {
            <span class="kw">if</span> (cur.left == <span class="kw">null</span>) { cur.left = <span class="ty">Node</span>(value); <span class="kw">return</span> root }
            cur = cur.left
        } <span class="kw">else if</span> (value > cur.v) {
            <span class="kw">if</span> (cur.right == <span class="kw">null</span>) { cur.right = <span class="ty">Node</span>(value); <span class="kw">return</span> root }
            cur = cur.right
        } <span class="kw">else return</span> root
    }
}

<span class="kw">fun</span> <span class="fn">search</span>(root: <span class="ty">Node</span>?, value: <span class="ty">Int</span>): <span class="ty">Node</span>? {
    <span class="kw">var</span> cur = root
    <span class="kw">while</span> (cur != <span class="kw">null</span>) {
        <span class="kw">if</span> (value == cur.v) <span class="kw">return</span> cur
        cur = <span class="kw">if</span> (value < cur.v) cur.left <span class="kw">else</span> cur.right
    }
    <span class="kw">return</span> <span class="kw">null</span>
}`,
    kmp: `<span class="kw">fun</span> <span class="fn">buildLPS</span>(p: <span class="ty">String</span>): <span class="ty">IntArray</span> {
    <span class="kw">val</span> lps = <span class="ty">IntArray</span>(p.length)
    <span class="kw">var</span> len = <span class="nm">0</span>; <span class="kw">var</span> i = <span class="nm">1</span>
    <span class="kw">while</span> (i < p.length) {
        <span class="kw">when</span> {
            p[i] == p[len] -> { len++; lps[i] = len; i++ }
            len > <span class="nm">0</span> -> len = lps[len - <span class="nm">1</span>]
            <span class="kw">else</span> -> { lps[i] = <span class="nm">0</span>; i++ }
        }
    }
    <span class="kw">return</span> lps
}

<span class="kw">fun</span> <span class="fn">kmp</span>(text: <span class="ty">String</span>, pat: <span class="ty">String</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> lps = <span class="fn">buildLPS</span>(pat)
    <span class="kw">var</span> i = <span class="nm">0</span>; <span class="kw">var</span> j = <span class="nm">0</span>
    <span class="kw">while</span> (i < text.length) {
        <span class="kw">when</span> {
            text[i] == pat[j] -> {
                i++; j++
                <span class="kw">if</span> (j == pat.length) <span class="kw">return</span> i - j
            }
            j > <span class="nm">0</span> -> j = lps[j - <span class="nm">1</span>]
            <span class="kw">else</span> -> i++
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    rabinkarp: `<span class="kw">fun</span> <span class="fn">rabinKarp</span>(text: <span class="ty">String</span>, pat: <span class="ty">String</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> B = <span class="nm">256</span>; <span class="kw">val</span> M = <span class="nm">101</span>
    <span class="kw">val</span> m = pat.length; <span class="kw">val</span> n = text.length
    <span class="kw">if</span> (m > n) <span class="kw">return</span> -<span class="nm">1</span>
    <span class="kw">var</span> patH = <span class="nm">0</span>; <span class="kw">var</span> winH = <span class="nm">0</span>; <span class="kw">var</span> h = <span class="nm">1</span>
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span> until m - <span class="nm">1</span>) h = (h * B) % M
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span> until m) {
        patH = (B * patH + pat[i].code) % M
        winH = (B * winH + text[i].code) % M
    }
    <span class="kw">for</span> (s <span class="kw">in</span> <span class="nm">0</span>..n - m) {
        <span class="kw">if</span> (patH == winH && text.<span class="fn">substring</span>(s, s + m) == pat) <span class="kw">return</span> s
        <span class="kw">if</span> (s < n - m) {
            winH = (B * (winH - text[s].code * h) + text[s + m].code) % M
            <span class="kw">if</span> (winH < <span class="nm">0</span>) winH += M
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    nqueens: `<span class="kw">fun</span> <span class="fn">solveNQueens</span>(n: <span class="ty">Int</span>): <span class="ty">IntArray</span>? {
    <span class="kw">val</span> board = <span class="ty">IntArray</span>(n) { -<span class="nm">1</span> }
    <span class="kw">fun</span> <span class="fn">isSafe</span>(row: <span class="ty">Int</span>, col: <span class="ty">Int</span>): <span class="ty">Boolean</span> {
        <span class="kw">for</span> (c <span class="kw">in</span> <span class="nm">0</span> until col) {
            <span class="kw">val</span> r = board[c]
            <span class="kw">if</span> (r == row || <span class="fn">kotlin.math.abs</span>(r - row) == col - c) <span class="kw">return</span> <span class="kw">false</span>
        }
        <span class="kw">return</span> <span class="kw">true</span>
    }
    <span class="kw">fun</span> <span class="fn">place</span>(col: <span class="ty">Int</span>): <span class="ty">Boolean</span> {
        <span class="kw">if</span> (col == n) <span class="kw">return</span> <span class="kw">true</span>
        <span class="kw">for</span> (row <span class="kw">in</span> <span class="nm">0</span> until n) {
            <span class="kw">if</span> (<span class="fn">isSafe</span>(row, col)) {
                board[col] = row
                <span class="kw">if</span> (<span class="fn">place</span>(col + <span class="nm">1</span>)) <span class="kw">return</span> <span class="kw">true</span>
                board[col] = -<span class="nm">1</span>
            }
        }
        <span class="kw">return</span> <span class="kw">false</span>
    }
    <span class="kw">return</span> <span class="kw">if</span> (<span class="fn">place</span>(<span class="nm">0</span>)) board <span class="kw">else</span> <span class="kw">null</span>
}`,
    ternary: `<span class="kw">fun</span> <span class="fn">ternarySearch</span>(arr: <span class="ty">IntArray</span>, target: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">var</span> lo = <span class="nm">0</span>; <span class="kw">var</span> hi = arr.size - <span class="nm">1</span>
    <span class="kw">while</span> (lo <= hi) {
        <span class="kw">val</span> third = (hi - lo) / <span class="nm">3</span>
        <span class="kw">val</span> m1 = lo + third; <span class="kw">val</span> m2 = hi - third
        <span class="kw">when</span> {
            arr[m1] == target -> <span class="kw">return</span> m1
            arr[m2] == target -> <span class="kw">return</span> m2
            target < arr[m1] -> hi = m1 - <span class="nm">1</span>
            target > arr[m2] -> lo = m2 + <span class="nm">1</span>
            <span class="kw">else</span> -> { lo = m1 + <span class="nm">1</span>; hi = m2 - <span class="nm">1</span> }
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    bellmanFord: `<span class="kw">fun</span> <span class="fn">bellmanFord</span>(n: <span class="ty">Int</span>, edges: <span class="ty">Array</span>&lt;<span class="ty">IntArray</span>&gt;, src: <span class="ty">Int</span>): <span class="ty">IntArray</span> {
    <span class="kw">val</span> INF = <span class="ty">Int</span>.MAX_VALUE
    <span class="kw">val</span> dist = <span class="ty">IntArray</span>(n) { INF }
    dist[src] = <span class="nm">0</span>
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span> until n - <span class="nm">1</span>) {
        <span class="kw">for</span> (e <span class="kw">in</span> edges) {  <span class="cm">// e = [u, v, w]</span>
            <span class="kw">if</span> (dist[e[<span class="nm">0</span>]] != INF && dist[e[<span class="nm">0</span>]] + e[<span class="nm">2</span>] < dist[e[<span class="nm">1</span>]])
                dist[e[<span class="nm">1</span>]] = dist[e[<span class="nm">0</span>]] + e[<span class="nm">2</span>]
        }
    }
    <span class="kw">return</span> dist
}`,
    astar: `<span class="kw">import</span> java.util.PriorityQueue

<span class="cm">// adj[u] = список [сосед, вес]; h[i] — эвристика до цели</span>
<span class="kw">fun</span> <span class="fn">aStar</span>(adj: <span class="ty">Array</span>&lt;<span class="ty">List</span>&lt;<span class="ty">IntArray</span>&gt;&gt;, h: <span class="ty">IntArray</span>, start: <span class="ty">Int</span>, goal: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> g = <span class="ty">IntArray</span>(adj.size) { <span class="ty">Int</span>.MAX_VALUE }
    g[start] = <span class="nm">0</span>
    <span class="kw">val</span> pq = <span class="ty">PriorityQueue</span>&lt;<span class="ty">IntArray</span>&gt;(compareBy { it[<span class="nm">1</span>] })  <span class="cm">// [узел, f]</span>
    pq.<span class="fn">add</span>(<span class="fn">intArrayOf</span>(start, h[start]))
    <span class="kw">while</span> (pq.isNotEmpty()) {
        <span class="kw">val</span> u = pq.<span class="fn">poll</span>()[<span class="nm">0</span>]
        <span class="kw">if</span> (u == goal) <span class="kw">return</span> g[goal]
        <span class="kw">for</span> (edge <span class="kw">in</span> adj[u]) {
            <span class="kw">val</span> ng = g[u] + edge[<span class="nm">1</span>]
            <span class="kw">if</span> (ng < g[edge[<span class="nm">0</span>]]) {
                g[edge[<span class="nm">0</span>]] = ng
                pq.<span class="fn">add</span>(<span class="fn">intArrayOf</span>(edge[<span class="nm">0</span>], ng + h[edge[<span class="nm">0</span>]]))
            }
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    toposort: `<span class="kw">fun</span> <span class="fn">topoSort</span>(adj: <span class="ty">Array</span>&lt;<span class="ty">List</span>&lt;<span class="ty">Int</span>&gt;&gt;): <span class="ty">List</span>&lt;<span class="ty">Int</span>&gt; {
    <span class="kw">val</span> visited = <span class="ty">BooleanArray</span>(adj.size)
    <span class="kw">val</span> order = <span class="ty">ArrayDeque</span>&lt;<span class="ty">Int</span>&gt;()
    <span class="kw">fun</span> <span class="fn">dfs</span>(u: <span class="ty">Int</span>) {
        visited[u] = <span class="kw">true</span>
        <span class="kw">for</span> (v <span class="kw">in</span> adj[u]) <span class="kw">if</span> (!visited[v]) <span class="fn">dfs</span>(v)
        order.<span class="fn">addFirst</span>(u)
    }
    <span class="kw">for</span> (i <span class="kw">in</span> adj.indices) <span class="kw">if</span> (!visited[i]) <span class="fn">dfs</span>(i)
    <span class="kw">return</span> order.<span class="fn">toList</span>()
}`,
    floydWarshall: `<span class="cm">// dist[i][j] — матрица; недостижимость = большое число (INF)</span>
<span class="kw">fun</span> <span class="fn">floydWarshall</span>(dist: <span class="ty">Array</span>&lt;<span class="ty">IntArray</span>&gt;) {
    <span class="kw">val</span> n = dist.size
    <span class="kw">for</span> (k <span class="kw">in</span> <span class="nm">0</span> until n)
        <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span> until n)
            <span class="kw">for</span> (j <span class="kw">in</span> <span class="nm">0</span> until n)
                <span class="kw">if</span> (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j]
}`,
    prim: `<span class="kw">import</span> java.util.PriorityQueue

<span class="kw">fun</span> <span class="fn">prim</span>(adj: <span class="ty">Array</span>&lt;<span class="ty">List</span>&lt;<span class="ty">IntArray</span>&gt;&gt;): <span class="ty">Int</span> {
    <span class="kw">val</span> n = adj.size
    <span class="kw">val</span> inMST = <span class="ty">BooleanArray</span>(n)
    <span class="kw">var</span> total = <span class="nm">0</span>
    <span class="kw">val</span> pq = <span class="ty">PriorityQueue</span>&lt;<span class="ty">IntArray</span>&gt;(compareBy { it[<span class="nm">1</span>] })  <span class="cm">// [узел, вес]</span>
    pq.<span class="fn">add</span>(<span class="fn">intArrayOf</span>(<span class="nm">0</span>, <span class="nm">0</span>))
    <span class="kw">while</span> (pq.isNotEmpty()) {
        <span class="kw">val</span> (u, w) = pq.<span class="fn">poll</span>()
        <span class="kw">if</span> (inMST[u]) <span class="kw">continue</span>
        inMST[u] = <span class="kw">true</span>; total += w
        <span class="kw">for</span> (edge <span class="kw">in</span> adj[u])
            <span class="kw">if</span> (!inMST[edge[<span class="nm">0</span>]]) pq.<span class="fn">add</span>(<span class="fn">intArrayOf</span>(edge[<span class="nm">0</span>], edge[<span class="nm">1</span>]))
    }
    <span class="kw">return</span> total
}`,
    kruskal: `<span class="kw">fun</span> <span class="fn">kruskal</span>(n: <span class="ty">Int</span>, edges: <span class="ty">Array</span>&lt;<span class="ty">IntArray</span>&gt;): <span class="ty">Int</span> {
    <span class="kw">val</span> parent = <span class="ty">IntArray</span>(n) { it }
    <span class="kw">fun</span> <span class="fn">find</span>(x: <span class="ty">Int</span>): <span class="ty">Int</span> {
        <span class="kw">var</span> r = x
        <span class="kw">while</span> (parent[r] != r) r = parent[r]
        <span class="kw">return</span> r
    }
    edges.<span class="fn">sortBy</span> { it[<span class="nm">2</span>] }  <span class="cm">// по весу</span>
    <span class="kw">var</span> total = <span class="nm">0</span>
    <span class="kw">for</span> (e <span class="kw">in</span> edges) {
        <span class="kw">val</span> a = <span class="fn">find</span>(e[<span class="nm">0</span>]); <span class="kw">val</span> b = <span class="fn">find</span>(e[<span class="nm">1</span>])
        <span class="kw">if</span> (a != b) { parent[a] = b; total += e[<span class="nm">2</span>] }
    }
    <span class="kw">return</span> total
}`,
    lcs: `<span class="kw">fun</span> <span class="fn">lcs</span>(a: <span class="ty">String</span>, b: <span class="ty">String</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> m = a.length; <span class="kw">val</span> n = b.length
    <span class="kw">val</span> dp = <span class="ty">Array</span>(m + <span class="nm">1</span>) { <span class="ty">IntArray</span>(n + <span class="nm">1</span>) }
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span>..m)
        <span class="kw">for</span> (j <span class="kw">in</span> <span class="nm">1</span>..n)
            dp[i][j] = <span class="kw">if</span> (a[i - <span class="nm">1</span>] == b[j - <span class="nm">1</span>]) dp[i - <span class="nm">1</span>][j - <span class="nm">1</span>] + <span class="nm">1</span>
                       <span class="kw">else</span> <span class="fn">maxOf</span>(dp[i - <span class="nm">1</span>][j], dp[i][j - <span class="nm">1</span>])
    <span class="kw">return</span> dp[m][n]
}`,
    lis: `<span class="kw">fun</span> <span class="fn">lis</span>(arr: <span class="ty">IntArray</span>): <span class="ty">Int</span> {
    <span class="kw">if</span> (arr.isEmpty()) <span class="kw">return</span> <span class="nm">0</span>
    <span class="kw">val</span> dp = <span class="ty">IntArray</span>(arr.size) { <span class="nm">1</span> }
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span> until arr.size)
        <span class="kw">for</span> (j <span class="kw">in</span> <span class="nm">0</span> until i)
            <span class="kw">if</span> (arr[j] < arr[i]) dp[i] = <span class="fn">maxOf</span>(dp[i], dp[j] + <span class="nm">1</span>)
    <span class="kw">return</span> dp.<span class="fn">max</span>()
}`,
    coinChange: `<span class="kw">fun</span> <span class="fn">coinChange</span>(coins: <span class="ty">IntArray</span>, amount: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> dp = <span class="ty">IntArray</span>(amount + <span class="nm">1</span>) { amount + <span class="nm">1</span> }
    dp[<span class="nm">0</span>] = <span class="nm">0</span>
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span>..amount)
        <span class="kw">for</span> (c <span class="kw">in</span> coins)
            <span class="kw">if</span> (c <= i) dp[i] = <span class="fn">minOf</span>(dp[i], dp[i - c] + <span class="nm">1</span>)
    <span class="kw">return</span> <span class="kw">if</span> (dp[amount] > amount) -<span class="nm">1</span> <span class="kw">else</span> dp[amount]
}`,
    editDistance: `<span class="kw">fun</span> <span class="fn">editDistance</span>(a: <span class="ty">String</span>, b: <span class="ty">String</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> m = a.length; <span class="kw">val</span> n = b.length
    <span class="kw">val</span> dp = <span class="ty">Array</span>(m + <span class="nm">1</span>) { <span class="ty">IntArray</span>(n + <span class="nm">1</span>) }
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span>..m) dp[i][<span class="nm">0</span>] = i
    <span class="kw">for</span> (j <span class="kw">in</span> <span class="nm">0</span>..n) dp[<span class="nm">0</span>][j] = j
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span>..m)
        <span class="kw">for</span> (j <span class="kw">in</span> <span class="nm">1</span>..n)
            dp[i][j] = <span class="kw">if</span> (a[i - <span class="nm">1</span>] == b[j - <span class="nm">1</span>]) dp[i - <span class="nm">1</span>][j - <span class="nm">1</span>]
                       <span class="kw">else</span> <span class="nm">1</span> + <span class="fn">minOf</span>(dp[i - <span class="nm">1</span>][j - <span class="nm">1</span>], dp[i - <span class="nm">1</span>][j], dp[i][j - <span class="nm">1</span>])
    <span class="kw">return</span> dp[m][n]
}`,
    matrixChain: `<span class="kw">fun</span> <span class="fn">matrixChain</span>(p: <span class="ty">IntArray</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> n = p.size - <span class="nm">1</span>
    <span class="kw">val</span> dp = <span class="ty">Array</span>(n) { <span class="ty">IntArray</span>(n) }
    <span class="kw">for</span> (len <span class="kw">in</span> <span class="nm">2</span>..n)
        <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span>..n - len) {
            <span class="kw">val</span> j = i + len - <span class="nm">1</span>
            dp[i][j] = <span class="ty">Int</span>.MAX_VALUE
            <span class="kw">for</span> (k <span class="kw">in</span> i until j) {
                <span class="kw">val</span> cost = dp[i][k] + dp[k + <span class="nm">1</span>][j] + p[i] * p[k + <span class="nm">1</span>] * p[j + <span class="nm">1</span>]
                <span class="kw">if</span> (cost < dp[i][j]) dp[i][j] = cost
            }
        }
    <span class="kw">return</span> dp[<span class="nm">0</span>][n - <span class="nm">1</span>]
}`,
    rodCutting: `<span class="kw">fun</span> <span class="fn">rodCutting</span>(price: <span class="ty">IntArray</span>, n: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> dp = <span class="ty">IntArray</span>(n + <span class="nm">1</span>)
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span>..n)
        <span class="kw">for</span> (j <span class="kw">in</span> <span class="nm">1</span>..i)
            dp[i] = <span class="fn">maxOf</span>(dp[i], price[j - <span class="nm">1</span>] + dp[i - j])
    <span class="kw">return</span> dp[n]
}`,
    hashChaining: `<span class="kw">class</span> <span class="ty">HashTableChaining</span>(<span class="kw">val</span> size: <span class="ty">Int</span>) {
    <span class="kw">val</span> table = <span class="ty">Array</span>(size) { <span class="fn">mutableListOf</span>&lt;<span class="ty">Int</span>&gt;() }
    <span class="kw">fun</span> <span class="fn">hash</span>(key: <span class="ty">Int</span>) = key % size
    <span class="kw">fun</span> <span class="fn">insert</span>(key: <span class="ty">Int</span>) = table[<span class="fn">hash</span>(key)].<span class="fn">add</span>(key)
    <span class="kw">fun</span> <span class="fn">contains</span>(key: <span class="ty">Int</span>) = table[<span class="fn">hash</span>(key)].<span class="fn">contains</span>(key)
}`,
    hashLinear: `<span class="kw">class</span> <span class="ty">HashTableLinear</span>(<span class="kw">val</span> size: <span class="ty">Int</span>) {
    <span class="kw">val</span> table = <span class="fn">arrayOfNulls</span>&lt;<span class="ty">Int</span>&gt;(size)
    <span class="kw">fun</span> <span class="fn">hash</span>(key: <span class="ty">Int</span>) = key % size
    <span class="kw">fun</span> <span class="fn">insert</span>(key: <span class="ty">Int</span>) {
        <span class="kw">var</span> i = <span class="fn">hash</span>(key)
        <span class="kw">while</span> (table[i] != <span class="kw">null</span>) i = (i + <span class="nm">1</span>) % size
        table[i] = key
    }
}`,
    bubble: `<span class="kw">fun</span> <span class="fn">bubbleSort</span>(arr: <span class="ty">IntArray</span>) {
    <span class="kw">val</span> n = arr.<span class="fn">size</span>
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span>..n - <span class="nm">2</span>) {
        <span class="kw">for</span> (j <span class="kw">in</span> <span class="nm">0</span>..n - i - <span class="nm">2</span>) {
            <span class="kw">if</span> (arr[j] > arr[j + <span class="nm">1</span>]) {
                <span class="kw">val</span> temp = arr[j]
                arr[j] = arr[j + <span class="nm">1</span>]
                arr[j + <span class="nm">1</span>] = temp
            }
        }
    }
}`,
    selection: `<span class="kw">fun</span> <span class="fn">selectionSort</span>(arr: <span class="ty">IntArray</span>) {
    <span class="kw">val</span> n = arr.<span class="fn">size</span>
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span>..n - <span class="nm">2</span>) {
        <span class="kw">var</span> minIdx = i
        <span class="kw">for</span> (j <span class="kw">in</span> i + <span class="nm">1</span>..n - <span class="nm">1</span>) {
            <span class="kw">if</span> (arr[j] < arr[minIdx]) minIdx = j
        }
        <span class="kw">if</span> (minIdx != i) {
            <span class="kw">val</span> temp = arr[i]
            arr[i] = arr[minIdx]
            arr[minIdx] = temp
        }
    }
}`,
    insertion: `<span class="kw">fun</span> <span class="fn">insertionSort</span>(arr: <span class="ty">IntArray</span>) {
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span>..arr.<span class="fn">size</span> - <span class="nm">1</span>) {
        <span class="kw">val</span> key = arr[i]
        <span class="kw">var</span> j = i - <span class="nm">1</span>
        <span class="kw">while</span> (j >= <span class="nm">0</span> && arr[j] > key) {
            arr[j + <span class="nm">1</span>] = arr[j]
            j--
        }
        arr[j + <span class="nm">1</span>] = key
    }
}`,
    shell: `<span class="kw">fun</span> <span class="fn">shellSort</span>(arr: <span class="ty">IntArray</span>) {
    <span class="kw">var</span> gap = arr.<span class="fn">size</span> / <span class="nm">2</span>
    <span class="kw">while</span> (gap > <span class="nm">0</span>) {
        <span class="kw">for</span> (i <span class="kw">in</span> gap..arr.<span class="fn">size</span> - <span class="nm">1</span>) {
            <span class="kw">val</span> temp = arr[i]
            <span class="kw">var</span> j = i
            <span class="kw">while</span> (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap]
                j -= gap
            }
            arr[j] = temp
        }
        gap /= <span class="nm">2</span>
    }
}`,
    quick: `<span class="kw">fun</span> <span class="fn">quickSort</span>(arr: <span class="ty">IntArray</span>, lo: <span class="ty">Int</span> = <span class="nm">0</span>, hi: <span class="ty">Int</span> = arr.<span class="fn">size</span> - <span class="nm">1</span>) {
    <span class="kw">if</span> (lo >= hi) <span class="kw">return</span>
    <span class="kw">val</span> pivot = arr[hi]
    <span class="kw">var</span> i = lo - <span class="nm">1</span>
    <span class="kw">for</span> (j <span class="kw">in</span> lo..hi - <span class="nm">1</span>) {
        <span class="kw">if</span> (arr[j] <= pivot) {
            i++
            <span class="kw">val</span> temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }
    <span class="kw">val</span> temp = arr[i + <span class="nm">1</span>]
    arr[i + <span class="nm">1</span>] = arr[hi]
    arr[hi] = temp
    <span class="fn">quickSort</span>(arr, lo, i)
    <span class="fn">quickSort</span>(arr, i + <span class="nm">2</span>, hi)
}`,
    merge: `<span class="kw">fun</span> <span class="fn">mergeSort</span>(arr: <span class="ty">IntArray</span>): <span class="ty">IntArray</span> {
    <span class="kw">if</span> (arr.<span class="fn">size</span> <= <span class="nm">1</span>) <span class="kw">return</span> arr
    <span class="kw">val</span> mid = arr.<span class="fn">size</span> / <span class="nm">2</span>
    <span class="kw">val</span> left = <span class="fn">mergeSort</span>(arr.<span class="fn">sliceArray</span>(<span class="nm">0</span>..mid - <span class="nm">1</span>))
    <span class="kw">val</span> right = <span class="fn">mergeSort</span>(arr.<span class="fn">sliceArray</span>(mid..arr.<span class="fn">size</span> - <span class="nm">1</span>))
    <span class="kw">return</span> <span class="fn">merge</span>(left, right)
}

<span class="kw">fun</span> <span class="fn">merge</span>(left: <span class="ty">IntArray</span>, right: <span class="ty">IntArray</span>): <span class="ty">IntArray</span> {
    <span class="kw">var</span> i = <span class="nm">0</span>; <span class="kw">var</span> j = <span class="nm">0</span>
    <span class="kw">return</span> (<span class="nm">0</span>..left.<span class="fn">size</span> + right.<span class="fn">size</span> - <span class="nm">1</span>).<span class="fn">map</span> {
        <span class="kw">when</span> {
            i >= left.<span class="fn">size</span> -> right[j++]
            j >= right.<span class="fn">size</span> -> left[i++]
            left[i] <= right[j] -> left[i++]
            <span class="kw">else</span> -> right[j++]
        }
    }.<span class="fn">toIntArray</span>()
}`,
    heap: `<span class="kw">fun</span> <span class="fn">heapSort</span>(arr: <span class="ty">IntArray</span>) {
    <span class="kw">val</span> n = arr.<span class="fn">size</span>
    <span class="kw">for</span> (i <span class="kw">in</span> n / <span class="nm">2</span> - <span class="nm">1</span> downTo <span class="nm">0</span>) <span class="fn">heapify</span>(arr, n, i)
    <span class="kw">for</span> (i <span class="kw">in</span> n - <span class="nm">1</span> downTo <span class="nm">1</span>) {
        <span class="kw">val</span> temp = arr[<span class="nm">0</span>]
        arr[<span class="nm">0</span>] = arr[i]
        arr[i] = temp
        <span class="fn">heapify</span>(arr, i, <span class="nm">0</span>)
    }
}

<span class="kw">fun</span> <span class="fn">heapify</span>(arr: <span class="ty">IntArray</span>, n: <span class="ty">Int</span>, i: <span class="ty">Int</span>) {
    <span class="kw">var</span> largest = i
    <span class="kw">val</span> l = <span class="nm">2</span> * i + <span class="nm">1</span>
    <span class="kw">val</span> r = <span class="nm">2</span> * i + <span class="nm">2</span>
    <span class="kw">if</span> (l < n && arr[l] > arr[largest]) largest = l
    <span class="kw">if</span> (r < n && arr[r] > arr[largest]) largest = r
    <span class="kw">if</span> (largest != i) {
        <span class="kw">val</span> temp = arr[i]
        arr[i] = arr[largest]
        arr[largest] = temp
        <span class="fn">heapify</span>(arr, n, largest)
    }
}`,
    radix: `<span class="kw">fun</span> <span class="fn">radixSort</span>(arr: <span class="ty">IntArray</span>) {
    <span class="kw">val</span> max = arr.<span class="fn">maxOrNull</span>() ?: <span class="kw">return</span>
    <span class="kw">var</span> exp = <span class="nm">1</span>
    <span class="kw">while</span> (max / exp > <span class="nm">0</span>) {
        <span class="fn">countingSort</span>(arr, exp)
        exp *= <span class="nm">10</span>
    }
}

<span class="kw">fun</span> <span class="fn">countingSort</span>(arr: <span class="ty">IntArray</span>, exp: <span class="ty">Int</span>) {
    <span class="kw">val</span> n = arr.<span class="fn">size</span>
    <span class="kw">val</span> output = <span class="ty">IntArray</span>(n)
    <span class="kw">val</span> count = <span class="ty">IntArray</span>(<span class="nm">10</span>)
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span>..n - <span class="nm">1</span>) count[(arr[i] / exp) % <span class="nm">10</span>]++
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span>..<span class="nm">9</span>) count[i] += count[i - <span class="nm">1</span>]
    <span class="kw">for</span> (i <span class="kw">in</span> n - <span class="nm">1</span> downTo <span class="nm">0</span>) {
        <span class="kw">val</span> idx = (arr[i] / exp) % <span class="nm">10</span>
        count[idx]--
        output[count[idx]] = arr[i]
    }
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">0</span>..n - <span class="nm">1</span>) arr[i] = output[i]
}`,
    counting: `<span class="kw">fun</span> <span class="fn">countingSort</span>(arr: <span class="ty">IntArray</span>): <span class="ty">IntArray</span> {
    <span class="kw">val</span> max = arr.<span class="fn">max</span>()!!
    <span class="kw">val</span> count = <span class="ty">IntArray</span>(max + <span class="nm">1</span>)
    <span class="kw">val</span> output = <span class="ty">IntArray</span>(arr.size)
    <span class="kw">for</span> (x <span class="kw">in</span> arr) count[x]++
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span>..max) count[i] += count[i - <span class="nm">1</span>]
    <span class="kw">for</span> (i <span class="kw">in</span> arr.indices.<span class="fn">reversed</span>()) {
        output[--count[arr[i]]] = arr[i]
    }
    <span class="kw">return</span> output
}`,
    timsort: `<span class="kw">const val</span> MIN_RUN = <span class="nm">32</span>

<span class="kw">fun</span> <span class="fn">insertionSortRange</span>(arr: <span class="ty">IntArray</span>, lo: <span class="ty">Int</span>, hi: <span class="ty">Int</span>) {
    <span class="kw">for</span> (i <span class="kw">in</span> lo+<span class="nm">1</span>..hi) {
        <span class="kw">val</span> key = arr[i];
        <span class="kw">var</span> j = i - <span class="nm">1</span>
        <span class="kw">while</span> (j >= lo && arr[j] > key) {
            arr[j + <span class="nm">1</span>] = arr[j];
            j--
        }
        arr[j + <span class="nm">1</span>] = key
    }
}

<span class="kw">fun</span> <span class="fn">merge</span>(arr: <span class="ty">IntArray</span>, lo: <span class="ty">Int</span>, mid: <span class="ty">Int</span>, hi: <span class="ty">Int</span>) {
    <span class="kw">val</span> left = arr.<span class="fn">copyOfRange</span>(lo, mid + <span class="nm">1</span>)
    <span class="kw">val</span> right = arr.<span class="fn">copyOfRange</span>(mid + <span class="nm">1</span>, hi + <span class="nm">1</span>)
    <span class="kw">var</span> i = <span class="nm">0</span>; <span class="kw">var</span> j = <span class="nm">0</span>; <span class="kw">var</span> k = lo
    <span class="kw">while</span> (i < left.size && j < right.size)
        arr[k++] = <span class="kw">if</span> (left[i] <= right[j]) left[i++] <span class="kw">else</span> right[j++]
    <span class="kw">while</span> (i < left.size)
        arr[k++] = left[i++]
    <span class="kw">while</span> (j < right.size)
        arr[k++] = right[j++]
}

<span class="kw">fun</span> <span class="fn">timSort</span>(arr: <span class="ty">IntArray</span>) {
    <span class="kw">val</span> n = arr.size
    <span class="kw">var</span> i = <span class="nm">0</span>
    <span class="kw">while</span> (i < n) {
        <span class="fn">insertionSortRange</span>(arr, i, <span class="fn">minOf</span>(i + MIN_RUN - <span class="nm">1</span>, n - <span class="nm">1</span>))
        i += MIN_RUN
    }
    <span class="kw">var</span> size = MIN_RUN
    <span class="kw">while</span> (size < n) {
        <span class="kw">var</span> lo = <span class="nm">0</span>
        <span class="kw">while</span> (lo < n) {
            <span class="kw">val</span> mid = <span class="fn">minOf</span>(lo+size-<span class="nm">1</span>, n - <span class="nm">1</span>)
            <span class="kw">val</span> hi = <span class="fn">minOf</span>(lo+<span class="nm">2</span> * size - <span class="nm">1</span>, n - <span class="nm">1</span>)
            <span class="kw">if</span> (mid < hi) <span class="fn">merge</span>(arr, lo, mid, hi)
            lo += <span class="nm">2</span> * size
        }
        size *= <span class="nm">2</span>
    }
}`,
    linear: `<span class="kw">fun</span> <span class="fn">linearSearch</span>(arr: <span class="ty">IntArray</span>, target: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">for</span> (i <span class="kw">in</span> arr.<span class="fn">indices</span>) {
        <span class="kw">if</span> (arr[i] == target) <span class="kw">return</span> i
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    binary: `<span class="kw">fun</span> <span class="fn">binarySearch</span>(arr: <span class="ty">IntArray</span>, target: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">var</span> lo = <span class="nm">0</span>
    <span class="kw">var</span> hi = arr.<span class="fn">size</span> - <span class="nm">1</span>
    <span class="kw">while</span> (lo <= hi) {
        <span class="kw">val</span> mid = lo + (hi - lo) / <span class="nm">2</span>
        <span class="kw">if</span> (arr[mid] == target) <span class="kw">return</span> mid
        <span class="kw">if</span> (arr[mid] < target) lo = mid + <span class="nm">1</span>
        <span class="kw">else</span> hi = mid - <span class="nm">1</span>
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    jump: `<span class="kw">fun</span> <span class="fn">jumpSearch</span>(arr: <span class="ty">IntArray</span>, target: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> n = arr.<span class="fn">size</span>
    <span class="kw">var</span> step = kotlin.math.<span class="fn">sqrt</span>(n.<span class="fn">toDouble</span>()).<span class="fn">toInt</span>()
    <span class="kw">var</span> prev = <span class="nm">0</span>
    <span class="kw">while</span> (arr[kotlin.math.<span class="fn">min</span>(step, n) - <span class="nm">1</span>] < target) {
        prev = step
        step += kotlin.math.<span class="fn">sqrt</span>(n.<span class="fn">toDouble</span>()).<span class="fn">toInt</span>()
        <span class="kw">if</span> (prev >= n) <span class="kw">return</span> -<span class="nm">1</span>
    }
    <span class="kw">while</span> (arr[prev] < target) {
        prev++
        <span class="kw">if</span> (prev == kotlin.math.<span class="fn">min</span>(step, n)) <span class="kw">return</span> -<span class="nm">1</span>
    }
    <span class="kw">return</span> <span class="kw">if</span> (arr[prev] == target) prev <span class="kw">else</span> -<span class="nm">1</span>
}`,
    interpolation: `<span class="kw">fun</span> <span class="fn">interpolationSearch</span>(arr: <span class="ty">IntArray</span>, target: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">var</span> lo = <span class="nm">0</span>
    <span class="kw">var</span> hi = arr.<span class="fn">size</span> - <span class="nm">1</span>
    <span class="kw">while</span> (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        <span class="kw">if</span> (lo == hi) <span class="kw">return</span> <span class="kw">if</span> (arr[lo] == target) lo <span class="kw">else</span> -<span class="nm">1</span>
        <span class="kw">val</span> pos = lo + ((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo])
        <span class="kw">if</span> (arr[pos] == target) <span class="kw">return</span> pos
        <span class="kw">if</span> (arr[pos] < target) lo = pos + <span class="nm">1</span>
        <span class="kw">else</span> hi = pos - <span class="nm">1</span>
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    exponential: `<span class="kw">fun</span> <span class="fn">exponentialSearch</span>(arr: <span class="ty">IntArray</span>, target: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">if</span> (arr[<span class="nm">0</span>] == target) <span class="kw">return</span> <span class="nm">0</span>
    <span class="kw">var</span> i = <span class="nm">1</span>
    <span class="kw">while</span> (i < arr.<span class="fn">size</span> && arr[i] <= target) i *= <span class="nm">2</span>
    <span class="kw">return</span> <span class="fn">binarySearch</span>(arr, target, i / <span class="nm">2</span>, kotlin.math.<span class="fn">min</span>(i, arr.<span class="fn">size</span> - <span class="nm">1</span>))
}`,
    bfs: `<span class="kw">fun</span> <span class="fn">bfs</span>(graph: <span class="ty">List</span><<span class="ty">List</span><<span class="ty">Int</span>>>, start: <span class="ty">Int</span>) {
    <span class="kw">val</span> visited = <span class="ty">BooleanArray</span>(graph.<span class="fn">size</span>)
    <span class="kw">val</span> queue: <span class="ty">ArrayDeque</span><<span class="ty">Int</span>> = <span class="ty">ArrayDeque</span>()
    queue.<span class="fn">add</span>(start)
    visited[start] = <span class="kw">true</span>
    <span class="kw">while</span> (queue.<span class="fn">isNotEmpty</span>()) {
        <span class="kw">val</span> node = queue.<span class="fn">removeFirst</span>()
        <span class="kw">for</span> (neighbor <span class="kw">in</span> graph[node]) {
            <span class="kw">if</span> (!visited[neighbor]) {
                visited[neighbor] = <span class="kw">true</span>
                queue.<span class="fn">add</span>(neighbor)
            }
        }
    }
}`,
    dfs: `<span class="kw">fun</span> <span class="fn">dfs</span>(graph: <span class="ty">List</span><<span class="ty">List</span><<span class="ty">Int</span>>>, start: <span class="ty">Int</span>, visited: <span class="ty">BooleanArray</span>) {
    visited[start] = <span class="kw">true</span>
    <span class="kw">for</span> (neighbor <span class="kw">in</span> graph[start]) {
        <span class="kw">if</span> (!visited[neighbor]) {
            <span class="fn">dfs</span>(graph, neighbor, visited)
        }
    }
}`,
    dijkstra: `<span class="kw">fun</span> <span class="fn">dijkstra</span>(graph: <span class="ty">Array</span><<span class="ty">List</span><<span class="ty">Pair</span><<span class="ty">Int</span>,<span class="ty">Int</span>>>>, src: <span class="ty">Int</span>): <span class="ty">IntArray</span> {
    <span class="kw">val</span> n = graph.size
    <span class="kw">val</span> dist = <span class="ty">IntArray</span>(n) { <span class="ty">Int</span>.MAX_VALUE }
    dist[src] = <span class="nm">0</span>
    <span class="kw">val</span> pq = <span class="ty">PriorityQueue</span>(<span class="fn">compareBy</span> { it.first })
    pq.<span class="fn">add</span>(<span class="nm">0</span> to src)
    <span class="kw">while</span> (pq.<span class="fn">isNotEmpty</span>()) {
        <span class="kw">val</span> (d, u) = pq.<span class="fn">poll</span>()
        <span class="kw">if</span> (d > dist[u]) <span class="kw">continue</span>
        <span class="kw">for</span> ((v, w) <span class="kw">in</span> graph[u])
            <span class="kw">if</span> (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w
                pq.<span class="fn">add</span>(dist[v] to v)
            }
    }
    <span class="kw">return</span> dist
}`,
    fib: `<span class="kw">fun</span> <span class="fn">fibonacci</span>(n: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> dp = <span class="ty">IntArray</span>(n + <span class="nm">1</span>)
    <span class="kw">if</span> (n >= <span class="nm">1</span>) dp[<span class="nm">1</span>] = <span class="nm">1</span>
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">2</span>..n) {
        dp[i] = dp[i - <span class="nm">1</span>] + dp[i - <span class="nm">2</span>]
    }
    <span class="kw">return</span> dp[n]
}`,
    knapsack: `<span class="kw">fun</span> <span class="fn">knapsack</span>(wt: <span class="ty">IntArray</span>, val: <span class="ty">IntArray</span>, W: <span class="ty">Int</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> n = wt.<span class="fn">size</span>
    <span class="kw">val</span> dp = <span class="ty">Array</span>(n + <span class="nm">1</span>) { <span class="ty">IntArray</span>(W + <span class="nm">1</span>) }
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span>..n) {
        <span class="kw">for</span> (w <span class="kw">in</span> <span class="nm">0</span>..W) {
            <span class="kw">if</span> (wt[i - <span class="nm">1</span>] <= w)
                dp[i][w] = kotlin.math.<span class="fn">max</span>(val[i - <span class="nm">1</span>] + dp[i - <span class="nm">1</span>][w - wt[i - <span class="nm">1</span>]], dp[i - <span class="nm">1</span>][w])
            <span class="kw">else</span>
                dp[i][w] = dp[i - <span class="nm">1</span>][w]
        }
    }
    <span class="kw">return</span> dp[n][W]
}`,
  },
  swift: {
    bst: `<span class="kw">class</span> <span class="ty">Node</span> {
    <span class="kw">var</span> val: <span class="ty">Int</span>
    <span class="kw">var</span> left: <span class="ty">Node</span>?
    <span class="kw">var</span> right: <span class="ty">Node</span>?
    <span class="kw">init</span>(<span class="kw">_</span> v: <span class="ty">Int</span>) { val = v }
}

<span class="kw">func</span> <span class="fn">insert</span>(<span class="kw">_</span> root: <span class="ty">Node</span>?, <span class="kw">_</span> value: <span class="ty">Int</span>) -> <span class="ty">Node</span> {
    <span class="kw">guard let</span> root = root <span class="kw">else</span> { <span class="kw">return</span> <span class="ty">Node</span>(value) }
    <span class="kw">var</span> cur: <span class="ty">Node</span>? = root
    <span class="kw">while true</span> {
        <span class="kw">if</span> value < cur!.val {
            <span class="kw">if</span> cur!.left == <span class="kw">nil</span> { cur!.left = <span class="ty">Node</span>(value); <span class="kw">return</span> root }
            cur = cur!.left
        } <span class="kw">else if</span> value > cur!.val {
            <span class="kw">if</span> cur!.right == <span class="kw">nil</span> { cur!.right = <span class="ty">Node</span>(value); <span class="kw">return</span> root }
            cur = cur!.right
        } <span class="kw">else</span> { <span class="kw">return</span> root }
    }
}

<span class="kw">func</span> <span class="fn">search</span>(<span class="kw">_</span> root: <span class="ty">Node</span>?, <span class="kw">_</span> value: <span class="ty">Int</span>) -> <span class="ty">Node</span>? {
    <span class="kw">var</span> cur = root
    <span class="kw">while let</span> node = cur {
        <span class="kw">if</span> value == node.val { <span class="kw">return</span> node }
        cur = value < node.val ? node.left : node.right
    }
    <span class="kw">return</span> <span class="kw">nil</span>
}`,
    kmp: `<span class="kw">func</span> <span class="fn">buildLPS</span>(<span class="kw">_</span> p: [<span class="ty">Character</span>]) -> [<span class="ty">Int</span>] {
    <span class="kw">var</span> lps = [<span class="ty">Int</span>](repeating: <span class="nm">0</span>, count: p.count)
    <span class="kw">var</span> len = <span class="nm">0</span>, i = <span class="nm">1</span>
    <span class="kw">while</span> i < p.count {
        <span class="kw">if</span> p[i] == p[len] { len += <span class="nm">1</span>; lps[i] = len; i += <span class="nm">1</span> }
        <span class="kw">else if</span> len > <span class="nm">0</span> { len = lps[len - <span class="nm">1</span>] }
        <span class="kw">else</span> { lps[i] = <span class="nm">0</span>; i += <span class="nm">1</span> }
    }
    <span class="kw">return</span> lps
}

<span class="kw">func</span> <span class="fn">kmp</span>(<span class="kw">_</span> text: [<span class="ty">Character</span>], <span class="kw">_</span> pat: [<span class="ty">Character</span>]) -> <span class="ty">Int</span> {
    <span class="kw">let</span> lps = <span class="fn">buildLPS</span>(pat)
    <span class="kw">var</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>
    <span class="kw">while</span> i < text.count {
        <span class="kw">if</span> text[i] == pat[j] {
            i += <span class="nm">1</span>; j += <span class="nm">1</span>
            <span class="kw">if</span> j == pat.count { <span class="kw">return</span> i - j }
        } <span class="kw">else if</span> j > <span class="nm">0</span> { j = lps[j - <span class="nm">1</span>] }
        <span class="kw">else</span> { i += <span class="nm">1</span> }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    rabinkarp: `<span class="cm">// text/pat — массивы кодов символов</span>
<span class="kw">func</span> <span class="fn">rabinKarp</span>(<span class="kw">_</span> text: [<span class="ty">Int</span>], <span class="kw">_</span> pat: [<span class="ty">Int</span>]) -> <span class="ty">Int</span> {
    <span class="kw">let</span> B = <span class="nm">256</span>, M = <span class="nm">101</span>
    <span class="kw">let</span> m = pat.count, n = text.count
    <span class="kw">if</span> m > n { <span class="kw">return</span> -<span class="nm">1</span> }
    <span class="kw">var</span> patH = <span class="nm">0</span>, winH = <span class="nm">0</span>, h = <span class="nm">1</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="nm">0</span>..&lt;(m - <span class="nm">1</span>) { h = (h * B) % M }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..&lt;m {
        patH = (B * patH + pat[i]) % M
        winH = (B * winH + text[i]) % M
    }
    <span class="kw">for</span> s <span class="kw">in</span> <span class="nm">0</span>...(n - m) {
        <span class="kw">if</span> patH == winH && <span class="ty">Array</span>(text[s..&lt;s + m]) == pat { <span class="kw">return</span> s }
        <span class="kw">if</span> s < n - m {
            winH = (B * (winH - text[s] * h) + text[s + m]) % M
            <span class="kw">if</span> winH < <span class="nm">0</span> { winH += M }
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    nqueens: `<span class="kw">func</span> <span class="fn">solveNQueens</span>(<span class="kw">_</span> n: <span class="ty">Int</span>) -> [<span class="ty">Int</span>]? {
    <span class="kw">var</span> board = [<span class="ty">Int</span>](repeating: -<span class="nm">1</span>, count: n)
    <span class="kw">func</span> <span class="fn">isSafe</span>(<span class="kw">_</span> row: <span class="ty">Int</span>, <span class="kw">_</span> col: <span class="ty">Int</span>) -> <span class="ty">Bool</span> {
        <span class="kw">for</span> c <span class="kw">in</span> <span class="nm">0</span>..&lt;col {
            <span class="kw">let</span> r = board[c]
            <span class="kw">if</span> r == row || <span class="fn">abs</span>(r - row) == col - c { <span class="kw">return false</span> }
        }
        <span class="kw">return true</span>
    }
    <span class="kw">func</span> <span class="fn">place</span>(<span class="kw">_</span> col: <span class="ty">Int</span>) -> <span class="ty">Bool</span> {
        <span class="kw">if</span> col == n { <span class="kw">return true</span> }
        <span class="kw">for</span> row <span class="kw">in</span> <span class="nm">0</span>..&lt;n {
            <span class="kw">if</span> <span class="fn">isSafe</span>(row, col) {
                board[col] = row
                <span class="kw">if</span> <span class="fn">place</span>(col + <span class="nm">1</span>) { <span class="kw">return true</span> }
                board[col] = -<span class="nm">1</span>
            }
        }
        <span class="kw">return false</span>
    }
    <span class="kw">return</span> <span class="fn">place</span>(<span class="nm">0</span>) ? board : <span class="kw">nil</span>
}`,
    ternary: `<span class="kw">func</span> <span class="fn">ternarySearch</span>(<span class="kw">_</span> arr: [<span class="ty">Int</span>], <span class="kw">_</span> target: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">var</span> lo = <span class="nm">0</span>, hi = arr.count - <span class="nm">1</span>
    <span class="kw">while</span> lo <= hi {
        <span class="kw">let</span> third = (hi - lo) / <span class="nm">3</span>
        <span class="kw">let</span> m1 = lo + third, m2 = hi - third
        <span class="kw">if</span> arr[m1] == target { <span class="kw">return</span> m1 }
        <span class="kw">if</span> arr[m2] == target { <span class="kw">return</span> m2 }
        <span class="kw">if</span> target < arr[m1] { hi = m1 - <span class="nm">1</span> }
        <span class="kw">else if</span> target > arr[m2] { lo = m2 + <span class="nm">1</span> }
        <span class="kw">else</span> { lo = m1 + <span class="nm">1</span>; hi = m2 - <span class="nm">1</span> }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    bellmanFord: `<span class="kw">func</span> <span class="fn">bellmanFord</span>(<span class="kw">_</span> n: <span class="ty">Int</span>, <span class="kw">_</span> edges: [[<span class="ty">Int</span>]], <span class="kw">_</span> src: <span class="ty">Int</span>) -> [<span class="ty">Int</span>] {
    <span class="kw">let</span> INF = <span class="ty">Int</span>.max
    <span class="kw">var</span> dist = [<span class="ty">Int</span>](repeating: INF, count: n)
    dist[src] = <span class="nm">0</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="nm">0</span>..&lt;(n - <span class="nm">1</span>) {
        <span class="kw">for</span> e <span class="kw">in</span> edges {  <span class="cm">// e = [u, v, w]</span>
            <span class="kw">if</span> dist[e[<span class="nm">0</span>]] != INF && dist[e[<span class="nm">0</span>]] + e[<span class="nm">2</span>] < dist[e[<span class="nm">1</span>]] {
                dist[e[<span class="nm">1</span>]] = dist[e[<span class="nm">0</span>]] + e[<span class="nm">2</span>]
            }
        }
    }
    <span class="kw">return</span> dist
}`,
    astar: `<span class="cm">// adj[u] = [[сосед, вес]]; h[i] — эвристика до цели</span>
<span class="kw">func</span> <span class="fn">aStar</span>(<span class="kw">_</span> adj: [[[<span class="ty">Int</span>]]], <span class="kw">_</span> h: [<span class="ty">Int</span>], <span class="kw">_</span> start: <span class="ty">Int</span>, <span class="kw">_</span> goal: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">var</span> g = [<span class="ty">Int</span>](repeating: <span class="ty">Int</span>.max, count: adj.count)
    g[start] = <span class="nm">0</span>
    <span class="kw">var</span> open: <span class="ty">Set</span>&lt;<span class="ty">Int</span>&gt; = [start]
    <span class="kw">while</span> !open.isEmpty {
        <span class="kw">let</span> cur = open.<span class="fn">min</span> { g[$0] + h[$0] < g[$1] + h[$1] }!
        <span class="kw">if</span> cur == goal { <span class="kw">return</span> g[goal] }
        open.<span class="fn">remove</span>(cur)
        <span class="kw">for</span> edge <span class="kw">in</span> adj[cur] {
            <span class="kw">if</span> g[cur] + edge[<span class="nm">1</span>] < g[edge[<span class="nm">0</span>]] {
                g[edge[<span class="nm">0</span>]] = g[cur] + edge[<span class="nm">1</span>]
                open.<span class="fn">insert</span>(edge[<span class="nm">0</span>])
            }
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    toposort: `<span class="kw">func</span> <span class="fn">topoSort</span>(<span class="kw">_</span> adj: [[<span class="ty">Int</span>]]) -> [<span class="ty">Int</span>] {
    <span class="kw">let</span> n = adj.count
    <span class="kw">var</span> visited = [<span class="ty">Bool</span>](repeating: <span class="kw">false</span>, count: n)
    <span class="kw">var</span> order = [<span class="ty">Int</span>]()
    <span class="kw">func</span> <span class="fn">dfs</span>(<span class="kw">_</span> u: <span class="ty">Int</span>) {
        visited[u] = <span class="kw">true</span>
        <span class="kw">for</span> v <span class="kw">in</span> adj[u] <span class="kw">where</span> !visited[v] { <span class="fn">dfs</span>(v) }
        order.<span class="fn">append</span>(u)
    }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..&lt;n <span class="kw">where</span> !visited[i] { <span class="fn">dfs</span>(i) }
    <span class="kw">return</span> order.<span class="fn">reversed</span>()
}`,
    floydWarshall: `<span class="cm">// dist[i][j] — матрица; недостижимость = большое число</span>
<span class="kw">func</span> <span class="fn">floydWarshall</span>(<span class="kw">_</span> dist: <span class="kw">inout</span> [[<span class="ty">Int</span>]]) {
    <span class="kw">let</span> n = dist.count
    <span class="kw">for</span> k <span class="kw">in</span> <span class="nm">0</span>..&lt;n {
        <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..&lt;n {
            <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..&lt;n <span class="kw">where</span> dist[i][k] + dist[k][j] < dist[i][j] {
                dist[i][j] = dist[i][k] + dist[k][j]
            }
        }
    }
}`,
    prim: `<span class="kw">func</span> <span class="fn">prim</span>(<span class="kw">_</span> adj: [[[<span class="ty">Int</span>]]]) -> <span class="ty">Int</span> {
    <span class="kw">let</span> n = adj.count
    <span class="kw">var</span> inMST = [<span class="ty">Bool</span>](repeating: <span class="kw">false</span>, count: n)
    <span class="kw">var</span> key = [<span class="ty">Int</span>](repeating: <span class="ty">Int</span>.max, count: n)
    key[<span class="nm">0</span>] = <span class="nm">0</span>; <span class="kw">var</span> total = <span class="nm">0</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="nm">0</span>..&lt;n {
        <span class="kw">var</span> u = -<span class="nm">1</span>
        <span class="kw">for</span> v <span class="kw">in</span> <span class="nm">0</span>..&lt;n <span class="kw">where</span> !inMST[v] && (u == -<span class="nm">1</span> || key[v] < key[u]) { u = v }
        <span class="kw">if</span> u == -<span class="nm">1</span> || key[u] == <span class="ty">Int</span>.max { <span class="kw">break</span> }
        inMST[u] = <span class="kw">true</span>; total += key[u]
        <span class="kw">for</span> edge <span class="kw">in</span> adj[u] <span class="kw">where</span> !inMST[edge[<span class="nm">0</span>]] && edge[<span class="nm">1</span>] < key[edge[<span class="nm">0</span>]] {
            key[edge[<span class="nm">0</span>]] = edge[<span class="nm">1</span>]
        }
    }
    <span class="kw">return</span> total
}`,
    kruskal: `<span class="kw">func</span> <span class="fn">kruskal</span>(<span class="kw">_</span> n: <span class="ty">Int</span>, <span class="kw">_</span> edges: [[<span class="ty">Int</span>]]) -> <span class="ty">Int</span> {
    <span class="kw">var</span> parent = <span class="ty">Array</span>(<span class="nm">0</span>..&lt;n)
    <span class="kw">func</span> <span class="fn">find</span>(<span class="kw">_</span> x: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
        <span class="kw">var</span> r = x
        <span class="kw">while</span> parent[r] != r { r = parent[r] }
        <span class="kw">return</span> r
    }
    <span class="kw">let</span> sorted = edges.<span class="fn">sorted</span> { $0[<span class="nm">2</span>] < $1[<span class="nm">2</span>] }
    <span class="kw">var</span> total = <span class="nm">0</span>
    <span class="kw">for</span> e <span class="kw">in</span> sorted {
        <span class="kw">let</span> a = <span class="fn">find</span>(e[<span class="nm">0</span>]), b = <span class="fn">find</span>(e[<span class="nm">1</span>])
        <span class="kw">if</span> a != b { parent[a] = b; total += e[<span class="nm">2</span>] }
    }
    <span class="kw">return</span> total
}`,
    coinChange: `<span class="kw">func</span> <span class="fn">coinChange</span>(<span class="kw">_</span> coins: [<span class="ty">Int</span>], <span class="kw">_</span> amount: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">var</span> dp = [<span class="ty">Int</span>](repeating: amount + <span class="nm">1</span>, count: amount + <span class="nm">1</span>)
    dp[<span class="nm">0</span>] = <span class="nm">0</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>...amount {
        <span class="kw">for</span> c <span class="kw">in</span> coins <span class="kw">where</span> c <= i {
            dp[i] = <span class="fn">min</span>(dp[i], dp[i - c] + <span class="nm">1</span>)
        }
    }
    <span class="kw">return</span> dp[amount] > amount ? -<span class="nm">1</span> : dp[amount]
}`,
    editDistance: `<span class="kw">func</span> <span class="fn">editDistance</span>(<span class="kw">_</span> a: [<span class="ty">Character</span>], <span class="kw">_</span> b: [<span class="ty">Character</span>]) -> <span class="ty">Int</span> {
    <span class="kw">let</span> m = a.count, n = b.count
    <span class="kw">var</span> dp = <span class="ty">Array</span>(repeating: <span class="ty">Array</span>(repeating: <span class="nm">0</span>, count: n + <span class="nm">1</span>), count: m + <span class="nm">1</span>)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>...m { dp[i][<span class="nm">0</span>] = i }
    <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>...n { dp[<span class="nm">0</span>][j] = j }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>...m {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">1</span>...n {
            dp[i][j] = a[i - <span class="nm">1</span>] == b[j - <span class="nm">1</span>] ? dp[i - <span class="nm">1</span>][j - <span class="nm">1</span>]
                : <span class="nm">1</span> + <span class="fn">min</span>(dp[i - <span class="nm">1</span>][j - <span class="nm">1</span>], dp[i - <span class="nm">1</span>][j], dp[i][j - <span class="nm">1</span>])
        }
    }
    <span class="kw">return</span> dp[m][n]
}`,
    matrixChain: `<span class="kw">func</span> <span class="fn">matrixChain</span>(<span class="kw">_</span> p: [<span class="ty">Int</span>]) -> <span class="ty">Int</span> {
    <span class="kw">let</span> n = p.count - <span class="nm">1</span>
    <span class="kw">var</span> dp = <span class="ty">Array</span>(repeating: <span class="ty">Array</span>(repeating: <span class="nm">0</span>, count: n), count: n)
    <span class="kw">for</span> len <span class="kw">in</span> <span class="nm">2</span>...n {
        <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>...(n - len) {
            <span class="kw">let</span> j = i + len - <span class="nm">1</span>
            dp[i][j] = <span class="ty">Int</span>.max
            <span class="kw">for</span> k <span class="kw">in</span> i..&lt;j {
                <span class="kw">let</span> cost = dp[i][k] + dp[k + <span class="nm">1</span>][j] + p[i] * p[k + <span class="nm">1</span>] * p[j + <span class="nm">1</span>]
                <span class="kw">if</span> cost < dp[i][j] { dp[i][j] = cost }
            }
        }
    }
    <span class="kw">return</span> dp[<span class="nm">0</span>][n - <span class="nm">1</span>]
}`,
    rodCutting: `<span class="kw">func</span> <span class="fn">rodCutting</span>(<span class="kw">_</span> price: [<span class="ty">Int</span>], <span class="kw">_</span> n: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">var</span> dp = [<span class="ty">Int</span>](repeating: <span class="nm">0</span>, count: n + <span class="nm">1</span>)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>...n {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">1</span>...i {
            dp[i] = <span class="fn">max</span>(dp[i], price[j - <span class="nm">1</span>] + dp[i - j])
        }
    }
    <span class="kw">return</span> dp[n]
}`,
    hashChaining: `<span class="kw">class</span> <span class="ty">HashTableChaining</span> {
    <span class="kw">let</span> size: <span class="ty">Int</span>
    <span class="kw">var</span> table: [[<span class="ty">Int</span>]]
    <span class="kw">init</span>(<span class="kw">_</span> size: <span class="ty">Int</span>) { self.size = size; table = <span class="ty">Array</span>(repeating: [], count: size) }
    <span class="kw">func</span> <span class="fn">hash</span>(<span class="kw">_</span> key: <span class="ty">Int</span>) -> <span class="ty">Int</span> { key % size }
    <span class="kw">func</span> <span class="fn">insert</span>(<span class="kw">_</span> key: <span class="ty">Int</span>) { table[<span class="fn">hash</span>(key)].<span class="fn">append</span>(key) }
    <span class="kw">func</span> <span class="fn">contains</span>(<span class="kw">_</span> key: <span class="ty">Int</span>) -> <span class="ty">Bool</span> { table[<span class="fn">hash</span>(key)].<span class="fn">contains</span>(key) }
}`,
    hashLinear: `<span class="kw">class</span> <span class="ty">HashTableLinear</span> {
    <span class="kw">let</span> size: <span class="ty">Int</span>
    <span class="kw">var</span> table: [<span class="ty">Int</span>?]
    <span class="kw">init</span>(<span class="kw">_</span> size: <span class="ty">Int</span>) { self.size = size; table = <span class="ty">Array</span>(repeating: <span class="kw">nil</span>, count: size) }
    <span class="kw">func</span> <span class="fn">hash</span>(<span class="kw">_</span> key: <span class="ty">Int</span>) -> <span class="ty">Int</span> { key % size }
    <span class="kw">func</span> <span class="fn">insert</span>(<span class="kw">_</span> key: <span class="ty">Int</span>) {
        <span class="kw">var</span> i = <span class="fn">hash</span>(key)
        <span class="kw">while</span> table[i] != <span class="kw">nil</span> { i = (i + <span class="nm">1</span>) % size }
        table[i] = key
    }
}`,
    bubble: `<span class="kw">func</span> <span class="fn">bubbleSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">count</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..< n - <span class="nm">1</span> {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..< n - i - <span class="nm">1</span> {
            <span class="kw">if</span> arr[j] > arr[j + <span class="nm">1</span>] {
                arr.<span class="fn">swapAt</span>(j, j + <span class="nm">1</span>)
            }
        }
    }
}`,
    selection: `<span class="kw">func</span> <span class="fn">selectionSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">count</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..< n - <span class="nm">1</span> {
        <span class="kw">var</span> minIdx = i
        <span class="kw">for</span> j <span class="kw">in</span> i+<span class="nm">1</span>..< n {
            <span class="kw">if</span> arr[j] < arr[minIdx] {
                minIdx = j
            }
        }
        <span class="kw">if</span> minIdx != i {
            arr.<span class="fn">swapAt</span>(i, minIdx)
        }
    }
}`,
    insertion: `<span class="kw">func</span> <span class="fn">insertionSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..< arr.<span class="fn">count</span> {
        <span class="kw">let</span> key = arr[i]
        <span class="kw">var</span> j = i - <span class="nm">1</span>
        <span class="kw">while</span> j >= <span class="nm">0</span> && arr[j] > key {
            arr[j + <span class="nm">1</span>] = arr[j]
            j -= <span class="nm">1</span>
        }
        arr[j + <span class="nm">1</span>] = key
    }
}`,
    shell: `<span class="kw">func</span> <span class="fn">shellSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">var</span> gap = arr.<span class="fn">count</span> / <span class="nm">2</span>
    <span class="kw">while</span> gap > <span class="nm">0</span> {
        <span class="kw">for</span> i <span class="kw">in</span> gap..< arr.<span class="fn">count</span> {
            <span class="kw">let</span> temp = arr[i]
            <span class="kw">var</span> j = i
            <span class="kw">while</span> j >= gap && arr[j - gap] > temp {
                arr[j] = arr[j - gap]
                j -= gap
            }
            arr[j] = temp
        }
        gap /= <span class="nm">2</span>
    }
}`,
    quick: `<span class="kw">func</span> <span class="fn">quickSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>], <span class="kw">_</span> lo: <span class="ty">Int</span>, <span class="kw">_</span> hi: <span class="ty">Int</span>) {
    <span class="kw">guard</span> lo < hi <span class="kw">else</span> { <span class="kw">return</span> }
    <span class="kw">let</span> pivot = arr[hi]
    <span class="kw">var</span> i = lo - <span class="nm">1</span>
    <span class="kw">for</span> j <span class="kw">in</span> lo..<hi {
        <span class="kw">if</span> arr[j] <= pivot {
            i += <span class="nm">1</span>
            arr.<span class="fn">swapAt</span>(i, j)
        }
    }
    arr.<span class="fn">swapAt</span>(i + <span class="nm">1</span>, hi)
    <span class="kw">let</span> p = i + <span class="nm">1</span>
    <span class="fn">quickSort</span>(&arr, lo, p - <span class="nm">1</span>)
    <span class="fn">quickSort</span>(&arr, p + <span class="nm">1</span>, hi)
}
`,
    merge: `<span class="kw">func</span> <span class="fn">mergeSort</span>(<span class="kw">_</span> arr: [<span class="ty">Int</span>]) -> [<span class="ty">Int</span>] {
    <span class="kw">guard</span> arr.<span class="fn">count</span> > <span class="nm">1</span> <span class="kw">else</span> { <span class="kw">return</span> arr }
    <span class="kw">let</span> mid = arr.<span class="fn">count</span> / <span class="nm">2</span>
    <span class="kw">let</span> left = <span class="fn">mergeSort</span>(<span class="ty">Array</span>(arr[<span class="nm">0</span>..<mid]))
    <span class="kw">let</span> right = <span class="fn">mergeSort</span>(<span class="ty">Array</span>(arr[mid..<arr.<span class="fn">count</span>]))
    <span class="kw">return</span> <span class="fn">merge</span>(left, right)
}

<span class="kw">func</span> <span class="fn">merge</span>(<span class="kw">_</span> left: [<span class="ty">Int</span>], <span class="kw">_</span> right: [<span class="ty">Int</span>]) -> [<span class="ty">Int</span>] {
    <span class="kw">var</span> result: [<span class="ty">Int</span>] = []
    <span class="kw">var</span> i = <span class="nm">0</span>, j = <span class="nm">0</span>
    <span class="kw">while</span> i < left.<span class="fn">count</span> && j < right.<span class="fn">count</span> {
        <span class="kw">if</span> left[i] <= right[j] {
            result.<span class="fn">append</span>(left[i]); i += <span class="nm">1</span>
        } <span class="kw">else</span> {
            result.<span class="fn">append</span>(right[j]); j += <span class="nm">1</span>
        }
    }
    <span class="kw">return</span> result + <span class="ty">Array</span>(left[i...]) + <span class="ty">Array</span>(right[j...])
}`,
    heap: `<span class="kw">func</span> <span class="fn">heapSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">count</span>
    <span class="kw">for</span> i <span class="kw">in</span> (<span class="nm">0</span>..<n/<span class="nm">2</span>).<span class="fn">reversed</span>() {
        <span class="fn">heapify</span>(&arr, n, i)
    }
    <span class="kw">for</span> i <span class="kw">in</span> (<span class="nm">1</span>..<n).<span class="fn">reversed</span>() {
        arr.<span class="fn">swapAt</span>(<span class="nm">0</span>, i)
        <span class="fn">heapify</span>(&arr, i, <span class="nm">0</span>)
    }
}

<span class="kw">func</span> <span class="fn">heapify</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>], <span class="kw">_</span> n: <span class="ty">Int</span>, <span class="kw">_</span> i: <span class="ty">Int</span>) {
    <span class="kw">var</span> largest = i
    <span class="kw">let</span> l = <span class="nm">2</span> * i + <span class="nm">1</span>
    <span class="kw">let</span> r = <span class="nm">2</span> * i + <span class="nm">2</span>
    <span class="kw">if</span> l < n && arr[l] > arr[largest] { largest = l }
    <span class="kw">if</span> r < n && arr[r] > arr[largest] { largest = r }
    <span class="kw">if</span> largest != i {
        arr.<span class="fn">swapAt</span>(i, largest)
        <span class="fn">heapify</span>(&arr, n, largest)
    }
}`,
    radix: `<span class="kw">func</span> <span class="fn">radixSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">guard let</span> max = arr.<span class="fn">max</span>() <span class="kw">else</span> { <span class="kw">return</span> }
    <span class="kw">var</span> exp = <span class="nm">1</span>
    <span class="kw">while</span> max / exp > <span class="nm">0</span> {
        <span class="fn">countingSort</span>(&arr, exp)
        exp *= <span class="nm">10</span>
    }
}

<span class="kw">func</span> <span class="fn">countingSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>], <span class="kw">_</span> exp: <span class="ty">Int</span>) {
    <span class="kw">let</span> n = arr.<span class="fn">count</span>
    <span class="kw">var</span> output = <span class="ty">Array</span>(repeating: <span class="nm">0</span>, count: n)
    <span class="kw">var</span> count = <span class="ty">Array</span>(repeating: <span class="nm">0</span>, count: <span class="nm">10</span>)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..<n { count[(arr[i] / exp) % <span class="nm">10</span>] += <span class="nm">1</span> }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..<span class="nm">10</span> { count[i] += count[i - <span class="nm">1</span>] }
    <span class="kw">for</span> i <span class="kw">in</span> (<span class="nm">0</span>..<n).<span class="fn">reversed</span>() {
        <span class="kw">let</span> idx = (arr[i] / exp) % <span class="nm">10</span>
        count[idx] -= <span class="nm">1</span>
        output[count[idx]] = arr[i]
    }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..<n { arr[i] = output[i] }
}`,
    timsort: `<span class="kw">let</span> MIN_RUN = <span class="nm">32</span>

<span class="kw">func</span> <span class="fn">insertionSortRange</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>], lo: <span class="ty">Int</span>, hi: <span class="ty">Int</span>) {
    <span class="kw">for</span> i <span class="kw">in</span> (lo + <span class="nm">1</span>)...hi {
        <span class="kw">let</span> key = arr[i]
        <span class="kw">var</span> j = i - <span class="nm">1</span>
        <span class="kw">while</span> j >= lo && arr[j] > key {
            arr[j + <span class="nm">1</span>] = arr[j]
            j -= <span class="nm">1</span>
        }
        arr[j + <span class="nm">1</span>] = key
    }
}

<span class="kw">func</span> <span class="fn">merge</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>], lo: <span class="ty">Int</span>, mid: <span class="ty">Int</span>, hi: <span class="ty">Int</span>) {
    <span class="kw">let</span> left  = <span class="ty">Array</span>(arr[lo...mid])
    <span class="kw">let</span> right = <span class="ty">Array</span>(arr[mid + <span class="nm">1</span>...hi])

    <span class="kw">var</span> i = <span class="nm">0</span>
    <span class="kw">var</span> j = <span class="nm">0</span>
    <span class="kw">var</span> k = lo

    <span class="kw">while</span> i < left.<span class="fn">count</span> && j < right.<span class="fn">count</span> {
        <span class="kw">if</span> left[i] <= right[j] {
            arr[k] = left[i]
            i += <span class="nm">1</span>
        } <span class="kw">else</span> {
            arr[k] = right[j]
            j += <span class="nm">1</span>
        }
        k += <span class="nm">1</span>
    }
    <span class="kw">while</span> i < left.<span class="fn">count</span> {
        arr[k] = left[i]
        i += <span class="nm">1</span>
        k += <span class="nm">1</span>
    }
    <span class="kw">while</span> j < right.<span class="fn">count</span> {
        arr[k] = right[j]
        j += <span class="nm">1</span>
        k += <span class="nm">1</span>
    }
}

<span class="kw">func</span> <span class="fn">timSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">count</span>

    <span class="kw">var</span> i = <span class="nm">0</span>
    <span class="kw">while</span> i < n {
        <span class="fn">insertionSortRange</span>(&arr, lo: i, hi: <span class="fn">min</span>(i + MIN_RUN - <span class="nm">1</span>, n - <span class="nm">1</span>))
        i += MIN_RUN
    }

    <span class="kw">var</span> size = MIN_RUN
    <span class="kw">while</span> size < n {
        <span class="kw">var</span> lo = <span class="nm">0</span>

        <span class="kw">while</span> lo < n {
            <span class="kw">let</span> mid = <span class="fn">min</span>(lo + size - <span class="nm">1</span>, n - <span class="nm">1</span>)
            <span class="kw">let</span> hi  = <span class="fn">min</span>(lo + <span class="nm">2</span> * size - <span class="nm">1</span>, n - <span class="nm">1</span>)
            <span class="kw">if</span> mid < hi {
                <span class="fn">merge</span>(&arr, lo: lo, mid: mid, hi: hi)
            }
            lo += <span class="nm">2</span> * size
        }
        size *= <span class="nm">2</span>
    }
}`,
    linear: `<span class="kw">func</span> <span class="fn">linearSearch</span>(<span class="kw">_</span> arr: [<span class="ty">Int</span>], <span class="kw">_</span> target: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">for</span> (i, val) <span class="kw">in</span> arr.<span class="fn">enumerated</span>() {
        <span class="kw">if</span> val == target { <span class="kw">return</span> i }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    binary: `<span class="kw">func</span> <span class="fn">binarySearch</span>(<span class="kw">_</span> arr: [<span class="ty">Int</span>], <span class="kw">_</span> target: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">var</span> lo = <span class="nm">0</span>, hi = arr.<span class="fn">count</span> - <span class="nm">1</span>
    <span class="kw">while</span> lo <= hi {
        <span class="kw">let</span> mid = lo + (hi - lo) / <span class="nm">2</span>
        <span class="kw">if</span> arr[mid] == target {
            <span class="kw">return</span> mid
        }
        <span class="kw">if</span> arr[mid] < target {
            lo = mid + <span class="nm">1</span>
        } <span class="kw">else</span> {
            hi = mid - <span class="nm">1</span>
        }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    jump: `<span class="kw">func</span> <span class="fn">jumpSearch</span>(<span class="kw">_</span> arr: [<span class="ty">Int</span>], <span class="kw">_</span> target: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">let</span> n = arr.<span class="fn">count</span>
    <span class="kw">var</span> step = <span class="ty">Int</span>(<span class="fn">sqrt</span>(<span class="ty">Double</span>(n)))
    <span class="kw">var</span> prev = <span class="nm">0</span>
    <span class="kw">while</span> arr[<span class="fn">min</span>(step, n) - <span class="nm">1</span>] < target {
        prev = step
        step += <span class="ty">Int</span>(<span class="fn">sqrt</span>(<span class="ty">Double</span>(n)))
        <span class="kw">if</span> prev >= n { <span class="kw">return</span> -<span class="nm">1</span> }
    }
    <span class="kw">while</span> arr[prev] < target {
        prev += <span class="nm">1</span>
        <span class="kw">if</span> prev == <span class="fn">min</span>(step, n) {
            <span class="kw">return</span> -<span class="nm">1</span>
        }
    }
    <span class="kw">return</span> arr[prev] == target ? prev : -<span class="nm">1</span>
}`,
    interpolation: `<span class="kw">func</span> <span class="fn">interpolationSearch</span>(<span class="kw">_</span> arr: [<span class="ty">Int</span>], <span class="kw">_</span> target: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">var</span> lo = <span class="nm">0</span>, hi = arr.<span class="fn">count</span> - <span class="nm">1</span>
    <span class="kw">while</span> lo <= hi && target >= arr[lo] && target <= arr[hi] {
        <span class="kw">if</span> lo == hi { <span class="kw">return</span> arr[lo] == target ? lo : -<span class="nm">1</span> }
        <span class="kw">let</span> pos = lo + ((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo])
        <span class="kw">if</span> arr[pos] == target { <span class="kw">return</span> pos }
        <span class="kw">if</span> arr[pos] < target { lo = pos + <span class="nm">1</span> }
        <span class="kw">else</span> { hi = pos - <span class="nm">1</span> }
    }
    <span class="kw">return</span> -<span class="nm">1</span>
}`,
    exponential: `<span class="kw">func</span> <span class="fn">exponentialSearch</span>(<span class="kw">_</span> arr: [<span class="ty">Int</span>], <span class="kw">_</span> target: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">if</span> arr[<span class="nm">0</span>] == target { <span class="kw">return</span> <span class="nm">0</span> }
    <span class="kw">var</span> i = <span class="nm">1</span>
    <span class="kw">while</span> i < arr.<span class="fn">count</span> && arr[i] <= target { i *= <span class="nm">2</span> }
    <span class="kw">return</span> <span class="fn">binarySearch</span>(<span class="ty">Array</span>(arr[i/<span class="nm">2</span>..<span class="fn">min</span>(i, arr.<span class="fn">count</span>)]), target)
}`,
    bfs: `<span class="kw">func</span> <span class="fn">bfs</span>(graph: [[<span class="ty">Int</span>]], start: <span class="ty">Int</span>) {
    <span class="kw">var</span> visited = <span class="ty">Array</span>(repeating: <span class="kw">false</span>, count: graph.<span class="fn">count</span>)
    <span class="kw">var</span> queue = [start]
    visited[start] = <span class="kw">true</span>
    <span class="kw">while</span> !queue.<span class="fn">isEmpty</span> {
        <span class="kw">let</span> node = queue.<span class="fn">removeFirst</span>()
        <span class="kw">for</span> neighbor <span class="kw">in</span> graph[node] {
            <span class="kw">if</span> !visited[neighbor] {
                visited[neighbor] = <span class="kw">true</span>
                queue.<span class="fn">append</span>(neighbor)
            }
        }
    }
}`,
    dfs: `<span class="kw">func</span> <span class="fn">dfs</span>(graph: [[<span class="ty">Int</span>]], start: <span class="ty">Int</span>, visited: <span class="kw">inout</span> [<span class="ty">Bool</span>]) {
    visited[start] = <span class="kw">true</span>
    <span class="kw">for</span> neighbor <span class="kw">in</span> graph[start] {
        <span class="kw">if</span> !visited[neighbor] {
            <span class="fn">dfs</span>(graph: graph, start: neighbor, visited: &visited)
        }
    }
}`,
    fib: `<span class="kw">func</span> <span class="fn">fibonacci</span>(<span class="kw">_</span> n: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">var</span> dp = <span class="ty">Array</span>(repeating: <span class="nm">0</span>, count: n + <span class="nm">1</span>)
    <span class="kw">if</span> n >= <span class="nm">1</span> { dp[<span class="nm">1</span>] = <span class="nm">1</span> }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">2</span>...n {
        dp[i] = dp[i - <span class="nm">1</span>] + dp[i - <span class="nm">2</span>]
    }
    <span class="kw">return</span> dp[n]
}`,
    knapsack: `<span class="kw">func</span> <span class="fn">knapsack</span>(wt: [<span class="ty">Int</span>], val: [<span class="ty">Int</span>], W: <span class="ty">Int</span>) -> <span class="ty">Int</span> {
    <span class="kw">let</span> n = wt.<span class="fn">count</span>
    <span class="kw">var</span> dp = <span class="ty">Array</span>(repeating: <span class="ty">Array</span>(repeating: <span class="nm">0</span>, count: W + <span class="nm">1</span>), count: n + <span class="nm">1</span>)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>...n {
        <span class="kw">for</span> w <span class="kw">in</span> <span class="nm">0</span>...W {
            <span class="kw">if</span> wt[i - <span class="nm">1</span>] <= w {
                dp[i][w] = <span class="fn">max</span>(val[i - <span class="nm">1</span>] + dp[i - <span class="nm">1</span>][w - wt[i - <span class="nm">1</span>]], dp[i - <span class="nm">1</span>][w])
            } <span class="kw">else</span> {
                dp[i][w] = dp[i - <span class="nm">1</span>][w]
            }
        }
    }
    <span class="kw">return</span> dp[n][W]
}`,
    counting: `<span class="kw">func</span> <span class="fn">countingSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">guard let</span> max = arr.<span class="fn">max</span>() <span class="kw">else</span> { <span class="kw">return</span> }
    <span class="kw">var</span> count = <span class="ty">Array</span>(repeating: <span class="nm">0</span>, count: max + <span class="nm">1</span>)
    <span class="kw">for</span> x <span class="kw">in</span> arr { count[x] += <span class="nm">1</span> }
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>...max { count[i] += count[i - <span class="nm">1</span>] }
    <span class="kw">var</span> output = <span class="ty">Array</span>(repeating: <span class="nm">0</span>, count: arr.<span class="fn">count</span>)
    <span class="kw">for</span> i <span class="kw">in</span> (<span class="nm">0</span>..<arr.<span class="fn">count</span>).<span class="fn">reversed</span>() {
        count[arr[i]] -= <span class="nm">1</span>
        output[count[arr[i]]] = arr[i]
    }
    arr = output
}`,
    dijkstra: `<span class="kw">func</span> <span class="fn">dijkstra</span>(graph: [[(node: <span class="ty">Int</span>, w: <span class="ty">Int</span>)]], src: <span class="ty">Int</span>) -> [<span class="ty">Int</span>] {
    <span class="kw">let</span> n = graph.<span class="fn">count</span>
    <span class="kw">var</span> dist = <span class="ty">Array</span>(repeating: <span class="ty">Int</span>.<span class="fn">max</span>, count: n)
    <span class="kw">var</span> visited = <span class="ty">Array</span>(repeating: <span class="kw">false</span>, count: n)
    dist[src] = <span class="nm">0</span>
    <span class="kw">for</span> <span class="kw">_</span> <span class="kw">in</span> <span class="nm">0</span>..<n {
        <span class="kw">let</span> u = (<span class="nm">0</span>..<n).<span class="fn">filter</span> { !visited[$<span class="nm">0</span>] }
                         .<span class="fn">min</span>(by: { dist[$<span class="nm">0</span>] < dist[$<span class="nm">1</span>] })!
        visited[u] = <span class="kw">true</span>
        <span class="kw">for</span> (v, w) <span class="kw">in</span> graph[u] {
            <span class="kw">if</span> dist[u] != <span class="ty">Int</span>.<span class="fn">max</span> && dist[u] + w < dist[v] {
                dist[v] = dist[u] + w
            }
        }
    }
    <span class="kw">return</span> dist
}`,
    lcs: `<span class="kw">func</span> <span class="fn">lcs</span>(<span class="kw">_</span> a: [<span class="ty">Int</span>], <span class="kw">_</span> b: [<span class="ty">Int</span>]) -> <span class="ty">Int</span> {
    <span class="kw">let</span> m = a.<span class="fn">count</span>, n = b.<span class="fn">count</span>
    <span class="kw">var</span> dp = <span class="ty">Array</span>(repeating: <span class="ty">Array</span>(repeating: <span class="nm">0</span>, count: n+<span class="nm">1</span>), count: m+<span class="nm">1</span>)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>...m {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">1</span>...n {
            <span class="kw">if</span> a[i-<span class="nm">1</span>] == b[j-<span class="nm">1</span>] { dp[i][j] = dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>] + <span class="nm">1</span> }
            <span class="kw">else</span> { dp[i][j] = <span class="fn">max</span>(dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>]) }
        }
    }
    <span class="kw">return</span> dp[m][n]
}`,
    lis: `<span class="kw">func</span> <span class="fn">lis</span>(<span class="kw">_</span> arr: [<span class="ty">Int</span>]) -> <span class="ty">Int</span> {
    <span class="kw">let</span> n = arr.<span class="fn">count</span>
    <span class="kw">var</span> dp = <span class="ty">Array</span>(repeating: <span class="nm">1</span>, count: n)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..< n {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..< i {
            <span class="kw">if</span> arr[j] < arr[i] {
                dp[i] = <span class="fn">max</span>(dp[i], dp[j] + <span class="nm">1</span>)
            }
        }
    }
    <span class="kw">return</span> dp.<span class="fn">max</span>()!
}`,
  },
};
Object.assign(CODES.rust, {
  lcs: `<span class="kw">fn</span> <span class="fn">lcs</span>(a: &[<span class="ty">i32</span>], b: &[<span class="ty">i32</span>]) -> <span class="ty">usize</span> {
    <span class="kw">let</span> (m, n) = (a.<span class="fn">len</span>(), b.<span class="fn">len</span>());
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="fn">vec!</span>[<span class="nm">0usize</span>; n + <span class="nm">1</span>]; m + <span class="nm">1</span>];
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..=m {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">1</span>..=n {
            dp[i][j] = <span class="kw">if</span> a[i-<span class="nm">1</span>] == b[j-<span class="nm">1</span>] { dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>] + <span class="nm">1</span> }
                       <span class="kw">else</span> { dp[i-<span class="nm">1</span>][j].<span class="fn">max</span>(dp[i][j-<span class="nm">1</span>]) };
        }
    }
    dp[m][n]
}`,
  lis: `<span class="kw">fn</span> <span class="fn">lis</span>(arr: &[<span class="ty">i32</span>]) -> <span class="ty">usize</span> {
    <span class="kw">let</span> n = arr.<span class="fn">len</span>();
    <span class="kw">let mut</span> dp = <span class="fn">vec!</span>[<span class="nm">1usize</span>; n];
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..n {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..i {
            <span class="kw">if</span> arr[j] < arr[i] {
                dp[i] = dp[i].<span class="fn">max</span>(dp[j] + <span class="nm">1</span>);
            }
        }
    }
    *dp.<span class="fn">iter</span>().<span class="fn">max</span>().<span class="fn">unwrap</span>()
}`,
});
Object.assign(CODES.kotlin, {
  lcs: `<span class="kw">fun</span> <span class="fn">lcs</span>(a: <span class="ty">IntArray</span>, b: <span class="ty">IntArray</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> m = a.size; <span class="kw">val</span> n = b.size
    <span class="kw">val</span> dp = <span class="ty">Array</span>(m + <span class="nm">1</span>) { <span class="ty">IntArray</span>(n + <span class="nm">1</span>) }
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span>..m)
        <span class="kw">for</span> (j <span class="kw">in</span> <span class="nm">1</span>..n)
            dp[i][j] = <span class="kw">if</span> (a[i-<span class="nm">1</span>] == b[j-<span class="nm">1</span>]) dp[i-<span class="nm">1</span>][j-<span class="nm">1</span>] + <span class="nm">1</span>
                       <span class="kw">else</span> <span class="fn">maxOf</span>(dp[i-<span class="nm">1</span>][j], dp[i][j-<span class="nm">1</span>])
    <span class="kw">return</span> dp[m][n]
}`,
  lis: `<span class="kw">fun</span> <span class="fn">lis</span>(arr: <span class="ty">IntArray</span>): <span class="ty">Int</span> {
    <span class="kw">val</span> n = arr.size
    <span class="kw">val</span> dp = <span class="ty">IntArray</span>(n) { <span class="nm">1</span> }
    <span class="kw">for</span> (i <span class="kw">in</span> <span class="nm">1</span> until n)
        <span class="kw">for</span> (j <span class="kw">in</span> <span class="nm">0</span> until i)
            <span class="kw">if</span> (arr[j] < arr[i])
                dp[i] = <span class="fn">maxOf</span>(dp[i], dp[j] + <span class="nm">1</span>)
    <span class="kw">return</span> dp.<span class="fn">max</span>()!!
}`,
});