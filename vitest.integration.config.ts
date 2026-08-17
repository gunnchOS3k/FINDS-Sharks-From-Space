import { defineConfig } from 'vitest/config';

export default defineConfig({
  assetsInclude: ['**/*.xml'],
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.test.ts', 'tests/worker/**/*.test.ts'],
  },
});
