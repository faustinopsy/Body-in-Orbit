import { createElement } from '../../ui/createElement.js';
import '../../ui/chip.css';

function createTab(app, id) {
  const shape = createElement('span', { class: 'shape', 'aria-hidden': 'true' });
  const status = createElement('span', { class: 'sr-only' });
  const button = createElement('button', { type: 'button', class: 'crew__tab', 'data-crew': id }, createElement('span', { class: 'crew__id' }, id), shape, status);
  button.addEventListener('click', () => app.commands.selectCrew(id));
  return { id, button, shape, status };
}

export function createCrewPicker(app) {
  const element = createElement('div', { class: 'crew', role: 'group' });
  let tabs = [];
  let builtFor = '';

  function build(crew) {
    builtFor = crew.map(({ id }) => id).join(',');
    tabs = crew.map(({ id }) => createTab(app, id));
    element.replaceChildren(...tabs.map((tab) => tab.button));
  }

  function update(state, view) {
    element.setAttribute('aria-label', app.t('crew.label'));
    if (state.dataset.crew.map(({ id }) => id).join(',') !== builtFor) build(state.dataset.crew);
    tabs.forEach((tab) => {
      const status = view.crewStatuses[tab.id] ?? 'none';
      tab.shape.dataset.status = status;
      tab.status.textContent = app.t(`status.${status}`);
      tab.button.title = `${tab.id} · ${tab.status.textContent}`;
      tab.button.setAttribute('aria-pressed', String(tab.id === state.crewId));
    });
  }

  return { element, update };
}