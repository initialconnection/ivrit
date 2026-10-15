// Roots: which words grow from each root, how well each root is known, and root quiz questions.

import { WORDS } from "../data/words.js";
import { ROOTS, ROOT_BY_ID } from "../data/roots.js";
import { PROGRAM } from "../data/levels.js";
import { strength, statusOf } from "./srs.js";
import { shuffle } from "./util.js";

export function rootWords(rootId) {
  return WORDS.filter(w => w.root === rootId);
}

// Roots that have at least one word in the app.
export function activeRoots() {
  const used = new Set(WORDS.map(w => w.root).filter(Boolean));
  return ROOTS.filter(r => used.has(r.id));
}

// 0–1: half from root games, half from how well its words are known.
export function rootStrength(state, rootId, today) {
  const words = rootWords(rootId);
  const avg = words.length ? words.reduce((s, w) => s + strength(state.items[w.id], today), 0) / words.length : 0;
  return 0.5 * strength(state.roots[rootId], today) + 0.5 * avg;
}

export function rootInfo(state, rootId, today) {
  const words = rootWords(rootId);
  const known = words.filter(w => ["known", "mastered"].includes(statusOf(state.items[w.id]))).length;
  return { root: ROOT_BY_ID[rootId], words, known, strength: rootStrength(state, rootId, today), status: statusOf(state.roots[rootId]) };
}

// For the fluency score's "Roots" area.
export function rootsValue(state, today) {
  const sum = activeRoots().reduce((s, r) => s + rootStrength(state, r.id, today), 0);
  return Math.min(1, sum / PROGRAM.roots);
}

// ---------- Questions (multiple-choice format used by mc.js) ----------

function label(w, script) {
  return script === "tr" ? { text: w.tr } : script === "he" ? { he: w.he } : { text: w.tr, sub: w.he };
}

// "Which root does this word come from?"
export function whichRootQ(word, script) {
  const r = ROOT_BY_ID[word.root];
  const others = shuffle(activeRoots().filter(x => x.id !== r.id)).slice(0, 3);
  const options = shuffle([r, ...others]);
  return {
    prompt: "Which root is this word built from?",
    show: script === "tr" ? null : word.he, showLatin: `${word.tr} · ${word.en}`,
    options: options.map(o => ({ text: `${o.tr}`, sub: o.meaning })),
    answer: options.indexOf(r),
    credits: [["roots", r.id], ["items", word.id]],
    explain: `${word.tr} comes from ${r.tr} (${r.he}), “${r.meaning}”.`
  };
}

// "Which word comes from this root?"
export function whichWordQ(rootId, script) {
  const r = ROOT_BY_ID[rootId];
  const family = rootWords(rootId);
  const target = shuffle(family).at(0);
  const others = shuffle(WORDS.filter(w => w.root !== rootId)).slice(0, 3);
  const options = shuffle([target, ...others]);
  return {
    prompt: `Which word comes from the root ${r.tr}, “${r.meaning}”?`,
    show: r.he, showLatin: null,
    options: options.map(o => label(o, script)),
    answer: options.indexOf(target),
    credits: [["roots", r.id], ["items", target.id]],
    explain: `${target.tr} (${target.en}) is built from ${r.tr}.`
  };
}

export function rootQuestions(state, n = 10, onlyRoot = null) {
  const script = state.settings.script;
  const roots = onlyRoot ? [ROOT_BY_ID[onlyRoot]] : activeRoots();
  const qs = [];
  for (let i = 0; i < n; i++) {
    const r = roots.at(Math.floor(Math.random() * roots.length));
    if (Math.random() < 0.5) qs.push(whichWordQ(r.id, script));
    else qs.push(whichRootQ(shuffle(rootWords(r.id)).at(0), script));
  }
  return qs;
}

// Multiple-choice meaning question for a word: "What does this mean?"
export function meaningQ(word, pool, script) {
  const others = shuffle(pool.filter(w => w.id !== word.id && w.en !== word.en)).slice(0, 3);
  const options = shuffle([word, ...others]);
  return {
    prompt: "What does this mean?",
    show: script === "tr" ? null : word.he, showLatin: script === "he" ? null : word.tr,
    options: options.map(o => ({ text: o.en })),
    answer: options.indexOf(word),
    credits: [["items", word.id]],
    explain: `${word.tr} = ${word.en}.${word.tip ? " " + word.tip : ""}`
  };
}
