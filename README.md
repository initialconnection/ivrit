# Ivrit

A Hebrew learning system for English speakers, starting in English letters (transliteration) and building up to reading Hebrew script. See [PLAN.md](PLAN.md) for the full plan and roadmap.

Live site: https://initialconnection.github.io/ivrit

## What's in it now (Phase 1)
- Six tabs: Today, Lessons, Alef-Bet, Practice, Read, Progress
- Flashcards with spaced repetition: every word has its own review schedule
- Overall fluency score that rises with practice and slips when reviews are missed, with a comeback test
- Goal and timeline: pick a level and a deadline, get a daily plan and milestones
- Encouragement messages, daily goal, streaks, 14-day activity chart
- Letter chart for the alef-bet
- Backup and restore of progress (saved in the browser)

## Project layout
- `index.html` – page shell and tab bar
- `css/style.css` – colors, fonts and layout
- `js/app.js` – switches between tabs
- `js/data/` – content: `words.js`, `roots.js`, `sentences.js`, `letters.js`, `levels.js`
- `js/core/` – logic: progress storage, review schedule, fluency score, goals, messages
- `js/views/` – one file per screen

## Adding content
Add words to `js/data/words.js` (copy a line, give it a new unique `id`). Never change an existing `id`, because progress is saved against it.

## Running locally
The site uses JavaScript modules, so open it through a local web server rather than double-clicking the file, for example `python3 -m http.server` in this folder, then visit http://localhost:8000.
