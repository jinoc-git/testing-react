import { render, screen } from '@testing-library/react';
import ProductForm from '../../src/components/ProductForm';
import AllProviders from '../AllProviders';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';

describe('ProductForm', () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  it('should render form fields', async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    await screen.findByRole('form');

    // getByPlaceholderText대신 getByRole, getByLabelText, getByTestId도 가능하다
    // (getByTestId는 요소에 data-testid 속성을 추가해야한다)
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument(); // name이란 placeholder를 갖은 요소 찾기
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument(); // price란 placeholder를 갖은 요소 찾기
    expect(
      screen.getByRole('combobox', { name: /category/i })
    ).toBeInTheDocument(); // category 선택 select 확인
  });

  it('should populate form fields when editing a product', async () => {
    const product: Product = {
      id: 1,
      name: 'Bread',
      price: 10,
      categoryId: category.id,
    };

    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    await screen.findByRole('form');

    // default value가 product.name이 맞는지 확인
    expect(screen.getByPlaceholderText(/name/i)).toHaveValue(product.name);

    // default value가 product.price가 맞는지 확인
    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(
      product.price.toString()
    );

    // select의 default value는 props로 전달된 상품의 categoryId이기 때문에 text는 category.name이다
    expect(
      screen.getByRole('combobox', { name: /category/i })
    ).toHaveTextContent(category.name);
  });
});
