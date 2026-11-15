import {
  createElement as createLucideIcon,
  BicepsFlexed,
  Bone,
  CalendarDays,
  CircleHelp,
  Database,
  Download,
  ExternalLink,
  Eye,
  FlaskConical,
  Footprints,
  Globe,
  Heart,
  LayoutDashboard,
  Maximize,
  Minimize,
  Moon,
  MoonStar,
  Mountain,
  Navigation,
  Orbit,
  Pause,
  PersonStanding,
  Play,
  Radiation,
  Rocket,
  Satellite,
  SatelliteDish,
  Settings,
  Star,
  Sun,
  Upload,
  Wrench,
} from 'lucide';

const ICONS = {
  'biceps-flexed': BicepsFlexed,
  bone: Bone,
  'calendar-days': CalendarDays,
  'circle-help': CircleHelp,
  database: Database,
  download: Download,
  'external-link': ExternalLink,
  eye: Eye,
  'flask-conical': FlaskConical,
  footprints: Footprints,
  globe: Globe,
  heart: Heart,
  'layout-dashboard': LayoutDashboard,
  maximize: Maximize,
  minimize: Minimize,
  moon: Moon,
  'moon-star': MoonStar,
  mountain: Mountain,
  navigation: Navigation,
  orbit: Orbit,
  pause: Pause,
  'person-standing': PersonStanding,
  play: Play,
  radiation: Radiation,
  rocket: Rocket,
  satellite: Satellite,
  'satellite-dish': SatelliteDish,
  settings: Settings,
  star: Star,
  sun: Sun,
  upload: Upload,
  wrench: Wrench,
};

export function createIcon(name, size = 18) {
  const icon = createLucideIcon(ICONS[name], { class: 'icon', width: size, height: size, 'aria-hidden': 'true', focusable: 'false' });
  icon.dataset.icon = name;
  return icon;
}

export function swapIcon(current, name) {
  if (current.dataset.icon === name) return current;
  const next = createIcon(name, Number(current.getAttribute('width')) || 18);
  current.replaceWith(next);
  return next;
}