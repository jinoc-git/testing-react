import { render, screen } from '@testing-library/react';
import SearchBox from '../../src/components/SearchBox';
import userEvent from '@testing-library/user-event';

describe('SearchBox', () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i), // placehoder 텍스트가 search 인 input찾아서
      user: userEvent.setup(),
      onChange,
    };
  };

  it('should render an input field for searching', () => {
    const { input } = renderComponent();

    expect(input).toBeInTheDocument(); // input이 잘 렌더링 되는지
  });

  it('should call onChange when Enter is pressed', async () => {
    const { input, user, onChange } = renderComponent();

    const searchTerm = 'SearchTerm';
    await user.type(input, searchTerm + '{enter}'); // 유저가 텍스트를 입력하고 엔터를 눌렀을 때

    expect(onChange).toHaveBeenCalledWith(searchTerm); // SearchBox 컴포넌트의 props로 들어가는 함수가 searchTerm 변수를 매개변수로 받아 호출되는지
  });

  it('should not call onChange if input field is empty', async () => {
    const { input, user, onChange } = renderComponent();

    await user.type(input, '{enter}'); // input에 텍스트 없이 엔터만 눌렀을 때

    expect(onChange).not.toHaveBeenCalled(); // SearchBox 컴포넌트의 props로 들어가는 함수가 호출되지 않는지
  });
});
