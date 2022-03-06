import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../util/format";

interface Product {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
    amount: number;
  }
}

export function CartItem({ product }: Product): JSX.Element {
  const { cart, removeProduct, updateProductAmount } = useCart();
  const {
    id,
    title,
    price,
    image,
    amount
  } = product;

  const subTotal = price * amount;

  function handleProductIncrement() {
    updateProductAmount({
      productId: id,
      amount: amount + 1,
    });
  }

  function handleProductDecrement() {
    updateProductAmount({
      productId: id,
      amount: amount - 1,
    });
  }

  function handleRemoveProduct() {
    removeProduct(id);
  }

  return (
    <tr data-testid="product">
      <td>
        <img src={image} alt={title} />
      </td>
      <td>
        <strong>{title}</strong>
        <span>{formatPrice(price)}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
            disabled={amount <= 1}
            onClick={handleProductDecrement}
          >
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={amount}
          />
          <button
            type="button"
            data-testid="increment-product"
            onClick={handleProductIncrement}
          >
            <MdAddCircleOutline size={20} />
          </button>
        </div>
      </td>
      <td>
        <strong>{formatPrice(subTotal)}</strong>
      </td>
      <td>
        <button
          type="button"
          data-testid="remove-product"
          onClick={handleRemoveProduct}
        >
          <MdDelete size={20} />
        </button>
      </td>
    </tr>
  )
}