import { createDashboardScreen } from '../features/dashboard/createDashboardScreen.js';
import { createTodayScreen } from '../features/today/createTodayScreen.js';
import { createDataScreen } from '../features/datasets/createDataScreen.js';

export const SCREENS = [
  { id: 'dashboard', create: createDashboardScreen },
  { id: 'today', create: createTodayScreen },
  { id: 'data', create: createDataScreen },
];