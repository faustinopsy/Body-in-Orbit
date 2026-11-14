import { describe, expect, it } from 'vitest';
import { BODY_LAYERS } from '../../../src/features/dashboard/body/bodyLayers.js';
import { LAYERS } from '../../../src/domain/layers.js';
import { smoothPath, symmetricPath, taper } from '../../../src/features/dashboard/body/geometry.js';

const regionsOf = (items) => items.map((item) => item.regionId).filter(Boolean);

describe('body layers', () => {
  it('draws every layer of the domain', () => {
    expect(Object.keys(BODY_LAYERS).sort()).toEqual(LAYERS.map((layer) => layer.id).sort());
  });

  it('draws every region of each layer exactly once', () => {
    LAYERS.forEach((layer) => {
      expect(regionsOf(BODY_LAYERS[layer.id]).sort()).toEqual([...layer.regions].sort());
    });
  });

  it('builds closed and open paths from points', () => {
    expect(smoothPath([[0, 0], [10, 0], [10, 10]], true)).toMatch(/^M0,0 C.* Z$/);
    expect(smoothPath([[0, 0], [10, 0], [10, 10]])).not.toContain('Z');
  });

  it('mirrors half shapes around the body axis', () => {
    const path = symmetricPath([[100, 0], [120, 10], [100, 20]]);
    expect(path).toContain('80,10');
  });

  it('builds a tapered limb with no invalid numbers', () => {
    expect(taper([0, 0], [0, 50], [5, 3, 2])).not.toMatch(/NaN|Infinity/);
  });
});