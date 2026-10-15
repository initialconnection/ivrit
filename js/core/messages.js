// Encouragement: picks the one message that fits the learner's situation best.
// Returns { tone: "good" | "warn" | "info", title, text, action? }.

import { pct, plural } from "./util.js";

const MILESTONES = [10, 25, 50, 100, 250, 500, 1000, 1200, 2500, 4000, 6000];

export function pickMessage({ state, f, goalPlan, streakDays, day, known, dailyMinutes }) {
  const minutesToday = Math.round(day.seconds / 60);
  const answeredToday = day.answers > 0;

  if (!state.lastActive && !answeredToday) {
    return { tone: "info", title: "Bruchim ha-ba'im! (Welcome!)",
      text: "Set your goal on the Progress tab, then learn your first words. Every answer builds your fluency score." };
  }

  if (!answeredToday && f.daysAway >= 2 && f.drop > 0.001) {
    return { tone: "warn", title: "Welcome back!",
      text: `You've been away ${plural(f.daysAway, "day")} and dropped ${pct(f.drop)} fluency. Take a quick comeback test to earn it back, then keep building.`,
      action: "comeback" };
  }

  if (!answeredToday && f.daysAway >= 2) {
    return { tone: "info", title: "Welcome back!", text: `It's been ${plural(f.daysAway, "day")}. A short review session gets you going again.` };
  }

  const crossed = MILESTONES.find(m => known >= m && known - day.learned < m);
  if (answeredToday && crossed) {
    return { tone: "good", title: "Milestone!", text: `You now know ${crossed} words. Kol ha-kavod!` };
  }

  const over = minutesToday - dailyMinutes;
  if (answeredToday && over >= 15) {
    return { tone: "good", title: "Going the extra mile", text: `You practised ${over} minutes over your daily goal. That extra time brings your finish date closer.` };
  }

  if (answeredToday && f.change > 0.0005) {
    return { tone: "good", title: "Kol ha-kavod!", text: `You gained ${pct(f.change)} fluency today.${streakDays >= 3 ? ` That's ${streakDays} days in a row.` : ""}` };
  }

  if (goalPlan && goalPlan.status === "behind") {
    const days = Math.max(1, -goalPlan.daysOff);
    return { tone: "warn", title: "A little behind your plan",
      text: `You're about ${plural(days, "day")} behind. One extra session today helps you catch up.` };
  }

  if (answeredToday && minutesToday >= dailyMinutes) {
    return { tone: "good", title: "Daily goal done!", text: "Every extra 10 minutes now brings your goal a little closer." };
  }

  if (streakDays >= 2) {
    return { tone: "good", title: `${streakDays}-day streak`, text: "Keep it going with today's practice." };
  }

  return { tone: "info", title: "Ready for today?", text: `Your goal is ${dailyMinutes} minutes. Start with your reviews, then learn something new.` };
}
