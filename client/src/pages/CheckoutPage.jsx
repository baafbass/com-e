import { CreditCard, Lock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { ordersApi } from '../api';
import OrderSummary from '../components/cart/OrderSummary';
import ProductImage from '../components/product/ProductImage';
import FormField from '../components/ui/FormField';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useForm } from '../hooks/useForm';
import { getErrorMessage, getFieldErrors } from '../utils/errors';
import { formatPrice } from '../utils/format';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, itemCount, subtotal, shippingFee, total, isLoading: isCartLoading, reloadCart } = useCart();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { values, errors, setErrors, handleChange } = useForm({
    shippingName: user.name,
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  if (isCartLoading) return <Spinner fullPage />;
  if (items.length === 0 && !isPlacingOrder) return <Navigate to="/cart" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPlacingOrder(true);
    try {
      const order = await ordersApi.checkout(values);
      await reloadCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`, { replace: true, state: { justPlaced: true } });
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast.error(getErrorMessage(error));
      setIsPlacingOrder(false);
    }
  };

  const fieldProps = (name) => ({
    id: `checkout-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    className: 'input',
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `checkout-${name}-error` : undefined,
  });

  return (
    <div className="container page">
      <header className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          <Lock size={14} aria-hidden="true" /> Secure checkout
        </p>
      </header>

      <div className="two-column">
        <form id="checkout-form" className="card form" onSubmit={handleSubmit}>
          <fieldset className="form__section">
            <legend className="form__legend">Shipping information</legend>
            <div className="form-grid">
              <FormField label="Full name" htmlFor="checkout-shippingName" error={errors.shippingName}>
                <input
                  {...fieldProps('shippingName')}
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </FormField>
              <FormField label="Phone number" htmlFor="checkout-phone" error={errors.phone}>
                <input
                  {...fieldProps('phone')}
                  type="tel"
                  placeholder="+1 555 010 2030"
                  autoComplete="tel"
                  pattern="\+?[0-9\s\-]{7,20}"
                  title="7 to 20 digits, spaces or dashes"
                  required
                />
              </FormField>
              <FormField label="Street address" htmlFor="checkout-address" error={errors.address} className="form-grid__full">
                <input
                  {...fieldProps('address')}
                  type="text"
                  placeholder="123 Main Street, Apt 4B"
                  autoComplete="street-address"
                  maxLength={255}
                  required
                />
              </FormField>
              <FormField label="City" htmlFor="checkout-city" error={errors.city}>
                <input {...fieldProps('city')} type="text" placeholder="New York" autoComplete="address-level2" required />
              </FormField>
              <FormField label="Postal code" htmlFor="checkout-postalCode" error={errors.postalCode}>
                <input
                  {...fieldProps('postalCode')}
                  type="text"
                  placeholder="10001"
                  autoComplete="postal-code"
                  minLength={3}
                  maxLength={20}
                  required
                />
              </FormField>
              <FormField label="Country" htmlFor="checkout-country" error={errors.country} className="form-grid__full">
                <input {...fieldProps('country')} type="text" placeholder="United States" autoComplete="country-name" required />
              </FormField>
            </div>
          </fieldset>

          <fieldset className="form__section">
            <legend className="form__legend">Payment</legend>
            <div className="payment-note">
              <CreditCard size={20} aria-hidden="true" />
              <p>
                <strong>Pay on delivery.</strong> This is a demo store: no card is charged. Your order is confirmed
                immediately.
              </p>
            </div>
          </fieldset>

          <button type="submit" id="place-order" className="btn btn--primary btn--lg btn--block" disabled={isPlacingOrder}>
            {isPlacingOrder ? 'Placing order...' : `Place order · ${formatPrice(total)}`}
          </button>
        </form>

        <OrderSummary subtotal={subtotal} shippingFee={shippingFee} total={total} itemCount={itemCount}>
          <ul className="summary__items">
            {items.map((item) => (
              <li key={item.productId} className="summary__item">
                <ProductImage src={item.imageUrl} alt="" className="summary__thumb" />
                <span className="summary__item-name">
                  {item.name} <small className="muted">× {item.quantity}</small>
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </OrderSummary>
      </div>
    </div>
  );
}
