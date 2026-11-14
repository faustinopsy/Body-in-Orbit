import { createElement } from '../../ui/createElement.js';
import { createBodyFigure } from '../dashboard/body/createBodyFigure.js';
import { RISKS } from '../../domain/missions/riskRatings.js';
import { levelOf, riskWeight } from '../../domain/missions/riskWeights.js';
import { STATUS_OF_LEVEL } from '../missions/createRiskPreview.js';

function createCard(risk) {
  const figure = createBodyFigure(risk.layerId);
  const caption = createElement('figcaption', { class: 'risk-figure__caption' });
  const element = createElement('figure', { class: 'avatar risk-figure', 'data-risk': risk.id }, figure.element, caption);
  return { risk, figure, caption, element };
}

export function createRiskFigures(app) {
  const cards = RISKS.map(createCard);
  const element = createElement('div', { class: 'risk-figures' }, ...cards.map((card) => card.element));

  function update(state) {
    const typeId = state.helpMissionTypeId;
    cards.forEach((card) => {
      const weight = riskWeight(card.risk.id, typeId);
      const level = levelOf(weight);
      const text = `${app.t(`risk.${card.risk.id}`)}: ${app.t(`level.${level}`)} (${Math.round(weight * 100)}%)`;
      card.figure.update(STATUS_OF_LEVEL[level], text);
      card.caption.textContent = text;
      card.element.setAttribute('class', `avatar risk-figure status--${STATUS_OF_LEVEL[level]}`);
    });
  }

  return { element, update };
}