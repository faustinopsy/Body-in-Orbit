const STEPS = ['mission', 'crew'];

export const setMissionStep = (app) => (step) => {
  const { missionConfirmed } = app.store.getState();
  if (!STEPS.includes(step) || (step === 'crew' && !missionConfirmed)) return;
  app.store.update({ missionStep: step, missionErrors: [] });
};