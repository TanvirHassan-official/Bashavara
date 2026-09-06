/**
 * Format a number as BDT currency.
 * @param {number} amount
 * @returns {string} e.g. "৳ 8,500"
 */
export function formatCurrency(amount) {
  return `৳ ${Number(amount).toLocaleString("en-BD")}`;
}

/**
 * Format an ISO date string to a human-readable form.
 * @param {string} iso
 * @returns {string} e.g. "4 Sep 2026"
 */
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Relative time label (e.g. "2 days ago").
 * @param {string} iso
 * @returns {string}
 */
export function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso)) / 1000);
  const intervals = [
    { label: "year", seconds: 31_536_000 },
    { label: "month", seconds: 2_592_000 },
    { label: "week", seconds: 604_800 },
    { label: "day", seconds: 86_400 },
    { label: "hour", seconds: 3_600 },
    { label: "minute", seconds: 60 },
  ];
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
