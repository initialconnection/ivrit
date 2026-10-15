// Alef-bet lessons, in teaching order. Each lesson adds a few letters and vowels,
// then practises reading words made only from what has been taught so far.
//
// Fields:
//   id       unique id
//   title    short name
//   letters  ids from letters.js (finals use "<letter>-final")
//   vowels   ids from vowels.js
//   intro    one-line introduction
//   words    words to read: he (with vowels), tr (English letters), en (meaning)

export const ALEFBET_LESSONS = [
  { id: "ab1", title: "Shabbat", letters: ["bet", "shin", "tav"], vowels: ["kamatz", "patach"],
    intro: "Your first three letters and the a sound. By the end you'll read your first word: Shabbat.",
    words: [
      { he: "שַׁבָּת", tr: "Shabbat", en: "Sabbath" },
      { he: "בַּת", tr: "bat", en: "daughter" }
    ] },
  { id: "ab2", title: "What and why", letters: ["lamed", "mem", "mem-final", "he"], vowels: ["chirik"],
    intro: "Lamed, mem (and its end-of-word form) and he, plus the i sound.",
    words: [
      { he: "מָה", tr: "ma", en: "what" },
      { he: "לָמָּה", tr: "lama", en: "why" },
      { he: "שָׁם", tr: "sham", en: "there" },
      { he: "מִלָּה", tr: "mila", en: "word" }
    ] },
  { id: "ab3", title: "Door and sun", letters: ["dalet", "resh"], vowels: ["segol", "tsere"],
    intro: "Dalet and resh look alike, so watch the corner. Plus the e sound.",
    words: [
      { he: "דֶּלֶת", tr: "delet", en: "door" },
      { he: "שֶׁמֶשׁ", tr: "shemesh", en: "sun" },
      { he: "שֵׁם", tr: "shem", en: "name" },
      { he: "הֵם", tr: "hem", en: "they" },
      { he: "הַר", tr: "har", en: "mountain" }
    ] },
  { id: "ab4", title: "Adam and Moshe", letters: ["alef", "nun", "nun-final"], vowels: ["cholam"],
    intro: "Silent alef, nun (and its end-of-word form), and the o sound.",
    words: [
      { he: "אָדָם", tr: "adam", en: "person" },
      { he: "לֹא", tr: "lo", en: "no" },
      { he: "מֹשֶׁה", tr: "Moshe", en: "Moses" },
      { he: "אֹהֶל", tr: "ohel", en: "tent" },
      { he: "נֵר", tr: "ner", en: "candle" }
    ] },
  { id: "ab5", title: "Shalom", letters: ["vav", "yud"], vowels: ["cholam-male", "shuruk"],
    intro: "Vav and yud, which also work as vowels: וֹ says o and וּ says u.",
    words: [
      { he: "שָׁלוֹם", tr: "shalom", en: "hello, peace" },
      { he: "תּוֹדָה", tr: "toda", en: "thank you" },
      { he: "הוּא", tr: "hu", en: "he" },
      { he: "מִי", tr: "mi", en: "who" },
      { he: "יוֹם", tr: "yom", en: "day" }
    ] },
  { id: "ab6", title: "King", letters: ["kaf", "kaf-final", "gimel"], vowels: ["kubutz"],
    intro: "Kaf and khaf (with and without a dot), gimel, and a second way to write u.",
    words: [
      { he: "כֵּן", tr: "ken", en: "yes" },
      { he: "מֶלֶךְ", tr: "melech", en: "king" },
      { he: "גָּדוֹל", tr: "gadol", en: "big" },
      { he: "כֻּלָּם", tr: "kulam", en: "everyone" }
    ] },
  { id: "ab7", title: "Book", letters: ["pe", "pe-final", "samech"], vowels: ["shva"],
    intro: "Pe and fe, samech, and shva: a quick e or no sound at all.",
    words: [
      { he: "סֵפֶר", tr: "sefer", en: "book" },
      { he: "פֶּה", tr: "pe", en: "mouth" },
      { he: "כֶּסֶף", tr: "kesef", en: "money" },
      { he: "סְפָרִים", tr: "sfarim", en: "books" }
    ] },
  { id: "ab8", title: "Bread and milk", letters: ["chet", "ayin"], vowels: ["chataf-patach", "chataf-segol", "chataf-kamatz"],
    intro: "Throaty chet, silent ayin, and the short vowels that sit under them.",
    words: [
      { he: "חָלָב", tr: "chalav", en: "milk" },
      { he: "לֶחֶם", tr: "lechem", en: "bread" },
      { he: "עֶרֶב", tr: "erev", en: "evening" },
      { he: "אֲנִי", tr: "ani", en: "I" },
      { he: "אֱמֶת", tr: "emet", en: "truth" },
      { he: "חֲבֵרָה", tr: "chavera", en: "friend (f)" }
    ] },
  { id: "ab9", title: "Good", letters: ["zayin", "tet", "kuf", "tsadi", "tsadi-final"], vowels: [],
    intro: "The last four letters: zayin, tet, kuf and tsadi.",
    words: [
      { he: "זֶה", tr: "ze", en: "this" },
      { he: "טוֹב", tr: "tov", en: "good" },
      { he: "קָפֶה", tr: "kafe", en: "coffee" },
      { he: "אֶרֶץ", tr: "eretz", en: "land" },
      { he: "עֵץ", tr: "etz", en: "tree" }
    ] },
  { id: "ab10", title: "Israel", letters: [], vowels: [], sin: true,
    intro: "Shin's twin: with the dot on the left (שׂ) it says s. Then a review of the whole alef-bet.",
    words: [
      { he: "עֶשֶׂר", tr: "eser", en: "ten" },
      { he: "יִשְׂרָאֵל", tr: "Yisrael", en: "Israel" },
      { he: "שָׂרָה", tr: "Sara", en: "Sarah" },
      { he: "שָׂמֵחַ", tr: "sameach", en: "happy" }
    ] }
];
