// Spaced repetition: each word sits in a "box" from 0 (new) to 5 (mastered).
// A correct answer moves it up a box and schedules the next review further away;
// a mistake sends it back to box 1 and it comes up again soon.

import { addDays, daysBetween } from "./util.js";

// Days until the next review for each box.
export const INTERVALS = [0, 1, 3, 7, 16, 35];

export const STATUS = [
  { id: "new", name: "New", boxes: [0] },
  { id: "learning", name: "Learning", boxes: [1, 2] },
  { id: "known", name: "Known", boxes: [3, 4] },
  { id: "mastered", name: "Mastered", boxes: [5] }
];

export function newItem() {
  return { box: 0, due: null, last: null, seen: 0, right: 0, wrong: 0 };
}

export function statusOf(item) {
  const box = item ? item.box : 0;
  return STATUS.find(s => s.boxes.includes(box)).id;
}

// Apply one answer to an item and return the updated item.
export function review(item, correct, today) {
  const it = { ...(item || newItem()) };
  it.seen++;
  it.last = today;
  if (correct) {
    it.right++;
    it.box = Math.min(5, it.box + 1);
  } else {
    it.wrong++;
    it.box = 1;
  }
  it.due = addDays(today, INTERVALS[it.box]);
  return it;
}

export function isDue(item, today) {
  return !!item && item.box > 0 && item.due && daysBetween(item.due, today) >= 0;
}

// How well the word is probably still remembered: 1 when on schedule,
// falling toward 0.4 the longer a review is overdue.
export function retention(item, today) {
  if (!item || item.box === 0 || !item.due) return 1;
  const overdue = daysBetween(item.due, today);
  if (overdue <= 0) return 1;
  return Math.max(0.4, 1 - overdue / (INTERVALS[item.box] * 3 + 3));
}

// 0 to 1: how strongly a word is learned right now.
export function strength(item, today) {
  if (!item) return 0;
  return (item.box / 5) * retention(item, today);
}
