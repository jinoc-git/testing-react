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

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    return {
      waitForFormToLoad: () => screen.findByRole('form'), // promise를 반환하기에 async가 없어도 await 사용 가능
      getInputs: () => {
        return {
          // getByPlaceholderText대신 getByRole, getByLabelText, getByTestId도 가능하다
          // (getByTestId는 요소에 data-testid 속성을 추가해야한다)
          nameInput: screen.getByPlaceholderText(/name/i), // name이란 placeholder를 갖은 요소 찾기
          priceInput: screen.getByPlaceholderText(/price/i), // price란 placeholder를 갖은 요소 찾기
          categoryInput: screen.getByRole('combobox', {
            name: /category/i,
          }), // category 선택 select 찾기
        };
      },
    };
  };

  it('should render form fields', async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    await waitForFormToLoad();

    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it('should populate form fields when editing a product', async () => {
    const product: Product = {
      id: 1,
      name: 'Bread',
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad, getInputs } = renderComponent(product);

    await waitForFormToLoad();

    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(nameInput).toHaveValue(product.name); // default value가 product.name이 맞는지 확인
    expect(priceInput).toHaveValue(product.price.toString()); // default value가 product.price가 맞는지 확인
    expect(categoryInput).toHaveTextContent(category.name); // select의 default value는 props로 전달된 상품의 categoryId이기 때문에 text는 category.name이다
  });
});
