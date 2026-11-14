export const STATUS_ORDER = ['ok', 'warning', 'critical'];

function crossed(metric, value, limit) {
  return metric.worse === 'down' ? value <= limit : value >= limit;
}

export function statusOf(metric, value) {
  if (!Number.isFinite(value)) return null;
  if (crossed(metric, value, metric.critical)) return 'critical';
  if (crossed(metric, value, metric.warning)) return 'warning';
  return 'ok';
}

export function worstStatus(statuses) {
  const known = statuses.filter((status) => STATUS_ORDER.includes(status));
  if (known.length === 0) return null;
  return known.reduce((worst, status) =>
    STATUS_ORDER.indexOf(status) > STATUS_ORDER.indexOf(worst) ? status : worst);
}