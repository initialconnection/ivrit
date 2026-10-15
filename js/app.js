// Ivrit: app shell. Switches between the six tabs and runs practice sessions.

import * as today from "./views/today.js";
import * as lessons from "./views/lessons.js";
import * as alefbet from "./views/alefbet.js";
import * as practice from "./views/practice.js";
import * as read from "./views/read.js";
import * as progress from "./views/progress.js";
import * as session from "./views/session.js";

const VIEWS = { today, lessons, alefbet, practice, read, progress };
const view = document.getElementById("view");
let current = null;

const ctx = {
  // Go to a tab.
  go(name) {
    if (location.hash === "#" + name) render(); else location.hash = name;
  },
  // Start a flashcard session: { title, ids, mode, returnTo }
  startSession(config) {
    if (!config.ids || !config.ids.length) { ctx.toast("Nothing to practise there yet."); return; }
    current = "session";
    markTab(config.returnTo || "practice");
    session.render(view, ctx, config);
    window.scrollTo(0, 0);
  },
  toast(text) {
    const t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status"); t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  },
  rerender() { render(); }
};

function routeName() {
  const name = location.hash.replace("#", "");
  return name in VIEWS ? name : "today";
}

function markTab(name) {
  document.querySelectorAll(".tabbar a").forEach(a => {
    if (a.dataset.tab === name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
}

function render() {
  const name = routeName();
  current = name;
  markTab(name);
  VIEWS[name].render(view, ctx);
  document.title = name === "today" ? "Ivrit" : `Ivrit · ${name === "alefbet" ? "Alef-Bet" : name[0].toUpperCase() + name.slice(1)}`;
}

window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
document.addEventListener("keydown", e => { if (current === "session") session.onKey(e); });
// Tapping the tab you're already on (for example to leave a session) re-opens that tab.
document.querySelector(".tabbar").addEventListener("click", e => {
  const a = e.target.closest("a");
  if (a && location.hash === "#" + a.dataset.tab) { e.preventDefault(); render(); window.scrollTo(0, 0); }
});
render();
