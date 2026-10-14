import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { cartApi } from '../api';
import { getErrorMessage } from '../utils/errors';
import { calculateTotals } from '../utils/format';
import { useAuth } from './AuthContext';

const GUEST_CART_KEY = 'shopsphere_guest_cart';

const guestCart = {
  read: () => {
    try {
      return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) ?? [];
    } catch {
      return [];
    }
  },
  write: (items) => localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items)),
  clear: () => localStorage.removeItem(GUEST_CART_KEY),
};

const toCartItem = (product, quantity) => ({
  productId: product.id,
  quantity,
  name: product.name,
  slug: product.slug,
  price: product.price,
  imageUrl: product.imageUrl,
  stock: product.stock,
});

const CartContext = createContext(null);

/**
 * Guests keep their cart in localStorage; signed-in users keep it on the server.
 * When a guest signs in, their local cart is merged into the saved one.
 */
export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!user) {
      setItems(guestCart.read());
      return;
    }

    setIsLoading(true);
    try {
      const pending = guestCart.read();
      const cart = pending.length
        ? await cartApi.merge(pending.map(({ productId, quantity }) => ({ productId, quantity })))
        : await cartApi.get();
      guestCart.clear();
      setItems(cart.items);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /** Applies a change via the API (signed in) or to the local cart (guest). */
  const applyChange = useCallback(
    async (serverRequest, updateGuestItems) => {
      if (user) {
        const cart = await serverRequest();
        setItems(cart?.items ?? []);
        return;
      }
      const nextItems = updateGuestItems(guestCart.read());
      guestCart.write(nextItems);
      setItems(nextItems);
    },
    [user],
  );

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      try {
        await applyChange(
          () => cartApi.addItem(product.id, quantity),
          (current) => {
            const existing = current.find((item) => item.productId === product.id);
            if (!existing) return [...current, toCartItem(product, Math.min(quantity, product.stock))];
            return current.map((item) =>
              item === existing ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item,
            );
          },
        );
        toast.success(`${product.name} added to cart`);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [applyChange],
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      try {
        await applyChange(
          () => cartApi.updateItem(productId, quantity),
          (current) => current.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        );
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [applyChange],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        await applyChange(
          () => cartApi.removeItem(productId),
          (current) => current.filter((item) => item.productId !== productId),
        );
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [applyChange],
  );

  const clearCart = useCallback(async () => {
    try {
      await applyChange(
        () => cartApi.clear(),
        () => [],
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [applyChange]);

  const value = useMemo(
    () => ({
      items,
      isLoading,
      ...calculateTotals(items),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      reloadCart: loadCart,
    }),
    [items, isLoading, addToCart, updateQuantity, removeFromCart, clearCart, loadCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
