import { createElement } from '../../ui/createElement.js';
import { OLLAMA_URL } from '../../app/adapters/ollamaClient.js';

function testText(app, test) {
  if (test.status === 'ok') return app.t('superAi.test.ok', { models: test.models.join(', ') || '—' });
  return app.t(`superAi.test.${test.status}`);
}

export function createOnboardSettings(app) {
  const text = createElement('p', { class: 'screen__text' });
  const enabled = createElement('input', { type: 'checkbox', name: 'aiEnabled' });
  const enabledText = createElement('span');
  const model = createElement('input', { type: 'text', name: 'aiModel', class: 'capsule-form__input onboard-settings__model' });
  const modelText = createElement('span', { class: 'capsule-form__label' });
  const save = createElement('button', { type: 'button', class: 'button onboard-settings__save' });
  const test = createElement('button', { type: 'button', class: 'button onboard-settings__test' });
  const result = createElement('p', { class: 'onboard-settings__result', role: 'status' });
  const demo = createElement('p', { class: 'screen__text screen__text--soft' });
  const form = createElement('div', { class: 'capsule-form onboard-settings' },
    createElement('label', { class: 'onboard-settings__toggle' }, enabled, enabledText),
    createElement('label', { class: 'capsule-form__field' }, modelText, model), save, test);
  const element = createElement('div', { class: 'capsule-settings' }, text, form, result, demo);
  enabled.addEventListener('change', () => app.commands.setAiSettings({ enabled: enabled.checked }));
  save.addEventListener('click', () => app.commands.setAiSettings({ model: model.value }));
  test.addEventListener('click', () => app.commands.testOnboardAi());

  function update(state) {
    const { aiSettings, aiTest } = state;
    text.textContent = app.t('superAi.settings.text', { url: OLLAMA_URL });
    enabledText.textContent = app.t('superAi.settings.enable');
    enabled.checked = aiSettings.enabled;
    modelText.textContent = app.t('superAi.settings.model');
    if (document.activeElement !== model) model.value = aiSettings.model;
    save.textContent = app.t('superAi.settings.save');
    test.textContent = app.t('superAi.settings.test');
    test.disabled = !aiSettings.enabled || aiTest.status === 'loading';
    result.hidden = aiTest.status === 'idle';
    result.dataset.status = aiTest.status;
    result.textContent = testText(app, aiTest);
    demo.textContent = app.t('superAi.settings.demo');
  }

  return { element, update };
}