import { SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categoriesApi, productsApi } from '../api';
import ProductFilters from '../components/product/ProductFilters';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import { useAsync } from '../hooks/useAsync';
import { PRODUCTS_PER_PAGE, SORT_OPTIONS } from '../utils/constants';

const FILTER_KEYS = ['search', 'category', 'minPrice', 'maxPrice', 'inStock', 'featured', 'sort', 'page'];

/** Keeps only non-empty values so the API and URL stay clean. */
const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== ''));

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [areFiltersOpen, setAreFiltersOpen] = useState(false);

  const filters = Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) ?? '']));
  const page = Number(filters.page) || 1;
  const queryKey = searchParams.toString();

  const categories = useAsync(() => categoriesApi.list(), []);
  const products = useAsync(
    () => productsApi.list({ ...compact(filters), page, limit: PRODUCTS_PER_PAGE }),
    [queryKey],
  );

  /** Merges changes into the URL. Any filter change resets pagination unless a page is given. */
  const updateFilters = (changes) => {
    const next = compact({ ...filters, page: '', ...changes });
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const changePage = (nextPage) => {
    updateFilters({ page: String(nextPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCategory = categories.data?.find((category) => category.slug === filters.category);
  const pageTitle = filters.search
    ? `Results for "${filters.search}"`
    : activeCategory?.name ?? 'All products';

  return (
    <div className="container page">
      <header className="page-header">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Home</Link> <span aria-hidden="true">/</span> <span aria-current="page">Shop</span>
        </nav>
        <h1 className="page-title">{pageTitle}</h1>
        {activeCategory?.description && <p className="page-subtitle">{activeCategory.description}</p>}
      </header>

      <div className="shop-layout">
        <div className={`shop-layout__sidebar ${areFiltersOpen ? 'shop-layout__sidebar--open' : ''}`}>
          <button
            type="button"
            className="icon-btn shop-layout__close"
            aria-label="Close filters"
            onClick={() => setAreFiltersOpen(false)}
          >
            <X size={20} />
          </button>
          <ProductFilters
            categories={categories.data ?? []}
            filters={filters}
            onChange={updateFilters}
            onClear={clearFilters}
          />
        </div>

        <section className="shop-layout__results" aria-label="Products">
          <div className="toolbar">
            <button
              type="button"
              id="open-filters"
              className="btn btn--outline btn--sm toolbar__filters-btn"
              onClick={() => setAreFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} aria-hidden="true" /> Filters
            </button>
            <p className="toolbar__count" aria-live="polite">
              {products.data ? `${products.data.pagination.total} products found` : 'Loading products...'}
            </p>
            <label htmlFor="sort-select" className="toolbar__sort">
              <span>Sort by</span>
              <select
                id="sort-select"
                name="sort"
                className="input select"
                value={filters.sort || 'newest'}
                onChange={(event) => updateFilters({ sort: event.target.value })}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {products.isLoading && <Spinner />}
          {products.error && <ErrorMessage message={products.error} onRetry={products.reload} />}

          {products.data && products.data.items.length === 0 && (
            <EmptyState
              icon={SearchX}
              title="No products found"
              message="Try a different search term or remove some filters."
              action={
                <button type="button" id="empty-clear-filters" className="btn btn--primary" onClick={clearFilters}>
                  Clear filters
                </button>
              }
            />
          )}

          {products.data && products.data.items.length > 0 && (
            <>
              <ProductGrid products={products.data.items} />
              <Pagination page={page} totalPages={products.data.pagination.totalPages} onPageChange={changePage} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
