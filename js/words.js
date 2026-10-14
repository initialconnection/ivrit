// Word lists for Ivrit Word Game.
// To add words: copy a line and change it. Format: [Hebrew in English letters, meaning, optional tip]
// To add a topic: add a new entry to TOPICS with an id, a name and a words list.

const TOPICS = [
  {
    id: "basics",
    name: "Everyday basics",
    words: [
      ["Shalom", "Hello / goodbye", "Literally “peace”. Works for both coming and going."],
      ["Toda", "Thank you", "Toda raba = thank you very much."],
      ["Bevakasha", "Please / you're welcome", "One word, two jobs."],
      ["Ken", "Yes", ""],
      ["Lo", "No", "Also used for “not”: ani lo = I'm not."],
      ["Boker tov", "Good morning", "Reply: boker or (morning of light)."],
      ["Erev tov", "Good evening", ""],
      ["Laila tov", "Good night", ""],
      ["Slicha", "Excuse me / sorry", ""],
      ["Ma nishma?", "What's up? / How's it going?", "Casual. Answer: beseder."],
      ["Beseder", "Okay / fine", "Literally “in order”."],
      ["Lehitra'ot", "See you later", "The everyday goodbye."],
      ["Ani lo mevin / mevina", "I don't understand", "Mevin if you're a man, mevina if you're a woman."],
      ["Eifo?", "Where?", "Eifo ha-sherutim? = Where are the restrooms?"]
    ]
  },
  {
    id: "people",
    name: "People & family",
    words: [
      ["Ani", "I / me", ""],
      ["Ata / At", "You", "Ata to a man, at to a woman."],
      ["Hu / Hi", "He / She", ""],
      ["Ima", "Mom", ""],
      ["Aba", "Dad", ""],
      ["Ach / Achot", "Brother / Sister", ""],
      ["Saba / Savta", "Grandpa / Grandma", ""],
      ["Yeled / Yalda", "Boy / Girl", "Plural: yeladim (children)."],
      ["Chaver / Chavera", "Friend (m / f)", "Also means boyfriend / girlfriend."]
    ]
  },
  {
    id: "food",
    name: "Food & home",
    words: [
      ["Mayim", "Water", ""],
      ["Lechem", "Bread", "The ch sounds like the ch in Bach."],
      ["Ochel", "Food", ""],
      ["Kafe", "Coffee", ""],
      ["Chalav", "Milk", ""],
      ["Bayit", "House / home", "Ha-bayta = (going) home."],
      ["Ani ra'ev / re'eva", "I'm hungry", "Ra'ev for a man, re'eva for a woman."],
      ["Ta'im", "Tasty", "Ze ta'im! = It's tasty!"]
    ]
  },
  {
    id: "numbers",
    name: "Numbers 1–10",
    words: [
      ["Achat", "One (1)", "Echad is the masculine form."],
      ["Shtayim", "Two (2)", ""],
      ["Shalosh", "Three (3)", ""],
      ["Arba", "Four (4)", ""],
      ["Chamesh", "Five (5)", ""],
      ["Shesh", "Six (6)", ""],
      ["Sheva", "Seven (7)", ""],
      ["Shmone", "Eight (8)", ""],
      ["Tesha", "Nine (9)", ""],
      ["Eser", "Ten (10)", ""]
    ]
  }
];
