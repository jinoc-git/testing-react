import { render, screen } from '@testing-library/react';
import Label from '../../src/components/Label';
import { LanguageProvider } from '../../src/providers/language/LanguageProvider';
import { Language } from '../../src/providers/language/type';

describe('Label', () => {
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  // EN일 때 렌더링되는 텍스트 확인
  describe('Given the current language is EN', () => {
    it.each([
      { labelId: 'welcome', text: 'Welcome' },
      { labelId: 'new_product', text: 'New Product' },
      { labelId: 'edit_product', text: 'Edit Product' },
    ])('should render $text for $lableId', ({ labelId, text }) => {
      renderComponent(labelId, 'en');

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  // KR일 때 렌더링되는 텍스트 확인
  describe('Given the current language is KR', () => {
    it.each([
      { labelId: 'welcome', text: '환영합니다' },
      { labelId: 'new_product', text: '새로운 상품' },
      { labelId: 'edit_product', text: '상품 수정하기' },
    ])('should render $text for $lableId', ({ labelId, text }) => {
      renderComponent(labelId, 'kr');

      expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('should throw an error if given an invalid labelId', () => {
      expect(() => renderComponent('!', 'en')).toThrowError(); // en.json 파일에 없는 labelId일 때 에러 발생하는지
    });
  });
});
