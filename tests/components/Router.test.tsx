import { render, screen } from '@testing-library/react';
import { navigateTo } from '../utils';
import { db } from '../mocks/db';

describe('Router', () => {
  it('should render the home page for /', () => {
    navigateTo('/');

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  it('should render the products page for /products', () => {
    navigateTo('/products');

    expect(
      screen.getByRole('heading', { name: /products/i })
    ).toBeInTheDocument();
  });

  it('should render the product details page for /products/:id', async () => {
    const product = db.product.create(); // 상품 생성

    navigateTo(`/products/${product.id}`); // ProductDetailPage로 이동

    // 상품의 정보를 불러오기에 비동기로 찾는 findByRole 사용
    expect(
      await screen.findByRole('heading', { name: product.name })
    ).toBeInTheDocument(); // 상품 이름이 h1에 있는지 확인

    db.product.delete({ where: { id: { equals: product.id } } }); // 생성한 상품 삭제
  });

  it('should render the not found page for invalid routes', () => {
    navigateTo('invalid-route'); // 일치하는 경로가 아닌 route

    expect(screen.getByText(/not found/i)).toBeInTheDocument(); // not found 인지 확인
  });

  it('should render the admin jome page for /admin', () => {
    navigateTo('/admin');

    expect(screen.getByRole('heading', { name: /admin/i })).toBeInTheDocument();
  });
});
