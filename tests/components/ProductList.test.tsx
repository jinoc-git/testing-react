import { render, screen } from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { db } from '../mocks/db';

describe('ProductList', () => {
  const productIds: number[] = []; // 생성할 product들의 id들을 할당할 배열

  beforeAll(() => {
    // 3개의 product를 생성하기 위해 [1, 2, 3]을 사용
    [1, 2, 3].forEach(() => {
      const product = db.product.create(); // product 생성
      productIds.push(product.id); // id를 push
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it('should render the list of products', async () => {
    render(<ProductList />);

    const items = await screen.findAllByRole('listitem'); // li 태그 찾아서
    expect(items.length).toBeGreaterThan(0); // 0개 초과인지 확인
  });

  it('should render no products available if no product is fount', async () => {
    // mock server에서 /products api로 빈 배열을 res하여 ProductList 컴포넌트에서 data가 빈 배열로 만듦
    server.use(http.get('/products', () => HttpResponse.json([])));

    render(<ProductList />);

    const message = await screen.findByText(/no products/i); // products.length가 0일 때 보여지는 text를 찾아서
    expect(message).toBeInTheDocument(); // 화면에 있는지 확인
  });

  it('should render an error message when there is an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
