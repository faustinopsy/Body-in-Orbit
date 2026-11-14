import { goTo } from './commands/goTo.js';
import { setLocale } from './commands/setLocale.js';
import { setTheme } from './commands/setTheme.js';
import { openSample } from './commands/openSample.js';
import { restoreSession } from './commands/restoreSession.js';

export function createCommands(app) {
  return {
    goTo: goTo(app),
    setLocale: setLocale(app),
    setTheme: setTheme(app),
    openSample: openSample(app),
    restoreSession: restoreSession(app),
  };
}