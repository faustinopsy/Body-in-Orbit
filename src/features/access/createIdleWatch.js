import { IDLE_MINUTES } from '../../domain/access/accounts.js';

const ACTIVITY = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

export function createIdleWatch(app, delay = IDLE_MINUTES * 60 * 1000) {
  let timer = null;
  let active = false;

  function restart() {
    clearTimeout(timer);
    timer = active ? setTimeout(() => app.commands.signOut('idle'), delay) : null;
  }

  ACTIVITY.forEach((name) => document.addEventListener(name, restart, { passive: true }));

  function update(state) {
    const signedIn = Boolean(state.user);
    if (signedIn === active) return;
    active = signedIn;
    restart();
  }

  return { update };
}