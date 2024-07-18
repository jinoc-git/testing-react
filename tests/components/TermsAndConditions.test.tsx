import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
  it('should render with correct text ans initial state', () => {
    render(<TermsAndConditions />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Terms & Conditions');

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked(); // 체크박스가 체크되지 않은 상태인지

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled(); // 버튼이 disabled 상태인지
  });

  it('should enable the button when the checkbox is checked', async () => {
    render(<TermsAndConditions />);

    const checkbox = screen.getByRole('checkbox');
    const user = userEvent.setup();
    await user.click(checkbox); // 유저 이벤트는 async await를 사용

    expect(screen.getByRole('button')).toBeEnabled(); // 버튼이 enabled가 되는지
  });
});
