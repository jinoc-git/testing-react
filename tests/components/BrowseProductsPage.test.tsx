import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { Theme } from '@radix-ui/themes';
import { server } from '../mocks/server';
import { delay, http, HttpResponse } from 'msw';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';
import { CartProvider } from '../../src/providers/CartProvider';
import userEvent from '@testing-library/user-event';

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  // 카테고리와 상품을 2개씩 생성
  beforeAll(() => {
    [1, 2].forEach(() => {
      categories.push(db.category.create());
      products.push(db.product.create());
    });
  });

  afterAll(() => {
    // 카테고리 id들을 배열로 만들어서
    const categoryIds = categories.map((category) => category.id);
    // db category에 categoryIds에 있는 id와 일치하는 것들을 삭제
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    // 상품 id들을 배열로 만들어서
    const productIds = products.map((product) => product.id);
    // db product에 categoryIds에 있는 id와 일치하는 것들을 삭제
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );
  };

  it('should show a loading skeleton when fetching categories', () => {
    // categories fetching
    server.use(
      http.get('/categories', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div를 찾음
    expect(
      screen.getByRole('progressbar', {
        name: /categories/i,
      })
    ).toBeInTheDocument();
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div가 사라지는지 확인
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', {
        name: /categories/i,
      })
    );
  });

  it('should show a loading skeleton when fetching products', async () => {
    // products fetching
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div를 찾음
    expect(
      screen.getByRole('progressbar', { name: /products/i })
    ).toBeInTheDocument();
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div가 사라지는지 확인
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /products/i })
    );
  });

  it('should not render an error if categories cannot be fetched', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));

    renderComponent();

    // loading indicator가 사라진 뒤
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /products/i })
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument(); // error란 텍스트가 없고
    expect(
      screen.queryByRole('combobox', { name: /category/i })
    ).not.toBeInTheDocument(); // select가 없는지
  });

  it('should render an error if products cannot be fetched', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument(); // error란 텍스트가 있는지
  });

  it('should render categories', async () => {
    renderComponent();

    // getByRole을 즉시 찾지만 findByRole은 비동기적으로 요소를 찾음
    // (동적으로 생성되거나 비동기적으로 로딩되는 요소 찾을 때 씀)
    // 시간이 지나도 요소를 찾지 못하면 TimeoutError를 발생
    const combobox = await screen.findByRole('combobox');
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    // 기본으로 렌더링되는 옵션인 All 옵션이 렌더링 되는지 확인
    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();
    // beforeAll에서 생성한 categories를 순회하면서 각 옵션이 잘 렌더링 되는지 확인
    categories.forEach((category) => {
      expect(
        screen.getByRole('option', { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it('should render products', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole('progressbar', { name: /products/i })
    );

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument(); // 상품이 렌더링되는지 확인
    });
  });
});
