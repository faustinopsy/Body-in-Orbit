import { createSvgElement } from '../../../ui/createSvgElement.js';

const toElement = (shape) => createSvgElement(shape.tag, { ...shape.attrs, class: `avatar__${shape.kind}` });

function createRegionGroup(app, regionId, shapes, focusable) {
  const group = createSvgElement('g', { class: 'avatar__region', 'data-region': regionId }, ...shapes.map(toElement));
  const choose = () => app.commands.selectRegion(regionId);
  group.addEventListener('click', choose);
  if (!focusable) return group;
  group.setAttribute('tabindex', '0');
  group.setAttribute('role', 'button');
  group.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    choose();
  });
  return group;
}

function createItem(app, item, back) {
  const shapes = item.shapes.filter((shape) => Boolean(shape.back) === back);
  if (shapes.length === 0) return null;
  if (!item.regionId) return createSvgElement('g', { class: 'avatar__detail' }, ...shapes.map(toElement));
  return createRegionGroup(app, item.regionId, shapes, !back);
}

export function createLayerGroups(app, layers, back) {
  return Object.entries(layers).map(([layerId, items]) => {
    const children = items.map((item) => createItem(app, item, back)).filter(Boolean);
    return createSvgElement('g', { class: 'avatar__layer', 'data-layer': layerId }, ...children);
  });
}