import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      id={`category-card-${category.slug}`}
      className="category-card"
      aria-label={`${category.name}, ${category.productCount} products`}
    >
      <ProductImage src={category.imageUrl} alt="" className="category-card__image" />
      <div className="category-card__overlay">
        <h3 className="category-card__title">{category.name}</h3>
        <p className="category-card__count">
          {category.productCount} products <ArrowRight size={14} aria-hidden="true" />
        </p>
      </div>
    </Link>
  );
}
