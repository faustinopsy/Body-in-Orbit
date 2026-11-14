import { skeletonLayer } from './skeletonLayer.js';
import { musclesLayer } from './musclesLayer.js';
import { cardioLayer } from './cardioLayer.js';
import { sleepLayer } from './sleepLayer.js';
import { radiationLayer } from './radiationLayer.js';

export const AVATAR_VIEW_BOX = '0 0 200 410';

export const BODY_LAYERS = {
  skeleton: skeletonLayer(),
  muscles: musclesLayer(),
  cardiovascular: cardioLayer(),
  sleep: sleepLayer(),
  radiation: radiationLayer(),
};