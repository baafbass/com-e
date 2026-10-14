import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items, itemCount, subtotal, shippingFee, total, isLoading, clearCart } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () =>
    isAuthenticated ? navigate('/checkout') : navigate('/login', { state: { from: { pathname: '/checkout' } } });

  if (isLoading) return <Spinner fullPage />;

  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Looks like you haven't added anything yet."
          action={
            <Link to="/shop" id="empty-cart-shop" className="btn btn--primary">
              Start shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container page">
      <header className="page-header">
        <h1 className="page-title">Shopping cart</h1>
        <p className="page-subtitle">{itemCount} items in your cart</p>
      </header>

      <div className="two-column">
        <section aria-label="Cart items">
          <ul className="cart-list card">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </ul>
          <div className="cart-actions">
            <Link to="/shop" id="continue-shopping" className="btn btn--ghost">
              <ArrowLeft size={16} aria-hidden="true" /> Continue shopping
            </Link>
            <button type="button" id="clear-cart" className="btn btn--outline-danger" onClick={clearCart}>
              Clear cart
            </button>
          </div>
        </section>

        <OrderSummary subtotal={subtotal} shippingFee={shippingFee} total={total} itemCount={itemCount} showProgress>
          <button type="button" id="checkout-button" className="btn btn--primary btn--lg btn--block" onClick={goToCheckout}>
            {isAuthenticated ? 'Proceed to checkout' : 'Log in to checkout'}
          </button>
        </OrderSummary>
      </div>
    </div>
  );
}
