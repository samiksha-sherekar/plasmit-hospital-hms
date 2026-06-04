export function includesReportText(value: string, search: string) {
  return value.toLowerCase().includes(search.trim().toLowerCase());
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value);
}
