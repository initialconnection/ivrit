// Alef-bet logic: what's been taught, building quiz questions, reading ladder and progress.
//
// A question looks like:
//   { prompt: "Which letter is this?", show: "ש", showLatin?: "...", options: [{ he?, text? }],
//     answer: <index>, credits: [["letters", "shin"]], rung?: "syllables", explain?: "..." }

import { LETTERS, FINALS, LETTER_BY_ID, LOOK_ALIKES } from "../data/letters.js";
import { VOWELS, VOWEL_BY_ID, stripNikud } from "../data/vowels.js";
import { ALEFBET_LESSONS } from "../data/alefbet-lessons.js";
import { WORDS } from "../data/words.js";
import { shuffle, todayKey } from "./util.js";
import { strength, statusOf, isDue } from "./srs.js";

const GUTTURALS = ["alef", "he", "chet", "ayin"];
export const RUNGS = [
  { id: "syllables", name: "Syllables", desc: "Sound out a letter with a vowel", unlock: "ab1" },
  { id: "words", name: "Words with vowels", desc: "Read whole words with vowel marks", unlock: "ab2" },
  { id: "plain", name: "Words without vowels", desc: "Read words the way Israelis print them", unlock: "ab10" }
];

// ---------- What has been taught ----------

// Letters, finals and vowels taught up to and including lesson index `upTo`.
export function taughtUpTo(upTo) {
  const lessons = ALEFBET_LESSONS.slice(0, upTo + 1);
  return {
    letters: lessons.flatMap(l => l.letters).filter(id => !id.endsWith("-final")),
    finals: lessons.flatMap(l => l.letters).filter(id => id.endsWith("-final")),
    vowels: lessons.flatMap(l => l.vowels),
    sin: lessons.some(l => l.sin),
    words: lessons.flatMap(l => l.words)
  };
}

// Everything from finished lessons. Falls back to lesson 1 so drills always have something.
export function taughtSoFar(state) {
  const done = ALEFBET_LESSONS.map((l, i) => state.alefbet.done.includes(l.id) ? i : -1).filter(i => i >= 0);
  return taughtUpTo(done.length ? Math.max(...done) : 0);
}

export function nextLessonIndex(state) {
  const i = ALEFBET_LESSONS.findIndex(l => !state.alefbet.done.includes(l.id));
  return i === -1 ? null : i;
}

// ---------- Helpers ----------

function pick(list, n, exclude = []) {
  return shuffle(list.filter(x => !exclude.includes(x))).slice(0, n);
}
function uniqueBy(list, key) {
  const seen = new Set();
  return list.filter(x => { const k = key(x); if (seen.has(k)) return false; seen.add(k); return true; });
}
function build(prompt, show, correct, distractors, extra = {}) {
  const options = shuffle([correct, ...distractors]);
  return { prompt, show, options, answer: options.indexOf(correct), ...extra };
}
const letter = id => LETTER_BY_ID[id];

// Letters' ids used in a written word (final forms count as their final item).
const CHAR_TO_ID = Object.fromEntries([...LETTERS.map(l => [l.he, l.id]), ...FINALS.map(f => [f.he, f.id])]);
export function lettersInWord(he) {
  return [...new Set([...stripNikud(he)].map(ch => CHAR_TO_ID[ch]).filter(Boolean))];
}

// ---------- Question builders ----------

export function letterNameQ(id, pool) {
  const l = letter(id);
  const others = pick(pool.length >= 4 ? pool : LETTERS.map(x => x.id), 3, [id]).map(letter);
  return build("Which letter is this?", l.he, { text: l.name }, others.map(o => ({ text: o.name })), {
    credits: [["letters", id]], explain: `${l.name} sounds like ${l.sound}.`
  });
}

export function letterSoundQ(id, pool) {
  const l = letter(id);
  const cands = (pool.length >= 4 ? pool : LETTERS.map(x => x.id)).map(letter).filter(o => o.id !== id && o.sound !== l.sound);
  const others = uniqueBy(shuffle(cands), o => o.sound).slice(0, 3);
  return build("What sound does this letter make?", l.he, { text: l.sound }, others.map(o => ({ text: o.sound })), {
    credits: [["letters", id]], explain: `${l.name}: ${l.note}`
  });
}

export function soundToLetterQ(id, pool) {
  const l = letter(id);
  const cands = (pool.length >= 4 ? pool : LETTERS.map(x => x.id)).map(letter).filter(o => o.id !== id && o.sound !== l.sound);
  const others = uniqueBy(shuffle(cands), o => o.sound).slice(0, 3);
  const prompt = l.sound === "silent" ? "Which letter is silent?" : `Which letter says “${l.sound}”?`;
  return build(prompt, null, { he: l.he }, others.map(o => ({ he: o.he })), {
    credits: [["letters", id]], explain: `That's ${l.name}.`
  });
}

export function finalQ(finalId) {
  const f = letter(finalId);
  const others = pick(LETTERS.filter(l => l.final).map(l => l.id), 3, [f.base]).map(letter);
  return build("This is the end-of-word form of which letter?", f.he, { he: letter(f.base).he }, others.map(o => ({ he: o.he })), {
    credits: [["letters", finalId]], explain: `${f.he} is the final form of ${letter(f.base).name} (${letter(f.base).he}).`
  });
}

export function lookAlikeQ(group) {
  const id = shuffle(group).at(0);
  const l = letter(id);
  const fillers = pick(LETTERS.map(x => x.id), Math.max(0, 4 - group.length), group).map(letter);
  const others = [...group.filter(g => g !== id).map(letter), ...fillers];
  return build("Careful, which letter is this?", l.he, { text: l.name }, others.map(o => ({ text: o.name })), {
    credits: [["letters", id]], explain: `${l.name}: ${l.note}`
  });
}

const SOUNDS = ["a", "e", "i", "o", "u", "e or silent"];
export function vowelSoundQ(vid) {
  const v = VOWEL_BY_ID[vid];
  const others = pick(SOUNDS, 3, [v.sound]);
  return build("What sound does this vowel make?", v.sample, { text: v.sound }, others.map(s => ({ text: s })), {
    credits: [["vowels", vid]], explain: `${v.name}: ${v.note}`
  });
}

// One consonant + one vowel, written and sounded out.
function syllable(form, letterId, v) {
  return { he: form.c + v.mark, tr: (form.s + v.sound) || v.sound, letterId, vowelId: v.id };
}
function syllableOptions(t) {
  const out = [];
  for (const id of t.letters) {
    for (const form of letter(id).forms) {
      if (letter(id).id === "shin" && form.s === "s" && !t.sin) continue;
      for (const vid of t.vowels) {
        const v = VOWEL_BY_ID[vid];
        if (v.id === "shva") continue;
        if (v.guttural && !GUTTURALS.includes(id)) continue;
        if (v.withVav && id === "vav") continue;
        out.push(syllable(form, id, v));
      }
    }
  }
  return out;
}

export function syllableQ(t, focus = {}) {
  const all = syllableOptions(t);
  let cands = all;
  if (focus.vowel) cands = cands.filter(s => s.vowelId === focus.vowel);
  if (focus.letter) cands = cands.filter(s => s.letterId === focus.letter);
  if (focus.sin) cands = cands.filter(s => s.letterId === "shin" && s.tr.startsWith("s") && !s.tr.startsWith("sh"));
  const target = shuffle(cands.length ? cands : all).at(0);
  if (!target) return null;
  const others = uniqueBy(shuffle(all.filter(s => s.tr !== target.tr)), s => s.tr).slice(0, 3);
  while (others.length < 3) {
    const extra = ["ma", "li", "do", "ru", "ne", "ka", "ti"].find(x => x !== target.tr && !others.some(o => o.tr === x));
    others.push({ tr: extra });
  }
  return build("How do you say this?", target.he, { text: target.tr }, others.map(o => ({ text: o.tr })), {
    credits: [["letters", target.letterId], ["vowels", target.vowelId]], rung: "syllables",
    explain: `${letter(target.letterId).name} + ${VOWEL_BY_ID[target.vowelId].name} = ${target.tr}`
  });
}

export function wordReadQ(word, pool, plain = false) {
  const others = uniqueBy(shuffle(pool.filter(w => w.tr.toLowerCase() !== word.tr.toLowerCase())), w => w.tr.toLowerCase()).slice(0, 3);
  for (const spare of SPARE_READINGS) {
    if (others.length >= 3) break;
    if (spare !== word.tr.toLowerCase() && !others.some(o => o.tr.toLowerCase() === spare)) others.push({ tr: spare });
  }
  return build(plain ? "No vowels this time. How do you read it?" : "How do you read this word?",
    plain ? stripNikud(word.he) : word.he, { text: word.tr }, others.map(o => ({ text: o.tr })), {
      credits: lettersInWord(word.he).map(id => ["letters", id]), rung: plain ? "plain" : "words",
      explain: `${word.tr} means “${word.en}”.`
    });
}

// Vowel ids used in a written word.
const MARK_TO_VOWEL = { "ָ": "kamatz", "ַ": "patach", "ֶ": "segol", "ֵ": "tsere", "ִ": "chirik",
  "ֻ": "kubutz", "ְ": "shva", "ֲ": "chataf-patach", "ֱ": "chataf-segol", "ֳ": "chataf-kamatz" };
export function vowelsInWord(he) {
  const chars = [...he], out = new Set();
  chars.forEach((ch, i) => {
    if (MARK_TO_VOWEL[ch]) out.add(MARK_TO_VOWEL[ch]);
    else if (ch === "ֹ") out.add(chars[i - 1] === "ו" ? "cholam-male" : "cholam");
    else if (ch === "ּ" && chars[i - 1] === "ו" && !MARK_TO_VOWEL[chars[i + 1]]) out.add("shuruk");
  });
  return [...out];
}

// Distractor readings for when there aren't enough readable words yet.
const SPARE_READINGS = ["bata", "tash", "basha", "tavat", "tabas", "shav"];

// Words the learner can read: lesson words so far, plus app vocabulary built only from taught letters and vowels.
export function readableWords(t) {
  const known = new Set([...t.letters, ...t.finals]);
  const vowels = new Set(t.vowels);
  const fromVocab = WORDS.filter(w => !w.he.includes("/") && (t.sin || !w.he.includes("ׂ")) && lettersInWord(w.he).every(id => known.has(id)) && vowelsInWord(w.he).every(v => vowels.has(v)))
    .map(w => ({ he: w.he.replace(/[?]/g, ""), tr: w.tr.replace(/[?]/g, ""), en: w.en }));
  return uniqueBy([...t.words, ...fromVocab], w => stripNikud(w.he));
}

// ---------- Sessions ----------

export function lessonQuestions(index) {
  const lesson = ALEFBET_LESSONS[index];
  const t = taughtUpTo(index);
  const pool = t.letters;
  const qs = [];
  for (const id of lesson.letters.filter(x => !x.endsWith("-final"))) {
    qs.push(letterNameQ(id, pool), letterSoundQ(id, pool), soundToLetterQ(id, pool));
  }
  for (const id of lesson.letters.filter(x => x.endsWith("-final"))) qs.push(finalQ(id));
  for (const vid of lesson.vowels) {
    qs.push(vowelSoundQ(vid));
    if (vid !== "shva") qs.push(syllableQ(t, { vowel: vid }), syllableQ(t, { vowel: vid }));
  }
  if (lesson.sin) {
    qs.push(syllableQ(t, { sin: true }), syllableQ(t, { sin: true }));
    for (const id of pick(t.letters, 6)) qs.push(shuffle([letterNameQ, letterSoundQ]).at(0)(id, t.letters));
  }
  for (let i = 0; i < 3; i++) qs.push(syllableQ(t));
  const readPool = readableWords(t);
  for (const w of lesson.words) qs.push(wordReadQ(w, readPool));
  return qs.filter(Boolean);
}

export function drillQuestions(kind, state) {
  const t = taughtSoFar(state);
  const pool = t.letters.length >= 4 ? t.letters : LETTERS.map(l => l.id);
  const n = 12;
  switch (kind) {
    case "letters":
      return pick(pool, n).map(id => shuffle([letterNameQ, letterSoundQ, soundToLetterQ]).at(0)(id, pool));
    case "lookalikes": {
      const groups = LOOK_ALIKES.filter(g => g.every(id => pool.includes(id)));
      const use = groups.length ? groups : LOOK_ALIKES;
      return Array.from({ length: 10 }, (_, i) => lookAlikeQ(use.at(i % use.length)));
    }
    case "finals": {
      const finals = t.finals.length ? t.finals : FINALS.map(f => f.id);
      return Array.from({ length: 8 }, (_, i) => finalQ(finals.at(i % finals.length)));
    }
    case "vowels": {
      const vs = t.vowels.length ? t.vowels : ["kamatz", "patach"];
      return Array.from({ length: 10 }, (_, i) => vowelSoundQ(vs.at(i % vs.length)));
    }
    case "syllables":
      return Array.from({ length: n }, () => syllableQ(t)).filter(Boolean);
    case "words": {
      const words = readableWords(t);
      return pick(words, 10).map(w => wordReadQ(w, words));
    }
    case "plain": {
      const words = readableWords(taughtUpTo(ALEFBET_LESSONS.length - 1));
      return pick(words, 10).map(w => wordReadQ(w, words, true));
    }
    case "review":
      return dueQuestions(state);
    default:
      return [];
  }
}

// Letters and vowels whose review is due.
export function dueQuestions(state) {
  const key = todayKey();
  const t = taughtSoFar(state);
  const qs = [];
  for (const [id, it] of Object.entries(state.letters)) {
    if (!isDue(it, key)) continue;
    qs.push(id.endsWith("-final") ? finalQ(id) : shuffle([letterNameQ, letterSoundQ]).at(0)(id, t.letters));
  }
  for (const [id, it] of Object.entries(state.vowels)) if (isDue(it, key)) qs.push(vowelSoundQ(id));
  return shuffle(qs).slice(0, 20);
}

export function dueCount(state, key) {
  return Object.values(state.letters).filter(it => isDue(it, key)).length + Object.values(state.vowels).filter(it => isDue(it, key)).length;
}

// ---------- Progress ----------

export function rungStatus(state) {
  return RUNGS.map(r => {
    const s = state.alefbet.ladder[r.id] || { seen: 0, right: 0 };
    const acc = s.seen ? s.right / s.seen : 0;
    return { ...r, ...s, accuracy: acc, passed: s.seen >= 20 && acc >= 0.8, unlocked: state.alefbet.done.includes(r.unlock) };
  });
}

export function letterSummary(state, today) {
  const all = [...LETTERS.map(l => l.id), ...FINALS.map(f => f.id)];
  const statuses = all.map(id => statusOf(state.letters[id]));
  const vstat = VOWELS.map(v => statusOf(state.vowels[v.id]));
  const started = s => s !== "new";
  return {
    lettersStarted: statuses.filter(started).length,
    lettersKnown: statuses.filter(s => s === "known" || s === "mastered").length,
    lettersTotal: all.length,
    vowelsStarted: vstat.filter(started).length,
    vowelsKnown: vstat.filter(s => s === "known" || s === "mastered").length,
    vowelsTotal: VOWELS.length
  };
}

// 0–1 value for the fluency score's "Letters & vowels" area.
export function alefbetValue(state, today) {
  const ids = [...LETTERS.map(l => l.id), ...FINALS.map(f => f.id)];
  let sum = 0;
  for (const id of ids) sum += strength(state.letters[id], today);
  for (const v of VOWELS) sum += strength(state.vowels[v.id], today);
  const items = sum / (ids.length + VOWELS.length);
  const rungs = rungStatus(state).filter(r => r.passed).length / RUNGS.length;
  return Math.min(1, 0.85 * items + 0.15 * rungs);
}
