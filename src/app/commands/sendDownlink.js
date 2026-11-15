import { buildDownlink, downlinkFileName } from '../../domain/downlink/buildDownlink.js';

export const sendDownlink = (app) => () => {
  const { dataset, day } = app.store.getState();
  if (!dataset) return;
  const name = downlinkFileName(day);
  app.services.download(name, JSON.stringify(buildDownlink(dataset, day, app.services.now())));
  app.store.update({ errorKey: null, dataMessage: { key: 'data.downlink.saved', params: { day, file: name } } });
};