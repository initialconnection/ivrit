// Alef-Bet: letters and vowels, open anytime, independent of the lessons.
// Phase 1 shows the letter chart. Phase 2 adds lessons, vowels, drills and letter progress.

import { LETTERS } from "../data/letters.js";
import { esc } from "../core/util.js";
import { header } from "./shared.js";

export function render(view) {
  view.innerHTML = `
    ${header("Letters & reading", "Alef-Bet")}
    <p class="muted">Hebrew has 22 letters, read right to left. Five of them change shape at the end of a word. Tap a letter to hear more about it.</p>

    <section class="panel">
      <div class="panel-head"><h2>The letters</h2><span class="small muted">right to left</span></div>
      <div class="letters">
        ${LETTERS.map(l => `
          <button class="letter" data-id="${l.id}" aria-label="${esc(l.name)}, sounds like ${esc(l.sound)}">
            <span class="he" lang="he">${l.he}</span>
            <b>${esc(l.name)}</b>
            <span>${esc(l.sound)}</span>
          </button>`).join("")}
      </div>
      <div id="detail" class="msg info" hidden></div>
    </section>

    <section class="panel">
      <h2>Final forms</h2>
      <p class="small muted">These letters look different at the end of a word.</p>
      <div class="letters">
        ${LETTERS.filter(l => l.final).map(l => `
          <div class="letter"><span class="he" lang="he">${l.he} · ${l.final}</span><b>${esc(l.name)}</b><span>final ${l.final}</span></div>`).join("")}
      </div>
    </section>

    <section class="panel">
      <h2>Coming in Phase 2</h2>
      <ul class="ticks">
        <li>Letter-by-letter lessons with audio and example words</li>
        <li>Vowel marks (nikud) chart and lessons</li>
        <li>Reading ladder: syllables, then words, then sentences</li>
        <li>Drills for look-alike letters and final forms</li>
        <li>Your own letter and vowel progress grid</li>
      </ul>
    </section>
  `;

  const detail = view.querySelector("#detail");
  view.querySelectorAll(".letter[data-id]").forEach(b => b.onclick = () => {
    const l = LETTERS.find(x => x.id === b.dataset.id);
    detail.hidden = false;
    detail.innerHTML = `<h2><span class="he" lang="he" style="font-size:1.6rem">${l.he}</span> ${esc(l.name)}</h2>
      <p>Sounds like <b>${esc(l.sound)}</b>.${l.final ? ` At the end of a word it's written <span class="he" lang="he">${l.final}</span>.` : ""}</p>
      ${l.note ? `<p class="small">${esc(l.note)}</p>` : ""}`;
  });
}
