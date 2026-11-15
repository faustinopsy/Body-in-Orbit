export function accessMode(state) {
  if (state.welcomeOpen || state.user) return null;
  if (state.dataset?.demo) return 'demo';
  return state.hasAdmin ? 'signIn' : 'create';
}