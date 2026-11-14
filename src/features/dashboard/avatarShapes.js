export const AVATAR_VIEW_BOX = '0 0 200 390';

export const BODY_SHAPES = [
  { tag: 'ellipse', attrs: { cx: 100, cy: 38, rx: 28, ry: 32 } },
  { tag: 'rect', attrs: { x: 66, y: 72, width: 68, height: 140, rx: 22 } },
  { tag: 'rect', attrs: { x: 42, y: 80, width: 17, height: 130, rx: 8 } },
  { tag: 'rect', attrs: { x: 141, y: 80, width: 17, height: 130, rx: 8 } },
  { tag: 'rect', attrs: { x: 72, y: 212, width: 26, height: 165, rx: 11 } },
  { tag: 'rect', attrs: { x: 102, y: 212, width: 26, height: 165, rx: 11 } },
];

export const REGION_SHAPES = [
  { regionId: 'radiation-body', tag: 'rect', outline: true, attrs: { x: 34, y: 4, width: 132, height: 380, rx: 48 } },
  { regionId: 'muscle-core', tag: 'rect', attrs: { x: 74, y: 100, width: 52, height: 82, rx: 14 } },
  { regionId: 'muscle-thigh', tag: 'rect', attrs: { x: 74, y: 218, width: 22, height: 64, rx: 9 } },
  { regionId: 'muscle-thigh', tag: 'rect', attrs: { x: 104, y: 218, width: 22, height: 64, rx: 9 } },
  { regionId: 'muscle-calf', tag: 'rect', attrs: { x: 74, y: 290, width: 22, height: 78, rx: 9 } },
  { regionId: 'muscle-calf', tag: 'rect', attrs: { x: 104, y: 290, width: 22, height: 78, rx: 9 } },
  { regionId: 'bone-spine', tag: 'rect', attrs: { x: 96, y: 74, width: 8, height: 124, rx: 4 } },
  { regionId: 'bone-hip', tag: 'ellipse', attrs: { cx: 100, cy: 210, rx: 31, ry: 13 } },
  { regionId: 'bone-tibia', tag: 'rect', attrs: { x: 81, y: 296, width: 8, height: 70, rx: 4 } },
  { regionId: 'bone-tibia', tag: 'rect', attrs: { x: 111, y: 296, width: 8, height: 70, rx: 4 } },
  { regionId: 'cardio-vessels', tag: 'rect', attrs: { x: 78, y: 82, width: 6, height: 112, rx: 3 } },
  { regionId: 'cardio-vessels', tag: 'rect', attrs: { x: 116, y: 82, width: 6, height: 112, rx: 3 } },
  { regionId: 'cardio-heart', tag: 'ellipse', attrs: { cx: 108, cy: 112, rx: 12, ry: 14 } },
  { regionId: 'sleep-brain', tag: 'ellipse', attrs: { cx: 100, cy: 30, rx: 20, ry: 18 } },
];