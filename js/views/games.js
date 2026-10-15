// Word games: matching pairs and a 60-second speed round. Every answer saves to progress.

import { WORDS, WORD_BY_ID } from "../data/words.js";
import { getState, recordAnswer, save } from "../core/store.js";
import { meaningQ } from "../core/roots.js";
import { shuffle, esc } from "../core/util.js";
import { newIds } from "./shared.js";

// Words to play with: ones already studied first, topped up with new words in lesson order.
function gameWords(n) {
  const items = getState().items;
  const studied = shuffle(WORDS.filter(w => items[w.id]?.box > 0));
  const extra = newIds(n).map(id => WORD_BY_ID[id]);
  return [...studied, ...extra].slice(0, n);
}

function hebrewLabel(w) {
  const script = getState().settings.script;
  if (script === "he") return `<span class="he" lang="he">${esc(w.he)}</span>`;
  if (script === "both") return `<span class="he" lang="he">${esc(w.he)}</span><br>${esc(w.tr)}`;
  return esc(w.tr);
}

function endScreen(view, ctx, { eyebrow, big, line, best, missed, again }) {
  view.innerHTML = `
    <section class="panel" style="text-align:center;justify-items:center">
      <p class="eyebrow">${esc(eyebrow)}</p>
      <div class="stat-big">${esc(big)}</div>
      <p class="muted">${esc(line)}</p>
      ${best ? `<h2>${esc(best)}</h2>` : ""}
      ${missed.length ? `<p class="muted">Words to keep practising:</p><div>${missed.map(w => `<span class="chip">${esc(w.tr)}</span>`).join("")}</div>` : ""}
      <div class="row" style="justify-content:center">
        <button class="btn main" id="again">Play again</button>
        <button class="btn ghost" id="back">Back to Practice</button>
      </div>
    </section>`;
  view.querySelector("#again").onclick = again;
  view.querySelector("#back").onclick = () => ctx.go("practice");
  view.querySelector("#again").focus({ preventScroll: true });
}

// ---------- Matching pairs ----------

export function startMatch(ctx) {
  const words = gameWords(6);
  if (words.length < 3) { ctx.toast("Learn a few words first."); return; }
  ctx.showScreen("practice", view => {
    const left = shuffle(words), right = shuffle(words);
    let selected = null, matched = 0, mistakes = 0, lastAt = Date.now();
    const missed = new Set();
    const start = Date.now();

    view.innerHTML = `
      <div class="session-top"><button class="link" id="quit">← End</button><span class="timer" id="clock">0:00</span></div>
      <h2>Match each word to its meaning</h2>
      <div class="match-grid">
        <div class="match-col">${left.map(w => `<button class="tilebtn" data-side="he" data-id="${w.id}">${hebrewLabel(w)}</button>`).join("")}</div>
        <div class="match-col">${right.map(w => `<button class="tilebtn" data-side="en" data-id="${w.id}">${esc(w.en)}</button>`).join("")}</div>
      </div>
      <p class="small muted" id="status">Tap a word, then its meaning.</p>`;

    const clock = view.querySelector("#clock");
    const fmt = ms => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
    const timer = setInterval(() => { if (!view.contains(clock)) return clearInterval(timer); clock.textContent = fmt(Date.now() - start); }, 250);
    view.querySelector("#quit").onclick = () => { clearInterval(timer); ctx.go("practice"); };

    view.querySelectorAll(".tilebtn").forEach(b => b.onclick = () => {
      if (b.classList.contains("done")) return;
      if (!selected || selected.dataset.side === b.dataset.side) {
        view.querySelectorAll(".tilebtn.sel").forEach(x => x.classList.remove("sel"));
        selected = b; b.classList.add("sel");
        return;
      }
      const a = selected; selected = null;
      a.classList.remove("sel");
      const heTile = a.dataset.side === "he" ? a : b;
      const seconds = (Date.now() - lastAt) / 1000; lastAt = Date.now();
      if (a.dataset.id === b.dataset.id) {
        recordAnswer(a.dataset.id, !missed.has(a.dataset.id), seconds);
        a.classList.add("done"); b.classList.add("done");
        if (++matched === words.length) {
          clearInterval(timer);
          const ms = Date.now() - start;
          const state = getState();
          const prev = state.best.match;
          const isBest = mistakes === 0 && (!prev || ms < prev);
          if (isBest) { state.best.match = ms; save(); }
          endScreen(view, ctx, {
            eyebrow: "All matched", big: fmt(ms), line: `${mistakes} mistake${mistakes === 1 ? "" : "s"}`,
            best: isBest ? "New best time!" : prev ? `Best perfect time: ${fmt(prev)}` : "",
            missed: [...missed].map(id => WORD_BY_ID[id]), again: () => startMatch(ctx)
          });
        }
      } else {
        mistakes++;
        missed.add(heTile.dataset.id);
        recordAnswer(heTile.dataset.id, false, seconds);
        [a, b].forEach(x => { x.classList.add("miss"); setTimeout(() => x.classList.remove("miss"), 450); });
      }
    });
  });
}

// ---------- Speed round ----------

export function startSpeed(ctx) {
  const pool = gameWords(60);
  if (pool.length < 4) { ctx.toast("Learn a few words first."); return; }
  ctx.showScreen("practice", view => {
    const script = getState().settings.script;
    const LIMIT = 60;
    const start = Date.now();
    let score = 0, answered = 0, lastAt = Date.now(), over = false, q = null, order = shuffle(pool), idx = 0;
    const missed = new Map();

    view.innerHTML = `
      <div class="session-top"><button class="link" id="quit">← End</button><span class="timer" id="clock">${LIMIT}</span></div>
      <div class="row spread"><h2>Speed round</h2><span class="small muted num" id="score">0 right</span></div>
      <section class="panel quiz" id="q"></section>`;
    const clock = view.querySelector("#clock"), box = view.querySelector("#q"), scoreEl = view.querySelector("#score");

    function next() {
      if (idx >= order.length) { order = shuffle(pool); idx = 0; }
      q = meaningQ(order[idx++], WORDS, script);
      box.innerHTML = `
        ${q.show ? `<div class="quiz-show he" lang="he">${esc(q.show)}</div>` : ""}
        ${q.showLatin ? `<div class="quiz-latin">${esc(q.showLatin)}</div>` : ""}
        <div class="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}"><span>${esc(o.text)}</span></button>`).join("")}</div>`;
      box.querySelectorAll(".opt").forEach(b => b.onclick = () => pick(Number(b.dataset.i), b));
    }
    function pick(i, btn) {
      if (over) return;
      const ok = i === q.answer;
      const id = q.credits[0][1];
      recordAnswer(id, ok, (Date.now() - lastAt) / 1000); lastAt = Date.now();
      answered++;
      if (ok) score++; else missed.set(id, WORD_BY_ID[id]);
      scoreEl.textContent = `${score} right`;
      btn.classList.add(ok ? "right" : "wrong");
      box.querySelectorAll(".opt")[q.answer].classList.add("right");
      box.querySelectorAll(".opt").forEach(b => b.disabled = true);
      setTimeout(() => { if (!over) next(); }, ok ? 250 : 700);
    }
    function finish() {
      over = true;
      clearInterval(timer);
      const state = getState();
      const prev = state.best.speed || 0;
      const isBest = score > prev;
      if (isBest) { state.best.speed = score; save(); }
      endScreen(view, ctx, {
        eyebrow: "Time's up", big: String(score), line: `right out of ${answered} in ${LIMIT} seconds`,
        best: isBest ? "New best score!" : `Best: ${prev}`, missed: [...missed.values()], again: () => startSpeed(ctx)
      });
    }
    const timer = setInterval(() => {
      if (!view.contains(clock)) { over = true; return clearInterval(timer); }
      const left = Math.max(0, LIMIT - Math.floor((Date.now() - start) / 1000));
      clock.textContent = left;
      clock.classList.toggle("low", left <= 10);
      if (left === 0) finish();
    }, 200);
    view.querySelector("#quit").onclick = () => { over = true; clearInterval(timer); ctx.go("practice"); };
    next();
  });
}
