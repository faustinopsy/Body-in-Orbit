import { METRICS } from '../metrics.js';

const FORMAT = 'orbit-crew-health';
const SUPPORTED_VERSION = 1;

function checkHeader(data) {
  const errors = [];
  if (data.format !== FORMAT) errors.push({ code: 'format' });
  if (data.version !== SUPPORTED_VERSION) errors.push({ code: 'version' });
  if (!Number.isInteger(data.missionDays) || data.missionDays < 1) errors.push({ code: 'missionDays' });
  if (!Array.isArray(data.crew) || data.crew.length === 0) errors.push({ code: 'crew' });
  if (typeof data.series !== 'object' || data.series === null) errors.push({ code: 'series' });
  return errors;
}

function isValidSeries(values, days) {
  return Array.isArray(values) && values.length === days && values.every(Number.isFinite);
}

function checkSeries(data) {
  const errors = [];
  for (const { id: crewId } of data.crew) {
    for (const metric of METRICS) {
      const values = data.series[crewId]?.[metric.id];
      if (!isValidSeries(values, data.missionDays)) {
        errors.push({ code: 'metricSeries', crewId, metricId: metric.id });
      }
    }
  }
  return errors;
}

export function validateDataset(data) {
  if (typeof data !== 'object' || data === null) return [{ code: 'notObject' }];
  const headerErrors = checkHeader(data);
  return headerErrors.length > 0 ? headerErrors : checkSeries(data);
}