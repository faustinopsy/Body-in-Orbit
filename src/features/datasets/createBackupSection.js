import { createElement } from '../../ui/createElement.js';
import { createIcon } from '../../ui/icons.js';

export function createBackupSection(app) {
  const title = createElement('h3', { class: 'data-section__title' });
  const text = createElement('p', { class: 'data-section__text' });
  const saveLabel = createElement('span', {});
  const save = createElement('button', { type: 'button', class: 'button data-backup__save' }, createIcon('download', 16), saveLabel);
  const restoreLabel = createElement('span', {});
  const file = createElement('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only data-backup__file' });
  const restore = createElement('label', { class: 'button data-backup__restore' }, createIcon('upload', 16), restoreLabel, file);
  const element = createElement('section', { class: 'data-section' }, title, text, createElement('div', { class: 'data-section__actions' }, save, restore));
  save.addEventListener('click', () => app.commands.saveBackup());
  file.addEventListener('change', async () => {
    const [chosen] = file.files;
    if (chosen) await app.commands.restoreBackup(await chosen.text());
    file.value = '';
  });

  function update() {
    title.textContent = app.t('data.backup.title');
    text.textContent = app.t('data.backup.text');
    saveLabel.textContent = app.t('data.backup.save');
    restoreLabel.textContent = app.t('data.backup.restore');
  }

  return { element, update };
}