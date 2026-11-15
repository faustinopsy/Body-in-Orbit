import { createElement } from '../../ui/createElement.js';

const ITEMS = ['observed', 'projection', 'warning', 'critical'];

export function createChartLegend(app) {
  const texts = ITEMS.map((item) => ({ item, text: createElement('span', {}) }));
  const element = createElement(
    'p',
    { class: 'chart-legend' },
    ...texts.map(({ item, text }) => createElement('span', { class: 'chart-legend__item' }, createElement('i', { class: `chart-legend__swatch chart-legend__swatch--${item}`, 'aria-hidden': 'true' }), text)),
  );

  function update() {
    texts.forEach(({ item, text }) => {
      text.textContent = app.t(`chart.legend.${item}`);
    });
  }

  return { element, update };
}