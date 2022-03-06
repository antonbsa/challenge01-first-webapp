import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const handleUpdateCartState = (newStateValue: Product[]) => {
    setCart(newStateValue);
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(newStateValue));
  }

  const addProduct = async (productId: number) => {
    try {
      const { data: stockValue } = await api.get(`stock/${productId}`);
      if (stockValue.amount <= 0) {
        toast.error('Em falta no estoque!');
        return;
      }

      const hasProductAdded = cart.filter((product) => product.id === productId)[0];
      if (hasProductAdded) {
        updateProductAmount({ productId, amount: hasProductAdded.amount + 1 })
        return;
      }

      const { data: productData } = await api.get(`products/${productId}`);
      handleUpdateCartState([...cart, {
        ...productData,
        amount: 1,
      }]);
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      handleUpdateCartState(cart.filter((product) => product.id !== productId));
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount === 0) return;

      const { data: stockValue } = await api.get(`stock/${productId}`);
      if (stockValue.amount <= amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      const { data: productData } = await api.get(`products/${productId}`);
      handleUpdateCartState([
        ...cart.filter((product) => product.id !== productData.id),
        {
          ...productData,
          amount,
        }
      ]);
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
