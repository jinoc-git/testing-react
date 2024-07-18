import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
  // 이 함수로 중복 코드 방지
  const renderComponent = () => {
    render(<TermsAndConditions />);

    // 기존의 toBeInTheDocument는 getByRole이라 없어도됨
    return {
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button'),
    };
  };

  it('should render with correct text ans initial state', () => {
    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent('Terms & Conditions');
    expect(checkbox).not.toBeChecked(); // 체크박스가 체크되지 않은 상태인지
    expect(button).toBeDisabled(); // 버튼이 disabled 상태인지
  });

  it('should enable the button when the checkbox is checked', async () => {
    const { checkbox, button } = renderComponent();

    const user = userEvent.setup();
    await user.click(checkbox); // 유저 이벤트는 async await를 사용

    expect(button).toBeEnabled(); // 버튼이 enabled가 되는지
  });
});
