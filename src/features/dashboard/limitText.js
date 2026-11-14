export function limitText(app, entry) {
  if (entry.status === 'critical') return app.t('card.limit.crossed');
  if (entry.crossingDay === null) return app.t('card.limit.stable');
  const key = entry.status === 'warning' ? 'card.limit.critical' : 'card.limit.warning';
  return app.t(key, { day: entry.crossingDay });
}