export const DEFAULT_EVERY = 3;
export const ITEM_KINDS = ['image', 'message'];

export const unlockEvery = (dataset) => dataset?.capsuleEvery ?? DEFAULT_EVERY;
export const answeredDays = (dataset, crewId) => (dataset?.checkIns ?? []).filter((entry) => entry.crewId === crewId).length;
export const openedCount = (answered, every) => Math.floor(answered / every);
export const itemsOf = (items, crewId) => items.filter((item) => item.crewId === crewId).sort((a, b) => a.order - b.order);

export function streakOf(dataset, crewId, today) {
  const days = new Set((dataset?.checkIns ?? []).filter((entry) => entry.crewId === crewId).map((entry) => entry.day));
  let day = days.has(today) ? today : today - 1;
  let streak = 0;
  while (days.has(day)) {
    streak += 1;
    day -= 1;
  }
  return streak;
}

export function capsuleOf(items, dataset, crewId) {
  const every = unlockEvery(dataset);
  const answered = answeredDays(dataset, crewId);
  const own = itemsOf(items, crewId);
  const count = Math.min(openedCount(answered, every), own.length);
  const locked = own.slice(count).map((item, index) => ({ ...item, daysLeft: (count + index + 1) * every - answered }));
  return { every, answered, opened: own.slice(0, count), locked };
}

export function newlyOpened(items, before, after, crewId) {
  const opened = capsuleOf(items, after, crewId).opened;
  return opened.length > capsuleOf(items, before, crewId).opened.length ? opened.at(-1) : null;
}

export function itemErrors(item) {
  const errors = [];
  if (!ITEM_KINDS.includes(item.kind)) errors.push('kind');
  if (!item.title?.trim()) errors.push('title');
  if (!item.crewId) errors.push('crew');
  if (item.kind === 'image' && !item.image) errors.push('image');
  if (item.kind === 'message' && !item.text?.trim()) errors.push('text');
  return errors;
}

export const validEvery = (value) => Number.isInteger(value) && value >= 1 && value <= 30;