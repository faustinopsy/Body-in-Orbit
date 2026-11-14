import { createElement } from '../../ui/createElement.js';
import { MISSION_TYPES } from '../../domain/missions/missionTypes.js';
import { RISKS } from '../../domain/missions/riskRatings.js';
import { levelOf, riskWeight } from '../../domain/missions/riskWeights.js';
import { STATUS_OF_LEVEL } from '../missions/createRiskPreview.js';

function cell(app, riskId, typeId) {
  const weight = riskWeight(riskId, typeId);
  const level = levelOf(weight);
  const element = createElement('td', { class: `weight-table__cell status--${STATUS_OF_LEVEL[level]}` });
  element.textContent = `${Math.round(weight * 100)}%`;
  element.title = app.t(`level.${level}`);
  return element;
}

export function createWeightTable(app) {
  const caption = createElement('caption');
  const element = createElement('table', { class: 'weight-table' });

  function update(state) {
    caption.textContent = app.t('help.tableCaption');
    const head = createElement('tr', {}, createElement('th', { scope: 'col' }));
    head.firstChild.textContent = app.t('help.missionColumn');
    RISKS.forEach((risk) => {
      const th = createElement('th', { scope: 'col' });
      th.textContent = app.t(`risk.${risk.id}`);
      head.append(th);
    });
    const rows = MISSION_TYPES.map((type) => {
      const th = createElement('th', { scope: 'row' });
      th.textContent = app.t(`missionType.${type.id}`);
      const row = createElement('tr', { 'aria-current': String(type.id === state.helpMissionTypeId) }, th);
      RISKS.forEach((risk) => row.append(cell(app, risk.id, type.id)));
      return row;
    });
    element.replaceChildren(caption, createElement('thead', {}, head), createElement('tbody', {}, ...rows));
  }

  return { element, update };
}