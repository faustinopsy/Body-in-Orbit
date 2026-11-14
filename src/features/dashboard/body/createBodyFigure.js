import { createSvgElement } from '../../../ui/createSvgElement.js';
import { AVATAR_VIEW_BOX, BODY_LAYERS } from './bodyLayers.js';
import { SILHOUETTE } from './silhouette.js';

const toElement = (shape) => createSvgElement(shape.tag, { ...shape.attrs, class: `avatar__${shape.kind}` });

function layerGroups(layerId, back) {
  return BODY_LAYERS[layerId].map((item) => {
    const shapes = item.shapes.filter((shape) => Boolean(shape.back) === back).map(toElement);
    if (shapes.length === 0) return null;
    const attributes = item.regionId ? { class: 'avatar__region', 'data-region': item.regionId } : { class: 'avatar__detail' };
    return createSvgElement('g', attributes, ...shapes);
  }).filter(Boolean);
}

const silhouette = (className) => createSvgElement(
  'g',
  { class: className, 'aria-hidden': 'true' },
  ...SILHOUETTE.map((shape) => createSvgElement(shape.tag, shape.attrs)),
);

export function createBodyFigure(layerId) {
  const element = createSvgElement(
    'svg',
    { viewBox: AVATAR_VIEW_BOX, class: 'avatar__svg body-figure', role: 'img' },
    ...layerGroups(layerId, true),
    silhouette('avatar__outline'),
    silhouette('avatar__body avatar__body--flat'),
    ...layerGroups(layerId, false),
  );
  const regions = [...element.querySelectorAll('[data-region]')];

  function update(status, label) {
    element.setAttribute('aria-label', label);
    regions.forEach((region) => region.setAttribute('class', `avatar__region status--${status}`));
  }

  return { element, update };
}