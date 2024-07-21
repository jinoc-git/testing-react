import '@testing-library/jest-dom/vitest'; // 이 부분을 추가하여 테스트 파일에 작성할 필요가 없어짐

// 테스트 파일 내에서 window.matchMedia를 사용하면 오류가 나기에 모킹
Object.defineProperty(window, 'matchMedia', {
  writable: true, // matchMedia 속성을 수정할 수 있게 함
  // matchMedia 값을 모킹
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
