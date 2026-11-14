import { createElement } from '../../ui/createElement.js';

export function createCrewPicker(app) {
  const element = createElement('div', { class: 'picker', role: 'group' });
  let buttons = [];

  function build(dataset) {
    buttons = dataset.crew.map(({ id }) => {
      const button = createElement('button', { type: 'button', class: 'picker__button', 'data-crew': id });
      button.addEventListener('click', () => app.commands.selectCrew(id));
      return button;
    });
    element.replaceChildren(...buttons);
  }

  function update(state, view) {
    element.setAttribute('aria-label', app.t('crew.label'));
    if (buttons.length !== state.dataset.crew.length) build(state.dataset);
    buttons.forEach((button) => {
      const id = button.dataset.crew;
      const status = view.crewStatuses[id];
      button.textContent = `${id} · ${app.t(`status.${status}`)}`;
      button.setAttribute('class', `picker__button status--${status}`);
      button.setAttribute('aria-pressed', String(id === state.crewId));
    });
  }

  return { element, update };
}