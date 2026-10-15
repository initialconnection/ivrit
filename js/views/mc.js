// Multiple-choice session, used by the Alef-Bet lessons and drills.
// Answers are checked automatically and saved to letter, vowel and reading progress.

import { getState, recordAnswer } from "../core/store.js";
import { compute } from "../core/fluency.js";
import { esc, todayKey } from "../core/util.js";
import { bar, changeHtml } from "./shared.js";

let s = null, view, ctx;

export function render(v, c, config) {
  view = v; ctx = c;
  s = {
    config,
    queue: config.questions.map(q => ({ ...q, retry: false })),
    total: config.questions.length,
    done: 0,
    right: 0,
    picked: null,
    shownAt: Date.now(),
    startScore: compute(getState(), todayKey()).score,
    finished: false
  };
  draw();
}

function optionHtml(o, i, q) {
  let cls = "opt";
  if (s.picked !== null) {
    if (i === q.answer) cls += " right";
    else if (i === s.picked) cls += " wrong";
  }
  const label = (o.he ? `<span class="he" lang="he">${esc(o.he)}</span>` : `<span>${esc(o.text)}</span>`)
    + (o.sub ? `<small class="${/[\u05D0-\u05EA]/.test(o.sub) ? "he" : ""}">${esc(o.sub)}</small>` : "");
  return `<button class="${cls}" data-i="${i}" ${s.picked !== null ? "disabled" : ""}><kbd>${i + 1}</kbd>${label}</button>`;
}

function draw() {
  if (!s.queue.length) return finish();
  const q = s.queue[0];
  const answered = s.picked !== null;
  const correct = answered && s.picked === q.answer;

  view.innerHTML = `
    <div class="session-top">
      <button class="link" id="quit">← End</button>
      <span>${esc(s.config.title)} · ${s.done}/${s.total}</span>
    </div>
    ${bar(s.done / s.total, "good")}
    <section class="panel quiz">
      <p class="quiz-prompt">${esc(q.prompt)}</p>
      ${q.show ? `<div class="quiz-show he" lang="he">${esc(q.show)}</div>` : ""}
      ${q.showLatin ? `<div class="quiz-latin">${esc(q.showLatin)}</div>` : ""}
      <div class="opts ${q.options.some(o => o.he) ? "he-opts" : ""}">${q.options.map((o, i) => optionHtml(o, i, q)).join("")}</div>
      ${answered ? `<div class="feedback ${correct ? "good" : "bad"}" role="status">
          <b>${correct ? "Right!" : "Not quite."}</b> ${esc(q.explain || "")}</div>
        <button class="btn main" id="next">${s.queue.length === 1 && correct ? "Finish" : "Next"}</button>` : ""}
    </section>`;

  view.querySelector("#quit").onclick = () => finish(true);
  view.querySelectorAll(".opt").forEach(b => b.onclick = () => pick(Number(b.dataset.i)));
  const next = view.querySelector("#next");
  if (next) { next.onclick = advance; next.focus({ preventScroll: true }); }
}

function pick(i) {
  if (s.picked !== null || !s.queue.length) return;
  const q = s.queue[0];
  s.picked = i;
  const correct = i === q.answer;
  recordAnswer(q.credits || [], correct, (Date.now() - s.shownAt) / 1000, q.rung || null);
  if (!q.retry) { if (correct) s.right++; }
  draw();
}

function advance() {
  const q = s.queue.shift();
  const correct = s.picked === q.answer;
  if (correct || q.retry) s.done++;
  else s.queue.splice(Math.min(3, s.queue.length), 0, { ...q, retry: true });
  s.picked = null;
  s.shownAt = Date.now();
  draw();
}

function finish(early = false) {
  if (s.finished) return;
  s.finished = true;
  if (early && s.done === 0) return ctx.go(s.config.returnTo || "alefbet");
  const completed = !early;
  if (completed && s.config.onDone) s.config.onDone();
  const gained = compute(getState(), todayKey()).score - s.startScore;
  const first = s.total;

  view.innerHTML = `
    <section class="panel" style="text-align:center;justify-items:center">
      <p class="eyebrow">${completed ? esc(s.config.doneLabel || "Done") : "Ended early"}</p>
      <div class="stat-big">${s.right}/${first}</div>
      <p class="muted">right on the first try</p>
      <h2>Fluency ${changeHtml(gained)}</h2>
      ${completed && s.config.doneText ? `<p>${esc(s.config.doneText)}</p>` : ""}
      <div class="row" style="justify-content:center">
        ${completed && s.config.next ? `<button class="btn main" id="next-up">${esc(s.config.next.label)} →</button>` : `
        ${s.config.again ? `<button class="btn main" id="again">Go again</button>` : ""}
        <button class="btn ${s.config.again ? "ghost" : "main"}" id="back">Back to ${{ today: "Today", practice: "Practice", lessons: "Lessons" }[s.config.returnTo] || "Alef-Bet"}</button>`}
      </div>
    </section>`;
  const nextUp = view.querySelector("#next-up");
  if (nextUp) { nextUp.onclick = s.config.next.run; nextUp.focus({ preventScroll: true }); return; }
  const again = view.querySelector("#again");
  if (again) again.onclick = () => ctx.startQuiz({ ...s.config, questions: s.config.again() });
  view.querySelector("#back").onclick = () => ctx.go(s.config.returnTo || "alefbet");
  view.querySelector("#back").focus({ preventScroll: true });
}

export function onKey(e) {
  if (!s || s.finished || e.target.closest("input, select, textarea")) return;
  const n = Number(e.key);
  if (s.picked === null && n >= 1 && n <= (s.queue[0]?.options.length || 0)) pick(n - 1);
  else if (s.picked !== null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); advance(); }
}
