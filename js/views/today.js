// Today: the daily home screen. Encouragement, fluency, daily goal and what to do next.

import { getState, save, today as todayRecord } from "../core/store.js";
import { update, currentLevel, streak, knownWords, wordCounts } from "../core/fluency.js";
import { plan } from "../core/goal.js";
import { pickMessage } from "../core/messages.js";
import { todayKey, addDays, esc, pct, formatDate, plural } from "../core/util.js";
import { header, bar, dueIds, newIds, changeHtml } from "./shared.js";

export function render(view, ctx) {
  const state = getState();
  const key = todayKey();
  const f = update(state, key);
  save();
  const day = todayRecord(key);
  const lvl = currentLevel(state);
  const counts = wordCounts(state);
  const streakDays = streak(state, key, addDays);
  const goalPlan = plan(state, key);
  const dailyMinutes = state.settings.dailyMinutes;
  const minutesToday = Math.round(day.seconds / 60);
  const due = dueIds(key);
  const fresh = newIds(10);
  const msg = pickMessage({ state, f, goalPlan, streakDays, day, known: knownWords(state), dailyMinutes });
  const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  view.innerHTML = `
    ${header(dateLabel, "Today")}

    <section class="msg ${msg.tone}" aria-live="polite">
      <h2>${esc(msg.title)}</h2>
      <p>${esc(msg.text)}</p>
      ${msg.action === "comeback" ? `<div class="row"><button class="btn main" id="comeback">Take the comeback test</button></div>` : ""}
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Fluency</h2><span class="small muted">${f.hadYesterday ? "since yesterday" : "today"} ${changeHtml(f.change)}</span></div>
      <div class="stat-big">${pct(f.score)}</div>
      <div class="row spread small"><span>Level <b>${esc(lvl.level.code)}</b> (${esc(lvl.level.cefr)})</span><span class="muted num">${lvl.known} known · ${counts.learning} learning</span></div>
      ${bar(lvl.progress)}
      <p class="small muted">Progress through ${esc(lvl.level.code)}: ${Math.round(lvl.progress * 100)}% of the way to ${lvl.level.words.toLocaleString("en-US")} words.</p>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Daily goal</h2><span class="small muted num">${minutesToday} / ${dailyMinutes} min</span></div>
      ${bar(minutesToday / dailyMinutes, minutesToday >= dailyMinutes ? "good" : "")}
      <div class="stats-row">
        <div class="stat"><b>${day.answers}</b><span>answers today</span></div>
        <div class="stat"><b>${day.answers ? Math.round(day.correct / day.answers * 100) + "%" : "–"}</b><span>correct</span></div>
        <div class="stat"><b>${streakDays}</b><span>day streak</span></div>
      </div>
      <div class="row">
        <button class="btn main" id="review" ${due.length ? "" : "disabled"}>Review <span class="count">${due.length}</span></button>
        <button class="btn ghost" id="learn" ${fresh.length ? "" : "disabled"}>Learn new words <span class="count">${fresh.length}</span></button>
      </div>
      ${!due.length && !fresh.length ? `<p class="small muted">You've studied every word available so far. Practise any topic from the Practice tab while more words are added.</p>` : ""}
      ${!due.length && fresh.length ? `<p class="small muted">No reviews due right now.</p>` : ""}
    </section>

    ${goalPlan ? `
    <section class="panel">
      <div class="panel-head"><h2>Your goal</h2><button class="link" id="goal-edit">Change</button></div>
      <p>Reach <b>${esc(goalPlan.level.code)}</b> by <b>${formatDate(state.goal.deadline)}</b> · ${plural(goalPlan.daysLeft, "day")} left</p>
      <div class="stats-row">
        <div class="stat"><b>${goalPlan.perDay}</b><span>new words a day</span></div>
        <div class="stat"><b>${goalPlan.minutes}</b><span>minutes a day</span></div>
        <div class="stat"><b>${statusLabel(goalPlan.status)}</b><span>${goalPlan.status === "behind" ? `about ${plural(-goalPlan.daysOff, "day")} behind` : goalPlan.status === "ahead" ? `about ${plural(goalPlan.daysOff, "day")} ahead` : "status"}</span></div>
      </div>
    </section>` : `
    <section class="panel">
      <h2>Set a goal</h2>
      <p class="muted">Pick a level and a deadline, like fluent in 6 months or 1 year, and get a daily plan.</p>
      <div class="row"><button class="btn ghost" id="goal-set">Set my goal</button></div>
    </section>`}
  `;

  const $ = sel => view.querySelector(sel);
  $("#review").onclick = () => ctx.startSession({ title: "Review", ids: due.slice(0, 30), mode: "review", returnTo: "today" });
  $("#learn").onclick = () => ctx.startSession({ title: "New words", ids: fresh, mode: "learn", returnTo: "today" });
  const comeback = $("#comeback");
  if (comeback) comeback.onclick = () => {
    const ids = (due.length ? due : Object.keys(state.items).filter(id => state.items[id].box > 0)).slice(0, 10);
    ctx.startSession({ title: "Comeback test", ids, mode: "review", returnTo: "today" });
  };
  const goalBtn = $("#goal-edit") || $("#goal-set");
  if (goalBtn) goalBtn.onclick = () => { location.hash = "progress"; setTimeout(() => document.getElementById("goal")?.scrollIntoView(), 50); };
}

function statusLabel(s) {
  return { "on-track": "On track", ahead: "Ahead", behind: "Behind", done: "Reached" }[s];
}
