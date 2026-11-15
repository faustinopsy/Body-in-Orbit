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
import { startDemo } from './commands/startDemo.js';
import { startCrewSetup } from './commands/startCrewSetup.js';
import { closeWelcome } from './commands/closeWelcome.js';
import { updateMissionDraft } from './commands/updateMissionDraft.js';
import { addCrewMember } from './commands/addCrewMember.js';
import { removeCrewMember } from './commands/removeCrewMember.js';
import { saveMission } from './commands/saveMission.js';
import { setHelpMission } from './commands/setHelpMission.js';
import { changeZoom } from './commands/changeZoom.js';
import { confirmMission } from './commands/confirmMission.js';
import { setSettingsTab } from './commands/setSettingsTab.js';
import { saveBackup, restoreBackup } from './commands/backup.js';
import { sendDownlink } from './commands/sendDownlink.js';
import { setHelpTab, setHelpRisk } from './commands/setHelpView.js';
import { togglePlayback, stepPlayback } from './commands/playback.js';
import { setDetailTab } from './commands/setDetailTab.js';

export function createCommands(app) {
  return {
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
    toggleFullscreen: toggleFullscreen(app),
    syncFullscreen: syncFullscreen(app),
    startDemo: startDemo(app),
    startCrewSetup: startCrewSetup(app),
    closeWelcome: closeWelcome(app),
    updateMissionDraft: updateMissionDraft(app),
    addCrewMember: addCrewMember(app),
    removeCrewMember: removeCrewMember(app),
    saveMission: saveMission(app),
    setHelpMission: setHelpMission(app),
    changeZoom: changeZoom(app),
    confirmMission: confirmMission(app),
    setSettingsTab: setSettingsTab(app),
    saveBackup: saveBackup(app),
    restoreBackup: restoreBackup(app),
    sendDownlink: sendDownlink(app),
    setHelpTab: setHelpTab(app),
    setHelpRisk: setHelpRisk(app),
    togglePlayback: togglePlayback(app),
    stepPlayback: stepPlayback(app),
    setDetailTab: setDetailTab(app),
  };
}