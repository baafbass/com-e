import { categoriesApi } from '../api';
import CategoryCard from '../components/product/CategoryCard';
import ErrorMessage from '../components/ui/ErrorMessage';
import Spinner from '../components/ui/Spinner';
import { useAsync } from '../hooks/useAsync';

export default function CategoriesPage() {
  const { data: categories, isLoading, error, reload } = useAsync(() => categoriesApi.list(), []);

  return (
    <div className="container page">
      <header className="page-header page-header--center">
        <h1 className="page-title">Shop by category</h1>
        <p className="page-subtitle">Explore our collections and find something new.</p>
      </header>

      {isLoading && <Spinner />}
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {categories && (
        <div className="category-grid category-grid--large" id="categories-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
