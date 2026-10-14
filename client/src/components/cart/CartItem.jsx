import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import ProductImage from '../product/ProductImage';
import QuantitySelector from '../ui/QuantitySelector';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <li className="cart-item" id={`cart-item-${item.productId}`}>
      <Link to={`/product/${item.slug}`} className="cart-item__media" tabIndex={-1} aria-hidden="true">
        <ProductImage src={item.imageUrl} alt="" className="cart-item__image" />
      </Link>

      <div className="cart-item__info">
        <h3 className="cart-item__name">
          <Link to={`/product/${item.slug}`}>{item.name}</Link>
        </h3>
        <p className="muted">{formatPrice(item.price)} each</p>
        {item.quantity >= item.stock && <p className="stock stock--low">Maximum available quantity</p>}
      </div>

      <QuantitySelector
        id={`quantity-${item.productId}`}
        value={item.quantity}
        max={item.stock}
        onChange={(quantity) => updateQuantity(item.productId, quantity)}
      />

      <p className="cart-item__total">{formatPrice(item.price * item.quantity)}</p>

      <button
        type="button"
        id={`remove-${item.productId}`}
        className="icon-btn icon-btn--danger"
        onClick={() => removeFromCart(item.productId)}
        aria-label={`Remove ${item.name} from cart`}
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
}
