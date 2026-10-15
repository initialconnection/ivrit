// A flashcard session. Every answer is saved to progress and moves the word
// through its review schedule. Missed words come back a few cards later.

import { WORD_BY_ID } from "../data/words.js";
import { ROOT_BY_ID } from "../data/roots.js";
import { getState, recordAnswer } from "../core/store.js";
import { compute } from "../core/fluency.js";
import { esc, todayKey, shuffle, plural } from "../core/util.js";
import { bar, changeHtml } from "./shared.js";

let s = null; // current session
let view, ctx;

export function render(v, c, config) {
  view = v; ctx = c;
  s = {
    config,
    queue: config.mode === "learn" ? config.ids.slice() : shuffle(config.ids),
    total: config.ids.length,
    done: new Set(),
    firstTry: {},
    flipped: false,
    shownAt: Date.now(),
    startScore: compute(getState(), todayKey()).score,
    finished: false
  };
  draw();
}

function draw() {
  if (!s.queue.length) return finish();
  const w = WORD_BY_ID[s.queue[0]];
  const { direction: dir, script } = getState().settings;
  // How the Hebrew side looks, depending on the "How Hebrew is shown" setting.
  const hebrewBig = script === "tr"
    ? `<div class="prompt-word">${esc(w.tr)}</div>`
    : `<div class="prompt-word he" lang="he">${esc(w.he)}</div>${script === "both" ? `<div class="answer-word">${esc(w.tr)}</div>` : ""}`;
  const englishBig = `<div class="prompt-word">${esc(w.en)}</div>`;
  const front = dir === "he-en" ? hebrewBig : englishBig;
  const backMain = dir === "he-en" ? `<div class="answer-word">${esc(w.en)}</div>`
    : script === "tr" ? `<div class="answer-word">${esc(w.tr)}</div>` : `<div class="answer-word he" lang="he">${esc(w.he)}</div><div class="hint">${esc(w.tr)}</div>`;
  // Extra line on the back: the form not already shown.
  const backExtra = script === "tr" ? `<div class="he" lang="he">${esc(w.he)}</div>`
    : script === "he" && dir === "he-en" ? `<div class="hint">${esc(w.tr)}</div>` : "";
  const root = w.root ? ROOT_BY_ID[w.root] : null;
  const isNew = !getState().items[w.id] || getState().items[w.id].box === 0;

  view.innerHTML = `
    <div class="session-top">
      <button class="link" id="quit">← End session</button>
      <span>${esc(s.config.title)} · ${s.done.size}/${s.total}</span>
    </div>
    ${bar(s.done.size / s.total, "good")}
    <button class="card ${s.flipped ? "flip" : ""}" id="card" aria-live="polite">
      ${isNew && !s.flipped ? `<span class="badge on">New word</span>` : ""}
      ${front}
      ${s.flipped ? `
        ${backMain}
        ${backExtra}
        ${w.tip ? `<p class="note">${esc(w.tip)}</p>` : ""}
        ${root ? `<p class="hint">Root ${esc(root.tr)} · ${esc(root.meaning)}</p>` : ""}`
      : `<p class="hint">Say the answer out loud, then tap to check</p>`}
    </button>
    <div class="answers">
      <button class="btn again" id="again" ${s.flipped ? "" : "disabled"}>Still learning</button>
      <button class="btn knew" id="knew" ${s.flipped ? "" : "disabled"}>I knew it</button>
    </div>
    <p class="keys">Keys: <kbd>Space</kbd> flip · <kbd>1</kbd> still learning · <kbd>2</kbd> knew it</p>`;

  view.querySelector("#card").onclick = flip;
  view.querySelector("#again").onclick = () => answer(false);
  view.querySelector("#knew").onclick = () => answer(true);
  view.querySelector("#quit").onclick = () => finish(true);
  view.querySelector(s.flipped ? "#knew" : "#card").focus({ preventScroll: true });
}

function flip() { s.flipped = !s.flipped; draw(); }

function answer(correct) {
  if (!s.flipped || !s.queue.length) return;
  const id = s.queue.shift();
  const seconds = (Date.now() - s.shownAt) / 1000;
  recordAnswer(id, correct, seconds);
  if (!(id in s.firstTry)) s.firstTry[id] = correct;
  if (correct) s.done.add(id);
  else s.queue.splice(Math.min(3, s.queue.length), 0, id);
  s.flipped = false;
  s.shownAt = Date.now();
  draw();
}

function finish(early = false) {
  if (s.finished) return;
  s.finished = true;
  const answered = Object.keys(s.firstTry).length;
  if (early && answered === 0) return ctx.go(s.config.returnTo || "practice");

  const right = Object.values(s.firstTry).filter(Boolean).length;
  const missed = Object.keys(s.firstTry).filter(id => !s.firstTry[id]);
  const gained = compute(getState(), todayKey()).score - s.startScore;

  view.innerHTML = `
    <section class="panel" style="text-align:center;justify-items:center">
      <p class="eyebrow">${early ? "Session ended" : "Session complete"}</p>
      <div class="stat-big">${right}/${answered}</div>
      <p class="muted">right on the first try</p>
      <h2>Fluency ${changeHtml(gained)}</h2>
      ${missed.length ? `<p class="muted">Words to keep practising:</p>
        <div>${missed.map(id => `<span class="chip">${esc(WORD_BY_ID[id].tr)}</span>`).join("")}</div>
        <p class="small muted">${plural(missed.length, "word")} will come back in tomorrow's review.</p>` : `<p>Kol ha-kavod, no mistakes!</p>`}
      <div class="row" style="justify-content:center">
        <button class="btn main" id="again">Practise these again</button>
        <button class="btn ghost" id="back">Done</button>
      </div>
    </section>`;
  view.querySelector("#again").onclick = () => ctx.startSession({ ...s.config, mode: "practice" });
  view.querySelector("#back").onclick = () => ctx.go(s.config.returnTo || "today");
  view.querySelector("#back").focus({ preventScroll: true });
}

export function onKey(e) {
  if (!s || s.finished || e.target.closest("input, select, textarea")) return;
  if (e.key === " ") { e.preventDefault(); flip(); }
  else if (e.key === "1") answer(false);
  else if (e.key === "2") answer(true);
}
