import { createStore } from './createStore.js';
import { createI18n } from './createI18n.js';
import { createCommands } from './createCommands.js';
import { createShell } from '../features/shell/createShell.js';
import { createWelcomeDialog } from '../features/welcome/createWelcomeDialog.js';
import { createAccessDialog } from '../features/access/createAccessDialog.js';
import { syncDocument } from './syncDocument.js';
import { MESSAGES } from './messages.js';
import { createMissionDraft } from '../domain/missions/validateMission.js';

const DEFAULT_LOCALE = 'en';
const INITIAL_STATE = {
  theme: 'light',
  zoom: 1,
  route: 'dashboard',
  dataset: null,
  datasetId: null,
  checkInDraft: null,
  todayErrors: [],
  todayMessage: null,
  todayTab: 'checkIn',
  user: null,
  hasAdmin: false,
  crewAccounts: [],
  accessError: null,
  accessMessage: null,
  passwordMessage: null,
  capsule: [],
  capsuleReveal: null,
  capsuleErrors: [],
  capsuleMessage: null,
  aiSettings: { enabled: false, model: 'llama3.2' },
  aiTest: { status: 'idle', models: [] },
  aiRun: { status: 'idle' },
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
  settingsTab: 'mission',
  dataMessage: null,
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
  const access = createAccessDialog(app);
  root.replaceChildren(shell.element, welcome.element, access.element);
  store.subscribe((state) => {
    syncDocument(state);
    shell.update(state);
    welcome.update(state);
    access.update(state);
  });
  await app.commands.restoreSession();
  return app;
}