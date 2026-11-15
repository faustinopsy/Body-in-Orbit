import { createElement } from '../../ui/createElement.js';
import { metricById } from '../../domain/metrics.js';
import { todayOf } from '../../domain/missionDay.js';
import { formatValue } from './formatValue.js';
import { formatDelta } from './formatDelta.js';
import { tableRows, tableStep } from './tableRows.js';
import '../../ui/chip.css';

const COLUMNS = ['day', 'value', 'change', 'status', 'phase'];

function createRow(app, row, metric, locale) {
  const status = row.status ?? 'none';
  const cells = [
    `d${row.day}`,
    `${formatValue(row.value, locale)} ${metric.unit}`,
    formatDelta(row.value, metric, locale),
  ].map((text) => createElement('td', {}, text));
  const statusCell = createElement('td', {}, createElement('span', { class: 'shape', 'data-status': status, 'aria-hidden': 'true' }), ` ${app.t(`status.${status}`)}`);
  const phaseCell = createElement('td', {}, app.t(`timeline.phase.${row.phase}`));
  return createElement('tr', { 'data-day': row.day }, ...cells, statusCell, phaseCell);
}

export function createMetricTable(app) {
  const caption = createElement('caption', { class: 'sr-only' });
  const head = createElement('thead', {}, createElement('tr', {}, ...COLUMNS.map(() => createElement('th', { scope: 'col' }))));
  const body = createElement('tbody', {});
  const element = createElement('div', { class: 'metric-table' }, createElement('table', {}, caption, head, body));
  let builtFor = '';

  function build(state, metric) {
    const today = todayOf(state.dataset);
    const rows = tableRows({ series: state.dataset.series[state.crewId][metric.id], metric, missionDays: state.dataset.missionDays, today });
    body.replaceChildren(...rows.map((row) => createRow(app, row, metric, state.locale)));
    [...head.querySelectorAll('th')].forEach((cell, index) => {
      cell.textContent = app.t(`table.${COLUMNS[index]}`);
    });
    caption.textContent = app.t('table.caption', { metric: app.t(`metric.${metric.id}`), crew: state.crewId, step: tableStep(state.dataset.missionDays) });
  }

  function markCurrent(day) {
    const rows = [...body.children];
    const current = rows.filter((row) => Number(row.dataset.day) <= day).at(-1);
    rows.forEach((row) => row.toggleAttribute('aria-current', row === current));
  }

  function update(state) {
    const metric = metricById(state.metricId);
    const key = `${state.dataset.name}|${state.crewId}|${metric.id}|${state.locale}`;
    if (key !== builtFor) {
      builtFor = key;
      build(state, metric);
    }
    markCurrent(state.day);
  }

  return { element, update };
}