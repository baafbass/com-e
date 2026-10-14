import { ArrowRight, Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoriesApi, productsApi } from '../api';
import CategoryCard from '../components/product/CategoryCard';
import ProductGrid from '../components/product/ProductGrid';
import ErrorMessage from '../components/ui/ErrorMessage';
import Spinner from '../components/ui/Spinner';
import { useAsync } from '../hooks/useAsync';
import { FREE_SHIPPING_THRESHOLD } from '../utils/constants';
import { formatPrice } from '../utils/format';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format&fit=crop';

const PERKS = [
  { icon: Truck, title: 'Free shipping', text: `On orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'Your data is always protected' },
  { icon: RotateCcw, title: '30-day returns', text: 'Hassle-free refunds' },
  { icon: Headphones, title: '24/7 support', text: 'We are here to help' },
];

function SectionHeader({ id, title, subtitle, linkTo, linkLabel }) {
  return (
    <header className="section-header">
      <div>
        <h2 id={id} className="section-title">
          {title}
        </h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <Link to={linkTo} className="link-arrow">
        {linkLabel} <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </header>
  );
}

export default function HomePage() {
  const categories = useAsync(() => categoriesApi.list(), []);
  const featured = useAsync(() => productsApi.list({ featured: 'true', limit: 8 }), []);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="eyebrow">New season collection</span>
            <h1 id="hero-title" className="hero__title">
              Discover products you&apos;ll <span className="text-gradient">love</span>, delivered fast.
            </h1>
            <p className="hero__text">
              Shop the latest electronics, fashion, home essentials and more, all at honest prices with free
              shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
            </p>
            <div className="hero__actions">
              <Link to="/shop" id="hero-shop-now" className="btn btn--primary btn--lg">
                Shop now <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/categories" id="hero-browse-categories" className="btn btn--outline btn--lg">
                Browse categories
              </Link>
            </div>
            {categories.data && (
              <dl className="hero__stats">
                <div>
                  <dt>Products</dt>
                  <dd>{categories.data.reduce((sum, category) => sum + category.productCount, 0)}</dd>
                </div>
                <div>
                  <dt>Categories</dt>
                  <dd>{categories.data.length}</dd>
                </div>
                <div>
                  <dt>Returns window</dt>
                  <dd>30 days</dd>
                </div>
              </dl>
            )}
          </div>
          <div className="hero__visual">
            <img src={HERO_IMAGE} alt="Shoppers carrying colourful shopping bags" className="hero__image" />
          </div>
        </div>
      </section>

      <section className="perks container" aria-label="Why shop with us">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="perk">
            <span className="perk__icon" aria-hidden="true">
              <Icon size={22} />
            </span>
            <div>
              <h3 className="perk__title">{title}</h3>
              <p className="perk__text">{text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="section container" aria-labelledby="home-categories-title">
        <SectionHeader
          id="home-categories-title"
          title="Shop by category"
          subtitle="Find exactly what you are looking for"
          linkTo="/categories"
          linkLabel="All categories"
        />
        {categories.isLoading && <Spinner />}
        {categories.error && <ErrorMessage message={categories.error} onRetry={categories.reload} />}
        {categories.data && (
          <div className="category-grid">
            {categories.data.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      <section className="section container" aria-labelledby="home-featured-title">
        <SectionHeader
          id="home-featured-title"
          title="Featured products"
          subtitle="Hand-picked favourites from our collection"
          linkTo="/shop?featured=true"
          linkLabel="View all"
        />
        {featured.isLoading && <Spinner />}
        {featured.error && <ErrorMessage message={featured.error} onRetry={featured.reload} />}
        {featured.data && <ProductGrid id="featured-products" products={featured.data.items} />}
      </section>

      <section className="container" aria-labelledby="promo-title">
        <div className="promo-banner">
          <div>
            <span className="eyebrow eyebrow--light">Limited time</span>
            <h2 id="promo-title" className="promo-banner__title">
              Up to 20% off selected items
            </h2>
            <p>Upgrade your everyday essentials with our best deals of the season.</p>
          </div>
          <Link to="/shop?sort=price_asc" id="promo-shop-deals" className="btn btn--light btn--lg">
            Shop the deals
          </Link>
        </div>
      </section>
    </>
  );
}
