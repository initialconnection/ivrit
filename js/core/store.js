// Saves and loads the learner's progress in this browser (localStorage).
// Everything the app knows about the learner lives in one object, `state`.

import { todayKey } from "./util.js";
import { review } from "./srs.js";

const KEY = "ivrit-progress-v1";
const VERSION = 1;

function blank() {
  return {
    v: VERSION,
    created: todayKey(),
    lastActive: null,          // last day with at least one answer
    items: {},                 // word id -> { box, due, last, seen, right, wrong }
    days: {},                  // date -> { answers, correct, seconds, learned }
    fluency: {},               // date -> score that day
    recent: [],                // last 50 answers, true/false, for accuracy
    goal: null,                // { level, deadline, start }
    letters: {},               // letter id -> same shape as items
    vowels: {},                // vowel id -> same shape as items
    alefbet: { done: [], ladder: {} }, // finished lesson ids; reading ladder rung -> { seen, right }
    roots: {},                 // root id -> same shape as items (from root games)
    best: {},                  // game -> best score
    settings: { dailyMinutes: 15, direction: "he-en", script: "tr" }
  };
}

let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.v === VERSION) return merge(saved);
  } catch (e) { /* storage blocked or corrupt: start fresh */ }
  return blank();
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; }
}

export function getState() { return state; }

export function today(key = todayKey()) {
  if (!state.days[key]) state.days[key] = { answers: 0, correct: 0, seconds: 0, learned: 0 };
  return state.days[key];
}

// Record one answer. `credits` = what the answer counts toward, as [kind, id] pairs,
// where kind is "items" (words), "letters" or "vowels". `seconds` = time spent (capped at 60).
export function recordAnswer(credits, correct, seconds, ladderRung = null) {
  const key = todayKey();
  const list = typeof credits === "string" ? [["items", credits]] : credits;
  for (const [kind, id] of list) {
    const before = state[kind][id];
    const after = review(before, correct, key);
    state[kind][id] = after;
    if (kind === "items" && (!before || before.box < 3) && after.box >= 3) today(key).learned++;
  }
  if (ladderRung) {
    const r = state.alefbet.ladder[ladderRung] || (state.alefbet.ladder[ladderRung] = { seen: 0, right: 0 });
    r.seen++;
    if (correct) r.right++;
  }
  const day = today(key);
  day.answers++;
  if (correct) day.correct++;
  day.seconds += Math.max(0, Math.min(seconds, 60));
  state.recent.push(!!correct);
  if (state.recent.length > 50) state.recent.shift();
  state.lastActive = key;
  save();
}

export function markLessonDone(id) {
  if (!state.alefbet.done.includes(id)) state.alefbet.done.push(id);
  save();
}

export function setGoal(goal) { state.goal = goal; save(); }
export function setSetting(name, value) { state.settings[name] = value; save(); }

// ---- Backup ----
export function exportText() {
  return JSON.stringify({ app: "ivrit", exported: new Date().toISOString(), state }, null, 2);
}

export function importText(text) {
  const data = JSON.parse(text);
  const incoming = data && data.app === "ivrit" ? data.state : null;
  if (!incoming || incoming.v !== VERSION || typeof incoming.items !== "object") {
    throw new Error("This file isn't an Ivrit backup.");
  }
  state = merge(incoming);
  save();
}

// Fills in anything an older save is missing, so new features work with old progress.
function merge(saved) {
  const b = blank();
  return { ...b, ...saved, settings: { ...b.settings, ...saved.settings }, alefbet: { ...b.alefbet, ...saved.alefbet } };
}

export function resetAll() { state = blank(); save(); }
