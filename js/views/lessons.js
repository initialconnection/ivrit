// Lessons: the learning path, Aleph to Hey, with each topic's progress.

import { LEVELS } from "../data/levels.js";
import { esc } from "../core/util.js";
import { currentLevel } from "../core/fluency.js";
import { getState } from "../core/store.js";
import { header, bar, wordsInTopic, topicMastery, newIds } from "./shared.js";

export function render(view, ctx) {
  const lvl = currentLevel(getState());

  view.innerHTML = `
    ${header("Learning path", "Lessons")}
    <p class="muted">Five ulpan levels from Aleph to Hey. Each topic fills up as its words become Known.</p>
    ${LEVELS.map(level => levelHtml(level, level.n === lvl.level.n)).join("")}
  `;

  view.querySelectorAll("[data-learn]").forEach(b => b.onclick = () => {
    const t = b.dataset.learn;
    ctx.startSession({ title: b.dataset.name, ids: newIds(10, t), mode: "learn", returnTo: "lessons" });
  });
  view.querySelectorAll("[data-practise]").forEach(b => b.onclick = () => {
    const t = b.dataset.practise;
    ctx.startSession({ title: b.dataset.name, ids: wordsInTopic(t).map(w => w.id), mode: "practice", returnTo: "lessons" });
  });
}

function levelHtml(level, isCurrent) {
  const hasContent = level.topics.some(t => wordsInTopic(t.id).length);
  return `
    <section class="panel level">
      <div class="level-head">
        <div style="flex:1;min-width:0">
          <h2>${esc(level.code)} <span class="muted small">${esc(level.cefr)} · ${esc(level.name)}</span></h2>
          <p class="small muted">${esc(level.canDo)}</p>
        </div>
        ${isCurrent ? `<span class="badge on">You're here</span>` : ""}
      </div>
      ${hasContent ? `<p class="small muted num">${levelWordCount(level)} of about ${level.words.toLocaleString("en-US")} ${esc(level.code)} words added so far. More topics and words arrive with each update.</p>
        <div>${level.topics.map(topicHtml).join("")}</div>`
        : `<p class="small muted">${level.topics.map(t => esc(t.name)).join(" · ")}<br>Lessons for this level arrive in later phases.</p>`}
    </section>`;
}

function levelWordCount(level) {
  return level.topics.reduce((n, t) => n + wordsInTopic(t.id).length, 0);
}

function topicHtml(topic) {
  const words = wordsInTopic(topic.id);
  if (!words.length) {
    return `<div class="topic"><div><h3>${esc(topic.name)}</h3><p class="small muted">Coming soon</p></div><span class="badge">Soon</span></div>`;
  }
  const mastery = topicMastery(topic.id);
  const unseen = newIds(99, topic.id).length;
  return `
    <div class="topic">
      <div><h3>${esc(topic.name)}</h3><p class="small muted num">${words.length} words · ${Math.round(mastery * 100)}% known${unseen ? ` · ${unseen} new` : ""}</p></div>
      <div class="row">
        ${unseen ? `<button class="btn small main" data-learn="${topic.id}" data-name="${esc(topic.name)}">Learn</button>`
          : `<span class="btn small done" aria-label="All words in this topic learned">✓ Learned</span>`}
        <button class="btn small ghost" data-practise="${topic.id}" data-name="${esc(topic.name)}">Practise</button>
      </div>
      ${bar(mastery, mastery >= 0.8 ? "good" : "")}
    </div>`;
}
