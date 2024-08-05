import { render, screen } from '@testing-library/react';
import { Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';
import QuantitySelector from '../../src/components/QuantitySelector';
import userEvent from '@testing-library/user-event';

describe('QuantitySelector', () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: 'milk',
      price: 5,
      categoryId: 1,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    const getAddToCartButton = () => {
      return screen.queryByRole('button', { name: /add to cart/i });
    };

    const getQuantityControls = () => {
      return {
        quantity: screen.queryByRole('status'),
        decrementButton: screen.queryByRole('button', { name: /-/i }),
        incrementButton: screen.queryByRole('button', { name: '+' }),
      };
    };

    const user = userEvent.setup();

    const addToCart = async () => {
      const button = getAddToCartButton();
      await user.click(button!);
    };

    const incrementQuantity = async () => {
      const { incrementButton } = getQuantityControls();
      await user.click(incrementButton!);
    };

    const decrementQuantity = async () => {
      const { decrementButton } = getQuantityControls();
      await user.click(decrementButton!);
    };

    return {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    };
  };

  it('should render the Add to Cart button', () => {
    const { getAddToCartButton } = renderComponent();

    expect(getAddToCartButton()).toBeInTheDocument(); // add to cart 버튼이 렌더링되는지 확인
  });

  it('should add the product to the cart', async () => {
    const { getAddToCartButton, addToCart, getQuantityControls } =
      renderComponent();

    await addToCart(); // 유저가 add to cart 버튼을 눌렀을 때

    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();
    expect(quantity).toHaveTextContent('1'); // quantity가 1인지
    expect(decrementButton).toBeInTheDocument(); // - 버튼이 있는지
    expect(incrementButton).toBeInTheDocument(); // + 버튼이 있는지
    expect(getAddToCartButton()).not.toBeInTheDocument(); // add to cart 버튼이 사라졌는지
  });

  it('should increment the quantity', async () => {
    const { addToCart, getQuantityControls, incrementQuantity } =
      renderComponent();
    await addToCart(); // 카트에 추가하고
    await incrementQuantity(); // + 버튼 누르면

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent('2'); // quantity가 2인지
  });

  it('should decrement the quantity', async () => {
    const {
      incrementQuantity,
      addToCart,
      getQuantityControls,
      decrementQuantity,
    } = renderComponent();
    await addToCart(); // 카트에 추가하고
    const { quantity } = getQuantityControls();
    await incrementQuantity(); // + 버튼 눌러진 상태에서

    await decrementQuantity(); // - 버튼 누르면

    expect(quantity).toHaveTextContent('1'); // quantity가 1인지
  });

  it('should remove the product from cart', async () => {
    const {
      getAddToCartButton,
      addToCart,
      getQuantityControls,
      decrementQuantity,
    } = renderComponent();
    await addToCart(); // 카트에 추가하고
    const { incrementButton, decrementButton, quantity } =
      getQuantityControls();

    await decrementQuantity(); // - 버튼을 누르면

    expect(quantity).not.toBeInTheDocument(); // quantity가 사라지고
    expect(decrementButton).not.toBeInTheDocument(); // - 버튼이 사라지고
    expect(incrementButton).not.toBeInTheDocument(); // + 버튼이 사라지고
    expect(getAddToCartButton()).toBeInTheDocument(); // add to cart 버튼이 나타나는지
  });
});
