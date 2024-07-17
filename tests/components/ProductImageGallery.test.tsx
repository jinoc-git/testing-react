import { render, screen } from '@testing-library/react';
import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {
  it('should return null when urls is empty', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render image gallery', () => {
    const imageUrls = ['url1', 'url2'];

    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);

    imageUrls.forEach((url, idx) => {
      expect(images[idx]).toHaveAttribute('src', url);
    });
  });
});
