import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';
import { SOURCES } from '../help/content/sources.js';
import { LAYER_SOURCES } from './layerSources.js';

export function createNasaLine(app) {
  const hazard = createElement('span', {});
  const riskLabel = createElement('span', {});
  const name = createElement('span', {});
  const link = createElement('a', { class: 'nasa-line__link', target: '_blank', rel: 'noopener noreferrer' }, name, createIcon('external-link', 13));
  const element = createElement('p', { class: 'nasa-line' }, createElement('strong', {}, 'NASA'), hazard, riskLabel, link);

  function update(state) {
    const source = LAYER_SOURCES[state.layerId];
    hazard.textContent = ` · ${app.t('nasa.hazard')}: ${app.t(`nasaHazard.${source.hazard}`)} · `;
    riskLabel.textContent = `${app.t('nasa.risk')}: `;
    name.textContent = app.t(`nasaRisk.${source.risk}`);
    link.href = SOURCES[source.risk];
    link.title = app.t('nasa.opens');
  }

  return { element, update };
}