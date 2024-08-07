import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import routes from '../../src/routes';

describe('Router', () => {
  it('should render the home page for /', () => {
    // 메모리 상에서 라우팅 관리하는 createMemoryRouter 사용
    const router = createMemoryRouter(routes, { initialEntries: ['/'] }); // 초기 route를 root로 설정

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  it('should render the products page for /products', () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/products'],
    });

    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole('heading', { name: /products/i })
    ).toBeInTheDocument();
  });
});
