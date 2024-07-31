import { render, screen } from '@testing-library/react';
import ProductForm from '../../src/components/ProductForm';
import AllProviders from '../AllProviders';

describe('ProductForm', () => {
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
});
