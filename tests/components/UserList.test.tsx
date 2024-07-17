import { render, screen } from '@testing-library/react';
import UserList from '../../src/components/UserList';
import { User } from '../../src/entities';

describe('UserList', () => {
  it('should render no users when th users array is empty', () => {
    render(<UserList users={[]} />);

    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });

  it('should render a list of users', () => {
    const users: User[] = [
      { id: 1, name: 'jin' },
      { id: 2, name: 'cheol' },
    ];

    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole('link', { name: user.name }); // a 태그 중 user.name이란 텍스트가 있는 태그
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`); // href 속성이/users/user.id 인지
    });
  });
});
