import { createDashboardScreen } from '../features/dashboard/createDashboardScreen.js';
import { createMissionScreen } from '../features/missions/createMissionScreen.js';
import { createTodayScreen } from '../features/today/createTodayScreen.js';
import { createDataScreen } from '../features/datasets/createDataScreen.js';
import { createHelpScreen } from '../features/help/createHelpScreen.js';

export const SCREENS = [
  { id: 'dashboard', create: createDashboardScreen },
  { id: 'mission', create: createMissionScreen },
  { id: 'today', create: createTodayScreen },
  { id: 'data', create: createDataScreen },
  { id: 'help', create: createHelpScreen },
];