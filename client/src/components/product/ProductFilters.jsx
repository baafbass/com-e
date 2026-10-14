import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Sidebar filters. `filters` holds the current URL values; `onChange` receives a partial update.
 */
export default function ProductFilters({ categories, filters, onChange, onClear }) {
  const [price, setPrice] = useState({ minPrice: filters.minPrice, maxPrice: filters.maxPrice });

  useEffect(() => {
    setPrice({ minPrice: filters.minPrice, maxPrice: filters.maxPrice });
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceChange = (event) => setPrice((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const applyPrice = (event) => {
    event.preventDefault();
    onChange(price);
  };

  return (
    <aside className="filters" aria-label="Product filters">
      <div className="filters__header">
        <h2 className="filters__title">Filters</h2>
        <button type="button" id="clear-filters" className="btn btn--ghost btn--sm" onClick={onClear}>
          <RotateCcw size={14} aria-hidden="true" /> Clear all
        </button>
      </div>

      <fieldset className="filters__group">
        <legend className="filters__legend">Category</legend>
        <label className="choice" htmlFor="category-all">
          <input
            type="radio"
            id="category-all"
            name="category"
            value=""
            checked={!filters.category}
            onChange={() => onChange({ category: '' })}
          />
          <span>All categories</span>
        </label>
        {categories.map((category) => (
          <label key={category.id} className="choice" htmlFor={`category-${category.slug}`}>
            <input
              type="radio"
              id={`category-${category.slug}`}
              name="category"
              value={category.slug}
              checked={filters.category === category.slug}
              onChange={() => onChange({ category: category.slug })}
            />
            <span>{category.name}</span>
            <small className="choice__count">{category.productCount}</small>
          </label>
        ))}
      </fieldset>

      <form className="filters__group" id="price-filter-form" onSubmit={applyPrice}>
        <fieldset>
          <legend className="filters__legend">Price range ($)</legend>
          <div className="filters__price">
            <label htmlFor="min-price" className="visually-hidden">
              Minimum price
            </label>
            <input
              type="number"
              id="min-price"
              name="minPrice"
              className="input"
              placeholder="Min"
              min={0}
              step="any"
              value={price.minPrice}
              onChange={handlePriceChange}
            />
            <span aria-hidden="true">–</span>
            <label htmlFor="max-price" className="visually-hidden">
              Maximum price
            </label>
            <input
              type="number"
              id="max-price"
              name="maxPrice"
              className="input"
              placeholder="Max"
              min={price.minPrice || 0}
              step="any"
              value={price.maxPrice}
              onChange={handlePriceChange}
            />
          </div>
          <button type="submit" id="apply-price-filter" className="btn btn--outline btn--sm btn--block">
            Apply price
          </button>
        </fieldset>
      </form>

      <fieldset className="filters__group">
        <legend className="filters__legend">Availability</legend>
        <label className="choice" htmlFor="in-stock-only">
          <input
            type="checkbox"
            id="in-stock-only"
            name="inStock"
            checked={filters.inStock === 'true'}
            onChange={(event) => onChange({ inStock: event.target.checked ? 'true' : '' })}
          />
          <span>In stock only</span>
        </label>
        <label className="choice" htmlFor="featured-only">
          <input
            type="checkbox"
            id="featured-only"
            name="featured"
            checked={filters.featured === 'true'}
            onChange={(event) => onChange({ featured: event.target.checked ? 'true' : '' })}
          />
          <span>Featured only</span>
        </label>
      </fieldset>
    </aside>
  );
}
