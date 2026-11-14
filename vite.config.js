import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: { target: 'es2022', outDir: 'dist' },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
  },
});