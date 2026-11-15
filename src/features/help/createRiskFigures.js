import { createElement } from '../../ui/createElement.js';
import { createBodyFigure } from '../dashboard/body/createBodyFigure.js';
import { RISKS } from '../../domain/missions/riskRatings.js';
import { levelOf, riskWeight } from '../../domain/missions/riskWeights.js';
import { STATUS_OF_LEVEL } from '../missions/createRiskPreview.js';

function createCard(app, risk) {
  const figure = createBodyFigure(risk.layerId);
  const caption = createElement('span', { class: 'risk-figure__caption' });
  const element = createElement('button', { type: 'button', class: 'avatar risk-figure', 'data-risk': risk.id }, figure.element, caption);
  element.addEventListener('click', () => app.commands.setHelpRisk(risk.id));
  return { risk, figure, caption, element };
}

export function createRiskFigures(app) {
  const cards = RISKS.map((risk) => createCard(app, risk));
  const element = createElement('div', { class: 'risk-figures', role: 'group' }, ...cards.map((card) => card.element));

  function update(state) {
    const typeId = state.helpMissionTypeId;
    element.setAttribute('aria-label', app.t('help.pickRisk'));
    cards.forEach((card) => {
      const weight = riskWeight(card.risk.id, typeId);
      const level = levelOf(weight);
      const text = `${app.t(`risk.${card.risk.id}`)}: ${app.t(`level.${level}`)} (${Math.round(weight * 100)}%)`;
      card.figure.update(STATUS_OF_LEVEL[level], text);
      card.caption.textContent = text;
      card.element.setAttribute('class', `avatar risk-figure status--${STATUS_OF_LEVEL[level]}`);
      card.element.setAttribute('aria-pressed', String(card.risk.id === state.helpRiskId));
    });
  }

  return { element, update };
}