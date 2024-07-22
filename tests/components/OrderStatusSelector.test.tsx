import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

describe('OrderStatusSelector', () => {
  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    return {
      trigger: screen.getByRole('combobox'), // select의 button role이 combobox
      // async await 키워드가 없어도 되지만 함수 실행할 때 await 키워드가 필요하기에 명시적으로 추가함
      getOptions: async () => await screen.findAllByRole('option'),
    };
  };

  it('should render New as the default value', () => {
    const { trigger } = renderComponent();

    expect(trigger).toHaveTextContent(/new/i);
  });

  it('should render correct statuses', async () => {
    const { trigger, getOptions } = renderComponent();

    const user = userEvent.setup();
    await user.click(trigger);

    const options = await getOptions(); // select item
    expect(options).toHaveLength(3); // select의 option이 3개인지
    const labels = options.map((option) => option.textContent); // option들의 text들
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']); // text들이 실제 text들과 똑같은지 확인
  });
});
