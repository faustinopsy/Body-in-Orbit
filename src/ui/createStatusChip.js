import { createElement } from './createElement.js';
import './chip.css';

export function createStatusChip() {
  return createElement('span', { class: 'chip', 'data-status': 'none' });
}

export function setStatusChip(chip, app, status) {
  const known = status ?? 'none';
  chip.dataset.status = known;
  chip.textContent = app.t(`status.${known}`);
}