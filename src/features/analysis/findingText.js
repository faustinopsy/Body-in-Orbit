import { metricById } from '../../domain/metrics.js';

const formatNumber = (app, value) => new Intl.NumberFormat(app.i18n.getLocale()).format(value);
const unitText = (unit) => (/^\d+-\d+$/.test(unit) ? '' : ` ${unit}`);

function paramsOf(app, finding) {
  const metric = metricById(finding.metricId);
  const params = { ...finding.params };
  if (metric) params.metric = app.t(`metric.${metric.id}`);
  if (metric) params.unit = unitText(metric.unit);
  ['value', 'limit', 'average'].filter((key) => key in params).forEach((key) => (params[key] = formatNumber(app, params[key])));
  if (finding.params.items) params.items = finding.params.items.map((item) => app.t(`today.o.disturbances.${item}`).toLowerCase()).join(', ');
  return params;
}

export const findingText = (app, finding) => app.t(`analysis.f.${finding.kind}`, paramsOf(app, finding));

export function helpText(app, finding) {
  const metric = metricById(finding.metricId);
  if (metric) return app.t(`actions.${metric.layerId}.1`);
  return finding.kind === 'disturbed' ? app.t('analysis.help.disturbed') : '';
}