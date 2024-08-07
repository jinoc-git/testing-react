import '@testing-library/jest-dom/vitest'; // 이 부분을 추가하여 테스트 파일에 작성할 필요가 없어짐
import ResizeObserver from 'resize-observer-polyfill';
import { server } from './mocks/server';
import { PropsWithChildren } from 'react';

beforeAll(() => server.listen()); // 테스트 실행 전 한 번만 호출, mock api 서버 실행
afterEach(() => server.resetHandlers()); // 각 테스트 실행 후 매번 호출, mock api 재설정
afterAll(() => server.close()); // 모든 테스트 이후 한 번만 호출, mock api 서버 종료

vi.mock('@auth0/auth0-react', () => {
  // auth0 패키지 전체를 mocking
  return {
    useAuth0: vi.fn().mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    }),
    Auth0Provider: ({ children }: PropsWithChildren) => children,
    withAuthenticationRequired: vi.fn(),
  };
});

// 테스트 파일 내에서 웹 api resizeObserver는 사용이 불가하기에 패키지로 사용할 수 있도록 함
global.ResizeObserver = ResizeObserver;

// HTMLElement scrollIntoView, hasPointerCapture, releasePointerCapture 모킹
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

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
