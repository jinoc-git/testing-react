import { delay, http, HttpResponse } from 'msw';
import { server } from './mocks/server';
import { useAuth0, User } from '@auth0/auth0-react';

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endpoint: string) => {
  server.use(http.get(endpoint, async () => HttpResponse.error()));
};

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
};

// auth0의 useAuth0 훅의 반환값을 mocking
export const mockAuthState = (authState: AuthState) => {
  // vi.mock은 모듈 전체를 mocking하고 vi.mocked은 특정 모듈 또는 객체를 mocking
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue('a'),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  });
};
