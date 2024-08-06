import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Category } from '../../src/entities';
import { db } from '../mocks/db';
import CategoryList from '../../src/components/CategoryList';
import ReduxProvider from '../../src/providers/ReduxProvider';
import { simulateDelay, simulateError } from '../utils';

describe('CategoryList', () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });

  const renderComponent = () => {
    render(
      <ReduxProvider>
        <CategoryList />
      </ReduxProvider>
    );
  };

  it('should render a list of categories', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i)); // 로딩이 끝나고

    categories.forEach((c) => {
      expect(screen.getByText(c.name)).toBeInTheDocument(); // 생성한 카테고리가 모두 렌더링 되는지
    });
  });

  it('should render a loading message when fetching categories', () => {
    simulateDelay('/categories'); // categories fetching 딜레이

    renderComponent();

    // loading이라는 text가 없으면 에러 발생하지만 실제 DOM에 있는지, 화면에 보이는지 확인해야하기에 expect와 toBeInTheDocument를 사용
    expect(screen.getByText(/loading/i)).toBeInTheDocument(); // loading text가 있는지
  });

  it('should render an error message if fetching categories fails', async () => {
    simulateError('/categories'); // categories fetching 에러

    renderComponent();

    // redux state의 error가 true로 바뀌면 error란 text가 렌더링되기 때문에 비동기로 찾는 findByText 사용
    expect(await screen.findByText(/error/i)).toBeInTheDocument(); // error text가 있는지
  });
});
