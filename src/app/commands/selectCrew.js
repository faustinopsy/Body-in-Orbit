export const selectCrew = (app) => (crewId) => {
  const { dataset } = app.store.getState();
  if (dataset?.crew.some((member) => member.id === crewId)) app.store.update({ crewId, todayErrors: [] });
};