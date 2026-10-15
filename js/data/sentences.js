// Example sentences. `words` lists the ids of words from words.js the sentence uses,
// so practising a sentence can count toward those words (used from Phase 4 on).
// Fields: id, tr, en, words, level, grammar (optional note)

export const SENTENCES = [
  { id: "s-shalom-ma-nishma", tr: "Shalom, ma nishma?", en: "Hi, how's it going?", words: ["shalom", "ma-nishma"], level: 1 },
  { id: "s-beseder-toda", tr: "Beseder, toda.", en: "Fine, thanks.", words: ["beseder", "toda"], level: 1 },
  { id: "s-ani-raev", tr: "Ani ra'ev.", en: "I'm hungry. (said by a man)", words: ["ani", "raev"], level: 1, grammar: "No word for “am” in the present tense." },
  { id: "s-ze-taim", tr: "Ha-lechem ta'im.", en: "The bread is tasty.", words: ["lechem", "taim"], level: 1, grammar: "Ha- means “the”." },
  { id: "s-eifo-ima", tr: "Eifo Ima?", en: "Where's Mom?", words: ["eifo", "ima"], level: 1 },
  { id: "s-slicha-lo-mevin", tr: "Slicha, ani lo mevina.", en: "Sorry, I don't understand. (said by a woman)", words: ["slicha", "lo-mevin"], level: 1 },
  { id: "s-kafe-bevakasha", tr: "Kafe, bevakasha.", en: "A coffee, please.", words: ["kafe", "bevakasha"], level: 1 },
  { id: "s-shalosh-yeladim", tr: "Yesh li shlosha yeladim.", en: "I have three children.", words: ["shalosh", "yeled-yalda"], level: 1, grammar: "Yesh li = I have. With a masculine noun, three is shlosha." }
];
