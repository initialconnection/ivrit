// Read: the text library. Phase 1 shows starter sentences; Phase 5 adds the full reader.

import { SENTENCES } from "../data/sentences.js";
import { esc } from "../core/util.js";
import { header } from "./shared.js";

export function render(view) {
  view.innerHTML = `
    ${header("Text library", "Read")}
    <section class="panel">
      <div class="panel-head"><h2>Starter sentences</h2><span class="small muted">tap to see the English</span></div>
      <div>
        ${SENTENCES.map(s => `
          <div class="sentence">
            <b>${esc(s.tr)}</b>
            <button class="link" data-show="${s.id}">Show meaning</button>
            <p id="${s.id}" hidden>${esc(s.en)}${s.grammar ? `<br><span class="small muted">${esc(s.grammar)}</span>` : ""}</p>
          </div>`).join("")}
      </div>
    </section>
    <section class="panel">
      <h2>Coming in Phase 5</h2>
      <ul class="ticks">
        <li>Graded stories and dialogues for every level</li>
        <li>Blessings, prayers and Biblical verses</li>
        <li>Tap any word for its meaning and root</li>
        <li>Switch between English letters and Hebrew script</li>
        <li>Audio read-aloud and comprehension questions</li>
      </ul>
    </section>`;

  view.querySelectorAll("[data-show]").forEach(b => b.onclick = () => {
    const p = view.querySelector("#" + CSS.escape(b.dataset.show));
    p.hidden = !p.hidden;
    b.textContent = p.hidden ? "Show meaning" : "Hide meaning";
  });
}
