import { describe, expect, it, vi } from 'vitest';
import { createStore } from '../../src/app/createStore.js';

describe('createStore', () => {
  it('merges updates into the state', () => {
    const store = createStore({ a: 1, b: 2 });
    store.update({ b: 3 });
    expect(store.getState()).toEqual({ a: 1, b: 3 });
  });

  it('tells subscribers about every update', () => {
    const store = createStore({ a: 1 });
    const listener = vi.fn();
    store.subscribe(listener);
    store.update({ a: 2 });
    expect(listener).toHaveBeenCalledWith({ a: 2 });
  });

  it('stops telling a subscriber that unsubscribed', () => {
    const store = createStore({ a: 1 });
    const listener = vi.fn();
    store.subscribe(listener)();
    store.update({ a: 2 });
    expect(listener).not.toHaveBeenCalled();
  });
});