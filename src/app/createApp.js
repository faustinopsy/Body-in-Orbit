import { createStore } from './createStore.js';
import { createI18n } from './createI18n.js';
import { createCommands } from './createCommands.js';
import { createShell } from '../features/shell/createShell.js';
import { syncDocument } from './syncDocument.js';
import { MESSAGES } from './messages.js';

const DEFAULT_LOCALE = 'en';
const INITIAL_STATE = {
  theme: 'light',
  route: 'dashboard',
  dataset: null,
  busy: false,
  errorKey: null,
  crewId: null,
  day: 1,
  layerId: 'skeleton',
  regionId: null,
  metricId: null,
};

export async function createApp(root, services) {
  const i18n = createI18n({ messages: MESSAGES, locale: DEFAULT_LOCALE });
  const store = createStore({ ...INITIAL_STATE, locale: DEFAULT_LOCALE });
  const app = { store, i18n, services, t: i18n.t };
  app.commands = createCommands(app);
  app.services.fullscreen?.onChange(app.commands.syncFullscreen);
  const shell = createShell(app);
  root.replaceChildren(shell.element);
  store.subscribe((state) => {
    syncDocument(state);
    shell.update(state);
  });
  await app.commands.restoreSession();
  return app;
}