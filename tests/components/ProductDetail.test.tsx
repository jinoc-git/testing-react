import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
import { server } from '../mocks/server';
import { delay, http, HttpResponse } from 'msw';
import { db } from '../mocks/db';

describe('ProductDetail', () => {
  let productId: number; // 생성할 product의 id를 할당할 변수

  beforeAll(() => {
    const product = db.product.create(); // 상품 생성
    productId = product.id; // 생성한 productId를 변수에 할당
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } }); // 테스트 끝난 후 상품 데이터 삭제
  });

  it('should render the list of products', async () => {
    // 할당한 productId와 일치하는 상품을 db에서 찾고
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />); // 할당한 productId를 props로 전달

    const productName = await screen.findByText(new RegExp(product!.name)); // 상품 이름 찾아서, (생성한 productId를 저장했으니 ! 사용)
    expect(productName).toBeInTheDocument(); // 렌더링되는지
    const productPrice = await screen.findByText(
      new RegExp(product!.price.toString())
    ); // 상품 가격 찾아서 (생성한 productId를 저장했으니 ! 사용)
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

  // data fetching이 실패했을 때
  it('should render an error if data fetching fails', async () => {
    server.use(http.get('/products/1', () => HttpResponse.error())); // 에러를 전달

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a loading indicator when fetching data', async () => {
    server.use(
      http.get('/product/1', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove the loading indicator if data fetching fails', async () => {
    server.use(http.get('/product/1', () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });
});
