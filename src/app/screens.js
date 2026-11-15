import { createDashboardScreen } from '../features/dashboard/createDashboardScreen.js';
import { createTodayScreen } from '../features/today/createTodayScreen.js';
import { createHelpScreen } from '../features/help/createHelpScreen.js';
import { createSettingsScreen } from '../features/settings/createSettingsScreen.js';

export const SCREENS = [
  { id: 'dashboard', create: createDashboardScreen },
  { id: 'today', create: createTodayScreen },
  { id: 'help', create: createHelpScreen },
  { id: 'settings', create: createSettingsScreen },
];