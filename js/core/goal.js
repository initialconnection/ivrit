// Goal and timeline: the learner picks a level to reach and a deadline,
// and this works out the daily plan, milestones and whether they're on track.

import { LEVELS } from "../data/levels.js";
import { WORDS } from "../data/words.js";
import { knownWords } from "./fluency.js";
import { addDays, daysBetween, todayKey } from "./util.js";

export const DEADLINES = [
  { months: 3, label: "3 months" },
  { months: 6, label: "6 months" },
  { months: 8, label: "8 months" },
  { months: 12, label: "1 year" },
  { months: 18, label: "18 months" },
  { months: 24, label: "2 years" }
];

// About how many minutes a day each new word needs, including its reviews.
const MINUTES_PER_WORD = 1.5;
const MAX_REASONABLE_MINUTES = 60;

export function deadlineFromMonths(start, months) {
  const [y, m, d] = start.split("-").map(Number);
  return todayKey(new Date(y, m - 1 + months, d));
}

export function plan(state, today) {
  const goal = state.goal;
  if (!goal) return null;
  const level = LEVELS.find(l => l.n === goal.level) || LEVELS.at(-1);
  const target = level.words;
  const known = knownWords(state);
  const remaining = Math.max(0, target - known);
  const totalDays = Math.max(1, daysBetween(goal.start, goal.deadline));
  const elapsed = Math.min(totalDays, Math.max(0, daysBetween(goal.start, today)));
  const daysLeft = Math.max(1, daysBetween(today, goal.deadline));

  const perDay = Math.ceil(remaining / daysLeft);
  const minutes = Math.max(10, Math.round(perDay * MINUTES_PER_WORD));
  const expected = Math.round(target * elapsed / totalDays);
  const gap = known - expected; // words ahead (+) or behind (−)
  const daysOff = perDay > 0 ? Math.round(gap / perDay) : 0;

  let status = "on-track";
  if (known >= target) status = "done";
  else if (elapsed > 0 && gap < -perDay) status = "behind";
  else if (gap > perDay) status = "ahead";

  // Milestones: when each level up to the goal should be reached, at an even pace from the start.
  const milestones = LEVELS.filter(l => l.n <= level.n).map(l => ({
    level: l,
    date: addDays(goal.start, Math.round(totalDays * l.words / target)),
    reached: known >= l.words
  }));

  return {
    level, target, known, remaining, daysLeft, totalDays, elapsed, perDay, minutes,
    expected, gap, daysOff, status, milestones,
    tooMuch: minutes > MAX_REASONABLE_MINUTES,
    suggestedMonths: Math.ceil((remaining * MINUTES_PER_WORD / MAX_REASONABLE_MINUTES) / 30),
    contentAvailable: WORDS.length
  };
}
