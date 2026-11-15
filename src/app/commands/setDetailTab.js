export const DETAIL_TABS = ['chart', 'table', 'actions'];

export const setDetailTab = (app) => (tab) => {
  if (DETAIL_TABS.includes(tab)) app.store.update({ detailTab: tab });
};