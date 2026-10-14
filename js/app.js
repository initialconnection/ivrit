// Ivrit Word Game: main game logic.
// Screens: home (pick topics + direction) → flashcards → results.

const app = document.getElementById("app");

// Small helpers
const store = {
  get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
};
const shuffle = list => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Saved settings and progress (kept in this browser only)
const settings = store.get("ivrit-settings", { topics: ["basics"], direction: "he-en" });
const progress = store.get("ivrit-progress", { rounds: 0 });

// Current round
let deck = [], queue = [], learned = 0, misses = {}, flipped = false, playing = false;

function header(right = "") {
  return `<div class="top"><div><p class="eyebrow">Hebrew in English letters</p><h1>Ivrit Word Game</h1></div>${right}</div>`;
}

/* ---------- Home screen ---------- */
function showHome() {
  playing = false;
  app.innerHTML = `
    ${header(`<div class="stats"><span>Rounds finished: <b>${progress.rounds}</b></span></div>`)}
    <section class="panel">
      <h2>Pick your topics</h2>
      <div class="choices">
        ${TOPICS.map(t => `
          <label class="choice"><input type="checkbox" name="topic" value="${t.id}" ${settings.topics.includes(t.id) ? "checked" : ""}>
            <span>${esc(t.name)}<small>${t.words.length} words</small></span></label>`).join("")}
      </div>
    </section>
    <section class="panel">
      <h2>Which way?</h2>
      <div class="choices">
        <label class="choice"><input type="radio" name="dir" value="he-en" ${settings.direction === "he-en" ? "checked" : ""}>
          <span>Hebrew → English<small>See Hebrew, say the meaning</small></span></label>
        <label class="choice"><input type="radio" name="dir" value="en-he" ${settings.direction === "en-he" ? "checked" : ""}>
          <span>English → Hebrew<small>See English, say it in Hebrew</small></span></label>
      </div>
    </section>
    <div class="row"><span class="muted" id="msg"></span><button class="btn main" id="start">Start flashcards</button></div>`;

  document.getElementById("start").onclick = () => {
    const topics = [...app.querySelectorAll('input[name="topic"]:checked')].map(i => i.value);
    if (!topics.length) { document.getElementById("msg").textContent = "Pick at least one topic."; return; }
    settings.topics = topics;
    settings.direction = app.querySelector('input[name="dir"]:checked').value;
    store.set("ivrit-settings", settings);
    startRound();
  };
}

/* ---------- Flashcards ---------- */
function startRound() {
  deck = TOPICS.filter(t => settings.topics.includes(t.id)).flatMap(t => t.words);
  queue = shuffle(deck.map((_, i) => i));
  learned = 0; misses = {}; flipped = false; playing = true;
  showCard();
}

function showCard() {
  if (!queue.length) return showResults();
  const [hebrew, english, tip] = deck[queue[0]];
  const front = settings.direction === "he-en" ? hebrew : english;
  const back = settings.direction === "he-en" ? english : hebrew;

  app.innerHTML = `
    ${header(`<div class="stats"><span><b>${learned}</b>/${deck.length} learned</span><span><b>${queue.length}</b> left</span></div>`)}
    <div class="progress" aria-hidden="true"><div style="width:${learned / deck.length * 100}%"></div></div>
    <button class="card ${flipped ? "flip" : ""}" id="card">
      <div class="prompt-word">${esc(front)}</div>
      ${flipped
        ? `<div class="answer-word">${esc(back)}</div>${tip ? `<p class="note">${esc(tip)}</p>` : ""}`
        : `<p class="hint">Say the answer out loud, then tap to check</p>`}
    </button>
    <div class="answers">
      <button class="btn again" id="again" ${flipped ? "" : "disabled"}>Still learning</button>
      <button class="btn knew" id="knew" ${flipped ? "" : "disabled"}>I knew it</button>
    </div>
    <div class="row"><button class="link" id="quit">Back to topics</button>
      <p class="keys">Keys: <kbd>Space</kbd> flip · <kbd>1</kbd> still learning · <kbd>2</kbd> knew it</p></div>`;

  document.getElementById("card").onclick = flip;
  document.getElementById("again").onclick = () => answer(false);
  document.getElementById("knew").onclick = () => answer(true);
  document.getElementById("quit").onclick = showHome;
  document.getElementById(flipped ? "knew" : "card").focus({ preventScroll: true });
}

function flip() { flipped = !flipped; showCard(); }

function answer(knewIt) {
  if (!flipped) return;
  const id = queue.shift();
  if (knewIt) learned++;
  else {
    misses[id] = (misses[id] || 0) + 1;
    queue.splice(Math.min(3, queue.length), 0, id); // comes back a few cards later
  }
  flipped = false;
  showCard();
}

/* ---------- Results ---------- */
function showResults() {
  playing = false;
  progress.rounds++;
  store.set("ivrit-progress", progress);
  const tough = Object.keys(misses).sort((a, b) => misses[b] - misses[a]);
  const retries = Object.values(misses).reduce((a, b) => a + b, 0);

  app.innerHTML = `
    ${header(`<div class="stats"><span>Rounds finished: <b>${progress.rounds}</b></span></div>`)}
    <div class="progress" aria-hidden="true"><div style="width:100%"></div></div>
    <section class="panel done">
      <p class="eyebrow">Round complete</p>
      <div class="big">${deck.length}/${deck.length}</div>
      <h2>${retries === 0 ? "Perfect round. Kol ha-kavod!" : `All learned, with ${retries} ${retries === 1 ? "retry" : "retries"}.`}</h2>
      ${tough.length ? `<p class="muted">Words to keep practising:</p><div class="tough">${tough.map(i => `<span class="chip">${esc(deck[i][0])}</span>`).join("")}</div>` : ""}
      <div class="row" style="justify-content:center">
        <button class="btn main" id="again">Play again</button>
        <button class="btn ghost" id="home">Change topics</button>
      </div>
    </section>`;
  document.getElementById("again").onclick = startRound;
  document.getElementById("home").onclick = showHome;
}

/* ---------- Keyboard shortcuts ---------- */
document.addEventListener("keydown", e => {
  if (!playing) return;
  if (e.key === " ") { e.preventDefault(); flip(); }
  else if (e.key === "1") answer(false);
  else if (e.key === "2") answer(true);
});

showHome();
