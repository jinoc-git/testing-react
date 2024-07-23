import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

describe('OrderStatusSelector', () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      trigger: screen.getByRole('combobox'), // select의 button role이 combobox
      // async await 키워드가 없어도 되지만 함수 실행할 때 await 키워드가 필요하기에 명시적으로 추가함
      getOptions: async () => await screen.findAllByRole('option'),
      getOption: (label: RegExp) =>
        screen.findByRole('option', { name: label }),
      user: userEvent.setup(),
      onChange,
    };
  };

  it('should render New as the default value', () => {
    const { trigger } = renderComponent();

    expect(trigger).toHaveTextContent(/new/i);
  });

  it('should render correct statuses', async () => {
    const { trigger, getOptions, user } = renderComponent();

    await user.click(trigger);

    const options = await getOptions(); // select item
    expect(options).toHaveLength(3); // select의 option이 3개인지
    const labels = options.map((option) => option.textContent); // option들의 text들
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']); // text들이 실제 text들과 똑같은지 확인
  });

  // each로 배열 안의 요소를 테스트 함수의 인자로 넘겨주어 테스트 하는 방식으로 사용 (동일한 테스트 코드 중복 방지)
  // 다른 변수로 동일한 테스트를 진행해야 할 때 사용
  it.each([
    { label: /processed/i, value: 'processed' }, // option의 label과 value
    { label: /fulfilled/i, value: 'fulfilled' }, // option의 label과 value
  ])(
    'should call onChange with $value when the $label option is selected',
    async ({ label, value }) => {
      const { trigger, user, onChange, getOption } = renderComponent();
      await user.click(trigger); // 유저가 버튼을 클릭

      const option = await getOption(label); // 각 label
      await user.click(option); // label을 클릭 (select에서 선택)

      expect(onChange).toHaveBeenCalledWith(value); // onChange 함수가 value를 인수로 받는지
    }
  );

  it('should call onChange with "new" when the New option is selected', async () => {
    const { trigger, user, onChange, getOption } = renderComponent();
    await user.click(trigger); // 유저가 버튼을 클릭

    const processedOption = await getOption(/processed/i);
    await user.click(processedOption); // processed를 선택

    await user.click(trigger); // 다시 버튼 클릭
    const newOption = await getOption(/new/i);
    await user.click(newOption); // new를 선택

    expect(onChange).toHaveBeenCalledWith('new'); // onChange 함수가 new를 인수로 받는지
  });
});
