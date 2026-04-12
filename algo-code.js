let currentAlgo = "bubble";
let currentSearch = "linear";
let currentGraph = "bfs";
let currentDP = "fib";
let currentLang = "js";
let running = false;
let sortArr = [],
  searchArr = [];

const COLORS = {
  default: "#4f8ef7",
  comparing: "#f0a030",
  swapping: "#e85555",
  sorted: "#3ec98a",
  pivot: "#9b6dff",
  found: "#3ec98a",
  excluded: "#2a2a35",
};

const CODES = {
  js: {
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
  <span class="kw">let</span> largest = i, l = <span class="nm">2</span>*i + <span class="nm">1</span>, r = <span class="nm">2</span>*i + <span class="nm">2</span>;
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
    bfs: `<span class="kw">function</span> <span class="fn">bfs</span>(graph, start) {
  <span class="kw">const</span> visited = <span class="kw">new</span> <span class="ty">Set</span>();
  <span class="kw">const</span> queue = [start];
  visited.<span class="fn">add</span>(start);
  <span class="kw">while</span> (queue.<span class="fn">length</span> > <span class="nm">0</span>) {
    <span class="kw">const</span> node = queue.<span class="fn">shift</span>();
    <span class="cm">// обработка node</span>
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
  <span class="cm">// обработка start</span>
  <span class="kw">for</span> (<span class="kw">const</span> neighbor <span class="kw">of</span> graph[start]) {
    <span class="kw">if</span> (!visited.<span class="fn">has</span>(neighbor)) {
      <span class="fn">dfs</span>(graph, neighbor, visited);
    }
  }
  <span class="kw">return</span> visited;
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
  },
  python: {
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
  },
  cpp: {
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
    bfs: `<span class="kw">void</span> <span class="fn">bfs</span>(<span class="kw">const</span> <span class="ty">vector</span><<span class="ty">vector</span><<span class="ty">int</span>>>& graph, <span class="ty">int</span> start) {
    <span class="ty">vector</span><<span class="ty">bool</span>> visited(graph.<span class="fn">size</span>(), <span class="kw">false</span>);
    <span class="ty">queue</span><<span class="ty">int</span>> q;
    q.<span class="fn">push</span>(start);
    visited[start] = <span class="kw">true</span>;
    <span class="kw">while</span> (!q.<span class="fn">empty</span>()) {
        <span class="ty">int</span> node = q.<span class="fn">front</span>(); q.<span class="fn">pop</span>();
        <span class="cm">// обработка node</span>
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
    <span class="cm">// обработка start</span>
    <span class="kw">for</span> (<span class="ty">int</span> neighbor : graph[start]) {
        <span class="kw">if</span> (!visited[neighbor])
            <span class="fn">dfs</span>(graph, neighbor, visited);
    }
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
  },
  java: {
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
        <span class="cm">// обработка node</span>
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
    <span class="cm">// обработка start</span>
    <span class="kw">for</span> (<span class="ty">int</span> neighbor : graph.<span class="fn">get</span>(start)) {
        <span class="kw">if</span> (!visited[neighbor])
            <span class="fn">dfs</span>(graph, neighbor, visited);
    }
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
  },
};

Object.assign(CODES, {
  go: {
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
        <span class="cm">// обработка node</span>
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
    <span class="cm">// обработка start</span>
    <span class="kw">for</span> _, neighbor := <span class="kw">range</span> graph[start] {
        <span class="kw">if</span> !visited[neighbor] {
            <span class="fn">dfs</span>(graph, neighbor, visited)
        }
    }
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
  },
  rust: {
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
        <span class="cm">// обработка node</span>
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
    <span class="cm">// обработка start</span>
    <span class="kw">for</span> &neighbor <span class="kw">in</span> &graph[start] {
        <span class="kw">if</span> !visited[neighbor] {
            <span class="fn">dfs</span>(graph, neighbor, visited);
        }
    }
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
  },
  kotlin: {
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
        <span class="cm">// обработка node</span>
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
    <span class="cm">// обработка start</span>
    <span class="kw">for</span> (neighbor <span class="kw">in</span> graph[start]) {
        <span class="kw">if</span> (!visited[neighbor]) {
            <span class="fn">dfs</span>(graph, neighbor, visited)
        }
    }
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
    bubble: `<span class="kw">func</span> <span class="fn">bubbleSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">count</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..<n-<span class="nm">1</span> {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..<n-i-<span class="nm">1</span> {
            <span class="kw">if</span> arr[j] > arr[j+<span class="nm">1</span>] {
                arr.<span class="fn">swapAt</span>(j, j+<span class="nm">1</span>)
            }
        }
    }
}`,
    selection: `<span class="kw">func</span> <span class="fn">selectionSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">let</span> n = arr.<span class="fn">count</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">0</span>..<n-<span class="nm">1</span> {
        <span class="kw">var</span> minIdx = i
        <span class="kw">for</span> j <span class="kw">in</span> i+<span class="nm">1</span>..<n {
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
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..<arr.<span class="fn">count</span> {
        <span class="kw">let</span> key = arr[i]
        <span class="kw">var</span> j = i - <span class="nm">1</span>
        <span class="kw">while</span> j >= <span class="nm">0</span> && arr[j] > key {
            arr[j+<span class="nm">1</span>] = arr[j]
            j -= <span class="nm">1</span>
        }
        arr[j+<span class="nm">1</span>] = key
    }
}`,
    shell: `<span class="kw">func</span> <span class="fn">shellSort</span>(<span class="kw">_</span> arr: <span class="kw">inout</span> [<span class="ty">Int</span>]) {
    <span class="kw">var</span> gap = arr.<span class="fn">count</span> / <span class="nm">2</span>
    <span class="kw">while</span> gap > <span class="nm">0</span> {
        <span class="kw">for</span> i <span class="kw">in</span> gap..<arr.<span class="fn">count</span> {
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
<span class="cm">// вызов: quickSort(&arr, 0, arr.count - 1)</span>`,
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
        <span class="kw">if</span> arr[mid] == target { <span class="kw">return</span> mid }
        <span class="kw">if</span> arr[mid] < target { lo = mid + <span class="nm">1</span> }
        <span class="kw">else</span> { hi = mid - <span class="nm">1</span> }
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
        <span class="kw">if</span> prev == <span class="fn">min</span>(step, n) { <span class="kw">return</span> -<span class="nm">1</span> }
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
        <span class="cm">// обработка node</span>
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
    <span class="cm">// обработка start</span>
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
    <span class="kw">for</span> i <span class="kw">in</span> <span class="nm">1</span>..<n {
        <span class="kw">for</span> j <span class="kw">in</span> <span class="nm">0</span>..<i {
            <span class="kw">if</span> arr[j] < arr[i] {
                dp[i] = <span class="fn">max</span>(dp[i], dp[j] + <span class="nm">1</span>)
            }
        }
    }
    <span class="kw">return</span> dp.<span class="fn">max</span>()!
}`,
  },
});

Object.assign(CODES.js, {
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
});
Object.assign(CODES.python, {
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
});
Object.assign(CODES.cpp, {
  counting: `<span class="kw">void</span> <span class="fn">countingSort</span>(<span class="ty">vector</span><<span class="ty">int</span>>& arr) {
    <span class="ty">int</span> max = *<span class="fn">max_element</span>(arr.<span class="fn">begin</span>(), arr.<span class="fn">end</span>());
    <span class="ty">vector</span><<span class="ty">int</span>> count(max + <span class="nm">1</span>, <span class="nm">0</span>), output(arr.<span class="fn">size</span>());
    <span class="kw">for</span> (<span class="ty">int</span> x : arr) count[x]++;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= max; i++) count[i] += count[i-<span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = arr.<span class="fn">size</span>()-<span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
        output[--count[arr[i]]] = arr[i];
    arr = output;
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
});
Object.assign(CODES.java, {
  counting: `<span class="kw">public static int</span>[] <span class="fn">countingSort</span>(<span class="ty">int</span>[] arr) {
    <span class="ty">int</span> max = Arrays.<span class="fn">stream</span>(arr).<span class="fn">max</span>().<span class="fn">getAsInt</span>();
    <span class="ty">int</span>[] count = <span class="kw">new int</span>[max + <span class="nm">1</span>], output = <span class="kw">new int</span>[arr.length];
    <span class="kw">for</span> (<span class="ty">int</span> x : arr) count[x]++;
    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i <= max; i++) count[i] += count[i-<span class="nm">1</span>];
    <span class="kw">for</span> (<span class="ty">int</span> i = arr.length-<span class="nm">1</span>; i >= <span class="nm">0</span>; i--)
        output[--count[arr[i]]] = arr[i];
    <span class="kw">return</span> output;
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
});
Object.assign(CODES.go, {
  counting: `<span class="kw">func</span> <span class="fn">countingSort</span>(arr []<span class="ty">int</span>) []<span class="ty">int</span> {
    max := arr[<span class="nm">0</span>]
    <span class="kw">for</span> _, v := <span class="kw">range</span> arr { <span class="kw">if</span> v > max { max = v } }
    count := <span class="fn">make</span>([]<span class="ty">int</span>, max+<span class="nm">1</span>)
    output := <span class="fn">make</span>([]<span class="ty">int</span>, <span class="fn">len</span>(arr))
    <span class="kw">for</span> _, x := <span class="kw">range</span> arr { count[x]++ }
    <span class="kw">for</span> i := <span class="nm">1</span>; i <= max; i++ { count[i] += count[i-<span class="nm">1</span>] }
    <span class="kw">for</span> i := <span class="fn">len</span>(arr) - <span class="nm">1</span>; i >= <span class="nm">0</span>; i-- {
        count[arr[i]]--
        output[count[arr[i]]] = arr[i]
    }
    <span class="kw">return</span> output
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
});
Object.assign(CODES.rust, {
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
