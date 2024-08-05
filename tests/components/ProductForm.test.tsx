import { render, screen } from '@testing-library/react';
import ProductForm from '../../src/components/ProductForm';
import AllProviders from '../AllProviders';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';

describe('ProductForm', () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();
    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} />
        <Toaster />
      </>,
      {
        wrapper: AllProviders,
      }
    );

    return {
      onSubmit,
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole('alert'); // 에러 메시지 div의 role은 alert임
        expect(error).toBeInTheDocument(); // 에러 메시지가 렌더링 되는지
        expect(error).toHaveTextContent(errorMessage); // 에러 메시지가 인자로 받은 errorMessage 텍스트를 포함하는지
      },
      waitForFormToLoad: async () => {
        await screen.findByRole('form');

        // getByPlaceholderText대신 getByRole, getByLabelText, getByTestId도 가능하다
        // (getByTestId는 요소에 data-testid 속성을 추가해야한다)
        const nameInput = screen.getByPlaceholderText(/name/i); // name이란 placeholder를 갖은 요소 찾기
        const priceInput = screen.getByPlaceholderText(/price/i); // price란 placeholder를 갖은 요소 찾기
        const categoryInput = screen.getByRole('combobox', {
          name: /category/i,
        }); // category 선택 select 찾기
        const submitButton = screen.getByRole('button');

        type FormData = { [K in keyof Product]: any };

        const validData = {
          id: 1,
          name: 'a',
          price: 1,
          categoryId: category.id,
        };

        // test에서 input의 값을 채워주는 함수
        const fill = async (product: FormData) => {
          const user = userEvent.setup();
          if (product.name !== undefined) {
            await user.type(nameInput, product.name); // name input이 빈 값이 아닐 때를 제외하고 input에 값을 넣음
          }
          if (product.price !== undefined) {
            await user.type(priceInput, product.price.toString()); // price input이 빈 값일 때를 제외하고 input에 값을 넣음
          }

          await user.tab(); // 사용자의 ui 상호 작용을 정확하게 하기 위하여 추가
          await user.click(categoryInput); // 카테고리 버튼 클릭
          const options = screen.getAllByRole('option');
          await user.click(options[0]); // 첫 번째 카테고리 선택
          await user.click(submitButton); // submit 버튼 클릭
        };

        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          validData,
          fill,
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
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const form = await waitForFormToLoad();

      await form.fill({ ...form.validData, name });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    { scenario: 'missing', errorMessage: /required/i }, // price input이 빈 값일 때
    { scenario: '0', price: 0, errorMessage: /1/i }, // price input의 값이 0일 때
    { scenario: 'negative', price: -1, errorMessage: /1/i }, // price input의 값이 음수일 때
    { scenario: 'greater than 1000', price: 1001, errorMessage: /1000/i }, // price input의 값이 1000보다 클 때
    { scenario: 'not a number', price: 'a', errorMessage: /required/i }, // price input의 값이 숫자가 아닐 때
  ])(
    'should display an error if price is $scenario',
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const form = await waitForFormToLoad();

      await form.fill({ ...form.validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it('should call onSubmit with the correct data', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    const { id, ...formData } = form.validData;
    expect(onSubmit).toHaveBeenCalledWith(formData); // onSubmit 함수가 validData를 인자로 받는지 확인 (잘 전달되는지)
  });

  it('should display a toast if submission fails', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({}); // onSubmit함수가 빈 객체를 반환하며 reject하도록 mocking (테스트코드에서 호출됐을 때)

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    const toast = await screen.findByRole('status'); // toast의 role은 status
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it('should disable the submit button upon submission', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockReturnValue(new Promise(() => {})); // 빈 객체를 반환하는 promise는 resolve, reject되지 않은 상태 (submitting)

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).toBeDisabled(); // 제출중일 때 disable되는지 확인
  });

  it('should re-enable the submit button after submission', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue({}); // submit 성공 시

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).not.toBeDisabled(); // disable가 아닌지 확인
  });

  it('should re-enable the submit button after submission', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue('error'); // submit 실패 시

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).not.toBeDisabled(); // disable가 아닌지 확인
  });
});
