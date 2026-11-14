import { createElement } from '../../ui/createElement.js';
import { RISKS } from '../../domain/missions/riskRatings.js';
import { levelOf, riskWeight } from '../../domain/missions/riskWeights.js';

export const STATUS_OF_LEVEL = { low: 'ok', moderate: 'warning', high: 'critical' };

function createRow(risk) {
  const name = createElement('span', { class: 'risk-row__name' });
  const fill = createElement('span', { class: 'risk-row__fill' });
  const level = createElement('span', { class: 'risk-row__level' });
  const element = createElement('li', { class: 'risk-row', 'data-risk': risk.id }, name, createElement('span', { class: 'risk-row__bar' }, fill), level);
  return { risk, element, name, fill, level };
}

export function createRiskPreview(app) {
  const title = createElement('h3', { class: 'risk-preview__title' });
  const rows = RISKS.map(createRow);
  const more = createElement('button', { type: 'button', class: 'button risk-preview__help' });
  const element = createElement('section', { class: 'risk-preview' }, title, createElement('ul', { class: 'risk-preview__list' }, ...rows.map((row) => row.element)), more);
  more.addEventListener('click', () => {
    app.commands.setHelpMission(app.store.getState().missionDraft.typeId);
    app.commands.goTo('help');
  });

  function update(state) {
    const typeId = state.missionDraft.typeId;
    title.textContent = app.t('mission.risks');
    more.textContent = app.t('mission.helpLink');
    rows.forEach((row) => {
      const weight = riskWeight(row.risk.id, typeId);
      const level = levelOf(weight);
      row.element.setAttribute('class', `risk-row status--${STATUS_OF_LEVEL[level]}`);
      row.name.textContent = app.t(`risk.${row.risk.id}`);
      row.fill.style.width = `${Math.round(weight * 100)}%`;
      row.level.textContent = `${app.t(`level.${level}`)} · ${Math.round(weight * 100)}%`;
    });
  }

  return { element, update };
}