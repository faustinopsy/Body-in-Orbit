import { createElement } from '../../ui/createElement.js';
import { createDemoSection } from './createDemoSection.js';
import { createBackupSection } from './createBackupSection.js';
import { createDownlinkSection } from './createDownlinkSection.js';
import './datasets.css';

export function createDataPanel(app) {
  const sections = [createDemoSection(app), createBackupSection(app), createDownlinkSection(app)];
  const message = createElement('p', { class: 'data-message', role: 'status' });
  const error = createElement('p', { class: 'screen__error data-error', role: 'alert' });
  const element = createElement('div', { class: 'data-panel', role: 'tabpanel', 'data-panel': 'data' }, message, error, createElement('div', { class: 'data-grid' }, ...sections.map((section) => section.element)));

  function update(state) {
    message.textContent = state.dataMessage ? app.t(state.dataMessage.key, state.dataMessage.params) : '';
    message.hidden = !state.dataMessage;
    error.textContent = state.errorKey ? app.t(state.errorKey) : '';
    error.hidden = !state.errorKey;
    sections.forEach((section) => section.update(state));
  }

  return { element, update };
}