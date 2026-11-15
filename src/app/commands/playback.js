export const playbackStep = (missionDays) => Math.max(1, Math.round(missionDays / 150));

export const togglePlayback = (app) => () => {
  const { dataset, playing, day } = app.store.getState();
  if (!dataset) return;
  if (playing) return app.store.update({ playing: false });
  app.store.update({ playing: true, day: day >= dataset.missionDays ? 1 : day });
};

export const stepPlayback = (app) => () => {
  const { dataset, playing, day } = app.store.getState();
  if (!dataset || !playing) return;
  const next = Math.min(day + playbackStep(dataset.missionDays), dataset.missionDays);
  app.store.update({ day: next, playing: next < dataset.missionDays });
};