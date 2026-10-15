// The Hebrew alphabet (alef-bet), in order. Used by the Alef-Bet tab.
// Fields: id, he (letter), name, sound, final (final form, if any), note

export const LETTERS = [
  { id: "alef",   he: "א", name: "Alef",   sound: "silent / carries a vowel", note: "Takes the sound of its vowel." },
  { id: "bet",    he: "ב", name: "Bet / Vet", sound: "b / v", note: "With a dot inside: b. Without: v." },
  { id: "gimel",  he: "ג", name: "Gimel",  sound: "g", note: "Hard g, as in go." },
  { id: "dalet",  he: "ד", name: "Dalet",  sound: "d", note: "Easy to confuse with resh." },
  { id: "he",     he: "ה", name: "He",     sound: "h", note: "Often silent at the end of a word." },
  { id: "vav",    he: "ו", name: "Vav",    sound: "v / o / u", note: "Also used as the vowels o and u." },
  { id: "zayin",  he: "ז", name: "Zayin",  sound: "z", note: "" },
  { id: "chet",   he: "ח", name: "Chet",   sound: "ch (as in Bach)", note: "" },
  { id: "tet",    he: "ט", name: "Tet",    sound: "t", note: "" },
  { id: "yud",    he: "י", name: "Yud",    sound: "y / i", note: "Also used as the vowel i." },
  { id: "kaf",    he: "כ", name: "Kaf / Khaf", sound: "k / kh", final: "ך", note: "With a dot: k. Without: kh." },
  { id: "lamed",  he: "ל", name: "Lamed",  sound: "l", note: "The only letter that rises above the line." },
  { id: "mem",    he: "מ", name: "Mem",    sound: "m", final: "ם", note: "" },
  { id: "nun",    he: "נ", name: "Nun",    sound: "n", final: "ן", note: "" },
  { id: "samech", he: "ס", name: "Samech", sound: "s", note: "" },
  { id: "ayin",   he: "ע", name: "Ayin",   sound: "silent / carries a vowel", note: "Most Israelis pronounce it like alef." },
  { id: "pe",     he: "פ", name: "Pe / Fe", sound: "p / f", final: "ף", note: "With a dot: p. Without: f." },
  { id: "tsadi",  he: "צ", name: "Tsadi",  sound: "ts", final: "ץ", note: "" },
  { id: "kuf",    he: "ק", name: "Kuf",    sound: "k", note: "" },
  { id: "resh",   he: "ר", name: "Resh",   sound: "r", note: "Said in the throat, like a French r." },
  { id: "shin",   he: "ש", name: "Shin / Sin", sound: "sh / s", note: "Dot on the right: sh. Dot on the left: s." },
  { id: "tav",    he: "ת", name: "Tav",    sound: "t", note: "" }
];
