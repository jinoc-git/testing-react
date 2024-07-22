import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

describe('OrderStatusSelector', () => {
  it('should render New as the default value', () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const button = screen.getByRole('combobox');
    expect(button).toHaveTextContent(/new/i);
  });

  it('should render correct statuses', async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const button = screen.getByRole('combobox'); // select의 button role이 combobox
    const user = userEvent.setup();
    await user.click(button);

    const options = await screen.findAllByRole('option'); // select item
    expect(options).toHaveLength(3); // select의 option이 3개인지
    const labels = options.map((option) => option.textContent); // option들의 text들
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']); // text들이 실제 text들과 똑같은지 확인
  });
});
