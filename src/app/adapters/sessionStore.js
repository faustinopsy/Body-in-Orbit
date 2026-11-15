const KEY = 'orbit-session';

export function createSessionStore(storage = window.sessionStorage) {
  return {
    load() {
      try {
        return JSON.parse(storage.getItem(KEY));
      } catch {
        return null;
      }
    },
    save(user) {
      try {
        storage.setItem(KEY, JSON.stringify(user));
      } catch {
        return;
      }
    },
    clear() {
      try {
        storage.removeItem(KEY);
      } catch {
        return;
      }
    },
  };
}