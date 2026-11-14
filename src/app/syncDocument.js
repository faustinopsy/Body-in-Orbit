export function syncDocument(state) {
  document.documentElement.lang = state.locale;
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.style.setProperty('--zoom', String(state.zoom));
}