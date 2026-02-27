import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
  resolve: {
    alias: {
      '@gyp/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@gyp/database': path.resolve(__dirname, '../../packages/database/src'),
    },
  },
});
