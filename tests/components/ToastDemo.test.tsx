import { render, screen } from '@testing-library/react';
import ToastDemo from '../../src/components/ToastDemo';
import { Toaster } from 'react-hot-toast';
import userEvent from '@testing-library/user-event';

describe('ToastDemo', () => {
  it('should render a toast', async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    const button = screen.getByRole('button'); // 버튼을 찾아서
    const user = userEvent.setup();
    await user.click(button); // 버튼을 클릭했을 때

    const toast = await screen.findByText(/success/i); // success text를 찾는다
    expect(toast).toBeInTheDocument(); // document에 있는지 확인
  });
});
