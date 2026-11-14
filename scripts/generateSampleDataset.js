import { mkdirSync, writeFileSync } from 'node:fs';
import { buildSampleDataset } from '../src/domain/dataset/simulate.js';

mkdirSync('public/data', { recursive: true });
writeFileSync('public/data/sample-dataset.json', JSON.stringify(buildSampleDataset()));
console.log('public/data/sample-dataset.json written');