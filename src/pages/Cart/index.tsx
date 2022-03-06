import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

import { CartItem } from './CartItem';

const Cart = (): JSX.Element => {
  const { cart } = useCart();

  const sortedArray = cart.sort((a, b) => {
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      return sumTotal += (product.price * product.amount);
    }, 0));

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {sortedArray.map((product) =>
            <CartItem key={product.id} product={product} />
          )}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
