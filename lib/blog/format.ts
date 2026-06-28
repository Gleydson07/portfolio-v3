const SHORT_MONTHS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
] as const;

export function formatPostDateShort(date: string) {
  const parsed = new Date(date);
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = SHORT_MONTHS[parsed.getMonth()];
  const year = parsed.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatPostDateLong(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(date));
}

export function getTitleInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
