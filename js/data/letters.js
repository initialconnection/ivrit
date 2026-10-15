// The Hebrew alphabet (alef-bet), in order.
//
// Fields:
//   id      unique id (progress is saved against it)
//   he      the letter
//   name    letter name
//   sound   what it sounds like
//   final   final form (used at the end of a word), if it has one
//   forms   the sounds it can make, each with the exact character to show (used to build syllables)
//   note    a tip

const DAGESH = "ּ", SHIN_DOT = "ׁ", SIN_DOT = "ׂ";

export const LETTERS = [
  { id: "alef",   he: "א", name: "Alef",   sound: "silent", note: "Silent: it takes the sound of its vowel.", forms: [{ c: "א", s: "" }] },
  { id: "bet",    he: "ב", name: "Bet / Vet", sound: "b / v", note: "With a dot inside (בּ) it's b. Without it (ב) it's v.", forms: [{ c: "ב" + DAGESH, s: "b" }, { c: "ב", s: "v" }] },
  { id: "gimel",  he: "ג", name: "Gimel",  sound: "g", note: "Hard g, as in go.", forms: [{ c: "ג", s: "g" }] },
  { id: "dalet",  he: "ד", name: "Dalet",  sound: "d", note: "Square corner on the right. Resh (ר) is rounded.", forms: [{ c: "ד", s: "d" }] },
  { id: "he",     he: "ה", name: "He",     sound: "h", note: "Usually silent at the end of a word.", forms: [{ c: "ה", s: "h" }] },
  { id: "vav",    he: "ו", name: "Vav",    sound: "v / o / u", note: "A consonant v, or a vowel: וֹ is o, וּ is u.", forms: [{ c: "ו", s: "v" }] },
  { id: "zayin",  he: "ז", name: "Zayin",  sound: "z", note: "Like vav with a little hat.", forms: [{ c: "ז", s: "z" }] },
  { id: "chet",   he: "ח", name: "Chet",   sound: "ch", note: "Throaty ch, as in Bach. Closed on the left, unlike he (ה).", forms: [{ c: "ח", s: "ch" }] },
  { id: "tet",    he: "ט", name: "Tet",    sound: "t", note: "Sounds the same as tav (ת).", forms: [{ c: "ט", s: "t" }] },
  { id: "yud",    he: "י", name: "Yud",    sound: "y / i", note: "The smallest letter. Also used as the vowel i.", forms: [{ c: "י", s: "y" }] },
  { id: "kaf",    he: "כ", name: "Kaf / Khaf", sound: "k / kh", final: "ך", note: "With a dot (כּ) it's k. Without it (כ) it's kh.", forms: [{ c: "כ" + DAGESH, s: "k" }, { c: "כ", s: "kh" }] },
  { id: "lamed",  he: "ל", name: "Lamed",  sound: "l", note: "The only letter that rises above the line.", forms: [{ c: "ל", s: "l" }] },
  { id: "mem",    he: "מ", name: "Mem",    sound: "m", final: "ם", note: "At the end of a word it becomes a closed box (ם).", forms: [{ c: "מ", s: "m" }] },
  { id: "nun",    he: "נ", name: "Nun",    sound: "n", final: "ן", note: "At the end of a word it drops below the line (ן).", forms: [{ c: "נ", s: "n" }] },
  { id: "samech", he: "ס", name: "Samech", sound: "s", note: "Round. Don't mix it up with final mem (ם), which is square.", forms: [{ c: "ס", s: "s" }] },
  { id: "ayin",   he: "ע", name: "Ayin",   sound: "silent", note: "Most Israelis say it like alef: silent, taking its vowel's sound.", forms: [{ c: "ע", s: "" }] },
  { id: "pe",     he: "פ", name: "Pe / Fe", sound: "p / f", final: "ף", note: "With a dot (פּ) it's p. Without it (פ) it's f.", forms: [{ c: "פ" + DAGESH, s: "p" }, { c: "פ", s: "f" }] },
  { id: "tsadi",  he: "צ", name: "Tsadi",  sound: "ts", final: "ץ", note: "Like the ts in cats.", forms: [{ c: "צ", s: "ts" }] },
  { id: "kuf",    he: "ק", name: "Kuf",    sound: "k", note: "Sounds the same as kaf with a dot (כּ).", forms: [{ c: "ק", s: "k" }] },
  { id: "resh",   he: "ר", name: "Resh",   sound: "r", note: "Said in the throat, like a French r. Rounded, unlike dalet (ד).", forms: [{ c: "ר", s: "r" }] },
  { id: "shin",   he: "ש", name: "Shin / Sin", sound: "sh / s", note: "Dot on the right (שׁ) is sh. Dot on the left (שׂ) is s.", forms: [{ c: "ש" + SHIN_DOT, s: "sh" }, { c: "ש" + SIN_DOT, s: "s" }] },
  { id: "tav",    he: "ת", name: "Tav",    sound: "t", note: "Sounds the same as tet (ט).", forms: [{ c: "ת", s: "t" }] }
];

// The five final forms, tracked as their own items.
export const FINALS = LETTERS.filter(l => l.final).map(l => ({
  id: l.id + "-final", he: l.final, name: "Final " + l.name.split(" / ").at(-1).toLowerCase(), base: l.id, sound: l.sound.split(" / ").at(-1)
}));

export const LETTER_BY_ID = Object.fromEntries([...LETTERS, ...FINALS].map(l => [l.id, l]));

// Letters that are easy to confuse.
export const LOOK_ALIKES = [
  ["bet", "kaf"],
  ["dalet", "resh"],
  ["vav", "zayin"],
  ["he", "chet", "tav"],
  ["gimel", "nun"],
  ["ayin", "tsadi"],
  ["tet", "mem"]
];
