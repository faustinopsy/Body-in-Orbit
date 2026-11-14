import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app/createApp.js';

describe('createApp', () => {
  it('renders the title', () => {
    const root = document.createElement('div');
    createApp(root);
    expect(root.querySelector('h1').textContent).toBe('Corpo em Órbita');
  });
});