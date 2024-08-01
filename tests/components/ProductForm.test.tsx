import { render, screen } from '@testing-library/react';
import ProductForm from '../../src/components/ProductForm';
import AllProviders from '../AllProviders';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';
import userEvent from '@testing-library/user-event';

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
      waitForFormToLoad: async () => {
        await screen.findByRole('form');

        return {
          // getByPlaceholderText대신 getByRole, getByLabelText, getByTestId도 가능하다
          // (getByTestId는 요소에 data-testid 속성을 추가해야한다)
          nameInput: screen.getByPlaceholderText(/name/i), // name이란 placeholder를 갖은 요소 찾기
          priceInput: screen.getByPlaceholderText(/price/i), // price란 placeholder를 갖은 요소 찾기
          categoryInput: screen.getByRole('combobox', {
            name: /category/i,
          }), // category 선택 select 찾기
          submitButton: screen.getByRole('button'),
        };
      },
    };
  };

  it('should render form fields', async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

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

    const { waitForFormToLoad } = renderComponent(product);

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name); // default value가 product.name이 맞는지 확인
    expect(priceInput).toHaveValue(product.price.toString()); // default value가 product.price가 맞는지 확인
    expect(categoryInput).toHaveTextContent(category.name); // select의 default value는 props로 전달된 상품의 categoryId이기 때문에 text는 category.name이다
  });

  it('should put focus on the name field', async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();
    expect(nameInput).toHaveFocus(); // autoFocus가 잘 되는지 확인
  });

  it.each([
    { scenario: 'missing', errorMessage: /required/i }, // name input이 빈 값일 때
    {
      scenario: 'longer than 255 characters', // name input의 value가 255글자 초과일 때
      name: 'a'.repeat(256),
      errorMessage: /255/i,
    },
  ])(
    'should display an error if name is $scenario', // name input의 validation 체크 (min1, max255)
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad } = renderComponent();

      const form = await waitForFormToLoad();
      const user = userEvent.setup();
      if (name !== undefined) await user.type(form.nameInput, name); // name input에 값이 있을 때 (255 글자 초과인 케이스일 때)
      await user.type(form.priceInput, '10'); // price input에 10을 입력하고
      await user.click(form.categoryInput); // category select button을 클릭
      const options = screen.getAllByRole('option'); // select options들
      await user.click(options[0]); // 첫 번째 카테고리 선택
      await user.click(form.submitButton); // submit 버튼 클릭

      const errer = screen.getByRole('alert'); // 에러 메시지 div의 role은 alert임
      expect(errer).toBeInTheDocument(); // 에러 메시지가 렌더링 되는지
      expect(errer).toHaveTextContent(errorMessage); // 에러 메시지가 errorMessage 텍스트를 포함하는지 (인자로 받은)
    }
  );
});
