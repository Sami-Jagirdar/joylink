// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {

    coverage: {
      // Only include source files in the src/electron folder for coverage
      include: ['src/electron/**/*.{js,ts}'],

      // You can also set your preferred reporters and coverage options
      reporter: ['text', 'lcov', 'json']
    }
  }
});
