export const truncate = (str: string, n: number) => {
  return str.length > n ? str.substring(0, n) + "..." : str;
};

export const formatDate = (date: string) => {
  return new Date(date || "").toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
