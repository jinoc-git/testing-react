import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Product } from '../../src/entities';
import { db } from '../mocks/db';
import { navigateTo } from '../utils';

describe('ProductDetailPage', () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create(); // 상품 생성
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } }); // 생성한 상품 삭제
  });

  it('should render product detail', async () => {
    navigateTo(`/products/${product.id}`); // 생성한 상품 상세 페이지로 이동

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i)); // 로딩이 끝나면

    expect(
      screen.getByRole('heading', { name: product.name })
    ).toBeInTheDocument(); // h1태그에 상품 이름이 있는지

    expect(screen.getByText('$' + product.price)).toBeInTheDocument(); // 상품 가격이 렌더링 되는지 확인
  });
});
