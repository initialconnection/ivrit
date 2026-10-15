// Small shared helpers.

// Today's date as YYYY-MM-DD in the learner's own time zone.
export function todayKey(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Add whole days to a YYYY-MM-DD date.
export function addDays(key, n) {
  const [y, m, d] = key.split("-").map(Number);
  return todayKey(new Date(y, m - 1, d + n));
}

// Whole days from date a to date b (positive if b is later).
export function daysBetween(a, b) {
  const [y1, m1, d1] = a.split("-").map(Number), [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5);
}

export function formatDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Percent with sensible precision: small numbers get two decimals so progress is visible.
export function pct(n) {
  const v = Math.max(0, n);
  return (v < 10 ? v.toFixed(2) : v.toFixed(1)) + "%";
}
export function signedPct(n) {
  return (n >= 0 ? "+" : "−") + pct(Math.abs(n));
}

export function plural(n, word, many = word + "s") { return `${n} ${n === 1 ? word : many}`; }
