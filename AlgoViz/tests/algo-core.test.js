import { test } from "node:test";
import assert from "node:assert/strict";
import "../src/algo-core.js";

const C = globalThis.AlgoCore;

const SAMPLES = [
  [],
  [1],
  [2, 1],
  [5, 3, 1, 4, 2],
  [9, 9, 9],
  [3, -1, 0, 7, -5, 2, 2, 8],
  [10, 20, 30, 40, 50],
  [50, 40, 30, 20, 10],
];

const sorts = [
  "bubbleSort",
  "insertionSort",
  "mergeSort",
  "quickSort",
  "heapSort",
];

for (const name of sorts) {
  test(`${name}: matches Array.prototype.sort and is pure`, () => {
    for (const s of SAMPLES) {
      const expected = s.slice().sort((a, b) => a - b);
      const input = s.slice();
      const out = C[name](input);
      assert.deepEqual(out, expected, `${name} on ${JSON.stringify(s)}`);
      assert.ok(C.isSorted(out));
      assert.deepEqual(input, s, `${name} must not mutate its input`);
    }
  });
}

test("isSorted", () => {
  assert.equal(C.isSorted([1, 2, 2, 3]), true);
  assert.equal(C.isSorted([1, 3, 2]), false);
  assert.equal(C.isSorted([]), true);
});

test("linearSearch", () => {
  assert.equal(C.linearSearch([4, 8, 15, 16, 23], 15), 2);
  assert.equal(C.linearSearch([4, 8, 15], 99), -1);
  assert.equal(C.linearSearch([], 1), -1);
});

test("binarySearch (sorted input)", () => {
  const a = [1, 3, 5, 7, 9, 11];
  for (let i = 0; i < a.length; i++) assert.equal(C.binarySearch(a, a[i]), i);
  assert.equal(C.binarySearch(a, 2), -1);
  assert.equal(C.binarySearch(a, 12), -1);
  assert.equal(C.binarySearch([], 1), -1);
});

test("BST: insert/search/inorder", () => {
  const vals = [50, 30, 70, 20, 40, 60, 80, 35];
  const root = C.bstFromArray(vals);
  assert.deepEqual(
    C.bstInorder(root),
    [...new Set(vals)].sort((a, b) => a - b),
  );
  assert.equal(C.bstSearch(root, 35).val, 35);
  assert.equal(C.bstSearch(root, 99), null);
  const r2 = C.bstInsert(C.bstFromArray([5, 5, 5]), 5);
  assert.deepEqual(C.bstInorder(r2), [5]);
});

test("KMP: buildLPS", () => {
  assert.deepEqual(C.kmpBuildLPS("ABABCABAB"), [0, 0, 1, 2, 0, 1, 2, 3, 4]);
  assert.deepEqual(C.kmpBuildLPS("AAAA"), [0, 1, 2, 3]);
  assert.deepEqual(C.kmpBuildLPS("ABCDE"), [0, 0, 0, 0, 0]);
});

test("KMP and Rabin-Karp agree with String.indexOf", () => {
  const cases = [
    ["ABABDABACDABABCABAB", "ABABCABAB"],
    ["hello world", "world"],
    ["hello world", "xyz"],
    ["aaaaaa", "aaa"],
    ["abc", "abcd"],
    ["mississippi", "issip"],
    ["", "a"],
    ["a", ""],
  ];
  for (const [text, pat] of cases) {
    const expected = text.indexOf(pat);
    assert.equal(C.kmpSearch(text, pat), expected, `KMP "${text}"/"${pat}"`);
    assert.equal(C.rabinKarp(text, pat), expected, `RK "${text}"/"${pat}"`);
  }
});

test("N-Queens: produces valid solutions for N=4..8", () => {
  for (let N = 4; N <= 8; N++) {
    const board = C.solveNQueens(N);
    assert.ok(board, `solution should exist for N=${N}`);
    assert.equal(board.length, N);
    for (let c1 = 0; c1 < N; c1++)
      for (let c2 = c1 + 1; c2 < N; c2++) {
        assert.notEqual(board[c1], board[c2], "same row");
        assert.notEqual(
          Math.abs(board[c1] - board[c2]),
          c2 - c1,
          "same diagonal",
        );
      }
  }
  assert.equal(C.solveNQueens(3), null, "no solution for N=3");
});

test("DSU: union/find/connected", () => {
  const dsu = C.makeDSU(6);
  assert.equal(dsu.connected(0, 1), false);
  assert.equal(dsu.union(0, 1), true);
  assert.equal(dsu.union(1, 2), true);
  assert.equal(dsu.connected(0, 2), true);
  assert.equal(dsu.union(0, 2), false, "already connected");
  assert.equal(dsu.connected(0, 5), false);
});

test("hashFn handles non-negative results", () => {
  assert.equal(C.hashFn(27, 11), 5);
  assert.equal(C.hashFn(0, 7), 0);
  assert.equal(C.hashFn(-3, 7), 4, "negative keys wrap into [0, size)");
});
