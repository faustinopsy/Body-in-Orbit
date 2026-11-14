import {
  createElement as createLucideIcon,
  CalendarDays,
  CircleHelp,
  Database,
  FlaskConical,
  Footprints,
  Globe,
  LayoutDashboard,
  Maximize,
  Minimize,
  Moon,
  MoonStar,
  Mountain,
  Navigation,
  Orbit,
  Rocket,
  Satellite,
  Star,
  Sun,
  Wrench,
} from 'lucide';

const ICONS = {
  'calendar-days': CalendarDays,
  'circle-help': CircleHelp,
  database: Database,
  'flask-conical': FlaskConical,
  footprints: Footprints,
  globe: Globe,
  'layout-dashboard': LayoutDashboard,
  maximize: Maximize,
  minimize: Minimize,
  moon: Moon,
  'moon-star': MoonStar,
  mountain: Mountain,
  navigation: Navigation,
  orbit: Orbit,
  rocket: Rocket,
  satellite: Satellite,
  star: Star,
  sun: Sun,
  wrench: Wrench,
};

export function createIcon(name, size = 18) {
  const icon = createLucideIcon(ICONS[name], { class: 'icon', width: size, height: size, 'aria-hidden': 'true', focusable: 'false' });
  icon.dataset.icon = name;
  return icon;
}

export function swapIcon(current, name) {
  if (current.dataset.icon === name) return current;
  const next = createIcon(name);
  current.replaceWith(next);
  return next;
}