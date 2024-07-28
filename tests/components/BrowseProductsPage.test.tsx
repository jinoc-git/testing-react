import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { Theme } from '@radix-ui/themes';
import { server } from '../mocks/server';
import { delay, http, HttpResponse } from 'msw';

describe('BrowseProductsPage', () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    );
  };

  it('should show a loading skeleton when fetching categories', () => {
    // categories fetching
    server.use(
      http.get('/categories', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div를 찾음
    expect(
      screen.getByRole('progressbar', {
        name: /categories/i,
      })
    ).toBeInTheDocument();
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div가 사라지는지 확인
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', {
        name: /categories/i,
      })
    );
  });

  it('should show a loading skeleton when fetching products', async () => {
    // products fetching
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div를 찾음
    expect(
      screen.getByRole('progressbar', { name: /products/i })
    ).toBeInTheDocument();
  });

  it('should hide the loading skeleton after products are fetched', async () => {
    renderComponent();

    // skeleton을 감싸는 role이 progressbar인 div가 사라지는지 확인
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /products/i })
    );
  });

  it('should not render an error if categories cannot be fetched', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));

    renderComponent();

    // loading indicator가 사라진 뒤
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /products/i })
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument(); // error란 텍스트가 없고
    expect(
      screen.queryByRole('combobox', { name: /category/i })
    ).not.toBeInTheDocument(); // select가 없는지
  });

  it('should render an error if products cannot be fetched', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument(); // error란 텍스트가 있는지
  });
});
