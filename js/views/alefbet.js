// Alef-Bet: letters, vowels and reading, open anytime, independent of the lessons path.
// Progress grid, step-by-step letter lessons, drills, charts and writing practice.

import { LETTERS, FINALS, LETTER_BY_ID } from "../data/letters.js";
import { VOWELS, VOWEL_BY_ID } from "../data/vowels.js";
import { ALEFBET_LESSONS } from "../data/alefbet-lessons.js";
import { getState, markLessonDone } from "../core/store.js";
import { statusOf } from "../core/srs.js";
import { lessonQuestions, drillQuestions, nextLessonIndex, rungStatus, letterSummary, dueCount } from "../core/alefbet.js";
import { esc, todayKey } from "../core/util.js";
import { header, bar } from "./shared.js";

const DRILLS = [
  { id: "letters", name: "Letter sounds", desc: "Name each letter and its sound" },
  { id: "lookalikes", name: "Look-alikes", desc: "ב/כ, ד/ר, ו/ז, ה/ח/ת and more" },
  { id: "finals", name: "Final forms", desc: "ך ם ן ף ץ" },
  { id: "vowels", name: "Vowel sounds", desc: "What each mark says" },
  { id: "syllables", name: "Sound it out", desc: "Letter + vowel syllables" },
  { id: "words", name: "Read words", desc: "Whole words with vowels" },
  { id: "plain", name: "No vowels", desc: "Read like an Israeli", needs: "ab10" }
];

export function render(view, ctx) {
  const state = getState();
  const key = todayKey();
  const sum = letterSummary(state, key);
  const next = nextLessonIndex(state);
  const due = dueCount(state, key);
  const rungs = rungStatus(state);
  const done = state.alefbet.done;

  view.innerHTML = `
    ${header("Letters & reading", "Alef-Bet")}
    <p class="muted">Learn to read Hebrew script at your own pace, separate from the lessons. Everything here counts toward your fluency score.</p>

    <section class="panel">
      <div class="panel-head"><h2>Your alef-bet</h2><span class="small muted num">${done.length}/${ALEFBET_LESSONS.length} lessons</span></div>
      <div class="stats-row">
        <div class="stat"><b>${sum.lettersStarted}/${sum.lettersTotal}</b><span>letters started</span></div>
        <div class="stat"><b>${sum.lettersKnown}</b><span>letters known</span></div>
        <div class="stat"><b>${sum.vowelsStarted}/${sum.vowelsTotal}</b><span>vowels started</span></div>
        <div class="stat"><b>${sum.vowelsKnown}</b><span>vowels known</span></div>
      </div>
      <div class="tiles" aria-label="Letters by status">
        ${[...LETTERS, ...FINALS].map(l => `<span class="tile st-${statusOf(state.letters[l.id])}" title="${esc(l.name)}: ${statusOf(state.letters[l.id])}"><span class="he" lang="he">${l.he}</span></span>`).join("")}
      </div>
      <div class="tiles" aria-label="Vowels by status">
        ${VOWELS.map(v => `<span class="tile st-${statusOf(state.vowels[v.id])}" title="${esc(v.name)}: ${statusOf(state.vowels[v.id])}"><span class="he" lang="he">${v.sample}</span></span>`).join("")}
      </div>
      <div class="legend">
        <span><i class="s-new"></i>Not started</span><span><i class="s-learning"></i>Learning</span>
        <span><i class="s-known"></i>Known</span><span><i class="s-mastered"></i>Mastered</span>
      </div>
      <h3>Reading ladder</h3>
      <div class="ladder">
        ${rungs.map(r => `
          <div class="rung-row ${r.unlocked ? "" : "locked"}">
            <span class="rung-mark">${r.passed ? "✓" : r.unlocked ? "○" : "–"}</span>
            <div><b>${esc(r.name)}</b><p class="small muted">${esc(r.desc)}${r.seen ? ` · ${Math.round(r.accuracy * 100)}% of ${r.seen}` : ""}${!r.unlocked ? ` · unlocks after Lesson ${ALEFBET_LESSONS.findIndex(l => l.id === r.unlock) + 1}` : ""}</p></div>
          </div>`).join("")}
      </div>
      <p class="small muted">A rung is passed after 20 answers with at least 80% right.</p>
    </section>

    ${due || next !== null ? `
    <section class="panel">
      <div class="row">
        ${next !== null ? `<button class="btn main" id="next-lesson">Lesson ${next + 1}: ${esc(ALEFBET_LESSONS[next].title)}</button>` : ""}
        ${due ? `<button class="btn ghost" id="review">Review letters <span class="count">${due}</span></button>` : ""}
      </div>
      ${next === null ? `<p>Kol ha-kavod, you've finished every alef-bet lesson! Keep the letters fresh with reviews and drills.</p>` : ""}
    </section>` : ""}

    <section class="panel">
      <h2>Lessons</h2>
      <div>
        ${ALEFBET_LESSONS.map((l, i) => {
          const isDone = done.includes(l.id);
          const chars = [...l.letters.map(id => LETTER_BY_ID[id].he), ...l.vowels.map(v => VOWEL_BY_ID[v].sample)].join(" ");
          return `<div class="topic">
            <div><h3>${isDone ? "✓ " : ""}${i + 1}. ${esc(l.title)}</h3><p class="small muted"><span class="he" lang="he">${chars || "שׂ"}</span></p></div>
            <button class="btn small ${isDone ? "ghost" : i === next ? "main" : "quiet"}" data-lesson="${i}">${isDone ? "Redo" : "Start"}</button>
          </div>`;
        }).join("")}
      </div>
    </section>

    <section class="panel">
      <h2>Drills</h2>
      <p class="small muted">Practise anytime. Drills use the letters from lessons you've finished.</p>
      <div class="drills">
        ${DRILLS.map(d => {
          const locked = d.needs && !done.includes(d.needs);
          return `<button class="drill" data-drill="${d.id}" ${locked ? "disabled" : ""}><b>${esc(d.name)}</b><span>${locked ? "After Lesson 10" : esc(d.desc)}</span></button>`;
        }).join("")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Letter chart</h2><span class="small muted">tap a letter</span></div>
      <div class="letters">
        ${LETTERS.map(l => `<button class="letter" data-letter="${l.id}" aria-label="${esc(l.name)}, sounds like ${esc(l.sound)}">
          <span class="he" lang="he">${l.he}</span><b>${esc(l.name)}</b><span>${esc(l.sound)}</span></button>`).join("")}
      </div>
      <h3>Final forms</h3>
      <div class="letters">
        ${FINALS.map(f => `<button class="letter" data-letter="${f.id}"><span class="he" lang="he">${f.he}</span><b>${esc(f.name)}</b><span>${esc(f.sound)}</span></button>`).join("")}
      </div>
      <div id="letter-detail" class="msg info" hidden></div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Vowel chart</h2><span class="small muted">shown on בּ</span></div>
      <div class="letters">
        ${VOWELS.map(v => `<button class="letter" data-vowel="${v.id}"><span class="he" lang="he">${v.sample}</span><b>${esc(v.name)}</b><span>${esc(v.sound)}</span></button>`).join("")}
      </div>
      <div id="vowel-detail" class="msg info" hidden></div>
    </section>

    <section class="panel" id="writing">
      <div class="panel-head"><h2>Writing practice</h2><span class="small muted">trace with your finger or mouse</span></div>
      <div class="row">
        <label class="sr" for="trace-letter">Letter to trace</label>
        <select id="trace-letter">${[...LETTERS, ...FINALS].map(l => `<option value="${l.id}">${l.he}  ${esc(l.name)}</option>`).join("")}</select>
        <button class="btn quiet small" id="trace-clear">Clear</button>
        <button class="btn quiet small" id="trace-next">Next letter</button>
      </div>
      <canvas id="trace" class="trace" width="600" height="400" aria-label="Tracing area"></canvas>
      <p class="small muted">Hebrew is written right to left. Most strokes start at the top right.</p>
    </section>
  `;

  const $ = sel => view.querySelector(sel);
  const nextBtn = $("#next-lesson");
  if (nextBtn) nextBtn.onclick = () => openLesson(next, ctx);
  const reviewBtn = $("#review");
  if (reviewBtn) reviewBtn.onclick = () => ctx.startQuiz({ title: "Letter review", questions: drillQuestions("review", state), returnTo: "alefbet", doneLabel: "Review done" });
  view.querySelectorAll("[data-lesson]").forEach(b => b.onclick = () => openLesson(Number(b.dataset.lesson), ctx));
  view.querySelectorAll("[data-drill]").forEach(b => b.onclick = () => {
    const d = DRILLS.find(x => x.id === b.dataset.drill);
    ctx.startQuiz({ title: d.name, questions: drillQuestions(d.id, getState()), returnTo: "alefbet", doneLabel: "Drill done", again: () => drillQuestions(d.id, getState()) });
  });

  view.querySelectorAll("[data-letter]").forEach(b => b.onclick = () => {
    const l = LETTER_BY_ID[b.dataset.letter];
    const base = l.base ? LETTER_BY_ID[l.base] : l;
    const box = $("#letter-detail");
    box.hidden = false;
    box.innerHTML = `<h2><span class="he" lang="he" style="font-size:2rem">${l.he}</span> ${esc(l.name)}</h2>
      <p>Sounds like <b>${esc(l.sound)}</b>.${base.final && !l.base ? ` At the end of a word it's written <span class="he" lang="he">${base.final}</span>.` : ""}${l.base ? ` It's how ${esc(base.name)} (<span class="he" lang="he">${base.he}</span>) is written at the end of a word.` : ""}</p>
      ${base.note ? `<p class="small">${esc(base.note)}</p>` : ""}`;
  });
  view.querySelectorAll("[data-vowel]").forEach(b => b.onclick = () => {
    const v = VOWEL_BY_ID[b.dataset.vowel];
    const box = $("#vowel-detail");
    box.hidden = false;
    box.innerHTML = `<h2><span class="he" lang="he" style="font-size:2rem">${v.sample}</span> ${esc(v.name)}</h2><p>Says <b>${esc(v.sound)}</b>. ${esc(v.note)}</p>`;
  });

  setupTracing(view);
}

// ---------- Lesson introduction ----------

function openLesson(index, ctx) {
  const lesson = ALEFBET_LESSONS[index];
  ctx.showScreen("alefbet", view => {
    view.innerHTML = `
      <div class="session-top"><button class="link" id="back">← Alef-Bet</button><span>Lesson ${index + 1} of ${ALEFBET_LESSONS.length}</span></div>
      ${header(`Lesson ${index + 1}`, lesson.title)}
      <p>${esc(lesson.intro)}</p>
      ${lesson.letters.map(id => {
        const l = LETTER_BY_ID[id];
        const base = l.base ? LETTER_BY_ID[l.base] : l;
        return `<section class="panel intro-card">
          <div class="intro-big he" lang="he">${l.he}</div>
          <div><h2>${esc(l.name)}</h2><p>Sounds like <b>${esc(l.sound)}</b></p>
          <p class="small muted">${l.base ? `The end-of-word form of ${esc(base.name)} (${base.he}).` : esc(base.note)}</p></div>
        </section>`;
      }).join("")}
      ${lesson.sin ? `<section class="panel intro-card"><div class="intro-big he" lang="he">שׂ</div>
        <div><h2>Sin</h2><p>Sounds like <b>s</b></p><p class="small muted">Same letter as shin (שׁ), but the dot is on the left.</p></div></section>` : ""}
      ${lesson.vowels.map(vid => {
        const v = VOWEL_BY_ID[vid];
        return `<section class="panel intro-card">
          <div class="intro-big he" lang="he">${v.sample}</div>
          <div><h2>${esc(v.name)}</h2><p>Says <b>${esc(v.sound)}</b></p><p class="small muted">${esc(v.note)}</p></div>
        </section>`;
      }).join("")}
      <section class="panel">
        <h2>Words you'll read</h2>
        <div class="word-preview">${lesson.words.map(w => `<span class="he" lang="he">${w.he}</span>`).join("")}</div>
        <p class="small muted">Don't worry if you can't read them yet. That's what the practice is for.</p>
      </section>
      <button class="btn main" id="start">Start practice</button>`;

    view.querySelector("#back").onclick = () => ctx.go("alefbet");
    view.querySelector("#start").onclick = () => ctx.startQuiz({
      title: `Lesson ${index + 1}`,
      questions: lessonQuestions(index),
      returnTo: "alefbet",
      onDone: () => markLessonDone(lesson.id),
      doneLabel: `Lesson ${index + 1} complete`,
      doneText: index + 1 < ALEFBET_LESSONS.length ? "" : "That's the whole alef-bet. Kol ha-kavod!",
      again: () => lessonQuestions(index),
      next: index + 1 < ALEFBET_LESSONS.length
        ? { label: `Next lesson: ${ALEFBET_LESSONS[index + 1].title}`, run: () => openLesson(index + 1, ctx) }
        : { label: "Back to Alef-Bet", run: () => ctx.go("alefbet") }
    });
  });
}

// ---------- Writing practice ----------

function setupTracing(view) {
  const canvas = view.querySelector("#trace");
  const select = view.querySelector("#trace-letter");
  const c = canvas.getContext("2d");
  let drawing = false;

  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  function guide() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = css("--sunk");
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.strokeStyle = css("--line");
    c.lineWidth = 2;
    c.setLineDash([8, 8]);
    c.beginPath(); c.moveTo(0, 300); c.lineTo(canvas.width, 300); c.stroke();
    c.setLineDash([]);
    c.fillStyle = css("--line");
    c.font = `300px ${css("--hebrew") || "sans-serif"}`;
    c.textAlign = "center";
    c.textBaseline = "alphabetic";
    c.fillText(LETTER_BY_ID[select.value].he, canvas.width / 2, 300);
  }
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) * canvas.width / r.width, (e.clientY - r.top) * canvas.height / r.height];
  }
  canvas.onpointerdown = e => {
    drawing = true; canvas.setPointerCapture(e.pointerId);
    const [x, y] = pos(e);
    c.strokeStyle = css("--accent"); c.lineWidth = 14; c.lineCap = "round"; c.lineJoin = "round";
    c.beginPath(); c.moveTo(x, y);
  };
  canvas.onpointermove = e => { if (!drawing) return; const [x, y] = pos(e); c.lineTo(x, y); c.stroke(); };
  canvas.onpointerup = canvas.onpointercancel = () => { drawing = false; };
  select.onchange = guide;
  view.querySelector("#trace-clear").onclick = guide;
  view.querySelector("#trace-next").onclick = () => {
    select.selectedIndex = (select.selectedIndex + 1) % select.options.length;
    guide();
  };
  document.fonts?.ready.then(guide);
  guide();
}
