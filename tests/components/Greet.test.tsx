import { render, screen } from '@testing-library/react'; // itr 스니팻으로 가능
import Greet from '../../src/components/Greet';

describe('Greet', () => {
  it('should render Hello with the name when name is provided', () => {
    render(<Greet name="Jin" />); // Greet 컴포넌트에 name props가 있는 상태로 렌더

    const heading = screen.getByRole('heading'); // 스크린의 헤딩 태그들
    expect(heading).toBeInTheDocument(); // document에 헤딩 태그가 있는지
    expect(heading).toHaveTextContent(/Jin/i); // 헤딩 태그에 Jin 이라는 텍스트가 있는지
  });

  it('should render login button when name is not provided', () => {
    render(<Greet />); // Greet 컴포넌트에 name props가 없는 상태로 렌더

    const button = screen.getByRole('button'); // 스크린의 버튼 태그들
    expect(button).toBeInTheDocument(); // document에 버튼 태그가 있는지
    expect(button).toHaveTextContent(/login/i); // 버튼 태그에 login 이라는 텍스트가 있는지
  });
});
