// The overall fluency score: 0–100% of the whole program.
// It rises with correct answers and practice, and drifts down when reviews are missed.
// Each skill area has a weight; areas arrive in later phases and start counting then.

import { WORDS } from "../data/words.js";
import { LEVELS, PROGRAM } from "../data/levels.js";
import { strength, statusOf } from "./srs.js";
import { daysBetween } from "./util.js";

export const AREAS = [
  { id: "vocab", name: "Vocabulary", weight: 40, phase: 1 },
  { id: "alefbet", name: "Letters & vowels", weight: 15, phase: 2 },
  { id: "roots", name: "Roots", weight: 15, phase: 3 },
  { id: "grammar", name: "Grammar & sentences", weight: 15, phase: 4 },
  { id: "reading", name: "Reading & listening", weight: 15, phase: 5 }
];

export function wordCounts(state) {
  const counts = { new: 0, learning: 0, known: 0, mastered: 0 };
  for (const w of WORDS) counts[statusOf(state.items[w.id])]++;
  return counts;
}

export function knownWords(state) {
  return Object.values(state.items).filter(it => it.box >= 3).length;
}

// Accuracy over the last 50 answers nudges the score by up to 10%.
export function accuracy(state) {
  const r = state.recent;
  return r.length ? r.filter(Boolean).length / r.length : null;
}

export function compute(state, today) {
  const acc = accuracy(state);
  const factor = acc === null || state.recent.length < 10 ? 1 : 0.9 + 0.1 * acc;

  let vocabSum = 0;
  for (const id in state.items) vocabSum += strength(state.items[id], today);
  const values = { vocab: Math.min(1, vocabSum / PROGRAM.words) };

  const parts = AREAS.map(a => ({ ...a, value: values[a.id] ?? 0, live: a.id in values }));
  const score = parts.reduce((s, p) => s + p.weight * p.value, 0) * factor;
  return { score, parts, factor, accuracy: acc };
}

// Saves today's score and works out what changed since the last visit.
export function update(state, today) {
  const result = compute(state, today);
  const earlier = Object.keys(state.fluency).filter(k => k < today).sort();
  const prevKey = earlier.at(-1);
  const prev = prevKey ? state.fluency[prevKey] : 0;
  state.fluency[today] = result.score;

  let daysAway = 0, drop = 0;
  if (state.lastActive && state.lastActive < today) {
    daysAway = daysBetween(state.lastActive, today);
    const then = state.fluency[state.lastActive] ?? prev;
    drop = Math.max(0, then - result.score);
  }
  return { ...result, change: result.score - prev, hadYesterday: !!prevKey, daysAway, drop };
}

// Which ulpan level the learner is in, based on words known.
export function currentLevel(state) {
  const known = knownWords(state);
  const idx = LEVELS.findIndex(l => known < l.words);
  const level = LEVELS.at(idx === -1 ? -1 : idx);
  const prevWords = idx > 0 ? LEVELS.at(idx - 1).words : 0;
  const toNext = idx === -1 ? 1 : (known - prevWords) / (level.words - prevWords);
  return { level, known, progress: Math.max(0, Math.min(1, toNext)) };
}

// Consecutive days with practice, counting back from today (or yesterday if not yet today).
export function streak(state, today, addDaysFn) {
  let n = 0, key = state.days[today]?.answers ? today : addDaysFn(today, -1);
  while (state.days[key]?.answers) { n++; key = addDaysFn(key, -1); }
  return n;
}
