import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import Rating from '../ui/Rating';
import ProductImage from './ProductImage';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock === 0;
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <article className="product-card" id={`product-card-${product.id}`} aria-labelledby={`product-title-${product.id}`}>
      <Link to={`/product/${product.slug}`} className="product-card__media" tabIndex={-1} aria-hidden="true">
        <ProductImage src={product.imageUrl} alt="" className="product-card__image" />
        {discount > 0 && <span className="product-card__tag product-card__tag--sale">-{discount}%</span>}
        {isOutOfStock && <span className="product-card__tag product-card__tag--muted">Sold out</span>}
      </Link>

      <div className="product-card__body">
        {product.categoryName && <p className="product-card__category">{product.categoryName}</p>}
        <h3 className="product-card__title" id={`product-title-${product.id}`}>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <Rating value={product.rating} count={product.reviewCount} size={14} />

        <div className="product-card__footer">
          <p className="price">
            <span className="price__current">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="price__compare">
                <span className="visually-hidden">Was </span>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>
          <button
            type="button"
            id={`add-to-cart-${product.id}`}
            className="icon-btn icon-btn--primary"
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
