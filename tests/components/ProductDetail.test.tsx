import { render, screen } from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
import { products } from '../mocks/data';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('ProductDetail', () => {
  it('should render the list of products', async () => {
    render(<ProductDetail productId={1} />);

    const productName = await screen.findByText(new RegExp(products[0].name)); // 상품 이름 찾아서
    expect(productName).toBeInTheDocument(); // 렌더링되는지
    const productPrice = await screen.findByText(
      new RegExp(products[0].price.toString())
    ); // 상품 가격 찾아서
    expect(productPrice).toBeInTheDocument(); // 렌더링 되는지
  });

  it('should render message if product not found', async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null))); // 상품을 찾지 못했을 때

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i); // 상품이 없을 때 렌더링되는 텍스트를 찾고
    expect(message).toBeInTheDocument(); // 렌더링 되는지
  });

  it('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />); // 0은 useEffect의 첫 if문에서 걸려서 Invalid ProductId 렌더

    const message = await screen.findByText(/invalid/i); // invalid 텍스트를 찾아서
    expect(message).toBeInTheDocument(); // 렌더링 되는지 확인
  });
});
