// Hebrew roots (shorashim). Words in words.js point here with their `root` field.
// Fields: id, tr (letters in English), he (Hebrew letters), meaning

export const ROOTS = [
  { id: "shlm", tr: "Sh-L-M", he: "ש-ל-ם", meaning: "whole, peace, complete" },
  { id: "ydh",  tr: "Y-D-H",  he: "י-ד-ה", meaning: "thanks, acknowledging" },
  { id: "bksh", tr: "B-K-Sh", he: "ב-ק-ש", meaning: "asking, requesting" },
  { id: "bkr",  tr: "B-K-R",  he: "ב-ק-ר", meaning: "morning; also visiting, checking" },
  { id: "slch", tr: "S-L-Ch", he: "ס-ל-ח", meaning: "forgiving, pardoning" },
  { id: "shma", tr: "Sh-M-'", he: "ש-מ-ע", meaning: "hearing, listening" },
  { id: "sdr",  tr: "S-D-R",  he: "ס-ד-ר", meaning: "order, arranging" },
  { id: "rah",  tr: "R-'-H",  he: "ר-א-ה", meaning: "seeing" },
  { id: "byn",  tr: "B-Y-N",  he: "ב-י-ן", meaning: "understanding, between" },
  { id: "yld",  tr: "Y-L-D",  he: "י-ל-ד", meaning: "birth, child" },
  { id: "chbr", tr: "Ch-B-R", he: "ח-ב-ר", meaning: "joining, connecting, friendship" },
  { id: "lchm", tr: "L-Ch-M", he: "ל-ח-ם", meaning: "bread; also fighting" },
  { id: "akl",  tr: "'-K-L",  he: "א-כ-ל", meaning: "eating" },
  { id: "chlv", tr: "Ch-L-V", he: "ח-ל-ב", meaning: "milk" },
  { id: "rav",  tr: "R-'-V",  he: "ר-ע-ב", meaning: "hunger" },
  { id: "tam",  tr: "T-'-M",  he: "ט-ע-ם", meaning: "taste, reason" }
];

export const ROOT_BY_ID = Object.fromEntries(ROOTS.map(r => [r.id, r]));
