// Helpers several screens use: picking words, topic progress, small HTML pieces.

import { WORDS } from "../data/words.js";
import { LEVELS } from "../data/levels.js";
import { getState } from "../core/store.js";
import { isDue, statusOf } from "../core/srs.js";
import { daysBetween, esc } from "../core/util.js";

export function wordsInTopic(topicId) {
  return WORDS.filter(w => w.topic === topicId);
}

// Words due for review, most overdue first.
export function dueIds(today) {
  const items = getState().items;
  return WORDS.filter(w => isDue(items[w.id], today))
    .sort((a, b) => daysBetween(items[b.id].due, today) - daysBetween(items[a.id].due, today))
    .map(w => w.id);
}

// Words never studied, in lesson order (level, then topic order, then list order).
export function newIds(limit = 10, topicId = null) {
  const items = getState().items;
  const order = LEVELS.flatMap(l => l.topics.map(t => t.id));
  return WORDS.filter(w => (!items[w.id] || items[w.id].box === 0) && (!topicId || w.topic === topicId))
    .sort((a, b) => a.level - b.level || order.indexOf(a.topic) - order.indexOf(b.topic))
    .slice(0, limit)
    .map(w => w.id);
}

// Share of a topic's words that are Known or Mastered (0–1).
export function topicMastery(topicId) {
  const words = wordsInTopic(topicId);
  if (!words.length) return null;
  const items = getState().items;
  return words.filter(w => ["known", "mastered"].includes(statusOf(items[w.id]))).length / words.length;
}

export function bar(fraction, cls = "") {
  const w = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
  return `<div class="bar ${cls}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${w}"><div style="width:${w}%"></div></div>`;
}

export function header(eyebrow, title, right = "") {
  return `<header class="head"><div><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1></div>${right}</header>`;
}

export function changeHtml(change) {
  if (Math.abs(change) < 0.0005) return `<span class="change">no change</span>`;
  const up = change > 0;
  const v = Math.abs(change);
  return `<span class="change ${up ? "up" : "down"}">${up ? "▲" : "▼"} ${v < 10 ? v.toFixed(2) : v.toFixed(1)}%</span>`;
}
