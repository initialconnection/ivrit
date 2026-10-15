// Practice: pick what to study. Games beyond flashcards arrive in Phase 3.

import { WORDS } from "../data/words.js";
import { LEVELS } from "../data/levels.js";
import { getState, setSetting } from "../core/store.js";
import { todayKey, esc } from "../core/util.js";
import { header, dueIds, newIds, wordsInTopic } from "./shared.js";
import { startMatch, startSpeed } from "./games.js";
import { meaningQ } from "../core/roots.js";
import { openExplorer } from "./roots.js";
import { shuffle } from "../core/util.js";
import { WORD_BY_ID } from "../data/words.js";

const fmtTime = ms => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

// Studied words first, topped up with new ones.
function quizWords(n) {
  const items = getState().items;
  const studied = shuffle(WORDS.filter(w => items[w.id]?.box > 0));
  return [...studied, ...newIds(n).map(id => WORD_BY_ID[id])].slice(0, n);
}

export function render(view, ctx) {
  const state = getState();
  const key = todayKey();
  const due = dueIds(key);
  const fresh = newIds(10);
  const tough = WORDS.filter(w => state.items[w.id]?.wrong > 0)
    .sort((a, b) => state.items[b.id].wrong - state.items[a.id].wrong).slice(0, 15).map(w => w.id);
  const topics = LEVELS.flatMap(l => l.topics).filter(t => wordsInTopic(t.id).length);
  const dir = state.settings.direction;
  const script = state.settings.script;

  view.innerHTML = `
    ${header("Flashcards & games", "Practice")}

    <section class="panel">
      <h2>Quick start</h2>
      <div class="row">
        <button class="btn main" id="review" ${due.length ? "" : "disabled"}>Review due <span class="count">${due.length}</span></button>
        <button class="btn ghost" id="learn" ${fresh.length ? "" : "disabled"}>Learn new <span class="count">${fresh.length}</span></button>
        <button class="btn ghost" id="tough" ${tough.length ? "" : "disabled"}>Tough words <span class="count">${tough.length}</span></button>
      </div>
    </section>

    <section class="panel">
      <h2>Games</h2>
      <div class="games">
        <button class="drill" id="g-match"><b>Matching pairs</b><span>${state.best.match ? "Best " + fmtTime(state.best.match) : "Match words to meanings"}</span></button>
        <button class="drill" id="g-speed"><b>Speed round</b><span>${state.best.speed ? "Best " + state.best.speed + " right" : "60 seconds, go!"}</span></button>
        <button class="drill" id="g-quiz"><b>Word quiz</b><span>Pick the right meaning</span></button>
        <button class="drill" id="g-roots"><b>Root families</b><span>Match words to their roots</span></button>
      </div>
      <p class="small muted">Games use words you've studied, plus a few new ones. Every answer counts toward your progress.</p>
    </section>

    <section class="panel">
      <h2>Practise by topic</h2>
      <div class="choices">
        ${topics.map(t => `<label class="choice"><input type="checkbox" name="topic" value="${t.id}">
          <span>${esc(t.name)}<small>${wordsInTopic(t.id).length} words</small></span></label>`).join("")}
      </div>
      <div class="row spread"><span class="small muted" id="msg" role="status"></span><button class="btn main" id="start">Start</button></div>
    </section>

    <section class="panel">
      <h2>Card direction</h2>
      <div class="choices">
        <label class="choice"><input type="radio" name="dir" value="he-en" ${dir === "he-en" ? "checked" : ""}>
          <span>Hebrew → English<small>See Hebrew, say the meaning</small></span></label>
        <label class="choice"><input type="radio" name="dir" value="en-he" ${dir === "en-he" ? "checked" : ""}>
          <span>English → Hebrew<small>See English, say it in Hebrew</small></span></label>
      </div>
    </section>

    <section class="panel">
      <h2>How Hebrew is shown</h2>
      <p class="small muted">Switch to Hebrew script as your reading improves in the Alef-Bet tab.</p>
      <div class="choices">
        <label class="choice"><input type="radio" name="script" value="tr" ${script === "tr" ? "checked" : ""}>
          <span>English letters<small>Shalom</small></span></label>
        <label class="choice"><input type="radio" name="script" value="both" ${script === "both" ? "checked" : ""}>
          <span>Both<small><span class="he" lang="he">שָׁלוֹם</span> + Shalom</small></span></label>
        <label class="choice"><input type="radio" name="script" value="he" ${script === "he" ? "checked" : ""}>
          <span>Hebrew script<small><span class="he" lang="he">שָׁלוֹם</span></small></span></label>
      </div>
    </section>


  `;

  const $ = sel => view.querySelector(sel);
  $("#g-match").onclick = () => startMatch(ctx);
  $("#g-speed").onclick = () => startSpeed(ctx);
  $("#g-quiz").onclick = () => {
    const make = () => { const pool = quizWords(10); return pool.map(w => meaningQ(w, WORDS, getState().settings.script)); };
    ctx.startQuiz({ title: "Word quiz", questions: make(), returnTo: "practice", doneLabel: "Quiz done", again: make });
  };
  $("#g-roots").onclick = () => openExplorer(ctx, "practice");
  $("#review").onclick = () => ctx.startSession({ title: "Review", ids: due.slice(0, 30), mode: "review", returnTo: "practice" });
  $("#learn").onclick = () => ctx.startSession({ title: "New words", ids: fresh, mode: "learn", returnTo: "practice" });
  $("#tough").onclick = () => ctx.startSession({ title: "Tough words", ids: tough, mode: "practice", returnTo: "practice" });
  $("#start").onclick = () => {
    const chosen = [...view.querySelectorAll('input[name="topic"]:checked')].map(i => i.value);
    if (!chosen.length) { $("#msg").textContent = "Pick at least one topic."; return; }
    const ids = WORDS.filter(w => chosen.includes(w.topic)).map(w => w.id);
    ctx.startSession({ title: chosen.length === 1 ? topics.find(t => t.id === chosen[0]).name : "Mixed topics", ids, mode: "practice", returnTo: "practice" });
  };
  view.querySelectorAll('input[name="script"]').forEach(r => r.onchange = () => { setSetting("script", r.value); ctx.toast("Display saved"); });
  view.querySelectorAll('input[name="dir"]').forEach(r => r.onchange = () => { setSetting("direction", r.value); ctx.toast("Card direction saved"); });
}
