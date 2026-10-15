// Vowel marks (nikud). Most sit under the letter; cholam sits above it.
//
// Fields:
//   id      unique id (progress is saved against it)
//   name    vowel name
//   sound   the sound it makes
//   mark    the mark itself (added after a letter)
//   withVav true if it's written with a vav (וֹ, וּ) instead of a mark on the letter
//   sample  how it looks on a letter
//   guttural true if it's mostly used under א ה ח ע
//   note    a tip

export const VOWELS = [
  { id: "kamatz",        name: "Kamatz",        sound: "a", mark: "ָ", sample: "בָּ", note: "A small T under the letter. Says a, as in father." },
  { id: "patach",        name: "Patach",        sound: "a", mark: "ַ", sample: "בַּ", note: "A line under the letter. Also a, same as kamatz." },
  { id: "segol",         name: "Segol",         sound: "e", mark: "ֶ", sample: "בֶּ", note: "Three dots in a triangle. Says e, as in bed." },
  { id: "tsere",         name: "Tsere",         sound: "e", mark: "ֵ", sample: "בֵּ", note: "Two dots side by side. Also e." },
  { id: "chirik",        name: "Chirik",        sound: "i", mark: "ִ", sample: "בִּ", note: "One dot under the letter. Says i, as in ski. Often followed by yud (בִּי)." },
  { id: "cholam",        name: "Cholam",        sound: "o", mark: "ֹ", sample: "בֹּ", note: "One dot above the letter, top left. Says o." },
  { id: "cholam-male",   name: "Cholam male",   sound: "o", mark: "וֹ", withVav: true, sample: "בּוֹ", note: "Vav with a dot on top. Also o." },
  { id: "shuruk",        name: "Shuruk",        sound: "u", mark: "וּ", withVav: true, sample: "בּוּ", note: "Vav with a dot in its middle. Says u, as in flute." },
  { id: "kubutz",        name: "Kubutz",        sound: "u", mark: "ֻ", sample: "בֻּ", note: "Three dots slanting down. Also u." },
  { id: "shva",          name: "Shva",          sound: "e or silent", mark: "ְ", sample: "בְּ", note: "Two dots stacked. A quick e at the start of a word (בְּ = be), often silent in the middle." },
  { id: "chataf-patach", name: "Chataf patach", sound: "a", mark: "ֲ", sample: "אֲ", guttural: true, note: "Patach plus shva. A short a, mostly under א ה ח ע." },
  { id: "chataf-segol",  name: "Chataf segol",  sound: "e", mark: "ֱ", sample: "אֱ", guttural: true, note: "Segol plus shva. A short e, mostly under א ה ח ע." },
  { id: "chataf-kamatz", name: "Chataf kamatz", sound: "o", mark: "ֳ", sample: "אֳ", guttural: true, note: "Kamatz plus shva. A short o. Rare." }
];

export const VOWEL_BY_ID = Object.fromEntries(VOWELS.map(v => [v.id, v]));

// Removes all vowel marks and dots, leaving plain letters (how most Hebrew is printed).
export function stripNikud(text) {
  return String(text).replace(/[֑-ׇ]/g, "");
}
