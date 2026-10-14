import { CheckCircle2, RotateCcw, ShieldCheck, ShoppingCart, Truck, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productsApi } from '../api';
import ProductImage from '../components/product/ProductImage';
import ReviewSection from '../components/product/ReviewSection';
import ErrorMessage from '../components/ui/ErrorMessage';
import QuantitySelector from '../components/ui/QuantitySelector';
import Rating from '../components/ui/Rating';
import Spinner from '../components/ui/Spinner';
import { useCart } from '../context/CartContext';
import { useAsync } from '../hooks/useAsync';
import { FREE_SHIPPING_THRESHOLD } from '../utils/constants';
import { formatPrice } from '../utils/format';

const LOW_STOCK_LIMIT = 5;

function StockStatus({ stock }) {
  if (stock === 0) {
    return (
      <p className="stock stock--out">
        <XCircle size={16} aria-hidden="true" /> Out of stock
      </p>
    );
  }
  return (
    <p className={`stock ${stock <= LOW_STOCK_LIMIT ? 'stock--low' : 'stock--in'}`}>
      <CheckCircle2 size={16} aria-hidden="true" />
      {stock <= LOW_STOCK_LIMIT ? `Only ${stock} left in stock` : 'In stock'}
    </p>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, error, reload } = useAsync(() => productsApi.getBySlug(slug), [slug]);

  // Keep showing the product while it refreshes (e.g. after a new review).
  const isFirstLoad = isLoading && product?.slug !== slug;

  if (isFirstLoad) return <Spinner fullPage />;
  if (error) {
    return (
      <div className="container page">
        <ErrorMessage message={error} onRetry={reload} />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="container page">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span> <Link to="/shop">Shop</Link>
        {product.categorySlug && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/shop?category=${product.categorySlug}`}>{product.categoryName}</Link>
          </>
        )}
        <span aria-hidden="true">/</span> <span aria-current="page">{product.name}</span>
      </nav>

      <article className="product-detail" id={`product-${product.id}`}>
        <div className="product-detail__media">
          <ProductImage src={product.imageUrl} alt={product.name} className="product-detail__image" eager />
        </div>

        <div className="product-detail__info">
          {product.categoryName && <p className="eyebrow">{product.categoryName}</p>}
          <h1 className="product-detail__title">{product.name}</h1>
          <a href="#reviews" className="product-detail__rating">
            <Rating value={product.rating} count={product.reviewCount} />
          </a>

          <p className="price price--lg">
            <span className="price__current">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="price__compare">
                <span className="visually-hidden">Was </span>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>

          <StockStatus stock={product.stock} />

          <p className="product-detail__description">{product.description}</p>

          <div className="product-detail__purchase">
            <QuantitySelector
              id="product-quantity"
              value={quantity}
              max={Math.max(product.stock, 1)}
              onChange={setQuantity}
              disabled={isOutOfStock}
            />
            <button
              type="button"
              id="add-to-cart"
              className="btn btn--primary btn--lg"
              onClick={() => addToCart(product, quantity)}
              disabled={isOutOfStock}
            >
              <ShoppingCart size={18} aria-hidden="true" /> Add to cart
            </button>
            <button
              type="button"
              id="buy-now"
              className="btn btn--outline btn--lg"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              Buy now
            </button>
          </div>

          <ul className="product-detail__perks">
            <li>
              <Truck size={18} aria-hidden="true" /> Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
            </li>
            <li>
              <RotateCcw size={18} aria-hidden="true" /> 30-day hassle-free returns
            </li>
            <li>
              <ShieldCheck size={18} aria-hidden="true" /> Secure checkout
            </li>
          </ul>
        </div>
      </article>

      <ReviewSection product={product} onReviewAdded={reload} />
    </div>
  );
}
