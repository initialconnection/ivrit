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
    settings: { dailyMinutes: 15, direction: "he-en" }
  };
}

let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.v === VERSION) return { ...blank(), ...saved, settings: { ...blank().settings, ...saved.settings } };
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

// Record one answer for a word. `seconds` = time spent on it (capped by the caller).
export function recordAnswer(wordId, correct, seconds) {
  const key = todayKey();
  const before = state.items[wordId];
  const after = review(before, correct, key);
  state.items[wordId] = after;
  const day = today(key);
  day.answers++;
  if (correct) day.correct++;
  day.seconds += Math.max(0, Math.min(seconds, 60));
  if ((!before || before.box < 3) && after.box >= 3) day.learned++;
  state.recent.push(!!correct);
  if (state.recent.length > 50) state.recent.shift();
  state.lastActive = key;
  save();
  return after;
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
  state = { ...blank(), ...incoming, settings: { ...blank().settings, ...incoming.settings } };
  save();
}

export function resetAll() { state = blank(); save(); }
