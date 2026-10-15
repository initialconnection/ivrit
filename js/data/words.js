// All vocabulary. Every word has a unique id that progress, sentences and roots point to.
//
// Fields:
//   id     unique, never change it once published (progress is saved against it)
//   tr     Hebrew in English letters (transliteration)
//   he     Hebrew script with vowels (nikud)
//   en     English meaning
//   pos    part of speech: noun, verb, adjective, pronoun, number, phrase, word
//   root   id of the root in roots.js, or null
//   topic  id of the topic in levels.js
//   level  1 = Aleph, 2 = Bet, 3 = Gimel, 4 = Dalet, 5 = Hey
//   tip    optional extra note
//
// To add a word: copy a line, give it a new id, and change the fields.

export const WORDS = [
  // ---- Everyday basics ----
  { id: "shalom", tr: "Shalom", he: "שָׁלוֹם", en: "Hello / goodbye", pos: "phrase", root: "shlm", topic: "basics", level: 1, tip: "Literally “peace”. Works for both coming and going." },
  { id: "toda", tr: "Toda", he: "תּוֹדָה", en: "Thank you", pos: "phrase", root: "ydh", topic: "basics", level: 1, tip: "Toda raba = thank you very much." },
  { id: "bevakasha", tr: "Bevakasha", he: "בְּבַקָּשָׁה", en: "Please / you're welcome", pos: "phrase", root: "bksh", topic: "basics", level: 1, tip: "One word, two jobs." },
  { id: "ken", tr: "Ken", he: "כֵּן", en: "Yes", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "lo", tr: "Lo", he: "לֹא", en: "No / not", pos: "word", root: null, topic: "basics", level: 1, tip: "Ani lo = I'm not." },
  { id: "boker-tov", tr: "Boker tov", he: "בֹּקֶר טוֹב", en: "Good morning", pos: "phrase", root: "bkr", topic: "basics", level: 1, tip: "Reply: boker or (morning of light)." },
  { id: "erev-tov", tr: "Erev tov", he: "עֶרֶב טוֹב", en: "Good evening", pos: "phrase", root: null, topic: "basics", level: 1, tip: "" },
  { id: "laila-tov", tr: "Laila tov", he: "לַיְלָה טוֹב", en: "Good night", pos: "phrase", root: null, topic: "basics", level: 1, tip: "" },
  { id: "slicha", tr: "Slicha", he: "סְלִיחָה", en: "Excuse me / sorry", pos: "phrase", root: "slch", topic: "basics", level: 1, tip: "" },
  { id: "ma-nishma", tr: "Ma nishma?", he: "מָה נִשְׁמָע?", en: "What's up? / How's it going?", pos: "phrase", root: "shma", topic: "basics", level: 1, tip: "Casual. Answer: beseder." },
  { id: "beseder", tr: "Beseder", he: "בְּסֵדֶר", en: "Okay / fine", pos: "phrase", root: "sdr", topic: "basics", level: 1, tip: "Literally “in order”." },
  { id: "lehitraot", tr: "Lehitra'ot", he: "לְהִתְרָאוֹת", en: "See you later", pos: "phrase", root: "rah", topic: "basics", level: 1, tip: "The everyday goodbye." },
  { id: "lo-mevin", tr: "Ani lo mevin / mevina", he: "אֲנִי לֹא מֵבִין / מְבִינָה", en: "I don't understand", pos: "phrase", root: "byn", topic: "basics", level: 1, tip: "Mevin if you're a man, mevina if you're a woman." },
  { id: "eifo", tr: "Eifo?", he: "אֵיפֹה?", en: "Where?", pos: "word", root: null, topic: "basics", level: 1, tip: "Eifo ha-sherutim? = Where are the restrooms?" },

  // ---- People & family ----
  { id: "ani", tr: "Ani", he: "אֲנִי", en: "I / me", pos: "pronoun", root: null, topic: "people", level: 1, tip: "" },
  { id: "ata-at", tr: "Ata / At", he: "אַתָּה / אַתְּ", en: "You", pos: "pronoun", root: null, topic: "people", level: 1, tip: "Ata to a man, at to a woman." },
  { id: "hu-hi", tr: "Hu / Hi", he: "הוּא / הִיא", en: "He / She", pos: "pronoun", root: null, topic: "people", level: 1, tip: "" },
  { id: "ima", tr: "Ima", he: "אִמָּא", en: "Mom", pos: "noun", root: null, topic: "people", level: 1, tip: "" },
  { id: "aba", tr: "Aba", he: "אַבָּא", en: "Dad", pos: "noun", root: null, topic: "people", level: 1, tip: "" },
  { id: "ach-achot", tr: "Ach / Achot", he: "אָח / אָחוֹת", en: "Brother / Sister", pos: "noun", root: null, topic: "people", level: 1, tip: "Plural: achim / achayot." },
  { id: "saba-savta", tr: "Saba / Savta", he: "סַבָּא / סָבְתָא", en: "Grandpa / Grandma", pos: "noun", root: null, topic: "people", level: 1, tip: "" },
  { id: "yeled-yalda", tr: "Yeled / Yalda", he: "יֶלֶד / יַלְדָּה", en: "Boy / Girl", pos: "noun", root: "yld", topic: "people", level: 1, tip: "Plural: yeladim (children)." },
  { id: "chaver-chavera", tr: "Chaver / Chavera", he: "חָבֵר / חֲבֵרָה", en: "Friend (m / f)", pos: "noun", root: "chbr", topic: "people", level: 1, tip: "Also means boyfriend / girlfriend." },

  // ---- Food & home ----
  { id: "mayim", tr: "Mayim", he: "מַיִם", en: "Water", pos: "noun", root: null, topic: "food", level: 1, tip: "Always plural in Hebrew." },
  { id: "lechem", tr: "Lechem", he: "לֶחֶם", en: "Bread", pos: "noun", root: "lchm", topic: "food", level: 1, tip: "The ch sounds like the ch in Bach." },
  { id: "ochel", tr: "Ochel", he: "אֹכֶל", en: "Food", pos: "noun", root: "akl", topic: "food", level: 1, tip: "Same root as le'echol, to eat." },
  { id: "kafe", tr: "Kafe", he: "קָפֶה", en: "Coffee", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "chalav", tr: "Chalav", he: "חָלָב", en: "Milk", pos: "noun", root: "chlv", topic: "food", level: 1, tip: "" },
  { id: "bayit", tr: "Bayit", he: "בַּיִת", en: "House / home", pos: "noun", root: null, topic: "food", level: 1, tip: "Ha-bayta = (going) home." },
  { id: "raev", tr: "Ani ra'ev / re'eva", he: "אֲנִי רָעֵב / רְעֵבָה", en: "I'm hungry", pos: "phrase", root: "rav", topic: "food", level: 1, tip: "Ra'ev for a man, re'eva for a woman." },
  { id: "taim", tr: "Ta'im", he: "טָעִים", en: "Tasty", pos: "adjective", root: "tam", topic: "food", level: 1, tip: "Ze ta'im! = It's tasty!" },

  // ---- Numbers 1–10 (feminine forms, used for counting) ----
  { id: "achat", tr: "Achat", he: "אַחַת", en: "One (1)", pos: "number", root: null, topic: "numbers", level: 1, tip: "Echad is the masculine form." },
  { id: "shtayim", tr: "Shtayim", he: "שְׁתַּיִם", en: "Two (2)", pos: "number", root: null, topic: "numbers", level: 1, tip: "Shnayim is the masculine form." },
  { id: "shalosh", tr: "Shalosh", he: "שָׁלוֹשׁ", en: "Three (3)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },
  { id: "arba", tr: "Arba", he: "אַרְבַּע", en: "Four (4)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },
  { id: "chamesh", tr: "Chamesh", he: "חָמֵשׁ", en: "Five (5)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },
  { id: "shesh", tr: "Shesh", he: "שֵׁשׁ", en: "Six (6)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },
  { id: "sheva", tr: "Sheva", he: "שֶׁבַע", en: "Seven (7)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },
  { id: "shmone", tr: "Shmone", he: "שְׁמוֹנֶה", en: "Eight (8)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },
  { id: "tesha", tr: "Tesha", he: "תֵּשַׁע", en: "Nine (9)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },
  { id: "eser", tr: "Eser", he: "עֶשֶׂר", en: "Ten (10)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" }
];

export const WORD_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));
