import { createSvgElement } from '../../ui/createSvgElement.js';
import { formatValue } from './formatValue.js';

const svgText = (attributes, text) => {
  const element = createSvgElement('text', attributes);
  element.textContent = text;
  return element;
};

const horizontal = (className, frame, y) => createSvgElement('line', { class: className, x1: frame.left, x2: frame.right, y1: y, y2: y });

function drawAxes(model, locale) {
  const { frame } = model;
  return [
    ...model.yTicks.flatMap(({ y, value }) => [horizontal('chart__grid', frame, y), svgText({ class: 'chart__axis', x: frame.left - 6, y: y + 4, 'text-anchor': 'end' }, formatValue(value, locale))]),
    ...model.xTicks.map(({ x, day }) => svgText({ class: 'chart__axis', x, y: frame.bottom + 18, 'text-anchor': 'middle' }, `d${day}`)),
  ];
}

function drawLimits(model, texts) {
  const { frame, limits } = model;
  const label = (kind, anchor) => svgText({ class: `chart__note chart__note--${kind}`, x: anchor === 'end' ? frame.right - 4 : frame.left + 6, y: limits[kind].y - 5, 'text-anchor': anchor }, texts[kind]);
  return [
    horizontal('chart__limit chart__limit--baseline', frame, limits.baseline.y), label('baseline', 'start'),
    horizontal('chart__limit chart__limit--warning', frame, limits.warning.y), label('warning', 'end'),
    horizontal('chart__limit chart__limit--critical', frame, limits.critical.y), label('critical', 'end'),
  ];
}

function drawProjection(model, texts) {
  if (!model.projectionArea) return [];
  const { frame, projectionArea } = model;
  return [
    createSvgElement('rect', { class: 'chart__future', x: projectionArea.x, y: frame.top, width: projectionArea.width, height: frame.bottom - frame.top }),
    svgText({ class: 'chart__note', x: frame.right - 4, y: frame.top + 12, 'text-anchor': 'end' }, texts.projection),
    createSvgElement('polyline', { class: 'chart__projected', points: model.projected, fill: 'none' }),
  ];
}

function drawToday(model, texts) {
  const { frame, today } = model;
  const nearStart = today.x - frame.left < 60;
  return [
    createSvgElement('line', { class: 'chart__today', x1: today.x, x2: today.x, y1: frame.top, y2: frame.bottom }),
    svgText({ class: 'chart__note chart__note--strong', x: nearStart ? today.x + 6 : today.x - 6, y: frame.top + 12, 'text-anchor': nearStart ? 'start' : 'end' }, texts.today),
  ];
}

function drawCursor(model, texts) {
  const { frame, cursor } = model;
  const onRight = cursor.x > frame.right - 150;
  return [
    createSvgElement('line', { class: 'chart__cursor', x1: cursor.x, x2: cursor.x, y1: frame.top, y2: frame.bottom }),
    createSvgElement('circle', { class: 'chart__marker', cx: cursor.x, cy: cursor.y, r: 5 }),
    svgText({ class: 'chart__note chart__note--strong', x: onRight ? cursor.x - 10 : cursor.x + 10, y: Math.max(cursor.y - 10, frame.top + 24), 'text-anchor': onRight ? 'end' : 'start' }, texts.cursor),
  ];
}

export function drawChart(model, texts, locale) {
  return [
    ...drawAxes(model, locale),
    ...drawProjection(model, texts),
    ...drawLimits(model, texts),
    createSvgElement('polyline', { class: 'chart__series', points: model.observed, fill: 'none' }),
    ...drawToday(model, texts),
    ...drawCursor(model, texts),
  ];
}