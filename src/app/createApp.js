import { createStore } from './createStore.js';
import { createI18n } from './createI18n.js';
import { createCommands } from './createCommands.js';
import { createShell } from '../features/shell/createShell.js';
import { createWelcomeDialog } from '../features/welcome/createWelcomeDialog.js';
import { syncDocument } from './syncDocument.js';
import { MESSAGES } from './messages.js';
import { createMissionDraft } from '../domain/missions/validateMission.js';

const DEFAULT_LOCALE = 'en';
const INITIAL_STATE = {
  theme: 'light',
  zoom: 1,
  route: 'dashboard',
  dataset: null,
  busy: false,
  errorKey: null,
  crewId: null,
  day: 1,
  layerId: 'skeleton',
  regionId: null,
  metricId: null,
  playing: false,
  detailTab: 'chart',
  fullscreen: false,
  welcomeOpen: false,
  missionDraft: createMissionDraft(),
  missionErrors: [],
  missionStep: 'mission',
  missionConfirmed: false,
  helpMissionTypeId: 'leo-long',
  helpTab: 'risks',
  helpRiskId: 'bone',
};

export async function createApp(root, services) {
  const i18n = createI18n({ messages: MESSAGES, locale: DEFAULT_LOCALE });
  const store = createStore({ ...INITIAL_STATE, locale: DEFAULT_LOCALE });
  const app = { store, i18n, services, t: i18n.t };
  app.commands = createCommands(app);
  app.services.fullscreen?.onChange(app.commands.syncFullscreen);

  const shell = createShell(app);
  const welcome = createWelcomeDialog(app);
  root.replaceChildren(shell.element, welcome.element);
  store.subscribe((state) => {
    syncDocument(state);
    shell.update(state);
    welcome.update(state);
  });
  await app.commands.restoreSession();
  return app;
}