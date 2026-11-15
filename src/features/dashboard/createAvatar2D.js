import { createElement } from '../../ui/createElement.js';
import { createSvgElement } from '../../ui/createSvgElement.js';
import { AVATAR_VIEW_BOX, BODY_LAYERS } from './body/bodyLayers.js';
import { SILHOUETTE } from './body/silhouette.js';
import { createLayerGroups } from './body/createLayerGroups.js';
import { FULL_VIEW, focusViewBox, isZoomed } from './body/regionFocus.js';
import { createViewBoxAnimator } from './body/animateViewBox.js';
import './avatar.css';

const SHADE_ID = 'avatar-shade';

function createShade() {
  const stop = (offset, kind) => createSvgElement('stop', { offset, class: `avatar__stop-${kind}` });
  const gradient = createSvgElement('linearGradient', { id: SHADE_ID, x1: 0, x2: 1 }, stop(0, 'edge'), stop(0.5, 'middle'), stop(1, 'edge'));
  return createSvgElement('defs', {}, gradient);
}

const silhouette = (className, attributes = {}) => createSvgElement(
  'g',
  { class: className, 'aria-hidden': 'true', ...attributes },
  ...SILHOUETTE.map((shape) => createSvgElement(shape.tag, shape.attrs)),
);

export function createAvatar2D(app) {
  const back = createLayerGroups(app, BODY_LAYERS, true);
  const front = createLayerGroups(app, BODY_LAYERS, false);
  const svg = createSvgElement(
    'svg',
    { viewBox: AVATAR_VIEW_BOX, class: 'avatar__svg', role: 'group' },
    createShade(),
    ...back,
    silhouette('avatar__outline'),
    silhouette('avatar__body', { fill: `url(#${SHADE_ID})` }),
    ...front,
  );
  const caption = createElement('p', { class: 'avatar__caption', 'aria-live': 'polite' });
  const whole = createElement('button', { type: 'button', class: 'avatar__whole' });
  const element = createElement('figure', { class: 'avatar' }, svg, whole, caption);
  const regions = [...svg.querySelectorAll('[data-region]')];
  const layers = [...back, ...front];
    const animator = createViewBoxAnimator(svg, FULL_VIEW);
  let focused = null;
  whole.addEventListener('click', () => app.commands.selectLayer(app.store.getState().layerId));

  function focusOn(regionId) {
    const target = isZoomed(regionId) ? regionId : null;
    whole.hidden = target === null;
    if (target === focused) return;
    focused = target;
    svg.toggleAttribute('data-zoomed', target !== null);
    animator.animateTo(focusViewBox(target));
  }
  function update(state, view) {
    svg.setAttribute('aria-label', app.t('avatar.label'));
    whole.textContent = app.t('avatar.whole');
    focusOn(state.regionId);
    layers.forEach((layer) => layer.setAttribute('display', layer.dataset.layer === state.layerId ? 'inline' : 'none'));
    regions.forEach((region) => {
      const regionId = region.dataset.region;
      const status = view.snapshot.regions[regionId];
      const selected = regionId === state.regionId;
      region.setAttribute('class', `avatar__region status--${status}${selected ? ' is-selected' : ''}`);
      region.setAttribute('aria-label', `${app.t(`region.${regionId}`)}: ${app.t(`status.${status}`)}`);
      if (region.hasAttribute('tabindex')) region.setAttribute('aria-pressed', String(selected));
    });
    caption.textContent = state.regionId
      ? `${app.t(`region.${state.regionId}`)}: ${app.t(`status.${view.snapshot.regions[state.regionId]}`)}`
      : app.t('avatar.hint');
  }

  return { element, update };
}