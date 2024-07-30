import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { Theme } from '@radix-ui/themes';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';
import { CartProvider } from '../../src/providers/CartProvider';
import userEvent from '@testing-library/user-event';
import { simulateDelay, simulateError } from '../utils';

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

    return {
      getProductsSkeleton: () =>
        screen.queryByRole('progressbar', { name: /products/i }),

      getCategoriesSkeleton: () =>
        screen.queryByRole('progressbar', {
          name: /categories/i,
        }),

      getCategoriesComboBox: () => screen.queryByRole('combobox'),
    };
  };

  it('should show a loading skeleton when fetching categories', () => {
    simulateDelay('/categories');

    const { getCategoriesSkeleton } = renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div를 찾음
    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    const { getCategoriesSkeleton } = renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div가 사라지는지 확인
    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it('should show a loading skeleton when fetching products', async () => {
    simulateDelay('/products');

    const { getProductsSkeleton } = renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div를 찾음
    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    const { getProductsSkeleton } = renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div가 사라지는지 확인
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it('should not render an error if categories cannot be fetched', async () => {
    simulateError('/categories');

    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    // loading indicator가 사라진 뒤
    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument(); // error란 텍스트가 없고
    expect(getCategoriesComboBox()).not.toBeInTheDocument(); // select가 없는지
  });

  it('should render an error if products cannot be fetched', async () => {
    simulateError('/products');

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument(); // error란 텍스트가 있는지
  });

  it('should render categories', async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    // getByRole을 즉시 찾지만 findByRole은 비동기적으로 요소를 찾음
    // (동적으로 생성되거나 비동기적으로 로딩되는 요소 찾을 때 씀)
    // 시간이 지나도 요소를 찾지 못하면 TimeoutError를 발생
    // const combobox = await screen.findByRole('combobox');
    const combobox = getCategoriesComboBox();
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox!);

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
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument(); // 상품이 렌더링되는지 확인
    });
  });
});
