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
  { id: "shalosh", tr: "Shalosh", he: "שָׁלוֹשׁ", en: "Three (3)", pos: "number", root: "shlsh", topic: "numbers", level: 1, tip: "" },
  { id: "arba", tr: "Arba", he: "אַרְבַּע", en: "Four (4)", pos: "number", root: "rba", topic: "numbers", level: 1, tip: "" },
  { id: "chamesh", tr: "Chamesh", he: "חָמֵשׁ", en: "Five (5)", pos: "number", root: "chmsh", topic: "numbers", level: 1, tip: "" },
  { id: "shesh", tr: "Shesh", he: "שֵׁשׁ", en: "Six (6)", pos: "number", root: "shsh", topic: "numbers", level: 1, tip: "" },
  { id: "sheva", tr: "Sheva", he: "שֶׁבַע", en: "Seven (7)", pos: "number", root: "shba", topic: "numbers", level: 1, tip: "" },
  { id: "shmone", tr: "Shmone", he: "שְׁמוֹנֶה", en: "Eight (8)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },
  { id: "tesha", tr: "Tesha", he: "תֵּשַׁע", en: "Nine (9)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },
  { id: "eser", tr: "Eser", he: "עֶשֶׂר", en: "Ten (10)", pos: "number", root: null, topic: "numbers", level: 1, tip: "" },

  // ---- More everyday basics ----
  { id: "naim-meod", tr: "Na'im me'od", he: "נָעִים מְאוֹד", en: "Nice to meet you", pos: "phrase", root: null, topic: "basics", level: 1, tip: "Literally “very pleasant”." },
  { id: "ma-shimcha", tr: "Ma shimcha / shmech?", he: "מָה שִׁמְךָ / שְׁמֵךְ?", en: "What's your name?", pos: "phrase", root: null, topic: "basics", level: 1, tip: "Shimcha to a man, shmech to a woman. Answer: Shmi… (My name is…)" },
  { id: "ma", tr: "Ma?", he: "מָה?", en: "What?", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "mi", tr: "Mi?", he: "מִי?", en: "Who?", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "ech", tr: "Ech?", he: "אֵיךְ?", en: "How?", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "lama", tr: "Lama?", he: "לָמָּה?", en: "Why?", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "matai", tr: "Matai?", he: "מָתַי?", en: "When?", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "kama", tr: "Kama?", he: "כַּמָּה?", en: "How much? / How many?", pos: "word", root: null, topic: "basics", level: 1, tip: "Kama ze oleh? = How much does it cost?" },
  { id: "ze", tr: "Ze", he: "זֶה", en: "This / it (m)", pos: "word", root: null, topic: "basics", level: 1, tip: "Feminine: zot." },
  { id: "po", tr: "Po", he: "פֹּה", en: "Here", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "sham", tr: "Sham", he: "שָׁם", en: "There", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "yesh", tr: "Yesh", he: "יֵשׁ", en: "There is / there are", pos: "word", root: null, topic: "basics", level: 1, tip: "Yesh li = I have." },
  { id: "ein", tr: "Ein", he: "אֵין", en: "There isn't / there aren't", pos: "word", root: null, topic: "basics", level: 1, tip: "Ein li = I don't have." },
  { id: "tov", tr: "Tov", he: "טוֹב", en: "Good", pos: "adjective", root: null, topic: "basics", level: 1, tip: "Feminine: tova." },
  { id: "ra", tr: "Ra", he: "רַע", en: "Bad", pos: "adjective", root: null, topic: "basics", level: 1, tip: "Feminine: ra'a." },
  { id: "gam", tr: "Gam", he: "גַּם", en: "Also / too", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "aval", tr: "Aval", he: "אֲבָל", en: "But", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "ulai", tr: "Ulai", he: "אוּלַי", en: "Maybe", pos: "word", root: null, topic: "basics", level: 1, tip: "" },
  { id: "meod", tr: "Me'od", he: "מְאוֹד", en: "Very", pos: "word", root: null, topic: "basics", level: 1, tip: "Comes after the word: tov me'od = very good." },

  // ---- More people & family ----
  { id: "ish", tr: "Ish", he: "אִישׁ", en: "Man", pos: "noun", root: null, topic: "people", level: 1, tip: "Plural: anashim (people)." },
  { id: "isha", tr: "Isha", he: "אִשָּׁה", en: "Woman / wife", pos: "noun", root: null, topic: "people", level: 1, tip: "Plural: nashim." },
  { id: "ben", tr: "Ben", he: "בֵּן", en: "Son", pos: "noun", root: null, topic: "people", level: 1, tip: "Plural: banim." },
  { id: "bat", tr: "Bat", he: "בַּת", en: "Daughter", pos: "noun", root: null, topic: "people", level: 1, tip: "Plural: banot." },
  { id: "mishpacha", tr: "Mishpacha", he: "מִשְׁפָּחָה", en: "Family", pos: "noun", root: "shpch", topic: "people", level: 1, tip: "" },
  { id: "baal", tr: "Ba'al", he: "בַּעַל", en: "Husband", pos: "noun", root: null, topic: "people", level: 1, tip: "" },
  { id: "horim", tr: "Horim", he: "הוֹרִים", en: "Parents", pos: "noun", root: null, topic: "people", level: 1, tip: "" },
  { id: "tinok", tr: "Tinok", he: "תִּינוֹק", en: "Baby", pos: "noun", root: null, topic: "people", level: 1, tip: "Feminine: tinoket." },
  { id: "anachnu", tr: "Anachnu", he: "אֲנַחְנוּ", en: "We", pos: "pronoun", root: null, topic: "people", level: 1, tip: "" },
  { id: "hem-hen", tr: "Hem / Hen", he: "הֵם / הֵן", en: "They", pos: "pronoun", root: null, topic: "people", level: 1, tip: "Hem for men or mixed groups, hen for women only." },
  { id: "atem-aten", tr: "Atem / Aten", he: "אַתֶּם / אַתֶּן", en: "You (plural)", pos: "pronoun", root: null, topic: "people", level: 1, tip: "Atem for men or mixed groups, aten for women only." },
  { id: "shachen", tr: "Shachen / Shchena", he: "שָׁכֵן / שְׁכֵנָה", en: "Neighbour (m / f)", pos: "noun", root: "shkn", topic: "people", level: 1, tip: "" },
  { id: "dod-doda", tr: "Dod / Doda", he: "דּוֹד / דּוֹדָה", en: "Uncle / Aunt", pos: "noun", root: null, topic: "people", level: 1, tip: "" },

  // ---- More food & home ----
  { id: "tapuach", tr: "Tapuach", he: "תַּפּוּחַ", en: "Apple", pos: "noun", root: null, topic: "food", level: 1, tip: "Tapuach adama (“earth apple”) = potato." },
  { id: "banana", tr: "Banana", he: "בָּנָנָה", en: "Banana", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "gvina", tr: "Gvina", he: "גְּבִינָה", en: "Cheese", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "beitsa", tr: "Beitsa", he: "בֵּיצָה", en: "Egg", pos: "noun", root: null, topic: "food", level: 1, tip: "Plural: beitsim." },
  { id: "of", tr: "Of", he: "עוֹף", en: "Chicken", pos: "noun", root: null, topic: "food", level: 1, tip: "Also means bird / poultry." },
  { id: "basar", tr: "Basar", he: "בָּשָׂר", en: "Meat", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "dag", tr: "Dag", he: "דָּג", en: "Fish", pos: "noun", root: null, topic: "food", level: 1, tip: "Plural: dagim." },
  { id: "yerakot", tr: "Yerakot", he: "יְרָקוֹת", en: "Vegetables", pos: "noun", root: "yrk", topic: "food", level: 1, tip: "Same root as yarok, green." },
  { id: "peirot", tr: "Peirot", he: "פֵּרוֹת", en: "Fruit", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "uga", tr: "Uga", he: "עוּגָה", en: "Cake", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "te", tr: "Te", he: "תֵּה", en: "Tea", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "mits", tr: "Mits", he: "מִיץ", en: "Juice", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "yayin", tr: "Yayin", he: "יַיִן", en: "Wine", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "tsame", tr: "Ani tsame / tsme'a", he: "אֲנִי צָמֵא / צְמֵאָה", en: "I'm thirsty", pos: "phrase", root: null, topic: "food", level: 1, tip: "Tsame for a man, tsme'a for a woman." },
  { id: "shulchan", tr: "Shulchan", he: "שֻׁלְחָן", en: "Table", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "kise", tr: "Kise", he: "כִּסֵּא", en: "Chair", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "mitbach", tr: "Mitbach", he: "מִטְבָּח", en: "Kitchen", pos: "noun", root: "tbch", topic: "food", level: 1, tip: "" },
  { id: "cheder", tr: "Cheder", he: "חֶדֶר", en: "Room", pos: "noun", root: null, topic: "food", level: 1, tip: "Chadar ochel = dining room." },
  { id: "mita", tr: "Mita", he: "מִטָּה", en: "Bed", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "delet", tr: "Delet", he: "דֶּלֶת", en: "Door", pos: "noun", root: null, topic: "food", level: 1, tip: "" },
  { id: "chalon", tr: "Chalon", he: "חַלּוֹן", en: "Window", pos: "noun", root: null, topic: "food", level: 1, tip: "" },

  // ---- Days & time ----
  { id: "yom", tr: "Yom", he: "יוֹם", en: "Day", pos: "noun", root: null, topic: "time", level: 1, tip: "Plural: yamim." },
  { id: "laila", tr: "Laila", he: "לַיְלָה", en: "Night", pos: "noun", root: null, topic: "time", level: 1, tip: "" },
  { id: "boker", tr: "Boker", he: "בֹּקֶר", en: "Morning", pos: "noun", root: "bkr", topic: "time", level: 1, tip: "" },
  { id: "erev", tr: "Erev", he: "עֶרֶב", en: "Evening", pos: "noun", root: null, topic: "time", level: 1, tip: "Also the day before a holiday: erev Shabbat." },
  { id: "hayom", tr: "Hayom", he: "הַיּוֹם", en: "Today", pos: "word", root: null, topic: "time", level: 1, tip: "Literally “the day”." },
  { id: "machar", tr: "Machar", he: "מָחָר", en: "Tomorrow", pos: "word", root: null, topic: "time", level: 1, tip: "" },
  { id: "etmol", tr: "Etmol", he: "אֶתְמוֹל", en: "Yesterday", pos: "word", root: null, topic: "time", level: 1, tip: "" },
  { id: "achshav", tr: "Achshav", he: "עַכְשָׁו", en: "Now", pos: "word", root: null, topic: "time", level: 1, tip: "" },
  { id: "shavua", tr: "Shavua", he: "שָׁבוּעַ", en: "Week", pos: "noun", root: "shba", topic: "time", level: 1, tip: "Same root as sheva, seven: a week has seven days." },
  { id: "chodesh", tr: "Chodesh", he: "חֹדֶשׁ", en: "Month", pos: "noun", root: "chdsh", topic: "time", level: 1, tip: "Same root as chadash, new: each month starts with a new moon." },
  { id: "shana", tr: "Shana", he: "שָׁנָה", en: "Year", pos: "noun", root: "shnh", topic: "time", level: 1, tip: "Shana tova = happy new year." },
  { id: "shaa", tr: "Sha'a", he: "שָׁעָה", en: "Hour", pos: "noun", root: null, topic: "time", level: 1, tip: "" },
  { id: "daka", tr: "Daka", he: "דַּקָּה", en: "Minute", pos: "noun", root: null, topic: "time", level: 1, tip: "" },
  { id: "ma-hashaa", tr: "Ma ha-sha'a?", he: "מָה הַשָּׁעָה?", en: "What time is it?", pos: "phrase", root: null, topic: "time", level: 1, tip: "" },
  { id: "yom-rishon", tr: "Yom rishon", he: "יוֹם רִאשׁוֹן", en: "Sunday", pos: "noun", root: null, topic: "time", level: 1, tip: "“First day”. Israel's week starts on Sunday." },
  { id: "yom-sheni", tr: "Yom sheni", he: "יוֹם שֵׁנִי", en: "Monday", pos: "noun", root: "shnh", topic: "time", level: 1, tip: "“Second day”." },
  { id: "yom-shlishi", tr: "Yom shlishi", he: "יוֹם שְׁלִישִׁי", en: "Tuesday", pos: "noun", root: "shlsh", topic: "time", level: 1, tip: "“Third day”, from shalosh." },
  { id: "yom-revii", tr: "Yom revi'i", he: "יוֹם רְבִיעִי", en: "Wednesday", pos: "noun", root: "rba", topic: "time", level: 1, tip: "“Fourth day”, from arba." },
  { id: "yom-chamishi", tr: "Yom chamishi", he: "יוֹם חֲמִישִׁי", en: "Thursday", pos: "noun", root: "chmsh", topic: "time", level: 1, tip: "“Fifth day”, from chamesh." },
  { id: "yom-shishi", tr: "Yom shishi", he: "יוֹם שִׁשִּׁי", en: "Friday", pos: "noun", root: "shsh", topic: "time", level: 1, tip: "“Sixth day”, from shesh." },
  { id: "shabbat", tr: "Shabbat", he: "שַׁבָּת", en: "Saturday / Sabbath", pos: "noun", root: null, topic: "time", level: 1, tip: "The only day with its own name." },

  // ---- Colours & clothes ----
  { id: "adom", tr: "Adom", he: "אָדֹם", en: "Red", pos: "adjective", root: "adm", topic: "colours", level: 1, tip: "Same root as adam (person) and adama (earth)." },
  { id: "kachol", tr: "Kachol", he: "כָּחֹל", en: "Blue", pos: "adjective", root: null, topic: "colours", level: 1, tip: "" },
  { id: "yarok", tr: "Yarok", he: "יָרֹק", en: "Green", pos: "adjective", root: "yrk", topic: "colours", level: 1, tip: "" },
  { id: "tsahov", tr: "Tsahov", he: "צָהֹב", en: "Yellow", pos: "adjective", root: null, topic: "colours", level: 1, tip: "" },
  { id: "lavan", tr: "Lavan", he: "לָבָן", en: "White", pos: "adjective", root: "lvn", topic: "colours", level: 1, tip: "Same root as levana, the moon." },
  { id: "shachor", tr: "Shachor", he: "שָׁחֹר", en: "Black", pos: "adjective", root: null, topic: "colours", level: 1, tip: "" },
  { id: "varod", tr: "Varod", he: "וָרֹד", en: "Pink", pos: "adjective", root: null, topic: "colours", level: 1, tip: "" },
  { id: "chum", tr: "Chum", he: "חוּם", en: "Brown", pos: "adjective", root: null, topic: "colours", level: 1, tip: "" },
  { id: "afor", tr: "Afor", he: "אָפֹר", en: "Grey", pos: "adjective", root: null, topic: "colours", level: 1, tip: "" },
  { id: "beged", tr: "Beged", he: "בֶּגֶד", en: "Piece of clothing", pos: "noun", root: null, topic: "colours", level: 1, tip: "Plural: bgadim (clothes)." },
  { id: "chultsa", tr: "Chultsa", he: "חֻלְצָה", en: "Shirt", pos: "noun", root: null, topic: "colours", level: 1, tip: "" },
  { id: "michnasayim", tr: "Michnasayim", he: "מִכְנָסַיִם", en: "Pants", pos: "noun", root: null, topic: "colours", level: 1, tip: "The -ayim ending means a pair." },
  { id: "simla", tr: "Simla", he: "שִׂמְלָה", en: "Dress", pos: "noun", root: null, topic: "colours", level: 1, tip: "" },
  { id: "naalayim", tr: "Na'alayim", he: "נַעֲלַיִם", en: "Shoes", pos: "noun", root: null, topic: "colours", level: 1, tip: "A pair again: -ayim." },
  { id: "kova", tr: "Kova", he: "כּוֹבַע", en: "Hat", pos: "noun", root: null, topic: "colours", level: 1, tip: "" },
  { id: "meil", tr: "Me'il", he: "מְעִיל", en: "Coat", pos: "noun", root: null, topic: "colours", level: 1, tip: "" },

  // ---- School & books ----
  { id: "talmid", tr: "Talmid / Talmida", he: "תַּלְמִיד / תַּלְמִידָה", en: "Student (m / f)", pos: "noun", root: "lmd", topic: "school", level: 1, tip: "Same root as lilmod, to learn." },
  { id: "more-mora", tr: "More / Mora", he: "מוֹרֶה / מוֹרָה", en: "Teacher (m / f)", pos: "noun", root: "yrh", topic: "school", level: 1, tip: "Same root as Torah, teaching." },
  { id: "sefer", tr: "Sefer", he: "סֵפֶר", en: "Book", pos: "noun", root: "spr", topic: "school", level: 1, tip: "Plural: sfarim." },
  { id: "sifriya", tr: "Sifriya", he: "סִפְרִיָּה", en: "Library", pos: "noun", root: "spr", topic: "school", level: 1, tip: "The place of books." },
  { id: "beit-sefer", tr: "Beit sefer", he: "בֵּית סֵפֶר", en: "School", pos: "noun", root: "spr", topic: "school", level: 1, tip: "Literally “house of book”." },
  { id: "michtav", tr: "Michtav", he: "מִכְתָּב", en: "Letter (mail)", pos: "noun", root: "ktv", topic: "school", level: 1, tip: "Same root as lichtov, to write." },
  { id: "kita", tr: "Kita", he: "כִּתָּה", en: "Class / classroom", pos: "noun", root: null, topic: "school", level: 1, tip: "" },

  // ---- Everyday verbs (the “to …” form) ----
  { id: "lalechet", tr: "Lalechet", he: "לָלֶכֶת", en: "To go / to walk", pos: "verb", root: "hlch", topic: "verbs", level: 1, tip: "Ani holech / holechet = I'm going." },
  { id: "lavo", tr: "Lavo", he: "לָבוֹא", en: "To come", pos: "verb", root: "bwa", topic: "verbs", level: 1, tip: "Bo! / Bo'i! = Come! (to a man / woman)" },
  { id: "leechol", tr: "Le'echol", he: "לֶאֱכֹל", en: "To eat", pos: "verb", root: "akl", topic: "verbs", level: 1, tip: "Same root as ochel, food." },
  { id: "lishtot", tr: "Lishtot", he: "לִשְׁתּוֹת", en: "To drink", pos: "verb", root: "shth", topic: "verbs", level: 1, tip: "" },
  { id: "lishon", tr: "Lishon", he: "לִישׁוֹן", en: "To sleep", pos: "verb", root: "yshn", topic: "verbs", level: 1, tip: "" },
  { id: "lilmod", tr: "Lilmod", he: "לִלְמֹד", en: "To learn / to study", pos: "verb", root: "lmd", topic: "verbs", level: 1, tip: "" },
  { id: "ledaber", tr: "Ledaber", he: "לְדַבֵּר", en: "To speak", pos: "verb", root: "dbr", topic: "verbs", level: 1, tip: "Ata medaber ivrit? = Do you speak Hebrew?" },
  { id: "lirot", tr: "Lir'ot", he: "לִרְאוֹת", en: "To see", pos: "verb", root: "rah", topic: "verbs", level: 1, tip: "Same root as lehitra'ot, see you later." },
  { id: "lishmoa", tr: "Lishmo'a", he: "לִשְׁמֹעַ", en: "To hear", pos: "verb", root: "shma", topic: "verbs", level: 1, tip: "Same root as the Shema prayer." },
  { id: "laavod", tr: "La'avod", he: "לַעֲבֹד", en: "To work", pos: "verb", root: "avd", topic: "verbs", level: 1, tip: "Avoda = work, a job." },
  { id: "likro", tr: "Likro", he: "לִקְרֹא", en: "To read / to call", pos: "verb", root: "kra", topic: "verbs", level: 1, tip: "" },
  { id: "lichtov", tr: "Lichtov", he: "לִכְתֹּב", en: "To write", pos: "verb", root: "ktv", topic: "verbs", level: 1, tip: "" },
  { id: "lirtsot", tr: "Lirtsot", he: "לִרְצוֹת", en: "To want", pos: "verb", root: "rtsh", topic: "verbs", level: 1, tip: "Ani rotse / rotsa = I want." },
  { id: "laasot", tr: "La'asot", he: "לַעֲשׂוֹת", en: "To do / to make", pos: "verb", root: "ash", topic: "verbs", level: 1, tip: "" },
  { id: "ladaat", tr: "Lada'at", he: "לָדַעַת", en: "To know", pos: "verb", root: "yda", topic: "verbs", level: 1, tip: "Ani lo yode'a / yoda'at = I don't know." },
  { id: "leehov", tr: "Le'ehov", he: "לֶאֱהֹב", en: "To love / to like", pos: "verb", root: "ahv", topic: "verbs", level: 1, tip: "Ahava = love." },
  { id: "likno", tr: "Likno", he: "לִקְנוֹת", en: "To buy", pos: "verb", root: "knh", topic: "verbs", level: 1, tip: "" },
  { id: "lagur", tr: "Lagur", he: "לָגוּר", en: "To live (somewhere)", pos: "verb", root: "gwr", topic: "verbs", level: 1, tip: "Eifo ata gar? = Where do you live?" }
];

export const WORD_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));
