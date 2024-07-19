import { render, screen } from '@testing-library/react';
import TagList from '../../src/components/TagList';

describe('TagList', () => {
  it('should render tags', async () => {
    render(<TagList />);

    const listItem = await screen.findAllByRole('listitem'); // fetch 후에 tags가 추가되기에 await
    expect(listItem.length).toBeGreaterThan(0); // li가 0개 초과인지
  });
});
