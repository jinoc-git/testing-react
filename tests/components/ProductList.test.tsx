import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { delay, http, HttpResponse } from 'msw';
import { db } from '../mocks/db';
import { QueryClient, QueryClientProvider } from 'react-query';

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

  // useQuery로 변경했기 때문에 사용
  const renderComponent = () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <ProductList />
      </QueryClientProvider>
    );
  };

  it('should render the list of products', async () => {
    renderComponent();

    const items = await screen.findAllByRole('listitem'); // li 태그 찾아서
    expect(items.length).toBeGreaterThan(0); // 0개 초과인지 확인
  });

  it('should render no products available if no product is fount', async () => {
    // mock server에서 /products api로 빈 배열을 res하여 ProductList 컴포넌트에서 data가 빈 배열로 만듦
    server.use(http.get('/products', () => HttpResponse.json([])));

    renderComponent();

    const message = await screen.findByText(/no products/i); // products.length가 0일 때 보여지는 text를 찾아서
    expect(message).toBeInTheDocument(); // 화면에 있는지 확인
  });

  it('should render an error message when there is an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a loading indicator when fetching data', async () => {
    server.use(
      http.get('/products', async () => {
        await delay(); // 100 ~ 400ms 딜레이 (서버에서 요청 응답하는 시간)
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(await screen.findByText(/loading/i)).toBeInTheDocument(); // delay 동안 loading이 보이는지
  });

  it('should remove the loading indicator after data is fetched', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    renderComponent();

    // screen.queryByText(/loading/i)는 없을 때는 null, 1개 있으면 return, 여러개면 throw함
    // 만약 null이면 에러 발생하고 loading 텍스트를 갖고 있는 요소가 제거될 때까지 기다림 (통과)
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
