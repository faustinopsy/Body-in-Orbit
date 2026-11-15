import { describe, expect, it } from 'vitest';
import { collectMigrations, openDatabase } from '../../src/data/openDatabase.js';
import { createPreferenceRepository } from '../../src/data/preferenceRepository.js';
import { createDatasetRepository } from '../../src/data/datasetRepository.js';

let counter = 0;
const uniqueName = () => `test-db-${(counter += 1)}`;

describe('openDatabase', () => {
  it('creates the stores declared by the migrations', async () => {
    const database = await openDatabase({ name: uniqueName() });
    expect([...database.objectStoreNames]).toEqual(['accounts', 'capsule', 'datasets', 'missions', 'preferences']);
  });

  it('runs only the migrations the database has not seen yet', async () => {
    const name = uniqueName();
    const first = (database) => database.createObjectStore('one');
    const second = (database) => database.createObjectStore('two');
    (await openDatabase({ name, migrations: [first] })).close();
    const upgraded = await openDatabase({ name, migrations: [first, second] });
    expect([...upgraded.objectStoreNames]).toEqual(['one', 'two']);
  });

  it('orders migrations by file name', () => {
    const migrations = collectMigrations({ './migrations/002-b.js': 'b', './migrations/001-a.js': 'a' });
    expect(migrations).toEqual(['a', 'b']);
  });
});

describe('repositories', () => {
  it('returns the fallback for a missing preference and the saved value afterwards', async () => {
    const preferences = createPreferenceRepository(await openDatabase({ name: uniqueName() }));
    expect(await preferences.get('locale', 'en')).toBe('en');
    await preferences.set('locale', 'pt');
    expect(await preferences.get('locale', 'en')).toBe('pt');
  });

  it('stores datasets with an id and a creation time', async () => {
    const datasets = createDatasetRepository(await openDatabase({ name: uniqueName() }), () => 'now');
    const id = await datasets.add({ name: 'Demo', data: { a: 1 } });
    expect(await datasets.get(id)).toEqual({ id, name: 'Demo', data: { a: 1 }, createdAt: 'now' });
    expect(await datasets.list()).toHaveLength(1);
  });
});