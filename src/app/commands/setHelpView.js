import { riskById } from '../../domain/missions/riskRatings.js';

export const HELP_TABS = ['risks', 'about', 'method', 'onboard'];

export const setHelpTab = (app) => (tab) => {
  if (HELP_TABS.includes(tab)) app.store.update({ helpTab: tab });
};

export const setHelpRisk = (app) => (riskId) => {
  if (riskById(riskId)) app.store.update({ helpTab: 'risks', helpRiskId: riskId });
};