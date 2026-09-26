export const truncate = (str: string, n: number) => {
  return str.length > n ? str.substring(0, n) + "..." : str;
};

// Dates are stored in UTC; formatting in UTC keeps server (Vercel = UTC) and
// local renders identical and avoids off-by-one days around midnight.
export const formatDate = (date: string | Date) => {
  return new Date(date || "").toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

// "Aug 2025"
export const formatMonthYear = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-us", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

// "Aug 2025 - Present" (null end = current role). Uses the same " - "
// separator the experience cards have always shown.
export const formatDateRange = (start: string | Date, end: string | Date | null) => {
  return `${formatMonthYear(start)} - ${end ? formatMonthYear(end) : "Present"}`;
};

// Whole years between `from` and now (e.g. for "2+ years experience").
export const yearsSince = (from: string | Date, now: Date = new Date()) => {
  const start = new Date(from);
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  const beforeAnniversary =
    now.getUTCMonth() < start.getUTCMonth() ||
    (now.getUTCMonth() === start.getUTCMonth() && now.getUTCDate() < start.getUTCDate());
  if (beforeAnniversary) years--;
  return Math.max(0, years);
};
