import { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

import { ProductItem } from '../../components/ProductItem';
import { Product } from '../../types';

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const { cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = product.amount;
    return sumAmount;
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const { data } = await api.get('products');
      setProducts(data);
    }

    loadProducts();
  }, []);

  return (
    <ProductList>
      {products.map((product) =>
        <ProductItem
          key={product.id}
          product={product}
          cartItemsAmount={cartItemsAmount[product.id] || 0}
        />
      )
      }
    </ProductList >
  );
};

export default Home;
