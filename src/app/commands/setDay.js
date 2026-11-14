export const setDay = (app) => (day) => {
  const { dataset } = app.store.getState();
  if (!dataset || !Number.isFinite(Number(day))) return;
  const clamped = Math.min(Math.max(Math.round(Number(day)), 1), dataset.missionDays);
  app.store.update({ day: clamped });
};