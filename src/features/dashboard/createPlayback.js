const TICK_MS = 60;

export function createPlayback(app) {
  let timer = null;

  function update(state) {
    if (state.playing && timer === null) timer = globalThis.setInterval(() => app.commands.stepPlayback(), TICK_MS);
    if (!state.playing && timer !== null) {
      globalThis.clearInterval(timer);
      timer = null;
    }
  }

  return { update };
}