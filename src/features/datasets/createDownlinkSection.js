import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';

export function createDownlinkSection(app) {
  const title = createElement('h3', { class: 'data-section__title' });
  const text = createElement('p', { class: 'data-section__text' });
  const label = createElement('span', {});
  const send = createElement('button', { type: 'button', class: 'button button--primary data-downlink' }, createIcon('satellite-dish', 16), label);
  const element = createElement('section', { class: 'data-section' }, title, text, createElement('div', { class: 'data-section__actions' }, send));
  send.addEventListener('click', () => app.commands.sendDownlink());

  function update(state) {
    title.textContent = app.t('data.downlink.title');
    text.textContent = app.t('data.downlink.text');
    label.textContent = state.dataset ? app.t('data.downlink.send', { day: state.day }) : app.t('data.downlink.none');
    send.disabled = !state.dataset;
  }

  return { element, update };
}