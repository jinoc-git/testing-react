import { render, screen } from '@testing-library/react';
import { mockAuthState } from '../utils';
import AuthStatus from '../../src/components/AuthStatus';

describe('AuthStatus', () => {
  it('should render the loading message while fetching the auth status', () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render the login button if the user is not authenticated', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument(); // login버튼은 렌더링되어야함
    expect(
      screen.queryByRole('button', { name: /log out/i })
    ).not.toBeInTheDocument(); // logout 버튼은 렌더링되지 않아야 하기에 queryByRole 사용
  });

  it('should render the user name if authenticates', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name: 'Jin' },
    });

    render(<AuthStatus />);

    expect(screen.getByText(/jin/i)).toBeInTheDocument(); // user의 name이 렌더링 되는지 확인
    expect(
      screen.getByRole('button', { name: /log out/i })
    ).toBeInTheDocument(); // logout 버튼이 렌더링되는지
    expect(
      screen.queryByRole('button', { name: /log in/i })
    ).not.toBeInTheDocument(); // login 버튼이 렌더링 되지 않는지
  });
});
