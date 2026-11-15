const ROUTES_BY_ROLE = {
  admin: ['dashboard', 'today', 'help', 'settings'],
  crew: ['dashboard', 'today', 'help'],
};

export const routesFor = (user) => (user ? ROUTES_BY_ROLE[user.role] ?? [] : []);
export const canOpen = (user, route) => routesFor(user).includes(route);
export const isAdmin = (user) => user?.role === 'admin';
export const canSeeCrew = (user, crewId) => isAdmin(user) || user?.crewId === crewId;
export const visibleCrew = (user, crew) => crew.filter(({ id }) => canSeeCrew(user, id));
export const homeRoute = (user) => (user?.role === 'crew' ? 'today' : 'dashboard');

export function validUser(user, dataset) {
  if (!user) return null;
  if (user.demo && !dataset?.demo) return null;
  if (user.role === 'crew' && !dataset?.crew.some(({ id }) => id === user.crewId)) return null;
  return user;
}