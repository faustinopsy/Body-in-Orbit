export function formatValue(value, locale) {
  if (!Number.isFinite(value)) return '-';
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
}