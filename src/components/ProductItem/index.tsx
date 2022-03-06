import { MdAddShoppingCart } from 'react-icons/md';

import { useCart } from "../../hooks/useCart";
import { Product } from "../../types";
import { formatPrice } from '../../util/format';

interface ProductItemProps {
  product: Product,
  cartItemsAmount: number,
}

export function ProductItem({ product, cartItemsAmount }: ProductItemProps) {
  const { addProduct } = useCart();
  const { id, title, image, price } = product;

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <li>
      <img src={image} alt={title} />
      <strong>{title}</strong>
      <span>{formatPrice(price)}</span>
      <button
        type="button"
        data-testid="add-product-button"
        onClick={() => handleAddProduct(id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {cartItemsAmount}
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </li>
  )
}