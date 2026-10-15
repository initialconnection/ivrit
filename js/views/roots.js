// Root explorer: every root in the app and the family of words built from it.

import { getState } from "../core/store.js";
import { activeRoots, rootInfo, rootQuestions } from "../core/roots.js";
import { statusOf } from "../core/srs.js";
import { esc, todayKey } from "../core/util.js";
import { header, bar } from "./shared.js";

const STATUS_LABEL = { new: "New", learning: "Learning", known: "Known", mastered: "Mastered" };

export function openExplorer(ctx, returnTo = "lessons") {
  ctx.showScreen(returnTo, view => {
    const state = getState();
    const key = todayKey();
    const infos = activeRoots().map(r => rootInfo(state, r.id, key))
      .sort((a, b) => b.words.length - a.words.length || a.root.tr.localeCompare(b.root.tr));

    view.innerHTML = `
      <div class="session-top"><button class="link" id="back">← Back</button><span>${infos.length} roots</span></div>
      ${header("Words and roots", "Root explorer")}
      <p class="muted">Most Hebrew words grow from a root of three letters. Learn a root once and you can guess the meaning of new words from the same family.</p>
      <div class="row">
        <button class="btn main" id="play">Play root families</button>
      </div>
      <section class="panel">
        <div class="root-list">
          ${infos.map(i => `
            <button class="root-row" data-root="${i.root.id}">
              <span class="root-he he" lang="he">${esc(i.root.he)}</span>
              <span class="root-main"><b>${esc(i.root.tr)}</b><span class="small muted">${esc(i.root.meaning)}</span></span>
              <span class="root-count small muted num">${i.known}/${i.words.length}</span>
              ${bar(i.strength, i.strength >= 0.8 ? "good" : "")}
            </button>`).join("")}
        </div>
      </section>`;

    view.querySelector("#back").onclick = () => ctx.go(returnTo);
    view.querySelector("#play").onclick = () => ctx.startQuiz({
      title: "Root families", questions: rootQuestions(getState(), 10), returnTo,
      doneLabel: "Round done", again: () => rootQuestions(getState(), 10)
    });
    view.querySelectorAll("[data-root]").forEach(b => b.onclick = () => openRoot(ctx, b.dataset.root, returnTo));
  });
}

function openRoot(ctx, rootId, returnTo) {
  ctx.showScreen(returnTo, view => {
    const state = getState();
    const i = rootInfo(state, rootId, todayKey());
    view.innerHTML = `
      <div class="session-top"><button class="link" id="back">← All roots</button><span>${i.words.length} word${i.words.length === 1 ? "" : "s"}</span></div>
      <section class="panel" style="text-align:center;justify-items:center">
        <div class="intro-big he" lang="he">${esc(i.root.he)}</div>
        <h1>${esc(i.root.tr)}</h1>
        <p class="muted">${esc(i.root.meaning)}</p>
        <div style="width:100%">${bar(i.strength, i.strength >= 0.8 ? "good" : "")}</div>
        <p class="small muted">${i.known} of ${i.words.length} known · root ${STATUS_LABEL[i.status].toLowerCase()}</p>
      </section>
      <section class="panel">
        <h2>Word family</h2>
        <ul class="plain">
          ${i.words.map(w => {
            const st = statusOf(state.items[w.id]);
            return `<li class="family-row"><div><b>${esc(w.tr)}</b> <span class="he" lang="he">${esc(w.he)}</span><p class="small muted">${esc(w.en)}</p></div>
              <span class="badge ${st === "mastered" ? "good" : st === "known" ? "on" : ""}">${STATUS_LABEL[st]}</span></li>`;
          }).join("")}
        </ul>
      </section>
      <div class="row">
        <button class="btn main" id="quiz">Practise this root</button>
        <button class="btn ghost" id="cards">Flashcards</button>
      </div>`;

    view.querySelector("#back").onclick = () => openExplorer(ctx, returnTo);
    view.querySelector("#quiz").onclick = () => ctx.startQuiz({
      title: i.root.tr, questions: rootQuestions(getState(), Math.max(4, i.words.length * 2), rootId), returnTo, doneLabel: "Round done"
    });
    view.querySelector("#cards").onclick = () => ctx.startSession({ title: i.root.tr, ids: i.words.map(w => w.id), mode: "practice", returnTo });
  });
}
