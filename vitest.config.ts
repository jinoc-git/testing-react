import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // 테스트 파일이 실행되기 전에 실행되는 setup 파일
    setupFiles: 'tests/setup.ts',
  },
});
