import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';

describe('UserAccount', () => {
  it('should render user name', () => {
    const user: User = { id: 1, name: 'Jin' };

    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument(); // 스크린에 유저 이름이 있는지?
  });

  it('should render edit button when user is admin', () => {
    const user: User = { id: 1, name: 'Jin', isAdmin: true }; // 유저가 admin

    render(<UserAccount user={user} />);

    const button = screen.getByRole('button'); // 버튼 태그들 찾아서
    // expect(button).toBeInTheDocument(); getByRole을 사용하기에 주석
    expect(button).toHaveTextContent(/edit/i); // 버튼에 edit이란 글자가 있는지
  });

  it('should not render edit button when user is not admin', () => {
    const user: User = { id: 1, name: 'Jin' }; // admin이 아닐 때

    render(<UserAccount user={user} />);

    const button = screen.queryByRole('button'); // 버튼 태그를 찾아서
    expect(button).not.toBeInTheDocument(); // document에 버튼이 없는지
  });
});

// getByRole과 queryByRole의 차이
// getByRole은 태그가 없을 때 에러를 발생시키지만 queryByRole은 null을 반환함
// 따라서 UserAccount에서는 유저가 admin일 때만 버튼을 렌더하기 때문에 queryByRole을 사용 (없을 경우도 있을 때)
