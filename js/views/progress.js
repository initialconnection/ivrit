// Progress: fluency score, word stats, activity, goal and timeline, settings and backup.

import { WORDS } from "../data/words.js";
import { LEVELS } from "../data/levels.js";
import { getState, save, setGoal, setSetting, exportText, importText, resetAll } from "../core/store.js";
import { update, wordCounts, accuracy } from "../core/fluency.js";
import { plan, DEADLINES, deadlineFromMonths } from "../core/goal.js";
import { todayKey, addDays, esc, pct, formatDate, plural } from "../core/util.js";
import { header, bar, changeHtml } from "./shared.js";

export function render(view, ctx) {
  const state = getState();
  const key = todayKey();
  const f = update(state, key);
  save();
  const counts = wordCounts(state);
  const total = WORDS.length;
  const acc = accuracy(state);
  const goalPlan = plan(state, key);
  const daily = state.settings.dailyMinutes;

  const days = Array.from({ length: 14 }, (_, i) => addDays(key, i - 13));
  const mins = days.map(d => Math.round((state.days[d]?.seconds || 0) / 60));
  const peak = Math.max(daily, ...mins);
  const weekMinutes = mins.slice(-7).reduce((a, b) => a + b, 0);

  const tough = WORDS.filter(w => state.items[w.id]?.wrong > 0)
    .sort((a, b) => state.items[b.id].wrong - state.items[a.id].wrong).slice(0, 12);

  view.innerHTML = `
    ${header("Your Hebrew", "Progress")}

    <section class="panel">
      <div class="panel-head"><h2>Overall fluency</h2><span class="small muted">${f.hadYesterday ? "since yesterday" : "today"} ${changeHtml(f.change)}</span></div>
      <div class="stat-big">${pct(f.score)}</div>
      <p class="small muted">Your progress through the whole program, Aleph to Hey. It grows with correct answers and practice, and slips when reviews are missed. Accuracy over your last answers adjusts it by up to 10%.</p>
      <div style="display:grid;gap:10px">
        ${f.parts.map(p => `
          <div class="bar-row ${p.live ? "" : "locked"}">
            <span class="label">${esc(p.name)} <span class="muted small">${p.weight}%</span></span>
            ${bar(p.value)}
            <span class="val">${p.live ? pct(p.value * 100) : "Phase " + p.phase}</span>
          </div>`).join("")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Words</h2><span class="small muted num">${counts.known + counts.mastered} of ${total} available known</span></div>
      <div class="stack" role="img" aria-label="Words by status">
        ${["mastered", "known", "learning", "new"].map(s => `<div class="s-${s}" style="width:${counts[s] / total * 100}%"></div>`).join("")}
      </div>
      <div class="legend">
        <span><i class="s-new"></i>New ${counts.new}</span>
        <span><i class="s-learning"></i>Learning ${counts.learning}</span>
        <span><i class="s-known"></i>Known ${counts.known}</span>
        <span><i class="s-mastered"></i>Mastered ${counts.mastered}</span>
      </div>
      <p class="small muted">Accuracy over your last ${state.recent.length || 0} answers: <b>${acc === null ? "–" : Math.round(acc * 100) + "%"}</b></p>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Last 14 days</h2><span class="small muted num">${weekMinutes} min this week</span></div>
      <div class="activity" role="img" aria-label="Minutes practised each day for the last 14 days">
        ${mins.map((m, i) => `<div class="${m === 0 ? "zero" : m >= daily ? "goal-met" : ""}" style="height:${Math.max(2, m / peak * 100)}%" title="${formatDate(days[i])}: ${m} min"></div>`).join("")}
      </div>
      <div class="activity-axis"><span>${formatDate(days[0]).replace(/, \d{4}$/, "")}</span><span>Today</span></div>
      <p class="small muted">Green days met your ${daily}-minute goal.</p>
    </section>

    <section class="panel" id="goal">
      <h2>Goal and timeline</h2>
      ${goalPlan ? goalSummary(goalPlan, state) : `<p class="muted">Choose where you want to get to and by when. The app works out what to do each day.</p>`}
      <div class="grid2">
        <div class="field"><label for="goal-level">Reach this level</label>
          <select id="goal-level">
            ${LEVELS.map(l => `<option value="${l.n}" ${((state.goal?.level) || 5) === l.n ? "selected" : ""}>${esc(l.code)} (${esc(l.cefr)})${l.n === 5 ? ", the whole program" : ""}</option>`).join("")}
          </select></div>
        <div class="field"><label for="goal-time">In</label>
          <select id="goal-time">
            ${DEADLINES.map(d => `<option value="${d.months}" ${d.months === 12 ? "selected" : ""}>${esc(d.label)}</option>`).join("")}
            <option value="custom">Pick a date…</option>
          </select></div>
      </div>
      <div class="field" id="custom-wrap" hidden><label for="goal-date">Deadline</label><input type="date" id="goal-date" min="${addDays(key, 14)}"></div>
      <div class="row"><button class="btn main" id="goal-save">${goalPlan ? "Update goal" : "Set goal"}</button>
        ${goalPlan ? `<button class="link" id="goal-clear">Remove goal</button>` : ""}<span class="small muted" id="goal-msg" role="status"></span></div>
    </section>

    <section class="panel">
      <h2>Daily practice time</h2>
      <div class="field"><label for="daily">Minutes a day</label>
        <select id="daily">${[10, 15, 20, 30, 45, 60].map(n => `<option value="${n}" ${n === daily ? "selected" : ""}>${n} minutes</option>`).join("")}</select></div>
      ${goalPlan && goalPlan.minutes > daily ? `<p class="small" style="color:var(--warn)">Your goal needs about ${goalPlan.minutes} minutes a day.</p>` : ""}
    </section>

    ${tough.length ? `
    <section class="panel">
      <h2>Weak spots</h2>
      <p class="small muted">The words you've missed most. They come back more often in review.</p>
      <div>${tough.map(w => `<span class="chip">${esc(w.tr)} · ${state.items[w.id].wrong}×</span>`).join("")}</div>
    </section>` : ""}

    <section class="panel">
      <h2>Backup</h2>
      <p class="small muted">Progress is saved in this browser on this device. Save a backup file now and then, or to move your progress to another device. Accounts with automatic sync come in Phase 6.</p>
      <div class="row">
        <button class="btn ghost" id="export">Save backup file</button>
        <label class="btn ghost" for="import" style="cursor:pointer">Load backup file</label>
        <input type="file" id="import" accept=".json,application/json" hidden>
      </div>
      <div class="row"><button class="link" id="reset">Start over</button></div>
      <div id="reset-confirm" class="msg warn" hidden>
        <p><b>Erase all progress?</b> This can't be undone unless you have a backup file.</p>
        <div class="row"><button class="btn danger small" id="reset-yes">Erase everything</button><button class="btn quiet small" id="reset-no">Keep my progress</button></div>
      </div>
    </section>
  `;

  const $ = sel => view.querySelector(sel);
  $("#goal-time").onchange = () => { $("#custom-wrap").hidden = $("#goal-time").value !== "custom"; };
  $("#goal-save").onclick = () => {
    const level = Number($("#goal-level").value);
    const t = $("#goal-time").value;
    const deadline = t === "custom" ? $("#goal-date").value : deadlineFromMonths(key, Number(t));
    if (!deadline || deadline <= addDays(key, 13)) { $("#goal-msg").textContent = "Pick a date at least two weeks away."; return; }
    setGoal({ level, deadline, start: key });
    ctx.toast("Goal saved");
    render(view, ctx);
    $("#goal")?.scrollIntoView();
  };
  const clear = $("#goal-clear");
  if (clear) clear.onclick = () => { setGoal(null); render(view, ctx); };
  $("#daily").onchange = () => { setSetting("dailyMinutes", Number($("#daily").value)); ctx.toast("Daily goal saved"); render(view, ctx); };

  $("#export").onclick = () => {
    const blob = new Blob([exportText()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ivrit-backup-${key}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    ctx.toast("Backup file saved");
  };
  $("#import").onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try { importText(await file.text()); ctx.toast("Progress loaded from backup"); render(view, ctx); }
    catch (err) { ctx.toast(err.message || "That file couldn't be loaded."); }
  };
  $("#reset").onclick = () => { $("#reset-confirm").hidden = false; $("#reset-no").focus(); };
  $("#reset-no").onclick = () => { $("#reset-confirm").hidden = true; };
  $("#reset-yes").onclick = () => { resetAll(); ctx.toast("Progress erased"); render(view, ctx); };
}

function goalSummary(p, state) {
  const statusText = {
    "on-track": "You're on track.",
    ahead: `You're about ${plural(p.daysOff, "day")} ahead of plan.`,
    behind: `You're about ${plural(-p.daysOff, "day")} behind plan. An extra session or two will catch you up.`,
    done: "You've reached your goal. Kol ha-kavod!"
  }[p.status];
  return `
    <div class="msg ${p.status === "behind" ? "warn" : p.status === "done" || p.status === "ahead" ? "good" : "info"}">
      <p>Reach <b>${esc(p.level.code)}</b> (${p.target.toLocaleString("en-US")} words) by <b>${formatDate(state.goal.deadline)}</b>. ${statusText}</p>
    </div>
    <div class="stats-row">
      <div class="stat"><b>${p.perDay}</b><span>new words a day</span></div>
      <div class="stat"><b>${p.minutes}</b><span>minutes a day</span></div>
      <div class="stat"><b>${p.known}</b><span>words known</span></div>
      <div class="stat"><b>${p.daysLeft}</b><span>days left</span></div>
    </div>
    ${bar(p.known / p.target, "good")}
    <p class="small muted">Plan for today: ${p.expected.toLocaleString("en-US")} words known · you: ${p.known.toLocaleString("en-US")}</p>
    ${p.tooMuch ? `<div class="msg warn"><p><b>Reality check:</b> this deadline needs about ${p.minutes} minutes a day. Most learners can keep up 20–60 minutes. A deadline around ${plural(Math.max(p.suggestedMonths, 1), "month")} away would need about an hour a day or less.</p></div>` : ""}
    <h3>Milestones</h3>
    <div class="milestones">
      ${p.milestones.map(m => `<div class="milestone"><span>${m.reached ? "✓ " : ""}${esc(m.level.code)} · ${m.level.words.toLocaleString("en-US")} words</span><span class="muted num">${formatDate(m.date)}</span></div>`).join("")}
    </div>
    ${p.target > p.contentAvailable ? `<p class="small muted">The site has ${p.contentAvailable} words so far. More are added every phase, so your daily plan becomes fully doable as content grows.</p>` : ""}
    <h3 style="margin-top:8px">Change your goal</h3>`;
}
