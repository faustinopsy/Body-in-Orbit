import { createElement } from '../../ui/createElement.js';
import { createSvgElement } from '../../ui/createSvgElement.js';
import { layerById } from '../../domain/layers.js';
import { AVATAR_VIEW_BOX, BODY_SHAPES, REGION_SHAPES } from './avatarShapes.js';
import './avatar.css';

function createRegion(app, shape) {
  const classes = ['avatar__region', shape.outline ? 'avatar__region--outline' : ''];
  const element = createSvgElement(shape.tag, {
    ...shape.attrs,
    class: classes.join(' ').trim(),
    'data-region': shape.regionId,
    role: 'button',
    tabindex: 0,
  });
  const choose = () => app.commands.selectRegion(shape.regionId);
  element.addEventListener('click', choose);
  element.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    choose();
  });
  return element;
}

function statusClass(status) {
  return status ? `status--${status}` : 'status--none';
}

export function createAvatar2D(app) {
  const body = BODY_SHAPES.map(({ tag, attrs }) => createSvgElement(tag, { ...attrs, class: 'avatar__body' }));
  const regions = REGION_SHAPES.map((shape) => createRegion(app, shape));
  const svg = createSvgElement(
    'svg',
    { viewBox: AVATAR_VIEW_BOX, class: 'avatar__svg', role: 'group' },
    createSvgElement('g', { 'aria-hidden': 'true' }, ...body),
    ...regions,
  );
  const caption = createElement('p', { class: 'avatar__caption', 'aria-live': 'polite' });
  const element = createElement('figure', { class: 'avatar' }, svg, caption);

  function updateRegion(region, state, view) {
    const regionId = region.dataset.region;
    const inLayer = layerById(state.layerId).regions.includes(regionId);
    const status = view.snapshot.regions[regionId];
    region.setAttribute('class', [
      'avatar__region',
      region.classList.contains('avatar__region--outline') ? 'avatar__region--outline' : '',
      inLayer ? statusClass(status) : 'avatar__region--dim',
      regionId === state.regionId ? 'is-selected' : '',
    ].join(' ').replace(/\s+/g, ' ').trim());
    region.setAttribute('aria-label', `${app.t(`region.${regionId}`)}: ${app.t(`status.${status}`)}`);
    region.setAttribute('aria-pressed', String(regionId === state.regionId));
  }

  function update(state, view) {
    svg.setAttribute('aria-label', app.t('avatar.label'));
    regions.forEach((region) => updateRegion(region, state, view));
    const regionId = state.regionId;
    caption.textContent = regionId
      ? `${app.t(`region.${regionId}`)}: ${app.t(`status.${view.snapshot.regions[regionId]}`)}`
      : app.t('avatar.hint');
  }

  return { element, update };
}