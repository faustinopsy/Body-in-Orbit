import { createStore } from './createStore.js';
import { createI18n } from './createI18n.js';
import { createCommands } from './createCommands.js';
import { createShell } from '../features/shell/createShell.js';
import { detectLocale } from './detectLocale.js';
import { syncDocument } from './syncDocument.js';
import { MESSAGES } from './messages.js';

const INITIAL_STATE = { theme: 'light', route: 'dashboard', dataset: null, busy: false, errorKey: null };

export async function createApp(root, services) {
  const locale = detectLocale(navigator.language);
  const i18n = createI18n({ messages: MESSAGES, locale });
  const store = createStore({ ...INITIAL_STATE, locale });
  const app = { store, i18n, services, t: i18n.t };
  app.commands = createCommands(app);

  const shell = createShell(app);
  root.replaceChildren(shell.element);
  store.subscribe((state) => {
    syncDocument(state);
    shell.update(state);
  });
  await app.commands.restoreSession();
  return app;
}