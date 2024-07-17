import { render, screen } from '@testing-library/react';
import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {
  it('should return null when urls is empty', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />); // render 함수의 return 중 container 속성(div)
    // 즉 div를 생성 후 해당 div 안에 react 요소를 렌더함

    expect(container).toBeEmptyDOMElement(); // div가 빈 요소인지 확인
  });

  it('should render image gallery', () => {
    const imageUrls = ['url1', 'url2'];

    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2); // img태그들의 개수가 2개인지

    imageUrls.forEach((url, idx) => {
      expect(images[idx]).toHaveAttribute('src', url); // img 태그의 src가 url이 맞는지 확인
    });
  });
});
