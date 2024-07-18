import { render, screen } from '@testing-library/react';
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {
  // 여러 곳에서 사용하는 변수인 경우 + limit이 바뀌었을 경우 편하게 바꾸기 위해 분리
  const limit = 255;
  const longText = 'a'.repeat(limit + 1);
  const truncateText = longText.substring(0, limit) + '...';

  it('should render the full text if less than 255', () => {
    const text = 'short text';
    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('should truncate text if longer than 255', () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncateText)).toBeInTheDocument();
    const button = screen.getByRole('button');
    // expect(button).toBeInTheDocument(); getByRole은 없으면 오류 발생이라 있는지 확인하지 않아도 됨
    expect(button).toHaveTextContent(/more/i);
  });

  it('should expand text when show more button is clicked', async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument(); // 모든 텍스트가 보여지는지
    expect(button).toHaveTextContent(/less/i); // 버튼이 show less 버튼인지
  });

  it('should collapse text when show less button is clicked', async () => {
    // Arrange (모든 텍스트가 보여진 상태로 만든 후)
    render(<ExpandableText text={longText} />);
    const showMoreButton = screen.getByRole('button', { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreButton);

    // Act (show less 버튼을 클릭했을 때)
    const showLessButton = screen.getByRole('button', { name: /less/i });
    await user.click(showLessButton);

    // Assert
    expect(screen.getByText(truncateText)).toBeInTheDocument(); // 잘린 텍스트가 보여지는지
    expect(showMoreButton).toHaveTextContent(/more/i); // 버튼이 show more로 바뀌었는지
  });
});
