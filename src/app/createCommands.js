import { goTo } from './commands/goTo.js';
import { setLocale } from './commands/setLocale.js';
import { setTheme } from './commands/setTheme.js';
import { openSample } from './commands/openSample.js';
import { restoreSession } from './commands/restoreSession.js';
import { selectCrew } from './commands/selectCrew.js';
import { setDay } from './commands/setDay.js';
import { selectLayer } from './commands/selectLayer.js';
import { selectRegion } from './commands/selectRegion.js';
import { selectMetric } from './commands/selectMetric.js';
import { toggleFullscreen } from './commands/toggleFullscreen.js';
import { syncFullscreen } from './commands/syncFullscreen.js';
export function createCommands(app) {
  return {
    toggleFullscreen: toggleFullscreen(app),
    syncFullscreen: syncFullscreen(app),
    goTo: goTo(app),
    setLocale: setLocale(app),
    setTheme: setTheme(app),
    openSample: openSample(app),
    restoreSession: restoreSession(app),
    selectCrew: selectCrew(app),
    setDay: setDay(app),
    selectLayer: selectLayer(app),
    selectRegion: selectRegion(app),
    selectMetric: selectMetric(app),
  };
}