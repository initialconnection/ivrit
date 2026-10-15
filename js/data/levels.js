// The learning path: five ulpan levels, each made of topics (units).
// `words` is the planned vocabulary size by the end of that level (from the plan).
// Topics list which word topic ids belong to them; topics with no words yet show as "coming soon".

export const LEVELS = [
  { n: 1, code: "Aleph", cefr: "A1", name: "Beginner", words: 500,
    canDo: "Greet, introduce yourself, count, order food",
    topics: [
      { id: "basics", name: "Everyday basics" },
      { id: "people", name: "People & family" },
      { id: "food", name: "Food & home" },
      { id: "numbers", name: "Numbers 1–10" },
      { id: "time", name: "Days & time" },
      { id: "colours", name: "Colours & clothes" },
      { id: "school", name: "School & books" },
      { id: "verbs", name: "Everyday verbs" }
    ] },
  { n: 2, code: "Bet", cefr: "A2", name: "Elementary", words: 1200,
    canDo: "Talk about your day, past events, family, shopping",
    topics: [
      { id: "shopping", name: "Shopping & money" },
      { id: "travel", name: "Getting around" },
      { id: "body", name: "Body & health" },
      { id: "weather", name: "Weather & seasons" }
    ] },
  { n: 3, code: "Gimel", cefr: "B1", name: "Intermediate", words: 2500,
    canDo: "Make plans, give opinions, follow simple conversations",
    topics: [
      { id: "work", name: "Work & study" },
      { id: "feelings", name: "Feelings & opinions" },
      { id: "holidays", name: "Holidays & Jewish life" }
    ] },
  { n: 4, code: "Dalet", cefr: "B2", name: "Upper-intermediate", words: 4000,
    canDo: "Read news-style texts, discuss topics, use all verb patterns",
    topics: [
      { id: "news", name: "News & society" },
      { id: "culture", name: "Culture & history" }
    ] },
  { n: 5, code: "Hey", cefr: "C1", name: "Advanced", words: 6000,
    canDo: "Read literature and formal writing, use idioms",
    topics: [
      { id: "literature", name: "Literature & idioms" },
      { id: "formal", name: "Formal Hebrew" }
    ] }
];

// Total size of the full program, used by the fluency score.
export const PROGRAM = {
  words: 6000,
  letters: 27,     // 22 letters + 5 final forms
  vowels: 13,
  roots: 300,
  grammar: 60,
  texts: 100
};
